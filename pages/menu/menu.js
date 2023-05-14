// pages/menu/menu.js
const util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // date:"",
        show: true,
        content:[],
        pages:0,
        number:0,
        start:1,
       loadText:"1",
       loadtext:"点击加载更多数据"
    },
    setLoading: function(e) {
      
      wx.showToast({ 
        title: '加载中',
        icon: 'loading',
        duration: 200
        })
     // var duanziInfoBefore = this.data.duanziInfo
      var that = this
      console.log(that.data.start);
      util.request(
        'getPhotoWorkList',
         {
          page_index:that.data.start,
          page_size:1
              },
            'POST'
      ).then(function(res){
        console.log(res)
        that.setData({
          start:that.data.start+1,
          content: that.data.content.concat(res.data.data),
        
      })
      if(res.data.data==null |res.data.data==undefined | res.data.data==''){
        wx.showToast({
          title: '无更多数据加载！', 
          icon: 'none',  
          duration: 1500  // 提示窗停留时间，默认1500ms
        })
          that.setData({
           // start:that.data.start+1,
            loadtext: "无更多数据加载",
            show: false
          })
      }
     
      
      })
    },
  


    jumpurl:function(event){
    var  value = event.currentTarget.dataset
    var  url = value.url
    var  type = value.type
    var  name = value.name
    var datacontent = value.datacontent
    var id = value.id
    // var date = value.date
    console.log(url)
    console.log(type)
    console.log(name)
    console.log(datacontent)
    // console.log(date)
    wx.navigateTo({
        url: '../detail/detail?url='+url+'&name='+name+'&type='+type+'&datacontent='+datacontent+'&id='+id,
    })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getlist()
        
    },
    getlist:function(){
        let that = this;

        console.log(this.data.pages);
       util.request(
        'getPhotoWorkList',
        {
          page_index:0,
           page_size:1
         },
            'POST'
      ).then(function(res){
        that.setData({
          content: res.data.data,
          pages:1,
          // date:res.data.data.insert_date
        })
         
        
      })

    
      util.request(
        'getPhotoWorkList',
        
            'POST'
      ).then(function(res){
        that.setData({
          number:res.data.data.length
          
        })
      })
        
       

    },
    // click:function()
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

      // console.log(11111111111111111);
      
      // if(this.data.pages*3<this.data.number){
      //   let that = this;
      //   wx.request({
      //     url: 'http://172.28.0.72:8080/getPhotoWorkList',
      //     //getPhotoWorkList
      //     method:"POST",
      //     data:{
      //       page_index:this.data.start,
      //       page_size:3,
      //       // pages:pages+1
      //     },
      //     header: {
      //       "Content-Type": 
      //        "application/x-www-form-urlencoded"
      //       },
      //     success:(res)=>{
      //         console.log(res);
      //         //console.log(res.data.data.length)
      //         this.data.content.concat(res.data.data) 
      //       //   for(let i = 0 ;di<res.data.data.length;i++){
      //       //      // let theindex= res.data.data.length
                
      //            that.setData({
      //              start:this.data.start+3,
      //              pages:pages+1
      //       //         [ content[0].name]:res.data.data[i].work_title
      //       //         // 'content["+theindex+"].name':res.data.data[i].work_title
                    
      //            })
      //           console.log(this.content.start)
      //       //   }
      //     }
      //   })
      // }
     
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