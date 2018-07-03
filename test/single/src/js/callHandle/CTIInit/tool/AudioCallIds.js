/**
 * Created by wangziyou
 * audioCallIds缓存
 * update by zzy 2017/1/14
 */
define(function(){
	
	/*
	 * 数组，尚未释放的语音会话id集合，新的语音会话放在数组的后面
	 */
	var audioCallIds = [];
		
	/*
	 * 被保持的语音会话id
	 */
	var holdCallId;
	
	/*
	 * 被静音的会话id
	 */
	var muteCallId;
	
	/*
	 * 内部求助产生的新会话id
	 */
	var internalHelpCallId;
	
	/*
	 * 外呼产生的新会话id
	 */
	var calloutCallId;
	
	/*
	 * 是否在旁听，true为是，false为不是，默认为false
	 */
	var isInSupervise = false;
	
	/*
	 * 被旁听座席的workno值
	 */
	var supervisedWorkno;
	
	/*
	 * 被旁听座席的staffId值
	 */
	var supervisedStaffId;
	
	/*
	 * 被插入座席的workno值
	 */
	var insertedWorkno;
	
	/*
	 * 被插入座席的staffId值
	 */
	var insertedStaffId;
	
	/*
	 * 当前座席是否插入会话，true为是，false为不是，默认为false
	 */
	var isInInsert = false;
	
	/*
	 * 是否在进行三方通话，true为是，false为不是
	 */
	var isInConference = false;
	
	/*
	 * 外呼被叫号码数组，最多保持5个号码，按照时间先后顺序，如果达到5个，则最老的将会被新的手机号码挤出去
	 */
	var calloutPhoneNums = [];
	
	/*
	 * 外呼 主叫号码数组
	 */
	var callerPhoneNums = [];
	
	/*
	 * 三方通话被叫号码
	 */
	var isConferenceCalledNo;
	
	/*
	 * 三方通话的主叫号码
	 */
	var isConferenceCallerNo;
	/*
	 * 外部求助的标识；
	 * 0：默认值
	 * 1：成功	 
	 */
	var outerHelpStaus = "0";
	/*
	 * 内部求助的标识；
	 * 0：默认值
	 * 1：成功	 
	 */
	var innerHelpStaus = "0";
	
	/*
	 * 外部求助保持会话的callid
	 */
	var outerHelpHoldCallId;
	
	/*
	 * 外部求助呼出的号码
	 */
	var outerHelpCallOutNo;
	
	
	/*
	 * 当前在外呼状态下
	 */
	var isInCallOut;
	
	/*
	 * 旁听开始时间
	 */
	var superviseStartTime;
	
	/*
	 * 插入开始时间
	 */
	var insertStartTime;
	
	/**
	 * 呼叫类型 : 呼入-0;外呼-1;内部呼叫-2;内部求助-3;外部求助-0; 4G管家转外呼-5 
	 */
	var callFeature = "";
	
	/**
	 * 原始主叫
	 */
	var orgCallerNo = "";
	/**
	 * 原始被叫
	 */
	var orgCalledNo = "";
	/**
	 * 外呼类型 : 接续栏外呼-1;互联网会话时外呼-2;工单调用外呼-3
	 */	
	var callOutType = "";
	
	/**
	 * 整理态最终状态 : 0是自动，1是人工
	 */	
	var tidyFinishingState = "";
	
    var AudioCallIds = function(index){
    	
    	return {
			// 添加新的语音会话
			pushAudioNewCallId:function(callId){        	
				audioCallIds.push(callId); 
	        },
	        
	        //  获取最后接入的语音会话
	        getAudioLastCallId:function ()       
	        {       
	            return audioCallIds[audioCallIds.length - 1];       
	        },
	        //  获取倒数第二个语音会话id值
	        getlastSecondCallId:function ()       
	        {       
	            return audioCallIds[audioCallIds.length - 2];       
	        },
	        //移除指定语音会话
	        removeAudioCallId:function (callId)       
	        {       
    			var index = -1;
    			for(var prop in audioCallIds)       
	            {       
	                if(JSON.stringify(audioCallIds[prop]) == JSON.stringify(callId))       
	                {       
	                	index = prop; 
	                	break;
	                }       
	            }       
    			if (index > -1) {
    				audioCallIds.splice(index, 1);
    			};   
	        },       
	               
	        // 获取语音会话数组的元素的数目。0表示没有元素
	        getAudioCallIdsSize:function ()       
	        {       
	            return  audioCallIds.length;       
	        },       
	               
	        // 当前语音会话是否被保持： true 为被保持，false为没有被保持
	        isLastCallIdHold:function ()       
	        {    
	        	var lastCallId =  getAudioLastCallId();
	        	if (holdCallId && lastCallId && holdCallId == lastCallId) {
	        		return true;
	        	} else {
	        		return false;
	        	}
	        },       
	            
	        // 设置被保持的语音会话id
	        setHoldCallId:function (callId)       
	        {
	        	holdCallId = callId;       
	        },       
	               
	        // 获取被保持的语音会话id
	        getHoldCallId:function ()       
	        {       
	            return holdCallId;       
	        },
	        // 设置整理态最终状态
	        setTidyFinishingState:function (finishingState)       
	        {
	        	tidyFinishingState = finishingState;       
	        },       
	        
	        // 获取整理态最终状态
	        getTidyFinishingState:function ()       
	        {       
	        	return tidyFinishingState;       
	        },
	        
	        // 设置被静音的会话id
	        setMuteCallId:function (callId)       
	        {
	        	muteCallId = callId;       
	        },       
	               
	        // 获取被静音的会话id
	        getMuteCallId:function ()       
	        {       
	            return muteCallId;       
	        },       
	               
	        // 清空被静音的会话id
	        clearMuteCallId:function ()       
	        {       
	            muteCallId = "";       
	        },       
	               
	        // 设置内部求助的会话id
	        setInternalHelpCallId:function (callId)       
	        {       
	        	internalHelpCallId = callId;       
	        }, 
	        // 获取内部求助的会话id
	        getInternalHelpCallId:function ()       
		    {       
	        	return internalHelpCallId;         
		    },
		    
		    // 设置外呼会话id
		    setCalloutCallId:function (callId)       
	        {       
		    	calloutCallId = callId;       
	        }, 
	        // 获取外呼会话id
	        getCalloutCallId:function ()       
		    {       
	        	return calloutCallId;         
		    },
		    
		    // 设置是否在旁听
		    setIsInSupervise:function (flag)       
	        {       
		    	isInSupervise = flag;       
	        }, 
	        // 获取是否在旁听的值
	        getIsInSupervise:function ()       
		    {       
	        	return isInSupervise;         
		    },
		    
		    // 设置被旁听者的CTI侧工号
		    setSupervisedWorkno:function (workno)       
	        {       
		    	supervisedWorkno = workno;       
	        }, 
	        // 获取被旁听者的CTI侧工号
	        getSupervisedWorkno:function ()       
		    {       
	        	return supervisedWorkno;         
		    },
		    
		    // 设置被旁听者的staffId
		    setSupervisedStaffId:function (staffId)       
	        {       
		    	supervisedStaffId = staffId;       
	        }, 
	        // 获取被旁听者的staffId
	        getSupervisedStaffId:function ()       
		    {       
	        	return supervisedStaffId;         
		    },
		    
		    // 设置被插入者的CTI侧工号
		    setInsertedWorkno:function (workno)       
	        {       
		    	insertedWorkno = workno;       
	        }, 
	        // 获取被插入者的CTI侧工号
	        getInsertedWorkno:function ()       
		    {       
	        	return insertedWorkno;         
		    },
		    
		    // 设置被插入者的staffId
		    setInsertedStaffId:function (staffId)       
	        {       
		    	insertedStaffId = staffId;       
	        }, 
	        // 获取被插入者的staffId
	        getInsertedStaffId:function ()       
		    {       
	        	return insertedStaffId;         
		    },
		    
		    // 设置是否在插入
		    setIsInInsert:function (flag)       
	        {       
		    	isInInsert = flag;       
	        }, 
	        // 获取是否在插入的值
	        getIsInInsert:function ()       
		    {       
	        	return isInInsert;         
		    },
		    
		    // 设置是否在进行三方通话
		    setIsInConference:function (flag)       
	        {       
		    	isInConference = flag;       
	        }, 
	        // 获取是否在进行三方通话
	        getIsInConference:function ()       
		    {       
	        	return isInConference;         
		    },
		    
		    // 设置外呼 主叫号码数组
		    setCallerPhoneNums:function (callerNums)       
	        {       
		    	callerPhoneNums = callerNums;       
	        }, 
	        // 获取外呼 主叫号码数组
	        getCallerPhoneNums:function ()       
		    {       
	        	return callerPhoneNums;         
		    },
		    
		    // 设置外呼被叫号码数组（存放被叫号码，最后的号码，放在最前面，如存在重复的号码，删除之前）
		    setCalloutPhoneNums:function (calledNums)       
	        {       
		    	var index = -1;
    			for(var prop in calloutPhoneNums)       
	            {       
	                if(calloutPhoneNums[prop] == calledNums)       
	                {       
	                	index = prop; 
	                	break;
	                }       
	            }       
    			if (index > -1) {
    				calloutPhoneNums.splice(index, 1);
    			}
    			else if (calloutPhoneNums.length >= 5) {
		    		calloutPhoneNums.pop()
		    	} 
		    	calloutPhoneNums.unshift(calledNums);
	        }, 
	        // 获取外呼被叫号码数组
	        getCalloutPhoneNums:function ()       
		    {       
	        	return calloutPhoneNums;         
		    }, 
		    //设置三方通话的被叫号码
		    setIsConferenceCalledNo:function(calledNo){
		    	isConferenceCalledNo = calledNo;
		    },
		    //获取三方通话的被叫号码
		    getIsConferenceCalledNo:function(){
		    	return isConferenceCalledNo;
		    },
		    //设置三方通话的主叫号码
		    setIsConferenceCallerNo:function(callerNo){
		    	isConferenceCallerNo = callerNo;
		    },
		    //获取三方通话的主叫号码
		    getIsConferenceCallerNo:function(){
		    	return isConferenceCallerNo;
		    },
		    //设置外部求助的标识
		    setOuterHelpStaus:function(staus){
		    	outerHelpStaus = staus;
		    },
		    //获取外部求助的标识
		    getOuterHelpStaus:function(){
		    	return outerHelpStaus;
		    },
		    //设置内部求助的标识
		    setInnerHelpStaus:function(innerHelp){
		    	innerHelpStaus = innerHelp;
		    },
		    //获取内部求助的标识
		    getInnerHelpStaus:function(){
		    	return innerHelpStaus;
		    },
		    //设置外部求助会话保持的callId
		    setOuterHelpHoldCallId:function(callId){
		    	outerHelpHoldCallId = callId;
		    },
		    //获取外部求助会话保持的callId
		    getOuterHelpHoldCallId:function(){
		    	return outerHelpHoldCallId;
		    },
		    //设置外部求助呼出的号码
		    setOuterHelpCallOutNo:function(callOutNo){
		    	outerHelpCallOutNo = callOutNo;
		    },
		    //获取外部求助呼出的号码
		    getOuterHelpCallOutNo:function(){
		    	return outerHelpCallOutNo;
		    },
		    //当前在外呼状态下 true 是 false 否
		    setIsInCallOut:function(status){
		    	isInCallOut = status;
		    },
		    //当前在外呼状态下
		    getIsInCallOut:function(){
		    	return isInCallOut;
		    },
		    //设置旁听开始时间
		    setSuperviseStartTime:function(time){
		    	superviseStartTime = time;
		    },
		    //获取旁听开始时间
		    getSuperviseStartTime:function(){
		    	return superviseStartTime;
		    },
		    //设置插入开始时间
		    setInsertStartTime:function(time){
		    	insertStartTime = time;
		    },
		    //获取插入开始时间
		    getInsertStartTime:function(){
		    	return insertStartTime;
		    },
		    //设置呼叫类型
		    setCallFeature:function(callFeature1){
		    	this.callFeature = callFeature1;
		    },
		    //获取呼叫类型
		    getCallFeature:function(){
		    	return this.callFeature;
		    },
		    //设置原始主叫
		    setOrgCallerNo:function(orgCallerNo1){
		    	this.orgCallerNo = orgCallerNo1;
		    },
		    //获取原始主叫
		    getOrgCallerNo:function(){
		    	return this.orgCallerNo;
		    },
		    //设置原始被叫
		    setOrgCalledNo:function(orgCalledNo1){
		    	this.orgCalledNo = orgCalledNo1;
		    },
		    //获取原始被叫
		    getOrgCalledNo:function(){
		    	return this.orgCalledNo;
		    },
		    //设置外呼类型
		    setCallOutType:function(callOutType){
		    	this.callOutType = callOutType;
		    },
		    //获取外呼类型
		    getCallOutType:function(){
		    	return this.callOutType;
		    },
	        // 重置所有值为初始值
		    resetAll:function ()       
		    {       
		    	audioCallIds = [];   
		    	holdCallId = "";
		    	muteCallId = "";
		    	internalHelpCallId = "";
		    	calloutCallId = "";
		    	isInSupervise = false;
		    	supervisedWorkno = "";
		    	supervisedStaffId = "";
		    	insertedWorkno = "";
		    	insertedStaffId = "";
		    	isInInsert = false;
		    	isInConference = false;
		    	isConferenceCalledNo = "";
		    	isConferenceCallerNo = "";
		    	outerHelpStaus = "0";
		    	outerHelpHoldCallId = "";
		    	outerHelpCallOutNo="";
		    	isInCallOut = false;
		    	superviseStartTime = "";
		    	insertStartTime = "";		    	
		    },
		    
//		    //清空呼叫类型
//		    resetCallFeature:function(){
//		    	callFeature = "";
//		    }
    	}
    };
    return AudioCallIds
});



 
