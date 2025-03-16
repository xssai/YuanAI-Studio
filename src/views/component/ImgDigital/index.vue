<template>
	<v-container fluid class="px-0 py-0 pt-3">
		<v-row>
			<v-col>
				<p class="text-subtitle-2 font-weight-bold mb-3">人像图片</p>
        <v-file-upload v-model="img_files" :disabled="isLoading" accept="image/*" icon="mdi-plus" density="compact" variant="compact" clearable title="拖拽或点击上传" show-size></v-file-upload>
			</v-col>
		</v-row>

		<v-row>
			<v-col>
				<v-tooltip text="Tooltip">
					<template v-slot:activator="{ props }">
						<p v-bind="props" class="text-caption">
							1. 哪些照片可以“生成数字人”？
						</p>
					</template>
					<p class="text-caption">1.老照片、网络图片、风景图片</p>
					<p class="text-caption">2.照片较为模糊，五官轮廓可辨别</p>
					<p class="text-caption">3.无严重破损或污迹遮挡</p>
					<p class="text-caption">4.照片无反光炫光</p>
					<p class="text-caption">5.无残缺、无明显折痕</p>
				</v-tooltip>
			</v-col>
		</v-row>

		<v-row no-gutters>
			<v-col>
				<v-tooltip text="Tooltip">
					<template v-slot:activator="{ props }">
						<p v-bind="props" class="text-caption">
							2. 图片要求有哪些？</p>
					</template>
					<p class="text-caption">1.
						表情自然，脸部尽量居中，最好不要太多人脸，人脸面部越大生成效果越自然</p>
					<p class="text-caption">2. 禁止使用政治、恐怖、色情等敏感内容</p>
					<p class="text-caption">3. 违规者将被封禁账户，望知悉！</p>
				</v-tooltip>
			</v-col>
		</v-row>

		<v-row>
			<v-col>
				<p class="text-subtitle-2 font-weight-bold mb-3">配音</p>
        <v-file-upload v-model="audio_files" :disabled="isLoading" accept="audio/*" icon="mdi-plus" density="compact" variant="compact" clearable title="拖拽或点击上传" show-size></v-file-upload>
			</v-col>
		</v-row>

		<v-row justify="center" align="center">
			<v-col cols="auto">
				<v-btn variant="flat" :loading="isLoading" :disabled="isLoading" prepend-icon="mdi-video-account"
					color="light_custom_blue_2" @click="getVideo">生成数字人</v-btn>
			</v-col>
		</v-row>

	</v-container>
</template>

<script setup>
import { getVideoUrl, getImgDigitalTask, delImgDigitalTask } from '@/api/sheet/ImgDigital'
import { rate, translate } from '@/utils/match'

import useVideoPlayerStore from "@/store/modules/videoPlayer";

const { proxy } = getCurrentInstance();

const { text, isSupported, copy } = proxy.useClipboard();

const videoPlayerStore = useVideoPlayerStore();

const img_files = ref(null)
const audio_files = ref(null)


const isLoading = ref(false)

const myTaskList = ref([]);

const audioPlayer = ref(null);

/* 开始照片数字人 */
async function getVideo(next) {
	if (!(audio_files.value && img_files.value)) {
		proxy.$modal.msgWarning('请先选择上传图片和上传音频');
		return
	}

	const audio_upload_url = await proxy.sendUpload({ Body: audio_files.value, taskType: 'img_digital', ContentType: 'audio/mp3' });
	const img_upload_url = await proxy.sendUpload({ Body: img_files.value, taskType: 'img_digital', ContentType: 'image/png' });

	try {
		isLoading.value = true;
		const result = await getVideoUrl({ img_url: img_upload_url, audio_address: audio_upload_url });
		if (result.code == 200) {
			proxy.$modal.msgSuccess(result.message);
			reset()
		} else {
			proxy.$modal.msgWarning(result.message);
		}
		isLoading.value = false;
	} catch {
		isLoading.value = false;
		proxy.$modal.msgWarning('视频异常');
	}
}

function reset() {
	isLoading.value = false;
	audio_files.value = null;
	img_files.value = null;
}

/* 获取任务列表 */
async function getTask() {
	const result = await getImgDigitalTask();
	// status：0代表排队中，1是正在生成，2是生成完成，4是失败
	myTaskList.value = result.data;
}

/* 删除照片修复任务项 */
async function delTask(id) {
	const delImgDigitalTaskRes = await delImgDigitalTask({ id });
	if (delImgDigitalTaskRes.code == 200) {
		getTask();
		proxy.$modal.msgSuccess(delImgDigitalTaskRes.message);
	} else {
		proxy.$modal.msgWarning(delImgDigitalTaskRes.message);
	}
}


</script>