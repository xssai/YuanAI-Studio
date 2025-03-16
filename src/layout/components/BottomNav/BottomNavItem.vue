<template v-if="!item.hidden">
  <template
    v-if="hasOneShowingChild(item.children, item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren) && !item.alwaysShow && item.alShowBottomNav">
    <template v-if="onlyOneChild.meta">
      <v-btn :to="resolvePath(onlyOneChild.path, onlyOneChild.query)" color="light_custom_blue_2">
        <v-icon :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"></v-icon>
        {{ onlyOneChild.meta.title }}
      </v-btn>
    </template>
  </template>

  <template v-else-if="item.alShowBottomNav">
    <template v-if="item.meta">
      <v-menu location="top">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" :active="false">
            <v-icon :icon="item.meta && item.meta.icon"></v-icon>
            {{ item.meta.title }}
          </v-btn>
        </template>

        <v-list>
          <sidebar-item v-for="child in item.children" :key="child.path" :is-nest="true" :item="child"
            :base-path="resolvePath(child.path)" />
        </v-list>
      </v-menu>
    </template>
  </template>
</template>

<script setup>
import { isExternal } from '@/utils/validate'
import { getNormalPath } from '@/utils/public'

import SidebarItem from '../Sidebar/SidebarItem.vue'

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

const onlyOneChild = ref({});

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

function isActiveOnePath(routePath) {
  console.log(isExternal(props.basePath));

}


function hasTitle(title) {
  if (title.length > 5) {
    return title;
  } else {
    return "";
  }
}


</script>
