import request from '@/utils/request'

/* 新增音频克隆任务 */
export function addAudioClone(data) {
  return request({
    url: '/aivoice/voice_clone',
    method: 'post',
    data: data
  })
}

/* 获取音频克隆任务 */
export function getAudioClone() {
  return request({
    url: '/aivoice/get_clone',
    method: 'get',
  })
}

/* 获取音频克隆任务 */
export function getAudioPublicTts() {
  return request({
    url: '/aivoice/get_tts',
    method: 'get',
  })
}

/* 获取平台克隆音频 */
export function getAudioPlatform() {
  return request({
    url: '/aivoice/public_clone',
    method: 'get',
  })
}

/* 删除音频克隆任务 */
export function delAudioClone(data) {
  return request({
    url: '/aivoice/delete_clone',
    method: 'delete',
    data
  })
}
