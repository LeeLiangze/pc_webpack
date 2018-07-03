/**
 * Created by wangwei on 2017/2/9.
 * satisfyStar 组件示例
 */
require(['satisfyStar', 'jquery'], function(SatisfyStar) {
    var config = {
        el: '#satisfyStarContainer', // * 要绑定的容器
        className: 'satisfyStars', // * 组件外围的className
        amounts: 7, // 星星的数量 3-7 默认5
        enableTouch: 1, //是否允许用户点击星星 0禁止|1默认启用
        answerMouseOver: 1, //是否响应用户移到星星上的动作，使星星变成实心或空心
        value: 1 //组件默认值，默认实心星星数量
    }
    var satisfyStar = new SatisfyStar(config);
    satisfyStar.on('select', function(e) {
        console.log('星星数量已选');
    });
    satisfyStar.on('change', function(e) {
        console.log('星星数量改变');
    });
    $('#setStar').on('click', function() {
        satisfyStar.setStarNumber(5);
    });
    $('#getStar').on('click', function() {
        var data = satisfyStar.getStarNumber();
        alert(data)
    });
});
