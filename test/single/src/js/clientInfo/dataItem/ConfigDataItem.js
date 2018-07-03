define([ 'Util', 'Compts',
         '../../../tpl/clientInfo/dataItem/ConfigDataItem.tpl',
         '../../../assets/css/clinetInfo/ConfigDataItem.css' ],
function(Util, Compts, tpl) {
	var $el = $(tpl);
	var _opt;
	var _index;
	var setting;
	var initialize = function(indexModule,opt) {
		setting = {
				callback: {
                	onClick:zTreeOnClick
            	},
                data: {
                	simpleData: {
            			enable: true
            		}
                }
            };
		_index = indexModule;
		treeInit("Root");
		initEvent();
		this.content = $el;
	}

	var initEvent = function() {
		$el.on("click", "#addCon_genre", addGenre);
		$el.on("click", "#addCon_dataItem", addDataItem);
		$el.on("click", ".CDItem_submit", submit);
		$el.on("click", ".CDItem_reset", reset);
		$el.on("click", ".CDItem_delete", deleteItme);
	}

	var zTreeOnClick = function(event, treeId, treeNode){
		 if(treeId == "Root"){
			 return;
		 }
		var nodeType= treeNode.nodeType;
		if(nodeType != "01"){
			return;
		}
		dataSourceInit(treeNode.serviceTypeId);
		var nodes = _leftTreeDataItem.getSelectedNodes();
	    $el.find(".CDItem_dataItemName").val(treeNode.name);
 		$el.find(".CDItem_dataItemFlag").val(treeNode.dataItemFlag);
 		$el.find(".CDItem_serviceType").val(treeNode.serviceTypeName);
 		$el.find(".CDItem_sourceField").val(treeNode.sourceField);
 		$el.find(".CDItem_type").val(treeNode.dataItemType);
 		$el.find(".CDItem_dataSourceId").val(treeNode.dataSourceId);


	}
	var dataSourceInit = function(serviceTypeId){
		$("#CDItem_type",$el).empty();
		$("#CDItem_type",$el).append($("<option value=''>请选择</option><option value='1'>字符型</option><option value='2'>浮点型</option><option value='3'>整形(int)</option><option value='4'>日期型</option>"));
		Util.ajax.postJson('front/sh/common!execute?uid=customerInfo001',{},function(json,status){
			if (status) {
				$("#CDItem_dataSourceId",$el).empty();
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
				$("#CDItem_dataSourceId",$el).html(configValue(""));
			}
		});

	}
	var treeInit = function(data){
		Util.ajax.postJson("front/sh/common!execute?uid=customerInfoItem001", {}, function(json, status) {
			if (status) {
				_leftTreeDataItem=new Compts.zTree.tierTree($el.find("#CDItem_zTree"),json.beans,setting);
				//展开根节点
				_leftTreeDataItem.expandNode(_leftTreeDataItem.getNodeByParam("id", data,null), true,false, false, false);
				//设置选中
				_leftTreeDataItem.selectNode(_leftTreeDataItem.getNodeByParam("id", data,null));
				zTreeOnClick(null,null,_leftTreeDataItem.getNodeByParam("id", data,null));
			} else {
				alert("获取数据失败!");
			}
		})
	}
    var addGenre = function(){
		 var nodes = _leftTreeDataItem.getSelectedNodes();
    	 if(!nodes[0]){
    		 _index.popAlert("请选择数据项或类别！");
    		 return;
    	 }
    	 if(nodes.length>=2){
    		  _index.popAlert("只能选择一条数据项或类别！");
    		  return;
    	 }
    	 if(nodes[0].nodeType == "01"){
    		 _index.popAlert("不能选择数据项添加类别哦！");
    		 return;
    	 }
		 _index.showDialog({
	    		title:'新增类别', //弹出窗标题
	    		url:'js/clientInfo/dataItem/addGenre', //要加载的模块
	    		param:{"node":nodes[0],"treeInit":treeInit}, //要传递的参数，可以是json对象
	    		width:760, //对话框宽度
	    		height:150 //对话框高度
	    	});
	 }
     var addDataItem = function(){
    	 var nodes = _leftTreeDataItem.getSelectedNodes();
    	 if(!nodes[0]){
    		 _index.popAlert("请选择数据项或类别！");
    		 return;
    	 }
    	 if(nodes.length>=2){
    		  _index.popAlert("只能选择一条数据项或类别！");
    		  return;
    	 }
    	 if (typeof(nodes[0].nodeType) == 'undefined'){
             _index.popAlert("根节点不能添加数据项！");
             return;
          }
    	 _index.showDialog({
	    		title:'新增数据项', //弹出窗标题
	    		url:'js/clientInfo/dataItem/addDataInfo', //要加载的模块
	    		param:{"node":nodes[0],"treeInit":treeInit}, //要传递的参数，可以是json对象
	    		width:900, //对话框宽度
	    		height:280 //对话框高度
	    	});
	 }
     var submit = function(){
    	var nodes = _leftTreeDataItem.getSelectedNodes();
 		var data = {
 				"dataItemId":nodes[0].dataItemId,
 				"dataItemName":$el.find(".CDItem_dataItemName").val(),
 				"dataItemFlag":$el.find(".CDItem_dataItemFlag").val(),
 				"dataItemType":$el.find(".CDItem_type").val(),
 				"dataSourceId":$el.find(".CDItem_dataSourceId").val(),
 				"sourceField":$el.find(".CDItem_sourceField").val(),
 				"nodeType":"01",
 				"serviceTypeId":nodes[0].serviceTypeId,
 				"pId":nodes[0].pId,
 				"id":nodes[0].id
 		}
 		Util.ajax.postJson("front/sh/common!execute?uid=customerInfoItem002", data, function(json, status) {
			  if (status) {
				  _index.popAlert("修改成功 ！");
				  treeInit(nodes[0].pId);
			  }else{
				  _index.popAlert("修改失败");
			  }
		  });

     }
     var reset = function(){
    	var node = _leftTreeDataItem.getSelectedNodes()[0];
    	dataSourceInit(node.serviceTypeId);
	    $el.find(".CDItem_dataItemName").val(node.name);
 		$el.find(".CDItem_dataItemFlag").val(node.dataItemFlag);
 		$el.find(".CDItem_serviceType").val(node.serviceTypeName);
 		$el.find(".CDItem_sourceField").val(node.sourceField);
 		$el.find(".CDItem_type").val(node.dataItemType);
 		$el.find(".CDItem_dataSourceId").val(node.dataSourceId);



     }
     var deleteItme = function(){
    	 var nodes = _leftTreeDataItem.getSelectedNodes();
    	 var result = {
    			 "dataItemId":nodes[0].dataItemId,
    	          "nodeType":nodes[0].nodeType
  		}
    	 Util.ajax.postJson("front/sh/common!execute?uid=customerInfoItem003", result, function(json, status) {
			  if (status) {
				  _index.popAlert("删除成功 ！");
				  treeInit(nodes[0].pId);
				  reset();
			  }else{
				  _index.popAlert("删除失败");
			  }
		  });
     }

	return initialize;
});
