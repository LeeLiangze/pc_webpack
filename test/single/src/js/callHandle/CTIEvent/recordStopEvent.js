/**
 * 306事件
 * 录音停止事件
 */
define(['Util','./CTIEventsDeal','jquery.tiny'], function(Util,CTIEventsDeal) {
	var index;
	var comUI;
	var recordStop = function(indexModule) {
		index = indexModule;
		comUI = index.comMenu;
	};
	$.extend(recordStop.prototype,{
		  recordStopEvent : function(uselessObj,recordStopEvent){
			  
				 var paramsToProvince = {
						"resultCode" : 0,
						"resultMessage" : "录音停止事件",
						"reserved1" : "",
						"reserved2" : "",
						"reserved3" : ""
				 };
				 index.postMessage.sendToProvince("recordStopEvent", paramsToProvince);
			  
			     var recordFile = "";
			     var serialNo = "";
			     var contactId = "";
			     var locationId = "";
				 var callId = recordStopEvent.callId;
				 var beginTime = recordStopEvent.beginTime;//录音开始时间 毫秒
				 var endTime = recordStopEvent.endTime;//录音结束时间 毫秒
				 var newBeginTime = new Date(beginTime);//转换为日期类型
				 var newEndTime = new Date(endTime);//转换为日期类型
				 var audioBeginTime = getNowFormatDate(newBeginTime);//转换为指定格式
				 var audioEndTime = getNowFormatDate(newEndTime);//转换为指定格式
				 var audioRecord = index.ctiInit.CallAffixInfos.getAudioRecords();
				 var staffId=index.getUserInfo().staffId?index.getUserInfo().staffId:"";
				 
				 if(audioRecord){
					 
					 //遍历存放录音信息的数组，找到当前的录音信息。
					 $.each(audioRecord,function(n,v){
						 if(JSON.stringify(callId) == JSON.stringify(v.getRecordCallId())){
							 recordFile = v.getRecordFilePath();
							 serialNo = v.getRecordSerialNo();
							 contactId = v.getRecordContactId();
							 locationId = v.getRecordLocationId();
							 index.ctiInit.CallAffixInfos.removeAudioRecords(v);
						 }
						 
					 });
					 
					 //获取系统当前时间
					 var  newCreateDate = new Date();
					 var createDate=newCreateDate.getFullYear()+"-"+(newCreateDate.getMonth()+1)+"-"+newCreateDate.getDate()+"  "+newCreateDate.getHours()+":"+newCreateDate.getMinutes()+":"+newCreateDate.getSeconds();
						
					 var t_cct_contact = {
					   	         
					       		  "serialNo" : serialNo,
					       		  "recordFilePath" : recordFile,
					       		  "staffId" : staffId,
					       		  "createDate" : createDate,//当前时间
					       		  "contactId" : contactId,//
					       		  "playFormat" : "",//经高林确认暂时为空。 
					       		  "audioBeginTime" : audioBeginTime,
					       		  "audioEndTime" : audioEndTime,
					       		  "locationId" : locationId,
					       		  "dataType" : "contact_affix"
					       		  
							};
							Util.ajax.postJson("front/sh/common!execute?uid=touch001",t_cct_contact,function(json,status){
								   if(status){
								   }else{
								   }
							   });
					 
				 }else{
				 }
		}
	});
	//获取当前时间
	function getNowFormatDate(date) {
		    var seperator1 = "-";
		    var seperator2 = ":";
		    var month = date.getMonth() + 1;
		    var strDate = date.getDate();
		    var hour=date.getHours();
		    var min=date.getMinutes();
		    var second=date.getSeconds();
		    if (month >= 1 && month <= 9) {
		        month = "0" + month;
		    }
		    if (strDate >= 0 && strDate <= 9) {
		        strDate = "0" + strDate;
		    }
		   if (hour >= 0 && hour <= 9) {
			    hour = "0" + hour;
				    }
			if (min >= 0 && min <= 9) {
			    min = "0" + min;
				    }
			if (second >= 0 && second <= 9) {
				second = "0" + second;
				    }
		    contactEndTime = date.getFullYear() + seperator1 + month + seperator1 + strDate
		            + " " + hour + seperator2 + min
		            + seperator2 + second;
		    return contactEndTime;
		
		};
	return recordStop;
});