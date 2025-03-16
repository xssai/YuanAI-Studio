import request from '@/utils/request'

/* /* 增加自定义视频克隆模板 */
export function getVideoMaterial(data) {
  return request({
    url: '/aivideo/search_videos',
    method: 'post',
    data
  })
}




