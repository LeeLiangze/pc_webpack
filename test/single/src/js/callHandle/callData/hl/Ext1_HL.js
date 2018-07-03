define(function(){
	var ext1Hl = function() {
		this.sptFlag;
		this.serviceType;
		this.serviceNum;
		this.oldPassWord;
		this.feeType;
		this.handSetCheckResult;
		this.cause;
		this.feeFlag;
		this.tmpUserClass;
		this.workNo;
		this.ifDigitLog;
		this.ext1Extend;
		this.vCard;
		this.vCheckFlag;
		this.vCardNo;
		this.myKfAccessMode;
		this.myKfDel;
		this.myKfFlag;
		this.myKfSign;
		this.myKfTransAgent;
		this.myKfIvr;
		this.touchId;
		this.touchNo;
		this.touchFlg;
		this.qasIvrFlag;
		this.flagProcOrDll;
		this.getTouchSnFlg;
		this.touchSn_Tail;
		this.touchSn_ErrNumber;
		this.agentToIvr;
	};
	ext1Hl.prototype = {
			//1	setSptFlag
			setSptFlag : function(sptFlag) {
				this.sptFlag = sptFlag;
			},
			getSptFlag : function() {
				return this.sptFlag;
			},
			
			//2	serviceType
			setServiceType : function(serviceType) {
				this.serviceType = serviceType;
			},
			getServiceType : function() {
				return this.serviceType;
			},
			
			//3	serviceNum
			setServiceNum : function(serviceNum) {
				this.serviceNum = serviceNum;
			},
			getServiceNum : function() {
				return this.serviceNum;
			},
			
			//4	oldPassWord
			setOldPassWord : function(oldPassWord) {
				this.oldPassWord = oldPassWord;
			},
			getOldPassWord : function() {
				return this.oldPassWord;
			},
			
			//5	feeType
			setFeeType : function(feeType) {
				this.feeType = feeType;
			},
			getFeeType : function() {
				return this.feeType;
			},
			
			//6	handSetCheckResult
			setHandSetCheckResult : function(handSetCheckResult) {
				this.handSetCheckResult = handSetCheckResult;
			},
			getHandSetCheckResult : function() {
				return this.handSetCheckResult;
			},
			
			//7	cause
			setCause : function(cause) {
				this.cause = cause;
			},
			getCause : function() {
				return this.cause;
			},
			
			//8	feeFlag
			setFeeFlag : function(feeFlag) {
				this.feeFlag = feeFlag;
			},
			getFeeFlag : function() {
				return this.feeFlag;
			},
			
			//9	tmpUserClass
			setTmpUserClass : function(tmpUserClass) {
				this.tmpUserClass = tmpUserClass;
			},
			getTmpUserClass : function() {
				return this.tmpUserClass;
			},
			
			//10	workNo
			setWorkNo : function(workNo) {
				this.workNo = workNo;
			},
			getWorkNo : function() {
				return this.workNo;
			},
			
			//11	ifDigitLog
			setIfDigitLog : function(ifDigitLog) {
				this.ifDigitLog = ifDigitLog;
			},
			getIfDigitLog : function() {
				return this.ifDigitLog;
			},
			
			//12	ext1Extend
			setExt1Extend : function(ext1Extend) {
				this.ext1Extend = ext1Extend;
			},
			getExt1Extend : function() {
				return this.ext1Extend;
			},
			
			//13	vCard
			setVCard : function(vCard) {
				this.vCard = vCard;
			},
			getVCard : function() {
				return this.vCard;
			},
			
			//14	vCheckFlag
			setVCheckFlag : function(vCheckFlag) {
				this.vCheckFlag = vCheckFlag;
			},
			getVCheckFlag : function() {
				return this.vCheckFlag;
			},
			
			//15	vCardNo
			setVCardNo : function(vCardNo) {
				this.vCardNo = vCardNo;
			},
			getVCardNo : function() {
				return this.vCardNo;
			},
			
			//16	myKfAccessMode
			setMyKfAccessMode : function(myKfAccessMode) {
				this.myKfAccessMode = myKfAccessMode;
			},
			getMyKfAccessMode : function() {
				return this.myKfAccessMode;
			},
			
			//17	myKfDel
			setMyKfDel : function(myKfDel) {
				this.myKfDel = myKfDel;
			},
			getMyKfDel : function() {
				return this.myKfDel;
			},
			
			//18	myKfFlag
			setMyKfFlag : function(myKfFlag) {
				this.myKfFlag = myKfFlag;
			},
			getMyKfFlag : function() {
				return this.myKfFlag;
			},
			
			//19	myKfSign
			setMyKfSign : function(myKfSign) {
				this.myKfSign = myKfSign;
			},
			getMyKfSign : function() {
				return this.myKfSign;
			},
			
			//20	myKfTransAgent
			setMyKfTransAgent : function(myKfTransAgent) {
				this.myKfTransAgent = myKfTransAgent;
			},
			getMyKfTransAgent : function() {
				return this.myKfTransAgent;
			},
			
			//21	myKfIvr
			setMyKfIvr : function(myKfIvr) {
				this.myKfIvr = myKfIvr;
			},
			getMyKfIvr : function() {
				return this.myKfIvr;
			},
			
			//22	touchId
			setTouchId : function(touchId) {
				this.touchId = touchId;
			},
			getTouchId : function() {
				return this.touchId;
			},
			
			//23	touchNo
			setTouchNo : function(touchNo) {
				this.touchNo = touchNo;
			},
			getTouchNo : function() {
				return this.touchNo;
			},
			
			//24	touchFlg
			setTouchFlg : function(touchFlg) {
				this.touchFlg = touchFlg;
			},
			getTouchFlg : function() {
				return this.touchFlg;
			},
			
			//25	qasIvrFlag
			setQasIvrFlag : function(qasIvrFlag) {
				this.qasIvrFlag = qasIvrFlag;
			},
			getQasIvrFlag : function() {
				return this.qasIvrFlag;
			},
			
			//26	flagProcOrDll
			setFlagProcOrDll : function(flagProcOrDll) {
				this.flagProcOrDll = flagProcOrDll;
			},
			getFlagProcOrDll : function() {
				return this.flagProcOrDll;
			},
			
			//27	getTouchSnFlg
			setGetTouchSnFlg : function(getTouchSnFlg) {
				this.getTouchSnFlg = getTouchSnFlg;
			},
			getGetTouchSnFlg : function() {
				return this.getTouchSnFlg;
			},
			
			//28	touchSn_Tail
			setTouchSn_Tail : function(touchSn_Tail) {
				this.touchSn_Tail = touchSn_Tail;
			},
			getTouchSn_Tail : function() {
				return this.touchSn_Tail;
			},
			
			//29	touchSn_ErrNumber
			setTouchSn_ErrNumber : function(touchSn_ErrNumber) {
				this.touchSn_ErrNumber = touchSn_ErrNumber;
			},
			getTouchSn_ErrNumber : function() {
				return this.touchSn_ErrNumber;
			},
			
			//30	agentToIvr
			setAgentToIvr : function(agentToIvr) {
				this.agentToIvr = agentToIvr;
			},
			getAgentToIvr : function() {
				return this.agentToIvr;
			}
	}
	return ext1Hl;
});