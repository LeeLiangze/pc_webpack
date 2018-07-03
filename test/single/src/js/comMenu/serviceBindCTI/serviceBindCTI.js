define([
    'Util','Compts',
     '../../../tpl/comMenu/serviceBindCTI/serviceBindCTI.tpl',
     '../../../assets/css/comMenu/serviceType/serviceType.css'],
    function(Util,Compts,tpl){
	var _leftTree = null;
    //系统变量-定义该模块的根节点
    var $el = $(tpl);
    //系统变量-构造函数
    var _index;
    var list;
    var initialize = function(index){
    	_index = index;
        //左侧业务树生成
        getLeft();
        //初始化事件
        eventInit();
        //将根节点赋值给接口
        this.content = $el;
    };
   //初始化事件
    var eventInit=function(){
    	$el.on('click','#saveBind', $.proxy(saveBind,this));
    };
    //更新绑定关系
    var saveBind = function(){
    	var nodes = _leftTree.getSelectedNodes();
    	if(nodes.length==1){
    		var rowContent = list.getCheckedRows();
    		var CTIIds = "";
			for(var i=0;i<rowContent.length;i++){
    			if(i<rowContent.length-1){
    				CTIIds += rowContent[i].id+",";
    			}else{
    				CTIIds += rowContent[i].id;
    			}
    		}
    		Util.ajax.postJson("front/sh/common!execute?uid=serviceBindCTI003",{"serviceTypeId":nodes[0].id,"CTIIds":CTIIds},function(json,status){
    			if (status) {
    				alert(json.returnMessage);
    				listInit();
    			}else{
    				alert("更新失败!");
    			}
    		});
    	}else if(nodes.length==0){
    		alert("请选择左侧业务类型");
    	}else{
    		alert("只能选择一个业务类型");
    	}
    }
    //获取 左边插件树
	var getLeft=function(){
		Util.ajax.postJson("front/sh/common!execute?uid=serviceBindCTI001",{},function(json,status){
			if (status) {
				_leftTree=new Compts.zTree.tierTree($el.find("#Service_zTree"),json.beans,{'onClick':zTreeOnClick});
				_leftTree.expandAll(true);
				if(_leftTree.getNodes().length>0){
					_leftTree.selectNode((_leftTree.getNodes())[0]);
					listInit();
				}else{
					alert("业务类型数据为空！");
				}
			}else{
			}
		});
	};
	//点击事件，赋给callback
    function zTreeOnClick(event, treeId, treeNode) {
    	listInit();
    };
    function search(serviceTypeId){
    	if(!serviceTypeId){
    		alert("请选择业务类型！");
    		return;
    	}
    	list.search({"serviceTypeId":serviceTypeId});
    	list.on('success',function(result){
    		$(".listContainer .boxWraper input",$el).each(function(index,domEle){
    			if(result.beans[index].bind=="true"){
    				$(this).trigger("click");
        		}
        	});
          });
    }
  //右侧业务信息初始化
	var listInit = function(main){
        var config = {
	            el:$('.listContainer',$el)[0],
	            field:{
	                boxType:'checkbox',
	                key:'id',
	                popupItems:[
	                ],
	                items:[
	                    { text:'CTI名称',name:'name' }
	                ]
	            },
		        data:{
		            url:'front/sh/common!execute?uid=serviceBindCTI002',
		        } 
            }
          list = new Compts.List(config);
          var nodes = _leftTree.getSelectedNodes();
          if(nodes.length!=1){
        	  alert("选择一个左侧业务类型！");
        	  return;
          }
          search(nodes[0].id);
    };
    return initialize;
});