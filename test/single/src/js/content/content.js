define(['Util',
		'./chatArea/chatArea',
		'./chatInfo/chatInfo',
        '../../tpl/content/content.tpl',
        '../../assets/css/content/content.css',
        ], function(Util,ChatArea,ChatInfo,tpl){

	var _index=null;

	var initialize = function(index,options){
		_index=index;
		var template = Util.hdb.compile(tpl);
		var params;
		params = $.extend({
			serialNo:''
		},options);
		var $content = $(template(params));
		this.$content = $content;
		//聊天区
		var chatArea = new ChatArea(_index,options);
		//右侧信息区
		var chatInfo = new ChatInfo(_index,options);
		$content.find('.chat-show').append(chatArea.content);
		$content.find('.chat-right').append(chatInfo.info);
		chatArea.moreBtnClick();
		return $content;

	};

	$.extend(initialize.prototype, {

	});

	return initialize;
});
