/**
 *   客户交谈区聊天框
 *   张云天
 */
define(['Util',
    '../../../tpl/content/chatArea/chatArea.tpl',
    '../../index/constants/mediaConstants',
    './chatLeft/chatLeft',
    './chatRight/chatRight',
    '../../../assets/css/content/chatArea/chatArea.css'
], function(Util, tpl, MediaConstants, ChatLeft, ChatRight) {

    var _index = null;
    var $el;
    //渠道集合
    var channelEntry = {};
    //媒体集合
    var mediaEntry = {};
    var chatLeft;
    var chatRight;
    //点更多消息的消息数量
    var pageNumber;
    //每次请求的消息数量（默认5条）
    var pageSize;
    //第一次消息接收时间
    var firstMsgTime;
    var objClass = function(index, options) {
        _index = index;
        this.options = options;
        $el = $(tpl);
        pageSize = MediaConstants.HISTORY_TPAGESIZE;
        this.content = $el;
    };

    $.extend(objClass.prototype, {

        /**
         * 聊天对话气泡
         * @param  data      [聊天消息数据]
         * @param  $chatShow [包裹chatarea的外层div]
         */
        createChatArea: function(data, $chatShow) {
            if (data.senderFlag == MediaConstants.SENDER_FLAG_CUST) {

                //用户发的消息
                var chatLeft = new ChatLeft(_index);
                chatLeft.createLeftItem(data, $chatShow, 0);
            } else {
                // 坐席、智能应答、系统消息
                var chatRight = new ChatRight(_index);
                chatRight.createRightItem(data, $chatShow, 0);
            }
            //自动滚动到底部
            $($chatShow.find('.chat-area')).scrollTop(($chatShow.find('.chat-content'))[0].scrollHeight);
        },
        moreBtnClick: function() {
            $el.on('click', '.chat-more-msg a', $.proxy(this.moreClick, this));
        },
        /**
         * 更多消息点击事件
         */
        moreClick: function() {
            var that = this;
            var serialNo = _index.CallingInfoMap.getActiveSerialNo();
            var callingInfo = _index.CallingInfoMap.get(serialNo);
            var callerNo = callingInfo.getCallerNo();
            //获取队列区保存的第一条消息接收时间
            // firstMsgTime = _index.queue.originalCreateTime[serialNo];
            var pageNumber = $('.more-msg-start', '#chartWarp_' + serialNo).text();
            var data = {
                "callerNo": callerNo,
                "start": pageNumber,
                "limit": pageSize,
                "serialNo": serialNo
            };
            var $_chatShow = $('#chartWarp_' + serialNo).find('.chat-show');
            Util.ajax.postJson('front/sh/common!execute?uid=queryMoreInfo', data, $.proxy(function(json, status) {
                if (status && json.bean.total > parseInt(pageNumber)) {
                    that.getMoreMsg(json.beans, $_chatShow);
                    pageNumber = Number(pageNumber) + Number(pageSize);
                    $('.more-msg-start', '#chartWarp_' + serialNo).text(pageNumber);
                } else {
                    $_chatShow.find('.chat-more-msg a').css("color", "grey");
                    $_chatShow.find('.chat-more-msg a').text("没有更多消息");
                    $_chatShow.find('.chat-more-msg').removeClass('chat-more-msg');
                }
            }, this));
        },
        /**
         * 查看更多消息
         * @param   items [消息数据]
         *
         */
        getMoreMsg: function(items, $_chatShow) {
            if (items.length > 0) {
                for (var prop in items) {
                    if (items[prop].msgType != '-999'&&items[prop].cancelFlag == '0') {
                        items[prop].msgId = items[prop].id;
                        items[prop].url = items[prop].requestAffix;
                        items[prop].channelID = items[prop].channelId;
                        if (items[prop].senderFlag == MediaConstants.SENDER_FLAG_CUST) {
                            //用户发的消息
                            var chatLeft = new ChatLeft(_index);
                            chatLeft.createLeftItem(items[prop], $_chatShow, 1);
                        } else {
                            // 坐席、智能应答、系统消息
                            var chatRight = new ChatRight(_index);
                            chatRight.createRightItem(items[prop], $_chatShow, 1);
                        }
                    }

                }
            }

            //滚动到顶部
            $($_chatShow.find('.chat-area')).scrollTop(0);
        }
    });
    return objClass;
});
