// index.js
// 获取应用实例
const app = getApp()

let globalData = app.globalData;
// let locationID = globalData.locationID;

Page({
  data: {
    update: '',
    location: {},
    now: {},
    air: {},
    daily: {},
    iconurl: globalData.iconurl,
    location_ID: ""
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad() {
  },

  onShow() {
    let that = this;
    let locationID = this.location_ID;
    this.getLocation(locationID).then(function (location_ID) {
      console.log(location_ID);
      that.getRealtimeWeatherInfo(location_ID);
      that.getDailyWeatherInfo(location_ID);
      that.getAirInfo(location_ID);
    })
  },

  setLocation(locationID) {
    this.location_ID = locationID;
  },

  // 当前位置ID为空时，利用定位查询所在地区
  getWxLocation() {
    return new Promise(function (resolve, reject) {
      wx.getLocation({
        type: "gcj02",
        success: function (res) {
          let latitude = res.latitude.toFixed(2);
          let longitude = res.longitude.toFixed(2);
          let location_param = longitude + "," + latitude;
          resolve(location_param);
        }
      })
    })
  },

  getHFLocation(location_param) {
    let that = this;
    return new Promise(function (resolve, reject) {
      let geourl = "https://geoapi.qweather.com/v2/city/lookup";
      wx.request({
        url: geourl,
        data: {
          key: globalData.hfkey,
          location: location_param
        },
        method: "GET",
        success: function (res) {
          that.setData({
            location: res.data.location[0],
            location_ID: res.data.location[0].id
          })
          resolve(res.data.location[0]);
        }
      })
    })
  },

  getLocation(locationID = null) {
    let that = this;
    return new Promise(function (resolve, reject) {
      if (locationID == null) {
        that.getWxLocation().then(
          function (location_param) {
            console.log(location_param);
            that.getHFLocation(location_param).then(function (location) {
              globalData.geoLocationID = location.id;
              globalData.name = location.name;
              resolve(location.id);
            })
          }
        )
      } else {
        that.getHFLocation(locationID).then(function (location) {
          resolve(location.id);
        });
      }
    })
  },

  getRealtimeWeatherInfo: function (locationID) {
    let that = this;
    //需要在微信公众号的设置-开发设置中配置服务器域名
    let url = 'https://devapi.qweather.com/v7/weather/now';
    wx.request({
      url: url,
      data: {
        key: globalData.hfkey,
        location: locationID
      },
      method: 'GET',
      success: function (res) {
        let now = wx.getStorageSync('now') || {};
        now[locationID] = res.data.now;
        wx.setStorageSync('now', now);
        that.setData({
          now: now[locationID]
        })
      }
    })
  },
  getDailyWeatherInfo: function (locationID) {
    let that = this;
    //需要在微信公众号的设置-开发设置中配置服务器域名
    let url = 'https://devapi.qweather.com/v7/weather/3d';
    wx.request({
      url: url,
      data: {
        key: globalData.hfkey,
        location: locationID
      },
      method: 'GET',
      success: function (res) {
        let daily = wx.getStorageSync('daily') || {};
        daily[locationID] = res.data.daily;
        wx.setStorageSync('daily', daily);
        let _daily = daily[locationID]
        for (let index = 0; index < _daily.length; index++) {
          _daily[index].fxDate = _daily[index].fxDate.slice(-5);
        }
        that.setData({
          daily: _daily
        });
      }
    })
  },
  getAirInfo: function (locationID) {
    let that = this;
    //需要在微信公众号的设置-开发设置中配置服务器域名
    let url = 'https://devapi.qweather.com/v7/air/now';
    wx.request({
      url: url,
      data: {
        key: globalData.hfkey,
        location: locationID
      },
      method: 'GET',
      success: function (res) {
        let air = wx.getStorageSync('air') || {};
        air[locationID] = res.data.now;
        wx.setStorageSync('air', air);
        that.setData({
          air: air[locationID]
        })
      }
    })
  },

  // 跳转城市列表页
  showCityList: function () {
    wx.navigateTo({
      url: '../citylist/citylist',
    })
  }
})
