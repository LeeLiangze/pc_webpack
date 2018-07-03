//此js包含了取消休息的处理方法
define(['../../index/constants/mediaConstants'],function(Constants){
	var objClass = function(indexModule){
		var _index = indexModule;
        var proxyIP = _index.CTIInfo.ProxyIP;//代理IP
        var proxyPort = _index.CTIInfo.ProxyPort;//代理端口
        var ip = _index.CTIInfo.IP;
		var port = _index.CTIInfo.port;
		var isDefault = _index.CTIInfo.isDefault;//缺省业务标志值
		var ctiId = _index.CTIInfo.CTIId;
		var opserialNo = _index.serialNumber.getSerialNumber();
        var  signOutUrl = '';
		if(isDefault == "1"){//此种情况走nginx代理
			sign_url= Constants.CCACSURL+proxyIP+":"+proxyPort+"/ccacs/"+ctiId+"/ws/agent/setagentstate";
    	}else{                                 
    		sign_url= Constants.CCACSURL+ip+":"+port+"/ccacs/ws/agent/setagentstate";//跨域直连
    	};
    	if(_index.queue.browserName==="IE"){
	         $.ajax({  
	    		url :sign_url,
	            type : 'post',  
	            timeout : 20000,
                dataType:"json",
                crossDomain: true,
	            async:true,
	            contentType:"application/json; charset=utf-8",
	            data:JSON.stringify({State:8,opserialNo:opserialNo,flag:0}),
	            success:function(data) {
	            	if(data.result =="0"){
						   _index.popAlert("结束休息请求成功","结束休息");
						   _index.comMenu.comUI.cancelRest();
						   var lastCallId = _index.ctiInit.AudioCallIds.getAudioLastCallId();
						   //预约休息再取消时,当前没有通话时,才将外呼按钮置为可用
						   if(!lastCallId){
							   _index.comMenu.comUI.setAppointedBtnEnabled("callOutBtn",true);
						   }
						   _index.comMenu.comUI.setAppointedBtnEnabled("freeStatusBtn",true);
						   _index.comMenu.comUI.setAppointedIcont("freeStatusBtn","#FFAE00");
					    }else{
                       _index.popAlert("结束休息请求失败");
                       var errorcodeResultMsg=_index.ErrorcodeSearch.errorcodeSearch(data.result);
			           _index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);  
				    }
	            },
	            errorCallBack:function(jqXHR,textStatus,errorThrown){//失败的回调函数
		    		_index.popAlert("结束休息请求失败");
	            	var errorParams = {
	            			"XMLHttpRequest":jqXHR,
	            			"textStatus":textStatus,
	            			"errorThrown":errorThrown
	            	};
	            }
			});
    	}else{
    		 $.ajax({  
	    		url :sign_url,
	            type : 'post',  
	            timeout : 20000,
                dataType:"json",
                crossDomain: true,
                xhrFields: {
                   withCredentials: true
                },
	            async:true,
	            contentType:"application/json; charset=utf-8",
	            data:JSON.stringify({State:8,opserialNo:opserialNo,flag:0}),
	            success:function(data) {
	            	if(data.result =="0"){
					   _index.popAlert("结束休息请求成功","结束休息");
					   _index.comMenu.comUI.cancelRest();
					   var lastCallId = _index.ctiInit.AudioCallIds.getAudioLastCallId();
					   //预约休息再取消时,当前没有通话时,才将外呼按钮置为可用
					   if(!lastCallId){
						   _index.comMenu.comUI.setAppointedBtnEnabled("callOutBtn",true);
					   }
					   _index.comMenu.comUI.setAppointedBtnEnabled("freeStatusBtn",true);
					   _index.comMenu.comUI.setAppointedIcont("freeStatusBtn","#FFAE00");
				    }else{
                       _index.popAlert("结束休息请求失败");
                       var errorcodeResultMsg=_index.ErrorcodeSearch.errorcodeSearch(data.result);
			           _index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);  
				    }
	            },
	            errorCallBack:function(jqXHR,textStatus,errorThrown){//失败的回调函数
		    		_index.popAlert("结束休息请求失败");
	            	var errorParams = {
	            			"XMLHttpRequest":jqXHR,
	            			"textStatus":textStatus,
	            			"errorThrown":errorThrown
	            	};
	            }
			});
    	}
	} 
	return objClass;
})
