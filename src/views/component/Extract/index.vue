<template>
  <v-container fluid class="px-0 py-3">
    <v-row no-gutters align="center" justify="center">
      <v-col cols="auto">
        <v-btn-toggle v-model="modeType" color="light_custom_blue_2" rounded="xl" group density="compact" mandatory>
          <v-btn v-for="item in extractModeList" :key="item.id" :value="item.model" :disabled="isLoading">{{
              item.details
            }}
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <v-row v-if="modeType==='short_link'">
      <v-col>
        <!--        <p class="text-subtitle-2 font-weight-bold mb-3">分享链接</p>-->
        <v-textarea v-model="isShareUrl" row-height="7" rows="7" persistent-placeholder persistent-counter counter="600"
                    clearable clear-icon="mdi-close-circle" variant="outlined" :disabled="isLoading"
                    placeholder="输入需要提取文案的第三方平台视频分享链接；如：抖音、快手、微信视频号等"></v-textarea>
      </v-col>
    </v-row>
    <v-row v-else-if="modeType==='long_link'">
      <v-col>
        <!--        <p class="text-subtitle-2 font-weight-bold mb-3">分享链接</p>-->
        <v-textarea v-model="isShareUrl" row-height="7" rows="7" persistent-placeholder persistent-counter counter="600"
                    clearable clear-icon="mdi-close-circle" variant="outlined" :disabled="isLoading"
                    placeholder="输入以http或https开头视频源地址"></v-textarea>
      </v-col>
    </v-row>
    <v-row v-else-if="modeType==='local_link'">
      <v-col>
        <v-file-upload v-model="videoFile" :disabled="isLoading" accept="video/*" icon="mdi-plus" density="compact" variant="compact" clearable title="拖拽或点击上传" show-size></v-file-upload>
      </v-col>
    </v-row>

    <v-row justify="center" align="center">
      <v-col cols="auto">
        <v-btn variant="flat" :loading="isLoading" :disabled="isLoading" prepend-icon="mdi-file-tree"
               color="light_custom_blue_2" @click="getWriting">一键提取
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <p class="text-subtitle-2 font-weight-bold mb-3">提取结果</p>
        <v-textarea v-model="videoWritingRes" row-height="7" rows="7" counter persistent-placeholder persistent-counter
                    clear-icon="mdi-close-circle" variant="outlined" placeholder="文案提取结果"></v-textarea>
      </v-col>
    </v-row>
    <v-row no-gutters justify="center" align="center">
      <v-col cols="auto">
        <v-btn :disabled="!Boolean(videoWritingRes)" variant="tonal" prepend-icon="mdi-content-copy" color="light_custom_blue_2"
                @click="copyWriting">复制文案
        </v-btn>
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup>
import {isHttp} from '@/utils/validate'
import {setVideoText, getVideoText} from '@/api/sheet/Extract'

const {proxy} = getCurrentInstance();
const {text, isSupported, copy} = proxy.useClipboard();

let timer = null;

const isLoading = ref(false);
const isShareUrl = ref('');

const copyTips = ref('复制文案到剪贴板');

const videoFile = ref(null);
const modeType = ref("short_link");

const extractModeList = ref([
  {
    id: 1,
    model: "short_link",
    details: "分享链接"
  },
  {
    id: 2,
    model: "long_link",
    details: "视频源地址"
  },
  {
    id: 3,
    model: "local_link",
    details: "本地上传"
  }
])

const videoWritingRes = ref('');

/* 提取文案 */
async function getWriting() {
  try {

    videoWritingRes.value = '';
    isLoading.value = true;

    if (modeType.value === 'short_link') {
      if (isShareUrl.value) {
        await setVideoText({urls_list: [isShareUrl.value], link_type: modeType.value});
        getWritingPoll();
      } else {
        proxy.$modal.msgWarning('视频分享地址不能为空');
        return
      }
    } else if (modeType.value === 'long_link') {
      if (isShareUrl.value) {
        if (isHttp(isShareUrl.value)) {
          await setVideoText({urls_list: [isShareUrl.value], link_type: modeType.value});
          getWritingPoll();
        } else {
          proxy.$modal.msgWarning('视频源地址必须以http或https开头');
          return
        }
      } else {
        proxy.$modal.msgWarning('视频源地址不能为空');
        return
      }

    } else if (modeType.value === 'local_link') {
      const url = await proxy.sendUpload({ Body: videoFile.value, taskType: 'extract_video_text', ContentType: 'video/mp4' });
      await setVideoText({urls_list: [url], link_type: modeType.value});
      getWritingPoll();
    }


  } catch {
    isLoading.value = false;
  }
}

/* 视频文案提取任务短轮询 */
async function getWritingPoll() {
  try {
    let sign = true;
    let richText = '';
    timer = setInterval(async () => {
      const res = await getVideoText();
      // 0队列，1提取中，2提取完成
      if (res.data.status === 2) {
        clearInterval(timer);
        res.data.data.forEach((el, idx) => {
          el.success ? richText = richText + `视频${idx + 1}` + '\n' + `${el.result}` + '\n\n' : sign = false
        })
        videoWritingRes.value = richText;
        sign ? proxy.$modal.msgSuccess('视频文案提取已完成') : proxy.$modal.msgSuccess("视频文案提取结果为空")
        isLoading.value = false;
        return
      }
    }, 8000)

  } catch {
    // 接口异常捕获
    clearInterval(timer);
    isLoading.value = false;
  }
}

/* 复制提取文案 */
function copyWriting() {
  // 去除富文本标签
  const result = videoWritingRes.value.replace('<h3>视频', '').replace(/<\/?.+?\/?>/g, '');
  // http 或 https 判断复制是否可用
  if (navigator.clipboard) {
    // https
    copy(result);
  } else {
    // http **已弃用API临时解决方式
    const input = document.createElement('input');
    input.setAttribute('value', result);
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
  }

  proxy.$modal.msgSuccess('文案已复制');
}

onBeforeUnmount(() => {
  clearInterval(timer);
})

</script>
