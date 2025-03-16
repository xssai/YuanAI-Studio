import request from '@/utils/request'

/* 视频解析 */
export function getVideoUrl(data) {
  return request({
    url: '/user/water_video',
    method: 'post',
    data: data
  })
}
