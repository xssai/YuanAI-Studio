import request from '@/utils/request'

// AI 分析抖音用户
export function addIpAnalysis(data) {
  return request({
    url: '/api/coze/chat',
    method: 'post',
    data: data
  })
}

/* 获取视频文案提取结果 */
export function getDouyinWork(data) {
  return request({
    url: '/user/douyin_work',
    method: 'post',
    data: data
  })
}





