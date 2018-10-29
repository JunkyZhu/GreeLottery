// pages/detail.js
import { editAddr,getDetail } from '../../services/activity.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showResult: false,
    showAddr: false,
    adress: '',
    linkman: '',
    linktel: '',
    detail: {
      text:123
    }
  },
  copy() {
    wx.setClipboardData({
      data: this.data.detail.uuid,
      success(){
        wx.showToast({
          title: '复制成功！',
        })
        setTimeout(function() {
          wx.hideToast()
        }, 1000)
      }
    })
  },
  close() {
    this.setData({
      showResult: false,
      showAddr: false,
    })
    this.getDetail(this.data.id)
  },
  getDetail(id) {
    getDetail(id).then(val => {
      this.setData({
        detail: val,
        adress: val.adress,
        linkman: val.linkman,
        linktel: val.linktel,
      })
    })
  },
  showAddrDialog() {
    this.setData({
      showAddr: true
    })
    // wx.chooseAddress({
    //   success(res) {
    //     console.log(res.userName)
    //     console.log(res.postalCode)
    //     console.log(res.provinceName)
    //     console.log(res.cityName)
    //     console.log(res.countyName)
    //     console.log(res.detailInfo)
    //     console.log(res.nationalCode)
    //     console.log(res.telNumber)
    //   }
    // })
  },
  confirm() {
    editAddr(this.data.detail.id, {
      "adress": this.data.adress,
      "linkman": this.data.linkman,
      "linktel": this.data.linktel
    }).then(val => {
      wx.showToast({
        title: '添加成功！',
      })
      this.close()
      this.getDetail(this.data.id)
    })
  },
  getCode() {
    this.setData({
      showResult: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    const that = this
    let id = option.id
    this.getDetail(id)
    this.setData({
      id: id
    })
  },
  inputName(e) {
    this.setData({
      linkman: e.detail.value
    })
  },
  inputTel(e) {
    this.setData({
      linktel: e.detail.value
    })
  },
  inputAddr(e) {
    this.setData({
      adress: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})