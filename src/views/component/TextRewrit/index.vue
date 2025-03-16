<template>
	<v-container fluid class="px-0 py-0 pt-3">
		<v-row>
			<v-col>
				<v-form ref="textRewritRef">
          <p ref="TemplateTipsRef" class="text-subtitle-2 font-weight-bold mb-3">改写文案</p>
					<v-textarea v-model="tagTipsText" :rules="textRewritRuls.tagTipsText" row-height="6" rows="6" persistent-placeholder persistent-counter
            counter="1000" clearable density="compact" clear-icon="mdi-close-circle" variant="outlined" :disabled="isLoading" placeholder="输入需改写的文案内容"></v-textarea>
				</v-form>
			</v-col>
		</v-row>
		<v-row justify="center" align="center">
			<v-col class="d-flex justify-center">
				<v-btn variant="flat" :loading="isLoading" :disabled="isLoading" prepend-icon="mdi-draw"
               color="light_custom_blue_2" @click="getTextFun">开始改写</v-btn>
			</v-col>
		</v-row>

		<v-row justify="center" align="center">
			<v-col>
        <p ref="TemplateTipsRef" class="text-subtitle-2 font-weight-bold mb-3">改写结果</p>
				<v-textarea placeholder="暂无内容" v-model="doneText" :disabled="isLoading" row-height="8" rows="5" variant="outlined"
					clearable :loading="isLoading" persistent-placeholder persistent-counter></v-textarea>
			</v-col>
		</v-row>
		<v-row justify="center" align="center">
			<v-col class="d-flex justify-center">
				<v-btn variant="tonal" prepend-icon="mdi-content-copy" color="light_custom_blue_2"
					:loading="isLoading" @click="copyText(doneText)">复制文案</v-btn>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup>
import { getModelList, getText } from '@/api/sheet/TextRewrit'

const { proxy } = getCurrentInstance();

const { text, isSupported, copy } = proxy.useClipboard();

const doneText = ref('')
const tagTipsText = ref('')
const isLoading = ref(false)

const textRewritRuls = ref({
	tagTipsText: [v => !!v || '请先输入文案内容', v => (v && v.length <= 1000) || '需要改写的文案长度不能超过1000字',],
});

async function getTextFun() {
	const { valid } = await proxy.$refs.textRewritRef.validate();
	if (valid) {
    isLoading.value = true;
    const result = await getText({ content: tagTipsText.value });
    if (result.code === 200) {
      doneText.value = result.data;
      proxy.$modal.msgSuccess(result.message);
    }
    isLoading.value = false;
	}

}

/* 复制文案 */
function copyText(text) {
	// http 或 https 判断复制是否可用
	if (navigator.clipboard) {
		// https
		copy(text);
	} else {
		// http **已弃用API临时解决方式
		const input = document.createElement('input');
		input.setAttribute('value', text);
		document.body.appendChild(input);
		input.select();
		document.execCommand('copy');
		document.body.removeChild(input);
	}
	proxy.$modal.msgSuccess('已复制到剪贴板');
}
</script>