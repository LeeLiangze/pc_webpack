define(['Util',
'../../tpl/queue/showWait.tpl',
'../../assets/css/queue/showWait.css'
],function(Util,showWaitTpl){
//设置对应的数组存放渠道内容
	var waitItem,sKillName,queueSize;
	var WaitNumClass = function(datas){
		waitItem = [];
	   //将对应的this指给self
	   selfs = this;
       this.eventInit(datas);
       //将数组内容换为Json格式
       var template = Util.hdb.compile(showWaitTpl);
       this.$el = template(waitItem);
       this.content = this.$el;
	}
	//定时请求对应的等待数
	$.extend(WaitNumClass.prototype,{
		//dom元素初始化方法
		eventInit: function(datas){
             this.wholeCreat(datas);
		},
		//创建完整等待数详情的方法
	     wholeCreat: function(datas){
	     		   	$.each(datas,function(index,value){
	     		   		//渠道名称
	     		   		sKillName = value.skillName;
	     		   		//对应渠道的等待人数
	     		   		queueSize = value.queueSize;
	     		   		//设置等待数的空格分割转换成数组
	     		   		var arr = sKillName.split(",") || sKillName.split("，");
	     		   		var channel,skill;
	     		   		for(var i = 0;i<arr.length;i++){
		     		   		 channel = arr[0];
		     		   		if(i < arr.length - 1 && arr[i] && i >0){
		     		   			channel = channel + arr[i];
		     		   		}
		     		   		if(arr.length >1){
		     		   			skill = arr[arr.length - 1];
		     		   		}
	     		   		}
	     		   		
	     		   		//创建等待数样式
	     		   		selfs.creatWait(queueSize,channel,skill);
	     		   		
	     		   	})
	     },
	    //创建对应的渠道技能等待数详情(需要参数 渠道等待数，渠道名称，技能名称)
	    creatWait:function(num,channel,skill){
	    	//设置不同等待渠道的信息
	 		var data={};
	    	//如果存在相应的渠道技能等待
//	    	if(num >0){
	    		data.channel = channel;
	    		data.skill = skill;
	    		data.num = num;
	    		waitItem.push(data);
//	    	}
	    }
	    
	})
	return WaitNumClass;
})
