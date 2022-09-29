/*
 * @Author: your name
 * @Date: 2021-01-08 21:09:07
 * @LastEditTime: 2021-01-15 11:36:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /java-pc/src/store/index.js
 */
import Vuex from 'vuex';
import { getLocalStorageObject, getLocalStorageStr } from '../utils/common';
import {updateStatCommonProperty} from '../utils/stat'

export default Vuex.createStore({
  state: {
    loginFlag: getLocalStorageStr('loginFlag') ? true : false,
    memberInfo: getLocalStorageObject('memberInfo'),//用户信息
    cartListData: getLocalStorageObject('cartListData'), //购物车信息
    openScreenInfo: getLocalStorageObject('openScreenInfo'), //购物车信息
    configInfo: getLocalStorageObject('configInfo'), //系统配置信息
    chatBaseInfo: getLocalStorageObject('chatBaseInfo') ? getLocalStorageObject('chatBaseInfo') : {},//聊天的基本信息，包含会员id、头像、店铺id、头像
  },
  mutations: {
    //更新用户信息
    updateMemberInfo(state, payload) {
      state.memberInfo = payload;
      if (payload.memberId != undefined && payload.memberId) {
        state.loginFlag = true;
        updateStatCommonProperty({memberId:payload.memberId});//登录成功需要更新统计里面的会员id
      } else {
        state.loginFlag = false;
      }
      localStorage.setItem('memberInfo', JSON.stringify(state.memberInfo));
      localStorage.setItem('loginFlag', state.loginFlag)
    },
    //更新购物车信息
    updateCartListData(state, payload) {
      if (payload != undefined) {
        state.cartListData = payload;
      } else {
        state.cartListData = {};
      }
      localStorage.setItem('cartListData', JSON.stringify(state.cartListData));
    },
    //更新开屏图信息
    updateOpenScreenInfo(state, payload) {
      state.openScreenInfo = payload;
      localStorage.setItem('openScreenInfo', JSON.stringify(state.openScreenInfo));
    },
    //更新系统配置信息
    updateConfigInfo(state, payload) {
      state.configInfo = payload;
      localStorage.setItem('configInfo', JSON.stringify(state.configInfo));
    },
    //清空vuex里所有数据
    clearAllData(state) {
      state.memberInfo = {};
      state.loginFlag = false;
      state.cartListData = {};
      state.chatBaseInfo = {}
      localStorage.removeItem('memberInfo')
      localStorage.removeItem('cartListData')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('access_token')
      localStorage.removeItem('loginFlag')
      localStorage.removeItem('chatBaseInfo')
      localStorage.removeItem('addressId')
      updateStatCommonProperty({memberId:0});//退出登录需要将会员id置为0
    },
    //保存聊天的会员id、会员头像，店铺id、店铺头像
    saveChatBaseInfo(state, payload) {
      state.chatBaseInfo = payload
      //缓存聊天的基本信息
      localStorage.setItem('chatBaseInfo', JSON.stringify(state.chatBaseInfo))
    },
  }
})
