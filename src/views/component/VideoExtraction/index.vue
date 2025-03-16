<template>
  <v-container fluid class="px-0 py-0 pt-3 h-100">
    <v-form ref="VideoExtraction">
      <v-row no-gutters>
        <v-col>
          <p ref="TemplateTipsRef" class="text-subtitle-2 font-weight-bold mb-3">视频链接</p>
          <v-textarea :rules="extractionRules.isShareUrl" v-model="isShareUrl" density="compact"
            clear-icon="mdi-close-circle" variant="outlined" prepend-inner-icon="mdi-link-variant"
            placeholder="示例:5.87 03/22 r@E.Uy seo:/仿佛像是在电影里，一切都那么不真实，打开Dou音搜索，直接观看视频！" clearable rows="4"
            :loading="isLoading" :disabled="isLoading"></v-textarea>
        </v-col>
      </v-row>
    </v-form>

    <v-row no-gutters >
      <v-col>
        <v-tooltip>
          <template v-slot:activator="{ props }">
            <p v-bind="props" class="text-caption">
              1. 如何下载视频号视频?
            </p>
          </template>

          <v-img width="480" src="https://ai-workbench.eos-dongguan-7.cmecloud.cn/course/photo/zkuai.jpg"
            draggable="false"></v-img>
        </v-tooltip>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <p ref="TemplateTipsRef" class="text-subtitle-2 font-weight-bold">解析结果</p>
      </v-col>
    </v-row>

    <v-row dense align="center">
      <v-col align-self="center">
        <div v-if="videoUrl" class="d-flex align-center">
          <v-icon color="success" icon="mdi-check-circle-outline" size="32"></v-icon>
          <p class="text-button ml-1">解析成功</p>
        </div>

        <div v-else class="d-flex align-center">
          <v-icon color="info" icon="mdi-progress-question" size="32"></v-icon>
          <p class="text-button  ml-1">暂无资源(尝试重新获取或视频源已失效)</p>
        </div>

      </v-col>
    </v-row>

    <v-row no-gutters justify="space-around" align="center">
      <v-col cols="auto">
        <v-btn variant="plain" prepend-icon="mdi-video-4k-box" v-tooltip:bottom="downloadTips"
          @click="playerVideo(videoUrl)" :disabled="!videoUrl">播放</v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn variant="plain" prepend-icon="mdi-tray-arrow-down" :loading="downLoading" v-tooltip:bottom="downloadTips"
          @click="downloadVideo" :disabled="!videoUrl">下载</v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn variant="plain" prepend-icon="mdi-content-copy" :disabled="!videoUrl"
          @click="copyVideo">复制链接</v-btn>
      </v-col>
    </v-row>

    <v-row justify="center" align="center">
      <v-col cols="auto">
        <v-btn variant="flat" prepend-icon="mdi-content-copy" color="light_custom_blue_2" @click="getVideo"
          :loading="isLoading" :disabled="isLoading">立即提取</v-btn>
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup>
import { getVideoUrl } from '@/api/sheet/VideoExtraction'

import useVideoPlayerStore from "@/store/modules/videoPlayer"


const { proxy } = getCurrentInstance();

const { text, isSupported, copy } = proxy.useClipboard();

const videoPlayerStore = useVideoPlayerStore();

const isLoading = ref(false)
const isShareUrl = ref('')

const downloadTips = ref('Tips:如下载出错,请点击复制下载链接,用浏览器打开链接,点击鼠标右键,选择视频另存为,即可正常下载。')

const videoUrl = ref('')

const downLoading = ref(false);

const extractionRules = ref({
  isShareUrl: [v => !!v || "请先输入视频分享链接"]
});

/* 提取视频 */
async function getVideo() {
  const { valid } = await proxy.$refs.VideoExtraction.validate();
  if (valid) {
    try {
      videoUrl.value = '';
      isLoading.value = true;
      const result = await getVideoUrl({ url: isShareUrl.value });
      videoUrl.value = result.data.video_url;
      isLoading.value = false;
    } catch {
      isLoading.value = false;
      proxy.$modal.msgWarning('视频解析异常');
    }
  }
}

/* 下载视频 */
async function downloadVideo() {
  try {
    downLoading.value = true;
    await proxy.download(videoUrl.value, `video_${new Date().getTime()}.mp4`);
    downLoading.value = false;
  } catch {
    downLoading.value = false;
  }
}

/* 复制视频链接 */
function copyVideo() {
  // http 或 https 判断复制是否可用
  if (navigator.clipboard) {
    // https
    copy(videoUrl.value);
  } else {
    // http **已弃用API临时解决方式
    const input = document.createElement('input');
    input.setAttribute('value', videoUrl.value);
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
  }

  proxy.$modal.msgSuccess('视频链接已复制到剪贴板');
}

/* 播放视频 */
function playerVideo(videoUrl) {
  videoPlayerStore.openVideoWindow({ videoUrl });
}

</script>
