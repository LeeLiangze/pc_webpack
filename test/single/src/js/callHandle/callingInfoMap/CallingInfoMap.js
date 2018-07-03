
define(['Util'],function(Util){
	var entry;
	var size;
	var activeContactId;
    var CallingInfoMap=function(index){
    	size=0;
    	entry={};
    	return returnObj.call(this);
    };
    function returnObj(){
    	var _this=this;
    	_this.isFirstAnswerRequest=false;
    	_this.isClickTidyStatus="0";//0初始化值，1空闲转整理态（正计时），2通话中转整理态（倒计时）
    	_this.AudioActiveserialNo;
    	var obj={
    			
    			//添加活动的callId
    			setAudioActiveserialNo:function(serialNo){
        			this.AudioActiveserialNo=serialNo;
        		},
        		//获取活动的callId
        		getAudioActiveserialNo:function(){
        			return this.AudioActiveserialNo;
        		},
    			/**
        		 * 设置一个标识来判断是否是手动点击整理态按钮进入整理态的
        		 */
    			setIsClickTidyStatus : function(isClickTidyStatus){
    				_this.isClickTidyStatus=isClickTidyStatus;
    			},
    			getIsClickTidyStatus : function(){
    				return _this.isClickTidyStatus;
    			},
    			/**
        		 * 设置一个标识来判断第几次300事件
        		 */
        		setIsFirstAnswerRequest : function(isFirstAnswerRequest){
        			_this.isFirstAnswerRequest=isFirstAnswerRequest;
        		},
        		getIsFirstAnswerRequest : function(){
        			return _this.isFirstAnswerRequest;
        		},
    			put:function(key, value){        	
    	        	if(!this.containsKey(key))  {       
    	  	            size ++ ;       
    	  	        }       
    	  	        entry[key] = value;   
    	        },
    	        // 获取
    	        get:function (key)       
    	        {       
    	            return this.containsKey(key) ? entry[key] : null;       
    	        },
    	        // 删除
    	        remove:function (key)       
    	        {       
    	            if( this.containsKey(key) && ( delete entry[key] ) )       
    	            {       
    	                size --;       
    	            }       
    	        },       
    	               
    	        // 是否包含 Key
    	        containsKey:function (key)       
    	        {       
    	            return (key in entry);       
    	        },       
    	               
    	        // 是否包含 value 
    	        containsValue:function (value)       
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
    	        values:function ()       
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
    	        keys:function ()       
    	        {       
    	            var keys = new Array();       
    	            for(var prop in entry)       
    	            {       
    	                keys.push(prop);       
    	            }       
    	            return keys;       
    	        },       
    	               
    	        // Map 大小
    	        size:function ()       
    	        {       
    	            return size;       
    	        },       
    	               
    	        // 清空
    	        clear:function ()       
    	        {       
    	            size:0;       
    	            entry = new Object();       
    	        }, 
    	        // 设置当前活动呼叫的接触ID
    		    setActiveSerialNo:function (SerialNo)       
    		    {       
    		        this.activeSerialNo = SerialNo;        
    		    },
    		    
    		    // 设置当前活动呼叫的接触ID
    		    getActiveSerialNo:function ()       
    		    {       
    		        return this.activeSerialNo;        
    		    },
    		    
    		    // 根据平台CALLID获取接触ID
    		    getSerialNoByCallId:function (callId)       
    		    {     
    		    	var SerialNo;
    		    	for(var prop in entry)       
    		        {      
    		    		if(entry[prop].callId == callId ) {
    		    			SerialNo = entry[prop].getSerialNo();
    		    		}
    		        }  
    		    	return SerialNo;
    		    }
    	}
    	
    	return obj;
    };
    return CallingInfoMap
});



 