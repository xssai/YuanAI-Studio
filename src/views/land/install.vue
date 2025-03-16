<template>
  <v-empty-state v-if="isiOS" size="368" min-height="685"
    image="https://ai-workbench.eos-dongguan-7.cmecloud.cn/ad/iosAddToHome.jpg">
    <template v-slot:title>
      <div class="text-h6 mt-8">苹果安装AI工作流教程</div>
    </template>

    <template v-slot:text>
      <div class="text-left mt-4">
        <span class="text-h6">步骤一：</span>
        <span>在 Safari 中显示底部工具栏并点击 【分享】 按钮</span>
      </div>
      <div class="text-left mt-4">
        <span class="text-h6">步骤二：</span>
        <span>向下滚动弹出菜单，直到您看到 【添加到主屏幕】 选项</span>
      </div>
      <div class="text-left mt-4">
        <span class="text-h6">步骤三：</span>
        <span>您可以在下一个屏幕上重命名网站标题。 轻敲 【添加】 在右上角将此 Safari 页面添加到您的 iPhone 屏幕。 之后，您会在主屏幕上看到相关图标。
          您可以通过按住图标直到应用程序摆动来重新排列其位置</span>
      </div>
    </template>
  </v-empty-state>
  <v-empty-state v-else size="298" min-height="685"
    image="https://ai-workbench.eos-dongguan-7.cmecloud.cn/ad/install.png"
    text="数字人构建，视频自动混剪，照片修复，音频调整，热点监测，配备先进的AI助手，提供即时响应与智能搜索服务">

    <template v-slot:title>
      <div class="text-h6 mt-8">AI工作流平台</div>
    </template>

    <template v-slot:actions>
      <v-btn color="#4c00d5" text="立即安装到桌面" @click="handelAddToHome"></v-btn>
    </template>
  </v-empty-state>
</template>

<script setup>
import usePwaStore from '@/store/modules/pwa'

const pwaStore = usePwaStore()

const isiOS = ref(false)

isiOS.value = /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent); //ios终端

function handelAddToHome() {
  pwaStore.addToHome()
}
</script>