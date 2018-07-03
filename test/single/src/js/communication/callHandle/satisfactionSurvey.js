/**
 * 转满意度调查功能
 * @author:likui
 * @time:2016-12-20
 */
define(['Util','../../index/constants/mediaConstants','jquery.tiny'],function (Util,Constants) {
	//客服代表挂机是否转满意度调查流程
	var isToSatisForStaff;
	//客服代表挂机使用满意度调查方式
	var surveyType;
	//是否询问客服代表挂机后是否转语音满意度调查流程
	var isAskForStaff;
	//客服代表挂机语音调查模式下，转短信满意度通话时间阈值
	var satisTimeFlag;
	//客服代表IVR释放转是否转满意度调查流程
	var isToSatisForIVR;
	//用户挂机是否短信转满意度调查流程
	var isToSatisHangByUser;
	//客服代表转指定IVR流程不下发短信满意度
	var specificIDOfIVR;
	//客服代表转指定队列下发短信满意度-- 指定队列
	var specificQueue;
	//客服代表转专席是否下发满意度
	var isToSatisForBox;
	//系统业务类型ID
	var serviceTypeId;
	//接入码
	var accessCode;
	//流程被叫号码的后续码
	var transferCode;
	
	var _index;
	var satisfactionSurveyEvent = function(index) {
		_index = index;
	};
	//解析系统参数
	var parseSystemParam = function(jsonData){		
		for(var i = 0;i<jsonData.beans.length;i++){
			var itemId = jsonData.beans[i].itemId;
			switch (itemId){
            case Constants.ITEMID_TOSATISFORSTAFF:
            	//是否转满意度
            	isToSatisForStaff = jsonData.beans[i].value;
            	break;
            case Constants.ITEMID_SURVEYTYPE:
            	surveyType = jsonData.beans[i].value;
            	break;
            case Constants.ITEMID_ASKFORSTAFF:
            	isAskForStaff = jsonData.beans[i].value;
            	break;
            case Constants.ITEMID_SATISTIMEFLAG:
            	satisTimeFlag = jsonData.beans[i].value;
            	break;
            case Constants.ITEMID_TOSATISFORIVR:
            	isToSatisForIVR = jsonData.beans[i].value;
            	break;
            case Constants.ITEMID_TOSATISHANGBYUSER:
            	isToSatisHangByUser = jsonData.beans[i].value;
            	break;
            case Constants.ITEMID_SPECIFICIDOFIVR:
            	specificIDOfIVR = jsonData.beans[i].value;
            	break;
            case Constants.ITEMID_SPECIFICQUEUE:
            	specificQueue = jsonData.beans[i].value;
            	break;
            case Constants.ITEMID_TOSATISFORBOX:
            	isToSatisForBox = jsonData.beans[i].value;
            	break;
            case Constants.ITEMID_ACCESSCODE:
            	accessCode = jsonData.beans[i].value;
            	break;
            case Constants.ITEMID_TRANSFERCODE:
            	transferCode = jsonData.beans[i].value;
            	break;
			}
		}
	}
	//提供给坐席结束会话时判断是否释放转ivr满意度
	$.extend(satisfactionSurveyEvent.prototype,{
		isTransReleaseSatisfy : function(){
			var satisfyFlag = false;//转IVR满意度标识
			Util.ajax.postJson('front/sh/common!execute?uid=s008',{moduleId:Constants.SATISF_MODULEID,cateGoryId:Constants.SATISF_CATEGORYID},function(jsonData,status){
				if(status){
					//解析挂机满意度系统参数
					parseSystemParam(jsonData);
					getCallingInfo().setSurveyTypeId(surveyType);
					if (isToSatisForStaff == "Y") {//客服代表挂机是否转满意度调查流程
						if (surveyType == "01") {//满意度调查类型 00:不调查 01:语音 02:短信
							if(isAskForStaff == "Y"){//是否弹窗询问话务员转满意度
								if(window.confirm("是否转满意度流程？")){
									satisfyFlag = true;
								}
							}
							else
							{//不弹出则计算通话时长
								//通话时长计算
								var beginStr=getCallingInfo().getAudioBeginTime();//录音开始时间
								var begintime_ms = new Date(Date.parse(beginStr.replace(/-/g,"/"))).getTime(); //解决ie浏览器不new Date(里面的类型不能带'-');
								var endtimeStr=_index.utilJS.getCurrentTime();//结束会话时间
								var endtime_ms = new Date(Date.parse(endtimeStr.replace(/-/g,"/"))).getTime();//结束会话时间
								
								var callTime = (endtime_ms-begintime_ms)/1000;
								//满意度时间阈值-1：转IVR;其他值则与通话时长判断
								if(satisTimeFlag == "-1"||callTime > satisTimeFlag){
									satisfyFlag = true;
								}
							}
						}
					}
				}
			},true);
			return satisfyFlag;
		}
	});	
	//挂机ivr满意度暴露方法
	$.extend(satisfactionSurveyEvent.prototype,{
		satisfaction4ivr : function(){
			var callingInfo = getCallingInfo();
			//转移模式， 0表示释放转，1表示挂起转
			var transType = Constants.TRANSFERMODE_RELEASE;
			var transferParam = {
	    			"typeId" : Constants.SATISFATYPEID,//003-转IVR满意度调查
	    			"callId" : callingInfo.getContactId(),//CTI的会话标识对象
	    			"workCode" : _index.CTIInfo.workNo,//workCode在满意度调查里面没有用到，里面的值是OpId（工号）
	    			"subsNumber" : callingInfo.getSubsNumber(),//服务号码
	    			"workNo" : _index.CTIInfo.workNo,//员工编号
	    			"systemFlg" : Constants.SATISFASYSTEMFLAG//系统标识
	    		};
			var result = _index.callDataUtil.setCallDataAndTransIvr(transType, accessCode, transferCode, transferParam);
			return result;
    		//alert("ivr满意度result=="+result);
		}
	});	
	//获取getCallingInfo
	var getCallingInfo = function(){
		var callId = _index.ctiInit.AudioCallIds.getAudioLastCallId();
    	var strCallId = "" + callId.time + callId.dsn + callId.handle + callId.server;
    	var serialNo = _index.CallingInfoMap.getSerialNoByCallId(strCallId);
    	var callingInfo = _index.CallingInfoMap.get(serialNo);
		return callingInfo;
	}
/*
 * @function 转语音满意度
 * @param transType 转移模式， 0表示释放转，1表示挂起转
 * @param accessCode 约定的自动流程标志
 * @param transferCode 约定的自动流程标志
 * @param transferParam：需要赋值的参数
 * 
 */
	var toIVRSatisfactionSurvey = function(callingInfo){
		//通话时长
		var begintime_ms = new Date(callingInfo.getContactStartTime());//为开始时间
		var endtime_ms = new Date(callingInfo.getContactEndTime());//为挂机时间
		var callTime = (endtime_ms-begintime_ms)/1000;
		//系统业务类型ID
		serviceTypeId = callingInfo.getServiceTypeId();
		//接触编号
		contactId = callingInfo.getContactId();		
		var transType = Constants.TRANSFERMODE_RELEASE;//转移模式， 0表示释放转，1表示挂起转
		var transferParam = {
    			"typeId" : Constants.SATISFATYPEID,//003-转IVR满意度调查
    			"callId" : callingInfo.getCallId(),//CTI的会话标识对象
    			"workCode" : _index.CTIInfo.workNo,//workCode在满意度调查里面没有用到，里面的值是OpId（工号）
    			"subsNumber" : callingInfo.getSubsNumber(),//服务号码
    			"workNo" : _index.CTIInfo.workNo,//员工编号
    			"systemFlg" : Constants.SATISFASYSTEMFLAG//系统标识
    		};
		//是否弹窗询问话务员转满意度
		if(isAskForStaff == "Y"){
			if(window.confirm("是否转满意度流程？")){//是否弹窗询问
	    		//调用工具类转移至IVR
	    		var result = _index.callDataUtil.setCallDataAndTransIvr(transType, accessCode, transferCode, transferParam);
	    		alert("result=="+result);
			}
		}
		else
		{
			//满意度时间阈值-1：转IVR;其他值则与通话时长判断
			if(satisTimeFlag == "-1"||callTime > satisTimeFlag){
				//调用工具类转移至IVR
				var result = _index.callDataUtil.setCallDataAndTransIvr(transType, accessCode, transferCode, transferParam);
	    		alert("result=="+result);
			}
			else
			{
				toSmsSatisfactionSurvey(serviceTypeId,contactId);
			}
		}
	}

/*
 * @function 转短信满意度
 */
	var toSmsSatisfactionSurvey = function (serviceTypeId,contactId){
		/*Util.ajax.postJson('/front/sh/callHandle!execute?uid=satisfySuvery',{"serviceTypeId":serviceTypeId,"contactId":contactId},function(json,status){
			if(status){
			}
		});*/
	}
			
/*
 * @function 满意度调查方法1
 * 适用于话务员挂机和用户挂机
 */
$.extend(satisfactionSurveyEvent.prototype,{
	satisfactionSurvery4Hangup : function(){
		Util.ajax.postJson('front/sh/common!execute?uid=s008',{moduleId:Constants.SATISF_MODULEID,cateGoryId:Constants.SATISF_CATEGORYID},function(jsonData,status){
			if(status){
				//解析系统参数
				parseSystemParam(jsonData);
				var serialNo=_index.CallingInfoMap.getActiveSerialNo();
				//获取callingInfo
				var callingInfo = _index.CallingInfoMap.get(serialNo);
				var contactId = callingInfo.getContactId(); //String	接触编号
				if (callingInfo) {
					// releaseType String 挂机方 0：用户挂机，1：话务员挂机，2：密码验证失败自动挂机，3：其他，4：转IVR挂机
					var releaseType = callingInfo.getReleaseType();
					//系统业务类型ID
					serviceTypeId = callingInfo.getServiceTypeId();
					//话务员挂机
					if (releaseType == Constants.RELEASETYPE_OPERATOR) 
					{
						//客服代表挂机是否转满意度调查流程
						if (isToSatisForStaff == "Y") {
							//满意度调查类型 00:不调查 01:语音 02:短信
							if (surveyType == "01") {
								toIVRSatisfactionSurvey(callingInfo);
							}
							else if (surveyType == "02") {
								toSmsSatisfactionSurvey(serviceTypeId,contactId);
							}
						}
					}
					//用户挂机
					else if (releaseType == Constants.RELEASETYPE_USER) 
					{
						if(isToSatisHangByUser){
							toSmsSatisfactionSurvey(serviceTypeId,contactId);
						}
					}
				}
			}
		},true);
	}
});	

/*
 * @function 满意度调查方法2
 * 适用于客服代表IVR释放转
 */
$.extend(satisfactionSurveyEvent.prototype,{
	satisfactionSurvery4Ivr : function(nowIVRID){
		//getSystemParam();
		var serialNo=_index.CallingInfoMap.getActiveSerialNo();
		//获取callingInfo
		var callingInfo = _index.CallingInfoMap.get(serialNo);
		var contactId = callingInfo.getContactId(); //String	接触编号
		if (!callingInfo) {
			return;
		}
		// releaseType String 挂机方 0：用户挂机，1：话务员挂机，2：密码验证失败自动挂机，3：其他，4：转IVR挂机
		var releaseType = callingInfo.getReleaseType();
		//系统业务类型ID
		serviceTypeId = callingInfo.getServiceTypeId();
			
		//客服代表IVR释放转
		if(releaseType == Constants.RELEASETYPE_TRANSFER_IVR) 
		{
			if(isToSatisForIVR){			
				if(!isContainsID(nowIVRID,specificIDOfIVR)){
					toSmsSatisfactionSurvey(serviceTypeId,contactId);
				}
			}
		}
	}
});

/*
 * @function 满意度调查方法3
 * 适用于客服代表转专席
 */

$.extend(satisfactionSurveyEvent.prototype,{
	satisfactionSurvery4Queue : function(nowQueue){
		//getSystemParam();
		var serialNo=_index.CallingInfoMap.getActiveSerialNo();
		//获取callingInfo
		var callingInfo = _index.CallingInfoMap.get(serialNo);
		var contactId = callingInfo.getContactId(); //String	接触编号
		if (callingInfo) {
			// releaseType String 挂机方 0：用户挂机，1：话务员挂机，2：转IVR挂机
			var releaseType = callingInfo.getReleaseType();
			//系统业务类型ID
			serviceTypeId = callingInfo.getServiceTypeId();
			
			//客服代表转专席
			if(releaseType == Constants.RELEASETYPE_USER)
			{
				/*if(!isToSatisForBox){
					return;
				}
				if(isContainsQueue(nowQueue,specificQueue)){
					toSmsSatisfactionSurvey(serviceTypeId,contactId);
				}*/
			}
		}
		
	}
});

//判断流程ID是否在指定ID中
var isContainsID = function(nowIVRID,specificIDOfIVR){
	if(jQuery.inArray(nowIVRID,SpecificIDOfIVR) != -1){
		return true;
	}
	return false;
}

//判断当前队列ID是否在指定队列中
var isContainsQueue = function(nowQueue,specificQueue){
	if(jQuery.inArray(nowQueue,SpecificIDOfIVR) != -1){
		return true;
	}
	return false;
}

return satisfactionSurveyEvent;
});