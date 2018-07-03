/**
 * Created by yujiaoli
 * 发送通知显示历史的缓存
 * update by zzy 2017/1/14
 */
define(function(){
	var notesHistory = {};
	var AudioNotes = function(index){
    	return {
    		//存放
			putNotes:function(key, value){        	
	        	notesHistory[key] = value;   
	        },
	        // 获取
	        getNotes:function(key)       
	        {       
	            return this.containsNotesKey(key) ? notesHistory[key] : null;       
	        },
	        // 是否包含 Key
	        containsNotesKey:function (key)       
	        {       
	            return (key in notesHistory);       
	        }
    	}
    };
    return AudioNotes;
});



 