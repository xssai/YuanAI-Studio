import request from '@/utils/request'

/* 主题生成文案 */
export function addVideoWrite(data) {
  return request({
    url: '/aiwrite/mixedcut',
    method: 'post',
    data
  })
}