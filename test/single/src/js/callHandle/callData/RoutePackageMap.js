
define(['Util'],function(Util){
	var entry;
	var size;
	var activeCallId;
    var RoutePackageMap=function(index){
    	size=0;
    	entry={};
    	return returnObj.call(this);
    };
    function returnObj(){
    	var _this=this;
    	var obj={
    			putRp:function(key, value){        	
    	        	if(!this.containsKeyRp(key))  {       
    	  	            size ++ ;       
    	  	        }       
    	  	        entry[key] = value;   
    	        },
    	        // 获取
    	        getRp:function (key)       
    	        {       
    	            return this.containsKeyRp(key) ? entry[key] : null;       
    	        },
    	        // 删除
    	        removeRp:function (key)       
    	        {       
    	            if( this.containsKeyRp(key) && ( delete entry[key] ) )       
    	            {       
    	                size --;       
    	            }       
    	        },       
    	               
    	        // 是否包含 Key
    	        containsKeyRp:function (key)       
    	        {       
    	            return (key in entry);       
    	        },       
    	               
    	        // 是否包含 value 
    	        containsValueRp:function (value)       
    	        {       
    	            for(var prop in entry)       
    	            {       
    	                if(entry[prop] == value)       
    	                {       
    	                    return true;       
    	                }       
    	            }       
    	            return false;       
    	        },       
    	               
    	        // 所有 value
    	        valuesRp:function ()       
    	        {
/*    	            var values = new Array();
    	            for(var prop in entry)       
    	            {   
    	            	var description=""; 
    	            	for(var i in entry[prop])
    	            	{    
    	        	        var property = (entry[prop])[i];    
    	        	        description+=i+':'+property;
    	        	    }
    	            	 
    	            	values.push('[' + description + ']');       
    	            }    */   
    	            return entry;       
    	        },       
    	               
    	        // 所有 Key
    	        keysRp:function ()       
    	        {       
    	            var keys = new Array();       
    	            for(var prop in entry)       
    	            {       
    	                keys.push(prop);       
    	            }       
    	            return keys;       
    	        },       
    	               
    	        // Map 大小
    	        sizeRp:function ()       
    	        {       
    	            return size;       
    	        },       
    	               
    	        // 清空
    	        clearRp:function ()       
    	        {       
    	            size:0;       
    	            entry = new Object();       
    	        }, 
    	        // 设置当前活动呼叫的接触ID
    		    setActiveCallId:function (callId)       
    		    {       
    		        this.activeCallId = callId;        
    		    },
    		    
    		    // 设置当前活动呼叫的接触ID
    		    getActiveCallId:function ()       
    		    {       
    		        return this.activeCallId;        
    		    }
    	}
    	
    	return obj;
    };
    //向外暴漏的方法，可被外部调用
    RoutePackageMap.prototype = {
    };
    return RoutePackageMap
});



 