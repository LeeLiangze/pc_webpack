/**
 * Created by wangwei on 2017/2/9.
 * select 组件示例
 */
define(['Util',
        'select'
    ],
    function(Util, Select) {
        return function(){
        var select = new Select({
            el: $('#select'), //要绑定的容器
            label: '用户', //下拉框单元左侧label文本
            name: 'userName', //下拉框单元右侧下拉框名称
            disabled: false, //组件将被禁用
            topOption: "请选择", //设置最顶部option的text属性
            value: '', //初始选中项设置 默认是按value，如果你想按id设置 也可以 value:["id",1],这样设置
            url: '../../../data/select.json' //数据源
        });
        select.on("change", function(e, valueObj) {
            console.log("select已经改变为:" + valueObj.name)
        });
        $('.js-enable').on("click", function() {
            select.enable();
        });
        $('.js-disabled').on("click", function() {
            select.disabled();
        });
        $('.js-getSelected').on("click", function() {
            console.log("您当前选择的是:" + select.getSelected().name);
        });
        $('.js-setValue').on("click", function() {
            select.setValue("13612345611")
        });
        }
    });
