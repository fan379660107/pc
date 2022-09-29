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
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb" style="line-height: 40px;font-size: 10px;">
      <el-breadcrumb-item :to="{path:'/index'}">{{L['首页']}}</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/member/index'}">{{L['个人中心']}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{L['订单详情']}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="container">
      <div class="top_info flex_row_start_center">
        <div class="top_info_state flex_column_center_center">
          <p class="state">{{order_info.data.orderStateValue}}</p>
          <p v-if="order_info.data.orderState==0&&order_info.data.payState==0 || order_info.data.orderState==0&&order_info.data.payState==1"
            class="refuse_reason">
            {{order_info.data.refuseReason}}
          </p>

          <p class="refuse_reason"
            v-if="order_info.data.orderType == 103&&order_info.data.orderSubState == 102&&!(order_info.data.presellInfo&&order_info.data.presellInfo.isStartRemainPay)">
            {{order_info.data.presellInfo.remainStartTime}}开始付尾款</p>



          <div v-if="order_info.data.orderState == 30" class="oprate_btn pointer"
            @click="confirmReceipt(order_info.data.orderSn)">{{L['确认收货']}}</div>


          <template v-if="order_info.data.orderState == 10">
            <div
              v-if="!(order_info.data.orderType == 105&&order_info.data.orderSubState==102&&order_info.data.ladderGroupDetailInfo.depositRemainTime>0||(order_info.data.orderType == 103&&order_info.data.orderSubState==102&&order_info.data.presellInfo.remainEndTime>0))||(order_info.data.presellInfo&&order_info.data.presellInfo.isStartRemainPay)">
              <div v-if="order_info.data.orderState == 10" class="oprate_btn pointer"
                @click='goPay(order_info.data.paySn)'>
                {{L['立即支付']}}</div>
            </div>
          </template>
          <div v-if="order_info.data.orderState == 40 && order_info.data.evaluateState!=3" class="oprate_btn pointer"
            @click="remainEvaluated(order_info.data.orderSn)">{{L['评价']}}</div>
          <p class="cancel flex_row_center_center" v-if="afsState">
            <span class="pointer" v-if="order_info.data.orderState == 10"
              @click="showSelectReasonDialog(order_info.data.parentSn)">{{L['取消订单']}}</span>
            <span class="pointer"
              v-if="(order_info.data.orderState == 10||order_info.data.orderState == 20)&&order_info.data.isVirtualGoods==1"
              @click="editAddress(order_info.data)">{{L['修改地址']}}</span>
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
              <span :class="{active:order_info.data.orderLogs&&order_info.data.orderLogs.length>=1}">1</span>
              <div class="progress_line">
                <div
                  :class="{content:true,active:order_info.data.orderLogs&&order_info.data.orderLogs.length>=1,current:order_info.data.orderLogs&&order_info.data.orderLogs.length==1}">
                </div>
              </div>
            </div>
          </div>
          <div class="progress_item">
            <p>{{L['支付订单']}}</p>
            <div class="progress flex_row_center_center">
              <span :class="{active:order_info.data.orderLogs&&order_info.data.orderLogs.length>=2}">2</span>
              <div class="progress_line">
                <div
                  :class="{content:true,active:order_info.data.orderLogs&&order_info.data.orderLogs.length>=2,current:order_info.data.orderLogs&&order_info.data.orderLogs.length==2}">
                </div>
              </div>
            </div>
          </div>
          <div class="progress_item">
            <p>{{L['商家发货']}}</p>
            <div class="progress flex_row_center_center">
              <span :class="{active:order_info.data.orderLogs&&order_info.data.orderLogs.length>=3}">3</span>
              <div class="progress_line">
                <div
                  :class="{content:true,active:order_info.data.orderLogs&&order_info.data.orderLogs.length>=3,current:order_info.data.orderLogs&&order_info.data.orderLogs.length==3}">
                </div>
              </div>
            </div>
          </div>
          <div class="progress_item">
            <p>{{L['确认收货']}}</p>
            <div class="progress flex_row_center_center">
              <span :class="{active:order_info.data.orderLogs&&order_info.data.orderLogs.length>=4}">4</span>
              <div class="progress_line">
                <div
                  :class="{content:true,active:order_info.data.orderLogs&&order_info.data.orderLogs.length>=4,current:order_info.data.orderLogs&&order_info.data.orderLogs.length==4&&order_info.data.evaluateState!=3}">
                </div>
              </div>
            </div>
          </div>
          <div class="progress_item">
            <p>{{L['评价']}}</p>
            <div class="progress flex_row_center_center">
              <span :class="{active:order_info.data.evaluateState==3}">5</span>
            </div>
          </div>
        </div>
        <!-- 交易关闭订单 -->
        <div v-if="order_info.data.orderState==0" class="top_info_progress flex_row_center_center">
          <div class="progress_item">
            <p>{{L['提交订单']}}</p>
            <div class="progress flex_row_center_center">
              <span :class="{active:order_info.data.orderLogs&&order_info.data.orderLogs.length>=1}">1</span>
              <div class="progress_line">
                <div
                  :class="{content:true,active:order_info.data.orderLogs&&order_info.data.orderLogs.length>=1,current:order_info.data.orderLogs&&order_info.data.orderLogs.length==1}">
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
      <div
        v-if="(order_info.data.orderState == 30 ||order_info.data.orderState == 40)&&order_info.data.isVirtualGoods==1"
        class="logistics_info flex_row_start_center">
        <div class="logistics_info_left flex_row_center_center">
          <div class="image flex_row_center_center">
            <img :src='logistics_info.data.goodsImage' alt />
            <!-- <coverImage :src='logistics_info.data.goodsImage' width="64" height="64"></coverImage> -->
          </div>
          <div class="info">
            <p>{{L['送货方式']}}：{{logistics_info.data.type==1?'无需物流':'快递'}}</p>
            <p>
              {{logistics_info.data.type==1?L['联系电话']:L['承运人']}}：{{logistics_info.data.type==1?order_info.data.deliverMobile:logistics_info.data.expressName}}
            </p>
            <p>
              {{logistics_info.data.type==1?L['联系人']:L['运单号']}}：{{logistics_info.data.type==1?order_info.data.deliverName:logistics_info.data.expressNumber}}
            </p>
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
            {{order_info.data.invoice? order_info.data.invoice.invoiceTitle:'--'}}
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
            {{order_info.data.childOrdersVOS?order_info.data.childOrdersVOS[0].storeName:'--'}}
          </div>
        </div>
        <div class="order_info_item" v-if="order_info.data.isVirtualGoods==1">
          <div class="overflow_ellipsis_two" :title="order_info.data.receiverAreaInfo+order_info.data.receiverAddress">
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
        <div class="order_info_item" v-if="order_info.data.tradeSn">
          <div>
            <span>{{L['交易流水号']}}：</span>
            {{order_info.data.tradeSn}}
          </div>
        </div>

        <div v-if="order_info.data.isVirtualGoods==2&&order_info.data.orderReserveList.length">
          <template v-for="(item,index) in order_info.data.orderReserveList" :key="index">
            <div v-show="item.reserveValue" class="order_info_item">
              <div>
                <span>{{item.reserveName}}：</span>
                {{item.reserveValue}}
              </div>
            </div>
          </template>
        </div>

      </div>
      <div class="order_mark">
        <p>{{order_info.data.orderState==0&&order_info.data.payState==1?'订单取消备注':'订单备注'}}</p>
        <div class="order_mark_item" v-if="order_info.data.orderState==0&&order_info.data.payState==1">
          <span>{{order_info.data.refuseRemark?order_info.data.refuseRemark:'--'}}</span>
        </div>
        <div class="order_mark_item" v-else>
          <span>{{order_info.data.orderRemark?order_info.data.orderRemark:'--'}}</span>
        </div>
      </div>
      <div class="shop_info" v-if="order_info.data.childOrdersVOS">
        <p>{{L['商品信息']}}</p>
        <div class="shop_title flex">
          <div class="detail">{{L['商品详情']}}</div>
          <div class="price">{{L['单价']}}</div>
          <div class="num">{{L['数量']}}</div>
          <div v-if="order_info.data.orderState==20||order_info.data.orderState==30||order_info.data.orderState==40"
            class="oprate">{{L['操作']}}</div>
        </div>
        <div v-for="(storeItem,index) in order_info.data.childOrdersVOS" :key="index">
          <div v-for="(goodItem,index) in storeItem.orderProductListVOList" :key="index" class="good_item flex">
            <div class="good_info flex">
              <div class="image flex_row_center_center">
                <!-- <img :src="goodItem.productImage" alt /> -->
                <coverImage :src='goodItem.productImage' width="64" height="64"></coverImage>

              </div>
              <div class="good_info_con">
                <router-link :to="`/goods/detail?productId=${goodItem.productId}`" class="name" target="_blank">
                  <span class="gift" v-if="goodItem.isGift==1">赠品</span>{{goodItem.goodsName}}
                </router-link>
                <!-- <div class="name">{{goodItem.goodsName}}</div> -->
                <div class="spec">{{goodItem.specValues}}</div>
              </div>
            </div>
            <div class="price flex_row_center_center">{{goodItem.productShowPrice}}</div>
            <div class="num flex_row_center_center">*{{goodItem.productNum}}</div>
            <div v-if="order_info.data.orderState==20||order_info.data.orderState==30||order_info.data.orderState==40"
              class="oprate flex_row_center_center">
              <!-- 退款中 可查看退款详情  售后按钮，100-退款（商家未发货），200-退款（商家发货,买家未收货），300-申请售后，401-退款中，402-退款完成,403-换货中，404-换货完成	301,退款失败-平台审核失败-->
              <span class="refund_btn pointer "
                v-if="(goodItem.afsButton == 401 || goodItem.afsButton == 402 || goodItem.afsButton == 403 || goodItem.afsButton == 404 || goodItem.afsButton == 301)&&goodItem.isGift==0"
                @click.stop="goRefundDetail(goodItem.afsSn)">{{goodItem.afsButtonValue}}</span>
              <!-- 退款 可申请退款-->
              <span class="refund_btn pointer"
                v-if="(goodItem.afsButton == 100 || goodItem.afsButton == 200 || goodItem.afsButton == 300)&&goodItem.isGift==0"
                @click.stop="selectService(goodItem.orderProductId,order_info.data.orderSn)">{{goodItem.afsButtonValue}}</span>

              <!-- 赠品不能申请售后 -->
              <span class="refund_btn" v-if="goodItem.isGift==1">--</span>

            </div>
          </div>
        </div>
      </div>
      <div class="settle_info">
        <p>
          {{L['商品总额']}}：
          <span>¥{{order_info.data.totalMoney}}</span>
        </p>
        <p>
          {{L['满优惠']}}：
          <span>-¥{{order_info.data.fullDiscountAmount}}</span>
        </p>
        <p>
          {{L['运费金额']}}：
          <span>+¥{{order_info.data.totalExpress}}</span>
        </p>
        <p v-if="order_info.data.storeVoucherAmount>0">
          {{L['店铺优惠券']}}：
          <span>-¥{{order_info.data.storeVoucherAmount}}</span>
        </p>
        <p v-if="order_info.data.platformVoucherAmount>0">
          {{L['平台优惠券']}}：
          <span>-¥{{order_info.data.platformVoucherAmount}}</span>
        </p>
        <p v-if="order_info.data.integralCashAmount>0">
          {{L['积分抵扣']}}：
          <span>-¥{{order_info.data.integralCashAmount}}</span>
        </p>
        <p class="total">
          {{L['实际金额']}}：
          <span>¥{{order_info.data.actualPayment}}</span>
        </p>
      </div>
    </div>
    <!-- 取消地址理由弹窗 start -->
    <el-dialog :title="L['取消订单理由']" v-model="cancel_order" customClass="select_reason_width" :before-close="handleClose"
      lock-sroll="false">
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
          <span class="address_text">
            <div>{{L['收货地址']}}：</div>
            <div>{{item.addressAll}} {{item.detailAddress}}</div>
          </span>
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
      // const balance = require("../../assets/buy/balance.png");
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
      const afsState = ref(true)
      const getOrderDetail = () => {
        proxy
          .$post("v3/business/front/orderInfo/detail", {
            orderSn: route.query.orderSn
          }).then(res => {
            if (res.state == 200) {
              order_info.data = res.data;
              if ((order_info.data.orderState == 30 || order_info.data.orderState == 40) && order_info.data.isVirtualGoods == 1) {
                lookLogistics(order_info.data.orderSn);
              }
              order_info.data.childOrdersVOS.map(child => {
                child.orderProductListVOList.map(item => {
                  if (item.afsButton == 200 || item.afsButton == 201) {
                    afsState.value = false
                  }
                })
              })
            } else {
              ElMessage(res.msg);
            }
          })
          .catch(() => {
            //异常处理
          });
      };
      // 获取订单取消理由列表
      const getCancelList = () => {
        proxy
          .$get("v3/system/front/reason/list", {
            type: 104
          })
          .then(res => {
            if (res.state == 200) {
              cancel_list.data = res.data;
            } else {
              ElMessage(res.msg);
            }
          })
          .catch(() => {
            //异常处理
          });
      };
      //选择理由
      const selectReason = id => {
        current_reason_id.value = id;
      };
      //显示选择理由弹窗
      const showSelectReasonDialog = orderSn => {
        if (!order_info.data.isRefundDeposit && (order_info.data.orderType == 105 || order_info.data.orderType == 103) && order_info.data.orderSubState == 102) {
          ElMessageBox.confirm('取消该订单定金不予退还,确定取消?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            cancel_order.value = true;
            order_sn.value = orderSn;
          })
        } else {
          cancel_order.value = true;
          order_sn.value = orderSn;
        }

      };
      //确认取消订单
      const confirmCancel = () => {
        if (!current_reason_id.value) {
          ElMessage.warning(L['请选择取消理由']);
          return;
        }
        proxy
          .$post("v3/business/front/orderOperate/cancel", {
            parentSn: order_sn.value,
            reasonId: current_reason_id.value
          })
          .then(res => {
            if (res.state == 200) {
              ElMessage.success(L['取消订单成功']);
              cancel_order.value = false;
              getOrderDetail();
            } else {
              ElMessage(res.msg);
            }
          })
          .catch(() => {
            //异常处理
          });
      };
      //删除订单
      const delOrder = orderSn => {
        ElMessageBox.confirm(L['确认删除该订单?'], L['提示'], {
          confirmButtonText: L['确定'],
          cancelButtonText: L['取消'],
          type: "warning"
        })
          .then(() => {
            proxy
              .$post("v3/business/front/orderOperate/delete", {
                orderSn
              })
              .then(res => {
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
        })
          .then(() => {
            proxy
              .$post("v3/business/front/orderOperate/receive", {
                orderSn
              })
              .then(res => {
                if (res.state == 200) {
                  ElMessage.success(L['确认收货成功']);
                  getOrderDetail();
                } else {
                  ElMessage(res.msg);
                }
              })
              .catch(() => {
                //异常处理
              });
          })
          .catch(() => { });
      };
      //选择地址
      const editAddress = order => {

        show_select_address.value = true;
        order_sn.value = order.orderSn;

        let { receiverAddress, receiverAreaInfo, receiverMobile, receiverName } = order

        let index = address_list.data.findIndex(i => {
          let { addressAll, memberName, telMobile, detailAddress } = i
          if (memberName == receiverName && receiverMobile == telMobile && receiverAddress == detailAddress && addressAll == receiverAreaInfo) {
            return true
          } else {
            return false
          }
        })

        if (index > -1) {
          current_address_index.value = index
        } else {
          current_address_index.value = -1

        }

      };
      //获取地址列表
      const getAddressList = () => {
        proxy
          .$get("v3/member/front/memberAddress/list")
          .then(res => {
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
        proxy
          .$post("v3/business/front/orderOperate/updateAddress", {
            orderSn: order_sn.value,
            addressId: address_list.data[current_address_index.value].addressId
          })
          .then(res => {
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
        proxy
          .$get("v3/business/front/logistics/order/getTrace", {
            orderSn
          })
          .then(res => {
            if (res.state == 200) {
              logistics_info.data = res.data;
            } else {
              ElMessage(res.msg);
            }
          })
          .catch(() => {
            //异常处理
          });
      };
      //评价订单
      const remainEvaluated = (orderSn) => {
        router.push({
          path: "/member/order/evaluate",
          query: {
            orderSn: orderSn,
          }
        });
      }
      //立即支付
      const goPay = orderSn => {
        router.push({
          path: "/buy/pay",
          query: {
            paySn: orderSn,
            payFrom: 2
          }
        });
      };
      //选择售后服务
      const selectService = (orderProductId, orderSn) => {

        proxy.$get('v3/business/front/after/sale/apply/applyInfo', {
          orderSn,
          orderProductId
        }).then(res => {
          if (res.state == 200) {
            router.push({
              path: "/member/order/refund/apply",
              query: {
                orderState: order_info.data.orderState,
                orderProductId
              }
            });
          } else {
            ElMessage(res.msg)
          }
        })



      }
      //查看售后详情
      const goRefundDetail = (afsSn) => {
        router.push({
          path: '/member/order/refund/detail',
          query: {
            orderState: order_info.data.orderState,
            afsSn
          }
        })
      }
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
        remainEvaluated,
        selectService,
        goPay,
        goRefundDetail,
        afsState
      };
    }
  };
</script>
<style lang="scss">
  @import "../../../style/member/orderDetail.scss";
</style>