define(function(Ext2_HE_Flow){
	var ext2He = function() {
		this.init();
	};
	ext2He.prototype = {
		init : function() {
			this.typeId;
			this.subsNumber;
			this.verifyType;
			this.verifyResult;
			this.isConfirmed;
			this.idCardNo;
			this.reserved;
			this.isOweFee;
			this.workNo;
			this.skillId;
			this.flowPoint;
			this.serialNo;
			this.contactId;

			//转队列转工号需在扩展字段2里额外添加一些字段
			this.transferFlg;
			this.userName;
			this.transferMsg;
			this.operId;
			this.status;

			this.staffId;
			this.staffName;
			this.mediaId;
			this.channelId;
			this.transFlag;
			this.isOutCall;
			this.transferType;

			this.initExt2Flow();
		},

		initExt2Flow : function() {
			this.flowPoint = new Array();
		},

		resetAll : function() {
			this.setTypeId(null);
			this.setSubsNumber(null);
			this.setVerifyType(null);
			this.setVerifyResult(null);
			this.setIsConfirmed(null);
			this.setIdCardNo(null);
			this.setReserved(null);
			this.setIsOweFee(null);
			this.setWorkNo(null);
			this.setSkillId(null);
			this.setSerialNo(null);
			this.setContactId(null);

			this.setTransferFlg(null);
			this.setUserName(null);
			this.setTransferMsg(null);
			this.setOperId(null);
			this.setStatus(null);

			this.setStaffId(null);
			this.setStaffName(null);
			this.setMediaId(null);
			this.setChannelId(null);
			this.setTransFlag(null);
			this.setIsOutCall(null);
			this.setTransferType(null);

			this.resetExt2Flow();
		},

		resetExt2Flow : function() {
			if(this.flowPoint && this.flowPoint.length) {
				this.flowPoint.splice(0,this.flowPoint.length);
			} else {
				this.initExt2Flow();
			}
		},

		splitData : function(data) {
			this.resetAll();
			var splitChar = '~';
			var fieldArray = data.split(splitChar);
			this.setTypeId(fieldArray[0]);
			switch(fieldArray[0]) {
				case "9001" : // 坐席转IVR-二次确认（返回）
					if(fieldArray.length >= 4) {
						this.setVerifyType(fieldArray[1]);
						this.setVerifyResult(fieldArray[2]);
						this.setIsConfirmed(fieldArray[3]);
					}
					break;
				case "9002" : // IVR转坐席-身份证鉴权（回传数据）
					if(fieldArray.length >= 2) {
						this.setIdCardNo(fieldArray[1]);
					}
					break;
				case "0001" : // IVR转坐席-密码验证（回传数据）
					if(fieldArray.length >= 4) {
						this.setVerifyType(fieldArray[1]);
						this.setVerifyResult(fieldArray[2]);
						this.setIsOweFee(fieldArray[3]);
					}
					break;
				case "0004" : // 转队列或转工号
					if(fieldArray.length >= 10) {
						this.setSerialNo(fieldArray[1]);
						this.setTransferFlg(fieldArray[2]);
						this.setWorkNo(fieldArray[3]);
						this.setContactId(fieldArray[4]);
						this.setUserName(fieldArray[5]);
						this.setSubsNumber(fieldArray[6]);
						this.setTransferMsg(fieldArray[7]);
						this.setOperId(fieldArray[8]);
						this.setStatus(fieldArray[9]);
						this.setStaffId(fieldArray[10]);
						this.setStaffName(fieldArray[11]);
						this.setMediaId(fieldArray[12]);
						this.setChannelId(fieldArray[13]);
						this.setTransFlag(fieldArray[14]);
						this.setIsOutCall(fieldArray[15]);
						this.setTransferType(fieldArray[16]);
					}
					break;
				default :
					break;
			}
		},

		unitData : function() {
			var result = "";
			var splitChar = '~';
			var typeId = this.getTypeId() ? this.getTypeId() : "";
			var flowPoint = this.getFlowPoint();

			switch (typeId){
				case "9001": // 坐席转IVR-二次确认
					var subsNumber = this.getSubsNumber() ? this.getSubsNumber() : "";
					result = typeId + splitChar + subsNumber;
					break;
				case "9002": // 坐席转IVR-身份证鉴权
					result = typeId + splitChar;
					break;
				case "0001": // 坐席转IVR-密码验证
					var verifyType = this.getVerifyType() ? this.getVerifyType() : "";
					var reserved = this.getReserved() ? this.getReserved() : "";
					var subsNumber = this.getSubsNumber() ? this.getSubsNumber() : "";
					result = typeId + splitChar + verifyType + splitChar + reserved + splitChar + subsNumber;
					break;
				case "0002": // 坐席转IVR-满意度调查
					var workNo = this.getWorkNo() ? this.getWorkNo() : "";
					var skillId = this.getSkillId() ? this.getSkillId() : "";
					result = typeId + splitChar + workNo + splitChar + skillId;
					break;
				case "2001":
				case "2002":
				case "2003":
				case "2004":
					if(Object.prototype.toString.call(flowPoint)=='[object Array]') {
						var flowString = flowPoint[0].unitData();
						result = typeId + splitChar + flowString;
					}
					break;
				case "2000":
					if(Object.prototype.toString.call(flowPoint)=='[object Array]') {
						result = typeId;
						for(var i=0; i<flowPoint.length; i++) {
							var flowString = flowPoint[i].unitData();
							result = result + splitChar + flowString;
						}
					}
					break;
				case "0004": // 转队列、转工号
					var serialNo = this.getSerialNo() ? this.getSerialNo() : "";
					var transferFlg = this.getTransferFlg() ? this.getTransferFlg() : "";
					var workNo = this.getWorkNo() ? this.getWorkNo() : "";
					var contactId = this.getContactId() ? this.getContactId() : "";
					var userName = this.getUserName() ? this.getUserName() : "";
					var subsNumber = this.getSubsNumber() ? this.getSubsNumber() : "";
					var transferMsg = this.getTransferMsg() ? this.getTransferMsg() : "";
					var operId = this.getOperId() ? this.getOperId() : "";
					var status = this.getStatus() ? this.getStatus() : "";

					var staffId = this.getStaffId() ? this.getStaffId() : "";
					var staffName = this.getStaffName() ? this.getStaffName() : "";
					var mediaId = this.getMediaId() ? this.getMediaId() : "";
					var channelId = this.getChannelId() ? this.getChannelId() : "";
					var transFlag = this.getTransFlag() === true ? true : false;
					var isOutCall = this.getIsOutCall() === true ? true : false;
					var transferType = this.getTransferType() ? this.getTransferType() : "";
					result = typeId + splitChar + serialNo + splitChar + transferFlg + splitChar + workNo + splitChar + contactId
						+ splitChar + userName + splitChar + subsNumber + splitChar + transferMsg + splitChar + operId + splitChar + status
						+ splitChar + staffId + splitChar + staffName + splitChar + mediaId + splitChar + channelId + splitChar + transFlag
						+ splitChar + isOutCall + splitChar + transferType;
					break;
				case "9999": // 转队列、转工号
					result = typeId;
					break;
				default:
					break;
			}
			return result;
		},

		setValueFromParam : function(ext2Param) {
			this.resetAll();
			// typeId
			if (!this.isEmpty(ext2Param.typeId)) {
				this.setTypeId(ext2Param.typeId);
			}
			// subsNumber
			if (!this.isEmpty(ext2Param.subsNumber)) {
				this.setSubsNumber(ext2Param.subsNumber);
			}
			// verifyType
			if (!this.isEmpty(ext2Param.verifyType)) {
				this.setVerifyType(ext2Param.verifyType);
			}
			// verifyResult
			if (!this.isEmpty(ext2Param.verifyResult)) {
				this.setVerifyResult(ext2Param.verifyResult);
			}
			// isConfirmed
			if (!this.isEmpty(ext2Param.isConfirmed)) {
				this.setIsConfirmed(ext2Param.isConfirmed);
			}
			// idCardNo
			if (!this.isEmpty(ext2Param.idCardNo)) {
				this.setIdCardNo(ext2Param.idCardNo);
			}
			// reserved
			if (!this.isEmpty(ext2Param.reserved)) {
				this.setReserved(ext2Param.reserved);
			}
			// isOweFee
			if (!this.isEmpty(ext2Param.isOweFee)) {
				this.setIsOweFee(ext2Param.isOweFee);
			}
			// workNo
			if (!this.isEmpty(ext2Param.workNo)) {
				this.setWorkNo(ext2Param.workNo);
			}
			// skillId
			if (!this.isEmpty(ext2Param.skillId)) {
				this.setSkillId(ext2Param.skillId);
			}
			// flowPoint
			if(Object.prototype.toString.call(ext2Param.flowPoint)=='[object Array]') {
				var flowPointParam = ext2Param.flowPoint;
				this.resetExt2Flow();
				for(var i=0; i<flowPointParam.length; i++) {
					this.setFlowPoint(new Ext2_HE_Flow());
					(this.getFlowPoint())[i].setValueFromParam(flowPointParam[i]);
				}
			}
			// serialNo
			if (!this.isEmpty(ext2Param.serialNo)) {
				this.setSerialNo(ext2Param.serialNo);
			}
			// contactId
			if (!this.isEmpty(ext2Param.contactId)) {
				this.setContactId(ext2Param.contactId);
			}

			// transferFlg
			if (!this.isEmpty(ext2Param.transferFlg)) {
				this.setTransferFlg(ext2Param.transferFlg);
			}
			// userName
			if (!this.isEmpty(ext2Param.userName)) {
				this.setUserName(ext2Param.userName);
			}
			// transferMsg
			if (!this.isEmpty(ext2Param.transferMsg)) {
				this.setTransferMsg(ext2Param.transferMsg);
			}
			// operId
			if (!this.isEmpty(ext2Param.operId)) {
				this.setOperId(ext2Param.operId);
			}
			// status
			if (!this.isEmpty(ext2Param.status)) {
				this.setStatus(ext2Param.status);
			}

			// staffId
			if (!this.isEmpty(ext2Param.staffId)) {
				this.setStaffId(ext2Param.staffId);
			}
			// staffName
			if (!this.isEmpty(ext2Param.staffName)) {
				this.setStaffName(ext2Param.staffName);
			}
			// mediaId
			if (!this.isEmpty(ext2Param.mediaId)) {
				this.setMediaId(ext2Param.mediaId);
			}
			// channelId
			if (!this.isEmpty(ext2Param.channelId)) {
				this.setChannelId(ext2Param.channelId);
			}
			// transFlag
			this.setTransFlag(ext2Param.transFlag);
			// isOutCall
			this.setIsOutCall(ext2Param.isOutCall);

			// transferType
			if (!this.isEmpty(ext2Param.transferType)) {
				this.setTransferType(ext2Param.transferType);
			}
		},

		getValidateResult : function() {
			var resultJson = null;
			var typeId = this.getTypeId() ? this.getTypeId() : "";
			switch (typeId){
				case "0001": // 密码验证 返回结果
					var verifyType = this.getVerifyType() ? this.getVerifyType() : "";
					var verifyResult = this.getVerifyResult() ? this.getVerifyResult() : "";
					resultJson = {
						"typeId" : typeId,
						"verifyType" : verifyType,
						"verifyResult" : verifyResult
					}
					break;
				case "9001": // 二次确认 返回结果
					var verifyType = this.getVerifyType() ? this.getVerifyType() : "";
					var isConfirmed = this.getIsConfirmed() ? this.getIsConfirmed() : "";
					resultJson = {
						"typeId" : typeId,
						"verifyType" : verifyType,
						"isConfirmed" : isConfirmed
					}
					break;
				case "9002": // 身份证鉴权 返回结果
					var idCard = this.getIdCardNo() ? this.getIdCardNo() : "";
					resultJson = {
						"typeId" : typeId,
						"idCard" : idCard
					}
					break;
				case "0004": // 转队列/工号 返回结果
					var serialNo = this.getSerialNo() ? this.getSerialNo() : "";
					var transferFlg = this.getTransferFlg() ? this.getTransferFlg() : "";
					var workNo = this.getWorkNo() ? this.getWorkNo() : "";
					var contactId = this.getContactId() ? this.getContactId() : "";
					var userName = this.getUserName() ? this.getUserName() : "";
					var subsNumber = this.getSubsNumber() ? this.getSubsNumber() : "";
					var transferMsg = this.getTransferMsg() ? this.getTransferMsg() : "";
					var operId = this.getOperId() ? this.getOperId() : "";
					var status = this.getStatus() ? this.getStatus() : "";
					var staffId = this.getStaffId() ? this.getStaffId() : "";
					var staffName = this.getStaffName() ? this.getStaffName() : "";
					var mediaId = this.getMediaId() ? this.getMediaId() : "";
					var channelId = this.getChannelId() ? this.getChannelId() : "";
					var transFlag = this.getTransFlag() === true ? true : false;
					var isOutCall = this.getIsOutCall() === true ? true : false;
					var transferType = this.getTransferType() ? this.getTransferType() : "";
					resultJson = {
						"typeId" : typeId,
						"serialNo" : serialNo,
						"transferFlg" : transferFlg,
						"workNo" : workNo,
						"contactId" : contactId,
						"userName" : userName,
						"subsNumber" : subsNumber,
						"transferMsg" : transferMsg,
						"operId" : operId,
						"status" : status,
						"staffId" : staffId,
						"staffName" : staffName,
						"mediaId" : mediaId,
						"channelId" : channelId,
						"transFlag" : transFlag,
						"isOutCall" : isOutCall,
						"transferType" : transferType
					}
					break;
				default:
					break;
			}
			return resultJson;
		},

		// typeId
		setTypeId : function(typeId) {
			this.typeId = typeId;
		},
		getTypeId : function() {
			return this.typeId;
		},
		// subsNumber
		setSubsNumber : function(subsNumber) {
			this.subsNumber = subsNumber;
		},
		getSubsNumber : function() {
			return this.subsNumber;
		},
		// verifyType
		setVerifyType : function(verifyType) {
			this.verifyType = verifyType;
		},
		getVerifyType : function() {
			return this.verifyType;
		},
		// verifyResult
		setVerifyResult : function(verifyResult) {
			this.verifyResult = verifyResult;
		},
		getVerifyResult : function() {
			return this.verifyResult;
		},
		// isConfirmed
		setIsConfirmed : function(isConfirmed) {
			this.isConfirmed = isConfirmed;
		},
		getIsConfirmed : function() {
			return this.isConfirmed;
		},
		// idCardNo
		setIdCardNo : function(idCardNo) {
			this.idCardNo = idCardNo;
		},
		getIdCardNo : function() {
			return this.idCardNo;
		},
		// reserved
		setReserved : function(reserved) {
			this.reserved = reserved;
		},
		getReserved : function() {
			return this.reserved;
		},
		// isOweFee
		setIsOweFee : function(isOweFee) {
			this.isOweFee = isOweFee;
		},
		getIsOweFee : function() {
			return this.isOweFee;
		},
		// workNo
		setWorkNo : function(workNo) {
			this.workNo = workNo;
		},
		getWorkNo : function() {
			return this.workNo;
		},
		// skillId
		setSkillId : function(skillId) {
			this.skillId = skillId;
		},
		getSkillId : function() {
			return this.skillId;
		},

		setFlowPoint : function(flowPoint) {
			this.flowPoint[this.flowPoint.length] = flowPoint;
		},
		getFlowPoint : function() {
			return this.flowPoint;
		},

		// serialNo
		setSerialNo : function(serialNo) {
			this.serialNo = serialNo;
		},
		getSerialNo : function() {
			return this.serialNo;
		},

		// contactId
		setContactId : function(contactId) {
			this.contactId = contactId;
		},
		getContactId : function() {
			return this.contactId;
		},

		// transferFlg
		setTransferFlg : function(transferFlg) {
			this.transferFlg = transferFlg;
		},
		getTransferFlg : function() {
			return this.transferFlg;
		},

		// userName
		setUserName : function(userName) {
			this.userName = userName;
		},
		getUserName : function() {
			return this.userName;
		},

		// transferMsg
		setTransferMsg : function(transferMsg) {
			this.transferMsg = transferMsg;
		},
		getTransferMsg : function() {
			return this.transferMsg;
		},

		// operId
		setOperId : function(operId) {
			this.operId = operId;
		},
		getOperId : function() {
			return this.operId;
		},

		// status
		setStatus : function(status) {
			this.status = status;
		},
		getStatus : function() {
			return this.status;
		},

		// staffId
		setStaffId : function(staffId) {
			this.staffId = staffId;
		},
		getStaffId : function() {
			return this.staffId;
		},

		// staffName
		setStaffName : function(staffName) {
			this.staffName = staffName;
		},
		getStaffName : function() {
			return this.staffName;
		},

		// mediaId
		setMediaId : function(mediaId) {
			this.mediaId = mediaId;
		},
		getMediaId : function() {
			return this.mediaId;
		},

		// channelId
		setChannelId : function(channelId) {
			this.channelId = channelId;
		},
		getChannelId : function() {
			return this.channelId;
		},

		// transFlag
		setTransFlag : function(transFlag) {
			this.transFlag = transFlag;
		},
		getTransFlag : function() {
			return this.transFlag;
		},

		// isOutCall
		setIsOutCall : function(isOutCall) {
			this.isOutCall = isOutCall;
		},
		getIsOutCall : function() {
			return this.isOutCall;
		},

		// transferType
		setTransferType : function(transferType) {
			this.transferType = transferType;
		},
		getTransferType : function() {
			return this.transferType;
		},

		isEmpty : function(value) {
			var value = this.trim(value);
			var result = false;
			if (value == null || value == undefined || value == "") {
				result = true;
			}
			return result;
		},
		trim : function(str) {
			var result;
			if (Object.prototype.toString.call(str) === "[object String]") {
				result = str.replace(/(^\s*)|(\s*$)/g, "");
			} else {
				result = str;
			}
			return result;
		}
	}
	return ext2He;
});