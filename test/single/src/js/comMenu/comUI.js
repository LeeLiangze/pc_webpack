//此js提供设置接续栏视觉效果的所有方法
define(function(){	
		//改变接续栏选项的方法集合
	var changFont = {
		//接续菜单名称
		comMenuName:{
			"checkBtn":"签出",//签出，签入按钮
			"endCallBtn":"结束会话",//结束会话按钮
			"sendMessageBtn":"发送短信",//发送短信按钮
			"callOutBtn":"外呼",//外呼按钮
			"startMuteBtn":"开始静音",//开始静音按钮
			"callHoldBtn":"通话保持",//通话保持按钮
			"passWordValidateBtn":"密码验证",//密码验证按钮
			"comprehensiveComBtn":"综合接续",//综合接续按钮
			"freeStatusBtn":"示闲",//示闲按钮
			"tidyStatusBtn":"整理态",//整理态按钮
			"acceptRequestBtn":"受理请求",//受理请求按钮
			"restBtn":"休息",//休息
			"transferBtn":"转接专席"
		},
		//设置所有图标的颜色
		setAllIcont:function(color){
			$('.iconfont-com',this.$el).css('color',color);
		},
		//设置所有文本文字的颜色
		setAllTextFont:function(color){
			$('.connection-list',this.$el).css('color',color);
		},
		//设置指定图标的颜色,按钮名称为本对象的comMenuName属性中的所有属性名
		setAppointedIcont:function(name,color){
			var index = this.comMenuName[name];
			$('[data_title=' + index + ']',this.$el).css('color',color);
		},
		//设置指定多个图标的颜色
		setAppointedMoreIcont:function(name1,name2,color){
			//参数必须2个及其以上
			for(var i = 0;i < arguments.length - 1;i++){
				this.setAppointedIcont(arguments[i],arguments[arguments.length - 1]);
			}
		},
		//设置所有按钮能否点击,传入参数true能点击,false不能点击
		setAllBtnEnabled:function(bol){
			if(bol){
				$('.disabled',this.$el).hide();
				$('.iconfont-com',this.$el).removeClass('grey');
				this.redraw1();
				$('.connection-list',this.$el).removeClass('grey');				
			}else{
				$('.disabled',this.$el).show();
				$('.iconfont-com',this.$el).addClass('grey');
				this.redraw1();
				$('.connection-list',this.$el).addClass('grey');
			}
		},
		//设置指定选项的按钮能否点击,传入参数true能点击,false不能点击,
		setAppointedBtnEnabled:function(name,bol){
			var index = this.comMenuName[name];
			if(bol){
				$('[data_title=' + index + ']',this.$el).nextAll(".disabled").hide();
				$('[data_title=' + index + ']',this.$el).removeClass('grey');
				$('[data_title=' + index + ']',this.$el).next().removeClass('grey');
				redraw('[data_title=' + index + ']');
				
			}else{
				$('[data_title=' + index + ']',this.$el).nextAll(".disabled").show();
				$('[data_title=' + index + ']',this.$el).addClass('grey');
				$('[data_title=' + index + ']',this.$el).next().addClass('grey');
				redraw('[data_title=' + index + ']');
			}
		},
		//设置多个任意按钮是否可以点击
		setAppointedMoreBtnEnabled:function(nameArr,bol){
			for(var i = 0;i < nameArr.length;i++){
				this.setAppointedBtnEnabled(nameArr[i],bol);
			}
			//this.setAppointedIcont("freeStatusBtn","#cccccc");
		},
		//更改指定文本的内容
		setAppointedInnerText:function(name,text){
			var index = this.comMenuName[name];
			$('[data_title=' + index + ']',this.$el).next().text(text);
		},
		//接续菜单可变文字汇总
		jsonData:{
			"CallHold":["通话保持","恢复通话"],
			"CallMute":["开始静音","取消静音"],
			"OperatorStatus":["示闲","示忙"],
			"Sign":["签出","签入"],
			"Rest":["休息","结束休息"]
		},
		//通话保持UI 变成恢复通话
		callHoldUi:function(){
			this.setAppointedInnerText("callHoldBtn",this.jsonData.CallHold[1]);
			$(".box-icon-tonghuabaochi-copy a").removeClass();
			$(".box-icon-tonghuabaochi-copy a").addClass("iconfont-com icon-huifutonghuazhuanhuan-copy");
		},
		//恢复通话 变成通话保持
		resumeCallUi:function(){
			this.setAppointedInnerText("callHoldBtn",this.jsonData.CallHold[0]);
			$(".box-icon-tonghuabaochi-copy a").removeClass();
			$(".box-icon-tonghuabaochi-copy a").addClass("iconfont-com icon-tonghuabaochi-copy");
		},
		//开始静音 变成取消静音
		startMuteUi:function(){
			this.setAppointedInnerText("startMuteBtn",this.jsonData.CallMute[1]);
			$(".box-icon-kaishijingyinzhuanhuan-copy a").removeClass();
			$(".box-icon-kaishijingyinzhuanhuan-copy a").addClass("iconfont-com icon-quxiaojingyinzhuanhuan-copy");
		},
		//取消静音 变成开始静音
		cancelMuteUi:function(){
			this.setAppointedInnerText("startMuteBtn",this.jsonData.CallMute[0]);
			$(".box-icon-kaishijingyinzhuanhuan-copy a").removeClass();
			$(".box-icon-kaishijingyinzhuanhuan-copy a").addClass("iconfont-com icon-kaishijingyinzhuanhuan-copy");
		},
		//休息 变成结束休息
		startRest:function(){
			this.setAppointedInnerText("restBtn",this.jsonData.Rest[1]);
		},
		//结束休息 变成休息
		cancelRest:function(){
			this.setAppointedInnerText("restBtn",this.jsonData.Rest[0]);
		},
		//示闲 文字 变示忙
		freeStatusUi:function(){
			this.setAppointedInnerText("freeStatusBtn",this.jsonData.OperatorStatus[1]);
			$(".box-icon-shixianzhuanhuan-copy a").removeClass();
			$(".box-icon-shixianzhuanhuan-copy a").addClass("iconfont-com icon-shimangzhuanhuan-copy");
			//redraw();
			this.setAppointedIcont("freeStatusBtn","#FFAE00");
			//$(".box-icon-shixianzhuanhuan-copy a").attr("title","示忙");
//			$('[title="示闲"]',this.$el).hover(function(){
//				$(this).css('color','#FFB300')
//			},function(){
//				$(this).css('color','#FFAE00')
//			}).mousedown(function(){
//				$(this).css('color','#E79D00')
//			}).mouseup(function(){
//				$(this).css('color','#FFAE00')
//			});
		},	
		//示忙 文字变示闲
		busyStatusUi:function(){
			this.setAppointedInnerText("freeStatusBtn",this.jsonData.OperatorStatus[0]);
			$(".box-icon-shixianzhuanhuan-copy a").removeClass();
			$(".box-icon-shixianzhuanhuan-copy a").addClass("iconfont-com icon-shixianzhuanhuan-copy");
			this.setAppointedIcont("freeStatusBtn","#90C31F");
			//redraw();
			//$(".box-icon-shixianzhuanhuan-copy a").attr("title","示闲");
//			$('[title="示闲"]',this.$el).hover(function(){
//				$(this).css('color','#9BC935')
//			},function(){
//				$(this).css('color','#90C31F')
//			}).mousedown(function(){
//				$(this).css('color','#81AF1B;')
//			}).mouseup(function(){
//				$(this).css('color','#90C31F')
//			});			
		},	
		//签出 变签入
		checkOutUi:function(){
			$(".box-icon-qianchuzhuanhuan-copy a").removeClass();
			$(".box-icon-qianchuzhuanhuan-copy a").addClass("iconfont-com icon-qianruzhuanhuan-copy");
			this.setAppointedIcont("checkBtn","#90C31F");
			$(".box-icon-qianchuzhuanhuan-copy span").css("color","#90C31F");
			this.redraw1();
			this.setAppointedInnerText("checkBtn",this.jsonData.Sign[1]);
		},
		//签入 变签出
		checkInUi:function(){
			$(".box-icon-qianchuzhuanhuan-copy a").removeClass();
			$(".box-icon-qianchuzhuanhuan-copy a").addClass("iconfont-com icon-qianchuzhuanhuan-copy");
			this.setAppointedIcont("checkBtn","#F65A56");
			$(".box-icon-qianchuzhuanhuan-copy span").css("color","#F65A56");
			this.redraw1();
			this.setAppointedInnerText("checkBtn",this.jsonData.Sign[0]);
		},
		//设置整理态默认设置 man-made-word代表人工 auto-word自动  auto-answer自答 man-made-answer人答
		setTidyDefault:function(value){
		     this.$el.find("[target-id=" + value + "]").parent().prepend("<img src='src/assets/img/comMenu/active-checked.png'>");
		     this.$el.find("[target-id=" + value + "]").addClass('font-color');
		     this.$el.find("[target-id=" + value + "]").parent().addClass('bg-img'); 			
		},
		//还原整理态和应答模式的默认值
		restoreDefault:function(arr){
			for(var i = 0;i < arr.length;i++){
				if(this.$el.find("[target-id=" + arr[i] + "]").parent().hasClass('bg-img')){
					this.$el.find("[target-id=" + arr[i] + "]").parent().find('img')
					.remove();
					this.$el.find("[target-id=" + arr[i] + "]").removeClass('font-color');
					this.$el.find("[target-id=" + arr[i] + "]").parent().removeClass('bg-img');
				}
			}
			
		},
		redraw1:function(){
			if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE8.0"){
				$(".iconfont-com").addClass('content-empty');
				setTimeout(function(){
					$(".iconfont-com").removeClass('content-empty');
				},0)
			}
		}
	};
	//给changFont对象扩展get方法,此对象包含了所有获取接续菜单栏选项状态的方法
	$.extend(changFont, {
		//获取指定按钮的状态,返回值为true或false,true代表可以点击，false代表不能点击
		getAppointedBtnStatus:function(name){
			var index = this.comMenuName[name];
			return ( $('[data_title=' + index + ']',this.$el).nextAll(".disabled").css('display') == 'block') ? false : true;
		},
		//获取指定按钮下的文字内容
		getAppointedBtnText:function(name){
			var index = this.comMenuName[name];
			return $('[data_title=' + index + ']',this.$el).next().text();
		}		
	});
	function redraw(data){
		if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE8.0"){
			$(data,this.$el).addClass('content-empty');
			setTimeout(function(){
				$(data,this.$el).removeClass('content-empty');
			},0)
		}
	};
	
	return changFont;
})