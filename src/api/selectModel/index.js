import request from '@/utils/request'

/* 获取声音克隆/形象克隆模式 */
export function getCloneModel(params) {
  return request({
    url: '/setting/clone_model',
    method: 'get',
    params
  })
}




