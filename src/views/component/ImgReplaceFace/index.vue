<template>
  <v-container fluid class="px-0 py-0 pt-3">
    <v-row>
      <v-col>
        <p class="text-subtitle-2 font-weight-bold mb-3">人脸图片</p>
        <v-file-upload v-model="targetFiles" accept="image/*" :disabled="isLoading" icon="mdi-plus" density="compact" variant="compact" clearable title="拖拽或点击上传" show-size></v-file-upload>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <p class="text-subtitle-2 font-weight-bold mb-3">替换方式</p>
        <v-select v-model="select" density="compact"  hide-details :loading="isLoading" :disabled="isLoading"
          variant="outlined" prefix="替换人脸方式：" prepend-inner-icon="mdi-vector-radius" :items="selectModel"
          item-title="name" item-value="value">
          <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props" :subtitle="item.raw.desc"></v-list-item>
          </template>
        </v-select>
      </v-col>
    </v-row>

    <v-row v-if="select === 'v1'">
      <v-col>
        <v-dialog max-width="1270" location="center" @update:modelValue="templateDialogChange">
          <template v-slot:activator="{ props: activatorProps }">
            <p class="text-subtitle-2 font-weight-bold mt-3 mb-3">替换目标</p>
            <div v-if="exampleSelect.id" style="height:110px; position: relative;" class="overflow-hidden rounded">
              <div class="backgroud_Img_full" :style="{ 'background-image': `url(${exampleSelect.privew})` }"></div>
              <v-img v-bind="activatorProps" rounded="sm" draggable="false" :src="exampleSelect.privew"
                :lazy-src="exampleSelect.cover" height="100%"
                content-class="d-flex flex-column justify-end align-center">
                <p class="w-100 text-subtitle-1 font-weight-medium text-white text-center rounded-sm">{{
                  exampleSelect.modelname }}
                </p>
              </v-img>
            </div>

            <div v-else v-bind="activatorProps" class="rounded border d-flex align-center justify-center flex-column"
              style="height:110px;">
              <v-icon>mdi-plus</v-icon>
              <p class="text-body-2">选择预设替换目标人像</p>
            </div>

          </template>
          <template v-slot:default="{ isActive }">
            <v-card prepend-icon="mdi-hexagon-multiple-outline" title="选择模板">
              <v-card-text>
                <v-tabs v-model="exampleTab" align-tabs="center" color="deep-purple-accent-4">
                  <template v-for="item in faceTemplateList" :key="item.id">
                    <v-tab :value="item.type">{{ item.name }}</v-tab>
                  </template>
                </v-tabs>

                <v-tabs-window v-model="exampleTab">
                  <v-tabs-window-item v-for="items in faceTemplateList" :key="items.id" :value="items.type">
                    <v-item-group selected-class="bg-primary" mandatory v-model="exampleSelect">
                      <v-container fluid max-height="568" class="overflow-y-auto">
                        <v-row>
                          <v-col v-for="i in items.data" :key="i.id" cols="12" md="4">
                            <v-item v-slot="{ isSelected, toggle }" :value="i">
                              <v-img rounded="sm" draggable="false" @click="toggle" :src="i.privew" height="200" cover
                                content-class="d-flex flex-column justify-space-between align-end">
                                <v-btn density="comfortable" icon class="mt-2 mr-2">
                                  <v-icon v-if="isSelected" color="purple-lighten-1">mdi-heart</v-icon>
                                  <v-icon v-else>mdi-heart-outline</v-icon>
                                </v-btn>
                                <p class="w-100 text-h6 font-weight-medium text-white text-center"
                                  style="background-color: rgba(0, 0, 0, 0.3); backdrop-filter: blur(3px);">
                                  {{ i.modelname }}
                                </p>
                              </v-img>
                            </v-item>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-item-group>
                  </v-tabs-window-item>
                </v-tabs-window>
              </v-card-text>

              <template v-slot:actions>
                <v-btn @click="isActive.value = false" class="ml-auto" text="确认选择"></v-btn>
              </template>
            </v-card>
          </template>
        </v-dialog>
      </v-col>
    </v-row>

    <v-row v-else-if="select === 'v2'">
      <v-col>
        <p class="text-subtitle-2 font-weight-bold mb-3">替换目标</p>
        <v-file-input v-model="protoFiles" :show-size="1000" color="blue-lighten-2" variant="outlined" 
          density="compact" :disabled="isLoading" :loading="isLoading" label="自定义目标人像" accept="image/*"
          @click:clear="clearProtoImgChange" prepend-icon="">
          <template v-slot:selection="{ fileNames }">
            <template v-for="(fileName, index) in fileNames" :key="fileName">
              <v-chip class="me-2" color="deep-purple-accent-4" size="small" label>{{ fileName }}</v-chip>
            </template>
          </template>
        </v-file-input>
      </v-col>
    </v-row>

    <v-row align="center">
      <v-col cols="auto">
        <v-tooltip text="Tooltip">
          <template v-slot:activator="{ props }">
            <p v-bind="props" class="text-caption">如何使用换脸?</p>
          </template>
          <p class="text-subtitle-2">1.上传换脸图像</p>
          <p class="text-caption">选择你想要替换的脸部图像，启用换脸AI识别它。</p>
          <p class="text-subtitle-2 mt-2">2.选择原始图像或原始模板</p>
          <p class="text-caption">上传你想要修改的原始图像或原始模板</p>
          <p class="text-subtitle-2 mt-2">3.等待AI换脸</p>
          <p class="text-caption">让免费换脸AI技术处理AI头部替换</p>
          <p class="text-subtitle-2 mt-2">4.选择并下载你的合成图像</p>
          <p class="text-caption">选择你喜欢的合成图像并下载。</p>
        </v-tooltip>
      </v-col>
    </v-row>

    <v-row align="center" justify="center">
      <v-col cols="auto">
        <v-btn variant="flat" :loading="isLoading" prepend-icon="mdi-file-replace-outline"
        color="light_custom_blue_2" @click="addPhotoRepairTask">开始交换</v-btn>
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup>
import { addImgReplaceFace, getImgReplaceFaceTemplate, getImgReplaceFaceTask, delImgReplaceFace } from '@/api/sheet/ImgReplaceFace'
import { rate, translate } from '@/utils/match'

const { proxy } = getCurrentInstance();
const { text, isSupported, copy } = proxy.useClipboard();

const isLoading = ref(false);
const select = ref('v1');
const exampleTab = ref(null);


const targetFiles = ref(null);
const protoFiles = ref(null);
const localImgUrl = ref('');

const selectModel = ref([
  {
    name: '预设人像',
    value: 'v1',
    desc: '使用提供的人像模板作为替换目标'
  },
  {
    name: '自定义人像',
    value: 'v2',
    desc: '上传想要的人像模板作为替换目标'
  }
]);


const data = reactive({
  pageNum: null,
  pageSize: 10,
  total: 0,
  imgReplaceFaceList: [],
  faceTemplateList: [],
  exampleSelect: {}
})

const { pageNum, pageSize, total, exampleSelect, imgReplaceFaceList, faceTemplateList } = toRefs(data);

/* 创建AI换脸任务 */
async function addPhotoRepairTask() {
  if (!targetFiles.value) {
    proxy.$modal.msgWarning('请上传换脸图像');
    return
  }

  if (select.value == 'v1') {
    // 选择模板
    if (!exampleSelect.value.id) {
      proxy.$modal.msgWarning('请先上传原始模板');
      return
    }
  } else if (select.value == 'v2') {
    // 自定义图片
    if (!protoFiles.value) {
      proxy.$modal.msgWarning('请先上传原始图像');
      return
    }
  }
  isLoading.value = true;

  // 上传换脸图像
  const urlRes = await proxy.sendUpload({ Body: targetFiles.value, taskType: 'photo_repair', ContentType: 'image/png' });

  // 模板选择
  let templateId = null;
  let custom_url = null;

  if (select.value == 'v1') {
    // 选择模板 
    templateId = exampleSelect.value.id;
  } else if (select.value == 'v2') {
    // 自定义图片
    // 上传换脸图像
    custom_url = await proxy.sendUpload({ Body: protoFiles.value, taskType: 'photo_repair', ContentType: 'image/png' });
  }

  const params = {
    gen_type: 'image',
    img_url: urlRes,
    id: templateId,
    custom_url
  }

  const res = await addImgReplaceFace(params);

  if (res.code == 200) {
    proxy.$modal.msgSuccess(res.message);
  } else {
    proxy.$modal.msgWarning(res.message);
  }

  isLoading.value = false;

  reset();
}

/* 获取图片换脸模板 */
async function getImgReplaceFaceTemplates() {
  const res = await getImgReplaceFaceTemplate();
  faceTemplateList.value = res.data;
}


/* 清除自定义人脸模板图片 */
function clearProtoImgChange() {
  protoFiles.value = null;
  exampleSelect.value = {}
}

/* 获取图片换脸任务列表 */
async function getImgReplaceFaceTasks() {
  const parasm = {
    gen_type: 'image'
  }
  const res = await getImgReplaceFaceTask(parasm);
  console.log(res)
  // // status：0代表排队中，1是正在生成，2是生成完成，4是失败
  imgReplaceFaceList.value = res.data;
}


/* 初始化原始脸部图片默认值 */
function reset() {
  targetFiles.value = null;
  URL.revokeObjectURL(localImgUrl.value);
  localImgUrl.value = '';

  protoFiles.value = null;
  exampleSelect.value = {}
}

/* 模板窗口状态回调 */
function templateDialogChange(status) {
  if (status) return
  exampleTab.value = faceTemplateList.value[0].type || null;
}

getImgReplaceFaceTemplates();

</script>