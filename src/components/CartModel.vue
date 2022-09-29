<!--
 * @Author: luojiping
 * @Date: 2020/1/9 14:28
 * @LastEditTime: 2020/1/15 19:47
 * @LastEditors: Please set LastEditors
 * @Description: 公共顶部的购物车弹框
 * @FilePath: /java-pc/src/views/store/storeHeaderCat.vue  || /java-pc/src/components/MemberTop.vue || /java-pc/src/components/SldHomeTopSearch.vue
-->
<template>
    <div class="sld_cart_model">
        <!-- 没有商品显示空提示 -->
        <div class="empty_cart"
            v-if="!cartData.data || JSON.stringify(cartData.data) == '{}' || cartData.data.storeCartGroupList.length == 0">
            <div class="empty_cart_line"></div>
            <div class="empty_cart_txt">
                <img src="../assets/member/no_goods.png" alt />
                {{L['购物车中还没有商品，赶紧选购吧']}}
            </div>
        </div>
        <!-- 有数据 -->
        <div class="cart_data" v-else>
            <div class="cart_data_title">{{L['最新加入的商品']}}</div>
            <div class="cart_list">
                <template v-for="(storeItem,storeIndex) in cartData.data.storeCartGroupList" :key="storeIndex">
                    <template v-for="(promotItem,promotIndex) in storeItem.promotionCartGroupList" :key="promotIndex">
                        <div class="cart_list_pre flex_row_between_center"
                            v-for="(cartItem,cartIndex) in promotItem.cartList" :key="cartIndex">
                            <div class="cart_pre_left flex_row_start_center" @click="goGoodsDetail(cartItem.productId)">
                                <div class="cart_pre_img">
                                    <img :src="cartItem.productImage" alt="">
                                </div>
                                <div class="cart_pre_cen flex_column_start_start">
                                    <p class="cart_pre_name">{{cartItem.goodsName}}</p>
                                    <p class="cart_pre_spec">{{cartItem.specValues}}</p>
                                </div>
                            </div>
                            <div class="cart_pre_right flex_column_center_end">
                                <div class="cart_pre_price">{{cartItem.productPrice}} * {{cartItem.buyNum}}</div>
                                <div class="cart_pre_del" @click="delCartGoods(cartItem)">{{L['删除']}}</div>
                            </div>
                        </div>
                    </template>
                </template>
            </div>
            <div class="cart_bottom flex_row_between_center">
                <div class="cart_bottom_left flex_row_start_center">
                    <span>{{L['共']}} <font color="#e22319">{{cartData.data.availableCartNum}}</font> {{L['件商品']}}</span>
                </div>
                <router-link target="_blank" :to="`/cart/index`" class="cart_bottom_right">{{L['去购物车']}}</router-link>
            </div>
        </div>
    </div>
</template>

<script>
    import { reactive, ref, getCurrentInstance, onMounted, watchEffect } from "vue";
    import { useStore } from 'vuex';
    import { ElMessage } from "element-plus";
    export default {
        name: 'CartModel',
        setup() {
            const { proxy } = getCurrentInstance();
            const L = proxy.$getCurLanguage();
            const store = useStore();
            const cartData = reactive({ data: {} }); //获取vux的store中的购物车数据
            const delGoodsCartIds = ref(''); //删除商品的id
            onMounted(() => {
                cartData.data = store.state.cartListData;
            })
            watchEffect(() => {
                cartData.data = store.state.cartListData;
                store.commit("updateCartListData", cartData.data);
            })
            //删除商品 curCartItem: 当前商品信息
            const delCartGoods = (curCartItem) => {
                if (store.state.loginFlag) {
                    //已登录
                    delGoodsCartIds.value = curCartItem.cartId;
                } else {
                    //未登录
                    delGoodsCartIds.value = curCartItem.goodsId;
                }
                confirmDelGoodsModel();
            };
            //确定删除商品
            const confirmDelGoodsModel = () => {
                if (store.state.loginFlag) {
                    // 已登录
                    let params = {
                        cartIds: delGoodsCartIds.value,
                    };
                    proxy
                        .$post("v3/business/front/cart/deleteCarts", params)
                        .then((res) => {
                            if (res.state == 200) {
                                cartData.data = res.data;
                                ElMessage.success(L["删除成功！"]);
                                proxy.$getLoginCartListData();
                            } else {
                                ElMessage.error(res.msg);
                            }
                        });
                } else {
                    // 未登录
                    //单个商品删除
                    cartData.data.storeCartGroupList.map((storeItem, storeIndex) => {
                        storeItem.promotionCartGroupList.map((promotItem) => {
                            promotItem.cartList.map((cartItem, cartIndex) => {
                                if (cartItem.goodsId == delGoodsCartIds.value) {
                                    promotItem.cartList.splice(cartIndex, 1);
                                }
                            });
                            if (promotItem.cartList.length == 0) {
                                storeItem.promotionCartGroupList = [];
                            }
                            if (storeItem.promotionCartGroupList.length == 0) {
                                cartData.data.storeCartGroupList.splice(storeIndex, 1);
                            }
                        });
                    });
                    ElMessage.success(L["删除成功！"]);
                    store.commit("updateCartListData", cartData.data);
                    proxy.$cartDataNum(cartData.data);
                }
            };
            //去商品详情页
            const goGoodsDetail = (productId) => {
                proxy.$goGoodsDetail(productId)
            }

            return {
                L,
                cartData,
                delGoodsCartIds,
                delCartGoods,
                goGoodsDetail
            }
        }
    }
</script>

<style lang="scss" scoped>
    .sld_cart_model {
        .empty_cart {
            width: 100%;
            position: relative;

            .empty_cart_line {
                position: absolute;
                width: 163px;
                right: 0;
                height: 2px;
                top: -2px;
                z-index: 999;
                background: #fff;
            }

            .empty_cart_txt {
                padding: 10px;
                color: #999;
            }
        }

        .cart_data {
            max-height: 300px;
            display: flex;
            flex-direction: column;
            position: relative;

            .cart_data_title {
                font-weight: 600;
                float: left;
                padding: 7px;
                line-height: 32px;
                height: 32px;
            }

            .cart_list {
                padding: 20px;
                overflow-y: scroll;

                .cart_list_pre {
                    margin-bottom: 20px;

                    .cart_pre_left {
                        .cart_pre_img {
                            width: 48px;
                            height: 48px;
                            border: 1px solid #e3e3e3;
                            cursor: pointer;

                            img {
                                width: 100%;
                                height: 100%;
                            }
                        }

                        .cart_pre_cen {
                            width: 150px;
                            margin-left: 20px;
                            cursor: pointer;

                            .cart_pre_name {
                                word-break: break-all;
                                text-overflow: ellipsis;
                                display: -webkit-box;
                                -webkit-box-orient: vertical;
                                -webkit-line-clamp: 2;
                                overflow: hidden;
                            }

                            .cart_pre_spec {
                                word-break: break-all;
                                overflow: hidden;
                                width: 150px;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                margin-top: 5px;
                            }
                        }
                    }

                    .cart_pre_right {
                        .cart_pre_price {
                            color: #666;
                        }

                        .cart_pre_del {
                            color: #666;
                            cursor: pointer;
                            margin-top: 10px;

                            &:hover {
                                color: $colorMain;
                            }
                        }
                    }
                }
            }

            .cart_bottom {
                width: 100%;
                height: 44px;
                border: 1px solid #e3e3e3;

                .cart_bottom_left {
                    padding-left: 11px;
                    height: 44px;

                    span {
                        color: #666;

                        &:nth-child(2) {
                            margin-left: 5px;
                        }
                    }
                }

                .cart_bottom_right {
                    width: 110px;
                    height: 44px;
                    text-align: center;
                    color: #fff;
                    background-color: $colorMain2;
                    line-height: 44px;
                    cursor: pointer;
                }
            }
        }
    }
</style>