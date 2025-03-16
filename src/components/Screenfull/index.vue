<template>
  <div>
    <v-btn density="default" :icon="isFullscreen?'mdi-fullscreen-exit':'mdi-fullscreen'" v-tooltip="isFullscreen ? '退出全屏' : '全屏'" @click="toggle"></v-btn>
  </div>
</template>

<script setup>
import { useFullscreen } from '@vueuse/core'

const { isFullscreen, enter, exit, toggle } = useFullscreen();
</script>

<style lang='scss' scoped>
</style>