import request from '@/utils/request'


/* 添加文本生成视频 */
export function addWritVideo(data) {
    return request({
        url: '/aivideo/text_img_video',
        method: 'post',
        data
    })
}

/* 获取文本生成视频 */
export function getWritVideo(params) {
    return request({
        url: '/aivideo/get_gen_video',
        method: 'get',
        params
    })
}

/* 删除文本生成视频 */
export function delWritVideo(data) {
    return request({
        url: '/aivideo/delete_gen_video',
        method: 'delete',
        data
    })
}



