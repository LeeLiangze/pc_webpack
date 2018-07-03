define([ 'Util', 'Compts', 
         '../../../tpl/clientInfo/ConfigDataSource/updataDataSource.tpl',
         '../../../assets/css/clinetInfo/updataDataSource.css' ],
function(Util, Compts, tpl) {
	var $el = $(tpl);
	var _opt;
	var treeInit;
	var oneNode;
	var list;
	var _index;
	var initialize = function(indexModule,opt) {  
		_index = indexModule;
		_opt = opt.info ;
		treeInit=opt.treeInit;
		oneNode=opt.oneNode;
		updataInit();
		initEvent();
		this.content = $el;
	}
	var initEvent = function(){
		$el.on("click",".DS_submit",submit);
		$el.on("click",".DS_reset",reset);
	};
	var updataInit = function(){
		$el.find(".DS_serviceurl").val(_opt.serviceUrl);
		$el.find(".DS_nodedesc").val(_opt.name);
	};
	var submit = function(){
		var serviceURl = $el.find(".DS_serviceurl").val();
		var nodeDesc = $el.find(".DS_nodedesc").val();
		
		var data = {
				"dataId":_opt.dataId,
				"serviceUrl":serviceURl,
				"name":nodeDesc,
				"id":_opt.id,
				"pId":_opt.pId,
				"serviceTypeId":_opt.serviceTypeId,
                "nodeType":_opt.nodeType
		}
		Util.ajax.postJson("front/sh/common!execute?uid=customerInfo002", data, function(json, status) {
			  if (status) {
				  _index.popAlert("修改成功 ！");
				//new ConfigDataSource().treeInit(_opt.pId);
				  if (oneNode.id=="Root") {
					treeInit("Root");
				}else{
					treeInit(_opt.pId);
				}
			  }else{
				  _index.popAlert("修改失败");
			  }
		  });
		_index.destroyDialog();
	};
    var reset = function(){
    	$el.find(".DS_datasourceid").val(_opt.DATASOURCEID);
		$el.find(".DS_serviceurl").val(_opt.SERVICEURL);
		$el.find(".DS_nodedesc").val(_opt.name);
	}
	return initialize;
});