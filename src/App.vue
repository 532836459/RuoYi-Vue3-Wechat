<template>
  <router-view />
</template>

<script setup>
import useSettingsStore from '@/store/modules/settings'
import useConfigStore from "@/store/modules/config.js";
import { handleThemeStyle } from '@/utils/theme'
const configStore = useConfigStore()

onMounted(async () => {

  //初始化网站配置
  await useConfigStore().getConfig();
  let favicon = document.querySelector('link[rel="icon"]');
  favicon.href = configStore.favicon;
  document.title = configStore.name;

  nextTick(() => {
    // 初始化主题样式
    handleThemeStyle(useSettingsStore().theme);
  })
})
</script>
