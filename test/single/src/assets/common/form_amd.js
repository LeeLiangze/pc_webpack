
/*
*   @author: zhangbz
*   @date: 2016-01-18
*   @desc: 弹出窗口控制，基于jquery组件artdialog
*/
define(['jquery'],function(){

    var config = {
        serialize:function($form){
            var arr = $form.serializeArray();
            var obj = {}
            _.each(arr, function(item, i){
                obj[item.name] = item.value;
            })
            //alert('请查看控制台输入，Chrome下按F12，然后选中Console标签')
            //$('#summary').html(obj);
            //console.log(obj)
            return obj;
        }
    }
    return config;
});


          