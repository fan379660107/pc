<template>
  <div class="sld_login">
    <div class="sld_login_header">
      <div class="content">
        <router-link tag="a" class="l_logo" :to="`/index`">
          <img class="img" :src="configInfo.main_site_logo" :onerror="defaultImg" alt />
        </router-link>
        <div class="r_register_wrap">
          {{L['还没注册？']}}
          <a class="go_register_btn" href="javascript:void(0)" @click="goToPage('/register')">{{L['去注册']}}</a>
        </div>
      </div>
    </div>
    <div class="sld_login_content">
      <img class="bg" :src="configInfo.main_user_logon_bg" :onerror="defaultBgImg" alt />
      <div class="login">
        <div class="login_box">
          <div class="qrLogin" @click="changeQrlog">
            <img class="qrLeft" :src="QRcodeLogin?idCode:qrCode">
            <img v-if="QRcodeLogin" style="width:110px;cursor:pointer" class="qrRight " :src="idLogin">
            <img v-else class="qrRight" :src="qrLogin" style="cursor:pointer">
          </div>
          <template v-if="!QRcodeLogin">
            <div class="top">
              <div :class="{item:true,active:loginType == 1}" @click="changeLoginType(1)">{{L['账号登录']}}</div>
              <div :class="{item:true,active:loginType == 2}" @click="changeLoginType(2)">{{L['手机登录']}}</div>
            </div>
            <div class="center">
              <template v-if="loginType == 1">
                <div class="item account">
                  <span style="color: #BBB;font-size: 19px;padding-top: 7px" class="icon iconfont icon-wode"></span>
                  <input type="text" v-model="name" :placeholder="L['请输入账号/手机号']" class="input" autocomplete="off" />
                  <div data-type="userName" class="cancel" @click="clearInputVal('name')">
                    <span style="color: #bbb;" class="iconfont icon-cuowu"></span>
                  </div>
                </div>
                <div class="item password">
                  <span style="color: #BBB;font-size: 21px;padding-top: 7px" class="icon iconfont icon-mima1"></span>
                  <input type="password" v-model="password" :placeholder="L['请输入密码']" class="input"
                    autocomplete="new-password" />
                  <div data-type="password" class="cancel" @click="clearInputVal('password')">
                    <span style="color: #bbb" class="iconfont icon-cuowu"></span>
                  </div>
                </div>
              </template>
              <template v-if="loginType == 2">
                <div class="item account">
                  <span style="color: #BBB;font-size: 21px;padding-top: 7px" class="icon iconfont icon-shouji2"></span>
                  <input type="text" v-model="name" :placeholder="L['请输入手机号']" class="input" autocomplete="off" />
                  <div data-type="userName" class="cancel" @click="clearInputVal('name')">
                    <span style="color: #bbb;" class="iconfont icon-cuowu"></span>
                  </div>
                </div>
                <div class="item password">
                  <span style="color: #BBB;font-size: 18px;padding-top: 8px"
                    class="icon iconfont icon-yanzhengma2"></span>
                  <input type="text" v-model="password" :placeholder="L['请输入验证码']" class="input" autocomplete="off" />
                  <a href="javascript:void(0);" class="send_code"
                    @click="getSmsCode">{{countDownM?(countDownM+L['s后获取']):L['获取验证码']}}</a>
                </div>
              </template>
              <div class="error">
                <span v-if="errorMsg" style="color: #e1251b;font-size: 14px" class="iconfont icon-jubao"></span>
                {{errorMsg}}
              </div>
              <a href="javascript:void(0)" @click="login" class="login_btn">{{L['登录']}}</a>
            </div>
          </template>
          <template v-else>
            <div class="qrMain">
              <div class="qrMain_code">
                <div class="qrMain_code_bg"
                  :style="`filter:blur(${QRout?'1px':'0'});background-image:url(${QRlogShow});background-size:112% 112%;background-position:center;`">
                </div>
                <div v-if="QRout" class="qrMain_code_cover">
                  <p>二维码已失效</p>
                  <div @click="reCreateQRcode">点击刷新</div>
                </div>
                <div v-else-if="QRsuccess" class="qrMain_code_cover">
                  <p class="qrMain_code_cover_p">登录成功</p>
                </div>
              </div>
              <p class="qrMain_title">打开手机商城，扫描二维码</p>
              <div class="qrMain_tips">
                <div class="qrMain_tips_item">
                  <span style="color:#999999;font-size:16px;" class="icon iconfont icon-zhuce-mianshuru"></span>
                  <span>免输入</span>
                </div>
                <div class="qrMain_tips_item">
                  <span style="color:#999999;font-size:16px;" class="icon iconfont icon-genganquan"></span>
                  <span>反应快</span>
                </div>
                <div class="qrMain_tips_item">
                  <span style="color:#999999;font-size:16px;" class="icon iconfont icon-a-kuaijin1"></span>
                  <span>更安全</span>
                </div>
              </div>
            </div>
          </template>
          <div :class="{bottom:true, flex_row_between_center:wxEnable==1, flex_row_end_center:wxEnable!=1}">
            <img src="../../../assets/wechat_login.png" alt="" @click="wetChatLogin" v-if="wxEnable==1">
            <div style="display: flex;">
              <a href="javascript:void(0)" @click="goToPage('/register')">{{L['立即注册']}}</a>
              <router-link tag="a" :to="`/pwd/forget`">{{L['忘记密码']}}</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { useRouter, onBeforeRouteLeave, useRoute } from "vue-router";
  import { ref, getCurrentInstance, onMounted, watch } from "vue";
  import { useStore } from "vuex";
  import { ElMessage } from 'element-plus'
  export default {
    name: "LoginIndex",
    setup() {
      const store = useStore();
      const router = useRouter();
      const route = useRoute()
      const { proxy } = getCurrentInstance();
      const L = proxy.$getCurLanguage();
      const keyEnter = ref(true)
      const errorMsg = ref(); //错误提示
      const name = ref(""); //用户名
      const password = ref(""); //密码
      const loginType = ref(1); //登陆类型：1-账号密码登陆，2-手机验证码登陆
      const clickSmscode = ref(false); //是否获取验证码中
      const countDownM = ref(0); //短信验证码倒计时
      const timeOutId = ref(""); //定时器的返回值
      const configInfo = ref(store.state.configInfo);
      const defaultImg = ref(
        'this.src="' + require("../../../assets/common_top_logo.png") + '"'
      );
      const defaultBgImg = ref(
        'this.src="' + require("../../../assets/login_bg.png") + '"'
      );
      const fromurl = ref('');
      const wxEnable = ref("");
      const pcAppid = ref("");

      /* 二维码登录 */
      const QRlogShow = ref('');
      const QRissend = ref(null); //二维码登录定时器
      const QRcheck = ref(null);  //二维码循环定时器
      const QRsuccess = ref(false); //二维码登录成功
      const QRout = ref(false); //二维码是否过期
      const QRcodeLogin = ref(false); //二维码登录
      const qrCode = require('../../../assets/qrCode.png');
      const qrLogin = require('../../../assets/qrLogin.png');
      const idCode = require('../../../assets/idCode.png');
      const idLogin = require('../../../assets/idLogin.png');
      /* 二维码登录 */

      //由于这里的回车键触发事件和商品搜索框的回车键触发事件冲突，引入keyEnter变量判断
      document.onkeydown = function () {
        var key = window.event.keyCode;
        if (key == 13 && keyEnter.value) {
          login();
        }
      };
      const login = () => {
        let param = {};
        param.username = name.value;
        param.password = password.value;
        param.loginType = loginType.value;
        if (param.loginType == 1) {
          //账号、手机号的验证
          if (!param.username) {
            errorMsg.value = L["请输入账号/手机号"];
            return false;
          } else {
            let checkName = proxy.$checkMemberName(param.username);
            if (checkName !== true) {
              //继续验证是否是手机号
              let checkMobile = proxy.$checkPhone(param.username);
              if (checkMobile !== true) {
                errorMsg.value = L["请输入正确的账号/手机号"];
                return false;
              }
            }
          }

          //密码校验
          if (!param.password) {
            errorMsg.value = L["请输入密码"];
            return false;
          } else {
            let checkPwd = proxy.$checkPwd(param.password);
            if (checkPwd !== true) {
              errorMsg.value = checkPwd;
              return false;
            }
          }
        } else {
          //手机号验证
          if (!param.username) {
            errorMsg.value = L["请输入手机号"];
            return false;
          } else {
            let checkMobile = proxy.$checkPhone(param.username);
            if (checkMobile !== true) {
              errorMsg.value = checkMobile;
              return false;
            }
          }

          //验证码校验
          if (!param.password) {
            errorMsg.value = L["请输入短信验证码"];
            return false;
          } else {
            let checkSmsCode = proxy.$checkSmsCode(param.password);
            if (checkSmsCode !== true) {
              errorMsg.value = checkSmsCode;
              return false;
            }
          }
        }
        //如果未登录vuex中有购物车数据，需同步到该用户
        let cartInfo = [];
        let cartListData = store.state.cartListData;
        if (JSON.stringify(cartListData) != "{}") {
          cartListData.storeCartGroupList.map(cartListItem => {
            cartListItem.promotionCartGroupList.map(promotItem => {
              promotItem.cartList.map(cartItem => {
                cartInfo.push({
                  productId: cartItem.productId,
                  buyNum: cartItem.buyNum
                });
              });
            });
          });
        }
        param.cartInfo = JSON.stringify(cartInfo);
        proxy.$post("v3/frontLogin/oauth/token", param).then(res => {
          if (res.state == 200) {
            //将用户信息存缓存，并跳转到首页
            localStorage.setItem("access_token", res.data.access_token);
            localStorage.setItem("refresh_token", res.data.refresh_token);
            localStorage.setItem("time", new Date().getTime().toString()); //存储refresh_token更新时间
            //获取用户信息，并同步信息到vuex
            proxy.$get("v3/member/front/member/getInfo").then(res => {
              if (res.state == 200) {
                store.commit("updateMemberInfo", res.data);
                proxy.$getLoginCartListData(); //更新购物车数据
                if (QRcodeLogin.value) {
                  clearTimeout(QRissend.value);
                  clearInterval(QRcheck.value);
                  QRissend.value = null;
                  QRcheck.value = null;
                }
                if (window.history.state.back) {
                  router.back();
                } else {
                  router.replace({ path: '/member/index' })
                }
              }
            });
            countDownM.value = 60;
            countDown();
          } else {
            //提示错误
            errorMsg.value = res.msg;
          }
        });
      };
      //清空输入框内容
      const clearInputVal = type => {
        if (type == "name") {
          name.value = "";
        } else if (type == "password") {
          password.value = "";
        }
      };
      //登录方式切换
      const changeLoginType = type => {
        loginType.value = type;
        name.value = "";
        password.value = "";
        errorMsg.value = "";
      };
      //获取短信验证码
      const getSmsCode = () => {
        if (clickSmscode.value) {
          return;
        } else if (countDownM.value) {
          return false;
        }
        clickSmscode.value = true;
        let checkMobile = proxy.$checkPhone(name.value);
        if (checkMobile !== true) {
          errorMsg.value = checkMobile;
          clickSmscode.value = false;
        } else {
          let param = {};
          param.mobile = name.value;
          param.type = "free";
          proxy.$get("v3/msg/front/commons/smsCode", param).then(res => {
            if (res.state == 200) {
              countDownM.value = 60;
              countDown();
              clickSmscode.value = false;
            } else {
              //提示错误
              errorMsg.value = res.msg;
              clickSmscode.value = false;
            }
          });
        }
      };
      //倒计时
      const countDown = () => {
        countDownM.value--;
        if (countDownM.value == 0) {
          clearTimeout(timeOutId.value);
        } else {
          timeOutId.value = setTimeout(countDown, 1000);
        }
      };
      //通过replace方式跳转页面
      const goToPage = type => {
        router.replace({
          path: type
        });
      };

      // 微信二维码登录
      const wetChatLogin = () => {
        let href = `https://open.weixin.qq.com/connect/qrconnect?appid=${pcAppid.value}&redirect_uri=${encodeURIComponent(fromurl.value)}&response_type=code&scope=snsapi_login&state=2or3m#wechat_redirect`
        window.open(href, "_blank")
      }

      const getWxEnbale = () => {
        proxy.$get('v3/system/front/setting/getSettings', { names: 'login_wx_pc_is_enable,login_wx_pc_appid' }).then(res => {
          if (res.state == 200) {
            wxEnable.value = res.data[0]
            pcAppid.value = res.data[1]
          }
        })
      }

      // 切换账号密码/二维码登录
      const changeQrlog = () => {
        QRcodeLogin.value = !QRcodeLogin.value
        if (QRcodeLogin.value && !QRissend.value) {
          createQRcode();
        }
      }

      // 刷新二维码
      const reCreateQRcode = () => {
        setTimeout(() => {
          QRout.value = false;
          createQRcode();
        }, 200)
      }

      // 生成二维码 (过期定时器、获取扫码状态定时器)
      const createQRcode = () => {
        proxy.$get('v3/member/front/qr/login/createQr')
          .then(res => {
            /* 二维码图片 */
            QRlogShow.value = 'data:image/png;base64,' + res.data.image
            /* 过期定时器 */
            QRissend.value = setTimeout(() => {
              console.log('-----二维码过期-----')
              clearTimeout(QRissend.value);
              clearInterval(QRcheck.value);
              QRissend.value = null;
              QRcheck.value = null;
              QRout.value = true;
            }, 300000);
            /* ------ end ------ */

            let param = {
              u: res.data.u
            }
            /* 获取扫码状态定时器 */
            QRcheck.value = setInterval(() => {
              proxy.$post('v3/member/front/qr/login/progress', param)
                .then(result => {
                  if (result.data.progress == 2) {
                    console.log('-----授权登录成功-----');
                    QRsuccess.value = true;
                    clearTimeout(QRissend.value);
                    clearInterval(QRcheck.value);
                    QRissend.value = null;
                    QRcheck.value = true;

                    localStorage.setItem("refresh_token", result.data.refreshToken);
                    /* 更新 access_token */
                    let params = new FormData();
                    params.append('grant_type', 'refresh_token');
                    params.append('refresh_token', result.data.refreshToken);
                    proxy.$post('v3/frontLogin/oauth/token', params, {
                      headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': 'Basic ZnJvbnQ6ZnJvbnQ='
                      }
                    }).then((response) => {
                      if (response.state == 200) {
                        localStorage.setItem('access_token', response.data.access_token);
                        localStorage.setItem('time', new Date().getTime().toString());  //存储refresh_token更新时间

                        /* 获取用户信息，并同步信息到vuex */
                        proxy.$get("v3/member/front/member/getInfo").then(res_info => {
                          if (res_info.state == 200) {
                            store.commit("updateMemberInfo", res_info.data);
                            proxy.$getLoginCartListData(); //更新购物车数据
                            if (window.history.state.back) {
                              router.back();
                            } else {
                              router.replace({ path: '/member/index' })
                            }
                          }
                        });
                        /* ------ end ------ */

                      }
                    }, err => {
                      console.log('更新access_token出错：', err);
                    })
                    /* ------ end ------ */

                  }
                })
            }, 3000)
            /* ------ end ------ */
          })
      }

      watch([name, password], () => {
        if (loginType.value == 1) {
          password.value = password.value.substring(0, 20)
          name.value = name.value.substring(0, 20)

        } else {
          password.value = password.value.substring(0, 6)
          name.value = name.value.substring(0, 11)
        }

        if (password.value || name.value) {
          errorMsg.value = ''
        }
      })

      onMounted(() => {
        getWxEnbale()
        if (route.query.redirectUrl) {

          fromurl.value = window.location.origin + decodeURIComponent(route.query.redirectUrl)
        } else {
          fromurl.value = window.location.origin
        }

        if (route.query.error) {
          ElMessage.error(decodeURIComponent(route.query.error))
        }

      })

      onBeforeRouteLeave(() => {
        keyEnter.value = false
      })


      return {
        L,
        loginType,
        login,
        name,
        password,
        clearInputVal,
        errorMsg,
        changeLoginType,
        getSmsCode,
        clickSmscode,
        countDownM,
        goToPage,
        configInfo,
        defaultImg,
        defaultBgImg,
        wetChatLogin,
        wxEnable,
        QRcodeLogin,
        QRissend,
        QRout,
        qrCode,
        qrLogin,
        idCode,
        idLogin,
        changeQrlog,
        reCreateQRcode,
        createQRcode,
        QRlogShow,
        QRcheck,
        QRsuccess
      };
    }
  };
</script>
<style lang="scss" scoped>
  @import "../../../style/login.scss";
</style>