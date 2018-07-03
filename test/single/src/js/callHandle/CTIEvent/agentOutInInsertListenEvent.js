/**
 * 402事件
 * 处理被监听座席签出事件
 */
define(['Util',
        '../../index/constants/mediaConstants',
        './CTIEventsDeal',
        'jquery.tiny'], function(Util,Constants,CTIEventsDeal) {
	var index;
	var comUI;
	var agentOutInInsertListen = function(indexModule) {
		index = indexModule;
		comUI = index.comMenu.comUI;
	};
	$.extend(agentOutInInsertListen.prototype,{
		agentOutInInsertListenEvent : function(uselessObj,agentOutInInsertListenEvent) {
			
			 var paramsToProvince = {
					"resultCode" : 0,
					"resultMessage" : "被监听座席签出事件",
					"reserved1" : "",
					"reserved2" : "",
					"reserved3" : ""
			 };
			 index.postMessage.sendToProvince("agentOutInInsertListenEvent", paramsToProvince);
			
			 var workNo = agentOutInInsertListenEvent.targetAgentId;
			 var audiuWorkNo = index.ctiInit.AudioCallIds.getSupervisedWorkno();
			 var ip = index.CTIInfo.IP;
			 var port = index.CTIInfo.port;
			 var isDefault = index.CTIInfo.isDefault;//缺省业务标志值
			 var proxyIP = index.CTIInfo.ProxyIP;//代理IP
		     var proxyPort = index.CTIInfo.ProxyPort;//代理端口
		     var ctiId = index.CTIInfo.CTIId;
		     var sign_url="";
	         if(isDefault=="1"){//此种情况走nginx代理
	            sign_url=Constants.CCACSURL+proxyIP+":"+proxyPort+"/ccacs/"+ctiId+"/ws/quality/supervise";
	         }else{                                 
	            sign_url= Constants.CCACSURL+ip+":"+port+"/ccacs/ws/quality/supervise"; //跨域直连
	         }
			 if(workNo == audiuWorkNo){ 
				 $.ajax({
					 uri:sign_url,
					 timeout:20000,// 默认为 20000。如果超时时长不是
						// 20000，则需要传递该参数。
					 data:{"targetAgentId":audiuWorkNo,"flag":"1"},// 请求参数
		 	         async:false,// 默认值为 true 异步。如果需要同步，则需要传递该参数为false
		 	         success:function(data){// 成功的回调函数
	 	            	index.ctiInit.AudioCallIds.setIsInSupervise(false); 
	    		    	index.popAlert(workNo + "坐席已签出！","结果提示");
	    		    	// 设置为空，表示清除缓存
	    		    	index.ctiInit.AudioCallIds.setSupervisedWorkno("");
		 	        },
		 	        error:function(jqXHR,textStatus,errorThrown){// 失败的回调函数
	 	           }
					 
				 });
				/* var config = {
			 	            uri:'ws/quality/supervise/',
			 	            timeout:20000,// 默认为 20000。如果超时时长不是
											// 20000，则需要传递该参数。
			 	            requestData:{"targetAgentId":audiuWorkNo,"flag":"1"},// 请求参数
			 	            async:false,// 默认值为 true
										// 异步。如果需要同步，则需要传递该参数为false
			 	            successCallBack:function(data){// 成功的回调函数
			 	            	 index.CallingInfoMap.setIsInSupervise(false); 
			    		    		index.popAlert(workNo + "坐席已签出！","结果提示");
			    		    		// 设置为空，表示清除缓存
			    		    		index.CallingInfoMap.setSupervisedWorkno("");
			 	            },
			 	            errorCallBack:function(jqXHR,textStatus,errorThrown){// 失败的回调函数
			 	            }
			 	         };*/
			 	      // 发起调用
			 	    //  _index.CallingInfoMap.postCTIRequest(config);  
			 }else{
				 return;
			 }
		}
	})
	return agentOutInInsertListen;
});