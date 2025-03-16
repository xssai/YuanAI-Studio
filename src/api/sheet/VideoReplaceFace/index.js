import request from '@/utils/request'

/* 生成视频 */
export function addVideoTask(data) {
  return request({
    url: '/user/face_task',
    method: 'post',
    data: data
  })
}

/* 上传视频自定义模板 */
export function customVideoTemplate(data) {
  return request({
    url: '/ai_image/custom_video_template',
    method: 'post',
    data: data
  })
}

/* 获取模型列表 */
export function getModelList(param) {
  return request({
    url: '/user/video_templates',
    method: 'get',
    params: param
  })
}

/* 获取任务列表 */
export function getVideoTask(param) {
  return request({
    url: '/facefusion/get_task',
    method: 'get',
    params: param
  })
}

/* 删除图片任务项 */
export function delTask(data) {
  return request({
    url: '/facefusion/delete_task',
    method: 'delete',
    data
  })
}
