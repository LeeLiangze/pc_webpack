/**
 * by matengfei
 * 呼叫转出功能，展示可被转出人员的信息
 * */
define(['Util','../log/transferOutLog','../../tpl/communication/callHandle/transferOut/transferCall.tpl','Compts','../index/constants/mediaConstants','../../assets/css/comMenu/transferCall/transferCall.css'],
		function(Util,transferOutLog,tpl,Compts,Constants){
		var $el;
		var _index;
		var _options;
		var _list;
		var calledDigits='';//转出的被叫号码
		var status_log;
		var calledPersonList;//ajax 返回人员列表内容信息
		var calledPerson;	//可被转出人员
		var contactId;//获取当前活动呼叫的接触id
		var _callingInfo;//根据接触id 获取当前会话信息
		var transferOuts;//转出结果
		var mainCallOutNumber;//主叫号码
		var templ=tpl;
		var b;	//确定被叫号码是下拉框还是输入
		var transferMode;
		var failId;
		var initialize = function(index,options){
			_index=index;
			_options=options;
			//根据权限判断是下拉列表还是
			contactId=_index.CallingInfoMap.getActiveSerialNo();//获取当前活动呼叫的接触id
			_callingInfo = _index.CallingInfoMap.get(contactId);//根据接触id 获取当前会话信息
			if(typeof(_callingInfo)=='undefined'||_callingInfo==null){
				_index.destroyDialog(); 
				_index.popAlert("当前无通话,无法进行呼叫转出。");
				return;
				
			}
			
			if(index.ctiInit.AudioCallIds.getCallerPhoneNums().length < 1){
				if(index.CTIInfo.outgoingNo){
					var outgoingNo = index.CTIInfo.outgoingNo;
					var callerNums = outgoingNo.split(",");
					index.ctiInit.AudioCallIds.setCallerPhoneNums(callerNums);
				}
			}	
			
			var transferCallTemplate = Util.hdb.compile(templ);
			//初始化主叫号码
			var callcallerData = index.ctiInit.AudioCallIds.getCallerPhoneNums();
			//配置主叫号码
			var dataSource = {callOutMainNumber:callcallerData};//参数值{key：value}
			var transferCallHtml = transferCallTemplate(dataSource);
			$el=$(transferCallHtml);
			//initSysParam.call(this);
			
			//初始化事件，如果是客服代表主动发起，则不能进行释放转。
			initTransferMode.call(this);
			////初始化按钮事件
			initEvent.call(this);
			
			var  initSysParam=function(){
				Util.ajax.postJson("front/sh/common!execute?uid=s008",{moduleId:"102",cateGoryId:"102006"},function(jsonData,status){
					if(status){
						if(jsonData.beans[0]==undefined ||jsonData.beans[0]=="undefined" ){
							b=true;
							$el.find("#calledPerson").empty();
							var  tempHTML= "<div id='showInputNum'><span style='font-size:16px'>转出号码</span>&nbsp;&nbsp;&nbsp;&nbsp;<input type='text' style='width:200px;height:35px;border:1px solid black' id='inputNum' class='call-out-show-number call-out-show-number-panpel'/></div>";
						
							$el.find("#calledPerson").append(tempHTML);
						//处理	
							$el.on('click','.call-number-num',function(){
								var callNum = $.trim($(this).text());
								$(this).parents('.callout-box').find('.call-out-show-number-panpel').val(function(index,oldValue){
									return oldValue + callNum;
								})
							});
						}else
							{
							switch(jsonData.beans[0].value){
							//0 输入
							case Constants.TRANSFEROUTPARAM_INPUT:
								b=true;
								$el.find("#calledPerson").empty();
								var  tempHTML= "<div id='showInputNum'><span style='font-size:16px'>转出号码</span>&nbsp;&nbsp;&nbsp;&nbsp;<input type='text' style='width:200px;height:35px;border:1px solid black' id='inputNum' class='call-out-show-number call-out-show-number-panpel'/></div>";
							
								$el.find("#calledPerson").append(tempHTML);
							//处理	
								$el.on('click','.call-number-num',function(){
									var callNum = $.trim($(this).text());
									$(this).parents('.callout-box').find('.call-out-show-number-panpel').val(function(index,oldValue){
										return oldValue + callNum;
									})
								});
								break;
							case Constants.TRANSFEROUTPARAM_SELECT:
								b=false;
								//初始化时加载可被呼叫人员列表
								initcalledPersonList.call(this);
							}
							}
						
						//enter start
						setTimeout(function(){
							$('#inputNum',$el).focus();
							},0);
						$el.on('keydown',function(e){
							var event = (typeof event!= 'undefined') ? window.event : e;
					   		if(event.keyCode == 13){
					   			transferOut();
					   			//event.stopPropagation();
					   			window.event.returnValue = false;
					   		};
						});
				   		//enter end
					}
			});
			}
			
			initSysParam();
			
			this.content = $el;
			
		}
		
		//初始化事件   获取calledPerson列表
		var initcalledPersonList = function(){
	      	var config = {
					el : $('#calledPerson', $el), // 要绑定的容器
					label : '转出号码', // 下拉框单元左侧label文本
					name : 'name', // 下拉框单元右侧下拉框名称
					//disabled:disabled,
					url :'front/sh/callHandle!execute?uid=calledPersonList' // 数据源
	      	}
	     calledPersonList= new Compts.Select(config);
		}
		
		//初始化事件，如果是客服代表主动发起，则不能进行释放转。
		var initTransferMode=function(){
			//alert(_callingInfo.getCallType);
			//判断会话由谁主动发起      0：呼入  1：呼出
			if(_callingInfo.callType!='1'){
				var release = '<input type="radio"  name="transferMode" id="transferMode_1" value="释放转"/>释放转 &nbsp;   &nbsp; ';
				$el.find("#transferMode_2").before(release);
			}
		}
		//初始化按钮事件
		var initEvent = function() {
			$el.on("click", "#tranOut", $.proxy(transferBtn, this));
			$el.on("click","#cancel",$.proxy(cancelBtn,this));
		}
		//设置转出按钮方法
		var transferBtn=function(){
			transferOut();
		}
		
		//取消功能
	    var cancelBtn=function (){
	    	//在取消之前去除刷新
	    	_index.destroyDialog();    	
	    }
		//下拉列表方式转出
		var transferOut =function(){
			 //该处应该根据系统参数判断参数来源，是从下拉列表获取还是从数字键盘获取
			if(b){
				//输入
				calledDigits=$("#inputNum").val();
			}else{
				//下拉
				calledDigits=calledPersonList.getSelected('name');
			}
			var yz = /^[0-9]*$/;
			if(!yz.test(calledDigits)){
				_index.popAlert("请输入正确的号码!");
				return;
			}
			 if(calledDigits==''||calledDigits==undefined){
				
				_index.popAlert('转出号码不能为空!');
				return ;
			 }
			 
			//获取主叫号码
			mainCallOutNumber = $("#mainCallOutNum").val();
			 if(!yz.test(mainCallOutNumber)){
				 _index.popAlert('请确认主叫号码是否正确！');
				 return ;
			 }
			 if(mainCallOutNumber==''||mainCallOutNumber==undefined){
					_index.popAlert('主叫号码不能为空!');
					return ;
				 }
			 
				//设置CTIURL参数
				var CTIID = _index.CTIInfo.CTIId;
				var ip = _index.CTIInfo.IP;
				var port = _index.CTIInfo.port;
				var proxyIP = _index.CTIInfo.ProxyIP;
				var proxyPort = _index.CTIInfo.ProxyPort;
				var isDefault = _index.CTIInfo.isDefault;
				var URL = "";
				if(isDefault == "1"){//此情况走nginx代理
					URL = Constants.CCACSURL + proxyIP + ":" + proxyPort + "/ccacs/" + CTIID + "/ws/call/transout";
				}else{//跨域直连
					URL = Constants.CCACSURL + ip + ":" + port + "/ccacs/ws/call/transout";
				}
				
			var serialNum=_index.serialNumber.getSerialNumber();//获取随机数 以参数形式传到cti
			//获取通话信息(CTI的会话标识对象)
			 var time = _callingInfo.getCallIdTime();
	         var dsn = _callingInfo.getCallIdDsn();
	         var handle = _callingInfo.getCallIdHandle();
	         var server = _callingInfo.getCallIdServer();
	         var callId = {"time":time,"dsn":dsn,"handle":handle,"server":server};
			
			//获取转出的设备类型  值为5 的时候为外呼号码
			var calledDeviceType = Constants.CALLEDDEVICETYPE_OUTBOUND;
			
			//获取转出的类型 1.释放转 2成功转 3.通话转 4.三方转
			var transferMode_text=$("input[name=transferMode]:checked").val();
			switch(transferMode_text){
				case Constants.TRANSFERMODE_SUSPENDDESC:transferMode=Constants.TRANSFERMODE_SUSPEND;
				break;
				case Constants.TRANSFERMODE_SUCCESSDESC:transferMode=Constants.TRANSFERMODE_SUCCESS;
				break;
				case Constants.TRANSFERMODE_CALLINGDESC:transferMode=Constants.TRANSFERMODE_CALLING;
				_index.ctiInit.AudioCallIds.setIsInConference(true);
				break;
				case Constants.TRANSFERMODE_TOGETHERDESC:transferMode=Constants.TRANSFERMODE_TOGETHER;
				_index.ctiInit.AudioCallIds.setIsInConference(true);
				_index.ctiInit.AudioCallIds.setIsConferenceCalledNo(calledDigits);
				break;
				default: transferMode=-1;
				break;
			}
			
			if(transferMode==-1){
				_index.popAlert("请选择转出类型!");
				return ;
			}
			
			 var datas={
					 "opserialNo":serialNum,
					 "callId":callId,
					 "calledDeviceType":calledDeviceType,
					 "transferMode":transferMode,
					 "calledDigits":calledDigits,
					 "callerDigits":mainCallOutNumber
				 } 
			 
			 if(_index.queue.browserName==="IE"){  //注意index的
					//IE逻辑
				 $.ajax({
					 url:URL,
					 type : 'post', 
					 timeout : 20000,
					 async:true,
					 data : JSON.stringify(datas), 
					 crossDomain: true,
//					 xhrFields: {
//					 withCredentials: true
//					 },
					 contentType:"application/json; charset=utf-8",
					 success : function(jsonData) {
						 failId=jsonData.result;
					 if("0"==jsonData.result){
						 status_log='1';
					 _index.popAlert("呼叫转出请求成功,请等待响应.");
					 _index.destroyDialog(); 
					 logInfo.call(this);
					 }else{
						 status_log='0';
						 _index.popAlert("呼叫转出请求失败,"); 
					 logInfo.call(this);
					 }
					 },
					 error : function( XMLHttpRequest, textStatus, errorThrown) {
					 var errorParams = {
					 "XMLHttpRequest":XMLHttpRequest,
					 "textStatus":textStatus,
					 "errorThrown":errorThrown
					 }; 
					  console.log(errorParams);
					 } 
				 });
				}else{
					//其他浏览器逻辑
					 $.ajax({
						 url:URL,
						 type : 'post', 
						 timeout : 20000,
						 async:true,
						 data : JSON.stringify(datas), 
						 crossDomain: true,
						 xhrFields: {
						 withCredentials: true
						 },
						 contentType:"application/json; charset=utf-8",
						 success : function(jsonData) {
							 failId=jsonData.result;
						 if("0"==jsonData.result){
							 status_log='1';
						 _index.popAlert("呼叫转出请求成功,请等待响应.");
						 _index.destroyDialog(); 
						 logInfo.call(this);
						 }else{
							 status_log='0';
							 _index.popAlert("呼叫转出请求失败!"); 
						 logInfo.call(this);
						 }
						 },
						 error : function( XMLHttpRequest, textStatus, errorThrown) {
						 var errorParams = {
						 "XMLHttpRequest":XMLHttpRequest,
						 "textStatus":textStatus,
						 "errorThrown":errorThrown
						 }; 
						  console.log(errorParams);
						 } 
					 });
				}

			 return transferOuts;
		}
		
		var  logInfo= function(){
			//contactId=_index.CallingInfoMap.getActiveSerialNo();
			//_callingInfo = _index.CallingInfoMap.get(contactId);
			var operBeginTime=_callingInfo.callIdTime;//呼叫开始时间
			var operBeginTime=_index.utilJS.getCurrentTime();//呼叫开始时间
			var serialNo=_callingInfo.serialNo;//获取流水号
			var calledNo=_callingInfo.calledNo;//呼叫操作员工帐号
			var subsNumber=_callingInfo.subsNumber;//受理号码
			var operId='011';//操作id  
			var serviceTypeId=_callingInfo.serviceTypeId;//服务类型id
			//var operator= _index.CTIInfo.audioPhoneNum;//操作员工帐号
			var operator= _index.getUserInfo()['staffId'];//操作员工帐号
			var originalCallerNo=_callingInfo.callerNo;//原始主叫
			var callerNo = mainCallOutNumber;//主叫号码
			var accessCode = calledDigits;
			var transferMode_log;
			switch(transferMode){
				case '1' : transferMode_log=1;
					break;
				case '2' : transferMode_log=2;
				break;
				case '3' : transferMode_log=5;
				break;
				case '4' : transferMode_log=6;
				break;
			}
			var  myDate = new Date();
			var operEndTime=myDate.getFullYear()+"-"+(myDate.getMonth()+1)+"-"+myDate.getDate()+"  "+myDate.getHours()+":"+myDate.getMinutes()+":"+myDate.getSeconds();
			
			var tLog = new transferOutLog(); 
            tLog.setIsExt(true);//是否有扩展字段
            tLog.setSerialNo(serialNo);////获取流水号
            tLog.setContactId(contactId);//接触编号
            tLog.setOperator(operator);//操作员
            tLog.setOperBeginTime(operBeginTime);///操作开始时间
            tLog.setOperId(operId);//操作编号
            tLog.setServiceTypeId(serviceTypeId);//操作类型
            tLog.setOperEndTime(operEndTime);//操作结束时间
            tLog.setStatus(status_log);//操作状态
            tLog.setCallerNo(callerNo);//主叫号码
            tLog.setSubsNumber(subsNumber);//受理号码
            tLog.setFailId(failId);//失败原因码
            tLog.setTransferMode(transferMode_log);//转移模式
            tLog.setOriginalCallerNo(originalCallerNo);//原始主叫
            tLog.setAccessCode(accessCode);//接入码
            tLog.setDestOperator(calledDigits);//目的操作员帐号  
            tLog.logSavingForTransfer(tLog);
		}
		
		return initialize;
})