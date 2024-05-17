<template>
    <template v-for="(attrItem, attrIndex) in menuList" :key="attrIndex">
      <div class="flex-1 oa-attr" v-show="attrIndex === menuIndex">
        <div class="text-base oa-attr-title">菜单配置</div>

        <DelWrap class="w-3/4" @close="handleDelMenu(menuIndex)">
          <div class="flex items-center w-full p-4 mt-4 rounded bg-fill-light">
            <MenuForm
                ref="menuRef"
                modular="master"
                v-model:name="attrItem.name"
                v-model:menuType="attrItem.menuType"
                v-model:visitType="attrItem.visitType"
                v-model:url="attrItem.url"
                v-model:appId="attrItem.appId"
                v-model:pagePath="attrItem.pagePath"
            >

              <div class="flex-1">
                <!-- 编辑子菜单 -->
                <ul>
                  <li
                      class="flex"
                      v-for="(subItem, subIndex) in attrItem.subButtons"
                      :key="subIndex"
                      style="padding: 8px"
                  >
                    <span class="mr-auto">{{ subItem.name }}</span>
                    <!-- 编辑子菜单 -->
                    <MenuFormEdit
                        modular="edit"
                        :subItem="subItem"
                        @edit="handleEditSubMenu($event, subIndex)"
                    >
                      <el-icon><EditPen /></el-icon>
                    </MenuFormEdit>

                    <!-- 删除子菜单 -->
                    <Popup @confirm="handleDelSubMenu(menuIndex, subIndex)">
                      是否删除当前子菜单？
                      <template #trigger>
                        <el-icon class="ml-5"><Delete /></el-icon>
                      </template>
                    </Popup>
                  </li>
                </ul>

                <!-- 新增子菜单 -->
                <MenuFormEdit modular="add" @add="handleAddSubMenu">
                  <el-button
                      type="primary"
                      plain
                      :disabled="attrItem.subButtons.length >= 5"
                  >添加子菜单({{ attrItem.subButtons.length }}/5)</el-button
                  >
                </MenuFormEdit>
              </div>
            </MenuForm>
          </div>
        </DelWrap>
      </div>
    </template>
</template>

<script setup >
import MenuForm from "./menu-form.vue";
import MenuFormEdit from "./menu-form-edit.vue";
import DelWrap from "@/components/DelWrap/index.vue";
import Popup from "@/components/Popup/index.vue";
import {useMenuJs} from "../js/index.js";

const menuRef = shallowRef()

const {
  menuList,
  menuIndex
} = useMenuJs(menuRef)

// 添加子菜单
const handleAddSubMenu = (event) => {
  const index = menuIndex.value
  if (menuList.value[index].subButtons.length >= 5) {
    proxy.$modal.msgWarning("已添加上限～");
    return;
  }
  menuList.value[index].subButtons.push(event)
}

// 编辑子菜单
const handleEditSubMenu = (event, subIndex) => {
  const index = menuIndex.value;
  menuList.value[index].subButtons[subIndex] = event;
}

// 删除主菜单
const handleDelMenu = (index) => {
  menuList.value.splice(index, 1)
}
// 删除子菜单
const handleDelSubMenu = (index, subIndex) => {
  menuList.value[index].subButtons.splice(subIndex, 1)
}
</script>

