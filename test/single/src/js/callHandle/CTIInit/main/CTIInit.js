/**
 * Created by lizhao on 2016/03/14
 */

define(['Util',"Compts",'../../../index/constants/mediaConstants','../tool/ErrorcodeSearch',
        '../tool/AudioCallIds','../tool/CallAffixInfos',
        '../tool/AudioNotes','../polling/polling',
        '../tool/SkillsInfo','../tool/CurrentCallIds',
        '../tool/requestCTI','../tool/base64','../tool/CTIHW.tpl'],
    function(Util,Compts,MediaConstants,ErrorcodeSearch,AudioCallIds,CallAffixInfos,AudioNotes,
    		Polling,CurrentSkillInfos,CurrentCallIds,RequestCTI,Base64,ctihwTpl){
	var _index;
	//CTI信息
	var comUI=null,staffId= null,ip= null, port= null, ccId= null, ctiId= null, vdnId= null, loginstate=null, workNo= null,password =null,
	audioPhoneNum =null, openeyeAccount= null,sipServer =null, openeyePsw =null, audioType = null,isDefault=null,proxyIP=null,proxyPort=null;
	
	//定时任务
	var timeOutId;
	var _signResult = "WAIT_SIGNIN";//0:签出成功，1：签出失败，00，签入成功，01签入失败，"WAIT_RESULT":等待结果,"WAIT_SIGNIN"：等待签入
	//签入失败或未签入时需要置灰的按钮
	var arr = ['freeStatusBtn','acceptRequestBtn','comprehensiveComBtn','endCallBtn','callHoldBtn',
	           'startMuteBtn','tidyStatusBtn','passWordValidateBtn','callOutBtn','transferBtn',
	           'restBtn'];
//	var arr = ["OperatorStatus","AcceptRequest","Communication","CallEnd","CallHold","CallMute","StatusType","AnswerType","PasswordValidate","ManualWork","RestType"];
	/* 使综合接续按钮可点击 dou 0627 start */
	// var arrState  =  ["Communication","CallEnd","CallHold","CallMute","PasswordValidate"]
//	var arrState  =  ["CallEnd","CallHold","CallMute","PasswordValidate"];
	// 签入成功时接续按钮的数组
	var arrState = ['endCallBtn','callHoldBtn','startMuteBtn','passWordValidateBtn','transferBtn'];
	// 需要一直可用的按钮
	var enableArr = ['acceptRequestBtn','sendMessageBtn'];
	/* 使综合接续按钮可点击 dou 0627 end */
	var PHONE_TYPE = "1"; //电话座席  add by wwx160457 for audio business at 201606211133
	var SIP_TYPE = "2"; //SIP座席  add by wwx160457 for audio business at 201606211133
	var base64; //加解密算法 add by wwx160457 for audio business at 201606271547
	/*
	 * add by wwx160457 for audio business at 201607071134
	 * uap登录状态，
	 * 初始值为:"UAP_UNLOGIN"; 
	 * 登录成功事件中，赋值为: "UAP_LOGIN_SUCCESS"; 
	 * 登录失败事件中，赋值为："UAP_LOGIN_FAILED";
	 * 注销成功事件中，赋值为："UAP_LOGINOUT_SUCCESS";
	 * 注销失败事件中，赋值为："UAP_LOGINOUT_FAILED".
	 */
	var uapLoginStatus = "UAP_UNLOGIN";
	var signOutType = "0";//签出类型：初始值为：“0”，签出cti; 注销、退出 引发的签出值为：“1”
	var playingRecord = false;//是否在播放录音，默认值为false 否； true 正在播放录音。 播放录音接口调用成功时，设置为true，停止播放录音事件中设置为false；351-7事件中，如果该值为true，则设置坐席状态为 通话中。
	
	var objClass = function(index){
		_index = index;
		//CTI信息
		comUI = _index.comMenu.comUI;
		staffId = _index.getUserInfo().staffId;
		ip = _index.CTIInfo.IP;
		port = _index.CTIInfo.port;
		ccId = _index.CTIInfo.CCID;
		ctiId = _index.CTIInfo.CTIId;
		vdnId = _index.CTIInfo.VDNId;
		loginstate = _index.CTIInfo.loginStatus;
		workNo = _index.CTIInfo.workNo;
		password = _index.CTIInfo.password;
		audioPhoneNum = _index.CTIInfo.audioPhoneNum;
		openeyeAccount = _index.CTIInfo.openeyeAccount;
		sipServer = _index.CTIInfo.sipServer;
		openeyePsw = _index.CTIInfo.openeyePsw;
		audioType = _index.CTIInfo.audioType;//语音座席类型 
		isDefault=_index.CTIInfo.isDefault;//缺省业务标志值
		proxyIP=_index.CTIInfo.ProxyIP;//代理IP
        proxyPort =_index.CTIInfo.ProxyPort;//代理端口
		
		$(document.body).append($(ctihwTpl)); //add by wwx160457 for sip at 201606211724
		
		this.WebVoipControlIF = WebVoipControlIF; //add by wwx160457 for sip at 201606211724
    	/**
    	 * 启动轮循： Polling.startPolling();  
    	 * 外部启动轮循调用方式： indexModule.header.communication.startPolling();
    	 * 外部停止轮循调用方式： indexModule.header.communication.stopPolling();
    	 */
		//搜索错误码封装
        this.ErrorcodeSearch = new ErrorcodeSearch();
        //语音信息缓存封装
        this.AudioCallIds = new AudioCallIds();
        //语音录音信息缓存
        this.CallAffixInfos = new CallAffixInfos();
        //语音历史信息缓存
        this.AudioNotes = new AudioNotes();
        //技能队列缓存
        this._skillInfos = new CurrentSkillInfos();
        //callIds缓存
        this._callIds=new CurrentCallIds();
        //轮询实例
    	this.PollingInstance = null;
    	//cti请求连接缓存
        this.requestCTI = new RequestCTI(index);//add by wwx160457 for audio business at 201607111105
        base64 = new Base64(); //加解密算法 add by wwx160457 for audio business at 201606271547
        
        //如果不签入不调用签入的方法，不启动轮询
        if(_index.CTIInfo.signIn == "true"){
        	timeOutId =  setTimeout(function(){
        		_index.showLoading(false);
       		},3000);
        	
            this.PollingInstance = new Polling(index);
            //调用签入方法
            //先注销，方案定下后再启用不要删除
            _index.showDialog({
			    title : '技能队列（多选）',   //弹出窗标题
			    url : 'chooseSkills',    //要加载的模块
			    param : _index,    //要传递的参数，可以是json对象
			    width : 840,  //对话框宽度
			    height : 580 //对话框高度
			});
//            _index.showLoading(true);
        }else{
    		//改变签入按钮为未签入，字体置灰不可用
			comUI.setAppointedInnerText('checkBtn','未签入');
        	//把所有按钮置灰
			comUI.setAllBtnEnabled(false);
			//受理请求和发送短信可点
			comUI.setAppointedMoreBtnEnabled(enableArr,true);
			/*if (index.getContactAuth().messageAuth) {
	        	//放开短信下发按钮，使客服可以外发短信，
				comUI.setAppointedBtnEnabled('sendMessageBtn',true);
	        }*/
			//关闭等待动画
        	_index.showLoading(false);
        	//清除定时器
//    		clearTimeout(timeOutId);
        };
//        return returnObj.call(this);
	}
	
	$.extend(objClass.prototype, Util.eventTarget.prototype,{
		signIn:function(){			
	    	if(SIP_TYPE == audioType){  //如果是电话座席签入的，则不是 sip座席签入的。
				var initUapResultMsg = this.initUap();
				if(initUapResultMsg == "success"){
					var uapLoginResultInt = setInterval($.proxy(function(){
						if (uapLoginStatus == "UAP_LOGIN_SUCCESS" ||uapLoginStatus == "UAP_LOGIN_FAILED") {
							clearInterval(uapLoginResultInt);//TODO 测试
							if(uapLoginStatus == "UAP_LOGIN_SUCCESS"){
								this.signInCTI();
							}
							else{
								_index.popAlert("注册UAP失败","登陆提醒");
//								comUI.disabledButton(arr);//按钮禁用
								comUI.setAllBtnEnabled(false);
								//放开受理请求和发送短信按钮
								comUI.setAppointedMoreBtnEnabled(enableArr,true);
								
								_signResult = "01";
								return;
							}
						}
					},this),20);
				}else{
					_index.popAlert(initUapResultMsg,"登陆提醒");
//					_COMUI.disabledButton(arr);//按钮禁用
					comUI.setAllBtnEnabled(false);
					//放开受理请求和发送短信按钮
					comUI.setAppointedMoreBtnEnabled(enableArr,true);
					_signResult = "01";
					return ;
				}
				
	    	}else{
	    		this.signInCTI();
	    	}
	    	
		},
		initUap: function(){
	    	 try{
	    		 var resultMsg = "success";
	    		 this.uapEventInit();//绑定事件
	    		 
	    		//对接UAP平台
	    		WebVoipControlIF.WebVoipSetLang("zh_CN"); 
	    		WebVoipControlIF.WEB800ServiceNum = "AnonymousCard";
	    		WebVoipControlIF.AnonymousCardServiceNum = "AnonymousCard";
	    		
	    		var oldSipServers = sipServer.split(";");
	    		var newSipServers;
	    		var strRegister = " ";
	    		var num = 0 ;
	    		for(var i=0; i<oldSipServers.length; i++){
	    			newSipServers = oldSipServers[i].split(":");
	    			var sipServerIP = newSipServers[0];
	    			var sipServerPort = newSipServers[1];
	    			if(openeyePsw == undefined || openeyePsw == null || openeyePsw == "" || openeyePsw == "undefined"){
	    			    strRegister = strRegister + "<register uri="+openeyeAccount+" ip="+sipServerIP+" port ="+sipServerPort+"/>";
	    			}else{
	        			openeyePsw = base64.decode(openeyePsw);
	        			strRegister = strRegister + "<register uri="+openeyeAccount+" password="+openeyePsw+" ip="+sipServerIP+" port ="+sipServerPort+"/>";
	        		}
	    			if( i == 0){
	    				WebVoipControlIF.VoipSIPServerIP = sipServerIP;//2016-07-29  有这两行代码，接通电话后，才能有声音，不能去掉
	    				WebVoipControlIF.VoipSIPServerPort = sipServerPort;//2016-07-29  有这两行代码，接通电话后，才能有声音，不能去掉
	    			}
	    			num++;
	    		}
	    		
	    	    WebVoipControlIF.WebVoipSetParams("<root><reg-info count="+num+">"+strRegister+"</reg-info></root>");
	    	    
	    		
		    	var initResult = WebVoipControlIF.WebVoipInitialize();
		        if( initResult == 0 )
		        {
		        } else 
		        {
		        	resultMsg = "SIP系统初始化失败";
		            return resultMsg;
		        }    
		        
		        WebVoipControlIF.WebVoipSetCurrMicVolume(20000);//2016-07-29 将这两行代码注释掉了，还是能听到声音，但是这两行代码还是需要保留
				WebVoipControlIF.WebVoipSetCurrSpeakerVolume(20000);//2016-07-29 将这两行代码注释掉了，还是能听到声音，但是这两行代码还是需要保留
		        
				WebVoipControlIF.WebVoipUseRing(0);//2016-07-27 openeye插件不播放铃声
				WebVoipControlIF.WebVoipSetMicMute(0);//2016-07-28 openeye插件麦克风非静音,非静音，能正常听到声音，已测试，没有该行代码，也能听到声音 2016-07-29 11
				WebVoipControlIF.WebVoipSetSpeakMute(0);//2016-07-29 openeye插件扬声器非静音,非静音，能正常听到声音，已测试，没有该行代码，也能听到声音 2016-07-29 11
		       // var voipLoginResult = WebVoipControlIF.WebVoipLogin(openeyeAccount,openeyePsw);//2016-07-29 使用这个，正常。 原来使用功能的是WebVoipLoginEx();
		        var voipLoginResult = WebVoipControlIF.WebVoipLoginEx();//2016-07-29 还是需要使用这个，因为后期可能会有一个用户有多个sipserver的情况
		        if( voipLoginResult == -1 )
		        {
		        	resultMsg = "UAP注册请求发送失败";
		        	return resultMsg;
		        }
		        else if (voipLoginResult == 1)
		        {
		        	uapLoginStatus = "UAP_LOGIN_SUCCESS";//表示已登录
		        	_signResult = 0;
		        }
		        else if (voipLoginResult == 0)
		        {
		        }
		        else
		        {
		        	resultMsg = "UAP注册返回异常";
		        	return resultMsg;
		        }
			    
			    return resultMsg;
		    }catch(e){
		    	resultMsg = "UAP注册异常,签入失败";
	        	return resultMsg;
		    }
		},
		uapEventInit: function(){
			//控件监听事件注册，由于不支持jquery的on事件，只能用原生态的js
			document.getElementById("WebVoipControlIF").attachEvent("VoipLoginSuccEvent",function(MsgStr, ErrorStr){
				uapLoginStatus = "UAP_LOGIN_SUCCESS";//表示已登录
			});//注册成功事件
			document.getElementById("WebVoipControlIF").attachEvent("VoipLoginFailEvent",function(MsgStr, ErrorStr){
				uapLoginStatus = "UAP_LOGIN_FAILED";//表示登录失败
			});//注册失败事件
			document.getElementById("WebVoipControlIF").attachEvent("VoipIncomingCallEvent",function(CallerPhoneNum, MsgStr, SubjectStr){
				//设置为自动接听 
			    WebVoipControlIF.WebVoipAccept();
			});//来电待接听事件
			document.getElementById("WebVoipControlIF").attachEvent("VoipLogoutSuccEvent",function(MsgStr){
				uapLoginStatus = "UAP_LOGINOUT_SUCCESS";//表示注销成功
			});//注销uap成功事件
			document.getElementById("WebVoipControlIF").attachEvent("VoipLogoutFailEvent",function(MsgStr, ErrorStr){
				uapLoginStatus = "UAP_LOGINOUT_FAILED";//表示注销失败
			});//注销uap失败事件
		},
		signInCTI: function(){
	  	  	_index.serialNumber.resetSerialNumber(); //重置序列号
	  	  	var options= _index.serialNumber.getSerialNumber();//获取随机数
	    	var agentState = MediaConstants.SEATING_EMPTY;
	    	if("2"==loginstate){
	    		agentState = MediaConstants.SEATING_BUSY;
	    	}
	    	var skillIds = [];
	    	var signInSkills = _index.CTIInfo.signInSkills;
	    	
	    	if(signInSkills&&signInSkills.length>0){
	    		for(var i = 0;i < signInSkills.length; i++) {
	    			skillIds.push(signInSkills[i].skillId);
	    		};
	    		var datas={
	    				"ccId":ccId,
	    				"agentId":workNo,
	    				"password":password,
	    				"agentState":agentState,
	    				"skillIds":skillIds,
	    				"opserialNo":options
	    		};
	    	}else{
	    		var datas={
	    				"ccId":ccId,
	    				"agentId":workNo,
	    				"password":password,
	    				"agentState":agentState,
	    				"opserialNo":options
	    		};
	    	}
	 
	    	//add by wwx160457 for audio business at 201606211141  start
	    	if(PHONE_TYPE == audioType && (audioPhoneNum != null && audioPhoneNum != "" && audioPhoneNum != "undefined" && audioPhoneNum != undefined)){
	    		datas.phoneNum = audioPhoneNum;
	    	}
	    	if(SIP_TYPE == audioType && (openeyeAccount != null && openeyeAccount != "" && openeyeAccount != "undefined" && openeyeAccount != undefined)){
	    		datas.phoneNum = openeyeAccount;
	    	}
	    	//add by wwx160457 for audio business at 201606211141  end
	    	 
//	    	var sign_url = MediaConstants.CCACSURL+ip+":"+port+"/ccacs/"+ctiId+"/ws/agent/login/"+_index.serialNumber.getSerialNumber();
	         var sign_url="";
	         if(isDefault=="1"){//此种情况走nginx代理
	            sign_url=MediaConstants.CCACSURL+proxyIP+":"+proxyPort+"/ccacs/"+ctiId+"/ws/agent/login";
	         }else{                                 
	            sign_url= MediaConstants.CCACSURL+ip+":"+port+"/ccacs/ws/agent/login"; //跨域直连
	         }
	         
	         if(_index.queue.browserName==="IE"){
	        	 debugger;
	        	 jQuery.support.cors = true;
	        	  	$.ajax({  
	    	    		url : sign_url ,
	    	            type : 'post',  
	    	            timeout : 20000,
	    	            async:false,
	    	            data :  JSON.stringify(datas), 
	    	            crossDomain: true,
//	    	            xhrFields: {
//	    	                  withCredentials: true
//	    	                   },
	    	            contentType:"application/json; charset=utf-8",
	    	            success : $.proxy(function(jsonData) {
	    	            	debugger;
	    	            	this.signInResult(jsonData);
	    	            	if("0"==jsonData.result){
//	    	            		recordCallCTILog(sign_url,datas,jsonData,"签入成功");
	    	            		if(datas.skillIds){
	    	            			//根据签入技能，获取对应的省份id,name
	    	            	    	Util.ajax.postJson('front/sh/common!execute?uid=businessTree001',{"skillIds":datas.skillIds.join(","),"ctiId":ctiId},function(json,status){
	    	            	    		if(status){
	    	            	    			initBusinessTree({"tree":json.beans});
	    	            	    		}
	    	            	    	});
	    	            		}
	    	            	}else{
//	    	            		recordCallCTILog(sign_url,datas,jsonData,"签入失败");
	    	            	}
	    				},this),
	    	            error : $.proxy(function( XMLHttpRequest, textStatus, errorThrown) {
	    	            	debugger;
	    	            	this.signInResult();
	    	            	var errorParams = {
	    	            			"XMLHttpRequest":XMLHttpRequest,
	    	            			"textStatus":textStatus,
	    	            			"errorThrown":errorThrown
	    	            	};
//	    	            	recordCallCTILog(sign_url,datas,errorParams,"网络异常，签入失败");
	    				},this)
	    	        });
	         }else{
	 	    	$.ajax({  
		    		url : sign_url ,
		            type : 'post',  
		            timeout : 20000,
		            async:false,
		            data :  JSON.stringify(datas), 
		            crossDomain: true,
		            xhrFields: {
		                  withCredentials: true
		                   },
		            contentType:"application/json; charset=utf-8",
		            success : $.proxy(function(jsonData) {
		            	this.signInResult(jsonData);
		            	if("0"==jsonData.result){
//		            		recordCallCTILog(sign_url,datas,jsonData,"签入成功");
		            		if(datas.skillIds){
		            			//根据签入技能，获取对应的省份id,name
		            	    	Util.ajax.postJson('front/sh/common!execute?uid=businessTree001',{"skillIds":datas.skillIds.join(","),"ctiId":ctiId},function(json,status){
		            	    		if(status){
		            	    			initBusinessTree({"tree":json.beans});
		            	    		}
		            	    	});
		            		}
		            	}else{
//		            		recordCallCTILog(sign_url,datas,jsonData,"签入失败");
		            	}
					},this),
		            error : $.proxy(function( XMLHttpRequest, textStatus, errorThrown) {
		            	this.signInResult();
		            	var errorParams = {
		            			"XMLHttpRequest":XMLHttpRequest,
		            			"textStatus":textStatus,
		            			"errorThrown":errorThrown
		            	};
//		            	recordCallCTILog(sign_url,datas,errorParams,"网络异常，签入失败");
					},this)
		        });
	         };
	       
		},
		signInResult: function(datajson){
	    	if(typeof(datajson)!="undefined"){
	    		var resultMsg;
	    		if("0" == datajson.result){
	    			_signResult = "00";
	    			_index.main.queryIsRing();// 签入CTI时获取 有铃/无铃 系统参数 ;move by zhangyingsheng 2017.02.07
	    			//调用轮询方法
	    			this.PollingInstance.startPolling();
	    			//关闭动画
//	    			_index.showLoading(false);
	    			//把所有按钮置灰
	    			//_COMUI.disabledAllButton();
	    			comUI.setAllBtnEnabled(true);//按钮可用
//	    			_COMUI.disabledButton(arrState);//按钮禁用
	    			comUI.setAppointedMoreBtnEnabled(arrState,false);
	    			//按钮是否存在待确定
//	    			_COMUI.setValue("RestType","EndRest");
	    			//检查短信外发是否禁用
//	    			comUI.setAppointedBtnEnabled('sendMessageBtn',_index.getContactAuth().messageAuth);
	    			//清除定时器
//	    			clearTimeout(timeOutId);
	    			//如果语音没有签入成功，则将外呼按钮灰显 
	    			var signAudioSuccess = (PHONE_TYPE == audioType || SIP_TYPE == audioType);
	    			comUI.setAppointedBtnEnabled('callOutBtn',signAudioSuccess)
	    			//示闲逻辑
	    			if("1" == loginstate){
	    				_index.clientInfo.timerWait.startTime().end();
	    				comUI.freeStatusUi();
	    				//clilentInfo模块的通话状态
	    				_index.clientInfo.timerWait.setStatus('空闲');
	    				_index.clientInfo.timerWait.startTime().start();
	    			}
	    			//示忙逻辑
	    			if("2" == loginstate){
	    				_index.clientInfo.timerWait.startTime().end();
	    				comUI.busyStatusUi();
	    				_index.clientInfo.timerWait.setStatus('忙碌');
	    				_index.clientInfo.timerWait.startTime().start();
	    			}
	    			//签入成功时设置应答模式的默认值
	    			this.setAnswerModel();
	    			//签入成功时设置整理态的默认值
	    			this.setTidyModel();
	    			/**
	    			 * 查询座席的技能队列详情
	    			 * @裴书贤
	    			 */
	    			var skillURL = '';
	    			if(isDefault=="1"){//此种情况走nginx代理
	    				skillURL= MediaConstants.CCACSURL+proxyIP+":"+proxyPort+"/ccacs/"+ctiId+"/ws/query/skillsinfo";
	    	        }else{                                 
	    	        	skillURL= MediaConstants.CCACSURL+ip+":"+port+"/ccacs/ws/query/skillsinfo"; //跨域直连
	    	        }
	    			
	    			 if(_index.queue.browserName==="IE"){
	    	    			$.ajax({  
	    	    				url : skillURL ,
	    	    				type : 'post',  
	    	    				data :  JSON.stringify({opserialNo: _index.serialNumber.getSerialNumber()}), 
	    	    				crossDomain: true,
//	    	    	            xhrFields: {
//	    	    	                  withCredentials: true
//	    	    	                   },
	    	    				contentType:"application/json; charset=utf-8",
	    	    				success : $.proxy(function(jsonData) {
	    	    					this.getSkillInfoResult(jsonData);
	    	    					if("0"==jsonData.result){
//	    	    	            		recordCallCTILog(skillURL,{},jsonData,"查询技能队列成功");
	    	    	            	}else{
//	    	    	            		recordCallCTILog(skillURL,{},jsonData,"查询技能队列失败");
	    	    	            	}
	    	    				},this),
	    	    				error : $.proxy(function( XMLHttpRequest, textStatus, errorThrown) {
	    	    					this.getSkillInfoResult();
	    	    					var errorParams = {
	    	    	            			"XMLHttpRequest":XMLHttpRequest,
	    	    	            			"textStatus":textStatus,
	    	    	            			"errorThrown":errorThrown
	    	    	            	};
//	    	    					recordCallCTILog(skillURL,{},errorParams,"网络异常，查询技能队列失败");
	    	    				},this)
	    	    			});
	    			 }else{
	 	    			$.ajax({  
		    				url : skillURL ,
		    				type : 'post',  
		    				data :  JSON.stringify({opserialNo: _index.serialNumber.getSerialNumber()}), 
		    				crossDomain: true,
		    	            xhrFields: {
		    	                  withCredentials: true
		    	                   },
		    				contentType:"application/json; charset=utf-8",
		    				success : $.proxy(function(jsonData) {
		    					this.getSkillInfoResult(jsonData);
		    					if("0"==jsonData.result){
//		    	            		recordCallCTILog(skillURL,{},jsonData,"查询技能队列成功");
		    	            	}else{
//		    	            		recordCallCTILog(skillURL,{},jsonData,"查询技能队列失败");
		    	            	}
		    				},this),
		    				error : $.proxy(function( XMLHttpRequest, textStatus, errorThrown) {
		    					this.getSkillInfoResult();
		    					var errorParams = {
		    	            			"XMLHttpRequest":XMLHttpRequest,
		    	            			"textStatus":textStatus,
		    	            			"errorThrown":errorThrown
		    	            	};
//		    					recordCallCTILog(skillURL,{},errorParams,"网络异常，查询技能队列失败");
		    				},this)
		    			});
	    			 }


	    			_index.popAlert("签入成功","登陆提醒");
	    			resultMsg = "签入成功";
	    			Util.ajax.postJson('front/sh/common!execute?uid=signIn0001',{"staffId":staffId,"content":"签入成功"},function(result,status){
	    					
			    	});
	    		}else{
	    			if(datajson.result == "150000" || datajson.result == "131"){
	    				resultMsg = "签入失败，该工号已签入";
	    				this.signInFailState("该工号已签入","登陆提醒");
	    				var content="签入失败+"+datajson.result;
	    				Util.ajax.postJson('front/sh/common!execute?uid=signIn0001',{"staffId":staffId,"content":content},function(result,status){
	    		    		
	    		    	});
	    			}else{
	    				resultMsg = "签入失败";
	    				this.signInFailState("签入失败","登陆提醒");
	    				var content="签入失败+"+datajson.result;
	                    Util.ajax.postJson('front/sh/common!execute?uid=signIn0001',{"staffId":staffId,"content":content},function(result,status){
	    		    		
	    		    	});
	    			}
	    		}
	    		
	    		var paramsToProvince = {
						"resultCode" : datajson.result,
						"resultMessage" : resultMsg,
						"reserved1" : "",
						"reserved2" : "",
						"reserved3" : ""
				};
				_index.postMessage.sendToProvince("login", paramsToProvince);
	    		
	    	}else{
	    		_signResult = "01";
	    		this.signInFailState("网络异常，签入失败！","登陆提醒");
	    		 Util.ajax.postJson('front/sh/common!execute?uid=signIn0001',{"staffId":staffId,"content":"签入失败，网络异常"},function(result,status){
			    		
			    	});
	    		
	    	}
		},
		//签入成功设置应答模式
		setAnswerModel: function(){
			var autoAnswerUrl='';
			if(isDefault=="1"){//此种情况走nginx代理
				autoAnswerUrl=MediaConstants.CCACSURL+proxyIP+":"+proxyPort+"/ccacs/"+ctiId+"/ws/agent/autoanswer";
			}else{
				autoAnswerUrl= MediaConstants.CCACSURL+ip+":"+port+"/ccacs/ws/agent/autoanswer"; //跨域直连
			}                 
			var autoAnswerData={
				isAutoAnswer:"true",
				opserialNo: _index.serialNumber.getSerialNumber()
			};
			 if(_index.queue.browserName==="IE"){
					$.ajax({  
						url : autoAnswerUrl,
						type : 'post',  
						data :  JSON.stringify(autoAnswerData), 
						crossDomain: true,
//			            xhrFields: {
//			            	withCredentials: true
//			            },
						contentType:"application/json; charset=utf-8",
						success : function(jsonData) {
							if(jsonData.result==0){
								comUI.setTidyDefault('auto-answer');
//								recordCallCTILog(autoAnswerUrl,autoAnswerData,jsonData,"调用自答接口成功");
							}else{
								comUI.setTidyDefault('man-made-answer');
//								recordCallCTILog(autoAnswerUrl,autoAnswerData,jsonData,"调用自答接口失败");
							}
						},
						error : function( XMLHttpRequest, textStatus, errorThrown) {
							comUI.setTidyDefault('man-made-answer');
							var errorParams = {
			            			"XMLHttpRequest":XMLHttpRequest,
			            			"textStatus":textStatus,
			            			"errorThrown":errorThrown
			            	};
//							recordCallCTILog(autoAnswerUrl,autoAnswerData,errorParams,"网络异常，调用自答接口失败");
						},
						complete : function(){
							if("2"!=loginstate){
								var changeStateURL = '';
								if(isDefault=="1"){//此种情况走nginx代理
									changeStateURL=MediaConstants.CCACSURL+proxyIP+":"+proxyPort+"/ccacs/"+ctiId+"/ws/agent/setagentstate";
								}else{                                 
									changeStateURL= MediaConstants.CCACSURL+ip+":"+port+"/ccacs/ws/agent/setagentstate"; //跨域直连
								}
								var params = {
									"state" : MediaConstants.SEATING_EMPTY,
									opserialNo: _index.serialNumber.getSerialNumber()
								};
								$.ajax({  
									url : changeStateURL ,
									type : 'post',  
									data :  JSON.stringify(params), 
									crossDomain: true,
//									xhrFields: {
//									    withCredentials: true
//									},
									contentType:"application/json; charset=utf-8",
									success : function(jsonData) {
										if("0"==jsonData.result){
//											recordCallCTILog(changeStateURL,params,jsonData,"设置坐席空闲态成功");
										}else{
//											comUI.busyStatusUi();
//											_index.clientInfo.timerWait.setStatus('空闲');
//											recordCallCTILog(changeStateURL,params,jsonData,"设置坐席空闲态失败");
										}
									},
									error : function( XMLHttpRequest, textStatus, errorThrown) {
//										comUI.busyStatusUi();
//										_index.clientInfo.timerWait.setStatus('空闲');
					    				var errorParams = {
				    	            			"XMLHttpRequest":XMLHttpRequest,
				    	            			"textStatus":textStatus,
				    	            			"errorThrown":errorThrown
				    	            	};
//										recordCallCTILog(changeStateURL,params,errorParams,"网络异常，设置坐席空闲态失败");
									}
								});
					    	}
						}
					});
			 }else{
					$.ajax({  
						url : autoAnswerUrl,
						type : 'post',  
						data :  JSON.stringify(autoAnswerData), 
						crossDomain: true,
			            xhrFields: {
			            	withCredentials: true
			            },
						contentType:"application/json; charset=utf-8",
						success : function(jsonData) {
							if(jsonData.result==0){
								comUI.setTidyDefault('auto-answer');
//								recordCallCTILog(autoAnswerUrl,autoAnswerData,jsonData,"调用自答接口成功");
							}else{
								comUI.setTidyDefault('man-made-answer');
//								recordCallCTILog(autoAnswerUrl,autoAnswerData,jsonData,"调用自答接口失败");
							}
						},
						error : function( XMLHttpRequest, textStatus, errorThrown) {
							comUI.setTidyDefault('man-made-answer');
							var errorParams = {
			            			"XMLHttpRequest":XMLHttpRequest,
			            			"textStatus":textStatus,
			            			"errorThrown":errorThrown
			            	};
//							recordCallCTILog(autoAnswerUrl,autoAnswerData,errorParams,"网络异常，调用自答接口失败");
						},
						complete : function(){
							if("2"!=loginstate){
								var changeStateURL = '';
								if(isDefault=="1"){//此种情况走nginx代理
									changeStateURL=MediaConstants.CCACSURL+proxyIP+":"+proxyPort+"/ccacs/"+ctiId+"/ws/agent/setagentstate";
								}else{                                 
									changeStateURL= MediaConstants.CCACSURL+ip+":"+port+"/ccacs/ws/agent/setagentstate"; //跨域直连
								}
								var params = {
									"state" : MediaConstants.SEATING_EMPTY,
									opserialNo: _index.serialNumber.getSerialNumber()
								};
								$.ajax({  
									url : changeStateURL ,
									type : 'post',  
									data :  JSON.stringify(params), 
									crossDomain: true,
									xhrFields: {
									    withCredentials: true
									},
									contentType:"application/json; charset=utf-8",
									success : function(jsonData) {
										if("0"==jsonData.result){
//											recordCallCTILog(changeStateURL,params,jsonData,"设置坐席空闲态成功");
										}else{
//											comUI.busyStatusUi();
//											_index.clientInfo.timerWait.setStatus('空闲');
//											recordCallCTILog(changeStateURL,params,jsonData,"设置坐席空闲态失败");
										}
									},
									error : function( XMLHttpRequest, textStatus, errorThrown) {
//										comUI.busyStatusUi();
//										_index.clientInfo.timerWait.setStatus('空闲');
					    				var errorParams = {
				    	            			"XMLHttpRequest":XMLHttpRequest,
				    	            			"textStatus":textStatus,
				    	            			"errorThrown":errorThrown
				    	            	};
//										recordCallCTILog(changeStateURL,params,errorParams,"网络异常，设置坐席空闲态失败");
									}
								});
					    	}
						}
					});
			 }

		},
		//签入成功设置整理态默认值
		setTidyModel:function(){
			var isAutoMatic = _index.CTIInfo.autoArrage;
			if(isAutoMatic && isAutoMatic == "0"){//为0 则表示需要设置为自动，即挂断会话后，自动进入整理态
				var uri = "ws/agent/setagentautoenteridle/";
				var requestData = {flag:"0"};
				var resultStr = "设置整理态成功";
				var config = {
						uri:uri,
						requestData:requestData,//请求参数 0 为整理态
						successCallBack:function(data){//成功的回调函数
							if(data.result=="0"){
								comUI.setTidyDefault('auto-word');
							}else{
								comUI.setTidyDefault('man-made-word');
								_index.popAlert("设置整理态失败!","设置整理态失败");
								resultStr = "设置整理态失败";
							}
//							recordCallCTILog(uri,requestData,data,resultStr);
						},
						errorCallBack:function(jqXHR,textStatus,errorThrown){//失败的回调函数
							comUI.setTidyDefault('man-made-word');
							_index.popAlert("设置整理态失败!"+textStatus,"设置整理态失败");
							resultStr = "设置整理态失败";
							var errorParams = {
									"XMLHttpRequest":jqXHR,
									"textStatus":textStatus,
									"errorThrown":errorThrown
							};
//							recordCallCTILog(uri,requestData,errorParams,resultStr);
						}
				};
				//发起调用
				this.requestCTI.postCTIRequest(config);
			}else{
				comUI.setTidyDefault('man-made-word');
			}
		},
		
		getSkillInfoResult: function(jsonData){
	    	if(jsonData){
	    		if(jsonData.result == "0"){
	    			//缓存所有的技能队列
	    			this._skillInfos.setSkillInfos(jsonData.skillsInfo);
	    			if(_index.CTIInfo.signInSkills.length>0){
	    				//缓存签入的技能队列
	    				this._skillInfos.setSignInSkills(_index.CTIInfo.signInSkills);
	    			}else{
	    				//缓存默认签入所有技能队列
	    				this._skillInfos.setSignInSkills(jsonData.skillsInfo);
	    			}
	    		//初始化迁入渠道的最大会话数  王自友
	    		this.initStaffMaxConCurrent();
	    		}else{
	    			_index.popAlert("缓存技能队列失败！","提示");
	    		}
	    	}else{
				_index.popAlert("网络异常，缓存技能队列失败！","提示");
			}
	    },
	    //初始化迁入渠道的最大会话数
	    initStaffMaxConCurrent: function(){
			//00迁入   
			if(_signResult !="00"){
				_index.popAlert("初始化失败（未迁入）","初始化最大会话数");
				return;
			}
			var data;
			var ctiMediaTypeIds = "";
			var mediaTypes = this._skillInfos.getSignInSkills();
			if (!mediaTypes) {
				_index.popAlert("初始化失败（没有迁入渠道）","初始化最大会话数");
				return;
			} else {
				var map = {};
				for (var j in mediaTypes) {
					if (typeof(mediaTypes[j].channelId) == "undefined" || mediaTypes[j].channelId < "50" || mediaTypes[j].channelId > "99") {
						continue;
					}
					if (mediaTypes[j].channelId in map) {
						continue;
					} else {
						map[mediaTypes[j].channelId] = mediaTypes[j].channelId;
					}
					if(j < mediaTypes.length - 1){
						ctiMediaTypeIds += mediaTypes[j].channelId + "*";
					}else{
						ctiMediaTypeIds += mediaTypes[j].channelId;
					}
				}
			}
			if (!ctiMediaTypeIds) {
//				_index.popAlert("初始化失败（没有符合的迁入渠道）","初始化最大会话数");
				return;
			}
			var params = {
				"ctiMediaTypeIds":ctiMediaTypeIds
			};
			Util.ajax.postJson("front/sh/media!execute?uid=maxConcurrent09",params,function(json,status){
				if (status) {
					data = json.beans;
					if (data && data.length > 0) {
						//暂存向CTI请求参数
						var ctiData = [];
						for(var i = 0; i < data.length; i++){
							var param = {
									"type":data[i].ctiMediaTypeId,
									"number":data[i].maxConcurrent
							};
							ctiData.push(param);
						}
						var curData = {
								"param":ctiData,
								opserialNo: _index.serialNumber.getSerialNumber()
						}
						//获取参数
						var url = '';
						if(isDefault=="1"){//此种情况走nginx代理
							url=MediaConstants.CCACSURL+proxyIP+":"+proxyPort+"/ccacs/"+ctiId+"/ws/agent/setcallnum";
						}else{                                 
							url= MediaConstants.CCACSURL+ip+":"+port+"/ccacs/ws/agent/setcallnum"; //跨域直连
						}
						//调用CTI接口，设置CTI最大会话数
						 if(_index.queue.browserName==="IE"){
								$.ajax({ 
									url : url ,
									type : 'post', 
									data : JSON.stringify(curData),
									crossDomain: true,
//									xhrFields: {
//									    withCredentials: true
//									},
									contentType:"application/json; charset=utf-8",
									success : function(json) {
										//配置CTI成功
										if(json.result == "0"){
//											recordCallCTILog(url,curData,json,"初始化最大会话数成功");
											//_index.popAlert("初始化成功", "初始化最大会话数");
										}else{
//											recordCallCTILog(url,curData,json,"初始化最大会话数失败");
											_index.popAlert("初始化失败,错误码：" + json.result, "初始化最大会话数");
										}
									},
									error : function( XMLHttpRequest, textStatus, errorThrown) {
										var errorParams = {
												"XMLHttpRequest":XMLHttpRequest,
												"textStatus":textStatus,
												"errorThrown":errorThrown
										};
//										recordCallCTILog(url,curData,errorParams,"网络异常，初始化最大会话数失败");
									}
								});
						 }else{
								$.ajax({ 
									url : url ,
									type : 'post', 
									data : JSON.stringify(curData),
									crossDomain: true,
									xhrFields: {
									    withCredentials: true
									},
									contentType:"application/json; charset=utf-8",
									success : function(json) {
										//配置CTI成功
										if(json.result == "0"){
//											recordCallCTILog(url,curData,json,"初始化最大会话数成功");
											//_index.popAlert("初始化成功", "初始化最大会话数");
										}else{
//											recordCallCTILog(url,curData,json,"初始化最大会话数失败");
											_index.popAlert("初始化失败,错误码：" + json.result, "初始化最大会话数");
										}
									},
									error : function( XMLHttpRequest, textStatus, errorThrown) {
										var errorParams = {
												"XMLHttpRequest":XMLHttpRequest,
												"textStatus":textStatus,
												"errorThrown":errorThrown
										};
//										recordCallCTILog(url,curData,errorParams,"网络异常，初始化最大会话数失败");
									}
								});
						 }											
					} else {
						_index.popAlert("初始化失败（数据未配置）","初始化最大会话数");
					}
				} else {
					_index.popAlert("初始化失败（查询DB信息失败）","初始化最大会话数");
				}
			});
	    },
		signInFailState: function(stateInfo){
	    	_signResult = "01";
			//关闭动画
//			_index.showLoading(false);
	    	//改变【签入/签出】为未签入
			comUI.setAppointedInnerText("checkBtn","未签入");
			//把所有按钮置灰
			comUI.setAllBtnEnabled(false);
	    	//放开受理请求和发送短信按钮
			comUI.setAppointedMoreBtnEnabled(enableArr,true);
	         //是否可以短息下发
//	    	comUI.setAppointedBtnEnabled('sendMessageBtn',_index.getContactAuth().messageAuth);
			//提醒
			_index.popAlert(stateInfo);
		},
		signOut:function(){
			if(_signResult=="00"){
		    	var datas = {
		    		opserialNo: _index.serialNumber.getSerialNumber()
		    	};
		    	//签出之前先判断坐席当前状态
		    	var stateURL = '';
		    	if(isDefault=="1"){//此种情况走nginx代理
		    		stateURL=MediaConstants.CCACSURL+proxyIP+":"+proxyPort+"/ccacs/"+ctiId+"/ws/query/agentstate";
		    	}else{                                 
		    		stateURL= MediaConstants.CCACSURL+ip+":"+port+"/ccacs/ws/query/agentstate"; //跨域直连
		    	}
		    	if(_index.queue.browserName==="IE"){
			    	$.ajax({  
			    		url : stateURL ,
			            type : 'post',  
			            async:false,
			            data :  JSON.stringify(datas),
			            crossDomain: true,
//			            xhrFields: {
//			                withCredentials: true
//			            },
			            contentType:"application/json; charset=utf-8",
			            success : $.proxy(function(data) {
			            	var _this = this;
			            	var state = data.state;
			            	if(state){
//			            		recordCallCTILog(stateURL,datas,data,"获取坐席状态成功");
			            	}else{
//			            		recordCallCTILog(stateURL,datas,data,"获取坐席状态失败");
			            	}
			            	if(state&&MediaConstants.SEATING_CALLING==state){
//			            		comUI.checkOutUi();
			            		_index.popAlert("请先 结束通话、停止放音 ，再进行签出！","签出提醒");
			            	}else{
			            		//可以签出
			            		var signOutUrl = '';
			            		if(isDefault=="1"){//此种情况走nginx代理
			            			signOutUrl=MediaConstants.CCACSURL+proxyIP+":"+proxyPort+"/ccacs/"+ctiId+"/ws/agent/logout";
			    		    	}else{                                 
			    		    		signOutUrl= MediaConstants.CCACSURL+ip+":"+port+"/ccacs/ws/agent/logout"; //跨域直连
			    		    	}
			            		$.ajax({  
			            			url : signOutUrl ,
			            			type : 'post',  
			            			async:false,
			            			timeout : 20000,
			            			data :  JSON.stringify(datas), 
			            			crossDomain: true,
//			            			xhrFields: {
//			            			    withCredentials: true
//			            			},
			            			contentType:"application/json; charset=utf-8",
			            			success : function(jsonData) {
			            				signOutResult(_this,jsonData);
			            				if("0"==jsonData.result){
//			        	            		recordCallCTILog(signOutUrl,datas,jsonData,"签出成功");
			        	            	}else{
//			        	            		recordCallCTILog(signOutUrl,datas,jsonData,"签出失败");
			        	            	}
			            			},
			            			error : function( XMLHttpRequest, textStatus, errorThrown) {
			            				this.signOutResult();
			            				var errorParams = {
				    	            			"XMLHttpRequest":XMLHttpRequest,
				    	            			"textStatus":textStatus,
				    	            			"errorThrown":errorThrown
				    	            	};
//			            				recordCallCTILog(signOutUrl,datas,errorParams,"网络异常，签出失败");
			            			} 
			            		});
			            	}
						},this),
			            error : function( XMLHttpRequest, textStatus, errorThrown) {
			            	_index.popAlert("网络异常，获取坐席状态失败！","签出提醒");
			            	var errorParams = {
			            			"XMLHttpRequest":XMLHttpRequest,
			            			"textStatus":textStatus,
			            			"errorThrown":errorThrown
			            	};
//			            	recordCallCTILog(stateURL,datas,errorParams,"网络异常，获取坐席状态失败");
						}
			        });
		    	}else{
			    	$.ajax({  
			    		url : stateURL ,
			            type : 'post',  
			            async:false,
			            data :  JSON.stringify(datas),
			            crossDomain: true,
			            xhrFields: {
			                withCredentials: true
			            },
			            contentType:"application/json; charset=utf-8",
			            success : $.proxy(function(data) {
			            	var _this = this;
			            	var state = data.state;
			            	if(state){
//			            		recordCallCTILog(stateURL,datas,data,"获取坐席状态成功");
			            	}else{
//			            		recordCallCTILog(stateURL,datas,data,"获取坐席状态失败");
			            	}
			            	if(state&&MediaConstants.SEATING_CALLING==state){
//			            		comUI.checkOutUi();
			            		_index.popAlert("请先 结束通话、停止放音 ，再进行签出！","签出提醒");
			            	}else{
			            		//可以签出
			            		var signOutUrl = '';
			            		if(isDefault=="1"){//此种情况走nginx代理
			            			signOutUrl=MediaConstants.CCACSURL+proxyIP+":"+proxyPort+"/ccacs/"+ctiId+"/ws/agent/logout";
			    		    	}else{                                 
			    		    		signOutUrl= MediaConstants.CCACSURL+ip+":"+port+"/ccacs/ws/agent/logout"; //跨域直连
			    		    	}
			            		$.ajax({  
			            			url : signOutUrl ,
			            			type : 'post',  
			            			async:false,
			            			timeout : 20000,
			            			data :  JSON.stringify(datas), 
			            			crossDomain: true,
			            			xhrFields: {
			            			    withCredentials: true
			            			},
			            			contentType:"application/json; charset=utf-8",
			            			success : function(jsonData) {
			            				signOutResult(_this,jsonData);
			            				if("0"==jsonData.result){
//			        	            		recordCallCTILog(signOutUrl,datas,jsonData,"签出成功");
			        	            	}else{
//			        	            		recordCallCTILog(signOutUrl,datas,jsonData,"签出失败");
			        	            	}
			            			},
			            			error : function( XMLHttpRequest, textStatus, errorThrown) {
			            				this.signOutResult();
			            				var errorParams = {
				    	            			"XMLHttpRequest":XMLHttpRequest,
				    	            			"textStatus":textStatus,
				    	            			"errorThrown":errorThrown
				    	            	};
//			            				recordCallCTILog(signOutUrl,datas,errorParams,"网络异常，签出失败");
			            			} 
			            		});
			            	}
						},this),
			            error : function( XMLHttpRequest, textStatus, errorThrown) {
			            	_index.popAlert("网络异常，获取坐席状态失败！","签出提醒");
			            	var errorParams = {
			            			"XMLHttpRequest":XMLHttpRequest,
			            			"textStatus":textStatus,
			            			"errorThrown":errorThrown
			            	};
//			            	recordCallCTILog(stateURL,datas,errorParams,"网络异常，获取坐席状态失败");
						}
			        });
		    	}

		    	function signOutResult(_this,dataJson){
		    		if(typeof(dataJson)!="undefined"){
		    			var resultMsg;
		    			if("0" == dataJson.result||"150001" == dataJson.result){
		    				_this.PollingInstance.stopPolling();
		    				comUI.setAppointedMoreBtnEnabled(arr,false);//按钮禁用
		    				comUI.setAppointedIcont("freeStatusBtn","#cccccc");
		    				//停止首页头部定时器
//		    				_COMUI.timer.end();
		    				_signResult = "0";
		    				_index.clientInfo.timerWait.setStatus('未签入');
		    				_index.clientInfo.timerWait.startTime().end();
		    				comUI.checkOutUi();
		    				comUI.setAppointedMoreBtnEnabled(enableArr,true);
		    				//还原整理态和应答模式的默认值
		    				comUI.restoreDefault(['auto-word','man-made-word','man-made-answer','auto-answer']);
		    				
		    				//add by wwx160457 for audio business at 201606211131  start
		    				if(SIP_TYPE == _index.CTIInfo.audioType){
		    					var voipUnloginResult = "00";
		    					voipUnloginResult = this.WebVoipUnloginFunc(voipUnloginResult);
		    					if(voipUnloginResult == "0"){
		            	    		_signResult = "WAIT_RESULT";
		            	    		resultMsg = "签出成功";
		            	    		/* 每隔20ms检测一次uap注销的结果 */
		            	    		var uapLoginoutStatusInt = setInterval(function(){
		            	    			if (uapLoginStatus == "UAP_LOGINOUT_SUCCESS" || uapLoginStatus == "UAP_LOGINOUT_FAILED") {
		            	    				clearInterval(uapLoginoutStatusInt);
		            	    				_signResult = "0";
		            	    				_index.popAlert("已签出！","签出提醒");
		            	    				 Util.ajax.postJson('front/sh/common!execute?uidsignIn0001=',{"staffId":staffId,"content":"签出成功"},function(result,status){
		            	     		    	});//由于该段代码必须是同步的，所以无法将这段代码进行抽取到最后执行。该处必要的代码冗余
		            	    			}
		            	    		},20);
		            	    	}
		    					else{
		    						_signResult = "0";
		            	    		_index.popAlert("签出CTI成功，签出UAP失败","签出提醒");
		            	    		resultMsg = "签出CTI成功，签出UAP失败";
		    	    				 Util.ajax.postJson('front/sh/common!execute?uid=signIn0001',{"staffId":staffId,"content":"签出CTI成功，签出UAP失败"},function(result,status){
		    	     		    	});//该处代码未配合上面的定时执行的结果，无法抽取，必要冗余代码
		    					}
		        	    	}else{
		        	    		_signResult = "0";
		        	    		_index.popAlert("已签出！","签出提醒");
		        	    		resultMsg = "签出成功";
			    				 Util.ajax.postJson('front/sh/common!execute?uid=signIn0001',{"staffId":staffId,"content":"签出成功"},function(result,status){
			     		    	});//该处代码未配合上面的定时执行的结果，无法抽取，必要冗余代码
		        	    	}
		    				//add by wwx160457 for audio business at 201606211131  end
		    			}else{
//		    				comUI.checkInUi();
		        			_index.popAlert("签出失败！","签出提醒");
		        			resultMsg = "签出失败";
		        			_signResult = "1";
		        			var content="签出失败+"+datajson.result;
		        			Util.ajax.postJson('front/sh/common!execute?uid=signIn0001',{"staffId":staffId,"content":content},function(result,status){
		     		    		
		     		    	});
		        		}
		    			
		    			var paramsToProvince = {
	    						"resultCode" : dataJson.result,
	    						"resultMessage" : resultMsg,
	    						"reserved1" : "",
	    						"reserved2" : "",
	    						"reserved3" : ""
	    				};
	    				_index.postMessage.sendToProvince("logout", paramsToProvince);
		    			
		    		}else{
//		    			comUI.checkInUi();
		    			_index.popAlert("网络异常，签出失败！","签出提醒");
		    			Util.ajax.postJson('front/sh/common!execute?uid=signIn0001',{"staffId":staffId,"content":"签出失败,网络异常"},function(result,status){
		 		    		
		 		    	});
		    		}
		    	}
			}
			return _signResult;
		},
		WebVoipUnloginFunc: function(voipUnloginResult){
	    	var num = 0;
	    	var uninitializeResult = 0;
			while(num < 3){//如果注销失败(包括异常失败)，最多重试3次.
				try{
					voipUnloginResult = WebVoipControlIF.WebVoipUnlogin();
					if(signOutType == "1"){
						uninitializeResult = WebVoipControlIF.WebVoipUninitialize();//2016-07-28 注销、退出的时候，需要调用该接口
					}
					if(voipUnloginResult=="0" && uninitializeResult == "0")
				    {
				        num = 3;
				    }
				    if (voipUnloginResult == "-1" || uninitializeResult != "0") {
				    	num = num+1;
				    }
				    if (voipUnloginResult == "1" && uninitializeResult == "0") {
				    	num = 3;
				    }
				}catch(e){
					num = num+1;
					voipUnloginResult = "-2";
				}
			}
			return voipUnloginResult;
		},
		getSignResult:function(){
			return _signResult;
		},
		//CTIEventDeal可能会用
		setSignResult:function(data){
			_signResult = data;
		},
		setSignOutType:function(data){
			signOutType = data;
		},
		setPlayingRecord:function(data){
			playingRecord = data;
		},
		getPlayingRecord:function(){
			return playingRecord;
		},
    	//获取受理号码
        getCheckedPhoneNum:function(){
        	var phoneNum = "";
        	var CallingInfo =  getActiveCallingInfo();
        	if(CallingInfo != null){
        		phoneNum  = CallingInfo.getSubsNumber();
        	}else{
        		CustomerInfo = _index.CallingInfoMap.get("acceptNumber");
        		if(CustomerInfo != null){
        			phoneNum = CustomerInfo.getPhoneNumber();
        		}
        	}
        	if(phoneNum != ""){
        		return phoneNum;
        	}else{
        		return "";
        	}
        },
        //获取主叫号码
        getPhoneNum:function(){
        	var callerNo = "";
        	var CallingInfo =  getActiveCallingInfo();
        	if(CallingInfo != null){
        		callerNo  = CallingInfo.getCallerNo();
        	}
        	if(callerNo != ""){
        		return callerNo;
        	}else{
        		return "";
        	}
        },
        //CTIInfo
        getCTIInfo:function(){
        	return _index.CTIInfo;
        },
        //获取客户信息
        getClientBusiInfo:function(serialNo){
        	var clientBusiInfo = this.ClientBusiData(serialNo);
        	if($.isEmptyObject(clientBusiInfo)){
        		return "";
        	}
        	return clientBusiInfo;
        },
        ClientBusiData: function(serialNo){
        	var clientBusiInfo = {};
        	var CustomerInfo;
        	var acceptNumber;
        	var channelname;//渠道来源
        	var channelId;//渠道ID
        	var NickName;//昵称
//        	var contactId;
//        	var callerNo;
//        	var calledNo;
//        	var callType;
        	var CallingInfo=null;
        	if (serialNo&&serialNo.length) {
        		CallingInfo =  _index.CallingInfoMap.get(serialNo);
			}else {
				CallingInfo =  getActiveCallingInfo();
			}
//        	if(CallingInfo != null){
//        		contactId  = CallingInfo.getContactId();
//        		callerNo = CallingInfo.getCallerNo();
//        		calledNo = CallingInfo.getCalledNo();
//        		callType = CallingInfo.getCallType();
//        	}else{
//        		contactId = '';
//        		callerNo = '';
//        		calledNo = '';
//        		callType = '';
//        	};
        	if(_index.CTIInfo.signIn == "false"){
        		CustomerInfo = _index.CallingInfoMap.get("acceptNumber");
        		if(CustomerInfo != null){
        			acceptNumber = CustomerInfo.getPhoneNumber();	
        		}
        	}else{
	        	if(CallingInfo == null){
	        		if(_index.CallingInfoMap){
	        			CustomerInfo = _index.CallingInfoMap.get("acceptNumber");
	        			if(CustomerInfo != null){
	        				acceptNumber = CustomerInfo.getPhoneNumber();
	        			}
	        		}
	        	}else{
	        		channelname = CallingInfo.getChannelName();
	        		channelId = CallingInfo.getChannelID();
	        		NickName = this.getNickName(CallingInfo);
	        		//主叫号码
	        		var bindedPhoneNumber =  CallingInfo.getBindedPhoneNumber();
	        		//受理号码
	        		var subsNumber  = CallingInfo.getSubsNumber();
	        		acceptNumber = subsNumber;
	        		if(subsNumber != undefined && subsNumber != ""){
	        			if(subsNumber == bindedPhoneNumber){
	        				CustomerInfo = CallingInfo.getClientInfoMap(subsNumber);
	        			}else{
	        				CustomerInfo = CallingInfo.getClientInfoMap(subsNumber);
	        			}
	        			
	        		}else{
	        			CustomerInfo = CallingInfo.getClientInfoMap(bindedPhoneNumber);
	        		}
	        	}
        		
        	}
        	var json={};
        	if(CustomerInfo != null){
        		json = {
        				bean:{
        					"msisdn":acceptNumber,//受理号码
        					"channelname":channelname,//渠道名称
        					"NickName":NickName,//昵称
        					"channelId":channelId,//渠道ID
//        					"contactId":contactId,
//        					'callerNo':callerNo,//主叫号码
//        					'calledNo':calledNo,//被叫号码
//        					'callType':callType,//呼叫类型，呼入呼出
        					
        					'stopBootTel':CustomerInfo.stopBootTel,//停开机
        					'userName':CustomerInfo.userName,//客户姓名
        					'starLevel':CustomerInfo.starLevel,//号码星级
        					'oweFee':CustomerInfo.oweFee,//透支额度
        					'userStatus':CustomerInfo.userStatus,//状态
        					'customerNameList':CustomerInfo.customerNameList,//名单客户
        					'paymentMethod':CustomerInfo.paymentMethod,//付费方式
        					'provNm':CustomerInfo.provNm,//号码归属
        					'customerAssignment':CustomerInfo.customerAssignment,//客户归属
        					'userLevel':CustomerInfo.userLevel,//号码级别
        					'userBegin':CustomerInfo.userBegin,//入网日期
        					'curPlanName':CustomerInfo.curPlanName,//资费套餐
        					'telNumStarCode':CustomerInfo.telNumStarCode,//星级编码
        					'customerNameCode':CustomerInfo.customerNameCode,//客户编码
        					'customerAssignmentCode':CustomerInfo.customerAssignmentCode,//客户归属编码
        					'paymentMethodCode':CustomerInfo.paymentMethodCode,//付费方式编码
        					'telNumStateCode':CustomerInfo.telNumStateCode,//状态编码
        					'tariffPackagesCode':CustomerInfo.tariffPackagesCode,//套餐编码
        					'stopBootTelCode':CustomerInfo.stopBootTelCode,//停开机编码
        					'numAssignmentCode':CustomerInfo.numAssignmentCode//号码归属编码
        				}
        		}
        	}else if (acceptNumber){
        		json = {
        				bean:{
        					"msisdn":acceptNumber,//受理号码
        					"channelname":channelname,//渠道名称
        					"NickName":NickName,//昵称
        					"channelId":channelId,//渠道ID
//        					"contactId":contactId
//        					'serialNo':'',
//        					'callerNo':'',
//        					'calledNo':'',
//        					'callType':'',
        					
        					'stopBootTel':'',//停开机
        					'userName':'',//客户姓名
        					'starLevel':'',//号码星级
        					'oweFee':'',//透支额度
        					'userStatus':'',//状态
        					'customerNameList':'',//名单客户
        					'paymentMethod':'',//付费方式
        					'provNm':'',//号码归属
        					'customerAssignment':'',//客户归属
        					'userLevel':'',//号码级别
        					'userBegin':'',//入网日期
        					'curPlanName':'',//资费套餐
        					'telNumStarCode':'',//星级编码
        					'customerNameCode':'',//客户编码
        					'customerAssignmentCode':'',//客户归属编码
        					'paymentMethodCode':'',//付费方式编码
        					'telNumStateCode':'',//状态编码
        					'tariffPackagesCode':'',//套餐编码
        					'stopBootTelCode':'',//停开机编码
        					'numAssignmentCode':''//号码归属编码
        				}
        		}
        	};
	        $.extend(clientBusiInfo,json);
	        return clientBusiInfo;
        },
        getNickName: function(CallingInfo){
        	var NickName;
        	var ChannelID =  CallingInfo.getChannelID();
        	var multiAccountList  = CallingInfo.getMultiAccountList();
        	if(multiAccountList != null){
        		for(var i=0;i<multiAccountList.length;i++){
           		 if(multiAccountList[i].getChannelId() == ChannelID){
           			NickName = multiAccountList[i].getScreenName();
           			break;
           		 }
           		}	
        	}
        	return NickName;
        },
        //获取媒体类型
        getMediaType:function(){
        	var mediaType = "";
        	var CallingInfo =  getActiveCallingInfo();
        	if(CallingInfo != null){
        		 mediaType  = CallingInfo.getMediaType();	
        	}
        	if(mediaType != ""){
        		return mediaType
        	}else{
        		return "";
        	}
        },
        //获取接触ID
        getSerialNo:function(){
        	var serialNo = "";
        	var CallingInfo =  getActiveCallingInfo();
        	if(CallingInfo != null){
        		serialNo  = CallingInfo.getSerialNo();	
        	}
        	if(serialNo != ""){
        		return serialNo
        	}else{
        		return "";
        	}
        },
      //获取接触ID
        getContactId:function(){
        	var contactId = "";
        	var CallingInfo =  getActiveCallingInfo();
        	if(CallingInfo != null){
        		contactId  = CallingInfo.getContactId();	
        	}
        	if(contactId != ""){
        		return contactId
        	}else{
        		return "";
        	}
        },
        callOutInterface:function(paramJson){
        	if(paramJson.callOutType){
        		_index.ctiInit.AudioCallIds.setCallOutType(paramJson.callOutType);
        	}
        	/*var CTIID=index.CTIInfo.CTIId;;
			var ip=index.CTIInfo.IP;
			var port=index.CTIInfo.port;
			var proxyIP=index.CTIInfo.ProxyIP;
			var proxyPort=index.CTIInfo.ProxyPort;
			var isDefault=index.CTIInfo.isDefault;*/
        	if(paramJson.callerDigits && paramJson.calledDigits){
        		var call_id = {
    					"callerDigits":paramJson.callerDigits,
    					"calledDigits":paramJson.calledDigits
    			};
    			var url="";
    	        if(isDefault=="1"){//此种情况走nginx代理
    	       	 url=MediaConstants.CCACSURL + proxyIP + ":" + proxyPort + "/ccacs/"+ctiId+"/ws/call/callout";
    	        }else{                                 
    	       	 url= MediaConstants.CCACSURL+ip+":"+port+"/ccacs/ws/call/callout"; //跨域直连
    	        }
    	        _index.ctiInit.AudioCallIds.setIsInCallOut(true);
    	        if(_index.queue.browserName==="IE"){
        	        $.ajax({  
        	        	url : url ,
        	        	type : 'post',  
        	        	data :  JSON.stringify(call_id), 
        	        	contentType:"application/json; charset=utf-8",
        	        	crossDomain: true,
//        		        xhrFields: {
//        	                withCredentials: true
//                    	},
                        success : function(json){
                        	if(json.result == "0"){
                        		//存储呼叫类型 start
                            	_index.ctiInit.AudioCallIds.setCallFeature("1");//外呼1
	               				 //存储呼叫类型 end
                        		_index.popAlert("外呼请求成功，请等待响应。","通话提醒");
                        		_index.ctiInit.AudioCallIds.setCalloutCallId(json.callId);
                        		_index.ctiInit.AudioCallIds.setCalloutPhoneNums(call_id.calledDigits);
                        		_index.destroyDialog();
        						resultMsg = "呼叫请求成功";
                        	}else{
                        		_index.ctiInit.AudioCallIds.setIsInCallOut(false);
//                        		resultMsg = _index.ctiInit.ErrorcodeSearch.ErrorcodeSearch(json.result,"外呼请求失败,CTI错误码：" + json.result);
//                        		_index.popAlert(resultMsg,"错误提示");
                        		var errorcodeResultMsg=_index.ErrorcodeSearch.errorcodeSearch(json.result);
								_index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);
                        	}
                        	
                        	var paramsToProvince = {
                					"resultCode" : json.result,
                					"resultMessage" : resultMsg,
                					"reserved1" : "",
                					"reserved2" : "",
                					"reserved3" : ""
                			 };
//                			 _index.postMessage.sendToProvince("callOut", paramsToProvince);
                			 _index.postMessage.trigger("callOut", paramsToProvince, true);
                        	
                        },
                        error : function( XMLHttpRequest, textStatus, errorThrown) {
                        	_index.ctiInit.AudioCallIds.setIsInCallOut(false);
                        	var errorParams = {
        							"XMLHttpRequest":jqXHR,
        							"textStatus":textStatus,
        							"errorThrown":errorThrown
        					};
                    		console.log(url,call_id,errorParams,"网络异常，查询呼叫信息失败");
                    		var paramsToProvince = {
                					"resultCode" : -1,
                					"resultMessage" : "网络异常，外呼请求失败",
                					"reserved1" : "",
                					"reserved2" : "",
                					"reserved3" : ""
                			};
                    		_index.postMessage.trigger("callOut", paramsToProvince, true);
                    		
                    	}
        	        });
    	        }else{
        	        $.ajax({  
        	        	url : url ,
        	        	type : 'post',  
        	        	data :  JSON.stringify(call_id), 
        	        	contentType:"application/json; charset=utf-8",
        	        	crossDomain: true,
        		        xhrFields: {
        	                withCredentials: true
                    	},
                        success : function(json){
                        	if(json.result == "0"){
                        		//存储呼叫类型 start
                            	_index.ctiInit.AudioCallIds.setCallFeature("1");//外呼1
	               				 //存储呼叫类型 end
                        		_index.popAlert("外呼请求成功，请等待响应。","通话提醒");
                        		_index.ctiInit.AudioCallIds.setCalloutCallId(json.callId);
                        		_index.ctiInit.AudioCallIds.setCalloutPhoneNums(call_id.calledDigits);
                        		_index.destroyDialog();
        						resultMsg = "呼叫请求成功";
                        	}else{
                        		_index.ctiInit.AudioCallIds.setIsInCallOut(false);
//                        		resultMsg = _index.ctiInit.ErrorcodeSearch.ErrorcodeSearch(json.result,"外呼请求失败,CTI错误码：" + json.result);
//                        		_index.popAlert(resultMsg,"错误提示");
                        		var errorcodeResultMsg=_index.ErrorcodeSearch.errorcodeSearch(json.result);
								_index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);
                        	}
                        	
                        	var paramsToProvince = {
                					"resultCode" : json.result,
                					"resultMessage" : resultMsg,
                					"reserved1" : "",
                					"reserved2" : "",
                					"reserved3" : ""
                			 };
//                			 _index.postMessage.sendToProvince("callOut", paramsToProvince);
                        	 _index.postMessage.trigger("callOut", paramsToProvince, true);
                        	
                        },
                        error : function( XMLHttpRequest, textStatus, errorThrown) {
                        	_index.ctiInit.AudioCallIds.setIsInCallOut(false);
                        	var errorParams = {
        							"XMLHttpRequest":jqXHR,
        							"textStatus":textStatus,
        							"errorThrown":errorThrown
        					};
                    		console.log(url,call_id,errorParams,"网络异常，外呼请求失败");
                    		var paramsToProvince = {
                					"resultCode" : -1,
                					"resultMessage" : "网络异常，外呼请求失败",
                					"reserved1" : "",
                					"reserved2" : "",
                					"reserved3" : ""
                			};
                    		_index.postMessage.trigger("callOut", paramsToProvince, true);
                    	}
        	        });
    	        }

        	}else{
        		return "";
        	}
        },
        callOut:function(){
        	//判断是否在播放录音，若正在播放录音，则不能外呼
    		var playingRecord = _index.ctiInit.getPlayingRecord();
    		if(playingRecord){
    			_index.popAlert("请先停止放音，再进行外呼");
    			return;
    		}
    		//判断缓存是否有主叫号码数据,没有则从CTIInfo中获取
    		if (_index.ctiInit.AudioCallIds.getCallerPhoneNums().length < 1) {
    			if(_index.CTIInfo.outgoingNo){
    				// 获取主叫号码
    				var outgoingNo = _index.CTIInfo.outgoingNo;
    				var callerNums = outgoingNo.split(",");
    				_index.ctiInit.AudioCallIds.setCallerPhoneNums(callerNums);
    			}
    		}
    		
    		//获取最后接入的语音会话
    		var lastCallId = _index.ctiInit.AudioCallIds.getAudioLastCallId();
    		//获取被保持的语音会话id
    		var holdCallId = _index.ctiInit.AudioCallIds.getHoldCallId();
    		
    		if(lastCallId){
    			if(holdCallId){
    				if(JSON.stringify(lastCallId) == JSON.stringify(holdCallId)){
    					//加载外呼页
    					var config = {
    						title:'外呼', //弹出窗标题
    						url:'../../../comMenu/callOut/callOut', //要加载的模块
    						width:640, //对话框宽度
    						height:270 //对话框高度
    					}
    					_index.showDialog(config);
    				}else{
    					_index.popAlert("当前座席有正在进行的会话，无法进行外呼。");
    				}
    			}else{
    				_index.popAlert("当前座席有正在进行的会话，无法进行外呼。");
    			}
    		}else{
    			//加载外呼页
    			var config = {
    				title:'外呼', //弹出窗标题
    				url:'../../../comMenu/callOut/callOut', //要加载的模块
    				width:640, //对话框宽度
    				height:270 //对话框高度
    			}
    			_index.showDialog(config);
    		}
        },
        stateNum:function(){
        	return _signResult;
        },
        getCallingInfoBySerialNo:function(serialNo){
        	var CallingInfo=null;
        	if (serialNo) {
        		CallingInfo =  _index.CallingInfoMap.get(serialNo);
			}else {
				CallingInfo =  getActiveCallingInfo();
			}
        	return CallingInfo;
        }
        /*,
		recordCallCTILog:function(apiUrl,inputParams,resultMsg,result){
			recordCallCTILog(apiUrl,inputParams,resultMsg,result);
			return;
		}*/
	})
	
    //businessTree add by zwx346829  20161124  start
    var initBusinessTree = function(param){
    	$('.uiTabBody .uiTabItemBody').eq(0).append("<div class='chatTree' id='chatBox_tab' style='display:none'></div>");
    	//清空div
    	$("#chatBox_tab").empty();
    	var htm = "<a id='chatBox_search' class='chatBox_search'></a><a id='chatBox_error' class='chatBox_error'>纠错</a><button id='chatBox_close' class='chatBox_close' title='cancel'>×</button><div id='chatBox_tree'></div>";
    	$("#chatBox_tab").html(htm);
    	var treeModule = null,collectModule = null;
		var contentStr = null, selectorStr = '>.sn-tab-container>.J_tab_render>.J_content_render';
		var businessTree = null;
		//关闭
		$("#chatBox_close").click(function(e){
			$("#chatBox_tab").hide();
			$("#searchData").val("");
		});
		//搜索
		$("#chatBox_search").click(function(e){
			if(collectModule){
				if(!collectModule.is(":hidden")){
					collectModule&&collectModule.hide();
					$($(">.sn-tab-container>.J_tab_render>.sn-tab-items>.J_item_click", tab_chat.$el)[0]).trigger("click");
					$("#searchData").show();
				}else{
					if($("#searchData").is(':hidden')){
						$("#searchData").show();
					}else{
						$("#searchData").hide();
					}
				}
			}else{
				if($("#searchData").is(':hidden')){
					$("#searchData").show();
				}else{
					$("#searchData").hide();
				}
			}
		});
		var config = {
				el : $("#chatBox_tree"),
				tabs : [ 
					{
						title : '业务树',
						click : function(e, tabData) {
							//隐藏收藏夹
							collectModule&&collectModule.hide();
							$("#chatBox_error").show();
							require(['../../../content/businessTree/businessTree'],function(BusinessTree){
								if(treeModule){
									treeModule.show();
									businessTree.triggerClick();
								}else{
									treeModule = $('<div class="treeBox"></div>');
									businessTree = new BusinessTree(_index,param);
									treeModule.html(businessTree.content);
									contentStr.append(treeModule); 
								}
							});
						}
					}, 
					{
						title : '收藏夹',
						click : function(e, tabData) {
							//隐藏业务树
							treeModule&&treeModule.hide();
							$("#chatBox_error").hide();
							var favorite = null;
							require(['../../../content/businessTree/favorite'],function(Favorite){
								if (collectModule){
									collectModule.show();
									collectModule.empty();
									param.content = businessTree.getCurrentTreeContent();
									favorite = new Favorite(_index,param);
									collectModule.html(favorite.content);
								}else{
									collectModule = $('<div class="collectBox"></div>');
									contentStr.append(collectModule);
									param.content = businessTree.getCurrentTreeContent();
									favorite = new Favorite(_index,param);
									collectModule.html(favorite.content);
								}
							});
				    }
			}]
			};
			var tab_chat = new Compts.Tab(config);
			contentStr = $(selectorStr, tab_chat.$el);
    }   
    //获取当前活跃的CallingInfo
    function getActiveCallingInfo(){
    	var activeSerialNo =  _index.CallingInfoMap.getActiveSerialNo();
    	var CallingInfo = _index.CallingInfoMap.get(activeSerialNo);
    	return CallingInfo;
    }
    //cti调用日志
    /*function recordCallCTILog(apiUrl,inputParams,resultMsg,result){
		var datas = {
				"staffId" : staffId,
				"ctiId" : ctiId,
				"ccId" : ccId,
				"vdnId" : vdnId,
				"apiUrl" : apiUrl,
				"inputParams" : JSON.stringify(inputParams),
				"resultMsg" : JSON.stringify(resultMsg),
				"result" : result
		};
		Util.ajax.postJson("front/sh/media!execute?uid=addCTIAPILog",datas, function(json, status) {});
    }*/
    return objClass;
});
