import store from '@/store'
import defaultSettings from '@/settings'
import useSettingsStore from '@/store/modules/settings'
import useConfigStore from "@/store/modules/config.js";

/**
 * 动态修改标题
 */
export function useDynamicTitle() {
  const settingsStore = useSettingsStore();
  const configStore = useConfigStore();
  // if (settingsStore.dynamicTitle) {
  //   document.title = settingsStore.title + ' - ' + defaultSettings.title;
  // } else {
  //   document.title = defaultSettings.title;
  // }
  if (settingsStore.dynamicTitle) {
    document.title = settingsStore.title + ' - ' + configStore.name;
  } else {
    document.title = configStore.name;
  }
}
