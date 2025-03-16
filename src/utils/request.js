import axios from 'axios'
import modal from '@/plugins/modal';
import { getToken } from '@/utils/auth'
import { tansParams, blobValidate } from '@/utils/public'
import { filterSize } from '@/utils'
import cache from '@/plugins/cache'
import { saveAs } from 'file-saver'
import useUserStore from '@/store/modules/user'
import useFileProgressStore from '@/store/modules/fileProgress'


// 是否显示重新登录
export let isRelogin = { show: false };

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: import.meta.env.VITE_APP_BASE_API,
  // 超时
  timeout: 300000,
})

// request拦截器
service.interceptors.request.use(config => {

  // 是否需要设置 token
  const isToken = (config.headers || {}).isToken === false
  // // 是否需要防止数据重复提交
  const isRepeatSubmit = (config.headers || {}).repeatSubmit === false
  if (getToken() && !isToken) {
    config.headers['Authorization'] = getToken() // 让每个请求携带自定义token
  }
  // get请求映射params参数
  if (config.method === 'get' && config.params) {
    let url = config.url + '?' + tansParams(config.params);
    url = url.slice(0, -1);
    config.params = {};
    config.url = url;
  }

  if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
    const requestObj = {
      url: config.url,
      data: typeof config.data === 'object' ? config.data = config.data : JSON.stringify(config.data),
      time: new Date().getTime()
    }
    const sessionObj = cache.session.getJSON('sessionObj')
    if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
      cache.session.setJSON('sessionObj', requestObj)
    } else {
      const s_url = sessionObj.url;                // 请求地址
      const s_data = sessionObj.data;              // 请求数据
      const s_time = sessionObj.time;              // 请求时间
      const interval = 1000;                       // 间隔时间(ms)，小于此时间视为重复提交
      if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
        const message = '数据正在处理，请勿重复提交';
        console.warn(`[${s_url}]: ` + message)
        return Promise.reject(new Error(message))
      } else {
        cache.session.setJSON('sessionObj', requestObj)
      }
    }
  }
  return config
}, error => {
  Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(res => {
  // 未设置状态码则默认成功状态
  const code = res.data.code || 200;
  // 获取错误信息
  const message = res.data.message;
  // 二进制数据则直接返回
  if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
    return res.data
  }
  if (code === 2010) {
    // 手机号绑定
    modal.msgError(message)
    return Promise.reject(new Error(message))
  } else if (code === 4010) {
    // 请输入正确的api_key
    modal.msgError(message)
    return Promise.reject(new Error(message))
  } else if (code === 4011) {
    // 用户未登录
    modal.msg(message);
    if (!isRelogin.show) {
      isRelogin.show = true;
      useUserStore().logOut().then(() => {
        location.href = '/login';
        isRelogin.show = false;
      })
    }
    return Promise.reject(new Error(message))
  } else if (code === 4013) {
    // {para}错误，请检查后输入
    modal.msgError(message)
    return Promise.reject(new Error(message))
  } else if (code === 4014) {
    // 用户信息有误
    modal.msgError(message)
    return Promise.reject(new Error(message))
  }  else if (code === 4015) {
    modal.msg(message);
    if (!isRelogin.show) {
      isRelogin.show = true;
      useUserStore().logOut().then(() => {
        location.href = '/login';
        isRelogin.show = false;
      })
    }
    return Promise.reject(new Error(message))
  } else if (code === 4016) {
    // 请检查数据
    modal.msgError(message)
    return Promise.reject(new Error(message))
  } else if (code === 4017) {
    // 模式选择错误
    modal.msgError(message)
    return Promise.reject(new Error(message))
  } else if (code === 4018) {
    // 文件大小超出{para}MB限制
    modal.msgError(message)
    return Promise.reject(new Error(message))
  } else if (code === 400) {
    // 不能为空
    modal.msgError(message)
    return Promise.reject(new Error(message))
  } else if (code === 5010) {
    // 抱歉，系统出现问题，请联系客服
    modal.msgError(message)
    return Promise.reject(new Error(message))
  } else if (code === 5011) {
    // 响应类型出错误，请检查
    modal.msgError(message)
    return Promise.reject(new Error(message))
  } else if (code === 5012) {
    // 操作频繁，请稍后重试
    modal.msgError(message)
    return Promise.reject(new Error(message))
  } else if (code === 5013) {
    // {para}失败
    modal.msgError(message)
    return Promise.reject(new Error(message))
  } else if (code === 5014) {
    // 微信登录异常，请切换至手机号登录
    modal.msgError(message)
    return Promise.reject(new Error(message))
  } else if (code === 5015) {
    // 积分不足
    modal.msgError(message)
    return Promise.reject(new Error(message))
  } else if (code === 5016) {
    // {para}
    modal.msgError(message)
    return Promise.reject(new Error(message))
  } else if (code !== 200) {
    modal.msgWarning(message);
    return Promise.reject('error')
  } else {
    return Promise.resolve(res.data)
  }


},
  error => {
    console.log('err' + error)
    let { message } = error;
    modal.msgError(message)
    return Promise.reject(error)
  }
)

// 通用下载方法 (免跨域影响)
export function download(url, filename, config) {
  let downProgress = 0;
  let uniSign = Date.now(); //可能会连续点击下载多个文件，这里用时间戳来区分每一次下载的文件
  return new Promise((resolve, reject) => {
    axios({
      url,
      method: 'GET',
      responseType: 'blob',
      ...config,
      onDownloadProgress: (event) => {
        /*计算进度*/
        downProgress = Math.round(100 * event.loaded / event.total) // progress对象中的loaded表示已经下载的数量，total表示总数量，这里计算出百分比
        useFileProgressStore().setFileProgress('SET_PROGRESS', {
          path: uniSign,
          name: filename,
          progress: downProgress,
          loaded: filterSize(event.loaded),
          total: filterSize(event.total),
          type: 'download',
          status: downProgress == 100 ? 'success' : 'downloading'
        })
        // 将此次下载的文件名和下载进度组成对象
        // console.log("正在下载文件大小:", filterSize(event.loaded))
        // console.log("下载总文件大小:", filterSize(event.total))
      }
    }).then((res) => {
      useFileProgressStore().autoCloseFileProgress()
      const isBlob = blobValidate(res.data);
      if (isBlob) {
        const blob = new Blob([res.data])
        saveAs(blob, filename)
        resolve(filename)
      }
    }).catch((r) => {
      modal.msgError('下载文件出错!')
      reject(r)
    })
  })
}

export default service
