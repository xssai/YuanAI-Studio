<template>
  <v-btn variant="plain" @click="handleNewHref" v-tooltip="'升级您的浏览器，以便更好的为您提供服务！'">
    <span class="text-overline">推荐使用谷歌浏览器</span>
    <template v-slot:prepend>
      <svg-icon class-name="text-h5" icon-class="google" />
    </template>
  </v-btn>
</template>

<script setup>
const googleHref = ref('https://www.google.cn/chrome/?hl=zh-CN&standalone=1');

function handleNewHref() {
  // 路径新窗口打开
  window.open(googleHref.value, '_blank');
}
</script>

<style lang='scss' scoped></style>