<template>
    <router-view v-slot="{ Component, route }" >
      <v-slide-x-transition mode="out-in">
        <keep-alive :include="tagsViewStore.cachedViews">
          <component v-if="!route.meta.link" :is="Component" :key="route.path" />
        </keep-alive>
      </v-slide-x-transition>
    </router-view>
</template>

<script setup>
// import iframeToggle from "./IframeToggle/index"   <!-- <iframe-toggle /> -->
import useTagsViewStore from '@/store/modules/tagsView'

const tagsViewStore = useTagsViewStore()

</script>

<style lang="scss" scoped>
//.appMain {
//  width: 100%;
//  min-height: calc(100vh - 96px - 56px);  // topNav height:96px
//}

</style>
