<template>
  <div ref="VideoMaterialWindowRef" class="h-100">
    <v-row>
      <v-col>
        <v-form ref="VideoMaterialRef" class="pt-3">
          <p ref="TemplateTipsRef" class="text-subtitle-2 font-weight-bold mb-3">文案/主题</p>
          <v-textarea v-model="text" density="compact" :rows="3" clearable :rules="VideoMaterialRules.text"
            placeholder="文案/主题内容匹配视频素材（示例：骑行是一项有利于身心健康的运动）" clear-icon="mdi-close-circle" variant="outlined"
            prepend-inner-icon="mdi-rename-outline" :loading="isLoading" :disabled="isLoading">
          </v-textarea>
        </v-form>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col>
        <p class="text-subtitle-2 font-weight-bold ">搜索结果</p>
      </v-col>
    </v-row>

    <v-row dense align="center">
      <v-col align-self="center">
        <div v-if="videoList.length" class="d-flex align-center">
          <v-icon color="success" icon="mdi-check-circle-outline" size="32"></v-icon>
          <p class="text-button ml-1">素材获取成功</p>

          <v-dialog fullscreen location="center">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn v-bind="activatorProps" v-tooltip="'下载当前所展示的所有视频素材（默认最高画质）'" class="ml-4" variant="plain"
                color="light_custom_blue_2" :disabled="!videoList.length" :loading="downLoading">查看素材</v-btn>
            </template>
            <template v-slot:default="{ isActive }">
              <v-card>
                <v-row align="center" justify="end" dense>
                  <v-slide-x-transition>
                    <v-col cols="auto" v-show="videoIsSelected === true">
                      <v-sheet class="pa-2">
                        <v-btn variant="text" @click="handleAllSelectVideo">
                          <template v-slot:prepend>
                            <v-icon>mdi-check-all</v-icon>
                          </template>
                          全选
                        </v-btn>
                      </v-sheet>
                    </v-col>
                  </v-slide-x-transition>
                  <v-slide-x-transition>
                    <v-col v-show="videoIsSelected === true">
                      <v-sheet class="pa-2">
                        <v-btn variant="text" @click="handleNotAllSelectVideo">
                          <template v-slot:prepend>
                            <v-icon>mdi-cancel</v-icon>
                          </template>
                          取消全选
                        </v-btn>
                      </v-sheet>
                    </v-col>
                  </v-slide-x-transition>
                  <v-slide-x-reverse-transition>
                    <v-col cols="auto" v-show="videoIsSelected === true">
                      <v-sheet class="pa-2">
                        <p class="text-subtitle-2 pr-2">已选择 {{ videoSelectedLength }} 项内容</p>
                      </v-sheet>
                    </v-col>
                  </v-slide-x-reverse-transition>
                  <v-slide-x-reverse-transition>
                    <v-col cols="auto" v-show="videoIsSelected === true">
                      <v-sheet class="pa-2">
                        <v-btn :disabled="videoSelectedLength === 0" @click="videoMultipleDownload" variant="text"
                          v-tooltip:bottom="'批量下载视频画质默认最高'">
                          <template v-slot:prepend>
                            <v-icon>mdi-folder-download-outline</v-icon>
                          </template>
                          下载
                        </v-btn>
                      </v-sheet>
                    </v-col>
                  </v-slide-x-reverse-transition>
                  <v-slide-x-reverse-transition>
                    <v-col cols="auto" v-show="videoIsSelected === true">
                      <v-sheet class="pa-2">
                        <v-divider vertical length="20px"></v-divider>
                      </v-sheet>
                    </v-col>
                  </v-slide-x-reverse-transition>
                  <v-col cols="auto">
                    <v-sheet class="pa-2">
                      <v-btn @click="isSelectChange" variant="text">
                        <template v-slot:prepend>
                          <v-icon v-if="videoIsSelected === false">mdi-checkbox-multiple-marked-outline</v-icon>
                          <v-icon v-if="videoIsSelected === true">mdi-close-circle-multiple-outline</v-icon>
                        </template>
                        {{ videoIsSelected ? '取消选择' : '批量操作' }}
                      </v-btn>
                    </v-sheet>
                  </v-col>
                  <v-col cols="auto">
                    <v-sheet class="pa-2">
                      <v-btn variant="text" icon="mdi-close"
                        @click="isActive.value = false; videoIsSelected = false"></v-btn>
                    </v-sheet>
                  </v-col>
                </v-row>

                <v-container fluid class="fill-height overflow-y-auto py-0 px-2 pb-2" v-scroll.self="onScroll">
                  <Waterfall :list="videoList" :background-color="options.backgroundColor" :gutter="options.gutter"
                    :cross-origin="options.crossOrigin" :animation-effect="options.animationEffect"
                    :has-around-gutter="options.hasAroundGutter" :breakpoints="options.breakpoints"
                    :load-props="options.loadProps" :lazyload="options.lazyload">
                    <template #default="{ item, url, index }">
                      <div
                        :class="{ 'rounded-lg': true, 'overflow-hidden': true, 'position-relative': true, 'elevation-2': true }">
                        <div class="overflow-hidden">
                          <LazyImg class="cursor-pointer zoomed" :url="item.videos.medium.thumbnail"
                            @click="playerVideo(item.videos.small.url, { width: item.videos.small.width, height: item.videos.small.height }, item.videos.small.size, item.videos, item)" />
                        </div>
                        <v-slide-x-transition>
                          <v-checkbox v-if="videoIsSelected" class="position-absolute left-0 top-0"
                            @click.stop.native="() => { }" v-model="videoCheckbox" color="light_custom_blue_2"
                            base-color="white" :value="item.id" hide-details density="comfortable"></v-checkbox>
                        </v-slide-x-transition>
                      </div>

                    </template>
                  </Waterfall>
                </v-container>

                <!-- <template v-slot:actions>
                  <v-btn v-tooltip="'下载当前所展示的所有视频素材（默认最高画质）'" class="me-4" variant="plain" color="light_custom_blue_2"
            :disabled="!videoList.length" :loading="downLoading" @click="downloadAll">批量下载</v-btn>
                  <v-btn @click="isActive.value = false" variant="flat" color="indigo-darken-2" text="关闭"></v-btn>
                </template> -->

              </v-card>
            </template>
          </v-dialog>


        </div>

        <div v-else class="d-flex align-center">
          <v-icon color="info" icon="mdi-progress-question" size="32"></v-icon>
          <p class="text-button  ml-1">暂无搜索资源</p>
        </div>

      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="auto">
        <v-btn variant="flat" color="light_custom_blue_2" prepend-icon="mdi-selection-search" v-tooltip="'获取文案相匹配的视频素材'"
          :loading="isLoading" @click="getVideoMaterials">开始搜索</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import 'animate.css'
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/dist/style.css'
import { getVideoMaterial } from '@/api/sheet/VideoMaterial'
import useVideoPlayerStore from "@/store/modules/videoPlayer";

import loading from '@/assets/images/loading.png'
import error from '@/assets/images/error.png'

const { proxy } = getCurrentInstance();

const { copy } = proxy.useClipboard();


const videoPlayerStore = useVideoPlayerStore();

const videoIsSelected = ref(false);
const videoSelectedLength = computed(() => videoCheckbox.value.length)
const videoCheckbox = ref([])

const isLoading = ref(false)
const downLoading = ref(false)
const isAppendData = ref(false)
const isBottom = ref(false)

const params = reactive({
  text: "骑行是一项有利于身心健康的运动",
  page: 1,
  page_size: 15
})

const { text, page, page_size } = toRefs(params);

const videoList = ref([])
const total_pages = ref(0)

const VideoMaterialRules = ref({
  text: [v => !!v || "输入主题/文案内容"]
});

const options = reactive({
  // 唯一key值
  rowKey: 'id',
  // 卡片之间的间隙
  gutter: 10,
  // 是否有周围的gutter
  hasAroundGutter: false,
  // 卡片在PC上的宽度
  width: 320,
  // 自定义行显示个数，主要用于对移动端的适配
  breakpoints: {
    3840: {
      // 4K下
      rowPerView: 8,
    },
    2560: {
      // 2K下
      rowPerView: 7,
    },
    1920: {
      // 2K下
      rowPerView: 6,
    },
    1600: {
      // 2K下
      rowPerView: 5,
    },
    1366: {
      // 2K下
      rowPerView: 4,
    },
    800: {
      // 当屏幕宽度小于等于800
      rowPerView: 3,
    },
    500: {
      // 当屏幕宽度小于等于500
      rowPerView: 2,
    },
  },
  // 动画效果
  animationEffect: 'animate__fadeInUp',
  // 动画时间
  animationDuration: 1000,
  // 动画延迟
  animationDelay: 300,
  animationCancel: false,
  // 背景色
  backgroundColor: 'transparent',
  // imgSelector
  imgSelector: 'src.original',
  // 加载配置
  loadProps: {
    loading,
    error,
    ratioCalculator: (width, height) => {
      // 我设置了最小宽高比
      const minRatio = 3 / 4
      const maxRatio = 4 / 3
      return Math.random() > 0.5 ? minRatio : maxRatio
    },
  },
  // 是否懒加载
  lazyload: true,
  crossOrigin: true,
  // align: 'center',
})

/* 提取视频 */
async function getVideoMaterials() {
  try {
    page.value = 1;
    page_size.value = 70;
    videoList.value = [];
    isLoading.value = true;
    const result = await getVideoMaterial(params);
    videoList.value = result.data
    total_pages.value = result.total_pages
    isLoading.value = false;
  } catch {
    isLoading.value = false;
    proxy.$modal.msgWarning('获取AI视频素材异常');
  }
}
// 节流滚动行为
function enhanced_throttle(func, wait) {
  let lastTime = 0
  let timer = null

  return function () {
    const context = this
    const args = arguments
    let now = Date.now()

    if (now - lastTime < wait) {
      clearTimeout(timer) // debounce的推迟执行效果
      timer = setTimeout(() => {
        lastTime = now
        func.apply(context, args)
      }, wait)
    } else {
      lastTime = now
      func.apply(context, args)
    }
  }
}

/* 滚动事件 */
const onScroll = enhanced_throttle(function (e) {
  const scrollHeight = e.target.scrollHeight - 180
  const scrollTop = e.target.scrollTop
  const clientHeight = e.target.clientHeight
  console.log(Math.floor(scrollTop + clientHeight) + 1 >= scrollHeight)
  if (Math.floor(scrollTop + clientHeight) + 1 >= scrollHeight && !isAppendData.value && !isLoading.value) {
    appendData()
  }
}, 1000);

//追加数据
async function appendData() {
  if (page.value < total_pages.value) {
    console.log("触底更新");
    page.value += 1;
    isAppendData.value = true
    const result = await getVideoMaterial(params);
    result.data.forEach(element => {
      videoList.value.push(element)
    });
    isAppendData.value = false
  } else {
    isBottom.value = true
  }

}

/* 下载当前所加载完成的所有视频素材 */
async function downloadAll() {
  downLoading.value = true;
  for (let i = 0; i < videoList.value.length; i++) {
    const url = videoList.value[i].videos[`${Object.keys(videoList.value[i].videos)[0]}`].url;
    await proxy.download(url, `video_${new Date().getTime()}_${i + 1}.mp4`);
  }

  downLoading.value = false;
}

/* 预览作品 */
function playerVideo(videoUrl, pixel, size, downloadList, item) {
  videoPlayerStore.openVideoWindow({ videoUrl, pixel, size, downloadList });
}

function isSelectChange() {
  videoIsSelected.value = !videoIsSelected.value
  videoCheckbox.value = []
}

/* 全选视频 */
function handleAllSelectVideo() {
  let imgDigitalCheckboxTemp = [];

  videoList.value.forEach(item => {
    imgDigitalCheckboxTemp.push(item.id)
  })

  videoCheckbox.value = imgDigitalCheckboxTemp
}

/* 取消全选视频 */
function handleNotAllSelectVideo() {
  videoCheckbox.value = []
}

/* 视频批量下载 */
async function videoMultipleDownload() {
  for (let i = 0; i < videoCheckbox.value.length; i++) {
    for (let k = 0; k < videoList.value.length; k++) {
      if (videoList.value[k].id == videoCheckbox.value[i]) {
        Object.values(videoList.value[k].videos)[0].url ? proxy.download(Object.values(videoList.value[k].videos)[0].url, `video-${new Date().getTime()}-${Object.values(videoList.value[k].videos)[0].width}-${new Date().getTime()}-${Object.values(videoList.value[k].videos)[0].height}.mp4`) : null;
      }
    }
  }
}

getVideoMaterials();
</script>


<style scoped>
.lazy__img[lazy=loading] {
  padding: 5em 0;
  width: 48px;
}

.lazy__img[lazy=loaded] {
  width: 100%;
}

.lazy__img[lazy=error] {
  padding: 5em 0;
  width: 48px;
}
</style>
