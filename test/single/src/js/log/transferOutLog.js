/**
 * @desc  用户资费信息
 */
define(['Util'],function(Util){
    var transferOutLog=function(){
    	
    	
    	/*
    	isExt         	true:有，false无      true:有，false无
    	serialNo        String         呼叫流水号
    	contactId       String          接触编号
    	operator      	String          呼叫操作员工账号(非空)
    	operBeginTime   String          呼叫操作开始时间(入参格式必须为：2017-02-16 11:11:54；非空)
    	operId       	String          操作ID(非空)
    	serviceTypeId   String          业务类型ID(非空)
    	operEndTime     String          操作结束时间(入参格式必须为：2017-02-16 11:11:54)
    	
    	status        	String          操作状态(非空)
    	callerNo     	String          主叫号码
    	accessCode      String          接入码
    	subsNumber      String          受理号码
    	failId       	String          失败原因码
    	destOperator    String          目的操作员账号
    	sourceSkillId   String          原技能队列ID
    	sourceSkillName String          原技能队列名称
    	
    	destSkillId     String      	目的技能队列ID
    	destSkillName   String   		目的技能队列名称
    	sourceDesc      String       	操作同步信息
    	finalStatus     String  		操作最终状态
    	transferMode    String        	转移模式
    	
    	transferCode    String        	转移码
    	digitCode       String       	按键路由
    	flowId          String         	流程ID
    	flowName        String          流程名称
    	flowFullName    String       	流程全路径
    	
    	flowCityCode    String        	流程地市编码
    	flowCityName    String        	流程地市名称
    	originalCallerNo  String          原始主叫
    	*/
    	/**
    	 * @param userName
    	 */
    	this.isExt         	 =  "";
    	this.serialNo        =  "";
    	this.contactId       =  "";
    	this.operator      	 =  "" ;
    	this.operBeginTime   =  "" ;
    	this.operId       	 =  "" ;
    	this.serviceTypeId   =  "" ;
    	this.operEndTime     =  "" ;
    	this.status        	 =  "" ;
    	this.callerNo     	 =  "" ;
    	this.accessCode      =  "" ;
    	this.subsNumber      =  "" ;
    	this.failId       	 =  "" ;
    	this.destOperator    =  "" ;
    	this.sourceSkillId   =  "" ;
    	this.sourceSkillName =  "" ;
    	this.destSkillId     =  "" ;
    	this.destSkillName   =  "" ;
    	this.sourceDesc      =  "" ;
    	this.finalStatus     =  "" ;
    	this.transferMode    =  "" ;
    	this.transferCode    =  "" ;
    	this.digitCode       =  "" ;
    	this.flowId          =  "" ;
    	this.flowName        =  "" ;
    	this.flowFullName    =  "" ;
    	this.flowCityCode    =  "" ;
    	this.flowCityName    =  "" ;
    	this.originalCallerNo=  "" ;
    };
    //向外暴漏的方法，可被外部调用
    transferOutLog.prototype = {
    		setIsExt:function(isExt)
    		{
    			this.isExt = isExt; 
    		},
    		getIsExt:function()
    		{
    			return this.isExt; 
    		},
    		setSerialNo:function(serialNo)
    		{
    			this.serialNo = serialNo; 
    		},
    		getSerialNo:function()
    		{
    			return this.serialNo; 
    		},
    		setContactId:function(contactId)
    		{
    			this.contactId = contactId; 
    		},
    		getContactId:function()
    		{
    			return this.contactId; 
    		},
    		setOperator:function(operator)
    		{
    			this.operator = operator; 
    		},
    		getOperator:function()
    		{
    			return this.operator; 
    		},
    		setOperBeginTime:function(operBeginTime)
    		{
    			this.operBeginTime = operBeginTime; 
    		},
    		getOperBeginTime:function()
    		{
    			return this.operBeginTime; 
    		},
    		setOperId:function(operId)
    		{
    			this.operId = operId; 
    		},
    		getOperId:function()
    		{
    			return this.operId; 
    		},
    		setServiceTypeId:function(serviceTypeId)
    		{
    			this.serviceTypeId = serviceTypeId; 
    		},
    		getServiceTypeId:function()
    		{
    			return this.serviceTypeId; 
    		},
    		setOperEndTime:function(operEndTime)
    		{
    			this.operEndTime = operEndTime; 
    		},
    		getOperEndTime:function()
    		{
    			return this.operEndTime; 
    		},
    		setStatus:function(status)
    		{
    			this.status = status; 
    		},
    		getStatus:function()
    		{
    			return this.status; 
    		},
    		setCallerNo:function(callerNo)
    		{
    			this.callerNo = callerNo; 
    		},
    		getCallerNo:function()
    		{
    			return this.callerNo; 
    		},
    		setAccessCode:function(accessCode)
    		{
    			this.accessCode = accessCode; 
    		},
    		getAccessCode:function()
    		{
    			return this.accessCode; 
    		},
    		setSubsNumber:function(subsNumber)
    		{
    			this.subsNumber = subsNumber; 
    		},
    		getSubsNumber:function()
    		{
    			return this.subsNumber; 
    		},
    		setFailId:function(failId)
    		{
    			this.failId = failId; 
    		},
    		getFailId:function()
    		{
    			return this.failId; 
    		},
    		setDestOperator:function(destOperator)
    		{
    			this.destOperator = destOperator; 
    		},
    		getDestOperator:function()
    		{
    			return this.destOperator; 
    		},
    		setSourceSkillId:function(sourceSkillId)
    		{
    			this.sourceSkillId = sourceSkillId; 
    		},
    		getSourceSkillId:function()
    		{
    			return this.sourceSkillId; 
    		},
    		setSourceSkillName:function(sourceSkillName)
    		{
    			this.sourceSkillName = sourceSkillName; 
    		},
    		getSourceSkillName:function()
    		{
    			return this.sourceSkillName; 
    		},
    		setDestSkillId:function(destSkillId)
    		{
    			this.destSkillId = destSkillId; 
    		},
    		getDestSkillId:function()
    		{
    			return this.destSkillId; 
    		},
    		setDestSkillName:function(destSkillName)
    		{
    			this.destSkillName = destSkillName; 
    		},
    		getDestSkillName:function()
    		{
    			return this.destSkillName; 
    		},
    		setSourceDesc:function(sourceDesc)
    		{
    			this.sourceDesc = sourceDesc; 
    		},
    		getSourceDesc:function()
    		{
    			return this.sourceDesc; 
    		},
    		setFinalStatus:function(finalStatus)
    		{
    			this.finalStatus = finalStatus; 
    		} ,
    		getFinalStatus:function()
    		{
    			return this.finalStatus; 
    		},
    		setTransferMode:function(transferMode)
    		{
    			this.transferMode = transferMode; 
    		},
    		getTransferMode:function()
    		{
    			return this.transferMode; 
    		},
    		setTransferCode:function(transferCode)
    		{
    			this.transferCode = transferCode; 
    		},
    		getTransferCode:function()
    		{
    			return this.transferCode; 
    		},
    		setDigitCode:function(digitCode)
    		{
    			this.digitCode = digitCode; 
    		},
    		getDigitCode:function()
    		{
    			return this.digitCode; 
    		},
    		setFlowId:function(flowId)
    		{
    			this.flowId = flowId; 
    		},
    		getFlowId:function()
    		{
    			return this.flowId; 
    		},
    		setFlowName:function(flowName)
    		{
    			this.flowName = flowName; 
    		},
    		getFlowName:function()
    		{
    			return this.flowName; 
    		},
    		setFlowFullName:function(flowFullName)
    		{
    			this.flowFullName = flowFullName; 
    		},
    		getFlowFullName:function()
    		{
    			return this.flowFullName; 
    		},
    		setFlowCityCode:function(flowCityCode)
    		{
    			this.flowCityCode = flowCityCode; 
    		},
    		getFlowCityCode:function()
    		{
    			return this.flowCityCode; 
    		},
    		setFlowCityName:function(flowCityName)
    		{
    			this.flowCityName = flowCityName; 
    		},
    		getFlowCityName:function()
    		{
    			return this.flowCityName; 
    		},
    		setOriginalCallerNo:function(originalCallerNo)
    		{
    			this.originalCallerNo = originalCallerNo; 
    		},
    		getOriginalCallerNo:function()
    		{
    			return this.originalCallerNo; 
    		},
    		logSavingForTransfer:function(log) {
    			var logParam = {
    					  "isExt" : log.getIsExt(),
    	         		  "operator" :log.getOperator(),
    	         		  "operBeginTime" : log.getOperBeginTime(),
    	         		  "operEndTime" : log.getOperEndTime(),
    	         		  "operId" : log.getOperId(),
    	         		  "accessCode" : log.getAccessCode(),
    	         		  "subsNumber" : log.getSubsNumber(),
    	         		  "failId" : log.getFailId(),
    	         		  "destOperator" : log.getDestOperator(),
    	         		  "sourceSkillId" : log.getSourceSkillId(),
    	         		  "sourceSkillName" : log.getSourceSkillName(),
    	         		  "destSkillId" : log.getDestSkillId(),
    	         		  "destSkillName" : log.getDestSkillName(),
    	         		  "sourceDesc" : log.getSourceDesc(),
    	         		  "finalStatus" : log.getFinalStatus(),
    	         		  "transferMode" : log.getTransferMode(),
    	         		  "transferCode" : log.getTransferCode(),
    	         		  "digitCode" : log.getDigitCode(),
    	         		  "flowId" : log.getFlowId(),
    	         		  "flowName" : log.getFlowName(),
    	         		  "flowFullName" : log.getFlowFullName(),
    	         		  "serialNo" : log.getSerialNo(),
    	         		  "contactId" : log.getContactId(),
    	         		  "status" : log.getStatus(),
    	         		  "callerNo" : log.getCallerNo(),
    	         		  "flowCityCode" : log.getFlowCityCode(),
    	         		  "flowCityName" : log.getFlowCityName(),
    	         		  "originalCallerNo" : log.getOriginalCallerNo(),
    	         		  "serviceTypeId" : log.getServiceTypeId()
    			};
    			var retry = false;
    			Util.ajax.postJson("front/sh/logs!execute?uid=ngcslog001",logParam,function(json,status){
	         		 if(json.returnCode == 0){
	               			console.log("呼叫日志入库成功！");
	               			retry = false;
	               		}else{
	               			console.log("呼叫日志入库失败！");
	               			retry = true;
	               			var nums = 1;
	            			while(retry == true && nums < 4){//失败后进行重试
	            				setTimeout(function(){
	            					Util.ajax.postJson("front/sh/logs!execute?uid=ngcslog001",logParam,function(json,status){
	            		         		 if(json.returnCode == 0){
	            		               			console.log("呼叫日志入库成功！");
	            		               			retry = false;
	            		               		}else{
	            		               			console.log("呼叫日志入库失败！");
	            		               			retry = true;
	            		               		}
	            	    			});
	            				},3000*nums);
	            				nums++;
	            			}
	               		}
    			});
    			
				
    		}
    };
    return transferOutLog;
});
