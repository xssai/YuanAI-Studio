<template>
  <div class="pa-4">
    <div class="d-flex align-center justify-start mb-2 pl-2">
      <span class="ml-2 text-subtitle-1">热门</span>
    </div>
    <v-row>
      <v-col cols="4" md="2" v-for="item in platformList" :key="item.id">
        <a :href="item.platform_url" target="_blank">
          <div class="pa-2">
            <div class="text-center">
              <v-avatar size="80" :image="item.img"></v-avatar>
            </div>
            <div class="text-subtitle-1 text-center text-truncate">{{ item.name }}</div>
            <div class="text-caption text-center text-truncate">{{ item.title }}</div>
          </div>
        </a>
      </v-col>
    </v-row>

    <v-row class="ma-3">
      <v-col cols="6" md="3">
        <a href="https://www.iambxs.com/" target="_blank">
          <v-img class="rounded" width="273" draggable="false"
            src="https://ai-workbench.eos-dongguan-7.cmecloud.cn/board/iam-iambxs.jpeg"></v-img>
        </a>
      </v-col>
      <v-col cols="6" md="3">
        <a href="https://www.iambxs.com/" target="_blank">
          <v-img class="rounded" width="273" draggable="false"
            src="https://file.ipadown.com/tophub/assets/images/sponsors/iam-irelaxapp.jpeg"></v-img>
        </a>
      </v-col>
      <v-col cols="6" md="3">
        <a href="https://www.iambxs.com/" target="_blank">
          <v-img class="rounded" width="273" draggable="false"
            src="https://file.ipadown.com/tophub/assets/images/sponsors/iam-icalendar.jpeg"></v-img>
        </a>
      </v-col>
    </v-row>


    <div class="py-2">
      <div class="d-flex align-center justify-start mb-2 pl-2">
        <span class="ml-2 text-subtitle-1">全网热卖榜</span>
      </div>
      <div class="px-4">
        <v-row>
          <v-col>
            <v-card width="360" class="px-3">
              <v-toolbar color="transparent">
                <template v-slot:prepend>
                  <v-avatar size="small"
                    image="https://ai-workbench.eos-dongguan-7.cmecloud.cn/board/bilibili.com.png_160x160.png"></v-avatar>
                </template>

                <v-toolbar-title class="text-h6" text="哔哩哔哩"></v-toolbar-title>

                <template v-slot:append>
                  <p class="text-body-2 text-grey-darken-2 font-weight-medium">会员购·今日上新</p>
                </template>

                <v-progress-linear :active="bilibiliLoading" :indeterminate="bilibiliLoading"
                  color="deep-purple-accent-4" absolute bottom></v-progress-linear>
              </v-toolbar>

              <v-divider class="mb-2"></v-divider>

              <v-card-text class="overflow-y-auto px-2 py-0 cursor-pointer" style="height: 320px;">
                <div v-for="(item, index) in boardBiliBiliBuyList" :key="item.id" class="d-flex mb-2">
                  <v-hover>
                    <template v-slot:default="{ isHovering, props }">
                      <div class="text-grey-darken-1">{{ index + 1 }}</div>
                      <a :href="item.itemUrlForH5" target="_blank"
                        :class="{ 'flex-fill': true, 'ml-4': true, 'text-deep-purple-lighten-1': isHovering }"
                        v-bind="props" v-ripple>
                        {{ item.name }}
                      </a>
                      <div class="flex-shrink-0 ml-2 text-grey-darken-2 text-caption">{{ item.preSaleTagName }}</div>
                    </template>
                  </v-hover>

                </div>
              </v-card-text>

              <v-divider class="mt-2"></v-divider>

              <v-card-actions>
                <div>
                  <span class="text-caption text-grey-darken-1">{{ calculateMinutesDifference(douyinUpdate_time)
                    }}分钟前</span>
                </div>
              </v-card-actions>

            </v-card>
          </v-col>


        </v-row>
      </div>
    </div>

    <div class="py-2 mt-6">
      <div class="d-flex align-center justify-start mb-2 pl-2">
        <span class="ml-2 text-subtitle-1">娱乐</span>
      </div>
      <div class="px-4">
        <v-row>
          <v-col md="4">
            <v-card width="360" class="px-3">
              <v-toolbar color="transparent">
                <template v-slot:prepend>
                  <v-avatar size="small"
                    image="https://ai-workbench.eos-dongguan-7.cmecloud.cn/board/douyin.com.png_160x160.png"></v-avatar>
                </template>

                <v-toolbar-title class="text-h6" text="抖音"></v-toolbar-title>

                <template v-slot:append>
                  <p class="text-body-2 text-grey-darken-2 font-weight-medium">抖音热门视频榜</p>
                </template>

                <v-progress-linear :active="bilibiliLoading" :indeterminate="bilibiliLoading"
                  color="deep-purple-accent-4" absolute bottom></v-progress-linear>
              </v-toolbar>

              <v-divider class="mb-2"></v-divider>

              <v-card-text class="overflow-y-auto px-2 py-0 cursor-pointer" style="height: 320px;">
                <div v-for="(item, index) in boardDouyinTopList" :key="item.id" class="d-flex mb-2">
                  <v-hover>
                    <template v-slot:default="{ isHovering, props }">
                      <div class="text-grey-darken-1">{{ index + 1 }}</div>
                      <a :href="`https://www.douyin.com/discover/search/${item.word}`" target="_blank"
                        :class="{ 'flex-fill': true, 'ml-4': true, 'text-deep-purple-lighten-1': isHovering }"
                        v-bind="props" v-ripple>
                        {{ item.word
                        }}
                      </a>
                      <div class="flex-shrink-0 ml-2 text-grey-darken-2 text-caption">{{ numberToWan(item.hot_value) }}
                      </div>
                    </template>
                  </v-hover>

                </div>
              </v-card-text>

              <v-divider class="mt-2"></v-divider>

              <v-card-actions>
                <div class="d-flex align-center justify-space-between w-100">
                  <span class="text-caption text-grey-darken-1">{{ calculateMinutesDifference(bilibiliUpdate_time)
                    }}分钟前</span>
                </div>
              </v-card-actions>

            </v-card>
          </v-col>
          
        </v-row>
      </div>
    </div>
  </div>
</template>

<script setup name="Board">
import { getBoardDouyinTop, getBoardBiliBiliBuy, getBoardPlatform } from '@/api/board'
import { numberToWan, calculateMinutesDifference } from '@/utils'

const { proxy } = getCurrentInstance();

const bilibiliLoading = ref(false);
const douyinLoading = ref(false);

const douyinUpdate_time = ref("");
const bilibiliUpdate_time = ref("");

const resultData = reactive({
  boardDouyinTopList: [],
  boardBiliBiliBuyList: [],
  platformList: [],
})

const { boardDouyinTopList, boardBiliBiliBuyList, platformList } = toRefs(resultData);


/* 获取抖音热榜 */
function getBoardDouyinTops() {
  douyinLoading.value = true;
  getBoardDouyinTop().then(result => {
    console.log(result, '抖音')
    boardDouyinTopList.value = result.data;
    douyinUpdate_time.value = result.update_time;
    douyinLoading.value = false;
  })
}

/* 获取bilibili热榜 */
function getBoardBiliBiliBuys() {
  bilibiliLoading.value = true;
  getBoardBiliBiliBuy().then(result => {
    console.log(result, "Bili")
    boardBiliBiliBuyList.value = result.data;
    bilibiliUpdate_time.value = result.update_time;
    bilibiliLoading.value = false;
  })
}

/* 获取bilibili热榜 */
function getBoardPlatforms() {
  bilibiliLoading.value = true;
  getBoardPlatform().then(result => {
    platformList.value = result.data;
    console.log(result, "平台")
  })
}

/* 信息直达 */
function handelExpress(item) {
  // cardConfigStore.addPublicComponents(item).then((result) => {
  //   if (result.code) {
  //     proxy.$modal.msgSuccess(result.message);
  //   }
  // })
}

getBoardDouyinTops();
getBoardBiliBiliBuys();
getBoardPlatforms();

</script>

<style scoped lang="scss"></style>
