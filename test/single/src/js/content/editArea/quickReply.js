define(['Util',
        'Compts',
        '../mediaMessage',
        '../../callHandle/callingInfoMap/CallingInfo',
        '../../index/constants/mediaConstants',
        '../../../tpl/content/editArea/quickReply.tpl',
        '../../../assets/css/content/editArea/quickReply.css',
        'jquery.placeholder'
        ],
        function(Util,Compts,MediaMessage,CallingInfo,MediaConstants,tpl){
	    var _index;
	    var _options;
	    var $el;
	    //确保对应的this不会在$.each内发生改变,self存储对应的this指向
	   var lets = null;
	   //设置对应的快捷回复弹出框能够动态改变(设置对应变量存储工具条的宽度与快捷回复的左间距 和对应的百分比值)
	   var 	positions =null,postLeft = null,ulWidth = null, leftNum = null,messageId= null,lengthQuick;
		var quickReplyItem=function(indexModule,selfs,options){
			$el = $(tpl);
			_index = indexModule;
			_options=options;
			positions = $("#quickTalk").position();
			postLeft = positions.left;
			ulWidth = $($("#quickTalk").parent()).width();
			leftNum = (parseFloat(Math.round(Number(postLeft) / Number(ulWidth)* 10000) / 100.00)+parseInt(2)) + "%";
			//使用对应的百度文本编辑器方法
			_selfs = selfs;
			this.total = 0;
//			this.posHeight =0-$("#chatBox_quickReply").height()-5;
			this.quickReplyInit();
			this.eventInit.call(this);
			this.content=$el;
//			var maxHeight = $(".chat-area").height()-90 ;
//    		$("#quickReply_1",$el).css("max-height",maxHeight+"px");
			
		}	
		$.extend( quickReplyItem.prototype,Util.eventTarget.prototype,{
			//初始化方法
			eventInit : function(){
			lets = this;
			$("#chatBox_quickReply").css("top","-236px");
			 $("#chatBox_quickReply").css("left",leftNum);
			 placeholder();
			 
			$el.on("click", "#reply_2", this.addQuickReply);
			$el.on('click','#quick_2', this.showInput);
			$el.on('click','#quickReply_close', this.quickReply_close);
			$el.on('click','#reply_3', this.revokeReply);
			if (($("#chatBox_quickReply").css('display')) != "none") {
			//设置对应点击页面其他位置隐藏对应的快捷回复
		  $("body").not("#chatBox_quickReply").bind("click",this.disapperReply);
		 }
		  $el.on('click','#chatBox_quickReply',this.showReply);
		  },
		  //快捷回复方法
		  quickReplyInit : function(){
		    var timer = null;
			var config = {
					el:$('#quickReply_1',$el),
				                field:{
				                    key:'id',
				                    boxType:'radio',
				                    items:[
				                       { text:'表记录唯一编号',name:'replyId',className:'width-percent-1'},
	                                   { text:'快捷回复内容', name:'content',title:'content',className:'width-percent-2',click:function(e,item){
	                                	clearTimeout(timer);
	           							timer = setTimeout(function(){
	           
//	           _index.main.currentInPanel.$chatWarp.find('.divEditor').text(item.data.content);
											//设置文本的内容{针对两版list组件的区分}
	           								if(item.data){
	           									_selfs.editor.ue.execCommand('inserthtml',item.data.content);
	           								}else{
	           									_selfs.editor.ue.execCommand('inserthtml',item);
	           								}
											_selfs.editor.ue.focus(true);
	           								$("#chatBox_quickReply").hide();
	           								$("#quick_1").hide();
	           								$("#quick_2").show();
	           								$("#chatBox_quickReply").css("top","-236px");
	           							},300)
	      							
	           				        }}
				                    ],
				                },
			                data:{
				                    url:'front/sh/media!execute?uid=quickReply003'
				                }     
				        }
				        this.list = new Compts.List(config);
				        this.list.search({"staffId":_options.staffID})
				        $el.find('th').text('');
				        $el.find('table').addClass('quickReply-table');
				        $el.find(".sn-list-content ").css("position","static");
				        var params ={"skillDesc":"","ctiId":"","ccId":"","vdnId":""};
				        Util.ajax.postJson("front/sh/media!execute?uid=randomSerialNo",params, function(json, status) {
							 if (status) {
								 messageId = json.bean.serialNo;
								 //skillId = json.bean.skillId;
							 }else{ 
								 messageId = _index.contentCommon.getSerialNo();
							 }
						 },true);
				        this.list.on("rowDoubleClick",function(e,item){
				        	clearTimeout(timer);
				        	var serialNo=_index.currentQueueData.serialNo;
				        	var data = {
							         "serialNo":_index.currentQueueData.serialNo,
									"msgType": MediaConstants.MSGTYPE_TEXT,
			                        "mediaTypeId": _index.contentCommon.cloneCurrentQueueData.mediaTypeId,
									"senderFlag":MediaConstants.SENDER_FLAG_SEAT,
								     "content":item.content,
							         "originalCreateTime":_index.utilJS.getCurrentTime(),
							        "channelID":_index.contentCommon.cloneCurrentQueueData.channelID,
			                        "nickName":_index.currentQueueData.nickName,
			                        "contentTxt":item.content,
			                        "msgId":messageId
           					};
//				        	区分当前为哪种渠道信息
				        	if(_index.contentCommon.cloneCurrentQueueData.mediaTypeId == MediaConstants.MEDIA_ONLINE_SERVICE){//webchat,包括4g
				        		if(_index.contentCommon.sendMsg(data)){
									_index.queue.list[serialNo].hasTip = true;
								};
							}else if(_index.contentCommon.cloneCurrentQueueData.mediaTypeId == MediaConstants.WEIXIN_TYPE){//weixin
								if(_index.contentCommon.sendMsg(data)){
									_index.queue.list[serialNo].hasTip = true;
								};
							}else if(_index.contentCommon.cloneCurrentQueueData.mediaTypeId == MediaConstants.MICROBLOGGING_TYPE){//weibo
								var serialNo=_index.CallingInfoMap.getActiveSerialNo();
					            var callingInfo = _index.CallingInfoMap.get(serialNo);
					            var serviceTypeId = callingInfo.getServiceTypeId();
								data.serviceTypeId =serviceTypeId;
								if(_index.contentCommon.sendMsgWeibo(data)){
									_index.queue.list[serialNo].hasTip = true;
								};
							}else if(_index.contentCommon.cloneCurrentQueueData.mediaTypeId == MediaConstants.VOICE_TYPE){//yuyin
							}else if(_index.contentCommon.cloneCurrentQueueData.mediaTypeId == MediaConstants.SHORT_MESSAGE_TYPE){//短信
								var serialNo=_index.CallingInfoMap.getActiveSerialNo();
					            var callingInfo = _index.CallingInfoMap.get(serialNo);
					            var serviceTypeId = callingInfo.getServiceTypeId();
					            data.serviceTypeId =serviceTypeId;
					            if(_index.contentCommon.sendMsgShortM(data)){
									_index.queue.list[serialNo].hasTip = true;
								};
			   				}
                    	    $("#chatBox_quickReply").hide();
                    	    $("#quick_1").hide();
           				    $("#quick_2").show();
           				 $("#chatBox_quickReply").css("top","-236px");
//           				 快捷回复随数量增加展示
//           				 this.posHeight =0 - $("#chatBox_quickReply").height()-5;
//         				    $("#chatBox_quickReply").css("top",this.posHeight);
							
				        	})
				        this.list.on('success',function(result){
				        		$(".quickReply-table",$el).find('thead').remove();
				        		$(".quickReply-table",$el).find('tfoot').remove();
//				        		this.posHeight =0 - $("#chatBox_quickReply").height()-5;
//				        		 $("#chatBox_quickReply").css("top",this.posHeight);
				        		$(".quickReply-table",$el).find('.width-percent-2').append($('<a class="ui-dialog-close reply_3">×</a>'));
				        		$(".reply_3").on("click",function(event){
				        			event.stopPropagation();
				        			var data = $(this).parent().parent().find(".width-percent-1").text();
				        			lets.delquickReply(data);
				        	    })
				        })
				       
		},
		//删除快捷回复
		 delquickReply:function(data){
			Util.ajax.postJson('front/sh/media!execute?uid=quickReply002',{"replyIds":data},function(json,status){
				if (status) {
					lets.quickReplyInit();
				}
			});
	   },
	   //添加新的快捷回复信息
	   addQuickReply:function(){
			var content=$.trim($el.find("#reply_1").val()); 
			if(content.length>1000){
				alert("内容太长");
				return;
			}
			this.total = $(".width-percent-2").length;
//			var oldHeight = $("#chatBox_quickReply").height();
//			this.posHeight = 0- oldHeight;
			if(this.total < 50){
			if(content){
			data={"staffId":_options.staffID,"content":content,"total":this.total};
			Util.ajax.postJson('front/sh/media!execute?uid=quickReply001',data,function(json,status){
				if (status) {
					lets.quickReplyInit();
					lets.showInput();
					$el.find("#reply_1").val("");
				}
			});
		  }else{
			  alert("请输入内容");
		  }}else{
				_index.popAlert("最多创建50条快捷回复！")
			}
		},
		//显示快捷回复信息
		showInput:function(){
//			var newHeight = $("#chatBox_quickReply").height();
//			newHeight = 0-newHeight-40;
			if($("#quick_2").is(':hidden')){
				$("#quick_1").hide();
				$("#chatBox_quickReply").css("top","-236px");
//					$("#chatBox_quickReply").css("top",this.posHeight);
				$("#quick_2").show();
			}else{
				$("#chatBox_quickReply").css("top","-271px");
//					$("#chatBox_quickReply").css("top",newHeight);
				$("#quick_1").show();
				$("#quick_2").hide();
			}
		},
		//关闭信息
		quickReply_close:function(){
			$("#chatBox_quickReply").hide();
		},
		//撤销添加快捷回复
		 revokeReply:function(){
//			 var newHeight = $("#chatBox_quickReply").height();
//				newHeight = 30-newHeight;
//				$("#chatBox_quickReply").css("top",newHeight);
			 $("#chatBox_quickReply").css("top","-236px");
		 		$("#quick_1").hide();
				$("#quick_2").show();
		 },
		 //点击其他部分隐藏快捷回复
		 disapperReply:function(e){
			var e = e || window.event; //浏览器兼容性 
			var elem = e.target || e.srcElement; 
			e.stopPropagation();
			while (elem) { //循环判断至跟节点，防止点击的是div子元素 
			if (elem.id && elem.id=='chatBox_quickReply') { 
			return; 
			} 
			elem = elem.parentNode; 
			} 
			$("#chatBox_quickReply").hide(); //点击的不是div或其子元素 
			},
			//显示对应的快捷回复
			showReply:function(e){
				var e = e || window.event; 
				e.stopPropagation();
//				$("#chatBox_quickReply").css("top",this.posHeight);
//				$("#chatBox_quickReply").show();
				$("#chatBox_quickReply").css("top","-236px");
 				$("#chatBox_quickReply").show(); 
			}
		})
		//placeholder插件 启动方法
	    var placeholder = function(){
	        $('#reply_1',$el).placeholder();
	    };
	return quickReplyItem;
});