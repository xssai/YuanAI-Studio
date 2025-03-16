import request from '@/utils/request'


/* 添加图片生成视频 */
export function addPhotoHuman(data) {
    return request({
        url: '/aivideo/text_img_video',
        method: 'post',
        data
    })
}

/* 获取图片生成视频 */
export function getPhotoHuman(params) {
    return request({
        url: '/aivideo/get_gen_video',
        method: 'get',
        params
    })
}

/* 删除图片生成视频 */
export function delPhotoHuman(data) {
    return request({
        url: '/aivideo/delete_gen_video',
        method: 'delete',
        data
    })
}




