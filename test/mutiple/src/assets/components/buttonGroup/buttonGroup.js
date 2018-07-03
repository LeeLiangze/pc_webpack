/**
 * 组件-buttonGroup
 */
define([
    'jquery',
    'eventTarget',
    './buttonGroup.tpl',
    './buttonGroup.css'
], function ($, eventTarget, tpl) {
    var VERSION = '${{version}}';
    var objClass = function (config) {
        //判断el的异常值：el不存在、为空string、dom原生对象
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
        //按钮的纵向横向设置
        var $buttons = $(".sn-buttonGroup-list", this.$el).find("button");
        var $lis = $(".sn-buttonGroup-list", this.$el).find("li");
        $buttons.last().css("marginRight", "0");
        if (this.options.direction && this.options.direction == "vertical") {
            $lis.removeClass("t-btnGroup-h").addClass("t-btnGroup-v");
        } else if (this.options.direction == "horizontal" || !this.options.direction) {
            $lis.addClass("t-btnGroup-h");
        } else {
            $lis.addClass("t-btnGroup-h");
        }
        //按钮的禁用启用状态
        if (this.options.items.length) {
            $.each(this.options.items, function (i, item) {
                if (!item.type || item.type == "0") {
                    $buttons.eq(i).addClass("t-btnGroup");
                } else if (item.type == "1") {
                    $buttons.eq(i).addClass("t-btnGroup-blue");
                } else if (item.type == "2") {
                    $buttons.eq(i).addClass("t-btnGroup-green");
                } else {
                    $buttons.eq(i).addClass("t-btnGroup");
                }
                if (item.disabled == "0") {
                    var itemBgColor = $buttons.eq(i).css("background"),
                        itemBdColor = $buttons.eq(i).css("borderColor"),
                        itemFontColor = $buttons.eq(i).css("color");
                    $buttons.eq(i).attr("disabled", true).addClass("t-btnGroup-disabled").css({
                        "background": itemBgColor,
                        "borderColor": itemBdColor,
                        "color": itemFontColor
                    });
                } else if (item.disabled == "1" || !item.disabled) {
                    $buttons.eq(i).attr("disabled", false).removeClass("t-btnGroup-disabled");
                } else {
                    $buttons.eq(i).attr("disabled", false).removeClass("t-btnGroup-disabled");
                }
            });
        } else {
            console.log("请配置按钮项！")
        }

        //自定义事件    
        this.$el.on('click', 'button', $.proxy(function (e) {
            btnClick.call(this, e);
            this.trigger('btnClick', e);
        }, this));
    };

    $.extend(objClass.prototype, eventTarget.prototype, {
        version: VERSION
    });//扩展方法

    //渲染按钮
    var render = function () {
        var $tpl = $(tpl);
        var _htm = '';
        for (var i = 0; i < this.options.items.length; i++) {
            _htm += '<li class="' + this.options.items[i].className + '">'
                + '  <button type="' + this.options.items[i].type + '" class="t-btnGroup">' + this.options.items[i].text + '</button>'
                + '</li>';
        }
        $tpl.addClass(this.options.className).find('.sn-buttonGroup-list').html(_htm);
        this.$el.html($tpl);
    };
    var btnClick = function (e) {
        var target = e.target || e.currentTarget,
            item = this.options.items,
            index = $('.sn-buttonGroup-list li button', this.$el).index(target);
        if (item[index].click) {
            item[index].click(e);
        } else {
            console.log("请在items中配置点击事件。");
        }
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

