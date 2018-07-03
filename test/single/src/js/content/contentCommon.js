/*
  方法：
    createChartWrapIn 创建静态页面（不包括会话编辑区）
    distoryChatWrap 销毁页面
*/
define(['Util',
    './content',
    './mediaMessage',
    './chatArea/chatArea',
    './editArea/editArea',
    '../index/constants/mediaConstants'
], function(Util, ContentObj, MediaMessage, ChatArea, Editareaa, MediaConstants) {
    var _index;
    var editArea;
    //所有的表情集合
    var expressionMap = {};
    //所有的表情中文集合
    var expressionMapValue = {};
    //所有的表情中文对应key
    var expressionDescMapValue = {};
    var entry = {};
    var loginEntry = {};
    var channelEntry = {};
    var mediaEntry = {};
    var opserialno;
	var startNum;
    var initialize = function(options) {
	    startNum=MediaConstants.STARTNUM;
	    opserialno=1;
        _index = options._index;

        this.options = options;
        $.extend(this.options._index, {
            contentCommon: this
        });
        this._event = {};
        this.$el = $(this.options.el);
        
       /* //所有的表情集合
        this.expressionMap = {};
        //所有的表情中文集合
        this.expressionMapValue = {};
        //所有的表情中文对应key
        this.expressionDescMapValue = {};*/
        this.clientInPanels = {};
        this.getExp();
        this.getChannelURL();
        this.getMediaURL();
        this.getLoginInfo();
        /*this.entry = entry;
        this.loginEntry = loginEntry;
        this.mediaEntry = mediaEntry;*/
        this.cloneCurrentQueueData = {};
    };

    $.extend(initialize.prototype, {
    	//判断是否存在内容区
        hasInPanel: function(serialNo) {
            return this.clientInPanels[serialNo];
        },
        //请求返回登录信息
        getLoginInfo: function() {
            if (!$.isEmptyObject(loginEntry)) {
                return loginEntry;
            };
            $.getJSON('../../data/content/getLoginInfo.json', {}, function(json, status) {
                if (status) {
                    if (json.bean.loginURL) {
                        loginEntry["loginURL"] = json.bean.loginURL;
                    };
                    if (json.bean.logoutURL) {
                        loginEntry["logoutURL"] = json.bean.logoutURL;
                    }
                } else {
                	return;
                }
            });
            return loginEntry;
        },
        //隐藏聊天区内容并保存聊天输入区内容
        hideAllChartWrapIn: function() {
            var chatWarps = this.$el.find('.hl_chatWrap');
            $.each(chatWarps, function(i, panel) {
                var serialNo = $(this).prop('id').substring(10);
                _index.contentCommon.clientInPanels[serialNo].editContent = editArea.editor.ue.getContent();
                //保存回话的滚动高度
                _index.contentCommon.clientInPanels[serialNo].scrollHeight = $('#chartWarp_' + serialNo).find('.chat-area')[0].scrollTop;
            });

            this.$el.find('.hl_chatWrap').detach();
        },
        //显示对应流水号的聊天区内容，显示对应的保存聊天狂内容的对话内容
        showChartWrapIn: function(serialNo) {
            this.hideAllChartWrapIn();
            var clientPanel = this.clientInPanels[serialNo];
            if (clientPanel) {
                clientPanel.$chatWarp.prependTo(this.$el.find('.uiTabItemBody')[0]);
                setTimeout($.proxy(function() {
                    editArea.editor.ue.setContent(clientPanel.editContent);
                    _index.chatTools.initData();
                }, this), 0);
                //_index.chatTools.initData();
                this.scrollChatArea(serialNo,clientPanel.scrollHeight);
                this.currentInPanel = clientPanel;
            }
        },
        //创建静态页面
        createChartWrapIn: function(data) {
            require(['./editArea/editArea'], $.proxy(function(EditArea) {
                if (!editArea) {
                    editArea = new EditArea({ el: this.$el, _index: _index });//初始显示编辑框富文本区域
                    _index.chatTools.initData();
                }
            }, this));
            if (this.hasInPanel(data.serialNo)) {
                return;
            }
            var $content = new ContentObj(_index, data);
            this.currentInPanel = this.clientInPanels[data.serialNo] = {
                $chatWarp: $content,
                editContent: '',
                scrollHeight: 0
            };
            this.$content = $content;

        },
        //添加销毁静态页面的方法
        distoryChatWrap: function(serialNo) {
            var id = 'chartWarp_' + serialNo;
            this.$el.find("#" + id).remove();
        },
        saveMessage: function(message) {
            _index.queue.list[message.serialNo].itemArr.push(message);
        },
        //接收用户消息
        receiveMsg: function(data) {
            var $chatWrap_el = _index.contentCommon.clientInPanels[data.serialNo].$chatWarp;
            var $chatShow = $chatWrap_el.find('.chat-show');
            var messageData = {
                callerNo:_index.CallingInfoMap.get(data.serialNo).getCallerNo(),
                originalCreateTime: data.originalCreateTime,
                content: data.content,
                url: data.url,
                mediaTypeId: data.mediaTypeId,
                channelID: data.channelID,
                msgType: data.msgType,
                serialNo: data.serialNo,
                msgId: data.messageId,
                nickName: data.nickName,
                duration: data.duration ? Math.round(data.duration) : '',
                mSeriaNo: data.mseriano,
                senderFlag: data.senderFlag
            }

            var chatArea = new ChatArea(_index);
            chatArea.createChatArea(messageData, $chatShow);

        },
        //机器人消息
        sendHtmlMsg: function(data) {
            var $chatWrap_el = _index.contentCommon.clientInPanels[data.serialNo].$chatWarp;
            var $chatShow = $chatWrap_el.find('.chat-show');
            var messageData = {
                originalCreateTime: data.originalCreateTime,
                content: data.content,
                url: "",
                mediaTypeId: data.mediaTypeId,
                channelID: data.channelID,
                msgType: data.msgType,
                serialNo: data.serialNo,
                messageId: data.msgId,
                nickName: data.nickName,
                duration: data.duration ? Math.round(data.duration) : '',
                mSeriaNo: data.mseriano,
                senderFlag: data.senderFlag
            }

            var chatArea = new ChatArea(_index);
            chatArea.createChatArea(messageData, $chatShow);
            return true;
        },
        //消息发送
        sendMsg: function(data) {
            serialNo = data.serialNo;
            var callingInfo = _index.CallingInfoMap.get(serialNo);
            var channelId = callingInfo.getChannelID();
            var time = callingInfo.getCallIdTime();
            var dsn = callingInfo.getCallIdDsn();
            var handle = callingInfo.getCallIdHandle();
            var server = callingInfo.getCallIdServer();
            var createTime = _index.utilJS.getCurrentTime();
            var callerNo = callingInfo.getCallerNo();
            var channelName = callingInfo.getChannelName();
            var contactStartTime = callingInfo.getContactStartTime();
            var staffId = _index.getUserInfo().staffId;
            var messageData = {
                serialNo: serialNo,
                sendMsg: {
                    callId: {
                        time: time,
                        dsn: dsn,
                        handle: handle,
                        server: server
                    },
                    dataMode: "0",
                    dataMessage: {
                        content: data.contentTxt.replace(/(^[ \t\n\r]+)|([ \t\n\r]+$)/g, '').replace(/[\r\n]/g, ""),
                        url: data.url,
                        msgType: data.msgType,
                        channelID: channelId,
                        createTime: createTime,
                        msgId:data.msgId
                    }

                },
                senderFlag: data.senderFlag
            }
            var sendMsg = new MediaMessage(_index, messageData);
            var flag = sendMsg.sendMessages(messageData);
            if (flag == '0') {
                //如果静态页面没有被创建，则不显示发送item
                if (_index.contentCommon.clientInPanels[serialNo]) {

                    var $chatWrap_el = _index.contentCommon.clientInPanels[data.serialNo].$chatWarp;
                    var $chatShow = $chatWrap_el.find('.chat-show');
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
                        duration:data.duration,
                        callerNo:callerNo,
                        contactStartTime:contactStartTime,
                        staffId:staffId,
                        txt:data.contentTxt
                    }, $chatShow);
                } else {
                    this.saveMessage(data);
                }
                //设置会话对象属性
                if (data.senderFlag == MediaConstants.SENDER_FLAG_SEAT) { //座席
                    _index.queue.list[serialNo].hasTip = true;
                  	 _index.queue.list[serialNo].changeTip = true;
                  	 _index.queue.list[serialNo].hasWaitMsg = false;
                    clearInterval(_index.queue.list[data.serialNo].timer);
                    _index.queue.list[data.serialNo].startTimer();
                    if(_index.queue.list[data.serialNo].hasOwnProperty('waring')){
                        clearInterval(_index.queue.list[data.serialNo].waring);
                    }
                    _index.queue.list[data.serialNo].setColor('normal');
                }
                return true;
            } else if (flag == '150001') {
            	_index.popAlert('发送失败,请检查网络重新签入!');
            } else if (flag == '150005') {
            	_index.popAlert('用户已离线,发送失败!');
            } else if (flag == '150024') {
            	_index.popAlert('内容过长，发送失败！')
            }
        },
        //微博发送
        sendMsgWeibo: function(data) {
        	var serialNo=_index.CallingInfoMap.getActiveSerialNo();
            var callingInfo = _index.CallingInfoMap.get(serialNo);
            var channelId = callingInfo.getChannelID();
            var callerNo = callingInfo.getCallerNo();
            var contactStartTime = callingInfo.getContactStartTime();
            var transforData = _index.utilJS.getCurrentTime();
            var nowTime = new Date(transforData.replace(/-/g, "/"));
            var createTime = nowTime.getTime();
            var sendData = data.contentTxt;
            var msgType = "text";
            var replyStaffId = _index.CTIInfo.workNo;
            var fromOrgId = callingInfo.getFromOrgId();
            var clientId = callingInfo.getClientId();
            var msgId = this.getMsgId(startNum);
            var cSeq = opserialno;
            var userInfo = _index.getUserInfo();
            var staffId = _index.getUserInfo().staffId;
            var ctiId = callingInfo.getCtiId();
			var ccId = callingInfo.getCcId();
			var vdnId = callingInfo.getVdnId();
			var callId = callingInfo.getCallId();
			var callIdTime = callingInfo.getCallIdTime();
			var callIdDsn = callingInfo.getCallIdDsn();
			var callIdHandle = callingInfo.getCallIdHandle();
			var callIdServer = callingInfo.getCallIdServer();
			var callSkillId = callingInfo.getSkillId()?callingInfo.getSkillId():"";
			var calledNo = callingInfo.getCalledNo();
			var CTICallId = callIdTime+"-"+((callIdServer<<24)+(callIdHandle<<16)+callIdDsn);
         	var serviceTypeId = _index.CTIInfo.serviceTypeId;
         	var staffProvinceId = _index.getUserInfo().proviceId;
            var bindedPhoneNumber = _index.chatTools.content.find("#listWrap li.microBlog").attr("data-phoneNumber")?
            		_index.chatTools.content.find("#listWrap li.microBlog").attr("data-phoneNumber"):"";
    		var channelName;
         	var mediaTypeName;
			var channelInfo = _index.contentCommon.getChannelInfo(_index.contentCommon.cloneCurrentQueueData.channelID);
			 if(channelInfo){
				 channelName = channelInfo.channelName;
			 }
			 var mediaTypeInfo = _index.contentCommon.getMediaInfo(MediaConstants.MICROBLOGGING_TYPE);
			 if(mediaTypeInfo){
				 mediaTypeName=mediaTypeInfo.mediaTypeName;
			 }else{
				 mediaTypeName="";
			 }
			 
            if(channelId == MediaConstants.MICROBLOGGING_CH || channelId == MediaConstants.MICROBLOGGING_CHA || 
            		channelId == MediaConstants.MICROBLOGGING_CHAL){
            	//weibo实时会话
            	var fromUserName = callingInfo.getToUserId();
            	var toUserName = callingInfo.getCallerNo();
            	this.sendMsg(data);
            }else{
            	//weibo主动下发
            	var multiAccoutlists = callingInfo.getMultiAccountList();
            	for(var i=0,len=multiAccoutlists.length;i<len;i++){
            		var multiAccoutlist = multiAccoutlists[i];
            		if(multiAccoutlist.mediaTypeId=="09"){
            			var toUserName = multiAccoutlist.accountId;
            		}
            	}
            	var dataType = {
						"weiXinType":MediaConstants.WEIXIN_TYPE,
						"microBloggingType":MediaConstants.MICROBLOGGING_TYPE
				}
            	//此处为同步请求
            	Util.ajax.postJson('front/sh/media!execute?uid=activeMsg001',dataType,function(json,status){
					if (status) {
						for(var i=0,len=json.beans.length;i<len;i++){
							var jsonData = json.beans[i];
							if(jsonData.channelId == _index.contentCommon.cloneCurrentQueueData.channelID){
								 fromUserName = jsonData.accountId;
							}
						}
					}else{
                    	//失败提示
                    	_index.popAlert(json.returnMessage);
                    }
				},true);

	   			 var serialNoWBData=null;
	   			 var params ={"skillDesc":"","ctiId":"","ccId":"","vdnId":""};
	                //ajax同步：使用同步获取serialNo，没有serialNo会话直接报错
	           	Util.ajax.postJson("front/sh/media!execute?uid=randomSerialNo",params, function(json, status) {
	   				if (status) {
	   					serialNoWBData = json.bean.serialNo;
	   				}else{
	   					return;
	   				}
	   			},true);
            	var weiboData = {
            			"serialNo":serialNoWBData,//生成一个新的流水号
              		  "contactId":callingInfo.getContactId(),
                        "fromUserName": fromUserName,
                        "toUserName": toUserName,
                        "replyStaffId": replyStaffId,
                        "cSeq": cSeq,
                        "msgId": msgId,
                        "msgType": msgType,
                        "data": _index.contentCommon.filterSpecialCharacter(sendData.replace(/(^[ \t\n\r]+)|([ \t\n\r]+$)/g, '')),
                        "createTime": createTime,
                        "channelId": _index.contentCommon.cloneCurrentQueueData.channelID,
                        "fromOrgId": fromOrgId,
                        "clientId": clientId,
                        "userInfo":JSON.stringify(userInfo)
                    };

                    Util.ajax.postJson("front/sh/media!execute?uid=pushMessage", weiboData, function(json, status) {
                        if (status) {
                                if (json.returnCode == "00000") {
                                	var staffProviceId = _index.getUserInfo().proviceId;
                                    var $chatWrap_el = _index.contentCommon.clientInPanels[data.serialNo].$chatWarp;
                                    var $chatShow = $chatWrap_el.find('.chat-show');
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
        		                        callerNo:callerNo,
        		                        contactStartTime:contactStartTime,
        		                        staffId:staffId
                                    }, $chatShow);
                                    //写入接触信息
                                    var params={
                       					 "serialNo":serialNoWBData,
            							 "contactId":callingInfo.getContactId(),
                       					 "CTIId":ctiId,
                       					 "ccid":ccId,
                       					 "VDNId":vdnId,
                       					 "callId":callId,
                       					 "callIdTime":callIdTime,
                       					 "callIdDsn":callIdDsn,
                       					 "callIdHandle":callIdHandle,
                       					 "callIdServer":callIdServer,
                       					 "callSkillId":callSkillId,
                       					 "callerNo":callerNo,//主叫号码
                       				     "calledNo":calledNo,//被叫号码
                       					 "staffId":staffId,
                       					 "serviceTypeId":serviceTypeId,
                       					 "staffProvinceId":staffProvinceId,
                       					 "channelId":_index.contentCommon.cloneCurrentQueueData.channelID,
                       					 "channelName":channelName,
                       					 "mediaTypeId":MediaConstants.MICROBLOGGING_TYPE,//微博
                       					 "mediaTypeName":mediaTypeName,
                    					 "toUserId":"",
                       					 "toUserName":callerNo,//多媒体公众号名称，用于报表统计
                       					 "fromOrgId":fromOrgId,
                       					 "contactStartTime":transforData,
                       					 "callType":MediaConstants.SENDER_FLAG_SEAT,//呼叫类型。取值含义： 0：呼入 1：呼出
                       					 "playRecordFlag":"0",
                       					 "QCFlag":"0",
                       					 "userSatisfy":"0",
                       					 "hasRecordFile":"0",
                       					 "srFlag":"0",//服务请求创建标记
                       					 "bindedPhoneNumber":bindedPhoneNumber,
                       					 "dataType":"contact_insert",
                       					 "provinceId" : _index.getUserInfo().provinceId?_index.getUserInfo().provinceId:"",//呼叫中心属于省份ID
                       					 "orgCallerNo" : callerNo?callerNo:"",//原始主叫 (默认为客户电话或多媒体账号)  技能队列 工号列表
                       					 "orgCalledNo" : "10086",//原始被叫(默认为10086) 技能队列 工号列表
                       					 "remark" : "",//备注信息
                       					 "qcStaffId" : "",//质检代表帐号
                       					 "userSatisfy2" : "",//二次满意度结果
                       					 "userSatisfy3" : "",//互联网二次满意度调查结果
                       					 "custId" : clientId?clientId:"",//客户id
                       					 "staffCityId" : "",//员工地市编号
                       					 "ctiCallId" : CTICallId?CTICallId:"",//CTI已偏移运算后的callid
                       					 "workNo" : _index.CTIInfo.workNo?_index.CTIInfo.workNo:""//平台工号
                       			 }
                       			 Util.ajax.postJson("front/sh/common!execute?uid=touch001",params,function(json,status){
                       				 if(status){
                       					 console.log("主动下发微博接触入库成功！contentCommon.js");
                       				 }else{
                       					 console.log("主动下发微博接触入库失败！contentCommon.js");
                       				 }
                       			 });
                                } else {
                                }
                        }else{
                        	//发送失败提示
                        	_index.popAlert(json.returnMessage);
                        }
                    });
            }
			opserialno=opserialno+1;
			startNum = startNum +1;
			if(opserialno>65535)
			{
				opserialno=1;
			}
        },
        //发送短信
        sendMsgShortM:function(data){
        	var serialNo=_index.CallingInfoMap.getActiveSerialNo();
        	var callingInfo = _index.CallingInfoMap.get(serialNo);
            var fromOrgId = callingInfo.getFromOrgId();
            var clientId = callingInfo.getClientId();
            var msgId = this.getMsgId(startNum);
            var fromUserName = callingInfo.getToUserId();
        	var toUserName = callingInfo.getCallerNo();
        	var _this = this;
			 var serialNoDXData=null;
			 var params ={"skillDesc":"","ctiId":"","ccId":"","vdnId":""};
             //ajax同步：使用同步获取serialNo，没有serialNo会话直接报错
        	Util.ajax.postJson("front/sh/media!execute?uid=randomSerialNo",params, function(json, status) {
				if (status) {
					serialNoDXData = json.bean.serialNo;
				}else{
					return;
				}
			},true);
        	var esbData={
        		  "serialNo":serialNoDXData,//生成一个新的流水号
        		  "contactId":callingInfo.getContactId(),
          		  "smsContent":data.contentTxt,
          		  "smsCode":"",//data.nickName?data.nickName:_index.chatTools.content.find("#listWrap li.shortMsg").attr("data-phoneNumber"),
          		  "msgType":"0199999999",
          		  "effectiveDate":data.originalCreateTime,
          		  "subPort":"",
          		  "opId":_index.CTIInfo.workNo,//_index.getUserInfo().staffId,//_index.CTIInfo.workNo,
          		  "smsType":"15", //客服界面人工下发短信免打扰
                  "fromOrgId": fromOrgId,
                  "clientId": clientId,
                  "msgId": msgId,
                  "fromUserName": fromUserName,
                  "toUserName": toUserName,
                  "channelId":_index.contentCommon.cloneCurrentQueueData.channelID,
                  "replyStaffId": _index.CTIInfo.workNo
          	};
        	if(data.nickName&&RegExp("^0?(13|15|17|18|14)[0-9]{9}$").test(data.nickName)){
        		esbData.smsCode = data.nickName;
        	}else{
        		esbData.smsCode = _index.chatTools.content.find("#listWrap li.shortMsg").attr("data-phoneNumber");
        	}
          	//调用短信接口发送短信
             Util.ajax.postJson('front/sh/media!execute?uid=sendMessage',esbData,function(json,status){
              	if (status) {
              		_index.popAlert("发送成功！");
              		var serialNo=_index.CallingInfoMap.getActiveSerialNo();
		            var callingInfo = _index.CallingInfoMap.get(serialNo);
		            var callerNo = callingInfo.getCallerNo();
              		var staffId = _index.getUserInfo().staffId;
              		var $chatWrap_el = _index.contentCommon.clientInPanels[data.serialNo].$chatWarp;
                    var $chatShow = $chatWrap_el.find('.chat-show');
                    var chatArea = new ChatArea(_index);
                    chatArea.createChatArea({
                        originalCreateTime: data.originalCreateTime,
                        content: data.contentTxt,
                        mediaTypeId: data.mediaTypeId,
                        msgType: data.msgType,
                        senderFlag: data.senderFlag,
                        serialNo: data.serialNo,
                        channelID: data.channelID,
                        nickName: data.nickName,
                        msgId:data.msgId,
                        callerNo:callerNo,
                        staffId:staffId
                    }, $chatShow);
                    //接触数据入库
              		_this.insertContact(data,esbData);
      			}else{
      				
      				_index.popAlert("发送失败!");
      			}
             });
             startNum = startNum +1;
        },
        //入库短信接触信息
        insertContact:function(data,esbData){
         	var SMScontent = data.contentTxt;
        	var serialNo=_index.CallingInfoMap.getActiveSerialNo();
            var CallingInfo = _index.CallingInfoMap.get(serialNo);
            var ctiId = CallingInfo.getCtiId();
			var ccId = CallingInfo.getCcId();
			var vdnId = CallingInfo.getVdnId();
			var callId = CallingInfo.getCallId();
			var callIdTime = CallingInfo.getCallIdTime();
			var callIdDsn = CallingInfo.getCallIdDsn();
			var callIdHandle = CallingInfo.getCallIdHandle();
			var callIdServer = CallingInfo.getCallIdServer();
			var callSkillId = CallingInfo.getSkillId();
			var calledNo = CallingInfo.getCalledNo();
			var CTICallId = callIdTime+"-"+((callIdServer<<24)+(callIdHandle<<16)+callIdDsn);
         	var transforData = _index.utilJS.getCurrentTime();
         	var replyStaffId = _index.getUserInfo().staffId;
         	var callerNo = CallingInfo.getToUserId();
         	var calledNo = CallingInfo.getCallerNo();
         	var serviceTypeId = _index.CTIInfo.serviceTypeId;
         	var staffProvinceId = _index.getUserInfo().proviceId;
            var fromOrgId = CallingInfo.getFromOrgId();
            var staffId = _index.getUserInfo().staffId;
            var clientId = CallingInfo.getClientId();
			var channelName;
         	var mediaTypeName;
			var channelInfo = _index.contentCommon.getChannelInfo(_index.contentCommon.cloneCurrentQueueData.channelID);
			 if(channelInfo){
				 channelName = channelInfo.channelName;
			 }
			 var mediaTypeInfo = _index.contentCommon.getMediaInfo(MediaConstants.SHORT_MESSAGE_TYPE);
			 if(mediaTypeInfo){
				 mediaTypeName=mediaTypeInfo.mediaTypeName;
			 }else{
				 mediaTypeName="";
			 }
                 	
         	var params={
					 "serialNo":esbData.serialNo,
					 "contactId":CallingInfo.getContactId(),
					 "CTIId":ctiId,
					 "ccid":ccId,
					 "VDNId":vdnId,
					 "callId":callId,
					 "callIdTime":callIdTime,
					 "callIdDsn":callIdDsn,
					 "callIdHandle":callIdHandle,
					 "callIdServer":callIdServer,
					 "callSkillId":callSkillId,
					 "callerNo":callerNo,//主叫号码
				     "calledNo":calledNo,//被叫号码
					 "staffId":staffId,
					 "serviceTypeId":serviceTypeId,
					 "staffProvinceId":staffProvinceId,
					 "channelId":_index.contentCommon.cloneCurrentQueueData.channelID,
					 "channelName":channelName,
					 "mediaTypeId":MediaConstants.SHORT_MESSAGE_TYPE,//短信
					 "mediaTypeName":mediaTypeName,
					 "toUserId":"",
					 "toUserName":callerNo,//多媒体公众号名称，用于报表统计
					 "fromOrgId":fromOrgId,
					 "contactStartTime":transforData,
					"callType":MediaConstants.SENDER_FLAG_SEAT,//呼叫类型。取值含义： 0：呼入 1：呼出
					 "playRecordFlag":"0",
					 "QCFlag":"0",
					 "userSatisfy":"0",
					 "hasRecordFile":"0",
					 "bindedPhoneNumber":esbData.smsCode?esbData.smsCode:'',
					 "dataType":"contact_insert",
					 "provinceId" : _index.getUserInfo().provinceId?_index.getUserInfo().provinceId:"",//呼叫中心属于省份ID
					 "orgCallerNo" : callerNo?callerNo:"",//原始主叫 (默认为客户电话或多媒体账号)  技能队列 工号列表
					 "orgCalledNo" : "10086",//原始被叫(默认为10086) 技能队列 工号列表
					 "remark" : "",//备注信息
					 "qcStaffId" : "",//质检代表帐号
					 "userSatisfy2" : "",//二次满意度结果
					 "userSatisfy3" : "",//互联网二次满意度调查结果
					 "custId" : clientId?clientId:"",//客户id
					 "staffCityId" : "",//员工地市编号
					 "ctiCallId" : CTICallId?CTICallId:"",//CTI已偏移运算后的callid
					 "srFlag":"0",//服务请求创建标记
					 "workNo" : _index.CTIInfo.workNo?_index.CTIInfo.workNo:""//平台工号
			 }
			 Util.ajax.postJson("front/sh/common!execute?uid=touch001",params,function(json,status){
				 if(status){
					 console.log("主动下发短信接触入库成功！contentCommon.js");
				 }else{
					 console.log("主动下发短信接触入库失败！contentCommon.js");
				 }
			 });
         },
    	//前台生产流水号
        getSerialNo:function () {
    		var date = new Date();
    		var month = date.getMonth() + 1;
    		var strDate = date.getDate();
    		var hour = date.getHours();
    		var min = date.getMinutes();
    		var second = date.getSeconds();
    		var millisecond = date.getMilliseconds();
    		var timeSeconds = date.getTime();
    		if (month >= 1 && month <= 9) {
    			month = "0" + month;
    		}
    		if (strDate >= 0 && strDate <= 9) {
    			strDate = "0" + strDate;
    		}
    		if (hour >= 0 && hour <= 9) {
    			hour = "0" + hour;
    		}
    		if (min >= 0 && min <= 9) {
    			 min = "0" + min;
    		}
    		if (second >= 0 && second <= 9) {
    			second = "0" + second;
    		}
    		if(millisecond >= 0 && millisecond <= 9){
    			millisecond="00"+millisecond;
    		}
    		if(millisecond >=10 && millisecond <= 99){
    			millisecond="0"+millisecond;
    		}
    		var timeStr = date.getFullYear() + month + strDate + hour + min + second + millisecond;
    		var staffId = _index.getUserInfo().staffId;
    		var temp = staffId+timeStr;
    		var num = 30-temp.length;
    		var subStr = (timeSeconds+"").substr(-num);
    		var serialNo = temp + subStr;
    		return serialNo;
    	},
        getMsgId: function(startNum) {
            var date = new Date();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentTime = date.getFullYear() + month +
                strDate + date.getHours() +
                date.getMinutes() + date.getSeconds();
            return currentTime + startNum;
        },
        /*获取渠道图标by channelId*/
        getChannelURL: function(channelId) {
            var channelInfo;
            $.getJSON('../../data/content/channelId.json', { "channelId": channelId }, function(json, status) {
                if (status) {
                    if (channelId == null || channelId == "") {
                        channelInfo = json.beans;
                        var num = 0;
                        for (var prop in channelInfo) {
                            var channelId = channelInfo[prop].channelId ? channelInfo[prop].channelId : "null" + num + 1;
                            channelEntry[channelId] = channelInfo[prop];
                        }
                    } else {
                        channelInfo = json.bean;
                    }
                } else {
                	return;
                }
            });
            return channelInfo;
        },
        /**
         * 根据媒体类型ID获取对应图标  by 张云天
         * @param  {[type]} mediaTypeId [媒体ID]
         */
        getMediaURL: function(mediaTypeId) {
            var mediaInfo;
            $.getJSON('../../data/content/mediaTypeId.json', { "mediaTypeId": mediaTypeId }, function(json, status) {
                if (status) {
                    if (mediaTypeId == null || mediaTypeId == "") {
                        mediaInfo = json.beans;
                        var num = 0;
                        for (var prop in mediaInfo) {
                            var mediaTypeId = mediaInfo[prop].mediaTypeId ? mediaInfo[prop].mediaTypeId : "null" + num + 1;
                            mediaEntry[mediaTypeId] = mediaInfo[prop];
                        }
                    } else {
                        mediaInfo = json.bean;
                    }
                } else {
                	return;
                }
            });
            return mediaInfo;
        },
        /**
         * 根据渠道ID获取渠道信息 by 张云天
         */
        getChannelInfo: function(channelId) {
            var channelInfo;
            if (channelId && "" != channelId) {
                if (channelId in channelEntry) {
                    channelInfo = channelEntry[channelId];
                }
            }
            return channelInfo;
        },
        /**
         * 获取媒体类型信息 by 张云天
         */
        getMediaInfo: function(mediaTypeId) {
            var mediaInfo;
            if (mediaTypeId && "" != mediaTypeId) {
                if (mediaTypeId in mediaEntry) {
                    mediaInfo = mediaEntry[mediaTypeId];
                }
            }
            return mediaInfo;
        },
        /**
         * 根据媒体类型和渠道ID获取图标 by 张云天
         */
        getLogoURL: function(channelId, mediaTypeId) {
            var unknownLogoURL = "src/assets/img/content/chatArea/unknown.png";
            var logoURL;
            if (channelId && "" != channelId) {
                if ("channel" + channelId in entry) {
                    logoURL = entry["channel" + channelId];
                    if (logoURL != null) {
                        return logoURL;
                    }
                } else {
                    channelInfo = this.getChannelInfo(channelId);
                    if (channelInfo && channelInfo.logoURL) {
                        entry["channel" + channelId] = channelInfo.logoURL;
                        return channelInfo.logoURL;
                    }
                }

            }
            if (mediaTypeId && "" != mediaTypeId) {
                if ("media" + mediaTypeId in entry) {
                    logoURL = entry["media" + mediaTypeId];
                    if (logoURL != null) {
                        return logoURL;
                    }
                } else {
                    mediaInfo = this.getMediaInfo(mediaTypeId);
                    if (mediaInfo && mediaInfo.logoURL) {
                        entry["media" + mediaTypeId] = mediaInfo.logoURL
                        return mediaInfo.logoURL;
                    }
                }
            }
            return unknownLogoURL;
        },
        /**
         * 从缓存中获取所有表情 by 张云天
         */
        getExp: function() {
            $.getJSON('../../data/content/contentCommon.json', '', function(data, status) {
                if (status) {
                    expressionMap = data.object;
                    expressionMapValue = data.bean.expressionVal;
                    if (typeof expressionMapValue == "object") {
                        for (i in expressionMapValue) {
                            if (expressionMapValue.hasOwnProperty(i)) {
                                var mapValue = expressionMapValue[i];
                                var descMapValue = {};
                                if (typeof mapValue == "object") {
                                    for (m in mapValue) {
                                        if (mapValue.hasOwnProperty(m)) {
                                            var mv = mapValue[m];
                                            if (mv) {
                                                descMapValue[mv] = m;
                                            }
                                        }
                                    }
                                }
                                expressionDescMapValue[i] = descMapValue;
                            }
                        }
                    }
                }else{
                	return;
                }
            })
        },
        //获取所有的表情数据
        getAllExpression: function() {
            return expressionMap;
        },
        //获取所有的表情数据
        getAllExpressionValue: function() {
            return expressionMapValue;
        },
        //获取所有的中文表情数据
        getAllExpressionDescValue: function() {
            return expressionDescMapValue;
        },
        //客户端表情转换成中文描述
        parseKeyToFace: function(content) {
            var changeContent = content.content;
            var expressionMap = {};
            var expressionMapValue = {}; //对应中文描述
            if (MediaConstants.WEIXIN_TYPE == content.mediaTypeId) {
                expressionMap = this.getAllExpression()[MediaConstants.MEDIA_ONLINE_SERVICE];
                expressionMapValue = this.getAllExpressionValue()[MediaConstants.MEDIA_ONLINE_SERVICE];
            } else {
                expressionMap = this.getAllExpression()[content.mediaTypeId];
                expressionMapValue = this.getAllExpressionValue()[content.mediaTypeId];
            }

            var reg;
            // 解析消息中的WebChat表情
            if (MediaConstants.MEDIA_ONLINE_SERVICE == content.mediaTypeId) {
                reg = new RegExp("\\[em_\\d{1,}\\]", "g");
            }
            // 解析消息中的微信表情
            else if (MediaConstants.WEIXIN_TYPE == content.mediaTypeId) {
                //  reg = new RegExp("\\[/:.*\\]", "g");
                reg = new RegExp("\\[em_\\d{1,}\\]", "g");
            }
            // 解析消息中的微博表情
            else if (MediaConstants.MICROBLOGGING_TYPE == content.mediaTypeId) {
                reg = new RegExp("\\[[a-zA-Z]*[\u4e00-\u9fa5]*[a-zA-Z]*\\]", "g");
            }

            if (!reg) {
                return changeContent;
            }

            var result = changeContent.match(reg);

            if (null != result && "" != result) {
                for (var i = 0; i < result.length; i++) {
                    var value = content.parseMode ? expressionMapValue[result[i]] : expressionMap[result[i]];

                    if (null == value || "" == value) {
                        continue;
                    }

                    value = content.parseMode ? value : "<img src = '" + value + "'>";

                    changeContent = changeContent.replace(result[i], value);
                }
            }

            return changeContent;
        },
        //处理客户端信息中的[enter]转换成<br/>
        parseContentForEnter: function(content) {
            if (!content) return '';
            var contents = content.split('[enter]');
            var len = contents.length;
            var convertedContent = "";
            for (var i = 0; i < len; i++) {
                convertedContent = convertedContent + contents[i];
                if (i + 1 < len && contents[i + 1] && contents[i + 1].replace(/\s/g, '')) {
                    convertedContent = convertedContent + "<br/>";
                }
            }
            if (convertedContent.indexOf("<br/>") == 0) {
                convertedContent = convertedContent.substring(5, convertedContent.length);
            }
            return convertedContent;
        },
        //超链接识别,防止重定向
        parseContentForHrefWithTag: function(content) {
            if (!content) return '';
            content = content.replace(/\[apos\]/g, "'");
            content = content.replace(/\[quot\]/g, "\"");
            //超链接识别,如果超链接中没有target 就添加，防止将当前页面重定向
            var re1 = /<a href=/ig;
            var re2 = / target=/ig;
            if (content.match(re1) && !content.match(re2)) {
                content = content.replace(re1, function($0) {
                    return "<a target='_blank' href="
                });
            }
            return content;
        },
        //超链接和url识别并处理
        parseContentForHref: function(content) {
            if (!content) return '';
            var reg1 = /<a[^>]+?href=[\"']?([^\"']+)[\"']?[^>]*>([\w\W]+)<\/a>/gi;
            var reg2 = /((http|ftp|https):\/\/)?[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/gi;
            var reg3 = /^[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/i;
            var reg4 = /^[\w\-_]+(\.[\w\-_]+){2,4}$/i;
            var reg5 = /^([\w\-]*\d[\w\-]*)+(\.[\w\-_]+){2,4}$/i;
            var rps = new Array();
            content = content.replace(/\[apos\]/g, "'");
            content = content.replace(/\[quot\]/g, "\"");
            var b1 = reg1.test(content);
            var b2 = reg2.test(content);
            if (!b1 && !b2) return content;

            if (b1) {
                var result = content.match(reg1);
                for (var i = 0; i < result.length; i++) {
                    content = content.replace(result[i], "[parseHref" + i + "]");
                    rps[i] = this.parseContentForHrefWithTag(result[i]);
                }
            }

            content = content.replace(reg2, function($1) {
                var $2 = reg3.test($1) ? "http://" + $1 : $1;
                return reg3.test($1) && (!reg4.test($1) || reg5.test($1)) ? $1 : '<a target="_blank" href="' + $2 + '">' + $1 + '</a>';
            });

            for (var i = 0; i < rps.length; i++) {
                content = content.replace("[parseHref" + i + "]", rps[i]);
            }
            return content;
        },
        //克隆一对象
        cloneObject: function(obj) {
            if (typeof obj != 'object') return {};
            var o = {};
            for (i in obj) {
                if (obj.hasOwnProperty(i)) {
                    o[i] = obj[i];
                }
            }
            return o;
        },
        //转换客户端发送图片消息的地址去掉首个/字符
        parseClientPicturePath: function(path) {
            var reg = /(^\/+)/;
            return path = !path ? "" : path.replace(reg, "");
        },
        //过滤内容中的特殊符号如英文引号等
        filterSpecialCharacter: function(content) {
            content = content.replace(/'/g, "[apos]");
            content = content.replace(/\"/g, "[quot]");
            content = content.replace(/\"(.*?)\"/g, "“$1”");
            content = content.replace(/&quot;(.*?)&quot;/g, "“$1”");
            content = content.replace(/&amp;quot;(.*?)&amp;quot;/g, "“$1”");
            content = content.replace(/\"/g, "“");
            content = content.replace(/&quot;/g, "“");
            content = content.replace(/&amp;quot;/g, "“");
            content = content.replace(/\\/g, "\\\\");
            return content;
        },
        getCurrentTime: function(formatStr) {
            var timeNow = new Date();
            var format = formatStr ? formatStr : "";
            var clientTime = this.dateFormat(timeNow, "yyyy-MM-dd hh:mm:ss.S");
            var serverTime = "";
            $.ajax({
                url: "front/sh/common!getServerTime?uid=util001",
                type: 'post',
                async: false,
                timeout: 1000,
                data: { "clientTime": clientTime, "format": format },
                success: function(jsonData) {
                    if (jsonData.bean) {
                        serverTime = jsonData.bean.serverTime;
                        difference = jsonData.bean.difference;
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    var xhrTime = XMLHttpRequest.getResponseHeader("Date");
                    var newDate;
                    if (typeof(xhrTime) != "undefined" && "" != xhrTime) {
                        newDate = new Date(xhrTime);
                    } else {
                        var serverTimeInit = timeNow.getTime() + difference;
                        newDate = new Date(serverTimeInit);
                    }
                    if ("" == format) {
                        serverTime = this.dateFormat(newDate);
                    } else {
                        serverTime = this.dateFormat(newDate, format);
                    }
                },
                complete: function(XMLHttpRequest, textStatus) {
                    if ("" == serverTime) {
                        var time = XMLHttpRequest.getResponseHeader("Date");
                        var curDate = new Date(time);
                        if ("" == format) {
                            serverTime = this.dateFormat(curDate);
                        } else {
                            serverTime = this.dateFormat(curDate, format);
                        }
                    }
                }
            });
            return serverTime;
        },
        /**
         * 日期格式化
         * 对Date的扩展，将 Date 转化为指定格式的String
         * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
         * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
         * 例子：
         * dateFormat(new Date(),"yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
         * dateFormat(new Date(),"yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
         */
        dateFormat: function(date, format) {
            format = format ? format : "yyyy-MM-dd hh:mm:ss";
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();
            var milliSeconds = date.getMilliseconds();
            var o = {
                "M+": month,
                "d+": day,
                "h+": hours,
                "m+": minutes,
                "s+": seconds,
                "S": milliSeconds
            }

            if (/(y+)/.test(format)) {
                format = format.replace(RegExp.$1, (year + "").substr(4 - RegExp.$1.length));
            }

            for (var k in o) {
                if (new RegExp("(" + k + ")").test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] + "" : ("00" + o[k]).substr(("" + o[k]).length));
                }
            }
            return format;
        },
        /**
         * 切换回话时自动滚动
         * @param  {[type]} $chatshow [包裹聊天区的当前回话的div]
         */
        scrollChatArea: function(serialNo,height) {
            var $chatShow = $('#chartWarp_' + serialNo).find('.chat-show');
            $($chatShow.find('.chat-area')).animate({
                scrollTop: height
            }, 100);
        }
    });

    return initialize;
});
