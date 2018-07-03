define(['hdb'],function(hdb){
    // hdb.registerHelper('ifCond', function(v1, v2, options) {
    //     if(v1 && v2) {
    //         return options.fn(this);
    //     }
    //     return options.inverse(this);
    // });

    hdb.registerHelper('if_false', function(v1, options) {
        if(!v1) {
            return options.fn(this);
        }
        return options.inverse(this);
    });

    hdb.registerHelper('if_object', function(context, options) {
        if (typeof(context) == options.hash.compare)
            return options.fn(this);
        return options.inverse(this);
    });
    hdb.registerHelper('if_checkbox', function(context, options) {
        if (context == options.hash.compare)
            return options.fn(this);
        return options.inverse(this);
    });
    hdb.registerHelper('divide100', function(value) {
        return value / 100;
    });
    hdb.registerHelper('add', function(value, addition) {
        return value + addition;
    });
    hdb.registerHelper('i2c', function i2c(j) {
        var re = /^[1-9]+[0-9]*]*$/;
        if (re.test(j)) {
            var m = "";
            var y = parseInt(j) - 26;
            if (y <= 0) {
                m += String.fromCharCode(64 + parseInt(j))
                return m;
            } else {
                m += "Z" + i2c(y);
                return m;
            }
        } else {
            return "";
        }
    });

    hdb.registerHelper('subtract', function(value, substraction) {
        return value - substraction;
    });
    hdb.registerHelper('divide', function(value, divisor) {
        return value / divisor
    });
    /**
     * 求百分比 add by wangxy
     */
    hdb.registerHelper('percentage', function(value, divisor) {
        return value * 100 / divisor
    });
    hdb.registerHelper('multiply', function(value, multiplier) {
        return value * multiplier
    });
    hdb.registerHelper('floor', function(value) {
        return Math.floor(value);
    });
    hdb.registerHelper('ceil', function(value) {
        return Math.ceil(value);
    });
    hdb.registerHelper('round', function(value) {
        return Math.round(value);
    });
    /**
     * If Equals if_eq this compare=that
     */
    hdb.registerHelper('if_eq', function(context, options) {
        if (context == options.hash.compare)
            return options.fn(this);
        return options.inverse(this);
    });

    /**
     * 判断题目是不是判断题和单选题
     */
    hdb.registerHelper('if_eqRouter', function(context, options) {
        if (context == '判断题' || context == '单选题')
            return options.fn(this);
        return options.inverse(this);
    });

    /**
     * 数字转化为字母
     */
    hdb.registerHelper('i2c', function(context, options1, options2) {
        if (context == '判断题') {
            return options2 == "是" ? "Y" : "N"
        } else {
            if (options1 >= 0 && options1 <= 25) {
                return String.fromCharCode(65 + parseInt(options1))
            } else {
                return "";
            }
        }
    });

    /**
     * Unless Equals unless_eq this compare=that
     */
    hdb.registerHelper('unless_eq', function(context, options) {
        if (context == options.hash.compare)
            return options.inverse(this);
        return options.fn(this);
    });

    /**
     * If Greater Than if_gt this compare=that
     */
    hdb.registerHelper('if_gt', function(context, options) {
        if (context > options.hash.compare)
            return options.fn(this);
        return options.inverse(this);
    });

    /**
     * Unless Greater Than unless_gt this compare=that
     */
    hdb.registerHelper('unless_gt', function(context, options) {
        if (context > options.hash.compare)
            return options.inverse(this);
        return options.fn(this);
    });

    /**
     * If Less Than if_lt this compare=that
     */
    hdb.registerHelper('if_lt', function(context, options) {
        if (context < options.hash.compare)
            return options.fn(this);
        return options.inverse(this);
    });

    /**
     * Unless Less Than unless_lt this compare=that
     */
    hdb.registerHelper('unless_lt', function(context, options) {
        if (context < options.hash.compare)
            return options.inverse(this);
        return options.fn(this);
    });

    /**
     * If Greater Than or Equal To if_gteq this compare=that
     */
    hdb.registerHelper('if_gteq', function(context, options) {
        if (context >= options.hash.compare)
            return options.fn(this);
        return options.inverse(this);
    });

    /**
     * Unless Greater Than or Equal To unless_gteq this compare=that
     */
    hdb.registerHelper('unless_gteq', function(context, options) {
        if (context >= options.hash.compare)
            return options.inverse(this);
        return options.fn(this);
    });

    /**
     * If Less Than or Equal To if_lteq this compare=that
     */
    hdb.registerHelper('if_lteq', function(context, options) {
        if (context <= options.hash.compare)
            return options.fn(this);
        return options.inverse(this);
    });

    /**
     * Unless Less Than or Equal To unless_lteq this compare=that
     */
    hdb.registerHelper('unless_lteq', function(context, options) {
        if (context <= options.hash.compare)
            return options.inverse(this);
        return options.fn(this);
    });

    /**
     * 裁剪内容,对于过长的string,使用...来替代 参数：内容,保留长度
     */
    hdb.registerHelper("shrink", function(content, length) {
        content = content ? content : '';
        if (content.length > length) {
            content = content.slice(0, length);
            content += '..';
        }
        return new hdb.SafeString(content);
    });

    hdb.registerHelper("subStr", function(content, start, length) {
        content = content ? content : '';
        if (content.length > length && content.length > start) {
            content = content.slice(start, length);
        }
        return new hdb.SafeString(content);
    });

    hdb.registerHelper("ternary", function(content, value) {
        content = content ? content : value;
        return new hdb.SafeString(content);
    });

    /**
     * SafeString
     */
    hdb.registerHelper('safeString', function(text, options) {
        text = text ? text : '';
        return new hdb.SafeString(text);
    });

    /**
     * 定义表格隔行变色
     */
    hdb.registerHelper("splitClass", function(txt, fn) {
        var buffer = "split";
        if (txt % 2 == 0) {
            buffer = "";
        }
        return buffer;
    });

    /**
     * 判断数组中是否有多个数组项目
     * 
     */
    hdb.registerHelper("if_array_multi", function(array, options) {
        array = array ? array : [ '' ];
        if (array.length && array.length > 1) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });

    /**
     * 索引值从1开始
     * 
     */
    hdb.registerHelper("index", function(str, fn) {
        str += 1;
        return str;
    });

    /*
     * 截取日期字符串中的年月日，不显示时分秒
     */
    hdb.registerHelper("tblDateFmt", function(date) {
        return date.substr(0, 10);
    });
    /*
     * 判断两个字符串是否相当
     * */
    hdb.registerHelper('compare', function(left, operator, right, options) {
        if (arguments.length < 3) {
            throw new Error('Handlerbars Helper "compare" needs 2 parameters');
        }
        var operators = {
            '==':     function(l, r) {return l == r; },
            '===':    function(l, r) {return l === r; },
            '!=':     function(l, r) {return l != r; },
            '!==':    function(l, r) {return l !== r; },
            '<':      function(l, r) {return l < r; },
            '>':      function(l, r) {return l > r; },
            '<=':     function(l, r) {return l <= r; },
            '>=':     function(l, r) {return l >= r; },
            'typeof': function(l, r) {return typeof l == r; }
        };
        if (!operators[operator]) {
            throw new Error('Handlerbars Helper "compare" doesn\'t know the operator ' + operator);
        }
        var result = operators[operator](left, right);
        if (result) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });
    /*
     * for循环生成li
     * */
    hdb.registerHelper('for', function(number) {
        var list = '';
        for(var i=0, l=number; i<l; i++) {
            list = list + '<li></li>';
        }
        return list;
    });
    return hdb;
});
