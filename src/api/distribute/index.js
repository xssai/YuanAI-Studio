import request from '@/utils/request'

/* 获取分发平台 */
export function getDistributePlatform() {
  return request({
    url: '/distribute/platform',
    method: 'get',
  })
}

/* 小红书-获取二维码 */
export function getDistributeXhsQrcode() {
  return request({
    url: '/distribute/xhs_qrcode',
    method: 'get',
  })
}

/* 小红书-获取二维码状态 */
export function getDistributeXhsQrStatus() {
  return request({
    url: '/distribute/xhs_qrstatus',
    method: 'get',
  })
}

/* 小红书-获取话题 */
export function getDistributeXhsTopic(params) {
  return request({
    url: '/distribute/xhs_topic',
    method: 'get',
    params: params
  })
}

/* 小红书-获取地区 */
export function getDistributeXhsAddress() {
  return request({
    url: '/distribute/xhs_address',
    method: 'get',
  })
}

/* 小红书-发布图文笔记 */
export function addDistributeXhsImgNote(data) {
  return request({
    url: '/distribute/xhs_imgnote',
    method: 'post',
    data: data
  })
}

/* 小红书-发布视频笔记 */
export function addDistributeXhsViedoNote(data) {
  return request({
    url: '/distribute/xhs_viedonote',
    method: 'post',
    data: data
  })
}




/* 临时------------------------ */

// 添加卡密
export function addKey(data) {
  return request({
    url: '/business/add_kaimi',
    method: 'post',
    data: data
  })
}

// 使用卡密
export function useKey(data) {
  return request({
    url: '/business/activate_kaimi',
    method: 'post',
    data: data
  })
}
