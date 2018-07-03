define([
	'Util',
	'../../../tpl/callHandle/CTIInfo/detailCTI.tpl',
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
			$el.on('click','#sipServerBtn', $.proxy(sipServerBtn,this));
			$el.on('click','#skillServerBtn', $.proxy(skillServerBtn,this));
			
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
						var vdnInfo = '<tr class="up_vdn_tr"><td><input type="text" id="vdn_id_'+data_id+'" class="up_vdn_id"/></td><td><input type="text" id="vdn_name_'+data_id+'" class="up_vdn_name"/></td><td style="width:220px;"><input type="text"  id="sipServer'+data_id+'" class="sipServer"/></td><td><input type="button"class="buton" id="sipServerBtn'+data_id+'" value="同步工号列表" /></td><td><input type="button"class="buton" id="skillServerBtn'+data_id+'" value="同步技能队列" /></td></tr>';
						$("#up_vdn_title").append($(vdnInfo));
						$("#vdn_id_"+data_id+"").attr("value",vdnId);
						$("#vdn_name_"+data_id+"").attr("value",vdnName);
						$("#sipServer"+data_id+"").attr("value",sipServer);
//						$("#vdn_sipIp_"+i+"").attr("value",vdnIp);
//						$("#vdn_sipPort_"+i+"").attr("value",vdnPort);
						$("#vdn_id_"+data_id+"").attr("data_id",id);
						sipServerBtn(data_id);
						skillServerBtn(data_id);
					}
				}
			});
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
		 

			//同步工号列表
			var sipServerBtn = function(data_id) {	
				 $('#sipServerBtn'+data_id,$el).on("click",function(){
					 var sipServer=$('#sipServerBtn'+data_id,$el)[0].value;
					 var data={
								"sipServer":sipServer,
								 setSipServer:function(value){
									$('#sipServer'+data_id,$el).val("");
									$('#sipServer'+data_id,$el).val(value);
								},
								"id":$("#up_cti_id").val(),
								"ccid":$("#up_cti_ccid").val(),
								"lastMidfyStaffId": _index.getUserInfo().staffId,
								"ip":$("#up_cti_ip").val(),
								"port":$("#up_cti_port").val(),
								"vdnId":$("#vdn_id_"+data_id).val(),
								"workNoScopes":""
					 
						};
						var params = {
						title : '同步工号列表',
						url : 'sipServerBtn',
						param : data,
						width : 400,
						height : 150
						};
					 _index.showDialog(params);
				 });
			}
			
			//同步技能队列
			var skillServerBtn = function(data_id) {
				 $('#skillServerBtn'+data_id,$el).on("click",function(){
					 var data = {
								"id":$("#up_cti_id").val(),
								"ccid":$("#up_cti_ccid").val(),
								"lastMidfyStaffId": _index.getUserInfo().staffId,
								"ip":$("#add_cti_backPlatIp").val(),
								"port":$("#add_cti_backPlatPort").val(),
								"vdnId":$("#vdn_id_"+data_id).val(),
				          };
						 Util.ajax.postJson('front/sh/common!execute?uid=cti011',data,function(json,status){
								 if(status){
									 alert(json.returnMessage);
								 } else {					           					  
									 alert("同步失败！");
								 }
						 	});
						 _index.popAlert('正在同步技能队列,请耐心等待!');
				 });
				
			}

		
		return initialize;
});
		