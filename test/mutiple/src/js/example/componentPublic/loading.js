/**
 * Created by wangwei on 2017/2/9.
 * loading 组件示例
 */
require(['loading'], function(Loading) {
    // body加载
    $('#J_btnBodyInitLoading').on('click', function() {
        new Loading();
    });

    // body加载loadingLine
    var loadingLine = null;
    $('#J_btnBodyInitLoadingLine').on('click', function() {
        loadingLine = new Loading({
            mode: 'loadingLine', //展示方式 loadingLine线条方式|默认layer弹层方式
        });
    });

    // body加载loadingLine － 页面onload完毕
    $('#J_btnBodyInitLoadingLine2').on('click', function() {
        loadingLine.hide();
    });

    // loading1加载
    var loading1 = null;
    $('#J_btnInitLoading').on('click', function() {
        loading1 = new Loading({
            el: '.box1', //组件要绑定的容器，默认为body（此项可不填或留空）
            //className:'my-class',   //组件外围的className
            //position:'top',    //提示信息位置，顶部top|默认center中央
            //width: 100,  //提示信息框宽度，默认300，单位像素
            //height: 300,  //提示信息框高度，默认auto，单位像素
            //mask:0,     //是否显示遮罩， 0不显示|默认1显示
            //animate:0,  //是否显示动画效果， 0不显示|默认1显示
            //mode:'loadingLine',    //展示方式 loadingLine线条方式|默认layer弹层方式
            //text:'这是我要显示text内容...',    //提示文字，默认 加载中...
            //icon: 'dotCycle',  //文字前面的gif动画，挑选几个供用户选择，如 默认dotCycle|cmcc移动图标|cmccLarge大的移动图标
            //content:'这是我要显示的内容'     //显示信息，，默认为 图片+加载中...
        });
        console.log(loading1);
        loading1.on('destroy', function() {
            console.log('关闭触发....');
        });
    });
    // loading1显示
    $('#J_btnShowLoading').on('click', function() {
        if (!loading1) {
            console.log('box1请先加载loading组件');
            return false;
        }
        loading1.show();
    });
    // loading1隐藏
    $('#J_btnHideLoading').on('click', function() {
        if (!loading1) {
            console.log('box1请先加载loading组件');
            return false;
        }
        loading1.hide();
    });
    // loading1关闭
    $('#J_btnDestroyLoading').on('click', function() {
        if (!loading1) {
            console.log('box1请先加载loading组件');
            return false;
        }
        loading1.destroy();
    });


    // loading2加载
    var loading2 = null;
    $('#J_btnInitLoading2').on('click', function() {
        loading2 = new Loading({
            el: '.box2', //组件要绑定的容器，默认为body（此项可不填或留空）
            //className:'my-class',   //组件外围的className
            position: 'top', //提示信息位置，顶部top|默认center中央
            //width: 100,  //提示信息框宽度，默认300，单位像素
            height: 'auto', //提示信息框高度，默认auto，单位像素
            //mask:0,     //是否显示遮罩， 0不显示|默认1显示
            animate: 0, //是否显示动画效果， 0不显示|默认1显示
            //mode:'loadingLine',    //展示方式 loadingLine线条方式|默认layer弹层方式
            //text:'这是我要显示text内容...',    //提示文字，默认 加载中...
            icon: 'cmccLarge', //文字前面的gif动画，挑选几个供用户选择，如 默认dotCycle|cmcc移动图标|cmccLarge大的移动图标
            //content:'这是我要显示的内容'     //显示信息，，默认为 图片+加载中...
        });
        loading2.on('destroy', function() {
            console.log('关闭触发....');
        });
    });
    // loading2显示
    $('#J_btnShowLoading2').on('click', function() {
        if (!loading2) {
            console.log('box2请先加载loading组件');
            return false;
        }
        loading2.show();
    });
    // loading2隐藏
    $('#J_btnHideLoading2').on('click', function() {
        if (!loading2) {
            console.log('box2请先加载loading组件');
            return false;
        }
        loading2.hide();
    });
    // loading2关闭
    $('#J_btnDestroyLoading2').on('click', function() {
        if (!loading2) {
            console.log('box2请先加载loading组件');
            return false;
        }
        loading2.destroy();
    });


    // box1.show(box2)
    $('#J_btnInitLoading3').on('click', function() {
        if (!loading1) {
            console.log('box1请先加载loading组件');
            return false;
        }
        console.log(loading1);
        loading1.show($('.box2'));
        console.log(loading1);
    });

    // box1.show(box1)
    $('#J_btnInitLoading4').on('click', function() {
        if (!loading1) {
            console.log('box1请先加载loading组件');
            return false;
        }
        console.log(loading1);
        loading1.show($('.box1'));
        console.log(loading1);
    });
});
