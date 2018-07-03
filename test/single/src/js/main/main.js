/*
功能：
    创建一个选项卡组 面板集合 对象，该对象由张志勇把phoneNum改为contactId为key
参数：
    el 要绑定到页面上的dom节点选择器
事件：

方法：
    createChartWrap 创建一个面板（选项卡组）
    showChartWrap 显示已经存在的面板
        参数 contactId客户手机号码
    createTab 在当前选项卡组中，新建一个选项卡
        参数 title选项卡标题；url选项卡加载的模块
    hasPanel 是否有该面版
        参数 contactId客户电话号码
属性：

*/
define(['Util'], function(Util){
    var defaultTabs = {};
    var _index;
    var isRing;//
    var objClass = function(options){
        Util.eventTarget.call(this);
        _index=options._index;
        //根据数据库配置来加载各业务系统首页，add by zhangyihan
        defaultTabs = { items:[
            {"title":"交谈区","dom":"indSpace","isFrame":false,"closeable":false,"url":""}
        ]};

        this.options = options;
        $.extend(this.options._index, {
            main:this
        });
        this.$el = $(this.options.el);
        this.clientPanels = {};
        this.clientInPanels = {};
        this.createChartWrap({ChartWrapIndex:'1'});
    };

    $.extend(objClass.prototype, Util.eventTarget.prototype, {

        hasPanel:function(contactId){
            return this.clientPanels[contactId];
        },
        createTab:function(title, url, businessOptions){
            var options = null;
            var tab = null;
            if (typeof(title) == 'object'){
                options = title;
            }else{
                options = { title:title, url:url || '', businessOptions:businessOptions }
            }
            var item = _.find(this.currentPanel.glbTab.items, function(item){
                return item.data.title == options.title;
            });
            if (!item||(item&&window.confirm("您已经打开了“"+options.title+"”菜单，选择确定会关闭已打开同名菜单！"))){
                if (options && options.title && options.url){
                    // var options = { title:title, url:url || '' };
                    if( new RegExp("^(http(s|)://)").test(options.url)){
                        options.isFrame = true;
                    }
                    // 销毁同名菜单
                    if(item){
                        item.remove();
                    }
                    var clientPanel = this.currentPanel;
                    tab = clientPanel.glbTab.createTab(options, options.businessOptions);
                    tab.show();
                }else{
                }
            }else{
                item.show();
            }
            return tab;
        },
        destroyTab:function(title){
            var clientGlbTab = this.currentPanel.glbTab,
                items=clientGlbTab.items;
            title=(title?title:clientGlbTab.curItem.data.title);
            $.each(items,function(key,val){
                if(val.data.title==title){
                    clientGlbTab.closeTab(key)
                }
            });
        },
        getCurrentTab:function(){
            var curItem =this.currentPanel.glbTab.curItem;
            return {
                iframe:!!curItem.iframe,
                url:curItem.content,
                businessOptions:curItem.businessOptions,
                title:curItem.data.title
            }
        },
        //获取当前打开的iframe
        getCurrentIframe:function(){
            var curItem =this.currentPanel.glbTab.curItem;
            if(!curItem.iframe){
                var $frames=curItem.$body.find("iframe");
                if($frames.length){
                    for(var i=0;i<$frames.length;i++){
                        var $iframe = $frames.eq(i);
                        if ($iframe.parent().css('display') == 'block'){
                            return {
                                el:$iframe,
                                url:$iframe.attr("src"),
                                businessOptions:curItem.businessOptions,
                                title:$iframe.attr("title")?$iframe.attr("title"):curItem.data.title
                            }
                        }
                    }
                    return {}
                }
            } else{
                return {
                    el:curItem.iframe,
                    url:curItem.content,
                    businessOptions:curItem.businessOptions,
                    title:curItem.data.title
                }
            }
        },
        //根据title  获取当前打开的iframe对象  add by zhanglizhao 2016-05-09
        getIframe:function(title){
            var item={};
            $.each(this.currentPanel.glbTab.items,function(key,val){
                if(val.data.title==title){
                    item={
                        el:val.iframe,
                        url:val.content,
                        businessOptions:val.businessOptions,
                        title:val.data.title
                    }
                }
            });
            return item
        },
        //根据url  获取当前打开的iframe对象
        getIframeByUrl:function(url){
            var item={};
            $.each(this.clientPanels,function(i,data){
            	$.each(data.glbTab.items,function(key,val){
                    if(val.content==url){
                        item={
                            el:val.iframe,
                            url:val.content,
                            businessOptions:val.businessOptions,
                            title:val.data.title
                        }
                    }
                });
            })
            return item
        },
        getActiveTab:function(){
            return this.currentPanel.glbTab.curItem;
        },
        hideAllChartWrap:function(){
            $.each(this.clientPanels,function(i, panel){
                if (panel.$chatWarp){
                    panel.$chatWarp.removeClass('show');
                }
            });
        },
        showChartWrap:function(ChartWrapIndex){
            this.hideAllChartWrap();
            var clientPanel = this.clientPanels[ChartWrapIndex];
            if (clientPanel){
                clientPanel.$chatWarp.addClass("show");
                this.currentPanel = clientPanel;
            }
        },
        createChartWrap:function(data){
            var $chatWarp = null;
            var html = '<div class="chatWarp show">';
                html+='<div class="tabsCont"><div class="tabs"></div></div><ul class="tab"><li class="trigger"></li></div>';
            $chatWarp = $(html);
            $chatWarp.appendTo(this.$el);
            var tab = new Util.tabs({
                container:$chatWarp.find('.tabs'),
                data:defaultTabs,
                _index:this.options._index
            });

            // this.updateMenu();
            this.currentPanel = this.clientPanels[data.ChartWrapIndex] = {
                $chatWarp:$chatWarp,
                glbTab:tab
            }
            tab.on('tabActive', $.proxy(function(data){
                this.trigger('tabActive', data)
            }, this));

        },
        //添加销毁静态页面的方法
        distoryChatWrap:function(contactId){
            var id='chartWarp_'+contactId;
            this.$el.find("#"+id).remove();
        },
        // 获取坐席签入CTI后收到消息时是否有铃 by itemId by zwx285446
		// 2016.6.24 start
        // move by zhangyingsheng 2017.2.7
		queryIsRing:function() {
			var itemId = {
				"itemId":"102001002"
			};
			// itemId在表里写死,返回结果:1:有铃,0:无铃
			// Util.ajax.postJsonAsync(
			// 异步ajax请求
			Util.ajax.postJson("front/sh/common!execute?uid=s007",itemId,$.proxy(function(json, status) {
				if (status) {
					var ringVar = json.bean.value;
					if (ringVar == "1") {//有铃
						isRing=true;
					} else if(ringVar==undefined||ringVar==null||ringVar==''){
						isRing=null;
					}else if (ringVar == "0") {//无铃
						isRing=false;
					} else {
						isRing=null;
					}
				} else {
					isRing=null;
				}
			},this));
			return isRing;
		},
		getIsRing:function(){
			return isRing;
		},
		setYRing:function(){//设置有铃
			isRing=true;
			return isRing;
		},
		setNRing:function(){//设置无铃
			isRing=false;
			return isRing;
		}
    });
    return objClass;
});
