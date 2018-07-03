/**
 * 可赋人员配置 by wst 
 *
 */
define(['js/constants/mediaConstants'],
        function(Constants){
		var initialize=function(indexModule,options){
			index = indexModule;
			var $el = $('<div  style="text-align:center;"><img class="displayPic"  src="'+Constants.PICTURE_URL_PREFIX + options.picurl+'"  /></div>');
			this.content=$el;
			$el.on('click','.displayPic',$.proxy(displayPic,this));
			
		}
		
		 var displayPic = function(opt) {			  
			 index.destroyDialog();
		 }

	
	return initialize;
});