/**
 * 最大会话数设置
 * peishuxian
 */
define(['Util',
        'Compts',
        '../../../tpl/comMenu/maxConcurrent/maxConcurrent.tpl',
        '../../../assets/css/maxConcurrent/maxConcurrent.css'
        ],
        function(
        		Util,
        		Compts,
        		tpl
        		){
	
	//系统变量-定义该模块的根节点
	var _index = null;
	var $el = null;
	var _JParams = null;
	
	//系统变量-构造函数
	//如果该模块通过菜单打开，options参数等于当前模块在菜单中的配置；
	//如果该模块通过index.main.createTab方法打开，options参数等于createTab的第3个参数
	//tab 是当前选项卡对象
	var initialize = function(index, options, tabItem){
		$el = $(tpl);
		_index = index;
		eventInt();
		getJurisdiction();
		//将根节点赋值给接口
		this.content = $el;
	};

	var eventInt = function(){
		var config = {
				el:$el.find("#maxConcurrent"),  //要绑定的容器
				tabs:[  //选项卡内容设置
				        {
				        	title:'部门设置',   //选项卡标题
				        	click:function(e, tabData){ //选项卡单击事件
				        		require(['js/comMenu/maxConcurrent/departmentMax'],function(DepartmentMax){
									var departmentMaxTab = new DepartmentMax(_index,_JParams);
									tab.content(departmentMaxTab.content);
								});
				        	}
				        },
				        {
				        	title:'人员设置',
				        	click:function(e, tabData){ //选项卡单击事件
				        		require(['js/comMenu/maxConcurrent/staffMax'],function(StaffMax){
									var staffMaxTab = new StaffMax(_index,_JParams);
									tab.content(staffMaxTab.content);
								});
				        	}
				        }
				        ]
		}
		var tab = new Compts.Tab(config);
	}
	//获取该管理员所拥有的部门权限
	var getJurisdiction = function(){
		var staffId = _index.getUserInfo().staffId;
		var deptIds = "";
		var params = {
				"queryStaffId":staffId,
				"authId":"001004"
		};
		Util.ajax.postJson('front/sh/common!execute?uid=queryDataAuth',params,$.proxy(function(jsonData,status){
			if(status){
				$.each(jsonData.beans,function(index,bean){
					var deptId = bean.authObjectId
					deptIds+=deptId+"*";
				});
			}
		},this),true);
		Util.ajax.postJson('front/sh/media!execute?uid=queryDepartmentInfos',{"deptIds":deptIds},$.proxy(function(jsonData,status){
			if(status){
				_JParams = jsonData.beans;
			}
		},this),true);
	}
	return initialize;
});