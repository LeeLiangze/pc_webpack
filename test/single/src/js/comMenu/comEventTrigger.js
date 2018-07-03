//此js是处理接续栏的点击事件
define(function(){
	//传入的options参数为comMenu
	var objClass = function(options){
		this.name = 'comEventTrigger';
		//所有接续菜单点击事件的处理
		clikEventsDeal.call(this,options);	
	}
	function clikEventsDeal(options){
		options.$el.on('click','.connection-list-box',function(e){
			if($(this).attr("class") != "connection-list-box box-icon-zhenglitaizhuanhuan-copy"){
				if($($(this).find(".disabled")).css("display") == "none"){
					//获取当前点击元素的target-id
					var targetId = $(this).find(".iconfont-com").attr('data_title');
					var openModule = $(this).find(".iconfont-com").attr('openModule');
					var menuUrl = $(this).find(".iconfont-com").attr('menuUrl');
					var dataArr = [targetId,openModule,menuUrl];
					options.comEventsBind.handle.trigger('connectionListClick',e,dataArr);	
				}
			}else{
				options.$el.off('click','.connection-list-box box-icon-zhenglitaizhuanhuan-copy')
			}
		})	
		options.$el.on('click','.icon-zhenglitaizhuanhuan-copy',function(e){
					//获取当前点击元素的target-id
					var targetId = $(this).attr('data_title');
					var openModule = $(this).attr('openModule');
					var menuUrl = $(this).attr('menuUrl');
					var dataArr = [targetId,openModule,menuUrl];
					options.comEventsBind.handle.trigger('connectionListClick',e,dataArr);	
	   })
	   	options.$el.on('click','.connection-list-icon-zhenglitaizhuanhuan-copy',function(e){
	   		var targetId = $(this).attr('data_title');
			var openModule = $(this).attr('openModule');
			var menuUrl = $(this).attr('menuUrl');
			var dataArr = [targetId,openModule,menuUrl];
			options.comEventsBind.handle.trigger('connectionListClick',e,dataArr)
	   	})
	}
	return objClass;
})