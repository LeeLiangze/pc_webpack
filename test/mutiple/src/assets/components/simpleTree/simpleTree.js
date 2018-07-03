/**
 * Created by lizhao on 2016/1/21.
 */
define([
    'zTree',
    '../../lib/zTree_v3/css/zTreeStyle/zTreeStyle.css'
], function (zTree) {
    var settings = {};
    var tools = {
        isArray: function (arr) {
            return Object.prototype.toString.apply(arr) === "[object Array]";
        },
        isObject: function (arr) {
            return Object.prototype.toString.apply(arr) === "[object Object]";
        }
    };
    zTree = (zTree ? zTree : $.fn.zTree);
    // 处理async 设置
    var asyncTree = function (setting, url, option) {
        if (typeof url == 'string') {
            setting.async = {
                enable: true,
                url: url,
                type: 'post',
                autoParam: ["id=id", "level=level"],
                dataFilter: function (treeId, parentNode, childNodes) {
                    return childNodes.beans;
                }
            };
            if (option.async) {
                option.async.autoParam && (setting.async.autoParam = option.async.autoParam);
                option.async.otherParam && (setting.async.otherParam = option.async.otherParam);
                option.async.type && (setting.async.type = option.async.type);
                option.async.dataType && (setting.async.dataType = option.async.dataType);
            }
        }

        return setting
    };

    var objClass = function (obj, setting, zTreeNodes) {
        if (obj) {
            if (obj instanceof jQuery && obj.length > 0) {
                this.$obj = obj;
            } else if (isDOM(obj)) {
                this.$obj = $(obj);
            } else if (typeof(obj) == 'string' && $(obj).length > 0) {
                this.$obj = $(obj);
            }
        } else {
            this.$obj = $("<div></div>")
        }
        this.setting = setting;
        this.init(obj);
        settings = this.setting;
        //this.setting=settings=setting;
        tools.isArray(zTreeNodes) && (this.zTreeNodes = zTreeNodes);
        this.tree = zTree.init(this.$obj, this.setting, this.zTreeNodes && this.zTreeNodes);
        return this.tree
    };

    $.extend(objClass.prototype, {
            constructor: objClass,
            init: function (obj) {
                if (this.$obj.length) {
                    this.$obj.addClass("ztree");
                } else {
                    var setting = this.setting;
                    var id = "sn_" + (obj ? obj : "dialog"), title = (setting.dialog && setting.dialog.title) ? setting.dialog.title : '请设置标题';
                    var $el = (setting.dialog.input && $(setting.dialog.input.el));
                    var dialogSetting = $.extend({
                        id: id,
                        fixed: true,
                        title: title,
                        content: '<div class="ztree"></div>'
                    }, setting.dialog);
                    /* if(setting.dialog){
                     setting.dialog.okValue&&(dialogSetting.okValue= setting.dialog.okValue);
                     setting.dialog.cancelValue&&(dialogSetting.okValue= setting.dialog.cancelValue);
                     }    */
                    if (setting.callback) {
                        setting.callback.ok && (dialogSetting.ok = $.proxy(function () {
                            if ($el && $el.length) {
                                this.tree.getCheckedNodes()
                            }
                            setting.callback.ok.call(this.tree);
                            //$.proxy(setting.callback.ok(),this);
                        }, this));
                        //setting.callback.ok&&(dialogSetting.ok= $.proxy(setting.callback.ok,this.tree));
                        setting.callback.cancel && (dialogSetting.cancel = $.proxy(setting.callback.cancel, this.tree));
                    }
                    //console.log(dialogSetting);
                    this.dialog = dialog(dialogSetting);
                    setting.dialog.width && this.dialog.width(setting.dialog.width);
                    setting.dialog.height && this.dialog.width(setting.dialog.height);
                    if ($el && $el.length) {
                        // var template = hdb.compile(inputTpl);
                        // $el.addClass('sn-selectTree').html(template(setting.dialog.input));
                        $el.on("focus", "input", $.proxy(function (e) {
                            this.dialog.show();
                        }, this))
                    } else {
                        this.dialog.show();
                    }
                    this.$obj = $(".ztree", this.dialog.node)
                }
            },
            getZTreeObj: function (treeId) {
                zTree.getZTreeObj(treeId)
            },
            destroy: function (treeId) {
                zTree.destroy(treeId)
            },
            _z: zTree._z
        }
    );

    objClass.prototype._z.tools.clone = function (obj) {
        if (obj === null) return null;
        var o = tools.isArray(obj) ? [] : {};
        var is_data = (tools.isArray(obj) && obj.length);
        var is_filter = (settings.callback && settings.callback.beforeInit);
        for (var i in obj) {
            if (obj[i] instanceof Date) {
                o[i] = new Date(obj[i].getTime())
            } else {
                if (is_data && is_filter) {
                    var filterData = settings.callback.beforeInit(obj[i]);
                    obj[i] = filterData ? filterData : obj[i];
                }
                o[i] = (typeof obj[i] === "object" ? arguments.callee(obj[i]) : obj[i]);
            }
        }
        return o;
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
    return {
        zTree: function (obj, setting, zTreeNodes) {
            return new objClass(obj, setting, zTreeNodes)
        },
        checkTree: function (obj, zTreeNodes, option) {
            var setting = {
                check: {
                    enable: true
                }
            };
            if (typeof option == "function") {
                setting.callback = {onCheck: option};
            }
            if (tools.isObject(option)) {
                setting = $.extend(setting, option);
                (option.check) && ( setting.check.enable = true, setting.check.chkStyle = 'checkbox');
                //兼容之前的写法
                setting.callback || (setting.callback = {});
                option.onCheck && (setting.callback.onCheck = option.onCheck);
                option.beforeInit && (setting.callback.beforeInit = option.beforeInit);
            }
            setting = asyncTree(setting, zTreeNodes, option);
            return new objClass(obj, setting, zTreeNodes)
        },
        radioTree: function (obj, zTreeNodes, option) {
            var setting = {
                check: {
                    enable: true,
                    chkStyle: "radio"
                }
            };
            if (typeof option == "function") {
                setting.callback = {onCheck: option};
            }
            if (tools.isObject(option)) {
                setting = $.extend(setting, option);
                (option.check) && ( setting.check.enable = true, setting.check.chkStyle = 'radio');
                //兼容之前的写法
                setting.callback || (setting.callback = {});
                option.onCheck && (setting.callback.onCheck = option.onCheck);
                option.beforeInit && (setting.callback.beforeInit = option.beforeInit);
            }
            setting = asyncTree(setting, zTreeNodes, option);
            return new objClass(obj, setting, zTreeNodes)
        },
        tierTree: function (obj, zTreeNodes, option) {
            var setting = {
                check: {
                    enable: false
                }
            };
            if (typeof option == "function") {
                setting.callback = {onClick: option};
            }
            if (tools.isObject(option)) {
                setting = $.extend(setting, option);

                //兼容之前的写法
                setting.callback || (setting.callback = {});
                option.onClick && (setting.callback.onClick = option.onClick);
                option.beforeInit && (setting.callback.beforeInit = option.beforeInit);
            }
            setting = asyncTree(setting, zTreeNodes, option);
            return new objClass(obj, setting, zTreeNodes)
        }
    };
});
