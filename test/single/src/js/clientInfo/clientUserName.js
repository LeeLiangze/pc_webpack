define([
         '../../tpl/clientInfo/clientUserName.tpl'],
	 function(tpl) {
		var _indexModule = null;
		var $el;
		var initialize = function(index,options) {
			$el = $(tpl)
			var url = options.url;
			$el.find('iframe').attr("src",url);
			this.content = $el;
		};

		return initialize;
});

