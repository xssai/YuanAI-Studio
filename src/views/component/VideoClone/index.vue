<template>
  <v-container ref="VideoCloneWindowRef" fluid class="px-0 py-0 pt-3 h-100">

    <v-form ref="videoCloneRef">
      <v-row no-gutters align="center" justify="center">
        <v-col cols="auto">
          <v-btn-toggle v-model="gen_type" color="light_custom_blue_2" rounded="xl" group density="compact" mandatory>
            <v-btn v-for="item in videoCloneModelList" :key="item.id" :value="item.model" :disabled="isLoading">{{
              item.details }}</v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>

      <v-row>
        <v-col v-if="gen_type === 'text_driven'">
          <v-textarea :rules="videoCloneRules.message" v-model="message" density="compact" clear-icon="mdi-close-circle"
            variant="outlined" placeholder="输入口播台词" clearable rows="8" :loading="isLoading" counter="1000"
            :disabled="isLoading"></v-textarea>
        </v-col>


        <v-col v-if="gen_type === 'audio_driven'">
          <v-tooltip>
            <template v-slot:activator="{ props }">
              <p class="text-subtitle-2 font-weight-bold mb-3">口播音频</p>
              <v-file-upload v-model="audioFigureFiles" v-bind="props" :disabled="isLoading" icon="mdi-plus" density="compact" variant="compact" clearable title="拖拽或点击上传" show-size></v-file-upload>
            </template>
            <p class="text-subtitle-2">音频文件上传要求</p>
            <p class="text-caption">文件格式：mp3、m4a、wav</p>
            <p class="text-caption">音频时长：5秒～5分钟</p>
          </v-tooltip>
        </v-col>
      </v-row>

      <v-row no-gutters align="center" justify="space-between" v-if="gen_type === 'text_driven'">
        <v-col>
          <p class="text-subtitle-2 font-weight-bold">音色</p>
        </v-col>
        <v-col cols="auto" md="auto">
          <v-dialog max-width="1280" location="center">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn v-bind="activatorProps" :loading="isLoading" :disabled="isLoading" variant="tonal"
                color="light_custom_blue_2">{{ audioExampleSelect.name }}</v-btn>
            </template>
            <template v-slot:default="{ isActive }">
              <v-card>
                <template v-slot:title>
                  <v-row align="center" justify="space-between">
                    <v-col cols="auto">
                      <div class="text-h5 text-medium-emphasis ps-2">选择发音人</div>
                    </v-col>
                    <v-col cols="auto">
                      <v-btn
                          icon="mdi-close"
                          variant="text"
                          @click="isActive.value = false"
                      ></v-btn>
                    </v-col>
                  </v-row>
                </template>
                <div class="px-4 mb-1">
                  <v-tabs v-model="audioExampleTab" class="mb-3" color="light_custom_blue_2">
                    <v-tab class="font-weight-bold" value="audioCustom">我的克隆</v-tab>
                    <v-tab class="font-weight-bold" value="audioPlatform">平台克隆</v-tab>
                    <v-tab class="font-weight-bold" value="audioPublic">公共声音</v-tab>
                  </v-tabs>
                </div>
                <v-tabs-window v-model="audioExampleTab">
                  <v-tabs-window-item value="audioCustom">
                    <v-item-group v-model="audioExampleSelect" mandatory>
                      <v-container class="overflow-y-auto" fluid height="520">
                        <v-row v-if="audioCloneTemplateCustomList.length">
                          <v-col v-for="(item, index) in audioCloneTemplateCustomList" :key="item.id"
                                 cols="12" md="4">
                            <v-item v-slot="{ isSelected, toggle }" :value="item">
                              <v-list-item :disabled="item.status !== 2" :active="isSelected" class="px-2 py-2" color="light_custom_blue_2" nav
                                           rounded="lg"
                                           @click="toggle">
                                <template v-slot:prepend>
                                  <v-avatar border="false" rounded="false">
                                    <svg-icon class-name="text-h4" icon-class="voice"/>
                                  </v-avatar>
                                </template>

                                <v-list-item-title>{{ item.name }}</v-list-item-title>
                                <v-list-item-subtitle>
                                  <div class="d-flex overflow-x-hidden">
                                    <span class="text-caption text-red font-weight-bold" v-if="item.status===4">{{ translate(item.status) }}</span>
                                    <span class="text-caption" v-else>{{ translate(item.status) }}</span>
                                  </div>
                                  <div class="text-caption flex-shrink-0">任务开始:
                                    {{ formatDate(item.clone_time) }}
                                  </div>
                                </v-list-item-subtitle>
                                <template v-slot:append>
                                  <v-menu scroll-strategy="close">
                                    <template v-slot:activator="{ props }">
                                      <v-btn v-tooltip="'选项'" density="default" icon="mdi-chevron-right"
                                             size="small"
                                             v-bind="props" variant="text"></v-btn>
                                    </template>

                                    <v-list>
                                      <v-list-item :disabled="item.clone_address === null"
                                                   @click="playAudio(item.clone_address)">
                                        <template v-slot:prepend>
                                          <v-icon icon="mdi-ear-hearing"></v-icon>
                                        </template>
                                        <v-list-item-title>
                                          预览声音
                                          <span v-if="item.select_model === 'v3'">(V3模式不支持预览)</span>
                                        </v-list-item-title>
                                      </v-list-item>

                                      <v-list-item :disabled="item.clone_address === null"
                                                   @click="downloadsAudio(item.clone_address)">
                                        <template v-slot:prepend>
                                          <v-icon icon="mdi-cloud-arrow-down-outline"></v-icon>
                                        </template>
                                        <v-list-item-title>下载音频</v-list-item-title>
                                      </v-list-item>

                                      <v-list-item :disabled="item.clone_address === null"
                                                   @click="copyUrl(item.clone_address)">
                                        <template v-slot:prepend>
                                          <v-icon icon="mdi-image-multiple"></v-icon>
                                        </template>
                                        <v-list-item-title>复制链接</v-list-item-title>
                                      </v-list-item>

                                      <v-list-item @click="delAudioCloneTask(item.id)">
                                        <template v-slot:prepend>
                                          <v-icon icon="mdi-delete-outline"></v-icon>
                                        </template>
                                        <v-list-item-title>删除任务</v-list-item-title>
                                      </v-list-item>

                                    </v-list>

                                  </v-menu>
                                </template>


                              </v-list-item>

                            </v-item>
                          </v-col>
                        </v-row>

                        <!-- 空状态 -->
                        <v-empty-state v-else height="380"
                                       image="https://cdn.vuetifyjs.com/docs/images/components/v-empty-state/teamwork.png">
                          <template v-slot:title>
                            <div class="text-subtitle-2 mt-8">
                              暂无声音克隆数据
                            </div>
                          </template>

                          <template v-slot:text>
                            <div class="text-caption">
                              前往创建声音克隆后再查看
                            </div>
                          </template>
                        </v-empty-state>
                      </v-container>
                    </v-item-group>
                  </v-tabs-window-item>

                  <v-tabs-window-item value="audioPlatform">
                    <v-item-group v-model="audioExampleSelect" mandatory>
                      <v-container class="overflow-y-auto" fluid height="520">
                        <v-row v-if="audioCloneTemplatePlatformList.length">
                          <v-col v-for="(item, index) in audioCloneTemplatePlatformList"
                                 :key="item.id" cols="12"
                                 md="4">
                            <v-item v-slot="{ isSelected, toggle }" :value="item">
                              <v-list-item :disabled="item.status !== 2" :active="isSelected" class="px-2 py-2" color="light_custom_blue_2" nav
                                           rounded="lg"
                                           @click="toggle">
                                <template v-slot:prepend>
                                  <v-avatar border="false" rounded="false">
                                    <svg-icon class-name="text-h4" icon-class="voice"/>
                                  </v-avatar>
                                </template>

                                <v-list-item-title>{{ item.name }}</v-list-item-title>
                                <v-list-item-subtitle>
                                  <div class="d-flex overflow-x-hidden">
                                    <span class="text-caption text-red font-weight-bold" v-if="item.status===4">{{ translate(item.status) }}</span>
                                    <span class="text-caption" v-else>{{ translate(item.status) }}</span>
                                  </div>
                                  <div class="text-caption flex-shrink-0">任务开始:
                                    {{ formatDate(item.clone_time) }}
                                  </div>
                                </v-list-item-subtitle>
                                <template v-slot:append>
                                  <v-menu scroll-strategy="close">
                                    <template v-slot:activator="{ props }">
                                      <v-btn v-tooltip="'选项'" density="default" icon="mdi-chevron-right"
                                             size="small"
                                             v-bind="props" variant="text"></v-btn>
                                    </template>

                                    <v-list>
                                      <v-list-item :disabled="item.clone_address == null"
                                                   @click="playAudio(item.clone_address)">
                                        <template v-slot:prepend>
                                          <v-icon icon="mdi-ear-hearing"></v-icon>
                                        </template>
                                        <v-list-item-title>预览声音</v-list-item-title>
                                      </v-list-item>
                                    </v-list>

                                  </v-menu>
                                </template>


                              </v-list-item>

                            </v-item>
                          </v-col>
                        </v-row>

                        <!-- 空状态 -->
                        <v-empty-state v-else height="380"
                                       image="https://cdn.vuetifyjs.com/docs/images/components/v-empty-state/teamwork.png">
                          <template v-slot:title>
                            <div class="text-subtitle-2 mt-8">
                              暂无声音克隆数据
                            </div>
                          </template>

                          <template v-slot:text>
                            <div class="text-caption">
                              前往创建声音克隆后再查看
                            </div>
                          </template>
                        </v-empty-state>
                      </v-container>
                    </v-item-group>
                  </v-tabs-window-item>

                  <v-tabs-window-item value="audioPublic">
                    <v-item-group v-model="audioExampleSelect" mandatory>
                      <v-container class="overflow-y-auto" fluid height="520">
                        <v-row v-if="audioCloneTemplatePublicList.length">
                          <v-col v-for="(item, index) in audioCloneTemplatePublicList" :key="item.id"
                                 cols="12" md="4">
                            <v-item v-slot="{ isSelected, toggle }" :value="item">
                              <v-list-item :active="isSelected" class="px-2 py-2" color="light_custom_blue_2" nav
                                           rounded="lg"
                                           @click="toggle">
                                <template v-slot:prepend>
                                  <v-avatar border="false" rounded="false">
                                    <svg-icon class-name="text-h4" icon-class="voice"/>
                                  </v-avatar>
                                </template>

                                <v-list-item-title>{{ item.name }}</v-list-item-title>

                                <v-list-item-subtitle>
                                  <span class="text-caption">语言：{{ item.languages }}</span>
                                  <span class="ml-4 text-caption">风格：{{ item.timbre_info }}</span>
                                </v-list-item-subtitle>

                                <template v-slot:append>
                                  <v-menu scroll-strategy="close">
                                    <template v-slot:activator="{ props }">
                                      <div>
                                        <v-btn v-tooltip="'选项'" density="default" icon="mdi-chevron-right"
                                               size="small"
                                               v-bind="props" variant="text"></v-btn>
                                      </div>
                                    </template>
                                    <v-list>
                                      <v-list-item :disabled="item.preview_url === null"
                                                   @click="playAudio(item.preview_url)">
                                        <template v-slot:prepend>
                                          <v-icon icon="mdi-ear-hearing"></v-icon>
                                        </template>
                                        <v-list-item-title>预览声音</v-list-item-title>
                                      </v-list-item>
                                    </v-list>

                                  </v-menu>
                                </template>


                              </v-list-item>

                            </v-item>
                          </v-col>
                        </v-row>

                        <!-- 空状态 -->
                        <v-empty-state v-else height="380"
                                       image="https://cdn.vuetifyjs.com/docs/images/components/v-empty-state/teamwork.png">
                          <template v-slot:title>
                            <div class="text-subtitle-2 mt-8">
                              暂无声音克隆数据
                            </div>
                          </template>

                          <template v-slot:text>
                            <div class="text-caption">
                              前往创建声音克隆后再查看
                            </div>
                          </template>
                        </v-empty-state>
                      </v-container>
                    </v-item-group>
                  </v-tabs-window-item>
                </v-tabs-window>

                <template v-slot:actions>
                  <v-btn color="light_custom_blue_2" text="确认" variant="flat"
                         @click="isActive.value = false"></v-btn>
                  <v-btn color="light_custom_blue_2" text="取消" variant="plain"
                         @click="isActive.value = false"></v-btn>

                </template>

              </v-card>
            </template>
          </v-dialog>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-dialog max-width="1270" location="center">
            <template v-slot:activator="{ props: activatorProps }">
              <div v-if="exampleSelect.id" style="height:110px; position: relative;" v-bind="activatorProps"
                class="overflow-hidden rounded">
                <div class="backgroud_Img_full" :style="{ 'background-image': `url(${exampleSelect.cover})` }"></div>
                <v-img rounded="sm" draggable="false" :src="exampleSelect.cover" :lazy-src="exampleSelect.cover"
                  height="100%" content-class="d-flex flex-column justify-end align-center">
                  <p class="w-100 text-subtitle-1 font-weight-medium text-white text-center rounded-sm">{{
                    exampleSelect.name }}
                  </p>
                </v-img>
                <div class="position-absolute top-0 h-100 d-flex align-center" style="right: 6%;">
                  <v-icon icon="mdi-swap-horizontal" size="28" color="#ffffff"></v-icon>
                </div>
              </div>

              <div v-else v-bind="activatorProps" class="rounded border d-flex align-center justify-center flex-column"
                style="height:110px;">
                <v-icon>mdi-plus</v-icon>
                <p class="text-body-2">选择真人分身/数字分身</p>
              </div>

            </template>
            <template v-slot:default="{ isActive }">
              <v-card>
                <template v-slot:title>
                  <span class="text-subtitle-1">选择真人分身模板</span>
                </template>
                <div class="px-4 mb-1">
                  <v-tabs v-model="exampleTab" color="light_custom_blue_2">
                    <v-tab value="custom" class="font-weight-bold">我的专属真人分身</v-tab>
                    <v-tab value="public" class="font-weight-bold">平台数字分身资产</v-tab>
                  </v-tabs>
                </div>

                <v-tabs-window v-model="exampleTab">
                  <v-tabs-window-item value="custom">
                    <v-item-group selected-class="bg-primary" mandatory v-model="exampleSelect">
                      <v-container fluid height="540" class="overflow-y-auto">
                        <v-row>
                          <v-col cols="12" md="3">
                            <div style="height: 250px" @click="videoCloneTemplateDialog = true"
                              class="d-flex flex-column justify-center align-center bg-light_custom_blue_1 rounded-sm">
                              <v-icon size="38" color="light_custom_blue_2">mdi-plus</v-icon>
                              <p class="w-100 font-weight-medium text-center mt-4 text-light_custom_blue_2">创建我的真人分身</p>
                            </div>
                          </v-col>

                          <v-col v-for="i in videoCloneTemplateCustomList" :key="i.id" cols="12" md="3">
                            <v-item v-if="i.status === 2" v-slot="{ isSelected, toggle }" :value="i">
                              <v-img rounded="sm" draggable="false" :src="i.cover" :lazy-src="i.cover" height="250"
                                cover content-class="d-flex flex-column justify-end align-end overflow-hidden"
                                @click="toggle">
                                <div class="position-absolute top-0 left-0 pt-2 pl-2">
                                  <v-menu scroll-strategy="close">
                                    <template v-slot:activator="{ props }">
                                      <v-btn v-bind="props" color="#ffffff" v-tooltip="'任务项设置'" variant="text"
                                        density="comfortable" icon>
                                        <v-icon>mdi-cog-outline</v-icon>
                                      </v-btn>
                                    </template>
                                    <v-list>
                                      <v-list-item :disabled="i.clone_address == null"
                                        @click="playerVideo(i.clone_address)">
                                        <template v-slot:prepend>
                                          <v-icon icon="mdi-video-4k-box"></v-icon>
                                        </template>
                                        <v-list-item-title>预览形象</v-list-item-title>
                                      </v-list-item>

                                      <v-list-item :disabled="i.clone_address == null"
                                        @click="downloadsVideo(i.clone_address)">
                                        <template v-slot:prepend>
                                          <v-icon icon="mdi-cloud-arrow-down-outline"></v-icon>
                                        </template>
                                        <v-list-item-title>下载形象</v-list-item-title>
                                      </v-list-item>

                                      <v-list-item :disabled="i.clone_address == null"
                                        @click="copyUrl(i.clone_address)">
                                        <template v-slot:prepend>
                                          <v-icon icon="mdi-image-multiple"></v-icon>
                                        </template>
                                        <v-list-item-title>复制链接</v-list-item-title>
                                      </v-list-item>

                                      <v-list-item @click="delVideoCloneTemplates(i.id)">
                                        <template v-slot:prepend>
                                          <v-icon icon="mdi-delete-outline"></v-icon>
                                        </template>
                                        <v-list-item-title>删除</v-list-item-title>
                                      </v-list-item>

                                    </v-list>
                                  </v-menu>
                                </div>
                                <div class="position-absolute top-0 right-0 pt-2 pr-2">
                                  <v-btn density="comfortable" variant="text" icon @click="toggle"
                                    :color="isSelected ? 'light_custom_blue_2' : '#ffffff'">
                                    <v-icon>mdi-checkbox-multiple-marked-circle-outline</v-icon>
                                  </v-btn>
                                </div>

                                <p class="w-100 text-h6 font-weight-medium text-white text-center"
                                  style="background-color: rgba(0, 0, 0, 0.4);">
                                  {{ i.name }}
                                </p>

                                <template v-slot:placeholder>
                                  <v-row align="center" class="fill-height ma-0" justify="center">
                                    <v-progress-circular color="#ffffff" indeterminate></v-progress-circular>
                                  </v-row>
                                </template>
                              </v-img>
                            </v-item>


                            <v-item v-else v-slot="{ isSelected, toggle }" :value="i">
                              <v-img rounded="sm" draggable="false" :src="i.cover" height="250" cover
                                content-class="d-flex flex-column justify-center align-center"
                                gradient="to top right, rgba(0,0,0,.35), rgba(0,0,0,.35)">
                                <v-progress-circular :model-value="rate(i.status)" :rotate="360" :size="80" :width="3"
                                  color="white">
                                  <template v-slot:default> {{ rate(i.status) }} % </template>
                                </v-progress-circular>
                                <div class="mt-4 text-white text-subtitle-2">
                                  <span>{{ i.name }}</span>
                                  <span>{{ translate(i.status) }}</span>
                                </div>
                              </v-img>
                            </v-item>

                          </v-col>
                        </v-row>
                      </v-container>
                    </v-item-group>
                  </v-tabs-window-item>

                  <v-tabs-window-item value="public">
                    <v-item-group selected-class="bg-primary" mandatory v-model="exampleSelect">
                      <v-container fluid height="540" class="overflow-y-auto">
                        <v-row>
                          <v-col v-for="i in videoCloneTemplatePublicList" :key="i.id" cols="12" md="3">
                            <v-item v-slot="{ isSelected, toggle }" :value="i">
                              <v-img rounded="sm" draggable="false" :src="i.cover" :lazy-src="i.cover" height="250"
                                cover content-class="d-flex flex-column justify-end align-end overflow-hidden"
                                @click="toggle">
                                <div class="position-absolute top-0 left-0 pt-2 pl-2">
                                  <v-menu scroll-strategy="close">
                                    <template v-slot:activator="{ props }">
                                      <v-btn v-bind="props" variant="text" color="#ffffff" v-tooltip="'任务项设置'"
                                        class="transition-fast-in-fast-out" density="comfortable" icon>
                                        <v-icon>mdi-cog-outline</v-icon>
                                      </v-btn>
                                    </template>
                                    <v-list>
                                      <v-list-item :disabled="i.wm_address === null" @click="playerVideo(i.wm_address)">
                                        <template v-slot:prepend>
                                          <v-icon icon="mdi-video-4k-box"></v-icon>
                                        </template>
                                        <v-list-item-title>预览形象</v-list-item-title>
                                      </v-list-item>
                                    </v-list>

                                  </v-menu>
                                </div>

                                <div class="position-absolute top-0 right-0 pt-2 pr-2 ">
                                  <v-btn density="comfortable" variant="text" icon @click="toggle"
                                    :color="isSelected ? 'light_custom_blue_2' : '#ffffff'">
                                    <v-icon>mdi-checkbox-multiple-marked-circle-outline</v-icon>
                                  </v-btn>
                                </div>
                                <p class="w-100 text-h6 font-weight-medium text-white text-center"
                                  style="background-color: rgba(0, 0, 0, 0.4); ">
                                  {{ i.name }}
                                </p>
                                <template v-slot:placeholder>
                                  <v-row align="center" class="fill-height ma-0" justify="center">
                                    <v-progress-circular color="#ffffff" indeterminate></v-progress-circular>
                                  </v-row>
                                </template>
                              </v-img>
                            </v-item>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-item-group>
                  </v-tabs-window-item>
                </v-tabs-window>

                <template v-slot:actions>
                  <v-btn @click="isActive.value = false" variant="flat" color="light_custom_blue_2" text="确认"></v-btn>
                  <v-btn @click="isActive.value = false" variant="plain" color="light_custom_blue_2" text="取消"></v-btn>
                </template>
              </v-card>
            </template>
          </v-dialog>
        </v-col>
      </v-row>


      <v-row>
        <v-col>
          <div class="text-subtitle-2 font-weight-bold mb-3">作品名称（选填）</div>
          <v-text-field v-model="taskname" :rules="videoCloneRules.taskname" placeholder="作品名称"
            prepend-inner-icon="mdi-rename-outline" density="compact" variant="outlined" :loading="isLoading"
            :disabled="isLoading"></v-text-field>
        </v-col>
      </v-row>
    </v-form>



    <v-dialog v-model="videoCloneTemplateDialog" max-width="680">
      <v-card>
        <template v-slot:title>
          <span class="text-subtitle-1">创建真人分身</span>
        </template>
        <v-card-text>
          <v-form ref="figureRef">
            <v-row no-gutters>
              <v-col>
                <div class="text-subtitle-2 font-weight-bold mb-3">分身名称</div>
                <v-text-field v-model="name" :rules="figureRules.name" placeholder="分身名称(建议不超15字)"
                  prepend-inner-icon="mdi-rename-outline" density="compact" variant="outlined"
                  :loading="isFigureLoading" :disabled="isFigureLoading"></v-text-field>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col>
                <div class="text-subtitle-2 font-weight-bold mb-3">真人分身</div>
                <v-file-upload v-model="figureFiles" :disabled="isLoading" :rules="figureRules.figureFiles" icon="mdi-plus" density="compact" variant="compact" clearable accept="video/*" title="拖拽或点击上传（支持批量）" show-size multiple></v-file-upload>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <p class="text-subtitle-2 font-weight-bold mb-3">克隆模式</p>
                <v-select v-model="select_model" :rules="figureRules.select_model" density="compact" variant="outlined"
                  :items="figureCloneModelList" item-title="details" item-value="model"
                   hide-details :loading="isFigureLoading" :disabled="isFigureLoading"
                  prepend-inner-icon="mdi-vector-radius">
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props" :subtitle="item.raw.model + '模式'"></v-list-item>
                  </template>
                </v-select>
              </v-col>
            </v-row>

            <v-tooltip text="Tooltip">
              <template v-slot:activator="{ props }">
                <v-row>
                  <v-col cols="6">
                    <p v-bind="props" class="text-caption pl-3">注意事项？</p>
                  </v-col>
                </v-row>
              </template>
              <div>
                <p class="text-caption">出镜人要求:</p>
                <p class="text-caption">1. 眼睛需要正视镜头，避免眼神飘忽不定等情况</p>
                <p class="text-caption">2. 避免穿着高领衣衫，或其余衣领盖过脖子的服装</p>
                <p class="text-caption">3. 停止说话时嘴巴需要闭合，并无大幅转头、偏头、摇头等情况</p>
                <p class="text-caption">4. 确保情绪状态、手势动作、神情等，符合需要制作视频的风格调性</p>
                <p class="text-caption">5. 避免手势动作、物品（如麦克风、饰品等）盖住、划过脖子以上部位</p>
              </div>
              <div class="mt-2">
                <p class="text-caption">拍摄要求:</p>
                <p class="text-caption">1. 眼睛需要正视镜头，避免眼神飘忽不定等情况</p>
                <p class="text-caption">2. 避免穿着高领衣衫，或其余衣领盖过脖子的服装</p>
                <p class="text-caption">3. 停止说话时嘴巴需要闭合，并无大幅转头、偏头、摇头等情况</p>
                <p class="text-caption">4. 确保情绪状态、手势动作、神情等，符合需要制作视频的风格调性</p>
                <p class="text-caption">5. 避免手势动作、物品（如麦克风、饰品等）盖住、划过脖子以上部位</p>
              </div>
              <div class="mt-2">
                <p class="text-caption">上传真人分身要求:</p>
                <p class="text-caption">1. 上传的视频分辨率不应低于720p，建议分辨率为1080p</p>
                <p class="text-caption">2. 上传的视频应全程无剪辑、跳帧，视频长度不应少于1分钟，不超过5分钟</p>
                <p class="text-caption">3. 上传的视频中只能包含一张脸，不能使用多人的视频</p>
                <p class="text-caption">4. 上传的视频大小不能超过500MB</p>
              </div>
            </v-tooltip>

            <v-row dense>
              <v-col>
                <v-checkbox v-model="disclaimer" :rules="figureRules.disclaimer" color="light_custom_blue_2"
                  value="true" :disabled="isFigureLoading">
                  <template v-slot:label>
                    <span>已阅读并同意</span>
                    <span class="text-light_custom_blue_2">《免责声明》</span>
                  </template>
                </v-checkbox>
              </v-col>
            </v-row>
          </v-form>



<!--          <v-tooltip text="Tooltip">-->
<!--            <template v-slot:activator="{ props }">-->
<!--              <v-row no-gutters>-->
<!--                <v-col cols="6">-->
<!--                  <p v-bind="props" class="text-caption pl-4">出镜人要求有哪些?</p>-->
<!--                </v-col>-->
<!--              </v-row>-->
<!--            </template>-->
<!--            <p class="text-caption">1. 眼睛需要正视镜头，避免眼神飘忽不定等情况</p>-->
<!--            <p class="text-caption">2. 避免穿着高领衣衫，或其余衣领盖过脖子的服装</p>-->
<!--            <p class="text-caption">3. 停止说话时嘴巴需要闭合，并无大幅转头、偏头、摇头等情况</p>-->
<!--            <p class="text-caption">4. 确保情绪状态、手势动作、神情等，符合需要制作视频的风格调性</p>-->
<!--            <p class="text-caption">5. 避免手势动作、物品（如麦克风、饰品等）盖住、划过脖子以上部位</p>-->
<!--          </v-tooltip>-->


<!--          <v-tooltip text="Tooltip">-->
<!--            <template v-slot:activator="{ props }">-->
<!--              <v-row no-gutters>-->
<!--                <v-col cols="6">-->
<!--                  <p v-bind="props" class="text-caption pl-4">拍摄要求有哪些？</p>-->
<!--                </v-col>-->
<!--              </v-row>-->
<!--            </template>-->
<!--            <p class="text-caption">1. 视频光线：光线充足但不过曝，确保脸部阴影均匀</p>-->
<!--            <p class="text-caption">2. 画面稳定：确保视频无晃动、无美颜、无特效等情况</p>-->
<!--            <p class="text-caption">3. 拍摄背景：建议拍摄视频的背景相对简洁，无过多花纹等元素</p>-->
<!--            <p class="text-caption">4. 上传视频：周围安静无环境噪音，确保无其他人声掺入，视频音画需同步（声音与口型对应）</p>-->
<!--          </v-tooltip>-->

<!--          <v-spacer class="mt-2"></v-spacer>-->

<!--          <v-tooltip text="Tooltip">-->
<!--            <template v-slot:activator="{ props }">-->
<!--              <v-row no-gutters class="d-flex align-center">-->
<!--                <v-col cols="6">-->
<!--                  <p v-bind="props" class="text-caption pl-4">上传要求有哪些？</p>-->
<!--                </v-col>-->
<!--              </v-row>-->
<!--            </template>-->
<!--            <div>-->
<!--              <p class="text-caption">1. 上传的视频分辨率不应低于720p，建议分辨率为1080p</p>-->
<!--              <p class="text-caption">2. 上传的视频应全程无剪辑、跳帧，视频长度不应少于1分钟，不超过5分钟</p>-->
<!--              <p class="text-caption">3. 上传的视频中只能包含一张脸，不能使用多人的视频</p>-->
<!--              <p class="text-caption">4. 上传的视频大小不能超过500MB</p>-->
<!--            </div>-->
<!--          </v-tooltip>-->

<!--          <v-spacer class="mt-4"></v-spacer>-->

          <v-row justify="space-around" align="center">
            <v-col v-for="item in descList" :key="item" cols="6" md="auto"
              class="d-flex justify-center align-center flex-column">
              <v-img draggable="false" :src="item.descImg" width="48" cover></v-img>
              <div class="text-overline">{{ item.descName }}</div>
            </v-col>
          </v-row>

          <v-spacer class="mt-2"></v-spacer>
        </v-card-text>

        <v-card-actions>
          <v-btn @click="videoCloneTemplateDialog = false;" variant="plain" color="light_custom_blue_2"
            text="取消"></v-btn>
          <v-btn @click="addVideoCloneTemplates" variant="flat" color="light_custom_blue_2" text="确认创建"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>



    <v-row justify="center" align="center">
      <v-col cols="auto">
        <v-btn variant="flat" :loading="isLoading" :disabled="isLoading" prepend-icon="mdi-video-account"
          color="light_custom_blue_2" @click="addVideoClones">生成作品</v-btn>
      </v-col>
    </v-row>


  </v-container>
</template>

<script setup>
import { addVideoCloneTemplate, addVideoClone, getVideoClone, delVideoClone } from '@/api/sheet/VideoFigure'
import { rate, translate } from '@/utils/match'
import useCloneModelStore from '@/store/modules/cloneModel'
import useCloneDataStore from '@/store/modules/cloneData'
import useVideoPlayerStore from "@/store/modules/videoPlayer"


const { proxy } = getCurrentInstance();
const { text, isSupported, copy } = proxy.useClipboard();

const audio = new Audio();

const cloneModelStore = useCloneModelStore();
const cloneDataStore = useCloneDataStore();
const videoPlayerStore = useVideoPlayerStore();

const isLoading = ref(false);
const isFigureLoading = ref(false);
const audioExampleTab = ref('audioCustom');
const exampleTab = ref('custom');
const videoCloneTemplateDialog = ref(false);

const audioFigureFiles = ref(null);
const figureFiles = ref([]);

const descList = ref([
  {
    descName: "多个人脸",
    descImg: 'https://ai-workbench.eos-dongguan-7.cmecloud.cn/desc/moreface.png'
  },
  {
    descName: "人脸不要出屏幕",
    descImg: 'https://ai-workbench.eos-dongguan-7.cmecloud.cn/desc/2.png'
  },
  {
    descName: "脸部遮挡",
    descImg: 'https://ai-workbench.eos-dongguan-7.cmecloud.cn/desc/1.png'
  },
  {
    descName: "检测不到人脸",
    descImg: 'https://ai-workbench.eos-dongguan-7.cmecloud.cn/desc/noface.png'
  }
])

const figureRules = ref({
  name: [v => !!v || "请为您的真人分身命名"],
  select_model: [v => !!v || "请选择形象克隆模式"],
  // figureFiles: [v => !!v.length || "请上传AI分身底板视频", isFigureFileMinValidate, isFigureFileMaxValidate],
  disclaimer: [v => !!v || "请勾选已阅读并同意《免责声明》"]
});

const videoCloneRules = ref({
  taskname: [v => !!v || "请为您的数字人命名"],
  message: [v => gen_type.value === 'text_driven' ? !!v || "请输入文本台词" : true, isVideoFontSizeMaxValidate, isVideoFontSizeMinValidate],
  audioFigureFiles: [v => gen_type.value === 'audio_driven' ? !!v.length || "请先上传音频驱动文件" : true, isAudioFileMaxValidate, isAudioFileMinValidate],
});

const figureCloneModelList = computed(() => cloneModelStore.figureCloneModel);
const voiceCloneModelList = computed(() => cloneModelStore.voiceCloneModel);
const videoCloneModelList = computed(() => cloneModelStore.videoCloneModel);

const videoCloneTemplateCustomList = computed(() => cloneDataStore.videoCloneTemplateCustom);
const videoCloneTemplatePublicList = computed(() => cloneDataStore.videoCloneTemplatePublic);

const audioCloneTemplateCustomList = computed(() => cloneDataStore.audioCloneTemplateCustom);
const audioCloneTemplatePlatformList = computed(() => cloneDataStore.audioCloneTemplatePlatform);
const audioCloneTemplatePublicList = computed(() => cloneDataStore.audioCloneTemplatePublic);

const selectData = reactive({
  exampleSelect: {},
  audioExampleSelect: {}
})

const szrParams = reactive({
  taskname: "我的作品",
  speak_id: null, // 传声音数据库id
  gen_type: 'text_driven', // audio_driven 音频文件驱动或者text_driven 文本驱动
  tts_system: null, // 根据声音id里面的字段信息来
  model_id: null, //模板的id
  audio_url: null, // 音频驱动的音频地址（audio_driven才传）
  message: null
})

const addTemplateParams = reactive({
  clone_address: null,
  name: null,
  clone_type: 'clone_video',
  select_model: 'v5',
  disclaimer: null
})

const { exampleSelect, audioExampleSelect } = toRefs(selectData);
const { taskname, speak_id, gen_type, tts_system, model_id, audio_url, message } = toRefs(szrParams);
const { clone_address, name, select_model, disclaimer } = toRefs(addTemplateParams);

/* 创建数字人克隆任务 */
async function addVideoClones() {
  const { valid } = await proxy.$refs.videoCloneRef.validate();
  if (valid) {
    isLoading.value = true;
    // 发音人
    speak_id.value = audioExampleSelect.value.id;
    tts_system.value = audioExampleSelect.value.tts_system;
    // 音频驱动上传（只有音频驱动模式才会执行）
    if (gen_type.value === 'audio_driven') {
      // 上传
      audio_url.value = await proxy.sendUpload({ Body: audioFigureFiles.value, taskType: 'video_figure', ContentType: 'audio/mp3' });
    }
    // 形象
    model_id.value = exampleSelect.value.id;
    try {
      const addVideoCloneRes = await addVideoClone(szrParams);
      if (addVideoCloneRes.code === 200) {
        proxy.$modal.msgSuccess(addVideoCloneRes.message);
      } else {
        proxy.$modal.msgWarning(addVideoCloneRes.message);
      }
      isLoading.value = false;
    } catch {
      isLoading.value = false;
    }
    reset();
  }
}

/* 增加形象模板 */
async function addVideoCloneTemplates() {
  const { valid } = await proxy.$refs.figureRef.validate();
  if (valid) {
    isFigureLoading.value = true;

    try {
      let addVideoCloneTemplateRes = null;
      let tempName = name.value;

      for (let i = 0; i < figureFiles.value.length; i++) {
        // 上传形象模板
        const urlRes = await proxy.sendUpload({ Body: figureFiles.value[i], taskType: 'video_clone', ContentType: 'video/mp4' });
        clone_address.value = urlRes;
        i !== 0 ? name.value = tempName + i : null;
        addVideoCloneTemplateRes = await addVideoCloneTemplate(addTemplateParams);
      }
      // 上传形象模板带有 await， 不需要重复调用返回结果与页面局部刷新
      if (addVideoCloneTemplateRes.code === 200) {
        proxy.$modal.msgSuccess(addVideoCloneTemplateRes.message);
        videoCloneTemplateDialog.value = false;
        isFigureLoading.value = false;
        await getVideoCloneTemplate();
      }

    } catch {
      isFigureLoading.value = false;
    }
  }
}

/* 删除形象克隆模板 */
async function delVideoCloneTemplates(id) {
  const ids = [id]
  const res = await cloneDataStore.delVideoCloneTemplateCustom(ids);
  await getVideoCloneTemplate();
  proxy.$modal.msgSuccess(res.message);
}

/* 获取形象模板（公共或自定义克隆） */
async function getVideoCloneTemplate() {
  await cloneDataStore.getVideoCloneTemplateCustoms();
  await cloneDataStore.getVideoCloneTemplatePublics();

  //  配置默认形象选项
  const newVideoTemplate = [...videoCloneTemplateCustomList.value,...videoCloneTemplatePublicList.value]
  newVideoTemplate.some((element, index) => {
    // 状态为克隆成功终止循环
    if (element.status === 2) {
      exampleSelect.value = element
      return true; // 终止循环
    }
  })

}


/* 获取音频克隆任务列表 */
async function getAudioCloneTemplateList() {
  // 自定义声音  // // status：0代表排队中，1是正在生成，2是生成完成，4是失败
  await cloneDataStore.getAudioCloneTemplateCustoms();
  // tts声音模型
  await cloneDataStore.getAudioCloneTemplatePublics();
  // 平台克隆声音
  await cloneDataStore.getAudioCloneTemplatePlatform();

  //  配置默认音色选项
  const newAudioClone = [...audioCloneTemplateCustomList.value,...audioCloneTemplatePublicList.value,...audioCloneTemplatePlatformList.value]
  newAudioClone.some((element, index) => {
    // 状态为克隆成功终止循环
    if (element.status === 2) {
      audioExampleSelect.value = element
      return true; // 终止循环
    }
  })
}


/* 删除音频克隆任务项 */
async function delAudioCloneTask(id) {
  const ids = [id]
  const res = await cloneDataStore.delAudioCloneTemplateCustoms(ids);
  await getAudioCloneTemplateList();
  proxy.$modal.msgSuccess(res.message);
}

/* 复制地址 */
function copyUrl(audioUrl) {
  // http 或 https 判断复制是否可用
  if (navigator.clipboard) {
    // https
    copy(audioUrl);
  } else {
    // http **已弃用API临时解决方式
    const input = document.createElement('input');
    input.setAttribute('value', audioUrl);
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
  }
  proxy.$modal.msgSuccess('链接已复制到剪贴板');
}

/* 获取视频克隆模式 */
function getVideoCloneModels() {
  cloneModelStore.getVideoCloneModel().then();
}

/* 获取形象克隆模式 */
function getFigureCloneModels() {
  cloneModelStore.getFigureCloneModel().then();
}

/* 获取声音克隆模式 */
function getVoiceCloneModels() {
  cloneModelStore.getVoiceCloneModel().then();
}

/* 下载视频 */
function downloadsVideo(videoUrl) {
  proxy.download(videoUrl, `video_clone_${new Date().getTime()}.mp4`);
}

/* 预览数字人作品 */
function playerVideo(videoUrl) {
  videoPlayerStore.openVideoWindow({ videoUrl });
}

/* 下载音频 */
function downloadsAudio(audioUrl) {
  proxy.download(audioUrl, `audio_clone_${new Date().getTime()}.mp3`);
}


/* 初始化任务数据 */
function reset() {
  proxy.$refs.videoCloneRef.reset();
  taskname.value = "我的作品";
  speak_id.value = null; // 传声音数据库id
  gen_type.value = 'text_driven'; // audio_driven 音频文件驱动或者text_driven 文本驱动
  tts_system.value = null; // 根据声音id里面的字段信息来
  model_id.value = null; //模板的id
  audio_url.value = null; // 音频驱动的音频地址（audio_driven才传）
  message.value = null;

  // 音频文件初始化
  audioFigureFiles.value = null;
  // 选择发音人初始化
  // audioExampleSelect.value = {};
  // 选择形象模板初始化
  // exampleSelect.value = {};
}

/* 播放音频 */
function playAudio(url) {
  audio.src = url;
  audio.play();
}

/* 验证形象模板文件最小时长 */
async function isFigureFileMinValidate() {
  return await cloneModelStore.isFigureFileMinValidates(figureFiles.value, select_model.value);
}

/* 验证形象模板文件最大时长 */
async function isFigureFileMaxValidate() {
  return await cloneModelStore.isFigureFileMaxValidates(figureFiles.value, select_model.value);
}

/* 验证视频克隆文本驱动最大字数 */
async function isVideoFontSizeMaxValidate() {
  return await cloneModelStore.isVideoFontSizeMaxValidates(message.value, gen_type.value);
}

/* 验证视频克隆文本驱动最小字数 */
async function isVideoFontSizeMinValidate() {
  return await cloneModelStore.isVideoFontSizeMinValidates(message.value, gen_type.value);
}

/* 验证视频克隆音频驱动最大时长 */
async function isAudioFileMaxValidate() {
  return await cloneModelStore.isAudioFileMaxValidates(audioFigureFiles.value, gen_type.value);
}

/* 验证视频克隆音频驱动最小时长 */
async function isAudioFileMinValidate() {
  return await cloneModelStore.isAudioFileMinValidates(audioFigureFiles.value, gen_type.value);
}


getVideoCloneTemplate();

getAudioCloneTemplateList();

getVoiceCloneModels();
getFigureCloneModels();
getVideoCloneModels();
</script>