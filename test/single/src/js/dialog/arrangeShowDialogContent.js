define(
 	function(){
		var initialize = function(index,option){
			$el = $("<div style='text-align:center;font-size:14px;height:45px;line-height:35px;'>"+option+"</div>");
			this.content = $el; 
		}
		return initialize;
	});