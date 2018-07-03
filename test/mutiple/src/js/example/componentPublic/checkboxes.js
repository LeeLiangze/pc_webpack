/**
 * Created by wangwei on 2017/2/9.
 * checkboxes 组件示例
 */

define(['checkboxes'], function(Checkboxes) {
    var checkboxesConfig = {
        el: '.checkboxes', //要绑定的容器
        className: 'box3', //组件外围的className,默认横向|all-width纵向
        disabled: 0, //是否禁用，1禁用|0不禁用 
        defaultValue: '1,2,4', //默认选中项（复选框的value值）
        disabledValue:'1,4',//初始化默认禁用指定复选框
        items: [{
            className: 'checkbox1', //复选框的className，可不配置
            label: '查看通话记录', //必须配置
            value: '1', //必须配置
            click: function(e, itemData) {
                //itemData 表示 该复选框的内容 { label:'',value:'', checked:未选中0|选中1 }
                if (itemData.checked) {
                    console.log(itemData.label + '===被勾选');
                } else {
                    console.log(itemData.label + '===被取消勾选');
                }
            }
        }, {
            className: 'checkbox2', //复选框的className
            label: '接听呼入来电',
            value: '2',
            click: function(e, itemData) { //itemData 表示 该复选框的内容
                if (itemData.checked) {
                    console.log(itemData.label + '===被勾选');
                } else {
                    console.log(itemData.label + '===被取消勾选');
                }
            }
        }, {
            className: 'checkbox3', //复选框的className
            label: '执行外呼任务',
            value: '3',
            click: function(e, itemData) { //itemData 表示 该复选框的内容
                if (itemData.checked) {
                    console.log(itemData.label + '===被勾选');
                } else {
                    console.log(itemData.label + '===被取消勾选');
                }
            }
        }]
    }
    var checkboxes = new Checkboxes(checkboxesConfig);
    checkboxes.on('change', function(e, itemData) {
        if (itemData.checked) {
            console.log(itemData.label + '----触发change--勾选');
        } else {
            console.log(itemData.label + '----触发change--取消勾选');
        }
    });
    checkboxes.on('initEnd', function() {
        console.log('组件加载完成');
    })
    $('.disable').on('click', function() {
        checkboxes.disabled();
    });
    $('.enable').on('click', function() {
        checkboxes.enable();
    });
    $('.get').on('click', function() {
        var data = checkboxes.get();
        console.log(data);
    });
    $('.set').on('click', function() {
        checkboxes.set('3');
    });
    $('.clear').on('click', function() {
        checkboxes.clear();
    });
    $('.checkAll').on('click', function() {
        checkboxes.checkAll();
    });
    $('.destroy').on('click', function() {
        checkboxes.destroy();
    });
})
