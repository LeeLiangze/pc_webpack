//此js是处理编辑区的点击事件
define(['Util',
		'../contentCommon',
        '../../index/constants/mediaConstants'
        ],function(Util,ContentCommon,MediaConstants){
	var _index;
	var _$el;
	var expressionDescMapValue={};
	var objClass = function(index,$el,editor,data){
		this.$el = $el;
		_$el = $el;
		_index = index;
		this.editor = editor;
		this.data = data;
		this.eventInit();
	}

	$.extend(objClass.prototype, {
		eventInit:function(){
			//转接按钮事件处理
			this.$el.on('click','.btn-transfer',$.proxy(this.transferSkill,this));
			//结束会话事件处理
			this.$el.on('click','.btn-light',$.proxy(this.endSession,this));
			//发送按钮事件处理
			this.$el.on('click','#msgSubmit',$.proxy(this.sendContent,this));

			this.$el.on('mouseover',".coordination",function(){
				$("#listWrap").css("display","block");
			});
			this.$el.on('mouseout','.coordination',function(){
				$("#listWrap").css("display","none");
			});
			this.$el.on('mouseover',"#listWrap",function(){
				$("#listWrap").css("display","block");
			});
			$("body").on("click",function(evt){
				$("#listWrap").css("display","none");
				$(".sendChoose").css("display","none");
			})
			$('.btnsArea',this.$el).find("li").on('mouseover',function(){
				$(this).css("background-color","#e5f2fa");
			});
			$('.btnsArea',this.$el).find("li").on('mouseout',function(){
				$(this).css("background-color","#fff");
			});
			
			this.$el.on('click',".chooselist",function(){
				$(".sendChoose").css("display","block");
				return false;
			});
			this.editor.ue.addListener('focus',function(){
				$("#listWrap").css("display","none");
				$("#faceContent_faceDiv").hide();
                $(".face").removeClass("show");
			});

			$(".sendChoose",this.$el).find("li").on("click",function(evt){
				var e=(evt)?evt:window.event; //判断浏览器的类型，在基于ie内核的浏览器中的使用cancelBubble
				if (window.event) {
					e.cancelBubble=true;
				} else {
					//e.preventDefault();
					e.stopPropagation(); //在基于firefox内核的浏览器中支持做法stopPropagation
				}
				var html = "<img src='src/assets/img/content/editArea/zlt-g.png'/>";
				if($(this).attr("class") == "enter"){
					if($(this).find("span.chooseKey").children().length){
						//$(this).find("span.chooseKey img").remove();
						//$(".ctrlEnter").find("span.chooseKey").append(html);
						//$("li.enter",_$el).attr("selected","selected");
						//$("li.ctrlEnter",_$el).removeAttr("selected");
					}else{
						$(this).find("span.chooseKey").append(html);
						$(".ctrlEnter",_$el).find("span.chooseKey img").remove();
						$("li.ctrlEnter",_$el).removeAttr("selected");
						$("li.enter",_$el).attr("selected","true");
					}
				}
				if($(this).attr("class") == "ctrlEnter"){
					if($(this).find("span.chooseKey").children().length){
						/*$(this).find("span.chooseKey img").remove();
						$(".enter").find("span.chooseKey").append(html);
						$("li.ctrlEnter",_$el).attr("selected","selected");
						$("li.enter",_$el).removeAttr("selected");*/
					}else{
						$(this).find("span.chooseKey").append(html);
						$(".enter",_$el).find("span.chooseKey img").remove();
						$("li.enter",_$el).removeAttr("selected");
						$("li.ctrlEnter",_$el).attr("selected","true");
					}
				}
				_index.utilJS.sendKeyCode(".sendChoose");
			});
			var _this = this;
			this.editor.ue.addListener("keydown",function(type,event){
				event = event||window.event;
				//判断是不是ctrl + enter
			   if(event.keyCode=="13"||event.keyCode == "108"){
				  var isEnterKey =_index.utilJS.isEnterKey();
	        	  _index.utilJS.bindSendKey(event,"#msgSubmit");
	        	  var ie = !-[1,];
				   if(isEnterKey&&event.ctrlKey==true){
	        			//换行
	        			var str = '<p><br/></p>';
	        			var html = _this.editor.ue.getContent();
	        			if(html == ""){
	        				_this.editor.ue.setContent(html+"<p><br/></p><p><br/></p>");
	        			}else{
	        				_this.editor.ue.setContent(html+str);
	        			}
	        			/*clearInterval(tDMotionId);
	        			var tDMotionId = setTimeout($.proxy(function() {*/
	                    	_this.editor.ue.focus(true);
	                    //}, _this), 0);
	        		}
				  if((!isEnterKey)&&event.ctrlKey==false&&ie){
	        			//换行
	        			var str = "<p><br/></p>";
	        			var html = _this.editor.ue.getContent();
	        			if(html == ""){
	        				_this.editor.ue.setContent(html+"<p><br/></p><p><br/></p>");
	        			}else{
	        				_this.editor.ue.setContent(html+str);
	        			}
	        			
	        			/*clearInterval(tDMotionId);
	        			var tDMotionId = setTimeout($.proxy(function() {*/
	                    	_this.editor.ue.focus(true);
	                    //}, _this), 0);
	        		}
	    			return false;
			   }
			})
			_index.utilJS.sendKeyCode(".sendChoose");
		},
		transferSkill:function(){
			_index.showDialog({
    			title:'转接', //弹出窗标题
    			url:'js/content/editArea/transfer', //要加载的模块
    			param:'test param.', //要传递的参数，可以是json对象
    			width:840, //对话框宽度
    			height:630 //对话框高度
    		});
		},
		endSession:function(){
			_index.queue.list[_index.currentQueueData.serialNo].removeFlag = true;
			_index.showDialog({
        		title:'释放原因', //弹出窗标题
        		url:'js/content/editArea/releaseReason', //要加载的模块
        		param:{"isNew":true,"opserialno":"1"}, //要传递的参数，可以是json对象
        		width:250, //对话框宽度
        		height:300, //对话框高度
        	});
			//_index.queue.list[_index.currentQueueData.serialNo].removeFlag = true;
		},
		sendContent:function(){
			var html = this.editor.ue.getContent();
			var txt = this.editor.ue.getContentTxt();
			//默认是文本
			var msgType = MediaConstants.MSGTYPE_TEXT;
			var url = "";
			//this.editor.ue.setContent("我是设置的内容。。。。。。");
			//判断内容是否是图片
			if(html.indexOf("<img") != -1){
				if(_index.contentCommon.cloneCurrentQueueData.mediaTypeId == MediaConstants.MICROBLOGGING_TYPE){
					_index.popAlert('微博不能发送图片！');
					return;
				}
				msgType = MediaConstants.MSGTYPE_IMG;
				//后台请求 url
				url = html.split("\"")[1];
			}
			var serialNo=_index.CallingInfoMap.getActiveSerialNo();
			var callingInfo = _index.CallingInfoMap.get(serialNo);
			var messageId;
			if(!$.trim(html)){
				alert("没有内容,请输入内容！");
			}else{
				html = $.trim(html);

				html = this.paseFaceDescToKey(html);
				txt = this.paseFaceDescToKey(txt);
				 var params ={"skillDesc":"","ctiId":"","ccId":"","vdnId":""};
				 //此处使用同步请求，msgId的值得到后，要马上使用
				 Util.ajax.postJson("front/sh/media!execute?uid=randomSerialNo",params, function(json, status) {
					 if (status) {
						 messageId = json.bean.serialNo;
					 }else{
						 messageId = _index.contentCommon.getSerialNo();
					 }
				 },true);
				if(_index.contentCommon.cloneCurrentQueueData.mediaTypeId == MediaConstants.MEDIA_ONLINE_SERVICE){//webchat,包括4g
					var sendMsgWebchatData={
						"serialNo":_index.currentQueueData.serialNo,
						"msgType":msgType,
                        "mediaTypeId": _index.contentCommon.cloneCurrentQueueData.mediaTypeId,
						"senderFlag":MediaConstants.SENDER_FLAG_SEAT,
					    "content":html,
				        "originalCreateTime":_index.utilJS.getCurrentTime(),
				        "channelID":_index.contentCommon.cloneCurrentQueueData.channelID,
                        "nickName":_index.currentQueueData.nickName,
                        "contentTxt":txt,
                        "msgId":messageId,
                        "url":url
					}
					_index.contentCommon.sendMsg(sendMsgWebchatData);
				}else if(_index.contentCommon.cloneCurrentQueueData.mediaTypeId == MediaConstants.WEIXIN_TYPE){//weixin
					var sendMsgWeixinData={
							"serialNo":_index.currentQueueData.serialNo,
							"msgType":msgType,
	                        "mediaTypeId": _index.contentCommon.cloneCurrentQueueData.mediaTypeId,
							"senderFlag":MediaConstants.SENDER_FLAG_SEAT,
						    "content":html,
					        "originalCreateTime":_index.utilJS.getCurrentTime(),
					        "channelID":_index.contentCommon.cloneCurrentQueueData.channelID,
	                        "nickName":_index.currentQueueData.nickName,
	                        "contentTxt":txt,
	                        "msgId":messageId,
                        	"url":url
						}
					_index.contentCommon.sendMsg(sendMsgWeixinData);

				}else if(_index.contentCommon.cloneCurrentQueueData.mediaTypeId == MediaConstants.MICROBLOGGING_TYPE){//weibo
					var serialNo=_index.CallingInfoMap.getActiveSerialNo();
		            var callingInfo = _index.CallingInfoMap.get(serialNo);
		            var serviceTypeId = callingInfo.getServiceTypeId();
		            var fromUserName = callingInfo.getCalledNo();
		            var toUserName = callingInfo.getCallerNo();
		            //var caller = callingInfo.getCalledNo();
					var sendMsgWeiboData={
							"serialNo":_index.currentQueueData.serialNo,
							"msgType":msgType,
	                        "mediaTypeId": _index.contentCommon.cloneCurrentQueueData.mediaTypeId,
							"senderFlag":MediaConstants.SENDER_FLAG_SEAT,
						    "content":html,
					        "originalCreateTime":_index.utilJS.getCurrentTime(),
					        "channelID":_index.contentCommon.cloneCurrentQueueData.channelID,
	                        "nickName":_index.currentQueueData.nickName,
	                        "serviceTypeId":serviceTypeId,
	                        "contentTxt":txt,
	                        "msgId":messageId,
                        	"url":url
						}
					_index.contentCommon.sendMsgWeibo(sendMsgWeiboData);

				}else if(_index.contentCommon.cloneCurrentQueueData.mediaTypeId == MediaConstants.VOICE_TYPE){//yuyin

				}else if(_index.contentCommon.cloneCurrentQueueData.mediaTypeId == MediaConstants.SHORT_MESSAGE_TYPE){//短信
					var sendMsgShortData={
							"serialNo":_index.currentQueueData.serialNo,
							"msgType":msgType,
	                        "mediaTypeId": _index.contentCommon.cloneCurrentQueueData.mediaTypeId,
							"senderFlag":MediaConstants.SENDER_FLAG_SEAT,
						    "content":html,
					        "originalCreateTime":_index.utilJS.getCurrentTime(),
					        "channelID":_index.contentCommon.cloneCurrentQueueData.channelID,
	                        "nickName":_index.currentQueueData.nickName,
	                        "serviceTypeId":serviceTypeId,
	                        "contentTxt":txt,
	                        "msgId":messageId
						}
					_index.contentCommon.sendMsgShortM(sendMsgShortData);
   				}

				this.editor.ue.setContent("");
				this.editor.ue.focus();
			}
		},
		//对应表情中文替换成对应的key
		paseFaceDescToKey: function(content) {
			if (!content) return '';
        	var reg = /\[[^\]]+\]/g;

        	if(_index.contentCommon.cloneCurrentQueueData.mediaTypeId == MediaConstants.WEIXIN_TYPE) {
                expressionDescMapValue=_index.contentCommon.getAllExpressionDescValue()[MediaConstants.MEDIA_ONLINE_SERVICE];
            } else {
                expressionDescMapValue=_index.contentCommon.getAllExpressionDescValue()[_index.currentQueueData.mediaTypeId];
            }

        	if (reg.test(content)) {
        		var result = content.match(reg);
        		for (var i=0; i < result.length; i++){
					var value = expressionDescMapValue[result[i]];
					if(null == value || "" == value){
						continue;
					}
					content = content.replace(result[i], value);
				}
        	}

        	return content;
		}
	})

	return objClass;
})
