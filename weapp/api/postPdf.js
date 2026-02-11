/**
 * +----------------------------------------------------------------------
 * | 友得云客  - 开启房产营销新纪元
 * +----------------------------------------------------------------------
 * | Copyright (c) 2019~2023 优得（西安）信息科技有限公司版权所有
 * +----------------------------------------------------------------------
 * | Licensed 友得云客不是自由软件 未经允许不可移除相关版权
 * +----------------------------------------------------------------------
 * | Author: www.youdeyunke.com
 * +----------------------------------------------------------------------
 */
let request = require('../utils/request.js');

/**
 * 获取楼盘PDF文件列表
 * @param {number} postId - 楼盘ID
 */
export function getPostPdfs(postId) {
    return request.get("/api/v6/post_pdfs/", { post_id: postId });
}

/**
 * 下载PDF文件
 * @param {string} url - PDF文件URL
 */
export function downloadPdf(url) {
    return new Promise((resolve, reject) => {
        wx.downloadFile({
            url: url,
            success: (res) => {
                if (res.statusCode === 200) {
                    resolve(res.tempFilePath);
                } else {
                    reject(new Error('下载失败'));
                }
            },
            fail: reject
        });
    });
}
