// pages/mine/mine.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({
    /**
     * 页面的初始数据
     */
    data: {
      username:"",
      userImg:"",
      show: false
    },
    getstrage(){
      wx.showLoading({
        title: '稍等片刻',
        mask: true
      })
      let _this = this;
      new Promise(function(resolve,reject){
        wx.getStorage({
          key:"wechatName",
          success(res){
            wx.hideLoading();
            _this.setData({
              username: res.data,
              show: true
            })
            resolve(res)
          },
          fail(err){
            wx.hideLoading();
            reject(err)
          }
        })
      }).then(function(ress){
        wx.getStorage({
          key:"wechatAvatarUrl",
          success(portrait){
            _this.setData({
              userImg: portrait.data,
              show: true
            })
            console.log("用户头像",_this.data.userImg)
          },
          fail(err){
            
          }
        })
      },function(error){
        _this.authorize();
      })
      
    },
    //微信用户授权
    authorize(){
      let that = this;
      wx.showModal({
        title: '友情提示',
        content: '该功能需要授权微信登录后才能正常使用。',
        confirmText: '授权',
        cancelText: '取消',
        success: function (res) {
          if (res.confirm) {
            wx.getUserProfile({
              desc: '用于完善预约订单用户信息',
              success:(res) => {
                wx.hideLoading();
                console.log("授权获取微信用户信息",res);
                wx.setStorage({
                  key: 'wechatName',
                  data: res.userInfo.nickName
                });
                wx.setStorage({
                  key: 'wechatAvatarUrl',
                  data: res.userInfo.avatarUrl
                });
                that.setData({
                  username: res.userInfo.nickName,
                  userimg: res.userInfo.avatarUrl
                });
                that.getstrage()
              },
              fail:(err) => {
                console.log("微信授权失败",err)
                wx.switchTab({
                  url: '../../pages/index/index'
                })
              }
            })
          } else {
            wx.switchTab({
              url: '../../pages/index/index'
            })
          }
        }
      })
    },
    //轻提示
    setToast(){
      Toast("该功能尚未开放，敬请期待")
    },
    //删除存储用户数据
    delete(){
      wx.removeStorage({
        key: 'wechatName',
        success: function(res){
          console.log('获取用户头像链接',res)
        },
        fail: function(err){
          console.log("获取失败",err)
        }
      })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
      this.getstrage()
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