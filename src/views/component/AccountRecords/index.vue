<template>
  <v-container fluid class="px-0 py-0">
    <v-spacer class="mb-4"></v-spacer>
    <v-row fluid>
      <v-col>
        <v-dialog v-model="dialog" max-width="600px">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" prepend-icon="mdi-table-plus" variant="tonal" @click="add">新增</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h6">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" md="6" sm="6">
                    <v-text-field v-model="editedItem.platform" label="观测平台" prepend-icon="mdi-laptop"
                      variant="underlined" hide-details></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-text-field v-model="editedItem.account_name" label="观测账号" prepend-icon="mdi-account-star-outline"
                      variant="underlined" hide-details></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-text-field v-model="editedItem.notes" label="备注" prepend-icon="mdi-lightbulb-on-outline"
                      variant="underlined" hide-details></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-text-field v-model="editedItem.url" label="URL地址（HTTPS或HTTP开头，用于链接直达）"
                      prepend-icon="mdi-vector-link" variant="underlined" hide-details></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn variant="text" @click="close">取消</v-btn>
              <v-btn variant="text" @click="updata">保存</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
      <v-col cols="auto">
        <v-btn :disabled="selected.length == 0" prepend-icon="mdi-trash-can-outline" variant="tonal"
          v-tooltip="'勾选表格对应行数据进行删除'" @click="deleteAll">批量删除</v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn icon="mdi-refresh" :disabled="isLoading" variant="tonal" density="comfortable" @click="handelRefresh"
          v-tooltip="'刷新表格数据'"></v-btn>
      </v-col>
    </v-row>

    <v-spacer class="mb-3"></v-spacer>


    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h6">是否确认删除数据?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="closeDelete">取消</v-btn>
          <v-btn variant="text" @click="deleteItemConfirm">确认</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <v-data-table v-model="selected" :page="page" item-value="id" :headers="headers" :items="listData" height="380"
      density="compact" fixed-header :sort-by="[{ key: 'calories', order: 'asc' }]" :search="search"
      :loading="isLoading" show-select hover show-current-page>
      <template v-slot:item.actions="{ item }">
        <v-icon class="me-2" size="small" @click="editItem(item)" v-tooltip="'编辑'">mdi-pencil-outline</v-icon>
        <v-icon class="me-2" size="small" @click="deleteItem(item.id)" v-tooltip="'删除'">mdi-trash-can-outline</v-icon>
        <v-icon size="small" :disabled="item.url == ''" @click="handelLink(item.url)"
          v-tooltip="'直达观测平台'">mdi-vector-link</v-icon>
      </template>
      <template v-slot:top>
        <v-text-field v-model="search" :disabled="isLoading" label="输入表格中的关键词进行筛选展示" density="compact"
          prepend-inner-icon="mdi-magnify" variant="underlined" clearable hide-details ></v-text-field>
      </template>
      <template v-slot:item.platform="{ item }">
        <div v-tooltip="item.platform">{{ item.platform ? item.platform : '-' }}</div>
      </template>
      <template v-slot:item.account_name="{ item }">
        <div v-tooltip="item.account_name" @click="handelLink(item.url)">{{ item.account_name ? item.account_name : '-' }}</div>
      </template>
      <template v-slot:item.notes="{ item }">
        <div v-tooltip="item.notes">{{ item.notes ? item.notes : '-' }}</div>
      </template>
      <template v-slot:no-data>
        <v-empty-state height="330" icon="mdi-magnify" text="前往【新增】观测信息" title="暂没有任何信息"></v-empty-state>
      </template>

      <template v-slot:loading>
        <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
      </template>

      <template v-slot:bottom>
        <pagination v-show="total > 0" v-model:limit="page_size" :total="total" v-model:page="page"
          @pagination="getList" />
      </template>
    </v-data-table>
    
  </v-container>
</template>

<script setup>
import { getAccountRecords, addAccountRecords, updateAccountRecords, delAccountRecords } from '@/api/sheet/AccountRecords'

const { proxy } = getCurrentInstance();

const isLoading = shallowRef(false)

const search = ref('')
const listData = ref([])
const dialog = ref(false)

const selected = ref([])
const dialogDelete = ref(false)
const dialogDeleteItemId = ref(null)

const params = reactive({
  page: 1,
  page_size: 10,
})

const total = ref(0)

const { page, page_size } = toRefs(params);

const formTitle = computed(() => {
  return editedItem.value.id == undefined ? '新增观测数据' : '更新观测数据'
})

const headers = ref([
  { title: '账号', align: 'start', sortable: false, key: 'account_name', minWidth: '90' },
  { title: '操作', align: 'center', key: 'actions', minWidth: '106', sortable: false },
  // { title: '平台', align: 'start', sortable: false, key: 'platform', minWidth: '60' },
  // { title: '备注', key: 'notes', minWidth: '84' }

])

const editedItem = ref({
  id: undefined,
  notes: undefined,
  platform: undefined,
  url: undefined,
  account_name: undefined,
})

const defaultItem = ref({
  id: undefined,
  notes: undefined,
  platform: undefined,
  url: undefined,
  account_name: undefined,
})




/* 获取观测数据 */
function getList() {
  isLoading.value = true
  let timer = setTimeout(() => { // 防止恶意刷新导致内存飙升
    getAccountRecords(params).then((result) => {
      listData.value = result.data
      total.value = result.total_count
      isLoading.value = false
    }).catch(() => {
      isLoading.value = false
    })
    clearTimeout(timer)
  }, 800)

}

/* 删除项窗口 */
function deleteItem(id) {
  dialogDeleteItemId.value = id
  dialogDelete.value = true
}
/* 删除全部窗口 */
function deleteAll() {
  dialogDelete.value = true
}
/* 关闭删除窗口 */
function closeDelete() {
  dialogDelete.value = false
  delReset()
}
/* 删除项重置 */
function delReset() {
  dialogDeleteItemId.value = null
  selected.value = []
}
/* 新增窗口 */
function add() {
  dialog.value = true
}
/* 更新窗口 */
function editItem(item) {
  editedItem.value = Object.assign({}, item)
  dialog.value = true
}
/* 关闭新增或更新窗口 */
function close() {
  dialog.value = false
  nextTick(() => {
    editedItem.value = Object.assign({}, defaultItem.value)
  })
}

/* 删除数据 */
function deleteItemConfirm() {
  delAccountRecords({ ids: dialogDeleteItemId.value ? [dialogDeleteItemId.value] : selected.value }).then(() => {
    dialogDelete.value = false
    nextTick(() => {
      getList()
      delReset()
    })
  })
}

/* 新增或更新数据 */
function updata() {
  if (editedItem.value.id == undefined) {
    addAccountRecords(editedItem.value).then(() => {
      dialog.value = false
      nextTick(() => {
        getList()
      })
    })
  } else {
    updateAccountRecords(editedItem.value).then(() => {
      dialog.value = false
      nextTick(() => {
        getList()
      })
    })
  }
  close()
}

/* 跳转对应平台 */
function handelLink(url) {
  if (!url) {
    proxy.$modal.msgWarning("不能跳转到地址为空的页面，请检查录入URL地址是否正确填写！");
    return
  }

  window.open(url);
}


function handelRefresh() {
  page.value = 1;
  page_size.value = 10;
  total.value = 0;
  selected.value = []
  getList();
}

watch(dialog, val => {
  val || close()
})

watch(dialogDelete, val => {
  val || closeDelete()
})



getList()


</script>
