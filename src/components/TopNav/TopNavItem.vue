<template>
  <div v-if="!item.hidden">
    <template
      v-if="hasOneShowingChild(item.children, item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren) && !item.alwaysShow">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path, onlyOneChild.query)">
        <v-list-item color="purple-darken-3" :to="resolvePath(onlyOneChild.path)" slim nav variant="flat">
          <template v-slot:prepend>
            <v-icon size="20px" :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"></v-icon>
          </template>
          {{ hasTitle(onlyOneChild.meta.title) }}
        </v-list-item>
      </app-link>
    </template>

    <v-menu v-else transition="fab-transition">
      <template v-if="item.meta" v-slot:activator="{ props: menu, isActive }">
        <v-list-item v-bind="menu" slim nav variant="flat">
          <template v-slot:prepend>
            <v-icon size="20px" :icon="item.meta && item.meta.icon"></v-icon>
          </template>
          {{ item.meta.title }}
          <template v-slot:append>
            <v-icon v-if="!isActive" size="20px" icon="mdi-chevron-right"></v-icon>
            <v-icon v-else size="20px" icon="mdi-chevron-down"></v-icon>
          </template>
        </v-list-item>
      </template>

      <v-expand-transition>
        <v-list class="px-4">
          <top-nav-item v-for="child in item.children" :key="child.path" :is-nest="true" :item="child"
            :base-path="resolvePath(child.path)" />
        </v-list>
      </v-expand-transition>

    </v-menu>
  </div>
</template>

<script setup>
import { isExternal } from '@/utils/validate'
import AppLink from './Link'
import { getNormalPath } from '@/utils/public'

const props = defineProps({
  // route object
  item: {
    type: Object,
    required: true
  },
  isNest: {
    type: Boolean,
    default: false
  },
  basePath: {
    type: String,
    default: ''
  }
})

const route = useRoute();

const onlyOneChild = ref({});

const activeMenu = computed(() => {
  const { meta, path } = route;
  // 如果设置了路径，侧边栏将突出显示设置的路径
  console.log(meta, path, "路由meta")
  if (meta.activeMenu) {
    return meta.activeMenu;
  }
  return path;
})

function hasOneShowingChild(children = [], parent) {
  // console.log(children, parent,"router！！！！")
  if (!children) {
    children = [];
  }
  const showingChildren = children.filter(item => {
    if (item.hidden) {
      return false
    } else {
      onlyOneChild.value = item
      return true
    }
  })


  if (showingChildren.length === 1) {
    return true
  }

  if (showingChildren.length === 0) {

    onlyOneChild.value = { ...parent, path: '', noShowingChildren: true }

    return true
  }

  return false
};

function resolvePath(routePath, routeQuery) {
  if (isExternal(routePath)) {
    return routePath
  }
  if (isExternal(props.basePath)) {
    return props.basePath
  }
  if (routeQuery) {
    let query = JSON.parse(routeQuery);
    return { path: getNormalPath(props.basePath + '/' + routePath), query: query }
  }
  return getNormalPath(props.basePath + '/' + routePath)
}

function hasTitle(title) {
  if (title.length > 1) {
    return title;
  } else {
    return "";
  }
}

</script>
