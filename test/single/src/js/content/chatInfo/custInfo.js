/**
 *  客户交谈区-客户信息
 */
define(['Util',
    '../../../tpl/content/chatInfo/custInfo.tpl',
    '../../index/constants/mediaConstants',
    '../../../assets/css/content/chatInfo/iconfont-chat.css',
    '../../../assets/css/content/chatInfo/custInfo.css'
], function(Util, tpl, MediaConstants) {

    var _index = null;
    var $el;
    var initialize = function(index, options) {
        _index = index;
        $el = $(tpl);
        this.options = options;
        this.content = $el;
        this.initData();
    }

    $.extend(initialize.prototype, {
        initData: function() {
            var callingInfo = _index.CallingInfoMap.get(this.options.serialNo);
            var clientInfo = callingInfo.clientInfoMap[callingInfo.getSubsNumber()];
            //招标网客户身份显示
            var customerStatus = callingInfo.getCustomerStatus();
            var serviceTypeId = _index.CTIInfo.serviceTypeId;
            Util.ajax.postJson('front/sh/common!execute?uid=customerInfoBar004&serviceTypeId=' + serviceTypeId + '&viewMode=02', {}, function(json, status) {
                if (status) {
                    var items = json.beans;
                    for (var prop in items) {
                        //过滤互联网视图
                        if (items[prop].groupType == '02') {
                            var property = items[prop].configItemId;
                            var value;
                            if (typeof(clientInfo) == 'undefined') {
                                value = "--";
                            } else if (typeof(clientInfo[property]) == 'undefined' || clientInfo[property] == "") {
                                value = "--";
                            } else {
                                value = clientInfo[property];
                            }
                            if (property == "belongV") {
                                //归属地市特殊处理
                                value = clientInfo.provNm;
                                if (clientInfo.provNm && clientInfo.cityNm && clientInfo.cityNm != clientInfo.provNm) {
                                    value = clientInfo.provNm + "-" + clientInfo.cityNm;
                                } else {
                                    value = "--";
                                }
                            }
                            $el.find('.cust-table').append('<tr>' +
                                '<td class="tag ' + property + '-tag">' + items[prop].name + '</td>' +
                                '<td class="value ' + property + '-value">' + value + '</td>' +
                                '</tr>');
                        }

                    }

                    //招标网身份特殊处理
                    var valueTemp = "--";
                    if (customerStatus && customerStatus != "") {
                        switch (customerStatus) {
                            case "0":
                                valueTemp = "游客";
                                break;
                            case "1":
                                valueTemp = "项目经理";
                                break;
                            case "2":
                                valueTemp = "评标专家";
                                break;
                            case "3":
                                valueTemp = "代理机构";
                                break;
                            case "4":
                                valueTemp = "供应商";
                                break;
                        }
                        $el.find('.customerStatus-value').text(valueTemp);
                    }

                }
            });
        }
    });
    return initialize;
});
