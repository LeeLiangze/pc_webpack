define(['Util','timer','./showWaitNum','../index/constants/mediaConstants',
'../../tpl/queue/QueueHead.tpl',
'../../assets/css/queue/queueTop.css'
],function(Util,Timer,ShowWaitNum,MediaConstants,QueueHeadTpl){
//设置变量储存this指向
	var selfs;
	//定义对象存储等待数的渠道，以及渠道Logo，等待数
	var datas = {};
  var showWaitNum =null,timer = null;
  //设置对应对象储存等待数详情
  var casheSkillInfo =[];
  var _index,timer1;
  var IP= null, port= null,CTIId= null,isDefault=null,ProxyIP=null,ProxyPort=null;
  var num = 0,timeNum = 0,totalQueueSize = 0;
  var arrAll = [];
  var skillsAll;
  var objClass = function(options){
  	   _index = options;
  	   isDefault=_index.CTIInfo.isDefault;//缺省业务标志值
		ProxyIP=_index.CTIInfo.ProxyIP;//代理IP
        ProxyPort =_index.CTIInfo.ProxyPort;//代理端口
        IP = _index.CTIInfo.IP;
		port = _index.CTIInfo.port;
		CTIId = _index.CTIInfo.CTIId;
  	   	 //传入对应的参数进行判断是否需要对应的等待数
  	    this.$el = $(QueueHeadTpl);
  	//改变this指向
       this.eventInit.call(this);
     //将对应的THIS指向给selfs
		selfs = this;
  };
   $.extend(objClass.prototype,{
   	   //dom元素事件初始化
  		eventInit: function(){
					this.$el.on('mouseenter','#queue_skills_info',$.proxy(this.showWait,this));
//					设置一个对应的遮盖标签遮挡保证对应的鼠标下拉后不消失
					this.$el.on('mouseleave','#waitFlag',$.proxy(this.removeWait,this));
					this.$el.on('click','.TimeTilte',$.proxy(this.stateClick,this));
  		},
  		//定时刷新等待数
  		timedRefresh:function(){
  			//更改对应的刷新等待数的外部接口
  			//设置入参随机数
  				//定时器清理 避免请求刷新越来越快
  			    var statusText = $(".queueTime .TimeTilte").text();
				if(!statusText || statusText == "未签入"){
						clearInterval(timer1);
						return;
					}else{
						selfs.refreshSkill.call(this);
					};
  					  if(timer1){
  	  					clearInterval(timer1);
  	  					}
  	  					timer1 = setInterval(function(){
  	  					var statusText = $(".queueTime .TimeTilte").text();
  	  					if(!statusText || statusText == "未签入"){
	  							clearInterval(timer1);
	  							return;
	  						}else{
	  							selfs.refreshSkill.call(this);
	  						}
  	  					},5000)
  			},
  		//刷新等待数（CTI接口）
  		refreshSkill:function(){
  			_index.serialNumber.resetSerialNumber(); //重置序列号
	  	  	var options= _index.serialNumber.getSerialNumber();//获取随机数
	  	  	//入参对象
  			var datas = {
  				"opserialNo":options
  			};
  			var sign_url="";
	         if(isDefault=="1"){//此种情况走nginx代理
	            sign_url=MediaConstants.CCACSURL+proxyIP+":"+proxyPort+"/ccacs/"+CTIId+"/ws/query/queryacdstatus";
	         }else{                                 
	            sign_url= MediaConstants.CCACSURL+ip+":"+port+"/ccacs/ws/query/queryacdstatus"; //跨域直连
	         };
	         //发起对于CTI的请求
	         if(_index.queue.browserName==="IE"){  //注意index的
		         $.ajax({  
			    		url : sign_url ,
			            type : 'post',  
			            timeout : 20000,
			            data :  JSON.stringify(datas), 
			            crossDomain: true,
			            contentType:"application/json; charset=utf-8",
			            success : $.proxy(function(jsonData){
			            	selfs.waitSkill(jsonData);
			     		   	 },this),
			     		   	 error:function( XMLHttpRequest, textStatus, errorThrown) {
								 var errorParams = {
										 "XMLHttpRequest":XMLHttpRequest,
										 "textStatus":textStatus,
										 "errorThrown":errorThrown
								 };
			     		   	 }
			            });
				}else{
					//其他浏览器逻辑
			         $.ajax({  
				    		url : sign_url ,
				            type : 'post',  
				            timeout : 20000,
				            data :  JSON.stringify(datas), 
				            crossDomain: true,
				            xhrFields: {
				                  withCredentials: true
				                   },
				            contentType:"application/json; charset=utf-8",
				            success : $.proxy(function(jsonData){
				            	selfs.waitSkill(jsonData);
				     		   	 },this),
				     		   	 error:function( XMLHttpRequest, textStatus, errorThrown) {
									 var errorParams = {
											 "XMLHttpRequest":XMLHttpRequest,
											 "textStatus":textStatus,
											 "errorThrown":errorThrown
									 };
				     		   	 }
				            });
				}

  		},
  		waitSkill:function(jsonData){
  		//当前客服下的所有等待人总数
        	totalQueueSize = 0;
        	if(jsonData.result == "0"){
        		jsonData = jsonData.hwAcdInfos;
//        	    获取坐席下所有技能以便做技能签出签入转换技能增减
        		skillsAll= _index.CTIInfo.skillInfos;
        		var skillAlllength = skillsAll.length;
        		for(var i =0;i<skillAlllength;i++){
        			arrAll.push(skillsAll[i]);
        		};
//        		存储第一次签入时的技能队列
        		var skillArr = [];
      			var skillSignIn = _index.CTIInfo.signInSkills;
      			var skillLength = skillSignIn.length;
      			if(skillLength >0){
      				for(var i =0; i<skillLength;i++){
      					var skillName ;
//      					重设技能时不存在对应的技能名称 只能将对应的skillid与skillName保存在数组中进行判断，skillid相等就出对应的skillName
      					if(skillSignIn[i].skillName != undefined){
      						var arr= [];
      						arr.push(skillSignIn[i]);
      						skillName = skillSignIn[i].skillName;
      					}else{
//      						拿到对应的技能字符串重设技能后只有对应的SkillId不含有skillName
      						var arr1 = skillSignIn[i].skillId;
      							for(var j = 0;j<arrAll.length;j++){
          							if(arrAll[j].skillId == arr1){
          								skillName = arrAll[j].skillName;
          							}
          						}
      					}
      	  				skillArr.push(skillName);
      	  			}
      			};
//      			储存对应的CTI返回的数据
      			var skillCTI = [];
      			var jsonLength = jsonData.length;
      			for(var j=0;j<jsonLength;j++){
      				if(jsonData[j] != null){
      					skillCTI.push(jsonData[j]);
      				}
      			};
//      			存放对应的渠道等待数，渠道名称
//      			对相应的技能名称进行对比
      			casheSkillInfo = [];
      			for(var i = 0;i<skillArr.length;i++){
      				for(var j =0;j<skillCTI.length;j++){
      					if( skillArr[i] == skillCTI[j].skillDescrip){
      						var skillObj = {};
      						skillObj.skillName = skillArr[i];
      						skillObj.queueSize = skillCTI[j].queueSize;
      						totalQueueSize += skillObj.queueSize;
      						casheSkillInfo.push(skillObj);
      					}
      				}
      			};
      			if($(".queueHeadOther").css("display") == "none"){
      				$("#queue_skills_info .WaitNum").html(totalQueueSize);
      			}else{
      				$(".queueHeadOther .WaitNum").html(totalQueueSize);
      			}
				  //将对应datas数据放给气泡提示框的js中
				  if(casheSkillInfo.length >0){
					  showWaitNum = new ShowWaitNum(casheSkillInfo);
				  }
        		}
  		},
  		//移入事件显示等待数内容
  		showWait: function(){
  			if($(".TimeTilte").html() != "未签入"){
  			if(showWaitNum){
//  				Util.dialog.bubble({
//  						id:"wait",
//  			      		element:$('#queue_skills_info strong'),
//  			      		quickClose:true, 
//  			      		align:'bottom left',
//  			      		padding:0,
//  			      		content:showWaitNum.content,
//  			   			});
  				var waitContent = showWaitNum.content;
//  				填充内容
  				$("#waitBox #waitContent").append(waitContent);
  			  $($(".waitNumContent").parent()).css("padding","0 10px");
  				$("#waitBox").show();
//  				控制对应的遮盖层为自动适应填充的标签高度*1.5
  				var heightFlag = $("#waitBox #waitContent").height()*1.5;
  				var widthFlag = $("#waitBox #waitContent").width()*1.3;
  				$("#waitFlag").css("height",heightFlag+"px");
  				$("#waitFlag").css("width",widthFlag+"px");
  				}
  			}
  		},
  		removeWait:function(){
  			$("#waitBox").hide();
//  			滞空标签内容
  			$("#waitBox #waitContent").empty();
  		},
  		//设置对应的计时器事件
  		startTime:function(event){
            return {
                //开始计时
                start:function(){
		    		if(timer){clearInterval(timer);}
		    		timer=selfs.timerInit.call(this);
                },
                //结束计时
                end:function(){
                    clearInterval(timer);
                },
                //倒计时
                countDown:function(second,callback){
                    if(timer){clearInterval(timer);}
                    timer=selfs.timerInit.call(this,second,callback);
                }
            }
  		},
  		//设置计时器开启
  		timerInit:function(second,callback){
  			var timer;
            if (timer){
                clearInterval(timer);
            }
            var seconds=second?second:0;
            var $text = $('#timer',this.$el);
            timer = setInterval(function(){
            	//对应的休息时间设置
            	$('#tidying_surplus_time',this.$el).val(seconds);
                var m=Math.floor(seconds/60);
                var s=seconds-m*60;
                $('#timer').html((m<10?("0"+m):m)+":"+(s<10?("0"+s):s));
                second?((seconds==0)?(clearInterval(timer),callback&&callback()):(seconds--)):seconds++;
            },1000);
            return timer;
  		},
    	//设置不同状态进行更改对应的文字提示 字体颜色改变
    	setStatus : function(text){
    		switch (text){
    			case '空闲':
    			    $(".TimeTilte",this.$el ).html("空闲");
    			    selfs.changeWaitColor("#90C31F");
    			    $(".TimeTilte",this.$el).css("cursor","default");
    				break;
    			case '休息中':
    			    $(".TimeTilte",this.$el ).html("休息中");
    			    selfs.changeWaitColor("#0085D0");
    			    $(".TimeTilte",this.$el).css("cursor","default");
    				break;
    			case '忙碌':
    			    $(".TimeTilte",this.$el ).html("忙碌");
    			    selfs.changeWaitColor("#F65A56");
    			    $(".TimeTilte",this.$el).css("cursor","default");
    				break;
    			case '通话中':
    			    $(".TimeTilte",this.$el ).html("通话中");
    			    selfs.changeWaitColor("#F65A56");
    			    $(".TimeTilte",this.$el).css("cursor","default");
    				break;
    			case '整理态':
    			    $(".TimeTilte",this.$el ).html("整理态");
    			    selfs.changeWaitColor("#FFAE00");
    			    $(".TimeTilte",this.$el).css("cursor","pointer");
    				break;
    			case '待接听':
    			    $(".TimeTilte",this.$el ).html("待接听");
    			    selfs.changeWaitColor("#FFAE00");
    			    $(".TimeTilte",this.$el).css("cursor","pointer");
    				break;
    			case '未签入':
    			    $(".TimeTilte",this.$el ).html("未签入");
    			    $("#timer",this.$el ).html("");
    			    $(".TimeTilte",this.$el).css("cursor","default");
    				break;
    			default:
    				break;
    		}
    	},
    	changeWaitColor:function(colors){
    		$("#timer",this.$el ).css("color",colors);
		    selfs.timedRefresh.call(this);
    	},
    	sameTime:function(timers){
    	   if (timer){
                clearInterval(timer);
           };
           if(timers == "[离线]"){
           	  _index.clientInfo.timerWait.startTime().start();
           }else{
           _index.clientInfo.timerWait.startTime().end();
           $("#timer",this.$el ).html(timers);
           }
    	},
    	//对应按钮执行事件
    	stateClick:function(){
    		var text = $(".TimeTilte",this.$el ).text();
    		selfs.changeState(text);
    	},
    	//改变对应的整理态状态
    	changeState:function(text){
    		isDefault=_index.CTIInfo.isDefault;//缺省业务标志值
    		ProxyIP=_index.CTIInfo.ProxyIP;//代理IP
            ProxyPort =_index.CTIInfo.ProxyPort;//代理端口
            IP = _index.CTIInfo.IP;
    		port = _index.CTIInfo.port;
    		CTIId = _index.CTIInfo.CTIId;
    		switch(text){
                    case "待接听":
                        // 来电待接听
        var callIds = _index.ctiInit._callIds.callIds;
        var callIdArr = callIds;
        var url = "";
        if(isDefault == "1"){
        	url = MediaConstants.CCACSURL + ProxyIP + ":" + ProxyPort + "/ccacs/" + CTIId + "/ws/call/answer";
        }else{
        	url = MediaConstants.CCACSURL + IP + ":" + port + "/ccacs/ws/call/answer";//跨域直连
        };
         var aa = 0;
    	$.each(callIds,function(n,v){
    		var option = _index.serialNumber.getSerialNumber();//获取随机数
	    	var data={"callId":v,"opserialNo":option};
	    	if(_index.queue.browserName==="IE"){  //注意index的
				//IE逻辑
		    	$.ajax({ 
		    		url : url ,
		    		type : 'post', 
		    		data : JSON.stringify(data),
		    		crossDomain:true,
		    		contentType:"application/json; charset=utf-8",
		    		success : function(json) {
	    	    		if(json.result=='0'){
	    	    			aa = -1;
	    	    			_index.ctiInit._callIds.removeCallId(v);
				        }else{
				        _index.ctiInit._callIds.removeCallId(v);
				        var options = _index.serialNumber.getSerialNumber();	
				        var datas = {"opserialNo":options};
				        if(isDefault == "1"){
				         	url = MediaConstants.CCACSURL + ProxyIP + ":" + ProxyPort + "/ccacs/" +  CTIId + "/ws/query/agentstate";
				         }else{
				         	url = MediaConstants.CCACSURL + IP + ":" + port + "/ccacs//ws/query/agentstate";//跨域直连
				         };
	                    	$.ajax({  
	                 		url : url ,
	                        type : 'post',
	                        crossDomain:true,
	                         data :  JSON.stringify(datas), 
	                         contentType:"application/json; charset=utf-8",
	                         success : function(data) {
	                        	var state = data.state;
	                        	if(state){
		    						if(state=="3"){
		    								selfs.setStatus("忙碌");
		    								_index.clientInfo.timerWait.startTime().start();
		    							}else if(state=="4"){
		    								selfs.setStatus("空闲");
		    								_index.clientInfo.timerWait.startTime().start();
		    							}else if(state=="7"){
		    								selfs.setStatus("通话中");
		    							}
		    						}else {
		    							_index.popAlert("获取坐席状态失败","友情提示");
		    						}
		    					},
		    					error : function( XMLHttpRequest, textStatus, errorThrown) {
	            	    			var errorParams = {
	            	    					"XMLHttpRequest":XMLHttpRequest,
	            	    					"textStatus":textStatus,
	            	    					"errorThrown":errorThrown
	            	    			};
	            	    		}
		    				})
		    			}
	    	    		var paramsToProvince = {
	    						"resultCode" : json.result,
	    						"resultMessage" : "坐席应答事件",
	    						"reserved1" : "",
	    						"reserved2" : "",
	    						"reserved3" : ""
	    				};
	    				_index.postMessage.sendToProvince("agentAnswer", paramsToProvince);
		    		},
		    		error : function( XMLHttpRequest, textStatus, errorThrown) {
		    			var errorParams = {
		    					"XMLHttpRequest":XMLHttpRequest,
		    					"textStatus":textStatus,
		    					"errorThrown":errorThrown
		    			};
		    		}
		    	});
			}else{
				//其他浏览器逻辑
		    	$.ajax({ 
		    		url : url ,
		    		type : 'post', 
		    		data : JSON.stringify(data),
		    		crossDomain:true,
		    		xhrFields:{
		    			withCredentials:true
		    		},
		    		contentType:"application/json; charset=utf-8",
		    		success : function(json) {
		    			if(json.result=='0'){
	    	    			aa = -1;
	    	    			_index.ctiInit._callIds.removeCallId(v);
				        }else{
				        _index.ctiInit._callIds.removeCallId(v);
				        var options = _index.serialNumber.getSerialNumber();	
				        var datas = {"opserialNo":options};
				        if(isDefault == "1"){
				         	url = MediaConstants.CCACSURL + ProxyIP + ":" + ProxyPort + "/ccacs/" +  CTIId + "/ws/query/agentstate";
				         }else{
				         	url = MediaConstants.CCACSURL + IP + ":" + port + "/ccacs//ws/query/agentstate";//跨域直连
				         };
	                    	$.ajax({  
	                 		url : url ,
	                        type : 'post',
	                        crossDomain:true,
	          	    		xhrFields:{
	          	    			withCredentials:true
	          	    		},
	                         data :  JSON.stringify(datas), 
	                         contentType:"application/json; charset=utf-8",
	                         success : function(data) {
	                        	var state = data.state;
	                        	if(state){
		    						if(state=="3"){
		    								selfs.setStatus("忙碌");
		    								_index.clientInfo.timerWait.startTime().start();
		    							}else if(state=="4"){
		    								selfs.setStatus("空闲");
		    								_index.clientInfo.timerWait.startTime().start();
		    							}else if(state=="7"){
		    								selfs.setStatus("通话中");
		    							}
		    						}else {
		    							_index.popAlert("获取坐席状态失败","友情提示");
		    						}
		    					},
		    					error : function( XMLHttpRequest, textStatus, errorThrown) {
	            	    			var errorParams = {
	            	    					"XMLHttpRequest":XMLHttpRequest,
	            	    					"textStatus":textStatus,
	            	    					"errorThrown":errorThrown
	            	    			};
	            	    		}
		    				})
		    			}
	    	    		var paramsToProvince = {
	    						"resultCode" : json.result,
	    						"resultMessage" : "坐席应答事件",
	    						"reserved1" : "",
	    						"reserved2" : "",
	    						"reserved3" : ""
	    				};
	    				_index.postMessage.sendToProvince("agentAnswer", paramsToProvince);
		    		},
		    		error : function( XMLHttpRequest, textStatus, errorThrown) {
		    			var errorParams = {
		    					"XMLHttpRequest":XMLHttpRequest,
		    					"textStatus":textStatus,
		    					"errorThrown":errorThrown
		    			};
		    		}
		    	});
			}
  	     });
    	if(aa==0){
    	}
        break;
                    case "整理态":
        var sign_url = "";
        if(isDefault == "1"){
        	sign_url = MediaConstants.CCACSURL + ProxyIP + ":" + ProxyPort + "/ccacs/" +  CTIId + "/ws/agent/setagentstate";
        }else{
        	sign_url = MediaConstants.CCACSURL + IP + ":" + port + "/ccacs/ws/agent/setagentstate";//跨域直连
        };                  		 
        var option = _index.serialNumber.getSerialNumber();   
        var data={"state":"5","flag":"0","opserialNo":option};
        if(_index.queue.browserName==="IE"){  //注意index的
			//IE逻辑
			$.ajax({ 
	    		url : sign_url ,
	    		type : 'post', 
	    		data : JSON.stringify(data),
	    		crossDomain:true,
	    		contentType:"application/json; charset=utf-8",
	    		success : function(json) {
    	    		if(json.result=='0'){
    	    			_index.CallingInfoMap.setIsClickTidyStatus("0");
    	    			_index.clientInfo.timerWait.startTime().start();
    	    			$('#tidying_model').val("999");
				        }
		         	}
	    	});
		}else{
			//其他浏览器逻辑
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
    	    		if(json.result=='0'){
    	    			_index.CallingInfoMap.setIsClickTidyStatus("0");
    	    			_index.clientInfo.timerWait.startTime().start();
    	    			$('#tidying_model').val("999");
				        }
		         	}
	    	});
		}
                        break;
                }
    	},
    	nowStatue:function(){
    		var statues = null;
    		statues = $(".TimeTilte",this.$el).html();
    		return statues;
    	},
    })
	return objClass;
})