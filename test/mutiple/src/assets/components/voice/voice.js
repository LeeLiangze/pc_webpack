define([
    'eventTarget',
    'hdb',
    './voice.tpl',
    './voice.css',
    '../../lib/jqueryPlugin/jPlayer/dist/skin/flat.tony/css/jplayer.flat.tony.css',
    'jquery.jplayer'
], function (EventTarget, hdb, tpl) {

    var template = hdb.compile(tpl);

    var VERSION = '${{version}}';
    var objClass = function () {
        var options = {};
        if (arguments.length == 1) {
            options = arguments[0];
        } else if (arguments.length == 2) {
            options.el = arguments[0];
            options.url = arguments[1];
        } else {
            console.log('参数有误');
        }
        //判断el的异常值：el不存在、为空string、dom原生对象
        if (options.el instanceof jQuery && options.el.length > 0) {
            this.$el = options.el;
        } else if (options.el && isDOM(options.el)) {
            this.$el = $(options.el);
        } else if (typeof(options.el) == 'string' && $(options.el).length > 0) {
            this.$el = $(options.el);
        } else {
            this.$el = $("<div></div>")
        }
        // 判断是否有className
        options.className = (options.className ? options.className : "voice");
        // 判断是否有volume
        options.volume = (options.volume == 0 ? 0 : options.volume || 0.8);
        // 判断是否有autoPaly
        options.autoPaly = (options.autoPaly == 0 ? 0 : options.autoPaly || 1);
        // 判断是否有repeat
        options.repeat = (!options.repeat ? false : options.repeat);
        // 判断是否有shortcutKey
        options.shortcutKey = (!options.shortcutKey ? false : options.shortcutKey);

        this.options = options;
        this.$el.addClass('sn-voice');
        this.$el.addClass(options.className).html(template({}));
        this.$jplayer = $('.jp-jplayer', this.$el);
        setTimeout($.proxy(function () {
            this.$jplayer.jPlayer({
                ready: function () {
                    $(this).jPlayer("setMedia", {
                        mp3: options.url
                    });
                    // 是否自动播放
                    if (options.autoPaly) {
                        $(this).jPlayer('play');
                    }
                    // 是否重复播放
                    if (options.repeat) {
                        $(this).jPlayer('repeat');
                    }
                    // 设置播放音量
                    if (options.volume == 0 || options.volume) {
                        $(this).jPlayer('volume', options.volume);
                    }
                },
                //获取当前时间,单位是秒
                timeupdate: $.proxy(function (e) {
                    this.currentTime = e.jPlayer.status.currentTime
                }, this),
                cssSelectorAncestor: ".sn-voice>.jp-audio",
                swfPath: options.swfPath ? options.swfPath : "lib/jqueryPlugin/jPlayer/dist/jplayer",
                // solution: "flash, html",    // 添加此属性，音频组件在iframe中无法播放，如需添加，请联系前端组件人员
                supplied: "mp3",
                useStateClassSkin: true,
                autoBlur: false,
                smoothPlayBar: true,
                keyEnabled: options.shortcutKey,
                remainingDuration: true,
                toggleDuration: true
            });
        }, this), 1000);

        // 自定义事件        
        EventTarget.call(this);
        // 播放事件
        this.$jplayer.on($.jPlayer.event.play, $.proxy(function (e) {
            play.call(this, e);
            this.trigger('play', e);
        }, this));
        // 暂停事件
        this.$jplayer.on($.jPlayer.event.pause, $.proxy(function (e) {
            pause.call(this, e);
            this.trigger('pause', e);
        }, this));
        // 播放完成事件
        this.$jplayer.on($.jPlayer.event.ended, $.proxy(function (e) {
            ended.call(this, e);
            this.trigger('ended', e);
        }, this));
        // 加载失败事件
        this.$jplayer.on($.jPlayer.event.abort, $.proxy(function (e) {
            abort.call(this, e);
            this.trigger('abort', e);
        }, this));
        // 播放过程中不断出发事件
        this.$jplayer.on($.jPlayer.event.timeupdate, $.proxy(function (e) {
            timeupdate.call(this, e);
            this.trigger('timeupdate', e);
        }, this));
        // 加载完成时间
        this.$jplayer.on($.jPlayer.event.progress, $.proxy(function (e) {
            progress.call(this, e);
            this.trigger('progress', e);
        }, this));
        // 发生异常事件
        this.$jplayer.on($.jPlayer.event.error, $.proxy(function (e) {
            error.call(this, e);
            this.trigger('error', e);
        }, this));
        // 为播放器绑定键盘事件
        var me = this;
        if (options.shortcutKey) {
            $(document).keyup(function (e) {
                switch (e.keyCode) { //判断键盘号
                    case 39:
                        me.play(_currentTime + 3);
                        break; // 快进
                    case 37:
                        me.play(_currentTime - 3);
                        break; // 快退
                    case 38:
                        me.volume((me.options.volume + 0.1));
                        break; // 音量增加
                    case 40:
                        me.volume((me.options.volume - 0.1));
                        break; // 音量降低
                }
            })
        }
        // var FlatTonyBackgroundForJplayer = '';
        var selector = '.jp-play, .jp-play:focus, .jp-stop, .jp-stop:focus, .jp-previous, .jp-previous:focus';
        selector += ', .jp-next, .jp-next:focus, .jp-progress, .jp-seek-bar, .jp-play-bar, .jp-seeking-bg';
        selector += ', .jp-mute, .jp-mute:focus, .jp-volume-max, .jp-volume-max:focus, .jp-volume-bar';
        selector += ', .jp-volume-bar-value, .jp-space';
        // selector ++ ', ., ., ., ., ., ., ., ., ., ., ., ., ., ., ., .';
        $(selector, this.$el).addClass('FlatTonyBackgroundForJplayer');

    };
    $.extend(objClass.prototype, EventTarget.prototype, {
        version: VERSION,
        setMedia: function (url) {
            this.$jplayer.jPlayer("setMedia", {
                mp3: url
            });
        },
        play: function (time) {
            this.$jplayer.jPlayer("play", time && time);
        },
        stop: function () {
            this.$jplayer.jPlayer("stop");
        },
        pause: function (time) {
            this.$jplayer.jPlayer("pause");
        },
        volume: function (number) {
            if (number > 1) {
                this.options.volume = 1;
            } else if (number < 0) {
                this.options.volume = 0;
            } else {
                this.options.volume = number;
            }
            this.$jplayer.jPlayer("volume", this.options.volume);
        }
    });
    // 注册事件
    //音频开始播放时触发
    var play = function (event) {
    };
    //音频暂停时触发
    var pause = function (event) {
    };
    //音频播放完成时触发
    var ended = function (event) {
    };
    //音频加载失败时触发
    var abort = function (event) {
    };
    //音频在播放的过程中，不断触发
    var _currentTime;
    var timeupdate = function (event) {
        _currentTime = parseInt(event.jPlayer.status.currentTime);
    };
    //当音频文件加载完成时触发
    var progress = function (event) {
    };
    //发生异常时触发
    var error = function (event) {
    };
    // 判断是否为原生DOM
    var isDOM = function (obj) {
        return obj.tagName ? true : false
    };
    //解决ie下console.log()报错问题
    window.console = window.console || (function () {
            var c = {};
            c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function () {
            };
            return c;
        })();
    return objClass;
});
