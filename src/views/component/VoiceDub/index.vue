<template>
  <v-container ref="VideoCloneWindowRef" fluid class="px-0 py-0 pt-6 h-100">
    <v-form ref="voiceDubRef">
      <v-row>
        <v-col>
          <v-textarea :rules="voiceDubRules.message" v-model="message" density="compact" clear-icon="mdi-close-circle"
                      variant="outlined" placeholder="输入配音台词" clearable rows="9" counter="700" no-resize :loading="isLoading"
                      :disabled="isLoading"></v-textarea>
        </v-col>
      </v-row>

      <v-row no-gutters align="center" justify="space-between">
        <v-col cols="auto" md="auto">
          <p class="text-subtitle-2 font-weight-bold">配音员</p>
        </v-col>
        <v-col cols="auto" md="auto">
          <v-dialog max-width="1280" location="center">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn v-bind="activatorProps" :disabled="isLoading" variant="text"
                     color="blue-lighten-1">{{ audioExampleSelect.name }}</v-btn>
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
                                <template v-slot:append>
                                  <v-menu scroll-strategy="close">
                                    <template v-slot:activator="{ props }">
                                      <v-btn density="default" icon="mdi-chevron-right" size="small" v-bind="props"
                                             variant="text" v-tooltip="'选项'"></v-btn>
                                    </template>

                                    <v-list>
                                      <v-list-item :disabled="item.clone_address === null" @click="playAudio(item)">
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
                                      <v-list-item :disabled="item.preview_url === null" @click="playAudio(item.preview_url)">
                                        <template v-slot:prepend>
                                          <v-icon icon="mdi-ear-hearing"></v-icon>
                                        </template>
                                        <v-list-item-title>预览声音</v-list-item-title>
                                      </v-list-item>

                                      <v-list-item :disabled="item.preview_url === null"
                                                   @click="downloadsAudio(item.preview_url)">
                                        <template v-slot:prepend>
                                          <v-icon icon="mdi-cloud-arrow-down-outline"></v-icon>
                                        </template>
                                        <v-list-item-title>下载音频</v-list-item-title>
                                      </v-list-item>

                                      <v-list-item :disabled="item.preview_url === null"
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


      <v-row align="center" justify="space-between">
        <v-col cols="auto">
          <p ref="TemplateTipsRef" class="text-subtitle-2 font-weight-bold">生成结果</p>
        </v-col>

        <v-col v-if="audioUrlRes" cols="auto">
          <div  class="d-flex align-center">
            <p class="text-subtitle-2 text-medium-emphasis mr-1">声音生成成功</p>
            <v-icon color="success" icon="mdi-check-circle-outline" size="20"></v-icon>
          </div>
        </v-col>
        <v-col v-else cols="auto">
          <div class="d-flex align-center">
            <p class="text-subtitle-2 text-medium-emphasis mr-1">暂无声音克隆</p>
            <v-icon color="info" icon="mdi-progress-question" size="20"></v-icon>
          </div>
        </v-col>
      </v-row>

      <v-row justify="space-around" align="center">
        <v-col cols="auto">
          <v-btn variant="plain" prepend-icon="mdi-account-tie-voice-outline"
                 @click="playAudio(audioUrlRes)" :disabled="!audioUrlRes">播放</v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn variant="plain" prepend-icon="mdi-tray-arrow-down" :loading="downLoading"
                 @click="downloadsAudio" :disabled="!audioUrlRes">下载</v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn variant="plain" prepend-icon="mdi-content-copy" :disabled="!audioUrlRes"
                 @click="copyUrl">复制链接</v-btn>
        </v-col>
      </v-row>

      <v-row justify="center" align="center">
        <v-col cols="auto">
          <v-btn variant="flat" :loading="isLoading" :disabled="isLoading" prepend-icon="mdi-microphone-outline"
                 color="light_custom_blue_2" @click="handleVoiceDub">生成配音</v-btn>
        </v-col>
      </v-row>
    </v-form>




  </v-container>
</template>

<script setup>
import { getPreviewVoice } from '@/api/sheet/VoiceDub'
import { delAudioClone } from '@/api/sheet/AudioClone'
import { rate, translate } from '@/utils/match'
import useCloneModelStore from '@/store/modules/cloneModel'
import useCloneDataStore from '@/store/modules/cloneData'


const { proxy } = getCurrentInstance();
const { text, isSupported, copy } = proxy.useClipboard();

const audio = new Audio();

const cloneModelStore = useCloneModelStore();
const cloneDataStore = useCloneDataStore();

const isLoading = ref(false);
const downLoading = ref(false);

const audioExampleTab = ref('audioCustom');


const voiceDubRules = ref({
  message: [v => !!v || "请输入配音文案",v => (v && v.length <= 700) || '台词必须不超过700个字符']
});

const voiceCloneModelList = computed(() => cloneModelStore.voiceCloneModel);

const audioCloneTemplateCustomList = computed(() => cloneDataStore.audioCloneTemplateCustom);
const audioCloneTemplatePlatformList = computed(() => cloneDataStore.audioCloneTemplatePlatform);
const audioCloneTemplatePublicList = computed(() => cloneDataStore.audioCloneTemplatePublic);

const audioExampleSelect = ref({})
const message = ref("")
const audioUrlRes = ref("")

/* 生成配音 */
async function handleVoiceDub() {
  const {valid} = await proxy.$refs.voiceDubRef.validate();
  if (valid) {
    isLoading.value = true;
    // 发音人
    const {id, tts_system} = audioExampleSelect.value
    getPreviewVoice({text: message.value, speak_id: id, tts_system, audio_type: 'dub'}).then(res => {
      isLoading.value = false;
      audioUrlRes.value = res.data;
      // playAudio(res.data)
    })
  }
}

/* 获取音频克隆任务列表 */
async function getAudioCloneTemplateList() {
  // 自定义声音  // // status：0代表排队中，1是正在生成，2是生成完成，4是失败
  await cloneDataStore.getAudioCloneTemplateCustoms();
  // tts声音模型
  await cloneDataStore.getAudioCloneTemplatePublics();
  // 平台克隆声音
  await cloneDataStore.getAudioCloneTemplatePlatform();

  if (audioCloneTemplateCustomList.value.length !== 0) {
    audioExampleSelect.value = audioCloneTemplateCustomList.value[0]
  } else if (audioCloneTemplatePublicList.value.length !== 0) {
    audioExampleSelect.value = audioCloneTemplatePublicList.value[0]
  } else {
    audioExampleSelect.value = audioCloneTemplatePlatformList.value[0]
  }
}


/* 删除音频克隆任务项 */
async function delAudioCloneTask(id) {
  const delAudioCloneRes = await delAudioClone({ id });
  if (delAudioCloneRes.code === 200) {
    await getAudioCloneTemplateList();
    proxy.$modal.msgSuccess(delAudioCloneRes.message);
  } else {
    proxy.$modal.msgWarning(delAudioCloneRes.message);
  }
}

/* 复制地址 */
function copyUrl() {
  // http 或 https 判断复制是否可用
  if (navigator.clipboard) {
    // https
    copy(audioUrlRes.value);
  } else {
    // http **已弃用API临时解决方式
    const input = document.createElement('input');
    input.setAttribute('value', audioUrlRes.value);
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
  }
  proxy.$modal.msgSuccess('链接已复制到剪贴板');
}

/* 获取声音克隆模式 */
function getVoiceCloneModels() {
  cloneModelStore.getVoiceCloneModel().then();
}

/* 下载音频 */
async function downloadsAudio() {
  downLoading.value = true;
  await proxy.download(audioUrlRes.value, `audio_clone_${new Date().getTime()}.mp3`);
  downLoading.value = false;
}


/* 初始化任务数据 */
function reset() {
  proxy.$refs.voiceDubRef.reset();
  message.value = null;
}

/* 播放音频 */
function playAudio(url) {
  audio.src = url;
  audio.play();
}

/* 模式匹配展示 */
function modelMatch(selectModel) {
  let showModel = '';
  voiceCloneModelList.value.some((item) => {
    if (item.model === selectModel) {
      showModel = item.details
      return
    }
  })
  return showModel
}


getAudioCloneTemplateList();

getVoiceCloneModels();
</script>