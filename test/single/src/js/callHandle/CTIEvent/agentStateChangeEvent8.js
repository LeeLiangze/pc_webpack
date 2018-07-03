/**
 * 352-8事件
 * 座席状态变更事件-休息
 */
define(['Util','./CTIEventsDeal','jquery.tiny'], function(Util,CTIEventsDeal) {
	var index;
	var comUI;
	var agentStateChange8 = function(indexModule) {
		index = indexModule;
		comUI = index.comMenu.comUI;
	};
	$.extend(agentStateChange8.prototype,{
		 agentStateChangeEvent8 : function(uselessObj,agentStateChangeEvent) {
			 
			 var paramsToProvince = {
						"resultCode" : 0,
						"resultMessage" : "坐席状态变更事件-休息",
						"reserved1" : index.getUserInfo().staffId,
						"reserved2" : "8",
						"reserved3" : "休息"
			 };
			 index.postMessage.sendToProvince("agentStateChangeEvent8", paramsToProvince);
			 
			// var arr = ['OperatorStatus'];
			// comUI.disabledButton(arr);
//			 comUI.setAppointedBtnEnabled("freeStatusBtn",false);
			 //comUI.setValue("AgentStatus","Sleeping");
			 //index.comMenu.comUI.setAppointedBtnEnabled("restBtn",true);
			 //index.comMenu.comUI.startRest();
			 index.comMenu.comUI.startRest();
			 var arr = ["freeStatusBtn","callOutBtn"];
			 index.comMenu.comUI.setAppointedMoreBtnEnabled(arr,false);
			 index.comMenu.comUI.setAppointedIcont("freeStatusBtn","#cccccc");
			 index.clientInfo.timerWait.setStatus("休息中");
			 //comUI.setValue("RestType","Rest");
//			 comUI .setAppointedInnerText("RestType","休息");
             index.clientInfo.timerWait.startTime().end();
    		 // 开始计时
			 index.clientInfo.timerWait.startTime().start();
			 //index.comMenu.comUI.setAppointedBtnEnabled("callOutBtn",false);
		}
	})
	return agentStateChange8;
});