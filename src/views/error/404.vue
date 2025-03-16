<template>
  <v-row no-gutters class="h-screen">
    <v-col class="d-flex align-center justify-center">
      <div class="text-center">
        <div class="CardMediaWrapper">
          <img src="@/assets/404_images/img-error-bg.svg" alt="grid" class="w-100" />
          <img src="@/assets/404_images/img-error-blue.svg" alt="grid" class="CardMediaParts" />
          <img src="@/assets/404_images/img-error-text.svg" alt="build" class="CardMediaBuild" />
          <img src="@/assets/404_images/img-error-purple.svg" alt="build" class="CardMediaBuild" />
        </div>
        <h1 class="text-h4 mt-4">{{ message }}</h1>
        <p>
          <small>对不起，您正在寻找的页面不存在。尝试检查URL的错误，<br /> 然后按浏览器上的刷新按钮或尝试在我们的应用程序中找到其他内容</small>
        </p>
        <v-btn variant="flat" color="primary" class="mt-4" replace to="/" prepend-icon="mdi-home">回到首页</v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script setup>
let message = computed(() => {
  return '找不到网页！'
})
</script>

<style lang="scss" >
.CardMediaWrapper {
  max-width: 720px;
  margin: 0 auto;
  position: relative;
}
.CardMediaBuild {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  animation: 5s bounce ease-in-out infinite;
}
.CardMediaParts {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  animation: 10s blink ease-in-out infinite;
}
</style>
