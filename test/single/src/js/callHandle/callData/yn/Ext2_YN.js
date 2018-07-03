define(function(){
	var ext2Yn = function() {
		this.typeId
		this.serviceNumber;
		this.opId;
		this.planId;
		this.taskId;
		this.transferCode;
		this.callId;
	};
	ext2Yn.prototype = {
		init : function() {
			this.setTypeId(null);
			this.setServiceNumber(null);
			this.setOpId(null);
			this.setPlanId(null);
			this.setTaskId(null);
			this.setTransferCode(null);
			this.setCallId(null);
		},
		
		splitData : function(data) {
			var fieldArray = data.split('~');
			this.setTypeId(fieldArray[0]);
			this.setServiceNumber(fieldArray[1]);
			this.setOpId(fieldArray[2]);
			this.setPlanId(fieldArray[3]);
			this.setTaskId(fieldArray[4]);
			this.setTransferCode(fieldArray[5]);
			var field6Array = fieldArray[6].split('|');
			this.setCallId(field6Array[0]);
		},
		
		unitData : function() {
			var result = null;
			var typeId = this.getTypeId() ? this.getTypeId() : '';
			var serviceNumber = this.getServiceNumber() ? this.getServiceNumber() : '';
			var opId = this.getOpId() ? this.getOpId() : '';
			var planId = this.getPlanId() ? this.getPlanId() : '';
			var taskId = this.getTaskId() ? this.getTaskId() : '';
			var transferCode = this.getTransferCode() ? this.getTransferCode() : '';
			var callId = this.getCallId() ? this.getCallId() : '';
			
			result = typeId + '~' + serviceNumber + '~' + opId + '~' 
					+ planId + '~' + taskId + '~' + transferCode + '~'
					+ callId + '|' + callId + '~'
			return result;
		},
		
		setTypeId : function(typeId) {
			this.typeId = typeId;
		},
		getTypeId : function() {
			return this.typeId;
		},
		
		setServiceNumber : function(serviceNumber) {
			this.serviceNumber = serviceNumber;
		},
		getServiceNumber : function() {
			return this.serviceNumber;
		},
		
		setOpId : function(opId) {
			this.opId = opId;
		},
		getOpId : function() {
			return this.opId;
		},
		
		setPlanId : function(planId) {
			this.planId = planId;
		},
		getPlanId : function() {
			return this.planId;
		},
		
		setTaskId : function(taskId) {
			this.taskId = taskId;
		},
		getTaskId : function() {
			return this.taskId;
		},
		
		setTransferCode : function(transferCode) {
			this.transferCode = transferCode;
		},
		getTransferCode : function() {
			return this.transferCode;
		},
		
		setCallId : function(callId) {
			this.callId = callId;
		},
		getCallId : function() {
			return this.callId;
		}
	}
	return ext2Yn;
});