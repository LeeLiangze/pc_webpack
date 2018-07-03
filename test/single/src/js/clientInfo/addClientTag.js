define([ 'Util',
         '../../tpl/clientInfo/addClientTag.tpl',
         '../../assets/css/clinetInfo/addClientTag.css'],
         function(Util, tpl) {
 			var $el;
 			var _index;
 			var _options;
 			
 			//客户账号id
			var accountId = "";
			//客户多媒体类型id
			var mediaTypeID = "";
 			
 			//客户已有标签集合
 			var hasTagsArr;
 			//标签库标签名称集合
 			var tagNamesLib;
 			
 			//待保存的客户标签集合
 			var clientTags;
 			//标签库标签对象集合
 			var tagsLibObj;
 			
 			var initialize = function(index,options) {
 				_index = index;
 				_options = options;
 				$el = $(tpl);
 				
 				//获取当前客户账号id、媒体类型id
 				accountId = options.accountId;
 				mediaTypeID = options.mediaTypeId;
 				
 				//初始化已有标签和标签库数据
 				contentInit(_options);
 				//定义按钮点击事件
 				eventInit();
 				// 将根节点赋值给接口
 				this.content = $el;
 			};
 			
 			var contentInit = function(_options)
 			{
 				//清空各全局变量中原有数据
 				hasTagsArr = [];
 				clientTags = [];
 				tagNamesLib = [];
 				tagsLibObj = [];
 				
 				var data = {"accountId":_options.accountId,"mediaTypeId":_options.mediaTypeId};
 				//查询客户已有标签   front/sh/media!execute?uid=clientTag001
 				Util.ajax.postJson('front/sh/media!execute?uid=clientTag001',data,function(json,status)
 				{
					if (status)
					{
						for (var i=0;i<json.beans.length;i++)
						{
							var tagId = json.beans[i].tagId;
							tagId = (tagId == undefined) ? "" : tagId;
							clientTags.push(JSON.stringify({"tagId":tagId,"tagName":json.beans[i].tagName}));
							hasTagsArr.push(json.beans[i].tagName);
	    				}
		 				if(hasTagsArr.length > 0)
		 				{
		 					var hasTagsJson = {"hasTagsData":hasTagsArr};
		 					var hasTagsTemplate = Util.hdb.compile($("#hasTags_template",$el).html());
		 					$("#hasTags",$el).html(hasTagsTemplate(hasTagsJson));
		 					
		 				}
		 				for (var i=0;i<hasTagsArr.length;i++)
						{
		 					var tagName = hasTagsArr[i];
		 					var parm = Math.floor(Math.random()*4);
		 					$("#hasTags",$el).find("."+tagName).addClass("tag_"+parm);
						}
		 				if(hasTagsArr.length>14){
		 					$("#addClientTag_textTag",$el).val("最多可定义15个标签!");
						}
					}
 				},true);
 				
 				//初始化标签库数据,从后台获取 front/sh/media!execute?uid=tagLib
 				Util.ajax.postJson('front/sh/media!execute?uid=tagLib',{},function(json,status){
					if (status) {
						var tagsLib = json.beans;
						var tagsLibJson = {};
						if(tagsLib!="")
						{
							for(var i=0;i<tagsLib.length;i++)
							{
								var tagName = tagsLib[i].tagName;
								tagNamesLib.push(tagName);
								if($.inArray(tagName,hasTagsArr) > -1)
								{
									//isSelected:是否已被选择，1：是；0：否
									tagsLibObj.push({"tagId":tagsLib[i].tagId,"tagName":tagName,"isSelected":1});
								}else{
									tagsLibObj.push({"tagId":tagsLib[i].tagId,"tagName":tagName,"isSelected":0});
								}
							}
		 					tagsLibJson.tagsLibData=tagsLibObj;
		 					var tagsLibTemplate = Util.hdb.compile($("#tagsLib_template",$el).html());
		 					$("#tagsLib",$el).html(tagsLibTemplate(tagsLibJson));
		 					for(var i=0;i<tagsLib.length;i++){
		 						var tagName = tagsLib[i].tagName;
		 						var parm = Math.floor(Math.random()*4);
		 						$("#tagsLib",$el).find("."+tagName).addClass("tag_"+parm);
		 					}
			 			}
						else
						{
							$("#tagsLib",$el).html("<span class='no_tags'>标签库中没有数据<span>");
						}
					}
				});
 			};
 			
 			var eventInit = function()
 			{
 				//"保存"按钮点击事件
 				$("#addClientTag_saveBtn",$el).click(function()
 				{
 					var clientTagsStr = clientTags.toString();
 					var accountId = null
//	                   
			        var mediaTypeId = null;
 				    var activeSerialNo = _index.CallingInfoMap.getActiveSerialNo();
 	                var callingInfo = _index.CallingInfoMap.get(activeSerialNo);
 	                if (callingInfo) {
 	                	accountId = callingInfo.getSubsNumber();
 	                	mediaTypeId = callingInfo.getMediaType();
 	                }else{
 	                	accountId = $('.customer_input').val()
 	                	mediaTypeId = '5';
 	                }
	                    
 					var saveData = {
 								"accountId" : accountId,
 								"mediaTypeId" : mediaTypeId,
 								"clientTags":clientTagsStr
 								};
 					Util.ajax.postJson('front/sh/media!execute?uid=clientTag002', saveData, function(json,status)
 					{
 						if (status) {
 							
 				           _index.clientInfo.initCustInfo(accountId);

 							alert("保存客户标签信息成功");
 							_index.destroyDialog();

 						}else{
 							alert("保存客户标签信息失败");
 						}
 					});
 				});
 				
 				//"取消"按钮点击事件
 				$("#addClientTag_cancelBtn",$el).click(function(){
 					_index.destroyDialog();
 				});
 				
				//"自定义标签"文本框聚焦失焦事件
				$("#addClientTag_textTag",$el).focus(function(){
					//对总标签做限制
	 		    	if((hasTagsArr.length)> 14){
	 		    		$(this).val("最多可定义15个标签!");
	 		    	}else{
						$(this).val("");
					}
				}).blur(function(){
					//对总标签做限制
					if(hasTagsArr.length>14){
						$(this).val("最多可定义15个标签!");
					}else{
						$(this).val("输入自定义标签，点击空白处保存");
					}
				});
				
				//"自定义标签"文本框按键松开事件
				$(document).on('mousedown', function(ev){
					ev = ev||window.event;
					var btn = ev.button;
					if(btn == 0 || (_index.queue.myBrowser()=="IE"&&btn == 1)){
						//库量限制
						if(hasTagsArr.length > 14)
						{
							$("#addClientTag_textTag",$el).blur();
							return;
						}	
						var maxlength = $("#addClientTag_textTag",$el).attr("maxlength");
						var tagText=$("#addClientTag_textTag",$el).val();
						var tagText_trim=$.trim(tagText);
						    //tagText_trim = tagText_trim.split("");
						function strlen($tagText_trim){  
						    var len = 0;  
						    for (var i=0; i<$tagText_trim.length; i++) {   
							     var c = $tagText_trim[i].charCodeAt();   
							    //单字节加1   
							     if (c >= 0 && c <= 127) {   
							       len++;
							     }   
							     else {   
							       len+=2;
							     }   
							 }
							 return len;  
						}
						
						if(strlen(tagText_trim.split(""))>12){
						
							 for(var i=0;i<tagText_trim.split("").length;i++){
								 tagText_trim = tagText_trim.replace(/\s/g,"").replace(/[\.\,\;\@\#\$\%\^\&\*\{\}\:\"\<\>\?\u3002\uff1f\uff01\uff0c\u3001\uff1b\uff1a\u201c\u201d\u2018\u2019\uff08\uff09\u300a\u300b\u3008\u3009\u3010\u3011\u300e\u300f\u300c\u300d\ufe43\ufe44\u3014\u3015\u2026\u2014\uff5e\ufe4f\uffe5]/g,"").substring(0,tagText_trim.length-1);
								 if(strlen(tagText_trim.split(""))<=12){
									 break;
								 }
							 }
						 }   
						if(tagText_trim=="")
						{
							$("#addClientTag_textTag",$el).val("").focus();
							return;
						}
						if(tagText_trim!=""&&strlen(tagText_trim.split("")) <= maxlength){
							//去中间空格和特殊符号
							if(tagText_trim.search(/\s/)>-1){
								$("#addClientTag_textTag",$el).val(tagText_trim.replace(/\s/g,"").replace(/[\.\,\;\@\#\$\%\^\&\*\{\}\:\"\<\>\?\u3002\uff1f\uff01\uff0c\u3001\uff1b\uff1a\u201c\u201d\u2018\u2019\uff08\uff09\u300a\u300b\u3008\u3009\u3010\u3011\u300e\u300f\u300c\u300d\ufe43\ufe44\u3014\u3015\u2026\u2014\uff5e\ufe4f\uffe5]/g,""));
							}
							tagText_trim = tagText_trim.replace(/\s/g,"").replace(/[\.\,\;\@\#\$\%\^\&\*\{\}\:\"\<\>\?\u3002\uff1f\uff01\uff0c\u3001\uff1b\uff1a\u201c\u201d\u2018\u2019\uff08\uff09\u300a\u300b\u3008\u3009\u3010\u3011\u300e\u300f\u300c\u300d\ufe43\ufe44\u3014\u3015\u2026\u2014\uff5e\ufe4f\uffe5]/g,"");
							if($.inArray(tagText_trim,hasTagsArr) > -1)
							{
								var _a = $("#hasTags",$el).find("a[name="+tagText_trim+"]");
								_a.addClass("colorRed");
								$("#addClientTag_textTag",$el).val(tagText_trim).focus();
								setTimeout(function(){
									_a.removeClass("colorRed");
			 					},5000);
								return;
							}	
							var parm = Math.floor(Math.random()*4);	
							$("#hasTags",$el).append("<li class='tag_"+parm+"' name='"+tagText_trim+"'><a class='del' name='"+tagText_trim+"'>"+tagText_trim+"<span class='span_del'></span></a></li>");
							hasTagsArr.push(tagText_trim);
							clientTags.push(JSON.stringify({"tagId":"","tagName":tagText_trim}));
							if(hasTagsArr.length > 14)
							{
								$("#addClientTag_textTag",$el).blur();
							}	
							else{
								$("#addClientTag_textTag",$el).focus();
							}
						}
					}
					
				});
 			
	 			//已有标签框中的标签点击事件
				$("#hasTags",$el).on("click","span",function(){
					var tagName = $(this).parent().parent().attr("name");
					$(this).parent().parent().remove();
					hasTagsArr.splice($.inArray(tagName,hasTagsArr),1);
					$("#addClientTag_textTag",$el).blur();	
					if($.inArray(tagName,tagNamesLib) > -1)
					{
						$("#tagsLib",$el).find("a[name='"+tagName+"']").children("span").removeClass("span_added").addClass("span_add");
					}
					var index = -1;
					for(var i in clientTags)
					{
						if($.parseJSON(clientTags[i]).tagName == tagName)
						{
							index = i;
							break;
						}	
					}	
					if(index > -1)
					{
						clientTags.splice(index,1);
					}	
				});
	 			
	 			//标签库中标签点击事件
	 			$("#tagsLib",$el).on("click","li",function()
	 			{
	 				var tagName = $(this).attr("name");
	 				var tagId =  $(this).attr("value");
	 				if(hasTagsArr.length > 14)
					{
	 					$("#addClientTag_textTag",$el).blur();	
	 					$("#tags_tips",$el).addClass("colorRed");
	 					setTimeout(function(){
	 						$("#tags_tips",$el).removeClass("colorRed");
	 					},5000);
	 					return;
					}
	 				if($.inArray(tagName,hasTagsArr) < 0)
	 				{
	 					var parm = Math.floor(Math.random()*4);	
	 					$("#hasTags",$el).append("<li class='tag_"+parm+"' name='"+tagName+"'><a class='del' name='"+tagName+"'>"+tagName+"<span class='span_del'></span></a></li>");
	 					hasTagsArr.push(tagName);
	 					clientTags.push(JSON.stringify({"tagId":tagId,"tagName":tagName}));
	 				}
	 				$("#tagsLib",$el).find("a[name='"+tagName+"']").children("span").removeClass("span_add").addClass("span_added");
	 				if(hasTagsArr.length > 14)
					{
						$("#addClientTag_textTag",$el).blur();
					}
	 			});
 			};

 			return initialize;
 });