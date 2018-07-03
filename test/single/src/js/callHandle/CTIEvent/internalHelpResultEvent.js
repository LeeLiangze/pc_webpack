/**
 * 307事件
 * 处理内部求助结果事件
 */
define(['Util',
        './CTIEventsDeal',
        'jquery.tiny'], function(Util,CTIEventsDeal) {
	var index;
	var comUI;
	var internalHelpResult = function(indexModule) {
		index = indexModule;
		comUI = index.comMenu;
	};
	$.extend(internalHelpResult.prototype,{
		internalHelpResultEvent : function(uselessObj,internalHelpResultEvent) {
			var result = internalHelpResultEvent.result;
			var callId = internalHelpResultEvent.callId;
			if(result == "0"){
				 index.ctiInit.AudioCallIds.setInternalHelpCallId(callId);
				 //存储呼叫类型 start
				 index.ctiInit.AudioCallIds.setCallFeature("3");//内部求助3
				 //存储呼叫类型 end
				 index.popAlert("内部求助成功");
		    }else{
		    	 index.popAlert("内部求助失败");
		    	}
		 }
	})
	return internalHelpResult;
});
