<template>
  <v-scroll-x-reverse-transition>
    <v-btn variant="tonal" @click="handelGoToPay" color="yellow-darken-3" rounded>
      <template v-slot:prepend>
        <v-avatar size="30">
          <svg-icon v-if="integral" class-name="text-h5" icon-class="vip" />
          <svg-icon v-else class-name="text-h5" icon-class="not-vip" />
        </v-avatar>
      </template>
      {{ device === 'mobile' ? '' : integral }}
      积分
    </v-btn>
  </v-scroll-x-reverse-transition>
</template>

<script setup>
import useUserStore from '@/store/modules/user'
import useAppStore from '@/store/modules/app'

const appStore = useAppStore()

const userStore = useUserStore()
const router = useRouter();

const integral = computed(() => userStore.integral || 0);
const device = computed(() => appStore.device);

function handelGoToPay() {
  const url = router.resolve({ path: '/pay' });
  window.open(url.href);
}

</script>
