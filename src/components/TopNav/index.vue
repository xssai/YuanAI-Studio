<template>
  <v-list :modelValue="activeMenu" class="d-flex align-center overflow-x-auto">
    <top-nav-Item v-for="(route, index) in sidebarRouters" :key="route.path + index" :item="route"
      :base-path="route.path" />
  </v-list>
</template>

<script setup>
import TopNavItem from './TopNavItem'
import usePermissionStore from '@/store/modules/permission'

const route = useRoute();
const permissionStore = usePermissionStore()

const sidebarRouters = computed(() => permissionStore.sidebarRouters);

const activeMenu = computed(() => {
  const { meta, path } = route;
  // 如果设置了路径，侧边栏将突出显示设置的路径
  console.log(meta, path, "路由meta")
  if (meta.activeMenu) {
    return meta.activeMenu;
  }
  return path;
})

</script>
