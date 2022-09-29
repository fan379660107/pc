<template>

    <NavTopBar />
    <div class="top_head clearfix">
        <div class="head_img ">
            <img src="@/assets/point_logo.png" alt="">
        </div>
        <div class="top_point_category">
            <div :class="{cate_item:true,main:isSelected==cate.labelId}" v-for="(cate,index) in pointData" :key="index"
                @click="select(cate.labelId,index)">
                {{cate.labelName}}
            </div>
        </div>
        <el-dropdown trigger="click" v-if="moreData.length">
            <span class="el-dropdown-link">
                查看更多<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item v-for="(item,index) in moreData" :key="index" divided
                        @click="select(item.labelId)">{{item.labelName}}</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
    <div class="bottom_line"></div>
    <router-view></router-view>
    <FooterService />
    <FooterLink />

</template>

<script>
    import { getCurrentInstance, ref, onMounted, watch } from 'vue';
    import NavTopBar from '../../../components/NavTopBar';
    import FooterService from "../../../components/FooterService";
    import FooterLink from "../../../components/FooterLink";
    import { useRouter, useRoute } from 'vue-router'
    export default {
        name: 'Header',
        components: {
            NavTopBar,
            FooterService,
            FooterLink
        },
        setup() {
            const { proxy } = getCurrentInstance()
            const router = useRouter()
            const route = useRoute()
            const pointData = ref([])
            const isSelected = ref(route.query.labelId ? route.query.labelId : -1)
            const moreData = ref([])

            //初始化获取数据start
            const getInitData = () => {
                proxy.$get('v3/integral/front/integral/mall/list').then(res => {
                    pointData.value = res.data.list.slice(0, 7)
                    pointData.value.unshift({ labelName: '首页', labelId: -1 })
                    moreData.value = res.data.list.slice(7)
                })
            }
            //end

            //选择导航标签事件start
            const select = (labelId) => {
                if (labelId == -1) {
                    router.replace({
                        path: 'index'
                    })
                } else {
                    router.replace({
                        path: 'list',
                        query: {
                            labelId: labelId
                        }
                    })

                }
                isSelected.value = labelId
            }
            //end

            //监听路由的labelId
            watch(route.query.labelId, (nv) => {
                if (nv) {
                    isSelected.value = nv
                }

            })

            onMounted(() => {
                getInitData()
            })

            return {
                pointData,
                isSelected,
                select,
                moreData,
            }
        }
    }
</script>

<style lang="scss">
    .clearfix:after {
        /*伪元素是行内元素 正常浏览器清除浮动方法*/
        content: "";
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
    }

    .clearfix {
        *zoom: 1;
        /*ie6清除浮动的方式 *号只有IE6-IE7执行，其他浏览器不执行*/
    }

    .bottom_line {
        width: 100%;
        height: 2px;
        background: $colorMain;
    }

    .top_head {
        zoom: 1;
        display: block;
        padding-top: 15px;
        /* display: flex; */
        width: $min-home-width;
        margin: 0 auto;

        .head_img {
            float: left;

            img {
                vertical-align: middle;
            }
        }

        .top_point_category {
            float: left;
            display: flex;
            margin-left: 68px;
            align-self: end;
            height: 73px;

            .cate_item {
                margin-top: 15px;
                height: 46px;
                padding-left: 21px;
                padding-right: 21px;
                line-height: 46px;
                font-size: 16px;
                font-family: Microsoft YaHei;
                font-weight: bold;
                line-height: 74px;
                cursor: pointer;

                &:hover {
                    color: $colorMain;
                }
            }

            .main {
                color: $colorMain;
            }
        }
    }

    .el-dropdown {
        height: 46px;
        float: right;
        line-height: 74px;
        cursor: pointer;
        margin-top: 13px;
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: bold;
    }

    .el-dropdown-menu__item {
        text-align: center;
        width: 163px;
        background: #FFFFFF;

    }
</style>