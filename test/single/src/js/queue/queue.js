/*
*	客户队列   by  李青
*/
define(['Util',
        '../index/constants/mediaConstants',
        './queueItems/webchatItem',
        './queueItems/weixinItem',
        './queueItems/weiboItem',
        './queueItems/yuyinItem',
        '../content/editArea/editArea',
        '../clientInfo/timerWait',
        '../../tpl/queue/queue.tpl',
        '../clientInfo/clientInfo',
        '../../assets/css/queue/queue.css',
        '../../assets/css/queue/QueueItem.css',],function(Util,Constants,WebchatItem,WeixinItem,WeiboItem,YuyinItem,EditArea,timerWait,queueTpl,ClientInfo){
	var _index;
	var arr = ['passWordValidateBtn','startMuteBtn','endCallBtn','callHoldBtn','sendMessageBtn','transferBtn'];
	var alarm={
			//提示时间
    		WEBCHAT_ALARMTIME:'2',
			WEIBO_ALARMTIME:'2',
			WEIXIN_ALARMTIME:'2',
			//提示内容
			WEBCHAT_ALARMMSG:'您好，您已2分钟无任何操作，如再不咨询问题，客服MM 将在1分钟后离您而去哦！',
			WEIBO_ALARMMSG:'您好，您已2分钟无任何操作，如再不咨询问题，客服MM 将在1分钟后离您而去哦！',
			WEIXIN_ALARMMSG:'您好，您已2分钟无任何操作，如再不咨询问题，客服MM 将在1分钟后离您而去哦！',
			//释放提示时间
			WEBCHAT_RELEASETIME:'3',
			WEIBO_RELEASETIME:'3',
			WEIXIN_RELEASETIME:'3',
			//释放提示内容
			WEBCHAT_RELEASEMSG:'非常抱歉，因为3分钟内未接到您任何消息，系统将自动结束会话，如仍需帮助，您可再次联系我们，感谢您的支持，祝您生活愉快！',
			WEIBO_RELEASEMSG:'非常抱歉，因为3分钟内未接到您任何消息，系统将自动结束会话，如仍需帮助，您可再次联系我们，感谢您的支持，祝您生活愉快！',
			WEIXIN_RELEASEMSG:'非常抱歉，因为3分钟内未接到您任何消息，系统将自动结束会话，如仍需帮助，您可再次联系我们，感谢您的支持，祝您生活愉快！',
			//座席忙提示时间
			WEBCHAT_AGENT_ALARMTIME:'30',
			WEIBO_AGENT_ALARMTIME:'30',
			WEIXIN_AGENT_ALARMTIME:'30',
			//座席忙提示内容
			WEBCHAT_AGENT_ALARMMSG:'咨询客户较多，请您稍等…',
			WEIBO_AGENT_ALARMMSG:'咨询客户较多，请您稍等…',
			WEIXIN_AGENT_ALARMMSG:'咨询客户较多，请您稍等…',
    };
	var queueClass = function(options){	
		Util.eventTarget.call(this);
        this.options = options; 
   		_index = options;
   		this.$el = $(queueTpl);//渲染
   		this.eventInit.call(this);//事件初始化
   		this.list = {};//收集会话item
   		this.currentQueueData=null;
   		alarm = this.alarmInit(alarm);
   		this.alarm = alarm;
   		this.browserName = this.myBrowser();//判断浏览器
   		this.conversationTimers = null;//新建对象存储队列区头部计时器
   		this.originalCreateTime = {};//新建一个空对象，用于存储每一个会话的第一条消息的时间。
   		this.queueChangeTopFlag = false;//接续栏位于头部队列区收起展示开关
   		this.queueChangeLeftFlag = false//接续栏位于左侧队列区收起展示开关
   		this.queueCleanFlag = false;//清理离线状态判断
   		window.isFocus = true;//浏览器焦点
		window.onfocus = function() {
			window.isFocus = true;//系统有焦点 isFocus 值为true
		};
		window.onblur = function() {
			window.isFocus = false;//系统无焦点值为false
		};
		this.showChartWrapInFlag = false;//判断聊天区是否显示，聊天区显示则百度编辑器显示，阻止百度编辑器报错
		_clientInfo = new ClientInfo(_index);// 客户信息
		this.showName = null;
		this.queueReceiveMessageFlag = false;
		this.customerInformationFlag = true;
		this.noListClick = false;

    };
    $.extend(queueClass.prototype,Util.eventTarget.prototype,{
    	template:Util.hdb.compile(queueTpl),//模板处理
		itemClick : function(e,options,index,timeObj){//点击事件 由queueItem调用，传入当前item的options
			if (this.currentQueueData){//点击移除浅黄，浅黄为新进会话
				var item = this.list[this.currentQueueData.serialNo];
				if (item) {
					item.setBackGround('normal');
				}
			}
	        this.currentQueueData = options;//设置当前会话
	        _index.contentCommon.cloneCurrentQueueData = _index.contentCommon.cloneObject(this.currentQueueData);
	        if(options.mediaTypeId==Constants.VOICE_TYPE){
	        	_index.CallingInfoMap.setAudioActiveserialNo(options.serialNo);
	        	_index.CallingInfoMap.setActiveSerialNo(options.serialNo); //callinginfo设置当前活动会话
	        }else{
	        	_index.CallingInfoMap.setActiveSerialNo(options.serialNo); //callinginfo设置当前活动会话
	        }
	  	        
	        this.showName = options.phoneNum; //客户信息
	        if(options.phoneNum == ""){
	        	this.showName = options.nickName;
	        }
	        var CalloutCallId=_index.ctiInit.AudioCallIds.getCalloutCallId();
            var AudioLastCallId=_index.ctiInit.AudioCallIds.getAudioLastCallId();
			//当前如果是外呼，且是自动触发的itemClick事件，则不查询客户信息
            if(!(CalloutCallId&&AudioLastCallId&&(JSON.stringify(CalloutCallId)==JSON.stringify(AudioLastCallId)) && this.noListClick)){
            	_index.clientInfo.initCustInfo(this.showName);
            }
	        $('.add_custTag').attr('accountId',_index.CallingInfoMap.get(options.serialNo).getCallerNo());
	        $('.add_custTag').attr('mediaTypeId',options.mediaTypeId);
	        var currentItem=this.list[options.serialNo];
        	var SerialNo = _index.CallingInfoMap.getActiveSerialNo();//渲染360视图页面，add by zwx160456
            var callingInfo = _index.CallingInfoMap.get(SerialNo);           
            var phoneNum = callingInfo.getSubsNumber();
			//当前如果是外呼，且是自动触发的itemClick事件，则不查询客户信息
            /*if(!(CalloutCallId&&AudioLastCallId&&(JSON.stringify(CalloutCallId)==JSON.stringify(AudioLastCallId)) && this.noListClick)){
            	if(RegExp("^0?(13|15|17|18|14)[0-9]{9}$").test(phoneNum)){
               		if(window.clientTriggerFlag == true){
               					_index.clientInfo.trigger("acceptNumberChange",phoneNum);	
               		}
                	
                }
            } */   
            this.noListClick = false;			
	        if (currentItem.$el.find('.msgInfo').hasClass('release')) { //设置点击后的颜色和图片闪烁
	          	currentItem.setBackGround('release_current');//已释放的背景色为红
			}else {
				currentItem.setBackGround('current');//未释放的背景色为蓝,设置渠道图片停止闪烁
				currentItem.setPictureBling('stop');
			}
			this.trigger('itemClick',e,options);//点击
			if(this.currentQueueData.mediaTypeId==Constants.VOICE_TYPE){//判断是否为语音消息
				_index.contentCommon.hideAllChartWrapIn();//隐藏聊天框
				_index.main.currentPanel.glbTab.switchTab(1);
				//$('.uiTab .uiTabHead .uiTabItemHead').eq(1).click();
				$('.uiTabBody').find('.uiTabItemBody ').find('#hl_content').css('display','none');//隐藏百度编辑器
				_index.menu.notClick4();//恢复可点 xxq
				_index.comMenu.comUI.setAppointedMoreBtnEnabled(arr,true);
			}else{
				currentItem.$el.find('.bubble').text('0');//消除隐藏消息堆积量
				currentItem.$el.find('.bubble').hide();
				_index.menu.notClick2();//不可点 xxq
				_index.comMenu.comUI.setAppointedMoreBtnEnabled(arr,false);
				_index.comMenu.comUI.setAppointedBtnEnabled('callOutBtn',true);
				if(_index.nav.viewVal()==2){
					_index.main.currentPanel.glbTab.switchTab(0);//打开交谈区Tab	
				}else{
					if(_index.main.getCurrentTab().title == '交谈区'){
						_index.main.currentPanel.glbTab.switchTab(1);//打开客户业务信息Tab
						//$('.uiTab .uiTabHead .uiTabItemHead').eq(1).click();
					}
				}
				if(!_index.contentCommon.hasInPanel(options.serialNo)){//判断对应的交谈区是否存在
					_index.contentCommon.createChartWrapIn(this.currentQueueData);//不存在创建交谈区
					setTimeout($.proxy(function(){//延时打开交谈区页面，以免报错
						_index.contentCommon.showChartWrapIn(this.currentQueueData.serialNo);
						this.showChartWrapInFlag = true;//交谈区创建改变createChartWrapInFlag的值
					},this),0);
					var items = this.list[options.serialNo].itemArr;
					if (items.length>0) {
						$.each(items,function(i,options){
							var message=items[i];
							if (items[i].senderFlag==Constants.SENDER_FLAG_CUST) {//判断发送方
								_index.contentCommon.receiveMsg(message);
							}else {
								_index.contentCommon.sendHtmlMsg(message);
							}
						})
							this.list[options.serialNo].itemArr=[];			
					}
				}else{
					_index.contentCommon.showChartWrapIn(this.currentQueueData.serialNo);//直接打开交谈区
					this.showChartWrapInFlag = true;//交谈区创建改变createChartWrapInFlag的值
				}
				$('.uiTabBody').find('.uiTabItemBody ').find('#hl_content').css('display','block');//隐藏百度编辑器
			}
			_index.currentQueueData = this.currentQueueData;
 			if(this.conversationTimers){//客户队列区头部通话计时器同步  by 李守明
 				clearInterval(this.conversationTimers);
 			}
 			this.conversationTimers = setInterval(function(){
 				    if($(".TimeTilte").text()!= "通话中"){
 				    	clearInterval(this.conversationTimers);
 				    }else{
// 				    	判断当前会话的状态，是计时器还是离线状态 若为离线状态向.release_current查找
 				    		var timers = $(".current .conversation .p-num .time").html();
 	 	 					if(timers == undefined){
 	 	 						timers = $(".release_current .conversation .p-num .time").html();
 	 	 					}
// 	 				    	如果timers仍不存在则为通话中状态改变到会话区队列出现时，导致已有一段时间计时器不存在，对应不做操作
 	 				    	if(!timers){
 	 				    	}else if(timers=="[离线]"){
 	 				    		_index.clientInfo.timerWait.sameTime("");
 	 				    	}else{
 	 				    		_index.clientInfo.timerWait.sameTime(timers);
 	 				    	}
 				    };
 			},500);
			this.queueChange();
		},
		queueChange:function(){
			if(this.queueChangeTopFlag == false || this.queueChangeLeftFlag == false){//判断队列区收起或是展开
				this.changeRightTop();//队列区放开
				this.changeRightLeft();
			}else{
				this.changeLeftTop();//队列区收起
				this.changeLeftLeft();
			}
		},
		receiveMessage : function(message){//接收消息的方法，由451调用
			if(message.originalCreateTime){
				var messageTime = message.originalCreateTime;
				if(!isNaN(messageTime.substring(0,4))){
					
				}else{
					message.originalCreateTime = _index.utilJS.getCurrentTime();
				}	
			}
			
			this.queueReceiveMessageFlag = true;
			var serialNo = message.serialNo; //流水号
			var mediaTypeId = message.mediaTypeId; //mediaTypeId
			if(this.browserName=="IE"){//判断浏览器类型，添加提示音
				$('body').find('embed').remove();
				$('body').append('<embed src="src/assets/img/queueImg/newmsg.mp3" width=0 height=0 type=audio/mpeg loop="false" autostart="true">')
			}else{
				$('body').find('audio').remove();
				$('body').append('<audio src="src/assets/img/queueImg/newmsg.mp3" autoplay="autoplay"></audio>');
			}
			if (serialNo in this.list){//非新消息，传递内容进行显示
				this.list[serialNo].receiveMsg(message);
			}else {
				var item;//新消息创建item
				switch (mediaTypeId) {
				case Constants.MEDIA_ONLINE_SERVICE://webchat
					item = new WebchatItem(_index,message);
					break;
				case Constants.WEIXIN_TYPE://weixin
					item = new WeixinItem(_index,message);
					break;
				case Constants.MICROBLOGGING_TYPE://weibo
					item = new WeiboItem(_index,message);
					break;
				case Constants.VOICE_TYPE://yuyin
					message.phoneNum = message.callerNum;
					item = new YuyinItem(_index,message);
					break;
				default:
					break;//异常
				}
//				if(this.customerInformationFlag == true){
//					 this.customerInformationFlag = false;  
//					 _index.main.createTab({
//	                       title: '客户业务信息',
//	                       closeable: false,
//	                       url: _index.CTIInfo.defaultURL,
//	                  });
//				}
				_index.main.currentPanel.glbTab.items[1].setTab({hideTab:false});
				 if(mediaTypeId == Constants.VOICE_TYPE){ //如果是语音消息，首先获取channelID
					 message.channelID = _index.CallingInfoMap.get(message.serialNo).channelID;
				 }
				var url = _index.contentCommon.getLogoURL(message.channelID,mediaTypeId);//获取渠道图标
				item.$el.find('.icon').find('img').attr('src',url);//设置渠道图标
				this.$el.find('.queueList').prepend(item.$el);//放入页面
				item.on('itemClick',$.proxy(this.itemClick,this));//被点击时，带动queue对象
				this.list[serialNo] = item;//放入会话集合
				this.originalCreateTime[serialNo] = message.originalCreateTime;//存储会话进来的第一条消息的时间，对应相应的流水号.
				if(this.getListSize()==1) {//如果队列区只有一个会话对象，默认点击设置为当前会话
					_index.serialNoOld = message.serialNo;
					//当队列区只有1个会话时，自动触发itemClick事件，这时候，如果是外呼，则不查询客户信息
					this.noListClick = true;	
					item.itemClick(null);
				};
				if(mediaTypeId!=Constants.VOICE_TYPE){//若对列区超过一个会话对象，新消息进入若不是语音消息创建静态页面
					if(!(_index.contentCommon.editArea)){
						_index.contentCommon.createChartWrapIn(message);
						//_index.main.currentPanel.glbTab.switchTab(0);
					}else{
						$('#hl_content').css('display','block');
					}
					_index.menu.notClick2();//非语音不可点击三级菜单 xxq
				}else{
					var activeSerialNo = _index.CallingInfoMap.getActiveSerialNo();
					var callingInfo = _index.CallingInfoMap.get(activeSerialNo);
					if(callingInfo && callingInfo.mediaType == "5"){
						_index.comMenu.comUI.setAppointedMoreBtnEnabled(arr,true);
						_index.menu.notClick4();//语音可点击三级菜单 xxq
					}
				}
				this.queueChange();
			};
			if(mediaTypeId!=Constants.VOICE_TYPE){//判断是否为语音消息
				var lastWords;//调用最后一次对话概览方法
					switch(message.msgType){
						case Constants.MSGTYPE_TEXT:lastWords = _index.contentCommon.parseKeyToFace({content:message.content.replace(/\[enter\]/g, ''), mediaTypeId:message.mediaTypeId, parseMode: "desc"});  //_index.contentCommon.parseKeyToFace({msg:message.content.replace(/\[enter\]/g, ''), mediaId:message.mediaTypeId, parseMode: "desc"});//要经过处理的，表情
							break;
						case Constants.MSGTYPE_IMG:lastWords='[图片]';
							break;
						case Constants.MSGTYPE_AUDIO:lastWords='[音频]';
							break;
						case Constants.MSGTYPE_VIDEO:lastWords='[视频]';
							break;
						case Constants.MSGTYPE_SMALL_VIDEO:lastWords='[小视频]';
							break;
						case Constants.MSGTYPE_URL:lastWords=message.url;//要经过处理的，表情，链接
							break;
						case Constants.MSGTYPE_GEOGRAPHIC_LOCATION:'[位置]';
							break;
						case Constants.MSGTYPE_OTHER_FILE:lastWords='[文件]';
							break;
					}
	            this.list[serialNo].$el.find('.message').text(lastWords);	//队列区显示最后一句话的内容
			};
			if(mediaTypeId!=Constants.VOICE_TYPE){
				this.list[serialNo].hasTip = false;			//重置item中hasTip的值	
			}
			if (_index.contentCommon.clientInPanels[message.serialNo]) {
				if (message.senderFlag==Constants.SENDER_FLAG_CUST) {
					_index.contentCommon.receiveMsg(message);
				}else {
					_index.contentCommon.sendHtmlMsg(message);
				}
			}else {
					_index.contentCommon.saveMessage(message);//输入消息，保存为html，等待createChatWrap时调用
			};
			var lastWords;//消息弹框提示
			switch(message.msgType){
			case Constants.MSGTYPE_TEXT:lastWords = _index.contentCommon.parseKeyToFace({content:message.content.replace(/\[enter\]/g, ''), mediaTypeId:message.mediaTypeId, parseMode: "desc"});//要经过处理的，表情
				break;
			case Constants.MSGTYPE_IMG:lastWords='[图片]';
				break;
			case Constants.MSGTYPE_AUDIO:lastWords='[音频]';
				break;
			case Constants.MSGTYPE_VIDEO:lastWords='[视频]';
				break;
			case Constants.MSGTYPE_SMALL_VIDEO:lastWords='[小视频]';
				break;
			case Constants.MSGTYPE_URL:lastWords=message.url;//要经过处理的，表情，链接
				break;
			case Constants.MSGTYPE_GEOGRAPHIC_LOCATION:'[位置]';
				break;
			case Constants.MSGTYPE_OTHER_FILE:lastWords='[文件]';
				break;
			default:
				lastWords='您有未读消息，请查看';
			}
			var title;
			var callerNo = _index.CallingInfoMap.get(serialNo).getCallerNo() //获取callerNo
			if(message.mediaID==Constants.WEIXIN_TYPE||message.mediaID==Constants.MICROBLOGGING_TYPE){//微信,微博
				title=message.userInfo.nickName?message.userInfo.nickName:"消息提示";
			}else{
				title=callerNo?callerNo:"消息提示";
			}
	        if (window.Notification) {
				 if(mediaTypeId == Constants.VOICE_TYPE){
					 message.channelID = _index.CallingInfoMap.get(message.serialNo).channelID;
				 }
				var tipUrl = _index.contentCommon.getLogoURL(message.channelID,mediaTypeId);//获取渠道图标
	            var popNotice = function() {
	                if (Notification.permission == "granted") {
	                    var notification = new Notification(title, {
	                    	body: lastWords,//设置提示语
	                    	silent:true,//设置是否有声音
	                        icon: tipUrl//设置渠道图标
	                    });
	                    notification.onclick = function() {
	                    	window.focus();
		                   	_index.nav.changeSelectOut(2);//调用存储切换视图方式
	                         if($('body').hasClass('internet-ver')){// 判断接续条位置，并进行相应的跳转， 接续 左侧internet-ver   头部internet-hor
	                         	_index.layoutChange('internet-ver');//跳转视图
	                         	_index.main.currentPanel.glbTab.switchTab(0);//交谈区打开
	                         }else{
	                         	_index.layoutChange('internet-hor');
	                         	_index.main.currentPanel.glbTab.switchTab(0);
	                         }
	                        notification.close(); //弹窗被点击，关闭弹窗
	                    };
	                    setTimeout(function(){//5秒关闭弹框
	                    	notification.close();
	 					},5000);
	                }
	            }
	            if(message.senderFlag==Constants.SENDER_FLAG_CUST){
	            	if(this.showChartWrapInFlag){
	            		if(window.isFocus || _index.editor.ue.isFocus()){
		   					if(_index.nav.viewVal()!='2'){
		   						Notification.permission === "default" ? Notification.requestPermission(function (permission) {
			                      	popNotice();
		                   	 	}) : popNotice()
		   					}
		   				}else{
	   					 	Notification.permission === "default" ? Notification.requestPermission(function (permission) {
		                      	popNotice();
	                    	}) : popNotice()
	   					}
	            	}else{
	            		if(window.isFocus){
	   						if(_index.nav.viewVal()!='2'){
	   							Notification.permission === "default" ? Notification.requestPermission(function (permission) {
		                      		popNotice();
	                   	 		}) : popNotice()
	   						}
	   					}else{
	   					 	Notification.permission === "default" ? Notification.requestPermission(function (permission) {
		                      	popNotice();
	                    	}) : popNotice()
	   					}
	            	}
	            }
	        }
		},
		releaseSession : function(data){//释放成功事件调用,参数需要挂机方releaseType,流水号serialNo
			if(data.serialNo in this.list){//判断此会话是否存在于队列
				var releaseItem = this.list[data.serialNo];
				if(Constants.RELEASETYPE_OPERATOR == data.staffHangUp){//座席释放，直接删除客户队列区此会话，其他挂机置灰。
					if(this.currentQueueData.serialNo == data.serialNo){//如果删除的是当前会话，需要将下一个会话当做当前回话，座席释放的肯定是当前会话。
						var nextSerialNo;	//从上往下获取下一个会话，如果下一个会话不存在，则取上一个会话。
						if(releaseItem.$el.next().length!=0){
							nextSerialNo = releaseItem.$el.next().prop('id').substring(10);
						}else if(releaseItem.$el.prev().length!=0){
							nextSerialNo = releaseItem.$el.prev().prop('id').substring(10);
						}
						if(nextSerialNo){//可能队列区有且只有一个会话
							var nextItem=this.list[nextSerialNo];
							nextItem.itemClick(null);//触发点击事件
						}
					}
					if(_index.queue.getListSize() == 1){
                        $('.uiTabBody').find('.uiTabItemBody ').find('#hl_content').css('display','none');
                        $("#chatBox_tab").hide();
    	            }
					releaseItem.$el.remove();//删除需要释放的会话。
					_index.contentCommon.distoryChatWrap(data.serialNo);//删除静态页面
					
					if(this.list[data.serialNo].hasOwnProperty('timer')){//清理计时器
						clearInterval(this.list[data.serialNo].timer);
					}
					if(this.list[data.serialNo].hasOwnProperty('waring')){
						clearInterval(this.list[data.serialNo].waring);
					}
					if(this.list[data.serialNo].hasOwnProperty('bling')){
						clearInterval(this.list[data.serialNo].bling);
					}
					var mediaTypeId = _index.CallingInfoMap.get(data.serialNo).getMediaType();
					if(this.getListSize()==1){
						if(mediaTypeId !=Constants.VOICE_TYPE ){
							this.clearClientInfo();// 清空客户信息配置
						}
						var callingInfo = _index.CallingInfoMap.get(data.serialNo);
						var subsNumber = callingInfo.subsNumber;
						if(subsNumber){
							var lastCustInfo = callingInfo.getClientInfoMap(subsNumber);
							_index.CallingInfoMap.put("acceptNumber", lastCustInfo);
						};
						this.currentQueueData = '';
						_index.currentQueueData = '';
						_index.CallingInfoMap.setActiveSerialNo('');
						
					};
					delete this.list[data.serialNo];
					delete _index.contentCommon.clientInPanels[data.serialNo];
					setTimeout(function(){//删除数据，延时执行
				    	_index.CallingInfoMap.remove(data.serialNo);
				    },2000);
				}else{
					if(data.serialNo == this.currentQueueData.serialNo){
						releaseItem.setBackGround('release');//设置背景色
						releaseItem.setBackGround('release_current');
					}else{
						releaseItem.setBackGround('release');//设置背景色 
					}
					clearInterval(releaseItem.timer);//清除释放对象的定时器
					releaseItem.$el.find('.p-num .time').text('[离线]');//变更状态为离线
					var strUrl = releaseItem.$el.find('.icon').find('img').attr('src');//获取渠道图标
					var strLXUrl = strUrl.replace('.','-hs.');//替换路径
					releaseItem.$el.find('.icon').find('img').attr('src',strLXUrl);//更换离线渠道图标
					if(releaseItem.$el.find('.msgInfo').hasClass('new')){//如果存在类名new，移除类名
						releaseItem.$el.find('.msgInfo').removeClass('new');
					}
					releaseItem.$el.find('.msgInfo').addClass('release');//离线背景色设置
				}
			}
			
		},
        eventInit : function(){//事件初始化
        	this.$el.on('click','.queueHistory',$.proxy(this.queryHistory,this));
        	this.$el.on('click', ".queueClean", $.proxy(this.queueClean,this));
        	this.$el.on('click', ".leftbtn", $.proxy(this.changeLeftTop,this));
        	this.$el.on('click', ".rightbtn", $.proxy(this.changeRightTop,this));
        	this.$el.on('click', ".leftbtn", $.proxy(this.changeLeftLeft,this));
        	this.$el.on('click', ".rightbtn", $.proxy(this.changeRightLeft,this));

        },
        getListSize : function(){ //获取list长度
        	var size = 0;
            for(var i in this.list){
                size++;
            };
            return size;
        },
        queueClean : function(){ //判断是否是由点击清理离线按钮触发的清理离线事件
        	this.queueCleanFlag = true;
        	this.clearQueue();
        },
        alarmInit:function(alarm){//从数据库获取警告信息
			$.getJSON('../../data/queue/queue.json',{},function(json,status){
				if (status) {
					$.each(json.beans,function(i,data){
						switch(data.mediaTypeId){
						case Constants.MEDIA_ONLINE_SERVICE:
							alarm.WEBCHAT_ALARMTIME=data.alarmTime;
							alarm.WEBCHAT_ALARMMSG=data.alarmMsg;
							alarm.WEBCHAT_RELEASETIME=data.releaseTime;
							alarm.WEBCHAT_RELEASEMSG=data.releaseMsg;
							alarm.WEBCHAT_AGENT_ALARMTIME=data.agentAlarmTime;
							alarm.WEBCHAT_AGENT_ALARMMSG=data.agentAlarmMsg;
							break;
						case Constants.WEIXIN_TYPE:
							alarm.WEIXIN_ALARMTIME=data.alarmTime;
							alarm.WEIXIN_ALARMMSG=data.alarmMsg;
							alarm.WEIXIN_RELEASETIME=data.releaseTime;
							alarm.WEIXIN_RELEASEMSG=data.releaseMsg;
							alarm.WEIXIN_AGENT_ALARMTIME=data.agentAlarmTime;
							alarm.WEIXIN_AGENT_ALARMMSG=data.agentAlarmMsg;
							break;
						case Constants.MICROBLOGGING_TYPE:
							alarm.WEIBO_ALARMTIME=data.alarmTime;
							alarm.WEIBO_ALARMMSG=data.alarmMsg;
							alarm.WEIBO_RELEASETIME=data.releaseTime;
							alarm.WEIBO_RELEASEMSG=data.releaseMsg;
							alarm.WEIBO_AGENT_ALARMTIME=data.agentAlarmTime;
							alarm.WEIBO_AGENT_ALARMMSG=data.agentAlarmMsg;
							break;
						}
					});
				};
			});
			return alarm;
		},
  		queryHistory : function(){//查询历史方法
  			var staffId = _index.getUserInfo().staffId;//对应的staffId获取
  			var  params = {
	  			title:'历史记录管理器',
	  			url:'js/queue/queryHistory',
  				param:{
  					"staffId":staffId
  				},
  				width:845,
  				height:530
  			};
  			var result = _index.showDialog(params);
  		},
  		clearQueue:function(flag){//点击清理会话
  			if(this.queueCleanFlag){
				if(this.getListSize()==0){
  					alert('没有会话可以清理~~');
  					this.queueCleanFlag = false;
  					return;
  				};
  				var isSure = confirm('是否要清理会话');
  			}
  			if(this.getListSize()!=0){
  				if(isSure || flag){
  	  				if(_index.CallingInfoMap.get(_index.queue.currentQueueData.serialNo).getSessionStatus() == '04'){
  	  					var callingInfo = _index.CallingInfoMap.get(_index.queue.currentQueueData.serialNo);
  	  	  				var subsNumber = callingInfo.subsNumber;
  	  	  				if(subsNumber){
  	  	  					var lastCustInfo = callingInfo.getClientInfoMap(subsNumber);
  	  	  					_index.CallingInfoMap.put("acceptNumber", lastCustInfo);
  	  	  				};
  	  				};
  	  				var _this = this;
  	  				var listArr = this.list;
  	  				$.each(listArr,function(i,data){
  	  					var  callingInfo = _index.CallingInfoMap.get(i);
  	  					var SessionStatus = callingInfo.getSessionStatus();
  						try{
  							if('04' == SessionStatus){
  								_index.queue.list[i].$el.remove();
  								_index.contentCommon.distoryChatWrap(i);
  								if (_index.queue.list[i].hasOwnProperty('timer')) {
  									clearInterval(_index.queue.list[i].timer);
  								}
  								if (_index.queue.list[i].hasOwnProperty('waring')) {
  									clearInterval(_index.queue.list[i].waring);
  								}
  								if (_index.queue.list[i].hasOwnProperty('bling')) {
  									clearInterval(_index.queue.list[i].bling);
  								}
  								delete _index.queue.list[i];
  								delete _index.contentCommon.clientInPanels[i];
  								if(_index.queue.getListSize()==0){
  									delete _index.contentCommon.hasInPanel[i];
  									_index.contentCommon.distoryChatWrap();
  									$('.uiTabBody').find('.uiTabItemBody ').find('#hl_content').css('display','none');
  									$('.chatTree').css('display','none');
  									_this.clearClientInfo();// 清空客户信息配置
  									
  								};
  								//setTimeout(function(){
  						    		_index.CallingInfoMap.remove(i);
  							   // },2000);
  							}
  						}catch(e){
  						}
  	  				})
  					var panelLength = this.$el.find('.panel').length;
  					if (panelLength!=0) {
  						var lastSerialNo = $(this.$el.find('.panel')[panelLength-1]).prop('id').substring(10);
  						var lastQueueItem=this.list[lastSerialNo];
  	                    lastQueueItem.itemClick(null);//触发点击事件
  					}
  	  			};
  			}
  			
			this.queueCleanFlag = false;
  		},
  		clearClientInfo:function(){//触发切换到融合视图的事件 清空顶部客户信息配置
  			if($('body').hasClass('internet-ver') || $('body').hasClass('internet-hor') || $('body').hasClass('yyA-hor') || $('body').hasClass('yyA-ver') || $('body').hasClass('yyB-ver') || $('body').hasClass('yyB-hor')){
//					this.currentQueueData = '';
//					_index.currentQueueData = '';
//					_index.CallingInfoMap.setActiveSerialNo('');
					if(_clientInfo){
						$(".customer_info").empty();
						if($('body').hasClass('internet-ver')){
							_clientInfo.initClientInfo('internet-ver');
						}else if($('body').hasClass('internet-hor')){
							_clientInfo.initClientInfo('internet-hor');
						}else if($('body').hasClass('yyA-hor')){
							_clientInfo.initClientInfo('yyA-hor');
						}else if($('body').hasClass('yyA-ver')){
							_clientInfo.initClientInfo('yyA-ver');
						}else if($('body').hasClass('yyB-hor')){
							_clientInfo.initClientInfo('yyB-hor');
						}else{
							_clientInfo.initClientInfo('yyB-ver');
						}
					}
					// var phoneNum ='';
     //        		_index.clientInfo.trigger("acceptNumberChange",phoneNum);
				//}
			};
  		},
  		myBrowser:function(){//判断使用的浏览器
    		var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    		var isOpera = userAgent.indexOf("Opera") > -1
			if (userAgent.indexOf("Opera") > -1) {
			    return "Opera"
			}; //判断是否Opera浏览器
			if (userAgent.indexOf("Firefox") > -1) {
				return "FF";
			};//判断是否Firefox浏览器
			if (userAgent.indexOf("Chrome") > -1){
				return "Chrome";
			};//判断是否Chrome浏览器
			if (userAgent.indexOf("Safari") > -1) {
				return "Safari";
			};//判断是否Safari浏览器
			if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
        		return "IE";
    		}; //判断是否IE浏览器
  		},
		changeLeftTop:function(){//点击队列区收起，接续栏在头部
			$('.queue .leftbtn').css('display','none');
			$('.queue .rightbtn').css('display','block');
			$('body.internet-hor .queue').addClass('queueChangeLeftTop');
			$('body.internet-hor .main').addClass('mainLeftTop');
			$('body.internet-hor .queueContainer .queueControl').addClass('queueControlLeftTop');
			$('body.internet-hor .clientInfo').addClass('clientInfoLeftTop');
			$('body.internet-hor .queue .queueContainer .queueList').css('height','648px');
			$('.uiTabBody .chatTree').css('left','72%');
			this.queueChangeTopFlag = true;
		},
		changeRightTop:function(){//点击队列区放开 接续栏在头部
			$('.queue .rightbtn').css('display','none');
			$('.queue .leftbtn').css('display','block');
			$('body.internet-hor .queue').removeClass('queueChangeLeftTop');
			$('body.internet-hor .main').removeClass('mainLeftTop');
			$('body.internet-hor .queueContainer .queueControl').removeClass('queueControlLeftTop');
			$('body.internet-hor .clientInfo').removeClass('clientInfoLeftTop');
			$('body.internet-hor .queue .queueContainer .queueList').css('height','768px');
			$('.uiTabBody .chatTree').css('left','74%');
			this.queueChangeTopFlag = false;
		},
		changeLeftLeft:function(){//点击队列区收起，接续栏在左侧
			$('.queue .leftbtn').css('display','none');
			$('.queue .rightbtn').css('display','block');
			$('body.internet-ver .queue').addClass('queueChangeLeftLeft');
			$('body.internet-ver .main').addClass('mainLeftLeft');
			$('body.internet-ver .queueContainer .queueControl').addClass('queueControlLeftLeft');
			$('body.internet-ver .clientInfo').addClass('clientInfoLeftLeft');
			$('body.internet-ver .queue .queueContainer .queueList').css('height','698px');
			$('.uiTabBody .chatTree').css('left','74%');
			this.queueChangeLeftFlag = true;
		},
		changeRightLeft:function(){//点击队列区放开 接续栏在左侧
			$('.queue .rightbtn').css('display','none');
			$('.queue .leftbtn').css('display','block');
			$('body.internet-ver .queue').removeClass('queueChangeLeftLeft');
			$('body.internet-ver .main').removeClass('mainLeftLeft');
			$('body.internet-ver .queueContainer .queueControl').removeClass('queueControlLeftLeft');
			$('body.internet-ver .clientInfo').removeClass('clientInfoLeftLeft');
			$('body.internet-ver .queue .queueContainer .queueList').css('height','818px');
			$('.uiTabBody .chatTree').css('left','76%')
			this.queueChangeLeftFlag = false;
		},
		hangUpByStaff:function(serialNo){//三分钟超时释放时调用。
			var  callingInfo = _index.CallingInfoMap.get(serialNo)
	        var time = callingInfo.getCallIdTime();
	        var dsn = callingInfo.getCallIdDsn();
	        var handle = callingInfo.getCallIdHandle();
	        var server = callingInfo.getCallIdServer();
	        var callId = {"time":time,"dsn":dsn,"handle":handle,"server":server};
	        var ip = _index.CTIInfo.IP;
	        var port = _index.CTIInfo.port;
	        var isDefault=_index.CTIInfo.isDefault;//缺省业务标志值
			var proxyIP=_index.CTIInfo.ProxyIP;//代理IP
	        var proxyPort =_index.CTIInfo.ProxyPort;//代理端口
	        var ctiId = _index.CTIInfo.CTIId;
	        if(ip == undefined || port == undefined ){
	          return;
	        }
	        var options = _index.serialNumber.getSerialNumber();
	        var data ={
	            "callId":callId,
	            "opserialNo":options
	        }
	        var url = '';
	        if(isDefault=="1"){//此种情况走nginx代理
	        	url=Constants.CCACSURL+proxyIP+":"+proxyPort+"/ccacs/"+ctiId+"/ws/call/releasecall";
	         }else{                                 
	        	url= Constants.CCACSURL+ip+":"+port+"/ccacs/ws/call/releasecall"; //跨域直连
	         }
	        //调用CTI释放接口
	        if(this.browserName==="IE"){  //注意index的
	        	callingInfo.setReleaseType(Constants.RELEASETYPE_USER);
	           
				//IE逻辑
	            $.ajax({  
	                url : url ,
	                type : 'post',  
	                data :  JSON.stringify(data),
		            async: false,
	      	  		crossDomain: true,
	                contentType:"application/json; charset=utf-8",
	                success : function(datas) {
	                  var result = datas.result;
	                  //result的值为"0"表示接口调用成功，否则表示调用接口失败
	                  if(result =="0"){
	                    _index.popAlert("释放成功","释放信息");
	                    //将更新后的callingInfo对象覆盖原来的
	            		_index.CallingInfoMap.put(serialNo,callingInfo);
	                    }else{
	                    	var sessionStatus=_index.CallingInfoMap.get(serialNo).getSessionStatus();
	        		        if ('04'==sessionStatus) {
	        		        	_index.popAlert("会话已挂断，释放会话失败！","释放信息");
	        				}else{
	                            _index.popAlert("释放失败！","释放信息");
	        				}
	                    }
	                },
	                  error : function( XMLHttpRequest, textStatus, errorThrown) {
	                    _index.popAlert("网络异常，释放失败！","释放信息");
	                }
	              });
			}else{
				//其他浏览器逻辑
		        $.ajax({  
		            url : url ,
		            type : 'post',  
		            data :  JSON.stringify(data),
		            async: false,
		  	  		crossDomain: true,
		  	        xhrFields: {
		  	              withCredentials: true
		  	               }, 
		            contentType:"application/json; charset=utf-8",
		            success : function(datas) {
		                var result = datas.result;
		                //result的值为"0"表示接口调用成功，否则表示调用接口失败
		                if(result =="0"){
		                      callingInfo.setReleaseType(Constants.RELEASETYPE_USER);
		                      //将更新后的callingInfo对象覆盖原来的
		                      _index.CallingInfoMap.put(serialNo,callingInfo);
		                      _index.popAlert("释放成功","释放信息");
		                }else{
		                	var sessionStatus=_index.CallingInfoMap.get(serialNo).getSessionStatus();
	        		        if ('04'==sessionStatus) {
	        		        	_index.popAlert("会话已挂断，释放会话失败！","释放信息");
	        				}else{
	                            _index.popAlert("释放失败！","释放信息");
	        				}
		                }
		            },
		              error : function( XMLHttpRequest, textStatus, errorThrown) {
		                _index.popAlert("网络异常，释放失败！","释放信息");
		            }
		        });
			} 
		}
    });
	return queueClass;
})