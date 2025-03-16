import request from '@/utils/request'

/* 获取抖音热榜 */
export function getBoardDouyinTop() {
  return request({
    url: '/board/douyin_hot',
    method: 'get',
  })
}

/* 获取bilibili购物热榜 */
export function getBoardBiliBiliBuy() {
  return request({
    url: '/board/bilibili_buy',
    method: 'get',
  })
}


/* 获取榜单导航栏 */
export function getBoardPlatform() {
  return request({
    url: '/setting/platform',
    method: 'get',
  })
}

/* 获取随机文案 */
export function getRandomWritMaterial() {
  return request({
    url: '/aiwrite/get_material',
    method: 'get',
  })
}

/* 获取禅mama 图文带货榜 */
export function getProductPicture() {
  return request({
    url: '/aiwrite/image_text',
    method: 'get',
  })
}

/* 获取禅mama 台词近30天关联视频数趋势 */
export function get30AwemeCountTrend() {
  return request({
    url: '/aiwrite/trend_video',
    method: 'get',
  })
}