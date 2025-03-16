<template>
  <v-container fluid class="px-0 py-0 h-100">
    <iframe :src="wordUrl" class="px-0 py-0 mx-0 my-0 d-block" width="100%" height="100%" frameborder="0"
            allowfullscreen allowtransparency></iframe>
  </v-container>
</template>

<script setup>
const wordUrl = ref("https://jvn20wgizto.feishu.cn/wiki/Br1ew4edwio59SkxIOLcnHVqnNd");

</script>

<style scoped>
iframe {
  -webkit-overflow-scrolling: touch;
  -webkit-overflow:auto
}
</style>
