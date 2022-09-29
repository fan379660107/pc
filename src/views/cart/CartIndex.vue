//购物车页面
<template>
	<div class="sld_cart_index">
		<div class="cart_content" v-if="
        cartData.data &&
        ((cartData.data.invalidList && cartData.data.invalidList.length > 0) ||
          (cartData.data.storeCartGroupList &&
            cartData.data.storeCartGroupList.length > 0))">
			<!-- 购物车列表顶部标题 start-->
			<div class="cart_title flex_row_start_center">
				<div class="cart_title_pre flex_row_start_center"
					v-if="cartData.data.storeCartGroupList.length > 0">
					<img src="@/assets/cart/sel.png" alt="" v-if="cartData.data.checkedAll"
						@click="changeSelectState('all', cartData.data.checkedAll)" />
					<img src="@/assets/cart/not_sel.png" alt="" v-if="!cartData.data.checkedAll"
						@click="changeSelectState('all', cartData.data.checkedAll)" />
					<span>{{ L["全选"] }}<text
							v-if="cartData.data.availableCartNum">（{{cartData.data.availableCartNum}}）</text></span>
				</div>
				<div class="cart_title_pre">
					<span>{{ L["商品信息"] }}</span>
				</div>
				<div class="cart_title_pre">
					<span>{{ L["单价"] }}</span>
				</div>
				<div class="cart_title_pre">
					<span>{{ L["数量"] }}</span>
				</div>
				<div class="cart_title_pre">
					<span>{{ L["小计（元）"] }}</span>
				</div>
				<div class="cart_title_pre">
					<span>{{ L["操作"] }}</span>
				</div>
			</div>
			<!-- 购物车列表顶部标题 end-->
			<!-- 购物车列表 start -->
			<div class="cart_lists" v-show="cartData.data">
				<div class="cart_lists_pre"
					v-for="(cartGroupItem, cartGroupIndex) in cartData.data.storeCartGroupList"
					:key="cartGroupIndex">
					<!-- 店铺信息 start -->
					<div class="store_info flex_row_start_center">
						<!-- 可选择 -->
						<img src="@/assets/cart/sel.png" alt="" class="store_sel"
							v-if="cartGroupItem.checkedAll && !cartGroupItem.lackAll"
							@click="changeSelectState('store', cartGroupItem.checkedAll, cartGroupItem)" />
						<img src="@/assets/cart/not_sel.png" alt="" class="store_sel"
							v-if="!cartGroupItem.checkedAll && !cartGroupItem.lackAll"
							@click="changeSelectState('store', cartGroupItem.checkedAll, cartGroupItem)" />
						<!-- 全部无货，不可选择 -->
						<img src="@/assets/cart/not_sel.png" alt="" class="store_sel"
							v-if="cartGroupItem.lackAll" />
						<router-link target="_blank" :to="`/store/index?vid=${cartGroupItem.storeId}`"
							class="store_des flex_row_start_center cursor_pointer">
							<span>{{ cartGroupItem.storeName }}</span>
							<img src="@/assets/cart/right_down.png" alt="" />
						</router-link>
						<img class="store_kefu" src="@/assets/goods/server.png" @click="kefu(cartGroupItem)"
							:title="L['联系客服']" />
						<div v-show="cartGroupItem.hasCoupon" class="store_coupons"
							:class="{active:cartGroupItem.showCoupon}">
							<img class="store_coupons_bg" src="@/assets/cart_coupons.png"
								@click="openCouponModel(cartGroupItem.storeId,cartGroupIndex,'open')" />
							<div v-if="cartGroupItem.showCoupon" class="store_coupons_list">
								<div class="store_coupons_close flex_row_end_center">
									<img src="@/assets/buy/close.png"
										@click="closeCouponModel(cartGroupIndex)" />
								</div>
								<div class="model_coupon_list">
									<CouponItem v-for="(couponItem, couponIndex) in couponList.data.list"
										:key="couponIndex" :class="sld_coupon_item" coupon_type="small"
										:coupon_item="couponItem"
										@refreshCouponList="openCouponModel(null,null,'get')">
									</CouponItem>
								</div>
								<div class="flex_row_end_center sld_pagination sld_page_bottom"
									v-if="couponList.data.pagination && couponList.data.pagination.total">
									<el-pagination @current-change="handleCurrentChangeCoupon"
										v-model:currentPage="curCouponPage" :page-size="couponPageSize"
										layout="prev, pager, next, jumper"
										:total="couponList.data.pagination.total" :hide-on-single-page="true">
									</el-pagination>
								</div>
							</div>
						</div>
						<!-- <div class="get_coupons_btn flex_row_center_center cursor_pointer"
							v-show="cartGroupItem.hasCoupon" @click="openCouponModel(cartGroupItem.storeId)">
							<span>{{ L["领取优惠券"] }}</span>
							<img src="@/assets/cart/right_down_red.png" alt="" />
						</div> -->
					</div>
					<!-- 店铺信息 end -->
					<!-- 商品信息 start -->
					<div class="goods_con"
						v-for="(promotionCartGroupItem, promotionCartGroupIndex) in cartGroupItem.promotionCartGroupList"
						:key="promotionCartGroupIndex">
						<!-- 满减活动 start -->
						<div class="full_reduc_activity flex_row_start_center"
							v-show="promotionCartGroupItem.promotionDes">
							<span class="full_reduc_title">{{ L["满减"] }}</span>
							<div class="full_reduc_des" v-html="promotionCartGroupItem.promotionDes"></div>
							<!-- <div class="go_collect_bill">{{ L["再逛逛"] }}></div> -->
							<!-- <div class="go_collect_bill">{{L['去凑单']}}></div> -->
						</div>
						<!-- 满减活动 end -->
						<!-- 商品列表 start -->
						<div class="goods_list">
							<div class="goods_pre flex_row_start_center"
								:class="{active:(cartItem.isChecked && cartItem.productState!=3)}"
								v-for="(cartItem, cartIndex) in promotionCartGroupItem.cartList"
								:key="cartIndex">
								<!-- 可选择 1-正常状态，2-商品失效（已删除），3-商品无货-->
								<div class="goods_pre_sel" :class="{no_cursor:cartItem.productState==3}">
									<img src="@/assets/cart/sel.png" alt="" class="store_sel"
										v-if="cartItem.isChecked && cartItem.productState != 3"
										@click="changeSelectState('goods', cartItem.isChecked, cartItem)" />
									<img src="@/assets/cart/not_sel.png" alt="" class="store_sel"
										v-if="!cartItem.isChecked && cartItem.productState != 3"
										@click="changeSelectState('goods', cartItem.isChecked, cartItem)" />
									<!-- 不可选择 无货-->
									<img src="@/assets/cart/not_sel.png" alt="" class="store_sel"
										v-if="cartItem.productState == 3" />
								</div>

								<!-- 商品信息 -->
								<div :style="{backgroundImage: 'url(' + cartItem.productImage + ')'}"
									class="goods_img" :class="{ no_stock_img: cartItem.productState == 3 }"
									@click="goGoodsDetail(cartItem.productId)"></div>
								<div class="goods_des"
									:class="cartItem.specValues?'flex_column_between_start':'flex_column_center_start'"
									@click="goGoodsDetail(cartItem.productId)">
									<p class="goods_name"
										:class="{ no_stock_name: cartItem.productState == 3 }">
										<text>{{ cartItem.goodsName }}</text>
									</p>
									<p class="goods_spec"
										:class="{ no_stock_spec: cartItem.productState == 3 }">
										<text>{{ cartItem.specValues }}</text>
									</p>
								</div>
								<!-- 单价 -->
								<div class="goods_price_prom">
									<div class="goods_price"
										:class="{ no_stock_price: cartItem.productState == 3 }">
										￥{{ cartItem.productPrice }}
									</div>
									<div v-if="cartItem.promotionList && cartItem.promotionList.length > 0">
										<el-popover width="300px" v-model:visible="cartItem.promotionModel"
											@show="promotionShow(cartItem)">
											<template #reference>
												<div v-if="cartItem.promotionList.length > 0"
													class="promotion cursor_pointer">
													{{ L["促销"] }}<i
														class="iconfont icon-ziyuan11-copy"></i>
												</div>
											</template>
											<div class="option_promotion">
												<el-radio-group v-model="curPromotion"
													@change="changePromotion($event, cartItem)"
													text-color="#333333" fill="#FF0000">
													<el-radio
														v-for="(promotionItem, promotionIndex) in cartItem.promotionList"
														:key="promotionIndex"
														:label="promotionItem.goodsPromotionId"
														class="promotion_radio">
														<p v-html="promotionItem.promotionDes"></p>
													</el-radio>
												</el-radio-group>
												<div class="promotion_btn flex_row_center_center">
													<span @click="selPromotion()">{{ L["确定"] }}</span>
													<span @click="cancelPromotion()">{{ L["取消"] }}</span>
												</div>
											</div>

										</el-popover>
									</div>
								</div>
								<!-- 数量 -->
								<div class="goods_num flex_column_center_center">
									<div class="goods_edit_nem flex_row_center_center">
										<span @click="editNum('reduce', cartItem)">-</span>
										<input type="number" v-model="cartItem.buyNum"
											@input="editNum('edit', cartItem, $event)"
											@blur="editNum('blur', cartItem, $event)" />
										<span @click="editNum('add', cartItem)">+</span>
									</div>
									<div class="goods_stocks" v-if="cartItem.productState != 3">
										{{ L["库存"] }} {{ cartItem.productStock }}
									</div>
									<div class="goods_stocks goods_stocks_no"
										v-if="cartItem.productState == 3">
										{{ L["库存不足"] }}
									</div>
									<div class="goods_stocks goods_stocks_red"
										v-if="cartItem.buyNum > cartItem.productStock">
										{{ L["剩余"] }} {{ cartItem.productStock }} {{ L["件"] }}
									</div>
								</div>
								<!-- 小计 -->
								<div class="subtotal">￥{{cartItem.buyNum?(Number(cartItem.buyNum)
									*cartItem.productPrice).toFixed(2):cartItem.productPrice.toFixed(2)}}</div>
								<!-- 操作 -->
								<div class="goods_btn flex_column_center_start">
									<span class="goods_collect" @click="moveCartGoods(cartItem.cartId)"
										v-if="token">{{L["移入收藏夹"]}}</span>
									<el-popconfirm :title="L['确定删除选中商品？']"
										@confirm="delCartGoods('goods', cartItem)"
										:confirmButtonText="L['确定']" :cancelButtonText="L['取消']">
										<template #reference>
											<span class="goods_del">{{ L["删除"] }}</span>
										</template>
									</el-popconfirm>
								</div>
							</div>
						</div>
						<!-- 商品列表 end -->
					</div>
					<!-- 商品信息 end -->
				</div>
				<!-- 失效商品 start -->
				<div class="invalid_goods" v-if="cartData.data.invalidList && cartData.data.invalidList.length > 0">
					<div class="invalid_goods_title">
						<span>{{ L["失效商品"] }}</span>
						<span v-if="token&&cartData.data.invalidList.length > 0" @click="clearInvalidGoods">{{
							L["清空"] }}</span>
					</div>
					<div class="invalid_goods_list">
						<div class="invalid_goods_pre flex_row_start_center"
							v-for="(invalidItem, invalidIndex) in cartData.data.invalidList" :key="invalidIndex">
							<span class="invalid_tips">{{ L["失效"] }}</span>
							<div :style="{backgroundImage: 'url(' + invalidItem.productImage + ')'}"
								class="invalid_img"></div>
							<div class="invalid_des">
								<p class="invalid_name">{{ invalidItem.goodsName }}</p>
								<p class="invalid_spec">{{ invalidItem.specValues }}</p>
							</div>
							<div class="invalid_price">￥{{ invalidItem.productPrice }}</div>
							<div class="invalid_num flex_column_center_center">
								<div class="invalid_edit_num flex_row_center_center">
									<span>-</span>
									<input type="number" disabled v-model="invalidItem.buyNum" />
									<span>+</span>
								</div>
								<!-- <div class="invalid_off">{{ L["已下架"] }}</div> -->
							</div>
							<div class="invalid_subtotal">￥{{ invalidItem.subtotal }}</div>
							<div class="invalid_btn flex_column_center_start">
								<!-- <span class="invalid_collect" @click="moveCartGoods(invalidItem.cartId)">{{ L["移入收藏夹"] }}</span> -->
								<span class="invalid_del" @click="delCartGoods('goods', invalidItem)">{{ L["删除"]
									}}</span>
							</div>
						</div>
					</div>
				</div>
				<!-- 失效商品 -->
			</div>
			<!-- 购物车列表 end -->
			<!-- 操作按钮 start -->
			<div class="options_btn flex_row_between_center" ref="optionsBtn">
				<div class="options_btn_left flex_row_start_center">
					<div class="options_sel" v-if="cartData.data.storeCartGroupList.length > 0">
						<img src="@/assets/cart/sel.png" alt="" class="store_sel" v-if="cartData.data.checkedAll"
							@click="changeSelectState('all', cartData.data.checkedAll)" />
						<img src="@/assets/cart/not_sel.png" alt="" class="store_sel"
							v-if="!cartData.data.checkedAll"
							@click="changeSelectState('all', cartData.data.checkedAll)" />
						<span>{{ L["全选"] }}</span>
					</div>
					<div class="del_all cursor_pointer" @click="delBatchGoods"
						v-if="cartData.data.storeCartGroupList.length > 0">
						{{ L["删除选中的商品"] }}
					</div>
					<!-- <div class="del_all_invalid cursor_pointer" @click="clearInvalidGoods"
						v-if="token&&cartData.data.invalidList.length > 0">
						{{ L["清空失效的商品"] }}
					</div> -->
				</div>
				<div class="options_right flex_row_start_center">
					<div class="options_sel_num">
						{{ L["已选商品"] }}<span>{{ cartData.data.totalCheck }}</span>{{ L["件"] }}
					</div>
					<div class="options_line"></div>
					<div class="options_sel_price flex_row_start_center">
						<div class="options_all_count flex_column_start_end">
							<span>{{ L["合计"] }}：</span>
							<span v-if="cartData.data.totalDiscount">{{ L["促销减"] }}：</span>
						</div>
						<div class="options_promotion flex_column_start_end">
							<span>￥{{ cartData.data.totalAmount }}</span>
							<span v-if="cartData.data.totalDiscount">￥{{ cartData.data.totalDiscount }}</span>
						</div>
					</div>
					<div class="go_buy cursor_pointer" :class="{ active: cartData.data.totalAmount > 0}"
						@click="goBuy">{{ L["去结算"] }}</div>
				</div>
			</div>
			<!-- 操作按钮 end -->
		</div>
		<div class="cart_content_no flex_column_center_center" v-show="
			!cartData.data ||
			JSON.stringify(cartData.data) == '{}' ||
			(cartData.data &&
			cartData.data.invalidList &&
			cartData.data.invalidList.length == 0 &&
			cartData.data.storeCartGroupList &&
			cartData.data.storeCartGroupList.length == 0)">
			<img src="@/assets/cart/no_data.png" alt="" />
			<p>{{ L["这里空空如也，快去首页逛逛吧~"] }}</p>
			<span @click="goIndex">{{ L["去首页 > >"] }}</span>
		</div>
		<!-- 清空失效商品 弹框 start -->
		<el-dialog title="提示" v-model="clearInvalidGoodsModel" width="20%" center top="30vh">
			<div style="margin:0 auto; text-align: center">{{ L["确定清空失效商品？"] }}</div>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="cancelClearInvalidModel">{{ L["取 消"] }}</el-button>
					<el-button type="primary" @click="confirmClearInvalidModel">{{ L["确 定"] }}</el-button>
				</span>
			</template>
		</el-dialog>
		<!-- 清空失效商品 弹框 end -->

		<!-- 删除所选商品 弹框 start -->
		<el-dialog title="提示" v-model="chosenGoodsModel" width="20%" center top="30vh">
			<div style="margin:0 auto; text-align: center">{{ L['确定删除选中商品？']}}</div>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="chosenGoodsModel = false">{{L["取 消"]}}</el-button>
					<el-button type="primary" @click="delCartGoods('batch')">{{L["确 定"]}}</el-button>
				</span>
			</template>
		</el-dialog>
		<!-- 删除所选商品 弹框 end -->

		<!-- 优惠券弹框 start -->
		<el-dialog v-model="couponModel" title="优惠券" width="832px">
			<div class="coupon_model">
				<div class="model_coupon_list">
					<CouponItem v-for="(couponItem, couponIndex) in couponList.data.list" :key="couponIndex"
						:coupon_item="couponItem" :class="sld_coupon_item"
						@refreshCouponList="openCouponModel(null,null,'get')">
					</CouponItem>
				</div>
				<div class="flex_row_end_center sld_pagination sld_page_bottom"
					v-if="couponList.data.pagination && couponList.data.pagination.total">
					<el-pagination @current-change="handleCurrentChangeCoupon" v-model:currentPage="curCouponPage"
						:page-size="couponPageSize" layout="prev, pager, next, jumper"
						:total="couponList.data.pagination.total" :hide-on-single-page="true">
					</el-pagination>
				</div>
			</div>
		</el-dialog>
		<!-- 优惠券弹框 end -->

		<!-- 推荐商品 start -->
		<recommend-list></recommend-list>
		<!-- 推荐商品 end -->

		<!-- 登录弹框 start -->
		<SldLoginModal :visibleFlag="loginModalVisibleFlag" @closeLoingModal="closeLoingModal" />
		<!-- 登录弹框 end -->

		<!-- 底部操作悬浮框 start -->
		<div class="bottom_options" v-if="optionsBtnShow">
			<div class="bottom_options_con flex_row_between_center">
				<div class="options_btn_left flex_row_start_center">
					<div class="options_sel">
						<img src="@/assets/cart/sel.png" alt="" class="store_sel" v-if="cartData.data.checkedAll"
							@click="changeSelectState('all', cartData.data.checkedAll)" />
						<img src="@/assets/cart/not_sel.png" alt="" class="store_sel"
							v-if="!cartData.data.checkedAll"
							@click="changeSelectState('all', cartData.data.checkedAll)" />
						<span>{{ L["全选"] }}</span>
					</div>
					<div class="del_all cursor_pointer" @click="delBatchGoods">
						{{ L["删除选中的商品"] }}
					</div>
					<!-- <div class="del_all_invalid cursor_pointer" @click="clearInvalidGoods"
						v-if="token&&cartData.data.invalidList.length > 0">
						{{ L["清空失效的商品"] }}
					</div> -->
				</div>
				<div class="options_right flex_row_start_center">
					<div class="options_sel_num">
						{{ L["已选商品"] }}<span>{{ cartData.data.totalCheck }}</span>{{ L["件"] }}
					</div>
					<div class="options_line"></div>
					<div class="options_sel_price flex_row_start_center">
						<div class="options_all_count flex_column_start_end">
							<span>{{ L["合计"] }}：</span>
							<span v-if="cartData.data.totalDiscount">{{ L["促销减"] }}：</span>
						</div>
						<div class="options_promotion flex_column_start_end">
							<span>￥{{ cartData.data.totalAmount }}</span>
							<span v-if="cartData.data.totalDiscount">￥{{ cartData.data.totalDiscount }}</span>
						</div>
					</div>
					<div class="go_buy cursor_pointer" :class="{ active: cartData.data.totalAmount > 0 }"
						@click="goBuy">{{ L["去结算"] }}</div>
				</div>
			</div>
		</div>
		<!-- 底部操作悬浮框 end -->
	</div>
</template>

<script>
	import { reactive, getCurrentInstance, ref, watchEffect, onMounted, watch } from "vue";
	import {
		ElMessage,
		ElDialog,
		ElButton,
		ElPopover,
		ElPopconfirm,
	} from "element-plus";
	import { useRouter } from "vue-router";
	import RecommendList from "../../components/RecommendList.vue";
	import CouponItem from "@/components/CouponItem";
	import { useStore } from "vuex";
	import SldLoginModal from "../../components/loginModal";
	export default {
		name: "CartIndex",
		components: {
			ElDialog,
			ElButton,
			ElPopover,
			ElPopconfirm,
			RecommendList,
			CouponItem,
			SldLoginModal,
		},
		setup() {
			const router = useRouter();
			const { proxy } = getCurrentInstance();
			const L = proxy.$getCurLanguage();
			const store = useStore();
			const token = ref(store.state.loginFlag); //登录缓存是否登录
			const loginModalVisibleFlag = ref(false); //登录弹框是否显示，默认不显示
			const cartData = reactive({ data: store.state.cartListData }); //购物车数据信息
			const clearInvalidGoodsModel = ref(false); //清空失效商品对话框是否显示
			const delGoodsCartIds = ref(""); //要删除的商品的购物车的id集
			const delType = ref("goods"); //要删除的商品类型：goods：单个商品删除 batch:批量删除
			const curPromotion = ref(-1); //当前选择的商品的活动的促销的id
			const curPromotionCartItem = reactive({ data: {} }); //当前选择的要换促销的商品
			const couponModel = ref(false); //优惠券弹框是否显示
			const couponList = reactive({ data: {} }); //当前店铺优惠券列表数据
			const cartListData = reactive({ data: store.state.cartListData }); //获取vux的store中的购物车数据
			const optionsBtnTop = ref(0); //底部操作按钮元素的top值
			const windowHeight = ref(0); //屏幕元素的高度
			const optionsBtnShow = ref(false); //底部操作按钮悬浮框是否显示
			const optionsBtn = ref(null); //获取底部操作按钮元素
			const curPromotionGoodsProductId = ref(''); //当前点击的促销活动的商品
			const curCouponPage = ref(1); //当前为第一页优惠券
			const couponPageSize = ref(6); //优惠券默认一页显示6条数据
			const curStoreId = ref(-1); //当前打开的优惠券弹框的店铺id
			const elementScrollTop = ref(0); //页面滚动高度
			const chosenGoodsModel = ref(false)
			onMounted(() => {
				window.addEventListener('scroll', scrollHandle); //绑定页面滚动事件
			});
			//页面监听token是否更新
			watchEffect(() => {
				token.value = store.state.loginFlag;
				cartData.data = store.state.cartListData;
				//实时获取屏幕的高度
				windowHeight.value = document.documentElement.clientHeight;

				if (optionsBtn.value != null && optionsBtn.value != undefined) {
					optionsBtnTop.value = optionsBtn.value.offsetTop;
					if (optionsBtnTop.value > windowHeight.value) {
						optionsBtnShow.value = true;
					} else {
						optionsBtnShow.value = false;
					}
					if (elementScrollTop.value + windowHeight.value > optionsBtnTop.value) {
						optionsBtnShow.value = false;
					} else {
						optionsBtnShow.value = true;
					}
				}
			});

			const scrollHandle = (e) => {
				elementScrollTop.value = e.srcElement.scrollingElement.scrollTop;
				// elementScrollTop.value = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
			};

			//已选择商品的件数,计算合计(未登录使用)
			const colculationOperation = () => {
				if (JSON.stringify(cartData.data) != "{}" && cartData.data != undefined) {
					cartData.data.totalCheck = 0;
					cartData.data.totalAmount = 0;
					cartData.data &&
						cartData.data.storeCartGroupList &&
						cartData.data.storeCartGroupList.map((storeItem) => {
							storeItem.promotionCartGroupList.map((promotItem) => {

								promotItem.cartList.map((cartItem) => {
									cartItem.subtotal = (Number(cartItem.buyNum) * cartItem.productPrice).toFixed(2);
									if (cartItem.isChecked == 1) {
										cartData.data.totalCheck++;
										cartData.data.totalAmount += Number(cartItem.subtotal);
									}
								});
							});
						});
				}
			};

			//更新本地缓存购物车数据
			const updateLocCartData = (cartData) => {
				//将购物车数据更新到vuex中的store中
				store.commit("updateCartListData", cartData);
			};

			//获取购物车数据
			const getCartData = () => {
				if (store.state.loginFlag) {
					//已登录
					let params = {};
					proxy
						.$get("v3/business/front/cart/cartList", params)
						.then((res) => {
							if (res.state == 200) {
								if (res.data.storeCartGroupList && res.data.storeCartGroupList.length) {
									res.data.storeCartGroupList.map(item => {
										item.showCoupon = false;
									})
								}
								cartData.data = proxy.$calculateSubtotal(res.data);
								acLabelMarkify()
							} else {
								ElMessage.error(res.msg);
							}
						})
						.then(() => {
							store.commit("updateCartListData", cartData.data); //将购物车数据存储到vuex的store中
						});
				} else {
					//未登录
					cartData.data = proxy.$calculateSubtotal(cartListData.data);
					colculationOperation();
				}
				updateLocCartData(cartData.data);
			};
			getCartData();

			/**编辑购物车商品数量
			 * type:编辑类型 reduce：减  edit：编辑 add：加
			 * curCartItem：编辑的当前项商品
			 * e:事件对象
			 */
			const editNum = (type, curCartItem, e) => {
				let curNumber = curCartItem.buyNum;
				switch (type) {
					case 'reduce': {
						if (curNumber > 1) {
							curCartItem.buyNum--;
							curNumber--
						} else {
							curCartItem.buyNum = 1;
							ElMessage(L["最低限购1件!"]);
						}
						break
					}

					case 'add': {
						if (curNumber >= curCartItem.productStock) {
							ElMessage(L["数量超出购买范围！"]);
							curCartItem.buyNum = curCartItem.productStock
							return
						} else {
							if (curNumber > 998) {
								ElMessage(L["超过购买限制!"]);
								curCartItem.buyNum = 999;
								return
							} else {
								curCartItem.buyNum++;
								curNumber++
							}
						}
						break;
					}

					case 'edit': {
						curNumber = e.currentTarget.value;
						if (curNumber == 0 && curNumber != '') {
							curCartItem.buyNum = 1;
							curNumber = 1
							return
						} else if (curNumber == '') {
							return
						} else {
							curNumber = curNumber.replace(/\D/g, "");
							if (curNumber > curCartItem.productStock && curCartItem.productStock < 999) {
								ElMessage(L["数量超出购买范围！"]);
								curCartItem.buyNum = curCartItem.productStock
								return;
							} else if (curNumber > 999) {
								ElMessage(L["超过购买限制!"]);
								curCartItem.buyNum = 999;
								return;
							}
						}
						break
					}

					case 'blur': {
						if (curNumber == '') {
							curCartItem.buyNum = 1
							return
						}
					}
				}
				curNumber = curCartItem.buyNum
				if (store.state.loginFlag) {
					//已登录
					let params = {
						cartId: curCartItem.cartId, //商品购物车id
						number: curNumber, //修改后商品数量
					};

					proxy.$post("v3/business/front/cart/changeNum", params).then((res) => {
						if (res.state == 200) {
							cartData.data = proxy.$calculateSubtotal(res.data);
							curCartItem.promotionModel = false
							closePromotionModel()
							acLabelMarkify()
							updateLocCartData(cartData.data);
						} else {
							ElMessage.error(res.msg);
						}
					});
				} else {
					//未登录
					cartData.data.storeCartGroupList &&
						cartData.data.storeCartGroupList.map((storeItem) => {
							storeItem.promotionCartGroupList.map((promotItem) => {

								promotItem.cartList.map((cartItem) => {
									cartItem.promotionModel = false
									if (curCartItem.productId == cartItem.productId) {
										cartItem.buyNum = curCartItem.buyNum;
									}
								});
							});
						});
					colculationOperation();
					updateLocCartData(cartData.data);
				}

			};

			//当前店铺及购物车的选中状态(未登录使用)
			const curStoreCartSelChecked = () => {
				let curSelStore = []; //当前店铺未选中
				cartData.data.storeCartGroupList.map((storeItem) => {
					storeItem.promotionCartGroupList.map((promotItem) => {
						curSelStore = promotItem.cartList.filter(
							(cartItem) => cartItem.isChecked == 0
						);
						if (curSelStore.length > 0) {
							storeItem.checkedAll = false;
						} else {
							storeItem.checkedAll = true;
						}
					});
				});
				let curCartData = []; //当前购物车是否全选或全不选
				curCartData = cartData.data.storeCartGroupList.filter(
					(storeItem) => !storeItem.checkedAll
				);
				if (curCartData.length > 0) {
					cartData.data.checkedAll = false;
				} else {
					cartData.data.checkedAll = true;
				}
			};

			/**选中状态的更改
			 * type ： goods:商品， store :店铺 all,全部（全选或者全不选）
			 * isCheckedState：商品：当前商品的选中状态 店铺:店铺的选中状态
			 * curCartStoreGoodsId：商品：当前商品购物车信息 店铺：storeId
			 */
			const changeSelectState = (type, isCheckedState, curCartStoreGoodsId) => {
				if (store.state.loginFlag) {
					//已登录
					let cartIds = ""; //商品的购物车id集
					if (type == "goods") {
						//选择商品
						cartIds = curCartStoreGoodsId.cartId;
					} else if (type == "store") {
						//选择店铺
						cartData.data.storeCartGroupList.map((storeItem) => {
							if (storeItem.storeId == curCartStoreGoodsId.storeId) {
								storeItem.promotionCartGroupList.map((promotItem) => {

									promotItem.cartList.map((cartItem) => {
										cartIds += cartItem.cartId + ",";
									});
								});
							}
						});
						cartIds = cartIds.substring(0, cartIds.length - 1);
					} else if (type == "all") {
						//全选或全不选
						cartData.data.storeCartGroupList.map((storeItem) => {
							storeItem.promotionCartGroupList.map((promotItem) => {

								promotItem.cartList.map((cartItem) => {
									cartIds += cartItem.cartId + ",";
								});
							});
						});
						cartIds = cartIds.substring(0, cartIds.length - 1);
					}
					let params = {
						cartIds: cartIds, //购物车id集合
						checked: isCheckedState ? 0 : 1, //是否选中：0=全不选、1=全选中
					};
					proxy
						.$post("v3/business/front/cart/checkedCarts", params)
						.then((res) => {
							if (res.state == 200) {
								cartData.data = proxy.$calculateSubtotal(res.data);
								acLabelMarkify()
								updateLocCartData(cartData.data);
								closePromotionModel();
							} else {
								ElMessage.error(res.msg);
							}
						});
				} else {
					//未登录
					if (type == "goods") {
						//单个商品
						cartData.data.storeCartGroupList.map((storeItem) => {
							storeItem.promotionCartGroupList.map((promotItem) => {

								promotItem.cartList.map((cartItem) => {
									if (cartItem.goodsId == curCartStoreGoodsId.goodsId) {
										cartItem.isChecked = !isCheckedState;
									}
								});
							});
						});
						curStoreCartSelChecked();

					} else if (type == "store") {
						//单个店铺
						cartData.data.storeCartGroupList.map((storeItem) => {
							if (storeItem.storeId == curCartStoreGoodsId.storeId) {
								storeItem.checkedAll = !isCheckedState;
							}
						});
						cartData.data.storeCartGroupList.map((storeItem) => {
							storeItem.promotionCartGroupList.map((promotItem) => {

								promotItem.cartList.map((cartItem) => {
									if (storeItem.storeId == curCartStoreGoodsId.storeId) {
										cartItem.isChecked = storeItem.checkedAll;
									}
								});
							});
						});
						curStoreCartSelChecked();
					} else if (type == "all") {
						cartData.data.storeCartGroupList.map((storeItem) => {
							storeItem.checkedAll = !isCheckedState;
							storeItem.promotionCartGroupList.map((promotItem) => {

								promotItem.cartList.map((cartItem) => {
									cartItem.isChecked = !isCheckedState;
								});
							});
						});
						cartData.data.checkedAll = !isCheckedState;
					}
					colculationOperation();
					updateLocCartData(cartData.data);
				}
			};

			//移入收藏夹 cartId: 商品购物车id集(当前商品购物车id)
			const moveCartGoods = (cartId) => {
				let params = {
					cartIds: cartId,
				};
				proxy
					.$post("v3/business/front/cart/moveToCollection", params)
					.then((res) => {
						if (res.state == 200) {
							cartData.data = res.data;
							cartData.data = proxy.$calculateSubtotal(cartData.data);
							acLabelMarkify()
							ElMessage.success(L["移入收藏夹成功！"]);
							store.commit('updateCartListData', cartData.data);
						} else {
							ElMessage.error(res.msg);
						}
					});
			};

			//删除商品 type:'goods'单个商品 curCartItem: 当前商品信息    batch:批量
			const delCartGoods = (type, curCartItem) => {
				if (store.state.loginFlag) {
					//已登录
					if (type == "goods") {
						delGoodsCartIds.value = curCartItem.cartId;
						curCartItem.promotionModel = false
					} else if (type == "batch") {
						cartData.data.storeCartGroupList.map((storeItem) => {
							storeItem.promotionCartGroupList.map((promotItem) => {

								promotItem.cartList.map((cartItem) => {
									if (cartItem.isChecked == 1) {
										delGoodsCartIds.value += cartItem.cartId + ",";
									}
								});
							});
						});
						delGoodsCartIds.value = delGoodsCartIds.value.substring(0, delGoodsCartIds.value.length - 1);
					}
				} else {
					//未登录
					if (type == "goods") {
						delType.value = "goods";
						delGoodsCartIds.value = curCartItem.goodsId;
					} else if (type == "batch") {
						delType.value = "batch";
					}
				}
				chosenGoodsModel.value = false
				confirmDelGoodsModel();
			};

			//确定删除商品
			const confirmDelGoodsModel = () => {
				if (store.state.loginFlag) {
					// 已登录
					let params = {
						cartIds: delGoodsCartIds.value,
					};
					proxy
						.$post("v3/business/front/cart/deleteCarts", params)
						.then((res) => {
							if (res.state == 200) {
								cartData.data = res.data;
								ElMessage.success(L["删除成功！"]);
								// proxy.$getLoginCartListData();
								closePromotionModel()
								acLabelMarkify()
								updateLocCartData(cartData.data);

							} else {
								ElMessage.error(res.msg);
							}
						});
				} else {
					// 未登录
					if (delType.value == "goods") {
						//单个商品删除
						cartData.data.storeCartGroupList.map((storeItem, storeIndex) => {
							storeItem.promotionCartGroupList.map((promotItem) => {

								promotItem.cartList.map((cartItem, cartIndex) => {
									if (cartItem.goodsId == delGoodsCartIds.value) {
										promotItem.cartList.splice(cartIndex, 1);
									}
								});
								if (promotItem.cartList.length == 0) {
									storeItem.promotionCartGroupList = [];
								}
								if (storeItem.promotionCartGroupList.length == 0) {
									cartData.data.storeCartGroupList.splice(storeIndex, 1);
								}
							});
						});
					} else if (delType.value == "batch") {
						//批量删除
						let curSelGoods = []; //选中的商品
						cartData.data.storeCartGroupList.map((storeItem) => {
							storeItem.promotionCartGroupList.map((promotItem) => {

								curSelGoods = promotItem.cartList.filter(
									(cartItem) => cartItem.isChecked == 1
								);
							});
						});
						cartData.data.storeCartGroupList.map((storeItem, storeIndex) => {
							storeItem.promotionCartGroupList.map((promotItem) => {

								promotItem.cartList.map((cartItem, cartIndex) => {
									curSelGoods.map((curSelGoodsItem) => {
										if (cartItem.goodsId == curSelGoodsItem.goodsId) {
											promotItem.cartList.splice(cartIndex, 1);
										}
									});
								});
								if (promotItem.cartList.length == 0) {
									storeItem.promotionCartGroupList = [];
								}
								if (storeItem.promotionCartGroupList.length == 0) {
									cartData.data.storeCartGroupList.splice(storeIndex, 1);
								}
							});
						});
						curStoreCartSelChecked();
					}
					ElMessage.success(L["删除成功！"]);
					updateLocCartData(cartData.data);

				}

			};

			//打开清空失效商品弹框
			const clearInvalidGoods = () => {
				clearInvalidGoodsModel.value = true;
			};
			//确定清空失效商品
			const confirmClearInvalidModel = () => {
				let params = {};
				proxy.$post("v3/business/front/cart/emptyInvalid", params).then((res) => {
					if (res.state == 200) {
						cartData.data.invalidList = [];
						ElMessage.success(L["清空失效商品成功！"]);
					} else {
						ElMessage.error(res.msg);
					}
				});
				clearInvalidGoodsModel.value = false;
			};
			//取消清空失效商品
			const cancelClearInvalidModel = () => {
				clearInvalidGoodsModel.value = false;
			};

			//去商品详情页
			const goGoodsDetail = (productId) => {
				proxy.$goGoodsDetail(productId);
			};

			//去结算
			const goBuy = () => {
				if (store.state.loginFlag) {
					if (cartData.data.totalCheck > 0) {
						router.push({ path: "/buy/confirm", query: { ifcart: true } });
					} else {
						ElMessage(L["结算商品不能为空！"]);
					}
				} else {
					//未登录提示登录
					loginModalVisibleFlag.value = true;
				}
			};
			//关闭登录弹框
			const closeLoingModal = () => {
				loginModalVisibleFlag.value = false;
			};

			//修改选择促销活动 e:v-model的值，cartItem,当前项商品
			const changePromotion = (e, curCartItem) => {
				curPromotion.value = e;
				curPromotionCartItem.data = curCartItem;
			};

			//点击促销，显示促销选择弹框
			const promotionShow = (cartItem) => {
				curPromotionGoodsProductId.value = cartItem.productId;

				// curPromotion.value = cartItem.goodsPromotionId;

				let findProIm = cartItem.promotionList.findIndex(proIm => proIm.promotionId == cartItem.promotionId && proIm.promotionType == cartItem.promotionType);
				if (findProIm > -1) {
					curPromotion.value = cartItem.promotionList[findProIm].goodsPromotionId
				} else {
					curPromotion.value = ''
				}

				cartData.data && cartData.data.storeCartGroupList && cartData.data.storeCartGroupList.map((storeItem) => {
					storeItem.promotionCartGroupList.map((promotItem) => {
						promotItem.cartList.map(cartItem => {
							cartItem.promotionModel = false;
						})
						let curPromoGoods = [];
						curPromoGoods = promotItem.cartList.filter((cartItem) => cartItem.productId == curPromotionGoodsProductId.value);
						if (curPromoGoods && curPromoGoods.length > 0) {
							curPromoGoods[0].promotionModel = true;
						}
					})
				});
			};

			//确定选择促销活动
			const selPromotion = () => {
				if (JSON.stringify(curPromotionCartItem.data) != "{}") {
					let curPromotionItem = [];
					curPromotionItem = curPromotionCartItem.data.promotionList.filter(
						(promotionItem) => promotionItem.goodsPromotionId == curPromotion.value
					);
					if (curPromotionItem.length > 0) {
						let params = {
							cartId: curPromotionCartItem.data.cartId,
							promotionDescription: curPromotionItem[0].promotionDes.replace(/<font color='red'>|<\/font>/g, ''),
							promotionId: curPromotionItem[0].promotionId,
							promotionType: curPromotionItem[0].promotionType,
						};
						proxy
							.$post("v3/business/front/cart/changePromotion", params)
							.then((res) => {
								if (res.state == 200) {
									cartData.data = res.data;
									cartData.data = proxy.$calculateSubtotal(cartData.data);
									acLabelMarkify()
									closePromotionModel();
								} else {
									ElMessage.error(res.msg);
								}
							});
					}
				} else {
					closePromotionModel();
				}
			};

			//关闭促销弹框
			const closePromotionModel = () => {
				cartData.data && cartData.data.storeCartGroupList && cartData.data.storeCartGroupList.map((storeItem) => {
					storeItem.promotionCartGroupList.map((promotItem) => {

						promotItem.cartList.map(cartItem => {
							cartItem.promotionModel = false;
						})
					})
				})
				updateLocCartData(cartData.data);
			};

			//取消选择促销活动
			const cancelPromotion = () => {
				closePromotionModel();
			};

			//去首页
			const goIndex = () => {
				router.push({ path: "/index" });
			};

			//打开优惠券弹框
			const openCouponModel = (storeId, index, type) => {

				switch (type) {
					case 'open': {
						curStoreId.value = storeId ? storeId : curStoreId.value;

						if (cartData.data.storeCartGroupList[index].showCoupon) {
							cartData.data.storeCartGroupList[index].showCoupon = false;
							curStoreId.value = -1
						} else {
							//获取优惠券
							let params = {
								storeId: curStoreId.value,
								current: curCouponPage.value,
								pageSize: couponPageSize.value
							};
							proxy.$get("v3/promotion/front/coupon/storeCouponList", params).then((res) => {
								if (res.state == 200) {
									couponList.data = res.data;
								}
							});
							cartData.data.storeCartGroupList[index].showCoupon = true;
						}
						break
					}

					case 'get': {
						//获取优惠券
						let params = {
							storeId: curStoreId.value,
							current: curCouponPage.value,
							pageSize: couponPageSize.value
						};
						proxy.$get("v3/promotion/front/coupon/storeCouponList", params).then((res) => {
							if (res.state == 200) {
								couponList.data = res.data;
							}
						});
					}
				}




			};
			//关闭优惠券弹窗
			const closeCouponModel = (index) => {
				cartData.data.storeCartGroupList[index].showCoupon = false;
			};
			//上一页优惠券
			const handlePrevCilickChangeCoupon = () => {
				curCouponPage.value--;
				openCouponModel(null, null, 'get');
			};
			//下一页优惠券
			const handleNextCilickChangeCoupon = () => {
				curCouponPage.value++;
				openCouponModel(null, null, 'get');

			};
			//当前页数优惠券
			const handleCurrentChangeCoupon = () => {
				openCouponModel(null, null, 'get');

			};

			const delBatchGoods = () => {
				let antiNum = 0
				cartData.data.storeCartGroupList.map((storeItem) => {
					storeItem.promotionCartGroupList.map((promotItem) => {
						if (promotItem.cartList.filter((cartItem) => cartItem.isChecked == 1).length > 0) {
							antiNum++
						}
					});
				});

				if (antiNum == 0) {
					ElMessage.warning('请选择要删除的商品')
				} else {
					chosenGoodsModel.value = true
				}
			};

			const acLabelMarkify = () => {
				cartData.data.storeCartGroupList.map((storeItem) => {
					storeItem.promotionCartGroupList.map((promotItem) => {
						if (promotItem.promotionDes) {
							promotItem.promotionDes = promotItem.promotionDes.replace(/<(.+?)>/g, function (num) { return "<font color='red'>" + num.slice(1, num.length - 1) + "</font>" })
							promotItem.promotionDes = promotItem.promotionDes.replace(/x[\d]/g, function (num) { return "<font color='red'>" + num + "</font>" })
						}

						promotItem.cartList.map((cartItem) => {
							cartItem.promotionList.map(listItem => {
								listItem.promotionDes = listItem.promotionDes.replace(/<(.+?)>/g, function (num) { return "<font color='red'>" + num.slice(1, num.length - 1) + "</font>" })
								listItem.promotionDes = listItem.promotionDes.replace(/x[\d]/g, function (num) { return "<font color='red'>" + num + "</font>" })
							})
						});
					});
				});
			};

			const kefu = (cartGroupItem) => {
				if (store.state.loginFlag) {
					let chatInfo = {
						storeId: cartGroupItem.storeId,
						vendorAvatar: cartGroupItem.storeLogo,
						storeName: cartGroupItem.storeName,
						source: '从购物车页进入',
						sourceType: 'cart',
						showData: {}
					}
					store.commit('saveChatBaseInfo', chatInfo)

					let newWin = router.resolve({
						path: '/service',
						query: {
							vid: cartGroupItem.storeId
						}
					})

					window.open(newWin.href, "_blank")
				} else {
					//未登录提示登录
					loginModalVisibleFlag.value = true;
				}
			};

			//暴露的变量及方法
			return {
				L,
				token,
				cartData,
				editNum,
				clearInvalidGoods,
				clearInvalidGoodsModel,
				confirmClearInvalidModel,
				cancelClearInvalidModel,
				changeSelectState,
				confirmDelGoodsModel,
				moveCartGoods,
				delCartGoods,
				delGoodsCartIds,
				goGoodsDetail,
				goBuy,
				changePromotion,
				curPromotion,
				selPromotion,
				curPromotionCartItem,
				cancelPromotion,
				goIndex,
				couponModel,
				openCouponModel,
				closeCouponModel,
				couponList,
				cartListData,
				loginModalVisibleFlag,
				closeLoingModal,
				optionsBtn,
				optionsBtnTop,
				windowHeight,
				optionsBtnShow,
				promotionShow,
				curPromotionGoodsProductId,
				curCouponPage,
				couponPageSize,
				handlePrevCilickChangeCoupon,
				handleNextCilickChangeCoupon,
				handleCurrentChangeCoupon,
				curStoreId,
				elementScrollTop,
				delBatchGoods,
				chosenGoodsModel,
				kefu,
			};
		},
	};
</script>

<style lang="scss">
	@import "../../style/base.scss";
	@import "../../style/iconfont.css";
	@import "../../style/cartIndex.scss";

	.option_promotion {
		.el-radio {
			margin-bottom: 15px;
			white-space: unset;
			vertical-align: top;
			margin-right: 20px;
		}

		.el-radio__label {
			width: 240px;
			/* overflow: hidden;
    			   text-overflow: ellipsis;
                  white-space: nowrap; */
			display: inline-block;
			word-break: break-all;
			vertical-align: top;
		}

		.el-radio__input.is-checked .el-radio__inner {
			border-color: $colorMain2;
			background: $colorMain2;
		}

		.el-radio__input.is-checked+.el-radio__label {
			color: $colorMain2;
		}

		.promotion_btn {
			span {
				width: 40px;
				height: 20px;
				background: $colorMain;
				border-radius: 3px;
				font-size: 12px;
				font-family: Microsoft YaHei;
				font-weight: 400;
				color: #ffffff;
				display: inline-block;
				text-align: center;
				line-height: 20px;
				font-weight: 600;
				cursor: pointer;

				&:nth-child(2) {
					margin-left: 40px;
					background: #ffffff;
					color: $colorMain;
				}
			}
		}

		.el-overlay {
			background-color: rgba(0, 0, 0, 0.3);
		}
	}
</style>