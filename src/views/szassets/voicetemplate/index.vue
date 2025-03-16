<template>
  <v-container class="px-6" fluid>

    <v-row align="center">
      <v-col cols="12" md="3" order-sm="last">
        <v-autocomplete :items="audioSearchList" clearable density="comfortable" hide-details hide-no-data
                        item-title="name" item-value="id" label="声音克隆搜索" prepend-icon="mdi-magnify"
                        variant="underlined">
          <template v-slot:chip="{ props, item }">
            <v-chip :text="item.raw.name" v-bind="props"></v-chip>
          </template>
          <template v-slot:item="{ props, item }">
            <v-list-item :title="item.raw.name" v-bind="props"
                         @click.stop="handelScrollTarget(item.raw.searchId)"></v-list-item>
          </template>
        </v-autocomplete>
      </v-col>

      <v-col class="pt-4" cols="12" md="9" order-sm="first">
        <span class="text-h6">我的克隆（{{ audioCloneTemplateCustomList.length }}）</span>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="item in audioCloneTemplateCustomList" :key="item.id" cols="12" md="3">
        <v-card :id="`audio-${trimSpecial(item.name)}`" :class="{ 'custom_elevation': `audio-${trimSpecial(item.name)}` === scrollTargetAnimation }" color="light_custom_card_2" flat
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
                <v-list-item :disabled="item.preview_url == null" @click.stop="playAudio(item.preview_url)">
                  <template v-slot:prepend>
                    <v-icon icon="mdi-ear-hearing"></v-icon>
                  </template>
                  <v-list-item-title>预览声音</v-list-item-title>
                </v-list-item>

                <v-list-item :disabled="item.preview_url == null" @click="downloadsAudio(item.preview_url)">
                  <template v-slot:prepend>
                    <v-icon icon="mdi-cloud-arrow-down-outline"></v-icon>
                  </template>
                  <v-list-item-title>下载音频</v-list-item-title>
                </v-list-item>

                <v-list-item :disabled="item.preview_url == null" @click="copyUrl(item.preview_url)">
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
        </v-card>
      </v-col>
    </v-row>


    <v-row align="center">
      <v-col class="pt-4 text-h6" cols="auto">
        <span>平台克隆（{{ audioCloneTemplatePlatformList.length }}）</span>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="item in audioCloneTemplatePlatformList" :key="item.id" cols="12" md="3">
        <v-card :id="`audio-${trimSpecial(item.name)}`" :class="{ 'custom_elevation': `audio-${trimSpecial(item.name)}` === scrollTargetAnimation }" color="light_custom_card_2" flat
                rounded="lg"
                variant="flat" @click.stop="playAudio(item.clone_address)">
          <template v-slot:prepend>
            <v-avatar border="false" rounded="false">
              <svg-icon class-name="text-h4" icon-class="voice"/>
            </v-avatar>
          </template>
          <template v-slot:title>
            <p class="text-body-1">{{ item.name }}</p>
          </template>
          <template v-slot:text>
            <p class="text-caption">{{ formatDate(item.clone_time) }}</p>
          </template>
          <template v-slot:append>
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn v-tooltip="'选项'" density="default" icon="mdi-chevron-right" size="small" v-bind="props"
                       variant="text"></v-btn>
              </template>

              <v-list>
                <v-list-item :disabled="item.clone_address == null" @click.stop="playAudio(item.clone_address)">
                  <template v-slot:prepend>
                    <v-icon icon="mdi-ear-hearing"></v-icon>
                  </template>
                  <v-list-item-title>预览声音</v-list-item-title>
                </v-list-item>
              </v-list>

            </v-menu>
          </template>
        </v-card>
      </v-col>
    </v-row>

    <v-row align="center" dense>
      <v-col class="pt-4 text-h6" cols="auto">
        <span>公共声音（{{ audioCloneTemplatePublicList.length }}）</span>
      </v-col>
    </v-row>

    <v-row>
      <v-col v-for="item in audioCloneTemplatePublicList" :key="item.id" cols="12" md="3">
        <v-card :id="`audio-${trimSpecial(item.name)}`" :class="{ 'custom_elevation': `audio-${trimSpecial(item.name)}` === scrollTargetAnimation }" color="light_custom_card_2" flat
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
          <template v-slot:text>
            <p class="text-caption">语言：{{ item.languages }}</p>
            <p class="text-caption">风格：{{ item.timbre_info }}</p>
          </template>
          <template v-slot:append>
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn v-tooltip="'选项'" density="default" icon="mdi-chevron-right" size="small" v-bind="props"
                       variant="text"></v-btn>
              </template>
              <v-list>
                <v-list-item :disabled="item.preview_url == null" @click.stop="playAudio(item.preview_url)">
                  <template v-slot:prepend>
                    <v-icon icon="mdi-ear-hearing"></v-icon>
                  </template>
                  <v-list-item-title>预览声音</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup>
import {delAudioClone} from '@/api/sheet/AudioClone'
import {useGoTo} from 'vuetify'
import useCloneDataStore from '@/store/modules/cloneData'
import useCloneModelStore from '@/store/modules/cloneModel'
import {rate, translate} from '@/utils/match'

const {proxy} = getCurrentInstance();

const audio = new Audio();

const {text, isSupported, copy} = proxy.useClipboard();

const goTo = useGoTo()

const isLoading = ref(true)
const scrollTargetAnimation = ref('');

const audioSearchList = computed(() => {
  let newAudioList = [...cloneDataStore.audioCloneTemplateCustom, ...cloneDataStore.audioCloneTemplatePlatform, ...cloneDataStore.audioCloneTemplatePublic]
  newAudioList.forEach((element, index) => {
    element['searchId'] = proxy.trimSpecial(element.name)
  });
  return newAudioList
});

const cloneModelStore = useCloneModelStore();
const cloneDataStore = useCloneDataStore();

const voiceCloneModelList = computed(() => cloneModelStore.voiceCloneModel);

const audioCloneTemplateCustomList = computed(() => cloneDataStore.audioCloneTemplateCustom);
const audioCloneTemplatePublicList = computed(() => cloneDataStore.audioCloneTemplatePublic);
const audioCloneTemplatePlatformList = computed(() => cloneDataStore.audioCloneTemplatePlatform);


/* 获取公共tts声音模型 */
async function getList() {
  isLoading.value = true
  // status：0代表排队中，1是正在生成，2是生成完成，4是失败
  await cloneDataStore.getAudioCloneTemplateCustoms()
  await cloneDataStore.getAudioCloneTemplatePlatform()
  await cloneDataStore.getAudioCloneTemplatePublics()
  isLoading.value = false
}

/* 获取声音克隆模式 */
function getVoiceCloneModels() {
  cloneModelStore.getVoiceCloneModel().then()
}

/* 播放音频 */
function playAudio(url) {
  audio.src = url;
  audio.play();
}

/* 删除音频克隆任务项 */
async function delAudioCloneTask(id) {
  const delAudioCloneRes = await delAudioClone({id});
  if (delAudioCloneRes.code === 200) {
    getList()
    proxy.$modal.msgSuccess(delAudioCloneRes.message);
  }
}

/* 下载音频 */
function downloadsAudio(audioUrl) {
  proxy.download(audioUrl, `audio_clone_${new Date().getTime()}.mp3`);
}

/* 复制地址 */
function copyUrl(audioUrl) {
  // http 或 https 判断复制是否可用
  if (navigator.clipboard) {
    // https
    copy(audioUrl);
  } else {
    // http **已弃用API临时解决方式
    const input = document.createElement('input');
    input.setAttribute('value', audioUrl);
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
  }
  proxy.$modal.msgSuccess('链接已复制到剪贴板');
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

/* 滚动到指定位置 */
function handelScrollTarget(name) {
  const options = {
    container: '#goto-container-example',
    duration: 900,
    easing: 'easeInOutQuad',
    offset: -300,
  }
  goTo(`#audio-${name}`, options).then((scrollTop) => {
    scrollTargetAnimation.value = `audio-${name}`;
    let timer = setTimeout(() => {
      scrollTargetAnimation.value = "";
      clearTimeout(timer)
    }, 2200)
  })
}

onBeforeUnmount(() => {
  // 组件销毁前，确保释放Audio实例占用的资源  
  URL.revokeObjectURL(audio.src);
})


getList()
getVoiceCloneModels()
</script>
