define(function(){
	var objClass = function(index){
		var _index = index;
		
		var lastCallId = _index.ctiInit.AudioCallIds.getAudioLastCallId();//获取最后接入的语音会话
		var callOutCallId = index.ctiInit.AudioCallIds.getCalloutCallId();//获取外呼会话id
		//如果 audioCallIds缓存中的lastCallId 与 calloutCallId 有值，且相等，则弹出二次拨号界面，反之则提示 “外呼后，才能进行二次拨号”界面。
		if(lastCallId && callOutCallId && JSON.stringify(lastCallId) == JSON.stringify(callOutCallId)){
			//加载外呼页
			var config = {
				title:'二次拨号', //弹出窗标题
				url:'js/comMenu/secCallOut/secCallOut', //要加载的模块
				width:640, //对话框宽度
				height:270 //对话框高度
			};
			_index.showDialog(config);
		}else{			
			_index.popAlert("外呼成功后，才能进行二次拨号。", "二次拨号");
		}				
	}
	
	return objClass;
})