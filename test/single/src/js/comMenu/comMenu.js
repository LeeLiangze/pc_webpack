define(['Util', '../../tpl/comMenu/connection-menu.tpl',
        './comUI',
        './comEventsBind',
        './comEventTrigger',
        '../../assets/css/comMenu/iconfont-commenu.css',
        '../../assets/css/comMenu/connection-menu.css'],
    function (Util, menuTpl, comUI, comEventsBind, comEventTrigger) {
        //定义一个空html
        var html = '';
        //初始化 initialize之前
        var objClass = function (outputOption) {
            //设置options属性来接受传入的参数
            this.options = outputOption;
            this.name = 'comMenu';
            this.showInDialog = '0';
            //页面初始化函数
            comMenuInit.call(this);
            this.$el = $(html);
            //将根节点扩展给comUI对象
            comUI.$el = this.$el;
            Util.eventTarget.call(this);

            //将this传入comEventsBind构造函数中,这样就可以在comEventsBind中用objClass所有的方法了;
            this.comEventsBind = new comEventsBind(this);
            //创建comEventTrigger对象,并把this传入，这样就可以用comMenu中的所有方法了
            this.comEventTrigger = new comEventTrigger(this);
            //特殊处理初始化
            specialInit.call(this, this);
        };
        //为接续对象扩展自定义事件
        $.extend(objClass.prototype, Util.eventTarget.prototype, {
            comUI: comUI,
            showPlaceTeam: function (val) {
                if (val == 1) {
                    $(".showTeam", this.$el).removeClass("verPlace").css("visibility", "visible").addClass("horPlace");
                } else if (val == 0) {
                    $(".showTeam", this.$el).removeClass("horPlace").css("visibility", "visible").addClass("verPlace");
                }
            },
            palceTeamChange: function () {
                $(".showTeam", this.$el).css("visibility", "hidden");
            }
        });
        //特殊处理初始化
        function specialInit(options) {
            //整理态添加下拉箭头
            this.$el.find('.connection-list-icon-zhenglitaizhuanhuan-copy').append("<span class='com_icon_sprite_down'></span>");
            this.$el.find('.connection-list-icon-zhenglitaizhuanhuan-copy').append("<div class='finishing-state-down tidystatus'>"
                + "<div class='choice-public action'><span target-id='auto-word'>自动</span></div>"
                + "<div class='choice-public action'><span target-id='man-made-word'>人工</span></div>"
                + "<div class='choice-public answer'><span target-id='man-made-answer'>人答</span></div>"
                + "<div class='choice-public answer'><span target-id='auto-answer'>自答</span></div></div>");
            this.$el.find('.connection-list.connection-list-icon-zhenglitaizhuanhuan-copy.iconfont-com').attr('data_title', '整理态下拉');
            //人工,自答默认选中
            var that = this;
            $.getJSON("../../data/comMenu/specialInit.json", {}, function (json, status) {
                if (status) {
                    var dropDownHtml = "<div class='finishing-state-down cipercheck'>";
                    var dropDownListNum = 0; // 下拉框中验证类型个数
                    var showInDialogNum = 0; // 在弹出窗中展示的个数
                    for (var i = 0; i < json.beans.length; i++) {
                        var validateType = json.beans[i].serviceTypeId;
                        var validateName = json.beans[i].titleName;
                        var transferCode = json.beans[i].ivrJnupNum;
                        var typeId = json.beans[i].specialId;
                        var openStyle = json.beans[i].openStyle;
                        if (openStyle == '0') {
                            dropDownListNum++;
                            dropDownHtml += "<div class='choice-public'><span target-id='" + validateType + "' transferCode='" + transferCode + "' typeId='" + typeId + "'>" + validateName + "</span></div>";
                            dropDownHtml += "<div class='splitHrDiv'><hr/></div>"
                        } else {
                            showInDialogNum++;
                        }
                    }
                    if (dropDownListNum > 0) {
                        dropDownHtml = dropDownHtml.substring(0, dropDownHtml.length - 35);
                        dropDownHtml += "</div>";
                        that.$el.find('.connection-list-icon-mimayanzhengzhuanhuan-copy').append("<span class='com_icon_sprite_down'></span>");
                        that.$el.find('.connection-list-icon-mimayanzhengzhuanhuan-copy').append(dropDownHtml);
                        that.$el.find('.connection-list.connection-list-icon-mimayanzhengzhuanhuan-copy.iconfont-com').attr('data_title', '密码验证下拉');
                    }
                    if (showInDialogNum > 0) {
                        that.showInDialog = '1';
                    }
                }
            });
        }
        //菜单初始化
        function comMenuInit(options) {
            debugger;
            var staffId = this.options.getUserInfo().staffId;
            var serviceTypeName = this.options.CTIInfo.serviceTypeName;
            var serviceTypeName_head = serviceTypeName.substring(0, 4);
            var serviceTypeName_body = serviceTypeName.substring(4, serviceTypeName.length);
            // $.getJSON("../../data/comMenuInit.json",
            Util.svMap.add('comMenuInit', 'comMenuInit.json', '');
            Util.ajax.getJson(Util.svMap.get('comMenuInit'), {}, function (json, status) {
                debugger;
                var teamArr1 = [];
                var teamArr2 = [];
                var teamArr3 = [];
                var team1;
                var team2;
                var team3;
                if (status) {
                    if (!json.beans[0]) {
                        var dataSource = {
                            'serviceTypeName': serviceTypeName,
                            'serviceTypeName_head': serviceTypeName_head,
                            'serviceTypeName_body': serviceTypeName_body
                        };
                        var template = Util.hdb.compile(menuTpl);
                        html = template(dataSource);
                        return;
                    }
                    if (json.beans.length > 0) {
                        team1 = json.beans[0].parentId;
                        for (var i = 0; i < json.beans.length; i++) {
                            if (json.beans[i].parentId != json.beans[0].parentId) {
                                team2 = json.beans[i].parentId;
                                break;
                            }
                        }
                        for (var i = 0; i < json.beans.length; i++) {
                            if (json.beans[i].parentId == team1) {
                                teamArr1.push(json.beans[i]);
                            } else if (json.beans[i].parentId == team2) {
                                teamArr2.push(json.beans[i]);
                            } else {
                                teamArr3.push(json.beans[i]);
                            }
                        }
//	    			if(team1&&team2){
//	    				teamArr1[teamArr1.length - 1].isTeam = true;
//	    			}
                        if (team1) {
                            teamArr1[teamArr1.length - 1].isTeam = true;
                        }
                        if (team2) {
                            teamArr2[teamArr2.length - 1].isTeam = true;
                        }
                        if (team3) {
                            teamArr3[teamArr3.length - 1].isTeam = true;
                        }
                        json.beans = $.merge([], teamArr1);
                        json.beans = $.merge(json.beans, teamArr2);
                        json.beans = $.merge(json.beans, teamArr3);
                        var dataSource = {
                            "dataSource": json.beans,
                            'serviceTypeName': serviceTypeName,
                            'serviceTypeName_head': serviceTypeName_head,
                            'serviceTypeName_body': serviceTypeName_body
                        };
                        var template = Util.hdb.compile(menuTpl);
                        html = template(dataSource);
                    }
                } else {
                }
            }, true);
        }
        return objClass;
    });
