<!--
 * @Author: wangwei
 * @Date: 2020-12-29 16:05:36
 * @LastEditTime: 2021-01-15 19:12:51
 * @LastEditors: Please set LastEditors
 * @Description: 支付密码
 * @FilePath: /java-pc/src/views/member/center/accountSafe.vue
-->
<template>
  <div class="sld_pay_password_mange">
    <MemberTitle :memberTitle="L['支付密码']"></MemberTitle>
    <div class="container">
      <div class="title">{{memberInfo.data.hasPayPassword?'修改':'设置'}}支付密码</div>
      <div class="mange_con">
        <div class="without_phone_tip" v-if="!memberInfo.data.memberMobile">请先绑定手机号，再进行支付密码操作!</div>
        <!-- 设置支付密码 start -->
        <template v-if="!memberInfo.data.hasPayPassword">
          <span class="current">当前手机号 {{memberInfo.data.memberMobile?memberInfo.data.memberMobile:'--'}}</span>

          <div class="sms_code_con flex_row_center_center">
            <el-input v-model="sms_code" placeholder="请输入短信验证码"></el-input>
            <div class="get_sms pointer" @click="getSmsCode">{{countDownM?(countDownM+L['s后获取']):L['获取验证码']}}</div>
          </div>
          <el-input type="password" class="password input" v-model="password" placeholder="请输入支付密码"></el-input>
          <el-input type="password" class="password input" v-model="confirm_password" placeholder="请再次输入支付密码">
          </el-input>
          <div class="error_tip">
            <span v-if="errorMsg" style="color: #e1251b;font-size: 14px" class="iconfont icon-jubao"></span>
            {{errorMsg}}
          </div>
          <div class="next flex_row_center_center pointer" @click="next">设置支付密码</div>
        </template>
        <!-- 设置支付密码 end -->
        <!-- 修改支付密码 start -->
        <template v-if="memberInfo.data.hasPayPassword">
          <el-input type="password" class="password input" v-model="old_password" placeholder="请输入原支付密码">
          </el-input>
          <el-input type="password" class="password input" v-model="password" placeholder="请输入新支付密码"></el-input>
          <el-input type="password" class="password input" v-model="confirm_password" placeholder="请再次输入新支付密码">
          </el-input>
          <div class="error_tip">
            <span v-if="errorMsg" style="color: #e1251b;font-size: 14px" class="iconfont icon-jubao"></span>
            {{errorMsg}}
          </div>
          <div class="next flex_row_center_center pointer" @click="next">修改支付密码</div>
        </template>
        <!-- 修改支付密码 end -->
      </div>
      <div class="manage_tips">
        <p class="tips_title">{{L['温馨提示']}}：</p>
        <p>• {{L['为了保障您的账号安全，变更重要信息需进行身份验证。']}}</p>
        <p>• {{L['复杂的密码可使账号更安全且建议定期更换密码。']}}</p>
      </div>
    </div>
  </div>
</template>

<script>
  import { ElInput, ElMessage } from "element-plus";
  import { getCurrentInstance, reactive, ref, watch, onMounted } from "vue";
  import { useStore } from "vuex";
  import { useRouter } from 'vue-router';
  import MemberTitle from "../../../components/MemberTitle";

  export default {
    name: "PayPassword",
    components: {
      MemberTitle,
      ElInput
    },
    setup() {
      const { proxy } = getCurrentInstance();
      const L = proxy.$getCurLanguage();
      const store = useStore();
      const errorMsg = ref("");
      const sms_code = ref("");
      const password = ref(""); //输入新密码
      const confirm_password = ref(""); //再次输入新密码
      const old_password = ref(""); //输入旧密码
      // const confirm_password = ref("");
      const router = useRouter()
      const timeOutId = ref(""); //定时器的返回值
      const countDownM = ref(0); //短信验证码倒计时
      const memberInfo = reactive({ data: store.state.memberInfo });
      const isSmsClick = ref(false)

      const getSmsCode = () => {
        if (isSmsClick.value) {
          return
        } else if (countDownM.value) {
          return false;
        }
        isSmsClick.value = true;
        var param = {};
        param.verifyType = 2;
        param.verifyAddr = memberInfo.data.memberMobile;
        proxy.$get("v3/msg/front/commons/sendVerifyCode", param).then(res => {
          if (res.state == 200) {
            countDownM.value = 60;
            countDown();
            isSmsClick.value = false;
          } else {
            ElMessage.error(res.msg);
            isSmsClick.value = false;
          }
        });
      };
      const next = () => {
        isSmsClick.value = false
        if (!memberInfo.data.memberMobile) {
          ElMessage.warning("请先绑定手机号，再进行操作!");
          return false;
        }
        let url = "";
        let param = {};
        if (memberInfo.data.hasPayPassword) {
          //修改支付密码
          if (!old_password.value) {
            errorMsg.value = "请输入旧支付密码"
            return false;
          }
          if (!password.value) {
            errorMsg.value = "请输入新支付密码"
            return false;
          }
          if (!confirm_password.value) {
            errorMsg.value = "请再次输入新支付密码"
            return false;
          }

          if (password.value != confirm_password.value) {
            errorMsg.value = "请输入一致的新支付密码"
            return false;
          }

          //验证新密码是否符合规则
          let checkPwd = proxy.$checkPwd(password.value);
          if (checkPwd !== true) {
            errorMsg.value = checkPwd
            return false;
          }

          url = "v3/member/front/memberPassword/editPayPwd";
          param.oldPayPwd = old_password.value;
          param.payPwd = password.value;
        } else {
          //设置支付密码
          //验证码校验
          if (!sms_code.value) {
            errorMsg.value = '请输入短信验证码'
            return false;
          } else {
            let checkSmsCode = proxy.$checkSmsCode(sms_code.value);
            if (checkSmsCode !== true) {
              errorMsg.value = checkSmsCode
              return false;
            }
          }

          if (!password.value) {
            errorMsg.value = '请输入支付密码'
            return false;
          }
          if (!confirm_password.value) {
            errorMsg.value = '请再次输入支付密码'
            return false;
          }

          if (password.value != confirm_password.value) {
            errorMsg.value = '请输入一致的支付密码'
            return false;
          }

          //验证新密码是否符合规则
          let checkPwd = proxy.$checkPwd(password.value);
          if (checkPwd !== true) {
            errorMsg.value = checkPwd
            return false;
          }

          url = "v3/member/front/memberPassword/addPayPwd";
          param.memberMobile = memberInfo.data.memberMobile;
          param.verifyCode = sms_code.value;
          param.payPwd = password.value;
        }
        proxy.$post(url, param).then(res => {
          if (res.state == 200) {
            ElMessage.success(res.msg);
            if (!memberInfo.data.hasPayPassword) {
              memberInfo.data.hasPayPassword = 1;
              store.commit("updateMemberInfo", memberInfo.data);
            }
            if (window.history.state.back.indexOf('/buy/Pay') > -1) {
              router.back()
            } else {
              sms_code.value = ''
              password.value = ''
              errorMsg.value = ''
              confirm_password.value = ''
            }

          } else {
            errorMsg.value = res.msg
          }
        });
      };
      //倒计时
      const countDown = () => {
        countDownM.value--;
        if (countDownM.value == 0) {
          isSmsClick.value = false
          clearTimeout(timeOutId.value);
        } else {
          timeOutId.value = setTimeout(countDown, 1000);
        }
      };

      watch([old_password, password, confirm_password], () => {
        old_password.value = old_password.value.substring(0, 20)
        password.value = password.value.substring(0, 20)
        confirm_password.value = confirm_password.value.substring(0, 20)
      })

      onMounted(() => {
      })


      return {
        L,
        memberInfo,
        countDownM,
        getSmsCode,
        next,
        password,
        old_password,
        confirm_password,
        sms_code,
        errorMsg
      };
    }
  };
</script>

<style lang="scss" scoped>
  .sld_pay_password_mange {
    width: 1007px;
    float: left;
    margin-left: 10px;

    .container {
      background-color: white;
      width: 100%;
      box-sizing: border-box;
      border: 1px solid #eaeaea;
      padding: 25px 40px;

      .manage_tips {
        width: 938px;
        background: #fffdee;
        border: 1px solid #edd28b;
        padding: 15px 36px;
        margin-top: 117px;

        p {
          color: #555555;
          margin-top: 10px;
        }

        .tips_title {
          font-weight: bold;
          margin-bottom: 11px;
          margin-top: 0;
        }
      }

      .title {
        font-size: 18px;
        border-bottom: 1px dashed #eaeaea;
        padding-bottom: 25px;
        font-weight: 600;
        margin-bottom: 20px;
      }

      .mange_con {
        width: 360px;
        margin: 62px auto 0;

        .current {
          line-height: 56px;
          font-size: 14px;
          color: #000000;
        }

        .error_tip {
          height: 15px;
          margin-top: 10px;
          color: #f30213;

          i {
            margin-right: 10px;
          }
        }

        .without_phone_tip {
          line-height: 56px;
          font-size: 16px;
          color: $colorMain2;
        }

        .sms_code_con {
          width: 100%;

          .get_sms {
            width: 100px;
            height: 40px;
            line-height: 38px;
            background: #e73539;
            text-align: center;
            color: white;
            font-size: 14px;
            border-radius: 0 3px 3px 0;
          }
        }

        .margin {
          margin-top: 20px;
        }

        .next {
          width: 170px;
          height: 40px;
          background: #f30213;
          color: #fff;
          font-size: 18px;
          font-weight: bold;
          text-align: center;
          color: white;
          margin-top: 20px;
          line-height: 40px;
          border-radius: 3px;
          margin: 42px auto 0;
        }
      }
    }
  }
</style>
<style lang="scss">
  .sld_pay_password_mange {
    .el-input {
      width: 280px;
      height: 40px;
      border-radius: 3px 0 0 3px;
    }

    .el-input__inner {
      width: 280px;
      height: 40px;
      border-radius: 3px 0 0 3px;
    }

    .input {
      width: 100%;
      height: 40px;
      margin-top: 20px;
      border-radius: 3px;

      .el-input__inner {
        height: 40px;
        border-radius: 3px;
        width: 100%;
      }
    }
  }

  .el-input__inner:focus {
    border-color: $colorMain;
    outline: 0;
  }

  /**
* 解决el-input设置类型为number时，中文输入法光标上移问题
**/
  .el-input__inner {
    line-height: 1px !important;
  }
</style>