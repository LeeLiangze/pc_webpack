define(['hdb',
        'eventTarget',
        './selectList.tpl',
        'artDialog',
        '../../lib/dialog/6.0.4/css/ui-dialog.css'],
    function (hdb, EventTarget, tpl, artDialog) {
        var VERSION = '${{version}}';
        var objClass = function (options) {
            this.options = options;
            // this.$el = this.options.el;
            //判断el的异常值：el不存在、为空string、dom原生对象
            if (options.el instanceof jQuery && options.el.length > 0) {
                this.$el = options.el;
            } else if (options.el && isDOM(options.el)) {
                this.$el = $(options.el);
            } else if (typeof(options.el) == 'string' && $(options.el).length > 0) {
                this.$el = $(options.el);
            } else {
                this.$el = $("<div></div>")
            }
            this.$el.addClass('sn-selectList');
            var template = hdb.compile(tpl);
            this.$el.html(template(options));
            $('.texts', this.$el).on('click', $.proxy(panelInit, this));
            $.extend(objClass.prototype, EventTarget.prototype);
            EventTarget.call(this);
        };

        $.extend(objClass.prototype, EventTarget.prototype, {
            version: VERSION,
            setText: function (str) {
                $('.texts', this.$el).val(str);
            },
            setValue: function (str) {
                $('.values', this.$el).val(str);
            },
            setPanelContent: function (content) {
                var node = this.dialog.node;
                if (typeof(content) == 'object') {
                    $('.ui-dialog-content', node).append(content);
                } else {
                    $('.ui-dialog-content', node).html(content);
                }
            },
            disable: function () {
                $('.texts', this.$el).prop('disabled', true);
                $('.values', this.$el).prop('disabled', true);
            },
            enable: function () {
                $('.texts', this.$el).prop('disabled', false);
                $('.values', this.$el).prop('disabled', false);
            }
        });
        var dialogInit = function () {
            // var options = _.pick(this.options, ['width','height','title','modal','button']);
            var options = this.options;
            var params = $.extend({
                skin: 'zx-popup-tree',
                fixed: true,
                padding: 3,
                modal: true,
                content: '<div class="ztree"></div>',
                button: [
                    {
                        value: '确定',
                        callback: $.proxy(confirm, this),
                        autofocus: true
                    },
                    {
                        value: '清空',
                        callback: $.proxy(clear, this)
                    },
                    {
                        value: '取消',
                        callback: function () {
                        }
                    }
                ],
                onclose: $.proxy(function () {
                    this.$el.trigger('panelClose');
                    this.dialog = null;
                }, this),
                width: '630',  //对话框宽度
                height: '380'  //对话框高度
            }, options);
            this.dialog = new dialog(params);
            this.dialog.show();

            var node = this.dialog.node;
            var content = this.options.content;
            if (typeof(content) == 'object') {
                $('.ui-dialog-content', node).append(content);
            } else {
                $('.ui-dialog-content', node).html(content);
            }
        };
        var panelInit = function (e) {
            if (!this.dialog) {
                dialogInit.call(this);
                this.trigger('panelInit', e);
            }
        };
        var confirm = function () {
            this.trigger('confirm');
        };

        var clear = function () {
            $('.texts', this.$el).val('');
            $('.values', this.$el).val('');
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
        return objClass;
    });