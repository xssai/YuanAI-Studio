import request from '@/utils/request'

/* 刷新数字人KEY */
export function refreshKey() {
  return request({
    url: '/user/refresh_apikey',
    method: 'post'
  })
}