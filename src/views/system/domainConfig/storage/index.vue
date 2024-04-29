<template>
  <div class="app-container">
    <el-card style="border: none" shadow="never">
      <el-alert
          type="warning"
          title="温馨提示：1.切换存储方式后，需要将资源文件传输至新的存储端；2.请勿随意切换存储方式，可能导致图片无法查看"
          :closable="false"
          show-icon
      ></el-alert>
    </el-card>
    <el-table v-loading="loading" :data="domainConfigList">
      <el-table-column label="存储方式" align="center" prop="name" />
      <el-table-column label="存储位置" min-width="120" align="center" prop="describe" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="na_sys_enable" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:domainConfig:edit']">设置</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 设置存储配置对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="domainConfigRef" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="存储方式" prop="name">
          <div>
            <el-radio model-value>{{ getStorageInfo?.name }} </el-radio>
            <div class="form-tips">{{ getStorageInfo?.tips }}</div>
          </div>
        </el-form-item>
        <div v-if="form.alias !== StorageEnum.LOCAL">
          <div v-if="form.alias === StorageEnum.QINIU">
            <el-form-item label="存储空间名称" prop="bucket">
              <el-input v-model="form.bucket" placeholder="请输入存储空间名称(Bucket)" />
            </el-form-item>
            <el-form-item label="ACCESS_KEY" prop="accessKey">
              <el-input v-model="form.accessKey" placeholder="请输入ACCESS_KEY(AK)" />
            </el-form-item>
            <el-form-item label="SECRET_KEY" prop="secretKey">
              <el-input v-model="form.secretKey" placeholder="请输入SECRET_KEY(SK)" />
            </el-form-item>
            <el-form-item label="存储区域" prop="region">
              <el-select v-model="form.region" placeholder="请选择存储区域">
                <el-option
                   v-for="dict in na_qiniu_region"
                   :key="dict.value"
                   :label="dict.label"
                   :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </div>
          <div v-else-if="form.alias === StorageEnum.ALIYUN">
            <el-form-item label="Bucket 名称" prop="bucket">
              <el-input v-model="form.bucket" placeholder="请输入Bucket 名称" />
            </el-form-item>
            <el-form-item label="AccessKey ID" prop="accessKey">
              <el-input v-model="form.accessKey" placeholder="请输入AccessKey ID" />
            </el-form-item>
            <el-form-item label="AccessKey Secret" prop="secretKey">
              <el-input v-model="form.secretKey" placeholder="请输入AccessKey Secret" />
            </el-form-item>
            <el-form-item label="地域节点" prop="region">
              <el-select v-model="form.region" placeholder="请选择地域节点">
                <el-option
                    v-for="dict in na_aliyun_endpoint"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </div>
          <div v-else-if="form.alias === StorageEnum.QCLOUD">
            <el-form-item label="存储桶名称(Bucket)" prop="bucket">
              <el-input v-model="form.bucket" placeholder="请输入存储桶名称" />
            </el-form-item>
            <el-form-item label="App ID" prop="bucket">
              <el-input v-model="form.appId" placeholder="请输入App ID" />
            </el-form-item>
            <el-form-item label="Secret ID" prop="bucket">
              <el-input v-model="form.accessKey" placeholder="请输入Secret ID" />
            </el-form-item>
            <el-form-item label="Secret Key" prop="accessKey">
              <el-input v-model="form.secretKey" placeholder="请输入Secret Key" />
            </el-form-item>
            <el-form-item label="地域节点" prop="region">
              <el-select v-model="form.region" placeholder="请选择地域节点">
                <el-option
                    v-for="dict in na_qcloud_region"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </div>
          <el-form-item label="空间域名" prop="domain">
            <el-input v-model="form.domain"  placeholder="请输入空间域名(Domain)" />
            <div class="form-tips">
              请补全http://或https://，例如https://static.cloud.com
            </div>
          </el-form-item>
        </div>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="'0'">关闭</el-radio>
            <el-radio :label="'1'">开启</el-radio>
          </el-radio-group>
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

<script setup name="DomainConfig">
import { selectStorageList, selectStorageDetail, updateStorage} from "@/api/system/domainConfig";

const { proxy } = getCurrentInstance();
const {
  na_sys_enable,
  na_qiniu_region,
  na_aliyun_endpoint,
  na_qcloud_region
} = proxy.useDict("na_sys_enable", "na_qiniu_region", "na_aliyun_endpoint","na_qcloud_region");

const domainConfigList = ref([]);
const open = ref(false);
const loading = ref(true);
const ids = ref([]);
const title = ref("");

const data = reactive({
  form: {},
  rules: {
    bucket: [{ required: true, message: "存储空间名称不能为空", trigger: "blur" },],
    appId: [{ required: true, message: "appId不能为空", trigger: "blur" },],
    accessKey: [{ required: true, message: "ACCESS_KEY不能为空", trigger: "blur" },],
    secretKey: [{ required: true, message: "SECRET_KEY不能为空", trigger: "blur" },],
    domain: [{ required: true, message: "空间域名不能为空", trigger: "blur" },],
    region: [{ required: true, message: "REGION不能为空", trigger: "blur" },],
  }
});

const { form, rules } = toRefs(data);

/** 获取存储列表配置 */
function getList() {
  loading.value = true;
  selectStorageList().then(response =>{
    domainConfigList.value = response.data;
    loading.value = false;
  })
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  selectStorageDetail({alias: row.alias}).then(response => {
    console.log(response);
    form.value = response.data;
    open.value = true;
    title.value = "设置存储";
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
    appId: null,
    bucket: null,
    accessKey: null,
    secretKey: null,
    domain: null,
    region: null
  };
  proxy.resetForm("domainConfigRef");
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["domainConfigRef"].validate(valid => {
    if (valid) {
      updateStorage(form.value).then(response =>{
        proxy.$modal.msgSuccess("修改成功");
        open.value = false;
        getList();
      })
    }
  });
}

let StorageEnum;
(function (StorageEnum) {
  StorageEnum["LOCAL"] = "local";
  StorageEnum["QINIU"] = "qiniu";
  StorageEnum["ALIYUN"] = "aliyun";
  StorageEnum["QCLOUD"] = "qcloud";
})(StorageEnum || (StorageEnum = {}));

const storageArr = [
  {
    name: '本地存储',
    type: StorageEnum.LOCAL,
    tips: '本地存储方式不需要配置其他参数'
  },
  {
    name: '七牛云存储',
    type: StorageEnum.QINIU,
    tips: '切换七牛云存储后，素材库需要重新上传至七牛云'
  },
  {
    name: '阿里云OSS',
    type: StorageEnum.ALIYUN,
    tips: '切换阿里云OSS后，素材库需要重新上传至阿里云OSS'
  },
  {
    name: '腾讯云OSS',
    type: StorageEnum.QCLOUD,
    tips: '切换腾讯云OSS后，素材库需要重新上传至腾讯云OSS'
  }
]
const getStorageInfo = computed(() => {
  return storageArr.find((item) => item.type === form.value.alias)
})
getList();
</script>
