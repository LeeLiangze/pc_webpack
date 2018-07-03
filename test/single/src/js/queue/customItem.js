/**
 *created by lishouming 2016/12/23 
 */
define(['Util',
"../index/constants/mediaConstants",
        '../../assets/css/queue/customList.css'
        ],function(Util,MediaConstants){
       // 存储当前代码拼接
        var itemStr = [];
        //对应的客户信息
        var customerInfo = null;
        //设置互联网身份
        var internetStyle = null;
        //设置存储当前接触的Logo和昵称
        var datas = {};
        //使用变量存储数据
        var data, _index;
        //查询明细
        var _pageNumber;//页码数
        var _pageSize;//页内存储消息条数
        var _contanctStartTime = null;//会话开始时间
        var logoUrl = null;
        var $els;
      //确保对应的this不会在$.each内发生改变,self存储对应的this指向
		var self = null;
	    var CustomItem = function(_indexModule){
	    _index = _indexModule;
	    //设置变量存放接触途径Logo
	    this.eventInit(data);
	    }
	    $.extend(CustomItem.prototype,{
	    	//初始化方法
	    	eventInit:function(data){
	    		//改变对应的this指向
	    		self = this;
	    		itemStr = [];
	    	},
	    	//用户历史消息加载的点击事件
	    	itemClick:function(data){
	    		this.getparam(data);
	    	},
	    	//获取系统设置参数
	    	getparam:function(data){
	    			    _pageNumber = MediaConstants.HISTORY_PAGENUM;
	    			    _pageSize = MediaConstants.HISTORY_TPAGESIZE;
	    			    _contanctStartTime = data.contactStartTime;
	    	},
	    	//创建对应的接触列表内用户信息
	    	createCustomer:function(data){
                        self.adjustName(data);
                        logoUrl =_index.contentCommon.getLogoURL(data.channelId,data.mediaId);
                        self.creatList();
			       		var Html = itemStr.join("");
		            	customerInfo = Util.hdb.compile(Html);
		            	$els = customerInfo(data);
		            	$(".queryHistory .queryLeft .customerList").append(customerInfo(data));
		           	 	$(".queryHistory .queryLeft .customerList .customer").eq(0).addClass("clicked");
	    	},
	    	//判断接触ID所在的渠道以及对应的渠道昵称
	    	adjustName:function(value){
	    			//确保对应的this不会在$.each内发生改变,self存储对应的this指向
			    		var self = null;
						self = this;
	    			//当前的ID接触方式是呼出还是呼入
					if(value.callType != "1"){
//					//查询当前的互联网身份(昵称)
//					datas.pick = value.callerNo;
					self.adjustInternet(value.callerNo,value.channelId);
					}else{
							value.callerNo = value.calledNo;
//							datas.pick = value.callerNo;
							self.adjustInternet(value.callerNo,value.channelId);
					}
					if(internetStyle){
						if(value.mediaId ==MediaConstants.MEDIA_ONLINE_SERVICE ){
//							如果没有对应的互联网昵称就用对应的主叫号码
							if(internetStyle.accountId != ""){
								datas.pick = internetStyle.accountId;
							}else{
								datas.pick = value.callerNo;
							}
					}else{
						if(internetStyle.screenName != ""){
							datas.pick = internetStyle.screenName;
						}else{
							datas.pick = value.callerNo;
						}
					}
					}else{
						//当前渠道名称（如果为微博则显示对应的微博发送消息按钮） 
						datas.channel = value.mediaId;
						datas.pick = value.callerNo;
		}
	  },
			//	查询当前的互联网身份信息
	 		adjustInternet:function(callerNo,channelId){
					var data = {
					"accountId":callerNo,
					"channelId":channelId
					};
					internetStyle =null;
//					向后台发起请求 确认对应的互联网Id同步AJAX请求
					Util.ajax.postJson('front/sh/common!execute?uid=touch010',data,function(json,isok){
						if(isok){
							if(json.beans[0]){
								internetStyle = json.beans[0];
						}
					}			
					},true);	
			},
			//	拼接对应的接触对像的样式
			creatList:function(){
				//后期要加上对应的渠道ID作为相应的ID以便判断是否为微博进而控制对应微博发送消息按钮
				itemStr.push('<li class="customer"><img src="'+logoUrl+'"/><span>'+datas.pick+'</span></li>')
			}	
	  	 });	
	        return CustomItem;
})