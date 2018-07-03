define([
	'Util',
	'../../tpl/callHandle/CTIInfo/sipServerBtn.tpl',
	'../../assets/css/callHandle/CTIInfo/sipServerBtn.css'
	],   
	
	function(Util,tpl){
		//系统变量-定义该模块的根节点
		var $el;
		var _index;
		var _options;
		var jobNumberTabulationvalue;//获取下拉框列表的值
		var synJobNumber = new Array();//要同步的工号列表数组
		var workNoStart;//工号列表起始序号
		var workNoEnd;//工号列表结束序号
		var workNoScopes;//同步的工号列表范围
		var initialize = function(index,options){
		    $el = $(tpl);	
		    _index = index;
	    	_options = options;
	        //业务相关代码	       
	    	accountList();
	        eventInit();
	        //uploadScope();
	        //将根节点赋值给接口
	        this.content = $el;       
		};
		
		//初始化按钮事件
		var eventInit = function(){
			$el.on('click','#synchronization', $.proxy(synchronization,this));			
		}
		
		
		//设置同步按钮方法
		var synchronization=function(){
			jobNumberTabulationvalue = $("#jobNumberTabulation").val();//获取选取的工号列表的值
			if(jobNumberTabulationvalue == null || jobNumberTabulationvalue == ""){
				_index.popAlert('没有选择工号列表范围,不能同步!');
				return;
			}
			var temp = parseInt(jobNumberTabulationvalue) + 999;
			workNoScopes = jobNumberTabulationvalue + "," + temp;
			var data = {
					"id":_options.id,
					"ccid":_options.ccid,
					"lastMidfyStaffId": _options.lastMidfyStaffId,
					"ip":_options.ip,
					"port":_options.port,
					"vdnId":_options.vdnId,
					"workNoScopes":workNoScopes
	          };
			 Util.ajax.postJson('front/sh/common!execute?uid=cti010',data,function(json,status){
					 if(status){
						 alert(json.returnMessage);
					 } else {					           					  
						 alert("同步失败！");
					 }
			 	});
			 _index.popAlert('正在同步工号列表,请耐心等待!');
		}
		
		//查询工号列表范围
		var accountList = function(){
	        var data = {
					"id":_options.id,
					"ccid":_options.ccid,
					"lastMidfyStaffId": _options.lastMidfyStaffId,
					"ip":_options.ip,
					"port":_options.port,
	          };
			 Util.ajax.postJson('front/sh/common!execute?uid=cti012',data,function(json,status){
					 if(status){
						 workNoStart = json.bean.workNoScopes.workNoStart;
						 workNoEnd = json.bean.workNoScopes.workNoEnd;
						 uploadScope.call(this);
					 } else {					           					  
						 alert("获取VDN列表失败!");
					 }
			 	});
			 _index.popAlert('工号列表范围加载较慢,请耐心等待!');
		}
		//根据工号列表加载同步范围
		var uploadScope = function(){
			scopeNumber = Math.ceil((workNoEnd-workNoStart)/1000);
			for(var i = 0; i < scopeNumber; i++){				
				if(i == 0){
					var start = workNoStart+(i*1000);
					var end = workNoStart+(i*1000)+999;
					var options = '<option value="'+start+'">'+start+'-'+end+'</option>';
				}else if(i == scopeNumber-1 && i != 0){
					var start = workNoStart+(i*1000);
					var options = '<option value="'+start+'">'+start+'-'+workNoEnd+'</option>';
				}else{
					var start = workNoStart+(i*1000);
					var end = workNoStart+(i*1000)+999;
					var options = '<option value="'+start+'">'+start+'-'+end+'</option>';
				}
				$("#jobNumberTabulation",$el).append(options);
			
			}
			
		}
		
						
		//销毁弹出框
		var destroyDialog = function(){
			_index.main.destroyDialog();
		}
		
		return initialize;
});
