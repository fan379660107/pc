<template>
    <div class="ad_carousel" v-if="label_banner&&label_banner.list.length > 0">

        <!-- 轮播广告图 -->
        <el-carousel height="447px" v-if="label_banner && label_banner.list && label_banner.list.length > 0">
            <el-carousel-item v-for="(item,index) in label_banner.list" :key="index">
                <div class="imgCon" :style="{background:item.bg_color}">
                    <a
                        @click="skipTo(item.link_type,item.link_value,(item.info?(item.info.productId || item.info.defaultProductId):''),(item.info?item.info.pid:''),(item.info?item.info.labelName:''))">
                        <img v-bind:src="item.imgUrl" height="447" width="1000" />
                    </a>
                </div>
            </el-carousel-item>
        </el-carousel>

    </div>

    <!-- 商品列表以及二级分类列表 -->
    <div id="sld_point_wrap">
        <!-- 二级分类start -->
        <div class="secoCategory" v-if="label_list.length">
            <div class="cate_title">分类</div>

            <div :class="{cate_list:true,flex_row_start_center:true}">
                <template v-for="(label,index) in label_list" :key="index">
                    <div class="cate_item zip_block" @click="getGoods(label.labelId)" v-if="index<maxLim">
                        <span :class="{chosen:selCate==label.labelId}">{{label.labelName}}</span>
                    </div>
                </template>
            </div>
            <div class="sld_more" v-if="label_list.length>9" @click="showMore">
                <span>更多</span>
                <i :class="{'el-icon-arrow-down':isMore,'el-icon-arrow-up':!isMore}"></i>
            </div>
        </div>
        <!-- 二级分类end -->

        <!-- 商品列表start -->
        <div class="goods_list">
            <div class="goods_container" v-for="(good,index) in goods_list" :key="index"
                @click="toDetail(good.defaultProductId)">
                <div class="goods_img">
                    <img :src="good.goodsImage" alt="">
                </div>
                <div class="goods_desc">
                    <p class="goods_name">{{good.goodsName}}</p>
                    <p class="goods_brief">{{good.goodsBrief}}</p>
                    <div class="desc_bottom">
                        <p class="market_price">￥{{good.marketPrice}}</p>
                        <a class="point_price"><span>{{good.integralPrice}}积分</span> +
                            <span>￥{{good.cashPrice}}</span></a>
                    </div>
                </div>
            </div>
            <div class="empty_fill" v-for="(ite, idx) in goods_list.length%4" :key="idx"></div>
        </div>
        <SldCommonEmpty v-show="!goods_list.length" tip="暂无商品~" totalHeight="700" paddingTop="300" />
        <!-- 商品列表start -->
    </div>

    <!-- 分页 -->
    <div class="flex_row_center_center sld_pagination" style="margin-bottom: 20px;">
        <el-pagination @current-change="handleCurrentChange" v-model:currentPage="page.current"
            :page-size="page.pageSize" layout="prev, pager, next, jumper" :total="page.total"
            :hide-on-single-page="true">
        </el-pagination>
    </div>
</template>

<script>
    import { ref, getCurrentInstance, reactive, onMounted, watch } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import SldCommonEmpty from '../../../components/SldCommonEmpty'
    export default {
        name: 'PointList',
        components: {
            SldCommonEmpty
        },
        setup() {
            const isMore = ref(true)//二级分类是否展示更多
            const route = useRoute()
            const router = useRouter()
            const goods_list = ref([])
            const label_list = ref([])
            const label_banner = reactive({ //轮播图
                list: []
            })
            const { proxy } = getCurrentInstance()
            const params = reactive({
                current: 1,
                labelId: route.query.labelId
            })
            const maxLim = ref(9)
            const goodsParams = reactive({
                current: 1,
                pageSize: 12
            })

            const selCate = ref(0)
            const page = reactive({
                current: '',
                pageSize: 12,
                total: ''
            })
            const getInitList = () => { //初始化数据
                label_banner.list = []
                proxy.$get('v3/integral/front/integral/mall/list', params).then(res => {
                    let result = res.data.list.find(item => item.labelId == route.query.labelId)
                    label_list.value = result.children
                    if (result.data) {
                        let newList = JSON.parse(result.data.replace(/&quot;/g, "\""))
                        newList.forEach((item) => {
                            if (item.imgUrl) {
                                label_banner.list.push(item)
                            }
                        })
                    } else {
                        label_banner.list = []
                    }
                })
            }

            const getGoods = (labelId) => { //获取labelId下的商品列表
                if (labelId) { goodsParams.labelId = labelId; selCate.value = labelId }
                proxy.$get('v3/integral/front/integral/mall/goodsList', goodsParams).then(res => {
                    goods_list.value = res.data.list
                    goods_list.value.map(item => {
                        item.cashPrice = new Number(item.cashPrice).toFixed(2)
                        item.marketPrice = new Number(item.marketPrice).toFixed(2)
                    })
                    page.total = res.data.pagination.total
                    page.current = res.data.pagination.current
                })
            }

            const toDetail = (prodId) => {//前往商品详情页面
                let newWin = router.resolve({
                    path: 'detail',
                    query: {
                        productId: prodId
                    }
                })

                window.open(newWin.href, "_blank")
            }

            //页数改变的方法-start
            const handlePrevCilickChange = (e) => {
                goodsParams.current = e
                getGoods()
            }
            const handleNextCilickChange = (e) => {
                goodsParams.current = e
                getGoods()
            }
            const handleCurrentChange = (e) => {
                goodsParams.current = e
                getGoods()
            }
            //页数改变的方法-end

            const showMore = () => {
                isMore.value = !isMore.value
                if (isMore.value) {
                    maxLim.value = 9
                } else {
                    maxLim.value = 100000000
                }
            }


            const skipTo = (type, url, productId) => {
                switch (type) {
                    case 'url':
                        if (!url) { return; }
                        else { window.open(url) }
                        break;

                    case 'goods':
                        window.open(router.resolve({
                            path: '/point/detail',
                            query: {
                                productId
                            }
                        }).href, "_blank")
                        break;

                    case 'category':
                        window.open(router.resolve({
                            path: '/point/list',
                            query: {
                                labelId: url
                            }
                        }).href, "_blank")
                        break;

                    case 'keyword':
                        window.open(router.resolve({
                            path: '/goods/list',
                            query: {
                                keyword: url
                            }
                        }).href, "_blank")
                        break;
                }
            }


            watch(() => route.query.labelId, (nv, ov) => { //监听路由labelId,变化时更新数据
                if (nv != ov && route.query.labelId) {
                    params.labelId = nv
                    getInitList()
                    getGoods(nv)
                }

            })


            onMounted(() => {
                getInitList()
                getGoods(route.query.labelId)
            })

            return {
                goods_list, label_list, getGoods, toDetail, label_banner, isMore, page, handlePrevCilickChange, handleNextCilickChange, handleCurrentChange, skipTo, selCate, maxLim, showMore
            }
        }
    }
</script>
<style lang="scss">
    @import '../../../style/point/point.scss';

    .chosen {
        color: $colorMain;
    }
</style>