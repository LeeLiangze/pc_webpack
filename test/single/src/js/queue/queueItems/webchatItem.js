/*
*	webchat   by  liqing
*/
define(['Util',
		'../../index/constants/mediaConstants',
        '../../../tpl/queue/webchat.tpl'],function(Util,Constants,tpl){
	var _index;
	var obj = function(index,options){
		Util.eventTarget.call(this);
		
		_index = index;	
		
        this.options = options;
        
        this.$el = $(this.template(options));
        
		this.itemArr = [];
		
        this.eventInit();
        
		this.receiveMsg(options);
        //是否有提示语
        this.hasTip = false;
	    //记忆滚动高度
	    this.scroll = '';
	    //默认会话都有一次提示请等待的机会
	    this.hasWaitMsg = true;
	    //第二次30秒切换提示语开关
	    this.changeTipFlag = true;
	    this.changeTip = false;
	}
	$.extend(obj.prototype,Util.eventTarget.prototype,{
		//渲染
		template : Util.hdb.compile(tpl),
		//事件初始化
		eventInit : function(){
            this.$el.on('click', $.proxy(this.itemClick,this));
        },
        //点击事件
        itemClick : function(e){
        	//当前会话被点击时先回到交谈区Tab页然后return
        		if ($(this.$el).find('.msgInfo').hasClass('current')) {
        			//点击回到交谈区
//        			$('.uiTab .uiTabHead .uiTabItemHead').eq(0).click();
//        			$('.uiTab .uiTabBody .uiTabItemBody').eq(0).show();
        			_index.main.currentPanel.glbTab.switchTab(0);
					return;
				}
        	//向当前会话添加visited类名，不设属性，用于辨别是否已点击会话。
        	$(this.$el).find('.msgInfo').addClass('visited')
        	//非当前会话被点击时，带动queue的action
            this.trigger('itemClick', e, this.options,null)
        },
        //接收消息
        receiveMsg : function(message){
        	//判断会话是否为当前会话
			if($(this.$el).find('.msgInfo').hasClass('current')){
				//清理计时器
				clearInterval(this.timer);
				//开始计时
				this.startTimer();
				//如果存在超时颜色清除超时颜色计时器
				if(this.hasOwnProperty('waring')){
					clearInterval(this.waring);
				};
				//设置字体颜色
				this.setColor('normal');

			}else{
				 //设置渠道图标闪烁
				 this.setPictureBling('reply');
				 //设置消息堆积量
				 this.setMessageCount(message,'new');
				 //清除计时器
				 clearInterval(this.timer);
				 //开始计时
				 this.startTimer();
				 //如果存在超时颜色清除超时颜色计时器
				 if(this.hasOwnProperty('waring')){
					clearInterval(this.waring);
				 };
				 //设置字体颜色
				 this.setColor('normal');
				 //判断会话是否被点击过
				 if($(this.$el).find('.msgInfo').hasClass('visited')){
					//被点击过不设置背景色。 
				 }else{
					 //没有别点击则为新会话，设置背景色。
					this.setBackGround('new'); 
				 }
			};
        },
        //webchat计时器
        startTimer:function(type){
        	var serialNo =this.options.serialNo
            this.odd = new Date(0,0,0,0,0,0);
            var $text = $(this.$el).find('.conversation').find('.time');
         	var WaringTime=parseInt(_index.queue.alarm.WEBCHAT_ALARMTIME);
            WaringTime=WaringTime<10?"0"+WaringTime:WaringTime;
            var releaseWaring=parseInt(_index.queue.alarm.WEBCHAT_RELEASETIME)-1;
            var releaseWaring=releaseWaring<10?"0"+releaseWaring:releaseWaring;
         	var releaseTime=parseInt(_index.queue.alarm.WEBCHAT_RELEASETIME);
            var releaseTime=releaseTime<10?"0"+releaseTime:releaseTime;
          	var agentAlarmTime = parseInt(_index.queue.alarm.WEBCHAT_AGENT_ALARMTIME);
          	if ('new'==type) {
        		this.setBackGround('new');
			}else{
				clearInterval(this.timer);
			}
            this.timer = setInterval($.proxy(function(){
                var s = this.odd.getSeconds();
                this.odd.setSeconds(s+1);
                var m = this.odd.getMinutes();
                s = this.odd.getSeconds();
                var h = this.odd.getHours();
                var hText = h<10?"0"+h:h;
                var mText = m<10?"0"+m:m;
                var sText = s<10?"0"+s:s;
                var text = mText+":"+sText;
                var ctext = hText+":"+mText+":"+sText;
                $text.text(text);
                var sessionStatus=_index.CallingInfoMap.get(serialNo).getSessionStatus();
		        if ('04'==sessionStatus) {
		          	this.setBackGround('normal');
				}
		        if (Constants.QUEUEPECTUREBLING.substring(0,2)==mText && Constants.QUEUEPECTUREBLING.substring(2)==sText) {
					this.setBackGround('normal');
				}
		        //稍后提示语
		        if ('00'==mText && agentAlarmTime==sText) {
					if(sessionStatus!='04' && this.hasWaitMsg && !this.hasTip) {
						var data={
			      				serialNo:serialNo,
			      				channelID:this.options.channelID,
			            		content:_index.queue.alarm.WEBCHAT_AGENT_ALARMMSG.substr(0,17),
			            		contentTxt:_index.queue.alarm.WEBCHAT_AGENT_ALARMMSG.substr(0,17),
			            		msgType:Constants.MSGTYPE_TEXT,
			            		mediaID:Constants.MEDIA_ONLINE_SERVICE,
			            		type:'noReturn',
			            		senderFlag:Constants.SENDER_FLAG_SYSTEM,
			            		originalCreateTime:_index.utilJS.getCurrentTime()
			                }
							if (_index.contentCommon.sendMsg(data)) {
								this.hasWaitMsg = false;
							}
						return;
					}
					if(sessionStatus!='04' && this.changeTipFlag && !this.hasWaitMsg && !this.hasTip && this.changeTip){
						var data={
	      					serialNo:serialNo,
	      					channelID:this.options.channelID,
	            			content:_index.queue.alarm.WEBCHAT_AGENT_ALARMMSG.substr(19),
	            			contentTxt:_index.queue.alarm.WEBCHAT_AGENT_ALARMMSG.substr(19),
	            			msgType:Constants.MSGTYPE_TEXT,
	            			mediaID:Constants.MEDIA_ONLINE_SERVICE,
	            			type:'noReturn',
	  		            	senderFlag:Constants.SENDER_FLAG_SYSTEM,
	            			originalCreateTime:_index.utilJS.getCurrentTime()
	                	}
							if(_index.contentCommon.sendMsg(data)){
								this.changeTipFlag = false;
							}
						
					}
						
				}
			
		        //超时提示语
		        if (WaringTime==mText && '00'==sText) {
					//判断最后一句话是由谁发起的，如果是坐席，则3分钟有提示语
					if (sessionStatus!='04' && this.hasTip) {
		          		var data={
		      				serialNo:serialNo,
		      				channelID:this.options.channelID,
		            		content:_index.queue.alarm.WEBCHAT_ALARMMSG,
		            		contentTxt:_index.queue.alarm.WEBCHAT_ALARMMSG,
		            		msgType:Constants.MSGTYPE_TEXT,
		            		mediaID:Constants.MEDIA_ONLINE_SERVICE,
		            		type:'noReturn',
		            		//提示语和451消息都有可能放在消息容器中，座席发送的不可能进入消息容器
		            		senderFlag:Constants.SENDER_FLAG_SYSTEM,
		            		originalCreateTime:_index.utilJS.getCurrentTime()
		            	}
		          		_index.contentCommon.sendMsg(data);
					}
				}
		        if (releaseWaring==mText && '50'==sText) {
					//超长警告
		          	if (sessionStatus!='04' && !this.hasTip) {
		          		var n=false;
		                this.waring=setInterval($.proxy(function(){
							if (n) {
								this.setColor('timeout');
	                			n=false;
							}else{
								this.setColor('normal');
								n=true;
							}
	                	},this),500);
		          	}
				}
		        if (releaseTime==mText && '00'==sText && this.hasTip) {
		          	if (sessionStatus!='04') {
		          		var data={
		      				serialNo:serialNo,
		      				channelID:this.options.channelID,
		            		content:_index.queue.alarm.WEBCHAT_RELEASEMSG,
		            		contentTxt:_index.queue.alarm.WEBCHAT_RELEASEMSG,
		            		msgType:Constants.MSGTYPE_TEXT,
		            		mediaID:Constants.MEDIA_ONLINE_SERVICE,
		            		type:'noReturn',
		            		//提示语和451消息都有可能放在消息容器中，座席发送的不可能进入消息容器
		            		senderFlag:Constants.SENDER_FLAG_SYSTEM,
		            		originalCreateTime:_index.utilJS.getCurrentTime()
		                }
		          		_index.contentCommon.sendMsg(data);
					}
				}
		        //设置超长颜色,超时释放
		        if (releaseTime==mText && '05'==sText) {
		          	if (sessionStatus!='04' && !this.hasTip) {
		          		if (this.waring) {
		                	clearInterval(this.waring);
						}
						this.setColor('timeout');
						
		          	}
		        	//调用释放接口
		            if (sessionStatus!='04' && this.hasTip) {
		                _index.queue.hangUpByStaff(serialNo);
					}  	
				}
            },this),1000);
	    },
        //设置背景
        setBackGround:function(type){
	    	var $msgInfo = this.$el.find('.msgInfo');
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
		setMessageCount:function(message,type){
			
			if(message.senderFlag==Constants.SENDER_FLAG_CUST){
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
			}	

		}
        
	})
	return obj;
})