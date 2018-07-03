/**
 * Created by lijianjun
 * update by zzy 2017/1/16
 * callid缓存
 */
define(function(){
   var CurrentCallIds  =function(){
    	/*
		 * callId的集合
		 */
    	 this.callIds = []; 
    		
    };

    //向外暴漏的方法，可被外部调用
    CurrentCallIds.prototype = {
    		
    		/**
    		*获取CallIds数组
    		*/
    		getCallIds : function(){
    			return this.callIds; 
    		},
    		
    		/**
    		* 获取callIds的大小
    		*/
    		getCallIdsSize : function(){
    			return this.callIds.length;
    		},
    		/**
    		* 添加callId
    		*/
    		addCallId:  function(callId){
    			this.callIds.push(callId);
    		},
    		/**
    		* 删除callId
    		*/
    		removeCallId : function(callId){
    			/*var index = this.callIds.indexOf(callId);
    			if (index > -1) {
    			this.callIds.splice(index, 1);
    			}*/
    			for(i=0;i<this.callIds.length;i++){
    				if(callId==this.callIds[i]){
    					this.callIds.splice(i, 1);
    				}
    			}
    		}
    		
    		
    };


    return CurrentCallIds
});















