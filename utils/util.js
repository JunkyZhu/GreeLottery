function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function json2url(json) {
  var params = Object.keys(json).map(function (key) {
    // body...
    return encodeURIComponent(key) + "=" + encodeURIComponent(json[key]);
  }).join("&");
  return params
}
function request({url,type,data,method='Post',urlData={}}) {
  let urlParams = json2url(urlData)
  let token = wx.getStorageSync('token')
  let header = {}
  let requsetUrl = 'http://116.62.214.34:8080' + url
  if(token && token != null) {
    header.token = token
  }
  if (urlParams) {
    requsetUrl += `?${urlParams}`
  }
  return new Promise((resolve,rej) => {
    wx.request({
      url: requsetUrl,
      data: data,
      header: header,
      method: method,
      success: function (res) {
        resolve(res.data)
       },
      fail: function (res) { 
        rej(res)
      },
      complete: function (res) { },

    })
  })
}
module.exports = {
  formatTime: formatTime,
  request: request
}
