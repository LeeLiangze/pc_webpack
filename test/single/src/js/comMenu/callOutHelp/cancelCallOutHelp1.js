/**
 * 取消外部求助--释放会话、恢复会话接口
 * author：zhangyingsheng 2017.03.02 16：00
 */
define(['../../index/constants/mediaConstants',
        '../../log/transferOutLog'],function(Constants,Log){
	var _index;
	var log = new Log();
	//var tempHoldCallId;
	var objModule = function(index){
		_index = index;
		log.setOperBeginTime(_index.utilJS.getCurrentTime());//操作开始时间
		releaseCall();//取消外部求助
	}
	
	//会话释放
	var releaseCall = function(){
		var uri_releaseCall = 'ws/call/releasecall/';
		var url_releaseCall = Url(uri_releaseCall);
		var curData = CurData_releaseCall();
		//记录日志
		log.setIsExt(true);
		log.setOperator(_index.getUserInfo().staffId);//呼叫操作员工账号
		log.setOperId("029");//操作ID							
		//获取callingInfo
		var activeSerialNo = _index.CallingInfoMap.getActiveSerialNo();
		var callingInfo = _index.CallingInfoMap.get(activeSerialNo);
		log.setSerialNo(activeSerialNo);
		log.setServiceTypeId(callingInfo.getServiceTypeId());// 业务类型ID
		log.setContactId(callingInfo.getContactId());//接触编号
		log.setSubsNumber(curData.releaseNo);//受理号码
		log.setOriginalCallerNo(callingInfo.getCallerNo());//原主机号码
		//log.setTransferMode(curData.transferMode);//转移模式
		log.setCallerNo(callingInfo.getCallerNo());//主叫号码
		log.setAccessCode(curData.releaseNo);//接入码
		log.setDestOperator(curData.releaseNo);//目的操作员账号
		if(!curData){
			_index.popAlert("请求参数错误", "参数错误");
		}else{
			var params = {
					URL : url_releaseCall,
					CURDATA : curData,
					successCallBack : function(json){
						if(json.result == "0"){
							_index.ctiInit.AudioCallIds.setOuterHelpCallOutNo("");//设置外部求助呼出的号码为空
							_index.ctiInit.AudioCallIds.setOuterHelpStaus("0");//设置外部求助标识为0
							_index.popAlert("释放通话成功", "释放通话");	
							log.setStatus("1");//设置状态
						}else{
							//错误提示
							var errorcodeResultMsg = _index.ErrorcodeSearch.errorcodeSearch(json.result);
					        _index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);
							/*var resultMsg = _index.ctiInit.ErrorcodeSearch.ErrorcodeSearch(json.result,
									"释放通话请求失败，CTI错误码：" + json.result);//查询错误码对应的错误信息
							_index.popAlert(resultMsg, "错误提示");*/
					        log.setFailId(json.result);//操作失败码
					        log.setStatus("0");//设置状态
						}
						log.setOperEndTime(_index.utilJS.getCurrentTime());//操作结束时间
						log.logSavingForTransfer(log);//调用记录日志接口
					},
					errorCallBack : function(XMLHttpRequest, textStatus, errorThrown){
						var errorParams = {//消息请求失败
								"XMLHttpRequest":XMLHttpRequest,
								"textStatus":textStatus,
								"errorThrown":errorThrown
						};
						_index.popAlert("网络异常，释放通话请求发生失败!失败信息：" + errorParams.textStatus, "请求失败");
						log.setFailId("-999");//操作失败码
						log.setOperEndTime(_index.utilJS.getCurrentTime());//操作结束时间
						log.logSavingForTransfer(log);//调用记录日志接口
					}
			};
			var config = CTIRequest(params);
			$.ajax(config);//CTI请求
		}
	}	
	
	//CTI接口请求参数配置
	var CTIRequest = function(params){
		var config;
		if(_index.queue.browserName==="IE"){
			config = {
					url : params.URL,
					timeout : 20000,//默认为 20000。如果超时时长不是 20000，则需要传递该参数。
					type : 'post',
					data : JSON.stringify(params.CURDATA),
					dataType : "json",
					contentType :"application/json; charset=utf-8",
					async : true,// 异步					
					success : function(json){
						params.successCallBack(json);
					},
					error : function(XMLHttpRequest, textStatus, errorThrown){
						params.errorCallBack(XMLHttpRequest, textStatus, errorThrown);
					}
			};
		}else{
			config = {
					url : params.URL,
					timeout : 20000,//默认为 20000。如果超时时长不是 20000，则需要传递该参数。
					type : 'post',
					data : JSON.stringify(params.CURDATA),
					dataType : "json",
					contentType :"application/json; charset=utf-8",
					async : true,// 异步
					crossDomain : true,//跨域
					xhrFields : {withCredentials: true},//支持跨域发送cookies
					success : function(json){
						params.successCallBack(json);
					},
					error : function(XMLHttpRequest, textStatus, errorThrown){
						params.errorCallBack(XMLHttpRequest, textStatus, errorThrown);
					}
			};
		}
		
		return config;
	}
	
	//获取挂断的呼叫标识callId
	var CurData_releaseCall = function(){
		var curData,releaseNo = "";
		var opserialNo = _index.serialNumber.getSerialNumber(); //获取随机数		
		var callId = _index.ctiInit.AudioCallIds.getAudioLastCallId();// 获取最后接入的语音会话
		//获取当前活跃的会话
//		var activeSerialNo = _index.CallingInfoMap.getActiveSerialNo();
//		var callingInfo = _index.CallingInfoMap.get(activeSerialNo);
//		var releaseNo = callingInfo.getCalledNo();//获取当前会话的被叫号码
		var releaseNo = _index.ctiInit.AudioCallIds.getOuterHelpCallOutNo();
		if(releaseNo && callId && releaseNo.length > 0){
			curData = {
					"opserialNo" : opserialNo, //操作序列号
					"callId" : callId, //需要释放的呼叫标识
					"releaseNo" : releaseNo //需要释放的电话号码/座席工号
			};
		}else{
			_index.popAlert("当前会话id或者需要释放的电话号码为空！", "参数为空");
			return;
		}
		
		return curData;
	}	
	
	//获取CTI接口的URL
	var Url = function(uri){
		//设置CTIURL参数			
		var isDefault = _index.CTIInfo.isDefault;
		var ccascurl = Constants.CCACSURL;//http://
		var url = "";
		if(isDefault == "1"){//此情况走nginx代理
			var CTIID = _index.CTIInfo.CTIId;			
			var proxyIP = _index.CTIInfo.ProxyIP;
			var proxyPort = _index.CTIInfo.ProxyPort;
			url = ccascurl + proxyIP + ":" + proxyPort + "/ccacs/" + CTIID + "/" + uri;
		}else{//跨域直连
			var ip = _index.CTIInfo.IP;
			var port = _index.CTIInfo.port;
			url = ccascurl + ip + ":" + port + "/ccacs/" + uri;
		}
		
		return url;
	}
	
	return objModule;
})