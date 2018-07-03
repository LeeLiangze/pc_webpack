define(['Util','Compts',
        '../../index/constants/mediaConstants',
        '../../../tpl/content/businessTree/businessTree.tpl',
        '../../../assets/css/content/editArea/businessTree.css'
        ],
        function(Util,Compts,MediaConstants,tpl){
		var $el;
		var _option;
		var _index;
		//当前显示树
		var currentTree = null;
		//当前head
		var currHead = null;
		/*//省份树对应关系
		var treeMap = {};*/
		//显示树根节点
		var ztreeTemp = null;
		//树的选择部分
		var treeHeader = null;
		//定时器，解决双击引起的单击
		var timerTree = null;
		//登录用户
		var userInfo = null;
		//签入省份id
		var _proviceIds = "";
		//收藏数据id
		var collectIds = "";
		//搜索用
		var currIndex = 0;
		var initialize=function (index,option){
			_proviceIds = "";
			currIndex = 0;
			collectIds = "";
			_option=option;
			_index=index ;
			userInfo = _index.getUserInfo();
			for(var i in _option.tree){
				_proviceIds += _option.tree[i].value+",";
			}
			if(_proviceIds.length){
				_proviceIds = _proviceIds.substring(0,_proviceIds.length-1);
			}
			$el=$(tpl);
			tabInit(_option.tree);
			eventInit();
			this.getCurrentTreeContent = getCurrentTreeContent;
			this.triggerClick = triggerClick;
			this.content = $el;
		};
		//初始化事件
		var eventInit=function(){
			//纠错
			$("#chatBox_error").click($.proxy(correctData,this));
			//向左翻阅
			$el.on('click','#swithLeft', $.proxy(showLeft,this));
			//向右翻阅
			$el.on('click','#swithRight', $.proxy(showRight,this));
			$el.on('focus','#searchData', $.proxy(searchFocus,this));
			//搜索
			$el.on("keydown","#searchData",function(event){
				var e = event||window.event;
				var keycode = e.keyCode ? e.keyCode:e.which;
				　　if (keycode == 13) {
					 searchBtn();
					　 e.stopPropagation();
					　 return false;
				　　}
			});

		};

		var searchFocus = function(){
			var searchData = $.trim($("#searchData",$el).val());
			if(searchData=="请输入搜索内容"){
				$("#searchData",$el).val("");
			}
		};
		//"定位"按钮点击事件
	    var searchValue = "";
	    var searchIndex = 0;
	    var searchBtn= function(){
			var searchData = $.trim($("#searchData",$el).val());
			if(searchData==""||searchData=="请输入搜索内容"){
				_index.popAlert("请输入关键词");
				$("#searchData",$el).focus();
				return;
			}
			if(searchValue == searchData){
				searchIndex++;
			}else{
				searchValue = searchData;
				searchIndex = 0;
			}
			var nodes = currentTree.getNodesByParamFuzzy("name", searchValue, null);
			if (nodes.length>0)
			{
				if(searchIndex+1>nodes.length)
					searchIndex = 0;
				currentTree.expandNode(nodes[searchIndex], true,false, false, false);
				currentTree.selectNode(nodes[searchIndex]);
			}else{
				_index.popAlert("没有找到对应的节点！");
				$("#searchData",$el).focus();
				return;
			}
		};
	    //向左翻阅
	    var showLeft = function(){
	    	if(currIndex==0){
	    		return;
	    	}
	    	currIndex--;
	    	$(treeHeader[currIndex]).show();
	    	$(treeHeader[currIndex+5]).hide();
	    	//if($(treeHeader[currIndex+5]).find("a").is('.active')){
	    		$(treeHeader[currIndex]).trigger("click");
	    	//}
	    }
	    //向右翻阅
	    var showRight = function(){
	    	if(currIndex+1==treeHeader.length){
	    		return;
	    	}
	    	$(treeHeader[currIndex]).hide();
	    	$(treeHeader[currIndex+5]).show();
	    	if($(treeHeader[currIndex]).find("a").is('.active')){
	    		$(treeHeader[currIndex+1]).trigger("click");
	    	}
	    	currIndex++;
	    }
	    //纠错
	    var correctData = function(){
	    	var proviceId = currHead.find("a").attr("proviceId");
	    	if(proviceId){
	    		_index.showDialog({
	    			title:'业务树内容纠错',   //弹出窗标题
	    			url:'js/content/businessTree/addCorrect',    //要加载的模块
	    			param:{"proviceId":proviceId},
	    			width:700,  //对话框宽度
	    			height:350  //对话框高度
	    		});
	    	}
	    };
	    //获取当前树的tpl
	    var getCurrentTreeContent = function(){
	    	return currentTree&&currentTree.content;
	    };
	    //触发点击事件
	    var triggerClick = function(){
			//获取收藏数据
			Util.ajax.postJson('front/sh/common!execute?uid=businessTree003',{"staffId":userInfo.staffId,"proviceIds":_proviceIds},function(json,status){
	    		if(status){
	    			collectIds = json.bean.serviceTreeIds;
	    		}else{
	    			return;
	    		}
	    	});

	    };
	   //表格初始化
	   var tabInit = function(treeData){
		   var treeContent = $(".treeContent", $el);
		   if(treeData.length){
			    for(var i in treeData){
			    	if(treeData[i].name == "互联网服务团队"){
			    		treeData[i].val = "服务团队";
			    	}else{
			    		treeData[i].val=treeData[i].name;
			    	}
			    }
			    var template = Util.hdb.compile($("#head_template",$el).html());
		    	var data = {"treeData":treeData};
		    	//初始化header
				$("#treeUl",$el).html(template(data));
				treeHeader = $(".treeLi", $el);
				var parameter = {"staffId":userInfo.staffId,"proviceIds":_proviceIds};
				//var parameter = {"staffId":"zhangqiang","proviceIds":"00030009"};
				treeHeader.each(function(i,element){
					$(element).click(function(){
						//获取收藏数据
    	    			Util.ajax.postJson('front/sh/common!execute?uid=businessTree003',parameter,function(json,status){

            	    		if(status){
            	    			collectIds = json.bean.serviceTreeIds;
            	    			treeHeader.children().removeClass("active");
            	    			currHead = $(element);
            	    			var tempA = currHead.find("a");
            	    			tempA.addClass("active");
            	    			var proviceId = tempA.attr("proviceId");
            	    			ztreeTemp =  $('<div id="tree_'+proviceId+'"></div>');
            	    			currentTree = generateTree(proviceId);
            	    			treeContent.html(currentTree.content);
            	    		}else{
            	    			return;
            	    		}
            	    	});
					});
			    });
				treeHeader[0]&&$(treeHeader[0]).trigger("click");
				//if(treeHeader.length>3){
					$('#swithLeft',$el).show();
					$('#swithRight',$el).show();
					treeHeader.each(function(index,element){
					    if(index>5){
					    	$(element).hide();
					    }
					});
				//}
				if(treeHeader.length == 1){
				  $(".headContent",$el).hide();
				}
		   }
	   }
	   var generateTree = function(proviceId){
		   var _tree = null;
		   Util.ajax.postJson('front/sh/common!execute?uid=businessTree002',{"proviceId":proviceId},function(json,status){
			   if(status){
				   if(!json.beans.length){
					   if(!$("#chatBox_tab").is(':hidden')){
						  // _index.popAlert("该省份下没有数据！");
						}
				   }
				   _tree = new Compts.zTree.tierTree(ztreeTemp,json.beans,{
					   'onClick':zTreeOnClick,
					   'onDbClick':zTreeOnDbClick,
					   data: {key: {title: "desc"},
						   	  simpleData: {enable: true}
					   },
					   view: {addDiyDom: addDiyDom }
				   });
				   _tree.content = ztreeTemp;
			   }else{
			   		return;
			   }
		   },true);//此处接口调用之后return成功事件的变量需要使用同步方法
		   return _tree;
	   }
	  //单击事件，赋给callback
	  function zTreeOnClick(event, treeId, treeNode) {
	    	clearTimeout(timerTree);
	    	timerTree = setTimeout(function(){
	    		if("1" == treeNode.nodeType){
		    		var msg=treeNode.desc;
		    		if(msg){
		    			//向百度编辑器设置内容
		    			//_index.editor.ue.setContent(msg);
		    			_index.editor.ue.execCommand('inserthtml', msg);
		    			_index.editor.ue.focus(true);
						//_index.main.currentInPanel.$chatWarp.find('.divEditor').text(msg);
						//var length = $('.divEditor',_index.main.currentInPanel.$chatWarp).text().length;
						//_index.main.currentInPanel.$chatWarp.find("#wordsNum").text(length) ;
					}else{
						_index.popAlert("信息为空");
					}
		    	}
			},300);
	    };
	    //双击事件，赋给callback
	    function zTreeOnDbClick(event, treeId, treeNode) {
	    	var params ={"skillDesc":"","ctiId":"","ccId":"","vdnId":""};
			Util.ajax.postJson("front/sh/media!execute?uid=randomSerialNo",params, function(json, status) {
				if (status) {
					messageId = json.bean.serialNo;
					//skillId = json.bean.skillId;
				}else{
					messageId = _index.contentCommon.getSerialNo();
				}
			},true);//此处调用 生成messageId需在下方使用，需同步。
	    	clearTimeout(timerTree);
	    	//当点击业务项即非目录
	    	if("1" == treeNode.nodeType){
	    		var msg=treeNode.desc;
				if(msg){
					var serialNo = _index.queue.currentQueueData.serialNo;
					var data = {
						serialNo:serialNo,
						channelID:_index.queue.currentQueueData.channelID,
   						content:msg,
   						contentTxt:msg,
   						msgType:'001',
   						mediaID:_index.queue.currentQueueData.mediaID,
     					type:'normal',
   						senderFlag:MediaConstants.SENDER_FLAG_SEAT,
   						originalCreateTime:_index.contentCommon.getCurrentTime(),
                        msgId:messageId
   					};
					//调用发送信息方法
					if(_index.contentCommon.cloneCurrentQueueData.mediaTypeId == MediaConstants.MICROBLOGGING_TYPE){//weibo
						data.mediaTypeId =  _index.contentCommon.cloneCurrentQueueData.mediaTypeId;
						data.channelID = _index.contentCommon.cloneCurrentQueueData.channelID;
						_index.contentCommon.sendMsgWeibo(data);
					}else if(_index.contentCommon.cloneCurrentQueueData.mediaTypeId == MediaConstants.SHORT_MESSAGE_TYPE){//短信
						data.mediaTypeId =  _index.contentCommon.cloneCurrentQueueData.mediaTypeId;
						data.channelID = _index.contentCommon.cloneCurrentQueueData.channelID;
						_index.contentCommon.sendMsgShortM(data);
					}else if (_index.contentCommon.sendMsg(data)) {

						this.hasWaitMsg = false;
					}
				}else{
					_index.popAlert("信息为空");
				}
	    	}
	    };
	   //添加收藏标示
	   function addDiyDom(treeId, treeNode) {
			var aObj = $("#" + treeNode.tId + "_a",ztreeTemp);
			var curClass = "icon01";
			if(treeNode.isParent){
				return;
			}else{
				curClass = collectIds.indexOf(treeNode.id)>-1?curClass:"icon02";
			}
			var editStr = "<span class='demoIcon' id='diyBtn_" +treeNode.id+ "' title='"+treeNode.name+"' onfocus='this.blur();'><span class='button "+curClass+"'></span></span>";
			aObj.append(editStr);
			var ico = $(">span",$("#diyBtn_"+treeNode.id,ztreeTemp)).eq(0);
			if (ico) ico.bind({mouseenter:function(){
				 $(this).addClass("icon03");
		      },mouseleave :function(){
		    	 $(this).removeClass("icon03");
		    }});

			if (ico) ico.bind("click", function(e){
				$(this).removeClass("icon03");
				var data = {serviceTreeId:treeNode.id,staffId:userInfo.staffId,proviceId:treeNode.proviceId};
				if(ico.is('.icon01')){
					//删除收藏
					var that = this;
	    			Util.ajax.postJson('front/sh/common!execute?uid=businessTree005',data,function(json,status){
	    				if (status) {
	    					$(that).removeClass("icon01");
	    					$(that).addClass("icon02");
	    				}else{
	    					return;
	    				}
	    			});
				}else{
					//添加收藏
					var that = this;
					data.collectLimit = MediaConstants.COLLECT_LIMIT;
					Util.ajax.postJson('front/sh/common!execute?uid=businessTree004',data,function(json,status){
	    				if (status) {
	    					$(that).removeClass("icon02");
	    					$(that).addClass("icon01");
	    				}else{
	    					_index.popAlert(json.returnMessage);
	    				}
	    			});
				}
				return false;
			});
		}
		return initialize;
});
