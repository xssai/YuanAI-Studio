<template>
    <v-snackbar :model-value="isShowProgress" vertical :timeout="-1" location="right">
        <div class="text-subtitle-1 pb-2">文件传输</div>
        <div v-for="item in progressList" :key="item.path" class="d-flex align-center justify-center mb-4" style="width: 342px;">
            <div>
                <v-icon v-if="item.type == 'upload'" icon="mdi-folder-arrow-up-outline" ></v-icon>
                <v-icon v-else icon="mdi-folder-arrow-down-outline"></v-icon>
            </div>
            <div class="ml-4 flex-1-1">
                <p class="text-subtitle-2 text-truncate" style="max-width: 230px;">{{ item.name }}</p>
                <div>
                    <span class="text-caption">{{ item.loaded }}</span>
                    <span class="text-caption">/</span>
                    <span class="text-caption">{{ item.total }}</span>
                </div>
                <v-progress-linear class="mt-2" buffer-value="0"  :model-value="item.progress"
                    stream></v-progress-linear>
            </div>
            <div class="text-caption ml-4">{{item.progress}}%</div>
        </div>
        <template v-slot:actions>
            <v-btn variant="text" @click="handleCloseProgress">关闭</v-btn>
        </template>
    </v-snackbar>
</template>

<script setup>
import useFileProgressStore from '@/store/modules/fileProgress'

const fileProgressStore = useFileProgressStore();

const progressList = computed(() =>  fileProgressStore.progressList);
const isShowProgress = computed(() => fileProgressStore.showProgress);

function handleCloseProgress() {
    fileProgressStore.closeFileProgress();
}

</script>

<style lang='scss' scoped></style>