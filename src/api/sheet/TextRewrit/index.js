import request from '@/utils/request'

/* 生成文案 */
export function getText(data) {
  return request({
    url: '/aitext/copywriting',
    method: 'post',
    data: data
  })
}

/* 获取模型列表 */
export function getModelList() {
  return request({
    url: '/setting/write_scenario',
    method: 'get',
  })
}
