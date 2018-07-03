/**
 * 转接弹出页
 */
define(['Compts','../../../../tpl/comMenu/comprehensiveCommunication/automaticProcess/transfer.tpl','../../../../assets/css/comMenu/comprehensiveCommunication/transfer.css'],
		function(Compts,transfer){

    //系统变量-定义该模块的根节点
    var _index,$el,_option,skillQueue,jobNumList,bodyZone,$bodyZone,multimediaTransfer,multimediaTransfer;

    var initialize = function(index,options){
        $el = $(transfer);
        _index = index;
        _option = options;
        bodyZone = $.find(".ui-dialog-content")[$.find(".ui-dialog-content").length-1];
        $bodyZone = $(bodyZone);
        buttonInit.call(this);
        eventInit.call(this);
		this.content = $el;
    };
    
    var buttonInit = function(){
    	var divTitle = $.find(".ui-dialog-title")[$.find(".ui-dialog-title").length-1];
    	$(divTitle).css({"width":"100px","float":"left"});
    	var activeSerialNo =  _index.CallingInfoMap.getActiveSerialNo();
    	var callingInfo = _index.CallingInfoMap.get(activeSerialNo);
    	var buttonMed = null;
    	if(callingInfo == null){
    		buttonMed = "<a class='t-btn t-btn-blue buttonmultimedia'>各省多媒体互转</a>";
    	}else{
    		var mediaType = callingInfo.mediaType;
    		if(mediaType == "5"){
    			buttonMed = "";
    		}else{
    			buttonMed = "<a class='t-btn t-btn-blue buttonmultimedia'>各省多媒体互转</a>";
    		}
    	}
    	var buttonStr = "<div id='transferMenu' style='float:left;width:70%;margin-top:8px'>"
    						+ "<a class='t-btn t-btn-blue buttonProcess'>自动流程</a>"
    						+ "<a class='t-btn t-btn-blue buttonSkill'>技能队列</a>"
    						+ "<a class='t-btn t-btn-blue buttonJobNum'>工号列表</a>"
    						+ buttonMed + "</div>";;
    	$(divTitle).after(buttonStr);
    }
    
    var eventInit = function() {
		$(".ui-dialog .buttonProcess").on("click",function(){
			var oriTpl = '<div class="sn-dataAuthMg"><div class="transfer" id="transferId"></div></div>';
			$bodyZone.empty().append(oriTpl);
			$el = $bodyZone;
			$("#transferMenu .t-btn").removeClass("activeBtn");
			$(this).addClass("activeBtn");
			//清空重复加载页的父节点
			$('.transfer',$el).empty().unbind();
			tabInit.call(this);
    	});
    	$(".ui-dialog .buttonSkill").on("click",function(){
    		$("#transferMenu .t-btn").removeClass("activeBtn");
			$(this).addClass("activeBtn");
    		skillQueueInit.call(this);
    		
    	});
    	$(".ui-dialog .buttonJobNum").on("click",function(){
    		$("#transferMenu .t-btn").removeClass("activeBtn");
			$(this).addClass("activeBtn");
    		jobNumListInit.call(this);
    	});
    	$(".ui-dialog .buttonmultimedia").on("click",function(){
    		$("#transferMenu .t-btn").removeClass("activeBtn");
			$(this).addClass("activeBtn");
    		multimediaTransferInit.call(this);
    	});
    	//初始化默认选项
    	$("#transferMenu .buttonProcess").addClass("activeBtn");
		tabInit.call(this);
    }

    //加载选项卡
    var tabInit = function(){
        //var serviceTypeId = _index.CTIInfo.beans[0].serviceTypeId
        var config = {
                    el:$('.transfer',$el),
                    tabs:[
	                        //转接人工服务
	                        {
	                            title:'转接业务办理',
	                            //render:function(){},
	                            click:function(e, tabData){	                            	
	                                require(['js/comMenu/comprehensiveCommunication/automaticProcess/transferServiceManagement'],function(ServiceManagement){
	                                	serviceManagement=new ServiceManagement(_index,_option);
	                                	tab.content(serviceManagement.content);
	                                });
	                            }
	                        },
	                        //转咨询语音
	                        {
	                            title:'转接咨询语音',
	                            //render:function(){},
	                            click:function(e, tabData){
	                                require(['js/comMenu/comprehensiveCommunication/automaticProcess/transferConsultVoice'],function(ConsultVoice){
	                                	consultVoice=new ConsultVoice(_index,_option);
	                                	tab.content(consultVoice.content);
	                                });
	                            }
	                        }
                    ]
                }
        //执行
        var tab = new Compts.Tab(config);
    }
    
    var skillQueueInit = function() {
    	require(['js/comMenu/comprehensiveCommunication/skillQueue/skillQueue'],function(SkillQueue){
        	skillQueue = new SkillQueue(_index,_option);
        	$bodyZone.empty().append(skillQueue.content);
        });
    }
    
    var jobNumListInit = function() {
    	require(['js/comMenu/comprehensiveCommunication/jobNumList/jobNumList'],function(JobNumList){
    		jobNumList = new JobNumList(_index,_option);
    		$bodyZone.empty().append(jobNumList.content);
        });
    }

    var multimediaTransferInit = function() {
    	require(['js/comMenu/multiMediaTransfer/multimediaTransfer'],function(multimediaTransfer){
    		multimediaTransfer = new multimediaTransfer(_index,_option);
    		$bodyZone.empty().append(multimediaTransfer.content);
        });
    }
    return initialize;
});