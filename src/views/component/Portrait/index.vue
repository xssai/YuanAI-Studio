<template>
	<v-container fluid class="px-0 py-0 pt-3">
		<v-form ref="photoRepairRef">
			<v-row no-gutters>
				<v-col>
					<p class="text-subtitle-2 font-weight-bold mb-3">镜头类型</p>
					<v-select prepend-inner-icon="mdi-vector-radius" rounded="md" v-model="camera" tile
						density="compact" variant="outlined" :items="cameraMode" hide-details item-title="name"
						item-value="prompt" :loading="isLoading" :disabled="isLoading" :rules="portraitRules.camera">
					</v-select>
				</v-col>
			</v-row>

			<v-row dense>
				<v-col>
					<p class="text-subtitle-2 font-weight-bold mb-3">性别</p>
					<v-select prepend-inner-icon="mdi-vector-radius" rounded="md" v-model="gender" tile
						density="compact" variant="outlined" :items="genderMode" hide-details item-title="name"
						item-value="prompt" :loading="isLoading" :disabled="isLoading" :rules="portraitRules.gender">
					</v-select>
				</v-col>
			</v-row>

			<v-row dense>
				<v-col>
					<p class="text-subtitle-2 font-weight-bold mb-3">年龄</p>
					<v-slider v-model="age" color="light_custom_blue_2" prepend-icon="mdi-grass" thumb-label :max="90"
						:min="18" :step="1"></v-slider>
				</v-col>
			</v-row>

			<v-row no-gutters>
				<v-col>
					<p class="text-subtitle-2 font-weight-bold mb-3">脸型</p>
					<v-select prepend-inner-icon="mdi-vector-radius" rounded="md" v-model="faceShape" tile
						density="compact" variant="outlined" :items="faceShapeMode" hide-details item-title="name"
						item-value="prompt" :loading="isLoading" :disabled="isLoading" :rules="portraitRules.faceShape">
					</v-select>
				</v-col>
			</v-row>

			<v-row dense>
				<v-col>
					<p class="text-subtitle-2 font-weight-bold mb-3">发型</p>
					<v-select prepend-inner-icon="mdi-vector-radius" rounded="md" v-model="hairstyle" tile
						density="compact" variant="outlined" :items="hairstyleMode" hide-details item-title="name"
						item-value="prompt" :loading="isLoading" :disabled="isLoading" :rules="portraitRules.hairstyle">
					</v-select>
				</v-col>
			</v-row>

			<v-row dense>
				<v-col>
					<p class="text-subtitle-2 font-weight-bold mb-3">头发颜色</p>
					<v-select prepend-inner-icon="mdi-vector-radius" rounded="md" v-model="hairstyleColor" tile
						density="compact" variant="outlined" :items="hairstyleColorMode" hide-details item-title="name"
						item-value="prompt" :loading="isLoading" :disabled="isLoading"
						:rules="portraitRules.hairstyleColor">
					</v-select>
				</v-col>
			</v-row>

			<v-row dense>
				<v-col>
					<p class="text-subtitle-2 font-weight-bold mb-3">服装</p>
					<v-select prepend-inner-icon="mdi-vector-radius" rounded="md" v-model="clothing" tile
						density="compact" variant="outlined" :items="clothingMode" hide-details item-title="name"
						item-value="prompt" :loading="isLoading" :disabled="isLoading" :rules="portraitRules.clothing">
					</v-select>
				</v-col>
			</v-row>

			<v-row align="center" justify="center">
				<v-col cols="auto">
					<v-btn variant="flat" :loading="isLoading" prepend-icon="mdi-lead-pencil"
						color="light_custom_blue_2" @click="addPortraits">开始生成</v-btn>
				</v-col>
			</v-row>
		</v-form>


	</v-container>
</template>

<script setup>
import portraitParams from '@/assets/style_config/portrait.json'
import { getImgUrl } from '@/api/sheet/TextToImg'

const { proxy } = getCurrentInstance();

const isLoading = ref(false)

const portraitOption = reactive({
	camera: 'Head and shoulders portrait', // 镜头类型
	gender: 'Women',// 性别  man ，women
	age: 21, // 年龄
	faceShape: 'Oval', // 脸型
	hairstyle: 'French bob', // 发型
	hairstyleColor: 'Black', // 发型颜色
	clothing: 'Pleated dress' // 服装
})

const sumbitParams = reactive({
	gen_type: "portrait",
	prompt: ""
})


const { camera, gender, age, faceShape, hairstyle, hairstyleColor, clothing } = toRefs(portraitOption);
const { prompt } = toRefs(sumbitParams);

const portraitRules = ref({
	camera: [v => !!v || "请选择镜头类型"],
	gender: [v => !!v || "请选择性别"],
	age: [v => !!v || "请选择年龄"],
	faceShape: [v => !!v || "请选择脸型"],
	hairstyle: [v => !!v || "请选择发型"],
	hairstyleColor: [v => !!v || "请选择头发颜色"],
	clothing: [v => !!v || "请选择服装类型"]
});

// 镜头类型
const cameraMode = ref(portraitParams.cameraMode)
// 性别
const genderMode = ref(portraitParams.genderMode)
// 脸型
const faceShapeMode = ref(portraitParams.faceShapeMode)
// 发型
const hairstyleMode = ref(portraitParams.hairstyleMode)
// 头发颜色
const hairstyleColorMode = ref(portraitParams.hairstyleColorMode)
// 服装
const clothingMode = ref(portraitParams.clothingMode)

// 生成肖像
async function addPortraits() {
	isLoading.value = true;
	prompt.value = JSON.stringify(portraitOption);
	let addPortraitRes = await getImgUrl(sumbitParams);
	if (addPortraitRes.code == 200) {
		proxy.$modal.msgSuccess(addPortraitRes.message);
	}
	isLoading.value = false;
	console.log(addPortraitRes, "响应返回");
}
</script>