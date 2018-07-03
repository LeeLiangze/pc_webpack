/**
 * 弹出外部求助页面
 */
define(function(){
	var objModule = function(indexModule){
		var _index = indexModule;
		//外部求助必须在会话的时候才能进行外部求助
		var activeSerialNo = _index.CallingInfoMap.getActiveSerialNo();
		var callingInfo = _index.CallingInfoMap.get(activeSerialNo);//获取callingInfo
		if(!callingInfo){
			_index.popAlert("存在会话才能进行外部求助操作！", "外部求助");
		}else if(callingInfo.getMediaType()!= "5" || !callingInfo.getMediaType()){
			_index.popAlert("存在语音会话才能进行外部求助操作！", "外部求助");
		}else{
			//判断缓存是否有主叫号码数据,没有则从CTIInfo中获取
			if(_index.ctiInit.AudioCallIds.getCallerPhoneNums().length < 1){
				if(_index.CTIInfo.outgoingNo){
					var outgoingNo = _index.CTIInfo.outgoingNo;
					var callerNums = outgoingNo.split(",");
					_index.ctiInit.AudioCallIds.setCallerPhoneNums(callerNums);
				}
			}
			
			//加载外呼页
			var config = {
				title:'外部求助', //弹出窗标题
				url:'js/comMenu/callOutHelp/callOutHelp1', //要加载的模块
				width:640, //对话框宽度
				height:270 //对话框高度
			}
			_index.showDialog(config);
		}
	}
	
	return objModule;
})