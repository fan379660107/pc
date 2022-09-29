<!-- 空页面
	空图标可以自定义
	内容提示可以自定义
	空页面所占的高度也可以自自定义
-->
<template name="loadingState">
    <div class="allow_loading_more flex_row_center_center" v-if="state == 'allow_loading_more'">
        <span class="allow_loading_icon iconfont iconshanghua"></span>
        <span class="tip">向上滑动浏览更多数据</span>
    </div>
    <div class="allow_loading_more flex_row_center_center" v-else-if="state == 'loading'">
        <!-- <img class="loading_more_icon" :src="img_url+'loading_more.gif'" /> -->
        <span class="tip">数据加载中...</span>
    </div>
    <!-- showEndFlag 默认为true，展示，设置为false，则不展示 -->
    <div class="no_more_data" v-else-if="state == 'no_more_data'&&showEndFlag">
        数据加载完毕~
    </div>
</template>

<script>
    export default {
        name: "loadingState",
        props: {
            state: {
                type: String,
                default: 'allow_loading_more',
            },
            mTop: {
                type: String,
                default: '100px',
            },
            showEndFlag: {
                type: Boolean,
                default: true,
            }
        },

    }
</script>

<style lang='scss'>
    /* template:allow_loading_more start */
    .allow_loading_more {
        height: 40px;

        .allow_loading_icon {
            width: 15px;
            height: 15px;
            margin-right: 6px;
            color: $colorMain;
        }

        .tip {
            color: #bbb;
            font-size: 12px;
        }

        .loading_more_icon {
            width: 23px;
            height: 23px;
        }
    }

    /* template:allow_loading_more end */

    /* template:loading start */
    .common_loading {
        flex: 1;

        .loading_icon {
            width: 105px;
            height: 105px;
        }
    }

    /* template:loading end */

    /* template:no_more_data start */
    .no_more_data {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        height: 40px;
        text-align: center;
        line-height: 40x;
        color: #bbb;
        font-size: 12px;
        /* width: 375px; */
    }

    /* template:no_more_data end */
</style>