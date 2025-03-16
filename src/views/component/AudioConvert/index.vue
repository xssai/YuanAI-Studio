<template>
  <v-container fluid class="py-0 px-0 pt-3">
    <!-- v-if="audioUrl == ''" -->
    <v-row no-gutters>
      <v-col>
        <p class="text-subtitle-2 font-weight-bold mb-3">音频</p>
        <v-file-upload v-model="audio_files" accept="audio/*" :disabled="isLoading" icon="mdi-plus" density="compact" variant="compact" clearable title="拖拽或点击上传" show-size></v-file-upload>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <div class="text-subtitle-2 font-weight-bold mb-3">转换格式</div>
        <v-select v-model="targetFormat" density="compact" prepend-inner-icon="mdi-music-note-outline" 
        variant="outlined" prefix="目标格式：" 
          :items="['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a']"></v-select>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col>
        <p class="text-subtitle-2 font-weight-bold ">搜索结果</p>
      </v-col>
    </v-row>

    <v-row dense align="center">
      <v-col align-self="center">
        <div v-if="audioUrl" class="d-flex align-center">
          <v-icon color="success" icon="mdi-check-circle-outline" size="32"></v-icon>
          <p class="text-button ml-1">转换音频格式成功</p>
        </div>

        <div v-else class="d-flex align-center">
          <v-icon color="info" icon="mdi-progress-question" size="32"></v-icon>
          <p class="text-button  ml-1">暂无转换音频</p>
        </div>
      </v-col>
    </v-row>

    <v-row no-gutters justify="space-around" align="center">
      <v-col cols="auto">
        <v-btn variant="plain" prepend-icon="mdi-video-4k-box"
          @click="playAudio(audioUrl)" :disabled="!audioUrl">播放</v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn variant="plain" prepend-icon="mdi-tray-arrow-down" v-tooltip:bottom="downloadTips"
          @click="download" :disabled="!audioUrl" :loading="downLoading">下载</v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn variant="plain" prepend-icon="mdi-content-copy" :disabled="!audioUrl"
          @click="copyUrl">复制链接</v-btn>
      </v-col>
    </v-row>

    <v-row  align="center" justify="center">
      <v-col cols="auto">
        <v-btn variant="flat" prepend-icon="mdi-music-box-outline" :loading="isLoading" color="light_custom_blue_2"
          @click="postAudioConvertFun">开始转换</v-btn>
      </v-col>
    </v-row>


    <!-- <v-row class="mt-5">
      <v-col class="d-flex justify-center align-center">
        <v-icon icon="mdi-music-box-multiple" color=""></v-icon>
        <v-card class="ml-5 pr-12 pa-2" variant="outlined" rounded="xl">
          <div class="d-flex align-center">
            <v-btn :icon="audioPlayer && !audioPlayer.paused ? 'mdi-stop' : 'mdi-play'" size="x-small" class="ml-2"
              @click.stop="playAudio(audioUrl)"></v-btn>
            <div class="ml-3">{{ targetFormat }}格式音频</div>
          </div>
        </v-card>
      </v-col>
    </v-row> -->
    <!-- <v-row class="mt-5">
      <v-col class="d-flex justify-center" cols="6">
        <v-btn variant="flat" size="small" @click="audioUrl = ''">返回修改</v-btn>
      </v-col>
      <v-col class="d-flex justify-center" cols="6">
        <v-btn variant="flat" size="small" prepend-icon="mdi-tray-arrow-down" :loading="downLoading"
          color="blue-lighten-1" v-tooltip:bottom="downloadTips" @click="downloadFun">下载</v-btn>
      </v-col>
    </v-row> -->

  </v-container>
</template>

<script setup>
import { postAudioConvert } from '@/api/sheet/AudioRequset'

const { proxy } = getCurrentInstance();

const { text, isSupported, copy } = proxy.useClipboard();

const isLoading = ref(false)

const downloadTips = ref('Tips:如下载出错,请点击复制下载链接,用浏览器打开链接,点击鼠标右键,选择视频另存为,即可正常下载。')

const targetFormat = ref('mp3')

const audioUrl = ref('')
const audio_files = ref(null);

const downLoading = ref(false);
const audioPlayer = ref(null);

/* 上传方法 */
async function uploadFun(flie) {
  // 上传文件
  const urlRes = await proxy.sendUpload({ Body: flie, taskType: 'audio_convert', ContentType: 'audio/mp3' });
  return urlRes
}

/* 播放音频 */
function playAudio(fileOrUrl) {
  if (audioPlayer.value && !audioPlayer.value.paused) {
    stopAudio()
    return
  }

  if (typeof (fileOrUrl) == 'string') {
    audioPlayer.value = new Audio(fileOrUrl);
  } else {
    audioPlayer.value = new Audio(URL.createObjectURL(fileOrUrl));
  }
  audioPlayer.value.play()
}

/* 播放音频 */
function stopAudio() {
  if (audioPlayer.value) {
    audioPlayer.value.pause();
    audioPlayer.value.currentTime = 0;
    URL.revokeObjectURL(audioPlayer.value.src);
    audioPlayer.value = null;
  }
}

onBeforeUnmount(() => {
  // 组件销毁前，确保释放Audio实例占用的资源  
  stopAudio()
})

/* 音频格式转换 */
async function postAudioConvertFun() {
  try {
    stopAudio()
    if (!audio_files.value) {
      proxy.$modal.msgWarning('请先选择音频');
      return
    }

    isLoading.value = true;
    const audio_upload_url = await uploadFun(audio_files.value)
    const result = await postAudioConvert({ acodec: targetFormat.value, gen_type: 'convet', audio_url: audio_upload_url });

    if (result.code == 200) {
      audioUrl.value = result.data;
    } else {
      proxy.$modal.msgWarning(result.message);
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
    await proxy.download(audioUrl.value, `audio_${new Date().getTime()}.` + targetFormat.value);
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

  proxy.$modal.msgSuccess('视频链接已复制到剪贴板');
}

</script>
