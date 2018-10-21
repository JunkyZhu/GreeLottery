// "tabBar": {
//   "color": "#666",
//     "selectedColor": "#3cc51f",
//       "backgroundColor": "#eee",
//         "borderStyle": "white",
//           "list": [{
//             "pagePath": "pages/canvas/canvas",
//             "text": "去抽奖",
//             "iconPath": "image/icon.png",
//             "selectedIconPath": "image/icon-HL.png"
//           }, {
//             "pagePath": "pages/list/list",
//             "text": "中奖记录",
//             "iconPath": "image/icon.png",
//             "selectedIconPath": "image/icon-HL.png"
//           }]
// }
//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    const that = this
    that.isAuthed()
    let token = wx.getStorageSync('token');
    if (!token) {
      that.goLoginPageTimeOut()
      return
    }
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
    hasAuth: false
  }
})