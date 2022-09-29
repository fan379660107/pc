// 头部登陆注册导航栏
<template>
  <div class="header_wrap">
    <div class="header">
      <div class="header_left">
        <span class="hello">{{L['您好，欢迎来到']}}{{configInfo.data.basic_site_name}}</span>
        <template v-if="loginFlag">
          <span class="register h1"
            @click="goToByPush('/member/index')">{{memberInfo.memberNickName||memberInfo.memberName}}</span>
          <span class="register h1 login_out" @click="loginOut()">[{{L['退出']}}]</span>
        </template>

        <template v-if="!loginFlag">
          <span class="register h1" @click="goToByPush('/login')">{{L['登录']}}</span>
          <span class="register h1" @click="goToByPush('/register')">{{L['注册']}}</span>
        </template>
      </div>
      <div class="header_right">
        <ul>
          <li @click="goToByPush('/index',{})">
            <div class="li_item">{{L['商城首页']}}</div>
          </li>
          <li>
            <div class="has_more li_item">
              {{L['我的订单']}}
              <div class="li_item_more">
                <a href="javascript:void(0)" class="li_item_more_item"
                  @click="goToByPush('/member/order/list',{'orderState':10})">{{L['待支付订单']}}</a>
                <a href="javascript:void(0)" class="li_item_more_item"
                  @click="goToByPush('/member/order/list',{'orderState':30})">{{L['待收货订单']}}</a>
                <a href="javascript:void(0)" class="li_item_more_item"
                  @click="goToByPush('/member/order/evaluation')">{{L['待评价订单']}}</a>
              </div>
            </div>
          </li>
          <li @click="goToByPush('/member/index')">
            <div class="li_item">{{L['个人中心']}}</div>
          </li>
          <li>
            <div class="has_more li_item">
              {{L['我的收藏']}}
              <div class="li_item_more">
                <a href="javascript:void(0)" class="li_item_more_item"
                  @click="goToByPush('/member/collect')">{{L['商品收藏']}}</a>
                <a href="javascript:void(0)" class="li_item_more_item"
                  @click="goToByPush('/member/collect',{type:'store'})">{{L['店铺收藏']}}</a>
                <a href="javascript:void(0)" class="li_item_more_item"
                  @click="goToByPush('/member/footprint')">{{L['我的足迹']}}</a>
              </div>
            </div>
          </li>
          <li>
            <div class="has_more li_item">
              {{L['我的账户']}}
              <div class="li_item_more">
                <a href="javascript:void(0)" class="li_item_more_item"
                  @click="goToByPush('/member/coupon')">{{L['我的优惠券']}}</a>
                <a href="javascript:void(0)" class="li_item_more_item"
                  @click="goToByPush('/member/balance')">{{L['我的余额']}}</a>
              </div>
            </div>
          </li>
          <li @click="goToByPush('/service',{vid:0})">
            <div class="li_item">官方客服</div>
          </li>
          <li @click="goToByPush('/article')">
            <div class="li_item">{{L['服务中心']}}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import { useRouter } from "vue-router";
  import { useStore } from "vuex";
  import { getCurrentInstance, reactive } from "vue";
  export default {
    name: "NavTopBar",
    setup() {
      const { proxy } = getCurrentInstance();
      const store = useStore();
      const L = proxy.$getCurLanguage();
      const memberInfo = store.state.memberInfo;
      const loginFlag = store.state.loginFlag;
      const router = useRouter();
      const configInfo = reactive({ data: {} })
      //去注册
      const goRegister = () => {
        router.push({
          path: `/register`,
          query: {
            redirect: encodeURIComponent(window.location.href)
          }
        });
      };
      // 获取系统配置信息
      const getSystemConfigInfo = () => {
        proxy
          .$get("v3/system/front/setting/getSettings", {
            names: "main_site_logo,main_user_center_logo,main_user_logon_bg,main_user_register_bg,pc_home_bottom_adv,main_user_forget_password_bg,basic_site_name,basic_site_icp,basic_site_copyright,basic_site_technical_support,platform_customer_service_name,platform_customer_service_logo"
          })
          .then(res => {
            if (res.state == 200) {
              configInfo.data = {
                main_site_logo: res.data[0],
                main_user_center_logo: res.data[1],
                main_user_logon_bg: res.data[2],
                main_user_register_bg: res.data[3],
                pc_home_bottom_adv: res.data[4],
                main_user_forget_password_bg: res.data[5],
                basic_site_name: res.data[6],
                basic_site_icp: res.data[7],
                basic_site_copyright: res.data[8],
                basic_site_technical_support: res.data[9],
                platform_customer_service_name: res.data[10],
                platform_customer_service_logo: res.data[11]
              }
              store.commit('updateConfigInfo', configInfo.data);
            }
          })
          .catch(() => {
            //异常处理
          });
      };
      getSystemConfigInfo();
      //前往具体的页面，type为具体的页面地址，param为参数对象
      const goToByPush = (type, param = {}) => {

        if (type == '/service') {
          let chatInfo = {
            storeId: 0,
            vendorAvatar: configInfo.data.platform_customer_service_logo,
            storeName: configInfo.data.platform_customer_service_name,
            showData: {},
            source: ''
          }
          store.commit('saveChatBaseInfo', chatInfo)

          let newWin = router.resolve({
            path: type,
            query: param
          })

          window.open(newWin.href, '_blank')
          return
        }

        router.push({
          path: type,
          query: param
        });
      };
      //退出登录
      const loginOut = () => {
        store.commit("clearAllData"); //清除数据
        proxy.$socket.disconnect()
        goToByPush("/login", {});
      };
      return { L, goRegister, memberInfo, loginOut, loginFlag, goToByPush, configInfo };
    }
  };
</script>

<style lang="scss" scoped>
  .header_wrap {
    width: 100%;
    height: 33px;
    background: #f7f7f7;
    display: flex;
    align-items: center;
    justify-content: center;

    .header {
      width: 1210px;
      height: 33px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .header_left {
        height: 100%;
        font-size: 12px;
        color: #999;
        line-height: 36px;
        display: flex;

        .hello {
          margin-right: 20px;
          color: #999;
        }

        .h1 {
          margin: 0 5px;
          cursor: pointer;

          &:hover {
            color: $colorMain;
          }
        }
      }

      .header_right {
        height: 100%;

        ul {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;

          .personal_center {
            width: 121px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          li {
            float: left;
            text-align: center;
            border-right: 1px solid #ddd;
            padding: 0 10px;
            height: 12px;

            .li_item {
              position: relative;
              cursor: pointer;
              font-size: 12px;
              line-height: 12px;
              color: #999;
              height: 33px;

              &:hover {
                color: $colorMain;

                &.has_more {
                  &:before {
                    border-top-color: $colorMain;
                  }
                }

                .li_item_more {
                  display: block;
                }
              }

              &.has_more {
                padding-right: 12px;

                &:before,
                &:after {
                  position: absolute;
                  right: -2px;
                  display: block;
                  width: 0;
                  height: 0;
                  content: " ";
                  border: 4px solid transparent;
                  border-radius: 2px;
                }

                &:before {
                  top: 3px;
                  border-top: 5px solid #888;
                }

                &:after {
                  top: 1px;
                  border-top: 5px solid #f7f7f7;
                }
              }

              .li_item_more {
                position: absolute;
                width: 80px;
                padding: 5px 3px;
                left: 50%;
                transform: translateX(-50%);
                top: 21px;
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

                .li_item_more_item {
                  display: block;
                  text-align: center;
                  color: #999;
                  line-height: 12px;
                  padding: 8px 0;

                  &:hover {
                    color: $colorMain;
                  }
                }
              }
            }

            &:last-child {
              border-right-width: 0;
              padding-right: 0;
            }
          }
        }
      }
    }
  }
</style>