/*
 * 组件-selectTree
 */
define([
        'eventTarget',
        'hdb',
        './selectTree.tpl',
        './selectTreePanel.tpl',
        './selectTree.css',
        '../../lib/zTree_v3/css/zTreeStyle/zTreeStyle.css',
        'zTree'
    ],
    function (EventTarget, hdb, tpl, panelTpl) {
        var VERSION = '${{version}}';
        var confirm = function () {
            var nodes = [];
            if (this.zTree.setting && this.zTree.setting.check &&
                this.zTree.setting.check.enable) {
                if (this.options.childNodeOnly) {
                    var checkNodes = this.zTree.getCheckedNodes();
                    $.each(checkNodes, function (key, val) {
                        val.isParent || nodes.push(val);
                    })
                } else {
                    nodes = this.zTree.getCheckedNodes();
                }
            } else {
                nodes = this.zTree.getSelectedNodes();
                if (this.options.childNodeOnly == false) {
                    var parentNode = nodes[0].getParentNode();
                    while (parentNode) {
                        nodes.push(parentNode);
                        parentNode = parentNode.getParentNode();
                    }
                }

            }
            if (this._listeners && this._listeners['confirm'] && (this._listeners['confirm'][0](nodes) == false)) return false;
            this.json = this.zTree.getNodes();
            var textField = this.options.textField;
            var valueField = this.options.valueField;
            var nameArr = [], valueArr = [];
            for (var i = 0; i < nodes.length; i++) {
                nameArr.push(textField && nodes[i][textField] || nodes[i].name || nodes[i].value || nodes[i].id);
                valueArr.push(valueField && nodes[i][valueField] || nodes[i].value || nodes[i].id)
            }
            var nameStr = nameArr.join(',');
            var valueStr = valueArr.join(',');
            $('.texts', this.$el).val(nameStr);
            $('.values', this.$el).val(valueStr).trigger("change");
            $('.formlayer', this.$el).remove();
        };
        var clear = function () {
            var nodes = this.zTree.getCheckedNodes();
            this.zTree.checkAllNodes(false);
            if (this._listeners && this._listeners['clear'] && (this._listeners['clear'][0](nodes) == false)) return false;
            this.json = this.zTree.getNodes();
            $('.texts', this.$el).val('');
            $('.values', this.$el).val('');
            $('.formlayer', this.$el).remove();
        };
        /*
         *add by zhanglizhao 2016-03-02
         * 数据循环
         */
        var dateFilter = function (data, callback) {
            for (var index in data) {
                callback && callback(data[index]);
                if (data[index].children && data[index].children.length) {
                    dateFilter(data[index].children, callback)
                }
            }
        };

        var treeInit = function (callback) {
            var defaultValue = this.$valueBox.val();
            var defaultCheckedArr = (defaultValue && defaultValue.split(",")) || [];
            var options = this.options;
            var asyncTreeInit = function () {
                var options = this.options;
                var asyncConfig = {
                    enable: true,
                    autoParam: ["id=id", "name=name", "value=value"]
                };
                var setting = {
                    check: {
                        enable: (options && options.check) || false
                    },
                    async: $.extend(asyncConfig, options.async),
                    callback: {
                        onAsyncSuccess: $.proxy(function (event, treeId, treeNode, msg) {
                            treeCheckStatusInit.call(this);
                        }, this)
                    }
                };
                setting.async.url = options.url;
                setting.async.dataFilter = function (treeId, parentNode, childNodes) {
                    return childNodes.beans;
                };
                this.zTree = $.fn.zTree.init($zTreeWrap, setting);
            };

            var normalTreeInit = function ($zTreeWrap, is_first) {
                var isCheck = (options && options.check) || false;

                if (is_first && isCheck && options.value) {
                    dateFilter(this.json, function (bean) {
                        for (var i = 0; i < defaultCheckedArr.length; i++) {
                            if (defaultCheckedArr[i] == bean[options.valueField]) {
                                bean.checked = true;
                            }
                        }
                    });
                }
                this.zTree = $.fn.zTree.init($zTreeWrap, {
                    check: {
                        enable: isCheck
                    }
                }, this.json);
                if (options.expandAll) {
                    this.zTree.expandAll(true);
                }
            };
            var treeCheckStatusInit = function () {
                if (options.expandAll) {
                    this.zTree.expandAll(true);
                }
                var nodes = this.zTree.getNodesByFilter(function (node) {
                    return !node.isParent && $.inArray(node.value, defaultCheckedArr) >= 0;
                });
                for (var i = 0; i < nodes.length; i++) {
                    this.zTree.checkNode(nodes[i], true, !this.options.childNodeOnly);
                }
            };
            if (options && options.url) {
                var $zTreeWrap = $('.ztree', this.$el);
                if (options.async) {
                    asyncTreeInit.call(this);
                } else {
                    if (this.json) {
                        normalTreeInit.call(this, $zTreeWrap);
                    } else {
                        var ajaxOptions = $.extend({
                            url: options.url,
                            dataType: 'json',
                            success: $.proxy(function (json, status) {
                                if (status && json.returnCode == '0') {
                                    this.json = json.beans;
                                    normalTreeInit.call(this, $zTreeWrap, true);
                                } else {
                                    console.log('the component of select tree init bad. search error')
                                }
                            }, this)
                        }, options.ajax);
                        $.ajax(ajaxOptions);
                    }
                }

            } else {
                console.log('the component of select tree init bad. please set url for data.');
            }
        };
        var panelInit = function (e) {
            e.stopPropagation();    //防止冒泡触发spaceClose
            var $textBox = $(e.currentTarget);
            this.$valueBox = $textBox.siblings('.values');
            var $formlayer = $('.sn-selectTree .formlayer');
            if ($formlayer.length) {
                var $con = $formlayer.closest('.sn-selectTree');
                if (!$con.is(this.$el)) {
                    $formlayer.remove();
                }
            }
            if ($('.formlayer', this.$el).length == 0) {
                $('.has-formlayer', this.$el).append('<div class="formlayer formlayer-has-btns">');
                var template = hdb.compile(panelTpl);
                $('.formlayer', this.$el).html(template(this.options));
                if (this.options.checkAllNodes) {
                    $('.formlayer-btns', this.$el).addClass('formlayer-btns-check');
                }
                treeInit.call(this);
            }
            $('input[type=checkbox]', this.$el).on('click', $.proxy(function (e) {
                var checkedAll = $(e.currentTarget).is(':checked');
                this.zTree.checkAllNodes(checkedAll);
            }, this));
        };
        var spaceClose = function (e, $formlayer) {
            var $target = $(e.target || e.currentTarget);
            var $el = $formlayer.closest('.sn-selectTree');
            if ($target.closest($el).length == 0) {
                $formlayer.remove();
            }
        };
        var objClass = function (config) {
            initialize.call(this, config);
        };
        var initialize = function (options) {
            // 对this.$el赋值前对options.el类型判断，jquery对象，DOM对象，字符串
            if (options.el && options.el instanceof jQuery) {
                this.$el = options.el;
            } else if (options.el && (options.el.nodeType == 1 || typeof (options.el) == 'string')) {
                this.$el = $(options.el);
            } else {
                this.$el = $('<div></div>');
            }
            this.options = options;
            EventTarget.call(this);
            this.$el.addClass('sn-selectTree');

            var template = hdb.compile(tpl);
            var $tpl = $('<div></div>').html(template(this.options));
            $tpl.children('label').html(this.options.label);
            $tpl.find('.has-formlayer > .texts').attr({
                name: 'sn-' + this.options.name + '-text',
                value: this.options.text
            });
            $tpl.find('.has-formlayer > .values').attr({
                name: this.options.name,
                value: this.options.value
            });
            this.$el.html($tpl.html());
            //自定义事件
            eventInit.call(this);
        };
        var eventInit = function () {
            this.$el.on('click', '.texts', $.proxy(function (e) {
                panelInit.call(this, e);
                this.trigger('panelInit', e);
            }, this));
            $(document).on('click', function (e) {
                var $formlayer = $('.sn-selectTree .formlayer');
                if ($formlayer.length != 0) {
                    spaceClose(e, $formlayer);
                }
            });
            this.$el.on('click', '.confirm', $.proxy(confirm, this));
            this.$el.on('click', '.empty', $.proxy(clear, this));
            if (!this.options.check) {
                var id = $('.ztree', panelTpl).attr('id');
                this.$el.on('click', '.ztree a[id^="' + id + '_"]', $.proxy(confirm, this));
            }
        };
        $.extend(objClass.prototype, EventTarget.prototype, {
            version: VERSION,
            reload: function (beans) {
                if (typeof(beans) == 'string' && this.options.async) {
                    this.options.url = beans;
                } else if (typeof(beans) == 'object' && !this.options.async) {
                    this.json = beans;
                }
            },
            set: function (text, value) {
                var valueField = this.options.valueField,
                    textField = this.options.textField;
                if (arguments.length == 2) {
                    if (this.json) {
                        this.zTree.checkAllNodes(false);
                        this.json = this.zTree.getNodes();
                        dateFilter(this.json, function (bean) {
                            if (value == bean[valueField]) {
                                bean.checked = true;
                            }
                        });
                    }
                    $('.texts', this.$el).attr('value', text);
                    $('.values', this.$el).attr('value', value);
                } else if (arguments.length == 1 && typeof(text) == 'object') {
                    var texts = [], values = [];
                    for (var i = 0; i < text.length; i++) {
                        texts.push(text[i][textField]);
                        values.push(text[i][valueField]);
                    }
                    if (this.options.check || (!this.options.check && values.length == 1)) {
                        if (this.json) {
                            this.zTree.checkAllNodes(false);
                            this.json = this.zTree.getNodes();
                            dateFilter(this.json, function (bean) {
                                for (var i = 0; i < values.length; i++) {
                                    if (values[i] == bean[valueField]) {
                                        bean.checked = true;
                                    }
                                }
                            });
                        }
                        var textStr = texts.join(',');
                        var valueStr = values.join(',');
                        $('.texts', this.$el).attr('value', textStr);
                        $('.values', this.$el).attr('value', valueStr);
                    }
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
        return objClass;
    });