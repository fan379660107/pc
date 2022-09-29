<template>
  <div class="index">
    <template v-if="firstLoading">
      <div class="skeleton_banner"></div>
      <div class="w_sld_react_1210 adv_04_wrap skeleton">
        <div class="floor_title">
          <h2>
            <font>&nbsp;</font>
            <span></span>
            <font>&nbsp;</font>
          </h2>
        </div>
        <div class="floor_goods">
          <div class="item" v-for="(item_main,index_main) in [1,2,3,4,5,6,7,8,9,10]" v-bind:key="index_main">
            <div class="wrap">
              <a href="javascript:void(0)" class="example_text"></a>
              <p class="title">
                <a href="javascript:void(0)">{{item_main}}</a>
              </p>
              <p class="price">
                <span></span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>
    <SldDiy v-if="decorateData.data.length" :decorateData="decorateData" @adv19="handleAdv19" />
    <OpenScreen @closeScreen="closeScreen" v-if="show_open_screen" :openScreenData="openScreenData.data"></OpenScreen>
    <!-- 空页面 start-->
    <SldCommonEmpty v-if="!firstLoading&&!decorateData.data.length" totalHeight="900" paddingTop="250"
      tip="我们正在努力装修中，敬请期待～" />
    <!-- 空页面 end-->
  </div>
</template>
<script>
  import { reactive, getCurrentInstance, ref, onMounted } from "vue";
  import { useRouter, useRoute } from 'vue-router';
  import SldDiy from "../../components/SldDiy";
  import OpenScreen from "../../components/OpenScreen";
  import { useStore } from "vuex";
  import SldCommonEmpty from "../../components/SldCommonEmpty";
  import { getQueryVariable } from '@/utils/common.js'

  export default {
    name: "index",
    components: {
      SldDiy,
      OpenScreen,
      SldCommonEmpty
    },
    setup() {
      const router = useRouter()
      const route = useRoute()
      const adv_21_right_icon = require("../../assets/decorate/right_more_icon.png");
      const adv_24_let_default_pic = require("../../assets/decorate/adv_24_let_default_pic.png");
      const decorateData = reactive({ data: [] }); //装修数据
      const openScreenData = reactive({ data: {} }); //开屏数据
      const firstLoading = ref(true); //是否第一次加载
      const { proxy } = getCurrentInstance();
      const show_open_screen = ref(false);
      const store = useStore();
      const getInitData = () => {
        let param = {}
        if (route.query.type == 'view' && route.query.id) param.decoId = route.query.id
        proxy.$get("v3/system/front/pcDeco/index", param).then(res => {
          firstLoading.value = false;
          if (res.state == 200) {

            decorateData.data = JSON.parse(res.data.data.replace(/&quot;/g, "\""));
            decorateData.data.map(item => {
              item.json_data = item.json
              if (item.json_data && item.json_data.type == 'adv_19') {
                item.json_data.data.map(child => {
                  child.cur_tab = 0;
                })
              }
              if (item.json_data && item.json_data.type == 'main_banner') {
                item.json_data.data = item.json_data.data.filter(i => i.imgUrl)
              }
            });


          }
        });
      };
      const getOpenScreen = () => {
        proxy.$get("v3/system/front/deco/firstAdv").then(res => {
          if (res.state == 200) {
            openScreenData.data = JSON.parse(res.data.data.replace(/&quot;/g, "\""));
            if (openScreenData.data.imgUrl && openScreenData.data.show_switch && !route.query.type) {
              if (JSON.stringify(store.state.openScreenInfo) == "{}") {
                openScreenData.data.time = new Date().getTime()
                store.commit("updateOpenScreenInfo", openScreenData.data);
                show_open_screen.value = true;
                document.body.style.overflow = "hidden";
              } else if (
                store.state.openScreenInfo.show_radio_sele == openScreenData.data.show_radio_sele
              ) {
                if (store.state.openScreenInfo.show_radio_sele == "one") {
                  if (openScreenData.data.time - new Date().getTime() > 86400) {
                    openScreenData.data.time = new Date().getTime()
                    store.commit("updateOpenScreenInfo", openScreenData.data);
                    show_open_screen.value = true;
                    document.body.style.overflow = "hidden";
                  }
                } else if (store.state.openScreenInfo.show_radio_sele == "more") {
                  store.commit("updateOpenScreenInfo", openScreenData.data);
                  show_open_screen.value = true;
                  document.body.style.overflow = "hidden";
                }
              } else {
                openScreenData.data.time = new Date().getTime()
                store.commit("updateOpenScreenInfo", openScreenData.data);
                show_open_screen.value = true;
                document.body.style.overflow = "hidden";
              }
            }
          }
        });
      };
      const closeScreen = () => {
        show_open_screen.value = false;
        document.body.style.overflow = "";
      };
      router.beforeEach((to, from, next) => {
        document.body.style.overflow = "";
        next()
      })
      getOpenScreen();
      getInitData();
      const handleAdv19 = (data) => {
        let tmp_data = decorateData.data.filter(item => item.dataId == data.dataId)[0];
        tmp_data.json_data.data[data.left_or_right_index]['cur_tab'] = data.tab_index;
      }

      onMounted(() => {

      })

      return {
        adv_21_right_icon,
        adv_24_let_default_pic,
        decorateData,
        firstLoading,
        show_open_screen,
        openScreenData,
        handleAdv19,
        closeScreen
      };
    }
  };
</script>
<style lang="scss" scoped>
  @import "../../style/decorate.scss";

  .index {
    min-height: 456px;
    background: #f8f8f8;
    padding-bottom: 10px;
  }

  .skeleton_banner {
    width: 100%;
    height: 470px;
    background: $colorSkeleton;
    margin-bottom: 10px;
  }

  .skeleton {
    &.adv_04_wrap .floor_title h2 span {
      background: $colorSkeleton;
      display: inline-block;
      width: 200px;
    }

    &.adv_04_wrap .floor_goods .item .wrap .title {
      background: $colorSkeleton;
      width: 100%;

      a {
        color: transparent;
      }
    }

    &.adv_04_wrap .floor_goods .item .wrap .price {
      width: 100%;
      height: 25px;
    }

    &.adv_04_wrap .floor_goods .item .wrap .price span {
      display: inline-block;
      width: 70px;
      height: 100%;
      background: $colorSkeleton;
    }
  }
</style>