<template>
  <div class="sld_output">
    <MemberTitle :memberTitle="L['我的余额']" memberPath="/member/balance" memberTitleS="提现详情"></MemberTitle>
    <div class="main">
        <div class="list" v-if="isReady">
            <div class="item">
                <div class="title">申请单号：</div>
                <div class="content">{{info.data.cashSn}}</div>
            </div>
            <div class="item">
                <div class="title">状态：</div>
                <div class="content">{{info.data.stateValue}}</div>
            </div>
            <div class="item">
                <div class="title">提现金额：</div>
                <div class="content">￥{{info.data.cashAmount.toFixed(2)}}</div>
            </div>
            <div class="item">
                <div class="title">手续费：</div>
                <div class="content">￥{{info.data.serviceFee.toFixed(2)}}</div>
            </div>
            <div class="item" v-if="info.data.receiveType == 'ALIPAY'">
                <div class="title">支付宝账号：</div>
                <div class="content">{{info.data.receiveAccount}}</div>
            </div>
            <div class="item">
                <div class="title">真实姓名：</div>
                <div class="content">{{info.data.receiveName}}</div>
            </div>
            <div class="item">
                <div class="title">申请时间：</div>
                <div class="content">{{info.data.applyTime}}</div>
            </div>
            <div class="item" v-if="info.data.state == 2">
                <div class="title">完成时间：</div>
                <div class="content">{{info.data.finishTime}}</div>
            </div>
            <div class="item" v-else-if="info.data.state == 3 || info.data.state == 4">
                <div class="title">失败原因：</div>
                <div class="content">{{info.data.failReason || '--'}}</div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
  import { useRoute } from 'vue-router'
  import { getCurrentInstance, onMounted, reactive, ref } from "vue";
  import MemberTitle from '@/components/MemberTitle';
  import { ElMessage } from 'element-plus';
  export default {
    name: "OutputInfo",
    components: {
      MemberTitle,
    },
    setup() {
      const { proxy } = getCurrentInstance();
      const L = proxy.$getCurLanguage();
      const route = useRoute();
      const info = reactive({ data: {} });
      const isReady = ref(false);

      const getInfo =()=> {
        proxy
          .$get("v3/member/front/member/cash/log/detail", { cashId: route.query.id })
          .then(res => {
            if (res.state == 200) {
              info.data = res.data;
              isReady.value = true;
            } else {
              ElMessage(res.msg);
            }
          })
          .catch(() => {
            //异常处理
          });
      };

      onMounted(()=>{
        getInfo();
      })

      return { L, info, isReady, getInfo }
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
        overflow: hidden;
        background-color: white;

        .list {
            margin-top: 40px;
            margin-bottom: 60px;
            margin-left: 40px;

            .item {
                display: flex;
                height: 36px;
                line-height: 36px;
                color: #333333;
                font-size: 14px;
                font-family: Microsoft YaHei;
                font-weight: 400;

                .title {
                    width: 100px;
                    flex-shrink: 0;
                    text-align: right;
                }
                .content {
                    margin-left: 10px;

                }
            }
        }
    }
}
</style>