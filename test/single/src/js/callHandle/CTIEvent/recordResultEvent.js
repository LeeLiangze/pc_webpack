/**
 * 305事件
 * 处理录音结果事件
 */
define(['Util',
        './CTIEventsDeal',
        '../../content/AudioRecord',
        'jquery.tiny'], function(Util,CTIEventsDeal,AudioRecord) {
	var index;
	var comUI;
	var recordResult = function(indexModule) {
		index = indexModule;
		comUI = index.comMenu;
	};
	$.extend(recordResult.prototype,{
		 recordResultEvent : function(uselessObj,recordResultEvent) {
			 
			 var paramsToProvince = {
						"resultCode" : recordResultEvent.result,
						"resultMessage" : "录音结果事件",
						"recordFileName" : recordResultEvent.recordFileName,
						"reserved1" : "",
						"reserved2" : "",
						"reserved3" : ""
			 };
			 index.postMessage.sendToProvince("recordResultEvent", paramsToProvince);
			 
			 var callId = recordResultEvent.callId;
			 var strCallId = ""+callId.time+callId.dsn+callId.handle+callId.server;
			 var serialNo=index.CallingInfoMap.getSerialNoByCallId(strCallId);
//			 var contactId = index.CallingInfoMap.getContactIdByCallId(strCallId);
			 //以下改造是为了杜绝，304事件在305事件后过来，导致 305事件执行异常的问题  wwx160457
			 if(serialNo){
				 recordResultEventDeal(serialNo,recordResultEvent);
			 }else{
				 var recordResultInterval = setInterval(function(){
					 var serialNo=index.CallingInfoMap.getSerialNoByCallId(strCallId);
		    				if (serialNo){
		    					clearInterval(recordResultInterval);
		    					recordResultEventDeal(serialNo,recordResultEvent);
		     		    	}
		    			},50);
			 }
	}});
	//305录音开始事件处理逻辑
	var recordResultEventDeal = function(serialNo,recordResultEvent){
		 var callId = recordResultEvent.callId;
		 var strCallId = ""+callId.time+callId.dsn+callId.handle+callId.server;
		 var serialNo_=index.CallingInfoMap.getSerialNoByCallId(strCallId);
		 if(serialNo){
			 var _callingInfo = index.CallingInfoMap.get(serialNo);
			 var recordFile = recordResultEvent.recordFileName ;
			 var locationId = recordResultEvent.locationId;
			 var serialNo=_callingInfo.getSerialNo()?_callingInfo.getSerialNo():"";
			 var audioRecord = new AudioRecord();
			 
			 var  myDate = new Date();
			 var createDate=myDate.getFullYear()+"-"+(myDate.getMonth()+1)+"-"+myDate.getDate()+"  "+myDate.getHours()+":"+myDate.getMinutes()+":"+myDate.getSeconds();
			 var staffId = index.getUserInfo().staffId;
			 audioRecord.setRecordLocationId(locationId);
			 audioRecord.setRecordCallId(callId);
			 audioRecord.setRecordSerialNo(serialNo);
//			 audioRecord.setRecordContactId(contactId);//原有的
			 audioRecord.setRecordContactId(serialNo_);//20170121临时修改
			 //为callingInfo中的相应字段赋值。
			// _callingInfo.setLocationId(locationId);//分布式节点编号
			_callingInfo.setHasRecordFile("0");//没有录音文件
			 if(recordFile){
				 _callingInfo.setHasRecordFile("1");//有录音文件
				 audioRecord.setRecordFilePath(recordFile);//录音文件名
			 }else{
				 audioRecord.setRecordFilePath("");
			 }
			 index.ctiInit.CallAffixInfos.pushAudioRecords(audioRecord);
			 index.CallingInfoMap.put(serialNo_,_callingInfo);
			 
			 
		 }
		 
	};
	
	
	return recordResult;
});
