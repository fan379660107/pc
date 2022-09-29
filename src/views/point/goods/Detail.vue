// 商品详情页面
<template>
    <DetailStoreHeader :storeId="vid" />
    <div class="sld_goods_detail">
        <!-- 内容区顶部固定 end -->
        <div class="goods_detail_content" v-if="goodsDetail.data">
            <!-- 商品所属分类 ，联系客服，关注店铺 start-->
            <div class="goods_about_con">
                <div class="goods_about flex_row_between_center">
                    <div class="goods_classify">
                    </div>
                    <div class="goods_about_right flex_row_between_center">
                        <router-link target="_blank" :to="`/store/index?vid=${goodsDetail.data.storeInfo.storeId}`"
                            class="goods_about_store flex_row_between_center" v-if="goodsDetail.data.storeInfo">
                            <span>{{ goodsDetail.data.storeInfo.storeName }}</span>
                            <span v-if="
                  goodsDetail.data.storeInfo &&
                  goodsDetail.data.storeInfo.isOwnStore == '1'
                ">{{ L["自营"] }}</span>
                        </router-link>

                        <div class="contact_service focus_store" @click="focusStore" v-if="goodsDetail.data.storeInfo">
                            <img src="@/assets/goods/collection.png" alt=""
                                v-show="goodsDetail.data.storeInfo.isFollowStore == true" />
                            <img src="@/assets/goods/no_collection.png" alt=""
                                v-show="goodsDetail.data.storeInfo.isFollowStore == false" />
                            <span>
                                {{
                                goodsDetail.data.storeInfo.isFollowStore
                                ? L["已关注"]
                                : L["关注店铺"]
                                }}
                            </span>

                        </div>
                    </div>
                </div>
            </div>
            <!-- 商品所属分类 ，联系客服，关注店铺 end-->
            <!-- 商品主要信息 start -->
            <div class="main_con">
                <!-- 商品相关 start -->
                <div class="goods_des">
                    <!-- 商品图片列表 start -->
                    <div class="goods_des_left">
                        <!-- 商品放大镜效果 start-->
                        <div class="goods_main_picture">
                            <div class="preview-box" @mousemove="move($event)" @mouseleave="out($event)"
                                @mouseenter="enter($event)" ref="previewBox">
                                <div :class="{default_image: true,skeleton_default_image: firstLoading,}"
                                    :style="{ backgroundImage: 'url(' + defaultImage + ')' }">

                                    <video v-if="currentDefaultImage == -1&&goodsDetail.data.goodsVideo" controls
                                        playsinline="playsinline" class="imageBorder default_image"
                                        :poster="defaultImage" autoplay ref="video">
                                        <source :src="goodsDetail.data.goodsVideo" type="video/mp4" />
                                    </video>

                                </div>
                                <div class="v_btn" v-if="currentDefaultImage != -1&&goodsDetail.data.goodsVideo">
                                    <img src="@/assets/goods/playV.png" alt="" @click="playV">
                                </div>
                                <!-- 遮罩 start-->
                                <div class="mask" ref="maskBox" v-show="maskShow"></div>
                                <!-- 遮罩 end -->
                                <!-- 底部放大镜icon图标 start -->
                                <div class="magnifier_icon flex_row_center_center" v-show="!maskShow">
                                    <i class="iconfont icon-sousuo"></i>
                                </div>
                                <!-- 底部放大镜icon图标 end -->
                            </div>
                            <!-- 右侧的放大后的图片 start -->
                            <div class="goods_picture_big" ref="zoomBox" v-show="maskShow">
                                <div class="default_image_big" :style="{ backgroundImage: 'url(' + defaultImage + ')' }"
                                    ref="pictureBig"></div>
                            </div>
                            <!-- 右侧的放大后的图片 end -->
                        </div>
                        <!-- 商品放大镜效果 end -->

                        <!-- 商品图片列表 start -->
                        <div :class="{
                goods_picture_con: true,
                flex_row_between_center: true,
                skeleton_goods_picture_con: firstLoading,
              }" v-if="
                goodsDetail.data.defaultProduct &&
                goodsDetail.data.defaultProduct.goodsPics &&
                goodsDetail.data.defaultProduct.goodsPics.length > 0
              ">
                            <i class="iconfont icon-ziyuan2 left_arrow"
                                :class="{ no_left_arrow: currentDefaultImage == 0 }"
                                @click="switchDefaultImage('left')"></i>
                            <div class="show_box">
                                <ul class="goods_picture_list flex_row_start_center" ref="goodsPictureList">
                                    <li v-for="(goodsImgItem, goodsImgIndex) in goodsDetail.data
                      .defaultProduct.goodsPics" :key="goodsImgIndex" class="goods_img" :class="{
                      goods_img_active: currentDefaultImage == goodsImgIndex,
                    }" @click="selectDefaultImage(goodsImgItem, goodsImgIndex)"
                                        @mouseover="selectDefaultImage(goodsImgItem, goodsImgIndex)">
                                        <div class="goods_image"
                                            :style="{ backgroundImage: 'url(' + goodsImgItem + ')' }"></div>
                                    </li>
                                </ul>
                            </div>
                            <i class="iconfont icon-ziyuan11 right_arrow" :class="{
                  no_left_arrow:
                    currentDefaultImage ==
                    goodsDetail.data.defaultProduct.goodsPics.length - 1,
                }" @click="switchDefaultImage('right')"></i>
                        </div>
                        <!-- 商品图片列表 end -->
                        <!-- 商品分享和收藏 start -->
                        <div class="collection_share_btn flex_row_start_start" v-if="goodsDetail.data.state == 3">
                            <div class="share_btn">
                                <div class="share_btn_con flex_row_start_center">
                                    <img src="@/assets/goods/share.png" alt="" />
                                    <span>{{ L["分享"] }}</span>
                                </div>
                                <div class="share_list">
                                    <div class="share_btn_pre flex_row_start_center cursor_pointer">
                                        <img src="@/assets/goods/share.png" alt="" />
                                        <span>{{ L["分享"] }}</span>
                                    </div>
                                    <div class="share_btn_pre flex_row_start_center cursor_pointer"
                                        @click="share('qzone')">
                                        <img src="@/assets/goods/qq_share.png" alt="" />
                                        <span>{{ L["QQ"] }}</span>
                                    </div>
                                    <div class="share_btn_pre flex_row_start_center cursor_pointer"
                                        @click="share('sina')">
                                        <img src="@/assets/goods/sina_share.png" alt="" />
                                        <span>{{ L["新浪"] }}</span>
                                    </div>
                                    <div class="share_btn_pre flex_row_start_center cursor_pointer"
                                        @click="share('weixin')" @mouseover="share('weixin')">
                                        <img src="@/assets/goods/wx_share.png" alt="" />
                                        <span>{{ L["微信"] }}</span>
                                    </div>
                                    <div class="wx_share_code flex_column_center_center" v-if="wxShareCode">
                                        <div id="share_wx_qrcode" class="wx_share_code_img"></div>
                                        <p class="wx_share_code_title">{{L['分享到微信']}}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- 商品分享和收藏 end -->
                    </div>
                    <!-- 商品图片列表 end -->
                    <!-- 商品详细信息 start -->
                    <div class="m_item_inner">
                        <div class="item_info">
                            <div :class="{
                  detaile_name: true,
                  skeleton_detaile_name: firstLoading,
                }">
                                {{ goodsDetail.data.goodsName }}
                            </div>
                            <div :class="{ p_ad: true, skeleton_p_ad: firstLoading }"
                                v-if="goodsDetail.data.goodsBrief">
                                {{ goodsDetail.data.goodsBrief }}
                            </div>
                            <!-- 商品未下架即正常商品 start -->
                            <div v-if="goodsDetail.data.state == 3 || firstLoading">
                                <div class="summary">
                                    <div class="point_sales">已兑换 {{goodsDetail.data.sales}}</div>
                                    <div class="sld_summary_item summary_goods clearfix"
                                        v-if="goodsDetail.data.defaultProduct">
                                        <div class="sld_summary_goods_left">
                                            <div class="goods_price flex_row_start_center">
                                                <!-- 在售价 -->
                                                <span class="price_title1">{{ L["价格"] }}</span>
                                                <strong :class="{p_price: true,skeleton_p_price: firstLoading}">
                                                    <span>{{goodsDetail.data.defaultProduct.integralPrice}}积分</span>
                                                    <span>+</span>
                                                    <span>￥</span>
                                                    <span>{{goodsDetail.data.defaultProduct.cashPrice}}</span>
                                                </strong>
                                            </div>
                                        </div>
                                        <!-- 市场价 -->
                                        <div class="market_price" v-if="goodsDetail.data.defaultProduct.marketPrice>0">
                                            <span class="price_title1">原价</span>
                                            <span class="price">￥{{ goodsDetail.data.defaultProduct.marketPrice
                                                }}</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- 规格 start -->
                                <div class="goods_spec">
                                    <div class="goods_spec_pre flex_row_start_start"
                                        v-for="(specItem, specIndex) in goodsDetail.data.specs" :key="specIndex">
                                        <div class="goods_spec_pre_title" :title="specItem.specName">
                                            {{ specItem.specName }}
                                        </div>
                                        <div class="goods_spec_pre_list flex_row_start_center">
                                            <!-- checkState : 1-选中，2-可选，3-禁用 -->
                                            <!-- 禁止选择 -->
                                            <div class="specval_pre cursor_pointer"
                                                :class="{specval_pre_disabled: sepcValItem.checkState == '3',}"
                                                v-for="(sepcValItem, specValIndex) in specItem.specValueList"
                                                :key="specValIndex" v-show="sepcValItem.checkState == '3'">
                                                <div class="specval_pre_image"
                                                    :style="{backgroundImage: 'url(' + sepcValItem.image + ')',}"
                                                    :title="sepcValItem.specValue" v-if="sepcValItem.image"></div>
                                                <span class="specval_pre_text" v-else>{{ sepcValItem.specValue }}</span>
                                            </div>
                                            <!-- 可选择 -->
                                            <div class="specval_pre cursor_pointer" :class="{
                                            specval_pre_active: sepcValItem.checkState == '1',
                                          }" v-for="(
                                            sepcValItem, specValIndex
                                          ) in specItem.specValueList" :key="specValIndex" @click="
                                            selectSpecVal(
                                              'choice',
                                              specItem.specId,
                                              sepcValItem.specValueId
                                            )
                                          " v-show="sepcValItem.checkState != '3'">
                                                <div class="goods_image" :style="{
                                              backgroundImage: 'url(' + goodsImgItem + ')',
                                            }"></div>
                                                <div class="specval_pre_image" :style="{
                                              backgroundImage: 'url(' + sepcValItem.image + ')',
                                            }" :title="sepcValItem.specValue" v-if="sepcValItem.image"></div>
                                                <span class="specval_pre_text" v-else>{{ sepcValItem.specValue }}</span>
                                                <img src="@/assets/goods/check_mark.png" alt="" class="check_mark"
                                                    v-if="sepcValItem.checkState == '1'" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- 规格 end -->
                                <!-- 数量加减及库存 start -->
                                <div v-if="!firstLoading" class="quantity_inventory flex_row_start_center">
                                    <div class="quantity_title">{{ L["数量"] }}</div>
                                    <div class="quantity_edit flex_row_start_center">
                                        <span @click="editNum('reduce')" ref="reduce" :style="disStyle">-</span>
                                        <input type="number" v-model="currentSpecNum" @input="editNum('edit', $event)"
                                            @blur="editNum('blur',$event)" />
                                        <span @click="editNum('add')" ref="add">+</span>
                                    </div>
                                    <div class="inventory" v-if="
                      goodsDetail.data.defaultProduct &&
                      goodsDetail.data.defaultProduct.productStock
                    ">
                                        {{ L["库存"]
                                        }}{{ goodsDetail.data.defaultProduct.productStock }}件
                                    </div>
                                </div>
                                <!-- 数量加减及库存 end-->
                            </div>
                            <!-- 商品未下架即正常商品 end -->
                            <template v-if="!firstLoading">
                                <!-- 立即购买 加入购物车 收藏 ，分享 start-->

                                <!-- 商品已下架 start -->
                                <div class="options_btn" v-if="goodsDetail.data.state != 3">
                                    <p class="option_desc">商品已下架，欢迎挑选其他商品~</p>
                                    <div class="goods_off_shelves">{{ L["商品已下架"] }}</div>

                                    <!-- 商品下架时的推荐商品 start -->
                                    <div class="recoOffShop">
                                        <div class="reCon"
                                            v-for="({goodsImage,goodsName,cashPrice,defaultProductId},index) in recomOffShop.data"
                                            :key="index">
                                            <div class="reComImg">
                                                <router-link :to="`/goods/detail?productId=${defaultProductId}`"
                                                    target="_blank"> <img :src="goodsImage" alt="">
                                                </router-link>
                                            </div>
                                            <router-link class="recomName"
                                                :to="`/goods/detail?productId=${defaultProductId}`" target="_blank">
                                                {{goodsName}}
                                            </router-link>
                                            <span class="recomPrice">￥{{cashPrice}}</span>
                                        </div>
                                    </div>
                                    <!-- 商品下架时的推荐商品 end -->
                                </div>
                                <!-- 商品已下架 end -->

                                <!-- 商品库存不足 start -->
                                <div class="options_btn flex_row_between_center" v-else-if="
                    goodsDetail.data.defaultProduct != undefined &&
                    goodsDetail.data.defaultProduct.productStock == 0
                  ">
                                    <div class="goods_out_stock">{{ L["库存不足"] }}</div>
                                </div>
                                <!-- 商品库存不足 end -->

                                <!-- 普通正常商品 start -->
                                <div class="options_btn flex_row_start_center" v-else>
                                    <div class="buy_now flex_row_center_center" @click="goBuy">
                                        立即兑换
                                    </div>
                                </div>
                                <!-- 普通正常商品 end -->

                                <!-- 立即购买 加入购物车 收藏 ，分享 end-->
                            </template>
                        </div>
                    </div>
                    <!-- 商品详细信息 end -->
                    <!-- 相关推荐 start -->
                    <div class="more_goods" v-if="goodsDetail.data.state == 3">
                        <div class="more_goods_title">热门礼品</div>
                        <div class="more_goods_list flex_column_center_center">
                            <template v-if="firstLoading">
                                <div class="more_goods_pre" v-for="(recommendItem, recommendIndex) in [
                    { a: 1 },
                    { b: 2 },
                    { c: 3 },
                  ]" :key="recommendIndex" @click="goGoodsDetail(recommendItem.defaultProductId)">
                                    <div :class="{
                      more_goods_pre_img: true,
                      skeleton_more_goods_pre_img: firstLoading,
                    }"></div>
                                    <p :class="{
                      skeleton_more_goods_pre_goods_name: firstLoading,
                    }">
                                        {{ recommendItem.goodsName }}
                                    </p>
                                    <p>
                                        <span :class="{
                        skeleton_more_goods_pre_goods_price: firstLoading,
                      }"></span>
                                    </p>
                                </div>
                            </template>
                            <template v-else>
                                <div class="more_goods_pre"
                                    v-for="(recommendItem,recommendIndex) in recommendeList.data" :key="recommendIndex"
                                    v-show="recommendIndex < 3" @click="goGoodsDetail(recommendItem.defaultProductId)">
                                    <div class="more_goods_pre_img flex_row_center_center">
                                        <img :src="recommendItem.goodsImage" :title="recommendItem.goodsName" />
                                        <p class="price">{{recommendItem.integralPrice}}积分 +
                                            ￥{{recommendItem.cashPrice}}</p>
                                    </div>
                                    <p class="goodName">{{recommendItem.goodsName}}</p>

                                </div>
                            </template>
                        </div>
                    </div>
                    <!-- 相关推荐 end -->
                </div>
                <!-- 商品相关 end -->

                <!-- 店铺，及各种信息的切换 start -->
                <div class="container flex_row_start_start" ref="container">
                    <div class="left">
                        <!-- 店铺推荐及热门收藏 start -->
                        <div class="store_popular">
                            <div class="store_popular_btn flex_row_between_center">
                                <span>人气礼品</span>
                            </div>
                            <div class="store_popular_list">
                                <div class="store_popular_pre"
                                    v-for="(storePopularItem,storePopularIndex) in storePopularList.data"
                                    :key="storePopularIndex" @click="goGoodsDetail(storePopularItem.defaultProductId)">
                                    <div class="store_popular_img flex_row_center_center">
                                        <img :src="storePopularItem.goodsImage" :title="storePopularItem.goodsName" />
                                    </div>
                                    <p>{{storePopularItem.goodsName}}</p>
                                    <p>
                                        <span>{{ storePopularItem.integralPrice }}积分</span>
                                        <span>+￥{{ storePopularItem.cashPrice}}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <!-- 店铺推荐及热门收藏 end -->
                    </div>
                    <!-- 商品详情 评价 商品服务 店铺热销  start-->
                    <div class="goods_description">
                        <div class="goods_description_title flex_row_between_center">
                            <div class="description_title_left flex_row_start_center">
                                <span class="description_active">{{ L["商品详情"] }}</span>
                            </div>
                            <div class="description_title_right flex_row_end_center">
                                <div class="mobile_order flex_row_start_center cursor_pointer">
                                    <span>{{ L["手机下单"] }}</span>
                                    <div class="goods_code" id="qrcode"></div>
                                    <div class="mobile_order_model">
                                        <div class="model_goods_code" id="qrcodeBig">
                                        </div>
                                        <p>{{ L["手机下单"] }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="goods_description_con">
                            <!-- 商品详情,规格参数,及详情富文本 start-->
                            <div class="goods_des_con">
                                <div v-if="goodsDetail.data.goodsDetails">
                                    <div class="goods_html">
                                        <div class="goods_htmls" v-html="goodsDetail.data.goodsDetails"></div>
                                    </div>
                                </div>
                                <div v-else>
                                    <SldCommonEmpty :tip="L['该商品暂无详情~']" totalWidth="934px" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 商品主要信息 end -->
        </div>
        <SldLoginModal :visibleFlag="loginModalVisibleFlag" @closeLoingModal="closeLoingModal"
            @refreshInfo="refreshInfo" />
        <el-dialog v-model="imgVisible" width="70%" lock-sroll="false">
            <!-- :style="{backgroundImage: 'url(' + imgSource + ')',backgroundSize: '30%', height:'700px',backgroundPosition: 'top center', backgroundRepeat: 'no-repeat'}" -->
            <div style="height:700px;">
                <img :src="imgSource" alt="" class="imgOpen">
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { reactive, getCurrentInstance, ref, onMounted, provide, watch } from "vue";
    import { useRoute, useRouter } from "vue-router";
    import { ElMessage } from "element-plus";
    import { qrcanvas } from "qrcanvas";
    import DetailStoreHeader from "./DetailStoreHeader";
    import { useStore } from "vuex";
    import SldLoginModal from "../../../components/loginModal";
    import SldCommonEmpty from "../../../components/SldCommonEmpty";
    export default {
        name: "goods-detail",
        components: {
            DetailStoreHeader,
            SldLoginModal,
            SldCommonEmpty,
        },
        setup() {
            const firstLoading = ref(true); //是否第一次加载
            const router = useRouter();
            const route = useRoute();
            const store = useStore();
            const imgVisible = ref(false)
            const imgSource = ref('')
            const imgIndex = ref(-1)
            const vid = ref(0); //店铺id
            const { proxy } = getCurrentInstance();
            const L = proxy.$getCurLanguage();
            const goodsDetail = reactive({ data: {} }); //商品详情数据
            const isChoice = ref("default"); //是默认选中的,还是点击选择规格之后的  default:默认  choice:选择
            const productId = ref(""); //货品id
            const pictureBig = ref(null); //大图的信息
            const maskBox = ref(null); //遮罩盒子的信息
            const maskShow = ref(false); //遮罩是否显示
            const previewBox = ref(null); // 左侧主图元素信息
            const zoomBox = ref(null); //左侧主图的父元素的信息
            const defaultImage = ref(""); //默认主图路径
            const currentDefaultImage = ref("0"); //默认主图显示第一张
            const currentSpecNum = ref(1); //商品编辑数量，默认数量为1
            const recommendeList = reactive({ data: [] }); //看了又看商品
            const storePopularList = reactive({ data: [] }); //店铺推荐及热门收藏
            const recommendeData = reactive({ data: {} }); //店铺热销推荐数据
            const loginModalVisibleFlag = ref(false); //登录弹框是否显示，默认不显示
            const goodsPictureList = ref(null); //商品图片列表
            const wxShareCode = ref(false); //微信分享二维码是否显示
            const parameterShow = ref(false); //规格参数查看是否查看全部，默认为否
            onMounted(() => {
                getInitData(route.query.productId);
                productId.value = route.query.productId;
            });

            // 点击播放视频
            const playV = () => {
                currentDefaultImage.value = -1
                defaultImage.value = "";
                maskShow.value = false
                videoEnd()
            }

            //视频播放结束时触发
            const videoEnd = () => {
                proxy.$nextTick(() => {
                    proxy.$refs.video.onended = () => {
                        currentDefaultImage.value = 0;
                        defaultImage.value = goodsDetail.data.defaultProduct.goodsPics[0];
                    }
                })

            }
            const refreshInfo = () => {
                history.go(0)
            };


            //获取商品详情数据
            const getInitData = (proId) => {
                let params = {
                    integralProductId: proId,
                };
                proxy
                    .$get("v3/integral/front/integral/mall/details", params)
                    .then((res) => {
                        firstLoading.value = false;
                        if (res.state == 200) {
                            goodsDetail.data = res.data;
                            goodsDetail.data.defaultProduct.cashPrice = new Number(goodsDetail.data.defaultProduct.cashPrice).toFixed(2)
                            defaultImage.value = goodsDetail.data.defaultProduct.goodsPics[0];
                            goodsDetail.data.goodsDetails = proxy.$quillEscapeToHtml(goodsDetail.data.goodsDetails)
                            currentDefaultImage.value = 0;
                            vid.value = res.data.storeInfo.storeId;
                            proxy.$nextTick(() => {
                                provide("vid", vid.value);
                            })
                            if (goodsDetail.data.state != 3) {
                                getRecom()
                            }
                        } else {
                            ElMessage.error(res.msg);
                        }
                    })
                    .then(() => {
                        getRecommend();
                        getStorePopular();
                        getCode();
                        getBigcode(goodsDetail.data.shareLink)
                        vid.value = goodsDetail.data.storeInfo.storeId;
                    });
            };

            const recomOffShop = reactive({ data: [] })
            const getRecom = () => {
                proxy.$get('v3/integral/front/integral/mall/recommendList').then(res => {
                    if (res.state == 200) {
                        let top = Math.floor(Math.random() * (res.data.list.length - 8)) + 8
                        let end = top - 8
                        recomOffShop.data = res.data.list.filter(item => item.defaultProductId != goodsDetail.data.defaultProduct.productId).slice(end, top)
                    }
                })
            }

            //跳转去商品详情页
            const goGoodsDetail = (productId) => {
                let newWin = router.resolve({
                    path: '/point/detail',
                    query: {
                        productId: productId
                    }
                })
                window.open(newWin.href, "_blank")
            };

            //获取二维码
            const getCode = () => {
                proxy.$nextTick(() => {
                    let canvas = qrcanvas({
                        data: "下单", //二维码内容
                        size: 20,
                        colorDark: "red",
                    });
                    document.getElementById("qrcode").innerHTML = "";
                    document.getElementById("qrcode").appendChild(canvas);
                });
            };

            //获取商品的shareLink二维码
            const getBigcode = (link) => {
                proxy.$nextTick(() => {
                    let canvas = qrcanvas({
                        data: link, //二维码内容
                        size: 125,
                        colorDark: "red",
                    });
                    document.getElementById("qrcodeBig").innerHTML = "";
                    document.getElementById("qrcodeBig").appendChild(canvas);
                });
            }

            /**
             * 选择规格值
             * @param type:类型  值:choice,规格选择  default:默认
             * @param specId:父级规格值
             * @param specValueId:点击的当前的规格值
             */
            const selectSpecVal = (type, specId, specValueId) => {
                isChoice.value = type == "choice" ? "choice" : "default";
                let curParSpec = []; //当前点击的规格的父级id的当前项
                curParSpec = goodsDetail.data.specs.filter(
                    (item) => item.specId == specId
                );
                let curSPec = []; //当前点击的规格的规格id的当前项
                curSPec = curParSpec[0].specValueList.filter(
                    (item1) => item1.specValueId == specValueId
                );
                curSPec[0].checkState = 1;
                //被选择的规格值的id
                let choiceSpecIds = [];
                goodsDetail.data.specs.forEach((item) => {
                    if (item.specId != specId) {
                        item.specValueList.forEach((item1) => {
                            if (item1.checkState == "1") {
                                // checkState: 1-选中，2-可选，3-禁用
                                choiceSpecIds.push(item1.specValueId);
                            }
                        });
                    } else {
                        choiceSpecIds.push(specValueId);
                    }
                });
                let params = {
                    integralGoodsId: goodsDetail.data.integralGoodsId,
                    specValueIds: choiceSpecIds.join(","),
                };
                proxy.$get("v3/integral/front/integral/mall/productInfo", params).then((res) => {
                    if (res.state == 200) {
                        let result = res.data;
                        goodsDetail.data.defaultProduct = result.defaultProduct;
                        goodsDetail.data.defaultProduct.cashPrice = new Number(goodsDetail.data.defaultProduct.cashPrice).toFixed(2)
                        productId.value = result.defaultProduct.productId;
                        goodsDetail.data.specs = result.specs;
                        defaultImage.value = goodsDetail.data.defaultProduct.goodsPics[0];
                        currentDefaultImage.value = 0;
                    }
                });
            };

            //商品数量的编辑
            const editNum = (type, e) => {
                let productStock = goodsDetail.data.defaultProduct.productStock
                if (goodsDetail.data.defaultProduct.productStock == 0) {
                    productStock = 999
                }
                if (type == "add") {
                    if (
                        currentSpecNum.value >= productStock
                    ) {
                        currentSpecNum.value = productStock;
                    } else {
                        if (currentSpecNum.value > 999) {
                            currentSpecNum.value = 999;
                        } else {
                            currentSpecNum.value++;
                        }
                    }
                } else if (type == "edit") {

                    let limit = Math.min(productStock, 999)

                    if (currentSpecNum.value >= limit) {
                        currentSpecNum.value = limit
                    }

                    // if (currentSpecNum.value == 0) {
                    //     ElMessage(L["不能输入非0数字!"]);
                    //     currentSpecNum.value = 1;
                    // }

                } else if (type == "reduce") {
                    if (currentSpecNum.value > 1) {
                        currentSpecNum.value--;
                    } else {
                        currentSpecNum.value = 1;
                    }
                } else if (type == 'blur') {
                    let reg = /\./g
                    let reg0 = /0+\d/
                    if (reg.test(currentSpecNum.value) || reg0.test(currentSpecNum.value) || currentSpecNum.value <= 0) {
                        currentSpecNum.value = 1
                    }
                }
            };

            //改变数量按钮样式
            const disStyle = reactive({//目的是进入商品详情页面就让减按钮呈现禁止状态
                color: "#DDDDDD",
                backgroundColor: "#F8F8F8"
            })
            watch(currentSpecNum, () => {//监听数量对加和减的样式做出调整
                let productStock = goodsDetail.data.defaultProduct.productStock
                if (goodsDetail.data.defaultProduct.productStock == 0) {
                    productStock = 999
                }

                if (currentSpecNum.value >= productStock) {
                    proxy.$refs.add.style.color = "#DDDDDD";
                    proxy.$refs.add.style.backgroundColor = "#F8F8F8"
                } else if (currentSpecNum.value <= 1) {
                    disStyle.color = "#DDDDDD"
                    disStyle.backgroundColor = "#F8F8F8"
                } else {
                    disStyle.color = ""
                    disStyle.backgroundColor = ""
                    proxy.$refs.add.style.color = "";
                    proxy.$refs.add.style.backgroundColor = ""
                }
            })


            //立即购买
            const goBuy = () => {
                if (store.state.loginFlag) {

                    proxy.$post('v3/integral/front/integral/orderOperate/check', {
                        productId: goodsDetail.data.defaultProduct.integralProductId,
                        integralPrice: goodsDetail.data.defaultProduct.integralPrice,
                        cashPrice: goodsDetail.data.defaultProduct.cashPrice,
                        number: currentSpecNum.value,
                    }).then(res => {
                        if (res.state == 200) {
                            router.push({
                                path: "/point/order/confirm",
                                query: {
                                    productId: goodsDetail.data.defaultProduct.integralProductId,
                                    numbers: currentSpecNum.value,
                                },
                            });
                        } else {
                            ElMessage(res.data ? res.data.stateValue : res.msg)
                        }
                    })
                } else {
                    //未登录提示登录
                    loginModalVisibleFlag.value = true;
                }
            };
            //关闭登录弹框
            const closeLoingModal = () => {
                loginModalVisibleFlag.value = false;
            };

            //获取看了又看商品(人气数)
            const getRecommend = () => {
                proxy.$get("v3/integral/front/integral/mall/recommendList").then((res) => {
                    if (res.state == 200) {
                        let result = res.data;
                        recommendeList.data = result.list;
                        recommendeList.data.map(item => item.cashPrice = new Number(item.cashPrice).toFixed(2))
                    } else {
                        ElMessage.error(res.msg);
                    }
                });
            };

            //人气礼品
            const getStorePopular = () => {
                let params = {
                    sort: 1,
                };
                proxy.$get("v3/integral/front/integral/mall/goodsList", params).then((res) => {
                    if (res.state == 200) {
                        let result = res.data;
                        storePopularList.data = result.list;
                        storePopularList.data.map(item => item.cashPrice = new Number(item.cashPrice).toFixed(2))
                    } else {
                        ElMessage.error(res.msg);
                    }
                });
            };


            //关注店铺及取消关注
            const focusStore = () => {
                if (store.state.loginFlag) {
                    //已登录
                    let params = {
                        storeIds: goodsDetail.data.storeInfo.storeId,
                        isCollect: !goodsDetail.data.storeInfo.isFollowStore,
                    };
                    proxy.$post("v3/member/front/followStore/edit", params).then((res) => {
                        if (res.state == 200) {
                            goodsDetail.data.storeInfo.isFollowStore = !goodsDetail.data.storeInfo.isFollowStore;
                        }
                    });
                } else {
                    //未登录提示登录
                    loginModalVisibleFlag.value = true;
                }
            };


            //点击查看全部查看全部的商品规格参数
            const openParameter = () => {
                parameterShow.value = !parameterShow.value;
            };

            //选择商品主图
            const selectDefaultImage = (goodsImgItem, goodsImgIndex) => {
                defaultImage.value = goodsImgItem;
                currentDefaultImage.value = goodsImgIndex;
            };

            //切换商品主图
            const switchDefaultImage = (type) => {
                let defaultImagelength = goodsDetail.data.defaultProduct.goodsPics.length;
                if (type == "left") {
                    currentDefaultImage.value--;
                    if (currentDefaultImage.value <= 0) {
                        currentDefaultImage.value = 0;
                    }
                    defaultImage.value =
                        goodsDetail.data.defaultProduct.goodsPics[currentDefaultImage.value];
                } else {
                    currentDefaultImage.value++;
                    if (currentDefaultImage.value >= defaultImagelength) {
                        currentDefaultImage.value = defaultImagelength - 1;
                    }
                    defaultImage.value =
                        goodsDetail.data.defaultProduct.goodsPics[currentDefaultImage.value];
                }
                goodsPictureListsLeft();
            };
            //图片列表的left移动的距离
            const goodsPictureListsLeft = () => {
                //获取 goods_picture_list 的元素
                let goodsPictureLists = goodsPictureList.value;
                //列表默认显示5张图片
                if (
                    goodsDetail.data.defaultProduct.goodsPics.length > 5 &&
                    currentDefaultImage.value >= 0
                ) {
                    /* 分析找规律：
                      如果有8张图片，点击右键 最大可以向左移动的距离为 8 - 5既3张图，left移动的距离为 3 * - 66px; currentDefaultImage.value从0开始的
                      其中：66px为每一个元素需要每次移动的距离 为图片的宽度与图片之间的间距的和
                      currentDefaultImage.value == 4；goodsPictureLists.style.left = 0；
                      currentDefaultImage.value == 5；goodsPictureLists.style.left = (5-4) (1) * -66px；
                      currentDefaultImage.value == 6；goodsPictureLists.style.left = (5-2) (2) * -66px；
                      currentDefaultImage.value == 7；goodsPictureLists.style.left = (5-3) (2) * -66px；
                       点击左键，最大可以向右移动的距离为 8 - 5 即3张
                       currentDefaultImage.value == 0；goodsPictureLists.style.left = 0；
                       currentDefaultImage.value == 1； goodsPictureLists.style.left = -66px；
                       currentDefaultImage.value == 2; goodsPictureLists.style.left = 2 * -66px；
                       currentDefaultImage.value == 3; goodsPictureLists.style.left = 3 * -66px；
                    */
                    if (currentDefaultImage.value > 4) {
                        goodsPictureLists.style.left =
                            (currentDefaultImage.value - 4) * -66 + "px";
                    }
                    if (
                        currentDefaultImage.value <
                        goodsDetail.data.defaultProduct.goodsPics.length - 4
                    ) {
                        goodsPictureLists.style.left = currentDefaultImage.value * -66 + "px";
                    }
                }
            };

            //获取元素距离父元素的顶部及左边的距离
            const offset = (el) => {
                let top = el.offsetTop;
                let left = el.offsetLeft;
                if (el.offsetParent) {
                    el = el.offsetParent;
                    top += el.offsetTop;
                    left += el.offsetLeft;
                }
                return {
                    left: left,
                    top: top,
                };
            };

            //鼠标移动
            const move = (e) => {

                if (currentDefaultImage.value == -1) {
                    return
                }


                //主图父元素的信息 宽，高
                let previewsBox = previewBox.value;
                let previewBoxWidth = previewsBox.offsetWidth;
                let previewBoxHeight = previewsBox.offsetHeight;
                //主图父元素距离顶部的距离
                let previewsBoxLeft = offset(previewsBox).left;
                let previewsBoxTop = offset(previewsBox).top;

                // 遮罩盒子的信息宽，高
                let masksBox = maskBox.value;
                let maskBoxWidth = masksBox.offsetWidth;
                let maskBoxHeight = masksBox.offsetHeight;
                //鼠标距离屏幕距离
                let moveX = e.clientX;
                let moveY = e.clientY;

                //获取左侧大图父元素的信息
                let zoomsBox = zoomBox.value;
                let zoomBoxWidth = zoomsBox.offsetWidth;
                let zoomBoxHeight = zoomsBox.offsetHeight;

                // 获取大图元素的信息宽，高
                let pictureBigBox = pictureBig.value;
                let pictureBigWidth = pictureBigBox.offsetWidth;
                let pictureBigHeight = pictureBigBox.offsetHeight;

                //获取滚动条的高度
                let scroll =
                    document.documentElement.scrollTop || document.body.scrollTop;

                //主图距离父元素的left及top值
                let left = moveX - previewsBoxLeft - maskBoxWidth / 2;
                let top;
                if (scroll > 0) {
                    top = moveY - previewsBoxTop + scroll - maskBoxHeight / 2;
                } else {
                    top = moveY - previewsBoxTop - maskBoxHeight / 2;
                }

                //移动限制最大宽度，及最大高度
                let maxWidth = previewBoxWidth - maskBoxWidth;
                let maxHeight = previewBoxHeight - maskBoxHeight;

                left = left < 0 ? 0 : left > maxWidth ? maxWidth : left;
                top = top < 0 ? 0 : top > maxHeight ? maxHeight : top;

                //比列
                let parcentX = left / maxWidth;
                let parcentY = top / maxHeight;

                //遮罩层的定位值
                maskBox.value.style.left = left + "px";
                maskBox.value.style.top = top + "px";

                //大图元素的定位值
                pictureBig.value.style.left =
                    parcentX * (zoomBoxWidth - pictureBigWidth) + "px";
                pictureBig.value.style.top =
                    parcentY * (zoomBoxHeight - pictureBigHeight) + "px";
                pictureBig.value.style.width =
                    (previewBoxWidth / maskBoxWidth) * zoomBoxWidth + "px";
                pictureBig.value.style.height =
                    (previewBoxHeight / maskBoxHeight) * zoomBoxHeight + "px";
            };
            //鼠标移出
            const out = () => {
                maskShow.value = false;
            };

            //鼠标移入
            const enter = () => {
                if (currentDefaultImage.value == -1) {
                    return
                }
                maskShow.value = true;
            };

            const kefu = () => {
                proxy.$sldCommonTip();
            };

            //进入店铺
            const goStore = () => {
                let tarUrl = router.resolve({
                    path: "/store/index",
                    query: {
                        vid: vid.value,
                    },
                });
                window.open(tarUrl.href, "_blank");
            };

            const showImg = (index, img) => {
                imgSource.value = img
                imgIndex.value = index
                imgVisible.value = true
            }

            //分享
            const share = (type) => {
                let title = goodsDetail.data.goodsName; //需要分享的标题,这里取商品名字
                let url = goodsDetail.data.shareLink; //分享的地址，用户点击可以进入到该商品
                let content = goodsDetail.data.goodsBrief; //自定义内容,这里取商品广告词
                let targetUrl = ""; //跳转的url地址
                if (type == "weixin") {
                    wxShareCode.value = true;
                    //微信
                    let canvas = qrcanvas({
                        data: url, //二维码内容
                        size: 100,
                        colorDark: "red",
                    });
                    let share_wx_qrcode = document.getElementById("share_wx_qrcode");
                    if (wxShareCode.value && share_wx_qrcode != null && share_wx_qrcode != undefined) {
                        document.getElementById("share_wx_qrcode").innerHTML = "";
                        document.getElementById("share_wx_qrcode").appendChild(canvas);
                    }
                } else if (type == "qzone") {
                    wxShareCode.value = false;
                    //QQ空间
                    targetUrl =
                        "https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?title=" +
                        encodeURIComponent(title) +
                        "&desc=" +
                        encodeURIComponent(content) +
                        "&summary=" +
                        encodeURIComponent(content) +
                        "&url=" +
                        encodeURIComponent(url);
                    window.open(targetUrl, "_blank");
                } else if (type == "sina") {
                    wxShareCode.value = false;
                    //新浪微博
                    targetUrl =
                        "https://service.weibo.com/share/share.php?title=" +
                        encodeURIComponent(content + "「" + title + "」" + " 点这里" + url);
                    window.open(targetUrl, "_blank");
                }
            };

            //暴露的变量及方法
            return {
                L,
                goodsDetail,
                isChoice,
                pictureBig,
                maskBox,
                previewBox,
                zoomBox,
                maskShow,
                defaultImage,
                selectSpecVal,
                move,
                out,
                enter,
                selectDefaultImage,
                switchDefaultImage,
                currentDefaultImage,
                currentSpecNum,
                editNum,
                goBuy,
                recommendeList,
                getStorePopular,
                storePopularList,
                focusStore,
                goGoodsDetail,
                vid,
                recommendeData,
                loginModalVisibleFlag,
                closeLoingModal,
                firstLoading,
                kefu,
                goStore,
                goodsPictureList,
                share,
                wxShareCode,
                openParameter,
                parameterShow,
                disStyle,
                imgVisible,
                showImg,
                imgSource,
                recomOffShop,
                playV,
                refreshInfo
            };
        },
    };
</script>

<style lang="scss" scoped>
    @import "../../../style/base.scss";
    @import "../../../style/iconfont.css";
    @import "../../../style/point/pointGoodsDetail.scss";
</style>