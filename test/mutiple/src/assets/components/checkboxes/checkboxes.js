define([
    'jquery',
    'eventTarget',
    'hdb',
    './checkboxes.tpl',
    './checkboxes.css'
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
            this.$el = $("<div></div>")
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
            var index = $.inArray(value, this.options.disabledValue.split(','));
            if (index >= 0) {
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
        // if(this.options.defaultValue){
        //     var defaultValue = this.options.defaultValue.split(',');
        //     $.each(defaultValue,function(key,value){
        //         var $valueInput = $(input+"[value="+value+"]",this.$input);
        //         if($valueInput.length != 0){
        //             $valueInput.attr('checked',true);
        //             $valueInput.parent().addClass('checked');
        //         }
        //     })
        // }
    };
    var eventInit = function () {
        this.$el.on('click', '.sn-checkboxes>ul>li>div', $.proxy(function (e) {
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
        if ($input.attr('checked')) {
            $input.attr('checked', false);
            $input.parent().removeClass('checked');
        } else {
            $input.attr('checked', true);
            $input.parent().addClass('checked');
        }
        var itemData = {
            label: data.label,
            value: data.value,
            checked: $input.attr('checked') ? 1 : 0
        };
        this.trigger('change', e, itemData);
        if (data.click) {
            data.click(e, itemData);
        }
    };
    $.extend(objClass.prototype, eventTarget.prototype, {
        version: VERSION,
        disabled: function (valueStr) {
            var $container = $('ul>li>div', this.$el);
            var $input = null;
            if (valueStr) {
                var valueArr = valueStr.split(',');
                $.each(valueArr, function (key, value) {
                    $input = $('input[value=' + value + ']', $container);
                    if (!($input.attr('disabled') == 'disabled')) {
                        $input.attr('disabled', true);
                        $input.parent().addClass('disabled');
                    }
                })
            } else {
                $input = $('input', $container);
                $input.attr('disabled', true);
                $('ul>li>div', this.$el).addClass('disabled');
            }

        },
        disable: function (data) {
            this.disabled(data);
        },
        enable: function () {
            // var input = ;
            $('ul>li>div>input', this.$el).attr('disabled', false)
                .parent().removeClass('disabled');
        },
        get: function () {
            var $inputs = $('ul>li>div>input', this.$el);
            // var input = 'ul>li>div>input';
            // var $input = $(input) ; 
            var data = [];
            $inputs.each(function () {
                if ($(this).attr('checked') == 'checked') {
                    data.push($(this).val());
                }
            });
            return data.join(',');
        },
        set: function (data, e) {
            var $inputs = $('ul>li>div>input', this.$el);
            // var input = 'ul>li>div>input';
            // var $input = $(input) ; 
            data = data.split(',');
            var self = this;
            $.each(data, function (key, value) {
                var $inputs = $('[value=' + value + ']', $inputs);
                if (!($inputs.attr('checked') == 'checked')) {
                    var index = $inputs.closest('li').index();
                    var itemData = {
                        label: self.options.items[index].label,
                        value: value,
                        checked: 1
                    };
                    $inputs.attr('checked', true);
                    $inputs.parent().addClass('checked');
                    self.trigger('change', e, itemData);
                }
            })
        },
        clear: function (e) {
            var $inputs = $('ul>li>div>input', this.$el);
            // var input = 'ul>li>div>input';
            // var $input = $(input) ; 
            var self = this;
            $inputs.each(function () {
                if ($(this).attr('checked') == 'checked') {
                    $(this).attr('checked', false);
                    $(this).parent().removeClass('checked');
                    var index = $(this).closest('li').index();
                    var data = self.options.items[index];
                    var itemData = {
                        label: data.label,
                        value: data.value,
                        checked: 0
                    };
                    self.trigger('change', e, itemData);
                }
            })
        },
        checkAll: function (e) {
            var self = this;
            var $inputs = $('ul>li>div>input', this.$el);
            // var input = 'ul>li>div>input';
            // var $input = $(input) ; 
            $inputs.each(function () {
                if (!($(this).attr('checked') == 'checked')) {
                    $(this).attr('checked', true);
                    $(this).parent().addClass('checked');
                    var index = $(this).closest('li').index();
                    var data = self.options.items[index];
                    var itemData = {
                        label: data.label,
                        value: data.value,
                        checked: 1
                    };
                    self.trigger('change', e, itemData);
                }
            })
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