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
// components/post-pdf-list/post-pdf-list.js
const postPdfApi = require('../../api/postPdf.js');

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        postId: {
            type: Number,
            value: null
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        pdfs: [],
        loading: false
    },

    /**
     * 组件生命周期
     */
    lifetimes: {
        attached: function() {
            if (this.data.postId) {
                this.loadPdfs();
            }
        }
    },

    /**
     * 数据监听器
     */
    observers: {
        'postId': function(postId) {
            if (postId) {
                this.loadPdfs();
            }
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        loadPdfs: function() {
            if (!this.data.postId) return;
            
            this.setData({ loading: true });
            
            postPdfApi.getPostPdfs(this.data.postId).then((res) => {
                if (res.data.code === 0 || res.data.status === 0) {
                    let pdfs = res.data.data || [];
                    // 格式化文件大小
                    pdfs = pdfs.map(pdf => {
                        if (pdf.size) {
                            pdf.sizeText = this.formatFileSize(pdf.size);
                        }
                        return pdf;
                    });
                    this.setData({
                        pdfs: pdfs,
                        loading: false
                    });
                } else {
                    this.setData({ loading: false });
                }
            }).catch(() => {
                this.setData({ loading: false });
            });
        },

        formatFileSize: function(size) {
            if (!size) return '';
            if (size < 1024) {
                return size + ' B';
            } else if (size < 1024 * 1024) {
                return (size / 1024).toFixed(1) + ' KB';
            } else {
                return (size / (1024 * 1024)).toFixed(1) + ' MB';
            }
        },

        viewPdf: function(e) {
            const url = e.currentTarget.dataset.url;
            const name = e.currentTarget.dataset.name;
            
            if (!url) return;
            
            wx.showLoading({
                title: '加载中...',
                mask: true
            });

            // 下载PDF文件
            postPdfApi.downloadPdf(url).then((filePath) => {
                wx.hideLoading();
                // 打开PDF文件
                wx.openDocument({
                    filePath: filePath,
                    fileType: 'pdf',
                    showMenu: true,
                    success: () => {
                        console.log('打开PDF成功');
                    },
                    fail: (err) => {
                        wx.showToast({
                            title: '打开PDF失败',
                            icon: 'none'
                        });
                    }
                });
            }).catch(() => {
                wx.hideLoading();
                wx.showToast({
                    title: '下载失败',
                    icon: 'none'
                });
            });
        }
    }
});
