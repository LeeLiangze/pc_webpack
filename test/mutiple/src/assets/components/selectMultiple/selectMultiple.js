/**
 * 组件-selectMultiple
 */
define([
    'eventTarget',
    'hdb',
    'select2',
    './selectMultiple.tpl',
    '../../lib/requirejs/css.min!lib/select2/select2.css',
    './selectMultiple.css'
], function (EventTarget, Hdb, select2, tpl) {
    var VERSION = '1.0.1';
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
        var _this = this;
        EventTarget.call(this);
        render.call(this);
        /*//设置默认选中项*/
        var setDefaultValue = function () {
            if (_this.options.value && _this.options.value != "") {
                $.each(contentSet.data, function (i, item) {
                    if (_this.options.value == item.id) {
                        contentSet.data.splice(i, 1);
                        contentSet.data.splice(0, 0, item);
                    }
                });
            }
        };
        var contentSet = {};
        //select2 的禁用启用设置
        this.options.disabled ? ( contentSet.disabled = ((this.options.disabled == "0" || this.options.disabled == false) ? false : (this.options.disabled == "1" || this.options.disabled == true) ? true : false) ) : (contentSet.disabled = false);
        //select2 的多选设置
        this.options.multiple ? ( contentSet.multiple = ((this.options.multiple == "0" || this.options.multiple == false) ? false : (this.options.multiple == "1" || this.options.multiple == true) ? true : false) ) : (contentSet.multiple = false);
        //select2 的搜索框设置
        if ((contentSet.multiple == false || !contentSet.multiple) && this.options.minimumResultsForSearch) {
            contentSet.minimumResultsForSearch = this.options.minimumResultsForSearch;
        } else {
            contentSet.minimumResultsForSearch = 20;
        }
        //占位符placeholder
        this.options.placeholder ? (contentSet.placeholder = this.options.placeholder) : (contentSet.placeholder = "");
        //选项清空设置
        this.options.allowClear ? ( contentSet.allowClear = (this.options.allowClear == "0" || this.options.allowClear == false) ? false : (this.options.allowClear == "1" || this.options.allowClear == true) ? true : false ) : (contentSet.allowClear = false);
        //手动输入设置
        if (this.options.tags) {
            if (this.options.tags == "1" || this.options.tags == true) {
                contentSet.tags = true;
                contentSet.tokenSeparators = [',', ' '];	//空格和回车控制，与tags配合使用
            } else if (this.options.tags == "0" || this.options.tags == false) {
                contentSet.tags = false;
            } else {
                console.log("请输入合适的tags值。");
            }
        }
        //动态查询
        if (this.options.enableDynamicSearch && this.options.enableDynamicSearch == "1") {
            if (this.options.url && this.options.url != "") {
                if (this.options.dynamicSearchFieldName && this.options.dynamicSearchFieldName != "") {
                    contentSet.ajax = {
                        // url: 'data/selectMultiple.json' ,
                        url: function (params) {
                            return _this.options.url + '?' + _this.options.dynamicSearchFieldName + '=' + params.term;
                        },
                        dataType: 'json',
                        delay: 250,
                        processResults: function (data, params) {
                            params.page = params.page || 1;
                            data.beans = [{"id": "1", "text": "一号公馆"}];//模拟返回数据
                            return {
                                results: data.beans,
                            }
                        }
                    };
                    contentSet.escapeMarkup = function (markup) {
                        return markup;
                    };
                    contentSet.minimumInputLength = 1;
                    // escapeMarkup: function (markup) { return markup; },
                    // minimumInputLength: 1,
                } else {
                    console.log("请配置请求字段名。");
                }

            } else {
                console.log("请配置URL地址。");
            }
        }

        //数据配置
        if (this.options.datas && this.options.url) {
            console.log("请从deta和url中选择一项配置数据。");
        } else if (this.options.datas && this.options.datas != "") {
            contentSet.data = this.options.datas;
            setDefaultValue();
            $('.sn-select2', this.$el).select2(contentSet);
        } else if (this.options.url && this.options.url != "") {
            $.ajax({
                type: "get",
                datatype: "json",
                url: this.options.url,
                success: function (result) {
                    result = JSON.parse(result);
                    contentSet.data = result.beans;
                    setDefaultValue();
                    $('.sn-select2', this.$el).select2(contentSet);
                    /*	var $options = $('.select2',this.$el).find('option');
                     var _this = this;
                     if(optionValue && optionValue != ""){
                     $.each($options,function(i,item){
                     if(optionValue == $(item).val()){
                     $(".select2-selection__rendered",_this.$el).attr("title",$(item).html());
                     $(".select2-selection__rendered",_this.$el)[0].lastChild.nodeValue = $(item).html();
                     }else{
                     console.log("请输入存在的value值。");
                     }
                     });
                     }*/
                },
                error: function (xhr) {
                    console.log(xhr.responseText);
                }
            });
        } else {
            $('.sn-select2', this.$el).select2(contentSet);
            console.log("请配置数据。");
        }

        /*$('.select2',this.$el).on("change",$.proxy(function(e){
         this.trigger("change",e);
         },this))*/
        this.evenInit();
        //自定义事件
        /*this.$el.on('click','button',$.proxy(function(e){
         btnClick.call(this,e);
         this.trigger('btnClick',e);
         },this));*/
    };

    $.extend(objClass.prototype, {
        evenInit: function (e) {
            $('.sn-select2', this.$el).on("change", $.proxy(function (e) {
                this.trigger("change", e);
            }, this));
        }
    }, EventTarget.prototype);//扩展方法


    //渲染
    var render = function () {
        template = Hdb.compile(tpl);
        this.$el.html(template(this.options));
    };

    /*var btnClick = function(e){
     var target = e.target || e.currentTarget,
     item = this.options.items,
     index = $('.buttonGroup-list li button',this.$el).index(target);
     if(item[index].click){
     item[index].click(e);
     }else{
     console.log("请在items中配置点击事件。");
     }
     }*/
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


