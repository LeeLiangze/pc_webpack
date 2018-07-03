/**
 * 组件-timer
 */
define([
    'eventTarget',
    './timer.tpl',
    './timer.css'
], function (EventTarget, tpl) {
    var VERSION = '${{version}}';
    var objClass = function (config) {
        //判断el的异常值：el不存在、为空string、dom原生对象
        if (config.el instanceof jQuery && config.el.length > 0) {
            this.$el = config.el;
        } else if (config.el && isDOM(config.el)) {
            this.$el = $(config.el);
        } else if (typeof(config.el) == 'string' && $(config.el).length > 0) {
            this.$el = $(config.el);
        } else {
            this.$el = $("<div></div>")
        }
        // 判断是否有className
        config.className = (!config.className ? "timerContent" : config.className);
        // 判断是否自动播放
        config.autoStart = (config.autoStart == 0 ? 0 : config.autoStart || true);
        // 判断是否有初始值
        config.value = (!config.value ? "00:00" : config.value);

        this.options = config;
        EventTarget.call(this);
        var $tpl = $(tpl);
        $tpl.addClass(config.className).find('span').html(config.value);
        this.$el.html($tpl);

        // 判断是否启动定时器
        if (config.autoStart == 1 || config.autoStart == true) {
            this.start();
        } else {
            this.pause();
        }
    };
    // 扩展方法
    $.extend(objClass.prototype, EventTarget.prototype, {
        version: VERSION,
        start: function () {
            if (this.timer) {
                return false
            }
            var $timer = $('.' + this.options.className + '>span', this.$el),
                timerValArr = $timer.html().split(':'),
                timerValMin = timerValArr[0], //初始时间：分
                timerValSeconds = timerValArr[1]; //初始时间：秒
            if (this.options.max) {
                var defaultValMin = this.options.max.split(':')[0]; //最大时间：分
                var defaultValSeconds = this.options.max.split(':')[1]; //最大时间：秒
            } else {
                console.log("不存在最大时间");
            }
            var me = this;
            // 声明定时器，开始计时
            var timerHtml = function () {
                me.timer = setInterval(function () {
                    timerValSeconds++;
                    timerValSeconds = (timerValSeconds < 10 ? ('0' + timerValSeconds) : timerValSeconds);
                    if (timerValSeconds > 59) {
                        timerValMin++;
                        timerValSeconds = "00";
                        timerValMin = (timerValMin < 10 ? ('0' + timerValMin) : timerValMin);
                    }
                    if (defaultValMin && timerValMin >= defaultValMin && timerValSeconds >= defaultValSeconds) {
                        me.pause();
                        me.trigger('max');
                    }
                    $timer.html(timerValMin + ':' + timerValSeconds);
                }, 1000)
            };
            if (defaultValMin && timerValMin < defaultValMin) {
                timerHtml()
            } else if (defaultValMin && defaultValSeconds && timerValMin == defaultValMin && timerValSeconds < defaultValSeconds) {
                timerHtml()
            } else if (!defaultValMin || !defaultValSeconds) {
                timerHtml()
            } else {
                return;
            }
        },
        pause: function () {
            clearInterval(this.timer);
            this.timer = null;
        },
        reset: function () {
            clearInterval(this.timer);
            this.timer = null;
            var $timer = $('.' + this.options.className + '>span', this.$el);
            $timer.html("00:00");
        }
    });
    // 注册max事件
    var max = function () {
    };
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
    return objClass
});
