import request from '@/utils/request'

// 查询组件下拉枚举
export function componentSelect() {
    return request({
      url: '/setting/enumeration',
      method: 'get'
    })
  }