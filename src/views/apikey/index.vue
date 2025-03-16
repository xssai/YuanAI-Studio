<template>
  <div class="px-6 py-6">
    <span>APIKEY:</span>
    <span class="ml-4">{{userApiKey}}</span>
    <v-btn class="ml-4" @click="copyToken">复制</v-btn>
    <v-btn class="ml-2" @click="handelApiDocument">接入文档</v-btn>
    <v-btn class="ml-8" @click="handelRefresh">刷新APIKEY（刷新Key后历史接入密钥将失效，请谨慎使用）</v-btn>
  </div>
</template>

<script setup>
import { refreshKey } from '@/api/apiKey'
import useUserStore from '@/store/modules/user'

const { proxy } = getCurrentInstance();
const { text, isSupported, copy } = proxy.useClipboard();

const userStore = useUserStore();

const userApiKey = computed(() => userStore.ApiKey)

/* 复制地址 */
function copyToken() {
  // http 或 https 判断复制是否可用
  if (navigator.clipboard) {
    // https
    copy(userApiKey.value);
  } else {
    // http **已弃用API临时解决方式
    const input = document.createElement('input');
    input.setAttribute('value', userApiKey.value);
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
  }
  proxy.$modal.msgSuccess('已复制到剪贴板');
}

async function handelRefresh() {
  const res = await refreshKey();
  proxy.$modal.msgSuccess("刷新APIKEY成功");
  userStore.getInfo();

}

function handelApiDocument() {
  // 路径新窗口打开
  window.open('https://jvn20wgizto.feishu.cn/wiki/LamMw1ZLWiFQgBkGCMEc1vufnye?from=from_copylink', '_blank');
}
</script>



<style scoped lang="scss">
span {
  word-wrap:break-word;
  word-break:break-all;
}
</style>