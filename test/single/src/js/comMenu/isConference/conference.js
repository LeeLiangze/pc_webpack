define(['../../index/constants/mediaConstants',
        '../../log/transferOutLog',],
		function(MediaConstants,Log) {
	var _index;
	var log = new Log();
	var initialize = function(index) {
		_index = index;
		if(_index.nav.viewVal() == 2){
			_index.popAlert("请切换到语音视图模式使用三方通话","提示");
		}else{
			conference.call(this);//调用三方通话
		}
	};

	// 三方通话
	var conference = function() {
		var audioCallIds = _index.ctiInit.AudioCallIds;
		var lastCallId = audioCallIds.getAudioLastCallId();// 获取最后接入的语音会话
		var internalHelpCallId = audioCallIds.getInternalHelpCallId();// 获取内部求助的会话id
		if ((JSON.stringify(lastCallId) === JSON.stringify(internalHelpCallId)
				&& internalHelpCallId) || _index.ctiInit.AudioCallIds.getOuterHelpStaus() == "1") {// 内部、外部求助可以进行三方通话
			//CTI接口调用
			var uri = 'ws/call/conference/';
			var url = Url(uri);
			//记录日志
			log.setIsExt(true);
			var curData = CurData();
			var config = CTIRequest(url, curData);
			log.setOperator(_index.getUserInfo().staffId);//呼叫操作员工账号
			log.setOperBeginTime(_index.utilJS.getCurrentTime());//操作开始时间
			log.setOperId("010");//操作ID	
			//获取callingInfo
			//var activeSerialNo = _index.CallingInfoMap.getActiveSerialNo();
			var activeSerialNo = _index.CallingInfoMap.getAudioActiveserialNo();
			var callingInfo = _index.CallingInfoMap.get(activeSerialNo);
			log.setSerialNo(activeSerialNo);
			log.setServiceTypeId(callingInfo.getServiceTypeId());// 业务类型ID
			log.setContactId(callingInfo.getContactId());//接触编号
			log.setSubsNumber(callingInfo.getSubsNumber());//受理号码
			log.setCallerNo(callingInfo.getCallerNo());//主机号码
			log.setAccessCode(callingInfo.getCalledNo());//被叫接入
			// 发起三方通话
			$.ajax(config);
		} else {
			_index.popAlert("没有正在进行的求助会话，无法进行三方通话!");
		}
	}

	// CTI事件接口请求
	var CTIRequest = function(URL, CURDATA) {
		var config;
		if(_index.queue.browserName==="IE"){
			config = {
				url : URL,// 'ws/call/conference/'
				timeout : 20000,// 默认为 20000。如果超时时长不是 20000，则需要传递该参数。
				type : 'post',
				data : JSON.stringify(CURDATA),
				contentType : "application/json; charset=utf-8",
				dataType : "json",			
				async : true,// 默认值为 true 异步。如果需要同步，则需要传递该参数为false
				success : function(json) {// 成功的回调函数
					if (json.result === "0") {
						log.setStatus('1');
						if(_index.ctiInit.AudioCallIds.getOuterHelpStaus() == "1"){
							_index.ctiInit.AudioCallIds.setOuterHelpStaus("0");//外部求助转三方通话
						}
						if(_index.ctiInit.AudioCallIds.getInnerHelpStaus() == "1"){
							_index.ctiInit.AudioCallIds.setInnerHelpStaus("0");//初始化内部求助标识           //内部求助转三方通话
						}
						_index.ctiInit.AudioCallIds.setIsInConference(true);
						_index.popAlert("三方通话请求成功", "三方通话");					
					} else {
						log.setStatus(json.result);//设置状态日志
						//错误提示
						var errorcodeResultMsg = _index.ErrorcodeSearch.errorcodeSearch(json.result);
				        _index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);
						//_index.popAlert("三方通话请求失败,错误码：" + json.result, "三方通话");
					}					
					log.setOperEndTime(_index.utilJS.getCurrentTime());//操作结束时间
					log.logSavingForTransfer(log);//调用记录日志接口
				},
				error : function(jqXHR, textStatus, errorThrown) {// 失败的回调函数				
					_index.popAlert("网络异常，三方通话请求失败,错误信息：" + errorParams.textStatus,
							"三方通话请求失败");
					log.setFailId("-999");//操作失败码
					log.setOperEndTime(_index.utilJS.getCurrentTime());//操作结束时间
					log.logSavingForTransfer(log);//调用记录日志接口
				}
			};
		}else{
			config = {
				url : URL,// 'ws/call/conference/'
				timeout : 20000,// 默认为 20000。如果超时时长不是 20000，则需要传递该参数。
				type : 'post',
				data : JSON.stringify(CURDATA),
				contentType : "application/json; charset=utf-8",
				dataType : "json",
				crossDomain : true,// 跨域
				xhrFields : {withCredentials : true},// 支持跨域发送cookies
				async : true,// 默认值为 true 异步。如果需要同步，则需要传递该参数为false
				success : function(json) {// 成功的回调函数
					if (json.result === "0") {
						log.setStatus('1');
						if(_index.ctiInit.AudioCallIds.getOuterHelpStaus() == "1"){
							_index.ctiInit.AudioCallIds.setOuterHelpStaus("0");//外部求助转三方通话
						}
						if(_index.ctiInit.AudioCallIds.getInnerHelpStaus() == "1"){
							_index.ctiInit.AudioCallIds.setInnerHelpStaus("0");//初始化内部求助标识           //内部求助转三方通话
						}
						_index.ctiInit.AudioCallIds.setIsInConference(true);
						_index.popAlert("三方通话请求成功", "三方通话");					
					} else {
						log.setStatus(json.result);
						//错误提示
						var errorcodeResultMsg = _index.ErrorcodeSearch.errorcodeSearch(json.result);
				        _index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);
						//_index.popAlert("三方通话请求失败,错误码：" + json.result, "三方通话");
					}
					log.setOperEndTime(_index.utilJS.getCurrentTime());//操作结束时间
					log.logSavingForTransfer(log);//调用记录日志接口
				},
				error : function(jqXHR, textStatus, errorThrown) {// 失败的回调函数				
					_index.popAlert("网络异常，三方通话请求失败,错误信息：" + errorParams.textStatus,
							"三方通话请求失败");
					log.setFailId("-999");//操作失败码
					log.setOperEndTime(_index.utilJS.getCurrentTime());//操作结束时间
					log.logSavingForTransfer(log);//调用记录日志接口
				}
			};
		}
		
		return config;
	}

	// 获取被保持呼叫的呼叫标识callId
	var CurData = function() {
		var callId;
		var strCallId;
		var opserialNo = _index.serialNumber.getSerialNumber(); //获取随机数
		if(_index.ctiInit.AudioCallIds.getOuterHelpStaus() == "1"){
			// 外部求助时进行三方通话
			var outerHelpHoldCallId = _index.ctiInit.AudioCallIds.getOuterHelpHoldCallId();//获取外部求助被保持的会话CallId
			if(outerHelpHoldCallId){
				callId = {
						"opserialNo" : opserialNo, //操作序列号
						"callId" : outerHelpHoldCallId // 被保持呼叫的呼叫标识
				};
				strCallId = "" + outerHelpHoldCallId.time + outerHelpHoldCallId.dsn + outerHelpHoldCallId.handle + outerHelpHoldCallId.server;
				
			}
		}else{// 内部求助时进行三方通话
			var lastSecondCallId = _index.ctiInit.AudioCallIds.getlastSecondCallId();// 获取倒数第二个语音会话id值
			if (lastSecondCallId) {
				callId = {
						"opserialNo" : opserialNo, //操作序列号
						"callId" : lastSecondCallId // 被保持呼叫的呼叫标识
				};
				strCallId = "" + lastSecondCallId.time + lastSecondCallId.dsn + lastSecondCallId.handle + lastSecondCallId.server;
			}
		}
		if(strCallId){
			var activeSerialNo = _index.CallingInfoMap.getActiveSerialNo(_index.CallingInfoMap.getSerialNoByCallId(strCallId));
			var callingInfo = _index.CallingInfoMap.get(activeSerialNo);
			log.setOriginalCallerNo(callingInfo.getCallerNo());//原主机号码
		}

		return callId;
	}

	// 获取CTI接口的URL
	var Url = function(uri) {
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
	return initialize;
});