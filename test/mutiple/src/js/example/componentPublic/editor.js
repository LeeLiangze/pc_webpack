/**
 * Created by wangwei on 2017/2/9.
 * editor 组件示例
 */
window.UEDITOR_HOME_URL = '../../../../src/assets/lib/ueditor/';
define(['editor', 'jquery'], function(Editor) {
    $(function() {
        setTimeout(function() {
            var editor0 = new Editor({
                // mode:'normal',
                el: $("#editorContainer"),
                content: '这是一个例子',
                rootUrl: '../../../../src/assets/lib/ueditor/',
                addTools: ['|', 'searchreplace', 'preview']
            });
            setTimeout(function() {
                console.log(editor0.getContent());
             }, 500);
        }, 500);
    })
})
