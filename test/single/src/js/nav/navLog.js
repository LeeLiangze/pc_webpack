//2016 11 21 by jiawenchao
define([
        'Util',
        '../index/constants/mediaConstants',
        '../content/editArea/releaseReason',
        '../../tpl/nav/nav.tpl',
        '../../assets/css/nav/nav.css'
    ],
    function (Util, Constants, ReleaseReason, navTpl) {
        function func(options) {
            G_index = options;
            //获取路径url
            getUrl.call(this);
            //点击取消登录
            logCancel.call(this);
            //点击退出系统
            loginOut.call(this);
            //滚动公告
            showNic.call(this);
            //接续统计
            placeInit.call(this);
            //查询工作日志
            workDate.call(this);
            //公告弹出展示
            popAnoce.call(this);
        }

        //点击注销
        var logCancel = function () {
            $("#logCancel", this.$el).on("click", function () {
                var signResult = G_index.ctiInit.getSignResult();
                var status = G_index.clientInfo.timerWait.nowStatue();
                if (confirm("确定注销?")) {
                    if (signResult == "00") {
                        if (status == "通话中") {
                            G_index.popAlert("请先结束会话，结束放音，在进行签出！", "提示");
                        } else {
                            //清理离线会话
                            G_index.queue.clearQueue(true);
                            //签入成功需签出
                            var result;
                            if (G_index.ctiInit.getSignResult() == "00") {
                                G_index.ctiInit.signOut();//调用签出方法
                                result = G_index.ctiInit.getSignResult()
                            }
                            if (result == "WAIT_RESULT") {
                                var uapLoginOutResultInt = setInterval(function () {
                                    result = G_index.ctiInit.getSignResult()
                                    if (result != "WAIT_RESULT") {
                                        clearInterval(uapLoginOutResultInt);
                                        if ((result == "01" || result == "0") || typeof(result) == "undefined") {
                                            logCancelFunc();
                                        }
                                    }
                                }, 20);
                            } else if ((result == "01" || result == "0") || typeof(result) == "undefined") {
                                logCancelFunc();
                            }
                        }
                        ;
                    } else {
                        logCancelFunc();
                    }
                    ;
                }
            });
        };
        //获取登录url
        var getUrl = function () {
            $.getJSON("../../data/statusUrl.json", {}, $.proxy(function (Data, status) {
                if (status) {
                    logoutURL = Data.bean.logoutURL;
                    loginURL = Data.bean.loginURL;
                }

            }, this));
        };
        var logCancelFunc = function () {
            //退出单点登录
            Util.ajax.getJsonp(logoutURL, {}, function (json, status) {
                Util.ajax.postJson('front/sh/logout!index?uid=l0001', {"staffId": G_index.getUserInfo().staffId}, function (json, status) {
                    if (status) {
                        try {
                            Util.cookie.set('loginCookie', null, {path: "/"});
                            Util.cookie.set('loginTicketCookie', null, {path: "/"});
                        } catch (e) {

                        }

                        if (navigator.appName == "Netscape") {
                            window.location.href = loginURL;
                        } else {
                            var width = parseInt(window.screen.availWidth) - 20;
                            var height = parseInt(window.screen.availHeight) - 60;
                            var properties = "left=0,top=0,height=" + height + ",width=" + width + ",status=yes,toolbar=yes,titlebar=yes,status=yes,menubar=yes,location=yes,scroll=yes,resizable=yes,center=yes,onhelp=yes";
                            window.open(loginURL, "_self", properties, false);
                        }
                    } else {
                        alert("注销失败");
                    }
                });
            });
        };
        var loginOutFunc = function () {
            //退出单点登录
            Util.ajax.getJsonp(logoutURL, {}, function (json, status) {
                Util.ajax.postJson('front/sh/logout!index?uid=l0001', {"staffId": G_index.getUserInfo().staffId}, function (json, status) {
                    if (status) {
                        try {
                            Util.cookie.set('loginCookie', null, {path: "/"});
                            Util.cookie.set('loginTicketCookie', null, {path: "/"});
                        } catch (e) {

                        }
                        window.close();
                    } else {
                        alert("退出失败");
                    }
                });
            });
        };
        //退出系统 start
        var loginOut = function () {
            $("#loginOut", this.$el).on("click", $.proxy(function () {
                window.onbeforeunload = null;
                window.onunload = null;
                var status = G_index.clientInfo.timerWait.nowStatue();
                var signResult = G_index.ctiInit.getSignResult();
                if (confirm("确定退出?")) {
                    if (signResult == "00") {
                        if (status == "通话中") {
                            alert("请先结束会话，结束放音，在进行签出！");
                        } else {
                            //清理离线会话
                            G_index.queue.clearQueue(true);
                            //签入成功需签出
                            var result;
                            if (G_index.ctiInit.getSignResult() == "00") {
                                G_index.ctiInit.signOut();//调用签出方法
                                result = G_index.ctiInit.getSignResult()
                            }
                            if (result == "WAIT_RESULT") {
                                var uapLoginOutResultInt = setInterval(function () {
                                    result = G_index.ctiInit.getSignResult()
                                    if (result != "WAIT_RESULT") {
                                        clearInterval(uapLoginOutResultInt);
                                        if ((result == "01" || result == "0") || typeof(result) == "undefined") {
                                            loginOutFunc();
                                        }
                                    }
                                }, 20);
                            } else if ((result == "01" || result == "0") || typeof(result) == "undefined") {
                                loginOutFunc();
                            }
                        }
                        ;
                    } else {
                        loginOutFunc();
                    }
                    ;
                }
            }, this));
        };

        //点击浏览器关闭按钮
        window.onbeforeunload = function (e) {
            var e = e || window.event;
            if (navigator.appName == "Microsoft Internet Explorer") {
                var n = e.screenX - window.screenLeft;
                var b = n > document.documentElement.scrollWidth - 40;
                if (b && e.clientY < 0 || e.altKey) {
                    e.returnValue = "该操作将会导致非正常退出系统，并释放所有未结束的会话(正确退出系统方式：点击退出或注销按钮)，您是否确认?";
                }
            } else {
                e.returnValue = "该操作将会导致非正常退出系统，并释放所有未结束的会话(正确退出系统方式：点击退出或注销按钮)，您是否确认?";
            }
        };
        window.onunload = function (e) {
            var callingInfos = G_index.CallingInfoMap.values();
            $.each(callingInfos, function (index, _callingInfo) {
                if (index.length == 21) {
                    var channelID = _callingInfo.getChannelID() ? _callingInfo.getChannelID() : "";
                    var channelName = _callingInfo.channelName;
                    var contactId = _callingInfo.getContactId() ? _callingInfo.getContactId() : "";
                    var serialNo = _callingInfo.getSerialNo() ? _callingInfo.getSerialNo() : "";
                    var subsNumber = _callingInfo.getSubsNumber() ? _callingInfo.getSubsNumber() : "";
                    var bindedPhoneNumber = _callingInfo.getBindedPhoneNumber() ? _callingInfo.getBindedPhoneNumber() : "";
                    var mediaType = _callingInfo.getMediaType() ? _callingInfo.getMediaType() : "";
                    var mediaTypeName = _callingInfo.mediaTypeName;
                    var releaseType = _callingInfo.getReleaseType() ? _callingInfo.getReleaseType() : "";
                    var hasRecordFile = _callingInfo.getHasRecordFile() ? _callingInfo.getHasRecordFile() : "";
                    var surveyTypeId = _callingInfo.getSurveyTypeId() ? _callingInfo.getSurveyTypeId() : "";
                    var sessionStatus = _callingInfo.getSessionStatus() ? _callingInfo.getSessionStatus() : "";
                    var toUserId = _callingInfo.getToUserId() ? _callingInfo.getToUserId() : "";
                    var toUserName = _callingInfo.getToUserName() ? _callingInfo.getToUserName() : "";
                    var releaseReason = _callingInfo.getReleaseReason() ? _callingInfo.getReleaseReason() : "";
                    var fromOrgId = _callingInfo.getFromOrgId() ? _callingInfo.getFromOrgId() : "";
                    var firstResponseTime = _callingInfo.getFirstResponseTime() ? _callingInfo.getFirstResponseTime() : "";
                    var callType = _callingInfo.getCallType() ? _callingInfo.getCallType() : "";
                    var staffId = G_index.getUserInfo().staffId ? G_index.getUserInfo().staffId : "";
                    var custLevelId;
                    var custLevelName;
                    var custBrandId;
                    var custBrandName;
                    var custCityId;
                    var custCityIdName;
                    var custName;
                    if ("" != subsNumber) {
                        var customerInfoInit = G_index.CallingInfoMap.get(subsNumber);
                        if (customerInfoInit) {
                            custLevelId = customerInfoInit.getClientLevelCode();
                            custLevelName = customerInfoInit.getClientLevel();
                            custBrandId = customerInfoInit.getBrandCode();
                            custBrandName = customerInfoInit.getBrand();
                            custCityId = customerInfoInit.getCustCityId();
                            custCityIdName = customerInfoInit.getRegion();
                            custName = customerInfoInit.getFirstName();
                        }
                    }
                    custLevelId = custLevelId ? custLevelId : "";
                    custLevelName = custLevelName ? custLevelName : "";
                    custBrandId = custBrandId ? custBrandId : "";
                    custBrandName = custBrandName ? custBrandName : "";
                    custCityId = custCityId ? custCityId : "";
                    custCityIdName = custCityIdName ? custCityIdName : "";
                    custName = custName ? custName : "";
                    var contactEndTime = G_index.utilJS.getCurrentTime();
//				if(releaseType!=mediaConstants.RELEASETYPE_USER){
//					releaseType=mediaConstants.RELEASETYPE_OPERATOR;
//				}

                    var data = {
                        "channelId": channelID,
                        "channelName": channelName,
                        "serialNo": serialNo,
                        "subsNumber": subsNumber,
                        "mediaTypeId": mediaType,
                        "mediaTypeName": mediaTypeName,
                        "staffHangUp": releaseType,
                        "hasRecordFile": hasRecordFile,
                        "surveyTypeId": surveyTypeId,
                        "toUserId": toUserId,
                        "toUserName": toUserName,
                        "contactEndTime": contactEndTime,
                        "releaseReason": releaseReason,
                        "fromOrgId": fromOrgId,
                        "callType": callType,
                        "staffId": staffId,
                        "firstResponseTime": firstResponseTime,
                        "custName": custName,
                        "custLevelId": custLevelId,
                        "custLevelName": custLevelName,
                        "custBrandId": custBrandId,
                        "custBrandName": custBrandName,
                        "custCityId": custCityId,
                        "custCityIdName": custCityIdName,
                        "dataType": "contact update"
                    };
                    Util.ajax.postJson('front/sh/common!execute?uid=touch001', data, function (result, status) {
                    });
                }
                var releaseReason = new ReleaseReason(G_index, {"isNew": true, "opserialno": "1"});
                releaseReason.release(_callingInfo.serialNo, _callingInfo);
                var sessionStatus = _callingInfo.getSessionStatus();
            });
            //签入成功需签出
            if (G_index.ctiInit.getSignResult() == "00") {
                G_index.ctiInit.signOut();
            }
            //退出单点登录
            Util.ajax.getJsonp(logoutURL, {}, function (json, status) {
            }, true);
            //退出系统
            Util.ajax.postJson('front/sh/logout!index?uid=l0001', {"staffId": G_index.getUserInfo().staffId}, function (json, status) {
            });
        };
        //公告滚动展示
        var showNic = function () {
            var self = this;
            var jsonArr = [];
            var hadShowId = "";
            var couter = 0;
            var timer;
            var anoceFlag = true;
            var Width;
            anoceScroll();

            function anoceScroll() {
                $.getJSON("../../data/nav/anoceScroll.json", {}, function (Data, status) {
                    if (status) {

                        if (Data.beans.length > 0 && hadShowId != Data.beans[0].anoceId) {
                            jsonArr = Data.beans;
                            hadShowId = jsonArr[0].anoceId;
                            $("#gonggao_content", self.$el).parent().parent().show();
                            anoceFlag = true;
                        }
                        ;
                    }
                });
            }

            $("#gonggao_content", self.$el).on("click", function () {
                $(this).parent().parent().hide();
                if (jsonArr.length > 0) {
                    jsonArr[0].anoceTitle = jsonArr[0].anoceTitle.length > 10 ? jsonArr[0].anoceTitle.substr(0, 10) : jsonArr[0].anoceTitle;
                    jsonArr[0].tenantId = G_index.getUserInfo().proviceId;
                    jsonArr[0].resourceTyp = "recList";
                    G_index.main.createTab(jsonArr[0].anoceTitle, './anoceDetail', jsonArr[0]);
                }
                ;
                clearInterval(timer);
            });
            $(".hideNotice", this.$el).on("click", function () {
                $(this).parent().hide();
            });
            $(".box", this.$el).on("mouseover", function () {
            })
            $(".box", this.$el).on("mouseout", function () {
            })
            function scollTitle() {
                if (jsonArr.length > 0 && anoceFlag) {
                    $("#gonggao_content", self.$el).empty()
                    var element = $("<span id='abc' style='display:inline-block;'></span>");
                    element.html(jsonArr[0].anoceTitle)
                    $("#gonggao_content", self.$el).append(element)
                    Width = $("#abc", self.$el).width() + 10;
                    $("#abc", self.$el).css("width", Width + "px");
                    anoceFlag = false;
                }
                ;
                couter -= 1;
                $("#gonggao_content", self.$el).css({
                    marginLeft: couter + "px"
                });
                var boxWidth = $(".box", self.$el).width();

                if (couter <= -Width) {
                    couter = boxWidth;
                }
                ;
            }
        };

        //弹出公告展示
        var popAnoce = function () {
            var self = this;
            var browerHeight = document.body.offsetHeight - 190;
            var num = 0;
            anocePop();

            function anocePop() {
                $.getJSON("../../data/nav/getPopAnoceList.json", {}, function (Data, status) {
                    if (status) {
                        if (Data.beans.length > 0) {
                            $("#shutDown", self.$el).parent().parent().find(".anoceList").remove();
                            for (var i = 0; i < Data.beans.length; i++) {
                                dataArr = Data.beans;
                                Data.beans[i].anoceTitle = Data.beans[i].anoceTitle.lenth > 15 ? Data.beans[i].anoceTitle.substr(0, 15) : Data.beans[i].anoceTitle
                                $("#shutDown", self.$el).parent().parent().find("#popAnoceContent").append("<p class='anoceList'>" + Data.beans[i].anoceTitle + "<span>>></span></p>");
                                if (i == 4 || i == Data.beans.length - 1) {
                                    break;
                                }
                            }
                            anoceListClick();
                            $("#shutDown", self.$el).parent().parent().show().animate({
                                top: browerHeight + "px",
                                opacity: "1",
                                display: "block"
                            }, "slow");
                        }
                    }
                    ;

                });
            }

            $("#shutDown", self.$el).on("click", function () {
                $(this).parent().parent().hide().animate({
                    top: "1000px",
                    opacity: "0",
                }, "slow")
                $(this).parent().parent().find(".anoceList").remove();
            })
            $(".moreAnoceList", self.$el).on("click", function () {
                Util.ajax.postJson("front/sh/common!execute?uid=s007", {itemId: "129002005"}, function (Data, status) {
                    if (status) {
                        G_index.main.createTab("公告列表", Data.bean.value);
                    }
                });
            });
            function anoceListClick() {
                $(".anoceList", self.$el).on("click", function () {
                    var num = $(this).index();
                    console.log(num)
                    dataArr[num].anoceTitle = dataArr[num].anoceTitle.length > 10 ? dataArr[num].anoceTitle.substr(0, 10) : dataArr[num].anoceTitle;
                    dataArr[num].tenantId = G_index.getUserInfo().proviceId;
                    dataArr[num].resourceTyp = "recList";
                    G_index.main.createTab(dataArr[num].anoceTitle, './anoceDetail', dataArr[num]);
                });
            }

        };
        //工作日志
        var workDate = function () {
            var Url = "";
            $.getJSON("../../data/nav/workData.json", {itemId: "129002004"}, function (Data, status) {
                if (status) {
                    Url = Data.bean.value;
                }
            });
            $(".operation", this.$el).eq(1).on("click", function () {
                G_index.main.createTab('登录日志查询', Url, {text: "登录日志查询", url: Url, "id": "000101004001"})
            });
        };
        var placeInit = function () {
            $(".operation", this.$el).eq(0).on("click", function () {
                var signResult = G_index.ctiInit.getSignResult();
                //0:签出成功，1：签出失败，00，签入成功，01签入失败，"WAIT_RESULT":等待结果,"WAIT_SIGNIN"：等待签入
                if (signResult == "00") {
                    placeTotal();
                } else {
                    alert("未签入，请先签入！");
                }
            });
        };
        var placeTotal = function () {
            var proxyIP = G_index.CTIInfo.ProxyIP;//代理IP
            var proxyPort = G_index.CTIInfo.ProxyPort;//代理端口
            var ip = G_index.CTIInfo.IP;
            var port = G_index.CTIInfo.port;
            var isDefault = G_index.CTIInfo.isDefault;//缺省业务标志值
            var ctiId = G_index.CTIInfo.CTIId;
            var signOutUrl = '';
            if (isDefault == "1") {//此种情况走nginx代理
                sign_url = "";
            } else {
                sign_url = "";//跨域直连
            }
            ;
            if (G_index.queue.browserName === "IE") {  //注意index的
                //IE逻辑
                $.ajax({
                    url: sign_url,
                    type: 'post',
                    timeout: 20000,
                    dataType: "json",
                    crossDomain: true,
                    async: true,
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({opserialNo: G_index.serialNumber.getSerialNumber()}),
                    success: function (jsondata) {
                        //配置CTI成功
                        if (jsondata.result == "0") {
                            var json = jsondata.agentStat;
                            json.answerCallOutNums = json.answerNums + json.callOutNums;
                            if (json.answerCallOutNums == 0) {
                                json.averageTimes = 0;
                            } else {
                                json.averageTimes = Math.floor(json.totalTalkIngTimes / json.answerCallOutNums);
                            }
                            G_index.main.createTab('接续统计', './placeTotal', json);
                        } else {
                            G_index.popAlert("错误码：" + jsondata.result, "获取接续指标失败");
                        }
                        ;
                    }
                });
            } else {
                //其他浏览器逻辑
                $.ajax({
                    url: sign_url,
                    type: 'post',
                    timeout: 20000,
                    dataType: "json",
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    async: true,
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({opserialNo: G_index.serialNumber.getSerialNumber()}),
                    success: function (jsonData) {
                        //配置CTI成功
                        if (jsonData.result == "0") {
                            var json = jsonData.agentStat;
                            json.answerCallOutNums = json.answerNums + json.callOutNums;
                            if (json.answerCallOutNums == 0) {
                                json.averageTimes = 0;
                            } else {
                                json.averageTimes = Math.floor(json.totalTalkIngTimes / json.answerCallOutNums);
                            }
                            G_index.main.createTab('接续统计', './placeTotal', json);
                        } else {
                            G_index.popAlert("错误码：" + jsonData.result, "获取接续指标失败");
                        }
                        ;
                    }
                });
            }
        };

        return func;
    });
