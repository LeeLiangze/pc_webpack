/**
 * Created by hexianpeng
 * 录音信息缓存
 * upadte by zyy 2017/1/14
 */
define(function(){
	/*
	 * 数组，存放录音信息对象
	 */
	var audioRecords = [];
	
    var CallAffixInfos = function(index){
    	
    	return {
			//添加新的录音信息
			pushAudioRecords:function(recordInfo){        	
				audioRecords[audioRecords.length] = recordInfo; 
	        },
	        //获取录音信息数组
	        getAudioRecords:function ()       
	        {       
	            return audioRecords;       
	        },
	        //移除指定的录音信息
	        removeAudioRecords:function (recordInfo)       
	        {       
//	        	var index = audioRecords.indexOf(recordInfo);
	        	var index=$.inArray(recordInfo,audioRecords);
    			if (index>-1){
    				audioRecords[index];
    			}      
	        }
    	}
    };
    return CallAffixInfos
});



 