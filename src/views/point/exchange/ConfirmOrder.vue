<template>
	<NavTopBar />

	<div class="top_order_info flex_row_start_center">
		<div class="top_logo">
			<img :src="configInfo.main_site_logo" alt="" style="object-fit: contain;">
		</div>

		<div class="top_info_progress flex_row_end_center">

			<div class="progress_item">
				<div class="progress flex_row_center_center">
					<span class="active">{{1}}</span>
					<div class="progress_line">
						<div :class="{content:true,active:false,current:false}"></div>
					</div>
				</div>
				<p>确认订单</p>
			</div>

			<div class="progress_item">
				<div class="progress flex_row_center_center">
					<span :class="{active:false}">{{2}}</span>
					<div class="progress_line">
						<div :class="{content:true,active:false}"></div>
					</div>
				</div>
				<p>付款</p>
			</div>

			<div class="progress_item">
				<div class="progress flex_row_start_center">
					<span :class="{active:false}">{{3}}</span>
				</div>
				<p>支付成功</p>
			</div>

		</div>
	</div>


	<div class="confirm_order_container">

		<!-- 收货地址start -->
		<div class="receive_info" v-if="virtual.isVG==1">
			<div class="receive_info_title">
				<span>收货信息</span>
			</div>
			<div v-if="orderAddress.data.memberName" class="receive_info_content flex_row_start_center">
				<div class="content_left flex_column_between_start">
					<span class="member">收货人：{{orderAddress.data.memberName}}</span>
					<span>联系方式：{{orderAddress.data.telMobile}}</span>
					<span :title="orderAddress.data.addressAll+orderAddress.data.detailAddress"
						class="address_detail overflow_ellipsis">收货地址：{{orderAddress.data.addressAll}}
						{{orderAddress.data.detailAddress}}</span>
				</div>
				<div class="content_right flex_column_center_center">
					<div class="replace_address pointer" @click="changeAddress">更换地址</div>
					<div class="add_address pointer" @click="addAddress">新建地址</div>
				</div>
			</div>
			<div v-else class="receive_info_content flex_row_center_center">
				<div class="add_address nomartop pointer" @click="addAddress">新建地址</div>
			</div>
		</div>
		<!-- 收货地址end -->

		<!-- 预留信息 -->
		<div class="pre_message" v-else-if="virtual.isVG==2&&virtual.virtualPre.length">
			<div class="pre_message_title">
				<span>{{'预留信息'}}</span>
			</div>
			<div class="pre_message_info">
				<table>
					<tr v-for="(item,index) in virtual.virtualPre" :key="index">
						<td>
							<div class="tag_pre"><strong
									v-if="item.isRequired==1">*</strong><span>{{item.reserveName}}：</span>
							</div>
						</td>
						<td v-if="item.reserveType==1||item.reserveType==3">
							<el-input id="pre_tag_input" v-model="item.reserveValue"
								:placeholder="`请输入${item.reserveName}`" type="text"
								:maxlength="item.reserveType==1?11:50" clearable :key="index"
								@input="preMsgErr.index=-1">
							</el-input>
						</td>
						<td v-else-if="item.reserveType==5">
							<el-input id="pre_tag_input" v-model="item.reserveValue"
								:placeholder="`请输入${item.reserveName}`" type="text" :maxlength="30" clearable
								:key="index" @input="preMsgErr.index=-1">
							</el-input>
						</td>
						<td v-else>
							<el-input id="pre_tag_input" v-model="item.reserveValue"
								:placeholder="`请输入${item.reserveName}`" type="text"
								:maxlength="item.reserveType==2?18:50" clearable :key="index"
								@input="preMsgErr.index=-1">
							</el-input>
						</td>
						<td v-if="index == preMsgErr.index">
							<span class="preMsgErr">{{preMsgErr.errMsg}}</span>
						</td>
					</tr>
				</table>
			</div>
		</div>
		<!-- 预留信息 -->

		<!-- 商品基本信息start -->
		<div class="store_item">
			<div class="store_name">
				<span>{{goods_data.data.storeName}}</span>
			</div>
			<!-- 商品信息 -->
			<div class="good_container">
				<div class="good_item flex_row_start_center">
					<div class="good_info flex_row_start_center">
						<img class="good_image" :src="goods_data.data.goodsImage" alt />
						<div class="good_info_text">
							<div class="good_name overflow_ellipsis_two">{{goods_data.data.goodsName}}</div>
							<div class="good_spec overflow_ellipsis">{{goods_data.data.specValues}}</div>
						</div>
					</div>
					<div class="good_price">{{goods_data.data.integralPrice}}积分 + ¥{{goods_data.data.cashPrice}}
					</div>
					<div class="num">*{{goods_data.data.buyNum}}</div>
				</div>
			</div>
			<!-- 商品信息 -->

			<!-- 发票 -->
			<div class="store_coupon invoice">
				<div class="store_coupon_title">
					<span>发票</span>
				</div>
				<div class="invoice_con flex">
					<div class="no_select_invoice flex_row_center_center">
						<img :src="not_select" v-if="select_invoice_info.invoiceId==''" alt
							@click="showVoiceDialog" />
						<img v-else :src="selected" alt />
						<span>我要开发票</span>
						<div class="invoice_info" v-if="select_invoice_info.invoiceId">
							<span class="invoice_name">{{select_invoice_info.invoiceTitle}}</span>
							<span class="invoice_type">{{select_invoice_info.invoiceContent}}</span>
							<span @click="showVoiceDialog" class="choose">重新选择</span>
						</div>
					</div>
				</div>
			</div>
			<!-- 发票 -->


			<!-- 订单备注 -->
			<div class="store_coupon">
				<div class="store_coupon_title">
					<span>订单备注</span>
				</div>
				<div class="store_coupon_con flex_row_start_center">
					<el-input maxlength="100" v-model="remark" type="text" placeholder="给商家留言" show-word-limit />
				</div>
			</div>
			<!-- 订单备注 -->

			<!-- 选择积分 -->
			<div class="store_coupon invoice">
				<div class="store_coupon_title">
					<span>积分选择</span>
				</div>
				<div class="invoice_con flex">
					<div class="no_select_invoice flex_row_center_center" v-if="integral.list.length">
						<img :src="not_select" v-if="integral.content==''" alt @click="showIntegralDialog" />
						<img v-else :src="selected" alt />
						<span>使用积分</span>
						<div class="invoice_info" v-if="integral.content">
							<span class="invoice_name">{{integral.content}}积分</span>
							<span @click="showIntegralDialog" class="choose">重新选择</span>
						</div>
					</div>
					<div class="no_select_invoice flex_row_center_center" v-else>
						<img src="@/assets/ban.png" />
						<span>暂无可选积分</span>
					</div>
				</div>
			</div>
			<!-- 选择积分 -->

			<div class="settle_info">
				<div class="total_money">
					<span>商品金额：</span>
					<span>{{integralPrice}}积分 + </span>
					<span> ¥{{integralcash}}</span>
				</div>
			</div>
		</div>
		<!-- 商品基本信息end -->


		<div class="order_total_settle">
			<div class="exchange_info">
				<table class="order_price">
					<tr>
						<td><span>实付款：</span></td>
						<td><span class="order_price_num">{{order_settle_info.integralAmount}}积分 +
								¥{{order_settle_info.cashAmount}}</span></td>
					</tr>
					<tr>
						<td><span>当前积分数：</span></td>
						<td><span class="red">{{integral.integralAva}}</span></td>
					</tr>

				</table>
			</div>
			<div class="goBuy" @click="goBuy" style="cursor: pointer;"
				v-if="order_settle_info.integralAmount<integral.integralAva">提交订单</div>
			<div class="intagral_lack" v-else>积分不足</div>
		</div>

		<!-- 发票选择——编辑 start -->
		<el-dialog title="发票信息" v-model="edit_voice_dialog" customClass="voice_width" :before-close="handleClose"
			lock-scroll="false">
			<p v-if="!add_voice_content" class="voice_list_title">发票历史信息选择：</p>
			<div v-if="!add_voice_content" class="voice_list">
				<div v-for="(voice,index) in invoice_list.data" :key="index" :title="voice.invoiceTitle"
					:class="{voice_item:true, active:voice.invoiceId==select_invoice_info.invoiceId,overflow_ellipsis:true,pointer:true}"
					@click="chooseVoice(voice)">
					<span>{{voice.invoiceTitle}}</span> <span v-if="voice.isDefault">默认</span>
					<img v-if="voice.invoiceId==select_invoice_info.invoiceId" :src="invoice_selected" alt />
				</div>
				<div class="add_voice_btn" @click="showAddvoice">新增发票</div>
				<div class="add_voice_btn add_voice_btn2" @click="removeAddvoice">暂不开发票</div>
			</div>
			<div class="add_voice_content" v-if="add_voice_content">
				<div class="item flex">
					<div class="title">发票内容：</div>
					<div class="right_info flex_column_center_start">
						<div class="item_select flex">
							<div @click="changeInvoiceContent(1)"
								:class="{select_btn:true,pointer:true, active:invoice_info.data.invoiceContent==1}">
								商品明细
								<img v-if="invoice_info.data.invoiceContent==1" :src="invoice_selected" alt />
							</div>
							<div @click="changeInvoiceContent(2)"
								:class="{select_btn:true,pointer:true, active:invoice_info.data.invoiceContent==2}">
								商品类别
								<img v-if="invoice_info.data.invoiceContent==2" :src="invoice_selected" alt />
							</div>
						</div>
						<p>发票内容将显示商品名称与价格信息，发票金额为实际支付金额，不含优惠等扣减金额</p>
					</div>
				</div>
				<!-- 发票抬头 -->
				<div class="item flex">
					<div class="title">发票抬头：</div>
					<div class="right_info flex_column_center_start">
						<div class="item_select flex">
							<div @click="changeInvoiceTitleType(1)"
								:class="{select_btn:true,pointer:true, active:invoice_info.data.titleType==1}">
								个人
								<img v-if="invoice_info.data.titleType==1" :src="invoice_selected" alt />
							</div>
							<div @click="changeInvoiceTitleType(2)"
								:class="{select_btn:true,pointer:true, active:invoice_info.data.titleType==2}">
								公司
								<img v-if="invoice_info.data.titleType==2" :src="invoice_selected" alt />
							</div>
						</div>
						<div style="margin-top: 20px;">
							<el-input v-if="invoice_info.data.titleType==1" class="input" size="small"
								placeholder="请在此填写发票抬头" v-model="invoice_info.data.invoiceTitle" clearable
								maxlength="30"></el-input>
						</div>

					</div>
				</div>
				<!-- 发票类型： -->
				<div class="item flex" v-if="invoice_info.data.titleType==2">
					<div class="title">发票类型：</div>
					<div class="right_info flex_column_center_start">
						<div class="item_select flex">
							<div @click="changeInvoiceType(1)"
								:class="{select_btn:true,pointer:true, active:invoice_info.data.invoiceType==1}">
								普通发票
								<img v-if="invoice_info.data.invoiceType==1" :src="invoice_selected" alt />
							</div>
							<div @click="changeInvoiceType(2)"
								:class="{select_btn:true,pointer:true, active:invoice_info.data.invoiceType==2}"
								v-if="isVatInvoice">
								增值税专用发票
								<img v-if="invoice_info.data.invoiceType==2" :src="invoice_selected" alt />
							</div>
						</div>
						<!-- <el-input class="input" size="small" placeholder="请在此填写发票抬头" v-model="input" clearable></el-input> -->
					</div>
				</div>
				<!-- 单位名称： -->
				<div class="item flex" v-if="invoice_info.data.titleType==2">
					<div class="title">单位名称：</div>
					<div class="right_info flex_column_center_start">
						<el-input class="input nomartop" size="small" placeholder="请在此填写单位名称"
							v-model="invoice_info.data.companyName" clearable maxlength="30"></el-input>
					</div>
				</div>
				<!-- 税号： -->
				<div class="item flex" v-if="invoice_info.data.titleType==2">
					<div class="title">税号：</div>
					<div class="right_info flex_column_center_start">
						<el-input class="input nomartop" size="small" placeholder="请在此填写纳税人识别号"
							v-model="invoice_info.data.taxCode" clearable maxlength="20"></el-input>
					</div>
				</div>

				<div class="item flex_row_start_center"
					v-if="invoice_info.data.titleType==2&&invoice_info.data.invoiceType==2">
					<div class="title">注册地址</div>
					<div class="right_info flex_column_center_start">
						<el-input class="input" size="small" placeholder="请输入注册地址"
							v-model="invoice_info.data.registerAddr" clearable maxlength="100"></el-input>
					</div>
				</div>

				<div class="item flex" v-if="invoice_info.data.titleType==2&&invoice_info.data.invoiceType==2">
					<div class="title">注册电话</div>
					<div class="right_info flex_column_center_start">
						<el-input class="input" size="small" placeholder="请输入注册电话"
							v-model="invoice_info.data.registerPhone" clearable maxlength="11"></el-input>
					</div>
				</div>

				<div class="item flex" v-if="invoice_info.data.titleType==2&&invoice_info.data.invoiceType==2">
					<div class="title">开户银行</div>
					<div class="right_info flex_column_center_start">
						<el-input class="input" size="small" placeholder="请输入开户银行"
							v-model="invoice_info.data.bankName" clearable maxlength="30">
						</el-input>
					</div>
				</div>

				<div class="item flex" v-if="invoice_info.data.titleType==2&&invoice_info.data.invoiceType==2">
					<div class="title">银行账户</div>
					<div class="right_info flex_column_center_start">
						<el-input class="input" size="small" placeholder="请输入银行账户"
							v-model="invoice_info.data.bankAccount" clearable maxlength="50"></el-input>
					</div>
				</div>

				<div class="item flex" v-if="invoice_info.data.titleType==2&&invoice_info.data.invoiceType==2">
					<div class="title">收票人姓名</div>
					<div class="right_info flex_column_center_start">
						<el-input class="input" size="small" placeholder="请输入收票人姓名"
							v-model="invoice_info.data.receiverName" clearable maxlength="5"></el-input>
					</div>
				</div>

				<div class="item flex" v-if="invoice_info.data.titleType==2&&invoice_info.data.invoiceType==2">
					<div class="title">收票人电话</div>
					<div class="right_info flex_column_center_start">
						<el-input class="input" size="small" placeholder="请输入收票人电话"
							v-model="invoice_info.data.receiverMobile" clearable maxlength="11"></el-input>
					</div>
				</div>

				<div class="item flex" v-if="invoice_info.data.titleType==2&&invoice_info.data.invoiceType==2">
					<div class="title">收票人地址</div>
					<div class="right_info flex_column_center_start">
						<el-input class="input" size="small" placeholder="请输入收票人地址"
							v-model="invoice_info.data.receiverAddress" clearable maxlength="100"></el-input>
					</div>
				</div>

				<!-- 收票邮箱： -->
				<div class="item flex" v-if="invoice_info.data.invoiceType!=2">
					<div class="title">收票邮箱：</div>
					<div class="right_info flex_column_center_start">
						<el-input class="input nomartop" size="small" placeholder="请输入收票邮箱"
							v-model="invoice_info.data.receiverEmail" clearable maxlength="50"></el-input>
					</div>
				</div>
				<div class="flex_row_end_center is_defalut">
					<span>设为默认发票</span>
					<el-switch v-model="invoice_info.data.isDefault" active-color="#EC2116"
						inactive-color="#EEEEEE">
					</el-switch>
				</div>
				<div class="btn_con flex_row_center_center">
					<div class="return" @click="voiceReturn">返回</div>
					<div class="confirm_add_voice" @click="confirmAddVoice">确定</div>
				</div>
			</div>
		</el-dialog>
		<!-- 发票选择——编辑 end -->

		<!-- 地址选择弹窗 start -->
		<el-dialog title="更换地址" v-model="show_select_address" customClass="select_address_width"
			:before-close="handleClose" lock-sroll="false">
			<div class="out_stock_dialog address_con">
				<div v-for="(item,index) in address_list.data" :key="index" @click="selectAddress(index)"
					:class="{address_item:true, flex_column_start_start:true, select:current_address_index==index}">
					<span>收货人：{{item.memberName}}</span>
					<span>联系方式：{{item.telMobile}}</span>
					<span class="overflow_ellipsis address_text"
						:title="item.addressAll+item.detailAddress">收货地址：{{item.addressAll}}
						{{item.detailAddress}}</span>
					<img v-if="current_address_index==index" class="selected" :src="invoice_selected" alt />
				</div>
			</div>
			<div class="btn_con flex_row_center_center">
				<div class="remove red" @click="confirmChangeAddress()">提交修改</div>
			</div>
		</el-dialog>
		<!-- 地址选择弹窗 end -->

		<el-dialog title="使用积分" v-model="use_integral_dialog" width="550px" lock-scroll="false">
			<div class="integral_avalible">
				<span>可用积分</span>: <span>{{integral.integralAva}}积分</span>
			</div>
			<div class="use_integral_list">
				<div class="integral_item" v-for="(item,integralIndex) in integral.list" :key="integralIndex">
					<span>使用<font color="#e2231a">{{item}}</font>积分</span>
					<div>
						<input type="radio" v-model="integral.chosen" :value="item" :id="integralIndex"
							name="integral">
						<label :for="integralIndex" class="integralLabel">
							<div class="img"></div>
						</label>
					</div>
					<div class="no_avalible" v-if="item>integral.integralAva"></div>
				</div>
			</div>
			<div class="integral_btn">
				<button class="integral_abandom" @click="integralAban">暂不使用积分</button>
				<button class="integral_engage" @click="integralEng">使用</button>
			</div>
		</el-dialog>

		<SldAddressOperation v-if="addressVisibleFlag" @close="close" @refreshAddress="refreshAddress"
			:visibleFlag="true" :type="type" />
	</div>

	<FooterService />
	<FooterLink />
</template>

<script>
	import { reactive, getCurrentInstance, ref, onMounted, onUnmounted } from "vue";
	import {
		ElDialog,
		ElInput,
		ElSwitch,
		ElMessage,
	} from "element-plus";
	import { useRoute, useRouter } from "vue-router";
	import { useStore } from 'vuex'
	import SldAddressOperation from "../../../components/AddressOperation";
	import NavTopBar from "../../../components/NavTopBar";
	import FooterService from "../../../components/FooterService";
	import FooterLink from "../../../components/FooterLink";
	export default {
		name: "ConfirmOrder",
		components: {
			ElDialog,
			ElInput,
			ElSwitch,
			SldAddressOperation,
			NavTopBar,
			FooterService,
			FooterLink,

		},
		setup() {
			const route = useRoute();
			const router = useRouter();
			const store = useStore()
			const configInfo = ref(store.state.configInfo)
			const addressVisibleFlag = ref(false);
			const { proxy } = getCurrentInstance();
			const not_select = require("../../../assets/buy/not_select.png");
			const selected = require("../../../assets/buy/selected.png");
			const invoice_selected = require("../../../assets/buy/invoice_selected.png");
			const navlist = reactive({ data: [] });
			const show_change_address = ref(false);
			const edit_voice_dialog = ref(false);
			const add_voice_content = ref(false);
			const use_integral_dialog = ref(false)
			const type = ref("add");
			const timer = ref(0); //定时器
			const no_good_info = reactive({ data: {} });
			const show_select_address = ref(false);
			const pre_params = reactive({ data: {} });
			const orderAddress = reactive({ data: "" });
			const address_list = reactive({ data: [] });
			const goods_data = reactive({ data: [] });
			const isVatInvoice = ref('')
			const current_address_index = ref(0);
			const remark = ref('')
			const integralcash = ref('')
			const integralPrice = ref('')
			const reserveInfoList = ref([])
			const virtual = reactive({
				isVG: null,
				virtualPre: []
			})
			const preMsgErr = reactive({
				index: null,
				errMsg: ''
			})
			const integral = reactive({
				list: [],
				chosen: '',
				integralAva: '',
				integralScale: '',
				content: ''
			})
			const select_invoice_info = reactive({
				invoiceId: "",
				invoiceContent: "",
				invoiceTitle: ""
			});
			const invoice_list = reactive({ data: [] }); //发票列表
			const invoice_info = reactive({
				data: {
					//新增发票信息
					bankAccount: "", //银行帐户(专用发票）
					bankName: "", //开户银行(专用发票）
					invoiceContent: 1, //发票内容：1-商品明细；2-商品类别
					invoiceTitle: "", //发票抬头(通用信息）
					invoiceType: 1, //发票类型：1-普通发票；2-增值税发票
					isDefault: false, //是否默认发票：0-非默认发票，1-默认发票
					receiverAddress: "", //收票人详细地址(通用信息）
					receiverEmail: "", //	收票邮箱(通用信息）
					receiverMobile: "", //收票人手机号(通用信息）
					receiverName: "", //收票人姓名(通用信息）
					registerAddr: "", //注册地址(专用发票）
					registerPhone: "", //注册电话(专用发票）
					taxCode: "", //纳税人识别号(通用信息）
					titleType: 1, //抬头类型：1-个人；2-公司
					companyName: "" //单位名称
				}
			});
			// 重置发票信息
			const resetVoiceInfo = () => {
				invoice_info.data.bankAccount = "";
				invoice_info.data.bankName = "";
				invoice_info.data.invoiceContent = 1;
				invoice_info.data.invoiceTitle = "";
				invoice_info.data.invoiceType = 1;
				invoice_info.data.isDefault = false;
				invoice_info.data.receiverAddress = "";
				invoice_info.data.receiverEmail = "";
				invoice_info.data.receiverMobile = "";
				invoice_info.data.receiverName = "";
				invoice_info.data.registerAddr = "";
				invoice_info.data.registerPhone = "";
				invoice_info.data.taxCode = "";
				invoice_info.data.titleType = 1;
				invoice_info.data.companyName = "";
			};
			const order_settle_info = reactive({
				cashAmount: "",
				integralAmount: "",
			});

			//获取商品信息
			const confirmOrder = (type) => {
				let param = {};
				//立即购买
				param.productId = route.query.productId;
				param.number = route.query.numbers;

				if (type == 2) {
					param.useIntegral = integral.chosen
				}

				proxy.$post("v3/integral/front/integral/orderOperate/confirm", param).then(res => {
					if (res.state == 200) {

						if (type == 1) {
							goods_data.data = res.data.product;
							integral.list = res.data.integralList
							integral.integralAva = res.data.memberIntegral
							integral.integralScale = res.data.integralScale
							integral.chosen = res.data.integralAmount
							goods_data.data.storeName = res.data.storeName
							isVatInvoice.value = res.data.isVatInvoice
							virtual.isVG = res.data.isVirtualGoods
							virtual.virtualPre = res.data.reserveNameList.map(item => {
								item.reserveValue = ''
								return item
							})
						}

						if (res.data.integralList.length) {
							if (integral.content != '暂不使用') {
								integral.chosen = res.data.integralAmount
								integral.content = integral.chosen
							}
						}



						order_settle_info.cashAmount = integralcash.value = new Number(res.data.cashAmount).toFixed(2);
						order_settle_info.integralAmount = integralPrice.value = res.data.integralAmount;

						//处理平台优惠券
					} else {
						ElMessage(res.msg);
					}
				})
			};


			//获取地址列表
			const getAddressList = () => {
				proxy
					.$get("v3/member/front/memberAddress/list")
					.then(res => {
						if (res.state == 200) {
							address_list.data = res.data.list;
							if (res.data.list.length > 0 && !orderAddress.data.addressId) {
								var default_address = res.data.list.filter(function (item) {
									return item.isDefault == 1;
								});
								if (default_address.length > 0) {
									orderAddress.data = default_address[0];
								} else {
									orderAddress.data = res.data.list[0];
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
			const removeAddvoice = () => {
				select_invoice_info.invoiceId = false;
				edit_voice_dialog.value = false;
			}
			//切换地址
			const selectAddress = index => {
				current_address_index.value = index;
			};
			//确认修改地址
			const confirmChangeAddress = () => {
				orderAddress.data = address_list.data[current_address_index.value];
				show_select_address.value = false;
			};
			//弹出地址选择框
			const changeAddress = () => {
				getAddressList();
				show_select_address.value = true;
			};
			//弹出发票选择框
			const showVoiceDialog = () => {
				edit_voice_dialog.value = true;
				getVoiceList();
			};
			const showAddvoice = () => {
				add_voice_content.value = true;
			};
			//获取发票列表
			const getVoiceList = () => {
				proxy
					.$get("v3/member/front/memberInvoice/list")
					.then(res => {
						if (res.state == 200) {
							let invoiceRq = invoice_info.data.isVatInvoice ? 2 : 1
							invoice_list.data = res.data.list.filter(i => i.invoiceType == invoiceRq);
							if (res.data.list.length > 0) {
								add_voice_content.value = false;
							} else {
								add_voice_content.value = true;
							}
						} else {
							ElMessage(res.msg);
						}
					})
					.catch(() => {
						//异常处理
					});
			};
			//切换发票内容
			const changeInvoiceContent = invoiceContent => {
				invoice_info.data.invoiceContent = invoiceContent;
			};
			//切换发票抬头
			const changeInvoiceTitleType = titleType => {
				invoice_info.data.titleType = titleType;
				if (titleType == 1) {
					invoice_info.data.invoiceType = 1;
				}
			};
			//切换发票类型
			const changeInvoiceType = invoiceType => {
				invoice_info.data.invoiceType = invoiceType;
			};
			//新增发票
			const confirmAddVoice = () => {
				if (invoice_info.data.titleType == 1) {
					if (invoice_info.data.invoiceTitle == "") {
						ElMessage("请填写发票抬头");
						return;
					}
					var reg = new RegExp(
						"^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$"
					);
					if (invoice_info.data.receiverEmail == "") {
						ElMessage("请填写收票邮箱");
						return;
					}
					if (!reg.test(invoice_info.data.receiverEmail)) {
						ElMessage("邮箱格式不正确，请重新输入！");
						return;
					}
				} else if (invoice_info.data.titleType == 2) {
					if (invoice_info.data.companyName == "") {
						ElMessage("请填写单位名称");
						return;
					}
					if (invoice_info.data.taxCode == "") {
						ElMessage("请填写纳税人税号");
						return;
					}
					let regExp = /[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}/;
					if (regExp.test(invoice_info.data.taxCode) == false) {
						ElMessage("请填写正确的税号");
						return;
					}
					if (invoice_info.data.invoiceType == 1) {
						if (invoice_info.data.receiverEmail == "") {
							ElMessage("请填写收票邮箱");
							return;
						}
					} else {
						if (invoice_info.data.registerAddr == "") {
							ElMessage("请填写注册地址");
							return;
						}
						if (invoice_info.data.registerPhone == "") {
							ElMessage("请填写注册电话");
							return;
						}
						if (invoice_info.data.bankName == "") {
							ElMessage("请填写开户银行");
							return;
						}
						if (invoice_info.data.bankAccount == "") {
							ElMessage("请填写银行账户");
							return;
						}
						if (invoice_info.data.receiverName == "") {
							ElMessage("请填写收票人姓名");
							return;
						}
						if (invoice_info.data.receiverMobile == "") {
							ElMessage("请填写收票人电话");
							return;
						}
						if (invoice_info.data.receiverAddress == "") {
							ElMessage("请填写收票人地址");
							return;
						}
					}
				}
				var param = {};
				param.titleType = invoice_info.data.titleType;
				param.invoiceType = invoice_info.data.invoiceType;
				param.invoiceContent = invoice_info.data.invoiceContent;
				if (invoice_info.data.isDefault) {
					param.isDefault = 1;
				} else {
					param.isDefault = 0;
				}
				if (invoice_info.data.invoiceType != 2) {
					param.receiverEmail = invoice_info.data.receiverEmail;
				}
				if (invoice_info.data.titleType == 1) {
					param.invoiceTitle = invoice_info.data.invoiceTitle;
				} else {
					param.taxCode = invoice_info.data.taxCode;
					param.invoiceTitle = invoice_info.data.companyName;
					if (invoice_info.data.invoiceType == 2) {
						param.registerAddr = invoice_info.data.registerAddr;
						param.registerPhone = invoice_info.data.registerPhone;
						param.bankName = invoice_info.data.bankName;
						param.bankAccount = invoice_info.data.bankAccount;
						param.receiverName = invoice_info.data.receiverName;
						param.receiverMobile = invoice_info.data.receiverMobile;
						param.receiverAddress = invoice_info.data.receiverAddress;
					}
				}
				proxy
					.$post("v3/member/front/memberInvoice/add", param)
					.then(res => {
						if (res.state == 200) {
							if (res.state == 200) {
								select_invoice_info.invoiceTitle = invoice_info.data.invoiceTitle;
								select_invoice_info.invoiceContent =
									invoice_info.data.invoiceContent == 1 ? "商品明细" : "商品类别";
								select_invoice_info.invoiceId = res.data;
								edit_voice_dialog.value = false;
								add_voice_content.value = false;
								resetVoiceInfo();
								ElMessage.success({
									message: "新增成功",
									type: "success"
								});
							}
						} else {
							ElMessage(res.msg);
						}
					})
					.catch(() => {
						//异常处理
					});
			};
			//新增发票返回
			const voiceReturn = () => {
				if (invoice_list.data.length > 0) {
					add_voice_content.value = false;
				} else {
					edit_voice_dialog.value = false;
				}
				resetVoiceInfo();
			};
			//选择发票
			const chooseVoice = voice => {
				select_invoice_info.invoiceTitle = voice.invoiceTitle;
				select_invoice_info.invoiceContent =
					voice.invoiceContent == 1 ? "商品明细" : "商品类别";
				select_invoice_info.invoiceId = voice.invoiceId;
				edit_voice_dialog.value = false;
			};

			//弹出使用积分
			const showIntegralDialog = () => {
				use_integral_dialog.value = true
			}


			const integralAban = () => {

				use_integral_dialog.value = false
				integral.chosen = 0
				integral.content = "暂不使用"
				confirmOrder(2)
			}

			const integralEng = () => {

				if (!integral.chosen) {
					ElMessage('请选择积分')
					return
				}


				integral.content = integral.chosen
				confirmOrder(2)
				use_integral_dialog.value = false
			}





			//返回上一页‘
			const returnLastPage = () => {
				router.go(-1);
			};

			//跳转订单页
			const goBuy = () => {
				let param = {};
				param.orderFrom = 1;
				param.addressId = orderAddress.data.addressId;
				param.productId = JSON.parse(pre_params.data.productId);
				param.number = pre_params.data.numbers
				param.integral = order_settle_info.integralAmount
				param.remark = remark.value

				if (select_invoice_info.invoiceId) {
					param.invoiceId = select_invoice_info.invoiceId

				}



				reserveInfoList.value = []
				//预留信息校验start
				if (virtual.isVG == 2 && virtual.virtualPre.length > 0) {
					for (let i = 0; i < virtual.virtualPre.length; i++) {

						let { reserveName, reserveType, reserveValue, reserveNameId, isRequired } = virtual.virtualPre[i]
						if (checkPreMsg(reserveType, reserveValue, reserveName, isRequired) == true) {
							reserveInfoList.value.push({ reserveName, reserveValue, reserveNameId })
						} else {
							preMsgErr.errMsg = checkPreMsg(reserveType, reserveValue, reserveName, isRequired)
							preMsgErr.index = i
							ElMessage(checkPreMsg(reserveType, reserveValue, reserveName, isRequired))
							isPreventClick.value = false
							return
						}

					}
				}
				//预留信息校验end

				if (virtual.isVG == 2) {
					param.reserveInfoList = reserveInfoList.value
				}




				proxy.$post("v3/integral/front/integral/orderOperate/submit", param, 'json').then(res => {
					if (res.state == 200) {
						let paySn = res.data.paySn;
						proxy.$sldStatEvent({ behaviorType: 'buy' });
						setTimeout(() => {
							router.push({
								path: "/point/pay",
								query: {
									paySn: paySn,
									payFrom: 1
								}
							})
						}, 500);
					} else {
						ElMessage(res.msg);
					}
				})
			};
			onUnmounted(() => {
				if (timer.value) {
					clearInterval(timer.value);
					timer.value = 0;
				}
			});
			//关闭弹窗
			const close = () => {
				addressVisibleFlag.value = false;
			};
			//弹出新建地址窗口
			const addAddress = () => {
				addressVisibleFlag.value = true;
			};
			const refreshAddress = (addressInfo, addressId) => {
				orderAddress.data = addressInfo;
				orderAddress.data.addressId = addressId;
			};
			//校验预留信息
			const checkPreMsg = (type, value, name, isRequired) => {
				switch (type) {
					case 1: {
						if (isRequired == 1) {
							return proxy.$checkPhone(value)
						} else {
							let regMobile = /(1[3-9]\d{9}$)/;
							if (value && !regMobile.test(value)) {
								return `请输入正确的${name}!`;
							} else {
								return true
							}
						}

						break;
					}
					case 2: {
						if (isRequired == 1) {
							return proxy.$checkIdentity(value)
						} else {
							if (value) {
								let reg18 =
									/^[1-9][0-9]{5}(18|19|20)[0-9]{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)[0-9]{3}([0-9]|(X|x))/
								let reg15 =
									/^[1-9][0-9]{5}[0-9]{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)[0-9]{2}[0-9]/
								if (reg18.test(value) || reg15.test(value)) {
									return true;
								} else {
									return `请输入正确的${name}`
								}
							} else {
								return true
							}

						}

						break
					}

					case 3: {
						let regNum = /[0-9]+(.[0-9]+)?/
						if (isRequired == 1) {
							if (!value) {
								return `请输入${name}`
							} else if (!regNum.test(value)) {
								return `请输入正确的${name}`
							} else {
								return true
							}

						} else {
							return true
						}
						break;
					}
					case 4: {
						if (isRequired == 1) {
							if (!value) {
								return `请输入${name}`
							} else if (type == 4) {
								return true
							}
						} else {
							return true
						}
						break;
					}
					case 5: {
						if (isRequired == 1) {
							return proxy.$checkEmail(value)
						} else {
							let reg =
								/^([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/;
							if (value && !reg.test(value)) {
								return `请输入正确的${name}!`;
							} else {
								return true;
							}
						}

						break
					}
				}
			}
			onMounted(() => {
				pre_params.data = route.query;
				getAddressList();
				confirmOrder(1);

			});
			return {
				navlist,
				not_select,
				selected,
				show_change_address,
				edit_voice_dialog,
				showVoiceDialog,
				invoice_selected,
				add_voice_content,
				showAddvoice,
				use_integral_dialog,
				orderAddress,
				changeAddress,
				show_select_address,
				address_list,
				current_address_index,
				selectAddress,
				confirmChangeAddress,
				goods_data,
				pre_params,
				invoice_info,
				changeInvoiceContent,
				changeInvoiceTitleType,
				changeInvoiceType,
				confirmAddVoice,
				invoice_list,
				select_invoice_info,
				voiceReturn,
				chooseVoice,
				order_settle_info,
				confirmOrder,
				goBuy,
				returnLastPage,
				no_good_info,
				addressVisibleFlag,
				close,
				type,
				refreshAddress,
				addAddress,
				remark,
				showIntegralDialog,
				integral,
				integralAban,
				integralEng,
				integralcash,
				integralPrice,
				configInfo,
				removeAddvoice,
				isVatInvoice,
				virtual,
				preMsgErr,
				reserveInfoList,
				checkPreMsg
			};
		}
	};
</script>

<style lang="scss" scoped>
	@import "../../../style/point/order.scss";

	.top_logo {
		img {
			width: 100%;
			height: 100%;
		}
	}
</style>
<style lang="scss">
	.voice_width {
		width: 605px !important;
	}

	.out_store_width {
		width: 480px !important;
	}

	.select_address_width {
		width: 500px !important;
	}

	.el-dialog__body {
		padding-top: 10px;
	}

	.el-input__inner {
		font-size: 12px;
	}

	.add_voice_btn2 {
		margin: -30px 114px 10px !important;
		cursor: pointer;
	}

	.el-select .el-input__inner:focus {
		border-color: #e2231a;
	}

	.el-select .el-input.is-focus .el-input__inner {
		border-color: #e2231a;
	}

	.el-input.is-active .el-input__inner,
	.el-input__inner:focus {
		border-color: #e2231a;
		outline: 0;
	}
</style>