define([ 'Util',
         '../../../tpl/clientInfo/ConfigDataSource/addGenre.tpl',
         '../../../assets/css/clinetInfo/addGenre.css' ],
function(Util,tpl) {
	var $el = $(tpl);
	var _opt;
	var _index;
	var treeInit
	var pId = null ;
	var initialize = function(indexModule,opt) {
		_index = indexModule;
		_opt = opt.node;
		treeInit =opt.treeInit;
		initEvent();
		addDataItemInit();
		this.content = $el;
	}
	var initEvent = function(){
		$el.on("click",".aG_submit",submit);
		$el.on("click",".aG_reset",reset);
	};

	var addDataItemInit = function(){

		Util.ajax.postJson('front/sh/common!execute?uid=queryServiceTypeName',{},function(json,status){
			if (status) {
				$("#aG_serviceTypeId",$el).empty();
				var option = [] ;
				option.push('<option value="">请选择</option>');
				$.each(json.beans,function(i,item){
					option.push( '<option value='+item.servicetypeId+'>'+item.name+'</option>');
				})
				var html = option.join("");
				var configValue = Util.hdb.compile(html);
				$("#aG_serviceTypeId",$el).html(configValue(""));
			}
		});
	}
	var submit = function(){
		var serviceTypeName = $el.find(".aG_serviceTypeId option:selected").text();
		var serviceTypeId = $el.find(".aG_serviceTypeId").val();
		for(var num in _opt.children){
			if(serviceTypeId == _opt.children[num].serviceTypeId){
				_index.popAlert("该业务类型已存在，不能重复添加");
				return;
			}
		}
		var data = {
				"nodeType":"00",
				"name":serviceTypeName,
				"serviceTypeId":serviceTypeId,
				"pId":"Root"
		}
		Util.ajax.postJson("front/sh/common!execute?uid=customerInfo002", data, function(json, status) {
			  if (status) {
				  _index.popAlert("添加成功 ！");
				  reset();
				  treeInit("Root") ;
			  }else{
				  _index.popAlert("添加失败");
			  }
		  });
		_index.destroyDialog();
	}
    var reset = function(){
    	$el.find(".aG_serviceTypeName").val("");
    	$el.find(".aG_serviceTypeId").val("");
	}
	return initialize;
});
