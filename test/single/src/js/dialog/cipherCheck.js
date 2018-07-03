define([
	'Util',
	'../callHandle/util/CallDataUtil',
	 '../index/constants/mediaConstants',
	'../../tpl/comMenu/cipherCheck/cipherCheck.tpl',
	'../../assets/css/comMenu/cipherCheck/cipherCheck.css'
	], 
	function(Util,CallDataUtil,mediaConstants,tpl){
		//系统变量-定义该模块的根节点
		var $el=null, _index=null, _options=null, _CallDataUtil=CallDataUtil,checkTypeInfo=null, gainAcptNumFlag="",//获取受理号码标志
		ivrJnupNum="",     //IVR接入号码
		specialId="",      //特定流程标志
		ivrPrskeyCdVal="",	//IVR按键代码值
		serialNo=null,callType=null,callingInfo=null,accessCode=null, flag=null,//转密码验证自动流程是否由transferCode和accessCode拼接而成 0：否；1：是
		serviceTypeId=null,subsNumber=null, contactId=null,operBeginTime=null, callerNo=null, staffId=null;
		var initialize = function(index,options){
			    $el = $(tpl);	
			    _index = index;			    
		    	_options = options;	
		    	serviceTypeId=_index.CTIInfo.serviceTypeId;
		    	operBeginTime=_index.utilJS.getCurrentTime();
		    	staffId=_index.getUserInfo().staffId;
		        //业务相关代码
		    	gainCallingInfo();
		        eventInit();		    			    			    	
		        //将根节点赋值给接口
		        this.content = $el;
		        listInit.call(this);
		        
		};
		
		//绑定点击事件
		var eventInit = function(){
			$el.on('click','#check', $.proxy(Check,this));
			$el.on('click','#close', $.proxy(Cancle,this));
			$el.on('click','input[name="verType"]',$.proxy(changeLable,this));
			
		}
        
		//在不同验证方式之间，更新有关验证信息的变量值
		var changeLable=function(){			
			var id=$el.find('input[name="verType"]:checked').attr("id");
			gainCongigInfo(id);
		
		}
		
		//验证类型的配置信息
		var gainCongigInfo=function(id){
			var  vldTitleNm ="";
			if(checkTypeInfo&&id!=""&&id!=undefined){
				$.each(checkTypeInfo,function(v,checkType){					
						if(checkType.serviceTypeId==id){
							vldTitleNm=checkType.inputTitleName;
							gainAcptNumFlag=checkType.acceptFlag;
							ivrJnupNum=checkType.ivrJnupNum;
							specialId=checkType.specialId;
							ivrPrskeyCdVal=checkType.ivrPressKey;
							if(vldTitleNm){
								$el.find('#label_').find('em').html(vldTitleNm);
								if(gainAcptNumFlag=="1"){								
									$el.find('.phoneNum').val(callerNo);
								}else{
									$el.find('.phoneNum').val("");
								}
							}
						}																
				});
			}			
		}
		//获取callingInfo
		var gainCallingInfo=function(){
			serialNo=_index.CallingInfoMap.getAudioActiveserialNo();
			callingInfo=_index.CallingInfoMap.get(serialNo);			
			if(callingInfo != undefined && callingInfo!=null){
				if(callingInfo.mediaType==mediaConstants.VOICE_TYPE){
					callerNo=callingInfo.getSubsNumber();
					contactId=callingInfo.getContactId();					
				}else{
					_index.popAlert("语音会话下才能进行密码验证,请切换到语音会话!");
					_index.destroyDialog();
					return;
				}				
			}else{
	        	return;
	        }
		}
		
		//信息验证
		var Check=function(){
			var id=$el.find('input[name="verType"]:checked').attr("id");
			var typeName = $el.find('input[name="verType"]:checked').attr("value");
			var callId;
			if(!id){
				return;
			}
            var transType="1";
            var transferCode=ivrJnupNum;
            subsNumber=$el.find('.phoneNum').val(); //获取验证的电话号码 
            var reserved = null;
            var verifyType = null;
            var cipCheckType = null;
            var operId = null;//操作ID 对应相应的流程名称
            if(serviceTypeId == "heytck"){
            	switch(id){
            	case "cipher":
            		cipCheckType = mediaConstants.CIPERCHECK_CIPERCHECK;//服务密码验证
            		reserved = "3";
                    verifyType = "1";
                    operId = mediaConstants.OPREID_CIPERCHECK;
            		break;
            	case "ownId":
            		cipCheckType = mediaConstants.CIPERCHECK_IDINFOCHECK;//身份证验证
            		reserved = "2";
                    verifyType = "4";
                    operId = mediaConstants.OPREID_IDINFOCHECK;
            		break;
            	case "widenet":
            		cipCheckType = mediaConstants.CIPERCHECK_WIDENETCHECK;//宽带客户身份证验证
            		operId = mediaConstants.OPREID_WIDENETCHECK;
            		break;
            	case "service":
            		cipCheckType = mediaConstants.CIPERCHECK_SERVICECHECK;//业务受理二次验证
            		operId = mediaConstants.OPREID_SERVICECHECK;
            		break;
            	default:
            		break;
            	}
            }else{
            	switch(id){
            	case "cipher":
            		cipCheckType = mediaConstants.CIPERCHECK_CIPERCHECK;//服务密码验证
                    operId = mediaConstants.OPREID_CIPERCHECK;
            		break;
            	case "ownId":
            		cipCheckType = mediaConstants.CIPERCHECK_IDINFOCHECK;//身份证验证
                    operId = mediaConstants.OPREID_IDINFOCHECK;
            		break;
            	case "widenet":
            		cipCheckType = mediaConstants.CIPERCHECK_WIDENETCHECK;//宽带客户身份证验证
            		operId = mediaConstants.OPREID_WIDENETCHECK;
            		break;
            	case "service":
            		cipCheckType = mediaConstants.CIPERCHECK_SERVICECHECK;//业务受理二次验证
            		operId = mediaConstants.OPREID_SERVICECHECK;
            		break;
            	default:
            		break;
            	}
            }
            var transferParam={
                	"typeId":specialId,      //转接标识  
                	"subsNumber":subsNumber,  //用户号码
                	"reserved" : reserved,
                	"verifyType" : verifyType,
                	"callId":serialNo          //UCID     	
                    };
            callingInfo.setCipCheckTypeMap(id,cipCheckType);
			switch(id){
			    case "manual":
//				     manualCheckIdInfo(phobeNum,IdNum);
			    	manualCheckIdInfo("","");
				break;
			    default:
			    	var result;
                   if(flag == "1"){
                	   result=_index.callDataUtil.setCallDataAndTransIvr(transType, accessCode, transferCode, transferParam);
                   }else{
                	   result=_index.callDataUtil.setCallDataAndTransIvr(transType, "", transferCode, transferParam);
                   }
		        if(result=="0"){
		        	_index.popAlert("转流程成功！");
		        	//将状态改为验证中
		        	_index.clientInfo.timerWait.startTime().end();	
		        	_index.clientInfo.timerWait.setStatus("验证中");
		        	_index.clientInfo.timerWait.startTime().start();
		        	//记录呼叫日志参数
//		        	var operEndTime=_index.utilJS.getCurrentTime();
		        	var param={
		        			"isExt":true,
		    				"serialNo":serialNo,
		    				"contactId":contactId,
		    				"operator":staffId,    //呼叫操作员工账号
		    				"operBeginTime":operBeginTime,
		    				"operId":operId,       //操作ID
		    				"serviceTypeId":serviceTypeId,
		    				"operEndTime":"",
		    				"status":"1",//0失败,1成功
		    				"callerNo":callerNo,
		    				"accessCode":accessCode,
		    				"subsNumber":subsNumber,
		    				"failId":"",
		    				"destOperator":'',//目的操作员帐号  
							"sourceSkillId":'',//原技能队列id   
							"sourceSkillName":'',//原技能队列名称 
							"destSkillId":'',//目的技能队列id  
							"destSkillName":'',//目的技能队列名称   
							"sourceDesc":'', //操作同步信息
							"finalStatus":'', //操作最终状态 -----------从哪里拿
							"transferMode":'',//转移模式？ 填入1234  还是 字符串-----------和转移码  确定一下
							"transferCode":ivrJnupNum,//转移码？指的是1234 吗----------
							"flowId":'', //流程id
							"flowName":typeName,//流程名称
							"flowFullName":'',//流程全路径
							"flowCityCode":'',//流程地市编码 
							"flowCityName":'',//流程地市名称？ 同上
							"originalCallerNo":''//原始主叫
		    			};
		        	Util.ajax.postJson("front/sh/logs!execute?uid=ngcslog001",param,function(json,status){
						if(status){
							console.log("转IVR成功,呼叫日志记录成功");
						}else{
							console.log("转IVR成功,呼叫日志记录失败");
						}
					});
		        	_index.destroyDialog();
		        }else{
		        	_index.popAlert("转流程失败");
		        	//记录呼叫日志参数
//		        	var operEndTime=_index.utilJS.getCurrentTime();
		        	var param={
		        			"isExt":true,
		    				"serialNo":serialNo,
		    				"contactId":contactId,
		    				"operator":staffId,    //呼叫操作员工账号
		    				"operBeginTime":operBeginTime,
		    				"operId":operId,       //操作ID
		    				"serviceTypeId":serviceTypeId,
		    				"operEndTime":'',
		    				"status":"0",  //0失败,1成功
		    				"callerNo":callerNo,
		    				"accessCode":accessCode,
		    				"subsNumber":subsNumber,
		    				"failId":result,
		    				"destOperator":'',//目的操作员帐号  
							"sourceSkillId":'',//原技能队列id   
							"sourceSkillName":'',//原技能队列名称 
							"destSkillId":'',//目的技能队列id  
							"destSkillName":'',//目的技能队列名称   
							"sourceDesc":'', //操作同步信息
							"finalStatus":'', //操作最终状态 -----------从哪里拿
							"transferMode":'',//转移模式？ 填入1234  还是 字符串-----------和转移码  确定一下
							"transferCode":ivrJnupNum,//转移码？指的是1234 吗----------
							"flowId":'', //流程id
							"flowName":typeName,//流程名称
							"flowFullName":'',//流程全路径
							"flowCityCode":'',//流程地市编码 
							"flowCityName":'',//流程地市名称？ 同上
							"originalCallerNo":''//原始主叫
		    			};
		        	Util.ajax.postJson("front/sh/logs!execute?uid=ngcslog001",param,function(json,status){
						if(status){
							console.log("转IVR失败,呼叫日志记录成功");
						}else{
							console.log("转IVR失败,呼叫日志记失败");
						}
					});
		        	_index.destroyDialog();
		        }	
			}			
		}
		//客服手动验证身份证信息
		var manualCheckIdInfo=function(phone,IdNum){
			_index.popAlert("手动验证身份证信息");
			_index.destroyDialog();
		}
		
	  //取消验证
		var Cancle=function(){
			_index.destroyDialog();
		}
						
        //初始化tab页
		var listInit=function(){
			var addrCheckType="";
			var validationTypeId = "";
			if(_options != undefined && _options != null && _options != ''){
				validationTypeId = _options.validationTypeId;
			}
			var data={
					"serviceTypeId":serviceTypeId,
					"validationTypeId":validationTypeId
			}
			Util.ajax.postJson("front/sh/callHandle!execute?uid=cipherCheck",data,function(json,status){
				if(status){
					accessCode=json.bean.accessCode;
					flag=json.bean.flag;
					checkTypeInfo=json.beans;
					for(i=0;i<json.beans.length;i++){
						var serviceTypeID=json.beans[i].serviceTypeId;
						var openStyle=json.beans[i].openStyle;
						if(validationTypeId != null && validationTypeId != ""){
							openStyle = "1";
						}
						if(serviceTypeID && openStyle == '1') {
							addrCheckType=addrCheckType+'<td><input type="radio" name="verType"  id="'+json.beans[i].serviceTypeId+'"value="'+json.beans[i].titleName+'"/><span>'+json.beans[i].titleName+'</span></td>';						
						}
					}
					$el.find("#checkType").append(addrCheckType);
					$el.find("#checkType input").eq(0).attr("checked","checked");
					var id=$el.find("#checkType input").eq(0).attr("id");		
					gainCongigInfo(id);
					
				}else{
					return;
				}
			});
		}	 
		 		 				
		return initialize;
});