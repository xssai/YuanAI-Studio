<template>
  <v-container class="px-0 py-0 pt-3" fluid>
    <v-form ref="photoHumansRef">
      <v-row>
        <v-col>
          <p class="text-subtitle-2 font-weight-bold mb-3">提示词</p>
          <v-textarea v-model="message" :disabled="isLoading" :rules="photoHumanRules.message" clear-icon="mdi-close-circle"
                      clearable
                      counter="500" density="compact" no-resize placeholder="请输入提示词" rows="8"
                      variant="outlined"></v-textarea>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <p class="text-subtitle-2 font-weight-bold mb-3">人像图片</p>
          <v-file-upload v-model="img_files" :disabled="isLoading" accept="image/png" clearable density="compact"
                         icon="mdi-plus" show-size title="拖拽或点击上传" variant="compact"></v-file-upload>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <div class="text-medium-emphasis text-subtitle-2 pa-2">
            <span class="font-weight-bold">注意：</span>
            图像格式仅支持PNG，大小限制为50MB。纵横比例需要小于1:4或4:1。
          </div>
        </v-col>
      </v-row>

      <v-row align="center" justify="center">
        <v-col cols="auto">
          <v-btn :disabled="isLoading" :loading="isLoading" color="light_custom_blue_2" prepend-icon="mdi-video-account"
                 variant="flat" @click="addPhotoHumans">开始生成
          </v-btn>
        </v-col>
      </v-row>
    </v-form>

  </v-container>
</template>

<script setup>
import {addPhotoHuman, getPhotoHuman} from '@/api/sheet/PhotoHuman'

const {proxy} = getCurrentInstance();

const isLoading = ref(false);

const img_files = ref(null)

const photoHumanRules = ref({
  message: [v => !!v || "提示词不能为空", v => (v && v.length <= 500) || '提示词必须不超过500个字符'],
});

const params = reactive({
  message: null,
  gen_type: 'image_video',
  image_url: null
})

const {message, image_url} = toRefs(params);

async function addPhotoHumans() {
  const {valid} = await proxy.$refs.photoHumansRef.validate();
  if (valid) {
    isLoading.value = true;

    // 音频驱动上传（只有音频驱动模式才会执行）
    if (img_files.value) {
      // 上传
      image_url.value = await proxy.sendUpload({
        Body: img_files.value,
        taskType: 'photo-human',
        ContentType: 'image/png'
      });
      const res = await addPhotoHuman(params);
      if (res.code === 200) {
        proxy.$modal.msgSuccess(res.message);
        isLoading.value = false;
      }
    } else {
      proxy.$modal.msgWarning("请根据注意事项上传人像图片！");
    }
  }


}

</script>
