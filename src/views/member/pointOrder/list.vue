<template>
    <div class="sld_order_list sld_point_order_list">
        <MemberTitle memberTitle="积分兑换订单"></MemberTitle>
        <div class="container">
            <h3>{{ L['积分订单'] }}</h3>
            <div class="sld_order_nav">
                <div class="sld_order_nav_con flex_row_start_center pointer">
                    <div :class="{item:true,active:current_state==''}" @click="changeState('')">{{L['全部订单']}}</div>
                    <div :class="{item:true,active:current_state==10}" @click="changeState(10)">{{L['待付款']}}</div>
                    <div :class="{item:true,active:current_state==20}" @click="changeState(20)">{{L['待发货']}}</div>
                    <div :class="{item:true,active:current_state==30}" @click="changeState(30)">{{L['待收货']}}</div>
                </div>
                <div class="search_con flex_row_start_center search_info">
                    <div class="search_incon flex_row_start_center">
                        <el-input  class=" search_input" v-model="orderSn" :placeholder="L['商品名称/订单编号']" clearable
                            @clear="clear">
                        </el-input>
                        <div class="search pointer" @click="getOrderList">{{L['搜索']}}</div>
                    </div>
                </div>
            </div>
            <div class="order_title_info flex_row_start_center all_order_info">
                <!-- <div class="all_orders all_item">
                    <div class="allorders">近三个月订单<img src="../../../assets/downarrow.png" alt=""></div>
                    <div class="all_item_more">
                        <p>近三个月订单</p>
                        <p>今年内订单</p>
                        <p>2021年订单</p>
                        <p>2020年订单</p>
                        <p>2020年以前订单</p>
                    </div>
                </div> -->
                 <el-select size="small" v-model="selectTime" placeholder="请选择" @change="changeTime"
                        v-if="selectList.data.length > 0" class="select_el" :popper-append-to-body="false">
                        <el-option v-for="item in selectList.data" :key="item" :value="item.id" :label="item.name">
                        </el-option>
                    </el-select>
                <div class="time_select select_time">订单详情</div>
                <div class="good_price">{{L['单价']}}</div>
                <div class="num">{{L['数量']}}</div>
                <div class="order_price">{{L['订单金额']}}</div>
                <div class="state">{{L['订单状态']}}</div>
                <div class="oprate">{{L['操作']}}</div>
            </div>
            <div class="order_item" v-for="(orderItem,index) in order_list.data" :key="index">
                <div class="title flex_row_start_center">
                    <div>兑换时间：{{orderItem.createTime}}</div>
                    <div class="order_num" @click="goDetail(orderItem.orderSn)">兑换单号: {{orderItem.orderSn}}</div>
                </div>
                <div class="good_info_con flex_row_start_center">
                    <div class="good_info flex_column_center_start">
                        <div class="item flex_row_start_center" v-for="(goodItem,index) in orderItem.orderProductList"
                            :key="index">
                            <div class="good flex_row_start_center">
                                <div class="left">
                                    <div class="virtual_tag" v-if="orderItem.isVirtualGoods==2">虚拟</div>
                                    <coverImage :src="goodItem.productImage" @click="goGoodsDetail(goodItem.productId)"
                                        width="100" height="100"></coverImage>
                                </div>

                                <div class="right">
                                    <div class="good_name overflow_ellipsis_two"
                                        @click="goGoodsDetail(goodItem.productId)">
                                        {{goodItem.goodsName}}</div>
                                    <div class="spec overflow_ellipsis">{{goodItem.specValues}}</div>
                                </div>
                            </div>
                            <div class="good_price">{{goodItem.integralPrice}}积分 + ￥{{goodItem.cashPrice}}</div>
                            <div class="num">*{{goodItem.productNum}}</div>
                        </div>
                    </div>
                    <!-- <div class="after flex_row_center_center">--</div> -->
                    <div class="order_price flex_row_center_center">{{orderItem.integral}}积分 +
                        ￥{{orderItem.cashAmount}}</div>
                    <div class="state flex_column_center_center">
                        <span class="state_value">{{orderItem.orderStateValue}}</span>

                    </div>
                    <div class="oprate flex_column_center_center">
                        <!-- 待付款、待发货订单可以修改地址 -->
                        <div class="detail" @click="goDetail(orderItem.orderSn)">{{L['订单详情']}}</div>
                        <!-- 待收货、已完成订单可以查看物流 -->
                        <div v-if="(orderItem.orderState == 30||orderItem.orderState == 40)&&orderItem.isVirtualGoods==1"
                            class="action-btn flex_row_center_center"
                            @click="lookLogistics(orderItem.orderSn,orderItem.productLeadLittle)">{{L['查看物流']}}</div>
                        <!-- 待收货订单可以确认收货 -->
                        <div v-if="orderItem.orderState == 30" class="action-btn recom flex_row_center_center"
                            @click="confirmReceipt(orderItem.orderSn)">{{L['确认收货']}}</div>
                        <!-- 待付款订单可以取消订单 -->
                        <div v-if="orderItem.orderState == 10" class="action-btn flex_row_center_center"
                            @click="showSelectReasonDialog(orderItem.parentSn)">{{L['取消订单']}}</div>
                        <!-- 待付款订单可以立即支付 -->
                        <div v-if="orderItem.orderState == 10" class="action-btn recom flex_row_center_center"
                            @click="goPay(orderItem.paySn)">{{L['立即支付']}}</div>
                        <!-- 已取消、全部评价完成订单可以删除订单 -->
                        <div v-if="orderItem.orderState==0||(orderItem.orderState==40)"
                            class="action-btn flex_row_center_center" @click="delOrder(orderItem.orderSn)">{{L['删除订单']}}
                        </div>
                        <!-- <div v-if="(orderItem.orderState == 20)&&orderItem.isVirtualGoods==1"
                            class="action-btn flex_row_center_center" @click="editAddress(orderItem.orderSn)">
                            {{L['修改地址']}}</div> -->

                    </div>
                </div>
            </div>
            <el-pagination @current-change="handleCurrentChange" :currentPage="pageData.current"
                :page-size="pageData.pageSize" layout="prev, pager, next, jumper" :total="pageData.total"
                :hide-on-single-page="true" class="flex_row_end_center"></el-pagination>
            <SldCommonEmpty v-if="order_list.data.length==0" :tip="L['暂无订单～']" totalWidth="934px" />
        </div>
        <!-- 取消理由弹窗 start -->
        <el-dialog :title="L['取消订单理由']" v-model="cancel_order" customClass="select_reason_width"
            :before-close="handleClose" lock-sroll="false">
            <div class="cancel_list_con">
                <div v-for="(reasonItem,index) in cancel_list.data" :key="index"
                    :class="{reason_item:true, flex_row_between_center:true,active:current_reason_id==reasonItem.reasonId}"
                    @click="selectReason(reasonItem.reasonId)">
                    <span class="reason_text">{{reasonItem.content}}</span>
                    <img :src="current_reason_id==reasonItem.reasonId?selected:not_select" alt />
                </div>
            </div>
            <div class="confirm_cancel_btn" @click="confirmCancel()">{{L['确定']}}</div>
        </el-dialog>
        <!--  取消地址理由弹窗 end  -->
        <!-- 查看物流弹窗 start -->
        <el-dialog :title="L['物流信息']" v-model="show_logistics" customClass="select_reason_width"
            :before-close="handleClose" lock-sroll="false">
            <div class="logistics_info">
                <p>{{logistics_info.data.type==1?L['联系电话']:L['承运人']}}：{{logistics_info.data.expressName}}</p>
                <p>{{logistics_info.data.type==1?L['联系人']:L['运单号']}}：{{logistics_info.data.expressNumber}}</p>
            </div>
            <div class="logistics_list_con">
                <el-timeline>
                    <el-timeline-item v-for="(logistics, index) in logistics_info.data.routeList" :key="index"
                        :timestamp="logistics.remark">{{logistics.acceptTime}}</el-timeline-item>
                </el-timeline>
            </div>
        </el-dialog>
        <!--  查看物流弹窗 end  -->
        <!-- 地址选择弹窗 start -->
        <el-dialog :title="L['更换地址']" v-model="show_select_address" customClass="select_address_width"
            :before-close="handleClose" lock-sroll="false">
            <div class="out_stock_dialog address_con">
                <div v-for="(item,index) in address_list.data" :key="index" @click="selectAddress(index)"
                    :class="{address_item:true, flex_column_start_start:true, select:current_address_index==index}">
                    <span>{{L['收货人']}}：{{item.memberName}}</span>
                    <span>{{L['联系方式']}}：{{item.telMobile}}</span>
                    <span class="overflow_ellipsis address_text" title="sss">{{L['收货地址']}}：{{item.addressAll}}</span>
                    <img v-if="current_address_index==index" class="selected" :src="invoice_selected" alt />
                </div>
            </div>
            <div class="btn_con flex_row_center_center">
                <div class="confirm_cancel_btn" @click="confirmChangeAddress()">{{L['提交修改']}}</div>
            </div>
        </el-dialog>
        <!-- 地址选择弹窗 end -->
    </div>
</template>
<script>
    import { reactive, getCurrentInstance, ref, onMounted } from "vue";
    import {
        ElInput,
        ElMessage,
        ElMessageBox,
        ElTimeline,
        ElTimelineItem
    } from "element-plus";
    import { useRouter, useRoute } from "vue-router";
    import { useStore } from 'vuex'
    import SldCommonEmpty from '../../../components/SldCommonEmpty';
    import MemberTitle from '../../../components/MemberTitle';
    export default {
        name: "order-list",
        components: {
            ElInput,
            ElTimeline,
            ElTimelineItem,
            SldCommonEmpty,
            MemberTitle
        },
        setup() {
            const router = useRouter();
            const route = useRoute();
            const { proxy } = getCurrentInstance();
            const L = proxy.$getCurLanguage();
            const current_state = ref(""); //当前列表订单状态
            const evaluate_state = ref(0); //是否是待评价
            const order_list = reactive({ data: [] });
            const orderSn = ref("");
            const cancel_order = ref(false); //是否显示取消订单弹窗
            const not_select = require("../../../assets/order/not_select.png");
            const selected = require("../../../assets/order/selected.png");
            const invoice_selected = require("../../../assets/buy/invoice_selected.png");
            const cancel_list = reactive({ data: [] });
            const current_reason_id = ref(); //记录当前已选择理由id
            const order_sn = ref(); //记录当前操作的订单号
            const show_logistics = ref(false);
            const logistics_info = reactive({ data: {} });
            const show_select_address = ref(false); //是否显示选择地址弹窗
            const address_list = reactive({ data: [] }); //地址列表
            const current_address_index = ref(0); //记录当前选择的地址
            const pageData = reactive({
                current: 1,
                pageSize: 10,
                total: 0
            });
            const selectTime = ref('');
            const selectList = reactive({ data: [] });

            //去商品详情页
            const goGoodsDetail = productId => {
                let newWin = router.resolve({
                    path: "/point/detail",
                    query: {
                        productId,
                    }
                });
                window.open(newWin.href, "_blank")
            };

              //获取下拉时间
            const getTime = () => {
                proxy
                    .$get('v3/business/front/orderInfo/timeList')
                    .then(res => {
                        if (res.data.length > 0) {
                            selectList.data = res.data;
                            selectTime.value = selectList.data[0].id;
                        }
                    })
            };

            //改变订单状态
            const changeState = (state) => {
                current_state.value = state;
                pageData.current = 1
                router.push({
                    path: "/member/pointOrder/list",
                    query: {
                        state,
                    }
                });
                getOrderList()
            };

            //获取订单列表
            const getOrderList = () => {
                var param = {};
                if (current_state.value) {
                    param.orderState = current_state.value;
                }
                param.current = pageData.current;
                param.pageSize = pageData.pageSize;
                param.orderSn = orderSn.value;
                proxy.$get("v3/integral/front/integral/order/list", param).then(res => {
                    if (res.state == 200) {
                        order_list.data = res.data.list;
                        pageData.total = res.data.pagination.total

                    } else {
                        ElMessage(res.msg);
                    }
                })
            };

            //清空搜索订单
            const clear = () => {
                orderSn.value = ""
                getOrderList()
            }

            // 获取订单取消理由列表
            const getCancelList = () => {
                proxy.$get("v3/system/front/reason/list", { type: 104 }).then(res => {
                    if (res.state == 200) {
                        cancel_list.data = res.data;
                    } else {
                        ElMessage(res.msg);
                    }
                })
            };

            //选择理由
            const selectReason = id => {
                current_reason_id.value = id;
            };

            //显示选择理由弹窗
            const showSelectReasonDialog = orderSn => {
                cancel_order.value = true;
                order_sn.value = orderSn;
            };

            //显示查看物流信息
            const lookLogistics = orderSn => {
                proxy.$get("v3/integral/front/integral/order/getTrace", { orderSn }).then(res => {
                    if (res.state == 200) {
                        show_logistics.value = true;
                        logistics_info.data = res.data;
                    } else {
                        ElMessage(res.msg);
                    }
                })
            };

            //删除订单
            const delOrder = orderSn => {
                ElMessageBox.confirm(L["确认删除该订单?"], L["提示"], {
                    confirmButtonText: L["确定"],
                    cancelButtonText: L["取消"],
                    type: "warning"
                }).then(() => {
                    proxy.$post("v3/integral/front/integral/orderOperate/delete", { orderSn }).then(res => {
                        if (res.state == 200) {
                            ElMessage.success(L["删除订单成功"]);
                            getOrderList();
                        } else {
                            ElMessage(res.msg);
                        }
                    })
                })
            };

            //确认取消订单
            const confirmCancel = () => {
                if (!current_reason_id.value) {
                    ElMessage.warning(L["请选择取消理由"]);
                    return;
                }
                proxy.$post("v3/integral/front/integral/orderOperate/cancel", {
                    parentSn: order_sn.value,
                    reasonId: current_reason_id.value
                }).then(res => {
                    if (res.state == 200) {
                        ElMessage.success(L["取消订单成功"]);
                        cancel_order.value = false;
                        getOrderList();
                    } else {
                        ElMessage(res.msg);
                    }
                })
            };

            //确认收货
            const confirmReceipt = orderSn => {
                ElMessageBox.confirm(L["确认收货?"], L["提示"], {
                    confirmButtonText: L["确定"],
                    cancelButtonText: L["取消"],
                    type: "warning"
                }).then(() => {
                    proxy.$post("v3/integral/front/integral/orderOperate/receive", { orderSn }).then(res => {
                        if (res.state == 200) {
                            ElMessage.success(L["确认收货成功"]);
                            getOrderList();
                        } else {
                            ElMessage(res.msg);
                        }
                    })
                })
            };

            //立即支付
            const goPay = orderSn => {
                router.push({
                    path: "/point/pay",
                    query: {
                        paySn: orderSn,
                        payFrom: 2
                    }
                });
            };

            //选择地址
            const editAddress = orderSn => {
                show_select_address.value = true;
                order_sn.value = orderSn;
            };

            //获取地址列表
            const getAddressList = () => {
                proxy.$get("v3/member/front/memberAddress/list").then(res => {
                    if (res.state == 200) {
                        address_list.data = res.data.list;
                    } else {
                        ElMessage(res.msg);
                    }
                })
            };

            //切换地址
            const selectAddress = index => {
                current_address_index.value = index;
            };

            //确认修改地址
            const confirmChangeAddress = () => {
                proxy.$post("v3/integral/front/integral/orderOperate/updateAddress", {
                    orderSn: order_sn.value,
                    addressId: address_list.data[current_address_index.value].addressId
                }).then(res => {
                    if (res.state == 200) {
                        ElMessage.success(L["切换地址成功"]);
                        show_select_address.value = false;
                    } else {
                        ElMessage(res.msg);
                    }
                })
            };

            //详情
            const goDetail = orderSn => {
                router.push({
                    path: "/member/pointOrder/detail",
                    query: {
                        orderSn: orderSn
                    }
                });
            };

            //向前翻页
            const handlePrevCilickChange = (e) => {
                pageData.current = e;
                getOrderList();
            };
            //向后翻页
            const handleNextCilickChange = () => {
                pageData.current++;
                getOrderList();
            };
            //页数改变
            const handleCurrentChange = current => {
                pageData.current = current;
                getOrderList();
            };

            onMounted(() => {
                if (route.query.state) {
                    current_state.value = route.query.state;
                } else {
                    current_state.value = "";
                }
                getTime();
                getOrderList();
                getCancelList();
                getAddressList();
            });

            router.beforeEach((to, from, next) => {
                if (to.query.state) {
                    current_state.value = to.query.state;
                } else {
                    current_state.value = "";
                }
                if (to.path == '/member/pointOrder/list') {
                    getOrderList();
                }

                next();
            });
            return {
                current_state,
                changeState,
                evaluate_state,
                getOrderList,
                order_list,
                orderSn,
                cancel_order,
                not_select,
                selected,
                cancel_list,
                current_reason_id,
                selectReason,
                confirmCancel,
                showSelectReasonDialog,
                delOrder,
                lookLogistics,
                show_logistics,
                logistics_info,
                confirmReceipt,
                goPay,
                show_select_address,
                address_list,
                invoice_selected,
                current_address_index,
                selectAddress,
                editAddress,
                confirmChangeAddress,
                goDetail,
                L,
                goGoodsDetail,
                handlePrevCilickChange,
                handleNextCilickChange,
                handleCurrentChange,
                pageData,
                clear,
                selectTime,
                getTime,
                selectList
            };
        }
    };
</script>
<style lang="scss">
    @import "../../../style/orderList.scss";

    .el-pager li.active {
        color: $colorMain;
        cursor: default;
    }

    .el-pager li:hover {
        color: $colorMain;
    }

    .sld_point_order_list {
        .el-select-dropdown__item.selected {
            color: $colorMain;
        }

        .container {
            .all_orders{
                width: 190px;
                position: relative;
                .allorders{
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: default; 
                }
                img{
                    width: 12px;
                    height: 6px;
                    margin-left: 10px;
                }
            }

            .all_item{
                &:hover {
                    &.has_more {
                        &:before {
                        border-top-color: $colorMain;
                        }
                    }
                    .all_item_more{
                        display: block;
                        cursor: default;
                    }
                }
                .all_item_more{
                    position: absolute;
                    width: 110px;
                    padding: 5px 3px;
                    left: 50%;
                    transform: translateX(-50%);
                    top: 35px;
                    background: #fff;
                    box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
                    z-index: 999;
                    display: none;
                    &:before,
                    &:after {
                        position: absolute;
                        top: -11px;
                        left: 50%;
                        transform: translateX(-50%);
                        -webkit-transform: translateX(-50%);
                        display: block;
                        content: " ";
                        width: 0;
                        height: 0;
                        border: 5px solid transparent;
                        border-bottom: 6px solid #dedede;
                    }

                    &:after {
                        top: -10px;
                        border-bottom: 6px solid #fff;
                    }
                    p {
                        display: block;
                        text-align: center;
                        color: #333333;
                        line-height: 12px;
                        padding: 8px 0;
                        border-bottom: 1px dotted #C0C4CC;
                        &:hover {
                            color: #F40213;
                        }
                        &:last-child{
                            border-bottom: 0;
                        }
                    }
                }
            }

            .sld_order_nav {
                display: flex;
                justify-content: space-between;
                .search_info{
                    width: auto;
                    border-top: 0;
                    .search_input{
                        height: 38px;
                    }
                }
                .sld_order_nav_con {
                    .item{
                        margin-left: 18px;
                        margin-right: 18px;
                        padding-left: 0;
                        padding-right: 0;
                    }
                    .active{
                        color: #E2231A;
                    }
                }
            }

            .search_incon{
                width: 321px;
                height: 34px;
                background: #FFFFFF;
                border: 1px solid #E8E8F1;
            }

            .order_item {
                .good_info_con {
                    .oprate {
                        width: 120px;
                    }

                    .state {
                        width: 121px;
                    }

                    .order_price {
                        width: 190px;
                    }

                    .good_info {
                        width: 534px;
                        border-right: 1px solid #e8e8f1;

                        .item {
                            .good {
                                width: 333px;
                                align-items: flex-start;
                            }

                            .good_price {
                                width: 113px;
                            }
                        }
                    }


                }
            }

            .order_title_info {
                position: relative;
                .time_select {
                    width: 358px;
                }

                .good_price,
                .num {
                    width: 103px;
                }

                .order_price {
                    width: 180px;
                }

                .oprate {
                    width: 113px;
                }
            }

            .all_order_info {
                position: relative;
                .select_el{
                    position: absolute;
                    border: 0;
                    left: 20px;
                }
                .el-input__inner{
                    border: 0;
                    background-color: #f7f7f7;
                    max-width: 123px;
                    // height: 36px;
                    font-size: 13px;
                    padding: 0;
                }
                .el-select-dropdown__item{
                    padding: 0;
                    font-size: 13px;
                    text-align: left;
                    padding-left: 10px;
                    // height: 39px;
                    &::after{
                        content: ' ';
                        width: 104px;
                        height: 1px;
                        border-bottom: 1px dotted #C0C4CC;
                        opacity: 0.3;
                        display: block;
                    }
                    &:last-child{
                        &::after{
                        content: '';
                        width:0;
                        height: 0;
                        border-bottom: 0;
                        opacity: 0.3;
                        display: block;
                        }
                    }
                    &:hover{
                        background-color: transparent;
                    }
                }
                .el-select-dropdown__item.hover{
                    background-color: transparent;
                }
                // .el-scrollbar__wrap{
                //     height: 247px;
                // }
            }

            .detail {
                margin-top: 10px;
                cursor: pointer;
            }

            .select_time{
                padding-left: 52px;
            }
        }
    }
</style>