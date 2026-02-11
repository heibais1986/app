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
// pkgBooking/pages/booking/index.js
const app = getApp()
const bookingApi = require("../../../api/booking")
const postApi = require("../../../api/post")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    loading: false,
    currentDateIndex: 0,
    currentTimeIndex: null,

    // 客户信息
    name: '',
    date: '',
    time: '',
    mobile: '',
    gender: 0,  // 性别：0-保密，1-男，2-女

    // 带看经纪人信息
    brokerName: '',
    brokerMobile: '',

    // 渠道人员信息
    channelUserId: null,
    channelUserName: '',

    // 意向楼盘
    selectedPosts: [],
    showPostSelector: false,
    postSearchKeyword: '',
    postList: [],

    // 备注
    note: '',

    dates: [],
    postId: null,
    booked: false,
    post: null,
    smsCode: null,
    mobileLock: false,
    primaryBtnColor: "#ff9600",
    primaryColor: "#ff9600",
    days: [],
    currentMonth: '',
    bookingConfig: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var user = app.globalData.userInfo
    this.setData({
      user: user,
      mobile: user ? user.mobile : '',
      // 自动填充带看经纪人信息（当前登录用户）
      brokerName: user ? (user.nickname || user.name || '') : '',
      brokerMobile: user ? user.mobile : '',
      channelUserId: user ? user.id : null,
      channelUserName: user ? user.nickname || user.mobile : '当前用户',
      postId: options.pid,
    })
    this.loadPostData(options.pid)
    this.loadPostBookingConfig(options.pid)
  },

  closeHandle: function () {
    this.setData({
      show: false
    })
    wx.navigateBack()
    this.triggerEvent('close', {})
  },

  initTime: function (d) {
    var _this = this
    console.log(d.getDay());
    var today = new Date()
    var hour = d.getHours()
    var times = []
    for (var h = 9; h <= 20; h++) {
      var label = h + ':00'
      var disabled = false

      // 如果是生成今天的时间段, 要判断是否可选时间段
      if (today.getDate() == d.getDate()) {
        disabled = h < hour
      }
      // [d.getDay()]
      var curWeek = this.data.bookingConfig.find(res => {
        if(d.getDay() == 0){
          return res.week == 7
        } else {
          return res.week == (d.getDay())
        }
      })
      var hours = curWeek ? curWeek.hours : []
      if(!disabled){
        if(!hours.includes(label)){
          disabled = true
        }
      }

      var item = {
        label: label,
        value: label,
        disabled: disabled,
      }

      times.push(item)
    }
    return times
  },


  dateClick: function (e) {
    var i = e.currentTarget.dataset['index']
    var todayindex = this.data.days.findIndex(item => item.isToday)
    if(i < todayindex){
      return
    }
    this.setData({
      currentDateIndex: i,
      currentTimeIndex: null
    })
  },

  timeClick: function (e) {
    var i = e.currentTarget.dataset['index']
    this.setData({
      currentTimeIndex: i
    })
  },

  validate: function (log) {},

  submitHandle: function () {
    var _this = this
    this.setData({
      loading: true
    })
    _this._submitHandle()
  },

  shoLoginWindow(){
    this.selectComponent('.loginwindow').openWindow()
  },

  loginsuccess(e){
    // console.log(e);
    var _this = this
    setTimeout(() => {
      var u = app.globalData.userInfo
      if (u && u.id) {
          _this.setData({
              mobile: u.mobile,
              mobileLock: true,
              // 登录成功后自动填充带看经纪人信息
              brokerName: u.nickname || u.name || '',
              brokerMobile: u.mobile || '',
              channelUserId: u.id,
              channelUserName: u.nickname || u.mobile || '当前用户',
          })
      }
    },1000)

  },

  _submitHandle: function () {
    if (this.data.currentTimeIndex == null || this.data.currentDateIndex == null) {
      wx.showToast({
        title: '请选择预约时间',
        icon: 'none',
      })
      this.setData({
        loading: false
      })
      return false;
    }
    if (this.data.name == '') {
      wx.showToast({
        title: '请输入客户姓名',
        icon: 'none'
      })
      this.setData({
        loading: false
      })
      return false
    }
    if (this.data.mobile == '') {
      wx.showToast({
        title: '请输入客户联系方式',
        icon: 'none'
      })
      this.setData({
        loading: false
      })
      return false
    }
    if (this.data.mobile.length < 11) {
      wx.showToast({
        title: '号码格式错误，请重新输入',
        icon: 'none'
      })
      this.setData({
        loading: false
      })
      return false
    }
    if (this.data.brokerName == '') {
      wx.showToast({
        title: '请输入经纪人姓名',
        icon: 'none'
      })
      this.setData({
        loading: false
      })
      return false
    }
    if (this.data.brokerMobile == '') {
      wx.showToast({
        title: '请输入经纪人电话',
        icon: 'none'
      })
      this.setData({
        loading: false
      })
      return false
    }
    if (this.data.brokerMobile.length < 11) {
      wx.showToast({
        title: '经纪人电话格式错误',
        icon: 'none'
      })
      this.setData({
        loading: false
      })
      return false
    }

    var _this = this
    var d = this.data.days[this.data.currentDateIndex]
    var t = d.times[this.data.currentTimeIndex]
    var year = new Date().getFullYear()

    // 构建意向楼盘ID列表
    var postIds = this.data.selectedPosts.map(post => post.id).join(',')
    if (!postIds) {
      postIds = this.data.postId.toString()
    }

    var log = {
      post_id: this.data.postId,
      name: this.data.name,
      mobile: this.data.mobile,
      gender: this.data.gender,
      broker_name: this.data.brokerName,
      broker_mobile: this.data.brokerMobile,
      channel_user_id: this.data.channelUserId,
      post_ids: postIds,
      note: this.data.note,
      date: year + '-' + d.date,
      time: t.value,
      status: 0,
    }

    this.setData({
      loging: true
    })

    bookingApi.createBooking(log).then((resp) => {
      _this.setData({
        loading: false
      })
      if (resp.data.status == 0 || resp.data.code == 0) {
        wx.showToast({
          title: '报备成功',
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 2000)
      } else {
        wx.showToast({
          title: resp.data.message || '报备失败',
          icon: 'none'
        })
      }
    }).catch((err) => {
      _this.setData({
        loading: false
      })
      wx.showToast({
        title: '网络错误，请重试',
        icon: 'none'
      })
    })
  },

  nameChange: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  mobileChange: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  wordChange: function (e) {
    this.setData({
      remark: e.detail.value
    })
  },


  loadData: function () {
    var _this = this
    var user = app.globalData['userInfo']
    // 查询预约状态
    var query = {
      user_id: user.id,
      user_group: 'user',
      post_id: this.data.postId
    }
    bookingApi.getBookingList(query).then((res) => {

    })
  },

  loadPostData(pid){
    var _this = this
    postApi.getPostBaseInfo(pid).then((resp) => {
      if(resp.data.code != 0) { 
        return
      }
      var post = resp.data.data
      wx.setNavigationBarTitle({
        title: resp.data.data.title + '预约看房',
      })
      _this.setData({
          post: post
      })
    })
  },

  loadPostBookingConfig(pid){
    var _this = this
    bookingApi.getPostBookingConfig(pid).then(resp => {
      if(resp.data.code != 0) { 
        return
      }
      this.setData({
        bookingConfig: resp.data.data,
      },()=>{
        _this.getCurrentAndNextWeek()
      })
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  getCurrentAndNextWeek() {
    const today = new Date();
    var todayTimes = this.initTime(today) // 当日的时间段
    const currentDayOfWeek = today.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
    const daysInWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    // Get the date for the Monday of the current week
    const mondayOfCurrentWeek = new Date(today);
    mondayOfCurrentWeek.setDate(today.getDate() - currentDayOfWeek + (currentDayOfWeek === 0 ? -6 : 1));
    mondayOfCurrentWeek.setHours(0, 0, 0, 0);

    // Initialize an array to store the day objects
    const days = [];

    // Loop through the days of the current week and next week
    for (let i = 0; i < 14; i++) {
        const date = new Date(mondayOfCurrentWeek);
        date.setDate(mondayOfCurrentWeek.getDate() + i);

        var day = date.getDate();
        var month = date.getMonth() + 1;
        var dateString = (month < 10 ? "0" : "") + month + "-" + (day < 10 ? "0" : "") + day;

        // Create the day object
        const dayObject = {
            date: dateString,
            day: (date.getDate() < 10 ? "0" : "") + date.getDate(),
            dayOfWeek: daysInWeek[date.getDay()],
            disable:  date.getTime() < today.setHours(0, 0, 0, 0), 
            isToday: date.toDateString() === today.toDateString(),
            times: date.toDateString() === today.toDateString() ? todayTimes : this.initTime(date)
        };

        // Add the day object to the array
        days.push(dayObject);
    }
    this.setData({
      days: days,
      currentMonth: today.getFullYear() + '.' + (today.getMonth()+1),
      currentDateIndex: days.findIndex(item => item.isToday)
    })

},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    var u = app.globalData.userInfo
    if (u && u.id) {
        this.setData({
            mobile: u.mobile,
            mobileLock: true,
            channelUserId: u.id,
            channelUserName: u.nickname || u.mobile || '当前用户',
        })
        // 如果带看经纪人信息为空，则自动填充当前用户信息
        if (!this.data.brokerName) {
            this.setData({
                brokerName: u.nickname || u.name || ''
            })
        }
        if (!this.data.brokerMobile) {
            this.setData({
                brokerMobile: u.mobile || ''
            })
        }
    }
    // this.getCurrentAndNextWeek()

    var _this = this
    app.ensureConfigs((myconfigs) => {
        _this.setData({
            color: myconfigs.color.primary,
            btnColor: myconfigs.color.primary_btn
        })
        wx.setNavigationBarColor({
          backgroundColor: myconfigs.color.primary,
          frontColor: '#ffffff',
        })
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    var _this = this
    return {
      title: _this.data.post.title + "预约看房",
      path: '/pkgBooking/pages/booking/index?pid=' + _this.data.postId
    }
  },
  onShareTimeline(){
    var _this = this
    return {
      title: _this.data.post.title + "预约看房",
      query: 'pid=' + _this.data.postId
    }
  },

  // ========== 报备功能：楼盘选择相关方法 ==========

  showPostSelector() {
    this.setData({
      showPostSelector: true
    })
    this.loadPostList()
  },

  onClosePostSelector() {
    this.setData({
      showPostSelector: false
    })
  },

  onPostSearch(e) {
    this.setData({
      postSearchKeyword: e.detail
    })
    this.loadPostList()
  },

  loadPostList() {
    const postApi = require("../../../api/post")
    var _this = this
    postApi.getPostList({
      kw: this.data.postSearchKeyword,
      per_page: 20
    }).then((resp) => {
      if (resp.data.code === 0) {
        _this.setData({
          postList: resp.data.data || []
        })
      }
    })
  },

  selectPost(e) {
    var post = e.currentTarget.dataset.post
    var selectedPosts = this.data.selectedPosts

    // 检查是否已选择
    var index = selectedPosts.findIndex(item => item.id === post.id)
    if (index > -1) {
      // 已选择，则移除
      selectedPosts.splice(index, 1)
    } else {
      // 未选择，添加（最多5个）
      if (selectedPosts.length >= 5) {
        wx.showToast({
          title: '最多选择5个楼盘',
          icon: 'none'
        })
        return
      }
      selectedPosts.push(post)
    }

    this.setData({
      selectedPosts: selectedPosts
    })
  },

  removePost(e) {
    var postId = e.currentTarget.dataset.id
    var selectedPosts = this.data.selectedPosts.filter(item => item.id !== postId)
    this.setData({
      selectedPosts: selectedPosts
    })
  },

  isPostSelected(postId) {
    return this.data.selectedPosts.some(item => item.id === postId)
  },

  brokerNameChange(e) {
    this.setData({
      brokerName: e.detail
    })
  },

  brokerMobileChange(e) {
    this.setData({
      brokerMobile: e.detail
    })
  },

  noteChange(e) {
    this.setData({
      note: e.detail
    })
  },

  // 性别选择变化
  onGenderChange(e) {
    this.setData({
      gender: parseInt(e.detail)
    })
  }
})