define([ 'Util',
         '../../../tpl/clientInfo/informationBar/addInfo.tpl',
         '../../../assets/css/clinetInfo/addInfo.css' ],
function(Util,tpl) {
	var $el = $(tpl);
	var _opt;
	var _index;
	var treeInit;
	var pId = null ;
	var initialize = function(indexModule,opt) {
		_index = indexModule;
		_opt = opt.node;
		treeInit = opt.treeInit;
		initEvent();
		//addDataInfoInit();
		this.content = $el;
	}
	var initEvent = function(){
		$el.on("click",".bar_submit",submit);
		$el.on("click",".bar_reset",reset);
		$el.on("mouseleave", ".bar_obtainDataMode", mouseleave);
		dataSourceInit();
	};
	var dataSourceInit = function(serviceTypeId){
		serviceTypeId = _opt.serviceTypeId;
		nodeType = "01";
		Util.ajax.postJson('front/sh/common!execute?uid=customerInfoItem004',{"serviceTypeId":serviceTypeId,"nodeType":nodeType},function(json,status){
			if (status) {
				$("#bar_obtainDataScript",$el).empty();
				var option = [] ;
				option.push('<option value="">请选择</option>');
				$.each(json.beans,function(i,item){
					if(item.id !="Root"){
						if(serviceTypeId ==item.serviceTypeId){
							if(item.nodeType == "01"){
								option.push( '<option value='+item.id+'>'+item.name+'</option>');
							}
						}
					}
				})
				var html = option.join("");
				var configValue = Util.hdb.compile(html);
				$("#bar_obtainDataScript",$el).html(configValue(""));
			}
		});
	}

	var submit = function(){
		var itemName = $el.find(".bar_itemName").val();
		if(!itemName){
			_index.popAlert("配置项名称不能为空");
			return;
		}
		// for(var num in _opt.children){
		// 	if(itemName == _opt.children[num].name){
		// 		_index.popAlert("该数据项已存在，不能重复添加");
		// 		return;
		// 	}
		// }
		var data = {
				"nodeType":"03",
				"serviceTypeId":_opt.serviceTypeId,
				"configItemId":$el.find(".bar_itemId").val(),
 				"name":$el.find(".bar_itemName").val(),
 				"argeSeqno":$el.find(".bar_orderNum").val(),
 				"displayType":$el.find(".bar_displayType").val(),
 				"visulFlag":$el.find(".bar_visibility").val(),
 				"gainDataMode":$el.find(".bar_obtainDataMode").val(),
 				"gainDataScpt":$el.find(".bar_obtainDataScript").val(),
 				"isDatadict":$el.find(".bar_isDatadict").val(),
 				"dataDictscript":$el.find(".bar_dataDictscript").val(),
 				"linkFlag":$el.find(".bar_isLink").val(),
 				"linkType":$el.find(".bar_linkType").val(),
 				"picUrlAddr":$el.find(".bar_picURL").val(),
 				"urlLinkAddr":$el.find(".bar_linkURL").val(),
 				"linkParaName":$el.find(".bar_linkParaName").val(),
 				"linkParaValue":$el.find(".bar_isPrehandle").val(),
 				"showScptDesc":$el.find(".bar_displayScript").val(),
 				"callbckColm":$el.find(".bar_callbackField").val(),
 				"groupType":$el.find(".bar_groupType").val(),
 				"isCopy":$el.find(".bar_isCopy").val(),
 				"linkOpenMode":$el.find(".bar_linkOpenMode").val(),
				"pId":_opt.id
		}
		Util.ajax.postJson("front/sh/common!execute?uid=customerInfoBar002", data, function(json, status) {
			  if (status) {
				  treeInit(_opt.id);
				  _index.popAlert("添加成功 ！");
				  reset();
			  }else{
				  _index.popAlert("添加失败");
			  }
		  });
		_index.destroyDialog();
	}
    var reset = function(){
    	 $el.find(".bar_itemId").val("");
		 $el.find(".bar_itemName").val("");
		 $el.find(".bar_orderNum").val("");
		 $el.find(".bar_obtainDataScript").val("");
		 $el.find(".bar_dataDictscript").val("");
		 $el.find(".bar_picURL").val("");
		 $el.find(".bar_linkURL").val("");
		 $el.find(".bar_linkParaName").val("");
		 $el.find(".bar_isPrehandle").val("");
		 $el.find(".bar_displayScript").val("");
		 $el.find(".bar_callbackField").val("");
		 $("#bar_displayType",$el).empty();
		 $("#bar_displayType",$el).append('<option value="">请选择</option><option value="LABLE">文本框</option><option value="TEXT">编辑框</option><option value="SELECT">下拉列表</option><option value="CUSTOMIZE">定制</option>');
		 $("#bar_visibility",$el).empty();
		 $("#bar_visibility",$el).append('<option value="">请选择</option><option value="1">可见</option><option value="0">不可见</option><option value="2">悬浮层可见</option>');
		 $("#bar_obtainDataMode",$el).empty();
		 $("#bar_obtainDataMode",$el).append('<option value="">请选择</option><option value="01">从呼叫信息中获取</option><option value="02">从互联网身份中获取</option><option value="03">从客户标签中获取</option><option value="04">从客户信息中获取</option><option value="05">从菜单中获取</option>');
		 $("#bar_isDatadict",$el).empty();
		 $("#bar_isDatadict",$el).append('<option value="">请选择</option><option value="0">是</option><option value="1">否</option>');
		 $("#bar_isLink",$el).empty();
		 $("#bar_isLink",$el).append('<option value="">请选择</option><option value="N">无链接</option><option value="Y">有链接</option>');
		 $("#bar_linkType",$el).empty();
		 $("#bar_linkType",$el).append('<option value="">请选择</option><option value="1">文本链接</option><option value="2">图片链接</option>');
		 $("#bar_groupType",$el).empty();
		 $("#bar_groupType",$el).append('<option value="">请选择</option><option value="00">在客户信息栏中显示</option><option value="01">在更多客户信息中显示</option><option value="02">在互联网扩展信息中显示</option>');
		 dataSourceInit();
    }
    var mouseleave = function(){

		var data = $el.find(".bar_obtainDataMode").val();
		  if(data != "04"){
			  $el.find(".bar_obtainDataScript").attr("disabled",true);
		  }else{
			  $el.find(".bar_obtainDataScript").remove("disabled");
			  $el.find(".bar_obtainDataScript").attr("disabled",false);
		  }

 }

	return initialize;
});
