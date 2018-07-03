/**
 * 355事件
 * 处理接收通知事件
 */
define(['Util',
        './CTIEventsDeal',
        'jquery.tiny'], function(Util,CTIEventsDeal) {
	var index;
	var comUI;
	var receiveNote = function(indexModule) {
		index = indexModule;
		comUI = index.comMenu;
	};
	$.extend(receiveNote.prototype,{
		receiveNoteEvent : function(uselessObj,receiveNoteEvent) {
			
			var paramsToProvince = {
					"resultCode" : 0,
					"resultMessage" : "接收便签事件",
					"reserved1" : "",
					"reserved2" : "",
					"reserved3" : ""
			};
			index.postMessage.sendToProvince("receiveNoteEvent", paramsToProvince);
			
			var _index = index;
			// 当前登录用户,在弹出通知界面后即为发送通知的人
	    	var sender = _index.getUserInfo().staffId;
	    	var senderName = _index.getUserInfo().staffName;
			// 数据格式receiveNoteEvent={'eventId':'时间ID','receiveTime':'事件接收时间','sendAgentId':'发送人的平台工号','messageContext':'消息内容'}
			// 轮询中接收CTI发过来的通知
	    	var msgdecode = receiveNoteEvent.messageContext;
			var messageContext = jQuery.parseJSON(msgdecode);
			var receiveTime = receiveNoteEvent.receiveTime;
			var sendAgentId = messageContext.sendWorkNo;
			var receiver = messageContext.sendStaffId;
			var receiverName = messageContext.sendStaffName;
			var serverTime = messageContext.serverTime;
			var receierMsg = messageContext.sendMsg.replace(/ /g, "&nbsp");
			var ccId = _index.CTIInfo.CCID ;
			var vdnId = _index.CTIInfo.VDNVDNId;
			// 为何综合接续里面公用界面，需要规范和主动发送通知的传参格式一致
			// ①将当前发送过来的通知方在通知界面显示为通知接收人
			
			// ②匹配通知人员信息格式"{'staffId':'wuyuqing','staffName':'吴宇清','agentId':'111','ccId':'1','vdnId':'1'},";
			var parmas = "{'staffId':'"+receiver+"','staffName':'"+receiverName+"','agentId':'"+sendAgentId+"','ccId':'"+ccId+"','vdnId':'"+vdnId+"'}";
			// 系统调测数据
			// parmas =
			// "{'staffId':'wangziyou','staffName':'王自友','agentId':'103','ccId':'1','vdnId':'1'},";
			// parmas =
			// "{'staffId':'yujiaoli','staffName':'余娇利','agentId':'102','ccId':'1','vdnId':'1'},";
			// receiver = 'yujiaoli';
			// receiverName = '余娇利';
			// ③将消息保存到缓存中
			// 缓存中的历史通知数据,①先通过发送人查询
			var notes = _index.ctiInit.AudioNotes.getNotes(receiver);
			// 判断缓存中是否存在
			if(!notes)
			{
				// 不存在则重新创建json对象
				notes = {};
			}
			var noteByReceiver ;
			// ②再通过接收人查询，得到历史通知
			noteByReceiver = notes[sender];
			if(!noteByReceiver)
			{
				noteByReceiver = new Array();
			}
			receiveTime = (new Date()).getTime();
			var content ={'sender':receiver,'senderName':receiverName,'receiver':sender,'receiverName':senderName,'content':receierMsg,'senderTime':serverTime};
			noteByReceiver.push(content);
			// 将本次发送的通知添加到接收人的对象中
			notes[sender] = noteByReceiver;
			// 将新的数组添加到缓存中
			_index.ctiInit.AudioNotes.putNotes(receiver,notes);
			// ④显示通知界面
			// 判断通知界面是否存在，存在则不再显示，直接追加通知内容
			var $sendNotesWindow = "#otherinfoDiv"+receiver;
			var receiverHtml = $($sendNotesWindow).html();
			if(!receiverHtml)
			{
				_index.showDialog({
					title : '发送通知' , // 弹出窗标题
					url : 'js/comMenu/comprehensiveCommunication/sendNotes/sendNotes', // 要加载的模块
					param : parmas, // 要传递的参数，可以是json对象
					width : 600, // 对话框宽度
					height : 350,
					modal : false
				// 对话框高度
				});
				return;
			}
			var contentArr = new Array();
			contentArr.push(content);
			creatTableBySender(contentArr);
		}
	});
	// 日期格式化 by yujiaoli wx224989 20160625 start
	Date.prototype.format = function(format){ 
		var o = { 
				"M+" : this.getMonth()+1, // month
				"d+" : this.getDate(), // day
				"h+" : this.getHours(), // hour
				"m+" : this.getMinutes(), // minute
				"s+" : this.getSeconds(), // second
				"q+" : Math.floor((this.getMonth()+3)/3), // quarter
				"S" : this.getMilliseconds() // millisecond
		} 

		if(/(y+)/.test(format)) { 
			format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
		} 

		for(var k in o) { 
			if(new RegExp("("+ k +")").test(format)) { 
				format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
			} 
		} 
		return format; 
	} 
	// 根据发生方加载数据
	 var creatTableBySender = function(data){
		 if(data.length > 0){
			 var loginStaffId = index.getUserInfo().staffId;
			 //var html_Time = createTimeDiv(data[data.length-1].senderTime);
			 $.each(data,function(index,value){
				 var sender = value.sender;
				 // 判断发送人是否是当前用户
				 if(sender!=loginStaffId){
					 var $otherinfoDiv = "#otherinfoDiv"+sender;
					 var $el =  $($otherinfoDiv);
					 var str = createItem(value);
					 $el.prepend(str);
				 }
			 });
			 // $("#Message",$el).after(html_Time);
		 }
	 };
	/* 创建聊天对话框 -- 用户 start */
	function createItem(data){
		var repStr = [];
		// 格式化时间
		var dateTime = new Date(data.senderTime);
		var receiver = data.receiver;
		var loginStaffId = index.getUserInfo().staffId;
		var receiverName = data.receiverName;
		if(receiver == loginStaffId)
		{
			receiverName = data.senderName;
		};
			repStr.push('<div class="talk_recordbox_1">'+
				'<div id="customer_show_1" class="user_1">'+receiverName+
				'<span class="talk_time_1">'+dateTime.format("hh:mm:ss")+'</span>'+
				'</div>'+
				'<div class="talk_recordtextbg_1">&nbsp;</div>'+
				'<div class="talk_recordtext_1">'+
					creatHtmlByType(data)+
				'</div>'+
			'</div><br/>');
		return repStr.join("");
	};
	// 根据数据类型加载
	 var creatHtmlByType = function(data){
		 // 文本mediaConstants.MSGTYPE_TEXT
		 _htmlData = '<h3>'+data.content+'</h3>';
		 return _htmlData;
	 };
	return receiveNote;
});