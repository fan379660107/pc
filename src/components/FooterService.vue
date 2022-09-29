<!--
 * @Author: your name
 * @Date: 2021-01-13 12:13:02
 * @LastEditTime: 2021-01-13 17:05:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /java-pc/src/components/FooterService.vue
-->
<template>
  <div class="footer_service_wrap" v-if="configInfo.pc_home_bottom_adv">
    <div class="footer_service">
      <a>
        <img :src="configInfo.pc_home_bottom_adv" @error="defaultImg" alt />
      </a>
    </div>
  </div>
</template>

<script>
  import { useStore } from "vuex";
  import { ref, watch } from "vue";
  export default {
    name: "FooterService",
    setup() {
      const store = useStore();
      const configInfo = ref(store.state.configInfo);

      const defaultImg = (event) => {
        console.log('erroring')
        var img = event.srcElement;
        img.src = require("../assets/footer/footer_service.png");
        img.onerror = null; //解绑onerror事件
      }

      watch(() => store.state.configInfo, () => {
        if (!configInfo.value.pc_home_bottom_adv) {
            configInfo.value = store.state.configInfo;
        }
      })

      return {
        configInfo,
        defaultImg,
      };
    }
  };
</script>

<style lang="scss" scoped>
  .footer_service_wrap {
    width: 100%;
    height: 100%;
    margin-bottom: -2px;
    border-top: 1px solid #f2f2f2;

    .footer_service {
      width: 100%;
      height: 100px;
      overflow: hidden;

      a {
        display: inline-block;
        width: 100%;
        height: 100%;

        // overflow: hidden;
        img {
          width: 1920px;
          height: 100%;
          margin-left: -960px;
          left: 50%;
          position: relative;
          overflow: hidden;
          display: block;
        }
      }
    }
  }
</style>