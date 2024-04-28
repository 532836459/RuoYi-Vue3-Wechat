<template>
  <div class="app-container">
    <el-form ref="siteConfigRef" v-loading="loading" :rules="rules" :model="form" label-width="120px">
      <el-card shadow="never" style="border: none">
        <div style="font-size: 16px;font-weight: 500;margin-bottom: 20px;">后台设置</div>
        <el-form-item label="网站名称" prop="name">
          <div class="w-80">
            <el-input
                v-model="form.name"
                placeholder="请输入网站名称"
                maxlength="30"
                show-word-limit
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item label="网站图标" prop="favicon">
          <div>
            <image-upload v-model="form.favicon" :limit="1" :isShowTip="false"/>
<!--            <material-picker v-model="domainConfigList.favicon" :limit="1" />-->
            <div class="form-tips">建议尺寸：100*100像素，支持jpg，jpeg，png格式</div>
          </div>
        </el-form-item>
        <el-form-item label="网站logo" prop="logo">
          <div>
            <image-upload v-model="form.logo" :limit="1" :isShowTip="false"/>
<!--            <material-picker v-model="domainConfigList.logo" :limit="1" />-->
            <div class="form-tips">建议尺寸：200*200像素，支持jpg，jpeg，png格式</div>
          </div>
        </el-form-item>
        <el-form-item label="登录页广告图" prop="loginImg">
          <div>
            <image-upload v-model="form.loginImg" :limit="1" :isShowTip="false"/>
<!--            <material-picker v-model="domainConfigList.backdrop" :limit="1" />-->
            <div class="form-tips">建议尺寸：400*400像素，支持jpg，jpeg，png格式</div>
          </div>
        </el-form-item>
      </el-card>
    </el-form>
    <el-affix position="bottom" :offset="35" style="text-align: right;margin-right:35px;">
      <el-button type="primary" size="large" @click="submitForm">保 存</el-button>
    </el-affix>
  </div>
</template>

<script setup name="siteConfig">
import {websiteDetail, websiteSave} from "@/api/system/domainConfig";
const { proxy } = getCurrentInstance();

const loading = ref(true);
const data = reactive({
  form: {},
  rules: {
    name: [{ required: true, message: "网站名称不能为空", trigger: "blur" }],
    logo: [{ required: true, message: "网站Logo不能为空", trigger: "blur" }],
    // loginImg: [{ required: true, message: "登录页图不能为空", trigger: "blur" }],
  }
});

const { form, rules } = toRefs(data);

/** 查询网站信息配置 */
function getDetail() {
  loading.value = true;
  websiteDetail().then(response => {
    form.value = response.data;
    loading.value = false;
  });
}

/** 保存按钮 */
function submitForm() {
  proxy.$refs["siteConfigRef"].validate(valid => {
    if (valid) {
      loading.value = true;
      websiteSave(form.value).then(response => {
        proxy.$modal.msgSuccess("保存成功");
        getDetail();
      });
    }
  });
}

getDetail();
</script>
