import request from '@/utils/request'

/* 音频格式 降噪 */
export function postAudioConvert(data) {
  return request({
    url: '/aivoice/handle_audio',
    method: 'post',
    data: data
  })
}

