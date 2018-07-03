/**
 * Created by lizhao on 2016/7/29.
 */
define(function(){

    var  baseExtend=function(option){
        var child = function(){
            this._listeners={};
        };
        $.extend(child.prototype, this.constructor.prototype, option);
        return new child();
    };

    $.extend(baseExtend.prototype,{
        _initialize:function(option){},
        _cm_events:function(){
            if(this.events){
                var events = this.events || {};
                //this.$el=this.$el?this.$el:$("body");
                for (var select in events) {
                    var selectEq0=select.split(" ")[0],selectEq1=select.slice(selectEq0.length);
                    /* for(var i = 0 ;i<selectArr.length;i++){
                     if(selectArr[i] == "" || typeof(selectArr[i]) == "undefined")
                     {
                     selectArr.splice(i,1);
                     i= i-1;
                     }
                     }*/
                    var eventFun= (Object.prototype.toString.apply(events[select]) === "[object String]")?this[events[select]]:events[select];
                    if(this.$el){
                        if(selectEq1){
                            this.$el.on(selectEq0,selectEq1, $.proxy(eventFun,this));
                        }else{
                            this.$el.on(selectEq0, $.proxy(eventFun,this));
                        }
                    }else{
                        this.on(selectEq0,$.proxy(eventFun,this));
                    }
                }
            }
        },
        _cm_return:function(){
            var returnOjb={};
            for(var key in this.constructor.prototype){
                if(!new RegExp( "^(_)").test(key)){
                    returnOjb[key]= $.proxy(this.constructor.prototype[key],this)
                }
            }
            return returnOjb
        },
        on: function(type, listener){
            if (typeof this._listeners[type] == "undefined"){
                this._listeners[type] = [];
            }
            this._listeners[type].push(listener);
        },
        trigger: function(event, param1, param2){
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
        }
    });

    var extend=function(obj){
        var BaseExtend = new baseExtend(obj);
        return function (option){
            option&&option.el&&(BaseExtend.$el = $(option.el));
            BaseExtend._initialize(option);
            BaseExtend._cm_events();
            return BaseExtend._cm_return()
        }
    };
    return extend
});