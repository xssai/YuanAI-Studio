import request from '@/utils/request'

/* /* 增加自定义视频克隆模板 */
export function getUserIntegralInfo(data) {
  return request({
    url: '/user/integral_info',
    method: 'post',
    data: data
  })
}




