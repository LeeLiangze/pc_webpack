/**
 * 二次拨号
 */
define(['../../index/constants/mediaConstants',
		'../../../tpl/comMenu/secCallOut/secCallPanel.tpl',
		'../../../assets/css/comMenu/secCallOut/secCallPanel.css'],
		function(MediaConstants,secCallOutTpl){
	var _index;
	var objClass = function(index){
		_index = index;
		this.$el = $(secCallOutTpl);
		eventInit.call(this);
	    this.content = this.$el;
	}
	
	//事件开始
	var eventInit = function(){
		//输入框聚焦和失去焦点的动作
		this.$el.on('focus','#callOutNum',function(e){
			e.stopPropagation();
			if($.trim($(this).val()) == "请输入分机号码"){
				$(this).val('');
			}
			
		});		
		
		//处理拨号盘
		this.$el.on('click','.call-number-num',function(e){
			e.stopPropagation();
			var callNum = $.trim($(this).text());
			if($(this).parents('.sec-call-out-box').find('.call-out-show-number-panpel').val() == "请输入分机号码"){
				$(this).parents('.sec-call-out-box').find('.call-out-show-number-panpel').val("");//清空输入框
			}
			$(this).parents('.sec-call-out-box').find('.call-out-show-number-panpel').val(function(_index,oldValue){
				return oldValue + callNum;//数字拨号字符
			});
		});
		
		//呼出逻辑
		this.$el.on('click','.call-out-call',function(e){
			e.stopPropagation();
			//获取输入的分机号码
			var dtmfDigits = $.trim($(this).parents('.sec-call-out-box').find('#callOutNum').val());
			if(!dtmfDigits){
				_index.popAlert("输入分机号码不能为空。","错误提示");
				return;
			}
			if(!isDtmfDigits(dtmfDigits)){
				_index.popAlert("请输入正确的分机号码。","错误提示");
				return;
			}
			//选中的为呼叫按钮
			var flag = $(this).attr("class");
			if(flag == "call-out-call"){
				var uri = 'ws/call/agentsenddtmf';
				var url = Url(_index,uri);
				var curData = CurData(_index,dtmfDigits);
				var config = CTIRequest(_index,url, curData);
				//发起二次呼叫
				$.ajax(config);
			}			
		});
		
		//取消逻辑
		this.$el.on('click','.call-out-cancel',function(e){
			e.stopPropagation();
			_index.destroyDialog();//关闭弹窗
		});
	}	
	
	//CTI接口请求参数配置
	var CTIRequest = function(_index,URL,CURDATA){
		var config;
		if(_index.queue.browserName==="IE"){ 
			config = {
					url : URL,
					timeout : 20000,//默认为 20000。如果超时时长不是 20000，则需要传递该参数。
					type : 'post',
					data : JSON.stringify(CURDATA),//请求参数
					contentType : "application/json; charset=utf-8",
					dataType : "json",
					crossDomain : true,//跨域
					async : true,//默认值为 true 异步。如果需要同步，则需要传递该参数为false
					success : function(json){//成功的回调函数
						//0 二次呼叫成功
						if(json.result == "0"){
							_index.popAlert("二次呼叫请求成功，请等待响应","通话提醒");
							_index.destroyDialog();//关闭弹窗	      		    			
						}else{
							//错误提示
							var errorcodeResultMsg = _index.ErrorcodeSearch.errorcodeSearch(json.result);
					        _index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);
							//_index.popAlert("二次外呼请求失败,调用CTI失败，错误码：" + json.result,"错误提示");   						
						}
					},
					error : function(jqXHR,textStatus,errorThrown){//失败的回调函数
						var errorParams = {
								"XMLHttpRequest":jqXHR,
								"textStatus":textStatus,
								"errorThrown":errorThrown
						};
						_index.popAlert("网络异常，二次外呼请求失败,错误信息：" + errorParams.textStatus, "二次外呼请求失败");
					}
			};
		}else{
			config = {
					url : URL,
					timeout : 20000,//默认为 20000。如果超时时长不是 20000，则需要传递该参数。
					type : 'post',
					data : JSON.stringify(CURDATA),//请求参数
					contentType : "application/json; charset=utf-8",
					dataType : "json",
					crossDomain : true,//跨域
					xhrFields : {withCredentials: true},//支持跨域发送cookies
					async : true,//默认值为 true 异步。如果需要同步，则需要传递该参数为false
					success : function(json){//成功的回调函数
						//0 二次呼叫成功
						if(json.result == "0"){
							_index.popAlert("二次呼叫请求成功，请等待响应","通话提醒");
							_index.destroyDialog();//关闭弹窗
						}else{
							//错误提示
							var errorcodeResultMsg = _index.ErrorcodeSearch.errorcodeSearch(json.result);
					        _index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);
							//_index.popAlert("二次外呼请求失败,调用CTI失败，错误码：" + json.result,"错误提示");
						}
					},
					error : function(jqXHR,textStatus,errorThrown){//失败的回调函数
						var errorParams = {
								"XMLHttpRequest":jqXHR,
								"textStatus":textStatus,
								"errorThrown":errorThrown
						};
						_index.popAlert("网络异常，二次外呼请求失败,错误信息：" + errorParams.textStatus, "二次外呼请求失败");
					}
			};
		}
		return config;
	}
	
	//获取CTI接口的参数：分机号码
	var CurData = function(_index,dtmfDigits){
		var opserialno = _index.serialNumber.getSerialNumber();
		var curData = {
			"opserialNo":opserialno,
			"dtmfDigits":dtmfDigits
			};
			
		return curData;
	}
	
	//获取CTI接口的URL
	var Url = function(_index, uri){
		//设置CTIURL参数
		var ctiInfo = _index.CTIInfo;
		var ccacsUrl = MediaConstants.CCACSURL;
		var isDefault = ctiInfo.isDefault;
		var url = "";
		if(isDefault == "1"){//此情况走nginx代理
			var CTIID = ctiInfo.CTIId;		
			var proxyIP = ctiInfo.ProxyIP;
			var proxyPort = ctiInfo.ProxyPort;
			url = ccacsUrl + proxyIP + ":" + proxyPort + "/ccacs/" + CTIID + "/" + uri;
		}else{//跨域直连
			var ip = ctiInfo.IP;
			var port = ctiInfo.port;
			url = ccacsUrl + ip + ":" + port + "/ccacs/" + uri;
		}
		
		return url;
	}
	
	//判读输入的分机号码为数字且长度不超过24
	var isDtmfDigits = function(phoneNum){
		if (phoneNum.length == 0) {
			return false;
		}
		if (phoneNum.length > 24) {
			return false;
		}
       var myreg = /^[0-9]*$/;
       if(!myreg.test(phoneNum))
       {
           return false;
       }
       return true;
	}
	return objClass;
})
