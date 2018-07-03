/**
 *   客户交谈区左侧聊天气泡
 */
define(['Util',
    '../../../../tpl/content/chatArea/chatLeft/chatLeftText.tpl',
    '../../../../tpl/content/chatArea/chatLeft/chatLeftImg.tpl',
    '../../../../tpl/content/chatArea/chatLeft/chatLeftRecord.tpl',
    '../../../index/constants/mediaConstants',
    '../voice',
    '../../../../assets/css/content/chatArea/chatLeft/chatLeft.css'
], function(Util, LeftTextTpl, LeftImgTpl, LeftRecordTpl, MediaConstants,Voice) {

    var _index = null;
    var objClass = function(index) {
        _index = index;
    };

    $.extend(objClass.prototype, {

        createLeftItem: function(data, $chatContent, flag) {
            var scrollflag = false;
            phoneNum = "";
            userName = "";
            //判断用户民和手机号是否为空
            if ("" != data.nickName && data.nickName != null) {
                phoneNum = data.nickName;
            }
            if ("" != data.userName && data.userName != null) {
                userName = data.userName;
            }
            // data.msgType = MediaConstants.MSGTYPE_AUDIO;
            if (data.msgType == MediaConstants.MSGTYPE_TEXT) {
                //文本
                var leftTextTpl = Util.hdb.compile(LeftTextTpl);
                $leftText = $(leftTextTpl({}));
                if (flag == 0) {
                    $($chatContent.find('.chat-content')).append($leftText);
                } else {
                    $($chatContent.find('.chat-more-msg')).after($leftText);
                }
                $leftText.find('.chat-info .chat-time').text(data.originalCreateTime);
                $leftText.find('.chat-info .chat-phonenum').text(phoneNum);
                $leftText.find('.chat-info .chat-username').text(userName);
                $leftText.find('.chat-icon img').attr('src', _index.contentCommon.getLogoURL(data.channelID, data.mediaTypeId));
                $leftText.find('#msgId').text(data.msgId);
                //复制一份data数据
                var dataTemp = _index.contentCommon.cloneObject(data);
                var content = _index.contentCommon.parseContentForHref(dataTemp.content);
                dataTemp.content = content;
                content = _index.contentCommon.parseKeyToFace(dataTemp);
                content = _index.contentCommon.parseContentForEnter(content);
                $leftText.find('.chat-content-text p').html(content);
            } else if (data.msgType == MediaConstants.MSGTYPE_IMG) {
                //图片
                var leftImgTpl = Util.hdb.compile(LeftImgTpl);
                $leftImg = $(leftImgTpl({}));
                if (flag == 0) {
                    $($chatContent.find('.chat-content')).append($leftImg);
                } else {
                    $($chatContent.find('.chat-more-msg')).after($leftImg);
                }
                $leftImg.find('.chat-time').text(data.originalCreateTime);
                $leftImg.find('.chat-info .chat-phonenum').text(phoneNum);
                $leftImg.find('.chat-info .chat-username').text(userName);
                $leftImg.find('.chat-icon img').attr('src', _index.contentCommon.getLogoURL(data.channelID, data.mediaTypeId));
                var imagePath = data.url.replace('.', '_min.');
                $leftImg.find('.chat-content-img img').attr('src', imagePath);
                $leftImg.find('#msgId').text(data.msgId);
                //图片点击
                $leftImg.on("click", ".chat-content-img img", $.proxy(function() { photoClick($leftImg,data); }, this));
            } else if (data.msgType == MediaConstants.MSGTYPE_AUDIO) {
                var leftRecordTpl = Util.hdb.compile(LeftRecordTpl);
                $leftRecord = $(leftRecordTpl({}));
                $($chatContent.find('.chat-content')).append($leftRecord);
                $leftRecord.find('.chat-info .chat-time').text(data.originalCreateTime);
                $leftRecord.find('.chat-info .chat-phonenum').text(phoneNum);
                $leftRecord.find('.chat-info .chat-username').text(userName);

                // $leftRecord.find('.chat-content-record').attr('width',len);
                $leftRecord.find('.record-time').text(data.duration + "\"");
                $leftRecord.find('.chat-icon img').attr('src', _index.contentCommon.getLogoURL(data.channelID, data.mediaTypeId));
                $leftRecord.find('#msgId').text(data.msgId);
                var voiceData = {
                    url: data.url,
                    senderFlag: data.senderFlag,
                    time: data.duration,
                    msgId:data.msgId,
                    voiceFlag:data.voiceFlag
                };
                //录音播放js
                var voice = new Voice(_index, $leftRecord, voiceData);
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
        },

    });

    function photoClick($leftImg,data) {
        var $img = $leftImg.find('.chat-content-img img');
        var imgPath = data.url;
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
            var $showRevokeMsg = $leftImg.closest(".chat-left-item");
            var msgId = $showRevokeMsg.find('#msgId').text();
            //压缩图片
            while (width >= 800 || height >= 600) {
                width = width * 0.9;
                height = height * 0.9;
            }
            var dataParam = {
                "msgId" : data.msgId,
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
    return objClass;
});
