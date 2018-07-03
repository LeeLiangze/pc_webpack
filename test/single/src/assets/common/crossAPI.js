/**
 * Created by lizhao on 2016/3/30.
 */
/*
 *postmessage传输报文格式说明：
 * 1、采用json字符串传输
 * 2、json格式为：
 * type：event/function/setData/getData     报文操作的类型：触发的事件/执行的方法/设置数据/获取数据/请求(为后期可能出现数据请求准备)
 * param:                          传输的参数
 * name：                         操作的类型名称
 *api:
 * 事件：
 * 1、acceptNumberChange 受理手机号改变事件
 * 2、callBegin          电话呼入后的事件回调
 * 3、callEnd            电话挂断后的事件回调
 * 方法：
 * createTab 创建一个tab
 * destroyTab 销毁一个tab或者当前tab
 * showDialog 打开显示模块弹框
 * destroyDialog 移除模块弹框
 * popAlert  弹出右下提示框
 * 受这些全局变量影响
 * disableRequireJS 禁用require方式的模块定义
 * */
(function (_this,_func) {
    if (typeof define === 'function' && define.amd && typeof disableRequireJS === 'undefined'){
        define(_func);
    }else if (typeof exports === 'object'){
        module.exports =_func.apply(_this);
    } else{
        _func.apply(_this);
    }
}(this, function (window) {
    window=this;
    var objClass=function(){
        this._listeners = {};
        if (parent !== window) {
            this.url = document.referrer;
        }else{
            return false
        }
        this.version="1.0.1-20160503";
        EventListener.call(this);
    };
    //事件监听
    function EventListener(){
        var self=this;
        if( window.addEventListener){
            window.addEventListener('message', function(e){
                handleEvent.call(self,e);
            }, false);
        }else {
            window.attachEvent('onmessage', function(e){
                handleEvent.call(self,e);
            });
        }
    }
    //事件处理
    function handleEvent(event){
        var json= JSON.parse(event.data);
        if(json.type=="event"){
            _trigger.call(this,json.name,json.param)
        }else  if(json.type=="setData"){
            _trigger.call(this,"getData_"+json.name,json.param)
        }else  if(json.type=="function"){
            //暂无调用省服务器方法的需求

        }
    }

    //消息发送--总方法
    function sendMsg(json){
        json.name=encodeURI(json.name);
        window.parent.postMessage(JSON.stringify(json),this.url)
    }
    //发送事件消息
    function sendEventMsg(name,originName,parame){
        sendMsg.call(this,{
            type:"event",
            name:name,
            param:parame,
            origin:originName
        });
    }
    //发送方法消息
    function sendFuntionMsg(name,parame){
        sendMsg.call(this,{
            type:"function",
            name:name,
            param:slice(parame)  //主要解决argument 在ie里面的bug
        });
    }
    //发送设置数据消息
    function sendSetDataMsg(name,parame){
        sendMsg.call(this,{
            type:"setData",
            name:name,
            param:parame
        });
    }
    //发送获取数据消息
    function sendGetDataMsg(name,callback,param){
        var self=this,encodeURIname="getData_"+encodeURI(name);
        var bindFun=function(data){
            callback&&callback(data);
        };
        self._listeners[encodeURIname]=[];
        self.on(encodeURIname,bindFun);
        sendMsg.call(this,{
            type:"getData",
            name:name,
            param:param,
            origin:window.location.href
        });
    }
    //事件触发
    function _trigger(event, param1, param2){
        if (typeof event == "string"){
            event = { type: event };
        }
        if (!event.target){
            event.target = this;
        }

        if (!event.type){  //falsy
            throw new Error("Event object missing 'type' property.");
        }

        if (this._listeners[event.type] instanceof Array){
            var listeners = this._listeners[event.type];
            for (var i=0, len=listeners.length; i < len; i++){
                listeners[i].apply(this, [].slice.call(arguments, 1));
            }
        }
    }
    // 实现数组的截取
    function slice(arg,min,max){
        var arr=[];
        for(var i=0;i<arg.length;i++){
            if(i>=(min?min:0)&&i<=(max?max:arg.length)){
                arr.push(arg[i])
            }
        }
        return arr;
    }
    objClass.prototype={
    	callOutByCenter : function(){
            sendFuntionMsg.call(this,"callOutInterface",arguments);
        },
        createTab:function(){
            sendFuntionMsg.call(this,"createTab",arguments);
        },
        destroyTab:function(){
            sendFuntionMsg.call(this,"destroyTab",arguments);
        },
        showDialog:function(){
            sendFuntionMsg.call(this,"iframeDialog",arguments);
        },
        destroyDialog:function(){
            sendFuntionMsg.call(this,"closeDialog",arguments);
        },
        destroyParentDialog:function(){
            sendFuntionMsg.call(this,"destroyDialog",arguments);
        },
        tips:function(){
            sendFuntionMsg.call(this,"tips",arguments);
        },
        showLoading:function(){
            sendFuntionMsg.call(this,"screenLoading.show",arguments);
        },
        destroyLoading:function(){
            sendFuntionMsg.call(this,"screenLoading.hide",arguments);
        },
        //调用接续相关方法获取数据
        getContact:function(name,param,callback){
            if(Object.prototype.toString.call(param)=='[object Function]'){
                sendGetDataMsg.call(this, name, param);
            }else{
                sendGetDataMsg.call(this, name, callback,param);
            }
        },
        getIndexInfo:function(callback){
            sendGetDataMsg.call(this, "cross_data", callback);
        },
        set:function (key, val) {
            sendSetDataMsg.call(this, key, val);
        },
        get:function (key, callback) {
            sendGetDataMsg.call(this, key, callback);
        },
        popAlert:function(){
            sendFuntionMsg.call(this,"popAlert",arguments);
        },
        backToLogin:function(){
            sendFuntionMsg.call(this,"backToLogin",arguments);
        },
        on: function(type, listener){
            if (typeof this._listeners[type] == "undefined"){
                this._listeners[type] = [];
            }
            this._listeners[type].push(listener);
        },
        removeListener: function(type, listener){
            if (this._listeners[type] instanceof Array){
                var listeners = this._listeners[type];
                for (var i=0, len=listeners.length; i < len; i++){
                    if (listeners[i] === listener){
                        listeners.splice(i, 1);
                        break;
                    }
                }
            }
        },
        //-------事件消息 触发事件-------------
        //tabName array  页签数组集合
        //eventName  string  事件名
        //parame  要传递的参数
        trigger:function(tabName,eventName, param){
            sendEventMsg.call(this,eventName,tabName,param);
        }
    };

    window.crossAPI= new objClass();
    return window.crossAPI;
}));