<template>
  <router-view />
</template>

<script setup>
import useSettingsStore from '@/store/modules/settings'
import useConfigStore from "@/store/modules/config.js";
const configStore = useConfigStore()
import { handleThemeStyle } from '@/utils/theme'

onMounted(() => {
  nextTick(() => {
    // 初始化主题样式
    handleThemeStyle(useSettingsStore().theme);
    //初始化网站配置
    useConfigStore().getConfig();
    // 设置网站ico
    let favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
      favicon.href = configStore.favicon;
      return;
    }
    favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = configStore.favicon;
    document.head.appendChild(favicon);
    //设置网站title

  })
})
</script>
