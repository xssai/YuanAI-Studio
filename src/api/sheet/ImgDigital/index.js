import request from '@/utils/request'

/* 生成视频 */
export function getVideoUrl(data) {
  return request({
    url: '/user/aiimg_human',
    method: 'post',
    data: data
  })
}

/* 获取任务 */
export function getImgDigitalTask() {
  return request({
    url: '/user/get_imghuman',
    method: 'get',
  })
}

/* 删除图片任务项 */
export function delImgDigitalTask(data) {
  return request({
    url: '/user/delete_imghuman',
    method: 'delete',
    data
  })
}
