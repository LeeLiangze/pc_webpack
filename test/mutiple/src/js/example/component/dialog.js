/**
 * Created by wangwei on 2017/2/9.
 * dialog 组件示例
 */
define(['Util',
        'dialog',
        '../../../tpl/example/component/dialog/dialog.tpl'],
    function(Util,Dialog,tpl){

        //系统变量-定义该模块的根节点
        var $el = $(tpl), _indexModule;
        //系统变量-构造函数
        var initialize = function(indexModule, options,tabItem){
            var dialog = null;
            require(['../componentPublic/dialog.js'])
            //将根节点赋值给接口
            this.content = $el;
        };


        return initialize;
    });