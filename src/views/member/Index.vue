<template>
  <div class='sld_collect_index wd'>
    <!-- 会员基本信息 -->
    <div class="user_info_top">
      <div class="user_info_l fl">
        <div class="user_avatar sld_img_center">
          <img :src="memberInfo.info.memberAvatar" class="head_img">
        </div>
        <div class="user_avatar_r">
          <b>{{memberInfo.info.memberNickName}} ({{memberInfo.info.memberName}})</b>
        </div>
        <router-link :to="'/member/address/list'" class="user_addr" target="_blank"><span class="fl"><i
              class="iconfont">&#xe70f;</i>{{L['会员收货地址']}}</span>
          <i class="fr iconfont">&#xe616;</i>
        </router-link>
        <div class="user_member" v-if="memberInfo.info.isSuper==0">
           <p>开通超级会员，立享多重好礼</p>
           <button>立即开通</button>
        </div>
        <div class="user_member_one" v-if="memberInfo.info.isSuper==1">
           <img src="../../assets/member/member_id.png" alt="">
           <div class="user_member_box">
            <p class="user_member_tit">超级会员</p>
            <p class="user_member_time">{{memberInfo.info.superExpirationTime}}</p>
           </div>
           <button>查看权益</button>
        </div>
        <div  class="user_member_two" v-if="memberInfo.info.isSuper==2">
           <img src="../../assets/member/member_exp.png" alt="">
           <p>超级会员已到期</p>
           <button>立即续费</button>
        </div>
      </div>
      <div class="infoCon clearfix">
        <div class="info_rcol">
          <h4 class="user_title">
            <!-- <i class="iconfont">&#xe608;</i> -->
            <img src="../../assets/member/property.png" alt="" class="title_img">
            {{L["我的财产"]}}
          </h4>
          <ul class="acco_info fl">
            <li class="acco_item">
              <div>
                <router-link id="balance" class="sld_link_red" :to="'/member/recharge'" target="_blank"><span
                    id="balanceTitle">{{memberInfo.info.memberBalance}}</span></router-link>
                <p>{{L['余额']}}</p>
                <router-link class="sld_link" :to="'/member/recharge'" target="_blank">{{L['充值']}}</router-link>
              </div>
            </li>
            <li class="acco_item">
              <div>
                <router-link class="sld_link_red" :to="'/coupon'" target="_blank">{{memberInfo.info.couponNum}}
                </router-link>
                <p>{{L['优惠券']}}</p>
                <router-link class="sld_link" :to="'/coupon'" target="_blank">{{L['领券']}}</router-link>
              </div>
            </li>
            <li class="acco_item">
              <div>
                <router-link class="sld_link_red" :to="'/member/myPoint'" target="_blank">
                  {{memberInfo.info.memberIntegral}}</router-link>
                <p>{{L['积分']}}</p>
                <router-link class="sld_link" :to="'/member/myPoint'" target="_blank">{{L['查看']}}</router-link>
              </div>
            </li>
            <li class="acco_item">
              <div>
                <router-link class="sld_link_red" :to="'/member/collect?type=store'" target="_blank">
                  {{memberInfo.info.followStoreNum}}</router-link>
                <p>{{L['店铺关注']}}</p>
                <router-link class="sld_link" :to="'/member/collect?type=store'" target="_blank">{{L['查看']}}
                </router-link>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 会员订单信息 -->
    <div class="user_order clearfix">
      <div class="my_order fl">
        <h4 class="user_title"><i class="iconfont">&#xe619;</i>{{L['我的订单']}}</h4>
        <ul class="clearfix order_state_nav">
          <li>
            <router-link :to="'/member/order/list?orderState=10'" target="_blank">
              <i class="iconfont">&#xe677;</i>
              <p>{{L['待支付']}}</p>
              <div class="tag" v-if="memberInfo.info.toPaidOrder>0">{{memberInfo.info.toPaidOrder}}</div>
            </router-link>

          </li>
          <li>
            <router-link :to="'/member/order/list?orderState=30'" target="_blank">
              <i class="iconfont">&#xe676;</i>
              <p>{{L['待收货']}}</p>
              <div class="tag" v-if="memberInfo.info.toReceivedOrder>0">{{memberInfo.info.toReceivedOrder}}</div>

            </router-link>
          </li>
          <li>
            <router-link :to="'/member/order/list?orderState=40&evaluateState=1'" target="_blank">
              <i class="iconfont">&#xe678;</i>
              <p>{{L['待评价']}}</p>
              <div class="tag" v-if="memberInfo.info.toEvaluateOrder>0">{{memberInfo.info.toEvaluateOrder}}</div>
            </router-link>
          </li>
          <li>
            <router-link :to="'/member/order/aftersales'" target="_blank">

              <i class="iconfont">&#xe67c;</i>
              <p>{{L['售后/退货']}}</p>
              <div class="tag" v-if="memberInfo.info.afterSaleNum>0">{{memberInfo.info.afterSaleNum}}</div>
            </router-link>
          </li>
          <li>
            <router-link :to="'/member/order/list'" target="_blank">
              <span>
                <i class="iconfont">&#xe634;</i>
              </span>
              <p>{{L['全部订单']}}</p>
            </router-link>
          </li>
        </ul>
        <div v-if="order.list.length>0">
          <div class="user-order-item clearfix"
            v-for="({createTime,totalMoney,productList,orderSn,orderStateValue},index) in order.list" :key="index">
            <div class="fl">
              <router-link class="fl img" :to="`/goods/detail?productId=${productList[0].productId}`" target="_blank">
                <!-- <img :src="productList[0].productImage" alt=""> -->
                <coverImage :src="productList[0].productImage" class="img"></coverImage>
              </router-link>
              <a class="fl">
                <p>{{productList[0].goodsName}}</p>
                <p class="price">￥{{totalMoney}}</p>
                <p class="time">下单时间:{{createTime}}</p>
              </a>
            </div>
            <div class="fr">
              <p class="orderSn">订单号:{{orderSn}}</p>
              <p class="orderState">{{orderStateValue}}</p>
              <a @click="seeOrderDetail(orderSn)" style="cursor: pointer">{{L['查看详情']}}</a>
            </div>
          </div>
        </div>
        <div class="user_order_empty flex_row_center_center" v-else>
          <img src="@/assets/member/member_empty.png" alt="">
          <p>{{L['这里空空如也，快去挑选合适的商品吧~']}}</p>
        </div>
      </div>
      <div class="my_follow fr">

        <!-- 购物车item -->
        <div class="my_follow_item cartItem">
          <h4 class="user_title"><i class="iconfont icon-gouwuche"></i>{{L['购物车']}} ({{cartLen}})<router-link
              :to="'/cart/index'" target="_blank">{{L['查看更多']}}></router-link>
          </h4>
          <ul class="clearfix">
            <template v-for="(storeItem,storeIndex) in cartData.data.storeCartGroupList" :key="storeIndex">
              <template v-for="(promotItem,promotIndex) in storeItem.promotionCartGroupList" :key="promotIndex">
                <li class="list_item" v-for="(cartItem,cartIndex) in promotItem.cartList" :key="cartIndex">
                  <a @click="toProductDetail(cartItem.productId)">
                    <img :src="cartItem.productImage" alt="">
                  </a>
                </li>
              </template>
            </template>
            <div class="no_footprint" v-show="!cartLen">暂无商品~</div>
          </ul>
        </div>

        <!-- 关注店铺item -->
        <div class="my_follow_item store">
          <h4 class="user_title"><i class="iconfont">&#xe679;</i>{{L['店铺关注']}} ({{memberInfo.info.followStoreNum}})
            <router-link :to="'/member/collect?type=store'" target="_blank">{{L['查看更多']}}></router-link>
          </h4>
          <ul class="clearfix">
            <li class="list_item" v-for="({storeLogo,storeId},index) in collectStore.store" :key="index">
              <router-link :to="`/store/index?vid=${storeId}`" target="_blank">
                <img :src="storeLogo" alt="">
              </router-link>
            </li>
            <div class="no_footprint" v-show="!collectStore.store.length">暂无关注店铺~</div>
          </ul>
        </div>

        <!-- 收藏商品item -->
        <div class="my_follow_item goods">
          <h4 class="user_title"><i class="iconfont">&#xe67d;</i>{{L['我的收藏']}} ({{memberInfo.info.followProductNum}})
            <router-link :to="'/member/collect'" target="_blank">{{L['查看更多']}}></router-link>
          </h4>
          <ul class="clearfix">
            <li class="list_item" v-for="({productImage,productId},index) in collectGoods.goods" :key="index">
              <a @click="toProductDetail(productId)">
                <img :src="productImage" alt="">
              </a>
            </li>
            <div class="no_footprint" v-show="!collectGoods.goods.length">暂无收藏商品~</div>
          </ul>
        </div>

        <!-- 足迹item -->
        <div class="my_follow_item footprint">
          <h4 class="user_title"><i class="iconfont">&#xe67f;</i>{{L['我的足迹']}} ({{memberInfo.info.lookLogNum}})
            <router-link :to="'/member/footprint'" target="_blank">{{L['查看更多']}}></router-link>
          </h4>
          <ul class="clearfix">
            <li class="list_item" v-for="({goodsImage,productId},index) in looklog.log" :key="index">
              <a @click="toProductDetail(productId)">
                <img :src="goodsImage" alt="">
              </a>
            </li>
            <div class="no_footprint" v-show="!looklog.log.length">暂无足迹~</div>
          </ul>
        </div>


      </div>
    </div>
    <!-- 热销推荐 -->
    <div class="user_hot_goods clearfix">
      <h3>{{L['热销推荐']}}</h3>
      <ul class="clearfix">
        <li v-for="({goodsImage,goodsName,goodsPrice,defaultProductId},index) in hotRecom.goods" :key="index">
          <a @click="toProductDetail(defaultProductId)">
            <div class="img">
              <img class="lazy" :src="goodsImage" alt="">
            </div>
            <p class="hot_goods_name">{{goodsName}}</p>
            <p class="hot_goods_price">￥<em>{{goodsPrice}}</em></p>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import { reactive, onMounted, getCurrentInstance, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useStore } from "vuex";
  export default {
    name: 'index',
    setup() {
      const router = useRouter()
      const store = useStore();
      const memberInfo = reactive({ info: {} })
      const looklog = reactive({ log: [] })
      const looklogLen = ref(0)
      const cartData = reactive({ data: [] })
      const cartLen = ref(0)
      const collectStore = reactive({ store: [] })
      const collectGoods = reactive({ goods: [] })
      const hotRecom = reactive({ goods: [] })
      const order = reactive({ list: [] })
      const { proxy } = getCurrentInstance()
      const L = proxy.$getCurLanguage()

      const getInitInfo = () => {  //获取会员信息数据
        proxy.$get('v3/member/front/member/getInfo').then(res => {
          if (res.state == 200) {
            memberInfo.info = res.data
            store.commit("updateMemberInfo", memberInfo.info); //将购物车数据存储到vuex的store中
          }
        })
      }

      const getLookLog = () => {  //获取我的足迹数据
        proxy.$get('v3/member/front/productLookLog/list').then(res => {
          if (res.state == 200) {
            looklog.log = res.data.list[0] ? res.data.list[0].productLookLogInfoList.slice(0, 4) : []
            looklogLen.value = res.data.list[0] ? res.data.list[0].productLookLogInfoList.length : 0
          }

        })
      }

      const getCartItem = () => {
        proxy.$get('v3/business/front/cart/cartList').then(res => {
          if (res.state == 200) {
            cartData.data = res.data ? res.data : []
            cartLen.value = res.data.availableCartNum ? res.data.availableCartNum : 0
          }
        })
      }

      const getCollectStore = () => {
        proxy.$get('v3/member/front/followStore/list').then(res => {
          if (res.state == 200) {
            collectStore.store = res.data.storeList
          }
        })
      }

      const getCollectGoods = () => {
        proxy.$get('v3/member/front/followProduct/list').then(res => {
          if (res.state == 200) {
            collectGoods.goods = res.data.list
          }
        })
      }

      const getHotReco = () => { //获取热门推荐数据
        let params = {
          queryType: 'cart'
        }
        proxy.$get('v3/goods/front/goods/recommendList', params).then(res => {
          if (res.state == 200) {
            hotRecom.goods = res.data.list
            hotRecom.goods.map(item => item.goodsPrice = new Number(item.goodsPrice).toFixed(2))
          }
        })
      }

      const getOrder = () => {//获取订单
        let params = {
          current: 1
        }
        proxy.$get('v3/business/front/orderInfo/list', params).then(res => {
          if (res.state == 200) {
            order.list = res.data.list;
            order.list.forEach(item=>{
              item.totalMoney = new Number(item.totalMoney).toFixed(2)
              item.productList = [];
              item.orderProductListVOList.forEach(items => {
                if (items.isGift != 1) {
                  item.productList.push(items);
                }
              })
            })
          }
        })
      }

      const seeOrderDetail = (orderSn) => { //去往订单详情
        let newWin = router.resolve({
          path: 'order/detail',
          query: {
            orderSn: orderSn
          }
        })
        window.open(newWin.href, '_blank');
      }

      const toProductDetail = (productId) => {
        let newWin = router.resolve({
          path: '/goods/detail',
          query: {
            productId: productId
          }
        })
        window.open(newWin.href, '_blank');
      }

      onMounted(() => {
        getInitInfo()
        getLookLog()
        getHotReco()
        getOrder()
        getCartItem()
        getCollectStore()
        getCollectGoods()
      })

      return {
        memberInfo, L, looklog, hotRecom, getOrder, order, seeOrderDetail, toProductDetail, looklogLen, cartData, cartLen, collectStore, collectGoods
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '@/style/member/index.scss';
  @import '@/style/base.scss';

  .user_order_empty {
    padding: 90px;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;

    p {
      margin-left: 12px;
      color: #666666;
    }
  }

  .no_footprint {
    height: 73px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #666666;
  }
</style>