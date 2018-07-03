/**
 *  客户交谈区-互联网信息
 */
define(['Util',
    '../../../tpl/content/chatInfo/netInfo.tpl',
    '../../index/constants/mediaConstants',
    './webChatUser',
    '../../../assets/css/content/chatInfo/netInfo.css'
], function(Util, tpl, MediaConstants, WebChat) {

    var _index = null;
    var $el;
    var items;
    var itemLength;
    var _options;
    var objClass = function(index, options) {
        _index = index;
        $el = $(tpl);
        _options = options;
        this.mediaTypeId = options.mediaTypeId;
        this.content = $el;
        this.initData();
    };

    $.extend(objClass.prototype, {
        initData: function() {
            if (this.mediaTypeId == MediaConstants.MICROBLOGGING_TYPE) {
                //微博
                require(['./weiboUser'], function(WeiboUser) {
                    var weiBoUser = new WeiboUser(_index, _options);
                    $el.html(weiBoUser.content);
                });
            } else if (this.mediaTypeId == MediaConstants.WEIXIN_TYPE) {
                //微信
                require(['./weixinUser'], function(WeixinUser) {
                    var weiXinUser = new WeixinUser(_index, _options);
                    $el.html(weiXinUser.content);
                });
            } else if (this.mediaTypeId == MediaConstants.MEDIA_ONLINE_SERVICE) {
                //webchat
                // require(['js/content/chatInfo/webChatUser'], function(WebChat) {
                var webChat = new WebChat(_index, _options);
                $el.html(webChat.content);
                // });
            }
        },

    });
    return objClass;
});
