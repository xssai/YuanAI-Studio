<template>
  <v-container fluid class="px-0 py-0 pt-3">
    <v-form ref="audioCloneRef">
      <v-row>
        <v-col>
          <p class="text-subtitle-2 font-weight-bold mb-3">克隆模式</p>
          <v-select prepend-inner-icon="mdi-vector-radius" rounded="md" v-model="select_model" tile density="compact" variant="outlined" :items="voiceCloneModelList" hide-details item-title="details" item-value="model"
:loading="isLoading" :disabled="isLoading" :rules="audioCloneRules.select_model">
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props" :subtitle="item.raw.model + '模式'"></v-list-item>
            </template>
          </v-select>
        </v-col>
      </v-row>

      <v-row v-if="select_model === 'v1' || select_model === 'v3' || select_model === 'v5'">
        <v-col>
          <v-tooltip text="Tooltip">
            <template v-slot:activator="{ props }">
              <p v-bind="props" class="text-subtitle-2 font-weight-bold mb-3">
                <span class="text-red">*</span>
                精确克隆声音素材（{{voiceSelectModelDesc()}}）
              </p>
            </template>
            <p class="text-subtitle-2">参考音频文件上传要求：</p>
            <p class="text-caption">需要上传{{voiceSelectModelDesc()}}}的音频文件，</p>
            <p class="text-caption">需要确保音频优质，</p>
            <p class="text-caption">声音克隆整体的效果风格，</p>
            <p class="text-caption">会以参考音频的效果为准。</p>
          </v-tooltip>
          <v-file-upload v-model="cloneAddressFile" icon="mdi-plus" density="compact" accept="audio/*" variant="compact" clearable title="拖拽或点击上传"></v-file-upload>
        </v-col>
      </v-row>

      <v-row v-if="select_model === 'v1'">
        <v-col>
          <v-tooltip text="Tooltip">
            <template v-slot:activator="{ props }">
              <p v-bind="props" class="text-subtitle-2 font-weight-bold mb-3">参考音色（6-10秒）</p>
            </template>
            <p class="text-subtitle-2">声音克隆训练音频上传要求：</p>
            <p class="text-caption">{{ voiceSelectModelDesc() }}</p>
            <p class="text-caption">用于声音克隆训练的音频，</p>
            <p class="text-caption">整体的音色克隆会以克隆音频的效果为准，</p>
            <p class="text-caption">需要确保发音正确，停顿自然。</p>
          </v-tooltip>
          <v-file-upload v-model="referAudioFile" :disabled="isLoading" :rules="audioCloneRules.cloneAddressFile" icon="mdi-plus" accept="audio/*" density="compact" variant="compact" clearable title="拖拽或点击上传" show-size></v-file-upload>
        </v-col>
      </v-row>



      <v-row>
        <v-col>
          <p class="text-subtitle-2 font-weight-bold mb-3">声音名称</p>
          <v-text-field v-model="name" placeholder="请为您的声音命名" prepend-inner-icon="mdi-rename-outline" density="compact" variant="outlined" :loading="isLoading" :disabled="isLoading" :rules="audioCloneRules.name"></v-text-field>
        </v-col>
      </v-row>

    </v-form>

    <v-spacer class="mt-3"></v-spacer>

    <v-tooltip>
      <template v-slot:activator="{ props }">
        <v-row dense>
          <v-col>
            <p v-bind="props" class="text-caption">音频文件录音者有哪些要求?</p>
          </v-col>
        </v-row>
      </template>
      <p class="text-caption">1. 录制时的语气和情感也会被克隆，请按日常拍摄口播视频的状态进行录制</p>
      <p class="text-caption">2. 确保录制过程断句自然、吐字清晰、保持匀速（不要忽快忽慢）</p>
      <p class="text-caption">3. 确保声音录制过程中保持无室内回音、无他人干扰等情况</p>
      <p class="text-caption">4. 发音尽量清晰准确，无错读、无连读、无口误、无过多语气词情况</p>
      <p class="text-caption">5. 与麦克风保持 2～3 拳距离，无喷麦、无口水音等情况</p>
      <p class="text-caption">6. 录音过程中，确保没有翻纸或其余杂音，保持环境安静</p>
      <p class="text-caption">7. 精确克隆录制 3 分钟以上，10 分钟以内的音频，训练效果更佳</p>
    </v-tooltip>

    <v-row justify="center" align="center">
      <v-col cols="auto">
        <v-btn variant="flat" :loading="isLoading" :disabled="isLoading" prepend-icon="mdi-account-tie-voice-outline"
          color="light_custom_blue_2" @click="addPhotoRepairTask">立即克隆</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { addAudioClone } from '@/api/sheet/AudioClone'
import useCloneModelStore from '@/store/modules/cloneModel'

const { proxy } = getCurrentInstance();

const cloneAddressFile = ref(null);
const referAudioFile = ref(null);

const cloneModelStore = useCloneModelStore();

const voiceCloneModelList = computed(() => cloneModelStore.voiceCloneModel);

const isLoading = ref(false);

const params = reactive({
  clone_address: null, // 精确
  name: "",
  clone_type: 'clone_voice',
  refer_audio: null, // 参考
  select_model: 'v3'
})

const { clone_address, name, refer_audio, select_model } = toRefs(params);

const audioCloneRules = ref({
  name: [v => !!v || "请为声音克隆命名"],
  select_model: [v => !!v || "请选择克隆模式"],
  cloneAddressFile: [v => !!v.length || "请先上传参考音色"]
});

/* 创建声音克隆任务 */
async function addPhotoRepairTask() {
  const { valid } = await proxy.$refs.audioCloneRef.validate();
  if (valid) {
    isLoading.value = true;

    // 开始任务
    try {
      // 上传口播音频
      const cloneAddressRes = await proxy.sendUpload({ Body: cloneAddressFile.value, taskType:'audio_voice_clone', ContentType:'audio/mpeg'});
      clone_address.value = cloneAddressRes;

      // 参考音色v1才上传
      if (select_model.value === 'v1' && referAudioFile.value) {
        const referAudioRes = await proxy.sendUpload({ Body: referAudioFile.value, taskType:'audio_voice_clone', ContentType:'audio/mpeg'});
        refer_audio.value = referAudioRes;
      }

      const addAudioCloneRes = await addAudioClone(params);
      if (addAudioCloneRes.code === 200) {
        proxy.$modal.msgSuccess(addAudioCloneRes.message);
      }
    } catch {
      isLoading.value = false;
    }

    isLoading.value = false;
    reset();
  }
}

/* 获取声音克隆模式 */
function getVoiceCloneModels() {
  cloneModelStore.getVoiceCloneModel();
}

/* 初始化声音克隆信息 */
function reset() {
  proxy.$refs.audioCloneRef.reset();
  select_model.value = 'v1';
  clone_address.value = null;
  refer_audio.value = null;
}

/* 添加形象模板根据模式显示对应描述 */
function voiceSelectModelDesc() {
  let audio_desc = '';
  voiceCloneModelList.value.some((item) => {
    console.log(item);
    if (item.model === select_model.value) {
      audio_desc = `${item.min >= 60? item.min / 60+'分钟' : item.min+'秒'}-${item.max >= 60? item.max / 60+'分钟': item.max+'秒'}`
      return
    }
  })
  return audio_desc
}

getVoiceCloneModels();

</script>