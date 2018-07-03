/**
 * 最大会话数设置
 * peishuxian
 */
define(['Util',
        '../../index/constants/mediaConstants',
        '../../../tpl/comMenu/maxConcurrent/addStaffMax.tpl',
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
		$el.on('change','#staffId', $.proxy(getInfoByStaffId,this));
		$el.on('change','#staffId', $.proxy(avoidConflict,this));
		
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
	
	//查询人员信息
	var getInfoByStaffId = function(){
		var staffId = $el.find("#staffId").val();
		if(!/^\w+$/g.test(staffId)){
			showTips("warn","请输入正确的员工账号！");
			return;
		}
		Util.ajax.postJson('front/sh/media!execute?uid=transfer011',{"staffId":staffId,"staffState":'1'},$.proxy(function(jsonData,status){
			if(status){
				if(jsonData.beans.length>0){
					var info = jsonData.beans[0];
					$el.find("#staffName").html(info.staffName);
					$el.find("#department").html(info.orgaName);
					//判断该管理员是否有权限设置该员工账号
					var flag = false;
					$.each(_params,function(index,bean){
						if(info.orgaId==bean.deptId){
							flag = true;
						}
					});
					if(flag==false){
						showTips("warn","没有权限设置员工账号:"+staffId);
						$el.find("#staffId").focus();
					}
				}else{
					showTips("warn","员工账号:"+staffId+"不存在或者已离职。");
					$el.find("#staffId").focus();
				}
			}else{
				showTips("warn","查询员工信息异常");
				$el.find("#staffId").focus();
			}
		},this));
	}
	
	//查询部门已设置的媒体类型的最大会话数，避免重复设置
	var avoidConflict = function(){
		$el.find("[name=\"mediaTypeId\"]:checkbox").removeAttr("checked");
		$el.find("[name=\"mediaTypeId\"]:checkbox").css("display","");
		$el.find("#mediaTypeName").val("");
		var staffId = $el.find("#staffId").val();
		if(staffId!=""){
			Util.ajax.postJson('front/sh/media!execute?uid=maxConcurrent08',{"staffId":staffId},$.proxy(function(jsonData,status){
				$el.find("[name=\"mediaTypeId\"]:checkbox").removeAttr("disabled");
				if(status){
					if(jsonData.beans.length>0){
						$.each(jsonData.beans,function(index,bean){
							$el.find("[name=\"mediaTypeId\"]:checkbox[value=\""+bean.mediaTypeId+"\"]").css("display","none");
						});
					}
				}else{
					showTips("warn","网络异常，查询不到员工是否已设置");
					$el.find("#staffId").focus();
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
		var staffId = $el.find("#staffId").val();
		if(staffId==""){
			showTips("warn","请输入员工账号！");
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
				"staffId":staffId,
				"mediaTypeIds":mediaTypeIds,
				"maxConcurrent":maxConcurrent
		}
		Util.ajax.postJson('front/sh/media!execute?uid=maxConcurrent05',params,$.proxy(function(jsonData,status){
			if(status){
				resetForm();
				showTips("success","新增人员最大会话数成功！");
			}else{
				showTips("warn","新增人员最大会话数失败！");
			}
		},this));
	}
	
	//清空
	var resetForm = function(){
		$el.find("#staffId").val("");
		$el.find("#staffName").html("");
		$el.find("#department").html("");
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