<template>
  <v-btn @click="toggleClick" density="default" variant="flat" v-tooltip="isActive? '收起导航':'展开导航'">
    <template v-slot:prepend>
      <v-icon>{{isActive? 'mdi-menu-open':'mdi-menu-close'}}</v-icon>
    </template>
    更多
  </v-btn>
</template>

<script setup>
defineProps({
  isActive: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits()
const toggleClick = () => {
  emit('toggleClick');
}
</script>

<style scoped></style>
