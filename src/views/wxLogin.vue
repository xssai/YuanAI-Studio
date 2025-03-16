<template>
    <v-container fluid width="100%" height="100%" class="d-flex align-center justify-center px-0 py-0">

        <v-row justify="center" align="center" v-if="loading">
            <v-col cols="12" md="4">
                <v-row>
                    <v-col class="text-center">
                        <v-progress-circular :size="70" :width="7" color="light_custom_blue_2" indeterminate></v-progress-circular>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col class="text-center">
                        <p>正在努力拉取资源，请稍等...</p>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <v-row justify="center" align="center" v-else>
            <v-col cols="10" md="3">
                <v-row>
                    <v-col>
                        <h1>微信登录/注册</h1>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <p class="text-caption">您的微信还没有与手机号绑定，请使用手机号进行绑定操作</p>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-form ref="wxLoginRef">
                            <v-row no-gutters>
                                <v-col>
                                    <v-text-field color="primary" v-model="loginForm.phoneNumber"
                                        :rules="loginRules.phoneNumber" label="手机号" variant="underlined" required>
                                        <template v-slot:append>
                                            <v-progress-circular v-if="isCount" color="primary" :model-value="timeCont"
                                                :size="36" :width="3">{{
                                                    timeCont }}</v-progress-circular>
                                            <v-btn v-else variant="plain" :disabled="isCodeLoading"
                                                :loading="isCodeLoading" @click="getWxPhoneCode">发送验证码</v-btn>
                                        </template>
                                        <template v-slot:append-inner>
                                            <v-icon icon="mdi-phone"></v-icon>
                                        </template>
                                    </v-text-field>
                                </v-col>
                            </v-row>
                            <v-row no-gutters>
                                <v-col>
                                    <v-text-field color="primary" v-model="loginForm.phoneCode"
                                        :rules="loginRules.phoneCode" label="短信验证码" variant="underlined" required>
                                        <template v-slot:append-inner>
                                            <v-icon icon="mdi-message-alert"></v-icon>
                                        </template>
                                    </v-text-field>
                                </v-col>
                            </v-row>
                            <v-row dense>
                                <v-col>
                                    <v-btn class="mt-4 rounded-pill" color="indigo" @click="handelWxPhoneBind"
                                        @keyup.enter.native="handelWxPhoneBind" style="height: 48px; box-shadow: none;"
                                        :loading="bindLoading" block>立即绑定</v-btn>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-col>
                </v-row>

            </v-col>
        </v-row>

    </v-container>
</template>

<script setup>
import Cookies from "js-cookie";
import useUserStore from '@/store/modules/user'
import { getWxCodePhone } from "@/api/login";

const userStore = useUserStore();

const { proxy } = getCurrentInstance();

const router = useRouter();
const route = useRoute();
const queryParams = route.query;

const loading = ref(true)
const bindLoading = ref(false)

// 倒计时
const state = reactive({
    timeCont: 60,
    timer: null,
    isCount: false,
    isCodeLoading: true // 防止获取本地存储造成短暂可点击
})

const { timeCont, timer, isCount, isCodeLoading } = toRefs(state)

const loginForm = ref({
    phoneNumber: "",
    phoneCode: "", // 123456
    open_id: ""
})

const loginRules = ref({
    phoneNumber: [v => !!v || "手机号不能为空", v => v.length >= 11 || "手机号至少为11位"],
    phoneCode: [v => !!v || "短信验证码不能为空"]
});

const wxLoginForm = {
    login_type: "wxchat_login",
    code: queryParams.code || ''
}

function getWxPhoneCode() {
    isCodeLoading.value = true;
    getWxCodePhone({ phoneNumber: loginForm.value.phoneNumber, open_id: loginForm.value.open_id }).then(res => {
        localStorage.setItem('wxCountIng', true);
        countDown()
    });
}

function countDown() {
    if (JSON.parse(localStorage.getItem('wxCountIng'))) {
        let startTime = localStorage.getItem('wxStartTimeLogin');
        let nowTime = new Date().getTime();
        if (startTime) {
            let surplus = 60 - parseInt((nowTime - startTime) / 1000, 10);
            timeCont.value = surplus <= 0 ? 0 : surplus;
        } else {
            timeCont.value = 60;
            localStorage.setItem('wxStartTimeLogin', nowTime);
        }

        timer.value = setInterval(() => {
            timeCont.value--;
            isCount.value = true;
            if (timeCont.value <= 0) {
                localStorage.removeItem('wxStartTimeLogin');
                localStorage.removeItem('wxCountIng');
                clearInterval(timer.value);
                timeCont.value = 60;
                isCodeLoading.value = false;
                isCount.value = false;
            }
        }, 1000)
    } else {
        isCodeLoading.value = false;
    }
}

/* 使用微信 code 登录 */
function handelWxLogin() {
    loading.value = true
    // 不存在openId,先去获取一次
    userStore.login(wxLoginForm).then((result) => {
        if (result.code === 200) {
            // 已经绑定过手机号直接跳转
            router.push({ path: "/" });
        } else if (result.code === 201) {
            // 需要绑定的手机号
            Cookies.set('openId', result.open_id)
            loginForm.value.open_id = result.open_id
            loading.value = false
        } else if (result.code === 202) {
            // code 已使用，继续绑定流程
            loginForm.value.open_id = Cookies.get("openId")
            loading.value = false
        }

    })
}

/* 微信与手机号绑定 */
async function handelWxPhoneBind() {
    const { valid } = await proxy.$refs.wxLoginRef.validate()
    if (valid) {
        bindLoading.value = true
        userStore.wxPhoneBind(loginForm.value).then((result) => {
            if (result.code === 200) {
                // 绑定成功
                router.push({ path: "/" });
                Cookies.remove('openId')
            }
            bindLoading.value = false
        }).catch(() => {
            bindLoading.value = false
        });
    }


}

onMounted(() => {
    let timer = setTimeout(() => {
        handelWxLogin()
        clearTimeout(timer)
    }, 300)

})

countDown()


</script>