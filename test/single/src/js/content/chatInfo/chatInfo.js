/**
 * [客户交谈区右侧信息区]
 * 张云天
 */
define(['Util',
    '../../../tpl/content/chatInfo/chatInfo.tpl',
    '../../../assets/css/content/chatInfo/chatInfo.css',
], function(Util, tpl) {

    var _index = null;
    var _options;
    var $el;
    //菜单选项
    var items;
    //菜单个数
    var itemLength;
    //当前页面索引
    var currentIndex = -1;
    //当前页面
    var currentPage;
    var initialize = function(index, options) {
        _index = index;
        $el = $(tpl);
        _options = options;
        this.options = options;
        this.info = $el;
        this.initData();
    };
    $.extend(initialize.prototype, {
        initData: function() {
            var that = this;
            Util.ajax.postJson('front/sh/common!execute?uid=customerExtInfo001', {}, function(json, status) {
                if (status) {
                    items = json.beans;
                    itemLength = items.length;
                    for (var num in items) {
                        if (items[num].hideFlag == 0) {
                            //判断该菜单项是否显示
                            var itemName = items[num].configItemName;
                            $el.find('.menu-item').append('<div><li class="item-info-' + num + '"><a href="javascript:void(0);">' + itemName + '</a></li></div>');
                        }
                    }
                    if (items.length <= 3) {
                        $el.find('.menu-left').css('display', 'none');
                        $el.find('.menu-right').css('display', 'none');
                    }

                    //默认打开第一个页面
                    that.menuSelected(0, true);
                    require([items[0].configItemUrl], $.proxy(function(Page) {
                        //给每一个a标签加点击事件
                        for (var n in items) {
                            (function(n) {
                                $el.on('click', '.item-info-' + n + ' a', $.proxy(function() {
                                    that.menuSelected(n, false);
                                }, that));
                            })(n)
                        }
                    }));
                }
            });

            $el.on('click', '.menu-left', $.proxy(this.switchLeft, this));
            $el.on('click', '.menu-right', $.proxy(this.switchRight, this));
        },
        /**
         * [右滑动]
         */
        switchRight: function() {
            var serialNo = _index.queue.currentQueueData.serialNo;
            $('.menu-item', '#chartWarp_' + serialNo).animate({ left: '+=100px' }, 120);
        },
        /**
         * [左滑动]
         */
        switchLeft: function() {
            var serialNo = _index.queue.currentQueueData.serialNo;
            $('.menu-item', '#chartWarp_' + serialNo).animate({ left: '-=100px' }, 120);
        },

        /**
         * 设置默认选中客户基本信息
         * @return {[type]} [description]
         */
        defaultSelect: function() {
            var serialNo = _options.serialNo;

        },
        /**
         * 选中菜单项
         * @param  {[type]} num  [菜单选项]
         * @param  {[type]} flag [是否是默认选项，即加载页面默认选中第一个：客户基本信息]
         * @return {[type]}      [description]
         */
        menuSelected: function(num, flag) {
            var serialNo = _index.queue.currentQueueData.serialNo;
            var mediaTypeId = _index.queue.currentQueueData.mediaTypeId;
            var callerNo = _index.CallingInfoMap.get(serialNo).callerNo;
            currentIndex = num;
            //默认则取页面穿过来的serialNo
            if (flag) {
                serialNo = _options.serialNo;
                for (var n in items) {
                    if (n == num) {
                        $el.find('.item-info-' + n).css('border-bottom', '3px solid #0085D0');
                        $el.find('.item-info-' + n + ' a').css('color', '#222222');
                    } else {
                        $el.find('.item-info-' + n + ' a').css('color', '#707070');
                        $el.find('.item-info-' + n).css('border-bottom', '0px solid #0085D0');
                    }
                }
                //改变info-content的页面
                require([items[currentIndex].configItemUrl], $.proxy(function(Page) {
                    var data = {
                        serialNo: serialNo,
                        mediaTypeId: mediaTypeId
                    };
                    currentPage = new Page(_index, data);
                    //信息页面统一有一个变量content
                    $el.find('.info-content div').remove();
                    $el.find('.info-content').append(currentPage.content);
                }));
            } else {
                for (var n in items) {
                    if (n == num) {
                        $('#chartWarp_' + serialNo).find('.item-info-' + n).css('border-bottom', '3px solid #0085D0');
                        $('#chartWarp_' + serialNo).find('.item-info-' + n + ' a').css('color', '#222222');
                    } else {
                        $('#chartWarp_' + serialNo).find('.item-info-' + n + ' a').css('color', '#707070');
                        $('#chartWarp_' + serialNo).find('.item-info-' + n).css('border-bottom', '0px solid #0085D0');
                    }
                }
                var isStart = items[currentIndex].configItemUrl.indexOf("http");
                $('#chartWarp_' + serialNo).find('.info-content').children('div').css('display', 'none');
                if ($('#chartWarp_' + serialNo).find('.info-content').children("." + serialNo + "-" + currentIndex).length == 1) {
                    $('#chartWarp_' + serialNo).find('.info-content .' + serialNo + "-" + currentIndex).css('display', 'block')
                    return;
                }
                if (isStart == 0) {
                    var url = items[currentIndex].configItemUrl;
                    var className = serialNo + "-" + currentIndex;
                    var $contentTemp = $("<div class='" + className + "'><iframe src='" + url + "'style='height:600px' frameborder='no' border='0' marginwidth='0' marginheight='0' scrolling='auto' allowtransparency='yes'></iframe></div>");
					$('#chartWarp_' + serialNo).find('.info-content').append($contentTemp);
                    // var $iframe = $contentTemp.find('iframe');
                    // $iframe.load(function() {
                    //     $iframe[0].contentWindow.postMessage(JSON.stringify({type: "event", name: "callerNo", param:callerNo }),$iframe.attr("src"))
                    // });

                } else {
                    //改变info-content的页面
                    require([items[currentIndex].configItemUrl], $.proxy(function(Page) {
                        var data = {
                            serialNo: serialNo,
                            mediaTypeId: mediaTypeId,
                            callerNo: callerNo
                        };

                        currentPage = new Page(_index, data);
                        //信息页面统一有一个变量content
                        $('#chartWarp_' + serialNo).find('.info-content').append(currentPage.content);
                        currentPage.content.addClass(serialNo + "-" + currentIndex);
                    }));
                }
            }

        },
    });

    return initialize;
});
