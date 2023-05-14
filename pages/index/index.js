// index.js
// 获取应用实例
const app = getApp()
const util = require("../../utils/util.js")

Page({
  data: {
    httpUrl:'',
    showWroks: false,
    bannerListUrl: [],
    bannerImgHeight:'',
    rateValue: 5,
    showOR: false,//关注展示判断
    worksList: [],
    carouselList:[
      {
        img:"/images/nav/bg1.jpg"
      },
      {
        img:"/images/nav/bg2.jpg"
      }
    ],
    exhibitionList:[
      {
        title:"全部内容",
        url:"/images/nav/bg3.jpg",
        name:"408寝室"
      },
      {
        title:"全部内容",
        url:"/images/nav/bg3.jpg",
        name:"408寝室"
      },
      {
        title:"全部内容",
        url:"/images/nav/bg3.jpg",
        name:"408寝室"
      },
      {
        title:"全部内容",
        url:"/images/nav/bg3.jpg",
        name:"408寝室"
      },
      {
        title:"全部内容",
        url:"/images/nav/bg3.jpg",
        name:"408寝室"
      },
      {
        title:"全部内容",
        url:"/images/nav/bg3.jpg",
        name:"408寝室"
      }
      
    ],
    commentList:[{
      userHead: util.baseUrl+"file/other/avatar1.jpg",
      userName:"爱吃西红柿",
      commentTime:"2022/04/04",
      desc:"拍的非常好"
     },
     {
      userHead: util.baseUrl+"file/other/avatar2.jpg",
      userName:"春天到了",
      commentTime:"2022/04/04",
      desc:"非常nice"
     }
    ],
    active: 1
  },
  onChange(e) {
    console.log(e.detail);
  },
  
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  // goToPage(){
  //   wx.navigateTo({
  //     url: '../../pages/appointment/appointment',
  //   })
  // },
  //获取作品列表
  getWorks(){
    let _this = this;
    util.request(
      'getPhotoWorkList',
      {

      },
      'POST'
    ).then(function(res){
      console.log("获取的作品列表",res);
      if(res.data.data && res.data.data.length > 0){
        let list = [];
        let baseUrl = 'https://请求地址/';
        for(let i=0;i<res.data.data.length;i++){
          list.push({
            title: res.data.data[i].work_title,
            workId: res.data.data[i].work_id,
            url: baseUrl + res.data.data[i].cover_url,
            time: res.data.data[i].insert_date.substring(0,9),
            content: res.data.data[i].work_desc,
            originUrl: res.data.data[i].cover_url,
            type:  res.data.data[i].type_name
          })
        }
        _this.setData({
          worksList: list,
          showWroks: true
        })
      }else{
        
      }
    },function(err){
      console.log("获取的作品列表报错",err);
    }).catch(function(error){
      console.log("获取的作品列表报错",error);
    })
  },

  //点击关注
  subscribe(){
    this.setData({
      showOR: true
    })
  },
  onClose() {
    this.setData({ showOR: false });
  },
  //点击进入专辑详情页
  goToDetail(event){
    console.log('点击作品获取的参数',event.currentTarget.dataset.id)
    let item = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../detail/detail?url='+item.url+'&name='+item.title+'&type='+item.type+'&datacontent='+item.content+'&id='+item.workId
    })
  },
  //星星评级
  onChangeStar(event){
    this.setData({
      rateValue: event.detail,
    });
  },
  //获取轮播图
  getBannerList(){
    let _this = this;
    util.request(
      'getBanner',
      {

      },
      'POST'
    ).then(function(res){
      let bannerUrl = "https://请求地址/";
      let list = [];
      console.log("获取轮播图图片：",res)
      for(let i=0;i<res.data.data.length;i++){
        list.push(bannerUrl+res.data.data[i].img_url)
      }
      _this.setData({
        bannerListUrl: list
      })
      console.log("设置轮播图图片：",list)
    },function(err){

    })
  },
  //获取轮播图图片高度，设置swiper高度
  bannerLoad(event){
    let height = event.detail.height/event.detail.width*750;
    this.setData({
      bannerImgHeight: height+'rpx'
    })
    console.log("下载的轮播图",this.data.bannerImgHeight);
  },
  //监听页面显示
  onShow: function(){
    this.setData({
      httpUrl: util.baseUrl
    })
    this.getBannerList();
    this.getWorks();
  }
})
