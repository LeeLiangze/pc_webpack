function fnBind(fn,obj){	
	return function (e){fn.call(obj,e);}
	}
function down(e){
	this.className='';
	this.style.zIndex=++defZIndex;
	this.initMP=E.MOUSE(e);
	this.initEP={x:this.offsetLeft,y:this.offsetTop};
	if(this.setCapture){
		E.bind(this,'mousemove',move);
		E.bind(this,'mouseup',up);
		this.setCapture();
		
	}else{
		this.MOVE=fnBind(move,this);
		this.UP=fnBind(up,this);
		E.bind(document,'mousemove',this.MOVE);
		E.bind(document,'mouseup',this.UP);
	}
	E.preventDefault(e);
}
function move(e){
	this.style.top=this.initEP.y+(E.MOUSE(e).y-this.initMP.y)+'px';
	
	this.style.left=this.initEP.x+(E.MOUSE(e).x-this.initMP.x)+'px';
	var siblings=DOM.siblings(this);
	
	for(var i=0;i<siblings.length;i++){//在碰撞之前把上一次撞上的结果清除		
			siblings[i].className='';		
	}
	
	var minN=999999;
	var nIndex=-1;
	this.touchEle=null;
	for(var i=0;i<siblings.length;i++){
		if(test(this,siblings[i])){
			//siblings[i].className='test';
			var distance=getDistance(this,siblings[i]);
			if(minN>distance){
				minN=distance;
				nIndex=i;				
			}
		}
		
	}//end for
	
	if(nIndex>-1){		
		siblings[nIndex].className='test';
		this.touchEle=siblings[nIndex];
	}	
}

function up(e){//停止拖拽

	if(this.touchEle){		
			
		var tempPosi=this._posi//_posi是在初始化的时候定义的
		this._posi=this.touchEle._posi;
		this.touchEle._posi=tempPosi;//交换位置
			
		animate(this,{top:this._posi.top,left:this._posi.left},20,3);
		animate(this.touchEle,{top:this.touchEle._posi.top,left:this.touchEle._posi.left},20,4);
		this.className='current';
		this.touchEle=null;
		
	}else{
		
			animate(this,{top:this._posi.top,left:this._posi.left},20,3);
	}
	if(this.releaseCapture){
		E.unBind(this,'mousemove',move);
		E.unBind(this,'mouseup',up);
		this.releaseCapture();		
	}else{	
		E.unBind(document,'mousemove',this.MOVE);
		E.unBind(document,'mouseup',this.UP);
	}
	
}
function test(ele1,ele2){//碰撞检测
	var e1t1=ele1.offsetTop;
	var e1t2=ele1.offsetTop+ele1.offsetHeight;
	var e1l1=ele1.offsetLeft;
	var e1l2=ele1.offsetLeft+ele1.offsetWidth;
	
	var e2t1=ele2.offsetTop;
	var e2t2=ele2.offsetTop+ele2.offsetHeight;
	var e2l1=ele2.offsetLeft;
	var e2l2=ele2.offsetLeft+ele2.offsetWidth;
	if(e1t2<e2t1||e1t1>e2t2||e1l2<e2l1||e1l1>e2l2){
		return false;		
	}else{
		return true;
	}
}

function getDistance(ele1,ele2){//获得两个元素之间的距离
	var h=ele1.offsetTop-ele2.offsetTop;
	var w=ele1.offsetLeft-ele2.offsetLeft;
	return Math.sqrt(h*h+w*w);
}