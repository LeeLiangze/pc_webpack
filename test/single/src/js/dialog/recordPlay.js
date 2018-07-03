define(['Util','../index/constants/mediaConstants','../log/managementLog','../../tpl/callHandle/recordPlay/recordPlay.tpl','../../assets/css/callHandle/recordPlay/recordPlay.css'],function(Util,Constants,ManagementLog,recordPlayTpl){
	var $el,_index,_options,status_log,failId,serialNo;
	var playFlag = 0;
	var ctiurl = '';//cti的ip port
	var fileName = null;
	var filepath = '';
	var enableFastForward = true;
    var enableBackForward = true;
    var _browser;
    var _curStaffId;
    var _contactInfo;
    jQuery.support.cors= true;
    
	var objClass = function(index,options){	
		$el  = $(recordPlayTpl);
		_index = index;
		_options = options;
		serialNo = _options.serialNo;
    	fileName = _options.recordFilePath;
    	filepath = JSON.stringify({"fileName":fileName});
        var  proxyIP = _index.CTIInfo.ProxyIP;//代理IP
        var  proxyPort = _index.CTIInfo.ProxyPort;//代理端口
        var  ip = _index.CTIInfo.IP;
		var  port = _index.CTIInfo.port;
		var  isDefault = _index.CTIInfo.isDefault;//缺省业务标志值
		var  ctiId = _index.CTIInfo.CTIId;
		if(isDefault == "1"){//此种情况走nginx代理
			ctiurl= Constants.CCACSURL+proxyIP+":"+proxyPort+"/ccacs/" + ctiId;
    	}else{                                 
    		ctiurl= Constants.CCACSURL+ip+":"+port+"/ccacs";//跨域直连
    	};
    	_browser = myBrowser();
    	 //去掉弹出框的一些没用的样式，减小播放条的大小
    	reSetDialog();
    	eventInit();
    	//将根节点赋值给接口
    	this.content = $el;
	}
	
	var eventInit = function(){
		//播放
		$el.on("click", ".recordPalyBn", function(){
        	var arr = ["recordStopBn","recordFBBn","recordFFBn"];
    		enableButton(arr);
    		$(".recordPalyBn").css("display","none");
        	$(".recordPauseBn").css("display","inline-block");
        	var status = false;
        	var timeNow = new Date();
        	var time = timeNow.format("yyyy-MM-dd hh:mm:ss");
        	if("IE"==_browser){
        		$.ajax({
					url:ctiurl+'/ws/quality/play',
					type:'post',
					data:filepath,
					crossDomain: true,
					async:true,
					contentType:"application/json; charset=utf-8",
					success:function(data){
						failId = data.result;
						if(data.result=="0"){
							var arr = ["recordStopBn","recordFBBn","recordFFBn"];
							enableButton(arr);
							$(".recordPalyBn").css("display","none");
							$(".recordPauseBn").css("display","inline-block");
							playFlag++;
							status = true;
							status_log='1';
	    	    			mLogInfo.call(this);
						}else{
							_index.popAlert('放音失败！');
							var arr = ["recordStopBn","recordFBBn","recordFFBn"];
							disableButton(arr);
							$(".recordPalyBn").css("display","inline-block");
							$(".recordPauseBn").css("display","none");
							status_log='0';
	    	    			mLogInfo.call(this);
						}
					},
					error:function(jqXHR,textStatus,errorThrown){
						_index.popAlert("放音请求失败");
						var arr = ["recordStopBn","recordFBBn","recordFFBn"];
						disableButton(arr);
						$(".recordPalyBn").css("display","inline-block");
						$(".recordPauseBn").css("display","none");
					}
				});
			}else{
				$.ajax({
					url:ctiurl+'/ws/quality/play',
					type:'post',
					data:filepath,
					crossDomain: true,
					xhrFields: {
						withCredentials: true
					},
					async:true,
					contentType:"application/json; charset=utf-8",
					success:function(data){
						failId = data.result;
						if(data.result=="0"){
							var arr = ["recordStopBn","recordFBBn","recordFFBn"];
							enableButton(arr);
							$(".recordPalyBn").css("display","none");
							$(".recordPauseBn").css("display","inline-block");
							playFlag++;
							status = true;
							status_log='1';
	    	    			mLogInfo.call(this);
						}else{
							_index.popAlert('放音失败！');
							var arr = ["recordStopBn","recordFBBn","recordFFBn"];
							disableButton(arr);
							$(".recordPalyBn").css("display","inline-block");
							$(".recordPauseBn").css("display","none");
							status_log='0';
	    	    			mLogInfo.call(this);
						}
					},
					error:function(jqXHR,textStatus,errorThrown){
						_index.popAlert("放音请求失败");
						var arr = ["recordStopBn","recordFBBn","recordFFBn"];
						disableButton(arr);
						$(".recordPalyBn").css("display","inline-block");
						$(".recordPauseBn").css("display","none");
					}
				});
			}
        
		});
		
    	//快进Start
		$el.on("mousedown", ".recordFFBn", function(){
    		if(enableFastForward){
    			enableFastForward = false;
    			//pressdown style
//        		$(".recordFFBn").css("background","url(/ngcs/src/assets/img/appNew/playButton.png) no-repeat -328px -96px");
    			$(".recordFFBn").css("display","none");
            	$(".recordFFBnPressDown").css("display","inline-block");              			
    			if(playFlag != 0){
    				if("IE"==_browser){
    					$.ajax({
    						url:ctiurl+'/ws/quality/forwardplay',
    						type:'post',
    						data:"{}",
    						crossDomain: true,
    						async:true,
    						contentType:"application/json; charset=utf-8",
    						success:function(data){
    							if(data.result!="0"){
    								_index.popAlert('快进失败！'+data.result);
    								enableFastForward = true;
    							}
    							
    							setTimeout(function(){
    								enableFastForward = true;
    								//up style
    								$(".recordFFBnPressDown").css("display","none");
    								$(".recordFFBn").css("display","inline-block");
    								
    							},200);
    						},
    						error:function(jqXHR,textStatus,errorThrown){
    							_index.popAlert("快进请求失败");
    							$(".recordFFBnPressDown").css("display","none");
    							$(".recordFFBn").css("display","inline-block");
    							enableFastForward = true;
    						}
    					});
    				}else{
    					$.ajax({
    						url:ctiurl+'/ws/quality/forwardplay',
    						type:'post',
    						data:"{}",
    						crossDomain: true,
    						xhrFields: {
    							withCredentials: true
    						},
    						async:true,
    						contentType:"application/json; charset=utf-8",
    						success:function(data){
    							if(data.result!="0"){
    								_index.popAlert('快进失败！'+data.result);
    								enableFastForward = true;
    							}
    							
    							setTimeout(function(){
    								enableFastForward = true;
    								//up style
    								$(".recordFFBnPressDown").css("display","none");
    								$(".recordFFBn").css("display","inline-block");
    								
    							},200);
    						},
    						error:function(jqXHR,textStatus,errorThrown){
    							_index.popAlert("快进请求失败");
    							$(".recordFFBnPressDown").css("display","none");
    							$(".recordFFBn").css("display","inline-block");
    							enableFastForward = true;
    						}
    					});
    				}
            	};
            }
    	});
    	//快进End
    	
        //快退
		$el.on("mousedown", ".recordFBBn", function(){
			if(enableBackForward){
				enableBackForward = false;
				$(".recordFBBn").css("display","none");
            	$(".recordFBBnPressDown").css("display","inline-block");            			
    			if(playFlag != 0){
    				if("IE"==_browser){
    					$.ajax({
    						url:ctiurl+'/ws/quality/bakwardplay',
    						type:'post',
    						data:"{}",
    						crossDomain: true,
    						async:true,
    						contentType:"application/json; charset=utf-8",
    						success:function(data){
    							if(data.result!="0"){
    								_index.popAlert('快退失败！'+data.result);
    								enableBackForward = true;
    							}
    							setTimeout(function(){
    								$(".recordFBBnPressDown").css("display","none");
    								$(".recordFBBn").css("display","inline-block");   			                    		
    								enableBackForward = true;
    							},200);
    						},
    						error:function(jqXHR,textStatus,errorThrown){
    							_index.popAlert("快退失败");
    							$(".recordFBBnPressDown").css("display","none");
    							$(".recordFBBn").css("display","inline-block");  
    							enableBackForward = true;
    						}
    					});
    				}else{
    					$.ajax({
    						url:ctiurl+'/ws/quality/bakwardplay',
    						type:'post',
    						data:"{}",
    						crossDomain: true,
    						xhrFields: {
    							withCredentials: true
    						},
    						async:true,
    						contentType:"application/json; charset=utf-8",
    						success:function(data){
    							if(data.result!="0"){
    								_index.popAlert('快退失败！'+data.result);
    								enableBackForward = true;
    							}
    							setTimeout(function(){
    								$(".recordFBBnPressDown").css("display","none");
    								$(".recordFBBn").css("display","inline-block");   			                    		
    								enableBackForward = true;
    							},200);
    						},
    						error:function(jqXHR,textStatus,errorThrown){
    							_index.popAlert("快退失败");
    							$(".recordFBBnPressDown").css("display","none");
    							$(".recordFBBn").css("display","inline-block");  
    							enableBackForward = true;
    						}
    					});
    				}
            	}
			}
		});
		//暂停
		$el.on("click", ".recordPauseBn", function(){
            if(playFlag != 0){
            	if("IE"==_browser){
            		$.ajax({
						url:ctiurl+'/ws/quality/pauseplay/',
						type:'post',
						data:"{}",
						crossDomain: true,
						async:false,
						contentType:"application/json; charset=utf-8",
						success:function(data){
							if(data.result = "0"){
								$(".recordPauseBn").css("display","none");
								$(".recordGoOnBn").css("display","inline-block");
								$(".recordFFBn").css("display","none");
								$(".disrecordFFBn").css("display","inline-block");
								$(".recordFBBn").css("display","none");
								$(".disrecordFBBn").css("display","inline-block");
							}else{
								_index.popAlert('暂停失败!');
							}
						},
						error:function(jqXHR,textStatus,errorThrown){
							_index.popAlert("暂停请求失败");
						}
					});
				}else{
					$.ajax({
						url:ctiurl+'/ws/quality/pauseplay/',
						type:'post',
						data:"{}",
						crossDomain: true,
						xhrFields: {
							withCredentials: true
						},
						async:false,
						contentType:"application/json; charset=utf-8",
						success:function(data){
							if(data.result = "0"){
								$(".recordPauseBn").css("display","none");
								$(".recordGoOnBn").css("display","inline-block");
								$(".recordFFBn").css("display","none");
								$(".disrecordFFBn").css("display","inline-block");
								$(".recordFBBn").css("display","none");
								$(".disrecordFBBn").css("display","inline-block");
							}else{
								_index.popAlert('暂停失败!');
							}
						},
						error:function(jqXHR,textStatus,errorThrown){
							_index.popAlert("暂停请求失败");
						}
					});
				}
        	}
        
		});
		
        //继续
		$el.on("click", ".recordGoOnBn", function(){
        	if(playFlag != 0){
        		if("IE"==_browser){
        			$.ajax({
						url:ctiurl+'/ws/quality/resumeplay/',
						type:'post',
						data:"{}",
						crossDomain: true,
						async:false,
						contentType:"application/json; charset=utf-8",
						success:function(data){
							if(data.result ="0"){
								$(".recordGoOnBn").css("display","none");
								$(".recordPauseBn").css("display","inline-block");
								$(".disrecordFFBn").css("display","none");
								$(".recordFFBn").css("display","inline-block");
								$(".disrecordFBBn").css("display","none");
								$(".recordFBBn").css("display","inline-block");
							}else{
								_index.popAlert('继续放音失败！');
							}
						},
						error:function(jqXHR,textStatus,errorThrown){
							_index.popAlert('继续放音请求失败！');
						}
					});
				}else{
					$.ajax({
						url:ctiurl+'/ws/quality/resumeplay/',
						type:'post',
						data:"{}",
						crossDomain: true,
						xhrFields: {
							withCredentials: true
						},
						async:false,
						contentType:"application/json; charset=utf-8",
						success:function(data){
							if(data.result ="0"){
								$(".recordGoOnBn").css("display","none");
								$(".recordPauseBn").css("display","inline-block");
								$(".disrecordFFBn").css("display","none");
								$(".recordFFBn").css("display","inline-block");
								$(".disrecordFBBn").css("display","none");
								$(".recordFBBn").css("display","inline-block");
							}else{
								_index.popAlert('继续放音失败！');
							}
						},
						error:function(jqXHR,textStatus,errorThrown){
							_index.popAlert('继续放音请求失败！');
						}
					});
				}
        	}
        
		});
		
        //停止
		$el.on("click", ".recordStopBn", function(){
        	if(playFlag != 0){
        		if("IE"==_browser){
        			$.ajax({
						url:ctiurl+'/ws/quality/stopplay/',
						type:'post',
						data:"{}",
						crossDomain: true,
						async:true,
						contentType:"application/json; charset=utf-8",
						success:function(data){
							if(data.result=="0"||data.result=="25002"){
								$(".recordStopBn").css("display","none");
								$(".disrecordStopBn").css("display","inline-block");
								$(".recordFFBn").css("display","none");
								$(".disrecordFFBn").css("display","inline-block");
								$(".recordFBBn").css("display","none");
								$(".disrecordFBBn").css("display","inline-block");
							}else{
								_index.popAlert('停止放音失败！');
							}
						},
						error:function(XMLHttpRequest, textStatus, errorThrown){
							_index.popAlert("快进请求失败");
							$(".recordFFBnPressDown").css("display","none");
							$(".recordFFBn").css("display","inline-block");
							enableFastForward = true;
						}
					});
				}else{
					$.ajax({
						url:ctiurl+'/ws/quality/stopplay/',
						type:'post',
						data:"{}",
						crossDomain: true,
						xhrFields: {
							withCredentials: true
						},
						async:true,
						contentType:"application/json; charset=utf-8",
						success:function(data){
							if(data.result=="0"||data.result=="25002"){
								$(".recordStopBn").css("display","none");
								$(".disrecordStopBn").css("display","inline-block");
								$(".recordFFBn").css("display","none");
								$(".disrecordFFBn").css("display","inline-block");
								$(".recordFBBn").css("display","none");
								$(".disrecordFBBn").css("display","inline-block");
							}else{
								_index.popAlert('停止放音失败！');
							}
						},
						error:function(XMLHttpRequest, textStatus, errorThrown){
							_index.popAlert("快进请求失败");
							$(".recordFFBnPressDown").css("display","none");
							$(".recordFFBn").css("display","inline-block");
							enableFastForward = true;
						}
					});
				}
        	}
        
		});
        $('.recordPlayCss').click(clickClose);
    };
	
	reSetDialog = function(){
    	$('.ui-dialog-close').removeClass().addClass("recordPlayCss");
    	$(".recordPlayCss").unbind("click");
        $(".ui-dialog-title").css({"padding":"0px","top":"0px"});
        $(".ui-dialog-body").css("padding","1px");
    }
	 var myBrowser=function(){
 		var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
 		var isOpera = userAgent.indexOf("Opera") > -1
			if (userAgent.indexOf("Opera") > -1) {
			    return "Opera"
			}; //判断是否Opera浏览器
			if (userAgent.indexOf("Firefox") > -1) {
				return "FF";
			};//判断是否Firefox浏览器
			if (userAgent.indexOf("Chrome") > -1){
				return "Chrome";
			};//判断是否Chrome浏览器
			if (userAgent.indexOf("Safari") > -1) {
				return "Safari";
			};//判断是否Safari浏览器
			if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
     		return "IE";
 		}; //判断是否IE浏览器
		}
     var enableButton = function(arr){
     	for(var i=0;i<arr.length;i++){
     		$(".dis"+arr[i]).css("display","none");
     		$("."+arr[i]).css("display","inline-block");
     	}
     }
     var disableButton = function(arr){
     	for(var i=0;i<arr.length;i++){
     		$(".dis"+arr[i]).css("display","inline-block");
     		$("."+arr[i]).css("display","none");
     	}
     }
     
     var clickClose = function(){
	        	if(playFlag != 0){
	        		$('.recordStopBn').click();
	        	}
	        	//_options.playUrl.playBtn.css({"background":"#3a8be0","border-color": "#3a8be0","cursor":"pointer"});
	        	//_options.playUrl.playBtn.attr("disabled", false);
	        	initDialogButton();
	        	_index.destroyDialog();
     }
     
     var initDialogButton = function(){
     	$(".recordStopBn,.recordFBBn,.recordFFBn").css("display","none");
     	$(".disrecordStopBn,.disrecordFBBn,.disrecordFFBn").css("display","inline-block");
     }
   //添加管理日志
 	var  mLogInfo= function(){
 		var mLog = new ManagementLog();
 		mLog.setIsExt(true);
 		mLog.setOperator(_index.getUserInfo()['staffId']);//操作员工帐号
 		mLog.setOperBeginTime(_index.utilJS.getCurrentTime());
 		mLog.setOperId("020");
 		mLog.setStatus(status_log);
 		mLog.setServiceTypeId(_index.CTIInfo.serviceTypeId);
 		mLog.setSerialNo(serialNo);
 		mLog.setRecordFilePath(fileName);
 		mLog.setReasonId(failId);
 		mLog.logSavingForTransfer(mLog);
 	}
	return objClass;	
})