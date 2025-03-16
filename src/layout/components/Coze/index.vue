<template>
    <div ref="position_demo" class="position_demo"></div>
</template>

<script setup>

const position_demo = ref(null)

const client = ref(null)

const cozeOption = reactive({
    bot_id: '7433312809674850330',  // bot_id: '7432105942105784339',
    title: 'AI智能助手',
    icon: 'https://ai-workbench.eos-dongguan-7.cmecloud.cn/icon/coze.png'
})

const { bot_id, title, icon } = toRefs(cozeOption);

function initCoze() {
    client.value = new CozeWebSDK.WebChatClient({
        config: {
            bot_id: bot_id.value,
        },
        componentProps: {
            title: title.value,
            icon: icon.value
        },
        el: position_demo.value
    });
}

function destroyCoze() {
    client.value.destroy();
}

onMounted(() => {
    initCoze();
})
</script>

<style scoped>
/* 自定义悬浮入口的位置 */
.position_demo {
    position: fixed;
    right: 8px;
    bottom: 152px;
    z-index: 9999999;
}
</style>