/**
 * 轮询接口
 * 外部启动轮循调用方式： indexModule.header.communication.startPolling();
 * 外部停止轮循调用方式： indexModule.header.communication.stopPolling();
 * 
 */
define(['Util','../../../index/constants/mediaConstants',
        '../../CTIEvent/CTIEventsDeal',
        'jquery.tiny'], function(Util,MediaConstants,CTIEventsDeal) {
	var index;
	var EventsDeal;
	var pollUrl;
	var IS_CONTINUE = true;
	var SLEEP_TIME = 500;//每次轮循之前，睡500毫秒
	var TIME_OUT = 20000;
	var FORCE_LOGIN_OUT_BY_CTI = "150001";
	var SUCCESS_RESULT = "0";
	var pollLogFlag; //是否记录轮询日志 0：否 1：是
	var checkPollFlag; //是否拥有poll日志记录权限 true&false
	
	var Polling = function(indexModule) {
		Util.ajax.postJson("front/sh/common!execute?uid=s007",{"itemId":"101003002"},function(jsonData,status){
			if(status){
				pollLogFlag = jsonData.bean.value;
			}
		},true);
		Util.ajax.postJson("front/sh/media!execute?uid=checkPollFlag",{},function(jsonData,status){
			if(status){
				checkPollFlag = jsonData.bean.pollFlag;
			}
		},true);
		index = indexModule;
		var CTIId = index.CTIInfo.CTIId;
		var ip = index.CTIInfo.IP;
		var port = index.CTIInfo.port;
		var isDefault = index.CTIInfo.isDefault;
		var isDefault= index.CTIInfo.isDefault;//缺省业务标志值
		var proxyIP= index.CTIInfo.ProxyIP;//代理IP
        var proxyPort = index.CTIInfo.ProxyPort;//代理端口
		
		if(isDefault=="1"){//此种情况走nginx代理
			pollUrl= MediaConstants.CCACSURL+proxyIP+":"+proxyPort+"/ccacs/"+CTIId+"/ws/event/poll";
        }else{                                 
        	pollUrl= MediaConstants.CCACSURL+ip+":"+port+"/ccacs/ws/event/poll"; //跨域直连
        }
		
		EventsDeal = new CTIEventsDeal(indexModule);
		initTimeOut.call(this);
		subEvent();
		return returnObj.call(this);
	};
	
	

	var initTimeOut = function(){
		Util.ajax.postJson("front/sh/common!execute?uid=s007",{"itemId":"101003001"},function(json,status){
			if(status){
				TIME_OUT = json.bean.value;
			}
		},true);
	};
	
	/*
	 * 一般的事件，就直接使用响应的eventId作为该处的eventId。
	 * 只有  305 座席状态变更事件 需要再拼接 "-"+state ,形如  305-3 表示示忙事件
	 */
	var eventArray = [{
		"eventId" : "300",
		"eventName" : "answerRequestEvent"
	}, {
		"eventId" : "301",
		"eventName" : "releaseSuccessEvent"
	}, {
		"eventId" : "304",
		"eventName" : "startTalkingEvent"
	}, {
		"eventId" : "305",
		"eventName" : "recordResultEvent"
	}, {
		"eventId" : "306",
		"eventName" : "recordStopEvent"
	}, {
		"eventId" : "351-3",
		"eventName" : "agentStateChangeEvent3"
	}, {
		"eventId" : "351-4",
		"eventName" : "agentStateChangeEvent46"
	}, {
		"eventId" : "351-5",
		"eventName" : "agentStateChangeEvent5"
	}, {
		"eventId" : "351-7",
		"eventName" : "agentStateChangeEvent7"
	}, {
		"eventId" : "351-8",
		"eventName" : "agentStateChangeEvent8"
	}, {
		"eventId" : "351-9",
		"eventName" : "agentStateChangeEvent9"
	}, {
		"eventId" : "352",
		"eventName" : "forceOutEvent"
	}, {
		"eventId" : "353",
		"eventName" : "restTimeOutEvent"
	}, {
		"eventId" : "355",
		"eventName" : "receiveNoteEvent"
	}, {
		"eventId" : "402",
		"eventName" : "agentOutInInsertListenEvent"
	}, {
		"eventId" : "303",
		"eventName" : "transOutResultEvent"
	}, {
		"eventId" : "451",
		"eventName" : "messageData"
	},{
		"eventId" : "307",
		"eventName" : "internalHelpResultEvent"
	},{
		"eventId" : "302",
		"eventName" : "callOutResultEvent"
	},{
		"eventId" : "401",
		"eventName" : "playEndEvent"
	},{
		"eventId" : "308",
		"eventName" : "returnFromIvrEvent"
	}
	];

	/*
	 * 一般的事件，就直接使用响应的eventId作为该处的eventId。
	 * 只有  305 座席状态变更事件 需要再拼接 "-"+state ,形如  305-3 表示示忙事件
	 */
	var methodarray = [{
		"eventId" : "300",
		"methodName" : "EventsDeal.answerRequestEvent"
	}, {
		"eventId" : "301",
		"methodName" : "EventsDeal.releaseSuccessEvent"
	}, {
		"eventId" : "304",
		"methodName" : "EventsDeal.startTalkingEvent"
	}, {
		"eventId" : "305",
		"methodName" : "EventsDeal.recordResultEvent"
	}, {
		"eventId" : "306",
		"methodName" : "EventsDeal.recordStopEvent"
	}, {
		"eventId" : "351-3",
		"methodName" : "EventsDeal.agentStateChangeEvent3"
	}, {
		"eventId" : "351-4",
		"methodName" : "EventsDeal.agentStateChangeEvent46"
	}, {
		"eventId" : "351-5",
		"methodName" : "EventsDeal.agentStateChangeEvent5"
	}, {
		"eventId" : "351-7",
		"methodName" : "EventsDeal.agentStateChangeEvent7"
	}, {
		"eventId" : "351-8",
		"methodName" : "EventsDeal.agentStateChangeEvent8"
	}, {
		"eventId" : "351-9",
		"methodName" : "EventsDeal.agentStateChangeEvent9"
	}, {
		"eventId" : "352",
		"methodName" : "EventsDeal.forceOutEvent"
	}, {
		"eventId" : "353",
		"methodName" : "EventsDeal.restTimeOutEvent"
	}, {
		"eventId" : "355",
		"methodName" : "EventsDeal.receiveNoteEvent"
	}, {
		"eventId" : "402",
		"methodName" : "EventsDeal.agentOutInInsertListenEvent"
	}, {
		"eventId" : "303",
		"methodName" : "EventsDeal.transOutResultEvent"
	}, {
		"eventId" : "451",
		"methodName" : "EventsDeal.messageData"
	},{
		"eventId" : "307",
		"methodName" : "EventsDeal.internalHelpResultEvent"
	},{
		"eventId" : "302",
		"methodName" : "EventsDeal.callOutResultEvent"
	},{
		"eventId" : "401",
		"methodName" : "EventsDeal.playEndEvent"
	},{
		"eventId" : "308",
		"methodName" : "EventsDeal.returnFromIvrEvent"
	}
	];

	var getEvent = function(eventId) {
		for (var i = 0; i < eventArray.length; i++) {
			if (eventId == eventArray[i].eventId) {
				return eventArray[i].eventName;
			}
		}
	};
	//订阅者
	var subEvent = function() {
		for (var i = 0; i < eventArray.length; i++) {
			$.subscribe("'" + eventArray[i].eventName + "'",
					eval(methodarray[i].methodName));
		}
	};
	//发布者
	var pubEvent = function(eventName, data) {
		$.publish(eventName, data);
	};

	var returnObj=function(){
		return {
			startPolling:function(){
				IS_CONTINUE = true;
				poll();
			},
			stopPolling:function(){
				IS_CONTINUE = false;
			}
		};
	};

	var poll = function() {
			if (IS_CONTINUE) {
				 if(index.queue.browserName==="IE"){
					 $.ajax({
						 url:pollUrl,  //要请求的url地址
						    timeout:TIME_OUT,  //超时时间，单位（毫秒）
						    data:JSON.stringify({}), //要传递给服务器的参数
						    contentType:"application/json; charset=utf-8",
						    dataType:"json",
						    crossDomain: true,
//				            xhrFields: {
//				                  withCredentials: true
//				                   },
						    type : 'post',
						    success:function(json,textStatus,jqXHR){    //url调用成功时的回调函数
						    	
						    	/**
						    	 * peishuxian
						    	 * poll日志记录变更
						    	 */
						    	if(json.result == SUCCESS_RESULT){
						    		if("1" == pollLogFlag && true == checkPollFlag){
//						    			index.ctiInit.recordCallCTILog(pollUrl,{},json,"调用poll接口成功");
						    		}
						    	}else{
//						    		index.ctiInit.recordCallCTILog(pollUrl,{},json,"调用poll接口失败");
						    	}
						    	poll();
						    	if(json && json.result){
						    		
						    		var result = json.result;
						    		if(result == FORCE_LOGIN_OUT_BY_CTI){
						    			dealForceLoginOutByCti(json.result); //弹出已被签出提示框，将数据入库，停止轮循。
						    		}
						    	}
						    	
						    	if(json && json.events && json.events.length){
						    		var events = json.events;
						    		for (var i = 0; i < events.length; i++) {
						    			var event = events[i];
						    			/*try{*/
						    				if (event.eventId == "351") {
						    					var state = event.agentState;
						    					var eventIdForQuery = event.eventId + "-"
						    					+ state
						    					pubEvent("'" + getEvent(eventIdForQuery)+ "'", event);
						    				} else {
						    					pubEvent("'" + getEvent(event.eventId)+ "'", event);
						    				}
	/*					    			}catch(e){
						    			}*/
						    		}
						    	}
						    },
						    error:function(jqXHR,textStatus,errorThrown ){  //url调用失败时的回调函数
						    	//回调失败的原因有很多，其中包含超时的错误。
						    	poll();
						    	var errorParams = {
	        	            			"XMLHttpRequest":jqXHR,
	        	            			"textStatus":textStatus,
	        	            			"errorThrown":errorThrown
	        	            	};
//						    	index.ctiInit.recordCallCTILog(pollUrl,{},errorParams,"网络异常，调用poll接口失败");
						    }
						    					    
					 });
				}else{
					var options = {
						    url:pollUrl,  //要请求的url地址
						    timeout:TIME_OUT,  //超时时间，单位（毫秒）
						    data:JSON.stringify({}), //要传递给服务器的参数
						    contentType:"application/json; charset=utf-8",
						    dataType:"json",
						    crossDomain: true,
				            xhrFields: {
				                  withCredentials: true
				                   },
						    type : 'post',
						    success:function(json,textStatus,jqXHR){
						    	//url调用成功时的回调函数
						    	/**
						    	 * peishuxian
						    	 * poll日志记录变更
						    	 */
						    	if(json.result == SUCCESS_RESULT){
						    		if("1" == pollLogFlag && true == checkPollFlag){
//						    			index.ctiInit.recordCallCTILog(pollUrl,{},json,"调用poll接口成功");
						    		}
						    	}else{
//						    		index.ctiInit.recordCallCTILog(pollUrl,{},json,"调用poll接口失败");
						    	}
						    	poll();
						    	if(json && json.result){
						    		
						    		var result = json.result;
						    		if(result == FORCE_LOGIN_OUT_BY_CTI){
						    			dealForceLoginOutByCti(json.result); //弹出已被签出提示框，将数据入库，停止轮循。
						    		}
						    	}
						    	
						    	if(json && json.events && json.events.length){
						    		var events = json.events;
						    		for (var i = 0; i < events.length; i++) {
						    			var event = events[i];
						    			/*try{*/
						    				if (event.eventId == "351") {
						    					var state = event.agentState;
						    					var eventIdForQuery = event.eventId + "-"
						    					+ state
						    					pubEvent("'" + getEvent(eventIdForQuery)+ "'", event);
						    				} else {
						    					pubEvent("'" + getEvent(event.eventId)+ "'", event);
						    				}
	/*					    			}catch(e){
						    			}*/
						    		}
						    	}
						    },
						    error:function(jqXHR,textStatus,errorThrown ){  //url调用失败时的回调函数
						    	//回调失败的原因有很多，其中包含超时的错误。
						    	poll();
						    	var errorParams = {
	        	            			"XMLHttpRequest":jqXHR,
	        	            			"textStatus":textStatus,
	        	            			"errorThrown":errorThrown
	        	            	};
//						    	index.ctiInit.recordCallCTILog(pollUrl,{},errorParams,"网络异常，调用poll接口失败");
						    }
					};
					Util.ajax.ajax(options);
				}

			}
	};
	
	var dealForceLoginOutByCti = function(result){
		Util.dialog.openDiv({
			id:"pollTips",
			el:"polling",
            width:200,
            height:50,
            title:"座席已签出",
            content:"座席已签出，请重新登录系统"
		});
		IS_CONTINUE = false;
		index.ctiInit.signOut();
		//把签出置灰
		index.comMenu.comUI.setAppointedBtnEnabled("checkBtn",false);
		index.comMenu.comUI.setAppointedIcont("checkBtn","#ccc");
		index.comMenu.comUI.setAppointedInnerText("checkBtn","未签入");
		$(".box-icon-qianchuzhuanhuan-copy span").css("color","#ccc");
	};
	
//	var addCTIAPILog = function(params){
//		Util.ajax.postJson("front/sh/media!execute?uid=addCTIAPILog",params, function(json, status) {
//			if(status){
//				
//			}
//		});
//	};
	
	return Polling;
});