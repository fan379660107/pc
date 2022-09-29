<template>
    <div class="sld_login">
        <div class="sld_login_header">
            <div class="content">
                <router-link tag="a" class="l_logo" :to="`/index`">
                    <img class='img' :src="configInfo.main_site_logo" :onerror='defaultImg' alt />
                </router-link>
                <div class="r_register_wrap">
                    {{L['已有账号？']}}
                    <a href="javascript:void(0)" class="go_register_btn" @click="goToPage('/login')">
                        {{L['去登录']}}
                    </a>
                </div>
            </div>
        </div>
        <div class="sld_login_content">
            <img class="bg" :src="configInfo.main_user_register_bg" :onerror='defaultBgImg' alt />
            <div class="login">
                <div class="login_box">
                    <div class="top">
                        <div class="item1">{{L['注册账号']}}</div>
                    </div>
                    <div class="center">
                        <div class="item account">
                            <span style="color: #BBB;font-size: 21px;padding-top: 7px"
                                class="icon iconfont icon-shouji2"></span>
                            <input type="text" v-model="name" :placeholder="L['请输入手机号']" class="input">
                            <div data-type="userName" class="cancel" @click="clearInputVal('name')">
                                <span style="color: #bbb;" class=" iconfont icon-cuowu"></span>
                            </div>
                        </div>
                        <div class="item password">
                            <span style="color: #BBB;font-size: 18px;padding-top: 8px"
                                class="icon iconfont icon-yanzhengma2"></span>
                            <input type="text" v-model="imgCode" :placeholder="L['请输入图形验证码']" class="input">
                            <img :src="showCodeImg" class="img_code" @click="getImgCode" />
                        </div>
                        <div class="item password">
                            <span style="color: #BBB;font-size: 18px;padding-top: 8px"
                                class="icon iconfont icon-yanzhengma2"></span>
                            <input type="text" v-model="password" :placeholder="L['请输入验证码']" class="input">
                            <a href="javascript:void(0);" class="send_code"
                                @click="getSmsCode">{{countDownM?(countDownM+L['s后获取']):L['获取验证码']}}</a>
                        </div>
                        <div class="error">
                            <span v-if="errorMsg" style="color: #e1251b;font-size: 14px"
                                class="iconfont icon-jubao"></span>
                            {{errorMsg}}
                        </div>
                        <a href="javascript:void(0)" @click="login" class="login_btn">{{L['立即注册']}}</a>
                        <div class="agree_wrap">
                            <input type="checkbox" :class="{checkbox:true, default:true, checked:agreeFlag}" />
                            <span class="agree_selected iconfont icon-finish" @click="agree" />
                            <span class="text">
                                {{L['我同意']}}<router-link target="_blank" class="agreement" :to="`/agreement?type=1`">
                                    {{L['《用户注册协议》']}}</router-link>
                                <router-link target="_blank" class="agreement" :to="`/agreement?type=2`">{{L['《隐私政策》']}}
                                </router-link>
                            </span>
                        </div>
                    </div>
                    <div :class="{bottom:true, flex_row_between_center:wxEnable==1, flex_row_end_center:wxEnable!=1}">
                        <img v-if="wxEnable==1" src="@/assets/wechat_login.png" alt="" @click="wetChatLogin">
                        <a href="javascript:void(0)" @click="goToPage('/login')">{{L['已有账号，去登录']}}</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { useRoute, useRouter } from 'vue-router';
    import { ref, getCurrentInstance, onMounted, watch } from 'vue';
    import { useStore } from 'vuex';

    export default {
        name: "Register",
        setup() {
            const store = useStore();
            const route = useRoute();
            const agreeFlag = ref(false);//同意注册协议标识，默认不同意
            const name = ref('');//用户名
            const errorMsg = ref();//错误提示
            const password = ref('');//密码
            const imgCode = ref('');//图形验证码
            const router = useRouter();
            const { proxy } = getCurrentInstance();
            const L = proxy.$getCurLanguage();
            const countDownM = ref(0);//短信验证码倒计时
            const timeOutId = ref('');//定时器的返回值
            const showCodeImg = ref('');//图形验证码图片
            const imgCodeKey = ref('');//图形验证码的key
            const configInfo = ref(store.state.configInfo)
            const defaultImg = ref('this.src="' + require('../../../assets/common_top_logo.png') + '"')
            const defaultBgImg = ref('this.src="' + require('../../../assets/login_bg.png') + '"')
            const preventFre = ref(false)
            const wxEnable = ref("");
            const pcAppid = ref("");
            const fromurl = ref('');
            // 微信二维码注册
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

            const login = () => {
                let param = {};
                param.phone = name.value;
                param.code = password.value;
                param.verifyCode = imgCode.value;
                param.verifyKey = imgCodeKey.value;
                param.source = 1
                //手机号验证
                if (!param.phone) {
                    errorMsg.value = L['请输入手机号'];
                    return false;
                } else {
                    let checkMobile = proxy.$checkMobile(param.phone);
                    if (checkMobile !== true) {
                        errorMsg.value = checkMobile;
                        return false;
                    }
                }

                //验证码校验
                if (!param.code) {
                    errorMsg.value = L['请输入短信验证码'];
                    return false;
                } else {
                    let checkSmsCode = proxy.$checkSmsCode(param.code);
                    if (checkSmsCode !== true) {
                        errorMsg.value = checkSmsCode;
                        return false;
                    }
                }

                if (!agreeFlag.value) {
                    errorMsg.value = '请同意用户注册协议及隐私政策';
                    return false;
                }

                //如果未登录vuex中有购物车数据，需同步到该用户
                let cartInfo = [];
                let cartListData = store.state.cartListData;
                if (JSON.stringify(cartListData) != '{}') {
                    cartListData.storeCartGroupList.map(cartListItem => {
                        cartListItem.promotionCartGroupList.map(promotItem => {
                            promotItem.cartList.map(cartItem => {
                                cartInfo.push({
                                    productId: cartItem.productId,
                                    buyNum: cartItem.buyNum
                                })
                            })
                        })
                    })
                }
                param.cartInfo = JSON.stringify(cartInfo);

                proxy.$post('v3/frontLogin/oauth/register', param).then(res => {
                    if (res.state == 200) {
                        //将用户信息存缓存，并跳转到首页
                        localStorage.setItem('access_token', res.data.access_token);
                        localStorage.setItem('refresh_token', res.data.refresh_token);
                        localStorage.setItem('time', new Date().getTime().toString());//存储refresh_token更新时间
                        //获取用户信息，并同步信息到vuex
                        proxy.$get('v3/member/front/member/getInfo').then(res => {
                            if (res.state == 200) {
                                //清空购物车store
                                proxy.$sldStatEvent({ behaviorType: 'reg' })
                                store.commit('updateCartListData', {});
                                store.commit('updateMemberInfo', res.data);
                                router.back();
                            }
                        })
                    } else {
                        //提示错误
                        getImgCode();
                        errorMsg.value = res.msg
                    }
                })
            }
            //清空输入框内容
            const clearInputVal = (type) => {
                if (type == 'name') {
                    name.value = '';
                } else if (type == 'password') {
                    password.value = '';
                }
            }

            //获取短信验证码
            const getSmsCode = () => {
                if (preventFre.value) {
                    return;
                } else if (countDownM.value) {
                    return;
                }
                preventFre.value = true
                let checkMobile = proxy.$checkPhone(name.value);
                let checkImgCode = proxy.$checkImgCode(imgCode.value);
                if (checkMobile !== true) {
                    errorMsg.value = checkMobile;
                    preventFre.value = false;
                } else if (checkImgCode !== true) {
                    errorMsg.value = checkImgCode;
                    preventFre.value = false;
                } else {
                    let param = {};
                    param.mobile = name.value;
                    // param.verifyType = 2;
                    param.verifyCode = imgCode.value;
                    param.verifyKey = imgCodeKey.value;
                    proxy.$get('v3/msg/front/commons/getCaptcha', param).then(res => {
                        if (res.state == 200) {
                            countDownM.value = 60;
                            countDown();
                            preventFre.value = false;
                        } else {
                            //提示错误
                            getImgCode();
                            errorMsg.value = res.msg
                            preventFre.value = false;
                        }
                    })
                }
            }
            //倒计时
            const countDown = () => {
                countDownM.value--;
                if (countDownM.value == 0) {
                    preventFre.value = false
                    clearTimeout(timeOutId.value);
                } else {
                    timeOutId.value = setTimeout(countDown, 1000);
                }
            }
            //获取图形验证码
            const getImgCode = () => {
                proxy.$get('v3/captcha/common/getCaptcha', {}).then(res => {
                    if (res.state == 200) {
                        showCodeImg.value = 'data:image/png;base64,' + res.data.captcha;
                        imgCodeKey.value = res.data.key;
                    }
                })
            }
            //是否同意用户注册协议
            const agree = () => {
                agreeFlag.value = !agreeFlag.value;
            }

            //通过replace方式跳转页面
            const goToPage = (type) => {
                router.replace({
                    path: type,
                });
            }

            watch([name, imgCode, password], () => {
                password.value = password.value.substring(0, 20)
                imgCode.value = imgCode.value.substring(0, 4)
                name.value = name.value.substring(0, 11)
                if (password.value || imgCode.value || name.value) {
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

                getImgCode(); //获取图形验证码
                document.body.classList.remove('el-popup-parent--hidden');
            })
            return {
                L,
                login,
                name,
                password,
                clearInputVal,
                errorMsg,
                getSmsCode,
                countDownM,
                imgCode,
                showCodeImg,
                imgCodeKey,
                getImgCode,
                agreeFlag,
                agree,
                goToPage,
                configInfo,
                defaultImg,
                defaultBgImg,
                wxEnable,
                pcAppid,
                fromurl,
                wetChatLogin,
                getWxEnbale,
            };
        },
    };
</script>
<style lang="scss" scoped>
    @import '../../../style/register.scss';

    .el-popup-parent--hidden {
        overflow: visible;
    }
</style>