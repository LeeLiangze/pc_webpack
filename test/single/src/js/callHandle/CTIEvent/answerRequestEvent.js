/**
 * 300事件
 * 处理请求应答事件（人答模式下有新请求会触发该事件，自答模式下会直接应答，即不会进入该事件）
 */
define(['Util','./CTIEventsDeal','jquery.tiny'], function(Util,CTIEventsDeal) {
	var index;
	var comUI;
	var answerRequest = function(indexModule) {
		index = indexModule;
		comUI = index.comMenu.comUI;
	};
	$.extend(answerRequest.prototype,{
		answerRequestEvent : function(uselessObj,answerRequestEvent) {
			if (index.CallingInfoMap.getIsFirstAnswerRequest()) {
				return;
			}
			index.CallingInfoMap.setIsFirstAnswerRequest(true);
			var paramsToProvince = {
					"resultCode" : 0,
					"resultMessage" : "请求应答事件",
					"reserved1" : "",
					"reserved2" : "",
					"reserved3" : ""
			};
			index.postMessage.sendToProvince("answerRequestEvent", paramsToProvince);
			
			var callId = answerRequestEvent.callId;
			var callIds = index.ctiInit._callIds.callIds;
			for(var i in callIds){
				index.ctiInit._callIds.removeCallId(callIds[i]);
			}
			index.ctiInit._callIds.addCallId(callId);
			//座席当前状态图标变为 有请求待应答
			//comUI.setValue("AgentStatus","WaitToAnswer");
			index.clientInfo.timerWait.setStatus("待接听");
			index.clientInfo.timerWait.startTime().end();
			index.clientInfo.timerWait.startTime().start();
			var medType=answerRequestEvent.mediaType;
			if(medType==5){
				var isRing=index.main.getIsRing();
				if(isRing){
					//判断浏览器类型，添加铃声提示
					if(index.queue.browserName==="IE"){
						$('body').find('embed').remove();						
						$('body').append('<embed src="src/js/comMenu/isRing/media/ring_in.wav" hidden="true" autostart="true" />');
					}else{
						$('body').find('audio').remove();
						$('body').append('<audio src="src/js/comMenu/isRing/media/ring_in.wav" autoplay="autoplay"></audio>');
					}
					
				}
			}
		},
		//判断使用的浏览器
  		myBrowser:function(){
    		var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
			if (userAgent.indexOf("Opera") > -1) {
			    return "Opera"
			}; //判断是否Opera浏览器
			if (userAgent.indexOf("Firefox") > -1) {
				return "FF";
			};//判断是否Firefox浏览器
			if (userAgent.indexOf("Chrome") > -1){
				return "Chrome";
			};//判断是否Chrome浏览器
			if (userAgent.indexOf("Safari") > -1) {
				return "Safari";
			};//判断是否Safari浏览器
  		}
	});
	return answerRequest;
});


