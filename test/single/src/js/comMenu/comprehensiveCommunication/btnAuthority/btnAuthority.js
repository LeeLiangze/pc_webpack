/*
*   @author:zhangbz
*   @date：2016-01-13
*   @desc: 按钮权限校验
        模块类型：函数
        权限模块实现思路：
            传入一个jquery类型的dom对象，程序会遍历该容器内所有属性为mo的元素，取出mo、id属性，
            并将它们传到服务端进行验证，并根据验证结果来显示这些元素
        参数：
            $el  要设定权限的按钮所属容器
*/
define(['jquery','Util'],function($,Util) {
    //$el 为根dom，下面所有的遍历将控制在这个范围内
    //比如 $el内有按钮元素 <input type="button" value="button1" id="btn1" mo="998" /> 其中id和mo属性必须存在
    var btnAuthority = function($el){
        var $ = jQuery;
        //获取带有mo属性的按钮
        var mos = $el.find('[mo]');
        if (mos.length){
            var params = [];
            mos.each(function(){
                var _this = $(this);
                var tempVal = {
                    'mo':_this.attr('mo'),
                    'btnId':_this.attr('id')
                };
                params.push(tempVal);
            })
            if (params.length) {
                params = JSON.stringify(params);
                Util.ajax.postJson('front/sh/permcommon!checkPerm?uid=perm001',{'datas':params},function(json,status){
                    if (status) {
                        for(var i in json.beans){
                            //mo：1：有权限，0：无权限
                            var bean = json.beans[i];
                            if (bean){
                                if (bean['mo'] == '1') {
                                	$('#'+bean['btnId'], $el).show();
                                }else{
                                	$('#'+bean['btnId'], $el).hide();
                                }
                            }
                            
                        }
                    }
                })
            };
        }
        
    }
    return btnAuthority;
});
