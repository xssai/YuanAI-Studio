<template>
  <v-menu location="left">
    <template v-slot:activator="{ props }">
      <v-scroll-x-reverse-transition>
        <v-btn v-if="kefuQr" class="qr_icon" icon="mdi-headset" color="light_custom_blue_2" v-bind="props"></v-btn>
      </v-scroll-x-reverse-transition>
    </template>

    <v-card class="px-2 pt-2">
      <v-img width="180" aspect-ratio="1/1" cover draggable="false" :src="kefuQr"></v-img>
      <v-card-text class="text-center">
        <p>点击右上角【积分】</p>
        <p>查看积分和充值</p>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script setup>
import useUserStore from '@/store/modules/user'

const userStore = useUserStore()

const kefuQr = computed(() => userStore.kefuQr);

</script>

<style scoped>
.qr_icon {
  position: fixed;
  right: 12px;
  bottom: 220px;
  z-index: 9999999;
}
</style>
