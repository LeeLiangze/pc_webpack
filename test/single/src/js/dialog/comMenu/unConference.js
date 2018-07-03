/**
 * 停止三方通话
 */
define(['../../index/constants/mediaConstants',
        '../../../tpl/comMenu/isConference/unConference.tpl',
        '../../log/transferOutLog',
        '../../../assets/css/comMenu/unConference/unConference.css'],
         function(MediaConstants,tpl,Log) {
	var _index;
	var log = new Log();
	var initialize = function(index) {
	    this.$el = $(tpl);
	    _index = index;
	    eventInit.call(this);
		// 将根节点赋值给接口
		this.content = this.$el;
	};
	
	//初始化事件
	var eventInit = function() {
		this.$el.on('click','#unConference_help',function(){
			unconference('helper');
		});
		this.$el.on('click','#unConference_user',function(){
			unconference('user');
		});
		this.$el.on('click','#unConference_me',function(){
			unconference('me');
		});
		/*$('#unConference_help',$el).click(function(){unconference('help');});
		$('#unConference_user',$el).click(function(){unconference('user');});*/
	}
	
	//停止三方通话
	var unconference = function(data) {
		
		log.setIsExt(true);
		log.setOperator(_index.getUserInfo().staffId);//呼叫操作员工账号
		log.setOperBeginTime(_index.utilJS.getCurrentTime());//操作开始时间
		log.setOperId("028");//操作ID						
		//获取callingInfo
//		var activeSerialNo = _index.CallingInfoMap.getActiveSerialNo();
//		var callingInfo = _index.CallingInfoMap.get(activeSerialNo);
		var activeSerialNo = _index.CallingInfoMap.getAudioActiveserialNo();
		var callingInfo = _index.CallingInfoMap.get(activeSerialNo);
		//设置挂机方为坐席 start
	    callingInfo.setReleaseType(MediaConstants.RELEASETYPE_OPERATOR);
	    //设置挂机方为坐席 end
		log.setSerialNo(activeSerialNo);
		log.setServiceTypeId(callingInfo.getServiceTypeId());// 业务类型ID
		log.setContactId(callingInfo.getContactId());//接触编号
		log.setSubsNumber(callingInfo.getSubsNumber());//受理号码
		log.setCallerNo(callingInfo.getCallerNo());//主机号码
		log.setAccessCode(callingInfo.getCalledNo());//接入码
		log.setOriginalCallerNo(callingInfo.getCallerNo());//原主机号码
		var uri = 'ws/call/releasecall/';
		var url = Url(_index, uri);
		var curData = CurData(data);
		var config = CTIRequest(url,curData);
	    //发起三方通话
		$.ajax(config);
	}
	
	//CTI事件接口请求
	var CTIRequest = function(URL,CURDATA){
		var config;
		if(_index.queue.browserName==="IE"){
			config = {
					url : URL,//'ws/call/releasecall/'
					timeout : 20000,//默认为 20000。如果超时时长不是 20000，则需要传递该参数。		
					type : 'post',
					data : JSON.stringify(CURDATA),
					contentType : "application/json; charset=utf-8",
					dataType : "json",
					crossDomain : true,//跨域
					async : true,//默认值为 true 异步。如果需要同步，则需要传递该参数为false
					success : function(json){//成功的回调函数
						if(json.result == "0"){
							log.setStatus('1');
							_index.ctiInit.AudioCallIds.setIsInConference(false);//设置三方通话标识为false；
							_index.ctiInit.AudioCallIds.setIsConferenceCallerNo("");//设置三方通话的用户号码为空值
							_index.ctiInit.AudioCallIds.setIsConferenceCalledNo("");//设置三方通话的被求助方为空值
							_index.destroyDialog();
							_index.popAlert("停止三方通话请求成功", "停止三方通话");
						}else{
							log.setStatus(json.result);//设置状态日志
							//错误提示
							var errorcodeResultMsg = _index.ErrorcodeSearch.errorcodeSearch(json.result);
					        _index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);
							//_index.popAlert("停止三方通话请求失败,错误码：" + json.result, "停止三方通话");		
						}
						log.setOperEndTime(_index.utilJS.getCurrentTime());//操作结束时间
						log.logSavingForTransfer(log);//调用记录日志接口
					},
					error : function(jqXHR,textStatus,errorThrown){//失败的回调函数
						var errorParams = {
								"XMLHttpRequest":jqXHR,
								"textStatus":textStatus,
								"errorThrown":errorThrown
						};
						_index.popAlert("网络异常，停止三方通话请求失败,错误信息：" + errorParams.textStatus, "停止三方通话请求失败");
						log.setFailId("-999");//操作失败码
						log.setOperEndTime(_index.utilJS.getCurrentTime());//操作结束时间
						log.logSavingForTransfer(log);//调用记录日志接口
					}
			};
		}else{
			config = {
					url : URL,//'ws/call/releasecall/'
					timeout : 20000,//默认为 20000。如果超时时长不是 20000，则需要传递该参数。		
					type : 'post',
					data : JSON.stringify(CURDATA),
					contentType : "application/json; charset=utf-8",
					dataType : "json",
					crossDomain : true,//跨域
					xhrFields : {withCredentials: true},//支持跨域发送cookies
					async : true,//默认值为 true 异步。如果需要同步，则需要传递该参数为false
					success : function(json){//成功的回调函数
						if(json.result == "0"){
							log.setStatus('1');
							_index.ctiInit.AudioCallIds.setIsInConference(false);//设置三方通话标识为false；
							_index.ctiInit.AudioCallIds.setIsConferenceCallerNo("");//设置三方通话的用户号码为空值
							_index.ctiInit.AudioCallIds.setIsConferenceCalledNo("");//设置三方通话的被求助方为空值
							_index.destroyDialog();
							_index.popAlert("停止三方通话请求成功", "停止三方通话");
						}else{
							log.setStatus(json.result);//设置状态日志
							//错误提示
							var errorcodeResultMsg = _index.ErrorcodeSearch.errorcodeSearch(json.result);
					        _index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);
							//_index.popAlert("停止三方通话请求失败,错误码：" + json.result, "停止三方通话");		
						}
						log.setOperEndTime(_index.utilJS.getCurrentTime());//操作结束时间
						log.logSavingForTransfer(log);//调用记录日志接口
					},
					error : function(jqXHR,textStatus,errorThrown){//失败的回调函数
						var errorParams = {
								"XMLHttpRequest":jqXHR,
								"textStatus":textStatus,
								"errorThrown":errorThrown
						};
						_index.popAlert("网络异常，停止三方通话请求失败,错误信息：" + errorParams.textStatus, "停止三方通话请求失败");
						log.setFailId("-999");//操作失败码
						log.setOperEndTime(_index.utilJS.getCurrentTime());//操作结束时间
						log.logSavingForTransfer(log);//调用记录日志接口
					}
			};
		}
		return config;
	}
	
	//获取CTI接口的URL
	var Url = function(_index, uri) {
		// 设置CTIURL参数	
		var ctiInfo = _index.CTIInfo;
		var cacsUrl = MediaConstants.CCACSURL;//"http://"
		var isDefault = ctiInfo.isDefault;
		var url;
		if (isDefault === "1") {// 此情况走nginx代理
			var CTIID = ctiInfo.CTIId;
			var proxyIP = ctiInfo.ProxyIP;
			var proxyPort = ctiInfo.ProxyPort;
			url = cacsUrl + proxyIP + ":" + proxyPort + "/ccacs/" + CTIID + "/" + uri;
		} else {// 跨域直连
			var ip = ctiInfo.IP;
			var port = ctiInfo.port;
			url = cacsUrl + ip + ":" + port + "/ccacs/" + uri;
		}

		return url;
	}
	
	//获取挂断的呼叫标识callId
	var CurData = function(data){
		var curData,releaseNo = "";
		var opserialNo = _index.serialNumber.getSerialNumber(); //获取随机数
		var audioCallIds = _index.ctiInit.AudioCallIds;
		var callId_ = audioCallIds.getAudioLastCallId();// 获取最后接入的语音会话
//		console.log("callId_:"+JSON.stringify(callId_));
		var callId;		
		var serialNo=_index.CallingInfoMap.getActiveSerialNo();
		var callingInfo=_index.CallingInfoMap.get(serialNo);
//		console.log("callingInfo:"+JSON.stringify(callingInfo));
		if(callingInfo){
			callId={
					"time":callingInfo.getCallIdTime(),
					 "dsn":callingInfo.getCallIdDsn(),
					 "handle":callingInfo.getCallIdHandle(),
					 "server":callingInfo.getCallIdServer()	
			}
		}else{
			return;
		};
//		console.log("callId:"+JSON.stringify(callId));
		if($.trim(data) == 'user'){
			//releaseNo = audioCallIds.getIsConferenceCallerNo();//主叫
			/*if(callingInfo.origCallInfo != ""&&callingInfo.origCallInfo!=null) {
				releaseNo = callingInfo.getSubsNumber();//主叫
			} else {
				releaseNo = $("#J_acceptNum").val();
			}*/
			var numberArr=[];
			for(var i in callingInfo.clientInfoMap){
				numberArr.push(i);
			}
			releaseNo = numberArr[numberArr.length-1];
		}else if($.trim(data) == 'helper'){
			releaseNo = audioCallIds.getIsConferenceCalledNo();//被叫
		}else if($.trim(data) == 'me'){
			//releaseNo = _index.CTIInfo.workNo;//获取工号
			releaseNo = "";
		}else{
			_index.popAlert("未找到相应按钮操作！", "错误");
		}
		curData = {
				"opserialNo" : opserialNo, //操作序列号
				"callId" : callId, //需要释放的呼叫标识
				"releaseNo" : releaseNo //需要释放的电话号码/座席工号
		};
		
		return curData;
	}
	/*var CurData = function(_index,data){      	
		var curData;
		var opserialNo = _index.serialNumber.getSerialNumber(); //获取随机数
		if(data === 'user'){
			var holdCallId = _index.ctiInit.AudioCallIds.getHoldCallId();//获取被保持的语音会话id;
			curData = {
					"opserialNo" : opserialNo, //操作序列号
					"callId" : holdCallId
			};//挂断用户方，则传递audioCallIds缓存中holdCallId值;
		}else{//data == 'help' 或者 默认选择挂断被求助方;
			var internalHelpCallId = _index.ctiInit.AudioCallIds.getInternalHelpCallId();//获取内部求助的会话id;
			curData = {
					"opserialNo" : opserialNo, //操作序列号
					"callId" : internalHelpCallId
			};//挂断被求助方，则传递audioCallIds缓存中internalHelpCallId值;
		}
		
		return curData;
	}*/
      
	return initialize;
});
