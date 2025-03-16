import request from '@/utils/request'

// 登录方法
export function login(data) {
  // const data = {
  //   phoneNumber,
  //   phoneCode,
  //   rulesCode,
  //   uuid
  // }
  return request({
    url: '/verification/login',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 注册方法
export function register(data) {
  return request({
    url: '/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 微信与手机号绑定
export function wechatPhoneBind(data) {
  return request({
    url: '/verification/phone_binding',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/user/information',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

// 获取验证码
export function getCodeImg(params) {
  return request({
    url: '/verification/imgrulescode',
    method: 'get',
    params: params,
    // headers: {
    //   isToken: false
    // },
    timeout: 20000
  })
}

// 获取手机验证码
export function getCodePhone(params) {
  return request({
    url: '/verification/phonecode',
    method: 'get',
    params: params,
    timeout: 20000
  })
}

// 微信绑定获取手机验证码
export function getWxCodePhone(params) {
  return request({
    url: '/verification/wx_phonecode',
    method: 'get',
    headers: {
      isToken: false
    },
    params: params,
    timeout: 20000
  })
}

// 更改新老用户状态
export function registerUserState() {
  return request({
    url: '/user/is_new',
    method: 'post'
  })
}

// 获取用户详细信息
export function getEnterpriseInfo() {
  return request({
    url: '/setting/enterprise',
    method: 'get'
  })
}

