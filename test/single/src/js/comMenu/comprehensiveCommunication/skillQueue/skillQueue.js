/**
 *
 * 技能队列
 */
define(['Util',
        'Compts',
        '../../../index/constants/mediaConstants',
        '../../../callHandle/callingInfoMap/CallingInfo',
        '../../../log/transferOutLog',
        '../../../../tpl/comMenu/comprehensiveCommunication/skillQueue/skillQueue.tpl',
        '../../../../assets/css/comMenu/comprehensiveCommunication/skillQueue/skillQueue.css'
    ],
    function (Util, Compts, Constants, CallingInfo, transferOutLog, skillQueue) {

        var _index = null, CTIID = null, $el = null, _option = null, cityName = null, skillCityList = null,
        type = null, ccid = null, vdnid = null, ctiid = null, isDefault = null, ip = null, port = null, setcalldatas = null,
        transouts = null, ctiMediaTypeId = null, _callingInfo = new CallingInfo(), lastNo = null, provinceId = null;

        var initialize = function (indexModule, options) {
            $el = $(skillQueue);
            _index = indexModule;
            _option = options;
            CTIID = _index.CTIInfo.CTIId;
            ctiid = _index.CTIInfo.CTIId;
            ccid = _index.CTIInfo.CCID;
            vdnid = _index.CTIInfo.VDNVDNId;
            provinceId = _index.getUserInfo().provinceId;
            
            isDefault = _index.CTIInfo.isDefault; // 缺省业务标志值
            
            var proxyIp = _index.CTIInfo.ProxyIP, proxyPort = _index.CTIInfo.ProxyPort, directIp = _index.CTIInfo.IP, directPort = _index.CTIInfo.port;
            
            if (isDefault == "1") { 
                ip = proxyIp;
                port = proxyPort;
            } else {
                ip = directIp;
                port = directPort;
            }

            initButtonAuthority.call(this);
            // 初始化点击事件
            initEvent.call(this);
            // 初始化下拉列表
            initForm.call(this,provinceId);
            // 列表
//            listInit.call(this);
            /*
            require(['js/comMenu/comprehensiveCommunication/btnAuthority/btnAuthority'], function (Authority) {
                // 把当前模板传入，框架js，js会找到当前模板中的所有具有mo属性的按钮
                new Authority($el);
            })
            */
            this.content = $el;
        };

        // 初始化按钮展示设置
        var initButtonAuthority = function () {
            // 判断签入CTI状态，是否签入(后面会加判断是否还签入了语音)
        	enableButtonStatus(["InterHelpAudioSkill"]);
            var signStatus = _index.CTIInfo.signIn;
            if (signStatus == "true") {
                var signAudioStatus = _index.CTIInfo.audioType;
                if (signAudioStatus == null || signAudioStatus == "" || signAudioStatus == undefined) { // 没签入语音
                    // disableButtonStatus(["TransferSkill"]);
                } else {
                    // 当前是否有语音会话被保持
                    var callIdSize = _index.ctiInit.AudioCallIds
                        .getAudioCallIdsSize();
                    if (callIdSize < 1) {
                    	buttonStatus(["InterHelpAudioSkill"])
                    }
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

        // 禁用按钮状态
        var disableButtonStatus = function (varArr) {
                if (varArr.length > 0) {
                    for (var i = 0; i < varArr.length; i++) {
                        $('#' + varArr[i], $el).attr('class', 'disabled')
                            .children("input:first").attr({
                                "disabled": true
                            }).css({
                                "background": "#fff",
                                "color": "gray",
                                "border": "1px solid lightgray",
                                "cursor": "auto"
                            });
                    }
                }
            }
            // 启用按钮状态
        var enableButtonStatus = function (varArr) {
                if (varArr.length > 0) {
                    for (var i = 0; i < varArr.length; i++) {
                        $('#' + varArr[i], $el).attr('class', 'enable')
                            .css("display", "inline")
                            .children("input:first").attr({
                                "disabled": false
                            }).css({
                                "background": "#0085D0",
                                "color": "white",
                                "cursor": "pointer"
                            });
                    }
                }
            }
            // 初始化点击按钮
        var initEvent = function () {
            $el.on('click', '#cancelBtn_skillQueComm', $.proxy(cancelBtn,
                this));

            // 内部求助
            $el.on('click', '#interHelpBtn_skillQueComm', $.proxy(
                interHelp, this));

            $("#transferBtn_skillQueComm", $el).unbind();
            $("#transferBtn_skillQueComm", $el).bind("click", transferBtn);
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
                sign_url = Constants.CCACSURL + ip + ":" + port + "/ccacs/" + ctiid + "/ws/call/setcalldata";
            } else {
                sign_url = Constants.CCACSURL + ip + ":" + port + "/ccacs/ws/call/setcalldata"; //跨域直连
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
        
        // 内部求助--技能队列
        var interHelp = function () {
            // 目的设备类型。1：技能队列；2：座席；
            var deviceType = '1';
            // 被求助的设备地址,此处为技能id（skillId）
            var dialedDigits = '';
            var params = skillCityList.getSelected();
            if (params == '' || params == undefined) {
                _index.popAlert("请先选择一个队列", "内部求助");
                return;
            } else {
                dialedDigits = skillCityList.getSelected().value;
                //获取与用户通话的callingInfo
                var activeSerialNo = _index.CallingInfoMap.getActiveSerialNo();
        		var callingInfoTemp = _index.CallingInfoMap.get(activeSerialNo);//获取callingInfo
                _index.ctiInit.AudioCallIds.setIsConferenceCallerNo(callingInfoTemp.getCallerNo());//设置三方通话的主叫号码
            }
            
            var setResult = setcalldataBeforeInterHelp();
            if(setResult == "0") {
            	// 求助模式。1：两方求助；2：三方求助
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
            				var resultMsg;
            				if (data.result == "0") {
            					//存储呼叫类型 start
            					_index.ctiInit.AudioCallIds.setCallFeature("3");//内部求助3
            					 //存储呼叫类型 end
            					_index.popAlert("内部求助请求发送成功", "内部求助");
            					resultMsg = "内部求助请求发送成功";
            					_index.destroyDialog();
            				} else {
//            					resultMsg = _index.ctiInit.ErrorcodeSearch.ErrorcodeSearch(data.result, "内部求助请求发送失败,错误码：" + data.result);
//            					_index.popAlert(resultMsg, "内部求助");
            					var errorcodeResultMsg=_index.ErrorcodeSearch.errorcodeSearch(data.result);
            			         _index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode); 
            					_index.ctiInit.AudioCallIds.setIsConferenceCallerNo("");//设置三方通话的主叫号码为空
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
            				tLog.setOperEndTime(_index.utilJS.getCurrentTime());
            				tLog.setOperId("003");
            				tLog.setServiceTypeId(_index.CTIInfo.serviceTypeId);
            				tLog.setStatus(operStatus);
            				tLog.setCallerNo(callingInfo && callingInfo.callerNo ? callingInfo.callerNo : "");
            				tLog.setSubsNumber(callingInfo && callingInfo.subsNumber ? callingInfo.subsNumber : "");
            				tLog.setFailId(failId);
            				tLog.setFinalStatus(operStatus);
            				tLog.setAccessCode(callingInfo && callingInfo.getCalledNo() ? callingInfo.getCalledNo() : "");
            				tLog.setDestSkillId(skillCityList.getSelected().value);
            				tLog.setDestSkillName(skillCityList.getSelected().name);
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
            			}
            	};
            	// 发起调用
            	_index.ctiInit.requestCTI.postCTIRequest(config);
            } else {
            	console.log("内部求助前清空随路数据失败");
            }
            
        };
        // 取消功能
        var cancelBtn = function () {
            $(".ui-dialog-close").trigger("click");
        }

        // 初始化人员信息list
        var listInit = function (provinceId) {
            var activeSerialNo = _index.CallingInfoMap.getActiveSerialNo();
            var callingInfo = _index.CallingInfoMap.get(activeSerialNo);
            var mediaType = callingInfo ? callingInfo.getMediaType() : ""; // 20161207添加为空判断
            // by
            // zhangyusong
            var data_mes003 = {
                "mediaTypeId": mediaType
            }
            var url_mes003 = "front/sh/media!execute?uid=mes003";
            if (mediaType) {
                $.ajax({
                    type: "POST",
                    url: url_mes003,
                    data: data_mes003,
                    async: false,
                    success: function (resultJson) {
                        ctiMediaTypeId = resultJson.bean.ctiMediaTypeId;
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

            ctiMediaTypeId = ctiMediaTypeId ? ctiMediaTypeId : "";

            var config = {
                el: $('#skillList_skillQue', $el),
                field: {
                    key: 'id',
                    boxType: 'radio',
                    items: [{
                        text: '编号',
                        name: 'NO'
                    }, {
                        text: '技能队列名称',
                        name: 'name'
                    }, {
                        text: '技能队列描述',
                        name: 'skillDesc'
                    }, {
                        text: '等待数',
                        name: 'waitingNum'
                    }]
                },
                data: {
                    url: 'front/sh/media!execute?uid=transfer002'
                }
            }
            skillCityList = new Compts.List(config);
            if(provinceId == "") {
            	type = "all";
            } else {
            	type = "default"; //按员工默认省份过滤
            }
            var param = conditionSearch(type);
            skillCityList.search(param);

            skillCityList.on('rowClick', function (e, item) {
            	if(lastNo != "" && lastNo != undefined && lastNo != null) {
                	$el.find("#skillList_skillQue").find("div.sn-list-content").find("tr").eq(lastNo-1).find("td").eq(3).html("");
                }
                var skillIds = {
                    "ccId": ccid,
                    "vdnId": vdnid,
                    "skillId": skillCityList.getSelected().value
                };
                var skillArr = new Array();
                skillArr.push(skillIds);
                var towData = {
                    "ip": ip,
                    "port": port,
                    "ctiId": ctiid,
                    "skillIds": JSON.stringify(skillArr),
                    "isDefault": isDefault
                };
                Util.ajax.postJson("front/sh/transfer!execute?uid=transfer005", towData, function (resultData, state) {
                    if (state) {
                        var queueSize = 0;
                        if (resultData.beans[0] && !isNaN(resultData.beans[0].queueSize)) {
                            queueSize = resultData.beans[0].queueSize;
                        }
                        
                        var data = skillCityList.getSelected();
                        $el.find("#skillList_skillQue").find("div.sn-list-content").find("tr").eq(data.NO-1).find("td").eq(3).html(queueSize);
                        lastNo = data.NO;
                    } else {
                    	return;
                    }
                });
            });

        };

        // 初始化下拉框
        var initForm = function (provinceId) {
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
            
            $('#provinceSelect', $el).change(function() {
            	var selectedVal = $(this).children('option:selected').val();
            	var selectedName = $(this).children('option:selected').text();
            	lastNo = "";
                type = "province";
                var param = conditionSearch(type);
                skillCityList.search(param);
                if (selectedName == "请选择") {
                    initCityName(true, "");
                } else {
                    initCityName(false, selectedVal);
                }
            });
        }

        // 根据条件初始化地市
        var initCityName = function (isDisabled, proviceId) {
            $("#cityId_skillQue", $el).off("change", "select");
            $("#cityId_skillQue", $el).empty();
            var config = {
                el: $('#cityId_skillQue', $el), // 要绑定的容器
                name: 'name', // 下拉框单元右侧下拉框名称
                disabled: isDisabled,
                url: 'front/sh/common!execute?uid=skill002&proviceid=' + proviceId // 数据源
            }
            cityName = new Compts.Select(config);

            cityName.on("change", function (e, valueObj) {
            	lastNo = "";
                type = "city";
                var param = conditionSearch(type);
                skillCityList.search(param);
            });

        };

        // 根据条件搜索
        var conditionSearch = function (type) {
            var params;
            if (type == "all") { // 查询全部
                params = {
                    "ccid": ccid,
                    "vdnid": vdnid,
                    "mediaType": ctiMediaTypeId,
                    "ctiid": ctiid
                }
            } else if (type == "province") { // 按照省份查询
                params = {
                    "proviceid": $('#provinceSelect', $el).children('option:selected').val(),
                    "ccid": ccid,
                    "vdnid": vdnid,
                    "mediaType": ctiMediaTypeId,
                    "ctiid": ctiid
                }
            } else if (type == "city") { // 按照省市查询
                params = {
                    "proviceid": $('#provinceSelect', $el).children('option:selected').val(),
                    "cityid": cityName.getSelected().value,
                    "mediaType": ctiMediaTypeId,
                    "ccid": ccid,
                    "vdnid": vdnid,
                    "ctiid": ctiid
                }
            } else if (type == "default") { //按照员工默认省份进行过滤
            	params = {
                        "proviceid": $('#provinceSelect', $el).children('option:selected').val(),
                        "ccid": ccid,
                        "vdnid": vdnid,
                        "mediaType": ctiMediaTypeId,
                        "ctiid": ctiid
                }
            }
            return params;
        };

        // 转接功能
        var transferBtn = function (event) {
        	var transferStartTime = _index.utilJS.getCurrentTime();
            // 防止冒泡事件
            event.stopPropagation();

            // 技能id（skillId）
            var inner = "";
            var params = skillCityList.getSelected();
            if (params == '' || params == undefined) {
                _index.popAlert("请先选择一个技能队列");
                return;
            } else {
                inner = skillCityList.getSelected().value;
            }

            $("#transferBtn_skillQueComm").attr({
                "disabled": "disabled"
            });
            $("#transferBtn_skillQueComm").removeClass("btn-blue");
            $("#transferBtn_skillQueComm").addClass("btn_skillQue");
            // 设置呼叫数据接口返回结果
            setcalldata();
            if (setcalldatas == "0") {
                transout();
                // 设置转接日志数据
                var currentTime = _index.utilJS.getCurrentTime();
                var staffID = _index.getUserInfo()['staffId'];
                var mode = $(
                        '#transferId_skillQue input[name="transfer"]:checked ')
                    .val();
                var msg = $.trim($el.find("#notesId_skillQue").val());
                // 将转接数据放入callInfo
                var activeSerialNo = _index.CallingInfoMap
                    .getActiveSerialNo();
                _callingInfo = _index.CallingInfoMap.get(activeSerialNo);
                if (_callingInfo != null) {
                    _callingInfo.setTransferTime(currentTime);
                    _callingInfo.setTransferType("1");
                    _callingInfo.setTransferInner(inner);
                    _callingInfo.setTransferMode(mode);
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
                if(mode == "0") { //释放转
                	transMode = "1";
                	//设置挂机方为坐席 start
                	_callingInfo.setReleaseType(Constants.RELEASETYPE_OPERATOR); 
                	//设置挂机方为坐席 end
                } else if(mode == "2") { //成功转
                	transMode = "2";
                }
                
                var tLog = new transferOutLog(); 
                var sourceSkillName ;
                var sourceSkillId;
                if(_index.ctiInit.AudioCallIds.callFeature = "1"){
                	sourceSkillName = "";
                	sourceSkillId = "";
                }else{
                	sourceSkillName = _callingInfo && _callingInfo.getSkillDesc() ? _callingInfo.getSkillDesc() : "";
                	sourceSkillId = _callingInfo && _callingInfo.getSkillId() ? _callingInfo.getSkillId() : "";
                }
                tLog.setIsExt(true);
                tLog.setSerialNo(_callingInfo && _callingInfo.serialNo ? _callingInfo.serialNo : "");
                tLog.setContactId(_callingInfo && _callingInfo.contactId ? _callingInfo.contactId : "");
                tLog.setOperator(_index.getUserInfo()['staffId']);
                tLog.setOperBeginTime(transferStartTime);
                tLog.setOperEndTime(_index.utilJS.getCurrentTime());
                tLog.setOperId("002");
                tLog.setServiceTypeId(_index.CTIInfo.serviceTypeId);
                tLog.setStatus(operStatus);
                tLog.setCallerNo(_callingInfo && _callingInfo.callerNo ? _callingInfo.callerNo : "");
                tLog.setSubsNumber(_callingInfo && _callingInfo.subsNumber ? _callingInfo.subsNumber : "");
                tLog.setAccessCode(_callingInfo && _callingInfo.getCalledNo() ? _callingInfo.getCalledNo() : "");
                tLog.setDestSkillId(skillCityList.getSelected().value);
                tLog.setDestSkillName(skillCityList.getSelected().name);
                tLog.setSourceSkillId(sourceSkillId);
                tLog.setSourceSkillName(sourceSkillName);
                tLog.setFailId(failId);
                tLog.setFinalStatus(operStatus);
                tLog.setTransferMode(transMode);
                tLog.setSourceDesc(_callingInfo && _callingInfo.getTransferMsg() ? _callingInfo.getTransferMsg() : "");
                tLog.logSavingForTransfer(tLog);
                // 记录日志 end
                
                var resultMsg;
                switch (transouts) {
                case "0":
                    _index.popAlert("转出操作成功");
                    resultMsg = "转出操作成功";
                    _index.destroyDialog();
                    break;
                case "20139":
                    $("#transferBtn_skillQueComm", $el).unbind();
                    $("#transferBtn_skillQueComm", $el).bind("click",
                        transferBtn);
                    $("#transferBtn_skillQueComm").removeAttr("disabled");
                    $("#transferBtn_skillQueComm").removeClass(
                        "btn_skillQue");
                    $("#transferBtn_skillQueComm").addClass("btn-blue");
                    _index.popAlert("该技能下没有坐席签入，请重新选择");
                    resultMsg = "该技能下没有坐席签入，请重新选择";
                    break;
                case "20512":
                    $("#transferBtn_skillQueComm", $el).unbind();
                    $("#transferBtn_skillQueComm", $el).bind("click",
                        transferBtn);
                    $("#transferBtn_skillQueComm").removeAttr("disabled");
                    $("#transferBtn_skillQueComm").removeClass(
                        "btn_skillQue");
                    $("#transferBtn_skillQueComm").addClass("btn-blue");
                    _index.popAlert("该技能下坐席忙");
                    resultMsg = "该技能下坐席忙";
                    break;
                case "150003":
                    $("#transferBtn_skillQueComm", $el).unbind();
                    $("#transferBtn_skillQueComm", $el).bind("click",
                        transferBtn);
                    $("#transferBtn_skillQueComm").removeAttr("disabled");
                    $("#transferBtn_skillQueComm").removeClass(
                        "btn_skillQue");
                    $("#transferBtn_skillQueComm").addClass("btn-blue");
                    _index.popAlert("请确认是否勾选技能");
                    resultMsg = "请确认是否勾选技能";
                    break;
                case "20509":
                    $("#transferBtn_skillQueComm", $el).unbind();
                    $("#transferBtn_skillQueComm", $el).bind("click",
                        transferBtn);
                    $("#transferBtn_skillQueComm").removeAttr("disabled");
                    $("#transferBtn_skillQueComm").removeClass(
                        "btn_skillQue");
                    $("#transferBtn_skillQueComm").addClass("btn-blue");
                    _index.popAlert("没有坐席签入该技能");
                    resultMsg = "没有坐席签入该技能";
                    break;
                default:
                    $("#transferBtn_skillQueComm", $el).unbind();
                    $("#transferBtn_skillQueComm", $el).bind("click",
                        transferBtn);
                    $("#transferBtn_skillQueComm").removeAttr("disabled");
                    $("#transferBtn_skillQueComm").removeClass(
                        "btn_skillQue");
                    $("#transferBtn_skillQueComm").addClass("btn-blue");
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
                _index.popAlert("转接失败,请重新转接！");
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
                sign_url = Constants.CCACSURL + ip + ":" + port + "/ccacs/" + ctiid + "/ws/call/setcalldata";
            } else {
                sign_url = Constants.CCACSURL + ip + ":" + port + "/ccacs/ws/call/setcalldata"; //跨域直连
            }

            var transferMsg = $.trim($el.find("#notesId_skillQue").val());
            var callData = {
                "contactID": activeSerialNo,
                "transferMsg": transferMsg,
                "staffId": staffId,
                "mediaId": mediaId,
                "channelId": channelId,
                "staffName": staffName,
                "userName" : userName,
                "transflag": true
            };

            // 拼装接口setcalldata（设置呼叫数据）数据
            var data = {
                "opserialNo": _index.serialNumber.getSerialNumber(),
                "callId": callId,
                "callData": callData,
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
            			setcalldatas = resultJson.result;
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
            			setcalldatas = resultJson.result;
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
            return setcalldatas;
        }

        // 调用CTI接口transout(转出)
        var transout = function () {
        	var status = $(".TimeTilte").text();
			if(status != "通话中"){
				_index.popAlert("转接失败，当前坐席不处于通话状态","转接");
				return;
			}
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
                sign_url = Constants.CCACSURL + ip + ":" + port + "/ccacs/" + ctiid + "/ws/call/transout";
            } else {
                sign_url = Constants.CCACSURL + ip + ":" + port + "/ccacs/ws/call/transout"; //跨域直连
            }

            // 转出的设备类型--技能队列
            var calledDeviceType = Constants.CALLEDDEVICETYPE_SKILL_QUEUE;
            // 转出时的模式 0：释放转、2：成功转；
            var transferMode = $(
                    '#transferId_skillQue input[name="transfer"]:checked ')
                .val();
            // 技能队列ID
            var calledDigits = '';
            var params = skillCityList.getSelected();
            if (params == '' || params == undefined) {
                calledDigits = '';
            } else {
                calledDigits = skillCityList.getSelected().value;
            }
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
            		contentType: "application/json; charset=utf-8",
            		url: sign_url,
            		data: JSON.stringify(data),
            		crossDomain: true,
            		async: false,
            		success: function (resultJson) {
            			transouts = resultJson.result;
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
            			transouts = resultJson.result;
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
            return transouts;
        }

        return initialize;
    });