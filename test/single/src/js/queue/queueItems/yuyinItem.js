/*
*	yuyin   by  liqing
*/
define(['Util',
		'../../index/constants/mediaConstants',
		'../../nav/nav',
        '../../../tpl/queue/yuyin.tpl'],function(Util,Constants,Nav,tpl){
	var _index;
	var obj = function(index,options){
		Util.eventTarget.call(this);
		_index = index;	
		this._callStartTime = _index.CallingInfoMap.get("callStartTime");
        this.options = options;
        this.$el = $(this.template(options));
		this.itemArr = [];
        this.eventInit();
		this.receiveMsg(options);
	}
	$.extend(obj.prototype,Util.eventTarget.prototype,{
		//渲染
		template : Util.hdb.compile(tpl),
		//事件初始化
		
        eventInit : function(){
            this.$el.on('click', $.proxy(this.itemClick,this));
            $(this.$el).find('.msgInfo').find('.conversation').find('.view').on('click',$.proxy(this.viewClick,this));
          	$('.qiehuan',this.$el).on('mouseenter',$.proxy(this.picMouseEnter,this));
            $('.qiehuan',this.$el).on('mouseleave',$.proxy(this.picMouseLever,this));
            $('.qiehuan',this.$el).on('click',$.proxy(this.qiehuanClick,this));
            $('body').on('click',$.proxy(this.bodyClick,this))
        },
        //点击事件
        itemClick : function(e){
        	//当前会话被点击时先回到客户信息区Tab页然后return

        		if ($(this.$el).find('.msgInfo').hasClass('current')) {
//        			$('.uiTab .uiTabHead .uiTabItemHead').eq(1).show();
//                    $('.uiTab .uiTabHead .uiTabItemHead').eq(1).click();
        			_index.main.currentPanel.glbTab.switchTab(1);
        			//$('.uiTab .uiTabHead .uiTabItemHead').eq(1).click();
					return;
				}

        	//向当前会话添加visited类名，不设属性，用于辨别是否已点击会话。
        	$(this.$el).find('.msgInfo').addClass('visited')
        	//非当前会话被点击时，带动queue的action
            this.trigger('itemClick', e, this.options,null)
        },
        
        //接收消息
        receiveMsg : function(message){

			this.setPictureBling('reply');
			this.setBackGround('new');
			clearInterval(this.timer);
       		this.startTimer();
       		
        },
        //yuyin计时器
        startTimer:function(type){
        	var serialNo =this.options.serialNo
	          var $text = $(this.$el).find('.conversation').find('.time');

          
            if ('new'==type) {
        		this.setBackGround('new');
			}else{
				clearInterval(this.timer);
			}
            console.log("【" + (new Date).format("MM-dd hh:mm:ss S") + "】 开启语言队列计时器");
            this.ttimerDeal(serialNo, $text);
            this.timer = setInterval($.proxy(function(){
            	
            this.ttimerDeal(serialNo, $text);
                

            },this),500);
	    },
	    ttimerDeal:function(serialNo, $text)
	    {
	    	var dates = new Date();
        	var secText = Math.floor((dates - this._callStartTime)/1000);
        	var ss = Math.floor((dates - this._callStartTime)%1000);
    	    var s = Math.floor(secText % 60);
		    var i_TotalMin = Math.floor(secText/60);
		    var h = Math.floor(i_TotalMin/60);
		    var m = Math.floor(i_TotalMin % 60 + (h*60));
            var mText = m<10?"0"+m:m;
            var sText = s<10?"0"+s:s;
            var ctext = mText+":"+sText;
            //console.log(text)
            $text.text(ctext);
            var sessionStatus=_index.CallingInfoMap.get(serialNo).getSessionStatus();

	        if ('04'==sessionStatus) {
	          	this.setBackGround('normal');
			}
	        if (Constants.QUEUEPECTUREBLING.substring(0,2)==mText && Constants.QUEUEPECTUREBLING.substring(2)==sText) {
				this.setBackGround('normal');
			}
	    },
        //设置背景
        setBackGround:function(type){
	    	var $msgInfo = this.$el.find('.msgInfo');
	    	//console.log($msgInfo)
	    	switch(type){
				//$msgInfo.addClass("select").parents(".panel").siblings().find(".msgInfo").removeClass("select");
	    		//1release.释放：灰  2new.新消息：浅黄 3current.当前会话：蓝 4release_current.已释放+当前：红 5normal.正常：白
	    		case 'release':
	    			$msgInfo.addClass("release");
	    		break;
	    		case 'new':
	    			$msgInfo.addClass("new");
	    		break;
	    		case 'current':
	    			$msgInfo.addClass("current").parents(".panel").siblings().find(".msgInfo").removeClass("current").removeClass("release_current");
	    		break;
	    		case 'release_current':
	    			$msgInfo.addClass("release_current").parents(".panel").siblings().find(".msgInfo").removeClass("current").removeClass("release_current");
	    		break;
	    		case 'normal':
	    			$msgInfo.removeClass("new");
	    		break;
	    	}
	    },
        //设置渠道标志闪烁，1.bling闪烁10秒  2.stop停止闪烁  3.reply新消息来了闪烁延长10秒。 	
        setPictureBling : function(type){
        	var $messageContainer = this.$el.find('.icon');
        	switch(type){
        		case 'bling':
	        		var flag = false;
	        		var count = 0;
	        		this.bling = setInterval($.proxy(function(){
	        			if(count==20 && this.bling){
	        				clearInterval(this.bling);
	        			}else{
	        				if(flag){
	        					$messageContainer.css('visibility','visible');
	        					flag = false ;
	        				}else{
	        					$messageContainer.css('visibility','hidden');
	        					flag = true;
	        				}
	        			}
	        			count++;
	        		},this),500);
        		break;
        		case 'stop':
        			clearInterval(this.bling);
        			clearInterval(this.newbling);
        			$messageContainer.css('visibility','visible');
        		break;
        		case 'reply':
        			clearInterval(this.bling);
        			clearInterval(this.newbling);
        			//console.log(1);
        			var flag = false;
        			var count = 0;
        			this.newbling = setInterval($.proxy(function(){
        				if(count==20 && this.newbling){
        					clearInterval(this.newbling);
        				}else{
        					if(flag){
        						$messageContainer.css('visibility','visible');
        						flag = false;
        					}else{
        						$messageContainer.css('visibility','hidden');
        						flag = true;
        					}
        				}
        				count++;
        				//console.log(flag);
        			},this),500)
        		break;
        	}
        },
        //设置字体颜色
        setColor:function(type){
				var $message = this.$el.find('.message');
				switch(type){
				//1timeout.超时：橘 2normal.其他：黑
					case 'timeout':
						$message.addClass('timeout');
						break;
					case 'normal':
						$message.removeClass('timeout');
						break;
				}
		},
		//设置消息堆积数量
		setMessageCount:function(type){
			switch(type){
			//1new.新消息：+1 2visited.不显示 
			case 'new':
				var text = this.$el.find('.bubble').text();
				
				if (text<9) {
					this.$el.find('.bubble').text(parseInt(text)+1);
					this.$el.find('.bubble').show();
				}else {
					this.$el.find('.bubble').text('···');
					this.$el.find('.bubble').show();
				}
				//设置callinginfo未读消息数量text+1
			break;
			}
		},
		//点击切换视图
		viewClick:function(){
			if($(this.$el).find('.msgInfo').find('.conversation').find('.qiehuan').css('display') == 'block'){
			
				$(this.$el).find('.msgInfo').find('.conversation').find('.qiehuan').css('display','none');
				$(this.$el).find('.msgInfo').find('.conversation').find('.view').find('.pict').css('src','src/assets/img/queueImg/yuyinicon.png');
				return false;
			};
			//重置默认样式
			$('.queue .queueList .conversation').find('.qiehuan').css('display','none');
			//改变被点击的样式
			$(this.$el).find('.msgInfo').find('.conversation').find('.qiehuan').css('display','block');
			//重置默认样式
			$('.queue .queueList .conversation').find('.view').find('.pict').attr('src','src/assets/img/queueImg/yuyinicon.png');
			//改变被点击样式
			$(this.$el).find('.msgInfo').find('.conversation').find('.view').find('.pict').attr('src','src/assets/img/queueImg/yuyinicon01.png');
			
			
			return false;
		},
		//鼠标悬停，改变图片颜色
		picMouseEnter:function(){
		
				$(this.$el).find('.msgInfo').find('.conversation').find('.qiehuan').css('background','url(src/assets/img/queueImg/xuanfu.png)');
			
			
		},
		//鼠标划出，改变图片颜色
		picMouseLever:function(){
			
				$(this.$el).find('.msgInfo').find('.conversation').find('.qiehuan').css('background','url(src/assets/img/queueImg/dianji.png)');
			
		},	
		//鼠标点击提示语切换语音Ａ视图
		qiehuanClick:function(){
			
			//调用切换视图方法 
			_index.nav.changeSelectOut(0);

			if($('body').hasClass('internet-ver')){
				//接续在左侧 跳转语音A视图。
				_index.layoutChange('yyA-ver');
			}else{
				//接续条在头部跳转语音A
				_index.layoutChange('yyA-hor');
			}
//			$('.uiTab .uiTabHead .uiTabItemHead').eq(1).show();
//            $('.uiTab .uiTabHead .uiTabItemHead').eq(1).click();
		},
		//点击页面空白处收起提示语
		bodyClick:function(){
			//提示语收起
			$('.queue .queueList .conversation').find('.qiehuan').css('display','none');
			//重置默认样式
			$('.queue .queueList .conversation').find('.pict').attr('src','src/assets/img/queueImg/yuyinicon.png');
		}
		
        
	})
	
	return obj;
})