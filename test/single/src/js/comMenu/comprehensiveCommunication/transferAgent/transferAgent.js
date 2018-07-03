/**
 * 
 * 前台转接专席
 */
define(['Util',
		'../../../index/constants/mediaConstants',
		'../../../log/transferOutLog',
		'../../../../tpl/comMenu/comprehensiveCommunication/transferAgent/transferAgent.tpl',
		'../../../../assets/css/comMenu/comprehensiveCommunication/transferAgent/transferAgent.css'],
		function(Util,Constants,Log,tpl) {

			// 系统变量-定义该模块的根节点
			var _index=null,$el=null,_option=null,transferTypeData=null,transferDetailData=null,transferTemplData=null,$transferType=null,
			$transferDetail=null,$transferTempl=null,ip=null,port=null,ccId=null,vdnId=null,ctiId=null,isDefault=null,
			setcalldatas=null,_custInfo=null,callingInfo=null;
	  	  	var log = new Log();
			var initialize = function(indexModule, options) {
				$el=$(tpl);
				_index=indexModule;
				_option=options;
				ip = _index.CTIInfo.IP;
				port = _index.CTIInfo.port;
				ccId = _index.CTIInfo.CCID;
				vdnId = _index.CTIInfo.VDN_ID;
				ctiId = _index.CTIInfo.CTIId;
		  	    isDefault=_index.CTIInfo.isDefault;
		  	    
				transferTypeInit();
				eventInit();
				setTimeout(function () {
					showInfoInit()
				},200);
				this.content = $el;
			};
		var eventInit=function(){
			$el.on("click",".t-tabs-items li",tabClick);
			$el.on("click",".jj-left-transferAgent_top .transferTypeData img",transferTypeClick);
			$el.on("click",".left-transferAgent_down .transferDetailData img",transferDetailClick);
			$el.on("click",".t-tabs-wrap li label input",transferTemplClick);
			$el.on("click",".btnTransfer",btnTransferClick);
		}
		var showInfoInit=function(){
			 //var callingInfo = _index.CallingInfoMap.get(_option.serialNo);
	         //var clientInfo = callingInfo.clientInfoMap[callingInfo.callerNo];
			var activeSerialNo =  _index.CallingInfoMap.getAudioActiveserialNo();
			if (activeSerialNo == undefined) {
				return;
			}
        	if(activeSerialNo && activeSerialNo !="" ){
        		callingInfo = _index.CallingInfoMap.get(activeSerialNo);
        		var subsNumber =  callingInfo.getSubsNumber();
        		_custInfo = callingInfo.getClientInfoMap(subsNumber);
        		var userName = _custInfo ? _custInfo.userName : "";
        		//客户信息
        		$(".transferAgent-custName").html("");
        		$(".transferAgent-custNumber").html("");
        		$(".transferAgent-custName").html(userName);
        		$(".transferAgent-custNumber").html(subsNumber);
        	}
		}
		var transferTypeInit=function(){
			Util.ajax.postJson("front/sh/transfer!execute?uid=transfer001",{},function(data,state){
	    		if (state) {
	    			transferTypeData=data.beans;
					for (var int in transferTypeData) {
						var result=transferTypeData[int];
						if (result.showFlag) {
							$(".jj-left-transferAgent_top").append("<div class='transferTypeData'>"+
								"<img src='"+result.picUrl+
								"' transferTypeId="+result.transferTypeId+
								" serviceTypeId="+result.serviceTypeId+
								" transferTypeName="+result.transferTypeName+
								" transferTypeDesc="+result.transferTypeDesc+
								" transferTypeCode="+result.transferTypeCode+
								" picUrl="+result.picUrl+
								" showFlag="+result.showFlag+
								" argeSeqno="+result.argeSeqno+
								" firstCharAttrVal="+result.firstCharAttrVal+
								" secondCharAttrVal="+result.secondCharAttrVal+
								" thridCharAttrVal="+result.thridCharAttrVal+
								" fourthCharAttrVal="+result.fourthCharAttrVal+
								" />"+
								"<span class='transferTypeName'><a style='text-decoration:none' title="+result.transferTypeDesc+">"+result.transferTypeName+"</a></span></div>");
						}
					}
					setTimeout(function () {
						//初始化第二行img
						var transferTypeId = $(".jj-left-transferAgent_top .transferTypeData img").eq(0).attr("transferTypeId");
						transferAllDataInit(transferTypeId);
						//默认选中第一个img
						$(".jj-left-transferAgent_top .transferTypeData img").eq(0).css("border","1px solid #0085D0");
						//默认初始化技能队列信息
						$transferDetail=null;
						showSkillQueueInfo();
					},200);
					
				}else{
					return;
				}    		
	    	 });
		}
		//初始化第二行以及tab页
		var transferAllDataInit=function(dat){
			var params={
					"transferTypeId":dat,
					"ctiId":ctiId,
					"vdnId":vdnId
			}
			//初始化转接明细
			Util.ajax.postJson("front/sh/transfer!execute?uid=transfer002",params,function(data,state){
	    		if (state) {
	    			transferDetailData=data.beans;
					for (var int in transferDetailData) {
						var result=transferDetailData[int];
						if (result.showFlag) {
							$(".left-transferAgent_down").append("<div class='transferDetailData'>"+
								"<img src='"+result.picUrl+
								"' transferDetailId="+result.transferDetailId+
								" transferTypeId="+result.transferTypeId+
								" transferIvrMode="+result.transferIvrMode+
								" transferDestEqupId="+result.transferDestEqupId+
								" transferDestEqupName="+result.transferDestEqupName+
								" ctiId="+result.ctiId+
								" vdnNo="+result.vdnNo+
								" serviceTypeId="+result.serviceTypeId+
								" picUrl="+result.picUrl+
								" showFlag="+result.showFlag+
								" argeSeqno="+result.argeSeqno+
								" transferDataFlag="+result.transferDataFlag+
								" specialId="+result.specialId+
								" ivrPrskeyCodeValue="+result.ivrPrskeyCodeValue+
								" firstCharAttrVal="+result.firstCharAttrVal+
								" secondCharAttrVal="+result.secondCharAttrVal+
								" thridCharAttrVal="+result.thridCharAttrVal+
								" fourthCharAttrVal="+result.fourthCharAttrVal+
								" areaFlag="+result.areaFlag+
								" successTransFlag="+result.successTransFlag+
								" />"+
								"<span class='transferDestEqupName'><a style='text-decoration:none' title="+result.thridCharAttrVal+">"+result.transferDestEqupName+"</a></span></div>");
						}
					}
					//默认选中第一个
					$(".left-transferAgent_down .transferDetailData img").eq(0).css("border","1px solid #0085D0");
					//初始化转出模式
					$(".down-succTransferMode").html("");
					$(".down-releaseTransferMode").html("");
//					$(".down-transferAgent-down label").eq(0).show();
					$(".down-releaseTransferMode").append('<input type="radio" class="radio" name="UI_TYPE_CD_transfer" value="0" checked="true" nameValue="释放转" />释放转');
					var callType=callingInfo.getCallType();
					if ($(".left-transferAgent_down .transferDetailData img").eq(0).attr("successTransFlag")=="1") {
						if (callType=="1" && $(".left-transferAgent_down .transferDetailData img").eq(0).attr("transferTypeId").indexOf("outBound")>=0) {
							//$(".down-transferAgent-down label").eq(0).hide();
							$(".down-releaseTransferMode").html("");
							$(".down-succTransferMode").append('<input type="radio" class="radio" name="UI_TYPE_CD_transfer" value="2" checked="true" nameValue="成功转" />成功转');
						}else{
							$(".down-succTransferMode").append('<input type="radio" class="radio" name="UI_TYPE_CD_transfer" value="2" nameValue="成功转" />成功转');
						}
					}
				}else{
					return;
				}  
	    	 },true);
			//初始化tab页
			Util.ajax.postJson("front/sh/transfer!execute?uid=transfer003",{"transferTypeId":dat},function(data,state){
				if(state){
					transferTemplData=data.bean.transferTempl;
					if (transferTemplData.length==0) {
						//$(".down-transferAgent-middle").html("");
						$("#down-transferAgent").css("height","120px");
						$("#down-transferAgent .tabContainer").hide();
						//$("#down-transferAgent .tabContainer").html("");
						//$("#down-transferAgent .down-transferAgent-middle").hide();
						$(".down-transferAgent-middle-text").val("");
						return;
					}
					for(var i = 0; i < transferTemplData.length; i++){
						$("#down-transferAgent").css("height","270px");
						$("#down-transferAgent .tabContainer").show();
						//$("#down-transferAgent .down-transferAgent-middle").show();
						var templHtml="";
						if(i==0){
							//给第一个tab标签加上active 和selected
							$(".t-tabs-items").append("<li class='active'><a href='#'>"+transferTemplData[i][0].templContent+"</a></li>");
							for (var j = 1; j < transferTemplData[i].length; j++) {//从1开始
								templHtml += "<label><input type='radio' firstCharAttrVal="+transferTemplData[i][j].firstCharAttrVal+" secondCharAttrVal="+transferTemplData[i][j].secondCharAttrVal+" class='radio' name='UI_TYPE_CD"+i+"' value="+transferTemplData[i][j].transferTemplId+" templContent="+transferTemplData[i][j].templContent+" /><a title="+transferTemplData[i][j].templContent+">"+transferTemplData[i][j].templContent+"</a></label>";
							}
							$(".t-tabs-wrap").append("<li class='selected'>"+templHtml+"</li>");
						}else{
							$(".t-tabs-items").append("<li><a href='#'>"+transferTemplData[i][0].templContent+"</a></li>");
							for (var j = 1; j < transferTemplData[i].length; j++) {//从1开始
								templHtml += "<label><input type='radio'  firstCharAttrVal="+transferTemplData[i][j].firstCharAttrVal+" secondCharAttrVal="+transferTemplData[i][j].secondCharAttrVal+" class='radio' name='UI_TYPE_CD"+i+"' value="+transferTemplData[i][j].transferTemplId+" templContent="+transferTemplData[i][j].templContent+" /><a title="+transferTemplData[i][j].templContent+">"+transferTemplData[i][j].templContent+"</a></label>";
							}
							$(".t-tabs-wrap").append("<li>"+templHtml+"</li>");
						}
					}
					//默认选中第一个单选框，并填值
					$(".t-tabs-wrap li label input").eq(0).attr("checked","true");
					var templContent=$(".t-tabs-wrap li label input").eq(0).attr("templContent");
					//动态添加转接信息
					$(".down-transferAgent-middle-text").val("");
					/*$(".down-transferAgent-middle").append(
							'<span class="down-transferAgent-middle-title">转接信息</span><textarea class="down-transferAgent-middle-text"></textarea>'
							);*/
					$(".down-transferAgent-middle-text").val(templContent);
				}else{
					return;
				}  
			});
		}
		var transferTypeClick=function(){
			$(".left-transferAgent_down").empty();
			$(".t-tabs-items").empty();
			$(".t-tabs-wrap").empty();
			$transferType=$(this);
			//
			$(".transferTypeData img").removeAttr('style');
			$transferType.css("border","1px solid #0085D0");
			
			var transferTypeId=$transferType.attr("transferTypeId");
			transferAllDataInit(transferTypeId);
			//默认初始化技能队列信息
			$transferDetail=null;
			showSkillQueueInfo();
		}
		
		var transferDetailClick=function(){
			$transferDetail=$(this);
			$(".transferDetailData img").removeAttr('style');
			$transferDetail.css("border","1px solid #0085D0");
			//点击初始化技能
			showSkillQueueInfo();
		}
		//显示技能队列信息
		var showSkillQueueInfo=function(){
			//当1中的转接类型为技能队列时，当客服代表选中2中的某一个具体技能队列时，显示技能队列信息
			$transferType=$transferType ? $transferType : $(".jj-left-transferAgent_top .transferTypeData img").eq(0);
			if (!$transferDetail || $transferDetail.length==0) {
				$transferDetail=$(".left-transferAgent_down .transferDetailData img").eq(0);
			}
			//$transferDetail=$transferDetail ? $transferDetail : $(".left-transferAgent_down .transferDetailData img").eq(0);
			var transferTypeCode=$transferType.attr("transferTypeCode");
			//清空技能队列信息
			$(".transferAgent-setbusy").html("--");
			$(".transferAgent-rest").html("--");
			$(".transferAgent-logined").html("--");
			$(".transferAgent-talking").html("--");
			$(".transferAgent-idle").html("--");
			$(".transferAgent-queueSize").html("--");
			if (transferTypeCode==Constants.TRANSFERDEVICETYPE_SKILL_QUEUE) {
				
				//查询多个技能下座席状态的实时监控信息
				//入参数据的封装
				var skillIds=new Array();
				var skillArr=[];
				var skillArr= {
						"ccId":ccId,
						"vdnId":vdnId,
						"skillId":$transferDetail.attr("transferDestEqupId")
					}
				skillIds.push(skillArr);
				var skillJson=JSON.stringify(skillIds);
				var oneData={
						"ip":ip,
						"port":port,
						"ctiId":ctiId,
						"skillIds":skillJson,
						"isSkillAllMatch":"false",
						"isDefault":isDefault
				};
			  Util.ajax.postJson("front/sh/transfer!execute?uid=transfer004",oneData,function(resultData,state){
				   if(state){
					   var result =resultData.bean;
					   $(".transferAgent-setbusy").html(result.setbusy);
					   $(".transferAgent-rest").html(result.rest);
					   $(".transferAgent-logined").html(result.logined);
					   $(".transferAgent-talking").html(result.talking);
					   $(".transferAgent-idle").html(result.idle);
				   }else{
						return;
					}  
			   });
				//查询技能队列的实时监控信息
				//入参数据的封装
				var towData={
						"ip":ip,
						"port":port,
						"ctiId":ctiId,
						"skillIds":skillJson,
						"isDefault":isDefault
				};
				Util.ajax.postJson("front/sh/transfer!execute?uid=transfer005",towData,function(resultData,state){
					   if(state){
						   var rst =resultData.beans;
						   $(".transferAgent-queueSize").html(rst[0].queueSize);
					   }else{
							return;
						}  
				  });
			}
		}
		
		//切换模板
		var transferTemplClick=function(){
			$transferTempl=$(this);
			$(".down-transferAgent-middle-text").text("");
			var templContent=$transferTempl.attr("templContent");
			$(".down-transferAgent-middle-text").val(templContent);
		}
		//切换tab页
		var tabClick=function(){
			//显示tab下的内容
	        var $t = $(this).index();
	        $(this).addClass('active').siblings().removeClass('active');
	        $('.t-tabs-wrap li').eq($t).addClass('selected').siblings().removeClass('selected');
	        //默认选中第一个模板
	        $('.t-tabs-wrap li').eq($t).find("label").eq(0).find("input").attr("checked","true");
	        var templContent=$('.t-tabs-wrap li').eq($t).find("input:checked").attr("templContent");
	        $(".down-transferAgent-middle-text").val(templContent);
		}
		//转接按钮
		var btnTransferClick = function(event) {
			$transferType=$transferType ? $transferType : $(".jj-left-transferAgent_top .transferTypeData img").eq(0);
			$transferDetail=$transferDetail ? $transferDetail : $(".left-transferAgent_down .transferDetailData img").eq(0);
			if ($(".t-tabs-wrap li label input").eq(0).length) {
				$transferTempl= $(".t-tabs-wrap li label input").eq(0);
			}else{
				$transferTempl=null;
			}
			//从页面获取数据
			var transferTypeCode=$transferType.attr("transferTypeCode");
			var transferTypeId=$transferType.attr("transferTypeId");
			var transferDetailId=$transferDetail.attr("transferDetailId");
			var transferDestEqupId=$transferDetail.attr("transferDestEqupId");
			var transferTypeName=$transferDetail.attr("transferTypeName");
			var serviceTypeId=$transferDetail.attr("serviceTypeId");
			var firstCharAttrValD=$transferDetail.attr("firstCharAttrVal");
			var ivrPrskeyCodeValue=$transferDetail.attr("ivrPrskeyCodeValue")=="undefined" | !$transferDetail.attr("ivrPrskeyCodeValue") ? "" : $transferDetail.attr("ivrPrskeyCodeValue");
			var areaFlag=$transferDetail.attr("areaFlag");
			var specialId=$transferDetail.attr("specialId");
			var thridCharAttrValD=$transferDetail.attr("thridCharAttrVal");
			var fourthCharAttrValD=$transferDetail.attr("fourthCharAttrVal");
			var transferIvrModeD=$transferDetail.attr("transferIvrMode");
			var firstCharAttrValT=$transferTempl ? $transferTempl.attr("firstCharAttrVal") : "";
			var secondCharAttrValT=$transferTempl ? $transferTempl.attr("secondCharAttrVal") : "";
			var templContent=$(".down-transferAgent-middle-text") ? $(".down-transferAgent-middle-text").val() : "";
			if ($.trim(templContent).length>30) {
				alert("转接信息不能超过30个字符！");
				return;
			}
			var transferMode=$("input[name='UI_TYPE_CD_transfer']:checked").val();
			if (!transferMode) {
				alert("请选择转出模式！");
				return;
			}
			var nameValue=$("input[name='UI_TYPE_CD_transfer']:checked").attr("nameValue");
			//当转出的设备类型为外呼号码transferTypeCode=5时，转出模式要相应的改变,即转出时的模式 1：释放转、2：成功转；
			//当转出的设备类型为技能transferTypeCode=1，2，3，4，转出时的模式 0：释放转、2：成功转；
			if (transferTypeCode==Constants.TRANSFERDEVICETYPE_OUTBOUND ) {
				 //var callingInfo = _index.CallingInfoMap.get(_index.CallingInfoMap.getActiveSerialNo());
		         var clientInfo = callingInfo.clientInfoMap[callingInfo.subsNumber];
		         var numAssignmentCode=clientInfo ? clientInfo.numAssignmentCode : "";
				if (transferDestEqupId=="10086") {
					if (areaFlag=="1") {//如果转接外部号码归属地标识==1,增加客户归属地编码
						transferDestEqupId=firstCharAttrValD+""+numAssignmentCode+transferDestEqupId;
					}else{//如果转接外部号码归属地标识==0,不增加客户归属地编码
						transferDestEqupId=firstCharAttrValD+""+transferDestEqupId;
					}
				}
				
				if (transferMode==0) {
					transferMode=1;
				}
				
			}
			//当转归属地外呼时转接的目的设备id处理
			 //log日志参数的准备
	  	    log.setIsExt(true);
	  	    log.setSerialNo(_index.CallingInfoMap.getAudioActiveserialNo());
	  	    log.setContactId(_index.CallingInfoMap.getAudioActiveserialNo());
	  	    log.setOperator(_index.getUserInfo().staffId);
	  	    log.setOperBeginTime(_index.utilJS.getCurrentTime());
	  	    log.setOperEndTime(_index.utilJS.getCurrentTime());
	  	    //log.setOperId(new Date());
	  	    log.setServiceTypeId(serviceTypeId);
	  	    //如果是转技能，接入码就是被叫号码
	  	    log.setAccessCode(callingInfo.calledNo);
	  	    log.setCallerNo(callingInfo.callerNo);
	  	    log.setSubsNumber(callingInfo.getSubsNumber());
	  	    log.setOriginalCallerNo(callingInfo.callerNo);
			log.setTransferMode(transferMode=="0" ? "1" : transferMode);//日志
			log.setTransferCode(transferDestEqupId);
			log.setSourceDesc(templContent);
			//封装数据
			var params={
					"transferTypeCode":transferTypeCode,
					"transferDestEqupId":transferDestEqupId,
					"areaFlag":areaFlag,
					"templContent":templContent,
					"transferMode":transferMode
			}
			// 设置转接日志数据
			var currentTime = _index.utilJS.getCurrentTime();
			var staffID = _index.getUserInfo()['staffId'];
			var msg = templContent;
			var inner = transferDestEqupId;
			// 将转接数据放入callInfo
			var activeSerialNo = _index.CallingInfoMap.getAudioActiveserialNo();
			if (activeSerialNo == undefined) {
				return;
			}
			var _callingInfo = _index.CallingInfoMap.get(activeSerialNo);
			if (_callingInfo != null) {
				_callingInfo.setTransferTime(currentTime);
				_callingInfo.setTransferType(transferTypeCode);
				_callingInfo.setTransferInner(inner);
				_callingInfo.setTransferMode(transferMode);
				_callingInfo.setTransferOuter(staffID);
				_callingInfo.setTransferMsg(msg);
				_index.CallingInfoMap.put(activeSerialNo, _callingInfo);
			}
			//如果是转技能
			var transferParam;
			var accessCode = transferDestEqupId;
			var callId=callingInfo.getContactId();
			var contactId=callingInfo.getContactId();
     		var callerNo=callingInfo.callerNo;
     		var calledNo=callingInfo.calledNo;
     		var subsNumber=callingInfo.getSubsNumber();
     		var skillId=fourthCharAttrValD ? fourthCharAttrValD : "";
     		var skillName=thridCharAttrValD ? thridCharAttrValD : "";
     		var opId=staffID;
     		var transferWorkNo=staffID;
     		var typeId=specialId ? specialId : "";
     		var custName= _custInfo ? _custInfo.userName : "";
     		var transferMsg=templContent+"&"+custName;
     		var extraMsg="2##"+secondCharAttrValT+","+firstCharAttrValT+",2##[]";
			if (transferTypeCode==Constants.TRANSFERDEVICETYPE_SKILL_QUEUE) {//转手机网络淫秽受理专席(转技能)
				// 防止冒泡事件
				event.stopPropagation();
				log.setDestSkillId(skillId);
				log.setDestSkillName(skillName);
				log.setDigitCode(ivrPrskeyCodeValue);
				log.setOperId("002");
				// 设置呼叫数据接口返回结果
				transferParam = {
						"typeId" : typeId,
						"subsNumber" : subsNumber,
						"transferWorkNo" : transferWorkNo,
						"transferMsg" : transferMsg,
						"callId" : callId,
						"callerNo" : callerNo,
						"oriSkillId" : "",
						"skillId" : skillId,
						"extraMsg" : extraMsg,
						"sceneFlg" : "005000"
				};
				//设置呼叫数据
				var setcalldatas=_index.callDataUtil.setCallDataForSpecialSeat(transferMode, transferParam);
				//转出
				if (setcalldatas == "0") {
					transout(params);
					if (transouts!='0') {
						log.setFailId(transouts);
						log.setFinalStatus("0");//操作失败
						log.setStatus("0");//操作失败
						//var errorcodeResultMsg=_index.ErrorcodeSearch.errorcodeSearch(transouts);
						//_index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);   
					}else{
						log.setFinalStatus("1");//操作成功
						log.setStatus("1");//操作成功
					}
					switch (transouts) {
					case "0":
						_index.popAlert("转出操作成功");
						log.logSavingForTransfer(log);
						_index.destroyDialog();
						break;
					default:
						var errorcodeResultMsg=_index.ErrorcodeSearch.errorcodeSearch(transouts);
						_index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);  
						log.logSavingForTransfer(log);
					}
				} else {
					_index.popAlert("转接失败,请重新转接！");
					log.logSavingForTransfer(log);
					_index.destroyDialog();
				}
			}else if(transferTypeCode==Constants.TRANSFERDEVICETYPE_IVR){//如果是转ivr
				//log.setAccessCode(transferDestEqupId);
				log.setDigitCode(ivrPrskeyCodeValue);
				log.setDestSkillId(skillId);
				log.setDestOperator(skillId);
				log.setDestSkillName(skillName);
				log.setOperId("009");
				if (transferIvrModeD=="1") {
//					transferDestEqupId...
					Util.ajax.postJson("front/sh/callHandle!execute?uid=getHandleDetailBySequenceId",{"sequenceDetailId":transferDestEqupId},function(data,state){
						
					});
				}
		    	 if (transferTypeId=="16060000") {//转IVR会场
		    		 transferParam = {
		    				 "typeId" : typeId,
		    				 "subsNumber" : subsNumber,
		    				 "opId" : opId,
		    				 "callId" : callId,
		    				 "callerNo" : callerNo,
		    				 "calledNo" : calledNo,
		    				 "sceneFlg" : "011002"
		    		 };
				}else if(transferTypeId=="45571050"){//转话费疑难专席
					 transferParam = {
		    				 "skillName" : skillName,// selectedAllData[0].typeId
		    				 "typeId" : typeId,
		    				 "subsNumber" : subsNumber,
		    				 "transferWorkNo" : transferWorkNo,
		    				 "transferMsg" : transferMsg,
		    				 "callId" : callId,
		    				 "callerNo" : callerNo,
		    				 "oriSkillId" : "",
		    				 "skillId" : skillId,
		    				 "extraMsg" : extraMsg,
		    				 "sceneFlg" : "005001"
		    		 };
				}else if(transferTypeId=="45571170"){//转有线宽带
					transferParam = {
		    				 "skillName" : skillName,// selectedAllData[0].typeId
		    				 "typeId" : typeId,
		    				 "subsNumber" : subsNumber,
		    				 "transferWorkNo" : transferWorkNo,
		    				 "transferMsg" : transferMsg,
		    				 "callId" : callId,
		    				 "callerNo" : callerNo,
		    				 "oriSkillId" : "",
		    				 "skillId" : skillId,
		    				 "extraMsg" : extraMsg,
		    				 "sceneFlg" : "005001"
		    		 };
				}else if(transferTypeId=="45571450"){//转集团专席专线
					transferParam = {
		    				 "skillName" : skillName,// selectedAllData[0].typeId
		    				 "typeId" : typeId,
		    				 "subsNumber" : subsNumber,
		    				 "transferWorkNo" : transferWorkNo,
		    				 "transferMsg" : transferMsg,
		    				 "callId" : callId,
		    				 "callerNo" : callerNo,
		    				 "oriSkillId" : "",
		    				 "skillId" : skillId,
		    				 "extraMsg" : extraMsg,
		    				 "sceneFlg" : "005001"
		    		 };
				}else if(transferTypeId=="88888888"){//转一级客服专席基地
					transferParam = {
		    				 "skillName" : skillName,// selectedAllData[0].typeId
		    				 "opId" : opId,
		    				 "yjkf" : "yjkf",
		    				 "callId" : callId,
		    				 "callerNo" : callerNo,
		    				 "contactId" : contactId,
		    				 "skillId" : skillId,
		    				 "ext2Data" : "",
		    				 "sceneFlg" : "999000"
		    		 };
				}else if(transferTypeId=="10000000"){//转省crm
					transferParam = {
		    				 "typeId" : typeId,
		    				 "subsNumber" : subsNumber,
		    				 "callId" : callId,
		    				 "callerNo" : callerNo,
		    				 "calledNo" : calledNo,
		    				 "opId" : opId,
		    				 "agentPhoneNo" : skillId,
		    				 "sceneFlg" : "011001"
		    		 };
				}
		    		//调用工具类转移至IVR
		    		var result = _index.callDataUtil.setCallDataAndTransIvr(transferMode, "", accessCode, transferParam);
		    		if (result!='0') {
						log.setFailId(result);
						log.setFinalStatus("0");//操作失败
						log.setStatus("0");//操作失败
						var errorcodeResultMsg=_index.ErrorcodeSearch.errorcodeSearch(result);
						_index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);
					}else{
						log.setFinalStatus("1");//操作成功
						log.setStatus("1");//操作成功
						_index.popAlert("转出操作成功");
						_index.destroyDialog();
					}
		    		log.logSavingForTransfer(log);
			}else if(transferTypeCode==Constants.TRANSFERDEVICETYPE_OUTBOUND){//转外呼
				log.setOperId("011");
				transout(params);
				if (transouts!='0') {
					log.setFailId(transouts);
					log.setFinalStatus("0");//操作失败
					log.setStatus("0");//操作失败
				}else{
					log.setFinalStatus("1");//操作成功
					log.setStatus("1");//操作成功
				}
				switch (transouts) {
				case "0":
					_index.popAlert("转出操作成功");
					log.logSavingForTransfer(log);
					_index.destroyDialog();
					break;
				default:
					var errorcodeResultMsg=_index.ErrorcodeSearch.errorcodeSearch(transouts);
					_index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);
					log.logSavingForTransfer(log);
				}
			}
			
		}
		//转出
		var transout=function(data){
			var calledDeviceType=data.transferTypeCode;
			//处理转出设备类型数据
			if (calledDeviceType=="0") {
				calledDeviceType="5";
			}
			//查询技能队列的实时监控信息
			var activeSerialNo =  _index.CallingInfoMap.getAudioActiveserialNo();
			var callingInfo = _index.CallingInfoMap.get(activeSerialNo);
			if (activeSerialNo == undefined || callingInfo == undefined) {
				return;
			}
			var time = callingInfo.getCallIdTime();
			var dsn = callingInfo.getCallIdDsn();
			var handle = callingInfo.getCallIdHandle();
			var server = callingInfo.getCallIdServer();
			var callId = {
				"time" : time,
				"dsn" : dsn,
				"handle" : handle,
				"server" : server
			};
			
			var sign_url="";
	        if(isDefault=="1"){//此种情况走nginx代理
	        	 sign_url=Constants.CCACSURL+ip+":"+port+"/ccacs/"+ctiId+"/ws/call/transout";
	        }else{                                
	        	 sign_url= Constants.CCACSURL+ip+":"+port+"/ccacs/ws/call/transout"; //跨域直连
	        }
			var data = {
				"opserialNo" : _index.serialNumber.getSerialNumber(),
				"callId" : callId,
				"calledDeviceType" : calledDeviceType,
				"transferMode" : data.transferMode,
				"calledDigits" : data.transferDestEqupId,
				"callerDigits" : "",
				"origedDigits" : "",
				"attachedData" : ""
			}
			if(_index.queue.browserName==="IE"){ 
				$.ajax({
					type : "POST",
					contentType : "application/json; charset=utf-8",
					url : sign_url,
					data : JSON.stringify(data),
					crossDomain: true,
					async : false,
					success : function(resultJson) {
						transouts = resultJson.result;
					}
				});
			}else{
				$.ajax({
					type : "POST",
					contentType : "application/json; charset=utf-8",
					url : sign_url,
					data : JSON.stringify(data),
					crossDomain: true,
					xhrFields: {
						withCredentials: true
					},
					async : false,
					success : function(resultJson) {
						transouts = resultJson.result;
					}
				});
			}
			return transouts;
		}
		
			return initialize;
		});