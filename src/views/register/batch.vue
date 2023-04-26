<!--
 * @Author: hechao “chao.he@genowis.com”
 * @LastEditTime: 2023-04-25 00时
 * @Description: 批量注册
-->

<template>
  <div class="default-main">
    <h2 class="title-text">批量注册(商业版)</h2>
    <el-form
      class="WAFrom"
      ref="ruleFormRef"
      :model="formData"
      status-icon
    >
      <el-row v-for="(item, index) in formData.items" :key="index">
        <el-col :span="12">
          <el-form-item :prop="'items['+ index +'].country'" label="国家" :inline="true" required :rules="rules.country">
            <el-select
              :style="{ width: '320px' }"
              v-model="item.country"
              placeholder="选择账号所属国家"
              filterable
            >
              <el-option
                v-for="option in countries"
                :key="option.code"
                :label="getCountryLabel(option)"
                :value="option.code"
              >
                <span style="float: left">{{ getCountryLabel(option) }}</span>
                <span
                  style="
                    float: right;
                    color: var(--el-text-color-secondary);
                    font-size: 13px;
                  "
                  >{{ option.code }}</span
                >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item :prop="'items['+ index +'].count'" label="数量" :inline="true" required :rules="rules.count">
            <el-input
              type="number"
              min="1"
              max="100"
              :input-style="{ width: '100px' }"
              v-model="item.count"
              placeholder="输入需要的账号数量"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>

        <el-col :span="2" v-if="index === 0">
          <el-button
            type="primary"
            @click="addItem()"
            >新增</el-button
          >
        </el-col>

        <el-col :span="2" v-else>
          <el-button
            type="danger"
            @click="deleteItem(index)"
            >删除</el-button
          >
        </el-col>
      </el-row>
      <!-- </template> -->

      <el-row>
        <el-col :span="21">
          <el-form-item label="备注" prop="remark" required :rules="rules.remark" style="width: 100%">
            <el-input
              v-model="formData.remark"
              :autosize="{ minRows: 3, maxRows: 6 }"
              type="textarea"
              placeholder="输入备注信息"
            />
          </el-form-item>
        </el-col>

      </el-row>

      <el-form-item>
        <el-button
          type="primary"
          @click="submit()"
          style="width: 144px; margin-top: 20px;"
          :loading="loading"
          >{{ loading?"任务进行中":"发起任务" }}</el-button
        >
        <!-- <el-button @click="resetForm(ruleFormRef)">重置</el-button> -->
      </el-form-item>
    </el-form>

    <!-- 信息展示 -->
    <div class="account-info-box">
      <h2 class="title-text" style="margin: 30px 0 20px 0">账号数据</h2>

      <!-- 筛选框 -->
      <div class="filter-box">
        <!-- 国家 -->
        <el-select
          :style="{ width: '220px', 'margin-right': '20px' }"
          v-model="searchData.country"
          placeholder="筛选账号所属国家"
          filterable
          clearable 
        >
          <el-option
            v-for="option in countries"
            :key="option.code"
            :label="getCountryLabel(option)"
            :value="option.code"
          >
            <span style="float: left">{{ getCountryLabel(option) }}</span>
            <span
              style=" float: right;color: var(--el-text-color-secondary);font-size: 13px;"
              >{{ option.code }}</span
            >
          </el-option>
        </el-select>

        <!-- 日期 -->
        <el-date-picker
          v-model="searchData.date"
          :style="{ 'margin-right': '20px' }"
          type="datetimerange"
          unlink-panels
          range-separator="-"
          start-placeholder="起始时间"
          end-placeholder="截止时间"
          :shortcuts="shortcuts"
        />
        
        <el-button type="primary" @click="search()" style="width: 144px"
          >筛选</el-button
        >
      </div>

      <div class="handle-box">
        <el-button type="primary" @click="download_all()" style="width: 144px" :disabled="accountList.length===0"
          >全部下载-{{ accountList.length }}条</el-button
        >
      </div>

      <el-table class="el-table" :data="accountList" max-height="600" v-loading="tableLoading">
        <el-table-column prop="Phone" label="手机号码" width="140" />
        <el-table-column prop="CreateTime" label="创建时间" width="180" />
        <el-table-column prop="Cc" label="国家区号" />
        <el-table-column prop="CountryCode" label="国家" >
        
        </el-table-column>
        <!-- <el-table-column prop="id" label="ID" /> -->
        <el-table-column prop="StaticPubKey" label="公钥" width="180" />
        <el-table-column prop="StaticPriKey" label="私钥" width="180" />
        <el-table-column prop="IdentityPubKey" label="身份公钥" width="180" />
        <el-table-column prop="IdentityPriKey" label="身份私钥" width="180" />
        <el-table-column prop="Hash" label="Hash" width="180" />
        
        <!-- getCountryByCode -->

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

      
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import type { FormInstance, FormRules, FormItemRule } from "element-plus";
import { ElNotification } from "element-plus";
import axios from "axios";
import { copy } from "@/utils/wa/clipboard";
import { downloadText } from "@/utils/wa/downloadText";
import { message } from "@/utils/message";
import { register, list } from "@/api/wa/index";
import { countries, getCountryByCode } from "@/utils/wa/countryInfo";
import { changeDateTime } from '@/utils/datetime'

// console.log("countries:",countries);
// 表单数据
const ruleFormRef = ref(null);


// 批量注册表单
// 接口定义
interface IForm{
  country: string,
  count: string,
}
// 表单数据
const formData = reactive({
  items: [{
    country: "",
    count: "",
  }] as IForm[],
  remark: ""
})

// 发起任务按钮的loading
const loading = ref(false);

// 表格数据加载loading
const tableLoading = ref(true);

// 账号数据
let accountList_origin = [];
const accountList = reactive([]);

// 校验规则
const rules = reactive<FormRules>({
  country: [{ required: true, message: "请选择国家", trigger: "blur" }],
  count: [{ required: true, message: "请输入号码数量", trigger: "blur" }],
  remark: [{ required: true, message: "请填写备注信息", trigger: "blur" }],
});
// 搜索
const searchData = reactive({
  country: '',
  date:''
})


// 日期组件快捷选项
const shortcuts = [
  {
    text: '今日',
    value: () => {
      const start = changeDateTime(new Date(), "start");
      const end = changeDateTime(new Date(), "end");
      return [start, end]
    },
  },
  {
    text: '近两日',
    value: () => {
      const start = changeDateTime(new Date(), "start");
      const end = changeDateTime(new Date(), "end");
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
      return [start, end]
    },
  },
  {
    text: '本周',
    value: () => {
      const start = changeDateTime(new Date(), "start");
      const end = changeDateTime(new Date(), "end");
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
]


/**挂载 */
onMounted(() => {
  getList();
});

/**发起任务 */
const submit = () => {
  ruleFormRef.value.validate(valid => {
    if (valid) {
      loading.value = true;
      console.log('表单通过');
      
      let id = window.localStorage.getItem('wa_id');

      if (!id) {
        ElNotification({
            title: "Error",
            message: "登录状态异常，请重新登录后尝试",
            type: "error"
        });
        return;
      }
      let query:any = {
        "userId": Number.parseInt(id),
        "bz": formData.remark,
        "batchParamGroups": []
      };
      for (let i = 0; i < formData.items.length; i++) {
        let item = formData.items[i];
        let country: any = countries.filter(country => item.country == country.code)[0];
        query.batchParamGroups.push({
          cc: country.areaCode,
          count: Number.parseInt(item.count),
          country: country.smsactivateCode,
          countryCode: country.code,
        })
      }
      console.log("query:", query);
      query = JSON.stringify(query);
      // return;
      // 接口请求
      register(query).then(data => {
        // 注：返回值已在Axios拦截器统一处理，接口请求失败时data为false并给出接口失败提示
        if (!data) return;
        let count = 0;
        for (let i = 0; i < data.Data.length;i++) {
          count += data.Data[i].count;
        }
        if (count !== 0) {
          message("账号注册成功，请在列表查看", { type: "success" });
          getList();
        } else {
          message("任务已结束，未成功注册账号", { type: "error" });
        }
        
      }).finally(() => {
        loading.value = false;
      });
        
    } else {
      ElNotification({
        title: "Error",
        message: "请将数据填写完整",
        type: "error"
      });
      return false;
    }
  });
};

/** 获取账号列表 */
function getList() {
  // 接口请求
  list({}).then(data => {
      if (!data) return;
      accountList_origin = [...data.Data];
      accountList.splice(0, accountList.length, ...data.Data);
      message("账号列表已刷新", { type: "success" });
  }).finally(() => {
    tableLoading.value = false;
  })
}

/**复制 */
function copyAccount(index: number) {
  let text = getAccountText(accountList[index]);
  copy(text);
}

/**下载 */
function download(index: number) {
  let data = accountList[index];
  let phone = `${data.Phone}`;
  let text = getAccountText(accountList[index]);
  downloadText(phone, text);
}

/**拼接账号文本 */
function getAccountText(data: any): string {
  let text = `${data.Phone},${data.StaticPubKey},${data.StaticPriKey},${data.IdentityPubKey},${data.IdentityPriKey},${data.Hash}`;
  return text;
}

/**全部下载 */
function download_all() {
  let text = "";
  let count = accountList.length;
  for (let i = 0; i < count; i++) {
    let item = accountList[i];
    let itemText = getAccountText(item) + "\r\n";
    text += "+"+itemText;
  }
  downloadText(`wa-商业号-${count}条`, text);
}

/**搜索 */
function search() {
  console.log("searchData:", searchData);
  // 国家简称（两位字母缩写）
  let country = searchData.country;
  // CountryCode
  // 根据日期选择器设置时间
  let start_time, end_time;
  if (searchData.date) {
    start_time = new Date(searchData.date[0]).getTime();
    end_time = new Date(searchData.date[1]).getTime();
  }

  // 直接筛选数据
  let search_list = accountList_origin.filter(data => {
    let create_time = new Date(data.CreateTime).getTime();
    let flag = true;
    // 国家
    if (country && data.CountryCode !== country) flag = false;
    // 时间
    if (searchData.date && !(create_time > start_time && create_time < end_time)) flag = false;
    return flag;
  })
  accountList.splice(0, accountList.length, ...search_list);
}

/**新增一行 */
function addItem() {
  let item: IForm = {
    country: "",
    count: "",
  }
  formData.items.push(item);
}

/**删除当前行 */
function deleteItem(index) {
  formData.items.splice(index, 1);
}

/**计算下拉展示值 */
function getCountryLabel(item) {
  return `+${item.areaCode} ${item.name_zh}(${item.name_en})`;
}
</script>

<style scoped lang="scss">
.default-main {
  width: 100%;
  padding: 0 30px;
  .title-text {
    margin: 20px 0 10px 0;
    color: #409eff;
  }
  .el-table {
    width: 70%;
  }

  .el-row {
    width: 800px;
    margin-top: 5px;
    padding: 8px 20px 8px 0;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    // border: 1px solid #CCC;
    border-radius: 4px;
    .el-col {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      border-radius: 4px;
    }
  }
  .el-row:first-child{
    margin-top: 20px;
  }
  .el-form-item {
    margin: 0;
  }

  .account-info-box {
    margin-top: 20px;
  }

  .handle-box {
    margin: 20px 0;
  }
  .filter-box{
    width: 720px;
    height: 40px;
    display: flex;
    align-items: center;
  }
}
</style>
