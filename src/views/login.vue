<template>
  <v-container class="d-flex align-center justify-center px-0 py-0" fluid height="100%" width="100%">
    <!-- 桌面端 -->
    <v-card v-if="device === 'desktop'" class="desktop-login-form-bg rounded-xl pt-8 pl-14" min-height="680"
            min-width="986">
      <v-row no-gutters>
        <v-col cols="6">
          <v-row>
            <v-col cols="auto">
              <v-img :src="h5Logo" draggable="false" width="148" height="43"></v-img>
            </v-col>
          </v-row>
          <v-row align="end" class="mt-6" no-gutters>
            <v-col cols="auto">
              <h1>立即开始使用</h1>
            </v-col>
            <v-col class="pb-2 pl-1" cols="auto">
              <div class="rounded-circle bg-blue-lighten-1" style="width: 8px; height: 8px;"></div>
            </v-col>
          </v-row>
          <v-row class="mt-4">
            <v-col>
              <v-form v-if="loginPath === 'phoneNumber'" ref="loginRef" class="h-100">
                <v-row >
                  <v-col>
                    <v-text-field v-model="loginForm.phoneNumber" :rules="loginRules.phoneNumber" color="primary"
                                  label="手机号" required variant="underlined">
                      <template v-slot:append>
                        <v-progress-circular v-if="isCount" :model-value="timeCont" :size="36" :width="3"
                                             color="primary">{{ timeCont }}
                        </v-progress-circular>
                        <v-btn v-else :disabled="isCodeLoading" :loading="isCodeLoading" variant="plain"
                               @click="getPhoneCode">发送验证码
                        </v-btn>
                      </template>
                      <template v-slot:append-inner>
                        <v-icon icon="mdi-phone"></v-icon>
                      </template>
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row >
                  <v-col>
                    <v-text-field v-model="loginForm.phoneCode" :rules="loginRules.phoneCode" color="primary"
                                  label="短信验证码（有效期5分钟）" required variant="underlined">
                      <template v-slot:append-inner>
                        <v-icon icon="mdi-message-alert"></v-icon>
                      </template>
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row v-if="captchaEnabled">
                  <v-col>
                    <v-text-field v-model="loginForm.rulesCode" :rules="loginRules.rulesCode" color="primary"
                                  label="点击图片刷新验证码" required variant="underlined">
                      <template v-slot:append-inner>
                        <v-icon icon="mdi-image-edit"></v-icon>
                      </template>
                      <template v-slot:append>
                        <v-img :lazy-src="imgCodeUrl" :src="imgCodeUrl" class="login-code-img" draggable="false"
                               min-width="100px" @click="getImgCode">
                          <template v-slot:placeholder>
                            <v-row align="center" class="fill-height ma-0" justify="center">
                              <v-progress-circular indeterminate></v-progress-circular>
                            </v-row>
                          </template>
                          <template v-slot:error>

                          </template>
                        </v-img>
                      </template>
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <div class="d-flex align-center justify-center" style="font-size: 12px;">
                      注册/登录表示您已同意
                      <p class="text-light_custom_blue_2">《用户协议》</p>及
                      <p class="text-light_custom_blue_2">《隐私政策》</p>
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-btn :loading="loading" block color="light_custom_blue_2" elevation="0"
                           height="48" rounded="pill" @click="handleLogin"
                           @keyup.enter.native="handleKeyUpLoading">登录/注册
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>


              <div v-if="loginPath === 'wechatQr'" style="height: 380px">
                <WxQr/>
              </div>

            </v-col>
          </v-row>
          <v-row dense>
            <v-col>
              <p class="wrap text-subtitle-2">第三方登录</p>
            </v-col>
          </v-row>

          <v-row align="center" justify="center" no-gutters>
            <v-col cols="auto">
              <v-btn v-tooltip="'手机号登录'" :color="loginPath === 'phoneNumber' ? 'light_custom_blue_2' : ''"
                     density="default"
                     icon="mdi-cellphone" variant="plain" @click="handelLogin('phoneNumber')"></v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn v-tooltip="'微信登录'" :color="loginPath === 'wechatQr' ? 'light_custom_blue_2' : ''" class="ml-8"
                     density="default"
                     icon="mdi-wechat" variant="plain" @click="handelLogin('wechatQr')"></v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

    </v-card>

    <!-- 移动端 -->
    <v-row v-else class="w-100 px-6">
      <v-col>
        <v-row>
          <v-col>
            <v-img :src="h5Logo" draggable="false" aspect-ratio="1/1" width="148" height="43"></v-img>
          </v-col>
        </v-row>
        <v-row align="end" class="mt-6" no-gutters>
          <v-col cols="auto">
            <h1>立即开始使用</h1>
          </v-col>
          <v-col class="pb-2 pl-1" cols="auto">
            <div class="rounded-circle bg-blue-lighten-1" style="width: 8px; height: 8px;"></div>
          </v-col>
        </v-row>

        <v-row class="mt-4">
          <v-col>
            <v-form v-if="loginPath === 'phoneNumber'" ref="loginRef" class="h-100">
              <v-row>
                <v-col>
                  <v-text-field v-model="loginForm.phoneNumber" :rules="loginRules.phoneNumber" color="primary"
                                label="手机号" required variant="underlined">
                    <template v-slot:append>
                      <v-progress-circular v-if="isCount" :model-value="timeCont" :size="36" :width="3"
                                           color="primary">{{ timeCont }}
                      </v-progress-circular>
                      <v-btn v-else :disabled="isCodeLoading" :loading="isCodeLoading" variant="plain"
                             @click="getPhoneCode">发送验证码
                      </v-btn>
                    </template>
                    <template v-slot:append-inner>
                      <v-icon icon="mdi-phone"></v-icon>
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field v-model="loginForm.phoneCode" :rules="loginRules.phoneCode" color="primary"
                                label="短信验证码（有效期5分钟）" required variant="underlined">
                    <template v-slot:append-inner>
                      <v-icon icon="mdi-message-alert"></v-icon>
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row v-if="captchaEnabled">
                <v-col>
                  <v-text-field v-model="loginForm.rulesCode" :rules="loginRules.rulesCode" color="primary"
                                label="点击图片刷新验证码" required variant="underlined">
                    <template v-slot:append-inner>
                      <v-icon icon="mdi-image-edit"></v-icon>
                    </template>
                    <template v-slot:append>
                      <v-img :lazy-src="imgCodeUrl" :src="imgCodeUrl" class="login-code-img" draggable="false"
                             min-width="100px" @click="getImgCode">
                        <template v-slot:placeholder>
                          <v-row align="center" class="fill-height ma-0" justify="center">
                            <v-progress-circular indeterminate></v-progress-circular>
                          </v-row>
                        </template>
                        <template v-slot:error>

                        </template>
                      </v-img>
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <div class="d-flex align-center justify-center" style="font-size: 12px;">
                    注册/登录表示您已同意
                    <p class="text-blue-lighten-1">《用户协议》</p>及
                    <p class="text-blue-lighten-1">《隐私政策》</p>
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-btn :loading="loading" block color="light_custom_blue_2" elevation="0"
                         height="48" rounded="pill" @click="handleLogin"
                         @keyup.enter.native="handleKeyUpLoading">登录/注册
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>


            <div v-if="loginPath === 'wechatQr'" style="height: 340px">
              <WxQr/>
            </div>

          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
            <p class="wrap text-subtitle-2">第三方登录</p>
          </v-col>
        </v-row>

        <v-row align="center" justify="center" no-gutters>
          <v-col cols="auto">
            <v-btn v-tooltip="'手机号登录'" :color="loginPath === 'phoneNumber' ? 'light_custom_blue_2' : ''"
                   density="default"
                   icon="mdi-cellphone" variant="plain" @click="handelLogin('phoneNumber')"></v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn v-tooltip="'微信登录'" :color="loginPath === 'wechatQr' ? 'light_custom_blue_2' : ''" class="ml-8"
                   density="default"
                   icon="mdi-wechat" variant="plain" @click="handelLogin('wechatQr')"></v-btn>
          </v-col>
        </v-row>
      </v-col>

    </v-row>

    <UploadBrowser id="uploadBrowser"/>

    <BottomAddToHome id="bottomAddToHome"/>

    <v-bottom-sheet :model-value="true" :retain-focus="false" :scrim="false" :z-index="1" no-click-animation persistent>
      <a class="text-center text-caption" href="https://beian.miit.gov.cn" target="_blank">粤ICP备2023067889号-6</a>
    </v-bottom-sheet>

  </v-container>
</template>

<script setup>
import Cookies from "js-cookie";
import {getCodeImg, getCodePhone} from "@/api/login";

import BottomAddToHome from '@/components/BottomAddToHome'
import UploadBrowser from '@/components/UploadBrowser'
import WxQr from '@/components/WxQr'

import useUserStore from '@/store/modules/user'
import useAppStore from '@/store/modules/app'

const userStore = useUserStore();
const appStore = useAppStore()

const router = useRouter();
const {proxy} = getCurrentInstance();

const h5Logo = computed(() => userStore.icon);

const device = computed(() => useAppStore().device);

const loginPath = ref('phoneNumber')

const wxQrRef = ref(null)

// 倒计时
const state = reactive({
  timeCont: 60,
  timer: null,
  isCount: false,
  isCodeLoading: false // 防止获取本地存储造成短暂可点击
})

const loginForm = ref({
  login_type: "",
  phoneNumber: "", // 13322874990  默认
  phoneCode: "", // 123456
  rulesCode: "",
  uuid: null
});


const loginRules = ref({
  phoneNumber: [v => !!v || "手机号不能为空", v => v.length >= 11 || "手机号至少为11位"],
  phoneCode: [v => !!v || "短信验证码不能为空"],
  rulesCode: [v => !!v || "图形验证码不能为空"]
});

const imgCodeUrl = ref("");
const loading = ref(false);
// 验证码开关
const captchaEnabled = ref(true);

const {timeCont, timer, isCount, isCodeLoading} = toRefs(state)


async function handleLogin() {
  const {valid} = await proxy.$refs.loginRef.validate()
  if (valid) {
    loading.value = true;
    loginForm.value.login_type = 'phone_login'
    // 保存当前手机号在 cookie 中
    Cookies.set("phoneNumber", loginForm.value.phoneNumber, {expires: 30});
    // 调用action的登录方法
    userStore.login(loginForm.value).then(() => {
      router.push({path: "/"});
    }).catch(() => {
      loading.value = false;
      // 重新获取图形验证码
      if (captchaEnabled.value) {
        getImgCode();
      }
    });
  }
}

function getImgCode() {
  getCodeImg({uuid: loginForm.value.uuid}).then(res => {
    captchaEnabled.value = res.captchaEnabled;
    if (captchaEnabled.value) {
      imgCodeUrl.value = "data:image/gif;base64," + res.imgRulesCode;
      if (res.uuid) {
        loginForm.value.uuid = res.uuid;
      }
    }
  });
}

function getPhoneCode() {
  isCodeLoading.value = true;
  getCodePhone({phoneNumber: loginForm.value.phoneNumber, uuid: loginForm.value.uuid}).then(res => {
    if (res.uuid) {
      loginForm.value.uuid = res.uuid;
    }
    countDown()
    isCodeLoading.value = false;
    isCount.value = true;
  });
}

function getCookie() {
  const phoneNumber = Cookies.get("phoneNumber");
  loginForm.value = {
    phoneNumber: phoneNumber === undefined ? loginForm.value.username : phoneNumber,
  };
}

function handleKeyUpLoading(event) {
  if (event.keyCode === 13) {
    handleLogin()
  }
}

function countDown() {
  timeCont.value = 60;
  timer.value = setInterval(() => {
    timeCont.value--;
    if (timeCont.value <= 0) {
      clearInterval(timer.value);
      timeCont.value = 60;
      isCodeLoading.value = false;
      isCount.value = false;
    }
  }, 1000)

}

function handelLogin(value) {
  if (value === 'phoneNumber') {
    loginPath.value = 'phoneNumber'
  } else if (value === 'wechatQr') {
    // 加载微信二维码登录
    loginPath.value = 'wechatQr'

  }

}


// 开启键盘监听事件
window.addEventListener('keydown', handleKeyUpLoading, true)

getCookie();
getImgCode();
</script>

<style lang='scss' scoped>
/* 背景图片样式 */
.desktop-login-form-bg {
  background-image: url("https://ai-workbench.eos-dongguan-7.cmecloud.cn/empty/login_background.webp");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  box-shadow: rgba(99, 99, 99, 0.2) 0 2px 8px 0;
}

.wrap {
  position: relative;
  text-align: center;
  width: 84%;
  margin: 15px auto;
}

/*CSS伪类用法*/
.wrap:after,
.wrap:before {
  position: absolute;
  top: 50%;
  background: #ddd;
  content: "";
  height: 1px;
  width: 14%;
}

/*调整背景横线的左右距离*/
.wrap:before {
  left: 78px;
}

.wrap:after {
  right: 78px;
}

/* 移动端 */
.wrap_mobile {
  position: relative;
  text-align: center;
  width: 84%;
  margin: 15px auto;
}

/*CSS伪类用法*/
.wrap_mobile:after,
.wrap_mobile:before {
  position: absolute;
  top: 50%;
  background: #ddd;
  content: "";
  height: 1px;
  width: 24%;
}

/*调整背景横线的左右距离*/
.wrap_mobile:before {
  left: 16px;
}

.wrap_mobile:after {
  right: 16px;
}
</style>
