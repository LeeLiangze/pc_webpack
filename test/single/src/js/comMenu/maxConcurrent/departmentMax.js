/**
 * 最大会话数设置
 * peishuxian
 */
define(['Util',
        'Compts',
        '../../index/constants/mediaConstants',
        '../../../tpl/comMenu/maxConcurrent/departmentMax.tpl',
        '../../../assets/css/maxConcurrent/maxConcurrent.css'
        ],
        function(
        		Util,
        		Compts,
        		mediaConstants,
        		tpl
        		){
	
	//系统变量-定义该模块的根节点
	var _index = null;
	var $el = null;
	var _params = null;
	var _department = null;
	//系统变量-构造函数
	//如果该模块通过菜单打开，options参数等于当前模块在菜单中的配置；
	//如果该模块通过index.main.createTab方法打开，options参数等于createTab的第3个参数
	//tab 是当前选项卡对象
	var initialize = function(index, params){
		$el = $(tpl);
		_index = index;
		_params = params;
		eventInit();
		listInit();
		//将根节点赋值给接口
		this.content = $el;
	};
	
	var eventInit = function(){
		$el.on('click','#selectDepartmentMax', $.proxy(search,this));
		$el.on('click','#insertDepartmentMax', $.proxy(addMax,this));
		$el.on('click','#delDepartmentMax', $.proxy(batchDelete,this));
		//构建部门下拉列表
		$el.find("#department").empty();
		var tempHTML = "";
		$.each(_params,function(index,bean){
			tempHTML += "<option value='"+bean.deptId+"'>"+bean.deptName+"</option>";
		});
		var html = "<select name='department'>" +tempHTML+"</select>";
		$el.find("#department").append(html);
		
		//构建媒体类型下拉列表
		var config1 = {
				el : $('#mediaTypeId',$el), // 要绑定的容器
				label : '媒体类型', // 下拉框单元左侧label文本
				name : 'mediaTypeId', // 下拉框单元右侧下拉框名称
				url : 'front/sh/media!execute?uid=mes008' // 数据源
		}
		var list = new Compts.Select(config1);
		$el.on('mouseover','#mediaTypeId', function(){
			$el.find("[name=\"mediaTypeId\"] option[value=\""+mediaConstants.VOICE_TYPE+"\"]").remove();
			$el.find("[name=\"mediaTypeId\"] option[value=\""+mediaConstants.SHORT_MESSAGE_TYPE+"\"]").remove();
		});
	}
	
	var listInit = function(){
		var config = {
				//要绑定的容器
				el:$('.listContainer',$el),
				//字段设置
				field:{
					//行类型，checkbox复选框|radio单选框
					boxType:'checkbox',
					id:'departmentMaxId',
					//列设置，必须设置该项
					items:[
					       {
					    	   text:'部门名称',  //列文本设置
					    	   name:'department',
					    	   render:function(item,val){
					    		   return _department;
					    	   }
					       },
					       {
					    	   text:'媒体类型',
					    	   name:'mediaTypeId',
					    	   render:function(item,val){  //重写列表展示
					    		   var mediaTypeInfo = _index.contentCommon.getMediaInfo(val); 
					    		   return mediaTypeInfo.mediaTypeName;
					    	   }
					       },
					       {
					    	   text:'最大会话数',
					    	   name:'maxConcurrent'
					       }
					       ],
					button:{
						items:[
						       {
						    	   text:'修改',  //按钮文本
						    	   name:'update',  //按钮名称
						    	   className:'w90',    //操作区域class属性设置
						    	   click:function(e,item){     //按钮点击时处理函数
						    		   var info = item.data;
						    		   var mediaTypeInfo =_index.contentCommon.getMediaInfo(info.mediaTypeId); 
						    		   Util.dialog.openDiv({
						    				id:"updateDepartmentMax",
						    	            title:"修改部门最大会话数",
						    	            width:400,
						    	            height:300,
						    	            okValue: "保存",
						    		        ok: function(){
						    		        	var maxNum = $("#updateMaxConcurrent").val();
						    		        	if(!/^\+?[1-9][0-9]*$/.test(maxNum)){
						    		    			showTips("warn","最大会话数必须为非零正整数！");
						    		    			return;
						    		    		}
						    		        	Util.ajax.postJson('front/sh/media!execute?uid=maxConcurrent02',{"id":info.id,"maxConcurrent":maxNum},$.proxy(function(jsonData,status){
								    				   if(status){
								    					   showTips("success","修改成功！");
								    				   }else{
								    					   showTips("warn","修改失败！");
								    				   }
								    				   search();
								    			   },this));
						    		        	Util.dialog.close("updateDepartmentMax");
						    		        },
						    		        cancelValue: "取消",
						    		        cancel: function(){Util.dialog.close("updateDepartmentMax");},
						    	            content:"<div class=\"jf-form columns-1\">" +
						    	            			"<ul class=\"jf-form-item\">" +
						    	            				"<li style='margin-top:30px'>" +
						    	            					"<span style='display:inline-block;width:150px;text-align:right;margin-right:10px'>部门</span>"+
						    	            					"<span style='display:inline-block;width:200px;'>"+_department+"</span>"+
						    	            				"</li>"+
						    	            				"<li style='margin-top:20px'>" +
					    	            						"<span style='display:inline-block;width:150px;text-align:right;margin-right:10px'>媒体类型</span>"+
					    	            						"<span style='display:inline-block;width:150px;'>"+mediaTypeInfo.mediaTypeName+"</span>"+
					    	            					"</li>"+
					    	            					"<li style='margin-top:20px'>" +
				    	            							"<span style='display:inline-block;width:150px;text-align:right;margin-right:10px'>最大会话数</span>"+
				    	            							"<span><input style='width:200px;height:30px' id=\"updateMaxConcurrent\" type=\"text\" value=\"请输入最大会话数\" onfocus=\"this.value=''\" onblur=\"if(this.value==''){this.value='请输入最大会话数'}\"/></span>"+
				    	            						"</li>"+
						    	            			"</ul>"+
						    	            		"</div>"
						    			});
						    	   }
						       },
						       {
						    	   text:'删除',  //按钮文本
						    	   name:'delete',  //按钮名称
						    	   className:'w90',
						    	   click:function(e,item){     //按钮点击时处理函数
						    		   if(confirm("确认删除该条记录？")){
						    			   Util.ajax.postJson('front/sh/media!execute?uid=maxConcurrent03',{"id":item.data.id},$.proxy(function(jsonData,status){
						    				   if(status){
						    					   showTips("success","删除成功！");
						    				   }else{
						    					   showTips("warn","删除失败！");
						    				   }
						    				   search();
						    			   },this));
						    		   }
						    	   }
						       }
						       ]
					}
				},
				data:{
					url:'front/sh/media!execute?uid=maxConcurrent04'
				}
		};
		this.list = new Compts.List(config);
		search.call(this);
	}
	//查询部门最大会话数
	var search = function(){
		var orgaId = $el.find("#department :selected").val();
		var department = $el.find("#department :selected").text();
		_department = department;
		var mediaTypeId = $el.find("#mediaTypeId :selected").val();
		var result = {
				"orgaId":orgaId,
				"mediaTypeId":mediaTypeId
		};
		this.list.search(result);
	}
	
	//新增部门最大会话数
	var addMax = function(){
		_index.showDialog({
			title:'新增部门最大会话数',   //弹出窗标题
			url:'js/comMenu/maxConcurrent/addDepartmentMax',    //要加载的模块
			param:_params,    //要传递的参数，可以是json对象，也可以传递方法{ name:'zhangsan', resresh:function(){} }
		});
	}
	
	//批量删除
	var batchDelete = function(){
			var ids = "";
			var items = this.list.getCheckedRows();
			$.each(items,function(i,item){
				ids += item.id+"*";
			});
			if(ids==""){
				showTips("warn","请选择一条记录！");
				return;
			}
			if(confirm("确认删除选中记录？")){
 			   Util.ajax.postJson('front/sh/media!execute?uid=maxConcurrent03',{"ids":ids},$.proxy(function(jsonData,status){
 				   if(status){
 					   showTips("success","批量删除成功！");
 				   }else{
 					   showTips("warn","批量删除失败！");
 				   }
 				   search();
 			   },this));
			}
	}
	
	//提示信息 warn&success
	var showTips = function(status,tips){
		$el.find("#textWarn").show();
		if(status=="warn"){
			$el.find("#textWarn").css("color","red");
			$el.find("#textWarn").text(tips);
		}
		if(status=="success"){
			$el.find("#textWarn").css("color","green");
			$el.find("#textWarn").text(tips);
		}
		setTimeout(function(){
			$el.find("#textWarn").hide(500);
		},3000);
	}
	
	return initialize;
});