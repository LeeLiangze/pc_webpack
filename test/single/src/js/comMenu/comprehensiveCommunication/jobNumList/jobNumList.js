/**
 * 工号列表
 */
define(['Util',
        'Compts',
        '../../../index/constants/mediaConstants',
        '../../../callHandle/callingInfoMap/CallingInfo',
        '../../../log/managementLog',
        '../../../log/transferOutLog',
        '../../../../tpl/comMenu/comprehensiveCommunication/jobNumList/jobNumList.tpl',
        'jquery.multipleSelect',
        '../../../../assets/lib/jqueryPlugin/multiple-select-master/multiple-select.css',
        '../../../../assets/css/comMenu/comprehensiveCommunication/jobNumList/jobNumList.css'
    ],
    function (Util, Compts, MediaConstants, CallingInfo, managementLog, transferOutLog, tpl, multipleSelect) {

        // 系统变量-定义该模块的根节点
	
		var _index = null, $el = null, cityName = null, _intervalTime = 10, 
		SkillName = null, selectTree = null, staffList = null, type = null, ccid = null, 
		vdnid = null, ctiid = null, isDefault = null, ip = null, port = null, 
		setcalldatas = null, transouts = null, staffId_workno = null, status_value = null, _oInterval = null, 
		sendNotebtnSta = null, orgid_init = "", _callingInfo = new CallingInfo(), provinceId = null;
        
        var initialize = function (index, options) {
            $el = $(tpl);
            // 初始化一些全局变量
            _index = index;

            ctiid = _index.CTIInfo.CTIId;
            ccid = _index.CTIInfo.CCID;
            vdnid = _index.CTIInfo.VDNVDNId;
            provinceId = _index.getUserInfo().provinceId;

            isDefault = _index.CTIInfo.isDefault; // 缺省业务标志值
            var proxyIp = _index.CTIInfo.ProxyIP; // 代理ip
            var proxyPort = _index.CTIInfo.ProxyPort; // 代理端口
            var directIp = _index.CTIInfo.IP; // 直连ip
            var directPort = _index.CTIInfo.port; // 直连端口
            if (isDefault == "1") { // 此种情况走nginx代理
                ip = proxyIp;
                port = proxyPort;
            } else {
                ip = directIp;
                port = directPort;
            }

            // 按钮权限展示初始化
            initButtonAuthority.call(this);
            // 按钮点击事件初始化
            initEvent.call(this);
            
            // 初始化下拉框
            initForm.call(this, provinceId);
            // 列表
//            listInit.call(this);
            // 判断是否在旁听或者插入
            auditOrInsert.call(this);
            // 定时刷新
            //        intervalQuery.call(this);
            this.content = $el;
/*            require(['js/comMenu/comprehensiveCommunication/btnAuthority/btnAuthority'], function (Authority) {
                // 把当前模板传入，框架js，js会找到当前模板中的所有具有mo属性的按钮
                new Authority($el);
            })*/
            $('.jobNumMainDiv').show();
            $('.jobNumNotifyDiv').hide();
        };

        // 初始化按钮展示设置
        var initButtonAuthority = function () {
            // 判断签入CTI状态，是否签入(后面会加判断是否还签入了语音)
            var signStatus = _index.CTIInfo.signIn;
            if (signStatus == "true") { // SignOut
                var signAudioStatus = _index.CTIInfo.audioType;
                disableButtonStatus(["AuditAudioComm", "InsertAudioComm"]);
                enableButtonStatus(["InterHelpAudioComm"]);
                if (signAudioStatus == null || signAudioStatus == "" || signAudioStatus == undefined) { // 没签入语音
                    // enableButtonStatus(["ForceBusyAudioComm","ForceDisplayAudioComm","ForceBreakAudioComm","ForceCheckOutAudioComm","SendMsgAudioComm"]);
                } else {
                    // 当前是否有语音会话被保持
                    var callIdSize = _index.ctiInit.AudioCallIds
                        .getAudioCallIdsSize();
                    var holdCallId=_index.ctiInit.AudioCallIds.getHoldCallId();
                    if (callIdSize > 0&&(holdCallId==undefined||holdCallId=="")) {
                        buttonStatus(["InterCallAudioComm"]); 
                    }else{
                    	buttonStatus(["InterHelpAudioComm"]);
                    }
                   
                    // 当前坐席是否在旁听
                    var isInSupervise = _index.ctiInit.AudioCallIds.getIsInSupervise();
                    if (isInSupervise) {
                        $("#AuditAudioComm", $el).children("input:first").attr({
                            "value": "停止旁听"
                        });
                        enableButtonStatus(["AuditAudioComm"]);
                    } else {
                        $("#AuditAudioComm", $el).children("input:first").attr({
                            "value": "旁听"
                        });
                        enableButtonStatus(["AuditAudioComm"]);
                    }
                    // 当前坐席是否已经插入
                    var isInInsert = _index.ctiInit.AudioCallIds.getIsInInsert();
                    if (isInInsert) {
                        $("#InsertAudioComm", $el).children("input:first").attr({
                            "value": "停止插入"
                        });
                        enableButtonStatus(["InsertAudioComm"]);
                    } else {
                        $("#InsertAudioComm", $el).children("input:first").attr({
                            "value": "插入"
                        });
                        enableButtonStatus(["InsertAudioComm"]);
                    }
                    // 初始化为 发送通知按钮 状态
                    sendNoteBtnSta = true;
                }
            }
        };

        // 禁用按钮状态
        var disableButtonStatus = function (varArr) {
            if (varArr.length > 0) {
                for (var i = 0; i < varArr.length; i++) {
                    $('#' + varArr[i], $el).attr('class', 'disabled').children("input:first").attr({
                            "disabled": true
                        })
                        .css({
                            "background": "#fff",
                            "color": "gray",
                            "border": "1px solid lightgray",
                            "cursor": "auto"
                        });
                }
            }
        };
        
        //按钮不可点击状态
        var buttonStatus = function (varArr) {
            if (varArr.length > 0) {
                for (var i = 0; i < varArr.length; i++) {
                    $('#' + varArr[i], $el).attr('disabled', 'disabled').children("input:first").attr({
                            "disabled": true
                        })
                        .css({
                            "background": "#fff",
                            "color": "gray",
                            "border": "1px solid lightgray",
                            "cursor": "auto"
                        });
                }
            }
        };
        

        // 启用按钮状态
        var enableButtonStatus = function (varArr) {
            if (varArr.length > 0) {
                for (var i = 0; i < varArr.length; i++) {
                    $('#' + varArr[i], $el).attr('class', 'enable liHide').removeAttr("disabled").children("input:first").removeAttr("disabled")
                        .css({
                            "background": "#0085D0",
                            "color": "white",
                            "cursor": "pointer"
                        });
                }
            }
        };

        // 初始化点击按钮
        var initEvent = function () {
            $el.on('click', '#searchId_transfer', searchStaff);
            $el.on('click', '#cancelBtn_transferComm', cancelBtn);
            /*
             * $el.on('click','#up_transfer',$.proxy(upTime,this));
             * $el.on('click','#down_transfer',$.proxy(downTime,this)); //刷新时间改变事件
             * $el.on('change','#refreshTimeId_transfer', $.proxy(changeTime,this));
             */
            // 旁听事件停止旁听处理事件
            $el.on('click', '#auditBtn_transferComm', startAudit);

            // 插入事件停止插入处理事件
            $el.on('click', '#insertBtn_transferComm', insertAudit);

            // 强制示忙
            $el.on('click', '#forceBusyBtn_transferComm', forceBusyAudit);

            // 强制示闲
            $el.on('click', '#forceDisplayBtn_transferComm', forceNoBusyAudit);

            // 强制休息
            $el.on('click', '#forceBreakBtn_transferComm', forceBreakAudit);

            // 拦截
            $el.on('click', '#interceptBtn_transferComm', InterceptAudio);

            // 强制签出
            $el.on('click', '#forceCheckOutBtn_transferComm', forceCheckAudit);

            // 内部求助
            $el.on('click', '#interHelpBtn_transferComm', interHelp);

            // 内部呼叫
            $el.on('click', '#interCommBtn_transferComm', internalCall);

            // 发送通知
            $el.on('click', '#sendMsgBtn_transferComm', sendNotes);

            // 转接
            $el.on('click', '#transferBtn_transferwys', transferBtn);

            $el.on("mouseover", ".staffid_jobNumList_signInStatus", function () {
                var id = $(this).text();
                var param_transfer011 = {
                    "start": '',
                    "limit": '',
                    "staffId": id,
                    "staffState": '1',
                    "staffName": '',
                    "orgaCode": '',
                    "orgaName": '',
                    "proviceId": '',
                    "cityId": '',
                    "isChecked": '0'
                }
                var title = '';
                $.ajax({
                    type: "POST",
                    url: "front/sh/media!execute?uid=transfer011",
                    async: false,
                    data: param_transfer011,
                    success: function (resultJson) {
                        var result = resultJson.beans;
                        var jsonArray = eval(result);
                        for (var i = 0; i < jsonArray.length; i++) {
                            title = jsonArray[i].staffName;
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
                $(this).attr("title", title);
            });
        }

        // 判断当前是否在旁听或者插入
        var auditOrInsert = function () {
            var audit = _index.ctiInit.AudioCallIds.getIsInSupervise();
            var auditInsert = _index.ctiInit.AudioCallIds.getIsInInsert();
            if (audit == true) {
                var staffId = _index.ctiInit.AudioCallIds.getSupervisedStaffId();
                $el.find("#auditInsertNotes").html("<span style='color:red;font-size:16px;'>提示：当前被【旁听】坐席的业务账号为：" + staffId + "，您可直接点击【停止旁听】按钮，结束【旁听】</span>");
            }
            if (auditInsert == true) {
                var staffId = _index.ctiInit.AudioCallIds.getInsertedStaffId();
                $el.find("#auditInsertNotes").html("<span style='color:red;font-size:16px;'>提示：当前被【插入】坐席的业务账号为：" + staffId + "，您可直接点击【停止插入】按钮，结束【插入】</span>");
            }
        }

        // 内部呼叫
        var internalCall = function () {
                // 主叫号码
                var callerDigits = _index.CTIInfo.workNo;
                // 被叫号码
                var calledDigits = '';
                var params = staffList.getCheckedRows();
                if (params.length == 0) {
                	_index.popAlert("请先选择一个工号！","内部呼叫");
                    return;
                } else if (params.length == 1) {
                    if (params[0].STATUS == "空闲") {
                        if (params[0].WORKNO == callerDigits) {
                            _index.popAlert("不能对自己进行内部呼叫");
                            return;
                        }
                        calledDigits = 'A' + params[0].WORKNO;                       
                    } else {
                        _index.popAlert("被呼叫座席当前不在空闲态");
                        return;
                    }
                } else if (params.length > 1) {
                    _index.popAlert("只能选择一个工号");
                    return;
                }

                var config = {
                    uri: 'ws/call/callout/',
                    timeout: 20000, // 默认为 20000。如果超时时长不是 20000，则需要传递该参数。
                    requestData: {
                        "opserialNo": _index.serialNumber.getSerialNumber(),
                        "callerDigits": callerDigits,
                        "calledDigits": calledDigits
                    }, // 请求参数
                    async: true, // 默认值为 true 异步。如果需要同步，则需要传递该参数为false
                    successCallBack: function (data) { // 成功的回调函数
                            if (data.result == "0") {
                            	 //存储呼叫类型 start
                            	_index.ctiInit.AudioCallIds.setCallFeature("2");//内部呼叫2
	               				 //存储呼叫类型 end
                                _index.popAlert("内部呼叫请求发送成功", "内部呼叫");
                                _index.destroyDialog();
                                // _index.header.communication.recordCallCTILog("ws/call/callout/",{"callerDigits":callerDigits,"calledDigits":calledDigits},"内部呼叫成功",data.result);
                            } else {
//                                var resultMsg = _index.ctiInit.ErrorcodeSearch.ErrorcodeSearch(data.result, "内部呼叫请求发送失败,错误码：" + data.result);
//                                _index.popAlert(resultMsg, "内部呼叫失败");
                                var errorcodeResultMsg=_index.ErrorcodeSearch.errorcodeSearch(data.result);
                                _index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);
                                // _index.header.communication.recordCallCTILog("ws/call/callout/",{"callerDigits":callerDigits,"calledDigits":calledDigits},"内部呼叫失败",data.result);
                            }
                        },
                        errorCallBack: function (jqXHR, textStatus, errorThrown) { // 失败的回调函数
                            _index.popAlert("网络异常，内部呼叫请求发送失败", "内部呼叫");
                            // _index.header.communication.recordCallCTILog("ws/call/callout/",{"callerDigits":callerDigits,"calledDigits":calledDigits},"网络异常","
                            // -1");                            
                        }
                };
                // 发起调用
                _index.ctiInit.requestCTI.postCTIRequest(config);
            }
            // 转接按钮功能
        var transferBtn = function () {
        	var transferStartTime = _index.utilJS.getCurrentTime();
        	var status = $(".TimeTilte").text();
    		if(status != "通话中"){
    			_index.popAlert("转接失败，当前坐席不处于通话状态","转接");
    			return;
    		}
            // 工号
            var calledDigits = '';
            var params = staffList.getCheckedRows();
            if (params.length == 0 || params.length == undefined) {
                _index.popAlert("请先选择一个工号");
                return;
            } else if (params.length > 1) {
                _index.popAlert("只能选择一个工号进行转接");
                return;
            } else {
                calledDigits = params[0].WORKNO;
            }
            var selectedStaff = staffList.getCheckedRows();
            var destOperator = selectedStaff[0].STAFFID;
            $("#transferBtn_transferwys").attr({
                "disabled": "disabled"
            });
            $("#transferBtn_transferwys").removeClass("btn-blue");
            $("#transferBtn_transferwys").addClass("btn_jobNumList");
            // 设置呼叫数据接口返回结果
            setcalldata();
            if (setcalldatas == "0") {
                // 发送转接请求
                var activeSerialNo = _index.CallingInfoMap.getActiveSerialNo();
                var callingInfo = _index.CallingInfoMap.get(activeSerialNo);
                if (activeSerialNo == undefined || callingInfo == undefined) {
                    return;
                }
                var time = callingInfo.getCallIdTime();
                var dsn = callingInfo.getCallIdDsn();
                var handle = callingInfo.getCallIdHandle();
                var server = callingInfo.getCallIdServer();
                var callId = {
                    "time": time,
                    "dsn": dsn,
                    "handle": handle,
                    "server": server
                };

                var sign_url = "";
                if (isDefault == "1") { //此种情况走nginx代理
                    sign_url = MediaConstants.CCACSURL + ip + ":" + port + "/ccacs/" + ctiid + "/ws/call/transout";
                } else {
                    sign_url = MediaConstants.CCACSURL + ip + ":" + port + "/ccacs/ws/call/transout"; //跨域直连
                }

                // 转出的设备类型--坐席
                var calledDeviceType = MediaConstants.CALLEDDEVICETYPE_SEAT;
                // 转出时的模式 0：释放转 2：成功转 3：指定转
                var transferMode = $('#transferId_transfer input[name="transfer"]:checked').val();
               //设置挂机方为坐席 start
                if(transferMode == "0"){
                	callingInfo.setReleaseType(MediaConstants.RELEASETYPE_OPERATOR); 
                }
                //设置挂机方为坐席 end
                var data = {
                    "opserialNo": _index.serialNumber.getSerialNumber(),
                    "callId": callId,
                    "calledDeviceType": calledDeviceType,
                    "transferMode": transferMode,
                    "calledDigits": calledDigits,
                    "callerDigits": "",
                    "origedDigits": "",
                    "attachedData": ""
                }
                if(_index.queue.browserName==="IE"){ 
                	$.ajax({
                		type: "POST",
                		url: sign_url,
                		contentType: "application/json; charset=utf-8",
                		data: JSON.stringify(data),
                		crossDomain: true,
                		async: false,
                		success: function (resultJson) {
                			transouts = resultJson.result;
                			// _index.header.communication.recordCallCTILog(url,data,"转出接口",transouts);
                		},
                		error: function (XMLHttpRequest, textStatus, errorThrown) {
                			// _index.header.communication.recordCallCTILog(url,data,"网络异常，转出接口调用失败","-1");
                		}
                	});
                }else{
                	$.ajax({
                		type: "POST",
                		url: sign_url,
                		contentType: "application/json; charset=utf-8",
                		data: JSON.stringify(data),
                		crossDomain: true,
                		xhrFields: {
                			withCredentials: true
                		},
                		async: false,
                		success: function (resultJson) {
                			transouts = resultJson.result;
                			// _index.header.communication.recordCallCTILog(url,data,"转出接口",transouts);
                		},
                		error: function (XMLHttpRequest, textStatus, errorThrown) {
                			// _index.header.communication.recordCallCTILog(url,data,"网络异常，转出接口调用失败","-1");
                		}
                	});
                }
                // 设置转接日志数据
                var currentTime = _index.utilJS.getCurrentTime();
                var staffID = _index.getUserInfo()['staffId'];
                var msg = $.trim($el.find("#notesId_transfer").val());
                // 将转接数据放入callInfo
                var activeSerialNo = _index.CallingInfoMap.getActiveSerialNo();
                _callingInfo = _index.CallingInfoMap.get(activeSerialNo);
                if (_callingInfo != null) {
                    _callingInfo.setTransferTime(currentTime);
                    _callingInfo.setTransferType("0");
                    _callingInfo.setTransferInner(calledDigits);
                    _callingInfo.setTransferMode(transferMode);
                    _callingInfo.setTransferOuter(staffID);
                    _callingInfo.setTransferMsg(msg);
                    _index.CallingInfoMap.put(activeSerialNo, _callingInfo);
                }
                
                // 记录日志 start
                var operStatus = ""; //操作状态 0 失败 1 成功
                var failId = "";
                var transMode = "";
                if(transouts == "0") {
                	operStatus = "1";
                } else {
                	operStatus = "0";
                	failId = transouts;
                }
                if(transferMode == "0") { //释放转
                	transMode = "1";
                } else if(transferMode == "2") { //成功转
                	transMode = "2";
                }
                
                var tLog = new transferOutLog(); 
                tLog.setIsExt(true);
                tLog.setSerialNo(_callingInfo && _callingInfo.serialNo ? _callingInfo.serialNo : "");
                tLog.setContactId(_callingInfo && _callingInfo.contactId ? _callingInfo.contactId : "");
                tLog.setOperator(_index.getUserInfo()['staffId']);
                tLog.setOperBeginTime(transferStartTime);
                tLog.setOperEndTime(_index.utilJS.getCurrentTime());
                tLog.setOperId("001");
                tLog.setServiceTypeId(_index.CTIInfo.serviceTypeId);
                tLog.setStatus(operStatus);
                tLog.setCallerNo(_callingInfo && _callingInfo.callerNo ? _callingInfo.callerNo : "");
                tLog.setSubsNumber(_callingInfo && _callingInfo.subsNumber ? _callingInfo.subsNumber : "");
                tLog.setSourceDesc(_callingInfo && _callingInfo.getTransferMsg() ? _callingInfo.getTransferMsg() : "");
                tLog.setAccessCode(_callingInfo && _callingInfo.getCalledNo() ? _callingInfo.getCalledNo() : "");
                tLog.setFailId(failId);
                tLog.setDestOperator(destOperator);
                tLog.setFinalStatus(operStatus);
                tLog.setTransferMode(transMode);
                tLog.logSavingForTransfer(tLog);
                // 记录日志 end
                
                var resultMsg;
                switch (transouts) {
                case "0":
                	_index.popAlert("转出操作成功","转出");
                    resultMsg = "转出操作成功";
                    _index.destroyDialog();
                    break;
                case "20512":
                    $("#transferBtn_transferwys").removeAttr("disabled");
                    $("#transferBtn_transferwys").removeClass("btn_jobNumList");
                    $("#transferBtn_transferwys").addClass("btn-blue");
                    _index.popAlert("被转接座席已达到最大会话数，转接失败");
                    resultMsg = "被转接座席已达到最大会话数，转接失败";
                    break;
                case "20515":
                    $("#transferBtn_transferwys").removeAttr("disabled");
                    $("#transferBtn_transferwys").removeClass("btn_jobNumList");
                    $("#transferBtn_transferwys").addClass("btn-blue");
                    _index.popAlert("被转接坐席已示忙");
                    resultMsg = "被转接坐席已示忙";
                    break;
                case "1128":
                    $("#transferBtn_transferwys").removeAttr("disabled");
                    $("#transferBtn_transferwys").removeClass("btn_jobNumList");
                    $("#transferBtn_transferwys").addClass("btn-blue");
                    _index.popAlert("内部呼叫或者特殊呼叫，不能进行转接操作");
                    resultMsg = "内部呼叫或者特殊呼叫，不能进行转接操作";
                    break;
                case "150003":
                    $("#transferBtn_transferwys").removeAttr("disabled");
                    $("#transferBtn_transferwys").removeClass("btn_jobNumList");
                    $("#transferBtn_transferwys").addClass("btn-blue");
                    _index.popAlert("转接失败，请检查是否选择工号");
                    resultMsg = "转接失败，请检查是否选择工号";
                    break;
                case "155085":
                	$("#transferBtn_transferwys").removeAttr("disabled");
                    $("#transferBtn_transferwys").removeClass("btn_jobNumList");
                    $("#transferBtn_transferwys").addClass("btn-blue");
                    _index.popAlert("转接失败，请不要转给自己！");
                    resultMsg = "转接失败，请不要转给自己";
                    break;
                default:
                    $("#transferBtn_transferwys").removeAttr("disabled");
                    $("#transferBtn_transferwys").removeClass("btn_jobNumList");
                    $("#transferBtn_transferwys").addClass("btn-blue");
//                    resultMsg = _index.ctiInit.ErrorcodeSearch.ErrorcodeSearch(transouts, "转接失败,错误码：" + transouts);
//                    _index.popAlert(resultMsg,"转接失败");
                    var errorcodeResultMsg=_index.ErrorcodeSearch.errorcodeSearch(transouts);
                    _index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);
                }

                var paramsToProvince = {
                    "resultCode": transouts,
                    "resultMessage": resultMsg,
                    "reserved1": "",
                    "reserved2": "",
                    "reserved3": ""
                };
                _index.postMessage.sendToProvince("transout", paramsToProvince);

            } else {
                _index.popAlert("转接失败,请重新转接");
                _index.destroyDialog();
            }
        }

        // CTI接口setcalldata(设置呼叫数据)
        var setcalldata = function () {
                var staffId = _index.getUserInfo().staffId;
                var staffName = _index.getUserInfo()['staffName'];
                var activeSerialNo = _index.CallingInfoMap.getActiveSerialNo();
                var callingInfo = _index.CallingInfoMap.get(activeSerialNo);
                if (activeSerialNo == undefined || callingInfo == undefined || callingInfo == null) {
                    return;
                }
                var subsNumber =  callingInfo.getSubsNumber();
        		var _custInfo = callingInfo.getClientInfoMap(subsNumber);
        		var userName = _custInfo ? _custInfo.userName ? _custInfo.userName : "" : "";

                var time = callingInfo.getCallIdTime();
                var dsn = callingInfo.getCallIdDsn();
                var handle = callingInfo.getCallIdHandle();
                var server = callingInfo.getCallIdServer();
                var callId = {
                    "time": time,
                    "dsn": dsn,
                    "handle": handle,
                    "server": server
                };
                var mediaId = callingInfo.getMediaType();
                var channelId = callingInfo.getChannelID();

                var sign_url = "";
                if (isDefault == "1") { //此种情况走nginx代理
                    sign_url = MediaConstants.CCACSURL + ip + ":" + port + "/ccacs/" + ctiid + "/ws/call/setcalldata";
                } else {
                    sign_url = MediaConstants.CCACSURL + ip + ":" + port + "/ccacs/ws/call/setcalldata"; //跨域直连
                }

                var transferMsg = $.trim($el.find("#notesId_transfer").val());
                var callType= callingInfo.getCallType();
                var isOutCall=false;
                if (callType=="1") {
                	isOutCall=true;
				}
                var callData = {
                    "contactID": activeSerialNo,
                    "transferMsg": transferMsg,
                    "staffId": staffId,
                    "mediaId": mediaId,
                    "channelId": channelId,
                    "staffName": staffName,
                    "userName" : userName,
                    "transflag": true,
                    "isOutCall":isOutCall
                };
                // 拼装接口setcalldata（设置呼叫数据）数据
                var data = {
                    "opserialNo": _index.serialNumber.getSerialNumber(),
                    "callId": callId,
                    "callData": callData
                };
                if(_index.queue.browserName==="IE"){ 
                	$.ajax({
                		type: "POST",
                		url: sign_url,
                		contentType: "application/json; charset=utf-8",
                		data: JSON.stringify(data),
                		crossDomain: true,
                		async: false,
                		success: function (resultJson) {
                			setcalldatas = resultJson.result;
                			// _index.header.communication.recordCallCTILog(url,data,resultJson,"setcalldata接口");
                		},
                		error: function (XMLHttpRequest, textStatus, errorThrown) {
                			var errorParams = {
                					"XMLHttpRequest": XMLHttpRequest,
                					"textStatus": textStatus,
                					"errorThrown": errorThrown
                			};
                			// _index.header.communication.recordCallCTILog(url,data,errorParams,"网络异常，setcalldata接口调用失败");
                		}
                	});
                }else{
                	$.ajax({
                		type: "POST",
                		url: sign_url,
                		contentType: "application/json; charset=utf-8",
                		data: JSON.stringify(data),
                		crossDomain: true,
                		xhrFields: {
                			withCredentials: true
                		},
                		async: false,
                		success: function (resultJson) {
                			setcalldatas = resultJson.result;
                			// _index.header.communication.recordCallCTILog(url,data,resultJson,"setcalldata接口");
                		},
                		error: function (XMLHttpRequest, textStatus, errorThrown) {
                			var errorParams = {
                					"XMLHttpRequest": XMLHttpRequest,
                					"textStatus": textStatus,
                					"errorThrown": errorThrown
                			};
                			// _index.header.communication.recordCallCTILog(url,data,errorParams,"网络异常，setcalldata接口调用失败");
                		}
                	});
                }
                return setcalldatas;
            }
        
        var setcalldataBeforeInterHelp = function () {
        	var result = null;
            var activeSerialNo = _index.CallingInfoMap.getActiveSerialNo();
            var callingInfo = _index.CallingInfoMap.get(activeSerialNo);
            if (activeSerialNo == undefined || callingInfo == undefined || callingInfo == null) {
                return;
            }
            var time = callingInfo.getCallIdTime();
            var dsn = callingInfo.getCallIdDsn();
            var handle = callingInfo.getCallIdHandle();
            var server = callingInfo.getCallIdServer();
            var callId = {
                "time": time,
                "dsn": dsn,
                "handle": handle,
                "server": server
            };

            var sign_url = "";
            if (isDefault == "1") { //此种情况走nginx代理
                sign_url = MediaConstants.CCACSURL + ip + ":" + port + "/ccacs/" + ctiid + "/ws/call/setcalldata";
            } else {
                sign_url = MediaConstants.CCACSURL + ip + ":" + port + "/ccacs/ws/call/setcalldata"; //跨域直连
            }
            
            // 为了修复转接后再内部求助，求助方和被求助方页面中间都会出现转接信息的问题，
            // 就在内部求助前先设置下随路数据，内容为"emptyCallData" base64加密后的 字符串
            // 304事件里判断是否需要显示转接信息时，可根据该信息过滤，不展示页面中间的转接信息
            var codeData = _index.callDataUtil.base64Encode("emptyCallData");

            // 拼装接口setcalldata（设置呼叫数据）数据
            var data = {
                "opserialNo": _index.serialNumber.getSerialNumber(),
                "callId": callId,
                "callData": codeData,
                "isDataEncoded": false
            }
            if(_index.queue.browserName==="IE"){ 
            	$.ajax({
            		type: "POST",
            		contentType: "application/json; charset=utf-8",
            		url: sign_url,
            		data: JSON.stringify(data),
            		crossDomain: true,
            		async: false,
            		success: function (resultJson) {
            			result = resultJson.result;
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
            		type: "POST",
            		contentType: "application/json; charset=utf-8",
            		url: sign_url,
            		data: JSON.stringify(data),
            		crossDomain: true,
            		xhrFields: {
            			withCredentials: true
            		},
            		async: false,
            		success: function (resultJson) {
            			result = resultJson.result;
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
            return result;
        }
        
            // 内部求助-工号列表
        var interHelp = function () {
            // 主叫号码
            var callerDigits = _index.CTIInfo.workNo;
            // 目的设备类型,1: 技能队列,2 :座席
            var deviceType = '2';
            // 被求助的设备地址
            var dialedDigits = '';
            var params = staffList.getCheckedRows();
            if (params.length == 0) {
                _index.popAlert("请先选择一个工号");
                return;
            } else if (params.length == 1) {
                if (params[0].WORKNO == callerDigits) {
                    _index.popAlert("不能对自己进行内部求助");
                    return;
                } else if (params[0].STATUS == "空闲") {
                    dialedDigits = params[0].WORKNO;
                    //获取与用户通话的callingInfo
                    var activeSerialNo = _index.CallingInfoMap.getActiveSerialNo();
            		var callingInfoTemp = _index.CallingInfoMap.get(activeSerialNo);//获取callingInfo
                    _index.ctiInit.AudioCallIds.setIsConferenceCallerNo(callingInfoTemp.getCallerNo());//设置三方通话的主叫号码
                } else {
                    _index.popAlert("被呼叫座席当前不在空闲态");
                    return;
                }
            } else if (params.length > 1) {
                _index.popAlert("只能选择一个工号");
                return;
            }
            
            var setResult = setcalldataBeforeInterHelp();
            if(setResult == "0") {
            	// 求助模式 1：两方求助；2：三方求助
            	var consultMode = "1";
            	var config = {
            			uri: 'ws/call/internalhelp/',
            			timeout: 20000, // 默认为 20000。如果超时时长不是 20000，则需要传递该参数。
            			requestData: {
            				"opserialNo": _index.serialNumber.getSerialNumber(),
            				"deviceType": deviceType,
            				"dialedDigits": dialedDigits,
            				"consultMode": consultMode
            			}, // 请求参数
            			async: true, // 默认值为 true 异步。如果需要同步，则需要传递该参数为false
            			successCallBack: function (data) { // 成功的回调函数
            				var selectedStaff = staffList.getCheckedRows();
            				var destOperator = selectedStaff[0].STAFFID;
            				var resultMsg;
            				if (data.result == "0") {
            					_index.ctiInit.AudioCallIds.setInnerHelpStaus("1");//设置内部求助成功标识
            					_index.popAlert("内部求助请求发送成功", "内部求助");
            					resultMsg = "内部求助请求发送成功";
            					_index.destroyDialog();
            					// _index.header.communication.recordCallCTILog("ws/call/internalhelp/",{"deviceType":deviceType,"dialedDigits":dialedDigits,"consultMode":consultMode},data,"内部求助成功");
            				} else {
//            					resultMsg = _index.ctiInit.ErrorcodeSearch.ErrorcodeSearch(data.result, "内部求助请求发送失败，错误码：" + data.result);
//            					_index.popAlert(resultMsg, "内部求助");
            					var errorcodeResultMsg=_index.ErrorcodeSearch.errorcodeSearch(data.result);
                                _index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);
            					_index.ctiInit.AudioCallIds.setIsConferenceCallerNo("");//设置三方通话的主叫号码为空
            					// _index.header.communication.recordCallCTILog("ws/call/internalhelp/",{"deviceType":deviceType,"dialedDigits":dialedDigits,"consultMode":consultMode},data,"内部求助失败");
            				}
            				
            				var paramsToProvince = {
            						"resultCode": data.result,
            						"resultMessage": resultMsg,
            						"reserved1": "",
            						"reserved2": "",
            						"reserved3": ""
            				};
            				_index.postMessage.sendToProvince("internalhelp", paramsToProvince);
            				
            				
            				// 记录日志 start
            				var activeSerialNo = _index.CallingInfoMap.getActiveSerialNo();
            				var callingInfo = _index.CallingInfoMap.get(activeSerialNo);
            				var operStatus = ""; //操作状态 0 失败 1 成功
            				var failId = "";
//                        var transMode = "";
            				if(data.result == "0") {
            					operStatus = "1";
            				} else {
            					operStatus = "0";
            					failId = data.result;
            				}
            				
            				var tLog = new transferOutLog(); 
            				tLog.setIsExt(true);
            				tLog.setSerialNo(callingInfo && callingInfo.serialNo ? callingInfo.serialNo : "");
            				tLog.setContactId(callingInfo && callingInfo.contactId ? callingInfo.contactId : "");
            				tLog.setOperator(_index.getUserInfo()['staffId']);
            				tLog.setOperBeginTime(_index.utilJS.getCurrentTime());
            				//tLog.setOperEndTime(_index.utilJS.getCurrentTime());
            				tLog.setOperId("003");
            				tLog.setServiceTypeId(_index.CTIInfo.serviceTypeId);
            				tLog.setStatus(operStatus);
            				tLog.setCallerNo(callingInfo && callingInfo.callerNo ? callingInfo.callerNo : "");
            				tLog.setAccessCode(callingInfo && callingInfo.getCalledNo() ? callingInfo.getCalledNo() : "");
            				tLog.setSubsNumber(callingInfo && callingInfo.subsNumber ? callingInfo.subsNumber : "");
            				tLog.setFailId(failId);
            				tLog.setDestOperator(destOperator);
            				tLog.setFinalStatus(operStatus);
            				tLog.logSavingForTransfer(tLog);
            				// 记录日志 end
            				
            				
            			},
            			errorCallBack: function (jqXHR, textStatus, errorThrown) { // 失败的回调函数
            				_index.popAlert("网络异常，内部求助请求发送失败");
            				var errorParams = {
            						"XMLHttpRequest": jqXHR,
            						"textStatus": textStatus,
            						"errorThrown": errorThrown
            				};
            				_index.ctiInit.AudioCallIds.setIsConferenceCallerNo("");//设置三方通话的主叫号码为空
            				// _index.header.communication.recordCallCTILog("ws/call/internalhelp/",{"deviceType":deviceType,"dialedDigits":dialedDigits,"consultMode":consultMode},errorParams,"网络异常，内部求助失败");
            			}
            	};
            	// 发起调用CTI接口
            	_index.ctiInit.requestCTI.postCTIRequest(config);
            } else {
            	console.log("内部求助前清空随路数据失败");
            }
        }
    
        // 人员列表初始化
        var listInit = function (provinceId) {
            var config = {
                el: $('#jobNumList_transfer', $el),
                field: {
                    key: 'id',
                    boxType: 'checkbox',
                    items: [{
                        text: '业务账号',
                        title: '',
                        name: 'STAFFID',
                        className: 'staffid_jobNumList_signInStatus'
                    }, {
                        text: '状态',
                        name: 'STATUS'
                    }, {
                        text: '对应平台工号',
                        name: 'WORKNO'
                    }],
                },
                data: {
                    url: 'front/sh/media!execute?uid=transfer010'
                }
            }
            staffList = new Compts.List(config);
            
            /*
             * 管理员选定员工时根据员工的状态,自动废掉不可用按钮
             */
            
            var alc=function(){    //全选全不选按钮按钮状态的改变
				$el.on("click","th input:first-child", function(event) {
					var callIdSi = _index.ctiInit.AudioCallIds.getAudioCallIdsSize();
					var holdCallId=_index.ctiInit.AudioCallIds.getHoldCallId();
					if (callIdSi>0&&(holdCallId==undefined||holdCallId=="")) { //当前会话数大于0,并且不是会话保持状态
						enableButtonStatus(["InterHelpAudioComm"]);
						buttonStatus(["InterCallAudioComm"]);
					}else if(holdCallId!=undefined){
						buttonStatus(["InterHelpAudioComm"]);
						enableButtonStatus(["InterCallAudioComm"]);
					}else if(callIdSi<=0||callIdSi==undefined){
						buttonStatus(["InterHelpAudioComm"]);
						enableButtonStatus(["InterCallAudioComm"]);
					}
					if(staffList.getCheckedRows().length>=2){  //如果选中大于2列,只可用发送通知和退出按钮
						buttonStatus(["InterCallAudioComm","InterHelpAudioComm","AuditAudioComm","InsertAudioComm","InterceptAudioComm","ForceBusyAudioComm","ForceDisplayAudioComm","ForceBreakAudioComm","TransferAudioComm","ForceCheckOutAudioComm"]);
					}else{
						enableButtonStatus(["AuditAudioComm","InsertAudioComm","InterceptAudioComm","ForceBusyAudioComm","ForceDisplayAudioComm","ForceBreakAudioComm","TransferAudioComm","ForceCheckOutAudioComm"]);
					}
				});
			}
        	alc();
            
			var allchecked=function(){
				enableButtonStatus(["AuditAudioComm","InsertAudioComm","InterceptAudioComm","ForceBusyAudioComm","ForceDisplayAudioComm","ForceBreakAudioComm","TransferAudioComm","ForceCheckOutAudioComm"]);
			}	
            staffList.on("checkboxChange",function(e,item,checkedStatus){  //为box绑定选中,取消选中事件
	            var callIdSi = _index.ctiInit.AudioCallIds.getAudioCallIdsSize();
	            var holdCallId=_index.ctiInit.AudioCallIds.getHoldCallId();
	            if (callIdSi>0&&(holdCallId==undefined||holdCallId=="")) { //当前会话数大于0,并且不是会话保持状态
	                enableButtonStatus(["InterHelpAudioComm"]);
	                buttonStatus(["InterCallAudioComm"]);
	            }else if(holdCallId!=undefined){
	            	buttonStatus(["InterHelpAudioComm"]);
	            	enableButtonStatus(["InterCallAudioComm"]);
	            }else if(callIdSi<=0||callIdSi==undefined){
	            	buttonStatus(["InterHelpAudioComm"]);
	            	enableButtonStatus(["InterCallAudioComm"]);
	            }
            	
            	var sta=item.STATUS;   //获得选中的status状态值
            	if(checkedStatus==1){  //选中情况下
					if(staffList.getCheckedRows().length>=2){  //如果选中大于2列,只可用发送通知和退出按钮
						buttonStatus(["InterCallAudioComm","InterHelpAudioComm","AuditAudioComm","InsertAudioComm","InterceptAudioComm","ForceBusyAudioComm","ForceDisplayAudioComm","ForceBreakAudioComm","TransferAudioComm","ForceCheckOutAudioComm"]);
            		}else if("空闲"==sta){
						allchecked();
						buttonStatus(["ForceDisplayAudioComm","InsertAudioComm","InterceptAudioComm","AuditAudioComm"]);	
            		}else if("示忙"==sta){
						allchecked();
            			buttonStatus(["InterCallAudioComm","InterHelpAudioComm","ForceBusyAudioComm","InsertAudioComm","InterceptAudioComm","TransferAudioComm","AuditAudioComm","ForceBreakAudioComm"]);	
            		}else if("通话"==sta){
						allchecked();
						buttonStatus(["InterCallAudioComm","InterHelpAudioComm","ForceCheckOutAudioComm","ForceBusyAudioComm","ForceDisplayAudioComm","TransferAudioComm","ForceBreakAudioComm"]);
            		}else if("休息"==sta){
						allchecked();
            			buttonStatus(["InterCallAudioComm","InterHelpAudioComm","AuditAudioComm","InsertAudioComm","InterceptAudioComm","ForceBusyAudioComm","ForceBreakAudioComm","TransferAudioComm"]);
            		}else if("整理"==sta){
						allchecked();
            			buttonStatus(["InterCallAudioComm","InterHelpAudioComm","AuditAudioComm","InsertAudioComm","InterceptAudioComm","ForceBusyAudioComm","TransferAudioComm"]);
            		}
            	}else if(checkedStatus==0){  //取消选中状态
					if(staffList.getCheckedRows().length==0){  //如果全部box取消选中,可用除内部求助以外所有按钮
						allchecked();
            		}else if(staffList.getCheckedRows().length>=2){  //如果选中大于2个box,只可用发送通知和退出按钮
						buttonStatus(["InterCallAudioComm","InterHelpAudioComm","AuditAudioComm","InsertAudioComm","InterceptAudioComm","ForceBusyAudioComm","ForceDisplayAudioComm","ForceBreakAudioComm","TransferAudioComm","ForceCheckOutAudioComm"]);
            		}else if(staffList.getCheckedRows().length==1){  //如果只有一个选中,先重载所有,在不可用部分
						allchecked();
						var statu=staffList.getCheckedRows()[0].STATUS;
						if("空闲"==statu){
            				buttonStatus(["ForceDisplayAudioComm","InsertAudioComm","InterceptAudioComm","AuditAudioComm"]);	
						}else if("示忙"==statu){
							buttonStatus(["InterCallAudioComm","InterHelpAudioComm","ForceBusyAudioComm","InsertAudioComm","InterceptAudioComm","TransferAudioComm","AuditAudioComm"]);	
						}else if("通话"==statu){
							buttonStatus(["InterCallAudioComm","InterHelpAudioComm","ForceCheckOutAudioComm","ForceBusyAudioComm","ForceDisplayAudioComm","TransferAudioComm","ForceBreakAudioComm"]);
						}else if("休息"==statu){
							buttonStatus(["InterCallAudioComm","InterHelpAudioComm","AuditAudioComm","InsertAudioComm","InterceptAudioComm","ForceBusyAudioComm","ForceDisplayAudioComm","ForceBreakAudioComm","TransferAudioComm"]);
						}else if("整理"==statu){
							buttonStatus(["InterCallAudioComm","InterHelpAudioComm","AuditAudioComm","InsertAudioComm","InterceptAudioComm","ForceBusyAudioComm","ForceDisplayAudioComm","TransferAudioComm"]);
						}
            		}
            	}
            });
            
            //初始化时查询
            var status = {
                "status_all": [{
                    "status": "3"
                }, {
                    "status": "4"
                }, {
                    "status": "5"
                }, {
                    "status": "6"
                }, {
                    "status": "7"
                }, {
                    "status": "8"
                }]
            }
            var jsonStatus = JSON.stringify(status);
            var transParam = {
                    "ccid": ccid,
                    "vdnid": vdnid,
                    "ctiid": ctiid,
            		"proviceid" : provinceId,
                	"cityid" : "",
                	"skillid" : "",
                	"status" : jsonStatus,
                	"account" : "",
                	"orgid" : _index.getUserInfo().orgaCode,
                	"isCheckSubOrga" : "1"
            };
            conditionFromCTI(transParam,function(worknoAndStatusAndSkillIdsParam,staffIds){
                    var paramB = {
                        "proviceid": provinceId,
                        "cityid": "",
                        "skillid": "",
                        "status": jsonStatus,
                        "account": "",
                        "orgid": _index.getUserInfo().orgaCode,
                        "worknoAndStatusAndSkillIds": "",
                        "staffIds" : staffIds,
                        "ccid": ccid,
                        "vdnid": vdnid,
                        "ctiid": ctiid,
                        "isCheckSubOrga": "1"
                    };
                    paramB.worknoAndStatusAndSkillIds = worknoAndStatusAndSkillIdsParam;
                    staffList.search(paramB);
            });
        }

        /*
         * //点击按钮实现加1 var upTime=function(){ var
         * time=parseInt($el.find("#refreshTimeId_transfer").val()); var
         * nowTime=$el.find("#refreshTimeId_transfer").val(); nowTime=time+1;
         * $el.find("#refreshTimeId_transfer").val(nowTime); _intervalTime=nowTime;
         * changeTime(); }
         *
         * //点击按钮减1 var downTime=function(){ var
         * time=parseInt($el.find("#refreshTimeId_transfer").val()); if(time>10){
         * var nowTime=$el.find("#refreshTimeId_transfer").val(); nowTime=time-1;
         * $el.find("#refreshTimeId_transfer").val(nowTime); _intervalTime=nowTime;
         * changeTime(); } }
         *
         * //刷新时间改变事件 var changeTime = function(){ window.clearInterval(_oInterval);
         * _intervalTime = $('#refreshTimeId_transfer',$el).val(); intervalQuery(); }
         */
        // 定时刷新列表
        var intervalQuery = function () {

            _oInterval = window.setInterval(searchStaff, _intervalTime * 1000);
        }


        // 下拉列表
        var initForm = function (provinceId) {
            $('#selectStatusId_transfer', $el).change(function () {
                status_value = "";
                status_value = $(this).multipleSelect('getSelects');
            }).multipleSelect({
                width: '100%',
                selectAllText: '全选',
                allSelected: '全选',
                minimumCountSelected: 10
            });
            
            $($('.statusSelect',$el)[1]).mouseleave(function(){
            	$('#selectStatusId_transfer', $el).multipleSelect('close');
            });
            
            // 省份
            
            // 2017.4.5 start
            Util.ajax.postJson("front/sh/media!execute?uid=transfer001",{},function(jsonData,status){
				if(status){
					var provinceArr = jsonData.beans;
					var existFlg = false;
					$.each(provinceArr,function(index,obj) {
						$('#provinceSelect', $el).append("<option value='" + obj.value + "'>" + obj.name + "</option>");
						if(provinceId == obj.value) {
							$('#provinceSelect', $el).val(obj.value);
							existFlg = true;
						}
					});
					if(!existFlg) {
						provinceId = "";
					}
		            if(provinceId == "") {
		            	initCityName(true, "9999");
		            } else {
		            	initCityName(false, provinceId);
		            }
					listInit.call(this,provinceId);
				}
			});
            // 2017.4.5 end
            $('#provinceSelect', $el).change(function (e, valueObj) {
            	var selectedVal = $(this).children('option:selected').val();
            	var selectedName = $(this).children('option:selected').text();
                type = "provice";
                if (selectedName == "请选择") {
                    initCityName(true, "");
                    skillNameByType(true, type);
                } else {
                    initCityName(false, selectedVal);
                    skillNameByType(false, type);
                }
            });

            // 组织机构
            var config = {
                el: $('#orgId_transfer', $el),
                title: '组织机构树',
                label: '组织机构',
                text:_index.getUserInfo().orgaName,
                value: _index.getUserInfo().orgaCode,
                textField:_index.getUserInfo().orgaName,
                valueField:_index.getUserInfo().orgaCode,
                name: 'name',
                url: 'front/sh/media!execute?uid=transfer012'
            };
            selectTree = new Compts.SelectTree(config);
        }

        // 根据条件初始化地市
        var initCityName = function (isDisabled, proviceId) {
            $("#cityId_transfer", $el).off("change", "select");
            $("#cityId_transfer", $el).empty();
            var config = {
                el: $('#cityId_transfer', $el), // 要绑定的容器
                //			label : '地市', // 下拉框单元左侧label文本
                name: 'name', // 下拉框单元右侧下拉框名称
                disabled: isDisabled,
                url: 'front/sh/common!execute?uid=skill002&proviceid=' + proviceId // 数据源
            }
            cityName = new Compts.Select(config);
            cityName.on("change", function (e, valueObj) {
                type = "city";
                if (valueObj.name == "请选择") {
                    skillNameByType(true, type);
                } else {
                    skillNameByType(false, type);
                }
            });
        };

        // 根据类型确定选择什么参数
        var skillNameByType = function (isDisabled, type) {
                // type all全部，provice 省，city市
                var proviceidParam = null;
                var cityIdParm = null;
                if (type == "all") {
                    return skillNameFunction(isDisabled, "", "", ccid, vdnid, ctiid);
                } else if (type == "provice") {
                    proviceidParam = $('#provinceSelect', $el).children('option:selected').val();
                    return skillNameFunction(isDisabled, proviceidParam, "", ccid, vdnid, ctiid);
                } else if (type == "city") {
                    proviceidParam = $('#provinceSelect', $el).children('option:selected').val();
                    cityIdParm = cityName.getSelected().value;
                    return skillNameFunction(isDisabled, proviceidParam, cityIdParm, ccid, vdnid, ctiid);
                }
            }
            // 根据类型返回技能
        var skillNameFunction = function (isDisabled, proviceId, cityId, ccId, vdnId, ctiId) {
            //    	$("#skill_select_transfer").hide();
            $("#skillId_transfer").empty();
            var config = {
                el: $('#skillId_transfer', $el), // 要绑定的容器
                label: '技能', // 下拉框单元左侧label文本
                name: 'name', // 下拉框单元右侧下拉框名称
                disabled: isDisabled,
                url: 'front/sh/media!execute?uid=transfer002&proviceid=' + proviceId + '&cityid=' + cityId + '&ccid=' + ccId + '&vdnid=' + vdnId + '&ctiid=' + ctiId // 数据源
            }
            SkillName = new Compts.Select(config);
        }

        // 获取员工ID和工号集合
        var getWorkNo = function (transParam) {
            var staffIdAndWorkNoArrs = new Array();
            var data = {
                "staffIdsAndWorkNo": ""
            };
            $.ajax({
                type: "POST",
                url: "front/sh/media!execute?uid=transfer006",
                data: transParam,
                async: false,
                success: function (resultJson) {
                    var result = resultJson.beans;
                    var jsonArray = eval(result);
                    var staffId;
                    var workNo;
                    for (var i = 0; i < jsonArray.length; i++) {
                        var staffIdAndWorkNoJson = {
                                "staffId": "",
                                "workNo": ""
                            }
                            // 定义工号和状态的json格式
                        if (jsonArray[i].STAFFID != undefined) {
                            staffIdAndWorkNoJson.staffId = jsonArray[i].STAFFID;
                        }
                        staffIdAndWorkNoJson.workNo = jsonArray[i].WORKNO;
                        staffIdAndWorkNoArrs.push(staffIdAndWorkNoJson);
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
            data.staffIdsAndWorkNo = staffIdAndWorkNoArrs;
            return data;
        }

        // 查询条件（工号和状态和技能）
        var conditionFromCTI = function (transParam,callback) {
            // 入参数据封装
            var workNo;
            var workArr = new Array();
            var tempStaffId;
            var tempStaffArr = new Array();
            var swData = getWorkNo(transParam);
            var array = swData.staffIdsAndWorkNo;
            
            var agentstatusinfoParams = {
                "agentIds": "",
                "ip": ip,
                "port": port,
                "ctiId": ctiid
            }
            for (var i = 0; i < array.length; i++) {
                workNo = array[i].workNo;
                tempStaffId = array[i].staffId;
                var agentIdsArray = {
                    "ccId": ccid,
                    "vdnId": vdnid,
                    "agentId": ""
                }
                var staffAndWorkNos = {
                	"staffId" : "",
                	"workNo" : ""
                };
                if (workNo !== null && workNo !== '') {
                    agentIdsArray.agentId = workNo;
                    workArr.push(agentIdsArray);
                    if (tempStaffId !== null && tempStaffId !== '') {
                    	staffAndWorkNos.staffId = tempStaffId;
                    	staffAndWorkNos.workNo = workNo;
                    	tempStaffArr.push(staffAndWorkNos);
                    }
                }
            }
            var staffIds = {
            	"staffIds" : tempStaffArr 
            };
            if(workArr.length == 0) {
            	$("#jobNumList_transfer tbody",$el).empty();
            	return;
            }
            agentstatusinfoParams.agentIds = JSON.stringify(workArr);
            var data = agentstatusinfoParams;
            var agentId = null;
            var workno = null;
            var status;
            var statusAndStaffIdArray = new Array();
            var worknoAndStatusAndSkillIds = {
                "statusAndSKillIdsArray": ""
            }
            $.ajax({
                type: "POST",
                url: "front/sh/media!execute?uid=transfer007",
                data: data,
//                async: false,
                success: function (resultJson) {
                        var resultMap = resultJson.bean;
                        if (resultMap == "" || resultMap == undefined || resultMap.response == undefined || (resultMap.response && resultMap.response.substring(0, 1) == '<')) {
                            //      					_index.popAlert("初始化信息失败","综合接续");
                            return;
                        }
                        var response = JSON.parse(resultMap.response);
                        if (response.result !== "0") {
                            _index.popAlert("初始化信息失败", "综合接续");
                            return;
                        }
                        var resultSucc = response.resultDatas;
                        var jsonArray = eval(resultSucc);
                        for (var i = 0; i < jsonArray.length; i++) {
                            // 定义工号和状态的json格式
                            var statusAndSkillIds = {
                                "status": "",
                                "skillIds": "",
                                "agentId": ""
                            }
                            var skills = jsonArray[i].serveSkills;
                            if (skills == undefined) {
                                skills = new Array();
                            }
                            // 放入技能
                            var skillIdsAr = new Array();
                            for (var j = 0; j < skills.length; j++) {
                                var skillIdsJson = {
                                    "skillId": ""
                                }
                                skillIdsJson.skillId = skills[j];
                                skillIdsAr.push(skillIdsJson);
                            }
                            statusAndSkillIds.skillIds = skillIdsAr;
                            // 准备状态数据
                            status = jsonArray[i].currentState;
                            switch (status) {
                                // 0：表示话务员未签入==签出。
                            case 0:
                                status = MediaConstants.SEATING_CHECK_OUT;
                                break;
                                // 1：表示话务员空闲==空闲。
                            case 1:
                                status = MediaConstants.SEATING_EMPTY;
                                break;
                                // 2：表示预占用状态==通话。
                            case 2:
                                status = MediaConstants.SEATING_CALLING;
                                break;
                                // 3：表示占用状态==通话。
                            case 3:
                                status = MediaConstants.SEATING_CALLING;
                                break;
                                // 4：表示应答状态==通话。
                            case 4:
                                status = MediaConstants.SEATING_CALLING;
                                break;
                                // 5：表示通话状态==通话。
                            case 5:
                                status = MediaConstants.SEATING_CALLING;
                                break;
                                // 6：表示工作状态==整理。
                            case 6:
                                status = MediaConstants.SEATING_CLEARED;
                                break;
                                // 7：表示忙状态==示忙。
                            case 7:
                                status = MediaConstants.SEATING_BUSY;
                                break;
                                // 8：表示请假休息==休息。
                            case 8:
                                status = MediaConstants.SEATING_OFF;
                                break;
                                // 9：表示学习态。
                            case 9:
                                status = MediaConstants.SEATING_STUDY;
                                break;
                            }
                            // 放入状态
                            statusAndSkillIds.status = status;
                            // 放入工号
                            statusAndSkillIds.agentId = jsonArray[i].agentId;
                            statusAndStaffIdArray.push(statusAndSkillIds);
                        }
                        // 将员工ID和状态的数组添加到json中形成json数组
                        worknoAndStatusAndSkillIds.statusAndSKillIdsArray = statusAndStaffIdArray;
                        var str = JSON.stringify(worknoAndStatusAndSkillIds);
                        if(typeof callback === "function") {
							callback(str,JSON.stringify(staffIds));
						}
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        _index.popAlert("网络异常，初始化信息失败");
                    }
            });
//            var str = JSON.stringify(worknoAndStatusAndSkillIds);
//            return str;
        }

        // 根据条件搜索
        var searchStaff = function () {
			enableButtonStatus(["AuditAudioComm","InsertAudioComm","InterceptAudioComm","ForceBusyAudioComm","ForceDisplayAudioComm","ForceBreakAudioComm","TransferAudioComm","ForceCheckOutAudioComm"]);
                // alert($("#provinceId_transfer").length)
                if ($("#provinceId_transfer").length == 0) {
                    window.clearInterval(_oInterval);
                    return;
                }
                var proviceid = null;
                var cityid = null;
                var skillid = null;
                var status = null;
                var account = null;
                var workno = null;
                var worknoAndStatusA = null;
                proviceid = $('#provinceSelect', $el).children('option:selected').val();
                if (cityName !== null && cityName !== undefined && cityName !== '') {
                    cityid = cityName.getSelected().value;
                }
                if (SkillName !== null && SkillName !== undefined && SkillName !== '') {
                    skillid = SkillName.getSelected().value;
                }
                if (selectTree !== null && selectTree !== undefined && selectTree !== '') {
                	if($.trim($("#orgId_transfer input[type='text']", $el).val()) != '') {
                		orgid_init = $.trim($("#orgId_transfer input[type='hidden']", $el).val());
                	} else {
                		orgid_init = '';
                	}
                }
                /*
                 * if(proviceid==""&&orgid_init==""){ alert("省份和机构请最少选择一个。") }
                 */
                status = $.trim($("#selectStatusId_transfer", $el).val());
                account = $.trim($("#accountId_transfer", $el).val());
                
                // 获取多选下拉框的值
            	var status_param;
            	var statusArr = new Array();
            	for (var m = 0; m < status_value.length; m++) {
            		var ststusJson = {
            				"status": status_value[m]
            		};
            		statusArr.push(ststusJson);
            	}
            	var status_all = {
            			"status_all": statusArr
            	}
            	var len = status_all.status_all.length;
            	if (len == 0) {
            		_index.popAlert("请最少选择一个状态", "综合接续");
            		return
            	}
            	status_param = JSON.stringify(status_all);
            	var isCheckSubOrga = $("#isCheckSubOrga_jobNumListBak option:selected", $el).val();
                
            	//主动点击查询按钮时查询
                var transParam = {
                    "ccid": ccid,
                    "vdnid": vdnid,
                    "ctiid": ctiid,
                	"proviceid" : proviceid,
                	"cityid" : cityid,
                	"skillid" : skillid,
                	"status" : status_param,
                	"account" : account,
                	"orgid" : orgid_init,
                	"isCheckSubOrga" : isCheckSubOrga
                };
                conditionFromCTI(transParam,function(worknoAndStatusAndSkillIdsParam,staffIds) {
                	// 查询参数
                	var paramData = {
                			"proviceid": proviceid,
                			"cityid": cityid,
                			"skillid": skillid,
                			"status": status_param,
                			"account": account,
                			"orgid": orgid_init,
                			"worknoAndStatusAndSkillIds": worknoAndStatusAndSkillIdsParam,
                			"staffIds" : staffIds,
                			"ccid": ccid,
                			"vdnid": vdnid,
                			"ctiid": ctiid,
                			"isCheckSubOrga": isCheckSubOrga
                	};
                	$("div#jobNumList_transfer .checkAllWraper>input").prop("checked",false);
                	staffList.search(paramData);
                });
    			enableButtonStatus(["AuditAudioComm","InsertAudioComm","InterceptAudioComm","ForceBusyAudioComm","ForceDisplayAudioComm","ForceBreakAudioComm","TransferAudioComm","ForceCheckOutAudioComm"]);
    			var callIdSi = _index.ctiInit.AudioCallIds.getAudioCallIdsSize();
				var holdCallId=_index.ctiInit.AudioCallIds.getHoldCallId();
				if (callIdSi>0&&(holdCallId==undefined||holdCallId=="")) { //当前会话数大于0,并且不是会话保持状态
					enableButtonStatus(["InterHelpAudioComm"]);
					buttonStatus(["InterCallAudioComm"]);
				}else if(holdCallId!=undefined){
					buttonStatus(["InterHelpAudioComm"]);
					enableButtonStatus(["InterCallAudioComm"]);
				}else if(callIdSi<=0||callIdSi==undefined){
					buttonStatus(["InterHelpAudioComm"]);
					enableButtonStatus(["InterCallAudioComm"]);
				}
            }
            // 拦截
        var InterceptAudio = function () {
            var workNo;
            var params = staffList.getCheckedRows();
            if (params.length == 0) {
                _index.popAlert("请先选择一个工号", "拦截");
                return;
            } else if (params.length == 1) {
                // alert(params);
                if (params[0].STATUS == "通话") {
                    workNo = params[0].WORKNO;
                } else {
                    _index.popAlert("被拦截座席当前不在通话态", "拦截");
                    return;
                }
            } else if (params.length > 1) {
                _index.popAlert("只能选择一个工号", "拦截");
                return;
            }
            if (ip == undefined || port == undefined) {
                return;
            }
            var param = {
                "opserialNo": _index.serialNumber.getSerialNumber(),
                "targetAgentId": workNo
            };
            var resultInfo = "";

            // 设置参数
            var config = {
                uri: 'ws/quality/intercept/',
                timeout: 20000, // 默认为 20000。如果超时时长不是 20000，则需要传递该参数。
                requestData: param, // 请求参数
                async: false, // 默认值为 true 异步。如果需要同步，则需要传递该参数为false
                successCallBack: function (json) { // 成功的回调函数
                		var selectedStaff = staffList.getCheckedRows();
                    	var destOperator = selectedStaff[0].STAFFID;
                        var resultMsg;
                        if (json.result == "25222") {
                            _index.popAlert("请先插入或旁听后，再拦截", "拦截");
                            resultInfo = "拦截失败";
                            resultMsg = resultInfo;
                        } else if (json.result == "0") {
                            _index.popAlert("拦截成功", "拦截");
                            // disableButtonStatus(["InterceptAudioComm"]);
                            resultInfo = "拦截成功";
                            //_index.ctiInit.AudioCallIds.setIsInInsert(false);
                            
                            _index.ctiInit.AudioCallIds.setSupervisedWorkno("");
                            var supervisedStaff = _index.ctiInit.AudioCallIds.getSupervisedStaffId();
                            _index.ctiInit.AudioCallIds.setSupervisedStaffId("");
                            _index.ctiInit.AudioCallIds.setInsertedWorkno("");
                            var insertedStaff = _index.ctiInit.AudioCallIds.getInsertedStaffId();
                            _index.ctiInit.AudioCallIds.setInsertedStaffId("");
                            $el.find("#auditInsertNotes").html("");
                            $(".ui-dialog-close").trigger("click");
                            // $el.find("#insertBtn_transferComm").val("插入");
                            resultMsg = resultInfo;
                            
                            if(_index.ctiInit.AudioCallIds.getIsInInsert()) {
                            	_index.ctiInit.AudioCallIds.setIsInInsert(false);
                            	// 记录日志 start
                            	var activeSerialNo = _index.CallingInfoMap.getActiveSerialNo();
                            	var callingInfo = _index.CallingInfoMap.get(activeSerialNo);
                            	var operStatus = ""; //操作状态 0 失败 1 成功
                            	var failId = "";
                            	if(json.result == "0") {
                            		operStatus = "1";
//                            		failId = data.result;
                            	} else {
                            		operStatus = "0";
                            		failId = json.result;
                            	}
                            	
                            	var beginT = _index.ctiInit.AudioCallIds.getInsertStartTime();
                            	var endT = _index.utilJS.getCurrentTime();
                            	var destOperator = insertedStaff;
//                            	var duration = (Date.parse(endT) - Date.parse(beginT))/1000;
                            	var duration = (Date.parse(endT.replace('-','/').replace('-','/')) - Date.parse(beginT.replace('-','/').replace('-','/')))/1000;
                            	var mLog = new managementLog(); 
                            	mLog.setIsExt(true);
                            	mLog.setOperator(_index.getUserInfo()['staffId']);
                            	mLog.setOperBeginTime(beginT);
                            	mLog.setOperEndTime(endT);
                            	mLog.setOperDuration(duration);
                            	mLog.setOperId("019");
                            	mLog.setDestOperator(destOperator);
                            	mLog.setStatus(operStatus);
                            	mLog.setServiceTypeId(_index.CTIInfo.serviceTypeId);
                            	mLog.setSerialNo(callingInfo && callingInfo.serialNo ? callingInfo.serialNo : "");
                            	mLog.setContactId(callingInfo && callingInfo.contactId ? callingInfo.contactId : "");
                            	mLog.setCallerNo(callingInfo && callingInfo.callerNo ? callingInfo.callerNo : "");
                            	mLog.setSubsNumber(callingInfo && callingInfo.subsNumber ? callingInfo.subsNumber : "");
                            	mLog.setReasonId(failId);
                            	mLog.logSavingForTransfer(mLog);
                            	// 记录日志 end
                            }
                            
                            if(_index.ctiInit.AudioCallIds.getIsInSupervise()) {
                            	_index.ctiInit.AudioCallIds.setIsInSupervise(false);
                            	// 旁听结果记录日志 start
                            	var activeSerialNo = _index.CallingInfoMap.getActiveSerialNo();
                            	var callingInfo = _index.CallingInfoMap.get(activeSerialNo);
                            	var operStatus = ""; //操作状态 0 失败 1 成功
                            	var failId = "";
                            	if(json.result == "0") {
                            		operStatus = "1";
                            	} else {
                            		operStatus = "0";
                            		failId = json.result;
                            	}
                            	
                            	var beginT = _index.ctiInit.AudioCallIds.getSuperviseStartTime();
                            	var endT = _index.utilJS.getCurrentTime();
                            	var destOperator = supervisedStaff;
//                            	var duration = (Date.parse(endT) - Date.parse(beginT))/1000;
                            	var duration = (Date.parse(endT.replace('-','/').replace('-','/')) - Date.parse(beginT.replace('-','/').replace('-','/')))/1000;
                            	var mLog = new managementLog(); 
                            	mLog.setIsExt(true);
                            	mLog.setOperator(_index.getUserInfo()['staffId']);
                            	mLog.setOperBeginTime(beginT);
                            	mLog.setOperEndTime(endT);
                            	mLog.setOperDuration(duration);
                            	mLog.setOperId("018");
                            	mLog.setDestOperator(destOperator);
                            	mLog.setStatus(operStatus);
                            	mLog.setServiceTypeId(_index.CTIInfo.serviceTypeId);
                            	mLog.setSerialNo(callingInfo && callingInfo.serialNo ? callingInfo.serialNo : "");
                            	mLog.setContactId(callingInfo && callingInfo.contactId ? callingInfo.contactId : "");
                            	mLog.setCallerNo(callingInfo && callingInfo.callerNo ? callingInfo.callerNo : "");
                            	mLog.setSubsNumber(callingInfo && callingInfo.subsNumber ? callingInfo.subsNumber : "");
                            	mLog.setReasonId(failId);
                            	mLog.logSavingForTransfer(mLog);
                            	// 旁听结果记录日志 end
                            }
                            
                        } else {
//                            resultMsg = _index.ctiInit.ErrorcodeSearch.ErrorcodeSearch(json.result, "拦截失败，错误码：" + json.result);
//                            _index.popAlert(resultMsg, "拦截");
                            var errorcodeResultMsg=_index.ErrorcodeSearch.errorcodeSearch(json.result);
                            _index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);
                            resultInfo = "拦截失败";
                        }

                        var paramsToProvince = {
                            "resultCode": json.result,
                            "resultMessage": resultMsg,
                            "reserved1": "",
                            "reserved2": "",
                            "reserved3": ""
                        };
                        _index.postMessage.sendToProvince("intercept", paramsToProvince);
                        
                        // 记录日志 start
                        var activeSerialNo = _index.CallingInfoMap.getActiveSerialNo();
                        var callingInfo = _index.CallingInfoMap.get(activeSerialNo);
                        var operStatus = ""; //操作状态 0 失败 1 成功
                        var failId = "";
                        if(json.result == "0") {
                        	operStatus = "1";
                        } else {
                        	operStatus = "0";
                        	failId = json.result;
                        }
                        
                        var mLog = new managementLog(); 
                        mLog.setIsExt(true);
                        mLog.setOperator(_index.getUserInfo()['staffId']);
                        mLog.setOperBeginTime(_index.utilJS.getCurrentTime());
                        //mLog.setOperEndTime(_index.utilJS.getCurrentTime());
                        mLog.setOperId("024");
                        mLog.setDestOperator(destOperator);
                        mLog.setStatus(operStatus);
                        mLog.setServiceTypeId(_index.CTIInfo.serviceTypeId);
                        mLog.setSerialNo(callingInfo && callingInfo.serialNo ? callingInfo.serialNo : "");
                        mLog.setContactId(callingInfo && callingInfo.contactId ? callingInfo.contactId : "");
                        mLog.setCallerNo(callingInfo && callingInfo.callerNo ? callingInfo.callerNo : "");
                        mLog.setSubsNumber(callingInfo && callingInfo.subsNumber ? callingInfo.subsNumber : "");
                        mLog.setReasonId(failId);
                        mLog.logSavingForTransfer(mLog);
                        // 记录日志 end

                        // _index.header.communication.recordCallCTILog("ws/quality/intercept/",param,json,resultInfo);
                    },
                    errorCallBack: function (jqXHR, textStatus, errorThrown) { // 失败的回调函数
                        var errorParams = {
                            "XMLHttpRequest": jqXHR,
                            "textStatus": textStatus,
                            "errorThrown": errorThrown
                        };
                        _index.popAlert("网络异常，拦截失败", "拦截");
                        // _index.header.communication.recordCallCTILog("ws/quality/intercept/",param,errorParams,"网络异常，拦截失败");
                    }
            };
            // 发起调用
            _index.ctiInit.requestCTI.postCTIRequest(config);
        };

        // 退出功能
        var cancelBtn = function () {
            $(".ui-dialog-close").trigger("click");
            window.clearInterval(_oInterval);
        }

        // 旁听或者停止旁听
        var startAudit = function () {
            var workNo;
            var staffId;
            // var audit=$el.find("#auditBtn_transferComm").html();
            var audit = _index.ctiInit.AudioCallIds.getIsInSupervise();
            if (audit == false) {
                var params = staffList.getCheckedRows();
                if (params.length == 0) {
                    _index.popAlert("请先选择一个工号", "旁听");
                    return;
                } else if (params.length == 1) {

                    workNo = params[0].WORKNO;
                } else if (params.length > 1) {
                    _index.popAlert("只能选择一个工号", "旁听");
                    return;
                }
                staffId = params[0].STAFFID;
                //add by hwx180113提交到ajax调用时，设置标识，因为返回函数和351-7返回速度不稳定，导致351-7中无法使用该方法判断是否处于监听中
                _index.ctiInit.AudioCallIds.setIsInSupervise(true);
                var config = {
                    uri: 'ws/quality/supervise/',
                    timeout: 20000, // 默认为 20000。如果超时时长不是 20000，则需要传递该参数。
                    requestData: {
                        "opserialNo": _index.serialNumber.getSerialNumber(),
                        "targetAgentId": workNo,
                        "flag": "0"
                    }, // 请求参数
                    async: true, // 默认值为 true 异步。如果需要同步，则需要传递该参数为false
                    successCallBack: function (data) { // 成功的回调函数
	                    	var selectedStaff = staffList.getCheckedRows();
	                        var destOperator = selectedStaff[0].STAFFID;
                            var resultMsg;
                            if (data.result == "0") {
//                                alert("旁听成功");
                            	_index.popAlert("旁听成功","旁听");
                                resultMsg = "旁听成功";
                                $el.find("#auditBtn_transferComm").val("停止旁听");
                                // $el.find("#auditBtn_transfer").html("停止旁听");
                                _index.ctiInit.AudioCallIds.setSupervisedWorkno(workNo);
                                _index.ctiInit.AudioCallIds.setSupervisedStaffId(staffId);
                                _index.ctiInit.AudioCallIds.setSuperviseStartTime(_index.utilJS.getCurrentTime());
                                //_index.ctiInit.AudioCallIds.setIsInSupervise(true);
//                                $el.find("#auditInsertNotes").html("<span style='color:red;font-size:16px;'>提示：当前被【旁听】坐席的业务账号为：" + staffId + "，您可直接点击【停止旁听】按钮，结束【旁听】</span>");
                                _index.popAlert("当前被【旁听】坐席的业务账号为：" + staffId, "旁听"); 
                                // _index.header.communication.recordCallCTILog("ws/quality/supervise/",{"targetAgentId":workNo,"flag":"0"},data,"旁听成功");
                            } else {
//                                resultMsg = _index.ctiInit.ErrorcodeSearch.ErrorcodeSearch(data.result, "旁听失败，错误码：" + data.result);
//                                _index.popAlert(resultMsg, "旁听");
                                var errorcodeResultMsg=_index.ErrorcodeSearch.errorcodeSearch(data.result);
                                _index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);
                                //add by hwx180113当返回失败时，设置标识为false
                                _index.ctiInit.AudioCallIds.setIsInSupervise(false);
                                // _index.header.communication.recordCallCTILog("ws/quality/supervise/",{"targetAgentId":workNo,"flag":"0"},data,"旁听失败");
                                // 记录日志 start
                                var activeSerialNo = _index.CallingInfoMap.getActiveSerialNo();
                                var callingInfo = _index.CallingInfoMap.get(activeSerialNo);
                                var operStatus = ""; //操作状态 0 失败 1 成功
                                var failId = "";
                                if(data.result == "0") {
                                	operStatus = "1";
                                } else {
                                	operStatus = "0";
                                	failId = data.result;
                                }
                                
                                var beginT = _index.utilJS.getCurrentTime();
                                var endT = _index.utilJS.getCurrentTime();
//                                var duration = (Date.parse(endT) - Date.parse(beginT))/1000;
                                var duration = (Date.parse(endT.replace('-','/').replace('-','/')) - Date.parse(beginT.replace('-','/').replace('-','/')))/1000;
                                var mLog = new managementLog(); 
                                mLog.setIsExt(true);
                                mLog.setOperator(_index.getUserInfo()['staffId']);
                                mLog.setOperBeginTime(beginT);
                                mLog.setOperEndTime(endT);
                                mLog.setOperDuration(duration);
                                mLog.setOperId("018");
                                mLog.setDestOperator(destOperator);
                                mLog.setStatus(operStatus);
                                mLog.setServiceTypeId(_index.CTIInfo.serviceTypeId);
                                mLog.setSerialNo(callingInfo && callingInfo.serialNo ? callingInfo.serialNo : "");
                                mLog.setContactId(callingInfo && callingInfo.contactId ? callingInfo.contactId : "");
                                mLog.setCallerNo(callingInfo && callingInfo.callerNo ? callingInfo.callerNo : "");
                                mLog.setSubsNumber(callingInfo && callingInfo.subsNumber ? callingInfo.subsNumber : "");
                                mLog.setReasonId(failId);
                                mLog.logSavingForTransfer(mLog);
                                // 记录日志 end
                            }

                            var paramsToProvince = {
                                "resultCode": data.result,
                                "resultMessage": resultMsg,
                                "reserved1": "",
                                "reserved2": "",
                                "reserved3": ""
                            };
                            _index.postMessage.sendToProvince("supervise", paramsToProvince);
                        },
                        errorCallBack: function (jqXHR, textStatus, errorThrown) { // 失败的回调函数
                            var errorParams = {
                                "XMLHttpRequest": jqXHR,
                                "textStatus": textStatus,
                                "errorThrown": errorThrown
                            };
                            _index.popAlert("网络异常，旁听失败", "旁听");
                            //add by hwx180113当返回失败时，设置标识为false
                            _index.ctiInit.AudioCallIds.setIsInSupervise(false);
                            // _index.header.communication.recordCallCTILog("ws/quality/supervise/",{"targetAgentId":workNo,"flag":"0"},errorParams,"网络异常，旁听失败");
                        }
                };
                // 发起调用
                _index.ctiInit.requestCTI.postCTIRequest(config);
            } else if (audit == true) {
                workNo = _index.ctiInit.AudioCallIds.getSupervisedWorkno();
                var config = {
                    uri: 'ws/quality/supervise/',
                    timeout: 20000, // 默认为 20000。如果超时时长不是 20000，则需要传递该参数。
                    requestData: {
                        "opserialNo": _index.serialNumber.getSerialNumber(),
                        "targetAgentId": workNo,
                        "flag": "1"
                    }, // 请求参数
                    async: true, // 默认值为 true 异步。如果需要同步，则需要传递该参数为false
                    successCallBack: function (data) { // 成功的回调函数
                            if (data.result == "0") {
                                _index.popAlert("停止旁听成功", "停止旁听");
                                $el.find("#auditBtn_transferComm").val("旁听");
                                // $el.find("#auditBtn_transfer").html("旁听");
                                // 将被旁听坐席的workNo和staffId缓存起来
                                _index.ctiInit.AudioCallIds.setIsInSupervise(false);
                                _index.ctiInit.AudioCallIds.setSupervisedWorkno("");
                                var supervisedStaff = _index.ctiInit.AudioCallIds.getSupervisedStaffId();
                                _index.ctiInit.AudioCallIds.setSupervisedStaffId("");
                                $el.find("#auditInsertNotes").html("");
                                // _index.header.communication.recordCallCTILog("ws/quality/supervise/",{"targetAgentId":workNo,"flag":"1"},data,"停止旁听成功");
                                
                                // 记录日志 start
                                var activeSerialNo = _index.CallingInfoMap.getActiveSerialNo();
                                var callingInfo = _index.CallingInfoMap.get(activeSerialNo);
                                var operStatus = ""; //操作状态 0 失败 1 成功
                                var failId = "";
                                if(data.result == "0") {
                                	operStatus = "1";
                                } else {
                                	operStatus = "0";
                                	failId = data.result;
                                }
                                
                                var beginT = _index.ctiInit.AudioCallIds.getSuperviseStartTime();
                                var endT = _index.utilJS.getCurrentTime();
                                var destOperator = supervisedStaff;
                                var duration = (Date.parse(endT.replace('-','/').replace('-','/')) - Date.parse(beginT.replace('-','/').replace('-','/')))/1000;
                                var mLog = new managementLog(); 
                                mLog.setIsExt(true);
                                mLog.setOperator(_index.getUserInfo()['staffId']);
                                mLog.setOperBeginTime(beginT);
                                mLog.setOperEndTime(endT);
                                mLog.setOperDuration(duration);
                                mLog.setOperId("018");
                                mLog.setDestOperator(destOperator);
                                mLog.setStatus(operStatus);
                                mLog.setServiceTypeId(_index.CTIInfo.serviceTypeId);
                                mLog.setSerialNo(callingInfo && callingInfo.serialNo ? callingInfo.serialNo : "");
                                mLog.setContactId(callingInfo && callingInfo.contactId ? callingInfo.contactId : "");
                                mLog.setCallerNo(callingInfo && callingInfo.callerNo ? callingInfo.callerNo : "");
                                mLog.setSubsNumber(callingInfo && callingInfo.subsNumber ? callingInfo.subsNumber : "");
                                mLog.setReasonId(failId);
                                mLog.logSavingForTransfer(mLog);
                                // 记录日志 end
                                
                            } else {
//                                var resultMsg = _index.ctiInit.ErrorcodeSearch.ErrorcodeSearch(data.result, "停止旁听失败，错误码：" + data.result);
//                                _index.popAlert(resultMsg, "停止旁听");
                            	var errorcodeResultMsg=_index.ErrorcodeSearch.errorcodeSearch(data.result);
                                _index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);
                                // _index.header.communication.recordCallCTILog("ws/quality/supervise/",{"targetAgentId":workNo,"flag":"1"},data,"停止旁听失败");
                            }
                        },
                        errorCallBack: function (jqXHR, textStatus, errorThrown) { // 失败的回调函数
                            var errorParams = {
                                "XMLHttpRequest": jqXHR,
                                "textStatus": textStatus,
                                "errorThrown": errorThrown
                            };
                            _index.popAlert("网络异常，停止旁听失败", "停止旁听");
                            // _index.header.communication.recordCallCTILog("ws/quality/supervise/",{"targetAgentId":workNo,"flag":"1"},errorParams,"网络异常，停止旁听失败");
                        }
                };
                // 发起调用
                _index.ctiInit.requestCTI.postCTIRequest(config);
            }
        };

        // 插入和停止插入事件
        var insertAudit = function () {
            var workNo;
            var auditInsert = _index.ctiInit.AudioCallIds.getIsInInsert();
            if (auditInsert == false) {
                var params = staffList.getCheckedRows();
                if (params.length == 0) {
                    _index.popAlert("请先选择一个工号", "插入");
                    return;
                } else if (params.length == 1) {
                    if (params[0].STATUS == "通话") {
                        workNo = params[0].WORKNO;
                    } else {
                        _index.popAlert("被插入座席当前不在通话态", "插入");
                        return;
                    }
                } else if (params.length > 1) {
                    _index.popAlert("只能选择一个工号", "插入");
                    return;
                }
                //add by hwx180113提交到ajax调用时，设置标识，因为返回函数和351-7返回速度不稳定，导致351-7中无法使用该方法判断是否处于监听中
                _index.ctiInit.AudioCallIds.setIsInInsert(true);
                var config = {
                    uri: 'ws/quality/insert/',
                    timeout: 20000, // 默认为 20000。如果超时时长不是 20000，则需要传递该参数。
                    requestData: {
                        "opserialNo": _index.serialNumber.getSerialNumber(),
                        "targetAgentId": workNo,
                        "flag": "0"
                    }, // 请求参数
                    async: true, // 默认值为 true 异步。如果需要同步，则需要传递该参数为false
                    successCallBack: function (data) { // 成功的回调函数
	                    	var selectedStaff = staffList.getCheckedRows();
	                        var destOperator = selectedStaff[0].STAFFID;
                            if (data.result == "0") {
                                _index.popAlert("插入成功", "插入");
                                //_index.ctiInit.AudioCallIds.setIsInInsert(true);
                                // 将被插入坐席的workNo和staffId缓存起来
                                _index.ctiInit.AudioCallIds.setInsertedWorkno(workNo);
                                _index.ctiInit.AudioCallIds.setInsertedStaffId(params[0].STAFFID);
                                _index.ctiInit.AudioCallIds.setInsertStartTime(_index.utilJS.getCurrentTime());
                                $el.find("#insertBtn_transferComm").val("停止插入");
                                // $el.find("#auditInsertNotes").html("<span
                                // style='color:red;font-size:16px;'>提示：当前被【插入】坐席的业务账号为："+params[0].STAFFID+"，您可直接点击【停止插入】按钮，结束【插入】</span>");
                                _index.popAlert("当前被【插入】坐席的业务账号为：" + params[0].STAFFID, "插入");
                                //				    		_index.ctiInit.AudioCallIds.recordCallCTILog("ws/quality/insert/",{"targetAgentId":workNo,"flag":"0"},data,"插入成功");
                            } else {
//                                var resultMsg = _index.ctiInit.ErrorcodeSearch.ErrorcodeSearch(data.result, "插入失败，错误码：" + data.result);
//                                _index.popAlert(resultMsg, "插入");
                                var errorcodeResultMsg=_index.ErrorcodeSearch.errorcodeSearch(data.result);
                                _index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);
                                //add by hwx180113当返回失败时，设置标识为false
                                _index.ctiInit.AudioCallIds.setIsInInsert(false);
                                // _index.header.communication.recordCallCTILog("ws/quality/insert/",{"targetAgentId":workNo,"flag":"0"},data,"插入失败");
                                
                                // 记录日志 start
                                var activeSerialNo = _index.CallingInfoMap.getActiveSerialNo();
                                var callingInfo = _index.CallingInfoMap.get(activeSerialNo);
                                var operStatus = ""; //操作状态 0 失败 1 成功
                                var failId = "";
                                if(data.result == "0") {
                                	operStatus = "1";
//                                	failId = data.result;
                                } else {
                                	operStatus = "0";
                                	failId = data.result;
                                }
                                
                                var beginT = _index.utilJS.getCurrentTime();
                                var endT = _index.utilJS.getCurrentTime();
//                                var duration = (Date.parse(endT) - Date.parse(beginT))/1000;
                                var duration = (Date.parse(endT.replace('-','/').replace('-','/')) - Date.parse(beginT.replace('-','/').replace('-','/')))/1000;
                                var mLog = new managementLog(); 
                                mLog.setIsExt(true);
                                mLog.setOperator(_index.getUserInfo()['staffId']);
                                mLog.setOperBeginTime(beginT);
                                mLog.setOperEndTime(endT);
                                mLog.setOperDuration(duration);
                                mLog.setOperId("019");
                                mLog.setDestOperator(destOperator);
                                mLog.setStatus(operStatus);
                                mLog.setServiceTypeId(_index.CTIInfo.serviceTypeId);
                                mLog.setSerialNo(callingInfo && callingInfo.serialNo ? callingInfo.serialNo : "");
                                mLog.setContactId(callingInfo && callingInfo.contactId ? callingInfo.contactId : "");
                                mLog.setCallerNo(callingInfo && callingInfo.callerNo ? callingInfo.callerNo : "");
                                mLog.setSubsNumber(callingInfo && callingInfo.subsNumber ? callingInfo.subsNumber : "");
                                mLog.setReasonId(failId);
                                mLog.logSavingForTransfer(mLog);
                                // 记录日志 end
                                
                            }
                        },
                        errorCallBack: function (jqXHR, textStatus, errorThrown) { // 失败的回调函数
                            var errorParams = {
                                "XMLHttpRequest": jqXHR,
                                "textStatus": textStatus,
                                "errorThrown": errorThrown
                            };
                            _index.popAlert("网络异常，插入失败");
                            //add by hwx180113当返回失败时，设置标识为false
                            _index.ctiInit.AudioCallIds.setIsInInsert(false);
                            // _index.header.communication.recordCallCTILog("ws/quality/insert/",{"targetAgentId":workNo,"flag":"0"},errorParams,"网络异常，插入失败");
                        }
                };
                // 发起调用
                _index.ctiInit.requestCTI.postCTIRequest(config);
            } else if (auditInsert == true) {
                workNo = _index.ctiInit.AudioCallIds.getInsertedWorkno();
                var config = {
                    uri: 'ws/quality/insert/',
                    timeout: 20000, // 默认为 20000。如果超时时长不是 20000，则需要传递该参数。
                    requestData: {
                        "opserialNo": _index.serialNumber.getSerialNumber(),
                        "targetAgentId": workNo,
                        "flag": "1"
                    }, // 请求参数
                    async: true, // 默认值为 true 异步。如果需要同步，则需要传递该参数为false
                    successCallBack: function (data) { // 成功的回调函数
                            if (data.result == "0") {
//                                alert("停止插入成功");
                                _index.popAlert("停止插入成功", "停止插入");
                                _index.ctiInit.AudioCallIds.setIsInInsert(false);
                                $el.find("#insertBtn_transferComm").val("插入");
                                _index.ctiInit.AudioCallIds.setInsertedWorkno("");
                                var insertedStaff = _index.ctiInit.AudioCallIds.getInsertedStaffId();
                                _index.ctiInit.AudioCallIds.setInsertedStaffId("");
                                $el.find("#auditInsertNotes").html("");
                                // _index.header.communication.recordCallCTILog("ws/quality/insert/",{"targetAgentId":workNo,"flag":"1"},data,"停止插入成功");
                                
                                // 记录日志 start
                                var activeSerialNo = _index.CallingInfoMap.getActiveSerialNo();
                                var callingInfo = _index.CallingInfoMap.get(activeSerialNo);
                                var operStatus = ""; //操作状态 0 失败 1 成功
                                var failId = "";
                                if(data.result == "0") {
                                	operStatus = "1";
//                                	failId = data.result;
                                } else {
                                	operStatus = "0";
                                	failId = data.result;
                                }
                                
                                var beginT = _index.ctiInit.AudioCallIds.getInsertStartTime();
                                var endT = _index.utilJS.getCurrentTime();
                                var destOperator = insertedStaff;
//                                var duration = (Date.parse(endT) - Date.parse(beginT))/1000;
                                var duration = (Date.parse(endT.replace('-','/').replace('-','/')) - Date.parse(beginT.replace('-','/').replace('-','/')))/1000;
                                var mLog = new managementLog(); 
                                mLog.setIsExt(true);
                                mLog.setOperator(_index.getUserInfo()['staffId']);
                                mLog.setOperBeginTime(beginT);
                                mLog.setOperEndTime(endT);
                                mLog.setOperDuration(duration);
                                mLog.setOperId("019");
                                mLog.setDestOperator(destOperator);
                                mLog.setStatus(operStatus);
                                mLog.setServiceTypeId(_index.CTIInfo.serviceTypeId);
                                mLog.setSerialNo(callingInfo && callingInfo.serialNo ? callingInfo.serialNo : "");
                                mLog.setContactId(callingInfo && callingInfo.contactId ? callingInfo.contactId : "");
                                mLog.setCallerNo(callingInfo && callingInfo.callerNo ? callingInfo.callerNo : "");
                                mLog.setSubsNumber(callingInfo && callingInfo.subsNumber ? callingInfo.subsNumber : "");
                                mLog.setReasonId(failId);
                                mLog.logSavingForTransfer(mLog);
                                // 记录日志 end
                                
                            
                            } else {
//                                var resultMsg = _index.ctiInit.ErrorcodeSearch.ErrorcodeSearch(data.result, "停止插入失败，错误码：" + data.result);
//                                _index.popAlert(resultMsg, "停止插入");
                            	var errorcodeResultMsg=_index.ErrorcodeSearch.errorcodeSearch(data.result);
                                _index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);
                                // _index.header.communication.recordCallCTILog("ws/quality/insert/",{"targetAgentId":workNo,"flag":"1"},data,"停止插入失败");
                            }
                        },
                        errorCallBack: function (jqXHR, textStatus, errorThrown) { // 失败的回调函数
                            var errorParams = {
                                "XMLHttpRequest": jqXHR,
                                "textStatus": textStatus,
                                "errorThrown": errorThrown
                            };
                            _index.popAlert("网络异常，停止插入失败");
                            // _index.header.communication.recordCallCTILog("ws/quality/insert/",{"targetAgentId":workNo,"flag":"1"},errorParams,"网络异常，停止插入失败");
                        }
                };
                // 发起调用
                _index.ctiInit.requestCTI.postCTIRequest(config);
            }

        };
        // 强制示忙
        var forceBusyAudit = function () {
            var workNo;
            var callerDigits = _index.CTIInfo.workNo;
            var params = staffList.getCheckedRows();
            if (params.length == 0) {
                _index.popAlert("请先选择一个工号", "强制示忙");
                return;
            } else if (params.length == 1) {
                if (params[0].WORKNO == callerDigits) {
                    _index.popAlert("不能对自己进行强制示忙");
                    return;
                }
                if (params[0].STATUS == "示忙") {
                    _index.popAlert("被选择座席当前已为示忙态", "强制示忙");
                    return;
                } else {
                    workNo = params[0].WORKNO;
                }
            } else if (params.length > 1) {
                _index.popAlert("只能选择一个工号", "强制示忙");
                return;
            }

            var config = {
                uri: 'ws/quality/forcechangestate/',
                timeout: 20000, // 默认为 20000。如果超时时长不是 20000，则需要传递该参数。
                requestData: {
                    "opserialNo": _index.serialNumber.getSerialNumber(),
                    "targetAgentId": workNo,
                    "state": "3"
                }, // 请求参数
                async: true, // 默认值为 true 异步。如果需要同步，则需要传递该参数为false
                successCallBack: function (data) { // 成功的回调函数
	                	var selectedStaff = staffList.getCheckedRows();
	                    var destOperator = selectedStaff[0].STAFFID;
                        if (data.result == "0") {
                            _index.popAlert("强制示忙成功", "强制示忙");
                            // _index.header.communication.recordCallCTILog("ws/quality/forcechangestate/",{"targetAgentId":workNo,"flag":"3"},data,"强制示忙成功");
                        } else {
//                            var resultMsg = _index.ctiInit.ErrorcodeSearch.ErrorcodeSearch(data.result, "强制示忙失败，错误码：" + data.result);
//                            _index.popAlert(resultMsg, "强制示忙");
                            var errorcodeResultMsg=_index.ErrorcodeSearch.errorcodeSearch(data.result);
                            _index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);
                            // _index.header.communication.recordCallCTILog("ws/quality/forcechangestate/",{"targetAgentId":workNo,"flag":"3"},data,"强制示忙失败");
                        }
                        
                        // 记录日志 start
                        var activeSerialNo = _index.CallingInfoMap.getActiveSerialNo();
                        var callingInfo = _index.CallingInfoMap.get(activeSerialNo);
                        var operStatus = ""; //操作状态 0 失败 1 成功
                        var failId = "";
                        if(data.result == "0") {
                        	operStatus = "1";
                        } else {
                        	operStatus = "0";
                        	failId = data.result;
                        }
                        
                        var mLog = new managementLog(); 
                        mLog.setIsExt(true);
                        mLog.setOperator(_index.getUserInfo()['staffId']);
                        mLog.setOperBeginTime(_index.utilJS.getCurrentTime());
                        //mLog.setOperEndTime(_index.utilJS.getCurrentTime());
                        mLog.setOperId("014");
                        mLog.setDestOperator(destOperator);
                        mLog.setStatus(operStatus);
                        mLog.setServiceTypeId(_index.CTIInfo.serviceTypeId);
                        mLog.setSerialNo(callingInfo && callingInfo.serialNo ? callingInfo.serialNo : "");
                        mLog.setContactId(callingInfo && callingInfo.contactId ? callingInfo.contactId : "");
                        mLog.setCallerNo(callingInfo && callingInfo.callerNo ? callingInfo.callerNo : "");
                        mLog.setSubsNumber(callingInfo && callingInfo.subsNumber ? callingInfo.subsNumber : "");
                        
                        mLog.setReasonId(failId);
                        mLog.logSavingForTransfer(mLog);
                        // 记录日志 end
                        
                    },
                    errorCallBack: function (jqXHR, textStatus, errorThrown) { // 失败的回调函数
                        var errorParams = {
                            "XMLHttpRequest": jqXHR,
                            "textStatus": textStatus,
                            "errorThrown": errorThrown
                        };
                        _index.popAlert("网络异常，强制示忙失败");
                        // _index.header.communication.recordCallCTILog("ws/quality/forcechangestate/",{"targetAgentId":workNo,"flag":"3"},errorParams,"网络异常，强制示忙失败");
                    }
            };
            // 发起调用
            _index.ctiInit.requestCTI.postCTIRequest(config);
        };

        // 强制示闲
        var forceNoBusyAudit = function () {
            var workNo;
            var callerDigits = _index.CTIInfo.workNo;
            var params = staffList.getCheckedRows();
            if (params.length == 0) {
                _index.popAlert("请先选择一个工号", "强制示闲");
                return;
            } else if (params.length == 1) {
                if (params[0].WORKNO == callerDigits) {
                    _index.popAlert("不能对自己进行强制示闲");
                    return;
                }
                if (params[0].STATUS == "示忙" || params[0].STATUS == "休息" || params[0].STATUS == "整理") {
                    workNo = params[0].WORKNO;
                } else {
                    _index.popAlert("只有示忙、休息、整理态的座席才能执行强制示闲操作", "强制示闲");
                    return;
                }
            } else if (params.length > 1) {
                _index.popAlert("只能选择一个工号", "强制示闲");
                return;
            }
            var config = {
                uri: 'ws/quality/forcechangestate/',
                timeout: 20000, // 默认为 20000。如果超时时长不是 20000，则需要传递该参数。
                requestData: {
                    "opserialNo": _index.serialNumber.getSerialNumber(),
                    "targetAgentId": workNo,
                    "state": "4"
                }, // 请求参数
                async: true, // 默认值为 true 异步。如果需要同步，则需要传递该参数为false
                successCallBack: function (data) { // 成功的回调函数
	                	var selectedStaff = staffList.getCheckedRows();
	                    var destOperator = selectedStaff[0].STAFFID;
                        if (data.result == "0") {
                            _index.popAlert("强制示闲成功", "强制示闲");
                            // _index.header.communication.recordCallCTILog("ws/quality/forcechangestate/",{"targetAgentId":workNo,"flag":"4"},data,"强制示闲成功");
                        } else {
//                            var resultMsg = _index.ctiInit.ErrorcodeSearch.ErrorcodeSearch(data.result, "强制示闲失败，错误码：" + data.result);
//                            _index.popAlert(resultMsg, "强制示闲");
                        	var errorcodeResultMsg=_index.ErrorcodeSearch.errorcodeSearch(data.result);
                            _index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);
                            // _index.header.communication.recordCallCTILog("ws/quality/forcechangestate/",{"targetAgentId":workNo,"flag":"4"},data,"强制示闲失败");
                        }
                        
                        // 记录日志 start
                        var activeSerialNo = _index.CallingInfoMap.getActiveSerialNo();
                        var callingInfo = _index.CallingInfoMap.get(activeSerialNo);
                        var operStatus = ""; //操作状态 0 失败 1 成功
                        var failId = "";
                        if(data.result == "0") {
                        	operStatus = "1";
                        } else {
                        	operStatus = "0";
                        	failId = data.result;
                        }
                        
                        var mLog = new managementLog(); 
                        mLog.setIsExt(true);
                        mLog.setOperator(_index.getUserInfo()['staffId']);
                        mLog.setOperBeginTime(_index.utilJS.getCurrentTime());
                        //mLog.setOperEndTime(_index.utilJS.getCurrentTime());
                        mLog.setOperId("015");
                        mLog.setDestOperator(destOperator);
                        mLog.setStatus(operStatus);
                        mLog.setServiceTypeId(_index.CTIInfo.serviceTypeId);
                        mLog.setSerialNo(callingInfo && callingInfo.serialNo ? callingInfo.serialNo : "");
                        mLog.setContactId(callingInfo && callingInfo.contactId ? callingInfo.contactId : "");
                        mLog.setCallerNo(callingInfo && callingInfo.callerNo ? callingInfo.callerNo : "");
                        mLog.setSubsNumber(callingInfo && callingInfo.subsNumber ? callingInfo.subsNumber : "");
                        mLog.setReasonId(failId);
                        mLog.logSavingForTransfer(mLog);
                        // 记录日志 end
                        
                    },
                    errorCallBack: function (jqXHR, textStatus, errorThrown) { // 失败的回调函数
                        var errorParams = {
                            "XMLHttpRequest": jqXHR,
                            "textStatus": textStatus,
                            "errorThrown": errorThrown
                        };
                        _index.popAlert("网络异常，强制示闲失败");
                        // _index.header.communication.recordCallCTILog("ws/quality/forcechangestate/",{"targetAgentId":workNo,"flag":"4"},errorParams,"网络异常，强制示闲失败");
                    }
            };
            // 发起调用
            _index.ctiInit.requestCTI.postCTIRequest(config);
        };
        // 强制休息
        var forceBreakAudit = function () {
            var workNo;
            var callerDigits = _index.CTIInfo.workNo;
            var params = staffList.getCheckedRows();
            if (params.length == 0) {
                _index.popAlert("请先选择一个工号", "强制休息");
                return;
            } else if (params.length == 1) {
            	if (params[0].WORKNO == callerDigits) {
                    _index.popAlert("不能对自己进行强制休息");
                    return;
                }
                if (params[0].STATUS == "休息") {
                    _index.popAlert("被选座席已是休息态", "强制休息");
                    return;
                } else {
                    workNo = params[0].WORKNO;
                }
            } else if (params.length > 1) {
                _index.popAlert("只能选择一个工号", "强制休息");
                return;
            }
            var config = {
                uri: 'ws/quality/forcechangestate/',
                timeout: 20000, // 默认为 20000。如果超时时长不是 20000，则需要传递该参数。
                requestData: {
                    "opserialNo": _index.serialNumber.getSerialNumber(),
                    "targetAgentId": workNo,
                    "state": "8"
                }, // 请求参数
                async: true, // 默认值为 true 异步。如果需要同步，则需要传递该参数为false
                successCallBack: function (data) { // 成功的回调函数
	                	var selectedStaff = staffList.getCheckedRows();
	                    var destOperator = selectedStaff[0].STAFFID;
                        if (data.result == "0") {
                            _index.popAlert("强制休息成功", "强制休息");
                            // _index.header.communication.recordCallCTILog("ws/quality/forcechangestate/",{"targetAgentId":workNo,"flag":"8"},data,"强制休息成功");
                        } else {
//                            var resultMsg = _index.ctiInit.ErrorcodeSearch.ErrorcodeSearch(data.result, "强制休息失败，错误码：" + data.result);
//                            _index.popAlert(resultMsg, "强制休息失败");
                        	var errorcodeResultMsg=_index.ErrorcodeSearch.errorcodeSearch(data.result);
                            _index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);
                            // _index.header.communication.recordCallCTILog("ws/quality/forcechangestate/",{"targetAgentId":workNo,"flag":"8"},data,"强制休息失败");
                        }
                        
                        // 记录日志 start
                        var activeSerialNo = _index.CallingInfoMap.getActiveSerialNo();
                        var callingInfo = _index.CallingInfoMap.get(activeSerialNo);
                        var operStatus = ""; //操作状态 0 失败 1 成功
                        var failId = "";
                        if(data.result == "0") {
                        	operStatus = "1";
                        } else {
                        	operStatus = "0";
                        	failId = data.result;
                        }
                        
                        var mLog = new managementLog(); 
                        mLog.setIsExt(true);
                        mLog.setOperator(_index.getUserInfo()['staffId']);
                        mLog.setOperBeginTime(_index.utilJS.getCurrentTime());
                        //mLog.setOperEndTime(_index.utilJS.getCurrentTime());
                        mLog.setOperId("017");
                        mLog.setDestOperator(destOperator);
                        mLog.setStatus(operStatus);
                        mLog.setServiceTypeId(_index.CTIInfo.serviceTypeId);
                        mLog.setSerialNo(callingInfo && callingInfo.serialNo ? callingInfo.serialNo : "");
                        mLog.setContactId(callingInfo && callingInfo.contactId ? callingInfo.contactId : "");
                        mLog.setCallerNo(callingInfo && callingInfo.callerNo ? callingInfo.callerNo : "");
                        mLog.setSubsNumber(callingInfo && callingInfo.subsNumber ? callingInfo.subsNumber : "");
                        mLog.setReasonId(failId);
                        mLog.logSavingForTransfer(mLog);
                        // 记录日志 end
                        
                    },
                    errorCallBack: function (jqXHR, textStatus, errorThrown) { // 失败的回调函数
                        var errorParams = {
                            "XMLHttpRequest": jqXHR,
                            "textStatus": textStatus,
                            "errorThrown": errorThrown
                        };
                        _index.popAlert("网络异常，强制休息失败失败");
                        // _index.header.communication.recordCallCTILog("ws/quality/forcechangestate/",{"targetAgentId":workNo,"flag":"8"},errorParams,"网络异常，强制休息失败");
                    }
            };
            // 发起调用
            _index.ctiInit.requestCTI.postCTIRequest(config);
        };

        // 强制签出
        var forceCheckAudit = function () {
            var workNo;
            var params = staffList.getCheckedRows();
            var callerDigits = _index.CTIInfo.workNo;
            if (params.length == 0) {
                _index.popAlert("请先选择一个工号", "强制签出");
                return;
            } else if (params.length == 1) {
                if (params[0].WORKNO == callerDigits) {
                    _index.popAlert("不能对自己进行强制签出");
                    return;
                } else {
                    workNo = params[0].WORKNO;
                }
            } else if (params.length > 1) {
                _index.popAlert("只能选择一个工号", "强制签出");
                return;
            }
            var config = {
                uri: 'ws/quality/forcechangestate/',
                timeout: 20000, // 默认为 20000。如果超时时长不是 20000，则需要传递该参数。
                requestData: {
                    "opserialNo": _index.serialNumber.getSerialNumber(),
                    "targetAgentId": workNo,
                    "state": "2"
                }, // 请求参数
                async: true, // 默认值为 true 异步。如果需要同步，则需要传递该参数为false
                successCallBack: function (data) { // 成功的回调函数
	                	var selectedStaff = staffList.getCheckedRows();
	                    var destOperator = selectedStaff[0].STAFFID;
                        if (data.result == "0") {
                            _index.popAlert("强制签出成功", "强制签出");
                            // _index.header.communication.recordCallCTILog("ws/quality/forcechangestate/",{"targetAgentId":workNo,"flag":"2"},data,"强制签出成功");
                        } else {
//                            var resultMsg = _index.ctiInit.ErrorcodeSearch.ErrorcodeSearch(data.result, "强制签出失败失败，错误码：" + data.result);
//                            _index.popAlert(resultMsg, "强制签出失败");
                        	var errorcodeResultMsg=_index.ErrorcodeSearch.errorcodeSearch(data.result);
                            _index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);
                            // _index.header.communication.recordCallCTILog("ws/quality/forcechangestate/",{"targetAgentId":workNo,"flag":"2"},data,"强制签出失败");
                        }
                        
                        // 记录日志 start
                        var activeSerialNo = _index.CallingInfoMap.getActiveSerialNo();
                        var callingInfo = _index.CallingInfoMap.get(activeSerialNo);
                        var operStatus = ""; //操作状态 0 失败 1 成功
                        var failId = "";
                        if(data.result == "0") {
                        	operStatus = "1";
                        } else {
                        	operStatus = "0";
                        	failId = data.result;
                        }
                        
                        var mLog = new managementLog(); 
                        mLog.setIsExt(true);
                        mLog.setOperator(_index.getUserInfo()['staffId']);
                        mLog.setOperBeginTime(_index.utilJS.getCurrentTime());
                        //mLog.setOperEndTime(_index.utilJS.getCurrentTime());
                        mLog.setOperId("016");
                        mLog.setDestOperator(destOperator);
                        mLog.setStatus(operStatus);
                        mLog.setServiceTypeId(_index.CTIInfo.serviceTypeId);
                        mLog.setSerialNo(callingInfo && callingInfo.serialNo ? callingInfo.serialNo : "");
                        mLog.setContactId(callingInfo && callingInfo.contactId ? callingInfo.contactId : "");
                        mLog.setCallerNo(callingInfo && callingInfo.callerNo ? callingInfo.callerNo : "");
                        mLog.setSubsNumber(callingInfo && callingInfo.subsNumber ? callingInfo.subsNumber : "");
//                        mLog.setSubsNumber(callingInfo.subsNumber);
                        
                        mLog.setReasonId(failId);
                        mLog.logSavingForTransfer(mLog);
                        // 记录日志 end
                        
                    },
                    errorCallBack: function (jqXHR, textStatus, errorThrown) { // 失败的回调函数
                        var errorParams = {
                            "XMLHttpRequest": jqXHR,
                            "textStatus": textStatus,
                            "errorThrown": errorThrown
                        };
                        _index.popAlert("网络异常，强制签出失败");
                        // _index.header.communication.recordCallCTILog("ws/quality/forcechangestate/",{"targetAgentId":workNo,"flag":"2"},errorParams,"网络异常，强制签出失败");
                    }
            };
            /** 强制签出前先判断对方状态start */
            var workArr = new Array();
            var agentstatusinfoParams = {
                "agentIds": "",
                "ip": ip,
                "port": port,
                "ctiId": ctiid
            }
            var agentIdsArray = {
                "ccId": ccid,
                "vdnId": vdnid,
                "agentId": workNo
            }
            workArr.push(agentIdsArray);
            agentstatusinfoParams.agentIds = JSON.stringify(workArr);
            var data = agentstatusinfoParams;
            $.ajax({
                type: "POST",
                url: "front/sh/media!execute?uid=transfer007",
                data: data,
                async: false,
                tomeout: 10000,
                success: function (resultJson) {
                        var resultMap = resultJson.bean;
                        if (resultMap == "" || resultMap == undefined) {
                            _index.popAlert("强制签出失败", "综合接续");
                            return;
                        }
                        var response = JSON.parse(resultMap.response);
                        if (response.result !== "0") {
                            _index.popAlert("强制签出失败", "综合接续");
                            return;
                        }
                        var resultSucc = response.resultDatas;
                        var jsonArray = eval(resultSucc);
                        for (var i = 0; i < jsonArray.length; i++) {
                            // 准备状态数据
                            var status = jsonArray[i].currentState;
                            if (status == '5') {
                                _index.popAlert("被签出坐席正在通话，不能进行强制签出。");
                                return;
                            } else {
                                // 发起调用
                                _index.ctiInit.requestCTI.postCTIRequest(config);
                            }
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        _index.popAlert("强制签出失败");
                        return;
                    }
            });
            /** 强制签出前先判断对方状态end */
        };
        // 发送通知 by yujiaoli ywx224989 20160621 start
        var sendNotes = function () {
        	if(sendNoteBtnSta) {
        		var workNo;
        		var ccId = _index.CTIInfo.CCID;
        		var vdnId = _index.CTIInfo.VDNVDNId;
        		var checkedRows = staffList.getCheckedRows();
        		if (checkedRows.length == 0) {
        			_index.popAlert("请先至少选择一个工号", "发送通知");
        			return;
        		}
        		var parmas = "";
        		var sender = _index.getUserInfo().staffId;
        		var receiver = "";
        		var lengthRows = checkedRows.length;
        		for (var i = 0; i < lengthRows; i++) {
        			// 选中的用户是当前用户，则不发送
        			if (sender == checkedRows[i].STAFFID) {
        				receiver = i;
        				continue;
        			}
        			var parma = "{'staffId':'" + checkedRows[i].STAFFID + "'," +
        			"'staffName':'" + checkedRows[i].STAFFNAME + "'," +
        			"'agentId':'" + checkedRows[i].WORKNO + "'," +
        			"'ccId':'" + ccId + "'," +
        			"'vdnId':'" + vdnId + "'}";
        			parmas = parma + "," + parmas;
        		}
        		// 判断是否通知接收人是否存在
        		if (!parmas) {
        			// 选中有用户且用户只有1个还与登录用户相同则提示用户不能给自己发送通知
        			if (checkedRows && sender == checkedRows[0].STAFFID) {
        				_index.popAlert("不能给自己发送通知", "发送通知");
        				return;
        			}
        			_index.popAlert("未获取到正确的接受通知的坐席", "发送通知");
        			return;
        		}
        		parmas = parmas.substring(0, parmas.length - 1);
        		if (ip == undefined || port == undefined) {
        			return;
        		}
        		if (receiver != "" && lengthRows == 2) {
        			receiver = checkedRows[1 - receiver].STAFFID;
        		} else if (lengthRows == 1) {
        			receiver = checkedRows[0].STAFFID;
        		} else {
        			receiver = _index.serialNumber.getSerialNumber();
        		}
        		
        		$('.jobNumMainDiv').slideUp(1000);
        		$('.jobNumNotifyDiv').slideDown(1000);
        		$("#SendMsgAudioComm", $el).children("input:first").attr({
                    "value": "返回列表"
                });
        		sendNoteBtnSta = false;
        		require(['js/comMenu/comprehensiveCommunication/sendNotes/sendNotes'], function (SendNotes) {
        			var sendNotes = new SendNotes(_index, parmas);
        			setTimeout($.proxy(function (e) {
        				$(".jobNumNotifyDiv").html(sendNotes.content);
        			}, this), 200);
        		});
        	} else {
        		$('.jobNumMainDiv').slideDown(1000);
        		$('.jobNumNotifyDiv').slideUp(1000);
        		$("#SendMsgAudioComm", $el).children("input:first").attr({
                    "value": "发送通知"
                });
        		sendNoteBtnSta = true;
        	}
        
        };
        // 发送通知 by yujiaoli ywx224989 20160621 end
        return initialize;
    });