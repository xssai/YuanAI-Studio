<template>
  <v-layout class="distribute">
    <v-app-bar flat class="border-b-sm" height="78">
      <v-tabs v-model="tab" align-tabs="center" stacked>
        <v-tab value="tab-1">
          <v-icon icon="mdi-phone"></v-icon>
          <span class="mt-3">发布图文</span>
        </v-tab>

        <v-tab value="tab-2">
          <v-icon icon="mdi-heart"></v-icon>
          <span class="mt-3">发布视频</span>
        </v-tab>
      </v-tabs>
    </v-app-bar>

    <v-navigation-drawer permanent rail rail-width="68" location="right">
      <p class="text-center my-2">平台</p>
      <v-tabs v-model="platformTabs" direction="vertical" color="primary" grow>
        <v-tab :value="item.platform" v-for="item in platformList" :key="item.id" class="mb-3">
          <v-img class="rounded" width="38" aspect-ratio="1/1" cover :src="item.image"></v-img>
        </v-tab>
      </v-tabs>
    </v-navigation-drawer>

    <v-main>
      <v-tabs-window v-model="platformTabs">
        <!-- 小红书 -->
        <v-tabs-window-item v-for="n in 3" :key="n" value="xiaohongshu">
          <v-container fluid>
            <!-- <v-row>
              <v-col v-for="i in 6" :key="i" cols="12" md="4">
                <v-img :lazy-src="`https://picsum.photos/10/6?image=${i * n * 5 + 10}`"
                  :src="`https://picsum.photos/500/300?image=${i * n * 5 + 10}`" height="205" cover></v-img>
              </v-col>
            </v-row> -->
          </v-container>
        </v-tabs-window-item>
        <!-- 抖音 -->
        <v-tabs-window-item v-for="n in 3" :key="n" value="douyin">
          <v-container fluid>
            <!-- <v-row>
              <v-col v-for="i in 6" :key="i" cols="12" md="4">
                <v-img :lazy-src="`https://picsum.photos/10/6?image=${i * n * 5 + 10}`"
                  :src="`https://picsum.photos/500/300?image=${i * n * 5 + 10}`" height="205" cover></v-img>
              </v-col>
            </v-row> -->
          </v-container>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-main>
  </v-layout>
</template>

<script setup name="distribute">
import { getDistributePlatform, getDistributeXhsQrcode, getDistributeXhsQrStatus, getDistributeXhsTopic, getDistributeXhsAddress, addDistributeXhsImgNote, addDistributeXhsViedoNote } from '@/api/distribute'

const { proxy } = getCurrentInstance();

const platform = reactive({
  platformTabs: 'xiaohongshu',
  platformList: [],
})

const tab = ref(null)

const { platformList, platformTabs } = toRefs(platform);


/* 获取公共组件 */
function getPublicComponents() {
  // children_id为1：AI视频 children_id为2：AI音频 children_id为3：AI图片 children_id为4：AI文案
  cardConfigStore.getPublicComponents({ children_id: 1 }).then((result) => {
    componentList.value = result;
  });
}

/* 添加组件至工作台 */
function addPublicComponents(item) {
  // cardConfigStore.addPublicComponents(item).then((result) => {
  //   if (result.code) {
  //     proxy.$modal.msgSuccess(result.message);
  //   }
  // })
}

/* 获取分发平台 */
function getPlatform() {
  getDistributePlatform().then(result => {
    platformList.value = result.data;
    console.log(result, "DistributePlatform")
  })
}

getPlatform()

</script>

<style scoped lang="scss">
.distribute {
  width: 100%;
  min-height: calc(100vh - 96px);
}
</style>
