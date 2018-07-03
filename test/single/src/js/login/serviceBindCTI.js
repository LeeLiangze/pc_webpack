define(['./queryVDNInfo'],function(QueryVDNInfo){
	var _service;
	var $el;
	var id;
	var staffId;
	var params={};
	var _login;
	var obj = function(login,options){
		_login = login;
		debugger;
		    _service = options;
		    id = _service.ids;
		    staffId = _service.staffId;
			$el = _service.$el;
			params ={
					id : _service.ids,
					staffId : _service.staffId,
					$el : _service.$el
			}
//			alert($el.attr("class"))//获取$el	
	};
//	setTimeout(function(){
//		alert(id)
//	},100)
   $.extend(obj.prototype,{
             serviceBindCTI:function(){
//            	 alert(id);//传递serviceTypeId
	        	var data = {
		   			staffId:staffId,
		   			serviceTypeId:id
       	        };
        	Util.ajax.postJson("front/sh/media!execute?uid=serviceBindCTI",data,$.proxy(function(result,state){
	 			if(state){
	 				if(typeof(result.bean.CTIIds) == "undefined"){
	 					var $jxForm=$el.find(".js-jx-form");
	 					 $el.find(".selectCCName").hide();
	 		             $el.find(".selectVDNName").hide();
	 		             $el.find(".selectLoginState").hide();
	 		             $el.find(".signin").hide();
	 		             $el.find(".phoneNum").hide();
	 		             $el.find(".selectAudioType").hide();
	 		            $el.find("#serviceTypeState").html("请选择服务类型");
	 		           $jxForm.show();
	 					alert("此服务类型没有对应的CTI权限")
	 				}else{	 					
/*	 					$el.find("#serviceTypeState").html("请选择登录状态");
	 					if($el.find(".selectCCName").is(":hidden")){
		 					 $el.find(".selectCCName").show();
		 		             $el.find(".selectVDNName").show();
		 		             $el.find(".selectLoginState").show();
		 		             $el.find(".signin").show();
	 					}*/
	 					
	 					this.showState(result.bean.CCNames,result.bean.CTIIds,result.bean.CTIType);
//	 					$(".sel2s").html(result.bean.CCNames);
	 				}
	 			}else{
	 				alert("获取CTI信息失败");
	 			}
	         },this));
	       },
	       // 获取服务类型的方法法  
	        showState:function(stateString,ctiids,ctitypes){
	              if(stateString){
	                  var arr=stateString.split("|"),option=[];
	  				  var ctiid=ctiids.split("|");
	                  var ctitype=ctitypes.split("|");
	                  $.each(arr,function(i,v){
	                  		v&&option.push('<span   values="'+v+'" CTI_id="'+ctiid[i]+'" CTI_type="'+ctitype[i]+'">'+v+'</span>');	
	                  	  	 if(i==0){
	                  	  		$(".sel2s").html(v); 
	                  	  	 }
	                  });
	                 CTINum  = option.length;
	                 $.extend(params,{CTINums:CTINum});
	                  $(".sel2info").html(option.join(""));
	                  _login.login.judge();
	              }
	            //根据CTI默认获取VDN信息的方法
	              var queryVDNInfo = new QueryVDNInfo({login:_login.login},params);
	              queryVDNInfo.queryVDNInfo();
	          },

         })
	return obj;
  })