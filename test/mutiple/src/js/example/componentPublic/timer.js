/**
 * Created by wangwei on 2017/2/9.
 * timer 组件示例
 */
require(['timer', 'jquery'], function(Timer) {
    var config = {
        el: '#timerContainer', //要绑定的容器
        className: 'timerContent', //定时器外围的className
        autoStart: false, //0 false不自动开始|1 true默认自动开始 
        value: '09:55', //计时器初始时间设置，默认值为00:00
        max: '10:03' //计时器的最大值  
    }
    var timer = new Timer(config);
    timer.on('max', function(e) {
        console.log('已达到最大值');
    });
    $('.start').on('click', function() {
        timer.start();
    });
    $('.pause').on('click', function() {
        timer.pause();
    });
    $('.reset').on('click', function() {
        timer.reset();
    });
});
