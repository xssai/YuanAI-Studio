<template>
  <v-btn class="customizer-btn" density="default" v-tooltip="'设置'" icon @click="setLayout">
    <v-icon class="icon">mdi-cog-outline</v-icon>
  </v-btn>
</template>

<script setup>
const emits = defineEmits(['setLayout'])
function setLayout() {
  emits('setLayout');
}
</script>

<style lang='scss' scoped></style>