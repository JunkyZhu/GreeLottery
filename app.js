import {request} from './utils/util.js'
//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    const that = this
    that.isAuthed()
    let token = wx.getStorageSync('token');
  },
  getToken(cb) {
    const that = this
    wx.login({
      success(res) {
        if (res.code) {
          debugger
          request({
            url: '/wechat_users/login',
            method: 'Get',
            urlData: {
              code: res.code,
              type: 1
            }
          }).then(val => {
            if (val.data.token) {
              that.setToken(val.data.token)
            }
            cb && cb(val.data.token)
          })
        }
      }
    })
  },
  hasToken() {
    return wx.getStorageSync('token')
  },
  setToken(data) {
    wx.setStorageSync('token', data)
  },
  goLoginPageTimeOut: function () {
    setTimeout(function () {
      wx.navigateTo({
        url: "/pages/authorize/index"
      })
    }, 1000)
  },
  isAuthed() {
    const that = this
    wx.getSetting({
      success(res) {
        if (res.authSetting && res.authSetting["scope.userInfo"]) {
          that.globalData.hasAuth = true
        }
      }
    })
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function (code) {
          console.log(code)
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo:null,
    awardsConfig: {},
    runDegs: 0,
    hasAuth: false,
    baseURL: 'http://116.62.214.34:8080'
  }
})