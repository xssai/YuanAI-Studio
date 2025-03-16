<template>
  <v-container fluid class="px-2 py-2 bg-light_custom_black_2">
    <v-row dense justify="space-around">
      <v-col cols="18" md="9">
        <v-row no-gutters>
          <v-col>
            <v-card variant="flat" border>
              <v-card-title>
                <span class="font-weight-medium text-subtitle-1">使用教程</span>
                <span class="mx-2 text-subtitle-2 text-grey-darken-1">|</span>
                <span class="text-subtitle-2 text-grey-darken-1">覆盖十大行业需求场景</span>
              </v-card-title>
              <v-card-text class="pb-0">
                <v-row justify="space-around" dense>
                  <v-col class="mt-3" cols="6" style="min-width:19%" md="auto" v-for="item in courseList"
                    :key="item.title">
                    <v-card rounded="lg" width="100%" hover variant="text">
                      <v-skeleton-loader class="rounded-lg overflow-hidden" :loading="loading" width="100%"
                        height="80" type="image">
                        <v-img :src="item.photoUrl" cover draggable="false" rounded="lg" height="80"
                          @click="handelVideoChange(item.videoUrl)" aspect-ratio="1/1"></v-img>
                      </v-skeleton-loader>
                    </v-card>
                    <v-list-item :title="item.title" class="px-0 text-center text-grey-darken-1"></v-list-item>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

          </v-col>
        </v-row>

        <v-row no-gutters class="mt-2">
          <v-col>
            <v-card variant="text" hover rounded="lg">
              <v-skeleton-loader class="rounded-lg overflow-hidden" height="76" :loading="loading" type="image">
                <v-img height="76" src="https://ai-workbench.eos-dongguan-7.cmecloud.cn/ad/banner.png" cover
                  draggable="false" aspect-ratio="1/1"></v-img>
              </v-skeleton-loader>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="px-2" variant="flat" height="100%" hover border>
          <template v-slot:title>
            <v-skeleton-loader class="rounded-sm overflow-hidden" :loading="loading" type="list-item">
              <span class="text-h6">数字文案推荐</span>
            </v-skeleton-loader>
          </template>

          <template v-slot:append>
            <v-btn variant="plain" icon="mdi-refresh" @click.stop="getRandomWritMaterials"></v-btn>
          </template>

          <v-divider class="mb-2"></v-divider>

          <v-card-text class="overflow-y-auto px-2 py-0 cursor-pointer overflow-auto" style="height: 315px;">
            <div v-for="(item, index) in randomWritList" :key="item.id" class="d-flex mb-3">
              <v-skeleton-loader class="rounded-sm overflow-hidden" width="100%" :loading="loading" type="list-item">
                <v-hover>
                  <template v-slot:default="{ isHovering, props }">
                    <v-row no-gutters>
                      <v-col cols="auto">
                        <span class="text-grey-darken-1">{{ index + 1 }}</span>
                      </v-col>
                      <v-col>
                        <div v-bind="props" v-ripple
                          :class="{ 'flex-fill': true, 'ml-4': true, 'text-deep-purple-lighten-1': isHovering }"
                          @click="copyTxt(item.text)">
                          <div class="font-weight-bold">{{ item.title }}</div>
                          <div class="text-overflow text-caption text-grey">{{ item.text }}</div>
                        </div>
                      </v-col>
                      <v-col cols="auto">
                        <v-btn variant="plain" icon="mdi-content-copy" size="x-small" color="deep-purple-lighten-1"
                          @click="copyTxt(item.text)"></v-btn>
                      </v-col>
                    </v-row>
                  </template>
                </v-hover>
              </v-skeleton-loader>
            </div>
          </v-card-text>

        </v-card>
      </v-col>
    </v-row>


    <v-row dense >
      <v-col cols="12" md="9">
        <v-card class="px-1" variant="flat" hover border>
          <template v-slot:prepend>
            <v-avatar
              image="https://ai-workbench.eos-dongguan-7.cmecloud.cn/board/douyin.com.png_160x160.png"></v-avatar>

          </template>

          <template v-slot:title>
            <span class="text-h6">抖音</span>
          </template>

          <template v-slot:subtitle>
            <p>统计周期内热门带货视频的黄金3秒台词套路，寻找抓住用户眼球的创作灵感。</p>
          </template>

          <template v-slot:append>
            <p class="text-body-2 text-grey-darken-2 font-weight-medium">视频黄金三秒</p>
          </template>

          <v-card-text class="overflow-y-auto px-2 py-0 cursor-pointer">
            <v-data-table item-value="id" :headers="goldSpeechHeaders" :items="goldSpeechList" :loading="loading" hover
              hide-default-footer height="330" fixed-header>
              <template v-slot:item.actions="{ item }">
                <v-btn variant="plain" color="deep-purple-lighten-1"
                  @click="openNewWindowDouyin(item.aweme_speech)">直达</v-btn>
              </template>
              <template v-slot:item.material_id="{ item }">
                <v-img v-if="item.material_id === 1" width="26"
                  src="https://ai-workbench.eos-dongguan-7.cmecloud.cn/icon/one.webp" cover draggable="false"
                  aspect-ratio="1/1"></v-img>
                <v-img v-else-if="item.material_id === 2" width="26"
                  src="https://ai-workbench.eos-dongguan-7.cmecloud.cn/icon/two.webp" cover draggable="false"
                  aspect-ratio="1/1"></v-img>
                <v-img v-else-if="item.material_id === 3" width="26"
                  src="https://ai-workbench.eos-dongguan-7.cmecloud.cn/icon/three.webp" cover draggable="false"
                  aspect-ratio="1/1"></v-img>

                <span v-else>{{ item.material_id }}</span>
              </template>
              <template v-slot:item.aweme_speech="{ item }">
                <div class="text-left" v-tooltip="item.aweme_speech">
                  <span>{{ item.aweme_speech ? item.aweme_speech : '-' }}</span>
                  <span><v-btn variant="plain" icon="mdi-content-copy" size="x-small" color="deep-purple-lighten-1"
                      @click="copyTxt(item.aweme_speech)"></v-btn></span>
                </div>
              </template>
              <template v-slot:item.account_name="{ item }">
                <div v-tooltip="item.account_name" @click="handelLink(item.url)">{{ item.account_name ?
                  item.account_name : '-' }}</div>
              </template>
              <template v-slot:item.aweme_count_trend="{ item }">
                <v-sparkline :auto-line-width="sparklineAutoLineWidth" :fill="sparklineFill"
                  :gradient="sparklineGradient" :gradient-direction="sparklineGradientDirection"
                  :line-width="sparklineWidth" :padding="sparklinePadding" :smooth="sparklineRadius"
                  :stroke-linecap="sparklineLineCap" :type="sparklineType" auto-draw
                  :model-value="item.new_aweme_count_trend"></v-sparkline>
              </template>
              <template v-slot:no-data>
                <v-empty-state height="330" icon="mdi-magnify" title="暂没有任何信息"></v-empty-state>
              </template>

              <template v-slot:loading>
                <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
              </template>
            </v-data-table>
          </v-card-text>

          <v-divider class="mt-2"></v-divider>

          <v-card-actions>
            <div class="d-flex align-center justify-space-between w-100">
              <span class="text-caption text-grey-darken-1">每周更新</span>
            </div>
          </v-card-actions>

        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="px-3" variant="flat" hover border>

          <template v-slot:prepend>
            <v-avatar
              image="https://ai-workbench.eos-dongguan-7.cmecloud.cn/board/douyin.com.png_160x160.png"></v-avatar>
          </template>

          <template v-slot:title>
            <span class="text-h6">抖音</span>
          </template>

          <template v-slot:append>

            <p class="text-body-2 text-grey-darken-2 font-weight-medium">抖音热门视频</p>
          </template>

          <v-divider class="mb-2"></v-divider>

          <v-card-text class="overflow-y-auto px-2 py-0 cursor-pointer" style="height: 338px;">
            <div v-for="(item, index) in boardDouyinTopList" :key="item.id">
              <v-skeleton-loader class="rounded-sm overflow-hidden" width="100%" :loading="loading" type="list-item">
                <v-hover>
                  <template v-slot:default="{ isHovering, props }">
                    <v-row no-gutters align="center">
                      <v-col>
                        <div class="d-flex align-center">
                          <div class="text-grey-darken-1">{{ index + 1 }}</div>
                          <a :href="`https://www.douyin.com/discover/search/${item.word}`" target="_blank"
                            :class="{ 'flex-fill': true, 'ml-4': true, 'text-deep-purple-lighten-1': isHovering,'text-ellipsis-one':true }"
                            v-bind="props" v-ripple>{{ item.word }}</a>
                          <div class="flex-shrink-0 ml-2 text-grey-darken-2 text-caption">
                            {{numberToWan(item.hot_value)}}
                          </div>
                        </div>
                      </v-col>
                      <v-col cols="auto">
                        <v-btn variant="plain" icon="mdi-link-variant" size="small" color="deep-purple-lighten-1" v-tooltip="'复制视频链接'"
                          @click="copyTxt(`https://www.douyin.com/discover/search/${item.word}`)"></v-btn>
                      </v-col>
                    </v-row>
                  </template>
                </v-hover>
              </v-skeleton-loader>
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

    <v-row dense>
      <v-col cols="12" md="12">
        <v-card class="px-2" variant="flat" hover border>
          <template v-slot:prepend>
            <v-avatar
              image="https://ai-workbench.eos-dongguan-7.cmecloud.cn/board/douyin.com.png_160x160.png"></v-avatar>
          </template>

          <template v-slot:title>
            <span class="text-h6">抖音</span>
          </template>

          <template v-slot:subtitle>
            <p>统计每日带货效果最好的图文，实时掌握图文带货风向标。</p>
          </template>

          <template v-slot:append>
            <p class="text-body-2 text-grey-darken-2 font-weight-medium">抖音图文带货榜</p>
          </template>

          <v-card-text class="overflow-y-auto px-2 py-0 cursor-pointer">
            <v-data-table item-value="id" :headers="productPictureHeaders" :items="productPictureList"
              :loading="loading" hover hide-default-footer>
              <template v-slot:item.actions="{ item }">
                <v-btn variant="plain" color="deep-purple-lighten-1" @click="openNewWindow(item.aweme_url)">查看</v-btn>
              </template>
              <template v-slot:item.commerce_id="{ item }">
                <v-img v-if="item.commerce_id === 1" width="26"
                  src="https://ai-workbench.eos-dongguan-7.cmecloud.cn/icon/one.webp" cover draggable="false"
                  aspect-ratio="1/1"></v-img>
                <v-img v-else-if="item.commerce_id === 2" width="26"
                  src="https://ai-workbench.eos-dongguan-7.cmecloud.cn/icon/two.webp" cover draggable="false"
                  aspect-ratio="1/1"></v-img>
                <v-img v-else-if="item.commerce_id === 3" width="26"
                  src="https://ai-workbench.eos-dongguan-7.cmecloud.cn/icon/three.webp" cover draggable="false"
                  aspect-ratio="1/1"></v-img>

                <span v-else>{{ item.commerce_id }}</span>
              </template>
              <template v-slot:item.aweme_cover="{ item }">
                <v-row no-gutters align="center">
                  <v-col cols="auto">
                    <v-img width="38" :src="item.aweme_cover" cover draggable="false" aspect-ratio="1/1"></v-img>
                  </v-col>
                  <v-col class="pl-3">
                    <p class="text-overflow text-left" v-tooltip="item.aweme_title">{{ item.aweme_title ?
                      item.aweme_title : '-' }}
                    </p>
                    <div class="text-left text-overflow">
                      <span class="text-caption text-left text-grey-darken-1 mr-3">关联商品:</span>
                      <v-hover>
                        <template v-slot:default="{ isHovering, props }">
                          <span class="text-caption text-left text-grey-darken-1">
                            <a :href="item.link" target="_blank" :class="{ 'text-deep-purple-lighten-1': isHovering }"
                              v-bind="props" v-ripple>{{ item.title ? item.title : '-' }}</a>
                          </span>
                        </template>
                      </v-hover>

                    </div>
                  </v-col>
                </v-row>
              </template>
              <template v-slot:item.avatar="{ item }">
                <v-row no-gutters align="center">
                  <v-col cols="auto">
                    <v-avatar>
                      <v-img min-width="58" :src="item.avatar" cover draggable="false" aspect-ratio="1/1"></v-img>
                    </v-avatar>
                  </v-col>
                  <v-col class="pl-3">
                    <p class="text-overflow text-left" v-tooltip="item.nickname">{{ item.nickname ? item.nickname : '-'
                      }}
                    </p>
                    <p class="text-caption text-left text-grey-darken-1" v-tooltip="item.nickname">抖音号：{{ item.unique_id
                      ? item.unique_id : '-' }}</p>
                    <p class="text-caption text-left text-grey-darken-1">粉丝{{ item.follower_count ? item.follower_count
                      :
                      '-' }}</p>
                    <p class="text-caption text-left text-grey-darken-1">{{ item.aweme_create_time ?
                      dataFmt(item.aweme_create_time) : '-' }}</p>
                  </v-col>
                </v-row>
              </template>
              <template v-slot:item.account_name="{ item }">
                <div v-tooltip="item.account_name" @click="handelLink(item.url)">{{ item.account_name ?
                  item.account_name : '-' }}</div>
              </template>
              <template v-slot:item.notes="{ item }">
                <div v-tooltip="item.notes">{{ item.notes ? item.notes : '-' }}</div>
              </template>
              <template v-slot:no-data>
                <v-empty-state height="330" icon="mdi-magnify" title="暂没有任何信息"></v-empty-state>
              </template>

              <template v-slot:loading>
                <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
              </template>
            </v-data-table>
          </v-card-text>

          <v-divider class="mt-2"></v-divider>

          <v-card-actions>
            <div class="d-flex align-center justify-space-between w-100">
              <span class="text-caption text-grey-darken-1">每日7:00更新</span>
            </div>
          </v-card-actions>

        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup name="Index">
import { getBoardDouyinTop, getBoardBiliBiliBuy, getBoardPlatform, getRandomWritMaterial, getProductPicture, get30AwemeCountTrend } from '@/api/board'
import { numberToWan, calculateMinutesDifference, dataFmt } from '@/utils'
import useVideoPlayerStore from "@/store/modules/videoPlayer"

const { proxy } = getCurrentInstance();
const { text, isSupported, copy } = proxy.useClipboard();

const videoPlayerStore = useVideoPlayerStore();

const loading = ref(true);

const douyinUpdate_time = ref("");
const bilibiliUpdate_time = ref("");

const resultData = reactive({
  boardDouyinTopList: [],
  boardBiliBiliBuyList: [],
  randomWritList: [],
  productPictureList: [],
  goldSpeechList: [],
})

const sparklineGradients = ref([
  ['#222'],
  ['#42b3f4'],
  ['red', 'orange', 'yellow'],
  ['purple', 'violet'],
  ['#00c6ff', '#F0F', '#FF0'],
  ['#f72047', '#ffd200', '#1feaea'],
])

const sparklineConfig = reactive({
  sparklineWidth: 2,
  sparklineRadius: true,
  sparklinePadding: 8,
  sparklineLineCap: 'round',
  sparklineGradient: sparklineGradients.value[5],
  sparklineValue: [0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 0],
  sparklineGradientDirection: 'top',
  sparklineGradients,
  sparklineFill: false,
  sparklineType: 'trend',
  sparklineAutoLineWidth: false,
})


const productPictureHeaders = ref([
  { title: '排名', align: 'center', sortable: false, key: 'commerce_id', minWidth: '62', },
  { title: '图文', align: 'center', key: 'aweme_cover', sortable: false, minWidth: '200', },
  { title: '达人', align: 'center', sortable: false, key: 'avatar', minWidth: '220', },
  { title: '点赞数', align: 'center', sortable: false, key: 'digg_count', minWidth: '75', },
  { title: '转发数', align: 'center', sortable: false, key: 'share_count', minWidth: '75', },
  { title: '评论数', align: 'center', sortable: false, key: 'comment_count', minWidth: '75', },
  { title: '周期内销量', align: 'center', sortable: false, key: 'volume_text', minWidth: '120', },
  { title: '周期内销售额', align: 'center', sortable: false, key: 'amount_text', minWidth: '120', },
  { title: '操作', align: 'center', sortable: false, key: 'actions', minWidth: '60', }
])

const goldSpeechHeaders = ref([
  { title: '排行', align: 'center', sortable: false, key: 'material_id', minWidth: '62', },
  { title: '台词', align: 'center', key: 'aweme_speech', sortable: false, minWidth: '220', },
  { title: '关联视频数', align: 'center', sortable: false, key: 'aweme_count', minWidth: '105', },
  { title: '总点赞数', align: 'center', sortable: false, key: 'digg_count', minWidth: '90', },
  { title: '总销售量', align: 'center', sortable: false, key: 'volume_count_text', minWidth: '105', },
  { title: '近30天关联视频数趋势', align: 'center', sortable: false, key: 'aweme_count_trend', minWidth: '220', },
  { title: '相关视频', align: 'center', sortable: false, key: 'actions', minWidth: '60', },
])


const courseList = ref([
  {
    title: "图文带货",
    photoUrl: 'https://ai-workbench.eos-dongguan-7.cmecloud.cn/course/photo/01%E5%9B%BE%E6%96%87%E5%B8%A6%E8%B4%A7.png',
    videoUrl: 'https://ai-workbench.eos-dongguan-7.cmecloud.cn/course/video/%E5%9B%BE%E6%96%87%E5%B8%A6%E8%B4%A7%E6%93%8D%E4%BD%9C%E6%95%99%E7%A8%8B.mp4'
  },
  {
    title: "知识口播",
    photoUrl: 'https://ai-workbench.eos-dongguan-7.cmecloud.cn/course/photo/02%E7%9F%A5%E8%AF%86%E5%8F%A3%E6%92%AD.png',
    videoUrl: 'https://ai-workbench.eos-dongguan-7.cmecloud.cn/course/video/%E7%9F%A5%E8%AF%86%E5%8F%A3%E6%92%AD%E6%95%B0%E5%AD%97%E4%BA%BA%E6%93%8D%E4%BD%9C%E6%95%99%E7%A8%8B.mp4'
  },
  {
    title: "情感口播",
    photoUrl: 'https://ai-workbench.eos-dongguan-7.cmecloud.cn/course/photo/03%E6%83%85%E6%84%9F%E5%8F%A3%E6%92%AD.png',
    videoUrl: 'https://ai-workbench.eos-dongguan-7.cmecloud.cn/course/video/%E6%83%85%E6%84%9F%E5%8F%A3%E6%92%AD%E6%95%B0%E5%AD%97%E4%BA%BA%E6%93%8D%E4%BD%9C%E6%95%99%E7%A8%8B.mp4'
  },
  {
    title: "节日热点",
    photoUrl: 'https://ai-workbench.eos-dongguan-7.cmecloud.cn/course/photo/04%E8%8A%82%E6%97%A5%E7%83%AD%E7%82%B9.png',
    videoUrl: 'https://ai-workbench.eos-dongguan-7.cmecloud.cn/course/video/%E8%8A%82%E6%97%A5%E7%83%AD%E7%82%B9%E6%95%B0%E5%AD%97%E4%BA%BA%E6%93%8D%E4%BD%9C%E6%95%99%E7%A8%8B.mp4'
  },
  {
    title: "法律科普",
    photoUrl: 'https://ai-workbench.eos-dongguan-7.cmecloud.cn/course/photo/05%E6%B3%95%E5%BE%8B%E7%A7%91%E6%99%AE.png',
    videoUrl: 'https://ai-workbench.eos-dongguan-7.cmecloud.cn/course/video/%E6%B3%95%E5%BE%8B%E7%A7%91%E6%99%AE%E6%95%B0%E5%AD%97%E4%BA%BA%E6%93%8D%E4%BD%9C%E6%95%99%E7%A8%8B.mp4'
  },
  {
    title: "养生保健",
    photoUrl: 'https://ai-workbench.eos-dongguan-7.cmecloud.cn/course/photo/06%E5%85%BB%E7%94%9F%E4%BF%9D%E5%81%A5.png',
    videoUrl: 'https://ai-workbench.eos-dongguan-7.cmecloud.cn/course/video/%E5%85%BB%E7%94%9F%E4%BF%9D%E5%81%A5%E6%95%B0%E5%AD%97%E4%BA%BA%E6%93%8D%E4%BD%9C%E6%95%99%E7%A8%8B.mp4'
  },
  {
    title: "卖货营销",
    photoUrl: 'https://ai-workbench.eos-dongguan-7.cmecloud.cn/course/photo/07%E5%8D%96%E8%B4%A7%E8%90%A5%E9%94%80.png',
    videoUrl: 'https://ai-workbench.eos-dongguan-7.cmecloud.cn/course/video/%E5%8D%96%E8%B4%A7%E8%90%A5%E9%94%80%E6%95%B0%E5%AD%97%E4%BA%BA%E6%93%8D%E4%BD%9C%E6%95%99%E7%A8%8B.mp4'
  },
  {
    title: "教育培训",
    photoUrl: 'https://ai-workbench.eos-dongguan-7.cmecloud.cn/course/photo/08%E6%95%99%E8%82%B2%E5%9F%B9%E8%AE%AD.png',
    videoUrl: 'https://ai-workbench.eos-dongguan-7.cmecloud.cn/course/video/%E6%95%99%E8%82%B2%E5%9F%B9%E8%AE%AD%E6%95%B0%E5%AD%97%E4%BA%BA%E6%93%8D%E4%BD%9C%E6%95%99%E7%A8%8B.mp4'
  },
  {
    title: "广告宣传",
    photoUrl: 'https://ai-workbench.eos-dongguan-7.cmecloud.cn/course/photo/09%E5%B9%BF%E5%91%8A%E5%AE%A3%E4%BC%A0.png',
    videoUrl: 'https://ai-workbench.eos-dongguan-7.cmecloud.cn/course/video/%E5%B9%BF%E5%91%8A%E5%AE%A3%E4%BC%A0%E6%95%B0%E5%AD%97%E4%BA%BA%E6%93%8D%E4%BD%9C%E6%95%99%E7%A8%8B.mp4'
  },
  {
    title: "新闻资讯",
    photoUrl: 'https://ai-workbench.eos-dongguan-7.cmecloud.cn/course/photo/10%E6%96%B0%E9%97%BB%E8%B5%84%E8%AE%AF.png',
    videoUrl: 'https://ai-workbench.eos-dongguan-7.cmecloud.cn/course/video/%E6%96%B0%E9%97%BB%E5%92%A8%E8%AE%AF%E6%95%B0%E5%AD%97%E4%BA%BA%E6%93%8D%E4%BD%9C%E6%95%99%E7%A8%8B.mp4'
  },

])

const { boardDouyinTopList, boardBiliBiliBuyList, randomWritList, productPictureList, goldSpeechList } = toRefs(resultData);
const { sparklineWidth, sparklineRadius, sparklinePadding, sparklineLineCap, sparklineGradient, sparklineValue,
  sparklineGradientDirection, sparklineFill, sparklineType, sparklineAutoLineWidth } = toRefs(sparklineConfig);


async function getList() {
  loading.value = true
  // 获取抖音热榜
  const boardDouyinResult = await getBoardDouyinTop()
  console.log(boardDouyinResult, '抖音')
  boardDouyinTopList.value = boardDouyinResult.data;
  douyinUpdate_time.value = boardDouyinResult.update_time;

  // 随机文案
  await getRandomWritMaterials()

  // 图文带货-禅mama
  const productPictureResult = await getProductPicture()
  productPictureList.value = productPictureResult.data
  console.log(productPictureList.value, "图文带货")

  // 视频台词关联-台词近30天关联视频数趋势
  const get30AwemeCountTrendResult = await get30AwemeCountTrend()
  let newArr = JSON.parse(JSON.stringify(get30AwemeCountTrendResult.data))
  newArr.forEach(element => {
    let new_aweme_count_trend = []
    element.aweme_count_trend.forEach(el => {
      new_aweme_count_trend.push(el.aweme_count)
    });
    element['new_aweme_count_trend'] = new_aweme_count_trend
  });
  goldSpeechList.value = newArr
  console.log(newArr, "近30天关联视频数趋势")


  loading.value = false
}

// 获取随机文案
async function getRandomWritMaterials() {
  const randomWritMaterialResult = await getRandomWritMaterial()
  console.log(randomWritMaterialResult, "randomWrit")
  randomWritList.value = randomWritMaterialResult.data
}


/* 获取bilibili热榜 */
function getBoardBiliBiliBuys() {
  getBoardBiliBiliBuy().then(result => {
    console.log(result, "Bili")
    boardBiliBiliBuyList.value = result.data;
    bilibiliUpdate_time.value = result.update_time;

  })
}

function handelVideoChange(videoUrl) {
  videoPlayerStore.openVideoWindow({ videoUrl });
}

function openNewWindow(link) {
  window.open(link, '_blank');
}

function openNewWindowDouyin(content) {
  window.open(`https://www.douyin.com/search/${content}`, '_blank');
}

/* 复制内容 */
function copyTxt(txt) {
  // http 或 https 判断复制是否可用
  if (navigator.clipboard) {
    // https
    copy(txt);
  } else {
    // http **已弃用API临时解决方式
    const input = document.createElement('input');
    input.setAttribute('value', txt);
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
  }
  proxy.$modal.msgSuccess('已复制到剪贴板');
}

// getBoardBiliBiliBuys()

getList()

</script>

<style scoped lang="scss">
.text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
