/**
 * 351-5事件
 * 座席状态变更事件-整理/工作
 */
define(['Util','./CTIEventsDeal','../../log/managementLog','jquery.tiny'], function(Util,CTIEventsDeal,managementLog) {
	var index;
	var comUI;
	var agentStateChange5 = function(indexModule) {
		index = indexModule;
		comUI = index.comMenu.comUI;
	};
	$.extend(agentStateChange5.prototype,{
		agentStateChangeEvent5 : function(uselessObj,agentStateChangeEvent) {
			
			 var paramsToProvince = {
					"resultCode" : 0,
					"resultMessage" : "坐席状态变更事件-整理",
					"reserved1" : index.getUserInfo().staffId,
					"reserved2" : "5",
					"reserved3" : "整理"
			 };
			 index.postMessage.sendToProvince("agentStateChangeEvent5", paramsToProvince);
			
			 //add by huangpu，当坐席设置自动整理态时，停止监听收到的是整理态，这时候，再点击旁听，会导致状态异常，所以整理态也需要做这块逻辑
			 if (typeof $("#auditBtn_transferComm").val() != "undefined" 
				 && index.ctiInit.AudioCallIds.getIsInSupervise() == true)
			 {
				$("#auditBtn_transferComm").val("旁听");
				index.popAlert("停止旁听成功", "旁听");
			 }
			 
			 if(index.ctiInit.AudioCallIds.getIsInSupervise()) {
				 index.ctiInit.AudioCallIds.setIsInSupervise(false);
				 // 记录日志 start
                 var activeSerialNo = index.CallingInfoMap.getActiveSerialNo();
                 var callingInfo = index.CallingInfoMap.get(activeSerialNo);
                 var operStatus = "1"; //操作状态 0 失败 1 成功
//                 var failId = "0";
                 
                 var beginT = index.ctiInit.AudioCallIds.getSuperviseStartTime();
                 var endT = index.utilJS.getCurrentTime();
                 var destOperator = index.ctiInit.AudioCallIds.getSupervisedStaffId();
//                 var duration = (Date.parse(endT) - Date.parse(beginT))/1000;
                 var duration = (Date.parse(endT.replace('-','/').replace('-','/')) - Date.parse(beginT.replace('-','/').replace('-','/')))/1000;
                 var mLog = new managementLog(); 
                 mLog.setIsExt(true);
                 mLog.setOperator(index.getUserInfo()['staffId']);
                 mLog.setOperBeginTime(beginT);
                 mLog.setOperEndTime(endT);
                 mLog.setOperDuration(duration);
                 mLog.setOperId("018");
                 mLog.setDestOperator(destOperator);
                 mLog.setStatus(operStatus);
                 mLog.setServiceTypeId(index.CTIInfo.serviceTypeId);
                 mLog.setSerialNo(callingInfo && callingInfo.serialNo ? callingInfo.serialNo : "");
                 mLog.setContactId(callingInfo && callingInfo.contactId ? callingInfo.contactId : "");
                 mLog.setCallerNo(callingInfo && callingInfo.callerNo ? callingInfo.callerNo : "");
                 mLog.setSubsNumber(callingInfo && callingInfo.subsNumber ? callingInfo.subsNumber : "");
//                 mLog.setReasonId(failId);
                 mLog.logSavingForTransfer(mLog);
                 // 记录日志 end
			 }
			 
			 if (typeof $("#insertBtn_transferComm").val() != "undefined"
				 && index.ctiInit.AudioCallIds.getIsInInsert() == true)
			 {
				$("#insertBtn_transferComm").val("插入");
				index.popAlert("停止插入成功", "插入");
			 }
			 
			 if(index.ctiInit.AudioCallIds.getIsInInsert()) {
				 index.ctiInit.AudioCallIds.setIsInInsert(false);
				// 记录日志 start
                 var activeSerialNo = index.CallingInfoMap.getActiveSerialNo();
                 var callingInfo = index.CallingInfoMap.get(activeSerialNo);
                 var operStatus = "1"; //操作状态 0 失败 1 成功
//                 var failId = "0";
                 
                 var beginT = index.ctiInit.AudioCallIds.getInsertStartTime();
                 var endT = index.utilJS.getCurrentTime();
                 var destOperator = index.ctiInit.AudioCallIds.getInsertedStaffId();
//                 var duration = (Date.parse(endT) - Date.parse(beginT))/1000;
                 var duration = (Date.parse(endT.replace('-','/').replace('-','/')) - Date.parse(beginT.replace('-','/').replace('-','/')))/1000;
                 var mLog = new managementLog(); 
                 mLog.setIsExt(true);
                 mLog.setOperator(index.getUserInfo()['staffId']);
                 mLog.setOperBeginTime(beginT);
                 mLog.setOperEndTime(endT);
                 mLog.setOperDuration(duration);
                 mLog.setOperId("019");
                 mLog.setDestOperator(destOperator);
                 mLog.setStatus(operStatus);
                 mLog.setServiceTypeId(index.CTIInfo.serviceTypeId);
                 mLog.setSerialNo(callingInfo && callingInfo.serialNo ? callingInfo.serialNo : "");
                 mLog.setContactId(callingInfo && callingInfo.contactId ? callingInfo.contactId : "");
                 mLog.setCallerNo(callingInfo && callingInfo.callerNo ? callingInfo.callerNo : "");
                 mLog.setSubsNumber(callingInfo && callingInfo.subsNumber ? callingInfo.subsNumber : "");
//                 mLog.setReasonId(failId);
                 mLog.logSavingForTransfer(mLog);
                 // 记录日志 end
			 }
			
			 var status = $(".TimeTilte").text();
			 index.clientInfo.timerWait.startTime().end();
			 index.clientInfo.timerWait.setStatus("整理态");
			 index.comMenu.comUI.setAppointedBtnEnabled("callOutBtn",true);
			// index.clientInfo.timerWait.setStatus('整理态');
			 var flag = $('#tidying_Mark').val();
			 if(flag == "true"){
				 $('#tidying_Mark').val("flase"); 
			 }else if(flag == "flase"){
				 $('#tidying_Mark').val("true");
			 }
			 var tidyingTime = index.CTIInfo.arrageDuration;
			 /*if(status == "空闲"){
				 //tidyingTime ="-1" ;
				 $('#tidying_model').val("1");
			 }*/
			 var isClickTidyStatus=index.CallingInfoMap.getIsClickTidyStatus();
			 if (isClickTidyStatus=="1"||isClickTidyStatus=="2") {
				//tidyingTime ="-1" ;
				 index.clientInfo.timerWait.startTime().start();
			 }else{
				 index.clientInfo.timerWait.startTime().countDown(parseInt(tidyingTime),function(e){
					 index.clientInfo.timerWait.changeState("整理态");
				 });
			 }
			 /*if(tidyingTime == "-1"){
				 index.clientInfo.timerWait.startTime().start();
			 }else{
				 index.clientInfo.timerWait.startTime().countDown(parseInt(tidyingTime),function(e){
					 index.clientInfo.timerWait.changeState("整理态");
				 });
			 }*/
		}
	})
	return agentStateChange5;
});