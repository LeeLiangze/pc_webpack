define(function(){
	var index;
	var initialize=function(indexModule){
		index=indexModule;
		var status = $(".TimeTilte").text();
		if(status != "整理态"){
			index.popAlert("只有整理态时，才能延时。");
			index.destroyDialog();
			return
		}
		if (index.CallingInfoMap.getIsClickTidyStatus()=="1"||index.CallingInfoMap.getIsClickTidyStatus()=="2") {
			index.popAlert("当前整理态为递增计时模式，不能进行延时操作。");
			index.destroyDialog();
			return;
		}
		 var tidyingTime = index.CTIInfo.arrageDuration;
		 if(tidyingTime == "-1"){
			 index.popAlert("当前整理态模式，不能延时。");
			 index.destroyDialog();
			 return
		 }
		 var model = $('#tidying_model').val();
		 if(model != "999"){
			 index.popAlert("当前整理态模式，不能延时。");
			 index.destroyDialog();
			 return
		 }
		 index.showDialog({
				title : "整理态延长",   //弹出窗标题
				url :"js/clientInfo/tidying/TidyingDelayed",//要加载的模块
				param : {},    //要传递的参数，可以是json对象
				width : 200,  //对话框宽度
				height : 200  //对话框高度
			});

	};
	  
	return initialize;
});