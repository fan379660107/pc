<!--
 * @Author: wangwei
 * @Date: 2020-12-29 16:05:36
 * @LastEditTime: 2021-01-25 14:31:14
 * @LastEditors: Please set LastEditors
 * @Description: 充值
 * @FilePath: /java-pc/src/views/member/money/recharge.vue
-->
<template>
	<div class="sld_recharge">
		<MemberTitle :memberTitle="L['账户充值']"></MemberTitle>
		<div class="sld_recharge_con" v-if="rechargeSetting==1">
			<div class="top_info">
				<div class="progress flex_row_center_center">
					<div class="step step1 flex_row_start_center">
						<span class="line"></span>
						<i class="iconfont icon-querenyuanzhengqueduigoutijiaochenggongwancheng"></i>
						<span class="step_text">{{L['1.填写充值金额']}}</span>
					</div>
					<div class="step step2 flex_row_start_center">
						<span class="no_line" :class="{sel_line:current_step == 2}"></span>
						<i class="iconfont icon-querenyuanzhengqueduigoutijiaochenggongwancheng"
							:class="{no_sel:current_step == 1}"></i>
						<span class="no_step_text" :class="{step_text:current_step == 2}">{{L['2.在线支付']}}</span>
					</div>
					<div class="step step3 flex_row_start_center">
						<span class="no_line"></span>
						<i class="iconfont icon-querenyuanzhengqueduigoutijiaochenggongwancheng no_sel"></i>
						<span class="no_step_text">{{L['3.充值完成']}}</span>
					</div>
				</div>
			</div>
			<!-- step1  start -->
			<div v-if="current_step==1" class="step_con step1">
				<div class="title">{{L['填写充值金额']}}</div>
				<div class="account">{{L['充值账户']}}：{{store.state.memberInfo.memberName}}</div>
				<div class="input_con flex_row_start_center">
					<span class="input_span">{{L['充值金额']}}：</span>
					<div class="input_con_right">
						<el-input class="input" size="medium" v-model="money" placeholder="请输入金额"
							@input="moneyInput">
						</el-input>元
						<div class="info_text">{{L['请注意：支持支付宝支付、微信支付，在线支付成功后，充值金额会在1到5分钟内到账']}}</div>
						<div class="next_btn pointer" @click="goStep2">{{L['下一步']}}</div>
					</div>
				</div>
				<div class="tips">
					<p>{{L['温馨提示']}}：</p>
					<p>{{L['1.充值成功后，余额可能存在延迟现象，一般1到5分钟内到账，如有问题，请咨询客服；']}}</p>
					<p>{{L['2.充值金额输入值必须是不小于1且不大于5000；']}}</p>
					<p>{{L['3.充值完成后，您可至会员中心查看充值记录。']}}</p>
				</div>
			</div>
			<!-- step1  end -->

			<!-- step2  start -->
			<div v-if="current_step==2" class="reching_tip flex_column_start_start">
				<span>{{show_wx_pay?L['请使用手机微信扫描下方二维码进行支付']:L['您正在充值余额，请尽快支付']}}</span>
				<span>{{show_wx_pay?L['应付金额']:L['充值金额']}}：<span>￥{{money}} 元</span> </span>
			</div>
			<div v-if="current_step==2" class="step_con step2">
				<div v-if="!show_wx_pay" class="select_method flex_row_start_center">
					<span class="method">{{L['选择充值方式']}}:</span>
					<div class="flex_row_start_center">
						<div v-for="(item,index) in method.data" :key="index"
							class="item ali flex_row_around_center pointer" @click="changePayMethod(item)">
							<i
								:class="{iconfont:true, 'icon-yuanquan1':true,'icon-duihao1':currentMethod.data.payMethod==item.payMethod}"></i>
							<img :src="item.payMethod=='wx'?wechat:(item.payMethod=='alipay'?ali:'')" alt />
							<span>{{item.payMethodName}}</span>
						</div>
					</div>
				</div>
				<div v-if="!show_wx_pay" class="pay_btn pointer" @click="goPay">{{L['立即充值']}}</div>
				<!-- 微信支付 start-->
				<div v-if="show_wx_pay" class="wx_pay_con">
					<div class="wx_pay_info">
						<span class="pay_type">{{L['微信支付支付']}}</span>
						<span>
							{{L['如二维码过期，']}}
							<span class="red" @click="wxPayRefresh"
								style="cursor: pointer;">{{L['刷新']}}</span>{{L['重新获取二维码。']}}
						</span>
					</div>
					<div class="qrcode_con flex_row_start_center">
						<div class="left flex_column_start_center">
							<div class="qrcode_image flex_row_center_center">
								<img :src="wxPayQrImg" alt="">
							</div>
							<div class="qrcode_image_tips flex_row_center_center">
								<i class="iconfont icon-saoma"></i>
								<span>{{L['使用微信扫码支付']}}</span>
							</div>
						</div>
						<div class="right_tip">
							<img src="@/assets/member/wx_tips.png" alt />
						</div>
					</div>
				</div>
				<!-- 微信支付 end-->
			</div>
			<!-- step2  end -->
		</div>
		<div class="sld_recharge_con" v-else>
			<SldCommonEmpty :tip="L['暂未开启充值功能']" totalWidth="1005"></SldCommonEmpty>
		</div>
	</div>
</template>

<script>
	import { ElInput, ElMessage } from "element-plus";
	import {
		getCurrentInstance,
		ref,
		watch,
		reactive,
		onMounted,
		onUnmounted
	} from "vue";
	import { useRouter } from "vue-router";
	import { useStore } from 'vuex';
	import MemberTitle from '../../../components/MemberTitle';
	import SldCommonEmpty from '@/components/SldCommonEmpty'
	export default {
		name: "Recharge",
		components: {
			ElInput,
			MemberTitle,
			SldCommonEmpty
		},
		setup() {
			const store = useStore();
			const router = useRouter();
			// const route = useRoute();
			const { proxy } = getCurrentInstance();
			const L = proxy.$getCurLanguage();
			const saoma = require("../../../assets/coupon/saoma.png");
			const ali = require("../../../assets/buy/ali.png");
			const wechat = require("../../../assets/buy/wechat.png");
			const wx_pay_tip = require("../../../assets/coupon/phone-bg.png");
			const money = ref("");
			const current_step = ref(1);
			const method = reactive({ data: [] });
			const currentMethod = reactive({
				data: {
				}
			});
			const rechargeSetting = ref('')

			const show_wx_pay = ref(false);
			const wxPayQrImg = ref("");
			const timer = ref(0); //定时器
			const rechargeId = ref("");
			const goStep2 = () => {
				if (money.value == "") {
					ElMessage.warning(L['请输入充值金额']);
					return;
				} else if (money.value > 5000) {
					ElMessage.warning(L['超过充值金额上限'])
					return
				}
				current_step.value = 2;
			};
			//获取充值方式
			const getRechargeMethod = () => {
				proxy
					.$get("v3/business/front/orderPay/payMethod", {
						source: "pc",
						type: 2
					})
					.then(res => {
						if (res.state == 200) {
							method.data = res.data;
							if (method.data.length > 0) {
								currentMethod.data = method.data[0]
							}

						} else {
							ElMessage(res.msg);
						}
					})
					.catch(() => {
						//异常处理
					});
			};
			//切换充值方式
			const changePayMethod = item => {
				currentMethod.data = item;
			};

			const moneyInput = () => {
				if (money.value < 5000) {
					money.value = money.value.toString().indexOf('.') == -1
						? money.value : money.value.toString().substring(0, money.value.toString().indexOf('.') + 3) > 0
							? money.value.toString().substring(0, money.value.toString().indexOf('.') + 3) : '';
				} else {
					money.value = money.value.slice(0, 4) > 5000 ? 5000 : money.value.slice(0, 4)
				}
			}

			const wxPayRefresh = () => {
				goPay()
			}
			//去支付
			const goPay = () => {
				if (!currentMethod.data.payMethod) {
					ElMessage.warning(L['请选择支付方式']);
					return;
				}
				let param = {};
				param.payType = currentMethod.data.payType;
				param.payMethod = currentMethod.data.payMethod;
				param.amount = money.value;

				//请求支付接口
				proxy
					.$post("v3/member/front/balanceRecharge/recharge", param)
					.then(res => {
						if (res.state == 200) {
							if (param.payMethod == "alipay") {
								document.write(res.data.payData); //自动提交表单数据
							} else if (param.payMethod == "wx") {
								rechargeId.value = res.data.rechargeId;
								show_wx_pay.value = true;
								wxPayQrImg.value = "data:image/png;base64," + res.data.payData; //微信支付二维码
								// 定时查询是否支付成功
								timer.value = setInterval(() => {
									queryPayState();
								}, 3000);
								//两小时自动跳转充值列表
								setTimeout(() => {
									router.replace({
										path: "/member/balance"
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
			};
			//获取充值明细   --用于判断充值是否成功
			const getPayInfo = () => {
				proxy.$get("v3/member/front/balanceRecharge/detail", {
					rechargeId: rechargeId.value
				})
					.then(res => {
						if (res.state == 200) {
							if (res.data.payState == 2) {

								//清除定时器
								if (timer.value) {
									clearInterval(timer.value);
									timer.value = 0;
								}
								if (window.history.state.back == '/member/balance' || !window.history.state.back) {
									ElMessage.success(L["充值成功,2s后自动跳转充值列表"]);
									setTimeout(() => {
										router.replace({
											path: "/member/balance"
										});
									}, 2000);
								} else {
									ElMessage.success(L["充值成功,2s后自动跳转支付页面"]);
									setTimeout(() => {
										router.go(-1)
									}, 2000);
								}
							}
						} else {
							ElMessage(res.msg);
						}
					})
					.catch(() => {
						//异常处理
					});
			};
			watch(money, (newVal, oldVal) => {
				if (newVal == "") {
					money.value = "";
					return;
				}
				var reg = /^[1-9]\d*\.?\d*$/;
				if (!reg.test(newVal)) {
					money.value = oldVal;
				}
			});
			const getReChargeSetting = () => {
				proxy.$get('v3/system/front/setting/getSettings', { names: 'recharge_is_enable' }).then(res => {
					if (res.state == 200) {
						rechargeSetting.value = res.data[0]
						if (rechargeSetting.value == '1') {
							getRechargeMethod();
						}
					}
				})
			}


			onMounted(() => {
				getReChargeSetting()
			});
			onUnmounted(() => {
				if (timer.value) {
					clearInterval(timer.value);
					timer.value = 0;
				}
			});
			return {
				L,
				money,
				current_step,
				ali,
				wechat,
				goStep2,
				method,
				changePayMethod,
				currentMethod,
				goPay,
				show_wx_pay,
				saoma,
				wx_pay_tip,
				wxPayQrImg,
				store,
				wxPayRefresh,
				moneyInput,
				rechargeSetting
			};
		}
	};
</script>

<style lang="scss">
	@import "../../../style/recharge.scss";

	.el-input.is-active .el-input__inner,
	.el-input__inner:focus {
		border-color: $colorMain;
		outline: 0;
	}

	/**
* 解决el-input设置类型为number时，中文输入法光标上移问题
**/
	.el-input__inner {
		line-height: 1px !important;
	}
</style>