<template>
  <v-btn @click="handleBackClick" density="default" variant="flat" icon="mdi-chevron-left" v-tooltip="'返回上一页'">
  </v-btn>
</template>

<script setup>

let { proxy } = getCurrentInstance();

const handleBackClick = () => {
  proxy.$router.go(-1);
}
</script>

<style scoped></style>
