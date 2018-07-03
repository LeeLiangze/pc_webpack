// JavaScript Document
var E={}//定义一个命名空间
E.bind=function (ele,type,fn){
	if(ele.addEventListener){//如果标准浏览器支持
		ele.addEventListener(type,fn,false);//标准的方式
	}else if(ele.attachEvent){//如果浏览器支支持这个方法（IE）
		var newFn=function(){fn.apply(ele);}
		if(!ele['arr'+type]){//定义一个数组
			ele['arr'+type]=[]
		}
		//下面主要是解决IE中用这种方式绑定事件，this关键字的指向问题
		//var newFn=function(){fn.apply(ele);} 这一句：把传进来的fn方法包装一下，生成一个新方法。
		
		newFn.photo=fn;//这个自定义属性photo保存fn的引用
		ele['arr'+type].push(newFn);
		
		
		// ele['arr'+type][ele['arr'+type].length-1]表示穿了马甲的新方法
		
		ele.attachEvent('on'+type,ele['arr'+type][ele['arr'+type].length-1]);
	}else{
		ele['on'+type]=fn;
	}
	
}


E.unBind=function (ele,type,fn){
	if(ele.removeEventListener){
		ele.removeEventListener(type,fn,false);//标准的方式
	}else if(ele.attachEvent){
		var a=ele['arr'+type];
		for(var i=0;i<a.length;i++){
			if(a[i].photo==fn){
				ele.detachEvent('on'+type,a[i]);
				a.splice(i,1);
				break;
			}
		}		
	}else{
		ele['on'+type]=null;//DOM0级的事件绑定
		
	}
	
}
E.SP=function(event){//阻止事件传播
	event=event||window.event;
		if(event.stopPropagation){//W3C标准方式
			event.stopPropagation();
		}else{//IE678专用方式
			event.cancelBubble=true;
		}
}
E.getTarget=function(e){//获取事件源
	e=e||window.event;
	var t=e.target||e.srcElement;
	return t;
}
E.preventDefault=function (event){//阻止事件的默认行为
	event=event||window.event;
	if(event.preventDefault) //标准的
		event.preventDefault();
	else 
		event.returnValue=false;//IE的	
		return false;
}

//下面的方法解决e.pageX不兼容的问题
E.MOUSE=function(e){//获取鼠标加了浏览器滚动条的位置
	e=e||window.event;
	var o={};
	o.x=e.pageX||((document.documentElement.scrollLeft||document.body.scrollLeft)+e.clientX);
	o.y=e.pageY||((document.documentElement.scrollTop||document.body.scrollTop)+e.clientY);
	return o;
}