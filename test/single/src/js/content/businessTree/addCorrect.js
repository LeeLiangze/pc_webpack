define([ 'Util', 'Compts',
         '../../../tpl/content/businessTree/addCorrect.tpl',
         '../../index/constants/mediaConstants'],
         function(Util, Compts,tpl,MediaConstants) {
	var $el = $(tpl);
	var _index;
	var _option;
	
	var initialize = function(index, option) {
		_index = index;
		_option = option;
		initSelect();
		initEvent.call(this);
		// 将根节点赋值给接口
		this.content = $el;
	};
	var initSelect = function(){
		$el.find("#rcvPrsnIdSet").empty();
		var option = "<option value=''>请选择</option>";
		Util.ajax.postJson("front/sh/common!execute?uid=businessTree007",{"proviceId":_option.proviceId,"roleId":MediaConstants.CORRECT_ROLE_ID},function(json,status){
			if(status){
				if(json.beans.length){
					$.each(json.beans,function(index,bean){
						option += "<option value='"+bean.staffId+"'>"+bean.staffName+"</option>";
					});
					$el.find("#rcvPrsnIdSet").append(option);
				}else{
					$el.find("#rcvPrsnIdSet").append(option);
				}
			}else{
				$el.find("#rcvPrsnIdSet").append(option);
			}
		},true);
	}
	//初始化事件
	var initEvent = function() {
		$el.on('click', '#btnCorrectSave',$.proxy(function(){
			btnCorrectSave(_option);
		},this));
		$('#urgntExtentTypeCd', $el).val("1");
		$('#titleNm', $el).val("");
		$('#newsCntt', $el).val("");
		this.flag = false ; 
	}
	
	//新增分类
	var btnCorrectSave = function(_option) {
		if(this.flag){
			return ; 
		}
		this.flag = true ;
		var $form = $('#addCorrectForm form');
        var result = Util.form.serialize($form);
        //参数封装
        var userInfo = _index.getUserInfo();
        result.sdPrsnId = userInfo.staffId;
        result.sdPrsnName = userInfo.staffName;
        result.updateOrNewInfo = "0";
        //校验
        if(!$.trim(result.rcvPrsnIdSet)&&!$.trim(result.rcvPrsnNameSet)){
        	alert("请选择管理员");
        	this.flag = false ; 
        	return;
        }
        if(!$.trim(result.titleNm)){
        	alert("便签标题不能为空");
        	this.flag = false ; 
        	return;
        }
        if($.trim(result.titleNm).length>20){
        	alert("便签标题不能超过20个字");
        	this.flag = false ; 
        	return;
        }
        var re = /^[\u4e00-\u9fa5a-z]+$/gi;//只能输入汉字和英文字母
        if (!re.test($.trim(result.titleNm))) {
        	alert("便签标题只能输入汉字和英文字母");
        	this.flag = false ; 
            return;
        }
        if(!$.trim(result.newsCntt)){
        	alert("便签内容不能为空");
        	this.flag = false ; 
        	return;
        }
        if($.trim(result.newsCntt).length>500){
        	alert("便签内容不能超过500个字");
        	this.flag = false ; 
        	return;
        }
        
        result.rcvPrsnNameSet = $('#rcvPrsnIdSet>option:selected',$el).text();
        var params = {};
        params = {
        	tenantId : _option.proviceId,
	        noteTitle : result.titleNm,
	        noteContent : result.newsCntt,
	        sendPrsnId  : result.sdPrsnId,
	        sendPrsnNm : result.sdPrsnName,
	        rcvPrsnId : result.rcvPrsnIdSet,
	        rcvPrsnNm : result.rcvPrsnNameSet
        }
        Util.ajax.postJson('front/sh/common!execute?uid=serviceTree011',params,function(json,status){
        	if (status) {
        		if(json.returnCode=="0"){
        			this.flag = false ; 
	    			alert("发送成功！");
	    			_index.destroyDialog();
				}else{
					this.flag = false ; 
					alert('发送失败')
				}
			}else{
				this.flag = false ; 
				alert("发送失败!");
			}
       	});
	}
	return initialize;
});