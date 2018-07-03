/**
 * 401事件
 * 放音结束事件
 */
define(['Util',
        './CTIEventsDeal',
        'jquery.tiny'], function(Util,CTIEventsDeal) {
	var index;
	var comUI;
	var playEnd = function(indexModule) {
		index = indexModule;
		comUI = index.comMenu;
	};
	$.extend(playEnd.prototype,{
		playEndEvent : function(uselessObj,playEndEvent){
			
			 var paramsToProvince = {
					"resultCode" : 0,
					"resultMessage" : "放音结束事件",
					"reserved1" : "",
					"reserved2" : "",
					"reserved3" : ""
			 };
			 index.postMessage.sendToProvince("playEndEvent", paramsToProvince);
			
			 $(".recordStopBn,.recordFBBn,.recordFFBn,.recordPauseBn,.recordGoOnBn").css("display","none");
			 $(".disrecordStopBn,.disrecordFBBn,.disrecordFFBn,.recordPalyBn").css("display","inline-block");
//			 $(".recordStopBn").css("display","none");
//        	 $(".disrecordStopBn").css("display","inline-block");
			 index.CallingInfoMap.setPlayingRecord(false);
		 }
	})
	return playEnd;
});
