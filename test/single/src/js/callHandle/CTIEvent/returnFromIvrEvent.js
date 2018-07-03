/**
 * 308事件
 * 从IVR返回事件
 */
define(['Util',
        './CTIEventsDeal',
        '../../index/constants/mediaConstants',
        'jquery.tiny'], function(Util,CTIEventsDeal,mediaConstants) {
	var index;
	var comUI;
	var MediaConstants;
	var returnFromIvrEvent = function(indexModule) {
		index = indexModule;
		comUI = index.comMenu;
		MediaConstants=mediaConstants;
	};
	$.extend(returnFromIvrEvent.prototype,{
		returnFromIvrEvent : function(uselessObj,returnFromIvrEvent){
			
			var params1ToProvince = {
					"resultCode" : 0,
					"resultMessage" : "从IVR返回事件",
					"reserved1" : "",
					"reserved2" : "",
					"reserved3" : ""
			};
			index.postMessage.sendToProvince("returnFromIvrEvent", params1ToProvince);
			
			//获得callID
			var callId = returnFromIvrEvent.callId;
			var serialNo=index.CallingInfoMap.getActiveSerialNo();
			var callingInfo=index.CallingInfoMap.get(serialNo);
			index.callDataUtil.getDataAndSplitToRoutePackage(callId,false,function(index){
				var routePackage = index.callDataUtil.getRoutePackage();
				var typeId = routePackage.getExt2().getTypeId() ? routePackage.getExt2().getTypeId() : '';
				var verifyResult =  routePackage.getExt2().getVerifyResult() ? routePackage.getExt2().getVerifyResult() : '';
				var ciperCode = routePackage.getExt2().getVerifyResult() ? routePackage.getExt2().getCiperCode() : '';
				var weakCodeFlg = routePackage.getExt2().getWeakCodeFlg() ? routePackage.getExt2().getWeakCodeFlg() : '';
				var ifPwdLocked = routePackage.getExt2().getIfPwdLocked() ? routePackage.getExt2().getIfPwdLocked() : '';
				var idCard = routePackage.getExt2().getIdCard() ? routePackage.getExt2().getIdCard() : '';
				var cardFailMsg = routePackage.getExt2().getCardFailMsg() ? routePackage.getExt2().getCardFailMsg() : '';
				var pwdAndFailFlg = routePackage.getExt2().getPwdAndFailFlg() ? routePackage.getExt2().getPwdAndFailFlg() : '';
				
				if(typeId == '002') {
					if(verifyResult == '1') {
						/*
						if(weakCodeFlg != '6') {
							index.popAlert("密码验证成功！ 密码为" + ciperCode);
							callingInfo.setCipCheckFlag(MediaConstants.CIPERCHECKRESULT_ACCESS);//记录密码验证结果
							
						} else {
							index.popAlert("密码验证成功！ 密码为" + ciperCode + ", 密码较弱");
							callingInfo.setCipCheckFlag(MediaConstants.CIPERCHECKRESULT_ACCESS);
						}
						*/
						index.popAlert("密码验证成功！");
						callingInfo.setCipCheckFlag(MediaConstants.CIPERCHECKRESULT_ACCESS);//记录密码验证结果
					} else if(verifyResult == '0') {
						/*
						if(ifPwdLocked != "") {
							index.popAlert("密码验证失败！ " + ifPwdLocked);
						} else if(pwdAndFailFlg != ""){
							index.popAlert("密码为" + pwdAndFailFlg + "!");
						}
						*/
						index.popAlert("密码验证失败！");
						callingInfo.setCipCheckFlag(MediaConstants.CIPERCHECKRESULT_NOTACCESS);
					}
				} else if(typeId == '006') {
					if(verifyResult == '1') {
						//index.popAlert("身份证验证成功！ 身份证为" + idCard);
						index.popAlert("身份证验证成功！");
						callingInfo.setCipCheckFlag(MediaConstants.CIPERCHECKRESULT_ACCESS);
					} else if(verifyResult == '0') {
						//index.popAlert("身份证验证失败！ " + cardFailMsg);
						index.popAlert("身份证验证失败！");
						callingInfo.setCipCheckFlag(MediaConstants.CIPERCHECKRESULT_NOTACCESS);
					}
				}
				
				var params2ToProvince = {
						typeId : typeId,
						verifyResult : verifyResult,
						ciperCode : ciperCode,
						weakCodeFlg : weakCodeFlg,
						ifPwdLocked : ifPwdLocked,
						idCard : idCard,
						cardFailMsg : cardFailMsg,
						reserved1 : "",
						reserved2 : "",
						reserved3 : ""
				};
				
				index.postMessage.sendToProvince('verifyResult',params2ToProvince);
			});
//			//调用获取呼叫数据接口，解析calldata
//			var querycalldata_url="https://192.168.100.170:8443/ccacs/ws/agent/querycalldata"
//			       var datas={
//			             "callId":callId
//			      };
//			       $.ajax({  
//			          url : querycalldata_url ,
//			            type : 'post',  
//			            timeout : 20000,
//			            async:false,
//			            data :  JSON.stringify(datas), 
//			            rossDomain: true,
//			            xhrFields: {
//			                  withCredentials: true
//			                   },
//			            contentType:"application/json; charset=utf-8",
//			            success : function(jsonData) {
//			               if("0"==jsonData.result){
//			            	   var calldata=jsonData.calldata;
//			            	   //解析callData
//			            	   
//			               }else{
//			            	   index.popAlert("强制签出失败","综合接续");
//			               }
//			            },
//			            error : function( XMLHttpRequest, textStatus, errorThrown) {
//			               var errorParams = {
//			                     "XMLHttpRequest":XMLHttpRequest,
//			                     "textStatus":textStatus,
//			                     "errorThrown":errorThrown
//			               };             
//			            } 
//			        });
		 }
	})
	return returnFromIvrEvent;
});
