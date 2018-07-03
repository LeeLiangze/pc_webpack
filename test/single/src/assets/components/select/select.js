/*
 * 组件-select
 */
define(['eventTarget',
        'hdb',
        'jquery',
        './select.tpl',
        './select.css'
    ],
    function (EventTarget, Hdb, $, tpl) {
        var VERSION = '${{version}}';
        var objClass = function (options) {
            this.arr = [];
            // 对this.$el赋值前对options.el类型判断，jquery对象，DOM对象，字符串
            if (options.el && options.el instanceof jQuery) {
                this.$el = options.el;
            } else if (options.el && (options.el.nodeType == 1 || typeof (options.el) == 'string')) {
                this.$el = $(options.el);
            } else {
                this.$el = $('<div></div>');
            }
            this.$el.addClass('sn-select');
            EventTarget.call(this);
            initialize.call(this, options);
            eventInit.call(this);
        };
        var render = function ($ele, options, result) {
            // 渲染html内容
            var template = Hdb.compile(tpl);
            $ele.html(template(options));
            $ele.find('select').attr('name', options.name).addClass(options.className);
            $.each(result, $.proxy(function (i, item) {
                var disable = item.disabled;
                if (i == 0) {
                    $ele.find('select').append('<option value=' + item.value + '>' + item.name + '</option>');
                    $ele.find('ul').append('<li class="active-result">' + item.name + '</li>');
                } else {
                    $ele.find('select').append('<option value=' + item[options.valueField ? options.valueField : "value"] + '>' + item[options.textField ? options.textField : "name"] + '</option>');
                    $ele.find('ul').append('<li class="active-result">' + item[options.textField ? options.textField : "name"] + '</li>');
                }
                if (disable) {
                    $('option:last', $ele).prop('disabled', true);
                    $('li:last', $ele).addClass('disabled-result');
                }
            }, this));
            this["$select"] = $('.sn-select-container>select', $ele);
            this["$analog"] = $('.sn-select-container>.sn-select-analog', $ele);
            this["$ul"] = $('.sn-select-container>.sn-select-analog>.sn-select-drop>ul', $ele);
        };
        var isDisabled = function () {
            var isDisable = this.options.disabled;
            if (isDisable) {
                this.$select.prop("disabled", isDisable);
                this.$analog.addClass('sn-select-disabled');
            }
        };
        var initialize = function (options) {
            var datas = options.datas && options.datas.slice(0);
            this.options = options;
            if (datas && typeof (datas) == "object" && Object.prototype.toString.call(datas) == "[object Array]" && ( datas.length > 0)) {
                //若配置项中默认选项为空时，添加下拉框提供首选择“请选择”，选中该首选项。
                if (!options.value) {
                    options.value = '';
                    datas.splice(0, 0, {value: "", name: options.topOption ? options.topOption : "请选择"})
                }
                this.arr = datas;
                render.call(this, this.$el, options, datas);
                this.setValue(options.value);
                isDisabled.call(this);
            } else if (options && options.url && typeof (options.url) == 'string' && options.url.length > 0) {
                var ajaxOptions = options.jquery;
                ajaxOptions = $.extend({
                    type: 'post',
                    dataType: 'json',
                    url: options.url,
                    data: {},
                    success: $.proxy(ajaxHandle, this),
                    error: function (err) {
                        console.log('集成组件-下拉框 数据加载失败!');
                    }
                }, ajaxOptions);
                $.ajax(ajaxOptions);
            } else {
                console.log('集成组件-下拉框 数据加载失败!');
            }
        };
        var ajaxHandle = function (result) {
            if (result.returnCode == '0') {
                var options = this.options;
                //若配置项中默认选项为空时，添加下拉框提供首选择“请选择”，
                //选中该首选项“请选择”，避免歧义。
                if (!options.value) {
                    options.value = '';
                    result.beans.splice(0, 0, {value: "", name: options.topOption ? options.topOption : "请选择"})
                }
                this.arr = result.beans;
                $.extend(result, options);
                render.call(this, this.$el, options, result.beans);
                this.setValue(result.value);

                isDisabled.call(this);

            }
        };
        var eventInit = function () {
            //展示面板
            this.$el.on('click', '.sn-select-container>.sn-select-analog', $.proxy(function (e) {
                showDrop.call(this, e);
                this.trigger('showDrop', e);
            }, this));
            //点击选择项
            this.$el.on('click', '.sn-select-container>.sn-select-analog>.sn-select-drop>ul>li', $.proxy(function (e) {
                liClick.call(this, e);
                this.trigger('liClick', e);
            }, this));
            //点击组件外区域，关闭面板
            $(document).on('click', function (e) {
                var $analog = $('.sn-select-drop-active').closest('.sn-select-analog');
                if ($('.sn-select-drop-active', $analog).length != 0) {
                    spaceClose(e, $analog);
                }
            });
        };
        //展示下拉面板
        var showDrop = function (e) {
            e.stopPropagation();    //防止冒泡触发spaceClose
            var $drop = $('.sn-select .sn-select-drop-active');
            if ($drop.length != 0) {
                var $con = $drop.closest('.sn-select');
                if (!$con.is(this.$el)) {
                    $('.sn-select-drop', $con).removeClass('sn-select-drop-active');
                    $('.sn-select-analog', $con).removeClass('sn-select-analog-active');
                }
            }
            if (!this.$select.prop('disabled')) {
                $('.sn-select-drop', this.$analog).addClass('sn-select-drop-active');
                this.$analog.addClass('sn-select-analog-active');
            }
        };
        //选择下拉框内容并隐藏下拉面板
        var liClick = function (e) {
            e.stopPropagation();    //防止冒泡触发showDrop
            var $src = $(e.target || e.currentTarget);
            var $li = $src.closest('li');
            if ($li.hasClass('disabled-result')) {
                return;
            } else {
                if ($li.hasClass('result-selected')) {
                    this.$analog.removeClass('sn-select-analog-active');
                    $('.sn-select-drop', this.$analog).removeClass('sn-select-drop-active');
                } else {
                    var index = $li.index();
                    $('.result-selected', this.$ul).removeClass('result-selected');
                    $('.sn-select-single>span', this.$analog).html($li.html());
                    var value = $('option:eq(' + index + ')', this.$select).val();
                    this.$select.val(value);
                    $li.addClass('result-selected');
                    this.$analog.removeClass('sn-select-analog-active');
                    $('.sn-select-drop', this.$analog).removeClass('sn-select-drop-active');
                    this.trigger('change', e, this.getSelected());
                }
            }
        };
        //空白区域关闭下拉面板
        var spaceClose = function (e, $analog) {
            var $target = $(e.target || e.currentTarget);
            var $el = $analog.closest('.sn-select');
            if ($target.closest($el).length == 0) {
                $('.sn-select-drop', $analog).removeClass('sn-select-drop-active');
                $analog.removeClass('sn-select-analog-active');
            }
        };
        //获得$option
        var getOption = function (value) {
            var $option;
            if (value && value != '') {
                if (typeof value == 'string') {
                    $option = this.$select.find("option[value=" + value + "]");
                } else if (typeof value == 'number') {
                    $option = this.$select.find("option:eq(" + value + ")");
                } else if (Object.prototype.toString.apply(value) === "[object Array]") {
                    var pro = value[0];
                    var val = value[1];
                    $.each(this.arr, $.proxy(function (i, item) {
                        if (item[pro] == val) {
                            $option = this.$select.find("option[value=" + item.value + "]");
                        }
                    }, this));
                }
            } else {
                $option = this.$select.find("option:eq(0)");
            }
            return $option;
        };
        $.extend(objClass.prototype, {
            version: VERSION,
            // 设置下拉框选中项
            setValue: function (value, e) {
                if (typeof(value) == 'undefined') {
                    return;
                } else {
                    var $option = getOption.call(this, value);
                    var text = $option.html();
                    var selectValue = this.$select.val();
                    if ($option && $option.length != 0) {
                        if (text !== $('.sn-select-single>span', this.$analog).html()) {
                            var index = $option.index();
                            $('.sn-result-selected', this.$ul).removeClass('sn-result-selected');
                            $('li:eq(' + index + ')', this.$ul).addClass('sn-result-selected');
                            this.$select.val($option.val());
                            $('.sn-select-single>span', this.$analog).html(text);
                            if (selectValue !== value) {
                                this.trigger('change', e, this.getSelected());
                            }
                        }
                    }
                }
            },
            // 获取下拉框的值
            getSelected: function (value) {
                var ind = $("option:selected", this.$select).prop('index');
                var obj = this.arr[ind];
                if (value) {
                    return obj[value];
                } else {
                    return obj;
                }
            },
            // 启用下拉框
            enable: function (value) {
                if (typeof(value) != 'undefined') {
                    var $option = getOption.call(this, value);
                    if ($option.prop('disabled')) {
                        var index = $option.index();
                        $option.prop('disabled', false);
                        $('li:eq(' + index + ')', this.$ul).removeClass('disabled-result');
                    }
                } else {
                    this.$select.prop("disabled", false);
                    this.$analog.removeClass('sn-select-disabled');
                }
            },
            //禁用下拉框
            disabled: function (value) {
                if (typeof(value) != 'undefined') {
                    var $option = getOption.call(this, value);
                    if (!$option.prop('disabled')) {
                        var index = $option.index();
                        $option.prop('disabled', true);
                        $('li:eq(' + index + ')', this.$ul).addClass('disabled-result');
                    }
                } else {
                    this.$select.prop("disabled", true);
                    this.$analog.addClass('sn-select-disabled');
                }
            },
            reload: function (datas) {
                this.options.datas = datas;
                initialize.call(this, this.options);
            }
        }, EventTarget.prototype);
        window.console = window.console || (function () {
                var c = {};
                c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function () {
                };
                return c;
            })();
        return objClass;
    });


