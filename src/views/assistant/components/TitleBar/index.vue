<template>
  <v-responsive
      class="mx-auto"
      max-width="334"
  >
    <v-text-field
        model-value="title"
        variant="plain"
    ></v-text-field>
  </v-responsive>
</template>

<script setup>
const title = ref("撒大苏打啊实打实的阿松大")

</script>


<style lang="scss" scoped>
:deep .v-text-field .v-field--active input {
  text-align: center !important;
}
</style>