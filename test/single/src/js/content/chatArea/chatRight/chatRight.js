/**
 *   客户交谈区右侧聊天气泡
 *   张云天
 */
define(['Util',
    '../../../../tpl/content/chatArea/chatRight/chatRightText.tpl',
    '../../../../tpl/content/chatArea/chatRight/chatRightImg.tpl',
    '../../../../tpl/content/chatArea/chatRight/chatRightRecord.tpl',
    '../../../index/constants/mediaConstants',
    '../voice',
    '../../../../assets/css/content/chatArea/chatRight/chatRight.css'
], function(Util, RightTextTpl, RightImgTpl, RightRecordTpl, MediaConstants, Voice) {

    var _index = null;
    var objClass = function(index) {
        _index = index;
    };

    $.extend(objClass.prototype, {

        createRightItem: function(data, $chatContent, flag) {
            var scrollflag = false;

            var sender = "";
            if (data.senderFlag == MediaConstants.SENDER_FLAG_ROBOT) {
                sender = "(小移)";
            }
            if (data.senderFlag == MediaConstants.SENDER_FLAG_SYSTEM) {
                sender = "(系统)";
            }
            if (data.senderFlag == MediaConstants.SENDER_FLAG_SEAT) {
                //获取客服的昵称
                if (data.staffId) {
                    sender = data.staffId;
                } else {
                    sender = "(客服)";
                }
            }

            var channelName = "";
            if(_index.contentCommon.getChannelInfo(data.channelID)){
                channelName = _index.contentCommon.getChannelInfo(data.channelID).channelName;
            }
            if(data.cancelFlag == "1"){
                var showContent = data.content;
                if(data.msgType == MediaConstants.MSGTYPE_IMG){
                    showContent = '[图片]';
                }
                if(showContent.indexOf(">") != "-1"){
                	showContent = showContent.replace(/\>/g,"&gt;");
                };
                $($chatContent.find('.chat-content')).append("<div class='evokeMsgTips'><div class='revokeDiv' title="+showContent+"><p>你撤回了一条消息</p></div></div>");
//                撤回图片消息展示(当前会话的查看历史)
//                var xOffset = -20;
//                var yOffset = 10;
//                $chatContent.find(".revokeDiv").hover(
//                    function(e) {
//                        jQuery("<div id='divShow'><img id='imgshow' src='" + data.url + "' /></div>").appendTo("body");
//                        jQuery("#divShow").css("top", (e.pageY - xOffset) + "px").css("left", (e.pageX + yOffset) + "px").fadeIn("fast");
//                    },
//                    function() {
//                        jQuery("#divShow").remove();
//                    }
//                ); 
//                $chatContent.find(".revokeDiv").mousemove(function(e) {
//                    jQuery("#divShow").css("top", (e.pageY - xOffset) + "px").css("left", (e.pageX + yOffset) + "px")
//                });
           }else{
            if (data.msgType == MediaConstants.MSGTYPE_TEXT) {
                //文本
                var rightTextTpl = Util.hdb.compile(RightTextTpl);
                var $rightText = $(rightTextTpl({}));
                if (flag == 0) {
                    $($chatContent.find('.chat-content')).append($rightText);
                } else {
                    $($chatContent.find('.chat-more-msg')).after($rightText);
                }
                $rightText.find('.chat-info .chat-time').text(data.originalCreateTime);
                $rightText.find('.chat-info .chat-sender').text(sender);
                $rightText.find('.chat-info .chat-channel').text(channelName);
                $rightText.find('.chat-icon img').attr('src', 'src/assets/img/content/chatArea/server.png');
                //复制一份data数据
                var dataTemp = _index.contentCommon.cloneObject(data);
                var content = _index.contentCommon.parseContentForHref(dataTemp.content);
                dataTemp.content = content;
                content = _index.contentCommon.parseKeyToFace(dataTemp);
                $rightText.find('.chat-content-text div').html(content);
                $rightText.find('#msgId').text(data.msgId);
                //右键撤销
                $rightText.find('.chat-msg').last().mousedown(function(e) {
                	if($chatContent.selector == "#viewHistory"){
                		return;
                	}
                    if (3 == e.which) {
                        var params = {
                            data: dataTemp,
                            el: $rightText.find('.chat-msg')
                        };
                        revokeMsg(params);
                    }
                });
            } else if (data.msgType == MediaConstants.MSGTYPE_IMG) {
                //图片
                var rightImgTpl = Util.hdb.compile(RightImgTpl);
                var $rightImg = $(rightImgTpl({}));
                if (flag == 0) {
                    $($chatContent.find('.chat-content')).append($rightImg);
                } else {
                    $($chatContent.find('.chat-more-msg')).after($rightImg);
                }
                $rightImg.find('.chat-info .chat-time').text(data.originalCreateTime);
                $rightImg.find('.chat-info .chat-sender').text(sender);
                $rightImg.find('.chat-info .chat-channel').text(channelName);
                $rightImg.find('.chat-icon img').attr('src', 'src/assets/img/content/chatArea/server.png');
                // $rightImg.find('.chat-content-img img').attr('src', 'src/assets/img/login/newBg.png');
                var imagePath = data.url.replace('.', '_min.');
                $rightImg.find('.chat-content-img img').attr('src', imagePath);
                $rightImg.find('#msgId').text(data.msgId);
                //图片点击
                $rightImg.on("click", ".chat-content-img img", $.proxy(function() { photoClick($rightImg, data); }, this));
                $rightImg.find('.chat-msg').last().mousedown(function(e) {
                	if($chatContent.selector == "#viewHistory"){
                		return;
                	}
                    if (3 == e.which) {
                        var params = {
                            data: data,
                            el: $rightImg.find('.chat-msg')
                        };
                        revokeMsg(params);
                    }
                });
            } else if (data.msgType == MediaConstants.MSGTYPE_AUDIO) {
                //录音
                var rightRecordTpl = Util.hdb.compile(RightRecordTpl);
                var $rightRecord = $(rightRecordTpl({}));
                $($chatContent.find('.chat-content')).append($rightRecord);
                $rightRecord.find('.chat-info .chat-time').text(data.originalCreateTime);
                $rightRecord.find('.chat-info .chat-sender').text(sender);
                $rightRecord.find('.chat-info .chat-channel').text(channelName);
                $rightRecord.find('.chat-icon img').attr('src', 'src/assets/img/content/chatArea/server.png');
                $rightRecord.find('#msgId').text(data.msgId);
                var voiceData = {
                    url: data.url,
                    senderFlag: data.senderFlag,
                    time: data.audioTimeLength
                };
                //录音播放js
                var voice = new Voice(_index, $rightRecord, voiceData);
            } else if (data.msgType == MediaConstants.MSGTYPE_VIDEO) {
                //小视频
            } else if (data.msgType == MediaConstants.MSGTYPE_GEOGRAPHIC_LOCATION) {
                //视频
            } else if (data.msgType == MediaConstants.MSGTYPE_OTHER_FILE) {
                //其他文件类附件，如word、excel、zip等
            }

            var chatAreaH = ($chatContent.find('.chat-area')).height();
            var chatConetntH = ($chatContent.find('.chat-content')).height();
            //动态控制右边聊天气泡，保持右边距一直是20px
            if (chatAreaH != 0 && chatAreaH < chatConetntH) {
                scrollflag = true;
            }
            if (scrollflag) {
                $chatContent.find('.chat-right-item').css('padding-right', '20px');
            }
           }
        },

    });

    /**
     * 图片点击查看原图
     * @param  {[type]} $rightImg [description]
     * @return {[type]}           [description]
     */
    function photoClick($rightImg, data) {
        var $img = $rightImg.find('.chat-content-img img');
        var imgPath = $img.attr("src");
        // 获取原图路径
        if (imgPath.indexOf("_min") != '-1') {
            var temp = $img.attr("src").split("_min");
            var part1 = temp[0];
            var part2 = temp[1];
            imgPath = part1 + part2;
        }
        //获取原图的宽和高
        var image = new Image();
        image.onload = function() {
            var width = image.width;
            var height = image.height;
            var $showRevokeMsg = $rightImg.closest(".chat-right-item");
            var msgId = $showRevokeMsg.find('#msgId').text();
            //压缩图片
            while (width >= 800 || height >= 600) {
                width = width * 0.9;
                height = height * 0.9;
            }
            var dataParam = {
                "msgId" : msgId,
                "callerNo" : data.callerNo,
                "serialNo" : data.serialNo,
            };
            var param = {
                "width": width,
                "height": height,
                "dataParam":dataParam,
                "imgPath":imgPath
            };
            _index.showDialog({
                title: '图片', //弹出窗标题
                modal: true,
                url: 'js/content/chatArea/photo', //要加载的模块
                param: param, //要传递的参数，可以是json对象
                width: 800, //对话框宽度
                height: 600 //对话框高度
            });
        };
        image.src = imgPath;
    }
    /**
     * 撤销消息
     * @param  {[type]} params [description]
     * @return {[type]}        [description]
     */
    function revokeMsg(params) {
        var serialNo = _index.CallingInfoMap.getActiveSerialNo();
        var callingInfo = _index.CallingInfoMap.get(serialNo);
        // webchat 和 微信有撤回功能
        if (MediaConstants.MEDIA_ONLINE_SERVICE != callingInfo.mediaType && MediaConstants.WEIXIN_TYPE != callingInfo.mediaType) {
            return;
        }
        // 如果是系统消息不弹出撤回气泡
        if (params.data.senderFlag == MediaConstants.SENDER_FLAG_SYSTEM || params.data.senderFlag == MediaConstants.SENDER_FLAG_ROBOT) {
            return;
        }
        // 如果是从其他坐席转过来的消息，消息时间早于当前会话第一条消息时间，不弹出撤回气泡
        if (_index.queue.list[serialNo]) {
            var firstMsgTime = _index.queue.originalCreateTime[serialNo];
            var msgTimeStr = params.data.originalCreateTime;
            if (firstMsgTime > msgTimeStr) {
                return;
            }
        }

        var revokeStr = "<div class='revokeButtonDiv'><a href='#' class='revokeButton'>撤回</a></div>";
        Util.dialog.bubble({
            element: $(params.el),
            content: revokeStr, //气泡内容
            quickClose: true, //点击页面上其它位置是否关闭气泡 默认为true
            align: 'top' //气泡弹出方向，可以是 top、right、bottom、left、或者它们的组合，如top right
        });
        $(".ui-popup-backdrop").next().last().find(".ui-dialog-body").css("padding", "5px");
        var oldValue = $(".ui-popup-backdrop").next().last().css("top");
        var newValueNum = parseInt(oldValue.substr(0, oldValue.length - 2)) + 30;
        var newValue = newValueNum + "px";
          // $(".ui-popup-backdrop").next().last().css("top", '325px');
        if(_index.queue.myBrowser() == 'IE'){
            newValueNum = newValueNum - 30;
            newValue = newValueNum + "px";
            $(".ui-popup-backdrop").next().last().css("top", newValue);
        }
        $(".ui-popup-backdrop").next().last().css("top", newValue);
        $(".revokeButton").on("click", function(e) {
            // if (navigator.userAgent.indexOf("MSIE 8.0") !== -1 || navigator.userAgent.indexOf("MSIE 7.0") !== -1) {
            //     $(".revokeButtonDiv").html('<img style="width:20px;" src="src/assets/content/chatArea/waiting.gif">');
            // } else {
            //     // $(".revokeButtonDiv").shCircleLoader();
            // }
            // 判断用户是否已经离线
            if ('04' == callingInfo.getSessionStatus()) {
                $(".ui-popup-backdrop").next().remove();
                $('.ui-popup-backdrop').remove();
                _index.popAlert("用户已离线，无法撤回！");
                return;
            }

            var msgTimeStr = params.data.originalCreateTime;
            // 判断待撤回消息是否超时，默认2分钟超时
            var nowStr = _index.utilJS.getCurrentTime();
            var nowDate = new Date(nowStr.replace(/-/g, "/"));
            var nowTime = nowDate.getTime();

            var msgDate = new Date(msgTimeStr.replace(/-/g, "/"));
            var msgTime = msgDate.getTime();
            var revokeTime = 2;
            if (nowTime - msgTime > revokeTime * 60 * 1000) {
                $(".ui-popup-backdrop").next().remove();
                $('.ui-popup-backdrop').remove();
                _index.popAlert("发送时间超过" + revokeTime + "分钟的消息，不能被撤回。");
                return;
            }
            var $showRevokeMsg = $(params.el).closest(".chat-right-item");
            var msgId = $showRevokeMsg.find('#msgId').text();
            var paramToGW = {
                msgId: msgId,
                channelId: callingInfo.channelID
            };
            Util.ajax.postJson('front/sh/media!execute?uid=revokeMessage', paramToGW, $.proxy(function(json, status) {
                if (status && '00000' == json.returnCode) {
                    //判断返回的数据
                    var $showRevokeMsg = $(params.el).closest(".chat-right-item");
                    var showContent = params.data.txt;
                    if(params.data.msgType == MediaConstants.MSGTYPE_IMG){
                        showContent = '[图片]';
                    }
                    $showRevokeMsg.empty();
                    if(showContent.indexOf(">") != "-1"){
                    	showContent = showContent.replace(/\>/g,"&gt;");
                    };
                    $showRevokeMsg.append("<div class='revokeDiv' title="+showContent+"><p>你撤回了一条消息</p></div>");
                    $showRevokeMsg.removeClass("chat-right-item");
                    $showRevokeMsg.addClass("revokeMsgTips");
//                  撤回图片消息展示(当前会话)
//                    var xOffset = -20;
//                    var yOffset = 10;
//                    $showRevokeMsg.find(".revokeDiv").hover(
//                        function(e) {
//                            var showContent = params.data.content;
//                            if(params.data.msgType == MediaConstants.MSGTYPE_IMG){
//                                showContent = '[图片]';
//                            }
//                            jQuery("<div id='divShow'><img id='imgshow' src='" + params.data.url + "' /></div>").appendTo("body");
//                            jQuery("#divShow").css("top", (e.pageY - xOffset) + "px").css("left", (e.pageX + yOffset) + "px").fadeIn("fast");
//                        },
//                        function() {
//                            jQuery("#divShow").remove();
//                        }
//                    );
//                    $showRevokeMsg.find(".revokeDiv").mousemove(function(e) {
//                        jQuery("#divShow").css("top", (e.pageY - xOffset) + "px").css("left", (e.pageX + yOffset) + "px")
//                    });

                    $(".ui-popup-backdrop").next().remove();
                    $('.ui-popup-backdrop').remove();
                } else {
                    _index.popAlert("消息撤回失败！");
                }
            }, this));
        });
    }
    /**
     * 获取消息撤销时间，默认2分钟
     * @return {[type]} [description]
     */
    function initRevokeTime() {
        Util.ajax.postJson("front/sh/common!execute?uid=s007", { "itemId": "104001002" }, function(json, status) {
            if (status) {
                return json.bean.value;
            } else {
                return 2;
            }
        });
    };
    /*!
     * SunHater Circle Loader v0.2 (2013-12-28)
     * jQuery plugin
     * Copyright (c) 2014 Pavel Tzonkov <sunhater@sunhater.com>
     * Dual licensed under the MIT and GPL licenses.
     * http://opensource.org/licenses/MIT
     * http://www.gnu.org/licenses/gpl.html
     */
    var circleLoader = function() {
        (function($) {

            $.fn.shCircleLoader = function(first, second) {

                var defaultNamespace = "shcl",
                    id = 1,
                    sel = $(this);

                // Destroy the loader
                if (first === "destroy") {
                    sel.find("." + defaultNamespace).detach();
                    return;

                    // Show progress status into the center
                } else if ((first === "progress") && (typeof second !== "undefined")) {
                    sel.each(function() {
                        var el = $(this),
                            outer = el.find('.' + defaultNamespace);
                        if (!outer.get(0))
                            return;
                        if (!el.find('span').get(0))
                            outer.append("<span></span>");
                        var span = outer.find('span').last();
                        span.html(second).css({
                            position: "absolute",
                            display: "block",
                            left: Math.round((outer.width() - span.width()) / 2) + "px",
                            top: Math.round((outer.height() - span.height()) / 2) + "px"
                        });
                    });
                    return;
                }

                // Default options
                var o = {
                    namespace: defaultNamespace,
                    radius: "auto", // "auto" - calculate from selector's width and height
                    dotsRadius: "auto",
                    color: "auto", // "auto" - get from selector's color CSS property; null - do not set
                    dots: 12,
                    duration: 1,
                    clockwise: true,
                    externalCss: false, // true - don't apply CSS from the script
                    keyframes: '0%{{prefix}transform:scale(1)}80%{{prefix}transform:scale(.3)}100%{{prefix}transform:scale(1)}',
                    uaPrefixes: ['o', 'ms', 'webkit', 'moz', '']
                };

                $.extend(o, first);

                // Usable options (for better YUI compression)
                var cl = o.color,
                    ns = o.namespace,
                    dots = o.dots,
                    eCss = o.externalCss,
                    ua = o.uaPrefixes,

                    // Helper functions
                    no_px = function(str) {
                        return str.replace(/(.*)px$/i, "$1");
                    },

                    parseCss = function(text) {
                        var i, prefix, ret = "";
                        for (i = 0; i < ua.length; i++) {
                            prefix = ua[i].length ? ("-" + ua[i] + "-") : "";
                            ret += text.replace(/\{prefix\}/g, prefix);
                        }
                        return ret;
                    },

                    prefixedCss = function(property, value) {
                        var ret = {};
                        if (!property.substr) {
                            $.each(property, function(p, v) {
                                $.extend(ret, prefixedCss(p, v));
                            });
                        } else {
                            var i, prefix;
                            for (i = 0; i < ua.length; i++) {
                                prefix = ua[i].length ? ("-" + ua[i] + "-") : "";
                                ret[prefix + property] = value;
                            }
                        }
                        return ret;
                    };

                // Get unexisting ID
                while ($('#' + ns + id).get(0)) { id++; }

                // Create animation CSS
                if (!eCss) {
                    var kf = o.keyframes.replace(/\s+$/, "").replace(/^\s+/, "");

                    // Test if the first keyframe (0% or "from") has visibility property. If not - add it.
                    if (!/(\;|\{)\s*visibility\s*\:/gi.test(kf))
                        kf = /^(0+\%|from)\s*\{/i.test(kf) ? kf.replace(/^((0+\%|from)\s*\{)(.*)$/i, "$1visibility:visible;$3") : (/\s+(0+\%|from)\s*\{/i.test(kf) ? kf.replace(/(\s+(0+\%|from)\s*\{)/i, "$1visibility:visible;") : ("0%{visibility:visible}" + kf));

                    $($('head').get(0) ? 'head' : 'body').append('<style id="' + ns + id + '" type="text/css">' + parseCss('@{prefix}keyframes ' + ns + id + '_bounce{' + kf + '}') + '</style>');
                }

                // Create loader
                sel.each(function() {
                    var r, dr, i, dot, rad, x, y, delay, offset, css, cssBase = {},
                        el = $(this),
                        l = el.find('.' + defaultNamespace);

                    // If loader exists, destroy it before creating new one
                    if (l.get(0))
                        l.shCircleLoader("destroy");

                    el.html('<div class="' + ns + ((ns != defaultNamespace) ? (" " + defaultNamespace) : "") + '"></div>');

                    if (eCss)
                        el = el.find('div');

                    x = el.innerWidth() - no_px(el.css('padding-left')) - no_px(el.css('padding-right'));
                    y = el.innerHeight() - no_px(el.css('padding-top')) - no_px(el.css('padding-bottom'));

                    r = (o.radius == "auto") ? ((x < y) ? (x / 2) : (y / 2)) : o.radius;

                    if (!eCss) {
                        r--;
                        if (o.dotsRadius == "auto") {
                            dr = Math.abs(Math.sin(Math.PI / (1 * dots))) * r;
                            dr = (dr * r) / (dr + r) - 1;
                        } else
                            dr = o.dotsRadius;

                        el = el.find('div');

                        i = Math.ceil(r * 2);
                        css = {
                            position: "relative",
                            width: i + "px",
                            height: i + "px"
                        };

                        if (i < x)
                            css.marginLeft = Math.round((x - i) / 2);
                        if (i < y)
                            css.marginTop = Math.round((y - i) / 2);

                        el.css(css);

                        i = Math.ceil(dr * 2) + "px";
                        cssBase = {
                            position: "absolute",
                            visibility: "hidden",
                            width: i,
                            height: i
                        };

                        if (cl !== null)
                            cssBase.background = (cl == "auto") ? el.css('color') : cl;

                        $.extend(cssBase, prefixedCss({
                            'border-radius': Math.ceil(dr) + "px",
                            'animation-name': ns + id + "_bounce",
                            'animation-duration': o.duration + "s",
                            'animation-iteration-count': "infinite",
                            'animation-direction': "normal"
                        }));
                    }

                    for (i = 0; i < dots; i++) {
                        el.append("<div></div>");
                        if (eCss && (typeof dr === "undefined"))
                            dr = (no_px(el.find('div').css('width')) / 2);
                        dot = el.find('div').last();
                        delay = (o.duration / dots) * i;
                        rad = (2 * Math.PI * i) / dots;
                        offset = r - dr;
                        x = offset * Math.sin(rad);
                        y = offset * Math.cos(rad);

                        if (o.clockwise) y = -y;

                        css = {
                            left: Math.round(x + offset) + "px",
                            top: Math.round(y + offset) + "px"
                        };

                        if (delay)
                            $.extend(css, prefixedCss('animation-delay', delay + 's'));

                        $.extend(css, cssBase);
                        dot.css(css);
                    };
                });
            }

        })(jQuery)
    };

    return objClass;
});
