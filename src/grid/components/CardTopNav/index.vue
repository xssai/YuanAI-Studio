<template>
  <v-toolbar density="compact" color="transparent" flat class="border-b-sm">
    <template v-slot:prepend>
      <v-btn icon>
        <v-img :width="28" aspect-ratio="1/1" cover draggable="false" :src="img"></v-img>
      </v-btn>
    </template>
    <v-toolbar-title class="text-subtitle-1 mx-0">{{ title }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-menu @update:modelValue="menuEventChange" scroll-strategy="close">
      <template v-slot:activator="{ props }">
        <v-btn :class="{ 'steps-five-open-compoment-config': guide }" icon size="small" v-tooltip:bottom="'更多设置'"
          v-bind="props">
          <v-icon>mdi-dots-horizontal</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-list>
          <v-list-item>
            <v-switch v-model="isDraggable" hide-details inset color="indigo"
              :class="{ 'steps-six-close-compoment-draggable': guide }" :label="'启用拖动'"
              @click="handleDraggable"></v-switch>
          </v-list-item>
          <v-list-item>
            <v-switch v-model="isResizable" hide-details inset color="indigo" :label="'启用缩放'"
              @click="handleResizable"></v-switch>
          </v-list-item>
          <v-list-item @click="handleCloseCard">
            <template v-slot:prepend>
              <v-icon>mdi-window-close</v-icon>
            </template>
            关闭组件
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>

  </v-toolbar>
</template>

<script setup>
const { proxy } = getCurrentInstance();

const props = defineProps({
  title: {
    type: String,
    default: null
  },
  img: {
    type: String,
    default: null
  },
  name: {
    type: String,
    default: "组件未命名"
  },
  guide: {
    type: Boolean,
    default: false
  }
})

const isDraggable = defineModel("isDraggable")
const isResizable = defineModel("isResizable")

const emits = defineEmits(['handleDraggable', 'handleResizable', 'handleCloseCard']);

function handleDraggable() {
  emits('handleDraggable', !isDraggable.value);
}
function handleResizable() {
  emits('handleResizable', !isResizable.value);
}
function handleCloseCard() {
  emits('handleCloseCard');
}

function menuEventChange(event) {
  
}


</script>

<style lang='scss' scoped></style>