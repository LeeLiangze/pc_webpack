/**
 * 304事件
 * 通话状态变化事件,解析通话状态变化(通话开始)事件中的数据
 */
define(['Util',
        '../callingInfoMap/CallingInfo',
        '../callingInfoMap/CustInfo',
        './CTIEventsDeal',
        '../../index/constants/mediaConstants',
        '../../log/transferOutLog',
        'jquery.tiny'], function(Util,CallingInfoIns,CustInfo,CTIEventsDeal,Constants,TransferOutLog) {
	var index;
	var comUI;
	var CTIID;
	var ip;
	var port;
	var proxyIP;
	var proxyPort;
	var isDefault;
	var callingInfo;
	var startTalking = function(indexModule) {
		index = indexModule;
		comUI = index.comMenu.comUI;
		CTIID = index.CTIInfo.CTIId;
		ip=index.CTIInfo.IP;
		port=index.CTIInfo.port;
		proxyIP=index.CTIInfo.ProxyIP;//代理IP
	    proxyPort =index.CTIInfo.ProxyPort;//代理端口
	    isDefault=index.CTIInfo.isDefault;//缺省业务标志值
	};
	$.extend(startTalking.prototype,{
		startTalkingEvent : function(uselessObj,startTalkingEvent) {
			//整理态设置start yuexuyang
			var tidyFinishingState =index.ctiInit.AudioCallIds.getTidyFinishingState();
			var defaultTidyState = index.CTIInfo.autoArrage;
			var tidyFlag=tidyFinishingState ? tidyFinishingState : defaultTidyState;
			if ( tidyFlag=="1") {
				var sign_url = "";
			    if(isDefault == "1"){
			    	sign_url = Constants.CCACSURL + proxyIP + ":" + proxyPort + "/ccacs/" + CTIID + "/ws/agent/setagentautoenteridle";
			    }else{
			    	sign_url = Constants.CCACSURL + ip + ":" + port +"/ccacs" + "/ws/agent/setagentautoenteridle";//跨域直连
			    }
			    var option = index.serialNumber.getSerialNumber();//获取随机数
			    var requestData = {"flag":"1","opserialNo":option};
			    if(index.queue.browserName==="IE"){  //注意index的
			    	 $.ajax({
				    		url : sign_url ,
				    		type : 'post', 
				    		data : JSON.stringify(requestData),
				    		crossDomain: true,
				    		contentType:"application/json; charset=utf-8",
				    		success : function(json) {
					    		if(json.result=="0"){
					    			//workTypeUi(_this)	
								}else{
									index.popAlert('切换整理态为人工失败!');
								}
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
					 $.ajax({
				    		url : sign_url ,
				    		type : 'post', 
				    		data : JSON.stringify(requestData),
				    		crossDomain: true,
					        xhrFields: {
					                withCredentials: true
					                },
				    		contentType:"application/json; charset=utf-8",
				    		success : function(json) {
					    		if(json.result=="0"){
					    			//workTypeUi(_this)	
								}else{
									index.popAlert('切换整理态为人工失败!');
								}
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
			}
			//整理态设置end yuexuyang
			
			if(index.ctiInit.AudioCallIds.getIsInCallOut()) {
				index.ctiInit.AudioCallIds.setIsInCallOut(false);
				var callOutType = index.ctiInit.AudioCallIds.getCallOutType();
				var paramsToProvince = {
						"resultCode" : 0,
						"resultMessage" : "呼出结果事件，成功",
						"callOutType":callOutType ? callOutType : "",
						"reserved1" : "",
						"reserved2" : "",
						"reserved3" : ""
				};
				index.postMessage.sendToProvince("callOutResultEvent", paramsToProvince);
				index.postMessage.trigger("callOutResultEvent", paramsToProvince, true);
			}
			//收到通话开始事件就记录通话开始时间
			var callStartTime = new Date();
			index.CallingInfoMap.put("callStartTime",callStartTime);
			index.clientInfo.timerWait.startTime().end();
			index.clientInfo.timerWait.setStatus('通话中');
			$('#timer').html("00:00");
			var paramsToProvince = {
					"resultCode" : 0,
					"resultMessage" : "通话状态变化事件",
					"reserved1" : "",
					"reserved2" : "",
					"reserved3" : ""
			};
			index.postMessage.sendToProvince("startTalkingEvent", paramsToProvince);
			index.postMessage.trigger("startTalkingEvent", paramsToProvince, true);

		//裴书贤改造，304目前只处理转接。接语音时应另外补充
		var callIdArr = startTalkingEvent.callId;
		if(callIdArr == undefined || callIdArr ==""){
			return;
		}
		var options= index.serialNumber.getSerialNumber();//获取随机数
		var call_id = {
				"callId":{
					        "time":callIdArr.time,
					        "dsn":callIdArr.dsn,
					        "handle":callIdArr.handle,
					        "server":callIdArr.server
				          },
				  "opserialNo":options
		              };
        if(ip == undefined || port == undefined){
        	return;
        	}
        var url="";
        if(isDefault=="1"){//此种情况走nginx代理
       	 url=Constants.CCACSURL + proxyIP + ":" + proxyPort + "/ccacs/"+CTIID+"/ws/query/callinfo";
        }else{
       	 url= Constants.CCACSURL+ip+":"+port+"/ccacs/ws/query/callinfo"; //跨域直连
        }

        if(index.queue.browserName==="IE"){  //注意index的
			//IE逻辑
            $.ajax({
            	url : url ,
            	type : 'post',
            	data :  JSON.stringify(call_id),
            	contentType:"application/json; charset=utf-8",
            	crossDomain: true,
//    	        xhrFields: {
//    	                withCredentials: true
//    	                },
            	success : function(json) {
            		//获取callFeature的值
            		if(json.result=="0"){
            			//index.CallingInfoMap.recordCallCTILog(url,call_id,json,"查询呼叫信息成功");
            		}else{
            			//index.CallingInfoMap.recordCallCTILog(url,call_id,json,"查询呼叫信息失败");
            		}
            		 // 获取 媒体类型
    			   var mediaType = json.mediaType;
    			    // 主叫对应callerNo
    			   var caller =  json.caller;
    			   //原始呼叫信息
    			   var origCallInfo=json.origCallInfo;
    			   var currentCallFeature=json.callFeature;
    			   var _callingInfo=new CallingInfoIns();
    			   // 如果媒体类型为5,表示语音,否则执行常规的多媒体逻辑
    			   if(mediaType == Constants.VOICE_TYPE){
	    				 //存储呼叫类型 start
    				   if(index.ctiInit.AudioCallIds){
						   if(index.ctiInit.AudioCallIds.callFeature == ""){
							   	 //存储呼叫类型 start
			                   	index.ctiInit.AudioCallIds.setCallFeature("0");//呼入0
		         				 //存储呼叫类型 end
						   }
					   }
          				 //存储呼叫类型 end
    				   //var workNo = index.CallingInfoMap.getWorkNo();
    				   var workNo = index.CTIInfo.workNo;
    				   var callOutCallId = index.ctiInit.AudioCallIds.getCalloutCallId();
    				   var called = json.called;
    				   var newCallId = "" + callIdArr.time + callIdArr.dsn + callIdArr.handle + callIdArr.server;
    				   //设置状态为通话中
    				   index.clientInfo.timerWait.setStatus('通话中');
    				   //将获取的呼叫类型放入audioCallIds被touch001调用存入接触 start
    				   //获取https://ip:port/ccacs/ws/query/callinfo中的callFeature字段
    				   //var callFeature = json.callFeature;
    				   //index.ctiInit.AudioCallIds.setCallFeature(callFeature);
    				   //将获取的呼叫类型放入audioCallIds被touch001调用存入接触 end
    				   //通话保持后,结束保持的逻辑----start
    				   var currentCallId = index.ctiInit.AudioCallIds.getHoldCallId();
    				   if(JSON.stringify(callIdArr) == JSON.stringify(currentCallId)){
    					   var serialNo = index.CallingInfoMap.getSerialNoByCallId(newCallId);
    					   // 设置当前接触会话
    					   index.CallingInfoMap.setActiveSerialNo(serialNo);
    					   index.CallingInfoMap.setAudioActiveserialNo(serialNo);
    					   // 清空值
    					   index.ctiInit.AudioCallIds.setHoldCallId("");
    					   // 设置按钮为通话保持状态
    					   comUI.setAppointedInnerText("callHoldBtn","通话保持");
    					   comUI.setAppointedBtnEnabled("callOutBtn",false);//恢复通话后,将外呼按钮置灰
    					   var currentTime = index.utilJS.getCurrentTime();
    					 //主叫号码和当前坐席相等时 ,或者callId与外呼生成的callId相同时,说明恢复的是之前保持的外呼的语音会话 --by  yuxinyuan
    					   if(caller == workNo||JSON.stringify(callIdArr) == JSON.stringify(callOutCallId))
    					   {
    						   caller = called;
    					   }
    						   // 调用语音界面，展示语音界面
    						   var contactDetail={
    									 "contactId":serialNo,
    									 "callerNum":caller,
    								     "logTime":currentTime,
    								     "mediaTypeId":mediaType
    				                  };
    				            // 调用展示用户消息的接口。
    						   index.queue.trigger('itemClick', null, contactDetail,null,{});
    						 //通话保持后,结束保持的逻辑----end
    					   }else{
    						   //如果 存在接触Id,表示已经存在callingInfo对象，则不在创建对象，终止程序向下执行 
    						   var hasCallingInfo = index.CallingInfoMap.getSerialNoByCallId(newCallId);
    						   if(hasCallingInfo != undefined){
								    // 设置当前接触会话
    							   index.CallingInfoMap.setAudioActiveserialNo(index.CallingInfoMap.getSerialNoByCallId(newCallId));
    							 //解决受理号码的问题 by yuexuyang  start
    							   if (origCallInfo) {
    								   _callingInfo.setCallerNo(origCallInfo.caller);
    								   _callingInfo.setCalledNo(origCallInfo.called);
    								   var callFeature =origCallInfo.callFeature;
    								   if (callFeature=="0") {//0的话caller是受理号码，7的话called是受理号码
    								   _callingInfo.setSubsNumber(origCallInfo.caller);
    								   index.clientInfo.initCustInfoConference(origCallInfo.caller,true);
    								   }else if (callFeature=="7"){
											_callingInfo.setSubsNumber(origCallInfo.called);
											index.clientInfo.initCustInfoConference(origCallInfo.called,true);
									}
    							   }
    							 //受理请求设置原始客户号码
    							   var subsNumberTemp=_callingInfo.getSubsNumber() ? _callingInfo.getSubsNumber() : "";
    							   _callingInfo.setOrigCustNum(subsNumberTemp);
    							   //解决受理号码的问题 by yuexuyang  end
//									index.CallingInfoMap.setActiveSerialNo(index.CallingInfoMap.getSerialNoByCallId(newCallId));//ZHANGYINGSHENG
									return;
    						   }
    						   index.ctiInit.AudioCallIds.pushAudioNewCallId(callIdArr);//此处把后前的提前
    						   var mediaTypeName = "语音";
    						   var channelID = "5";
    						   var channelName = "语音";
    						   var callSkill = json.callSkill;
    						   var serviceType = index.CTIInfo.serviceTypeId;
    						   var ctiId = index.CTIInfo.CTIId;
    						   var ccId = index.CTIInfo.CCID;
    						   var vdnId = index.CTIInfo.VDN_ID;
    						   var staffId = index.getUserInfo().staffId;
    						   var staffProvinceId = index.getUserInfo().proviceId?index.getUserInfo().proviceId:"";
    						   var contactId;
    						   var serialNo;// 向后台发送同步请求，生成serialno
    						   var skillId="";
    						   var tags="";
    						   if(caller == workNo||JSON.stringify(callIdArr) == JSON.stringify(callOutCallId))
    						   {
    							   //caller = called;
    							   _callingInfo.setCallType("1");
    						   }else{
    							   _callingInfo.setCallType("0");
    						   }
    						   var params ={"skillDesc":callSkill,"ctiId":ctiId,"ccId":ccId,"vdnId":vdnId};
                               //ajax同步：使用同步获取serialNo，没有serialNo会话直接报错
    						   Util.ajax.postJson("front/sh/media!execute?uid=randomSerialNo",params, function(json, status) {
    								if (status) {
    									   serialNo = json.bean.serialNo;
    									   skillId = json.bean.skillId;
    								}else{
    									return;
    								}
    							},true);
    						   var tagsInfo ={"phoneNum":caller,"mediaType":mediaType};
                               //同步ajax：获取用户相关标签，如果异步则可能导致标签显示不到界面上
    						   Util.ajax.postJson("front/sh/media!execute?uid=audioTags",tagsInfo, function(json, status) {
    								if (status) {
    									tags = json.bean.tags;
    								}
    							},true);
    						   contactId=serialNo;
    						   // 继续构建其它数据,从呼叫信息中获取callingInfo对象对应的属性，将对应的属性植入callingInfo对象
    						   var oldCallId = callIdArr;
    						   var callidTime = oldCallId.time;
    						   var calliddsn = oldCallId.dsn;
    						   var callIdHandle = oldCallId.handle;
    						   var callIdServer = oldCallId.server;
    						   var callId = ""+callidTime+calliddsn+callIdHandle+callIdServer;
    						   var audioStartTime = index.utilJS.getCurrentTime();
    						   // 设置值得时候会根据callInfo对象定义的方式做相应的调整
    						   _callingInfo.setCallId(callId);
    						   _callingInfo.setMediaType(mediaType);
    						   /* add by wwx160457 for yuyin business at 201608011127 start*/
    						   _callingInfo.setMediaTypeName(mediaTypeName);
    						   _callingInfo.setChannelID(channelID);
    						   _callingInfo.setChannelName(channelName);
    						   /* add by wwx160457 for yuyin business at 201608011127 end*/
    						   _callingInfo.setCallIdTime(callidTime);
    						   _callingInfo.setCallIdDsn(calliddsn);
    						   _callingInfo.setCallIdHandle(callIdHandle);
    						   _callingInfo.setCallIdServer(callIdServer);
    						   _callingInfo.setCallerNo(caller);
    						   _callingInfo.setCalledNo(called);
    						   if(currentCallFeature != "51"){// && currentCallFeature != "52"
    							   index.ctiInit.orgCallerNo = caller;
    							   index.ctiInit.orgCalledNo = called;
    						   }
    						   _callingInfo.setAudioBeginTime(audioStartTime);
    						   _callingInfo.setSubsNumber(caller);
    						   var callFeatureNew =json.callFeature;
							   if (callFeatureNew=="7") {
								   _callingInfo.setSubsNumber(called);
							   }
    						   var callDataJson=json.callData;
							   if (callDataJson) {
								   try {
							            callDataJson=JSON.parse(callDataJson);
							            if (callDataJson.isOutCall) {
							            	_callingInfo.setSubsNumber(called);
							            }
							        } catch(e) {
							           // console.log(e);
							        }
							   }
    						   _callingInfo.setSerialNo(serialNo);
    						   _callingInfo.setContactId(contactId);
    						   _callingInfo.setSkillDesc(callSkill);
    						   _callingInfo.setSkillId(skillId);
    						   _callingInfo.setCtiId(ctiId);
    						   _callingInfo.setCcId(ccId);
    						   _callingInfo.setVdnId(vdnId);
    						   _callingInfo.setCustTags(tags);
    						   _callingInfo.setServiceTypeId(serviceType);
    						   _callingInfo.setOrigCallInfo(origCallInfo);
    						   _callingInfo.setCallFeature(currentCallFeature);
    						   callingInfo = _callingInfo;
    						   index.ctiInit.AudioCallIds.setIsConferenceCalledNo(called);//设置三方通话的被叫号码
    						   var CTICallId = callidTime+"-"+((callIdServer<<24)+(callIdHandle<<16)+calliddsn);
    						   //呼叫类型从callInfo(CTI接口)中获取  start
							    var callTypeFromCTI = _callingInfo.callFeature;
							    var callType="";
							    switch(callTypeFromCTI){
								    case 0:callType="0";break;//呼入
								    case 7:callType="1";break;//外呼
								    case 6:callType="2";break;//内部呼叫
								    case 51:callType="3";break;//内部求助
							    }
							    //呼叫类型从callInfo(CTI接口)中获取  end
    						   // 构造接触信息
    						   var t_cct_contact = {
    									 "serialNo":serialNo,  // 表的字段：呼叫信息对应的值
    									 "contactId":contactId,
    									 "mediaTypeId":mediaType,
    									 "mediaTypeName":mediaTypeName,
    									 "channelID":channelID,
    									 "channelName":channelName,
    									 "ctiId":ctiId,
    									 "ccid":ccId,
    									 "vdnId":vdnId,
    									 "callId":callId,
    									 "callIdTime":callidTime,
    									 "callIdDsn":calliddsn,
    									 "callIdHandle":callIdHandle,
    									 "callIdServer":callIdServer,
    									 "callSkillId":skillId,
    									 "callerNo":caller,
    									 "calledNo":called,
    									 //原始主叫
    									 "orgCallerNo" : index.ctiInit.orgCallerNo?index.ctiInit.orgCallerNo:"",
    									 //原始被叫
    									 "orgCalledNo" : index.ctiInit.orgCalledNo?index.ctiInit.orgCalledNo:"",
										 //呼叫类型
    									 "callType" : callType?callType:index.ctiInit.AudioCallIds.callFeature,
    									 "staffId":staffId,
    									 "serviceTypeId":serviceType,
    									 "staffProvinceId":staffProvinceId,
    									 "ctiCallId":CTICallId,
    									 "contactStartTime":audioStartTime,
    									 //"callType":caller == workNo ||JSON.stringify(callIdArr) == JSON.stringify(callOutCallId)?"1":"0",
    									 "srFlag":"0",
    									 "dataType":"contact_insert"
    							   };
    							   // 记录客户接触信息
    							   Util.ajax.postJson("front/sh/common!execute?uid=touch001",t_cct_contact,function(json,status){
    								   if(status){
    								   }else{
    								   }
    							   });
    							   //主叫号码和当前坐席相等时
    							   if(caller == workNo ||JSON.stringify(callIdArr) == JSON.stringify(callOutCallId))
    							   {
    								   //_callingInfo.setCalledNo(caller);
    								   caller = called;
    								   //_callingInfo.setCallerNo(caller);
    								   _callingInfo.setSubsNumber(caller);
    							   }
    							   //解决受理号码的问题 by yuexuyang  start
    							   if (origCallInfo) {
    								   var callFeature =origCallInfo.callFeature;
    								   if (callFeature=="0") {//0的话caller是受理号码，7的话called是受理号码
    								   _callingInfo.setSubsNumber(origCallInfo.caller);
    								   }else if (callFeature=="7"){
											_callingInfo.setSubsNumber(origCallInfo.called);
									}
    							   }
    							   //受理请求设置原始客户号码
    							   var subsNumberTemp=_callingInfo.getSubsNumber() ? _callingInfo.getSubsNumber() : "";
    							   _callingInfo.setOrigCustNum(subsNumberTemp);
    							   //解决受理号码的问题 by yuexuyang  end
    							   // 将callingInfo对象存入callingInfoMap中,key的值是contactId
    							   index.CallingInfoMap.put(contactId,_callingInfo);
    							   var contactDetail={
											 "serialNo":contactId,
											 "callerNum":caller,
											 "logTime":currentTime,
											 "mediaTypeId":mediaType+''
									 };	
    							   index.queue.receiveMessage(contactDetail);
//    							   // 设置当前接触会话
//								   index.CallingInfoMap.setActiveSerialNo(serialNo);//ZHANGYINGSHENG
    							   //设置语音为激活的callId
								   index.CallingInfoMap.setAudioActiveserialNo(serialNo);
    							   // 此处屏蔽该行，改为在点击队列时设置当前接触会话，modified by zwx160456
    							   index.CallingInfoMap.getSerialNoByCallId(contactId);
    							   // 将当前事件的callId设置到缓存
    							 //index.ctiInit.AudioCallIds.pushAudioNewCallId(callIdArr);//此处提前,太靠后会导致queue.js取不到lastAudioCallId

    							 //客户接入并向坐席发送第一条消息时，添加查询客户业务信息的逻辑，add by zwx160456
    								 var MSISDN = _callingInfo.getSubsNumber();
    								 //调用手机画像接口查询客户业务信息
    								//获取调用客户信息url
    								 var SourceURL = index.getSourceURL()[0].url;
    								// var SourceURL = "ZXYWSL";
    								 if(serviceType == "otck"){
    									 var mayURL = "front/sh/common!execute?uid=queryUserInfo001";
    								 }else{
    									 var mayURL = "front/sh/common!execute?uid=queryUserInfo";
    								 }
    								 var  msisdnData ={
    							        		"userMobile":MSISDN,
    							        		"serviceCode":SourceURL,
    							        		"serviceTypeId":serviceType,
    							        		"staffId":staffId
    							        };
    								  var  isHasCustInfo = index.CallingInfoMap.get("acceptNumber");
    								  if(isHasCustInfo&&isHasCustInfo.subsNumber==MSISDN){
    									  _callingInfo.setClientInfoMap(MSISDN,isHasCustInfo);
   										 index.CallingInfoMap.put(serialNo,_callingInfo);
   										$(".callerNo").text(_callingInfo.callerNo);
  										$(".calledNo").text(_callingInfo.calledNo);
    								  }else{
//    									  if(RegExp("(^1(3[4-9]|4[7]|5[0-27-9]|7[8]|8[2-478])\\d{8}$)|(^1705\\d{7}$)").test(MSISDN)){
                                              //同步ajax:获取用户相关信息，异步则会导致用户部分信息显示不出来
    									  if(json.callFeature =='7'){
          								     Util.ajax.postJson(mayURL,msisdnData,function(json,status){
          									   if(status){
          										 var custInfo = json.beans[0];
          										 if (custInfo.starLevel == "" &&custInfo.telNumStarCode == "" ) {
          			                            	custInfo.telNumStarCode = "99";
          			                            }
          										 var _custInfo = new CustInfo();
                                                   _custInfo.subsNumber = MSISDN;
                                                   _custInfo.phoneNumber = MSISDN;
          										 $.extend(_custInfo,custInfo);
          										 _callingInfo.setClientInfoMap(MSISDN,_custInfo);
          										 index.CallingInfoMap.put(serialNo,_callingInfo);
          								 }else{
          										 var bean={
          									   				"phoneNumber":MSISDN,
          									   				"provNm":"",
          									   				"provCode":"",
          					        	    				"cityNm":"",
          					        	    				"distrtCode":"",
          									    			"userName":"",
          									    			"userId":"",
          									    			"userIdVal":"",
          									    			"userBrand":"",
          									    			"userBrandVal":"",
          									    			"userLevel":"",
          									    			"userLevelVal":"",
          									    			"userStatus":"",
          									    			"userStatusVal":"",
          									    			"userBegin":"",
          									    			"realNameInfo":"",
          									    			"starLevel":"",
          									    			"starScore":"",
          									    			"starTime":"",
          									    			"email":"",
          									    			"zipCode":"",
          									    			"userAdd":"",
          									    			"userNum":"",
          									    			"flag4G":"",
          									    			"volteFlag":"",
          									    			"accoutDay":"",
          									    			"curPlanId":"",
          									    			"curPlanName":"",
          									    			"startTime":"",
          									    			"endTime":"",
          									    			"nextPlanId":"",
          									    			"nextPlanName":"",
          									    			"curFeeTotal":"",
          									    			"curFee":"",
          									    			"realFee":"",
          									    			"oweFee":""
          												}
          										 var _custInfo = new CustInfo();
                                                   _custInfo.subsNumber = MSISDN;
          										 $.extend(_custInfo,bean);
          										 _callingInfo.setClientInfoMap(MSISDN,_custInfo);
          										 index.CallingInfoMap.put(serialNo,_callingInfo);

          								    }
          								 },true);
    									  }
//          							}
    								  }
  								 
    							var paramsToProvince = {
    				 					"serialNo" : _callingInfo.serialNo,
    				 					"workNo" : index.getUserInfo().staffId,
    				 					"callerNo" : _callingInfo.callerNo,
    				 					"calledNo" : _callingInfo.calledNo,
    				 					"subsNumber" : _callingInfo.subsNumber,
    				 					"skillQueue" : _callingInfo.skillDesc, // skillDesc 为技能队列描述 skillId 为技能队列id
    				 					"reserved1" : "",
    				 					"reserved2" : "",
    				 					"reserved3" : ""
    				 			};
    				 			index.postMessage.sendToProvince("callInfo", paramsToProvince);

    								 // 获取当前语音会话数组的大小
    								 var audioSize = index.ctiInit.AudioCallIds.getAudioCallIdsSize();
    								 if(audioSize ==1){
    									 // 对按钮的值做处理
    									 var arr = ['PasswordValidate','CallHold','CallMute','CallEnd'];
    									 // 设置受理请求高亮
//    								   //comUI.enableButton(arr);
    								 }
//    								 var currentTime = index.utilJS.getCurrentTime();
//    								 // 调用语音界面，展示语音界面
//    								 var contactDetail={
//    										 "serialNo":contactId,
//    										 "callerNum":caller,
//    										 "logTime":currentTime,
//    										 "mediaTypeId":mediaType+''
//    								 };
//    								 // 调用展示用户消息的接口。
//    								 index.queue.receiveMessage(contactDetail);
    								 //如果会话是由转接进入就弹窗显示随路信息 start by yuexuyang
    								 var callData = json.callData;
									 if (callData) {
										 var callDataArr= callData.split("|");
										 var _userName ="";
										 var _transferMsg ="";
										 var staffFrom ="";
										 if (callDataArr && callDataArr[0]=='005') {
											 var transferMsg= callDataArr[4];
											 var transferMsgArr =transferMsg.split("&");
											 _userName=transferMsgArr[1] ? transferMsgArr[1] : "无";
											 _transferMsg=transferMsgArr[0] ? transferMsgArr[0] : "无";
											 staffFrom = callDataArr[3] ? callDataArr[3] : "无";
										}else{
											if (callData) {
												   try {
											            callData=JSON.parse(callData);
											            _transferMsg=callData.transferMsg ? callData.transferMsg : "无";
														_userName=callData.userName ? callData.userName : "无";
														staffFrom = callData.staffId ? callData.staffId : "无";
											        } catch(e) {
											            //console.log(e);
											        }
											   }
										}
										if (_userName!=""&&staffFrom!=""&&_userName!="无"&&staffFrom!="无") {
											 var contentHtml='<ul style="height: 150px;overflow: auto;"><li style="list-style: none;"><span style="display: inline-block;width: 150px;margin-bottom: 10px;text-align: right;">'
													+'客户姓名：</span><span style="display: inline-block;width: 150px;margin-bottom: 10px;">'+
													_userName+'</span></li><li style="list-style: none;"><span style="display: inline-block;width: 150px;margin-bottom: 10px;text-align: right;">'
													+'客服编号：</span><span style="display: inline-block;width: 150px;margin-bottom: 10px;">'+
													staffFrom+'</span></li><li style="list-style: none;position: relative;"><span style="display: inline-block;width: 150px;margin-bottom: 10px;text-align: right;">'
													+'转接(连线)信息：</span><p style="display: inline-block;width: 300px;margin-bottom: 10px;top: 0;position: absolute;">'+
													_transferMsg+'</p></li></ul>';
			        							var config = {
			        									  title: '转接信息',  //对话框标题
			        									  content: contentHtml,  //对话框内容，可以是字符串、html片段、或dom对象
			        									  width:500,  //对话框宽度
			        									  height:150, //对话框高度
			        									  skin:'dialogSkin',  //对话框额外的样式
			        									  padding:'30', //消息内容和消息容器的边距
			        									  fixed:'true', //(默认值: false) 开启固定定位。
			        									  zIndex:5,   //(默认值: 1024) 重置全局zIndex初始值，用来改变对话框叠加高度。
			        									  quickClose: false  //点击空白处快速关闭
			        									}
			        									var d = Util.dialog.openDiv(config);
			        										d.show();   //打开普通对话框
										}
								}
    								 //如果会话是由转接进入就弹窗显示随路信息 end by yuexuyang
    					   }
    				   //添加日志
    				   failId = json.result;
//					   if(json.result=="0"){
//							 status_log = "1";
//							 tLogInfo.call(this);
//					   }else{
//		            		 status_log = "0";
//		            		 tLogInfo.call(this);
//					   }
    				 }else{
            		var oldCallId = json.callId;
            		var callidTime = callIdArr.time;
            		var calliddsn = callIdArr.dsn;
            		var callIdHandle = callIdArr.handle;
            		var callIdServer = callIdArr.server;
            		//针对转接的业务场景，重新设置_callingInfo的部分属性
    		        		var callData = json.callData;
    		        		if(callData){
    		        			callData = JSON.parse(callData);
    		        			if(callData.transflag != undefined && callData.transflag == true){
    		        				var staffFrom = callData.staffId ? callData.staffId : "无";
    		        				var staffName = callData.staffName;
    		        				var  channelId = callData.channelId;
    		        				var options= index.serialNumber.getSerialNumber();//获取随机数
    		        				// 1、封装多媒体消息
    		        				var sendImgMsg={
    		        						callId:{
    		        							time:callidTime,
    		        							dsn:calliddsn,
    		        							handle:callIdHandle,
    		        							server:callIdServer
    		        						},
    		        						dataMode:"0",
    		        						dataMessage:{
    		        							transferFlag:"true",
    		        							content:"转自工号："+ staffFrom + "(" + staffName + ")"
    		        						},
    		        						"opserialNo":options
    		        				};
    		        				var trsUrl="";
    		        		        if(isDefault=="1"){//此种情况走nginx代理
    		        		        	trsUrl=Constants.CCACSURL + proxyIP + ":" + proxyPort + "/ccacs/"+CTIID+"/ws/call/sendmessage";
    		        		        }else{
    		        		        	trsUrl= Constants.CCACSURL+ip+":"+port+"/ccacs/ws/call/sendmessage"; //跨域直连
    		        		        }
    		        				//封装向cti发送信息的数据结构
            				$.ajax({
            					url : trsUrl ,
            					type : 'post',
            					data : JSON.stringify(sendImgMsg),
            					contentType:"application/json; charset=utf-8",
//            					xhrFields: {
//    							    withCredentials: true
//    							},
            					success : function(json) {
            						if(json.result == "0"){
//            							index.CallingInfoMap.recordCallCTILog(trsUrl,sendImgMsg,json,"发送转接消息成功");
            							console.log(trsUrl,sendImgMsg,json,"发送转接消息成功");
            							index.popAlert("转自工号:"+ staffFrom +"("+staffName + "),转接信息:" + callData.transferMsg,"转接信息");
            							//如果会话是由转接进入就弹窗显示随路信息 start by yuexuyang
                                        //如果会话是由转接进入就弹窗显示随路信息 end by yuexuyang
            						}else{
//            							index.CallingInfoMap.recordCallCTILog(trsUrl,sendImgMsg,json,"发送转接消息失败");
            							console.log(trsUrl,sendImgMsg,json,"发送转接消息失败");
            						}
            					},
            					error : function( XMLHttpRequest, textStatus, errorThrown) {
            		        		var errorParams = {
                	            			"XMLHttpRequest":XMLHttpRequest,
                	            			"textStatus":textStatus,
                	            			"errorThrown":errorThrown
                	            	};
//            		        		index.CallingInfoMap.recordCallCTILog(trsUrl,sendImgMsg,errorParams,"网络异常，发送转接消息失败");
            		        		console.log(trsUrl,sendImgMsg,errorParams,"网络异常，发送转接消息失败");
            		        	}
            				});
            			}

            		}
            	}
    			   if(mediaType == Constants.VOICE_TYPE){
    				   failId = json.result;
    				   if(json.result=="0"){
    						 status_log = "1";
    						 tLogInfo.call(this);
    				   }else{
    	            		 status_log = "0";
    	            		 tLogInfo.call(this);
    				   }
    			   }
    			  
            	},
            	error : function( XMLHttpRequest, textStatus, errorThrown) {
            		var errorParams = {
                			"XMLHttpRequest":XMLHttpRequest,
                			"textStatus":textStatus,
                			"errorThrown":errorThrown
                	};
//            		index.CallingInfoMap.recordCallCTILog(url,call_id,errorParams,"网络异常，查询呼叫信息失败");
            		console.log(url,call_id,errorParams,"网络异常，查询呼叫信息失败");
            	}
            });
		}else{
			//其他浏览器逻辑
	        $.ajax({
	        	url : url ,
	        	type : 'post',
	        	data :  JSON.stringify(call_id),
	        	contentType:"application/json; charset=utf-8",
	        	crossDomain: true,
		        xhrFields: {
		                withCredentials: true
		                },
	        	success : function(json) {
	        		//获取callFeature的值
	        		if(json.result=="0"){
	        			//index.CallingInfoMap.recordCallCTILog(url,call_id,json,"查询呼叫信息成功");
	        		}else{
	        			//index.CallingInfoMap.recordCallCTILog(url,call_id,json,"查询呼叫信息失败");
	        		}
	        		 // 获取 媒体类型
				   var mediaType = json.mediaType;
				    // 主叫对应callerNo
				   var caller =  json.caller;
				   //原始呼叫信息
    			   var origCallInfo=json.origCallInfo;
    			   var currentCallFeature=json.callFeature;
    			   var _callingInfo=new CallingInfoIns();
				   // 如果媒体类型为5,表示语音,否则执行常规的多媒体逻辑
				   if(mediaType == Constants.VOICE_TYPE){
					   if(index.ctiInit.AudioCallIds){
						   if(index.ctiInit.AudioCallIds.callFeature == ""){
							   	 //存储呼叫类型 start
			                   	index.ctiInit.AudioCallIds.setCallFeature("0");//呼入0
		         				 //存储呼叫类型 end
						   }
					   }
					   //var workNo = index.CallingInfoMap.getWorkNo();
					   var workNo = index.CTIInfo.workNo;
					   var callOutCallId = index.ctiInit.AudioCallIds.getCalloutCallId();
					   var called = json.called;
					   var newCallId = "" + callIdArr.time + callIdArr.dsn + callIdArr.handle + callIdArr.server;
					   //设置状态为通话中
					   index.clientInfo.timerWait.setStatus('通话中');
					   //通话保持后,结束保持的逻辑----start
					   var currentCallId = index.ctiInit.AudioCallIds.getHoldCallId();
					   if(JSON.stringify(callIdArr) == JSON.stringify(currentCallId)){
						   var serialNo = index.CallingInfoMap.getSerialNoByCallId(newCallId);
						   // 设置当前接触会话
						   index.CallingInfoMap.setActiveSerialNo(serialNo);
						   index.CallingInfoMap.setAudioActiveserialNo(serialNo);
						   // 清空值
						   index.ctiInit.AudioCallIds.setHoldCallId("");
						   // 设置按钮为通话保持状态
						   comUI.setAppointedInnerText("callHoldBtn","通话保持");
						   comUI.setAppointedBtnEnabled("callOutBtn",false);//恢复通话后,将外呼按钮置灰
						   var currentTime = index.utilJS.getCurrentTime();
						   //主叫号码和当前坐席相等时 ,或者callId与外呼生成的callId相同时,说明恢复的是之前保持的外呼的语音会话 --by  yuxinyuan
						   if(caller == workNo||JSON.stringify(callIdArr) == JSON.stringify(callOutCallId))
						   {
							   caller = called;
						   }
							   // 调用语音界面，展示语音界面
							   var contactDetail={
										 "contactId":serialNo,
										 "callerNum":caller,
									     "logTime":currentTime,
									     "mediaTypeId":mediaType
					                  };
					            // 调用展示用户消息的接口。
							   index.queue.trigger('itemClick', null, contactDetail,null,{});
							 //通话保持后,结束保持的逻辑----end
						   }else{
							   //如果 存在接触Id,表示已经存在callingInfo对象，则不在创建对象，终止程序向下执行  
							   var hasCallingInfo = index.CallingInfoMap.getSerialNoByCallId(newCallId);
							   if(hasCallingInfo != undefined){
								    // 设置当前接触会话
								   index.CallingInfoMap.setAudioActiveserialNo(index.CallingInfoMap.getSerialNoByCallId(newCallId));
								 //解决受理号码的问题 by yuexuyang  start
    							   if (origCallInfo) {
    								   _callingInfo.setCallerNo(origCallInfo.caller);
    								   _callingInfo.setCalledNo(origCallInfo.called);
    								   var callFeature =origCallInfo.callFeature;
    								   if (callFeature=="0") {//0的话caller是受理号码，7的话called是受理号码
    								   _callingInfo.setSubsNumber(origCallInfo.caller);
    								   index.clientInfo.initCustInfoConference(origCallInfo.caller,true);
    								   }else if (callFeature=="7"){
											_callingInfo.setSubsNumber(origCallInfo.called);
											index.clientInfo.initCustInfoConference(origCallInfo.called,true);
									}
    							   }
    							 //受理请求设置原始客户号码
    							   var subsNumberTemp=_callingInfo.getSubsNumber() ? _callingInfo.getSubsNumber() : "";
    							   _callingInfo.setOrigCustNum(subsNumberTemp);
    							   //解决受理号码的问题 by yuexuyang  end
//									index.CallingInfoMap.setActiveSerialNo(index.CallingInfoMap.getSerialNoByCallId(newCallId));//ZHANGYINGSHENG
									return;
							   }
							   index.ctiInit.AudioCallIds.pushAudioNewCallId(callIdArr);
							   var mediaTypeName = "语音";
							   var channelID = "5";
							   var channelName = "语音";
							   var callSkill = json.callSkill;
							   var serviceType = index.CTIInfo.serviceTypeId;
							   var ctiId = index.CTIInfo.CTIId;
							   var ccId = index.CTIInfo.CCID;
							   var vdnId = index.CTIInfo.VDN_ID;
							   var staffId = index.getUserInfo().staffId;
							   var staffProvinceId = index.getUserInfo().proviceId?index.getUserInfo().proviceId:"";
							   var contactId;
							   var serialNo;// 向后台发送同步请求，生成serialno
							   var skillId="";
							   var tags="";
							   if(caller == workNo||JSON.stringify(callIdArr) == JSON.stringify(callOutCallId))
							   {
								   //caller = called;
								   _callingInfo.setCallType("1");
							   }else{
								   _callingInfo.setCallType("0");
							   }
							   var params ={"skillDesc":callSkill,"ctiId":ctiId,"ccId":ccId,"vdnId":vdnId};
							   Util.ajax.postJson("front/sh/media!execute?uid=randomSerialNo",params, function(json, status) {
									if (status) {
										   serialNo = json.bean.serialNo;
										   skillId = json.bean.skillId;
									}else{
										return;
									}
								},true);
							   var tagsInfo ={"phoneNum":caller,"mediaType":mediaType};
							   Util.ajax.postJson("front/sh/media!execute?uid=audioTags",tagsInfo, function(json, status) {
									if (status) {
										tags = json.bean.tags;
									}
								},true);
							   contactId=serialNo;
							   // 继续构建其它数据,从呼叫信息中获取callingInfo对象对应的属性，将对应的属性植入callingInfo对象
							   var oldCallId = callIdArr;
							   var callidTime = oldCallId.time;
							   var calliddsn = oldCallId.dsn;
							   var callIdHandle = oldCallId.handle;
							   var callIdServer = oldCallId.server;
							   var callId = ""+callidTime+calliddsn+callIdHandle+callIdServer;
							   var audioStartTime = index.utilJS.getCurrentTime();
							   // 设置值得时候会根据callInfo对象定义的方式做相应的调整
							   _callingInfo.setCallId(callId);
							   _callingInfo.setMediaType(mediaType);
							   /* add by wwx160457 for yuyin business at 201608011127 start*/
							   _callingInfo.setMediaTypeName(mediaTypeName);
							   _callingInfo.setChannelID(channelID);
							   _callingInfo.setChannelName(channelName);
							   /* add by wwx160457 for yuyin business at 201608011127 end*/
							   _callingInfo.setCallIdTime(callidTime);
							   _callingInfo.setCallIdDsn(calliddsn);
							   _callingInfo.setCallIdHandle(callIdHandle);
							   _callingInfo.setCallIdServer(callIdServer);
							   _callingInfo.setCallerNo(caller);
							   _callingInfo.setCalledNo(called);
							   if(currentCallFeature != "51"){// && currentCallFeature != "52"
    							   index.ctiInit.orgCallerNo = caller;
    							   index.ctiInit.orgCalledNo = called;
    						   }
							   _callingInfo.setAudioBeginTime(audioStartTime);
							   _callingInfo.setSubsNumber(caller);
							   var callFeatureNew =json.callFeature;
							   if (callFeatureNew=="7") {
								   _callingInfo.setSubsNumber(called);
							   }
							   var callDataJson=json.callData;
							   if (callDataJson) {
								   try {
							            callDataJson=JSON.parse(callDataJson);
							            if (callDataJson.isOutCall) {
							            	_callingInfo.setSubsNumber(called);
							            }
							        } catch(e) {
							            //console.log(e);
							        }
							   }
							   _callingInfo.setSerialNo(serialNo);
							   _callingInfo.setContactId(contactId);
							   _callingInfo.setSkillDesc(callSkill);
							   _callingInfo.setSkillId(skillId);
							   _callingInfo.setCtiId(ctiId);
							   _callingInfo.setCcId(ccId);
							   _callingInfo.setVdnId(vdnId);
							   _callingInfo.setCustTags(tags);
							   _callingInfo.setServiceTypeId(serviceType);
							   _callingInfo.setOrigCallInfo(origCallInfo);
							   _callingInfo.setCallFeature(currentCallFeature);
							   callingInfo = _callingInfo;
							   index.ctiInit.AudioCallIds.setIsConferenceCalledNo(called);//设置三方通话的被叫号码
							   var CTICallId = callidTime+"-"+((callIdServer<<24)+(callIdHandle<<16)+calliddsn);
							   //呼叫类型从callInfo(CTI接口)中获取  start
							    var callTypeFromCTI = _callingInfo.callFeature;
							    var callType="";
							    switch(callTypeFromCTI){
								    case 0:callType="0";break;//呼入
								    case 7:callType="1";break;//外呼
								    case 6:callType="2";break;//内部呼叫
								    case 51:callType="3";break;//内部求助
							    }
							    //呼叫类型从callInfo(CTI接口)中获取  end
							   // 构造接触信息
							   var t_cct_contact = {
										 "serialNo":serialNo,  // 表的字段：呼叫信息对应的值
										 "contactId":contactId,
										 "mediaTypeId":mediaType,
										 "mediaTypeName":mediaTypeName,
										 "channelID":channelID,
										 "channelName":channelName,
										 "ctiId":ctiId,
										 "ccid":ccId,
										 "vdnId":vdnId,
										 "callId":callId,
										 "callIdTime":callidTime,
										 "callIdDsn":calliddsn,
										 "callIdHandle":callIdHandle,
										 "callIdServer":callIdServer,
										 "callSkillId":skillId,
										 "callerNo":caller,
										 "calledNo":called,
    									 //原始主叫
    									 "orgCallerNo" : index.ctiInit.orgCallerNo?index.ctiInit.orgCallerNo:"",
    									 //原始被叫
    									 "orgCalledNo" : index.ctiInit.orgCalledNo?index.ctiInit.orgCalledNo:"",
    									 //呼叫类型
    									 "callType" : callType?callType:index.ctiInit.AudioCallIds.callFeature,
										 "staffId":staffId,
										 "serviceTypeId":serviceType,
										 "staffProvinceId":staffProvinceId,
										 "ctiCallId":CTICallId,
										 "contactStartTime":audioStartTime,
										 //"callType":caller == workNo ||JSON.stringify(callIdArr) == JSON.stringify(callOutCallId)?"1":"0",
										 "srFlag":"0",
										 "dataType":"contact_insert"
								   };
								   // 记录客户接触信息
								   Util.ajax.postJson("front/sh/common!execute?uid=touch001",t_cct_contact,function(json,status){
									   if(status){
									   }else{
									   }
								   });
								   //主叫号码和当前坐席相等时
								   if(caller == workNo ||JSON.stringify(callIdArr) == JSON.stringify(callOutCallId))
								   {
									   //_callingInfo.setCalledNo(caller);
									   caller = called;
									   //_callingInfo.setCallerNo(caller);
									   _callingInfo.setSubsNumber(caller);
								   }else{
									   // 调用展示用户消息的接口。
									   if (origCallInfo) {
	    								   var callFeature =origCallInfo.callFeature;
	    								   if (callFeature=="0") {//0的话caller是受理号码，7的话called是受理号码
	    								   index.clientInfo.initCustInfo(origCallInfo.caller);
	    								   }else if (callFeature=="7"){
	    								   index.clientInfo.initCustInfo(origCallInfo.called);
										}
	    							   }
								   }
								   //解决受理号码的问题 by yuexuyang  start
    							   if (origCallInfo) {
    								   var callFeature =origCallInfo.callFeature;
    								   if (callFeature=="0") {//0的话caller是受理号码，7的话called是受理号码
    								   _callingInfo.setSubsNumber(origCallInfo.caller);
    								   }else if (callFeature=="7"){
										_callingInfo.setSubsNumber(origCallInfo.called);
									}
    							   }
    							 //受理请求设置原始客户号码
    							   var subsNumberTemp=_callingInfo.getSubsNumber() ? _callingInfo.getSubsNumber() : "";
    							   _callingInfo.setOrigCustNum(subsNumberTemp);
    							   //解决受理号码的问题 by yuexuyang  end
								   // 将callingInfo对象存入callingInfoMap中,key的值是contactId
								   index.CallingInfoMap.put(contactId,_callingInfo);
								   var contactDetail={
											 "serialNo":contactId,
											 "callerNum":caller,
											 "logTime":currentTime,
											 "mediaTypeId":mediaType+''
									 };	
								   index.queue.receiveMessage(contactDetail);
								   // 设置当前接触会话
//									index.CallingInfoMap.setActiveSerialNo(serialNo);//ZHANGYINGSHENG
								   //设置语音为激活的callId
								   index.CallingInfoMap.setAudioActiveserialNo(serialNo);
								   // 此处屏蔽该行，改为在点击队列时设置当前接触会话，modified by zwx160456
								    index.CallingInfoMap.getSerialNoByCallId(contactId);
								   // 将当前事件的callId设置到缓存
//								   //index.ctiInit.AudioCallIds.pushAudioNewCallId(callIdArr);//此处提前,太靠后会导致queue.js取不到lastAudioCallId
								 //客户接入并向坐席发送第一条消息时，添加查询客户业务信息的逻辑，add by zwx160456
									 var MSISDN = _callingInfo.getSubsNumber();
									 //调用手机画像接口查询客户业务信息
									//获取调用客户信息url
									 var SourceURL = index.getSourceURL()[0].url;
									// var SourceURL = "ZXYWSL";
									 if(serviceType == "otck"){
										 var mayURL = "front/sh/common!execute?uid=queryUserInfo001";
									 }else{
										 var mayURL = "front/sh/common!execute?uid=queryUserInfo";
									 }
									 var  msisdnData ={
								        		"userMobile":MSISDN,
								        		"serviceCode":SourceURL,
								        		"serviceTypeId":serviceType,
								        		"staffId":staffId
								        };
									 var  isHasCustInfo = index.CallingInfoMap.get("acceptNumber");
									 if(isHasCustInfo&&isHasCustInfo.subsNumber==MSISDN){
   									  _callingInfo.setClientInfoMap(MSISDN,isHasCustInfo);
  										 index.CallingInfoMap.put(serialNo,_callingInfo);
  										$(".callerNo").text(_callingInfo.callerNo);
  										$(".calledNo").text(_callingInfo.calledNo);
   								     }else{
//   									if(RegExp("(^1(3[4-9]|4[7]|5[0-27-9]|7[8]|8[2-478])\\d{8}$)|(^1705\\d{7}$)").test(MSISDN)){
   								    	 if(json.callFeature =='7'){
									     Util.ajax.postJson(mayURL,msisdnData,function(json,status){
										   if(status){
											 var custInfo = json.beans[0];
											 if(custInfo.starLevel && custInfo.starLevel !="" ){
												 if (custInfo.starLevel == "" &&custInfo.telNumStarCode == "" ) {
						                            	custInfo.telNumStarCode = "99";
						                            }
											 }
												 var _custInfo = new CustInfo();
												 $.extend(_custInfo,custInfo);
												 _callingInfo.setClientInfoMap(MSISDN,_custInfo);
												 index.CallingInfoMap.put(serialNo,_callingInfo);
											 }else{
												 var bean={
											   				"phoneNumber":MSISDN,
											   				"provNm":"",
											   				"provCode":"",
							        	    				"cityNm":"",
							        	    				"distrtCode":"",
											    			"userName":"",
											    			"userId":"",
											    			"userIdVal":"",
											    			"userBrand":"",
											    			"userBrandVal":"",
											    			"userLevel":"",
											    			"userLevelVal":"",
											    			"userStatus":"",
											    			"userStatusVal":"",
											    			"userBegin":"",
											    			"realNameInfo":"",
											    			"starLevel":"",
											    			"starScore":"",
											    			"starTime":"",
											    			"email":"",
											    			"zipCode":"",
											    			"userAdd":"",
											    			"userNum":"",
											    			"flag4G":"",
											    			"volteFlag":"",
											    			"accoutDay":"",
											    			"curPlanId":"",
											    			"curPlanName":"",
											    			"startTime":"",
											    			"endTime":"",
											    			"nextPlanId":"",
											    			"nextPlanName":"",
											    			"curFeeTotal":"",
											    			"curFee":"",
											    			"realFee":"",
											    			"oweFee":""
														}
												 var _custInfo = new CustInfo();
												 $.extend(_custInfo,bean);
												 _callingInfo.setClientInfoMap(MSISDN,_custInfo);
												 index.CallingInfoMap.put(serialNo,_callingInfo);
	
										    }
									     },true);
   								    }
//								};  
   								  }
									
								var paramsToProvince = {
					 					"serialNo" : _callingInfo.serialNo,
					 					"workNo" : index.getUserInfo().staffId,
					 					"callerNo" : _callingInfo.callerNo,
					 					"calledNo" : _callingInfo.calledNo,
					 					"subsNumber" : _callingInfo.subsNumber,
					 					"skillQueue" : _callingInfo.skillDesc, // skillDesc 为技能队列描述 skillId 为技能队列id
					 					"reserved1" : "",
					 					"reserved2" : "",
					 					"reserved3" : ""
					 			};
					 			index.postMessage.sendToProvince("callInfo", paramsToProvince);

									 // 获取当前语音会话数组的大小
									 var audioSize = index.ctiInit.AudioCallIds.getAudioCallIdsSize();
									 if(audioSize ==1){
										 // 对按钮的值做处理
										 var arr = ['PasswordValidate','CallHold','CallMute','CallEnd'];
										 // 设置受理请求高亮
//									   //comUI.enableButton(arr);
									 }
									 var currentTime = index.utilJS.getCurrentTime();
									 // 调用语音界面，展示语音界面
//									 var contactDetail={
//											 "serialNo":contactId,
//											 "callerNum":caller,
//											 "logTime":currentTime,
//											 "mediaTypeId":mediaType+''
//									 };
//									 // 调用展示用户消息的接口。
//									 index.queue.receiveMessage(contactDetail);
									 //如果会话是由转接进入就弹窗显示随路信息 start by yuexuyang
									 var callData = json.callData;
									 if (callData) {
										 var callDataArr= callData.split("|");
										 var _userName ="";
										 var _transferMsg ="";
										 var staffFrom ="";
										 if (callDataArr && callDataArr[0]=='005') {
											 var transferMsg= callDataArr[4];
											 var transferMsgArr =transferMsg.split("&");
											 _userName=transferMsgArr[1] ? transferMsgArr[1] : "无";
											 _transferMsg=transferMsgArr[0] ? transferMsgArr[0] : "无";
											 staffFrom = callDataArr[3] ? callDataArr[3] : "无";
										}else{
											   if (callData) {
												   try {
											            callData=JSON.parse(callData);
											            _transferMsg=callData.transferMsg ? callData.transferMsg : "无";
														_userName=callData.userName ? callData.userName : "无";
														staffFrom = callData.staffId ? callData.staffId : "无";
											        } catch(e) {
											            //console.log(e);
											        }
											   }
										}
										 if (_userName!=""&&staffFrom!=""&&_userName!="无"&&staffFrom!="无") {
											 var contentHtml='<ul style="height: 150px;overflow: auto;"><li style="list-style: none;"><span style="display: inline-block;width: 150px;margin-bottom: 10px;text-align: right;">'
													+'客户姓名：</span><span style="display: inline-block;width: 150px;margin-bottom: 10px;">'+
													_userName+'</span></li><li style="list-style: none;"><span style="display: inline-block;width: 150px;margin-bottom: 10px;text-align: right;">'
													+'客服编号：</span><span style="display: inline-block;width: 150px;margin-bottom: 10px;">'+
													staffFrom+'</span></li><li style="list-style: none;position: relative;"><span style="display: inline-block;width: 150px;margin-bottom: 10px;text-align: right;">'
													+'转接(连线)信息：</span><p style="display: inline-block;width: 300px;margin-bottom: 10px;top: 0;position: absolute;">'+
													_transferMsg+'</p></li></ul>';
			        							var config = {
			        									  title: '转接信息',  //对话框标题
			        									  content: contentHtml,  //对话框内容，可以是字符串、html片段、或dom对象
			        									  width:500,  //对话框宽度
			        									  height:150, //对话框高度
			        									  skin:'dialogSkin',  //对话框额外的样式
			        									  padding:'30', //消息内容和消息容器的边距
			        									  fixed:'true', //(默认值: false) 开启固定定位。
			        									  zIndex:5,   //(默认值: 1024) 重置全局zIndex初始值，用来改变对话框叠加高度。
			        									  quickClose: false  //点击空白处快速关闭
			        									}
			        									var d = Util.dialog.openDiv(config);
			        										d.show();   //打开普通对话框
										}
								}
									 //如果会话是由转接进入就弹窗显示随路信息 end by yuexuyang
						   }
//					   //添加日志
//    				   failId = json.result;
//					   if(json.result=="0"){
//							 status_log = "1";
//							 tLogInfo.call(this);
//					   }else{
//		            		 status_log = "0";
//		            		 tLogInfo.call(this);
//					   }
					 }else{
	        		var oldCallId = json.callId;
	        		var callidTime = callIdArr.time;
	        		var calliddsn = callIdArr.dsn;
	        		var callIdHandle = callIdArr.handle;
	        		var callIdServer = callIdArr.server;
	        		//针对转接的业务场景，重新设置_callingInfo的部分属性
			        		var callData = json.callData;
			        		if(callData){
			        			callData = JSON.parse(callData);
			        			if(callData.transflag != undefined && callData.transflag == true){
			        				var staffFrom = callData.staffId ? callData.staffId : "无";
			        				var staffName = callData.staffName;
			        				var  channelId = callData.channelId;
			        				var options= index.serialNumber.getSerialNumber();//获取随机数
			        				// 1、封装多媒体消息
			        				var sendImgMsg={
			        						callId:{
			        							time:callidTime,
			        							dsn:calliddsn,
			        							handle:callIdHandle,
			        							server:callIdServer
			        						},
			        						dataMode:"0",
			        						dataMessage:{
			        							transferFlag:"true",
			        							content:"转自工号："+ staffFrom + "(" + staffName + ")"
			        						},
			        						"opserialNo":options
			        				};
			        				var trsUrl="";
			        		        if(isDefault=="1"){//此种情况走nginx代理
			        		        	trsUrl=Constants.CCACSURL + proxyIP + ":" + proxyPort + "/ccacs/"+CTIID+"/ws/call/sendmessage";
			        		        }else{
			        		        	trsUrl= Constants.CCACSURL+ip+":"+port+"/ccacs/ws/call/sendmessage"; //跨域直连
			        		        }
			        				//封装向cti发送信息的数据结构
	        				$.ajax({
	        					url : trsUrl ,
	        					type : 'post',
	        					data : JSON.stringify(sendImgMsg),
	        					contentType:"application/json; charset=utf-8",
	        					xhrFields: {
								    withCredentials: true
								},
	        					success : function(json) {
	        						if(json.result == "0"){
//	        							index.CallingInfoMap.recordCallCTILog(trsUrl,sendImgMsg,json,"发送转接消息成功");
	        							console.log(trsUrl,sendImgMsg,json,"发送转接消息成功");
	        							index.popAlert("转自工号:"+ staffFrom +"("+staffName + "),转接信息:" + callData.transferMsg,"转接信息");
	        							//如果会话是由转接进入就弹窗显示随路信息 start by yuexuyang
	        							/*var _userName=callData.userName ? callData.userName : "无";
	   								 	var _transferMsg=callData.transferMsg ? callData.transferMsg : "无";
	        							var contentHtml='<ul style="height: 150px;overflow: auto;"><li style="list-style: none;"><span style="display: inline-block;width: 150px;margin-bottom: 10px;text-align: right;">'
											+'客户姓名：</span><span style="display: inline-block;width: 150px;margin-bottom: 10px;">'+
											_userName+'</span></li><li style="list-style: none;"><span style="display: inline-block;width: 150px;margin-bottom: 10px;text-align: right;">'
											+'客服编号：</span><span style="display: inline-block;width: 150px;margin-bottom: 10px;">'+
											staffFrom+'</span></li><li style="list-style: none;position: relative;"><span style="display: inline-block;width: 150px;margin-bottom: 10px;text-align: right;">'
											+'转接(连线)信息：</span><p style="display: inline-block;width: 300px;margin-bottom: 10px;top: 0;position: absolute;">'+
											_transferMsg+'</p></li></ul>';
	        							var config = {
	        									  title: '转接信息',  //对话框标题
	        									  content: contentHtml,  //对话框内容，可以是字符串、html片段、或dom对象
	        									  width:500,  //对话框宽度
	        									  height:150, //对话框高度
	        									  skin:'dialogSkin',  //对话框额外的样式
	        									  padding:'30', //消息内容和消息容器的边距
	        									  fixed:'true', //(默认值: false) 开启固定定位。
	        									  zIndex:5,   //(默认值: 1024) 重置全局zIndex初始值，用来改变对话框叠加高度。
	        									  quickClose: false  //点击空白处快速关闭
	        									}
	        									var d = Util.dialog.openDiv(config);
	        										d.show();   //打开普通对话框
*/	        								//如果会话是由转接进入就弹窗显示随路信息 end by yuexuyang
	        						}else{
//	        							index.CallingInfoMap.recordCallCTILog(trsUrl,sendImgMsg,json,"发送转接消息失败");
	        							console.log(trsUrl,sendImgMsg,json,"发送转接消息失败");
	        						}
	        					},
	        					error : function( XMLHttpRequest, textStatus, errorThrown) {
	        		        		var errorParams = {
	            	            			"XMLHttpRequest":XMLHttpRequest,
	            	            			"textStatus":textStatus,
	            	            			"errorThrown":errorThrown
	            	            	};
//	        		        		index.CallingInfoMap.recordCallCTILog(trsUrl,sendImgMsg,errorParams,"网络异常，发送转接消息失败");
	        		        		console.log(trsUrl,sendImgMsg,errorParams,"网络异常，发送转接消息失败");
	        		        	}
	        				});
	        			}

	        		}
	        	}
				   if(mediaType == Constants.VOICE_TYPE){
					 //添加日志
					   failId = json.result;
					   if(json.result=="0"){
							 status_log = "1";
							 tLogInfo.call(this);
					   }else{
		            		 status_log = "0";
		            		 tLogInfo.call(this);
					   }
				   }
				   
	        	},
	        	error : function( XMLHttpRequest, textStatus, errorThrown) {
	        		var errorParams = {
	            			"XMLHttpRequest":XMLHttpRequest,
	            			"textStatus":textStatus,
	            			"errorThrown":errorThrown
	            	};
//	        		index.CallingInfoMap.recordCallCTILog(url,call_id,errorParams,"网络异常，查询呼叫信息失败");
	        		console.log(url,call_id,errorParams,"网络异常，查询呼叫信息失败");
	        	}
	        });
		}
        
        index.callDataUtil.getDataAndSplitToRoutePackage(startTalkingEvent.callId,true);
        index.CallingInfoMap.setIsFirstAnswerRequest(false);
        index.ctiInit.AudioCallIds.setIsInCallOut(false);
        //添加呼叫日志
    	var  tLogInfo= function(){
    		var serialNo=callingInfo.serialNo;
    		var contactId=callingInfo.contactId;//接触编号
    		var operator=index.getUserInfo()['staffId'];//呼叫操作员工帐号
    		var operBeginTime=index.utilJS.getCurrentTime();//呼叫操作开始时间
    		var serviceTypeId=callingInfo.serviceTypeId;
    		//var operEndTime=index.utilJS.getCurrentTime();//操作结束时间
    		var callerNo=callingInfo.callerNo;//主叫号码
    		var calledNo=callingInfo.calledNo;//接入码
    		var subsNumber=callingInfo.subsNumber;//受理号码

    		var tLog = new TransferOutLog();
            tLog.setIsExt(true);
            tLog.setSerialNo(serialNo);
            tLog.setContactId(contactId);
            tLog.setOperator(operator);
            tLog.setOperBeginTime(operBeginTime);
            tLog.setOperId("026");
            tLog.setServiceTypeId(serviceTypeId);
            //tLog.setOperEndTime(operEndTime);
            tLog.setStatus(status_log);
            tLog.setCallerNo(callerNo);
            tLog.setAccessCode(calledNo);
            tLog.setSubsNumber(subsNumber);
            tLog.setFailId(failId);
            tLog.setFinalStatus(status_log);
            tLog.logSavingForTransfer(tLog);
    	}
	}})
	return startTalking;
});
