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
    showSuccess: false
  },
  onShareAppMessage() {
    return {
      title: '抽奖',
      path: 'pages/canvas/canvas'
    }
  },
  close() {
    this.setData({
      showModal: false,
      showPrize: false,
      showRules: false,
      showLose: false,
      showSuccess: false
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
  getUserInfo(e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.userInfo)
    console.log(e.detail.rawData)
    // const that = this
    // wx.getSetting({
    //   success(res) {
    //     if(!res.authSetting['scope.userInfo']) {
    //       wx.authorize({
    //         scope: 'scope.userInfo',
    //         success() {
    //           cosnole.log(arguments)
    //         }
    //       })
    //     }
    //   }
    // })
  },
  showModal() {
    this.setData({
      showModal: true
    })
  },
  onCancel() {
    this.setData({
      showModal: false
    })
  },
  onConfirm(e) {
    this.setData({
      showModal: false
    })
    this.getLottery()
  },
  getLottery: function() {
    var that = this
    var awardIndex = Math.random() * 7 >>> 0;

    // 获取奖品配置
    var awardsConfig = app.awardsConfig,
      runNum = 8
    // if (awardIndex < 2) awardsConfig.chance = false
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
    debugger
    // 记录奖品
    var winAwards = wx.getStorageSync('winAwards') || {
      data: []
    }
    winAwards.data.push(awardsConfig.awards[awardIndex].name + '1个')
    wx.setStorageSync('winAwards', winAwards)

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
  godetail() {
    this.close()
    wx.navigateTo({
      url: '/pages/detail/detail',
    })
  },
  showResult(idx) {
    debugger
    if (idx <= 1) {
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
    console.log(app.globalData.hasAuth)
  },
  onReady: function(e) {
    console.log(app.globalData.hasAuth)
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
    var awardsConfig = app.awardsConfig.awards,
      len = awardsConfig.length,
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
        award: awardsConfig[i].name
      });
    }
    that.setData({
      awardsList: html
    });

    // 对 canvas 支持度太差，换种方式实现
    /*wx.drawCanvas({
      canvasId: 'lotteryCanvas',
      actions: ctx.getActions()
    })*/

  }

})