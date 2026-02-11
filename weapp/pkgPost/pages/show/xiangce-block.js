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
// pkgPost/pages/show/xiangce-block.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        value: { type: Object },
        color: { type: String, value: '#3A6BDD' }
    },

    /**
     * 组件的初始数据
     */
    data: {
        videoUrl: '',
        show: false,
        showActionSheet: false,
        actionSheetActions: [
            { name: '查看大图', type: 'view' },
            { name: '下载图片', type: 'download' },
        ],
        currentItem: null,
    },

    /**
     * 组件的方法列表
     */
    methods: {
        itemClick (e) {
            var items = this.data.value.items
            var i = e.currentTarget.dataset.i
            if (items[i].cat != 'video') {
                wx.navigateTo({
                    url: items[i].url,
                })
            }
            if (items[i].cat == 'video') {
                this.setData({
                    show: true,
                    videoUrl: items[i].cover
                })
            }
        },
        onClose () {
            this.setData({ show: false, videoUrl: '' });
        },

        // 显示操作菜单（长按）
        showActionMenu: function(e) {
            var index = e.currentTarget.dataset.i
            var item = this.data.value.items[index]
            if (item.cat == 'video' || item.cat == 'vr') {
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
            var index = this.data.currentIndex
            if (!item) return

            switch(action.type) {
                case 'view':
                    this.viewImage(item)
                    break
                case 'download':
                    this.doDownloadImage(item.cover)
                    break
            }
            this.setData({
                showActionSheet: false,
            })
        },

        // 查看大图
        viewImage: function(item) {
            wx.navigateTo({
                url: item.url,
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
