<template>
  <v-dialog v-model="isVideoPlayer" max-width="986" location="center" persistent>
    <v-card prepend-icon="mdi-video-4k-box" :title="videoTitle">
      <template v-slot:append>
        <v-btn icon="mdi-close" variant="text" @click="handleCloseVideoWindow"></v-btn>
      </template>
      <v-spacer class="mt-2"></v-spacer>
      <v-card-text class="text-center">
        <video id="_video" class="video" controls preload :src="videoPlayerUrl"
          @loadedmetadata="loadedmetadata"></video>
      </v-card-text>
      <v-card-item>
        <v-row dense class="pl-5 text-subtitle-2">
          <v-slide-x-transition>
            <v-col cols="auto" v-if="(videoPixel.width || currentWidth) && (videoPixel.height || currentHeight)">
              {{ videoPixel.width || currentWidth }} × {{ videoPixel.height || currentHeight }} 像素
            </v-col>
          </v-slide-x-transition>

          <v-slide-x-transition>
            <v-col cols="auto" class="mx-1"
              v-if="(videoPixel.width || currentWidth) && (videoPixel.height || currentHeight)">
              <v-divider vertical length="16px"></v-divider>
            </v-col>
          </v-slide-x-transition>

          <v-slide-x-transition>
            <v-col cols="auto" v-if="videoPlayerUrl">
              {{ strCase(videoPlayerUrl.slice(- 3)) }}
            </v-col>
          </v-slide-x-transition>

          <v-slide-x-reverse-transition>
            <v-col cols="auto" class="mx-1" v-if="videoPlayerUrl && (videoSize || currentSize)">
              <v-divider vertical length="16px"></v-divider>
            </v-col>
          </v-slide-x-reverse-transition>

          <v-slide-x-reverse-transition>
            <v-col cols="auto" v-if="videoSize || currentSize">
              {{ videoSize ? filterSize(videoSize) : filterSize(currentSize) }}
            </v-col>
          </v-slide-x-reverse-transition>

        </v-row>
        <v-row dense class="px-5 py-3">
          <v-menu scroll-strategy="close">
            <template v-slot:activator="{ props, isActive }">
              <v-btn min-width="100%" rounded v-bind="props" color="indigo" :disabled="downLoading"
                :loading="downLoading">
                <template v-slot:append>
                  <v-icon v-if="isActive" icon="mdi-chevron-up"></v-icon>
                  <v-icon v-else icon="mdi-chevron-down"></v-icon>
                </template>
                下载
              </v-btn>
            </template>
            <v-list>
              <template v-if="videoDownloadList.length !== 0">
                <v-list-item v-for="(value, key, index) in videoDownloadList" :key="index" @click="download(value.url)">
                  <div class="d-flex justify-space-between align-center">
                    <div style="width: 44%;">{{ value.width ? value.width : '-' }}×{{ value.height ? value.height : '-'
                      }}</div>
                    <div class="flex-1-1">{{ strCase(value.url.slice(- 3)) }}</div>
                    <div>{{ value.size ? filterSize(value.size) : '-' }}</div>
                  </div>
                </v-list-item>
              </template>
              <template v-else>
                <v-list-item @click="download(videoPlayerUrl)">
                  <div class="d-flex justify-space-between align-center">
                    <div style="width: 44%;">{{ currentWidth ? currentWidth : '-' }}×{{ currentHeight ? currentHeight :
                      '-'
                      }}</div>
                    <div class="flex-1-1">{{ strCase(videoPlayerUrl.slice(- 3)) }}</div>
                    <div>{{ currentSize ? filterSize(currentSize) : '-' }}</div>
                  </div>
                </v-list-item>
              </template>

            </v-list>
          </v-menu>
        </v-row>
      </v-card-item>

    </v-card>
  </v-dialog>
</template>

<script setup>
import { filterSize, strCase } from '@/utils'

import useVideoPlayerStore from "@/store/modules/videoPlayer";

const { proxy } = getCurrentInstance();

const downLoading = ref(false)

const currentWidth = ref(0)
const currentHeight = ref(0)
const currentSize = ref(0)

const videoPlayerStore = useVideoPlayerStore();

const isVideoPlayer = computed(() => videoPlayerStore.isVideoPlayer);
const videoPlayerUrl = computed(() => videoPlayerStore.videoPlayerUrl);
const videoTitle = computed(() => videoPlayerStore.videoTitle);
const videoPixel = computed(() => videoPlayerStore.videoPixel);
const videoSize = computed(() => videoPlayerStore.videoSize);

const videoDownloadList = computed(() => videoPlayerStore.videoDownloadList);


function handleCloseVideoWindow() {
  videoPlayerStore.closeVideoWindow();
  currentWidth.value = 0;
  currentHeight.value = 0
  currentSize.value = 0
}

async function download(url) {
  try {
    downLoading.value = true;
    await proxy.download(url, `video_${new Date().getTime()}.` + videoPlayerUrl.value.slice(- 3));
    downLoading.value = false;
  } catch {
    downLoading.value = false;
  }
}

function loadedmetadata() {
  let video = document.getElementById('_video')
  let width = video.videoWidth;
  let height = video.videoHeight;

  let xhr = new XMLHttpRequest();
  xhr.open('get', videoPlayerUrl.value, true);
  xhr.responseType = 'blob';
  xhr.onload = function () {
    // 获取视频文件大小
    let size = this.response.size
    currentWidth.value = width
    currentHeight.value = height
    currentSize.value = size
  };
  xhr.send();
}


</script>

<style lang='scss' scoped></style>