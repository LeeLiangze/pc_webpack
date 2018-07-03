/**
 * 弹出取消内部求助页面
 */
define(['Util', '../../index/constants/mediaConstants',
        '../../log/transferOutLog'], function (Util, Constants,Log) {
    var objModule = function (indexModule) {
        var index = indexModule;
        var log = new Log();
        var internalHelpCallId = index.ctiInit.AudioCallIds.getInternalHelpCallId();
        if (internalHelpCallId) {
        	log.setOperBeginTime(index.utilJS.getCurrentTime());//操作开始时间
            var strCallId = "" + internalHelpCallId.time + internalHelpCallId.dsn + internalHelpCallId.handle + internalHelpCallId.server;
            var serialNo = index.CallingInfoMap.getSerialNoByCallId(strCallId);
            callingInfo = index.CallingInfoMap.get(serialNo);
            var CTIID = index.CTIInfo.CTIId;
            var ip = index.CTIInfo.IP;
            var port = index.CTIInfo.port;
            var proxyIP = index.CTIInfo.ProxyIP;
            var proxyPort = index.CTIInfo.ProxyPort;
            var isDefault = index.CTIInfo.isDefault;
            var sign_url = "";
          //记录日志
			log.setIsExt(true);
			log.setOperator(index.getUserInfo().staffId);//呼叫操作员工账号
			log.setOperId("029");//操作ID					
			log.setSerialNo(serialNo);
			log.setServiceTypeId(callingInfo.getServiceTypeId());// 业务类型ID
			log.setContactId(callingInfo.getContactId());//接触编号
			log.setSubsNumber(callingInfo.calledNo);//受理号码
			log.setOriginalCallerNo(callingInfo.getCallerNo());//原主机号码
			log.setCallerNo(callingInfo.getCallerNo());//主叫号码
			log.setAccessCode(callingInfo.calledNo);//接入码
			log.setDestOperator(callingInfo.calledNo);//目的操作员账号
            if (isDefault == "1") {
                sign_url = Constants.CCACSURL + proxyIP + ":" + proxyPort + "/ccacs/" + CTIID + "/ws/call/releasecall";
            } else {
                sign_url = Constants.CCACSURL + ip + ":" + port + "/ccacs/ws/call/releasecall"; //跨域直连
            }
            var option = index.serialNumber.getSerialNumber(); //获取随机数
            if (typeof (internalHelpCallId) != "undefined" && internalHelpCallId != "") {
                var data = {
                    "callId": internalHelpCallId,
                    "opserialNo": option,
                    "releaseNo": callingInfo.calledNo
                }
                if(index.queue.browserName==="IE"){ 
                	$.ajax({
                		url: sign_url,
                		type: "post",
                		data: JSON.stringify(data),
                		async: true,
                		crossDomain: true,
                		contentType: "application/json; charset=utf-8",
                		success: function (json) {
                			var resultMsg;
                			if (json.result == "0") {
                				index.ctiInit.AudioCallIds.removeAudioCallId(internalHelpCallId);
                				callingInfo.setReleaseType(Constants.RELEASETYPE_OPERATOR);
                				index.CallingInfoMap.put(serialNo, callingInfo);
                				index.ctiInit.AudioCallIds.setInnerHelpStaus("0");//初始化内部求助标识        
                				index.popAlert("取消内部求助成功！");
                				resultMsg = "取消内部求助成功！";
                				log.setStatus("1");//设置状态
                			} else {
                				index.popAlert("取消内部求助失败！");
                				resultMsg = "取消内部求助失败！";
                				log.setFailId(json.result);//操作失败码
                				log.setStatus("0");//设置状态
                			}
    						log.setOperEndTime(index.utilJS.getCurrentTime());//操作结束时间
    						log.setOperId("029");//操作ID		
    						log.logSavingForTransfer(log);//调用记录日志接口
                			/*
    	    	    		var paramsToProvince = {
    	    						"resultCode" : json.result,
    	    						"resultMessage" : resultMsg,
    	    						"reserved1" : "",
    	    						"reserved2" : "",
    	    						"reserved3" : ""
    	    				};
    	    				index.postMessage.sendToProvince("releasecall", paramsToProvince);
                			 */
                		}
                	});
                }else{
                	$.ajax({
                		url: sign_url,
                		type: "post",
                		data: JSON.stringify(data),
                		async: true,
                		crossDomain: true,
                		xhrFields: {
                			withCredentials: true
                		},
                		contentType: "application/json; charset=utf-8",
                		success: function (json) {
                			var resultMsg;
                			if (json.result == "0") {
                				index.ctiInit.AudioCallIds.removeAudioCallId(internalHelpCallId);
                				callingInfo.setReleaseType(Constants.RELEASETYPE_OPERATOR);
                				index.CallingInfoMap.put(serialNo, callingInfo);
                				index.ctiInit.AudioCallIds.setInnerHelpStaus("0");//初始化内部求助标识    
                				index.popAlert("取消内部求助成功！");
                				resultMsg = "取消内部求助成功！";
                				log.setStatus("1");//设置状态
                			} else {
                				index.popAlert("取消内部求助失败！");
                				resultMsg = "取消内部求助失败！";
                				log.setFailId(json.result);//操作失败码
                				log.setStatus("0");//设置状态
                			}
                			
    						log.setOperEndTime(index.utilJS.getCurrentTime());//操作结束时间	
    						log.logSavingForTransfer(log);//调用记录日志接口
                			/*
	    	    		var paramsToProvince = {
	    						"resultCode" : json.result,
	    						"resultMessage" : resultMsg,
	    						"reserved1" : "",
	    						"reserved2" : "",
	    						"reserved3" : ""
	    				};
	    				index.postMessage.sendToProvince("releasecall", paramsToProvince);
                			 */
                		}
                	});
                }
            }
        }else if(index.ctiInit.AudioCallIds.getOuterHelpStaus() == "1"){
        	require(['../callOutHelp/cancelCallOutHelp1'], function(cancelCallOutHelp){
        		new cancelCallOutHelp(index);
        	});
        } else {
            index.popAlert("外部、内部求助状态下才能进行取消操作！", "取消求助");
        }
        
    }

    return objModule;
})
