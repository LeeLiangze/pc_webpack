/**
 * Created by wangwei on 2017/2/9.
 * counter 组件示例
 */
define(['../../../tpl/example/component/counter/counter.tpl'],
    function (tpl) {
        //系统变量-定义该模块的根节点
        var $el = $(tpl);
        //系统变量-构造函数
        var initialize = function () {
            require(['../componentPublic/counter.js'])
            //将根节点赋值给接口
            this.content = $el;
        };


        return initialize;
    });