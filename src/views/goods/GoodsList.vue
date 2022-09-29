<template>
    <div class="goods_list_container">
        <!-- 分类路径 -->
        <div class="level_nav_main">
            <div class="level_item" v-if="catePathName.path.length">
                <!-- 一级分类，显示该部分 -->
                <template v-if="1===showIndex">
                    <div class='level_nav_item'>
                        <a class='level_link'>{{catePathName.path[0]}}</a>
                    </div>
                    <!-- <i class="level-right"></i> -->
                    <div class="level_nav_item">
                        <div class="menu_drop">
                            <div :class="{trigger:true,hasChild:cate1.cate.length}">
                                <span class="trigger_name">全部分类</span>
                                <i class="menu_drop_arrow"></i>
                            </div>
                            <div class="menu_drop_main" v-if="cate1.cate.length">
                                <ul class="menu_drop_list">
                                    <li v-for="({categoryName,categoryId,grade,pid},index) in cate1.cate" :key="index">
                                        <router-link :to="`/goods/list?categoryId=${categoryId}&g=${grade}&pid=${pid}`">
                                            {{categoryName}}</router-link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </template>

                <!-- 进入二级分类路径下的页面时，显示该部分 -->
                <template v-else-if="2===showIndex">
                    <div class="level_nav_item">
                        <div class="menu_drop">
                            <div :class="{trigger:true,hasChild:cate1.cate.length}">
                                <span class="trigger_name">{{catePathName.path[0]}}</span>
                                <i class="menu_drop_arrow"></i>
                            </div>
                            <div class="menu_drop_main" v-if="cate1.cate.length">
                                <ul class="menu_drop_list">
                                    <li v-for="({categoryName,categoryId,grade,pid},index) in cate1.cate" :key="index">
                                        <router-link :to="`/goods/list?categoryId=${categoryId}&g=${grade}&pid=${pid}`">
                                            {{categoryName}}</router-link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <i class="level-right"></i>
                    <div class="level_nav_item">
                        <div class="menu_drop">
                            <div :class="{trigger:true,hasChild:cate2.cate.length}">
                                <span class="trigger_name">{{catePathName.path[1]}}</span>
                                <i class="menu_drop_arrow"></i>
                            </div>
                            <div class="menu_drop_main" v-if="cate2.cate.length">
                                <ul class="menu_drop_list">
                                    <li v-for="(item2,index) in cate2.cate" :key="index">
                                        <a @click="goCate3(item2)">{{item2.categoryName}}</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </template>

                <!-- 进入三级分类路径下的页面时，显示该部分 -->
                <template v-else>
                    <div style="float: left;">
                        <div class="level_nav_item">
                            <div class="menu_drop">
                                <div :class="{trigger:true,hasChild:cate1.cate.length}">
                                    <span class="trigger_name">{{catePathName.path[0]}}</span>
                                    <i class="menu_drop_arrow"></i>
                                </div>
                                <div class="menu_drop_main" v-if="cate1.cate.length">
                                    <ul class="menu_drop_list">
                                        <li v-for="({categoryName,categoryId,grade,pid},index) in cate1.cate"
                                            :key="index">
                                            <router-link
                                                :to="`/goods/list?categoryId=${categoryId}&g=${grade}&pid=${pid}`">
                                                {{categoryName}}</router-link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <i class="level-right"></i>
                        <div class="level_nav_item">
                            <div class="menu_drop">
                                <div :class="{trigger:true,hasChild:cate2.cate.length}">
                                    <span class="trigger_name">{{catePathName.path[1]}}</span>
                                    <i class="menu_drop_arrow"></i>
                                </div>
                                <div class="menu_drop_main" v-if="cate2.cate.length">
                                    <ul class="menu_drop_list">
                                        <li v-for="({categoryName,categoryId,grade,pid},index) in cate2.cate"
                                            :key="index">
                                            <router-link
                                                :to="`/goods/list?categoryId=${categoryId}&g=${grade}&pid=${pid}`">
                                                {{categoryName}}</router-link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <i class="level-right"></i>
                        <div class="level_nav_item">
                            <div class="menu_drop">
                                <div :class="{trigger:true,hasChild:cate3.cate.length}">
                                    <span class="trigger_name">{{catePathName.path[2]}}</span>
                                    <i class="menu_drop_arrow"></i>
                                </div>
                                <div class="menu_drop_main" v-if="cate3.cate.length">
                                    <ul class="menu_drop_list">
                                        <li v-for="(item3,index) in cate3.cate" :key="index">
                                            <a @click="goCate3(item3)">{{item3.categoryName}}</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>

                <div class="level_nav_item" style="margin-left: 10px;">
                    <div class="menu_drop" v-for="(item,index) in attriListTemp " :key="index">
                        <div class="trigger label">
                            <span class="trigger_name">{{item.name}}:&nbsp;<font color="#e2231a">{{item.value}}</font>
                            </span>
                            <span @click="attriKick(index,item)">
                                <i class="el-icon-close"></i>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="level_item" v-show="keyword">
                <div class='level_nav_item' style="font-size: 13px;">
                    <a class='level_link'><i style="color: #e22319;">"{{keyword}}" &nbsp;</i>搜索结果</a>
                </div>
            </div>
        </div>
        <div class="goods_list_banner">
            <!-- 二级分类或者三级分类的组件 -->
            <GoodsListCate2 :cateItem="cate1.child" :cate2Name="catePathName.path[0]" v-if="showIndex===1">
            </GoodsListCate2>
            <GoodsListCate2 :cateItem="cate2.child" :cate2Name="catePathName.path[1]" v-if="showIndex===2">
            </GoodsListCate2>
            <GoodsListCate3 :categoryid="categoryId3" v-if="showIndex===3" @attriOption="attriOption"
                @brandOption="brandOption" ref="goodsCate3"></GoodsListCate3>
        </div>

        <div class="goods_list clearfix">
            <!-- 筛选区域 -->
            <div class="sld_screen">
                <a @click="filterSort(0)" :class="0==indexNum?'btn_sort':'' ">{{L['综合']}}</a>
                <a @click="filterSort(1)" :class="1==indexNum?'btn_sort':'' ">
                    {{L['销量']}}
                    <i class="iconfont" style="font-size: 12px;"></i>
                </a>
                <a @click="filterSort(2)" :class="2==indexNum?'btn_sort':'' ">
                    {{L['评论数']}}
                    <i class="iconfont" style="font-size: 12px;"></i>
                </a>
                <a :class="{sld_price_jt_down:indexNum==4,sld_price_jt_up:indexNum==3}"
                    class="sld_price_jt" @click="filterSort(indexNum==4?3:4)">{{L['价格']}}</a>
                <div class="price_section on">
                    <div class="input_box">
                        <input type="number" class="sld_rmb" v-model="lowprice" id="lowprice"
                            @input="priceInput('lowprice',$event)">
                        <span class="line"></span>
                        <input type="number" class="sld_rmb" v-model="highprice" id="highprice"
                            @input="priceInput('highprice',$event)">
                    </div>
                    <div class="ctrl clearfix">
                        <a class="fl clearVal" @click="reset">{{L['清空']}}</a>
                        <a class="fr confirm" @click="confirm">{{L['确定']}}</a>
                    </div>
                </div>
                <div class="goods_type">
                    {{L['商品类型']}}:
                    <p style="cursor: pointer;">
                        <input type="checkbox" :value="isOwnShop" id="isOwn" @input="filterStoreSelf(isOwnShop)">
                        <label for="isOwn" style="cursor: pointer;">{{L['仅平台自营']}}</label>
                    </p>
                </div>
                <span class="sld_goods_num">{{goodsData.page.total}}件相关商品</span>
            </div>

            <!-- 商品列表 -->
            <ul :class="{sld_goods_list:true,skeleton_sld_goods_list:firstLoading}">
                <li v-for="({goodsName,goodsImage,goodsPrice,saleNum,activityList,isFollowGoods,defaultProductId,storeName,isOwnShop,goodsId,storeId},index) in (firstLoading?skeletonData.data:goodsData.data)"
                    :key="index">
                    <div class="sld_img sld_img_center">
                        <router-link target="_blank" :to="`/goods/detail?productId=${defaultProductId}`">
                            <img :src="goodsImage" alt="">
                        </router-link>
                    </div>
                    <p class="clearfix">
                        <span class="sld_goods_price fl">￥<em>{{Number(goodsPrice).toFixed(2)}}</em></span>
                        <span class="fr">{{L['成交量']}} <em>{{saleNum}}</em></span>
                    </p>
                    <div class="sld_h32_hide">
                        <router-link class="sld_goods_name" target="_blank"
                            :to="`/goods/detail?productId=${defaultProductId}`">
                            <span v-html="goodsName"></span>
                        </router-link>
                    </div>
                    <!-- <div class="sale_num">
                        <span>已售</span>
                        <span style="color: #596DA3;">{{saleNum}}</span>
                    </div> -->
                    <div class="sld_vendor_name">
                        <router-link target="_blank" :to="`/store/index?vid=${storeId}`" class="sld_vendor_name"
                            @click.stop>
                            <span>{{storeName}}</span>
                            <span class="el-icon-arrow-right"></span>
                        </router-link>
                    </div>
                    <div class="tag flex_row_start_center">
                        <div class="is_own" v-if="isOwnShop==1">自营</div>
                        <div class="tag_b" :class="{tag_b_pre_sale:promotionType==103}"
                            v-for="({promotionName,promotionType},index) in activityList" :key="index">{{promotionName}}
                        </div>
                    </div>
                    <div class="op_but flex_row_start_center">
                        <div class="but_i first flex_row_center_center"
                            @click.stop="collectGoods(defaultProductId,isFollowGoods)">
                            <div v-if="!isFollowGoods">
                                <i class="iconfont">&#xe612;</i>{{L['收藏']}}
                            </div>
                            <div v-else>
                                <i><img src="@/assets/goods/collection.png" class="collection"></i>{{L['已收藏']}}
                            </div>
                        </div>
                        <div class="but_i second flex_row_center_center"
                            @click.stop="addCart(defaultProductId,goodsId)">
                            <div>
                                <i><img src="@/assets/goods/add_cart.png" alt="" width="22"
                                        height="21"></i>{{L['加入购物车']}}
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
            <SldCommonEmpty v-show="isEmpty" />
        </div>

        <!-- 分页 -->
        <div class="flex_row_center_center sld_pagination">
            <el-pagination @current-change="handleCurrentChange" v-model:currentPage="goodsData.page.current"
                :page-size="goodsData.page.pageSize" layout="prev, pager, next, jumper" :total="goodsData.page.total"
                :hide-on-single-page="true">
            </el-pagination>
        </div>

        <SldLoginModal :visibleFlag="loginModalVisibleFlag" @closeLoingModal="closeLoingModal" />
    </div>

</template>
<script>
    import { getCurrentInstance, onMounted, reactive, ref, watchEffect, watch } from 'vue';
    import { ElMessage } from 'element-plus'
    import { useRoute, useRouter } from "vue-router";
    import { useStore } from "vuex";
    import GoodsListCate2 from '@/components/GoodsListCate2';
    import GoodsListCate3 from '@/components/GoodsListCate3';
    import SldLoginModal from "../../components/loginModal";
    import SldCommonEmpty from '../../components/SldCommonEmpty'

    export default {
        name: 'goodsList',
        components: {
            GoodsListCate2,
            GoodsListCate3,
            SldLoginModal,
            SldCommonEmpty
        },
        setup() {
            //变量------------------------------
            const firstLoading = ref(true);//是否第一次加载
            const skeletonData = reactive({ data: [] });
            const store = useStore();
            const loginModalVisibleFlag = ref(false);//登录弹框是否显示，默认不显示
            const initSkeletonData = () => {
                for (let i = 0; i < 10; i++) {
                    skeletonData.data.push({
                        goodsName: '',
                        goodsImage: '',
                        goodsPrice: '',
                        saleNum: '',
                        activityList: '',
                        isFollowGoods: '',
                        defaultProductId: '',
                    });
                }
            }
            initSkeletonData();
            const route = useRoute()
            const router = useRouter()
            const catePath = ref([]) //导航路径
            const showIndex = ref(0) //显示flag
            const catePathName = reactive({ path: [] }) //需要在页面显示的整个分类路径
            const params = reactive({ //初始化的请求参数
                current: 1,
            })
            const { proxy } = getCurrentInstance()
            const L = proxy.$getCurLanguage();
            const goodsData = reactive({ data: [], page: {} })
            const indexNum = ref(0)
            const lowprice = ref(null)
            const highprice = ref(null)
            const isEmpty = ref(false)
            const keyword = ref(route.query.keyword != undefined && route.query.keyword ? route.query.keyword : '');//搜索关键词
            const cate1 = reactive({ cate: {}, child: {} })
            const cate2 = reactive({ cate: {}, child: {} })
            const cate3 = reactive({ cate: {} })
            const categoryId3 = ref(route.query.categoryId != undefined && route.query.categoryId ? route.query.categoryId : '')
            const attriList = ref([])
            const attriListTemp = ref([])
            const scrollTop = ref(null)
            const priceDidSel = ref(false)
            //方法------------------------------

            //初始化数据，进行请求-start
            const getInitData = (params) => {
                window.scrollTo(0, scrollTop.value)
                let searchParams = { ...params }
                proxy.$get('v3/goods/front/goods/goodsList', searchParams).then(res => {
                    firstLoading.value = false;
                    priceDidSel.value = false
                    if (res.state == 200) {
                        goodsData.data = res.data.list
                        goodsData.data.map(item =>
                            // item.goodsPrice = new Number(item.goodsPrice).toFixed(2)
                            item.saleNum = item.saleNum > 10000 ? (item.saleNum / 10000).toFixed(1) * 1 + 'w' : item.saleNum
                        )
                        isEmpty.value = res.data.list.length ? false : true
                        goodsData.page = res.data.pagination
                        showIndex.value = Number(route.query.g)
                        if (route.query.categoryId && route.query.g && route.query.pid) {
                            let { categoryId, g } = route.query
                            cateForm(categoryId, g)
                        }
                    }
                })
            }
            //初始化数据，进行请求-end


            //加入购物车
            const addCart = (productId, goodsId, storeId) => {
                if (store.state.loginFlag) {
                    let paramsData = {
                        productId,
                        number: 1,
                    };
                    proxy.$addCart(paramsData);
                } else {
                    let paramsData = {
                        number: 1,
                        goodsId,
                        storeId
                    };

                    proxy.$addCart(paramsData);
                }
            };

            const cateForm = (c, g) => {
                if (g == 0) {
                    return
                }
                if (g == 3) {
                    let pid = route.query.pid
                    cateForm(pid, 2)
                    return
                }
                let param = {
                    categoryId: c,
                    grade: g
                }
                let cateId = route.query.categoryId
                proxy.$get('v3/goods/front/goods/category/listByPId', param).then(res => {
                    if (res.state == 200) {
                        switch (Number(g)) {
                            case 1: {
                                let cdx1 = res.data.findIndex(i => i.categoryId == c)
                                cate1.cate = res.data.filter(i => i.categoryId != c)
                                cate1.child = res.data[cdx1].children
                                catePathName.path[0] = res.data[cdx1].categoryName
                                if (route.query.g == 2 || route.query.g == 3) {
                                    cate2.cate = cate1.child.filter(i => i.categoryId != cateId)
                                }
                                break;
                            }

                            case 2: {
                                cate2.child = res.data[0].children
                                catePathName.path[1] = res.data[0].categoryName
                                if (route.query.g == 3) {
                                    let cdx3 = cate2.child.findIndex(i => i.categoryId == cateId)
                                    cate3.cate = cate2.child.filter(i => i.categoryId != cateId)
                                    catePathName.path[2] = cate2.child[cdx3].categoryName
                                }
                                let cate2Pid = res.data[0].pid
                                cateForm(cate2Pid, 1)
                                break;
                            }
                        }
                    }
                })
            }

            const categorySearch = (data, val) => {//遍历分类列表，找到该categoryId所在的id路径
                for (var i = 0; i < data.length; i++) {
                    if (data[i] && data[i].categoryId == val) {
                        return [{
                            categoryId: val,
                            categoryName: data[i].categoryName,
                            children: data[i].children
                        }];
                    } if (data[i] && data[i].children) {
                        var d = categorySearch(data[i].children, val);
                        if (d) return d.concat({
                            categoryId: data[i].categoryId,
                            categoryName: data[i].categoryName,
                            children: data[i].children
                        });
                    }
                }
            }
            //获取分类Id数组对应的分类名--end

            //去往三级分类
            const goCate3 = (item) => {
                let { categoryId, grade, pid } = item
                router.push({
                    path: 'list',
                    query: {
                        categoryId,
                        g: grade,
                        pid
                    }
                })
            }

            //页数改变的方法-start
            const handlePrevCilickChange = (e) => {
                params.current = e
                getInitData(params)
            }
            const handleNextCilickChange = (e) => {
                params.current = e
                getInitData(params)
            }
            const handleCurrentChange = (e) => {
                params.current = e
                getInitData(params)
            }
            const filterSort = (index) => {
                if (indexNum.value == index) {
                    return
                }

                indexNum.value = index
                params.current = 1
                scrollTop.value = document.body.scrollTop || document.documentElement.scrollTop
                let query = {}
                if (route.query.categoryId) {
                    query.categoryId = route.query.categoryId
                } else if (route.query.keyword) {
                    query.keyword = route.query.keyword
                } else if (route.query.storeId) {
                    query.storeId = route.query.storeId

                }
                if (route.query.goodsIds) {
                    query.goodsIds = route.query.goodsIds
                }
                if (route.query.brandId) {
                    query.brandId = route.query.brandId
                }

                router.push({
                    path: 'list',
                    query: {
                        ...query,
                        sort: indexNum.value
                    }
                })
            }
            //页数改变的方法-end

            //商品是否自营-start
            const isOwnShop = ref(false)
            const filterStoreSelf = (e) => {
                isOwnShop.value = !e
                params.isSelf = isOwnShop.value ? 1 : 0;
                getInitData(params)
            }
            //商品是否自营-end

            //价格区间事件-start
            const confirm = () => {//价格区间确认按钮
                priceDidSel.value = true

                if (lowprice.value && highprice.value) {

                    lowprice.value = Math.abs(lowprice.value)
                    highprice.value = Math.abs(highprice.value)

                    if (Number(lowprice.value) > Number(highprice.value)) {
                        let temp = lowprice.value
                        lowprice.value = highprice.value
                        highprice.value = temp
                        params.highPrice = highprice.value
                        params.lowPrice = lowprice.value
                        params.current = 1
                        getInitData(params)

                    } else {
                        params.highPrice = Number(highprice.value) > 999999 ? 999999 : Number(highprice.value)
                        params.lowPrice = Number(lowprice.value) < 0.01 ? 0.01 : lowprice.value
                        params.current = 1
                        getInitData(params)
                    }

                } else if (lowprice.value && !highprice.value) {
                    lowprice.value = Math.abs(lowprice.value)
                    if (lowprice.value.toString().split(".")[1] && lowprice.value.toString().split(".")[1].length > 2) {
                        lowprice.value = Number(lowprice.value).toFixed(2)
                    }
                    params.lowPrice = Number(lowprice.value) < 0.01 ? 0.01 : lowprice.value
                    delete params.highPrice
                } else if (!lowprice.value && highprice.value) {

                    highprice.value = Math.abs(highprice.value)
                    if (highprice.value.toString().split(".")[1] && highprice.value.toString().split(".")[1].length > 2) {
                        highprice.value = Number(highprice.value).toFixed(2)
                    }
                    params.highPrice = Number(highprice.value) > 999999 ? 999999 : Number(highprice.value)
                    delete params.lowPrice
                }
            }
            const reset = () => {//价格区间清空按钮
                params.highPrice = highprice.value = ''
                params.lowPrice = lowprice.value = ''
                params.current = 1

                if (priceDidSel.value) {
                    getInitData(params)
                }

                //这是 当 例如 3- 这种情况出现 无法清空，执行
                document.getElementById('lowprice').value = ''
                document.getElementById('highprice').value = ''
            }


            const priceInput = (type, e) => {
                if (type == 'lowprice') {
                    lowprice.value = e.target.value
                    let low = String(e.target.value).split('.')
                    if (low[1] && low[1].length >= 2) lowprice.value = Number(e.target.value).toFixed(2)

                }

                if (type == 'highprice') {
                    highprice.value = e.target.value
                    let high = String(e.target.value).split('.')
                    if (high[1] && high[1].length >= 2) highprice.value = Number(e.target.value).toFixed(2)

                }
            }
            //价格区间事件-end




            //收藏及取消收藏商品
            const collectGoods = (defaultProductId, isFollowGoods) => {
                if (store.state.loginFlag) {  //已登录
                    let params = {
                        productIds: defaultProductId,
                        isCollect: !isFollowGoods
                    }
                    proxy.$post("v3/member/front/followProduct/edit", params).then((res) => {
                        if (res.state == 200) {
                            ElMessage.success(res.msg);
                            goodsData.data.map(goodsItem => {
                                if (goodsItem.defaultProductId == defaultProductId) {
                                    goodsItem.isFollowGoods = !isFollowGoods;
                                }
                            })

                        } else {
                            ElMessage.error(res.msg);
                        }
                    });
                } else {
                    //未登录提示登录
                    loginModalVisibleFlag.value = true;
                }
            };
            //关闭登录弹框
            const closeLoingModal = () => {
                loginModalVisibleFlag.value = false;
            };

            //属性选择--start
            const attriOption = (attributeName, attributeValue, attributeId, attributeValueId) => {//添加属性查询
                attriList.value.push(attributeValueId)
                attriListTemp.value.push({
                    name: attributeName,
                    value: attributeValue,
                    type: 'attr',
                    id: attributeId,
                    valueId: attributeValueId
                })
                params.attributeInfo = attriList.value.join(',')
                proxy.$get('v3/goods/front/goods/goodsList', params).then(res => {
                    if (res.state == 200) {
                        goodsData.data = res.data.list
                        goodsData.page = res.data.pagination
                    }

                })
            }

            const attriKick = (index, item) => {//删除属性查询
                attriListTemp.value.splice(index, 1)
                if (item.type == "attr") {
                    attriList.value = attriList.value.filter(subitem => subitem != item.valueId)
                    proxy.$refs.goodsCate3.attrSorH(item.id)
                    if (attriListTemp.value.length) {
                        params.attributeInfo = attriList.value.join(',')
                        proxy.$get('v3/goods/front/goods/goodsList', params).then(res => {
                            if (res.state == 200) {
                                goodsData.data = res.data.list
                                goodsData.page = res.data.pagination
                            }
                        })
                    } else {
                        delete params.attributeInfo
                        proxy.$get('v3/goods/front/goods/goodsList', params).then(res => {
                            if (res.state == 200) {
                                goodsData.data = res.data.list
                                goodsData.page = res.data.pagination
                            }
                        })
                    }
                } else if (item.type == "brand") {
                    delete params.brandIds
                    proxy.$refs.goodsCate3.brandSorH()
                    proxy.$get('v3/goods/front/goods/goodsList', params).then(res => {
                        if (res.state == 200) {
                            goodsData.data = res.data.list
                            goodsData.page = res.data.pagination
                        }
                    })
                }
            }

            const brandOption = (brandId, brandName) => {
                attriListTemp.value.push({
                    name: '品牌',
                    value: brandName,
                    type: 'brand',
                })
                params.brandIds = brandId
                proxy.$get('v3/goods/front/goods/goodsList', params).then(res => {
                    goodsData.data = res.data.list
                    goodsData.page = res.data.pagination
                })

            }
            //属性选择--end

            //监听事件--start
            watchEffect(() => {
                if (route.query.keyword != undefined) {
                    keyword.value = route.query.keyword;
                    categoryId3.value = ""
                    showIndex.value = -1
                    catePathName.path = []
                    params.keyword = keyword.value
                    delete params.categoryIds
                    getInitData(params)

                } else if (route.query.categoryId != undefined) {
                    categoryId3.value = route.query.categoryId;
                    keyword.value = "";
                    params.categoryIds = route.query.categoryId
                    delete params.keyword
                    getInitData(params)
                }
            });
            watch(() => route.query.categoryId, (nv, ov) => {
                if (nv != ov) {
                    categoryId3.value = nv
                    attriList.value = []
                    attriListTemp.value = []
                    lowprice.value = highprice.value = null
                    isOwnShop.value = false
                }

            })
            watch(() => route.query.keyword, (nv, ov) => {
                if (nv != ov) {
                    lowprice.value = highprice.value = null
                    isOwnShop.value = false
                    delete params.highPrice
                    delete params.lowPrice
                }
            })
            watch(() => route.query.sort, (nv, ov) => {

                params.sort = route.query.sort
                indexNum.value = route.query.sort ? route.query.sort : 0

            })


            //监听事件--end

            router.beforeEach((to, from) => {
                if (to.path == from.path) {
                    document.body.scrollTop = scrollTop.value
                }
            })

            onMounted(() => {
                if (route.query.categoryId) {
                    params.categoryIds = route.query.categoryId
                }
                if (route.query.keyword) {
                    params.keyword = route.query.keyword
                }
                if (route.query.storeId) {
                    params.storeId = route.query.storeId

                }
                if (route.query.goodsIds) {
                    params.goodsIds = route.query.goodsIds
                }
                if (route.query.brandId) {
                    params.brandIds = route.query.brandId
                }

                if (route.query.sort) {
                    params.sort = route.query.sort
                    indexNum.value = route.query.sort
                }
                getInitData(params)
            })

            //返回值
            return {
                goodsData,
                handlePrevCilickChange,
                handleNextCilickChange,
                handleCurrentChange,
                L,
                catePathName,
                catePath,
                showIndex,
                indexNum,
                filterSort,
                filterStoreSelf,
                isOwnShop,
                lowprice,
                highprice,
                confirm,
                reset,
                isEmpty,
                keyword,
                cate1,
                cate2,
                cate3,
                firstLoading,
                skeletonData,
                collectGoods,
                loginModalVisibleFlag,
                closeLoingModal,
                goCate3,
                categoryId3,
                attriOption,
                attriList,
                attriKick,
                attriListTemp,
                brandOption,
                priceInput,
                addCart
            }
        }
    }


</script>

<style lang="scss" scoped>
    @import '../../style/goodsList.scss';
    @import '../../style/base.scss';

    input[type="checkbox"] {
        display: none;
        vertical-align: middle;
        margin-bottom: 3px;
        margin-right: 3px;
    }

    input[type="checkbox"]+label {
        background: url('../../assets/goods/unsel.png') left center no-repeat;
        padding-left: 20px;
        background-size: 12px 12px;
    }

    input[type="checkbox"]:checked+label {
        background-image: url('../../assets/goods/select.png');
    }

    .empty_page {
        flex-direction: column;
        padding: 100px;
    }

    .sld_pagination {
        margin-top: 30px;
        margin-bottom: 30px;
    }

    /*添加css样式*/
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }

    input[type="number"] {
        -moz-appearance: textfield;
    }
</style>