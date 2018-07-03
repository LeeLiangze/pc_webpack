/**
 * 302事件
 * 呼出结果事件
 */
define(['Util',
        './CTIEventsDeal',
        'jquery.tiny'], function(Util,CTIEventsDeal) {
	var index;
	var comUI;
	var callOutResult = function(indexModule) {
		index = indexModule;
		comUI = index.comMenu.comUI;
	};
	$.extend(callOutResult.prototype,{
		callOutResultEvent : function(uselessObj,callOutResultEvent) {
			var result = callOutResultEvent.result;
			var callOutType = index.ctiInit.AudioCallIds.getCallOutType();
			var paramsToProvince = {
					"resultCode" : result,
					"resultMessage" : "呼出结果事件,失败",
					"callOutType":callOutType ? callOutType : "",
					"reserved1" : "",
					"reserved2" : "",
					"reserved3" : ""
			};
			index.postMessage.sendToProvince("callOutResultEvent", paramsToProvince);
			index.postMessage.trigger("callOutResultEvent", paramsToProvince, true);
			index.ctiInit.AudioCallIds.setCallOutType("");
			if(result == "0"){
				 index.popAlert("呼叫成功");
		    }else{
		    	//var resultMsg = index.CallingInfoMap.ErrorcodeSearch(result,"呼叫失败");
//		    	var resultMsg = index.ctiInit.ErrorcodeSearch.ErrorcodeSearch(result,"呼叫失败");
//		    	index.popAlert(resultMsg);
		    	
		    	var errorcodeResultMsg=index.ErrorcodeSearch.errorcodeSearch(result);
				index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);
				comUI.setAppointedBtnEnabled("callOutBtn",true);//外呼失败时,将外呼按钮恢复.
		    	 setTimeout(function () {
					index.ctiInit.AudioCallIds.setIsInCallOut(false);
					}, 1000);
		    }
		}
	})
	return callOutResult;
});
