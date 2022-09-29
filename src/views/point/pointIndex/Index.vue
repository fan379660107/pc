<template>
    <div class="ad_carousel">
        <!-- 轮播广告图 -->
        <div class="imgCon" :style="{backgroundImage:`url(${indexImgUrl})`}">
        </div>
    </div>

    <div class="sld_index_wrap">
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
            <div class="flex_row_center_center sld_pagination" style="width: 100%;margin-bottom: 20px">
                <el-pagination @current-change="handleCurrentChange" v-model:currentPage="page.current"
                    :page-size="page.pageSize" layout="prev, pager, next, jumper" :total="page.total"
                    :hide-on-single-page="true">
                </el-pagination>
            </div>
        </div>
        <SldCommonEmpty v-show="!goods_list.length" tip="暂无商品~" totalHeight="700" paddingTop="300" />
        <!-- 商品列表start -->
    </div>
</template>

<script>
    import { ref, getCurrentInstance, reactive, onMounted, watch } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import SldCommonEmpty from '../../../components/SldCommonEmpty'
    export default {
        name: 'PointIndex',
        components: {
            SldCommonEmpty
        },
        setup() {
            const { proxy } = getCurrentInstance()
            const route = useRoute()
            const router = useRouter()
            const indexImgUrl = require('@/assets/point/point_bg.png')
            const goodsParams = reactive({
                current: 1,
                pageSize: 12,
            })
            const page = reactive({
                current: '',
                pageSize: 12,
                total: ''
            })
            const goods_list = ref([])
            const getGoods = () => { //获取labelId下的商品列表
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





            onMounted(() => {
                getGoods()
            })

            return {
                goods_list, getGoods, toDetail, page, handlePrevCilickChange, handleNextCilickChange, handleCurrentChange, indexImgUrl
            }
        }
    }
</script>

<style lang="scss">
    @import '@/style/point/point.scss';

    .ad_carousel {
        position: relative;
        height: 447px;

        .imgCon {
            width: 1910px;
            /*图片宽度*/
            position: absolute;
            left: 50%;
            margin-left: -960px;
            display: flex;
            justify-content: center;
            height: 447px;
            background-position: center center;
            background-size: cover;
        }
    }

    .sld_index_wrap {
        width: 1200px;
        margin: 0 auto;
        overflow-x: hidden;

        .goods_list {
            margin-top: 20px;
        }
    }
</style>