<template>
  <v-container fluid class="px-0 py-0 pt-3">
    <v-form ref="videoCutRef">
      <v-row>
        <v-col>
          <v-textarea v-model="dialogue" row-height="5" rows="5" persistent-placeholder persistent-counter counter="800"
             clearable :rules="videoBlendRules.dialogue" clear-icon="mdi-close-circle" variant="outlined" :loading="isLoading"
            :disabled="isLoading" placeholder="输入视频文案，您可以使用Ai文案组件创作后复制"></v-textarea>
        </v-col>
      </v-row>

      <v-row no-gutters align="center">
        <v-col cols="auto" md="auto">
          <p class="text-subtitle-2 font-weight-bold">场景</p>
        </v-col>
        <v-col cols="auto" md="auto">
          <v-tabs v-model="sceneTab" color="light_custom_blue_2" align-tabs="start" density="compact" hide-slider>
            <v-tab value="enterprise" class="font-weight-bold">企业产品宣传</v-tab>
          </v-tabs>
        </v-col>
      </v-row>

      <v-divider class="mb-3 mt-2"></v-divider>

      <v-row dense align="center">
        <v-col>
          <p ref="TemplateTipsRef" class="text-subtitle-1 font-weight-bold mb-2">开篇视频</p>
          <p class="text-subtitle-2 mb-5">与文案配套吸引眼球的视频，例如数字人口播、近期热点事件视频、酷炫视觉、数据图标等，建议上传1-5个可使AI素材或者视频数字人生成或者视频提取组件下载</p>
          <v-file-upload v-model="openingVideoList" :disabled="isLoading" icon="mdi-plus" density="compact" variant="compact" clearable title="拖拽或点击上传" show-size multiple></v-file-upload>
        </v-col>
      </v-row>

      <v-row align="center">
        <v-col>
          <p ref="TemplateTipsRef" class="text-subtitle-1 font-weight-bold mb-2">企业形象</p>
          <p class="text-subtitle-2 mb-5">拍摄企业形象墙/企业门口，入户场景等，建议1-5个</p>
          <v-file-upload v-model="corporateImageList" :disabled="isLoading" icon="mdi-plus" density="compact" variant="compact" clearable title="拖拽或点击上传" show-size multiple></v-file-upload>
        </v-col>
      </v-row>

      <v-row align="center">
        <v-col>
          <p ref="TemplateTipsRef" class="text-subtitle-1 font-weight-bold mb-2">产品使用场景</p>
          <p class="text-subtitle-2 mb-5">从客户痛点角度展示产品在使用中的大的场景，如车间、办公室等，建议1-5个</p>
          <v-file-upload v-model="usageScenarioList" :disabled="isLoading" icon="mdi-plus" density="compact" variant="compact" clearable title="拖拽或点击上传" show-size multiple></v-file-upload>
        </v-col>
      </v-row>

      <v-row align="center">
        <v-col>
          <p ref="TemplateTipsRef" class="text-subtitle-1 font-weight-bold mb-2">产品细节</p>
          <p class="text-subtitle-2 mb-5">产品细节和卖点的展示，如使用中的场景，近景色展示可以多个角度展示，建议5-20个</p>
          <v-file-upload v-model="productDetailList" :disabled="isLoading" icon="mdi-plus" density="compact" variant="compact" clearable title="拖拽或点击上传" show-size multiple></v-file-upload>
        </v-col>
      </v-row>

      <v-row align="center">
        <v-col>
          <p ref="TemplateTipsRef" class="text-subtitle-1 font-weight-bold mb-2">视频结尾</p>
          <p class="text-subtitle-2 mb-5">与文案配套的结尾视频，如数字人口播</p>
          <v-file-upload v-model="endingVideoList" :disabled="isLoading" icon="mdi-plus" density="compact" variant="compact" clearable title="拖拽或点击上传" show-size multiple></v-file-upload>
        </v-col>
      </v-row>

      <v-row align="center">
        <v-col cols="auto" md="auto">
          <p class="text-subtitle-2 font-weight-bold">音色</p>
        </v-col>
        <v-col cols="auto" md="auto">
          <v-dialog max-width="1280" location="center">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn v-bind="activatorProps" :loading="isLoading" :disabled="isLoading" variant="text"
                     color="blue-lighten-1" v-tooltip:bottom="'选择发音人'">{{ audioExampleSelect.name }}</v-btn>
            </template>
            <template v-slot:default="{ isActive }">
              <v-card>
                <template v-slot:title>
                  <span class="text-subtitle-1">选择发音人</span>
                </template>
                <div class="px-4 mb-1">
                  <v-tabs v-model="audioExampleTab" class="mb-3" color="light_custom_blue_2">
                    <v-tab value="audioCustom" class="font-weight-bold">我的克隆</v-tab>
                    <v-tab value="audioPlatform" class="font-weight-bold">平台克隆</v-tab>
                    <v-tab value="audioPublic" class="font-weight-bold">公共声音</v-tab>
                  </v-tabs>
                </div>
                <v-tabs-window v-model="audioExampleTab">
                  <v-tabs-window-item value="audioCustom">
                    <v-item-group mandatory v-model="audioExampleSelect">
                      <v-container fluid height="520" class="overflow-y-auto">
                        <v-row v-if="audioCloneTemplateCustomList.length">
                          <v-col v-for="(item, index) in audioCloneTemplateCustomList" :key="item.id" cols="12" md="4">
                            <v-item v-slot="{ isSelected, toggle }" :value="item">
                              <v-list-item @click="toggle" :active="isSelected" rounded="lg" nav class="px-2 py-2"
                                           color="light_custom_blue_2">
                                <template v-slot:prepend>
                                  <v-avatar rounded="false" border="false">
                                    <svg-icon class-name="text-h4" icon-class="voice" />
                                  </v-avatar>
                                </template>

                                <v-list-item-title>{{ item.name }}</v-list-item-title>
                                <v-list-item-subtitle>
                                  <div class="d-flex overflow-x-hidden">
                                    <span class="text-caption">{{ translate(item.status) }}</span>
                                    <span class="text-caption ml-3">模式：{{ modelMatch(item.select_model) }}</span>
                                  </div>
                                  <div class="text-caption flex-shrink-0">任务开始: {{ formatDate(item.clone_time) }}
                                  </div>
                                  <v-row>
                                    <v-col>
                                      <v-progress-linear buffer-value="0" color="light_custom_blue_2"
                                                         :model-value="rate(item.status)" stream></v-progress-linear>
                                    </v-col>
                                  </v-row>
                                </v-list-item-subtitle>
                              </v-list-item>

                            </v-item>
                          </v-col>
                        </v-row>

                        <!-- 空状态 -->
                        <v-empty-state height="380" v-else
                                       image="https://cdn.vuetifyjs.com/docs/images/components/v-empty-state/teamwork.png">
                          <template v-slot:title>
                            <div class="text-subtitle-2 mt-8">
                              暂无声音克隆数据
                            </div>
                          </template>

                          <template v-slot:text>
                            <div class="text-caption">
                              前往创建声音克隆后再查看
                            </div>
                          </template>
                        </v-empty-state>
                      </v-container>
                    </v-item-group>
                  </v-tabs-window-item>

                  <v-tabs-window-item value="audioPlatform">
                    <v-item-group mandatory v-model="audioExampleSelect">
                      <v-container fluid height="520" class="overflow-y-auto">
                        <v-row v-if="audioCloneTemplatePlatformList.length">
                          <v-col v-for="(item, index) in audioCloneTemplatePlatformList" :key="item.id" cols="12"
                                 md="4">
                            <v-item v-slot="{ isSelected, toggle }" :value="item">
                              <v-list-item @click="toggle" :active="isSelected" rounded="lg" nav class="px-2 py-2"
                                           color="light_custom_blue_2">
                                <template v-slot:prepend>
                                  <v-avatar rounded="false" border="false">
                                    <svg-icon class-name="text-h4" icon-class="voice" />
                                  </v-avatar>
                                </template>

                                <v-list-item-title>{{ item.name }}</v-list-item-title>
                                <v-list-item-subtitle>
                                  <div class="d-flex overflow-x-hidden">
                                    <span class="text-caption">{{ translate(item.status) }}</span>
                                    <span class="text-caption ml-3">模式：{{ modelMatch(item.select_model) }}</span>
                                  </div>
                                  <div class="text-caption flex-shrink-0">任务开始: {{ formatDate(item.clone_time) }}
                                  </div>
                                  <v-row>
                                    <v-col>
                                      <v-progress-linear buffer-value="0" color="light_custom_blue_2"
                                                         :model-value="rate(item.status)" stream></v-progress-linear>
                                    </v-col>
                                  </v-row>
                                </v-list-item-subtitle>
                                <template v-slot:append>
                                  <v-menu scroll-strategy="close">
                                    <template v-slot:activator="{ props }">
                                      <v-btn density="default" icon="mdi-chevron-right" size="small" v-bind="props"
                                             variant="text" v-tooltip="'选项'"></v-btn>
                                    </template>

                                    <v-list>
                                      <v-list-item :disabled="item.clone_address == null" @click="playAudio(item)">
                                        <template v-slot:prepend>
                                          <v-icon icon="mdi-ear-hearing"></v-icon>
                                        </template>
                                        <v-list-item-title>预览声音</v-list-item-title>
                                      </v-list-item>

                                      <v-list-item :disabled="item.clone_address == null"
                                                   @click="downloadsAudio(item.clone_address)">
                                        <template v-slot:prepend>
                                          <v-icon icon="mdi-cloud-arrow-down-outline"></v-icon>
                                        </template>
                                        <v-list-item-title>下载音频</v-list-item-title>
                                      </v-list-item>

                                      <v-list-item :disabled="item.clone_address == null"
                                                   @click="copyUrl(item.clone_address)">
                                        <template v-slot:prepend>
                                          <v-icon icon="mdi-image-multiple"></v-icon>
                                        </template>
                                        <v-list-item-title>复制链接</v-list-item-title>
                                      </v-list-item>

                                      <v-list-item @click="delAudioCloneTask(item.id)">
                                        <template v-slot:prepend>
                                          <v-icon icon="mdi-delete-outline"></v-icon>
                                        </template>
                                        <v-list-item-title>删除任务</v-list-item-title>
                                      </v-list-item>

                                    </v-list>

                                  </v-menu>
                                </template>

                              </v-list-item>

                            </v-item>
                          </v-col>
                        </v-row>

                        <!-- 空状态 -->
                        <v-empty-state height="380" v-else
                                       image="https://cdn.vuetifyjs.com/docs/images/components/v-empty-state/teamwork.png">
                          <template v-slot:title>
                            <div class="text-subtitle-2 mt-8">
                              暂无声音克隆数据
                            </div>
                          </template>

                          <template v-slot:text>
                            <div class="text-caption">
                              前往创建声音克隆后再查看
                            </div>
                          </template>
                        </v-empty-state>
                      </v-container>
                    </v-item-group>
                  </v-tabs-window-item>

                  <v-tabs-window-item value="audioPublic">
                    <v-item-group mandatory v-model="audioExampleSelect">
                      <v-container fluid height="520" class="overflow-y-auto">
                        <v-row v-if="audioCloneTemplatePublicList.length">
                          <v-col v-for="(item, index) in audioCloneTemplatePublicList" :key="item.id" cols="12" md="4">
                            <v-item v-slot="{ isSelected, toggle }" :value="item">
                              <v-list-item @click="toggle" :active="isSelected" rounded="lg" nav class="px-2 py-2"
                                           color="light_custom_blue_2">
                                <template v-slot:prepend>
                                  <v-avatar rounded="false" border="false">
                                    <svg-icon class-name="text-h4" icon-class="voice" />
                                  </v-avatar>
                                </template>

                                <v-list-item-title>{{ item.name }}</v-list-item-title>

                                <v-list-item-subtitle>
                                  <span class="text-caption">语言：{{ item.languages }}</span>
                                  <span class="ml-4 text-caption">风格：{{ item.timbre_info }}</span>
                                </v-list-item-subtitle>

                                <template v-slot:append>
                                  <v-menu scroll-strategy="close">
                                    <template v-slot:activator="{ props }">
                                      <div>
                                        <v-btn density="default" icon="mdi-chevron-right" size="small" v-bind="props"
                                               variant="text" v-tooltip="'选项'"></v-btn>
                                      </div>
                                    </template>
                                    <v-list>
                                      <v-list-item :disabled="item.preview_url == null" @click="playAudio(item)">
                                        <template v-slot:prepend>
                                          <v-icon icon="mdi-ear-hearing"></v-icon>
                                        </template>
                                        <v-list-item-title>预览声音</v-list-item-title>
                                      </v-list-item>

                                      <v-list-item :disabled="item.preview_url == null"
                                                   @click="downloadsAudio(item.preview_url)">
                                        <template v-slot:prepend>
                                          <v-icon icon="mdi-cloud-arrow-down-outline"></v-icon>
                                        </template>
                                        <v-list-item-title>下载音频</v-list-item-title>
                                      </v-list-item>

                                      <v-list-item :disabled="item.preview_url == null"
                                                   @click="copyUrl(item.preview_url)">
                                        <template v-slot:prepend>
                                          <v-icon icon="mdi-image-multiple"></v-icon>
                                        </template>
                                        <v-list-item-title>复制链接</v-list-item-title>
                                      </v-list-item>

                                    </v-list>

                                  </v-menu>
                                </template>
                              </v-list-item>
                            </v-item>
                          </v-col>
                        </v-row>

                        <!-- 空状态 -->
                        <v-empty-state height="380" v-else
                                       image="https://cdn.vuetifyjs.com/docs/images/components/v-empty-state/teamwork.png">
                          <template v-slot:title>
                            <div class="text-subtitle-2 mt-8">
                              暂无声音克隆数据
                            </div>
                          </template>

                          <template v-slot:text>
                            <div class="text-caption">
                              前往创建声音克隆后再查看
                            </div>
                          </template>
                        </v-empty-state>
                      </v-container>
                    </v-item-group>
                  </v-tabs-window-item>
                </v-tabs-window>

                <template v-slot:actions>
                  <v-btn @click="isActive.value = false" variant="plain" color="light_custom_blue_2" text="取消"></v-btn>
                  <v-btn @click="isActive.value = false" variant="flat" color="indigo-darken-2" text="确认"></v-btn>
                </template>

              </v-card>
            </template>
          </v-dialog>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-text-field v-model="videoNumber" :rules="videoBlendRules.videoNumber" rounded="lg" placeholder="请为您的声音克隆命名" prepend-inner-icon="mdi-rename-outline" density="compact" variant="outlined" :loading="isLoading" :disabled="isLoading">
            <template v-slot:prepend>
              <span class="text-subtitle-2 font-weight-bold">生成视频数量（1-100个）</span>
            </template>
          </v-text-field>
        </v-col>
      </v-row>

      <v-row dense>
        <v-col>
          <v-select v-model="aspect" rounded="lg" variant="outlined" tile density="compact" :items="aspectList"
            hide-details item-title="name" item-value="value" :loading="isLoading" :disabled="isLoading">
            <template v-slot:prepend>
              <span class="text-subtitle-2 font-weight-bold">画面比例</span>
            </template>
            <template v-slot:selection="{ item, index }">
              <v-icon>{{ item.raw.icon }}</v-icon>
              <p class="ml-4">{{ item.raw.name }}</p>
            </template>
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props">
                <template v-slot:prepend>
                  <v-icon>{{ item.raw.icon }}</v-icon>
                </template>
                <template v-slot:title>
                  <p>{{ item.raw.name }}</p>
                </template>
              </v-list-item>
            </template>
          </v-select>
        </v-col>
      </v-row>
    </v-form>

    <v-row justify="center" align="center" class="mt-6">
      <v-col cols="auto">
        <v-btn variant="flat" :loading="isLoading" :disabled="isLoading" prepend-icon="mdi-file-tree"
        color="light_custom_blue_2" @click="addVideoCuts">生成视频</v-btn>
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup>
import { addVideoCut, getFont } from '@/api/sheet/VideoBlend'
import useCloneDataStore from '@/store/modules/cloneData'
import useCloneModelStore from '@/store/modules/cloneModel'

import { rate, translate } from '@/utils/match'

import FontSize from '@/assets/style_config/fontSize.json'
import Border from '@/assets/style_config/border.json'
import Position from '@/assets/style_config/position.json'

const { proxy } = getCurrentInstance();

const cloneModelStore = useCloneModelStore();
const cloneDataStore = useCloneDataStore();

const voiceCloneModelList = computed(() => cloneModelStore.voiceCloneModel);

const audioCloneTemplateCustomList = computed(() => cloneDataStore.audioCloneTemplateCustom);
const audioCloneTemplatePlatformList = computed(() => cloneDataStore.audioCloneTemplatePlatform);
const audioCloneTemplatePublicList = computed(() => cloneDataStore.audioCloneTemplatePublic);

const audioExampleTab = ref('audioCustom');

const sceneTab = ref('enterprise')

const isLoading = ref(false);
const isFontConfig = ref(true);

const videoList = reactive({
  openingVideoList:[],
  corporateImageList: [],
  usageScenarioList: [],
  productDetailList: [],
  endingVideoList: []
})

const videoBlendRules = ref({
  dialogue: [v => !!v || "请输入视频文案"],
  videoNumber: [v => !!v || "请输入生成视频数量"]
})

const audioConfig = reactive({
  aspectList: [
    {
      name: "16:9",
      value: '16:9',
      icon: 'mdi-crop-landscape'
    },
    {
      name: "9:16",
      value: '9:16',
      icon: 'mdi-crop-portrait'
    },
    {
      name: "1:1",
      value: '1:1',
      icon: 'mdi-crop-square'
    }
  ]
})

const styleConfig = reactive({
  fontFamilyList: [],
  fontSizeList: FontSize,
  borderList: Border,
  positionList: Position,
})

const fontStyleConfigParams = reactive({
  fontFamily: undefined,
  fontSize: 40,
  fontColor: '#000000',
  fontBorderColor: '#000000',
  fontBorderWidth: 1,
  fontPosition: 'bottom'
})

const audioConfigParams = reactive({
  audioExampleSelect: {}
})

const videoParams = reactive({
  dialogue: null,
  aspect: '16:9',
  source: 'local',
  videoNumber: 3,
  videoConcat: 'sequential'
})

const { fontFamilyList } = toRefs(styleConfig);
const { aspectList } = toRefs(audioConfig);
const { openingVideoList,corporateImageList,usageScenarioList,productDetailList,endingVideoList } = toRefs(videoList);

// 提交参数
const { dialogue, aspect, source, videoNumber, videoConcat } = toRefs(videoParams);
const { fontFamily, fontSize, fontColor, fontBorderColor, fontBorderWidth, fontPosition } = toRefs(fontStyleConfigParams);
const { audioExampleSelect } = toRefs(audioConfigParams);

/* 创建数字人克隆任务 */
async function addVideoCuts() {
  const { valid } = await proxy.$refs.videoCutRef.validate();
  if (valid) {
    isLoading.value = true;

    let openingVideoUrl = [];
    let corporateImageUrl = [];
    let usageScenarioUrl = [];
    let productDetailUrl = [];
    let endingVideoUrl = [];

    if (openingVideoList.value.length) {
      for(let i=0; i<openingVideoList.value.length; i++) {
        const openingVideoRes = await proxy.sendUpload({ Body: openingVideoList.value[i], taskType:'Video_blend', ContentType:'video/mp4'});
        openingVideoUrl.push(openingVideoRes)
      }
    }

    if (corporateImageList.value.length) {
      for(let i=0; i<corporateImageList.value.length; i++) {
        const corporateImageRes = await proxy.sendUpload({ Body: corporateImageList.value[i], taskType:'Video_blend', ContentType:'video/mp4'});
        corporateImageUrl.push(corporateImageRes)
      }
    }

    if (usageScenarioList.value.length) {
      for(let i=0; i<usageScenarioList.value.length; i++) {
        const usageScenarioRes = await proxy.sendUpload({ Body: usageScenarioList.value[i], taskType:'Video_blend', ContentType:'video/mp4'});
        usageScenarioUrl.push(usageScenarioRes)
      }
    }

    if (productDetailList.value.length) {
      for(let i=0; i<productDetailList.value.length; i++) {
        const productDetailRes = await proxy.sendUpload({ Body: productDetailList.value[i], taskType:'Video_blend', ContentType:'video/mp4'});
        productDetailUrl.push(productDetailRes)
      }
    }

    if (endingVideoList.value.length) {
      for(let i=0; i<endingVideoList.value.length; i++) {
        const endingVideoRes = await proxy.sendUpload({ Body: endingVideoList.value[i], taskType:'Video_blend', ContentType:'video/mp4'});
        endingVideoUrl.push(endingVideoRes)
      }
    }

    const param = {
      text: dialogue.value, // 字幕
      source: source.value,
      opening_video: openingVideoUrl,
      corporate_image:corporateImageUrl,
      usage_scenario: usageScenarioUrl,
      product_details:productDetailUrl,
      ending_video:endingVideoUrl,
      video_count: Number(videoNumber.value),
      font: fontFamily.value,
      speak_id: audioExampleSelect.value.id,
      tts_system: audioExampleSelect.value.tts_system,
      video_aspect: aspect.value,
      video_concat_mode: videoConcat.value, // #视频切割 模式 random 随机 / sequential 顺序
      subtitle_enabled: isFontConfig.value,
      subtitle_position: fontPosition.value,
      custom_position: null, //  自定义位置 70.0 自定义才有用
      text_fore_color: fontColor.value,
      font_size: Number(fontSize.value),
      stroke_color: fontBorderColor.value,
      stroke_width: fontBorderWidth.value
    }
    const res = await addVideoCut(param);

    if (res.code == 200) {
      proxy.$modal.msgSuccess(res.message);
      isLoading.value = false;
      reset();
    } else {
      proxy.$modal.msgWarning(res.message);
      isLoading.value = false;
    }

  }
}

/* 获取字体 */
async function getFonts() {
  const getFontRes = await getFont();
  // status：0代表排队中，1是正在生成，2是生成完成，4是失败
  fontFamilyList.value = getFontRes.data;
  fontFamily.value = getFontRes.data[0].font;
}

/* 获取音频克隆任务列表 */
async function getAudioCloneTemplateList() {
  // 自定义声音  // // status：0代表排队中，1是正在生成，2是生成完成，4是失败
  await cloneDataStore.getAudioCloneTemplateCustoms();
  // tts声音模型
  await cloneDataStore.getAudioCloneTemplatePublics();
  // 平台克隆声音
  await cloneDataStore.getAudioCloneTemplatePlatform();

  // 默认发音人
  if (audioCloneTemplateCustomList.value.length != 0) {
    audioExampleSelect.value = audioCloneTemplateCustomList.value[0]
  } else if (audioCloneTemplatePublicList.value.length != 0) {
    audioExampleSelect.value = audioCloneTemplatePublicList.value[0]
  } else {
    audioExampleSelect.value = audioCloneTemplatePlatformList.value[0]
  }
}

/* 模式匹配展示 */
function modelMatch(selectModel) {
  let showModel = '';
  voiceCloneModelList.value.some((item) => {
    if (item.model == selectModel) {
      showModel = item.details
      return
    }
  })
  return showModel
}

/* 初始化任务数据 */
function reset() {
  // proxy.$refs.videoCutRef.reset();
  openingVideoList.value = [];
  corporateImageList.value = [];
  usageScenarioList.value = [];
  productDetailList.value = [];
  endingVideoList.value = [];
}

getFonts()
getAudioCloneTemplateList()

</script>