<template>
    <div class="oa-phone mr-[35px] no-shrink">
      <div class="oa-phone-content"></div>

      <div class="flex oa-phone-menu">
        <div class="flex items-center justify-center oa-phone-menu-switch">
          <el-icon>
            <Grid />
          </el-icon>
        </div>

        <template v-for="(menuItem, i) in menuList" :key="i">
<!--          <div class="relative flex-1" @click="menuIndex = i">-->
          <div class="relative flex-1" @click="$emit('update:menuIndex', i)">
            <!-- 一级菜单 -->
            <div
                class="flex items-center justify-center flex-1 text-sm oa-phone-menu-item"
                :class="{ 'active-menu': menuIndex === i }"
            >
              {{ menuItem.name }}
            </div>

            <!-- 二级菜单 -->
            <div
                class="oa-phone-menu-subitem"
                v-show="menuItem.subButtons.length && menuItem.menuType !== 1"
            >
              <template v-for="subItem in menuItem.subButtons">
                <div class="oa-phone-menu-subitem-title">
                  {{ subItem.name }}
                </div>
              </template>
            </div>
          </div>
        </template>
        <!-- 新增菜单 -->
        <template v-if="menuList.length <= 2">
          <div class="flex items-center justify-center flex-1 h-full" @click="$emit('add-main-menu')">
            <el-icon>
              <Plus />
            </el-icon>
          </div>
        </template>
      </div>
    </div>
</template>

<script setup>
import useSettingsStore from '@/store/modules/settings';
const settingsStore = useSettingsStore();
// 主题颜色
const theme = computed(() => settingsStore.theme);
defineProps({
  menuList: {
    type: Array,
    default: () => []
  },
  menuIndex: {
    type: Number,
    default: 0
  }
})
const emits = defineEmits(['update:menuIndex','add-main-menu']);
</script>

<style lang="scss" scoped>
.oa-phone {
  width: 260px;
  height: 461px;
  border: 1px solid #e5e5ea;

  &-content {
    height: 420px;
    border-bottom: 1px solid #e5e5ea;
  }

  &-menu {
    height: 40px;
    cursor: pointer;

    &-switch {
      width: 40px;
      height: 100%;
      border-right: 1px solid #e5e5ea;
    }

    // 一级菜单
    &-item {
      height: 100%;
      border-right: 1px solid #e5e5ea;
    }

    &-item:nth-child(4) {
      border-right: none;
    }

    .active-menu {
      position: relative;
    }

    .active-menu::after {
      content: '';
      width: 100%;
      height: 41px;
      top: -1px;
      position: absolute;
      border: 1px solid v-bind(theme);
    }

    // 二级菜单
    &-subitem {
      width: 98%;
      left: 2px;
      bottom: calc(100% + 10px);
      position: absolute;
      border: 1px solid #e5e5ea;
      border-top: none;

      &-title {
        height: 40px;
        line-height: 40px;
        text-align: center;
        font-size: 12px;
        border-top: 1px solid #e5e5ea;
        /* 允许文本换行 */
        white-space: nowrap;
        /* 防止内容溢出，添加滚动条如果需要查看全部内容 */
        overflow: hidden;
        /* 当文本溢出时，显示省略号 */
        text-overflow: ellipsis;
      }
    }
  }
}
.no-shrink {
  flex-shrink: 0;
}

</style>
