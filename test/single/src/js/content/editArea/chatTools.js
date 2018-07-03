/**
 *渠道协同
 */
define(['Util','Compts','../../index/constants/mediaConstants','../../../tpl/content/editArea/chatTools.tpl',
        '../ajaxfileupload','../mediaMessage','../chatArea/chatArea','../../../assets/css/content/editArea/chatTools.css'
    ],function(Util, Compts, MediaConstants, ChatTools, ajaxFileUpload, MediaMessage, ChatArea) {
        //系统变量-定义该模块的根节点
        var _index = null,$el,_option = null,expressionMap = {},expressionMapValue = {},expressionDescMapValue = {},currentRange,srcPic = [],self = null,flag="";
        var initialize = function(indexModule, _$el, editor, data) {
            $el = $(ChatTools);
            _index = indexModule;
            $.extend(_index, {chatTools: this});
            this._$el = _$el;
            this.editor = editor;
            ctiId = _index.CTIInfo.CTIId;
            ccid = _index.CTIInfo.CCID;
            vdnid = _index.CTIInfo.VDNId;
            ip = _index.CTIInfo.IP;
            port = _index.CTIInfo.port;
            $('#hl_tool', this._$el).append($el);
            this.getFaceData();
            this.showFace($el);
            this.initEvent();
            this.picClick();
            this.picLibClick();
            this.content = $el;
        };
        $.extend(initialize.prototype, Util.eventTarget.prototype, {
            initEvent: function() {
                //添加按钮区点击事件
                $el.find(".face").click(function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    if ($(this).hasClass("show")) {
                        $el.find("#faceContent_faceDiv").hide();
                        $(this).removeClass("show");
                        $(document).unbind("click.faceContent_faceDiv");
                    } else {
                        $el.find("#faceContent_faceDiv").css({
                            left: $(this).offset().left,
                            top: $(this).offset().top + $(this).height() + 7 + "px"
                        }).show();
                        $(document).bind("click.faceContent_faceDiv", function() {
                            $el.find(".face").click();
                        })
                        $(this).addClass("show");
                    }
                });
                //绑定点击表情图片事件
                $el.find("#faceContent_faceDiv").delegate(">a", "click", $.proxy(function(e) {
                    //获取被点击表情的关键字
                    var title = $(e.target).attr("title");
                    this.addCursorStr(title);
                    $("#faceContent_faceDiv").hide();
                }, this));
                //切换图标，更换渠道
                var _this = this;
                $el.find("#listWrap li").on("click", "img", function() {
                    var channelSrc = $(this).attr("src");
                    if($el.find("#channelSynergy>img").attr("src") == srcPic[5]){
                    	$el.find("#channelSynergy>img").css("margin-top", "4px");
                    }else{
                    	$el.find("#channelSynergy>img").css("margin-top", "0");
                    }
                    $el.find("#channelSynergy>img").attr("src", channelSrc);
                    _this.editor.ue.enable();
                    if ($el.find("#channelSynergy>img").attr("src") == srcPic[4]||$el.find("#channelSynergy>img").attr("src") == srcPic[5]) { //webchat
                        _index.contentCommon.cloneCurrentQueueData.mediaTypeId = MediaConstants.MEDIA_ONLINE_SERVICE;
                        var channelId = $el.find("#listWrap li.fourG").attr("data-channelid");
                        _index.contentCommon.cloneCurrentQueueData.channelID = channelId;
                        flag="1";
                    } else if ($el.find("#channelSynergy>img").attr("src") == srcPic[0]) { //weixin
                        _index.contentCommon.cloneCurrentQueueData.mediaTypeId = MediaConstants.WEIXIN_TYPE;
                        var channelId = $el.find("#listWrap li.webchat").attr("data-channelid");
                        _index.contentCommon.cloneCurrentQueueData.channelID = channelId;
                        flag="2";
                    } else if ($el.find("#channelSynergy>img").attr("src") == srcPic[3]) { //weibo
                        _index.contentCommon.cloneCurrentQueueData.mediaTypeId = MediaConstants.MICROBLOGGING_TYPE;
                        var channelId = $el.find("#listWrap li.microBlog").attr("data-channelid");
                        _index.contentCommon.cloneCurrentQueueData.channelID = channelId;
                        flag="3";
                    } else if ($el.find("#channelSynergy>img").attr("src") == srcPic[1]) { //yuyin
                        _index.contentCommon.cloneCurrentQueueData.mediaTypeId = MediaConstants.VOICE_TYPE;
                        //初始化被叫号码下拉框
                    	var phoneNumber = $el.find("#listWrap li.shortMsg").attr("data-phoneNumber");
                        //外呼页面
                        _index.ctiInit.AudioCallIds.setCalloutPhoneNums(phoneNumber);
                        _index.ctiInit.AudioCallIds.setCallFeature("5");//4G管家转外呼-5
                        _index.ctiInit.callOut();
                        _this.editor.ue.disable();
                        var channelId = $el.find("#listWrap li.voice").attr("data-channelid");
                        _index.contentCommon.cloneCurrentQueueData.channelID = channelId;
                        /*if(_this.flagNum == "1"){//webchat
                        	imgObject.attr("src", srcPic[4]);
                        }else if(_this.flagNum == "2"){//weixin
                        	imgObject.attr("src", srcPic[0]);
                        }else if(_this.flagNum == "3"){//weibo
                        	imgObject.attr("src", srcPic[3]);
                        }else if(_this.flagNum == "4"){

                        }else if(_this.flagNum == "5"){//duanxin
                        	imgObject.attr("src", srcPic[2]);
                        }*/
                        flag="4";
                    } else if ($el.find("#channelSynergy>img").attr("src") == srcPic[2]) { //duanxin
                        _index.contentCommon.cloneCurrentQueueData.mediaTypeId = MediaConstants.SHORT_MESSAGE_TYPE;
                        var channelId = $el.find("#listWrap li.shortMsg").attr("data-channelid");
                        _index.contentCommon.cloneCurrentQueueData.channelID = channelId;
                        flag="5";
                    }
                    _this.getFaceData();
                    _this.showFace($el);
                    _this.showToolbar(channelId);
                    _this.flagNum = flag;
                })
                self = this;
                $el.on("click", ".quickTalk", $.proxy(this.quickReply, this));
                //查看历史
                $el.on("click", ".searchHistory", $.proxy(this.viewHistory, this));
                //业务树
                $el.on("click", ".businessTree", $.proxy(this.businessTree, this));
                //点击别处让表情框消失
                $("body").on("click", function(evt) {
                    $("#faceContent_faceDiv").hide();
                    $el.find(".face").removeClass("show");
                })
                //清空编辑框
                $el.on("click", ".clear", $.proxy(this.clearEdit, this));
            },
            //渠道下拉数据初始化
            initData: function() {
                var serialNo = _index.CallingInfoMap.getActiveSerialNo();
                var callingInfo = _index.CallingInfoMap.get(serialNo);
                var mediaTypeId = callingInfo.getMediaType();
                var channelId = callingInfo.getChannelID();
                var callerNo = callingInfo.getCallerNo();
                var mediaTypeName = callingInfo.getMediaTypeName();
                var channelName = callingInfo.getChannelName();
                srcPic = [
                    "src/assets/img/content/editArea/qdqh-wx.png", //weixin
                    "src/assets/img/content/editArea/qdqh-yy.png", //yuyin
                    "src/assets/img/content/editArea/qdqh-dx.png", //duanxin
                    "src/assets/img/content/editArea/qdqh-wb.png", //weibo
                    "src/assets/img/content/editArea/qdqh-4g.png", //4g
                    "src/assets/img/content/editArea/qdqh-webchat.png" //webchat其他渠道
                ]
                var imgObject = $el.find("#channelSynergy>img");
                switch (mediaTypeId) {
                    case MediaConstants.MEDIA_ONLINE_SERVICE: //webchat
                    	$el.find("#listWrap li.fourG").attr("data-channelid",channelId);
                    	if(channelName == "4G管家"){
                            imgObject.attr("src", srcPic[4]);
                    		imgObject.css("margin-top","0");
                    	}else{
                    		imgObject.attr("src", srcPic[5]);
                    		imgObject.css("margin-top","4px");
                    	}
                    	//webchat渠道初始化渠道图标信息
                    	if(callerNo&&RegExp("^0?(13|15|17|18|14)[0-9]{9}$").test(callerNo)){
	                    	$el.find("#listWrap .voice").css("display", "block");
	                        $el.find("#listWrap .shortMsg").css("display", "block");
	                        $el.find("#listWrap li.voice").attr("data-channelid", "5"); //yuyin
	                        $el.find("#listWrap li.shortMsg").attr("data-channelid", "020002"); //duanxin
	                        $el.find("#listWrap li.voice").attr("data-phoneNumber", callerNo); //yuyin
	                        $el.find("#listWrap li.shortMsg").attr("data-phoneNumber", callerNo); //duanxin
	                        if(channelName == "4G管家"){
	                        	$el.find("#listWrap .fourG").css("line-height", "30px");
	                        	$el.find("#listWrap li.fourG").find("img").attr("src", srcPic[4]);
	                        	$el.find("#listWrap .fourG").css("display", "block");
	                        }else{
	                        	$el.find("#listWrap .fourG").css("line-height", "40px");
	                        	$el.find("#listWrap li.fourG").find("img").attr("src", srcPic[5]);
	                        	$el.find("#listWrap .fourG").css("display", "block");
	                        }
                    	}
                        break;
                    case MediaConstants.WEIXIN_TYPE: //weixin
                        imgObject.attr("src", srcPic[0]);
                        break;
                    case MediaConstants.MICROBLOGGING_TYPE: //weibo
                        imgObject.attr("src", srcPic[3]);
                        break;
                    case MediaConstants.VOICE_TYPE: //yuyin
                        imgObject.attr("src", srcPic[1]);
                        break;
                }
                //this.editor.ue.enable();
                this.getFaceData();
                this.showFace($el);
                var params = {
                    "mediaTypeId": mediaTypeId,
                    "channelId": channelId,
                    "callerNo": callerNo
                };
                Util.ajax.postJson("front/sh/media!execute?uid=queryCustInfo01", params, $.proxy(function(result, state) {
                    if (state) { //请求 客户关联信息成功
                        if (result.beans.length > 0) {
                            //客户信息存在时初始化显示语音和短信图标
                            $el.find("#listWrap .voice").css("display", "block");
                            $el.find("#listWrap .shortMsg").css("display", "block");
                            $el.find("#listWrap li.voice").attr("data-channelid", "5"); //yuyin
                            $el.find("#listWrap li.shortMsg").attr("data-channelid", "020002"); //duanxin
                            var flagWeibo = false;
                            var custInfos = result.beans;
                            for (var i = 0, len = custInfos.length; i < len; i++) {
                                var custInfo = custInfos[i];
                                if (custInfo.mediaTypeId == MediaConstants.MEDIA_ONLINE_SERVICE) { //webchat,包括4g
                                    var channelId = custInfo.channelId;
                                    $el.find("#listWrap li.voice").attr("data-phoneNumber", custInfo.phoneNumber); //yuyin
                                    $el.find("#listWrap li.shortMsg").attr("data-phoneNumber", custInfo.phoneNumber); //duanxin
                                    $el.find("#listWrap li.microBlog").attr("data-phoneNumber", custInfo.phoneNumber);//weibo
                                } else if (custInfo.mediaTypeId == MediaConstants.WEIXIN_TYPE) { //weixin
                                    var channelId = custInfo.channelId;
                                    $el.find("#listWrap li.voice").attr("data-phoneNumber", custInfo.phoneNumber); //yuyin
                                    $el.find("#listWrap li.shortMsg").attr("data-phoneNumber", custInfo.phoneNumber); //duanxin
                                    $el.find("#listWrap li.microBlog").attr("data-phoneNumber", custInfo.phoneNumber);//weibo
                                } else if (custInfo.mediaTypeId == MediaConstants.MICROBLOGGING_TYPE) { //weibo
                                    var channelId = custInfo.channelId;
                                    $el.find("#listWrap li.voice").attr("data-phoneNumber", custInfo.phoneNumber); //yuyin
                                    $el.find("#listWrap li.shortMsg").attr("data-phoneNumber", custInfo.phoneNumber); //duanxin
                                    $el.find("#listWrap li.microBlog").attr("data-phoneNumber", custInfo.phoneNumber);//weibo
                                } else if (custInfo.mediaTypeId == MediaConstants.VOICE_TYPE) { //yuyin
                                    var channelId = custInfo.channelId;
                                } else if (custInfo.mediaTypeId == MediaConstants.SHORT_MESSAGE_TYPE) { //短信
                                    var channelId = custInfo.channelId;
                                }
                                //此处为同步请求，使用异步不同满足需求
                                Util.ajax.postJson('front/sh/common!execute?uid=channels001', { "channelId": channelId },function(json, status) {
                                    if (status) {
                                        channelInfo = json.bean;
                                        if (channelInfo.mediaTypeId == MediaConstants.MEDIA_ONLINE_SERVICE) { //webchat
                                            $el.find("#listWrap li.fourG").attr("data-channelid", channelInfo.channelId);
                                        }
                                        if (channelInfo.mediaTypeId == MediaConstants.WEIXIN_TYPE) { //weixin
                                            $el.find("#listWrap li.webchat").attr("data-channelid", channelInfo.channelId);
                                        }
                                        if (channelInfo.mediaTypeId == MediaConstants.MICROBLOGGING_TYPE) { //weibo
                                            $el.find("#listWrap li.microBlog").attr("data-channelid", channelInfo.channelId);
                                        }
                                        if (channelInfo.mediaTypeId == MediaConstants.VOICE_TYPE) { //yuyin
                                            $el.find("#listWrap li.voice").attr("data-channelid", "5");
                                        }
                                        if (channelInfo.mediaTypeId == MediaConstants.SHORT_MESSAGE_TYPE) { //短信
                                            $el.find("#listWrap li.shortMsg").attr("data-channelid", "020002");
                                        }
                                        if (channelInfo.iscansend == "1") {
                                            if (_index.currentQueueData.mediaTypeId == MediaConstants.MEDIA_ONLINE_SERVICE) {
                                                $el.find("#listWrap li.fourG").attr("data-channelid", params.channelId);
                                                if(_index.currentQueueData.channelID == "080007"){
                                                	$el.find("#listWrap .fourG").css("line-height", "30px");
                                                	$el.find("#listWrap li.fourG").find("img").attr("src", srcPic[4]);
                                                	$el.find("#listWrap .fourG").css("display", "block");
                                                }else{
                                                	$el.find("#listWrap .fourG").css("line-height", "40px");
                                                	$el.find("#listWrap li.fourG").find("img").attr("src", srcPic[5]);
                                                	$el.find("#listWrap .fourG").css("display", "block");
                                                }
                                            } else {
                                                $el.find("#listWrap .fourG").css("display", "none");
                                            }
                                            if (_index.currentQueueData.mediaTypeId == MediaConstants.WEIXIN_TYPE) {
                                                $el.find("#listWrap li.webchat").attr("data-channelid", params.channelId);
                                                $el.find("#listWrap .webchat").css("display", "block");
                                            } else {
                                                $el.find("#listWrap .webchat").css("display", "none");
                                            }
                                            if (channelInfo.mediaTypeId == MediaConstants.MICROBLOGGING_TYPE) { //weibo
                                                $el.find("#listWrap .microBlog").css("display", "block");
                                                flagWeibo = true;
                                            }
                                        } else {
                                            if (_index.currentQueueData.mediaTypeId == MediaConstants.MEDIA_ONLINE_SERVICE) {
                                                $el.find("#listWrap li.fourG").attr("data-channelid", params.channelId);
                                                if(_index.currentQueueData.channelID == "080007"){
                                                	$el.find("#listWrap .fourG").css("line-height", "30px");
                                                	$el.find("#listWrap li.fourG").find("img").attr("src", srcPic[4]);
                                                	$el.find("#listWrap .fourG").css("display", "block");
                                                }else{
                                                	$el.find("#listWrap .fourG").css("line-height", "40px");
                                                	$el.find("#listWrap li.fourG").find("img").attr("src", srcPic[5]);
                                                	$el.find("#listWrap .fourG").css("display", "block");
                                                }
                                            } else {
                                                $el.find("#listWrap .fourG").css("display", "none");
                                            }
                                            if (_index.currentQueueData.mediaTypeId == MediaConstants.WEIXIN_TYPE) {
                                                $el.find("#listWrap li.webchat").attr("data-channelid", params.channelId);
                                                $el.find("#listWrap .webchat").css("display", "block");
                                            } else {
                                                $el.find("#listWrap .webchat").css("display", "none");
                                            }
                                            if (flagWeibo == true) {
                                                $el.find("#listWrap .microBlog").css("display", "block");
                                            }else{
                                            	$el.find("#listWrap .microBlog").css("display", "none");
                                            }
                                        }
                                    } else {}
                                }, true);
                            }
                        } else {
                        	this.displayChatTools();
                        }
                        //this.showToolbar(params.channelId);
                    } else { //请求客户关联信息失败
                    	 this.displayChatTools();
                        _index.popAlert("渠道协同获取客户关联信息失败");
                    }
                    this.showToolbar(params.channelId);
                },this));
                this.editor.ue.enable();
            },
            displayChatTools:function(){
            	var serialNo = _index.CallingInfoMap.getActiveSerialNo();
                var callingInfo = _index.CallingInfoMap.get(serialNo);
                var mediaTypeId = callingInfo.getMediaType();
                var channelId = callingInfo.getChannelID();
                var callerNo = callingInfo.getCallerNo();
            	//无关联信息时，隐藏所有渠道图标
                $el.find("#listWrap .webchat").css("display", "none");
                $el.find("#listWrap .microBlog").css("display", "none");
                if(_index.currentQueueData.mediaTypeId == MediaConstants.MEDIA_ONLINE_SERVICE &&
                		callerNo&&RegExp("^0?(13|15|17|18|14)[0-9]{9}$").test(callerNo)){//webchat
                	$el.find("#listWrap .voice").css("display", "block");
                    $el.find("#listWrap .shortMsg").css("display", "block");
                    $el.find("#listWrap .fourG").css("display", "block");
                }else{
	                $el.find("#listWrap .voice").css("display", "none");
	                $el.find("#listWrap .shortMsg").css("display", "none");
	                $el.find("#listWrap .fourG").css("display", "none");
                }
	            $el.find("#listWrap").css("border", "none");
            },
            //不同渠道对应不同的工具栏操作
            showToolbar: function(channelId) {
                //隐藏工具栏全部图标
                $el.find(".showFacePic").hide();
                $el.find(".showLocalPic").hide();
                $el.find(".showNetPic").hide();
                $el.find(".quickTalk").hide();
                $el.find(".businessTree").hide();
                $el.find(".textClear").hide();
                Util.ajax.postJson('front/sh/common!execute?uid=channelRelevance001', { "channelId": channelId },function(json, status) {
                    if (status) {
                        var channelToolInfos = json.beans;
                        for (var i = 0, len = channelToolInfos.length; i < len; i++) {
                            var channelToolInfo = channelToolInfos[i];
                            switch (channelToolInfo.btnName) {
                                case "表情":
                                    $el.find(".showFacePic").show();
                                    break;
                                case "本地图片":
                                    $el.find(".showLocalPic").show();
                                    break;
                                case "图片库":
                                    $el.find(".showNetPic").show();
                                    break;
                                case "快捷回复":
                                    $el.find(".quickTalk").show();
                                    break;
                                case "业务树":
                                    $el.find(".businessTree").show();
                                    break;
                                case "清空内容":
	                                $el.find(".textClear").show();
	                                break;

                            }
                        }
                    } else {
                    	_index.popAlert("获取渠道工具栏信息失败");
                	}
                });
            },
            addCursorStr: function(title) {
                var html = this.editor.ue.getContentTxt();
                this.editor.ue.execCommand('inserthtml', title);
                setTimeout($.proxy(function() {
                	this.editor.ue.focus(true);
                }, this), 0);
            },
            //初始化表情列表
            showFace: function($el) {
                //在body对象中查找[faceContent_faceDiv]的对象
                var my_face = $el.find("#faceContent_faceDiv");
                if (my_face.length == 0) {
                    var _div = "<span name='my_face_faceDiv'></span>";
                    my_face.html(_div);
                } else {
                    //my_face.html(msg);
                }
                var _str = "";
                for (var i in expressionMap) {
                    var j = "<a href='javascript:void(0)'><img src='" + expressionMap[i] + "' key = '" + i + "' title ='" + expressionMapValue[i] + "'></a>";
                    _str += j;
                }
                //将所有图片的超链接放在faceContent_faceDiv这个div中
                $el.find("#faceContent_faceDiv").html(_str);
                //隐藏表情
                $el.find("#faceContent_faceDiv").hide();
            },
            getFaceData: function() {
                //获取当前渠道对应的表情数据
                if (_index.contentCommon.cloneCurrentQueueData.mediaTypeId == MediaConstants.WEIXIN_TYPE) {
                    expressionMap = _index.contentCommon.getAllExpression()[MediaConstants.MEDIA_ONLINE_SERVICE];
                    expressionMapValue = _index.contentCommon.getAllExpressionValue()[MediaConstants.MEDIA_ONLINE_SERVICE];
                    expressionDescMapValue = _index.contentCommon.getAllExpressionDescValue()[MediaConstants.MEDIA_ONLINE_SERVICE];
                } else {
                    expressionMap = _index.contentCommon.getAllExpression()[_index.contentCommon.cloneCurrentQueueData.mediaTypeId];
                    expressionMapValue = _index.contentCommon.getAllExpressionValue()[_index.contentCommon.cloneCurrentQueueData.mediaTypeId];
                    expressionDescMapValue = _index.contentCommon.getAllExpressionDescValue()[_index.contentCommon.cloneCurrentQueueData.mediaTypeId];
                }
            },
            /**
             * 本地图片库点击事件
             * @return {[type]} [description]
             */
            picClick: function() {
                $el.find(".image").on("change", "#fileNameMedia", function() {
                    var serialNo = _index.queue.currentQueueData.serialNo;
                    var staffId = _index.getUserInfo().staffId;
                    $.ajaxFileUpload({
                            url: 'front/sh/multiResource!multiReplyUpload?uid=multi0001', //用于文件上传的服务器端请求地址
                            secureuri: false, //是否需要安全协议，一般设置为false
                            fileElementId: "fileNameMedia", //文件上传域的ID
                            dataType: 'json', //返回值类型 一般设置为json
                            success: function(data, status) //服务器成功响应处理函数
                                {
                                    //获取上传图片返回码
                                    var returnCode = data.returnCode;
                                    //获取上传图片返回消息
                                    var returnMessage = data.returnMessage;
                                    //获取上传图片返回路径
                                    var filePath = data.bean.filePath;
                                    if ("0" == returnCode) {
                                        putSendImgMsg(filePath);
                                    } else {
                                        _index.popAlert(returnMessage);
                                    }
                                },
                            error: function(data, status, e) //服务器响应失败处理函数
                                {
                                    _index.popAlert("发送图片失败");
                                }
                        })
                    var str = '<span style="position:relative;display:inline-block;overflow:hidden;width:30px;height:40px;"><input hideFocus class="addfileI" type="file" size=1 name="files" id="fileNameMedia" style="position:absolute;font-size:0;width:30px;right:6px;bottom:11px;height: 35px;outline: none;border: 0;font-size:100%\0"></span>';
                    $el.find(".addfileA").empty().html(str);
                });
            },
            /**
             * 图片库点击事件
             * @return {[type]} [description]
             */
            picLibClick: function() {
                $el.find(".imglab").click(function(e) {
                    var pictureLibUrl = $el.find("#media_pictureLag_url");
                    _index.showDialog({
                        title: '图片库', //弹出窗标题
                        url: './pictureLib', //要加载的模块
                        param: pictureLibUrl, //要传递的参数，可以是json对象
                        width: 700, //对话框宽度
                        height: 500 //对话框高度
                    });
                });
                // 绑定图片库发送事件
                $el.find("#media_pictureLag_url").change(function() {
                    var url = $el.find("#media_pictureLag_url").val();
                    putSendImgMsg(url);
                });
            },
            //引入快捷回复事件方法
            quickReply: function(e) {
                e.stopPropagation();
                if (($("#chatBox_quickReply").css('display')) == "none") {
                    require(['./quickReply'], function(quickReplyTab) {
                        var staffID = _index.getUserInfo().staffId;
                        var mediaID = _index.currentQueueData.mediaTypeId;
                        var data = { "staffID": staffID, "mediaID": mediaID }
                        var quickReplyTab = new quickReplyTab(_index, self, data);
                        $('#chatBox_quickReply').html(quickReplyTab.content);
                    });
                    $("#chatBox_quickReply").show();
                } else {
                    $("#chatBox_quickReply").hide();
                }
            },
            //绑定业务树按钮点击事件
            businessTree: function() {
                if ($("#chatBox_tab").is(':hidden')) {
                    $("#chatBox_tab").show();
                    if($('body').hasClass('internet-hor')){
                       $("#chatBox_tab").css({
                            'right': '3%'
                       })
                    }
                } else {
                    $("#chatBox_tab").hide();
                    $("#searchData").val("");
                };
            },
            //查看当前会话消息记录
            viewHistory: function() {
                var staffID = _index.getUserInfo().staffId;
                var mediaID = _index.currentQueueData.mediaTypeId;
                var serialNo = _index.queue.currentQueueData.serialNo;
                var callingInfo = _index.CallingInfoMap.get(serialNo)
                var callerNo = callingInfo.getCallerNo();
                _index.showDialog({
                    title: '历史聊天记录', //弹出窗标题
                    url: './viewHistory', //要加载的模块
                    param: { "staffID": staffID, "mediaID": mediaID, "serialNo": serialNo,"callerNo":callerNo },
                    width: 680, //对话框宽度
                    height: 500 //对话框高度
                });
            },
            clearEdit: function() {
                if (this.editor.ue.hasContents()) {
                    this.editor.ue.setContent("");
                }
            }
        })
        // 封装发送图片消息
        function putSendImgMsg(url) {
            var serialNo = _index.queue.currentQueueData.serialNo;
            var callingInfo = _index.CallingInfoMap.get(serialNo);
            var channelID = callingInfo.getChannelID();
            var imagePath = url;
            var msgId = "";
            var params ={"skillDesc":"","ctiId":"","ccId":"","vdnId":""};
            //此处使用同步请求，msgId的值得到后，要马上使用
            Util.ajax.postJson("front/sh/media!execute?uid=randomSerialNo", params, function(json, status) {
                if (status) {
                    msgId = json.bean.serialNo;
                } else {
                    msgId = _index.contentCommon.getSerialNo();
                }
            }, true);
            if (url.indexOf("_min") != '-1') {
                var temp = url.split("_min");
                var part1 = temp[0];
                var part2 = temp[1];
                imagePath = part1 + part2;
            }
            var data = {
                "serialNo": _index.queue.currentQueueData.serialNo,
                "msgType": MediaConstants.MSGTYPE_IMG,
                "mediaTypeId": _index.queue.currentQueueData.mediaTypeId,
                "senderFlag": MediaConstants.SENDER_FLAG_SEAT,
                "originalCreateTime": _index.utilJS.getCurrentTime(),
                "channelID": callingInfo.getChannelID(),
                "nickName": _index.queue.currentQueueData.nickName,
                "url": imagePath,
                "contentTxt": "",
                "msgId":msgId
            };
            _index.contentCommon.sendMsg(data);
        }
        return initialize;
    });
