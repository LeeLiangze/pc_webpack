//此js包含了通话保持和取消保持的处理方法
define([ 'Util', "../../index/constants/mediaConstants", '../../log/transferOutLog'], function(Util,MediaConstants, transferOutLog) {
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
	var muteCallId;//被静音的会话id
	var callId = {};//定义一个callid
	var resultMsg=""; //定义结果信息
	var failId;// 添加日志时,失败原因码
	var callingInfo;// 根据接触id 获取当前会话信息
	var serialNo;
	var operId;// 操作ID
	var status_log;// 添加日志时,操作状态
	var objClass = function(indexModule) {
		index = indexModule;
		CTIID = index.CTIInfo.CTIId;
		ip = index.CTIInfo.IP;
		port = index.CTIInfo.port;
		proxyIP = index.CTIInfo.ProxyIP;
		proxyPort = index.CTIInfo.ProxyPort;
		isDefault = index.CTIInfo.isDefault;
		lastCallId = index.ctiInit.AudioCallIds.getAudioLastCallId();
		holdCallId = index.ctiInit.AudioCallIds.getHoldCallId();
		muteCallId = index.ctiInit.AudioCallIds.getMuteCallId();
		serialNo=index.CallingInfoMap.getActiveSerialNo();
		callingInfo=index.CallingInfoMap.get(serialNo);
	}
	//对外暴露两个方法
	objClass.prototype = {
		// 通话保持
		callHold : function() {
			callHold();
		},
		// 取消保持
		cancelHold : function() {
			cancelHold();
		}
	};
	// 通话保持
	function callHold() {
		operId = "005";
		if (lastCallId && !holdCallId) {
			if (muteCallId == lastCallId) {
				index.popAlert("当前通话已被静音,请先取消静音");
				return;
			} else {
				if (isDefault == "1") {// 此种情况走nginx代理
					url = MediaConstants.CCACSURL + proxyIP + ":" + proxyPort + "/ccacs/" + CTIID + "/ws/call/hold";
				} else {
					url = MediaConstants.CCACSURL + ip + ":" + port + "/ccacs/ws/call/hold"; // 跨域直连
				}
				callId = {"callId" : lastCallId};
				if(index.queue.browserName==="IE"){
					$.ajax({
						url : url,
						type : 'post',
						data : JSON.stringify(callId),
						contentType : "application/json; charset=utf-8",
						crossDomain : true,
						success : function(json) {
							failId = json.result;
							if (json.result == "0") {
								index.ctiInit.AudioCallIds.setHoldCallId(lastCallId);
								index.comMenu.comUI.callHoldUi();
								index.comMenu.comUI.setAppointedBtnEnabled("callOutBtn",true);
								index.popAlert("通话保持成功", "通话保持");
								resultMsg = "通话保持成功";
								status_log = "1";
				    			logInfo.call(this);
							} else {
//								resultMsg = index.ctiInit.ErrorcodeSearch.ErrorcodeSearch(json.result,"通话保持失败,CTI错误码：" + json.result);
//								index.popAlert(resultMsg, "错误提示");
								var errorcodeResultMsg=index.ErrorcodeSearch.errorcodeSearch(json.result);
					            index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);  
								status_log = "0";
				    			logInfo.call(this);
							}
						},
						error : function(XMLHttpRequest, textStatus, errorThrown) {
							index.popAlert("通话保持请求发送失败");
							resultMsg = "通话保持请求发送失败";
							var errorParams = {
								"XMLHttpRequest" : XMLHttpRequest,
								"textStatus" : textStatus,
								"errorThrown" : errorThrown
							};
							console.log(url, callId, errorParams,"网络异常，通话保持请求发送失败");
						}
					});
				}else{
					$.ajax({
						url : url,
						type : 'post',
						data : JSON.stringify(callId),
						contentType : "application/json; charset=utf-8",
						crossDomain : true,
						xhrFields : {
							withCredentials : true
						},
						success : function(json) {
							failId = json.result;
							if (json.result == "0") {
								index.ctiInit.AudioCallIds.setHoldCallId(lastCallId);
								index.comMenu.comUI.callHoldUi();
								index.comMenu.comUI.setAppointedBtnEnabled("callOutBtn",true);
								index.popAlert("通话保持成功", "通话保持");
								resultMsg = "通话保持成功";
								status_log = "1";
				    			logInfo.call(this);
							} else {
//								resultMsg = index.ctiInit.ErrorcodeSearch.ErrorcodeSearch(json.result,"通话保持失败,CTI错误码：" + json.result);
//								index.popAlert(resultMsg, "错误提示");
								var errorcodeResultMsg=index.ErrorcodeSearch.errorcodeSearch(json.result);
					            index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);  
								status_log = "0";
				    			logInfo.call(this);
							}
						},
						error : function(XMLHttpRequest, textStatus, errorThrown) {
							index.popAlert("通话保持请求发送失败");
							resultMsg = "通话保持请求发送失败";
							var errorParams = {
								"XMLHttpRequest" : XMLHttpRequest,
								"textStatus" : textStatus,
								"errorThrown" : errorThrown
							};
							console.log(url, callId, errorParams,"网络异常，通话保持请求发送失败");
						}
					});
				}
				
			}
		} else if (lastCallId && holdCallId) {
			index.popAlert("当前已经有保持的呼叫了，不能再进行保持", "通话保持");
		}
	}
	// 取消保持
	function cancelHold() {
		if(!holdCallId){
			index.popAlert("当前没有通话保持的通话,无需恢复通话");
			return;
		}
		operId = "006";
		if(isDefault=="1"){//此种情况走nginx代理
	        url = MediaConstants.CCACSURL + proxyIP + ":" + proxyPort + "/ccacs/"+CTIID+"/ws/call/unhold";
	    }else{
	        url = MediaConstants.CCACSURL+ip+":"+port+"/ccacs/ws/call/unhold"; //跨域直连
	    }
		callId = {"callId" : holdCallId};
		if(index.queue.browserName==="IE"){
			$.ajax({
				url : url,
				type : 'post',
				data : JSON.stringify(callId),
				contentType : "application/json; charset=utf-8",
				success : function(json) {
					failId = json.result;
					if (json.result == "0") {
						index.popAlert("恢复通话成功", "恢复通话");
						resultMsg = "恢复通话成功";
						index.comMenu.comUI.resumeCallUi();
						status_log = "1";
		    			logInfo.call(this);
					} else {
//						resultMsg = index.ctiInit.ErrorcodeSearch.ErrorcodeSearch(json.result, "恢复通话失败,CTI错误码：" + json.result);
//						index.popAlert(resultMsg, "错误提示");
						var errorcodeResultMsg=index.ErrorcodeSearch.errorcodeSearch(json.result);
			            index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);  
						status_log = "0";
		    			logInfo.call(this);
					}
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					index.popAlert("恢复通话请求发送失败");
					resultMsg = "恢复通话请求发送失败";
					var errorParams = {
						"XMLHttpRequest" : XMLHttpRequest,
						"textStatus" : textStatus,
						"errorThrown" : errorThrown
					};
					console.log(url, callId, errorParams, "网络异常，恢复通话请求发送失败");
				}
			});
		}else{
			$.ajax({
				url : url,
				type : 'post',
				data : JSON.stringify(callId),
				contentType : "application/json; charset=utf-8",
				crossDomain : true,
				xhrFields : {
					withCredentials : true
				},
				success : function(json) {
					failId = json.result;
					if (json.result == "0") {
						index.popAlert("恢复通话成功", "恢复通话");
						resultMsg = "恢复通话成功";
						index.comMenu.comUI.resumeCallUi();
						status_log = "1";
		    			logInfo.call(this);
					} else {
//						resultMsg = index.ctiInit.ErrorcodeSearch.ErrorcodeSearch(json.result, "恢复通话失败,CTI错误码：" + json.result);
//						index.popAlert(resultMsg, "错误提示");
						var errorcodeResultMsg=index.ErrorcodeSearch.errorcodeSearch(json.result);
			            index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);  
						status_log = "0";
		    			logInfo.call(this);
					}
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					index.popAlert("恢复通话请求发送失败");
					resultMsg = "恢复通话请求发送失败";
					var errorParams = {
						"XMLHttpRequest" : XMLHttpRequest,
						"textStatus" : textStatus,
						"errorThrown" : errorThrown
					};
					console.log(url, callId, errorParams, "网络异常，恢复通话请求发送失败");
				}
			});
		}
	}

	var logInfo = function() {
		var contactId = callingInfo.contactId;// 接触编号
		var operator = index.getUserInfo()['staffId'];// 呼叫操作员工帐号
		var operBeginTime = index.utilJS.getCurrentTime();// 呼叫操作开始时间
		var serviceTypeId = callingInfo.serviceTypeId;
		//var operEndTime = index.utilJS.getCurrentTime();// 操作结束时间
		var callerNo = callingInfo.callerNo;// 主叫号码
		var calledNo = callingInfo.calledNo;//接入码
		var subsNumber = callingInfo.subsNumber;// 受理号码
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
	}
	return objClass;
})
