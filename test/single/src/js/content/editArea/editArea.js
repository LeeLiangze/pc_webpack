define([
        'editor',
        './editAreaEvent',
        './chatTools',
        '../../../tpl/content/editArea/editArea.tpl',
        '../../../assets/css/content/editArea/editArea.css'
        ], function(Editor,EditAreaEvent,ChatTools,tpl){

	var $el;
	var _index;
	var editor;
	var contactId;
	var editArea = null;
	var object = function(options,data){
		$el = $(tpl);
		_index = options._index;
		this.$el = $el;
		this.chatEditInPanels = {};
		this.$editEl = $(options.el);
		this.creatChartEdit();
		 //引入客户编辑区事件处理
		var editAreaEvent = new EditAreaEvent(options._index,$el,editor,data);
		var chatTools = new ChatTools(options._index,$el,editor,data);
		this.content = $el;
	};

	$.extend(object.prototype, {
        creatChartEdit:function(){
        	editor = new Editor({
			    el:$(".editor",$el)        //要绑定的容器
			    //,content:$.trim('')   //要在富文本框中显示的默认值
			    ,initialFrameHeight:88
			    ,initialFrameWidth:'100%'
			    ,toolbars: [[]]
				,elementPathEnabled: false //删除元素路径
			    //,wordCount: false    //删除字数统计
				,maximumWords : 900//最大字符数
				,saveInterval: 5000000
        		,initialStyle:'p{line-height:1em;font-size:14px;color:#666}'
			});
			$el.appendTo(this.$editEl.find('.uiTabItemBody')[0]);
			this.editor = editor;
			_index.editor = editor;
        }
    });
	return object;
});
