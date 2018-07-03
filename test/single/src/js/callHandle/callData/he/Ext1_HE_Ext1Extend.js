define(function(){
	var ext1HeExtend = function() {
		this.queryScoreFlag;
		this.touchOid;
		this.temp_Fgf;
		this.serachFlag;
	};
	ext1HeExtend.prototype = {
			//1	queryScoreFlag
			setQueryScoreFlag : function(queryScoreFlag) {
				this.queryScoreFlag = queryScoreFlag;
			},
			getQueryScoreFlag : function() {
				return this.queryScoreFlag;
			},
			
			//2	touchOid
			setTouchOid : function(touchOid) {
				this.touchOid = touchOid;
			},
			getTouchOid : function() {
				return this.touchOid;
			},
			
			//3	temp_Fgf
			setTemp_Fgf : function(temp_Fgf) {
				this.temp_Fgf = temp_Fgf;
			},
			getTemp_Fgf : function() {
				return this.temp_Fgf;
			},
			
			//4	serachFlag
			setSerachFlag : function(serachFlag) {
				this.serachFlag = serachFlag;
			},
			getSerachFlag : function() {
				return this.serachFlag;
			}
	}
	return ext1HeExtend;
});