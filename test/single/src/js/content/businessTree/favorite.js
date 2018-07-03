define(['Util','Compts',
		'../../index/constants/mediaConstants',
		'../../../tpl/content/businessTree/favorite.tpl',
		'jqueryui',
		'../../../assets/lib/jQueryUI/jquery-ui.min.css',
        './dom',
        './effect',
        './event'
        ],
        function(Util,Compts,MediaConstants,tpl){
		var $el;
		var _option;
		var _index;
		var collectData = null;
		var defZIndex= 1;
		var template = null;
		var timerTree = null;
		var _proviceIds = "";
		var proviceData = {};
		var initialize=function (index,option){
			_proviceIds = "";
			defZIndex= 1;
			template = "{{#each collectData}}<li name={{serviceTreeId}} id={{id}} proviceId={{proviceId}} sequence={{sequence}} title='{{desc}}'>{{name}}</li>{{/each}}"
			$el = $(tpl);
			_option=option;
			_index=index;
			for(var i in _option.tree){
				proviceData[_option.tree[i].value] = _option.tree[i].name;
				_proviceIds += _option.tree[i].value+",";
			}
			if(_proviceIds.length){
				_proviceIds = _proviceIds.substring(0,_proviceIds.length-1);
			}
			eventInit();
			dataInit();
			this.content=$el;
		};
	    //初始化事件
		//初始化事件
		var eventInit=function(){
			//向左翻阅
			$el.on('click','#unfavorite', $.proxy(unfavorite,this));
			$el.on('click','#moveTop', $.proxy(moveTop,this));
			$el.on('click','#moveUp', $.proxy(moveUp,this));
			$el.on('click','#moveDown', $.proxy(moveDown,this));
		}
		function exchangeSequence(node1,node2){
			var para = {};
    		para.idFirst = $(node1).attr("id");
    		para.sequenceFirst = $(node1).attr("sequence");
    		para.idSecond = $(node2).attr("id");
    		para.sequenceSecond = $(node2).attr("sequence");
    		Util.ajax.postJson('front/sh/common!execute?uid=businessTree006',para,function(json,status){
				if (status) {
					dataInit();
				}else{
					return;
				}
			});
		}
		function unfavorite(){

			var node = $(".current",$el);
			var provice = _option.content.attr("id").substring(5);
			if(node&&provice){
				Util.ajax.postJson('front/sh/common!execute?uid=businessTree005',{serviceTreeId: $(".current",$el).attr("name"),staffId:_index.getUserInfo().staffId},function(json,status){
					if (status) {
						if(provice == node.attr("proviceId")){
							$("#diyBtn_"+node.attr("name")+">span",_option.content).removeClass("icon01");
							$("#diyBtn_"+node.attr("name")+">span",_option.content).addClass("icon02");
						}
						$('#rightMenu',$el).css({"visibility":"hidden"});
						dataInit();
					}else{
						return;
					}
				});
			}
		}
		function moveTop(){
			var node = $(".current",$el);
			var other = node.prevAll();
			if(other.length){
				var temp = other[other.length-1]
				$(temp).attr("id","temp");
				$(temp).attr("sequence",$(other[other.length-1]).attr("sequence")-1);
				exchangeSequence(node[0],other[other.length-1]);
			}
		}
		function moveUp(){
			var node = $(".current",$el);
			var other = node.prev();
			if(other.length){
				exchangeSequence(node[0],other[0]);
			}
		}
		function moveDown(){
			var node = $(".current",$el);
			var other = node.next();
			if(other.length){
				exchangeSequence(node[0],other[0]);
			}
		}
		 //单击事件，赋给callback
		  function zTreeOnClick(msg) {
			  	if(!this.flag){
				 return;
			  	}
		    	clearTimeout(timerTree);
		    	timerTree = setTimeout(function(){
		    		if(msg){
		    			//向百度编辑器设置内容
		    			//_index.editor.ue.setContent(msg);
		    			_index.editor.ue.execCommand('inserthtml', msg);
		    			_index.editor.ue.focus(true);
//						_index.main.currentInPanel.$chatWarp.find('.divEditor').text(msg);
//						var length = $('.divEditor',_index.main.currentInPanel.$chatWarp).text().length;
//						_index.main.currentInPanel.$chatWarp.find("#wordsNum").text(length) ;
					}else{
						alert("信息为空");
					}
				},300);
		    };
		    //双击事件，赋给callback
		    function zTreeOnDbClick(msg) {
		    	clearTimeout(timerTree);
		    	//调用CTI发送消息接口
		    	var params ={"skillDesc":"","ctiId":"","ccId":"","vdnId":""};
				if(msg){
					Util.ajax.postJson("front/sh/media!execute?uid=randomSerialNo",params, function(json, status) {
					if (status) {
						messageId = json.bean.serialNo;
						//skillId = json.bean.skillId;
					}else{
						messageId = _index.contentCommon.getSerialNo();
					}
					},true);
					var serialNo = _index.queue.currentQueueData.serialNo;

					var data = {
						serialNo:serialNo,
						channelID:  _index.queue.currentQueueData.channelID,
   						content:msg,
   						contentTxt:msg,
   						msgType:'001',
   						mediaID:_index.queue.currentQueueData.mediaID,
     					type:'normal',
   						senderFlag:MediaConstants.SENDER_FLAG_SEAT,
   						originalCreateTime:_index.contentCommon.getCurrentTime(),
   						msgId:messageId
   					};
					//调用发送信息的方法
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
					alert("信息为空");
				}
		    };
		//收藏夹初始化
	    var dataInit=function(){
	    	var tmpl = Util.hdb.compile(template);
	    	var parameter = {"staffId":_index.getUserInfo().staffId,"proviceIds":_proviceIds};
	    	//获取收藏数据
			Util.ajax.postJson('front/sh/common!execute?uid=businessTree003',parameter,function(json,status){
	    		if(status){
	    			var collData = json.beans;
	    			var tempProvice = "";
	    			var flag = false;
	    			if(_option.tree.length>1){
	    				for(var i=0;i<collData.length;i++){
	    					if(!tempProvice){
	    						tempProvice = collData[i].proviceId;
	    					}else{
	    						if(tempProvice != collData[i].proviceId){
	    							flag = true;
	    							break;
	    						}
	    					}
	    				}
    					for(var j=0;j<collData.length;j++){
	    					collData[j].proviceName = proviceData[collData[j].proviceId];
		    				if(!collData[j].name){
		    					collData[j].name = "该条信息已被管理员删除";
		    				}
		    				if(flag){
		    					collData[j].name = collData[j].name+"("+collData[j].proviceName+")";
		    				}
	    				}
	    			}else{
	    				for(var m=0;m<collData.length;m++){
		    				if(!collData[m].name){
		    					collData[m].name = "该条信息已被管理员删除";
		    				}
		    			}
	    			}
	    			$("#collectUl",$el).html(tmpl({"collectData":collData}));
	    			var oLis=document.getElementById('collectUl').getElementsByTagName('li');
	    			//双击事件
	    			$(".collectUl>li",$el).dblclick(function(){
	    				zTreeOnDbClick($(this).attr("title"));
    			    });
	    			//单击事件
	    			$(".collectUl>li",$el).click(function(){
	    				zTreeOnClick.call(this,$(this).attr("title"));
	    			});
					for(var i=oLis.length-1;i>=0;i--){
						var oLi=oLis[i];
						oLi.style.position='absolute';
						oLi.style.top=oLi.offsetTop+'px';
						oLi.style.left=oLi.offsetLeft+'px';
						oLi._posi={top:oLi.offsetTop,left:oLi.offsetLeft}
						E.bind(oLi,'mousedown',fnBind(down,oLi));//绑定事件
					}
	    		}else{
	    			return;
	    		}
	    	});
	    };
	    function fnBind(fn,obj){
	    	return function (event){
	    		var event = event||window.event;
	    		fn.call(obj,event);
	    		}
	    	}
	    function down(e){
	    	//收藏选项右键禁止右键菜单
    	    $("#collectUl").bind("contextmenu", function(){
   				return false;
			});
	    	 this.flag = true;
	         var keycode = e.button;
	         this.className='current';
	         var siblings=DOM.siblings(this);
	    	 for(var i=0;i<siblings.length;i++){//在碰撞之前把上一次撞上的结果清除
	    			siblings[i].className='';
	    	 }
	    	  if(2 == keycode){
	    		  $('#moveTop',$el).addClass("ui-state-disabled");
    			  $('#moveUp',$el).addClass("ui-state-disabled");
    			  $('#moveDown',$el).addClass("ui-state-disabled");
	    		  var prev = $(this).prev();
	    		  var next = $(this).next();
	    		  if(prev.length){
	    			  $('#moveTop',$el).removeClass("ui-state-disabled");
	    			  $('#moveUp',$el).removeClass("ui-state-disabled");
	    		  }
	    		  if(next.length){
	    			  $('#moveDown',$el).removeClass("ui-state-disabled");
	    		  }
	    		  $("#menu",$el).menu();
	    		  $('#rightMenu',$el).mouseleave(function(){
	    			  $('#rightMenu',$el).css({"visibility":"hidden"});
	    		  });
	    		  $('#rightMenu',$el).css({"top":this.style.top, "left":"67px", "visibility":"visible"});
	          }else{
	        	  this.style.zIndex=++defZIndex;
	        	  this.initMP=E.MOUSE(e);
	        	  this.initEP={x:this.offsetLeft,y:this.offsetTop};
	        	  if(this.setCapture){
	        		  E.bind(this,'mousemove',move);
	        		  E.bind(this,'mouseup',up);
	        		  this.setCapture();

	        	  }else{
	        		  this.MOVE=fnBind(move,this);
	        		  this.UP=fnBind(up,this);
	        		  E.bind(document,'mousemove',this.MOVE);
	        		  E.bind(document,'mouseup',this.UP);
	        	  }
	          }
	    	E.preventDefault(e);
	    }
	    function move(e){
	    	if((E.MOUSE(e).y-this.initMP.y)*(E.MOUSE(e).x-this.initMP.x)){
	    		this.flag = false;
	    	}
	    	this.style.top=this.initEP.y+(E.MOUSE(e).y-this.initMP.y)+'px';

	    	this.style.left=this.initEP.x+(E.MOUSE(e).x-this.initMP.x)+'px';
	    	var siblings=DOM.siblings(this);
	    	for(var i=0;i<siblings.length;i++){//在碰撞之前把上一次撞上的结果清除
    			siblings[i].className='';
    	    }
	    	var minN=999999;
	    	var nIndex=-1;
	    	this.touchEle=null;
	    	for(var i=0;i<siblings.length;i++){
	    		if(test(this,siblings[i])){
	    			//siblings[i].className='test';
	    			var distance=getDistance(this,siblings[i]);
	    			if(minN>distance){
	    				minN=distance;
	    				nIndex=i;
	    			}
	    		}
	    	}//end for

	    	if(nIndex>-1){
	    		siblings[nIndex].className='test';
	    		this.touchEle=siblings[nIndex];
	    	}
	    }

	    function up(e){//停止拖拽
	    	if(this.touchEle){

	    		/*var tempPosi=this._posi//_posi是在初始化的时候定义的
	    		this._posi=this.touchEle._posi;
	    		this.touchEle._posi=tempPosi;//交换位置
	    		animate(this,{top:this._posi.top,left:this._posi.left},20,3);
	    		animate(this.touchEle,{top:this.touchEle._posi.top,left:this.touchEle._posi.left},20,4);*/
	    		exchangeSequence(this,this.touchEle);
	    		this.touchEle=null;

	    	}else{

	    			animate(this,{top:this._posi.top,left:this._posi.left},20,3);
	    	}
	    	if(this.releaseCapture){
	    		E.unBind(this,'mousemove',move);
	    		E.unBind(this,'mouseup',up);
	    		this.releaseCapture();
	    	}else{
	    		E.unBind(document,'mousemove',this.MOVE);
	    		E.unBind(document,'mouseup',this.UP);
	    	}
	    }
	    function test(ele1,ele2){//碰撞检测
	    	var e1t1=ele1.offsetTop;
	    	var e1t2=ele1.offsetTop+ele1.offsetHeight;
	    	var e1l1=ele1.offsetLeft;
	    	var e1l2=ele1.offsetLeft+ele1.offsetWidth;

	    	var e2t1=ele2.offsetTop;
	    	var e2t2=ele2.offsetTop+ele2.offsetHeight;
	    	var e2l1=ele2.offsetLeft;
	    	var e2l2=ele2.offsetLeft+ele2.offsetWidth;
	    	if(e1t2<e2t1||e1t1>e2t2||e1l2<e2l1||e1l1>e2l2){
	    		return false;
	    	}else{
	    		return true;
	    	}
	    }

	    function getDistance(ele1,ele2){//获得两个元素之间的距离
	    	var h=ele1.offsetTop-ele2.offsetTop;
	    	var w=ele1.offsetLeft-ele2.offsetLeft;
	    	return Math.sqrt(h*h+w*w);
	    }
		return initialize;
});
