define([ 'Util', 'Compts',
         '../../../tpl/clientInfo/ConfigDataSource/ConfigDataSource.tpl',
         '../../../assets/css/clinetInfo/ConfigDataSource.css' ],
function(Util, Compts, tpl) {
	var $el = $(tpl);
	var _opt;
	var list;
	var _index;
	var setting;
	var ConfigDataSource = function(indexModule,opt) {
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
		listInit();
		initEvent();
		this.content = $el;
	}

	var initEvent = function() {
		$el.on("click", "#add_genre", addGenre);
		$el.on("click", "#add_dataItem", addDataItem);
	}
	var treeInit=function(data){
		Util.ajax.postJson("front/sh/common!execute?uid=customerInfo001", {}, function(json, status) {
			if (status) {
				_leftTreeSourse=new Compts.zTree.tierTree($el.find("#ST_zTree"),json.beans,setting);
				//展开根节点
				_leftTreeSourse.expandNode(_leftTreeSourse.getNodeByParam("id", data,null), true,false, false, false);
				//设置选中
				_leftTreeSourse.selectNode(_leftTreeSourse.getNodeByParam("id", data,null));
				zTreeOnClick(null,null,_leftTreeSourse.getNodeByParam("id", data,null));
			} else {
				alert("获取数据失败!");
			}
		})
	}
	 var addGenre = function(){
		 var nodes = _leftTreeSourse.getSelectedNodes();
    	 if(!nodes[0]){
    		 _index.popAlert("请选择数据项或类别！");
    		 return;
    	 }
    	 if(nodes.length>=2){
    		  _index.popAlert("只能选择一条数据项或类别！");
    		  return;
    	 }
    	 if(nodes[0].nodeType == "01" || nodes[0].nodeType == "00"){
    		 _index.popAlert("只能选择根节点才能添加类别哦！");
    		 return;
    	 }
		 _index.showDialog({
	    		title:'新增类别', //弹出窗标题
	    		url:'js/clientInfo/dataSourch/addGenre', //要加载的模块
	    		param:{"node":nodes[0],"treeInit":treeInit}, //要传递的参数，可以是json对象
	    		width:760, //对话框宽度
	    		height:150 //对话框高度
	    	});
	 }
     var addDataItem = function(){
    	 var nodes = _leftTreeSourse.getSelectedNodes();
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
	    		url:'js/clientInfo/dataSourch/addDataItem', //要加载的模块
	    		param:{"node":nodes[0],"treeInit":treeInit}, //要传递的参数，可以是json对象
	    		width:900, //对话框宽度
	    		height:160 //对话框高度
	    	});
	 }
	//初始化list
	var listInit = function(main){
		var config = {
				el:$('#dataSource_list',$el)[0],
				field:{
					items:[
					       { text:'数据集标志',name:'serviceUrl',className:'w240' },
					       { text:'数据集描述',name:'name',className:'w200' },
					       { text:'业务系统',name:'serviceTypeName',className:'w100' }
					       ],
					       button:{
					    	   className:'w80',
					    	   items:[
					    	          { text:'修改',name:'viewer',click:function(e,item){
					    	        		  var info = item.data;
					    	        		  var one = _leftTreeSourse.getSelectedNodes()[0];
					    	        		  _index.showDialog({
					    	        	    		title:'修改数据源', //弹出窗标题
					    	        	    		url:'js/clientInfo/dataSourch/updataDataSource', //要加载的模块
					    	        	    		param:{"info":info,"treeInit":treeInit,"oneNode":one}, //要传递的参数，可以是json对象
					    	        	    		width:900, //对话框宽度
					    	        	    		height:160 //对话框高度
					    	        	    	})
					    	          }},
					    	          { text:'删除',name:'viewer',click:function(e,item){
					    	        	  if(confirm("你确定要删除吗？")){
					    	        		  var info = item.data;
					    	        		  var result = {
					    	        				  "dataId":info.dataId,
					    	        				  "nodeType":info.nodeType
					    	        		  };
					    	        		  Util.ajax.postJson("front/sh/common!execute?uid=customerInfo003", result, function(json, status) {
					    	        			  if (status) {
					    	        				  alert("删除成功 ！");
					    	        				  treeInit(info.pId);
					    	        			  }else{
					    	        				  alert("删除失败");
					    	        			  }
					    	        		  });
					    	        	  }

					    	          }}
					    	          ]
					       }
				},
			 page:{  //分页设置
		                perPage:10,     //每页显示多少条记录
		                align:'right'  //分页条对齐方式
		     },
			data:{
				url:'front/sh/common!execute?uid=customerInfo001'//front/sh/media!execute?uid=queryCustInfo01
			}
		}

		list = new Compts.List(config);
		var params = {
				"nodeType":"00",
				"id":"Root",
				"pId":""
		};
		list.search(params);
    };

    function zTreeOnClick(event, treeId, treeNode){
	   var nodeType= treeNode.nodeType;
	   if(nodeType == "01"){
		   return;
	   }
	   var id = treeNode.id;
	   var params = {
			   "nodeType":"00",
			   "id":id,
			   "pId":"Root"
	   };
	   if(id == "Root"){
		   params.pId = "";
	   }
	   list.search(params);
   }
   var search = function(){

   }
	return ConfigDataSource;
});
