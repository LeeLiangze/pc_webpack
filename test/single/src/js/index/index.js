define(['Util',
    './errorcode/ErrorcodeSearch',
    '../nav/nav',
    '../callHandle/callingInfoMap/CallingInfoMap',
    '../clientInfo/clientInfo',
    '../comMenu/comMenu',
    '../menu/menu',
    '../main/main',
    './postMessage',
    '../callHandle/callData/RoutePackageMap',
    '../callHandle/util/CallDataUtil',
    './showVoiceDialog',
    '../queue/queue',
    '../content/contentCommon',
    '../callHandle/CTIInit/main/CTIInit',
    './enterKey',
    './constants/mediaConstants',
    './serialNumber',
    '../../tpl/index/popAlert.tpl', '../../tpl/index/loading.tpl',
    '../../tpl/index/screen_loading.tpl'
], function (Util, ErrorcodeSearch, Nav, CallingInfoMap, ClientInfo, ComMenu,
             Menu, Main, PostMessage, RoutePackageMap, CallDataUtil,
             ShowVoiceDialog, Queue, ContentCommon, CTIInit, EnterKey, Constants, SerialNumber, popAlertTpl
    , loadingTpl, sreenLoadingTpl) {

    var _userInfo = null, CTIInfo = null, ctiInit = null, _utilJS = null, postMessage = null, _index = null, _dialog = null,
        _nav = null, _comMenu = null, _menu = null, _clientInfo = null, _queue = null, main = null,
        routePackageMap = null, callDataUtil = null;
    //人员权限
    var contactAuth = {sysAuth: '', orgaAuth: '', callPlaceAuth: '', messageAuth: ''};
    //业务树权限
    var treeAuth = {proviceAuth: ''};
    //360视图务受理页面URL
    var DataSourceURL = "";
    //cti信息
    var CTIInfo = {serviceTypeId: ''};
    var $body = $('body'), $topMenu = $('.topMenu'), $com = $('.communication'), $clientInfo = $('.clientInfo'),
        $menu = $('.menu'), $queue = $('.queue'), $main = $('.main');
    //防止人员和cti信息异步导致模块内数据读取不到
    var UserInitFlag = false;
    var CTIInitFlag = false;
    //初始化 initialize之前
    var initialize = function () {
        showLoading(true);
        //内容选项卡区域
        _index = {
            getSourceURL: function () {
                return DataSourceURL;
            },
            getUserInfo: function () {
                return $.extend(_userInfo, {"sysNo": CTIInfo.serviceTypeId});
            },
            getContactAuth: function () {
                return contactAuth;
            },
            getTreeAuth: function () {
                return treeAuth;
            },
            CTIInfo: CTIInfo,
//			ErrorcodeSearch:ErrorcodeSearch(param),
            showDialog: $.proxy(showDialog, this),
            destroyDialog: $.proxy(destroyDialog, this),
            showVoiceDialog: showVoiceDialog,
            popAlert: popAlert,
            showLoading: showLoading,
            screenLoading: screenLoading(),
            backToLogin: backToLogin,
            iframeDialog: iframeDialog,
            layoutChange: layoutChange,
            foldExp: foldExp,
            skinChange: skinChange,
            nav: _nav,
            clientInfo: _clientInfo,
            comMenu: _comMenu,
            menu: _menu,
            queue: _queue,
            ctiInit: ctiInit,
            serialNumber: new SerialNumber(),
            utilJS: _utilJS
        };
        //获取缓存中的员工信息
        systemUserInfoInit.call(this);
        //获取缓存中的CTI信息
        initCTIInfo.call(this);
        //_index扩展属性callingInfoMap
        initCallingInfoMap.call(this);
        initErrorcodeSearch.call(this);
        //获取业360视图务受理页面URL
        getDataSourceURL.call(this);
        //添加跨域传参iframe
        var $iframe = $('<iframe id="releaseSuccess" src="" hidden="true" width="0" height="0"></iframe>');
        $('#ngcsSendMsgIframeDiv').append($iframe);
        //错误码

//		function ErrorcodeSearch(param){
//			return new ErrorcodeSearch(param);
//		}

        routePackageMap = new RoutePackageMap();
        time();
        function time() {
            if (UserInitFlag && CTIInitFlag) {
                // 模块初始化
                subClassInit.call(this);
                //内容区域初始化
                main = new Main({el: '.main', _index: _index});
                main.createTab({
                    title: '客户业务信息1',
                    closeable: false,
                    url: CTIInfo.defaultURL,
                })
                main.currentPanel.glbTab.switchTab(0);
                main.currentPanel.glbTab.items[1].setTab({hideTab: true});
                postMessage = new PostMessage($.extend({}, _index, {
                    iframeDialog: iframeDialog,
                    closeDialog: closeDialog,
                    tips: function (content, delay) {
                        Util.dialog.tips(content, delay)
                    }
                }));
                callDataUtil = new CallDataUtil(_index);

                $.extend(_index, {
                    postMessage: postMessage,
                    routePackageMap: routePackageMap,
                    callDataUtil: callDataUtil,
                    main: main
                });
                postMessage.extend({main: main});

                //加载内容区显示区和客户信息区
                var contentCommon = new ContentCommon({el: '.chatWarp', _index: _index});

                // 初始化布局，初始化为语音A1，接续条上，客户信息左
                _index.layoutChange('yyA-hor');
                // 换肤
                _index.skinChange('default');

                _menu.on('menuItemClick', function (e, obj) {
                    var objUrl;
                    if ((obj.url).indexOf('\\') > 0) {
                        objUrl = (obj.url).replace(/\\/g, "/");//windows路径中的反斜杠'\'替换为正斜杠'/'
                    } else {
                        objUrl = obj.url;
                    }
                    if ("js/communication/huawei/ResetSkill" == obj.url) {
                        //获取签入的技能信息数组
                        var signInSkill = _index.header.communication.getSignInSkills();
                        //获取技能队列信息数组
                        var skillsInfo = _index.header.communication.getSkillInfos();
                        var param = {
                            "signInSkill": signInSkill,
                            "skillsInfo": skillsInfo
                        };
                        if (typeof(skillsInfo) != "undefined") {
                            _index.showDialog({
                                title: '重设技能jl',   //弹出窗标题
                                url: 'js/communication/huawei/ResetSkill',    //要加载的模块
                                param: param,    //要传递的参数，可以是json对象
                                width: 400,  //对话框宽度
                                height: 300  //对话框高度
                            });
                        } else {
                            _index.popAlert("未签入，无法重设技能！");
                        }
                    } else if ("js/communication/huawei/audio/lock/Lock" == obj.url) {
                        var staffStatus = _index.header.communication.getButtonStatus("AgentStatus");
                        if (staffStatus == "Busying" || staffStatus == "CheckOut") {
                            var params = {
                                //title : '系统解锁',
                                url: obj.url,
                                param: obj.text,
                                width: 320,
                                height: 240
                            }
                            var result = _index.showDialog(params);
                        } else {
                            alert("仅忙碌和未签入状态可以锁定");
                        }
                    }
                    else {
                        main.createTab(obj.text, obj.url, obj);
                    }
                });
                return;
            } else {
                setTimeout(time, 200);
            }
        }
    };
    //获取用户信息
    var systemUserInfoInit = function () {
        $.getJSON('../../data/userInfo.json', {}, function (result) {
            if (result.returnCode == 0) {
                _userInfo = result.bean;
                _userInfo.provinceId = _userInfo.proviceId;
                Util.ajax.setUserId(_userInfo.staffId);
                Util.ajax.setProjectCode('ngcs');
                //查询系统数据权限
                var data = {
                    "queryStaffId": result.bean.staffId,
                    "authId": "001002"
                };
                var sysAuth = "";
                $.getJSON('../../data/queryDataAuth.json', data, function (json, status) {
                    if (status) {
                        if (json.beans) {
                            $.each(json.beans, function (n, value) {
                                if (n == (parseInt(json.beans.length) - 1)) {
                                    sysAuth = sysAuth + value.authObjectId;
                                } else {
                                    sysAuth = sysAuth + value.authObjectId + "|";
                                }

                            });
                        }
                        contactAuth.sysAuth = sysAuth;
                    }
                });
                //查询组织数据权限
                var orgaAuth = "";
                var data = {
                    "queryStaffId": result.bean.staffId,
                    "authId": "001003"
                };
                $.getJSON('../../data/queryDataAuth.json', data, function (json, status) {
                    if (status) {
                        if (json.beans) {
                            $.each(json.beans, function (n, value) {
                                if (n == (parseInt(json.beans.length) - 1)) {
                                    orgaAuth = orgaAuth + value.authObjectId;
                                } else {
                                    orgaAuth = orgaAuth + value.authObjectId + "|";
                                }

                            });
                        }
                        contactAuth.orgaAuth = orgaAuth;
                    }
                });

                /* Add by DouHongfei at 2016-10-20 for 接触查询呼叫地权限 start */
                var data = {
                    "queryStaffId": result.bean.staffId,
                    "authId": "001005"
                };
                var callPlaceAuth = "";
                $.getJSON('../../data/queryDataAuth.json', data, function (json, status) {
                    if (status) {
                        if (json.beans) {
                            $.each(json.beans, function (n, value) {
                                if (n == (parseInt(json.beans.length) - 1)) {
                                    callPlaceAuth = callPlaceAuth + value.authObjectId;
                                } else {
                                    callPlaceAuth = callPlaceAuth + value.authObjectId + "|";
                                }

                            });
                        }
                        contactAuth.callPlaceAuth = callPlaceAuth;
                    }
                });
                /* Add by DouHongfei at 2016-10-20 for 接触查询呼叫地权限 end */
                var treeData = {
                    "queryStaffId": result.bean.staffId,
                    "authId": "004001001"
                };
                var proviceAuth = "";
                //业务树权限加载
                $.getJSON('../../data/queryDataAuth.json', treeData, function (json, status) {
                    if (status) {
                        if (json.beans) {
                            $.each(json.beans, function (n, value) {
                                if (n == (parseInt(json.beans.length) - 1)) {
                                    proviceAuth = proviceAuth + value.authObjectId;
                                } else {
                                    proviceAuth = proviceAuth + value.authObjectId + ",";
                                }

                            });
                        }
                        treeAuth.proviceAuth = proviceAuth;
                    }
                });
                $.getJSON('../../data/checkCallOutPerm.json', {"staffId": result.bean.staffId}, $.proxy(function (json, status) {
                    if (json.bean.sengMessflag == true) {
                        contactAuth.messageAuth = true;
                    } else {
                        contactAuth.messageAuth = false;
                    }
                }, this));
                UserInitFlag = true;
            }
        });
    };
    //获取业360视图务受理页面URL
    var getDataSourceURL = function () {
        $.getJSON('../../data/queryCustomerInfoURL.json', {
            "nodeTypeId": "01",
            "serviceTypeId": CTIInfo.serviceTypeId
        }, function (json, status) {
            console.log(status);
            if (status) {
                DataSourceURL = json.beans;
            }
        })
    }
    //CTI信息封装
    var initCTIInfo = function () {
        $.getJSON('../../data/CTI02.json', {}, $.proxy(function (json) {
            if (json.beans[0].password) {
                var pwd = json.beans[0].password;
                var mark = json.beans[0].mark;
                var marks = mark.split(":");
                var password = "";
                for (var i = 0; i < marks.length; i++) {
                    var p = pwd.charAt(marks[i]);
                    password += p;
                }
                json.beans[0].password = password;
            }
            ;
            $.extend(CTIInfo, json.beans[0]);
            $.extend(_index, {CTIInfo: json.beans[0]});
            CTIInitFlag = true;
        }, this), true)
    }
    //callinginfomap初始化
    var initCallingInfoMap = function () {
        $.extend(_index, {CallingInfoMap: new CallingInfoMap()});
    }
    var initErrorcodeSearch = function () {
        $.extend(_index, {ErrorcodeSearch: new ErrorcodeSearch()});
    }
    // 模块初始化
    var subClassInit = function () {
        // 接续条
        _comMenu = new ComMenu(_index);
        $com.empty().append(_comMenu.$el);
        $.extend(_index, {comMenu: _comMenu});
        //获取当前时间
        _utilJS = new EnterKey();
        $.extend(_index, {utilJS: _utilJS});
        //CTI初始化
        ctiInit = new CTIInit(_index);
        $.extend(_index, {ctiInit: ctiInit});
        // 头部
        _nav = new Nav(_index);
        $topMenu.empty().append(_nav.$el);
        $.extend(_index, {nav: _nav});
        // 菜单
        _menu = new Menu(_index);
        $menu.empty().append(_menu.$el);
        $.extend(_index, {menu: _menu});
        // 客户信息
        _clientInfo = new ClientInfo(_index);
        $clientInfo.empty().append(_clientInfo.$el);
        _clientInfo._timerWait();
        $.extend(_index, {clientInfo: _clientInfo});
        _clientInfo.on('acceptNumberChange', function (data) {
            postMessage.trigger('acceptNumberChange', data, true);
        });
        // 队列
        _queue = new Queue(_index);
        // $.extend(_index, {queue:_queue});
        _index.queue = _queue;
        _queue.on('itemClick', function (e, options) {
            var serialNo = options.serialNo;
            //触发其他模块action
        })
        $queue.empty().append(_queue.$el);
        $.extend(_index, {queue: _queue});
    }
    //布局切换
    var layoutChange = function (data) {
        $body.removeClass('yyA-hor yyA-ver yyB-hor yyB-ver internet-hor internet-ver admin');
        $body.addClass(data);
        if (data == 'yyA-hor') {
//			var screenWidth = (screen.availWidth - 435) + "px";
//			$(".menuConfig").css("width",screenWidth);
            // $('.communication').layoutChange('hor');
            // $('.clientInfo').layoutChange('detail');
            $com.removeClass('hor ver logo').addClass('hor');
            $clientInfo.removeClass('detail brief').addClass('detail');
            $('.uiTab .uiTabBody .uiTabItemBody').eq(0).hide();
            $('.uiTab .uiTabHead .uiTabItemHead').eq(0).hide();
            $clientInfo.find("#queue_skills_info").removeClass().addClass("yyskills");
        } else if (data == 'yyA-ver') {
//			var screenWidth = (screen.availWidth - 505) + "px";
//			$(".menuConfig").css("width",screenWidth);
            // $('.communication').layoutChange('ver');
            // $('.clientInfo').layoutChange('detail');
            $com.removeClass('hor ver logo').addClass('ver');
            $clientInfo.removeClass('detail brief').addClass('detail');
            $('.uiTab .uiTabBody .uiTabItemBody').eq(0).hide();
            $('.uiTab .uiTabHead .uiTabItemHead').eq(0).hide();
            $clientInfo.find("#queue_skills_info").removeClass().addClass("yyskills");
        } else if (data == 'yyB-hor') {
//			var screenWidth = (screen.availWidth - 435) + "px";
//			$(".menuConfig").css("width",screenWidth);
            // $('.communication').layoutChange('hor');
            // $('.clientInfo').layoutChange('brief');
            $com.removeClass('hor ver logo').addClass('hor');
            $clientInfo.removeClass('detail brief').addClass('brief');
            $('.uiTab .uiTabBody .uiTabItemBody').eq(0).hide();
            $('.uiTab .uiTabHead .uiTabItemHead').eq(0).hide();
            $clientInfo.find("#queue_skills_info").removeClass().addClass("yyskills");
        } else if (data == 'yyB-ver') {
//			var screenWidth = (screen.availWidth - 505) + "px";
//			$(".menuConfig").css("width",screenWidth);
            // $('.communication').layoutChange('ver');
            // $('.clientInfo').layoutChange('brief');
            $com.removeClass('hor ver logo').addClass('ver');
            $clientInfo.removeClass('detail brief').addClass('brief');
            $('.uiTab .uiTabBody .uiTabItemBody').eq(0).hide();
            $('.uiTab .uiTabHead .uiTabItemHead').eq(0).hide();
            $clientInfo.find("#queue_skills_info").removeClass().addClass("yyskills");
        } else if (data == 'internet-hor') {
//			var screenWidth = (screen.availWidth - 435) + "px";
//			$(".menuConfig").css("width",screenWidth);
            // $('.communication').layoutChange('hor');
            $com.removeClass('hor ver logo').addClass('hor');
            $clientInfo.removeClass('detail brief').addClass('brief');
            $('.uiTab .uiTabBody .uiTabItemBody').eq(0).show();
            $('.uiTab .uiTabHead .uiTabItemHead').eq(0).show();
            $clientInfo.find("#queue_skills_info").removeClass().addClass("noyy");
        } else if (data == 'internet-ver') {
//			var screenWidth = (screen.availWidth - 505) + "px";
//			$(".menuConfig").css("width",screenWidth);
            // $('.communication').layoutChange('ver');
            $com.removeClass('hor ver logo').addClass('ver');
            $clientInfo.removeClass('detail brief').addClass('brief');
            $('.uiTab .uiTabBody .uiTabItemBody').eq(0).show();
            $('.uiTab .uiTabHead .uiTabItemHead').eq(0).show();
            $clientInfo.find("#queue_skills_info").removeClass().addClass("noyy");
        } else if (data == 'admin') {
//			var screenWidth = (screen.availWidth - 435) + "px";
//			$(".menuConfig").css("width",screenWidth);
            $com.removeClass('hor ver logo').addClass('logo');
            $clientInfo.removeClass('detail brief').addClass('disap');
            $('.uiTab .uiTabBody .uiTabItemBody').eq(0).hide();
            $('.uiTab .uiTabHead .uiTabItemHead').eq(0).hide();
        }
        if (_clientInfo) {
            $(".customer_info").empty();
            _clientInfo.initClientInfo(data);
            if (_index.CallingInfoMap) {
                var activeSerialNo = _index.CallingInfoMap.getActiveSerialNo();
                var callingInfo = _index.CallingInfoMap.get(activeSerialNo);
                if (callingInfo) {
                    var mediaTypeId = callingInfo.getMediaType();
                    var phoneNum = callingInfo.getSubsNumber();
                    if (phoneNum == undefined) {
                        var callerNo = callingInfo.getCallerNo();
                        if (RegExp("^0?(13|15|17|18|14)[0-9]{9}$").test(callerNo)) {
                            phoneNum = callerNo;
                        } else {
                            phoneNum = '';
                        }
                    }
                    _clientInfo.initCustInfo(phoneNum);
                }
            }
        }
    }
    // 展开折叠
    var foldExp = function (source) {
        if ('queue' === source) {
            modPosChange($menu, 20, 100);//移动模块
            modPosChange($main, 0, -100);//移动模块
        } else if ('clientInfo' === source) {
            modPosChange($main, 0, -100);//移动模块
        }
    }
    //移动模块位置,for折叠展开
    var modPosChange = function (obj, paramTop, paramLeft) {
        var offSet = obj.offset();
        var topValue = offSet.top + Number(paramTop);
        var leftValue = offSet.left + Number(paramLeft);
        obj.offset({top: topValue, left: leftValue});
    }
    // 皮肤切换默认default 绿色green 黑金black-golden
    var skinChange = function (data) {
        $com.removeClass('default green black-golden').addClass(data);
        $menu.removeClass('default green black-golden').addClass(data);
        $clientInfo.removeClass('default green black-golden').addClass(data);
    }

    function showVoiceDialog(param) {
        var showVoiceDialog = new ShowVoiceDialog(param);
    }

    function backToLogin() {
        window.location.href = '/ngcs/';
    }

    //打开显示模块弹框
    var showDialog = function (title, url, param) {
        // var dialogUrl = './dialog';
        // require.undef(dialogUrl);
        require(['./dialog'], function (Dialog) {
            var config = {};
            if (typeof(title) == 'object') {
                config = title;
                config.businessOptions = title.param;
                config.index = _index;
            } else {
                config = {
                    title: title,
                    url: url,
                    businessOptions: param,
                    index: _index
                }
            }
            _dialog = new Dialog(config);
        });
    };

    //移除模块弹框
    var destroyDialog = function () {
        if (_dialog && _dialog.dialog) {
            _dialog.dialog.remove();
        } else {
            $(".ui-popup-backdrop").css("display", "none");//关闭背景蒙版
            $(".ui-popup-show").remove();
        }
        _dialog = null;
    };


    //登录后的loading页面
    function showLoading(flag) {
        if (flag) {
            $('.newJZ').show();
        } else {
            $('.newJZ').remove();
        }
    }

    //提交数据的loading页面
    function screenLoading() {
        var $body = $("body"),
            loadingFun = function (is_show, text) {
                var $loading = $(".Js_screen-loading");
                if (is_show) {
                    if ($loading.length) {
                        $loading.eq(0).show()
                    } else {
                        var loadingHtml = Util.hdb.compile(sreenLoadingTpl);
                        $body.append(loadingHtml({text: text}))
                    }
                } else {
                    $loading.remove();
                }
            };

        return {
            show: function (text) {
                loadingFun(true, text)
            },
            hide: function () {
                loadingFun()
            }
        }
    }

    //弹出右下提示框 popAlert("sdfsdfsdf",'test');
    function popAlert(content, title, callback, isfadeout) {
        var warp = '<div class="pop-alert-warp" ><div id="popAlertId" class="pop-alert"></div></div>',
            $body = $("body"), $warp = $body.find("#popAlertId");
        var listTpl = Util.hdb.compile(popAlertTpl);
        if (!content) return false;
        if (!$warp.length) {
            $body.append(warp);
            $warp = $body.find("#popAlertId");
        }
        $warp.prepend(listTpl({title: title ? title : '提示', content: content}));
        var list = $warp.children().eq(0);
        list.find(".js-content").animate({"top": 0}, 1000);
        if (isfadeout) {
            setTimeout(function () {
                list.fadeOut(1500);
                var contents = list.find(".js-content");
                contents.click(function (e, obj) {
                    list.fadeOut(500);
                    callback && callback(e);
                })
            }, 6000)
        } else {
            setTimeout(function () {
                list.fadeOut(1500);
                callback && callback();
            }, 4000)
        }
    }

    //打开一个iframe弹框
    function iframeDialog(params) {
        var config = $.extend({
            id: params.id,
            fixed: params.fixed,
            title: params.title
        }, params);
        config.onclose = function () {
            var _thisDialog = dialog.get(params.id);
            if (_thisDialog) {
                _thisDialog.close().remove();
            }
            //postMessage.trigger("dialogClose",params.id,_thisDialog.param);
            params.onclose && params.onclose()
        };
        _dialogId = config.id;
        postMessage.setIfram(config);
        var d = dialog(config);
        (params.modal) ? (d.showModal()) : (d.show());
    }

    //打开一个iframe弹框
    function closeDialog(id, param) {
        id = id ? id : _dialogId;
        var _thisDialog = dialog.get(id);
        if (_thisDialog) {
            _thisDialog.param = param;
            _thisDialog.close().remove();
            if ($('iframe[name="callEndPopupDialog"]').length) {
                $('iframe[name="callEndPopupDialog"]').remove();
            }
            (id == true || arguments[1] == true || arguments[2] == true) || postMessage.trigger("dialogClose", param);
        }
    }

    //定义加载页面时执行的方法
    $("body").ready(function () {
        var screenHeight = (screen.availHeight - 50) + "px";
        $(".newJZ").css("height", screenHeight);
    })
    $(function () {
        //屏蔽鼠标右键
        document.oncontextmenu = function (e) {
            e = e || window.event;
            e.returnValue = false;
        }
    });
    initialize();
});
