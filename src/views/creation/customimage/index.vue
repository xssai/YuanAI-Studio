<template>
  <v-container v-if="!isLoading && !imgListLength" fluid>
    <v-empty-state height="600"
        image="https://cdn.vuetifyjs.com/docs/images/components/v-empty-state/teamwork.png">
        <template v-slot:title>
            <div class="text-subtitle-2 mt-8">
                暂无图片内容
            </div>
        </template>
        <!-- <template v-slot:text>
            <div class="text-caption">
                当前没有任何组件，前往添加属于您的AI工作流
            </div>
        </template> -->
        <!-- <template v-slot:actions>
            <v-btn class="text-none" to="/aivideo" color="light-blue-darken-4" elevation="1" variant="flat" rounded="lg" text="前往添加组件"></v-btn>
        </template> -->
    </v-empty-state>
</v-container>
  <v-container v-else fluid class="py-3">
    <v-row align="center" justify="end" dense>
      <v-slide-x-transition>
        <v-col cols="auto" v-show="videoIsSelected === true">
          <v-btn @click="handleAllSelectVideo" variant="text">
            <template v-slot:prepend>
              <v-icon>mdi-check-all</v-icon>
            </template>
            全选
          </v-btn>
        </v-col>
      </v-slide-x-transition>
      <v-slide-x-transition>
        <v-col v-show="videoIsSelected === true">
          <v-btn @click="handleNotAllSelectImg" variant="text">
            <template v-slot:prepend>
              <v-icon>mdi-cancel</v-icon>
            </template>
            取消全选
          </v-btn>
        </v-col>
      </v-slide-x-transition>
      <v-slide-x-reverse-transition>
        <v-col cols="auto" v-show="videoIsSelected === true">
          <p class="text-subtitle-2 pr-2">已选择 {{ videoSelectedLength }} 项内容</p>
        </v-col>
      </v-slide-x-reverse-transition>
      <v-slide-x-reverse-transition>
        <v-col cols="auto" v-show="videoIsSelected === true">
          <v-btn :disabled="videoSelectedLength === 0" @click="videoMultipleDelete" variant="text">
            <template v-slot:prepend>
              <v-icon>mdi-delete-outline</v-icon>
            </template>
            删除
          </v-btn>
        </v-col>
      </v-slide-x-reverse-transition>
      <v-slide-x-reverse-transition>
        <v-col cols="auto" v-show="videoIsSelected === true">
          <v-btn :disabled="videoSelectedLength === 0" @click="videoMultipleDownload" variant="text">
            <template v-slot:prepend>
              <v-icon>mdi-folder-download-outline</v-icon>
            </template>
            下载
          </v-btn>
        </v-col>
      </v-slide-x-reverse-transition>
      <v-slide-x-reverse-transition>
        <v-col cols="auto" class="mx-2" v-show="videoIsSelected === true">
          <v-divider vertical length="20px"></v-divider>
        </v-col>
      </v-slide-x-reverse-transition>
      <v-col cols="auto">
        <v-btn @click="isSelectChange" variant="text">
          <template v-slot:prepend>
            <v-icon v-if="videoIsSelected === false">mdi-checkbox-multiple-marked-outline</v-icon>
            <v-icon v-if="videoIsSelected === true">mdi-close-circle-multiple-outline</v-icon>
          </template>
          {{ videoIsSelected ? '取消选择' : '批量操作' }}
        </v-btn>
      </v-col>
    </v-row>

    <v-container fluid v-if="photoRepairList.length">
      <v-row align="center" dense>
        <v-col cols="auto">
          <v-img width="26" draggable="false" aspect-ratio="1/1" cover
            src="https://ai-workbench.eos-dongguan-7.cmecloud.cn/icon_component/photo_repair.png"></v-img>
        </v-col>
        <v-col>
          <span>老照片修复</span>
        </v-col>
      </v-row>

      <v-row>
        <template v-for="(item, index) in photoRepairList" :key="item.id">
          <v-col cols="6" md="3">
            <div
              :class="{ 'rounded-lg': true, 'overflow-hidden': true, 'position-relative': true, 'elevation-2': true }"
              style="height: 195px;">
              <div class="backgroud_Img_full" :style="{ 'background-image': `url(${item.imgurl})` }"></div>
              <v-img rounded="lg" draggable="false" :src="item.imgurl" height="100%" class="cursor-pointer zoomed"
                @click.stop="playerImage(photoRepairList, 'imgurl', index)">
                <template v-slot:error>
                  <v-row align="center" class="fill-height ma-0" justify="center">
                    <v-img width="48" height="48" :src="error"></v-img>
                  </v-row>
                </template>
              </v-img>

              <v-slide-y-transition>
                <v-checkbox v-if="videoIsSelected && item.status === 2" class="position-absolute left-0 top-0"
                  @click.stop.native="() => { }" v-model="photoRepairCheckbox" color="light_custom_blue_2"
                  base-color="white" text-white :value="item.id" hide-details density="comfortable"></v-checkbox>
              </v-slide-y-transition>

              <div class="px-3 py-2 position-absolute bottom-0 left-0">
                <p class="text-subtitle-2 text-white">照片修复{{ index + 1 }}</p>
                <p class="text-caption text-white">{{ item.join_time ? formatDate(item.join_time) : '正在计算作品生成时间'
                  }}
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
                        <v-list-item :disabled="item.gen_url === null" @click.stop="copyUrl(item.gen_url)">
                          <template v-slot:prepend>
                            <v-icon icon="mdi-image-multiple"></v-icon>
                          </template>
                          <v-list-item-title>复制链接</v-list-item-title>
                        </v-list-item>

                        <v-list-item :disabled="item.gen_url === null" @click.stop="downloadsImg(item.gen_url)">
                          <template v-slot:prepend>
                            <v-icon icon="mdi-cloud-arrow-down-outline"></v-icon>
                          </template>
                          <v-list-item-title>下载作品</v-list-item-title>
                        </v-list-item>
                        <v-list-item  @click.stop="handleDelPhotoRepair(item.id)">
                          <template v-slot:prepend>
                            <v-icon icon="mdi-delete-outline"></v-icon>
                          </template>
                          <v-list-item-title>删除作品</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-col>
                </v-row>
              </div>

              <div v-else style="width:100%; background-color: rgba(0, 0, 0, 0.3);"
                class="d-flex flex-column justify-center align-center position-absolute left-0 top-0 fill-height">
                <v-progress-circular :model-value="rate(item.status)" :rotate="360" :size="80" :width="4" color="white">
                  <template v-slot:default> {{ rate(item.status) }} % </template>
                </v-progress-circular>
                <div class="mt-2 text-white text-subtitle-2">
                  <span>{{ translate(item.status) }}</span>
                </div>
              </div>
            </div>
          </v-col>
        </template>

      </v-row>

    </v-container>

    <v-container fluid v-if="imgReplaceFaceList.length">
      <v-row align="center" dense>
        <v-col cols="auto">
          <v-img width="26" draggable="false" aspect-ratio="1/1" cover
            src="https://ai-workbench.eos-dongguan-7.cmecloud.cn/icon_component/photo_replaceFace.png"></v-img>
        </v-col>
        <v-col>
          <span>图片换脸</span>
        </v-col>
      </v-row>
      <v-row>
        <template v-for="(item, index) in imgReplaceFaceList" :key="item.id">
          <v-col cols="6" md="3">
            <div
              :class="{ 'rounded-lg': true, 'overflow-hidden': true, 'position-relative': true, 'elevation-2': true }"
              style="height: 195px;">
              <div class="backgroud_Img_full" :style="{ 'background-image': `url(${item.cover})` }"></div>
              <v-img rounded="lg" draggable="false" :src="item.cover" height="100%" class="cursor-pointer zoomed"
                @click.stop="playerImage(imgReplaceFaceList, 'cover', index)">
                <template v-slot:error>
                  <v-row align="center" class="fill-height ma-0" justify="center">
                    <v-img width="48" height="48" :src="error"></v-img>
                  </v-row>
                </template>
              </v-img>

              <v-slide-y-transition>
                <v-checkbox v-if="videoIsSelected && item.status === 2" class="position-absolute left-0 top-0"
                  @click.stop.native="() => { }" v-model="imgReplaceFaceCheckbox" color="light_custom_blue_2"
                  base-color="white" text-white :value="item.id" hide-details density="comfortable"></v-checkbox>
              </v-slide-y-transition>

              <div class="px-3 py-2 position-absolute bottom-0 left-0">
                <p class="text-subtitle-2 text-white">图片换脸{{ index + 1 }}</p>
                <p class="text-caption text-white">{{ item.join_time ? formatDate(item.join_time) : '正在计算作品生成时间'
                  }}
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
                        <v-list-item :disabled="item.gen_url === null" @click.stop="copyUrl(item.gen_url)">
                          <template v-slot:prepend>
                            <v-icon icon="mdi-image-multiple"></v-icon>
                          </template>
                          <v-list-item-title>复制链接</v-list-item-title>
                        </v-list-item>

                        <v-list-item :disabled="item.gen_url === null" @click.stop="downloadsImg(item.gen_url)">
                          <template v-slot:prepend>
                            <v-icon icon="mdi-cloud-arrow-down-outline"></v-icon>
                          </template>
                          <v-list-item-title>下载作品</v-list-item-title>
                        </v-list-item>
                        <v-list-item  @click.stop="handleDelImgReplaceFace(item.id)">
                          <template v-slot:prepend>
                            <v-icon icon="mdi-delete-outline"></v-icon>
                          </template>
                          <v-list-item-title>删除作品</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-col>
                </v-row>
              </div>

              <div v-else style="width:100%; background-color: rgba(0, 0, 0, 0.3);"
                class="d-flex flex-column justify-center align-center position-absolute left-0 top-0 fill-height">
                <v-progress-circular :model-value="rate(item.status)" :rotate="360" :size="80" :width="4" color="white">
                  <template v-slot:default> {{ rate(item.status) }} % </template>
                </v-progress-circular>
                <div class="mt-2 text-white text-subtitle-2">
                  <span>{{ translate(item.status) }}</span>
                </div>
              </div>

            </div>

          </v-col>
        </template>

      </v-row>
    </v-container>

    <v-container fluid v-if="textToImgList.length">
      <v-row align="center" dense>
        <v-col cols="auto">
          <v-img width="26" draggable="false" aspect-ratio="1/1" cover
            src="https://ai-workbench.eos-dongguan-7.cmecloud.cn/icon_component/photo_text_to_img.png"></v-img>
        </v-col>
        <v-col>
          <span>文生图</span>
        </v-col>
      </v-row>
      <v-row>
        <template v-for="(item, index) in textToImgList" :key="item.id">
          <v-col cols="6" md="3">
            <div
              :class="{ 'rounded-lg': true, 'overflow-hidden': true, 'position-relative': true, 'elevation-2': true }"
              style="height: 195px;">
              <div class="backgroud_Img_full" :style="{ 'background-image': `url(${item.gen_url})` }"></div>
              <v-img rounded="lg" draggable="false" :src="item.gen_url" height="100%" class="cursor-pointer zoomed"
                @click.stop="playerImage(textToImgList, 'gen_url', index)">
                <template v-slot:error>
                  <v-row align="center" class="fill-height ma-0" justify="center">
                    <v-img width="48" height="48" :src="error"></v-img>
                  </v-row>
                </template>
              </v-img>

              <v-slide-y-transition>
                <v-checkbox v-if="videoIsSelected && item.status === 2" class="position-absolute left-0 top-0"
                  @click.stop.native="() => { }" v-model="textToImgCheckbox" color="light_custom_blue_2"
                  base-color="white" text-white :value="item.id" hide-details density="comfortable"></v-checkbox>
              </v-slide-y-transition>

              <div class="px-3 py-2 position-absolute bottom-0 left-0">
                <p class="text-subtitle-2 text-white">作品{{ index + 1 }}</p>
                <p v-if="item.prompt" class="text-caption text-white">关键词：{{ item.prompt }}</p>
                <p v-if="item.negative_prompt" class="text-caption text-white">反向提示词：{{ item.negative_prompt }}</p>
                <p class="text-caption text-white">{{ item.join_time ? formatDate(item.join_time) : '正在计算作品生成时间' }}</p>
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
                        <v-list-item :disabled="item.gen_url === null" @click.stop="copyUrl(item.gen_url)">
                          <template v-slot:prepend>
                            <v-icon icon="mdi-image-multiple"></v-icon>
                          </template>
                          <v-list-item-title>复制链接</v-list-item-title>
                        </v-list-item>

                        <v-list-item :disabled="item.gen_url === null" @click.stop="downloadsImg(item.gen_url)">
                          <template v-slot:prepend>
                            <v-icon icon="mdi-cloud-arrow-down-outline"></v-icon>
                          </template>
                          <v-list-item-title>下载作品</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click.stop="handleDelImgToText(item.id)">
                          <template v-slot:prepend>
                            <v-icon icon="mdi-delete-outline"></v-icon>
                          </template>
                          <v-list-item-title>删除作品</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-col>
                </v-row>
              </div>

              <div v-else style="width:100%; background-color: rgba(0, 0, 0, 0.3);"
                class="d-flex flex-column justify-center align-center position-absolute left-0 top-0 fill-height">
                <v-progress-circular :model-value="rate(item.status)" :rotate="360" :size="80" :width="4" color="white">
                  <template v-slot:default> {{ rate(item.status) }} % </template>
                </v-progress-circular>
                <div class="mt-2 text-white text-subtitle-2">
                  <span>{{ translate(item.status) }}</span>
                </div>
              </div>

            </div>
          </v-col>
        </template>
      </v-row>
    </v-container>


    <v-container fluid v-if="portraitList.length">
      <v-row align="center" dense>
        <v-col cols="auto">
          <v-img width="26" draggable="false" aspect-ratio="1/1" cover
            src="https://ai-workbench.eos-dongguan-7.cmecloud.cn/icon_component/photo_portrait.png"></v-img>
        </v-col>
        <v-col>
          <span>虚拟IP形象</span>
        </v-col>
      </v-row>
      <v-row>
        <template v-for="(item, index) in portraitList" :key="item.id">
          <v-col cols="6" md="3">
            <div
              :class="{ 'rounded-lg': true, 'overflow-hidden': true, 'position-relative': true, 'elevation-2': true }"
              style="height: 195px;">
              <div class="backgroud_Img_full" :style="{ 'background-image': `url(${item.gen_url})` }"></div>
              <v-img rounded="lg" draggable="false" :src="item.gen_url" height="100%" class="cursor-pointer zoomed"
                @click.stop="playerImage(portraitList, 'gen_url', index)">
                <template v-slot:error>
                  <v-row align="center" class="fill-height ma-0" justify="center">
                    <v-img width="48" height="48" :src="error"></v-img>
                  </v-row>
                </template>
              </v-img>

              <v-slide-y-transition>
                <v-checkbox v-if="videoIsSelected && item.status === 2" class="position-absolute left-0 top-0"
                  @click.stop.native="() => { }" v-model="portraitCheckbox" color="light_custom_blue_2"
                  base-color="white" text-white :value="item.id" hide-details density="comfortable"></v-checkbox>
              </v-slide-y-transition>

              <div class="px-3 py-2 position-absolute bottom-0 left-0">
                <p class="text-subtitle-2 text-white">作品{{ index + 1 }}</p>

                <v-tooltip location="bottom">
                  <template v-slot:activator="{ props }">
                    <p v-bind="props" class="text-caption text-white">图片参数...</p>
                  </template>
                  <div v-if="item.prompt" class="text-caption text-white">
                    <div>
                      <span>镜头类型：{{ cameraModeMatch(JSON.parse(item.prompt).camera) }}</span>
                    </div>
                    <div>
                      <span>性别：{{ genderModeMatch(JSON.parse(item.prompt).gender) }}</span>
                    </div>
                    <div>
                      <span>年龄：{{ JSON.parse(item.prompt).age }}</span>
                    </div>
                    <div>
                      <span>脸型：{{ faceShapeModeMatch(JSON.parse(item.prompt).faceShape) }}</span>
                    </div>
                    <div>
                      <span>发型：{{ hairstyleModeMatch(JSON.parse(item.prompt).hairstyle) }}</span>
                    </div>
                    <div>
                      <span>头发颜色：{{ hairstyleColorModeMatch(JSON.parse(item.prompt).hairstyleColor) }}</span>
                    </div>
                    <div>
                      <span>服装：{{ clothingModeMatch(JSON.parse(item.prompt).clothing) }}</span>
                    </div>
                  </div>
                </v-tooltip>

                <p class="text-caption text-white">{{ item.join_time ? formatDate(item.join_time) : '正在计算作品生成时间'
                  }}
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
                        <v-list-item :disabled="item.gen_url == null" @click.stop="copyUrl(item.gen_url)">
                          <template v-slot:prepend>
                            <v-icon icon="mdi-image-multiple"></v-icon>
                          </template>
                          <v-list-item-title>复制链接</v-list-item-title>
                        </v-list-item>

                        <v-list-item :disabled="item.gen_url == null" @click.stop="downloadsImg(item.gen_url)">
                          <template v-slot:prepend>
                            <v-icon icon="mdi-cloud-arrow-down-outline"></v-icon>
                          </template>
                          <v-list-item-title>下载作品</v-list-item-title>
                        </v-list-item>
                        <v-list-item :disabled="item.gen_url == null" @click.stop="handleDelPortrait(item.id)">
                          <template v-slot:prepend>
                            <v-icon icon="mdi-delete-outline"></v-icon>
                          </template>
                          <v-list-item-title>删除作品</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-col>
                </v-row>
              </div>

              <div v-else style="width:100%; background-color: rgba(0, 0, 0, 0.3);"
                class="d-flex flex-column justify-center align-center position-absolute left-0 top-0 fill-height">
                <v-progress-circular :model-value="rate(item.status)" :rotate="360" :size="80" :width="4" color="white">
                  <template v-slot:default> {{ rate(item.status) }} % </template>
                </v-progress-circular>
                <div class="mt-2 text-white text-subtitle-2">
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

<script setup name="Customimage">
import { api as viewerApi } from 'v-viewer'
import portraitParams from '@/assets/style_config/portrait.json'
import { rate, translate } from '@/utils/match'
import { getPhotoRepair, delPhotoRepair } from '@/api/sheet/PhotoRepair'
import { getImgReplaceFaceTask, delImgReplaceFace } from '@/api/sheet/ImgReplaceFace'
import { getImgTask, delImgTask } from '@/api/sheet/TextToImg'

import error from '@/assets/images/error.png'

let timer = null;

const { proxy } = getCurrentInstance();

const { text, isSupported, copy } = proxy.useClipboard();

const isLoading = ref(false)

// 镜头类型
const cameraMode = ref(portraitParams.cameraMode)
// 性别
const genderMode = ref(portraitParams.genderMode)
// 脸型
const faceShapeMode = ref(portraitParams.faceShapeMode)
// 发型
const hairstyleMode = ref(portraitParams.hairstyleMode)
// 头发颜色
const hairstyleColorMode = ref(portraitParams.hairstyleColorMode)
// 服装
const clothingMode = ref(portraitParams.clothingMode)

const imgData = reactive({
  photoRepairList: [],
  imgReplaceFaceList: [],
  textToImgList: [],
  portraitList: []
})

const videoIsSelected = ref(false);
const videoSelectedLength = computed(() => photoRepairCheckbox.value.length + imgReplaceFaceCheckbox.value.length + textToImgCheckbox.value.length + portraitCheckbox.value.length)

const videoCheckbox = reactive({
  photoRepairCheckbox: [],
  imgReplaceFaceCheckbox: [],
  textToImgCheckbox: [],
  portraitCheckbox: []
})

const { photoRepairList, imgReplaceFaceList, textToImgList, portraitList } = toRefs(imgData);
const { photoRepairCheckbox, imgReplaceFaceCheckbox, textToImgCheckbox, portraitCheckbox } = toRefs(videoCheckbox);

const imgListLength = computed(() => photoRepairList.value.length + imgReplaceFaceList.value.length + textToImgList.value.length + portraitList.value.length)

/* 获取作品 */
async function getImgList() {
  isLoading.value = true

  // 老照片修复
  const photoRepairRes = await getPhotoRepair({ page: null, page_size: 50, gen_type: 'gfp' });
  photoRepairList.value = photoRepairRes.data;

  // 图片换脸
  const fetchImgReplaceFaceTask = await getImgReplaceFaceTask({ gen_type: 'image' });
  imgReplaceFaceList.value = fetchImgReplaceFaceTask.data;

  // 文生图
  const textToImgRes = await getImgTask({ gen_type: 'txt2img' })
  textToImgList.value = textToImgRes.data;

  // 虚拟IP
  const portraitRes = await getImgTask({ gen_type: 'portrait' });
  portraitList.value = portraitRes.data;

  isLoading.value = false
  getStatePoll()
}

/* 根据状态轮询请求作品 */
function getStatePoll() {
  let allStatus = [] // 0正在排队 // 1 正在生成  2 生成完成  4失败  5重试
  let newArr = [...photoRepairList.value, ...imgReplaceFaceList.value, ...textToImgList.value, ...portraitList.value]
  newArr.forEach(element => {
    allStatus.push(element.status)
  });

  // 0 和 1 状态是否都不存在
  if (allStatus.indexOf(0) === -1 && allStatus.indexOf(1) === -1) {
    clearTimeout(timer);
    //一定要return，不然下面又创建了新的定时器
    return;
  }

  // 老照片修复
  getPhotoRepair({ page: null, page_size: 50, gen_type: 'gfp' }).then((photoRepairRes) => {
    // status：0代表排队中，1是正在生成，2是生成完成，4是失败
    photoRepairList.value = photoRepairRes.data;
  });

  // 图片换脸
  getImgReplaceFaceTask({ gen_type: 'image' }).then((imgReplaceFaceRes) => {
    // status：0代表排队中，1是正在生成，2是生成完成，4是失败
    imgReplaceFaceList.value = imgReplaceFaceRes.data;
  });

  // 文生图
  getImgTask({ gen_type: 'txt2img' }).then((textToImgRes) => {
    // status：0代表排队中，1是正在生成，2是生成完成，4是失败
    textToImgList.value = textToImgRes.data;
  });

  // 虚拟IP
  getImgTask({ gen_type: 'portrait' }).then((portraitRes) => {
    // status：0代表排队中，1是正在生成，2是生成完成，4是失败
    portraitList.value = portraitRes.data;
  });

  timer = setTimeout(getStatePoll, 2600);
  console.log(allStatus,"---有生成任务")
}

/* 视频批量删除 */
async function videoMultipleDelete() {
  try {
    // 老照片修复
    if (photoRepairCheckbox.value.length) {
      await delPhotoRepair({ ids: photoRepairCheckbox.value });
    }
    // 图片换脸
    if (imgReplaceFaceCheckbox.value.length) {
      await delImgReplaceFace({ ids: imgReplaceFaceCheckbox.value });
    }
    // 文生图
    if (textToImgCheckbox.value.length) {
      await delImgTask({ ids: textToImgCheckbox.value });
    }

    // 虚拟IP
    if (portraitCheckbox.value.length) {
      await delImgTask({ ids: portraitCheckbox.value });
    }

    proxy.$modal.msgSuccess("作品删除成功");

    /* 重新 reload */
    getImgList()

  } catch {
    proxy.$modal.msgWarning("删除作品出现异常");
  }
}

function isSelectChange() {
  videoIsSelected.value = !videoIsSelected.value
  imgReset();
}

/* 圖片批量下載 */
async function videoMultipleDownload() {
  // 老照片修复
  for (let i = 0; i < photoRepairCheckbox.value.length; i++) {
    for (let k = 0; k < photoRepairList.value.length; k++) {
      if (photoRepairList.value[k].id === photoRepairCheckbox.value[i]) {
        photoRepairList.value[k].imgurl ? proxy.download(photoRepairList.value[k].imgurl, `img-${photoRepairList.value[k].id}.png`) : null;
      }
    }
  }
  // 图片换脸 
  for (let i = 0; i < imgReplaceFaceCheckbox.value.length; i++) {
    for (let k = 0; k < imgReplaceFaceList.value.length; k++) {
      if (imgReplaceFaceList.value[k].id === imgReplaceFaceCheckbox.value[i]) {
        imgReplaceFaceList.value[k].gen_url ? proxy.download(imgReplaceFaceList.value[k].gen_url, `img-${imgReplaceFaceList.value[k].id}.png`) : null;
      }
    }
  }
  // 文生图 
  for (let i = 0; i < textToImgCheckbox.value.length; i++) {
    for (let k = 0; k < textToImgList.value.length; k++) {
      if (textToImgList.value[k].id === textToImgCheckbox.value[i]) {
        textToImgList.value[k].gen_url ? proxy.download(textToImgList.value[k].gen_url, `img-${textToImgList.value[k].id}.png`) : null;
      }
    }
  }
  // 虚拟IP 
  for (let i = 0; i < portraitCheckbox.value.length; i++) {
    for (let k = 0; k < portraitList.value.length; k++) {
      if (portraitList.value[k].id === portraitCheckbox.value[i]) {
        portraitList.value[k].gen_url ? proxy.download(portraitList.value[k].gen_url, `img-${portraitList.value[k].id}.png`) : null;
      }
    }
  }
}

/* 单独删除老照片修复项 */
async function handleDelPhotoRepair(id) {
  const res = await delPhotoRepair({ ids: [id] });
  if (res.code === 200) {
    getImgList()
    proxy.$modal.msgSuccess(res.message);
  }
}

/* 单独删除图片换脸项 */
async function handleDelImgReplaceFace(id) {
  const delVideoCloneRes = await delImgReplaceFace({ ids: [id] });
  if (delVideoCloneRes.code === 200) {
    getImgList()
    proxy.$modal.msgSuccess(delVideoCloneRes.message);
  }
}

/* 单独删除文生图项 */
async function handleDelImgToText(id) {
  const delTaskRes = await delImgTask({ ids: [id] });
  if (delTaskRes.code === 200) {
    getImgList()
    proxy.$modal.msgSuccess(delTaskRes.message);
  }
}

/* 单独删除虚拟IP项 */
async function handleDelPortrait(id) {
  const delTaskRes = await delImgTask({ ids: [id] });
  if (delTaskRes.code === 200) {
    getImgList()
    proxy.$modal.msgSuccess(delTaskRes.message);
  }
}

/* 重置视频选项状态 */
function imgReset() {
  photoRepairCheckbox.value = []
  imgReplaceFaceCheckbox.value = []
  textToImgCheckbox.value = []
  textToImgCheckbox.value = []
}

/* 复制地址 */
function copyUrl(url) {
  // http 或 https 判断复制是否可用
  if (navigator.clipboard) {
    // https
    copy(url);
  } else {
    // http **已弃用API临时解决方式
    const input = document.createElement('input');
    input.setAttribute('value', url);
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
  }
  proxy.$modal.msgSuccess('链接已复制到剪贴板');
}


/* 下载图片 */
function downloadsImg(imgUrl) {
  proxy.download(imgUrl, `img_${new Date().getTime()}.png`);
}

/* 预览图片 */
function playerImage(imgList, imgKey, initViewIndex) {
  /* 
    @imgList 图片数组
    @imgKey 图片地址key
    @initViewIndex 打开预览图片从数组第几张图片开始
  */
  const $viewer = viewerApi({
    options: {
      toolbar: true,
      url: imgKey,
      loading: true,
      initialViewIndex: initViewIndex,
    },
    images: imgList,

  })
  // console.log($viewer)
}


/* 全选视频 */
function handleAllSelectVideo() {
  let photoRepairCheckboxTemp = [];
  let imgReplaceFaceCheckboxTemp = [];
  let textToImgCheckboxTemp = [];
  let portraitCheckboxTemp = [];
  // 数字人作品
  for (let k = 0; k < photoRepairList.value.length; k++) {
    if (photoRepairList.value[k].status === 2) { // 表示状态已生成完成
      photoRepairCheckboxTemp.push(photoRepairList.value[k].id)
    }
  }
  // 视频换脸 
  for (let k = 0; k < imgReplaceFaceList.value.length; k++) {
    if (imgReplaceFaceList.value[k].status === 2) { // 表示状态已生成完成
      imgReplaceFaceCheckboxTemp.push(imgReplaceFaceList.value[k].id)
    }
  }
  // 照片数字人 
  for (let k = 0; k < textToImgList.value.length; k++) {
    if (textToImgList.value[k].status === 2) { // 表示状态已生成完成
      textToImgCheckboxTemp.push(textToImgList.value[k].id)
    }
  }
  // 虚拟IP 
  for (let k = 0; k < portraitList.value.length; k++) {
    if (portraitList.value[k].status === 2) { // 表示状态已生成完成
      portraitCheckboxTemp.push(portraitList.value[k].id)
    }
  }

  textToImgCheckbox.value = textToImgCheckboxTemp;
  photoRepairCheckbox.value = photoRepairCheckboxTemp;
  imgReplaceFaceCheckbox.value = imgReplaceFaceCheckboxTemp;
  portraitCheckbox.value = portraitCheckboxTemp;
}

/* 取消全选视频 */
function handleNotAllSelectImg() {
  imgReset()
}

function cameraModeMatch(prompt) {
  let name = ""
  cameraMode.value.forEach(element => {
    if (prompt === element.prompt) {
      name = element.name
    }
  });
  return name
}

function genderModeMatch(prompt) {
  let name = ""
  genderMode.value.forEach(element => {
    if (prompt === element.prompt) {
      name = element.name
    }
  });
  return name
}

function faceShapeModeMatch(prompt) {
  let name = ""
  faceShapeMode.value.forEach(element => {
    if (prompt === element.prompt) {
      name = element.name
    }
  });
  return name
}

function hairstyleModeMatch(prompt) {
  let name = ""
  hairstyleMode.value.forEach(element => {
    if (prompt === element.prompt) {
      name = element.name
    }
  });
  return name
}

function hairstyleColorModeMatch(prompt) {
  let name = ""
  hairstyleColorMode.value.forEach(element => {
    if (prompt === element.prompt) {
      name = element.name
    }
  });
  return name
}

function clothingModeMatch(prompt) {
  let name = ""
  clothingMode.value.forEach(element => {
    if (prompt === element.prompt) {
      name = element.name
    }
  });
  return name
}

getImgList()

onBeforeUnmount(() => {
  clearTimeout(timer);
})

</script>
