<!-- 店铺头部数据（条幅和店铺分类） @zjf-2020-01-04 -->
<template>
    <div class="sld_store_header">
        <div class="container">
            <div class="ld left">
                <router-link tag="a" class="sld_img_center fl" :to="`/index`">
                    <img :src="configInfo.main_site_logo" :onerror='defaultImg' alt />
                </router-link>
                <span class="fl line"></span>
                <div class="sld_store_rate fl">
                    <p class="name">{{storeData.info.storeName}}</p>
                    <p class="rate">{{L['综合评分']}}：<em>{{storeData.info.comprehensiveScore}}</em> <i class="sld_sjx"></i>
                    </p>
                    <div class="sld_store_info_more">
                        <div class="top clearfix">
                            <div class="fl">
                                <h4>{{L['店铺评分']}}</h4>
                                <p>{{L['描述相符']}}：{{storeData.info.descriptionScore}}</p>
                                <p>{{L['服务态度']}}：{{storeData.info.serviceScore}}</p>
                                <p>{{L['发货速度']}}：{{storeData.info.deliverScore}}</p>
                            </div>
                            <div class="fr flex_row_center_center">
                                <img :src="storeData.info.storeLogoUrl" alt="">
                            </div>
                        </div>
                        <div class="center">
                            <p>{{L['服务承诺']}}：<a href="JavaScript:;">{{L['正品保障']}}</a></p>
                            <p>{{L['客服电话']}}：{{storeData.info.servicePhone}}</p>
                            <p>{{'主营商品'}}：{{storeData.info.mainBusiness?storeData.info.mainBusiness.replace(/(.*),/,'$1。').replace(/,/g,'、')
                                : '--'}}</p>
                            <p>{{L['联系客服']}}：
                                <a class="kefu" href="javascript:void(0)" @click="kefu" style="cursor: pointer;">
                                    <!-- <i class="iconfont"></i> -->
                                    <img src="@/assets/goods/server.png" alt="">
                                </a>
                            </p>
                        </div>
                        <div class="bottom">
                            <router-link :to="`/store/index?vid=${vid}`" class="go_store_btn">
                                {{L['店铺首页']}}
                            </router-link>
                        </div>
                    </div>
                </div>
                <div class="sld_store_follow" @click="followStore" v-if="loginFlag">
                    {{storeData.info.isFollow=="true"?'取消关注':'关注'}}</div>
            </div>
            <div class="search_wrap clearfix">
                <form class="fl" action="javascript:void(0)" method="get">
                    <input type="text" v-model="keyword" class="text" :placeholder="L['请输入关键词']" autocomplete="off"
                        style="color:rgb(153,153,153);" ref="searchInput" @focus="inputFocus" @input="inputChange"
                        @blur="inputBlur">
                    <input type="submit" :value="L['搜索']" class="button" @click="search">
                </form>

                <input type="submit" :value="L['搜本店']" class="button fl" @click="searchStore('keyword')"
                    style="background: #333">

                <div class="search_association" id="searchA" v-show="SAList.length&&SAShow">
                    <div class="s_a_item" v-for="(item,index) in SAList" :key="index"
                        @mousedown="searchStore('associ',item.wordsContent)">
                        <!-- 因为click事件与blur事件冲突，blur事件优先，于是换成mousedown -->
                        <div>{{item.wordsContent}}</div>
                        <div>{{item.searchGoodsNum}}个商品</div>
                    </div>
                </div>
            </div>

            <div class="sld_cart_wrap">
                <dl class="">
                    <dt class="ld cart_icon_text_wrap" style="border-bottom: 1px solid rgb(239, 239, 239);">
                        <span class="iconfont icon-gouwuche"></span>
                        <router-link target="_blank" :to="`/cart/index`">
                            {{L['我的购物车']}}
                        </router-link>
                        <!-- 没有商品显示0 -->
                        <div class="cart_goods_num">{{cartData.data.availableCartNum ? cartData.data.availableCartNum :
                            0}}</div>
                    </dt>
                    <dd class="cart_more_view">
                        <cart-model></cart-model>
                    </dd>
                </dl>
            </div>
        </div>
        <div class="sld_store_label_nav_wrap">
            <div class="sld_store_label_wrap">
                <img :src="storeData.info.storeBannerPcUrl?storeData.info.storeBannerPcUrl:defaultStoreBanner" alt=""
                    :onerror="defaultStoreBanner">
            </div>
            <div class="sld_store_nav">
                <ul class="clearfix">
                    <li class="sld_all_store_cat">
                        <p class="all_type" style="font-weight:bold;"><span>{{L['本店全部分类']}}</span> <i
                                class="iconfont"></i></p>
                        <ul class="sld_store_first_cat">
                            <li v-for="(item,index) in storeData.cat" :key="index">
                                <router-link :to="`/store/goods?vid=${vid}&categoryId=${item.innerLabelId}`">
                                    {{item.innerLabelName}}
                                    <i v-if="item.children.length" class="iconfont fr"></i>
                                </router-link>
                                <ul class="sld_store_second_cat" v-if="item.children.length">
                                    <li v-for="(item_child,index_child) in item.children" :key="index_child">
                                        <router-link
                                            :to="`/store/goods?vid=${vid}&categoryId=${item_child.innerLabelId}`">
                                            {{item_child.innerLabelName}}
                                        </router-link>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                    <ul class="sld_store_cat_horizontal">
                        <li>
                            <router-link :to="`/store/index?vid=${vid}`">
                                {{L['首页']}}
                            </router-link>
                        </li>
                        <li>
                            <router-link :to="`/store/goods?vid=${vid}`">{{L['所有商品']}}</router-link>
                        </li>
                        <li v-for="(item,index) in storeData.cat" :key="index">
                            <router-link :to="`/store/goods?vid=${vid}&categoryId=${item.innerLabelId}`">
                                {{item.innerLabelName}}
                            </router-link>
                        </li>
                    </ul>
                    <!-- 分割线 -->
                    <div class="search_line"></div>
                    <!-- 搜索框 start -->
                    <div class="search_modle flex_row_center_center">
                        <input type="text" v-model="keywordStore" class="search_input" :placeholder="L['请输入...']"
                            @keyup.enter="searchStore('keywordStore')">
                        <span class="search_input_button" @click="searchStore('keywordStore')">{{L['搜索']}}</span>
                    </div>
                    <!-- 搜索框 end -->
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import { reactive, getCurrentInstance, ref, watchEffect, onMounted } from 'vue';
    import { useRouter, useRoute } from "vue-router";
    import { useStore } from 'vuex';
    import CartModel from '@/components/CartModel';

    export default {
        name: 'StoreHeaderCat',
        components: { CartModel },
        setup(props, { emit }) {
            const defaultStoreBanner = 'this.src="' + require('../../assets/default_store_banner.png') + '"';
            const router = useRouter();
            const route = useRoute()
            const vid = ref('');
            const storeData = reactive({ cat: [], info: {} });//店铺数据，cat：店铺分类，info：店铺基本信息
            const { proxy } = getCurrentInstance();
            const L = proxy.$getCurLanguage();
            const keyword = ref(route.query != undefined && route.query.keyword != undefined && route.query.keyword ? route.query.keyword : '');
            const keywordStore = ref('')
            const store = useStore();
            const loginFlag = ref(store.state.loginFlag)
            const cartData = reactive({ data: {} }); //获取vux的store中的购物车数据
            const configInfo = ref(store.state.configInfo)
            const defaultImg = ref('this.src="' + require('../../assets/common_top_logo.png') + '"')
            const SAList = ref([])
            const SAShow = ref(false)
            onMounted(() => {
                cartData.data = store.state.cartListData;
            })
            //获取店铺基本信息
            const getStoreInfoBaseInfo = () => {
                proxy.$get('v3/seller/front/store/detail', { storeId: vid.value }).then(res => {
                    if (res.state == 200) {
                        storeData.info = res.data;
                        storeData.info.storeAverageScore = ((res.data.deliverScore * 1 + res.data.descriptionScore * 1 + res.data.serviceScore * 1) / 3).toFixed(1);
                    }
                })
            }
            //获取店铺分类数据
            const getStoreCatData = () => {
                proxy.$get('v3/seller/front/store/storeCategory', { storeId: vid.value }).then(res => {
                    if (res.state == 200) {
                        storeData.cat = res.data;
                    }
                })
            }

            const inputFocus = () => {
                proxy.$refs.searchInput.style.color = '#333'
                SAShow.value = true
                if (keyword.value && SAList.value.length == 0) {
                    searchAssociation(keyword.value)
                }
            }


            watchEffect(() => {
                let tmpRoute = router.currentRoute.value;
                if (tmpRoute.query.keyword != undefined) {
                    keyword.value = tmpRoute.query.keyword;
                } else {
                    keyword.value = '';
                }
                if (tmpRoute.fullPath.indexOf('/goods/detail') > -1) {
                    if (tmpRoute.query != undefined && tmpRoute.query.productId != undefined && tmpRoute.query.productId) {
                        //需要根据商品id获取店铺id
                        proxy
                            .$get("v3/goods/front/goods/details", { productId: tmpRoute.query.productId })
                            .then((res) => {
                                if (res.state == 200) {
                                    vid.value = res.data.storeInf.storeId;
                                    getStoreInfoBaseInfo();
                                    getStoreCatData();
                                }
                            })
                    }
                }
                if (tmpRoute.fullPath.indexOf('/store/') > -1) {
                    if (tmpRoute.query != undefined && tmpRoute.query.vid != undefined && tmpRoute.query.vid) {
                        vid.value = tmpRoute.query.vid;
                        proxy.$sldStatEvent({ behaviorType: 'spv', storeId: vid.value });
                        getStoreInfoBaseInfo();
                        getStoreCatData();
                    }
                }
                cartData.data = store.state.cartListData;
            });
            //搜索事件(搜全站)
            const search = () => {
                if (keyword.value) {
                    router.push({ path: `/goods/list`, query: { keyword: keyword.value } })
                }
                keyword.value = '';
            }
            //搜索事件(搜本站)
            const searchStore = (type, arg) => {
                if (type == 'keywordStore') {
                    router.push({ path: `/store/goods`, query: { keyword: keywordStore.value, vid: vid.value } })
                    keywordStore.value = '';
                } else if (type == 'keyword') {
                    router.push({ path: `/store/goods`, query: { keyword: keyword.value, vid: vid.value } })
                    keyword.value = '';
                } else {
                    router.push({ path: `/goods/list`, query: { keyword: arg, vid: vid.value } })
                    keyword.value = '';
                }
            }
            if (vid.value) {
                getStoreInfoBaseInfo();
                getStoreCatData();
            }
            const kefu = () => {
                let chatInfo = {
                    storeId: storeData.info.storeId,
                    vendorAvatar: storeData.info.storeLogoUrl,
                    storeName: storeData.info.storeName,
                    source: '从店铺详情页进入'
                }
                store.commit('saveChatBaseInfo', chatInfo)


                let newWin = router.resolve({
                    path: '/service',
                    query: {
                        vid: storeData.info.storeId
                    }
                })

                window.open(newWin.href, "_blank")
            }

            const followStore = () => {
                //关注店铺及取消关注
                if (store.state.loginFlag) {
                    //已登录
                    let params = {
                        storeIds: storeData.info.storeId,
                        isCollect: !eval(storeData.info.isFollow),
                    };
                    proxy.$post("v3/member/front/followStore/edit", params).then((res) => {
                        if (res.state == 200) {
                            storeData.info.isFollow = !eval(storeData.info.isFollow) ? "true" : "false";
                            emit('updateFllow', { state: storeData.info.isFollow });
                            if (storeData.info.isFollow) {
                                proxy.$sldStatEvent({ behaviorType: 'fol', storeId: storeData.info.storeId });
                            }
                        }
                    });
                }
            }

            const searchAssociation = (input) => {
                proxy.$get('v3/goods/front/goods/searchWords/list', {
                    keyWord: input
                }).then(res => {
                    if (res.state == 200) {
                        SAList.value = res.data
                    }
                })
            }

            const inputChange = (e) => {
                let input = e.target.value
                SAShow.value = true

                if (input) {
                    searchAssociation(input)
                } else {
                    SAList.value = []
                }
            }

            const inputBlur = () => {
                SAShow.value = false
            }

            return {
                L, storeData, vid, keyword, search, searchStore, cartData, kefu, defaultStoreBanner, configInfo,
                defaultImg, followStore, loginFlag, keywordStore, inputFocus, inputChange, SAList, SAShow
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../style/store/storeHeader.scss";

    .kefu {
        img {
            width: 16px;
            height: 16px;
            vertical-align: middle;
        }
    }

    .sld_store_follow {
        position: relative;
        float: left;
        margin-left: 15px;
        padding: 7px 9px;
        border-radius: 15px;
        margin-top: 38px;
        color: #fff;
        background-color: $colorMain;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        cursor: pointer;
    }

    input::placeholder {

        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgb(153, 153, 153);
    }

    ::-webkit-input-placeholder {

        margin-left: 20px;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgb(153, 153, 153);
    }

    /* 使用webkit内核的浏览器 */
    :-moz-placeholder {

        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgb(153, 153, 153);
    }

    /* Firefox版本19+ */
    :-ms-input-placeholder {
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgb(153, 153, 153);
    }

    /* IE浏览器 */
</style>