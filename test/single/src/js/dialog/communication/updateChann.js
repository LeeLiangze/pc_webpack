define(['Util','Compts',
        '../../index/constants/mediaConstants',
        '../../../tpl/communication/channelConfig/updateChann.tpl',
        '../../../assets/css/communication/channelConfig/updateChann.css'
        ],
        function(Util,Compts,MediaConstants,tpl){
		var $el;
		var _index;
		var channListInit;
		var item;
		var initialize=function (index,option){
			$el=$(tpl);
			_index=index ;
			channListInit = option.channListInit;
			item = option.item.data;
			eventInit();
			updatechannInit(item);
			this.content = $el;
		};
		//初始化事件
		var eventInit=function(){
			$el.on('click','.chann_reset', $.proxy(reset,this));
			$el.on('click','.chann_submit', $.proxy(submit,this));
		};
		//初始化数据
		var updatechannInit = function(option){
			$el.find(".update_mediaTypeid").val(item.mediaTypeId);
			$el.find(".update_channelName").val(item.channelName);
			$el.find(".update_description").val(item.description);
			$el.find(".update_logoURL").val(item.logoURL);
			$el.find(".update_serviceTypeId").val(item.serviceTypeId);
			$el.find(".update_isCanSend").val(item.isCanSend);
			$el.find(".update_sendUrl").val(item.sendUrl);
		};
		//提交数据
		var submit = function(){
			var mediaTypeid = $el.find(".update_mediaTypeid").val();
			var channelName = $el.find(".update_channelName").val();
			var description = $el.find(".update_description").val();
			var logoURL = $el.find(".update_logoURL").val();
			var serviceTypeId = $el.find(".update_serviceTypeId").val();
			var isCanSend = $el.find(".update_isCanSend").val();
			var sendUrl = $el.find(".update_sendUrl").val();
			var data = {
				"channelId":item.channelId,		
				"mediaTypeid":mediaTypeid,
				"channelName":channelName,	
				"description":description,	
				"logoURL":logoURL,
				"serviceTypeId": serviceTypeId,
				"isCanSend": isCanSend,
				"sendUrl": sendUrl
			}
			if(mediaTypeid==null || mediaTypeid==""){
				_index.popAlert("媒体类型编号 不能为空");
			}else if(channelName==null || channelName==""){
				_index.popAlert("渠道名称 不能为空");
			}else if(mediaTypeid.length > 8){
				_index.popAlert("媒体类型编号不能超过8字符");
			}else if((isCanSend != "0") && (isCanSend != "1")){
				_index.popAlert("是否能支持下发,只能填写 0 或者 1");
			}else{
				Util.ajax.postJson("front/sh/common!execute?uid=channels005",data,function(json,status){
	    			if (status) {
	    				 _index.popAlert("修改成功");
	    				channListInit();
	    			} else {
	    				 _index.popAlert("修改失败");
	    			}
	    			_index.destroyDialog();
	    		});
			}
		}
		///重置数据
		var reset = function(){
			$el.find(".update_mediaTypeid").val(item.mediaTypeId);
			$el.find(".update_channelName").val(item.channelName);
			$el.find(".update_description").val(item.description);
			$el.find(".update_logoURL").val(item.logoURL);
			$el.find(".update_serviceTypeId").val(item.serviceTypeId);
			$el.find(".update_isCanSend").val(item.isCanSend);
			$el.find(".update_sendUrl").val(item.sendUrl);
		}
		
		
		return initialize;
});