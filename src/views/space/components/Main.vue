<template>
  <router-view v-slot="{ Component, route }" >
    <v-slide-x-transition mode="out-in">
        <component v-if="!route.meta.link" :is="Component" :key="route.path" />
    </v-slide-x-transition>
  </router-view>
</template>

<script setup>

</script>
