<template>
    <v-empty-state v-if="!isLoading && !gridViews.length" height="690"
        image="https://cdn.vuetifyjs.com/docs/images/components/v-empty-state/teamwork.png">
        <template v-slot:title>
            <div class="text-subtitle-2 mt-8">
                构建属于您的工作流
            </div>
        </template>
        <template v-slot:text>
            <div class="text-caption">
                当前没有任何组件，前往添加属于您的AI工作流
            </div>
        </template>
        <template v-slot:actions>
            <v-btn class="text-none" to="/create/aivideo" color="light-blue-darken-4" elevation="1" variant="flat" rounded="lg" text="前往添加组件"></v-btn>
        </template>
    </v-empty-state>

    <grid-layout v-else ref="gridLayout" :layout.async="gridViews" :responsive-layouts="presetLayouts"
        :col-num="colNum" :row-height="rowHeight" :is-draggable="isDraggable" :is-resizable="isResizable"
        :is-mirrored="isMirrored" :autoSize="autoSize" :preventCollision="preventCollision"
        :restore-on-drag="restoreOnDrag" :vertical-compact="verticalCompact" :margin="margin" :is-bounded="isBounded"
        :use-css-transforms="useCssTransforms" :responsive="responsive" @layout-updated="layoutUpdatedEvent"
        @breakpoint-changed="breakpointChangedEvent" @layout-before-mount="layoutBeforeMount"
        :cols="{ lg: 12, md: 4, sm: 2, xs: 1, xxs: 1 }" style="min-height: calc(100vh - 96px)">
        <grid-item :class="{ 'rounded': true }" ref="gridItem" v-for="(item, index) in gridViews" :key="item.i"
            @resized="(...args) => resizedEvent(...args, item)" @moved="(...args) => movedEvent(...args, item)"
            @resize="(...args) => resizeEvent(...args, item)" :x="item.x" :y="item.y" :w="item.w" :h="item.h"
            :i="item.i" :minW="item.minW" :minH="item.minH" :isDraggable="item.config.isDraggable"
            :isResizable="item.config.isResizable" drag-allow-from=".vue-draggable-handle">
            <v-card height="100%" hover>
                <CardTopNav class="vue-draggable-handle" :title="item.title" :img="item.img" :name="item.components"
                    :guide="item.guide" v-model:isDraggable="item.config.isDraggable"
                    v-model:isResizable="item.config.isResizable" @handleDraggable="handleDraggable($event, item)"
                    @handleResizable="handleResizable($event, item)" @handleCloseCard="handleCloseCard(item, index)">
                </CardTopNav>
                <div class="py-0 px-3 overflow-y-auto" style="height: calc(100% - 50px);">
                    <slot :name="item.components" :guide="item.guide" :scope="item"></slot>
                </div>
            </v-card>
        </grid-item>
    </grid-layout>
</template>
<script setup>
import { useTheme } from 'vuetify'
import CardTopNav from './components/CardTopNav/index.vue'
import useCardConfigStore from '@/store/modules/cardConfig'

const props = defineProps({
    // 是否可拖拽
    isDraggable: {
        type: Boolean,
        default: true
    },
    // 是否可改变大小
    isResizable: {
        type: Boolean,
        default: true
    },
    // 标识容器是否自动调整大小
    autoSize: {
        type: Boolean,
        default: true
    },
    // 定义栅格系统的列数，其值须为自然数
    colNum: {
        type: Number,
        // default: 20 //响应式布局时无效
    },
    // 每行的高度
    rowHeight: {
        type: Number,
        default: 30
    },
    // 是否可镜像反转
    isMirrored: {
        type: Boolean,
        default: false
    },
    // 标识布局是否垂直压缩
    verticalCompact: {
        type: Boolean,
        default: true
    },
    // 定义栅格中的元素边距
    margin: {
        type: Array,
        default: () => [28, 28]
    },
    // 标识是否使用CSS属性 
    useCssTransforms: {
        type: Boolean,
        default: true
    },
    // 防止碰撞属性，值设置为ture时，栅格只能拖动至空白处。
    preventCollision: {
        type: Boolean,
        default: false
    },
    /* 表示在某个元素被拖动后，是否应恢复被移动过的其他元素。 */
    restoreOnDrag: {
        type: Boolean,
        default: false
    },
    /* 表示栅格中的元素在拖拽时是否绑定在容器中。 */
    isBounded: {
        type: Boolean,
        default: true
    },
    // 标识布局是否为响应式
    responsive: {
        type: Boolean,
        default: true
    }
})

const theme = useTheme();

const cardConfigStore = useCardConfigStore();
const currentTheme = computed(() => theme.global.name.value)
const gridBgColor = computed(() => currentTheme.value == 'light'? "#fafafa": '')

const gridViews = computed(() => cardConfigStore.layout);
const presetLayouts = computed(() => cardConfigStore.presetLayouts);

const emit = defineEmits()

const isLoading = ref(true);

/* 获取卡片列表 */
async function getCard() {
    isLoading.value = true;
    await cardConfigStore.getUserComponents();
    isLoading.value = false;
}
/* 更新事件（布局更新或栅格元素的位置重新计算） */
function layoutUpdatedEvent(newLayout) {
    console.log(newLayout, "grid布局重新计算")

}
/* 在组件的挂载前生命周期派发。 */
function layoutBeforeMount(newLayout) {
    // console.log(newLayout, "在组件的挂载前生命周期派发。")
}
/* 移动后的事件 */
function movedEvent(i, newX, newY, item) {
    cardConfigStore.movedUserComponents(i, newX, newY, item);
}
/* 调整大小时的事件 */
function resizedEvent(i, newH, newW, newHPx, newWPx, item) {
    // console.log(i, newH, newW, newHPx, newWPx, item, "组件数据")
    cardConfigStore.resizeUserComponents(i, newH, newW, newHPx, newWPx, item);
}
/* 保存组件拖拽开关 */
function handleDraggable(state, item) {
    cardConfigStore.draggableUserComponents(state, item);
}
/* 保存组件缩放开关 */
function handleResizable(state, item) {
    cardConfigStore.resizableUserComponents(state, item);
}
/* 关闭组件 */
function handleCloseCard(item, index) {
    cardConfigStore.delUserComponents(item, index);
}
/* 容器缩放事件 */
function resizeEvent(i, newH, newW, newHPx, newWPx, item) {
    console.log(i, newH, newHPx, item, "容器缩放事件")
}
/* 响应式布局更新 */
function breakpointChangedEvent(newBreakpoint, newLayout) {
    console.info('BREAKPOINT CHANGED breakpoint=', newBreakpoint, ', layout: ', newLayout)
    cardConfigStore.updateBreakpoint(newBreakpoint, newLayout);
}

getCard();

</script>

<script>
import { GridLayout, GridItem } from 'grid-layout-plus'

export default defineComponent({
    components: {
        GridLayout,
        GridItem
    }
})
</script>

<style scoped lang="scss">
.vgl-layout {
  --vgl-placeholder-bg: #0065bc;
  background-color: v-bind(gridBgColor);
  background-image: url('https://ai-workbench.eos-dongguan-7.cmecloud.cn/board/lines.png');
  background-size: 26px 1300px;
  background-position: left top;
}
</style>
