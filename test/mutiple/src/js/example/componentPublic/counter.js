/**
 * Created by wangwei on 2017/2/9.
 * counter 组件示例
 */
define(['counter', 'jquery'], function(Counter) {
    var config = {
        el: $('#counterContainer'), //要绑定的容器
        className: 'myCounter', //组件外围的className
        label: '数量', //步进器左侧label文本
        value: -5, //初始计步器设置，默认值为0
        max: 20, //最大值
        min: -8 //最小值，必须为不小于0的数，如果小于0，则默认为0，不设置也默认为0
    }
    var counter = new Counter(config);
    counter.on('focus', function(e) {
        console.log('获得焦点');
    })

    $('.getBtn').on('click', function() {
        var a = counter.get();
        console.log(a)
    });
    $('.setBtn').on('click', function() {
        counter.set(15)
    });
});
