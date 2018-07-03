define([ 'Util', 'Compts',
         '../../tpl/clientInfo/chanleInfo.tpl',
         '../../assets/css/clinetInfo/chanleInfo.css' ],
function(Util, Compts, tpl) {
	var $el = $(tpl);
	var _opt;
	var list;
	var contactId;
	var arrayList = [];
	var index;
	//备份multiAccountList信息
	var backMulti = [];
	var addMultil =[];
	var initialize = function(indexModule,opt) {
		index = indexModule;
		_opt=opt;
		contactId = _opt.contactId;
		//清除页面缓存的数据
		clearAll();
		//初始化收集信息
		initMediaTypeName(_opt);
		listInit(_opt);
		initEvent();
		this.content = $el;
	}
	var clearAll = function(){
		$el.find("#phoneNum").val("");
		$el.find("#mediaTypeName").val("");
		$el.find("#accountId").val("");

	}
	var initEvent = function() {
		$el.on("click", "#saveChanel", $.proxy(chanelSave, this));
	}
	var chanelSave = function(){
		var reg = "^0?(13|15|17|18|14)[0-9]{9}$";
		var phoneNum = $el.find("#phoneNum").val();
		var currMediaTypeName = $el.find("#mediaTypeName").val();
		var phnResult = $.trim(phoneNum);
		if(!phnResult.match(reg)){
			index.popAlert("请输入符合规范的手机号码!");
			return;
		}
		var channelId = _opt.channelId;
		var accountId = _opt.accountId;
		if(accountId.match(reg)){
			index.popAlert("当前接入方式为手机号,不应进行收集");
			return;
		}
		var mediaTypeId = _opt.mediaTypeId;
		var staffId = _opt.staffId;
		var bindType = _opt.bindType;
		//移动手机号校验dd^0?(13|15|17|18|14)[0-9]{9}$
		var isMoibel = RegExp("^1(34[0-8]|(3[5-9]|5[017-9]|8[278])\\d)\\d{7}$").test(phnResult);
		if(!isMoibel){
			index.popAlert("输入手机号不是移动手机号！");
			return;
		}
		var result={
				"phoneNum":phoneNum,"channelId":channelId, "accountId":accountId,
				"bindType":bindType,"staffId":staffId,"mediaTypeId":mediaTypeId
		};
		//front/sh/media!execute?uid=addChanel01
		Util.ajax.postJson("front/sh/media!execute?uid=addChanel01", result, function(json, status) {
			if (status) {
				//刷新客户信息栏
		         index.clientInfo.initCustInfo(_opt.subsNumber);
				 index.popAlert("收集客户信息成功");
				 listInit(_opt);
				 //更新渠道下拉图标信息数据
				 index.chatTools.initData();
			}else{
				index.popAlert("收集客户信息失败");
			}
		});
	}

	//初始化list
	var listInit = function(main){
		var mediaTypeId = main.mediaTypeId;
		var channelId = main.channelId;
		var callerNo = main.accountId;
		var config = {
				el:$('#chanelList',$el)[0],
				field:{
					items:[
					       { text:'手机号码',name:'phoneNumber',className:'w90' },
					       { text:'媒体编号',name:'mediaTypeId',className:'hide' },
					       { text:'媒体类型',name:'mediaTypeName',className:'w90',

					       	render:function(item,val,$src){  //重写列表展示
					       		if(item.mediaTypeId == '09'){
					       			return '微博';
					       		}else if(item.mediaTypeId == '03'){
					       			return '微信';
					       		}else{
					       			return 'webChat';
					       		}

                			}
					   		},
					      /* { text:'媒体类型',name:'mediaTypeName',className:'w90',render:function(item,val){
					    	   var mediaType = item.mediaTypeId;
					    	   var mediaTypeInfo = index.main.getMediaInfo(mediaType);
					    	   return mediaTypeInfo.mediaTypeName;
					       }},*/
					       { text:'渠道账号',name:'channelId',className:'w90' },
					       { text:'账号',name:'accountId',className:'w90' },
					       { text:'昵称',name:'screenName',className:'w90' }
					       ],
					       button:{
					    	   className:'w90',
					    	   items:[
					    	          { text:'<img width="20px",height="10px" src="src/assets/img/clientInfo/delete.png"></img>',name:'viewer',click:function(e,item){
					    	        	  if(confirm("你确定要删除吗？")){
					    	        		  var info = item.data;
					    	        		  var result = {
					    	        				  "mediaTypeId":info.mediaTypeId,
					    	        				  "phoneNum":info.phoneNumber,
					    	        				  "accountId":info.accountId,
					    	        				  "channelId":info.channelId,
					    	        		  };
					    	        		  Util.ajax.postJson("front/sh/media!execute?uid=delCstmr001", result, function(json, status) {
					    	        			  if (status) {
					    	        				  index.popAlert("删除成功 ！");
					    	        				  listInit(_opt);
					    	        			  }else{
					    	        				  index.popAlert("删除失败");
					    	        			  }
					    	        		  });
					    	        	  }

					    	          }},
					    	          ]
					       }
				},
			data:{
				url:'front/sh/media!execute?uid=queryCustInfo01'//front/sh/media!execute?uid=queryCustInfo01
			}
		}

		list = new Compts.List(config);
		var params = {
				"mediaTypeId":mediaTypeId,
				"channelId":channelId,
				"callerNo":callerNo
		};
		list.search(params);
    };
    var initMediaTypeName = function(result){
    	$el.find("#mediaTypeName").val(result.mediaTypeName);
    	$el.find("#accountId").val(result.accountId);

    }
	return initialize;
});
