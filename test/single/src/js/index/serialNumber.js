/**
 * 生成前端流水号
 * 获取流水号方式： index.serialNumber.getSerialNumber();
 * 重置流水号方式：index.serialNumber.resetSerialNumber();
 *   
 */
define(function(){
	
	var startNum=0;
	
	var opserialno = function(){
		return returnObj.call(this);
	};
	
	var returnObj = function(){
		return {
			getSerialNumber:function(){
				 startNum = startNum+1;
				 return startNum;
			},
			resetSerialNumber:function(){
				startNum = 0;
			}
		};
	};
	
	return opserialno;
});
 
 
 
 
