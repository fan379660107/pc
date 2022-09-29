import { curLang } from './config';
import { lang_zn } from '../assets/language/zh';
import { lang_en } from '../assets/language/en';
import { ElMessage } from "element-plus";
import { get, post } from './request';
import store from '../store'
import { sldStatEvent } from '@/utils/stat'
import { useRouter } from 'vue-router'

/**
 * 装修模块的跳转
 * @params  Object val
 */
export function diyNavTo(val) {
    if (val.link_type == 'url') { //跳转链接地址
        if (val.link_value) {
            val.link_value = quillEscapeToHtml(val.link_value);
        }
        window.open(val.link_value, '_blank')
    } else if (val.link_type == 'goods') { //跳转商品详情页
        let routeUrl = this.$router.resolve({
            path: '/goods/detail',
            query: {
                productId: val.info.defaultProductId
            }
        })
        window.open(routeUrl.href, '_blank');
    } else if (val.link_type == 'category') { // 分类列表
        let routeUrl = this.$router.resolve({
            path: '/goods/list',
            query: {
                categoryId: val.info.categoryId
            }
        })

        window.open(routeUrl.href, '_blank');
    } else if (val.link_type == 'keyword') { // 关键词
        let query = {
            keyword: val.link_value
        }
        if (val.storeId) {
            query.storeId = val.storeId
        }
        let routeUrl = this.$router.resolve({
            path: '/goods/list',
            query
        })
        window.open(routeUrl.href, '_blank');
    } else if (val.link_type == 'topic') { //跳转专题页
        let routeUrl = this.$router.resolve({
            path: '/topic',
            query: {
                topicId: val.info.decoId
            }
        })
        window.open(routeUrl.href, '_blank');
    } else if (val.link_type == 'brand_home') { //品牌列表
        let routeUrl = this.$router.resolve({
            path: '/brand',
            query: {}
        })
        window.open(routeUrl.href, '_blank');
    } else if (val.link_type == 'store_list') { //店铺列表
        let routeUrl = this.$router.resolve({
            path: '/store/list',
        })
        window.open(routeUrl.href, '_blank');
    } else if (val.link_type == 'voucher_center') { //领券中心
        let routeUrl = this.$router.resolve({
            path: '/coupon',
        })
        window.open(routeUrl.href, '_blank');
    } else if (val.link_type == 'point_center') {
        let routeUrl = this.$router.resolve({
            path: '/point/index',
        })
        window.open(routeUrl.href, '_blank');
    }
}


/**
 * 进入商品详情页
 * @params  number availableProductId 货品id
 */
export function goGoodsDetail(availableProductId) {
    let routeUrl = this.$router.resolve({
        path: "/goods/detail",
        query: { productId: availableProductId }
    });
    window.open(routeUrl.href, '_blank');
}

/**
 * 进入店铺详情页
 * @params  number storeId 店铺id
 */
export function goStoreDetail(storeId) {
    let routeUrl = this.$router.resolve({
        path: "/store/index",
        query: { vid: storeId }
    });
    window.open(routeUrl.href, '_blank');
}

/*
 * 判断是否显示聊天页面的时间,2条消息之间间隔超过3分钟显示
 * 返回Boolean类型
 * preMsgTime 上一条消息的发送时间，curMsgTime该条消息的发送时间
 * @zjf-2021-03-05
 * */
export function isShowTime(preMsgTime, curMsgTime) {
    let res = false;
    if (Date.parse(new Date(curMsgTime)) * 1 - Date.parse(new Date(preMsgTime)) * 1 > 3 * 60 * 1000) {
        res = true;
    }
    return res;
}

/*
 * 格式化聊天时间
 * 返回格式化后的数据，字符串类型
 * time 时间戳 13位
 * @zjf-2021-03-05
 * */
export function formatChatTime(time) {
    return format(new Date(time), 'yyyy年MM月dd日 hh:mm');
}

export function format(date, fmt) {
    let o = {
        "y+": date.getFullYear(), //年
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}


/**
 * 进入公告详情页
 * @params  number noticeId 公告id
 */
export function goBiddingDetail(noticeId) {
    let routeUrl = this.$router.resolve({
        path: "recruit_info/bulletin_detail",
        query: { noticeId: noticeId }
    });
    window.open(routeUrl.href, '_blank');
}

/**
 * 进入资讯详情页
 * @params  number informationId 资讯id
 */
export function goInformationDetail(informationId) {
    let routeUrl = this.$router.resolve({
        path: "hotNews/info_detail",
        query: { informationId: informationId }
    });
    window.open(routeUrl.href, '_blank');
}


/**
 * 通过分类id跳转商品列表页
 * @params  Object val
 */
export function goGoodsListByCatId(categoryId) {
    let routeUrl = this.$router.resolve({
        path: "/goods/list",
        query: { categoryId: categoryId }
    });
    window.open(routeUrl.href, '_blank');
}

/*
* 获取缓存的值——String类型
* 返回值字符串  有值返回具体的值，否则返回空字符串
* @zjf-2020-11-26
* */
export function getLocalStorageStr(key) {
    let val = localStorage.getItem(key);
    return val != undefined && val != null && val ? val : '';
}

/*
* 获取缓存的值——Object类型
* 返回值对象  有值返回具体的值，否则返回空对象
* @zjf-2020-11-26
* */
export function getLocalStorageObject(key) {
    let val = localStorage.getItem(key);
    return val != undefined && val != null && val ? JSON.parse(val) : {};
}

/*
* 获取当前语言下的数据 —— Object类型
* 返回对象  语言数据对象
* @zjf-2020-12-28
* */
export function getCurLanguage() {
    const language = {
        'zh': lang_zn,
        'en': lang_en,
    }
    return language[curLang];
}

/*
* 手机号的验证
* 返回boolean值
* @zjf-2021-01-06
* */
export function checkMobile(mobile) {
    let tarLang = getCurLanguage();
    let regMobile = /(1[3-9]\d{9}$)/;
    let regTel = /(\d{4}-)?\d{6,8}/
    if (!mobile) {
        return tarLang['请输入手机号'];
    } else if (!regMobile.test(mobile) && !regTel.test(mobile)) {
        return tarLang['请输入正确的手机号'];
    } else {
        return true;
    }
}

export function checkPhone(mobile, txt) {
    let tarLang = getCurLanguage();
    let regMobile = /(1[3-9]\d{9}$)/;
    if (!mobile) {
        return txt ? txt : tarLang['请输入手机号'];
    } else if (!regMobile.test(mobile)) {
        return txt ? txt : tarLang['请输入正确的手机号'];
    } else {
        return true;
    }
}


/*
* 密码的验证：6～20位，由英文、数字或符号组成的验证
* 验证通过，返回boolean值true，否则返回具体的错误信息
* @zjf-2021-01-06
* */
export function checkPwd(pwd) {
    let tarLang = getCurLanguage();
    if (pwd.length < 6) {
        return tarLang['密码最少6位哦～'];
    } else if (pwd.length > 20) {
        return tarLang['密码最多20位哦～'];
    } else if (!(/[^\u4e00-\u9fa5]/.test(pwd))) {
        return tarLang['密码不可以有中文哦～'];
    } else if (!(/^\S*$/.test(pwd))) {
        return tarLang['密码中不可以有空格哦～'];
    } else {
        return true;
    }
}

/*
* 短信验证码的验证：6位0～9的数字
* 验证通过，返回boolean值true，否则返回具体的错误信息
* @zjf-2021-01-06
* */
export function checkSmsCode(val) {
    let tarLang = getCurLanguage();
    let reg = /^\d{6}$/;
    if (!val) {
        return tarLang['请输入短信验证码'];
    } else if (!reg.test(val)) {
        return tarLang['请输入正确的短信验证码'];
    } else {
        return true;
    }
}

/*
* 邮箱验证码的验证：6位0～9的数字
* 验证通过，返回boolean值true，否则返回具体的错误信息
* @zjf-2021-01-06
* */
export function checkEmailCode(val) {
    let tarLang = getCurLanguage();
    let reg = /^\d{4,6}$/;
    if (!val) {
        return tarLang['请输入邮箱验证码'];
    } else if (!reg.test(val)) {
        return tarLang['请输入正确的邮箱验证码'];
    } else {
        return true;
    }
}

/*
* 会员账号的验证：由中、英文、数字、"-"及"_"，且不能全为数字
* 验证通过，返回boolean值true，否则返回具体的错误信息
* @zjf-2021-01-06
* */
export function checkMemberName(value) {
    let tarLang = getCurLanguage();
    let reg = new RegExp('^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_-]){1,20}$');
    let reg_num = new RegExp('^[0-9]*$');
    if (value.length < 6 || value.length > 20) {
        return tarLang['请输入6～20位的会员名'];
    } else {
        if (reg.test(value)) {
            if (reg_num.test(value)) {
                return tarLang['会员名不能全为数字'];
            } else {
                return true;
            }
        } else {
            return tarLang['会员名须由中、英文、数字、"-"及"_"组成'];
        }
    }
}


export function checkIdentity(value) {
    let reg18 = /^[1-9][0-9]{5}(18|19|20)[0-9]{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)[0-9]{3}([0-9]|(X|x))/
    let reg15 = /^[1-9][0-9]{5}[0-9]{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)[0-9]{2}[0-9]/
    if (!value) {

        return '请输入身份证号'
    } else if (reg18.test(value) || reg15.test(value)) {
        return true;
    } else {
        return '请输入正确的身份证号';
    }
}

/*
* 短信图形验证码的验证：4位英文字母和数字
* 验证通过，返回boolean值true，否则返回具体的错误信息
* @zjf-2021-01-07
* */
export function checkImgCode(val) {
    let tarLang = getCurLanguage();
    let reg = /^[a-zA-Z0-9]{4}$/;
    if (!val) {
        return tarLang['请输入图形验证码'];
    } else if (!reg.test(val)) {
        return tarLang['请输入正确的图形验证码'];
    } else {
        return true;
    }
}

/*
* 邮箱的验证
* 验证通过，返回boolean值true，否则返回具体的错误信息
* @zjf-2021-01-11
* */
export function checkEmail(email) {
    let tarLang = getCurLanguage();
    let reg = /^([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/;
    if (!email) {
        return tarLang['请输入邮箱'];
    } else if (!reg.test(email)) {
        return tarLang['请输入正确的邮箱'];
    } else {
        return true;
    }
}

/**
 * 加入购物车：登录及未登录 并将购物车数据存储到vuex的store中
 * @params
 * 已登录所需参数： productId:货品id currentNumber:当前商品加入的数量
 * 未登录所需参数：goodsDetailData：该商品详细信息 currentNumber:当前商品加入的数量 cartListData:vuex中的store里面存储的购物车数据
 * @ljp-2021-01-08
 */
export function addCart(paramsData) {
    if (store.state.loginFlag) {  // 已登录
        let params = {
            productId: paramsData.productId,
            number: paramsData.number
        }
        post("v3/business/front/cart/add", params).then((res) => {
            if (res.state == 200) {
                sldStatEvent({ behaviorType: 'cart', goodsId: paramsData.goodsId, storeId: paramsData.storeId });
                ElMessage.success(res.msg);
            } else {
                ElMessage.error(res.msg)
            }
        }).then(() => {
            getLoginCartListData();
        })
    } else {  //未登录
        //购物车数据初始化 start
        let initCartListData = {
            storeCartGroupList: [], //店铺数组
            checkedAll: true,
            totalAmount: paramsData.goodsDetailData.defaultProduct.productPrice,
            totalCheck: 1,
            invalidList: [], //失效商品数组
            availableCartNum: 1, //商品总数
        };
        let storeCartGroupListPre = { //每一个店铺
            storeId: paramsData.goodsDetailData.storeInf.storeId,
            storeName: paramsData.goodsDetailData.storeInf.storeName,
            checkedAll: true,
            promotionCartGroupList: [], //活动数组
        };
        let promotionCartGroupListPre = { //每一个活动
            cartList: [],  //购物车商品数组
        };
        let specValues = '';
        if (paramsData.goodsDetailData.specs && paramsData.goodsDetailData.specs.length) {
            paramsData.goodsDetailData.specs.forEach((item, index) => {
                item.specValueList.forEach(items => {
                    if (items.checkState == 1) {
                        specValues += (index > 0 ? ',' + items.specValue : items.specValue)
                    }
                })
            })
        }
        let cartListPre = { //每一个商品
            buyNum: paramsData.number,
            goodsId: paramsData.goodsDetailData.goodsId,
            productId: paramsData.goodsDetailData.defaultProduct.productId,
            productImage: paramsData.goodsDetailData.defaultProduct.goodsPics[0],
            goodsName: paramsData.goodsDetailData.goodsName,
            specValues,
            isChecked: 1,
            productPrice: paramsData.goodsDetailData.defaultProduct.productPrice,
            productStock: paramsData.goodsDetailData.defaultProduct.productStock
        }
        promotionCartGroupListPre.cartList.push(cartListPre); //将每一个商品添加到购物车商品数组
        storeCartGroupListPre.promotionCartGroupList.push(promotionCartGroupListPre);//将每一个活动添加到活动数组
        initCartListData.storeCartGroupList.push(storeCartGroupListPre);//将每一个店铺添加到店铺数组
        //购物车数据初始化 end
        let locStoragecartListData = store.state.cartListData;

        if (JSON.stringify(locStoragecartListData) != '{}') { //购物车缓存有数据
            if (locStoragecartListData.storeCartGroupList) {
                let identicalStore = []; //相同店铺
                identicalStore = locStoragecartListData.storeCartGroupList && locStoragecartListData.storeCartGroupList.filter(storeItem => storeItem.storeId == paramsData.goodsDetailData.storeInf.storeId);
                if (identicalStore && identicalStore.length > 0) { //同一店铺
                    let identicalGoods = [];  //相同商品
                    identicalStore[0].promotionCartGroupList.map(promotItem => {
                        identicalGoods = promotItem.cartList.filter(cartItem => cartItem.productId == paramsData.goodsDetailData.defaultProduct.productId);
                        if (identicalGoods.length > 0) { //同店铺同商品
                            identicalGoods[0].buyNum++;
                        } else {  //同店铺不同商品
                            promotItem.cartList.push(cartListPre)
                        }
                    })
                } else {//不同店铺
                    locStoragecartListData.storeCartGroupList.push(storeCartGroupListPre);
                }
                locStoragecartListData = cartDataNum(locStoragecartListData);
            }
        } else {  //购物车缓存中无数据
            locStoragecartListData = initCartListData;
        }
        store.commit('updateCartListData', locStoragecartListData); //将购物车数据存储到vuex的store中
        let tarLang = getCurLanguage();
        ElMessage.success(tarLang['加入购物车成功']);
        sldStatEvent({ behaviorType: 'cart', goodsId: paramsData.goodsId, storeId: paramsData.storeId });
    }
}

/**
 * 购物车中商品总数及购物车中商品选中的数
 * @param {*} cartData :购物车数据
 * @ljp-2021-2-12
 */
export function cartDataNum(cartData) {
    cartData.availableCartNum = 0; //购物车中商品数量
    let checkedGoods = []; //选中的商品
    if (cartData.storeCartGroupList && cartData.storeCartGroupList.length > 0) {
        cartData.storeCartGroupList.map(storeItem => {
            storeItem.promotionCartGroupList.map(promotItem => {
                cartData.availableCartNum += promotItem.cartList.length;
                checkedGoods = promotItem.cartList.filter(cartItem => cartItem.isChecked == 1);
            })
        })
        cartData.totalCheck = checkedGoods.length; //选中商品的总数
    } else {
        cartData.availableCartNum = 0; //购物车商品总数
    }
    return cartData;
}

/**
 * 计算购物车商品小计 cartData:购物车数据
 * @ljp-2021-1-15
 */
export function calculateSubtotal(cartData) {
    if (JSON.stringify(cartData) != "{}") {
        cartData &&
            cartData.storeCartGroupList &&
            cartData.storeCartGroupList.map((storeItem) => {
                storeItem.promotionCartGroupList.map((promotItem) => {
                    promotItem.cartList.map((cartItem) => {
                        cartItem.subtotal = (Number(cartItem.buyNum) * cartItem.productPrice).toFixed(2);
                    });
                });
            });
        cartData &&
            cartData.invalidList &&
            cartData.invalidList.map((invalidItem) => {
                invalidItem.subtotal =
                    (invalidItem.productPrice * Number(invalidItem.buyNum)).toFixed(2);
            });
        return cartData;
    }
}

/**
 * 获取已登录购物车数据并更新vuex中的购物车数据
 * @ljp-2021-1-12
 */
export function getLoginCartListData() {
    let params = {};
    get("v3/business/front/cart/cartList", params).then((res) => {
        if (res.state == 200) {
            let result = res.data;
            result = calculateSubtotal(result);
            store.commit('updateCartListData', result); //将购物车数据存储到vuex的store中
        } else {
            ElMessage.error(res.msg);
        }
    })
}

/**
 * 获取会员信息并更新vuex的用户信息
 * @ljp-2021-1-11
 */
export function getUserInfo() {
    get('v3/member/front/member/getInfo').then(res => {
        if (res.state == 200) {
            store.commit('updateMemberInfo', res.data);
        }
    })
}


/**
 * 通用提示
 * con  String  提示的内容,无特殊要求的话可不传
 *
 * @zjf-2020-11-18
 */
export function sldCommonTip(con = '该功能在升级中～') {
    let tarLang = getCurLanguage();
    let defaultCon = tarLang['该功能在升级中～'];
    ElMessage.info(con ? con : defaultCon);
}


/**
 * base64加密
 * @params data String 要加密的字符串
 * @zjf-2021-06-28
 */
export function base64Encode(data) {
    let b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let o1,
        o2,
        o3,
        h1,
        h2,
        h3,
        h4,
        bits,
        i = 0,
        ac = 0,
        enc = '',
        tmp_arr = [];
    if (!data) {
        return data;
    }
    data = utf8Encode(data);
    do {
        o1 = data.charCodeAt(i++);
        o2 = data.charCodeAt(i++);
        o3 = data.charCodeAt(i++);

        bits = o1 << 16 | o2 << 8 | o3;

        h1 = bits >> 18 & 0x3f;
        h2 = bits >> 12 & 0x3f;
        h3 = bits >> 6 & 0x3f;
        h4 = bits & 0x3f;
        tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
    } while (i < data.length);

    enc = tmp_arr.join('');

    switch (data.length % 3) {
        case 1:
            enc = enc.slice(0, -2) + '==';
            break;
        case 2:
            enc = enc.slice(0, -1) + '=';
            break;
    }

    return enc;
}

export function utf8Encode(string) {
    string = (string + '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    let utftext = '',
        start,
        end;
    let stringl = 0,
        n;

    start = end = 0;
    stringl = string.length;

    for (n = 0; n < stringl; n++) {
        let c1 = string.charCodeAt(n);
        let enc = null;

        if (c1 < 128) {
            end++;
        } else if ((c1 > 127) && (c1 < 2048)) {
            enc = String.fromCharCode((c1 >> 6) | 192, (c1 & 63) | 128);
        } else {
            enc = String.fromCharCode((c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128);
        }
        if (enc !== null) {
            if (end > start) {
                utftext += string.substring(start, end);
            }
            utftext += enc;
            start = end = n + 1;
        }
    }

    if (end > start) {
        utftext += string.substring(start, string.length);
    }

    return utftext;
}

export function getQueryVariable(variable) {
    let query = window.location.search.substring(1);
    let vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return false;
}

export function wetChatLogin(to, next) {
    let router = useRouter()
    let param = {
        code: to.query.code,
        source: 4
    }
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
        param.cartInfo = JSON.stringify(cartInfo)
    }
    post('v3/member/front/login/wechat/login', param).then(res => {
        if (res.state == 200) {
            if (res.data.redirect) {
                next({ path: '/bindMobile', query: { code: res.data.bindKey } })
                // router.replace({ path: '/bindMobile', query: { code: res.data.bindKey } })

            } else {
                localStorage.setItem("access_token", res.data.access_token);
                localStorage.setItem("refresh_token", res.data.refresh_token);
                localStorage.setItem("time", new Date().getTime().toString()); //存储refresh_token更新时间
                get("v3/member/front/member/getInfo").then(res => {
                    if (res.state == 200) {
                        store.commit("updateMemberInfo", res.data);
                        getLoginCartListData(); //更新购物车数据
                        delete to.query.code
                        delete to.query.state
                        // router.replace({ path: to.path, query: to.query })
                        next({ path: to.path, query: to.query, replace: true })

                    }
                });
            }


        } else {
            // router.replace({ name: 'Login', query: { error: encodeURIComponent(res.msg) } })
            next({ name: 'Login', query: { error: encodeURIComponent(res.msg) }, replace: true })

        }
    })

}

/*
* 富文本内容反转义（接口返回的富文本内容经过了转义，导致内容无法展示，所以需要反转义）
* @param {String} str 富文本内容
* @zjf-2022-01-07
* */
export function quillEscapeToHtml(str) {
    if (str != undefined) {
        const arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' }
        return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) {
            return arrEntities[t]
        })
    } else {
        return '';
    }
}
