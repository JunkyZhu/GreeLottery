import {
  login
} from '../services/login.js'
const app =getApp()
Page({
  data: {
    phone: '',
    password: ''
  },

  // 获取输入账号
  phoneInput: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },

  // 获取输入密码
  passwordInput: function(e) {
    this.setData({
      password: e.detail.value
    })
  },

  // 登录
  login: function() {
    if (this.data.phone.length == 0 || this.data.password.length == 0) {
      wx.showToast({
        title: '用户名和密码不能为空',
        icon: 'none',
        duration: 1000
      })
    } else {
      // 这里修改成跳转的页面

      this.setLogin()
    }
  },
  setLogin() {
    login({
      username: this.data.phone,
      password: this.data.password
    }).then(val => {
      if(val.error) {
        wx.showToast({
          title: val.message,
          icon: 'none'
        })
      } else {
        app.setToken(val.token)
        wx.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 2000
        })
        setTimeout(function() {
          wx.redirectTo({
            url: '/pages/logs/logs',
          })
        },2000)
      }
      
    }).catch(err => {
      console.log(err)
    })
  },
})