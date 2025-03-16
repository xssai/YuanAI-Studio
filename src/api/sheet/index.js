import request from '@/utils/request'

// 获取用户组件
export function getUserComponent(params) {
  return request({
    url: '/user/user_component',
    method: 'get',
    params
  })
}

/* 修改用户组件 */
export function updateUserComponent(data) {
  return request({
    url: '/user/update_component',
    method: 'post',
    data:data
  })
}

/* 删除用户组件 */
export function delUserComponent(data) {
  return request({
    url: '/user/delete_component',
    method: 'delete',
    data:data
  })
}

/* 获取公共组件 */
export function getPublicComponent(params) {
  return request({
    url: '/public/get_component',
    method: 'get',
    params
  })
}

/* 使用公共组件 */
export function addPublicComponent(data) {
  return request({
    url: '/user/add_component',
    method: 'post',
    data:data
  })
}