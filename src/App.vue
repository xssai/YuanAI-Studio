<template>
  <router-view />
</template>

<script setup>
import { useTheme, useDisplay } from 'vuetify'
import { useColorMode } from '@vueuse/core'

import useSettingsStore from '@/store/modules/settings'
import useAppStore from '@/store/modules/app'
import useUserStore from '@/store/modules/user'
import usePwaStore from '@/store/modules/pwa'


const device = computed(() => useAppStore().device);

const globalTheme = useTheme();
const { system, store } = useColorMode(); // Ref<'dark' | 'light'>
const { width, height, mobile } = useDisplay()

const userStore = useUserStore();
const settingsStore = useSettingsStore();
const appStore = useAppStore();
const pwaStore = usePwaStore();

const theme = ref(settingsStore.theme);

const sidebar = computed(() => appStore.sidebar);

/* 系统主题颜色 */
const sysTheme = computed(() => store.value === 'auto' ? system.value : store.value)

// 企业信息
userStore.getEnterprise()
// PWA安装
pwaStore.installEventList()

onMounted(() => {
  nextTick(() => {
    // 初始化主题样式
    if (device == 'mobile') {
      globalTheme.global.name.value = 'dark'; // 移动端直接使用 dark
    } else {
      settingsStore.changeSetting({ key: 'theme', value: theme.value })
      if (theme.value === 'auto') {
        globalTheme.global.name.value = sysTheme.value;
      } else {
        globalTheme.global.name.value = settingsStore.theme;
      }
    }

    document.addEventListener("keydown", function (e) {
        if (e.key == "F12") {
          e.preventDefault(); // 如果按下键F12,阻止事件
        }
    })

    watchEffect(() => {
      if (device.value === 'mobile' && sidebar.value.hide) {
        useAppStore().closeSideBar()
      }
      if (mobile.value) {
        console.log("移动端模式", "width:", width.value, height.value)
        useAppStore().setInnerHeight({height:height.value})
        useAppStore().toggleDevice('mobile')
        useAppStore().closeSideBar()
      } else {
        console.log("PC端模式", "width:", width.value, height.value)
        useAppStore().setInnerHeight({height:height.value})
        useAppStore().toggleDevice('desktop')
      }
    })

  })
})



//
//                       .::::.
//                     .::::::::.
//                    :::::::::::
//                 ..:::::::::::'
//              '::::::::::::'
//                .::::::::::
//           '::::::::::::::..
//                ..::::::::::::.
//              ``::::::::::::::::
//               ::::``:::::::::'        .:::.
//              ::::'   ':::::'       .::::::::.
//            .::::'      ::::     .:::::::'::::.
//           .:::'       :::::  .:::::::::' ':::::.
//          .::'        :::::.:::::::::'      ':::::.
//         .::'         ::::::::::::::'         ``::::.
//     ...:::           ::::::::::::'              ``::.
//    ```` ':.          ':::::::::'                  ::::..
//                       '.:::::'                    ':'````..
</script>

<style></style>
