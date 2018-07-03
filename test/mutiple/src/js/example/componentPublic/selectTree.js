/**
 * Created by wangwei on 2017/2/9.
 * popupTree 组件示例
 */
define(['Util',
        'selectTree'
    ],
    function(Util, SelectTree) {
        return function(){
        var config = {
            el: $('#selectTree'), //要绑定的容器
            title: '多选弹出树实例', //弹出树面版左上角的标题
            label: '多选弹出树', //弹出树单元左侧label的名称
            name: 'departName', //弹出树单元右侧隐藏域的名称，用于存储用户选中的值
            panelWidth: 300, //弹出面板宽度
            panelHeight: 500, //弹出面板高度
            check: true, //是否可以多选
            async: true, //是否启用异步树
            text: '', //组件初始化时，要显示在文本域中的内容
            value: '1', //组件初始化时，要显示在隐藏域中的内容
            textField: 'name', //用户从树上选中节点时，要显示在文本域中的内容
            childNodeOnly: true, //true仅仅选择子节点到文本域；false连同父级节点一同选择到文本域
            expandAll: true, //默认是否展开所有节点
            checkAllNodes: true, //是否显示复选框“全选”
            onAsyncSuccess: function(){
                console.log(selectTree11.zTree.getNodes()[1]);
            },
            url: '../../../data/selectTree.json' //数据源
        };
        var selectTree11 = new SelectTree(config);
        $(".texts").trigger("click");
        if(selectTree11.zTree){
            console.log(selectTree11.zTree.getNodes()[0]);
        }
       
        selectTree11.on('confirm', function(nodes) {
            if (nodes && nodes[0]) {
                if (nodes[0].isParent) {
                    console.log("请选择一个子节点");
                    return false;
                }
            } else {
                console.log("请选择一个节点");
                return false;
            }

        });
        $("a").on("click",function(){
            console.log(selectTree11.zTree.getNodes()[0]);
        })
        //例子二、单选
        var selectTreeRadio11 = new SelectTree({
            el: $('#selectTreeRadio'), //要绑定的容器
            title: '单选弹出树实例', //弹出树面版左上角的标题
            label: '单选弹出树', //弹出树单元左侧label的名称
            name: 'departNameRadio', //弹出树单元右侧隐藏域的名称，用于存储用户选中的值
            panelWidth: 350, //弹出面板宽度
            panelHeight: 500, //弹出面板高度
            check: false, //是否可以多选
            async: true, //是否启用异步树
            text: '', //组件初始化时，要显示在文本域中的内容
            value: '1', //组件初始化时，要显示在隐藏域中的内容
            textField: 'value', //用户从树上选中节点时，要显示在文本域中的内容
            childNodeOnly: true, //true仅仅选择子节点到文本域；false连同父级节点一同选择到文本域
            expandAll: true, //默认是否展开所有节点
            checkAllNodes: false, //是否显示复选框“全选”
            url: '../../../data/selectTree.json' //数据源
        });
        selectTreeRadio11.on('confirm', function(nodes) {
            if (nodes && nodes[0]) {
                if (nodes[0].isParent) {
                    console.log("请选择一个子节点");
                    return false;
                }
            } else {
                console.log("请选择一个节点");
                return false;
            }

        });
        }
    });
