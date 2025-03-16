<template>
	<v-container fluid class="pa-0 ma-0">
		<v-window v-model="windowNum">
			<v-window-item :value="1">
				<v-stepper v-model="stepperValue">
					<v-stepper-header class="elevation-0 overflow-hidden">
						<div class="d-flex align-center w-100" v-for="(stepperItem, index) in stepperItems">
							<v-stepper-item :title="stepperItem" :value="index + 1"></v-stepper-item>
							<v-divider v-if="index + 1 < stepperItems.length"></v-divider>
						</div>
					</v-stepper-header>
					<v-stepper-window class="mt-0 mx-2 pa-0">
						<v-stepper-window-item :value="1">
							<div class="mb-1 font-weight-bold">模型主题</div>
							<v-item-group>
								<v-card class="overflow-y-auto ma-0" max-height="280" variant="text">
									<v-row no-gutters>
										<v-col v-for="item in modelList" :key="item.id" cols :max-height="6">
											<v-item v-slot="{ isSelected, toggle }">
												<v-card :color="isSelected ? 'primary' : ''"
													:border="isSelected ? 'md' : ''"
													class="my-1 d-flex flex-column align-center text-no-wrap" dark
													@click="toggle(); targetModel = item" width="91">
													<v-img class="bg-white" width="90" height="120" :src="item.picture"
														draggable="false" cover></v-img>
													<div class="text-body-2 text-center ">
														{{ item.name }}
													</div>
												</v-card>
											</v-item>
										</v-col>
									</v-row>
								</v-card>
							</v-item-group>

							<div class="mb-1 mt-6 font-weight-bold">图片比例</div>
							<v-item-group mandatory>
								<v-row>
									<v-col v-for="item in imgSizeList" :key="item.id" md="2">
										<v-item v-slot="{ isSelected, toggle }">
											<v-card @click="toggle(); targetImgSize = item;" height="55" width="55"
												class="my-1 d-flex flex-column align-center justify-end">
												<v-card :color="isSelected ? 'primary' : ''"
													:variant="isSelected ? 'elevated' : 'tonal'" :height="item.h"
													:width="item.w"></v-card>
												{{ item.name }}
											</v-card>
										</v-item>
									</v-col>
								</v-row>
							</v-item-group>
						</v-stepper-window-item>

						<v-stepper-window-item :value="2">
							关键词
							<v-textarea v-model="tagTipsText" row-height="8" rows="3" clearable
								label="描述绘画内容，建议填多个关键词："></v-textarea>
							<div>
								关键词推荐
								<v-btn prepend-icon="mdi-refresh" variant="plain" @click="updateTips">
									换一批
								</v-btn>
							</div>
							<v-chip-group column>
								<v-chip class="text-md" v-for="item in tagChipsList" @click="addTips(item.keyword)">{{
			item.keyword }}</v-chip>
							</v-chip-group>
							<div class="mt-3">反向描述</div>
							<v-textarea v-model="tagNoTipsText" row-height="8" rows="3" clearable
								label="描述绘画中不想出现的内容"></v-textarea>
						</v-stepper-window-item>

						<v-stepper-window-item :value="3">
							<div>
								<v-card loading class="px-8 pt-8 elevation-0">
									<v-progress-circular color="primary" indeterminate></v-progress-circular>
									生成中。。。
								</v-card>
							</div>
						</v-stepper-window-item>
						<v-stepper-actions class="mt-5 ma-0 pa-0">
							<template v-slot:next="{ props }">
								<v-btn v-if="stepperValue == (stepperItems.length - 1)" class="col-center"
									@click="getImg(() => { stepperValue += 1 })"
									prepend-icon="mdi-lightbulb-variant-outline">
									<template v-slot:prepend>
										<v-icon color=""></v-icon>
									</template>
									生成绘画
								</v-btn>
								<div v-else-if="stepperValue == stepperItems.length">
									<v-btn @click="windowNum = 2; getTask()" :disabled="false">
										历史记录
									</v-btn>
								</div>
								<v-btn v-else class="col-center" @click="isSelectModel(() => { stepperValue += 1 })">
									下一步
								</v-btn>
							</template>
							<template v-slot:prev="{ props }">
								<v-btn v-if="stepperValue != stepperItems.length && stepperValue != 1"
									class="col-center" @click="() => { stepperValue -= 1 }">
									上一步
								</v-btn>
								<v-btn v-else-if="stepperValue == stepperItems.length" class="col-center"
									@click="stepperValue = 1" prepend-icon="mdi-lightbulb-variant-outline">
									<template v-slot:prepend>
										<v-icon color=""></v-icon>
									</template>
									重新生成
								</v-btn>
								<v-btn v-if="stepperValue != stepperItems.length && stepperValue == 1"
									@click="windowNum = 2; getTask()" :disabled="false">
									历史记录
								</v-btn>
							</template>
						</v-stepper-actions>
					</v-stepper-window>

				</v-stepper>
			</v-window-item>
			<v-window-item :value="2" class="pt-4">
				<v-row style="height: 450px;">
					<v-col>
						<v-list lines="two" v-if="myTaskList.length">
							<v-list-item v-for="item in myTaskList" :key="item.id">
								<template v-slot:prepend>
									<v-avatar rounded="0" loading>
										<v-img lazy-src="https://picsum.photos/id/11/100/60" :src="item.gen_url"
											width="60" aspect-ratio="1" cover>
											<template v-slot:placeholder>
												<div class="d-flex align-center justify-center fill-height">
													<v-progress-circular color="grey-lighten-4"
														indeterminate></v-progress-circular>
												</div>
											</template>
										</v-img>
									</v-avatar>
								</template>

								<v-list-item-title>{{ item.name }}</v-list-item-title>

								<v-list-item-subtitle>
									<div>
										<span>{{ formatDate(item.join_time) }}</span>
										<span class="ml-4">{{ translate(item.status) }}</span>
									</div>
									<v-row>
										<v-col class="d-flex align-center">
											<v-progress-linear buffer-value="0" color="teal"
												:model-value="rate(item.status)" stream></v-progress-linear>
										</v-col>
									</v-row>
								</v-list-item-subtitle>

								<template v-slot:append>
									<v-menu>
										<template v-slot:activator="{ props }">
											<div>
												<v-btn density="default" icon="mdi-chevron-right" size="small"
													v-bind="props" variant="text" v-tooltip="'任务项设置'"></v-btn>
											</div>
										</template>
										<v-card>

											<v-list>
												<v-list-item>
													<template v-slot:title>
														<v-btn density="default" variant="text"
															:disabled="item.gen_url == null"
															@click="handelTaskDetails(item)">
															<template v-slot:prepend>
																<v-icon icon="mdi-cloud-arrow-down-outline"></v-icon>
															</template>
															<span>查看</span>
														</v-btn>
													</template>
												</v-list-item>

												<v-list-item>
													<template v-slot:title>
														<v-btn density="default" variant="text"
															@click="delTask(item.id)">
															<template v-slot:prepend>
																<v-icon icon="mdi-delete-outline"></v-icon>
															</template>
															<span>删除</span>
														</v-btn>
													</template>
												</v-list-item>

											</v-list>
										</v-card>
									</v-menu>
								</template>
							</v-list-item>

						</v-list>
						<!-- 空状态 -->
						<v-empty-state height="450" v-else class="my-3"
							image="https://cdn.vuetifyjs.com/docs/images/components/v-empty-state/teamwork.png">
							<template v-slot:title>
								<div class="text-subtitle-2 mt-8">
									暂无数据
								</div>
							</template>

							<template v-slot:text>
								<div class="text-caption">
									前往创建任务后再查看
								</div>
							</template>
						</v-empty-state>
					</v-col>
				</v-row>
				<v-col class="d-flex justify-start">
					<v-btn density="compact" icon="mdi-chevron-left" v-tooltip:bottom="'返回'"
						@click.stop="windowNum = 1"></v-btn>
				</v-col>
			</v-window-item>
			<v-window-item :value="3" class="px-4 py-4">
				<div class="mt-2">
					结果：
					<v-row no-gutters>
						<v-col>

							<v-card class="mx-auto mt-1">
								<v-img class="bg-white " :src="genImgInfo.gen_url" draggable="false"></v-img>
								<v-card-subtitle class="pt-4">
									模型： {{ genImgInfo.name }}
								</v-card-subtitle>

								<v-card-text>
									<div>提示词： {{ genImgInfo.prompt }}</div>

									<div>反向提示词： {{ !genImgInfo.negative_prompt || genImgInfo.negative_prompt == '' ? '-'
			:
			genImgInfo.negative_prompt }}</div>
								</v-card-text>

							</v-card>
						</v-col>
					</v-row>
					<v-row class="mt-3" no-gutters>
						<v-col class="d-flex justify-center" cols="6">
							<v-btn variant="flat" size="small" prepend-icon="mdi-tray-arrow-down" :loading="downLoading"
								color="blue-lighten-1" v-tooltip:bottom="downloadTips" @click="downloadImg">下载图片</v-btn>
						</v-col>
						<v-col class="d-flex justify-center" cols="6">
							<v-btn variant="flat" size="small" prepend-icon="mdi-content-copy" color="brown-lighten-2"
								@click="copyImg">复制图片链接</v-btn>
						</v-col>
					</v-row>
				</div>
				<v-col class="mt-2 d-flex justify-start">
					<v-btn density="compact" icon="mdi-chevron-left" v-tooltip:bottom="'返回'"
						@click.stop="windowNum = 2"></v-btn>
				</v-col>
			</v-window-item>
		</v-window>
	</v-container>
</template>

<script setup>
import { getModelList, getImgUrl, getImgTask, delImgTask, getNewTips } from '@/api/sheet/TextToImg'
import { rate, translate } from '@/utils/match'

const { proxy } = getCurrentInstance();

const { text, isSupported, copy } = proxy.useClipboard();

const windowNum = ref(1)

const modelList = ref(
	[{
		"id": 1,
		"name": "高清写实",
		"model_id": 1,
		"user_id": "",
		"modelname": "moyou_v1060.safetensors [a30fb52420]",
		"picture": "https://imai.xingrui.space/static/wenan/gqxs.webp",
		"classify": null
	}]);
const imgSizeList = ref([
	{
		name: '1:1',
		w: 30,
		h: 30,
	},
	{
		name: '4:3',
		w: 32,
		h: 24,
	},
	{
		name: '3:4',
		w: 24,
		h: 32,
	},
	{
		name: '16:9',
		w: 32,
		h: 18,
	},
	{
		name: '9:16',
		w: 18,
		h: 32,
	}
]);

const targetModel = ref(null)
const targetImgSize = ref(null)
const tagChipsList = ref(null);

const stepperItems = ref(['主题', '描述', '生成'])
const stepperValue = ref(1)

const tagTipsText = ref('')
const tagNoTipsText = ref('')

const isLoading = ref(false)

const downloadTips = ref('Tips:如下载出错,请点击复制下载链接,用浏览器打开链接,点击鼠标右键,选择视频另存为,即可正常下载。')

const myTaskList = ref([]);
const imgUrl = ref('');

const genImgInfo = ref({
	name: "2.5D高清写实",
	gen_time: "2024-09-05T10:28:57.278077",
	prompt: "女人,户外,精灵,萝莉",
	negative_prompt: "萝莉",
});

const downLoading = ref(false);

/* get模型列表 */
async function getModelListFun() {
	const result = await getModelList({});
	if (result.code == 200) {
		modelList.value = result.data;
	}
}
getModelListFun()

/* get关键词 */
async function updateTips() {
	const result = await getNewTips();
	if (result.code == 200) {
		tagChipsList.value = result.data;
	}
}
updateTips()

/* 文生图 */
async function getImg(next) {
	if (!tagTipsText.value || tagTipsText.value == '') {
		proxy.$modal.msgWarning('请先输入关键词');
		return
	}
	next()
	imgUrl.value = '';
	isLoading.value = true;
	const defaultPixle = 512;
	let height = 512;
	let width = 512;
	if (targetImgSize.value.w < targetImgSize.value.h) {
		height = Number((defaultPixle / targetImgSize.value.w) * targetImgSize.value.h);
		width = defaultPixle;
	} else {
		height = defaultPixle;
		width = Number((defaultPixle / targetImgSize.value.h) * targetImgSize.value.w);
	}
	// console.log('Size: ',height,width);return
	const result = await getImgUrl({
		prompt: tagTipsText.value,
		negative_prompt: tagNoTipsText.value,
		height: height,
		width: width,
		model_id: targetModel.value.model_id,
		gen_type: 'txt2img',
	});
	if (result.code == 200) {
		proxy.$modal.msgSuccess(result.message);
		windowNum.value = 2;
		getTask();
	} else {
		proxy.$modal.msgWarning(result.message);
	}
	isLoading.value = false;
}

/* 获取任务列表 */
async function getTask() {
	const result = await getImgTask({ gen_type: 'txt2img' });
	// status：0代表排队中，1是正在生成，2是生成完成，4是失败
	myTaskList.value = result.data;
}

function isSelectModel(next) {
	if (targetModel.value && targetImgSize.value) {
		next()
	} else {
		proxy.$modal.msgWarning('未选择模型或比例');
	}
}

/* 下载 */
function downloadImg() {
	proxy.download(genImgInfo.value.gen_url,`image_${new Date().getTime()}.png`);
}


/* 查看任务详情 */
function handelTaskDetails(item) {
	windowNum.value = 3;
	genImgInfo.value = item;
}

/* 关键词推荐click */
function addTips(item) {
	tagTipsText.value += (tagTipsText.value == '' ? '' : ',') + item
}

/* 复制下载链接 */
function copyImg() {
	copy(genImgInfo.value.gen_url)
	proxy.$modal.msgSuccess('复制成功!');
}

/* 删除照片任务项 */
async function delTask(id) {
	const delImgTaskRes = await delImgTask({ id: id });
	if (delImgTaskRes.code == 200) {
		getTask();
		proxy.$modal.msgSuccess(delImgTaskRes.message);
	} else {
		proxy.$modal.msgWarning(delImgTaskRes.message);
	}
}
</script>