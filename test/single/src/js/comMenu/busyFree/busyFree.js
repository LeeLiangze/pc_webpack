//此js包含了示忙和示闲的处理方法
define(['../../index/constants/mediaConstants',],function(Constants){
	var index;
	var CTIID;
	var ip;
	var port;
	var proxyIP;
	var proxyPort;
	var isDefault;
	var sign_url="";
	var lastCallId;//最后接入的语音会话
	var holdCallId;//被保持的语音会话id
	var muteCallId;//被静音的会话id	var failId;// 添加日志时,失败原因码
	var callId = {};//定义一个callid
	var resultMsg=""; //定义结果信息
	var objClass = function(indexModule){
		index = indexModule;
		CTIID = index.CTIInfo.CTIId;
		ip = index.CTIInfo.IP;
		port = index.CTIInfo.port;
		proxyIP = index.CTIInfo.ProxyIP;
		proxyPort = index.CTIInfo.ProxyPort;
		isDefault = index.CTIInfo.isDefault;
		if(isDefault == "1"){
        	sign_url = Constants.CCACSURL + proxyIP + ":" + proxyPort + "/ccacs/" + CTIID + "/ws/agent/setagentstate";
        }else{
        	sign_url = Constants.CCACSURL + ip + ":" + port + "/ccacs/ws/agent/setagentstate";//跨域直连
        }
	} 
	//对外暴露两个方法
	objClass.prototype = {
		//示忙
		showBusy:function(){
			showBusy();
		},
		//示闲
		showFree:function(){
			showFree();
		}
	};
	//示忙
	function showBusy(){
		var option = index.serialNumber.getSerialNumber();//获取随机数
		//示忙下的处理
		var data={
    			"state":"3",
    			"opserialNo":option
    	};
		if(index.queue.browserName==="IE"){  //注意index的
			$.ajax({
	    		url : sign_url,
	    		type : 'post', 
	    		data : JSON.stringify(data),
 	    		crossDomain:true,
	    		contentType:"application/json; charset=utf-8",
	    		success : function(json) {
	    			var resultMsg;
    	    		if(json.result=='0'){
    	    			index.comMenu.comUI.setAppointedBtnEnabled("freeStatusBtn",true);
    	    			index.comMenu.comUI.busyStatusUi();
    	    			index.comMenu.comUI.setAppointedBtnEnabled("restBtn",false);
    	    			resultMsg = "设置示忙成功";
			        }else{
			        	index.popAlert("设置坐席示忙失败!");
			        	resultMsg = "设置示忙失败";
			        	var errorcodeResultMsg=index.ErrorcodeSearch.errorcodeSearch(json.result);
			            index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);  
			        }
    	    		
    	    		var paramsToProvince = {
    						"resultCode" : json.result,
    						"resultMessage" : resultMsg,
    						"reserved1" : "",
    						"reserved2" : "",
    						"reserved3" : ""
    				};
    				index.postMessage.sendToProvince("setagentstate3", paramsToProvince);
	         	},
	         	error : function(XMLHttpRequest, textStatus, errorThrown){
	         		var errorParams = {
	         				"XMLHttpRequest":XMLHttpRequest,
	         				"textStatus":textStatus,
	         				"errorThrown":errorThrown
	         		};
	         	}
	    	});
		}else{
			$.ajax({
	    		url : sign_url,
	    		type : 'post', 
	    		data : JSON.stringify(data),
 	    		crossDomain:true,
	    		xhrFields:{
	    			withCredentials:true
	    		},
	    		contentType:"application/json; charset=utf-8",
	    		success : function(json) {
	    			var resultMsg;
    	    		if(json.result=='0'){
    	    			index.comMenu.comUI.setAppointedBtnEnabled("freeStatusBtn",true);
	    				index.comMenu.comUI.busyStatusUi();
	    				index.comMenu.comUI.setAppointedBtnEnabled("restBtn",false);
    	    			resultMsg = "设置示忙成功";
			        }else{
			        	index.popAlert("设置坐席示忙失败!");
			        	resultMsg = "设置示忙失败";
			        	var errorcodeResultMsg=index.ErrorcodeSearch.errorcodeSearch(json.result);
			            index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);  
			        }
    	    		
    	    		var paramsToProvince = {
    						"resultCode" : json.result,
    						"resultMessage" : resultMsg,
    						"reserved1" : "",
    						"reserved2" : "",
    						"reserved3" : ""
    				};
    				index.postMessage.sendToProvince("setagentstate3", paramsToProvince);
    	    		
	         	},
	         	error : function(XMLHttpRequest, textStatus, errorThrown){
	         		var errorParams = {
	         				"XMLHttpRequest":XMLHttpRequest,
	         				"textStatus":textStatus,
	         				"errorThrown":errorThrown
	         		};
	         	}
	    	});
		}
	}
	
	//示闲
	function showFree(){
		var option = index.serialNumber.getSerialNumber();//获取随机数
		var data={
    			"state":"4",
    			"opserialNo":option
    	};
		if(index.queue.browserName==="IE"){  //注意index的
			$.ajax({
	    		url : sign_url ,
	    		type : 'post', 
	    		data : JSON.stringify(data),
	    		crossDomain:true,
	    		contentType:"application/json; charset=utf-8",
	    		success : function(json) {
	    			var resultMsg;
    	    		if(json.result=='0'){
    	    			var statusTxt = $(".queueHead .queueTime .TimeTilte").html();
    	    			//只有在通话中示闲，坐席无法接受到示闲事件，其他状态示闲，均可接收到事件，所以将代码移至事件处理逻辑下执行
    	    			if (statusTxt == "通话中")
    	    			{
    	    				var arr = ['freeStatusBtn','restBtn'];
        	    			index.comMenu.comUI.setAppointedMoreBtnEnabled(arr,true);
        	    			index.comMenu.comUI.freeStatusUi();
    	    				return;
    	    			}
    	    			resultMsg = "设置示闲成功";
	         		}else{
	         			resultMsg = "设置示闲失败";
	         			var errorcodeResultMsg=index.ErrorcodeSearch.errorcodeSearch(json.result);
			            index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);  
	         		}
    	    		
    	    		var paramsToProvince = {
    						"resultCode" : json.result,
    						"resultMessage" : resultMsg,
    						"reserved1" : "",
    						"reserved2" : "",
    						"reserved3" : ""
    				};
    				index.postMessage.sendToProvince("setagentstate4", paramsToProvince);
	    		},
	    		error : function(XMLHttpRequest, textStatus, errorThrown){
	    			var errorParams = {
	            			"XMLHttpRequest":XMLHttpRequest,
	            			"textStatus":textStatus,
	            			"errorThrown":errorThrown
	            };
	    	 }
		  });
		}else{
			$.ajax({
	    		url : sign_url ,
	    		type : 'post', 
	    		data : JSON.stringify(data),
	    		crossDomain:true,
	    		xhrFields:{
	    			withCredentials:true
	    		},
	    		contentType:"application/json; charset=utf-8",
	    		success : function(json) {
	    			var resultMsg;
    	    		if(json.result=='0'){
    	    			var statusTxt = $(".queueHead .queueTime .TimeTilte").html();
    	    			//只有在通话中示闲，坐席无法接受到示闲事件，其他状态示闲，均可接收到事件，所以将代码移至事件处理逻辑下执行
    	    			if (statusTxt == "通话中")
    	    			{
    	    				var arr = ['freeStatusBtn','restBtn'];
        	    			index.comMenu.comUI.setAppointedMoreBtnEnabled(arr,true);
        	    			index.comMenu.comUI.freeStatusUi();
    	    				return;
    	    			}
    	    			resultMsg = "设置示闲成功";
	         		}else{
	         			resultMsg = "设置示闲失败";
	         			var errorcodeResultMsg=index.ErrorcodeSearch.errorcodeSearch(json.result);
			            index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);  
	         		}
    	    		
    	    		var paramsToProvince = {
    						"resultCode" : json.result,
    						"resultMessage" : resultMsg,
    						"reserved1" : "",
    						"reserved2" : "",
    						"reserved3" : ""
    				};
    				index.postMessage.sendToProvince("setagentstate4", paramsToProvince);
	    		},
	    		error : function(XMLHttpRequest, textStatus, errorThrown){
	    			var errorParams = {
	            			"XMLHttpRequest":XMLHttpRequest,
	            			"textStatus":textStatus,
	            			"errorThrown":errorThrown
	            };
	    		}
	    	});
		}
	}
	return objClass;
})
