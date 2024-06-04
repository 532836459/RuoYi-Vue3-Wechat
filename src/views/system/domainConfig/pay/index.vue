<template>
  <div class="app-container">
    <el-card style="border: none" shadow="never">
      <el-alert
          type="warning"
          title="温馨提示：设置系统支持的支付方式"
          :closable="false"
          show-icon
      ></el-alert>
    </el-card>
    <el-table v-loading="loading" :data="payList">
      <el-table-column label="支付方式" align="center" prop="way" >
        <template #default="scope">
          <dict-tag :options="na_pay_way" :value="scope.row.way"/>
        </template>
      </el-table-column>
      <el-table-column label="显示名称" align="center" prop="name" />

      <el-table-column label="图标" align="center" prop="icon">
        <template #default="scope">
          <image-preview :src="scope.row.icon" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="默认支付" align="center" prop="isDefault">
        <template #default="scope">
          <dict-tag :options="na_whether" :value="scope.row.isDefault"/>
        </template>
      </el-table-column>
      <el-table-column label="启用状态" align="center" prop="isEnable">
        <template #default="scope">
          <dict-tag :options="na_sys_enable" :value="scope.row.isEnable"/>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['wechat:pay:edit']">配置</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改支付配置对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="payRef" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="支付方式" prop="way">
          <dict-tag :options="na_pay_way" :value="form.way"/>
        </el-form-item>
        <el-form-item label="显示名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入显示名称" />
        </el-form-item>
        <el-form-item label="渠道图标" prop="icon">
          <div>
            <image-upload v-model="form.icon" :limit="1" :isShowTip="false"/>
            <div class="form-tips">建议尺寸：200*200像素，支持jpg，jpeg，png格式</div>
          </div>
        </el-form-item>
        <!--    微信支付    -->
        <template v-if="form.way === 2">
          <el-form-item prop="configDetail.interfaceVersion" label="接口版本">
            <div>
                <el-tag type="success" >V3</el-tag>
              <div class="form-tips">暂时只支持V3版本</div>
            </div>
          </el-form-item>

          <el-form-item label="商户类型" prop="configDetail.merchantType">
            <div>
              <el-tag type="success">普通商户</el-tag>
              <div class="form-tips">
                暂时只支持普通商户类型，服务商户类型模式暂不支持
              </div>
            </div>
          </el-form-item>

          <el-form-item label="商户号" prop="configDetail.mchId">
            <div class="flex-1">
              <el-input
                  v-model="form.configDetail.mchId"
                  placeholder="请输入微信支付商户号"
              />
              <div class="form-tips">微信支付商户号（MCHID）</div>
            </div>
          </el-form-item>

          <el-form-item label="商户API密钥" prop="configDetail.paySignKey">
            <el-input
                v-model="form.configDetail.paySignKey"
                placeholder="请输入微信支付商户API密钥"
            />
            <span class="form-tips">微信支付商户API密钥（paySignKey）</span>
          </el-form-item>

          <el-form-item label="支付证书" prop="configDetail.privateCert">
            <el-input
                type="textarea"
                rows="3"
                v-model="form.configDetail.privateCert"
                placeholder="请输入微信支付证书"
            />
            <span class="form-tips">
                            微信支付证书（apiclient_cert.pem），前往微信商家平台生成并黏贴至此处
                        </span>
          </el-form-item>

          <el-form-item label="支付证书密钥" prop="configDetail.privateKey">
            <el-input
                type="textarea"
                rows="3"
                v-model="form.configDetail.privateKey"
                placeholder="请输入微信支付证书密钥"
            />
            <span class="form-tips">
                            微信支付证书密钥（apiclient_key.pem），前往微信商家平台生成并黏贴至此处
                        </span>
          </el-form-item>
        </template>
        <el-form-item label="排序编号" prop="sort">
          <el-input-number v-model="form.sort" :min="1"/>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="默认支付" prop="isDefault">
              <el-radio-group v-model="form.isDefault">
                <el-radio
                    v-for="dict in na_whether"
                    :key="dict.value"
                    :label="parseInt(dict.value)"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="启用状态" prop="isEnable">
              <el-radio-group v-model="form.isEnable">
                <el-radio
                    v-for="dict in na_sys_enable"
                    :key="dict.value"
                    :label="parseInt(dict.value)"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Pay">
import { listPay, updatePay,selectConfigByWay } from "@/api/system/pay";

const { proxy } = getCurrentInstance();
const { na_sys_enable,na_pay_way,na_whether } = proxy.useDict('na_sys_enable','na_pay_way','na_whether');

const payList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
        way: null,
        isDefault: null,
        isEnable: null,
        tenantId: null,
    orderByColumn: 'create_time',
    isAsc: 'desc'
  },
  rules: {
    configDetail:{
      mchId: [
        { required: true, message: "商户号不能为空", trigger: "blur" }
      ],
      paySignKey: [
        { required: true, message: "商户API密钥不能为空", trigger: "blur" }
      ],
      privateCert: [
        { required: true, message: "支付证书不能为空", trigger: "blur" }
      ],
      privateKey: [
        { required: true, message: "支付证书密钥不能为空", trigger: "blur" }
      ]
    }
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询支付配置列表 */
function getList() {
  loading.value = true;
  listPay(queryParams.value).then(response => {
    payList.value = response.rows;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    name: null,
    icon: null,
    way: null,
    sort: null,
    isDefault: null,
    isEnable: null,
    tenantId: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null,
    configDetail: {}
  };
  proxy.resetForm("payRef");
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  selectConfigByWay(row.way).then(response => {
    form.value = response.data;
    form.value.configDetail = JSON.parse(response.data.configDetail);
    console.log(form.value);
    open.value = true;
    title.value = "修改支付配置";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["payRef"].validate(valid => {
    if (valid) {
      form.value.configDetail = JSON.stringify(form.value.configDetail);
      updatePay(form.value).then(response => {
        proxy.$modal.msgSuccess("修改成功");
        open.value = false;
        getList();
      });
    }
  });
}

getList();
</script>
