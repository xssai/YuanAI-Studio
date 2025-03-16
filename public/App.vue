<template>
  <router-view />
</template>

<script setup>

import { useTheme } from 'vuetify'
import useSettingsStore from '@/store/modules/settings'
import { useColorMode } from '@vueuse/core'


const globalTheme = useTheme();
const { system, store } = useColorMode(); // Ref<'dark' | 'light'>

const settingsStore = useSettingsStore();
const theme = ref(settingsStore.theme);

/* 系统主题颜色 */
const sysTheme = computed(() => store.value === 'auto' ? system.value : store.value)

onMounted(() => {
  nextTick(() => {
    // 初始化主题样式
    settingsStore.changeSetting({ key: 'theme', value: theme.value })
    if (theme.value === 'auto') {
      globalTheme.global.name.value = sysTheme.value;
    } else {
      globalTheme.global.name.value = settingsStore.theme;
    }

    // document.addEventListener("keydown", function (e) {
    //     if (e.key == "F12") {
    //       e.preventDefault(); // 如果按下键F12,阻止事件
    //     }
    // })
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
