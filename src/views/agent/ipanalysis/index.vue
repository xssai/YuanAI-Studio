<template>
  <v-container fluid style="min-height: 100%; background:#fcfcff;" class="pa-6">
    <v-row>

      <v-col>
        <v-sheet class="rounded" color="transparent">
          <v-empty-state v-if="videoInfoList.length === 0" height="690"
                        title="个人账号热门视频" text="当前没有任何抖音主页视频，请前往获取抖音个人主页链接再进行分析">
            <template v-slot:media>
              <v-avatar class="mb-4" image="https://ai-workbench.eos-dongguan-7.cmecloud.cn/board/douyin.com.png_160x160.png" size="88"></v-avatar>
            </template>
            <template v-slot:actions>
              <v-btn class="text-none" color="light_custom_blue_2" variant="flat" text="前往抖音获取主页链接" @click="handelGoDouyin"></v-btn>
            </template>
          </v-empty-state>

          <Waterfall v-else :list="videoInfoList" :background-color="options.backgroundColor" :gutter="options.gutter"
                     :cross-origin="options.crossOrigin" :animation-effect="options.animationEffect"
                     :has-around-gutter="options.hasAroundGutter" :breakpoints="options.breakpoints"
                     :load-props="options.loadProps" :lazyload="options.lazyload" :delay="options.delay"
                     :animation-delay="options.animationDelay" :animation-duration="options.animationDuration">
            <template #default="{ item, url, index }">
              <v-sheet rounded shaped elevation="0"
                       class="overflow-hidden position-relative">
                <div class="overflow-hidden">
                  <LazyImg class="cursor-pointer zoomed rounded" :url="item.cover" @click="playerVideo(item.video)" />
                </div>

                <div class="px-4 pt-3 pb-3">
                  <h2 class="text-subtitle-1 zoomed-text text-ellipsis-one text-medium-emphasis">{{ item.desc }}</h2>
                </div>
              </v-sheet>
            </template>
          </Waterfall>
        </v-sheet>
      </v-col>


      <v-col cols="12" md="7">
        <v-row>
          <v-col>
            <v-form ref="ipRef">
              <v-row>
                <v-col>
                  <v-sheet class="pa-6 rounded">
                    <p class="text-h6 font-weight-bold mb-4">AI 分析抖音账号</p>
                    <v-text-field v-model="content" :disabled="isLoading" :rules="ipRules.content"
                                  density="compact" placeholder="https://www.douyin.com/user/MS4wLjABAAAAJuaLc6tcroEsXEWrxJypnaxInEyFtjaODhZV1BRZAYA?from_tab_name=main&vid=7470379296570363196"
                                  variant="outlined"></v-text-field>
                    <v-row>
                      <v-col>
                        <p class="mt-1 text-medium-emphasis text-subtitle-2">请输入抖音账号主页链接，AI 将分析该账号最受欢迎的视频，提供账号报告服务。</p>
                      </v-col>
                    </v-row>

                    <v-row >
                      <v-col>
                        <v-btn :disabled="isLoading" :loading="isLoading" color="light_custom_blue_2" text="开始分析（分析时间预计2分钟~5分钟，请耐心等待）" variant="flat"  block @click="handleAddIpAnalysis"></v-btn>
                      </v-col>
                    </v-row>
                  </v-sheet>
                </v-col>
              </v-row>
            </v-form>

          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-sheet color="transparent" class="pl-4">
              <div class="text-h6 font-weight-bold">文案复刻</div>
            </v-sheet>
          </v-col>
        </v-row>

        <v-row class="mt-2">
          <v-col>
            <v-sheet class="rounded pa-8 pt-4">
              <div id="writ-content" class="markdown-one v-overlay-open">
                <v-empty-state
                    color="light_custom_blue_2"

                    title="暂无文案复刻内容"
                ></v-empty-state>
              </div>
            </v-sheet>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-sheet color="transparent" class="pl-4">
              <div class="text-h6 font-weight-bold">抖音号分析报告</div>
            </v-sheet>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-sheet class="rounded pa-8 pt-6">
              <div id="article-content" class="markdown-body v-overlay-open">

                <v-empty-state
                    color="light_custom_blue_2"

                    title="暂无抖音号分析报告"
                ></v-empty-state>

              </div>
            </v-sheet>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup>
import markdownIt from '@/utils/markdown';
import loading from '@/assets/images/loading.png'
import error from '@/assets/images/error.png'
import { isDouyinHttps } from '@/utils/validate';
import useVideoPlayerStore from "@/store/modules/videoPlayer";
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/dist/style.css'

import { addIpAnalysis, getDouyinWork } from "@/api/ipanalysis";

const videoPlayerStore = useVideoPlayerStore();

const { proxy } = getCurrentInstance();

const options = reactive({
  // 唯一key值
  rowKey: 'aweme_id',
  // 卡片之间的间隙
  gutter: 10,
  // 是否有周围的gutter
  hasAroundGutter: false,
  // 卡片在PC上的宽度
  width: 320,
  // 自定义行显示个数，主要用于对移动端的适配
  breakpoints: {
    3840: {
      // 4K下
      rowPerView: 8,
    },
    2560: {
      // 2K下
      rowPerView: 7,
    },
    1920: {
      // 2K下
      rowPerView: 6,
    },
    1600: {
      // 2K下
      rowPerView: 5,
    },
    1366: {
      // 2K下
      rowPerView: 3,
    },
    800: {
      // 当屏幕宽度小于等于800
      rowPerView: 3,
    },
    500: {
      // 当屏幕宽度小于等于500
      rowPerView: 2,
    },
  },
  // 动画效果
  animationEffect: 'animate__fadeInUp',
  // 动画时间
  animationDuration: 600,
  // 动画延迟
  animationDelay: 200,
  animationCancel: false,
  // 背景色
  backgroundColor: 'transparent',
  // imgSelector
  imgSelector: 'src.original',
  // 加载配置
  loadProps: {
    loading,
    error,
    // ratioCalculator: (width, height) => {
    //   // 设置了最小宽高比
    //   const minRatio = 3 / 4
    //   const maxRatio = 4 / 3
    //   return Math.random() > 0.8 ? minRatio : maxRatio
    // },
  },
  // 是否懒加载
  lazyload: false,
  crossOrigin: true,
  delay: 400
  // align: 'center',
})

const isLoading = ref(false);

const ipRules = ref({
  content: [v => !!v || "链接不能为空！",v => isDouyinHttps(v) || "链接必须以 https://www.douyin.com/user 开头！"]
});

// IP分析智能体
const IpParams = reactive({
  content: "",
  bot_id: "7469075658057711670"
})

// https://www.douyin.com/user/MS4wLjABAAAA_2kW6J1cUjZPo5BHTYN0A26klIvZQ43kmaOQBcJ1NOlmCq37tzy3kSFvmABk4bS-?from_tab_name=main&relation=0&vid=7463841547868589362

const { content } = toRefs(IpParams);

const douYinParams = reactive({
  page: 1,
  sec_user_id: ""
})

const { sec_user_id } = toRefs(douYinParams)

// 文案智能体
const writParams = reactive({
  content: "",
  bot_id: "7433312809674850330"
})

const videoInfoList = ref([])

// onMounted(() => {
//   const tmpDiv = document.getElementById("article-content");
//   tmpDiv.innerHTML = markdownIt.render("```\n作者：红衣大叔周鸿祎\n\n1. **IP整体分析**  \n以「科技企业家宠粉互动」为核心视角，融合商业活动纪实与用户福利机制设计。内容聚焦企业级合作（TCL&奥运签约）、企业家IP运营方法论（\"放下身段真诚分享\"）、高价值实物抽奖（家电/新能源车）三大主线，通过\"事件营销+用户运营\"双轮驱动模式，构建\"商业精英\"与\"宠粉大叔\"的反差萌。\n\n2. **IP定位**  \n- 主题定位：科技行业意见领袖的破圈实践  \n- 差异化：打破企业家形象壁垒（主动道歉/自嘲\"挨骂体质\"），将商业合作转化为用户福利（如签约仪式与家电抽奖绑定），首创\"企业级资源+互联网裂变\"的宠粉模式  \n\n3. **粉丝画像**  \n- 人群特征：关注商业/科技的25-40岁男性为主，下沉市场福利敏感型用户占比显著  \n- 核心驱动力：获取稀缺资源（抽中高价值奖品）+ 窥视商业顶层逻辑（奥运合作内幕）+ 参与企业家形象塑造（通过批评影响IP决策）  \n\n4. **IP赛道**  \n- 主赛道：企业家个人品牌建设  \n- 隐藏赛道：互联网裂变营销实验室（测试用户行为：脚本3显示38%用户选择\"零门槛参与\"，62%仍主动做任务获取更多奖券）  \n\n5. **IP提供价值**  \n- 情绪价值：制造\"与亿万身家企业家平等对话\"的虚拟亲密感（如\"老周\"自称）  \n- 认知价值：解密顶级商业合作逻辑（奥运合作伙伴筛选标准）、展现企业家决策纠错机制（24小时内响应粉丝批评调整规则）  \n\n6. **IP人设**  \n- 角色原型：科技圈\"李云龙\"（草根出身/战术灵活/敢打敢赔）  \n- 性格锚点：  \n  - 江湖气（\"说打脸就打脸\"）  \n  - 数据思维（强调\"奖券越多概率越高\"的数学公平性）  \n  - 反矫情体质（自曝被高管团队反对仍坚持道歉）  \n- 关系链构建：用\"抽奖算法\"建立新型粉丝关系（奖券既是参与凭证，也是情感投入量化指标）  \n\n7. **IP特殊符号**  \n- 强记忆标签：  \n  - #红衣新能源（绑定产业趋势）  \n  - #大咖观察（强化意见领袖属性）  \n  - 恒定红色POLO衫（视觉锤）  \n- 行为符号：  \n  - \"签约即抽奖\"仪式（将商业合作转化为用户福利）  \n  - 道歉视频数据面板（展示原活动参与数据与调整依据）  \n- 场景符号：  \n  - 签约仪式主席台（精英身份背书）  \n  - 手机提词器反光（刻意暴露演讲准备过程强化真实感）\n``` \n\n**运营策略洞察**：通过三支视频的规则迭代（脚本1-3呈现从\"点赞评论\"到\"零门槛+任务可选\"的演变），验证了\"低门槛蓄水+高价值奖品+可视化的概率游戏\"组合拳的有效性。数据显示调整后用户参与时长提升2.3倍，奖券自主获取率反升17%，证明目标用户存在\"占便宜心理\"与\"策略博弈快感\"的双重需求。"); // 只渲染当前的块
// })

async function handleAddIpAnalysis() {
  const {valid} = await proxy.$refs.ipRef.validate();
  if (valid) {
    console.log(content.value,"地址")
    isLoading.value = true;

    // Ip分析智能体
    const result = await addIpAnalysis(IpParams);

    // 抖音视频
    sec_user_id.value = content.value;
    const douYinWorkRes = await getDouyinWork(douYinParams);
    const videoInfo = JSON.parse(JSON.stringify(douYinWorkRes.data[0].videoinfo));


    // 抖音视频文案改写
    // writParams.content = `抖音视频文案改写： https://www.douyin.com/video/${videoInfo[0].aweme_id}`  // 7442314396661042483 ${videoInfo[i].aweme_id}
    // const writRes = await addIpAnalysis(writParams);

    // const writDiv = document.getElementById("writ-content");
    // writDiv.innerHTML = markdownIt.render(writRes.data); // 只渲染当前的块

    //   const tmpDiv = document.getElementById("article-content");
    // tmpDiv.innerHTML = markdownIt.render("```\n作者：红衣大叔周鸿祎\n\n1. **IP整体分析**  \n以「科技企业家宠粉互动」为核心视角，融合商业活动纪实与用户福利机制设计。内容聚焦企业级合作（TCL&奥运签约）、企业家IP运营方法论（\"放下身段真诚分享\"）、高价值实物抽奖（家电/新能源车）三大主线，通过\"事件营销+用户运营\"双轮驱动模式，构建\"商业精英\"与\"宠粉大叔\"的反差萌。\n\n2. **IP定位**  \n- 主题定位：科技行业意见领袖的破圈实践  \n- 差异化：打破企业家形象壁垒（主动道歉/自嘲\"挨骂体质\"），将商业合作转化为用户福利（如签约仪式与家电抽奖绑定），首创\"企业级资源+互联网裂变\"的宠粉模式  \n\n3. **粉丝画像**  \n- 人群特征：关注商业/科技的25-40岁男性为主，下沉市场福利敏感型用户占比显著  \n- 核心驱动力：获取稀缺资源（抽中高价值奖品）+ 窥视商业顶层逻辑（奥运合作内幕）+ 参与企业家形象塑造（通过批评影响IP决策）  \n\n4. **IP赛道**  \n- 主赛道：企业家个人品牌建设  \n- 隐藏赛道：互联网裂变营销实验室（测试用户行为：脚本3显示38%用户选择\"零门槛参与\"，62%仍主动做任务获取更多奖券）  \n\n5. **IP提供价值**  \n- 情绪价值：制造\"与亿万身家企业家平等对话\"的虚拟亲密感（如\"老周\"自称）  \n- 认知价值：解密顶级商业合作逻辑（奥运合作伙伴筛选标准）、展现企业家决策纠错机制（24小时内响应粉丝批评调整规则）  \n\n6. **IP人设**  \n- 角色原型：科技圈\"李云龙\"（草根出身/战术灵活/敢打敢赔）  \n- 性格锚点：  \n  - 江湖气（\"说打脸就打脸\"）  \n  - 数据思维（强调\"奖券越多概率越高\"的数学公平性）  \n  - 反矫情体质（自曝被高管团队反对仍坚持道歉）  \n- 关系链构建：用\"抽奖算法\"建立新型粉丝关系（奖券既是参与凭证，也是情感投入量化指标）  \n\n7. **IP特殊符号**  \n- 强记忆标签：  \n  - #红衣新能源（绑定产业趋势）  \n  - #大咖观察（强化意见领袖属性）  \n  - 恒定红色POLO衫（视觉锤）  \n- 行为符号：  \n  - \"签约即抽奖\"仪式（将商业合作转化为用户福利）  \n  - 道歉视频数据面板（展示原活动参与数据与调整依据）  \n- 场景符号：  \n  - 签约仪式主席台（精英身份背书）  \n  - 手机提词器反光（刻意暴露演讲准备过程强化真实感）\n``` \n\n**运营策略洞察**：通过三支视频的规则迭代（脚本1-3呈现从\"点赞评论\"到\"零门槛+任务可选\"的演变），验证了\"低门槛蓄水+高价值奖品+可视化的概率游戏\"组合拳的有效性。数据显示调整后用户参与时长提升2.3倍，奖券自主获取率反升17%，证明目标用户存在\"占便宜心理\"与\"策略博弈快感\"的双重需求。"); // 只渲染当前的块

    // `<div class="text-h6 font-weight-bold mb-6">抖音号分析报告</div>\n` +

    // 视频列表
    videoInfoList.value = videoInfo.slice(0,15)

    // 抖音号分析报告
    const articleDiv = document.getElementById("article-content");
    articleDiv.innerHTML = markdownIt.render(result.data); // 只渲染当前的块

    isLoading.value = false;

  }
}

/* 预览作品 */
function playerVideo(videoUrl) {
  videoPlayerStore.openVideoWindow({ videoUrl });
}

function handelGoDouyin() {
  window.open("https://www.douyin.com", '_blank');
}

</script>

<style lang="scss">
.v-overlay-open {
  /* 火狐 */
  -moz-user-select: Text;
  /* Safari 和 欧朋 */
  -webkit-user-select: Text;
  /* IE10+ and Edge */
  -ms-user-select: Text;
  /* Standard syntax 标准语法(谷歌) */
  user-select: Text;
}

.markdown-body p {
  margin: 0 0 8px;
}

.markdown-body li {
  margin: 8px 0 0 16px;
}

.markdown-one li {
  margin: 0 0 0 16px;
}

.markdown-one h2 {
  margin: 16px 0 16px ;
}

.markdown-one .hljs {
  background:  #f6f7fc;
}
</style>