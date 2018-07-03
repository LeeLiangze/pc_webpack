/**
 * 转业务办理
 */
 define(['Util',
 	'Compts',
 	'tabs',
 	'../../../index/constants/mediaConstants',
 	'./keyBoard',
 	'../../../../tpl/comMenu/comprehensiveCommunication/automaticProcess/transferConsultVoice.tpl',
 	'../../../../assets/css/comMenu/comprehensiveCommunication/automaticProcess/transferServiceManagement.css'
 	],
 	function(Util,Compts,Tabs,Constants,KeyBoard,tpl){
 	    //系统变量-定义该模块的根节点
 	    var _index,$el,setting,_leftTree,tab,_option;
 	    var initialize = function(index,option){
 	    	_option = option;
 	    	$el = $(tpl);
 	    	_index = index;
 	    	this.content = $el; 
 	    	$("#voiceHot",$el).hide();	
 	    	$("#businessHot",$el).show();
 	    	selectedAllData = new Array();
 	    	tabInit.call(this);
 	    	setting = {
 	    			async: {
	 	   				enable: true,
	 	   				url: getUrl,
	 	   				autoParam:["id"],
	 	   				contentType:"application/json"
 	    			},
 	    		data: {
 	    			simpleData: {
 	    				enable: true
 	    			}
 	    		},
 	    		view: {
 	    			expandSpeed: ""
 	    		},
 					//radio选择
 					check: {
 						enable: true,
 						chkStyle: "radio",
 						radioType: "all"
 					},
 					callback: {
 						onCheck : zTreeOnCheck,
 						beforeCheck: zTreeBeforeCheck
 					}
 				};
 				getLeft(initHotSpot);
 				initSelectBox();
 				initEvent();
 		 		keyBoard = new KeyBoard();
 		 		keyBoard.keyBoardSearch(tabInit,_index,"hotSpot",_option,"servicePinyinSearch","handleDetailTree001",$el,setting);
 			};

 	    //获取 左边插件树
 	    var getLeft=function(fun){
 	    	var cityCode = $("#cityCode select",$el).val();
 	    	var userClass = $("#userClass select",$el).val();
 	    	var languageId = $("#languageId select",$el).val();
 	    	var accessCode = $("#accessCode select",$el).val();
 	    	var params = {
 	    			"cityCode" : cityCode,
 	 	    		"userClass" : userClass,
 	 	    		"languageId" : languageId,
 	 	    		"accessCode" : accessCode,
 					"superSequenceId" : "1",
 					"bizTypeId" : "0771"
 			};
 			//查询树节点方法
 	    	Util.ajax.postJson("front/sh/callHandle!execute?uid=getHandleDetailByRoot",params,function(json,status){
 	    		if (status) {
 					//树节点挂载
 					_leftTree=new Compts.zTree.tierTree($el.find("#ST_zTree"),json.beans,setting);
 					if (fun) {
 						fun();
 					}
 				}else{
 					console.log("业务树查询失败!");
 				}
 			});
 		};

	 	function getUrl(treeId, treeNode) {
			return "front/sh/callHandle!executeRoot?uid=getHandleDetailByRoot&superSequenceId=" + treeNode.id+"&bizTypeId="+treeNode.bizTypeId;
		}
 	    /**
 	     * 树节点勾选事件
 	     */
 	     function zTreeOnCheck(event, treeId, treeNode){
 	     	var delIndex;
 	     	var curData = {
 	     		"id" : treeNode.id,
 	     		"name" : treeNode.name,
 	     		"isParent" : treeNode.isParent,
 	     		"filePath" : treeNode.filePath,
 	     		"messageContent" : treeNode.messageContent,
 	     		"bizTypeId" : treeNode.bizTypeId,
 	     		"accessCode" : treeNode.accessCode,
 	     		"transferCode" : treeNode.transferCode,
 	     		"digitCode" : treeNode.digitCode,
 	     		"cityCode" : treeNode.cityCode,
 	     		"specialId" : treeNode.specialId,
 	     		"languageId" : treeNode.languageId,
 	     		"digitCode" : treeNode.digitCode
 	     	}	    	
 	     	if(treeNode.checked == true) {
	    		//禁止热点点击
	    		$(".hotspotServiceRadio",$el).attr("disabled",true);
	    		//radio
	    		selectedAllData[0] = curData;
	    		//显示选中流程的短信内容
	    		var _indexObj = {
	    			content:curData.messageContent
	    		};
    			var params = {title:"短信",closeable:false,isReAddable:true,url:"js/comMenu/comprehensiveCommunication/automaticProcess/shortMsgTextarea",_index:_indexObj};
    			$(".uiTabItemBody.selected .shortMsgArea",$el).val(curData.messageContent);		            
	    	} else {
	    		//取消热点禁止点击事件
	    		$(".hotspotServiceRadio",$el).attr("disabled",false);
	    		//取消树节点时，关联的热点数据取消 start
	    		var cancelPhrase = treeNode.id;
	    		if($('[id="' + cancelPhrase + 'hotSpot"]',$el).length){
	    			$('[id="' + cancelPhrase + 'hotSpot"]',$el).attr("checked",false);
	    		}
	    		//将热点图标取消
	    		$('[id="' + cancelPhrase + 'checkedLogo"]',$el).css('display','none');
	    		//取消树节点时，关联的热点数据取消 end
	    		//短信内容清空
	    		$(".uiTabItemBody.selected .shortMsgArea",$el).val("");	
	    		//清空短信路径
	    		selectedAllData=[];		
	    	}
	    	showFlowDetail();
	    }

 	    /**
 	     * 显示呼叫转移明细
 	     */
 	     function showFlowDetail() {
 	     	$("p",$el).remove();
 	     	$.each(selectedAllData,function(index,obj){		    		
 	     		//var showContent = obj.filePath;
 	     		var showContent = "";
 	     		var contentId = obj.id;
 	     		//通过子节点id查询父的所有路径 start   样式：10086主流程->SP梦网业务->SP梦网业务_退订
 	     		Util.ajax.postJson("front/sh/callHandle!execute?uid=getFullPathBySequenceId",{"sequenceDetailId":contentId},function(json,status){
 	     			if(status){
 	     				showContent = json.bean.fullPath;
 	    	     		//通过子节点id查询父的所有路径 end
 	    	     		var showContentId = contentId+"Id";
 	    	     		$(".textareaDiv",$el).append("<p id='"+showContentId+"' class='filePathP'>"+showContent+"</p>");
 	    	     		//点击高亮显示
 	    	     		$("#"+showContentId,$el).on("click",function(){
 	    	     			$(this).toggleClass("filePathHightLight");
 	    	     		});
 	    	     		$("#"+showContentId,$el).dblclick(function(){
 	   	    				//取消热点禁止点击事件
 	   	    				$(".hotspotServiceRadio",$el).attr("disabled",false);
 	   	    				//根据路径获取节点
 	   	    				var cancelTreeNode = _leftTree.getNodeByParam("id", contentId, null);
 	   	    				//对应树节点清空
 	   	    				_leftTree.checkNode(cancelTreeNode, false, false, null);
 	   	    				//清除路径节点
 	   	    				$(this).remove();
 	   	    				//清空对应短信 start
 	   	    				$(".uiTabItemBody.selected .shortMsgArea",$el).val("");
 	   	    				//清空对应短信 end
 	   		    	    	//取消树节点时，关联的热点数据取消 start
 	   		    	    	var cancelPhrase = cancelTreeNode.id;
 	   	    				if($('[id="' + cancelPhrase + 'hotSpot"]',$el).length){
 	   		    	    		$('[id="' + cancelPhrase + 'hotSpot"]',$el).attr("checked",false);
 	   		    	    	}
 	   		    	    		//将热点图标取消
 	   		    	    		$('[id="' + cancelPhrase + 'checkedLogo"]',$el).css('display','none');
 	   		    	    	//取消树节点时，关联的热点数据取消 end
 	   		    	 });
 	     			}
 	     		});
// 	     		//通过子节点id查询父的所有路径 end
// 	     		var showContentId = contentId+"Id";
// 	     		$(".textareaDiv",$el).append("<p id='"+showContentId+"' class='filePathP'>"+showContent+"</p>");
// 	     		//点击高亮显示
// 	     		$("#"+showContentId,$el).on("click",function(){
// 	     			$(this).toggleClass("filePathHightLight");
// 	     		});
// 	     		$("#"+showContentId,$el).dblclick(function(){
//	    				//取消热点禁止点击事件
//	    				$(".hotspotServiceRadio",$el).attr("disabled",false);
//	    				//根据路径获取节点
//	    				var cancelTreeNode = _leftTree.getNodeByParam("id", contentId, null);
//	    				//对应树节点清空
//	    				_leftTree.checkNode(cancelTreeNode, false, false, null);
//	    				//清除路径节点
//	    				$(this).remove();
//	    				//清空对应短信 start
//	    				$(".uiTabItemBody.selected .shortMsgArea",$el).val("");
//	    				//清空对应短信 end
//		    	    	//取消树节点时，关联的热点数据取消 start
//		    	    	var cancelPhrase = cancelTreeNode.id;
//	    				if($('[id="' + cancelPhrase + 'hotSpot"]',$el).length){
//		    	    		$('[id="' + cancelPhrase + 'hotSpot"]',$el).attr("checked",false);
//		    	    	}
//		    	    		//将热点图标取消
//		    	    		$('[id="' + cancelPhrase + 'checkedLogo"]',$el).css('display','none');
//		    	    	//取消树节点时，关联的热点数据取消 end
//		    	 });

 	     	});
 	     }

 	    /**
 	     * 显示选中流程的短信内容
 	     */
 	     function showShortMsg(showContent) {
 	     	$('#shortMsgContent',$el).val(showContent);
 	     }

 	     function zTreeBeforeCheck(treeId,treeNode){
 	    	//单选切换选项时，将之前选择的热点清空
 	    	if( _leftTree.getCheckedNodes(true)[0] && _leftTree.getCheckedNodes(true)[0].id != treeNode.id){	    			
	    		//将热点图标取消
	    		$(".checkedLogo",$el).css('display','none');
	    		//热点的checkbox全取消
	    		$(":checkbox").prop("checked",false);
	    	}
	    }

	    var initSelectBox = function() {
	    	createSelecter("所属城市|级别|语种|接入码","cityCode|userClass|languageId|accessCode");
	    }
	    //创建下拉框
	    function createSelecter(labels,elIDs){
	    	var labelArray = [],elIDArray=[];
	    	while(elIDs.indexOf("|") > 0){
	    		elIDArray = elIDs.split("|");
	    		$.each(elIDArray,function(index,value){
	    			$el.find("#"+value).empty();
	    		});
	    		break;
	    	}
	    	while(labels.indexOf("|")>0){
	    		labelArray = labels.split("|");
	    		break;
	    	}	    	
	    	Util.ajax.postJson("front/sh/common!execute?uid=s008",{moduleId:"102",cateGoryId:"102003"},function(jsonData,status){
	    		if(status){
	    			var HTML = "";
	    			$.each(jsonData.beans,function(index,value){
	    				var option = "<option value=''>全部</option>";
	    				var optionStr = value.content;
	    				var elID = elIDArray[index];
	    				var label = labelArray[index];
	    				if(optionStr.length != 0){
		    				var optionArray = optionStr.split(";");
		    				$.each(optionArray,function(index,value){
		    					var optionSub1 = value.substr(0,value.indexOf(":"));
		    					var optionSub2 = value.substr(value.indexOf(":")+1,value.length-1);
		    					option += "<option value='"+optionSub1+"'>"+optionSub2+"</option>";
		    					HTML = "<label>"+label+"</label><div><select style='-webkit-appearance: menulist-button;' name='"+elID+"'>"+option+"</select></div>";
		    				}); 
		    			}
	    				$el.find("#"+elID).append(HTML);
	    			});		
	    			//$("select",$el).removeAttr("appearance");
	    		}else{
	    			console.log("业务办理通过s008获取下拉选项失败");
	    		}	    		
	    	});
	    }

	    //初始化热点数据
	    var initHotSpot = function(){
			//ztree滚动条动态改变 start
			var title = $('#ST_zTree',$el);//the element I want to monitor
			   $("#ST_zTree").scrollLeft(0);
				title.bind('DOMNodeInserted', function(e) { 
				$("#ST_zTree").scrollLeft($("#ST_zTree").scrollLeft()+20);
				$("#ST_zTree").scrollTop($("#ST_zTree").scrollTop()+50);
				});
			//ztree滚动条动态改变 end
	    	var treeNodesForHotSpot = _leftTree.getNodes();
			//随便取一个bizTypeId,树中所有节点的bizTypeId相同
			var bizTypeId =  treeNodesForHotSpot[0].bizTypeId;
			var nameSet = "";
			var treeNameArray = [];
			//业务办理热点
			Util.ajax.postJson("front/sh/callHandle!execute?uid=getHandleDetailFromCache",{"bizTypeId":bizTypeId},function(json,status){
				if(status){
					nameSet = json.bean.nameSet;
					if(nameSet != "" && typeof(nameSet) != "undefined"){
						if(nameSet.indexOf(";") > 0){
							treeNameArray = nameSet.split(';');
						}else{
							treeNameArray.push(nameSet);
						}
					}           			
           			//动态生成热点li
           			if(treeNameArray && treeNameArray.length > 0){
           				var pathArray = [];
           				$.each(treeNameArray,function(index,value){
           					var hotSpotId,hotSpotName;
           						if(value.indexOf("|") > 0){
           							var hotSpotArray = value.split("|");
           							var hotSpotId = hotSpotArray[0];
           							var hotSpotName = hotSpotArray[1];
           							var pathTitle = "";
           							Util.ajax.postJson("front/sh/callHandle!execute?uid=getFullPathBySequenceId",{"sequenceDetailId":hotSpotId},function(json,status){
           			 	     			if(status){
           			 	     				pathTitle = json.bean.fullPath;
           			 	     				$("#businessHotUl",$el).append("<li class='hotspotLi'><img id='"+hotSpotId+"checkedLogo' class='checkedLogo' src='src/assets/img/login/select.png'/><input type='checkbox' class='hotspotServiceRadio' name='hotSpot' id='"+hotSpotId+"hotSpot' value='"+hotSpotId+"'><span title='"+pathTitle+"'>"+hotSpotName+"</span></li>");
           			 	     			}
           			 	     		});
//           							$.each(pathArray,function(index,obj){
//           								$("#businessHotUl",$el).append("<li class='hotspotLi'><img id='"+hotSpotId+"checkedLogo' class='checkedLogo' src='src/assets/img/login/select.png'/><input type='checkbox' class='hotspotServiceRadio' name='hotSpot' id='"+hotSpotId+"hotSpot' value='"+hotSpotId+"'><span title='"+obj+"'>"+hotSpotName+"</span></li>");
//           							});
     //      							$("#businessHotUl",$el).append("<li class='hotspotLi'><img id='"+hotSpotId+"checkedLogo' class='checkedLogo' src='src/assets/img/login/select.png'/><input type='checkbox' class='hotspotServiceRadio' name='hotSpot' id='"+hotSpotId+"hotSpot' value='"+hotSpotId+"'><span title='aaa'>"+hotSpotName+"</span></li>"); 
           						} 
               			});
           			}
           			//$(".hotspotServiceRadio",$el).change(function(){
           			$("#businessHotUl",$el).on("change",".hotspotServiceRadio",function(){
           				var hotSpotName = $(this).val();
           					if($(this).is(':checked')){
           					//根据路径获取节点
           					var cancelTreeNode = _leftTree.getNodeByParam("id", hotSpotName, null);
           					if(cancelTreeNode){
    	    					//将热点小图标显示出来
    	    					var uncheckedLogo = hotSpotName+"checkedLogo";
    	    					$('[id="' + uncheckedLogo + '"]',$el).css('display','block');
    	    					//对应树节点勾选
    	    					_leftTree.checkNode(cancelTreeNode, true, false, true);
    	    					//树节点展开
        	    				_leftTree.expandNode(cancelTreeNode, true, true, true);
        	    				//禁止其他热点点击
        	    				$(".hotspotServiceRadio",$el).attr("disabled",true);
        	    			}else{
        	    				//hotSpotName 节点id   start
        	    	 	    	var cityCode = $("#cityCode select",$el).val();
        	    	 	    	var userClass = $("#userClass select",$el).val();
        	    	 	    	var languageId = $("#languageId select",$el).val();
        	    	 	    	var accessCode = $("#accessCode select",$el).val();
        	    				var params = {
        	    	 	    			"cityCode" : cityCode,
        	    	 	 	    		"userClass" : userClass,
        	    	 	 	    		"languageId" : languageId,
        	    	 	 	    		"accessCode" : accessCode,
        	    	 					"bizTypeId" : "0771",
        	    	 					"sequenceDetailId" : hotSpotName
        	    	 			};
        	    	 			//查询树节点方法
        	    	 	    	Util.ajax.postJson("front/sh/callHandle!execute?uid=handleDetailTree001",params,function(json,status){
        	    	 	    		if (status) {
        	    	 	    			if(json.beans.length > 0){
        	    	 	    				//树节点挂载
            	    	 					_leftTree=new Compts.zTree.tierTree($el.find("#ST_zTree"),json.beans,setting);
            	    	 					var cancelTreeNode = _leftTree.getNodeByParam("id", hotSpotName, null);
            	    	 					//将热点小图标显示出来
                	    					var uncheckedLogo = hotSpotName+"checkedLogo";
                	    					$('[id="' + uncheckedLogo + '"]',$el).css('display','block');
                	    					//对应树节点勾选
                	    					_leftTree.checkNode(cancelTreeNode, true, false, true);
                	    					//树节点展开
                    	    				_leftTree.expandNode(cancelTreeNode, true, true, true);
                    	    				//禁止其他热点点击
                    	    				$(".hotspotServiceRadio",$el).attr("disabled",true);
        	    	 	    			}else{
        	    	 	    				$(":checkbox").prop("checked",false);
        	    	 	    				_index.popAlert("请修改您的筛选条件！");
        	    	 	    			}
        	    	 				}else{
        	    	 					console.log("业务树加载失败");
        	    	 				}
        	    	 			});
        	    	 	    	//hotSpotName 节点id   start
//        	    				_index.popAlert("该热点树节点未加载！");
//        	    				$(this).attr("checked",false);
        	    			}
        	    		}else{
           					//根据路径获取节点
           					var cancelTreeNode = _leftTree.getNodeByParam("id", hotSpotName, null);
    	    				//对应树节点取消
    	    				_leftTree.checkNode(cancelTreeNode, false, false, true);
    	    			}
    	    		});
           			//$(".hotspotLi .checkedLogo",$el).click(function(e){
           			$("#businessHotUl",$el).on("click",".hotspotLi .checkedLogo",function(e){
           				//取消禁止热点点击事件
           				$(".hotspotServiceRadio",$el).attr("disabled",false);
           				//获取点击的图标id
           				var checkedLogo = $(e.target).attr('id');
           				var hotSpotId = checkedLogo.substr(0,checkedLogo.indexOf('checkedLogo'));
           				//将图标隐藏
           				$('[id="' + checkedLogo + '"]',$el).css('display','none');
       					//根据路径获取节点
	    				var cancelTreeNode = _leftTree.getNodeByParam("id", hotSpotId, null);
           				//对应树节点取消
	    				_leftTree.checkNode(cancelTreeNode, false, false, true);
	    			});           			
           		}else{
           			console.log("业务办理初始化热点数据getHandleDetailFromCache失败");
           		}
           	});
			//////			
			$("#treeCancel",$el).click(function(){				   	
					var nodes = _leftTree.getCheckedNodes(true);
					if (nodes.length>0) { 
						//清空树节点
						_leftTree.checkNode(nodes[0], false, false, true);
						clear.call(this);
					}else{
						_index.popAlert("已重置！");
					}
			});
		}
	    
	    function getMsgId(startNum){
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
        }
	    
	    var clear = function(){
			//清空输入框
			 $("#searchInput",$el).val("");
			 //清空热点区
			$("[name=hotSpot]:checkbox").each(function(){
				$(this).attr("checked",false).attr("disabled",false);
				});
			$(".checkedLogo",$el).css('display','none');
			//清空路径区
			$(".textareaDiv",$el).empty();
			//清空短信区
			$('.shortMsgTabs',$el).empty();
			selectedAllData = new Array();
			tabInit.call(this);
	    };
	    
	    //选择筛选条件后，自动搜索结果
		var initEvent = function() {
 			$("#cityCode",$el).change(function(){
 				//清空相应内容
 				clear.call(this);
 				getLeft();
 			});
 			$("#userClass",$el).change(function(){
 				//清空相应内容
 				clear.call(this);
 				getLeft();
 			});
 			$("#languageId",$el).change(function(){
 				//清空相应内容
 				clear.call(this);
 				getLeft();
 			});
 			$("#accessCode",$el).change(function(){
 				//清空相应内容
 				clear.call(this);
 				getLeft();
 			});
 			$(".buttonDiv .button",$el).on("click",function(){
 				//调用发送短信接口
 				var smsContent = $(".shortMsgArea",$el).val();
 				var activeSerialNo=_index.CallingInfoMap.getActiveSerialNo();
 				var callingInfo = _index.CallingInfoMap.get(activeSerialNo);
 				var smsCode;
 				if(callingInfo){
 					smsCode = callingInfo.subsNumber;
 					//短信接口 start
 	 				var startNum = Constants.STARTNUM;
 	 				var msgId = getMsgId(startNum);
 	 				var params = {
 	 					"smsCode" : smsCode,
 	 					"smsContent" : smsContent,
 						"msgType" : "0199999999",//msgType普通短信
 						//"effectiveDate" : "",//默认为立即发送
 						"subPort" : "",//默认为10086
 						"opId" : _index.getUserInfo().staffId,
 						"smsType" : "15",//smsType
 						//////////
 	        		  "serialNo":activeSerialNo,//生成一个新的流水号
 	        		  "contactId":callingInfo.getContactId(),
 	          		  //"effectiveDate":data.originalCreateTime,//var now = _index.utilJS.getCurrentTime();
 	          		  "effectiveDate": _index.utilJS.getCurrentTime(),
 	          		  "subPort":"",
 	          		  "opId":_index.CTIInfo.workNo,//_index.getUserInfo().staffId,//_index.CTIInfo.workNo,
 	                  "fromOrgId": "001",//callingInfo.getFromOrgId()?callingInfo.getFromOrgId():"",//undefined//001
 	                  "clientId": "00011",//callingInfo.getClientId()?callingInfo.getClientId():"",//undefined//00011
 	                  "msgId": msgId,
 	                  "fromUserName": "080007",//callingInfo.getToUserId()?callingInfo.getToUserId():"",//"080007"//undefined
 	                  "toUserName": callingInfo.getCallerNo(),
 	                  "channelId":"020002",//_index.contentCommon.cloneCurrentQueueData.channelID,//"020002"
 	                  "replyStaffId": _index.CTIInfo.workNo
 						////////////////////	
 	 					};
 	 					Util.ajax.postJson("front/sh/media!execute?uid=sendMessage",params,function(json,status){
 	 						_index.popAlert("消息发送成功");
 	 						startNum = startNum +1;
// 	 						if(status){
// 	 							_index.popAlert("消息发送成功");
// 	 						}else{
// 	 							//_index.popAlert("消息发送失败,请重新发送");
// 	 						}
 	 					});
 					//短信接口 end				
 				}else{
 					_index.popAlert("没有会话，无法发送短信");
// 					if(_index.chatTools){
// 						smsCode = _index.chatTools.content.find("#listWrap li.shortMsg").attr("data-phoneNumber");
// 					}
// 					else{
// 						_index.popAlert("没有会话，无法发送短信");
// 					}
 				}

 				});
 			//转出接口
 			$("#transferOut",$el).on("click",function(){
 				var transferOutNodes = new Array();
 				transferOutNodes = _leftTree.getCheckedNodes(true);
 				if(transferOutNodes.length != 1){
 					_index.popAlert("请选择转接节点！");
 				}else{
 					var activeSerialNo=_index.CallingInfoMap.getActiveSerialNo();
 					var callingInfo = _index.CallingInfoMap.get(activeSerialNo);
	 					if(callingInfo){
	 						var mediaType = callingInfo.mediaType;
	 			    		//判断callingInfo中的mediaType 为5为语音，其他的提示不能转出!
	 	 					if(mediaType == 5){
	 				        	 //touch001中赋值 start
	 				        	 var digitCode = selectedAllData[0].digitCode;
	 				        	 var languageId = selectedAllData[0].languageId;
	 				        	 callingInfo.setDigitCode(digitCode);
	 				        	 callingInfo.setLanguageId(languageId);
	 				        	 if(languageId == "01"){
	 				        	 	callingInfo.setLanguageName("普通话");
	 				        	 }
	 				        	//touch001中赋值 end
	 				        	var callId = callingInfo.callId;
	 					        var contactId = callingInfo.contactId;
	 				        	var transType = $("input:radio:checked",$el).val();//一定和tpl对应
	 					         var accessCode,transferCode,transferParam,logParam;
	 						     //日期时间 start
	 						   var now = _index.utilJS.getCurrentTime();
	 						     //日期时间 end
	 						     if(selectedAllData.length){
	 						     	accessCode = selectedAllData[0].accessCode;
	 						     	transferCode = selectedAllData[0].transferCode;
	 						     	transferParam = {
	 						    			//"typeId" : "001",
	 						    			"typeId" : selectedAllData[0].specialId, 
	 						    			"callId" : contactId,//callId,
	 						    			"nodeId" : selectedAllData[0].id,
	 						    			"callerNo" : callingInfo.getCallerNo(),
	 						    			"calledNo" : callingInfo.getCalledNo(),
	 						    			"subsNumber" : callingInfo.getSubsNumber(),
	 						    			"workNo" : _index.CTIInfo.workNo,
	 						    			"sceneFlg" : "001002"//新人工引导转IVR
	 						    		};					    		
	 						    		//testData 
//	 						    		transferCode = "4100";
//	 						    		accessCode = "27010086";
//	 						    		transferCode = "1605";//洛阳测试
	 						    		//调用工具类转移至IVR
	 						    		var result = _index.callDataUtil.setCallDataAndTransIvr(transType, accessCode, transferCode, transferParam);
	 						    		if(result == "0"){
	 						    			if(transType == "1"){
	 						    				_index.popAlert("挂起转成功！");
	 						    			}else{//页面为0选项，1释放转 
							    				//transferMode = 1;
							    			}
	 						    			//将checknode放入index & 将热点存入缓存
	 						    			var nodes = _leftTree.getCheckedNodes(true);
	 						    			logParam = {
	 												"isExt" : true,
	 												"operator" : _index.getUserInfo().staffId,
	 												"operBeginTime" : now,
	 												"operEndTime" : now,
	 												"operId" : "009",//转IVR
	 												"accessCode" : selectedAllData[0].accessCode,
	 												"subsNumber" : callingInfo.getSubsNumber(),
	 												"serialNo" : activeSerialNo,//"001",
	 												"contactId" : callingInfo.contactId,//"001",
	 												"callerNo" : callingInfo.getCallerNo(),
	 												"subsNumber" : callingInfo.getSubsNumber(),
	 												"transferMode" : transType,
	 												"transferCode" : transferCode,
	 												"digitCode" : selectedAllData[0].digitCode,
	 												"flowId" : selectedAllData[0].id,
	 												"flowName" : selectedAllData[0].name,
	 												"flowFullName" : selectedAllData[0].filePath,
	 												"flowCityCode" : selectedAllData[0].cityCode,
	 												"originalCallerNo" : callingInfo.getCallerNo(),
	 												"serviceTypeId" :  callingInfo.serviceTypeId,//selectedAllData[0].bizTypeId,
	 												"status" : "1"
	 								         	};
	 							       	   //将各个节点的热点入缓存 
	 							       	   Util.ajax.postJson("front/sh/callHandle!execute?uid=putHandleDetailInCache",{"treeNodes":JSON.stringify(nodes)},function(json,status){
	 							       	   			if(status){
	 							              			console.log("业务办理热点入缓存成功");
	 							              		}else{
	 							              			console.log("业务办理热点入缓存失败");
	 							              		}
	 							              	});
	 							       	   	//转出成功，调用日志接口 start
	 							       	   	Util.ajax.postJson("front/sh/logs!execute?uid=ngcslog001",logParam,function(json,status){
	 							       	   		if(json.returnCode == 0){
	 							       	   			_index.popAlert("业务呼叫日志入库成功！");
	 							       	   		}else{
	 							       	   			_index.popAlert("业务呼叫日志入库失败！");
	 							       	   		}
	 							       	   	});
	 							         	 //转出成功，调用日志接口 end
	 							       	   		//关闭页面
	 							       	   		_index.destroyDialog();
	 							         	}else{
	 						    			//转出失败，调用日志接口 start
	 						    			logParam = {
	 												"isExt" : true,
	 												"operator" : _index.getUserInfo().staffId,
	 												"operBeginTime" : now,
	 												"operEndTime" : now,
	 												"operId" : "009",//转IVR
	 												"accessCode" : selectedAllData[0].accessCode,
	 												"subsNumber" : callingInfo.getSubsNumber(),
	 												"serialNo" : activeSerialNo,//"001",
	 												"contactId" : callingInfo.contactId,//"001",
	 												"callerNo" : callingInfo.getCallerNo(),
	 												"subsNumber" : callingInfo.getSubsNumber(),
	 												"transferMode" : transType,
	 												"transferCode" : transferCode,
	 												"digitCode" : selectedAllData[0].digitCode,
	 												"flowId" : selectedAllData[0].id,
	 												"flowName" : selectedAllData[0].name,
	 												"flowFullName" : selectedAllData[0].filePath,
	 												"flowCityCode" : selectedAllData[0].cityCode,
	 												"originalCallerNo" : callingInfo.getCallerNo(),
	 												"serviceTypeId" : callingInfo.serviceTypeId,//selectedAllData[0].bizTypeId,
	 												"status" : "0",
	 												"failId" : result
	 								         	};
	 								         		Util.ajax.postJson("front/sh/logs!execute?uid=ngcslog001",logParam,function(json,status){
	 								         			if(json.returnCode == 0){
	 								         				_index.popAlert("呼叫日志入库成功！");
	 								         			}else{
	 								         				_index.popAlert("呼叫日志入库失败！");
	 								         			}
	 								         		});
	 							         	 //转出失败，调用日志接口 end
	 							         	 _index.popAlert("转出失败！请重新操作");
	 							         	}
	 						    	}else {
	 						    		_index.popAlert("请选择需要转至的节点！");
	 						    	}
	 						    }else{
	 						    	_index.popAlert("非语音会话不能转出！");
	 						    }
	 					}else{
	 						_index.popAlert("当前没有会话接入，无法操作！");
	 					}
 								         
					}
				});
	}

	var tabInit = function(){
			var config = {
				container:$('.shortMsgTabs',$el),
				data: {
					items : [
					{title:"短信",
					closeable:false,
					url:"js/comMenu/comprehensiveCommunication/automaticProcess/shortMsgTextarea",
				}
				]
			}

		}
		tab = new Tabs(config);
	}

	return initialize;
});