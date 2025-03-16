<template>
  <v-container fluid>
    <v-container fluid v-if="videoCloneTemplateCustomList.length">
      <v-row align="center">
        <v-col cols="12" md="3" order-sm="last">
          <v-autocomplete label="数字分身搜索" clearable density="comfortable" hide-details hide-no-data
            prepend-icon="mdi-magnify" :items="videoSearchList" item-title="name" item-value="id" variant="underlined">
            <template v-slot:chip="{ props, item }">
              <v-chip v-bind="props" :prepend-avatar="item.raw.cover" :text="item.raw.name"></v-chip>
            </template>
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props" :prepend-avatar="item.raw.cover" :subtitle="formatDate(item.raw.clone_time)"
                :title="item.raw.name" @click.stop="handelScrollTarget(item.raw.searchId)"></v-list-item>
            </template>
          </v-autocomplete>
        </v-col>

        <v-col class="pt-4 text-h6" cols="12" md="9" order-sm="first">
          <span>我的专属真人分身（{{ videoCloneTemplateCustomList.length }}）</span>
        </v-col>

      </v-row>

      <v-row>
        <template v-for="item in videoCloneTemplateCustomList" :key="item.id">
          <v-col cols="6" md="3">
            <div
              :class="{ 'rounded-lg': true, 'overflow-hidden': true, 'position-relative': true, 'elevation-1': true }"
              style="height: 190px;">
              <div class="backgroud_Img_full" :style="{ 'background-image': `url(${item.cover})` }"></div>
              <v-img :id="`video-${trimSpecial(item.name)}`" rounded="lg"
                :class="{ 'custom_elevation': `video-${trimSpecial(item.name)}` === scrollTargetAnimation }"
                draggable="false" :src="item.cover" class="cursor-pointer zoomed"
                @click.stop="playerVideo(item.clone_address)">
                <template v-slot:error>
                  <v-row align="center" class="fill-height ma-0" justify="center">
                    <v-img width="48" height="48" :src="error"></v-img>
                  </v-row>
                </template>
              </v-img>

              <div class="px-3 py-2 position-absolute bottom-0 left-0">
                <p class="text-subtitle-2 text-white">{{ item.name }}</p>
                <p class="text-caption text-white"> {{ item.clone_time ? formatDate(item.clone_time) : '正在计算生成时间' }}
                </p>
              </div>

              <div v-if="item.status === 2" class="position-absolute right-0 top-0">
                <v-row justify="end" dense>
                  <v-col cols="auto">
                    <v-menu scroll-strategy="close">
                      <template v-slot:activator="{ props }">
                        <v-btn icon variant="text" size="small" v-bind="props">
                          <v-icon size="30" color="white">mdi-dots-horizontal</v-icon>
                        </v-btn>
                      </template>
                      <v-list>
                        <v-list-item :disabled="item.clone_address == null"
                          @click.stop="playerVideo(item.clone_address)">
                          <template v-slot:prepend>
                            <v-icon icon="mdi-video-4k-box"></v-icon>
                          </template>
                          <v-list-item-title>预览形象</v-list-item-title>
                        </v-list-item>

                        <v-list-item :disabled="item.clone_address == null" @click.stop="copyUrl(item.clone_address)">
                          <template v-slot:prepend>
                            <v-icon icon="mdi-image-multiple"></v-icon>
                          </template>
                          <v-list-item-title>复制链接</v-list-item-title>
                        </v-list-item>

                        <v-list-item :disabled="item.clone_address == null"
                          @click.stop="downloadsVideo(item.clone_address)">
                          <template v-slot:prepend>
                            <v-icon icon="mdi-cloud-arrow-down-outline"></v-icon>
                          </template>
                          <v-list-item-title>下载形象</v-list-item-title>
                        </v-list-item>

                        <v-list-item @click.stop="handleDelVideoClone(item.id)">
                          <template v-slot:prepend>
                            <v-icon icon="mdi-delete-outline"></v-icon>
                          </template>
                          <v-list-item-title>删除形象</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-col>
                </v-row>


              </div>

              <div v-else style="width:100%; background-color: rgba(0, 0, 0, 0.4);"
                class="d-flex flex-column justify-center align-center position-absolute left-0 top-0 fill-height">
                <v-progress-circular :model-value="rate(item.status)" :rotate="360" :size="80" :width="4" color="white">
                  <template v-slot:default> {{ rate(item.status) }} % </template>
                </v-progress-circular>
                <div class="mt-4 text-white text-subtitle-2">
                  <span>{{ translate(item.status) }}</span>
                </div>
              </div>

            </div>
          </v-col>
        </template>
      </v-row>
    </v-container>

    <v-container fluid v-if="videoCloneTemplatePublicList.length">
      <v-row align="center">
        <v-col class="pt-4 text-h6" cols="auto">
          <span>平台数字分身资产（{{ videoCloneTemplatePublicList.length }}）</span>
        </v-col>
      </v-row>

      <v-row>
        <template v-for="item in videoCloneTemplatePublicList" :key="item.id">
          <v-col cols="6" md="3">
            <div
              :class="{ 'rounded-lg': true, 'overflow-hidden': true, 'position-relative': true, 'elevation-2': true }"
              style="height: 190px;">
              <div class="backgroud_Img_full" :style="{ 'background-image': `url(${item.cover})` }"></div>

              <v-img :id="`video-${trimSpecial(item.name)}`" rounded="lg" draggable="false" :src="item.cover"
                height="100%" class="cursor-pointer zoomed" @click.stop="playerVideo(item.wm_address)"
                :class="{ 'custom_elevation': `video-${trimSpecial(item.name)}` === scrollTargetAnimation }">
                <template v-slot:error>
                  <v-row align="center" class="fill-height ma-0" justify="center">
                    <v-img width="48" height="48" :src="error"></v-img>
                  </v-row>
                </template>
              </v-img>

              <div class="px-3 py-2 position-absolute bottom-0 left-0">
                <p class="text-subtitle-2 text-white"> {{ item.name }}</p>
                <p class="text-caption text-white"> {{ item.clone_time ? formatDate(item.clone_time) : '正在计算生成时间' }}
                </p>
              </div>

              <div v-if="item.status === 2" class="position-absolute right-0 top-0">
                <v-row justify="end" dense>
                  <v-col cols="auto">
                    <v-menu scroll-strategy="close">
                      <template v-slot:activator="{ props }">
                        <v-btn icon variant="text" size="small" v-bind="props">
                          <v-icon size="30" color="white">mdi-dots-horizontal</v-icon>
                        </v-btn>
                      </template>
                      <v-list>
                        <v-list-item :disabled="item.wm_address == null" @click.stop="playerVideo(item.wm_address)">
                          <template v-slot:prepend>
                            <v-icon icon="mdi-video-4k-box"></v-icon>
                          </template>
                          <v-list-item-title>预览形象</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-col>
                </v-row>
              </div>

              <div v-else style="width:100%; background-color: rgba(0, 0, 0, 0.4);"
                class="d-flex flex-column justify-center align-center position-absolute left-0 top-0 fill-height">
                <v-progress-circular :model-value="rate(item.status)" :rotate="360" :size="80" :width="4" color="white">
                  <template v-slot:default> {{ rate(item.status) }} % </template>
                </v-progress-circular>
                <div class="mt-4 text-white text-subtitle-2">
                  <span>{{ translate(item.status) }}</span>
                </div>
              </div>

            </div>

          </v-col>
        </template>
      </v-row>
    </v-container>


  </v-container>
</template>

<script setup>
import { useGoTo } from 'vuetify'
import { delVideoCloneTemplate } from '@/api/sheet/VideoFigure'

import useCloneDataStore from '@/store/modules/cloneData'
import useVideoPlayerStore from "@/store/modules/videoPlayer"


import error from '@/assets/images/error.png'

const { proxy } = getCurrentInstance();

const { text, isSupported, copy } = proxy.useClipboard();

const goTo = useGoTo()

const loading = ref(true)
const scrollTargetAnimation = ref('');

const videoSearchList = computed(() => {
  let newVideoList = [...cloneDataStore.videoCloneTemplateCustom, ...cloneDataStore.videoCloneTemplatePublic]
  newVideoList.forEach((element, index) => {
    element['searchId'] = proxy.trimSpecial(element.name)
  });
  return newVideoList
});

const cloneDataStore = useCloneDataStore();
const videoPlayerStore = useVideoPlayerStore();

const videoCloneTemplateCustomList = computed(() => cloneDataStore.videoCloneTemplateCustom);
const videoCloneTemplatePublicList = computed(() => cloneDataStore.videoCloneTemplatePublic);


/* 下载视频 */
function downloadsVideo(videoUrl) {
  proxy.download(videoUrl, `video_clone_${new Date().getTime()}.mp4`);
}

/* 预览作品 */
function playerVideo(videoUrl) {
  videoPlayerStore.openVideoWindow({ videoUrl });
}

/* 复制地址 */
function copyUrl(videoUrl) {
  // http 或 https 判断复制是否可用
  if (navigator.clipboard) {
    // https
    copy(videoUrl);
  } else {
    // http **已弃用API临时解决方式
    const input = document.createElement('input');
    input.setAttribute('value', videoUrl);
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
  }
  proxy.$modal.msgSuccess('链接已复制到剪贴板');
}

/* 获取形象模板 */
async function getList() {
  loading.value = true
  await cloneDataStore.getVideoCloneTemplateCustoms()
  await cloneDataStore.getVideoCloneTemplatePublics()
  loading.value = false
}

/* 删除形象克隆模板 */
async function handleDelVideoClone(id) {
  const delVideoCloneTemplateRes = await delVideoCloneTemplate({ ids: [id] });
  if (delVideoCloneTemplateRes.code == 200) {
    getList();
    proxy.$modal.msgSuccess(delVideoCloneTemplateRes.message);
  } else {
    proxy.$modal.msgWarning(delVideoCloneTemplateRes.message);
  }
}

/* 滚动到指定位置 */
function handelScrollTarget(name) {
  const options = {
    container: '#goto-container-example',
    duration: 900,
    easing: 'easeInOutQuad',
    offset: -300,
  }
  goTo(`#video-${name}`, options).then((scrollTop) => {
    scrollTargetAnimation.value = `video-${name}`;
    let timer = setTimeout(() => {
      scrollTargetAnimation.value = "";
      clearTimeout(timer)
    }, 2200)
  })
}


getList()

</script>