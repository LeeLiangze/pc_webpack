/**
 * 451事件
 * 处理多媒体信息数据事件
 */
define(['Util',
        '../../index/constants/mediaConstants',
        './CTIEventsDeal',
        '../callingInfoMap/CustInfo',
        '../callingInfoMap/CallingInfo',
        '../../clientInfo/MultiAccountInfo',
        'jquery.tiny',
       ], function(Util,Constants,CTIEventsDeal,CustInfo,CallingInfoIns,MultiAccountInfo) {
	var index;
	var comUI;
	var CTIID;
	var messageDataEvent = function(indexModule) {
		index = indexModule;
		comUI = index.comMenu;
		CTIID = index.CTIInfo.CTIId;

		window.isFocus = !0;
		window.onfocus = function() {
			window.isFocus = !0;
		};
		window.onblur = function() {
			window.isFocus = !1;
			}
	};
	$.extend(messageDataEvent.prototype,{
		 messageData : function(uselessObj,messageData) {
			 var paramsToProvince = {
						"resultCode" : 0,
						"resultMessage" : "多媒体信息数据",
						"reserved1" : "",
						"reserved2" : "",
						"reserved3" : ""
			 };
			 index.postMessage.sendToProvince("messageData", paramsToProvince);

			//try {
				 var call=messageData.callId;
				 if(typeof(call) == "undefined" || call ==""){
					 return;
				 }
				 var callId=""+call.time+call.dsn+call.handle+call.server;
				 var message=JSON.parse(messageData.message);
				 var hasContactId=index.CallingInfoMap.getSerialNoByCallId(callId);

				 //如果contactID不存在，则为新会话。--由304移到此处 --裴书贤
				 if(typeof(hasContactId)=="undefined"||""==hasContactId){
					 var callingInfoInit = new CallingInfoIns();
					 var options= index.serialNumber.getSerialNumber();//获取随机数
					 var call_id = {
							 "callId":{
								 "time":call.time,
								 "dsn":call.dsn,
								 "handle":call.handle,
								 "server":call.server

							 },
							 "opserialNo":options
					 };

					 var ip=index.CTIInfo.IP;
					 var port=index.CTIInfo.port;
					 var proxyIP=index.CTIInfo.ProxyIP;//代理IP
				     var proxyPort =index.CTIInfo.ProxyPort;//代理端口
				     var isDefault=index.CTIInfo.isDefault;//缺省业务标志值
					 var sign_url="";
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
					         crossDomain: true,
//					          xhrFields: {
//					                withCredentials: true
//					                },
							 async:false,
							 contentType:"application/json; charset=utf-8",
							 success : function(json) {
								 //获取callFeature的值
								 if(json.result=="0"){
//									 index.CallingInfoMap.recordCallCTILog(url,call_id,json,"查询呼叫信息成功");
								 }else{
//									 index.CallingInfoMap.recordCallCTILog(url,call_id,json,"查询呼叫信息失败");
								 }
								 var callSkill = json.callSkill;
								 //var serviceType = index.data.beans[0].serviceTypeId;
								 var serviceType = index.CTIInfo.serviceTypeId;

								 //主叫对应callerNo
								 var caller =  json.caller;
								 var ctiId = index.CTIInfo.CTIId;
								 var ccId = index.CTIInfo.CCID;
								 var vdnId = index.CTIInfo.VDNVDNId;
								 var contactId;
								 var serialNo;//向后台发送同步请求，生成serialno
								 var skillId;
//								 var params ={"skillDesc":callSkill,"ctiId":ctiId,"ccId":ccId,"vdnId":vdnId};
//								 Util.ajax.postJson("front/sh/media!execute?uid=randomSerialNo",params, function(json, status) {
//									 if (status) {
//										 serialNo = json.bean.serialNo;
//										 skillId = json.bean.skillId;
//									 }else{
//										 serialNo = getSerialNo();
//									 }
//								 },true);
								 var serialNo=message.serialNo;
								 var callData = json.callData;
								 if(callData&&""!=callData){
									 callData = JSON.parse(callData);
									 if(callData.transflag&&callData.transflag == true){
										 contactId = callData.contactID;
									 }else{
										 contactId=serialNo;
									 }
								 }else{
									 contactId=serialNo;
								 }

								 //继续构建其它数据,从呼叫信息中获取callingInfo对象对应的属性，将对应的属性植入callingInfo对象
								 var called = json.called;
								 var oldCallId = json.callId;
								 var callidTime = call.time;
								 var calliddsn = call.dsn;
								 var callIdHandle = call.handle;
								 var callIdServer = call.server;
								 var callId = ""+callidTime+calliddsn+callIdHandle+callIdServer;
								 var clientId=message.clientId;
								 //设置值得时候会根据callInfo对象定义的方式做相应的调整
								 callingInfoInit.setClientId(clientId);
								 callingInfoInit.setCallId(callId);
								 callingInfoInit.setCallIdTime(callidTime);
								 callingInfoInit.setCallIdDsn(calliddsn);
								 callingInfoInit.setCallIdHandle(callIdHandle);
								 callingInfoInit.setCallIdServer(callIdServer);
								 callingInfoInit.setCallerNo(caller);
								 callingInfoInit.setCalledNo(called);
								 callingInfoInit.setSubsNumber(caller);
								 callingInfoInit.setSerialNo(serialNo);
								 callingInfoInit.setContactId(contactId);
								 callingInfoInit.setSkillDesc(callSkill);
								 callingInfoInit.setSkillId(skillId);
								 callingInfoInit.setCtiId(ctiId);
								 callingInfoInit.setCcId(ccId);
								 callingInfoInit.setVdnId(vdnId);
								 callingInfoInit.setServiceTypeId(serviceType);
								 callingInfoInit.setIsFirstMessage(true);

								 //将callingInfo对象存入callingInfoMap中,key的值是contactId
								// index.CallingInfoMap.put(contactId,callingInfoInit);
								 index.CallingInfoMap.put(serialNo,callingInfoInit);
							 },
							 error : function( XMLHttpRequest, textStatus, errorThrown) {
								 var errorParams = {
										 "XMLHttpRequest":XMLHttpRequest,
										 "textStatus":textStatus,
										 "errorThrown":errorThrown
								 };
//								 index.CallingInfoMap.recordCallCTILog(url,call_id,errorParams,"网络异常，查询呼叫信息失败");
							 }
						 });
						}else{
							//其他浏览器逻辑
							 $.ajax({
								 url : url ,
								 type : 'post',
								 data :  JSON.stringify(call_id),
						         crossDomain: true,
						          xhrFields: {
						                withCredentials: true
						                },
								 async:false,
								 contentType:"application/json; charset=utf-8",
								 success : function(json) {
									 //获取callFeature的值
									 if(json.result=="0"){
//										 index.CallingInfoMap.recordCallCTILog(url,call_id,json,"查询呼叫信息成功");
									 }else{
//										 index.CallingInfoMap.recordCallCTILog(url,call_id,json,"查询呼叫信息失败");
									 }
									 var callSkill = json.callSkill;
									 //var serviceType = index.data.beans[0].serviceTypeId;
									 var serviceType = index.CTIInfo.serviceTypeId;

									 //主叫对应callerNo
									 var caller =  json.caller;
									 var ctiId = index.CTIInfo.CTIId;
									 var ccId = index.CTIInfo.CCID;
									 var vdnId = index.CTIInfo.VDNVDNId;
									 var contactId;
									 var serialNo;//向后台发送同步请求，生成serialno
									 var skillId;
//									 var params ={"skillDesc":callSkill,"ctiId":ctiId,"ccId":ccId,"vdnId":vdnId};
//									 Util.ajax.postJson("front/sh/media!execute?uid=randomSerialNo",params, function(json, status) {
//										 if (status) {
//											 serialNo = json.bean.serialNo;
//											 skillId = json.bean.skillId;
//										 }else{
//											 serialNo = getSerialNo();
//										 }
//									 },true);
									 var serialNo=message.serialNo;
									 var callData = json.callData;
									 if(callData&&""!=callData){
										 callData = JSON.parse(callData);
										 if(callData.transflag&&callData.transflag == true){
											 contactId = callData.contactID;
										 }else{
											 contactId=serialNo;
										 }
									 }else{
										 contactId=serialNo;
									 }

									 //继续构建其它数据,从呼叫信息中获取callingInfo对象对应的属性，将对应的属性植入callingInfo对象
									 var called = json.called;
									 var oldCallId = json.callId;
									 var callidTime = call.time;
									 var calliddsn = call.dsn;
									 var callIdHandle = call.handle;
									 var callIdServer = call.server;
									 var callId = ""+callidTime+calliddsn+callIdHandle+callIdServer;
									 var clientId=message.clientId;
									 //设置值得时候会根据callInfo对象定义的方式做相应的调整
									 callingInfoInit.setClientId(clientId);
									 callingInfoInit.setCallId(callId);
									 callingInfoInit.setCallIdTime(callidTime);
									 callingInfoInit.setCallIdDsn(calliddsn);
									 callingInfoInit.setCallIdHandle(callIdHandle);
									 callingInfoInit.setCallIdServer(callIdServer);
									 callingInfoInit.setCallerNo(caller);
									 callingInfoInit.setCalledNo(called);
									 callingInfoInit.setSubsNumber(caller);
									 callingInfoInit.setSerialNo(serialNo);
									 callingInfoInit.setContactId(contactId);
									 callingInfoInit.setSkillDesc(callSkill);
									 callingInfoInit.setSkillId(skillId);
									 callingInfoInit.setCtiId(ctiId);
									 callingInfoInit.setCcId(ccId);
									 callingInfoInit.setVdnId(vdnId);
									 callingInfoInit.setServiceTypeId(serviceType);
									 callingInfoInit.setIsFirstMessage(true);

									 //将callingInfo对象存入callingInfoMap中,key的值是contactId
									// index.CallingInfoMap.put(contactId,callingInfoInit);
									 index.CallingInfoMap.put(serialNo,callingInfoInit);
								 },
								 error : function( XMLHttpRequest, textStatus, errorThrown) {
									 var errorParams = {
											 "XMLHttpRequest":XMLHttpRequest,
											 "textStatus":textStatus,
											 "errorThrown":errorThrown
									 };
//									 index.CallingInfoMap.recordCallCTILog(url,call_id,errorParams,"网络异常，查询呼叫信息失败");
								 }
							 });
						}

				 }
				 var serialNo=index.CallingInfoMap.getSerialNoByCallId(callId);
				 var CallingInfo=index.CallingInfoMap.get(serialNo);
				 var isFirstMessage = CallingInfo.getIsFirstMessage();
				 var contactId=CallingInfo.getContactId();

				 var callerNo=CallingInfo.getCallerNo();
				 //多媒体短会话451、301一起polling，取不到callerNo start
				 if(!callerNo){
					 callerNo = message.caller;
				 }
				//多媒体短会话451、301一起polling，取不到callerNo end
				 var staffId = index.getUserInfo().staffId;

				 var currentTime = index.utilJS.getCurrentTime();
				 var originalCreateTime = message.createTime?message.createTime:'';

				 if(isFirstMessage){
					 //设置状态为通话态，由304移到此处，---裴书贤
					 index.clientInfo.timerWait.setStatus('通话中');
					 CallingInfo.setIsFirstMessage(false);
					 var mediaTypeId = message.mediaID;
					 //peishuxian start
					 var mediaTypeName;
					 var channelName;
					 var channelInfo;
					 var channelInfo = index.contentCommon.getChannelInfo(message.channelID);
					 if(channelInfo){
						 channelName = channelInfo.channelName;
					 }
					 var mediaTypeInfo = index.contentCommon.getMediaInfo(mediaTypeId);
					 var mediaTypeInfo;
					 if(mediaTypeInfo){
						 mediaTypeName=mediaTypeInfo.mediaTypeName;
					 }
					 var subsNumber = message.userInfo.tel?message.userInfo.tel:message.phoneNumber;
					 CallingInfo.setMediaTypeName(mediaTypeName);
					 CallingInfo.setChannelName(channelName);
					 CallingInfo.setSubsNumber(subsNumber);
					 var ctiId = CallingInfo.getCtiId();
					 var ccId = CallingInfo.getCcId();
					 var vdnId = CallingInfo.getVdnId();
					 var callId = CallingInfo.getCallId();
					 var callIdTime = CallingInfo.getCallIdTime();
					 var callIdDsn = CallingInfo.getCallIdDsn();
					 var callIdHandle = CallingInfo.getCallIdHandle();
					 var callIdServer = CallingInfo.getCallIdServer();
					 var callSkillId = CallingInfo.getSkillId();
					 var calledNo = CallingInfo.getCalledNo();
					//多媒体短会话451、301一起polling，取不到calledNo start
					 if(!calledNo){
						 calledNo = message.called;
					 }
					//多媒体短会话451、301一起polling，取不到calledNo end
					 var serviceTypeId = index.CTIInfo.serviceTypeId;
					 var staffProvinceId = index.getUserInfo().proviceId?index.getUserInfo().proviceId:"";
					 var contactStartTime = index.utilJS.getCurrentTime();
					 CallingInfo.setContactStartTime(contactStartTime);
					 var CTICallId = callIdTime+"-"+((callIdServer<<24)+(callIdHandle<<16)+callIdDsn);
					 var  bindedPhoneNumber=message.userInfo.tel?message.userInfo.tel:message.phoneNumber;
					 var params={
							 "serialNo":serialNo,
							 "contactId":contactId,
							 "CTIId":ctiId,
							 "ccid":ccId,
							 "VDNId":vdnId,
							 "callId":callId,
							 "callIdTime":callIdTime,
							 "callIdDsn":callIdDsn,
							 "callIdHandle":callIdHandle,
							 "callIdServer":callIdServer,
							 "callSkillId":callSkillId,
							 "callerNo":callerNo,
							 "calledNo":calledNo,
							 "staffId":staffId,
							 "serviceTypeId":serviceTypeId,
							 "staffProvinceId":staffProvinceId,
							 "channelId":message.channelID,
							 "channelName":channelName,
							 "mediaTypeId":message.mediaID,
							 "mediaTypeName":mediaTypeName,
							 "toUserId":message.toUserId,
							 "toUserName":message.toUserName,
							 "fromOrgId":message.fromOrgId,
							 "contactStartTime":contactStartTime,
							 "callType":"0",
							 "playRecordFlag":"0",
							 "QCFlag":"0",
							 "userSatisfy":"0",
							 "hasRecordFile":"0",
							 "srFlag":"0",
							 "bindedPhoneNumber":bindedPhoneNumber,
							 "dataType":"contact_insert",
							 "provinceId" : message.userInfo.provinceCode?message.userInfo.provinceCode:"",//呼叫中心属于省份ID
							 "orgCallerNo" : callerNo?callerNo:"",//多媒体原始主叫为客户号码
							 "orgCalledNo" : "10086",//原始被叫(默认为10086)
							 "remark" : "",//备注信息
							 "qcStaffId" : "",//质检代表帐号
							 "userSatisfy2" : "",//二次满意度结果
							 "userSatisfy3" : "",//互联网二次满意度调查结果
							 "custId" : callingInfo.clientId?callingInfo.clientId:"",//客户id
							 "staffCityId" : message.userInfo.cityCode?message.userInfo.cityCode:"",//员工地市编号
							 "ctiCallId" : CTICallId?CTICallId:"",//CTI已偏移运算后的callid
							 "workNo" : index.CTIInfo.workNo?index.CTIInfo.workNo:""//平台工号
					 }
					 Util.ajax.postJson("front/sh/common!execute?uid=touch001",params,function(json,status){
						 if(status){
							 console.log("接触入库成功！massageData.js")
						 }else{
							 console.log("接触入库失败！massageData.js")
						 }
					 });
					 //peishuxian end
					 if(mediaTypeId==Constants.WEIXIN_TYPE || mediaTypeId==Constants.MICROBLOGGING_TYPE){
						 var phoneNumber = message.userInfo.tel?message.userInfo.tel:message.phoneNumber;
						 if(RegExp("^0?(13|15|17|18|14)[0-9]{9}$").test(phoneNumber)){
							 CallingInfo.setBindedPhoneNumber(phoneNumber);
							 CallingInfo.setSubsNumber(phoneNumber);
							 var result={
									 "phoneNum":phoneNumber,
									 "channelId":message.channelID,
									 "accountId":callerNo,
									 "bindType":"01",
									 "staffId":staffId,
									 "mediaTypeId":message.mediaID
							 };
							 Util.ajax.postJson("front/sh/media!execute?uid=addChanel01", result, function(json, status){
								 if(status){

								 }
							 },false);
						 }
					 }

					 //客户接入并向坐席发送第一条消息时，添加查询客户业务信息的逻辑，add by zwx160456
					 var MSISDN = CallingInfo.getSubsNumber();
					 //调用手机画像接口查询客户业务信息
					 //获取调用客户信息url
					 var SourceURL = index.getSourceURL()[0].url;
					 //var SourceURL = "ZXYWSL";
					 if(serviceTypeId == "otck"){
						 var mayURL = "front/sh/common!execute?uid=queryUserInfo001";
					 }else{
						 var mayURL = "front/sh/common!execute?uid=queryUserInfo";
					 }
					 var  msisdnData ={
				        		"userMobile":MSISDN,
				        		"serviceCode":SourceURL,
				        		"serviceTypeId":serviceTypeId,
				        		"staffId":staffId
				        };
					 if(RegExp("^0?(13|15|17|18|14)[0-9]{9}$").test(MSISDN)){
					  if(RegExp("(^1(3[4-9]|4[7]|5[0-27-9]|7[8]|8[2-478])\\d{8}$)|(^1705\\d{7}$)").test(MSISDN)){
					     Util.ajax.postJson(mayURL,msisdnData,function(json,status){
						   if(status){
							 var custInfo = json.beans[0];
							 if (custInfo.starLevel == "" &&custInfo.telNumStarCode == "" ) {
	                            	custInfo.telNumStarCode = "99";
	                            }
							 // if(custInfo.starLevel && custInfo.starLevel !="" ){
								//  switch (custInfo.starLevel){
        //                              case "一星级":
        //                                  custInfo.starLevel = "1"
        //                                 break;
        //                              case "二星级":
        //                                  custInfo.starLevel = "2"
        //                                 break;
        //                              case "三星级":
        //                                  custInfo.starLevel = "3"
        //                                 break;
        //                              case "四星级":
        //                                  custInfo.starLevel = "4"
        //                                 break;
        //                              case "五星级":
        //                                  custInfo.starLevel = "5"
        //                                 break;
        //                              default :
        //                                     break ;
        //                              }
							 // }
							 var _custInfo = new CustInfo();
							 _custInfo.subsNumber = MSISDN;
                             _custInfo.phoneNumber = MSISDN;
							 $.extend(_custInfo,custInfo);
							 CallingInfo.setClientInfoMap(MSISDN,_custInfo);
							 var serialNo = CallingInfo.getSerialNo();
							 index.CallingInfoMap.put(serialNo,CallingInfo);
					 }else{
							 var bean={
						   				"phoneNumber":MSISDN
//						   				"provNm":"",
//						   				"provCode":"",
//		        	    				"cityNm":"",
//		        	    				"distrtCode":"",
//						    			"userName":"",
//						    			"userId":"",
//						    			"userIdVal":"",
//						    			"userBrand":"",
//						    			"userBrandVal":"",
//						    			"userLevel":"",
//						    			"userLevelVal":"",
//						    			"userStatus":"",
//						    			"userStatusVal":"",
//						    			"userBegin":"",
//						    			"realNameInfo":"",
//						    			"starLevel":"",
//						    			"starScore":"",
//						    			"starTime":"",
//						    			"email":"",
//						    			"zipCode":"",
//						    			"userAdd":"",
//						    			"userNum":"",
//						    			"flag4G":"",
//						    			"volteFlag":"",
//						    			"accoutDay":"",
//						    			"curPlanId":"",
//						    			"curPlanName":"",
//						    			"startTime":"",
//						    			"endTime":"",
//						    			"nextPlanId":"",
//						    			"nextPlanName":"",
//						    			"curFeeTotal":"",
//						    			"curFee":"",
//						    			"realFee":"",
//						    			"oweFee":""
									}
							 var _custInfo = new CustInfo();
							 _custInfo.subsNumber = MSISDN;
							 $.extend(_custInfo,bean);
							 CallingInfo.setClientInfoMap(MSISDN,_custInfo);
							 var serialNo = CallingInfo.getSerialNo();
							 index.CallingInfoMap.put(serialNo,CallingInfo);
						 }
					   },true);
					  }
					 };
					 var mesData={
							 "callerNo":callerNo,
							 "mediaTypeId":message.mediaID,
							 "channelId":message.channelID
					 };
					 //查询多媒体身份信息
					 Util.ajax.postJson("front/sh/media!execute?uid=mes002",mesData,function(json,status){
						 if(status){
							 if(json.bean){
								 var tagName = json.bean.tagName;
								 CallingInfo.setCustTags(tagName);
								 var custInfoCount = json.bean.custInfoCount;
								 if(custInfoCount==0){
									 var accountInfoData={};
									 if(message.mediaID==Constants.MEDIA_ONLINE_SERVICE){
										 accountInfoData={
												 "fromAccountName":message.toUserName,
												 "accountId":callerNo,
												 "channelId":message.channelID,
												 "mediaTypeId":message.mediaID,
												 "fromAccountId":message.toUserId,
												 "createDate":currentTime,
												 "updateDate":currentTime,
												 "createdBy":staffId
										 }
									 }else{
										 accountInfoData={
												 "fromAccountName":message.toUserName,
												 "accountId":callerNo,
												 "channelId":message.channelID,
												 "mediaTypeId":message.mediaID,
												 "screenName":message.userInfo.nickName,
												 "gender":message.userInfo.gender,
												 "socialLevel":message.userInfo.socialLevel,
												 "url":message.userInfo.url,
												 "province":message.userInfo.province,
												 "location":message.userInfo.location,
												 "description":message.userInfo.description,
												 "statusesCount":message.userInfo.statuses,
												 "friendsCount":message.userInfo.friends,
												 "followersCount":message.userInfo.followers,
												 "verified":message.userInfo.verifiend,
												 "tags":message.userInfo.tags,
												 "city":message.userInfo.city,
												 "profileImageUrl":message.userInfo.headImgUrl,
												 "favouritesCount":message.userInfo.favouritesCount,
												 "regDate":message.userInfo.createat,
												 "fromAccountId":message.toUserId,
												 "domainUrl":message.userInfo.domainUrl,
												 "createDate":currentTime,
												 "updateDate":currentTime,
												 "createdBy":staffId
										 }
									 }
									 //新增用户身份信息。
									 Util.ajax.postJson("front/sh/media!execute?uid=mes006",accountInfoData,function(json,status){
										 if(status){

										 }});
								 }else{
									 var accountInfoData={};
									 if(message.mediaID==Constants.MEDIA_ONLINE_SERVICE){
										 accountInfoData={
												 "fromAccountName":message.toUserName,
												 "accountId":callerNo,
												 "channelId":message.channelID,
												 "mediaTypeId":message.mediaID,
												 "fromAccountId":message.toUserId,
												 "updateDate":currentTime,
												 "updatedBy":staffId
										 }
									 }else{
										 accountInfoData={
												 "fromAccountName":message.toUserName,
												 "accountId":callerNo,
												 "channelId":message.channelID,
												 "mediaTypeId":message.mediaID,
												 "screenName":message.userInfo.nickName,
												 "gender":message.userInfo.gender,
												 "socialLevel":message.userInfo.socialLevel,
												 "url":message.userInfo.url,
												 "province":message.userInfo.province,
												 "location":message.userInfo.location,
												 "description":message.userInfo.description,
												 "statusesCount":message.userInfo.statuses,
												 "friendsCount":message.userInfo.friends,
												 "followersCount":message.userInfo.followers,
												 "verified":message.userInfo.verifiend,
												 "tags":message.userInfo.tags,
												 "city":message.userInfo.city,
												 "profileImageUrl":message.userInfo.headImgUrl,
												 "favouritesCount":message.userInfo.favouritesCount,
												 "regDate":message.userInfo.createat,
												 "fromAccountId":message.toUserId,
												 "domainUrl":message.userInfo.domainUrl,
												 "updateDate":currentTime,
												 "updatedBy":staffId
										 }
									 }
									 //修改或新增多媒体身份信息表中的用户身份信息
									 Util.ajax.postJson("front/sh/media!execute?uid=mes006",accountInfoData,function(json,status){
										 if(status){
										 }});
								 }
							 }
							 var flag=false;
							 if(json.beans.length>0){
								 for(var i=0;i<json.beans.length;i++){
									 var multiInfo=json.beans[i];
									 var multiAccountInfo = new MultiAccountInfo();
									 multiAccountInfo.setAccountId(multiInfo.accountId);
									 multiAccountInfo.setChannelId(multiInfo.channelId);
									 multiAccountInfo.setScreenName(multiInfo.screenName);
									 multiAccountInfo.setGender(multiInfo.gender);
									 multiAccountInfo.setLocation(multiInfo.location);
									 multiAccountInfo.setDescription(multiInfo.description);
									 multiAccountInfo.setStatusesCount(multiInfo.statusesCount);
									 multiAccountInfo.setFriendsCount(multiInfo.friendsCount);
									 multiAccountInfo.setFollowersCount(multiInfo.followersCount);
									 multiAccountInfo.setVerified(multiInfo.verified);
									 multiAccountInfo.setProfileImageUrl(multiInfo.profileImageUrl);
									 multiAccountInfo.setRegdate(multiInfo.regDate);
									 multiAccountInfo.setProvince(multiInfo.province);
									 multiAccountInfo.setCity(multiInfo.city);
									 multiAccountInfo.setDomainUrl(multiInfo.domainUrl);
									 multiAccountInfo.setTags(multiInfo.tags);
									 multiAccountInfo.setUrl(multiInfo.url);
									 multiAccountInfo.setSocialLevel(multiInfo.socialLevel);
									 multiAccountInfo.setFavouritesCount(multiInfo.favouritesCount);
									 multiAccountInfo.setMediaTypeId(multiInfo.mediaTypeId);
									 //媒体类型名称改为从前台获取    modified by zwx160456
									 var mediaInfo = index.contentCommon.getMediaInfo(multiInfo.mediaTypeId);
									 if(mediaInfo)
									 {
										 multiAccountInfo.setMediaTypeName(mediaInfo.mediaTypeName);
									 }
									 else
									 {
										 multiAccountInfo.setMediaTypeName("");
									 }
									 CallingInfo.setMultiAccountList(multiAccountInfo);
								 }
								 var list=CallingInfo.getMultiAccountList();
								 //遍历已查询到的用户身份信息，并根据cti传入的最新信息实时更新身份信息中的内容。
								 $.each(list,function(v,value) {
									 if(value.accountId==callerNo){
										 // 微信
										 if(message.mediaTypeId==Constants.WEIXIN_TYPE){
											 value.setAccountId(callerNo),
											 value.setChannelId(message.channelID);
											 value.setMediaTypeId(message.mediaID);
											 value.setScreenName(message.userInfo.nickName);
											 value.setGender(message.userInfo.gender);
											 value.setProvince(message.userInfo.province);
											 value.setTags(message.userInfo.tags);
											 value.setCity(message.userInfo.city);
											 value.setProfileImageUrl(message.userInfo.headImgUrl);
											 value.setRegdate(message.userInfo.subscribeTime);

											 // 微博
										 }else if(message.mediaTypeId==Constants.MICROBLOGGING_TYPE){
											 value.setAccountId(callerNo),
											 value.setChannelId(message.channelID);
											 value.setMediaTypeId(message.mediaID);
											 value.setScreenName(message.userInfo.nickName);
											 value.setGender(message.userInfo.gender);
											 value.setLocation(message.userInfo.location);
											 value.setDescription(message.userInfo.description);
											 value.setStatusesCount(message.userInfo.statuses);
											 value.setFriendsCount(message.userInfo.friends);
											 value.setTags(message.userInfo.tags);
											 value.setFollowersCount(message.userInfo.followers);
											 value.setVerified(message.userInfo.verifiend);
											 value.setProfileImageUrl(message.userInfo.headImgUrl);
											 value.setRegdate(message.userInfo.createat);
											 value.setDomainUrl(message.userInfo.domainUrl)
										 }
										 flag=true;
									 }
								 })
							 }
							 //没有查询到用户的身份信息，将cti中的身份信息内容更行到前台缓存，并插入到用户身份信息表中。
							 if(flag==false){
								 var multiAccountInfo = new MultiAccountInfo();
								 // 微博
								 if(message.mediaID==Constants.WEIXIN_TYPE){
									 multiAccountInfo.setAccountId(callerNo);
									 multiAccountInfo.setChannelId(message.channelID);
									 multiAccountInfo.setMediaTypeId(message.mediaID);
									 multiAccountInfo.setScreenName(message.userInfo.nickName);
									 multiAccountInfo.setGender(message.userInfo.gender);
									 multiAccountInfo.setProvince(message.userInfo.province);
									 multiAccountInfo.setCity(message.userInfo.city);
									 multiAccountInfo.setProfileImageUrl(message.userInfo.headImgUrl);
									 multiAccountInfo.setRegdate(message.userInfo.subscribeTime);
									 // 微信
								 }else if(message.mediaID==Constants.MICROBLOGGING_TYPE){
									 multiAccountInfo.setAccountId(callerNo);
									 multiAccountInfo.setChannelId(message.channelID);
									 multiAccountInfo.setMediaTypeId(message.mediaID);
									 multiAccountInfo.setScreenName(message.userInfo.nickName);
									 multiAccountInfo.setGender(message.userInfo.gender);
									 multiAccountInfo.setLocation(message.userInfo.location);
									 multiAccountInfo.setDescription(message.userInfo.description);
									 multiAccountInfo.setStatusesCount(message.userInfo.statuses);
									 multiAccountInfo.setFriendsCount(message.userInfo.friends);
									 multiAccountInfo.setFollowersCount(message.userInfo.followers);
									 multiAccountInfo.setVerified(message.userInfo.verifiend);
									 multiAccountInfo.setProfileImageUrl(message.userInfo.headImgUrl);
									 multiAccountInfo.setRegdate(message.userInfo.createat);
									 multiAccountInfo.setDomainUrl(message.userInfo.domainUrl);
									 //webChat
								 }else{
									 multiAccountInfo.setAccountId(callerNo);
									 multiAccountInfo.setChannelId(message.channelID);
									 multiAccountInfo.setMediaTypeId(message.mediaID);
									 multiAccountInfo.setMediaTypeName(CallingInfo.getMediaTypeName());
								 }
								 CallingInfo.setMultiAccountList(multiAccountInfo);
							 }
						 }
						 //同步：异步导致用户标签有时加载不出来
					 },true);

					 CallingInfo.setToUserId(message.toUserId);
					 CallingInfo.setToUserName(message.toUserName);
					 CallingInfo.setFromOrgId(message.fromOrgId);
					 CallingInfo.setMediaType(message.mediaID);
					 CallingInfo.setChannelID(message.channelID);
					 //招标网 客户身份显示，20161204 lijianjun start
					 var customerStatus = message.userInfo.customerStatus;
					 if(customerStatus && customerStatus != ""){
						 CallingInfo.setCustomerStatus(message.userInfo.customerStatus);
					 }
					 //招标网 客户身份显示，20161204 lijianjun end
					 index.CallingInfoMap.put(serialNo,CallingInfo);
					 var robotTalk = message.robotTalk;
					 var initMsgType = message.msgType;
					 if(robotTalk && robotTalk.length>0){
						 var senderFlag = "";
						 var nowTime = "";
						 var content = "";
						 $.each(robotTalk,function(n,v) {
							 senderFlag = v.isIn ? Constants.SENDER_FLAG_CUST:Constants.SENDER_FLAG_ROBOT;
							 //机器人携带消息全是文本格式
							 message.msgType ='001';
							 nowTime = v.createTime;
							 content = v.content;
							 addContactDetail(message,content,contactId,callerNo,nowTime,senderFlag,nowTime);
						 });
						 //接入侧把转人工时前一条消息从robotTalk中拿出来放在了外面，走下面代码
						 message.msgType = initMsgType;
						 addContactDetail(message,message.content,serialNo,callerNo,currentTime,Constants.SENDER_FLAG_CUST,originalCreateTime);
					 }else{
						 addContactDetail(message,message.content,serialNo,callerNo,currentTime,Constants.SENDER_FLAG_CUST,originalCreateTime);
					 }
				 }else{
					 addContactDetail(message,message.content,serialNo,callerNo,currentTime,Constants.SENDER_FLAG_CUST,originalCreateTime);
				 }
//				 var _end451 = new Date();
//				 var kkk = _end451.getTime()-_start451.getTime();
			// /**消息弹框start  */
			// 	var lastWords;
			// 	switch(message.msgType){
			// 	case Constants.MSGTYPE_TEXT:lastWords = index.contentCommon.parseKeyToFace({content:message.content.replace(/\[enter\]/g, ''), mediaTypeId:message.mediaTypeId, parseMode: "desc"});//要经过处理的，表情
			// 		break;
			// 	case Constants.MSGTYPE_IMG:lastWords='[图片]';
			// 		break;
			// 	case Constants.MSGTYPE_AUDIO:lastWords='[音频]';
			// 		break;
			// 	case Constants.MSGTYPE_VIDEO:lastWords='[视频]';
			// 		break;
			// 	case Constants.MSGTYPE_SMALL_VIDEO:lastWords='[小视频]';
			// 		break;
			// 	case Constants.MSGTYPE_URL:lastWords=message.url;//要经过处理的，表情，链接
			// 		break;
			// 	case Constants.MSGTYPE_GEOGRAPHIC_LOCATION:'[位置]';
			// 		break;
			// 	case Constants.MSGTYPE_OTHER_FILE:lastWords='[文件]';
			// 		break;
			// 	default:
			// 		lastWords='您有未读消息，请查看';

			// 	}
			// 	var title;
			// 	if(message.mediaID==Constants.WEIXIN_TYPE||message.mediaID==Constants.MICROBLOGGING_TYPE){//微信,微博
			// 		title=message.userInfo.nickName?message.userInfo.nickName:"消息提示";
			// 	}else{
			// 		title=callerNo?callerNo:"消息提示";
			// 	}
		 //        if (window.Notification) {
		 //        	var visibilityState=document.visibilityState;
		 //            var popNotice = function() {

			//                 if (Notification.permission == "granted") {
			//                     var notification = new Notification(title, {
			//                     	body: lastWords,//设置提示语
			//                     	silent:true,//设置是否有声音
			//                         icon: 'src/assets/img/appNew/ic-service-32x32.png'//设置左侧图标位置

			//                     });
			//                     notification.onclick = function() {


			//                     	window.focus();
			//                     	//调用切换视图方式
			// 	                   	index.nav.changeSelectOut(2);

			// 	 					index.layoutChange('internet-hor');

			//                         notification.close();
			//                     };
			//                     //5秒关闭弹框
			//                     setTimeout(function(){
			//                     	notification.close();
			//  					},5000);
			//                 }
		 //            }

		 //    		window.isFocus || (Notification.permission === "default" ? Notification.requestPermission(function (permission) {
	  //                     popNotice();
   //                  }) : popNotice())

		 //        }
			/**消息弹框end   */
	/*		} catch (e) {
				var data = {
						staffId : index.getUserInfo().staffId,//调用方callparty
						event : '451messageData',//程序入口callerEntrance
						apiUrl : 'addJSErrorLog',
						inParams : messageData.callId,//入参inputParams
						eStack : e.stack.substring(0,1023)//异常信息resultMsg
				}
				Util.ajax.postJson('front/sh/media!execute?uid=addJSErrorLog',data,function(json,status){});
			}*/

		 }
	});
	//前台生产流水号
	function getSerialNo() {
		var date = new Date();
		var month = date.getMonth() + 1;
		var strDate = date.getDate();
		var hour = date.getHours();
		var min = date.getMinutes();
		var second = date.getSeconds();
		var millisecond = date.getMilliseconds();
		var timeSeconds = date.getTime();
		if (month >= 1 && month <= 9) {
			month = "0" + month;
		}
		if (strDate >= 0 && strDate <= 9) {
			strDate = "0" + strDate;
		}
		if (hour >= 0 && hour <= 9) {
			hour = "0" + hour;
		}
		if (min >= 0 && min <= 9) {
			 min = "0" + min;
		}
		if (second >= 0 && second <= 9) {
			second = "0" + second;
		}
		if(millisecond >= 0 && millisecond <= 9){
			millisecond="00"+millisecond;
		}
		if(millisecond >=10 && millisecond <= 99){
			millisecond="0"+millisecond;
		}
		var timeStr = date.getFullYear() + month + strDate + hour + min + second + millisecond;
		var staffId = index.getUserInfo().staffId;
		var temp = staffId+timeStr;
		var num = 30-temp.length;
		var subStr = (timeSeconds+"").substr(-num);
		var serialNo = temp + subStr;
		return serialNo;
	};
	function addContactDetail(message,content,serialNo,callerNo,currentTime,senderFlag,originalCreateTime){
		var nickName = ((message.mediaID == Constants.MEDIA_ONLINE_SERVICE) ?callerNo:(message.userInfo.nickName));
		var callingInfo = index.CallingInfoMap.get(serialNo);
		var mseriano = callingInfo.getSerialNo();
		var phoneNum = message.userInfo.tel?message.userInfo.tel:message.phoneNumber;
		//获取绑定手机号
		 var contactDetail={
				             "content":content,
							 "msgType":message.msgType,
						     "messageId":message.msgId,
							 "senderFlag":senderFlag,
						     "url":message.url,
							 "serialNo":serialNo,
						     "logTime":currentTime,
						     "mediaTypeId":message.mediaID,
						     "nickName":nickName,
						     "channelID":message.channelID,
						     "originalCreateTime":originalCreateTime,
						     "mSeriaNo":mseriano,
						     "duration":message.duration?Math.round(message.duration):'',
						     "phoneNum":phoneNum
		 }
		//调用展示用户消息的接口。
		 index.queue.receiveMessage(contactDetail);
		 content = index.contentCommon.parseContentForHref(content);
		 contactDetail.content = content;
		//记录接触明细。
//		 Util.ajax.postJson("front/sh/common!execute?uid=touch001",contactDetail,function(json,status){
//				if(status){
//						  }
//					  });
	};
	return messageDataEvent;
});
