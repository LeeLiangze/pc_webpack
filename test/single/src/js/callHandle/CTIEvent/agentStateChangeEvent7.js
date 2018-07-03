/**
 * 351-7事件
 * 座席状态变更事件-通话
 */
define(['Util','./CTIEventsDeal','jquery.tiny'], function(Util,CTIEventsDeal) {
	var index;
	var comUI;
	var agentStateChange7 = function(indexModule) {
		index = indexModule;
		comUI = index.comMenu.comUI;
	};
	$.extend(agentStateChange7.prototype,{
		agentStateChangeEvent7 : function(uselessObj,agentStateChangeEvent) {
			
			 var paramsToProvince = {
					"resultCode" : 0,
					"resultMessage" : "坐席状态变更事件-通话",
					"reserved1" : index.getUserInfo().staffId,
					"reserved2" : "7",
					"reserved3" : "通话"
			 };
			 index.postMessage.sendToProvince("agentStateChangeEvent7", paramsToProvince);
			//var playingRecord = index.CallingInfoMap.getPlayingRecord();
			 var playingRecord = index.ctiInit.getPlayingRecord();
			 var isInSupervise = index.ctiInit.AudioCallIds.getIsInSupervise();
			 var IsInInsert = index.ctiInit.AudioCallIds.getIsInInsert();
			 if(playingRecord || isInSupervise || IsInInsert){
				 //comUI.setValue("AgentStatus","Dialoging");
				 index.clientInfo.timerWait.startTime().end();	
				 index.clientInfo.timerWait.setStatus("通话中");
				 index.clientInfo.timerWait.startTime().start();
			 }
		 }
	})
	return agentStateChange7;
});