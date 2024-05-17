<template>
  <div class="app-container">
    <el-card class="!border-none" shadow="never">
      <el-alert
          type="warning"
          title="配置微信公众号菜单，点击确认，保存菜单并发布至微信公众号"
          :closable="false"
          show-icon
      />
    </el-card>

    <el-card class="!border-none mt-4" shadow="never">
      <div class="flex flex-1">
        <MenuList></MenuList>
        <MenuDetail></MenuDetail>
      </div>
    </el-card>

<!--    <footer-btns>-->
    <el-affix position="bottom" style="text-align: center;">
      <el-button type="primary" @click="handleSave" v-perms="['channel:oaMenu:save']">
        保存
      </el-button>
      <el-button type="primary" @click="handlePublish" v-perms="['channel:oaMenu:publish']">
        发布
      </el-button>
    </el-affix>

<!--    </footer-btns>-->
  </div>
</template>

<script setup name="MenuConfig">
const { proxy } = getCurrentInstance();
import MenuList from "./component/menu-list.vue";
import MenuDetail from "./component/menu-detail.vue";
import {menuRef, useMenuJs} from "./js/index.js";
import {mpMenuList, mpMenuSave, mpMenuPublish} from "@/api/channel/wxMp";
const {menuList, menuIndex} = useMenuJs();
// 获取菜单
const getMpMenuList = async () => {
  try {
    await mpMenuList().then(response =>{
      menuList.value = response.data;
    })
  } catch (error) {
    console.log('获取菜单=>', error)
  }
}

// 保存菜单
const handleSave = async () => {
  const refs = menuRef.value.value;
  for (let i = 0; i < refs.length; i++) {
    try {
      await refs[i].menuFormRef.validate()
    } catch (error) {
      menuIndex.value = i
      return;
    }
  }
  await mpMenuSave(menuList.value)
  proxy.$modal.msgSuccess("保存成功");
}

// 发布菜单
const handlePublish = async () => {
  const refs = menuRef.value.value
  for (let i = 0; i < refs.length; i++) {
    try {
      await refs[i].menuFormRef.validate()
    } catch (error) {
      menuIndex.value = i
      return
    }
  }
  await mpMenuPublish(menuList.value)
  proxy.$modal.msgSuccess("发布成功");
}

getMpMenuList();

</script>

<style lang="scss" scoped>

</style>
