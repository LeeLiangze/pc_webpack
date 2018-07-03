/**
 * 转接弹出页
 */
define(['Util',
        'Compts',
        '../../../../tpl/comMenu/comprehensiveCommunication/sendNotes/querySendNotes.tpl',
        '../../../../assets/css/comMenu/comprehensiveCommunication/sendNotes/querySendNotes.css'],
        function(Util,Compts,tpl,Constants){
			// 系统变量-定义该模块的根节点
			var $el = null;
			var list;
			var _index = null;
		    var initialize = function(index,options){
		    	_index = index;
		    	$el = $(tpl);
		    	//创建列表但不查询数据
		    	listInit.call(this);
		    	// 业务代码
		    	querySendNotes.call(this);
		    	this.content=$el;
		    };

		    // 加载选项卡
		    var querySendNotes = function(){
		    	$el.on('click','#querySendNotes', $.proxy(querySendNotesbtn,this));
		    	$el.on('click','#notesRemove', $.proxy(notesRemove,this));
		    	setTimeInit(true);
		    	querySendNotesbtn();
		    };
		    //查询历史消息
		    var querySendNotesbtn = function()
		    {
		    	var $form = $('.searchContainer form', this.$el);
		        var result = Util.form.serialize($form);
		        var startTime = result.startTime;
		        var endTime = result.endTime
		        if(!startTime || !endTime)
		        {
		        	alert("请选中查询的时间间隔！");
		        	return;
		        }
		        var daysBetweenNum = daysBetween(endTime,startTime);
		        if(daysBetweenNum <0 || daysBetweenNum > 31)
		        {
		        	alert("选中的结束时间不能早于开始时间且最多查询间隔31天内的通知");
		        	return ;
		        }
		        list.search(result);
		    }
		    var notesRemove = function(e){
		    	$('.input').val("");  
		    	setTimeInit(false);
		    }
		  //业务代码-列表初始化
		    var listInit = function(){
		        var config = {
		            el:$('.listContainer',$el),
		            field:{
		            	boxType:'radio',
		                key:'sendId',
		                popupItems:[
		                    { text:'流水号',name:'sendId',className:'w70' }
		                ],
		                items:[
		                    { text:'流水号',name:'sendId'},
		                    { text:'发送人编号',name:'sender'},
		                    { text:'发送人',name:'senderName'},
		                    { text:'接收人编号',name:'receiver'},
		                    { text:'接收人',name:'receiverName'},
		                    { text:'时间',name:'sendtime' },
		                    { text:'通知内容',name:'sendContent', title : 'sendContent',
		                    	render:function(item,val){  //重写列表展示
		                    		var length = val.length;
	                                if(length > 20){
	                                	return val.substr(0,18)+'...';
	                                }
	                                return val;
		                    	} 
		                    }
		                ]
		            },
		            page:{
		            	perPage:10,
		            	total:true,
		            	align:'right'
		            },
		            data:{
		                url:'front/sh/audio!execute?uid=queryNoteList'
		            }
		            
		        }
		        list = new Compts.List(config);
		    }
		  //条件查询初始化 初始化
		    var setTimeInit = function(flag){
		    	// 时间初始化
				var nowDate = new Date();
				$('#startTime', $el).val(nowDate.format("yyyy-MM-dd"));
				$('#endTime', $el).val(nowDate.format("yyyy-MM-dd"));
				var sendStr = flag ? _index.getUserInfo().staffId : "";
				$('#sender', $el).val(sendStr);
				this.$el = $el;
		    }	
		  //+---------------------------------------------------  
		  //| 求两个时间的天数差 日期格式为 YYYY-MM-dd   
		  //+---------------------------------------------------  
		  var daysBetween = function(DateOne,DateTwo)  
		  {   
		      var OneMonth = DateOne.substring(5,DateOne.lastIndexOf ('-'));  
		      var OneDay = DateOne.substring(DateOne.length,DateOne.lastIndexOf ('-')+1);  
		      var OneYear = DateOne.substring(0,DateOne.indexOf ('-'));  
		    
		      var TwoMonth = DateTwo.substring(5,DateTwo.lastIndexOf ('-'));  
		      var TwoDay = DateTwo.substring(DateTwo.length,DateTwo.lastIndexOf ('-')+1);  
		      var TwoYear = DateTwo.substring(0,DateTwo.indexOf ('-'));  
		    
		      var cha=((Date.parse(OneMonth+'/'+OneDay+'/'+OneYear)- Date.parse(TwoMonth+'/'+TwoDay+'/'+TwoYear))/86400000);   
		      return cha;  
		  }  
    return initialize;
});