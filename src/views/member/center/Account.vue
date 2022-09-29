<!--
 * @Author: wangwei
 * @Date: 2020-12-29 16:05:36
 * @LastEditTime: 2021-01-09 17:26:39
 * @LastEditors: Please set LastEditors
 * @Description: 账号安全
 * @FilePath: /java-pc/src/views/member/center/Account.vue
-->
<template>
    <div class="sld_account">
        <MemberTitle :memberTitle="L['账号安全']"></MemberTitle>
        <div class="container">
            <div class="title">{{L['账号安全']}}</div>
            <div class="commonContent">
                <div class="item flex_row_start_center">
                    <i
                        :class="{iconfont:true, 'icon-jubao':!memberInfo.data.memberMobile, 'icon-xuanweimorendizhi':memberInfo.data.memberMobile}"></i>
                    <div class="item_info flex_row_start_center">
                        <span>手机号码</span>
                        <span class="tips"
                            v-if="memberInfo.data.memberMobile">绑定手机：{{memberInfo.data.memberMobile}}，若手机丢失或停用，请及时更换</span>
                        <span class="no tips" v-else>尚未绑定手机号</span>
                        <div>
                            <span class="oprate pointer" v-if="memberInfo.data.memberMobile"
                                @click="toPage('/member/phone','edit')">修改号码</span>
                            <span class="oprate pointer" @click="toPage('/member/phone','bind')" v-else>绑定号码</span>
                        </div>
                    </div>
                </div>
                <div class="item flex_row_start_center">
                    <i
                        :class="{iconfont:true, 'icon-jubao':!memberInfo.data.memberEmail, 'icon-xuanweimorendizhi':memberInfo.data.memberEmail}"></i>
                    <div class="item_info flex_row_start_center">
                        <span>电子邮箱</span>
                        <span class="tips"
                            v-if="memberInfo.data.memberEmail">绑定邮箱：{{memberInfo.data.memberEmail}}，若邮箱已停用，请及时更换</span>
                        <span class="no tips" v-else>尚未绑定邮箱</span>
                        <div>
                            <span class="oprate pointer" @click="toPage('/member/email','edit')"
                                v-if="memberInfo.data.memberEmail">修改邮箱</span>
                            <span class="oprate pointer" @click="toPage('/member/email','bind')" v-else>绑定邮箱</span>
                        </div>
                    </div>
                </div>
                <div class="item flex_row_start_center">
                    <i
                        :class="{iconfont:true, 'icon-jubao':!memberInfo.data.hasLoginPassword, 'icon-xuanweimorendizhi':memberInfo.data.hasLoginPassword}"></i>
                    <div class="item_info flex_row_start_center">
                        <span>登录密码</span>
                        <span class="tips">安全性高的密码可以保障您的账号安全，建议密码为6～20位,由英文、数字或符号的组合</span>
                        <div>
                            <span class="oprate pointer" @click="toPage('/member/pwd/login','edit')"
                                v-if="memberInfo.data.hasLoginPassword">修改密码</span>
                            <span class="oprate pointer" @click="toPage('/member/pwd/login','set')" v-else>设置密码</span>
                        </div>
                    </div>
                </div>
                <div class="item flex_row_start_center">
                    <i
                        :class="{iconfont:true, 'icon-jubao':!memberInfo.data.hasPayPassword, 'icon-xuanweimorendizhi':memberInfo.data.hasPayPassword}"></i>
                    <div class="item_info flex_row_start_center">
                        <span>支付密码</span>
                        <span class="tips">在使用账户余额时需输入支付密码以保证您的资金安全</span>
                        <div class="flex_column_center_center">
                            <span class="oprate pointer" @click="toPage('/member/pwd/pay','edit')"
                                v-if="memberInfo.data.hasPayPassword">修改密码</span>
                            <span class="oprate pointer" @click="toPage('/member/pwd/pay','set')"
                                v-if="!memberInfo.data.hasPayPassword">设置密码</span>
                            <span class="oprate reset pointer" @click="toPage('/member/pwd/reset','reset')"
                                v-if="memberInfo.data.hasPayPassword">重置密码</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { getCurrentInstance, reactive } from "vue";
    import { useStore } from "vuex";
    import { useRouter } from "vue-router"; //引入路由
    import MemberTitle from '../../../components/MemberTitle'
    export default {
        name: "Account",
        components: {
            MemberTitle
        },
        setup() {
            const { proxy } = getCurrentInstance();
            const router = useRouter()
            const L = proxy.$getCurLanguage();
            const store = useStore();
            const memberInfo = reactive({ data: store.state.memberInfo });
            const toPage = (url, type) => {
                router.push({
                    path: url,
                    query: {
                        type
                    }
                })
            }

            return {
                L,
                memberInfo,
                toPage
            };
        }
    };
</script>

<style lang="scss">
    /**
* 解决el-input设置类型为number时，中文输入法光标上移问题
**/
    .el-input__inner {
        line-height: 1px !important;
    }

    .sld_account {
        width: 1007px;
        float: left;
        margin-left: 10px;

        .container {
            background-color: white;
            width: 100%;
            box-sizing: border-box;
            border: 1px solid #eaeaea;
            padding: 25px 40px;

            .title {
                font-size: 18px;
                border-bottom: 1px dashed #eaeaea;
                padding-bottom: 25px;
                font-weight: 600;
            }

            .commonContent {
                margin: 35px 0;
                font-size: 14px;

                .item {
                    width: 100%;
                    border-bottom: 1px dashed #eaeaea;
                    box-sizing: border-box;
                    padding: 30px 0;

                    .iconfont {
                        margin-right: 10px;
                    }

                    .icon-jubao {
                        color: $colorMain2;
                    }

                    .icon-xuanweimorendizhi {
                        color: green;
                    }

                    .tips {
                        margin-left: 60px;
                        color: #999;
                        width: 680px;
                    }

                    .oprate {
                        color: #69c;
                        margin-left: 20px;
                    }

                    .reset {
                        margin-top: 10px;
                    }
                }
            }
        }
    }
</style>