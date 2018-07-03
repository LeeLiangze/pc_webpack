/*
 * 组件-tab
 */
define([
    'jquery',
    'hdb',
    'eventTarget',
    './tab.tpl',
    './tabItem.tpl',
    './tab.css'
], function ($, Hdb, EventTarget, tpl, itemTpl) {
    var VERSION = '${{version}}';
    var template = Hdb.compile(itemTpl);
    var itemSelectStr = '>.sn-tab-container>.sn-tab>.sn-tab-items>li';
    var objClass = function (options) {
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
        this.originTab = {};
        this.tabItem = {};
        EventTarget.call(this);
        render.call(this);
        eventInit.call(this);
        var tabData = this.options.tabs[0];
        if (tabData.render) {
            originTabInit.call(this, tabData);
        }
        setTimeout($.proxy(function (e) {
            var $li = $(itemSelectStr, this.$el).first();
            if ($li.length) {
                $li.trigger("click");
            }
        }, this), 200);
    };
    var render = function () {
        var $tpl = $(tpl);
        var tabDatas = this.options.tabs;
        for (var i = 0; i < tabDatas.length; i++) {
            var tabData = tabDatas[i];
            var num = Math.floor(100 + Math.random() * 899);
            var className = tabData.className ? tabData.className : 'sn-tab-item' + num;
            var title = tabDatas[i].title;
            this.options.tabs[i].className = className;
            this.tabItem[className] = title;
            $('.sn-tab>.sn-tab-items', $tpl).append(template(tabDatas[i]));
            $('.sn-tab>.sn-tab-items>li:last', $tpl).addClass(className);
        }
        this.$el.html($tpl);
        if (this.options.direction && this.options.direction === "vertical") {
            this.$el.addClass("sn-vertical")
        }
        if (this.options.className) {
            $('>.sn-tab-container>.J_tab_render>.sn-tab-container', this.$el).addClass(this.options.className);
        }
    };
    var eventInit = function () {
        this.$el.on('click', itemSelectStr, $.proxy(itemClick, this));
        this.$el.on('click', '.sn-tab-container>.sn-tab>.sn-tab-items>li>.sn-tabClose', $.proxy(tabClose, this));
    };
    var tabClose = function (e) {
        e.stopPropagation();
        var $li = $(e.target || e.currentTarget).closest("li");
        var index = $li.index();
        var tabData = this.options.tabs[index];
        var className = tabData.className;
        this.destroy(className, e);
    };
    var originTabInit = function (tabData) {
        var result = tabData.render(this.originTab);
        var index = $('.active', this.$el).index();
        var className = tabData.className;
        var $div = $('<div></div>');
        if (result instanceof jQuery) {
            $div.append(result);
            this.originTab[className] = {content: $div};
        } else if (typeof(result) !== 'object') {
            this.originTab[className] = {content: $('<div>' + result + '</div>')};
        } else if (typeof(result) == 'object') {
            result.content = $div.append(result.content);
            this.originTab[className] = result;
        }
        this.originTab[className].content.addClass(tabData.className);
        $('>.sn-tab-container>.J_tab_render>.contentArea', this.$el).append(this.originTab[className].content);
    };
    var itemClick = function (e) {
        var $src = $(e.target || e.currentTarget).closest(".J_item_click");
        var index = this.$el.find(itemSelectStr).index($src);
        var actIndex = $('.active', this.$el).index();
        var tabDatas = this.options.tabs;
        var tabData = tabDatas[index];
        var className = tabData.className;
        if (actIndex != -1) {
            var actTabData = tabDatas[actIndex];
            var actclassName = actTabData.className;
        }
        var $content = $('>.sn-tab-container>.J_tab_render>.contentArea', this.$el).find('.' + className);
        $(itemSelectStr, this.$el).removeClass('active');
        $src.addClass('active');
        if (actIndex != -1) {
            $('>.sn-tab-container>.J_tab_render>.contentArea', this.$el).find('.' + actclassName).css('display', 'none');
        }
        if ($content.length != 0) {
            $content.css('display', 'block')
        } else {
            if (tabData.render) {
                originTabInit.call(this, tabData);
            }
        }
        if (tabData && tabData.click) {
            tabData['originTab'] = this.originTab;
            tabData.click(e, tabData);
        }
    };
    var itemDestroy = function (e, data) {
    };
    $.extend(objClass.prototype, EventTarget.prototype, {
        version: VERSION,
        //切换选项卡
        switchTab: function (title) {
            var _self = this;
            if ($(itemSelectStr, this.$el).length > 1) {
                $.each(this.tabItem, function (key, val) {
                    var $li = null;
                    if (key == title) {
                        $li = $('.' + title, _self.$el);
                        $li.click();
                        return false;
                    } else if (val == title) {
                        $li = $('li:contains(' + title + ')', _self.$el);
                        $li.click();
                        return false;
                    }

                })
            }
        },
        //销毁选项卡
        destroy: function (title, e) {
            var _self = this;
            if ($(itemSelectStr, _self.$el).length > 1) {
                var $li = null;
                $.each(this.tabItem, function (key, val) {
                    if (key == title) {
                        $li = $('.sn-tab-container>.sn-tab>.sn-tab-items>.' + title, _self.$el);
                        return false;
                    } else if (val == title) {
                        $li = $('li:contains(' + title + ')', _self.$el);
                        return false;
                    }
                });
                if ($li) {
                    var index = $li.index();
                    if (index != -1) {
                        var data = _self.options.tabs[index];
                        var className = data.className;
                        $li.remove();
                        _self.options.tabs.splice(index, 1);
                        delete this.tabItem[className];
                        $('>.sn-tab-container>.J_tab_render>.contentArea', _self.$el).find('.' + className).remove();
                        itemDestroy.call(_self, e);
                        _self.trigger('itemDestroy', e, data);
                        if ($('.active', _self.$el).length == 0) {
                            var $newLi = $('.sn-tab-container>.sn-tab>.sn-tab-items>.J_item_click:eq(' + index + ')', _self.$el);
                            if ($newLi.length == 0) {
                                $('.sn-tab-container>.sn-tab>.sn-tab-items>.J_item_click:eq(' + (index - 1) + ')', _self.$el).trigger("click");
                            } else {
                                $newLi.trigger("click");
                            }
                        }
                    }
                }
            }
        },
        //创建选项卡
        createTab: function (title, render, param) {
            if (arguments.length == 0) {
                return;
            }
            var options = null;
            if (typeof(title) == 'object') {
                options = title;
            } else {
                options = {title: title, render: render, param: param}
            }
            var tabs = this.options.tabs;
            for (var i = 0; i < tabs.length; i++) {
                if (tabs[i].title == options.title) {
                    return;
                }
            }
            var num = Math.floor(100 + Math.random() * 899);
            var className = options.className ? options.className : (options.param && options.param.className) ? options.param.className : 'sn-tab-item' + num;
            options.className = className;
            var icon = options.icon ? options.icon : (options.param && options.param.icon) ? options.param.icon : '';
            this.options.tabs = this.options.tabs.concat(options);
            this.tabItem[className] = options.title;
            var length = this.options.tabs.length;
            $('.sn-tab-container>.sn-tab>.sn-tab-items', this.$el).append(template(this.options.tabs[length - 1]));
            var $liLast = $('.sn-tab-container>.sn-tab>.sn-tab-items>li:last', this.$el);
            $liLast.addClass(className);
            $liLast.trigger("click");
        },
        //设置选项卡内容 
        content: function (html) {
            var index = $(".sn-tab-container>.sn-tab>.sn-tab-items", this.$el).find('.active').index();
            var $contentArea = $('>.sn-tab-container>.J_tab_render>.contentArea', this.$el);
            var className = (this.options.tabs)[index].className;
            if (this.lastDom) {
                this.lastDom.detach();
            }
            if ($contentArea.find('.' + className).length != 0) {
                if (typeof(html) == 'object') {
                    this.lastDom = html;
                    $contentArea.find('.' + className).empty().append(html);
                } else {
                    $contentArea.find('.' + className).html(html);
                }
            } else {
                if (typeof(html) == 'object') {
                    this.lastDom = html;
                    var $div = $('<div class="' + className + '"></div>');
                    $div.append(html);
                    $contentArea.append($div);
                } else {
                    $html = $('<div class="' + className + '">' + html + '</div>');
                    $contentArea.append($html);
                }
            }
        },
        render: function () {
            return this;
        }
    });
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