<template>
  <div class="w-100">
      <v-row no-gutters justify="center" align="center">
        <v-col cols="12" md="7">
          <v-card rounded="xl" elevation="0" border color="transparent">
            <v-sheet rounded="xl" class="px-3">
              <div>
                <v-textarea v-model="textData" row-height="2" rows="2" persistent-placeholder persistent-counter auto-grow
                            clearable clear-icon="mdi-close-circle" variant="plain" flat hide-details no-resize
                            placeholder="给AI助手发送信息">
                </v-textarea>
              </div>
              <v-row no-gutters align="center">
                <v-col>
                  <v-row dense>
                    <v-col cols="auto">
                      <v-btn size="small" variant="outlined" rounded="pill">
                        <template v-slot:prepend>
                          <v-icon size="large">mdi-atom</v-icon>
                        </template>
                        深度思考(R1)
                      </v-btn>
                    </v-col>
                    <v-col cols="auto">
                      <v-btn size="small" variant="outlined" rounded="pill">
                        <template v-slot:prepend>
                          <v-icon size="large">mdi-web</v-icon>
                        </template>
                        联网搜索
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="auto">
                  <v-row no-gutters justify="end">
                    <v-col cols="auto">
                      <v-btn variant="flat" icon="mdi-paperclip"></v-btn>
                    </v-col>
                    <v-col cols="auto">
                      <v-btn variant="plain" icon color="primary">
                        <v-icon size="x-large">mdi-arrow-up-circle</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-sheet>

          </v-card>
        </v-col>
      </v-row>

    <div class="text-center text-caption mt-1 text-grey-darken-1">内容由 AI 生成，请仔细甄别</div>

  </div>
</template>

<script setup>

const textData = ref("");

</script>

<style scoped lang="scss">

</style>