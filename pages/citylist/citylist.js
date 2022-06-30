//获取应用实例
var app = getApp();
let globalData = app.globalData;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconurl: globalData.iconurl,
    citySelected: {},
    locationID: "",
    new_city_name: ""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let now = wx.getStorageSync("now");
    this.setData({
      // userInfo: app.globalData.userInfo,
      // weatherData: wx.getStorageSync('weatherData'),
      currentName: globalData.name,
      // currentAdm1: globalData.adm1,
      currentData: now[globalData.locationID],
      // citySelected: wx.getStorageSync('citySelected'),
    })

  },

  onShow: function () {
    let city_selected = wx.getStorageSync('citySelected');
    let id_to_city = wx.getStorageSync('id_to_city');

    this.setData({
      citySelected: city_selected,
      id_to_city: id_to_city,
      now: wx.getStorageSync('now')
    })
  },

  // 移除地区
  removeCity: function (e) {
    try {
      let cityCode = e.currentTarget.dataset.city_code || '';
      if (cityCode == "") {
        return
      }
      let citySelected = wx.getStorageSync('citySelected');
      let id_to_city = wx.getStorageSync('id_to_city');
      for (let k in citySelected) {
        if (citySelected[k] == cityCode) {
          citySelected.splice(k, 1);
          id_to_city.splice(k, 1);
          break;
        }
      }
      wx.setStorageSync('citySelected', citySelected);
      wx.setStorageSync('id_to_city', id_to_city)
      this.setData({
        citySelected: citySelected,
        id_to_city: id_to_city,
      })
    } catch (e) { }
  },

  // 选择定位位置
  selectCurPos: function () {
    let pages = getCurrentPages();
    let indexpage = pages[pages.length - 2];
    indexpage.setLocation(null);
    wx.navigateBack();
  },

  // 选择地区
  selectCity: function (e) {
    let locationID = e.currentTarget.dataset.city_code;
    // console.log(locationID);
    // globalData.locationID = locationID;
    let pages = getCurrentPages();
    let indexpage = pages[pages.length - 2];
    indexpage.setLocation(locationID);
    wx.navigateBack();
  },

  // 添加地区
  showSearchCity: function () {
    wx.navigateTo({
      url: '../city/city',
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})