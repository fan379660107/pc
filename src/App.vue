<template>
  <router-view />
</template>

<script>
export default {
  name: 'App',
}
</script>

<style lang="scss">
  @import "./style/reset.scss";
  @import "./style/base.scss";
  //放大镜位置
  .mouse-cover-canvas {
    position: absolute;
    top: 173px !important;
    left: 740px !important;
  }
</style>
