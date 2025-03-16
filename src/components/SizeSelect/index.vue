<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <div>
        <v-btn density="default" icon="mdi-format-size" v-bind="props" v-tooltip="'布局大小'"></v-btn>
      </div>
    </template>
    <v-list>
      <v-list-item v-for="item in sizeOptions" :key="item.value" :disabled="size === item.value" :command="item.value"
        @click="handleSetSize(item.value)">
        <v-list-item-title>{{ item.label }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
import useAppStore from "@/store/modules/app";

const appStore = useAppStore();
const size = computed(() => appStore.size);
const sizeOptions = ref([
  { label: "较大", value: "large" },
  { label: "默认", value: "default" },
  { label: "稍小", value: "small" },
]);

function handleSetSize(size) {
  // proxy.$modal.loading("正在设置布局大小，请稍候...");
  appStore.setSize(size);
  setTimeout("window.location.reload()", 1000);
}
</script>

<style lang='scss' scoped></style>