/**
 * 转接弹出页
 */
define(['Util',
        '../../tpl/comMenu/comprehensiveCommunication/sendNotes/sendNotes.tpl',
        '../index/constants/mediaConstants',
        '../../assets/css/comMenu/comprehensiveCommunication/sendNotes/sendNotes.css'],
        function(Util,tpl,Constants){
			// 系统变量-定义该模块的根节点
	
			var _index = null, $el = null,_options = null,ip = null,port = null,
				CTIID = null,_htmlData = null,_customService = null,textLength = 300;
	
//			var _index = null;
//			var $el = null;
//			var _options = null;
//			var ip;
//			var port;
//			var CTIID;
//			var _htmlData;
//			var _customService;
//			var textLength = 300;
			
		    var initialize = function(index,options){
		    	$el = $(tpl);
		    	_index = index;
		    	_options = options;
		    	CTIID = _index.CTIInfo.CTIId;
		    	// 业务代码
		    	sendNotes.call(this);
		    	this.content=$el;
		    	var idDefault=_index.CTIInfo.isDefault;// 缺省业务标志值
		        var proxyIp=_index.CTIInfo.ProxyIP;// 代理ip
		        var proxyPort =_index.CTIInfo.ProxyPort;// 代理端口
		        var directIp=_index.CTIInfo.IP;// 直连ip
		        var directPort=_index.CTIInfo.port;// 直连端口
		        if(idDefault=="1"){// 此种情况走nginx代理
		        	ip = proxyIp;
		        	port = proxyPort;
		        }else{                                
		        	ip = directIp;
		        	port = directPort;
		        }
		    	_customService=Constants.NOTE_SERVICE_LOGO_URL;
		    };

		    // 加载选项卡
		    var sendNotes = function(){
		    	var _indexData = _index;
		    	var $elData = $el;
		    	var _options$variable = _options;
		    	var optionsObject =  eval("["+_options$variable+"]");
		    	var $variable = _indexData.serialNumber.getSerialNumber();
		    	var receiver = "";
		    	if(optionsObject.length ==  1)
		    	{
		    		receiver = optionsObject[0].staffId;
		    		//tpl文件中的变量值
		    		$variable = receiver;
		    	}
	    		var $elHtml = $el.html();
	    		$elHtml = $elHtml.replace(/variable/g,$variable);
	    		$elHtml = $elHtml.replace('wokrNovariable',$variable);
	    		$el.html($elHtml);
		    	var recerivers = "";
		    	//当前登录用户
		    	var sender = _indexData.getUserInfo().staffId;
		    	var senderName = _indexData.getUserInfo().staffName;
		    	var serverTime;
		    	//选中的用户是当前用户，则不发送				
				var allReceriver="";
				for(var a=0;a<optionsObject.length;a++){
					if(sender == optionsObject[a].staffId)
					{
						continue;
					}
					allReceriver=allReceriver+optionsObject[a].staffId+",";					
				}				
				var allRecerivers=allReceriver.substring(0,allReceriver.length-1);
				var data = {
						 "staffIds":allRecerivers			
				 };
				Util.ajax.postJson('front/sh/audio!execute?uid=queryId',data,function(json,status){
					 if(status){
						 recerivers = json.object;
					 } else {
						 return;
					 }
				 },true);
		    	
		    	//判断是否通知接收人是否存在
		    	if(!recerivers)
	    		{
		    		// 销毁弹出框
		    		_indexData.destroyDialog();
		    		//选中有用户且用户只有1个还与登录用户相同则提示用户不能给自己发送通知
		    		if(optionsObject && sender == optionsObject[0].staffId)
		    		{
		    			//alert("不能给自己发送通知！");
		    			_indexData.popAlert("不能给自己发送通知！","发送通知");
		    			return;
		    		}
//		    		alert("未获取到正确的接受通知的坐席！")
		    		_indexData.popAlert("未获取到正确的接受通知的坐席！","发送通知");
		    		return;
	    		}
		    	//判断发起的通知接收人只有一个则展示历史
		    	if(optionsObject.length ==  1)
		    	{
		    		//加载历史通知--当前用户发送
		    		var notesSenderHistory = _index.ctiInit.AudioNotes.getNotes(sender);
		    		var noteSenderArr = new Array();
		    		if(notesSenderHistory)
		    		{
		    			//加载历史通知--当前接收人接收
		    			noteSenderArr = notesSenderHistory[receiver];
		    			if(!noteSenderArr)
		    			{
		    				noteSenderArr = new Array();
		    			}
		    		}
		    		//加载历史通知--当前接收人发送
		    		var notesReceiverHistory = _index.ctiInit.AudioNotes.getNotes(receiver);
		    		var noteReceiverArr = new Array();
		    		if(notesReceiverHistory)
		    		{
		    			//加载历史通知--当前用户接收
		    			noteReceiverArr = notesReceiverHistory[sender];
		    		}
		    		//加载历史通知--上述得到的两个数字合并
		    		var notesArr = noteSenderArr.concat(noteReceiverArr);
		    		notesArr.sort(CompareForSort);
		    		//创建历史
		    		creatTableBySender(notesArr,$elData,$variable);
		    	}
		    	else
		    	{
		    		//$el.find("#otherinfoDiv"+$variable).remove();
		    	}
		    	var $sendNotesInfo = "#sendNotesInfo"+$variable +" #receriver"+$variable;
		    	$el.find($sendNotesInfo).html("接收方 :" +recerivers);
		    	$el.find("#windowOnwere"+$variable+" #send-note-btn").click(function(e){
		    		var html=$("#windowOnwere"+$variable+' .divEditor').html();
		    		if(_index.queue.browserName==="IE"){
		    	 		html = html.replace(/<P>/g,"");
		    	 		html = html.replace(/<\/P>/g,"");
		    	 		html = html.replace(/(\r\n)/g,"<br>");
		    		}else{
		    			html = html.replace(/<div>/g, "<br>");
			    		html = html.replace(/<\/div>/g, "");
		    		}
		    		
		    		if(!html || !$.trim(html)){
//						alert("请输入通知内容！")
						_indexData.popAlert("请输入通知内容！","发送通知");
						return;
					}
//		    		if(html.length > textLength){
//		    			alert("输入的通知内容（合计字符总数："+html.length+"）最大不能超过"+textLength+"个字符！");
//		    			return;
//		    		}
		    		html = html.replace(/\'/g,"&prime;");
		    		var sendWorkNo = _indexData.CTIInfo.workNo;		    		
		    		var agentIds={'agentIds':"["+_options$variable+"]"};
		    		var tempTime = _index.utilJS.getCurrentTime();
		    		serverTime = Date.parse(tempTime.replace(/-/g,"/"));
		    		var messageContent ={'sendStaffId':sender,'sendStaffName':senderName,'sendWorkNo': sendWorkNo,'sendMsg':html,'serverTime':serverTime};
		    		var message = JSON.stringify(messageContent);
		    		var dataParas = "{'agentIds':["+_options$variable+"],'message':'"+message+"'}";	
		    		/**
		    		 * 发送通知调用CTI接口改为后台调用 by   yuxinyuan  start
		    		 */
		    		var _dataParas={
		    				        'dataParas':dataParas,		    				        
		    				        'ctiId':CTIID
		    		};
		    		Util.ajax.postJson('front/sh/audio!execute?uid=sendNotes',_dataParas,function(json,status){
		    			if(status) {
		    				if(json&&json.bean&&json.bean.result) {
		    					var result_=JSON.parse(json.bean.result).result;	
		    					if(status&&result_=="0"){
		    						$el.find("#wordsNum").text("");
		    						// 记录发送通知至csp系统
		    						var cspDataPara = {'agentIds':'['+_options$variable+']','message':html,'sender':sender};
		    						Util.ajax.postJson("front/sh/audio!execute?uid=insertNote",cspDataPara,function(json,status){
		    							if(status){
		    								
		    							} else {
		    								return;
		    							}
		    						});
		    						// 缓存中的历史通知数据,①先通过发送人查询
		    						var notes = _index.ctiInit.AudioNotes.getNotes(sender);
		    						// 判断缓存中是否存在
		    						if(!notes)
		    						{
		    							// 不存在则重新创建json对象
		    							notes = {};
		    						}
		    						var noteByReceiver ;
		    						var nowDate = new Date();
		    						var dateStr = nowDate.getTime();
		    						var contentArr = new Array();
		    						for(var i=0;i<optionsObject.length;i++)
		    						{
		    							// ②再通过接收人查询，得到历史通知
		    							noteByReceiver = notes[optionsObject[i].staffId];
		    							if(!noteByReceiver)
		    							{
		    								noteByReceiver = new Array();
		    							}
		    							var content ={'sender':sender,'senderName':senderName,'receiver':optionsObject[i].staffId,'receiverName':optionsObject[i].staffName,'content':html,'senderTime':serverTime};
		    							noteByReceiver.push(content);
		    							if(i == 0)
		    							{
		    								contentArr.push(content);
		    							}
		    							// 将本次发送的通知添加到接收人的对象中
		    							notes[optionsObject[i].staffId] = noteByReceiver;
		    						}
		    						// 将新的数组添加到缓存中
		    						_index.ctiInit.AudioNotes.putNotes(sender,notes);
		    						// 销毁弹出框
		    						//if(_indexData)
		    						//{
		    						//	_indexData.destroyDialog();
		    						//	return;
		    						//}
		    						//如果不销毁弹出框，则需要追加自己发送的消息到历史
		    						creatTableBySender(contentArr,$elData,$variable);
		    						$("#windowOnwere"+$variable+' .divEditor').html('');
		    						$elData.find("#wordsNum"+$variable).text(0) ;
		    						
		    					}else{
		    						//alert("通知发送失败！");
		    						_indexData.popAlert("通知发送失败！","发送通知");
		    					}
		    				}
		    			} else {
		    				return;
		    			}
					 });
//		    		var url = Constants.CCACSURL + ip + ":" + port + "/ccbms/"+CTIID+"/ws/operate/sendnotes/" ;
//		    		$.ajax({  
//		    			url : url ,
//		    			type : 'post', 
//		    			async:false,
//		    			data :  dataParas,
//		    			contentType:"application/json; charset=utf-8",
//		    			success : function(json) {
//		    				if(json.result =="0")
//		    				{
//		    					$el.find("#wordsNum").text("");
//		    					// 记录发送通知至csp系统
//		    					var cspDataPara = {'agentIds':'['+_options$variable+']','message':html,'sender':sender};
//		    					Util.ajax.postJson("front/sh/audio!execute?uid=insertNote",cspDataPara,function(json,status){
//		    						if(status){
//		    						}
//		    					});
//		    					// 缓存中的历史通知数据,①先通过发送人查询
//		    					var notes = _index.ctiInit.AudioNotes.getNotes(sender);
//		    					// 判断缓存中是否存在
//		    					if(!notes)
//		    					{
//		    						// 不存在则重新创建json对象
//		    						notes = {};　
//		    					}
//		    					var noteByReceiver ;
//		    					var nowDate = new Date();
//		    					var dateStr = nowDate.getTime();
//		    					var contentArr = new Array();
//		    					for(var i=0;i<optionsObject.length;i++)
//		    					{
//		    						// ②再通过接收人查询，得到历史通知
//		    						noteByReceiver = notes[optionsObject[i].staffId];
//		    						if(!noteByReceiver)
//		    						{
//		    							noteByReceiver = new Array();
//		    						}
//		    						var content ={'sender':sender,'senderName':senderName,'receiver':optionsObject[i].staffId,'receiverName':optionsObject[i].staffName,'content':html,'senderTime':dateStr};
//		    						noteByReceiver.push(content);
//		    						if(i == 0)
//		    						{
//		    							contentArr.push(content);
//		    						}
//		    						// 将本次发送的通知添加到接收人的对象中
//		    						notes[optionsObject[i].staffId] = noteByReceiver;
//		    					}
//		    					// 将新的数组添加到缓存中
//		    					_index.ctiInit.AudioNotes.putNotes(sender,notes);
//		    					// 销毁弹出框
//		    					//if(_indexData)
//		    					//{
//		    					//	_indexData.destroyDialog();
//		    					//	return;
//		    					//}
//		    					//如果不销毁弹出框，则需要追加自己发送的消息到历史
//		    					creatTableBySender(contentArr,$elData,$variable);
//		    					$("#windowOnwere"+$variable+' .divEditor').text('');
//		    					$elData.find("#wordsNum"+$variable).text(0) ;
//		    				}
//		    				else{
//		    					alert("通知发送失败！");
//		    				}
//		    			},
//		    			error : function( XMLHttpRequest, textStatus, errorThrown) {
//		    				alert("通知发送失败！error");
//		    			},
//		    			complete:function(){
//		    				
//		    			}
//		    		}); 
		    		
		    		/**
		    		 * 发送通知调用CTI接口改为后台调用 by   yuxinyuan  end
		    		 */
		    	});
		    	$el.find("#send-history-btn").click(function(e){
		    		_indexData.main.createTab('通知信息查询','js/communication/huawei/audio/communication/querySendNotes');
		    	});
		    	//显示已输入字数  
		    	$el.on("keyup",".divEditor",function(){
		    		var htmltext = $('.divEditor',$elData).text();
					var length = htmltext.length;
					if(length>textLength)
					{
						length = textLength;
						htmltext = htmltext.substr(0,textLength);
						$('.divEditor',$elData).text(htmltext);
					}
					$elData.find("#wordsNum"+$variable).text(length) ;
					
				});
		    };
		 // 根据发生方加载数据
			 var creatTableBySender = function(data,$elData,receiver){
				 if(data.length > 0){
					 var loginStaffId = _index.getUserInfo().staffId;
					 //var html_Time = createTimeDiv(data[data.length-1].senderTime);
					 var strData = "";
					 $.each(data,function(index,value){
						 var str = "";
						 //判断发送人是否是当前用户
						 if(value.sender!=loginStaffId){
							 str = createItem(value);
						 }
						 else
						 {
							 str = createItemRep(value);
						 }
						 strData = str + strData;
					 });
					 var $otherinfoDiv = "#otherinfoDiv" + receiver;
					 $($otherinfoDiv,$elData).prepend(strData);
					 //$("#Message",$el).after(html_Time);
				 }
			 };
			 /*
			 * 创建时间记录框
			 */
			function createTimeDiv(dateStr){
				var repStr = [];
				var date = new Date(dateStr);
				repStr.push(
						'<div class="talk_time_1"><p>'+date.format("yyyy-MM-dd hh:mm:ss")+'</p></div><br/>'
				);
				return repStr.join("");
			};
		    /* 创建聊天对话框 -- 用户 start */
			function createItem(data){
				var repStr = [];
				// 格式化时间
				var dateTime = new Date(data.senderTime);
				var receiver = data.receiver;
				var loginStaffId = _index.getUserInfo().staffId;
				var receiverName = data.receiverName;
				if(receiver == loginStaffId)
				{
					receiverName = data.senderName;
				}
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
			//创建聊天对话框 -- 客服
			function createItemRep(data){
				//var s = msgRe(o);
				var repStr = [];
				//格式化时间
				var dateTime = new Date(data.senderTime);
				var loginStaffId = _index.getUserInfo().staffId;
				repStr.push('<div class="talk_recordboxme_1">'+
						'<div class="user_1"><img class="user_img_touch_1" src="'+_customService+'" title="'+loginStaffId+'" />'+
						'<span class="talk_time_1">'+dateTime.format("hh:mm:ss")+'</span>'+
						'</div>'+
						'<div class="talk_recordtextbg_1">&nbsp;</div>'+
						'<div class="talk_recordtext_1">'+
							creatHtmlByType(data)+
						'</div>'+
					'</div><br/>');
				return repStr.join("");
			}
			//根据数据类型加载
			 var creatHtmlByType = function(data){
				 //文本mediaConstants.MSGTYPE_TEXT
				 _htmlData = '<h3>'+data.content+'</h3>';
				 return _htmlData;
			 };
			//日期格式化
				Date.prototype.format = function(format){ 
					var o = { 
							"M+" : this.getMonth()+1, //month 
							"d+" : this.getDate(), //day 
							"h+" : this.getHours(), //hour 
							"m+" : this.getMinutes(), //minute 
							"s+" : this.getSeconds(), //second 
							"q+" : Math.floor((this.getMonth()+3)/3), //quarter 
							"S" : this.getMilliseconds() //millisecond 
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
				
				function CompareForSort(first, second)
				{
					var firstTime = first['senderTime'];
					var secondTime = second['senderTime'];
				    if (firstTime == secondTime)
				        return 0;
				    if (firstTime < secondTime)
				        return -1;
				    else
				        return 1; 
				}
    return initialize;
});