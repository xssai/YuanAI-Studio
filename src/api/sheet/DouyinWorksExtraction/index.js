import request from '@/utils/request'


/* 获取视频文案提取结果 */
export function getDouyinWork(data) {
  return request({
    url: '/user/douyin_work',
    method: 'post',
    data: data
  })
}
