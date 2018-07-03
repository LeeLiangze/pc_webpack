define(['Util','Compts',
        '../../index/constants/mediaConstants',
        '../../../tpl/communication/channelConfig/addChann.tpl',
        '../../../assets/css/communication/channelConfig/addChann.css'
        ],
        function(Util,Compts,MediaConstants,tpl){
		var $el;
		var _index;
		var channListInit;
		var initialize=function (index,option){
			$el=$(tpl);
			_index=index ;
			eventInit();
			channListInit = option.channListInit;
			this.content = $el;
		};
		//初始化事件
		var eventInit=function(){
			$el.on('click','.chann_reset', $.proxy(reset,this));
			$el.on('click','.chann_submit', $.proxy(submit,this));
		};
		
		//提交数据
		var submit = function(){
			var channelId = $.trim($el.find(".add_channelId").val());
			var mediaTypeid = $el.find(".add_mediaTypeid").val();
			var channelName = $el.find(".add_channelName").val();
			var description = $el.find(".add_description").val();
			var logoURL = $el.find(".add_logoURL").val();
			var serviceTypeId = $el.find(".add_serviceTypeId").val();
			var isCanSend = $el.find(".add_isCanSend").val();
			var sendUrl = $el.find(".add_sendUrl").val();
			if(channelId==null || channelId==""){
				_index.popAlert("渠道编号 不能为空");
			}else if(mediaTypeid==null || mediaTypeid==""){
				_index.popAlert("媒体类型编号 不能为空");
			}else if(channelName==null || channelName==""){
				_index.popAlert("渠道名称 不能为空");
			}else if(mediaTypeid.length > 8){
				_index.popAlert("媒体类型编号不能超过8字符");
			}else if((isCanSend != "0") && (isCanSend != "1")){
				_index.popAlert("是否能支持下发,只能填写 0 或者 1");
			}else{
				var data = {
					"channelId": channelId,	
					"mediaTypeid": mediaTypeid,
					"channelName": channelName,	
					"description": description,	
					"logoURL": logoURL,
					"serviceTypeId": serviceTypeId,
					"isCanSend": isCanSend,
					"sendUrl": sendUrl
				}
				Util.ajax.postJson("front/sh/common!execute?uid=channels003",data,function(json,status){
	    			if (status) {
	    				 _index.popAlert("添加成功");
	    				channListInit();
	    			} else {
	    				 _index.popAlert("添加失败");
	    			}
	    			_index.destroyDialog();
	    		});
			}
		}
		///重置数据
		var reset = function(){
			$el.find(".add_channelId").val("");
			$el.find(".add_mediaTypeid").val("");
			$el.find(".add_channelName").val("");
			$el.find(".add_description").val("");
			$el.find(".add_logoURL").val("");
			$el.find(".add_serviceTypeId").val("");
			$el.find(".add_isCanSend").val("");
			$el.find(".add_sendUrl").val("");
		}
		
		
		return initialize;
});