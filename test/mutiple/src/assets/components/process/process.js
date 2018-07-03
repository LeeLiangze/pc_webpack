/**
 *Created by jingfei on 2016/10/8.
 */
define([
    'jquery',
    'eventTarget',
    'hdb',
    './process.tpl',
    './process.css'
], function ($, eventTarget, hdb, tpl) {
    var VERSION = '${{version}}';
    var objClass = function (options) {
        //判断el的异常值，el不存在、为空string、
        if (!options.el || options.el.length == 0) {
            this.$el = $("<div></div>");
            // return false
        } else if (typeof(options.el) == 'string' && options.el.length > 0) {
            if ($(options.el).length > 0) {
                this.$el = $(options.el);
            } else {
                this.$el = $("<div></div>")
            }
        } else if (isDOM(options.el)) {
            this.$el = $(options.el);
        } else {
            this.$el = options.el;
        }

        this.options = options;
        eventTarget.call(this);
        render.call(this);
        eventInit.call(this);
        setTimeout($.proxy(processInit, this), 200);
    };

    $.extend(objClass.prototype, eventTarget.prototype, {
        version: VERSION
    });

    var processInit = function () {
        var $li = $('.sn-step>.sn-stepbar>li', this.$el);
        var $liFirst = $li.first(),
            $liLast = $li.last(),
            length = $li.length,
            width = this.options.width / length || 160,
            height = this.options.height || 61,
            form = '';
        for (var i = 0; i < length; i++) {
            form += '<div class="formContainer' + (i + 1) + '"></div>';
        }
        $('.sn-step>.formContainer', this.$el).append(form);
        if ($liFirst.length) {
            $liFirst.addClass('step-first');
            $liFirst.children().children('.step-name').addClass('step-now');
            $liFirst.children().addClass('step-current').children('.step-num').trigger('click');
        } else {
            console.log('还没有配置进度条内容')
        }

        if ($liLast.length) {
            $liLast.addClass('step-last');
        } else {
            console.log('还没有配置进度条内容')
        }
        $li.css(
            {
                'width': width,
                'height': height
            }
        );
    };

    var render = function () {
        var handleHelper = hdb.registerHelper("addOne", function (index) {
            return index + 1;
        });
        template = hdb.compile(tpl);
        this.$el.html(template(this.options));
    };

    //自定义事件
    var eventInit = function () {
        this.$el.on('click', '.sn-step>.sn-stepbar>li>.step-done>.step-num', $.proxy(function (e, nextIndex, nowIndex, res) {
            itemsClick.call(this, e, nextIndex, nowIndex, res);
            this.trigger('itemsClick', [e, nextIndex, nowIndex, res]);
        }, this));
        this.$el.on('click', '.sn-step>.sn-stepbar>li>.step-current>.step-num', $.proxy(function (e, nextIndex, nowIndex, res) {
            itemsClick.call(this, e, nextIndex, nowIndex, res);
            this.trigger('itemsClick', [e, nextIndex, nowIndex, res]);
        }, this));
    };

    var beforeLeave = null;

    var itemsClick = function (e, nextIndex, nowIndex, res) {
        var target = e.target || e.currentTarget,
            items = this.options.items,
            next = nextIndex || $(target).closest('li').index(),
            index = $('.sn-step .step-now', this.$el).closest('li').index();
        var now = (nowIndex == 0 ? 0 : nowIndex || index);
        beforeLeave = function (key) { //this.options.beforeLeave的响应
            if (items[key].beforeLeave) {
                return items[key].beforeLeave();
            } else {
                console.log('还没有配置beforeLeave');
            }
        };
        if (items[next].click) {
            var $formNow = $('.sn-step>.formContainer form:eq(' + now + ')', this.$el);
            var $formNext = $('.sn-step>.formContainer form:eq(' + next + ')', this.$el);
            var result;
            if (next != index) {//页面可以切换
                result = res || beforeLeave(now);
                if (result || result === undefined) {//beforeLeave !=false
                    if ($(target).parent().attr('class') == 'step-done' || 'step-current') {//切换当前页面标注
                        $('.sn-step .step-now', this.$el).removeClass('step-now');
                        $('.sn-step>.sn-stepbar>li:eq(' + next + ')>div>.step-name', this.$el).addClass('step-now');
                    }

                    if ($formNext.css('display') == 'none') {//要进入的表单已经new 过了，只需显示/隐藏
                        fadeOut($formNow, function () {
                            $formNext.show();
                        });
                    } else { //没有new过，需隐藏当前表单，new下一个表单
                        fadeOut($formNow, function () {
                            items[next].click(e);
                        });
                    }
                }
            } else {
                if ($formNext.css('display') == 'block') {//i==index  点击当前进度
                    console.log('还在这一页')
                } else {//刚打开界面
                    items[next].click(e);
                }
            }
        }
    };
    //淡隐动画
    function fadeOut(obj, callBack) {
        obj.fadeOut('fast', callBack);
    }

    $.extend(objClass.prototype, {
        next: function () {
            var $now = $('.sn-step .step-now', this.$el).closest('li');
            var nowIndex = $now.index(),
                nextIndex = nowIndex + 1,
                $current = $('.sn-step li:eq(' + nextIndex + ')', this.$el).find('.step-current'),
                $done = $('.sn-step li:eq(' + nextIndex + ')>.step-done', this.$el);
            if ($now.attr('class') != 'step-last') {
                var result = beforeLeave(nowIndex);
                if (result || result === undefined) {
                    result = 1;
                } else {
                    result = 0;
                }
                if ($done.length || $current.length) { //将要进去的表单已经new过了，进度条已经改变过了，不需要再改变进度条的样式
                    $('.sn-step li:eq(' + nextIndex + ')', this.$el).find('.step-num').trigger('click', [nextIndex, nowIndex, result]);
                } else {
                    if (result == 1) {//beforeLeave !=false 可以切换表单 ，改变进度条样式
                        $('.sn-step .step-current', this.$el).removeClass('step-current').addClass('step-done');
                        $('.sn-step li:eq(' + nextIndex + ')', this.$el).children().addClass('step-current');
                        $('.sn-step .step-current', this.$el).find('.step-num').trigger('click', [nextIndex, nowIndex, result]);
                    } else {  //beforeLeave ==false,不能切换表单，不能改变样式，也不能触发click
                        console.log('不能改变进度')
                    }
                }
            } else {
                console.log('已经是最后一步了');
            }
        },
        previous: function () {
            var $now = $('.sn-step .step-now', this.$el).closest('li');
            var nowIndex = $now.index();
            var nextIndex = nowIndex - 1;
            if ($now.attr('class') != 'step-first') {
                $('.sn-step li:eq(' + nextIndex + ')', this.$el).find('.step-num').trigger('click', [nextIndex, nowIndex]);
            } else {
                console.log('已经是第一步了');
            }
        },
        switchTo: function (stepClassName) {
            var nextIndex = stepClassName.replace(/[^0-9]/ig, "") - 1;
            var nowIndex = $('.sn-step .step-now', this.$el).closest('li').index();
            var $done = $('.sn-step li:eq(' + nextIndex + ')', this.$el).find('.step-done');
            var $current = $('.sn-step li:eq(' + nextIndex + ')', this.$el).find('.step-current');
            if ($done.length || $current.length) {
                $('.sn-step li:eq(' + nextIndex + ')', this.$el).find('.step-num').trigger('click', [nextIndex, nowIndex]);
            } else {
                console.log('现在还不能跳转');
            }
        },
        get: function (stepClassName) {
            var i = stepClassName.replace(/[^0-9]/ig, "") - 1;
            var item = this.options.items[i];
            var data = {
                title: item.title,
                className: item.className,
                module: item.click
            };
            return data;
        }
    });
    // 判断是否为原生DOM
    var isDOM = function (obj) {
        return obj.tagName ? true : false
    };
    //解决ie下console.log()报错问题
    window.console = window.console || (function () {
            var c = {};
            c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function () {
            };
            return c;
        })();

    return objClass;
});