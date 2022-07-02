// pages/city/city.js
const app = getApp();
let globalData = app.globalData;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //城市参数
    cityParams: {
      key: '',
      location: '',
      range: 'cn', // 国家地区代码
      // number: 20, //0-20
    },
    likeCityList: [], //猜测喜欢的城市列表
    cityList: [], //搜索后的城市列表
    location: '', //搜索的城市名
    isShow: false, //是否显示搜索后的城市列表
  },

  //获取喜欢的城市列表
  getLikeCityList() {
    let likeCityList = [{
      id: '101010100',
      name: '北京'
    },
    {
      id: '101280101',
      name: '广州'
    },
    {
      id: '101020100',
      name: '上海'
    },
    {
      id: '101280601',
      name: '深圳'
    },
    {
      id: '101210101',
      name: '杭州'
    },
    {
      id: '101200101',
      name: '武汉'
    },
    {
      id: '101250101',
      name: '长沙'
    },
    {
      id: '101050101',
      name: '哈尔滨'
    },
    {
      id: '101270101',
      name: '成都'
    }
    ];
    this.setData({
      likeCityList: likeCityList
    })
  },

  //搜索城市
  bindConfirm() {
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    wx.request({
      url: 'https://geoapi.qweather.com/v2/city/lookup',
      data: {
        key: globalData.hfkey,
        location: that.data.location
      },
      method: "GET",
      success: function (res) {
        wx.hideLoading();
        that.setData({
          cityList: res.data.location,
          isShow: true
        });

      }
    })
  },

  //键盘输入监听
  bindInput(e) {
    let that = this;
    var value = e.detail.value;
    if (!value) {
      that.setData({
        cityList: [],
        isShow: false,
      })
      return;
    }
    that.setData({
      location: value
    })
  },

  //点击选择城市
  bindChoose(e) {
    let id = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.name;
    let city_selected = wx.getStorageSync('citySelected') || [];
    let id_to_city = wx.getStorageSync('id_to_city') || [];
    if (!city_selected.includes(id)) {
      let url = 'https://devapi.qweather.com/v7/weather/now';
      wx.request({
        url: url,
        data: {
          key: globalData.hfkey,
          location: id
        },
        method: 'GET',
        success: function (res) {
          let now = wx.getStorageSync('now') || {};
          now[id] = res.data.now;
          wx.setStorageSync('now', now);

          city_selected.push(id);
          id_to_city.push(name);
          wx.setStorageSync('citySelected', city_selected);
          wx.setStorageSync('id_to_city', id_to_city);
          wx.navigateBack();
        }
      })
    } else {
      wx.navigateBack();
    }
    // globalData.locationID = id;

  },

  //重置值
  resetValues() {
    this.setData({
      cityList: [],
      location: '',
      isShow: false,
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getLikeCityList();
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
    this.resetValues();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.resetValues();
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