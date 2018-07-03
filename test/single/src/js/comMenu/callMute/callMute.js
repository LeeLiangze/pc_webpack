//此js包含了通话静音和取消静音的处理方法
define(['Util',"../../index/constants/mediaConstants",'../../log/transferOutLog'],function(Util,MediaConstants,transferOutLog){
	var index;
	var CTIID;
	var ip;
	var port;
	var proxyIP;
	var proxyPort;
	var isDefault;
	var url="";
	var lastCallId;//最后接入的语音会话
	var holdCallId;//被保持的语音会话id
	var muteCallId;//被静音的会话id	var failId;// 添加日志时,失败原因码
	var callId = {};//定义一个callid
	var resultMsg=""; //定义结果信息
	var failId;// 添加日志时,失败原因码
	var status_log;// 添加日志时,操作状态
	var callingInfo;//根据接触id 获取当前会话信息
	var serialNo;
	var operId;//操作ID
	var timer=null;
	var second=null;
	var flag=true;
	var objClass = function(indexModule){
		index = indexModule;
		CTIID = index.CTIInfo.CTIId;
		ip  =  index.CTIInfo.IP;
		port = index.CTIInfo.port;
		proxyIP = index.CTIInfo.ProxyIP;
		proxyPort = index.CTIInfo.ProxyPort;
		isDefault = index.CTIInfo.isDefault;
		if(isDefault=="1"){//此种情况走nginx代理
       	 	url = MediaConstants.CCACSURL + proxyIP + ":" + proxyPort + "/ccacs/"+CTIID+"/ws/agent/setmute";
        }else{                                 
       	 	url = MediaConstants.CCACSURL+ip+":"+port+"/ccacs/ws/agent/setmute"; //跨域直连
        }
    	lastCallId = index.ctiInit.AudioCallIds.getAudioLastCallId();
        holdCallId = index.ctiInit.AudioCallIds.getHoldCallId();
        muteCallId = index.ctiInit.AudioCallIds.getMuteCallId();
        serialNo=index.CallingInfoMap.getActiveSerialNo();
		callingInfo=index.CallingInfoMap.get(serialNo);
		maxCallMuteTime();
	} 
	//对外暴露两个方法
	objClass.prototype = {
		//开始静音
		startMute:function(){
			startMute();
		},
		//取消静音
		cancelMute:function(){
			cancelMute();
		}
	};
	//开始静音
	function startMute(){
		if(muteCallId){
			index.popAlert("当前语音已被静音");
			return;
		}
		operId = "007";
        //获取当前按钮是属于开始静音还是取消静音
        //var buttonStatus = options.comUI.getAppointedBtnText("startMuteBtn"); 
		/*if(!lastCallId){
			index.popAlert("当前无语音会话,无需开始静音");
			return;
		}*/
    	//当当前语音会话已被保持时，不能静音
    	if(lastCallId == holdCallId){
    		index.popAlert("当前语音会话已被保持，不能静音", "静音提示");
    		return false;
    	}
    	if(lastCallId){
    		callId = {"callId":lastCallId,"isMute":true};
    		if(index.queue.browserName==="IE"){  //注意index的
				//IE逻辑
        		$.ajax({
        			url : url,
    	        	type : 'post',  
    	        	data :  JSON.stringify(callId), 
    	        	contentType:"application/json; charset=utf-8",
    	        	crossDomain: true,
//    		        xhrFields: {
//    		        	withCredentials: true
//    		        },
    		        success : function(data){//成功的回调函数
    		        	failId = data.result;
    		    		if(data.result =="0"){
    		    			//设置被静音的会话id
    		    			index.ctiInit.AudioCallIds.setMuteCallId(lastCallId);
    		    			index.comMenu.comUI.startMuteUi();
    		    			index.popAlert("静音成功", "开始静音");
    		    			resultMsg = "静音成功";
    		    			status_log = "1";
    		    			logInfo.call(this);
    		    			if(flag){
    		    				startTime(second,function(e){
    		    					var muteCallId = index.ctiInit.AudioCallIds.getMuteCallId();
    		    					if(muteCallId != undefined && muteCallId != ""){
    		    						index.popAlert("静音超时", "静音超时提醒");
    		    					}
    		    				});
    		    			}
    		    		}else{
    		  			   	//错误信息
//    		    			resultMsg = index.ctiInit.ErrorcodeSearch.ErrorcodeSearch(data.result,"开始静音失败");
//    		    			index.popAlert(resultMsg, "开始静音");
    		    			var errorcodeResultMsg=index.ErrorcodeSearch.errorcodeSearch(data.result);
    			            index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);  
    		    			status_log = "0";
    		    			logInfo.call(this);
    	  			    }
    		    	},
    	    		error : function(XMLHttpRequest, textStatus, errorThrown){//失败的回调函数
    	    			var errorParams = {
    							"XMLHttpRequest":XMLHttpRequest,
    							"textStatus":textStatus,
    							"errorThrown":errorThrown
    					};
                		console.log(url,callId,errorParams,"网络异常，静音请求发送失败");
        				index.popAlert("开始静音请求发送失败");
    			    	resultMsg = "开始静音请求发送失败";
        			}
        		}); 
			}else{
				//其他浏览器逻辑
	    		$.ajax({
	    			url : url,
		        	type : 'post',  
		        	data :  JSON.stringify(callId), 
		        	contentType:"application/json; charset=utf-8",
		        	crossDomain: true,
			        xhrFields: {
			        	withCredentials: true
			        },
			        success : function(data){//成功的回调函数
			        	failId = data.result;
			    		if(data.result =="0"){
			    			//设置被静音的会话id
			    			index.ctiInit.AudioCallIds.setMuteCallId(lastCallId);
			    			index.comMenu.comUI.startMuteUi();
			    			index.popAlert("静音成功", "开始静音");
			    			resultMsg = "静音成功";
			    			status_log = "1";
			    			logInfo.call(this);
			    			if(flag){
			    				startTime(second,function(e){
			    					var muteCallId = index.ctiInit.AudioCallIds.getMuteCallId();
			    					if(muteCallId != undefined && muteCallId != ""){
			    						index.popAlert("静音超时", "静音超时提醒");
			    					}
			    				});
			    			}
			    		}else{
			  			   	//错误信息
//			    			resultMsg = index.ctiInit.ErrorcodeSearch.ErrorcodeSearch(data.result,"开始静音失败");
//			    			index.popAlert(resultMsg, "开始静音");
			    			var errorcodeResultMsg=index.ErrorcodeSearch.errorcodeSearch(data.result);
				            index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);  
			    			status_log = "0";
			    			logInfo.call(this);
		  			    }
			    	},
		    		error : function(XMLHttpRequest, textStatus, errorThrown){//失败的回调函数
		    			var errorParams = {
								"XMLHttpRequest":XMLHttpRequest,
								"textStatus":textStatus,
								"errorThrown":errorThrown
						};
	            		console.log(url,callId,errorParams,"网络异常，静音请求发送失败");
	    				index.popAlert("开始静音请求发送失败");
				    	resultMsg = "开始静音请求发送失败";
	    			}
	    		}); 
			}

    	}
	}
        //定义一个bol值为真代表开始静音,反之为取消静音
        //var bol = buttonStatus == options.comUI.jsonData.CallMute[0];
	function cancelMute(){
		if(!muteCallId){
			index.popAlert("当前没有静音的通话,无需取消静音");
			return;
		}
		operId = "008";
   		callId={"callId":muteCallId,"isMute":false};
   		if(index.queue.browserName==="IE"){  //注意index的
			//IE逻辑
   	   		$.ajax({
   				url : url,
   	        	type : 'post',  
   	        	data :  JSON.stringify(callId), 
   	        	contentType:"application/json; charset=utf-8",
   	        	crossDomain: true,
//   		        xhrFields: {
//   		        	withCredentials: true
//   		        },
   		        success : function(data){//成功的回调函数
   		        	failId = data.result;
   					if(data.result =="0"){
   						
   					 	//清除当前被静音的id
   						index.ctiInit.AudioCallIds.clearMuteCallId();
   						index.comMenu.comUI.cancelMuteUi();
   						index.popAlert("取消静音成功", "取消静音");
   						resultMsg = "取消静音成功";
   						status_log = "1";
   		    			logInfo.call(this);
   			    	}else{
//   			    		resultMsg = index.ctiInit.ErrorcodeSearch.ErrorcodeSearch(data.result,"取消静音失败");
//   						index.popAlert(resultMsg, "取消静音");
   						var errorcodeResultMsg=index.ErrorcodeSearch.errorcodeSearch(data.result);
			            index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);  
   						status_log = "0";
   		    			logInfo.call(this);
   			    	}
   				},
   				error:function(XMLHttpRequest, textStatus, errorThrown){//失败的回调函数
   					var errorParams = {
   							"XMLHttpRequest":XMLHttpRequest,
   							"textStatus":textStatus,
   							"errorThrown":errorThrown
   					};
   	        		console.log(url,callId,errorParams,"网络异常，取消静音请求发送失败");
   					index.popAlert("取消静音请求发送失败");
   			    	resultMsg = "取消静音请求发送失败";
   				}
   			});
		}else{
			//其他浏览器逻辑
	   		$.ajax({
				url : url,
	        	type : 'post',  
	        	data :  JSON.stringify(callId), 
	        	contentType:"application/json; charset=utf-8",
	        	crossDomain: true,
		        xhrFields: {
		        	withCredentials: true
		        },
		        success : function(data){//成功的回调函数
		        	failId = data.result;
					if(data.result =="0"){
					 	//清除当前被静音的id
						index.ctiInit.AudioCallIds.clearMuteCallId();
						index.comMenu.comUI.cancelMuteUi();
						index.popAlert("取消静音成功", "取消静音");
						resultMsg = "取消静音成功";
						status_log = "1";
		    			logInfo.call(this);
			    	}else{
//			    		resultMsg = index.ctiInit.ErrorcodeSearch.ErrorcodeSearch(data.result,"取消静音失败");
//						index.popAlert(resultMsg, "取消静音");
						var errorcodeResultMsg=index.ErrorcodeSearch.errorcodeSearch(data.result);
			            index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);  
						status_log = "0";
		    			logInfo.call(this);
			    	}
				},
				error:function(XMLHttpRequest, textStatus, errorThrown){//失败的回调函数
					var errorParams = {
							"XMLHttpRequest":XMLHttpRequest,
							"textStatus":textStatus,
							"errorThrown":errorThrown
					};
	        		console.log(url,callId,errorParams,"网络异常，取消静音请求发送失败");
					index.popAlert("取消静音请求发送失败");
			    	resultMsg = "取消静音请求发送失败";
				}
			});
		}

    }
    //添加日志  
	var  logInfo= function(){
		var contactId=callingInfo.contactId;//接触编号
		var operator=index.getUserInfo()['staffId'];//呼叫操作员工帐号
		var operBeginTime=index.utilJS.getCurrentTime();//呼叫操作开始时间
		var serviceTypeId=callingInfo.serviceTypeId;
		//var operEndTime=index.utilJS.getCurrentTime();//操作结束时间
		var callerNo=callingInfo.callerNo;//主叫号码
		var calledNo = callingInfo.calledNo;//接入码
		var subsNumber=callingInfo.subsNumber;//受理号码
		var tLog = new transferOutLog(); 
        tLog.setIsExt(true);
        tLog.setSerialNo(serialNo);
        tLog.setContactId(contactId);
        tLog.setOperator(operator);
        tLog.setOperBeginTime(operBeginTime);
        tLog.setOperId(operId);
        tLog.setServiceTypeId(serviceTypeId);
        //tLog.setOperEndTime(operEndTime);
        tLog.setStatus(status_log);
        tLog.setCallerNo(callerNo);
        tLog.setAccessCode(calledNo);
        tLog.setSubsNumber(subsNumber);
        tLog.setFailId(failId);
        tLog.setFinalStatus(status_log);
        tLog.logSavingForTransfer(tLog);
	};
	//休息超时倒计时
	var startTime=function(second,callback){
		if(timer){
			clearInterval(timer);
			};
		var seconds=second?second:0;
		timer = setInterval(function(){
			second?((seconds==0)?(clearInterval(timer),callback&&callback()):(seconds--)):seconds++;
        },1000);
		
	};
	//系统参数获取超时时间
	var maxCallMuteTime=function(){
		var data={
				"itemId":'133'
		};
		Util.ajax.postJson("front/sh/common!execute?uid=s007",data,function(json,status){
			if(status){
				if(json.bean.value!="-1"){
					second=json.bean.value;
				}else{
					flag=false;
				}
			}
		},true);
	}
	
	return objClass;
})
