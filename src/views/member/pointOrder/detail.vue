<!--
 * @Author: wangwei
 * @Date: 2020-12-28 16:06:28
 * @LastEditTime: 2021-01-15 11:25:31
 * @LastEditors: Please set LastEditors
 * @Description: 订单详情
 * @FilePath: /java-pc/src/views/member/order/List.vue
-->
<template>
    <div class="sld_order_detail">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb"
            style="line-height: 40px;font-size: 10px;">
            <el-breadcrumb-item :to="{path:'/index'}">{{L['首页']}}</el-breadcrumb-item>
            <el-breadcrumb-item>{{L['我的']}}</el-breadcrumb-item>
            <el-breadcrumb-item>积分订单详情</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="container">
            <div class="top_info flex_row_start_center">
                <div class="top_info_state flex_column_center_center">
                    <p class="state">{{order_info.data.orderStateValue}}</p>
                    <p v-if="order_info.data.orderState==0&&order_info.data.payState==0 || order_info.data.orderState==0&&order_info.data.payState==1"
                        class="refuse_reason">
                        {{order_info.data.refuseReason}}
                    </p>
                    <div v-if="order_info.data.orderState == 30" class="oprate_btn pointer"
                        @click="confirmReceipt(order_info.data.orderSn)">{{L['确认收货']}}</div>
                    <div v-if="order_info.data.orderState == 10" class="oprate_btn pointer"
                        @click='goPay(order_info.data.paySn)'>
                        {{L['立即支付']}}</div>
                    <p class="cancel flex_column_center_center">
                        <span class="pointer" v-if="order_info.data.orderState == 10"
                            @click="showSelectReasonDialog(order_info.data.parentSn)">{{L['取消订单']}}</span>
                        <!-- <span class="pointer"
                            v-if="(order_info.data.orderState == 10||order_info.data.orderState == 20)&&order_info.data.isVirtualGoods==1"
                            @click="editAddress(order_info.data.orderSn)">{{L['修改地址']}}</span> -->
                        <span class="pointer"
                            v-if="order_info.data.orderState==0||(order_info.data.orderState==40&&order_info.data.evaluateState==3)"
                            @click="delOrder(order_info.data.orderSn)">{{L['删除订单']}}</span>
                    </p>
                </div>
                <!-- 正常订单 -->
                <div v-if="order_info.data.orderState!=0" class="top_info_progress flex_row_center_center">
                    <div class="progress_item">
                        <p>{{L['提交订单']}}</p>
                        <div class="progress flex_row_center_center">
                            <span
                                :class="{active:order_info.data.orderLogList&&order_info.data.orderLogList.length>=1}">1</span>
                            <div class="progress_line">
                                <div
                                    :class="{content:true,active:order_info.data.orderLogList&&order_info.data.orderLogList.length>=1,current:order_info.data.orderLogList&&order_info.data.orderLogList.length==1}">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="progress_item">
                        <p>{{L['支付订单']}}</p>
                        <div class="progress flex_row_center_center">
                            <span
                                :class="{active:order_info.data.orderLogList&&order_info.data.orderLogList.length>=2}">2</span>
                            <div class="progress_line">
                                <div
                                    :class="{content:true,active:order_info.data.orderLogList&&order_info.data.orderLogList.length>=2,current:order_info.data.orderLogList&&order_info.data.orderLogList.length==2}">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="progress_item">
                        <p>{{L['商家发货']}}</p>
                        <div class="progress flex_row_center_center">
                            <span
                                :class="{active:order_info.data.orderLogList&&order_info.data.orderLogList.length>=3}">3</span>
                            <div class="progress_line">
                                <div
                                    :class="{content:true,active:order_info.data.orderLogList&&order_info.data.orderLogList.length>=3,current:order_info.data.orderLogList&&order_info.data.orderLogList.length==3}">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="progress_item">
                        <p>{{L['确认收货']}}</p>
                        <div class="progress flex_row_start_center">
                            <span
                                :class="{active:order_info.data.orderLogList&&order_info.data.orderLogList.length>=4}">4</span>
                        </div>
                    </div>
                </div>
                <!-- 交易关闭订单 -->
                <div v-if="order_info.data.orderState==0" class="top_info_progress flex_row_center_center">
                    <div class="progress_item">
                        <p>{{L['提交订单']}}</p>
                        <div class="progress flex_row_center_center">
                            <span
                                :class="{active:order_info.data.orderLogList&&order_info.data.orderLogList.length>=1}">1</span>
                            <div class="progress_line">
                                <div
                                    :class="{content:true,active:order_info.data.orderLogList&&order_info.data.orderLogList.length>=1,current:order_info.data.orderLogList&&order_info.data.orderLogList.length==1}">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="progress_item">
                        <p>{{L['交易关闭']}}</p>
                        <div class="progress flex_row_start_center">
                            <span class="active">2</span>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="order_info.data.orderState == 30&&order_info.data.isVirtualGoods==1"
                class="logistics_info flex_row_start_center">
                <div class="logistics_info_left flex_row_center_center">
                    <div class="image flex_row_center_center">
                        <img :src='logistics_info.data.goodsImage' alt />
                    </div>
                    <div class="info">
                        <p>{{L['送货方式']}}：{{logistics_info.data.type==1?'无需物流':'快递'}}</p>
                        <p>{{logistics_info.data.type==1?L['联系电话']:L['承运人']}}：{{logistics_info.data.expressName}}</p>
                        <p>{{logistics_info.data.type==1?L['联系人']:L['运单号']}}：{{logistics_info.data.expressNumber}}</p>
                    </div>
                </div>
                <div v-if="logistics_info.data.routeList" class="logistics_info_right">
                    <div class="right_container">
                        <img v-if="logistics_info.data.routeList.length==0" :src="express_empty" alt />
                        <p v-if="logistics_info.data.routeList.length==0">{{L['暂无物流信息']}}</p>
                        <el-timeline v-if="logistics_info.data.routeList.length>0">
                            <el-timeline-item v-for="(logistics, index) in logistics_info.data.routeList" :key="index"
                                :timestamp="logistics.remark">{{logistics.acceptTime}}</el-timeline-item>
                        </el-timeline>
                    </div>
                </div>
            </div>
            <div class="order_info">
                <p>{{L['订单信息']}}</p>
                <div class="order_info_item flex">
                    <div>
                        <span>{{L['订单号']}}：</span>
                        {{order_info.data.orderSn}}
                    </div>
                    <div>
                        <span>{{L['发票抬头']}}：</span>
                        {{order_info.data.invoiceInfo?order_info.data.invoiceInfo.invoiceTitle:'--'}}
                    </div>
                </div>
                <div class="order_info_item flex">
                    <div>
                        <span>{{L['下单时间']}}：</span>
                        {{order_info.data.createTime}}
                    </div>

                </div>
                <div class="order_info_item">
                    <div>
                        <span>{{L['卖家']}}：</span>
                        {{order_info.data.storeName}}
                    </div>
                </div>
                <div class="order_info_item" v-if="order_info.data.isVirtualGoods==1">
                    <div class="overflow_ellipsis_two"
                        :title="order_info.data.receiverAreaInfo+order_info.data.receiverAddress">
                        <span>{{L['收货地址']}}：</span>
                        {{order_info.data.receiverAreaInfo}} {{order_info.data.receiverAddress}}
                    </div>
                </div>
                <div class="order_info_item" v-if="order_info.data.isVirtualGoods==1">
                    <div>
                        <span>{{L['收货人信息']}}：</span>
                        {{order_info.data.receiverName}} {{order_info.data.receiverMobile}}
                    </div>
                </div>

                <div v-if="order_info.data.isVirtualGoods==2&&order_info.data.orderReserveList.length">
                    <div class="order_info_item" v-for="(item,index) in order_info.data.orderReserveList"
                        v-show="item.reserveValue">
                        <div>
                            <span>{{item.reserveName}}：</span>
                            {{item.reserveValue}}
                        </div>
                    </div>
                </div>
            </div>
            <div class="order_mark">
                <p>{{order_info.data.orderState==0&&order_info.data.payState==1?'订单取消备注':'订单备注'}}</p>
                <div class="order_mark_item" v-if="order_info.data.orderState==0&&order_info.data.payState==1">
                    <span>{{order_info.data.refuseRemark?order_info.data.refuseRemark:'无'}}</span>
                </div>
                <div class="order_mark_item" v-else>
                    <span>{{order_info.data.orderRemark?order_info.data.orderRemark:'无'}}</span>
                </div>
            </div>
            <div class="shop_info" v-if="order_info.data.orderProductList">
                <p>{{L['商品信息']}}</p>
                <div class="shop_title flex">
                    <div class="detail1">{{L['商品详情']}}</div>
                    <div class="price">{{L['单价']}}</div>
                    <div class="num">{{L['数量']}}</div>
                    <div class="oprate">{{L['操作']}}</div>
                </div>
                <div v-for="(goodItem,index) in order_info.data.orderProductList" :key="index" class="good_item flex">
                    <div class="good_info flex">
                        <div class="image flex_row_center_center">
                            <img :src="goodItem.productImage" alt />
                        </div>
                        <div class="good_info_con">
                            <router-link :to="`/goods/detail?productId=${goodItem.productId}`" class="name"
                                target="_blank">
                                {{goodItem.goodsName}}
                            </router-link>
                            <div class="spec">{{goodItem.specValues}}</div>
                        </div>
                    </div>
                    <div class="price flex_row_center_center">{{goodItem.integralPrice}}积分 + ￥{{goodItem.cashPrice}}
                    </div>
                    <div class="num flex_row_center_center">*{{goodItem.productNum}}</div>
                    <div class="oprate pointer flex_row_center_center">
                        <!-- 赠品不能申请售后 -->
                        <span class="refund_btn">--</span>

                    </div>
                </div>
            </div>
            <div class="settle_info">
                <p>
                    {{L['商品合计']}}：
                    <span>{{order_info.data.integral}}积分 + ¥{{order_info.data.cashAmount}}</span>
                </p>
                <p class="total">
                    {{L['实际金额']}}：
                    <span>{{order_info.data.integral}}积分 + ¥{{order_info.data.cashAmount}}</span>
                </p>
            </div>
        </div>
        <!-- 取消地址理由弹窗 start -->
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
        elBreadcrumb,
        elBreadcrumbItem,
        ElMessage,
        ElDialog,
        ElMessageBox,
        ElTimeline,
        ElTimelineItem
    } from "element-plus";
    import { useRouter, useRoute } from "vue-router";

    export default {
        name: "order-detail",
        components: {
            elBreadcrumb,
            elBreadcrumbItem,
            ElDialog,
            ElTimeline,
            ElTimelineItem
        },
        setup() {
            const router = useRouter();
            const route = useRoute();
            const { proxy } = getCurrentInstance();
            const L = proxy.$getCurLanguage();
            const order_info = reactive({ data: {} });
            const express_empty = require("../../../assets/order/express_empty.png");
            const not_select = require("../../../assets/order/not_select.png");
            const selected = require("../../../assets/order/selected.png");
            const invoice_selected = require("../../../assets/buy/invoice_selected.png");
            const cancel_list = reactive({ data: [] });
            const cancel_order = ref(false); //是否显示取消订单弹窗
            const current_reason_id = ref(); //记录当前已选择理由id
            const order_sn = ref(""); //记录当前操作的订单号
            const show_select_address = ref(false); //是否显示选择地址弹窗
            const address_list = reactive({ data: [] }); //地址列表
            const current_address_index = ref(0); //记录当前选择的地址
            const logistics_info = reactive({ data: {} }); //物流信息


            const getOrderDetail = () => {
                proxy.$post("v3/integral/front/integral/order/detail", { orderSn: route.query.orderSn }).then(res => {
                    if (res.state == 200) {
                        order_info.data = res.data;
                        if (order_info.data.orderState == 30) {
                            lookLogistics(order_info.data.orderSn);
                        }
                    } else {
                        ElMessage(res.msg);
                    }
                })
            };

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

            //确认取消订单
            const confirmCancel = () => {
                if (!current_reason_id.value) {
                    ElMessage.warning(L['请选择取消理由']);
                    return;
                }
                proxy.$post("v3/integral/front/integral/orderOperate/cancel", {
                    parentSn: order_sn.value,
                    reasonId: current_reason_id.value
                }).then(res => {
                    if (res.state == 200) {
                        ElMessage.success(L['取消订单成功']);
                        cancel_order.value = false;
                        getOrderDetail();
                    } else {
                        ElMessage(res.msg);
                    }
                })
            };

            //删除订单
            const delOrder = orderSn => {
                ElMessageBox.confirm(L['确认删除该订单?'], L['提示'], {
                    confirmButtonText: L['确定'],
                    cancelButtonText: L['取消'],
                    type: "warning"
                }).then(() => {
                    proxy.$post("v3/integral/front/integral/orderOperate/delete", {
                        orderSn
                    }).then(res => {
                        if (res.state == 200) {
                            ElMessage.success(L['删除订单成功']);
                            router.go(-1);
                        } else {
                            ElMessage(res.msg);
                        }
                    })
                })
            };


            //确认收货
            const confirmReceipt = orderSn => {
                ElMessageBox.confirm(L['确认收货?'], L['提示'], {
                    confirmButtonText: L['确定'],
                    cancelButtonText: L['取消'],
                    type: "warning"
                }).then(() => {
                    proxy.$post("v3/integral/front/integral/orderOperate/receive", {
                        orderSn
                    }).then(res => {
                        if (res.state == 200) {
                            ElMessage.success(L['确认收货成功']);
                            getOrderDetail();
                        } else {
                            ElMessage(res.msg);
                        }
                    })
                })
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
                        ElMessage.success(L['切换地址成功']);
                        show_select_address.value = false;
                        getOrderDetail();
                    } else {
                        ElMessage(res.msg);
                    }
                })
            };

            //显示查看物流信息
            const lookLogistics = orderSn => {
                proxy.$get("v3/integral/front/integral/order/getTrace", {
                    orderSn
                }).then(res => {
                    if (res.state == 200) {
                        logistics_info.data = res.data;
                    } else {
                        ElMessage(res.msg);
                    }
                })
            };

            //立即支付
            const goPay = orderSn => {
                router.push({
                    path: "/point/exchange/pay",
                    query: {
                        paySn: orderSn,
                        payFrom: 2
                    }
                });
            };

            onMounted(() => {
                getOrderDetail();
                getCancelList();
                getAddressList();
            });
            return {
                L,
                order_sn,
                order_info,
                express_empty,
                showSelectReasonDialog,
                cancel_list,
                current_reason_id,
                selectReason,
                cancel_order,
                not_select,
                selected,
                confirmCancel,
                delOrder,
                confirmReceipt,
                editAddress,
                confirmChangeAddress,
                selectAddress,
                current_address_index,
                address_list,
                show_select_address,
                invoice_selected,
                logistics_info,
                goPay,
            };
        }
    };
</script>
<style lang="scss">
    @import "../../../style/member/orderDetail.scss";

    .shop_title .detail1 {
        line-height: 36px;
        width: 60%;
        text-align: center;
    }
</style>