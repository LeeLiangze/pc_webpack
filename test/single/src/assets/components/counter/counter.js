/**
 * 组件-counter
 */
define([
    'jquery',
    'eventTarget',
    './counter.tpl',
    './counter.css'
], function ($, eventTarget, tpl) {
    var VERSION = '${{version}}';
    var objClass = function (options) {
        //判断el的异常值：el不存在、为空string、dom原生对象
        if (options.el) {
            if (options.el instanceof jQuery && options.el.length > 0) {
                this.$el = options.el;
            } else if (isDOM(options.el)) {
                this.$el = $(options.el);
            } else if (typeof(options.el) == 'string' && $(options.el).length > 0) {
                this.$el = $(options.el);
            }
        } else {
            this.$el = $("<div></div>")
        }
        this.options = options;
        eventTarget.call(this);
        render.call(this);
        eventInt.call(this);

        // 获取步进器的最大值和最小值
        var max = this.options.max;
        min = this.options.min;
        value = this.options.value;
        $counter = $('.sn-counter>.counterContent', this.$el);

        // 设置步进器的value
        value = value || 0;
        min = min > 0 ? min : 0;
        if (value < min) {
            value = min;
        } else if (value > max) {
            value = max;
        }
        this.options.min = min;
        this.options.value = value;
        $counter.val(value);

        // 手动录入
        $counter.blur(function () {
            var val = $(this).val();
            if (isNaN(val) || val == "") {
                $(this).val(min);
            } else {
                val = (val > max ? max : val < min ? min : val);
                $(this).val(val);
            }
        })
    };

    $.extend(objClass.prototype, eventTarget.prototype, {
        version: VERSION
    });

    var render = function () {
        var $tpl = $(tpl);
        $tpl.addClass(this.options.className);
        if (this.options.label) {
            $tpl.prepend('<label>' + this.options.label + '</label>');
        }
        $tpl.find('.counterContent').attr('value', this.options.value);
        this.$el.html($tpl);
    };
    //自定义事件
    var eventInt = function () {
        var setTime, that = this;
        var timeout = function (i, fn) {
            setTime = setTimeout($.proxy(function () {
                fn.call(that);
                that.trigger("'" + fn + "'");
                i < 6 && i++;
                timeout(i, fn);
            }, this), 420 - i * 50)
        };
        $('.sn-counter .addBtn', this.$el).on('mousedown', $.proxy(function () {
            var i = 0;
            addNumber.call(this);
            this.trigger('addNumber');
            timeout(i, addNumber)
        }, this));
        $(".sn-counter .addBtn", this.$el).on("mouseup", function () {
            clearTimeout(setTime);
        });
        $('.sn-counter .minusBtn', this.$el).on('mousedown', $.proxy(function () {
            var i = 0;
            minusNumber.call(this);
            this.trigger('minusNumber');
            timeout(i, minusNumber)
        }, this));
        $(".sn-counter .minusBtn", this.$el).on("mouseup", function () {
            clearTimeout(setTime);
        });
        $('.sn-counter>.counterContent', this.$el).on('focus', $.proxy(function () {
            this.trigger('focus');
        }, this));
    };

    var addNumber = function () {
        var $counter = $('.sn-counter>.counterContent', this.$el);
        var val = parseInt($counter.val()),
            max = this.options.max;
        if (val < max) {
            val += 1;
            $counter.val(val);
        } else {
            $counter.val(max);
        }
    };
    var minusNumber = function () {
        var $counter = $('.sn-counter>.counterContent', this.$el);
        var val = parseInt($counter.val()),
            min = this.options.min;
        if (val > min) {
            val -= 1;
            $counter.val(val);
        } else {
            $counter.val(min);
        }
    };
    $.extend(objClass.prototype, {
        get: function () {
            return $('.sn-counter>.counterContent', this.$el).val();
        },
        set: function (num) {
            var $counter = $('.sn-counter>.counterContent', this.$el),
                max = this.options.max,
                min = this.options.min;
            if (num > max) {
                $counter.val(max);
            } else if (num < min) {
                $counter.val(min);
            } else {
                $counter.val(num);
            }
        }
    });

    //解决ie下console.log()报错问题
    window.console = window.console || (function () {
            var c = {};
            c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function () {
            };
            return c;
        })();
    // 判断是否为原生DOM
    var isDOM = function (obj) {
        return obj.tagName ? true : false
    };

    return objClass;
});