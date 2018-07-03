define([
    'jquery',
    'eventTarget',
    'hdb',
    './radios.tpl',
    './radios.css'
], function ($, eventTarget, hdb, tpl) {
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
            this.$el = $("<div></div>");
        }
        this.options = options;
        eventTarget.call(this);
        helpersInit.call(this);
        render.call(this);
        eventInit.call(this);
        var _self = this;
        setTimeout(function () {
            _self.trigger('initEnd');
        }, 100);
    };
    var helpersInit = function () {
        hdb.registerHelper('ifInDisabledValue', $.proxy(function (value, options) {
            var disabled = $(value, this.options.disabled);
            if (disabled == 0) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        }, this));
        hdb.registerHelper('ifInDefaultValue', $.proxy(function (value, options) {
            // if (this.options.defaultValue)
            var index = $.inArray(value, this.options.defaultValue.split(','));
            if (index >= 0) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        }, this));
    };
    var render = function () {
        var input = 'ul>li>div>input';
        var $input = $(input);
        var template = hdb.compile(tpl);
        this.$el.html(template(this.options));
        var $input = $(input, this.$el);
        if (this.options.disabled == 1) {
            this.disabled();
        }
    };
    var eventInit = function () {
        this.$el.on('click', 'ul>li>div', $.proxy(function (e) {
            itemClick.call(this, e);
            this.trigger('itemClick', e);
        }, this));
    };
    var initEnd = function () {
    };
    var itemClick = function (e) {
        var $li = $(e.target || e.currentTarget).closest('li');
        var $input = $li.find('input');
        var index = $li.index();
        var data = this.options.items[index];
        if ($input.attr('disabled')) {
            return false;
        }
        if ($input.attr('checked') != 'checked') {
            $('ul>li>div', this.$el).removeClass('checked');
            $('ul>li>div>input', this.$el).attr('checked', false);
            $input.attr('checked', true);
            $input.parent().addClass('checked');
        } else {
            return false;
        }
        var itemData = {
            label: data.label,
            value: data.value
        };
        this.trigger('change', e, itemData);
        if (data.click) {
            data.click(e, itemData);
        }
    };
    $.extend(objClass.prototype, eventTarget.prototype, {
        version: VERSION,
        disabled: function () {
            var $input = $('ul>li>div>input', this.$el);
            $input.attr('disabled', true);
            $input.parent().addClass('disabled');
        },
        enable: function () {
            $('ul>li>div>input', this.$el).attr('disabled', false)
                .parent().removeClass('disabled');
        },
        get: function () {
            return $('ul>li>div>input[checked="checked"]', this.$el).val() || '';
        },
        set: function (data, e) {
            var $inputChk = $('ul>li>div>input[checked="checked"]', this.$el);
            if ($inputChk.val() != data) {
                var $input = $('ul>li>div>input[value="' + data + '"]', this.$el);
                if ($input.length) {
                    var index = $input.closest('li').index();
                    var itemData = {
                        label: this.options.items[index].label,
                        value: data
                    };
                    $inputChk.attr('checked', false);
                    $inputChk.parent().removeClass('checked');
                    $input.attr('checked', true);
                    $input.parent().addClass('checked');
                    this.trigger('change', e, itemData);
                }
            }
        },
        clear: function () {
            var $inputChk = $('ul>li>div>input[checked="checked"]', this.$el);
            if ($inputChk.length) {
                $inputChk.attr('checked', false);
                $inputChk.parent().removeClass('checked');
            }
        },
        destroy: function () {
            this.$el.remove();
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