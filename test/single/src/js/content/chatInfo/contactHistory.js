/**
 *  客户交谈区-接触记录
 */
define(['Util',
    '../../../tpl/content/chatInfo/contactHistory.tpl',
    '../../index/constants/mediaConstants',
    'Compts',
    '../../../assets/css/content/chatInfo/contactHistory.css'
], function(Util, tpl, MediaConstants, Compts) {

    var _index = null;
    var $el;
    var list;
    var initialize = function(index, options) {
        _index = index;
        $el = $(tpl);
        this.options = options;
        this.content = $el;
        this.listInit();
    };

    $.extend(initialize.prototype, {
        listInit: function() {
            var config = {
                el: $el[0],
                field: {
                    key: 'serireNo',
                    boxType: 'radio',
                    items: [{
                            text: '流水号',
                            name: 'serireNo',
                            className: 'list-serireNo',
                            click: function(e, item) {
                                _index.main.createTab("接触详情", "js/common/contact/contactDetil", item);
                            },
                            render: function(item, val) {
                                return val;
                            }
                        },
                        { text: '接触时间', name: 'time', className: 'w120' },
                        { text: '媒体', name: 'mediaType', className: 'w40' },
                        { text: '主叫号码', name: 'phoneNum', className: 'w90' }
                    ]
                },
                page: {
                    perPage: 4,
                    total: true,
                    align: 'right'
                },
                data: {
                    url: 'front/sh/common!execute1'
                }
            };
            list = new Compts.List(config);
            var callerNo = this.options.callerNo;
            setTimeout(function() {
                if (typeof(callerNo) != "undefined" && callerNo != "") {
                    var timeStr = _index.utilJS.getCurrentTime();
                    var now = new Date(timeStr.replace(/-/g, "/"));
                    var milliseconds = now.getTime() - (1000 * 60 * 60 * 24 * 7);
                    var startTime = new Date();
                    startTime.setTime(milliseconds);
                    var contactStartTime = startTime.format("yyyy-MM-dd hh:mm:ss");
                    var contactEndTime = now.format("yyyy-MM-dd hh:mm:ss");
                    var searchParams = {
                        "callerNo": callerNo,
                        "contactStartTime": contactStartTime,
                        "contactEndTime": contactEndTime,
                        "start": MediaConstants.HISTORY_START
                    }
                    var queryTouchType = {
                        queryTouchType: _index.CTIInfo.queryTouchType
                    };
                    $.extend(searchParams, queryTouchType);
                    list.search(searchParams);
                }
            }, 500);
            $el.find('.sn-list table th').css('text-align', 'center');
        }
    });
    return initialize;
});
