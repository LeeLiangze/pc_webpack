define(['../../../../tpl/comMenu/comprehensiveCommunication/automaticProcess/shortMsgTextarea.tpl'],function(tpl){
	var _index;
    var $el;
	var initialize = function(index){
		_index = index;
		$el = $(tpl);
		if(_index.content) {
			$(".shortMsgArea",$el).val(_index.content);
		}else{
			$(".shortMsgArea",$el).val("");
		}
		this.content = $el;
    };
    return initialize;
})
