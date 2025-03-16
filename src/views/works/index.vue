<template>
  <div class="pa-4">
    <div class="px-3 py-3" v-for="(el, index) in componentList" :key="index">
      <div class="d-flex align-center mb-3">
        <v-icon :icon="el.icon"></v-icon>
        <span class="ml-2 text-h6">{{ el.title }}</span>
      </div>
      <v-row>
        <v-col md="3" class="cursor-pointer" v-for="(son, idx) in el.children" :key="son.id">
          <v-card min-width="98px" >
            <template v-slot:prepend>
              <v-img :width="24" aspect-ratio="1/1" cover :src="son.img"></v-img>
            </template>
            <template v-slot:title>
              <span v-tooltip:bottom="son.title" class="text-body-1">{{ son.title }}</span>
            </template>
            <template v-slot:subtitle>
              <span>{{ son.desc }}</span>
            </template>
            <template v-slot:append>
              <v-menu scroll-strategy="close">
                <template v-slot:activator="{ props }">
                  <div>
                    <v-btn density="default" icon="mdi-chevron-right" size="small" v-bind="props" variant="text"
                      v-tooltip="'组件设置'"></v-btn>
                  </div>
                </template>
                <v-card min-width="168">
                  <v-list>
                    <v-list-item>
                      <template v-slot:title>
                        <v-btn density="default" variant="text" @click="addPublicComponents(son)">
                          <template v-slot:prepend>
                            <v-icon icon="mdi-import"></v-icon>
                          </template>
                          <span>添加到AI工作流</span>
                        </v-btn>
                      </template>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-menu>
            </template>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup name="AiVideo">
import useCardConfigStore from '@/store/modules/cardConfig'

const { proxy } = getCurrentInstance();

const cardConfigStore = useCardConfigStore();

const componentList = ref([]);

/* 获取公共组件 */
function getPublicComponents() {
  // children_id为1：AI视频 children_id为2：AI音频 children_id为3：AI图片 children_id为4：AI文案
  cardConfigStore.getPublicComponents({children_id: 1}).then((result) => {
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

<style scoped lang="scss"></style>
