/**
 * 303事件
 * 转出结果事件
 */
define(['Util',
        './CTIEventsDeal',
        'jquery.tiny'], function(Util,CTIEventsDeal) {
	var index;
	var comUI;
	var transOutResult = function(indexModule) {
		index = indexModule;
		comUI = index.comMenu;
	};
	$.extend(transOutResult.prototype,{
		transOutResultEvent : function(uselessObj,transOutResultEvent) {
			
			 var paramsToProvince = {
					"resultCode" : transOutResultEvent.result,
					"resultMessage" : "转出结果事件",
					"reserved1" : "",
					"reserved2" : "",
					"reserved3" : ""
			 };
			 index.postMessage.sendToProvince("transOutResultEvent", paramsToProvince);
			
			 var callIdStr=""+transOutResultEvent.callId.time+transOutResultEvent.callId.dsn+ 
			 transOutResultEvent.callId.handle+transOutResultEvent.callId.server;
			 var activeSerialNo = index.CallingInfoMap.getActiveSerialNo();
			 var callingInfo = index.CallingInfoMap.get(activeSerialNo);
			 var status='';
			 if (transOutResultEvent.result=='0') {
				 if(index.ctiInit.AudioCallIds.getOuterHelpStaus() != "1"){
					 index.popAlert("转出成功！","转出结果：");
				 }
//				 callingInfo.setTransferStatus('1');
				 status = '1';
				 if(callingInfo.releaseType != "2"){
					 callingInfo.setReleaseType('1');
				 }
			 }else {
				 if(index.ctiInit.AudioCallIds.getOuterHelpStaus() != "1"){
					 index.popAlert("转出失败！","转出结果：");
				 }
//				 callingInfo.setTransferStatus('0');
				 status = '0';
			}
			index.CallingInfoMap.put(activeSerialNo,callingInfo);
			
			var pSerialNo = callingInfo.getSerialNo()?callingInfo.getSerialNo():"";
			var pCallerNo = callingInfo.getCallerNo()?callingInfo.getCallerNo():"";
			var transferTime = callingInfo.getTransferTime();
			var transferType = callingInfo.getTransferType(); 
			var transferInner = callingInfo.getTransferInner();
			var transferOuter = callingInfo.getTransferOuter();
			var transferMsg = callingInfo.getTransferMsg();
			var transferMode = callingInfo.getTransferMode();
//   		var status = callingInfo.getTransferStatus();
   		// var ctiId = index.CallingInfoMap.getCTIId();
   		
			var pContactId = callingInfo.getContactId()?callingInfo.getContactId():"";
			var ctiId = callingInfo.getCtiId();
			var params = {
					serialNo : pSerialNo, 		// 2呼叫流水号
					callerNo : pCallerNo, 		// 3主叫号码
					transferTime : transferTime, 	// 4转接时间
					transferType : transferType, 	// 5转接目的设备类型
					transferInner : transferInner, 	// 6转接目的设备号码
					transferMode : transferMode, 	// 7转移模式
					transferOuter : transferOuter,  // 8转接人工号
					transferMsg : transferMsg, 	// 9转接同步信息
					status : status, 		// 10转移状态
					contactId : pContactId, 		// 11接触编号
					ctiId : ctiId 			// 12ctiId
			};
			Util.ajax.postJson("front/sh/media!execute?uid=transfer009", params, function(json, status) {
			})
		}
	})
	return transOutResult;
});