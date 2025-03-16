<template>
  <v-container v-if="!audioCloneTemplateCustomList.length && !isLoading" fluid>
    <v-empty-state height="600"
                   image="https://cdn.vuetifyjs.com/docs/images/components/v-empty-state/teamwork.png">
      <template v-slot:title>
        <div class="text-subtitle-2 mt-8">
          暂无音频内容
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
  <v-container v-else class="py-3" fluid>
    <v-row align="center" dense justify="end">
      <v-slide-x-transition>
        <v-col v-show="voiceIsSelected === true" cols="auto">
          <v-btn variant="text" @click="handleAllSelectVoice">
            <template v-slot:prepend>
              <v-icon>mdi-check-all</v-icon>
            </template>
            全选
          </v-btn>
        </v-col>
      </v-slide-x-transition>
      <v-slide-x-transition>
        <v-col v-show="voiceIsSelected === true">
          <v-btn variant="text" @click="handleNotAllSelectVoice">
            <template v-slot:prepend>
              <v-icon>mdi-cancel</v-icon>
            </template>
            取消全选
          </v-btn>
        </v-col>
      </v-slide-x-transition>
      <v-slide-x-reverse-transition>
        <v-col v-show="voiceIsSelected === true" cols="auto">
          <p class="text-subtitle-2 pr-2">已选择 {{ voiceSelectedLength }} 项内容</p>
        </v-col>
      </v-slide-x-reverse-transition>
      <v-slide-x-reverse-transition>
        <v-col v-show="voiceIsSelected === true" cols="auto">
          <v-btn :disabled="voiceSelectedLength === 0" variant="text" @click="voiceMultipleDelete">
            <template v-slot:prepend>
              <v-icon>mdi-delete-outline</v-icon>
            </template>
            删除
          </v-btn>
        </v-col>
      </v-slide-x-reverse-transition>
      <v-slide-x-reverse-transition>
        <v-col v-show="voiceIsSelected === true" cols="auto">
          <v-btn :disabled="voiceSelectedLength === 0" variant="text" @click="voiceMultipleDownload">
            <template v-slot:prepend>
              <v-icon>mdi-folder-download-outline</v-icon>
            </template>
            下载
          </v-btn>
        </v-col>
      </v-slide-x-reverse-transition>
      <v-slide-x-reverse-transition>
        <v-col v-show="voiceIsSelected === true" class="mx-2" cols="auto">
          <v-divider length="20px" vertical></v-divider>
        </v-col>
      </v-slide-x-reverse-transition>
      <v-col cols="auto">
        <v-btn variant="text" @click="isSelectChange">
          <template v-slot:prepend>
            <v-icon v-if="voiceIsSelected === false">mdi-checkbox-multiple-marked-outline</v-icon>
            <v-icon v-if="voiceIsSelected === true">mdi-close-circle-multiple-outline</v-icon>
          </template>
          {{ voiceIsSelected ? '取消选择' : '批量操作' }}
        </v-btn>
      </v-col>
    </v-row>

    <v-container v-if="audioCloneTemplateCustomList.length" fluid>
      <v-row align="center" dense>
        <v-col cols="auto">
          <v-img aspect-ratio="1/1" cover draggable="false"
                 src="https://ai-workbench.eos-dongguan-7.cmecloud.cn/icon_component/voice_clone.png"
                 width="28"></v-img>
        </v-col>
        <v-col>
          <span class="text-h6">声音克隆</span>
        </v-col>
      </v-row>

      <v-row>
        <v-col v-for="item in audioCloneTemplateCustomList" :key="item.id" class="position-relative" cols="12" md="3">
          <v-card :id="`audio-${trimSpecial(item.name)}`"
                  color="light_custom_card_2" flat
                  rounded="lg"
                  variant="flat" @click.stop="playAudio(item.preview_url)">
            <template v-slot:prepend>
              <v-avatar border="false" rounded="false">
                <svg-icon class-name="text-h4" icon-class="voice"/>
              </v-avatar>
            </template>
            <template v-slot:title>
              <p class="text-body-1">{{ item.name }}</p>
            </template>
            <template v-slot:subtitle>
              <p v-if="item.status === 4" class="text-caption text-red font-weight-bold">状态：{{
                  translate(item.status)
                }}</p>
              <p v-else class="text-caption">状态：{{ translate(item.status) }}</p>
            </template>
            <template v-slot:text>
              <p class="text-caption">{{ modelMatch(item.select_model) }}</p>
              <p class="text-caption">{{ formatDate(item.clone_time) }}</p>
            </template>
            <template v-slot:append>
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-btn v-tooltip="'选项'" density="default" icon="mdi-chevron-right" size="small" v-bind="props"
                         variant="text"></v-btn>
                </template>
                <v-list>
                  <v-list-item :disabled="item.preview_url === null" @click.stop="playAudio(item.preview_url)">
                    <template v-slot:prepend>
                      <v-icon icon="mdi-ear-hearing"></v-icon>
                    </template>
                    <v-list-item-title>预览声音</v-list-item-title>
                  </v-list-item>

                  <v-list-item :disabled="item.preview_url === null" @click="downloadsAudio(item.preview_url)">
                    <template v-slot:prepend>
                      <v-icon icon="mdi-cloud-arrow-down-outline"></v-icon>
                    </template>
                    <v-list-item-title>下载音频</v-list-item-title>
                  </v-list-item>

                  <v-list-item :disabled="item.preview_url === null" @click="copyUrl(item.preview_url)">
                    <template v-slot:prepend>
                      <v-icon icon="mdi-image-multiple"></v-icon>
                    </template>
                    <v-list-item-title>复制链接</v-list-item-title>
                  </v-list-item>

                  <v-list-item @click="handleDelVoiceClone(item.id)">
                    <template v-slot:prepend>
                      <v-icon icon="mdi-delete-outline"></v-icon>
                    </template>
                    <v-list-item-title>删除任务</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
          </v-card>
          <div v-if="voiceIsSelected && item.status === 2"
               class="w-100 h-100 position-absolute left-0 top-0 bg-white opacity-40"></div>

          <v-slide-x-reverse-transition>
            <div v-if="voiceIsSelected && item.status === 2" class="position-absolute right-0 top-0 pr-3 pt-2">
              <v-checkbox
                  v-model="audioCloneCheckbox" :value="item.id"
                  base-color="light_custom_blue_2"
                  color="light_custom_blue_2" density="comfortable" hide-details hide-spin-buttons text-white
                  @click.stop.native="() => {}"></v-checkbox>
            </div>
          </v-slide-x-reverse-transition>
        </v-col>
      </v-row>

    </v-container>

  </v-container>
</template>

<script name="Creation" setup>
import {rate, translate} from '@/utils/match'
import {delAudioClone} from '@/api/sheet/AudioClone'
import useCloneDataStore from '@/store/modules/cloneData'
import useCloneModelStore from '@/store/modules/cloneModel'

const audio = new Audio();

const {proxy} = getCurrentInstance();

const {text, isSupported, copy} = proxy.useClipboard();

const isLoading = ref(true);

const cloneModelStore = useCloneModelStore();
const cloneDataStore = useCloneDataStore();

const voiceCloneModelList = computed(() => cloneModelStore.voiceCloneModel);

const audioCloneTemplateCustomList = computed(() => cloneDataStore.audioCloneTemplateCustom);


const voiceIsSelected = ref(false);
const voiceSelectedLength = computed(() => audioCloneCheckbox.value.length)

const voiceCheckbox = reactive({
  audioCloneCheckbox: []
})

const {audioCloneCheckbox} = toRefs(voiceCheckbox);


/* 数字人作品列表 */
async function getVocieList() {
  isLoading.value = true;
  await cloneDataStore.getAudioCloneTemplateCustoms()
  isLoading.value = false;
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

/* 视频批量删除 */
async function voiceMultipleDelete() {
  try {
    // 数字人作品
    if (audioCloneCheckbox.value.length) {
      await delAudioClone({ids: audioCloneCheckbox.value});
    }
    proxy.$modal.msgSuccess("音频删除成功");
    /* 重新 reload */
    getVocieList()

  } catch {
    proxy.$modal.msgWarning("删除音频异常");
  }
}

function isSelectChange() {
  voiceIsSelected.value = !voiceIsSelected.value
  voiceReset();
}

/* 音频批量下载 */
async function voiceMultipleDownload() {
  // 克隆音频
  for (let i = 0; i < audioCloneCheckbox.value.length; i++) {
    for (let k = 0; k < audioCloneTemplateCustomList.value.length; k++) {
      if (audioCloneTemplateCustomList.value[k].id == audioCloneCheckbox.value[i]) {
        audioCloneTemplateCustomList.value[k].gen_video ? proxy.download(audioCloneTemplateCustomList.value[k].gen_video, `video-${new Date().getTime()}-${audioCloneTemplateCustomList.value[k].id}.mp4`) : null;
      }
    }
  }
}


/* 单独删除音频克隆项 */
async function handleDelVoiceClone(id) {
  const delAudioCloneRes = await delAudioClone({ids: [id]});
  if (delAudioCloneRes.code == 200) {
    getVocieList()
    proxy.$modal.msgSuccess(delAudioCloneRes.message);
  } else {
    proxy.$modal.msgWarning(delAudioCloneRes.message);
  }
}

/* 重置视频选项状态 */
function voiceReset() {
  audioCloneCheckbox.value = []
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

/* 获取声音克隆模式 */
function getVoiceCloneModels() {
  cloneModelStore.getVoiceCloneModel().then()
}

/* 播放音频 */
function playAudio(url) {
  audio.src = url;
  audio.play();
  // if (item.preview_url) {
  //   audio.src = item.preview_url;
  //   audio.play();
  // } else if (item.clone_address) {
  //   audio.src = item.clone_address
  //   audio.play();
  // }
}

/* 下载音频 */
function downloadsAudio(audioUrl) {
  proxy.download(audioUrl, `audio_clone_${new Date().getTime()}.mp3`);
}

/* 全选音频 */
function handleAllSelectVoice() {
  let audioCloneCheckboxTemp = [];
  // 音频克隆
  for (let k = 0; k < audioCloneTemplateCustomList.value.length; k++) {
    if (audioCloneTemplateCustomList.value[k].status === 2) { // 表示状态已生成完成
      audioCloneCheckboxTemp.push(audioCloneTemplateCustomList.value[k].id)
    }
  }
  audioCloneCheckbox.value = audioCloneCheckboxTemp;
}

/* 取消全选视频 */
function handleNotAllSelectVoice() {
  voiceReset()
}

getVocieList()
getVoiceCloneModels()
</script>
