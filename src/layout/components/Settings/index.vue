<template>
  <v-container fluid>
    <div>
      <div class="mb-3">
        <label class="v-label mb-2 font-weight-medium">主题</label>
        <div class="v-messages">自定义你的文档是明亮还是黑暗的主题，或者两者的结合</div>
      </div>
      <v-radio-group v-model="theme" column true-icon="mdi-check-circle-outline" hide-details
        transition="scale-transition">
        <v-radio color="indigo" value="light" @click="handelLightTheme">
          <template v-slot:label>
            <v-icon class="mr-2">mdi-white-balance-sunny</v-icon>
            <p>浅色主题</p>
          </template>
        </v-radio>
        <v-radio color="indigo" value="dark" @click="handelDarkTheme">
          <template v-slot:label>
            <v-icon class="mr-2">mdi-weather-night</v-icon>
            <p>暗色主题</p>
          </template>
        </v-radio>
        <v-radio color="indigo" value="auto" @click="handelAutoTheme">
          <template v-slot:label>
            <v-icon class="mr-2">mdi-laptop</v-icon>
            <p>跟随系统</p>
          </template>
        </v-radio>
      </v-radio-group>
    </div>

    <v-divider class="mt-4 mb-3"></v-divider>

    <div>
      <div class="mb-3">
        <label class="v-label mb-2 font-weight-medium">常规</label>
        <div class="v-messages">自定义你的网页标题，根据页面切换决定，包括配置网页布局等选项</div>
      </div>

      <!-- <div>
        <v-switch v-model="topNav" label="开启 TopNav" hide-details inset color="indigo"></v-switch>
        <div class="v-messages">关闭或开启左侧导航菜单，启用底部导航栏</div>
      </div> -->

      <div>
        <v-switch v-model="tagsView" label="开启 Tags-Views" hide-details inset color="indigo"></v-switch>
        <div class="v-messages">选择开启或关闭顶栏页面选项卡</div>
      </div>

      <div>
        <v-switch v-model="fixedHeader" label="固定 Header" hide-details inset color="indigo"></v-switch>
        <div class="v-messages">顶部栏目是否跟随页面滚动</div>
      </div>

      <div>
        <v-switch v-model="sidebarLogo" label="显示 Logo" hide-details inset color="indigo"></v-switch>
        <div class="v-messages">显示或隐藏左侧栏目顶部LOGO图标</div>
      </div>

      <div>
        <v-switch v-model="dynamicTitle" label="动态标题" hide-details inset color="indigo"></v-switch>
        <div class="v-messages">浏览器标签跟随页面名称</div>
      </div>
    </div>
  </v-container>
</template>

<script setup>
import { useDynamicTitle } from '@/utils/dynamicTitle'
import useAppStore from '@/store/modules/app'
import useSettingsStore from '@/store/modules/settings'
import usePermissionStore from '@/store/modules/permission'
import { useColorMode } from '@vueuse/core'
import { useTheme } from 'vuetify'

const globalTheme = useTheme();
const appStore = useAppStore()
const settingsStore = useSettingsStore()
const permissionStore = usePermissionStore()
const theme = ref(settingsStore.theme);
const storeSettings = computed(() => settingsStore);

const { system, store } = useColorMode() // Ref<'dark' | 'light'>

/* 系统主题颜色 */
const sysTheme = computed(() => store.value === 'auto' ? system.value : store.value)


/** 是否需要topnav */
const topNav = computed({
  get: () => storeSettings.value.topNav,
  set: (val) => {
    settingsStore.changeSetting({ key: 'topNav', value: val })
    if (!val) {
      appStore.toggleSideBarHide(false);
      permissionStore.setSidebarRouters(permissionStore.defaultRoutes);
    }
    saveSetting();
  }
})
/** 是否需要tagview */
const tagsView = computed({
  get: () => storeSettings.value.tagsView,
  set: (val) => {
    settingsStore.changeSetting({ key: 'tagsView', value: val })
    saveSetting();
  }
})
/**是否需要固定头部 */
const fixedHeader = computed({
  get: () => storeSettings.value.fixedHeader,
  set: (val) => {
    settingsStore.changeSetting({ key: 'fixedHeader', value: val })
    saveSetting();
  }
})
/**是否需要侧边栏的logo */
const sidebarLogo = computed({
  get: () => storeSettings.value.sidebarLogo,
  set: (val) => {
    settingsStore.changeSetting({ key: 'sidebarLogo', value: val })
    saveSetting();
  }
})
/**是否需要侧边栏的动态网页的title */
const dynamicTitle = computed({
  get: () => storeSettings.value.dynamicTitle,
  set: (val) => {
    settingsStore.changeSetting({ key: 'dynamicTitle', value: val })
    // 动态设置网页标题
    useDynamicTitle()
    saveSetting();
  }
})

function handelLightTheme(event) {
  // 获取到 transition API 实例
  const transition = document.startViewTransition(() => {
    settingsStore.changeSetting({ key: 'theme', value: theme.value })
    globalTheme.global.name.value = settingsStore.theme;
    saveSetting();
  })

  themeTransition(transition, event);
}

function handelDarkTheme(event) {
  // 获取到 transition API 实例
  const transition = document.startViewTransition(() => {
    settingsStore.changeSetting({ key: 'theme', value: theme.value })
    globalTheme.global.name.value = settingsStore.theme;
    saveSetting();
  })

  themeTransition(transition, event);
}

function handelAutoTheme(event) {
  // 获取到 transition API 实例
  const transition = document.startViewTransition(() => {
    settingsStore.changeSetting({ key: 'theme', value: theme.value })
    globalTheme.global.name.value = sysTheme.value;
    saveSetting();
  })

  themeTransition(transition, event);
}

function saveSetting() {
  let layoutSetting = {
    "topNav": storeSettings.value.topNav,
    "tagsView": storeSettings.value.tagsView,
    "fixedHeader": storeSettings.value.fixedHeader,
    "sidebarLogo": storeSettings.value.sidebarLogo,
    "dynamicTitle": storeSettings.value.dynamicTitle,
    "theme": storeSettings.value.theme
  };
  localStorage.setItem("layout-setting", JSON.stringify(layoutSetting));
}

function themeTransition(instance, event) {
  // 在 transition.ready 的 Promise 完成后，执行自定义动画
  instance.ready.then(() => {
    // 由于要从鼠标点击的位置开始做动画，需要先获取到鼠标的位置
    const { clientX, clientY } = event
    // 计算半径，以鼠标点击的位置为圆心，到四个角的距离中最大的那个作为半径
    const radius = Math.hypot(
      Math.max(clientX, innerWidth - clientX),
      Math.max(clientY, innerHeight - clientY)
    )
    // 自定义动画
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0% at ${clientX}px ${clientY}px)`,
          `circle(${radius}px at ${clientX}px ${clientY}px)`
        ]
      },
      {
        duration: 500,
        pseudoElement: '::view-transition-new(root)'
      }
    )
  })
}

function resetSetting() {
  localStorage.removeItem("layout-setting")
  setTimeout("window.location.reload()", 1000)
}

/* 监听window主题变化 */
onMounted(() => {
  nextTick(() => {
    let timer = setTimeout(() => {
      // 定时器原因**防止 Transition API 与 DOM 更新动画冲突
      watch(sysTheme, (val) => {
        if (theme.value === 'auto') {
          settingsStore.changeSetting({ key: 'theme', value: theme.value });
          const transition = document.startViewTransition(() => {
            globalTheme.global.name.value = val;
            saveSetting();
          })
          // 模拟点击切换主题动画
          themeTransition(transition, { clientX: 1625, clientY: 244 });
        }
      }, { immediate: true })
      clearTimeout(timer);
    }, 300)
  })
})

</script>

<style lang='scss'>
::view-transition-new(root),
::view-transition-old(root) {
  /* 关闭默认动画，否则影响自定义动画的执行 */
  animation: none;
}
</style>