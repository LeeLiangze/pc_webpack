define([
	'Util',
	'../../../tpl/callHandle/CTIInfo/addCTI.tpl',
	'../../../assets/css/callHandle/CTIInfo/addCTI.css'],
	
	function(Util,tpl){
		//系统变量-定义该模块的根节点
		var $el;
		var _index;
		var _options;
		var initialize = function(indexModule,options){
			$el = $(tpl);	
			_index = indexModule;
	    	_options = options;
	        //业务相关代码	       
	        eventInit();
	    	selectInit();
	    	infoInit();
	    	addTrInfo();
	        //将根节点赋值给接口
	        this.content = $el;
		};
		
		var eventInit = function(){
			$el.on('click','#add_add_vdn', $.proxy(addVDN,this));
			$el.on('click','#add_vdn_save', $.proxy(saveInfo,this));
			$el.on('click','#sipServerBtn', $.proxy(manageSipServer,this));
			$el.on('click','#add_vdn_cancel', $.proxy(destoryTab,this));
		}
		var infoInit=function(){
			var lastMidfyStaffId = _options.lastMidfyStaffId;
			$("#add_cti_staff",$el).val(lastMidfyStaffId);
		}
        var addTrInfo=function(){
        	var data_id = _index.serialNumber.getSerialNumber();
			 var vdnInfo = '<tr class="add_vdn_tr"><td><input type="text" class="add_vdn_id" data_id="'+data_id+'" id="vdn_id_'+data_id+'"/></td><td><input type="text" id="vdn_name_'+data_id+'" class="add_vdn_name"/></td><td style="width: 220px;"><input type="text" class="sipServer" data_id="'+data_id+'" id="sipServer'+data_id+'"/></td><td><input type="button"class="buton" id="sipServerBtn'+data_id+'" value="维护SipServer" style="float: left;"/></td><td><input type="button" style="border: 2px" class="add_vdn_del_'+data_id+'" value="删除"/></td></tr>';
			 $("#add_vdn_title",$el).append(vdnInfo);
			 $el.find('#sipServer'+data_id).val("");
			 $('.add_vdn_del_'+data_id,$el).on("click",function(){
				 if(confirm("确定删除吗？")){
				 var objectSiblings=$(this).parent().parent().siblings().length;
				 if(objectSiblings==1){
					 alert("至少保留一条VDN信息!");
					 return;
				 }else{
					 $(this).parent().parent().remove();
				 }
				 }
			});
			 
			 manageSipServer(data_id);
        }
		
		var destoryTab = function(){
			_index.main.destroyTab();
		}
		//加载省份数据字典
		 var selectInit = function(){
			 Util.ajax.postJson('front/sh/common!execute?uid=cti005',{},function(json,status){
				 if(status){
					 for(var i=0;i<json.beans.length;i++){
						 var proname = json.beans[i].proviceName;
						 var proId = json.beans[i].proviceId;
						 var options = '<option value="'+proId+'">'+proname+'</option>';
						 $("#add_cti_province").append($(options));
					 }
				 }
			 });
		 }
		 //新增VDN
		 var addVDN = function(){
			 var data_id = _index.serialNumber.getSerialNumber();
			 var vdnInfo = '<tr class="add_vdn_tr"><td><input type="text" class="add_vdn_id" data_id="'+data_id+'" id="vdn_id_'+data_id+'"/></td><td><input type="text" id="vdn_name_'+data_id+'" class="add_vdn_name"/></td><td style="width: 220px;"><input type="text" class="sipServer" data_id="'+data_id+'" id="sipServer'+data_id+'"/></td><td><input type="button"class="buton" id="sipServerBtn'+data_id+'" value="维护SipServer" style="float: left;"/></td><td><input type="button" style="border: 2px" class="add_vdn_del_'+data_id+'" value="删除"/></td></tr>';
			 $("#add_vdn_title").append(vdnInfo);
			 $el.find('#sipServer'+data_id).val("");
			 $('.add_vdn_del_'+data_id,$el).on("click",function(){
				 if(confirm("确定删除吗？")){
					 var objectSiblings=$(this).parent().parent().siblings().length;
					 if(objectSiblings==1){
						 alert("至少保留一条VDN信息!");
						 return;
					 }else{
						 $(this).parent().parent().remove();
					 }					 
				 }
			});
			 
			 manageSipServer(data_id);
			 
		 }
		 
		 //判断数组内(新增的vdn名称或id)是否有相同值
		 function isRepeatFlag(arrayDemo){
			 var arrayList=arrayDemo.split(",");
			 var i=0;
			 for(i=0;i<arrayList.length;i++){
				 for(var j=i+1;j<arrayList.length;j++){
					 if(arrayList[i]==arrayList[j]){
						 return true; //存在相同值
					 }
				 }
			 }
			 return false;
		 }
		 
		 //保存CTI		 
//		    var vdn_ips="";
//		    var vdn_ports="";
		var saveInfo = function(){
			var date=new Date();
			var modifyTime=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
			var ctiId = $("#add_cti_id")[0].value;
			var name = $("#add_cti_name")[0].value;
			var ip = $("#add_cti_ip")[0].value;
			var port = $("#add_cti_port")[0].value;
			var provinceId = $("#add_cti_province")[0].value;
			var ccid = $("#add_cti_ccid")[0].value;
			var backPlatIP = $("#add_cti_backPlatIp")[0].value;
//			if(backPlatIP!=null&&backPlatIP!=""){
//				if(!backPlatIP.match(/^((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){4}$/)){
//					alert("IP格式不正取，请重新输入");
//					return;
//				}
//			}			
			var backPlatPort = $("#add_cti_backPlatPort")[0].value;
            if(backPlatPort!=null&&backPlatPort!=""){
				if(isNaN(backPlatPort)){
					alert("内网端口请输入数字");
					return;
				}else if(backPlatPort < 1024 || backPlatPort >65535){
					alert("请输入1024到65535之间的端口号");
					return;
				}
			}
			var lastMidfyStaffId = $("#add_cti_staff")[0].value;
			var lastMidfyDate=modifyTime;
			var vdn_ids = "";
			var vdn_names = "";
//			var vdn_ips = "";
//			var vdn_ports = "";
			var sip_servers = "";
			var obj_vdn_id = $el.find(".add_vdn_id");
			var obj_vdn_name = $el.find(".add_vdn_name");
//			var obj_vdn_ip = $el.find(".add_sipServer_ip");
//			var obj_vdn_port = $el.find(".add_sipServer_port");
			var obj_sip_server=$el.find(".sipServer");
			for(var i=0;i<obj_vdn_id.length;i++){
				vdn_ids += obj_vdn_id[i].value+",";
				vdn_names += obj_vdn_name[i].value+",";
//				vdn_ips += obj_vdn_ip[i].value+",";
//				vdn_ports += obj_vdn_port[i].value+",";
				sip_servers+=obj_sip_server[i].value+",";
			}
			if(vdn_ids.length>0){
				vdn_ids = vdn_ids.substring(0,vdn_ids.length-1);
				vdn_names = vdn_names.substring(0,vdn_names.length-1);
//				vdn_ips = vdn_ips.substring(0,vdn_ips.length-1);
//				vdn_ports = vdn_ports.substring(0,vdn_ports.length-1);
				sip_servers=sip_servers.substring(0,sip_servers.length-1);
			}
			var sip_servers_List=sip_servers.split(",");
			for(var i=0;i<sip_servers_List.length;i++){
				if(sip_servers_List[i]!=null&&sip_servers_List[i]!=""){
					if(sip_servers_List[i].indexOf(".")<3||sip_servers_List[i].indexOf(".")>3||sip_servers_List[i].indexOf(":")<6){
						alert("sipServer格式不正确!");
						return;
					}			
				}else{
					alert("sipServer不能为空!");
					return;
				}
			}
			var vdn_ids_List=vdn_ids.split(",");
			for(var i=0;i<vdn_ids_List.length;i++){
				if(vdn_ids_List[i]==null||vdn_ids_List[i]==""){
					alert("VDNID不能为空!");
					return;
				}
			}
			var vdn_names_List=vdn_names.split(",");
			for(var i=0;i<vdn_names_List.length;i++){
				if(vdn_names_List[i]==null||vdn_names_List[i]==""){
					alert("VDN名称不能为空!");
					return;
				}
			}
			var ccucsIP = $("#add_cti_ccucsIP")[0].value;
			var ccucsPort = $("#add_cti_ccucsPort")[0].value;
			if(ccucsPort!=null&&ccucsPort!=""){
				if(isNaN(ccucsPort)){
					alert("CCUCS端口请输入数字");
					return;
				}else if(ccucsPort < 1024 || ccucsPort >65535){
					alert("请输入1024到65535之间的端口号");
					return;
				}
			}
//			var ips_List=vdn_ips.split(",");
//			for(var i=0;i<ips_List.length;i++){
//				if(ips_List[i]==null||ips_List[i]==""){
//					alert("sipServerIp不能为空!");
//					return;
//				}else{
//					if(!ips_List[i].match(/^((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){4}$/)){
//						alert("sipServerIp格式不正取，请重新输入");
//						return;
//					}
//				}
//			}
//			var ports_List=vdn_ports.split(",");
//			for(var i=0;i<ports_List.length;i++){
//				if(ports_List[i]==null||ports_List[i]==""){
//					alert("sipServerPort不能为空!");
//					return;
//				}else if(isNaN(ports_List[i])){
//					alert("请输入一个数字");
//					return;
//				}
//				var vdnport = parseInt(ports_List[i]);
//				if(vdnport < 1024 || vdnport >65535){
//					alert("请输入1024到65535之间的端口号");
//					return;
//					}
//			}
			var data = {
					"ctiId":ctiId,
					"name":name,
					"ip":ip,
					"port":port,
					"provinceId":provinceId,
					"ccid":ccid,
					"backPlatIP":backPlatIP,
					"backPlatPort":backPlatPort,
					"lastMidfyStaffId":lastMidfyStaffId,
					"lastMidfyDate":lastMidfyDate,
					"vdn_ids":vdn_ids,
					"vdn_names":vdn_names,
//					"vdn_ips":vdn_ips,
//					"vdn_ports":vdn_ports,
					"sip_servers":sip_servers,
					"ccucsIP":ccucsIP,
					"ccucsPort":ccucsPort
			};
			 
			if(ctiId==""||ctiId==null||ctiId == "省份全拼+业务标识"||name==""||name==null||ip==""||ip==null||port==""||port==null||provinceId==""||provinceId==null||ccid==""||ccid==null||
					lastMidfyStaffId==""||lastMidfyStaffId==null||lastMidfyDate==""||lastMidfyDate==null||vdn_ids==""||vdn_names==""){
				alert("信息不能为空！");
				return;
			}else if(isRepeatFlag(vdn_ids)){
				alert("VDNID不能有相同值！");
				return;
			}else if(isRepeatFlag(vdn_names)){
				alert("VDN名称不能有相同值！");
				return;
			}else {
				Util.ajax.postJson('front/sh/common!execute?uid=cti004',data,function(json,status){
					if(status){
						if(json.bean.result == 0){
							alert("CTIID重复，请重新输入！");
						}else{
							alert("保存成功！");
							_index.main.destroyTab();
							_index.main.destroyTab('CTI资源管理');
							_index.main.createTab('CTI资源管理','js/callHandle/CTIInfo/cti');
						}
					}
				});				
			}
		}
		// 维护sipServer
		var manageSipServer = function(data_id) {				
			 $('#sipServerBtn'+data_id,$el).on("click",function(){
				 var sipServer=$('#sipServer'+data_id,$el)[0].value;
				 var data={
							"sipServer":sipServer,
							 setSipServer:function(value){
								$('#sipServer'+data_id,$el).val("");
								$('#sipServer'+data_id,$el).val(value);
							},
				 
					}
					var params = {
					title : '维护sipServer',
					url : 'js/callHandle/CTIInfo/manageSipServer',
					param : data,
					width : 800,
					height : 400
					}
				 _index.showDialog(params);
			 });
		}
		
		return initialize;
});