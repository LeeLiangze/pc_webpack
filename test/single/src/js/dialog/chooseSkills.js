/**
 * 技能队列
 */
//2017 1 21 by xuexiangqian
define(['Util',
    '../../tpl/communication/callHandle/chooseSkills.tpl',
    '../../assets/css/communication/callHandle/chooseSkills.css'
    ],
	function(Util,tpl){
		//系统变量-定义该模块的根节点
		var $el = null;
		var _index,ip,port,vdnId,ccId,CTIId,isDefault,reSearch=false;
		var skillNum;//选中技能个数
		//系统变量-构造函数
		var initialize = function(index){
			_index = index;
			$el = $(tpl);
			this.content = $el;
			//初始化事件
			eventInits();
			//初始化技能并添加到列表
			getSkills();
		};
		//业务代码-事件初始化
		var eventInits = function(){
			$el.on("click",".allChoose",allSelect);
			$el.on("click",".chooLis",imgs);
			$el.on("click",".btns .btn1",sure);
			$el.on("click",".btn2",cancel);
			//获取CTIInfo中需要的信息
			vdnId = _index.CTIInfo.VDN_ID;
			ip = _index.CTIInfo.IP;
			port = _index.CTIInfo.port;
			ccId = _index.CTIInfo.CCID;
			CTIId = _index.CTIInfo.CTIId;
			isDefault=_index.CTIInfo.isDefault;
		};
		//获取技能，skillName
		var getSkills = function(){
			var data = {
				vdnId:vdnId,
				ip:ip,
				port:port,
				ccId:ccId,
				CTIId:CTIId,
				isDefault:isDefault
			}
			Util.ajax.postJson("front/sh/media!execute?uid=skill01",data,function(result,state){
				if(state){
					skillNames = result.beans;
					var skills = {
						"skillInfos":skillNames
					};
					$.extend(_index.CTIInfo,skills);
					skillNum = skillNames.length;
					var isSkillOptional = _index.CTIInfo.isSkillOptional;
					if(isSkillOptional=="0"){
						for(var i=0;i<skillNames.length;i++){
							$.extend(skillNames[i],{checked:1});
							$(".outSkill ul").append(
								"<li>"+
// 	 								"<img class='imgs' src='src/assets/img/login/select.png' />"+
								"<span class='TXT' title="+skillNames[i].skillName+'>'+skillNames[i].skillName+"</span>"+
								"</li>")
						}
					}else{
						$(".outSkill ul").prepend('<li class="allChoose">'+
							'<img class="allSelect" id="allSelect" src="src/assets/img/login/select.png" />'+
							'<span class="TXT">全部</span>'+
							"</li>");

						for(var i=0;i<skillNames.length;i++){
							$.extend(skillNames[i],{checked:1});
							$(".outSkill ul").append(
								"<li class='chooLis'>"+
								"<img class='imgs' src='src/assets/img/login/select.png' />"+
								"<span class='TXT' title="+skillNames[i].skillName+'>'+skillNames[i].skillName+"</span>"+
								"</li>")
						}
					}
					/*$(".outSkill ul").prepend('<li class="allChoose">'+
					 '<img class="allSelect" id="allSelect" src="src/assets/img/login/select.png" />'+
					 '<span class="TXT">全部</span>'+
					 "</li>");*/
					//技能加载完成，按钮可用
// 				$(".btns input").attr("disabled",false);
				}
			})
		};
		//点击全部，自定义选择按钮，点击切换图片
		var allSelect = function(){
			var isSkillOptional = _index.CTIInfo.isSkillOptional;
			if ($(this).find(".allSelect").attr("src") == "src/assets/img/login/unselect.png" && isSkillOptional == "1") {
				$(this).find(".allSelect").attr("src","src/assets/img/login/select.png");
				$(".outSkill .imgs").attr("src","src/assets/img/login/select.png");
				$(".outSkill li").css("border","1px solid #0085d0");
				$(".outSkill li .TXT").attr("class","TXT select");
				skillNum = $(".outSkill .select").length - 1;
				for(var i=0;i<skillNum;i++){
					$.extend(skillNames[i],{checked:1});
				}
			}else if ($(this).find(".allSelect").attr("src")=="src/assets/img/login/select.png" && isSkillOptional == "1") {
				$(".outSkill .imgs").attr("src","src/assets/img/login/unselect.png");
				$(this).find(".allSelect").attr("src","src/assets/img/login/unselect.png");
				$(".outSkill li").css("border","1px solid #999999");
				$(".outSkill li .TXT").attr("class","TXT unselect");
				skillNum = $(".outSkill .select").length;
				for(var i=0;i<skillNames.length;i++){
					$.extend(skillNames[i],{checked:0});
				}
			}
		};
		//点击选择技能，自定义选择按钮，点击切换图片
		var imgs = function(){
			var isSkillOptional = _index.CTIInfo.isSkillOptional;
			if ($(this).find(".imgs").attr("src") == "src/assets/img/login/unselect.png" && isSkillOptional == "1") {
				$(this).find(".imgs").attr("src","src/assets/img/login/select.png");
				$(this).parent("li").css("border","1px solid #0085d0");
				$(this).parent("li").find(".TXT").attr("class","TXT select");
				skillNum+=1;
				if(skillNum == skillNames.length){
					//技能全选
					$(".allSelect").attr("src","src/assets/img/login/select.png");
				}
				for(var i=0;i<skillNames.length;i++){
					if(skillNames[i].skillName == $(this).find(".TXT").html()){
						$.extend(skillNames[i],{checked:1});
					}
				}
			}else if ($(this).find(".imgs").attr("src")=="src/assets/img/login/select.png" && isSkillOptional == "1") {
				$(this).find(".imgs").attr("src","src/assets/img/login/unselect.png");
				$(".allSelect").attr("src","src/assets/img/login/unselect.png");
				$(this).css("border","1px solid #999999");
				$(this).find(".TXT").attr("class","TXT unselect");
				skillNum-=1;
				for(var i=0;i<skillNames.length;i++){
					if(skillNames[i].skillName == $(this).find(".TXT").html()){
						$.extend(skillNames[i],{checked:0});
					}
				}
			}
		};


		//点击确定
		var sure = function(){
			var skillMes = [];
			for(var i=0;i<skillNames.length;i++){
				if(skillNames[i].checked == 1){
					skillMes.push(skillNames[i]);
				}
			}
			if(reSearch){
				alert("正在初始化中，请稍等..");
//   		return;
			}
			reSearch = false;
			if(skillNum==0){
				alert("请至少选择一种技能");
				return;
			}
//选择技能信息
			var skills={
				"signInSkills":skillMes
			}
			$.extend(_index.CTIInfo,skills);
			_index.ctiInit.signIn();
			_index.destroyDialog();


//   	if(_index.ctiInit.getSignResult()!= "WAIT_SIGNIN"){
//   		_index.destroyDialog();
//   	};
//   	var setTimeout=setTimeout(function(){
//   		clearInterval(setTimeout);
//		_index.destroyDialog();
//   	},1500);
//   	var signInResultInt = setInterval(function(){
//			if (_index.ctiInit.getSignResult() != "WAIT_SIGNIN") {
//				clearInterval(signInResultInt);
//				_index.destroyDialog();
//			}
//		},20);

		};
		//点击取消
		var cancel = function(){
			var flag = confirm("确认关闭该窗口");
			if(flag){
				var comUI = _index.comMenu.comUI;
				//改变签入按钮为未签入，字体置灰不可用
				comUI.setAppointedInnerText('checkBtn','未签入');
				//把所有按钮置灰
				comUI.setAllBtnEnabled(false);
				comUI.setAppointedMoreBtnEnabled(['acceptRequestBtn','sendMessageBtn'],true);
				//放开短信下发按钮，使客服可以外发短信，
//			comUI.setAppointedBtnEnabled('sendMessageBtn',_index.getContactAuth().messageAuth);
				_index.destroyDialog();
			}
		};

		$(document).ready(function(){
			//隐藏关闭对话框的按钮
			$(".ui-dialog-close").hide();
		})
		//业务代码-列表初始化，已经废弃，没用用组件，不再调用
		var listInit = function(){
			_index.showLoading(false);
			var isSkillOptional = _index.CTIInfo.isSkillOptional;
			$(document).ready(function(){
				//隐藏关闭对话框的按钮
				$(".ui-dialog-close").hide();
				//技能队列选择是否可以选择
				if(isSkillOptional=="0"){
					$(".allSelect").removeAttr("onclick");
				}
				if(checkskills.length == 0){
					var skills = checkskills;
					var skills={
						"signInSkills":skills
					}
					$.extend(_index.CTIInfo,skills);
					_index.ctiInit.signIn();
					//add by zzy,考虑优化这种写法
					var signInResultInt = setInterval(function(){
						if (_index.ctiInit.getSignResult() != "WAIT_SIGNIN") {
							clearInterval(signInResultInt);
							_index.destroyDialog();
						}
					},20);
				}
			});

		}
		return initialize;
	});