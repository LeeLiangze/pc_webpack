define(['Util'],function(Util){
    var callingInfo=function(){

		/*
			* callId	     String	CTI的会话标识对象
			* callIdTime	 String	呼叫进入时间
			* callIdDsn	     String	呼叫进入的任务号
			* callIdHandle	 String	呼叫进入一个任务的次数
			* callIdServer	 String	唯一标识一个服务器的标识
			* ChannelID	     String	渠道ID
			* channelName	 String 渠道名称
			* contactId	     String	接触编号
			* serialNo	     String	流水号
			* callerNo	     String	主叫号码
			* calledNo	     String	被叫号码
			* subsNumber	 String	受理号码
			* mediaType	     String	媒体类型
			* skillId	     String	技能编码
			* skillDesc	     String	技能描述
			* releaseType	 String	挂机方 0：用户挂机，1：话务员挂机，2：密码验证失败自动挂机，3：其他，4：转IVR挂机
			* hasRecordFile		String	是否有录音文件。取值含 义：0：无 1：有
			* recordFile	 String	录音文件
			* locationId	 String	分布式节点编号
			* contactStartTime String	接触开始时间
			* contactEndTime String	接触结束时间
			* contactModeId	 String	接触方式
			* surveyTypeId	 String	满意度调查类型 00:不调查 01:语音 02:短信
			* audioBeginTime	string	录音开始时间
			* audioEndTime	    string	录音结束时间
			* sessionStatus	    string	会话状态：01-新会话 02-已读会话 03-未读会话
			* unreadNum	        integer	未读请求条数，默认0
			* custTags	        string	客户标签，多个以英文分号分隔
			* multiAccountInfo	list<MultiAccountInfo>	渠道账号信息列表，用于客户名片区展示
			* toUserId	   	   String	多媒体接收公共号，报表统计使用
			* toUserName	   String	多媒体接收公共号名称，报表统计使用
			* fromOrgId	       String	多媒体发送部门ID，报表统计使用
			* mediaTypeName    String   媒体类型名称
			* ctiId				String	ctiId
			* ccId				String	ccId
			* vdnId				String	vdnId
			* clientInfoMap      map     clientInfo存放客户信息对象 
			* isFirstMessage	Boolean  是会话开始后的第一条消息；false 非会话开始后的第一条消息
			* releaseReason	    String	 会话释放原因。座席在系统上点击释放按钮，选择的释放原因
			* bindedPhoneNumber	String	 绑定的手机号码。451事件中第一条消息到达时，从数据库中查询出来的 当前接入账号绑定的手机号码。
			* ServiceTypeId	    String	 系统业务类型ID
			* firstResponseTime	String	座席第一次响应该会话的时间。（座席回复第一条消息的时候，入值。）
			* transferTime      String   转接事件
			* transferType      String 	转接目的设备类型 0技能队列 1工号
			* transferInner   	String	转接目的设备号码。和transferType结合使用为技能队列或坐席工号。
			* transferMode	 	String 	转接模式，0释放转 1成功转
			* transferOuter		String	转接人工号
			* transferMsg		String	转接同步信息
			* transferStatus	String	转移状态
			* callType	        String	呼叫类型。取值含义：0：呼入  1：呼出 
			* reqEvaluate 		String	发出请求，待评价
			* cipCheckFlag      String  密码验证结果标识。取值含义：0：不通过 1：通过
			* cipCheckType      String  密码验证结果标识。取值含义：1：服务密码验证过  2：身份证号码验证 3:宽带验证
			* clientId          String  应用ID 下发满意度用的
			* keyTrace			String	按键轨迹
			* origCallInfo      原始呼叫信息
			* origCustNum      	受理请求获取原始客户号码
			* callFeature       callinfo 接口查出来的会话类型,区分正常呼入、外呼、救助会话等场景
			* ivrSatisResult    String   转IVR挂机满意度自动流程
		*/
    	/*
    	 * 呼叫信息中的呼叫特征值
    	 */
    	this.callFeature;
    	/*
    	 * 受理请求获取原始客户号码
    	 */
    	this.origCustNum;
    	/*
    	 * 原始呼叫信息
    	 */
    	this.origCallInfo;
		/*
		 * CTI的会话标识对象
		 */
		this.callId; 
		/*
		 * 渠道ID
		 */
		this.channelID; 
		/*
		 * 渠道名称
		 */
		this.channelName;
		/*
		 * 接触编号
		 */
		this.contactId; 
		/*
		 * 流水号
		 */
		this.serialNo; 
		/*
		 * 主叫号码
		 */
		this.callerNo; 
		/*
		 * 被叫号码
		 */
		this.calledNo; 
		/*
		 * 受理号码
		 */
		this.subsNumber; 
		/*
		 * 媒体类型
		 */
		this.mediaType; 
		/*
		 * 技能编码
		 */
		this.skillId; 
		/*
		 * 技能描述
		 */
		this.skillDesc; 
		/*
		 * 挂机方 0：用户挂机，1：话务员挂机，2：密码验证失败自动挂机，3：其他，4：转IVR挂机
		 */
		this.releaseType; 
		/*
		 * 是否有录音文件。取值含 义：0：无 1：有
		 */
		this.hasRecordFile;
		/*
		 * 录音文件
		 */
		this.recordFile; 
		/*
		 * 分布式节点编号
		 */
		this.locationId; 
		/*
		 * 接触开始时间
		 */
		this.contactStartTime; 
		/*
		 * 接触结束时间
		 */
		this.contactEndTime; 
		/*
		 * 接触方式
		 */
		this.contactModeId; 
		/*
		 * 满意度调查类型 00:不调查 01:语音 02:短信
		 */
		this.surveyTypeId; 
		/*
		 * 呼叫进入时间
		 */
		this.callIdTime; 
		/*
		 * 呼叫进入的任务号
		 */
		this.callIdDsn; 
		/*
		 * 呼叫进入一个任务的次数
		 */
		this.callIdHandle; 
		/*
		 * 唯一标识一个服务器的标识
		 */
		this.callIdServer;
		
		/*
		 * 录音开始时间
		 */
		this.audioBeginTime;
		
		/*
		 * 录音结束时间
		 */
		this.audioEndTime;
		
		/*
		 * 会话状态：01-新会话 02-已读会话 03-未读会话
		 */
		this.sessionStatus;
		
		/*
		 * 未读请求条数，默认0
		 */
		this.unreadNum;
		
		/*
		 * 客户标签，多个以英文分号分隔
		 */
		this.custTags;
		
		/*
		 * list<MultiAccountInfo>	渠道账号信息列表，用于客户名片区展示
		 */
		this.multiAccountList = new Array();
		
		/*
		 * 多媒体接收公共号，报表统计使用
		 */
		this.toUserId;
		
		/*
		 * 多媒体接收公共号名称，报表统计使用
		 */
		this.toUserName;
		
		/*
		 * 多媒体发送部门ID，报表统计使用
		 */
		this.fromOrgId;
		/*
		 * 媒体类型名称
		 */
		this.mediaTypeName;
		
		/*
		 * true 是会话开始后的第一条消息；false 非会话开始后的第一条消息
		 */
		this.isFirstMessage;
		
		/*
		 * 会话释放原因。座席在系统上点击释放按钮，选择的释放原因
		 */
		this.releaseReason;
		
		/*
		 * 绑定的手机号码。451事件中第一条消息到达时，从数据库中查询出来的 当前接入账号绑定的手机号码
		 */
		this.bindedPhoneNumber;
		
		/*
		 * 系统业务类型ID
		 */
		this.serviceTypeId;
		
		/*
		 * ctiId
		 */
		this.ctiId;
		
		/*
		 * ccId
		 */
		this.ccId;
		
		/*
		 * vdnId
		 */
		this.vdnId;
		/*
		  * 呼叫类型。取值含义：0：呼入  1：呼出 
		  */
		this.callType;
		/*
		  * 座席第一次响应该会话的时间。（座席回复第一条消息的时候，入值。）
		  */
		this.firstResponseTime;
		/*
		 * 转接时间
		 */
		this.transferTime;
		/*
		 * 转接目的设备类型 0技能队列 1工号
		 */
		this.transferType;
		/*
		 * 转接目的设备号码。和transferType结合使用为技能队列或坐席工号
		 */
		this.transferInner;
		/*
		 * 转接模式，0释放转 1成功转
		 */
		 this.transferMode;
		 /*
		  * 转接人工号
		  */
		 this.transferOuter;
		 /*
		  * 转接同步信息
		  */
		 this.transferMsg;
		 /*
		  * 转移状态
		  */
		 this.transferStatus;
		 /*
		  * 发出请求，待评价
		  */
		 this.reqEvaluate;
		 /*
		  * 密码验证结果标识
		  */
		this.cipCheckFlag;
		 /*
		  * 密码验证类型标识
		  */
		this.cipCheckType
		 /*
		  * 应用ID
		  */
		this.clientId;
		 /*
		  * 招标网用户身份
		  */
		this.customerStatus;
		
		this.clientInfoMap={};				
		/*
		 * 转ivr挂机满意度流程结果
		 */
		this.ivrSatisResult;
		//转ivr参数
		this.languageId;//语种ID
		this.languageName;//语种名称
		this.callTrace;//呼叫轨迹
		this.digitCode;//按键路由
		this.srFlag;//服务请求创建标记
		this.qcStaffId;//质检代表帐号
		this.remark;//备注信息
		this.userSatisfy2;//二次满意度结果
		this.userSatisfy3;//互联网二次满意度调查结果
		
		this.keyTrace;//按键轨迹
    };
    //向外暴漏的方法，可被外部调用
    callingInfo.prototype = {
    		/**
    		* 设置呼叫信息中的呼叫特征值
    		* @param string 数值
    		*/
    		setCallFeature : function(callFeature)
    		{
    			this.callFeature = callFeature; 
    		} ,
    		/**
    		* 获取呼叫信息中的呼叫特征值
    		* @return string 返回数值
    		*/
    		getCallFeature :function()
    		{
    			return this.callFeature; 
    		},
    		/**
    		 * 设置受理请求原始客户号码
    		 * @param string 数值
    		 */
    		setOrigCustNum : function(origCustNum)
    		{
    			this.origCustNum = origCustNum; 
    		} ,
    		/**
    		 * 获取受理请求原始客户号码
    		 * @return string 返回数值
    		 */
    		getOrigCustNum :function()
    		{
    			return this.origCustNum; 
    		},
    		/**
    		 * 设置原始呼叫信息
    		 * @param string 数值
    		 */
    		setOrigCallInfo : function(origCallInfo)
    		{
    			this.origCallInfo = origCallInfo; 
    		} ,
    		/**
    		 * 获取原始呼叫信息
    		 * @return string 返回数值
    		 */
    		getOrigCallInfo :function()
    		{
    			return this.origCallInfo; 
    		},
    		/**
    		 * 设置数值callId
    		 * @param string 数值
    		 */
    		setCallId : function(callId)
    		{
    			this.callId = callId; 
    		} ,
    		/**
    		 * 获取数值callId
    		 * @return string 返回数值
    		 */
    		getCallId :function()
    		{
    			return this.callId; 
    		},
    		
    		/**
    		* 设置数值channelID
    		* @param string 数值
    		*/
    		setChannelID: function(channelID)
    		{
    			this.channelID = channelID; 
    		} ,
    		/**
    		* 获取数值channelID
    		* @return string 返回数值
    		*/
    		getChannelID :function()
    		{
    			return this.channelID; 
    		},
    		
    		/**
    		* 设置数值channelName
    		* @param string 数值
    		*/
    		setChannelName: function(channelName)
    		{
    			this.channelName = channelName; 
    		} ,
    		/**
    		* 获取数值channelName
    		* @return string 返回数值
    		*/
    		getChannelName :function()
    		{
    			return this.channelName; 
    		},
    		
    		/**
    		* 设置数值contactId
    		* @param string 数值
    		*/
    		setContactId : function(contactId)
    		{
    			this.contactId = contactId; 
    		} ,
    		/**
    		* 获取数值contactId
    		* @return string 返回数值
    		*/
    		getContactId : function()
    		{
    			return this.contactId; 
    		} ,
    		
    		/**
    		* 设置数值serialNo
    		* @param string 数值
    		*/
    		setSerialNo :function(serialNo)
    		{
    			this.serialNo = serialNo; 
    		} ,
    		/**
    		* 获取数值serialNo
    		* @return string 返回数值
    		*/
    		getSerialNo : function()
    		{
    			return this.serialNo; 
    		},
    		
    		/**
    		* 设置数值callerNo
    		* @param string 数值
    		*/
    		setCallerNo: function(callerNo)
    		{
    			this.callerNo = callerNo; 
    		} ,
    		/**
    		* 获取数值callerNo
    		* @return string 返回数值
    		*/
    		getCallerNo : function()
    		{
    			return this.callerNo; 
    		} ,
    		
    		/**
    		* 设置数值calledNo
    		* @param string 数值
    		*/
    		setCalledNo: function(calledNo)
    		{
    			this.calledNo = calledNo; 
    		} ,
    		/**
    		* 获取数值calledNo
    		* @return string 返回数值
    		*/
    		getCalledNo : function()
    		{
    			return this.calledNo; 
    		},
    		
    		/**
    		* 设置数值subsNumber
    		* @param string 数值
    		*/
    		setSubsNumber : function(subsNumber)
    		{
    			this.subsNumber = subsNumber; 
    		} ,
    		/**
    		* 获取数值subsNumber
    		* @return string 返回数值
    		*/
    		getSubsNumber : function()
    		{
    			return this.subsNumber; 
    		} ,
    		
    		/**
    		* 设置数值mediaType
    		* @param string 数值
    		*/
    		setMediaType: function(mediaType)
    		{
    			this.mediaType = mediaType; 
    		} ,
    		/**
    		* 获取数值mediaType
    		* @return string 返回数值
    		*/
    		getMediaType: function()
    		{
    			return this.mediaType; 
    		}, 
    		
    		/**
    		* 设置数值skillId
    		* @param string 数值
    		*/
    		setSkillId : function(skillId)
    		{
    			this.skillId = skillId; 
    		} ,
    		/**
    		* 获取数值skillId
    		* @return string 返回数值
    		*/
    		getSkillId : function()
    		{
    			return this.skillId; 
    		} ,
    		
    		/**
    		* 设置数值skillDesc
    		* @param string 数值
    		*/
    		setSkillDesc: function(skillDesc)
    		{
    			this.skillDesc = skillDesc; 
    		}, 
    		/**
    		* 获取数值skillDesc
    		* @return string 返回数值
    		*/
    		getSkillDesc : function()
    		{
    			return this.skillDesc; 
    		}, 
    		
    		/**
    		* 设置数值releaseType
    		* @param string 数值
    		*/
    		setReleaseType : function(releaseType)
    		{
    			this.releaseType = releaseType; 
    		}, 
    		/**
    		* 获取数值releaseType
    		* @return string 返回数值
    		*/
    		getReleaseType : function()
    		{
    			return this.releaseType; 
    		} ,
    		
    		/**
    		* 设置数值hasRecordFile
    		* @param string 数值
    		*/
    		setHasRecordFile : function(hasRecordFile)
    		{
    			this.hasRecordFile = hasRecordFile; 
    		}, 
    		/**
    		* 获取数值hasRecordFile
    		* @return string 返回数值
    		*/
    		getHasRecordFile : function()
    		{
    			return this.hasRecordFile; 
    		} ,
    		
    		/**
    		* 设置数值recordFile
    		* @param string 数值
    		*/
    		setRecordFile : function(recordFile)
    		{
    			this.recordFile = recordFile; 
    		} ,
    		/**
    		* 获取数值recordFile
    		* @return string 返回数值
    		*/
    		getRecordFile: function()
    		{
    			return this.recordFile; 
    		},
    		
    		/**
    		* 设置数值locationId
    		* @param string 数值
    		*/
    		setLocationId : function(locationId)
    		{
    			this.locationId = locationId; 
    		}, 
    		/**
    		* 获取数值locationId
    		* @return string 返回数值
    		*/
    		getLocationId: function()
    		{
    			return this.locationId; 
    		},
    		
    		/**
    		* 设置数值contactStartTime
    		* @param string 数值
    		*/
    		setContactStartTime: function(contactStartTime)
    		{
    			this.contactStartTime = contactStartTime; 
    		} ,
    		/**
    		* 获取数值contactStartTime
    		* @return string 返回数值
    		*/
    		getContactStartTime : function()
    		{
    			return this.contactStartTime; 
    		},
    		
    		/**
    		* 设置数值contactEndTime
    		* @param string 数值
    		*/
    		setContactEndTime : function(contactEndTime)
    		{
    			this.contactEndTime = contactEndTime; 
    		} ,
    		/**
    		* 获取数值contactEndTime
    		* @return string 返回数值
    		*/
    		getContactEndTime: function()
    		{
    			return this.contactEndTime; 
    		} ,
    		
    		/**
    		* 设置数值contactModeId
    		* @param string 数值
    		*/
    		setContactModeId: function(contactModeId)
    		{
    			this.contactModeId = contactModeId; 
    		} ,
    		/**
    		* 获取数值contactModeId
    		* @return string 返回数值
    		*/
    		getContactModeId : function()
    		{
    			return this.contactModeId; 
    		}, 
    		
    		/**
    		* 设置数值surveyTypeId
    		* @param string 数值
    		*/
    		setSurveyTypeId :function(surveyTypeId)
    		{
    			this.surveyTypeId = surveyTypeId; 
    		} ,
    		/**
    		* 获取数值surveyTypeId
    		* @return string 返回数值
    		*/
    		getSurveyTypeId : function()
    		{
    			return this.surveyTypeId; 
    		} ,
    		
    		/**
    		* 设置数值callIdTime
    		* @param string 数值
    		*/
    		setCallIdTime : function(callIdTime)
    		{
    			this.callIdTime = callIdTime; 
    		} ,
    		/**
    		* 获取数值callIdTime
    		* @return string 返回数值
    		*/
    		getCallIdTime : function()
    		{
    			return this.callIdTime; 
    		} ,
    		
    		/**
    		* 设置数值callIdDsn
    		* @param string 数值
    		*/
    		setCallIdDsn : function(callIdDsn)
    		{
    			this.callIdDsn = callIdDsn; 
    		} ,
    		/**
    		* 获取数值callIdDsn
    		* @return string 返回数值
    		*/
    		getCallIdDsn : function()
    		{
    			return this.callIdDsn; 
    		} ,
    		
    		/**
    		* 设置数值callIdHandle
    		* @param string 数值
    		*/
    		setCallIdHandle :function(callIdHandle)
    		{
    			this.callIdHandle = callIdHandle; 
    		}, 
    		/**
    		* 获取数值callIdHandle
    		* @return string 返回数值
    		*/
    		getCallIdHandle : function()
    		{
    			return this.callIdHandle; 
    		} ,
    		
    		/**
    		* 设置数值callIdServer
    		* @param string 数值
    		*/
    		setCallIdServer:function(callIdServer)
    		{
    			this.callIdServer = callIdServer; 
    		} ,
    		/**
    		* 获取数值callIdServer
    		* @return string 返回数值
    		*/
    		getCallIdServer:function()
    		{
    			return this.callIdServer; 
    		} ,
    		
    		
    		/**
    		* 设置数值audioBeginTime
    		* @param string 数值
    		*/
    		setAudioBeginTime:function(audioBeginTime)
    		{
    			this.audioBeginTime = audioBeginTime; 
    		} ,
    		/**
    		* 获取数值audioBeginTime
    		* @return string 返回数值
    		*/
    		getAudioBeginTime:function()
    		{
    			return this.audioBeginTime; 
    		} ,
    		
    		/**
    		* 设置数值audioEndTime
    		* @param string 数值
    		*/
    		setAudioEndTime:function(audioEndTime)
    		{
    			this.audioEndTime = audioEndTime; 
    		} ,
    		/**
    		* 获取数值audioEndTime
    		* @return string 返回数值
    		*/
    		getAudioEndTime:function()
    		{
    			return this.audioEndTime; 
    		} ,
    		
    		/**
    		* 设置数值sessionStatus
    		* @param string 数值
    		*/
    		setSessionStatus:function(sessionStatus)
    		{
    			this.sessionStatus = sessionStatus; 
    		} ,
    		/**
    		* 获取数值sessionStatus
    		* @return string 返回数值
    		*/
    		getSessionStatus:function()
    		{
    			return this.sessionStatus; 
    		} ,
    		
    		/**
    		* 设置数值unreadNum
    		* @param string 数值
    		*/
    		setUnreadNum:function(unreadNum)
    		{
    			this.unreadNum = unreadNum; 
    		} ,
    		/**
    		* 获取数值unreadNum
    		* @return string 返回数值
    		*/
    		getUnreadNum:function()
    		{
    			return this.unreadNum; 
    		} ,
    		/**
    		* 设置数值custTags
    		* @param string 数值
    		*/
    		setCustTags:function(custTags)
    		{
    			this.custTags = custTags; 
    		} ,
    		/**
    		* 获取数值custTags
    		* @return string 返回数值
    		*/
    		getCustTags:function()
    		{
    			return this.custTags; 
    		} ,
    		
    		/**
    		* 设置(添加)数值multiAccountInfo
    		* @param string 数值
    		*/
    		setMultiAccountList:function(multiAccountInfo)
    		
    		{
    			this.multiAccountList[this.multiAccountList.length] = multiAccountInfo; 
    		} ,
    		/**
    		* 获取数值multiAccountInfo
    		* @return string 返回数值
    		*/
    		getMultiAccountList:function()
    		{
    			return this.multiAccountList; 
    		} ,
    		
    		/**
    		* 设置数值toUserId
    		* @param string 数值
    		*/
    		setToUserId:function(toUserId)
    		{
    			this.toUserId = toUserId; 
    		} ,
    		/**
    		* 获取数值toUserId
    		* @return string 返回数值
    		*/
    		getToUserId:function()
    		{
    			return this.toUserId; 
    		} ,
    		/**
    		* 设置数值toUserName
    		* @param string 数值
    		*/
    		setToUserName:function(toUserName)
    		{
    			this.toUserName = toUserName; 
    		} ,
    		/**
    		* 获取数值toUserName
    		* @return string 返回数值
    		*/
    		getToUserName:function()
    		{
    			return this.toUserName; 
    		} ,
    		
    		/**
    		* 设置数值fromOrgId
    		* @param string 数值
    		*/
    		setFromOrgId:function(fromOrgId)
    		{
    			this.fromOrgId = fromOrgId; 
    		} ,
    		/**
    		* 获取数值fromOrgId
    		* @return string 返回数值
    		*/
    		getFromOrgId:function()
    		{
    			return this.fromOrgId; 
    		} ,
    		
    		/**
    		* 设置数值mediaTypeName
    		* @param string 数值
    		*/
    		setMediaTypeName:function(mediaTypeName)
    		{
    			this.mediaTypeName = mediaTypeName; 
    		} ,
    		/**
    		* 获取数值mediaTypeName
    		* @return string 返回数值
    		*/
    		getMediaTypeName:function()
    		{
    			return this.mediaTypeName; 
    		} ,
    		
    		/**
    		* true 是会话开始后的第一条消息；false 非会话开始后的第一条消息
    		* @param boolean 数值
    		*/
    		setIsFirstMessage:function(isFirstMessage)
    		{
    			this.isFirstMessage = isFirstMessage; 
    		} ,
    		/**
    		* true 是会话开始后的第一条消息；false 非会话开始后的第一条消息
    		* @return boolean 返回值
    		*/
    		getIsFirstMessage:function()
    		{
    			return this.isFirstMessage; 
    		} ,
    		/**
    		* 会话释放原因。座席在系统上点击释放按钮，选择的释放原因
    		* @param string 返回数值
    		*/
    		setReleaseReason:function(releaseReason)
    		{
    			this.releaseReason = releaseReason; 
    		} ,
    		/**
    		* 会话释放原因。座席在系统上点击释放按钮，选择的释放原因
    		* @return string 返回数值
    		*/
    		getReleaseReason:function()
    		{
    			return this.releaseReason; 
    		} ,
    		/**
    		* 会话释放原因。座席在系统上点击释放按钮，选择的释放原因
    		* @param string 数值
    		*/
    		setBindedPhoneNumber:function(bindedPhoneNumber)
    		{
    			this.bindedPhoneNumber = bindedPhoneNumber; 
    		} ,
    		/**
    		* 会话释放原因。座席在系统上点击释放按钮，选择的释放原因
    		* @return string 返回数值
    		*/
    		getBindedPhoneNumber:function()
    		{
    			return this.bindedPhoneNumber; 
    		} ,
    		/**
    		* 会话释放原因。座席在系统上点击释放按钮，选择的释放原因
    		* @param string 数值
    		*/
    		setServiceTypeId:function(serviceTypeId)
    		{
    			this.serviceTypeId = serviceTypeId; 
    		} ,
    		/**
    		* 会话释放原因。座席在系统上点击释放按钮，选择的释放原因
    		* @return string 返回数值
    		*/
    		getServiceTypeId:function()
    		{
    			return this.serviceTypeId; 
    		} ,
    		/**
    		* 设置ctiId
    		* @param string 数值
    		*/
    		setCtiId:function(ctiId)
    		{
    			this.ctiId = ctiId; 
    		} ,
    		/**
    		* 获取ctiId
    		* @return string 返回数值
    		*/
    		getCtiId:function()
    		{
    			return this.ctiId; 
    		} ,
    		/**
    		* 设置ccId
    		* @param string 数值
    		*/
    		setCcId:function(ccId)
    		{
    			this.ccId = ccId; 
    		} ,
    		/**
    		* 获取ccId
    		* @return string 返回数值
    		*/
    		getCcId:function()
    		{
    			return this.ccId; 
    		} ,
    		/**
    		* 设置vdnId
    		* @param string 数值
    		*/
    		setVdnId:function(vdnId)
    		{
    			this.vdnId = vdnId; 
    		} ,
    		/**
    		* 获取vdnId
    		* @return string 返回数值
    		*/
    		getVdnId:function()
    		{
    			return this.vdnId; 
    		} ,
    		/**
    		* callType
    		* @param string 数值
    		*/
    		setCallType:function(callType)
    		{
    			this.callType = callType; 
    		} ,
    		/**
    		* 获取callType
    		* @return string 返回数值
    		*/
    		getCallType:function()
    		{
    			return this.callType; 
    		} ,
    		/**
    		* firstResponseTime
    		* @param string 数值
    		*/
    		setFirstResponseTime:function(firstResponseTime)
    		{
    			this.firstResponseTime = firstResponseTime; 
    		} ,
    		/**
    		* 获取firstResponseTime
    		* @return string 返回数值
    		*/
    		getFirstResponseTime:function()
    		{
    			return this.firstResponseTime; 
    		} ,
			/**
			 * 转接时间
			 */
			setTransferTime:function(transferTime)
			{
				this.transferTime = transferTime; 
			},
			getTransferTime:function()
    		{
    			return this.transferTime; 
    		} ,
    		/**
    		 * 转接目的设备类型 0技能队列 1工号
    		 */
			setTransferType:function(transferType)
			{
				this.transferType = transferType; 
			},
			getTransferType:function()
    		{
    			return this.transferType; 
    		} ,
    		/**
    		 * 转接目的设备号码。和transferType结合使用为技能队列或坐席工号。
    		 */
			setTransferInner:function(transferInner)
			{
				this.transferInner = transferInner; 
			},
			getTransferInner:function()
    		{
    			return this.transferInner; 
    		} ,
    		/**
    		 * 转接模式，0释放转 1成功转
    		 */
			setTransferMode:function(transferMode)
			{
				this.transferMode = transferMode; 
			},
			getTransferMode:function()
    		{
    			return this.transferMode; 
    		} ,
    		/**
    		 * 转接人工号
    		 */
			setTransferOuter:function(transferOuter)
			{
				this.transferOuter = transferOuter; 
			},
			getTransferOuter:function()
    		{
    			return this.transferOuter; 
    		},
			/**
			 * 转接同步信息
			 */
			setTransferMsg:function(transferMsg)
			{
				this.transferMsg = transferMsg; 
			},
			getTransferMsg:function()
			{
				return this.transferMsg; 
			},
			/**
			 * 转移状态
			 */
			setTransferStatus:function(transferStatus)
			{
				this.transferStatus = transferStatus; 
			},
			getTransferStatus:function()
			{
				return this.transferStatus; 
			},
			/**
			 * 发出请求，待评价
			 */
			setReqEvaluate:function(reqEvaluate)
			{
				this.reqEvaluate = reqEvaluate; 
			},
			getReqEvaluate:function()
			{
				return this.reqEvaluate; 
			},
			/**
			 * 密码验证结果标识
			 */
			setCipCheckFlag:function(cipCheckFlag)
			{
				this.cipCheckFlag = cipCheckFlag; 
			},
			getCipCheckFlag:function()
			{
				return this.cipCheckFlag; 
			},
			/**
			 * 密码验证类型标识
			 */
			setCipCheckType:function(cipCheckFlag)
			{
				this.cipCheckType = cipCheckType; 
			},
			getCipCheckType:function()
			{
				return this.cipCheckType; 
			},
			/**
			 * 按键轨迹keyTrace
			 */
			setKeyTrace:function(keyTrace)
			{
				this.keyTrace = keyTrace; 
			},
			getKeyTrace:function()
			{
				return this.keyTrace; 
			},
			/**
			 * 应用ID
			 */
			setClientId:function(clientId)
			{
				this.clientId = clientId; 
			},
			getClientId:function()
			{
				return this.clientId; 
			},
			/**
			 * 招标网客户身份
			 */
			setCustomerStatus:function(customerStatus)
			{
				this.customerStatus = customerStatus; 
			},
			getCustomerStatus:function()
			{
				return this.customerStatus; 
			}, 
			
			/**
			 * 用户客户信息，用于存放360视图查询到的客户信息
			 */
			setClientInfoMap:function(clientInfoKey,clientInfoValue)
			{
				this.clientInfoMap[clientInfoKey]= clientInfoValue; 
			},
			getClientInfoMap:function(clientInfoKey)
			{
				if(clientInfoKey){
					return this.clientInfoMap[clientInfoKey];
				}
				return this.clientInfoMap; 
			},
			/**
			 * 转ivr流程中
			 */
			setLanguageId : function(languageId)
			{
				this.languageId = languageId;
			},
			getLanguageId : function()
			{
				return this.languageId;
			},
			setLanguageName : function(languageName)
			{
				this.languageName = languageName;
			},
			getLanguageName : function()
			{
				return this.languageName;
			},
			setDigitCode : function(digitCode)
			{
				this.digitCode = digitCode;
			},
			getDigitCode : function()
			{
				return this.digitCode;
			},						
			/*
			 * 转ivr挂机满意度流程结果
			 */
			setIvrSatisResult : function(ivrSatisResult){
				this.ivrSatisResult=ivrSatisResult;
			},
			getIvrSatisResult : function(){
				return this.ivrSatisResult;
			}
    };


    return callingInfo
});
