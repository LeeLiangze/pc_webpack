/**
 * 组件-timer
 */
define(['eventTarget', 'hdbHelper',
    './satisfyStar.tpl',
    './satisfyStar.css'
], function (EventTarget, hdb, tpl) {
    var VERSION = '${{version}}';
    var objClass = function (config) {
        this.options = config;
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
        config.className = (config.className ? config.className : "satisfyStars");
        // 判断是否有amounts
        config.amounts = (config.amounts ? config.amounts : 5);
        // 判断是否有enableTouch
        config.enableTouch = (config.enableTouch == 0 ? 0 : config.enableTouch || 1);
        // 判断是否有answerMouseOver
        config.answerMouseOver = (config.answerMouseOver == 0 ? 0 : config.answerMouseOver || 1);
        // 判断是否有value
        config.value = (config.value == 0 ? 0 : config.value || 3);

        EventTarget.call(this);
        render.call(this);
        this.setStarNumber(config.value);
        this.getStarNumber();
        // 自定义事件
        this.$el.on('click', 'li', $.proxy(function (e) {
            select.call(this, e);
            this.trigger('select', e);
        }, this));
        this.$el.on('mouseover', 'li', $.proxy(function (e) {
            change.call(this, e);
            this.trigger('change', e);
        }, this));
    };
    // 扩展方法
    $.extend(objClass.prototype, EventTarget.prototype, {
        version: VERSION,
        setStarNumber: function (starNumber) {
            this.$el.find('ul li').removeClass("select");
            this.options.value = starNumber;
            for (var i = 0; i <= starNumber; i++) {
                this.$el.find('ul li:nth-child(' + i + ')').addClass("select");
            }
        },
        getStarNumber: function () {
            var me = this;
            var starIndex = {starNum: this.options.value};
            if (this.options.enableTouch) {
                me.$el.on("click", "li", function () {
                    starIndex.starNum = me.$el.find('ul li').index(this) + 1;
                    me.setStarNumber(starIndex.starNum);
                });
            }
            return starIndex.starNum;
        }
    });
    // 注册change事件
    var change = function () {
        var me = this;
        if (this.options.answerMouseOver) {
            this.$el.on("mouseover", "li", function () {
                // me.$el.find('ul li').removeClass("select");
                var starIndex = me.$el.find('ul li').index(this) + 1;
                for (var i = 0; i <= starIndex; i++) {
                    me.$el.find('ul li:nth-child(' + i + ')').addClass("change");
                }
            });
        }
        $(this.options.el).on("mouseout", "li", function () {
            me.$el.find('ul li').removeClass("change")
        })
    };
    // 注册select事件
    var select = function () {
        this.getStarNumber();
    };
    // 判断是否为原生DOM
    var isDOM = function (obj) {
        return obj.tagName ? true : false
    };
    // 渲染页面
    var render = function () {
        template = hdb.compile(tpl);
        this.$el.html(template(this.options));
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
