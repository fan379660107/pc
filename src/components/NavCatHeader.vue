<!--
 * @Author: your name
 * @Date: 2020-12-29 16:05:36
 * @LastEditTime: 2021-01-11 10:47:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /java-pc/src/components/NavCatHeader.vue
-->
<template>
  <div class="nav_cat">
    <div class="header">
      <div class="product_sort" @click="toGoodsList">
        <img :src="sortUrl" alt />
        <span class="sort">产品分类</span>
        <CategorySort />
      </div>
      <nav>
        <li v-if="showIndex"><a href="/">首页</a></li>
        <li v-for="(item,index) in navList.data" :key="index">
          <a href="javascript:void(0)" @click="navClick(item)">{{item.navName}}</a>
        </li>
      </nav>
    </div>

  </div>

</template>

<script>
  import { useRouter, useRoute } from "vue-router"; //引入路由
  import { reactive, getCurrentInstance, onMounted, ref } from "vue";
  import CategorySort from './CategorySort'
  export default {
    name: "NavCatHeader",
    components: {
      CategorySort
    },
    setup() {
      const router = useRouter(); //使用路由
      const route = useRoute()
      const showIndex = ref(true)
      const navList = reactive({ data: [] });
      const { proxy } = getCurrentInstance();
      const sortUrl = require("@/assets/header/sort.png");
      const toGoodsList = () => {
        router.push("/goods/Category"); //push产品分类路由
      };
      const getNavData = () => {
        proxy.$get("v3/system/front/navigation/list").then(res => {
          if (res.state == 200) {
            navList.data = res.data;
          }
        });
      };
      const navClick = val => {
        proxy.$diyNavTo(JSON.parse(val.data.replace(/&quot;/g,"\"")));
      };
      onMounted(() => {
        let path = route.path;
        let dom = document.getElementById('category_sort')
        if (path == '/index') {
          dom.style.display = 'block'
          showIndex.value = false
        } else if (path == '/goods/Category') {
          dom.style.display = 'none'
        }
        getNavData();
      })

      return { navList, sortUrl, toGoodsList, navClick, showIndex };
    }
  };
</script>

<style lang="scss" scoped>
  .header {
    width: 1210px;
    height: 45px;
    margin: 0 auto;
    display: flex;
    overflow: visible;

    .product_sort {
      position: relative;
      overflow: visible;
      width: 187px;
      height: 100%;
      background: $colorMain;
      color: #fff;
      font-size: 16px;
      letter-spacing: 3px;
      line-height: 30px;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      justify-content: space-between;
      cursor: pointer;
      box-sizing: border-box;
      padding: 0 50px 0 26px;

      &:hover {
        #category_sort {
          display: block;
        }
      }

      img {
        width: 12px;
        height: 12px;
      }
    }

    nav {
      width: 1013px;
      margin-left: 8px;
      display: flex;
      align-items: center;
      line-height: 30px;
      overflow: hidden;
      flex-wrap: wrap;

      a {
        height: 45px;
        display: inline-block;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        color: #333333;
        font-size: 16px;
        margin: 0 0 0 20px;
        line-height: 45px;
        padding: 0 7px;
        width: max-content;
      }

      a:hover {
        color: $colorMain;
        border-bottom: 3px solid $colorMain;
      }
    }
  }
</style>
