// index.js
// 获取应用实例
const app = getApp()

let globalData = app.globalData;
// let locationID = globalData.locationID;
let iconurl = globalData.iconurl;

Page({
  data: {
    update: '',
    location: {},
    now: {},
    air: {},
    daily: {},
    iconurl: iconurl,
    location_ID: ""
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad() {
    // 第一次加载时直接获取位置

  },

  onShow() {
    console.log(this.location_ID);
    this.getLocation(this.location_ID);
  },

  setLocation(locationID) {
    this.location_ID = locationID;
  },

  getLocation(locationID = null) {
    var that = this;
    let location_param = "";

    // 当前位置ID为空时，利用定位查询所在地区
    if (locationID == null) {
      var latitude = 0;
      var longitude = 0;
      wx.getLocation({
        type: 'gcj02',
        success: function (res) {
          latitude = res.latitude.toFixed(2);
          longitude = res.longitude.toFixed(2);
          console.log(latitude);
          console.log(longitude);
        }
      })
      location_param = longitude + "," + latitude
    } else {
      location_param = locationID; // 不为空时利用地区ID获取地区名
    }

    let geourl = "https://geoapi.qweather.com/v2/city/lookup";
    wx.request({
      url: geourl,
      data: {
        key: globalData.hfkey,
        location: location_param
      },
      method: "GET",
      success: function (res) {
        // wx.setStorageSync('now', null);
        // wx.setStorageSync('daily', null);
        let location = res.data.location[0];
        if (globalData.locationID == null) {
          globalData.locationID = location.id;
          globalData.name = location.name;
          globalData.adm1 = location.adm1;
          globalData.adm2 = location.adm2;
        }
        that.setData({
          location: location,
          location_ID: location.id
        })

        that.getRealtimeWeatherInfo(location.id);
        that.getDailyWeatherInfo(location.id);
        that.getAirInfo(location.id);
      }
    })
  },
  getRealtimeWeatherInfo: function (locationID) {
    // req.getNow(locationID);
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
    // req.getDaily(locationID);
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
    // var _this = this;
    // //需要在微信公众号的设置-开发设置中配置服务器域名
    // var url = 'https://devapi.qweather.com/v7/weather/3d';
    // wx.request({
    //   url: url,
    //   data: {
    //     key: globalData.hfkey,
    //     location: globalData.locationID
    //   },
    //   method: 'GET',
    //   success: function (res) {
    //     let _daily = res.data.daily;
    //     for (let index = 0; index < _daily.length; index++) {
    //       _daily[index].fxDate = _daily[index].fxDate.slice(-5);

    //     }
    //     _this.setData({
    //       daily: res.data.daily,

    //     });
    //   }
    // })
  },
  getAirInfo: function (locationID) {
    let that = this;
    // req.getAir(locationID);
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
    // var _this = this;
    // //需要在微信公众号的设置-开发设置中配置服务器域名
    // var url = 'https://devapi.qweather.com/v7/air/now';
    // wx.request({
    //   url: url,
    //   data: {
    //     key: globalData.hfkey,
    //     location: globalData.locationID
    //   },
    //   method: 'GET',
    //   success: function (res) {
    //     _this.setData({
    //       air: res.data.now,

    //     });
    //   }
    // })
  },
  showSearchCity: function () {
    wx.navigateTo({
      url: '../citylist/citylist',
    })
  }
})
