<template>
    <Grid>
      <!-- 视频链接解析组件 -->
      <template v-slot:VideoExtraction>
        <VideoExtraction></VideoExtraction>
      </template>

      <!-- 视频文案提取 -->
      <template v-slot:Extract>
        <Extract></Extract>
      </template>

      <!-- 照片数字人组件 -->
      <template v-slot:ImgDigital>
        <ImgDigital></ImgDigital>
      </template>

      <!-- 视频链接解析组件 -->
      <template v-slot:PhotoRepair>
        <PhotoRepair></PhotoRepair>
      </template>

      <!-- 视频数字人 -->
      <template v-slot:VideoClone>
        <VideoClone></VideoClone>
      </template>

      <!-- 图片人脸替换生成数字人 -->
      <template v-slot:ImgReplaceFace>
        <ImgReplaceFace></ImgReplaceFace>
      </template>

      <!-- 文生图 -->
      <template v-slot:TextToImg>
        <TextToImg></TextToImg>
      </template>

      <!-- 视频换脸 -->
      <template v-slot:VideoReplaceFace>
        <VideoReplaceFace></VideoReplaceFace>
      </template>

      <!-- 音频格式转换 -->
      <template v-slot:AudioConvert>
        <AudioConvert></AudioConvert>
      </template>

      <!-- 音频文案提取 -->
      <template v-slot:AudioToText>
        <AudioToText></AudioToText>
      </template>

      <!-- 音频降噪 -->
      <template v-slot:AudioDenoise>
        <AudioDenoise></AudioDenoise>
      </template>

      <!-- 文案改写 -->
      <template v-slot:TextRewrit>
        <TextRewrit></TextRewrit>
      </template>

      <!-- 声音克隆 -->
      <template v-slot:AudioClone>
        <AudioClone></AudioClone>
      </template>

      <!-- 文案生成 -->
      <template v-slot:TextToText>
        <TextToText></TextToText>
      </template>

      <!-- 文案生成 -->
      <template v-slot:VideoBlend>
        <VideoBlend></VideoBlend>
      </template>

      <!-- 账号观测 -->
      <template v-slot:AccountRecords>
        <AccountRecords></AccountRecords>
      </template>

      <!-- AI视频素材 -->
      <template v-slot:VideoMaterial>
        <VideoMaterial></VideoMaterial>
      </template>

      <!-- AI视频素材 -->
      <template v-slot:DouyinWorksExtraction>
        <DouyinWorksExtraction></DouyinWorksExtraction>
      </template>

      <template v-slot:Portrait>
        <Portrait></Portrait>
      </template>

      <!-- AI配音 -->
      <template v-slot:VoiceDub>
        <VoiceDub></VoiceDub>
      </template>

      <!-- 图片生数字人 -->
      <template v-slot:PhotoHuman>
        <PhotoHuman></PhotoHuman>
      </template>

      <!-- 文生数字人 -->
      <template v-slot:WritVideo>
        <WritVideo></WritVideo>
      </template>

    </Grid>
</template>

<script setup>
import Grid from '@/grid'

/* 视频链接解析 */
import VideoExtraction from '../component/VideoExtraction/index.vue'

/* 视频文案提取 */
import Extract from '../component/Extract/index.vue'

/* 照片数字人 */
import ImgDigital from '../component/ImgDigital/index.vue'

/* 图片修复功能 */
import PhotoRepair from '../component/PhotoRepair/index.vue'

/* 视频数字人 */
import VideoClone from '../component/VideoClone/index.vue'

/* 图片换脸 */
import ImgReplaceFace from '../component/ImgReplaceFace/index.vue'

/* 文生图 */
import TextToImg from '../component/TextToImg/index.vue'

/* 视频换脸 */
import VideoReplaceFace from '../component/VideoReplaceFace/index.vue'

/* 音频格式转换 */
import AudioConvert from '../component/AudioConvert/index.vue'

/* 音频文案提取 */
import AudioToText from '../component/AudioToText/index.vue'

/* 音频降噪 */
import AudioDenoise from '../component/AudioDenoise/index.vue'

/* 文案改写 */
import TextRewrit from '../component/TextRewrit/index.vue'

/* 声音克隆 */
import AudioClone from '../component/AudioClone/index.vue'

/* 文案生成 */
import TextToText from '../component/TextToText/index.vue'

/* AI视频生成器 */
import VideoBlend from '../component/VideoBlend/index.vue'

/* 账号观测 */
import AccountRecords from '../component/AccountRecords/index.vue'

/* AI视频素材 */
import VideoMaterial from '../component/VideoMaterial/index.vue'

/* 抖音作品批量提取 */
import DouyinWorksExtraction from '../component/DouyinWorksExtraction/index.vue'

/* IP肖像 */
import Portrait from '../component/Portrait/index.vue'

/* AI配音 */
import VoiceDub from '../component/VoiceDub/index.vue'

/* 图片生数字人 */
import PhotoHuman from '../component/PhotoHuman/index.vue'

/* 文生数字人 */
import WritVideo from '../component/WritVideo/index.vue'

</script>
