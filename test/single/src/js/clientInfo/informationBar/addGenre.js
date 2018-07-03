define([ 'Util',
         '../../../tpl/clientInfo/informationBar/addGenre.tpl',
         '../../../assets/css/clinetInfo/addGenre.css' ],
function(Util,tpl) {
	var $el = $(tpl);
	var _opt;
	var _index;
	var treeInit;
	var pId = null ;
	var nodetype = null;
	var initialize = function(indexModule,opt) {
		_index = indexModule;
		_opt = opt.node;
		treeInit = opt.treeInit;
		initEvent();
		addDataItemInit();
		this.content = $el;
	}
	var initEvent = function(){

		$el.on("click",".aG_submit",submit);
		$el.on("click",".aG_reset",reset);
	};

	var addDataItemInit = function(){
		var pnodetype = _opt.nodeType;
		pId = _opt.id;
		if(pId == "Root"){
			$el.find(".bar_vive").hide();
			$el.find(".bar_Information").hide();
			$el.find(".bar_service").show();
			nodetype = "00";
			Util.ajax.postJson('front/sh/common!execute?uid=queryServiceTypeName',{},function(json,status){
				if (status) {
					$("#bar_serviceTypeId",$el).empty();
					var option = [] ;
					option.push('<option value="">请选择</option>');
					$.each(json.beans,function(i,item){
						option.push( '<option value='+item.servicetypeId+'>'+item.name+'</option>');
					})
					var html = option.join("");
					var configValue = Util.hdb.compile(html);
					$("#bar_serviceTypeId",$el).html(configValue(""));
				}
			});
		}else{
			if(pnodetype == "00"){
				$el.find(".bar_vive").show();
				$el.find(".bar_service").hide();
				$el.find(".bar_Information").hide();
				nodetype = "01";
			}else if(pnodetype == "01"){
				$el.find(".bar_Information").show();
				$el.find(".bar_service").hide();
				$el.find(".bar_vive").hide();
				nodetype = "02";
			}else {
				return;
			}
		}

	}
	var submit = function(){
		var serviceTypeName = $el.find(".bar_serviceTypeId option:selected").text();
		var serviceTypeId = $el.find(".bar_serviceTypeId").val();
		for(var num in _opt.children){
			if(serviceTypeId == _opt.children[num].serviceTypeId){
				_index.popAlert("该业务类型已存在，不能重复添加");
				return;
			}
		}
		var itemName = $el.find(".bar_name").val();
		var orderNum = $el.find(".bar_num").val();
		var viewMode = $el.find(".bar_viewModeName").val();
		if(viewMode){
			for(var num in _opt.children){
				if(viewMode == _opt.children[num].viewMode){
					_index.popAlert("该视图模式已存在，不能重复添加");
					return;
				}
			 }
			}
		var data = {
				"visulFlag":"1",
				"nodeType":nodetype,
				"serviceTypeId":serviceTypeId,
				"argeSeqno":orderNum,
				"pId":pId
		}
		if(nodetype == "00"){
			data.name = serviceTypeName;
		}else if(nodetype == "01"){
			if(viewMode == "00"){
				data.name = "语音视图A";

			}else if(viewMode == "01"){
				data.name = "语音视图B";
			}else{
				data.name = "互联网视图";
			}
			data.viewMode = viewMode;
			data.serviceTypeId = _opt.serviceTypeId;
		}else if(nodetype == "02"){
			data.name = itemName;
			data.serviceTypeId = _opt.serviceTypeId;
		}
		Util.ajax.postJson("front/sh/common!execute?uid=customerInfoBar002", data, function(json, status) {
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
    	$el.find(".bar_serviceTypeName").val("");
    	$el.find(".bar_serviceTypeId").val("");
    	$el.find(".bar_viewModeName").val("");
		$el.find(".bar_name").val("");
		$el.find(".bar_num").val("");
	}
	return initialize;
});
