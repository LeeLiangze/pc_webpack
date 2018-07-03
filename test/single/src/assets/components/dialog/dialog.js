define(['eventTarget', 'artDialog',
        '../../lib/dialog/css/ui-dialog.css'],
    function (EventTarget) {
        var version = '${{version}}',
            dl = null;
        var objClass = function (options) {
            this.options = options;
            //mode默认为normal
            this.options.mode = this.options.mode ? this.options.mode : 'normal';
            EventTarget.call(this);
            dl = dialogInit.call(this);
            $('button[i-id="ok"]', dl.node).on('click', $.proxy(function () {
                confirm.call(this);
                this.trigger('confirm')
            }, this));
            //点击确定按钮时触发
        };
        var dialogInit = function () {
            var d = null, mode = this.options.mode, config = {
                //对话框打开时触发
                onshow: $.proxy(function () {
                    onshow.call(this);
                    this.trigger('onshow');
                }, this),
                //对话框销毁之前触发
                onbeforeremove: $.proxy(function () {
                    onbeforeremove.call(this);
                    this.trigger('onbeforeremove');
                }, this),
                //对话框销毁时触发
                onremove: $.proxy(function () {
                    onremove.call(this);
                    this.trigger('onremove');
                }, this),
                //对话框关闭时触发
                onclose: $.proxy(function () {
                    onclose.call(this);
                    this.trigger('onclose');
                }, this),
                //对话框获得焦点时触发
                onfocus: $.proxy(function () {
                    onfocus.call(this);
                    this.trigger('onfocus');
                }, this),
                //对话框失去焦点时触发
                onblur: $.proxy(function () {
                    onblur.call(this);
                    this.trigger('onblur');
                }, this),
                //对话框位置重置时触发
                onreset: $.proxy(function () {
                    onreset.call(this);
                    this.trigger('onreset');
                }, this)
            };

            if (mode == 'normal') {
                d = dialog($.extend({
                    content: '<span class="ui-dialog-loading">Loading..</span>',
                    okValue: '确定',
                    ok: function () {
                    },
                    cancelValue: '取消',
                    cancel: function () {
                    },
                    width: 600,
                    height: 400
                }, config, this.options));
            } else if (mode == 'tips') {
                d = dialog($.extend({
                    content: '<span class="ui-dialog-loading">Loading..</span>',
                    padding: 15,
                    width: 240,
                    height: 80
                }, config, this.options));
            } else if (mode == 'confirm') {
                var d = dialog($.extend({
                    content: '<span class="ui-dialog-loading">Loading..</span>',
                    width: 300,
                    height: 180,
                    modal: true,
                    okValue: '确认',
                    ok: function () {
                    },
                    cancelValue: '取消',
                    cancel: function () {
                        return;
                    }
                }, config, this.options));
            }
            d.show();
            if (mode == 'tips') {//tips,默认3s关闭
                setTimeout(function () {
                    d.close().remove();
                }, (this.options.delayRmove) * 1000 || 3000);
            } else if (this.options.delayRmove) {//非tips时，有延迟时间才自动关闭
                setTimeout(function () {
                    d.close().remove();
                }, this.options.delayRmove * 1000);
            }
            return d;
        };
        $.extend(objClass.prototype, EventTarget.prototype, {
            version: version,
            origin: function () {
                return {
                    open: dl ? dl['open'] : false,   //判断对话框打开状态
                    returnValue: dl ? dl['returnValue'] : '' //对话框的返回值
                }
            },
            get: function (id) {
                return dialog.get(id);
            },
            getCurrent: function () {
                return dialog.getCurrent();
            },
            show: function (anchor) {
                dl.show(anchor);
            },
            showModal: function (anchor) {
                dl.showModal(anchor);
            },
            close: function (result) {
                dl.close(result);
            },
            remove: function () {
                dl.remove();
            },
            content: function (html) {
                dl.content(html);
            },
            title: function (text) {
                dl.title(text);
            },
            width: function (value) {
                dl.width(value);
            },
            height: function (value) {
                dl.height(value);
            },
            focus: function () {
                dl.focus();
            },
            blur: function () {
                dl.blur();
            },
            addEventListener: function (type, callback) {
                dl.addEventListener(type, callback);
            }
        });
        //注册事件
        //onshow 对话框打开时触发
        var onshow = function () {
        };
        // confirm 点击确定按钮时触发
        var confirm = function () {
        };
        // onbeforeremove 对话框销毁之前触发
        var onbeforeremove = function () {
        };
        // onremove 对话框销毁事件
        var onremove = function () {
        };
        // onclose 对话框关闭时触发
        var onclose = function () {
        };
        // onfocus 对话框获取焦点时触发
        var onfocus = function () {
        };
        // onblur 对话框失去焦点时触发
        var onblur = function () {
        };
        // onreset 对话框位置重置时触发
        var onreset = function () {
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