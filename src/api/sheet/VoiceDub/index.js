import request from '@/utils/request'


/* 根据台词生成配音 */
export function getPreviewVoice(data) {
    return request({
        url: '/aivoice/tmp_preview',
        method: 'post',
        data
    })
}



