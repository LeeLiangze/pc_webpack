define(['Util','../../../tpl/comMenu/sendMessage/sendMessage.tpl','../../../assets/css/comMenu/sendMessage/sendMessage'],function(Util,sendMessageTpl){
	//此函数中传入的参数options即为index
	var objClass = function(options){
		var flag = true;
		//获取短信页面的html
		var strMessage = sendMessageTpl;
		//渲染成hadbbar模板
		var template = Util.hdb.compile(strMessage);
		//主叫号码来源
//  	var callingNumberString = index.data.beans[0].outgoingNo;
//  	var callingNumbers = callingNumberString.split(",");		
		//需要渲染的数据源
		var dataSource = {
			mainCallNumber:['请选择主叫号码','pw2','pw3','pw4'],
			receiveNumber:['请选择接收人号码',120,130,140,150],
			messageTemplate:['请选择短信模板','稍后在回复','我在开会','一会儿回电话']
		}
		//渲染数据后的html
		var html = template(dataSource);
		//将渲染成功后的html赋值给$el
		this.$el = $(html);
		this.$el.on('click','.number-choice',function(e){
			e.stopPropagation();
			$(this).parents('.messagebox').find('.more-number').toggleClass('hidden');
		})	
		//优化体验
		this.$el.on("click",function(e){
			$(this).find('.more-number').addClass('hidden');
		})
		//短信发送界面ui控制
		this.$el.on({
			'click':function(e){
				e.stopPropagation();
				var text = $(this).text();
				var bol = $(this).parents('.messagebox').find('.show-number').attr('target_type') == 'input'
				if($(this).parents('.more-number').attr('target_id') == 'message'){
					$(this).parents('.messagebox').find('.message-content').val(text);
					
					if(bol){
						$(this).parents('.messagebox').find('.show-number').val(text);
					}else{
						$(this).parents('.messagebox').find('.show-number').text(text);
					}
					$(this).parents('.messagebox').find('.message-content').css('color','black');
				}else{
				if(bol){
						$(this).parents('.messagebox').find('.show-number').val(text);
					}else{
						$(this).parents('.messagebox').find('.show-number').text(text);
					}
				}
				$(this).parents('.more-number').addClass('hidden');				
			},
			'mouseover':function(e){
				e.stopPropagation();				
				$(this).css('background','#0088D1');
			},
			'mouseout':function(e){
				e.stopPropagation();				
				$(this).css('background','white');
			}
		},'.number');

		//文本域ui处理
		var isFocus = false;
		this.$el.on({
			'focus':function(e){
				e.stopPropagation();			
				isFocus = true;
				if($(this).val() == '请输入发送短信内容'){
					$(this).val('');
					$(this).css('color','black')	
				}
			},
			'blur':function(e){
				e.stopPropagation();				
				isFocus = false;
				if($(this).val() == ''){
					$(this).val('请输入发送短信内容');
					$(this).css('color','#DADADA')
				}
			},
			'change':function(e){
				e.stopPropagation();				
				if(!isFocus && $(this).val() == ''){
					$(this).val('请输入发送短信内容');
				}
			}
		},'.message-content');
		//确定按钮与取消按钮的逻辑绑定
		//确定 发送
		this.$el.on('click','.send-enter',$.proxy(function(e){
			e.stopPropagation();
			window.event.cancelBubble = true;			
			alert('发送的短信内容为: ' + this.$el.find('.message-content').val())
		},this));
		//取消发送
		this.$el.on('click','.send-cancel',function(e){
			e.stopPropagation();			
			options.destroyDialog();
		});		
		//showDialo方法所需要的content属性
		this.content = this.$el;
	}
	return objClass;
})