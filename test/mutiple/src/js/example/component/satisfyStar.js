/**
 * Created by wangwei on 2017/2/9.
 * satisfyStar 组件示例
 */
define(['../../../tpl/example/component/satisfyStar/satisfyStar.tpl'],
    function(tpl) {
        //系统变量-定义该模块的根节点
        var $el = $(tpl);
        //系统变量-构造函数
        var initialize = function() {
            this.content = $el;
            require(['../componentPublic/satisfyStar.js'])
        };
        return initialize;
    });
