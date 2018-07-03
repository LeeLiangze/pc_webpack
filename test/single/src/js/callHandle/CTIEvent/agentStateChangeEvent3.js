/**
 * 351-3事件
 * 座席状态变更事件-示忙
 * 
 */
define(['Util','./CTIEventsDeal','jquery.tiny'], function(Util,CTIEventsDeal) {
	var index;
	var comUI;
	var agentStateChange3 = function(indexModule) {
		index = indexModule;
		comUI = index.comMenu.comUI;
	};
	$.extend(agentStateChange3.prototype,{
		 agentStateChangeEvent3 : function(uselessObj,agentStateChangeEvent) {
			 
			 var paramsToProvince = {
					"resultCode" : 0,
					"resultMessage" : "坐席状态变更事件-示忙",
					"reserved1" : index.getUserInfo().staffId,
					"reserved2" : "3",
					"reserved3" : "示忙"
			 };
			 index.postMessage.sendToProvince("agentStateChangeEvent3", paramsToProvince);
			 
			 comUI.setAppointedBtnEnabled("freeStatusBtn",true);
			 comUI.setAppointedBtnEnabled("callOutBtn",true);//通话中,预约忙碌时,外呼按钮可用.
			 comUI.busyStatusUi();
			 //comUI.setAppointedInnerText("freeStatusBtn","示闲");
			 comUI.setAppointedBtnEnabled("restBtn",false);
			 index.clientInfo.timerWait.startTime().end();	
			 index.clientInfo.timerWait.setStatus("忙碌");
			 //开始计时
             index.clientInfo.timerWait.startTime().start();
    		 			 
		}
	})
	return agentStateChange3;
});