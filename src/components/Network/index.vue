<template>
    <v-scroll-x-reverse-transition>
        <v-list v-if="isShow && isSupported" no-gutters nav slim>
            <template v-if="isSupported">
                <v-tooltip location="bottom">
                    <template v-slot:activator="{ props }">
                        <v-list-item class="d-flex align-center" v-bind="props">
                            <v-fab-transition>
                                <v-btn v-if="isOnline" icon variant="text">
                                    <v-icon size="28">mdi-wifi-arrow-up-down</v-icon>
                                </v-btn>
                                <v-btn v-else icon variant="text">
                                    <v-icon size="28">mdi-wifi-remove</v-icon>
                                </v-btn>
                            </v-fab-transition>
                            <span class="ml-1 text-caption">{{ isOnlines() }}</span>
                        </v-list-item>
                    </template>

                    <div opacity="50" class="d-flex align-center">
                        <span class="mr-3">当前网络是否在线:</span>
                        <span>{{ isOnlines() }}</span>
                    </div>
                    <div opacity="50" class="d-flex align-center mt-2">
                        <span class="mr-3">当前网络下行带宽:</span>
                        <span>{{ downlink }}Mb/s</span>
                    </div>
                    <div opacity="50" class="d-flex align-center mt-2">
                        <span class="mr-3">网络往返时延RTT:</span>
                        <span>{{ rtt }}ms</span>
                    </div>
                </v-tooltip>
            </template>
        </v-list>
    </v-scroll-x-reverse-transition>
</template>

<script setup>
import { useNetwork } from '@vueuse/core'
import { onMounted } from 'vue';

const network = reactive(useNetwork())
const { isSupported, isOnline, saveData, offlineAt, onlineAt, downlink, downlinkMax, effectiveType, rtt, type } = toRefs(network)

const isShow = ref(false)

// 网路连接状态
function isOnlines() {
    if (isOnline.value) {
        return "网络已连接"
    } else {
        return "网络已断开"
    }
}

// 延迟展示
onMounted(() => {
    let showTimer = setTimeout(() => {
        isShow.value = true
        clearTimeout(showTimer)
    }, 1600)
})


</script>

<style lang='scss' scoped></style>