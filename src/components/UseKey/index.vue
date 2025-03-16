<template>
  <v-dialog v-model="isUseKey" max-width="624" location="center" persistent>
    <v-card prepend-icon="mdi-key-outline" title="积分兑换">
      <v-card-text>
        <v-form ref="useKeyRef">
          <v-text-field v-model="keys" :rules="useKeyRules.keys" label="填写对应的卡密用于兑换积分"
            prepend-icon="mdi-rename-outline" variant="underlined">
          </v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn text="兑换" variant="flat" color="light_custom_blue_2" @click="handleUseKey"></v-btn>
        <v-btn text="关闭" variant="plain" color="light_custom_blue_2" @click="isUseKey = false"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { addKey, useKey } from '@/api/distribute'
import useUserStore from '@/store/modules/user'

const { proxy } = getCurrentInstance();

const { text, isSupported, copy } = proxy.useClipboard();

const isUseKey = defineModel();

const useKeyRules = ref({
  keys: [v => !!v || "请填写兑换积分密钥"],
});

// 使用卡密
const keys = ref("");

async function handleUseKey() {
  const { valid } = await proxy.$refs.useKeyRef.validate()
  if (valid) {
    useKey({ card: keys.value }).then(result => {
      isUseKey.value = false
      proxy.$modal.msgSuccess(result.message);
      keys.value = ""
      useUserStore().getInfo()
    })
  }

}

</script>
