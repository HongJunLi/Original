var config = require('../../config.js');
var util = require('../../utils/util.js');
var orderUtils = require('../../utils/order.js');
var appInstance = getApp()

Page({
  data: {
    noOrder: false,
    tabs: [
			{title: '全部', content: ''},
      {title: '待付款', content: '内容一'},
      {title: '已完成', content: '内容二'},
    ],
		orderList: [],
		pageMeta: {},
		loadmore: false
  },
	onLoad () {
		this.getOrderList(0, 1)
	},
  handleTabChange (e) {
    console.log(e)
  },
  onClick: function(e) {
    console.log(`ComponentId:${e.detail.componentId},you selected:${e.detail.key}`);
  },
	getOrderList: function (type, page) {
		var that = this
		orderUtils.getOrderList({
			'type': type,
			'page': page,
			'success': function (res) {
				console.log('订单列表获取成功回调')
				console.log(res)
				let list = that.data.orderList
				for (var i=0; i<res.items.length; i++) {
					list.push(res.items[i])
				}

				that.setData({
					orderList: list,
					pageMeta: res.meta
				}, function () {
					console.log('now orderlist is: ')
					console.log(that.data.orderList)
				})

				if (res.meta.currentPage < res.meta.pageCount) {
					that.setData ({
						loadmore: true
					})
				} else {
					that.setData ({
						loadmore: false
					})
				}
			},
			'fail': function (error) {
				console.log('订单列表失败回调')
			}
		})
	},
	btnClick: function (e) {
		console.log('hello world')
		if (this.data.loadmore === true) {
			let page = this.data.pageMeta.currentPage + 1
			let type = 0
			console.log('加载分页数据 页码: ' + page)
			this.getOrderList(type, page)
		} else {
			console.log('没有下一页的数据了')
		}
	}
})
