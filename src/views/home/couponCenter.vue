<!--
 * @Author: wangwei
 * @Date: 2020-12-29 16:05:36
 * @LastEditTime: 2021-01-26 16:52:59
 * @LastEditors: Please set LastEditors
 * @Description: 领劵中心
 * @FilePath: /java-pc/src/views/member/Header.vue
-->
<template>
  <div class="sld_coupon_center">
    <div class="imgCon2">
      <img class="top_bg" :src="top_bg" alt />
    </div>
    <div class="nav_list flex_row_start_center">
      <div :class="{item:true,active:current_index==-1,pointer:true}" @click="changeCate(true,-1)">精选</div>
      <div :class="{item:true,active:current_index==-2,pointer:true}" @click="changeCate(false,-2)">全部</div>
      <div v-for="(cateItem,index) in cate_list.data" :key="index"
        :class="{item:true,active:current_index==index,pointer:true}" @click="changeCate(cateItem.categoryId,index)">
        {{cateItem.categoryName}}</div>
    </div>
    <div class="coupon_con">
      <div class="container flex_row_start_center" v-if="coupon_list.data.length>0">
        <CouponItem v-for="(couponItem,index) in coupon_list.data" :key="index" :coupon_item="couponItem"
          @refreshCouponList="getCouponList"></CouponItem>
      </div>
      <SldCommonEmpty v-else></SldCommonEmpty>
      <!-- 分页 start -->
      <div class="flex_row_center_center sld_pagination">
        <el-pagination @current-change="handleCurrentChange" currentPage="pageData.current"
          :page-size="pageData.pageSize" layout="prev, pager, next, jumper" :total="pageData.total"
          :hide-on-single-page="true">
        </el-pagination>
      </div>
      <!-- 分页 end -->

    </div>
  </div>
</template>

<script>
  import SldCommonEmpty from '../../components/SldCommonEmpty'
  import { ElMessage } from "element-plus";
  import CouponItem from "../../components/CouponItem";
  import { getCurrentInstance, reactive, ref, onMounted } from "vue";
  export default {
    name: "CouponCenter",
    components: {
      CouponItem,
      SldCommonEmpty
    },
    setup() {
      const { proxy } = getCurrentInstance();
      const L = proxy.$getCurLanguage();
      const item_bg = require("../../assets/coupon/item_bg.png");
      const top_bg = require("../../assets/coupon/top_bg.png");
      const coupon_list = reactive({ data: [] });
      const cate_list = reactive({ data: [] });
      const category_id = ref("");
      const current_index = ref(-1);
      const isSelected = ref(true);
      const colors = reactive({
        data: [
          { color: "#D0D0D0", percentage: 0 },
          { color: "#FF0036", percentage: 100 }
        ]
      });
      const pageData = reactive({
        current: 1,
        pageSize: 9,
        total: 0
      });
      const getCouponList = () => {
        var param = {};
        param.isSelected = isSelected.value;
        if (!isSelected.value && current_index.value != -2) {
          param.categoryId = category_id.value;
        }
        param.current = pageData.current;
        param.pageSize = pageData.pageSize;
        proxy
          .$get("v3/promotion/front/coupon/couponCenter", param)
          .then(res => {
            if (res.state == 200) {
              coupon_list.data = res.data.couponList;
              cate_list.data = res.data.categoryList;
              pageData.total = res.data.pagination.total;
            } else {
              ElMessage(res.msg);
            }
          })
          .catch(() => {
            //异常处理
          });
      };
      const changeCate = (id, index) => {
        if (index == -1) {
          isSelected.value = true;
        } else {
          isSelected.value = false;
        }
        if (current_index.value == index) {
          return;
        }
        current_index.value = index;
        category_id.value = id;
        getCouponList();
      };
      //领取优惠卷
      const receive = couponId => {
        proxy
          .$get("v3/promotion/front/coupon/receiveCoupon", { couponId })
          .then(res => {
            if (res.state == 200) {
              ElMessage.success(L["领取成功"]);
              getCouponList();
            } else {
              ElMessage(res.msg);
            }
          })
          .catch(() => {
            //异常处理
          });
      };
      //向前翻页
      const handlePrevCilickChange = () => {
        pageData.current--;
        getCouponList();
      };
      //向后翻页
      const handleNextCilickChange = () => {
        pageData.current++;
        getCouponList();
      };
      //页数改变
      const handleCurrentChange = current => {
        pageData.current = current;
        getCouponList();
      };
      onMounted(() => {
        getCouponList();
      });
      return {
        L,
        item_bg,
        top_bg,
        coupon_list,
        cate_list,
        current_index,
        changeCate,
        colors,
        receive,
        handlePrevCilickChange,
        handleNextCilickChange,
        handleCurrentChange,
        pageData,
        getCouponList
      };
    }
  };
</script>

<style lang="scss">
  @import "../../style/couponCenter.scss";
</style>