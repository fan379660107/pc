<!--
 * @Author: wangwei
 * @Date: 2020-12-29 16:05:36
 * @LastEditTime: 2021-01-08 14:11:44
 * @LastEditors: Please set LastEditors
 * @Description: 我的余额
 * @FilePath: /java-pc/src/views/member/Header.vue
-->
<template>
  <div class="sld_my_balance">
    <MemberTitle :memberTitle="L['我的余额']"></MemberTitle>
    <div class="top_info flex_row_center_center">
      <div class="total flex_column_between_start">
        <span class="title">{{L['总金额']}}(元)：</span>
        <div class="red flex_row_center_center">
          <span class="">{{Number(balance_info.data.rechargeSum).toFixed(2).toString().split('.')[0]}}</span>
          <span class="fixed" v-if="Number(balance_info.data.rechargeSum) > 0">
            .{{Number(balance_info.data.rechargeSum).toFixed(2).toString().split('.')[1]}}
          </span>
        </div>
      </div>
      <div class="total flex_column_between_start">
        <span class="title">{{L['可用余额']}}(元)：</span>
        <div class="red flex_row_center_center">
          <span class="">{{Number(balance_info.data.balanceAvailable).toFixed(2).toString().split('.')[0]}}</span>
          <span class="fixed" v-if="Number(balance_info.data.balanceAvailable) > 0">
            .{{Number(balance_info.data.balanceAvailable).toFixed(2).toString().split('.')[1]}}
          </span>
        </div>
      </div>
      <div class="btn_con flex_column_center_center">
        <span v-if="rechargeSetting==1" class="recharge pointer" @click="toRecharge">{{L['充值']}}</span>
        <span v-if="outputEnable" class="putout pointer" @click="toPutout">提现</span>
      </div>
    </div>
    <div class="nav_list flex_row_start_center">
      <div :class="{item:true, active:current_type=='balance',pointer:true}" @click="change('balance')">
        {{L['余额明细']}}
      </div>
      <div :class="{item:true, active:current_type=='recharge',pointer:true}" @click="change('recharge')"
        v-if="rechargeSetting==1">
        {{L['充值明细']}}
      </div>
      <div v-if="outputEnable" :class="{item:true, active:current_type=='toPutout',pointer:true}"
        @click="change('toPutout')">
        提现明细
      </div>
    </div>
    <!-- 余额明细列表 -->
    <div v-if="current_type=='balance'" class="list_container">
      <div class="top_title flex_row_center_center">
        <div class="time flex_row_center_center">{{L['交易日期']}}</div>
        <div class="num flex_row_center_center">{{L['收入/支出']}}(元)</div>
        <div class="reason">{{L['变动原因']}}</div>
      </div>
      <div class="list_item flex_row_center_center" v-for="(balanceItem,index) in balance_list.data" :key="index">
        <div class="time flex_row_center_center">{{balanceItem.createTime}}</div>
        <div :class="{num:true,green:true, flex_row_center_center:true,red:balanceItem.state==2}">
          {{balanceItem.state==1?'+':'-'}}{{balanceItem.changeValue}}</div>
        <div class="reason">{{balanceItem.description}}</div>
      </div>
      <SldCommonEmpty tip="暂无余额明细~" totalHeight="587" totalWidth="1003" v-show="!balance_list.data.length" />
    </div>
    <!-- 充值明细 -->
    <div v-else-if="current_type=='recharge'" class="list_container">
      <div class="top_title flex_row_center_center">
        <div class="time flex_row_center_center">{{L['交易日期']}}</div>
        <div class="num flex_row_center_center">{{L['充值金额']}}(元)</div>
        <div class="reason">{{L['状态']}}</div>
      </div>
      <div class="list_item flex_row_center_center" v-for="(rechargeItem,index) in recharge_list.data" :key="index">
        <div class="time flex_row_center_center">{{rechargeItem.createTime}}</div>
        <div class="num flex_row_center_center">{{rechargeItem.payAmount}}</div>
        <div class="reason">{{rechargeItem.payStateValue}}</div>
      </div>
      <SldCommonEmpty tip="暂无充值明细~" totalHeight="587" totalWidth="1003" v-show="!recharge_list.data.length" />
    </div>
    <!-- 提现明细 -->
    <div v-else-if="outputEnable && current_type=='toPutout'" class="list_container">
      <div class="top_title putout flex_row_center_center">
        <div class="sn">提现单号</div>
        <div class="time">申请时间</div>
        <div class="money">提现金额</div>
        <div class="extra">手续费</div>
        <div class="state">状态</div>
        <div class="reason">失败原因</div>
        <div class="operate">操作</div>
      </div>
      <div v-for="item in output_list.data" :key="item.cashId" class="list_item putout flex_row_center_center">
        <div class="sn">{{item.cashSn}}</div>
        <div class="time">{{item.applyTime}}</div>
        <div class="money">￥{{item.cashAmount.toFixed(2)}}</div>
        <div class="extra">￥{{item.serviceFee.toFixed(2)}}</div>
        <div class="state">{{item.stateValue}}</div>
        <div class="reason" :title="item.failReason&&item.failReason.length>9 ? item.failReason : ''">
          {{item.failReason || '--'}}
        </div>
        <div class="operate" @click="outputInfo(item.cashId)"><span>查看</span></div>
      </div>
      <SldCommonEmpty tip="暂无提现明细~" totalHeight="587" totalWidth="1003" v-show="!output_list.data.length" />
    </div>
    <!-- 分页 start -->
    <div class="flex_row_end_center sld_pagination">
      <el-pagination @current-change="handleCurrentChange" :currentPage="pageData.current"
        :page-size="pageData.pageSize" layout="prev, pager, next, jumper" :total="pageData.total"
        :hide-on-single-page="true">
      </el-pagination>
    </div>
    <!-- 分页 end -->

    <el-dialog title="提示" width="420px" v-model="modalVisible" @close="close_dialog" top="30vh">
      <div class="dialog_desc">您尚未设置支付密码，请设置支付密码后再进行后续操作。</div>
      <div class="dialog_btn flex_row_end_center">
        <div class="dialog_cancle" @click="close_dialog">取消</div>
        <div class="dialog_set" @click="set_dialog">去设置</div>
      </div>
    </el-dialog>
    <el-dialog title="输入支付密码" width="420px" v-model="pdVisible" @close="close_pd" top="30vh">
      <div v-if="!passwordErr" class="dialog_desc2">请输入支付密码以完成后续操作</div>
      <div v-else class="dialog_desc2 error">{{passwordErr}}</div>
      <input type="password" v-model="password" class="dialog_input" placeholder="请输入平台支付密码" />
      <div class="dialog_btn flex_row_end_center">
        <div class="dialog_cancle" @click="close_pd">取消</div>
        <div class="dialog_set" @click="submit_dialog">确认</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { useRouter } from "vue-router";
  import { useStore } from 'vuex';
  import { ElMessage, ElPagination } from "element-plus";
  import { getCurrentInstance, onMounted, reactive, ref } from "vue";
  import MemberTitle from '../../../components/MemberTitle';
  import SldCommonEmpty from '../../../components/SldCommonEmpty'
  export default {
    name: "Balance",
    components: {
      MemberTitle,
      SldCommonEmpty,
      ElPagination
    },
    setup() {
      const router = useRouter()
      const { proxy } = getCurrentInstance();
      const L = proxy.$getCurLanguage();
      const store = useStore();
      const memberInfo = ref(store.state.memberInfo);
      const modalVisible = ref(false);
      const pdVisible = ref(false);
      const passwordErr = ref('');
      const password = ref('');
      const pageData = reactive({
        current: 1,
        pageSize: 20,
        total: 0
      });
      const balance_list = reactive({ data: [] })
      const recharge_list = reactive({ data: [] })
      const balance_info = reactive({ data: {} })
      const output_list = reactive({ data: [] })
      const current_type = ref('balance')//当前列表显示的数据类型
      const outputEnable = ref(true); //提现是否开启
      const getBalanceList = () => {//获取余额明细列表
        var param = {};
        param.state = 0;
        param.current = pageData.current;
        param.pageSize = pageData.pageSize;
        proxy
          .$get("v3/member/front/balanceLog/list", param)
          .then(res => {
            if (res.state == 200) {
              balance_list.data = res.data.list;
              // balance_info.data.rechargeSum = new Number(balance_info.data.rechargeSum).toFixed(2)
              // balance_info.data.balanceAvailable = new Number(balance_info.data.balanceAvailable).toFixed(2)
              balance_list.data.map(item => item.changeValue = new Number(item.changeValue).toFixed(2))
              pageData.total = res.data.pagination.total;
            } else {
              ElMessage(res.msg);
            }
          })
          .catch(() => {
            //异常处理
          });
      };
      const getRechargeList = () => {//获取充值明细列表
        var param = {};
        param.current = pageData.current;
        param.pageSize = pageData.pageSize;
        proxy
          .$get("v3/member/front/balanceRecharge/list", param)
          .then(res => {
            if (res.state == 200) {
              recharge_list.data = res.data.list;
              recharge_list.data.map(item => item.payAmount = new Number(item.payAmount).toFixed(2))
              pageData.total = res.data.pagination.total;
            } else {
              ElMessage(res.msg);
            }
          })
          .catch(() => {
            //异常处理
          });
      };
      const getBalanceinfo = () => {//获取余额信息
        proxy
          .$get("v3/member/front/balanceRecharge/getMemberBalance")
          .then(res => {
            if (res.state == 200) {
              balance_info.data = res.data;
            } else {
              ElMessage(res.msg);
            }
          })
          .catch(() => {
            //异常处理
          });
      };
      const getOutputList = () => { //获取提现明细
        var param = {};
        param.current = pageData.current;
        param.pageSize = pageData.pageSize;
        proxy
          .$get("v3/member/front/member/cash/log/list", param)
          .then(res => {
            if (res.state == 200) {
              output_list.data = res.data.list;
              pageData.total = res.data.pagination.total;
            } else {
              ElMessage(res.msg);
            }
          })
          .catch(() => {
            //异常处理
          });
      };
      const initList = () => {
        if (current_type.value == 'balance') {
          getBalanceList();
        } else if (current_type.value == 'recharge') {
          getRechargeList()
        } else {
          getOutputList();
        }
      }
      //切换
      const change = (type) => {
        pageData.current = 1
        current_type.value = type;
        initList()
      };
      //向前翻页
      const handlePrevCilickChange = () => {
        pageData.current--;
        initList();
      };
      //向后翻页
      const handleNextCilickChange = () => {
        pageData.current++;
        initList();
      };
      //页数改变
      const handleCurrentChange = current => {
        pageData.current = current;
        initList();
      };
      //去充值
      const toRecharge = () => {
        router.push({
          path: '/member/recharge'
        })
      };
      //提现
      const toPutout = () => {
        if (!outputEnable.value) {
          ElMessage.warning('提现功能已关闭')
        } else if (memberInfo.value.hasPayPassword == 1) {
          pdVisible.value = true;
        } else {
          modalVisible.value = true;
        }
      };
      //提现详情
      const outputInfo = (id) => {
        router.push({
          path: '/member/balance/info',
          query: {
            id
          }
        })
      };
      //取消弹窗
      const close_dialog = () => {
        modalVisible.value = false;
      };
      //设置支付密码
      const set_dialog = () => {
        router.push({
          path: '/member/pwd/pay',
          query: {
            type: 'set'
          }
        })
      };
      const close_pd = () => {
        pdVisible.value = false;
        password.value = '';
        passwordErr.value = '';
      };
      const submit_dialog = () => {
        if (!password.value) {
          passwordErr.value = '请输入平台支付密码';
        } else {
          proxy
            .$get("v3/member/front/member/cash/log/verifyPwd", {
              payPwd: password.value
            })
            .then(res => {
              if (res.state == 200) {
                router.push('/member/balance/operate')
              } else {
                passwordErr.value = res.msg || '密码输入错误，请重新输入';
              }
            })
            .catch(() => {
              //异常处理
            });
        }
      };
      const getOutputEnable = () => {
        proxy
          .$get('v3/system/front/setting/getSettings', { names: 'withdraw_is_enable,withdraw_alipay_is_enable' })
          .then(res => {
            if (res.state == 200) {
              outputEnable.value = (res.data[0] == '1' && res.data[1] == '1') ? true : false;
            }
          })
      }


      const rechargeSetting = ref('')
      const getReChargeSetting = () => {
        proxy.$get('/v3/system/front/setting/getSettings', { names: 'recharge_is_enable' }).then(res => {
          if (res.state == 200) {
            rechargeSetting.value = res.data[0]
          }
        })
      }

      onMounted(() => {
        getBalanceList();
        getBalanceinfo();
        getOutputEnable();
        getReChargeSetting()
      });
      return {
        L,
        pageData,
        handlePrevCilickChange,
        handleNextCilickChange,
        handleCurrentChange,
        balance_list,
        change,
        current_type,
        recharge_list,
        getBalanceinfo,
        balance_info,
        toRecharge,
        toPutout,
        outputInfo,
        memberInfo,
        modalVisible,
        close_dialog,
        set_dialog,
        pdVisible,
        close_pd,
        passwordErr,
        submit_dialog,
        password,
        output_list,
        getOutputList,
        outputEnable,
        rechargeSetting
      };
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../style/balance.scss";

  .sld_pagination {
    margin-top: 20px;
    margin-bottom: 20px;
  }
</style>
<style lang="scss">
  .sld_my_balance {
    .el-dialog {
      border-radius: 6px;
    }

    .el-dialog__title {
      color: #000000;
      font-size: 20px;
      font-family: Microsoft YaHei;
      font-weight: bold;
    }

    .el-icon {
      font-size: 18px;
      position: relative;
      bottom: 6px;
      left: 4px;
    }

    .el-dialog__header {
      text-align: center;
      color: #000000;
      font-size: 22px;
      font-family: Microsoft YaHei;
      font-weight: bold;
    }

    .el-dialog__body {
      padding: 0;
    }
  }
</style>