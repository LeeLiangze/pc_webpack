/**
 * 各省多媒体互转
 */
define(['Util',
        'Compts',
        '../../index/constants/mediaConstants',
        '../../../tpl/comMenu/multiMediaTransfer/multimediaTransfer.tpl',
        '../../../assets/css/comMenu/multiMediaTransfer/multimediaTransfer.css'
        ],
        function(Util,Compts,Constants,tpl){
	        var _leftTree = null;
    		//系统变量-定义该模块的根节点
    		var $el;
    		//系统变量-构造函数
		  	var _index;
		  	var meidaType;
		  	var channelId;//渠道id
		  	var setting;
		  	var initialize = function(index){
		  		//初始化参数
		  		$el = $(tpl);
		  		_index = index;
		  		//业务树初始化
		  		initChannelTree.call(this);
		  		//事件初始化
		  		initEvent.call(this);    
		  		//将根节点赋值给接口
		  		this.content = $el;
		  	};
		  	
		  	//点击树节点时触发的函数
		  	function zTreeOnClick(event, treeId, treeNode) {
		  		//选择叶子结点时，即选择渠道时将结点id和name传入“currentNodeId”和“currentNodeName”中
		  		if(!treeNode.isParent){
			  		$("#currentNodeId",$el).prop('value',treeNode.id);
			  		$("#currentParentId",$el).prop('value',treeNode.getParentNode().id);
		  		}
		  	}
		  	//初始化渠道结构树，从数据库读取渠道信息
		  	var initChannelTree = function() {	
		  		var ctiId=_index.CTIInfo.CTIId;
				Util.ajax.postJson("front/sh/media!execute?uid=channelTree01", {"ctiId":ctiId}, function(json, status) {
					if (status) {
						_leftTree = new Compts.zTree.tierTree($el.find("#multimediaTree"), json.beans,{'onClick':zTreeOnClick});
						//设置选中
						_leftTree.selectNode(_leftTree.getNodeByParam("id", "ROOT",null));
					} else {
						_index.popAlert("查询失败!");
					}
				})
			}
		  	
		    //初始化事件
		  	var initEvent = function() {
//		  		 var activeSerialNo =  _index.CallingInfoMap.getActiveSerialNo();
//				 var callingInfo = _index.CallingInfoMap.get(activeSerialNo);
//		         meidaType = callingInfo.getMediaType();
//		         $("#transfer",$el).removeAttr("disabled");
//		         if(meidaType == "5"){
//		        	 //若当前为通话状态，转移不可用
//		        	 $("#transfer",$el).attr("disabled", true);
//		         }
				 $el.on('click', '#transfer',multiMediaTransfer);
				 $el.on('click','#close',closeWindow);
			}
		  	
		  	//转移到目标省渠道
		  	var multiMediaTransfer = function(){
		  		channelId = $("#currentNodeId",$el).val();//获取渠道id
		  		provinceId=$("#currentParentId",$el).val();
		  		if(channelId == undefined || channelId == ""){
		  			_index.popAlert("请选择转移的渠道！");
					return;
				}
				if(window.confirm("确认要转移吗？")){
					
					//首先释放当前会话
					var activeSerialNo=_index.CallingInfoMap.getActiveSerialNo();
			        var callingInfo = _index.CallingInfoMap.get(activeSerialNo);
			        /*if(contactId == undefined || callingInfo == undefined){*/
					if(callingInfo == undefined){
						_index.popAlert("请选择会话！");
			        	return;
			        }
					if(callingInfo.getSessionStatus() == "04"){
						_index.popAlert("会话已离线，不能互转！");
			        	return;
			        }
			       var caller = callingInfo.getCallerNo();//获取当前会话主叫
			       var fromOrgId = callingInfo.getFromOrgId();
                   var clientId = callingInfo.getClientId();
			        //调用CTI互转接口
                   callingInfo.setReleaseType(Constants.RELEASETYPE_OPERATOR);
				   multiMediaRemote(channelId,provinceId,caller,fromOrgId,clientId);
				}
		  	}
		  	
		  	
		  	//多媒体互转
		  	function multiMediaRemote(channelId,provinceId,caller,fromOrgId,clientId){
		  		var data = {
						 "chnlCode":channelId,
		  		         "provinceId":provinceId
				 }
	        	//根据选择的渠道获取渠道对应的 接入码、CTIID、CCID、CTI媒体类型、媒体类型
	        	Util.ajax.postJson("front/sh/media!execute?uid=multiMediaTransferData",data, function(json, status) {
	        		if(status){
	        			var fst_char_attr_val = json.bean.fst_char_attr_val; //接入码
	        			var ctiID = json.bean.ctiId; //CTIID
	        			/*var ctiID=_index.CTIInfo.CTIId;
	        			if(ctiId == ctiID){
	        				window.confirm("不能在同一个CTI内互转！");
				        	return;
	        			}*/
	        			var cti_type_cd = json.bean.cti_type_cd; //CTI媒体类型
	        			var meda_type_cd = json.bean.meda_type_cd; //媒体类型
	        			var ccId = json.bean.ccId; //CCID
  	        			var url_transfer = "front/sh/media!execute?uid=mediaTransfer001";
	        			var data_transfer = {
           					"channelId":channelId,
           					"caller":caller,
           					"ctiId":ctiID,
           					"ccId":ccId,
           					"called":fst_char_attr_val,
           					"eserviceType":cti_type_cd,
           					"mediaId":meda_type_cd,
           					"fromOrgId":fromOrgId,
           					"clientId":clientId
	        			}
	        			
	        			//多媒体互转
	        			Util.ajax.postJson(url_transfer,data_transfer, function(json, status) {
	        				var returnCode = json.returnCode;
	        				if(status){
	  	        				if(json.returnMessage != null && json.returnMessage != ""){
	        						_index.popAlert(json.returnMessage);
	        					}else{
	        						_index.popAlert("多媒体互转成功！");
	        					}
	        					closeWindow();//关闭窗口
	        				}else{
	        					if(json.returnMessage != null && json.returnMessage != ""){
	        						_index.popAlert(json.returnMessage);
	        					}else{
	        						_index.popAlert("多媒体互转失败！");
	        					}
	        				}
	        			});
	        		
	        		}else{
	        			_index.popAlert("互转接口参数获取失败");
	        		}
	        	});
		  	}
		  	
		  	//关闭多媒体互转窗口
			var closeWindow = function(){
				_index.destroyDialog();
			}

			return initialize;
});