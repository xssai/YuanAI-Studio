<template>
  <v-container class="px-0 py-0 pt-3" fluid>
    <v-form ref="writVideosRef">
      <v-row>
        <v-col>
          <p class="text-subtitle-2 font-weight-bold mb-3">提示词</p>
          <v-textarea v-model="message" :disabled="isLoading" :rules="WritVideoRules.message" clear-icon="mdi-close-circle"
                      clearable
                      counter="500" density="compact" no-resize placeholder="请输入提示词" rows="8"
                      variant="outlined"></v-textarea>
        </v-col>
      </v-row>

      <v-row align="center">
        <v-col>
          <v-select v-model="video_style" density="compact"
                    variant="outlined" item-title="title"  item-value="value" hide-details
                    :items="[{title: '真人',value: 'general'},{title: '动漫',value: 'anime'}]">
            <template v-slot:prepend>
              <p class="text-subtitle-2 font-weight-bold">视频风格</p>
            </template>
          </v-select>
        </v-col>
      </v-row>

      <v-row align="center" justify="center">
        <v-col cols="auto">
          <v-btn :disabled="isLoading" :loading="isLoading" color="light_custom_blue_2" prepend-icon="mdi-video-account"
                 variant="flat" @click="addWritVideos">开始生成
          </v-btn>
        </v-col>
      </v-row>
    </v-form>

  </v-container>
</template>

<script setup>
import {addWritVideo, getWritVideo} from '@/api/sheet/WritVideo'

const {proxy} = getCurrentInstance();

const isLoading = ref(false);


const WritVideoRules = ref({
  message: [v => !!v || "提示词不能为空", v => (v && v.length <= 500) || '提示词必须不超过500个字符'],
});

const params = reactive({
  message: null,
  gen_type: 'text_video',
  video_style: 'general'  //视频风格 text_video才会用  general 普通 / anime 动画
})

const {message, video_style} = toRefs(params);

async function addWritVideos() {
  const {valid} = await proxy.$refs.writVideosRef.validate();
  if (valid) {
    isLoading.value = true;
    const res = await addWritVideo(params);
    if (res.code === 200) {
      proxy.$modal.msgSuccess(res.message);
      isLoading.value = false;
    }
  }


}

</script>
