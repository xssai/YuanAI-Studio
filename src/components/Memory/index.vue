<template>
  <v-scroll-x-reverse-transition>
    <v-list no-gutters v-if="isSupported && memory"  nav slim>
      <template v-if="memory">
        <v-tooltip location="bottom">
          <template v-slot:activator="{ props }">
            <v-list-item class="d-flex align-center" v-bind="props">
              <v-btn icon>
                <v-icon size="28">mdi-memory</v-icon>
              </v-btn>
              <span class="ml-1 text-caption">{{ size(memory.usedJSHeapSize) }}</span>
            </v-list-item>
          </template>

          <div opacity="50" class="d-flex align-center">
            <span class="mr-3">已使用</span>
            <span>{{ size(memory.usedJSHeapSize) }}</span>
          </div>
          <div opacity="50" class="d-flex align-center mt-2">
            <span class="mr-3">已分配</span>
            <span>{{ size(memory.usedJSHeapSize) }}</span>
          </div>
          <div opacity="50" class="d-flex align-center mt-2">
            <span class="mr-3">最大限制</span>
            <span>{{ size(memory.jsHeapSizeLimit) }}</span>
          </div>
        </v-tooltip>
      </template>
    </v-list>
  </v-scroll-x-reverse-transition>
</template>

<script setup>
import { useMemory } from '@vueuse/core'

const { isSupported, memory } = useMemory();

function size(v) {
  const kb = v / 1024 / 1024
  return `${kb.toFixed(2)} MB`
}
</script>

<style lang='scss' scoped></style>