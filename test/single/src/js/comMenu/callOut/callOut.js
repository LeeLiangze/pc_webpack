define(['Util','../../index/constants/mediaConstants','../../log/transferOutLog','../../../tpl/comMenu/callOut/callOut.tpl','../../../assets/css/comMenu/callOut/callOut',],function(Util,MediaConstants,TransferOutLog,callOutTpl){
	var objClass = function(index){	
		var failId;// 添加日志时,失败原因码
		var status_log;// 添加日志时,操作状态
		//var serialNo;
		var operId;//操作ID
		var mainCallOutNumber;//主叫号码
		var beCallNumber;//被叫号码
		var _index = index;
		var callOutStr = callOutTpl;
		var callOutTemplate = Util.hdb.compile(callOutStr);
		
		//初始化主叫号码下拉框
		var callcallerData = _index.ctiInit.AudioCallIds.getCallerPhoneNums();
		//初始化被叫号码下拉框
		var calledData = _index.ctiInit.AudioCallIds.getCalloutPhoneNums();
		//配置主叫号码和被叫号码
		var dataSource = {
			callOutMainNumber:callcallerData,
			sendNumber:calledData
		};
		
		var callOutHtml = callOutTemplate(dataSource);
		this.$el = $(callOutHtml);
		//优化体验
		this.$el.on("click",function(){
			$(this).find(".call-out-more-number-common").addClass("hid");
		})
		var callFeature = _index.ctiInit.AudioCallIds.callFeature;//外呼类型是不是5-4G转外呼
		if(calledData.length>=1 && callFeature == "5"){
			this.$el.find('.call-out-show-number-panpel').val(calledData[0]);
			//_index.ctiInit.AudioCallIds.setCallFeature("");
		}
		//下拉选择的ui控制
		this.$el.on({
			'click':function(e){
				e.stopPropagation();
				$(this).parents('.call-out-number-box-common').find('.call-out-more-number-common').toggleClass('hid');
			}
		},'.call-out-choice-common');	
		this.$el.on({
			'focus':function(e){
				e.stopPropagation();
				if($.trim($(this).val()) == '请选择被叫号码'){
					$(this).val('');
				}
				$(this).parents('.call-out-number-box').find('.call-out-more-number').show();				
			},
			'blur':function(e){
				e.stopPropagation();
				setTimeout($.proxy(function(){
					$(this).parents('.call-out-number-box').find('.call-out-more-number').hide();
				},this),200)
			}
		},'.call-out-show-number-panpel')
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
				if($(this).attr('target-id')){
					$(this).parents('.call-out-number-box').find('.call-out-show-number-panpel').val($.trim($(this).text()));
				}else{
				$(this).parents('.call-out-number-box').find('.call-out-show-number-common').text($.trim($(this).text()));
				}
				$(this).parent().addClass('hid');
			}
		},'.call-out-number');
		//处理拨号盘
		this.$el.on('click','.call-number-num',function(e){
			e.stopPropagation();
			var callNum = $.trim($(this).text());
			if($(this).parents('.call-out-box').find('.call-out-show-number-panpel').val() == "请选择被叫号码"){
				$(this).parents('.call-out-box').find('.call-out-show-number-panpel').val("");
			}
			$(this).parents('.call-out-box').find('.call-out-show-number-panpel').val(function(_index,oldValue){
				return oldValue + callNum;
			})
		})	  		
		
		//enter start
		setTimeout(function(){
				$('#calledNumInput',this.$el).focus();
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
		
		//呼出逻辑处理
		this.$el.on('click','.call-out-call',function(e){
			_index.CallingInfoMap.setIsClickTidyStatus("0");//初始化整理态状态值
			operId = "012";
			e.stopPropagation();
			//获取主叫号码
			mainCallOutNumber = $.trim($(this).parents('.call-out-box').find('.call-out-show-number').text());
			//获取被叫号码
			beCallNumber = $.trim($(this).parents('.call-out-box').find('.call-out-show-number-panpel').val());
			
			if(!mainCallOutNumber || !beCallNumber || mainCallOutNumber =="请选择主叫号码" || beCallNumber =="请选择被叫号码"){
				_index.popAlert("主叫号码、被叫号码 不能为空。","错误提示");
				return;
			}
			var isPhoneNumber = isPhone(beCallNumber);
			if(!isPhoneNumber){
				_index.popAlert("请输入正确的电话号码。","错误提示");
				return;
			}
			// 选中的button是呼叫按钮时
			var flag = $(this).attr("class");
			if(flag == "call-out-call"){
				var curData = {
						"calledDigits":beCallNumber, //被叫号码
						"callerDigits":mainCallOutNumber //主叫号码
				};
				var resultMsg = "";
				var call_id = {
						"callerDigits":mainCallOutNumber,
						"calledDigits":beCallNumber
				};
				//设置参数
				var CTIID=_index.CTIInfo.CTIId;
				var ip=_index.CTIInfo.IP;
				var port=_index.CTIInfo.port;
				var proxyIP=_index.CTIInfo.ProxyIP;
				var proxyPort=_index.CTIInfo.ProxyPort;
				var isDefault=_index.CTIInfo.isDefault;
				var url="";
		        if(isDefault=="1"){//此种情况走nginx代理
		       	 	url = MediaConstants.CCACSURL + proxyIP + ":" + proxyPort + "/ccacs/"+CTIID+"/ws/call/callout";
		        }else{                                 
		       	 	url = MediaConstants.CCACSURL+ip+":"+port+"/ccacs/ws/call/callout"; //跨域直连
		        }

		        _index.ctiInit.AudioCallIds.setIsInCallOut(true);
		        _index.comMenu.comUI.setAppointedBtnEnabled("callOutBtn",false);//点击外呼按钮后,将外呼按钮置灰
		        _index.destroyDialog();
//		        _index.clientInfo.initCustInfo(beCallNumber);
		        //需要判断当前队列区是否为空,不为空不去查
		        if(_index.queue.getListSize()==0){
		        	 _index.clientInfo.initCustInfo(beCallNumber);
		        }		      		       
		        //$('.uiTab .uiTabHead .uiTabItemHead').eq(1).show();
		        //_index.main.currentPanel.glbTab.switchTab(1);
		        _index.main.currentPanel.glbTab.items[1].setTab({hideTab:false});
		        _index.clientInfo.trigger("acceptNumberChange",beCallNumber);
		        _index.main.currentPanel.glbTab.switchTab(1);
		        //$('.uiTab .uiTabHead .uiTabItemHead').eq(1).click();
		        if(_index.queue.browserName==="IE"){  //注意index的
					//IE逻辑
			        $.ajax({
			        	url : url,
			        	type : 'post',  
			        	data :  JSON.stringify(call_id), 
			        	contentType:"application/json; charset=utf-8",
			        	crossDomain: true,
//				        xhrFields: {
//				        	withCredentials: true
//				        },
		                success : function(json){
		                	failId = json.result;
		                	//serialNo=_index.CallingInfoMap.getActiveSerialNo();
		                	if(json.result == "0"){
		                		//存储呼叫类型 start
		                		if(!_index.ctiInit.AudioCallIds.callFeature){
		                			_index.ctiInit.AudioCallIds.setCallFeature("1");//外呼1
		                			var status = $(".TimeTilte").text();//多媒体通话中时，不改变状态
		                			if(status  != "通话中"){
		                			_index.clientInfo.timerWait.startTime().end();	
		                			_index.clientInfo.timerWait.startTime().start();
		                			_index.clientInfo.timerWait.setStatus("待接听");
		                			}
		                		}
	               				 //存储呼叫类型 end
		                		_index.popAlert("外呼请求成功，请等待响应。","通话提醒");
								_index.ctiInit.AudioCallIds.setCalloutCallId(json.callId);
								_index.ctiInit.AudioCallIds.setCalloutPhoneNums(beCallNumber);
			//					_index.destroyDialog();								
								resultMsg = "呼叫请求成功";
								status_log = "1";
				    			logInfo.call(this);
		                	}else{
//		                		resultMsg = _index.ctiInit.ErrorcodeSearch.ErrorcodeSearch(json.result,"外呼请求失败,CTI错误码：" + json.result);
		                		_index.ctiInit.AudioCallIds.setIsInCallOut(false);
		                		_index.comMenu.comUI.setAppointedBtnEnabled("callOutBtn",true);//外呼失败,外呼按钮可用
//		                		_index.popAlert(resultMsg,"错误提示");
		                		var errorcodeResultMsg=_index.ErrorcodeSearch.errorcodeSearch(json.result);
	    			            _index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);  
								status_log = "0";
				    			logInfo.call(this);
		                	}
		                	
		                	var paramsToProvince = {
		        					"resultCode" : json.result,
		        					"resultMessage" : resultMsg,
		        					"reserved1" : "",
		        					"reserved2" : "",
		        					"reserved3" : ""
		        			};
//		        			_index.postMessage.sendToProvince("callOut", paramsToProvince);
		                	_index.postMessage.trigger("callOut", paramsToProvince, true);
		                	
		                },
		                error : function( XMLHttpRequest, textStatus, errorThrown) {
		                	_index.ctiInit.AudioCallIds.setIsInCallOut(false);
		                	_index.comMenu.comUI.setAppointedBtnEnabled("callOutBtn",true);//外呼失败,外呼按钮可用
		                	var errorParams = {
									"XMLHttpRequest":XMLHttpRequest,
									"textStatus":textStatus,
									"errorThrown":errorThrown
							};
		            		console.log(url,call_id,errorParams,"网络异常，查询呼叫信息失败");
		            		var paramsToProvince = {
		        					"resultCode" : -1,
		        					"resultMessage" : "网络异常，外呼请求失败",
		        					"reserved1" : "",
		        					"reserved2" : "",
		        					"reserved3" : ""
		        			};
//		        			_index.postMessage.sendToProvince("callOut", paramsToProvince);
		                	_index.postMessage.trigger("callOut", paramsToProvince, true);
		            	}
			        });
				}else{
					//其他浏览器逻辑
			        $.ajax({
			        	url : url,
			        	type : 'post',  
			        	data :  JSON.stringify(call_id), 
			        	contentType:"application/json; charset=utf-8",
			        	crossDomain: true,
				        xhrFields: {
				        	withCredentials: true
				        },
		                success : function(json){
		                	failId = json.result;
		                	//serialNo=_index.CallingInfoMap.getActiveSerialNo();
		                	if(json.result == "0"){
		                		//存储呼叫类型 start
		                		if(!_index.ctiInit.AudioCallIds.callFeature){
		                			_index.ctiInit.AudioCallIds.setCallFeature("1");//外呼1
		                			var status = $(".TimeTilte").text();//多媒体通话中时，不改变状态
		                			if(status  != "通话中"){
		                			_index.clientInfo.timerWait.startTime().end();	
		                			_index.clientInfo.timerWait.startTime().start();
		                			_index.clientInfo.timerWait.setStatus("待接听");
		                			}
		                		}
	               				 //存储呼叫类型 end
		                		_index.popAlert("外呼请求成功，请等待响应。","通话提醒");
								_index.ctiInit.AudioCallIds.setCalloutCallId(json.callId);
								_index.ctiInit.AudioCallIds.setCalloutPhoneNums(beCallNumber);
			//					_index.destroyDialog();								
								resultMsg = "呼叫请求成功";
								status_log = "1";
				    			logInfo.call(this);
		                	}else{
//		                		resultMsg = _index.ctiInit.ErrorcodeSearch.ErrorcodeSearch(json.result,"外呼请求失败,CTI错误码：" + json.result);
		                		_index.ctiInit.AudioCallIds.setIsInCallOut(false);
		                		_index.comMenu.comUI.setAppointedBtnEnabled("callOutBtn",true);//外呼失败,外呼按钮可用
//		                		_index.popAlert(resultMsg,"错误提示");
		                		var errorcodeResultMsg=_index.ErrorcodeSearch.errorcodeSearch(json.result);
	    			            _index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);  
								status_log = "0";
				    			logInfo.call(this);
		                	}
		                	
		                	var paramsToProvince = {
		        					"resultCode" : json.result,
		        					"resultMessage" : resultMsg,
		        					"reserved1" : "",
		        					"reserved2" : "",
		        					"reserved3" : ""
		        			};
//		        			_index.postMessage.sendToProvince("callOut", paramsToProvince);
		        			_index.postMessage.trigger("callOut", paramsToProvince, true);
		                	
		                },
		                error : function( XMLHttpRequest, textStatus, errorThrown) {
		                	_index.ctiInit.AudioCallIds.setIsInCallOut(false);
		                	_index.comMenu.comUI.setAppointedBtnEnabled("callOutBtn",true);//外呼失败,外呼按钮可用
		                	var errorParams = {
									"XMLHttpRequest":XMLHttpRequest,
									"textStatus":textStatus,
									"errorThrown":errorThrown
							};
		            		console.log(url,call_id,errorParams,"网络异常，外呼请求失败");
		            		var paramsToProvince = {
		        					"resultCode" : -1,
		        					"resultMessage" : "网络异常，外呼请求失败",
		        					"reserved1" : "",
		        					"reserved2" : "",
		        					"reserved3" : ""
		        			};
//		        			_index.postMessage.sendToProvince("callOut", paramsToProvince);
		                	_index.postMessage.trigger("callOut", paramsToProvince, true);
		            	}
			        });
				}					
			}
			
		})
		//取消逻辑处理
		this.$el.on('click','.call-out-cancel',function(e){
			e.stopPropagation();
			_index.destroyDialog();
			_index.ctiInit.AudioCallIds.setCallFeature("");
			//重置主叫号码和被叫号码
			//$(this).parents('.call-out-box').find('.call-out-show-number-common').text('请选择主叫号码');
			//$(this).parents('.call-out-box').find('.call-out-show-number-panpel').val('请选择被叫号码');
		})
		function isPhone(phoneNumber){
			if(phoneNumber.length==0){
				return false;
			}
			var myreg = /^(([0-9]{11})|([0-9]{5,6}))$/;
			if(!myreg.test(phoneNumber)){
				return false;
			}
			return true;
		}
		this.content = this.$el;
		
		//添加日志  
		var  logInfo= function(){
			//var contactId=callingInfo.contactId;//接触编号
			var operator=_index.getUserInfo()['staffId'];//呼叫操作员工帐号
			var operBeginTime=_index.utilJS.getCurrentTime();//呼叫操作开始时间
			var serviceTypeId=_index.CTIInfo.serviceTypeId;
			//var operEndTime=_index.utilJS.getCurrentTime();//操作结束时间
			var tLog = new TransferOutLog(); 
	        tLog.setIsExt(true);
	        //tLog.setSerialNo(serialNo);
	        //tLog.setContactId(serialNo);
	        tLog.setOperator(operator);
	        tLog.setOperBeginTime(operBeginTime);
	        tLog.setOperId(operId);
	        tLog.setServiceTypeId(serviceTypeId);
	        //tLog.setOperEndTime(operEndTime);
	        tLog.setStatus(status_log);
	        tLog.setCallerNo(mainCallOutNumber);
	        tLog.setAccessCode(beCallNumber);
	        tLog.setSubsNumber(beCallNumber);
	        tLog.setFailId(failId);
	        tLog.setFinalStatus(status_log);
	        tLog.logSavingForTransfer(tLog);
		}
	}
	return objClass;	
})