/**
 * 最大会话数设置
 * peishuxian
 */
define(['Util',
        'Compts',
        '../../index/constants/mediaConstants',
        '../../../tpl/comMenu/maxConcurrent/staffMax.tpl',
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
	
	//系统变量-构造函数
	//如果该模块通过菜单打开，options参数等于当前模块在菜单中的配置；
	//如果该模块通过index.main.createTab方法打开，options参数等于createTab的第3个参数
	//tab 是当前选项卡对象
	var initialize = function(index, params){
		$el = $(tpl);
		_index = index;
		_params=params;
		eventInit();
		listInit();
		//将根节点赋值给接口
		this.content = $el;
	};
	
	var eventInit = function(){
		$el.on('click','#selectStaffMax', $.proxy(search,this));
		$el.on('click','#insertStaffMax', $.proxy(addMax,this));
		$el.on('click','#delStaffMax', $.proxy(batchDelete,this));
		$el.on('click','#relevance', function(){
			var orgaId = $el.find("#department :selected").val();
			if(orgaId==""){
				showTips("warn","请选择部门！");
				$el.find("#relevance").attr('checked',false);
			}
		});
		//构建部门下拉列表
		$el.find("#department").empty();
		var tempHTML = "<option value=\"\">请选择</option>";
		$.each(_params,function(index,bean){
			if(index==0){
				tempHTML += "<option value='"+bean.deptId+"' selected='selected' orgaCode='"+bean.orgaCode+"'>"+bean.deptName+"</option>";
			}else{
				tempHTML += "<option value='"+bean.deptId+"' orgaCode='"+bean.orgaCode+"'>"+bean.deptName+"</option>";
			}
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
					id:'staffMaxId',
					//列设置，必须设置该项
					items:[
					       {
					    	   text:'员工账号',  //列文本设置
					    	   name:'staffId'
					       },
					       {
					    	   text:'员工名称',  //列文本设置
					    	   name:'staffName'
					       },
					       {
					    	   text:'部门名称',  //列文本设置
					    	   name:'orgaName'
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
						    	   className:'w90',
						    	   click:function(e,item){     //按钮点击时处理函数
						    		   var info = item.data;
						    		   var mediaTypeInfo = _index.contentCommon.getMediaInfo(info.mediaTypeId); 
						    		   Util.dialog.openDiv({
						    				id:"updateStaffMax",
						    	            title:"修改人员最大会话数",
						    	            width:400,
						    	            height:300,
						    	            okValue: "保存",
						    		        ok: function(){
						    		        	var maxNum = $("#updateMaxConcurrent").val();
						    		        	if(!/^\+?[1-9][0-9]*$/.test(maxNum)){
						    		    			showTips("warn","最大会话数必须为非零正整数！");
						    		    			return;
						    		    		}
						    		        	Util.ajax.postJson('front/sh/media!execute?uid=maxConcurrent06',{"id":info.id,"maxConcurrent":maxNum},$.proxy(function(jsonData,status){
								    				   if(status){
								    					   showTips("success","修改成功！");
								    				   }else{
								    					   showTips("warn","修改失败！");
								    				   }
								    				   search();
								    			   },this));
						    		        	Util.dialog.close("updateStaffMax");
						    		        },
						    		        cancelValue: "取消",
						    		        cancel: function(){Util.dialog.close("updateStaffMax");},
						    	            content:"<div class=\"jf-form columns-1\">" +
						    	            			"<ul class=\"jf-form-item\">" +
						    	            				"<li>" +
				    	            							"<span>员工账号</span>"+
				    	            							"<span>"+info.staffId+"</span>"+
				    	            						"</li>"+
				    	            						"<li>" +
			    	            								"<span>员工账号</span>"+
			    	            								"<span>"+info.staffName+"</span>"+
			    	            							"</li>"+
						    	            				"<li>" +
						    	            					"<span>部门名称</span>"+
						    	            					"<span>"+info.orgaName+"</span>"+
						    	            				"</li>"+
						    	            				"<li>" +
					    	            						"<span>媒体类型</span>"+
					    	            						"<span>"+mediaTypeInfo.mediaTypeName+"</span>"+
					    	            					"</li>"+
					    	            					"<li>" +
				    	            							"<span>最大会话数</span>"+
				    	            							"<span><input id=\"updateMaxConcurrent\" type=\"text\" value=\"请输入最大会话数\" onfocus=\"this.value=''\" onblur=\"if(this.value==''){this.value='请输入最大会话数'}\"/></span>"+
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
						    			   Util.ajax.postJson('front/sh/media!execute?uid=maxConcurrent07',{"id":item.data.id},$.proxy(function(jsonData,status){
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
				page:{
					perPage:10,     //每页显示多少条记录
					align:'left',   //分页条对齐方式
				},
				data:{
					url:'front/sh/media!execute?uid=maxConcurrent08'
				}
		};
		this.list = new Compts.List(config);
		search.call(this);
	}
	
	var search = function(){
		var orgaId = $el.find("#department :selected").val();
		var orgaCode = $el.find("#department :selected").attr("orgacode");
		var mediaTypeId = $el.find("#mediaTypeId :selected").val();
		var staffId = $el.find("#staffId").val();
		var relevance = $el.find("#relevance").is(':checked');
		if(staffId==""&&orgaId==""){
			showTips("warn","部门名称或账户ID必须至少选择一个！");
			return;
		}
		if(staffId!=""&&!/^\w+$/g.test(staffId)){
			showTips("warn","请输入正确的员工账号！");
			return;
		}
		if(staffId!=""){
			var isContinue = false;
			var isChecked = null;
			if(relevance==true){
				isChecked = "1";
			}else{
				isChecked = "0";
			}
			//当前查询条件中员工账号和部门是否匹配，不匹配则不查询
			Util.ajax.postJson('front/sh/media!execute?uid=transfer011',{"orgaCode":orgaCode,"staffState":'1',"isChecked":isChecked},$.proxy(function(jsonData,status){
				if(status){
					$.each(jsonData.beans,function(index,bean){
						if(staffId == bean.staffId){
							isContinue = true;
						}
					});
				}else{
					showTips("warn","查询部门员工信息异常");
				}
			},this),true);
			if(isContinue==false){
				showTips("warn","该员工不属于该部门！");
				return;
			}
		}
		var result = {
				"orgaId":orgaId,
				"orgaCode":orgaCode,
				"mediaTypeId":mediaTypeId,
				"staffId":staffId,
				"relevance":relevance
		};
		this.list.search(result);
		var _list = this.list;
		_list.on("success",function(result){
			var total=_list.total;
			var content='共'+total+'条记录';
			$('#totalNum',$el).html(content);
		})
	}
	
	//新增部门最大会话数
	var addMax = function(){
		_index.showDialog({
			title:'新增人员最大会话数',   //弹出窗标题
			url:'js/comMenu/maxConcurrent/addStaffMax',    //要加载的模块
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
 			   Util.ajax.postJson('front/sh/media!execute?uid=maxConcurrent07',{"ids":ids},$.proxy(function(jsonData,status){
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