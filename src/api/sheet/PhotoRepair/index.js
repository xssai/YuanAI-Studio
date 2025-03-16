import request from '@/utils/request'

/* 创建图片修复任务 */
export function addPhotoRepair(data) {
  return request({
    url: '/user/aiimg_task',
    method: 'post',
    data
  })
}

/* 获取图片任务列表 */
export function getPhotoRepair(params) {
  return request({
    url: '/user/get_tasklist',
    method: 'get',
    params
  })
}

/* 删除图片任务项 */
export function delPhotoRepair(data) {
  return request({
    url: '/user/delete_imgtask',
    method: 'delete',
    data
  })
}

