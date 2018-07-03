/**
 * 351-4事件
 * 351-6事件
 * 座席状态变更事件-空闲
 * 
 */
define(['Util','./CTIEventsDeal','../../log/managementLog','jquery.tiny'], function(Util,CTIEventsDeal,managementLog) {
	var index;
	var comUI;
	var agentStateChange46 = function(indexModule) {
		index = indexModule;
		comUI = index.comMenu.comUI;
	};
	$.extend(agentStateChange46.prototype,{
		agentStateChangeEvent46 : function(uselessObj,agentStateChangeEvent) {
			
			 var paramsToProvince = {
					"resultCode" : 0,
					"resultMessage" : "坐席状态变更事件-空闲",
					"reserved1" : index.getUserInfo().staffId,
					"reserved2" : "4",
					"reserved3" : "空闲"
			 };
			 index.postMessage.sendToProvince("agentStateChangeEvent46", paramsToProvince);
			 
			 var status = $(".TimeTilte").text();
			 if (status != "整理态")
			 {
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
//	                 var failId = "0";
	                 
	                 var beginT = index.ctiInit.AudioCallIds.getSuperviseStartTime();
	                 var endT = index.utilJS.getCurrentTime();
	                 var destOperator = index.ctiInit.AudioCallIds.getSupervisedStaffId();
//	                 var duration = (Date.parse(endT) - Date.parse(beginT))/1000;
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
//	                 mLog.setReasonId(failId);
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
//	                 var failId = "0";
	                 
	                 var beginT = index.ctiInit.AudioCallIds.getInsertStartTime();
	                 var endT = index.utilJS.getCurrentTime();
	                 var destOperator = index.ctiInit.AudioCallIds.getInsertedStaffId();
//	                 var duration = (Date.parse(endT) - Date.parse(beginT))/1000;
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
//	                 mLog.setReasonId(failId);
	                 mLog.logSavingForTransfer(mLog);
	                 // 记录日志 end
				 }
			 }
			 
			 var arr = ['freeStatusBtn','restBtn'];
			 comUI.setAppointedMoreBtnEnabled(arr,true);
			 comUI.freeStatusUi();
			 comUI.setAppointedInnerText("freeStatusBtn","示忙");
			// comUI.setAppointedInnerText("AgentStatus","FreeTime");
			 //整理态下外呼，不改变状态
			 if(!index.ctiInit.AudioCallIds.getIsInCallOut()){
				 index.clientInfo.timerWait.startTime().end();//停止计时
				 index.clientInfo.timerWait.setStatus("空闲");
				 index.comMenu.comUI.cancelRest();
				 comUI.setAppointedBtnEnabled("callOutBtn",true);
			 }
//			 setTimeout(function(){index.clientInfo.timerWait.setStatus("空闲");},1000);

   		
   		 //开始计时
   		 index.clientInfo.timerWait.startTime().start();
		}
	})
	return agentStateChange46;
});