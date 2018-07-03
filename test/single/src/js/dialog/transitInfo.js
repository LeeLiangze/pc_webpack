define([
	'Util',
	'../../tpl/comMenu/transitInfo/transitInfo.tpl',
	'../../assets/css/comMenu/transitInfo/transitInfo.css'
	],   
	function(Util,tpl){
		//系统变量-定义该模块的根节点
		var $el;
		var _index;
		var _options;
		var initialize = function(index,options){
		    $el = $(tpl);	
		    _index = index;
	    	_options = options;
	        //业务相关代码	       
	        eventInit();//初始化按钮
	        errorCode();//从数据字典加载数据
	        parameterProcess();//获取传入数据显示到页面上
	        //将根节点赋值给接口
	        this.content = $el;       
		};
		
		//初始化按钮事件
		var eventInit = function(){
			$el.on('click','#transitInfo-affirm', $.proxy(transitInfo,this));
			$el.on('click','#transitInfo-condition-finalStatus_1', $.proxy(finalStatus_1,this));
			$el.on('click','#transitInfo-condition-finalStatus_2', $.proxy(finalStatus_2,this));
			
		}
		
		//设置确定按钮方法
		var transitInfo=function(){
			//组装入参数组
			var finalStatus = $("input[name=transitInfo-condition-finalStatus]:checked").val();//操作最终状态
			var failId = "1";
			//当转接结果为正确是，错位码为1，否则才为其他的
			if(finalStatus != "1"){
				var failId = $("#transitInfo-condition-failId",$el).val();//错误原因码
			}
			if(failId == "-1"){
				_index.popAlert("请选择一个错误原因！");
				return;
			}
			var data = {
					"serialNo":_options.serialNo,//呼叫日志流水号
					"operId":_options.operId,//操作id
					"status":_options.status,//操作状态
					"finalStatus":finalStatus,//操作最终状态
					"failId":failId
	          };
			Util.ajax.postJson('front/sh/logs!execute?uid=ngcslog003',data,function(json,status){});
			destroyDialog();//销毁弹窗
		}
		
		//单选框选中方法
		var finalStatus_1=function(){
			$el.find("#transitInfo-condition-failId").attr("disabled",true);
			document.getElementById("transitInfo-condition-failId").value = "-1";
		}
		var finalStatus_2=function(){
			$el.find("#transitInfo-condition-failId").removeAttr("disabled");
		}
		
		//从数据字典获取错误原因码
		var errorCode=function(){
			//广西 gxytck
			//河北 heytck
			//从现网中获取现网标识
			var serviceTypeId = _index.CTIInfo.serviceTypeId;
			if(serviceTypeId != "HEYTCK" && serviceTypeId != "heytck"){
				//目前除河北的外其他的都默认为广西的
				serviceTypeId = "gxytck";
			}
			Util.ajax.postJson("front/sh/popUp!execute?uid=datadict001",{"typeId":"NGCS."+serviceTypeId+".TRANSFER.ERRORmSG"},function(jsonData,status){
				if(status){
					//获取数字字典中的内容
					var errorList = jsonData.beans;
					//遍历数据字典动态加载到下拉框中
					var options = "";
					for(var i = 0; i < errorList.length; i++){
						options = '<option value="'+errorList[i].value+'">'+errorList[i].name+'</option>';
						$("#transitInfo-condition-failId",$el).append(options);
					}
				}
			});
			//加载完成后，因为单选框默认为成功状态，所以默认禁用错误原因的下拉框
			$el.find("#transitInfo-condition-failId").attr("disabled",true);
		}
		
		//获取传入参数，并显示到页面上
		var parameterProcess = function(){
			//获取出入参数
			var userName = _options.userName;//客户姓名
			var subsNumber = _options.subsNumber;//受理号码
			var transferMsg = _options.transferMsg;//转接信息
			//将获取的参数显示到页面上
			$("#transitInfo-clientele-name",$el).val(userName);
			$("#transitInfo-clientele-number",$el).val(subsNumber);
			$("#transitInfo-linkInfo-content",$el).val(transferMsg);
		}
		
		//销毁弹出框
		var destroyDialog = function(){
			_index.destroyDialog();
		}
		return initialize;
});
