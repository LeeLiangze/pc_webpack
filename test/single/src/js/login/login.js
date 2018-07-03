//2016 12 12 by xuexiangqian
define(['Util',
        './download',
        'jquery.placeholder'],function(Util,DownLoad){
	var staffID, $el = null, hasPhoneAuth = false,PHONE_AUDIO = "电话座席",SIP_AUDIO = "SIP座席",_staffInfo=null,voiceFlag='',serviceTypeId = null;
	var PHONE_TYPE = "1"; //电话座席 
	var SIP_TYPE = "2"; //SIP座席
	var audioType;//坐席类型
	var checkValue = "1";//空闲态
	var viewsType="01", nextMenuType="01";//用来记录选择视图和接续接续菜单
	var viewMode;//定义变量记录图片数组
	var view1de,view1UNde,view2de,view2UNde,view3de,view3NUde,view4de,view4UNde;//定义变量分别记录4种图片的选中和未选中
	var view1txt,view2txt,view3txt,view4txt;//定义变量记录视图名
	var viewMessage;//视图存储
	var bol;
	var VDNNum = 0;
	var objClass = function(){
		$el =$(".out");
		//加载初始化方法事件
		eventInit();
		//初始化获取视图模式
		getViewMode();
		//初始化视图是否存储
		judgeStorageView();
	}
	//事件初始化，由JS初始化时自动调用
	var eventInit = function(){
		//视图切换function(e){views(e,'01',viewdetye)}
		$el.on("click",".views1",function(e){views(e,'01',view1de)});
    	$el.on("click",".views2",function(e){views(e,'02',view2de)});
    	$el.on("click",".views3",function(e){views(e,'03',view3de)});
    	$el.on("click",".views4",function(e){views(e,'04',view4de)});
    	//绑定接续菜单切换事件xxq
    	$el.on("click",".menus1",function(e){menus(e,'01',"src/assets/img/login/nextHde.png")});
        $el.on("click",".menus2",function(e){menus(e,'02',"src/assets/img/login/nextLde.png")});
    	//视图改变下一步xxq
    	$el.on("click",".bs1",bs1);
    	//CTI登录
    	$el.on("click",".bs1CTI",bs1CTI);
    	//serviceType
    	$el.on("click",".info2 .sel1s",sel1s);
    	$el.on("mouseleave",".info2 .sel1",function(){mouse1(".info2 .sel1info")});
        $el.on("click",".info2 .sel1info span",spans1);
        //CTI
        $el.on("click",".info2 .sel2s",sel2s);
        $el.on("mouseleave",".info2 .sel2",function(){mouse1(".info2 .sel2info")});
        $el.on("click",".info2 .sel2info span",spans2);
        //VDN
        $el.on("click",".info2 .sel3s",sel3s);
        $el.on("mouseleave",".info2 .sel3",function(){mouse1(".info2 .sel3info")});
        $el.on("click",".info2 .sel3info span",spans3);
        //示忙，示闲
        $el.on("click",".info2 .sel4s",sel4s);
        $el.on("mouseleave",".info2 .sel4",function(){mouse1(".info2 .sel4info")});
        $el.on("click",".info2 .sel4info span",spans4);
        //audioType
        $el.on("click",".info2 .selectAudioTypes",selectAudioTypes);
        $el.on("mouseleave",".info2 .selectAudioType",function(){mouse1(".info2 .selectAudioTypeinfo")});
        $el.on("click",".info2 .selectAudioTypeinfo span",spansAudio);
        //签入
        $el.on("click","#singIn",singIn);
    	//下载控件
    	$el.on("click","#download",download);
    	//调用JQplaceholder
    	placeholder();
    	//调用获取服务类型ID，初始化时进行调用，目的为了加载必要的全局参数，如：staffID，serviceTypeId
    	queryServiceTypeId();
    	if(_staffInfo.staffId){
      	  staffID = _staffInfo.staffId;
        }else{
      	  staffID = "";
        };
        if(_staffInfo.serviceTypeId){
        	serviceTypeId = _staffInfo.serviceTypeId;
          //调用获取服务类型方法
        	getServeiceType(serviceTypeId);
        }else{
      	  return;
        };      
	}
	var mouse1 = function(info){
		$(info).hide();
	}
//	$(".info2 .sel1info").on("mouseleave",function(){
//		$(this).hide()
//	});
	//placeholder插件 启动方法
    var placeholder = function(){
        $('#num').placeholder();
    };
    //根据业务类型获取视图模式<https://localhost/ngcs/front/sh/layout!execute?uid=layout002&serviceTypeId="10086otck">
    var getViewMode = function(){
    	Util.ajax.postJson("front/sh/layout!execute?uid=layout002",{"serviceTypeId":serviceTypeId},  
				  function(result,state){ 
		 			if(state){
		 			viewMode = result.beans;
			 			for(var i=0;i<viewMode.length;i++){
			 				if(viewMode[i].viewMode=="01"){
			 					view1UNde = viewMode[i].picUrl;
			 					view1de = view1UNde.replace("stms-yystA.png","stms-yystA-xz.png");
			 					view1txt = viewMode[i].viewDesc;
			 					$(".content .views").append('<div class="views1">'+
								    '<div class="floatA">您日常只需要处理语音(客户基本信息放左侧)</div>'+
									'<img values="1" src='+view1UNde+' />'+
									'<span class="selectv color">'+view1txt+'</span>'+
								'</div>')
			 				}else if(viewMode[i].viewMode=="02"){
			 					view2UNde = viewMode[i].picUrl;
			 					view2de = view2UNde.replace("stms-yystB.png","stms-yystB-xz.png");
			 					view2txt = viewMode[i].viewDesc;
			 					$(".content .views").append('<div class="views2">'+
								    '<div class="floatB">您日常只需要处理语音(客户基本信息放上侧)</div>'+
									'<img values="2" src='+view2UNde+' />'+
									'<span class="selectv color">'+view2txt+'</span>'+
								'</div>')
			 				}else if(viewMode[i].viewMode=="03"){
			 					view3UNde = viewMode[i].picUrl;
			 					view3de = view3UNde.replace("stms-hlwst.png","stms-hlwst-xz.png");
			 					view3txt = viewMode[i].viewDesc;
			 					$(".content .views").append('<div class="views3">'+
								    '<div class="floatWeb">您日常只需要处理融合坐席的消息</div>'+
									'<img values="3" src='+view3UNde+' />'+
									'<span class="selectv color">'+view3txt+'</span>'+
								'</div>')
			 				}else if(viewMode[i].viewMode=="04"){
			 					view4UNde = viewMode[i].picUrl;
			 					view4de = view4UNde.replace("stms-glyst.png","stms-glyst-xz.png");
			 					view4txt = viewMode[i].viewDesc;
			 					$(".content .views").append('<div class="views4">'+
//								    '<div class="floatManager">您日常只需要处理融合坐席的消息</div>'+
									'<img values="4" src='+view4UNde+' />'+
									'<span class="selectv color">'+view4txt+'</span>'+
								'</div>')
			 				}//if判断结束
			 			}//遍历视图结束
			 			$(".content .views").append('<div style="clear: both;"></div>')
			 			//默认选中第一种视图
			 			if($(".content .views img").eq(0).attr("values") == 1){
			 				$(".content .views1 img").attr("src",view1de);
			 				viewsType="01";
			 			}else if($(".content .views img").eq(0).attr("values") == 2){
			 				$(".content .views2 img").attr("src",view2de);
			 				viewsType="02";
			 			}else if($(".content .views img").eq(0).attr("values") == 3){
			 				$(".content .views3 img").attr("src",view3de);
			 				viewsType="03";
			 			}else if($(".content .views img").eq(0).attr("values") == 4){
			 				$(".content .views3 img").attr("src",view4de);
			 				viewsType="04";
			 			}
		 			}else{//获取视图失败
		 				Util.dialog.tips(result.returnMessage||'获取视图失败');
		 			}		 			
		         }); 
    }
    //1.获取服务类型
    //inputServiceTypeId服务类型ID
    debugger;
    var getServeiceType = function(inputServiceTypeId){
    	debugger;
    	var data={
    			"serviceTypeId":inputServiceTypeId
    	}
		Util.ajax.postJson("front/sh/media!execute?uid=serviceType01",data,			
				  function(result,state){ 
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
		 						var iframeUrl = result.beans[arr].iframeUrl?result.beans[arr].iframeUrl:"null";
		 						var defaultMode = "2";
		 						voiceFlag = result.beans[arr].voiceFlag;//赋值
		 						if(result.beans[arr].defaultMode){
		 							defaultMode = result.beans[arr].defaultMode
		 						}
		 						spans.push('<span  values="'+serviceTypeName+'"iframeUrl="'+iframeUrl+'" defaultMode="'+defaultMode+ '"  defaultURL="'+defaultURL+'" outgoingNo="'+outgoingNo+'" isSkillOptional="'+isSkillOptional+'" queryTouchType="'+queryTouchType+'" maxArrageTime="'+maxArrageTime+'"  autoArrage="'+autoArrage+'"  arrageDuration="'+arrageDuration+'"  serviceType_id="'+serviceTypeId+'" >'+serviceTypeName+'</span>');
		 					    $(".sel1s").html(serviceTypeName);
		 					}
		 					hasPhoneAuth = InitPhoneAuth();//判断是否有电话坐席权限 
		 					$(".sel1info").html(spans.join(""));//把serviceType类型加入下拉选
		 					 judge();
		 					 id = $(".sel1info .selColor").attr("serviceType_id");
		 					 //调用获取CTI方法
		 					serviceBindCTI(id);
		 				}else{
		 					//该工号未分配业务类型请重新登录
//		 					Util.dialog.tips('\u8be5\u5de5\u53f7\u672a\u5206\u914d\u4e1a\u52a1\u7c7b\u578b\u8bf7\u91cd\u65b0\u767b\u5f55');
		 					 $el.find(".sel1").hide();
		 					 $el.find(".sel2").hide();
		 		             $el.find(".sel3").hide();
		 		             $el.find(".sel4").hide();
		 		             $el.find("#num").hide();
		 		             $el.find(".selectAudioType").hide();
		 		             $el.find("#sing").attr("checked",false);
//		 		            $el.find(".sel1s").html("请选择服务类型");
//		 		            Util.dialog.tips("此服务类型没有对应的CTI权限");
		 		             $(".bs1CTI").css({
		 							background:"url(src/assets/img/login/button.png) no-repeat",
		 							color:"white"
		 						});
		 					$(".bs1CTI").attr("log","1");
		 				}
		 			}else{//获取服务类型失败
		 				Util.dialog.tips(result.returnMessage || "获取服务类型失败");
		 			}		 			
		         }); 
    };
    //2.获取CTI
   var serviceBindCTI=function(inputServiceTypeid){
   	var data = {
  			staffId:staffID,//工号ID
  			serviceTypeId:inputServiceTypeid//服务类型ID
	        };
	Util.ajax.postJson("front/sh/media!execute?uid=serviceBindCTI",data,function(result,state){
		if(state){//请求CTI信息成功
			if(typeof(result.bean.CTIIds) == "undefined"){
				 $el.find(".sel2").hide();
	             $el.find(".sel3").hide();
	             $el.find(".sel4").hide();
	             $el.find("#num").hide();
	             $el.find(".selectAudioType").hide();
	             $el.find("#sing").attr("checked",false);
//	            $el.find(".sel1s").html("请选择服务类型");
//	            Util.dialog.tips("此服务类型没有对应的CTI权限");
	             $(".bs1CTI").css({
						background:"url(src/assets/img/login/button.png) no-repeat",
						color:"white"
					})
					$(".bs1CTI").attr("log","1");
			}else{
				//调用展示获取CTI信息方法
				showState(result.bean.CCNames,result.bean.CTIIds,result.bean.CTIType);
			}
		}else{//请求CTI信息失败
			Util.dialog.tips(result.returnMessage || "获取CTI信息失败");
		}
    });
  }; 
    //3.获取VDN
	var queryVDNInfo = function(){
		var $el=$(".content2");
    	var CTIId = $(".sel2info .selColor").attr("CTI_id");
    	Util.ajax.postJson('front/sh/media!execute?uid=relatedVDNInfo01',{CTIId:CTIId,staffId:staffID},function(result,state){
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
 					var isDefault = result.beans[arr].isDefault;
 					if(flag){
 						option.push('<span selecteds="selecteds" values="'+VDNName+'" VDN_id="'+VDNId+'" VDNVDN_Id="'+VDNVDNId+'"isDefault="'+isDefault+'" SipServer="'+sipServer+'" openeyeAccount="'+openeyeAccount+'" openeyePsw="'+openeyePsw+'" >'+VDNName+'</span>');
 						flag = false;
 						 $(".sel3s").html(VDNName);
 						vdnInfo = result.beans[arr];//赋值
 					}else{	
 						option.push('<span values="'+VDNName+'" VDN_id="'+VDNId+'"VDNVDN_Id="'+VDNVDNId+'"isDefault="'+isDefault+'"  SipServer="'+sipServer+'"  openeyeAccount="'+openeyeAccount+'" openeyePsw="'+openeyePsw+'">'+VDNName+'</span>');
 					}
 				};
                 $el.find(".sel3info").html(option.join(""))
                 judge();//为属性赋值
                 //result.beans.length 获取VDN数量 调用VDN显示或隐藏的方法进行判断
                 VDNShowOrHidd(result.beans.length);
	                /********* 签入座席权限控制 start ********/
		             if(voiceFlag == "1"){
		            	 if(VDNNum >= 1){
		            		 dealAudioType(vdnInfo);//判断是否有sip权限
		            	 }
		             }else{
		            	 $(".selectAudioTypes").html("");
		    	         $("#num").html("1111")
		    	         $("#num").hide();
		             }
	                /********* 签入座席权限控制 end *******/
 			}else{
 				Util.dialog.tips(result.returnMessage || "获取VDN失败");
 			}
         }); 	
	}    
    //4.展示获取CTI信息
  var showState = function(stateString,ctiids,ctitypes){
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
          $(".sel2info").html(option.join(""));
          //刷新添加选中目标元素属性
         judge();
       //根据CTI默认调用获取VDN信息的方法
         queryVDNInfo();
      }
  };
  //判断是否显示VDN下拉选
  var VDNShowOrHidd = function(VDNNum){
      /*1. 如果只有一个VDN则直接隐藏下拉选
        2.如果没有VDN，显示空目的为了让登录人员能直观看到VDN获取异常，便于问题定位
        3.VDN多于一个时进行显示，可以让坐席进行选择签入的VDN值
	  */
      if(VDNNum == 1){
    	  $el.find(".info2 .sel3s").hide();
    	  $el.find(".info2 .sel3info").hide();
      }else if (VDNNum == 0){
    	  $el.find(".info2 .sel3s").html("");
      }else{
      	$el.find(".info2 .sel3s").show();
      	$(".bs1CTI").css({
			background:"url(src/assets/img/login/button.png) no-repeat",
			color:"white"
		})
		$(".bs1CTI").attr("log","1");
      }   
  };
	//执行事件
	//视图事件
   var views = function(e,str,viewde){
	   var o = $(e.currentTarget);
		viewsType = str;
		deviewA();
		o.find('span').attr("class", "selectv color");
		o.find('img').attr("src",viewde);
		return viewsType;	
	}
     //接续菜单
   var menus = function(e,str,srcs){
	   var o = $(e.currentTarget);
	   nextMenuType = str;
    	demenuH();
		o.find('span').attr("class", "selectm color");
		o.find('img').attr("src", srcs);
		return nextMenuType;   
   }
     /*封装未选中方法*/
     var deviewA=function() {
		$(".selectv").attr("class", "selectv");
		$(".views1 img").attr("src", view1UNde);
		$(".views2 img").attr("src", view2UNde);
		$(".views3 img").attr("src", view3UNde);
		$(".views4 img").attr("src", view4UNde);
	}
	 var demenuH=function() {
		$(".selectm").attr("class", "selectm");
		$(".menus1 img").attr("src", "src/assets/img/login/nextHunde.png");
		$(".menus2 img").attr("src", "src/assets/img/login/nextLunde.png");
	}
     //点击下一步按钮
     var bs1=function(){
    	 $(".content").hide();
		 $(".content2").show();
		 storage();//调用记录存储员工选择选择视图和接续菜单的方法
     }
     //<https://localhost/ngcs/front/sh/layout!execute?uid=layout003&staffId=otck&viewMode=03&toolbarMode=01>
     //定义记录存储员工选择选择视图和接续菜单的方法
     var storage = function(){
    	 data = {
        		 "staffId":staffID,//工号ID
        		 "viewMode":viewsType,//选择视图
        		 "toolbarMode":nextMenuType//接续菜单
         };
    	 Util.ajax.postJson("front/sh/layout!execute?uid=layout003",data,function(result,state){
    		 if(state){
    			console.log("个人布局配置保存成功");
    		 }else{
    			 console.log("个人布局配置失败");
    		 }
    	 });
     };    
 	//CTI页面点击登录
    var bs1CTI = function(){
    	var audioPhoneNum = $("#num").val();
		judge();//调用添加属性方法
		//当是否签入隐藏时，移除默认选中属性 
		var is_load = $("#sing").is(':checked');
    	var phonenumber = "000002";
    	var phoneType  = "1";
    	if(!is_load){
    		checkValue = "3";
    	}
    	if(phonenumber == ""){
    		Util.dialog.tips("号码不能为空");
    		return ;
    	}
    	var sel2Color = $(".sel2 .selColor");
		var CCName = $(".sel2s").html();
		var CTIId = sel2Color.attr("CTI_id");
		var CTIType = sel2Color.attr("CTI_type");
		 // 新增加服务类型ID和服务类型名字  
		var selColor = $(".sel1 .selColor");
		var serviceTypeName = selColor.html();
		var serviceTypeId = selColor.attr("serviceType_id");
		var defaultURL = selColor.attr("defaultURL");
		var outgoingNo = selColor.attr("outgoingNo");
		var autoArrage = selColor.attr("autoArrage");
		var arrageDuration = selColor.attr("arrageDuration");
		var isSkillOptional = selColor.attr("isSkillOptional");
		var queryTouchType = selColor.attr("queryTouchType");
		var maxArrageTime = selColor.attr("maxArrageTime");
		var defaultMode = selColor.attr("defaultMode");		
		var iframeurl = selColor.attr("iframeUrl");	
		var sel3Color = $(".sel3 .selColor");
		var VDNName =sel3Color.html();
		var VDNId = sel3Color.attr("VDN_id");
		var VDNVDNId = sel3Color.attr("VDNVDN_Id");
		var isDefault = sel3Color.attr("isDefault");
		// 获取serverIp
		var serverIp = document.domain;
		var data = {
				"signIn":is_load,//签入状态，是否签入
				"staffId":staffID,
				"CTIType":CTIType,
				"CTIId":CTIId,
				"loginStatus":checkValue,//登录状态，空闲态:1/示忙:2/不签入：3
				"VDNName":VDNName,
				"VDNId":VDNId,
				"serviceTypeName":serviceTypeName,
				"serviceTypeId":serviceTypeId,
				"defaultURL":defaultURL,
				"outgoingNo":outgoingNo,
				"defaultMode":defaultMode,
				"serverIp":serverIp,
				"VDNVDNId":VDNVDNId,
				"autoArrage":autoArrage,
				"arrageDuration":arrageDuration,
				"isSkillOptional":isSkillOptional,
				"queryTouchType":queryTouchType,
				"maxArrageTime":maxArrageTime,
				"isDefault":isDefault,
				"iframeurl":iframeurl
		};
		//CTIType =="undefined"是为了保证当用户没有CTI分配时，默认是不签入，此时CTIType=undefined
		if(1==CTIType || CTIType== undefined){
			/************ START add  for audio business *****/
			if(is_load == true){//签入
				if(isNotNull(audioType)){
					data.audioType = audioType;
					if(audioType == PHONE_TYPE){//PHONE_TYPE==1
						var isPhone = /^[0-9]+$/;
						if("" == audioPhoneNum || !isPhone.test(audioPhoneNum)){
							$("#num").attr("value","纯数字号码");
							$("#num").val("纯数字号码");
							 $(".info2 #num").css("color","#999");
//							Util.dialog.tips("请输入纯数字号码");
							return false;
						}else{
							data.audioPhoneNum = audioPhoneNum;
						}	
					};
					if(audioType == SIP_TYPE){//SIP_TYPE==2
						var $selectedVDN = $(".info2 .sel3 .selColor");
		    			var sipServer = $selectedVDN.attr("SipServer");
		    			var openeyeAccount = $selectedVDN.attr("openeyeAccount");
		    			var openeyePsw = $selectedVDN.attr("openeyePsw");
		    			data.sipServer = sipServer;
		    			data.openeyeAccount = openeyeAccount;
		    			data.openeyePsw = openeyePsw;
					};
				}
			}
			//此处需要为同步请求
			Util.ajax.postJson("front/sh/common!saveCTIInfo?uid=CTI01",data,function(result,state){
				if(state){
					if(result.returnCode != "0"){
						Util.dialog.tips("登录异常，请重新登录");
						return;
					}else{
							goIndex();
					}
				}
			},true);
		}else{
			var data1 = {
					"CCName":CCName,
					"phoneType":phoneType,
					"phoneNum":phonenumber		
			};
			$.extend(data,data1);
			//此处需要为同步请求
			Util.ajax.postJson("front/sh/common!saveCTIInfo?uid=CTI01",data,function(result,state){
				if(state){
					if(result.returnCode != "0"){
						Util.dialog.tips("登录异常，请重新登录");
						return;
					}
					//进入index页面
						goIndex();
				}
			},true);	
		}				
    };
    $("#num").on("click",function(){
    	if($(this).val()=="纯数字号码" && $("#sing").is(':checked') ){
    		  $(this).val("");
		      $(".bs1CTI").css({
					background:"url(src/assets/img/login/newdl.png) no-repeat",
					color:"#CCCCCC"
				})
    	}else if($(this).val()=="纯数字号码" && !$("#sing").is(':checked') ){
  		  $(this).val("");
	    }
    });
    //输入框填写正确登录按钮可点
     $(document).on("keyup",function(){
    	 $(".info2 #num").css("color","black");
	    var audioPhoneNum = $("#num").val();
	    var isPhone = /^[0-9]+$/;
	    if( isPhone.test(audioPhoneNum) || !$("#sing").is(':checked')){
			 $(".bs1CTI").css({
					background:"url(src/assets/img/login/button.png) no-repeat",
					color:"white"
				})
				$(".bs1CTI").attr("log","1");
				bol = true;
			 $(".sel4s").show();
		}else{
			$(".bs1CTI").css({
				background:"url(src/assets/img/login/newdl.png) no-repeat",
				color:"#CCCCCC"
			})
			 bol = false;
		}
     })
 	//serviceType
    var sel1s = function(e){
    	var sel1s = $(".sel1s").html();
		$(".info2 .sel1info").toggle();
		e.stopPropagation();
		for (var i=0;i<$(".info2 .sel1info span").length;i++) {
			if (sel1s == $(".info2 .sel1info span").eq(i).html()){
				$(".info2 .sel1info span").eq(i).attr("class","selColor");
			}else{
				$(".info2 .sel1info span").eq(i).attr("class","unColor");
			}
		}
    }
 	var spans1 = function(e){
 		$(".info2 .sel1info").hide(500);
		e.stopPropagation();
		var sel1 = $(this).html();
		$(".info2 .sel1s").html(sel1);
 	}	
 	//CTI
    var sel2s = function(e){
    	var sel2s = $(".sel2s").html();
		$(".info2 .sel2info").toggle();
		e.stopPropagation();
		for (var i=0;i<$(".info2 .sel2info span").length;i++) {
			if (sel2s == $(".info2 .sel2info span").eq(i).html()) {
				$(".info2 .sel2info span").eq(i).attr("class","selColor");
			}else{
				$(".info2 .sel2info span").eq(i).attr("class","unColor");
			}
		}
    }
 	var spans2 = function(e){
 		$(".info2 .sel2info").hide(500);
		e.stopPropagation();
		var sel2 = $(this).html();
		$(".info2 .sel2s").html(sel2);
		judge();
		queryVDNInfo();
 	}	
 	//VDN
    var sel3s = function(e){
    	var sel3s = $(".sel3s").html();
    	if( VDNNum > 1){
    		$(".info2 .sel3info").toggle();
    	}
		e.stopPropagation();                                                                                            
		for (var i=0;i<$(".info2 .sel3info span").length;i++) {
			if (sel3s == $(".info2 .sel3info span").eq(i).html()) {
				$(".info2 .sel3info span").eq(i).attr("class","selColor");
			}else{
				$(".info2 .sel3info span").eq(i).attr("class","unColor");
			}
		}
    }
	var spans3 = function(e){
 		$(".info2 .sel3info").hide(500);
		e.stopPropagation();
		var sel3 = $(this).html();
		$(".info2 .sel3s").html(sel3);
//		if ($(".info2 .sel3s").html()=="电话坐席") {
//			$("#num").show();
//		}else{
//			$("#num").hide();
//		}
 	}
    //AudioType:phone,SIP
    var selectAudioTypes = function(e){
    	var selectAudioTypes = $(".selectAudioTypes").html();
		$(".info2 .selectAudioTypeinfo").toggle();
		e.stopPropagation();
		for (var i=0;i<$(".info2 .selectAudioTypeinfo span").length;i++) {
			if (selectAudioTypes == $(".info2 .selectAudioTypeinfo span").eq(i).html()) {
				$(".info2 .selectAudioTypeinfo span").eq(i).attr("class","selColor");
				audioType = $(".selectAudioType .selColor").attr("values");
			}else{
				$(".info2 .selectAudioTypeinfo span").eq(i).attr("class","unColor");
			}
		};
    } 
    var bols;
 	var spansAudio = function(e){
 		$(".info2 .selectAudioTypeinfo").hide(500);
		e.stopPropagation();
		var spansAudio = $(this).html();
		$(".info2 .selectAudioTypes").html(spansAudio);
		if ($(".info2 .selectAudioTypes").html() == PHONE_AUDIO ) {
			$("#num").show();
			$("#num").val("");
			$("#num").attr("placeholder","纯数字号码");
			$(".bs1CTI").css({
				background:"url(src/assets/img/login/newdl.png) no-repeat",
				color:"#CCCCCC"
			})
			bols=false;
		}else{
			$("#num").hide();
			$(".bs1CTI").css({
				background:"url(src/assets/img/login/button.png) no-repeat",
				color:"white"
			})
			$(".bs1CTI").attr("log","1");
			bols = true;
		}
		audioType = $(this).attr("values");
 	}
 	//签入签出
 	 var singIn = function(){
    	 if(!$("#sing").is(':checked')){
    		 $(".sel4s").hide();
    		 $(".bs1CTI").css({
 				background:"url(src/assets/img/login/button.png) no-repeat",
 				color:"white"
 			})
 			$(".bs1CTI").attr("log","1");
 			if(bols){
 				bol=false;
 			}else{
 				bol=true;
 			}
 			
    	 }else if($("#sing").is(':checked') && bol==true){
    		 $(".bs1CTI").css({
 				background:"url(src/assets/img/login/newdl.png) no-repeat",
 				color:"#CCCCCC"
 			})
 			$("#num").val("");
    	 }else if($("#sing").is(':checked')){
    		 $(".sel4s").show();
    	 }
     }
 	//空闲态和示忙
    var sel4s = function(e){
    	var sel4s = $(this).html();
		$(".info2 .sel4info").toggle();
		e.stopPropagation();
		for (var i=0;i<$(".info2 .sel4info span").length;i++) {
			if (sel4s == $(".info2 .sel4info span").eq(i).html()) {
				$(".info2 .sel4info span").eq(i).attr("class","selColor");
				checkValue=$(".sel4 .selColor").attr("values"); 
			}else{
				$(".info2 .sel4info span").eq(i).attr("class","unColor");
			}
		}
    }
 	var spans4 = function(e){
 		$(".info2 .sel4info").hide(500);
		e.stopPropagation();
		var sel4 = $(this).html();
		$(".info2 .sel4s").html(sel4);
		checkValue=$(this).attr("values"); 
 	}	  
 	 //判断显示业务与下拉选中的业务相同
 	 var judge = function(){
 		//初始化serviceType获得属性
 		var sel1s = $(".sel1s").html();
 		for (var i=0;i<$(".info2 .sel1info span").length;i++) {
			if (sel1s == $(".info2 .sel1info span").eq(i).html()) {
				$(".info2 .sel1info span").eq(i).attr("class","selColor");
			}else{
				$(".info2 .sel1info span").eq(i).attr("class","unColor");
			}
		}
 		 //初始化CTI获得属性
 		var sel2s = $(".sel2s").html();
 		for (var i=0;i<$(".info2 .sel2info span").length;i++) {
			if (sel2s == $(".info2 .sel2info span").eq(i).html()) {
				$(".info2 .sel2info span").eq(i).attr("class","selColor");
			}else{
				$(".info2 .sel2info span").eq(i).attr("class","unColor");
			}
		}
 		//初始化VDN获得属性
 		var sel3s = $(".sel3s").html();
 		for (var i=0;i<$(".info2 .sel3info span").length;i++) {
			if (sel3s == $(".info2 .sel3info span").eq(i).html()) {
				$(".info2 .sel3info span").eq(i).attr("class","selColor");
			}else{
				$(".info2 .sel3info span").eq(i).attr("class","unColor");
			}
		}
 		//初始化Audio获得属性
 		var selectAudioTypes = $(".selectAudioTypes").html();
 		for (var i=0;i<$(".info2 .selectAudioTypeinfo span").length;i++) {
			if (selectAudioTypes == $(".info2 .selectAudioTypeinfo span").eq(i).html()) {
				$(".info2 .selectAudioTypeinfo span").eq(i).attr("class","selColor");
				audioType = $(".selectAudioType .selColor").attr("values");
			}else{
				$(".info2 .selectAudioTypeinfo span").eq(i).attr("class","unColor");
			}
		}
 		//初始化示忙，示闲获得属性
 		var sels4 = $(".sel4s").html();
 		for (var i=0;i<$(".info2 .sel4info span").length;i++) {
			if (sel4s == $(".info2 .sel4info span").eq(i).html()){
				$(".info2 .sel4info span").eq(i).attr("class","selColor");
				checkValue=$(".sel4 .selColor").attr("values"); 
			}else{
				$(".info2 .sel4info span").eq(i).attr("class","unColor");
			}
		}
 	 }
 	 //定义方法判断视图是否存储
 	 //<https://localhost/ngcs/front/sh/layout!execute?uid=layout001&staffId=001>
 	 var judgeStorageView = function(){
 		Util.ajax.postJson("front/sh/layout!execute?uid=layout001",{staffId:staffID},function(result,state){
 			if(state){
 				viewMessage = result.bean;
 				if(viewMessage){
 	 				$(".content2").css("display","block");
 	 			}else{
 	 				$(".content").css("display","block");
 	 			}
 			}else{
 				$(".content").css("display","block");
 			}
 		})
 	 }
 	 //定义加载页面时执行的方法
 	$("body").ready(function() {	
		var screenHeight = (screen.availHeight - 50) + "px";
		$(".out").css("height", screenHeight);
		$(".out1").css("height",screenHeight);
	})
	//定义点击其他区域下拉选隐藏方法
	$(document.body).on("click",function(){
	     $(".info2 .sel1info").hide(500);
	     $(".info2 .sel2info").hide(500);
	     $(".info2 .sel3info").hide(500);
	     $(".info2 .sel4info").hide(500);
	     $(".info2 .selectAudioTypeinfo").hide(500);
	   });   
     //定义获取服务类型ID的方法 
 	//此处需要为同步请求
       var queryServiceTypeId = function(){
        	Util.ajax.postJson('front/sh/common!queryServiceType?uid=ServiceType01',{},function(result){
        		_staffInfo = "";
    			if (result.returnCode == 0){
    				//从新给_staffInfo赋值，避免因缓存问题，导致数据错乱。
    				if(result.bean){
    					_staffInfo =  result.bean;
    				}	
    			}
            },true);
        };
 	// 座席是否有电话座席权限、sip坐席 start  for audio business 
    var dealAudioType = function(vdnInfo){
    	var hasSip = false;
    	//这段请求，用于处理，当vdn变更时，根据vdn的值，判断该vdn是否绑定了账号
        if(isNotNull(vdnInfo) && isNotNull(vdnInfo.sipServer)  && isNotNull(vdnInfo.openeyeAccount)){
        	//则表明有open账号，需要展示sip座席的下拉框
        	hasSip = true;
        };
        var option=[];
        if(hasPhoneAuth || hasSip){
        	if(hasPhoneAuth && hasSip){
            	option.push('<span values="'+PHONE_TYPE+'" >'+PHONE_AUDIO+'</span>');
        		option.push('<span values="'+SIP_TYPE+'" >'+SIP_AUDIO+'</span>');
        		$(".info2 .selectAudioTypes").html(PHONE_AUDIO);
        		$("#num").show();
        		if($(".bs1CTI").attr("log")=="1"){
        			$(".bs1CTI").css({
        				background:"url(src/assets/img/login/button.png) no-repeat",
        				color:"white"
        			})
        		}else{
	        		$(".bs1CTI").css({
	    				background:"url(src/assets/img/login/newdl.png) no-repeat",
	    				color:"#CCCCCC"
	    			})
        	    }
            }else if(hasPhoneAuth && !hasSip){
            	option.push('<span values="'+PHONE_TYPE+'" >'+PHONE_AUDIO+'</span>');
            	$(".info2 .selectAudioTypes").html(PHONE_AUDIO);
            	$("#num").show();
            	if($(".bs1CTI").attr("log")=="1"){
        			$(".bs1CTI").css({
        				background:"url(src/assets/img/login/button.png) no-repeat",
        				color:"white"
        			})
        		}else{
	        		$(".bs1CTI").css({
	    				background:"url(src/assets/img/login/newdl.png) no-repeat",
	    				color:"#CCCCCC"
	    			})
        	    }
            }else if(!hasPhoneAuth && hasSip){
            	option.push('<span  values="'+SIP_TYPE+'" >'+SIP_AUDIO+'</span>');
        		$(".selectAudioTypes").html(SIP_AUDIO);
        		$("#num").hide();
            }
        	$(".info2 .selectAudioType").show();
        	$(".selectAudioTypeinfo").html(option.join(""));
        }else{//没有手机和sip坐席权限
        	$(".info2 .selectAudioType").hide();
        }
        judge();
    };
    //定义判断非空的方法
 	var isNotNull = function(str){
    	var result = true;
    	if(str == "" || str == undefined || str == null || "undefined" == str){
    		result = false;
    	}
    	return result;
    };
  //判断是否有电话坐席权限，在service中调用
    var InitPhoneAuth = function(){
    	var hasPhoneAuth = false;
    	var params = [{"mo":"000102006001","btnId":"telAuth"}];
    	params = JSON.stringify(params);
    	//此处需要为同步请求
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
    	//等待mtt的esb接口改造完毕修改为return hasPhoneAuth
    	return true;
    };  
    //定义登录的方法
 	var  goIndex = function(){
     	if (navigator.appName=="Netscape"){
     		window.open ("index.html",'','width='+(window.screen.availWidth-10)+',height='+(window.screen.availHeight-30)+ ',top=0,left=0,toolbar=no,menubar=no,scrollbars=yes, resizable=yes,location=no, status=no');
     		var opened=window.open('about:blank','_self');
     		opened.opener=null;
     		opened.close();
     	}else{
     		window.open ("index.html",'','width='+(window.screen.availWidth-10)+',height='+(window.screen.availHeight-30)+ ',top=0,left=0,toolbar=no,menubar=no,scrollbars=yes, resizable=yes,location=no, status=no');
     		window.opener=null;
     		window.open('', '_self');
     		window.close();
     	}
     };         
	//控件下载
	var download = function(){
		var download = new DownLoad();
		download.downPanDuan();
 	}
 	 return objClass();
});


   