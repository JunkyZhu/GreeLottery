import {request} from '../../utils/util.js'
import { getActivities, getAwardsList, draw} from '../../services/activity.js'
var app = getApp()
Page({
  data: {
    awardsList: {},
    animationData: {},
    btnDisabled: '',
    showModal: false,
    invoice: '',
    tel: '',
    showResult: true,
    showPrize: false,
    showRules: false,
    showLose: false,
    showSuccess: false,
    result: {},
    obj: {},
    awards: []
  },
  onShareAppMessage() {
    return {
      title: '抽奖',
      path: 'pages/canvas/canvas'
    }
  },
  getAwards() {
    getAwardsList().then(val => {
      this.setData({
        awards: val
      })
    })
  },
  getInfo() {
    console.log(app.hasToken())
    if(!app.hasToken()) {
      app.getToken(this.getActivity)
      
    }else {
      this.getActivity()
    }
  },
  getActivity(id) {
    const that = this
    getActivities({ activityId: id}).then(val => {
      if(val == 'Unauthorized') {
        wx.clearStorage()
        that.getInfo()
      }
      that.setData({
        obj: val
      })
      console.log(that)
      console.log(that.data)
      wx.setNavigationBarTitle({
        title: that.data.obj.name
      })
      that.setCanvasData(that.data.obj.prizeVos)
      that.getAwards(that.data.obj.id)
    })
  },
  close() {
    this.setData({
      showModal: false,
      showPrize: false,
      showRules: false,
      showLose: false,
      showSuccess: false,
      invoice: '',
      tel: '',
    })
  },
  showPrize() {
    this.setData({
      showPrize: true,
    })
  },
  showRules() {
    this.setData({
      showRules: true,
    })
  },
  gotoList: function() {
    wx.redirectTo({
      url: '../list/list'
    })
  },
  inputInvoice(e) {
    this.setData({
      invoice: e.detail.value
    })
  },
  inputTel(e) {
    this.setData({
      tel: e.detail.value
    })
  },
  showModal() {
    this.setData({
      showModal: true
    })
  },
  onCancel() {
    this.close()
  },
  onConfirm(e) {
    if (this.data.invoice == ''){
      wx.showToast({
        title: '请输入发票号',
        icon: 'none',
        duration: 1000
      })
    } else if (this.data.tel == '') {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 1000
      })
    } else {
      this.draw()
    }
  },
  draw() {
    draw(this.data.obj.id, {
      code: this.data.invoice,
      mobile: this.data.tel
    }).then(val => {
      if(val.error) {
        wx.showToast({
          title: val.message,
          icon: 'none'
        })
      } else {
        this.setData({
          result: val
        })
        this.getAwards(this.data.obj.id)
        this.close()
        this.getLottery(this.findAward(val.prizeLevel))
      }
    })
  },
  findAward(level) {
    let index = 0
    this.data.awardsList.forEach((item,idx) => {
      if (item.level === level) {
        index = idx
      }
    })
    return index
  },
  getLottery: function(index) {
    var that = this
    var awardIndex = index

    // 获取奖品配置
    var awardsConfig = app.awardsConfig,
      runNum = 8
    console.log(awardIndex)

    // 初始化 rotate
    /*  var animationInit = wx.createAnimation({
        duration: 10
      })
      this.animationInit = animationInit;
      animationInit.rotate(0).step()
      this.setData({
        animationData: animationInit.export(),
        btnDisabled: 'disabled'
      })*/

    // 旋转抽奖
    app.runDegs = app.runDegs || 0
    console.log('deg', app.runDegs)
    debugger
    app.runDegs = app.runDegs + (360 - app.runDegs % 360) + (360 * runNum - awardIndex * (360 / app.awardsConfig.awards.length))
    console.log('deg', app.runDegs)

    var animationRun = wx.createAnimation({
      duration: 4000,
      timingFunction: 'ease'
    })
    that.animationRun = animationRun
    animationRun.rotate(app.runDegs).step()
    that.setData({
      animationData: animationRun.export(),
      btnDisabled: 'disabled'
    })
    // debugger
    // // 记录奖品
    // var winAwards = wx.getStorageSync('winAwards') || {
    //   data: []
    // }
    // winAwards.data.push(awardsConfig.awards[awardIndex].name + '1个')
    // wx.setStorageSync('winAwards', winAwards)

    // 中奖提示
    setTimeout(function() {
      that.showResult(awardIndex)
      // wx.showModal({
      //   title: '恭喜',
      //   content: '获得' + (awardsConfig.awards[awardIndex].name),
      //   showCancel: false
      // })
      if (awardsConfig.chance) {
        that.setData({
          btnDisabled: ''
        })
      }
    }, 4000);


    /*wx.request({
      url: '../../data/getLottery.json',
      data: {},
      header: {
          'Content-Type': 'application/json'
      },
      success: function(data) {
        console.log(data)
      },
      fail: function(error) {
        console.log(error)
        wx.showModal({
          title: '抱歉',
          content: '网络异常，请重试',
          showCancel: false
        })
      }
    })*/
  },
  godetail(e) {
    let result = this.data.result
    if (e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.result) {
      result = e.currentTarget.dataset.result
    }
    this.close()
    wx.setStorageSync('detail', result)
    wx.navigateTo({
      url: `/pages/detail/detail?id=${result.id}`,
    })
  },
  showResult(idx) {
    if (idx >= 1) {
      this.setData({
        showSuccess: true
      })
    } else {
      this.setData({
        showLose: true
      })
    }
  },
  onLoad() {
    this.getInfo()
  },
  onReady: function(e) {
    var that = this;
    // app.getUserInfo(function(a) {console.log(a)})
    // getAwardsConfig
    app.awardsConfig = {
      chance: true,
      awards: [{
          'index': 0,
          'name': '肯德基'
        },
        {
          'index': 1,
          'name': '麦当劳'
        },
        {
          'index': 2,
          'name': '必胜客'
        },
        {
          'index': 3,
          'name': '华莱士'
        },
        {
          'index': 4,
          'name': '味千拉面'
        },
        {
          'index': 5,
          'name': '星巴克'
        },
        
        // { 'index': 7, 'name': '12313' }
      ]
    }

    // wx.setStorageSync('awardsConfig', JSON.stringify(awardsConfig))

    // 绘制转盘
    var awardsConfig = app.awardsConfig.awards

  },
  setCanvasData(awardsConfig) {
    const that = this
    awardsConfig.unshift({level:0,name: '谢谢参与',detail: '谢谢参与'})
    let len = awardsConfig.length,
      rotateDeg = 360 / len / 2 + 90,
      html = [],
      turnNum = 1 / len // 文字旋转 turn 值
    // that.setData({
    //   btnDisabled: app.awardsConfig.chance ? '' : 'disabled'  
    // })
    var ctx = wx.createContext()
    for (var i = 0; i < len; i++) {
      // 保存当前状态
      ctx.save();
      // 开始一条新路径
      ctx.beginPath();
      // 位移到圆心，下面需要围绕圆心旋转
      ctx.translate(150, 150);
      // 从(0, 0)坐标开始定义一条新的子路径
      ctx.moveTo(0, 0);
      // 旋转弧度,需将角度转换为弧度,使用 degrees * Math.PI/180 公式进行计算。
      ctx.rotate((360 / len * i - rotateDeg) * Math.PI / 180);
      // 绘制圆弧
      ctx.arc(0, 0, 150, 0, 2 * Math.PI / len, false);

      // 颜色间隔
      if (i % 2 == 0) {
        ctx.setFillStyle('rgba(255,184,32,.1)');
      } else {
        ctx.setFillStyle('rgba(255,203,63,.1)');
      }

      // 填充扇形
      ctx.fill();
      // 绘制边框
      ctx.setLineWidth(0.5);
      ctx.setStrokeStyle('rgba(228,55,14,.1)');
      ctx.stroke();

      // 恢复前一个状态
      ctx.restore();

      // 奖项列表
      html.push({
        turn: i * turnNum + 'turn',
        lineTurn: i * turnNum + turnNum / 2 + 'turn',
        award: awardsConfig[i].name,
        detail: awardsConfig[i].detail,
        level: awardsConfig[i].level
      });
    }
    that.setData({
      awardsList: html
    });
  }

})