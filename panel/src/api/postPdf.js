import request from '@/utils/request'

// 获取楼盘PDF列表
export function getPostPdfs(postId) {
    return request({
        url: '/admin6/post_pdfs',
        method: 'get',
        params: { post_id: postId }
    })
}

// 添加楼盘PDF
export function addPostPdf(data) {
    return request({
        url: '/admin6/post_pdfs',
        method: 'post',
        data: data
    })
}

// 更新楼盘PDF
export function updatePostPdf(id, data) {
    return request({
        url: `/admin6/post_pdfs/${id}`,
        method: 'put',
        data: data
    })
}

// 删除楼盘PDF
export function deletePostPdf(id) {
    return request({
        url: `/admin6/post_pdfs/${id}`,
        method: 'delete'
    })
}
