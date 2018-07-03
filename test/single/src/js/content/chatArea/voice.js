/*
    录音
    张云天
 */
define(['Util',
    '../../index/constants/mediaConstants',
    'jquery.jplayer'
], function(Util, MediaConstants) {
    var _index;
    var $elTemp;
    var $jplayer;
    var $img;
    var _data;
    var objClass = function(index, $el, data) {
        this.$el = $el;
        $elTemp = $el;
        _index = index;
        this.data = data;
        _data = data;
        this.eventInit();
    }

    $.extend(objClass.prototype, Util.eventTarget.prototype, {
        eventInit: function() {
            //每个播放器都有一个id，防止播放混淆
            var timesTemp = _data.msgId;
            var voiceFlag = false;
            if(_data.voiceFlag){
                voiceFlag = _data.voiceFlag;
                timesTemp = timesTemp + '1';
            }
            var idTemp = "jquery_jplayer_" + timesTemp;
            var imgTemp = "jp_poster_" + timesTemp;
            //默认右边语音视图
            var movePicture = 'src/assets/img/content/chatArea/right_record_move.gif';
            var staticPicture = 'src/assets/img/content/chatArea/right_record_static.png';
            if(this.data.senderFlag==MediaConstants.SENDER_FLAG_CUST){
                movePicture = 'src/assets/img/content/chatArea/left_record_move.gif';
                staticPicture = 'src/assets/img/content/chatArea/left_record_static.png';
            }

            //播放标志，初始状态为false
            var isPlaying = false;
            //新建一个image
            var image = new Image();
            image.id = imgTemp;
            $jplayer = this.$el.find('.chat-content-record');
            $jplayer.attr('id', idTemp);

            $('#' + idTemp).jPlayer({
                swfPath: "src/assets/lib/jqueryPlugin/jPlayer/dist/jplayer/jquery.jplayer.swf",
                solution: "flash, html",
                supplied: "mp3",
                wmode: "window",
                globalVolume: true,
                useStateClassSkin: true,
                autoBlur: false,
                smoothPlayBar: true,
                keyEnabled: true,
                cssSelectorAncestor: '#'+idTemp+'>.jp-audio',
                //加载jplayer
                ready: function() {
                    $('#' + idTemp).jPlayer("setMedia", {
                        mp3: _data.url
                    });
                    //设置录音条的长度
                    var len = 60 + _data.time * 10;
                    if(len > 300){
                        len = 300;
                    }
                    $('#' + idTemp).css('width', len+'px');
                    $('#' + idTemp).css('height', '40px');
                    $('#' + idTemp).append(image);

                    //设置播放动画的尺寸
                    $('#' + imgTemp).css('width', '22px');
                    $('#' + imgTemp).css('height', '22px');
                    $('#' + imgTemp).attr('src', staticPicture);

                    $('#' + idTemp).click($.proxy(function() {
                        if (isPlaying) {
                            $('#' + idTemp).jPlayer("stop");
                        } else {
                            $('#' + idTemp).jPlayer("play", 0);
                        }
                    }, this));
                },
                //播放
                play: function() {
                    //暂停其他播放
                    // $jplayer.jplayer("pauseOthers");
                    $(this).jPlayer("pauseOthers", 0);
                    $('#' + imgTemp).attr('src', movePicture);
                    var $temp = $('#' + imgTemp).closest(".chat-left-item");
                    $temp.find('.play-flag').remove();
                    isPlaying = true;
                },
                //播放完成
                ended: function() {
                    isPlaying = false;
                    $('#' + imgTemp).attr("src", staticPicture);
                },
                //暂停
                pause: function() {
                    isPlaying = false;
                    $('#' + imgTemp).attr("src", staticPicture);
                },
                flashreset: function() {
                    $('#' + idTemp);
                    // debugger;
                },
            });
        }

    });

    return objClass;
})
