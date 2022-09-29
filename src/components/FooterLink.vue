<template>
    <div class="footer_link">
        <div class="link_box" v-if="navList.data.length > 0">
            <div class="link_wrap" v-for="({categoryName,categoryId,articleList},index) in navList.data" :key="index">
                <p @click="toarticle(categoryId)">{{categoryName}}</p>
                <li v-for="({title,cateId,articleId},index) in articleList" :key="index">
                    <router-link :to="{ path: '/article', query: { cateId: cateId,articleId:articleId }}" replace>
                        <a>{{title}}</a>
                    </router-link>
                </li>
            </div>
        </div>
        <div :class="navList.data.length > 0 ? 'bottom_box' : 'bottom_box_none'">
            <FooterBottom></FooterBottom>
        </div>
    </div>
</template>

<script>
    import FooterBottom from "./FooterBottom";
    import { reactive, getCurrentInstance } from 'vue'

    export default {
        name: "FooterLink",
        components: {
            FooterBottom
        },
        props: ["caseNumber"],
        setup() {
            const bg = {
                backgroundImage:
                    "url(" + require("../assets/footer/footer_bg.png") + ")",
                backgroundSize: "100% 100%"
            };
            const navList = reactive({ data: [] });
            const getInitData = () => {
                const { proxy } = getCurrentInstance();
                let param = {};
                param.cateSize = 6;
                param.articleSize = 5;
                proxy.$get('v3/cms/front/article/helpList', param).then(res => {
                    if (res.state == 200) {
                        navList.data = res.data;
                    }
                })
            }
            getInitData();
            return { bg, navList }
        },
    };
</script>

<style lang="scss" scoped>
    .footer_link {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
        box-sizing: border-box;

        .link_box {
            border-top: 1px dashed #f2f2f2;
            padding-top: 50px;
            width: 1210px;
            margin: 0 auto 50px;
            display: flex;
            position: relative;
            flex-direction: row;
            justify-content: space-between;

            .link_wrap {
                text-align: center;

                p {
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 20px;
                    color: #333333;
                }

                li {
                    line-height: 25px;

                    a {
                        color: #333333;

                        &:hover {
                            color: $colorMain
                        }
                    }
                }
            }

            .link_wrap:nth-child(1) {
                /*width: 295px;*/
                /*text-align: left;*/
            }

            .link_wrap:nth-child(2) {
                /*width: 270px;*/
            }

            .link_wrap:nth-child(3) {
                /*width: 280px;*/
            }

            .link_wrap:nth-child(4) {
                /*width: 280px;*/
            }

            .link_wrap:nth-child(5) {
                /*width: 280px;*/
            }
        }

        .bottom_box,.bottom_box_none {
            position: relative;
            width: 1903px;
            overflow: hidden;
            height: 130px;
        }
        .bottom_box_none {
            width: 100%;
            height: 87px;
            background-color: #333333;
        }
    }
</style>