//2016 11 21 by jiawenchao
define(['Util',
        '../content/editArea/releaseReason',
        './navLog',
        '../../tpl/nav/nav.tpl',
        '../../assets/css/nav/nav.css'],
    function (Util, ReleaseReason, navlog, navTpl) {
        //初始化 initialize之前
        var G_viewUrl = [];
        var G_placeMenu = [];
        var G_skinUrl = [];
        var G_index = null;
        var G_viewIndex = 0;
        var G_placeIndex = 0;
        var viewIndex = 0;
        var placeIndex = 0;
        var skinIndex = 0;
        var jsonData = {};
        var logoutURL = "";
        var loginURL = "";
        var anoceIdValue = null;
        var noteIdValue = null;
        var objClass = function (options) {
            var temp = Util.hdb.compile(navTpl);
            this.options = options;
            G_index = this.options;
            getData.call(this);
            this.$el = $(temp(jsonData));
            //调用获取数量函数
            noReadNums.call(this)
            //向数组添加元素
            viewArr.call(this);
            //加载选中项
            loadSelset.call(this);
            //点击出现下拉框
            clickSlide.call(this);
            //皮肤选择
            selectSkin.call(this);
            //视图模式选择
            viewModeSelect.call(this);
            //选择接续
            selectPlace.call(this);
            //打开记事本
            clickRunNotepad.call(this);
            //点击事件
            btnClick.call(this);
            //公告便签未读数量点击事件
            clickAnoceNote.call(this);
            navlog.call(this, G_index);
        };

        var loadSelset = function () {
            $.getJSON("../../data/nav/loadSelset.json", {}, $.proxy(function (data, status) {
                if (status) {
                    viewIndex = data.bean.viewMode.substr(1) - 1;
                    placeIndex = data.bean.toolbarMode.substr(1) - 1;
                    skinIndex = data.bean.skinId.substr(1) - 1;
                    G_viewIndex = viewIndex;
                    G_placeIndex = placeIndex;
                    defaultSelect.call(this, viewIndex, placeIndex, skinIndex);
                    if (viewIndex == 0) {
                        $('.clientLeft').css('display', 'block');
                    } else {
                        $('.clientLeft').css('display', 'none');
                    }
                    ;
                }
            }, this));
        };
        var defaultSelect = function (v1, v2, v3) {
            var viewNum = $(".operation .view", this.$el).size();
            var setPlaceNum = $(".operation .setPlace", this.$el).size();
            var skinNum = $(".operation .setSkin .skin", this.$el).size();
            showSelct.call(this, viewNum, G_viewUrl, ".operation .view", v1);
            showSelct.call(this, setPlaceNum, G_placeMenu, ".operation .setPlace", v2);
            showSelct.call(this, skinNum, G_skinUrl, ".operation .setSkin .skin", v3);
            setTimeout(function () {
                viewChange(v1, v2);
                placeChange(v2, v1);
                changeSkin(v3);
            }, 20)
            //接续栏分组
            G_index.comMenu.showPlaceTeam(v2);
            if (v1 == 3) {
                G_index.comMenu.palceTeamChange()
            }
        };
        //加载选择项
        function showSelct(changeNo, arr, selector, val) {
            for (var i = 0; i < changeNo; i++) {
                arr.push($(selector, this.$el).eq(i).find("img").attr("src"));
            }
            ;
            if (arr && arr.length > 0) {
                $(selector, this.$el).eq(val).find("img").attr("src", arr[val].replace(/(.png)$/g, "-xz.png"));
            }
            $(selector, this.$el).eq(val).css("color", "black");
        };

        var getData = function () {
            //获取公告便签系统参数
            $.getJSON("../../data/nav/noteIdValue.json", {itemId: "129002002"}, $.proxy(function (Data, status) {
                if (status) {
                    noteIdValue = Data.bean.value;
                }
            }, this), true);
            $.getJSON("../../data/nav/anoceIdValue.json", {itemId: "129002001"}, $.proxy(function (Data, status) {
                if (status) {
                    anoceIdValue = Data.bean.value;
                }
            }, this), true);
            //获取数据
            jsonData.idStaff = G_index.getUserInfo().staffId.length > 7 ? G_index.getUserInfo().staffId.substr(0, 7) + "..." : G_index.getUserInfo().staffId;
            jsonData.staffId = G_index.getUserInfo().staffId
            //获取视图
            // var yystA = require('../../assets/img/nav/stms-yystA.png');
            // var yystB = require('../../assets/img/nav/stms-yystB.png');
            // var hlwst = require('../../assets/img/nav/stms-hlwst.png');
            // var glyst  = require('../../assets/img/nav/stms-glyst.png');
            $.getJSON("../../data/nav/serviceTypeId.json", {}, $.proxy(function (Data, status) {
                if (status) {
                    jsonData.view = Data.beans;
                }
            }, this), true);
            //获取皮肤
            $.getJSON("../../data/skin.json", {}, $.proxy(function (Data, status) {
                if (status) {
                    jsonData.skins = Data.beans;
                }

            }, this), true);
            //获取工具栏配置项
            $.getJSON("../../data/tools.json", {}, $.proxy(function (Data, status) {
                jsonData.items = [];
                if (status) {
                    for (var i = 0; i < Data.beans.length; i++) {
                        jsonData.items = $.merge(jsonData.items, Data.beans[i].children);
                    }
                    ;
                    for (var i = 0; i < jsonData.items.length; i++) {
                        if (jsonData.items[i].menuId == anoceIdValue || jsonData.items[i].menuId == noteIdValue) {
                            jsonData.items[i].isNum = true;
                            if (jsonData.items[i].menuId == anoceIdValue) {
                                jsonData.items[i].isNotice = true;
                            }
                        }
                        ;
                        if (jsonData.items[i].displayName == "工具") {
                            jsonData.items[i].isTool = true;
                        }
                        ;
                    }
                    ;
                }
                ;

            }, this), true);
            //获取实时时间
            jsonData.loginTime = new Date().toTimeString().split(" ")[0];
            jsonData.userName = G_index.getUserInfo().staffName;
            jsonData.department = G_index.getUserInfo().deptName;
        };
        var noReadNums = function () {
            var self = this;
            var tenantId = G_index.getUserInfo().proviceId;
            getUnreadNum()
            var timer = setInterval(getUnreadNum, 180000);

            function getUnreadNum() {
                //获取未读公告数量
                $.getJSON("../../data/nav/getUnreadNum.json", {}, function (Data, status) {
                    if (status) {
                        if (!Data.bean.total) {
                            $("#noticeNum", self.$el).html("(0)");
                        } else {
                            var num = Data.bean.total > 99 ? "99+" : Data.bean.total;
                            $("#noticeNum", self.$el).html("(" + num + ")");
                        }
                        ;
                    }
                    ;
                });
                //获取未读便签数量
                $.getJSON("../../data/nav/getUnReadNoteCount.json", {}, function (Data, status) {
                    if (status) {
                        if (!Data.bean.total) {
                            $("#noteNum", self.$el).html("(0)");
                        } else {
                            var num = Data.bean.total > 99 ? "99+" : Data.bean.total;
                            $("#noteNum", self.$el).html("(" + num + ")");
                        }
                        ;
                    }
                    ;

                });
            }
        };
        var clickSlide = function () {
            var self = this;
            var selsctBtn;
            var xljt2 = require("../../assets/img/nav/zlt-xljt2-.png");
            var xljt = require("../../assets/img/nav/zlt-xljt.png");
            $(".toolSlideBtn", this.$el).on("click", function (e) {
                var even = window.event || e;
                var target = even.target || even.currentTarget;
                selsctBtn = $('.toolSlideBtn', self.$el).index(target);
                $(".toolSlideBtn", self.$el).eq(selsctBtn).css("color", "#3CA1DA");
                $(".toolSlide .tool", self.$el).css("color", "#BFBFBF");
                $(".toolSlideBtn", self.$el).eq(selsctBtn).find(".toolImg").attr("src", xljt2);
                $(this).find(".toolSlide").show();
//					even.stopPropagation();
            });
            $(".toolSlideBtn", this.$el).on("mouseout", function () {
                $(".toolSlideBtn", self.$el).css("color", "#BFBFBF");
                $(".toolSlideBtn", self.$el).find(".toolImg").attr("src", xljt);
                $(this).find(".toolSlide").hide();
                $(this).find(".toolSlide").on("mouseover", function (e) {
                    var even = window.event || e;
                    if (even.type == "mouseover") {
                        $(this).show();
                        $(".toolSlideBtn", self.$el).eq(selsctBtn).css("color", "#3CA1DA");
                        $(".toolSlide .tool", self.$el).css("color", "#BFBFBF");
                        $(".toolSlideBtn", self.$el).eq(selsctBtn).find(".toolImg").attr("src", xljt2)
                    }
                });
            })
            $("#nameSlide", this.$el).on("click", $.proxy(function (e) {
                var even = window.event || e;
                $("#nameSlide", this.$el).css("color", "#3CA1DA");
                $("#nameSlide", this.$el).find("img").attr("src", xljt2);
                $(".toolSlideBtn", this.$el).css("color", "#BFBFBF");
                $(".toolSlideBtn", this.$el).find(".toolImg").attr("src", xljt);
                $(".nameSlide", this.$el).show();
//				    even.stopPropagation();
            }, this));
            $("#nameSlide", this.$el).on("mouseout", function () {
                $("#nameSlide", this.$el).css("color", "#BFBFBF");
                $("#nameSlide", this.$el).find("img").attr("src", xljt);
                $(".nameSlide", this.$el).hide();
                $(".nameSlide", this.$el).on("mouseover mouseout", function (e) {
                    var even = window.event || e;
                    if (even.type == "mouseover") {
                        $(this).show();
                        $("#nameSlide", this.$el).css("color", "#3CA1DA");
                        $("#nameSlide", this.$el).find("img").attr("src", xljt2);
                    } else if (even.type == "mouseout") {
                        $(this).hide();
                        $("#nameSlide", this.$el).css("color", "#BFBFBF");
                        $("#nameSlide", this.$el).find("img").attr("src", xljt);
                    }
                })
            });
        };
        //选择视图 start
        var viewModeSelect = function () {
            $(".operation .viewMode .view", this.$el).on("click", function () {
                viewIndex = $(this).index();
                G_viewIndex = viewIndex;
                if (viewIndex == 3) {
                    G_index.comMenu.palceTeamChange()
                } else {
                    G_index.comMenu.showPlaceTeam(G_placeIndex);
                }
                viewChange(viewIndex, G_placeIndex);
                changeSelect.call(this, ".operation .view", viewIndex, G_viewUrl);
                //将选择入库
                allIndex();
                //从融合视图切换其他视图，如果当前活动Tab为交谈区，则默认打开第一个Tab页 by 李青
                if (viewIndex != 2) {
                    if (G_index.main.getCurrentTab().title == '交谈区' && G_index.queue.queueReceiveMessageFlag == true) {
                        G_index.main.currentPanel.glbTab.switchTab(1);
                        //$('.uiTab .uiTabHead .uiTabItemHead').eq(1).click()
                    }
                }
                if (viewIndex == 0) {
                    $('.clientLeft').css('display', 'block');
                } else {
                    $('.clientLeft').css('display', 'none');
                }
                //队列区收起放开  李青
                queueList()
                return false;
            });
        };
        //选择接续
        var selectPlace = function () {
            $(".operation .selectMenu .setPlace", this.$el).on("click", function () {
                placeIndex = $(this).index();
                G_placeIndex = placeIndex;
                placeChange(placeIndex, G_viewIndex);
                G_index.comMenu.showPlaceTeam(G_placeIndex);
                if (G_viewIndex == 3) {
                    G_index.comMenu.palceTeamChange()
                }
                changeSelect.call(this, ".operation .setPlace", placeIndex, G_placeMenu);
                //将选择入库
                allIndex();
                queueList()
                return false;
            });
        };

        function queueList() {
            //队列区收起放开  李青
            if (placeIndex == 1 && G_index.queue.queueChangeTopFlag) {
                G_index.queue.changeLeftLeft();
            }
            ;
            if (placeIndex == 1 && !G_index.queue.queueChangeTopFlag) {
                //G_index.queue.changeLeftLeft();
                G_index.queue.changeRightLeft();
            }
            ;
            if (placeIndex == 0 && G_index.queue.queueChangeLeftFlag) {
                G_index.queue.changeLeftTop();
            }
            ;
            if (placeIndex == 0 && !G_index.queue.queueChangeLeftFlag) {
                G_index.queue.changeRightTop();
            }
            ;
            //客户信息区收起放开 by 张云天
            if (placeIndex == 1 && G_index.clientInfo.clientInitLeftTopFlag) {
                G_index.clientInfo.closeClientInfoLeftLeft()
            }
            ;
            if (placeIndex == 1 && !G_index.clientInfo.clientInitLeftTopFlag) {
                G_index.clientInfo.openClientInfoRightLeft()
            }
            ;
            if (placeIndex == 0 && G_index.clientInfo.clientInitLeftLeftFlag) {
                G_index.clientInfo.closeClientInfoLeftTop()
            }
            ;
            if (placeIndex == 0 && !G_index.clientInfo.clientInitLeftLeftFlag) {
                G_index.clientInfo.openClientInfoRightTop()
            }
            ;
        }

        //选择皮肤 start
        var selectSkin = function () {
            $(".operation .setSkin .skin", this.$el).on("click", function () {
                skinIndex = $(this).index() - 1;
                changeSkin(skinIndex);
                changeSelect.call(this, ".operation .setSkin .skin", skinIndex, G_skinUrl);
                allIndex();
                return false;
            });
        };
        //存储视图模式数组方法
        var viewArr = function () {
            this.viewArr = [];
            var Num = $(".operation .view", this.$el).size();
            for (var i = 0; i < Num; i++) {
                this.viewArr.push($(".operation .view", this.$el).eq(i).find("img").attr("src"));
            }
            ;
        }
        //调用工具　start
        var clickRunNotepad = function () {
            $("#slideTool .tool", this.$el).on("click", function () {
                switch ($(this).index()) {
                    case 1:
                        runCounter("C:\\Windows\\System32\\SnippingTool.exe");
                        break;
                    case 2:
                        runCounter("C:\\Windows\\System32\\calc.exe");
                        break;
                    case 3:
                        runCounter("C:\\Windows\\System32\\notepad.exe");
                        break;
                }
                ;
            });
        }
        //打开记事本,计算器，截图工具 start
        var runCounter = function (command) {
            try {
                var wsh = new ActiveXObject('WScript.Shell');
            } catch (e) {
                alert('仅支持IE浏览器,IE请设置浏览器安全级别！');
                return;
            }
            ;
            if (wsh) {
                wsh.Run(command);
            }
            ;
        };

        function allIndex() {
            viewIndex = arguments[0] || viewIndex;
            Util.ajax.postJson("front/sh/layout!execute?uid=layout004&staffId="+jsonData.staffId, {
                    skinId: "0" + (skinIndex + 1),
                    toolbarMode: "0" + (placeIndex + 1),
                    viewMode: "0" + (viewIndex + 1)
                },
                function (data) {
                });
        }

        //IE8解决对应的infont更改内容
        function redraw() {
            if (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.split(";")[1].replace(/[ ]/g, "") == "MSIE8.0") {
                $(".iconfont-com").addClass('content-empty');
                setTimeout(function () {
                    $(".iconfont-com").removeClass('content-empty');
                }, 0)
            }
        }

        //切换选项函数 start
        function changeSelect(el, selectNo, arr) {
            $(el, this.$el).css("color", "#ACB4B8");
            $(this).css("color", "black");
            for (var i = 0; i < arr.length; i++) {
                $(el, this.$el).eq(i).find("img").attr("src", arr[i]);
            }
            ;
            $(el, this.$el).eq(selectNo).find("img").attr("src", arr[selectNo].replace(/(.png)$/g, "-xz.png"));
        };
        //对外释放的方法
        $.extend(objClass.prototype, {
            changeSelectOut: function (val) {
                $(".operation .view", this.$el).css("color", "#ACB4B8");
                $(".operation .view", this.$el).eq(val).css("color", "black");
                for (var i = 0; i < this.viewArr.length; i++) {
                    $(".operation .view", this.$el).eq(i).find("img").attr("src", this.viewArr[i]);
                }
                ;
                $(".operation .view", this.$el).eq(val).find("img").attr("src", this.viewArr[val].replace(/(.png)$/g, "-xz.png"));
                G_viewIndex = val;
                allIndex(val);
            },
            viewVal: function () {
                return G_viewIndex;
            }
        });
        //改变皮肤 函数start
        function changeSkin(val) {
            switch (val) {
                case 0:
                    G_index.skinChange("default");
                    redraw();
                    break;
                case 1:
                    G_index.skinChange("green");
                    redraw();
                    break;
                case 2:
                    G_index.skinChange("black-golden");
                    redraw();
                    break;
            }
            ;
        };
        function placeChange(val1, val2) {
            switch (val1) {
                case 0:
                    if (val2 == 0) {
                        G_index.layoutChange("yyA-hor");
                        redraw();
                    } else if (val2 == 1) {
                        G_index.layoutChange("yyB-hor");
                        redraw();
                    } else if (val2 == 2) {
                        G_index.layoutChange('internet-hor');
                        redraw();
                    }
                    ;
                    break;
                case 1:
                    if (val2 == 0) {
                        G_index.layoutChange("yyA-ver");
                        redraw();
                    } else if (val2 == 1) {
                        G_index.layoutChange("yyB-ver");
                        redraw();
                    } else if (val2 == 2) {
                        G_index.layoutChange('internet-ver');
                        redraw();
                    }
                    ;
                    break;
            }
            ;
        };
        //视图改变函数start
        function viewChange(val1, val2) {
            switch (val1) {
                case 0:
                    if (val2 == 0) {
                        G_index.layoutChange("yyA-hor");
                        redraw();
                    } else if (val2 == 1) {
                        G_index.layoutChange("yyA-ver");
                        redraw();
                    }
                    ;
                    break;
                case 1:
                    if (val2 == 0) {
                        G_index.layoutChange("yyB-hor");
                        redraw();
                    } else if (val2 == 1) {
                        G_index.layoutChange("yyB-ver");
                        redraw();
                    }
                    break;
                case 2:
                    if (val2 == 0) {
                        G_index.layoutChange("internet-hor");
                        redraw();
                    } else if (val2 == 1) {
                        G_index.layoutChange("internet-ver");
                        redraw();
                    }
                    break;
                case 3:
                    G_index.layoutChange("admin");
                    break;
            }
            ;
        };
        //工具栏点击事件
        var btnClick = function () {
            $(".nav_btn", this.$el).on('click', function (e) {
                var target = e.target || e.currentTarget;
                var a = $('.nav_btn', this.$el).index(target);
                for (var i = 0; i <= a; i++) {
                    if (jsonData.items[i].displayName == "工具") {
                        a++;
                    }
                }
                var val = $(this).html();
                if (jsonData.items != [] && jsonData.items[a]) {
                    open(jsonData.items[a], val)
                }
            });
        };
        //点击公告，便签未读数量展示其列表详情
        var clickAnoceNote = function () {
            //公告
            $("#noticeNum", this.$el).on("click", function () {
                for (var i = 0; i < jsonData.items.length; i++) {
                    if (jsonData.items[i].menuId == anoceIdValue) {
                        open(jsonData.items[i], "公告列表")
                        break;
                    }
                }
            });
            //便签
            $("#noteNum", this.$el).on("click", function () {
                for (var i = 0; i < jsonData.items.length; i++) {
                    if (jsonData.items[i].menuId == noteIdValue) {
                        open(jsonData.items[i], "便签管理")
                        break;
                    }
                }
            });
        }
        //打开方式以及跨域方法
        function open(obj, tag) {
            var val = tag;
            if (obj.menuId == noteIdValue) {
                val = "便签管理";
            } else if (obj.menuId == anoceIdValue) {
                val = "公告列表";
            }
            if (obj.openModule == "N" && obj.menuUrl != "") {
                G_index.main.createTab(val, obj.menuUrl);
            } else if (obj.openModule == "P" && obj.menuUrl != "") {
                var Url = obj.menuUrl.split("?")[0];
                var wh = obj.menuUrl.split("?")[1].split("&");
                var heights = wh[0].split("=")[1];
                var widths = wh[1].split("=")[1];
                G_index.showDialog({
                    title: val,
                    url: Url,
                    width: heights,
                    height: widths
                });
            } else if (obj.openModule == "Y" && obj.menuUrl != "") {
                window.open(obj.menuUrl);
            } else if (obj.openModule == "F" && obj.menuUrl != "") {
                //该方式未配置
            }
        }

        return objClass;
    });