<template>
  <div class="h-100 pa-4 bg-light_custom_black_2">
    <div class="px-3 py-3" v-for="(el, index) in componentList" :key="index">
      <div class="d-flex align-center justify-start mb-6">
        <v-icon :icon="el.icon"></v-icon>
        <span class="ml-2 text-h6">{{ el.title }}</span>
      </div>
      <v-row>
        <v-col cols="12" md="3" class="cursor-pointer" v-for="(son, idx) in el.children" :key="son.id">
          <v-card height="135px" hover variant="flat" border>
            <template v-slot:prepend>
              <v-img width="36" draggable="false" aspect-ratio="1/1" cover :src="son.img"></v-img>
            </template>
            <template v-slot:title>
              <p v-tooltip:bottom="son.title" class="text-body-1">{{ son.title }}</p>
            </template>
            <template v-slot:text>
              <p class="overflow-hidden text-ellipsis">{{ son.component_desc }}</p>
            </template>
            <template v-slot:append>
              <v-menu scroll-strategy="close">
                <template v-slot:activator="{ props }">
                  <v-btn density="default" icon="mdi-coffee-to-go-outline" size="small" v-bind="props" variant="text"
                    v-tooltip="'组件添加到AI工作流面板等'"></v-btn>
                </template>
                <v-list>
                  <v-list-item @click="addPublicComponents(son)" v-tooltip="'添加至AI工作流面板中创作'">
                    <template v-slot:prepend>
                      <v-icon icon="mdi-view-grid-plus-outline"></v-icon>
                    </template>
                    <v-list-item-title>添加至AI工作流</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup>
import useCardConfigStore from '@/store/modules/cardConfig'

const { proxy } = getCurrentInstance();

const route = useRoute();
console.log(route.meta.children_id,"路由children_id")

const cardConfigStore = useCardConfigStore();

const componentList = ref([]);

/* 获取公共组件 */
function getPublicComponents() {
  // children_id为1：AI视频 children_id为2：AI音频 children_id为3：AI图片 children_id为4：AI文案
  cardConfigStore.getPublicComponents({children_id: route.meta.children_id}).then((result) => {
    componentList.value = result;
  });
}

/* 添加组件至工作台 */
function addPublicComponents(item) {
  cardConfigStore.addPublicComponents(item).then((result) => {
    if (result.code) {
      proxy.$modal.msgSuccess(result.message);
    }
  })
}

getPublicComponents();

</script>

