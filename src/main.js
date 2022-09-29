/*
 * @Author: your name
 * @Date: 2021-01-08 21:09:07
 * @LastEditTime: 2021-02-04 14:15:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /java-pc/src/main.js
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'normalize.css'
import './style/index.scss'
import "./assets/iconfont/iconfont.css";
import { get, post } from './utils/request'
import { chatUrl, statShowDebug, mUrl } from './utils/config'
import {
  getLocalStorageStr, getCurLanguage, goGoodsDetail, goStoreDetail, checkMobile, checkPhone, checkEmailCode, checkPwd, checkSmsCode, checkIdentity,
  checkMemberName, checkImgCode, addCart, diyNavTo, sldCommonTip, checkEmail, getUserInfo, cartDataNum, getLoginCartListData, calculateSubtotal,
  goGoodsListByCatId, formatChatTime, isShowTime, getQueryVariable, quillEscapeToHtml
} from './utils/common';
import { sldStatEvent, initStat } from './utils/stat'
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import locale from 'element-plus/lib/locale/lang/zh-cn'
import VueSocketIO from "vue-socket.io";
import coverImage from '@/components/coverImage'
const app = createApp(App);

app.component('coverImage', coverImage)
//组件引用 end
// 配置全局属性
app.config.globalProperties.$get = get;
app.config.globalProperties.$post = post;
app.config.globalProperties.$getLocalStorageStr = getLocalStorageStr;
app.config.globalProperties.$getCurLanguage = getCurLanguage;
app.config.globalProperties.$goGoodsDetail = goGoodsDetail;
app.config.globalProperties.$goStoreDetail = goStoreDetail;
app.config.globalProperties.$checkMobile = checkMobile;
app.config.globalProperties.$checkPwd = checkPwd;
app.config.globalProperties.$checkSmsCode = checkSmsCode;
app.config.globalProperties.$checkMemberName = checkMemberName;
app.config.globalProperties.$checkImgCode = checkImgCode;
app.config.globalProperties.$addCart = addCart;
app.config.globalProperties.$diyNavTo = diyNavTo;
app.config.globalProperties.$sldCommonTip = sldCommonTip;
app.config.globalProperties.$checkEmail = checkEmail;
app.config.globalProperties.$getUserInfo = getUserInfo;
app.config.globalProperties.$cartDataNum = cartDataNum;
app.config.globalProperties.$getLoginCartListData = getLoginCartListData;
app.config.globalProperties.$calculateSubtotal = calculateSubtotal;
app.config.globalProperties.$checkEmailCode = checkEmailCode;
app.config.globalProperties.$goGoodsListByCatId = goGoodsListByCatId;
app.config.globalProperties.$formatChatTime = formatChatTime
app.config.globalProperties.$isShowTime = isShowTime
app.config.globalProperties.$sldStatEvent = sldStatEvent
app.config.globalProperties.$checkPhone = checkPhone
app.config.globalProperties.$checkIdentity = checkIdentity
app.config.globalProperties.$quillEscapeToHtml = quillEscapeToHtml
app.use(ElementPlus, { locale })
app.use(new VueSocketIO({
  debug: true,
  connection: chatUrl,
}))

app.use(router).use(store).mount('#app')

router.beforeEach(() => {
  window.scrollTo(0, 0)
})

//适配移动端
let u = navigator.userAgent;
let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //Android端
let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

if((isAndroid||isIOS)&&mUrl){
  let curUrl = window.location.href;//浏览器地址
  if(curUrl.indexOf('goods/detail?productId=')>-1){
    //商品详情页
    let productId= getQueryVariable('productId');
    window.location.href = `${mUrl}standard/product/detail?productId=${productId}`;
  }else if(curUrl.indexOf('store/index?vid=')>-1||curUrl.indexOf('store/goods?vid=')>-1){
    //店铺详情页
    let vid= getQueryVariable('vid');
    window.location.href = `${mUrl}standard/store/shopHomePage?vid=${vid}`;
  }else if(curUrl.indexOf('login')>-1&&curUrl.indexOf('member/pwd/login')==-1){
    //登录页
    window.location.href = `${mUrl}pages/public/login`;
  }else if(curUrl.indexOf('register')>-1){
    //注册页
    window.location.href = `${mUrl}pages/public/register`;
  }else{
    window.location.href = mUrl;
  }
}

//统计初始化
initStat(statShowDebug, {
  equipmentType: 1,//设备类型，1-pc，2-移动设备，3-其他
  source: 'pc',//终端名称，pc-pc；h5-H5；android-Android；ios-IOS；xcx-微信小程序
  memberId: 0,//会员id默认为0
  ip: '',//移动端ip默认都为空
});



