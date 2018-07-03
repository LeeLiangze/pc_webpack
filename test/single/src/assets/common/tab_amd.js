/**
 * Tab组件

 * 
 * @param {Object} d={
 *   selectedIndex:首次加载时选择第几个tab 
 * items：[
 * {
 *     title:string         tab的头部标签内容，
 *     url:  string         tabbody 加载哪个路径下的文件
 *     dom:id string        tab body用哪个dom节点作为内容
 *     html：string         tab body使用html字符串作为内容
 *     isFrame:boolean      tab body使用iframe模式
 *     closeable：boolean    tab标签是否可关闭,
 *     width:null,          Tab页标签头宽度 
 *     icon：string          tab标签前边加入icon
 *     isDisabled:false,     是否可用：false 可用 true不可用
 *     isdblClickClose    true
 *     
 * }
 * 
 * ]
 * ,...............
 * }
 * @param {Object} o={
 *       container：dom          tab页渲染的容器
 *       data:json             tab数据源
 *       cssName           设置class name以改变样式。但必须保证uiTab样式下的结构都是一致的
 *       closeable：        tab标签是否可关闭（默认可以）
 *       isLazy:boolean      是否使用懒加载（默认是）
 *       isDisabled:false,   是否可用 签
 *       tabActiveMode     tab页关闭后，激活新tab的策略（last：激活最新一次使用的tab；next:激活被关闭tab的下一个tab）
 *       headWidth:"auto"   头宽
 *     	 isdblClickClose  是否启用tab的双击关闭该tab事件
 *       titleClass     根据该参数设置tab标题样式，区分一级tab和二级tab titleClass:uiTabItemHead(一级);titleClas:normal(二级)
 *       titleOverClass 根据该参数设置tab悬浮样式，over(一级) overT(二级)
 *       contextMenu 右键菜单配置
 *       isContextMenu 是否启动右键菜单
 *       contentHeight 指定tab访问页面高度
 *       extendBtn_tip tip提示信息
 ×       titleCurrentClass 标题选中样式
 *       isAdjustHeightByContent //是否根据内容自动调整高度。如果否，则高度设置为父亲的100%
 *       isReAddable  是否创建并打开相同tab项
 *       removeActionDuartion:null, //动画效果关闭tab耗时
 *	     minTabCount:1//至少保留Tab页个数
 * }
 */
 //text!../node_modules/compts_npm/components/tab/tab_load.tpl
define([
	// 'text!assets/components/tab/tab.tpl',
	'jquery.placeholder'
	],function(
		// load
		){
	//创建tab对象
	function Tab(options){
		var self=this;
		this.curItem=null;
		this.items=[];
		this.tabtime=0; //每次tab页被创建或show时，tabtime都会++，并且附给tab，用于最近算法
		this.settings=$.extend({
			container:document.body,
			data:[],
			colNum:10,//下拉列表每列显示个数
			colWidth:120,//下拉列表li宽度
			closeable:true,
			isDisabled : false,
			isLazy:true,
			cssName:"uiTab" ,     //可根据需要设置class name以改变样式。但必须保证uiTab样式下的结构都是一致的
			titleClass: "uiTabItemHead",
			titleOverClass: "over",
			contextMenuData: [
				{ title: 'close this tab' , click: function(e,menuItem,tabItem){ tabItem.find(".uiTabClose").click(); } },
				{ title: 'close all tab' , click: function(e,menuItem,tabItem){ tabItem.parents(".uiTab:first").find("li").not("first").find(".uiTabClose").click(); } }
			],
			isContextMenu:false,
			extendBtn_tip:"more",
			titleCurrentClass:"selected",
			//headHeight:"30",    //头高
			headWidth:"auto", //头宽
			//tabHeight:"auto",   //auto时，根据内容自适应；具体值时会制定整个tab高度，然后body的高度自动填充。
			isAdjustHeightByContent:false, //是否根据内容自动调整高度。如果否，则高度设置为父亲的100%
			isdblClickClose:true,
			tabActiveMode:"next",  //tab页关闭后，激活新tab的策略（last：激活最新一次使用的tab；next:激活被关闭tab的下一个tab）
			isReAddable:false,
			removeActionDuartion:null, //动画效果关闭tab耗时
			minTabCount:1//至少保留Tab页个数
		},options || {});
		/*格式化字符串*/
		this.container = this.validateParamType(this.settings.container);
		this.dir = "ltr";
		/*事件*/
		this.events={
			tabitemHeadHoverEvent:this.settings.tabitemHeadHoverEvent||null,//function
			tabitemHeadOutEvent:this.settings.tabitemHeadOutEvent||null,
			itemdblclick:this.settings.itemdblclick||[],
			tabitemClick:this.settings.tabitemClick || null
		};
		this.data=this.settings.data;
		//动作
		this.setData(this.data);
	}

	/**
	 *  建立普通tab页
	 * @param {Object} d={
	 *       label
	 *       url
	 *       isFrame 
	 *       closeable 
	 * }
	 */
	Tab.prototype = {
		 //初始dom
		initDom : function(){
			var self = this;
			this.$dom = $("<div class="+this.settings.cssName+"/>").appendTo($(this.container));
			this.$headOutWrap = $("<div class='uiTabHeadOutWrap'/>").appendTo(this.$dom);
			this.$headMarginWrap = $("<div class='headMarginWrap'/>").appendTo(this.$headOutWrap);
			this.$headScrollWrap = $("<div class='headScrollWrap'/>").appendTo(this.$headMarginWrap);
			this.$head = $("<ul class='uiTabHead'/>").appendTo(this.$headScrollWrap);
			this.$body = $("<div class='uiTabBody'/>").appendTo(this.$dom);
			/*下拉列表框*/
			this.$listDiv = $("<div class='uiTabListDiv'/>").appendTo(this.$headOutWrap);
			/*下拉列表点击按钮*/
			this.$dropbtn = $("<input class='dropbtn' type='button' title='"+this.settings.extendBtn_tip+"'/>").appendTo(this.$listDiv);
			this.$uiTabListArea = $("<a href='javascript:void(0)' class='uiTabListArea hidden'/>").appendTo(this.$listDiv);
			/*下拉列表框*/
			this.$uiTabListArea.click(function(event){
				$(this).addClass('hidden');
			});
			this.$listUL = $("<ul/>").appendTo(this.$uiTabListArea);
			var blur_timer;
			/*单击下拉按钮显示或隐藏下拉框*/
			this.$dropbtn.click(function(e){
				/*显示下拉框并获取焦点*/
				if(self.$uiTabListArea.is(".hidden")){
					self.showListArea(true);
					self.$uiTabListArea.focus();
				/*隐藏下拉框*/
				}else{
					self.showListArea(false);
				}
				e.stopPropagation();
			});
			
			$(document).click(function(e){
				if($(e.target).closest(".uiTabListArea").get(0)==self.$uiTabListArea.get(0)){
					self.$uiTabListArea.focus();
				}
			});
			/*下拉列表框得到焦点事件*/
			self.$uiTabListArea.focus(function(){
				if(blur_timer){
					clearTimeout(blur_timer);
				}
			});
			/*下拉列表框失去焦点事件*/
			self.$uiTabListArea.bind("blur",function(e){
				blur_timer = setTimeout(function(){
					self.showListArea(false);
				},200);
			});
	        /*设置Tab页是否可用*/
			this.setDisabled(this.settings.isDisabled);
		},
		/*创建Tab页*/
		createTab : function(options, businessOptions){
			var tabItem = new TabItem(this,options, businessOptions);
			tabItem.on('tabActive', $.proxy(function(data){
				this.trigger('tabActive', data)
			}, this));
			return tabItem;
		},
		/***
		 * 返回打開的tab里的第i個。  可以重寫該函數，以實現獲取有特定含義的tab
		 * @param {Object} 
		 * 如果tab的data的key和value符合入参，则返回tab
		 *
		 *如果key是个数字，则作为index处理，即返回第key个tab
		 *
		 */
		getTab : function(key,value){
			var self = this;
			var items = $.grep(self.items,function(n,i){
				if(typeof key == "number"){
					return key == i;
				} else if((typeof key=="string") && (typeof value!="undefined")){
					return n[key] == value;
				}
			});
			if(items && typeof key == "number"){
				return items[0];	
			}
			return items;
		},
		resize : function(pfun,forcedRePanel){
			var parent = $("."+this.settings.cssName);
		
			var lastWidth = parent.attr("lastWidth") || 0;
			var nowWidth = parent.width();
			
			var lastHeight = parent.attr("lastHeight") || 0;
			var nowHeight = parent.height();
			
			if(lastWidth!=nowWidth || lastHeight!=nowHeight || forcedRePanel)
			{
				parent.attr("lastWidth",nowWidth);
				parent.attr("lastHeight",nowHeight);
				
				var contentHeight = this.settings.contentHeight;
				if(contentHeight=="auto")
					return;
				else if(!contentHeight)	//full parent
				{
					var parent = $("."+this.settings.cssName);
					var title = $("."+this.$headOutWrap.attr("class"));
					var h = parent.height();
					contentHeight = h - title.outerWidth();
				}
				var content = $("."+this.$body.attr("class"));
				// iframe tab
				content.find("iframe").height(contentHeight);
				
				// ajax tab
				content.children(".panel").each(function(){
					if($(this).children("iframe").length==0)
						$(this).height(contentHeight);
				});
				
				if(typeof pfun=="function"){
					pfun();
				}
			}
		},
	    /*重新设置Tab页信息*/
		setTab : function(index,options){
			return this.getTab(index).setTab(options);
		},
	    /*根据Tab页标题获取Tab项*/
		getTabByTitle : function(title){
			return this.getTab("title",title);
		},

		/**
			* 去留白
			*/
		recoverBadSpace : function(){
			var self=this; 
			if(self.items.length==0)return 0;
			
			var oh=self.$head; 
			/*Tab第一个标签页*/
			var first=self.items[0];
			/*Tab最后一个标签页*/
			var last=self.items[self.items.length-1];
			/*Tab页头部宽度*/
			var w=self.$headMarginWrap.outerWidth();
			
			var marginLeft = parseInt(oh.css("marginLeft"))||0;
			var marginRight = parseInt(oh.css("marginRight"))||0;
			if(first._offset().x<0 && last._offset().x+last.$dom.outerWidth()<w ){//ltr: 左边产生遮挡，右边有空白
				var step1= 0-first._offset().x;
				var step2= w-(last._offset().x+last.$dom.outerWidth());
				var step= Math.abs(step1)>Math.abs(step2)?step2:step1;
				oh.css("marginLeft",marginLeft+step)
				  .css("marginRight",marginRight-step);
				return 1; 
			}else if(last.offsetLeft<0 && first.offsetLeft+first.$dom.outerWidth()<w+20){//rtl: 左边产生遮挡，右边有空白
				var step1= 0-last._offset().x;
				var step2= w-(first._offset().x+first.$dom.outerWidth());
				var step= Math.abs(step1)>Math.abs(step2)?step2:step1;
				oh.css("marginRight",marginRight+step);
				
				return 1;
			}else if(first._offset().x>0 && last._offset().x+last.$dom.outerWidth()>w){//ltr: 右边产生遮挡，左边有空白
				var step1= 0-first._offset().x;
				var step2= w-(last._offset().x+last.$dom.outerWidth());
				var step= Math.abs(step1)>Math.abs(step2)?step2:step1;
				oh.css("marginLeft",marginLeft+step);
				return -1 
			}else if(last._offset().x>0 && first._offset().x+first.$dom.outerWidth()>w){ //rtl: 左边产生遮挡，右边有空白
				var step1= 0-last._offset().x;
				var step2= w-(first._offset().x+first.$dom.outerWidth());
				var step= Math.abs(step1)>Math.abs(step2)?step2:step1;
				oh.css("marginRight",marginRight-step);
			}else return 0;
		},

		//設置高度
		setHeight : function(h){
			this.$dom.height(h);
			this.$body.height(h>24?h-24:0);
		},

		//临时. 后续可以提出到公共的库里
		getxy : function(o){
			//得到dom o在屏幕中的位置
			var o = $(o);
			var x=o.offset().left, y=$(o).offset().top;
			while(true){  
			 o=o.offsetParent; 
			 if(!o || o==$(document) || o==$(document))break; 
			
			 x+=$(o).offset().left;
			 y+=$(o).offset().top; 
			}
			return {x:x, y:y}
		},

		//设置tab下拉菜单的显示和隐藏
		showListArea : function(b){
			var self = this;
			if(typeof b=="undefined")b=true;
			/*显示下拉框*/
			if(b){
				self.$uiTabListArea.removeClass("hidden");
				if(self.dir=="rtl"){
					self.dir = self.$dom.css("direction");
					self.$uiTabListArea.css("right","auto")
									  .css("left",0);
									  
				}
			/*隐藏下拉框*/	
			}else{
				self.$uiTabListArea.addClass("hidden");
			}
		},

		//设置是否显示 tab下拉箭头。通常情况下都是系统自动控制
		showDropBtn : function(b){
			if(b===false||b==0){
				this.$dom.removeClass("showDropBtn");
			} else {
				this.$dom.addClass("showDropBtn");
			}
		},
		//检测tab长度，并使用showDropBtn
		testDrop : function(){
			var self = this;
			var condition= false;
			var w=0;
			if(self.items.length){
				var first=self.items[0];
				var last=self.items[self.items.length-1];
				condition = last.$dom.offset().left+last.$dom.outerWidth()-first.$dom.offset().left>self.$headScrollWrap.outerWidth();
			}
			self.showDropBtn(condition);
		},

		//设置数据
		setData : function(data){
			var self = this;
			/*初始化容器*/
			self.initDom();
			/*数据为空直接返回*/
			if(!data || !$.isArray(self.data.items))return;
			this.data=data;
			/*遍历数据项及创建Tab页*/
			$(self.data.items).each(function(index){
				var option = $.extend({index:index},this);
				/*创建Tab页*/
				self.createTab(this);
			});
			var si=data.selectedIndex?data.selectedIndex:0;;
			self.items[si].show();
		},

		//增加事件监听
		bind : function(name,fn,append){
			if(!this.events){
				this.events = {};
			}
			if(!append||typeof append == "undefined"){
				this.events[name]=fn;
			} else {
				if(!this.events[name]){
					this.events[name] = [];
				}
				if(typeof name == "string" && typeof fn == "function"){
					this.events[name].push(fn);
				}
			}
		},
		unbind:function(name,fn){
			if(!name)return;
			if(!fn){
				this.events[name] = null;
			} else{
				this.events[name] = $.grep(this.events[name],function(n,i){
					return n != fn;
				});
			} 
		},
		//让tab不可用
		setDisabled : function(flag){
			var self = this;
			if(flag){
				self.settings.isDisabled=true;
				self.$head.addClass("isDisabled");
				$(self.items).each(function(){
					this.setDisabled(true);	
				});
			}else{
				self.settings.isDisabled=false;
				this.$head.removeClass("isDisabled")
				$(self.items).each(function(){
					this.setDisabled(false||self.items.settings.isDisabled);//为什么要 ||self.items.settings.isDisabled
				})
			}
		},

		repairIE6 : function(s){
			if($.browser.msie && $.browser.version=="6.0" ) {
				var s = $.extend({
					top     : 'auto', // auto == .currentStyle.borderTopWidth
					left    : 'auto', // auto == .currentStyle.borderLeftWidth
					width   : 'auto', // auto == offsetWidth
					height  : 'auto', // auto == offsetHeight
					opacity : true,
					src     : 'javascript:false;',
					selector: ''
				}, s);
				var html = ['<iframe class="bgiframe" frameborder="0" tabindex="-1" src="'+s.src+'"',				
										'style="display:block;position:absolute;z-index:-1;',
										(s.opacity !== false?'filter:Alpha(Opacity=\'0\');':''),
										'"/>'].join("");

				$(s.selector).each(function() {
					if ($(this).children('iframe.bgiframe').length === 0 ){
						var bt = $(this).css("border-top")||0;
						if(bt){
							bt = Math.parseInt(bt);
						}
						var bl = $(this).css("border-left")||0;
						if(bl){
							bl = Math.parseInt(bl);
						}
						var t = s.top=='auto'?bt-1:s.top;
						var l = s.left=='auto'?bl-1:s.left;
						var w = s.width=='auto'?$(this).width():s.width;
						var h = s.height=='auto'?$(this).height():s.height;
						$(html).width(w).height(h).css({left:l+"px",top:t+"px"}).prependTo($(this));
					}
				});
			}
		},
	    /*初始化右键菜单内容*/
		showContextMenu : function(e,obj){
			var self = this;
			e.preventDefault();
			$(".tabContextMenu").remove();
			var item = obj;
			var timer2 = null;
			// to be continue: several tab in one page
			var menu = $(".tabContextMenu:first");
				menu = $("<div class='tabContextMenu'></div>");
				var table = $("<table cellpadding='0' cellspacing='0'>"
						+ "<tr><td class='tl'><div class='tlObj'></div></td><td class='top'>&nbsp;</td><td class='tr'><div class='trObj'></div></td></tr>"
						+ "<tr><td class='ml'>&nbsp;</td><td class='middle'><ul></ul></td><td class='mr'>&nbsp;</td></tr>"
						+ "<tr><td class='bl'>&nbsp;</td><td class='bottom'></td><td class='br'>&nbsp;</td></tr></table>");
							
				var timer = null;
				menu.hover(
					function(){
						window.clearTimeout(timer);  
						window.clearTimeout(timer2);  
					},
					function(){  
						timer = window.setTimeout(function(){ menu.remove() },2000);
					}
				);
				menu.append( table );
				var itemLeft = $("<div class='itemLeft' style='display:none'></div>");
				var itemRight = $("<div class='itemRight' style='display:none'></div>");
				menu.append(itemLeft)
					.append(itemRight);
				var content = menu.find(".middle ul");
				var evt = function(li,data){
					if(data.click && typeof data.click=="function")
						li.click(function(e){
							data.click(e,$(this),item);
							menu.remove();
						});
				}
				for(var i=0;self.settings.contextMenuData && i<self.settings.contextMenuData.length;i++)
				{
					var data = self.settings.contextMenuData[i];
					var li = $("<li>"+ data.title +"</li>");
					evt(li,self.settings.contextMenuData[i]);
					content.append(li);
					
				}
				content.find("li").hover(
					function(){
						var top = $(this).position().top;
						itemLeft.css("left",content.position().left - itemLeft.outerWidth())
							.css("top",top)
							.height($(this).outerHeight())
							.show();
							
						itemRight.css("left",content.position().left + content.outerWidth()-2)
							.css("top",top)
							.height($(this).outerHeight())
							.show();
						$(this).addClass("over");
					},
					function(){  
						itemLeft.hide();
						itemRight.hide();
						$(this).removeClass("over");
					}
				);
				menu.appendTo(document.body);
				
			self.repairIE6({ selector: menu.get(0) });	// to be test
			menu.css("left",e.clientX)
				.css("top",item.offset().top + item.outerHeight()-2)
				.show();
			$(document.body).click(function(){
				menu.remove();	
			});
			timer2 = window.setTimeout(function(){ menu.remove(); },3000);
			return false;
		},
	    /*增加一tab页*/
		addTab : function(options){
			return this.createTab(options).show(false);
		},

	     /*打开对应的tab页*/
		switchTab : function(index){
			this.getTab(index).show();
		},
	    /*获取tab的标题*/
		getTitle : function(index){
			return this.getTab(index).getTitle();
		},
		closeTab : function(index){
			this.getTab(index).remove();
		},
		getOpenner : function(index){
			var item = this.getTab(index);
			var openner = item.attr("openner");
			return openner;
		},
		
		//下面的接口不建议公开
		validateParamType:function(obj){
			if(!obj) return;
			if (typeof(object) == 'object'){
				return obj;
			} else if(typeof obj=="string"&&obj.indexOf("#")==-1&&obj.indexOf(".")==-1&&obj.indexOf(":")==-1&&$(obj).length == 0){
				obj = $("#"+obj);
			} else {
				obj = $(obj);
			}
			return obj;
		}, 
		//事件绑定  add by zhanglizhao
		on: function(type, listener){
			if (typeof this.events[type] == "undefined"){
				this.events[type] = [];
			}

			this.events[type].push(listener);
		},
		//事件触发 add by zhanglizhao
		trigger:function(event){
			if (typeof event == "string"){
				event = { type: event };
			}
			if (!event.target){
				event.target = this;
			}

			if (!event.type){  //falsy
				throw new Error("Event object missing 'type' property.");
			}

			if (this.events[event.type] instanceof Array){
				var listeners =this.events[event.type];
				var result = null;
				for (var i=0, len=listeners.length; i < len; i++){
					result = listeners[i].apply(this, [].slice.call(arguments, 1));
				}
				return result;
			}
		}
	};
	/*Tab页Tab项*/
	function TabItem(obj,options,businessOptions){
		var params = $.extend({
			title : "",//标签页的标题
			isReAddable : false,  //是否创建并打开相同tab项
			url : "", //tabbody 加载哪个路径下的文件
			dom : "",  //tab body用哪个dom节点作为内容
			html : "",  //tab body使用html字符串作为内容
			isDisabled : false,  //是否可用：false 可用 true不可用
			closeable : true,//是否关闭
			width:null,//Tab页标签头宽度
			openner : "",
			index:""
		},obj.settings, options || {});
		if (options.closeEnable === false || options.closeEnable === 0){
			params.closeable = false;
		}
		this.businessOptions = businessOptions;
		this.content = params.url || params.dom || params.html || "";
		/*是否创建重复项*/
		if(!params.isReAddable){
			/*var items = obj.$headOutWrap.find(":contains('"+ params.title +"')", "[initPage='"+ this.content +"']" );
			if( items.length!=0){
				return;
			}*/
			/*var $items = obj.$headOutWrap.find('.titleText');
			$items.each(function(){
				if($(this).html() == params.title){
					return;
				}
			})*/
		}
		
		var o = this.tabObj = obj;
		//if(o.settings.maxNum && o.items.length>=o.settings.maxNum)return null;
		this.lasttime = o.tabtime++;//Date.parse(new Date());
		this.data = params;
		/*是否加载*/
		this.hasLoaded=false;
		this.settings={
			closeable:params.closeable,
			isDisabled:o.settings.isDisabled || params.isDisabled,
			headWidth:params.width || o.settings.headWidth || "auto"
		};
		this.events={};
		/*this.events={
			headHoverEvent:null,//function
			tabitemHeadOutEvent:null,
			tabitemClick :params.tabitemClick || null
		};*/
		
		//动作
		this.initDom();
		this.setTab(params);
		o.items.push(this);
		o.testDrop();
		return this;
	}

	TabItem.prototype = {
	  /**
			* 初始化dom
			* @param {Object} item.hdom
			*/
		initDom:function(){
			var self = this;
			var o = this.tabObj;
			this.$head = $("<li class="+o.settings.titleClass+" initPage="+this.content+" openner="+this.data.openner+"></li>").width(self.settings.headWidth).appendTo(o.$head);
			this.$dom=this.$head;
			//if(this.id)this.$head.id=this.id;//id用于tab页的焦点显示
			this.$wrap = $("<div class='uiTabItemWrap'></div>").appendTo(this.$head);
			this.$innerWrap=$("<div class='uiTabItemInnerWrap' />").appendTo(this.$wrap);
			this.$label=$("<span class='titleText'></span>").appendTo(this.$innerWrap);
			var redirectTabStartPosition = function(e) {
				//关闭页签后使隐藏的页签长度缩短相应宽度
				var tabItemWidth=$(e.currentTarget).closest('.uiTabItemHead').outerWidth();	
				var uiTabHeadML=parseInt(self.tabObj.$head.css("marginLeft"));
				if(uiTabHeadML < 0){
					if((uiTabHeadML+tabItemWidth) < 0){						
						self.tabObj.$head.css("marginRight",(uiTabHeadML + tabItemWidth) + "px");
					}else{
						self.tabObj.$head.css("marginLeft",0);
					}
				}
			}
			/*如果Tab标签标题栏支持关闭，创建关闭元素*/
			if(this.settings.closeable){
				this.$head.addClass("closeable");	
				// this.$cbtn=$("<a class='uiTabClose'></a>").appendTo(this.$wrap);
				// 根据最新的项目设计规范修订
				this.$cbtn=$("<i class='iconfont icon-guanbi ml-20 uiTabClose'></i>").appendTo(this.$innerWrap);
				/*当前元素触发单击事件后，移除当前Tab标签页*/
				this.$cbtn.click(function(e){
					if(self.settings.isDisabled)return;
					self.trigger("tabClose",self.data.businessOptions);
					redirectTabStartPosition(e);
					setTimeout(function(){
						self.keepTabCount(o);
					},50);
					e.stopPropagation();
				});
			}
			this.$pointer=$("<li />").appendTo(o.$listUL);
	        /*Tab页标签标题双击事件后执行回调函数及关闭当前Tab标签页*/
			this.$head.dblclick(function(e){
				/*Tab页标签标题双击事件后执行回调函数*/
				if(o.events.itemdblclick.length>0){
					var es=o.events.itemdblclick;
					$(es).each(function(){
						this.apply(self);	
					})
				}
				/*双击Tab页标题关闭当前tab页*/
				if(o.settings.isdblClickClose && self.settings.closeable && !self.settings.isDisabled){
					self.trigger("tabClose",self.data.businessOptions);
					redirectTabStartPosition(e);
					setTimeout(function(){
						self.keepTabCount(o);
					},50);
					
				}
			});

			/*创建Tab页内容体*/
			this.$body=$("<div class='uiTabItemBody'></div>").appendTo(o.$body);
	         /*Tab页标签标题栏单击事件后执行回调函数*/
			this.$head.click(function(e){
				if(self.settings.isDisabled) return;
				var ce=o.events.tabitemClick;
	            /*当前Tab页标题栏单击后执行回调函数*/
				if(typeof ce == "function" && !ce.call(this,self)){
					return;
				}
				/*触发activity 事件*/
				self.trigger("tabActive",e);
				self.show();
			});
			 /*Tab页标签标题鼠标移入增加移入样式及执行事件回调函数*/
			this.$head.mouseover(function(e){
				if(self.settings.isDisabled)return;
				$(this).addClass(o.settings.titleOverClass)
				if(typeof o.events.tabitemHeadHoverEvent == "function"){
					o.events.tabitemHeadHoverEvent.call(self);
				}
			});
			/*Tab页标签标题鼠标移出册除移入样式及执行事件回调函数*/
			this.$head.mouseout(function(e){
				if(self.settings.isDisabled) return;
				$(this).removeClass(o.settings.titleOverClass);
				if(typeof o.events.tabitemHeadOutEvent == "function"){
					o.events.tabitemHeadOutEvent.call(self);
				}
			});
			/*启动右键菜单*/
			if(o.settings.isContextMenu){
				if(o.settings.contextMenuData && o.settings.contextMenuData.length>0){
					$(this.$head).bind("contextmenu",function(e){
						var obj = $(this);
						o.showContextMenu(e,obj);
					});
				}
			}
	        /*标签页下拉框的单击事件*/
			this.$pointer.click(function(e){
				if(self.settings.isDisabled)return;
				var ce=o.events.tabitemClick;
				/*如果外部有传入回调函数，则调用*/
				if(typeof ce == "function" && !ce.call(self.$head.get(0),self)){
					return;
				}
				/*显示Tab页*/
				self.show();
			});
			 /*标签页下拉框的双击事件*/
			this.$pointer.dblclick(function(e){
				if(self.settings.isDisabled || !self.settings.closeable)return;
				self.remove();
				return false;
			});
			/*设置标签页不可用（除当前标签页）*/
			if(this.settings.isDisabled){
				this.setDisabled(this.settings.isDisabled);
			}
	         /*设置下拉框列的宽度*/
			this.$pointer.show().width(parseInt(o.settings.colWidth,10)-parseInt(this.$pointer.css("padding-left")||0,10)-parseInt(this.$pointer.css("padding-right")||0,10)-parseInt(this.$pointer.css("margin-left")||0,10)-parseInt(this.$pointer.css("margin-right")||0,10)-parseInt(this.$pointer.css("border-right")||0,10)-parseInt(this.$pointer.css("border-left")||0,10));
			var col = Math.floor(o.items.length/o.settings.colNum);
			 /*设置下拉框的列数*/
			if(o.items.length%o.settings.colNum!=0){
				col += 1;
			}
			/*设置下拉框宽度*/
			o.$uiTabListArea.width(col*o.settings.colWidth);
		},
		/*Tab至少保留个数*/
		keepTabCount:function(o){
			var self = this;
			/*传入参数为数字*/
			if(typeof o.settings.minTabCount == "number")
			{
				/*1.将传入的数取整。2.如果传入的数字小于或等于零，则设置为1*/
				var count = Math.floor(o.settings.minTabCount)<=0?1:Math.floor(o.settings.minTabCount);
				/*如果所剩的Tab页小于或等于count，直接返回*/
				if(o.$headScrollWrap.find("li").length<=count)
				{
					return;
				}else 
				{
					self.remove();
				}
			}	
		},	
		/**设置标题 （Tab页及下拉框标题）**/
		setTitle:function(title){
			this.$label.html(title);
			this.$pointer.html(title).attr("title",title);
		},

		/**获取标题**/
		getTitle:function(){
			return this.$label.html();
		},

		//让标签页不可用
		setDisabled:function(b){
			if(b){
				this.settings.isDisabled=true;
				this.$head.addClass("disabled");
				this.$pointer.addClass("disabled");
			}else{
				this.settings.isDisabled=false;
				this.$head.removeClass("disabled");
				this.$pointer.removeClass("disabled");
			}
		},
			 
		/**
		 * 选中该tab。     force：是否强行加载，就是说即使加载过了，这里还是要加载的。
		 */
		show:function(force){
			var o = this.tabObj;
			if(!o) {
				return;
			}
			var self = this;
			if(o.curItem && o.curItem!=this){
				o.curItem.hide();
			}
			this.adjustPosition(function(){    //用回调防止效率问题
			   /*加选中样式*/
				self.$head.addClass(o.settings.titleCurrentClass);
				self.$body.addClass(o.settings.titleCurrentClass);
				self.$pointer.addClass(o.settings.titleCurrentClass);
				o.curItem=self;
				if(self.data && self.data.url && (force || !self.hasLoaded)){
					/*加载内容*/
					self.load();
				}
			});
			this.lasttime=o.tabtime++; //Date.parse(new Date());
		},
		/** 获取tab相对于 headScrollWrap的offset。因为ie7下，ul宽度为5000，item li的offsetParent就会变成ul。
			* 注意：headScrollWrap与li之间不能有relative/absolute定位的元素，否则_offset会计算成li相对于这个有relative/absolute定位的元素的offset。
			*	headScrollWrap需要时relative
			*/
		_offset:function(){
			var x=0,y=0;			
			var d=this.$dom;	
			x = d.position().left;
			y = d.position().top;	
			return {x:x,y:y};
		},
			
		/**
			* 通过调整tab头的移位，调整tab的位置，以便可以现在在屏幕上：藏在左侧的在第一个tab处显示，右侧隐藏的在最后一个位置显示
			*/
		adjustPosition:function(callback){
			var o = this.tabObj;
			var self = this;
			var modelFlag=2;
		/*	if(modelFlag==1){
				window.location="#"+this.id;
			}else */if(modelFlag==2){
				var ih=this.$head;  
				var oh=o.$head;
				// debugger;
				//判断是否被遮挡
				var flag=0; //防止死循环
				var endflag=10;
				var step=0;

				function isBeCovered(){
					// o.$headScrollWrap.outerWidth() ul外层总宽度
					//ih.outerWidth()  li的宽度
					var offset=self._offset();//li距离ul的距离
					var x=offset.x;
					if(x<0 && x+ih.outerWidth()>o.$headScrollWrap.outerWidth()){ 
						return 0;	//tab的两端均被遮盖，无需调整
					} else if(x<0){//该tab被隐藏在左边 ??
						step=0-x;
						return 1;
					}else if(x+ih.outerWidth()>o.$headScrollWrap.outerWidth()){
						step=o.$headScrollWrap.outerWidth() - (x+ih.outerWidth());
						// step = 0 -x + ih.outerWidth();
						// oh.css("marginLeft",(parseInt(oh.css("marginLeft"))||0)-ih.outerWidth());
						// oh.css("marginRight",(parseInt(oh.css("marginRight"))||0)-ih.outerWidth());
						return -1;	//该tab被隐藏在右边
					} else return 0  //未被遮挡
				}
				if(isBeCovered()){
					oh.css("marginLeft",(parseInt(oh.css("marginLeft"))||0)+step);
					oh.css("marginRight",(parseInt(oh.css("marginRight"))||0)-step);
				}
			}
			if(typeof callback == "function")callback.call(this);
		},
			
		hide:function(){
			var o = this.tabObj;
			this.$head.removeClass(o.settings.titleCurrentClass);
			this.$body.removeClass(o.settings.titleCurrentClass);
			this.$pointer.removeClass(o.settings.titleCurrentClass);
			
			if(o.curItem==this){
				o.curItem=null;
			}
		}, 
			
		/**
		 * 销毁(直接)
		 *不建议外部调用
		 */
		remove:function(duar){
			var o = this.tabObj;
			var self = this;
			//设置下一个显示项.为后面的tab页，如果后面没有tab，则显示前面的。
			function afterRemove(){
				var closeTabIndex;
				o.items = $.grep(o.items,function(n,i){
					var f = (n==self) ;
					if(f){
						closeTabIndex = i;
					}
					return f;
				},true);
				var nextItems = $.grep(o.items,function(n,i){
					var f = (n==self) || (n.data.hideTab == true);
					if(f){
						closeTabIndex = i;
					}
					return f;
				},true);
		
				//设置下一个显示项.为后面的tab页，如果后面没有tab，则显示前面的。
				if(self==o.curItem){ //如果关闭的tab是激活的tab，则根据策略激活新tab
					var willShow=null;
					switch(o.settings.tabActiveMode){
						case "next":willShow=(nextItems[closeTabIndex])?nextItems[closeTabIndex]:nextItems[closeTabIndex-1];break;
						//case "pre":willShow=(o.items[closeTabIndex])?o.items[closeTabIndex]:o.items[closeTabIndex+1];break;
						case "last":;
						default:
							willShow=nextItems[0];
							$.each(nextItems,function(){
								//找出lasttime最新的tab
								if(this.lasttime>willShow.lasttime){willShow=this;}
							});
					}
					if(willShow)willShow.show();
				}
				o.testDrop();
			}
			
			if (self.iframe && self.iframe.length) {
				(function(frame) {
					function requestCollectGarbage(n, interval, gc) {
					    gc();
					    var timer = setInterval(function() {
					        if (n--) {
					            clearInterval(timer);
					        } else {
					            gc();
					        }
					    }, interval);
					}
					function removeIFrame(frame) {
					    if (frame) {
					        try {
					            // 跳转入gc.html，执行N次GC垃圾回收
					            frame.src = "/ngcs/gc.html";
					            setTimeout(function() {
					                frame.removeNode(true);
					                delete frame;
					                frame = null;
					                requestCollectGarbage(5, 500, function() {
					                    window.CollectGarbage && window.CollectGarbage();
					                });
					            }, 800);
					        } catch (e) {
					           // fixme: handle error message
					        }
					    }
					}
					removeIFrame(frame);
				})(self.iframe[0]);
			}
			
			/*启用动画效果*/
			if(o.settings.removeActionDuartion && o.settings.removeActionDuartion !== "null") {
				/*取得动画效果耗时*/
				duar = o.settings.removeActionDuartion || duar;
				/*头部淡出效果*/
				function headAni(d){
					return self.$head.fadeOut(d);
				}
				/*body淡出效果*/
				function bodyAni(d){
					return self.$body.fadeOut(d);
				}
				/*下拉框淡出效果*/
				function pointerAni(d){
					return self.$pointer.fadeOut(d);
				}
				/*执行多个对象的回调函数，延迟对象附加的其他方法*/			
				$.when(headAni(duar),bodyAni(duar),pointerAni(duar)).then(function($head,$body,$pointer){
					$head.remove();
					$body.remove();
					$pointer.remove();
					//设置下一个显示项.为后面的tab页，如果后面没有tab，则显示前面的。
					afterRemove();
				});

			}else {
				//删除前，移动tabs的margin-left,判断margin-left的绝对值大于self宽度则挪动self宽度，小于则置为零
				var marginLeft = parseInt(self.tabObj.$head.css("margin-left"));
				var selfWidth = self.$dom.width();
				if(marginLeft < 0 && Math.abs(marginLeft) > selfWidth ){
					self.tabObj.$head.css("margin-left",marginLeft + selfWidth)
				}else if(marginLeft < 0 && Math.abs(marginLeft) < selfWidth ){
					self.tabObj.$head.css("margin-left",0)
				};
				
				setTimeout(function(){
					$(self.$head).remove();
					$(self.$body).remove();
					$(self.$pointer).remove();
				},100)
				//设置下一个显示项.为后面的tab页，如果后面没有tab，则显示前面的。
				afterRemove();
			}
			if (navigator.userAgent.indexOf("MSIE")>0) {
				if ($('input[name="keyMenu"]')) {
	        		$('input[name="keyMenu"]').focus();
				}
    		}
		},

		/***
		 * 加载，支持ajax和iframe两种模式
		 */
		load:function(url){
			var o = this.tabObj;
			var _url=url||this.data.url;
			if(!_url)return;//这种情况往往是item加载一个dom而已
			//加载. iframe模式
			if(this.data.isFrame){
				this.$body.empty();
				/*启用iframe模式*/
				this.iframe=$("<iframe class='uiTabIframe' frameBorder=0></iframe>").appendTo(this.$body);
				try{
					this.iframe.attr("src",_url);
				} catch(e){}
				var timer=null;   //iframe自适应高度的timer
				function timerFn(){
					var i=$(item.iframe);
					if(i){
						try{
							var params=i.contents();
							if(params){
								var h1=params.height();
								var h2=params.find("body").height();
								i.height(h1>h2?h1:h2)
							}
						}catch(e){}
					}else{
						window.clearInterval(timer);
					}
				}
				if(o.settings.isAdjustHeightByContent){
					timer=window.setInterval(timerFn,500);
				}
			// requirejs模式
			}else{
				// this.$body.load(_url);
				var self = this.$body;
				//弹出tab页时，数据没有加载完成时先弹出loading加载标志
				// self.html(load);
				self.html('<div class="page_loading"><img src="src/assets/css/styles/imgs/cmcc_loading_lg.gif" alt=""><span>加载中...</span></div>')
				var tab = require.context('../../js/tab/',true);
				require(['../../js/tab/' + _url], $.proxy(function(objClass){
					//这段逻辑支撑了所返回的各种模块定义
					if (typeof(objClass) === 'function'){
						var result = new objClass(this.data && this.data._index || {}, this.businessOptions,this);
						if (typeof(result) === 'object'){
							if (result.hasOwnProperty('content')){
    						    $('input,textarea',result.content).placeholder();
								self.empty().append(result.content);
							}else{
								self.empty().append(result);
							}
						}else{
							self.html(result);
						}
					}else{
						result&&self.html(result.content);
					}
					
				}, this));
			}
			
			//已加载标志
			this.hasLoaded=true;
		},
		
		/**
		 * 设置数据
		 */
		setTab:function(options){
			if(!options)return;
			var o = this.tabObj;
			this.data=options;
			/*如果有传入图片，则在Tab页前加图片*/
			if(options.icon){
				this.img=$("<img class='uiTabItemHeadImg' alt=''/>").insertBefore(this.$label,this.$innerWrap);
			
				this.img.attr("src",options.icon);
			}
			if (options.hasOwnProperty('hideTab')) {
				if(options.hideTab){
					this.$head.hide();
					this.$body.addClass('hide');
					this.$pointer.hide();
				}else{
					this.$head.show();
					this.$pointer.show();
					this.$body.removeClass('hide');
				}
			}
			/*设置Tab页标题及下拉框列标题*/
			this.setTitle(this.data.title);
			//开始加载数据。支持三种：url ， dom ，html 。只能使用其中一个，优先级url最高，html最低
			if(this.data.url){
				
				//设置的数据并不一定立即加载，当 当前tab选中时，或不是isLazy模式时，才立即加载
				if(!o.settings.isLazy || o.curItem==this){
					this.load(url);
				}
			} else if(this.data.dom){
				var t=this.data.dom;
				/*格式化对象*/
				t= o.validateParamType(t);
				if(t.get(0)){
					this.$body.append(t);
				}
			}else if(this.data.html || this.data.html==""){
				this.$body.html(this.data.html)
			}
		},
		bind:function(name,fn){
			this.events[name]=fn;
		},
		
		//事件绑定  add by zhanglizhao
		on: function(type, listener){
			if (typeof this.events[type] == "undefined"){
				this.events[type] = [];
			}

			this.events[type].push(listener);
		},
		//事件触发 add by zhanglizhao
		trigger:function(event){
			if (typeof event == "string"){
				event = { type: event };
			}
			if (!event.target){
				event.target = this;
			}

			if (!event.type){  //falsy
				throw new Error("Event object missing 'type' property.");
			}

			if (this.events[event.type] instanceof Array){
				var listeners =this.events[event.type];
				var result = null;
				for (var i=0, len=listeners.length; i < len; i++){
					result = listeners[i].apply(this, [].slice.call(arguments, 1));
				}
				return result;
			}
		}
	};

	return Tab;
});
