/**
 * [客户基本信息-互联网信息-微博]
 */
define(['Util',
        '../../index/constants/mediaConstants',
        '../../../tpl/content/chatInfo/weiboUser.tpl'
    ],
    function(Util, MediaConstants, tpl) {
        var _index;
        var _options;
        var initialize = function(indexModule, options) {
            var _domainUrl;
            _index = indexModule;
            _options = options;
            var $el = $(tpl);
            //客户信息展示区互联网身份展示区
            var _callingInfo = _index.CallingInfoMap.get(_options.serialNo);
            $.each(_callingInfo.multiAccountList, function(index, datas) {
                if (MediaConstants.MICROBLOGGING_TYPE == datas.mediaTypeId && _callingInfo.channelID == datas.channelId && _callingInfo.callerNo == datas.accountId) {
                    _domainUrl = datas.getDomainUrl();
                    if (_callingInfo.getToUserName() && _callingInfo.getToUserName() != "") {
                        $el.find('.tousername-value').text(_callingInfo.channelName);
                    } else {
                        $el.find('.tousername-value').text("无");
                    };
                    if (datas.getAccountId() && datas.getAccountId() != "") {
                        $el.find('.accountid-value a').text(datas.getAccountId());
                    } else {
                        $el.find('.accountid-value').text("无");
                    };
                    if (datas.getScreenName() && datas.getScreenName() != "") {
                        $el.find('.screenname-value').text(datas.getScreenName());
                    } else {
                        $el.find('.screenname-value').text("无");
                    };
                    if (datas.getGender() && datas.getGender() != "") {
                        var value = (datas.getGender() == MediaConstants.GENDER_MAN) ? "男" : "女";
                        $el.find('.gender-value').text(value);
                    } else {
                        $el.find('.gender-value').text("无");
                    };
                    if (datas.getFollowersCount() && datas.getFollowersCount() != "") {
                        $el.find('.followerscount-value').text(datas.getFollowersCount());
                    } else {
                        $el.find('.followerscount-value').text(0);
                    };
                    if (datas.getFriendsCount() && datas.getFriendsCount() != "") {
                        $el.find('.friendscount-value').text(datas.getFriendsCount());
                    } else {
                        $el.find('.friendscount-value').text(0);
                    };
                    if (datas.getStatusesCount() && datas.getStatusesCount() != "") {
                        $el.find('.statusescount-value').text(datas.getStatusesCount());
                    } else {
                        $el.find('.statusescount-value').text(0);
                    };
                    if (datas.getVerified() && datas.getVerified() != "") {
                        var value = (datas.getVerified() == "ture") ? "是" : "否";
                        $el.find('.verified-value').text(value);
                    } else {
                        $el.find('.verified-value').text("无");
                    };
                    if (datas.getRegdate() && datas.getRegdate() != "") {
                        var arr = datas.getRegdate().split(/[^0-9]/);
                        var d = new Date(arr[0], arr[1] - 1, arr[2], arr[3] ? arr[3] : 0, arr[4] ? arr[4] : 0, arr[5] ? arr[5] : 0).format("yyyy-MM-dd hh:mm:ss");
                        $el.find('.regdate-value').text(d);
                    } else {
                        $el.find('.regdate-value').text("无");
                    };
                    if(_domainUrl && _domainUrl!=""){
                        $el.find(".accountid-value a").attr("href",_domainUrl);
                    }else{
                        if(datas.getAccountId()&&datas.getAccountId()!=""){
                            var url = "http://weibo.com/"+datas.getAccountId();
                            $el.find(".accountid-value a").attr("href",url);
                        }else{
                            $el.find(".accountid-value a").attr("href","javascript:void(0)");
                        }
                    }
                }
            })
            this.content = $el;
        }
        return initialize;
    });
