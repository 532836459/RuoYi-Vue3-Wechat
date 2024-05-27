<template>
    <template v-for="(attrItem, attrIndex) in menuList" :key="attrIndex">
      <div class="flex-1 oa-attr no-shrink" v-show="attrIndex === menuIndex">
        <div class="text-base oa-attr-title">菜单配置</div>

        <DelWrap class="w-3/4" @close="$emit('delete-main-menu', menuIndex)">
          <div class="flex items-center w-full p-4 mt-4 rounded bg-fill-light" style="min-width: 400px;">
            <MenuForm
                ref="menuDetailRef"
                modular="master"
                v-model:name="attrItem.name"
                v-model:menuType="attrItem.menuType"
                v-model:visitType="attrItem.visitType"
                v-model:url="attrItem.url"
                v-model:appId="attrItem.appId"
                v-model:pagePath="attrItem.pagePath"
            >

              <div class="">
                <!-- 编辑子菜单 -->
                <ul style="padding: 0px;">
                  <li
                      class="flex"
                      v-for="(subItem, subIndex) in attrItem.subButtons"
                      :key="subIndex"
                      style="padding: 20px 20px 0px 20px;margin-bottom:20px;border:2px solid #ccc"
                  >
                      <MenuForm
                          ref="menuDetailRef"
                          modular="secondary"
                          v-model:name="subItem.name"
                          v-model:visitType="subItem.visitType"
                          v-model:url="subItem.url"
                          v-model:appId="subItem.appId"
                          v-model:pagePath="subItem.pagePath"
                      ></MenuForm>

                    <!-- 删除子菜单 -->
                    <Popup @confirm="handleDelSubMenu(menuIndex, subIndex)">
                      是否删除当前子菜单？
                      <template #trigger>
                        <el-icon class="ml-5"><Delete /></el-icon>
                      </template>
                    </Popup>
                  </li>
                </ul>
                <el-button type="primary" plain @click="addSubMenu">
                  新增子菜单
                </el-button>
              </div>
            </MenuForm>
          </div>
        </DelWrap>
      </div>
    </template>
</template>

<script setup>
import MenuForm from "./menu-form.vue";
import MenuFormEdit from "./menu-form-edit.vue";
import DelWrap from "@/components/DelWrap/index.vue";
import Popup from "@/components/Popup/index.vue";
const { proxy } = getCurrentInstance();
const menuDetailRef = ref()

const props = defineProps({
  menuList: {
    type: Array,
    default: () => []
  },
  menuIndex: {
    type: Number,
    default: 0
  }
})
const emits = defineEmits(['delete-main-menu']);

// 添加子菜单
const addSubMenu = () => {
  const index = props.menuIndex;
  if (props.menuList[index].subButtons.length >= 5) {
    proxy.$modal.msgWarning("已添加上限～");
    return;
  }
  props.menuList[index].subButtons.push({
    name: '子菜单名称',
    menuType: 1,
    visitType: 'view',
    url: "",
    appId: "",
    pagePath: ""
  });
}

// 删除子菜单
const handleDelSubMenu = (index, subIndex) => {
  props.menuList[index].subButtons.splice(subIndex, 1);
}
defineExpose({menuDetailRef})
</script>
<style scoped>
.no-shrink {
  flex-shrink: 0;
}

</style>

