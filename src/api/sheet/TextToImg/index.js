import request from '@/utils/request'

/* 生成视频 */
export function getImgUrl(data) {
  return request({
    url: '/user/aiimg_task',
    method: 'post',
    data: data
  })
}

/* 查询图片任务 */
export function getImgTask(params) {
  return request({
    url: '/user/get_tasklist',
    method: 'get',
    params
  })
}

/* 获取模型列表 */
export function getModelList() {
  return request({
    url: '/user/get_aimodel',
    method: 'get',
  })
}

/* 获取推荐关键词 */
export function getNewTips() {
  return request({
    url: '/ai_image/keyword',
    method: 'get',
  })
}

/* 删除图片任务项 */
export function delImgTask(data) {
  return request({
    url: '/user/delete_imgtask',
    method: 'delete',
    data
  })
}

/* liblib文生图模型 */
export function getliblibWritToImgModel() {
  return request({
    url: '/ai_image/new_imgmodel',
    method: 'get'
  })
}

/* liblib创建文生图任务 */
export function addliblibWritToImg(data) {
  return request({
    url: '/ai_image/new_imgtask',
    method: 'post',
    data: data
  })
}
