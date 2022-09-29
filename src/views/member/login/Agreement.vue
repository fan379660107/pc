<template>
    <div class="sld_login">
        <div class="sld_login_header">
            <div class="content">
                <router-link tag="a" class="l_logo" :to="`/index`">
                    <img class="img" :src="configInfo.main_site_logo" :onerror="defaultImg" alt />
                </router-link>
                <div class="r_register_wrap">
                    {{L['我已知悉？']}}
                    <a class="go_register_btn" @click="goRegister">
                        {{L['去注册']}}
                    </a>
                </div>
            </div>
        </div>
        <div class="agreement_container">
            <h2 class="agreement_title">{{agreeContent.title}}</h2>
            <pre class="agreement_content" v-html="agreeContent.content"></pre>
        </div>
    </div>
</template>

<script>
    import { useRoute, useRouter } from 'vue-router'
    import { ref, getCurrentInstance, reactive, onMounted } from 'vue';
    import { useStore } from "vuex";

    export default {
        name: "Agreement",
        setup() {
            const store = useStore();
            const router = useRouter()
            const route = useRoute()
            const { proxy } = getCurrentInstance();
            const L = proxy.$getCurLanguage();
            const configInfo = ref(store.state.configInfo);
            const defaultImg = require('@/assets/common_top_logo.png');
            const agreeContent = reactive({
                content: '',
                title: ''
            })
            const agreementCode = reactive({
                agreementCode: route.query.type==1?'register_agreement':'privacy_policy' // register_agreement 用户协议  privacy_policy 隐私协议
            })
            const getInitData = () => {
                proxy.$get('v3/system/front/agreement/detail', agreementCode).then(res => {
                    if (res.state == 200) {
                        agreeContent.content = proxy.$quillEscapeToHtml(res.data.content)
                        agreeContent.title = res.data.title
                    }
                })
            }

            const goRegister = () => {
                // router.push({
                //     path: '/register'
                // })
                // router.back();
                window.close();
            }
            onMounted(() => {
                getInitData()
            })

            return { L, agreeContent, goRegister, configInfo, defaultImg  }
        },
    };
</script>
<style lang="scss" scoped>
    @import '../../../style/agreement.scss';
    .agreement_container{
        width: 800px;
        
    }
    .agreement_content{
        font-size: 15px;
        line-height: 35px;
        white-space:normal;
        word-break:break-all;
    }
</style>
<style lang="scss">
    .agreement_content{
        img {
            max-width: 100%;
        }

        a {
            display: inline-block;
            margin: 5px auto;
            color: #0000FF;
            text-decoration: underline;
        }

        table {
            border-collapse: collapse;
            padding: 0;
        }
        td,
        th {
            border: 1px solid #DDD;
            padding: 5px 10px;
        }

        ol li,
        ul li {
            list-style: unset;
        }
    }
</style>
