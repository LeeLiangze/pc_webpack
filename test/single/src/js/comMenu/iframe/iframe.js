define(['../../../tpl/comMenu/iframe/iframe.tpl'],
	 function(tpl) {
		var _indexModule = null;
		var $el;
		var initialize = function(options,param) {
			$el = $(tpl)
			//洛阳生产环境受理请求地址：<http://ngwf-gx.cs.cmos/ngwf_gx/src/module/sr/accept/requestAccept.html> 
            //郑州测试环境受理请求地址：<https://192.168.100.36:8843/ngwf_gx/src/module/sr/accept/requestAccept.html>
			//郑州发送短信"https://192.168.100.36:8843/ngbusi_gx/src/module/others/sms/sendSms.html";
			//洛阳生产发送短信http://ngbusi-gx.cs.cmos/ngbusi_gx/src/module/others/sms/sendSms.html
			//var url = "http://"+window.location.host+param.url;
			var url = param.url;
			$el.find('iframe').attr("src",url);
			this.content = $el;
		};
		return initialize;
});