define(function(){
	var ext2Hl = function() {
		this.typeId;
		this.pwdVerifyType;
		this.pwdVerifyReserve;
		this.subsNumber;
		this.pwdVerifyResult;
		this.ifOweFee;
		this.tmpPwdFromBoss;
		this.workNo;
		this.skillName;
		this.soundFileName;
		this.userPhoneNum;
		this.faxFileName;
		this.flowPoint = new Array();
	};
	ext2Hl.prototype = {
		setTypeId : function(typeId) {
			this.typeId = typeId;
		},
		getTypeId : function() {
			return this.typeId;
		},
		
		setPwdVerifyType : function(pwdVerifyType) {
			this.pwdVerifyType = pwdVerifyType;
		},
		getPwdVerifyType : function() {
			return this.pwdVerifyType;
		},
		
		setPwdVerifyReserve : function(pwdVerifyReserve) {
			this.pwdVerifyReserve = pwdVerifyReserve;
		},
		getPwdVerifyReserve : function() {
			return this.pwdVerifyReserve;
		},
		
		setSubsNumber : function(subsNumber) {
			this.subsNumber = subsNumber;
		},
		getSubsNumber : function() {
			return this.subsNumber;
		},
		
		setPwdVerifyResult : function(pwdVerifyResult) {
			this.pwdVerifyResult = pwdVerifyResult;
		},
		getPwdVerifyResult : function() {
			return this.pwdVerifyResult;
		},
		
		setIfOweFee : function(ifOweFee) {
			this.ifOweFee = ifOweFee;
		},
		getIfOweFee : function() {
			return this.ifOweFee;
		},
		
		setTmpPwdFromBoss : function(tmpPwdFromBoss) {
			this.tmpPwdFromBoss = tmpPwdFromBoss;
		},
		getTmpPwdFromBoss : function() {
			return this.tmpPwdFromBoss;
		},
		
		setWorkNo : function(workNo) {
			this.workNo = workNo;
		},
		getWorkNo : function() {
			return this.workNo;
		},
		
		setSkillName : function(skillName) {
			this.skillName = skillName;
		},
		getSkillName : function() {
			return this.skillName;
		},
		
		setSoundFileName : function(soundFileName) {
			this.soundFileName = soundFileName;
		},
		getSoundFileName : function() {
			return this.soundFileName;
		},
		
		setUserPhoneNum : function(userPhoneNum) {
			this.userPhoneNum = userPhoneNum;
		},
		getUserPhoneNum : function() {
			return this.userPhoneNum;
		},
		
		setFaxFileName : function(faxFileName) {
			this.faxFileName = faxFileName;
		},
		getFaxFileName : function() {
			return this.faxFileName;
		},
		
		setFlowPoint : function(flowPoint) {
			this.flowPoint[this.flowPoint.length] = flowPoint;
		},
		getFlowPoint : function() {
			return this.flowPoint;
		}
	}
	return ext2Hl;
});