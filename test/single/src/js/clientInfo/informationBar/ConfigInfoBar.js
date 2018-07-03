define([ 'Util', 'Compts',
         '../../../tpl/clientInfo/informationBar/ConfigDataItem.tpl',
         '../../../assets/css/clinetInfo/informationBar.css' ],
function(Util, Compts, tpl) {
	var $el = $(tpl);
	var _opt;
	var setting;
	var _index;
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
		treeInit("Root")
		initEvent();
		this.content = $el;
	}

	var initEvent = function() {
		$el.on("click", "#bar_genre", addGenre);
		$el.on("click", "#bar_dataItem", addDataItem);
		$el.on("click", ".bar_submit", submit);
		$el.on("click", ".bar_reset", reset);
		$el.on("click", ".bar_delete", deleteItme);
		$el.on("mouseleave", ".bar_obtainDataMode", mouseleave);

	}
	var dataSourceInit = function(serviceTypeId){
		var nodes = _leftTreeBar.getSelectedNodes();
		serviceTypeId = nodes[0].serviceTypeId;
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

	 function zTreeOnClick(event, treeId, treeNode){
		// clean();
		 if(treeId == "Root"){
			 return;
		 }
		var nodeType= treeNode.nodeType;
		if(nodeType == "00" ||nodeType == "01"){
			return;
		}
		$el.find(".bar_itemId").val(treeNode.configItemId);
		 $el.find(".bar_itemName").val(treeNode.name);
		 $el.find(".bar_orderNum").val(treeNode.argeSeqno);
		// $el.find(".bar_obtainDataScript").val(treeNode.gainDataScpt);
		 $el.find(".bar_dataDictscript").val(treeNode.dataDictscript);//
		 $el.find(".bar_picURL").val(treeNode.picUrlAddr);
		 $el.find(".bar_linkURL").val(treeNode.urlLinkAddr);
		 $el.find(".bar_linkParaName").val(treeNode.linkParaName);
		 $el.find(".bar_isPrehandle").val(treeNode.isParent);
		 $el.find(".bar_callbackField").val(treeNode.callbckColm);
		 $el.find(".bar_displayType").val(treeNode.displayType);
		 $el.find(".bar_visibility").val(treeNode.visulFlag);
		 $el.find(".bar_displayScript").val(treeNode.showScptDesc);//
		 $el.find(".bar_obtainDataMode").val(treeNode.gainDataMode);
		 $el.find(".bar_isDatadict").val(treeNode.isDatadict);//
		 $el.find(".bar_isLink").val(treeNode.linkFlag);
		 $el.find(".bar_linkType").val(treeNode.linkType);
		 $el.find(".bar_groupType").val(treeNode.groupType);
		 dataSourceInit();
		 $el.find(".bar_obtainDataScript").val(treeNode.gainDataScpt);
	}
	var treeInit = function(data){
		Util.ajax.postJson("front/sh/common!execute?uid=customerInfoBar001", {}, function(json, status) {
			if (status) {
				_leftTreeBar=new Compts.zTree.tierTree($el.find("#bar_zTree"),json.beans,setting);
				//展开根节点
				_leftTreeBar.expandNode(_leftTreeBar.getNodeByParam("id",data,null), true,false, false, false);
				//设置选中
				_leftTreeBar.selectNode(_leftTreeBar.getNodeByParam("id",data,null));
				zTreeOnClick(null,null,_leftTreeBar.getNodeByParam("id", data,null));
			} else {
				alert("获取数据失败!");
			}
		})
	}
    var addGenre = function(){
		 var nodes = _leftTreeBar.getSelectedNodes();
    	 if(!nodes[0]){
    		 _index.popAlert("请选择数据项或类别！");
    		 return;
    	 }
    	 if(nodes.length>=2){
    		  _index.popAlert("只能选择一条数据项或类别！");
    		  return;
    	 }
    	 if(nodes[0].nodeType == "03"|| nodes[0].nodeType == "02"){
    		 _index.popAlert("不能选择数据项添加类别哦！");
    		 return;
    	 }
		 _index.showDialog({
	    		title:'新增类别', //弹出窗标题
	    		url:'js/clientInfo/informationBar/addGenre', //要加载的模块
	    		param:{"node":nodes[0],"treeInit":treeInit}, //要传递的参数，可以是json对象
	    		width:760, //对话框宽度
	    		height:150 //对话框高度
	    	});
	 }
     var addDataItem = function(){
    	 var nodes = _leftTreeBar.getSelectedNodes();
    	 if(!nodes[0]){
    		 _index.popAlert("请选择数据项或类别！");
    		 return;
    	 }
    	 if(nodes.length>=2){
    		  _index.popAlert("只能选择一条数据项或类别！");
    		  return;
    	 }
    	 if(nodes[0].nodeType != "02"){
    		 _index.popAlert("只能选择信息栏时添加信息项！");
   		      return;
    	 }
    	 _index.showDialog({
	    		title:'新增信息项', //弹出窗标题
	    		url:'js/clientInfo/informationBar/addInfo', //要加载的模块
	    		param:{"node":nodes[0],"treeInit":treeInit}, //要传递的参数，可以是json对象
	    		width:900, //对话框宽度
	    		height:600 //对话框高度
	    	});
	 }
     var submit = function(){
        var nodes = _leftTreeBar.getSelectedNodes();
        var groupType = $el.find(".bar_groupType").val();
 		var data = {
 				"configId":nodes[0].configId,
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
 				"groupType":$el.find(".bar_groupType").val()
 		}
 		if(groupType == "02"){
 		}
 		Util.ajax.postJson("front/sh/common!execute?uid=customerInfoBar002", data, function(json, status) {
			  if (status) {
				  _index.popAlert("修改成功 ！");
				  treeInit(nodes[0].pId);
			  }else{
				  _index.popAlert("修改失败");
			  }
		  });

     }
     var reset = function(){
    	 var nodes = _leftTreeBar.getSelectedNodes()[0];
    	 $el.find(".bar_itemId").val(nodes.configItemId);
		 $el.find(".bar_itemName").val(nodes.name);
		 $el.find(".bar_orderNum").val(nodes.argeSeqno);
		// $el.find(".bar_obtainDataScript").val(treeNode.gainDataScpt);
		 $el.find(".bar_dataDictscript").val(nodes.dataDictscript);//
		 $el.find(".bar_picURL").val(nodes.picUrlAddr);
		 $el.find(".bar_linkURL").val(nodes.urlLinkAddr);
		 $el.find(".bar_linkParaName").val(nodes.linkParaName);
		 $el.find(".bar_isPrehandle").val(nodes.isParent);
		 $el.find(".bar_callbackField").val(nodes.callbckColm);
		 $el.find(".bar_displayType").val(nodes.displayType);
		 $el.find(".bar_visibility").val(nodes.visulFlag);
		 $el.find(".bar_displayScript").val(nodes.showScptDesc);//
		 $el.find(".bar_obtainDataMode").val(nodes.gainDataMode);
		 $el.find(".bar_isDatadict").val(nodes.isDatadict);//
		 $el.find(".bar_isLink").val(nodes.linkFlag);
		 $el.find(".bar_linkType").val(nodes.linkType);
		 $el.find(".bar_groupType").val(nodes.groupType);
		 dataSourceInit();
		 $el.find(".bar_obtainDataScript").val(nodes.gainDataScpt);
     }
     var deleteItme = function(){
    	 var nodes = _leftTreeBar.getSelectedNodes();

    	 var result = {
    			 "configId":nodes[0].configId,
    			 "nodeType":nodes[0].nodeType
  		}
    	 Util.ajax.postJson("front/sh/common!execute?uid=customerInfoBar003", result, function(json, status) {
			  if (status) {
				  _index.popAlert("删除成功 ！");
				  treeInit(nodes[0].pId);
			  }else{
				  _index.popAlert("删除失败");
			  }
		  });
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
     var clean = function(){
    	 $el.find(".bar_itemId").val("");
		 $el.find(".bar_itemName").val("");
		 $el.find(".bar_orderNum").val("");
		 $el.find(".bar_dataDictscript").val("");//
		 $el.find(".bar_picURL").val("");
		 $el.find(".bar_linkURL").val("");
		 $el.find(".bar_linkParaName").val("");
		 $el.find(".bar_isPrehandle").val("");
		 $el.find(".bar_callbackField").val("");
		 $el.find(".bar_displayType").val("");
		 $el.find(".bar_visibility").val("");
		 $el.find(".bar_displayScript").val("");//
		 $el.find(".bar_obtainDataMode").val("");
		 $el.find(".bar_isDatadict").val("");//
		 $el.find(".bar_isLink").val("");
		 $el.find(".bar_linkType").val("");
		 $el.find(".bar_groupType").val("");
		 $el.find(".bar_obtainDataScript").val("");
     }

	return initialize;
});
