// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: '', // 云开发环境名，使用云存储时需要

        traceUser: true,
      })
    }
  },
  globalData: {
    userInfo: null,
    hfkey: '', // 和风天气key
    iconurl: "", // 图标地址
    geoLocationID: null, // 和风天气城市API的当前位置
    name: null, // 城市名
    adm1: null,
    adm2: null
  }
})
