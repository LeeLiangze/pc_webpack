define(['Util', 'jquery.placeholder', "../index/constants/mediaConstants", '../comMenu/callHold/callHold', '../comMenu/callMute/callMute', '../../tpl/menu/menu.tpl', '../../tpl/menu/menuConfig.tpl', '../../tpl/menu/topMenu.tpl',
        '../../tpl/menu/topMenuLevelOne.tpl', '../../tpl/menu/topMenuLevelTwo.tpl',
        '../../assets/css/menu/menu.css', '../../assets/css/menu/iconfont-menu/iconfont.css'
    ],
    function (Util, placeholder, MediaConstants, CallHold, CallMute, tpl, menuConfig, topMenu, topMenuLevelOne, topMenuLevelTwo) {
        //初始化 initialize之前
        var index, _tips, $el = $(tpl), comUI = null, allMenu, _signResult, callHold, callMute, ITEMID = MediaConstants.ITEMID, numM;
        var objClass = function (options) {
            this.$el = $el;
            this.options = options;
            index = this.options;
            comUI = index.comMenu.comUI;
            CTIID = index.CTIInfo.CTIId;
            ip = index.CTIInfo.IP;
            port = index.CTIInfo.port;
            proxyIP = index.CTIInfo.ProxyIP;
            proxyPort = index.CTIInfo.ProxyPort;
            isDefault = index.CTIInfo.isDefault;
            // placeholder兼容性
            $('.menuInput>input', $el).placeholder();
            // 增加事件处理
            Util.eventTarget.call(this);
            // 事件处理
            eventInit.call(this);
            // 菜单初始化
            menuInit.call(this);
        };

//对外暴漏接续在三级菜单不可点方法
        $.extend(objClass.prototype, Util.eventTarget.prototype, {
            //登录签入失败
            notClick1: function () {
                for (var i = 0; i < $(".subMenu li a").length; i++) {
                    if ($(".subMenu li a").eq(i).attr("menuFlag") != "0") {
                        var names = $.trim($(".subMenu li a").eq(i).html());
                        switch (names) {
                            case "综合接续":
                                this.falses(i);
                                break;
                            case "整理态":
                                this.falses(i);
                                break;
                            case "示忙":
                                this.falses(i);
                                break;
                            case "示闲":
                                this.falses(i);
                                break;
                            case "休息":
                                this.falses(i);
                                break;
                            case "签入":
                                this.falses(i);
                                break;
                            case "签出":
                                this.falses(i);
                                break;
                            case "结束会话":
                                this.falses(i);
                                break;
                            case "密码验证":
                                this.falses(i);
                                break;
                            case "转接专席":
                                this.falses(i);
                                break;
                            case "开始静音":
                                this.falses(i);
                                break;
                            case "取消静音":
                                this.falses(i);
                                break;
                            case "通话保持":
                                this.falses(i);
                                break;
                            case "恢复通话":
                                this.falses(i);
                                break;
                            case "外呼":
                                this.falses(i);
                                break;
                            default:
                                break;
                        }
                    }
                }
            },
            //非语音不可点击
            notClick2: function () {
                for (var i = 0; i < $(".subMenu li a").length; i++) {
                    if ($(".subMenu li a").eq(i).attr("menuFlag") != "0") {
                        var names = $.trim($(".subMenu li a").eq(i).html());
                        switch (names) {
                            case "结束会话":
                                this.falses(i);
                                break;
                            case "密码验证":
                                this.falses(i);
                                break;
                            case "转接专席":
                                this.falses(i);
                                break;
                            case "开始静音":
                                this.falses(i);
                                break;
                            case "取消静音":
                                this.falses(i);
                                break;
                            case "通话保持":
                                this.falses(i);
                                break;
                            case "恢复通话":
                                this.falses(i);
                                break;
                            default:
                                break;
                        }
                    }
                }
            },
            //成功签出
            notClick3: function () {
                for (var i = 0; i < $(".subMenu li a").length; i++) {
                    if ($(".subMenu li a").eq(i).attr("menuFlag") != "0") {
                        var names = $.trim($(".subMenu li a").eq(i).html());
                        switch (names) {
                            case "综合接续":
                                this.falses(i);
                                break;
                            case "整理态":
                                this.falses(i);
                                break;
                            case "示忙":
                                this.falses(i);
                                break;
                            case "示闲":
                                this.falses(i);
                                break;
                            case "休息":
                                this.falses(i);
                                break;
                            case "签出":
                                this.falses(i);
                                break;
                            case "结束会话":
                                this.falses(i);
                                break;
                            case "密码验证":
                                this.falses(i);
                                break;
                            case "转接专席":
                                this.falses(i);
                                break;
                            case "开始静音":
                                this.falses(i);
                                break;
                            case "取消静音":
                                this.falses(i);
                                break;
                            case "通话保持":
                                this.falses(i);
                                break;
                            case "恢复通话":
                                this.falses(i);
                                break;
                            case "外呼":
                                this.falses(i);
                                break;
                            default:
                                break;
                        }
                    }
                }
            },
            //是语音
            notClick4: function () {
                for (var i = 0; i < $(".subMenu li a").length; i++) {
                    if ($(".subMenu li a").eq(i).attr("menuFlag") != "0") {
                        var names = $.trim($(".subMenu li a").eq(i).html());
                        switch (names) {
                            case "结束会话":
                                this.trues(i);
                                break;
                            case "密码验证":
                                this.trues(i);
                                break;
                            case "转接专席":
                                this.trues(i);
                                break;
                            case "开始静音":
                                this.trues(i);
                                break;
                            case "取消静音":
                                this.trues(i);
                                break;
                            case "通话保持":
                                this.trues(i);
                                break;
                            case "恢复通话":
                                this.trues(i);
                                break;
                            case "外呼":
                                this.trues(i);
                                break;
                            default:
                                break;
                        }
                    }
                }
            },
            //签出后再成功签入
            notClick5: function () {
                for (var i = 0; i < $(".subMenu li a").length; i++) {
                    if ($(".subMenu li a").eq(i).attr("menuFlag") != "0") {
                        var names = $.trim($(".subMenu li a").eq(i).html());
                        switch (names) {
                            case "综合接续":
                                this.trues(i);
                                break;
                            case "整理态":
                                this.trues(i);
                                break;
                            case "示忙":
                                this.trues(i);
                                break;
                            case "示闲":
                                this.trues(i);
                                break;
                            case "休息":
                                this.trues(i);
                                break;
                            case "签出":
                                this.trues(i);
                                break;
                            case "外呼":
                                this.trues(i);
                                break;
                            default:
                                break;
                        }
                    }
                }
            },
            //封装不可点击方法
            falses: function (num) {
                $(".subMenu li a").eq(num).parents(".navRightMenu .menuItem .subMenu dl .menuDd").removeClass("menuDd");
                $(".subMenu li a").eq(num).css("cursor", "default");
                $(".subMenu li a").eq(num).css('color', 'rgb(191,191,191)');
                $(".subMenu li a").eq(num).parent(".navRightMenu .menuItem .subMenu dl .liMenu").removeClass("liMenu");
            },
            //封装可点击方法
            trues: function (num) {
                $(".subMenu li a").eq(num).parents(".navRightMenu .menuItem .subMenu dl dd").addClass("menuDd");
                $(".subMenu li a").eq(num).css("cursor", "pointer");
                $(".subMenu li a").eq(num).css('color', '#222');
                $(".subMenu li a").eq(num).parent(".navRightMenu .menuItem .subMenu dl .liMenu").addClass("liMenu");
            }
        });

        var menuLoad = function (keyword, callback) {
            _this = this;
            var jsonpHash = 8080, jsonpRoot = '', jsonpHost = 'localhost';
            var portHash = window.location.hash.slice(1);
            portHash || (portHash = window.location.search.slice(1));
            $.each(portHash.split("&"), function (key, val) {
                (val.indexOf("port=") > -1) && (jsonpHash = val.split("port=")[1]);
                (val.indexOf("root=") > -1) && (jsonpRoot = '/' + val.split("root=")[1]);
                (val.indexOf("host=") > -1) && (jsonpHost = val.split("host=")[1]);
            });
            // 全部菜单数据加载
            // $.getJSON('../../../data/menuConfig.json',{staffId:staffId,toolBarType:'01'}, $.proxy(function(json,status){
            Util.ajax.getJsonp("http://" + jsonpHost + ":" + jsonpHash + jsonpRoot + "/debugMenu.js", {'keyword': keyword}, $.proxy(function (json, status) {
                if (status) {
                    allMenu = json.beans;
                    var menuLevelOneTemplate = Util.hdb.compile(topMenuLevelOne);
                    var menuLevelTwoTemplate = Util.hdb.compile(topMenuLevelTwo);
                    $('.topNavMenu', _tips.$el).html(menuLevelOneTemplate(json));
                    $('.navRightMenu', _tips.$el).html(menuLevelTwoTemplate(json));
                    var $menuItems = $(".navRightMenu .menuItem", _tips.$el);
                    $menuItems.eq(0).show();
                    $('.topNavMenu li', _tips.$el).eq(0).addClass('selected');
                    callback && callback();
                    borderColor = $(".menuSource", this.$el).css('backgroundColor');
                    for (var i = 0; i < $(".subMenu li a").length; i++) {
                        if ($(".subMenu li a").eq(i).attr("menuFlag") == "0") {
                            $(".subMenu li a").eq(i).css("display", "none");
                        }
                    }
                    for (var i = 0; i < $(".subMenu dl dt").length; i++) {
                        if ($(".subMenu dl dt").eq(i).attr("menuFlag") == "0") {
                            $(".subMenu dl").eq(i).css("display", "none");
                        }
                    }
                    for (var i = 0; i < $(".topNavMenu>ul>li").length; i++) {
                        if ($(".topNavMenu>ul>li").eq(i).attr("menuFlag") == "0") {
                            $(".topNavMenu>ul>li").eq(i).css("display", "none");
                        }
                    }
                    index.menu.notClick2();
                } else {
                    console.log('查询失败')
                }
            }, this));
            // 配置菜单数据加载
            // front/sh/common!shortCutMenu?uid=l0002，data/menuConfig.json index.getUserInfo().staffId
            var staffId = index.getUserInfo().staffId;
            $.getJSON("../../data/menu/menuConfig.json", {
                staffId: staffId,
                toolBarType: '01'
            }, $.proxy(function (json, status) {
                if (status) {
                    var template = Util.hdb.compile(menuConfig);
                    var $con = $('.menuConfig', this.$el);
                    $con.html(template(json));
                    var menuObj = $('.menuConfig', this.$el)[0];
                    var menuNums = json.beans.length;
                    numM = menuNums;
                    for (var i = 0; i < $(".menuVisible>li").length; i++) {
                        if ($(".menuVisible>li").eq(i).find(".shortCut").find("li").css("display") == "none") {
                            $(".menuVisible>li").eq(i).find(".shortCut").css("border", "0px");
                        }
                    }
                    // 配置菜单数据太多时添加对应皮肤的滑动块 menuObj.scrollWidth json.beans.length*105
                    if (menuObj.offsetWidth < menuNums * 110) {
                        $con.prepend('<div class="menuLeft"><img src="src/assets/img/menu/arrow-left.png"></div>');
                        $con.append('<div class="menuRight"><img src="src/assets/img/menu/arrow-right.png"></div>');
                    }
                } else {
                }
            }, this));
            //系统参数获取ITEMID:'129001001',
            $.getJSON("../../data/menu/menuVisible.json", {"itemId": ITEMID}, $.proxy(function (json, status) {
                if (status) {
                    for (var i = 0; i < $(".menuVisible>li").length; i++) {
                        var len = $(".menuVisible>li").eq(i).find("li").length;
                        var num = json.bean.value;
                        var widths = 34 * num + "px";
                        var widMin = 34 * len + "px";
                        if (len < num) {
                            $(".menuVisible>li").eq(i).find(".shortCut").css("height", widMin);
                        } else {
                            $(".menuVisible>li").eq(i).find(".shortCut").css("height", widths);
                        }
                    }
                }
            }, this));
            // 菜单搜索下拉框数据获取
            $.getJSON("../../data/menu/queryAllBizTypes.json", '', $.proxy(function (json, status) {
                if (status) {
                    var $obj = $('.search-options', this.$el);
                    $obj.html('');
                    $.each(json.beans, $.proxy(function (i, item) {
                        $obj.append('<li data-id=' + item.serchTypeCd + ' data-url=' + item.serchUrlAddr + '>' + item.serchTypeNm + '</li>');
                    }, this));
                } else {
                }
            }, this));
        };
        // 菜单初始化
        var menuInit = function (main) {
            var template = Util.hdb.compile(topMenu);
            var $content = $(template({}));
            // 全部菜单点击
            var tips = new Util.tips({
                container: $(".menuSource", this.$el),
//            action:'click',
                positionLeft: $('.menu').offset().left,
                content: $content    //handlebars模板数据渲染
            });
            // shortBox显隐 xxq
            $(".menuSource", this.$el).on("click", function (e) {
                if ($(".shortBox", this.$el).css("display") == "none") {
                    $(".shortBox", this.$el).css("display", "block");
                    var msbc = $(".menuSource", this.$el).css('backgroundColor');
                    $(".popLayout", _tips.$el).css('borderColor', msbc);
                } else {
                    $(".shortBox", this.$el).css("display", "none");
                }
//        	$(".shortBox",this.$el).toggle();
//        	 var e = e || window.event;
//        	 e.stopPropagation();
                _signResult = index.ctiInit.stateNum();
                switch (_signResult) {
                    case "0"://0:签出成功
                        index.menu.notClick3();//不可点
                        break;
                    case "00" ://00:签入成功
                        index.menu.notClick5();//恢复可点
                        break;
                    case "WAIT_SIGNIN"://"WAIT_SIGNIN"：等待签入
                        index.menu.notClick1();//不可点
                        break;
                    case "01"://01:签入失败
                        index.menu.notClick1();//不可点
                        break;
                    case "1"://1：签出失败
                        index.menu.notClick5();
                        break;
                    default:
                        break;
                }
            })
            _tips = tips;
            var msbc = $(".menuSource", this.$el).css('backgroundColor');
            $(".popLayout", _tips.$el).css('borderColor', msbc);
            //左边菜单切换
            _tips.$el.on('mouseenter', '.topNavMenu li', function (e) {
                var $menuItems = $(".navRightMenu .menuItem", _tips.$el);
                var $src = $(e.currentTarget);
                $src.addClass("selected").siblings().removeClass("selected");
                var index = $src.index();
                $menuItems.eq(index).show().siblings().hide();
            });
            // 三级菜单打开
            _tips.$el.on('mouseleave', '.shortBox', function () {
                $('.popLayoutWaep', this.$el).hide();
                $(".shortBox", this.$el).css("display", "none");
            });
            _tips.$el.on('click', '.navRightMenu .menuItem .subMenu dl .menuDd a', $.proxy(function (e) {
                var $item = $(e.currentTarget);
                $item.closest(".popLayoutWaep").hide();
                var text = $.trim($item.text());
                var str = $item.attr('data-url').replace(/\[(f|F)rame(s|S)erver(h|H)ost\]/, window.location.host);
                var id = $item.attr('data-id');
                var openMode = $item.attr('data-openMode');
                var e = e || window.event;
                e.stopPropagation();
                //调用打开方式方法
                menuJs(openMode, text, str);
            }, this));
            $('body').on('click', function () {
                $('.menuInput>input', this.$el).val("请输入关键字");
                $(".search-img", this.$el).show();
            })
            menuLoad.call(this);
        };
        var eventInit = function () {
            // 配置菜单项点击效果，包括配置菜单和子菜单的点击事件
            this.$el.on('click', '.menuVisible li', function (e) {
                $('.shortCut', this.$el).css('display', 'none');//shortCut隐藏
                var len = $(this).find("ul li").length;
                //系统参数获取
                Util.ajax.postJson('front/sh/common!execute?uid=s007', {'itemId': ITEMID}, $.proxy(function (json, status) {
                    if (status) {
                        for (var i = 0; i < $(".menuVisible>li").length; i++) {
                            var len = $(".menuVisible>li").eq(i).find("li").length;
                            var num = json.bean.value;
                            var widths = 34 * num + "px";
                            var widMin = 34 * len + "px";
                            if (len < num) {
                                $(".menuVisible>li").eq(i).find(".shortCut").css("height", widMin);
                            } else {
                                $(".menuVisible>li").eq(i).find(".shortCut").css("height", widths);
                            }
                        }
                    }
                }, this));
                var $obj = $(e.currentTarget);
                $obj.addClass('hov').siblings().removeClass('hov');
                var ox = $obj.offset().left;
                $obj.find('.shortCut').toggle();
                $obj.find('.shortCut').offset({left: ox});
                $obj.siblings().find('.shortCut').css('display', 'none');
                $('.menuVisible').css('overflow', 'visible');
                var msbc = $(".menuMain", this.$el).css('backgroundColor');
                $(".shortCut", this.$el).css('borderColor', msbc);
                var e = e || window.event;
                e.stopPropagation();
                var text = $.trim($obj.text());
                var openMode = $obj.attr("data-openMode");
                var str = $obj.attr('data-url').replace(/\[(f|F)rame(s|S)erver(h|H)ost\]/, window.location.host);
                if ($obj.attr("data-url") != "") {
                    //调用打开方式方法
                    menuJs(openMode, text, str);
                }
            });
            this.$el.on("mouseleave", ".menuVisible>li", function () {
                $('.shortCut', this.$el).hide();
            })
//        this.$el.on('click','.shortCut li', $.proxy(function(e){
            //点击shortCut隐藏 xxq
//        	$('.shortCut',this.$el).css('display','none');
//            var $item = $(e.currentTarget);
//            var text = $item.text();
//            var str = $item.attr('data-url').replace(/\[(f|F)rame(s|S)erver(h|H)ost\]/, window.location.host);
//            var id = $item.attr('data-id');
//            var openMode = $item.attr('data-openMode');
//            e.stopPropagation();
            //调用打开方式方法
//            menuJs(openMode,text,str);
//        },this));
            // 配置菜单过多时配置菜单栏向左滑动
            this.$el.on('click', '.menuLeft', function () {
                var b = $('.menuVisible', this.$el).position().left;
                if (b >= -50) {
                    $('.menuVisible', this.$el).css("left", "30px");
                } else {
                    $('.menuVisible', this.$el).animate({left: '+=102px'}, 120);
                }
            });
            // 配置菜单过多时配置菜单栏向右滑动
            this.$el.on('click', '.menuRight', function () {
                var b = $('.menuVisible', this.$el).position().left;
                if ((b + 10) <= -($('.menuVisible li', this.$el).width() * (numM + 1) - $(".menuConfig").width())) {
                    var c = -($('.menuVisible li', this.$el).width() * (numM + 1) - $(".menuConfig").width() + 50) + "px";
                    $('.menuVisible', this.$el).css("left", c);
                } else {
                    $('.menuVisible', this.$el).animate({left: '-=102px'}, 120);
                }
            });

            // ul模拟下拉框事件处理
            this.$el.on('click', '.menu-select', function (e) {
                $('.search-options', this.$el).toggle();
                var bc = $(".menuMain", this.$el).css('backgroundColor');
                $(".search-options").css('borderColor', bc);
                var e = e || window.event;
                e.stopPropagation();
            });
            // ul模拟下拉框事件"选中"
            this.$el.on('click', '.search-options li', function (e) {
                var e = e || window.event;
                e.stopPropagation();
                var o = $(e.currentTarget);
                var text = $.trim(o.text());
                var url = o.attr('data-url');
                var id = o.attr('data-id');
                var om = o.attr('data-om');
                $('.menu-select>span', this.$el).text(text);
                $('.menu-select>span', this.$el).attr({"data-url": url, "data-id": id, "data-om": om});
                $('.search-options', this.$el).hide();
                $(".search-img", this.$el).show();
                $('.menuInput>input', this.$el).val("请输入关键字");
//            if(text == "全部菜单"){ 
//            	$(".search-img",this.$el).hide();
//            }else{
//            	$(".search-img",this.$el).show();
//            }
            });
            this.$el.on("click", ".menuInput>input", function (e) {
                var e = e || window.event;
                e.stopPropagation();
                var kw = $.trim($(e.currentTarget).val());
                if (kw == "请输入关键字" || kw == "") {
                    $(e.currentTarget).val("");
                } else {
                    search(e, kw);
                }
            })
            this.$el.on("mouseleave", ".menuSearch", function () {
                $('#append', this.$el).hide();
                $(".search-options", this.$el).hide();
            })
            // 下拉框全部菜单搜索
            this.$el.on('keyup', '.menuInput input', function (e) {
//                alert("123");
                var e = e || window.event;
                $(this).css("color", "black");
                var sel = $('.menu-select>span', this.$el);
                var text = $.trim(sel.text());
                var id = sel.attr('data-id');
                var kw = $.trim($(e.currentTarget).val());
                if (kw == "") {
                    $("#append").hide().html("");
                    $(".search-img", this.$el).show();
                    return false;
                } else {
                    $(".search-img", this.$el).hide();
                }
                var bc = $(".menuMain", this.$el).css('backgroundColor');
                $("#append").css('borderColor', bc);
                if (id == "01") {
                    search(e, kw);
                }
                var e = e || window.event;
                e.stopPropagation();
            });
            // 搜索图标搜索其它模块，eg知识库
            this.$el.on('click', '.search-img', $.proxy(function (e) {
                var e = e || window.event;
                e.stopPropagation();
                var sel = $('.menu-select>span', this.$el);
                var id = sel.attr('data-id');
                var kw = $.trim($(e.currentTarget).val());
                if (kw != "" && id != '01') {
                    var text = $.trim(sel.text());
                    var id = sel.attr('data-id');
                    var url = sel.attr('data-url').replace(/\[(f|F)rame(s|S)erver(h|H)ost\]/, window.location.host);
                    index.main.createTab(text, url, {'keyword': kw});
                } else if (id == "01") {
                    search(e, "");
                }
            }, this));
            // enter键打开搜索菜单
            /*this.$el.on('keydown', '.menuInput input', function(e){
             e = e || window.event;
             var keycode = e.which ? e.which : e.keyCode;
             if(keycode == 13){
             console.log('enter');
             }
             });*/
            // 打开全部菜单搜索结果中的菜单 dblclick
            this.$el.on('click', '.item', $.proxy(function (e) {
                $("#append", this.$el).hide();
                $(".menuInput input", this.$el).css("color", "black");
                var $item = $(e.currentTarget);
                var text = $.trim($item.text());
                $('.menuInput>input', this.$el).val(text);
                var str = $item.attr('data-url').replace(/\[(f|F)rame(s|S)erver(h|H)ost\]/, window.location.host);
                var id = $item.attr('data-id');
                var openMode = $item.attr('data-openMode');
                var e = e || window.event;
                e.stopPropagation();
                //调用打开方式方法
                menuJs(openMode, text, str);
            }, this));
            this.$el.on('mouseenter', '.item', function (e) {
                $(".item").removeClass("addbg");
                $(e.currentTarget).addClass("addbg");
            });
        }
        //定义菜单执行js函数的方法
        var menuJs = function (openMode, text, str) {
            if (openMode == "N") {//Tab
                index.main.createTab(text, str);
            } else if (openMode == "Y") {//window.open
                window.open(str);
            } else if (openMode == "P") {//showDialog
                var str1 = str.split("?");
                var url = str1[0];
                var wh = str1[1].split("&");
                var widths = wh[0].split("=")[1];
                var heights = wh[1].split("=")[1];
                index.showDialog({
                    title: text,   //弹出窗标题
                    url: url,//要加载的模块
                    param: {},    //要传递的参数，可以是json对象
                    width: widths,  //对话框宽度
                    height: heights  //对话框高度
                });

            } else if (openMode == "F") {//弹出菜单
                callHold = new CallHold(index);
                callMute = new CallMute(index);
                switch (text) {
                    case "通话保持":
                        callHold.callHold();
                        break;
                    case "恢复通话":
                        callHold.cancelHold();
                        break;
                    case "开始静音":
                        callMute.startMute();
                        break;
                    case "取消静音":
                        callMute.cancelMute();
                        break;
                    case "取消求助":
                        require(['../comMenu/interHelp/cancelInterHelp'], function (cancelInterHelp) {
                            new cancelInterHelp(index);
                        });
                        break;
                    case "外部求助":
                        require(['../comMenu/callOutHelp/callOutHelpDeal'], function (CallOutHelp) {
                            new CallOutHelp(index);
                        });
                        break;
                    case "有铃":
                        require(['../comMenu/isRing/Ring'], function (Ring) {
                            new Ring(index);
                        });
                        break;
                    case "无铃":
                        require(['../comMenu/isRing/NoRing'], function (NoRing) {
                            new NoRing(index);
                        });
                        break;
                    case "三方通话":
                        require(['../comMenu/isConference/conference'], function (Conference) {
                            new Conference(index);
                        });
                        break;
                    case "停止三方通话":
                        require(['../comMenu/isConference/unConferenceDeal'], function (UnConference) {
                            new UnConference(index, text);
                        });
                        break;
                    case "二次拨号":
                        require(['../comMenu/secCallOut/secCallOutDeal'], function (SecCallOut) {
                            new SecCallOut(index);
                        });
                        break;
                    case "整理态延长":
                        require(['../clientInfo/tidying/delayTidying'], function (delayTidying) {
                            new delayTidying(index);
                        });
                        break;
                    case "呼叫转出":
                        require(['../callHandle/transferCallDeal'], function (TransferCall) {
                            new TransferCall(index);
                        });
                    default:
                        break;
                }
            }
        }
        // 全部菜单的搜索
        var search = function (e, kw) {
            var html = "";
            if ($(".subMenu .menuDd a"))
                for (var i = 0; i < $(".subMenu .menuDd a").length; i++) {
                    if ($(".subMenu .menuDd a").eq(i).attr("menuFlag") != 0) {
                        var name = $(".subMenu .menuDd a").eq(i).attr("menuName");
                        var abbreviation = $(".subMenu .menuDd a").eq(i).attr("abbreviation");
                        var openModule = $(".subMenu .menuDd a").eq(i).attr("data-openMode");
                        var url = $(".subMenu .menuDd a").eq(i).attr("data-url");
                        var menuId = $(".subMenu .menuDd a").eq(i).attr("data-id");
                        if (abbreviation || name) {
                            if (name.indexOf(kw) >= 0 || abbreviation.indexOf(kw) >= 0) {
                                // 高亮
                                var re = new RegExp(kw, 'g');
                                if (re.test(name) || re.test(abbreviation)) {
                                    name = name.replace(re, "<span style='color:#f65a56'>$&</span>");
                                }
                                html = html + "<li class='item' data-openMode=" + openModule + " data-id=" + menuId + " data-url=" + url + " >" + name + "</li>";
                            }
                        }
                    }
                } else {
                html = "";
            }
            if (html != "") {
                $("#append").html(html).show();
            } else {
                $("#append").show().html('<li class="noth"><img style="position:absolute;left:0;top:6px;" src="src/assets/img/menu/no-result.png" /><span style="display:inline-block;width:80px;word-break:break-all;">没有和"<span style="color:#f65a56;">' + kw + '</span>"匹配的结果</span></li>');
            }
        }
//    var search = function(e, kw){
//        var html = "";
//        if(allMenu && allMenu[0].secondMenu && allMenu[0].secondMenu[0].thirdMenu && allMenu[0].secondMenu[0].thirdMenu[0].menuName ||
//        		allMenu[0].secondMenu[0].thirdMenu[0].abbreviation){
//            for (var i = 0; i < allMenu.length; i++) {
//            	if(allMenu[i].secondMenu){
//	                for(var j = 0; j < allMenu[i].secondMenu.length; j++){
//	                	if(allMenu[i].secondMenu[j].thirdMenu){
//		                    for (var k = 0; k < allMenu[i].secondMenu[j].thirdMenu.length; k++){            
//		                        var result = allMenu[i].secondMenu[j].thirdMenu[k];
//		                        var name = result.menuName;
//		                        var abbreviation = result.abbreviation;
//		                        if(result.menuFlag!="0"){
//			                        if(abbreviation || name){
//				                        if(name.indexOf(kw) >= 0 || abbreviation.indexOf(kw) >=0) {
//				                            // 高亮
//				                            var re = new RegExp(kw,'g');
//				                            if(re.test(name) || re.test(abbreviation)){
//				                                name = name.replace(re,"<span style='color:#f65a56'>$&</span>");
//				                            }
//				                             html = html + "<li class='item' data-openMode="+result.openModule+" data-id="+result.menuId+" data-url="+result.url+" >" + name + "</li>";
//				                        }
//			                        } 
//		                        }
//		                    }
//	                	}
//	                } 
//            	}   
//            }           
//        }else{
//            html = "";
//        } 
//        if(html != ""){
//            $("#append").show().html(html);
//        }else{
//            $("#append").show().html('<li class="noth"><img style="position:absolute;left:0;top:6px;" src="src/assets/img/menu/no-result.png" /><span style="display:inline-block;width:80px;word-break:break-all;">没有和"<span style="color:#f65a56;">'+kw+'</span>"匹配的结果</span></li>');
//        }         
//
//    }
        return objClass;
    });
