<!--个人中心左侧公共导航 @zjf-2020-12-26-->
<template>
  <div class="sld_member_left_nav">
    <template v-for="(item,index) in leftNavMenu" :key="index">
      <router-link :to="{path:item.path}" class="menu">
        <i :class="{iconfont:true,[item.icon]:true}"></i>
        {{item.name}}
      </router-link>
      <template v-if="item.child.length">
        <template v-for="(item_child,index_child) in item.child" :key="index_child">
          <router-link v-if="testIfShow(item_child)" :to="{path:item_child.path,query:item_child.query}"
            :class="{submenu:true,cur_code_active:curCode == item_child.code}">{{item_child.name}}</router-link>
        </template>
      </template>
    </template>
  </div>
</template>

<script>
  import { getCurrentInstance, watchEffect, ref } from "vue";
  import { useRouter } from "vue-router";
  import { useStore } from "vuex";
  export default {
    name: "MemberLeftNav",
    components: {},
    setup() {
      const store = useStore();
      const router = useRouter();
      const { proxy } = getCurrentInstance();
      const L = proxy.$getCurLanguage();
      const curCode = ref("");
      const memberInfo = ref(store.state.memberInfo);
      watchEffect(() => {
        let tmpPath = router.currentRoute.value.fullPath;

        if (
          router.currentRoute.value.name != undefined &&
          router.currentRoute.value.name
        ) {
          curCode.value = router.currentRoute.value.name;
          if (tmpPath == "/member/collect?type=store") {
            curCode.value = "memberCollectStore"; //关注店铺
          } else if (
            tmpPath == "/member/order/aftersales?type=return" ||
            tmpPath.indexOf("/member/order/refund/detail?curTitleId=2") > -1
          ) {
            curCode.value = "AfterSalesListReturn"; //我的退货
          } else if (
            tmpPath == "/member/order/aftersales" ||
            tmpPath.indexOf("/member/order/refund/detail?curTitleId=1") > -1
          ) {
            curCode.value = "AfterSalesList"; //我的退款
          }
        }

        //更新未读消息数量
        // proxy.$get('v3/helpdesk/front/chat/unReadMsgNum').then(res=>{
        //   if (memberInfo.value.msgNum != res.data) {
        //     memberInfo.value.msgNum = res.data;
        //     store.commit("updateMemberInfo", memberInfo.value);
        //   }
        // })
      });
      const leftNavMenu = [
        {
          code: "tarde",
          icon: "icon-gerenzhongxinjiaoyizhongxin",
          name: L["交易中心"],
          path: "/member/index",
          child: [
            {
              code: "memberOrderList",
              name: L["我的订单"],
              path: "/member/order/list"
            },
            {
              code: "MemberOrderEvaluation",
              name: L["交易评价/晒单"],
              path: "/member/order/evaluation"
            },
            {
              code: "pointOrderList",
              name: "积分兑换订单",
              path: "/member/pointOrder/list"
            }
          ]
        },
        {
          code: "collect",
          icon: "icon-gerenzhongxinguanzhu",
          name: L["关注中心"],
          path: "/member/index",
          child: [
            {
              code: "MemberCollect",
              name: L["我的收藏"],
              path: "/member/collect"
            },
            {
              code: "memberCollectStore",
              query: { type: "store" },
              name: L["关注店铺"],
              path: "/member/collect"
            },
            {
              code: "MemberFootprint",
              name: L["我的足迹"],
              path: "/member/footprint"
            }
          ]
        },
        {
          code: "service",
          icon: "icon-gerenzhongxinkehufuwu",
          name: L["客户服务"],
          path: "/member/index",
          child: [
            {
              code: "AfterSalesList",
              name: L["我的退款"],
              path: "/member/order/aftersales"
            },
            {
              code: "AfterSalesListReturn",
              query: { type: "return" },
              name: L["我的退货"],
              path: "/member/order/aftersales"
            }
          ]
        },
        {
          code: "member",
          icon: "icon-gerenzhongxinhuiyuanzhongxin",
          name: L["会员中心"],
          path: "/member/index",
          child: [
            {
              code: "MemberInfo",
              name: L["会员信息"],
              path: "/member/info"
            },
            {
              code: "MemberAccount",
              name: L["账号安全"],
              path: "/member/account"
            },
            {
              code: "MemberPhoneMange",
              name: L["手机号管理"],
              path: "/member/phone"
            },
            {
              code: "memberEmailMange",
              name: L["邮箱管理"],
              path: "/member/email"
            },
            {
              code: "MemberLoginPassword",
              name: L["登录密码"],
              path: "/member/pwd/login"
            },
            {
              code: "MemberPayPassword",
              name: L["支付密码"],
              path: "/member/pwd/pay"
            },
            {
              code: "MemberResetPassword",
              name: L["重置密码"],
              path: "/member/pwd/reset"
            },
            {
              code: "memberAddressList",
              name: L["收货地址"],
              path: "/member/address/list"
            }
          ]
        },
        {
          code: "money",
          icon: "icon-gerenzhongxincaichanzhongxin",
          name: L["我的钱包"],
          path: "/member/index",
          child: [
            {
              code: "MemberBalance",
              name: L["我的余额"],
              path: "/member/balance"
            },
            {
              code: "MemberRecharge",
              name: L["账户充值"],
              path: "/member/recharge"
            },
            {
              code: "MemberCoupon",
              name: "我的优惠券",
              path: "/member/coupon"
            },
            {
              code: "MyPoint",
              name: "我的积分",
              path: "/member/myPoint"
            }
          ]
        }
      ];
      const testIfShow = nav_info => {
        if (nav_info.code == "MemberResetPassword") {
          if (store.state.memberInfo.hasPayPassword == 1) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      };
      return { leftNavMenu, curCode, memberInfo, testIfShow };
    }
  };
</script>

<style lang="scss" scoped>
  .sld_member_left_nav {
    float: left;
    width: 180px;
    color: #666;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    background-color: #fff;
    border: 1px solid #ebebeb;
    border-top: 1px solid #fff;
    margin-top: -1px;
    margin-bottom: 20px;
    padding-bottom: 40px;

    .menu {
      display: block;
      color: #333333;
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      margin-top: 15px;
      margin-bottom: 10px;
      padding-left: 15px;
      padding-top: 22px;
      border-top: 1px solid #EBEBEB;

      &:nth-child(1) {
        margin-top: 0;
        border-top: none;
      }

      i {
        color: #888;
        font-size: 16px;
        font-weight: 400;
        margin-right: 5px;
      }
    }

    .submenu {
      display: block;
      line-height: 30px;
      color: #777777;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      padding-left: 41px;

      &:hover {
        font-weight: bold;
        color: $colorMain2;
      }

      &.cur_code_active {
        font-weight: bold;
        color: $colorMain2;
      }
    }
  }
</style>