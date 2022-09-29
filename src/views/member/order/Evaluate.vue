<!--
 * @Author: wangwei
 * @Date: 2021-01-04 14:37:27
 * @LastEditTime: 2021-01-13 14:05:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /java-pc/src/views/member/order/Evaluate.vue
-->
<template>
  <div class="sld_order_evaluate">
    <div class="title">
      <p>评价订单</p>
      <div class="order_info">
        <span class="order_sn">订单：{{order_info.data.orderSn}}</span>
        <span class="time">{{order_info.data.createTime}}</span>
      </div>
    </div>
    <div class="store_item" v-for="(storeItem,index) in order_info.data.childOrdersVOS" :key="index">
      <div class="store_info flex_row_start_center">
        <div class="store_info_left flex_row_start_center">
          <div class="image">
            <img :src="store_info.data.storeLogoUrl" alt />
          </div>
          <div class="rate">
            <span class="store_name">{{store_info.data.storeName}}</span>
            <div class="con flex_row_between_center">
              <div class="flex_column_center_center">
                <span>综合</span>
                <span>{{store_info.data.comprehensiveScore}}</span>
              </div>
              <div class="flex_column_center_center">
                <span>商品</span>
                <span>{{store_info.data.descriptionScore}}</span>
              </div>
              <div class="flex_column_center_center">
                <span>服务</span>
                <span>{{store_info.data.serviceScore}}</span>
              </div>
              <div class="flex_column_center_center">
                <span>物流</span>
                <span>{{store_info.data.deliverScore}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="store_info_right flex">
          <div class="item">
            <span>描述相符</span>
            <div @mouseover="handleRate($event,'description',storeItem)">
              <el-rate v-model="storeItem.description"></el-rate>
            </div>
          </div>
          <div class="item">
            <span>服务态度</span>
            <div @mouseover="handleRate($event,'serviceAttitude',storeItem)">
              <el-rate v-model="storeItem.serviceAttitude"></el-rate>
            </div>
          </div>
          <div class="item">
            <span>发货速度</span>
            <div @mouseover="handleRate($event,'expressSpeed',storeItem)">
              <el-rate v-model="storeItem.expressSpeed"></el-rate>
            </div>
          </div>
        </div>
      </div>
      <div v-for="(goodItem,index) in storeItem.orderProductListVOList" :key="index"
        class="shop_info flex_row_start_center">
        <div class="good_info flex_column_center_center">
          <div class="image flex_row_center_center">
            <!-- <img :src="goodItem.productImage" alt /> -->
            <div class="imageBack" :style="{backgroundImage:'url('+goodItem.productImage+')'}"></div>
          </div>
          <div class="name">{{goodItem.goodsName}}</div>
          <div class="name">{{goodItem.specValues}}</div>
          <span class="price">¥{{goodItem.productShowPrice}}</span>
        </div>
        <div class="right">
          <div class="shop_rate flex_row_start_center">
            <span class="text">商品评分</span>
            <div @mouseover="handleRate($event,'score',goodItem)">
              <el-rate v-model="goodItem.score"></el-rate>
            </div>
          </div>
          <div class="remark">
            <p>评价晒单</p>
            <el-input class="textarea" rows="5" resize="none" size="medium" type="textarea" placeholder="请输入内容"
              v-model="goodItem.content" maxlength='200'></el-input>
          </div>
          <div class="picture">
            <p>晒图</p>
            <div class="picture_wrap">
              <ul class="picture_list">
                <li class="picture_item" v-for="(img,imgIdx) in goodItem.imgShowList" :key="imgIdx">
                  <span class="close_icon"><img src="@/assets/order/close.png" alt=""
                      @click="delImg(goodItem,imgIdx)"></span>
                  <!-- <img :src="img" alt="" class="img_item"> -->
                  <div class="img_item" :style="{backgroundImage: 'url(' + img + ')'}"></div>
                </li>
              </ul>
              <label :class="{pic_btn:true,disable:indexNum}" :for="`image${index}`" @click="open(goodItem,index)"
                v-if="goodItem.imgShowList.length<5">
                <img src="@/assets/order/pic_model.png" alt="">
                <span class="countDown">{{goodItem.imgList.length}}/5</span>
              </label>
              <input :id="`image${index}`" class="filepath" @change="selectPic($event,goodItem,index)" type="file"
                name="image" size="1" accept="image/gif,image/jpeg,image/gif,image/png" :ref="`image${index}`">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="submit flex_row_center_center">
      <div class="btn" @click="publishEvaluate">发表评价</div>
    </div>
  </div>
</template>

<script>
  import { reactive, getCurrentInstance, ref, onMounted, watch } from "vue";
  import { ElRate, ElInput, ElMessage } from "element-plus";
  import { useRoute, useRouter } from "vue-router";
  import axios from 'axios';
  import { apiUrl } from "../../../utils/config";
  export default {
    name: "OrderEvaluate",
    components: {
      ElRate,
      ElInput
    },
    setup() {
      const order_info = reactive({ data: {} });
      const store_info = reactive({ data: {} });
      const route = useRoute();
      const evating = ref(false)
      const router = useRouter();
      const order_sn = ref("");
      const inputIndex = ref(0)
      const { proxy } = getCurrentInstance();
      //获取订单详情
      const getOrderInfo = () => {
        proxy
          .$post("v3/business/front/orderInfo/detail", {
            orderSn: order_sn.value
          })
          .then(res => {
            if (res.state == 200) {
              order_info.data = res.data;
              getStoreInfo(order_info.data.childOrdersVOS[0].storeId);
              order_info.data.childOrdersVOS.map(storeItem => {
                storeItem.description = 5;
                storeItem.serviceAttitude = 5;
                storeItem.expressSpeed = 5;
                storeItem.orderProductListVOList.map(goodItem => {
                  goodItem.score = 5;
                  goodItem.content = "";
                  goodItem.imgList = [];
                  goodItem.imgShowList = [];
                });
              });
            } else {
              ElMessage(res.msg);
            }
          })
      };
      //获取店铺详情
      const getStoreInfo = storeId => {
        proxy
          .$get("v3/seller/front/store/detail", {
            storeId
          })
          .then(res => {
            if (res.state == 200) {
              store_info.data = res.data;
            } else {
              ElMessage(res.msg);
            }
          })
          .catch(() => {
            //异常处理
          });
      };

      //发表评价
      const publishEvaluate = () => {
        if (evating.value) {
          return
        }
        evating.value = true
        let goodsCommentInfoList = [];
        order_info.data.childOrdersVOS[0].orderProductListVOList.map(item => {
          let product = {};
          product.content = item.content;
          product.goodsId = item.goodsId;
          product.orderProductId = item.orderProductId;
          product.productId = item.productId;
          product.image = item.imgList.join(",");
          product.score = item.score;
          goodsCommentInfoList.push(product);
        });
        let param = {
          description: order_info.data.childOrdersVOS[0].description,
          deliverSpeed: order_info.data.childOrdersVOS[0].expressSpeed,
          serviceAttitude: order_info.data.childOrdersVOS[0].serviceAttitude,
          orderSn: order_sn.value,
          goodsCommentInfoList: goodsCommentInfoList
        };
        proxy.$post("v3/business/front/orderComment/addOrderComment", param, "application/json").then(res => {
          if (res.state == 200) {
            ElMessage.success("评价成功");
            setTimeout(() => {
              router.push("/member/order/evaluation");
            }, 2000);
          } else {
            ElMessage(res.msg);
            evating.value = false
          }
        })
          .catch(() => {
            evating.value = false
          });
      };

      const open = (goodsItem, index) => {
        inputIndex.value = index
        if (goodsItem.imgList.length > 4) {
          proxy.$refs[`image${index}`].disabled = "disabled"
          return;
        } else {
          proxy.$refs[`image${index}`].disabled = ""
        }

      }

      //针对el-rate 的组件的从初始的满星不能选到0星的问题做外部处理
      const handleRate = (e, arg, reactObj) => {

        if (arg == 'description') {
          if (e.x <= 820) {
            reactObj[arg] = 0
          } else {
            reactObj[arg] = 5
          }
        }


        if (arg == 'serviceAttitude') {
          if (e.x <= 956) {
            reactObj[arg] = 0
          } else {
            reactObj[arg] = 5
          }
        }

        if (arg == 'expressSpeed') {
          if (e.x <= 1095) {
            reactObj[arg] = 0
          } else {
            reactObj[arg] = 5
          }
        }

        if (arg == 'score') {
          if (e.x <= 830) {
            reactObj[arg] = 0
          } else {
            reactObj[arg] = 5
          }
        }

      }

      //晒图(选择图片)
      const selectPic = (e, goodsItem) => {
        if (goodsItem.imgList.length > 4) {
          return;
        } else {
          let data = new FormData()
          data.append('file', e.target.files[0])
          data.append('source', 'evaluate')
          let config = {
            headers: { 'Content-Type': 'multipart/form-data' }
          }
          let url = apiUrl + "v3/oss/common/upload";
          axios.post(url, data, config).then(res => {
            proxy.$refs[`image${inputIndex.value}`].value = ""
            if (res.status === 200) {
              goodsItem.imgList.push(res.data.data.path)
              goodsItem.imgShowList.push(res.data.data.url)
            } else {
              ElMessage.warning('上传图片失败')
            }
          })
        }
      }

      //晒图(删除图片)
      const delImg = (goodItem, index) => {
        goodItem.imgList.splice(index, 1)
        goodItem.imgShowList.splice(index, 1)
      }

      watch(() => {

      })

      onMounted(() => {
        order_sn.value = route.query.orderSn;
        getOrderInfo();
      });
      return {
        order_info,
        store_info,
        publishEvaluate,
        selectPic,
        delImg,
        open,
        handleRate
      };
    }
  };
</script>

<style lang="scss">
  @import "../../../style/member/orderEvaluate.scss";

  .el-input__inner:focus {
    border-color: $colorMain;
    outline: 0;
  }

  .disable {
    pointer-events: none;
  }

  .imageBack {
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
    width: 203px;
    height: 203px;
  }
</style>