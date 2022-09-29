// 商品详情页面
<template>
  <StoreHeaderCat ref="headercat" @updateFllow="updateFllow" />
  <div class="sld_goods_detail">
    <!-- 内容区顶部固定 start -->
    <div class="contain_con" v-if="containCon">
      <div class="contain_content flex_row_center_center">
        <div class="contain_con_left flex_row_start_center">
          <span class="store_type" v-if="goodsDetail.data.storeInf.isOwnStore == 1">{{ L["自营"] }}</span>
          <span class="store_title">{{
            goodsDetail.data.storeInf.storeName
            }}</span>
          <img src="@/assets/goods/link_server.png" @click="kefu" />
        </div>
        <div class="contain_con_right">
          <div class="goods_description_title flex_row_between_center">
            <div class="description_title_left flex_row_start_center">
              <span class="cursor_pointer" :class="{ description_active: goodsDesctionType == 'detail' }"
                @click="goodsDescType('detail')">{{ L["商品详情"] }}</span>
              <span class="cursor_pointer" :class="{ description_active: goodsDesctionType == 'evaluate' }"
                @click="goodsDescType('evaluate')">{{ L["评价"] }}({{
                goodsCommentsInfo.data &&
                goodsCommentsInfo.data.commentsCount > 0
                ? goodsCommentsInfo.data.commentsCount
                : "0"
                }})</span>
              <span class="cursor_pointer" :class="{ description_active: goodsDesctionType == 'service' }"
                @click="goodsDescType('service')">{{ L["商品服务"] }}</span>
              <span class="cursor_pointer" :class="{
                  description_active: goodsDesctionType == 'salestore',
                }" @click="goodsDescType('salestore')">{{ L["店铺热销"] }}</span>
            </div>
            <div class="description_title_right flex_row_end_center">
              <div class="mobile_order flex_row_start_center cursor_pointer">
                <span>{{ L["手机下单"] }}</span>
                <div class="goods_code" id="qrcode"></div>
                <div class="mobile_order_model">
                  <div class="model_goods_code" id="qrcodeBig1">
                    <!-- <img src="@/assets/goods/code.png" alt="" /> -->
                  </div>
                  <p>{{ L["手机下单"] }}</p>
                </div>
              </div>
              <div class="line"
                v-if="goodsDetail.data.isVirtualGoods==1&&!goodsDetail.data.defaultProduct.promotionType"></div>
              <div class="go_add_cart cursor_pointer" @click="addCart"
                v-if="goodsDetail.data.isVirtualGoods==1&&!goodsDetail.data.defaultProduct.promotionType">
                {{ L["加入购物车"] }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 内容区顶部固定 end -->
    <div class="goods_detail_content" v-if="goodsDetail.data">
      <!-- 商品所属分类 ，联系客服，关注店铺 start-->
      <div class="goods_about_con">
        <div class="goods_about flex_row_between_center">
          <div class="goods_classify">
            <span v-for="(item,index) in goodsDetail.data.categoryPath" :key="index">
              <router-link
                :to="`/goods/list?categoryId=${goodsDetail.data.categoryIdPath[index]}&g=${index+1}${index>0?'&pid='+goodsDetail.data.categoryIdPath[index-1]:'&pid=0'}`">
                {{ item }}</router-link>
              <i> > </i>
            </span>
            <span style="color: #333333;">{{ goodsDetail.data.goodsName }}</span>
          </div>
          <div class="goods_about_right flex_row_between_center">
            <router-link target="_blank" :to="`/store/index?vid=${goodsDetail.data.storeInf.storeId}`"
              class="goods_about_store flex_row_between_center" v-if="goodsDetail.data.storeInf">
              <span>{{ goodsDetail.data.storeInf.storeName }}</span>
              <span v-if="goodsDetail.data.storeInf && goodsDetail.data.storeInf.isOwnStore == '1'">{{ L["自营"] }}</span>
            </router-link>
            <div class="contact_service flex_row_between_center" @click="kefu">
              <span>{{ L["联系客服"] }}</span>
              <img src="@/assets/goods/server.png" @click="kefu" :title="L['联系客服']" />
            </div>
            <div class="contact_service focus_store" @click="focusStore" v-if="goodsDetail.data.storeInf">
              <img src="@/assets/goods/collection.png" alt=""
                v-show="goodsDetail.data.storeInf.isFollowStore == true" />
              <img src="@/assets/goods/no_collection.png" alt=""
                v-show="goodsDetail.data.storeInf.isFollowStore == false" />
              <span>
                {{
                goodsDetail.data.storeInf.isFollowStore
                ? L["已关注"]
                : L["关注店铺"]
                }}
              </span>

            </div>
          </div>
        </div>
      </div>
      <!-- 商品所属分类 ，联系客服，关注店铺 end-->
      <!-- 商品主要信息 start -->
      <div class="main_con">
        <!-- 商品相关 start -->
        <div class="goods_des">
          <!-- 商品图片列表 start -->
          <div class="goods_des_left">
            <!-- 商品放大镜效果 start-->
            <div class="goods_main_picture">
              <div class="preview-box" @mousemove="move($event)" @mouseleave="out($event)" @mouseenter="enter($event)"
                ref="previewBox">
                <div class="imageBorder" :class="{
                    default_image: true,
                    skeleton_default_image: firstLoading,
                  }" :style="{ backgroundImage: 'url(' + defaultImage + ')' }">

                  <video v-if="currentDefaultImage == -1&&goodsDetail.data.goodsVideo" controls
                    playsinline="playsinline" class="imageBorder default_image" :poster="defaultImage" autoplay
                    ref="video">
                    <source :src="goodsDetail.data.goodsVideo" type="video/mp4" />
                  </video>
                </div>
                <div class="v_btn" v-if="currentDefaultImage != -1&&goodsDetail.data.goodsVideo">
                  <img src="@/assets/goods/playV.png" alt="" @click="playV">
                </div>
                <!-- 遮罩 start-->
                <div class="mask" ref="maskBox" v-show="maskShow"></div>
                <!-- 遮罩 end -->
                <!-- 底部放大镜icon图标 start -->
                <div class="magnifier_icon flex_row_center_center" v-show="!maskShow">
                  <i class="iconfont icon-sousuo"></i>
                </div>
                <!-- 底部放大镜icon图标 end -->
              </div>
              <!-- 右侧的放大后的图片 start -->
              <div class="goods_picture_big" style="border:1px solid #eee" ref="zoomBox" v-show="maskShow">
                <div class="default_image_big" :style="{ backgroundImage: 'url(' + defaultImage + ')' }"
                  ref="pictureBig"></div>
              </div>
              <!-- 右侧的放大后的图片 end -->
            </div>
            <!-- 商品放大镜效果 end -->

            <!-- 商品图片列表 start -->
            <div :class="{
                goods_picture_con: true,
                flex_row_between_center: true,
                skeleton_goods_picture_con: firstLoading,
              }" v-if="
                goodsDetail.data.defaultProduct &&
                goodsDetail.data.defaultProduct.goodsPics &&
                goodsDetail.data.defaultProduct.goodsPics.length > 0
              ">
              <i class="iconfont icon-ziyuan2 left_arrow" :class="{ no_left_arrow: currentDefaultImage == 0 }"
                @click="switchDefaultImage('left')"></i>
              <div class="show_box">
                <ul class="goods_picture_list flex_row_start_center" ref="goodsPictureList">
                  <li v-for="(goodsImgItem, goodsImgIndex) in goodsDetail.data
                      .defaultProduct.goodsPics" :key="goodsImgIndex" class="goods_img" :class="{
                      goods_img_active: currentDefaultImage == goodsImgIndex,
                    }" @click="selectDefaultImage(goodsImgItem, goodsImgIndex)"
                    @mouseover="selectDefaultImage(goodsImgItem, goodsImgIndex)">
                    <div class="goods_image" :style="{ backgroundImage: 'url(' + goodsImgItem + ')' }"></div>
                  </li>
                </ul>
              </div>
              <i class="iconfont icon-ziyuan11 right_arrow" :class="{
                  no_left_arrow:
                    currentDefaultImage ==
                    goodsDetail.data.defaultProduct.goodsPics.length - 1,
                }" @click="switchDefaultImage('right')"></i>
            </div>
            <!-- 商品图片列表 end -->
            <!-- 商品分享和收藏 start -->
            <div class="collection_share_btn flex_row_start_start" v-if="goodsDetail.data.state == 3">
              <div class="collection_btn flex_row_start_center cursor_pointer" @click="collectGoods">
                <img src="@/assets/goods/collection.png" alt="" v-if="goodsDetail.data.followGoods" />
                <img src="@/assets/goods/collection1.png" alt="" v-else />
                <span>{{
                  goodsDetail.data.followGoods ? L["已收藏"] : L["收藏"]
                  }}</span>
              </div>
              <div class="share_btn">
                <div class="share_btn_con flex_row_start_center">
                  <img src="@/assets/goods/share.png" alt="" />
                  <span>{{ L["分享"] }}</span>
                </div>
                <div class="share_list">
                  <div class="share_btn_pre flex_row_start_center cursor_pointer">
                    <img src="@/assets/goods/share.png" alt="" />
                    <span>{{ L["分享"] }}</span>
                  </div>
                  <div class="share_btn_pre flex_row_start_center cursor_pointer" @click="share('qzone')">
                    <img src="@/assets/goods/qq_share.png" alt="" />
                    <span>{{ L["QQ"] }}</span>
                  </div>
                  <div class="share_btn_pre flex_row_start_center cursor_pointer" @click="share('sina')">
                    <img src="@/assets/goods/sina_share.png" alt="" />
                    <span>{{ L["新浪"] }}</span>
                  </div>
                  <div class="share_btn_pre flex_row_start_center cursor_pointer" @click="share('weixin')"
                    @mouseover="share('weixin')">
                    <img src="@/assets/goods/wx_share.png" alt="" />
                    <span>{{ L["微信"] }}</span>
                  </div>
                  <div class="wx_share_code flex_column_center_center" v-if="wxShareCode">
                    <div id="share_wx_qrcode" class="wx_share_code_img"></div>
                    <p class="wx_share_code_title">{{L['分享到微信']}}</p>
                  </div>
                </div>
              </div>
            </div>
            <!-- 商品分享和收藏 end -->
          </div>
          <!-- 商品图片列表 end -->
          <!-- 商品详细信息 start -->
          <div class="m_item_inner">
            <div class="item_info">
              <div :class="{
                  detaile_name: true,
                  skeleton_detaile_name: firstLoading,
                }">
                {{ goodsDetail.data.goodsName }}
              </div>
              <div :class="{ p_ad: true, skeleton_p_ad: firstLoading }" v-if="goodsDetail.data.goodsBrief">
                {{ goodsDetail.data.goodsBrief }}
              </div>
              <!-- 商品未下架即正常商品 start -->
              <div v-if="goodsDetail.data.state == 3 || firstLoading">
                <!-- 促销活动信息 -->
                <section>
                  <!-- 预售 -->
                  <div :class="{act_banner:true,pre_not:preSellInfo.data.pre_run==1,pre_do:preSellInfo.data.pre_run==2}"
                    v-if="JSON.stringify(preSellInfo.data)!='{}'&&preSellInfo.data.pre_run!=3">
                    <div class="title">{{preSellInfo.data.type==1?'定金预售':'全款预售'}}</div>
                    <div class="time_title">{{preSellInfo.data.pre_run==1?'距离开始剩余：':'距离结束剩余：'}}</div>
                    <div class="time">
                      <div class="time">
                        <span v-if="time.day" class="countDown0">{{time.day}}天</span>
                        <span class="countDown1">{{time.hours}}</span>
                        <span class="countDown2">:</span>
                        <span class="countDown1">{{time.minutes}}</span>
                        <span class="countDown2">:</span>
                        <span class="countDown1">{{time.seconds}}</span>
                      </div>
                    </div>
                    <div class="desc" v-show="preSellInfo.data.type==1">
                      <span>预售定金¥{{preSellInfo.data.firstMoney}}</span><span
                        v-if="preSellInfo.data.firstExpand>0">,可抵¥{{preSellInfo.data.firstExpand}}</span>
                    </div>
                  </div>
                  <!-- 拼团 -->
                  <div :class="{act_banner:true,pin_not:pinInfo.data.state==0,pin_do:pinInfo.data.state==1}"
                    v-if="JSON.stringify(pinInfo.data)!='{}'">
                    <div class="title">拼团</div>
                    <div class="time_title">{{pinInfo.data.state==0?'距离开始剩余：':'距离结束剩余：'}}</div>
                    <div class="time">
                      <span v-if="time.day" class="countDown0">{{time.day}}天</span>
                      <span class="countDown1">{{time.hours}}</span>
                      <span class="countDown2">:</span>
                      <span class="countDown1">{{time.minutes}}</span>
                      <span class="countDown2">:</span>
                      <span class="countDown1">{{time.seconds}}</span>
                    </div>
                    <div class="desc">
                      <div class="pintuan_left_num">
                        <img src="@/assets/activity/pintuan.png" />
                        <span>{{pinInfo.data.requiredNum}}人团</span>
                      </div>
                      <div class="group_return_regiment" v-if="pinInfo.data.leaderPrice!=0">
                        团长优惠价￥{{pinInfo.data.leaderPrice}}
                      </div>
                    </div>
                  </div>
                  <!-- 秒杀 -->
                  <div :class="{act_banner:true,sec_not:seckillInfo.data.state==1,sec_do:seckillInfo.data.state==2}"
                    v-if="JSON.stringify(seckillInfo.data)!='{}'">
                    <div class="title">秒杀</div>
                    <div class="time_title">{{seckillInfo.data.state==1?'距离开始剩余：':'距离结束剩余：'}}</div>
                    <div class="time">
                      <span v-if="time.day" class="countDown0">{{time.day}}天</span>
                      <span class="countDown1">{{time.hours}}</span>
                      <span class="countDown2">:</span>
                      <span class="countDown1">{{time.minutes}}</span>
                      <span class="countDown2">:</span>
                      <span class="countDown1">{{time.seconds}}</span>
                    </div>
                    <div class="desc">
                      <div class="SorC_remind" @click="sorcRemind" v-show="seckillInfo.data.state==1">
                        <img src="@/assets/activity/clock.png" alt="" v-if="!seckillInfo.data.isRemind">
                        <img src="@/assets/activity/clock_grey.png" alt="" v-if="seckillInfo.data.isRemind">
                        <div :class="{remind_on:!seckillInfo.data.isRemind,remind_off:seckillInfo.data.isRemind}">
                          {{seckillInfo.data.isRemind?'取消提醒':'提醒我'}}</div>
                      </div>
                    </div>
                  </div>
                  <!-- 阶梯团 -->
                  <div :class="{act_banner:true,ladder_not:ladderInfo.data.state==1,ladder_do:ladderInfo.data.state==2}"
                    v-if="JSON.stringify(ladderInfo.data)!='{}'">
                    <div class="title">阶梯团</div>
                    <div class="time_title">{{ladderInfo.data.state==1?'距离开始剩余：':'距离结束剩余：'}}</div>
                    <div class="time">
                      <span v-if="time.day" class="countDown0">{{time.day}}天</span>
                      <span class="countDown1">{{time.hours}}</span>
                      <span class="countDown2">:</span>
                      <span class="countDown1">{{time.minutes}}</span>
                      <span class="countDown2">:</span>
                      <span class="countDown1">{{time.seconds}}</span>
                    </div>
                    <div class="desc">
                    </div>
                  </div>
                </section>
                <!-- 促销活动信息end -->

                <div class="summary">
                  <div class="sld_summary_item summary_goods clearfix" v-if="goodsDetail.data.defaultProduct">
                    <div class="sld_summary_goods_left">
                      <div class="goods_price flex_row_start_center">
                        <!-- 在售价 -->
                        <div v-if="goodsDetail.data.defaultProduct.productPrice">
                          <span class="price_title activity_title"
                            v-if="JSON.stringify(ladderInfo.data)!='{}'&&ladderInfo.data.state==2">阶梯价</span>
                          <span class="price_title activity_title"
                            v-else-if="JSON.stringify(pinInfo.data)!='{}'&&pinInfo.data.state==1">拼团价</span>
                          <span class="price_title activity_title"
                            v-else-if="JSON.stringify(preSellInfo.data)!='{}'&&preSellInfo.data.pre_run==2">预售价</span>
                          <span class="price_title activity_title"
                            v-else-if="JSON.stringify(seckillInfo.data)!='{}'&&seckillInfo.data.state==2">秒杀价</span>

                          <span class="price_title" v-else>{{ L["价格"] }}</span>
                          <strong :class="{
                              p_price: true,
                              skeleton_p_price: firstLoading,
                            }">
                            <span>￥</span>

                            <span>
                              <span
                                v-if="JSON.stringify(preSellInfo.data)!='{}'&&preSellInfo.data.pre_run==2">{{preSellInfo.data.presellPrice&&preSellInfo.data.presellPrice.toFixed(2)}}</span>
                              <span
                                v-else-if="JSON.stringify(pinInfo.data)!='{}'&&pinInfo.data.state==1">{{pinInfo.data.spellPrice&&pinInfo.data.spellPrice.toFixed(2)}}</span>
                              <span
                                v-else-if="JSON.stringify(ladderInfo.data)!='{}'&&ladderInfo.data.state==2">{{ladderInfo.data.currentPrice&&ladderInfo.data.currentPrice.toFixed(2)}}</span>
                              <span v-else-if="JSON.stringify(seckillInfo.data)!='{}'&&seckillInfo.data.state==2">
                                {{seckillInfo.data.seckillPrice&&seckillInfo.data.seckillPrice.toFixed(2)}}
                              </span>
                              <span
                                v-else>{{goodsDetail.data.defaultProduct.productPrice&&goodsDetail.data.defaultProduct.productPrice.toFixed(2)}}</span>
                            </span>

                          </strong>
                        </div>
                        <!-- 市场价,预售、拼团、秒杀，阶梯团原价 -->
                        <section>
                          <!-- 预售 -->
                          <template v-if="JSON.stringify(preSellInfo.data)!='{}'">
                            <div class="market_price activity_style" v-if="preSellInfo.data.pre_run==1">
                              预售价 ￥{{preSellInfo.data.presellPrice&&preSellInfo.data.presellPrice.toFixed(2)}}</div>
                            <div class="market_price" v-if="preSellInfo.data.pre_run==2">
                              原价 ￥{{preSellInfo.data.productPrice&&preSellInfo.data.productPrice.toFixed(2)}}</div>
                          </template>

                          <!-- 拼团 -->
                          <template v-else-if="JSON.stringify(pinInfo.data)!='{}'">
                            <div class="market_price activity_style" v-if="pinInfo.data.state==0">拼团价
                              ￥{{pinInfo.data.spellPrice&&pinInfo.data.spellPrice.toFixed(2)}}</div>
                            <div class="market_price" v-if="pinInfo.data.state==1">原价
                              ￥{{pinInfo.data.productPrice&&pinInfo.data.productPrice.toFixed(2)}}</div>
                          </template>

                          <!-- 阶梯团 -->
                          <template v-else-if="JSON.stringify(ladderInfo.data)!='{}'">
                            <div class="market_price activity_style" v-if="ladderInfo.data.state==1">阶梯价
                              ￥{{ladderInfo.data.currentPrice&&ladderInfo.data.currentPrice.toFixed(2)}}</div>
                            <div class="market_price" v-if="ladderInfo.data.state==2">原价
                              ￥{{ladderInfo.data.productPrice&&ladderInfo.data.productPrice.toFixed(2)}}</div>
                          </template>

                          <!-- 秒杀 -->
                          <template v-else-if="JSON.stringify(seckillInfo.data)!='{}'">
                            <div class="market_price activity_style" v-if="seckillInfo.data.state==1">秒杀价
                              ￥{{seckillInfo.data.seckillPrice&&seckillInfo.data.seckillPrice.toFixed(2)}}</div>
                            <div class="market_price" v-if="seckillInfo.data.state==2">原价
                              ￥{{seckillInfo.data.productPrice&&seckillInfo.data.productPrice.toFixed(2)}}</div>
                          </template>


                          <div class="market_price" v-else-if="goodsDetail.data.defaultProduct.marketPrice">￥{{
                            goodsDetail.data.defaultProduct.marketPrice }}</div>
                        </section>
                        <!-- 市场价....end -->
                      </div>
                      <div class="actual_sales">
                        {{ L["销量"] }}
                        <span>{{ goodsDetail.data.sales }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="coupon flex_row_start_center" v-show="
                      couponList.data &&
                      couponList.data.list &&
                      couponList.data.list.length > 0
                    ">
                    <div class="coupon_title">{{ L["优惠券"] }}</div>
                    <div class="coupon_list flex_row_start_center">
                      <span class="coupon_pre_rules cursor_pointer" v-for="(couponItem, couponIndex) in couponList.data
                          .list" :key="couponIndex" v-show="couponIndex < 4" @click="openCouponModel">{{
                        couponItem.couponContent }}</span>
                    </div>
                    <!-- 优惠券弹框 start -->
                    <el-dialog v-model="couponModel" title="领取优惠券" width="880px" lock-sroll="false">
                      <div class="coupon_model" lock-sroll="false">
                        <div class="model_coupon_list">
                          <CouponItem v-for="(couponItem, couponIndex) in couponList.data
                              .list" :key="couponIndex" :coupon_item="couponItem" :class="sld_coupon_item"
                            @refreshCouponList="openCouponModel"></CouponItem>
                        </div>
                        <div class="flex_row_end_center sld_pagination sld_page_bottom" v-if="
                            couponList.data.pagination &&
                            couponList.data.pagination.total
                          ">
                          <el-pagination @current-change="handleCurrentChangeCoupon" v-model:currentPage="curCouponPage"
                            :page-size="couponPageSize" layout="prev, pager, next, jumper"
                            :total="couponList.data.pagination.total" :hide-on-single-page="true">
                          </el-pagination>
                        </div>
                      </div>
                    </el-dialog>
                    <!-- 优惠券弹框 end -->
                  </div>
                  <div class="promotion flex_row_between_center" v-if="fullDisList.data.length > 0">
                    <div class="promotion_left flex_row_start_center">
                      <div class="promotion_title">{{ L["促销"] }}</div>
                      <div class="promotion_list">
                        <template v-for="(
                            fullDisItem, fullDisIndex
                          ) in fullDisList.data" :key="fullDisIndex">
                          <span class="promotion_pre" v-for="(
                              descriptionItem, descriptionIndex
                            ) in fullDisItem.descriptionList" :key="descriptionIndex"><i v-html="descriptionItem"></i>,
                          </span>
                        </template>
                      </div>
                    </div>
                    <div class="promotion_right" @click="lookFullDiscount">
                      {{ L["查看详情"] }} >
                    </div>
                    <el-dialog v-model="fullDiscountModel" title="满优惠" width="520px" top="32vh" lock-sroll="false">
                      <div class="full_discount_model">
                        <div class="full_discount_pre flex_row_start_start" v-for="(
                            fullDisItem, fullDisIndex
                          ) in fullDisList.data" :key="fullDisIndex">
                          <div class="full_pre_tips"></div>
                          <div class="full_pre_con">
                            <div class="full_pre_title">
                              {{ fullDisItem.promotionName }}
                            </div>
                            <div class="full_pre_des" v-for="(
                                descriptionItem, descriptionIndex
                              ) in fullDisItem.descriptionList" :key="descriptionIndex">
                              <div class="full_pre_name flex_row_start_center">
                                <span v-html="descriptionItem"></span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </el-dialog>
                  </div>

                  <!-- 预售发货描述 -->
                  <section v-if="JSON.stringify(preSellInfo.data)!='{}'&&preSellInfo.data.pre_run!=3">
                    <div class="activity_addDesc">
                      <div class="preSale_addDesc" v-if="preSellInfo.data.type==1">
                        (付尾款时间：{{preSellInfo.data.remainStartTime}}～{{preSellInfo.data.remainEndTime}})</div>
                      <div class="preSale_addDesc">
                        (发货时间：{{preSellInfo.data.deliverTime&&preSellInfo.data.deliverTime.split(' ')[0]}})</div>
                    </div>
                  </section>
                  <!-- 预售发货描述end -->

                </div>
                <!-- 配送至地区 start -->
                <div v-if="(!firstLoading)&&goodsDetail.data.deliverInfo" class="delivery flex_row_start_center">
                  <div class="delivery_title">{{L['配送至']}}</div>
                  <label class="delivery_address flex_row_between_center"
                    @click.stop="addrDialogVisible=!addrDialogVisible" for="invisibleInput">
                    <span>{{curAddrName?curAddrName:L['请选择地址']}}</span>
                    <i class="iconfont icon-ziyuan11-copy"></i>
                  </label>
                  <!-- <input type="text" name="" id="invisibleInput" @blur="addrDialogVisible = false"> -->
                  <div class="address_dia" v-if="addrDialogVisible">
                    <div class="add_dia_top">
                      <div :class="{dia_top_item:true,sel_item:addrIdx==0}" @click.stop="addrIdx=0"
                        v-if="logFlag&&address_list.data.length">常用地址</div>
                      <div :class="{dia_top_item:true,sel_item:addrIdx==1}" @click.stop="addrIdx=1">其他地址</div>
                    </div>
                    <div class="add_dia_bottom">
                      <div class="usual_addr" v-if="addrIdx==0&&(logFlag&&address_list.data.length)">
                        <el-radio-group v-model="curAddr" @change="changeAddr($event)" text-color="#333333"
                          fill="#FC1C1C" v-if="address_list.data&&address_list.data.length">
                          <el-radio v-for="(item,index) in address_list.data" :key="index" :label="item.addressId"
                            class="promotion_radio" @click.stop="()=>{}">
                            {{ item.addressAll }}{{item.detailAddress}}
                          </el-radio>
                        </el-radio-group>
                      </div>
                      <div class="other_addr" v-if="addrIdx==1">
                        <div class="o_add_top">
                          <div :class="{o_addr_item:true,o_sel:otherAddrIdx==id}" v-for="(it,id) in otherTree" :key="id"
                            @click.stop="selRegion(id)">
                            {{it.regionName}}</div>
                        </div>
                        <div class="o_add_bottom">
                          <div :class="{o_addrC_item:true,o_selected:othTopIdx[otherAddrIdx]==index}"
                            v-for="(item,index) in othAddrDe" :key="index"
                            @click.stop="selRegionChild(index,otherAddrIdx)">
                            {{item.regionName}}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 配送至地区 end -->
                <!-- 运费 start -->
                <div v-if="!firstLoading" class="freight flex_row_start_center">
                  <div class="freight_title">{{ L["运费"] }}</div>
                  <span :class="{ freight_amount: firstLoading }" v-if="
                      goodsDetail.data &&
                      goodsDetail.data.deliverInfo &&
                      goodsDetail.data.deliverInfo.expressFee
                    ">￥{{ goodsDetail.data.deliverInfo.expressFee }}</span>
                  <span v-else>{{ L['免运费'] }}</span>
                </div>
                <!-- 运费 end -->
                <!-- 规格 start -->
                <div class="goods_spec">
                  <div class="goods_spec_pre flex_row_start_start"
                    v-for="(specItem, specIndex) in goodsDetail.data.specs" :key="specIndex">
                    <div class="goods_spec_pre_title" :title="specItem.specName">
                      {{ specItem.specName }}
                    </div>
                    <div class="goods_spec_pre_list flex_row_start_center">
                      <!-- checkState : 1-选中，2-可选，3-禁用 -->
                      <!-- 禁止选择 -->
                      <div class="specval_pre cursor_pointer"
                        :class="{specval_pre_disabled: sepcValItem.checkState == '3',}"
                        v-for="(sepcValItem, specValIndex) in specItem.specValueList" :key="specValIndex"
                        v-show="sepcValItem.checkState == '3'">
                        <div class="specval_pre_image" :style="{backgroundImage: 'url(' + sepcValItem.image + ')',}"
                          :title="sepcValItem.specValue" v-if="sepcValItem.image"></div>
                        <span class="specval_pre_text" v-else>{{ sepcValItem.specValue }}</span>
                      </div>
                      <!-- 可选择 -->
                      <div class="specval_pre cursor_pointer" :class="{
                          specval_pre_active: sepcValItem.checkState == '1',
                        }" v-for="(
                          sepcValItem, specValIndex
                        ) in specItem.specValueList" :key="specValIndex" @click="
                          selectSpecVal(
                            'choice',
                            specItem.specId,
                            sepcValItem.specValueId
                          )
                        " v-show="sepcValItem.checkState != '3'">
                        <div class="goods_image" :style="{
                            backgroundImage: 'url(' + goodsImgItem + ')',
                          }"></div>
                        <div class="specval_pre_image" :style="{
                            backgroundImage: 'url(' + sepcValItem.image + ')',
                          }" :title="sepcValItem.specValue" v-if="sepcValItem.image"></div>
                        <span class="specval_pre_text" v-else>{{ sepcValItem.specValue }}</span>
                        <img src="@/assets/goods/check_mark.png" alt="" class="check_mark"
                          v-if="sepcValItem.checkState == '1'" />
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 规格 end -->
                <!-- 数量加减及库存 start -->
                <div v-if="!firstLoading" class="quantity_inventory flex_row_start_center">
                  <div class="quantity_title">{{ L["数量"] }}</div>
                  <!-- <div class="quantity_edit flex_row_start_center">
                    <span @click="editNum('reduce')" ref="reduce" :style="disStyle">-</span>
                    <input type="number" v-model="currentSpecNum" @input="editNum('edit', cartItem, $event)"
                      @blur="editNum('blur', $event)" />
                    <span @click="editNum('add')" ref="add">+</span>
                  </div> -->
                  <div class="quantity_edit flex_row_start_center">
                    <input type="number" v-model="currentSpecNum" @input="editNum('edit', cartItem, $event)"
                      @blur="editNum('blur', $event)" />
                      <div class="numred">
                        <span @click="editNum('add')" ref="add" class="sp">+</span>
                        <span @click="editNum('reduce')" ref="reduce" class="sp">-</span>
                      </div>
                  </div>
                  <div class="inventory" v-if="
                      goodsDetail.data.defaultProduct &&
                      goodsDetail.data.defaultProduct.productStock
                    ">
                    {{ L["库存"]
                    }}{{ goodsDetail.data.defaultProduct.productStock }}件
                  </div>
                </div>
                <!-- 数量加减及库存 end-->
              </div>
              <!-- 商品未下架即正常商品 end -->

              <template v-if="!firstLoading">
                <!-- 立即购买 加入购物车 收藏 ，分享 start-->

                <!-- 商品已下架 start -->
                <div class="options_btn" v-if="goodsDetail.data.state&&goodsDetail.data.state != 3">
                  <p class="option_desc">商品已下架，欢迎挑选其他商品~</p>
                  <div class="goods_off_shelves">{{ L["商品已下架"] }}</div>

                  <!-- 商品下架时的推荐商品 start -->
                  <div class="recoOffShop">
                    <div class="reCon"
                      v-for="({goodsImage,goodsName,goodsPrice,defaultProductId},index) in recomOffShop.data"
                      :key="index">
                      <div class="reComImg">

                        <router-link :to="`/goods/detail?productId=${defaultProductId}`" target="_blank"> <img
                            :src="goodsImage" alt="">
                        </router-link>
                      </div>
                      <router-link class="recomName" :to="`/goods/detail?productId=${defaultProductId}`"
                        target="_blank">
                        {{goodsName}}
                      </router-link>
                      <span class="recomPrice">￥{{goodsPrice}}</span>
                    </div>
                  </div>
                  <!-- 商品下架时的推荐商品 end -->
                </div>
                <!-- 商品已下架 end -->

                <!-- 商品库存不足 start -->
                <div class="options_btn flex_row_between_center"
                  v-else-if="!goodsDetail.data.defaultProduct.productStock">
                  <div class="goods_out_stock">{{ L["库存不足"] }}</div>
                </div>
                <!-- 商品库存不足 end -->

                <!-- 普通(活动)正常商品 start -->
                <div class="options_btn flex_row_start_center" v-else>

                  <div class="goods_code" id="qrcodeAct" v-show="isShowQr"></div>

                  <!-- 预售 -->
                  <template v-if="JSON.stringify(preSellInfo.data)!='{}'&&preSellInfo.data.pre_run!=3">
                    <div class="preSell_but" @click="isShowQr = !isShowQr">
                      <img src="@/assets/activity/qrcode.png" alt="">
                      扫码参加预售
                    </div>
                  </template>
                  <!-- 预售 -->

                  <!-- 拼团 -->
                  <template v-else-if="JSON.stringify(pinInfo.data)!='{}'&&pinInfo.data.state==1">
                    <div class="buy_now flex_column_center_center" @click="isShowQr = !isShowQr">
                      <span
                        class="pin_but_text">¥{{pinInfo.data.leaderIsPromotion==1?pinInfo.data.leaderPrice:pinInfo.data.spellPrice}}</span>
                      <span class="pin_but_text">扫码开团</span>
                    </div>

                    <div class="add_cart flex_column_center_center" @click="goBuy">
                      <span
                        class="pin_but_text">¥{{pinInfo.data.productPrice&&pinInfo.data.productPrice.toFixed(2)}}</span>
                      <span class="pin_but_text">原价购买</span>
                    </div>
                  </template>
                  <!-- 拼团 -->

                  <!-- 阶梯团 -->
                  <template v-else-if="JSON.stringify(ladderInfo.data)!='{}'&&ladderInfo.data.state==2">
                    <div class="buy_now flex_column_center_center" @click="isShowQr = !isShowQr">
                      <span
                        class="pin_but_text">¥{{ladderInfo.data.currentPrice&&ladderInfo.data.currentPrice.toFixed(2)}}</span>
                      <span class="pin_but_text">扫码参团</span>
                    </div>
                  </template>
                  <!-- 阶梯团 -->

                  <!-- 秒杀 -->
                  <template v-else-if="JSON.stringify(seckillInfo.data)!='{}'&&seckillInfo.data.state==2">
                    <div class="add_cart flex_row_center_center" @click="goBuy">
                      {{ L["立即购买"] }}
                    </div>
                  </template>
                  <!-- 秒杀 -->

                  <template v-else>
                    <div class="buy_now flex_row_center_center" @click="goBuy">
                      {{ L["立即购买"] }}
                    </div>
                    <div class="add_cart flex_row_center_center" @click="addCart"
                      v-if="goodsDetail.data.isVirtualGoods==1">
                      <img src="@/assets/goods/cart.png" alt="" />
                      <span>{{ L["加入购物车"] }}</span>
                    </div>
                  </template>

                </div>
                <!-- 普通(活动)正常商品 end -->

                <!-- 立即购买 加入购物车 收藏 ，分享 end-->
              </template>
            </div>
          </div>
          <!-- 商品详细信息 end -->
          <!-- 相关推荐 start -->
          <div class="more_goods" v-if="goodsDetail.data.state == 3">
            <div class="more_goods_title">{{ L["看了又看"] }}</div>
            <div class="more_goods_list flex_column_center_center">
              <template v-if="firstLoading">
                <div class="more_goods_pre" v-for="(recommendItem, recommendIndex) in [
                    { a: 1 },
                    { b: 2 },
                    { c: 3 },
                  ]" :key="recommendIndex" @click="goGoodsDetail(recommendItem.defaultProductId)">
                  <div :class="{
                      more_goods_pre_img: true,
                      skeleton_more_goods_pre_img: firstLoading,
                    }"></div>
                  <p :class="{
                      skeleton_more_goods_pre_goods_name: firstLoading,
                    }">
                    {{ recommendItem.goodsName }}
                  </p>
                  <p>
                    <span :class="{
                        skeleton_more_goods_pre_goods_price: firstLoading,
                      }"></span>
                  </p>
                </div>
              </template>
              <template v-else>
                <div class="more_goods_pre" v-for="(recommendItem,recommendIndex) in recommendeList.data"
                  :key="recommendIndex" v-show="recommendIndex < 3"
                  @click="goGoodsDetail(recommendItem.defaultProductId)">
                  <div class="more_goods_pre_img flex_row_center_center">
                    <img :src="recommendItem.goodsImage" :title="recommendItem.goodsName" />
                  </div>
                  <p>{{recommendItem.goodsName}}</p>
                  <p>￥{{recommendItem.goodsPrice}}</p>
                </div>
              </template>
            </div>
          </div>
          <!-- 相关推荐 end -->
        </div>
        <!-- 商品相关 end -->
        <!-- 店铺，及各种信息的切换 start -->
        <div class="container flex_row_start_start" ref="container" id="container">
          <div class="left">
            <div class="store_info" v-if="goodsDetail.data.storeInf">
              <div class="store_info_title flex_row_start_center">
                <span class="store_type" v-if="goodsDetail.data.storeInf.isOwnStore == 1">{{ L["自营"] }}</span>
                <span class="store_title" @click="goStore()">{{
                  goodsDetail.data.storeInf.storeName
                  }}</span>
                <img src="@/assets/goods/link_server.png" @click="kefu" />
              </div>
              <div class="store_des">
                <div class="store_des_pre" v-show="goodsDetail.data.storeInf.isOwnStore != 1">
                  <span>{{ L["店铺等级"] }}</span>
                  <span>{{ goodsDetail.data.storeInf.storeGradeName }}</span>
                </div>
                <div class="store_des_pre">
                  <span>{{ L["商品评价"] }}</span>
                  <span :class="goodsDetail.data.storeInf.descriptionScore < 2 ? 'evaluationes':''">{{
                    goodsDetail.data.storeInf.descriptionScore }}</span>
                  <span v-if="goodsDetail.data.storeInf.descriptionScore > 4">{{
                    L["高"]
                    }}</span>
                  <span v-else-if="goodsDetail.data.storeInf.descriptionScore < 2" class="evaluationes">{{ L["低"]
                    }}</span>
                  <span v-else>{{ L["中"] }}</span>
                </div>
                <div class="store_des_pre pre_deliver">
                  <span>{{ L["物流评价"] }}</span>
                  <span :class="goodsDetail.data.storeInf.deliverScore < 2 ? 'evaluationes':''">{{
                    goodsDetail.data.storeInf.deliverScore }}</span>
                  <span v-if="goodsDetail.data.storeInf.deliverScore > 4">{{
                    L["高"]
                    }}</span>
                  <span v-else-if="goodsDetail.data.storeInf.deliverScore < 2" class="evaluationes">{{ L["低"] }}</span>
                  <span v-else>{{ L["中"] }}</span>
                </div>
                <div class="store_des_pre pre_service">
                  <span>{{ L["售后服务"] }}</span>
                  <span :class="goodsDetail.data.storeInf.serviceScore < 2 ? 'evaluationes':''">{{
                    goodsDetail.data.storeInf.serviceScore }}</span>
                  <span v-if="goodsDetail.data.storeInf.serviceScore > 4">{{L["高"]}}</span>
                  <span v-else-if="goodsDetail.data.storeInf.serviceScore < 2" class="evaluationes">{{ L["低"] }}</span>
                  <span v-else>{{ L["中"] }}</span>
                </div>
              </div>
              <div class="store_btn flex_row_center_center">
                <div class="store_btn_pre flex_row_center_center">
                  <img src="@/assets/goods/store.png" alt="" class="btn_pre_img"/>
                  <router-link target="_blank" :to="`/store/index?vid=${goodsDetail.data.storeInf.storeId}`"
                    class="go_store_btn">
                    {{ L["进入店铺"] }}
                  </router-link>
                </div>
                <div class="store_btn_pre flex_row_center_center" @click="focusStore">
                  <img src="@/assets/goods/collection.png" alt="" v-if="goodsDetail.data.storeInf.isFollowStore" />
                  <img src="@/assets/goods/no_collection.png" alt="" v-else />
                  <span>{{
                    goodsDetail.data.storeInf.isFollowStore
                    ? L["取消关注"]
                    : L["关注店铺"]
                    }}</span>
                </div>
              </div>
            </div>
            <!-- 店铺推荐及热门收藏 start -->
            <div class="store_popular">
              <div class="store_popular_btn flex_row_between_center">
                <span @click="getStorePopular('recommend')" :class="{
                    store_popular_active: storePopularType == 'recommend',
                  }">{{ L["店铺热销"] }}</span>
                <span @click="getStorePopular('collection')" :class="{
                    store_popular_active: storePopularType == 'collection',
                  }">{{ L["热门收藏"] }}</span>
              </div>
              <div class="store_popular_list" v-if="storePopularList.data.length">
                <div class="store_popular_pre" v-for="(storePopularItem,storePopularIndex) in storePopularList.data"
                  :key="storePopularIndex" @click="goGoodsDetail(storePopularItem.defaultProductId)">
                  <div class="store_popular_img flex_row_center_center">
                    <img :src="storePopularItem.goodsImage" :title="storePopularItem.goodsName" />
                  </div>
                  <p>{{storePopularItem.goodsName}}</p>
                  <p class="flex_row_between_center">
                    <span>{{ L["已售"] }}{{ storePopularItem.saleNum }}</span>
                    <span>￥{{ storePopularItem.goodsPrice }}</span>
                  </p>
                </div>
              </div>
              <div class="popular_list_empty flex_row_center_center" v-show="!storePopularList.data.length">
                <p>[{{L['暂无数据']}}]</p>
              </div>
            </div>
            <!-- 店铺推荐及热门收藏 end -->
          </div>
          <!-- 商品详情 评价 商品服务 店铺热销  start-->
          <div class="goods_description">
            <div class="goods_description_title flex_row_between_center">
              <div class="description_title_left flex_row_start_center">
                <span class="cursor_pointer" :class="{ description_active: goodsDesctionType == 'detail' }"
                  @click="goodsDescType('detail')">{{ L["商品详情"] }}</span>
                <span class="cursor_pointer" :class="{
                    description_active: goodsDesctionType == 'evaluate',
                  }" @click="goodsDescType('evaluate')">{{ L["评价"] }}({{
                  goodsCommentsInfo.data &&
                  goodsCommentsInfo.data.commentsCount > 0
                  ? goodsCommentsInfo.data.commentsCount
                  : "0"
                  }})</span>
                <span class="cursor_pointer" :class="{
                    description_active: goodsDesctionType == 'service',
                  }" @click="goodsDescType('service')">{{ L["商品服务"] }}</span>
                <span class="cursor_pointer" :class="{
                    description_active: goodsDesctionType == 'salestore',
                  }" @click="goodsDescType('salestore')">{{ L["店铺推荐"] }}</span>
                <!-- 改为店铺推荐  -->
              </div>
              <div class="description_title_right flex_row_end_center">
                <div class="mobile_order flex_row_start_center cursor_pointer">
                  <span>{{ L["手机下单"] }}</span>
                  <div class="goods_code" id="qrcode"></div>
                  <div class="mobile_order_model">
                    <div class="model_goods_code" id="qrcodeBig">
                      <!-- <img src="@/assets/goods/code.png" alt="" /> -->
                    </div>
                    <p>{{ L["手机下单"] }}</p>
                  </div>
                </div>
                <div class="line"
                  v-if="goodsDetail.data.isVirtualGoods==1&&!goodsDetail.data.defaultProduct.promotionType"></div>
                <div class="go_add_cart cursor_pointer" @click="addCart"
                  v-if="goodsDetail.data.isVirtualGoods==1&&!goodsDetail.data.defaultProduct.promotionType">
                  {{ L["加入购物车"] }}
                </div>
              </div>
            </div>
            <div class="goods_description_con">
              <!-- 商品详情,规格参数,及详情富文本 start-->
              <div class="goods_des_con" v-if="goodsDesctionType == 'detail'">
                <div v-if="
                    goodsDetail.data.brandName ||
                    (goodsDetail.data.goodsParameterList &&
                      goodsDetail.data.goodsParameterList.length > 0) || goodsDetail.data.goodsDetails
                  ">
                  <div class="brand" v-if="goodsDetail.data.brandName">
                    <span>{{ L["品牌"] }}: </span>
                    <span>{{ goodsDetail.data.brandName }}</span>
                  </div>
                  <div v-if="goodsDetail.data.goodsParameterList && goodsDetail.data.goodsParameterList.length > 0">
                    <div class="goods_parameter_list" :class="{'goods_paramter_more':!parameterShow}">
                      <div class="goods_parameter_pre" v-for="(parameterItem, paramterIndex) in goodsDetail.data
                          .goodsParameterList" :key="paramterIndex">
                        <span>{{ parameterItem.parameterName }}: </span>
                        <span>{{ parameterItem.parameterValue }}</span>
                      </div>
                    </div>
                    <div class="collapse_unfold flex_row_center_center cursor_pointer" v-if="goodsDetail.data.goodsParameterList.length > 16
                      " @click="openParameter">
                      <span>{{ !parameterShow ? L["查看全部"] : L['收起全部'] }}</span>
                      <i class="iconfont icon-ziyuan11-copy" v-if="!parameterShow"></i>
                      <i class="iconfont icon-ziyuan11-copy-copy" v-else></i>
                    </div>
                  </div>
                  <div v-if="goodsDetail.data.topTemplateContent!=undefined&&goodsDetail.data.topTemplateContent"
                    class="goods_html" :style="goodsDetail.data.topTemplateContentBg">
                    <div class="goods_htmls" v-html="goodsDetail.data.topTemplateContent"></div>
                  </div>
                  <div v-if="goodsDetail.data.goodsDetails!=undefined && goodsDetail.data.goodsDetails"
                    class="goods_html" :style="goodsDetail.data.goodsDetailsBg">
                    <div class="goods_htmls" v-html="goodsDetail.data.goodsDetails"></div>
                  </div>
                  <div v-if="goodsDetail.data.bottomTemplateContent!=undefined&&goodsDetail.data.bottomTemplateContent"
                    class="goods_html" :style="goodsDetail.data.bottomTemplateContentBg">
                    <div class="goods_htmls" v-html="goodsDetail.data.bottomTemplateContent"></div>
                  </div>
                </div>
                <div v-else>
                  <SldCommonEmpty :tip="L['该商品暂无详情~']" totalWidth="934px" />
                </div>
              </div>
              <!-- 商品详情,规格参数,及详情富文本 end-->
              <!-- 商品评价 start -->
              <div class="goods_comments" v-if="goodsDesctionType == 'evaluate'">
                <div class="goods_comments_top">
                  <div class="goods_comments_left">
                    <div class="comments_title flex_row_between_center">
                      <div class="comments_tips">{{ L["评分"] }}:</div>
                      <el-rate disabled :colors="colors" score-template="{score}" v-model="score">
                      </el-rate>
                    </div>
                    <div class="good_comment flex_row_center_center">
                      <span>{{ L["好评率"] }}:</span>
                      <span>{{ goodsCommentsInfo.data.highPercent }}</span>
                    </div>
                  </div>
                  <div class="goods_comments_nav">
                    <div class="comments_nav_pre" :class="{ comments_nav_pre_active: evaluationType == '' }"
                      @click="getEvaluation('')">
                      {{ L["全部"] }}({{
                      goodsCommentsInfo.data.commentsCount
                      }})
                    </div>
                    <div class="comments_nav_pre" :class="{
                        comments_nav_pre_active: evaluationType == 'hasPic',
                      }" @click="getEvaluation('hasPic')">
                      {{ L["有图"] }}({{ goodsCommentsInfo.data.hasPicCount }})
                    </div>
                    <div class="comments_nav_pre" :class="{
                        comments_nav_pre_active: evaluationType == 'high',
                      }" @click="getEvaluation('high')">
                      {{ L["好评"] }}({{ goodsCommentsInfo.data.highCount }})
                    </div>
                    <div class="comments_nav_pre" :class="{
                        comments_nav_pre_active: evaluationType == 'middle',
                      }" @click="getEvaluation('middle')">
                      {{ L["中评"] }}({{ goodsCommentsInfo.data.middleCount }})
                    </div>
                    <div class="comments_nav_pre" :class="{
                        comments_nav_pre_active: evaluationType == 'low',
                      }" @click="getEvaluation('low')">
                      {{ L["差评"] }}({{ goodsCommentsInfo.data.lowCount }})
                    </div>
                  </div>
                </div>
                <div class="goods_comments_list" v-if="
                    goodsCommentsInfo.data &&
                    goodsCommentsInfo.data.list &&
                    goodsCommentsInfo.data.list.length > 0
                  ">
                  <div class="goods_comments_pre flex_row_start_start" v-for="(
                      goodsCommentsItem, goodsCommentsIndex
                    ) in goodsCommentsInfo.data.list" :key="goodsCommentsIndex">
                    <div class="goods_comments_avatar" :style="{
                        backgroundImage:
                          'url(' + goodsCommentsItem.memberAvatar + ')',
                      }"></div>
                    <div class="list_des">
                      <div class="list_top flex_row_between_start">
                        <div class="list_left">
                          <div class="list_top_tile flex_row_center_center">
                            <div class="list_top_tips">
                              {{ goodsCommentsItem.memberName }}
                            </div>
                            <el-rate v-model="goodsCommentsItem.score" disabled text-color="#ff9900" allow-half="true">
                            </el-rate>
                          </div>
                          <div class="spec">
                            {{ goodsCommentsItem.specValues }}
                          </div>
                        </div>
                        <div class="list_top_right">
                          {{ goodsCommentsItem.createTime }}
                        </div>
                      </div>
                      <div class="list_pre">
                        <p class="CommentContent">{{ goodsCommentsItem.content }}</p>
                        <div class="list_pre_img_list flex_row_start_center" v-if="goodsCommentsItem.images.length">
                          <div class="imgCon1" v-for="(commentsImgItem, commentsImgIndex) in goodsCommentsItem.images"
                            :key="commentsImgIndex">
                            <div class="list_pre_img" :style="{backgroundImage: 'url(' + commentsImgItem + ')',}"
                              @click="showImg(commentsImgIndex,commentsImgItem)"></div>
                          </div>
                        </div>
                        <p v-if="goodsCommentsItem.replyContent" class="replyContent">
                          <span class="seller">商家回复:</span>
                          <span class="contentRe">{{goodsCommentsItem.replyContent}}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex_row_end_center sld_pagination sld_page_bottom"
                  v-if="goodsCommentsInfo.data.pagination.total">
                  <el-pagination @current-change="handleCurrentChange" v-model:currentPage="evaluationCurrent"
                    :page-size="evaluationPageSize" layout="prev, pager, next, jumper"
                    :total="goodsCommentsInfo.data.pagination.total" :hide-on-single-page="true">
                  </el-pagination>
                </div>
                <div v-if="
                    goodsCommentsInfo.data.list &&
                    goodsCommentsInfo.data.list.length == 0
                  " class="flex_column_center_center empty_data">
                  <SldCommonEmpty :tip="L['该商品暂无评论~']" totalWidth="934px" />
                </div>
              </div>
              <!-- 商品评价 end -->
              <!-- 商品服务 start -->
              <div class="goods_server_list" v-if="goodsDesctionType == 'service'">
                <div v-if="
                    goodsDetail.data.serviceLabels &&
                    goodsDetail.data.serviceLabels.length > 0
                  ">
                  <div class="goods_server_pre" v-for="(serverItem, serverIndex) in goodsDetail.data
                      .serviceLabels" :key="serverIndex">
                    <div class="server_pre_top flex_row_start_center">
                      <span class="server_pre_tips"></span>
                      <span class="server_pre_name">{{
                        serverItem.labelName
                        }}</span>
                    </div>
                    <div class="server_pre_content">
                      {{ serverItem.description }}
                    </div>
                  </div>
                </div>
                <div v-else>
                  <SldCommonEmpty :tip="L['暂无商品服务~']" totalWidth="934px" />
                </div>
              </div>
              <!-- 商品服务 end -->
              <!-- 店铺推荐 start -->
              <div class="store_hot_sales" v-if="goodsDesctionType == 'salestore'">
                <div v-if="recommendedList.data && recommendedList.data.length > 0">
                  <div class="store_hot_sales_list">
                    <div class="goods_pre flex_column_between_start" v-for="(
                        recommendItem, recommendIndex
                      ) in recommendedList.data" :key="recommendIndex"
                      @click="goGoodsDetail(recommendItem.defaultProductId)">
                      <div class="flex_column_start_start">
                        <div class="goods_pre_img" :style="{
                            backgroundImage:
                              'url(' + recommendItem.goodsImage + ')',
                          }"></div>
                        <div class="goods_name">
                          {{ recommendItem.goodsName }}
                        </div>
                      </div>
                      <div class="goods_price">
                        <div class="selling_price">
                          ￥{{ recommendItem.goodsPrice }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="flex_row_end_center sld_pagination sld_page_bottom" v-if="
                      recommendeData.data.pagination &&
                      recommendeData.data.pagination.total
                    ">
                    <el-pagination @current-change="handleCurrentChangeSales" v-model:currentPage="salesCurrent"
                      :page-size="salesPageSize" layout="prev, pager, next, jumper"
                      :total="recommendeData.data.pagination.total" :hide-on-single-page="true">
                    </el-pagination>
                  </div>
                </div>
                <div v-if="
                    recommendedList.data && recommendedList.data.length == 0
                  " class="flex_column_center_center empty_data">
                  <SldCommonEmpty :tip="L['暂无相关商品~']" totalWidth="934px" />
                </div>
              </div>
              <!-- 店铺推荐 end -->
            </div>
          </div>
          <!-- 商品详情 评价 商品服务 店铺热销  end-->
        </div>
        <!-- 店铺，及各种信息的切换 end -->
      </div>
      <!-- 商品主要信息 end -->
    </div>
    <SldLoginModal :visibleFlag="loginModalVisibleFlag" @closeLoingModal="closeLoingModal" @refreshInfo="refreshInfo" />
    <el-dialog v-model="imgVisible" width="70%" lock-sroll="false">
      <!-- :style="{backgroundImage: 'url(' + imgSource + ')',backgroundSize: '30%', height:'700px',backgroundPosition: 'top center', backgroundRepeat: 'no-repeat'}" -->
      <div style="height:700px;">
        <img :src="imgSource" alt="" class="imgOpen">
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import addrData from '@/assets/area.json'
  import { reactive, getCurrentInstance, ref, onMounted, provide, watch, computed } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { ElMessage, ElRate } from "element-plus";
  import { qrcanvas } from "qrcanvas";
  import StoreHeaderCat from "../store/StoreHeaderCat";
  import CouponItem from "@/components/CouponItem";
  import { useStore } from "vuex";
  import SldLoginModal from "../../components/loginModal";
  import SldCommonEmpty from "../../components/SldCommonEmpty";
  export default {
    name: "goods-detail",
    components: {
      ElRate,
      StoreHeaderCat,
      CouponItem,
      SldLoginModal,
      SldCommonEmpty,
    },
    setup() {
      const firstLoading = ref(true); //是否第一次加载
      const router = useRouter();
      const route = useRoute();
      const store = useStore();
      const imgVisible = ref(false)
      const imgSource = ref('')
      const imgIndex = ref(-1)
      const vid = ref(0); //店铺id
      const { proxy } = getCurrentInstance();
      const L = proxy.$getCurLanguage();
      const goodsDetail = reactive({ data: {} }); //商品详情数据
      const isChoice = ref("default"); //是默认选中的,还是点击选择规格之后的  default:默认  choice:选择
      const productId = ref(""); //货品id
      const fullDisList = reactive({ data: [] }); //满优惠促销列表
      const couponList = reactive({ data: [] }); //获取店铺优惠券列表
      const pictureBig = ref(null); //大图的信息
      const maskBox = ref(null); //遮罩盒子的信息
      const maskShow = ref(false); //遮罩是否显示
      const previewBox = ref(null); // 左侧主图元素信息
      const zoomBox = ref(null); //左侧主图的父元素的信息
      const defaultImage = ref(""); //默认主图路径
      const currentDefaultImage = ref("0"); //默认主图显示第一张
      const currentSpecNum = ref(1); //商品编辑数量，默认数量为1
      const recommendeList = reactive({ data: [] }); //看了又看商品
      const storePopularList = reactive({ data: [] }); //店铺推荐及热门收藏
      const storePopularType = ref("recommend"); //店铺推荐及热门收藏,默认显示店铺推荐
      const goodsDesctionType = ref("detail"); //商品详情,评价,商品服务,店铺热销,默认显示商品详情
      const goodsCommentsInfo = reactive({ data: {} }); //商品评价信息
      const evaluationType = ref(""); //商品评价类型,默认显示全部
      const recommendedList = reactive({ data: [] }); //店铺推荐列表
      const evaluationCurrent = ref(1); //评价列表默认第一页
      const evaluationPageSize = ref(5); //评价列表默认一页显示5条数据
      const salesCurrent = ref(1); //店铺热销列表默认一页
      const salesPageSize = ref(20); //店铺热销列表默认一页显示20条数据
      const recommendeData = reactive({ data: {} }); //店铺热销推荐数据
      const couponModel = ref(false); //优惠券弹框是否显示
      const cartListData = reactive({ data: store.state.cartListData }); //获取vux的store中的购物车数据
      const loginModalVisibleFlag = ref(false); //登录弹框是否显示，默认不显示
      const container = ref(null); // 商品详情页底部内容区
      const containerTop = ref(0); //商品详情页底部内容区的top值
      const containCon = ref(false); //固定内容区头部
      const fullDiscountModel = ref(false); //满优惠弹框是否显示
      const goodsPictureList = ref(null); //商品图片列表
      const curCouponPage = ref(1); //当前为第一页优惠券
      const couponPageSize = ref(6); //优惠券默认一页显示6条数据
      const wxShareCode = ref(false); //微信分享二维码是否显示
      const parameterShow = ref(false); //规格参数查看是否查看全部，默认为否
      const score = ref(0) //好评率
      const colors = ref(['#E2231A', '#E2231A', '#E2231A'])//星星颜色
      const curAddr = ref(-1);
      const curAddrName = ref('')
      const addrIdx = ref(0)
      const otherAddrIdx = ref(0)
      const othTopIdx = reactive({
        0: 0,
        1: 0,
        2: 0
      })
      const otherTree = ref([addrData[othTopIdx["0"]], addrData[othTopIdx["0"]].children[othTopIdx["1"]]])
      const othAddrDe = ref(addrData)
      const addrDialogVisible = ref(false)
      const logFlag = ref(store.state.loginFlag)
      // 促销活动信息
      const preSellInfo = reactive({ data: {} })
      const pinInfo = reactive({ data: {} })
      const seckillInfo = reactive({ data: {} })
      const ladderInfo = reactive({ data: {} })
      const address_list = reactive({ data: [] });
      const isShowQr = ref(false)
      const secInt = ref('')
      const time = reactive({
        day: '00',
        hours: '00',
        minutes: '00',
        seconds: '00'
      })
      const judgeStock = computed(() => {
        return (goodsDetail.data.defaultProduct.productStock == 0) ||
          (JSON.stringify(preSellInfo.data) != '{}' && preSellInfo.data.presellStock == 0) ||
          (JSON.stringify(pinInfo.data) != '{}' && pinInfo.data.spellStock == 0) ||
          (JSON.stringify(seckillInfo.data) != '{}' && seckillInfo.data.seckillStock == 0)
      })
      // 促销活动信息end



      onMounted(() => {
        getInitDataStatic(route.query.productId);
        productId.value = route.query.productId;
        containerTop.value = offset(container.value).top;
        window.addEventListener("scroll", scrollHandle); //绑定页面滚动事件
        window.addEventListener("click", () => {
          addrDialogVisible.value = false
        })
        if (!logFlag.value) {
          addrIdx.value = 1
        }
      });

      const scrollHandle = async (e) => {
        let elementScrollTop = e.srcElement.scrollingElement.scrollTop; //获取页面滚动高度
        if (document.getElementById('container') && elementScrollTop > document.getElementById('container').offsetTop) {
          containCon.value = true;
          await proxy.$nextTick()
          getCode();
          getBigcode(goodsDetail.data.shareLink, 'top')
        } else {
          containCon.value = false;
        }
      };

      // 点击播放视频
      const playV = () => {
        currentDefaultImage.value = -1
        defaultImage.value = "";
        maskShow.value = false
        videoEnd()
      }



      //获取商品详情数据
      const getInitDataStatic = (proId) => {
        let params = {
          productId: proId,
        };
        proxy.$get("v3/goods/front/goods/details", params).then((res) => {
          if (res.state == 200) {
            let staticData = ['brandId', 'brandName', 'categoryPath', 'categoryIdPath', 'goodsBrief', 'goodsDetails',
              'goodsBrief', 'goodsId', 'goodsName', 'goodsParameterList', 'goodsVideo', 'topTemplateContent',
              'bottomTemplateContent', 'serviceLabels']

            staticData.forEach(item => {
              if (item == 'categoryPath') {
                goodsDetail.data.categoryPath = res.data.categoryPath.split('->')
              } else if (item == 'categoryIdPath') {
                goodsDetail.data.categoryIdPath = [res.data.categoryId1, res.data.categoryId2, res.data.categoryId3]
              } else {
                goodsDetail.data[item] = res.data[item]
              }
            })
            if (goodsDetail.data.topTemplateContent) {
              goodsDetail.data.topTemplateContent = proxy.$quillEscapeToHtml(goodsDetail.data.topTemplateContent);
              //处理背景样式
              if (goodsDetail.data.topTemplateContent.indexOf('<p style="display:none;" data-background="') != -1) {
                let bg = goodsDetail.data.topTemplateContent.split('<p style="display:none;" data-background="')[1].split('">')[0]
                goodsDetail.data.topTemplateContentBg = bg;
              }
            }
            if (goodsDetail.data.goodsDetails) {
              goodsDetail.data.goodsDetails = proxy.$quillEscapeToHtml(goodsDetail.data.goodsDetails);
              //处理背景样式
              if (goodsDetail.data.goodsDetails.indexOf('<p style="display:none;" data-background="') != -1) {
                let bg = goodsDetail.data.goodsDetails.split('<p style="display:none;" data-background="')[1].split('">')[0]
                goodsDetail.data.goodsDetailsBg = bg;
              }
            }
            if (goodsDetail.data.bottomTemplateContent) {
              goodsDetail.data.bottomTemplateContent = proxy.$quillEscapeToHtml(goodsDetail.data.bottomTemplateContent);
              //处理背景样式
              if (goodsDetail.data.bottomTemplateContent.indexOf('<p style="display:none;" data-background="') != -1) {
                let bg = goodsDetail.data.bottomTemplateContent.split('<p style="display:none;" data-background="')[1].split('">')[0]
                goodsDetail.data.bottomTemplateContentBg = bg;
              }
            }
            currentDefaultImage.value = 0;
            vid.value = res.data.storeInf.storeId;
            proxy.$sldStatEvent({ behaviorType: 'gpv', goodsId: goodsDetail.data.goodsId, storeId: vid.value });
          } else {
            ElMessage.error(res.msg);
          }
        }).then(() => {
          getInitDataDynamic(productId.value)
          getRecommend();
          getStorePopular();
          getCouponList();
          getFullDiscountList();
          getEvaluation();
          addLog();
          getAddressList()
        });
      };



      const getInitDataDynamic = (proId, updateType) => {
        let params = {
          productId: proId,
        };
        proxy.$get("v3/goods/front/goods/details2", params).then(res => {
          if (res.state == 200) {
            defaultImage.value = res.data.defaultProduct.goodsPics[0];
            let dynamicData = ['defaultProduct', 'deliverInfo', 'effectSpecValueIds', 'followGoods', 'specs', 'storeInf', 'sales', 'state', 'shareLink', 'shareImage', 'isVirtualGoods']
            dynamicData.forEach((item) => {
              goodsDetail.data[item] = res.data[item]
            })

            if (goodsDetail.data.state != 3) {
              getRecom()
            }
            if (goodsDetail.data.defaultProduct.promotionType == 103) {
              getPreSell(res.data.defaultProduct.productId)
            } else if (goodsDetail.data.defaultProduct.promotionType == 102) {
              getPin()
            } else if (goodsDetail.data.defaultProduct.promotionType == 104) {
              getSeckill()
            } else if (goodsDetail.data.defaultProduct.promotionType == 105) {
              getLadder()
            } else {
              preSellInfo.data = {}
              pinInfo.data = {}
              seckillInfo.data = {}
              ladderInfo.data = {}
            }
            firstLoading.value = false;
          }
        }).then(() => {
          getCode();
          getBigcode(goodsDetail.data.shareLink)
        })
      }

      //视频播放结束时触发
      const videoEnd = () => {
        proxy.$nextTick(() => {
          proxy.$refs.video.onended = () => {
            currentDefaultImage.value = 0;
            defaultImage.value = goodsDetail.data.defaultProduct.goodsPics[0];
          }
        })

      }

      // 促销活动信息
      const getPreSell = (productId) => {
        let param = {
          productId: productId,
          promotionId: goodsDetail.data.defaultProduct.promotionId
        }

        proxy.$get('v3/promotion/front/preSell/detail', param).then(res => {
          if (res.state == 200) {
            let now = new Date()
            let preStartDate = new Date(res.data.startTime)
            let preEndDate = new Date(res.data.endTime)
            preSellInfo.data = res.data;
            let countTime = 0
            preSellInfo.data.endTime = formatPreTime(new Date(res.data.endTime))
            preSellInfo.data.startTime = formatPreTime(new Date(res.data.startTime))
            if (now > preStartDate && now < preEndDate) {
              preSellInfo.data.pre_run = 2 //活动进行中
              countTime = res.data.distanceEndTime
              countDown(countTime)
            } else if (now < preStartDate) {
              preSellInfo.data.pre_run = 1 //活动未开始
              countTime = (new Date(res.data.startTime).getTime() - now.getTime()) / 1000
              countDown(countTime)
            } else if (now > preEndDate) {
              preSellInfo.data.pre_run = 3 //活动已结束
            }

            genQrcode()
          } else {
            ElMessage.error(res.msg)
          }
        })
      }

      const getPin = () => {
        let param = {
          productId: goodsDetail.data.defaultProduct.productId,
          promotionId: goodsDetail.data.defaultProduct.promotionId
        }

        proxy.$get('v3/promotion/front/spell/detail', param).then(res => {
          if (res.state == 200) {
            pinInfo.data = res.data
            let countTime = 0
            let now = new Date()
            let startTime = new Date(res.data.startTime)
            if (now < startTime) {
              countTime = (startTime.getTime() - now.getTime()) / 1000
              countDown(countTime)
            } else {
              countTime = res.data.distanceEndTime
              countDown(countTime)
            }
            genQrcode()
          } else {
            ElMessage.error(res.msg)
          }
        })
      }

      const getSeckill = () => {
        let param = {
          productId: goodsDetail.data.defaultProduct.productId,
          promotionId: goodsDetail.data.defaultProduct.promotionId
        }
        proxy.$get('v3/promotion/front/seckill/detail', param).then(res => {
          if (res.state == 200) {
            seckillInfo.data = res.data
            let now = new Date()
            let countTime = 0
            let startTime = new Date(res.data.startTime)

            if (seckillInfo.data.state == 1 || seckillInfo.data.state == 2) {
              countTime = res.data.distanceEndTime
              countDown(countTime)
            } else {
              countTime = startTime.getTime() - now.getTime()
            }
            genQrcode()
          }
        })
      }

      const countDown = (countTime) => {
        secInt.value = setInterval(() => {
          if (countTime == 0) {
            getInitDataDynamic(route.query.productId);
            clearInterval(secInt.value)
          } else {
            countTime--
            let day = parseInt(countTime / 60 / 60 / 24);
            let hours = parseInt(countTime / 60 / 60 % 24);
            let minutes = parseInt(countTime / 60 % 60);
            let seconds = parseInt(countTime % 60);
            time.day = day
            time.hours = hours > 9 ? hours : '0' + hours;
            time.minutes = minutes > 9 ? minutes : '0' + minutes;
            time.seconds = seconds > 9 ? seconds : '0' + seconds;
          }
        }, 1000)
      }

      const formatPreTime = (time) => {
        let op = new Date(time)
        let year = op.getFullYear()
        let month = op.getMonth() + 1
        let day = op.getDate()
        let hour = op.getHours()
        let minute = op.getMinutes()
        let part1 = [year, month, day].map(i => i.toString().length < 2 ? `0${i}` : i).join('-')
        let part2 = [hour, minute].map(i => i.toString().length < 2 ? `0${i}` : i).join(':')
        return part1 + ' ' + part2
      }

      const sorcRemind = () => {
        let param = {
          stageProductId: seckillInfo.data.stageProductId
        }

        proxy.$post('v3/promotion/front/seckill/isRemind', param).then(res => {
          if (res.state == 200) {
            ElMessage.success(res.msg)
            seckillInfo.data.isRemind = !seckillInfo.data.isRemind
          }
        })
      }

      const getLadder = () => {
        let param = {
          productId: goodsDetail.data.defaultProduct.productId,
          promotionId: goodsDetail.data.defaultProduct.promotionId
        }
        proxy.$get('v3/promotion/front/ladder/group/detail', param).then(res => {
          if (res.state == 200) {
            ladderInfo.data = res.data
            let now = new Date()
            let countTime = 0
            let startTime = new Date(res.data.startTime)
            if (now < startTime) {
              countTime = (startTime.getTime() - now.getTime()) / 1000
              countDown(countTime)
              ladderInfo.data.state = 1
            } else {
              countTime = res.data.distanceEndTime
              countDown(countTime)
              ladderInfo.data.state = 2
            }
            genQrcode()
          }
        })
      }

      const genQrcode = () => {

        if (judgeStock.value) {
          return
        }
        proxy.$nextTick(() => {
          let canvas = qrcanvas({
            data: goodsDetail.data.shareLink, //二维码内容
            size: 125,
            colorDark: "red",
          });
          setTimeout(() => {
            document.getElementById("qrcodeAct").innerHTML = "";
            document.getElementById("qrcodeAct").appendChild(canvas);
          }, 10)
        });
      }

      // 促销活动信息end



      const recomOffShop = reactive({ data: [] })
      const getRecom = () => {
        proxy.$get('v3/goods/front/goods/goodsList', { storeId: goodsDetail.data.categoryId1 }).then(res => {

          if (res.state == 200) {
            let top = Math.floor(Math.random() * (res.data.list.length - 8)) + 8
            let end = top - 8
            recomOffShop.data = res.data.list.filter(item => item.defaultProductId != goodsDetail.data.defaultProduct.productId).slice(end, top)
          }
        })
      }

      //添加足迹
      const addLog = () => {
        let params = {
          productId: productId.value,
        };
        proxy.$post("v3/member/front/productLookLog/add", params).then((res) => {
          if (res.state == 200) {
            console.log();
          }
        });
      };
      //跳转去商品详情页
      const goGoodsDetail = (productId) => {
        proxy.$goGoodsDetail(productId);
      };

      //获取二维码
      const getCode = () => {
        proxy.$nextTick(() => {
          let canvas = qrcanvas({
            data: "下单", //二维码内容
            size: 20,
            colorDark: "red",
          });
          if (document.getElementById("qrcode")) {
            document.getElementById("qrcode").innerHTML = "";
            document.getElementById("qrcode").appendChild(canvas);
          }
          if (document.getElementById("qrcode1")) {
            document.getElementById("qrcode1").innerHTML = "";
            document.getElementById("qrcode1").appendChild(canvas);
          }

        });
      };

      //获取商品的shareLink二维码
      const getBigcode = (link, type) => {
        proxy.$nextTick(() => {
          let canvas = qrcanvas({
            data: link, //二维码内容
            size: 125,
            colorDark: "red",
          });
          if (type == 'top') {
            if (document.getElementById("qrcodeBig1")) {
              document.getElementById("qrcodeBig1").innerHTML = "";
              document.getElementById("qrcodeBig1").appendChild(canvas);
            }
          } else {
            if (document.getElementById("qrcodeBig")) {
              document.getElementById("qrcodeBig").innerHTML = "";
              document.getElementById("qrcodeBig").appendChild(canvas);
            }

          }


        });
      }

      //获取店铺优惠券列表
      const getCouponList = () => {
        let params = {
          storeId: vid.value,
          current: curCouponPage.value,
          pageSize: couponPageSize.value,
        };
        proxy.$get("v3/promotion/front/coupon/storeCouponList", params).then((res) => {
          if (res.state == 200) {
            let result = res.data;
            couponList.data = result;
          }
        });
      };

      //获取满优惠促销列表
      const getFullDiscountList = () => {
        let params = {
          productId: productId.value,
        };
        proxy.$get("v3/goods/front/goods/activityList", params).then((res) => {
          if (res.state == 200) {
            let result = res.data;
            res.data.map((item, i) => {
              item.descriptionList = item.descriptionList.map(i => i.replace(/<(.+?)>/g, function (num) { return "<text style='color:red'>" + num.slice(1, num.length - 1) + "</text>" }))
              item.descriptionList = item.descriptionList.map(i => i.replace(/x[\d]/g, function (num) { return "<text style='color:red'>" + num + "</text>" }))
            })
            fullDisList.data = result;
          }
        });
      };
      //查看满优惠
      const lookFullDiscount = () => {
        fullDiscountModel.value = true;
      };

      /**
       * 选择规格值
       * @param type:类型  值:choice,规格选择  default:默认
       * @param specId:父级规格值
       * @param specValueId:点击的当前的规格值
       */
      const selectSpecVal = (type, specId, specValueId) => {
        isChoice.value = type == "choice" ? "choice" : "default";
        let curParSpec = []; //当前点击的规格的父级id的当前项
        curParSpec = goodsDetail.data.specs.filter(
          (item) => item.specId == specId
        );
        let curSPec = []; //当前点击的规格的规格id的当前项
        curSPec = curParSpec[0].specValueList.filter(
          (item1) => item1.specValueId == specValueId
        );
        curSPec[0].checkState = 1;
        //被选择的规格值的id
        let choiceSpecIds = [];
        goodsDetail.data.specs.forEach((item) => {
          if (item.specId != specId) {
            item.specValueList.forEach((item1) => {
              if (item1.checkState == "1") {
                // checkState: 1-选中，2-可选，3-禁用
                choiceSpecIds.push(item1.specValueId);
              }
            });
          } else {
            choiceSpecIds.push(specValueId);
          }
        });
        let params = {
          goodsId: goodsDetail.data.goodsId,
          specValueIds: choiceSpecIds.join(","),
        };
        proxy.$get("v3/goods/front/goods/productInfo", params).then((res) => {
          if (res.state == 200) {
            let result = res.data;
            goodsDetail.data.defaultProduct = result.defaultProduct;
            productId.value = result.defaultProduct.productId;
            goodsDetail.data.specs = result.specs;
            defaultImage.value = goodsDetail.data.defaultProduct.goodsPics[0];
            currentDefaultImage.value = 0;
            isShowQr.value = false
            // getInitDataDynamic(productId.value)
          }
        });
      };

      //商品数量的编辑
      const editNum = (type, e) => {
        let productStock = goodsDetail.data.defaultProduct.productStock
        if (goodsDetail.data.defaultProduct.productStock == 0) {
          productStock = 999
        }
        if (type == "add") {
          if (currentSpecNum.value >= productStock) {
            currentSpecNum.value = productStock;
          } else {
            currentSpecNum.value++;
            if (currentSpecNum.value > 999) {
              ElMessage(L["超过购买限制!"]);
              currentSpecNum.value = 999;
            }
          }
        } else if (type == "edit") {
          if (currentSpecNum.value > 999) {
            ElMessage(L["超过购买限制!"]);
            currentSpecNum.value = 999;
          }
        } else if (type == "blur") {
          if (currentSpecNum.value >= productStock) {
            currentSpecNum.value = productStock;
          } else {
            currentSpecNum.value = e.currentTarget.value;
            if (currentSpecNum.value <= 0) {
              currentSpecNum.value = 1;
            } else {
              currentSpecNum.value = currentSpecNum.value.replace(/\D/g, "");
              if (currentSpecNum.value > 999) {
                currentSpecNum.value = 999;
              }
            }
          }
        } else if (type == "reduce") {
          if (currentSpecNum.value > 1) {
            currentSpecNum.value--;
          } else {
            currentSpecNum.value = 1;
          }
        }
      };


      //改变数量按钮样式
      const disStyle = reactive({//目的是进入商品详情页面就让减按钮呈现禁止状态
        color: "#DDDDDD",
        backgroundColor: "#F8F8F8"
      })
      watch(() => currentSpecNum.value, () => {//监听数量对加和减的样式做出调整
        let productStock = goodsDetail.data.defaultProduct.productStock
        if (goodsDetail.data.defaultProduct.productStock == 0) {
          productStock = 999
        }

        if (currentSpecNum.value >= productStock) {
          proxy.$refs.add.style.color = "#DDDDDD";
          proxy.$refs.add.style.backgroundColor = "#F8F8F8"
        } else if (currentSpecNum.value <= 1) {
          disStyle.color = "#DDDDDD"
          disStyle.backgroundColor = "#F8F8F8"
        } else {
          disStyle.color = ""
          disStyle.backgroundColor = ""
          proxy.$refs.add.style.color = "";
          proxy.$refs.add.style.backgroundColor = ""
        }
      })

      watch(currentSpecNum, () => {
        if (currentSpecNum.value > goodsDetail.data.defaultProduct.productStock) {
          currentSpecNum.value = goodsDetail.data.defaultProduct.productStock
        }
        let reg = /\./g
        let reg0 = /0+\d/

        if (currentSpecNum.value && (reg.test(currentSpecNum.value) || currentSpecNum.value <= 0)) {
          currentSpecNum.value = 1
        }
      })

      //加入购物车
      const addCart = () => {
        if (store.state.loginFlag) {
          let paramsData = {
            productId: productId.value,
            number: currentSpecNum.value,
          };
          proxy.$addCart(paramsData);
        } else {
          let paramsData = {
            goodsDetailData: goodsDetail.data,
            number: currentSpecNum.value,
            cartListData: cartListData.data,
            goodsId: goodsDetail.data.goodsId,
            storeId: vid.value
          };

          proxy.$addCart(paramsData);
        }
      };
      //立即购买
      const goBuy = () => {
        if (store.state.loginFlag) {

          let query = {
            orderType: 1,
            goodsId: goodsDetail.data.goodsId,
            productId: goodsDetail.data.defaultProduct.productId,
            numbers: currentSpecNum.value,
            ifcart: false,
          }

          if (goodsDetail.data.defaultProduct.promotionType == 102) {
            query.isAloneBuy = true
          }

          router.push({
            path: "/buy/confirm",
            query,
          });
          localStorage.setItem('addressId', curAddr.value)
        } else {
          //未登录提示登录
          loginModalVisibleFlag.value = true;
        }
      };
      //关闭登录弹框
      const closeLoingModal = () => {
        loginModalVisibleFlag.value = false;
      };

      //获取看了又看商品(人气数)
      const getRecommend = () => {
        let params = {
          storeId: vid.value,
          sort: 5,
          pageSize: 3,
          current: 1,
        };
        proxy.$get("v3/goods/front/goods/goodsList", params).then((res) => {
          if (res.state == 200) {
            let result = res.data;
            recommendeList.data = result.list;
            recommendeList.data.map(item => item.goodsPrice = new Number(item.goodsPrice).toFixed(2))
          } else {
            ElMessage.error(res.msg);
          }
        });
      };

      //获取店铺推荐的商品(销量数);获取热门收藏的商品(收藏数)  type:recommend销量数  collection:收藏数
      const getStorePopular = (type) => {
        if (type == "" || !type) {
          type = "recommend";
        } else {
          storePopularType.value = type;
        }
        let params = {
          storeId: vid.value,
          sort:
            storePopularType.value == "recommend"
              ? 1
              : storePopularType.value == "collection"
                ? 6
                : "",
          pageSize: 6,
          current: 1,
        };
        proxy.$get("v3/goods/front/goods/goodsList", params).then((res) => {
          if (res.state == 200) {
            let result = res.data;
            storePopularList.data = result.list;
            storePopularList.data.map(item => item.goodsPrice = new Number(item.goodsPrice).toFixed(2))
          } else {
            ElMessage.error(res.msg);
          }
        });
      };

      //切换商品详情,评价,服务,热销
      const goodsDescType = (type) => {
        let elementScrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop; //获取页面滚动高度
        if (elementScrollTop > containerTop.value + 33 + 48) {
          window.scrollTo({
            top: containerTop.value,
            behavior: 'smooth'
          })
        }

        if (type == "" || !type) {
          goodsDesctionType.value = "detail";
        } else {
          goodsDesctionType.value = type;
        }
        if (type == "salestore") {
          getSalestore();
        }
      };

      //获取商品评价
      const getEvaluation = (type) => {
        if (!type) {
          evaluationType.value = "";
        } else {
          evaluationType.value = type;
        }
        let params = {
          productId: productId.value,
          current: evaluationCurrent.value,
          pageSize: evaluationPageSize.value,
          type: evaluationType.value,
        };
        proxy.$get("v3/goods/front/goods/comment", params).then((res) => {
          if (res.state == 200) {
            let result = res.data;
            goodsCommentsInfo.data = result;
            score.value = Number(goodsCommentsInfo.data.avgScore)
            goodsCommentsInfo.data && goodsCommentsInfo.data.list && goodsCommentsInfo.data.list.length > 0 && goodsCommentsInfo.data.list.map((commentsItem) => {
              commentsItem.memberName = commentsItem.memberName.slice(0, 1) + '***' + commentsItem.memberName.slice(commentsItem.memberName.length - 1, commentsItem.memberName.length);
            })
          } else {
            ElMessage.error(res.msg);
          }
        });
      };
      //评价列表上一页
      const handlePrevCilickChange = () => {
        if (evaluationCurrent.value == 1) {
          evaluationCurrent.value = 1;
        } else {
          evaluationCurrent.value--;
        }
        getEvaluation(evaluationType.value);
      };
      //评价列表下一页
      const handleNextCilickChange = () => {
        if (evaluationCurrent.value >= goodsCommentsInfo.data.list.length) {
          evaluationCurrent.value = goodsCommentsInfo.data.list.length;
        } else {
          evaluationCurrent.value++;
        }
        getEvaluation(evaluationType.value);
      };
      //评价列表当前选择页
      const handleCurrentChange = (val) => {
        evaluationCurrent.value = val;
        getEvaluation(evaluationType.value);
      };
      //获取热销店铺推荐
      const getSalestore = () => {
        let params = {
          storeId: goodsDetail.data.storeInf.storeId,
          sort: 7,
          pageSize: salesPageSize.value,
          current: salesCurrent.value,
        };
        proxy.$get("v3/goods/front/goods/goodsList", params).then((res) => {
          if (res.state == 200) {
            let result = res.data;
            recommendeData.data = result;
            recommendedList.data = result.list;
            recommendedList.data.map(item => item.goodsPrice = new Number(item.goodsPrice).toFixed(2))
          } else {
            ElMessage.error(res.msg);
          }
        });
      };
      //店铺热销列表上一页
      const handlePrevCilickChangeSales = () => {
        if (evaluationCurrent.value == 1) {
          salesCurrent.value = 1;
        } else {
          salesCurrent.value--;
        }
        getSalestore();
      };
      //店铺热销列表下一页
      const handleNextCilickChangeSales = () => {
        if (salesCurrent.value >= goodsCommentsInfo.data.list.length) {
          salesCurrent.value = goodsCommentsInfo.data.list.length;
        } else {
          salesCurrent.value++;
        }
        getSalestore();
      };
      //店铺热销列表当前选择页
      const handleCurrentChangeSales = (val) => {
        salesCurrent.value = val;
        getSalestore();
      };
      //关注店铺及取消关注
      const focusStore = () => {
        if (store.state.loginFlag) {
          //已登录
          let params = {
            storeIds: goodsDetail.data.storeInf.storeId,
            isCollect: !goodsDetail.data.storeInf.isFollowStore,
          };
          proxy.$post("v3/member/front/followStore/edit", params).then((res) => {
            if (res.state == 200) {
              goodsDetail.data.storeInf.isFollowStore = !goodsDetail.data.storeInf.isFollowStore;
              proxy.$refs.headercat.storeData.info.isFollow = goodsDetail.data.storeInf.isFollowStore ? "true" : "false";
              if (goodsDetail.data.storeInf.isFollowStore) {
                proxy.$sldStatEvent({ behaviorType: 'fol', storeId: goodsDetail.data.storeInf.storeId });
              }
            }
          });
        } else {
          //未登录提示登录
          loginModalVisibleFlag.value = true;
        }
      };
      //商品收藏及取消收藏
      const collectGoods = () => {
        if (store.state.loginFlag) {
          //已登录
          let params = {
            productIds: productId.value,
            isCollect: !goodsDetail.data.followGoods,
          };
          proxy
            .$post("v3/member/front/followProduct/edit", params)
            .then((res) => {
              if (res.state == 200) {
                goodsDetail.data.followGoods = !goodsDetail.data.followGoods;
                if (goodsDetail.data.followGoods) {
                  proxy.$sldStatEvent({ behaviorType: 'fav', goodsId: goodsDetail.data.goodsId, storeId: goodsDetail.data.storeInf.storeId })
                }
              } else {
                ElMessage.error(res.msg);
              }
            });
        } else {
          //未登录提示登录
          loginModalVisibleFlag.value = true;
        }
      };

      //打开优惠券弹框
      const openCouponModel = () => {
        couponModel.value = true;
        getCouponList();
      };
      //上一页优惠券
      const handlePrevCilickChangeCoupon = () => {
        curCouponPage.value--;
        getCouponList();
      };
      //下一页优惠券
      const handleNextCilickChangeCoupon = () => {
        curCouponPage.value++;
        getCouponList();
      };
      //当前页数优惠券
      const handleCurrentChangeCoupon = () => {
        getCouponList();
      };
      //点击查看全部查看全部的商品规格参数
      const openParameter = () => {
        parameterShow.value = !parameterShow.value;
      };

      //选择商品主图
      const selectDefaultImage = (goodsImgItem, goodsImgIndex) => {
        defaultImage.value = goodsImgItem;
        currentDefaultImage.value = goodsImgIndex;
      };

      //切换商品主图
      const switchDefaultImage = (type) => {
        let defaultImagelength = goodsDetail.data.defaultProduct.goodsPics.length;
        if (type == "left") {
          currentDefaultImage.value--;
          if (currentDefaultImage.value <= 0) {
            currentDefaultImage.value = 0;
          }
          defaultImage.value =
            goodsDetail.data.defaultProduct.goodsPics[currentDefaultImage.value];
        } else {
          currentDefaultImage.value++;
          if (currentDefaultImage.value >= defaultImagelength) {
            currentDefaultImage.value = defaultImagelength - 1;
          }
          defaultImage.value =
            goodsDetail.data.defaultProduct.goodsPics[currentDefaultImage.value];
        }
        goodsPictureListsLeft();
      };
      //图片列表的left移动的距离
      const goodsPictureListsLeft = () => {
        //获取 goods_picture_list 的元素
        let goodsPictureLists = goodsPictureList.value;
        //列表默认显示5张图片
        if (
          goodsDetail.data.defaultProduct.goodsPics.length > 5 &&
          currentDefaultImage.value >= 0
        ) {
          /* 分析找规律：
            如果有8张图片，点击右键 最大可以向左移动的距离为 8 - 5既3张图，left移动的距离为 3 * - 66px; currentDefaultImage.value从0开始的
            其中：66px为每一个元素需要每次移动的距离 为图片的宽度与图片之间的间距的和
            currentDefaultImage.value == 4；goodsPictureLists.style.left = 0；
            currentDefaultImage.value == 5；goodsPictureLists.style.left = (5-4) (1) * -66px；
            currentDefaultImage.value == 6；goodsPictureLists.style.left = (5-2) (2) * -66px；
            currentDefaultImage.value == 7；goodsPictureLists.style.left = (5-3) (2) * -66px；
             点击左键，最大可以向右移动的距离为 8 - 5 即3张
             currentDefaultImage.value == 0；goodsPictureLists.style.left = 0；
             currentDefaultImage.value == 1； goodsPictureLists.style.left = -66px；
             currentDefaultImage.value == 2; goodsPictureLists.style.left = 2 * -66px；
             currentDefaultImage.value == 3; goodsPictureLists.style.left = 3 * -66px；
          */
          if (currentDefaultImage.value > 4) {
            goodsPictureLists.style.left =
              (currentDefaultImage.value - 4) * -66 + "px";
          }
          if (
            currentDefaultImage.value <
            goodsDetail.data.defaultProduct.goodsPics.length - 4
          ) {
            goodsPictureLists.style.left = currentDefaultImage.value * -66 + "px";
          }
        }
      };

      //获取元素距离父元素的顶部及左边的距离
      const offset = (el) => {
        let top = el.offsetTop;
        let left = el.offsetLeft;
        if (el.offsetParent) {
          el = el.offsetParent;
          top += el.offsetTop;
          left += el.offsetLeft;
        }
        return {
          left: left,
          top: top,
        };
      };

      //鼠标移动
      const move = (e) => {

        if (currentDefaultImage.value == -1) {
          return
        }

        //主图父元素的信息 宽，高
        let previewsBox = previewBox.value;
        let previewBoxWidth = previewsBox.offsetWidth;
        let previewBoxHeight = previewsBox.offsetHeight;
        //主图父元素距离顶部的距离
        let previewsBoxLeft = offset(previewsBox).left;
        let previewsBoxTop = offset(previewsBox).top;

        // 遮罩盒子的信息宽，高
        let masksBox = maskBox.value;
        let maskBoxWidth = masksBox.offsetWidth;
        let maskBoxHeight = masksBox.offsetHeight;
        //鼠标距离屏幕距离
        let moveX = e.clientX;
        let moveY = e.clientY;

        //获取左侧大图父元素的信息
        let zoomsBox = zoomBox.value;
        let zoomBoxWidth = zoomsBox.offsetWidth;
        let zoomBoxHeight = zoomsBox.offsetHeight;

        // 获取大图元素的信息宽，高
        let pictureBigBox = pictureBig.value;
        let pictureBigWidth = pictureBigBox.offsetWidth;
        let pictureBigHeight = pictureBigBox.offsetHeight;

        //获取滚动条的高度
        let scroll =
          document.documentElement.scrollTop || document.body.scrollTop;

        //主图距离父元素的left及top值
        let left = moveX - previewsBoxLeft - maskBoxWidth / 2;
        let top;
        if (scroll > 0) {
          top = moveY - previewsBoxTop + scroll - maskBoxHeight / 2;
        } else {
          top = moveY - previewsBoxTop - maskBoxHeight / 2;
        }

        //移动限制最大宽度，及最大高度
        let maxWidth = previewBoxWidth - maskBoxWidth;
        let maxHeight = previewBoxHeight - maskBoxHeight;

        left = left < 0 ? 0 : left > maxWidth ? maxWidth : left;
        top = top < 0 ? 0 : top > maxHeight ? maxHeight : top;

        //比列
        let parcentX = left / maxWidth;
        let parcentY = top / maxHeight;

        //遮罩层的定位值
        maskBox.value.style.left = left + "px";
        maskBox.value.style.top = top + "px";

        //大图元素的定位值
        pictureBig.value.style.left =
          parcentX * (zoomBoxWidth - pictureBigWidth) + "px";
        pictureBig.value.style.top =
          parcentY * (zoomBoxHeight - pictureBigHeight) + "px";
        pictureBig.value.style.width =
          (previewBoxWidth / maskBoxWidth) * zoomBoxWidth + "px";
        pictureBig.value.style.height =
          (previewBoxHeight / maskBoxHeight) * zoomBoxHeight + "px";
      };
      //鼠标移出
      const out = () => {
        maskShow.value = false;
      };

      //鼠标移入
      const enter = () => {
        if (currentDefaultImage.value == -1) {
          return
        }
        addrDialogVisible.value = false
        maskShow.value = true;
      };

      const kefu = () => {

        if (store.state.loginFlag) {
          let chatInfo = {
            storeId: goodsDetail.data.storeInf.storeId,
            vendorAvatar: goodsDetail.data.storeInf.storeLogo,
            storeName: goodsDetail.data.storeInf.storeName,
            source: '从商品详情页进入',
            sourceType: 'goods',
            showData: {
              productId: goodsDetail.data.defaultProduct.productId,
              goodsName: goodsDetail.data.goodsName,
              goodsImage: goodsDetail.data.shareImage,
              productPrice: goodsDetail.data.defaultProduct.productPrice,
              goodsId: goodsDetail.data.goodsId
            }
          }
          store.commit('saveChatBaseInfo', chatInfo)

          let newWin = router.resolve({
            path: '/service',
            query: {
              vid: goodsDetail.data.storeInf.storeId
            }
          })

          window.open(newWin.href, "_blank")
        } else {
          //未登录提示登录
          loginModalVisibleFlag.value = true;
        }
      };

      //进入店铺
      const goStore = () => {
        let tarUrl = router.resolve({
          path: "/store/index",
          query: {
            vid: vid.value,
          },
        });
        window.open(tarUrl.href, "_blank");
      };

      // 评论区查看图片
      const showImg = (index, img) => {
        imgSource.value = img
        imgIndex.value = index
        imgVisible.value = true
      }

      //分享
      const share = (type) => {
        let title = goodsDetail.data.goodsName; //需要分享的标题,这里取商品名字
        let url = goodsDetail.data.shareLink; //分享的地址，用户点击可以进入到该商品
        let content = goodsDetail.data.goodsBrief; //自定义内容,这里取商品广告词
        let targetUrl = ""; //跳转的url地址
        if (type == "weixin") {
          wxShareCode.value = true;
          //微信
          let canvas = qrcanvas({
            data: url, //二维码内容
            size: 100,
            colorDark: "red",
          });
          let share_wx_qrcode = document.getElementById("share_wx_qrcode");
          if (wxShareCode.value && share_wx_qrcode != null && share_wx_qrcode != undefined) {
            document.getElementById("share_wx_qrcode").innerHTML = "";
            document.getElementById("share_wx_qrcode").appendChild(canvas);
          }
        } else if (type == "qzone") {
          wxShareCode.value = false;
          //QQ空间
          targetUrl =
            "https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?title=" +
            encodeURIComponent(title) +
            "&desc=" +
            encodeURIComponent(content) +
            "&summary=" +
            encodeURIComponent(content) +
            "&url=" +
            encodeURIComponent(url);
          window.open(targetUrl, "_blank");
        } else if (type == "sina") {
          wxShareCode.value = false;
          //新浪微博
          targetUrl =
            "https://service.weibo.com/share/share.php?title=" +
            encodeURIComponent(content + "「" + title + "」" + " 点这里" + url);
          window.open(targetUrl, "_blank");
        }
      };

      //获取地址列表
      const getAddressList = () => {
        proxy.$get("v3/member/front/memberAddress/list", {
          pageSize: 1000
        }).then(res => {
          if (res.state == 200) {
            if (res.data.list.length > 0) {
              address_list.data = res.data.list;
              if (address_list.data.findIndex(i => i.isDefault == 1) > 0) {
                let index = address_list.data.findIndex(i => i.isDefault == 1)
                curAddrName.value = address_list.data[index].addressAll + "" + address_list.data[index].detailAddress
                curAddr.value = address_list.data[index].addressId
              } else {
                curAddrName.value = address_list.data[0].addressAll + "" + address_list.data[0].detailAddress
                curAddr.value = address_list.data[0].addressId
              }

              if (localStorage.getItem('addressId')) {
                let addressID = localStorage.getItem('addressId')
                if (res.data.list.filter(i => i.addressId == addressID)[0]) {
                  let tmp = res.data.list.filter(i => i.addressId == addressID)[0]
                  curAddr.value = tmp.addressId
                  curAddrName.value = tmp.addressAll + "" + tmp.detailAddress
                }

              }
            } else {
              curAddrName.value = ''
              addrIdx.value = 1
            }
          }
        })
      };

      //修改选择地址列表
      const changeAddr = (e) => {
        curAddr.value = e;
        let tmp = address_list.data.filter(i => i.addressId == e)[0]
        curAddrName.value = tmp.addressAll + "" + tmp.detailAddress
        addrDialogVisible.value = false
        let cityCode = tmp.cityCode
        let addressId = tmp.addressId
        getUserEx(cityCode, addressId)
      };

      // 选择其他地址的顶部选项
      const selRegion = (index) => {
        otherAddrIdx.value = index
        switch (index) {
          case 0: {
            othAddrDe.value = addrData
            break
          }
          case 1: {
            othAddrDe.value = addrData[othTopIdx["0"]].children
            break
          }
          case 2: {
            othAddrDe.value = addrData[othTopIdx["0"]].children[othTopIdx["1"]].children
            break
          }
        }
        otherTree.value[otherAddrIdx.value] = othAddrDe.value[othTopIdx[otherAddrIdx.value]]
      }

      // 选择其他地址的顶部选项下的子选项
      const selRegionChild = (index, otherIdx) => {
        othTopIdx[otherIdx] = index
        otherTree.value[otherAddrIdx.value] = othAddrDe.value[othTopIdx[otherIdx]]
        if (othAddrDe.value[othTopIdx[otherAddrIdx.value]].children && othAddrDe.value[othTopIdx[otherAddrIdx.value]].children.length) {
          otherTree.value.splice(otherAddrIdx.value + 1)
          othTopIdx[otherIdx + 1] = 0
          selRegion(otherAddrIdx.value + 1)
        } else {
          let regionCode = otherTree.value[otherAddrIdx.value - 1].regionCode
          addrDialogVisible.value = false
          curAddrName.value = ''
          otherTree.value.map(i => {
            curAddrName.value += i.regionName
          })
          getUserEx(regionCode)
        }
      }

      //用于切换用户的地址，获取信运费等
      const getUserEx = (cityCode, addressId) => {
        proxy.$get('v3/goods/front/goods/calculateExpress', {
          cityCode,
          productId: productId.value
        }).then(res => {
          if (res.state == 200) {
            goodsDetail.data.deliverInfo.expressFee = res.data.toFixed(2)
          }
        })
        if (addressId >= 0) {
          proxy.$post("v3/member/front/memberAddress/changeDefaultAddress", {
            addressId,
            isDefault: 1
          }).then(() => { }).catch(() => { });
        }
      };

      const refreshInfo = () => {
        history.go(0)
      };

      const updateFllow = (e) => {
        goodsDetail.data.storeInf.isFollowStore = e.state == 'true' ? true : false;
      };

      //暴露的变量及方法
      return {
        L,
        productId,
        goodsDetail,
        isChoice,
        fullDisList,
        pictureBig,
        maskBox,
        previewBox,
        zoomBox,
        maskShow,
        defaultImage,
        selectSpecVal,
        move,
        out,
        enter,
        getFullDiscountList,
        selectDefaultImage,
        switchDefaultImage,
        currentDefaultImage,
        couponList,
        currentSpecNum,
        editNum,
        addCart,
        goBuy,
        recommendeList,
        getStorePopular,
        storePopularList,
        storePopularType,
        goodsDesctionType,
        goodsDescType,
        goodsCommentsInfo,
        evaluationType,
        getEvaluation,
        recommendedList,
        evaluationCurrent,
        evaluationPageSize,
        handlePrevCilickChange,
        handleNextCilickChange,
        handleCurrentChange,
        salesPageSize,
        salesCurrent,
        handlePrevCilickChangeSales,
        handleNextCilickChangeSales,
        handleCurrentChangeSales,
        focusStore,
        collectGoods,
        goGoodsDetail,
        vid,
        recommendeData,
        openCouponModel,
        couponModel,
        cartListData,
        loginModalVisibleFlag,
        closeLoingModal,
        firstLoading,
        container,
        containerTop,
        containCon,
        kefu,
        lookFullDiscount,
        fullDiscountModel,
        goStore,
        goodsPictureList,
        handlePrevCilickChangeCoupon,
        handleNextCilickChangeCoupon,
        handleCurrentChangeCoupon,
        curCouponPage,
        couponPageSize,
        share,
        wxShareCode,
        openParameter,
        parameterShow,
        disStyle,
        score,
        colors,
        imgVisible,
        showImg,
        imgSource,
        recomOffShop,
        preSellInfo,
        pinInfo,
        seckillInfo,
        time,
        sorcRemind,
        ladderInfo,
        genQrcode,
        isShowQr,
        judgeStock,
        playV,
        address_list,
        curAddr,
        changeAddr,
        curAddrName,
        addrIdx,
        addrData,
        otherAddrIdx,
        otherTree,
        othAddrDe,
        othTopIdx,
        selRegion,
        selRegionChild,
        addrDialogVisible,
        logFlag,
        refreshInfo,
        updateFllow
      };
    },
  };
</script>

<style lang="scss">
  @import "../../style/base.scss";
  @import "../../style/iconfont.css";
  @import "../../style/goodsDetail.scss";

  .popular_list_empty {
    height: 95px;

    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #666666;
  }

  .imageBorder {
    border: 1px solid #eee;
  }

  .goods_picture_big {
    border: 1px solid #eee;
  }

  .el-radio__inner:hover {
    border-color: $colorMain;
  }

  .el-radio__input.is-checked .el-radio__inner {
    border-color: $colorMain;
    background: $colorMain;
  }

  .el-radio__input.is-checked+.el-radio__label {
    color: $colorMain;
  }

  .el-radio {
    margin-bottom: 10px;
    display: flex;
    align-items: flex-start;
    white-space: unset;
    margin-right: unset
  }

  .el-radio-button__inner,
  .el-radio-group {
    /* display: block; */
    line-height: 1;
    vertical-align: middle;
  }

  .el-radio__label {
    font-size: 13px;
    width: 320px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-all;
    line-height: 22px;
    margin-top: -5px;
  }

  .evaluationes {
    color: #3b4 !important;
  }

  .sld_goods_detail .goods_htmls .ql-video {
    width: 525px;
    height: 315px;
  }

  .sld_goods_detail .goods_htmls a {
    display: inline-block;
    margin: 5px auto;
    color: #0000FF;
    text-decoration: underline;
  }

  .sld_goods_detail .goods_htmls table {
    border-collapse: collapse;
    padding: 0;
  }
  .sld_goods_detail .goods_htmls td,
  .sld_goods_detail .goods_htmls th {
    border: 1px solid #DDD;
    padding: 5px 10px;
  }

  .sld_goods_detail .goods_htmls ol li,
  .sld_goods_detail .goods_htmls ul li {
    list-style: unset;
  }

  .sld_goods_detail {
    .summary {
      .coupon {
        .el-dialog__header {
          padding-top: 18px;
          padding-bottom: 18px;

          .el-dialog__title {
            color: #333333;
            font-family: Microsoft YaHei;
            font-weight: bold;
          }

          .el-dialog__close {
            color: #333333;
            font-size: 20px;
          }
        }

        .el-dialog__body {
          background: #f8f8f8;
        }
      }
    }
  }
</style>