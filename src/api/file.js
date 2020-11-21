import request from '@/router/axios'

export function upload(file) {
    return request({
        url: '/file/change/save',
        method: 'post',
        data: file
    })
}
