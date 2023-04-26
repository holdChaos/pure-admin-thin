<!--
 * @Author: hechao “chao.he@genowis.com”
 * @LastEditTime: 2023-04-19 23时
 * @Description: 手动注册
-->

<template>
  <div class="default-main">
    <h2 class="title-text">手动注册(商业版)</h2>
    <el-form
      class="WAFrom"
      ref="ruleFormRef"
      :model="ruleForm"
      status-icon
      :rules="rules"
      label-width="120px"
      v-loading.fullscreen.lock="formLoading"
      element-loading-text="接口请求中..."
      element-loading-background="rgba(122, 122, 122, 0.3)"
    >
      <!-- 注册类型 -->
      <!-- <el-form-item label="注册类型" prop="Reg_Status">
          <el-select v-model="ruleForm.Reg_Status" placeholder="Personal/Business" disabled>
              <el-option label="Personal" value="Personal" />
              <el-option label="Business" value="Business" />
          </el-select>
      </el-form-item> -->

      <!-- 国家语言 -->
      <el-form-item label="国家语言" required>
        <el-col :span="11">
          <el-form-item prop="lc">
            <el-input
              type="text"
              v-model="ruleForm.lc"
              placeholder="国家缩写"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
        <el-col :span="1"></el-col>
        <el-col :span="12">
          <el-form-item prop="lg">
            <el-input
              type="text"
              v-model="ruleForm.lg"
              placeholder="语言缩写"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
      </el-form-item>

      <!-- 手机号码 -->
      <el-form-item label="手机号码" required prop="cc">
        <el-col :span="6">
          <el-form-item prop="cc">
            <el-input
              type="number"
              v-model="ruleForm.cc"
              placeholder="国家区号"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
        <el-col :span="1"></el-col>
        <el-col :span="17">
          <el-form-item prop="phone">
            <el-input
              type="number"
              v-model="ruleForm.phone"
              placeholder="手机号码"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
      </el-form-item>

      <!-- 短信验证码 -->
      <el-form-item label="短信验证码" prop="code">
        <el-input
          type="number"
          v-model="ruleForm.code"
          @input="codeInput"
          placeholder="短信验证码（不带中划线符号）"
          autocomplete="off"
        />
      </el-form-item>

      <!-- 代理 -->
      <el-form-item label="代理" prop="socks5">
        <el-input
          type="text"
          v-model="ruleForm.socks5"
          placeholder="格式：socks5://账号:密码@IP:Port"
          autocomplete="off"
        >
        </el-input>
      </el-form-item>

      <el-form-item class="button-box">
        <el-button type="primary" @click="sendCode(ruleFormRef)"
          style="width: 144px"
          >发送注册验证码</el-button>

        <el-button
          type="primary"
          @click="Register(ruleFormRef)"
          :disabled="registerDisabled"
          >校验验证码并注册</el-button>

        <!-- <el-button @click="resetForm(ruleFormRef)">重置</el-button> -->
      </el-form-item>
    </el-form>

    <!-- 信息展示 -->
    <template v-if="account.length > 0">
      <h2 class="title-text">账号数据</h2>
      <el-table class="el-table" :data="account">
        <el-table-column prop="cc" label="国家区号" />
        <el-table-column prop="phone" label="手机号码" />
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="StaticPubKey" label="公钥" />
        <el-table-column prop="StaticPriKey" label="私钥" />
        <el-table-column prop="IdentityPubKey" label="身份公钥" />
        <el-table-column prop="IdentityPriKey" label="身份私钥" />
        <el-table-column prop="Hash" label="Hash" />

        <el-table-column fixed="right" label="操作" width="120">
          <template #default="cur">
            <el-button
              link
              type="primary"
              size="small"
              @click="copyAccount(cur.$index)"
              >复制</el-button
            >
            <el-button
              link
              type="primary"
              size="small"
              @click="download(cur.$index)"
              >下载</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </template>
  </div>
</template>



<script setup lang="ts">
import { reactive, ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { ElNotification } from "element-plus";
import axios from "axios";
import { copy } from "@/utils/wa/clipboard";
import { downloadText } from "@/utils/wa/downloadText";
// api
import { registerWhatsApp, verifyWhatsApp } from "@/api/common";
import { baseUrl_wa } from '@/api/common'
import { register_manual, verify_manual } from '@/api/wa/index'
// axios.defaults.headers.post["Content-Type"] = "application/json";

// axios = axios.create

const axiosInstance = axios.create({
  baseURL: baseUrl_wa,
  timeout: 0, // 请求超时时间，单位为毫秒
  headers: {
    'Content-Type': 'application/json',
  },
})


// 账号数据接口
interface IAccount {
  cc: number;
  phone: string;
  id: string;
  StaticPubKey: string;
  StaticPriKey: string;
  IdentityPubKey: string;
  IdentityPriKey: string;
  Hash: string;

  edge_routing_info?: string;
  login?: string;
  mcc?: string;
  mnc?: string;
  phone_id?: string;
  pushname?: string;
  sim_mcc?: string;
  sim_mnc?: string;
  status?: string;
}


const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  socks5: "", //  代理，格式：socks5://账号:密码@IP:Port
  cc: "", // 手机区号
  phone: "", // 手机号
  lg: "en", // 语言缩写(例：en)
  lc: "US", // 国家缩写(例：US)
  code: "" // 验证码
  // Reg_Status:'Business',  // 账号类型：普通/商业(Personal/Business)
});

// 校验规则
const rules = reactive<FormRules>({
  socks5: [
    {
      required: true,
      message: "请输入代理(格式：socks5://账号:密码@IP:Port)",
      trigger: "blur"
    }
  ],
  cc: [{ required: true, message: "请输入手机区号", trigger: "blur" }],
  phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
  lg: [{ required: true, message: "请输入国家语言", trigger: "blur" }],
  lc: [{ required: true, message: "请输入国家缩写", trigger: "blur" }]
  // Reg_Status: [{ required: true, message:'请输入账号类型(Personal/Business)', trigger: 'blur' }],
});

// 校验按钮禁用状态
const registerDisabled = ref(true);
// 表单loading
const formLoading = ref(false);

// 已注册的账号信息
let account: IAccount[] = reactive([
  // {
  //     cc: 11,
  //     phone: '22',
  //     id: "0",
  //     StaticPubKey: "1",
  //     StaticPriKey: "2",
  //     IdentityPubKey: "3",
  //     IdentityPriKey: "4",
  //     Hash: "5",
  // }
]);

// 验证码输入框监听：控制校验按钮显隐
function codeInput() {
  if (ruleForm.code === "" || ruleForm.code.indexOf("-") !== -1) {
    registerDisabled.value = true;
  } else {
    registerDisabled.value = false;
  }
}

// 发送验证码
const sendCode = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(valid => {
    if (valid) {
      // 请求接口
      formLoading.value = true;
      let query = {
        socks5: ruleForm.socks5,
        cc: Number.parseInt(ruleForm.cc),
        phone: ruleForm.phone,
        lg: ruleForm.lg,
        lc: ruleForm.lc
      };
      console.log("query:", query);
      register_manual(query).then((res) => {
        console.log('data222:', res);

        
        console.log("接口请求成功：", res);
        
        // 状态：send为成功，此时给出提示并解禁校验按钮
        if (res.Code === 0 && res.Msg === "ok") {
          let data = res.Data;

          // 状态记录
          let reason = {
            too_recent: "该账号近期尝试过注册WhatsAPP"
          };

          if (data.status === "sent") {
            ElNotification({
              title: "Success",
              message: "验证码已发送",
              type: "success"
            });
          } else {
            ElNotification({
              title: "Error",
              message: "验证码发送失败：" + data.reason,
              type: "error"
            });
          }
        } else {
          ElNotification({
            title: "Error",
            message: "接口请求失败",
            type: "error"
          });
          formLoading.value = false;
        }

        
      }).catch((err) => {
        console.log('err222:', err);
        console.log('err:',err);
        ElNotification({
          title: "Error",
          message: "接口请求失败：" + err,
          type: "error"
        });
        formLoading.value = false;
      }).finally(() => {
        // 关闭loading
        formLoading.value = false;
      });

      return;

      axiosInstance(registerWhatsApp, {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          socks5: ruleForm.socks5,
          cc: Number.parseInt(ruleForm.cc),
          phone: ruleForm.phone,
          lg: ruleForm.lg,
          lc: ruleForm.lc
        }
      })
        .then(function (res) {``
          console.log("接口请求成功：", res);
          // 状态：send为成功，此时给出提示并解禁校验按钮
          if (res.data.Code === 0 && res.data.Msg === "ok") {
            let data = res.data.Data;

            // 状态记录
            let reason = {
              too_recent: "该账号近期尝试过注册WhatsAPP"
            };

            if (data.status === "sent") {
              ElNotification({
                title: "Success",
                message: "验证码已发送",
                type: "success"
              });
            } else {
              ElNotification({
                title: "Error",
                message: "验证码发送失败：" + data.reason,
                type: "error"
              });
            }
          } else {
            ElNotification({
              title: "Error",
              message: "接口请求失败",
              type: "error"
            });
          }
        })
        .catch(function (err) {
          console.log('err:',err);
          ElNotification({
            title: "Error",
            message: "接口请求失败：" + err,
            type: "error"
          });
        })
        .finally(() => {
          // 关闭loading
          formLoading.value = false;
        });
    } else {
      ElNotification({
        title: "Error",
        message: "表单数据填写错误",
        type: "error"
      });
      return false;
    }
  });
};

// 校验验证码并注册
const Register = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(valid => {
    if (valid) {
      console.log("校验");
      formLoading.value = true;

      let query = {
          socks5: ruleForm.socks5,
          cc: Number.parseInt(ruleForm.cc),
          phone: ruleForm.phone,
          lg: ruleForm.lg,
          lc: ruleForm.lc,
          code: ruleForm.code
        }

      verify_manual(query).then(res => {
        
        console.log("接口请求成功：", res);
        if (res.Code === 0 && res.Msg === "ok") {
          let data = res.Data;
          if (data.status === "ok" && data.StaticPubKey) {
            ElNotification({
              title: "Success",
              message: "注册成功",
              type: "success"
            });

            // 记录账号数据
            account.push({
              ...data,
              cc: Number.parseInt(ruleForm.cc),
              phone: ruleForm.phone
            });
          } else {
            // 提示异常信息
          }
        } else {
          ElNotification({
            title: "Error",
            message: "接口请求失败",
            type: "error"
          });
        }
      }).catch(err => {
          
        ElNotification({
          title: "Error",
          message: "接口请求失败：" + err,
          type: "error"
        });
      }).finally(() => {
        // 关闭loading
        formLoading.value = false;
      });

      return;
      axiosInstance(verifyWhatsApp, {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          socks5: ruleForm.socks5,
          cc: Number.parseInt(ruleForm.cc),
          phone: ruleForm.phone,
          lg: ruleForm.lg,
          lc: ruleForm.lc,
          code: ruleForm.code
        }
      })
        .then(function (res) {
          console.log("接口请求成功：", res);
          if (res.data.Code === 0 && res.data.Msg === "ok") {
            let data = res.data.Data;
            if (data.status === "ok" && data.StaticPubKey) {
              ElNotification({
                title: "Success",
                message: "注册成功",
                type: "success"
              });

              // 记录账号数据
              account.push({
                ...data,
                cc: Number.parseInt(ruleForm.cc),
                phone: ruleForm.phone
              });
            } else {
              // 提示异常信息
            }
          } else {
            ElNotification({
              title: "Error",
              message: "接口请求失败",
              type: "error"
            });
          }
        })
        .catch(function (err) {
          ElNotification({
            title: "Error",
            message: "接口请求失败：" + err,
            type: "error"
          });
        })
        .finally(() => {
          // 关闭loading
          formLoading.value = false;
        });
    } else {
      ElNotification({
        title: "Error",
        message: "表单数据填写错误",
        type: "error"
      });
      return false;
    }
  });
};

// 复制
function copyAccount(index: number) {
  console.log("copy:", account[index]);
  let text = getAccountText(account[index]);
  copy(text);
}

// 下载
function download(index: number) {
  console.log("download:", account[index]);
  let data = account[index];
  let phone = `${data.cc}${data.phone}`;
  let text = getAccountText(account[index]);
  downloadText(phone, text);
}

// 拼接账号文本
function getAccountText(data: IAccount): string {
  let text = `${data.cc}${data.phone},${data.StaticPubKey},${data.StaticPriKey},${data.IdentityPubKey},${data.IdentityPriKey},${data.Hash}`;
  return text;
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>


<style scoped lang="scss">
.default-main {
  width: 100%;
  padding: 0 30px;
  .title-text {
    margin: 20px 0 10px 0;
    color: #409eff;
  }
  .WAFrom {
    width: 50%;
    min-width: 400px;
    padding: 20px;
  }
  .el-table {
    width: 70%;
  }

  @media (max-width: 1280px) {
    .button-box{
      flex-direction: column;
      align-items: flex-start;
      button{
        margin: 10px 10px 10px 0;
      }
    }

  }

}
</style>
