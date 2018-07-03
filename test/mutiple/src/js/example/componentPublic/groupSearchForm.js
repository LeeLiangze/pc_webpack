/**
 * Created by wangwei on 2017/2/9.
 * groupSearchForm 组件示例
 */
define(['groupSearchForm', 'date', 'select', 'selectTree', 'buttonGroup', 'jquery'], function(GroupSearchForm, Mydate, Select, SelectTree, ButtonGroup) {
    var select = new Select({
        label: '用户', //下拉框单元左侧label文本
        name: 'userName', //下拉框单元右侧下拉框名称
        disabled: false, //组件将被禁用
        topOption: "请选择", //设置最顶部option的text属性
        value: '', //初始选中项设置 默认是按value，如果你想按id设置 也可以
        url: '../../../data/select.json', //数据源
    });
    var date = new Mydate({
        label: '日期',
        name: 'startTime', //开始日期文本框name
        format: 'YYYY/MM/DD', //日期格式
        defaultValue: '2016/11/03', //默认日期
        min: laydate.now(0), //最小日期限制
        istime: true,
        istoday: false,
        choose: function() {} //用户选中日期时执行的回调函数
    });
    var date1 = new Mydate({
        label: '日期',
        name: 'startTime1', //开始日期文本框name
        format: 'YYYY/MM/DD', //日期格式
        defaultValue: '2016/11/03', //默认日期
        min: laydate.now(0), //最小日期限制
        istime: true,
        istoday: false,
        choose: function() {} //用户选中日期时执行的回调函数
    });
    var selectTree = new SelectTree({
        title: '部门选择',
        label: '弹出树',
        check: true,
        // async:true,         //是否启用异步树
        name: 'requestType',
        text: '张三',
        value: '13612345611',
        textField: 'name',
        valueFiled: 'id',
        expandAll: true,
        childNodeOnly: true,
        url: '../../../data/selectTree.json'
    });
    var select1 = new Select({
        label: '用户', //下拉框单元左侧label文本
        name: 'userName1', //下拉框单元右侧下拉框名称
        disabled: false, //组件将被禁用
        topOption: "请选择", //设置最顶部option的text属性
        value: '', //初始选中项设置 默认是按value，如果你想按id设置 也可以
        url: '../../../data/select.json', //数据源
    });
    var buttonGroup = new ButtonGroup({
        className: 'buttonGroup', //整个按钮组外围的class
        direction: 'horizontal', //按布布局 horizontal横向|vertical纵向
        items: [ //按钮配置集合
            {
                className: 'reset', //按钮外围的class
                text: '重置', //按钮上的文本
                type: '0', //按钮类型  0普通按钮(默认灰)|1焦点按钮(蓝)|2特殊按钮(红)
                disabled: '1', //是否禁用  0禁用|1默认启用
                click: function(e) { //按钮点击时触发的回调函数
                    groupSearchForm.reset();
                    console.log("重置中...");
                }
            }, {
                className: 'search',
                text: '查询',
                type: '1',
                disabled: '1',
                click: function(e) {
                    console.log(groupSearchForm.getData());
                    console.log("查询中...")
                }
            }
        ]
    })
    var config = {
        el: '#groupSearchFormContainer', // * 要绑定的容器
        className: 'groupSearchForm', // * 组件外围的className
        // title: '表单查询', // 查询表单表头
        column: 2, // 表单文本框的列数(每一行表单项的个数)
        advancedQuery: 1, //是否启用高级查询  默认0false不启用|1true启用
        items: [ // 表单属性信息 及页面显示顺序      
            {
                label: 'email', // 输入框主题信息
                element: 'input', // 元素的标签信息 默认input
                name: 'email', // 元素的标签信息 默认input
                attribute: {
                    type: 'email'
                }
            },
            date,
            select,
            selectTree, {
                label: '<span><b>*</b>手机号</span>',
                element: '<span class="phoneNumber"><input type="mobile" /></span>',
                name: 'phoneNumber'
            }, {
                label: '文本域',
                element: '<input />',
                className: 'text',
                required: 1,
                attribute: {
                    name: 'text',
                    placeholder: '请输入文本内容'
                }
            },
            date1,
            select1
        ],
        // button:buttonGroup
    };
    var groupSearchForm = new GroupSearchForm(config);
    groupSearchForm.on('search', function(data) {
        console.log('查询中......');
        console.log(data);
    });
    // groupSearchForm.on('reset',function(){
    //     console.log('重置中......');
    // });
});
