<template>
    <NavTopBar />
    <div id="pay">
        <div class="top_info">
            <div class="top_info_header">
                <img :src="configInfo.main_site_logo" :onerror='defaultImg' alt />
                <div class="top_info_progress flex_row_center_center">

                    <div class="progress_item">
                        <div class="progress flex_row_center_center">
                            <span class="active">{{1}}</span>
                            <div class="progress_line">
                                <div :class="{content:true,active:true,current:false}"></div>
                            </div>
                        </div>
                        <p>确认订单</p>
                    </div>

                    <div class="progress_item">
                        <div class="progress flex_row_center_center">
                            <span class="active">{{2}}</span>
                            <div class="progress_line">
                                <div :class="{content:true,active:payComplete}"></div>
                            </div>
                        </div>
                        <p>付款</p>
                    </div>

                    <div class="progress_item">
                        <div class="progress flex_row_start_center">
                            <span :class="{active:payComplete}">{{3}}</span>
                        </div>
                        <p>支付成功</p>
                    </div>

                </div>
            </div>
            <div class="top_info_text flex_row_between_between">
                <span>订单提交成功，请您尽快付款！ 订单号： {{pay_info.data.paySn}}</span>
                <div class="price">
                    应付金额
                    <span>{{pay_info.data.needPay}}</span> 元
                </div>
            </div>
            <div class="top_info_text flex_row_between_between">
                <span>
                    请您在提交订单后
                    <span>24小时内</span>完成支付，否则订单会自动取消
                </span>
                <div class="show_detail pointer" @click="showDetail">{{show_detail?'收起详情':'展开详情'}}</div>
            </div>
            <div class="receive_info">
                <p v-if="show_detail">收货地址：{{pay_info.data.receiveAddress}} 收货人：{{pay_info.data.receiverName}}
                    {{pay_info.data.receiverMobile}}</p>
                <p v-if="show_detail">商品名称：{{buy_name_list}}</p>
            </div>
        </div>
        <div class="bg">
            <div class="pay_method" v-if="hasPayMethod">
                <div v-if="!show_wx_pay">
                    <div class="balance" v-if="balance_list.data.length>0">
                        <img class="logo" :src="balance" alt />
                        <div class="balance_info">
                            <i :class="{iconfont:true, 'icon-yuanquan1':pay_info.data.balanceAvailable>=pay_info.data.needPay,'icon-duihao1':current_pay_method.data.payMethod==balance_list.data[0].payMethod,'icon-jinzhi1':pay_info.data.balanceAvailable<pay_info.data.needPay}"
                                @click="pay_info.data.balanceAvailable>pay_info.data.needPay?changePayMethod(balance_list.data[0]):''"></i>
                            <!-- <i class="iconfont i"></i> -->
                            <span class="weight big_size">使用余额支付</span>
                            <span class="avai">
                                （可用余额：
                                <span class="weight">{{pay_info.data.balanceAvailable}}</span>元，目前需要在线支付：
                                <span class="weight">{{pay_info.data.needPay}}</span>元）余额不足？
                                <span class="weight pointer" @click="goRecharge" style="color:#168ED8">马上充值</span>
                            </span>
                        </div>
                        <div class="password" v-if="current_pay_method.data.payMethod==balance_list.data[0].payMethod">
                            <el-input class="password_input" placeholder="支付密码" v-model="password" show-password>
                            </el-input>
                            <p v-if="!memberInfo.hasPayPassword">
                                <span style="color: #FFB33A;"><i class="el-icon-warning"></i>未设置支付密码，马上去设置</span>
                                <router-link class="set_password pointer" :to="'/member/pwd/pay'">设置密码</router-link>
                            </p>
                            <p v-else>
                                <span class="forget_password pointer" @click="forgetPassword">忘记密码?</span>
                            </p>
                        </div>
                    </div>
                    <div class="balance other_pay_method" v-if="other_pay_list.data.length>0">
                        <img class="logo" :src="otherPay" alt />
                        <div class="balance_info flex">
                            <div :class="{other_pay_item:true, flex_row_around_center:true,wechat:index!=0}"
                                v-for="(item,index) in other_pay_list.data" :key="index" @click="changePayMethod(item)">
                                <i
                                    :class="{iconfont:true, 'icon-yuanquan1':current_pay_method.data.payMethod!=item.payMethod,'icon-duihao1':current_pay_method.data.payMethod==item.payMethod}"></i>
                                <img :src="item.payMethod=='alipay'?ali:wechat" alt />
                                <span>{{item.payMethodName}}</span>
                            </div>
                        </div>
                        <div class="pay" @click="pay" style="cursor: pointer;">立即支付</div>
                    </div>
                </div>
                <div class="wx_pay_con" v-if="show_wx_pay">
                    <p class="title" @click="hideWxPay">
                        <i class="iconfont icon-ziyuan2"></i>
                        <span>选择其它支付方式</span>
                    </p>
                    <div class="qr flex_row_around_center">
                        <div class="left flex_column_start_center">
                            <img :src="wxPayQrImg" />
                            <p>
                                使用
                                <span>微信支付</span>APP
                            </p>
                            <p>扫码完成支付</p>
                            <div class="refresh" @click="refreshWxQrcode">刷新</div>
                        </div>
                        <img class="wx_png" :src="wx_pay_tip" />
                    </div>
                </div>
            </div>
            <div class="no_payMethod" v-else>
                <img src="@/assets/member/member_empty.png" alt="">
                <p>暂无可用的支付方式，平台正在紧急处理中～</p>
            </div>
        </div>
    </div>
    <FooterService />
    <FooterLink />
</template>

<script>
    import { reactive, getCurrentInstance, ref, onMounted, onUnmounted } from "vue";
    import { ElMessage, ElInput } from "element-plus";
    import { useRoute, useRouter } from "vue-router";
    import { useStore } from "vuex";
    import NavTopBar from "../../../components/NavTopBar";

    import FooterService from "../../../components/FooterService";
    import FooterLink from "../../../components/FooterLink";
    export default {
        name: "Pay",
        components: {
            ElInput,
            NavTopBar,

            FooterService,
            FooterLink
        },
        setup() {
            const balance = require("../../../assets/buy/balance.png");
            const otherPay = require("../../../assets/buy/otherPay.png");
            const ali = require("../../../assets/buy/ali.png");
            const wechat = require("../../../assets/buy/wechat.png");
            const wx_pay_tip = require("../../../assets/buy/wx_pay_tip.png");
            const route = useRoute();
            const router = useRouter();
            const store = useStore()
            const { proxy } = getCurrentInstance();
            const pay_method = reactive({ data: [] });
            const pay_info = reactive({ data: {} });
            const paySn = ref("");
            const current_pay_method = reactive({ data: {} });
            const balance_list = reactive({ data: [] });
            const other_pay_list = reactive({ data: [] });
            const buy_name_list = ref("");
            const password = ref("");
            const show_wx_pay = ref(false);
            const wxPayQrImg = ref('');//微信支付二维码
            const timer = ref(0);//定时器
            const show_detail = ref(true)
            const hasPayMethod = ref(true)
            const configInfo = ref(store.state.configInfo)
            const memberInfo = ref(store.state.memberInfo);
            const defaultImg = ref('this.src="' + require('../../../assets/common_top_logo.png') + '"')
            //获取支付方式
            const getPayMethod = () => {
                proxy
                    .$get("v3/integral/front/integral/orderPay/payMethod", {
                        source: "pc",
                        type: 1
                    })
                    .then(res => {
                        if (res.state == 200) {
                            hasPayMethod.value = res.data.length > 0 ? true : false
                            res.data.map(item => {
                                if (item.payMethod == "balance") {
                                    balance_list.data.push(item);
                                } else {
                                    other_pay_list.data.push(item);
                                }
                            });
                        } else {
                            ElMessage(res.msg);
                        }
                    })
                    .catch(() => {
                        //异常处理
                    });
            };
            //获取订单支付数据
            const getPayInfo = () => {
                proxy
                    .$get("v3/integral/front/integral/orderPay/payInfo", {
                        paySn: route.query.paySn,
                        payFrom: route.query.payFrom
                    })
                    .then(res => {
                        if (res.state == 200) {
                            pay_info.data = res.data;
                            buy_name_list.value = res.data.goodsNameList.join(" + ");
                        } else if (res.state == 267) {
                            ElMessage.success(res.msg + ',2s后自动跳转订单列表');
                            //清除定时器
                            if (timer.value) {
                                clearInterval(timer.value);
                                timer.value = 0;
                            }
                            setTimeout(() => {
                                router.replace({
                                    path: '/member/pointOrder/list',
                                });
                            }, 2000)
                        } else {
                            ElMessage(res.msg);
                        }
                    })
                    .catch(() => {
                        //异常处理
                    });
            };
            const changePayMethod = pay_method => {
                current_pay_method.data = pay_method;
            };
            //去支付
            const payComplete = ref(false)
            const pay = () => {
                if (!current_pay_method.data.payMethod) {
                    ElMessage.warning("请选择支付方式");
                    return;
                }
                let param = {};
                param.payType = current_pay_method.data.payType;
                param.payMethod = current_pay_method.data.payMethod;
                param.paySn = pay_info.data.paySn;

                //余额支付
                if (param.payMethod == 'balance') {
                    if (password.value == "") {
                        ElMessage.warning("请输入支付密码");
                        return;
                    }
                    param.payPwd = password.value; //支付密码,使用余额时必传
                }

                //请求支付接口
                proxy
                    .$post("v3/integral/front/integral/orderPay/doPay", param)
                    .then(res => {
                        if (res.state == 200) {
                            if (param.payMethod == 'balance') {
                                ElMessage.success('支付成功,2s后自动跳转订单列表');
                                payComplete.value = true
                                //清除定时器
                                setTimeout(() => {
                                    router.replace({
                                        path: '/member/pointOrder/list',
                                    });
                                }, 2000)
                            } else if (param.payMethod == 'alipay') {
                                document.write(res.data.payData);//自动提交表单数据
                            } else if (param.payMethod == 'wx') {
                                show_wx_pay.value = true;
                                wxPayQrImg.value = 'data:image/png;base64,' + res.data.payData;//微信支付二维码
                                // 定时查询是否支付成功
                                timer.value = setInterval(() => {
                                    queryPayState();
                                }, 3000)
                                //两小时自动跳转订单列表
                                setTimeout(() => {
                                    router.replace({
                                        path: '/member/pointOrder/list',
                                    });
                                }, 432000000);
                            }
                        } else {
                            ElMessage(res.msg);
                        }
                    })
                    .catch(() => {
                        //异常处理
                    });
            };
            // 定时查询是否支付成功
            const queryPayState = () => {
                getPayInfo();
            }
            //隐藏微信支付内容
            const hideWxPay = () => {
                show_wx_pay.value = false;
            };
            //刷新微信支付二维码
            const refreshWxQrcode = () => {
                pay();
            };
            //收起展开详情
            const showDetail = () => {
                show_detail.value = !show_detail.value
            }
            onMounted(() => {
                paySn.value = route.query.paySn;
                getPayMethod();
                getPayInfo();
            });
            const goRecharge = () => {
                router.push('/member/recharge')
            }
            const forgetPassword = () => {
                router.push('/member/pwd/pay')
            }
            onUnmounted(() => {
                if (timer.value) {
                    clearInterval(timer.value);
                    timer.value = 0;
                }
            });
            return {
                pay_method,
                balance,
                otherPay,
                ali,
                wechat,
                pay_info,
                current_pay_method,
                balance_list,
                other_pay_list,
                changePayMethod,
                buy_name_list,
                password,
                pay,
                wx_pay_tip,
                show_wx_pay,
                hideWxPay,
                refreshWxQrcode,
                wxPayQrImg,
                goRecharge,
                forgetPassword,
                showDetail,
                show_detail,
                hasPayMethod,
                configInfo,
                defaultImg,
                memberInfo,
                payComplete
            };
        }
    };
</script>

<style lang="scss">
    @import "../../../style/pay.scss";

    .top_info_header {
        img {
            width: 135px;
            height: 98px;
            object-fit: contain;
        }
    }

    .no_payMethod {
        margin: 0 auto;
        width: 1200px;
        height: 560px;
        background-color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        img {
            width: 163px;
            height: 114px;
        }

        p {
            margin-top: 39px;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #333333;
        }
    }
</style>