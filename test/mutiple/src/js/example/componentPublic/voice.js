/**
 * Created by wangwei on 2017/2/9.
 * voice 组件示例
 */
require(['voice', 'jquery'], function(Voice) {
    var config = {
        el: $("#voice"),
        className: 'voice', //组件外围的className
        swfPath: '/assets/lib/jqueryPlugin/jPlayer/dist/jplayer',
        volume: 1, //音量设置，取值范围0-1，默认0.8 
        autoPaly: 1, //是否自动播放，0手动播放|默认1自动播放
        repeat: false, //是否循环播放 true|false,默认为false
        shortcutKey: true, //键盘快捷键（上下左右空白）可用否,左右：进度条前进后退，上下：音量大小
        url: '/src/tpl/example/component/voice/dream.mp3'
    };
    var voice = new Voice(config);
    // var voice = new Voice($("#voice"), 'dream.mp3');
    var $el = $('.width-all');
    $el.on('click', '.btnStop', function() {
        voice.stop();
    });
    $el.on('click', '.btnPlay', function() {
        voice.play();
    });
    $el.on('click', '.btnPause', function() {
        voice.pause();
        console.log(voice.currentTime)
    });
    $el.on('click', '.btnSetMedia', function() {
        voice.setMedia('../components/voice/xihu.mp3');
    });
    $el.on('click', '.btnVolume', function() {
        voice.volume(0.8);
    });
    voice.on('play', function(e) {
        console.log('开始播放...');
    });
    voice.on('pause', function(e) {
        console.log('暂停播放...');
    });
    voice.on('ended', function(e) {
        console.log('播放完成...');
    });
    voice.on('abort', function(e) {
        console.log('加载失败...');
    });
    voice.on('timeupdate', function(e) {
        console.log('播放中...');
    });
    voice.on('progress', function(e) {
        console.log('加载完成...');
    });
    voice.on('error', function(e) {
        console.log('发生异常...');
    })
});
