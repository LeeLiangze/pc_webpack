define([ 'Util',
         '../../../tpl/clientInfo/dataItem/addDataInfo.tpl',
         '../../../assets/css/clinetInfo/addDataInfo.css' ],
function(Util,tpl) {
	var $el = $(tpl);
	var _opt;
	var list;
	var _index;
	var pId = null ;
	var treeInit;
	var initialize = function(indexModule,opt) {
		_index = indexModule;
		_opt = opt.node;
		treeInit =opt.treeInit;
		initEvent();
		addDataInfoInit();
		this.content = $el;
	}
	var initEvent = function(){
		$el.on("click",".addInfo_submit",submit);
		$el.on("click",".addInfo_reset",reset);
	};

	var addDataInfoInit = function(){
		var nodetype = _opt.nodeType;
		if(typeof(nodetype) == 'undefined'){
			_index.popAlert('根节点不能添加数据项！');
			return;
		}
		if(nodetype == "00"){
			 pId = _opt.id;
		}else{
			 pId = _opt.pId;
		}
		$el.find(".addInfo_serviceType").val(_opt.serviceTypeId);
		Util.ajax.postJson('front/sh/common!execute?uid=customerInfo001',{},function(json,status){
			$("#addInfo_dataSourceId",$el).empty();
			var option = [] ;
			option.push('<option value="">请选择</option>');
			$.each(json.beans,function(i,item){
				if(item.id !="Root"){
					if(_opt.serviceTypeId ==item.serviceTypeId){
						if(item.nodeType == "01"){
							option.push( '<option value='+item.id+'>'+item.name+'</option>');
						}
					}
				}
			})
			var html = option.join("");
			configValue = Util.hdb.compile(html);
			$("#addInfo_dataSourceId").html(configValue(""));
		});

	}
	var submit = function(){
		var serviceTypeName = $el.find(".addInfo_dataItemName").val();
		for(var num in _opt.children){
			if(serviceTypeName == _opt.children[num].name){
				_index.popAlert("该数据项已存在，不能重复添加");
				return;
			}
		}
		if(!serviceTypeName){
			_index.popAlert("配置项名称不能为空");
			return;
		}
		var data = {
				"nodeType":"01",
				"dataItemName":$el.find(".addInfo_dataItemName").val(),
				"serviceTypeId":_opt.serviceTypeId,
				"dataItemFlag":$el.find(".addInfo_dataItemFlag").val(),
				"dataItemType":$el.find(".addInfo_type").val(),
				"dataSourceId":$el.find(".addInfo_dataSourceId").val(),
				"sourceField":$el.find(".addInfo_sourceField").val(),
				"pId":pId
		}
		Util.ajax.postJson("front/sh/common!execute?uid=customerInfoItem002", data, function(json, status) {
			  if (status) {
				  _index.popAlert("添加成功 ！");
				  treeInit(pId);
				  reset();
			  }else{
				  _index.popAlert("添加失败");
			  }
		  });
		_index.destroyDialog();
	}
    var reset = function(){
    	$el.find(".addInfo_dataItemFlag").val("");
    	$el.find(".addInfo_dataItemName").val("");
    	$el.find(".addInfo_sourceField").val("");
	}
	return initialize;
});
