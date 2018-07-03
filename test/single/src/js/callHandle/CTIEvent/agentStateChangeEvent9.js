/**
 * 351-9事件
 * 座席状态变更事件-学习
 */
define(['Util','./CTIEventsDeal','jquery.tiny'], function(Util,CTIEventsDeal) {
	var index;
	var comUI;
	var agentStateChange9 = function(indexModule) {
		index = indexModule;
		comUI = index.comMenu.comUI;
	};
	$.extend(agentStateChange9.prototype,{
		agentStateChangeEvent9 : function(uselessObj,agentStateChangeEvent) {
			 var paramsToProvince = {
					"resultCode" : 0,
					"resultMessage" : "坐席状态变更事件-学习",
					"reserved1" : index.getUserInfo().staffId,
					"reserved2" : "9",
					"reserved3" : "学习"
			 };
			 index.postMessage.sendToProvince("agentStateChangeEvent9", paramsToProvince);
		}
	})
	return agentStateChange9;
});