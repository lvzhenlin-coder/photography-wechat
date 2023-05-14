// pages/appointment/appointment.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
const util = require('../../utils/util.js');
Page({
    /**
     * 页面的初始数据
     */
    data: {
			showCampus: false,
			campusAddress:'',
			campusAddressId:'',
			timeId:'',
			httpUrl:'',
			valueTime: '',
			value:'',
			date: '',
			userName:'',
			phone:'',
			address:'',
			remarks:'',
			show: false,
			showTime: false,
			showHour: false,
			actionsCampus: [],
			actionsDate: [],
			actionsTime: [],
			dateListArry: [],
			projectId: '',
		},
		//检测是否微信授权登录
		isLogin(){
			let _this = this;
			//获取存储用户信息
			wx.getStorage({
				key: 'wechatName',
				success(res){
					//用户已授权则查询项目列表信息
					_this.getProjectList();
				},
				fail(res){
					//用户没有授权信息
					wx.showModal({
						title: '友情提示',
						content: '该功能需要授权微信登录后才能正常使用。',
						confirmText: '授权',
						cancelText: '取消',
						success: function (res) {
							if (res.confirm) {
								//调用方法用户授权
								wx.getUserProfile({
									desc: '用于完善预约订单用户信息',
									success:(res) => {
										console.log("授权获取微信用户信息",res);
										wx.setStorage({
											key: 'wechatName',
											data: res.userInfo.nickName
										});
										wx.setStorage({
											key: 'wechatAvatarUrl',
											data: res.userInfo.avatarUrl
										});
										//查询项目列表信息
										_this.getProjectList();
									},
									fail:(err) => {
										//用户不授权，返回上一个页面
										wx.navigateBack({
											delta: 1,
										})
									}
								})
							} else if (res.cancel) {
								wx.navigateBack({
									delta: 1,
								})
							}
						}
					})
				}
			})
		},
		//点击展示校区
		selectCampus(){
			this.setData({
				showCampus: true
			})
		},
		//选择校区
		onSelectCampus(e){
			console.log("选择的校区",e)
			this.setData({
				campusAddress: e.detail.name,
				campusAddressId: e.detail.id
			})
			this.getDateList();
		},
		//点击套餐项目
		selectProject(){
			this.setData({
				show: true
			})
		},
		//关闭校区选项
		onCloseCampus(){
			this.setData({
				showCampus: false
			})
		},
		//关闭套餐项目
		onCloseSheet() {
			this.setData({ show: false });
		},
		//选择具体套餐项目
		onSelect(event) {
			console.log(event.detail);
			this.setData({
				value: event.detail.name + ':  '+ event.detail.subname,
				show: false,
				projectId: event.detail.projectId
			})
		},
		//选择预约日期
		onSelectDate(e){
			console.log("选择日期",e)
			this.setData({
				date: e.detail.name,
				valueTime: ''
			});
			let listTime = [];
			for(let i=0;i<this.data.dateListArry.length;i++){
				if(this.data.dateListArry[i].appo_date == e.detail.name){
					listTime = this.data.dateListArry[i].serviceTimeList
				}
			}
			console.log("获取的具体时间区间：",listTime)
			if(listTime && listTime.length > 0){
				let listTime1 = [];
				for(let j=0;j<listTime.length;j++){
					let listTimeObject = {"name":'',"id":''};
					listTimeObject['name'] = listTime[j].show_time;
					listTimeObject['id'] = listTime[j].slot_id;
					listTime1.push(listTimeObject);
				}
				this.setData({
					actionsTime: listTime1
				})
			}else{
				this.setData({
					date: ''
				})
				Toast("非常抱歉，该日期无可预约时间，请另选择其他日期。")
			}
			
		},
		//选择具体服务时间
		onSelectTime(event) {
		    console.log(event.detail);
			this.setData({
				valueTime: event.detail.name,
				timeId: event.detail.id,
				showHour:false
			})
	    },
		//打开日历
		onDisplay() {
			if(this.data.campusAddress){	
				if(this.data.dateListArry.length > 0){
					this.setData({ showTime: true });
				}else{
					Toast("非常抱歉，暂无可预约日期")
				}
			}else{
				Toast("请选择拍摄校区")
			}
			
		},
		//关闭日历
		onClose() {
			this.setData({ showTime: false });
		},
		//过滤日期
		formatDate(date) {
			date = new Date(date);
			return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
		},
		//点击打开具体时间面板
		onOpenTime(){
			if(this.data.date){
				this.setData({
					showHour: true
				})
			}else{
				Toast("请选择预约日期")
			}
		},
		//关闭具体时间面板
		onCloseTime(){	
			this.setData({	
				showHour:false
			})
		},
		//提交预约订单
		submit(){
			let _this = this;
			//判断是否填写完必填信息
			if(this.data.value && this.data.date && this.data.userName && this.data.phone && this.data.campusAddress && this.data.valueTime){
				wx.showLoading({
					title: '提交中...',
					mask: true
				})
				//请求获取微信小程序code
				wx.login({
					success:function(res){
						console.log("获取code",res);
						let code = res.code;
						//请求提交预约订单
						util.request(
							'addAppointment',
							{
								service_id: _this.data.projectId,
								campus_id: _this.data.campusAddressId,
								user_name: _this.data.userName,
								user_tel: _this.data.phone,
								appo_date: _this.data.date,
								slot_id: _this.data.timeId,
								appo_addr: _this.data.address,
								remark: _this.data.remarks,
								openid_code: code
							},
							'POST'
						).then(function(res){
							wx.hideLoading();
							console.log(res);
							if(res.data.status == 200){
								wx.redirectTo({
									url: '../success/success',
								})
							}else{
								wx.hideLoading();
								Toast('系统繁忙，请稍候再试。');
							}
						},function(err){
							wx.hideLoading();
							Toast('系统繁忙，请稍候再试。');
						}).catch(function(error){
							wx.hideLoading();
							Toast('系统繁忙，请稍候再试。');
						})
					}
				})
			}else{
				Toast('请填写完必输项');
			}
		},
		//获取项目列表信息
		getProjectList(){
			wx.showLoading({
				title: '稍等片刻...',
				mask: true
			})
			let _this = this;
			util.request(
				'getServiceType',
				{
					order: 'asc'
				},
				'GET'
			).then(function(res){
				wx.hideLoading();
				let list = [];
				for(let i=0;i<res.data.data.length;i++){
					list.push({
						name: res.data.data[i].type_name,
						subname: res.data.data[i].type_desc,
						projectId: res.data.data[i].type_id
					})
				};
				_this.setData({
					actions: list
				})
				console.log("查询到的项目名称",list);
			},function(err){
				wx.hideLoading();
				_this.errToast('系统繁忙，请稍候再试');
			}).catch(function(error){
				_this.errToast('系统繁忙，请稍候再试');
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
		//获取位置
		chooseLocation(){
			let _this = this;
			wx.chooseLocation({
					success: function(res){
						_this.setData({
							address: res.address
						})
					},
					fail: function(err){
						Toast('获取位置失败');
					}
				})
			// wx.getSetting({
			// 	success:function(res){
			// 		console.log("获取用户授权：",res)
			// 		if(res.authSetting['scope.userLocation'] || res.authSetting['scope.address']){
			// 			wx.openSetting({
			// 				success: function(data){
			// 					console.log("设置用户授权",data)
			// 					if(data.authSetting['scope.userLocation'] === true){
			// 						wx.chooseLocation({
			// 							success: function(res){
			// 								_this.setData({
			// 									address: res.address
			// 								})
			// 							},
			// 							fail: function(err){
			// 								Toast('获取位置失败');
			// 							}
			// 						})
			// 					}
			// 				}
			// 			})
			// 		}else{
			// 			wx.chooseLocation({
			// 				success: function(res){
			// 					_this.setData({
			// 						address: res.address
			// 					})
			// 				},
			// 				fail: function(err){
			// 					Toast('获取位置失败');
			// 				}
			// 			})
			// 		}
			// 	},
			// 	fail: function(err){

			// 	}
			// })
		},
		//设置日历日期区间
		setCalender(min,max){
			this.setData({
				minDate: new Date(min).getTime()
			});
			this.setData({
				maxDate: new Date(max).getTime()
			})
		},
		//获取校区
		getCampus(){
			let _this = this;
			wx.request({
				url: 'https://请求地址/getAllCampus',
				success: function(res){
					if(res.data.status == 200){
						if(res.data.data && res.data.data.length > 0){
							let list = [];
							for(let i=0;i<res.data.data.length;i++){
								let objecList = {name:'',id:''}
								objecList['name'] = res.data.data[i].campus_name
								objecList['id'] = res.data.data[i].campus_id
								list.push(objecList);
							}
							_this.setData({
								actionsCampus: list
							})
						}
					}
				},
				fail: function(err){
					console.log("获取校区失败:",err)
				}
			})
		},
		getDateList(){
			wx.showLoading({
				title: '稍等片刻',
			})
			let _this = this;
			wx.request({
				url: 'https://请求地址/getAllAvailableServiceTime',
				data:{
					campus_id: _this.data.campusAddressId
				},
				success:function(res){
					if(res.data.data && res.data.data.length > 0){
						_this.setData({
							dateListArry: res.data.data
						})
						console.log("获取的校区时间：",res.data.data)
						let dateList = [];
						for(let i=0;i<res.data.data.length;i++){
							let objecjDate = {'name':''}
							objecjDate['name'] = res.data.data[i].appo_date;
							dateList.push(objecjDate);
						}
						_this.setData({
							actionsDate: dateList
						})
					}
					wx.hideLoading()
				},
				fail: function(err){
					wx.hideLoading()
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
			this.getCampus()
			this.setCalender('2022, 4, 29','2022, 5, 14')
			this.setData({
				httpUrl: util.baseUrl
			})
			this.isLogin();
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