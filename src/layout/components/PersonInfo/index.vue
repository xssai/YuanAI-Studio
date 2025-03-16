<template>
  <v-list >
    <v-list-item height="60">
      <template v-slot:prepend>
        <v-avatar size="40">
          <v-img alt="AI工作台" :src="userStore.avatar" draggable="false"></v-img>
        </v-avatar>
      </template>
      <template v-slot:title>
        <span>{{ userStore.name }}</span>
      </template>
      <template v-slot:subtitle>
        <span>{{ userStore.phone }}</span>
      </template>
      <template v-slot:append>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn density="default" icon="mdi-menu-down" size="small" v-bind="props" variant="text"
                v-tooltip="'我的信息'"></v-btn>
          </template>
          <v-card min-width="165">
            <v-list>
              <v-list-item @click="handleNewHref">
                <template v-slot:prepend>
                  <v-icon icon="mdi-account-outline"></v-icon>
                </template>
                <v-list-item-title>会员中心</v-list-item-title>
              </v-list-item>
              <v-list-item @click="handelGoToPay">
                <template v-slot:prepend>
                  <v-icon icon="mdi-cart-arrow-up"></v-icon>
                </template>
                <v-list-item-title>充值积分</v-list-item-title>
              </v-list-item>
              <v-list-item @click="isUseKey = true">
                <template v-slot:prepend>
                  <v-icon icon="mdi-cloud-key-outline"></v-icon>
                </template>
                <v-list-item-title>积分兑换</v-list-item-title>
              </v-list-item>
              <v-list-item @click="isAddKey = true" v-hasRole="['admin']">
                <template v-slot:prepend>
                  <v-icon>mdi-key-outline</v-icon>
                </template>
                <v-list-item-title>生成卡密</v-list-item-title>
              </v-list-item>
              <v-list-item @click="handelOpenApiKey">
                <template v-slot:prepend>
                  <v-icon>mdi-api</v-icon>
                </template>
                <v-list-item-title>API文档</v-list-item-title>
              </v-list-item>
              <v-dialog v-model="logoutDialog" max-width="400" persistent>
                <template v-slot:activator="{ props: activatorProps }">
                  <v-list-item v-bind="activatorProps">
                    <template v-slot:prepend>
                      <v-icon icon="mdi-exit-to-app"></v-icon>
                    </template>
                    <v-list-item-title>退出登录</v-list-item-title>
                  </v-list-item>
                </template>
                <v-card prepend-icon="mdi-logout" text="确定注销并退出系统吗?" title="提醒">
                  <template v-slot:actions>
                    <v-btn density="default" @click="logout">
                      确定退出
                    </v-btn>
                    <v-btn density="default" @click="logoutDialog = false">
                      继续使用
                    </v-btn>
                  </template>
                </v-card>
              </v-dialog>

            </v-list>
          </v-card>
        </v-menu>
      </template>
    </v-list-item>

    <UseKey id="useKey" v-model="isUseKey" />

    <!-- 临时------------------------ -->
    <!-- 卡密生成 -->
    <v-dialog v-model="isAddKey" max-width="624" location="center" persistent>
      <v-card prepend-icon="mdi-key-outline" title="生成卡密">
        <v-spacer class="mt-2"></v-spacer>
        <v-card-text class="text-center">
          <v-text-field v-model="integral" label="积分数量" type="number" prepend-icon="mdi-rename-outline"
            variant="underlined"></v-text-field>
          <v-text-field v-model="nums" label="卡密数量" type="number" prepend-icon="mdi-rename-outline"
            variant="underlined"></v-text-field>

          <div>
            KEY:
            <div v-for="item in keysContent" :key="item">
              <span class="mr-2">{{ item }}</span>
              <v-btn text="复制卡密" variant="text" @click="copyKey(item)"></v-btn>
            </div>
          </div>

          <div>
            <v-btn text="全部复制" variant="text" @click="copyKeys"></v-btn>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-btn text="生成" variant="text" @click="handleAddKey"></v-btn>
          <v-btn text="关闭" variant="text" @click="isAddKey = false"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-list>
</template>

<script setup>
/* 临时------------------------ */
import { addKey } from '@/api/distribute'
import { checkPermi, checkRole } from "@/utils/permission"; // 权限判断函数
import useUserStore from '@/store/modules/user'
import SvgIcon from "@/components/SvgIcon";
import UseKey from '@/components/UseKey'

const router = useRouter();
const userStore = useUserStore()

// 生成卡密
const isAddKey = ref(false)
const isUseKey = ref(false);

const logoutDialog = ref(false);

const integral = ref(null);
const nums = ref(null);
const keysContent = ref([])

const { proxy } = getCurrentInstance();

const { text, isSupported, copy } = proxy.useClipboard();

/* 临时------------------------ */
function handleAddKey() {
  addKey({ integral: integral.value, nums: nums.value }).then(result => {
    keysContent.value = result.data
  })
}

function copyKeys() {
  // http 或 https 判断复制是否可用
  if (navigator.clipboard) {
    // https
    copy(JSON.stringify(keysContent.value));
  } else {
    // http **已弃用API临时解决方式
    const input = document.createElement('input');
    input.setAttribute('value', JSON.stringify(keysContent.value));
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
  }

  proxy.$modal.msgSuccess('已全部复制到剪贴板');
}
function copyKey(key) {
  // http 或 https 判断复制是否可用
  if (navigator.clipboard) {
    // https
    copy(key);
  } else {
    // http **已弃用API临时解决方式
    const input = document.createElement('input');
    input.setAttribute('value', key);
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
  }

  proxy.$modal.msgSuccess('单个复制完成');
}

function logout() {
  userStore.logOut().then(() => {
    location.href = '/'; // '/index'
  })
}

function handelGoToPay() {
  const url = router.resolve({ path: '/pay' });
  window.open(url.href);
}

function handleNewHref() {
  // 路径新窗口打开
  window.open('/user', '_blank');
}

function handelOpenApiKey() {
  // 路径新窗口打开
  window.open('/apikey', '_blank');
}

</script>