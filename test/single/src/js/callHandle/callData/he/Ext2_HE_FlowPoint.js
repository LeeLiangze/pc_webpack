define(function(){
	var ext2HeFlowPoint = function() {
		this.serviceTypeId;
		this.cityCode;
		this.userClass;
		this.userType;
		this.digitCode;
		this.serviceNo;
	};
	ext2HeFlowPoint.prototype = {
		setServiceTypeId : function(serviceTypeId) {
			this.serviceTypeId = serviceTypeId;
		},
		getServiceTypeId : function() {
			return this.serviceTypeId;
		},
		
		setCityCode : function(cityCode) {
			this.cityCode = cityCode;
		},
		getCityCode : function() {
			return this.cityCode;
		},
		
		setUserClass : function(userClass) {
			this.userClass = userClass;
		},
		getUserClass : function() {
			return this.userClass;
		},
		
		setUserType : function(userType) {
			this.userType = userType;
		},
		getUserType : function() {
			return this.userType;
		},
		
		setDigitCode : function(digitCode) {
			this.digitCode = digitCode;
		},
		getDigitCode : function() {
			return this.digitCode;
		},
		
		setServiceNo : function(serviceNo) {
			this.serviceNo = serviceNo;
		},
		getServiceNo : function() {
			return this.serviceNo;
		}
	}
	return ext2HeFlowPoint;
});