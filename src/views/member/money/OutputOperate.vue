<template>
  <div class="sld_output">
    <MemberTitle :memberTitle="L['我的余额']" memberPath="/member/balance" memberTitleS="余额提现"></MemberTitle>
    <div class="main">
        <div v-show="showTip" class="tips flex_row_between_center">
            <span>温馨提示：提现手续费为{{info.extra}}%，最低提现金额为￥{{info.minMoney ? Number(info.minMoney).toFixed(2) : 0}}。</span>
            <img @click="closeTip" src="@/assets/buy/close.png" />
        </div>
        <div class="box">
            <div class="item">
                <div class="left"><span>提现方式：</span></div>
                <div class="right"><span>{{info.type}}</span></div>
            </div>
            <div class="item">
                <div class="left"><span>提现金额：</span></div>
                <div class="right flex_column_start_start">
                    <input v-model="info.cashAmount" placeholder="请输入提现金额" maxlength="6" autocomplete="off"/>
                    <div v-if="info.cashAmountErr" class="warning">{{info.cashAmountErr}}</div>
                </div>
                <div class="money" v-if="info.cashAmount">
                  （本次提现手续费<span>￥{{info.extra ? (Number(info.cashAmount)*Number(info.extra)/100).toFixed(2) : 0}}</span>）
                </div>
            </div>
            <template v-if="!info.cashAmountErr">
              <div v-if="info.cashAmount > memberInfo.memberBalance" class="money_tip error">剩余可提现金额不足</div>
              <div v-else class="money_tip">剩余可提现金额：￥{{memberInfo.memberBalance.toFixed(2) || 0}}</div>
            </template>
            <div class="item">
                <div class="left"><span>支付宝账号：</span></div>
                <div class="right">
                    <input v-model="info.accountNumber" placeholder="请输入支付宝账号" maxlength="30" autocomplete="off"/>
                    <div v-if="info.accountNumberErr" class="warning">{{info.accountNumberErr}}</div>
                </div>
            </div>
            <div class="item">
                <div class="left"><span>真实姓名：</span></div>
                <div class="right">
                    <input v-model="info.accountName" placeholder="请输入真实姓名" maxlength="20" autocomplete="off"/>
                    <div v-if="info.accountNameErr" class="warning">{{info.accountNameErr}}</div>
                </div>
            </div>
            <div class="item">
                <div class="left"><span>支付密码：</span></div>
                <div class="right">
                    <input type="password" v-model="info.payPwd" placeholder="请输入支付密码" maxlength="20" autocomplete="new-password"/>
                    <div v-if="info.payPwdErr" class="warning">{{info.payPwdErr}}</div>
                </div>
            </div>
        </div>
        <div class="btn" @click="submit">申请提现</div>
    </div>
  </div>
</template>

<script>
  import { getCurrentInstance, onMounted, reactive, ref } from "vue";
  import { useRouter } from 'vue-router';
  import { useStore } from 'vuex';
  import MemberTitle from '@/components/MemberTitle';
  import { ElMessage } from 'element-plus';
  export default {
    name: "OutputOperate",
    components: {
      MemberTitle,
    },
    setup() {
      const { proxy } = getCurrentInstance();
      const L = proxy.$getCurLanguage();
      const showTip = ref(true);
      const router = useRouter();
      const store = useStore();
      const memberInfo = ref(store.state.memberInfo);
      const isClick = ref(false);
      const info = reactive({
          minMoney: 0,
          extra: 0,
          type: '支付宝',
          cashAmount: '',
          cashAmountErr: '',
          accountNumber: '',
          accountNumberErr: '',
          accountName: '',
          accountNameErr: '',
          payPwd: '',
          payPwdErr: '',
      })

      const closeTip =()=> {
          showTip.value = false;
      };

      //申请提现
      const submit =()=> {
          if(isClick.value){ return; }
          let flag = true;
          if(!info.cashAmount || info.cashAmount==0){
            info.cashAmountErr = '请输入提现金额';
            flag = false;
          }else if(info.cashAmount < Number(info.minMoney)){
            info.cashAmountErr = ('最低提现金额为￥'+Number(info.minMoney).toFixed(2));
            flag = false;
          }else if(info.cashAmount > memberInfo.value.memberBalance){
            info.cashAmountErr = '剩余可提现金额不足';
            flag = false;
          }else{
            info.cashAmountErr = '';
          }
          if(!info.accountNumber){
            info.accountNumberErr = '请输入支付宝账号';
            flag = false;
          }else{
            info.accountNumberErr = '';
          }
          if(!info.accountName){
            info.accountNameErr = '请输入真实姓名';
            flag = false;
          }else{
            info.accountNameErr = '';
          }
          if(!info.payPwd){
            info.payPwdErr = '请输入支付密码';
          }else{
            isClick.value = true;
            proxy
              .$get("v3/member/front/member/cash/log/verifyPwd", {
                payPwd: info.payPwd
              })
              .then(res => {
                  if(res.state == 200){
                    info.payPwdErr = '';
                    if(flag){
                      let param = {
                        // accountId: memberInfo.value.memberId,
                        cashAmount: info.cashAmount,
                        accountNumber: info.accountNumber,
                        accountName: info.accountName,
                        payPwd: info.payPwd,
                      }
                      proxy
                        .$post("v3/member/front/member/cash/log/applyWithdraw", param)
                        .then(res => {
                          if (res.state == 200) {
                            ElMessage.success(res.msg);
                            setTimeout(()=>{
                                router.back();
                            }, 1000)
                          } else {
                            ElMessage(res.msg);
                            isClick.value = false;
                          }
                      }).catch(() => {
                        //异常处理
                        isClick.value = false;
                      });
                    }else{
                      isClick.value = false;
                    }
                  }else{
                    info.payPwdErr = res.msg || '请输入正确的支付密码';
                    isClick.value = false;
                  }
              })
          }
      };

      const getSet =()=> {
        proxy
          .$get("v3/system/front/setting/getSettings", {names: 'min_withdraw_amount,withdraw_fee'})
          .then(res=>{
              if(res.state == 200){
                if(res.data[0]){
                  info.minMoney = res.data[0];
                }
                if(res.data[1]){
                  info.extra = res.data[1];
                }
              }
          })
      };

      onMounted(()=>{
        getSet();
      })

      return { L, memberInfo, isClick, showTip, info, closeTip, submit, getSet }
    }
  }
</script>

<style lang="scss" scoped>
.sld_output {
    width: 1007px;
    margin-left: 10px;
    float: left;

    .main {
        width: 100%;
        padding-top: 20px;
        overflow: hidden;
        background-color: white;

        .tips {
            margin-left: 20px;
            margin-right: 20px;
            padding: 14px;
            height: 40px;
            color: #000000;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            background: rgba(233, 32, 36, .1);
            border-radius: 3px;

            img {
                width: 13px;
                height: 13px;
                cursor: pointer;
            }
        }

        .box {
            margin-top: 20px;
            .money_tip {
              color: #999999;
              font-size: 13px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              margin-left: 333px;
              margin-top: 12px;

              &.error {
                color: $colorMain;
              }
            }
            .item {
                margin-top: 20px;
                margin-left: 205px;
                display: flex;
                
                .left {
                    width: 110px;
                    height: 40px;
                    line-height: 40px;
                    margin-right: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    
                    span {
                        position: relative;
                        text-align: right;

                        &:before {
                            display: block;
                            content: '*';
                            position: absolute;
                            left: -8px;
                            top: 50%;
                            height: 40px;
                            margin-top: -18px;
                            color: red;
                        }
                    }
                }

                .right {
                    width: 360px;

                    span {
                        height: 40px;
                        line-height: 40px;
                    }

                    input {
                        width: 360px;
                        height: 40px;
                        border: 1px solid #DDDDDD;
                        padding: 10px;
                        border-radius: 2px;
                    }

                    .warning {
                        position: relative;
                        left: 12px;
                        top: 8px;
                        line-height: 24px;
                        color: #666666;
                        font-size: 13px;
                        font-family: Microsoft YaHei;
                        font-weight: 400;
                        color: $colorMain;
                    }
                }

                .money {
                    line-height: 40px;
                    color: #999999;
                    font-size: 14px;
                    font-family: Microsoft YaHei;
                    font-weight: 400;
                    margin-left: 15px;
                    span {
                        color: $colorMain;
                        margin-left: 4px;
                    }
                }
            }
        }

        .btn {
            width: 170px;
            height: 40px;
            line-height: 40px;
            color: #fff;
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            background: #f30213;
            border-radius: 3px;
            margin: 80px auto;
            cursor: pointer;
        }
    }
}
</style>