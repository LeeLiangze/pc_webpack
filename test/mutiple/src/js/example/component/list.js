/**
 * Created by wangwei on 2017/2/9.
 * list 组件示例
 */
define(['Util',
        'list',
        '../../../tpl/example/component/list/list.tpl'],
    function(Util,List,tpl){

        //系统变量-定义该模块的根节点
        var $el = $(tpl), _indexModule;
        //系统变量-构造函数
        var initialize = function(indexModule, options,tabItem){
            //将根节点赋值给接口
            this.content = $el;
            require(['../componentPublic/list.js'])
        };


        return initialize;
    });