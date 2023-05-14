// pages/combine/combine.js
const util = require('../../utils/util.js');
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    suitListUrl:[],
    clothListUrl:[],
    suit:[
    // {name:"AAAAAAAAAAA",path:"https://img.yzcdn.cn/vant/cat.jpeg"},
    // {name:"bBBBBBBBBBBB",path:"https://img.yzcdn.cn/vant/cat.jpeg"},
    // {name:"cCCCCCCCCCC",path:"https://img.yzcdn.cn/vant/cat.jpeg"}
    ],
      cloth:[]
  },
  getclothlist:function(){
    let that = this;
    util.request(
      'getDressType',
      {

      },
      'POST'
    ).then(function(res){
      console.log(res)
      that.setData({
        cloth: res.data.data
      })
      let list = [];
      let httpUrl = "https://请求地址"
      for(let i=0;i<res.data.data.length;i++){
        list.push(httpUrl+res.data.data[i].cover_url)
      }
      console.log("赋予的服装列表:",list);
      that.setData({
        clothListUrl: list
      })
  })


   
},
  onClick(event) {
    // wx.showToast({
    //   // title: `点击标签 ${event.detail.name}`,
    //   icon: 'none',
    // });
    console.log(11)
  },
  junmpsuit:function(event){
    var  value = event.currentTarget.dataset
    var  url = value.url
    //var  type = value.type
    var  name = value.name
    //var datacontent = value.datacontent
    console.log(url)
    //console.log(type)
    console.log(name)
    //console.log(datacontent)

    wx.navigateTo({
        url: '../suitdetail/suitdetail?url='+url+'&name='+name
    })
    },
    // clothes:function(){
    //   wx.navigateTo({
    //     url: '../suit/suit',
    //   })
    // },
    getsuitlist:function(){
      let that = this;
      util.request(
        'getServiceType',
        {},
        'POST'
      ).then(function(res){
        console.log("套餐列表：",res)
        let list = [];
        let httpUrl = "https://请求地址"
        that.setData({
          suit: res.data.data
        });
        for(let i=0;i<res.data.data.length;i++){
          list.push(httpUrl+res.data.data[i].cover_url)
        }
        console.log("赋予的套餐列表:",list);
        that.setData({
          suitListUrl: list
        })
    },function(err){
      that.errToast("系统繁忙，请稍候再试")
    })
  },
  //错误提示
  errToast(text){
    Dialog.alert({
      title: '温馨提示',
      message: text
    }).then(() => {
      wx.switchTab({
        url: '../../pages/index/index'
      })
    });
  },
  previewImage(e){
    let currentUrl = e.currentTarget.dataset.src;
    let _this = this;
		wx.previewImage({
      current: currentUrl, // 当前显示图片的http链
      urls: _this.data.suitListUrl // 需要预览的图片http链接列表
		})
  },
  previewSuit(e){
    let currentUrl = e.currentTarget.dataset.src;
    let _this = this;
		wx.previewImage({
      current: currentUrl, // 当前显示图片的http链
      urls: _this.data.clothListUrl // 需要预览的图片http链接列表
		})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var that = this
    this.getsuitlist()
    this.getclothlist()
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