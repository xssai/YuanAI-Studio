<template>
  <v-breadcrumbs class="pl-0" color="#97a8be" divider="-" :items="levelList">
    <template v-slot:item="{ item,index }">
      <v-breadcrumbs-item>
        <span v-if="item.redirect === 'noRedirect' || index == levelList.length - 1"  class="text-subtitle-2">{{ item.meta.title }}</span>
        <!-- 二级菜单显示一级标题 -->
        <span v-else class="text-subtitle-2" >{{ item.meta.title }}</span>
<!--        @click.prevent="handleLink(item)"-->
      </v-breadcrumbs-item>
    </template>
  </v-breadcrumbs>
</template>

<script setup>
const route = useRoute();
const router = useRouter();
const levelList = ref([])


function getBreadcrumb() {
  // only show routes with meta.title
  let matched = route.matched.filter(item => item.meta && item.meta.title);

  // 判断是否为首页
  // const first = matched[0]
  // console.log(isDashboard(matched[0]),"判断是否为首页")
  //
  // if (isDashboard(first)) {
  //   matched = [{ path: '/index', meta: { title: '首页' } }].concat(matched)
  // }

  levelList.value = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)


}
function isDashboard(route) {
  const name = route && route.name
  if (!name) {
    return false
  }
  return name.trim() === 'Index'
}
function handleLink(item) {
  const { redirect, path } = item
  console.log(redirect,item)
  if (redirect) {
    router.push(redirect)
    return
  }
  router.push(path)
}

watchEffect(() => {
  // if you go to the redirect page, do not update the breadcrumbs
  if (route.path.startsWith('/redirect/')) {
    return
  }
  getBreadcrumb()
})


getBreadcrumb();
</script>

<style lang='scss' scoped></style>