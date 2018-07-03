/**
 * Created by xxq 2017 2 11
 * 重设技能
 */
define(['Util',"Compts",'../index/constants/mediaConstants',
        '../../tpl/communication/callHandle/resetSkill.tpl',
        '../log/managementLog',
        '../../assets/css/communication/callHandle/resetSkill.css'],function(Util,Compts,MediaConstants,tpl,ManagementLog){
	var _index = null;
	var _param=null;
	var _hts = MediaConstants.CCACSURL;//从常量js中获取"http://"
	var $el = $(tpl);
	//获取签入的技能信息数组
	var signInSkill,signId=[],signName=[],newSkillId = [],newSkillName = [];
	//获取技能队列信息数组
	var skillsInfos;
	//管理日志
	var Log = new ManagementLog();
	var ResetSkill = function(index, param){
		_index = index;
		_param = param;
		//绑定按钮点击事件
		eventInit(param);
		//将根节点赋值给接口
		this.content = $el;
	};
	//业务代码-事件初始化
	var eventInit = function(param){
//		skillsInfo = param.skillsInfo;
		skillsInfos = _index.CTIInfo.skillInfos;//总技能
//		signInSkill = param.signInSkill;
		signInSkill = _index.CTIInfo.signInSkills;//签入技能
		signId = [];//原技能ID
		signName = [];//原签入技能名称
		if(signInSkill){
			for(var i=0;i<signInSkill.length;i++){
				signId.push(signInSkill[i].skillId);
				signName.push(signInSkill[i].skillName);
			}
		}
		$el.on('click','.resetBtn1', $.proxy(resetSkill_true,this));
		$el.on('click','.resetBtn2', $.proxy(cancel,this));
		$el.on("click",".reLis",imgs);
		var timer= setTimeout(function(){
			jz();//重置技能加载
		},100);
	}
	var jz = function(){//重置技能加载
		if($(".resetSkill .resetMiddle ul li").length <= 0 && skillsInfos){
			var isSkillOptional = _index.CTIInfo.isSkillOptional;
			for(i=0;i<skillsInfos.length;i++){
				$(".resetSkill .resetMiddle ul").append(
					"<li class='reLis'>"+
					"<img class='imgs' src='src/assets/img/login/unselect.png' skillId='"+skillsInfos[i].skillId+"' checks='checks' />"+
					"<span class='TXT' title="+skillsInfos[i].skillName+'>'+skillsInfos[i].skillName+"</span>"+
					"</li>");
				if(signInSkill){
					for(y=0;y<signInSkill.length;y++){
						if($(".resetSkill .resetMiddle ul li").eq(i).find("img").attr("skillId") == signInSkill[y].skillId){
							$(".resetSkill .resetMiddle ul li").eq(i).find("img").attr("src","src/assets/img/login/select.png");
							$(".resetSkill .resetMiddle ul li").eq(i).find("img").attr("checks","checked");
						}
					}
				}
			}
		}
		$(".ui-dialog-close").hide();
	}
	//点击选择技能，自定义选择按钮，点击切换图片
	var imgs = function(){
		if ($(this).find(".imgs").attr("src") == "src/assets/img/login/unselect.png") {
			$(this).find(".imgs").attr("src","src/assets/img/login/select.png");
			$(this).css("border","1px solid #0085d0");
			$(this).find(".TXT").attr("class","TXT select");
			$(this).find(".imgs").attr("checks","checked");
		}else if ($(this).find(".imgs").attr("src")=="src/assets/img/login/select.png") {
			$(this).find(".imgs").attr("src","src/assets/img/login/unselect.png");
			$(".allSelect").attr("src","src/assets/img/login/unselect.png");
			$(this).css("border","1px solid #999999");
			$(this).find(".TXT").attr("class","TXT unselect");
			$(this).find(".imgs").attr("checks"," ")
		}
	};
	//取消重设技能
	var cancel = function(){
		for(var i=0; i<$(".imgs").length;i++){
			$(".resetSkill .resetMiddle ul li").eq(i).find("img").attr("src","src/assets/img/login/unselect.png");
			if(signInSkill){
				for(y=0;y<signInSkill.length;y++){
					if($(".resetSkill .resetMiddle ul li").eq(i).find("img").attr("skillId") == signInSkill[y].skillId){
						$(".resetSkill .resetMiddle ul li").eq(i).find("img").attr("src","src/assets/img/login/select.png");
						$(".resetSkill .resetMiddle ul li").eq(i).find("img").attr("checks","checked");
					}
				}
			}
		};
		var timer= setTimeout(function(){
			_index.destroyDialog();
//				 $(".ui-popup-backdrop").css("display","none");在index519行
		},1);
	};
//		$(".ui-dialog-close").on("click",function(){
//			alert("123")
//		})
	//确定按钮
	var resetSkill_true = function(){
		newSkillId=[];
		newSkillName=[];
//		if(_param.flag){
		var flag=false;
		if(flag){
			var skills = new Array();
			var skillName = new Array();
			for(var i=0;i<$(".resetSkill .imgs").length;i++){
				if($(".resetSkill .imgs").eq(i).attr("checks") == "checked"){
					skills.push({"skillId":$(".resetSkill .imgs").eq(i).attr("skillId"),"skillName":$(".resetSkill .TXT").eq(i).html()});
					skillName.push({"skillName":$(".resetSkill .TXT").eq(i).html()});
				}
			}
			var skillNew={
				"signInSkills":skills
			}
			for(var i=0;i<skills.length;i++){
				newSkillId.push(skills[i].skillId);
			}
			for(var i=0;i<skillName.length;i++){
				newSkillName.push(skillName[i].skillName);
			}
			$.extend(_index.CTIInfo,skillNew);//技能入_index.CTIInfo
			_index.ctiInit.signIn(_index  .CTIInfo);
//		Util.dialog.tips("重设技能成功");
			_index.popAlert("重设技能成功","重设技能提示");
			_index.destroyDialog();
			var nowStatue = _index.clientInfo.timerWait.nowStatue();
			if(nowStatue == "未签入"){
				_index.comMenu.comUI.checkFailUi();//未签入 变签入
			}

			//日志
			if(signId&&signName&&skills&&skillName){
				Log.setIsExt(true);
				Log.setOperator(_index.getUserInfo()['staffId']);
				Log.setOperBeginTime(_index.utilJS.getCurrentTime());
				Log.setOperEndTime(_index.utilJS.getCurrentTime());
				Log.setSourceSkillId(signId.join());
				Log.setSourceSkillName(signName.join());
				Log.setDestSkillId(newSkillId.join());
				Log.setDestSkillName(newSkillName.join());
				Log.setOperId("025");
				Log.setServiceTypeId(_index.CTIInfo.serviceTypeId);
				Log.setStatus("1");
				Log.logSavingForTransfer(Log);
			}
		}else{
			var ip = _index.CTIInfo.IP;
			var port = _index.CTIInfo.port;
			var ProxyIP = _index.CTIInfo.ProxyIP;
			var ProxyPort = _index.CTIInfo.ProxyPort;
			var isDefault = _index.CTIInfo.isDefault;
			var option = _index.serialNumber.getSerialNumber();
			var sign_url = "";
			var CTIID = _index.CTIInfo.CTIId;
			if(isDefault == "1"){
				sign_url = _hts + ProxyIP + ":" + ProxyPort + "/ccacs/" + CTIID +
					"/ws/agent/resetskill";
			}else{
				sign_url = _hts + ip + ":" + port + "/ccacs/ws/agent/resetskill";
			}
			var skills = new Array();
			var skillName = new Array();
			for(var i=0;i<$(".resetSkill .imgs").length;i++){
				if($(".resetSkill .imgs").eq(i).attr("checks") == "checked"){
					skills.push({"skillId":$(".resetSkill .imgs").eq(i).attr("skillId")});
					skillName.push({"skillName":$(".resetSkill .TXT").eq(i).html()});
				}
			}
			for(var i=0;i<skills.length;i++){
				newSkillId.push(skills[i].skillId);
			}
			for(var i=0;i<skillName.length;i++){
				newSkillName.push(skillName[i].skillName);
			}
			if(skills.length>0){
				var datas = {
					"skills":skills,
					"isPermanent":false,
					"opserialNo":option
				}
				if(_index.queue.browserName==="IE"){  //注意index的
					//IE逻辑
					$.ajax({
						url : sign_url,
						type : 'post',
						data :  JSON.stringify(datas),
						crossDomain:true,
//	                	xhrFields:{
//	                	   withCredentials:true
//	                	},
						contentType:"application/json; charset=utf-8",
						success : function(jsonData) {
							resetResult(jsonData,skills);
							if("0"==jsonData.result){
								_index.comMenu.comUI.checkInUi();
								datas.skillId = [];
								for(var i = 0;i<datas.skills.length;i++){
									datas.skillId[i] = datas.skills[i].skillId;
								}
								if(datas.skillId){
									//根据签入技能，获取对应的省份id,name
									Util.ajax.postJson('front/sh/common!execute?uid=businessTree001',{"skillIds":datas.skillId.join(","),"ctiId":CTIID},function(json,status){
										if(status){
											initBusinessTree({"tree":json.beans});
										}
									});
								}
								var skillNew={
									"signInSkills":skills
								}
								$.extend(_index.CTIInfo,skillNew);//技能入_index.CTIInfo
								//日志
								if(signId&&signName&&skills&&skillName){
									Log.setIsExt(true);
									Log.setOperator(_index.getUserInfo()['staffId']);
									Log.setOperBeginTime(_index.utilJS.getCurrentTime());
									Log.setOperEndTime(_index.utilJS.getCurrentTime());
									Log.setSourceSkillId(signId.join());
									Log.setSourceSkillName(signName.join());
									Log.setDestSkillId(newSkillId.join());
									Log.setDestSkillName(newSkillName.join());
									Log.setOperId("025");
									Log.setServiceTypeId(_index.CTIInfo.serviceTypeId);
									Log.setStatus("1");
									Log.logSavingForTransfer(Log);
								}

//								_index.header.communication.recordCallCTILog(resetURL,datas,jsonData,"重设技能成功");
							}else{
//	  	            		_index.header.communication.recordCallCTILog(resetURL,datas,jsonData,"重设技能失败");
							}
						},
						error : function( XMLHttpRequest, textStatus, errorThrown) {
							resetResult();
							var errorParams = {
								"XMLHttpRequest":XMLHttpRequest,
								"textStatus":textStatus,
								"errorThrown":errorThrown
							};
//							_index.header.communication.recordCallCTILog(resetURL,datas,errorParams,"网络异常，重设技能失败");
						}
					});
				}else{
					//其他浏览器逻辑
					$.ajax({
						url : sign_url,
						type : 'post',
						data :  JSON.stringify(datas),
						crossDomain:true,
						xhrFields:{
							withCredentials:true
						},
						contentType:"application/json; charset=utf-8",
						success : function(jsonData) {
							resetResult(jsonData,skills);
							if("0"==jsonData.result){
								_index.comMenu.comUI.checkInUi();
								datas.skillId = [];
								for(var i = 0;i<datas.skills.length;i++){
									datas.skillId[i] = datas.skills[i].skillId;
								}
								if(datas.skillId){
									//根据签入技能，获取对应的省份id,name
									Util.ajax.postJson('front/sh/common!execute?uid=businessTree001',{"skillIds":datas.skillId.join(","),"ctiId":CTIID},function(json,status){
										if(status){
											initBusinessTree({"tree":json.beans});
										}
									});
								}
								var skillNew={
									"signInSkills":skills
								}
								$.extend(_index.CTIInfo,skillNew);//技能入_index.CTIInfo
								//日志
								if(signId&&signName&&skills&&skillName){
									Log.setIsExt(true);
									Log.setOperator(_index.getUserInfo()['staffId']);
									Log.setOperBeginTime(_index.utilJS.getCurrentTime());
									Log.setOperEndTime(_index.utilJS.getCurrentTime());
									Log.setSourceSkillId(signId.join());
									Log.setSourceSkillName(signName.join());
									Log.setDestSkillId(newSkillId.join());
									Log.setDestSkillName(newSkillName.join());
									Log.setOperId("025");
									Log.setServiceTypeId(_index.CTIInfo.serviceTypeId);
									Log.setStatus("1");
									Log.logSavingForTransfer(Log);
								}
//								_index.header.communication.recordCallCTILog(resetURL,datas,jsonData,"重设技能成功");
							}else{
//	  	            		_index.header.communication.recordCallCTILog(resetURL,datas,jsonData,"重设技能失败");
							}
						},
						error : function( XMLHttpRequest, textStatus, errorThrown) {
							resetResult();
							var errorParams = {
								"XMLHttpRequest":XMLHttpRequest,
								"textStatus":textStatus,
								"errorThrown":errorThrown
							};
//							_index.header.communication.recordCallCTILog(resetURL,datas,errorParams,"网络异常，重设技能失败");
						}
					});
				}

			}else{
				alert("请至少选择一项！");
				return;
			}
		}
	}
	//取消按钮
	function resetResult(datajson,skills){
		if(datajson&&"0"==datajson.result){
			_index.ctiInit._skillInfos.setSignInSkills(skills);
			_index.destroyDialog();
			_index.popAlert("重设技能队列成功！","重设技能提示");
			$(".ui-popup-backdrop").css("display","none");
		}else{
			_index.destroyDialog();
			_index.popAlert("重设技能队列失败！","重设技能提示");
			$(".ui-popup-backdrop").css("display","none");
		}
	}
	function initBusinessTree (param){
		if($('.uiTabBody').find('.chatTree')){
			$('.uiTabBody .chatTree').remove();
		}
		$('.uiTabBody .uiTabItemBody').eq(0).append("<div class='chatTree' id='chatBox_tab' style='display:none'></div>");
		//清空div
		$("#chatBox_tab").empty();
		var htm = "<a id='chatBox_search' class='chatBox_search'></a><a id='chatBox_error' class='chatBox_error'>纠错</a><button id='chatBox_close' class='chatBox_close' title='cancel'>×</button><div id='chatBox_tree'></div>";
		$("#chatBox_tab").html(htm);
		var treeModule = null,collectModule = null;
		var contentStr = null, selectorStr = '>.sn-tab-container>.J_tab_render>.J_content_render';
		var businessTree = null;
		//关闭
		$("#chatBox_close").click(function(e){
			$("#chatBox_tab").hide();
			$("#searchData").val("");
		});
		//搜索
		$("#chatBox_search").click(function(e){
			if(collectModule){
				if(!collectModule.is(":hidden")){
					collectModule&&collectModule.hide();
					$($(">.sn-tab-container>.J_tab_render>.sn-tab-items>.J_item_click", tab_chat.$el)[0]).trigger("click");
					$("#searchData").show();
				}else{
					if($("#searchData").is(':hidden')){
						$("#searchData").show();
					}else{
						$("#searchData").hide();
					}
				}
			}else{
				if($("#searchData").is(':hidden')){
					$("#searchData").show();
				}else{
					$("#searchData").hide();
				}
			}
		});
		var config = {
			el : $("#chatBox_tree"),
			tabs : [
				{
					title : '业务树',
					click : function(e, tabData) {
						//隐藏收藏夹
						collectModule&&collectModule.hide();
						$("#chatBox_error").show();
						require(['../content/businessTree/businessTree'],function(BusinessTree){
							if(treeModule){
								treeModule.show();
								businessTree.triggerClick();
							}else{
								treeModule = $('<div class="treeBox"></div>');
								businessTree = new BusinessTree(_index,param);
								treeModule.html(businessTree.content);
								contentStr.append(treeModule);
							}
						});
					}
				},
				{
					title : '收藏夹',
					click : function(e, tabData) {
						//隐藏业务树
						treeModule&&treeModule.hide();
						$("#chatBox_error").hide();
						var favorite = null;
						require(['../content/businessTree/favorite'],function(Favorite){
							if (collectModule){
								collectModule.show();
								collectModule.empty();
								param.content = businessTree.getCurrentTreeContent();
								favorite = new Favorite(_index,param);
								collectModule.html(favorite.content);
							}else{
								collectModule = $('<div class="collectBox"></div>');
								contentStr.append(collectModule);
								param.content = businessTree.getCurrentTreeContent();
								favorite = new Favorite(_index,param);
								collectModule.html(favorite.content);
							}
						});
					}
				}]
		};
		var tab_chat = new Compts.Tab(config);
		contentStr = $(selectorStr, tab_chat.$el);
	}
	return ResetSkill;
});