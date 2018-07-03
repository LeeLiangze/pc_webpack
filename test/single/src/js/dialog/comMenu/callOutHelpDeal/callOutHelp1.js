/**
 * 外部求助--通话转接口
 */
define(['Util','../../../index/constants/mediaConstants',
        '../../../log/transferOutLog',
		'../../../../tpl/comMenu/callOutHelp/callOutHelp.tpl',
		'../../../../assets/css/comMenu/callOutHelp/callOutHelp.css'],
		function(Util,MediaConstants,Log,callOutHelpTpl){
	var _index;
	var Constants = MediaConstants;
	var log = new Log();
	var objModule = function(index){//   参数传入index
		_index = index;
		//设置外部求助会话保持的callId
		log.setOperBeginTime(_index.utilJS.getCurrentTime());//操作开始时间
		var audioCallIds = _index.ctiInit.AudioCallIds;
		audioCallIds.setOuterHelpHoldCallId(audioCallIds.getAudioLastCallId());
		//设置三方通话的主叫号码
		var activeSerialNo = _index.CallingInfoMap.getActiveSerialNo();
 		var callingInfoTemp = _index.CallingInfoMap.get(activeSerialNo);//获取callingInfo
        _index.ctiInit.AudioCallIds.setIsConferenceCallerNo(callingInfoTemp.getCallerNo());//设置三方通话的主叫号码
		
		var callOutHelpPage = callOutHelpTpl;		
		var callOutHelpTemplate = Util.hdb.compile(callOutHelpPage);//编译模板
		
		//初始化主叫号码下拉框
		var callcallerData = _index.ctiInit.AudioCallIds.getCallerPhoneNums();
		//配置主叫号码
		var dataSource = {callOutMainNumber:callcallerData};//参数值{key：value}
		var callOutHelpHtml = callOutHelpTemplate(dataSource);//传入模板参数的值
		this.$el = $(callOutHelpHtml);
		eventInit.call(this);
		this.content = this.$el;
	};
	
	var eventInit = function(){
		//优化体检
		this.$el.on("click", function(){
			$(this).find(".call-out-more-number-common").addClass("hid");
		});
		//下拉选择的ui控制
		this.$el.on({
			'click':function(e){
				e.stopPropagation();
				$(this).parents('.call-out-number-box-common').find('.call-out-more-number-common').toggleClass('hid');
			}
		},'.call-out-choice-common');		
		//当聚焦和失去焦点的动作
		this.$el.on({
			'focus':function(e){
				e.stopPropagation();
				if($.trim($(this).val()) === "请输入被叫号码"){
					$(this).val('');//被叫号码
				}
			}
		},'.call-out-show-number-panpel');
		
		//enter start
		setTimeout(function(){
			$('#callOutNum',this.$el).focus();
			},0);
		var that = this;
		this.$el.on('keydown',function(e){
			var event = (typeof event!= 'undefined') ? window.event : e;
	   		if(event.keyCode == 13){
	   			$('.call-out-call',that.$el).click();
	   			//event.stopPropagation();
	   			window.event.returnValue = false;
	   		};
		});
   		//enter end
		
		//主叫下拉框事件
		this.$el.on({
			'mouseover':function(e){
				e.stopPropagation();
				$(this).css('background','#0085D0');
			},
			'mouseout':function(e){
				e.stopPropagation();
				$(this).css('background','white');
			},
			'click':function(e){
				e.stopPropagation();
				$(this).parents('.call-out-number-box').find('.call-out-show-number-common').text($.trim($(this).text()));
				$(this).parent().addClass('hid');
			}
		},'.call-out-number');
		//处理拨号盘
		this.$el.on('click','.call-number-num',function(e){
			e.stopPropagation();
			var callNum = $.trim($(this).text());
			if($(this).parents('.call-out-help-box').find('.call-out-show-number-panpel').val() === "请输入被叫号码"){
				$(this).parents('.call-out-help-box').find('.call-out-show-number-panpel').val("");
			}
			$(this).parents('.call-out-help-box').find('.call-out-show-number-panpel').val(function(_index,oldValue){
				return oldValue + callNum;//数字拨号字符
			})
		});
		//呼出逻辑处理
		this.$el.on('click','.call-out-call',function(e){
			e.stopPropagation();
			//获取被叫号码
			var beCallNumber = $.trim($(this).parents('.call-out-number-choice').find('.call-out-show-number-panpel').val());
			//获取主叫号码
			var mainCallOutNumber = $.trim($(this).parents('.call-out-number-choice').find('.call-out-show-number-common').text());
			//判断是否有号码输入
			if(!mainCallOutNumber || !beCallNumber || mainCallOutNumber == "请选择主叫号码" || beCallNumber == "请输入被叫号码"){
				_index.popAlert("主叫号码、被叫号码 不能为空。","错误提示");
				return;
			}
			//判断是否输入全部为数字
			if(!isPhone(beCallNumber)){
				_index.popAlert("请输入正确的电话号码。","错误提示");
				return;
			}
			//选中的button是呼叫按钮时
			var flag = $(this).attr("class");
			if(flag == "call-out-call"){
				var url = Url();
				var curData = CurData(beCallNumber,mainCallOutNumber);
				var config = CTIRequest(url,curData);
				//记录日志
				log.setIsExt(true);
				log.setOperator(_index.getUserInfo().staffId);//呼叫操作员工账号
				log.setOperId("004");//操作ID							
				//获取callingInfo
				var activeSerialNo = _index.CallingInfoMap.getActiveSerialNo();
				var callingInfo = _index.CallingInfoMap.get(activeSerialNo);
				log.setSerialNo(activeSerialNo);
				log.setServiceTypeId(callingInfo.getServiceTypeId());// 业务类型ID
				log.setContactId(callingInfo.getContactId());//接触编号
				log.setSubsNumber(curData.calledDigits);//受理号码
				log.setOriginalCallerNo(callingInfo.getCallerNo());//原主机号码
				log.setTransferMode(curData.transferMode);//转移模式
				log.setCallerNo(curData.callerDigits);//主叫号码
				log.setAccessCode(beCallNumber);//接入码
				log.setDestOperator(beCallNumber);//目的操作员账号
				//设置外部求助呼出的号码
				_index.ctiInit.AudioCallIds.setOuterHelpCallOutNo(curData.calledDigits);
				//被叫号码
				$.ajax(config);//外部求助
			}
		});
		//取消逻辑处理
		this.$el.on('click','.call-out-cancel',function(e){
			e.stopPropagation();
			//重置输入框
			$(this).parents('.call-out-number-choice').find('.call-out-show-number-panpel').val('请输入被叫号码');
			$(this).parents('.call-out-number-choice').find('.call-out-show-number-common').text('请选择主叫号码');
		});
	}
	
	//CTI接口请求参数配置
	var CTIRequest = function(URL,CURDATA){
		var config;
		if(_index.queue.browserName==="IE"){
			config = {
					url : URL,
					type : 'post',
					data : JSON.stringify(CURDATA),
					contentType :"application/json; charset=utf-8",					
					success : function(json){
						if(json.result == "0"){//请求成功
							//存储呼叫类型 start
                        	_index.ctiInit.AudioCallIds.setCallFeature("0");//外部求助0
               				 //存储呼叫类型 end
							_index.ctiInit.AudioCallIds.setOuterHelpStaus("1");//设置外部求助成功标识					
							_index.popAlert("外部求助请求成功，请等待响应。","通话提醒");
							_index.destroyDialog();//关闭拨号框
							log.setStatus('1');//设置状态
						}else{//请求失败
							var audioCallIds = _index.ctiInit.AudioCallIds;
							audioCallIds.setOuterHelpCallOutNo("");//设置外部求助呼出的号码为空
							audioCallIds.setOuterHelpHoldCallId("");//设置外部求助会话保持为空
							audioCallIds.setIsConferenceCallerNo("");//设置三方通话的主叫号码为空
							//错误提示
							var errorcodeResultMsg = _index.ErrorcodeSearch.errorcodeSearch(json.result);
					        _index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);
							/*var resultMsg = _index.ctiInit.ErrorcodeSearch.ErrorcodeSearch(json.result,"外呼请求失败，CTI错误码：" + json.result);
							_index.popAlert(resultMsg,"错误提示");*/
					        log.setFailId(json.result);//操作失败码
            				log.setStatus("0");//设置状态
						}					
						
						log.setOperEndTime(_index.utilJS.getCurrentTime());//操作结束时间
						log.logSavingForTransfer(log);//调用记录日志接口
					},
					error : function(XMLHttpRequest, textStatus, errorThrown){
						var audioCallIds = _index.ctiInit.AudioCallIds;
						audioCallIds.setOuterHelpCallOutNo("");//设置外部求助呼出的号码为空
						audioCallIds.setOuterHelpHoldCallId("");//设置外部求助会话保持为空
						audioCallIds.setIsConferenceCallerNo("");//设置三方通话的主叫号码为空
						_index.popAlert("网络异常导致外部求助请求失败。","失败提示");
						log.setFailId("-999");//操作失败码
						log.setOperEndTime(_index.utilJS.getCurrentTime());//操作结束时间
						log.logSavingForTransfer(log);//调用记录日志接口
					}
			};
		}else{
			config = {
					url : URL,
					type : 'post',
					data : JSON.stringify(CURDATA),
					contentType :"application/json; charset=utf-8",
					crossDomain : true,//跨域
					xhrFields : {withCredentials: true},//支持跨域发送cookies
					success : function(json){
						if(json.result == "0"){//请求成功
							//存储呼叫类型 start
                        	_index.ctiInit.AudioCallIds.setCallFeature("0");//外部求助 0
               				 //存储呼叫类型 end
							log.setStatus('1');//设置状态
							_index.ctiInit.AudioCallIds.setOuterHelpStaus("1");//设置外部求助成功标识					
							_index.popAlert("外部求助请求成功，请等待响应。","通话提醒");
							_index.destroyDialog();//关闭拨号框
						}else{//请求失败
							var audioCallIds = _index.ctiInit.AudioCallIds;
							audioCallIds.setOuterHelpCallOutNo("");//设置外部求助呼出的号码为空
							audioCallIds.setOuterHelpHoldCallId("");//设置外部求助会话保持为空
							audioCallIds.setIsConferenceCallerNo("");//设置三方通话的主叫号码为空
							log.setFailId(json.result);//操作失败码
            				log.setStatus("0");//设置状态
							//错误提示
							var errorcodeResultMsg = _index.ErrorcodeSearch.errorcodeSearch(json.result);
					        _index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);
							/*var resultMsg = _index.ctiInit.ErrorcodeSearch.ErrorcodeSearch(json.result,"外呼请求失败，CTI错误码：" + json.result);
							_index.popAlert(resultMsg,"错误提示");*/
						}	
						log.setOperEndTime(_index.utilJS.getCurrentTime());//操作结束时间
						log.logSavingForTransfer(log);//调用记录日志接口
					},
					error : function(XMLHttpRequest, textStatus, errorThrown){
						var audioCallIds = _index.ctiInit.AudioCallIds;
						audioCallIds.setOuterHelpCallOutNo("");//设置外部求助呼出的号码为空
						audioCallIds.setOuterHelpHoldCallId("");//设置外部求助会话保持为空
						audioCallIds.setIsConferenceCallerNo("");//设置三方通话的主叫号码为空
						_index.popAlert("网络异常导致外部求助请求失败。","失败提示");
						log.setFailId("-999");//操作失败码
						log.setOperEndTime(_index.utilJS.getCurrentTime());//操作结束时间
						log.logSavingForTransfer(log);//调用记录日志接口
					}
			};
		}		
		
		return config;
	}	
	
	//获取CTI接口的参数
	var CurData = function(beCallNumber,mainCallOutNumber){
		//接口参数
		var opserialNo = _index.serialNumber.getSerialNumber(); //获取随机数
		var calledDeviceType = Constants.CALLEDDEVICETYPE_OUTBOUND; //type：外呼号码
		var transferMode = Constants.TRANSFERMODE_CALLING; //通话转
		var activeSerialNo = _index.CallingInfoMap.getActiveSerialNo();
		var callingInfo = _index.CallingInfoMap.get(activeSerialNo);//获取callingInfo
		//获取callId
		 var time = callingInfo.getCallIdTime();
         var dsn = callingInfo.getCallIdDsn();
         var handle = callingInfo.getCallIdHandle();
         var server = callingInfo.getCallIdServer();
         var callId = {"time":time,"dsn":dsn,"handle":handle,"server":server};
		
		var curData = {
				"opserialNo":opserialNo, //操作序列号
				"callId":callId, //呼叫标识
				"calledDeviceType":calledDeviceType, //类型：外呼号码
				"transferMode":transferMode, //通话转
				"calledDigits":beCallNumber, //被叫号码
				"callerDigits":mainCallOutNumber //主叫号码
		};
		
		return curData;
	}
	
	//获取CTI接口的URL
	var Url = function(){
		//设置CTIURL参数
		var ctiInfo = _index.CTIInfo;
		var CTIID = ctiInfo.CTIId;
		var ip = ctiInfo.IP;
		var port = ctiInfo.port;
		var proxyIP = ctiInfo.ProxyIP;
		var proxyPort = ctiInfo.ProxyPort;
		var isDefault = ctiInfo.isDefault;
		var url = "";
		if(isDefault == "1"){//此情况走nginx代理
			url = Constants.CCACSURL + proxyIP + ":" + proxyPort + "/ccacs/" + CTIID + "/ws/call/transout";
		}else{//跨域直连
			url = Constants.CCACSURL + ip + ":" + port + "/ccacs/ws/call/transout";
		}
		
		return url;
	}
	
	//判断输入的为数字
	function isPhone(phoneNumber){
		if(phoneNumber.length==0){
			return false;
		}
		var myreg = /^[0-9]*$/;
		if(!myreg.test(phoneNumber)){
			return false;
		}
		return true;
	}
	
	return objModule;
	
})
