Util = {
    /**
     * 取消事件冒泡
     * @param {Object}
     *            e 事件对象
     */
    stopBubble : function(e) {
        if (e && e.stopPropagation) {
            e.stopPropagation();
        } else {
            // ie
            window.event.cancelBubble = true;
        }
    }
};

Util.browser = {
    /**
     * 获取URL地址栏参数值
     * name 参数名
     * url [optional,default=当前URL]URL地址
     * @return {String} 参数值
     */
    getParameter:function(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
}

/**
 * 日期时间处理工具
 * 
 * @namespace Util
 * @class date
 */
Util.date = {
    /**
     * 格式化日期时间字符串
     * 
     * @method format
     * @param {Date}
     *            dt 日期对象
     * @param {String}
     *            fmt 格式化字符串，如：'yyyy-MM-dd hh:mm:ss'
     * @return {String} 格式化后的日期时间字符串
     */
    format : function(dt, fmt) {
        var z = {
            M : dt.getMonth() + 1,
            d : dt.getDate(),
            h : dt.getHours(),
            m : dt.getMinutes(),
            s : dt.getSeconds()
        };
        fmt = fmt.replace(/(M+|d+|h+|m+|s+)/g, function(v) {
            return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1)))
                    .slice(-2);
        });
        return fmt.replace(/(y+)/g, function(v) {
            return dt.getFullYear().toString().slice(-v.length);
        });
    },
    /**
     * 获取当前日期时间
     * 
     * @method getDatetime
     * @param {String}
     *            fmt [optional,default='yyyy-MM-dd hh:mm:ss'] 日期时间格式。
     * @return {String} 格式化后的日期时间字符串
     */
    getDatetime : function(fmt) {
        return this.format(new Date(), fmt || 'yyyy-MM-dd hh:mm:ss');
    },
    /**
     * 获取当前日期时间+毫秒
     * 
     * @method getDatetimes
     * @param {String}
     *            fmt [optional,default='yyyy-MM-dd hh:mm:ss'] 日期时间格式。
     * @return {String} 格式化后的日期时间字符串
     */
    getDatetimes : function(fmt) {
        var dt = new Date();
        return this.format(dt, fmt || 'yyyy-MM-dd hh:mm:ss') + '.'
                + dt.getMilliseconds();
    },
    /**
     * 获取当前日期（年-月-日）
     * 
     * @method getDate
     * @param {String}
     *            fmt [optional,default='yyyy-MM-dd'] 日期格式。
     * @return {String} 格式化后的日期字符串
     */
    getDate : function(fmt) {
        return this.format(new Date(), fmt || 'yyyy-MM-dd');
    },
    /**
     * 获取当前时间（时:分:秒）
     * 
     * @method getTime
     * @param {String}
     *            fmt [optional,default='hh:mm:ss'] 日期格式。
     * @return {String} 格式化后的时间字符串
     */
    getTime : function(fmt) {
        return this.format(new Date(), fmt || 'hh:mm:ss');
    }
};

/**
 * 通过 HTTP 请求加载远程数据，底层依赖jQuery的AJAX实现。当前接口实现了对jQuery AJAX接口的进一步封装。
 */
(function(obj){
    /**
     * 请求状态码
     * @type {Object}
     */
     var reqCode = {
        /**
         * 成功返回码 0
         * @type {Number} 1
         * @property SUCC
         */
        SUCC : 0
    }
    obj.ajax = {
        /**
         * 请求的数据类型
         * @type {Object}
         * @class reqDataType
         */
        dataType : {
            /**
             * 返回html类型
             * @type {String}
             * @property HTML
             */
            HTML : "html",
            /**
             * 返回json类型
             * @type {Object}
             * @property JSON
             */
            JSON : "json",
            /**
             * 返回text字符串类型
             * @type {String}
             * @property TEXT
             */
            TEXT : "text"
        },
        /**
         * 超时,默认超时30000ms
         * @type {Number} 10000ms
         * @property TIME_OUT
         */
        TIME_OUT : 60000,
        /**
         * 显示请求成功信息
         * 
         * @type {Boolean} false
         * @property SHOW_SUCC_INFO
         */
        SHOW_SUCC_INFO : false,
        /**
         * 显示请求失败信息
         * 
         * @type {Boolean} false
         * @property SHOW_ERROR_INFO
         */
        SHOW_ERROR_INFO : false,
        /**
         * GetJson是对ajax的封装,为创建 "GET" 请求方式返回 "JSON"(text) 数据类型
         * @param {String}
         *            url HTTP(GET)请求地址
         * @param {Object}
         *            cmd json对象参数
         * @param {Function}
         *            callback [optional,default=undefined] GET请求成功回调函数
         */
        getJson : function(url, cmd, callback) {
            if (arguments.length !== 3)
                callback = cmd, cmd = '';
            ajaxBase(url, 'GET', cmd, this.dataType.JSON, callback);
        },
        /**
         * GetJson是对ajax的封装,为创建 "GET" 请求方式返回 "JSON"(text) 数据类型
         * 采用同步阻塞的get方式调用ajax
         * @param {String}
         *            url HTTP(GET)请求地址
         * @param {Object}
         *            cmd json对象参数
         * @param {Function}
         *            callback [optional,default=undefined] GET请求成功回调函数
         */
        getJsonSync : function(url, cmd, callback) {
            if (arguments.length !== 3)
                callback = cmd, cmd = '';
            ajaxBase(url, 'GET', cmd, this.dataType.JSON, callback, true);
        },
        /**
         * PostJsonAsync是对ajax的封装,为创建 "POST" 请求方式返回 "JSON"(text) 数据类型,
         * 采用同步阻塞的post方式调用ajax
         * @param {String}
         *            url HTTP(POST)请求地址
         * @param {Object}
         *            cmd json对象参数
         * @param {Function}
         *            callback [optional,default=undefined] POST请求成功回调函数
         */
        postJsonSync : function(url, cmd, callback) {
            ajaxBase(url, 'POST', cmd, this.dataType.JSON, callback, true);
        },
        /**
         * PostJson是对ajax的封装,为创建 "POST" 请求方式返回 "JSON"(text) 数据类型
         * @param {String}
         *            url HTTP(POST)请求地址
         * @param {Object}
         *            cmd json对象参数
         * @param {Function}
         *            callback [optional,default=undefined] POST请求成功回调函数
         */
        postJson : function(url, cmd, callback) {
            ajaxBase(url, 'POST', cmd, this.dataType.JSON, callback,'');
        },
        getJsonp:function(url, cmd, callback, sync) {
            ajaxJsonp(url, 'GET', cmd, callback, sync);
        },
        /**
         * 跨域请求json数据
         * 
         * @method ajax
         * @param {String}
         *            url HTTP(POST/GET)请求地址
         * @param {String}
         *            type POST/GET
         * @param {Object}
         *            cmd json参数命令和数据
         * @param {Function}
         *            callback [optional,default=undefined] 请求成功回调函数,返回数据data和isSuc
         */
        // ajaxJsonp : ajaxJsonp,
        ajax:function(options){
            var config = $.extend({
                type : 'post',
                dataType : 'json',
                timeout : 30000,
                beforeSend : function(xhr) {
                    xhr.overrideMimeType("text/plain; charset=utf-8");
                }
            },options);
            $.ajax(config);
        }
    }

    function ajaxJsonp(url, type, cmd, callback, sync) {
        var param = "";
        var thiz = this;
        if (!url || url === ''){
            console.log('the url of param cann\'t equals null or empty of string');
            return false;
        }
        if (!callback || callback === ''){
            console.log('you missed callback, it must be a function');
            return false;
        }
        if (!cmd || cmd === ''){
            console.log('warn! your passed null or empty to cmd param, are you suer?');
        }
        $.ajax({
            url : url,
            type : type,
            data : cmd,
            jsonpCallback: 'jsonCallback',
            contentType: "application/json",
            dataType: 'jsonp', 
            async : sync ? false : true,
            timeout : thiz.TIME_OUT,
            beforeSend : function(xhr) {
                xhr.overrideMimeType("text/plain; charset=utf-8");
            },
            success : function(data) {
                if (!data) {
                    return;
                }
                try {
                    //超时重定向至登陆页
                    if (data.returnCode=='BUSIOPER=RELOGIN') {
                        //判断是否存在iframe
                        window.location.href = '../../login.html';
                        return;
                    }
                } catch (e) {
                    alert("JSON Format Error:" + e.toString());
                }
                var isSuc = printReqInfo(data);
                if (callback && data) {
                    callback(data || {}, isSuc);
                }
            },
            error : function() {
                var retErr ={};
                retErr['returnCode']="404";
                retErr['returnMessage']="网络异常或超时，请稍候再试！"; 
                callback(retErr, false);
            },
            complete:function(){
            }
        });
    }

    /**
     * 打开请求返回代码和信息
     * 
     * @method printRegInfo
     * @param {Object}
     *            data 请求返回JSON数据
     * @return {Boolean} true-成功; false-失败
     */
    function printReqInfo(data) {
        if (!data){
            return false;
        }
        var code = data.returnCode, 
            succ = reqCode.SUCC;
        return !!(code == succ);
    }

    /**
     * 基于jQuery ajax的封装，可配置化
     * 
     * @method ajax
     * @param {String}
     *            url HTTP(POST/GET)请求地址
     * @param {String}
     *            type POST/GET
     * @param {Object}
     *            cmd json参数命令和数据
     * @param {String}
     *            dataType 返回的数据类型
     * @param {Function}
     *            callback [optional,default=undefined] 请求成功回调函数,返回数据data和isSuc
     */
    function ajaxBase(url, type, cmd, dataType, callback, sync) {
        var param = "";
        var thiz = this;
        var cache = (dataType == "html") ? true : false;
        $.ajax({
            url : url,
            type : type,
            data : cmd,
            cache : cache,
            dataType : dataType,
            async : sync ? false : true,
            timeout : thiz.TIME_OUT,
            beforeSend : function(xhr) {
                xhr.overrideMimeType("text/plain; charset=utf-8");
            },
            success : function(data) {
                if (!data) {
                    return;
                }
                if (dataType == "html") {
                    callback(data, true);
                    return;
                }
                try {
                    //超时重定向至登陆页
                    if (data.returnCode=='BUSIOPER=RELOGIN') {
                        //判断是否存在iframe
                        window.location.href = '../../login.html';
                        return;
                    }
                } catch (e) {
                    alert("JSON Format Error:" + e.toString());
                }
                var isSuc = printReqInfo(data);
                if (callback && data) {
                    callback(data || {}, isSuc);
                }
            },
            error : function(e) {
                var retErr ={};
                retErr['returnCode']="404";
                retErr['returnMessage']="网络异常或超时，请稍候再试！"; 
                callback(retErr, false);
            },
            complete:function(){
            }
        });
    }
})(Util);

/*
 * 功能:删除数组元素.
 * 返回:在原数组上删除后的数组
 */
Util.Arrays = {
    // 参数: dx 元素的下标
    removeByIndex : function(arrays , dx){
        if(isNaN(dx)||dx>arrays.length){return false;}
        for(var i=0,n=0;i<arrays.length;i++){
            if(arrays[i]!=arrays[dx]){
                arrays[n++]=arrays[i]
            }
        }
        arrays.length-=1
        return arrays;
    },
    //删除指定的item,根据数组中的值
    removeByValue : function(arrays, item ){
        for( var i = 0 ; i < arrays.length ; i++ ){
            if( item == arrays[i] ){
                break;
            }
        }
        if( i == arrays.length ){return;}
        for( var j = i ; j < arrays.length - 1 ; j++ ){
            arrays[ j ] = arrays[ j + 1 ];
        }
        arrays.length--;
        return arrays;
    }
};

/**
 * cookie 操作，设置，取出，删除
 *
 * @namespace Rose
 * @class string
 */
Util.cookie = {
    /**
     * 设置一个cookie
     * @method set
     * @param {String} name cookie名称
     * @param {String} value cookie值
     * @param {String} path 所在路径
     * @param {Number} expires 存活时间，单位:小时
     * @param {String} domain 所在域名
     * @return {Boolean} 是否成功
     */
    set : function(name, value, expires, path, domain) {
        var str = name + "=" + encodeURIComponent(value);
        if (expires != undefined && expires != null && expires != '') {
            if (expires == 0) {expires = 100*365*24*60;}
            var exp = new Date();
            exp.setTime(exp.getTime() + expires*60*1000);
            str += "; expires=" + exp.toGMTString();
        }
        if (path) {
            str += "; path=" + path;
        } else {
            str += "; path=/";
        }
        if (domain) {str += "; domain=" + domain;}
        document.cookie = str;
    },
    /**
     * 获取指定名称的cookie值
     * @method get
     * @param {String} name cookie名称
     * @return {String} 获取到的cookie值
     */
    get : function(name) {
        var v = document.cookie.match('(?:^|;)\\s*' + name + '=([^;]*)');
        return v ? decodeURIComponent(v[1]) : null;
    },
    /**
     * 删除指定cookie,复写为过期
     * @method remove 
     * @param {String} name cookie名称
     * @param {String} path 所在路径
     * @param {String} domain 所在域
     */
    remove : function(name, path, domain) {
        document.cookie = name + "=" +
            ((path) ? "; path=" + path : "") +
            ((domain) ? "; domain=" + domain : "") +
            "; expires=Thu, 01-Jan-70 00:00:01 GMT";
    }
};

// Util.browser = {
//     getParameter : function(name, url) {
//         var paramStr = url || window.location.search;
//         paramStr = paramStr.split('?')[1];
//         if ((!paramStr)||paramStr.length == 0) {return null;}
//         var params = paramStr.split('&');
//         for ( var i = 0; i < params.length; i++) {
//             var parts = params[i].split('=', 2);
//             if (parts[0] == name) {
//                 if (parts.length < 2 || typeof (parts[1]) === "undefined"
//                         || parts[1] == "undefined" || parts[1] == "null")
//                     return '';
//                 return parts[1];
//             }
//         }
//         return null;
//     }
// };


/**
 * 根据日期时间格式获取获取当前日期时间
 * 
 * @method dateTimeWrapper
 * @param {String}
 *            fmt 日期时间格式，如："yyyy-MM-dd hh:mm:ss";
 * @return {String} 格式化后的日期时间字符串
 */
// dateTimeWrapper : function(fmt) {
//     if (arguments[0])
//         fmt = arguments[0];
//     return this.format(new Date(), fmt);
// },