/**
 * Created by wangwei on 2017/2/9.
 * dialog 组件示例
 */
define(['Util',
        'dialog'
    ],
    function(Util, Dialog) {
        var dialog = null;
        $('.normal').on('click', function() {
            dialog = new Dialog({
                id: 'comfirm',
                mode: 'normal', //对话框模式，默认normal标准|tips浮动层|confirm确认对话框
                // delayRmove:3, //延迟删除秒数设定 默认3秒

                title: '标题', //对话框标题
                content: '这里是对话框的内容', //对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）

                ok: function() { console.log('点击了确定按钮') }, //确定按钮的回调函数 
                okValue: '确定', //确定按钮的文本
                cancel: function() { console.log('点击了取消按钮') }, //取消按钮的回调函数
                cancelValue: '取消', //取消按钮的文本
                cancelDisplay: true, //是否显示取消按钮 默认true显示|false不显示
                button: [ //自定义按钮组
                    {
                        value: '同意', //按钮显示文本
                        callback: function() { //自定义按钮回调函数
                            return false; //阻止窗口关闭
                        }
                    }
                ],
                width: 600, //对话框宽度
                height: 400, //对话框高度
                skin: 'dialogSkin', //设置对话框额外的className参数
                fixed: false, //是否开启固定定位 默认false不开启|true开启
                quickClose: false, //点击空白处快速关闭 默认false不关闭|true关闭
                // modal:false   //是否开启模态框状态  默认false不开启|true开启,confirm默认状态为true
            });
        })
        $('.confirm').on('click', function() {
            dialog = new Dialog({ mode: 'confirm', title: '标题', content: '这是一个confirm' })
        })
        $('.tips').on('click', function() {
            dialog = new Dialog({ mode: 'tips', content: '这是一个tips' })
        })
        $('.show').on('click', function() {
            dialog.show(document.getElementById('box'));
        })
        $('.cancel').on('click', function() {
            dialog.close();
        })
    });
