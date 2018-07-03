define(['Util'],function(Util){
	
	var CTINum;
	var $el=null;
	var _CTIOptions
	var _login;
	var obj = function(login,CTIOptions){
		_CTIOptions = CTIOptions;
		CTINum= _CTIOptions.CTINums;
		_login = login;
	}
	$.extend(obj.prototype,{
		queryVDNInfo:function(){
			debugger;
			_login.login.judge();
			var $jxForm=$(".content2");
        	var CTIId = $(".sel2info .selColor").attr("CTI_id");
        	var staffId = _CTIOptions.staffId;
        	var VDNNum = 0;
        	Util.ajax.postJson('front/sh/media!execute?uid=relatedVDNInfo01',{CTIId:CTIId,staffId:staffId},function(result,state){
	 			if(state){
	 				var option=[];
	 				var flag = true;
	 				var vdnInfo;
	 				VDNNum = result.beans.length;
	 				for( arr in result.beans){
	 					var VDNId = result.beans[arr].id;
	 					var VDNVDNId = result.beans[arr].VDNId;
	 					var VDNName = result.beans[arr].VDNName;
	 					var sipServer = result.beans[arr].sipServer;
	 					var openeyeAccount = result.beans[arr].openeyeAccount;
	 					var openeyePsw = result.beans[arr].openeyePsw;
	 					if(flag){
	 						option.push('<span selecteds="selecteds" values="'+VDNName+'" VDN_id="'+VDNId+'" VDNVDN_Id="'+VDNVDNId+'" SipServer="'+sipServer+'" openeyeAccount="'+openeyeAccount+'" openeyePsw="'+openeyePsw+'" >'+VDNName+'</span>');
	 						flag = false;
	 						 $(".sel3s").html(VDNName);
	 						vdnInfo = result.beans[arr];//赋值
	 					}else{	
	 						option.push('<span values="'+VDNName+'" VDN_id="'+VDNId+'"VDNVDN_Id="'+VDNVDNId+'"  SipServer="'+sipServer+'"  openeyeAccount="'+openeyeAccount+'" openeyePsw="'+openeyePsw+'">'+VDNName+'</span>');
	 					}
	 				};
	                 $jxForm.find(".sel3info").html(option.join(""))
	                 //如果只有一个VDN，或者没有VDN，则直接隐藏下拉选
//	                 alert(CTINum)
	                 if(CTINum >= 1 &&  VDNNum <= 1){
		             		$jxForm.find(".info2 .sel3info").hide();
		                 };
		             	if(VDNNum == 0){
		             		$jxForm.find(".info2 .sel3s").html("");
		             	};
		                 if(CTINum >= 1 && VDNNum >= 2){
			                	$jxForm.find(".info2 .sel3info").show(); 
			             };
		                
		                /********* 签入座席权限控制 start ********/
			             if(voiceFlag == "1"){
			            	 if(VDNNum >= 1){
//			            		 dealAudioType(vdnInfo);
			            	 }
			             }else{
			            	 $("select[name=audioType]").html("");
//			    	         $(".selectAudioType").hide();
			    	         $(".phoneNum").html("1111")
			    	         $(".phoneNum").hide();
			             }
		                /********* 签入座席权限控制 end *******/
	 			}else{
	 				alert("获取VDN失败");
	 			}
	         }); 	
		}
	})
	return obj;
})