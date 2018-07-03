define([ 'Util',
         '../../../tpl/clientInfo/ConfigDataSource/addDataItem.tpl',
         '../../../assets/css/clinetInfo/addDataItem.css' ],
function(Util,tpl) {
	var $el = $(tpl);
	var _opt;
	var _index;
	var pId = null ;
	var treeInit
	var initialize = function(indexModule,opt) {
		_index = indexModule;
		_opt = opt.node;
		treeInit =opt.treeInit;
		initEvent();
		addDataItemInit();
		this.content = $el;
	}
	var initEvent = function(){
		$el.on("click",".aDItem_submit",submit);
		$el.on("click",".aDItem_reset",reset);
	};

	var addDataItemInit = function(){
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

	}
	var submit = function(){
		var serviceTypeName = $el.find(".aDItem_serviceTypeName").val();
		var url = $el.find(".aDItem_serviceURL").val();
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
				"name":serviceTypeName,
				"serviceTypeId":_opt.serviceTypeId,
				"serviceUrl":url,
				"pId":pId
		}
		Util.ajax.postJson("front/sh/common!execute?uid=customerInfo002", data, function(json, status) {
			  if (status) {
				  _index.popAlert("添加成功 ！");
				  reset();
				  treeInit(pId) ;
			  }else{
				  _index.popAlert("添加失败");
			  }
		  });
		_index.destroyDialog();
	}
    var reset = function(){
    	$el.find(".aDItem_serviceTypeName").val("");
    	$el.find(".aDItem_serviceURL").val("");
	}
	return initialize;
});
