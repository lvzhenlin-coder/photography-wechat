// component/appointment/appointment.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
			showShare: false,
			options: [
				[
					{ name: '微信', icon: 'wechat', openType: 'share' },
					{ name: '微博', icon: 'weibo', openType: 'share' },
					{ name: 'QQ', icon: 'qq', openType: 'share' },
				],
			],
    },

    /**
     * 组件的方法列表
     */
    methods: {
			//跳转预约页面
			goToPage(){
				console.log("跳转页面");
				wx.navigateTo({
					url: '../../pages/appointment/appointment',
				})
			},
			//点击打开分享面板
			onClick(event) {
				this.setData({ showShare: true });
			},
			//关闭分析面板
			onClose() {
				this.setData({ showShare: false });
			},
			//选择分享渠道
			onSelect(event) {
				Toast(event.detail.name);
				this.onClose();
			},
    }
})
