<template>
  <v-container fluid class="px-0 py-0 pt-3">
    <v-row>
      <v-col>
        <v-form ref="douyinWorksExtractionRef">
          <p class="text-subtitle-2 font-weight-bold mb-3">个人作品页面地址</p>
          <v-textarea v-model="sec_user_id" density="compact" :rows="3" clearable
            :rules="douyinWorksExtractionRules.sec_user_id" placeholder="抖音个人主页视频作品链接,例：https 开头地址"
            clear-icon="mdi-close-circle" variant="outlined" prepend-inner-icon="mdi-rename-outline"
            :loading="isLoading" :disabled="isLoading">
          </v-textarea>
        </v-form>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col>
        <v-tooltip>
          <template v-slot:activator="{ props }">
            <p v-bind="props" class="text-caption">
              1. 如何获得抖音个人主页作品链接?
            </p>
          </template>

          <v-img width="880" aspect-ratio="1/1" src="https://ai-workbench.eos-dongguan-7.cmecloud.cn/desc/douyin_personal_extraction.webp"
            draggable="false"></v-img>
        </v-tooltip>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <p class="text-subtitle-2 font-weight-bold ">搜索结果</p>
      </v-col>
    </v-row>

    <v-row dense align="center">
      <v-col align-self="center">
        <div v-if="douYinList.length" class="d-flex align-center">
          <v-icon color="success" icon="mdi-check-circle-outline" size="32"></v-icon>
          <p class="text-button ml-1">作品提取成功</p>

          <v-dialog fullscreen location="center">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn v-bind="activatorProps" v-tooltip="'下载当前所展示的所有视频素材（默认最高画质）'" class="ml-4" variant="plain"
                color="light_custom_blue_2" :disabled="!douYinList.length" :loading="!douYinList.length">去查看作品</v-btn>
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
                  <!-- <v-slide-x-reverse-transition>
                    <v-col cols="auto" v-show="videoIsSelected === true">
                      <v-sheet class="pa-2">
                        <v-menu scroll-strategy="close">
                          <template v-slot:activator="{ props }">
                            <v-btn :disabled="videoSelectedLength === 0" v-bind="props" variant="text"
                              v-tooltip:bottom="'批量下载视频画质默认最高'">
                              <template v-slot:prepend>
                                <v-icon>mdi-cloud-arrow-down-outline</v-icon>
                              </template>
                              下载
                            </v-btn>
                          </template>
                          <v-card>
                            <v-list>
                              <v-list-item @click="videoMultipleDownload" v-tooltip="'批量下载已选择视频'">
                                <template v-slot:prepend>
                                  <v-icon icon="mdi-folder-play-outline"></v-icon>
                                </template>
                                <v-list-item-title>批量下载视频</v-list-item-title>
                              </v-list-item>
                              <v-list-item @click="audioMultipleDownload" v-tooltip="'批量下载已选择音频'">
                                <template v-slot:prepend>
                                  <v-icon icon="mdi-folder-music-outline"></v-icon>
                                </template>
                                <v-list-item-title>批量下载音频</v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </v-card>
                        </v-menu>

                      </v-sheet>
                    </v-col>
                  </v-slide-x-reverse-transition> -->
                  <v-slide-x-reverse-transition>
                    <v-col cols="auto" v-show="videoIsSelected === true">
                      <v-sheet class="pa-2">
                        <v-menu scroll-strategy="close">
                          <template v-slot:activator="{ props }">
                            <v-btn :disabled="videoSelectedLength === 0" v-bind="props" variant="text"
                              v-tooltip:bottom="'批量下载视频画质默认最高'">
                              <template v-slot:prepend>
                                <v-icon>mdi-link-variant</v-icon>
                              </template>
                              复制链接（建议使用迅雷等第三方P2P下载速度更快）
                            </v-btn>
                          </template>
                          <v-card>
                            <v-list>
                              <v-list-item @click="videoMultipleCopy" v-tooltip="'批量下载已选择视频'">
                                <template v-slot:prepend>
                                  <v-icon icon="mdi-folder-play-outline"></v-icon>
                                </template>
                                <v-list-item-title>复制所选视频</v-list-item-title>
                              </v-list-item>
                              <v-list-item @click="audioMultipleCopy" v-tooltip="'批量下载已选择音频'">
                                <template v-slot:prepend>
                                  <v-icon icon="mdi-folder-music-outline"></v-icon>
                                </template>
                                <v-list-item-title>复制所选音频</v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </v-card>
                        </v-menu>

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
                  <Waterfall :list="douYinList" :background-color="options.backgroundColor" :gutter="options.gutter"
                    :cross-origin="options.crossOrigin" :animation-effect="options.animationEffect"
                    :has-around-gutter="options.hasAroundGutter" :breakpoints="options.breakpoints"
                    :load-props="options.loadProps" :lazyload="options.lazyload" :delay="options.delay"
                    :animation-delay="options.animationDelay" :animation-duration="options.animationDuration">
                    <template #default="{ item, url, index }">
                      <v-sheet elevation="2" rounded shaped
                        class="overflow-hidden position-relative">
                        <div class="overflow-hidden">
                          <LazyImg class="cursor-pointer zoomed" :url="item.cover" @click="playerVideo(item.video)" />
                        </div>
                        <v-slide-x-transition>
                          <v-checkbox v-if="videoIsSelected" class="position-absolute left-0 top-0"
                            @click.stop.native="() => { }" v-model="videoCheckbox" color="light_custom_blue_2"
                            base-color="white" :value="item.aweme_id" hide-details density="comfortable"></v-checkbox>
                        </v-slide-x-transition>

                        <div class="px-4 pt-2 pb-2">
                          <h2 class="text-subtitle-1 zoomed-text">
                            {{ item.desc }}
                          </h2>
                        </div>

                        <v-divider></v-divider>

                        <v-row class="py-2 px-2">
                          <v-col cols="4">
                            <v-btn @click="playAudio(item.music)" :disabled="!item.music" text="播放音频"
                              variant="text"></v-btn>
                          </v-col>
                          <v-col cols="4">
                            <v-btn @click="copyUrl(item.music)" text="下载音频" variant="text"></v-btn>
                          </v-col>
                          <v-col cols="4">
                            <v-btn @click="copyUrl(item.video)" text="下载视频" variant="text"></v-btn>
                          </v-col>
                        </v-row>
                        <!-- </div> -->
                      </v-sheet>
                    </template>
                  </Waterfall>

                  <!-- <v-row no-gutters v-if="has_morec == 1" justify="center" class="py-6">
                    <v-col cols="auto">
                      
                    </v-col>
                  </v-row> -->
                  
                  <div v-if="has_morec == 1" class="d-flex justify-center w-100">
                    <v-img :src="loading_list" width="32" height="32" aspect-ratio="1/1" draggable="false"></v-img>
                  </div>
                </v-container>

              </v-card>
            </template>
          </v-dialog>


        </div>

        <div v-else class="d-flex align-center">
          <v-icon color="info" icon="mdi-progress-question" size="32"></v-icon>
          <p class="text-button  ml-1">暂无主页作品</p>
        </div>

      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="auto">
        <v-btn variant="flat" color="light_custom_blue_2" prepend-icon="mdi-selection-search" v-tooltip="'获取文案相匹配的视频素材'"
          :loading="isLoading" @click="handelSumbit">开始获取</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import 'animate.css'
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/dist/style.css'
import useVideoPlayerStore from "@/store/modules/videoPlayer";
import { getDouyinWork } from '@/api/sheet/DouyinWorksExtraction'

import loading from '@/assets/images/loading.png'
import error from '@/assets/images/error.png'
import loading_list from '@/assets/images/loading_list.gif'

const videoPlayerStore = useVideoPlayerStore();

const { proxy } = getCurrentInstance();
const { text, isSupported, copy } = proxy.useClipboard();

const audio = new Audio();

const isLoading = ref(false);

const has_morec = ref(0); // 1 有下一页 允许翻页  0 没有下一页
const params = reactive({
  page: 1,
  sec_user_id: ''
})
const { page, sec_user_id } = toRefs(params);

const douYinList = ref([]);

const douyinWorksExtractionRules = ref({
  sec_user_id: [v => !!v || "输入抖音个人主页视频作品链接,例：https 开头地址"]
});

const options = reactive({
  // 唯一key值
  rowKey: 'aweme_id',
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
  animationDuration: 600,
  // 动画延迟
  animationDelay: 350,
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
      // 设置了最小宽高比
      const minRatio = 3 / 4
      const maxRatio = 4 / 3
      return Math.random() > 0.8 ? minRatio : maxRatio
    },
  },
  // 是否懒加载
  lazyload: true,
  crossOrigin: true,
  delay: 400
  // align: 'center',
})

const videoIsSelected = ref(false);
const videoSelectedLength = computed(() => videoCheckbox.value.length)
const videoCheckbox = ref([])

function handelSumbit() {
  douYinList.value = [];
  page.value = 1;
  getDouyinWorks();
}


/* 提取作品 */
async function getDouyinWorks() {
  try {
    isLoading.value = true;
    const douYinWorkRes = await getDouyinWork(params);
    if ((douYinWorkRes.data.length != 0) && (douYinWorkRes.code === 200)) {
      const videoInfo = douYinWorkRes.data[0].videoinfo
      // const mergedArray = [...douYinList.value, ...douYinWorkRes.data[0].videoinfo];
      douYinList.value.push(...videoInfo)

      // 是否允许翻页
      has_morec.value = douYinWorkRes.data[0].has_morec
    }
    isLoading.value = false;
  } catch {

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
  const scrollHeight = e.target.scrollHeight
  const scrollTop = e.target.scrollTop
  const clientHeight = e.target.clientHeight
  console.log(Math.floor(scrollTop + clientHeight) + 1 >= scrollHeight)
  if (Math.floor(scrollTop + clientHeight) + 1 >= scrollHeight && (has_morec.value == 1) && !isLoading.value) {
    page.value += 1;
    getDouyinWorks()
    console.log('滚动到底部')
  }
}, 50);



function isSelectChange() {
  videoIsSelected.value = !videoIsSelected.value
  videoCheckbox.value = []
}

function handleAllSelectVideo() {
  let imgDigitalCheckboxTemp = [];

  douYinList.value.forEach(item => {
    imgDigitalCheckboxTemp.push(item.aweme_id)
  })

  videoCheckbox.value = imgDigitalCheckboxTemp
}


function handleNotAllSelectVideo() {
  videoCheckbox.value = []
}

async function videoMultipleDownload() {
  for (let i = 0; i < videoCheckbox.value.length; i++) {
    for (let k = 0; k < douYinList.value.length; k++) {
      if (douYinList.value[k].aweme_id == videoCheckbox.value[i]) {
        douYinList.value[k].video ? proxy.download(douYinList.value[k].video, `${douYinList.value[k].desc}-${new Date().getTime()}.mp4`) : null;
      }
    }
  }
}

async function audioMultipleDownload() {
  for (let i = 0; i < videoCheckbox.value.length; i++) {
    for (let k = 0; k < douYinList.value.length; k++) {
      if (douYinList.value[k].aweme_id == videoCheckbox.value[i]) {
        douYinList.value[k].music ? proxy.download(douYinList.value[k].music, `${douYinList.value[k].desc}-${new Date().getTime()}.mp3`) : null;
      }
    }
  }
}

/* 预览作品 */
function playerVideo(videoUrl) {
  videoPlayerStore.openVideoWindow({ videoUrl });
}

/* 播放音频 */
function playAudio(url) {
  if (url) {
    audio.src = url;
    audio.play();
  }
}


function videoMultipleCopy() {
  let newUrl = ``
  for (let i = 0; i < videoCheckbox.value.length; i++) {
    for (let k = 0; k < douYinList.value.length; k++) {
      if (douYinList.value[k].aweme_id == videoCheckbox.value[i]) {
        newUrl += `${douYinList.value[k].video}.mp4` + '\n'
      }
    }
  }
  // http 或 https 判断复制是否可用
  if (navigator.clipboard) {
    // https
    copy(newUrl);
  } else {
    // http **已弃用API临时解决方式
    const input = document.createElement('input');
    input.setAttribute('value', newUrl);
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
  }
  proxy.$modal.msgSuccess('已复制到剪贴板');
}

function audioMultipleCopy() {
  let newUrl = ``
  for (let i = 0; i < videoCheckbox.value.length; i++) {
    for (let k = 0; k < douYinList.value.length; k++) {
      if (douYinList.value[k].aweme_id == videoCheckbox.value[i]) {
        newUrl += `${douYinList.value[k].music}` + '\n'
      }
    }
  }
  // http 或 https 判断复制是否可用
  if (navigator.clipboard) {
    // https
    copy(newUrl);
  } else {
    // http **已弃用API临时解决方式
    const input = document.createElement('input');
    input.setAttribute('value', newUrl);
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
  }
  proxy.$modal.msgSuccess('已复制到剪贴板');
}

/* 复制链接 */
function copyUrl(value) {
  // http 或 https 判断复制是否可用
  if (navigator.clipboard) {
    // https
    copy(value);
  } else {
    // http **已弃用API临时解决方式
    const input = document.createElement('input');
    input.setAttribute('value', value);
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
  }

  proxy.$modal.msgSuccess('视频链接已复制到剪贴板');
}



</script>
