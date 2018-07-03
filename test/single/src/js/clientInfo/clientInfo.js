define(['Util',
        './timerWait',
        '../index/constants/mediaConstants',
        '../callHandle/callingInfoMap/CustInfo',
        '../../tpl/clientInfo/clientInfo.tpl',
        '../../assets/css/clinetInfo/clientInfo.css',
        '../../assets/css/content/chatInfo/iconfont-chat.css',
        '../../assets/css/clinetInfo/clientInfoUp.css'
    ],
    function (Util, TimerWait, mediaConstants, CustInfo, tpl) {
        var _tagFlag;
        var itemStr = null;
        var itemMore = null;
        var configValue = null;
        var configMore = null;
        var $el;
        var _index;
        var _timerWait = null;
        var _custTag = null;
        var htmlMore;
        var opserialno = 1;
        //后台链接url
        var stopBootTelUrl = "";
        var userNameUrl = "";
        var customerNameListUrl = "";
        var curPlanNameUrl = "";
        var acceRequestUrl = "";
        var clientInfo = function (options) {
            Util.eventTarget.call(this);
            this.$el = $(tpl);
            _index = options;
            this.clientInitLeftTopFlag = false;
            this.clientInitLeftLeftFlag = false;
            this.subsNumberFlag = false;
        };
        window.clientTriggerFlag = true;
        $.extend(clientInfo.prototype, Util.eventTarget.prototype, {
            _timerWait: function () {
                //加载定时器跟等待数
                this.timerWait = new TimerWait(_index);
                $(".clientInfo").prepend(this.timerWait.$el);
                $(".clientInfo").append('<div class="clientLeft"><i class="clientleftbtn">&lt;</i><i class="clientrightbtn">&gt;</i></div>');
                var data = $("body").attr("class");
                //判断当前是否为语音状态
                if (data == "yyA-hor" || data == 'yyA-ver' || data == 'yyB-hor' || data == 'yyB-ver') {
                    $("#queue_skills_info").addClass("yyskills");
                } else {
                    $("#queue_skills_info").addClass("noyy");
                }
                ;
                this.timerWait.timedRefresh();
            },
            initClientInfo: function (parm) {
                htmlMore = null;
                itemMore = [];
                itemStr = [];
                _tagFlag = "T";
                var viewmodeid = null;
                var serviceTypeId = _index.CTIInfo.serviceTypeId;
                if (parm == "yyA-hor" || parm == "yyA-ver") {
                    // serviceTypeId = "10086otck";
                    viewmodeid = "00";
                } else if (parm == "yyB-hor" || parm == "yyB-ver") {
                    // serviceTypeId = "otck";
                    viewmodeid = "01";
                } else {
                    viewmodeid = "02";
                }
                //ajax同步：根据手机号获取客户基本信息，同步动态获取显示信息项
                $.getJSON('../../data/customerInfo.json', {
                    "viewMode": viewmodeid,
                    "serviceTypeId": serviceTypeId
                }, $.proxy(function (json, status) {
                    if (status) {
                        var data = json.beans;
                        var itemSize = 0;
                        if (viewmodeid == "00") {
                            $.each(data, function (index, value) {
                                if (value.visulFlag == "1") {
                                    if (value.nodeType == "02") {
                                        creatInfobar(_tagFlag, value);
                                    } else {
                                        creatInfoItem(value);
                                        if ('userName' == value.configItemId) {
                                            userNameUrl = value.urlLinkAddr;
                                        }
                                        if ('stopBootTel' == value.configItemId) {
                                            stopBootTelUrl = value.urlLinkAddr;
                                        }
                                        if ('curPlanName' == value.configItemId) {
                                            curPlanNameUrl = value.urlLinkAddr;
                                        }
                                        if ('customerNameList' == value.configItemId) {
                                            customerNameListUrl = value.urlLinkAddr;
                                        }
                                        if ('acceRequest' == value.configItemId) {
                                            acceRequestUrl = value.urlLinkAddr;
                                        }
                                    }
                                }

                            });
                        } else {
                            $.each(data, function (index, value) {
                                if (value.visulFlag == "1") {
                                    if (value.nodeType == "03") {
                                        if (value.groupType == "00") {
                                            internetItem(value);
                                        } else if (value.groupType == "01") {
                                            internetMoreItem(value, itemSize);
                                            itemSize++;
                                        }
                                    } else {
                                        itemStr.push('<span class="customer_line"></span>');
                                    }
                                    if ('acceRequest' == value.configItemId) {
                                        acceRequestUrl = value.urlLinkAddr;
                                    }
                                }
                            });
                        }
                        itemStr.push('<span class="customer_line"></span><span id="customer_more" class="customer_more">更多客户信息</span></div>');

                        itemMore.push('</ul></div>');
                        var html = itemStr.join("");
                        htmlMore = itemMore.join("");
                        configValue = Util.hdb.compile(html);
                        configMore = Util.hdb.compile(htmlMore);
                        $(".customer_info").html(configValue(""));
                        $(".moreClientInfo").html(configMore(""));
                        var data = $("body").attr("class");
                        if (data == "yyA-hor" || data == 'yyA-ver') {
                            $('.clientLeft').css('display', 'block');
                        } else {
                            $('.clientLeft').css('display', 'none');
                        }
                        eventInit.call(this, '');
                        showInit("");
                    }
                }, this), true)
            },
            initCustInfo: function (parm) {
                var number = parm;
                var activeSerialNo = _index.CallingInfoMap.getActiveSerialNo();
                var _custInfo = null;
                if (activeSerialNo && activeSerialNo != "") {
                    var callingInfo = _index.CallingInfoMap.get(activeSerialNo);
                    if (callingInfo) {
                        var subsNumber = callingInfo.getSubsNumber();
                        _custInfo = callingInfo.getClientInfoMap(subsNumber);
                        if (_custInfo) {
                            _custInfo.callerNo = callingInfo.getCallerNo() ? callingInfo.getCallerNo() : "";
                            _custInfo.calledNo = callingInfo.getCalledNo() ? callingInfo.getCalledNo() : "";
                            _custInfo.contactId = callingInfo.getContactId() ? callingInfo.getContactId() : "";
                            _custInfo.serialNo = activeSerialNo;
                            _custInfo.subsNumber = subsNumber;
                            $(".customer_info").html(configValue(_custInfo));
                            $el = $(configValue(_custInfo));
                            custTag(number);
                            assChannel(number)
                            eventInit.call(this, number);
                            showInit(number);
                            if (window.clientTriggerFlag == true) {
                                _index.clientInfo.trigger("acceptNumberChange", subsNumber);
                            }
                        } else {
                            clientInfoInit(subsNumber);
                            _custInfo = callingInfo.getClientInfoMap(subsNumber);
                            number = subsNumber;
                        }
                    } else {
                        clientInfoInit(number);
                        _custInfo = _index.CallingInfoMap.get("acceptNumber");
                    }

                } else {
                    clientInfoInit(number);
                    _custInfo = _index.CallingInfoMap.get("acceptNumber");
                }
//                if(window.clientTriggerFlag == true){
//            		 _index.clientInfo.trigger("acceptNumberChange", number);
//                }
//                custTag(number);
//                assChannel(number);
                // if (_custInfo) {
                //     castLevel(_custInfo.starLevel);
                // }

//                eventInit.call(this, number);
//                showInit(number);

            },
            //此处获取URL放在index.js提前获取
//            getDataSourceURL: function(parm) {
//            	if(_index.SourceURL){
//            		return _index.SourceURL;
//            	}
//        		var serviceTypeId = parm;
//                var nodeTypeId = "01";
//                var SourceURL = null;
//                Util.ajax.postJson('front/sh/common!execute?uid=queryCustomerInfoURL', { "nodeTypeId": nodeTypeId, "serviceTypeId": serviceTypeId }, function(json, status) {
//                    if (status) {
//                        SourceURL = json.beans;
//                    }
//                }, true)
//                _index.SourceURL = SourceURL;
//                return SourceURL;
//
//            },
            closeClientInfoLeftTop: function () {
                $('.clientInfo .clientleftbtn').css('display', 'none');
                $('.clientInfo .clientrightbtn').css('display', 'block');
                $('body.yyA-hor .clientInfo .customer_info').css('display', 'none');
                $('body.internet-hor .clientInfo .customer_info').css('display', 'block');
                $('body.yyA-hor .clientInfo').addClass('clientInfoLeftTop');
                $('body.yyA-hor .main').addClass('mainLeftTop');
                this.clientInitLeftTopFlag = true;
            },
            openClientInfoRightTop: function () {
                $('.clientInfo .clientrightbtn').css('display', 'none');
                $('.clientInfo .clientleftbtn').css('display', 'block');
                $('body.yyA-hor .clientInfo .customer_info').css('display', 'block');
                $('body.yyA-hor .clientInfo').removeClass('clientInfoLeftTop');
                $('body.yyA-hor .main').removeClass('mainLeftTop');
                this.clientInitLeftTopFlag = false;
            },
            closeClientInfoLeftLeft: function () {
                $('.clientInfo .clientleftbtn').css('display', 'none');
                $('.clientInfo .clientrightbtn').css('display', 'block');
                $('body.yyA-ver .clientInfo .customer_info').css('display', 'none');
                $('body.internet-ver .clientInfo .customer_info').css('display', 'block');
                $('body.yyA-ver .clientInfo').addClass('clientInfoLeftLeft');
                $('body.yyA-ver .main').addClass('mainLeftLeft');
                this.clientInitLeftLeftFlag = true;
            },
            openClientInfoRightLeft: function () {
                $('.clientInfo .clientrightbtn').css('display', 'none');
                $('.clientInfo .clientleftbtn').css('display', 'block');
                $('body.yyA-ver .clientInfo .customer_info').css('display', 'block');
                $('body.yyA-ver .clientInfo').removeClass('clientInfoLeftLeft');
                $('body.yyA-ver .main').removeClass('mainLeftLeft');
                this.clientInitLeftLeftFlag = false;
            },
            initCustInfoConference: function (parm, flag) {
                var number = parm;
                //by yuexuyang start 三方通话时在304事件中调用此方法
                if (flag) {
                    if (window.clientTriggerFlag == true) {
                        _index.clientInfo.trigger("acceptNumberChange", number);
                    }
                    clientInfoInit(number);
                    setTimeout(function () {
                        $("#customer_info_subsNumber").val(number);
                    }, 320);
                    return;
                }
                //by yuexuyang end
            }
        })
        var showInit = function (number) {
            if ($(".detail .customer_right")) {
                $.each($(".detail .customer_right"), function (index, value) {
                    if ($(".detail .customer_right").eq(index).html() == "") {
                        $(".detail .customer_right").eq(index).html("--");
                    }
                })
            }
            ;
            if ($(".detail .customer_info a")) {
                if ($(".detail .customer_info a").html() !== "--") {
                    $(".detail .customer_info a").css("color", "#0085D0")
                }
            }
            ;

            if ($(".detail .userStatus")) {
                if ($(".detail .userStatus").text() != "--") {
                    $(".detail .userStatus").css("color", "#90C31F")
                }
            }
            ;
            if ($(".detail .stopBootTel ")) {
                if ($(".detail .stopBootTel ").text() != "--") {
                    $(".detail .stopBootTel ").css("color", "#90C31F")
                }
            }
            ;
            if ($(".detail .customer_starLevel ")) {
                if ($(".detail .customer_starLevel ").text() != "--") {
                    $(".detail .customer_starLevel ").css("color", "#FFD700");
                }
            }
            ;
            var data = $("body").attr("class");
            if (data == "yyA-hor" || data == 'yyA-ver') {
                $('.clientLeft').css('display', 'block');
            } else {
                $('.clientLeft').css('display', 'none');
            }
            var activeSerialNo = _index.CallingInfoMap.getActiveSerialNo();
            var callingInfo = _index.CallingInfoMap.get(activeSerialNo);
            // if (callingInfo) {
            //     var mediaID = callingInfo.getMediaType();
            //     if (mediaID && mediaID != mediaConstants.MEDIA_ONLINE_SERVICE) {
            //         $("#customer_input_subsNumber").val(number);
            //     }
            // };
            //客户姓名点击事件
            if ($(".detail .userName ")) {
                // if($(".detail .userName").text() != "--"){
                $(".detail .userName ").css("cursor", "pointer");
                $(".detail .userName").on("click", function (event) {
                    _index.showDialog({
                        title: '客户姓名详细信息', //弹出窗标题
                        url: 'js/clientInfo/clientUserName', //要加载的模块
                        param: {"url": userNameUrl.split('?')[0]}, //要传递的参数，可以是json对象
                        width: userNameUrl.split('?')[1].split('&amp;')[1].split('=')[1], //对话框宽度
                        height: userNameUrl.split('?')[1].split('&amp;')[0].split('=')[1] //对话框高度
                    });
                })
                //   }
            }
            //停开机点击事件
            if ($(".detail .stopBootTel ")) {
                // if($(".detail .stopBootTel").text() != "--"){

                $(".detail .stopBootTel ").css("cursor", "pointer");
                $(".detail .stopBootTel").on("click", function (event) {
                    _index.showDialog({
                        title: '停开机详细信息', //弹出窗标题
                        url: 'js/clientInfo/clientStopBootTel', //要加载的模块
                        param: {"url": stopBootTelUrl.split('?')[0]}, //要传递的参数，可以是json对象
                        width: stopBootTelUrl.split('?')[1].split('&amp;')[1].split('=')[1], //对话框宽度
                        height: stopBootTelUrl.split('?')[1].split('&amp;')[0].split('=')[1] //对话框高度
                    });
                })
                // }
            }
            //名单客户点击事件
            if ($(".detail .customerNameList ")) {
                $(".detail .customerNameList ").css("cursor", "pointer");
                $(".detail .customerNameList").on("click", function (event) {
                    _index.showDialog({
                        title: '名单客户处理方法', //弹出窗标题
                        url: 'js/clientInfo/clientCustomerNameList', //要加载的模块
                        param: {"url": customerNameListUrl.split('?')[0]}, //要传递的参数，可以是json对象
                        width: customerNameListUrl.split('?')[1].split('&amp;')[1].split('=')[1], //对话框宽度
                        height: customerNameListUrl.split('?')[1].split('&amp;')[0].split('=')[1] //对话框高度
                    });
                })
            }
            // 资费套餐信息
            if ($(".detail .curPlanName ")) {
                $(".detail .curPlanName ").css("cursor", "pointer");
                $(".detail .curPlanName").on("click", function (event) {
                    _index.showDialog({
                        title: '资费套餐信息', //弹出窗标题
                        url: 'js/clientInfo/clientCurPlanName', //要加载的模块
                        param: {"url": curPlanNameUrl.split('?')[0]}, //要传递的参数，可以是json对象
                        width: curPlanNameUrl.split('?')[1].split('&amp;')[1].split('=')[1], //对话框宽度
                        height: curPlanNameUrl.split('?')[1].split('&amp;')[0].split('=')[1] //对话框高度
                    });
                })
            }
        }
        var clientInfoInit = function (number) {
            var activeSerialNo = _index.CallingInfoMap.getActiveSerialNo();
            var callingInfo = _index.CallingInfoMap.get(activeSerialNo);
            var MSISDN = number;
            var staffId = _index.getUserInfo().staffId;
            var serviceTypeId = _index.CTIInfo.serviceTypeId;
            var SourceURL = "queryDataByUserPhone_post";
            var data = {
                "userMobile": MSISDN,
                "serviceCode": SourceURL,
                "serviceTypeId": serviceTypeId,
                "staffId": staffId
            };
//                if (RegExp("(^1(3[4-9]|4[7]|5[0-27-9]|7[8]|8[2-478])\\d{8}$)|(^1705\\d{7}$)").test(MSISDN)) {
            $.getJSON('../../data/clientInfoInit.json', data, function (json, status) {
                if (status) {
                    var custInfo = json.beans[0];
                    if (custInfo.starLevel == "" && custInfo.telNumStarCode == "") {
                        custInfo.telNumStarCode = "99";
                    }
                    // if (custInfo.starLevel && custInfo.starLevel != "") {
                    //     switch (custInfo.starLevel) {
                    //         case "一星级":
                    //             custInfo.starLevel = "1"
                    //             break;
                    //         case "二星级":
                    //             custInfo.starLevel = "2"
                    //             break;
                    //         case "三星级":
                    //             custInfo.starLevel = "3"
                    //             break;
                    //         case "四星级":
                    //             custInfo.starLevel = "4"
                    //             break;
                    //         case "五星级":
                    //             custInfo.starLevel = "5"
                    //             break;
                    //         default:
                    //             break;
                    //     }
                    // }
                    var _custInfo = new CustInfo();
                    $.extend(_custInfo, custInfo);
                    if (callingInfo) {
                        callingInfo.setClientInfoMap(MSISDN, _custInfo);
                        _custInfo.callerNo = callingInfo.getCallerNo();
                        _custInfo.calledNo = callingInfo.getCalledNo();
                        _custInfo.subsNumber = callingInfo.getSubsNumber();
                        _custInfo.phoneNumber = MSISDN;
                        _custInfo.contactId = callingInfo.getContactId();
                        _custInfo.serialNo = activeSerialNo;
                        _index.CallingInfoMap.put(activeSerialNo, callingInfo);
                    } else {
                        _custInfo.subsNumber = MSISDN;
                        _custInfo.phoneNumber = MSISDN;
                        _index.CallingInfoMap.put("acceptNumber", _custInfo);
                    }
                    if (window.clientTriggerFlag == true) {
                        _index.clientInfo.trigger("acceptNumberChange", number);
                    }
                } else {
                    var bean = {
                        "subsNumber": MSISDN,
                        "provNm": "",
                        "provCode": "",
                        "cityNm": "",
                        "distrtCode": "",
                        "userName": "",
                        "userId": "",
                        "userIdVal": "",
                        "userBrand": "",
                        "userBrandVal": "",
                        "userLevel": "",
                        "userLevelVal": "",
                        "userStatus": "",
                        "userStatusVal": "",
                        "userBegin": "",
                        "realNameInfo": "",
                        "starLevel": "",
                        "starScore": "",
                        "starTime": "",
                        "email": "",
                        "zipCode": "",
                        "userAdd": "",
                        "userNum": "",
                        "flag4G": "",
                        "volteFlag": "",
                        "accoutDay": "",
                        "curPlanId": "",
                        "curPlanName": "",
                        "startTime": "",
                        "endTime": "",
                        "nextPlanId": "",
                        "nextPlanName": "",
                        "curFeeTotal": "",
                        "curFee": "",
                        "realFee": "",
                        "oweFee": ""
                    }
                    var _custInfo = new CustInfo();
                    $.extend(_custInfo, bean);
                    if (callingInfo) {
                        _custInfo.serialNo = callingInfo.getSerialNo();
                        _custInfo.contactId = callingInfo.getContactId();
                    }
                    if (!callingInfo) {
                        //将_customerInfo对象存入callingInfoMap中,key的值是常量
                        _index.CallingInfoMap.put("acceptNumber", _custInfo);
                    } else {
                        //将_customerInfo对象存入callingInfoMap中,key的值是受理号码
                        callingInfo.setClientInfoMap(MSISDN, _custInfo);
                        _index.CallingInfoMap.put(activeSerialNo, callingInfo);
                    }
                    if (window.clientTriggerFlag == true) {
                        _index.clientInfo.trigger("acceptNumberChange", number);
                    }
                }
                $(".customer_info").html(configValue(_custInfo));
                $el = $(configValue(_custInfo));
                if (callingInfo) {
                    $(".callerNo").text(callingInfo.callerNo);
                    $(".calledNo").text(callingInfo.calledNo);
                }
                custTag(number);
                assChannel(number);
                eventInit.call(this, MSISDN);
                showInit(MSISDN);

            })
//                }
        }
        //生成更多客户信息tpl
        var internetMoreItem = function (value, parm) {
            var itemSize = parm;
            if (itemSize < 10) {
                if (itemSize == "0") {
                    itemMore.push('<div id="moreClientInfo" class="moreClientInfo"><ul class="moreCust_one"><li><span class="moreCustInfo_left">' + value.name + '</span><span class="moreCustInfo_right">{{' + value.configItemId + '}}</span></li>');
                } else {
                    itemMore.push('<li><span class="moreCustInfo_left">' + value.name + '</span><span class="moreCustInfo_right">{{' + value.configItemId + '}}</span></li>');
                }
            } else {
                if (itemSize == "10") {
                    itemMore.push('</ul><ul class="moreCust_two"><li><span class="moreCustInfo_left">' + value.name + '</span><span class="moreCustInfo_right">{{' + value.configItemId + '}}</span></li>');
                } else {
                    itemMore.push('<li><span class="moreCustInfo_left">' + value.name + '</span><span class="moreCustInfo_right">{{' + value.configItemId + '}}</span></li>');
                }
            }
        }

        //语音创建客户信息栏分割线
        var creatInfobar = function (_Flag, value) {
            if (_Flag == "T") {
                _tagFlag = "F";
                itemStr.push('<ul>');
            } else {
                itemStr.push('</ul><ul><li class="customer_line"></li>');
            }
        };
        //语音A创建客户信息项
        var creatInfoItem = function (value) {
            switch (value.displayType) {
                case "LABLE":
                    if (value.name == "SIM卡类型") {
                        itemStr.push('<li class="customer_li"><span class="customer_left">' + value.name + '</span><span class="customer_right  ' + value.configItemId + '" title="{{' + value.configItemId + '}}">{{' + value.configItemId + '}}</span></li>');
                    } else {
                        itemStr.push('<li class="customer_li"><span class="customer_left">' + value.name + '</span><span class="customer_right  ' + value.configItemId + '">{{' + value.configItemId + '}}</span></li>');
                    }
                    break;
                case "TEXT":
                    // itemStr.push('<li class="customer_li"><span class="customer_left">' + value.name + '</span><input type="text" class="customer_input"  id="customer_info_subsNumber" value="{{' + value.configItemId + '}}"><span class="cust_surch"></span></li>');
                    break;
                case "SELECT":
                    //  itemStr.push('<li class="customer_li"><span class="customer_left">'+value.ITEMNAME+'</span><span class="customer_right"><input type="text" class="customer_input"  id="customer_info_subsNumber" value="{{'+value.ITEMID+'}}"></span></li>');
                    break;
                case "CUSTOMIZE":
                    customize(value);
                    break;
            }
        };
        //当displaytype（显示类型）为customize（定制）时调用
        var customize = function (value) {
            switch (value.showScptDesc) {
                case "custTag":
                    itemStr.push('<ul id="clientIntro_tag" class="clientIntro_tag"><li class="customer_li customer_' + value.configItemId + '"><span id="cust_addTag" class="custTag add_custTag" title="添加客户标签"></span><span id="more_custTag" class="more_custTag"></span></li></ul>');
                    break;
                case "curPlanName":
                    itemStr.push('<li class="customer_li"><span class="customer_left">资费套餐</span><a class="customer_right curPlanName" href="javascript:void(0);" title="{{' + value.configItemId + '}}">{{' + value.configItemId + '}}</a></li>');
                    break;
                case "starLevel":
                    itemStr.push('<li class="customer_li"><span class="customer_left">星級</span><span class="customer_right t-stars customer_' + value.configItemId + '"></span></li>');
                    break;
                case "assChannel":
                    itemStr.push('<li class="customer_li "><span class="customer_left">' + value.name + '</span><span class="customer_' + value.configItemId + '"></span><span id="add_channel" class="assChannel add_channel"></span></li>');
                    break;
                case "subsNumber":
                    // var numTemp = value.configItemId;
                    // numTemp = numTemp.substr(0,3)+" "+numTemp.substr(3,4) + " "+numTemp.substr(7,10);
                    itemStr.push('<li class="customer_li"><span class="customer_left">' + value.name + '</span><input type="text" class="customer_input"  id="customer_info_subsNumber" value="13788255047"><ul class="callingInfo-subsNumber"></ul><span class="cust_surch"></span></li>');
                    break;
                default:

            }

        };
        //互联网视图语音B视图模式
        var internetItem = function (value) {
            switch (value.displayType) {
                case "LABLE":
                    itemStr.push('<span  class="customer_' + value.configItemId + '">' + value.name + '</span><span class="customer_right">{{' + value.configItemId + '}}</span>');
                    break;
                case "TEXT":
                    // itemStr.push('<span class="customer_' + value.configItemId + '">' + value.name + '</span><span class="customer_right"><input type="text" class="customer_input"  id="customer_input_subsNumber" value="{{' + value.configItemId + '}}"></input><span class="cust_surch"></span></span>');
                    break;
                case "SELECT":
                    //  itemStr.push('<li class="customer_li"><span class="customer_left">'+value.ITEMNAME+'</span><span class="customer_right"><input type="text" class="customer_input"  id="customer_info_subsNumber" value="{{'+value.ITEMID+'}}"></span></li>');
                    break;
                case "CUSTOMIZE":
                    intCustomize(value);
                    break;
            }
        };
        //互联网视图语音B视图
        var intCustomize = function (value) {
            switch (value.showScptDesc) {
                case "custTag":
                    itemStr.push('<div class = "customer_' + value.configItemId + '"><span id="cust_addTag" class="custTag add_custTag" title="添加客户标签"></span><span id="more_custTag" class="more_custTag"></span></div>')
                    break;
                case "assChannel":
                    itemStr.push('<span  class="customer_">' + value.name + '</span><div class = "customer_' + value.configItemId + '"><span id="add_channel" class="assChannel add_channel"></span></div>');
                    break;
                case "subsNumber":
                    // var numTemp = value.configItemId;
                    // numTemp = numTemp.substr(0,3)+" "+numTemp.substr(3,4) + " "+numTemp.substr(7,10);
                    itemStr.push('<span class="customer_' + value.configItemId + '">' + value.name + '</span><span class="customer_right"><input type="text" class="customer_input"  id="customer_input_subsNumber" value="{{' + value.configItemId + '}}"><ul class="callingInfo-subsNumber"></ul></input><span class="cust_surch"></span></span>');
                    break;
                default:
            }
        }

        var custTag = function (value) {
            _custTag = null;
            var itemHtml = [];
            var activeSerialNo = _index.CallingInfoMap.getActiveSerialNo();
            var callingInfo = _index.CallingInfoMap.get(activeSerialNo);
            var mediaTypeId = null
            // if (callingInfo == undefined || callingInfo == null) {
            if (callingInfo) {
                mediaTypeId = callingInfo.getMediaType();
            } else {
                mediaTypeId = '5'
            }
            if (value != $('.customer_input').val()) {
                value = $('.customer_input').val();
            }
            var data = {"accountId": value, "mediaTypeId": mediaTypeId};

            $.getJSON('../../data/cusTag.json', data, function (json, status) {
                if (status) {
                    _custTag = json.beans;
                    $.each(_custTag, function (index, value) {
                        if (index == 3) {
                            return false;
                        }
                        if (value.tagName == " ") {
                            return false;
                        }
                        itemHtml.push('<span class="custTag custTag_' + index + '">' + value.tagName + '</span>');
                    });
                }
            }, true);
//            } else {
//                _custTags = callingInfo.getCustTags();
//                if (_custTags) {
//                    var tags = _custTags.split(",");
//                    for (var i = 0; i < tags.length; i++) {
//                        if (i == 3) {
//                            break;
//                        }
//                        if (tags[i] == "") {
//                            break;
//                        }
//                        itemHtml.push('<span class="custTag_' + i + '">' + tags[i] + '</span>');
//                    }
//                }
//
//            }
            var htmlStr = itemHtml.join("");
            $(".clientInfo .customer_info  .customer_custTag").prepend(htmlStr);

        };
        var assChannel = function (value) {
            var activeSerialNo = _index.CallingInfoMap.getActiveSerialNo();
            var callingInfo = _index.CallingInfoMap.get(activeSerialNo);
            if (callingInfo != undefined || callingInfo != null) {
                var mediaTypeId = callingInfo.getMediaType();
                var channelId = callingInfo.getChannelID();
                var callerNo = callingInfo.getCallerNo();
            } else {
                var mediaTypeId = "01";
                var channelId = "080007";
                var callerNo = value;
            }
            var params = {
                "mediaTypeId": mediaTypeId,
                "channelId": channelId,
                "callerNo": callerNo
            };
            //front/sh/media!execute?uid=queryCustInfo01--data/channel.json
            $.getJSON('../../data/assChannel.json', params, function (json, status) {
                if (status) {
                    var assChannel = json.beans;
                    var itemHtml = [];
                    var channel = [];
                    $.each(assChannel, function (index, value) {
                        if ($.inArray(value.mediaTypeId, channel) == "-1") {
                            channel.push(value.mediaTypeId)
                            itemHtml.push('<span class="assChannel assChannel_' + value.mediaTypeId + '"title=' + value.accountId + '></span>');
                        }
                    });
                    var htmlStr = itemHtml.join("");
                    $(".clientInfo .customer_info .customer_assChannel").prepend(htmlStr);
                }
            })
        };
        var castLevel = function (value) {
            if (value) {
                var itemHtml = [];
                for (var i = 0; i < 5; i++) {
                    if (i < value) {
                        itemHtml.push('<i class="iconfont-chat icon-shoucang"></i>');
                    } else {
                        itemHtml.push('<i class="iconfont-chat icon-shoucang icon-fav-1"></i>');
                    }
                }
                var htmlStr = itemHtml.join("");
                $(".clientInfo .customer_info .customer_starLevel").append(htmlStr);
            } else {
                return;
            }
        };
        var addSubsNum = function (number) {
            if (number) {
                var isMoibel = RegExp("^1(34[0-8]|(3[5-9]|5[017-9]|8[278])\\d)\\d{7}$").test(number)
                if (isMoibel) {
                    _index.contentCommon.subsNumArray.push(number);
                }
            }
        }
        /**
         * 显示对应当前会话输入的所有的受理号码
         * @return {[type]} [description]
         */
        var showSubsNum = function () {
            $(".callingInfo-subsNumber").empty();
            var serialNo = _index.CallingInfoMap.getActiveSerialNo();
            var num = "13788255047";
            if (serialNo) {
                var clientMap = _index.CallingInfoMap.get(serialNo).clientInfoMap;
                for (var i in clientMap) {
                    //num = i.substr(0,3)+" "+i.substr(3,4) + " "+i.substr(7,10)
                    str = "<li class='subsNumber-item'>" + i + "</li>";
                    $(".callingInfo-subsNumber").append(str);
                }
                $(".callingInfo-subsNumber").show();
            }


        };

        var querySubsNum = function () {
            var val = $.trim($(".customer_input").val().replace(/\s/g, ""));
            if (RegExp("(^1(3[4-9]|4[7]|5[0-27-9]|7[8]|8[2-478])\\d{8}$)|(^1705\\d{7}$)").test(val)) {
                var activeSerialNo = _index.CallingInfoMap.getActiveSerialNo();
                var callingInfo = _index.CallingInfoMap.get(activeSerialNo);
                var _custInfo = null;
                if (callingInfo) {
                    var subsNumber = callingInfo.getSubsNumber();
                    _custInfo = callingInfo.getClientInfoMap(subsNumber);
                    callingInfo.setSubsNumber(val);

                }
                if (_custInfo && val == _custInfo.subsNumber) {
                    return;
                }
                _index.main.currentPanel.glbTab.items[1].setTab({hideTab: false});
                _index.main.currentPanel.glbTab.switchTab(1);
                //$('.uiTab .uiTabHead .uiTabItemHead').eq(1).click();

                var paramsToProvince = {
                    "subsNumber": val,
                    "reserved1": "",
                    "reserved2": "",
                    "reserved3": ""
                };
                _index.postMessage.sendToProvince("subsNumberChange", paramsToProvince);

                _index.clientInfo.initCustInfo(val);
            } else {
                _index.popAlert("手机号码不是移动号！");
            }
        }

        function eventInit(number) {
            var that = this;
            $(".clientInfo").on('click', '.clientleftbtn', $.proxy(this.closeClientInfoLeftTop, this));
            $(".clientInfo").on('click', '.clientrightbtn', $.proxy(this.openClientInfoRightTop, this));
            $(".clientInfo").on('click', '.clientleftbtn', $.proxy(this.closeClientInfoLeftLeft, this));
            $(".clientInfo").on('click', '.clientrightbtn', $.proxy(this.openClientInfoRightLeft, this));
            // $('body').on('click',function(e){
            //     $(".callingInfo-subsNumber").hide();
            // });
            //受理号码得到焦点事件
            $(".customer_input").click(function (e) {
                if (that.subsNumberFlag) {
                    $(".callingInfo-subsNumber").hide();
                    that.subsNumberFlag = false;
                } else {
                    showSubsNum();
                    that.subsNumberFlag = true;
                }
            });

            $(".customer_input").mouseleave(function () {
                $(".callingInfo-subsNumber").hide();
                that.subsNumberFlag = false;
            });
            $(".callingInfo-subsNumber").mouseover(function () {
                $(".callingInfo-subsNumber").show();
                that.subsNumberFlag = true;
            });
            $(".callingInfo-subsNumber").mouseleave(function () {
                $(".callingInfo-subsNumber").hide();
                that.subsNumberFlag = false;
            });
            $(".callingInfo-subsNumber").on('click', '.subsNumber-item', function (e) {
                $(".customer_input").val("");
                var $item = $(e.currentTarget);
                var num = $.trim($item.text());
                $(".customer_input").val(num);
                querySubsNum();
                $(".callingInfo-subsNumber").hide();
                that.subsNumberFlag = false;
            });

            //"新增客户标签"图标点击事件
            $(".add_custTag").on("click", function (event) {
//            	if(_index.queue.queueReceiveMessageFlag == false){
//            		return false;
//            	}else{
                var accountId = null;
                var mediaTypeId = null;
                var activeSerialNo = _index.CallingInfoMap.getActiveSerialNo();
                var callingInfo = _index.CallingInfoMap.get(activeSerialNo);
                if (callingInfo) {
                    accountId = callingInfo.getSubsNumber();
                    mediaTypeId = callingInfo.getMediaType();
                } else {
                    accountId = $('.customer_input').val();
                    mediaTypeId = '5';
                }
                //accountId = $('.add_custTag').attr('accountId')
                if (accountId == "" || accountId == undefined) {
                    return;
                }
                //var mediaTypeId =  $('.add_custTag').attr('mediaTypeId');

                _index.showDialog({
                    title: '客户标签收集', //弹出窗标题
                    url: 'js/clientInfo/addClientTag', //要加载的模块
                    param: {"accountId": accountId, "mediaTypeId": mediaTypeId}, //要传递的参数，可以是json对象
                    width: 600, //对话框宽度
                    height: 380 //对话框高度
                });

                //}

            });


            //"展示客户已有标签"图标点击事件
            $("#more_custTag").on("click", function (event) {
                var activeSerialNo = _index.CallingInfoMap.getActiveSerialNo();
                var callingInfo = _index.CallingInfoMap.get(activeSerialNo);
                var accountId = null;
                var mediaTypeId = null;
                var activeSerialNo = _index.CallingInfoMap.getActiveSerialNo();
                var callingInfo = _index.CallingInfoMap.get(activeSerialNo);
                if (callingInfo) {
                    accountId = callingInfo.getSubsNumber();
                    mediaTypeId = callingInfo.getMediaType();
                } else {
                    accountId = $('.customer_input').val();
                    mediaTypeId = '5';
                }
                //accountId = $('.add_custTag').attr('accountId')
                if (accountId == "" || accountId == undefined) {
                    return;
                }
                ;
                var data = {"accountId": accountId, "mediaTypeId": mediaTypeId};
                var custTags = null;
                $.getJSON('../../data/custTag.json', data, function (json, status) {
                    if (status) {
                        custTags = json.beans;
                    }
                }, true);
                //var custTags = callingInfo.getCustTags();
                if (custTags == null || custTags.length == 0) {
                    custTags = "当前没有标签信息";
                    Util.dialog.bubble({
                        element: $(this), //要将气泡弹出在哪个元素上
                        content: "<div class='more_custTag' >" + custTags + "</div>", //气泡内容
                        quickClose: true, //点击页面上其它位置是否关闭气泡 默认为true
                        align: 'bottom' //气泡弹出方向，可以是 top、right、bottom、left、或者它们的组合，如top right
                    });
                    return;
                }
                //var tags = custTags.split(",");
                var tags = custTags;
                var itemHtml = [];
                itemHtml.push('<ul><li>');
                for (var i = 3; i < tags.length; i++) {
                    if (tags[i] == "") {
                        break;
                    }
                    if ((i % 3) == 0 && i != 3) {
                        itemHtml.push('</li><li>');
                    }

                    itemHtml.push('<span class="custTag_more custTag_more_' + i % 3 + '">' + tags[i].tagName + '</span>');
                }
                itemHtml.push('</li></ul>');
                var htmlStr = itemHtml.join("");
                Util.dialog.bubble({
                    element: $(this), //要将气泡弹出在哪个元素上
                    content: "<div class='more_custTag' >" + htmlStr + "</div>", //气泡内容
                    quickClose: true, //点击页面上其它位置是否关闭气泡 默认为true
                    align: 'bottom' //气泡弹出方向，可以是 top、right、bottom、left、或者它们的组合，如top right
                });

            });

            //"收集客户渠道"图标点击事件
            $("#add_channel").on("click", function (event) {
                var CTIType = "1";
                if (CTIType == "3") {

                } else {
                    /*渠道id为01,02时为手机号码，其它不是，当渠道id为01时，此时不具备收集渠道信息的条件
                     否则获取callingInfo对象的 channelId,accountId,mediaType,mediaTypeName,
                     bindedPhoneNumber,multiAccountInfo的值,当前员工的staffId做为参数传递到客户信息收集页面
                     同时在收集信息的区域展示当前的媒体名称和账号信息，用户输入手机号码进行信息的收集 */
                    var activeSerialNo = _index.CallingInfoMap.getActiveSerialNo();
                    var callingInfo = _index.CallingInfoMap.get(activeSerialNo);
                    var staffId = _index.getUserInfo().staffId;
                    if (activeSerialNo == undefined || callingInfo == undefined) {
                        return;
                    }
                    var phoneNum = callingInfo.getBindedPhoneNumber();
                    if (phoneNum == undefined) {
                        var callerNo = callingInfo.getCallerNo();
                        if (RegExp("^0?(13|15|17|18|14)[0-9]{9}$").test(callerNo)) {
                            phoneNum = callerNo;
                        }
                    }
                    var mediaType = callingInfo.getMediaType();
                    if (mediaType == mediaConstants.MEDIA_ONLINE_SERVICE) {
                        alert("没有符合收集条件的渠道信息");
                        return;
                    }
                    if (mediaType == undefined || mediaType == "") {
                        alert("没有符合收集条件的渠道信息");
                        return;
                    }
                    var channelId = callingInfo.getChannelID();
                    var accountId = callingInfo.getCallerNo();
                    var contactId = callingInfo.getContactId();
                    var mediaTypeName = callingInfo.getMediaTypeName();
                    var subsNumber = callingInfo.getSubsNumber();
                    if (accountId == undefined || accountId == "") {
                        alert("无法获取要收集的账号");
                        return;
                    }
                    if (mediaTypeName == undefined || mediaTypeName == "") {
                        alert("无法获取要收集的媒体信息");
                        return;
                    }
                    var result = {
                        "channelId": channelId,
                        "accountId": accountId,
                        "phoneNum": phoneNum,
                        "mediaTypeId": mediaType,
                        "mediaTypeName": mediaTypeName,
                        "staffId": staffId,
                        "bindType": mediaConstants.BINDTYPE_PERSONAL,
                        "contactId": contactId,
                        "subsNumber": subsNumber
                    };

                    _index.showDialog({
                        title: '收集客户信息', //弹出窗标题
                        url: 'js/clientInfo/chanleInfo', //要加载的模块
                        param: result, //要传递的参数，可以是json对象
                        width: 800, //对话框宽度
                        height: 400 //对话框高度
                    });
                }
            });
            //更多客户信息
            $("#customer_more").on("click", function (event) {
                var activeSerialNo = _index.CallingInfoMap.getActiveSerialNo();
                var callingInfo = _index.CallingInfoMap.get(activeSerialNo);
                var _custInfo = null;
                if (callingInfo) {
                    var subsNumber = callingInfo.getSubsNumber();
                    _custInfo = callingInfo.getClientInfoMap(subsNumber);
                } else {
                    _custInfo = _index.CallingInfoMap.get("acceptNumber");
                }
                if (_custInfo == null || _custInfo == '' || _custInfo == undefined) {
                    return;
                }
                var html = configMore(_custInfo);
                Util.dialog.bubble({
                    id: "moreClientInfo",
                    element: $(this), //要将气泡弹出在哪个元素上
                    content: html, //气泡内容
                    quickClose: true, //点击页面上其它位置是否关闭气泡 默认为true
                    align: 'bottom'
                });
                if ($(".moreCustInfo_right")) {
                    $.each($(".moreCustInfo_right"), function (index, value) {
                        if ($(".moreCustInfo_right").eq(index).text() == "") {
                            $(".moreCustInfo_right").eq(index).html("--");
                        }
                    })
                }
            });
            //input框回车
            $(".customer_input").on("keydown", $.proxy(function (event) {
                if (event.keyCode == 13) {
                    querySubsNum();
                }
            }, this));

            //"满意度调查"图标点击事件
            $(".customer_Satisfaction").on("click", function (event) {
                var CTIType = "1";
                if (CTIType == "3") {

                } else {
                    var activeSerialNo = _index.CallingInfoMap.getActiveSerialNo();
                    var callingInfo = _index.CallingInfoMap.get(activeSerialNo);
                    if (!callingInfo) {
                        return;
                    }
                    if (callingInfo.getSessionStatus() == "04") {
                        _index.popAlert("客户已经挂断,不可邀请评价");
                        return;
                    }
                    if (callingInfo.getReqEvaluate() == '05') {
                        _index.popAlert("邀请评价已发");
                        return;
                    }

                    var toUserName = callingInfo.getCallerNo();
                    var channelId = callingInfo.getChannelID();
                    var fromUserName = callingInfo.getToUserId();
                    var fromOrgId = callingInfo.getFromOrgId();
                    var clientId = callingInfo.getClientId();
                    var callId = callingInfo.getCallId();
                    var url_satisfaction = "front/sh/media!execute?uid=satisfaction000"; //"front/sh/satisfaction!pushSatisfaction?uid=satisfaction001";
                    var data_satisfaction = {
                        "fromUserName": fromUserName,
                        "toUserName": toUserName,
                        "channelId": channelId,
                        "callID": callId,
                        "fromOrgId": fromOrgId,
                        "clientId": clientId
                    };
                    var _this = this;

                    $.ajax({
                        type: "POST",
                        url: url_satisfaction,
                        data: data_satisfaction,
                        async: true,
                        timeout: 2000,
                        success: function (resultJson) {
                            //var resultJson=JSON.parse(resultJson);
                            if (resultJson.returnCode == mediaConstants.RETURNCODE_NGMMGW) {
                                _index.popAlert("邀请评价下发成功");
                                //更改满意度状态
                                callingInfo.setReqEvaluate(mediaConstants.SATIFATION_STATUS_PUSH);
                                _index.CallingInfoMap.put(serialNo, callingInfo);
                                //根据流水号更新满意度
                                var serialNo = callingInfo.getSerialNo();
                                //邀请已发出，待评价
                                var userSatisfy = mediaConstants.USERSATISFY_PUSH;
                                var data_updateContact = {
                                    "serialNo": serialNo,
                                    "userSatisfy": userSatisfy
                                }
                                Util.ajax.postJson('front/sh/common!execute?uid=touch002', data_updateContact, function (result, status) {
                                });

                            } else {
                                _index.popAlert("邀请评价失败");
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            _index.popAlert("网络异常，邀请评价失败");
                        },
                        complete: function (XMLHttpRequest, status) {
                            if (status == 'timeout') { //超时,status还有success,error等值的情况
                                var errorStr = {
                                    XMLHttpRequest: XMLHttpRequest,
                                    status: status
                                }
                            }
                        }
                    });
                    opserialno = opserialno + 1;
                    if (opserialno > 65535) {
                        opserialno = 1;
                    }
                }
            });
            //受理请求单击事件
            $(".customer_acceRequest").on("click", function (event) {
                _index.main.createTab('受理请求', acceRequestUrl);
            });
            //点击input框搜索
            $(".cust_surch").on("click", $.proxy(function (event) {
                querySubsNum();
            }, this))
        }

        return clientInfo;
    });
