<template>
	<v-container fluid class="px-0 py-0 pt-3">
		<v-form>
			<v-row>
				<v-col>
					<p ref="TemplateTipsRef" class="text-subtitle-2 font-weight-bold mb-3">主题描述</p>
					<v-textarea v-model="contents" row-height="7" rows="7" persistent-placeholder persistent-counter
						counter="800" clearable density="compact" clear-icon="mdi-close-circle" variant="outlined" :disabled="isLoading"
						placeholder="输入文案相关内容主题，AI帮写服务会帮您自动生成文案"></v-textarea>
				</v-col>
			</v-row>
		</v-form>

		<v-row justify="space-around" align="center">
			<v-col cols="auto">
				<v-btn variant="tonal" prepend-icon="mdi-selection" color="light_custom_blue_2"
					@click="addRelationExample" :loading="isLoading" :disabled="isLoading">随机主题</v-btn>
			</v-col>
      <v-col cols="auto">
        <v-btn variant="flat" prepend-icon="mdi-lead-pencil" color="light_custom_blue_2" @click="getWrite"
               :loading="isLoading" :disabled="isLoading">开始生成</v-btn>
      </v-col>
		</v-row>

    <v-row>
      <v-col>
        <div class="text-subtitle-2 font-weight-bold mb-3">生成结果</div>
        <v-textarea v-model="dialogue" row-height="7" rows="7" persistent-placeholder persistent-counter counter
                    clearable density="compact" clear-icon="mdi-close-circle" variant="outlined" :disabled="isLoading"
                    placeholder="文案生成内容"></v-textarea>
      </v-col>
    </v-row>

		<v-row justify="space-around" align="center">
      <v-col cols="auto">
        <v-btn variant="plain"  prepend-icon="mdi-content-copy" :disabled="!dialogue"
               @click="copyText">复制文案</v-btn>
      </v-col>
		</v-row>
	</v-container>
</template>

<script setup>
import { addVideoWrite } from '@/api/sheet/TextToText'

const { proxy } = getCurrentInstance();

const { text, isSupported, copy } = proxy.useClipboard();

const contents = ref("");
const isLoading = ref(false);

const dialogue = ref("");

const relationExample = ref([
	"外星飞船，星际，战争，地球",
	"公主，勇敢，冒险，友爱",
	"小狐狸、好奇、宝藏"
])


async function getWrite() {
	dialogue.value = "";
	isLoading.value = true;
	const res = await addVideoWrite({ text: contents.value });
	isLoading.value = false;
	dialogue.value = res.data;
}

/* 随机主题 */
function addRelationExample() {
	const index = Math.floor(Math.random() * relationExample.value.length);
	contents.value = relationExample.value[index]
}

/* 复制文案 */
function copyText() {
	// http 或 https 判断复制是否可用
	if (navigator.clipboard) {
		// https
		copy(dialogue.value);
	} else {
		// http **已弃用API临时解决方式
		const input = document.createElement('input');
		input.setAttribute('value', dialogue.value);
		document.body.appendChild(input);
		input.select();
		document.execCommand('copy');
		document.body.removeChild(input);
	}
	proxy.$modal.msgSuccess('已复制到剪贴板');
}
</script>