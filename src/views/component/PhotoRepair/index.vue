<template>
  <v-container fluid class="px-0 py-0 pt-3">
    <v-form ref="photoRepairRef">
      <v-row>
        <v-col>
          <p class="text-subtitle-2 font-weight-bold mb-3">修复图片</p>
          <v-file-upload v-model="isFiles" accept="image/*" :rules="photoRepairRules.isFiles" :disabled="isLoading" icon="mdi-plus" density="compact" variant="compact" clearable title="拖拽或点击上传" show-size></v-file-upload>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-tooltip>
            <template v-slot:activator="{ props }">
              <p v-bind="props" class="text-caption">哪些照片可以“智能修复”？</p>
            </template>
            <div>
              <p class="text-caption">1.老照片、网络图片、风景图片</p>
              <p class="text-caption">2.照片较为模糊，五官轮廓可辨别</p>
              <p class="text-caption">3.无严重破损或污迹遮挡</p>
              <p class="text-caption">4.照片无反光炫光</p>
              <p class="text-caption">5.无残缺、无明显折痕</p>
            </div>
          </v-tooltip>
        </v-col>
      </v-row>

      <v-row dense>
        <v-col>
          <v-tooltip>
            <template v-slot:activator="{ props }">
              <p v-bind="props" class="text-caption">上传图片要求有哪些？</p>
            </template>
            <p class="text-caption">1. 表情自然，脸部尽量居中，最好不要太多人脸，人脸面部越大生成效果越自然</p>
            <p class="text-caption">2. 禁止使用政治、恐怖、色情等敏感内容</p>
            <p class="text-caption">3. 违规者将被封禁账户，望知悉！</p>
          </v-tooltip>
        </v-col>
      </v-row>

      <v-row justify="center" align="center">
        <v-col cols="auto">
          <v-btn :class="{ 'steps-eight-add-compoment-photo-fix-task': guide }" variant="flat" :loading="isLoading"
            prepend-icon="mdi-wrench-clock" color="light_custom_blue_2" v-tooltip:bottom="uploadTips"
            @click="addPhotoRepairTask">开始修复</v-btn>
        </v-col>
      </v-row>

    </v-form>
  </v-container>
</template>

<script setup>
import { addPhotoRepair, getPhotoRepair, delPhotoRepair } from '@/api/sheet/PhotoRepair'

const { proxy } = getCurrentInstance();
const { text, isSupported, copy } = proxy.useClipboard();

const props = defineProps({
  guide: {
    type: Boolean
  }
})

const uploadTips = ref('推荐上传常用的 png、jpeg 图片格式');
const isLoading = ref(false);

const isFiles = ref(null);
const localImgUrl = ref('');

const data = reactive({
  pageNum: null,
  pageSize: 50,
  photoRepairList: []
})

const { pageNum, pageSize, photoRepairList } = toRefs(data);

const photoRepairRules = ref({
  isFiles: [v => !!v.length || "请选择图片再开始图片修复"]
});

/* 创建图片修复任务 */
async function addPhotoRepairTask() {
  const { valid } = await proxy.$refs.photoRepairRef.validate();
  if (valid) {
    isLoading.value = true;
    // 上传图片
    const urlRes = await proxy.sendUpload({ Body: isFiles.value, taskType: 'photo_repair', ContentType: 'image/png' });

    const params = {
      gen_type: 'gfp',
      imgurl: urlRes
    }

    const addPhotoRepairRes = await addPhotoRepair(params);

    if (addPhotoRepairRes.code == 200) {
      proxy.$modal.msgSuccess(addPhotoRepairRes.message);
    } else {
      proxy.$modal.msgWarning(addPhotoRepairRes.message);
    }

    isLoading.value = false;

    reset();

  }

}

/* 初始化图片修复默认值 */
function reset() {
  proxy.$refs.photoRepairRef.reset();
  isFiles.value = null;
  localImgUrl.value = '';
  // URL.revokeObjectURL(src);  不需要就执行释放，除非关闭组件，否则常驻 document
  URL.revokeObjectURL(localImgUrl.value);
}
</script>
