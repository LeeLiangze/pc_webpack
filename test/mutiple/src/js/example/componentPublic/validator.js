/**
 * Created by wangwei on 2017/2/9.
 * validator 组件示例
 */
require(['validator', 'jquery.fileuploader', 'jquery'], function(Validator) {
    var config = {
        el: $('#validatorContainer'),
        submitBtn: $(".btnSearch"), //触发验证的按钮，可不配置
        dialog: true, //是否弹出验证结果对话框
        rules: {
            mobile: "required|mobile",
            time: "required|date",
            email: 'required|email',
            brand: "required",
            content: "required|min-10", //设置name=content 的元素为必填项，并且字数不能小于10
            files: "require"
        },
        messages: {
            time: { //设置name=startTime 元素的消息
                required: "", //用户未填写该字段时提示
                date: "开始日期格式不正确" //日期格式验证失败时提示
            },
            content: {
                min: "内容输入字数不能少于10"
            }
        }
    };
    $('#fileupload').fileupload({
        url: '../../../lib/jqueryPlugin/jQuery-File-Upload/server/php/',
        dataType: 'json',
        done: function(e, data) {
            $.each(data.result.files, function(index, file) {
                $('<p/>').text(file.name).appendTo(document.body);
            });
        }
    });
    var form2 = new Validator(config);
})
