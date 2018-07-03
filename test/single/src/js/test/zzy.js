define(['../../tpl/test/zzy.tpl'],function(tpl){
	var obj = function(index){
		this.content = $(tpl);
		index.showDialog({
			title : "index.showDialog1",   //弹出窗标题
			url :"",//要加载的模块
			param : {},    //要传递的参数，可以是json对象
			width : 200,  //对话框宽度
			height : 200  //对话框高度
		});
		index.showDialog({
			title : "index.showDialog2",   //弹出窗标题
			url :"",//要加载的模块
			param : {},    //要传递的参数，可以是json对象
			width : 200,  //对话框宽度
			height : 200  //对话框高度
		});
	}
	return obj;
})