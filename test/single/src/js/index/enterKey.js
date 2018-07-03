/**
 * Created by peishuxian
 * 绑定Enter键或者Ctrl+Enter
 */
define(['Util'],function(Util){
	var isEnterKey = true;
	var _index;
	var difference = 0;//客户端与服务器的毫秒差；=服务器-客户端
	var enterKey = function(index){
		_index = index;
		intKey();
		return returnObj.call(this);
	};
	var intKey = function(){
		$.getJSON('../../data/bindKey.json',{},$.proxy(function(dataJson){
			if("Ctrl+Enter"==dataJson.bean.flagKey){
				isEnterKey=false;
			}
		},this));
	};
	var saveCtrlEnter = function(){
		Util.ajax.postJson('front/sh/media!execute?uid=bindKey001',{},$.proxy(function(dataJson){
			if(true == dataJson.bean.flag){
				isEnterKey=false;
			}
		},this));
	};
	var delCtrlEnter = function(){
		if(false==isEnterKey){
			Util.ajax.postJson('front/sh/media!execute?uid=bindKey002',{},$.proxy(function(dataJson){
				isEnterKey=true;
			},this));
		}
	};
	
	/**
	 * 日期格式化
	 * 对Date的扩展，将 Date 转化为指定格式的String 
	 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
	 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
	 * 例子： 
	 * dateFormat(new Date(),"yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
	 * dateFormat(new Date(),"yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
	 */
	function dateFormat(date,format){
		format = format?format:"yyyy-MM-dd hh:mm:ss";
		var year = date.getFullYear();
		var month = date.getMonth()+1;
		var day = date.getDate();
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var seconds = date.getSeconds();
		var milliSeconds = date.getMilliseconds();
		var o = { 
				"M+" : month,
				"d+" : day,
				"h+" : hours,
				"m+" : minutes,
				"s+" : seconds,
				"S" : milliSeconds
		} 
		
		if(/(y+)/.test(format)) { 
			format = format.replace(RegExp.$1, (year+"").substr(4 - RegExp.$1.length)); 
		} 
		
		for(var k in o) { 
			if(new RegExp("("+ k +")").test(format)) { 
				format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k]+"" : ("00"+ o[k]).substr((""+ o[k]).length)); 
			} 
		} 
		return format;
	}
	
	var returnObj = function(){
		return{
			isEnterKey : function(){
				return isEnterKey;
			},
			bindSendKey:function(event,idString){
				if(false == isEnterKey){
					if((event.keyCode=="13"||event.keyCode == "108") && event.ctrlKey==true)    
					{
						event.keyCode = 0;
						$(idString).click();
						event.returnValue=false;
					}
				}else if(true == isEnterKey){
					//判断Alt\Ctrl\Shift是否被按下
					var hasOtherKey=event.ctrlKey==true||event.altKey==true||event.shiftKey==true;
					if(!hasOtherKey&&(event.keyCode == "13"||event.keyCode == "108"))    
					{
						event.keyCode = 0;
						$(idString).click();
						event.returnValue=false;
					}
				}
			},
			selectSendKey : function (idStr){
		    	var select = $(idStr+" :selected").val();
		    	if("Enter" == select){
		    		delCtrlEnter();
		    		$(document).find(".CtrlEnter_Chooser").css("color","black");
		    		$(document).find(".Enter_Chooser").css("color","#9dcb3b");
		    		$(document).find(".CtrlEnter_Chooser").attr("selected","");
		    		$(document).find(".Enter_Chooser").attr("selected","selected");
		    	}
		    	if("CtrlEnter" == select){
		    		saveCtrlEnter();
		    		$(document).find(".Enter_Chooser").css("color","black");
		    		$(document).find(".CtrlEnter_Chooser").css("colorr","#9dcb3b");
		    		$(document).find(".Enter_Chooser").attr("selected","");
		    		$(document).find(".CtrlEnter_Chooser").attr("selected","selected");
		    	}
		    },
		    sendKeyCode:function(classStr){
		    	//var $classNames = $(classStr).find("li");

		    	var $classNames = $(classStr+" li");
		    	for(var i=0,len=$classNames.length;i<len;i++){
		    		var $className = $classNames[i];
		    		var $select = $className.getAttribute("selected");
			    	if("enter" == $className.getAttribute("class") && ($select == "true"||$select == "selected")){
			    		delCtrlEnter();
			    	}
			    	if("ctrlEnter" == $className.getAttribute("class") && ($select == "true"||$select == "selected")){
			    		saveCtrlEnter();
			    	}
		    	}
		    },
		    getCurrentTime : function(formatStr){
		    	var timeNow = new Date();
		    	var format = formatStr?formatStr:"";
				var clientTime = dateFormat(timeNow,"yyyy-MM-dd hh:mm:ss.S");
				var serverTime = "";
				$.ajax({  
		    		url : "front/sh/common!getServerTime?uid=util001" ,
		            type : 'post',  
		            async : false,
		            timeout : 1000,
		            data :  {"clientTime":clientTime,"format":format}, 
		            success : function(jsonData) {
		            	if(jsonData.bean){
		            		serverTime = jsonData.bean.serverTime;
		            		difference = jsonData.bean.difference;
		            	}
		            },
		            error : function( XMLHttpRequest, textStatus, errorThrown) {
		            	var xhrTime = XMLHttpRequest.getResponseHeader("Date");
		            	var newDate;
		            	if(xhrTime != null && typeof(xhrTime) != "undefined" && "" != xhrTime){
		            		newDate = new Date(xhrTime);
		            	}else{
		            		var serverTimeInit = timeNow.getTime()+difference;
		            		newDate = new Date(serverTimeInit);
		            	}
				    	if(""==format){
				    		serverTime = dateFormat(newDate);
				    	}else{
				    		serverTime = dateFormat(newDate,format);
				    	}
		            },
		            complete : function(XMLHttpRequest,textStatus){
		            	if("" == serverTime){
		            		var time = XMLHttpRequest.getResponseHeader("Date");
		            		var curDate = new Date(time);
		            		if(""==format){
					    		serverTime = dateFormat(curDate);
					    	}else{
					    		serverTime = dateFormat(curDate,format);
					    	}
		            	}
		            	if("1970-01-01 08:00:00"==serverTime){
		            		var data = {
									staffId : _index.getUserInfo().staffId,//调用方callparty
									event : '获取服务器时间方法',//程序入口callerEntrance
									apiUrl : 'front/sh/common!getServerTime?uid=util001',
									inParams : {clientTime:clientTime},//入参inputParams
									eStack : {textStatus:textStatus,XMLHttpRequest:XMLHttpRequest}//异常信息resultMsg
							}
							Util.ajax.postJson('front/sh/media!execute?uid=addJSErrorLog',data,function(json,status){});
		            	}
		            }
		        });
		    	return serverTime;
		    }
		}
	}
	return enterKey;
});