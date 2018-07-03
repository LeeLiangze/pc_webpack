define([
         '../../../tpl/comMenu/sendMessage/sendSMS.tpl'],
	 function(tpl) {
		var _indexModule = null;
		var $el;
		var initialize = function(options,param) {
			$el = $(tpl)
			//郑州
			//$el.find('iframe').attr("src","https://192.168.100.36:8843/ngbusi_gx/src/module/others/sms/sendSms.html");
			//洛阳测试
//			var url = "http://"+window.location.host+"/ngbusi_gx/src/module/others/sms/sendSms.html";
			var url = param.url;
			$el.find('iframe').attr("src",url);
			this.content = $el;
		};
		return initialize;
});

