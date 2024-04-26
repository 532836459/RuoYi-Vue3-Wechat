<template>
  <router-view />
</template>

<script setup>
import useSettingsStore from '@/store/modules/settings'
import { handleThemeStyle } from '@/utils/theme'
import { websiteDetail } from "@/api/system/domainConfig";

onMounted(() => {
  nextTick(() => {
    // 初始化主题样式
    handleThemeStyle(useSettingsStore().theme);

    // 设置网站ico
    websiteDetail().then(response => {
      let favicon = document.querySelector('link[rel="icon"]');
      if (favicon) {
        favicon.href = import.meta.env.VITE_APP_BASE_API + response.data.logo
        return
      }
      favicon = document.createElement('link')
      favicon.rel = 'icon'
      favicon.href = import.meta.env.VITE_APP_BASE_API + data.response.data.logo
      document.head.appendChild(favicon)
    });

    //设置网站title

  })
})
</script>
