/**
 * 点击停止三分通话逻辑
 */
define(function(){
	var objClass = function(index,obj_text){
		
		var _index = index;
		//判断是否有进行三方通话
		var IsInConference = _index.ctiInit.AudioCallIds.getIsInConference();
		//IsInConference = true;
      	if(IsInConference){
  			var params = {
					title : '停止三方通话',
					url : 'js/comMenu/isConference/unConference',
					param : obj_text,
					width : 500,
					height : 100
				}
				var result = _index.showDialog(params);
  		}else{
  			_index.popAlert("当前没有正在进行的三方通话","停止三方通话");
      	}
	}
	
	return objClass;
});