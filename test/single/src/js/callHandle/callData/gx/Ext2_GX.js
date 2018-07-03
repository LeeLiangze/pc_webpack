/**
 * 广西未按照华为格式，所以没有bigZone，ext1，ext2等字段，为了保证
 * RoutePackage对象的通用性，规定广西的随路数据中的字段全部放在ext2下，即：
 * RoutePackage = {
 * 		bigZone : '',
 * 		...
 * 		ext1 : '',
 * 		ext2 : {
 * 			typeId : '000', //转接标识
 * 			callId : '2016082610030547315007751190', //呼叫标识
 * 			...
 * 		}
 * }
 */
define(function(Ext2_GX_Data){
	var ext2Gx = function() {
		this.init();
	};
	ext2Gx.prototype = {
		init : function() {
			this.typeId;			//转接标识
			this.subsNumber;		//用户号码
			this.transferWorkNo;	//转接工号
			this.transferMsg;		//转接文字信息
			this.callId;			//UCID
			this.callerNo;			//通话号码
			this.oriSkillId;		//源技能队列id
			this.oriSkillName;		//源技能队列name
			this.skillId;			//目的技能id
			this.skillName;			//目的技能name
			this.extraMsg;			//附加信息
			this.nodeId;			//节点id
			this.calledNo;			//主叫号码
			this.workNo;			//工号
			this.workCode;			//workCode
			this.callTrace;			//呼叫轨迹
			this.custBrand;			//用户品牌
			this.keyTrace;			//键轨迹
			this.callPort;			//呼叫端口
			this.verifyResult;		//验证结果
			this.ciperCode;			//密 码
			this.weakCodeFlg;		//弱密码
			this.idCard;			//身份证
			this.ifPwdLocked;		//密码是否被锁
			this.cardFailMsg;		//身份证验证失败信息
			this.systemFlg;			//系统标识
			this.contactId;			//全网接触ID
			this.opId;				//广西crm的工号，它是八位的，例如77180260
			this.yjkf;				//yjkf(固定值)
			this.ext2Data;			//ext2随路数据
			this.agentPhoneNo;		//坐席号码
			this.sceneFlg;			//场景标识 仅供集中侧转IVR时使用，依据该标志位判断所属场景，并以对应字段格式封装随路数据
			this.pwdAndFailFlg;		//密码和失败标识 在密码验证返回结果中用的：密码输入错误且未被锁定
			this.nodeDetail;
			this.satisfyData;

			// 转队列转工号所用字段
			this.serialNo;
			this.operId;
			this.status;
			this.staffId;
			this.mediaId;
			this.channelId;
			this.staffName;
			this.userName;
			this.transFlag;
			this.isOutCall;
			this.transferFlg;
			this.transferType;

			this.initExt2Data();
		},

		initExt2Data : function() {
			this.setExt2Data(new Ext2_GX_Data());
		},

		//0 resetAll
		resetAll : function() {
			this.setTypeId(null);
			this.setSubsNumber(null);
			this.setTransferWorkNo(null);
			this.setTransferMsg(null);
			this.setCallId(null);
			this.setCallerNo(null);
			this.setOriSkillId(null);
			this.setOriSkillName(null);
			this.setSkillId(null);
			this.setSkillName(null);
			this.setExtraMsg(null);
			this.setNodeId(null);
			this.setCalledNo(null);
			this.setWorkNo(null);
			this.setWorkCode(null);
			this.setCallTrace(null);
			this.setCustBrand(null);
			this.setKeyTrace(null);
			this.setCallPort(null);
			this.setVerifyResult(null);
			this.setCiperCode(null);
			this.setWeakCodeFlg(null);
			this.setIdCard(null);
			this.setIfPwdLocked(null);
			this.setCardFailMsg(null);
			this.setSystemFlg(null);
			this.setContactId(null);
			this.setOpId(null);
			this.setYjkf(null);
			this.setAgentPhoneNo(null);
			this.setSceneFlg(null);
			this.setPwdAndFailFlg(null);
			this.setNodeDetail(null);
			this.setSatisfyData(null);

			this.setSerialNo(null);
			this.setOperId(null);
			this.setStatus(null);
			this.setStaffId(null);
			this.setMediaId(null);
			this.setChannelId(null);
			this.setStaffName(null);
			this.setUserName(null);
			this.setTransFlag(null);
			this.setIsOutCall(null);
			this.setTransferFlg(null);
			this.setTransferType(null);

			this.resetExt2Data();
		},

		resetExt2Data : function() {
			if(this.getExt2Data()) {
				this.getExt2Data().resetAll();
			} else {
				this.initExt2Data();
			}
		},

		splitData : function(data) {
			this.resetAll();
			var fieldArray = data.split('|');
			if(fieldArray.length > 1) {
				var typeId = fieldArray[0];
				if(typeId == '000') {
					if(fieldArray.length >= 10) { // 000-IVR转普通人工坐席
						this.setTypeId(fieldArray[0]);
						this.setCallId(fieldArray[1]);
						this.setCallTrace(fieldArray[2]);
						this.setCallerNo(fieldArray[3]);
						this.setCustBrand(fieldArray[4]);
						this.setCalledNo(fieldArray[5]);
						this.setSkillName(fieldArray[6]);
						this.setNodeId(fieldArray[7]);
						this.setKeyTrace(fieldArray[8]);
					} else if(fieldArray.length >= 9) {// 000-IVR自动外呼转人工坐席
						this.setTypeId(fieldArray[0]);
						this.setCallId(fieldArray[1]);
						this.setNodeId(fieldArray[2]);
						this.setCallerNo(fieldArray[3]);
						this.setCalledNo(fieldArray[4]);
						this.setSubsNumber(fieldArray[5]);
						this.setWorkNo(fieldArray[6]);
						this.setCallPort(fieldArray[7]);
					} else {
					}
				} else if(typeId == '002') { //密码验证
					if(fieldArray.length >= 6) {// 1验证成功 2正常失败（没有被锁） 3失败（被锁）
						this.setTypeId(fieldArray[0]);
						this.setCallId(fieldArray[1]);
						this.setVerifyResult(fieldArray[2]);
						this.setCiperCode(fieldArray[3]);
						this.setIfPwdLocked(fieldArray[4]);
						if(fieldArray.length >= 7 && fieldArray[2] == '0') {
							this.setWeakCodeFlg(fieldArray[6]);
						} else {
							this.setWeakCodeFlg(fieldArray[5]);
						}
					} else if(fieldArray.length >= 4 && fieldArray[2] == '0') {//数据异常
						this.setTypeId(fieldArray[0]);
						this.setCallId(fieldArray[1]);
						this.setVerifyResult(fieldArray[2]);
						this.setPwdAndFailFlg(fieldArray[3]);
					}
				} else if(typeId == '005') { // 转专席：话费、宽带、集团 返回数据 用于弹窗
					if(fieldArray.length >= 10) {
						this.setTypeId(fieldArray[0]);
						this.setSubsNumber(fieldArray[1]);
						this.setTransferWorkNo(fieldArray[2]);
						this.setTransferMsg(fieldArray[3]);
						this.setCallId(fieldArray[4]);
						this.setCallerNo(fieldArray[5]);
						this.setOriSkillId(fieldArray[6]);
						this.setSkillId(fieldArray[7]);
						this.setExtraMsg(fieldArray[8]);
					}
				} else if(typeId == '006') {//身份证验证
					if(fieldArray.length >= 4) {
						if(fieldArray[2] == '1') { //成功
							this.setTypeId(fieldArray[0]);
							this.setCallId(fieldArray[1]);
							this.setVerifyResult(fieldArray[2]);
							this.setIdCard(fieldArray[3]);
						} else if(fieldArray[2] == '0') { //失败
							this.setTypeId(fieldArray[0]);
							this.setCallId(fieldArray[1]);
							this.setVerifyResult(fieldArray[2]);
							this.setCardFailMsg(fieldArray[3]);
						}
					}
				} else {
				}
			} else {
				try{
					var transferJson = JSON.parse(fieldArray[0]);
					var typeId = transferJson.typeId ? transferJson.typeId:"";
					var serialNo = transferJson.serialNo ? transferJson.serialNo:"";
					var operId = transferJson.operId ? transferJson.operId:"";
					var status = transferJson.status ? transferJson.status:"";
					var subsNumber = transferJson.subsNumber ? transferJson.subsNumber:"";
					var contactId = transferJson.contactId ? transferJson.contactId:"";
					var transferMsg = transferJson.transferMsg ? transferJson.transferMsg:"";
					var staffId = transferJson.staffId ? transferJson.staffId:"";
					var mediaId = transferJson.mediaId ? transferJson.mediaId:"";
					var channelId = transferJson.channelId ? transferJson.channelId:"";
					var staffName = transferJson.staffName ? transferJson.staffName:"";
					var userName = transferJson.userName ? transferJson.userName:"";
					var transFlag = transferJson.transFlag === true ? true : false;
					var isOutCall = transferJson.isOutCall === true ? true : false;
					var transferFlg = transferJson.transferFlg ? transferJson.transferFlg:"";
					var workNo = transferJson.workNo ? transferJson.workNo:"";
					var transferType = transferJson.transferType ? transferJson.transferType:"";

					this.setTypeId(typeId);
					this.setSerialNo(serialNo);
					this.setOperId(operId);
					this.setStatus(status);
					this.setSubsNumber(subsNumber);
					this.setContactId(contactId);
					this.setTransferMsg(transferMsg);
					this.setStaffId(staffId);
					this.setMediaId(mediaId);
					this.setChannelId(channelId);
					this.setStaffName(staffName);
					this.setUserName(userName);
					this.setTransFlag(transFlag);
					this.setIsOutCall(isOutCall);
					this.setTransferFlg(transferFlg);
					this.setWorkNo(workNo);
					this.setTransferType(transferType);
				}catch(e){
				}
			}
		},

		unitData : function() {
			var result = "";
			var typeId = this.getTypeId() ? this.getTypeId() : '';
			var callId = this.getCallId() ? this.getCallId() : '';
			var nodeId = this.getNodeId() ? this.getNodeId() : '';
			var callerNo = this.getCallerNo() ? this.getCallerNo() : '';
			var calledNo = this.getCalledNo() ? this.getCalledNo() : '';
			var subsNumber = this.getSubsNumber() ? this.getSubsNumber() : '';
			var workNo = this.getWorkNo() ? this.getWorkNo() : '';
			var workCode = this.getWorkCode() ? this.getWorkCode() : '';
			var transferWorkNo = this.getTransferWorkNo() ? this.getTransferWorkNo() : '';
			var transferMsg = this.getTransferMsg() ? this.getTransferMsg() : '';
			var oriSkillId = this.getOriSkillId() ? this.getOriSkillId() : '';
			var skillId = this.getSkillId() ? this.getSkillId() : '';
			var extraMsg = this.getExtraMsg() ? this.getExtraMsg() : '';
			var systemFlg = this.getSystemFlg() ? this.getSystemFlg() : '';
			var skillName = this.getSkillName() ? this.getSkillName() : '';

			var sceneFlg = this.getSceneFlg() ? this.getSceneFlg() : '';
			var nodeDetail = this.getNodeDetail() ? this.getNodeDetail() : '';
			var satisfyData = this.getSatisfyData() ? this.getSatisfyData() : '';

			if(typeId == '001') { //转自动流程
				if(sceneFlg == '001001') {//旧人工 咨询语音 接入码 1601
					result = typeId + '|' + callId + '|' + subsNumber + '|' + workNo + '|' + nodeDetail + '|' + satisfyData + '|';
				} else if(sceneFlg == '001002') {//新人工 业务办理 接入码 1605
					result = typeId + '|' + callId + '|' + nodeId + '|' + callerNo + '|' + calledNo + '|' + subsNumber + '|' + workNo + '|';
				}
			} else if(typeId == '002') { //IVR转密码验证
				result = typeId + '|' + callId + '|' + subsNumber + '|';
			} else if(typeId == '003') { //满意度调查
				//增加最后一个字段：系统标志位，为了区分新老系统，满意度入库的问题
				result = typeId + '|' + callId + '|' + workCode + '|' + subsNumber + '|' + workNo + '|' + systemFlg + '|';
				// 暂时去掉systemFlg，方便测试环境测试
				//result = typeId + '|' + callId + '|' + workCode + '|' + subsNumber + '|' + workNo + '|';
			} else if(typeId == '005') { //专席
				if(sceneFlg == '005001') {//话费疑难、有线宽带、集团专席
					result = skillName + '|' + typeId + '|' + subsNumber + '|' + transferWorkNo + '|' + transferMsg + '|' + callId + '|' + callerNo + '|' + oriSkillId + '|' + skillId + '|' + extraMsg + '|';
				} else if(sceneFlg == '005000') {//手机网络淫秽受理专席
					result = typeId + '|' + subsNumber + '|' + transferWorkNo + '|' + transferMsg + '|' + callId + '|' + callerNo + '|' + oriSkillId + '|' + skillId + '|' + extraMsg + '|';
				}
			} else if(typeId == '006') { //身份证验证
				result = typeId + '|' + callId + '|' + subsNumber + '|';
			} else if(typeId == '011') { //新人工引导转IVR
				if(sceneFlg == '011001') {//省crm
					var opId = this.getOpId() ? this.getOpId() : '';
					var agentPhoneNo = this.getAgentPhoneNo() ? this.getAgentPhoneNo() : '';
					result = typeId + '|' + callId + '|' + callerNo + '|' + calledNo + '|' + subsNumber + '|' + opId + '|' + agentPhoneNo + '|';
				} else if(sceneFlg == '011002') {//IVR会场
					var opId = this.getOpId() ? this.getOpId() : '';
					result = typeId + '|' + callId + '|' + callerNo + '|' + calledNo + '|' + subsNumber + '|' + opId + '|';
				} else if(sceneFlg == '001002') {
					result = typeId + '|' + callId + '|' + nodeId + '|' + callerNo + '|' + calledNo + '|' + subsNumber + '|' + workNo + '|';
				} else {
				}
			} else if(typeId == '0004') {
				var serialNo = this.getSerialNo() ? this.getSerialNo() : '';
				var operId = this.getOperId() ? this.getOperId() : '';
				var status = this.getStatus() ? this.getStatus() : '';
				var contactId = this.getContactId() ? this.getContactId() : '';
				var staffId = this.getStaffId() ? this.getStaffId() : '';
				var mediaId = this.getMediaId() ? this.getMediaId() : '';
				var channelId = this.getChannelId() ? this.getChannelId() : '';
				var staffName = this.getStaffName() ? this.getStaffName() : '';
				var userName = this.getUserName() ? this.getUserName() : '';
				var transFlag = this.getTransFlag() === true ? true : false;
				var isOutCall = this.getIsOutCall() === true ? true : false;
				var transferFlg = this.getTransferFlg() ? this.getTransferFlg() : '';
				var transferType = this.getTransferType() ? this.getTransferType() : '';
				result = {
					"typeId" : typeId,
					"serialNo" : serialNo,
					"operId" : operId,
					"status" : status,
					"subsNumber" : subsNumber,
					"contactId" : contactId,
					"transferMsg" : transferMsg,
					"staffId" : staffId,
					"mediaId" : mediaId,
					"channelId" : channelId,
					"staffName" : staffName,
					"userName" : userName,
					"transFlag" : transFlag,
					"isOutCall" : isOutCall,
					"workNo" : workNo,
					"transferFlg" : transferFlg,
					"transferType" : transferType
				}
			} else if(typeId == '9999') {
				result = {
					"typeId" : typeId
				}
			} else {
				if(sceneFlg == '999000') { //转一级客服专席基地
					var contactId = this.getContactId() ? this.getContactId() : '';
					var opId = this.getOpId() ? this.getOpId() : '';
					var yjkf = this.getYjkf() ? this.getYjkf() : '';
					var ext2Data = this.getExt2Data() ? this.getExt2Data().unitData() : '';
					result = callId + '|' + callerNo + '|' + contactId + '|' + opId + '|' + skillId + '|' + skillName + '|' + yjkf + '|' + ext2Data + '|';
				}
			}
			return result;
		},

		setValueFromParam : function(ext2Param) {
			this.resetAll();

			// 1 typeId
			if (!this.isEmpty(ext2Param.typeId)) {
				this.setTypeId(ext2Param.typeId);
			}
			// 2 subsNumber
			if (!this.isEmpty(ext2Param.subsNumber)) {
				this.setSubsNumber(ext2Param.subsNumber);
			}
			// 3 transferWorkNo
			if (!this.isEmpty(ext2Param.transferWorkNo)) {
				this.setTransferWorkNo(ext2Param.transferWorkNo);
			}
			// 4 transferMsg
			if (!this.isEmpty(ext2Param.transferMsg)) {
				this.setTransferMsg(ext2Param.transferMsg);
			}
			// 5 callId
			if (!this.isEmpty(ext2Param.callId)) {
				this.setCallId(ext2Param.callId);
			}
			// 6 callerNo
			if (!this.isEmpty(ext2Param.callerNo)) {
				this.setCallerNo(ext2Param.callerNo);
			}
			// 7 oriSkillId
			if (!this.isEmpty(ext2Param.oriSkillId)) {
				this.setOriSkillId(ext2Param.oriSkillId);
			}
			// 8 oriSkillName
			if (!this.isEmpty(ext2Param.oriSkillName)) {
				this.setOriSkillName(ext2Param.oriSkillName);
			}
			// 9 skillId
			if (!this.isEmpty(ext2Param.skillId)) {
				this.setSkillId(ext2Param.skillId);
			}
			// 10 skillName
			if (!this.isEmpty(ext2Param.skillName)) {
				this.setSkillName(ext2Param.skillName);
			}
			// 11 extraMsg
			if (!this.isEmpty(ext2Param.extraMsg)) {
				this.setExtraMsg(ext2Param.extraMsg);
			}
			// 12 nodeId
			if (!this.isEmpty(ext2Param.nodeId)) {
				this.setNodeId(ext2Param.nodeId);
			}
			// 13 calledNo
			if (!this.isEmpty(ext2Param.calledNo)) {
				this.setCalledNo(ext2Param.calledNo);
			}
			// 14 workNo
			if (!this.isEmpty(ext2Param.workNo)) {
				this.setWorkNo(ext2Param.workNo);
			}
			// 15 workCode
			if (!this.isEmpty(ext2Param.workCode)) {
				this.setWorkCode(ext2Param.workCode);
			}
			// 16 callTrace
			if (!this.isEmpty(ext2Param.callTrace)) {
				this.setCallTrace(ext2Param.callTrace);
			}
			// 17 custBrand
			if (!this.isEmpty(ext2Param.custBrand)) {
				this.setCustBrand(ext2Param.custBrand);
			}
			// 18 keyTrace
			if (!this.isEmpty(ext2Param.keyTrace)) {
				this.setKeyTrace(ext2Param.keyTrace);
			}
			// 19 callPort
			if (!this.isEmpty(ext2Param.callPort)) {
				this.setCallPort(ext2Param.callPort);
			}
			// 26 systemFlg
			if (!this.isEmpty(ext2Param.systemFlg)) {
				this.setSystemFlg(ext2Param.systemFlg);
			}
			// 27 contactId
			if (!this.isEmpty(ext2Param.contactId)) {
				this.setContactId(ext2Param.contactId);
			}
			// 28 opId
			if (!this.isEmpty(ext2Param.opId)) {
				this.setOpId(ext2Param.opId);
			}
			// 29 yjkf
			if (!this.isEmpty(ext2Param.yjkf)) {
				this.setYjkf(ext2Param.yjkf);
			}
			// 31 agentPhoneNo
			if (!this.isEmpty(ext2Param.agentPhoneNo)) {
				this.setAgentPhoneNo(ext2Param.agentPhoneNo);
			}
			// 32 sceneFlg
			if (!this.isEmpty(ext2Param.sceneFlg)) {
				this.setSceneFlg(ext2Param.sceneFlg);
			}
			// 34 nodeDetail
			if (!this.isEmpty(ext2Param.nodeDetail)) {
				this.setNodeDetail(ext2Param.nodeDetail);
			}
			// 35 satisfyData
			if (!this.isEmpty(ext2Param.satisfyData)) {
				this.setSatisfyData(ext2Param.satisfyData);
			}
			// 30 ext2Data
			if (ext2Param.ext2Data) {
				this.getExt2Data().setValueFromParam(ext2Param.ext2Data);
			}
			// 36 serialNo
			if (!this.isEmpty(ext2Param.serialNo)) {
				this.setSerialNo(ext2Param.serialNo);
			}
			// 37 operId
			if (!this.isEmpty(ext2Param.operId)) {
				this.setOperId(ext2Param.operId);
			}
			// 38 status
			if (!this.isEmpty(ext2Param.status)) {
				this.setStatus(ext2Param.status);
			}
			// 39 staffId
			if (!this.isEmpty(ext2Param.staffId)) {
				this.setStaffId(ext2Param.staffId);
			}
			// 40 mediaId
			if (!this.isEmpty(ext2Param.mediaId)) {
				this.setMediaId(ext2Param.mediaId);
			}
			// 41 channelId
			if (!this.isEmpty(ext2Param.channelId)) {
				this.setChannelId(ext2Param.channelId);
			}
			// 42 staffName
			if (!this.isEmpty(ext2Param.staffName)) {
				this.setStaffName(ext2Param.staffName);
			}
			// 43 userName
			if (!this.isEmpty(ext2Param.userName)) {
				this.setUserName(ext2Param.userName);
			}
			// 44 transFlag
			if (!this.isEmpty(ext2Param.transFlag)) {
				this.setTransFlag(ext2Param.transFlag);
			}
			// 45 isOutCall
			this.setIsOutCall(ext2Param.isOutCall);
			// 46 transferFlg
			this.setTransferFlg(ext2Param.transferFlg);

			// 44 transferType
			if (!this.isEmpty(ext2Param.transferType)) {
				this.setTransferType(ext2Param.transferType);
			}
		},

		setCallingInfo : function(callingInfo) {
			// 主叫号码routePackage.callerNo = callingInfo.callerNo
			if (!this.isEmpty(this.getCallerNo())) {
//				callingInfo.setCallerNo(this.getCallerNo());
//				callingInfo.setSubsNumber(this.getCallerNo());
			}
			// 被叫号码routePackage.calledNo = callingInfo.calledNo
			if (!this.isEmpty(this.getCalledNo())) {
//				callingInfo.setCalledNo(this.getCalledNo());
			}
			// 技能队列名routePackage.skillName = callingInfo.skillDesc
			if (!this.isEmpty(this.getSkillName())) {
				callingInfo.setSkillDesc(this.getSkillName());
			}
			// 键轨迹keyTrace
			if (!this.isEmpty(this.getKeyTrace())) {
				callingInfo.setKeyTrace(this.getKeyTrace());
			}
		},

		getValidateResult : function() {
			var resultJson = null;
			var typeId = this.getTypeId() ? this.getTypeId() : '';
			switch (typeId){
				case "002":
				case "006":
					var verifyResult =  this.getVerifyResult() ? this.getVerifyResult() : '';
					var ciperCode = this.getVerifyResult() ? this.getCiperCode() : '';
					var weakCodeFlg = this.getWeakCodeFlg() ? this.getWeakCodeFlg() : '';
					var ifPwdLocked = this.getIfPwdLocked() ? this.getIfPwdLocked() : '';
					var idCard = this.getIdCard() ? this.getIdCard() : '';
					var cardFailMsg = this.getCardFailMsg() ? this.getCardFailMsg() : '';
					var pwdAndFailFlg = this.getPwdAndFailFlg() ? this.getPwdAndFailFlg() : '';
					resultJson = {
						"typeId" : typeId,
						"verifyResult" : verifyResult,
						"ciperCode" : ciperCode,
						"weakCodeFlg" : weakCodeFlg,
						"ifPwdLocked" : ifPwdLocked,
						"idCard" : idCard,
						"cardFailMsg" : cardFailMsg,
						"pwdAndFailFlg" : pwdAndFailFlg
					}
					break;
				case "005":
					var subsNumber = this.getSubsNumber() ? this.getSubsNumber() : '';
					var contactId = this.getCallId() ? this.getCallId() : '';
					var transferMsg = this.getTransferMsg() ? this.getTransferMsg() : '';
					var workNo = this.getTransferWorkNo() ? this.getTransferWorkNo() : '';
					resultJson = {
						"typeId" : typeId,
						"operId" : "009",
						"status" : "1",
						"subsNumber" : subsNumber,
						"contactId" : contactId,
						"transferMsg" : transferMsg,
						"workNo" : workNo
					}
					break;
				case "0004":
					var serialNo = this.getSerialNo() ? this.getSerialNo() : '';
					var operId = this.getOperId() ? this.getOperId() : '';
					var status = this.getStatus() ? this.getStatus() : '';
					var subsNumber = this.getSubsNumber() ? this.getSubsNumber() : '';
					var contactId = this.getContactId() ? this.getContactId() : '';
					var transferMsg = this.getTransferMsg() ? this.getTransferMsg() : '';
					var staffId = this.getStaffId() ? this.getStaffId() : '';
					var mediaId = this.getMediaId() ? this.getMediaId() : '';
					var channelId = this.getChannelId() ? this.getChannelId() : '';
					var staffName = this.getStaffName() ? this.getStaffName() : '';
					var userName = this.getUserName() ? this.getUserName() : '';
					var transFlag = this.getTransFlag() === true ? true : false;
					var isOutCall = this.getIsOutCall() === true ? true : false;
					var transferFlg = this.getTransferFlg() ? this.getTransferFlg() : '';
					var workNo = this.getWorkNo() ? this.getWorkNo() : '';
					var transferType = this.getTransferType() ? this.getTransferType() : '';
					resultJson = {
						"typeId" : typeId,
						"serialNo" : serialNo,
						"operId" : operId,
						"status" : status,
						"subsNumber" : subsNumber,
						"contactId" : contactId,
						"transferMsg" : transferMsg,
						"staffId" : staffId,
						"mediaId" : mediaId,
						"channelId" : channelId,
						"staffName" : staffName,
						"userName" : userName,
						"transFlag" : transFlag,
						"isOutCall" : isOutCall,
						"transferFlg" : transferFlg,
						"workNo" : workNo,
						"transferType" : transferType
					}
					break;
				default:
					break;
			}
			return resultJson;
		},

		//1 typeId
		setTypeId : function(typeId) {
			this.typeId = typeId;
		},
		getTypeId : function() {
			return this.typeId;
		},

		//2 subsNumber
		setSubsNumber : function(subsNumber) {
			this.subsNumber = subsNumber;
		},
		getSubsNumber : function() {
			return this.subsNumber;
		},

		//3 transferWorkNo
		setTransferWorkNo : function(transferWorkNo) {
			this.transferWorkNo = transferWorkNo;
		},
		getTransferWorkNo : function() {
			return this.transferWorkNo;
		},

		//4 transferMsg
		setTransferMsg : function(transferMsg) {
			this.transferMsg = transferMsg;
		},
		getTransferMsg : function() {
			return this.transferMsg;
		},

		//5 callId
		setCallId : function(callId) {
			this.callId = callId;
		},
		getCallId : function() {
			return this.callId;
		},

		//6 callerNo
		setCallerNo : function(callerNo) {
			this.callerNo = callerNo;
		},
		getCallerNo : function() {
			return this.callerNo;
		},

		//7 oriSkillId
		setOriSkillId : function(oriSkillId) {
			this.oriSkillId = oriSkillId;
		},
		getOriSkillId : function() {
			return this.oriSkillId;
		},

		//8 oriSkillName
		setOriSkillName : function(oriSkillName) {
			this.oriSkillName = oriSkillName;
		},
		getOriSkillName : function() {
			return this.oriSkillName;
		},

		//9 skillId
		setSkillId : function(skillId) {
			this.skillId = skillId;
		},
		getSkillId : function() {
			return this.skillId;
		},

		//10 skillName
		setSkillName : function(skillName) {
			this.skillName = skillName;
		},
		getSkillName : function() {
			return this.skillName;
		},

		//11 extraMsg
		setExtraMsg : function(extraMsg) {
			this.extraMsg = extraMsg;
		},
		getExtraMsg : function() {
			return this.extraMsg;
		},

		//12 nodeId
		setNodeId : function(nodeId) {
			this.nodeId = nodeId;
		},
		getNodeId : function() {
			return this.nodeId;
		},

		//13 calledNo
		setCalledNo : function(calledNo) {
			this.calledNo = calledNo;
		},
		getCalledNo : function() {
			return this.calledNo;
		},

		//14 workNo
		setWorkNo : function(workNo) {
			this.workNo = workNo;
		},
		getWorkNo : function() {
			return this.workNo;
		},

		//15 workCode
		setWorkCode : function(workCode) {
			this.workCode = workCode;
		},
		getWorkCode : function() {
			return this.workCode;
		},

		//16 callTrace
		setCallTrace : function(callTrace) {
			this.callTrace = callTrace;
		},
		getCallTrace : function() {
			return this.callTrace;
		},

		//17 custBrand
		setCustBrand : function(custBrand) {
			this.custBrand = custBrand;
		},
		getCustBrand : function() {
			return this.custBrand;
		},

		//18 keyTrace
		setKeyTrace : function(keyTrace) {
			this.keyTrace = keyTrace;
		},
		getKeyTrace : function() {
			return this.keyTrace;
		},

		//19 callPort
		setCallPort : function(callPort) {
			this.callPort = callPort;
		},
		getCallPort : function() {
			return this.callPort;
		},

		//20 verifyResult
		setVerifyResult : function(verifyResult) {
			this.verifyResult = verifyResult;
		},
		getVerifyResult : function() {
			return this.verifyResult;
		},

		//21 ciperCode
		setCiperCode : function(ciperCode) {
			this.ciperCode = ciperCode;
		},
		getCiperCode : function() {
			return this.ciperCode;
		},

		//22 weakCodeFlg
		setWeakCodeFlg : function(weakCodeFlg) {
			this.weakCodeFlg = weakCodeFlg;
		},
		getWeakCodeFlg : function() {
			return this.weakCodeFlg;
		},

		//23 idCard
		setIdCard : function(idCard) {
			this.idCard = idCard;
		},
		getIdCard : function() {
			return this.idCard;
		},

		//24 ifPwdLocked
		setIfPwdLocked : function(ifPwdLocked) {
			this.ifPwdLocked = ifPwdLocked;
		},
		getIfPwdLocked : function() {
			return this.ifPwdLocked;
		},

		//25 cardFailMsg
		setCardFailMsg : function(cardFailMsg) {
			this.cardFailMsg = cardFailMsg;
		},
		getCardFailMsg : function() {
			return this.cardFailMsg;
		},

		//26 systemFlg
		setSystemFlg : function(systemFlg) {
			this.systemFlg = systemFlg;
		},
		getSystemFlg : function() {
			return this.systemFlg;
		},

		//27 contactId
		setContactId : function(contactId) {
			this.contactId = contactId;
		},
		getContactId : function() {
			return this.contactId;
		},

		//28 opId
		setOpId : function(opId) {
			this.opId = opId;
		},
		getOpId : function() {
			return this.opId;
		},

		//29 yjkf
		setYjkf : function(yjkf) {
			this.yjkf = yjkf;
		},
		getYjkf : function() {
			return this.yjkf;
		},

		//30 ext2Data
		setExt2Data : function(ext2Data) {
			this.ext2Data = ext2Data;
		},
		getExt2Data : function() {
			return this.ext2Data;
		},

		//31 agentPhoneNo
		setAgentPhoneNo : function(agentPhoneNo) {
			this.agentPhoneNo = agentPhoneNo;
		},
		getAgentPhoneNo : function() {
			return this.agentPhoneNo;
		},

		//32 sceneFlg
		setSceneFlg : function(sceneFlg) {
			this.sceneFlg = sceneFlg;
		},
		getSceneFlg : function() {
			return this.sceneFlg;
		},

		//33 pwdAndFailFlg
		setPwdAndFailFlg : function(pwdAndFailFlg) {
			this.pwdAndFailFlg = pwdAndFailFlg;
		},
		getPwdAndFailFlg : function() {
			return this.pwdAndFailFlg;
		},

		//34 nodeDetail
		setNodeDetail : function(nodeDetail) {
			this.nodeDetail = nodeDetail;
		},
		getNodeDetail : function() {
			return this.nodeDetail;
		},

		//35 satisfyData
		setSatisfyData : function(satisfyData) {
			this.satisfyData = satisfyData;
		},
		getSatisfyData : function() {
			return this.satisfyData;
		},

		//36 serialNo
		setSerialNo : function(serialNo) {
			this.serialNo = serialNo;
		},
		getSerialNo : function() {
			return this.serialNo;
		},

		//37 operId
		setOperId : function(operId) {
			this.operId = operId;
		},
		getOperId : function() {
			return this.operId;
		},

		//38 status
		setStatus : function(status) {
			this.status = status;
		},
		getStatus : function() {
			return this.status;
		},

		//39 staffId
		setStaffId : function(staffId) {
			this.staffId = staffId;
		},
		getStaffId : function() {
			return this.staffId;
		},

		//40 mediaId
		setMediaId : function(mediaId) {
			this.mediaId = mediaId;
		},
		getMediaId : function() {
			return this.mediaId;
		},

		//41 channelId
		setChannelId : function(channelId) {
			this.channelId = channelId;
		},
		getChannelId : function() {
			return this.channelId;
		},

		//42 staffName
		setStaffName : function(staffName) {
			this.staffName = staffName;
		},
		getStaffName : function() {
			return this.staffName;
		},

		//43 userName
		setUserName : function(userName) {
			this.userName = userName;
		},
		getUserName : function() {
			return this.userName;
		},

		//44 transFlag
		setTransFlag : function(transFlag) {
			this.transFlag = transFlag;
		},
		getTransFlag : function() {
			return this.transFlag;
		},

		//45 isOutCall
		setIsOutCall : function(isOutCall) {
			this.isOutCall = isOutCall;
		},
		getIsOutCall : function() {
			return this.isOutCall;
		},

		//46 transferFlg
		setTransferFlg : function(transferFlg) {
			this.transferFlg = transferFlg;
		},
		getTransferFlg : function() {
			return this.transferFlg;
		},

		//46 transferType
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
	return ext2Gx;
});