<template>
  <v-container fluid class="px-6 py-6">
    <v-row>
      <v-col md="6" cols="12">
        <v-card hover outlined rounded="lg">
          <template v-slot:title>
            <div class="font-weight-black">积分管理</div>
          </template>
          <v-card-text>
            <v-row align="center" justify="space-between">
              <v-col md="7" cols="12">
                <p class="text-subtitle-1 text-grey-darken-1">剩余积分</p>
                <div class="d-flex align-center">
                  <v-avatar size="28">
                    <svg-icon v-if="integral" class-name="text-h4" icon-class="vip" />
                    <svg-icon v-else class-name="text-h4" icon-class="not-vip" />
                  </v-avatar>
                  <p class="text-h6 font-weight-black ml-1">{{integral}}</p>
                </div>
              </v-col>
              <v-col md="auto" cols="auto">
                <v-btn variant="plain" prepend-icon="mdi-cloud-key-outline" @click="isUseKey = true">积分兑换</v-btn>
              </v-col>
              <v-col md="auto" cols="auto">
                <v-btn variant="flat" color="light-blue-darken-4" prepend-icon="mdi-cart-arrow-up" @click="handelGoToPay">充值积分</v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col md="6" cols="12">
        <v-card hover class="fill-height" outlined rounded="lg">
          <v-row no-gutters align="center" justify="space-around" class="fill-height">
            <v-col cols="auto">
              <v-card-item title="积分充值">
                <template v-slot:subtitle>
                  总共充值积分数量
                </template>
                <div class="text-h4">{{ numberToWan(addIntegral) }}</div>
              </v-card-item>
            </v-col>
            <v-col cols="auto">
              <v-card-item title="积分消耗">
                <template v-slot:subtitle>
                  总共消耗积分数量
                </template>
                <div class="text-h4">{{ numberToWan(deductIntegral) }}</div>
              </v-card-item>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card hover outlined rounded="lg">
          <template v-slot:title>
            <span class="font-weight-black">消费记录</span>
          </template>
          <v-card-text class="pt-2">
            <v-form ref="integralFormRef">
              <v-row align="center">
                <v-col cols="12" sm="3">
                  <div class="text-subtitle-1 text-medium-emphasis">变动功能</div>
                  <v-select v-model="component_id" density="compact" prepend-inner-icon="mdi-select" variant="outlined"
                    placeholder="产生充值消耗组件" clearable :disabled="isLoading" :items="componentSelectList"
                    item-title="title" item-value="component_id" @update:modelValue="getUserIntegralInfos"></v-select>
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="text-subtitle-1 text-medium-emphasis">变动类型</div>
                  <v-select v-model="flag" density="compact" prepend-inner-icon="mdi-select" variant="outlined"
                    placeholder="消费积分或充值积分" clearable :disabled="isLoading" :items="flagSelect" item-title="name"
                    item-value="value" @update:modelValue="getUserIntegralInfos"></v-select>
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="text-subtitle-1 text-medium-emphasis">开始时间</div>
                  <v-date-input v-model="startTime" persistent-placeholder variant="outlined" density="compact"
                    placeholder="积分记录开始时间" prepend-inner-icon="mdi-calendar" prepend-icon="" clearable
                    :disabled="isLoading" @update:modelValue="getUserIntegralInfos" @click:clear="handelClearStartTime"></v-date-input>
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="text-subtitle-1 text-medium-emphasis">结束时间</div>
                  <v-date-input variant="outlined" v-model="endTime" persistent-placeholder density="compact"
                    placeholder="积分记录结束时间" prepend-inner-icon="mdi-calendar" prepend-icon="" clearable
                    :disabled="isLoading" @update:modelValue="getUserIntegralInfos"  @click:clear="handelClearEndTime"></v-date-input>
                </v-col>
              </v-row>
            </v-form>

            <v-row>
              <v-col cols="auto" md="auto">
                <v-btn text="搜索" color="light-blue-darken-4" :disabled="isLoading" @click="getUserIntegralInfos"
                  prepend-icon="mdi-magnify"></v-btn>
              </v-col>
              <v-col cols="auto" md="auto">
                <v-btn text="刷新" color="light-blue-darken-3" :disabled="isLoading" @click="getUserIntegralInfos"
                  prepend-icon="mdi-refresh"></v-btn>
              </v-col>
              <v-col cols="auto" md="auto">
                <v-btn text="重置" :disabled="isLoading" prepend-icon="mdi-delete-empty-outline" @click="reset"></v-btn>
              </v-col>
            </v-row>

            <v-row >
              <v-col md="12" cols="12">
                <v-data-table :page="page" item-value="id" :headers="headers" :items="integralList" height="450"
                  fixed-header :sort-by="[{ key: 'calories', order: 'asc' }]" :loading="isLoading" hover
                  show-current-page>
                  <template v-slot:item.component_id="{ item }">
                    <div v-tooltip="`${item.component_id ? matchComponent(item.component_id) : '-'}`">{{
                      item.component_id ? matchComponent(item.component_id) : '-' }}
                    </div>
                  </template>
                  <template v-slot:item.flag="{ item }">
                    <v-chip v-if="item.flag" color="light-blue-darken-4">充值</v-chip>
                    <v-chip v-else color="red-lighten-2">消耗</v-chip>
                  </template>
                  <template v-slot:item.id="{ item }">
                    <div v-tooltip="`${item.id ? item.id : '-'}`">{{ item.id ? item.id : '-' }}</div>
                  </template>
                  <template v-slot:item.integral="{ item }">
                    <div v-tooltip="`${item.integral ? item.integral : '-'}`">{{ item.integral ? item.integral : '-' }}
                    </div>
                  </template>
                  <template v-slot:item.title="{ item }">
                    <div v-tooltip="`${item.title ? item.title : '-'}`">{{ item.title ? item.title : '-' }}</div>
                  </template>
                  <template v-slot:item.detail="{ item }">
                    <div v-tooltip="`${item.detail ? item.detail : '-'}`">{{ item.detail ? item.detail : '-' }}</div>
                  </template>
                  <template v-slot:item.before_integral="{ item }">
                    <div v-tooltip="`${item.before_integral ? item.before_integral : '-'}`"
                      class="text-light-blue-darken-1">
                      {{ item.before_integral ? item.before_integral : '-' }}</div>
                  </template>
                  <template v-slot:item.after_integral="{ item }">
                    <div v-tooltip="`${item.after_integral ? item.after_integral : '-'}`" class="text-red-darken-1">{{
                      item.after_integral ? item.after_integral : '-' }}</div>
                  </template>
                  <template v-slot:item.change_time="{ item }">
                    <div v-tooltip="`${item.change_time ? formatDate(item.change_time) : '-'}`">{{ item.change_time ?
                      formatDate(item.change_time) : '-' }}</div>
                  </template>

                  <template v-slot:no-data>
                    <v-empty-state height="330" icon="mdi-magnify" text="前往【新增】观测信息" title="暂没有任何信息"></v-empty-state>
                  </template>

                  <template v-slot:loading>
                    <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
                  </template>

                  <template v-slot:bottom>
                    <pagination v-show="total > 0" v-model:limit="page_size" :total="total" v-model:page="page"
                      density="comfortable" @pagination="getUserIntegralInfos" />
                  </template>
                </v-data-table>
              </v-col>
            </v-row>

          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <UseKey id="useKey" v-model="isUseKey" />
  </v-container>
</template>

<script setup name="User">
import { numberToWan } from '@/utils'
import { getUserIntegralInfo } from '@/api/user'
import useEnumStore from "@/store/modules/enum";
import useUserStore from '@/store/modules/user'

import UseKey from '@/components/UseKey'

const { proxy } = getCurrentInstance();

const router = useRouter();
const userStore = useUserStore()
const enumStore = useEnumStore();

const componentSelectList = computed(() => enumStore.componentSelectList);
const addIntegral = computed(() => userStore.add_integral);
const deductIntegral = computed(() => userStore.deduct_integral);
const integral = computed(() => userStore.integral);

const isUseKey = ref(false);
const isLoading = ref(false);

const integralList = ref([]);
const total = ref(0)

const headers = ref([
  { title: '序号', align: 'center', key: 'id', minWidth: '50', sortable: false },
  { title: '变动功能', align: 'center', key: 'component_id', minWidth: '105', sortable: false },
  { title: '变动类型', align: 'center', key: 'flag', minWidth: '90', sortable: false },
  { title: '变动数量', align: 'center', key: 'integral', minWidth: '90', sortable: false, },
  { title: '操作类型', align: 'center', key: 'title', minWidth: '106', sortable: false },
  { title: '操作说明', align: 'center', key: 'detail', minWidth: '168', sortable: false },
  { title: '变动前', align: 'center', key: 'before_integral', minWidth: '106', sortable: false },
  { title: '变动后', align: 'center', key: 'after_integral', minWidth: '106', sortable: false },
  { title: '变动时间', align: 'center', key: 'change_time', minWidth: '106', sortable: false }
])

const flagSelect = ref([
  {
    name: '充值',
    value: 1
  },
  {
    name: '消耗',
    value: 0
  }
])

const startTime = ref(null)
const endTime = ref(null)

const params = reactive({
  page: 1,
  page_size: 10,
  starttime: '',
  endtime: '',
  flag: undefined,
  component_id: undefined
})

const { page, page_size, starttime, endtime, flag, component_id } = toRefs(params);

// 获取随机文案
async function getUserIntegralInfos() {
  isLoading.value = true;
  // ISO 转 YYYY-mm-dd  
  starttime.value = startTime.value ? proxy.format_date(startTime.value) : ''
  endtime.value = endTime.value ? proxy.format_date(endTime.value) : ''

  const userIntegralInfoResult = await getUserIntegralInfo(params)
  isLoading.value = false;
  total.value = userIntegralInfoResult.total_pages;
  integralList.value = userIntegralInfoResult.data;
}

function matchComponent(component_id) {
  let componentsTitle = ''
  componentSelectList.value.forEach(element => {
    if (element.component_id == component_id) {
      componentsTitle = element.title
    }
  });

  return componentsTitle
}

function handelGoToPay() {
  const url = router.resolve({ path: '/pay' });
  window.open(url.href);
}

function handelClearStartTime() {
  startTime.value = null
  starttime.value = ''
  getUserIntegralInfos();
}

async function reset() {
  proxy.$refs.integralFormRef.reset();
  startTime.value = null;
  starttime.value = '';
  endTime.value = null;
  endtime.value = '';
  page.value = 1;
  page_size.value = 10;
  getUserIntegralInfos()
}

function handelClearEndTime() {
  endTime.value = null
  endtime.value = ''
  getUserIntegralInfos();
}



getUserIntegralInfos()
</script>

<style scoped lang="scss"></style>
