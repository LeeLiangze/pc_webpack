/*
 *created by lishouming 2017/1/4
 *
 */
define(['Util',"../index/constants/mediaConstants",
    '../content/chatArea/chatArea'
],function(Util,MediaConstants,ChatArea){
	var _index = null,_options = null;
	//设置变量存储客户CTI数据
	var customerInfo = null;
	//设置变量存储客户历史消息框
	var chatArea = {};
	//定义变量储存流水号作为ID名的唯一识别码
	var  serialNo = null;
	//设置对应的会话开启时间,页码数量,页面大小
	var _contactStartTime = null , _pageNumber = null , _pageSize = null;
	var seks;
	var  creatHistoryClass = function(indexModule,options){
		 customerInfo = options;
		 _index = indexModule;
		 _contactStartTime = customerInfo.contactStartTime;
		 _pageNumber = MediaConstants.HISTORY_PAGENUM;
		 _pageSize = MediaConstants.HISTORY_TPAGESIZE;
		this.eventInit(customerInfo);
		//创建消息框内容
		chatArea = new ChatArea(_index);
	};
	$.extend(creatHistoryClass.prototype,{
		eventInit:function(customerInfo){
			seks = this;
			this.queryTouch(customerInfo);
		},
		//创建条数限制内的历史消息
		queryTouch:function(customerInfo){
			serialNo = customerInfo.serialNo;
			var data = {
				//获取当前历史消息的流水号
				"serialNo":serialNo
			}
			//发起AJAX请求获取当前缓存的历史消息详情
			//接口内容：front/sh/common!execute?uid=touch008 data/messageDetails.json
			Util.ajax.postJson("front/sh/common!execute?uid=touch012",data,function(json,isok){
				if(isok){
					var datas = json.beans;
					if(datas.length > 0){
						datas = datas.reverse();
						var mediaId;
						 //创建函数生成对应的ID序列号页面(以此达到缓存页面的效果避免每次点击生成AJAX请求)
						//设置对应的Id
//						var chatShows = $(".historyContent").find(".chat-show");
//						var chatLength = chatShows.length;
//						for(var  i = 0;i<chatLength;i++){
//							if(i == chatLength-1){
//								chatShows[i].id = "history"+serialNo;
//							}
//						}
				        $(".historyContent").find(".chat-show").last().attr("id","history"+serialNo);
						$.each(datas,function(index,data){
							if(data.mediaId){
								mediaId = data.mediaId;
							}
							if(data.mediaTypeId){
								mediaId = data.mediaTypeId;
							}
//							进行判断对应消息类型Id以及数据的转换
							if(data.msgType != '-999'){
								data.msgId = data.id;
		                        data.url = data.requestAffix;
		                        data.channelID = data.channelId;
		                        var messageData = {
		        				        originalCreateTime: data.originalCreateTime,
		                                content: data.content,
		                                mediaTypeId: mediaId,
		                                msgType: data.msgType,
		                                senderFlag: data.senderFlag,
		                                serialNo: data.serialNo,
		                                channelID: data.channelID,
		                                nickName: data.nickName,
		                                msgId:data.msgId,
		                                url:data.url,
		                                callerNo:customerInfo.callerNo,
		                                duration:data.duration,
		                                audioTimeLength:data.audioTimeLength,
		                                voiceFlag:false,
		                                cancelFlag:data.cancelFlag
		                    				}
		        					//在点击接触列表的信息显示对应的历史消息内容
		                        	//设置对应标签储存所在历史页面的流水号和历史页码
		                            $("#history"+serialNo).append(chatArea.content);
		                            $("#history"+serialNo).append("<i class = 'historySerial' style='display:none'>"+serialNo+"</i><i class ='pageNum' style='display:none'>0</i>");
		        					chatArea.createChatArea(messageData,$("#history"+serialNo));

							}
						if(datas && datas.length >0){
							//上一个数组元素的会话开始时间
							var datab = datas[datas.length -1];
							//如果之前存在对应的会话时间 将对应的数据作为查看更多记录时的会话时间，如果不存在会话时间，则变为接触客户的登录时间开始算起。
							_contactStartTime = datab.originalCreateTime?datab.originalCreateTime : datab.logTime;

						}
						})
						//将对应的点击更多历史消息的方法绑定到对应的标签
							$("#history"+serialNo).on("click",".chat-more-msg",function(){
							seks.queryMoreTouch(customerInfo);
							})
						}
					}
			})
		},
		//设置查看更多的历史记录
		queryMoreTouch:function(customerInfo){
			var serialNo = customerInfo.serialNo;
			_pageNumber = $("#history"+serialNo).find(".pageNum").text();
			//获取对应的接触数据
			var data = {
				"callerNo":customerInfo.callerNo,
				"start":_pageNumber,
				"limit":_pageSize,
				 "serialNo": customerInfo.serialNo
			};
			//进行获取对应的更多历史消息
			 Util.ajax.postJson('front/sh/common!execute?uid=queryMoreInfo',data,$.proxy(function(json, status){
                if (status && json.bean.total > parseInt(_pageNumber)) {
                	var dataTemp = json.beans;
                	for(var i =0;i<dataTemp.length;i++){
                		dataTemp[i].voiceFlag = false;
                	}
                    chatArea.getMoreMsg(dataTemp,$("#history"+serialNo));
                     _pageNumber= parseInt(_pageNumber)+ parseInt(_pageSize);
                     $($("#history"+serialNo).find(".pageNum")).remove();
                     $("#history"+serialNo).append("<i class ='pageNum' style='display:none'>"+_pageNumber+"</i>");
                }else{
                $("#history"+serialNo).find('.chat-more-msg a').css("color", "grey");
                $("#history"+serialNo).find('.chat-more-msg a').text("没有更多消息");
                $("#history"+serialNo).find('.chat-more-msg').removeClass('chat-more-msg');
                }
            }, this));

		}
	})
	return creatHistoryClass;
})
