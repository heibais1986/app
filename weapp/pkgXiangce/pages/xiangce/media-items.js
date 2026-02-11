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
// pkgXiangce/pages/xiangce/index/media-items.js
const app = getApp()
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        items: { type: Array },
    },

    /**
     * 组件的初始数据
     */
    data: {
        showVideo: false,
        //mark: 'watermark/4/text/6IGq5bGL6YCJ5oi_/font/5a6L5L2T/fontsize/500/fill/Z3JheQ==/dissolve/50/rotate/-45/uw/100/uh/100/resize/1',
        mark: '',
        playVideo: false,
        videoUrl: '',
        showActionSheet: false,
        actionSheetActions: [
            { name: '查看大图', type: 'view' },
            { name: '下载图片', type: 'download' },
        ],
        currentItem: null,
    },

    ready: function () {
        var _this = this
        setTimeout(() => {
            _this.setData({ showVideo: true })
        }, 500)

    },

    /**
     * 组件的方法列表
     */
    methods: {

        viewVideo: function (i) {
            var _this = this

            var urls = this.data.items.map((m) => { return { url: m.url, type: 'video' } })
            console.log(urls)
            wx.previewMedia({
                sources: urls,
                current: i
            })
        },
        viewImage: function (item) {
            var _this = this
            var url = item.url + '?' + this.data.mark
            var urls = this.data.items.filter( item => item.filetype == 'image').map((m, i) => { return m.url + '?' + _this.data.mark })
            wx.previewImage({
                current: url,
                urls: urls,
            })
        },
        itemClick: function (e) {
            var _this = this
            var index = e.currentTarget.dataset.index
            var item = this.data.items[index]
            console.log('index is', index, 'item is', item, 'items sis', this.data.items)
            switch (item.filetype) {
                case 'image':
                    _this.viewImage(item)
                    break;
                case 'video':
                    var url = item.url
                    // app.gotoVideo(url, '视频')
                    // var videoUrl = img.url
                    this.setData({
                      videoUrl: url,
                      playVideo: true,
                    })
                    break;
            }

        },
        closeVideoPopup(){
            this.setData({
                playVideo: false,
                videoUrl: ''
            })
        },

        // 显示操作菜单（长按）
        showActionMenu: function(e) {
            var index = e.currentTarget.dataset.index
            var item = this.data.items[index]
            if (item.filetype !== 'image') {
                return
            }
            this.setData({
                showActionSheet: true,
                currentItem: item,
                currentIndex: index,
            })
        },

        // 关闭操作菜单
        onCloseActionSheet: function() {
            this.setData({
                showActionSheet: false,
                currentItem: null,
            })
        },

        // 选择操作
        onSelectAction: function(e) {
            var action = e.detail
            var item = this.data.currentItem
            if (!item) return

            switch(action.type) {
                case 'view':
                    this.viewImage(item)
                    break
                case 'download':
                    this.doDownloadImage(item.url)
                    break
            }
            this.setData({
                showActionSheet: false,
            })
        },

        // 点击下载按钮
        downloadImage: function(e) {
            e.stopPropagation()
            var url = e.currentTarget.dataset.url
            this.doDownloadImage(url)
        },

        // 执行下载图片
        doDownloadImage: function(imageUrl) {
            var _this = this
            wx.showLoading({
                title: '下载中...',
                mask: true,
            })

            // 先下载图片到本地
            wx.downloadFile({
                url: imageUrl,
                success: function(res) {
                    if (res.statusCode === 200) {
                        // 保存到相册
                        _this.saveImageToPhotosAlbum(res.tempFilePath)
                    } else {
                        wx.hideLoading()
                        wx.showToast({
                            title: '下载失败',
                            icon: 'none',
                        })
                    }
                },
                fail: function() {
                    wx.hideLoading()
                    wx.showToast({
                        title: '下载失败',
                        icon: 'none',
                    })
                }
            })
        },

        // 保存图片到相册
        saveImageToPhotosAlbum: function(filePath) {
            var _this = this
            wx.saveImageToPhotosAlbum({
                filePath: filePath,
                success: function() {
                    wx.hideLoading()
                    wx.showToast({
                        title: '保存成功',
                        icon: 'success',
                    })
                },
                fail: function(err) {
                    wx.hideLoading()
                    if (err.errMsg.includes('auth deny') || err.errMsg.includes('authorize')) {
                        // 用户拒绝授权，引导开启权限
                        wx.showModal({
                            title: '提示',
                            content: '需要您授权保存到相册',
                            confirmText: '去授权',
                            success: function(res) {
                                if (res.confirm) {
                                    wx.openSetting({
                                        success: function(settingRes) {
                                            if (settingRes.authSetting['scope.writePhotosAlbum']) {
                                                wx.showToast({
                                                    title: '授权成功，请重新下载',
                                                    icon: 'none',
                                                })
                                            }
                                        }
                                    })
                                }
                            }
                        })
                    } else {
                        wx.showToast({
                            title: '保存失败',
                            icon: 'none',
                        })
                    }
                }
            })
        },
  
    }
})
