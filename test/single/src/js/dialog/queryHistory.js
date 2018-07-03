/**
 *created by lishouming 2016/12/23 
 *
 */
define(['Util',
	'../queue/customItem',
	'../queue/creatHistory',
	'../../tpl/queue/QueryHistory.tpl',
	'../../assets/css/queue/queryHistory.css'
], function(Util, CustomItem, CreatHistory, QueryHistoryTpl) {
	var _index, _options;
	//确保对应的this不会在$.each内发生改变,self存储对应的this指向
	var lets = null;
	//设置数组存放微博渠道接触的下标
	var weiboItem = [];
	//设置数组存放其他渠道接触的下标
	var otherItems = [];
	//定义变量储存接触列表信息
	var customers = {};
	//定义变量存储点击接触的历史消息
	var creatHistory = {};
	//设置变量存储对应的接触列表信息
	var HistoryInfo;
	var HistoryInfos = null;
	//查询接触，可设置系统参数配置
	var _start = 0; //开始的接触
	var _limit = 0; //能够查询的接触ID条数
	//查询明细(一页的页数，一页可存储的消息数量)
	var _pageNumber, _pageSize;
	//设置变量存储会话开始时间
	var _contactStartTime = null;
	var index = null;
	var $el;
	var queryHistoryClass = function(indexModule, options) {
		$el = $(QueryHistoryTpl);
		this.content = $el;
		_index = indexModule;
		_options = options;
//		$(".ui-dialog-body").css('padding', 0);
		this.eventInit.call(this);
		this.queryHistory();
	};
	$.extend(queryHistoryClass.prototype,{
		//初始化事件
		eventInit: function() {
			lets = this;
			$el.on("click", ".searchMore", this.MessageClick);
			//			this.getItems.call(this);
			$el.on("click", ".customer", this.itemClick);
		},
		//获取历史接触的信息与ID
		queryHistory: function() {
					//存储会话队列区信息
			//对应的接口:"front/sh/common!execute?uid=s007",{"itemId":"104001001"} data/systemParam.json'
			Util.ajax.postJson("front/sh/common!execute?uid=s007",{"itemId":"104001001"}, function(value, isok) {
				if(isok) {
				  //获取队列区contactIdList
					var list = _index.queue.list;
//					考虑到对应的离线状态但还在客户队列区的情况
					var leaveNum = 0;
					var leaveInfo = $(".queueList .msgInfo .conversation .time");
					for(var i = 0;i<leaveInfo.length;i++){
						if($(leaveInfo[i]).html() == "[离线]"){
							leaveNum++;
						}
					}
					//获取参数中的限制数据（能够查询接触的条数）
			       var num1 = 0;
			       $.each(list,function(i,data){
			       	num1++;
			       	return num1;
			       })
					//获取对应的系统设置参数由队列区的人数决定
					_limit = parseInt(num1-leaveNum) + parseInt(5);
					//设置对应Json数据用于查看接触ID
					var data = {
						"staffId": _index.getUserInfo().staffId,
						"start": _start,
						"limit": _limit
					};
					//获取接触历史的类型Id
					var queryTouchType = {
						queryTouchType : _index.CTIInfo.queryTouchType
					};
					$.extend(data, queryTouchType);
					var contactIdList = "";
					$.each(list,$.proxy(function(i,data){
				          contactIdList = contactIdList+","+i;
						},this));
				    data.contactIdList = contactIdList;
				}
				//获得当前会话队列取得信息往上查看对应上5个的信息（获取应传输data数据进行）
				lets.getItems(data);
			})
		},
		//获取当前接触ID的信息
		getItems: function(data) {
			//接口详情:front/sh/common!execute?uid=touch007 data/touchId.json
			Util.ajax.postJson('front/sh/common!execute?uid=touch011',data,function(json, isok) {
				if(isok) {
					//数组倒置并截取之前的五个元素
					HistoryInfo = json.beans;
					var list = _index.queue.list;
					var listArr = [];
					for(var i in list){
						if (list.hasOwnProperty(i)){
							listArr.push(i);
						}
					}
					//考虑到对应的离线状态但还在客户队列区的情况
					var leaveInfo = $(".queueList .msgInfo .conversation .time");
					for(var i = 0;i<leaveInfo.length;i++){
						if($(leaveInfo[i]).html() == "[离线]"){
//							获取对应的队列区离线会话的位置并在对应的数组中移除掉
							var leaveListNum = listArr.length - i - 1;
							listArr.splice(leaveListNum,1);
						}
					}
					  //获取当前的会话列表会话的流水号
					for(var j = 0;j<listArr.length;j++){
				       for(var i =0;i<HistoryInfo.length;i++){
				    	   if(HistoryInfo[i].serialNo == listArr[j]){
				    			   HistoryInfo.splice(i,1);
				    		   }
				    	   }
				       }
					HistoryInfos  = HistoryInfo.slice(0,5);
					if(HistoryInfos.length == 0){
						return;
					}else{
					$.each(HistoryInfos, function(index, value) {
						//将对应的每个历史记录id的信息储存
						var param = {
							contactId: value.contactId,
							channelId: value.channelId,
							mediaId: value.mediaTypeId,
							callerNo: value.callerNo,
							toUserName: value.toUserName,
							toUserId: value.toUserId,
							callType: value.callType,
							serialNo: value.serialNo,
							contactStartTime: value.contactStartTime,
							calledNo: value.calledNo
						};
						//创建接触客户信息
						customers = new CustomItem(_index);
						customers.createCustomer(param);
//						$(".customerList").append(customers);
						//对于对应的新浪渠道进行判断显示发私信按钮
//						lets.adjustweibo(index, value);
					})
					
					//将对应的限制内条数的消息展现在页面上
			           $(".queryHistory .queryRight .historyContent").append("<div class='chat-show' style='height:530px'></div>");
					//设置默认第一个历史消息展示
			          creatHistory = new CreatHistory(_index,HistoryInfos[0]);
			
				}
			}
			})
		},
		//设置对应客户信息的点击事件
		itemClick: function() {
//			判断是否为再次点击(不需要重新创建)
			$($el).find(".loading").hide();
			$($el).find(".searchMore").show();
			index = $(this).index();
			if($(this).hasClass('clicked')){
//				lets.messageDetails(_index,HistoryInfos);
			}else{
				lets.messageDetails(_index,HistoryInfos);
			}
			$($el).find(".customer").removeClass("clicked");
			$(this).toggleClass("clicked");
			
		},
		// 根据点击事件所点击的获取当前信息并渲染历史信息
		messageDetails:function(_index,HistoryInfo){
			$($el).find(".chat-show").hide();
			//调用对应的创建历史详细消息的方法
//           var index = $(this).index();
           var serialNo = HistoryInfo[index].serialNo;
           var chatId = "history"+serialNo;
           var result = lets.adjustHave(serialNo);
           if(result == false){
           	//如果不存在对应ID添加内容
			//将对应的限制内条数的消息展现在页面上
           $(".queryHistory .queryRight .historyContent").append("<div class='chat-show' style='height:530px'></div>");
           creatHistory = new CreatHistory(_index,HistoryInfo[index]);
           }else{
           	//如果存在对应的ID则将其渲染在页面无需进行AJAX请求
           	$("#"+chatId).show();
           }
		},
		//判断对应的历史消息是否获取过并渲染到页面上
		adjustHave:function(serialNo){
			//判断是否含有对应唯一ID，若存在就不再生成标签
			var haveHistory = $("#history"+serialNo).find(".historySerial").html();
			if(haveHistory){
				return true;
			}else{
				return false;
			}
		},
		// 对应的客户是否为呼入且微博，显示发送私信按钮(获取对应微博的下标)
//		adjustweibo: function(index, value) {
//			if(value.mediaTypeId == "MICROBLOGGING_TYPE" && value.callType != 1) {
//				//将符合的下标储存在数组中
//				weiboItem.push(index);
//				lets.weiboItemClick(weiboItem);
//				//微博按钮发送私信
//				$(".queryRight .sendImg").on("click", function() {
//					//先判断当前点击的微博按钮所在用户的下标（通过ClassName找到）
//					var index = $el.find(".clicked").index();
//					//			       lets.sendWeiboMessage(HistoryInfo[index]);
//				})
//			} else {
//				otherItems.push(index);
//				lets.otherItemClick(otherItems);
//			}
//		},
		//设置微博用户显示发私信按钮
//		weiboItemClick: function(weiboItem) {
//			$.each(weiboItem, function(i, value) {
//				$(".customer").eq(value).on("click", function() {
//					$(".sendImg").show();
//				})
//			})
//		},
		//设置其他渠道用户点击隐藏按钮
//		otherItemClick: function(otherItems) {
//			$.each(otherItems, function(i, value) {
//				$(".customer").eq(value).on("click", function() {
//					$(".sendImg").hide();
//				})
//			})
//		},
		//设置微博按钮的点击事件(需要获取对应微博用户的信息)
//		sendWeiboMessage: function(data) {
//			//判断微博用户的信息（昵称）
//			var interntIdentityNow = customers.adjustInternet(data.callerNo, data.channelId);
//			if(interntIdentityNow) {
//				//设置变量存储账户来源ID
//				var fromAccountId = interntIdentityNow.fromAccountId;
//				//通过AJAX请求查询到对应的用户昵称和服务类型ID
//				Util.ajax.postJson('front/sh/media!execute?uid=accountName001', {
//					"fromAccountId": fromAccountId
//				}, $.proxy(function(json, status) {
//					if(status) {
//						var item = json.beans[0];
//						var itemData = _internetIdentityNow;
//						itemData.fromAccountName = item.accountName;
//						itemData.serviceTypeId = _index.data.beans[0].serviceTypeId;
//					}
//				}, this));
//			} else {
//				var itemData = {
//					fromAccountId: data.toUserId,
//					accountId: data.callerNo,
//					mediaTypeId: data.mediaID,
//					fromAccountName: data.toUserName,
//					serviceTypeId: _index.data.beans[0].serviceTypeId,
//					screenName: data.callerNo,
//					channelId: data.channelId
//				}
//			};
//			//弹出对应发送私信消息框
//			_index.showDialog({
//				title: '发送私信', //弹出框标题
//				url: 'js/communication/huawei/media/activSendMsg/sendMsgWindow', //要加载的微博发送模块
//				param: itemData, //要传输的参数
//				width: 600,
//				height: 350,
//			})
//		},
		//设置查看更多的点击事件
		MessageClick: function() {
			$(".chat-more-msg a").hide();
			var loadIng = '<div class="loading">' + '<img src="src/assets/img/queue/loading.gif" class="loadingImg"/>' + '<span class="loadingTip">加载中&hellip;</span>' + '</div>';
			$(".chat-more-msg").html(loadIng);
		}
	})
	return queryHistoryClass;
})