<template>
  <v-container fluid class="px-0 py-0 pt-3">
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
    <v-row v-if="modeType==='long_link'">
      <v-col>
        <!--        <p class="text-subtitle-2 font-weight-bold mb-3">分享链接</p>-->
        <v-textarea v-model="audio_Url" row-height="7" rows="7" persistent-placeholder persistent-counter counter="600"
                    clearable clear-icon="mdi-close-circle" variant="outlined" :disabled="isLoading"
                    placeholder="输入以http或https开头音频源地址"></v-textarea>
      </v-col>
    </v-row>
    <v-row v-else-if="modeType==='local_link'">
      <v-col>
        <!--        <div class="text-subtitle-2 font-weight-bold mb-3">文案音频</div>-->
        <v-file-upload v-model="audio_files" accept="audio/*" :disabled="isLoading" icon="mdi-plus" density="compact"
                       variant="compact" clearable title="拖拽或点击上传" show-size></v-file-upload>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="auto">
        <v-btn :loading="isLoading" :disabled="isLoading" variant="flat" color="light_custom_blue_2"
               prepend-icon="mdi-file-tree" @click="getWriting">一键提取
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="text-subtitle-2 font-weight-bold mb-3">提取结果</div>
        <v-textarea v-model="audioWritingRes" row-height="7" rows="7" persistent-placeholder persistent-counter counter
                    clearable density="compact" clear-icon="mdi-close-circle" variant="outlined" :disabled="isLoading"
                    placeholder="文案提取结果"></v-textarea>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="auto">
        <v-btn :disabled="!Boolean(audioWritingRes)" variant="tonal"  prepend-icon="mdi-content-copy" color="light_custom_blue_2" @click="copyWriting">复制文案
        </v-btn>
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup>
import {isHttp} from '@/utils/validate'
import {postAudioToText} from '@/api/sheet/AudioToText'

const {proxy} = getCurrentInstance();
const {text, isSupported, copy} = proxy.useClipboard();

const isLoading = ref(false);

const audioWritingRes = ref('');
const audio_files = ref(null);
const audio_Url = ref("");

const modeType = ref("long_link");
const extractModeList = ref([
  {
    id: 1,
    model: "long_link",
    details: "音频源地址"
  },
  {
    id: 2,
    model: "local_link",
    details: "本地上传"
  }
])

/* 提取文案 */
async function getWriting() {
  try {
    isLoading.value = true;

    if (modeType.value === 'long_link') {

      if (audio_Url.value) {

        if (isHttp(audio_Url.value)) {
          const result = await postAudioToText({url: audio_Url.value});
          if (result.code == 200) {
            audioWritingRes.value = result.data;
          } else {
            proxy.$modal.msgWarning(result.message);
          }
          isLoading.value = false;
        } else {
          proxy.$modal.msgWarning('音频源地址必须以http或https开头');
          return
        }

      } else {
        proxy.$modal.msgWarning('音频源地址不能为空');
        return
      }

    } else if (modeType.value === "local_link") {
      if (!audio_files.value) {
        proxy.$modal.msgWarning('请先选择音频');
        return
      }
      audio_Url.value = await proxy.sendUpload({
        Body: audio_files.value,
        taskType: 'audio_convert',
        ContentType: 'audio/mp3'
      });
      const result = await postAudioToText({url: audio_Url.value});
      if (result.code == 200) {
        audioWritingRes.value = result.data;
      } else {
        proxy.$modal.msgWarning(result.message);
      }
      isLoading.value = false;
    }

  } catch {
    isLoading.value = false;
  }
}

/* 复制提取文案 */
function copyWriting() {
  // 去除富文本标签
  const result = audioWritingRes.value.replace('<h3>提取文案</h3>', '').replace(/<\/?.+?\/?>/g, '');
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

</script>
