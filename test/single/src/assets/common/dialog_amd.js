/*
*	@author: fanyu
*	@date: 2015-09-22
*	@desc: 弹出窗口控制，基于jquery组件artdialog
'assets/common/eventTarget',eventTarget
*/
define(['artDialog',
	'../lib/dialog/6.0.4/css/ui-dialog.css'],
	function(){

	var version = '1.0.1';
	var artDialog={
		version:version,
		get:function(id){
			return dialog.get(id);
		},
		openDiv: function(params){
			var config = $.extend({
		        id:params.id,
				fixed: true,
			    title: params.title,
			    content: params.content,
			    okValue: params.okVal,
		        ok: params.okCallback,
		        cancelValue: params.cancelVal,
		        cancel: params.cancelCallback,
		        onclose: params.closeCallback	//关闭对话框回调函数
		    },params);
			params.url&&(config.url=params.url);
			var d = dialog(config);
			//d.width(params.width); 宽高artDialog已默认支持
			//d.height(params.height);
			if (params.modal) {
				d.showModal();
			}else{
				d.show();
			}
			return d;
		},
		openIframe: function(params){
			var config = $.extend({
				id:params.id,
				fixed: true,
				title: params.title,
				content: params.content,
				okValue: params.okVal,
				ok: params.okCallback,
				cancelValue: params.cancelVal,
				cancel: params.cancelCallback,
				onclose: params.closeCallback	//关闭对话框回调函数
			},params);
			var d = dialog(config);
			//d.width(params.width); 宽高artDialog已默认支持
			//d.height(params.height);
			if (params.modal) {
				d.showModal();
			}else{
				d.show();
			}
			return d;
		},
		tips: function(content, delay){
			var d = dialog({
				fixed: true,
				quickClose: false,	//点击空白处弹出框消失
			    content: content
			});
			d.show();
			setTimeout(function () {
			    d.close().remove();
			}, delay || 1500);
		},
		confirm: function(params){
			var d = dialog({
				id:'D_confirm',
	        	title: params.title?params.title:'',
				fixed: true,
			    content: params.content,
			    okValue: params.okVal?params.okVal:'确认',
		        ok: params.okCallback,
		        cancelValue: params.cancelVal?params.cancelVal:'取消',
		        cancel :function(){
		            return;
		        }
			});
			d.showModal();
		},
		close: function(id){
		    dialog.get(id).close();
		},
		bubble:function(arguments){
			var d = null;
			if (typeof(arguments) === 'object' && arguments.element){
				arguments.content = arguments.content || '没有内容';
				arguments.quickClose = arguments.quickClose == null ? true : arguments.quickClose ;
				d = dialog(arguments);
				d.show(arguments.element.length ? arguments.element[0] :arguments.element);
			}else{
				d.show();
			}
		},
		popWin:function(options){
			// eventTarget.call(this);
			options._index=$.extend(options._index, {
				dialog:artDialog,
				_self:this
			});
			var params=this.options=$.extend({modal:true}, options);
			var d = dialog({
				id:params.id,
				fixed:true,
				title: params.title,
				okValue: params.okVal?params.okVal:"确定",
				cancelValue: params.cancelVal?params.cancelVal:"取消",
				ok:$.proxy(function(){this.trigger("ok")},this),
				cancel: $.proxy(function(){this.trigger("cancel")},this),
				onclose: $.proxy(function(){this.trigger("close")},this)
			});
			d.width(params.width?params.width:900);
			d.height(params.height?params.height:450);
			//$.extend(params._index, {popWin:d});
			require.undef(params.url);
			require([params.url], $.proxy(function(_html){
				if (typeof(_html) === 'function'){
					var result = _html(params._index);
					d.content(result);
				}else{
					d.content(_html.content);
				}
				(params.modal)?d.showModal():d.show();
			}, this));
		}
	};
	// $.extend(artDialog.popWin.prototype,eventTarget.prototype);
	return artDialog
});