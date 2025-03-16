<template>
  <v-layout class="rounded rounded-md">
    <!-- 右侧栏设置 -->
    <v-navigation-drawer v-model="showSettings" width="350" location="right" temporary>
      <v-toolbar dark>
        <v-toolbar-title>文档设置</v-toolbar-title>
        <v-scale-transition>
          <v-btn icon="mdi-close" variant="elevated" flat @click="() => showSettings = false"></v-btn>
        </v-scale-transition>
      </v-toolbar>

      <settings id="settings-container" />

      <template v-slot:append>
        <v-divider></v-divider>
        <div class="text-medium-emphasis text-caption py-2 px-3 d-flex align-center justify-space-between">
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
        <div class="text-medium-emphasis text-caption py-2 px-3 d-flex align-center justify-space-between">
          <div class="d-inline-flex align-center">
            <v-icon size="18px" class="mr-2">mdi-clock-time-six-outline</v-icon>
            <span>最新提交</span>
          </div>
          <v-btn variant="text" class="px-0">
            {{ packDate }}
            <template v-slot:append>
              <v-icon size="16px">mdi-atom</v-icon>
            </template>
          </v-btn>
        </div>
      </template>

    </v-navigation-drawer>

    <!-- 左侧路由菜单 -->
    <v-navigation-drawer v-if="!settingsStore.topNav" v-model="sidebar.opened" :rail="sidebar.hide" rail-width="68">
      <v-list v-if="showLogo">
        <v-list-item class="cursor-pointer">
          <template v-slot:prepend>
            <v-avatar size="40" rounded="circle">
              <svg-icon class-name="text-h4" icon-class="map" />
            </v-avatar>
          </template>
          <template v-slot:title>
            <span class="text-subtitle-1 font-weight-bold ml-2">{{ title }}</span>
          </template>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <!-- 用户信息 -->
      <v-list>
        <person-info id="breadcrumb-container"></person-info>
      </v-list>

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
            <hamburger id="hamburger-container" v-if="!settingsStore.topNav"
              :is-active="device === 'mobile' ? sidebar.opened : !sidebar.hide" class="cursor-pointer"
              @toggleClick="toggleSideBar" />
          </v-col>
          <v-col cols="auto">
            <breadcrumb id="breadcrumb-container" v-if="!settingsStore.topNav" />
            <top-nav id="topmenu-container" class="topmenu-container" v-if="settingsStore.topNav" />
          </v-col>
        </v-row>
      </template>
      <template v-slot:append>
        <v-row align="center" justify="center" no-gutters>
          <v-col cols="auto" v-if="device !== 'mobile'">
            <network id="network" />
          </v-col>
          <v-col cols="auto" v-if="device !== 'mobile'">
            <memory id="memory" />
          </v-col>

          <v-col cols="auto" v-if="device !== 'mobile'">
            <browser id="browser" />
          </v-col>

          <v-col cols="auto" class="mx-1" v-if="device !== 'mobile'">
            <v-divider vertical length="20px"></v-divider>
          </v-col>

          <v-col cols="auto">
            <header-search id="header-search" class="right-menu-item" />
          </v-col>
          <v-col cols="auto" v-if="device !== 'mobile'">
            <screenfull id="screenfull" />
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
    <v-app-bar flat :absolute="!fixedHeader" class="border-b-sm" height="32" v-if="needTagsView && device !== 'mobile'">
      <template v-slot:prepend>
        <tags-view />
      </template>
    </v-app-bar>

    <!-- 内容板块 -->
    <v-main>
      <app-main />
    </v-main>

    <!-- 文件传输窗口 -->
    <file-progress />

    <!-- 视频预览 -->
    <video-player />

  </v-layout>
</template>

<script setup>
import { useDisplay } from 'vuetify'
import { AppMain, SidebarItem, Settings, TagsView, PersonInfo } from './components'
import packageConfig from '../../package.json'

import Hamburger from '@/components/Hamburger'
import Breadcrumb from '@/components/Breadcrumb'
import SizeSelect from '@/components/SizeSelect'
import Screenfull from '@/components/Screenfull'
import HeaderSearch from '@/components/HeaderSearch'
import FileProgress from "@/components/FileProgress"
import TopNav from '@/components/TopNav'
import SetUp from '@/components/SetUp'
import Memory from '@/components/Memory'
import Browser from '@/components/Browser'
import Network from '@/components/Network'
import VideoPlayer from '@/components/VideoPlayer'

import useSettingsStore from '@/store/modules/settings'
import usePermissionStore from '@/store/modules/permission'
import useAppStore from '@/store/modules/app'

const title = ref('AI工作台');
const version = ref(`v${packageConfig.version}`);
const packDate = ref('2024-9-18');
const showSettings = ref(false);

const { proxy } = getCurrentInstance();

const appStore = useAppStore()
const settingsStore = useSettingsStore()
const permissionStore = usePermissionStore()

const showLogo = computed(() => settingsStore.sidebarLogo);
const needTagsView = computed(() => settingsStore.tagsView);
const fixedHeader = computed(() => settingsStore.fixedHeader);
const sidebarRouters = computed(() => permissionStore.sidebarRouters);
const device = computed(() => useAppStore().device);
const sidebar = computed(() => appStore.sidebar);

const { width, height, mobile } = useDisplay()

watchEffect(() => {
  if (device.value === 'mobile' && sidebar.value.hide) {
    useAppStore().closeSideBar()
  }
  if (mobile.value) {
    console.log("移动端模式", "width:", width.value, height.value)
    useAppStore().toggleDevice('mobile')
    useAppStore().closeSideBar()
  } else {
    console.log("PC端模式", "width:", width.value, height.value)
    useAppStore().toggleDevice('desktop')
  }
})

function toggleSideBar() {
  appStore.toggleSideBar()
}

function setLayout() {
  showSettings.value = true;
}

</script>

<style lang="scss" scoped></style>