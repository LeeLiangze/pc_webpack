define([ 'Util',
         '../../tpl/nav/anoceDetail.tpl'],
	 function(Util,tpl) {
		var _indexModule = null;
		var $el;
		var initialize = function(options) {
			$el = $(tpl)
        	Util.ajax.postJson( {itemId:"129002003"},function(Data,status) {
				if(status){	 
					$el.find('iframe').attr("src",Data.bean.value);
				}
			},true);	
			this.content = $el;
		};
		return initialize;
});

