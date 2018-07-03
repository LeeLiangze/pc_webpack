define(function(){
	var objClass = function(index){
		var _index = index;
		
		var contactId=_index.CallingInfoMap.getActiveSerialNo();//获取当前活动呼叫的接触id
		var _callingInfo = _index.CallingInfoMap.get(contactId);//根据接触id 获取当前会话信息
		
		if(typeof(_callingInfo)=='undefined'||_callingInfo==null){
			_index.destroyDialog(); 
			_index.popAlert("当前无通话,无法进行呼叫转出。","呼叫转出");
			return;
			
		}else {
			var config = {
					title:'呼叫转出', //弹出窗标题
					url:'js/callHandle/transferCall', //要加载的模块
					width:640, //对话框宽度
					height:270 //对话框高度
				};
			_index.showDialog(config);
		}
		
	}
	
	return objClass;
})