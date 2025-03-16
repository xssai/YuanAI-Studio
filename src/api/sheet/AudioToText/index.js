import request from '@/utils/request'

/* 音频提取文案 */
export function postAudioToText(data) {
  return request({
    url: '/aitext/any_text',
    method: 'post',
    data: data
  })
}

