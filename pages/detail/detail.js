// pages/detail/detail.js
const util = require('../../utils/util.js');
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    httpUrl: '',
    listUrl:[],
    list:[],
    listLength: 0,
    listCount: 0,
    url:"",
    type:"",
    name1:"",
    datacontent:"",
    id:"",
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  getDetaildata:function(a){
    console.log(a)
    let that = this;
    util.request(
      "getPhotoWorkImgByWorkId",
      {
        work_id:a
      },
      "POST"
    ).then(function(res){
      if(res.data.status == 200){
        if(res.data.data && res.data.data.length>0){
          that.setData({
            "list": res.data.data,
            "listLength": res.data.data.length,
            "listUrl[0]": res.data.data[0]
          })
          console.log(res.data)
          console.log("数组长度",that.data.listLength)
        }
      }else{
        Toast('图片加载失败~');
      }
    },function(err){
      Toast('图片加载失败~');
    })
  },
  imgLoadComplete(){
    let listIndex = '';
    this.setData({
      "listCount": this.data.listCount+1
    })
    if(this.data.listCount < this.data.listLength){
      listIndex = "listUrl["+this.data.listCount+"]";
      this.setData({
        [listIndex]: this.data.list[this.data.listCount]
      })
    }
  },
  onLoad: function (options) {
    
    var that = this 
    that.setData({
      id:options.id,
      url:options.url,
      type:options.type,
      name1:options.name,
      datacontent:options.datacontent,
      httpUrl: util.baseUrl
      // date:options.date
    })
    //console.log(id)
    this.getDetaildata(options.id)
    // this.name1 = options.name;
    // this.type = options.type;
    //  url = options.url;
    //  datacontent = options.datacontent;
    // console.log(options.name);//得到的结果是  1,2  是一个字符串
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