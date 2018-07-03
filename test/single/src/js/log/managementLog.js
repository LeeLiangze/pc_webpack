define(['Util'],function(Util){
	
    var managementLog=function(){

    	/**
    	 * isExt				boolean		true:有，false无
    	 * operator				String 		操作人员
    	 * operBeginTime		String		操作开始时间
    	 * operEndTime			String		操作结束时间
    	 * operId				String		操作类型ID
    	 * operDuration			String		操作时长
    	 * destOperator			String		被操作员工
    	 * status				String		状态
    	 * serviceTypeId		String		业务类型ID
    	 * serialNo				String		呼叫流水号
    	 * contactId			String		接触编号
    	 * recordFilePath		String		录音文件路径
    	 * callerNo				String		主叫号码
    	 * subsNumber			String		受理号码 
    	 * sourceSkillId		String		原技能ID
    	 * sourceSkillName		String		原技能名称 
    	 * destSkillId			String		目的技能ID
    	 * destSkillName		String		目的技能名称 
    	 * reasonId				String		原因ID
    	 * **/

    	
		/*
		 * true:有，false无
		 */
		this.isExt =  ""; 
		/*
		 * 操作人员
		 */
		this.operator =  ""; 
		/*
		 * 操作开始时间
		 */
		this.operBeginTime =  "";
		/*
		 * 操作结束时间
		 */
		this.operEndTime =  ""; 
		/*
		 * 操作类型ID
		 */
		this.operId =  ""; 
		/*
		 * 操作时长
		 */
		this.operDuration =  ""; 
		/*
		 * 被操作员工
		 */
		this.destOperator =  ""; 
		/*
		 * 状态
		 */
		this.status =  ""; 
		/*
		 * 业务类型ID
		 */
		this.serviceTypeId =  ""; 
		/*
		 * 呼叫流水号
		 */
		this.serialNo =  ""; 
		/*
		 * 接触编号
		 */
		this.contactId =  ""; 
		/*
		 * 录音文件路径
		 */
		this.recordFilePath =  ""; 
		/*
		 * 主叫号码
		 */
		this.callerNo =  "";
		/*
		 * 受理号码
		 */
		this.subsNumber =  ""; 
		/*
		 * 原技能ID
		 */
		this.sourceSkillId =  ""; 
		/*
		 * 原技能名称
		 */
		this.sourceSkillName =  ""; 
		/*
		 * 目的技能ID
		 */
		this.destSkillId =  ""; 
		/*
		 * 目的技能名称
		 */
		this.destSkillName =  ""; 
		/*
		 * 原因ID
		 */
		this.reasonId =  ""; 
		
		
    };
    //向外暴漏的方法，可被外部调用
    managementLog.prototype = {
    		//
    		setIsExt : function(isExt)
    		{
    			this.isExt = isExt; 
    		} ,
    	    getIsExt :function()
    		{
    			return this.isExt; 
    		},
    		//
    		setOperator : function(operator)
    		{
    			this.operator = operator; 
    		} ,
    	    getOperator :function()
    		{
    			return this.operator; 
    		},
    		//
    		setOperBeginTime : function(operBeginTime)
    		{
    			this.operBeginTime = operBeginTime; 
    		} ,
    	    getOperBeginTime :function()
    		{
    			return this.operBeginTime; 
    		},
    		//
    		setOperEndTime : function(operEndTime)
    		{
    			this.operEndTime = operEndTime; 
    		} ,
    	    getOperEndTime :function()
    		{
    			return this.operEndTime; 
    		},
    		//
    		setOperId : function(operId)
    		{
    			this.operId = operId; 
    		} ,
    	    getOperId :function()
    		{
    			return this.operId; 
    		},
    		//
    		setOperDuration : function(operDuration)
    		{
    			this.operDuration = operDuration; 
    		} ,
    	    getOperDuration :function()
    		{
    			return this.operDuration; 
    		},
    		//
    		setDestOperator : function(destOperator)
    		{
    			this.destOperator = destOperator; 
    		} ,
    	    getDestOperator :function()
    		{
    			return this.destOperator; 
    		},
    		//
    		setStatus : function(status)
    		{
    			this.status = status; 
    		} ,
    	    getStatus :function()
    		{
    			return this.status; 
    		},
    		//
    		setServiceTypeId : function(serviceTypeId)
    		{
    			this.serviceTypeId = serviceTypeId; 
    		} ,
    	    getServiceTypeId :function()
    		{
    			return this.serviceTypeId; 
    		},
    		//
    		setSerialNo : function(serialNo)
    		{
    			this.serialNo = serialNo; 
    		} ,
    	    getSerialNo :function()
    		{
    			return this.serialNo; 
    		},
    		//
    		setContactId : function(contactId)
    		{
    			this.contactId = contactId; 
    		} ,
    	    getContactId :function()
    		{
    			return this.contactId; 
    		},
    		//
    		setRecordFilePath : function(recordFilePath)
    		{
    			this.recordFilePath = recordFilePath; 
    		} ,
    	    getRecordFilePath :function()
    		{
    			return this.recordFilePath; 
    		},
    		//
    		setCallerNo : function(callerNo)
    		{
    			this.callerNo = callerNo; 
    		} ,
    	    getCallerNo :function()
    		{
    			return this.callerNo; 
    		},
    		//
    		setSubsNumber : function(subsNumber)
    		{
    			this.subsNumber = subsNumber; 
    		} ,
    	    getSubsNumber :function()
    		{
    			return this.subsNumber; 
    		},
    		//
    		setSourceSkillId : function(sourceSkillId)
    		{
    			this.sourceSkillId = sourceSkillId; 
    		} ,
    	    getSourceSkillId :function()
    		{
    			return this.sourceSkillId; 
    		},
    		//
    		setSourceSkillName : function(sourceSkillName)
    		{
    			this.sourceSkillName = sourceSkillName; 
    		} ,
    	    getSourceSkillName :function()
    		{
    			return this.sourceSkillName; 
    		},
    		//
    		setDestSkillId : function(destSkillId)
    		{
    			this.destSkillId = destSkillId; 
    		} ,
    	    getDestSkillId :function()
    		{
    			return this.destSkillId; 
    		},
    		//
    		setDestSkillName : function(destSkillName)
    		{
    			this.destSkillName = destSkillName; 
    		} ,
    	    getDestSkillName :function()
    		{
    			return this.destSkillName; 
    		},
    		//
    		setReasonId : function(reasonId)
    		{
    			this.reasonId = reasonId; 
    		} ,
    	    getReasonId :function()
    		{
    			return this.reasonId; 
    		},
    		////////////
    		logSavingForTransfer:function(log) {
    			var logParam = {
    					  "isExt" : log.getIsExt(),
    	         		  "operator" :log.getOperator(),
    	         		  "operBeginTime" : log.getOperBeginTime(),
    	         		  "operEndTime" : log.getOperEndTime(),
    	         		  "operId" : log.getOperId(),
    	         		  "operDuration" : log.getOperDuration(),
    	         		  "destOperator" : log.getDestOperator(),
    	         		  "status" : log.getStatus(),
    	         		  "serviceTypeId" : log.getServiceTypeId(),
    	         		  "serialNo" : log.getSerialNo(),
    	         		  "contactId" : log.getContactId(),
    	         		  "recordFilePath" : log.getRecordFilePath(),
    	         		  "callerNo" : log.getCallerNo(),
    	         		  "subsNumber" : log.getSubsNumber(),
    	         		  "sourceSkillId" : log.getSourceSkillId(),
    	         		  "sourceSkillName" : log.getSourceSkillName(),
    	         		  "destSkillId" : log.getDestSkillId(),
    	         		  "destSkillName" : log.getDestSkillName(),
    	         		  "reasonId" : log.getReasonId()
    			};
    			 Util.ajax.postJson("front/sh/logs!execute?uid=ngcslog002",logParam,function(json,status){
					         		 if(json.returnCode == 0){
					               			console.log("呼叫日志入库成功！");
					               		}else{
					               			console.log("呼叫日志入库失败！");
					               		}
					        });
    		}
    		
    				
    };


    return managementLog;
});
