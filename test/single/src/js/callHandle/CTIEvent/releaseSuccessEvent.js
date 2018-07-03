/**
 * 301事件
 * 处理释放成功事件(用户释放呼叫时触发)
 */
define(['Util',
        '../../index/constants/mediaConstants','./CTIEventsDeal','../../log/transferOutLog','jquery.tiny'],
        function(Util,Constants,CTIEventsDeal,TransferOutLog) {
	var index;
	var comUI;
	var releaseSuccess = function(indexModule) {
		index = indexModule;
		comUI = index.comMenu.comUI;
	};
	$.extend(releaseSuccess.prototype,{
		 releaseSuccessEvent : function(uselessObj,releaseSuccessEvent) {
			 
			 setTimeout(function () {
				 var status = $(".TimeTilte").text();
				 var callFeature = index.ctiInit.AudioCallIds.callFeature;
				 var IsInCallOut = index.ctiInit.AudioCallIds.getIsInCallOut();
				 if (status == "待接听" && callFeature != "5" && IsInCallOut)
				 {
					 index.clientInfo.timerWait.startTime().end();
					 index.clientInfo.timerWait.startTime().start();
					 index.clientInfo.timerWait.setStatus("空闲");
				 }	
				index.ctiInit.AudioCallIds.setIsInCallOut(false);
				}, 1000);
			 
			var paramsToProvince = {
				"resultCode" : 0,
				"resultMessage" : "释放成功事件（用户释放呼叫时触发）",
				"reserved1" : "",
				"reserved2" : "",
				"reserved3" : ""
			};
			index.postMessage.sendToProvince("releaseSuccessEvent", paramsToProvince);
			 
			 releaseSuccessEventDeal(uselessObj,releaseSuccessEvent);
			 index.CallingInfoMap.setIsFirstAnswerRequest(false);
			 //index.CallingInfoMap.setIsClickTidyStatus("0");
		}
	});
	//获取当前时间
	var releaseSuccessEventDeal = function(uselessObj,releaseSuccessEvent){
		 var callId = releaseSuccessEvent.callId;
		 var callIdStr=""+callId.time+callId.dsn+callId.handle+callId.server;
		 
		 var serialNo=index.CallingInfoMap.getSerialNoByCallId(callIdStr);
		 if(serialNo&&serialNo!=""){
	    	var _callingInfo = index.CallingInfoMap.get(serialNo);
	    	var mediaTypeId = _callingInfo.getMediaType();
	    	//多媒体
		    var channelID=_callingInfo.getChannelID()?_callingInfo.getChannelID():"";
		    var channelName="";
		    var channelInfo = index.contentCommon.getChannelInfo(channelID);
		    if(channelInfo){
		    	channelName = channelInfo.channelName?channelInfo.channelName:"";
		    }
		    var contactId=_callingInfo.getContactId()?_callingInfo.getContactId():"";
		    var subsNumber=_callingInfo.getSubsNumber()?_callingInfo.getSubsNumber():"";//获取受理号码
		    var bindedPhoneNumber=_callingInfo.getBindedPhoneNumber()?_callingInfo.getBindedPhoneNumber():"";
		    var mediaType=_callingInfo.getMediaType()?_callingInfo.getMediaType():"";
		    var mediaTypeName="";
		    var mediaTypeInfo = index.contentCommon.getMediaInfo(mediaType); 
		    var mediaTypeInfo="";
		    
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
			var custStarId = "";
			var custStarName = "";
			    	
	    	if(""!=subsNumber){
	    		//var clientInfoInit = index.CallingInfoMap.get(subsNumber);
	    		//获取客户信息 start
	    		var callInfo = index.CallingInfoMap.get(serialNo);
	    		var clientInfoInit;
	    		if(callInfo){
	    			clientInfoInit = callInfo.getClientInfoMap(subsNumber);
	    		}
	    		//获取客户信息 end
	    		if(clientInfoInit){
	    			//非移动手机号 入接触的 客户地市、客户级别、客户星级 为空
	    			if (RegExp("(^1(3[4-9]|4[7]|5[0-27-9]|7[8]|8[2-478])\\d{8}$)|(^1705\\d{7}$)").test(subsNumber)) {
	    				custCityId2 = clientInfoInit.distrtCode;
		    			custCityIdName2 = clientInfoInit.provNm;//clientInfoInit.cityNm;
		    			custStarId = clientInfoInit.telNumStarCode;//clientInfoInit.starLevel;
		    			custStarName = clientInfoInit.starLevel;	
	    			}else{
	    				custCityId2 = "";
	    				custCityIdName2 = ""; 
	    				custStarId = "";
	    				custStarName = "";
	    			}
	    			custLevelId = "";//clientInfoInit.userLevel;
	    			custLevelName = clientInfoInit.userLevel;//clientInfoInit.userLevelVal;
	    			custBrandId = clientInfoInit.userBrand;
	    			custBrandName = clientInfoInit.brandName?clientInfoInit.brandName:"";//clientInfoInit.userBrandVal;//_index.CallingInfoMap.get("流水号").clientInfoMap["受理号码"]
	    			custCityId = clientInfoInit.provCode;
	    			custCityIdName = clientInfoInit.provNm;	    			
	    			custName = clientInfoInit.userName;    			
	    		}
	    	}
   			//获取当前时间
//	    	var contactEndTime="";
	    	var contactEndTime=index.utilJS.getCurrentTime();
	    	_callingInfo.setContactEndTime(contactEndTime);
	    	if(releaseType!=Constants.RELEASETYPE_OPERATOR && releaseType!=Constants.RELEASETYPE_TRANSFER_IVR){
	    		releaseType=Constants.RELEASETYPE_USER;
	    		_callingInfo.setReleaseType(Constants.RELEASETYPE_USER);
	    	}
	    	if(_callingInfo.callFeature == 6 || _callingInfo.callFeature == 51){//内部呼叫（CTI中）为6 || 内部求助（CTI中）为51
	    		releaseType=Constants.RELEASETYPE_OPERATOR;
	    	}
	    	//获取技能队列 start
	    	var skillNames = "";
		    	if(index.CTIInfo.signInSkills && index.CTIInfo.signInSkills.length){
		    		for(var i=0;i<index.CTIInfo.signInSkills.length;i++){
		    			skillNames  = skillNames +index.CTIInfo.signInSkills[i].skillName;
		    		}
		    	}
	    	//获取技能队列 end
		    //CallingInfo中的技能 start
		    var skillName = _callingInfo.getSkillDesc();
		    //CallingInfo中的技能 end
	    	// 将此值移出，by张志勇
	    	var data = {
	    			"channelId":channelID,
	    			"channelName":channelName,
	    			"serialNo":serialNo,
	    			"subsNumber":subsNumber,
	    			"mediaTypeId":mediaType,
	    			"mediaTypeName":mediaTypeName,
	    			"staffHangup":releaseType,
	    			"hasRecordFile":hasRecordFile,
	    			"surveyTypeId":surveyTypeId,
	    			"toUserId":toUserId,
	    			"toUserName":toUserName,
	    			"contactEndTime":contactEndTime,
	    			"releaseReason":releaseReason,
	    			"fromOrgId":fromOrgId,
	    			//"callType":callType,
	    			//"callType" : callType?callType:index.ctiInit.AudioCallIds.callFeature,
	    			"staffId":staffId,
	    			"firstResponseTime":firstResponseTime,
	    			
	    			"custName":custName,
	    			"custLevelId":custLevelId,
	    			"custLevelName":custLevelName,
	    			"custBrandId":custBrandId,
	    			"custBrandName":custBrandName,
	    			"custCityId":custCityId,
	    			"custCityName":custCityIdName,//touch001中，cct接口为custCityName
	    			"custCityId2":custCityId2,
	    			"custCityName2":custCityIdName2,//touch001中，cct接口为custCityName2
	    			"callerNo":_callingInfo.getCallerNo(),
	    			"dataType":"contact_update",
					 "remark" : "",//备注信息
					 "qcStaffId" : "",//质检代表帐号
					 "userSatisfy2" : "",//二次满意度结果
					 "userSatisfy3" : "",//互联网二次满意度调查结果
					 "staffCityId" : custCityId2,//员工地市编号  同上
					 "startRingTime" : "",//振铃开始时间
					 "callTrace" : "",//呼叫轨迹(ivr相关) 
					 "digitCode" : _callingInfo.getDigitCode()?_callingInfo.getDigitCode():"",//按键路由(ivr相关) 
					 "srFlag" : "",//服务请求创建标记
					 "languageId" : _callingInfo.getLanguageId()?_callingInfo.getLanguageId():"",//语种ID
					 "languageName" : _callingInfo.getLanguageName()?_callingInfo.getLanguageName():"",//语种名称
					 //"callSkillName" : skillNames?skillNames:"",//技能队列描述信息
					 "callSkillName" : skillName?skillName:"",
					 "surveyTypeId" : _callingInfo.getSurveyTypeId()?_callingInfo.getSurveyTypeId():"",//在挂机满意度里赋值
					 "custStarId" : custStarId?custStarId:"",
					 "custStarName" : custStarName?custStarName:""
	    	};
	    	if(mediaType == "5"){
		    	//记录通话结束日志
		    	var tLog = new TransferOutLog(); 
	    		tLog.setIsExt(true);
	    		tLog.setSerialNo(serialNo);
	    		tLog.setContactId(contactId);
	    		tLog.setOperator(staffId);
	    		tLog.setOperBeginTime(contactEndTime);
	    		tLog.setOperId("027");
	    		tLog.setServiceTypeId(_callingInfo.serviceTypeId);
	    		tLog.setStatus("1");
	    		tLog.setCallerNo(_callingInfo.callerNo);
	    		tLog.setAccessCode(_callingInfo.calledNo);
	    		tLog.setSubsNumber(subsNumber);
	    		tLog.setFailId("0");
	    		tLog.setFinalStatus("1");
	    		tLog.logSavingForTransfer(tLog);
	    	}
	    	
	    	//记录外呼的日志
	    	/*var callFeature = index.ctiInit.AudioCallIds.callFeature;
	    	if(callFeature == "1" || callFeature == "5"){
	    		var wLog = new TransferOutLog(); 
	    		wLog.setIsExt(true);
	    		wLog.setSerialNo(serialNo);
	    		wLog.setContactId(contactId);
	    		wLog.setOperator(staffId);
	    		wLog.setOperBeginTime(_callingInfo.audioBeginTime);
	    		wLog.setOperEndTime(contactEndTime);
	    		wLog.setOperId("012");
	    		wLog.setServiceTypeId(_callingInfo.serviceTypeId);
	    		wLog.setStatus("1");
	    		wLog.setCallerNo(_callingInfo.callerNo);
	    		wLog.setAccessCode(_callingInfo.calledNo);
	    		wLog.setSubsNumber(subsNumber);
	    		wLog.setFailId("0");
	    		wLog.setFinalStatus("1");
	    		wLog.logSavingForTransfer(wLog);
	    	}*/
	    	Util.ajax.postJson("front/sh/common!execute?uid=touch001",data,function(json,status){
	    		//存储呼叫类型  会话结束清空start
    			index.ctiInit.AudioCallIds.setCallFeature("");
    			//存储呼叫类型  会话结束清空end
	    		if(status){
	    		}
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
		    	index.ctiInit.AudioCallIds.removeAudioCallId(callId);
		    	var audioSize = index.ctiInit.AudioCallIds.getAudioCallIdsSize();
//		    	var audioSize='0';
		    	var holdCallId  = index.ctiInit.AudioCallIds.getHoldCallId();
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
			    	index.menu.notClick2();
			    	comUI.setAppointedBtnEnabled('callOutBtn',true);
		    	}
		    	// 清空如果callId与holdCallId值相等则清空
		    	if(holdCallId && JSON.stringify(callId) == JSON.stringify(holdCallId)){
		    		index.ctiInit.AudioCallIds.setHoldCallId("");
		    	}
		    	// 清空如果callId与internalHelpCallId值相等则清空
		    	if(internalHelpCallId && JSON.stringify(callId) == JSON.stringify(internalHelpCallId)){
		    		index.ctiInit.AudioCallIds.setInternalHelpCallId("");
		    	}
	    	// 重置为isInConference的值为false无三方通话
		    //index.ctiInit.AudioCallIds.setIsInConference(false);
	    	releaseType = Constants.RELEASETYPE_OPERATOR;//语音的，即便是用户挂段，也需要将队列 销毁，所以该处设置为 坐席挂断，用于销毁队列用。 modify by wwx160457 201608101641
	    }else{
	    	
	    }
		   // var contactId=_callingInfo.getContactId()?getSerialNo.getContactId():"";
		    var serialNo=_callingInfo.getSerialNo()?_callingInfo.getSerialNo():"";
	    	sessionStatus='04';
	    	_callingInfo.setSessionStatus("04");
	    	index.CallingInfoMap.put(serialNo,_callingInfo);
	    	//触发挂机事件，给亚信黄鑫的的接口，必须写在releaseSession之前 2017/03/07
	    	if(mediaTypeId && mediaTypeId == Constants.VOICE_TYPE){
	    		var releaseSuccessData = index.ctiInit.getClientBusiInfo(serialNo);
	    		var callOutType = index.ctiInit.AudioCallIds.getCallOutType();
	    		$.extend(releaseSuccessData,{
	    			'serialNo':serialNo,
	    			'origCustNum':_callingInfo.getOrigCustNum(),//客户原始号码
	    			'callerNo':_callingInfo.getCallerNo(),//主叫号码
					'calledNo':_callingInfo.getCalledNo(),//被叫号码
					'callType':_callingInfo.getCallType(),//呼叫类型，呼入呼出
					"callOutType":callOutType ? callOutType : ""//工单调用外呼的标识
	    		});
		    	index.postMessage.trigger('onReleaseSuccess', releaseSuccessData,'releaseSuccess');
		    	index.ctiInit.AudioCallIds.setCallOutType("");
	    	}
	    	
	    	//调用方法销毁页面
	    	index.queue.releaseSession({"serialNo":serialNo,"staffHangUp":releaseType});
	    }else{
	    	var callingInfoMapStr = JSON.stringify(index.CallingInfoMap);
	    	var data = {
					staffId : index.getUserInfo().staffId,//调用方callparty
					event : '301releaseSuccessEvent',//程序入口callerEntrance
					apiUrl : 'addJSErrorLog',
					inParams : releaseSuccessEvent.callId,//入参inputParams
					eStack : callingInfoMapStr.substring(0,1023)//异常信息resultMsg
			}
			//Util.ajax.postJson('front/sh/media!execute?uid=addJSErrorLog',data,function(json,status){});
		}
	}
	return releaseSuccess;
});
