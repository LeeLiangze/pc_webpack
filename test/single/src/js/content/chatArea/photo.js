/**
 * 图片
 */
define(['Util',
    '../../../tpl/content/chatArea/photo.tpl',
    '../../index/constants/mediaConstants',
    '../../../assets/css/content/chatArea/photo.css'
], function(Util, tpl, MediaConstants) {

    var _index = null;
    var _options;
    var $el;
    //当前图片的宽和高
    var currentWidth;
    var currentHeight;
    var objClass = function(index, options) {
        _index = index;
        $el = $(tpl);
        this.content = $el;
        this.width = options.width;
        this.height = options.height;
        _options = options;
        currentHeight = this.height;
        currentWidth = this.width;
        $el.find('.chat-img img').attr('src', options.imgPath);
        $el.find('.chat-img img').css('width', this.width);
        $el.find('.chat-img img').css('height', this.height);
        //初始化图片的上边距 设置中心位置
        $el.find('.chat-img img').css('margin-top', 300 - parseInt(this.height) / 2 + 'px');
        this.eventInit();
        this.mousewheel();
        initPics();
        //存储当前this，键盘事件调用
        that = this;
       
    };
    $.extend(objClass.prototype, {
        eventInit: function() {
            $el.on('click', '.zoom-in', $.proxy(this.zoomIn, this));
            $el.on('click', '.zoom-out', $.proxy(this.zoomOut, this));
            $el.on('click', '.next-pic-icon',$.proxy(this.nextPic, this));
            $el.on('click', '.pre-pic-icon',$.proxy(this.prePic, this));
//            ui-dialog-close
            $('.ui-dialog-close').on('click',function(){
            	$('.pre-pic-icon', $el).css('display', 'none');
            	$('.next-pic-icon', $el).css('display', 'none')
            })
            //键盘事件， 图片集键盘翻页
            document.onkeydown=function(event){
            	
            		var e = event || window.event;
                    var keyCode = e.which||e.keyCode;
                    if(keyCode == 37){
                    	if($('.pre-pic-icon', $el).css('display') == 'block'){
                    		 that.prePic();
                    	}
                       
                    }else if(keyCode == 39){
                    	if($('.next-pic-icon', $el).css('display') == 'block'){
                    		 that.nextPic();
                    	}
                       
                    }	
            	
                
            }
        },
        mousewheel: function() {
            var img = $el.find('.chat-img img')[0];

            fnWheel(img, function(down, oEvent) {

                var oldWidth = img.offsetWidth;
                var oldHeight = img.offsetHeight;
                var oldLeft = img.offsetLeft;
                var oldTop = img.offsetTop;
                //比例
                var scaleX = (oEvent.clientX - oldLeft) / oldWidth;
                var scaleY = (oEvent.clientY - oldTop) / oldHeight;

                if (down) {
                    img.style.width = img.offsetWidth * 0.9 + "px";
                    img.style.height = img.offsetHeight * 0.9 + "px";
                } else {
                    img.style.width = img.offsetWidth * 1.1 + "px";
                    img.style.height = img.offsetHeight * 1.1 + "px";
                }
                //设置图片的新宽高
                currentWidth = img.offsetWidth;
                currentHeight = img.offsetHeight;
                img.style.left = oldLeft - scaleX * (currentWidth - oldWidth) + "px";
                img.style.top = oldTop - scaleY * (currentHeight - oldHeight) + "px";
                //动态控制上边距 图片可以始终在中心位置
                $el.find('.chat-img img').css('margin-top', 300 - currentHeight / 2 + 'px');
                if (currentWidth < 50 && currentHeight < 50) {
                    return;
                }
                if (currentWidth > 1500 && currentHeight > 1500) {
                    return;
                }
            });
        },
        /**
         * 图片放大
         * @return {[type]} [description]
         */
        zoomIn: function() {
            currentWidth = currentWidth * 1.1;
            currentHeight = currentHeight * 1.1;
            $el.find('.chat-img img').css('left', 400 - currentWidth / 2 + 'px');
            $el.find('.chat-img img').css('margin-top', 300 - currentHeight / 2 + 'px');
            $el.find('.chat-img img').css('width', currentWidth + 'px');
            $el.find('.chat-img img').css('height', currentHeight + 'px');
            if (currentWidth > 1500 && currentHeight > 1500) {
                return;
            }

        },
        /**
         * 图片缩小
         * @return {[type]} [description]
         */
        zoomOut: function() {
            currentWidth = currentWidth * 0.9;
            currentHeight = currentHeight * 0.9;
            $el.find('.chat-img img').css('left', 400 - currentWidth / 2 + 'px');
            $el.find('.chat-img img').css('margin-top', 300 - currentHeight / 2 + 'px');
            $el.find('.chat-img img').css('width', currentWidth + 'px');
            $el.find('.chat-img img').css('height', currentHeight + 'px');
            if (currentWidth < 50 && currentHeight < 50) {
                return;
            }
        },
        //下一张图片
        nextPic : function(){
            if(nextMsgId == ""){
                _index.popAlert('已经是最后一张图片了');
                return;
            };
            var img = $el.find('.chat-img img');
            var tempImg = new Image();
            if(nextPic != "" && nextPic !=undefined){
                    tempImg.src = nextPic;

            }
            img.remove();
            if(nextPic != ''){
                 var $cImg = $('<img src='+nextPic+'>')
            }

            var that = this;
            $el.find('.chat-img').append($cImg);
            tempImg.onload = function() {
            //setTimeout(function(){
               
                currentWidth = tempImg.width;
                currentHeight = tempImg.height;
                //压缩图片
                while (currentWidth >= 800 || currentHeight >= 600) {
                    currentWidth = currentWidth * 0.9;
                    currentHeight = currentHeight * 0.9;
                }
                $cImg.css('width', currentWidth);
                $cImg.css('height', currentHeight);
                $cImg.css('left', 400 - parseInt(currentWidth) / 2 + 'px');
                $cImg.css('margin-top', 300 - parseInt(currentHeight) / 2 + 'px');
                that.mousewheel();
            //},0);


             };
             currentWidth = tempImg.width;
             currentHeight = tempImg.height;
             //压缩图片
             while (currentWidth >= 800 || currentHeight >= 600) {
                 currentWidth = currentWidth * 0.9;
                 currentHeight = currentHeight * 0.9;
             }
             $cImg.css('width', currentWidth);
             $cImg.css('height', currentHeight);
             $cImg.css('left', 400 - parseInt(currentWidth) / 2 + 'px');
             $cImg.css('margin-top', 300 - parseInt(currentHeight) / 2 + 'px');
             that.mousewheel();
             //设置入参的MsgId
             _options.dataParam.msgId = '';

            _options.dataParam.msgId = nextMsgId;
            //点击请求图片
            Util.ajax.postJson("front/sh/common!execute?uid=pic007",_options.dataParam,function(json,status){
                if(status){
                    //当前图片的下一张图片
                    nextPic = '';
                    nextPic = json.bean.nextPic;
                    //当前图片的下一张图片的MsgId
                    nextMsgId = '';
                    nextMsgId = json.bean.nextMsgId;
                    //当前图片的上一张图片
                    prePic = '';
                    prePic = json.bean.prePic;
                    //当前图的上一张图片的MsgId
                    preMsgId = '';
                    preMsgId = json.bean.preMsgId;
                }else{

                }
            })

        },
        // 上一张图片
        prePic : function(){
            if(preMsgId == "" ){
                _index.popAlert('已经是第一张图片了');
                return;
            };
            var img = $el.find('.chat-img img');
            var tempImg = new Image();

            if(prePic != "" && prePic !=undefined){
                    tempImg.src = prePic;

            }
            img.remove();
            if(prePic != ''){
                 var $cImg = $('<img src='+prePic+'>')
            }


            var that = this;
            $el.find('.chat-img').append($cImg);
             tempImg.onload = function() {
            //setTimeout(function(){
               
                currentWidth = tempImg.width;
                currentHeight = tempImg.height;
                //压缩图片
                while (currentWidth >= 800 || currentHeight >= 600) {
                    currentWidth = currentWidth * 0.9;
                    currentHeight = currentHeight * 0.9;
                }
                $cImg.css('width', currentWidth);
                $cImg.css('height', currentHeight);
                $cImg.css('left', 400 - parseInt(currentWidth) / 2 + 'px');
                $cImg.css('margin-top', 300 - parseInt(currentHeight) / 2 + 'px');
                that.mousewheel();
            //},0);


             };
             currentWidth = tempImg.width;
             currentHeight = tempImg.height;
             //压缩图片
             while (currentWidth >= 800 || currentHeight >= 600) {
                 currentWidth = currentWidth * 0.9;
                 currentHeight = currentHeight * 0.9;
             }
             $cImg.css('width', currentWidth);
             $cImg.css('height', currentHeight);
             $cImg.css('left', 400 - parseInt(currentWidth) / 2 + 'px');
             $cImg.css('margin-top', 300 - parseInt(currentHeight) / 2 + 'px');
             that.mousewheel();
            //设置入参的MsgId
            _options.dataParam.msgId = '';

            _options.dataParam.msgId = preMsgId;
            //点击请求图片
            Util.ajax.postJson("front/sh/common!execute?uid=pic007",_options.dataParam,function(json,status){
                if(status){
                    //当前图片的下一张图片
                    nextPic = '';
                    nextPic = json.bean.nextPic;
                    //当前图片的下一张图片的MsgId
                    nextMsgId = '';
                    nextMsgId = json.bean.nextMsgId;
                    //当前图片的上一张图片
                    prePic = '';
                    prePic = json.bean.prePic;
                    //当前图的上一张图片的MsgId
                    preMsgId = '';
                    preMsgId = json.bean.preMsgId;
                }else{

                }
            })

        }
    });

    /**
     * 获取图片集合
     * @return {[type]} [description]
     */
    function initPics() {
        Util.ajax.postJson("front/sh/common!execute?uid=pic007",_options.dataParam, function(json, status) {
            if (status) {
                //当前图片的下一张图片
                nextPic = '';
                nextPic = json.bean.nextPic;
                //当前图片的下一张图片的MsgId
                nextMsgId = '';
                nextMsgId = json.bean.nextMsgId;
                //当前图片的上一张图片
                prePic = '';
                prePic = json.bean.prePic;
                //当前图的上一张图片的MsgId
                preMsgId = '';
                preMsgId = json.bean.preMsgId;
                //左右按钮显示
                $('.pre-pic-icon', $el).css('display','block');
                $('.next-pic-icon', $el).css('display','block');

            } else {
                _index.popAlert("数据请求失败！");
            }
        });
    }

    /**
     * 鼠标滚轮事件
     */
    function fnWheel(obj, fncc) {
        obj.onmousewheel = fn;
        if (obj.addEventListener) {
            obj.addEventListener('DOMMouseScroll', fn, false);
        }

        function fn(ev) {
            var oEvent = ev || window.event;
            var down = true;

            if (oEvent.detail) {
                down = oEvent.detail > 0
            } else {
                down = oEvent.wheelDelta < 0
            }
            if (fncc) {
                fncc.call(this, down, oEvent);
            }
            if (oEvent.preventDefault) {
                oEvent.preventDefault();
            }
            return false;
        }
    }
    return objClass;
});
