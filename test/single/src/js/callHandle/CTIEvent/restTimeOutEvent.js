/**
 * 353事件
 * 处理座席休息时间到事件
 */
define(['Util',
        '../../index/constants/mediaConstants',
        './CTIEventsDeal',
        'jquery.tiny'], function(Util,Constants,CTIEventsDeal) {
	var index;
	var comUI;
	var restEndTipFlag=true;
	var restTimeOut = function(indexModule) {
		index = indexModule;
		comUI = index.comMenu;
		restAouth();
	};
	$.extend(restTimeOut.prototype,{
		restTimeOutEvent : function(uselessObj,restTimeOutEvent) {
			
			 var paramsToProvince = {
					"resultCode" : 0,
					"resultMessage" : "座席休息时间到事件",
					"reserved1" : "",
					"reserved2" : "",
					"reserved3" : ""
			 };
			 index.postMessage.sendToProvince("restTimeOutEvent", paramsToProvince);
			if(restEndTipFlag){
				 Util.dialog.openDiv({
						id:"outtimeId",
						el:"outTimeId",
						width:300,
						height:50,
						title:"休息超时提醒界面",
						content:"休息超时，确认销毁？",
						okVal:"确定",
						cancelVal:"取消",
						okCallback:function(){
							setagentstate();
						},
						cancelCallback:function(){
						}
					})
			}else{
				setagentstate();
			}

		}
	});
	
	//调用CTI更改坐席状态接口
	var setagentstate=function(){		
		 var ip = index.CTIInfo.IP;
		 var port = index.CTIInfo.port;
		 var isDefault = index.CTIInfo.isDefault;//缺省业务标志值
		 var proxyIP = index.CTIInfo.ProxyIP;//代理IP
	     var proxyPort = index.CTIInfo.ProxyPort;//代理端口
	     var ctiId = index.CTIInfo.CTIId;
	     var opserialNo= index.serialNumber.getSerialNumber();//获取随机数
	     var sign_url="";
        if(isDefault=="1"){//此种情况走nginx代理
           sign_url=Constants.CCACSURL+proxyIP+":"+proxyPort+"/ccacs/"+ctiId+"/ws/agent/setagentstate";
        }else{                                 
           sign_url= Constants.CCACSURL+ip+":"+port+"/ccacs/ws/agent/setagentstate"; //跨域直连
        }
        
        if(index.queue.browserName==="IE"){  //注意index的
				//IE逻辑
		        $.ajax({  
		    		url :sign_url,
		            type : 'post',  
		            timeout : 20000,
	                dataType:"json",
	                crossDomain: true,
//                   xhrFields: {
//                      withCredentials: true
//                   },
		            async:true,
		            contentType:"application/json; charset=utf-8",
		            data:JSON.stringify({State:8,opserialNo:opserialNo,flag:0}),
		            success:function(data) {// 成功的回调函数
		            	 if(data.result =="0"){
							   Util.dialog.openDiv({
								   id:"overRestSucId",
								   el:"overRestSuc",
								   width:100,
								   height:40,
								   title:"结束休息请求结果提示",
								   content:"结束休息请求成功！"
							   });
							  index.comMenu.comUI.cancelRest();
							  var arr = ["freeStatusBtn","callOutBtn"];
							  index.comMenu.comUI.setAppointedMoreBtnEnabled(arr,true);
							  index.comMenu.comUI.setAppointedIcont("freeStatusBtn","#FFAE00");
						   }else{		 								  
							   resultMsg=index.CallingInfoMap.ErrorcodeSearch(data.result,"结束休息请求失败！");		 								  
							   Util.dialog.openDiv({
								   id:"overRestFaildId",
								   el:"overRestFaild",
								   width:100,
								   height:40,
								   title:"结束休息请求结果提示",
								   content:resultMsg
							   });
						   }
		            },
		            error:function(jqXHR,textStatus,errorThrown){// 失败的回调函数
		            	 Util.dialog.openDiv({
					 		id:"overRestFaildId",
					 		el:"overRestFaild",
					 		width:100,
					 		height:40,
					 		title:"结束休息请求结果提示",
					 		content:"结束休息请求失败！"
						 });
		            	 var errorParams = {
		            			 "XMLHttpRequest":jqXHR,
		            			 "textStatus":textStatus,
		            			 "errorThrown":errorThrown
		            	 };
		            	 console.log(errorParams);
		            }
		         });
			}else{
				//其他浏览器逻辑
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
		            success:function(data) {// 成功的回调函数
		            	 if(data.result =="0"){
							   Util.dialog.openDiv({
								   id:"overRestSucId",
								   el:"overRestSuc",
								   width:100,
								   height:40,
								   title:"结束休息请求结果提示",
								   content:"结束休息请求成功！"
							   });
							  index.comMenu.comUI.cancelRest();
							  var arr = ["freeStatusBtn","callOutBtn"];
							  index.comMenu.comUI.setAppointedMoreBtnEnabled(arr,true);
							  index.comMenu.comUI.setAppointedIcont("freeStatusBtn","#FFAE00");
						   }else{		 								  
							   resultMsg=index.CallingInfoMap.ErrorcodeSearch(data.result,"结束休息请求失败！");		 								  
							   Util.dialog.openDiv({
								   id:"overRestFaildId",
								   el:"overRestFaild",
								   width:100,
								   height:40,
								   title:"结束休息请求结果提示",
								   content:resultMsg
							   });
						   }
		            },
		            error:function(jqXHR,textStatus,errorThrown){// 失败的回调函数
		            	 Util.dialog.openDiv({
					 		id:"overRestFaildId",
					 		el:"overRestFaild",
					 		width:100,
					 		height:40,
					 		title:"结束休息请求结果提示",
					 		content:"结束休息请求失败！"
						 });
		            	 var errorParams = {
		            			 "XMLHttpRequest":jqXHR,
		            			 "textStatus":textStatus,
		            			 "errorThrown":errorThrown
		            	 };
		            	 console.log(errorParams);
		            }
		         });
			}				
	
	}
	//休息结束是否提示标志值获取
	var restAouth=function(){
		var data={
				"itemId":'121'
		};
		Util.ajax.postJson("front/sh/common!execute?uid=s007",data,function(json,status){
			if(status){
				if(json.bean.value=="N"){
					restEndTipFlag=false;
				}else{
					
				}
			}
		},true);
	}
	return restTimeOut;
});