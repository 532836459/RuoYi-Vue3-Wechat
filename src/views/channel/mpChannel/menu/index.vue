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

    <el-card class="!border-none mt-4" shadow="never" style="overflow: auto;">
      <div class="flex flex-1">
        <MenuList v-model:menuList="menuList" v-model:menuIndex="menuIndex"
          @add-main-menu="addMainMenu"
        ></MenuList>

        <MenuDetail v-model:menuList="menuList" v-model:menuIndex="menuIndex"
                    @delete-main-menu="deleteMainMenu"
                    ref="menuRef"
        ></MenuDetail>
      </div>
    </el-card>

    <el-affix position="bottom" :offset="35" style="text-align: center;">
      <el-button type="primary" @click="handleSave">
        保存
      </el-button>
<!--      <el-button type="primary" @click="handlePublish">-->
<!--        发布-->
<!--      </el-button>-->
    </el-affix>

  </div>
</template>

<script setup name="MenuConfig">
const { proxy } = getCurrentInstance();
import MenuList from "./component/menu-list.vue";
import MenuDetail from "./component/menu-detail.vue"
import {mpMenuList, mpMenuSave, mpMenuPublish} from "@/api/channel/wxMp";
const loading = ref(true);
const menuRef = ref();
// 菜单数据
let menuList = ref([]);
let menuIndex = ref(0);

/** 获取菜单 */
function getList() {
    loading.value = true;
    mpMenuList().then(response => {
    menuList.value = response.data;
    loading.value = false;
  });
}

// 添加主菜单
const addMainMenu = () => {
  menuList.value.push({
    name: '菜单名称',
    visitType: 'view',
    menuType: 1,
    url: '',
    appId: '',
    pagePath: '',
    subButtons: []
  });
  menuIndex.value = menuList.value.length - 1;
}

// 删除主菜单
const deleteMainMenu = (index) => {
  menuList.value.splice(index, 1)
}

// 保存菜单
 async function handleSave() {
  const detail = proxy.$refs["menuRef"].menuDetailRef;
  let isValid = true;
  for (let i = 0; i < detail.length; i++) {
    await detail[i].menuDataRef.validate(valid =>{
        if (valid === false){
          isValid = false;
        }
    });
  }
  if (isValid) {
    mpMenuSave(menuList.value).then(response => {
      proxy.$modal.msgSuccess("保存成功");
    });
  }else {
    proxy.$modal.msgWarning("请填写完整菜单信息");
  }
}

// 发布菜单
// const handlePublish = async () => {
//   const refs = menuRef.value.value
//   for (let i = 0; i < refs.length; i++) {
//     try {
//       await refs[i].menuFormRef.validate()
//     } catch (error) {
//       menuIndex.value = i
//       return
//     }
//   }
//   await mpMenuPublish(menuList.value)
//   proxy.$modal.msgSuccess("发布成功");
// }

getList();

</script>

