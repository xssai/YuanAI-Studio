<template>
  <div v-if="!item.hidden">
    <!-- 递归路由 -->
    <template
      v-if="hasOneShowingChild(item.children, item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren) && !item.alwaysShow">
      <AppLink v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path, onlyOneChild.query)">
        <v-list-item color="light_custom_blue_2" rounded="pill" :class="{ 'mt-1': true, 'steps--one-aiimg-router': resolvePath(onlyOneChild.path) === '/aiimage',
        'steps-four-go-sheet': resolvePath(onlyOneChild.path) === '/sheet' }" :to="resolvePath(onlyOneChild.path)">
          <!-- :value="resolvePath(onlyOneChild.path)" 导航栏 value 进行路由切换，高亮显示会出现冲突 ！！！！！！！ -->
          <template v-slot:prepend>
            <v-icon :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"></v-icon>
          </template>
          <v-list-item-title>{{ onlyOneChild.meta.title }}</v-list-item-title>
        </v-list-item>
      </AppLink>
    </template>
    

    <v-list-group v-else :value="resolvePath(item.path)">
      <template v-if="item.meta" v-slot:activator="{ props }">
        <v-list-item class="mt-1" v-bind="props" rounded="pill" color="light_custom_blue_2">
          <template v-slot:prepend>
            <v-icon :icon="item.meta && item.meta.icon"></v-icon>
          </template>
          <v-list-item-title>{{ item.meta.title }}</v-list-item-title>
        </v-list-item>
      </template>

      <sidebar-item v-for="child in item.children" :key="child.path" :is-nest="true" :item="child"
        :base-path="resolvePath(child.path)" />

    </v-list-group>
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

function hasTitle(title) {
  if (title.length > 1) {
    return title;
  } else {
    return "";
  }
}


</script>
