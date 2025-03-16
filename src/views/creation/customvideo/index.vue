<template>
  <v-container v-if="!isLoading && !videoListLength" fluid>
    <v-empty-state height="600"
        image="https://cdn.vuetifyjs.com/docs/images/components/v-empty-state/teamwork.png">
        <template v-slot:title>
            <div class="text-subtitle-2 mt-8">
                暂无视频内容
            </div>
        </template>
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
          <v-btn @click="handleNotAllSelectVideo" variant="text">
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

    <v-container fluid v-if="imgDigitalList.length">
      <v-row align="center" dense>
        <v-col cols="auto">
          <v-img width="32" draggable="false" aspect-ratio="1/1" cover
            src="https://ai-workbench.eos-dongguan-7.cmecloud.cn/icon_component/video_photo_digital.png"></v-img>
        </v-col>
        <v-col>
          <span class="text-h6">照片数字人</span>
        </v-col>
      </v-row>

      <v-row>
        <template v-for="(item, index) in imgDigitalList" :key="item.id">
          <v-col cols="6" md="3">
            <div
              :class="{ 'rounded-lg': true, 'overflow-hidden': true, 'position-relative': true, 'elevation-2': true }"
              style="height: 190px;">
              <div class="backgroud_Img_full" :style="{ 'background-image': `url(${item.img_url})` }"></div>
              <v-img rounded="lg" draggable="false" :lazy-src="item.img_url" :src="item.img_url" height="100%"
                class="cursor-pointer zoomed" @click.stop="playerVideo(item.gen_url)">
                <template v-slot:error>
                  <v-row align="center" class="fill-height ma-0" justify="center">
                    <v-img width="48" height="48" :src="error"></v-img>
                  </v-row>
                </template>
              </v-img>

              <v-slide-y-transition>
                <v-checkbox v-if="videoIsSelected && item.status === 2" class="position-absolute left-0 top-0"
                  @click.stop.native="() => { }" v-model="imgDigitalCheckbox" color="light_custom_blue_2"
                  base-color="white" text-white :value="item.id" hide-details density="comfortable"></v-checkbox>
              </v-slide-y-transition>

              <div class="px-3 py-2 position-absolute bottom-0 left-0">
                <p class="text-subtitle-2 text-white">照片数字人{{ index + 1 }}</p>
                <p class="text-caption text-white">{{ item.gen_time ? formatDate(item.gen_time) : '正在计算作品生成时间' }}</p>
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
                        <v-list-item :disabled="item.gen_url == null" @click.stop="playerVideo(item.gen_url)">
                          <template v-slot:prepend>
                            <v-icon icon="mdi-video-4k-box"></v-icon>
                          </template>
                          <v-list-item-title>预览作品</v-list-item-title>
                        </v-list-item>

                        <v-list-item :disabled="item.gen_url == null" @click.stop="copyUrl(item.gen_url)">
                          <template v-slot:prepend>
                            <v-icon icon="mdi-image-multiple"></v-icon>
                          </template>
                          <v-list-item-title>复制链接</v-list-item-title>
                        </v-list-item>

                        <v-list-item :disabled="item.gen_url == null" @click.stop="downloadsVideo(item.gen_url)">
                          <template v-slot:prepend>
                            <v-icon icon="mdi-cloud-arrow-down-outline"></v-icon>
                          </template>
                          <v-list-item-title>下载作品</v-list-item-title>
                        </v-list-item>
                        <v-list-item :disabled="item.gen_url == null" @click.stop="handleDelImgDigital(item.id)">
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

              <div v-else-if="item.status === 4" style="width:100%; background-color: rgba(0, 0, 0, 0.4);"
                class="d-flex flex-column justify-center align-center position-absolute left-0 top-0 fill-height">
                <v-progress-circular :model-value="rate(item.status)" :rotate="360" :size="80" :width="4" color="white">
                  <template v-slot:default> {{ rate(item.status) }} % </template>
                </v-progress-circular>
                <div class="mt-4 text-white text-subtitle-2">
                  <span>{{ translate(item.status) }}</span>
                </div>

                <div class="position-absolute right-0 top-0">
                  <v-btn icon variant="text" size="small" @click.stop="handleDelImgDigital(item.id)">
                    <v-icon size="20" color="white">mdi-delete-outline</v-icon>
                  </v-btn>
                </div>
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

    <v-container fluid v-if="videoCloneList.length">
      <v-row align="center" dense>
        <v-col cols="auto">
          <v-img width="32" draggable="false" aspect-ratio="1/1" cover
            src="https://ai-workbench.eos-dongguan-7.cmecloud.cn/icon_component/video_video_figure.png"></v-img>
        </v-col>
        <v-col>
          <span class="text-h6">视频数字人</span>
        </v-col>
      </v-row>
      <v-row>
        <template v-for="item in videoCloneList" :key="item.id">
          <v-col cols="6" md="3">
            <div
              :class="{ 'rounded-lg': true, 'overflow-hidden': true, 'position-relative': true, 'elevation-2': true }"
              style="height: 190px;">
              <div class="backgroud_Img_full" :style="{ 'background-image': `url(${item.cover})` }"></div>
              <v-img rounded="lg" draggable="false" :src="item.cover" height="100%" class="cursor-pointer zoomed"
                @click.stop="playerVideo(item.gen_video)">
                <template v-slot:error>
                  <v-row align="center" class="fill-height ma-0" justify="center">
                    <v-img width="48" height="48" :src="error"></v-img>
                  </v-row>
                </template>
              </v-img>

              <v-slide-y-transition>
                <v-checkbox v-if="videoIsSelected && item.status === 2" class="position-absolute left-0 top-0"
                  @click.stop.native="() => { }" v-model="videoCloneCheckbox" color="light_custom_blue_2"
                  base-color="white" :value="item.id" hide-details density="comfortable"></v-checkbox>
              </v-slide-y-transition>

              <div class="px-3 py-2 position-absolute bottom-0 left-0">
                <p class="text-subtitle-2 text-white">{{ item.taskname }}</p>
                <p class="text-caption text-white">{{ item.gen_time ? formatDate(item.gen_time) : '正在计算作品生成时间'
                  }}</p>
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
                        <v-list-item :disabled="item.gen_video == null" @click.stop="playerVideo(item.gen_video)">
                          <template v-slot:prepend>
                            <v-icon icon="mdi-video-4k-box"></v-icon>
                          </template>
                          <v-list-item-title>预览作品</v-list-item-title>
                        </v-list-item>

                        <v-list-item :disabled="item.gen_video == null" @click.stop="copyUrl(item.gen_video)">
                          <template v-slot:prepend>
                            <v-icon icon="mdi-image-multiple"></v-icon>
                          </template>
                          <v-list-item-title>复制链接</v-list-item-title>
                        </v-list-item>

                        <v-list-item :disabled="item.gen_video == null" @click.stop="downloadsVideo(item.gen_video)">
                          <template v-slot:prepend>
                            <v-icon icon="mdi-cloud-arrow-down-outline"></v-icon>
                          </template>
                          <v-list-item-title>下载作品</v-list-item-title>
                        </v-list-item>

                        <v-list-item :disabled="item.gen_video == null" @click.stop="handleDelVideoClone(item.id)">
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

              <div v-else-if="item.status === 4" style="width:100%; background-color: rgba(0, 0, 0, 0.4);"
                class="d-flex flex-column justify-center align-center position-absolute left-0 top-0 fill-height">
                <v-progress-circular :model-value="rate(item.status)" :rotate="360" :size="80" :width="4" color="white">
                  <template v-slot:default> {{ rate(item.status) }} % </template>
                </v-progress-circular>
                <div class="mt-4 text-white text-subtitle-2">
                  <span>{{ translate(item.status) }}</span>
                </div>

                <div class="position-absolute right-0 top-0">
                  <v-btn icon variant="text" size="small" @click.stop="handleDelVideoClone(item.id)">
                    <v-icon size="20" color="white">mdi-delete-outline</v-icon>
                  </v-btn>
                </div>

                <div class="position-absolute right-0 bottom-0 pb-2 pr-2">
                  <v-btn variant="flat" color="light_custom_blue_2" v-tooltip="'重试一次数字人生成仍然失败，该数字人将不再提供重试功能，请检查数字人形象模板或声音模板是否符合生成要求，并尝试重新创建数字人'" @click.stop="handleResetVideoClone(item.id)" :disabled="Boolean(item.failed_retry === 1)">
                    <template v-slot:prepend>
                      <v-icon>mdi-database-refresh-outline</v-icon>
                    </template>
                    <p>重新生成</p>
                  </v-btn>
                </div>

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

    <v-container fluid v-if="videoReplaceFaceList.length">
      <v-row align="center" dense>
        <v-col cols="auto">
          <v-img width="32" draggable="false" aspect-ratio="1/1" cover
            src="https://ai-workbench.eos-dongguan-7.cmecloud.cn/icon_component/video_video_replace_face.png"></v-img>
        </v-col>
        <v-col>
          <span class="text-h6">视频换脸</span>
        </v-col>
      </v-row>
      <v-row>
        <template v-for="item in videoReplaceFaceList" :key="item.id">
          <v-col cols="6" md="3">
            <div
              :class="{ 'rounded-lg': true, 'overflow-hidden': true, 'position-relative': true, 'elevation-2': true }"
              style="height: 190px;">
              <div class="backgroud_Img_full" :style="{ 'background-image': `url(${item.cover})` }"></div>
              <v-img rounded="lg" draggable="false" :src="item.cover" height="100%" class="cursor-pointer zoomed"
                @click.stop="playerVideo(item.gen_url)">
                <template v-slot:error>
                  <v-row align="center" class="fill-height ma-0" justify="center">
                    <v-img width="48" height="48" :src="error"></v-img>
                  </v-row>
                </template>
              </v-img>

              <v-slide-y-transition>
                <v-checkbox v-if="videoIsSelected && item.status === 2" class="position-absolute left-0 top-0"
                  @click.stop.native="() => {}" v-model="videoReplaceFaceCheckbox" color="light_custom_blue_2" base-color="white"
                  :value="item.id" hide-details density="comfortable"></v-checkbox>
              </v-slide-y-transition>

              <div class="px-3 py-2 position-absolute bottom-0 left-0">
                <p class="text-subtitle-2 text-white">{{ item.modelname }}</p>
                <p class="text-caption text-white">{{ item.gen_time ? formatDate(item.gen_time) : '正在计算作品生成时间'
                  }}</p>
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
                        <v-list-item :disabled="item.gen_url == null" @click.stop="playerVideo(item.gen_url)">
                          <template v-slot:prepend>
                            <v-icon icon="mdi-video-4k-box"></v-icon>
                          </template>
                          <v-list-item-title>预览作品</v-list-item-title>
                        </v-list-item>

                        <v-list-item :disabled="item.gen_url == null" @click.stop="copyUrl(item.gen_url)">
                          <template v-slot:prepend>
                            <v-icon icon="mdi-image-multiple"></v-icon>
                          </template>
                          <v-list-item-title>复制链接</v-list-item-title>
                        </v-list-item>

                        <v-list-item :disabled="item.gen_url == null" @click.stop="downloadsVideo(item.gen_url)">
                          <template v-slot:prepend>
                            <v-icon icon="mdi-cloud-arrow-down-outline"></v-icon>
                          </template>
                          <v-list-item-title>下载作品</v-list-item-title>
                        </v-list-item>

                        <v-list-item :disabled="item.gen_url == null" @click.stop="handleDelVideoReplaceFace(item.id)">
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

              <div v-else-if="item.status === 4" style="width:100%; background-color: rgba(0, 0, 0, 0.4);"
                class="d-flex flex-column justify-center align-center position-absolute left-0 top-0 fill-height">
                <v-progress-circular :model-value="rate(item.status)" :rotate="360" :size="80" :width="4" color="white">
                  <template v-slot:default> {{ rate(item.status) }} % </template>
                </v-progress-circular>
                <div class="mt-4 text-white text-subtitle-2">
                  <span>{{ translate(item.status) }}</span>
                </div>

                <div class="position-absolute right-0 top-0">
                  <v-btn icon variant="text" size="small" @click.stop="handleDelVideoReplaceFace(item.id)">
                    <v-icon size="20" color="white">mdi-delete-outline</v-icon>
                  </v-btn>
                </div>
              </div>

              <div v-else style="width:100%; background-color: rgba(0, 0, 0, 0.4);"
                class="d-flex flex-column justify-center align-center position-absolute left-0 top-0 fill-height">
                <v-progress-circular :model-value="rate(item.status)" :rotate="360" :size="80" :width="4" color="white">
                  <template v-slot:default>{{ rate(item.status) }} % </template>
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
    
    <v-container fluid v-if="videoCutList.length">
      <v-row align="center" dense>
        <v-col cols="auto">
          <v-img width="32" draggable="false" aspect-ratio="1/1" cover
            src="https://ai-workbench.eos-dongguan-7.cmecloud.cn/icon_component/video_video_blend.png"></v-img>
        </v-col>
        <v-col>
          <span class="text-h6">AI混剪</span>
        </v-col>
      </v-row>
      <template v-for="(item, index) in videoCutList" :key="item.id">
        <v-row>
          <v-col align-self="center">
            <div>
              <span class="text-caption">混剪任务{{ index + 1 }}</span>
              <span class="text-caption ml-3">{{ item.join_time ? formatDate(item.join_time) : '正在计算作品生成时间' }}</span>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col v-for="(child, index) in item.details" :key="child.id" cols="6" md="3">
            <div
              :class="{ 'rounded-lg': true, 'overflow-hidden': true, 'position-relative': true, 'elevation-2': true }"
              style="height: 190px;">
              <div class="backgroud_Img_full" style="background-color: black;"></div>
              <div class="h-100 cursor-pointer zoomed d-flex align-center justify-center"
                @click.stop="playerVideo(child.gen_url)">
                <video :src="child.gen_url" height="100%" style="object-fit:cover;"></video>
              </div>

              <v-slide-y-transition>
                <v-checkbox v-if="videoIsSelected && item.status === 2" class="position-absolute left-0 top-0"
                  @click.stop.native="() => { }" style="z-index: 999;" v-model="videoCutCheckbox"
                  color="light_custom_blue_2" base-color="white" :value="child.id" hide-details
                  density="comfortable"></v-checkbox>
              </v-slide-y-transition>

              <div class="px-3 py-2 position-absolute bottom-0 left-0">
                <p class="text-subtitle-2 text-white">混剪视频 {{ index + 1 }}</p>
                <p class="text-caption text-white">{{ item.gen_time ? formatDate(item.gen_time) : '正在计算作品生成时间'
                  }}</p>
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
                        <v-list-item :disabled="child.gen_url == null" @click.stop="playerVideo(child.gen_url)">
                          <template v-slot:prepend>
                            <v-icon icon="mdi-video-4k-box"></v-icon>
                          </template>
                          <v-list-item-title>预览作品</v-list-item-title>
                        </v-list-item>

                        <v-list-item :disabled="child.gen_url == null" @click.stop="copyUrl(child.gen_url)">
                          <template v-slot:prepend>
                            <v-icon icon="mdi-image-multiple"></v-icon>
                          </template>
                          <v-list-item-title>复制链接</v-list-item-title>
                        </v-list-item>

                        <v-list-item :disabled="child.gen_url == null" @click.stop="downloadsVideo(child.gen_url)">
                          <template v-slot:prepend>
                            <v-icon icon="mdi-cloud-arrow-down-outline"></v-icon>
                          </template>
                          <v-list-item-title>下载作品</v-list-item-title>
                        </v-list-item>

                        <v-list-item :disabled="child.gen_url == null" @click.stop="handleDelVideoCuts(child.id)">
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

              <div v-else-if="item.status === 4" style="width:100%; background-color: rgba(0, 0, 0, 0.4);"
                class="d-flex flex-column justify-center align-center position-absolute left-0 top-0 fill-height">
                <v-progress-circular :model-value="rate(item.status)" :rotate="360" :size="80" :width="4" color="white">
                  <template v-slot:default> {{ rate(item.status) }} % </template>
                </v-progress-circular>
                <div class="mt-4 text-white text-subtitle-2">
                  <span>{{ translate(item.status) }}</span>
                </div>

                <div class="position-absolute right-0 top-0">
                  <v-btn icon variant="text" size="small" @click.stop="handleDelVideoCuts(child.id)">
                    <v-icon size="20" color="white">mdi-delete-outline</v-icon>
                  </v-btn>
                </div>
              </div>

              <div v-else style="width:100%; background-color: rgba(0, 0, 0, 0.4);"
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
        </v-row>
      </template>

    </v-container>

    <v-container fluid v-if="writVideoList.length">
      <v-row align="center" dense>
        <v-col cols="auto">
          <v-img width="32" draggable="false" aspect-ratio="1/1" cover
                 src="https://ai-workbench.eos-dongguan-7.cmecloud.cn/icon_component/writ_video.png"></v-img>
        </v-col>
        <v-col>
          <span class="text-h6">文案生成数字人</span>
        </v-col>
      </v-row>
      <v-row>
        <template v-for="item in writVideoList" :key="item.id">
          <v-col cols="6" md="3">
            <div
                :class="{ 'rounded-lg': true, 'overflow-hidden': true, 'position-relative': true, 'elevation-2': true }"
                style="height: 190px;">
              <div class="backgroud_Img_full" :style="{ 'background-image': `url(${item.cover_url})` }"></div>
              <v-img rounded="lg" draggable="false" :src="item.cover_url" height="100%" class="cursor-pointer zoomed"
                     @click.stop="playerVideo(item.gen_video)">
                <template v-slot:error>
                  <v-row align="center" class="fill-height ma-0" justify="center">
                    <v-img width="48" height="48" :src="error"></v-img>
                  </v-row>
                </template>
              </v-img>

              <v-slide-y-transition>
                <v-checkbox v-if="videoIsSelected && item.status === 2" class="position-absolute left-0 top-0"
                            @click.stop.native="() => {}" v-model="writVideoCheckbox" color="light_custom_blue_2" base-color="white"
                            :value="item.id" hide-details density="comfortable"></v-checkbox>
              </v-slide-y-transition>

              <div class="px-3 py-2 position-absolute bottom-0 left-0">
                <p class="text-subtitle-2 text-white text-ellipsis-one">{{ item.text }}</p>
                <p class="text-caption text-white">{{ item.gen_time ? formatDate(item.gen_time) : '正在计算作品生成时间'
                  }}</p>
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
                        <v-list-item :disabled="item.gen_video === null" @click.stop="playerVideo(item.gen_video)">
                          <template v-slot:prepend>
                            <v-icon icon="mdi-video-4k-box"></v-icon>
                          </template>
                          <v-list-item-title>预览作品</v-list-item-title>
                        </v-list-item>

                        <v-list-item :disabled="item.gen_video === null" @click.stop="copyUrl(item.gen_video)">
                          <template v-slot:prepend>
                            <v-icon icon="mdi-image-multiple"></v-icon>
                          </template>
                          <v-list-item-title>复制链接</v-list-item-title>
                        </v-list-item>

                        <v-list-item :disabled="item.gen_video === null" @click.stop="downloadsVideo(item.gen_video)">
                          <template v-slot:prepend>
                            <v-icon icon="mdi-cloud-arrow-down-outline"></v-icon>
                          </template>
                          <v-list-item-title>下载作品</v-list-item-title>
                        </v-list-item>

                        <v-list-item :disabled="item.gen_video === null" @click.stop="handleDelWritVideos(item.id)">
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

              <div v-else-if="item.status === 4" style="width:100%; background-color: rgba(0, 0, 0, 0.4);"
                   class="d-flex flex-column justify-center align-center position-absolute left-0 top-0 fill-height">
                <v-progress-circular :model-value="rate(item.status)" :rotate="360" :size="80" :width="4" color="white">
                  <template v-slot:default> {{ rate(item.status) }} % </template>
                </v-progress-circular>
                <div class="mt-4 text-white text-subtitle-2">
                  <span>{{ translate(item.status) }}</span>
                </div>

                <div class="position-absolute right-0 top-0">
                  <v-btn icon variant="text" size="small" @click.stop="handleDelWritVideos(item.id)">
                    <v-icon size="20" color="white">mdi-delete-outline</v-icon>
                  </v-btn>
                </div>
              </div>

              <div v-else style="width:100%; background-color: rgba(0, 0, 0, 0.4);"
                   class="d-flex flex-column justify-center align-center position-absolute left-0 top-0 fill-height">
                <v-progress-circular :model-value="rate(item.status)" :rotate="360" :size="80" :width="4" color="white">
                  <template v-slot:default>{{ rate(item.status) }} % </template>
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

    <v-container fluid v-if="photoHumanList.length">
      <v-row align="center" dense>
        <v-col cols="auto">
          <v-img width="32" draggable="false" aspect-ratio="1/1" cover
                 src="https://ai-workbench.eos-dongguan-7.cmecloud.cn/icon_component/photo_human.png"></v-img>
        </v-col>
        <v-col>
          <span class="text-h6">照片变真人</span>
        </v-col>
      </v-row>
      <v-row>
        <template v-for="item in photoHumanList" :key="item.id">
          <v-col cols="6" md="3">
            <div
                :class="{ 'rounded-lg': true, 'overflow-hidden': true, 'position-relative': true, 'elevation-2': true }"
                style="height: 190px;">
              <div class="backgroud_Img_full" :style="{ 'background-image': `url(${item.cover_url})` }"></div>
              <v-img rounded="lg" draggable="false" :src="item.cover_url" height="100%" class="cursor-pointer zoomed"
                     @click.stop="playerVideo(item.gen_video)">
                <template v-slot:error>
                  <v-row align="center" class="fill-height ma-0" justify="center">
                    <v-img width="48" height="48" :src="error"></v-img>
                  </v-row>
                </template>
              </v-img>

              <v-slide-y-transition>
                <v-checkbox v-if="videoIsSelected && item.status === 2" class="position-absolute left-0 top-0"
                            @click.stop.native="() => {}" v-model="photoHumanCheckbox" color="light_custom_blue_2" base-color="white"
                            :value="item.id" hide-details density="comfortable"></v-checkbox>
              </v-slide-y-transition>

              <div class="px-3 py-2 position-absolute bottom-0 left-0">
                <p class="text-subtitle-2 text-white text-ellipsis-one">{{ item.text }}</p>
                <p class="text-caption text-white">{{ item.gen_time ? formatDate(item.gen_time) : '正在计算作品生成时间'
                  }}</p>
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
                        <v-list-item :disabled="item.gen_video === null" @click.stop="playerVideo(item.gen_video)">
                          <template v-slot:prepend>
                            <v-icon icon="mdi-video-4k-box"></v-icon>
                          </template>
                          <v-list-item-title>预览作品</v-list-item-title>
                        </v-list-item>

                        <v-list-item :disabled="item.gen_video === null" @click.stop="copyUrl(item.gen_video)">
                          <template v-slot:prepend>
                            <v-icon icon="mdi-image-multiple"></v-icon>
                          </template>
                          <v-list-item-title>复制链接</v-list-item-title>
                        </v-list-item>

                        <v-list-item :disabled="item.gen_video === null" @click.stop="downloadsVideo(item.gen_video)">
                          <template v-slot:prepend>
                            <v-icon icon="mdi-cloud-arrow-down-outline"></v-icon>
                          </template>
                          <v-list-item-title>下载作品</v-list-item-title>
                        </v-list-item>

                        <v-list-item :disabled="item.gen_video === null" @click.stop="handleDelPhotoHumans(item.id)">
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

              <div v-else-if="item.status === 4" style="width:100%; background-color: rgba(0, 0, 0, 0.4);"
                   class="d-flex flex-column justify-center align-center position-absolute left-0 top-0 fill-height">
                <v-progress-circular :model-value="rate(item.status)" :rotate="360" :size="80" :width="4" color="white">
                  <template v-slot:default> {{ rate(item.status) }} % </template>
                </v-progress-circular>
                <div class="mt-4 text-white text-subtitle-2">
                  <span>{{ translate(item.status) }}</span>
                </div>

                <div class="position-absolute right-0 top-0">
                  <v-btn icon variant="text" size="small" @click.stop="handleDelPhotoHumans(item.id)">
                    <v-icon size="20" color="white">mdi-delete-outline</v-icon>
                  </v-btn>
                </div>
              </div>

              <div v-else style="width:100%; background-color: rgba(0, 0, 0, 0.4);"
                   class="d-flex flex-column justify-center align-center position-absolute left-0 top-0 fill-height">
                <v-progress-circular :model-value="rate(item.status)" :rotate="360" :size="80" :width="4" color="white">
                  <template v-slot:default>{{ rate(item.status) }} % </template>
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
import { rate, translate } from '@/utils/match'
import { getVideoClone, delVideoClone, resetVideoClone } from '@/api/sheet/VideoFigure'
import { getVideoTask, delTask } from '@/api/sheet/VideoReplaceFace'
import { getImgDigitalTask, delImgDigitalTask } from '@/api/sheet/ImgDigital'
import { getVideoCut, delVideoCut } from '@/api/sheet/VideoBlend'
import { getWritVideo,delWritVideo } from '@/api/sheet/WritVideo'
import { getPhotoHuman,delPhotoHuman } from '@/api/sheet/PhotoHuman'

import error from '@/assets/images/error.png'

import useVideoPlayerStore from "@/store/modules/videoPlayer";

const { proxy } = getCurrentInstance();

const { text, isSupported, copy } = proxy.useClipboard();

const isLoading = ref(true)

const videoPlayerStore = useVideoPlayerStore();

const videoData = reactive({
  videoCloneList: [],
  videoReplaceFaceList: [],
  imgDigitalList: [],
  videoCutList: [],
  writVideoList: [],
  photoHumanList: []
})

const videoIsSelected = ref(false);
const videoSelectedLength = computed(() => imgDigitalCheckbox.value.length + videoCloneCheckbox.value.length + videoReplaceFaceCheckbox.value.length + videoCutCheckbox.value.length + writVideoCheckbox.value.length + photoHumanCheckbox.value.length)
const videoTotal = computed({
  get() {
    // 混剪带有 子列表 额外处理
    let newVideoCutList = []
    for (let k = 0; k < videoCutList.value.length; k++) {
      for (let n = 0; n < videoCutList.value[k].details.length; n++) {
        if (videoCutList.value[k].details[n].gen_url) {
          newVideoCutList.push(videoCutList.value[k].details[n].gen_url)
        }
      }
    }
    return videoCloneList.value.length + videoReplaceFaceList.value.length + imgDigitalList.value.length + newVideoCutList.length
  },
  set(val) {
    return val
  }
})


const videoCheckbox = reactive({
  imgDigitalCheckbox: [],
  videoCloneCheckbox: [],
  videoReplaceFaceCheckbox: [],
  videoCutCheckbox: [],
  writVideoCheckbox: [],
  photoHumanCheckbox: []
})

const { videoCloneList, videoReplaceFaceList, imgDigitalList, videoCutList, writVideoList, photoHumanList } = toRefs(videoData);
const { imgDigitalCheckbox, videoCloneCheckbox, videoReplaceFaceCheckbox, videoCutCheckbox, writVideoCheckbox, photoHumanCheckbox } = toRefs(videoCheckbox);

const videoListLength = computed(() => videoCloneList.value.length + videoReplaceFaceList.value.length + imgDigitalList.value.length + videoCutList.value.length)

/* 数字人作品列表 */
async function getVideoList() {
  isLoading.value = true

  /* 照片数字人列表 */
  const imgDigitalRes = await getImgDigitalTask();
  imgDigitalList.value = imgDigitalRes.data;

  const videoCloneRes = await getVideoClone();
  videoCloneList.value = videoCloneRes.data.data;

  /* 视频换脸列表 */
  const replaceFaceRes = await getVideoTask({ gen_type: 'video' });
  videoReplaceFaceList.value = replaceFaceRes.data;

  /* AI混剪列表 */
  const videoCutRes = await getVideoCut()
  videoCutList.value = videoCutRes.data;

  /* 文生视频 */
  const writVideoRes = await getWritVideo({gen_type: 'text_video'})
  writVideoList.value = writVideoRes.data;

  /* 照片变真人 */
  const photoHumanRes = await getPhotoHuman({gen_type: 'image_video'})
  photoHumanList.value = photoHumanRes.data;

  isLoading.value = false
}

/* 视频批量删除 */
async function videoMultipleDelete() {
  try {
    // 数字人作品
    if (videoCloneCheckbox.value.length) {
      await delVideoClone({ ids: videoCloneCheckbox.value });
    }
    // 视频换脸
    if (videoReplaceFaceCheckbox.value.length) {
      await delTask({ ids: videoReplaceFaceCheckbox.value });
    }
    // 照片数字人
    if (imgDigitalCheckbox.value.length) {
      await delImgDigitalTask({ ids: imgDigitalCheckbox.value });
    }
    // AI混剪
    if (videoCutCheckbox.value.length) {
      await delVideoCut({ ids: videoCutCheckbox.value });
    }
    // 文生视频
    if (writVideoCheckbox.value.length) {
      await delWritVideo({ ids: writVideoCheckbox.value });
    }
    // 图片生成视频
    if (photoHumanCheckbox.value.length) {
      await delPhotoHuman({ ids: photoHumanCheckbox.value });
    }

    proxy.$modal.msgSuccess("所选作品删除成功");

    /* 重新 reload */
    getVideoList()

  } catch {
    proxy.$modal.msgWarning("删除所选作品出现异常");
  }

}

function isSelectChange() {
  videoIsSelected.value = !videoIsSelected.value
  videoReset();
}

/* 数字人生成失败重试 */
async function handleResetVideoClone(id) {
  const result = await resetVideoClone({ids: [id]});
  if (result.code === 200) {
    getVideoList()
    proxy.$modal.msgSuccess(result.message);
  }
}

/* 视频批量下载 */
async function videoMultipleDownload() {
  // 数字人作品
  for (let i = 0; i < videoCloneCheckbox.value.length; i++) {
    for (let k = 0; k < videoCloneList.value.length; k++) {
      if (videoCloneList.value[k].id === videoCloneCheckbox.value[i]) {
        videoCloneList.value[k].gen_video ? proxy.download(videoCloneList.value[k].gen_video, `video-${new Date().getTime()}-${videoCloneList.value[k].id}.mp4`) : null;
      }
    }
  }
  // 视频换脸 
  for (let i = 0; i < videoReplaceFaceCheckbox.value.length; i++) {
    for (let k = 0; k < videoReplaceFaceList.value.length; k++) {
      if (videoReplaceFaceList.value[k].id === videoReplaceFaceCheckbox.value[i]) {
        videoReplaceFaceList.value[k].gen_url ? proxy.download(videoReplaceFaceList.value[k].gen_url, `video-${new Date().getTime()}-${videoReplaceFaceList.value[k].id}.mp4`) : null;
      }
    }
  }
  // 照片数字人 
  for (let i = 0; i < imgDigitalCheckbox.value.length; i++) {
    for (let k = 0; k < imgDigitalList.value.length; k++) {
      if (imgDigitalList.value[k].id === imgDigitalCheckbox.value[i]) {
        imgDigitalList.value[k].gen_url ? proxy.download(imgDigitalList.value[k].gen_url, `video-${new Date().getTime()}-${imgDigitalList.value[k].id}.mp4`) : null;
      }
    }
  }

  // AI混剪
  for (let i = 0; i < videoCutCheckbox.value.length; i++) {
    for (let k = 0; k < videoCutList.value.length; k++) {
      for (let n = 0; n < videoCutList.value[k].details.length; n++) {
        if (videoCutList.value[k].details[n].id === videoCutCheckbox.value[i]) {
          videoCutList.value[k].details[n].gen_url ? proxy.download(videoCutList.value[k].details[n].gen_url, `video-${new Date().getTime()}-${videoCutList.value[k].details[n].id}.mp4`) : null;
        }
      }
    }
  }
}

/* 单独删除照片数字人项 */
async function handleDelImgDigital(id) {
  const res = await delImgDigitalTask({ ids: [id] });
  if (res.code === 200) {
    getVideoList()
    proxy.$modal.msgSuccess(res.message);
  }
}

/* 单独删除视频数字人项 */
async function handleDelVideoClone(id) {
  const delVideoCloneRes = await delVideoClone({ ids: [id] });
  if (delVideoCloneRes.code === 200) {
    getVideoList()
    proxy.$modal.msgSuccess(delVideoCloneRes.message);
  }
}

/* 单独删除视频换脸 */
async function handleDelVideoReplaceFace(id) {
  const delTaskRes = await delTask({ ids: [id] });
  if (delTaskRes.code === 200) {
    getVideoList()
    proxy.$modal.msgSuccess(delTaskRes.message);
  }
}

/* 删除作品项目 */
async function handleDelVideoCuts(id) {
  const res = await delVideoCut({ ids: [id] });
  if (res.code === 200) {
    getVideoList()
    proxy.$modal.msgSuccess(res.message);
  }
}

/* 删除文生视频 */
async function handleDelWritVideos(id) {
  const res = await delWritVideo({ ids: [id] });
  if (res.code === 200) {
    getVideoList()
    proxy.$modal.msgSuccess(res.message);
  }
}

/* 删除图生视频 */
async function handleDelPhotoHumans(id) {
  const res = await delPhotoHuman({ ids: [id] });
  if (res.code === 200) {
    getVideoList()
    proxy.$modal.msgSuccess(res.message);
  }
}

/* 重置视频选项状态 */
function videoReset() {
  imgDigitalCheckbox.value = []
  videoCloneCheckbox.value = []
  videoReplaceFaceCheckbox.value = []
  videoCutCheckbox.value = []
  writVideoCheckbox.value = []
  photoHumanCheckbox.value = []
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


/* 下载视频 */
function downloadsVideo(videoUrl) {
  proxy.download(videoUrl, `video_clone_${new Date().getTime()}.mp4`);
}

/* 预览作品 */
function playerVideo(videoUrl) {
  videoPlayerStore.openVideoWindow({ videoUrl });
}

/* 全选视频 */
function handleAllSelectVideo() {
  let imgDigitalCheckboxTemp = [];
  let videoCloneCheckboxTemp = [];
  let videoReplaceFaceCheckboxTemp = [];
  let videoCutCheckboxTemp = [];
  let writVideoCheckboxTemp = [];
  let photoHumanCheckboxTemp = [];

  // 数字人作品
  for (let k = 0; k < videoCloneList.value.length; k++) {
    if (videoCloneList.value[k].status === 2) { // 表示状态已生成完成
      videoCloneCheckboxTemp.push(videoCloneList.value[k].id)
    }
  }
  // 视频换脸 
  for (let k = 0; k < videoReplaceFaceList.value.length; k++) {
    if (videoReplaceFaceList.value[k].status === 2) { // 表示状态已生成完成
      videoReplaceFaceCheckboxTemp.push(videoReplaceFaceList.value[k].id)
    }
  }
  // 照片数字人 
  for (let k = 0; k < imgDigitalList.value.length; k++) {
    if (imgDigitalList.value[k].status === 2) { // 表示状态已生成完成
      imgDigitalCheckboxTemp.push(imgDigitalList.value[k].id)
    }
  }

  // AI混剪
  for (let k = 0; k < videoCutList.value.length; k++) {
    if (videoCutList.value[k].status === 2) { // 表示状态已生成完成
      for (let n = 0; n < videoCutList.value[k].details.length; n++) {
        videoCutCheckboxTemp.push(videoCutList.value[k].details[n].id)
      }
    }
  }

  // 文生视频
  for (let k = 0; k < writVideoList.value.length; k++) {
    if (writVideoList.value[k].status === 2) { // 表示状态已生成完成
      writVideoCheckboxTemp.push(writVideoList.value[k].id)
    }
  }

  // 图生视频
  for (let k = 0; k < photoHumanList.value.length; k++) {
    if (photoHumanList.value[k].status === 2) { // 表示状态已生成完成
      photoHumanCheckboxTemp.push(photoHumanList.value[k].id)
    }
  }

  imgDigitalCheckbox.value = imgDigitalCheckboxTemp;
  videoCloneCheckbox.value = videoCloneCheckboxTemp;
  videoReplaceFaceCheckbox.value = videoReplaceFaceCheckboxTemp;
  videoCutCheckbox.value = videoCutCheckboxTemp;
  writVideoCheckbox.value = writVideoCheckboxTemp;
  photoHumanCheckbox.value = photoHumanCheckboxTemp;
}

/* 取消全选视频 */
function handleNotAllSelectVideo() {
  videoReset()
}

getVideoList()

</script>
