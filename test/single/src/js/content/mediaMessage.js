define(['Util',
        '../index/constants/mediaConstants'],function(Util,Constants){
	var _index;
	var _messageData;

	var MediaMessage=function(index,messageData){
        _index = index;
        _messageData = messageData;
        return returnObj.call(this);
    };
	
    var returnObj=function(){
		return {
			sendMessages:function(){
				var RESULT = sendMessage(_messageData);
				return RESULT;
			}
		};
	};
	
	var sendMessage=function(messageData){
		var serialNo = messageData.serialNo;
		var callingInfo = _index.CallingInfoMap.get(serialNo);
		var mseriano = callingInfo.getSerialNo();
		var ip = _index.CTIInfo.IP;
		var port = _index.CTIInfo.port;
		var isDefault=_index.CTIInfo.isDefault;//缺省业务标志值
		var proxyIP=_index.CTIInfo.ProxyIP;//代理IP
        var proxyPort =_index.CTIInfo.ProxyPort;//代理端口
        var ctiId = _index.CTIInfo.CTIId;
        
    	var result='';
    	var sendMessageData = messageData.sendMsg;
    	var message = sendMessageData.dataMessage;
    	var content = message.content;
    	sendMessageData.dataMessage.content = _index.contentCommon.filterSpecialCharacter(content);
    	content = _index.contentCommon.parseContentForHref(content);
    	var currentTime = message.createTime;
		//拼接cti请求地址
		var firstResponseTime = callingInfo.getFirstResponseTime();
		
        var url = '';
        if(isDefault=="1"){//此种情况走nginx代理
        	url=Constants.CCACSURL+proxyIP+":"+proxyPort+"/ccacs/"+ctiId+"/ws/call/sendmessage";
         }else{                                 
        	url= Constants.CCACSURL+ip+":"+port+"/ccacs/ws/call/sendmessage"; //跨域直连
         }
    	//封装向cti发送信息的数据结构
        
        if(_index.queue.browserName==="IE"){  //注意index的
			//IE逻辑
            $.ajax({ 
	    		url : url ,
	    		type : 'post', 
	    		data : JSON.stringify(sendMessageData),
	    		async:false,
	    		crossDomain: true,
//	            xhrFields: {
//	                  withCredentials: true
//	                   },
	    		contentType:"application/json; charset=utf-8",
	    		success : function(json) {
	    		if(json.result == "0"){
	    			    result=json.result;
	            		//封装向后台发送请求的数据结构
	            	    var data={
	            	    		  contactId:messageData.contactId,
	            				  content:content,
	            				  msgType:message.msgType,
	            				  url:message.url,
	            				  senderFlag:messageData.senderFlag,
	            				  logTime:currentTime,
	            				  originalCreateTime:currentTime,	  
	            				  mSeriaNo:mseriano,
	            				  messageId:message.messageId?message.messageId:"",
	            				  audioTimeLength:message.duration?message.duration:""
	            		       };
	            	    Util.ajax.postJson("front/sh/media!execute?uid=mes001",data, function(json, status) {
	                		if(status){
	                			//result=json.result; 是否需要加上???
	                			if(firstResponseTime ==null || typeof firstResponseTime == "undefined" || firstResponseTime == ""){
	                				firstResponseTime = _index.utilJS.getCurrentTime();
	                				callingInfo.setFirstResponseTime(firstResponseTime);
	                				//_index.CallingInfoMap.put(contactId,callingInfo);
	                			}else{
	                			}
	                		}
	                	           });
	            	}else{
//	            		_index.CallingInfoMap.recordCallCTILog(url,sendMessageData,json,"发送多媒体消息失败");
	            		result = json.result;
	            	}
	    		    },
	    		    error:function(XMLHttpRequest,textStatus,errorThrown){
	    		    	/*var errorStr = {
	    		    			XMLHttpRequest : XMLHttpRequest,
	    		    			textStatus : textStatus,
	    		    			errorThrown : errorThrown
	    		    	}*/
//	    		    	_index.CallingInfoMap.recordCallCTILog(url,sendMessageData,errorStr,"网络异常,发送多媒体消息失败");
	    		    }
	            	});
		}else{
			//其他浏览器逻辑
	        $.ajax({ 
	    		url : url ,
	    		type : 'post', 
	    		data : JSON.stringify(sendMessageData),
	    		async:false,
	    		crossDomain: true,
	            xhrFields: {
	                  withCredentials: true
	                   },
	    		contentType:"application/json; charset=utf-8",
	    		success : function(json) {
	    		if(json.result == "0"){
	    			    result=json.result;
	            		//封装向后台发送请求的数据结构
	            	    var data={
	            	    		  contactId:messageData.contactId,
	            				  content:content,
	            				  msgType:message.msgType,
	            				  url:message.url,
	            				  senderFlag:messageData.senderFlag,
	            				  logTime:currentTime,
	            				  originalCreateTime:currentTime,	  
	            				  mSeriaNo:mseriano,
	            				  messageId:message.messageId?message.messageId:"",
	            				  audioTimeLength:message.duration?message.duration:""
	            		       };
	            	    Util.ajax.postJson("front/sh/media!execute?uid=mes001",data, function(json, status) {
	                		if(status){
	                			//result=json.result; 是否需要加上???
	                			if(firstResponseTime ==null || typeof firstResponseTime == "undefined" || firstResponseTime == ""){
	                				firstResponseTime = _index.utilJS.getCurrentTime();
	                				callingInfo.setFirstResponseTime(firstResponseTime);
	                				//_index.CallingInfoMap.put(contactId,callingInfo);
	                			}else{
	                			}
	                		}
	                	           });
	            	}else{
//	            		_index.CallingInfoMap.recordCallCTILog(url,sendMessageData,json,"发送多媒体消息失败");
	            		result = json.result;
	            	}
	    		    },
	    		    error:function(XMLHttpRequest,textStatus,errorThrown){
	    		    	/*var errorStr = {
	    		    			XMLHttpRequest : XMLHttpRequest,
	    		    			textStatus : textStatus,
	    		    			errorThrown : errorThrown
	    		    	}*/
//	    		    	_index.CallingInfoMap.recordCallCTILog(url,sendMessageData,errorStr,"网络异常,发送多媒体消息失败");
	    		    }
	            	});
		}

            	return result;      	
    };
    
	return MediaMessage;
});