/**
 * selectTree 组件示例
 */
define(['Util',
        'selectTree',
        '../../../tpl/example/component/selectTree/selectTree.tpl'],
    function(Util,SelectTree,tpl){

        //系统变量-定义该模块的根节点
        var $el = $(tpl), _indexModule;
        //系统变量-构造函数
        var initialize = function(indexModule, options,tabItem){
            _indexModule = indexModule;
            //将根节点赋值给接口
            this.content = $el;
            require(['../componentPublic/selectTree.js'],function(tree){
                new tree()
            })
        };
        return initialize;
    });