<template>
  <v-layout class="rounded rounded-md">
    <!-- 右侧栏设置 -->
    <v-navigation-drawer ref="setting" v-model="showSettings" width="350" location="right" temporary>
      <v-toolbar dark>
        <v-toolbar-title>文档设置</v-toolbar-title>
        <v-scale-transition>
          <v-btn icon="mdi-close" variant="elevated" flat @click="() => showSettings = false"></v-btn>
        </v-scale-transition>
      </v-toolbar>

      <settings id="settings-container" />

      <template v-slot:append>
        <v-divider></v-divider>
        <div class="text-medium-emphasis text-caption py-2 pl-3 d-flex align-center justify-space-between">
          <div class="d-inline-flex align-center">
            <v-icon size="18px" class="mr-2">mdi-tag-outline</v-icon>
            <span>最新发行版</span>
          </div>
          <v-btn variant="text">
            {{ version }}
            <template v-slot:append>
              <v-icon size="16px">mdi-webpack</v-icon>
            </template>
          </v-btn>
        </div>
        <div class="text-medium-emphasis text-caption py-2 pl-3 d-flex align-center justify-space-between">
          <div class="d-inline-flex align-center">
            <v-icon size="18px" class="mr-2">mdi-clock-time-six-outline</v-icon>
            <span>最新提交</span>
          </div>
          <v-btn variant="text">
            {{ packDate }}
            <template v-slot:append>
              <v-icon size="16px">mdi-atom</v-icon>
            </template>
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>


    <!-- 左侧路由菜单 -->
    <v-navigation-drawer v-model="sidebar.opened" :rail="sidebar.hide" rail-width="60" border="0">
      <template v-slot:prepend>
        <v-list v-if="showLogo">
          <v-list-item class="cursor-pointer">
            <template v-slot:title>
              <v-img width="120" :src="h5Logo" draggable="false"></v-img>
            </template>
          </v-list-item>
        </v-list>

        <!-- 用户信息 -->
        <person-info id="breadcrumb-container"></person-info>
      </template>

      <!-- 侧边导航栏列表数据 -->
      <v-list>
        <sidebar-item v-for="(route, index) in sidebarRouters" :key="route.path + index" :item="route"
          :base-path="route.path" />
      </v-list>

    </v-navigation-drawer>

    <!-- 顶部菜单 -->
    <v-app-bar flat :absolute="!fixedHeader">
      <template v-slot:prepend>
        <v-row align="center" justify="center" no-gutters>
          <v-col cols="auto">
            <hamburger id="hamburger-container"
              :is-active="device === 'mobile' ? sidebar.opened : !sidebar.hide" class="cursor-pointer"
              @toggleClick="toggleSideBar" />
          </v-col>
          <v-col cols="auto">
            <breadcrumb id="breadcrumb-container" v-if="device !== 'mobile'" />
<!--            <top-nav id="topNav-container" class="topNav-container" v-if="settingsStore.topNav" />-->
          </v-col>
        </v-row>
      </template>
      <template v-slot:append>
        <v-row align="center" justify="center" no-gutters>
<!--          <v-col cols="auto" v-if="device !== 'mobile'">-->
<!--            <network id="network" />-->
<!--          </v-col>-->
<!--          <v-col cols="auto" v-if="device !== 'mobile'">-->
<!--            <memory id="memory" />-->
<!--          </v-col>-->

          <v-col cols="auto">
            <TopAddToHome id="topAddToHome" />
          </v-col>

          <v-col cols="auto" v-if="device !== 'mobile'">
            <browser id="browser" />
          </v-col>

          <v-col cols="auto">
            <integral-entrance id="integralEntrance" />
          </v-col>

          <v-col cols="auto" class="mx-2" v-if="device !== 'mobile'">
            <v-divider vertical length="20px"></v-divider>
          </v-col>

          <!-- <v-col cols="auto">
            <header-search id="header-search" class="right-menu-item" />
          </v-col> -->

          <v-col cols="auto" v-if="device !== 'mobile'">
            <ScreenFull id="screenFull" />
          </v-col>

          <!-- <v-col cols="auto" v-if="device !== 'mobile'">
            <size-select id="size-select" />
          </v-col> -->

          <v-col cols="auto" v-if="device !== 'mobile'">
            <set-up id="set-up" @setLayout="setLayout" />
          </v-col>
        </v-row>
      </template>
    </v-app-bar>

    <!-- 顶部路由history -->
    <v-app-bar flat :absolute="!fixedHeader"  height="32" v-if="needTagsView && device !== 'mobile'">
      <tags-view />
    </v-app-bar>

    <!-- 底部导航 -->
     <!-- color="light_custom_blue_2" -->
    <v-bottom-navigation :active="device === 'mobile'" grow>
      <bottom-nav-item v-for="(route, index) in sidebarRouters" :key="route.path + index" :item="route"
        :base-path="route.path"></bottom-nav-item>
    </v-bottom-navigation>

    <!-- 内容板块 -->
    <v-main style="min-height: 100vh;">
      <app-main />
      <!-- 滚动顶部 -->
      <ScrollTop />
      <!-- 二维码 -->
      <QR id="qr" />
    </v-main>

    <!-- 文件传输窗口 -->
    <file-progress />

    <!-- 视频预览 -->
    <video-player />

    <!-- 扣子 -->
    <Coze id="coZe" />
  </v-layout>
</template>

<script setup>
import { AppMain, SidebarItem, Settings, TagsView, PersonInfo, Coze, BottomNavItem } from './components'
import packageConfig from '../../package.json'

import Hamburger from '@/components/Hamburger'
import Breadcrumb from '@/components/Breadcrumb'
import SizeSelect from '@/components/SizeSelect'
import ScreenFull from '@/components/Screenfull'
import HeaderSearch from '@/components/HeaderSearch'
import FileProgress from "@/components/FileProgress"
import TopNav from '@/components/TopNav'
import SetUp from '@/components/SetUp'
import Memory from '@/components/Memory'
import Browser from '@/components/Browser'
import Network from '@/components/Network'
import ScrollTop from '@/components/ScrollTop'
import VideoPlayer from '@/components/VideoPlayer'
import TopAddToHome from '@/components/TopAddToHome'
import IntegralEntrance from '@/components/IntegralEntrance'
import QR from '@/components/QR'

import useSettingsStore from '@/store/modules/settings'
import usePermissionStore from '@/store/modules/permission'
import useAppStore from '@/store/modules/app'
import useUserStore from '@/store/modules/user'

const version = ref(`v${packageConfig.version}`);
const packDate = ref(packageConfig.packDate);

const showSettings = ref(false);

const setting = ref(null)

const { proxy } = getCurrentInstance();

const { text, isSupported, copy } = proxy.useClipboard();

const appStore = useAppStore()
const settingsStore = useSettingsStore()
const permissionStore = usePermissionStore()
const userStore = useUserStore()

const showLogo = computed(() => settingsStore.sidebarLogo);
const needTagsView = computed(() => settingsStore.tagsView);
const fixedHeader = computed(() => settingsStore.fixedHeader);
const sidebarRouters = computed(() => permissionStore.sidebarRouters);
const device = computed(() => useAppStore().device);
const sidebar = computed(() => appStore.sidebar);
const h5Title = computed(() => userStore.enterpriseName);
const h5Logo = computed(() => userStore.icon);

function toggleSideBar() {
  appStore.toggleSideBar()
}

function setLayout() {
  showSettings.value = true;
}

</script>

<style lang="scss" scoped>
// 防止 v-navigation-drawer 遮罩层跟随页面滚动
.v-navigation-drawer__scrim {
  position: fixed !important;
}
</style>