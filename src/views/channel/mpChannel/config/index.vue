<template>
  <div class="app-container" style="overflow: auto">
    <el-card class="!border-none" shadow="never">
      <el-alert
          type="warning"
          title="温馨提示：填写微信公众号开发配置，请前往微信公众平台申请服务号并完成认证"
          :closable="false"
          show-icon
      />
    </el-card>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="160px">
      <el-card class="!border-none" shadow="never">
        <div class="font-medium mb-7">微信公众号</div>
        <el-form-item label="公众号名称" prop="name">
          <div class="w-80">
            <el-input v-model="form.name" placeholder="请输入公众号名称" />
          </div>
        </el-form-item>
        <el-form-item label="原始ID" prop="primaryId">
          <div class="w-80">
            <el-input v-model="form.primaryId" placeholder="请输入原始ID" />
          </div>
        </el-form-item>
        <el-form-item label="公众号二维码" prop="qrCode">
          <div>
            <image-upload v-model="form.qrCode" :limit="1" :isShowTip="false"/>
            <div class="form-tips">建议尺寸：宽400px*高400px。jpg，jpeg，png格式</div>
          </div>
        </el-form-item>
      </el-card>

      <el-divider border-style="dashed" />

      <el-card class="!border-none " shadow="never">
        <div class="font-medium mb-7">公众号开发者信息</div>
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

      <el-card class="!border-none " shadow="never" >
        <div class="font-medium mb-7">服务器配置</div>
        <el-form-item label="URL">
          <div>
            <div class="flex">
              <div class="mr-4 w-80">
                <el-input v-model="form.url" disabled />
              </div>
              <el-button @click="copyData(form.url)">复制</el-button>
            </div>
            <div class="form-tips">
              登录微信公众平台，点击开发>基本配置>服务器配置，填写服务器地址（URL）
            </div>
          </div>
        </el-form-item>
        <el-form-item label="token" prop="token">
          <div>
            <div class="w-80">
              <el-input v-model="form.token" placeholder="请输入token" />
            </div>
            <div class="form-tips">
              登录微信公众平台，点击开发>基本配置>服务器配置，设置令牌Token。
            </div>
          </div>
        </el-form-item>
        <el-form-item label="encodingAesKey" prop="encodingAesKey">
          <div>
            <div class="w-80">
              <el-input
                  v-model="form.encodingAesKey"
                  placeholder="请输入encodingAesKey"
              />
            </div>
            <div class="form-tips">
              消息加密密钥由43位字符组成，字符范围为A-Z,a-z,0-9
            </div>
          </div>
        </el-form-item>
        <el-form-item label="消息加密方式" prop="encryptionType">
          <div>
            <el-radio-group
                class="flex-col !items-start"
                v-model="form.encryptionType"
            >
              <el-radio :value="1" :label="1">
                明文模式 (不使用消息体加解密功能，安全系数较低)
              </el-radio>

              <el-radio :value="2" :label="2">
                兼容模式 (明文、密文将共存，方便开发者调试和维护)
              </el-radio>
              <el-radio :value="3" :label="3">
                安全模式（推荐） (消息包为纯密文，需要开发者加密和解密，安全系数高)
              </el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
      </el-card>

      <el-divider border-style="dashed" />

      <el-card class="!border-none" shadow="never">
        <div class="font-medium mb-7">功能设置</div>
        <el-form-item label="业务域名">
          <div>
            <div class="flex">
              <div class="mr-4 w-80">
                <el-input v-model="form.businessDomain" disabled />
              </div>
              <el-button @click="copyData(form.businessDomain)">复制</el-button>
            </div>
            <div class="form-tips">
              登录微信公众平台，点击设置>公众号设置>功能设置，填写业务域名
            </div>
          </div>
        </el-form-item>
        <el-form-item label="JS接口安全域名">
          <div>
            <div class="flex">
              <div class="mr-4 w-80">
                <el-input v-model="form.jsDomain" disabled />
              </div>
              <el-button @click="copyData(form.jsDomain)">复制</el-button>
            </div>
            <div class="form-tips">
              登录微信公众平台，点击设置>公众号设置>功能设置，填写JS接口安全域名
            </div>
          </div>
        </el-form-item>
        <el-form-item label="网页授权域名">
          <div>
            <div class="flex">
              <div class="mr-4 w-80">
                <el-input v-model="form.webDomain" disabled />
              </div>
<!--              <el-button v-copy="form.webDomain">复制</el-button>-->
              <el-button @click="copyData(form.webDomain)">复制</el-button>
            </div>
            <div class="form-tips">
              登录微信公众平台，点击设置>公众号设置>功能设置，填写网页授权域名
            </div>
          </div>
        </el-form-item>
      </el-card>

      <el-affix position="bottom" :offset="35" style="text-align: center;">
        <el-button type="primary" @click="handleSave">
          保存
        </el-button>
      </el-affix>
    </el-form>
  </div>
</template>
<script setup name="wxMpConfig">
import {getMpConfig, saveMpConfig} from '@/api/channel/wxMp';

const { proxy } = getCurrentInstance();
const data = reactive({
  form:{
    name: '',
    primaryId: ' ',
    qrCode: '',
    appId: '',
    appSecret: '',
    url: '',
    token: '',
    encodingAesKey: '',
    encryptionType: 1,
    businessDomain: '',
    jsDomain: '',
    webDomain: ''
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
    ],
    url: [
      { required: true, message: "键不能为空", trigger: "blur" }
    ],
    token: [
      { required: true, message: "键不能为空", trigger: "blur" }
    ],
    encodingAesKey: [
      { required: true, message: "键不能为空", trigger: "blur" }
    ],
    encryptionType: [
      { required: true, message: "键不能为空", trigger: "blur" }
    ],
  }
})
const { form, rules } = toRefs(data);

function getDataDetail() {
  getMpConfig().then(res => {
    for (const key in form.value) {
      form.value[key] = res.data[key]
    }
  });
}

function handleSave() {
  proxy.$refs["formRef"].validate(valid => {
    if (valid) {
      saveMpConfig(form.value).then(() => {
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