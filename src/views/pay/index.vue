<template>
    <v-container fluid class="px-6 pt-16">
        <v-row justify="center">
            <v-col cols="auto">
                <p class="text-h4 font-weight-black gradient-text">充值积分，解锁更多能力</p>
                <div class="mt-2 text-subtitle-1 d-flex align-center justify-center">
                    <span>选择合适您的套餐，或直接</span>
                    <v-btn class="text-subtitle-1 px-1" variant="plain" density="default"
                        @click="handelOpenPayCredit">购买积分</v-btn>
                </div>
            </v-col>
        </v-row>
        <v-row justify="space-evenly">
            <template v-for="(item, index) in vipList" :key="item.id">
                <v-col md="3" cols="12">
                    <v-card rounded="xl" class="px-4 py-4">
                        <v-card-text>
                            <div class="d-flex align-center">
                                <div>
                                    <svg-icon class-name="text-body-2" icon-class="diamonds" />
                                </div>
                                <div class="ml-2 text-subtitle-1">{{ item.title }}</div>
                            </div>

                            <div class="d-flex align-center mt-6">
                                <p class="font-weight-black mr-2">¥</p>
                                <p class="text-h4 font-weight-black">{{ item.original_price }}</p>
                            </div>

                            <div class="d-flex align-center text-medium-emphasis">
                                <p>¥{{ Math.round((item.original_price / item.integral) * 100) / 100 }}/1 积分</p>
                            </div>

                            <div class="mt-6">
                                <v-btn block rounded="lg" color="light-blue-darken-4"
                                    @click="handelPayVip(item)">立即购买</v-btn>
                            </div>

                            <div class="mt-5">
                                <v-card elevation="0"
                                    :color="currentTheme == 'light' ? 'grey-lighten-5' : 'grey-darken-3'" rounded="lg">
                                    <v-card-text class="py-2">
                                        <div class="d-flex align-center">
                                            <svg-icon class-name="text-body-1" icon-class="vip" />
                                            <span class="ml-1">{{ item.integral }}积分，不限时</span>
                                        </div>
                                        <div class="mt-2">
                                            <v-progress-linear rounded :model-value="item.integral" :max="largestMax()"
                                                color="light-blue-darken-1"></v-progress-linear>
                                        </div>
                                        <p class="mt-2 text-caption text-grey-darken-1">
                                            约生成 {{ Math.floor(item.integral / item.integral_minute) }} 个 1 分钟数字人视频
                                        </p>
                                    </v-card-text>
                                </v-card>
                            </div>

                            <div class="text-medium-emphasis mt-5">
                                <div class="mb-5 d-flex align-center"
                                    v-for="(child, index) in item.description.vip_package" :key="item">
                                    <v-icon size="x-small" icon="mdi-check"></v-icon>
                                    <p class="ml-1">{{ child }}</p>
                                </div>
                            </div>
                        </v-card-text>

                    </v-card>
                </v-col>
            </template>
        </v-row>

        <v-dialog v-model="qrPayDialog" width="auto" persistent>
            <v-card rounded="lg" min-width="346">
                <v-toolbar color="transparent" density="compact" class="pt-1">
                    <template v-slot:append>
                        <v-btn variant="text" size="small" icon="mdi-close" @click="handelCloseVipDialog"></v-btn>
                    </template>
                </v-toolbar>
                <v-card-text class="py-0 d-flex align-center justify-center">
                    <span>扫码支付</span>
                    <span class="mx-2 text-light-blue-darken-4 text-h6 text-xl-subtitle-1">{{ amount }}</span>
                    <span>元</span>
                </v-card-text>
                <v-card-text class="pb-3">
                    <v-img rounded="lg" class="ma-auto" :src="payQrImg" width="180" height="180" aspect-ratio="1/1"
                        cover draggable="false">
                        <div v-if="isPayVipLoading"
                            class="fill-height ma-0 d-flex align-center justify-center flex-column "
                            style="background: rgba(65, 69, 78, .9);backdrop-filter: blur(1px);">
                            <v-progress-circular indeterminate color="white"></v-progress-circular>
                            <p v-if="device === 'desktop'" class="text-caption mt-2 text-white">正在加载二维码...</p>
                            <p v-else-if="device === 'mobile'" class="text-caption mt-2 text-white">正在拉起支付...</p>
                        </div>

                        <div v-else-if="isPayVipLoading != true && payQrImg == ''"
                            class="fill-height ma-0 d-flex align-center justify-center flex-column"
                            style="background: rgba(65, 69, 78, .9);backdrop-filter: blur(1px);">
                            <div class="mb-3 text-white">
                                <p class="text-caption text-center">支付前请阅读</p>
                                <p class="text-caption text-center mt-2">《“AI工作台”付费服务协议》</p>
                            </div>
                            <v-btn color="light-blue-darken-4" @click="handelVipAgreementChange">同意并支付</v-btn>
                        </div>
                    </v-img>
                </v-card-text>
                <v-card-text class="py-0">
                    <div>
                        <p class="text-medium-emphasis text-caption text-center">请扫码完成支付</p>
                    </div>
                    <div class="d-flex align-center justify-center mt-3">
                        <div class="text-caption text-center mr-2">选择支付方式</div>
                        <v-item-group mandatory v-model="payModeSelect">
                            <v-container>
                                <v-row>
                                    <v-col v-for="item in payModeList" :key="item" cols="6" md="6" align-self="center">
                                        <v-item v-slot="{ isSelected, toggle }" :value="item.value"
                                            @group:selected="handelVipPayModeChange">
                                            <div @click="toggle"
                                                class="d-flex align-center justify-center rounded-lg pa-2"
                                                :style="{ 'border': isSelected ? '2px solid #01579B' : '2px solid #FFFFFF00' }">
                                                <svg-icon class-name="text-h5" :icon-class="item.icon" />
                                            </div>
                                        </v-item>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-item-group>
                    </div>
                </v-card-text>
                <v-card-text class="pb-9 text-center text-medium-emphasis text-caption">
                    <span class="text-grey-darken-2">您已同意</span>
                    <a>《 “AI工作台”付费服务协议》</a>
                </v-card-text>
            </v-card>
        </v-dialog>


        <v-dialog v-model="creditDialog" persistent width="auto">
            <v-card rounded="lg" :prepend-avatar="avatar" :title="phone">
                <template v-slot:append>
                    <v-btn variant="text" size="small" icon="mdi-close" @click="handelCloseCreditDialog"></v-btn>
                </template>
                <v-card-text class="pb-0">
                    <v-row align="center" justify="start" dense>
                        <v-col md="auto" cols="auto">
                            <p class="text-subtitle-2 text-grey-lighten-1">积分明细</p>
                        </v-col>
                        <v-col md="auto" cols="auto">
                            <v-btn variant="tonal" density="comfortable" rounded="pill" @click.stop="handelGoToUser">
                                <template v-slot:prepend>
                                    <svg-icon class-name="text-subtitle-2" icon-class="vip" />
                                </template>

                                <p class="text-subtitle-2">{{ integral }}</p>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-card-text>
                    <v-row no-gutters>
                        <v-col class="text-center">
                            积分购买
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col md="8" cols="12">
                            <v-item-group mandatory v-model="selectCredit">
                                <v-row>
                                    <v-col md="4" cols="4" v-for="(item, index) in creditList" :key="item.id">
                                        <v-item v-slot="{ isSelected, toggle }" :value="item"
                                            @group:selected="handelCreditAgreementChange">
                                            <v-list-item
                                                :base-color="currentTheme == 'light' ? 'grey-lighten-3' : 'grey-darken-3'"
                                                color="light-blue-darken-4" @click="toggle" :active="isSelected"
                                                rounded="lg" nav hover variant="flat" class="pa-4">
                                                <div class="d-flex justify-center align-center">
                                                    <svg-icon class-name="text-h5" icon-class="vip" />
                                                    <p class="text-h6">{{ item.integral }}</p>
                                                </div>
                                                <div class="d-flex justify-center text-caption">
                                                    <span>¥</span>
                                                    <span>{{ item.original_price }}</span>
                                                </div>
                                            </v-list-item>

                                        </v-item>

                                    </v-col>
                                </v-row>
                                <v-row class="mt-8">
                                    <v-col md="12">
                                        <p class="text-caption">温馨提示：积分不可兑换会员，不可转赠，也不可提现；积分充值后有效期为永久，不支持退款或反向兑换为人民币</p>
                                    </v-col>
                                </v-row>
                            </v-item-group>
                        </v-col>
                        <v-col md="4" cols="12">
                            <v-row>
                                <v-col md="12">
                                    <div class="position-relative w-100 h-100">
                                        <v-img rounded="lg" class="ma-auto"
                                            :src="payQrCreditImg || 'https://yiyuanai.eos-dongguan-7.cmecloud.cn/yiyuanai_assets/payqr.png'"
                                            width="180" height="180" aspect-ratio="1/1" cover draggable="false">

                                            <div v-if="isPayCreditQrLoading"
                                                class="fill-height ma-0 d-flex align-center justify-center flex-column "
                                                style="background: rgba(65, 69, 78, .9);backdrop-filter: blur(1px);">
                                                <v-progress-circular indeterminate color="white"></v-progress-circular>
                                                <p v-if="device === 'desktop'" class="text-caption mt-2 text-white">
                                                    正在加载二维码...
                                                </p>
                                                <p v-else-if="device === 'mobile'" class="text-caption mt-2 text-white">
                                                    正在拉起支付...</p>
                                            </div>

                                            <div v-else-if="isPayCreditQrLoading != true && payQrCreditImg == ''"
                                                class="fill-height ma-0 d-flex align-center justify-center flex-column"
                                                style="background: rgba(65, 69, 78, .9);backdrop-filter: blur(1px);">
                                                <div class="mb-3 text-white">
                                                    <p class="text-caption text-center">支付前请阅读</p>
                                                    <p class="text-caption text-center mt-2">《“AI工作台”付费服务协议》</p>
                                                </div>
                                                <v-btn color="light-blue-darken-4"
                                                    @click="handelCreditAgreementClick">同意并支付</v-btn>
                                            </div>
                                        </v-img>
                                    </div>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col md="12">
                                    <div>
                                        <p class="text-medium-emphasis text-caption text-center">请扫码完成支付</p>
                                    </div>
                                    <div class="d-flex align-center justify-center mt-3">
                                        <div class="text-caption text-center mr-2">选择支付方式</div>
                                        <v-item-group mandatory v-model="payModeSelect">
                                            <v-container>
                                                <v-row>
                                                    <v-col v-for="item in payModeList" :key="item" cols="6" md="6"
                                                        align-self="center">
                                                        <v-item v-slot="{ isSelected, toggle }" :value="item.value"
                                                            @group:selected="handelCreditPayModeChange">
                                                            <div @click="toggle"
                                                                class="d-flex align-center justify-center rounded-lg pa-2"
                                                                :style="{ 'border': isSelected ? '2px solid #01579B' : '2px solid #FFFFFF00' }">
                                                                <svg-icon class-name="text-h5"
                                                                    :icon-class="item.icon" />
                                                            </div>
                                                        </v-item>
                                                    </v-col>
                                                </v-row>
                                            </v-container>
                                        </v-item-group>
                                    </div>

                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col md="12">
                                    <div class="d-flex justify-center text-caption">
                                        <span>您已同意</span>
                                        <span>《“AI工作台”付费服务协议》</span>
                                    </div>
                                </v-col>
                            </v-row>

                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup name="Pay">
import useUserStore from '@/store/modules/user'
import { useTheme } from 'vuetify'
import { addWechatQrPay, addWechatMobilePay, getPriceList, addAliPayH5Pay, addAliPayMobilePay, getPayStatus } from '@/api/pay'
import useAppStore from '@/store/modules/app'

let timer = null

const { proxy } = getCurrentInstance();

const router = useRouter();
const appStore = useAppStore();
const userStore = useUserStore();
const theme = useTheme();
const currentTheme = computed(() => theme.global.name.value)

const integral = computed(() => userStore.integral);
const phone = computed(() => userStore.phone);
const avatar = computed(() => userStore.avatar);
const device = computed(() => appStore.device);

const creditList = ref([])
const vipList = ref([])

const qrPayDialog = ref(false)
const creditDialog = ref(false)
const payQrImg = ref('')
const payQrCreditImg = ref('')

const selectCredit = ref({})

const isPayVipLoading = ref(false)
const isPayCreditQrLoading = ref(false)
const agreement = ref(false)
const vipAgreement = ref(false)

const payModeSelect = ref('wechat')
const payModeList = ref([
    {
        name: 'wechat_pay',
        value: 'wechat',
        icon: 'wechatpay'
    },
    {
        name: 'ali_pay',
        value: 'ali',
        icon: 'alipay'
    }
])

const payParams = reactive({
    amount: '',  // "1"
    platform: '', // 'qingsongai',
    product_id: '', // 'credits.recharge.1'
})

const out_trade_no = ref('');  // 当前支付创建订单号ID

const { amount, platform, product_id } = toRefs(payParams);

/* 获取积分列表 */
function getPriceLists() {
    getPriceList().then((priceRes) => {
        const { credit_list, vip_list } = priceRes.data
        console.log(credit_list, vip_list)
        creditList.value = credit_list
        vipList.value = vip_list
        // 设置积分默认选项
        selectCredit.value = credit_list[0]
    })
}

/* 购买积分---打开窗口 */
async function handelOpenPayCredit() {
    creditDialog.value = true
    // 设置积分默认选项
    selectCredit.value = creditList.value[0]
    // 初始化
    amount.value = selectCredit.value.original_price;
    platform.value = selectCredit.value.platform;
    product_id.value = selectCredit.value.product_id;
}

/* 购买积分---同意并支付按钮 */
async function handelCreditAgreementClick() {
    agreement.value = true
    if (payModeSelect.value == 'wechat') {
        if (device.value === 'mobile') {
            // Mobile
            isPayCreditQrLoading.value = true
            amount.value = selectCredit.value.original_price;
            platform.value = selectCredit.value.platform;
            product_id.value = selectCredit.value.product_id;
            const res = await addWechatMobilePay(payParams);
            out_trade_no.value = res.data.out_trade_no;
            window.open(res.data.pay, '_blank', {}, false);
            isPayCreditQrLoading.value = false
            // 防止自动拉起应用
            agreement.value = false
            console.log(res, "微信手机支付")
        } else if (device.value === 'desktop') {
            // PC
            isPayCreditQrLoading.value = true
            amount.value = selectCredit.value.original_price;
            platform.value = selectCredit.value.platform;
            product_id.value = selectCredit.value.product_id;
            const res = await addWechatQrPay(payParams);
            out_trade_no.value = res.data.out_trade_no;
            payQrCreditImg.value = res.data.pay;
            isPayCreditQrLoading.value = false
            console.log(res, "微信网页支付")
        }
    } else if (payModeSelect.value == 'ali') {
        if (device.value === 'mobile') {
            // Mobile
            isPayCreditQrLoading.value = true
            amount.value = selectCredit.value.original_price;
            platform.value = selectCredit.value.platform;
            product_id.value = selectCredit.value.product_id;
            const res = await addAliPayMobilePay(payParams);
            out_trade_no.value = res.data.out_trade_no;
            window.open(res.data.pay, '_blank', {}, false);
            isPayCreditQrLoading.value = false
            // 防止自动拉起应用
            agreement.value = false
            console.log(res, "支付宝手机支付")
        } else if (device.value === 'desktop') {
            // PC
            isPayCreditQrLoading.value = true
            amount.value = selectCredit.value.original_price;
            platform.value = selectCredit.value.platform;
            product_id.value = selectCredit.value.product_id;
            const res = await addAliPayH5Pay(payParams);
            out_trade_no.value = res.data.out_trade_no;
            payQrCreditImg.value = res.data.pay;
            isPayCreditQrLoading.value = false
            console.log(res, "支付宝网页支付")
        }
    }
    // 轮询订单状态
    getPayOrderStatus()
}

/* 购买积分---切换购买积分类型 */
async function handelCreditAgreementChange(event) {
    if (event.value) { // 防止切换触发两次
        if (agreement.value) { // 同意支付协议
            if (payModeSelect.value == 'wechat') {
                if (device.value === 'mobile') {
                    // Mobile
                    isPayCreditQrLoading.value = true
                    amount.value = selectCredit.value.original_price;
                    platform.value = selectCredit.value.platform;
                    product_id.value = selectCredit.value.product_id;
                    const res = await addWechatMobilePay(payParams);
                    out_trade_no.value = res.data.out_trade_no;
                    window.open(res.data.pay, '_blank', {}, false);
                    isPayCreditQrLoading.value = false
                    // 防止自动拉起应用
                    agreement.value = false
                    console.log(res, "微信手机支付")
                } else if (device.value === 'desktop') {
                    // PC
                    isPayCreditQrLoading.value = true
                    amount.value = selectCredit.value.original_price;
                    platform.value = selectCredit.value.platform;
                    product_id.value = selectCredit.value.product_id;
                    const res = await addWechatQrPay(payParams);
                    out_trade_no.value = res.data.out_trade_no;
                    payQrCreditImg.value = res.data.pay;
                    isPayCreditQrLoading.value = false
                    console.log(res, "微信网页支付")
                }
            } else if (payModeSelect.value == 'ali') {
                if (device.value === 'mobile') {
                    // Mobile
                    isPayCreditQrLoading.value = true
                    amount.value = selectCredit.value.original_price;
                    platform.value = selectCredit.value.platform;
                    product_id.value = selectCredit.value.product_id;
                    const res = await addAliPayMobilePay(payParams);
                    out_trade_no.value = res.data.out_trade_no;
                    window.open(res.data.pay, '_blank', {}, false);
                    isPayCreditQrLoading.value = false
                    // 防止自动拉起应用
                    agreement.value = false
                    console.log(res, "支付宝手机支付")
                } else if (device.value === 'desktop') {
                    // PC
                    isPayCreditQrLoading.value = true
                    amount.value = selectCredit.value.original_price;
                    platform.value = selectCredit.value.platform;
                    product_id.value = selectCredit.value.product_id;
                    const res = await addAliPayH5Pay(payParams);
                    out_trade_no.value = res.data.out_trade_no;
                    payQrCreditImg.value = res.data.pay;
                    isPayCreditQrLoading.value = false
                    console.log(res, "支付宝网页支付")
                }
            }
            // 轮询订单状态
            getPayOrderStatus()
        }
    }
}

/* 积分购买---切换支付平台 */
async function handelCreditPayModeChange(event) {
    if (event.value) { // 防止切换触发两次
        if (agreement.value) { // 同意支付协议
            if (payModeSelect.value == 'wechat') {
                if (device.value === 'mobile') {
                    // Mobile
                    isPayCreditQrLoading.value = true
                    amount.value = selectCredit.value.original_price;
                    platform.value = selectCredit.value.platform;
                    product_id.value = selectCredit.value.product_id;
                    const res = await addWechatMobilePay(payParams);
                    out_trade_no.value = res.data.out_trade_no;
                    window.open(res.data.pay, '_blank', {}, false);
                    isPayCreditQrLoading.value = false
                    // 防止自动拉起应用
                    agreement.value = false
                    console.log(res, "微信手机支付")
                } else if (device.value === 'desktop') {
                    // PC
                    isPayCreditQrLoading.value = true
                    amount.value = selectCredit.value.original_price;
                    platform.value = selectCredit.value.platform;
                    product_id.value = selectCredit.value.product_id;
                    const res = await addWechatQrPay(payParams);
                    out_trade_no.value = res.data.out_trade_no;
                    payQrCreditImg.value = res.data.pay;
                    isPayCreditQrLoading.value = false
                    console.log(res, "微信网页支付")
                }
            } else if (payModeSelect.value == 'ali') {
                if (device.value === 'mobile') {
                    // Mobile
                    isPayCreditQrLoading.value = true
                    amount.value = selectCredit.value.original_price;
                    platform.value = selectCredit.value.platform;
                    product_id.value = selectCredit.value.product_id;
                    const res = await addAliPayMobilePay(payParams);
                    out_trade_no.value = res.data.out_trade_no;
                    window.open(res.data.pay, '_blank', {}, false);
                    isPayCreditQrLoading.value = false
                    // 防止自动拉起应用
                    agreement.value = false
                    console.log(res, "支付宝手机支付")
                } else if (device.value === 'desktop') {
                    // PC
                    isPayCreditQrLoading.value = true
                    amount.value = selectCredit.value.original_price;
                    platform.value = selectCredit.value.platform;
                    product_id.value = selectCredit.value.product_id;
                    const res = await addAliPayH5Pay(payParams);
                    out_trade_no.value = res.data.out_trade_no;
                    payQrCreditImg.value = res.data.pay;
                    isPayCreditQrLoading.value = false
                    console.log(res, "支付宝网页支付")
                }
            }
            // 轮询订单状态
            getPayOrderStatus()
        }
    }
}

/* vip套餐购买---打开窗口并传对应价格 */
function handelPayVip(item) {
    amount.value = item.original_price;
    platform.value = item.platform;
    product_id.value = item.product_id;
    qrPayDialog.value = true;
    vipAgreement.value = false;
}

/* vip套餐购买---同意并支付按钮 */
async function handelVipAgreementChange() {
    vipAgreement.value = true;
    if (payModeSelect.value == 'wechat') {
        if (device.value === 'mobile') {
            // Mobile
            isPayVipLoading.value = true
            const res = await addWechatMobilePay(payParams);
            out_trade_no.value = res.data.out_trade_no;
            window.open(res.data.pay, '_blank', {}, false);
            isPayVipLoading.value = false
            // 防止自动拉起应用
            vipAgreement.value = false
            console.log(res, "微信手机支付")
        } else if (device.value === 'desktop') {
            // PC
            isPayVipLoading.value = true
            const res = await addWechatQrPay(payParams);
            out_trade_no.value = res.data.out_trade_no;
            payQrImg.value = res.data.pay;
            isPayVipLoading.value = false
            console.log(res, "微信网页支付")
        }
    } else if (payModeSelect.value == 'ali') {
        if (device.value === 'mobile') {
            // Mobile
            isPayVipLoading.value = true
            const res = await addAliPayMobilePay(payParams);
            out_trade_no.value = res.data.out_trade_no;
            window.open(res.data.pay, '_blank', {}, false);
            isPayVipLoading.value = false
            // 防止自动拉起应用
            vipAgreement.value = false
            console.log(res, "支付宝手机支付")
        } else if (device.value === 'desktop') {
            // PC
            isPayVipLoading.value = true
            const res = await addAliPayH5Pay(payParams);
            out_trade_no.value = res.data.out_trade_no;
            payQrImg.value = res.data.pay;
            isPayVipLoading.value = false
            console.log(res, "支付宝网页支付")
        }
    }
    // 轮询订单状态
    getPayOrderStatus()
}

/* vip套餐购买---切换支付平台 */
async function handelVipPayModeChange(event) {
    if (event.value) {
        if (vipAgreement.value) {
            if (payModeSelect.value == 'wechat') {
                if (device.value === 'mobile') {
                    // Mobile
                    isPayVipLoading.value = true
                    const res = await addWechatMobilePay(payParams);
                    out_trade_no.value = res.data.out_trade_no;
                    window.open(res.data.pay, '_blank', {}, false);
                    isPayVipLoading.value = false
                    // 防止自动拉起应用
                    vipAgreement.value = false
                    console.log(res, "微信手机支付")
                } else if (device.value === 'desktop') {
                    // PC
                    isPayVipLoading.value = true
                    const res = await addWechatQrPay(payParams);
                    out_trade_no.value = res.data.out_trade_no;
                    payQrImg.value = res.data.pay;
                    isPayVipLoading.value = false
                    console.log(res, "微信网页支付")
                }
            } else if (payModeSelect.value == 'ali') {
                if (device.value === 'mobile') {
                    // Mobile
                    isPayVipLoading.value = true
                    const res = await addAliPayMobilePay(payParams);
                    out_trade_no.value = res.data.out_trade_no;
                    window.open(res.data.pay, '_blank', {}, false);
                    isPayVipLoading.value = false
                    // 防止自动拉起应用
                    vipAgreement.value = false
                    console.log(res, "支付宝手机支付")
                } else if (device.value === 'desktop') {
                    // PC
                    isPayVipLoading.value = true
                    const res = await addAliPayH5Pay(payParams);
                    out_trade_no.value = res.data.out_trade_no;
                    payQrImg.value = res.data.pay;
                    isPayVipLoading.value = false
                    console.log(res, "支付宝网页支付")
                }
            }
            // 轮询订单状态
            getPayOrderStatus()
        }
    }
}


/* vip套餐购买---支付窗口关闭处理 */
function handelCloseVipDialog() {
    qrPayDialog.value = false
    vipAgreement.value = false
    payQrImg.value = ""
    payModeSelect.value = 'wechat'
    clearInterval(timer)
}

/* 购买积分---窗口关闭处理 */
function handelCloseCreditDialog() {
    creditDialog.value = false
    agreement.value = false
    payQrCreditImg.value = ""
    selectCredit.value = creditList.value[0]
    payModeSelect.value = 'wechat'
    clearInterval(timer)
}

/* 轮询查询订单状态 */
function getPayOrderStatus() {
    // 订单号 与 商品ID 都存在才查询
    if (out_trade_no.value && product_id.value) {
        clearInterval(timer)
        timer = setInterval(() => {
            getPayStatus({ out_trade_no: out_trade_no.value }).then((result) => {
                if (result.is_payment) {
                    // 支付完成
                    console.log(result, "订单支付完成")
                    clearInterval(timer)
                    proxy.$modal.msgSuccess("完成，正在跳转积分页面");
                    location.href = '/user';
                }
            })
        }, 2800)
    } else {
        proxy.$modal.msgWarning("订单号与商品不存在");
    }
}

/* 去看积分 */
function handelGoToUser() {
    const url = router.resolve({ path: '/user' });
    window.open(url.href);
}

/* 获取最大积分基准线 */
function largestMax() {
    return vipList.value.reduce((p, v) => p.integral < v.integral ? v : p).integral
}


getPriceLists()

</script>

<style scoped>
.gradient-text {
    background: linear-gradient(to right, #01579B, #B39DDB);
    /*设置渐变的方向从左到右 颜色从ff0000到ffff00*/
    -webkit-background-clip: text;
    /*将设置的背景颜色限制在文字中*/
    -webkit-text-fill-color: transparent;
    /*给文字设置成透明*/
}
</style>