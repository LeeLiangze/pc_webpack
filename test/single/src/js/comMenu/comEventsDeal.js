//此js包含了所有的事件处理的方法
//函数中传入的options代表comMenu
define(['Util',"../index/constants/mediaConstants","../communication/callHandle/satisfactionSurvey",'./callHold/callHold','./callMute/callMute','./busyFree/busyFree'],function(Util,MediaConstants,SatisfactionSurvey,CallHold, CallMute,BusyFree){
	//	解决事件只绑定一次
	var flag= true;
	var index,options;
	var CTIID;
	var ip;
	var port;
	var proxyIP;
	var proxyPort;
	var isDefault;
	var restAouthFlag=true;
	var objClass = function(options){
		options = options;
		index = options.options;//comMenu的options属性,接收传入的参数
		CTIID = index.CTIInfo.CTIId;
		ip  =  index.CTIInfo.IP;
		port = index.CTIInfo.port;
		proxyIP = index.CTIInfo.ProxyIP;
		proxyPort = index.CTIInfo.ProxyPort;
		isDefault = index.CTIInfo.isDefault;
		restAouth();
	} 
	objClass.prototype = {
        	//受理请求
    		acceptRequest:function(options,openModule){
        		this.openModule(options,openModule);
    		},
    		//整理态
    		tidyStatus:function(options,e,openModule){
    			e.stopPropagation();
    			this.openModule(options,openModule);
    		},
    		tidyDropDownStatus:function(options,e,openModule){
    			e.stopPropagation();
//    			tidyDropDownStatus(options);
    			this.openModule(options,openModule);
    		},
    		//示闲
    		freeStatus:function(options,openModule){
    			this.openModule(options,openModule);
    		},
    		//综合接续
    		comprehensiveConnection:function(options,openModule){
    			//获取综合接续按钮是否可以点击,返回值是一个bol值,true代表可以点击,false代表不能点击
    			var state = options.comUI.getAppointedBtnStatus("comprehensiveComBtn");
    			//showDialog中需要配置的参数
    			this.openModule(options,openModule);
    		},
    		//密码验证
    		passwordAuthentification:function(options,openModule){
//    			var config={
//    					title:'密码验证',
//    					url:'js/comMenu/cipherCheck/cipherCheck',
//    			        param:options,
//    			        width:845,
//    			        height:300
//    			}
//    			index.showDialog(config);
    			this.openModule(options,openModule);
    		},
    		//通话保持
    		callHold:function(options,openModule){
    			this.openModule(options,openModule);
    		},
    		//开始静音
    		startMute:function(options,openModule){
    			this.openModule(options,openModule);
    		},
    		//外呼
    		callOut:function(options,openModule){
    			this.openModule(options,openModule);
    		},
    		//发送短信
    		sendMessage:function(options,openModule){
    			var state = options.comUI.getAppointedBtnStatus("sendMessageBtn");
    			this.openModule(options,openModule);
    		},
    		//结束会话
    		endCall:function(options,openModule){

    			var outerHelpStaus=index.ctiInit.AudioCallIds.getOuterHelpStaus();
    			var innerHelpStaus=index.ctiInit.AudioCallIds.getInnerHelpStaus();
    			var serialNo=index.CallingInfoMap.getActiveSerialNo();
				var callingInfo=index.CallingInfoMap.get(serialNo);
				var callFeature=callingInfo.getCallFeature();
				var mediaType=callingInfo.getMediaType();	
				if(!callingInfo){
					return;
				}
				if(callingInfo.getReleaseType()==MediaConstants.RELEASETYPE_USER){
					if(callingInfo.getIvrSatisResult()=="03"){
						index.popAlert("转满意度评价失败");
					}					
					return;
				}else if(callingInfo.getReleaseType()==MediaConstants.RELEASETYPE_TRANSFER_IVR){
					return;
				}
				if(outerHelpStaus=="1"||innerHelpStaus=="1"){
					index.popAlert("当前存在求助会话，请取消求助后才能结束会话","结束会话提示");
					return;
				}else{
					if(callFeature=="0"){
						var satisResult=callingInfo.getIvrSatisResult(); 
						if(satisResult=="03"){							
						}else if(satisResult=="01"){
							index.popAlert("正在等待转ivr满意度流程结果,请稍后!");
							return;
						}else if(satisResult=="02"){
							return;
						}else{
							try{
								_satisfactionSurvey = new SatisfactionSurvey(index);
								var satisflag = _satisfactionSurvey.isTransReleaseSatisfy();
								if(satisflag){
									callingInfo.setIvrSatisResult("01");
									var result=_satisfactionSurvey.satisfaction4ivr();
									if(result=="0"){
										callingInfo.setIvrSatisResult("02");
										callingInfo.setReleaseType(MediaConstants.RELEASETYPE_TRANSFER_IVR);
									}else{
										callingInfo.setIvrSatisResult("03");
										callingInfo.setReleaseType(MediaConstants.RELEASETYPE_OPERATOR); 
										callEnd(options);//转IVR满意流程失败,释放会话
									}
								}else{
									callingInfo.setReleaseType(MediaConstants.RELEASETYPE_OPERATOR); 
									callEnd(options);
								}								
							}catch(e){
								var satisResult_=callingInfo.getIvrSatisResult();
								if(satisResult_!="01"&&satisResult_!="02"&&satisResult_!="03"){
									callingInfo.setReleaseType(MediaConstants.RELEASETYPE_OPERATOR); 
									callEnd(options);
								}else{
									index.popAlert("释放失败");
								}								
							}
						}						
						

				}else{
					callingInfo.setReleaseType(MediaConstants.RELEASETYPE_OPERATOR); 
					callEnd(options);
				}
			}
												
    		
    		},
    		//签出
    		checkOut:function(options,openModule){
    			this.openModule(options,openModule);
    		},
    		//休息
    		rest:function(options,openModule){
    			this.openModule(options,openModule);
    		},
    		//转接专席
    		foregroundTransfer:function(options,openModule){
    			//获取综合接续按钮是否可以点击,返回值是一个bol值,true代表可以点击,false代表不能点击
    			var state = options.comUI.getAppointedBtnStatus("transferBtn");
    			//showDialog中需要配置的参数
//    			var config = {
//    					 title:'转接专席', //弹出窗标题/ngc_dev/src/main/webapp/src/.js
//    	   					// url:'js/communication/huawei/media/signInStatus/signInStatus', //要加载的模块
//    	   					 url:'js/comMenu/comprehensiveCommunication/transferAgent/transferAgent',
//    	   					 param:options, //要传递的参数，可以是json对象
//    	   					 width:900, //对话框宽度
//    	   					 height:600
//    				 }
//    			state&&index.showDialog(config);
    			this.openModule(options,openModule);
    		},
    		openModule:function(options,openModule){//by xxq
    			 var str = openModule[2].replace(/\[(f|F)rame(s|S)erver(h|H)ost\]/, window.location.host);
    			if(openModule[1] || openModule[2]){
    		       if(openModule[1] == "N"){//Tab 
    		    	   if(str.indexOf("http",0)!=(-1)){
    		    		   index.main.createTab(openModule[0],str);
    		    	   }else{
    		    		   index.main.createTab({
        		    		   title:openModule[0],
        		    		   url:openModule[2],
        		    		   businessOptions:{}
        		    		   });
    		    	   }
    	           }else if(openModule[1] == "Y"){//window.open
    	           	window.open(openModule[2]);
    	           }else if(openModule[1] == "P"){//showDialog 
    		            	var str1 = str.split("?");
    		             	var url = str1[0];
    		             	var wh = str1[1].split("&");
    		             	var widths = wh[0].split("=")[1];
    		             	var heights= wh[1].split("=")[1];
    		            	    index.showDialog({
    							title : openModule[0],   //弹出窗标题
    							url :url,//要加载的模块
    							param : {},    //要传递的参数，可以是json对象
    							width : widths,  //对话框宽度
    							height : heights  //对话框高度
    						});
    	           }else if(openModule[1] == "F"){//弹出菜单
    	        	   	switch(openModule[0]){
    	        	   	   case "整理态":
    	        	   		tidyDropDownStatus(options);
    	        	   		  break;
    	        	   	   case "整理态下拉":
    	        	   		tidyStatus(options);
    	        	   		  break;
    	        	   	   case "示闲":
    	        	   		free(options);
    	        	   		   break;
    	        	   	   case "示忙":
    	        	   		free(options);
    	        	   		   break;
    	        	   	   case "开始静音":
    	        	   		startCallMute(options);
    	        	   		   break;
    	        	   	   case "通话保持":
    	        	   		callHold(options);
    	        	   		   break;
    	        	   	   case "签出" :
    	        	   		checkOut(options);
    	        	   		   break;
    	        	   	   case "外呼":
    	        	   		callOut(options);
    	        	   			break;
    	        	   	   case "休息":
    	        	   		rest(options);
    	        	   		   break;
    	        	   	   case "结束会话":
    	        	   		callEnd(options);
    	        	   			break;
    	        	   		 default:
    	        	   		   break;
    	        	   	}
    	           } 
    			}
    		}
	};
	//开始静音和取消静音
	function startCallMute(options){
		var callMute = new CallMute(index);
        var buttonStatus = options.comUI.getAppointedBtnText("startMuteBtn"); 
        var bol = buttonStatus == options.comUI.jsonData.CallMute[0];
        if(bol){
        	callMute.startMute();
        }else{
        	callMute.cancelMute();
        }
    }

	//通话保持和取消保持
	function callHold(options){
		var callHold = new CallHold(index);
        var buttonStatus = options.comUI.getAppointedBtnText("callHoldBtn");
    	var bol = buttonStatus == options.comUI.jsonData.CallHold[0];
    	if(bol){
    		callHold.callHold();
    	}else{
    		callHold.cancelHold();
    	}
	}
	
	//示忙示闲
	function free (options){
		var busyFree = new BusyFree(index);
		var buttonStatus = options.comUI.getAppointedBtnText("freeStatusBtn");
		var bol = buttonStatus == options.comUI.jsonData.OperatorStatus[0];
		//示闲和示忙不同状态下的处理
		if(bol){
			busyFree.showFree();
		}else{
			busyFree.showBusy();
		}
	}
	//结束会话
	function callEnd(options){
//		var index = options.options;
    	var callId = index.ctiInit.AudioCallIds.getAudioLastCallId();
    	var strCallId = "" + callId.time + callId.dsn + callId.handle + callId.server;
    	var serialNo = index.CallingInfoMap.getSerialNoByCallId(strCallId);
    	var callingInfo = index.CallingInfoMap.get(serialNo);
        var sign_url = "";
        if(isDefault == "1"){
        	sign_url = MediaConstants.CCACSURL + proxyIP + ":" + proxyPort + "/ccacs/" + CTIID + "/ws/call/releasecall";
        }else{
        	sign_url = MediaConstants.CCACSURL + ip + ":" + port + "/ccacs/ws/call/releasecall";//跨域直连
        }
        var option = index.serialNumber.getSerialNumber();//获取随机数
    	if(typeof (callId)!= "undefined" && callId != ""){
    		var data = {
    				"callId":callId,
    				"opserialNo":option
    		}
    		if(index.queue.browserName==="IE"){  //注意index的
    			$.ajax({
    	    		url : sign_url,
    	    		type : "post",
    	    		data : JSON.stringify(data),
    	    		async:true,
    	    		crossDomain: true,
    	    		contentType:"application/json; charset=utf-8",
    	    		success : function(json) {
    	    			var resultMsg;
        	    		if(json.result=="0"){
        	    			//index.comMenu.comUI.setAppointedBtnEnabled("callOutBtn",true);
        	    			console.log(json.result+"结束回话成功");
        	    			index.ctiInit.AudioCallIds.removeAudioCallId(callId);
        	    			index.ctiInit.AudioCallIds.clearMuteCallId();
        	    			callingInfo.setReleaseType(MediaConstants.RELEASETYPE_OPERATOR);          	    	
        	    			index.CallingInfoMap.put(serialNo,callingInfo);
        	    			index.ctiInit.AudioCallIds.setIsInConference(false);//设置三方通话标识为false；
    						index.ctiInit.AudioCallIds.setIsConferenceCallerNo("");//设置三方通话的用户号码为空值
    						index.ctiInit.AudioCallIds.setIsConferenceCalledNo("");//设置三方通话的被求助方为空值
        	    			index.popAlert("结束会话请求成功！");
        	    			resultMsg = "结束会话请求成功";
    			        }else{ 
    			        	resultMsg = "结束会话请求失败";
    			        	var errorcodeResultMsg=index.ErrorcodeSearch.errorcodeSearch(json.result);
    			            index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);  
    			        }
        	    		
        	    		var paramsToProvince = {
        						"resultCode" : json.result,
        						"resultMessage" : resultMsg,
        						"reserved1" : "",
        						"reserved2" : "",
        						"reserved3" : ""
        				};
        				index.postMessage.sendToProvince("releasecall", paramsToProvince);
    	         	},
    	         	error : function( XMLHttpRequest, textStatus, errorThrown) {
    	         		index.popAlert("结束会话请求失败！");						
		         	}
    	    	});
			}else{
				$.ajax({
		    		url : sign_url,
		    		type : "post",
		    		data : JSON.stringify(data),
		    		async:true,
		    		crossDomain: true,
		            xhrFields: {
		            	 withCredentials: true
		            },
		    		contentType:"application/json; charset=utf-8",
		    		success : function(json) {
		    			var resultMsg;
	    	    		if(json.result=="0"){
	    	    			//index.comMenu.comUI.setAppointedBtnEnabled("callOutBtn",true);
	    	    			console.log(json.result+"结束回话成功");
	    	    			index.ctiInit.AudioCallIds.removeAudioCallId(callId);
	    	    			index.ctiInit.AudioCallIds.clearMuteCallId();
	    	    			callingInfo.setReleaseType(MediaConstants.RELEASETYPE_OPERATOR);          	    	
	    	    			index.CallingInfoMap.put(serialNo,callingInfo);
	    	    			index.ctiInit.AudioCallIds.setIsInConference(false);//设置三方通话标识为false；
							index.ctiInit.AudioCallIds.setIsConferenceCallerNo("");//设置三方通话的用户号码为空值
							index.ctiInit.AudioCallIds.setIsConferenceCalledNo("");//设置三方通话的被求助方为空值
	    	    			index.popAlert("结束会话请求成功！");
	    	    			resultMsg = "结束会话请求成功";
				        }else{
				        	resultMsg = "结束会话请求失败";
				        	var errorcodeResultMsg=index.ErrorcodeSearch.errorcodeSearch(json.result);
    			            index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);  
				        }
	    	    		
	    	    		var paramsToProvince = {
	    						"resultCode" : json.result,
	    						"resultMessage" : resultMsg,
	    						"reserved1" : "",
	    						"reserved2" : "",
	    						"reserved3" : ""
	    				};
	    				index.postMessage.sendToProvince("releasecall", paramsToProvince);
		         	},
		         	error : function( XMLHttpRequest, textStatus, errorThrown) {
    	         		index.popAlert("结束会话请求失败！");						
		         	}
		    	});
			}
    		
    	}	
	}
	//签出
	function checkOut(options){
//		var index = options.options;
		//首先需要得到签出按钮的状态是签出还是签入
		var buttonStatus = options.comUI.getAppointedBtnText("checkBtn");
		//定义一个bol，true代表签出，fasle代表签入
		var bol = buttonStatus == options.comUI.jsonData.Sign[0];
		if(bol){
			//处理签出的逻辑
			index.ctiInit.signOut();
		}else{
			//处理签入的逻辑
			var signResult = index.ctiInit.getSignResult();
			if("00" == signResult){
				index.popAlert("已是签入状态，不可重复签入。");
				return;
			}
			var signInSkill = index.ctiInit._skillInfos.getSignInSkills();
			//获取技能队列信息数组
			var skillsInfo = index.ctiInit._skillInfos.getSkillInfos();
			//签入标识
			var flag=true;
			var param = {
					"signInSkill":signInSkill,
					"skillsInfo":skillsInfo,
					"flag":flag
			};
			index.showDialog({
				title : '重设技能',   //弹出窗标题
				url : '../callHandle/CTIInit/main/ResetSkill',    //要加载的模块
				param : param,    //要传递的参数，可以是json对象
				width : 840,  //对话框宽度
				height : 580  //对话框高度
			});
		}
	}
	//休息
	function rest(options){
		var index = options.options;
		var buttonStatus = options.comUI.getAppointedBtnText("restBtn"); 
		//定义一个bol值为真代表休息,反之为结束休息
        var bol = buttonStatus == options.comUI.jsonData.Rest[0];
        if (bol) {
        	//休息
        	index.showDialog({
				title : '请选择休息时间',   //弹出窗标题
				url : './rest/rest',    //要加载的模块
				param :index,    //要传递的参数，可以是json对象
				width : 200,  //对话框宽度
				height : 250  //对话框高度
			});
		}else {
			require(['./rest/cancelRest'],function(CancelRest){
				new CancelRest(index);
			});
		}
	}
	//整理态
	function tidyStatus(options){
		//整理态UI下拉控制
		tidyUiDown(options);		
	}
	//整理态
	function tidyDropDownStatus(options){
		//整理态UI下拉控制
		tidyDropDown(options);		
	}
	//整理态UI下拉控制
	function tidyUiDown(options){
		//整理态下拉UI界面的实现
		var uri = "/ws/agent/setagentautoenteridle";
		$('.finishing-state-down',options.$el).toggle();
		//保证事件只绑定一次
		if(flag){
			flag = false;
		}else{
			return;
		}
		$("body").on("click",function(){
			$(".connection-list-icon-zhenglitaizhuanhuan-copy .finishing-state-down").hide();
		});
		$('.action',options.$el).on('click',function(){
			var _this = $(this);
			//定义当前点击的是否为自动,true代表为自动,反之为人工
			var bol = $.trim(_this.text()) == "自动";
			//定义一个bol值,判断当前选项是否已经选中,true代表已经选中,false代表未选中
			var checkedBol = _this.attr('class').indexOf('bg-img') != -1;
			if(bol){
				//当点击自动时候的处理
				index.ctiInit.AudioCallIds.setTidyFinishingState("0");//设置整理态最终状态为自动0
				if(checkedBol){
					index.popAlert('已经选中自动,无需更改');
					return;
				}
				var sign_url = "";
			    if(isDefault == "1"){
			    	sign_url = MediaConstants.CCACSURL + proxyIP + ":" + proxyPort + "/ccacs/" + CTIID + uri;
			    }else{
			    	sign_url = MediaConstants.CCACSURL + ip + ":" + port +"/ccacs" + uri;//跨域直连
			    }
			    var option = index.serialNumber.getSerialNumber();//获取随机数
			    var requestData = {"flag":"0","opserialNo":option};
			    if(index.queue.browserName==="IE"){  //注意index的
			    	 $.ajax({
				    		url : sign_url ,
				    		type : 'post', 
				    		data : JSON.stringify(requestData),
				    		crossDomain: true,
				    		contentType:"application/json; charset=utf-8",
				    		success : function(json) {
					    		if(json.result=="0"){
					    			workTypeUi(_this)	
								}else{
									index.popAlert('切换整理态为自动失败!');
								}
				    		},
				    		 error : function( XMLHttpRequest, textStatus, errorThrown) {
								 var errorParams = {
										 "XMLHttpRequest":XMLHttpRequest,
										 "textStatus":textStatus,
										 "errorThrown":errorThrown
								 };
							 }
			      	  	});
				}else{
					 $.ajax({
				    		url : sign_url ,
				    		type : 'post', 
				    		data : JSON.stringify(requestData),
				    		crossDomain: true,
					        xhrFields: {
					                withCredentials: true
					                },
				    		contentType:"application/json; charset=utf-8",
				    		success : function(json) {
					    		if(json.result=="0"){
					    			workTypeUi(_this)	
								}else{
									index.popAlert('切换整理态为自动失败!');
								}
				    		},
				    		 error : function( XMLHttpRequest, textStatus, errorThrown) {
								 var errorParams = {
										 "XMLHttpRequest":XMLHttpRequest,
										 "textStatus":textStatus,
										 "errorThrown":errorThrown
								 };
							 }
			      	  	});
				}
			   
			}else{
				//当点击人工的时候的处理	
				index.ctiInit.AudioCallIds.setTidyFinishingState("1");//设置整理态最终状态为自动1
				if(checkedBol){
					index.popAlert('已经选中人工,无需更改')
					return;
				}
				var sign_url = "";
			    if(isDefault == "1"){
			    	sign_url = MediaConstants.CCACSURL + proxyIP + ":" + proxyPort + "/ccacs/" + CTIID + uri;
			    }else{
			    	sign_url = MediaConstants.CCACSURL + ip + ":" + port +"/ccacs" + uri;//跨域直连
			    }
			    var option = index.serialNumber.getSerialNumber();//获取随机数
			    var requestData = {"flag":"1","opserialNo":option};
			    if(index.queue.browserName==="IE"){  //注意index的
			    	 $.ajax({
				    		url : sign_url ,
				    		type : 'post', 
				    		data : JSON.stringify(requestData),
				    		crossDomain: true,
				    		contentType:"application/json; charset=utf-8",
				    		success : function(json) {
					    		if(json.result=="0"){
					    			workTypeUi(_this)	
								}else{
									index.popAlert('切换整理态为人工失败!');
								}
				    		},
				    		 error : function( XMLHttpRequest, textStatus, errorThrown) {
								 var errorParams = {
										 "XMLHttpRequest":XMLHttpRequest,
										 "textStatus":textStatus,
										 "errorThrown":errorThrown
								 };
							 }
			      	  	});			
				}else{
					 $.ajax({
				    		url : sign_url ,
				    		type : 'post', 
				    		data : JSON.stringify(requestData),
				    		crossDomain: true,
					        xhrFields: {
					                withCredentials: true
					                },
				    		contentType:"application/json; charset=utf-8",
				    		success : function(json) {
					    		if(json.result=="0"){
					    			workTypeUi(_this)	
								}else{
									index.popAlert('切换整理态为人工失败!');
								}
				    		},
				    		 error : function( XMLHttpRequest, textStatus, errorThrown) {
								 var errorParams = {
										 "XMLHttpRequest":XMLHttpRequest,
										 "textStatus":textStatus,
										 "errorThrown":errorThrown
								 };
							 }
			      	  	});			
				}
			   		
			}
		});	
		$('.answer',options.$el).on('click',function(){
			var _this = $(this);
			//定义当前点击的是否为人答,true代表为人答,反之为人答
			var bol = $.trim(_this.text()) == "人答";
			//定义一个bol值,判断当前选项是否已经选中,true代表已经选中,false代表未选中
			var checkedBol = _this.attr('class').indexOf('bg-img') != -1;
		    var sign_url = "";
		    if(isDefault == "1"){
		    	sign_url = MediaConstants.CCACSURL + proxyIP + ":" + proxyPort + "/ccacs/" + CTIID + "/ws/agent/autoanswer";
		    }else{
		    	sign_url = MediaConstants.CCACSURL + ip + ":" + port + "/ccacs/ws/agent/autoanswer";//跨域直连
		    }
		    var option = index.serialNumber.getSerialNumber();//获取随机数
			if(bol){
				//当点击人答时候的处理
				if(checkedBol){
					index.popAlert('已经选中人答,无需更改');
					return;
				}
				var data={isAutoAnswer:"false","opserialNo":option};
				if(index.queue.browserName==="IE"){  //注意index的
					$.ajax({
			    		url : sign_url ,
			    		type : 'post', 
			    		data : JSON.stringify(data),
			    		crossDomain: true,
			    		contentType:"application/json; charset=utf-8",
			    		success : function(json) {
				    		if(json.result=="0"){
				    			answerTypeUi(_this);	
							}else{
								index.popAlert('设置人答模式失败');
							}
			    		},
			    		error : function( XMLHttpRequest, textStatus, errorThrown) {
							 var errorParams = {
									 "XMLHttpRequest":XMLHttpRequest,
									 "textStatus":textStatus,
									 "errorThrown":errorThrown
							 };
						 }
		      	  	});
				}else{
					$.ajax({
			    		url : sign_url ,
			    		type : 'post', 
			    		data : JSON.stringify(data),
			    		crossDomain: true,
				        xhrFields: {
				                withCredentials: true
				                },
			    		contentType:"application/json; charset=utf-8",
			    		success : function(json) {
				    		if(json.result=="0"){
				    			answerTypeUi(_this);	
							}else{
								index.popAlert('设置人答模式失败');
							}
			    		},
			    		error : function( XMLHttpRequest, textStatus, errorThrown) {
							 var errorParams = {
									 "XMLHttpRequest":XMLHttpRequest,
									 "textStatus":textStatus,
									 "errorThrown":errorThrown
							 };
						 }
		      	  	});
				}
			}else{
				//当点击自答的时候的处理	
				if(checkedBol){
					index.popAlert('已经选中自答,无需更改');
					return;
				}
				var data={isAutoAnswer:"true","opserialNo":option};
				if(index.queue.browserName==="IE"){  //注意index的
					$.ajax({
						url : sign_url,
			    		type : 'post', 
			    		data : JSON.stringify(data),
			    		crossDomain: true,
			    		contentType:"application/json; charset=utf-8",
			    		success : function(json) {
			    			if(json.result=="0"){
			    				answerTypeUi(_this);	
			    			}else{
			    				index.popAlert('设置自答模式失败');
			    			}
			    		},
			    		error : function( XMLHttpRequest, textStatus, errorThrown) {
			    			var errorParams = {
			    					"XMLHttpRequest":XMLHttpRequest,
			    					"textStatus":textStatus,
			    					"errorThrown":errorThrown
			    			};
			        	}
					});	
				}else{
					$.ajax({
						url : sign_url,
			    		type : 'post', 
			    		data : JSON.stringify(data),
			    		crossDomain: true,
				        xhrFields: {
				                withCredentials: true
				                },
			    		contentType:"application/json; charset=utf-8",
			    		success : function(json) {
			    			if(json.result=="0"){
			    				answerTypeUi(_this);	
			    			}else{
			    				index.popAlert('设置自答模式失败');
			    			}
			    		},
			    		error : function( XMLHttpRequest, textStatus, errorThrown) {
			    			var errorParams = {
			    					"XMLHttpRequest":XMLHttpRequest,
			    					"textStatus":textStatus,
			    					"errorThrown":errorThrown
			    			};
			        	}
					});	
				}
						
			}			
		});
	}
	//空闲转整理态
	function tidyDropDown(){
		//index.CallingInfoMap.setIsClickTidyStatus(true);
		var status = $(".TimeTilte").text();
		if(status != "空闲" && status!="通话中"){
			index.popAlert("当前状态不能调整为整理态");
			return;
		}
		if (status == "空闲") {
			index.CallingInfoMap.setIsClickTidyStatus("1");
			var sign_url = "";
	        if(isDefault == "1"){
	        	sign_url = MediaConstants.CCACSURL + proxyIP + ":" + proxyPort + "/ccacs/" + CTIID + "/ws/agent/setagentstate";
	        }else{
	        	sign_url = MediaConstants.CCACSURL + ip + ":" + port + "/ccacs/ws/agent/setagentstate";//跨域直连
	        }
	        var option = index.serialNumber.getSerialNumber();//获取随机数

			//示闲下的处理
			var data={
	    			"state":"5",
	    			"opserialNo":option
	    	};
			if(index.queue.browserName==="IE"){  //注意index的
				$.ajax({
		    		url : sign_url ,
		    		type : 'post', 
		    		data : JSON.stringify(data),
		    		crossDomain:true,
		    		contentType:"application/json; charset=utf-8",
		    		success : function(json) {
			    		if(json.result=='0'){
			    			index.popAlert("设置整理态成功");
			    			index.clientInfo.timerWait.startTime().start();
		         		}else{
		         			index.popAlert("设置整理态失败");
		         		}
		    		},
		    		error : function(XMLHttpRequest, textStatus, errorThrown){
		    			var errorParams = {
		            			"XMLHttpRequest":XMLHttpRequest,
		            			"textStatus":textStatus,
		            			"errorThrown":errorThrown
		               };
		    		}
		    	});
			}else{
				$.ajax({
		    		url : sign_url ,
		    		type : 'post', 
		    		data : JSON.stringify(data),
		    		crossDomain:true,
		    		xhrFields:{
		    			withCredentials:true
		    		},
		    		contentType:"application/json; charset=utf-8",
		    		success : function(json) {
			    		if(json.result=='0'){
			    			index.popAlert("设置整理态成功");
			    			index.clientInfo.timerWait.startTime().start();
		         		}else{
		         			index.popAlert("设置整理态失败");
		         		}
			    		
		    		},
		    		error : function(XMLHttpRequest, textStatus, errorThrown){
		    			var errorParams = {
		            			"XMLHttpRequest":XMLHttpRequest,
		            			"textStatus":textStatus,
		            			"errorThrown":errorThrown
		               };
		    		}
		    	});
			}
		}
		if (status == "通话中") {
			index.CallingInfoMap.setIsClickTidyStatus("2");
			var sign_url = "";
		    if(isDefault == "1"){
		    	sign_url = MediaConstants.CCACSURL + proxyIP + ":" + proxyPort + "/ccacs/" + CTIID + "/ws/agent/setagentautoenteridle";
		    }else{
		    	sign_url = MediaConstants.CCACSURL + ip + ":" + port +"/ccacs" + "/ws/agent/setagentautoenteridle";//跨域直连
		    }
		    var option = index.serialNumber.getSerialNumber();//获取随机数
		    var requestData = {"flag":"0","opserialNo":option};
		    if(index.queue.browserName==="IE"){  //注意index的
		    	 $.ajax({
			    		url : sign_url ,
			    		type : 'post', 
			    		data : JSON.stringify(requestData),
			    		crossDomain: true,
			    		contentType:"application/json; charset=utf-8",
			    		success : function(json) {
				    		if(json.result=="0"){
				    			//workTypeUi(_this);
				    			index.popAlert('当前会话切换整理态成功!');
							}else{
								index.popAlert('切换整理态为自动失败!');
							}
			    		},
			    		 error : function( XMLHttpRequest, textStatus, errorThrown) {
							 var errorParams = {
									 "XMLHttpRequest":XMLHttpRequest,
									 "textStatus":textStatus,
									 "errorThrown":errorThrown
							 };
						 }
		      	  	});
			}else{
				 $.ajax({
			    		url : sign_url ,
			    		type : 'post', 
			    		data : JSON.stringify(requestData),
			    		crossDomain: true,
				        xhrFields: {
				                withCredentials: true
				                },
			    		contentType:"application/json; charset=utf-8",
			    		success : function(json) {
				    		if(json.result=="0"){
				    			//workTypeUi(_this);
				    			index.popAlert('当前会话切换整理态成功!');
							}else{
								index.popAlert('切换整理态为自动失败!');
							}
			    		},
			    		 error : function( XMLHttpRequest, textStatus, errorThrown) {
							 var errorParams = {
									 "XMLHttpRequest":XMLHttpRequest,
									 "textStatus":textStatus,
									 "errorThrown":errorThrown
							 };
						 }
		      	  	});
			}
		}
		
	}
	//自动/人工
	function workTypeUi(_this){
		$('.action').find('img').remove();
		$('.action').removeClass('bg-img');
		$('.action').find('img').addClass('check-public');
		$('.action').find('span').removeClass('font-color');
		_this.addClass('bg-img');
		_this.find('img').removeClass('check-public');
		_this.find('span').addClass('font-color');	
		_this.prepend("<img src='src/assets/img/comMenu/active-checked.png'>");
	}
	//自答/人答
	function answerTypeUi(_this){
		$('.answer').find('img').remove();		
		$('.answer').removeClass('bg-img');
		$('.answer').find('img').addClass('check-public');
		$('.answer').find('span').removeClass('font-color');
		_this.addClass('bg-img');
		_this.find('img').removeClass('check-public');
		_this.find('span').addClass('font-color');	
		_this.prepend("<img src='src/assets/img/comMenu/active-checked.png'>");
	}
	
	//外呼
	function callOut(options){
		//判断是否在播放录音，若正在播放录音，则不能外呼
		var playingRecord = index.ctiInit.getPlayingRecord();
		if(playingRecord){
			index.popAlert("请先停止放音，再进行外呼");
			return;
		}
		//判断缓存是否有主叫号码数据,没有则从CTIInfo中获取
		if (index.ctiInit.AudioCallIds.getCallerPhoneNums().length < 1) {
			if(index.CTIInfo.outgoingNo){
				// 获取主叫号码
				var outgoingNo = index.CTIInfo.outgoingNo;
				var callerNums = outgoingNo.split(",");
				index.ctiInit.AudioCallIds.setCallerPhoneNums(callerNums);
			}
		}
		
		//获取最后接入的语音会话
		var lastCallId = index.ctiInit.AudioCallIds.getAudioLastCallId();
		//获取被保持的语音会话id
		var holdCallId = index.ctiInit.AudioCallIds.getHoldCallId();
		
		if(lastCallId){
			if(holdCallId){
				if(JSON.stringify(lastCallId) == JSON.stringify(holdCallId)){
					//加载外呼页
					var config = {
						title:'外呼', //弹出窗标题
						url:'./callOut/callOut', //要加载的模块
						width:640, //对话框宽度
						height:270 //对话框高度
					}
					index.showDialog(config);
				}else{
					index.popAlert("当前座席有正在进行的会话，无法进行外呼。");
				}
			}else{
				index.popAlert("当前座席有正在进行的会话，无法进行外呼。");
			}
		}else{
			//加载外呼页
			var config = {
				title:'外呼', //弹出窗标题
				url:'./callOut/callOut', //要加载的模块
				width:640, //对话框宽度
				height:270 //对话框高度
			}
			index.showDialog(config);
		}
	}
	
	/*//获取系统参数，并放入缓存
	function getSysParamData(options){
		Util.ajax.postJson("front/sh/common!execute?uid=s007",{"itemId":"102001003"},function(json,status){
			if(status){
				var callerNums = new Array();
				if (!json.bean.value) {
					return "请配置主叫号码系统参数。";
				}
				callerNums.push({"callerNo":json.bean.value});
				index.ctiInit.AudioCallIds.setCallerPhoneNums(callerNums);
				return "";
			}else{
				return "查询主叫号码失败。";
			}
		},true);
	}*/
	//是否允许休息标志值获取
	var restAouth=function(){
		var data={
				"itemId":'061'
		};
		$.getJSON("../../data/comMenu/restAouth.json",data,function(json,status){
			if(status){
				if(json.bean.value=="N"){
					restAouthFlag=false;
				}else{
					
				}
			}
		});
	}
	return objClass;
})
