import '@/assets/styles/index.scss' // global css
import { createApp } from 'vue'
import Cookies from 'js-cookie'

import App from './App.vue'
import store from './store'
import router from './router'
import directive from './directive' // directive

// 注册指令
import plugins from './plugins' // plugins
import { download } from '@/utils/request'
// oss 文件直传
import { sendUpload } from '@/utils/oss'

// VueUse
import { useClipboard } from '@vueuse/core'
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";
import Toast from "vue-toastification";
// svg图标
import 'virtual:svg-icons-register'
import SvgIcon from '@/components/SvgIcon'


import './permission' // permission control

import { formatDate, format_date, trimSpecial, vuetifyFileInfo } from '@/utils'
// 分页组件
import Pagination from '@/components/Pagination'


const app = createApp(App)

// 全局方法挂载
app.config.globalProperties.Cookies = Cookies
app.config.globalProperties.download = download
app.config.globalProperties.sendUpload = sendUpload
app.config.globalProperties.formatDate = formatDate
app.config.globalProperties.format_date = format_date
app.config.globalProperties.trimSpecial = trimSpecial
app.config.globalProperties.vuetifyFileInfo = vuetifyFileInfo
app.config.globalProperties.useClipboard = useClipboard

// 全局组件挂载
app.component('svg-icon', SvgIcon)
app.component('Pagination', Pagination)

app.use(router)
app.use(store)
app.use(plugins)
app.use(Toast)

// 注入指令
directive(app)

app.mount('#app')
