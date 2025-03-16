import request from '@/utils/request'

/* 创建图片换脸任务 */
export function addImgReplaceFace(data) {
  return request({
    url: '/user/face_task',
    method: 'post',
    data
  })
}

/* 获取图片换脸模板 */
export function getImgReplaceFaceTemplate(params) {
  return request({
    url: '/user/img_templates',
    method: 'get',
    params
  })
}

/* 获取图片换脸任务 */
export function getImgReplaceFaceTask(params) {
  return request({
    url: '/facefusion/get_task',
    method: 'get',
    params
  })
}

/* 删除图片任务项 */
export function delImgReplaceFace(data) {
  return request({
    url: '/facefusion/delete_task',
    method: 'delete',
    data
  })
}


