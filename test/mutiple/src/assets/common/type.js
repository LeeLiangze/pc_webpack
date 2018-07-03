/**
 * Created by lizhao on 2016/7/29.
 */
define(function(){
    var obj=function(){
        this._initialize();
    };

    $.extend(obj.prototype,{
        _initialize:function(){
            this.type = {
                "undefined": "undefined",
                "number": "number",
                "boolean": "boolean",
                "string": "string",
                "[object Function]": "function",
                "[object RegExp]": "regexp",
                "[object Array]": "array",
                "[object Date]": "date",
                "[object Error]": "error"
            }
        },
        /*类型 判断方法 start*/
        typeOf: function (e) {
            return this.type[typeof e] || this.type[Object.prototype.toString.call(e)] || (e ? "object" : "null")
        },
        isArray: function (e) {
            return this.typeOf(e) === "array"
        },
        isBoolean: function (e) {
            return typeof e === "boolean"
        },
        isFunction: function (e) {
            return this.typeOf(e) === "function"
        },
        isDate: function (e) {
            return this.typeOf(e) === "date"
        },
        isNull: function (e) {
            return e === null
        },
        isNumber: function (e) {
            return typeof e === "number"
        },
        //参数e 为是否是函数对象的开关
        isObject: function (f, e) {
            return (f && (typeof f === "object" || (!e && this.isFunction(f)))) || false
        },
        isString: function (e) {
            return typeof e === "string"
        },
        isUndefined: function (e) {
            return typeof e === "undefined"
        }
    })


    return new obj()

});