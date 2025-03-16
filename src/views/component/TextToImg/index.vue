<template>
	<v-container fluid class="px-0 py-3">
		<v-form ref="writeToImgRef">
			<v-row>
				<v-col>
					<p class="text-subtitle-2 font-weight-bold mb-3">生成模型</p>
					<v-select v-model="model_id" :rules="writeToImgRules.model_id" density="compact" variant="outlined"
						:items="modelList" item-title="modelName" item-value="id" :disabled="isLoading"
						prepend-inner-icon="mdi-vector-radius" placeholder="请选择生成模型">
						<template v-slot:item="{ props, item }">
							<v-list-item v-bind="props" :title="item.raw.modelName"
								:disabled="item.raw.is_disable"></v-list-item>
						</template>
					</v-select>
				</v-col>
			</v-row>

			<v-row no-gutters>
				<v-col>
					<p class="text-subtitle-2 font-weight-bold mb-3">提示词</p>
					<v-textarea :rules="writeToImgRules.prompt" v-model="prompt" clear-icon="mdi-close-circle"
						variant="outlined" placeholder="请输入提示词" clearable rows="8" :disabled="isLoading"></v-textarea>
				</v-col>
			</v-row>

			<v-row justify="center" align="center">
				<v-col cols="auto">
					<v-btn variant="flat" :loading="isLoading" prepend-icon="mdi-account-box-outline"
						color="light_custom_blue_2" @click="addliblibWritToImgs">开始生成</v-btn>
				</v-col>
			</v-row>
		</v-form>
	</v-container>
</template>

<script setup>
import { getliblibWritToImgModel, addliblibWritToImg } from '@/api/sheet/TextToImg'

const { proxy } = getCurrentInstance();

const writeToImgRules = ref({
	model_id: [v => !!v || "请选择模型"],
	prompt: [v => !!v || "请输入提示词"]
});

const isLoading = ref(false)
const modelList = ref([]);

const params = reactive({
	model_id: undefined,
	prompt: undefined,
})

const { model_id, prompt } = toRefs(params);

async function addliblibWritToImgs() {
	const { valid } = await proxy.$refs.writeToImgRef.validate();
	if (valid) {
		isLoading.value = true;
		addliblibWritToImg(params).then(res => {
			if (res.code === 200) {
				proxy.$modal.msgSuccess(res.message);
				isLoading.value = false;
			} else {
				proxy.$modal.msgWarning(res.message);
			}
		})
	}
}
function getliblibWritToImgModels() {
	getliblibWritToImgModel().then(res => {
		modelList.value = res.data;
		model_id.value = res.data[0].id;
	})
}

getliblibWritToImgModels()
</script>