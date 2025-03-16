import request from '@/utils/request'

/* /* 增加自定义视频克隆模板 */
export function addVideoCloneTemplate(data) {
  return request({
    url: '/aivideo/video_clone',
    method: 'post',
    data
  })
}

/* 获取自定义视频模板克隆模板 */
export function getVideoCloneTemplateCustom(params) {
  return request({
    url: '/aivideo/get_clone',
    method: 'get',
    params
  })
}

/* 获取公共视频克隆模板 */
export function getVideoCloneTemplatePublic(params) {
  return request({
    url: '/aivideo/public_clone',
    method: 'get',
    params
  })
}

/* 删除视频克隆模板任务 */
export function delVideoCloneTemplate(data) {
  return request({
    url: '/aivideo/delete_clone',
    method: 'delete',
    data
  })
}

/* *** 作品 ↓ */

/* 生成数字人作品 */
export function addVideoClone(data) {
  return request({
    url: '/aivideo/generate_task',
    method: 'post',
    data
  })
}

/* 获取数字人作品 */
export function getVideoClone(params) {
  return request({
    url: '/aivideo/get_task',
    method: 'get',
    params
  })
}

/* 失败重试数字人作品 */
export function resetVideoClone(data) {
  return request({
    url: '/aivideo/retry_task',
    method: 'post',
    data
  })
}

/* 删除数字人作品 */
export function delVideoClone(data) {
  return request({
    url: '/aivideo/delete_task',
    method: 'delete',
    data
  })
}




