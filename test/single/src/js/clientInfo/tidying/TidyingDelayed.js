define(['../../../tpl/clientInfo/tidying/TidyingDelayed.tpl',
        '../../../assets/css/clinetInfo/TidyingDelayed.css'
        ],function(tpl){
	var index;
	var $el;
	var allTime;
	var tempMark;
	var initialize=function(indexModule){
		index=indexModule;		
		$el = $(tpl);
		eventInit();
		tidyingDelayedInit();
		this.content = $el;
	};
	var eventInit = function(){
		$el.on("click", "#tidyingDelayed_true", submit );
		$el.on("click", "#tidyingDelayed_false",cancel );
	}
	var tidyingDelayedInit = function(){
		//allTime总时长
		var tidyingTime = index.CTIInfo.arrageDuration;
		// 一次整理态标识位
		var tidyingMark = $("#tidying_Mark").val();
		if(tempMark != tidyingMark){
			allTime = tidyingTime;
			tempMark = tidyingMark;
		}
		$el.find("#tidyingDelayed_extend").val(tidyingTime);
		$el.find("#tidyingDelayed_all").val(allTime);
		//剩余时间
		var surplusTime = $("#tidying_surplus_time").val();
		//已用时间
		var useTime = Number(allTime) - Number(surplusTime);
		
		$el.find("#tidyingDelayed_use").val(useTime);
	}

    var submit = function(){
    	var status = $(".TimeTilte").text();
    	 if(status == "整理态"){
    		 var maxTime = index.CTIInfo.maxArrageTime;
    		 if(parseInt(allTime) <parseInt(maxTime) ){
    			 var tidyingTime = index.CTIInfo.arrageDuration;
    			 allTime = Number(allTime) + Number(tidyingTime);
    			 var surplusTime = $("#tidying_surplus_time").val();
    			 var extendTime =  Number(surplusTime) + Number(tidyingTime);
    			 index.clientInfo.timerWait.startTime().countDown(parseInt(extendTime),function(e){
    				 index.clientInfo.timerWait.changeState("整理态"); 
    			 });
    		 }else{
    			 index.popAlert("已超时，不能再休息了 ");
    		 }
    	 }else{
			 index.popAlert("只有整理态时，才能延时。"); 
		 }
		index.destroyDialog();
	}
    
    var cancel = function(){
    	$el.find("#tidyingDelayed_extend").val();
    	index.destroyDialog();
	}
	return initialize;
});