/**
 * [Loading加载组件]
 * @param  {[type]} $           [description]
 * @param  {[type]} eventTarget [description]
 * @param  {[type]} hdb         [description]
 * @param  {[type]} tpl         [description]
 * @param  {String} lineTmpl    [description]
 * @return {[type]}             [description]
 */
define([
    'jquery',
    'eventTarget',
    'hdb',
    './loading.tpl',
    './loadingLine.tpl',
    './loading.css',
], function ($, eventTarget, hdb, tpl, lineTmpl) {
    var VERSION = '${{version}}', // 版本号
        zIndex = 10000,   // 组件容器，z-index累计值（默认10001开始）
        uiContentAnimSpeed = 280, // 组件内容，动画幅长
        uiBackdropAnimSpeed = 280, // 组件背景遮罩，动画幅长
        init = null;
    var objClass = function (options) {
        var _$uiBox = null,      // 组件容器
            _$uiContent = null,  // 组件内容
            _$uiBackdrop = null, // 组件背景遮罩
            _status = 0,         // 组件状态，0:隐藏（默认）｜1:显示
            _loaded = false     // loadingLine线条方式，加载状态（true:100%加载完成）
        // 容器
        this.$el = null,
            // 参数
            this.options = {
                el: 'body', //组件要绑定的容器，默认为body（此项可不填或留空）
                className: '',  //组件外围的className
                position: 'center', //提示信息位置，顶部top|默认center中央
                width: 300,  //提示信息框宽度，默认300，单位像素
                height: 'auto',  //提示信息框高度，默认auto，单位像素
                mask: 1,  //是否显示遮罩， 0不显示|默认1显示
                animate: 1, //是否显示动画效果， 0不显示|默认1显示
                mode: 'layer',  //展示方式 loadingLine线条方式|默认layer弹层方式
                text: '加载中...', //提示文字，默认 加载中...
                icon: 'dotCycle',  //文字前面的gif动画，挑选几个供用户选择，如 默认dotCycle|cmcc移动图标|cmccLarge大的移动图标
                content: ''  //显示信息，，默认为 图片(icon)+加载中(text)...
            },

            /* 初始化创建组件 */
            init = function (options) {
                // 设置传入参数
                $.extend(this.options, options);
                this.$el = $(this.options.el);

                // 扩展事件/属性
                $.extend(objClass.prototype, eventTarget.prototype, {
                    version: VERSION
                });
                eventTarget.call(this);

                // 展示方式（loadingLine线条方式）
                if (this.options.mode === 'loadingLine') {
                    loadingLine.call(this);
                    return;
                }

                // 内容处理（如Loading.options.centent为空，默认拼装options.icon + options.text属性），并渲染组件／保存dom对象
                if (!/\S/.test(this.options.content)) {
                    this.options.content = '<i class="ui-loading-icon ui-loading-icon-' + this.options.icon + '"></i>' + this.options.text;
                }
                render.call(this);

                // 容器定位处理
                parentPosition.call(this);

                // 显示组件
                zIndex++;
                this.show();
            },

            /**
             * [show 显示组件]
             * @param  {[type]}   el       [将当前组件加载到对应的el dom对象中]
             * @param  {Function} callback [description]
             * @return {[type]}            [description]
             */
            this.show = function (el, callback) {
                // 展示方式（loadingLine线条方式）
                if (this.options.mode === 'loadingLine') {
                    loadingLine.call(this);
                    return;
                }

                // 将当前组件加载到对应的el dom对象中
                var _$el = $(el);
                if (_$el.length >= 1) {
                    // 容器对象重新绑定
                    this.$el = _$el;
                    // 容器定位处理
                    parentPosition.call(this);
                    _$el.append(_$uiBox);
                    return;
                }

                // 正常流程
                if (_status === 1) {
                    return false;
                }
                if (this.options.animate === 0) { // 没有动画
                    // 组件容器
                    _$uiBox.css({
                        display: 'block',
                        zIndex: zIndex
                    });
                    // 组件内容
                    _$uiContent.css({
                        width: this.options.width,
                        height: this.options.height
                    });
                    if (this.options.position === 'center') { // 居中（默认）
                        _$uiContent.css({
                            marginTop: ((this.$el.outerHeight() - _$uiContent.outerHeight()) / 2) + 'px'
                        });
                    }
                    // 组件背景遮罩（显示）
                    if (this.options.mask === 1) {
                        _$uiBackdrop.css({
                            display: 'block'
                        });
                    }
                    _status = 1;
                    if ($.isFunction(callback)) {
                        callback();
                    }
                } else {
                    animateIn.call(this, function () {
                        _status = 1;
                        if ($.isFunction(callback)) {
                            callback();
                        }
                    });
                }
            };

        /* 隐藏组件 */
        this.hide = function (callback) {
            // 展示方式（loadingLine线条方式）
            if (this.options.mode === 'loadingLine') {
                loadingLineLoaded.call(this);
                return;
            }

            // 正常流程
            if (_status === 0) {
                return false;
            }
            if (this.options.animate === 0) { // 没有动画
                _$uiBox.css({
                    display: 'none'
                });
                _status = 0;
                if ($.isFunction(callback)) {
                    callback();
                }
            } else {
                animateOut.call(this, function () {
                    _status = 0;
                    if ($.isFunction(callback)) {
                        callback();
                    }
                });
            }
        };

        /* 关闭（移除）组件 */
        this.destroy = function (callback) {
            _$uiBox.remove();
            if ($.isFunction(callback)) {
                callback();
            } else {
                this.trigger('destroy');
            }
        };

        // 通过构造对象，默认执行初始化
        init.call(this, options);
        // init(options);

        /* 组件容器定位处理 */
        function parentPosition() {
            var elPosition = $.trim(this.$el.css('position').toLocaleLowerCase());
            if (elPosition !== 'relative' && elPosition !== 'absolute' && elPosition !== 'fixed') {
                this.$el.css('position', 'relative');
            }
        }

        /* 组件元素渲染／保存dom对象 */
        function render() {
            // 展示方式（loadingLine线条方式）
            if (this.options.mode === 'loadingLine') {
                var template = hdb.compile(lineTmpl);
                _$uiBox = $(template(this.options));
                _$uiContent = $('.ui-loading-progress-content', _$uiBox);
                $('body').append(_$uiBox);
                return;
            }

            // 正常流程
            var template = hdb.compile(tpl);
            _$uiBox = $(template(this.options));
            _$uiContent = $('.ui-loading-content', _$uiBox);
            _$uiBackdrop = $('.ui-loading-backdrop', _$uiBox);
            this.$el.append(_$uiBox);
        };
        /*
         * 组件入场效果
         * 入场原理：
         *   1. 获取并保存对象未开始动画前属性值
         *   2. 设置动画入场属性值
         *   3. 设置动画完成属性值 === 对象未开始动画前属性值
         */
        function animateIn(callback) {
            var animParams = null; // 动画属性
            var uiContentAnimFlag = false, // 组件内容，动画完成状态
                uiBackdropAnimFlag = false; // 组件背景遮罩，动画完成状态
            // 组件容器
            _$uiBox.css({
                display: 'block',
                zIndex: zIndex
            });
            // 组件内容
            if (this.options.position === 'center') { // 居中（默认）
                var realHeight = !Number(this.options.height) ? _$uiContent.height() : this.options.height; // 真实高度
                animParams = {
                    width: this.options.width,
                    height: realHeight,
                    marginTop: 0,
                    opacity: _$uiContent.css('opacity')
                };
                _$uiContent.css({
                    width: 0,
                    height: 0,
                    marginTop: ((this.$el.height() - _$uiContent.outerHeight() - realHeight) / 2) + 'px',
                    opacity: 0
                });
                animParams.marginTop = ((this.$el.height() - _$uiContent.outerHeight() - realHeight) / 2) + 'px';
                _$uiContent.stop(true, false).animate(animParams, uiContentAnimSpeed, function () {
                    uiContentAnimFlag = true;
                    if (uiContentAnimFlag && uiBackdropAnimFlag) {
                        _animCompleted();
                    }
                });
            } else {
                animParams = {
                    marginTop: _$uiContent.css('marginTop'),
                    opacity: _$uiContent.css('opacity')
                };
                _$uiContent.css({
                    width: this.options.width,
                    height: this.options.height,
                    marginTop: 0,
                    opacity: 0
                });
                _$uiContent.stop(true, false).animate(animParams, uiContentAnimSpeed, function () {
                    uiContentAnimFlag = true;
                    if (uiContentAnimFlag && uiBackdropAnimFlag) {
                        _animCompleted();
                    }
                });
            }
            // 组件背景遮罩（显示）
            if (this.options.mask === 1) {
                animParams = {
                    opacity: _$uiBackdrop.css('opacity')
                };
                _$uiBackdrop.css({
                    display: 'block',
                    opacity: 0
                });
                _$uiBackdrop.stop(true, false).animate(animParams, uiBackdropAnimSpeed, function () {
                    uiBackdropAnimFlag = true;
                    if (uiContentAnimFlag && uiBackdropAnimFlag) {
                        _animCompleted();
                    }
                });
            }
            // 动画完成后操作
            var _animCompleted = function () {
                if ($.isFunction(callback)) {
                    callback();
                }
            }
        }

        /*
         * 组件退场效果
         * 退场原理：
         *   1. 获取并保存对象未开始动画前属性值
         *   2. 设置动画退场属性值
         *   3. 设置动画完成属性值 === 对象最初属性值
         */
        function animateOut(callback) {
            var self = this;
            var uiContentCurrParams = null, // 组件内容，动画之前属性值
                uiBackdropCurrParams = null; // 组件背景遮罩，动画之前属性值
            var uiContentAnimFlag = false, // 组件内容，动画完成状态
                uiBackdropAnimFlag = false; // 组件背景遮罩，动画完成状态
            // 组件内容
            if (this.options.position === 'center') { // 居中（默认）
                uiContentCurrParams = {
                    width: _$uiContent.width(),
                    height: _$uiContent.height(),
                    opacity: _$uiContent.css('opacity')
                };
                _$uiContent.animate({
                    width: 0,
                    height: 0,
                    opacity: 0
                }, uiContentAnimSpeed, function () {
                    $(this).css(uiContentCurrParams);
                    uiContentAnimFlag = true;
                    if (uiContentAnimFlag && uiBackdropAnimFlag) {
                        _animCompleted();
                    }
                });
            } else {
                uiContentCurrParams = {
                    marginTop: _$uiContent.css('marginTop'),
                    opacity: _$uiContent.css('opacity')
                };
                _$uiContent.animate({
                    marginTop: 0,
                    opacity: 0
                }, uiContentAnimSpeed, function () {
                    $(this).css(uiContentCurrParams);
                    uiContentAnimFlag = true;
                    if (uiContentAnimFlag && uiBackdropAnimFlag) {
                        _animCompleted();
                    }
                });
            }
            // 组件背景遮罩（显示）
            if (this.options.mask === 1) {
                uiBackdropCurrParams = {
                    display: _$uiBackdrop.css('display'),
                    opacity: _$uiBackdrop.css('opacity')
                };
                _$uiBackdrop.animate({
                    display: 'none',
                    opacity: 0
                }, uiBackdropAnimSpeed, function () {
                    $(this).css(uiBackdropCurrParams);
                    uiBackdropAnimFlag = true;
                    if (uiContentAnimFlag && uiBackdropAnimFlag) {
                        _animCompleted();
                    }
                });
            }
            // 动画完成后操作
            var _animCompleted = function () {
                _$uiBox.css({
                    display: 'none'
                });
                if ($.isFunction(callback)) {
                    callback();
                }
            }
        }

        /* 展示方式（loadingLine线条方式） */
        function loadingLine() {
            // 页面中只允许存在一个对象
            if ($('body > .ui-loading-progress').length >= 1) {
                $('body > .ui-loading-progress').remove();
            }

            // 渲染
            render.call(this);

            // 初始进度，0%
            var progress = 0;
            _$uiContent.css('width', '0%');
            window.loaded = false;

            init();

            // 生成随机数
            function random(min, max) {
                return Math.floor(Math.random() * (max - min + 1) + min);
            }

            // 开始进度
            function init() {
                setTimeout(function () {
                    // 100%加载完成
                    if (_loaded) {
                        progress = 100;
                        loadingLineLoaded();
                        return;
                    }
                    progress += random(1, 15);
                    if (progress >= 98) { // 随机进度，不能超过80%
                        progress = 98;
                    }
                    _$uiContent.animate({'width': progress + '%'}, function () {
                        if (progress < 98) {
                            init();
                        }
                    });
                }, random(1, 200));
            }
        }

        /* 展示方式（loadingLine线条方式）100%加载完成 */
        function loadingLineLoaded() {
            _loaded = true;
            _$uiContent.stop(true, true).animate({'width': '100%'}, 'fast', function () {
                $(this).css('width', '100%');
            });
        }
    };

    return objClass;
});