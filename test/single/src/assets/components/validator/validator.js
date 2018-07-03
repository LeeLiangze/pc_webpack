/**
 * Created by zhanglizhao on 2016/3/9.
 */
define([
        'eventTarget',
        'artDialog',
        './validator.css',
        '../../lib/dialog/6.0.4/css/ui-dialog.css'
    ],
    function (EventTarget) {
        var VERSION = '${{version}}';
        var tools = {
            isArray: function (arr) {
                return Object.prototype.toString.apply(arr) === "[object Array]";
            },
            isObject: function (arr) {
                return Object.prototype.toString.apply(arr) === "[object Object]";
            },
            isFunction: function (arr) {
                return Object.prototype.toString.apply(arr) === "[object Function]";
            }
        };

        var SnRegExp = {
            decmal: "^([+-]?)\\d*\\.\\d+$", //浮点数
            decmal1: "^[1-9]\\d*.\\d*|0.\\d*[1-9]\\d*$", //正浮点数
            decmal2: "^-([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*)$", //负浮点数
            decmal3: "^-?([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*|0?.0+|0)$", //浮点数
            decmal4: "^[1-9]\\d*.\\d*|0.\\d*[1-9]\\d*|0?.0+|0$", //非负浮点数（正浮点数 + 0）
            decmal5: "^(-([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*))|0?.0+|0$", //非正浮点数（负浮点数 + 0）
            intege: "^-?[1-9]\\d*$", //整数
            intege1: "^[1-9]\\d*$", //正整数
            intege2: "^-[1-9]\\d*$", //负整数
            num: "^([+-]?)\\d*\\.?\\d+$", //数字
            num1: "^[1-9]\\d*|0$", //正数（正整数 + 0）
            num2: "^-[1-9]\\d*|0$", //负数（负整数 + 0）
            ascii: "^[\\x00-\\xFF]+$", //仅ACSII字符
            chinese: "^[\\u4e00-\\u9fa5]+$", //仅中文
            color: "^[a-fA-F0-9]{6}$", //颜色
            date: "^\\d{4}(\\-|\\/|\\.)\\d{1,2}\\1\\d{1,2}$", //日期
            time: "^(([0-1]?[0-9])|([2][0-3])):([0-5]?[0-9])(:([0-5]?[0-9]))?$",//时间
            email: "^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$", //邮件
            idcard: "^(^\\d{15}$|^\\d{18}$|^\\d{17}(\\d|X|x))$", //身份证
            ip4: "^(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)$", //ip地址
            letter: "^[A-Za-z]+$", //字母
            letter_l: "^[a-z]+$", //小写字母
            letter_u: "^[A-Z]+$", //大写字母
            mobile: "^0?(13|15|17|18|14)[0-9]{9}$", //手机
            notempty: "^\\S+$", //非空
            password: "^.*[A-Za-z0-9\\w_-]+.*$", //密码
            fullNumber: "^[0-9]+$", //数字
            picture: "(.*)\\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$", //图片
            qq: "^[1-9]*[1-9][0-9]*$", //QQ号码
            rar: "(.*)\\.(rar|zip|7zip|tgz)$", //压缩文件
            tel: "^[0-9\\-()（）]{7,18}$", //电话号码的函数(包括验证国内区号,国际区号,分机号)
            url: "^http[s]?:\\/\\/([\\w-]+\\.)+[\\w-]+([\\w-./?%&=]*)?$", //url
            username: "^[A-Za-z0-9_\\-\\u4e00-\\u9fa5]+$", //户名
            deptname: "^[A-Za-z0-9_()（）\\-\\u4e00-\\u9fa5]+$", //单位名
            zipcode: "^\\d{6}$", //邮编
            realname: "^[A-Za-z\\u4e00-\\u9fa5]+$", // 真实姓名
            companyname: "^[A-Za-z0-9_()（）\\-\\u4e00-\\u9fa5]+$",
            companyaddr: "^[A-Za-z0-9_()（）\\#\\-\\u4e00-\\u9fa5]+$",
            companysite: "^http[s]?:\\/\\/([\\w-]+\\.)+[\\w-]+([\\w-./?%&#=]*)?$"
        };

        var defaultMsg = {
            required: '此项必填',
            mobile: '此项必需为手机号',
            number: '此项必需为数字',
            email: '此项必需为邮箱',
            date: '此项必需为日期',
            time: '此项必需为时间',
            max: '此项最大值为{{0}}',
            min: '此项最小值为{{0}}'
        };

        //验证规则
        var validateRules = {
            // 判断字符串是否为空
            "required": function (str) {
                return !(str.replace(/\s/g, "") == "" || typeof str != "string");
            },
            // 判断是否是手机号码
            "mobile": function (str) {
                return new RegExp(SnRegExp.mobile).test(str);
            },
            // 判断是否是数字
            "number": function (str) {
                return new RegExp(SnRegExp.num).test(str);
            },
            // 判断是否是日期格式
            "date": function (str) {
                return new RegExp(SnRegExp.date).test(str);
            },
            // 判断是否是时间格式
            "time": function (str) {
                return new RegExp(SnRegExp.time).test(str);
            },
            // 判断是否是email
            "email": function (str) {
                return new RegExp(SnRegExp.email).test(str);
            },
            //判断是否整数
            "digits": function (str) {
                return new RegExp(SnRegExp.intege).test(str);
            },
            //判断是否整数
            "max": function (str, _max) {
                return (str.length <= _max);
            },
            //判断是否整数
            "min": function (str, _min) {
                return (str.length >= _min);
            }
            /*  // 判断是否纯数字
             "fullNumber":function(str){
             return new RegExp(SnRegExp.fullNumber).test(str);
             },*/
        };

        var VERSION = '1.0.0';
        var objClass = function (options) {
            // if(!tools.isObject(options)||(options.el&&(options.el.length!=1))||!options.rules)return false;
            if (options.el) {
                if (options.el instanceof jQuery && options.el.length > 0) {
                    this.form = options.el;
                } else if (isDOM(options.el)) {
                    this.form = $(options.el);
                } else if (typeof(options.el) == 'string' && $(options.el).length > 0) {
                    this.form = $(options.el);
                }
            } else {
                this.form = $("<div></div>")
            }
            this.submitBtn = options.submitBtn;
            this.resetBtn = options.resetBtn;
            this.rules = options.rules;
            this.messages = options.messages;
            this.defaultMsg = defaultMsg;
            this.dialog = options.dialog;
            this.items = {};
            this.returnObj = returnObj.call(this);
            EventTarget.call(this.returnObj);

            this.eventInit();
            this.validateRules = validateRules;
            return this.returnObj;
        };

        //返回参数
        function returnObj() {
            var _sef = this;
            var returnOjb = {
                //添加验证规则
                addMethod: function (name, callback) {
                    if (name && callback && tools.isFunction(callback) && !_sef.validateRules[name]) {
                        _sef.validateRules[name] = callback
                    }
                },
                extendMessages: function (msg) {
                    tools.isObject(msg) && $.extend(_sef.defaultMsg, msg);
                },
                form: function () {
                    var validate = _sef.dealValidateArr();
                    if (validate) {
                        _sef.returnObj.trigger("success");
                    }
                    return validate
                }
            };

            $.extend(returnOjb, EventTarget.prototype);

            return returnOjb
        }

        $.extend(objClass.prototype, {
            version: VERSION,
            //事件绑定
            eventInit: function () {

                //提交按钮点击事件
                if (this.submitBtn && this.submitBtn.length) {
                    this.submitBtn.on("click", $.proxy(function (e) {
                        if (this.dealValidateArr()) {
                            this.returnObj.trigger("success");
                        }
                    }, this));
                }
                //重置按钮点击事件
                if (this.resetBtn && this.resetBtn.length) {
                    this.resetBtn.on("click", $.proxy(function () {
                        this.form[0].reset();
                    }, this));
                }

                this.form.on("click", $.proxy(function () {
                    this.getItems();
                }, this));

            },
            //根据el类型绑定对应事件
            eventEleInit: function (item) {
                var _self = this;
                switch (item.tagName) {
                    case "INPUT":
                        _self.form.on("change blur focus", 'input[name=' + item.name + ']', function (e) {
                            if (e.type == "focusin") {
                                _self.dialogClose()
                            } else {
                                var error = _self.verify(item);
                                _self.errorFun(error, item, true);
                            }

                        });
                        break;
                    case "TEXTAREA":
                        _self.form.on("change blur focus", 'textarea[name=' + item.name + ']', function (e) {
                            if (e.type == "focusin") {
                                _self.dialogClose()
                            } else {
                                var error = _self.verify(item);
                                _self.errorFun(error, item, true);
                            }

                        });
                        break;
                    case "SELECT":
                        _self.form.on("change", 'select[name=' + item.name + ']', function () {
                            _self.dialogClose();
                            var error = _self.verify(item);
                            _self.errorFun(error, item, true);
                        });
                        break;
                }
            },
            //循环this.rules得到 this.items;
            getItems: function (callback) {
                if (this.items) {
                    for (var item in this.rules) {
                        if (!this.items[item]) {
                            var ele = $("[name=" + item + "]", this.form);
                            if (ele.length) {
                                this.items[item] = {
                                    name: item,
                                    el: ele,
                                    tagName: ele[0].tagName,
                                    rules: this.rules[item].split("|")
                                };
                                this.eventEleInit(this.items[item]);
                            }
                        }
                        this.items[item] && callback && callback.call(this, this.items[item]);
                    }
                }
            },
            //处理 validateArr
            dealValidateArr: function () {
                var errorText = [];
                this.getItems(function (item) {
                    if (item["rules"]) {
                        var error_text = this.verify(item);
                        this.errorFun(error_text, item);
                        error_text && errorText.push('<p>' + error_text + '</p>');
                    }
                });
                if (errorText.length) {
                    if (this.dialog) {
                        var d = dialog({
                            quickClose: true,
                            content: errorText.join("")
                        });
                        d.show();
                    }

                    return false;
                } else {

                    return true;
                }
            },
            //判断value值是否通过验证 返回错误信息
            verify: function (item) {
                var errorText = '';
                $.each(item.rules, $.proxy(function (kev, v) {
                    var validate = this.getRule(v);
                    if (validate.is_rule) {
                        var value = item.el.val();
                        if (($.inArray("required", item.rules) != -1) || (this.validateRules["required"](value))) {
                            if (validate.validate(value)) {
                                if (this.messages && this.messages[item.name] && this.messages[item.name][validate.val]) {
                                    errorText = this.messages[item.name][validate.val]
                                } else {
                                    //errorText = (this.defaultMsg[validate.val] ? this.defaultMsg[validate.val] : ("验证不通过"));
                                    errorText = this.defaultMsgFun(validate);
                                }
                                return false
                            }
                        }
                    }
                }, this));
                return errorText;
            },
            //默认提示文本
            defaultMsgFun: function (obj) {
                var error = "验证不通过";
                if (this.defaultMsg[obj.val]) {
                    error = this.defaultMsg[obj.val].replace('\{\{0\}\}', obj.str1 ? obj.str1 : "").replace('\{\{1\}\}', obj.str2 ? obj.str2 : "")
                }
                return error;
            },
            //针对 min-10 max-20 这样的规则进行集中处理 后期可在扩展
            getRule: function (rule) {
                var ruleObj = {}, _self = this, arr = [];
                if (rule.split("-")[1]) {
                    arr = rule.split("-");
                    ruleObj.val = arr[0];
                    ruleObj.str1 = arr[1];
                } else {
                    ruleObj.val = rule
                }
                $.extend(ruleObj, {
                    is_rule: !!_self.validateRules[ruleObj.val],
                    validate: function (value) {
                        var is_validate;
                        if (ruleObj.str1) {
                            is_validate = _self.validateRules[ruleObj.val](value, ruleObj.str1)
                        } else {
                            is_validate = _self.validateRules[ruleObj.val](value)
                        }
                        return !is_validate
                    }
                });
                return ruleObj;
            },
            //元素错误处理
            errorFun: function (errorText, item, is_tips) {
                var _self = this;
                if (errorText) {
                    item.el.parent().addClass("validate-error");
                    if (is_tips) {
                        var d = dialog({
                            id: "sn-validate",
                            content: errorText
                        });
                        d.show(item.el[0]);
                        setTimeout($.proxy(function () {
                            _self.dialogClose();
                        }), 2500)
                    }
                } else {
                    item.el.parent().removeClass("validate-error");
                }

            },
            dialogClose: function () {
                dialog.get("sn-validate") && dialog.get("sn-validate").close().remove();
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