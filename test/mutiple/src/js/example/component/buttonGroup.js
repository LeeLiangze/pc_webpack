/**
 * Created by wangwei on 2017/2/9.
 * buttonGroup 组件示例
 */
define(['buttonGroup', '../../../tpl/example/component/buttonGroup/buttonGroup.tpl'],
    function (btnGroup,tpl) {
        //系统变量-定义该模块的根节点
        var $el = $(tpl);
        //系统变量-构造函数
        var initialize = function () {
            
            //将根节点赋值给接口
            this.content = $el;
            this.renderCallback = function(){
                var config = {
                    el: '#buttonGroupContainer', //要绑定的容器
                    className: 'buttonGroup011', //整个按钮组外围的class
                    direction: 'horizontal', //按布布局 horizontal横向|vertical纵向
                    items: [ //按钮配置集合
                        {
                            className: 'buttonSave11', //按钮外围的class
                            text: '保存1', //按钮上的文本
                            type: '0', //按钮类型  0普通按钮(默认灰)|1焦点按钮(蓝)|2特殊按钮(红)
                            disabled: '0', //是否禁用  0禁用|1默认启用
                            click: function(e) { console.log("我被点击了。。。+1") } //按钮点击时触发的回调函数
                        }, {
                            className: 'buttonSave2', //按钮外围的class
                            text: '保存2', //按钮上的文本
                            type: '1', //按钮类型  0普通按钮(默认灰)|1焦点按钮(蓝)|2特殊按钮(红)
                            disabled: '0', //是否禁用  0禁用|1默认启用
                            click: function(e) { console.log("我被点击了。。。+2") } //按钮点击时触发的回调函数
                        }, {
                            className: 'buttonSave3', //按钮外围的class
                            text: '保存3', //按钮上的文本
                            type: '2', //按钮类型  0普通按钮(默认灰)|1焦点按钮(蓝)|2特殊按钮(红)
                            disabled: 0, //是否禁用  0禁用|1默认启用
                            click: function(e) { console.log("我被点击了。。。+3") } //按钮点击时触发的回调函数
                        }, {
                            className: 'buttonSave4', //按钮外围的class
                            text: '保存4', //按钮上的文本
                            type: '0', //按钮类型  0普通按钮(默认灰)|1焦点按钮(蓝)|2特殊按钮(红)
                            disabled: 1, //是否禁用  0禁用|1默认启用
                            click: function(e) { console.log("我被点击了。。。+4") } //按钮点击时触发的回调函数
                        }, {
                            className: 'buttonSave5', //按钮外围的class
                            text: '保存5',
                            type: '1', //按钮上的文本
                            click: function(e) { console.log("我被点击了。。。+5") } //按钮点击时触发的回调函数
                        }, {
                            className: 'buttonSave4', //按钮外围的class
                            text: '保存6', //按钮上的文本
                            type: '2', //按钮类型  0普通按钮(默认灰)|1焦点按钮(蓝)|2特殊按钮(红)
                            disabled: 1, //是否禁用  0禁用|1默认启用
                            click: function(e) { console.log("我被点击了。。。+6") } //按钮点击时触发的回调函数
                        }
                    ]
                };
                var btn = new btnGroup(config);
            }
        };


        return initialize;
    });