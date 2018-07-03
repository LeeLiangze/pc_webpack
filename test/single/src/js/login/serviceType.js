define(['Util',
        './serviceBindCTI'
        ],function(Util,ServiceBindCTI){
	var $el = null;
	var _options;
	var params ={};
	this.a = '';
	var staffId;
	var login;
	console.log(ServiceBindCTI)
	var obj = function(_login,options){
		login = _login;
//		this.voiceFlag = voiceFlag;
		_options = options;
		$el = _options.$el;
		params = {
				$el:_options.$el,
				staffId:_options.staffIDs
		}
		debugger;
//		alert($el.attr("class"))//获取$el
	}
	$.extend(obj.prototype,{
		getServeiceType : function(){
			var inputServiceTypeId =  _options.serviceTypeId
			Util.ajax.postJson("front/sh/media!execute?uid=serviceType01",{serviceTypeId:inputServiceTypeId},
					  $.proxy(function(result,state){ 
			 			if(state){
			 				if(result.beans.length > 0){
			 					var spans=[];
			 					var id = "";
			 					voiceFlag = "";
			 					for( arr in result.beans){
			 						var serviceTypeName = result.beans[arr].name;
			 						var serviceTypeId = result.beans[arr].serviceTypeId;
			 						var defaultURL = result.beans[arr].defaultURL?result.beans[arr].defaultURL:"null";
			 						var outgoingNo = result.beans[arr].outgoingNo?result.beans[arr].outgoingNo:"null";
			 						var autoArrage = result.beans[arr].autoArrage?result.beans[arr].autoArrage:"null";
			 						var arrageDuration = result.beans[arr].arrageDuration?result.beans[arr].arrageDuration:"null";
			 						var isSkillOptional = result.beans[arr].isSkillOptional?result.beans[arr].isSkillOptional:"null";
			 						var queryTouchType = result.beans[arr].queryTouchType?result.beans[arr].queryTouchType:"null";
			 						var maxArrageTime = result.beans[arr].maxArrageTime?result.beans[arr].maxArrageTime:"null";
			 						var defaultMode = "2";
			 						voiceFlag = result.beans[arr].voiceFlag;//赋值
			 						a = voiceFlag;
			 						if(result.beans[arr].defaultMode){
			 							defaultMode = result.beans[arr].defaultMode
			 						}
			 							spans.push('<span  values="'+serviceTypeName+'" defaultMode="'+defaultMode+'"  defaultURL="'+defaultURL+'" outgoingNo="'+outgoingNo+'" isSkillOptional="'+isSkillOptional+'" queryTouchType="'+queryTouchType+'" maxArrageTime="'+maxArrageTime+'"  autoArrage="'+autoArrage+'"  arrageDuration="'+arrageDuration+'"  serviceType_id="'+serviceTypeId+'" >'+serviceTypeName+'</span>');
									   // id = 2;
//									    alert(id)
					
//									    alert(params.ids)

			 							$(".sel1s").html(serviceTypeName);
			 				
			 						
			 					}
//			 					alert(this.initPhoneAuth);
			 					this.initPhoneAuth();//判断是否有电话坐席权限
			 					$(".sel1info").html(spans.join(""));//把serviceType类型加入下拉选
			 					login.judge();
			 					debugger;
			 					 id = $(".sel1info .selColor").attr("serviceType_id");
			 					 $.extend(params,{ids:id});
			 				var	BindCTI = new ServiceBindCTI({login:login},params);
			 					BindCTI.serviceBindCTI();
//			 					alert($el);传参数验证
			 				}else{
			 					alert('\u8be5\u5de5\u53f7\u672a\u5206\u914d\u4e1a\u52a1\u7c7b\u578b\u8bf7\u91cd\u65b0\u767b\u5f55');
			 					//服务类型为空时 跳转到登录页面      
			 					window.location.href="login.html"
			 				}
			 			}else{//获取服务类型失败
			 				alert("获取服务类型失败");
			 			}
			 			
			         },this)); 
			
			},
		  initPhoneAuth:function(){//判断是否有电话坐席权限
	    	var hasPhoneAuth = false;
	        //下面这个请求是用于查询座席 是否有 电话座席权限的，可以提取到外层，不用每次vdn变更时，都进行展示。
	    	var params = [{"mo":"000102006001","btnId":"telAuth"}];
	    	params = JSON.stringify(params);
	    	Util.ajax.postJson('front/sh/permcommon!checkPerm?uid=perm001',{'datas':params},function(json,status){
	            if (status) {
	                for(var i in json.beans){
	                    //mo：1：有权限，0：无权限
	                    var bean = json.beans[i];
	                    if (bean){
	                        if (bean['mo'] == '1') {
	                        	hasPhoneAuth = true;
	                        	break;
	                        	}
	                        }
	                    }
	                }
	            },true);
	    	return hasPhoneAuth;
	    }
		
	})
	return obj;
})

