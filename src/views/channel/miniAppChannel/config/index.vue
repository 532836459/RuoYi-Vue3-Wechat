<template>
  <div class="app-container" style="overflow: auto">
    <el-card class="!border-none" shadow="never">
      <el-alert
          type="warning"
          title="温馨提示：填写微信小程序开发配置，请前往微信公众平台申请小程序并完成认证"
          :closable="false"
          show-icon
      />
    </el-card>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="160px">
      <el-card class="!border-none " shadow="never">
        <div class="font-medium mb-7">微信小程序</div>
        <el-form-item label="小程序名称" prop="name">
          <div class="w-80">
            <el-input v-model="form.name" placeholder="请输入小程序名称" />
          </div>
        </el-form-item>
        <el-form-item label="原始ID" prop="primaryId">
          <div class="w-80">
            <el-input v-model="form.primaryId" placeholder="请输入原始ID" />
          </div>
        </el-form-item>
        <el-form-item label="小程序码" prop="qrCode">
          <div>
            <image-upload v-model="form.qrCode" :limit="1" :isShowTip="false"/>
            <div class="form-tips">建议尺寸：宽400px*高400px。jpg，jpeg，png格式</div>
          </div>
        </el-form-item>
      </el-card>
      <el-divider border-style="dashed" />

      <el-card class="!border-none " shadow="never">
        <div class="font-medium ">开发者ID</div>
        <el-form-item label="AppID" prop="appId">
          <div class="w-80">
            <el-input v-model="form.appId" placeholder="请输入AppID" />
          </div>
        </el-form-item>
        <el-form-item label="AppSecret" prop="appSecret">
          <div>
            <div class="w-80">
              <el-input v-model="form.appSecret" placeholder="请输入AppSecret" />
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="form-tips">
            小程序账号登录微信公众平台，点击开发>开发设置->开发者ID，设置AppID和AppSecret
          </div>
        </el-form-item>
      </el-card>

      <el-divider border-style="dashed" />

      <el-card class="!border-none " shadow="never">
        <div class="font-medium ">服务器域名</div>
        <el-form-item label="request合法域名" prop="requestDomain">
          <div>
            <div class="flex">
              <div class="mr-4 w-80">
                <el-input v-model="form.requestDomain" disabled />
              </div>
              <el-button @click="copyData(form.requestDomain)">复制</el-button>
            </div>
            <div class="form-tips">
              小程序账号登录微信公众平台，点击开发>开发设置->服务器域名，填写https协议域名
            </div>
          </div>
        </el-form-item>
        <el-form-item label="socket合法域名" prop="socketDomain">
          <div>
            <div class="flex">
              <div class="mr-4 w-80">
                <el-input v-model="form.socketDomain" disabled />
              </div>
              <el-button @click="copyData(form.socketDomain)">复制</el-button>
            </div>
            <div class="form-tips">
              小程序账号登录微信公众平台，点击开发>开发设置->服务器域名，填写wss协议域名
            </div>
          </div>
        </el-form-item>
        <el-form-item label="uploadFile合法域名" prop="uploadFileDomain">
          <div>
            <div class="flex">
              <div class="mr-4 w-80">
                <el-input v-model="form.uploadFileDomain" disabled />
              </div>
              <el-button @click="copyData(form.uploadFileDomain)">复制</el-button>
            </div>
            <div class="form-tips">
              小程序账号登录微信公众平台，点击开发>开发设置->服务器域名，填写https协议域名
            </div>
          </div>
        </el-form-item>
        <el-form-item label="downloadFile合法域名" prop="downloadFileDomain">
          <div>
            <div class="flex">
              <div class="mr-4 w-80">
                <el-input v-model="form.downloadFileDomain" disabled />
              </div>
              <el-button @click="copyData(form.downloadFileDomain)">复制</el-button>
            </div>
            <div class="form-tips">
              小程序账号登录微信公众平台，点击开发>开发设置->服务器域名，填写https协议域名
            </div>
          </div>
        </el-form-item>
        <el-form-item label="tcp合法域名" prop="tcpDomain">
          <div>
            <div class="flex">
              <div class="mr-4 w-80">
                <el-input v-model="form.tcpDomain" disabled />
              </div>
              <el-button @click="copyData(form.tcpDomain)">复制</el-button>
            </div>
            <div class="form-tips">
              小程序账号登录微信公众平台，点击开发>开发设置->服务器域名，填写tcp协议域名
            </div>
          </div>
        </el-form-item>
        <el-form-item label="udp合法域名" prop="udpDomain">
          <div>
            <div class="flex">
              <div class="mr-4 w-80">
                <el-input v-model="form.udpDomain" disabled />
              </div>
              <el-button @click="copyData(form.udpDomain)">复制</el-button>
            </div>
            <div class="form-tips">
              小程序账号登录微信公众平台，点击开发>开发设置->服务器域名，填写udp协议域名
            </div>
          </div>
        </el-form-item>
      </el-card>
      <el-divider border-style="dashed" />

      <el-card class="!border-none " shadow="never">
        <div class="font-medium ">业务域名</div>
        <el-form-item label="业务域名" prop="businessDomain">
          <div>
            <div class="flex">
              <div class="mr-4 w-80">
                <el-input v-model="form.businessDomain" disabled />
              </div>
              <el-button @click="copyData(form.businessDomain)">复制</el-button>
            </div>
            <div class="form-tips">
              小程序账号登录微信公众平台，点击开发>开发设置->业务域名，填写业务域名
            </div>
          </div>
        </el-form-item>
      </el-card>
    </el-form>
    <el-affix position="bottom" :offset="35" style="text-align: center;">
      <el-button type="primary" @click="handleSave">
        保存
      </el-button>
    </el-affix>
  </div>
</template>
<script setup name="wxAppConfig">
import {getMiniAppConfig, saveMiniAppConfig} from '@/api/channel/wxMiniApp.js';

const { proxy } = getCurrentInstance();
const data = reactive({
  form:{
    name: '',
    primaryId: '',
    qrCode: '',
    appId: '',
    appSecret: '',
    businessDomain: '',
    downloadFileDomain: '',
    requestDomain: '',
    socketDomain: '',
    tcpDomain: '',
    udpDomain: '',
    uploadFileDomain: ''
  },
  rules: {
    name: [
      { required: true, message: "键不能为空", trigger: "blur" }
    ],
    primaryId: [
      { required: true, message: "键不能为空", trigger: "blur" }
    ],
    appId: [
      { required: true, message: "键不能为空", trigger: "blur" }
    ],
    appSecret: [
      { required: true, message: "键不能为空", trigger: "blur" }
    ]
  }
})
const { form, rules } = toRefs(data);

function getDataDetail() {
  getMiniAppConfig().then(res => {
    for (const key in form.value) {
      form.value[key] = res.data[key]
    }
  });
}

function handleSave() {
  proxy.$refs["formRef"].validate(valid => {
    if (valid) {
      saveMiniAppConfig(form.value).then(() => {
        proxy.$modal.msgSuccess("保存成功");
      })
    }
  })
}

function copyData(text) {
  navigator.clipboard.writeText(text).then(() => {
    proxy.$modal.msgSuccess("复制成功");
  }, () => {
    proxy.$modal.msgError("复制失败");
  })
}

getDataDetail();
</script>
<style lang="scss" scoped>
.el-card{
  min-width: 700px;
}
</style>
