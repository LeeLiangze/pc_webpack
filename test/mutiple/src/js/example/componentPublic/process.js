/**
 * Created by wangwei on 2017/2/9.
 * process 组件示例
 */
require(['process', '../../../tpl/example/component/process/val0.tpl', '../../../tpl/example/component/process/val1.tpl', 'eventTarget', 'jquery'], function(Process, tpl0, tpl1, EventTarget) {
    var config = {
        el: $('#processContainer'), //要绑定的容器
        className: 'questionnaireCreater', //整个步骤引导组件外围的class name
        width: '800', //步骤引导组件的宽
        height: '100', //步骤引导组件的高
        items: [ //步骤配置集合
            {
                className: 'step1', //该步骤容器的class name
                title: '第一步', //该步骤的标题
                click: function(e, processObj) { //步骤标题点击时触发的回调函数，默认会触发第一步
                    console.log('进入模块1');
                    var module1 = new Module1();
                    return module1;
                },
                beforeLeave: function(e) { //用户离开此步骤时触发的回调函数
                    console.log('要离开模块1了');
                    // return false    //返回false可以阻止用户离开
                }
            }, {
                className: 'step2',
                title: '第二步',
                click: function(e, processObj) { //processObj是步骤引导组件里所有子步骤中return的对象的集合
                    console.log('进入模块2');
                    var module2 = new Module2();
                    return module2;

                },
                beforeLeave: function(e) {
                    // return false;
                    console.log('要离开模块2了');

                }
            }, {
                className: 'step3',
                title: '第三步',
                click: function(e, processObj) {
                    console.log('进入模块3');
                    var module3 = new Module3();
                    return module3;
                },
                beforeLeave: function(e) {
                    console.log('离开模块3');
                    // return false;
                }
            }
        ]
    };
    var process = new Process(config);
    //module1定义 
    var Module1 = function() {
        var $el = $(tpl0);
        $('.formContainer1').html($el);
        EventTarget.call(this);
        // var validator = new Validator({
        //     el: $('.formContainer1')
        // });
        $('.prevBtn', $el).on('click', function() {
            process.previous();
        });
        $('.nextBtn', $el).on('click', function() {
            process.next();
        });
        $('.switchBtn', $el).on('click', function() {
            process.switchTo('step2');
        });
        $('.getBtn', $el).on('click', function() {
            var a = process.get('step2');
            console.log(a)
        });
        //初始化 $el
        //业务逻辑
        //支持用户写this.$el或this.el
        this.content = $el;
    }

    //module2定义
    var Module2 = function() {
        var $el = $(tpl1);
        $('.formContainer2').html($el);
        EventTarget.call(this);
        // var validator = new Validator({
        //     el: $('.formContainer2')
        // })
        $('.prevBtn', $el).on('click', function() {
            process.previous();
        });
        $('.nextBtn', $el).on('click', function() {
            process.next();
        });
        $('.switchBtn', $el).on('click', function() {
            process.switchTo('step1');
        });
        $('.getBtn', $el).on('click', function() {
            var a = process.get('step1');
            console.log(a)
        });
        this.content = $el;
    }

    //module3定义
    var Module3 = function() {
        var $el = $(tpl0);
        $('.formContainer3').html($el);
        EventTarget.call(this);
        // var validator = new Validator({
        //     el: $('.formContainer3')
        // })
        $('.prevBtn', $el).on('click', function() {
            process.previous();
        });
        $('.nextBtn', $el).on('click', function() {
            process.next();
        });
        $('.switchBtn', $el).on('click', function() {
            process.switchTo('step2');
        });
        $('.getBtn', $el).on('click', function() {
            var a = process.get('step1');
            console.log(a)
        });
        this.content = $el;
    }
    $.extend(Module1.prototype, EventTarget.prototype)
    $.extend(Module2.prototype, EventTarget.prototype)
    $.extend(Module3.prototype, EventTarget.prototype)
})
