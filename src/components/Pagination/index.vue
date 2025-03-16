<template>
  <v-row justify="end" align="center" class="py-4">
    <v-col cols="auto">
      <v-select v-model="pageSize" density="comfortable" :items="[10, 15, 20, 50, 100]" variant="outlined" hide-details
        hide-spin-buttons @update:modelValue="handleSizeChange">
        <template v-slot:prepend>
          <div>每页展示</div>
        </template>
        <template v-slot:append>
          <div>
            <span>条</span>

            <span class="text-subtitle-1 ml-8">共</span>
            <span class="text-subtitle-1 mx-1">{{ total ? total : 0 }}</span>
            <span class="text-subtitle-1">条</span>
          </div>

        </template>
      </v-select>
    </v-col>
    <v-col cols="3">
      <v-pagination :density="density" v-model="currentPage" :length="pageCount"
        @update:model-value="handleCurrentChange"></v-pagination>
    </v-col>
  </v-row>
</template>

<script setup>
const props = defineProps({
  total: {
    required: true,
    type: Number
  },
  page: {
    type: Number,
    default: 1
  },
  limit: {
    type: Number,
    default: 10
  },
  pageSizes: { //预留每页展示条数显示
    type: Array,
    default: []
  },
  density: {
    type: String,
    default: 'compact'
  }
})

const emit = defineEmits();

const pageCount = computed(() => {
  return Math.ceil(props.total / props.limit)
})

const currentPage = computed({
  get() {
    return props.page
  },
  set(val) {
    emit('update:page', val)
  }
})
const pageSize = computed({
  get() {
    return props.limit
  },
  set(val) {
    if (Number(val)) {
      emit('update:limit', Number(val))
    }

  }
})

function handleSizeChange(val) {
  if (currentPage.value * val > props.total) {
    currentPage.value = 1
  }
  emit('pagination', { page: currentPage.value, limit: val })

}
function handleCurrentChange(val) {
  emit('pagination', { page: val, limit: pageSize.value })

}

</script>

<style scoped></style>