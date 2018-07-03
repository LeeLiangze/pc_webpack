define(['Util',
        '../../index/constants/mediaConstants',
        '../../../tpl/content/chatInfo/webchatUser.tpl'
    ],
    function(Util, MediaConstants, tpl) {
        var _index;
        var _options;
        var initialize = function(indexModule, options) {
            _index = indexModule;
            _options = options;
            var $el = $(tpl);

            //客户信息展示区互联网身份展示区
            var _callingInfo = _index.CallingInfoMap.get(options.serialNo);
            if (_callingInfo.toUserName && _callingInfo.toUserName != "") {
                $el.find('.tousername-value').text(_callingInfo.channelName);
            } else {
                $el.find('.tousername-value').text("无");
            };
            this.content = $el;
        }
        return initialize;
    });
