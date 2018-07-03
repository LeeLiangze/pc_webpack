/**
 * 352事件
 * 强制签出事件
 */
define(['Util',
        '../../index/constants/mediaConstants',
        './CTIEventsDeal',
        'jquery.tiny'], function(Util,Constants,CTIEventsDeal) {
	var index;
	var comUI;
	var SIP_TYPE = "2";
	var forceOut = function(indexModule) {
		index = indexModule;
		comUI = index.comMenu.comUI;
	};
	$.extend(forceOut.prototype,{
		forceOutEvent : function(uselessObj,forceOutEvent) {
			
			 var paramsToProvince = {
					"resultCode" : 0,
					"resultMessage" : "强制签出事件",
					"reserved1" : "",
					"reserved2" : "",
					"reserved3" : ""
			 };
			 index.postMessage.sendToProvince("forceOutEvent", paramsToProvince);
			
			 //index.CallingInfoMap.setSignFlag("0");
			 index.ctiInit.setSignResult("00");
			 comUI.setAppointedInnerText("checkBtn","签出");
			 //comUI.setValue("AgentStatus","CheckOut");
			 index.clientInfo.timerWait.setStatus("未签入");
			 //var arr = ["CallOut","OperatorStatus","CallEnd","ManualWork","RestType","CallHold","CallMute","StatusType","AnswerType","PasswordValidate"]
			 var arr = ["CallOut","freeStatusBtn","endCallBtn","ManualWork","RestType","callHoldBtn","startMuteBtn","StatusType","AnswerType","passWordValidateBtn",'transferBtn']
			 //comUI.disabledButton(arr);// 按钮禁用
			 comUI.setAppointedMoreBtnEnabled(arr,false);
			 index.ctiInit.signOut();
			 comUI.setAppointedBtnEnabled("checkBtn",false);
			 comUI.setAppointedIcont("checkBtn","#ccc");
			 comUI.setAppointedInnerText("checkBtn","未签入");
			 $(".box-icon-qianchuzhuanhuan-copy span").css("color","#ccc");
			 comUI.setAppointedIcont("freeStatusBtn","#cccccc");
	  		 //重置所有的值
			 //index.CallingInfoMap.resetAll();
			// add by wwx160457 for audio business at 201606211131 end
	         index.popAlert("你已被强制签出","强制签出");
	         //获取callingInfoMap的大小
	         var size =  index.CallingInfoMap.size();
	         //当size大于0时,获取集合
	         if(size > 0){
	             var callingMap = index.CallingInfoMap.values();
	             //遍历集合
	             $.each(callingMap,function(v,calling){
	            	 var releaseSuccessEventParam;
	            	 var uselessObj = {};
	            	 if(calling.getSessionStatus() != "04"){
	            		 releaseSuccessEventParam = {   
	            				 	 "eventId":301,
	        		                 "callId":{"time":calling.callIdTime,
	        		                	 		"dsn":calling.callIdDsn,
	        		                	 		"handle":calling.callIdHandle,
	        		                	 		"server":calling.callIdServer
	        		                	 	 }
	            		 				};
		        		  //调用释放成功事件
	            		 releaseSuccessEventDeal(uselessObj,releaseSuccessEventParam); 
		        	   }
	             });
	          }
	         // 停止轮训
			 //index.CallingInfoMap.stopPolling();
	         index.ctiInit.PollingInstance.stopPolling();
			// add by wwx160457 for audio business at 201606211131 start
			// if(SIP_TYPE == index.data.beans[0].audioType){
	         if(SIP_TYPE == index.CTIInfo.audioType){
				 unloginWebVoip();
			 };
		}
	});
	//获取当前时间
	var releaseSuccessEventDeal = function(uselessObj,releaseSuccessEvent){
		 var callId = releaseSuccessEvent.callId;
		 var callIdStr=""+callId.time+callId.dsn+callId.handle+callId.server;
		 
		 var contactId=index.CallingInfoMap.getContactIdByCallId(callIdStr);
		 if(contactId&&contactId!=""){
	    	var _callingInfo = index.CallingInfoMap.get(contactId);
	    	var mediaTypeId = _callingInfo.getMediaType();
	    	//多媒体
		    var channelID=_callingInfo.getChannelID()?_callingInfo.getChannelID():"";
		    var channelName="";
		    //var channelInfo = index.main.getChannelInfo(channelID);
		    var channelInfo = index.contentCommon.getChannelInfo(channelID);
		    if(channelInfo){
		    	channelName = channelInfo.channelName?channelInfo.channelName:"";
		    }
		    var contactId=_callingInfo.getContactId()?_callingInfo.getContactId():"";
		    var subsNumber=_callingInfo.getSubsNumber()?_callingInfo.getSubsNumber():"";
		    var bindedPhoneNumber=_callingInfo.getBindedPhoneNumber()?_callingInfo.getBindedPhoneNumber():"";
		    var mediaType=_callingInfo.getMediaType()?_callingInfo.getMediaType():"";
		    var mediaTypeName="";
		    //var mediaTypeInfo = index.main.getMediaInfo(mediaType); 
		    var mediaTypeInfo = index.contentCommon.getMediaInfo(mediaType); 
		    if(mediaTypeInfo){
		    	mediaTypeName = mediaTypeInfo.mediaTypeName?mediaTypeInfo.mediaTypeName:"";
		    }
		    var releaseType=_callingInfo.getReleaseType()?_callingInfo.getReleaseType():"";
		    var serialNo=_callingInfo.getSerialNo()?_callingInfo.getSerialNo():"";
		    var staffId=index.getUserInfo().staffId?index.getUserInfo().staffId:"";
		    var hasRecordFile=_callingInfo.getHasRecordFile()?_callingInfo.getHasRecordFile():"";
	    	var surveyTypeId=_callingInfo.getSurveyTypeId()?_callingInfo.getSurveyTypeId():"";
	    	var sessionStatus=_callingInfo.getSessionStatus()?_callingInfo.getSessionStatus():"";
	    	var toUserId=_callingInfo.getToUserId()?_callingInfo.getToUserId():"";
	    	var toUserName=_callingInfo.getToUserName()?_callingInfo.getToUserName():"";
	    	var releaseReason=_callingInfo.getReleaseReason()?_callingInfo.getReleaseReason():"";
	    	var fromOrgId=_callingInfo.getFromOrgId()?_callingInfo.getFromOrgId():""; 
	    	var firstResponseTime=_callingInfo.getFirstResponseTime()?_callingInfo.getFirstResponseTime():"";
	    	var callType=_callingInfo.getCallType()?_callingInfo.getCallType():"";
		   	var custLevelId = "";
			var custLevelName = "";
			var custBrandId = "";
			var custBrandName = "";
			var custCityId = "";
			var custCityIdName = "";
			var custName = "";
			var custCityId2 = "";
			var custCityIdName2 = "";
			    	
	    	if(""!=subsNumber){
	    		var clientInfoInit = index.CallingInfoMap.get(subsNumber);
	    		if(clientInfoInit){
	    			custLevelId = clientInfoInit.userLevel;
	    			custLevelName = clientInfoInit.userLevelVal;
	    			custBrandId = clientInfoInit.userBrand;
	    			custBrandName = clientInfoInit.userBrandVal;
	    			custCityId = clientInfoInit.provCode;
	    			custCityIdName = clientInfoInit.provNm;
	    			custCityId2 = clientInfoInit.distrtCode;
	    			custCityIdName2 = clientInfoInit.cityNm;
	    			custName = clientInfoInit.userName;
	    		}
	    	}
   			//获取当前时间
	    	var contactEndTime=index.utilJS.getCurrentTime();
	    	_callingInfo.setContactEndTime(contactEndTime);
	    	if(releaseType!=Constants.RELEASETYPE_OPERATOR && releaseType!= Constants.RELEASETYPE_TRANSFER_IVR){
	    		releaseType=Constants.RELEASETYPE_USER;
	    		_callingInfo.setReleaseType(Constants.RELEASETYPE_USER);
	    	}
	    	// 将此值移出，by张志勇
	    	var data = {
	    			"channelId":channelID,
	    			"channelName":channelName,
	    			"serialNo":serialNo,
	    			"subsNumber":subsNumber,
	    			"mediaTypeId":mediaType,
	    			"mediaTypeName":mediaTypeName,
	    			"staffHangUp":releaseType,
	    			"hasRecordFile":hasRecordFile,
	    			"surveyTypeId":surveyTypeId,
	    			"toUserId":toUserId,
	    			"toUserName":toUserName,
	    			"contactEndTime":contactEndTime,
	    			"releaseReason":releaseReason,
	    			"fromOrgId":fromOrgId,
	    			"callType":callType,
	    			"staffId":staffId,
	    			"firstResponseTime":firstResponseTime,
	    			
	    			"custName":custName,
	    			"custLevelId":custLevelId,
	    			"custLevelName":custLevelName,
	    			"custBrandId":custBrandId,
	    			"custBrandName":custBrandName,
	    			"custCityId":custCityId,
	    			"custCityIdName":custCityIdName,
	    			"custCityId2":custCityId2,
	    			"custCityIdName2":custCityIdName2
	    	};
	    	
	    	Util.ajax.postJson('front/sh/common!execute?uid=session001',{"callId":callIdStr},function(result,status){
	    	}); 
	    	
	    	// 清除callinginfomap中的客户业务信息
	    	// 防止451和301事件同时过来，此处延迟2秒清空。---裴书贤
//	    	setTimeout(function(){
//	    		Util.ajax.postJson('front/sh/common!execute?uid=touch002',data,function(result,status){
//	    		});
//	    	},2000);
	    	/*
			 * 语音部分释放成功事件 by hwx22255
			 * 
			 */
		    if(mediaTypeId && mediaTypeId == Constants.VOICE_TYPE){
		    	//移除当前释放的callId
		    	//index.CallingInfoMap.removeAudioCallId(callId);
		    	index.ctiInit.AudioCallIds.removeAudioCallId(callId);
		    	//var audioSize = index.CallingInfoMap.getAudioCallIdsSize();
		    	var audioSize = index.ctiInit.AudioCallIds.getAudioCallIdsSize();
		    	//var holdCallId  = index.CallingInfoMap.getHoldCallId();
		    	var holdCallId  = index.ctiInit.AudioCallIds.getHoldCallId();
		    	//var internalHelpCallId = index.CallingInfoMap.getInternalHelpCallId();
		    	var internalHelpCallId = index.ctiInit.AudioCallIds.getInternalHelpCallId();
		    	// 如果audioCallIds. getCallIdsSize();
		    	comUI.setAppointedInnerText("startMuteBtn","开始静音"); //add by wwx160457 为了解决当有一通语音会话后，保持后，进行外呼 ，外呼的会话静音后挂断，再恢复第一通会话的时候，静音按钮展示为 取消静音按钮的问题
				// 值为空或者为0，则将语音会话相关的header上按钮变化
		    	if(audioSize == 0){
		    		//start add by wwx160457  为了解决 最后一通会话挂断时，还是 取消静音或者 恢复通话的问题，导致新会话来的时候，无法静音或保持通话，该处必须重置为初始值 start
		    		comUI.setAppointedInnerText("callHoldBtn","通话保持");
					//end add by wwx160457  为了解决 最后一通会话挂断时，还是 取消静音或者 恢复通话的问题，导致新会话来的时候，无法静音或保持通话，该处必须重置为初始值 end
			    	var arr = ["passWordValidateBtn","startMuteBtn","endCallBtn","callHoldBtn","transferBtn"];
			    	comUI.setAppointedMoreBtnEnabled(arr,false);
		    	}
		    	// 清空如果callId与holdCallId值相等则清空
		    	if(holdCallId && JSON.stringify(callId) == JSON.stringify(holdCallId)){
		    		//index.CallingInfoMap.setHoldCallId("");
		    		index.ctiInit.AudioCallIds.setHoldCallId("");
		    	}
		    	// 清空如果callId与internalHelpCallId值相等则清空
		    	if(internalHelpCallId && JSON.stringify(callId) == JSON.stringify(internalHelpCallId)){
		    		index.ctiInit.AudioCallIds.setInternalHelpCallId("");
		    	}
	    	// 重置为isInConference的值为false无三方通话
	    	index.ctiInit.AudioCallIds.setIsInConference(false);
	    	releaseType = Constants.RELEASETYPE_OPERATOR;//语音的，即便是用户挂段，也需要将队列 销毁，所以该处设置为 坐席挂断，用于销毁队列用。 modify by wwx160457 201608101641
	    }else{
	    	
	    }
		    var contactId=_callingInfo.getContactId()?_callingInfo.getContactId():"";
	    	sessionStatus='04';
	    	_callingInfo.setSessionStatus("04");
	    	index.CallingInfoMap.put(contactId,_callingInfo);
	    	//调用方法销毁页面
	    	index.queue.releaseSession({"contactId":contactId,"staffHangUp":releaseType});
	    }else{
	    	var callingInfoMapStr = JSON.stringify(index.CallingInfoMap);
	    	var data = {
					staffId : index.getUserInfo().staffId,//调用方callparty
					event : '301releaseSuccessEvent',//程序入口callerEntrance
					apiUrl : 'addJSErrorLog',
					inParams : releaseSuccessEvent.callId,//入参inputParams
					eStack : callingInfoMapStr.substring(0,1023)//异常信息resultMsg
			}
			Util.ajax.postJson('front/sh/media!execute?uid=addJSErrorLog',data,function(json,status){});
		}
//		 var _b = new Date();
//		 var kkk = _b.getTime()-_a.getTime();
	};
	 var unloginWebVoip = function(){
			var num = 0;
			while(num < 3){// 如果注销失败(包括异常失败)，最多重试3次.
				try{
					var voipUnloginResult = WebVoipControlIF.WebVoipUnlogin();
					if(voipUnloginResult=="0")
				    {
				        num = 3;
				    }
				    if (voipUnloginResult == "1") {
				    	num = num+1;
				    }
				    if (voipUnloginResult == "1") {
				    	num = 3;
				    }
				}catch(e){
					num = num+1;
				}
			}
	 };
	return forceOut;
});