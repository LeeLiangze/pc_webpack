define([ 'Util',
         'Compts', 
         '../../index/constants/mediaConstants',
         '../../log/managementLog',
         '../../../tpl/comMenu/rest/rest.tpl',
         '../../../assets/css/comMenu/rest/rest.css'],
function(Util,Compts,Constants,ManagementLog,tpl) { 
	var $el, _index, listW, restTime, failId, status_log;
	var initialize = function(indexModule) {  
		$el = $(tpl);	
		_index = indexModule;
		//ip = _index.CTIInfo.IP;
        //port = _index.CTIInfo.port;
        //opserialNo = _index.serialNumber.getSerialNumber();
        //targetAgentId = _index.getUserInfo().staffId;
		listInit();
		initEvent();
		this.content = $el;
	}
	var initEvent = function() {
		//$el.on("click", "#rest_time_commit", $.proxy(restTimeCommit, this));
		//$el.on("click", "#rest_time_canel", $.proxy(restClose, this));
		$el.on("click", "#rest_time_commit", restTimeCommit);
		$el.on("click", "#rest_time_canel", restClose);
	} 
	
	//休息https://'+ip+':'+port+'/ccacs/ws/quality/forcechangestate
	
	var   restTimeCommit = function(){
		var status = $(".TimeTilte").text();
		if(status == "忙碌"){
			_index.popAlert("示忙状态下不允许请求休息!");
			return;
		}
        var  proxyIP = _index.CTIInfo.ProxyIP;//代理IP
        var  proxyPort = _index.CTIInfo.ProxyPort;//代理端口
        var  ip = _index.CTIInfo.IP;
		var  port = _index.CTIInfo.port;
		var  isDefault = _index.CTIInfo.isDefault;//缺省业务标志值
		var  ctiId = _index.CTIInfo.CTIId;
		var  opserialNo = _index.serialNumber.getSerialNumber()
        var  signOutUrl = '';
		if(isDefault == "1"){//此种情况走nginx代理
			sign_url= Constants.CCACSURL+proxyIP+":"+proxyPort+"/ccacs/"+ctiId+"/ws/agent/setagentstate";
    	}else{                                 
    		sign_url= Constants.CCACSURL+ip+":"+port+"/ccacs/ws/agent/setagentstate";//跨域直连
    	};
    	if(_index.queue.browserName==="IE"){ 
    		$.ajax({  
    			url :sign_url,
    			type : 'post',  
    			timeout : 20000,
    			dataType:"json",
    			crossDomain: true,
    			async:true,
    			contentType:"application/json; charset=utf-8",
    			data:JSON.stringify({State:8,opserialNo:opserialNo,restTime:restTime,flag:1}),
    			success:function(data) {
    				failId = data.result;
    				var resultMsg;
    				if(data.result =="0"){
    					_index.popAlert("休息请求成功","休息");
    					resultMsg = "休息请求成功";
    					_index.comMenu.comUI.startRest();
    					//_index.comMenu.comUI.setAppointedBtnEnabled("freeStatusBtn",false);
    					//_index.comMenu.comUI.setAppointedBtnEnabled("restBtn",false);
    					var arr = ["freeStatusBtn","callOutBtn"];
  					   	_index.comMenu.comUI.setAppointedMoreBtnEnabled(arr,false);
  					   	_index.comMenu.comUI.setAppointedIcont("freeStatusBtn","#cccccc");
    					_index.destroyDialog();
    					status_log='1';
    	    			mLogInfo.call(this);	
    				}else{
//  		    					resultMsg=_index.header.communication.ErrorcodeSearch(data.result,"休息请求失败");
    					_index.popAlert("休息请求失败","休息");
    					resultMsg = "休息请求失败";
    					var errorcodeResultMsg=_index.ErrorcodeSearch.errorcodeSearch(data.result);
			            _index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode); 
			            //var arr = ["freeStatusBtn","callOutBtn"];
  					   	//_index.comMenu.comUI.setAppointedMoreBtnEnabled(arr,true);
    					status_log='0';
    	    			mLogInfo.call(this);
    				}

    				var paramsToProvince = {
    						"resultCode" : data.result,
    						"resultMessage" : resultMsg,
    						"reserved1" : "",
    						"reserved2" : "",
    						"reserved3" : ""
    				};
    				_index.postMessage.sendToProvince("setagentstate8", paramsToProvince);

    			},
    			errorCallBack:function(jqXHR,textStatus,errorThrown){//失败的回调函数
    				_index.popAlert("休息请求失败");
    				var errorParams = {
    						"XMLHttpRequest":jqXHR,
    						"textStatus":textStatus,
    						"errorThrown":errorThrown
    				};
    			}
    		});
    	}else{
    		$.ajax({  
    			url :sign_url,
    			type : 'post',  
    			timeout : 20000,
    			dataType:"json",
    			crossDomain: true,
    			xhrFields: {
    				withCredentials: true
    			},
    			async:true,
    			contentType:"application/json; charset=utf-8",
    			data:JSON.stringify({State:8,opserialNo:opserialNo,restTime:restTime,flag:1}),
    			success:function(data) {
    				failId = data.result;
    				var resultMsg;
    				if(data.result =="0"){
    					_index.popAlert("休息请求成功","休息");
    					resultMsg = "休息请求成功";
    					_index.comMenu.comUI.startRest();
    					var arr = ["freeStatusBtn","callOutBtn"];//351-8事件没推推来时,按钮先置灰
  					   	_index.comMenu.comUI.setAppointedMoreBtnEnabled(arr,false);
  					   	_index.comMenu.comUI.setAppointedIcont("freeStatusBtn","#cccccc");
    					//_index.comMenu.comUI.setAppointedBtnEnabled("freeStatusBtn",false);
    					//_index.comMenu.comUI.setAppointedBtnEnabled("restBtn",false);
    					_index.destroyDialog();
    					status_log='1';
    	    			mLogInfo.call(this);
    				}else{
//  		    					resultMsg=_index.header.communication.ErrorcodeSearch(data.result,"休息请求失败");
    					_index.popAlert("休息请求失败","休息");
    					resultMsg = "休息请求失败";
    					var errorcodeResultMsg=_index.ErrorcodeSearch.errorcodeSearch(data.result);
			            _index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);
			            //var arr = ["freeStatusBtn","callOutBtn"];
  					   	//_index.comMenu.comUI.setAppointedMoreBtnEnabled(arr,true);
    					status_log='0';
    	    			mLogInfo.call(this);
    				}

    				var paramsToProvince = {
    						"resultCode" : data.result,
    						"resultMessage" : resultMsg,
    						"reserved1" : "",
    						"reserved2" : "",
    						"reserved3" : ""
    				};
    				_index.postMessage.sendToProvince("setagentstate8", paramsToProvince);

    			},
    			errorCallBack:function(jqXHR,textStatus,errorThrown){//失败的回调函数
    				_index.popAlert("休息请求失败");
    				var errorParams = {
    						"XMLHttpRequest":jqXHR,
    						"textStatus":textStatus,
    						"errorThrown":errorThrown
    				};
    			}
    		});
    	}
        
    };
        
        
        
        
/*	var restTimeCommit = function(){
		
		
		$.ajax({ 
                	    		url : sign_url ,
                	    		type : 'post', 
                	    		data : JSON.stringify(data),
                	    		crossDomain:true,
                	    		xhrFields:{
                	    			withCredentials:true
                	    		},
                	    		contentType:"application/json; charset=utf-8",
                	    		success : function(json) {
	                	    		if(json.result=='0'){
	                	    			_index.clientInfo.timerWait.startTime().start();
	   						        }
   					         	}
                	    	});
		
		
		
		var config = {
	            uri:'https://'+ip+':'+port+'/ccacs/ws/quality/forcechangestate',//'ws/agent/setagentstate/'
	            timeout:20000,//默认为 20000。如果超时时长不是 20000，则需要传递该参数。
	            requestData:{"State":'8',"opserialNo":opserialNo,"targetAgentId":targetAgentId,restTime:restTime},//请求参数
	            async:true,//默认值为 true 异步。如果需要同步，则需要传递该参数为false
	            successCallBack:function(data){//成功的回调函数
	            	if(data.result =="0"){
							   _index.popAlert("休息请求成功","休息");
							   _index.comMenu.comUI.setAppointedInnerText("RestBtn","结束休息");
							   _index.destroyDialog();
//							   _index.header.communication.recordCallCTILog("ws/agent/setagentstate/",{"State":'8',"restTime":restTime},data,"休息成功");
				    		}else{
				    			resultMsg=_index.header.communication.ErrorcodeSearch(data.result,"休息请求失败");
					    		_index.popAlert(resultMsg,"休息");
//					    		_index.header.communication.setValue("RestType","EndRest");
//					    		_index.header.communication.recordCallCTILog("ws/agent/setagentstate/",{"State":'8',"restTime":restTime},data,"休息失败");
				    		}
	            },
	            errorCallBack:function(jqXHR,textStatus,errorThrown){//失败的回调函数
		    		_index.popAlert("休息请求失败");
//	            	_index.header.communication.setValue("RestType","EndRest");
	            	var errorParams = {
	            			"XMLHttpRequest":jqXHR,
	            			"textStatus":textStatus,
	            			"errorThrown":errorThrown
	            	};
//	            	_index.header.communication.recordCallCTILog("ws/agent/setagentstate/",{"State":'8',"restTime":restTime},errorParams,"网络异常,休息失败");
	            }
	         };
	      //发起调用
		_index.ctiInit.postCTIRequest(config);
		
	}*/
       
	var restClose = function(){
		/*_index.header.communication.setValue("RestType","EndRest");
		var status = comUI.getButtonStatus("AgentStatus");
		if(status == "Tidying"){
    		$("#jstime_id").css('display','block');
		    }*/
		_index.destroyDialog();
	}
	//初始化list
	var listInit = function(){  
        var config = {
                el:$('#rest_time_all',$el)[0],
                field:{ 
                	boxType:'radio',
                    key:'id',
                    items:[  
                        { text:'',name:'name',click:function(e,item){
                        	//restTime=item.data.value;  
                        	restTime = item.substring(0,item.length-2)*60+'';
                        }} 
                    ]
                },  
                data:{ 
                    //url:'front/sh/common!execute?uid=datadict002&typeId=RELEASE.REASON'
                    url:'front/sh/common!execute?uid=datadict007&typeId=REST.TIME'
                }
            };
          var list = new Compts.List(config); 
//          var parme = {"typeId":"RELEASE.REASON"};
//          list.search(parme); 
          listW = list.search({});
          list.on('success',function(result){
        	  $('#rest_time_all .sn-list .sn-list-table.sn-table',$el).css('height','150px');
        	  $('#rest_time_all',$el).find('tbody').find('tr').eq(0).addClass('selected');
        	  restTime='120';//默认休息时间为120秒
          });
    }; 
	//添加管理日志
	var  mLogInfo= function(){
		var mLog = new ManagementLog();
		mLog.setIsExt(true);
		mLog.setOperator(_index.getUserInfo()['staffId']);//操作员工帐号
		mLog.setOperBeginTime(_index.utilJS.getCurrentTime());
		mLog.setOperEndTime(_index.utilJS.getCurrentTime());
		mLog.setOperId("022");
		mLog.setStatus(status_log);
		mLog.setServiceTypeId(_index.CTIInfo.serviceTypeId);
		mLog.setReasonId(failId);
		mLog.logSavingForTransfer(mLog);
	}
	return initialize;
});