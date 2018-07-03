/**
 * 录音缓存
 */
define(function(){
	var audioRecord=function(){
	/*
	 * 录音信息唯一编号
	 */
	this.recordCallId;
	/*
	 * 呼叫流水号。
	 */
	this.recordSerialNo;
	
	/*
	 * 录音检索标识。
	 */
	this.recordFilePath;
	
	/*
	 * 创建时间
	 */
	this.recordCreateDate;
	
	/*
	 * 接触记录编号。
	 */
	this.recordContactId;
	
	/*
	 * 放音格式，取值范围0~2，10。0表示VP台默认格式 。1表示24KVOX格式  。2表示32KVOX格式 。10表示视频缺省文件格 式
	 */
	this.playFormat;
	
	/*
	 * 音频文件开始时间
	 */
	this.audioRecordBeginTime;
	
	/*
	 * 音频文件结束时间
	 */
	this.audioRecordEndTime;
	
	/*
	 * 录音文件存储location的ID
	 */
	this.recordLocationId;
	
	};
	
	audioRecord.prototype = {
    	        // 设置录音信息callId
    	        setRecordCallId:function (audioRecord)       
    	        {
    	        	this.recordCallId = audioRecord;       
    	        },       
    	               
    	        // 获取录音信息callId
    	        getRecordCallId:function ()       
    	        {       
    	            return this.recordCallId;       
    	        },   
    	        // 设置呼叫流水号
    	        setRecordSerialNo:function (recordSerialNo)       
    	        {       
    	        	this.recordSerialNo = recordSerialNo;       
    	        }, 
    	        // 获取呼叫流水号
    	        getRecordSerialNo:function ()       
    		    {       
    	        	return this.recordSerialNo;         
    		    },
    		    
    		    // 设置录音检索标识
    		    setRecordFilePath:function (filePath)       
    	        {       
    		    	this.recordFilePath = filePath;       
    	        }, 
    	        // 获取录音检索标识
    	        getRecordFilePath:function ()       
    		    {       
    	        	return this.recordFilePath;         
    		    },
    		    
    		    // 设置创建时间
    		    setRecordCreateDate:function (createDate)       
    	        {       
    		    	this.recordCreateDate = createDate;       
    	        }, 
    	        // 获取创建时间
    	        getRecordCreateDate:function ()       
    		    {       
    	        	return this.recordCreateDate;         
    		    },
    		    
    		    // 设置接触记录编号
    		    setRecordContactId:function (contactId)       
    	        {       
    		    	this.recordContactId = contactId;       
    	        }, 
    	        // 获取接触记录编号
    	        getRecordContactId:function ()       
    		    {       
    	        	return this.recordContactId;         
    		    },
    		    
    		    // 设置放音格式
    		    setPlayFormat:function (playFormat)       
    	        {       
    		    	this.playFormat = playFormat;       
    	        }, 
    	        // 获取放音格式
    	        getPlayFormat:function ()       
    		    {       
    	        	return this.playFormat;         
    		    },
    		    
    		    // 设置音频文件开始时间
    		    setAudioRecordBeginTime:function (beginTime)       
    	        {       
    		    	this.audioRecordBeginTime = beginTime;       
    	        }, 
    	        // 获取音频文件开始时间
    	        getAudioRecordBeginTime:function ()       
    		    {       
    	        	return this.audioRecordBeginTime;         
    		    },
    		    
    		    // 设置音频文件结束时间
    		    setAudioRecordEndTime:function (endTime)       
    	        {       
    		    	this.audioRecordEndTime = endTime;       
    	        }, 
    	        // 获取音频文件结束时间
    	        getAudioRecordEndTime:function ()       
    		    {       
    	        	return this.audioRecordEndTime;         
    		    },
    		    
    		    // 设置录音文件存储location的ID
    		    setRecordLocationId:function (locationId)       
    	        {       
    		    	this.recordLocationId = locationId;    
    	        }, 
    	        // 获取录音文件存储location的ID
    	        getRecordLocationId:function ()       
    		    {       
    	        	return this.recordLocationId;         
    		    }
    };
    return audioRecord
});



 