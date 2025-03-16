<template>
  <v-scroll-x-reverse-transition>
    <v-btn v-if="isTopAddToHome" variant="plain" @click="handelAddToHome" v-tooltip="'便于在桌面快速启动AI工作流平台'">
      <span class="text-overline">安装应用到桌面</span>
      <template v-slot:prepend>
        <v-img width="26" aspect-ratio="1/1" cover draggable="false" :src="installIcon"></v-img>
      </template>
    </v-btn>
  </v-scroll-x-reverse-transition>
</template>

<script setup>
import installIcon from '@/assets/icons/img/installer.png'
import usePwaStore from '@/store/modules/pwa'
import useAppStore from '@/store/modules/app'

const appStore = useAppStore()
const pwaStore = usePwaStore()

const isTopAddToHome = computed(() => pwaStore.isTopAddToHome)

function handelAddToHome() {
  pwaStore.addToHome()
}
</script>
