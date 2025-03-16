<template>
    <v-layout class="w-100 h-100 border-t-sm">
      <v-navigation-drawer width="260" v-model="showMenuBar" color="transparent">
        <template v-slot:prepend>
          <v-list density="compact">
            <v-list-item title="个人知识库"></v-list-item>
          </v-list>
        </template>
        <v-list v-model:selected="isMenuType" mandatory lines="two" class="px-4">
          <v-list-item v-for="item in accountList" :value="`${item.id}`" :title="item.name" :prepend-avatar="item.userIcon" @click="() => {}" rounded>
            <template v-slot:append>
              <v-avatar :size="24">
                <v-img alt="John" :src="item.platformIcon"
                ></v-img>
              </v-avatar>
            </template>
          </v-list-item>
        </v-list>

        <template v-slot:append>
          <v-row no-gutters justify="center" align="center">
            <v-col cols="auto" md="auto">
              <v-sheet class="pa-2 ma-2" color="transparent">
                <v-btn>添加我的账号</v-btn>
              </v-sheet>
            </v-col>
          </v-row>
        </template>
      </v-navigation-drawer>

      <v-app-bar flat :absolute="true" height="70" class="px-2" color="transparent">
        <template v-slot:prepend>
          <v-app-bar-nav-icon @click="showMenuBar = !showMenuBar"></v-app-bar-nav-icon>
        </template>
        <v-row class="mx-2">
          <v-col cols="12" md="4">
            <v-combobox
                placeholder="搜索内容"
                :items="searchData"
                variant="outlined"
                hide-details
                hide-no-data
                density="comfortable"
            ></v-combobox>
          </v-col>
        </v-row>
        <v-btn prepend-icon="mdi-plus" variant="tonal" @click="isAddDialog = true">添加内容</v-btn>
      </v-app-bar>

      <v-main>
          <v-list lines="three" class="px-4" :style="{'height': resizeHeight + 'px'}" bg-color="transparent">
            <v-list-item @click="() => {}" class="mt-4" border rounded v-for="n in 6" :key="n">
              <template v-slot:title>
                <v-row align="center">
                  <v-col cols="6" md="8">
                    <p class="text-ellipsis-auto">月亮照耀着满地的六便士，我只知低头躬身前行，以为闪烁着光芒的，就是我的路，却忘了我也曾是个久久怅望着月亮的人</p>
                  </v-col>
                  <v-col cols="3" md="auto">
                    <v-btn variant="tonal" :ripple="false">docx</v-btn>
                  </v-col>
                  <v-col cols="3" md="auto">
                    <v-btn variant="tonal" :ripple="false">可用</v-btn>
                  </v-col>
                </v-row>
              </template>

              <p class="my-2 text-ellipsis text-body-2">月亮照耀着满地的六便士，我只知低头躬身前行，以为闪烁着光芒的，就是我的路，却忘了我也曾是个久久怅望着月亮的人。月亮照耀着满地的六便士，我只知低头躬身前行，以为闪烁着光芒的，就是我的路，却忘了我也曾是个久久怅望着月亮的人。月亮照耀着满地的六便士，我只知低头躬身前行，以为闪烁着光芒的，就是我的路，却忘了我也曾是个久久怅望着月亮的人。月亮照耀着满地的六便士，我只知低头躬身前行，以为闪烁着光芒的，就是我的路，却忘了我也曾是个久久怅望着月亮的人。</p>

              <v-list-item-action>
                <v-row dense justify="space-between" align="center">
                  <v-col cols="12" md="auto">
                    <v-row justify="start" align="center">
                      <v-col cols="auto">
                        <p class="text-grey-darken-1">13299字</p>
                      </v-col>
                      <v-col cols="auto">
                        <p class="text-grey-darken-1">微信机器人</p>
                      </v-col>
                      <v-col cols="auto">
                        <p class="text-grey-darken-1">2024-12-23 14:22:03</p>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" md="auto">
                    <v-row justify="end" align="center">
                      <v-col cols="auto">
                        <v-btn variant="text" icon="mdi-file-download-outline"></v-btn>
                      </v-col>
                      <v-col cols="auto">
                        <v-btn variant="text" icon="mdi-trash-can-outline"></v-btn>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>

              </v-list-item-action>
            </v-list-item>
          </v-list>
      </v-main>

      <v-dialog v-model="isAddDialog" max-width="750" location="center" persistent>
        <v-card title="添加内容">
          <v-card-text>
            <v-row no-gutters>
              <v-col>
                <v-radio-group inline v-model="radioType" color="light_custom_blue_2">
                  <v-radio v-for="item in radioTypeList" :label="item.name" :value="item.type"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
            <v-row no-gutters v-if="radioType === 'link'">
              <v-col>
                <v-form ref="useKeyRef">
<!--                  :rules="extractionRules.isShareUrl"-->
                  <v-textarea v-model="addUrl" density="compact" clear-icon="mdi-close-circle" variant="outlined" prepend-inner-icon="" placeholder="请输入链接，如有多个请使用“；”换行输入,以下为支持的链接类型示例：
快来免费领票！xx月26-30日 xxxxxxxxx x珍稀好茶免费品 https://v.douyin.com/iUpXpgk9/ 复制此链接，打开【x音短视频】，直接观看视频！" clearable rows="6" :loading="isAddLoading" :disabled="isAddLoading"></v-textarea>
                </v-form>
              </v-col>
            </v-row>
            <v-row no-gutters v-else-if="radioType === 'file'">
              <v-col cols="auto" md="auto">
<!--                <uppy-dashboard ref="uppyDashboardRef" :height="350" :uppyPlugins="['Url']" :allowedFileTypes="['.docx']"></uppy-dashboard>-->
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn text="取消" variant="plain" color="light_custom_blue_2" @click="handelCloseAddDialog"></v-btn>
            <v-btn text="确定" variant="flat" color="light_custom_blue_2" @click="handelAddSumbit"></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
</template>

<script setup>
import useAppStore from '@/store/modules/app'

const appStore = useAppStore();
const showMenuBar = ref(true);

const isMenuType = ref("0");
const addUrl = ref("");

const isAddDialog = ref(false);
const isAddLoading = ref(false);
const radioType = ref("file")

const resizeHeight = computed(() => {
  if (appStore.device === 'mobile') {
    // 移动端适配局部滚动
    return appStore.displayHeight - 96 - 82 - 13
  } else {
    // PC端适配局部滚动
    return appStore.displayHeight - 96 - 72
  }
})

const searchData = ref(['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming'])
const radioTypeList = ref([
  {
    name: "文件",
    type: "file"
  },
  {
    name: "链接",
    type: "link"
  }
])

const accountList = ref([]);

function mostData() {
  for (let i = 0; i < 12; i++) {
    accountList.value.push(
        {
          id: i,
          name: "我的文件",
          userIcon: "https://ai-workbench.eos-dongguan-7.cmecloud.cn/avatar/profile.jpg",
          platformIcon: "https://ai-workbench.eos-dongguan-7.cmecloud.cn/board/douyin.com.png_160x160.png"
        }
    )
  }
  console.log(accountList.value)
}

function handelCloseAddDialog() {
  isAddDialog.value = false
}

async function handelAddSumbit() {
  const resUrlList = await uppyDashboardRef.value.startUpload({taskType: 'repository_document', ContentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
  uppyDashboardRef.value.clearAllFile();
  console.log(resUrlList,"返回地址URL");
}

mostData();
</script>
