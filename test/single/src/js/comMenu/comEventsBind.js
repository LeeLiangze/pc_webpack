//此js是处理所有事件的绑定
//connectionListClick此事件包含所有接续事件的处理
define(['Util','./comEventsDeal'],function(Util,ComEventsDeal){
	//传入的options参数代表comMenu
	var eventsObjClass = function(options){
		this.name = 'comEventsBind';
		//定义一个handle对象,用来作为绑定事件和触发事件的句柄
		this.handle = {};
		this.returnObj={};
        // require([], $.proxy(function(){
        this.returnObj = new ComEventsDeal(options);
		//定义一个comEventsDeal对象,里面包含了处理菜单栏的所有方法
		comEventsDeal = this.returnObj;
		//options对象
		this.options = options;
		Util.eventTarget.call(this.handle);
		$.extend(this.handle,Util.eventTarget.prototype);
		//callPartClick 绑定的此事件会在点击密码验证、通话保持、结束会话并且这些按钮可点击时就会触发
		//传入的参数e代表点击事件发生时的触发源,id代表发生的具体事件
		this.handle.on('connectionListClick',$.proxy(function(e,dataArr){
			var status = $(".TimeTilte").text();
			//如果当前状态是整理态，又点击其他的状态（如休息）时，就结束整理态
			if (dataArr[0]=="休息"&&status=="整理态") {
				 // 整理态
				options.options.popAlert("只有空闲态才能调整为休息态");
				return;
			}
				switch (dataArr[0]){
				//受理请求
				case "受理请求":
					comEventsDeal.acceptRequest(options,dataArr);
					break;
				//整理态
				case "整理态下拉":
					comEventsDeal.tidyStatus(options,e,dataArr);
					break;
					//整理态
				case "整理态":
					comEventsDeal.tidyDropDownStatus(options,e,dataArr);
					break;
				//示闲
				case "示闲":
					comEventsDeal.freeStatus(options,dataArr);
					break;
				//示忙
				case "示忙":
					comEventsDeal.freeStatus(options,dataArr);
					break;
				//综合接续
				case "综合接续":
					comEventsDeal.comprehensiveConnection(options,dataArr);
					break;
				//密码验证
				case "密码验证":
					comEventsDeal.passwordAuthentification(options,dataArr);
					break;
				//通话保持
				case "通话保持":
					comEventsDeal.callHold(options,dataArr);
					break;
				//开始静音
				case "开始静音":
					comEventsDeal.startMute(options,dataArr);
					break;
				//外呼
				case "外呼":
					comEventsDeal.callOut(options,dataArr);
					break;
				//发送短信
				case "发送短信":
					comEventsDeal.sendMessage(options,dataArr);
					break;
				//结束会话
				case "结束会话":
					comEventsDeal.endCall(options,dataArr);
					break;
				//签出
				case "签出":
					comEventsDeal.checkOut(options,dataArr);
					break;
				//外呼
				case "休息":
					comEventsDeal.rest(options,dataArr);
					break;
				//前台转接
				case "转接专席":
					comEventsDeal.foregroundTransfer(options,dataArr);
					break;
				default:
					break;
			}
	},this))	
};
	
	
		
	/*//将comEventsDeal.js中的方法扩展到eventsObjClass中
	$.extend(eventsObjClass.prototype,comEventsDeal);*/
	return eventsObjClass;
})