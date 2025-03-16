<template>
  <v-dialog v-model="browserDialog" width="auto" persistent>
    <v-card max-width="600" prepend-icon="mdi-update"
      text="检测到您的浏览器版本非谷歌引擎,意味着在升级浏览器前可能存在无法正常使用的情况,推荐您升级使用谷歌浏览器,以便我们更好的为您提供服务！" title="浏览器兼容检测">
      <template v-slot:actions>
        <v-btn class="ms-auto" @click="handelUpdateBrowser">前往升级</v-btn>
        <v-btn @click="browserDialog = false">好的</v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { isBrowserChrome } from '@/utils'

const browserDialog = ref(false);

function handelUpdateBrowser() {
  window.open(googleHref.value, '_blank');
  browserDialog.value = false;
}

nextTick(() => {
  if (!isBrowserChrome()) {
    browserDialog.value = true;
  }
})
</script>
