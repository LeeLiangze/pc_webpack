/**
 * 最大会话数设置
 * peishuxian
 */
define(['Util',
        '../../index/constants/mediaConstants',
        '../../../tpl/comMenu/maxConcurrent/addDepartmentMax.tpl',
        '../../../assets/css/maxConcurrent/maxConcurrent.css'
        ],
        function(
        		Util,
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
		_params = params;
		eventInit();
		//将根节点赋值给接口
		this.content = $el;
	};
	
	var eventInit = function(){
		//绑定事件
		$el.on('click','#saveMax', $.proxy(insertMax,this));
		$el.on('click','#resetMax', function(){_index.destroyDialog();});
		$el.on('change','#department', $.proxy(avoidConflict,this));
		//构建部门下拉列表
		$el.find("#department").empty();
		var tempHTML = "<option value=\"\">请选择</option>";
		$.each(_params,function(index,bean){
			tempHTML += "<option value='"+bean.deptId+"'>"+bean.deptName+"</option>";
		});
		var html = "<select name='department'>" +tempHTML+"</select>";
		$el.find("#department").append(html);
		
		//构建媒体类型复选框
		Util.ajax.postJson('front/sh/media!execute?uid=mes008',{},$.proxy(function(jsonData,status){
			if(status){
				var html='';
				$.each(jsonData.beans,function(index,bean){
					if(mediaConstants.VOICE_TYPE!=bean.value&&mediaConstants.SHORT_MESSAGE_TYPE!=bean.value){
						html+='<tr><td><div><input name="mediaTypeId" disabled="disabled" type="checkbox" value="'+bean.value+'" mediaTypeName="'+bean.name+'" /></div></td><td>'+bean.name+'</td></tr>'
					}
				});
				$el.find("#mediaTypeId").append(html);
				$el.find("[name=\"mediaTypeId\"]").click(function(){clickCheckBox();});
			}
		},this));
	}
	
	//查询部门已设置的媒体类型的最大会话数，避免重复设置
	var avoidConflict = function(){
		$el.find("[name=\"mediaTypeId\"]:checkbox").removeAttr("checked");
		$el.find("[name=\"mediaTypeId\"]:checkbox").css("display","");
		$el.find("#mediaTypeName").val("");
		var orgaId = $el.find("#department :selected").val();
		if(orgaId!=""){
			Util.ajax.postJson('front/sh/media!execute?uid=maxConcurrent04',{"orgaId":orgaId},$.proxy(function(jsonData,status){
				$el.find("[name=\"mediaTypeId\"]:checkbox").removeAttr("disabled");
				if(status){
					if(jsonData.beans.length>0){
						$.each(jsonData.beans,function(index,bean){
							$el.find("[name=\"mediaTypeId\"]:checkbox[value=\""+bean.mediaTypeId+"\"]").css("display","none");
						});
					}
				}else{
					showTips("warn","网络异常，查询不到部门是否已设置");
				}
			},this),false);
		}
	}
	
	//点击复选框触发事件
	var clickCheckBox = function(){
		var mediaTypeNames = "";
		$el.find("[name=\"mediaTypeId\"]:checked").each(function(){
			mediaTypeNames+=$(this).attr("mediaTypeName")+";";
		});
		$el.find("#mediaTypeName").val(mediaTypeNames);
	}
	
	var insertMax = function(){
		var orgaId = $el.find("#department :selected").val();
		if(orgaId==""){
			showTips("warn","请选择部门！");
			
			return;
		}
		var mediaTypeIds = "";
		$el.find("[name=\"mediaTypeId\"]:checked").each(function(){
			mediaTypeIds+=$(this).val()+"*";
		});
		if(mediaTypeIds==""){
			showTips("warn","请选择媒体类型！");
			return;
		}
		var maxConcurrent = $el.find("#maxConcurrent").val();
		if(!/^\+?[1-9][0-9]*$/.test(maxConcurrent)){
			showTips("warn","最大会话数必须为非零正整数！");
			return;
		}
		var params = {
				"orgaId":orgaId,
				"mediaTypeIds":mediaTypeIds,
				"maxConcurrent":maxConcurrent
		}
		Util.ajax.postJson('front/sh/media!execute?uid=maxConcurrent01',params,$.proxy(function(jsonData,status){
			if(status){
				resetForm();
				showTips("success","新增部门最大会话数成功！");
			}else{
				showTips("warn","新增部门最大会话数失败！");
			}
		},this));
	}
	//清空
	var resetForm = function(){
		$el.find("#department option[value='']").attr("selected","selected");
		$el.find("[name=\"mediaTypeId\"]:checkbox").removeAttr("checked");
		$el.find("#mediaTypeName").val("");
		$el.find("#maxConcurrent").val("");
		
	}
	
	//提示信息 warn&success
	var showTips = function(status,tips){
		$el.find("#prompt").show();
		if(status=="warn"){
			$el.find("#prompt").css("color","red");
			$el.find("#prompt").text(tips);
		}
		if(status=="success"){
			$el.find("#prompt").css("color","green");
			$el.find("#prompt").text(tips);
		}
		setTimeout(function(){
			$el.find("#prompt").hide(500);
		},3000);
	}
	
	return initialize;
});