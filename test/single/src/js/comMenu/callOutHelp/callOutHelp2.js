/**
 * 外部求助--会话保持、呼出接口
 */
define(['Util','../../index/constants/mediaConstants',
        '../../log/transferOutLog',
		'../../../tpl/comMenu/callOutHelp/callOutHelp.tpl',
		'../../../assets/css/comMenu/callOutHelp/callOutHelp'],
		function(Util,MediaConstants,Log,callOutHelpTpl){
	var _index;
	var Constants = MediaConstants;
	//var log = new Log();
	var beCallNumber,mainCallOutNumber;
	/*var result_hold = false, result_callout = false;*/
	var objModule = function(index){// 参数传入index
		_index = index;
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
			beCallNumber = $.trim($(this).parents('.call-out-number-choice').find('.call-out-show-number-panpel').val());
			//获取主叫号码
			mainCallOutNumber = $.trim($(this).parents('.call-out-number-choice').find('.call-out-show-number-common').text());
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
				//会话保持成功，则进外呼；外呼出错，则进行恢复会话；
				if(_index.ctiInit.AudioCallIds.getOuterHelpStaus() == "0"){
					holdCall(callOut);
				}else if(_index.ctiInit.AudioCallIds.getOuterHelpStaus() == "1"){
					callOut(unholdCall,beCallNumber,mainCallOutNumber);
				}
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
	
	//呼出
	var callOut = function(fncUNholdCall,beCallNumber,mainCallOutNumber){			
		var uri_callout = "ws/call/callout";
		var url_callout = Url(uri_callout);//接口URL
		var curData = CurData_callOut(beCallNumber, mainCallOutNumber);//接口传递参数
		var params = {
				URL : url_callout,
				CURDATA : curData,
				successCallBack : function(json){
					if(json.result == "0"){
						//存储呼叫类型 start
                    	_index.ctiInit.AudioCallIds.setCallFeature("4");//外部求助4
           				 //存储呼叫类型 end
						_index.ctiInit.AudioCallIds.setOuterHelpStaus("1");//设置外部求助成功标识
						_index.popAlert("外部求助请求成功，请等待响应。", "通话提醒");
						_index.ctiInit.AudioCallIds.setCalloutCallId(json.callId);//设置外呼会话id
						_index.destroyDialog();//关闭拨号框
					}else{
						//错误提示
						var errorcodeResultMsg = _index.ErrorcodeSearch.errorcodeSearch(json.result);
				        _index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);
						/*var resultMsg = _index.ctiInit.ErrorcodeSearch.ErrorcodeSearch(json.result,
								"外呼请求失败，CTI错误码：" + json.result);
						_index.popAlert(resultMsg, "错误提示");*/
						fncUNholdCall();//恢复被保持的会话
					}
				},
				errorCallBack : function(XMLHttpRequest, textStatus, errorThrown){
					var errorParams = {//消息请求失败
							"XMLHttpRequest":XMLHttpRequest,
							"textStatus":textStatus,
							"errorThrown":errorThrown
					};
					_index.popAlert("网络异常，外部求助请求发生失败!失败信息：" + errorParams.textStatus, "请求失败");
					fncUNholdCall();//恢复被保持的会话
				}
		};
		var config = CTIRequest(params);
		$.ajax(config);
	}
	
	//会话保持
	var holdCall = function(funcCallOut){		
		var uri_hold = "ws/call/hold";
		var url_hold = Url(uri_hold);//接口URL
		var curData = CurData_hold();//接口传递参数
		if(!curData){
			_index.popAlert("请求参数为空", "参数为空");
		}else{
			//参数
			var params = {
					URL : url_hold,
					CURDATA : curData,
					successCallBack : function(json){
						if(json.result == "0"){							
							_index.ctiInit.AudioCallIds.setHoldCallId(curData.callId);//设置会话保持的callId
							_index.popAlert("通话保持成功", "通话保持");
							funcCallOut(unholdCall,beCallNumber,mainCallOutNumber);
						}else{
							//错误提示
							var errorcodeResultMsg=_index.ErrorcodeSearch.errorcodeSearch(json.result);
					        _index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);
							/*var resultMsg = _index.ctiInit.ErrorcodeSearch.ErrorcodeSearch(json.result,
									"会话保持请求失败，CTI错误码：" + json.result);//查询错误码对应的错误信息
							_index.popAlert(resultMsg, "错误提示");*/			
						}
					},
					errorCallBack : function(XMLHttpRequest, textStatus, errorThrown){
						var errorParams = {//消息请求失败
								"XMLHttpRequest":XMLHttpRequest,
								"textStatus":textStatus,
								"errorThrown":errorThrown
						};						
						_index.popAlert("网络异常，会话保持请求发生失败!失败信息：" + errorParams.textStatus, "请求失败");
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
			_index.popAlert("请求参数为空", "参数为空");
		}else{
			//参数
			var params = {
					URL : url_unhold,
					CURDATA : curData,
					successCallBack : function(json){
						if(json.result == "0"){
							_index.ctiInit.AudioCallIds.setHoldCallId("");//设置会话保持的callId为空值
							_index.popAlert("恢复通话成功", "恢复通话");
						}else{
							//错误提示
							var errorcodeResultMsg=_index.ErrorcodeSearch.errorcodeSearch(json.result);
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
						_index.popAlert("网络异常，会话恢复请求发生失败!失败信息：" + errorParams.textStatus, "请求失败");
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
	
	//获取外呼接口的参数
	var CurData_callOut = function(beCallNumber,mainCallOutNumber){
		var opserialNo = _index.serialNumber.getSerialNumber(); //获取随机数		
		var curData = {
				"opserialNo":opserialNo, //操作序列号
				"callerDigits":mainCallOutNumber, //主叫号码
				"calledDigits":beCallNumber //被叫号码
		};
		
		return curData;
	}
	//获取会话保持的参数
	var CurData_hold = function()
	{			
		var lastCallId = _index.ctiInit.AudioCallIds.getAudioLastCallId();//获取最后接入的语音会话
		var opserialNo = _index.serialNumber.getSerialNumber(); //获取随机数
		if(!lastCallId){
			_index.popAlert("", "通话提醒");
		}else{
			var curData = {
					"opserialNo" : opserialNo, //操作序列号
					"callId" : lastCallId //呼叫标识
			};
			
			return curData;
		}
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
	
	var logRecord = function(){
		//记录日志
		log.setIsExt(true);
		log.setOperator(_index.getUserInfo().staffId);//呼叫操作员工账号
		log.setOperBeginTime(_index.utilJS.getCurrentTime());//操作开始时间
		log.setOperId("004");//操作ID
		log.setSerialNo(_index.CallingInfoMap.getActiveSerialNo());			  	
		log.setServiceTypeId(_index.getUserInfo().getServiceTypeId());// 业务类型ID
		//获取callingInfo
		var activeSerialNo = _index.CallingInfoMap.getActiveSerialNo();
		var callingInfo = _index.CallingInfoMap.get(activeSerialNo);
		log.setContactId(callingInfo.getContactId());
		log.setSubsNumber(callingInfo.getSubsNumber());		
		log.setCallerNo(curData.callerDigits);//主叫号码
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
