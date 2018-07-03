/**
 * 取消外部求助--释放会话、恢复会话接口
 * author：zhangyingsheng 2017.03.02 16：00
 */
define(['../../index/constants/mediaConstants',],function(Constants){
	var _index;
	//var tempHoldCallId;
	var objModule = function(index){
		_index = index;
		//var callIdArr = _index.ctiInit.AudioCallIds.getHoldCallId();
		//tempHoldCallId = "" + callIdArr.time + callIdArr.dsn + callIdArr.handle + callIdArr.server;
		releaseCall(unholdCall);//取消外部求助
	}
	
	//会话释放
	var releaseCall = function(funcUNholdCall){
		var uri_releaseCall = 'ws/call/releasecall/';
		var url_releaseCall = Url(uri_releaseCall);
		var curData = CurData_releaseCall();
		if(!curData){
			_index.popAlert("请求参数错误", "参数错误");
		}else{
			var params = {
					URL : url_releaseCall,
					CURDATA : curData,
					successCallBack : function(json){
						if(json.result == "0"){
							_index.popAlert("释放通话成功", "释放通话");
							_index.ctiInit.AudioCallIds.setOuterHelpStaus("0");//设置外部求助标识为0
							funcUNholdCall();//恢复被保持的会话
						}else{
							//错误提示
							var errorcodeResultMsg = _index.ErrorcodeSearch.errorcodeSearch(json.result);
					        _index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);
							/*var resultMsg = _index.ctiInit.ErrorcodeSearch.ErrorcodeSearch(json.result,
									"释放通话请求失败，CTI错误码：" + json.result);//查询错误码对应的错误信息
							_index.popAlert(resultMsg, "错误提示");*/
						}
					},
					errorCallBack : function(XMLHttpRequest, textStatus, errorThrown){
						var errorParams = {//消息请求失败
								"XMLHttpRequest":XMLHttpRequest,
								"textStatus":textStatus,
								"errorThrown":errorThrown
						};
						_index.popAlert("网络异常，释放通话请求发生失败!失败信息：" + errorParams.textStatus, "请求失败");
					}
			};
			var config = CTIRequest(params);
			$.ajax(config);//CTI请求
		}
	}
	
	//会话恢复
	var unholdCall = function(){
		var uri_unhold = "ws/call/unhold";
		var url_unhold = Url(uri_unhold);//接口URL
		var curData = CurData_unhold();
		if(!curData){
			_index.popAlert("请求参数错误", "参数错误");
		}else{
			//参数
			var params = {
					URL : url_unhold,
					CURDATA : curData,
					successCallBack : function(json){
						if(json.result == "0"){
							//将恢复的会话设置为当前活跃的会话
							//var serialNo = _index.CallingInfoMap.getSerialNoByCallId(tempHoldCallId);
							//console.log("被保持：" + serialNo);
							//_index.CallingInfoMap.setActiveSerialNo(serialNo);//ZHANGYINGSHENG
							_index.ctiInit.AudioCallIds.setHoldCallId("");//设置会话保持的callId为空值
							_index.popAlert("恢复通话成功", "恢复通话");
						}else{
							//错误提示
							var errorcodeResultMsg = _index.ErrorcodeSearch.errorcodeSearch(json.result);
					        _index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);
							/*var resultMsg = _index.ctiInit.ErrorcodeSearch.ErrorcodeSearch(json.result,
									"恢复通话请求失败，CTI错误码：" + json.result);//查询错误码对应的错误信息
							_index.popAlert(resultMsg, "错误提示");*/
						}
					},
					errorCallBack : function(XMLHttpRequest, textStatus, errorThrown){
						var errorParams = {//消息请求失败
								"XMLHttpRequest":XMLHttpRequest,
								"textStatus":textStatus,
								"errorThrown":errorThrown
						};
						_index.popAlert("网络异常，恢复通话请求发生失败!失败信息：" + errorParams.textStatus, "请求失败");
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
		var activeSerialNo = _index.CallingInfoMap.getActiveSerialNo();
		var callingInfo = _index.CallingInfoMap.get(activeSerialNo);
		var releaseNo = callingInfo.getCallerNo();//获取当前会话的被叫号码
		
		if(releaseNo && callId){
			curData = {
					"opserialNo" : opserialNo, //操作序列号
					"callId" : callId, //需要释放的呼叫标识
					"releaseNo" : releaseNo //需要释放的电话号码/座席工号
			};
		}		
		
		return curData;
	}
	
	//获取恢复会话（取保持）的参数
	var CurData_unhold = function(){
		var callId = _index.ctiInit.AudioCallIds.getHoldCallId(); //获取被保持的语音会话id
		if(!callId){
			_index.popAlert("没有被保持的会话", "参数为NULL");
			return;
		}else{
			var opserialNo = _index.serialNumber.getSerialNumber(); //获取随机数			
			var curData = {
					"opserialNo" : opserialNo, //操作序列号
					"callId" : callId //呼叫标识
			};
			
			return curData;
		}
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