/**
 * Created by wwx288123 on 2016/3/30.
 * 员工个人配置管理
 */
define([
    'Util',
    'Compts',
    '../../tpl/skillCity/skillCityCfg.tpl',
    '../../assets/css/skillCity/skillCityCfg.css'],
    function(Util,Compts,tpl){
    //系统变量-定义该模块的根节点
    var $el = $(tpl);
    //系统变量-构造函数
    var _index;
    var skillCityList;
    var proviceName;
    var cityName;
    var ctiName;
    var vdnName;
    var proviceValue = "";
    var cityValue = "";
    var ctiValue = "";
    var vdnValue = "";
    var initialize = function(indexModule){
    	_index = indexModule;
    	initForm(this);
        //业务相关代码
        eventInit.call(this);
        //将根节点赋值给接口
        this.content = $el;
        printAll();
    };
    
    // form表单弹出树、下拉框 初始化 及 数据回显
	var initForm = function() {
		$('#proviceIdDivCfg', $el).off("change", "select");
    	$('#proviceIdDivCfg', $el).empty();
    	$('#ctiIdDivCfg', $el).off("change", "select");
    	$('#ctiIdDivCfg', $el).empty();
		var config = {
			el : $('#proviceIdDivCfg', $el), // 要绑定的容器
			label : '省份', // 下拉框单元左侧label文本
			name : 'provicename', // 下拉框单元右侧下拉框名称
			//value:true,
			url : 'front/sh/common!execute?uid=skill001' // 数据源
		}
		proviceName = new Compts.Select(config);
		if(_index.queue.browserName!="IE"){
			$('#proviceIdDivCfg', $el).append("<img src='src/assets/img/comMenu/connection-list-down-unactive.png' style='position:absolute;width:10px;top:17px;right:25px'/>");
		}
		proviceName.on("change",function(e,valueObj){
			
			proviceValue = valueObj.value;
			cityValue = "";
			
			if(valueObj.name == "请选择") {
				
				initCityName(true, "");
				
			} else {
				initCityName(false, valueObj.value);
			}
			$el.find('#FAnoPut').find("select").empty();
			$el.find('#FAhas').find("select").empty();
			printAll();
		});
		
		initCityName(true, "");
		
		var config = {
				el : $('#ctiIdDivCfg', $el), // 要绑定的容器
				label : 'CTI', // 下拉框单元左侧label文本
				name : 'ctiname', // 下拉框单元右侧下拉框名称
				url : 'front/sh/common!execute?uid=skill003' // 数据源
		}
		ctiName = new Compts.Select(config);
		if(_index.queue.browserName!="IE"){
			$('#ctiIdDivCfg', $el).append("<img src='src/assets/img/comMenu/connection-list-down-unactive.png' style='position:absolute;width:10px;top:17px;right:25px'/>");
		}
		ctiName.on("change",function(e,valueObj){
			ctiValue = valueObj.value;
		    vdnValue = "";
		    
			if(valueObj.name == "请选择") {
				
				initVdnName(true, "");
				
			} else {
				initVdnName(false, valueObj.value);
			}
			$el.find('#FAnoPut').find("select").empty();
			$el.find('#FAhas').find("select").empty();
			printAll();
		});
		
		initVdnName(true, "");
	};
	
	//根据条件初始化ctiName
    var initCityName = function(isDisabled, proviceId){
    	$('#cityIdDivCfg', $el).off("change", "select");
    	$('#cityIdDivCfg', $el).empty();
    	var config = {
				el : $('#cityIdDivCfg', $el), // 要绑定的容器
				label : '地市', // 下拉框单元左侧label文本
				name : 'cityname', // 下拉框单元右侧下拉框名称
				disabled:isDisabled,
				url : 'front/sh/common!execute?uid=skill002&proviceid=' + proviceId // 数据源
		}
		cityName = new Compts.Select(config);
    	if(_index.queue.browserName!="IE"){
    		$('#cityIdDivCfg', $el).append("<img src='src/assets/img/comMenu/connection-list-down-unactive.png' style='position:absolute;width:10px;top:17px;right:25px'/>");
    	}
    	cityName.on("change",function(e,valueObj){
    		
    		cityValue = valueObj.value;
			
			if(valueObj.value != "" && vdnValue != "") {
				
				initSkillInfo();
			} else {
				$el.find('#FAnoPut').find("select").empty();
				$el.find('#FAhas').find("select").empty();
			}
			printAll();
		});
    };
	
	//根据条件初始化已分配、未分配技能队列
    var initSkillInfo = function(){
		var params = 
		{
			"proviceid":proviceValue,
    		"cityid":cityValue,
    		"ctiid":ctiValue,
    		"vdnid":vdnValue
		};
		printAll();
		Util.ajax.postJson("front/sh/common!execute?uid=skill007",params,function(json,status){
			if (status) {
				
				$el.find('#FAnoPut').find("select").empty();
				for ( var i in json.beans) {
					if (json.beans[i].value != undefined) {
						$el.find('#FAnoPut').find("select").append("<option data-id="+json.beans[i].value+">"+json.beans[i].value+"（"+json.beans[i].name+"）"+"</option>");
					}
				 }
			}else{
			}
	 			    	
    	});
		Util.ajax.postJson("front/sh/common!execute?uid=skill008",params,function(json,status){
			
			if (status) {
				
				$el.find('#FAhas').find("select").empty();
				for ( var i in json.beans) {
					if (json.beans[i].value != undefined) {
						$el.find('#FAhas').find("select").append("<option data-id="+json.beans[i].value+">"+json.beans[i].value+"（"+json.beans[i].name+"）"+"</option>");
					}
				 }	
			}else{
			}
	 		    	
    	});
		
	};
    
	//根据条件初始化vdnName
    var initVdnName = function(isDisabled, ctiId){
    	$('#vdnIdDivCfg', $el).off("change", "select");
    	$('#vdnIdDivCfg', $el).empty();
    	var config = {
				el : $('#vdnIdDivCfg', $el), // 要绑定的容器
				label : 'VDN', // 下拉框单元左侧label文本
				name : 'vdnname', // 下拉框单元右侧下拉框名称
				disabled:isDisabled,
				url : 'front/sh/common!execute?uid=skill004&ctiid=' + ctiId // 数据源
		}
		vdnName = new Compts.Select(config);
    	if(_index.queue.browserName!="IE"){
    		$('#vdnIdDivCfg', $el).append("<img src='src/assets/img/comMenu/connection-list-down-unactive.png' style='position:absolute;width:10px;top:17px;right:25px'/>");
    	}
    	vdnName.on("change",function(e,valueObj){
			
    		vdnValue = valueObj.value;
			if(valueObj.value != "" && cityValue != "") {
				
				initSkillInfo();
			} else {
				$el.find('#FAnoPut').find("select").empty();
				$el.find('#FAhas').find("select").empty();
			}
			printAll();
		});
    };
    
    //初始化事件
    var eventInit=function(){
    	$el.on('click','.skillCitySaveCfg', $.proxy(save,this));
    	$el.on('click','.skillCityClearCfg', $.proxy(clear,this));
    	
    	$el.on('click','.selectOne', selectOne);
    	$el.on('click','.selectAll', selectAll);
    	$el.on('click','.returnOne', returnOne);
    	$el.on('click','.returnAll', returnAll);
    };
    
    var save = function(e)
    {
    	if (proviceValue == "" || cityValue == "" || ctiValue == "" || vdnValue == "") {
			alert("CTI、VDN、省份、地市下拉框都需要选择！");
			return;
		}
    	var options = $("#FAhasSelect option",$el);
    	
    	var hasSelect =  new Array();
    	for(var i=0;i<options.length;i++)
    	{
    		var option = $(options[i]);
    		var skillid=option.attr("data-id");
    		hasSelect[hasSelect.length] =  skillid;
    	}
    	
    	var info="";
    	for (var i = 0; i < hasSelect.length; i++)
    	{
    	     // 如果i+1等于选项长度则取值后添加空字符串，否则为逗号
    	     info = (info + hasSelect[i]) + (((i + 1)== hasSelect.length) ? '':','); 
    	}
		
    	var params = 
		{
			"proviceid":proviceValue,
    		"cityid":cityValue,
    		"skillid":info,
    		"ctiid":ctiValue,
    		"vdnid":vdnValue,
		};
    	Util.ajax.postJson('front/sh/common!execute?uid=skill009',params,function(json,status){
			if(status){
				alert("保存成功");
			}else{
				alert("保存失败");
			}
    	});
    };
    
    var selectOne = function(e)
    {
    	 var options = $("#FAnoSelect option:selected",$el);
    	 if(options.length==0){
    		 alert("请至少选择一项！");
    		 return;
    	 }
    	 var $nostaffselect =  $("#FAnoSelect",$el);
    	 var $hasstaffselect =  $("#FAhasSelect",$el);
    	
    	 for(var i = 0;i<options.length;i++){
    		 
    		 $hasstaffselect.append(options[i]);
    	 }
	 
    };
    
    var selectAll = function(e)
    {
    	 var options = $("#FAnoSelect option",$el);
    	 if(options.length==0){
    		 return;
    	 }
    	 var $nostaffselect =  $("#FAnoSelect",$el);
    	 var $hasstaffselect =  $("#FAhasSelect",$el);
    	 
    	 for(var i = 0;i<options.length;i++){
    		 $hasstaffselect.append(options[i]);
    	 }
	 };
	 
	 var returnOne = function(e)
	 {
    	 var options = $("#FAhasSelect option:selected",$el);
    	 if(options.length==0){
    		 alert("请至少选择一项！");
    		 return;
    	 }
    	 var $nostaffselect =  $("#FAnoSelect",$el);
    	 var $hasstaffselect =  $("#FAhasSelect",$el);
    	 
    	 for(var i = 0;i<options.length;i++){
    		
    		 $nostaffselect.append(options[i]);
    	 }
	 };
	 
	var returnAll = function(e)
	{
    	 var options = $("#FAhasSelect option",$el);
    	 if(options.length==0){
    		 return;
    	 }
    	 var $nostaffselect =  $("#FAnoSelect",$el);
    	 var $hasstaffselect =  $("#FAhasSelect",$el);
    	 
    	 for(var i = 0;i<options.length;i++){
    		
    		 $nostaffselect.append(options[i]);
    	 }
	 };
    //重置填写内容,并刷list
    var clear = function(e){
    	initForm(this);
    	$el.find('#FAnoPut').find("select").empty();
		$el.find('#FAhas').find("select").empty();
		proviceValue = "";
	    cityValue = "";
	    ctiValue = "";
	    vdnValue = "";
    }
    
    //值打印
    var printAll = function(){
    }
    return initialize;
});