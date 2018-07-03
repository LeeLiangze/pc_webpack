define([
	'Util',
	'../../../tpl/callHandle/CTIInfo/updateCTI.tpl',
	'../../../assets/css/callHandle/CTIInfo/updateCTI.css'],
	
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
	    	selectInit();
	    	infoInit();
	    	eventInit();
	        //将根节点赋值给接口
	        this.content = $el;
		};
		
		var eventInit = function(){
			$el.on('click','#up_add_vdn', $.proxy(addVDN,this));
			$el.on('click','#up_vdn_save', $.proxy(saveInfo,this));
			$el.on('click','#sipServerBtn', $.proxy(manageSipServer,this));
			$el.on('click','#up_vdn_cancel', $.proxy(destoryTab,this));
		}
		
		var infoInit = function(){
			var id = _options.id;
			var name = _options.name;
			var ip = _options.ip;
			var port = _options.port;
			var ccid = _options.ccid;
			var backPlatIP=_options.backPlatIP;
			var backPlatPort=_options.backPlatPort;
			var lastMidfyStaffId = _options.lastMidfyStaffId;
			var lastMidfyDate = _options.lastMidfyDate;
			var ccucsIP = _options.ccucsIP;
			var ccucsPort = _options.ccucsPort;
			$("#up_cti_id",$el).val(id);
			$("#up_cti_name",$el).val(name);
			$("#up_cti_ip",$el).val(ip);
			$("#up_cti_port",$el).val(port);
			$("#up_cti_ccid",$el).val(ccid);
			$("#add_cti_backPlatIp",$el).val(backPlatIP);
			$("#add_cti_backPlatPort",$el).val(backPlatPort);
			$("#up_cti_staff",$el).val(lastMidfyStaffId);
			$("#up_cti_time",$el).val(lastMidfyDate);
			$("#up_cti_ccucsIP",$el).val(ccucsIP);
			$("#up_cti_ccucsPort",$el).val(ccucsPort);
			 
			Util.ajax.postJson('front/sh/common!execute?uid=cti006',{"ctiId":id},function(json,status){
				if(status){
					for(var i=0;i<json.beans.length;i++){
						var data_id = _index.serialNumber.getSerialNumber();
						var vdnName = json.beans[i].vdnName;
						var vdnId = json.beans[i].vdnId;
//						var vdnIp = json.beans[i].vdnIp;
//						var vdnPort = json.beans[i].vdnPort;
						var sipServer = json.beans[i].sipServer;
						var id = json.beans[i].id;
						var vdnInfo = '<tr class="up_vdn_tr"><td><input type="text" id="vdn_id_'+data_id+'" class="up_vdn_id"/></td><td><input type="text" id="vdn_name_'+data_id+'" class="up_vdn_name"/></td><td style="width:220px;"><input type="text"  id="sipServer'+data_id+'" class="sipServer"/></td><td><input type="button"class="buton" id="sipServerBtn'+data_id+'" value="维护SipServer" style="float: left;"/></td><td><input type="button" style="border: 2px" class="up_vdn_del_'+data_id+'" value="删除"/></td></tr>';
						$("#up_vdn_title").append($(vdnInfo));
						$("#vdn_id_"+data_id+"").attr("value",vdnId);
						$("#vdn_name_"+data_id+"").attr("value",vdnName);
						$("#sipServer"+data_id+"").attr("value",sipServer);
//						$("#vdn_sipIp_"+i+"").attr("value",vdnIp);
//						$("#vdn_sipPort_"+i+"").attr("value",vdnPort);
						$("#vdn_id_"+data_id+"").attr("data_id",id);
						$('.up_vdn_del_'+data_id,$el).on("click",function(){
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
				}
			});
		}
		
		var destoryTab = function(){
			_index.main.destroyTab();
		}
		//加载省份数据表
		 var selectInit = function(){
			 Util.ajax.postJson('front/sh/common!execute?uid=cti005',{},function(json,status){
				 if(status){
					 var provinceId = _options.provinceId;
					 for(var i=0;i<json.beans.length;i++){
						 var proname = json.beans[i].proviceName;
						 var proId = json.beans[i].proviceId;
						 if(provinceId==proId){
							 
							 var options = '<option value="'+proId+'" selected="selected">'+proname+'</option>';
						 }else{
							 
							 var options = '<option value="'+proId+'">'+proname+'</option>';
						 }
						 $("#up_cti_province").append($(options));
					 }
				 }
			 });
		 }
		 
		 //新增VDN
		 var addVDN = function(){
			 var dataid = _index.serialNumber.getSerialNumber();
			 var vdnInfo = '<tr class="up_vdn_tr"><td><input type="text" id="vdn_id_'+dataid+'" class="up_vdn_id"/></td><td><input type="text" id="vdn_name_'+dataid+'" class="up_vdn_name"/></td><td style="width: 220px;"><input type="text" id="sipServer'+dataid+'" class="sipServer"/></td><td><input type="button"class="buton" id="sipServerBtn'+dataid+'" value="维护SipServer" style="float: left;"/></td><td><input type="button" style="border: 2px" class="up_vdn_del_'+dataid+'" value="删除"/></td></tr>';
			 $("#up_vdn_title").append($(vdnInfo));
			 $('.up_vdn_del_'+dataid,$el).on("click",function(){
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
			 manageSipServer(dataid);
		 }
		//判断数组内(新增,修改的vdn名称或id)是否有相同值
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
		var saveInfo = function(){
			var date=new Date();
			var modifyTime=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
			var up_vdn_trs = $el.find(".up_vdn_tr");
			var up_length = up_vdn_trs.length;
			var id = _options.id;
			var name = $("#up_cti_name")[0].value;
			var ip = $("#up_cti_ip")[0].value;
			var port = $("#up_cti_port")[0].value;
			var provinceId = $("#up_cti_province")[0].value;
			var ccid = $("#up_cti_ccid")[0].value;
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
			var lastMidfyStaffId = $("#up_cti_staff")[0].value;
			var lastMidfyDate=modifyTime;
			var ids = "";
			var vdn_ids = "";
			var vdn_names = "";
//			var vdn_ips = "";
//			var vdn_ports = "";
			var sip_servers="";
			var obj_vdn_id = $el.find(".up_vdn_id");
			var obj_vdn_name = $el.find(".up_vdn_name");
//			var obj_vdn_ip = $el.find(".up_sipServer_ip");
//			var obj_vdn_port = $el.find(".up_sipServer_port");
			var obj_sip_server=$el.find(".sipServer");
//			for(var i=0;i<obj_sip_server.length;i++){
//				if(isNaN(obj_sip_server[i].value)){
//					alert("sipServerIp格式不正取，请重新输入");
//					return; 
//				}
//			}
			for(var i=0;i<obj_vdn_id.length;i++){
//				ids += $(obj_vdn_id[i]).attr("data_id")+",";
				vdn_ids += obj_vdn_id[i].value+",";
				vdn_names += obj_vdn_name[i].value+",";
//				vdn_ips += obj_vdn_ip[i].value+",";
//				vdn_ports += obj_vdn_port[i].value+",";
				sip_servers+=obj_sip_server[i].value+",";
			}
			if(vdn_ids.length>0){
				ids = ids.substring(0,ids.length-1);
				vdn_ids = vdn_ids.substring(0,vdn_ids.length-1);
				vdn_names = vdn_names.substring(0,vdn_names.length-1);
//				vdn_ips = vdn_ips.substring(0,vdn_ips.length-1);
//				vdn_ports = vdn_ports.substring(0,vdn_ports.length-1);
				sip_servers=sip_servers.substring(0,sip_servers.length-1);
			}
			var sip_servers_List=sip_servers.split(",");
			for(var i=0;i<sip_servers_List.length;i++){
				if(sip_servers_List[i]==null||sip_servers_List[i]==""){
					alert("sipServer不能为空!");
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
			var ccucsIP = $("#up_cti_ccucsIP")[0].value;
			var ccucsPort = $("#up_cti_ccucsPort")[0].value;
			 if(ccucsPort!=null&&ccucsPort!=""){
					if(isNaN(ccucsPort)){
						alert("内网端口请输入数字");
						return;
					}else if(ccucsPort < 1024 || ccucsPort >65535){
						alert("请输入1024到65535之间的端口号");
						return;
					}
				}
		
			var data = {
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
//					"ids":ids,
					"vdn_ids":vdn_ids,
					"vdn_names":vdn_names,					
					"up_length":up_length,
					"sip_servers":sip_servers,
					"ccucsIP":ccucsIP,
					"ccucsPort":ccucsPort
			};
			if(sip_servers==""||sip_servers==null||name==""||name==null||ip==null||ip==""||port==""||port==null||provinceId==""||provinceId==null||ccid==""||ccid==null||
					lastMidfyStaffId==""||lastMidfyStaffId==null||lastMidfyDate==""||lastMidfyDate==null||vdn_ids==""||vdn_names==""){
				alert("信息不能为空！");
				return;
			}else if(isRepeatFlag(vdn_ids)){
				alert("VDNID不能有相同值！");
				return;
			}else if(isRepeatFlag(vdn_names)){
				alert("VDN名称不能有相同值！");
				return;
			} else {
				Util.ajax.postJson('front/sh/common!execute?uid=cti007',data,function(json,status){
					if(status){
						alert("保存成功！");
						_index.main.destroyTab();
						_index.main.destroyTab('CTI资源管理');
						_index.main.createTab('CTI资源管理','js/callHandle/CTIInfo/cti');
					}
				});			
			}
		}
		
		// 修改sipServer信息
		var manageSipServer = function(data_id) {				
			 $('#sipServerBtn'+data_id,$el).on("click",function(){
				 var sipServer=$('#sipServer'+data_id,$el)[0].value;
				 var data={
							"sipServer":sipServer,
							 setSipServer:function(value){
								$('#sipServer'+data_id,$el).val("");
								$('#sipServer'+data_id,$el).val(value);
							}
				 
					};
					var params = {
					title : '修改sipServer信息',
					url : 'manageSipServer',
					param : data,
					width : 800,
					height : 400
					}
				 _index.showDialog(params);
			 });
		}
		
		return initialize;
});
		