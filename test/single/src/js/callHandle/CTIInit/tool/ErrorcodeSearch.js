/**
 * Created by liubigeng 错误码检索
 * update by zzy 2017/1/14
 */
define(function() {

	var ErrorcodeSearch = function(index) {
		return returnObj.call(this);
	};
	function returnObj() {
		var obj = {
			ErrorcodeSearch : function(errorcode, defaulterrormsg) {
				var errorCodeArray = {
					'1128' : "内部呼叫或者特殊呼叫，不能进行转移、转出、内部求助、静音、二次拨号、保持等操作",
					'1129' : "保持的呼叫超过允许值",
					'1130' : "保持呼叫过多",
					'35011': "当前处于静音或静像状态，不允许此操作",
					'1119': "座席不是空闲状态",
					'1173' : "座席不处于两方通话状态，不允许此类操作",
					'1138' : "被叫挂断",
					'20352' : "座席不能接收该内部呼叫",
					'25212' :"非空闲状态下不允许该操作",
					'25221' : "内部呼叫或三方通话不允许拦截",
					'150006' : "通话保持状态下不能进行内部求助",
					'155046' : "权限不允许强制示忙、示闲、休息、签出",
					'20505' : "非法的座席工号",
					'110000' : "已经对目标坐席进行强制休息操作"
				};
				for (var code in errorCodeArray) {
					if (code == errorcode) {
						return errorCodeArray[errorcode];
					}
				}
				return defaulterrormsg;
			}
		}

		return obj;
	}
	;
	// 向外暴漏的方法，可被外部调用
	ErrorcodeSearch.prototype = {};
	return ErrorcodeSearch
});
