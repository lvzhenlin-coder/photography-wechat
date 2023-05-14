// pages/order/order.js
const util = require("../../utils/util.js");
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({
    /**
     * 页面的初始数据
     */
    data: {
			list:[],
			state:"",
			time:"",
			project:"",
			name:"",
			phone:"",
			address:"",
      marks:"",
      steps: [
        {
          text: '预约申请',
        },
        {
          text: '预约受理中',
        },
        {
          text: '预约成功',
        },
        {
          text: '订单完成',
        },
      ],
      stepsCancel: [
        {
          text: '预约申请',
        },
        {
          text: '预约受理中',
        },
        {
          text: '预约成功',
        },
        {
          text: '预约取消',
        },
      ],
      phoneNumber:'',//客服电话号码
    },
    //获取预约订单信息
		getList(){
      wx.showLoading({
        title: '稍等片刻...',
        mask: true
      })
			let _this = this;
			wx.login({
				success (res) {
          let code = res.code;
          console.log("获取code:",code)
          util.request(
            'getAppointment',
            {
              openid_code: code
            },
            'POST'
          ).then(function(res){
            console.log("订单查询：",res)
            if(res.data.data && res.data.data.length >= 1){
              let orderList = res.data.data;
              for(let i=0;i<orderList.length;i++){
                if(orderList[i].status == 0){
                  orderList[i].status = '预约受理中'
                  orderList[i].active = 1
                  orderList[i].showButton = true;
                  orderList[i].showSteps = true;
                }else if(orderList[i].status == 1){
                  orderList[i].status = '预约成功';
                  orderList[i].active = 2
                  orderList[i].showButton = true;
                  orderList[i].showSteps = true;
                }else if(orderList[i].status == 2){
                  orderList[i].status = '预约已完成'
                  orderList[i].active = 3
                  orderList[i].showButton = false;
                  orderList[i].showSteps = true;
                }else if(orderList[i].status == -1){
                  orderList[i].status = '预约取消成功'
                  orderList[i].active = 3
                  orderList[i].showButton = false;
                  orderList[i].showSteps = false;
                }else if(orderList[i].status == -2){    
                  orderList[i].status = '预约取消成功'
                  orderList[i].active = 3
                  orderList[i].showButton = false;
                  orderList[i].showSteps = false;
                }
              }
              _this.setData({
                list: orderList
              });
              console.log(_this.data.list)
            }else{
              _this.errToast("暂无预约订单")
            }
            wx.hideLoading();
          },function(err){
            wx.hideLoading();
            _this.errToast('系统错误，请稍候再试');
          })
        },
        fail: function(err){
          wx.hideLoading();
          _this.errToast('系统错误，请稍候再试');
        }
			})
    },
    //错误提示
    errToast(text){
      Dialog.alert({
        title: '温馨提示',
        message: text
      }).then(() => {
        wx.navigateBack({
          delta: 1,
        })
      });
    },
    //电话咨询
    callPhone(){
      let _this = this;
      wx.makePhoneCall({
        phoneNumber: _this.data.phoneNumber,
      })
    },
    //取消预约弹窗
    cancelDialog(event){
      Dialog.confirm({
        title: '温馨提示',
        message: '请确认是否取消预约',
      })
      .then(() => {
        // on confirm
        this.cancleOrder(event.currentTarget.dataset.id)
      })
      .catch(() => {
        // on cancel
      });
    
    },
    //确认取消预约
    cancleOrder(code){
      let _this = this;
      wx.login({
        success:function(res){
          util.request(
            'cancelAppointment',
            {
              appo_id: code,
              openid_code: res.code
            },
            'POST'
          ).then(function(res){
            console.log("取消预约",res)
            if(res.data.status == 452){
              Toast(res.data.message);
            }else if(res.data.status == 200){
              Toast(res.data.message);
              _this.getList();
            }else if(res.data.status == 451){
              Toast(res.data.message);
            }else{
              Toast("系统繁忙，请稍后再试");
            }
          },function(error){
            Toast('预约取消申请失败，请稍后再试');
          })
        },
        fail: function(err){
          Dialog.alert({
            title: '温馨提示',
            message: '系统繁忙，请稍候再试'
          })
        }
      })
    },
    getPhoneNumber(){
      let _this = this;
      util.request(
        'consultancy'
      ).then(function(res){
        if(res.data.status == 200){
          _this.setData({
            phoneNumber: res.data.data
          })
        }else{
          Toast("系统繁忙，请稍候再试")
        }
      },function(err){
        Toast("系统繁忙，请稍候再试")
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
      this.getList();
      this.getPhoneNumber();
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