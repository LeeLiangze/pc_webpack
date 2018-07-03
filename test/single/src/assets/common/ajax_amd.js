/**
 * @author:fanyu
 * @date：2015-09-16
 * @desc: 通过 HTTP 请求加载远程数据，底层依赖jQuery的AJAX实现。当前接口实现了对jQuery AJAX接口的进一步封装。
 */
define(['jquery','../../js/callHandle/util/base64','event'], function (JQuery,Base64,ajaxConfig) {
    // var ajaxConfig={};
    // require(["event"],function(event){
    //     ajaxConfig =ajaxConfig;
    // });
    var base64=new Base64();
    var store = (function () {
        var api = {},
            win = window,
            doc = win.document,
            localStorageName = 'localStorage',
            globalStorageName = 'globalStorage',
            storage;
        api.disabled = false
        api.set = function (key, value) { }
        api.get = function (key) { }
        api.remove = function (key) { }
        api.clear = function () { }
        api.transact = function (key, transactionFn) {
            var val = api.get(key)
            if (typeof val == 'undefined') { val = {} }
            transactionFn(val)
            api.set(key, val)
        }
        api.serialize = function (value) {
            return JSON.stringify(value)
        }
        api.deserialize = function (value) {
            if (typeof value != 'string') { return undefined }
            return JSON.parse(value)
        }
        function isLocalStorageNameSupported() {
            try { return (localStorageName in win && win[localStorageName]) }
            catch (err) { return false }
        }
        function isGlobalStorageNameSupported() {
            try { return (globalStorageName in win && win[globalStorageName] && win[globalStorageName][win.location.hostname]) }
            catch (err) { return false }
        }
        if (isLocalStorageNameSupported()) {
            storage = win[localStorageName]
            api.set = function (key, val) { storage.setItem(key, api.serialize(val)) }
            api.get = function (key) { return api.deserialize(storage.getItem(key)) }
            api.remove = function (key) { storage.removeItem(key) }
            api.clear = function () { storage.clear() }
        } else if (isGlobalStorageNameSupported()) {
            storage = win[globalStorageName][win.location.hostname]
            api.set = function (key, val) { storage[key] = api.serialize(val) }
            api.get = function (key) { return api.deserialize(storage[key] && storage[key].value) }
            api.remove = function (key) { delete storage[key] }
            api.clear = function () { for (var key in storage) { delete storage[key] } }
        } else if (doc.documentElement.addBehavior) {
            var storage = doc.createElement('div')
            function withIEStorage(storeFunction) {
                return function () {
                    var args = Array.prototype.slice.call(arguments, 0)
                    args.unshift(storage)
                    doc.body.appendChild(storage)
                    storage.addBehavior('#default#userData')
                    storage.load(localStorageName)
                    var result = storeFunction.apply(api, args)
                    doc.body.removeChild(storage)
                    return result
                }
            }
            api.set = withIEStorage(function (storage, key, val) {
                storage.setAttribute(key, api.serialize(val))
                storage.save(localStorageName)
            })
            api.get = withIEStorage(function (storage, key) {
                return api.deserialize(storage.getAttribute(key))
            })
            api.remove = withIEStorage(function (storage, key) {
                storage.removeAttribute(key)
                storage.save(localStorageName)
            })
            api.clear = withIEStorage(function (storage) {
                var attributes = storage.XMLDocument.documentElement.attributes
                storage.load(localStorageName)
                for (var i = 0, attr; attr = attributes[i]; i++) {
                    storage.removeAttribute(attr.name)
                }
                storage.save(localStorageName)
            })
        } else {
            api.disabled = true
        }
        return api
    })();


    var _ajaxBase = function (url, type, cmd, dataType, callback, sync) {
        var param = "";
        /*async = sync ? false : true;*/
        var cache = (dataType == "html") ? true : false;
        $.ajax({
            url: url,
            type: type,
            data: cmd,
            cache: cache,
            dataType: dataType,
            async: sync ? false : true,
            timeout: config.TIME_OUT,
            beforeSend: function (xhr) {
                xhr.overrideMimeType("text/plain; charset=utf-8");
            },
            success: function (data) {
                if (!data) {
                    return;
                }
                if (dataType == "html") {
                    callback(data, true);
                    return;
                }
                try {
                    //超时重定向至登陆页
                    if (data.returnCode == 'BUSIOPER=RELOGIN') {
                        //判断是否存在iframe
                        window.location.href = '../../login.html';
                        return;
                    }
                } catch (e) {
                    alert("JSON Format Error:" + e.toString());
                }
                if (callback && data) {
                    var isSuc = (data.returnCode == config.reqCode.SUCC ? true : false);
                    callback(data || {}, isSuc);
                }
            },
            error: function (e) {
                var retErr = {};
                retErr['returnCode'] = "404";
                retErr['returnMessage'] = "网络异常或超时，请稍候再试！";
                callback(retErr, false);
            },
            complete: function () { }
        });
    }
    var _ajaxJsonp = function (url, type, cmd, callback, sync) {
        var param = "";
        //sync ? false : true
        if (!url || url === '') {
            console.log('the url of param cann\'t equals null or empty of string');
            return false;
        }
        if (!callback || callback === '') {
            console.log('you missed callback, it must be a function');
            return false;
        }
        if (!cmd || cmd === '') {
            console.log('warn! your passed null or empty to cmd param, are you suer?');
        }
        $.ajax({
            url: url,
            type: type,
            data: cmd,
            jsonpCallback: 'jsonCallback',
            contentType: "application/json",
            dataType: 'jsonp',
            async: sync ? false : true,
            timeout: config.TIME_OUT,
            beforeSend: function (xhr) {
                xhr.overrideMimeType("text/plain; charset=utf-8");
            },
            success: function (data) {
                if (!data) {
                    return;
                }
                try {
                    //超时重定向至登陆页
                    if (data.returnCode == 'BUSIOPER=RELOGIN') {
                        //判断是否存在iframe
                        window.location.href = '../../login.html';
                        return;
                    }
                } catch (e) {
                    alert("JSON Format Error:" + e.toString());
                }
                if (callback && data) {
                    var isSuc = (data.returnCode == config.reqCode.SUCC ? true : false);
                    callback(data || {}, isSuc);
                }
            },
            error: function () {
                var retErr = {};
                retErr['returnCode'] = "404";
                retErr['returnMessage'] = "网络异常或超时，请稍候再试！";
                callback(retErr, false);
            },
            complete: function () { }
        });
    }
    var config = {
        /**
         * 请求状态码
         * @type {Object}
         */
        reqCode: {
            /**
             * 成功返回码 0
             * @type {Number} 1
             * @property SUCC
             */
            SUCC: 0
        },
        /**
         * 异常日志 URL配置
         * 
        */
        errorUrl: "http://frontlogger.cs.cmos/frontlogger/log/",
        //用户id

        userId: "-",
        //项目id
        projectCode: "-",
        /**
         * 请求的数据类型
         * @type {Object}
         * @class reqDataType
         */
        dataType: {
            /**
             * 返回html类型
             * @type {String}
             * @property HTML
             */
            HTML: "html",
            /**
             * 返回json类型
             * @type {Object}
             * @property JSON
             */
            JSON: "json",
            /**
             * 返回text字符串类型
             * @type {String}
             * @property TEXT
             */
            TEXT: "text"
        },
        /**
         * 超时,默认超时30000ms
         * @type {Number} 10000ms
         * @property TIME_OUT
         */
        TIME_OUT: 60000,
        /**
         * 显示请求成功信息
         * 
         * @type {Boolean} false
         * @property SHOW_SUCC_INFO
         */
        SHOW_SUCC_INFO: false,
        /**
         * 显示请求失败信息
         * 
         * @type {Boolean} false
         * @property SHOW_ERROR_INFO
         */
        SHOW_ERROR_INFO: false
    }
    var ajax = {
        /**
         * GetJson是对ajax的封装,为创建 "GET" 请求方式返回 "JSON"(text) 数据类型
         * @param {String}
         *            url HTTP(GET)请求地址
         * @param {Object}
         *            cmd json对象参数
         * @param {Function}
         *            callback [optional,default=undefined] GET请求成功回调函数
         */
        getJson: function (url, cmd, callback, sync) {
            if (sync && typeof (sync) == 'boolean') {
                sync = sync;
            } else if (callback) {
                if (typeof (callback) == 'function') {
                    callback = callback
                } else if (typeof (callback) == 'boolean') {
                    sync = callback;
                    callback = '';
                }
            } else if (cmd) {
                if (typeof (cmd) == 'object' || typeof (cmd) == 'string') {
                    cmd = cmd;
                } else if (typeof (cmd) == 'function') {
                    callback = cmd;
                    cmd = '';
                } else if (typeof (cmd) == 'boolean') {
                    sync = cmd;
                    cmd = '';
                    callback = '';
                }
            } else {
                cmd = '';
                callback = '';
                sync = '';
            }

            if (!sync) {
                _ajaxBase(url, 'GET', cmd, config.dataType.JSON, callback);
            } else {
                _ajaxBase(url, 'GET', cmd, config.dataType.JSON, callback, true);
            }
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
        postJson: function (url, cmd, callback, sync) {
            if (sync && typeof (sync) == 'boolean') {
                sync = sync;
            } else if (callback) {
                if (typeof (callback) == 'function') {
                    callback = callback
                } else if (typeof (callback) == 'boolean') {
                    sync = callback;
                    callback = '';
                }
            } else if (cmd) {
                if (typeof (cmd) == 'object' || typeof (cmd) == 'string') {
                    cmd = cmd;
                } else if (typeof (cmd) == 'function') {
                    callback = cmd;
                    cmd = '';
                } else if (typeof (cmd) == 'boolean') {
                    sync = cmd;
                    cmd = '';
                    callback = '';
                }
            } else {
                cmd = '';
                callback = '';
                sync = '';
            }
            if (!sync) {
                _ajaxBase(url, 'POST', cmd, config.dataType.JSON, callback);
            } else {
                _ajaxBase(url, 'POST', cmd, config.dataType.JSON, callback, true);
            }
        },
        uuidFast : function() {
            var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
            var chars = CHARS, uuid = new Array(36), rnd=0, r;
            for (var i = 0; i < 36; i++) {
                if (i==8 || i==13 ||  i==18 || i==23) {
                    uuid[i] = '-';
                } else if (i==14) {
                    uuid[i] = '4';
                } else {
                    if (rnd <= 0x02) rnd = 0x2000000 + (Math.random()*0x1000000)|0;
                    r = rnd & 0xf;
                    rnd = rnd >> 4;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
            return uuid.join('');
        },
        /**
         * putJson是对ajax的封装,为创建 "PUT" 请求方式返回 "JSON"(text) 数据类型
         * @param {String}
         *            url HTTP(PUT)请求地址
         * @param {Object}
         *            cmd json对象参数
         * @param {Function}
         *            callback [optional,default=undefined] PUT请求成功回调函数
         */
        putJson: function (url, cmd, callback, sync) {
            if (sync && typeof (sync) == 'boolean') {
                sync = sync;
            } else if (callback) {
                if (typeof (callback) == 'function') {
                    callback = callback
                } else if (typeof (callback) == 'boolean') {
                    sync = callback;
                    callback = '';
                }
            } else if (cmd) {
                if (typeof (cmd) == 'object' || typeof (cmd) == 'string') {
                    cmd = cmd;
                } else if (typeof (cmd) == 'function') {
                    callback = cmd;
                    cmd = '';
                } else if (typeof (cmd) == 'boolean') {
                    sync = cmd;
                    cmd = '';
                    callback = '';
                }
            } else {
                cmd = '';
                callback = '';
                sync = '';
            }
            if (!sync) {
                _ajaxBase(url, 'PUT', cmd, config.dataType.JSON, callback);
            } else {
                _ajaxBase(url, 'PUT', cmd, config.dataType.JSON, callback, true);
            }
        },
        /**
         * deleteJson是对ajax的封装,为创建 "DELETE" 请求方式返回 "JSON"(text) 数据类型
         * @param {String}
         *            url HTTP(DELETE)请求地址
         * @param {Object}
         *            cmd json对象参数
         * @param {Function}
         *            callback [optional,default=undefined] DELETE请求成功回调函数
         */
        deleteJson: function (url, cmd, callback, sync) {
            if (sync && typeof (sync) == 'boolean') {
                sync = sync;
            } else if (callback) {
                if (typeof (callback) == 'function') {
                    callback = callback
                } else if (typeof (callback) == 'boolean') {
                    sync = callback;
                    callback = '';
                }
            } else if (cmd) {
                if (typeof (cmd) == 'object' || typeof (cmd) == 'string') {
                    cmd = cmd;
                } else if (typeof (cmd) == 'function') {
                    callback = cmd;
                    cmd = '';
                } else if (typeof (cmd) == 'boolean') {
                    sync = cmd;
                    cmd = '';
                    callback = '';
                }
            } else {
                cmd = '';
                callback = '';
                sync = '';
            }
            if (!sync) {
                _ajaxBase(url, 'DELETE', cmd, config.dataType.JSON, callback);
            } else {
                _ajaxBase(url, 'DELETE', cmd, config.dataType.JSON, callback, true);
            }
        },

        getJsonp: function (url, cmd, callback, sync) {
            _ajaxJsonp(url, 'GET', cmd, callback, sync);
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
        ajax: function (options) {
            var config = $.extend({
                type: 'post',
                dataType: 'json',
                timeout: 30000,
                beforeSend: function (xhr) {
                    xhr.overrideMimeType("text/plain; charset=utf-8");
                }
            }, options);
            $.ajax(config);
        },
        cors: function (options) {
            //设置jquery 支持跨域
            $.support && ($.support.cors = true);
            var config = $.extend({
                type: 'post',
                dataType: 'json',
                crossDomain: true,
                timeout: config.TIME_OUT,
                contentType: "application/json; charset=utf-8",
                beforeSend: function (xhr) {
                    xhr.overrideMimeType("text/plain; charset=utf-8");
                }
            }, options);
            if ($.support && $.support.msie) {
                //为ie浏览器时增加xhrFields配置
                config["xhrFields"] = { withCredentials: true };
            }
            $.ajax(config);
        },
        //异常日志收集 start
        setUserId: function (id) {
            id && (config.userId = id)
        },
        setProjectCode: function (projectCode) {
            projectCode && (config.projectCode = projectCode)
        },
        getTime: function () {
            var time = new Date();
            var m = time.getMonth() + 1;
            return [time.getFullYear(), m, time.getDate(), time.getHours(), time.getMinutes(), time.getSeconds()].join("");
        },
        sendError: function (msg, url) {
            var _this = this;
            if (url != this.errorUrl) {
                this.getJsonp(config.errorUrl + config.projectCode + "/" + msg.id + "/" + config.userId + "/" + msg.url + "/" + msg.time + "/" +
                    msg.textStatus + "/" + msg.status + "/" + msg.statusText + "/" + msg.responseText + "/" +
                    msg.readyState + "/" + msg.returnCode + "/" + msg.returnMessage, {}, function (json, state) {
                        if (state) {
                            var ajaxError = _this.getItem();
                            ajaxError && ajaxError[msg.id] && delete ajaxError[msg.id];
                            _this.setItem(ajaxError ? ajaxError : {});
                        } else {
                            _this.storageError(msg, url)
                        }
                    })
            } else {
                this.storageError(msg, url)
            }
        },
        getItem: function () {
            return store.get("ajaxError")
        },
        setItem: function (error) {
            store.set('ajaxError', JSON.stringify(error))
        },
        storageError: function (msg, url) {
            this.errorObj = this.errorObj || {};
            this.errorObj[msg.id] = msg;
            this.setItem(this.errorObj);
        },
        firstSendError: function () {
            var ajaxError = this.getItem();
            for (var i in ajaxError) {
                this.sendError(ajaxError[i])
            }
        },
        start: function () {
            var _this = this;
            $(document).ajaxComplete(function (event, jqxhr, settings) {
                var uuid;
                if (settings.headers && settings.headers.ReqId) {
                    uuid = settings.headers.ReqId
                } else {
                    uuid = _this.uuidFast();
                }
                if (!jqxhr.responseText) {
                    _this.sendError({
                        id: uuid,
                        url: base64.encode(settings.url),
                        time: _this.getTime(),
                        textStatus: base64.encode(jqxhr.error.name ? jqxhr.error.name : "-"),
                        status: base64.encode((jqxhr.status ? jqxhr.status : "-")+""),
                        statusText:base64.encode(jqxhr.statusText ? jqxhr.statusText : "-"),
                        responseText: base64.encode(jqxhr.responseText ? jqxhr.responseText : "-"),
                        readyState:base64.encode(jqxhr.readyState ? jqxhr.readyState : "-"),
                        returnCode: "-",
                        returnMessage: "-"
                    }, settings.url)
                } else {
                    // 业务异常日志收集 暂时关闭               
                    var responseText = JSON.parse(jqxhr.responseText);
                    if(responseText.returnCode != '0'){
                       _this.sendError({
                           id:uuid,
                           url:base64.encode(settings.url),
                           time:_this.getTime(),
                           textStatus:base64.encode(jqxhr.error.name?jqxhr.error.name:"-"),
                           status:base64.encode((jqxhr.status?jqxhr.status:"-")+""),
                           statusText:base64.encode(jqxhr.statusText?jqxhr.statusText:"-"),
                           responseText:base64.encode("-"),
                           readyState:base64.encode((jqxhr.readyState?jqxhr.readyState:"-")+''),
                           returnCode:base64.encode(responseText.returnCode?responseText.returnCode:"-"),
                           returnMessage:base64.encode(responseText.returnMessage?responseText.returnMessage:"-")
                       },settings.url)
                    }
                }

            })
            this.firstSendError();
        }
        //异常日志收集 end
    };
    ajaxConfig.ajaxAbnormalStart&&ajax.start()
    // 异常日志开关
    // setTimeout(function(){
    //     ajaxConfig.ajaxAbnormalStart&&ajax.start()
    // },100);
    return ajax;
});
