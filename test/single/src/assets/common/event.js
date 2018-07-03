define(function(){
    //项目总体配置js
    var objClass = {
        ajaxCallback:function(result, isSuc) {
            if(result.returnCode == 'BUSIOPER=RELOGIN'){
                console.log('连接超时-----BUSIOPER=RELOGIN');
            }else if(result.returnCode == '404'){
                console.log('错误------404');
            }
        },
        //日常日志开关
        ajaxAbnormalStart:false,
    };
    return objClass;
})