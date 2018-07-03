/**
 * Created by wangwei on 2017/2/9.
 * selectList 组件示例
 */
define([
    'Util',
    'selectList',
    '../../../tpl/example/component/selectList/selectListExample.tpl'
], function (Util, SelectList, SelectListTpl) {
    return function () {
        var selectList = new SelectList({
            el: $('#selectListContainer'),
            title: '城市选择',
            label: '弹出列表',
            modal: false,
            content: $(SelectListTpl),
            button: [{
                value: '确定',
                callback: function () {
                    var selectListName = $('.t-columns-group .name').val();
                    var selectListAge = $('.t-columns-group .age').val();
                    $('.sn-selectList .texts').val(selectListName + "/" + selectListAge);
                    console.log({'selectListName': selectListName, 'selectListAge': selectListAge})
                },
                autofocus: true
            }, {
                value: '清空',
                callback: function () {
                    console.log('清空被点击了')
                }
            }, {
                value: '取消',
                callback: function () {
                    console.log('取消被点击了')
                }
            }],
            height: 150
        });
    }
});
