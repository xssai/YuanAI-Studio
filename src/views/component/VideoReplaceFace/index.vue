<template>
	<v-container ref="VideoReplaceFaceWindowRef" fluid class="px-0 py-0 pt-3 h-100">
		<v-row no-gutters>
			<v-col>
				<v-dialog max-width="1270" location="center">
					<template v-slot:activator="{ props: activatorProps }">
						<p ref="TemplateTipsRef" class="text-subtitle-2 font-weight-bold mb-3">换脸模板</p>
						<div v-if="videoModelSelect.id" style="height:110px; position: relative;"
							class="overflow-hidden rounded">
							<div class="backgroud_Img_full"
								:style="{ 'background-image': `url(${videoModelSelect.gifname})` }"></div>
							<v-img v-bind="activatorProps" rounded="sm" draggable="false"
								:src="videoModelSelect.gifname" :lazy-src="videoModelSelect.gifname" height="100%"
								content-class="d-flex flex-column justify-end align-center">
								<p class="w-100 text-subtitle-1 font-weight-medium text-white text-center rounded-sm">{{
									videoModelSelect.modelname }}
								</p>
							</v-img>
						</div>

						<div v-else v-bind="activatorProps"
							class="rounded border-sm d-flex align-center justify-center flex-column"
							style="height:110px;">
							<v-icon>mdi-plus</v-icon>
							<p class="text-body-2">选择原始人像模板</p>
						</div>

					</template>
					<template v-slot:default="{ isActive }">
						<v-card>
							<template v-slot:title>
								<span class="text-subtitle-1">选择原始人像模板</span>
							</template>
							<div class="px-4 mb-1">
								<v-tabs v-model="videoModelTab" color="light_custom_blue_2">
									<v-tab class="font-weight-bold" v-for="item in videoModelList" :value="item.type"
										:text="item.name" :key="item.type_id"></v-tab>
								</v-tabs>
							</div>

							<v-tabs-window v-model="videoModelTab">
								<v-tabs-window-item v-for="item in videoModelList" :value="item.type">
									<v-item-group selected-class="bg-primary" mandatory v-model="videoModelSelect">
										<v-container fluid height="540" class="overflow-y-auto">
											<v-row>
												<v-col v-if="item.type_id === 1" cols="12" md="3">
													<div style="height: 250px" @click="customModelTemplateDialog = true"
														class="d-flex flex-column justify-center align-center bg-light_custom_blue_1 rounded-sm">
														<v-icon size="38" color="light_custom_blue_2">mdi-plus</v-icon>
														<p
															class="w-100 font-weight-medium text-center mt-4 text-light_custom_blue_2">
															创建原始人像模板</p>
														<p
															class="w-100 text-center mt-1 text-caption text-light_custom_blue_2">
															自定义模板不做保存,刷新页面即删除
														</p>
													</div>
												</v-col>

												<v-col v-for="i in item.data" :key="i.id" cols="12" md="3">
													<v-item v-slot="{ isSelected, toggle }" :value="i">
														<v-img rounded="sm" draggable="false" :src="i.gifname"
															:lazy-src="i.gifname" height="250" cover
															content-class="d-flex flex-column justify-end align-end overflow-hidden"
															@click="toggle">
															<div class="position-absolute top-0 left-0 pt-2 pl-2">
																<v-menu scroll-strategy="close">
																	<template v-slot:activator="{ props }">
																		<v-btn v-bind="props" variant="text"
																			v-tooltip="'任务项设置'" density="comfortable"
																			icon color="#ffffff">
																			<v-icon>mdi-cog-outline</v-icon>
																		</v-btn>
																	</template>
																	<v-list>
																		<v-list-item :disabled="i.model == null"
																			@click="playerVideo(i.model)">
																			<template v-slot:prepend>
																				<v-icon
																					icon="mdi-video-4k-box"></v-icon>
																			</template>
																			<v-list-item-title>预览模板</v-list-item-title>
																		</v-list-item>
																	</v-list>
																</v-menu>
															</div>
															<div class="position-absolute top-0 right-0 pt-2 pr-2">
																<v-btn variant="text" density="comfortable" icon
																	@click="toggle"
																	:color="isSelected ? 'light_custom_blue_2' : '#ffffff'">
																	<v-icon>mdi-checkbox-multiple-marked-circle-outline</v-icon>
																</v-btn>
															</div>

															<p class="w-100 text-h6 font-weight-medium text-white text-center"
																style="background-color: rgba(0, 0, 0, 0.4);">
																{{ i.modelname }}
															</p>

															<template v-slot:placeholder>
																<v-row align="center" class="fill-height ma-0"
																	justify="center">
																	<v-progress-circular color="#ffffff"
																		indeterminate></v-progress-circular>
																</v-row>
															</template>
														</v-img>
													</v-item>
												</v-col>
											</v-row>
										</v-container>
									</v-item-group>
								</v-tabs-window-item>
							</v-tabs-window>

							<template v-slot:actions>
								<v-btn @click="isActive.value = false" variant="plain" color="light_custom_blue_2"
									text="取消"></v-btn>
								<v-btn @click="isActive.value = false" variant="flat" color="light_custom_blue_2"
									text="确认"></v-btn>
							</template>
						</v-card>
					</template>
				</v-dialog>
			</v-col>
		</v-row>

		<v-row>
			<v-col>
				<p class="text-subtitle-2 font-weight-bold mb-3">人脸图像</p>
				<v-form ref="uploadImgFaceRef">
          <v-file-upload v-model="img_files" :rules="uploadImgFaceRuls.img_files" :disabled="isLoading" accept="image/*" icon="mdi-plus" density="compact" variant="compact" clearable title="拖拽或点击上传" show-size></v-file-upload>
				</v-form>

			</v-col>
		</v-row>

		<v-row justify="center" align="center">
			<v-col cols="auto">
				<v-btn @click="addVideo" variant="flat" :loading="isLoading" :disabled="isLoading"
					prepend-icon="mdi-video-account" color="light_custom_blue_2">开始制作</v-btn>
			</v-col>
		</v-row>

		<v-dialog max-width="865" location="center" v-model="customModelTemplateDialog" persistent>
			<template v-slot:default="{ isActive }">
				<v-card>
					<template v-slot:title>
						<span class="text-subtitle-1">自定义原始人像模板</span>
					</template>

					<v-card-text>
						<p ref="TemplateTipsRef" class="text-subtitle-2 font-weight-bold mb-3">换脸模板</p>
						<v-form ref="uploadCustomVideoTemplateRef">
							<v-file-input :rules="uploadCustomVideoTemplateRuls.video_files" v-model="video_files"
								accept="video/*" label="自定义原始人像视频模板 (画面清晰度影响作品成功率)" :show-size="1000" prepend-icon=""
								variant="outlined"  prepend-inner-icon="mdi-cloud-upload-outline"
								rounded="md" color="blue-lighten-2" density="compact">
								<template v-slot:selection="{ fileNames }">
									<template v-for="(fileName, index) in fileNames" :key="fileName">
										<v-chip class="me-2" color="blue-lighten-2" size="small" label>
											{{ fileName }}
										</v-chip>
									</template>
								</template>
							</v-file-input>
						</v-form>
					</v-card-text>

					<template v-slot:actions>
						<v-btn @click="isActive.value = false" variant="plain" color="light_custom_blue_2" text="取消"
							:loading="isUpLoading"></v-btn>
						<v-btn @click="uploadCustomVideoTemplate" variant="flat" color="light_custom_blue_2" text="开始上传"
							:loading="isUpLoading"></v-btn>
					</template>
				</v-card>
			</template>
		</v-dialog>

	</v-container>
</template>

<script setup>
import { getModelList, addVideoTask, customVideoTemplate } from '@/api/sheet/VideoReplaceFace'
import useCloneModelStore from '@/store/modules/cloneModel'
import useVideoPlayerStore from "@/store/modules/videoPlayer"

const { proxy } = getCurrentInstance();

const videoPlayerStore = useVideoPlayerStore();
const cloneModelStore = useCloneModelStore();


const videoModelTab = ref('drgon') // drgon  // custom
const customModelTemplateDialog = ref(false)
const isLoading = ref(false)

// 临时上传数据
const customVideoTemp = ref('')
const customGifTemp = ref('')
const isUpLoading = ref(false)

const videoModelSelect = ref({})

const img_files = ref(null)
const video_files = ref(null)

const videoModelList = ref([]);


const uploadCustomVideoTemplateRuls = ref({
	video_files: [v => !!v.length || "上传原始人像视频模板"]
});

const uploadImgFaceRuls = ref({
	img_files: [v => !!v.length || "上传需要交换人脸图像"]
});

/* 视频模型 */
async function getModelLists() {
	const result = await getModelList({ page: 1, page_size: 50 });
	videoModelList.value = result.data;
	console.log(videoModelList.value, "视频模型");
}

/* 视频换脸 */
async function addVideo() {
	const { valid } = await proxy.$refs.uploadImgFaceRef.validate();
	if (valid) {
		try {
			isLoading.value = true;
			const imgUploadUrl = await proxy.sendUpload({ Body: img_files.value, taskType: 'video_replaceface', ContentType: 'image/png' });
			if (videoModelSelect.value.type === 'custom') {
				const res = await addVideoTask({
					img_url: imgUploadUrl,
					gen_type: 'video',
					custom_url: customVideoTemp.value,
					gifname: customGifTemp.value
				});
				proxy.$modal.msgSuccess(res.message);
				isLoading.value = false;
			} else {
				const res = await addVideoTask({ img_url: imgUploadUrl, gen_type: 'video', id: videoModelSelect.value.id });
				proxy.$modal.msgSuccess(res.message);
				isLoading.value = false;
			}
		} catch {
			isLoading.value = false;
		}
	}


}

/* 预览数字人作品 */
function playerVideo(videoUrl) {
	videoPlayerStore.openVideoWindow({ videoUrl });
}

/* 上传自定义模板 */
async function uploadCustomVideoTemplate() {
	const { valid } = await proxy.$refs.uploadCustomVideoTemplateRef.validate();
	if (valid) {
		isUpLoading.value = true
		const urlRes = await proxy.sendUpload({ Body: video_files.value, taskType: 'video_replaceface', ContentType: 'video/mp4' });
		const customTempRes = await customVideoTemplate({ url: urlRes });

		customVideoTemp.value = customTempRes.data
		customGifTemp.value = customTempRes.gifname

		// 模拟上传 List
		videoModelList.value[0].data.push({
			id: videoModelList.value[0].data.length + 1, // 步进1
			gifname: customTempRes.gifname,
			model: customTempRes.data,
			type: "custom"
		})

		customModelTemplateDialog.value = false;
		isUpLoading.value = false

		video_files.value = null
	}
}

/* 验证自定义换脸模板文件最大时长 */
async function isDefaultVideoMaxValidate() {
	return await cloneModelStore.isDefaultVideoMaxValidates(video_files.value, 60);
}

getModelLists()
</script>