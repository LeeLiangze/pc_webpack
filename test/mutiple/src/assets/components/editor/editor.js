/**
 * Created by lizhao on 2016/2/29.
 */

define([
    'jquery',
    'eventTarget',
    'ueditor'
], function ($, EventTarget) {
    var VERSION = '${{version}}';
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
            this.$el = $("<div></div>")
        }
        this.options = options;
        initialize.call(this);
        this.content = this.$el;
    };
    var initialize = function () {
        var editorID = 'sn-editor-' + Math.random();
        this.$el.attr('id', editorID);
        if (this.options.mode == 'mini') {
            this.options.toolbars = [['undo', 'redo', '|', 'bold', 'italic', 'underline', 'removeformat', 'formatmatch', '|', 'forecolor', 'backcolor', '|', 'rowspacingtop', 'rowspacingbottom', 'lineheight', '|', 'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|', 'indent', '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify']]
        } else if (this.options.mode == 'middle') {
            this.options.toolbars = [['source', '|', 'undo', 'redo', '|', 'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'removeformat', 'formatmatch', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|', 'rowspacingtop', 'rowspacingbottom', 'lineheight', '|', 'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|', 'indent', '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|', 'link', 'unlink', '|', 'simpleupload', 'attachment', 'background', '|', 'spechars', 'snapscreen', '|', 'inserttable', 'deletetable']]
        }
        if (this.options.addTools) {
            if (this.options.toolbars) {
                this.options.toolbars[0] = this.options.toolbars[0].concat(this.options.addTools)
            }
        }
        var opt = $.extend({
            initialFrameHeight: 400, //初始化编辑器高度,默认320
            autoHeightEnabled: false // 是否自动长高,默认true
        }, this.options);
        this.ue = UE.getEditor(editorID, opt);
        this.ue.ready($.proxy(function () {
            //设置编辑器的内容
            this.ue.setContent('hello');
            //获取html内容，返回: <p>hello</p>
            var html = this.ue.setContent(this.options.content);
            //获取纯文本内容，返回: hello
            // var txt = ue.getContentTxt();
        }, this));
        this.origin = this.ue;
    };
    $.extend(objClass.prototype, EventTarget.prototype, {
        version: VERSION,
        setContent: function (html) {
            return this.ue.setContent(html)
        },
        getContent: function () {
            return this.ue.getContent();
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