<template>
  <v-bottom-sheet :model-value="isBottomAddToHome" :scrim="false" persistent no-click-animation :z-index="2" :retain-focus="false">
    <v-list>
      <v-list-item class="px-4">
        <template v-slot:prepend>
          <v-avatar size="42">
            <v-img aspect-ratio="1/1" cover draggable="false" :src="iconUrl"></v-img>
          </v-avatar>
        </template>

        <template v-slot:title>是否安装平台到桌面？</template>

        <template v-slot:subtitle>以便快速启动AI工作流平台</template>

        <template v-slot:append>
          <v-btn class="text-none" color="primary" text="安装" variant="text" slim @click="handelAddToHome"></v-btn>
          <v-btn class="text-none" color="primary" text="不,谢谢" variant="text" slim @click="handelCloseWindow"></v-btn>
        </template>
      </v-list-item>
    </v-list>
  </v-bottom-sheet>
</template>

<script setup>
import usePwaStore from '@/store/modules/pwa'

const iconUrl = ref('https://ai-workbench.eos-dongguan-7.cmecloud.cn/logo/pwa_logo.png')

const pwaStore = usePwaStore()

const isBottomAddToHome = computed(() => pwaStore.isBottomAddToHome)

function handelAddToHome() {
  pwaStore.addToHome()
  handelCloseWindow()
}

function handelCloseWindow() {
  pwaStore.closeWindow()
}
</script>
