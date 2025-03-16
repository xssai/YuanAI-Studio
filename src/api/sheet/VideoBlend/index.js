import request from '@/utils/request'

/* 添加生成文案 */
export function addVideoWrite(data) {
  return request({
    url: '/aiwrite/mixedcut',
    method: 'post',
    data
  })
}


/* 添加视频混剪 */
export function addVideoCut(data) {
  return request({
    url: '/aivideo/mixed_cutting',
    method: 'post',
    data: data
  })
}

/* 获取视频混剪 */
export function getVideoCut() {
  return request({
    url: '/aivideo/get_mixedcut',
    method: 'get'
  })
}

/* 删除视频混剪 */
export function delVideoCut(data) {
  return request({
    url: '/aivideo/delet_mixedcut',
    method: 'delete',
    data
  })
}


/* 获取字体 */
export function getFont() {
  return request({
    url: '/setting/font',
    method: 'get'
  })
}




