/* 
 * 组件-detailPanel
 */
define([
    'jquery',
    'eventTarget',
    'hdb',
    './detailPanel.tpl',
    './detailPanel.css'
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
        render.call(this);
        eventInit.call(this);
    };

    $.extend(objClass.prototype, eventTarget.prototype, {
        version: VERSION
    });

    var render = function () {
        var data = this.options.data,
            length = this.options.items.length,
            column = (this.options.column && this.options.column >= 1) ? this.options.column : 1;
        for (var i = 0, keys = [], key; i < length; i++) {
            key = this.options.items[i].key;
            keys.push(key);
            if (typeof(data[key]) == 'object') {
                itemsRender.call(this, i, data[key]);
            } else {
                this.options.items[i].key = data[key];
            }
        }

        template = hdb.compile(tpl);
        this.$el.html(template(this.options));

        for (var i = 0; i < length; i++) {
            this.options.items[i].key = keys[i];
            itemObj = this.options.items[i],
                reg = /^click+[\s]/ig,
                _self = this;
            if (itemObj.click) {
                $('.sn-detailPanel li:eq(' + i + ')', this.$el).find('.value').addClass('canClick');
            }
            for (var n in itemObj) {
                if (n.match(reg)) {
                    var selector = n.split(' ')[1];
                    $(selector, _self.$el).attr({'data-id': n});
                    _self.$el.find(selector).off('click').on('click', function () {
                        var selectorEvent = $(this).data('id');
                        var index = $(this).closest('li').index();
                        var itemObj = (_self.options.items)[index];
                        itemObj[selectorEvent](itemObj);
                    })
                }
            }
        }
        var width = 100 / column;
        $('.sn-detailPanel li', this.$el).width(width + '%');
        setTimeout($.proxy(function () {
            this.trigger('loadSuccess', data);
        }, this), 200)

    };
    var eventInit = function () {
        this.$el.on('click', '.sn-detailPanel li>.value', $.proxy(function (e, itemData) {
            itemsClick.call(this, e, itemData);
            this.trigger('itemsClick', e, itemData);
        }, this));
        this.$el.on('mouseover', '.sn-detailPanel li>.value', $.proxy(function (e) {
            itemsMouseover.call(this, e);
            this.trigger('itemsMouseover', e);
        }, this));

    };
    var itemsClick = function (e) {
        var target = e.currentTarget || e.target,
            items = this.options.items;
        var index = $(target).closest('li').index();
        var itemData = items[index];
        if (items[index].click) {
            items[index].click(e, itemData);
        }
    };
    var itemsMouseover = function (e) {
        var target = e.currentTarget || e.target,
            data = this.options.data,
            items = this.options.items;
        var index = $(target).closest('li').index();
        var itemData = data[items[index].key];
        if (items[index].mouseover) {
            items[index].mouseover(e, itemData);
        }
    };

    var itemsRender = function (index, data) {
        var items = this.options.items;
        if (items[index].render) {
            this.options.items[index].key = items[index].render(data);
        }
    };
    // 注册loadSuccess事件
    var loadSuccess = function (data) {
    };
    // 扩展方法
    $.extend(objClass.prototype, {
        reload: function (data) {
            this.options.data = data;
            render.call(this);
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