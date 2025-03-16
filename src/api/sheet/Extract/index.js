import request from '@/utils/request'

/* 创建视频文案提取任务 */
export function setVideoText(data) {
  return request({
    url: '/user/extract_text',
    method: 'post',
    data: data
  })
}

/* 获取视频文案提取结果 */
export function getVideoText() {
  return request({
    url: '/user/get_text',
    method: 'get'
  })
}
