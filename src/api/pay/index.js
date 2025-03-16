import request from '@/utils/request'

/* 积分套餐获取 */
export function getPriceList() {
  return request({
    url: '/payment/price_list',
    method: 'get'
  })
}

/* 二维码 Native 支付 -- PC */
export function addWechatQrPay(data) {
  return request({
    url: '/payment/native_pay',
    method: 'post',
    data: data
  })
}

/* 微信移动端支付 -- Mobile */
export function addWechatMobilePay(data) {
  return request({
    url: '/payment/h5_pay',
    method: 'post',
    data: data
  })
}

/* 支付宝网页支付 -- PC */
export function addAliPayH5Pay(data) {
  return request({
    url: '/payment/desktop_alipay',
    method: 'post',
    data: data
  })
}

/* 支付宝手机支付 -- Mobile */
export function addAliPayMobilePay(data) {
  return request({
    url: '/payment/mobile_alipay',
    method: 'post',
    data: data
  })
}


/* 支付状态轮询查询 */
export function getPayStatus(params) {
  return request({
    url: '/payment/order_status',
    method: 'get',
    params
  })
}

