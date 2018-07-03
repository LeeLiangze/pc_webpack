define([
        '../../index/constants/mediaConstants',
        '../../../tpl/content/chatInfo/weixinUser.tpl'
    ],
    function( MediaConstants, tpl) {
        var _index;
        var _options;
        var $el;
        var initialize = function(indexModule, options) {
            _index = indexModule;
            _options = options;
            $el = $(tpl);
            this.initData();
        }

        $.extend(initialize.prototype,{
            initData: function() {
                //客户信息展示区互联网身份展示区
                var _callingInfo = _index.CallingInfoMap.get(_options.serialNo);
                $.each(_callingInfo.multiAccountList, function(index, datas) {
                    if (MediaConstants.WEIXIN_TYPE == datas.mediaTypeId && _callingInfo.channelID == datas.channelId && _callingInfo.callerNo == datas.accountId) {
                        if (_callingInfo.getToUserName() && _callingInfo.getToUserName() != "") {
                            $el.find('.tousername-value').text(_callingInfo.getChannelName());
                        } else {
                            $el.find('.tousername-value').text("无");
                        };
                        if (datas.getScreenName() && datas.getScreenName() != "") {
                            $el.find('.screenname-value').text(datas.getScreenName());
                        } else {
                            $el.find('.screenname-value').text("无");
                        };
                        if (datas.getGender() && datas.getGender() != "") {
                            if (datas.getGender() == "男" || datas.getGender() == "女") {
                                $el.find('.gender-value').text(datas.getGender());
                            } else {
                                var value = (datas.getGender() == MediaConstants.GENDER_WEIXIN_MAN) ? "男" : "女";
                                $el.find('.gender-value').text(value);
                            }
                        } else {
                            $el.find('.gender-value').text("无");
                        };
                        if (datas.getLocation() && datas.getLocation() != "") {
                            $el.find('.location-value').text(datas.getLocation());
                        } else {
                            $el.find('.location-value').text("无");
                        };
                        if (datas.getRegdate() && datas.getRegdate() != "") {
                            $el.find('.regdate-value').text(datas.getRegdate());
                        } else {
                            $el.find('.regdate-value').text("无");
                        }
                    }

                })
                this.content = $el;
            }
        });

        return initialize;
    });
