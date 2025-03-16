<template>
  <v-fab :active="scrollTop > 400" icon="mdi-arrow-up" location="bottom right" color="light_custom_blue_2" app
    position="sticky" transition="slide-y-reverse-transition" @click.stop="handelScrollTop"></v-fab>
</template>

<script setup>
 import { useGoTo } from 'vuetify'

const goTo = useGoTo()

const scrollTop = ref(0)

const options = ref({
    container: '#goto-container-example',
    duration: 1200,
    easing: 'easeInOutQuad',
    offset: 0,
  })

function onScroll() {
  const scroll = document.documentElement.scrollTop || document.body.scrollTop;
  scrollTop.value = scroll
}

function handelScrollTop() {
  goTo(0, options.value)
}

onMounted(() => {
  window.addEventListener('scroll', onScroll)
})

</script>
