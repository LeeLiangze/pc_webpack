define(function(){
	var ext2Data = function() {
		this.contactId;
		this.custFlg;
		this.custName;
		this.custAreaCode;
		this.custBrand;
		this.custStarLv;
		this.custMidHighFlg;
		this.custStatus;
		this.contentDesc;
		this.acceptOpId;
		this.provinceVdnInfo;
		this.uniqueElementInfo;
	};
	ext2Data.prototype = {
			//0 init
			init : function() {
				this.setContactId(null);			
				this.setCustFlg(null);			
				this.setCustName(null);			
				this.setCustAreaCode(null);			
				this.setCustBrand(null);			
				this.setCustStarLv(null);			
				this.setCustMidHighFlg(null);			
				this.setCustStatus(null);			
				this.setContentDesc(null);			
				this.setAcceptOpId(null);			
				this.setProvinceVdnInfo(null);			
				this.setUniqueElementInfo(null);			
			},
			
			unitData : function() {
				var result = null;
				var contactId = this.getContactId() ? this.getContactId() : '';
				var custFlg = this.getCustFlg() ? this.getCustFlg() : '';
				var custName = this.getCustName() ? this.getCustName() : '';
				var custAreaCode = this.getCustAreaCode() ? this.getCustAreaCode() : '';
				var custBrand = this.getCustBrand() ? this.getCustBrand() : '';
				var custStarLv = this.getCustStarLv() ? this.getCustStarLv() : '';
				var custMidHighFlg = this.getCustMidHighFlg() ? this.getCustMidHighFlg() : '';
				var custStatus = this.getCustStatus() ? this.getCustStatus() : '';
				var contentDesc = this.getContentDesc() ? this.getContentDesc() : '';
				var acceptOpId = this.getAcceptOpId() ? this.getAcceptOpId() : '';
				var provinceVdnInfo = this.getProvinceVdnInfo() ? this.getProvinceVdnInfo() : '';
				var uniqueElementInfo = this.getUniqueElementInfo() ? this.getUniqueElementInfo() : '';
				
				result = contactId + '~'
							+ custFlg + '~'
							+ custName + '~'
							+ custAreaCode + '~'
							+ custBrand + '~'
							+ custStarLv + '~'
							+ custMidHighFlg + '~'
							+ custStatus + '~'
							+ contentDesc + '~'
							+ acceptOpId + '~'
							+ provinceVdnInfo + '~'
							+ uniqueElementInfo;
				return result;
			},
			
			//1	contactId
			setContactId : function(contactId) {
				this.contactId = contactId;
			},
			getContactId : function() {
				return this.contactId;
			},
			
			//2	custFlg
			setCustFlg : function(custFlg) {
				this.custFlg = custFlg;
			},
			getCustFlg : function() {
				return this.custFlg;
			},
			
			//3	custName
			setCustName : function(custName) {
				this.custName = custName;
			},
			getCustName : function() {
				return this.custName;
			},
			
			//4	custAreaCode
			setCustAreaCode : function(custAreaCode) {
				this.custAreaCode = custAreaCode;
			},
			getCustAreaCode : function() {
				return this.custAreaCode;
			},
			
			//5 custBrand
			setCustBrand : function(custBrand) {
				this.custBrand = custBrand;
			},
			getCustBrand : function() {
				return this.custBrand;
			},
			
			//6 custStarLv
			setCustStarLv : function(custStarLv) {
				this.custStarLv = custStarLv;
			},
			getCustStarLv : function() {
				return this.custStarLv;
			},
			
			//7 custMidHighFlg
			setCustMidHighFlg : function(custMidHighFlg) {
				this.custMidHighFlg = custMidHighFlg;
			},
			getCustMidHighFlg : function() {
				return this.custMidHighFlg;
			},
			
			//8 custStatus
			setCustStatus : function(custStatus) {
				this.custStatus = custStatus;
			},
			getCustStatus : function() {
				return this.custStatus;
			},
			
			//9 contentDesc
			setContentDesc : function(contentDesc) {
				this.contentDesc = contentDesc;
			},
			getContentDesc : function() {
				return this.contentDesc;
			},
			
			//10 acceptOpId
			setAcceptOpId : function(acceptOpId) {
				this.acceptOpId = acceptOpId;
			},
			getAcceptOpId : function() {
				return this.acceptOpId;
			},
			
			//11 provinceVdnInfo
			setProvinceVdnInfo : function(provinceVdnInfo) {
				this.provinceVdnInfo = provinceVdnInfo;
			},
			getProvinceVdnInfo : function() {
				return this.provinceVdnInfo;
			},
			
			//12 uniqueElementInfo
			setUniqueElementInfo : function(uniqueElementInfo) {
				this.uniqueElementInfo = uniqueElementInfo;
			},
			getUniqueElementInfo : function() {
				return this.uniqueElementInfo;
			}
	}
	return ext2Data;
});