<!--新增/编辑收货地址 @zjf-2021-01-06-->
<template>
  <div class="address_operate_modal">
    <el-dialog :title="type=='edit'?'编辑地址':'添加收货地址'" v-model="modalVisible" @close="close_dialog">
      <el-form :model="form.data" :rules="rules" ref="ruleForm">
        <el-form-item label="收货人" :label-width="formLabelWidth" prop="memberName">
          <el-input v-model="form.data.memberName" autocomplete="off" maxlength="25" show-word-limit
            placeholder="请输入收货人姓名" clearable>
          </el-input>
        </el-form-item>

        <el-form-item label="电话号码" :label-width="formLabelWidth" prop="telMobile">
          <el-input v-model="form.data.telMobile" autocomplete="off" placeholder="请输入手机号" clearable maxlength="11"
            show-word-limit></el-input>
        </el-form-item>

        <el-form-item label="所在地区" :label-width="formLabelWidth" prop="area">
          <el-cascader ref="cascaderAddr" v-model="form.data.area" :options="areaDataArray" placeholder="请选择所在地区"
            :props="cascaderProps" clearable></el-cascader>
        </el-form-item>

        <el-form-item label="详细地址" :label-width="formLabelWidth" prop="detailAddress">
          <el-input type="textarea" :rows="2" v-model="form.data.detailAddress" autocomplete="off" placeholder="请输入详细地址"
            clearable maxlength="40"></el-input>
        </el-form-item>

        <el-form-item label=" " :label-width="formLabelWidth">
          <el-checkbox v-model="form.data.isDefault">设为默认地址</el-checkbox>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="close_dialog">取 消</el-button>
          <el-button type="primary" @click="addAddress('ruleForm')" :loading="btnLoading">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  import { ref, reactive, getCurrentInstance, watchEffect } from "vue";
  import areaData from "../assets/area.json";
  import { ElMessage } from "element-plus";
  export default {
    name: "SldAddressOperation",
    components: {},
    props: ["visibleFlag", "type", "addressInfo"],
    setup(props, { emit }) {
      const { proxy } = getCurrentInstance();
      const formLabelWidth = "80px";
      const modalVisible = ref(true);
      const form = reactive({ data: {} });
      const areaDataArray = areaData;
      const cascaderProps = { label: "regionName", value: "regionCode" };
      const ruleForm = ref(null);
      const cascaderAddr = ref(null);
      const addressInfo = reactive(props.addressInfo);
      const btnLoading = ref(false)
      const type = ref(props.type)
      if (props.type == "edit") {
        var area = [addressInfo.data.provinceCode, addressInfo.data.cityCode];
        form.data.memberName = addressInfo.data.memberName;
        form.data.telMobile = addressInfo.data.telMobile;
        form.data.detailAddress = addressInfo.data.detailAddress; //详细地址
        form.data.isDefault = addressInfo.data.isDefault ? true : false; //是否默认地址：1-默认地址，0-非默认地址
        if (addressInfo.data.districtCode != '0') {
          area.push(addressInfo.data.districtCode)
        }
        form.data.area = area;
      } else {
        form.data.memberName = "";
        form.data.telMobile = "";
        form.data.detailAddress = ""; //详细地址
        form.data.isDefault = false; //是否默认地址：1-默认地址，0-非默认地址
        form.data.area = [];
      }

      const rules = {
        memberName: [
          { required: true, message: "请输入收货人", trigger: "change" },
          { min: 2, max: 25, message: "请输入2~25个字符", trigger: "change" }
        ],
        telMobile: [
          { required: true, message: "请输入手机号", trigger: "change" },
          {
            pattern: /^((\+?86)|(\(\+86\)))?(1[3-9]\d{9}$)|(\d{4}-)\d{6,8}$/,
            message: "请输入正确的电话号码",
            trigger: "change"
          }
        ],
        area: [{ required: true, message: "请选择所在地区", trigger: "change" }],
        detailAddress: [
          { required: true, message: "请输入详细地址", trigger: "change" },
          { min: 5, max: 40, message: "请输入5~40个字符", trigger: "change" },
          {
            pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]+$/,
            message: "请输入正确的地址",
            trigger: "change"
          }
        ]
      }; //输入校验
      //增加地址
      const addAddress = () => {

        btnLoading.value = true
        ruleForm.value.validate(valid => {
          if (valid) {
            var param = {
              provinceCode: form.data.area[0],
              cityCode: form.data.area[1],
              districtCode: form.data.area[2],
              memberName: form.data.memberName.trim(),
              telMobile: form.data.telMobile.trim(),
              addressAll: cascaderAddr.value
                .getCheckedNodes()[0]
                .pathLabels.join(""),
              isDefault: form.data.isDefault ? 1 : 0,
              detailAddress: form.data.detailAddress.trim()
            };
            var url;
            if (props.type == "edit") {
              url = "v3/member/front/memberAddress/edit";
              param.addressId = addressInfo.data.addressId
            } else if (props.type == "add") {
              url = "v3/member/front/memberAddress/add";
            }
            proxy
              .$post(url, param)
              .then(res => {
                if (res.state == 200) {
                  btnLoading.value = false
                  close_dialog();
                  emit("refreshAddress", param, res.data);
                  ElMessage.success(res.msg);
                } else {

                  ElMessage(res.msg);
                }
              })
          } else {
            btnLoading.value = false
            return false;
          }
        });
      };
      const close_dialog = () => {
        emit("close");
        document.body.style.overflow = 'visible'
      };
      watchEffect(() => {
        //   modalVisible.value = props.visibleFlag;
        //   console.log(addressInfo)
      });
      return {
        formLabelWidth,
        modalVisible,
        form,
        areaDataArray,
        cascaderProps,
        rules,
        ruleForm,
        addAddress,
        cascaderAddr,
        close_dialog,
        btnLoading,
        type
      };
    }
  };
</script>

<style lang="scss">
  .el-cascader-menu__wrap {
    height: 204px !important;
  }

  textarea {
    resize: none;
  }

  .address_operate_modal {
    .el-dialog {
      width: 600px !important;
    }

    .el-cascader {
      width: 100% !important;
    }

    .el-checkbox {
      .el-checkbox__input {
        margin-top: -4px;
      }
    }

    .el-button--primary {
      color: #fff;
      background-color: $colorMain;
      border-color: $colorMain;
    }

    .el-checkbox__input.is-checked .el-checkbox__inner,
    .el-checkbox__input.is-indeterminate .el-checkbox__inner {
      background-color: $colorMain;
      border-color: $colorMain;
    }

    .el-checkbox__input.is-checked+.el-checkbox__label {
      color: $colorMain;
    }

    .el-button {
      padding: 9px 20px;
    }

    .el-dialog__body {
      padding: 20px;
    }

    .el-form-item {
      margin-bottom: 15px;
    }

    .el-form-item__content {
      position: relative;
    }

    .el-form-item__error {
      position: absolute;
      top: -2px;
      right: 0;
      display: inline-block;
      width: auto;
      z-index: 2;
      background: #fff;
      left: auto;
      padding: 0 3px;
    }

    input::-webkit-input-placeholder {
      /* Chrome/Opera/Safari */
      color: #ccc;
      font-size: 12px;
    }

    input::-moz-placeholder {
      /* Firefox 19+ */
      color: #ccc;
      font-size: 12px;
    }

    input:-ms-input-placeholder {
      /* IE 10+ */
      color: #ccc;
      font-size: 12px;
    }

    input:-moz-placeholder {
      /* Firefox 18- */
      color: #ccc;
      font-size: 12px;
    }

    textarea::-webkit-input-placeholder {
      /* Chrome/Opera/Safari */
      color: #ccc;
      font-size: 12px;
    }

    textarea::-moz-placeholder {
      /* Firefox 19+ */
      color: #ccc;
      font-size: 12px;
    }

    textarea:-ms-input-placeholder {
      /* IE 10+ */
      color: #ccc;
      font-size: 12px;
    }

    textarea:-moz-placeholder {
      /* Firefox 18- */
      color: #ccc;
      font-size: 12px;
    }

    .el-input {
      --el-input-focus-border: #e2231a;
    }

    .el-cascader-node.in-active-path {
      color: #e2231a !important;
    }
  }
</style>