import request from '@/utils/request'

/* 获取观测数据 */
export function getAccountRecords(params) {
  return request({
    url: '/business/get_account',
    method: 'get',
    params: params
  })
}

/* 新增观测数据 */
export function addAccountRecords(data) {
  return request({
    url: '/business/add_account',
    method: 'post',
    data: data
  })
}

/* 更新对标账号 */
export function updateAccountRecords(data) {
  return request({
    url: '/business/update_account',
    method: 'post',
    data: data
  })
}

/* 删除对标账号 */
export function delAccountRecords(data) {
  return request({
    url: '/business/delete_account',
    method: 'delete',
    data
  })
}

