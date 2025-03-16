<template>
  <v-container class="py-0 px-0 pt-3" fluid>
    <v-row no-gutters>
      <v-col>
        <div class="text-subtitle-2 font-weight-bold mb-3">降噪音频</div>
        <v-file-upload v-model="audioFiles" :disabled="isLoading" accept="audio/*" clearable density="compact"
                       icon="mdi-plus" show-size title="拖拽或点击上传" variant="compact"></v-file-upload>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <p class="text-subtitle-2 font-weight-bold ">降噪结果</p>
      </v-col>
    </v-row>

    <v-row align="center" dense>
      <v-col align-self="center">
        <div v-if="audioUrl" class="d-flex align-center">
          <v-icon color="success" icon="mdi-check-circle-outline" size="32"></v-icon>
          <p class="text-button ml-1">转换音频格式成功</p>
        </div>

        <div v-else class="d-flex align-center">
          <v-icon color="info" icon="mdi-progress-question" size="32"></v-icon>
          <p class="text-button  ml-1">暂无降噪音频(选择音频上传后开始降噪)</p>
        </div>
      </v-col>
    </v-row>

    <v-row align="center" justify="space-around" dense>
      <v-col cols="auto">
        <v-btn :disabled="!Boolean(audioUrl)" prepend-icon="mdi-video-4k-box" variant="plain"
               @click="playAudio">播放
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn :disabled="!Boolean(audioUrl)" :loading="downLoading" prepend-icon="mdi-tray-arrow-down"
               variant="plain" @click="download">下载
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn :disabled="!Boolean(audioUrl)" prepend-icon="mdi-content-copy" variant="plain" @click="copyUrl">复制</v-btn>
      </v-col>
    </v-row>

    <v-row align="center" justify="center">
      <v-col cols="auto">
        <v-btn :loading="isLoading" color="light_custom_blue_2" prepend-icon="mdi-music-box-outline" variant="flat"
               @click="postAudioDenoiseFun">一键降噪
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import {postAudioConvert} from '@/api/sheet/AudioRequset'

const audio = new Audio();

const {proxy} = getCurrentInstance();

const {text, isSupported, copy} = proxy.useClipboard();

const isLoading = ref(false)

const audioUrl = ref('')
const audioFiles = ref(null)

const downLoading = ref(false)

/* 音频格式转换 */
async function postAudioDenoiseFun() {
  try {
    clearAudio()
    if (!audioFiles.value) {
      proxy.$modal.msgWarning('请先选择音频');
      return
    }

    isLoading.value = true;
    const audioUrlRes = await proxy.sendUpload({
      Body: audioFiles.value,
      taskType: 'video_replaceface',
      ContentType: 'image/png'
    });
    const result = await postAudioConvert({acodec: 'mp3', gen_type: 'denoise', audio_url: audioUrlRes});

    if (result.code === 200) {
      audioUrl.value = result.data;
    }
    isLoading.value = false;

  } catch {
    isLoading.value = false;
  }
}

/* 下载 */
async function download() {
  try {
    downLoading.value = true;
    await proxy.download(audioUrl.value, `audio_${new Date().getTime()}.mp3`);
    downLoading.value = false;
  } catch {
    downLoading.value = false;
  }
}

/* 复制视频链接 */
function copyUrl() {
  // http 或 https 判断复制是否可用
  if (navigator.clipboard) {
    // https
    copy(audioUrl.value);
  } else {
    // http **已弃用API临时解决方式
    const input = document.createElement('input');
    input.setAttribute('value', audioUrl.value);
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
  }

  proxy.$modal.msgSuccess('音頻链接已复制到剪贴板');
}

/* 播放音频 */
function playAudio() {
  audio.src = audioUrl.value;
  audio.play();
}

/* 清除音頻 */
function clearAudio() {
  audio.src = "";
}

onBeforeUnmount(() => {
  // 组件销毁前，确保释放Audio实例占用的资源
  clearAudio()
})

</script>
