/**
 * Created by lizhao on 2016/3/23.
 */
define([
    'jquery',
    'eventTarget',
    'hdb',
    './date.tpl',
    'laydate',
    '../../lib/laydate/need/laydate.css',
    '../../lib/laydate/skins/default/laydate.css'
], function ($, eventTarget, hdb, tpl) {
    //VERSION这样定义
    var VERSION = '${{version}}';
    var objClass = function (config) {
        if (!config) {
            console.log('please config params for date');
            return false
        } else if (config && !config.double) {
            dateStyle(config);
        } else {
            if (config.double.start && config.double.start.format && config.double.start.defaultValue) {
                dateStyle(config.double.start);
            }
            if (config.double.end && config.double.end.format && config.double.end.defaultValue) {
                dateStyle(config.double.end);
            }
        }

        // 对this.$el赋值前对options.el类型判断，jquery对象，DOM对象，字符串
        if (config.el) {
            if (config.el instanceof jQuery && config.el.length > 0) {
                this.$el = config.el;
            } else if (isDOM(config.el)) {
                this.$el = $(config.el);
            } else if (typeof(config.el) == 'string' && $(config.el).length > 0) {
                this.$el = $(config.el);
            }
        } else {
            this.$el = $("<div></div>")
        }
        this.options = config;
        eventTarget.call(this);
        render.call(this);
        //自定义事件    
        this.$el.on('focus', 'input', $.proxy(function (e) {
            focusInput.call(this, e);
            this.trigger('focusInput', e);
        }, this));
    };

    $.extend(objClass.prototype, eventTarget.prototype, {
        version: VERSION
    });

    var render = function () {
        template = hdb.compile(tpl);
        this.$el.addClass("timegroup").html(template(this.options));
    };
    //判断format和defaultValue的格式是否一致
    var dateStyle = function (data) {
        if (data.format && data.defaultValue) {
            var format = data.format.replace(/\w/g, ''), defaultValue = data.defaultValue.replace(/\w/g, '');
            if (format !== defaultValue) {
                data.defaultValue = '';
                console.log('defaultValue格式不正确');
                return false
            }
        }
    };
    var focusInput = function (event) {
        var config = {}, _this = this;
        if (!this.options.double) {
            $.extend(config, this.options);
            config.choose = $.proxy(function (datas) {
                _this.$el.find("input").trigger("change");
                this.choose && this.choose.call(this, datas)
            }, this.options);
        } else {
            var name = $(event.target || event.currentTarget).attr("name");
            if (this.options.double.start && this.options.double.start.name == name) {
                $.extend(config, this.options.double.start);
                config.choose = $.proxy(function (datas) {
                    _this.$el.find("input[name='" + _this.options.double.start.name + "']").trigger("change");
                    this.start.choose && this.start.choose.call(this, datas)
                }, this.options.double);
            } else if (this.options.double.end && this.options.double.end.name == name) {
                $.extend(config, this.options.double.end);
                config.choose = $.proxy(function (datas) {
                    _this.$el.find("input[name='" + _this.options.double.end.name + "']").trigger("change");
                    this.end.choose && this.end.choose.call(this, datas)
                }, this.options.double);
            }
        }
        //规避lay的elem和event配置
        config.elem && delete(config.elem);
        config.event && delete(config.event);
        laydate(config);
    };
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

