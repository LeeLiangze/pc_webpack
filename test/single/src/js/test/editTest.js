define(['editor',
        '../content/chatArea/chatArea',
        '../../tpl/test/editTest.tpl',
        '../../assets/css/test/editTest.css'
        ], function(Editor,ChatArea,tpl){

	var $el;
	var _index;
	var editor;
	var contactId;
	var editArea = null;
	var expressionDescMapValue={};
	var object = function(options,data){
		$el = $(tpl);
		_index = data._index;
		this.$el = $el;
		//this.$editEl = $(options.el);
		this.creatChartEdit();
		this.eventInit();
		var $chatShow =this.$el.find('.chat-show');
		//聊天区
		var chatArea = new ChatArea(_index,options);
		$chatShow.append(chatArea.content);
		this.content = $el;
	};

	$.extend(object.prototype, {
        creatChartEdit:function(){
        	editor = new Editor({
			    el:$(".editor",$el)        //要绑定的容器
			    //,content:$.trim('')   //要在富文本框中显示的默认值
			    ,initialFrameHeight:88
			    ,initialFrameWidth:'100%'
			    ,toolbars: [[]]
				,elementPathEnabled: false //删除元素路径
			    //,wordCount: false    //删除字数统计
				,maximumWords : 900//最大字符数
				,saveInterval: 5000000
        		,initialStyle:'p{line-height:1em;font-size:14px;color:#666}'
			});
        	//$el.appendTo(this.$editEl.find('.uiTabItemBody')[1]);
        },
        eventInit:function(){
			//发送按钮事件处理
			this.$el.on('click','#msgSubmit',$.proxy(this.sendContent,this));
		},
		sendContent:function(){
			var html = editor.ue.getContent();
			var txt = editor.ue.getContentTxt();
			//默认是文本
			var url = "";
			//this.editor.ue.setContent("我是设置的内容。。。。。。");
			if(!$.trim(html)){
				alert("没有内容,请输入内容！");
			}else{
				html = $.trim(html);
				var sendMsgWebchatData={
					"serialNo":"123456789",
					"msgType":"001",
                    "mediaTypeId": "01",
					"senderFlag":"1",
				    "content":html,
			        "originalCreateTime":"2017-04-08 17:03:00",
			        "channelID":"080007",
                    "nickName":"13103617220",
                    "contentTxt":txt,
                    "msgId":"1",
                    "url":""
				}
				this.sendMsg(sendMsgWebchatData);

				editor.ue.setContent("");
				editor.ue.focus();
			}
		},
		sendMsg: function(data) {
            serialNo = data.serialNo;
            var $chatShow =this.$el.find('.chat-show');
            var chatArea = new ChatArea(_index);
            chatArea.createChatArea({
                originalCreateTime: data.originalCreateTime,
                content: data.content,
                mediaTypeId: data.mediaTypeId,
                msgType: data.msgType,
                senderFlag: data.senderFlag,
                serialNo: data.serialNo,
                channelID: data.channelID,
                nickName: data.nickName,
                msgId:data.msgId,
                url:data.url,
                duration:"",
                callerNo:"",
                contactStartTime:"",
                staffId:"117",
                txt:data.contentTxt
            }, $chatShow);
        }
    });
	return object;
});
