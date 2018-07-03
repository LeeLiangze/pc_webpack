define([
	'Util','Compts',
	'../../../tpl/callHandle/CTIInfo/cti.tpl',
	'../../../assets/css/callHandle/CTIInfo/cti.css'],
	
	 function(Util,Compts,tpl){
		//系统变量-定义该模块的根节点
		var $el = $(tpl);
		var _index;
		var list;
		var initialize = function(indexModule){
		    	_index = indexModule;
		        //业务相关代码	       
		        eventInit();
		    	selectInit();
		    	ctiList({});
		        //将根节点赋值给接口
		        this.content = $el;
		};
		
		 var eventInit=function(){
			 $el.on('click','#cti_Search', $.proxy(searchCTIInfo,this));
			 $el.on('click','#cti_Reset', $.proxy(resetInfo,this));
			 $el.on('click','#cti_Add', $.proxy(addCTIInfo,this));
			 $el.on('click','#cti_Update', $.proxy(updateCTIInfo,this));
			 $el.on('click','#cti_Enable', $.proxy(ctiEnable,this));
			 $el.on('click','#cti_Disable', $.proxy(ctiDisable,this));
			 //详细信息
			 $el.on('click','#cti_Detail', $.proxy(detailCTIInfo,this));
		 }
		 //重置
		 var resetInfo = function(){
			 $("#sel_ctiid").val("");
			 $("#sel_name").val("");
			 $("#sel_ip").val("");
			 $("#sel_state").val("");
			 $("#sel_province").val("");
		 }
		 
		 //加载省份数据字典
		 var selectInit = function(){
			 Util.ajax.postJson('front/sh/common!execute?uid=cti005',{},function(json,status){
				 if(status){
					 for(var i=0;i<json.beans.length;i++){
						 var proname = json.beans[i].proviceName;
						 var proId = json.beans[i].proviceId;
						 var options = '<option value="'+proId+'">'+proname+'</option>';
						 $("#sel_province").append($(options));
					 }
				 }
			 });
		 }
		 //查询按钮事件
		 var searchCTIInfo = function (){
			 var ctiId = $("#sel_ctiid")[0].value;
			 var name = $("#sel_name")[0].value;
			 var ip = $("#sel_ip")[0].value;
			 var state = $("#sel_state")[0].value;
			 var provinceId = $("#sel_province")[0].value;
			 var data = {
					"ctiId":ctiId,
					"name": name,
					"ip":ip,
					"state":state,
					"provinceId":provinceId
			 };
			 ctiList(data);
		 }
		 //新增CTI页面
		 var addCTIInfo = function(){
			 var lastMidfyStaffId=_index.getUserInfo().staffId;
			 _index.main.createTab('新增CTI','js/callHandle/CTIInfo/addCTI',{
				 "lastMidfyStaffId":lastMidfyStaffId
			 });
		 }
		 //修改CTI页面
		 var updateCTIInfo = function(){
			 var rows = list.getCheckedRows();
			 if(rows.length==0){
				 alert("请选择一条CTI信息！");
				 return;
			 }else if(rows.length==1){							 
				 var id = rows[0].id;
				 var name = rows[0].name;
				 var ip = rows[0].ip;
				 var port = rows[0].port;
				 var provinceId = rows[0].provinceId;
				 var ccid = rows[0].ccid;
				 var lastMidfyStaffId=_index.getUserInfo().staffId;
				 var lastMidfyDate = rows[0].lastMidfyDate;
				 var backPlatIP="";
				 var backPlatPort="";
				 var ccucsIP = rows[0].ccucsIP;
				 var ccucsPort = rows[0].ccucsPort;
				 var data = {
                 		"ctiId":id                 		
                 };
				 Util.ajax.postJson('front/sh/common!execute?uid=cti009',data,function(json,status){
       				 if(status){
       					backPlatIP=json.bean.backPlatIP;
       					backPlatPort=json.bean.backPlatPort;
       				 } else {					           					  
       					 alert("内网IP端口获取失败！");
       				 }
   			 	},true);
				 _index.main.createTab('修改CTI','js/callHandle/CTIInfo/updateCTI',{
					 "id":id,
					 "name":name,
					 "ip":ip,
					 "port":port,
					 "provinceId":provinceId,
					 "ccid":ccid,
					 "backPlatIP":backPlatIP,
					 "backPlatPort":backPlatPort,
					 "lastMidfyStaffId":lastMidfyStaffId,
					 "lastMidfyDate":lastMidfyDate,
					 "ccucsIP":ccucsIP,
					 "ccucsPort":ccucsPort
				 });
			 }else if(rows.length>1){
				 alert("只能选择一条CTI信息！");
			 }
				 
		 }
		//CTI详情页面
		 var detailCTIInfo = function(){
			 var rows = list.getCheckedRows();
			 if(rows.length==0){
				 alert("请选择一条CTI信息！");
				 return;
			 }else if(rows.length==1){							 
				 var id = rows[0].id;
				 var name = rows[0].name;
				 var ip = rows[0].ip;
				 var port = rows[0].port;
				 var provinceId = rows[0].provinceId;
				 var ccid = rows[0].ccid;
				 var lastMidfyStaffId=_index.getUserInfo().staffId;
				 var lastMidfyDate = rows[0].lastMidfyDate;
				 var backPlatIP="";
				 var backPlatPort="";
				 var ccucsIP = rows[0].ccucsIP;
				 var ccucsPort = rows[0].ccucsPort;
				 var data = {
                 		"ctiId":id                 		
                 };
				 Util.ajax.postJson('front/sh/common!execute?uid=cti009',data,function(json,status){
       				 if(status){
       					backPlatIP=json.bean.backPlatIP;
       					backPlatPort=json.bean.backPlatPort;
       				 } else {					           					  
       					 alert("内网IP端口获取失败！");
       				 }
   			 	},true);
				 _index.main.createTab('CTI详细信息','js/callHandle/CTIInfo/detailCTI',{
					 "id":id,
					 "name":name,
					 "ip":ip,
					 "port":port,
					 "provinceId":provinceId,
					 "ccid":ccid,
					 "backPlatIP":backPlatIP,
					 "backPlatPort":backPlatPort,
					 "lastMidfyStaffId":lastMidfyStaffId,
					 "lastMidfyDate":lastMidfyDate,
					 "ccucsIP":ccucsIP,
					 "ccucsPort":ccucsPort
				 });
			 }else if(rows.length>1){
				 alert("只能选择一条CTI信息！");
			 }
				 
		 }
		 //启用CTI
		 var ctiEnable = function(){
			 var rows = list.getCheckedRows();
			 var ids = "";
			 if(rows.length>0){
				 for(var i=0;i<rows.length;i++){
					 ids += rows[i].id+",";
				 }
			 } else {
				 alert("请选择一条CTI信息！");
				 return;
			 }
			 if(ids.length>0){
				 ids = ids.substring(0,ids.length-1);
			 }
			 var data = {
					 "ids":ids,
					 "state":"0"
			 };
			 Util.ajax.postJson('front/sh/common!execute?uid=cti003',data,function(json,status){
				 if(status){
					 alert("启用成功！");
					 ctiList({});
				 }
			 });
		 }
		 //废弃CTI
		 var ctiDisable = function(){
			 var rows = list.getCheckedRows();
			 var ids = new Array();
			 if(rows.length>0){
				 for(var i=0;i<rows.length;i++){
					 ids += rows[i].id+",";
				 }
			 } else {
				 alert("请选择一条CTI信息！");
				 return ;
			 }
			 if(ids.length>0){
				 ids = ids.substring(0,ids.length-1);
			 }
			 var data = {
					 "ids":ids,
					 "state":"1"
			 };
			 Util.ajax.postJson('front/sh/common!execute?uid=cti003',data,function(json,status){
				 if(status){
					 alert("废弃成功！");
					 ctiList({});
				 }
			 });
		 }
		//加载CTI信息列表
		var ctiList = function(data){
			var config = {
					el:$('.listContainer',$el)[0],
				    field:{ 
				        boxType:'checkbox',  
				        key:'id',         		        	
				        items: [{text: 'CTIID', title:'id',name:'id',className:'w80',
				        		render:function(item,val){
				        			if(val.length<=31){
				        				return val;
				        			}else{
				        				val = val.substr(0,30);
				        				return val;
				        			}
				        		  }
				        		},		                       
	                            {text: 'CTI名称', name: 'name',className:'w120'},
	                            {text:'IP地址',name:'ip'},
	                            {text:'端口',name:'port'}	,
	                            {text: 'CCID', name: 'ccid'},
	                            {text:'状态',name:'state', render:function(item,val){  //重写列表展示
	                                if(val=='1'){
	                                	return '废弃';
	                                }
	                                else if(val=='0'){
	                                	return '启用';
	                                }
	                            } },
	                            {text:'省份',name:'proviceName'},
	                            {text:'最后修改时间',name:'lastMidfyDate'},
	                            {text:'CCUCSIP',name:'ccucsIP'},
	                            {text:'CCUCS端口',name:'ccucsPort'},
	                            {text:'最后修改人',name:'lastMidfyStaffId'}
	                    ]
			//,
//				        button:{
//				            items:[
//				                { 
//				                    text:'详细信息',
//				                    name:'synchronize',
//				                    click:function(e,item){
//
//				           			 var rows = list.getCheckedRows();
//				           			 if(rows.length==0){
//				           				 alert("请选择一条CTI信息！");
//				           				 return;
//				           			 }else if(rows.length==1){							 
//				           				 var id = rows[0].id;
//				           				 var name = rows[0].name;
//				           				 var ip = rows[0].ip;
//				           				 var port = rows[0].port;
//				           				 var provinceId = rows[0].provinceId;
//				           				 var ccid = rows[0].ccid;
//				           				 var lastMidfyStaffId=_index.getUserInfo().staffId;
//				           				 var lastMidfyDate = rows[0].lastMidfyDate;
//				           				 var backPlatIP="";
//				           				 var backPlatPort="";
//				           				 var ccucsIP = rows[0].ccucsIP;
//				           				 var ccucsPort = rows[0].ccucsPort;
//				           				 var data = {
//				                            		"ctiId":id                 		
//				                            };
//				           				 Util.ajax.postJson('front/sh/common!execute?uid=cti009',data,function(json,status){
//				                  				 if(status){
//				                  					backPlatIP=json.bean.backPlatIP;
//				                  					backPlatPort=json.bean.backPlatPort;
//				                  				 } else {					           					  
//				                  					 alert("内网IP端口获取失败！");
//				                  				 }
//				              			 	},true);
//				           				 _index.main.createTab('CTI详细信息','js/callHandle/CTIInfo/syncCTI',{
//				           					 "id":id,
//				           					 "name":name,
//				           					 "ip":ip,
//				           					 "port":port,
//				           					 "provinceId":provinceId,
//				           					 "ccid":ccid,
//				           					 "backPlatIP":backPlatIP,
//				           					 "backPlatPort":backPlatPort,
//				           					 "lastMidfyStaffId":lastMidfyStaffId,
//				           					 "lastMidfyDate":lastMidfyDate,
//				           					 "ccucsIP":ccucsIP,
//				           					 "ccucsPort":ccucsPort
//				           				 });
//				           			 }else if(rows.length>1){
//				           				 alert("只能选择一条CTI信息！");
//				           			 }
//				           				 
//				           		 
////				                    	alert("正在同步中，请等待10秒钟左右！");
////				                        var id = item.data.id;
////				                        var ccid = item.data.ccid;
////				                        var lastMidfyStaffId = _index.getUserInfo().staffId;
////				                        var ip = item.data.backPlatIP;
////				                        var port = item.data.backPlatPort; 
////				                        var data = {
////				                        		"id":id,
////				                        		"ccid":ccid,
////				                        		"lastMidfyStaffId":lastMidfyStaffId,
////				                        		"ip":ip,
////				                        		"port":port
////				                        };
////				                        Util.ajax.postJson('front/sh/common!execute?uid=cti008',data,function(json,status){
////					           				 if(status){
////					           					 alert(json.returnMessage);
////					           				 } else {					           					  
////					           					 alert("同步失败！");
////					           				 }
////				           			 	});
//				                    } 
//				                }
//				            ]
//				        }
				    },
				    page:{
				        perPage:10,    
				        align:'right'  
				    },
				    data:{
				        url:'front/sh/common!execute?uid=cti002'
				    },
				}
			list = new Compts.List(config);
			list.search(data);
		}
		return initialize;
});