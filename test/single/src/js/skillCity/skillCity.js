/**
 * Created by lwx312688 on 2016/2/24.
 * 员工个人配置管理
 */
define(['Compts',
    '../../tpl/skillCity/skillCity.tpl'],
    function(Compts,tpl){
    //系统变量-定义该模块的根节点
    var $el = $(tpl);
    //系统变量-构造函数
    var _index;
    var skillCityList;
    var proviceName;
    var cityName;
    var ctiName;
    var vdnName;
    var skillName;
    var initialize = function(indexModule){
    	_index = indexModule;
    	initForm(this);
        //业务相关代码
        listInit.call(this);
        eventInit.call(this);
        /*require(['js/btnAuthority'], function(Authority){
        	new Authority($el);
        	});*/
        //将根节点赋值给接口
        this.content = $el;
    };
    
    // form表单弹出树、下拉框 初始化 及 数据回显
	var initForm = function() {
		$('#proviceIdDiv', $el).off("change", "select");
		$('#proviceIdDiv', $el).empty();
		$('#ctiIdDiv', $el).off("change", "select");
		$('#ctiIdDiv', $el).empty();
		var config = {
			el : $('#proviceIdDiv', $el), // 要绑定的容器
			label : '省份', // 下拉框单元左侧label文本
			name : 'provicename', // 下拉框单元右侧下拉框名称
			//value:true,
			url : 'front/sh/common!execute?uid=skill001' // 数据源
		}
		proviceName = new Compts.Select(config);
		if(_index.queue.browserName!="IE"){
			$('#proviceIdDiv', $el).append("<img src='src/assets/img/comMenu/connection-list-down-unactive.png' style='position:absolute;width:10px;top:17px;right:25px'/>");
    	}
		proviceName.on("change",function(e,valueObj){
			if(valueObj.name == "请选择") {
				initCityName(true, "");
			} else {
				initCityName(false, valueObj.value);
			}
			
		});
		
		initCityName(true, "");
		
		var config = {
				el : $('#ctiIdDiv', $el), // 要绑定的容器
				label : 'CTI', // 下拉框单元左侧label文本
				name : 'ctiname', // 下拉框单元右侧下拉框名称
				url : 'front/sh/common!execute?uid=skill003' // 数据源
		}
		ctiName = new Compts.Select(config);
		if(_index.queue.browserName!="IE"){
			$('#ctiIdDiv', $el).append("<img src='src/assets/img/comMenu/connection-list-down-unactive.png' style='position:absolute;width:10px;top:17px;right:25px'/>");
    	}
		ctiName.on("change",function(e,valueObj){
			
			if(valueObj.name == "请选择") {
				
				initVdnName(true, "");
				initSkillName(true, "", "");
			} else {
				initVdnName(false, valueObj.value);
			}
			
		});
		
		initVdnName(true, "");
		
		initSkillName(true, "", "")
	};
	
	//根据条件初始化ctiName
    var initCityName = function(isDisabled, proviceId){
    	$('#cityIdDiv', $el).off("change", "select");
    	$('#cityIdDiv', $el).empty();
    	var config = {
				el : $('#cityIdDiv', $el), // 要绑定的容器
				label : '地市', // 下拉框单元左侧label文本
				name : 'cityname', // 下拉框单元右侧下拉框名称
				disabled:isDisabled,
				url : 'front/sh/common!execute?uid=skill002&proviceid=' + proviceId // 数据源
		}
    	
    /*	setTimeout(function(){
    	},100);*/
    	cityName = new Compts.Select(config);
    	if(_index.queue.browserName!="IE"){
    		$('#cityIdDiv', $el).append("<img src='src/assets/img/comMenu/connection-list-down-unactive.png' style='position:absolute;width:10px;top:17px;right:25px'/>");
    	}
    	//$('#cityIdDiv', $el).show();
    };
	
	//根据条件初始化vdnName
    var initVdnName = function(isDisabled, ctiId){
    	$('#vdnIdDiv', $el).off("change", "select");
    	$('#vdnIdDiv', $el).empty();
    	var config = {
				el : $('#vdnIdDiv', $el), // 要绑定的容器
				label : 'VDN', // 下拉框单元左侧label文本
				name : 'vdnname', // 下拉框单元右侧下拉框名称
				disabled:isDisabled,
				url : 'front/sh/common!execute?uid=skill004&ctiid=' + ctiId // 数据源
		}
		vdnName = new Compts.Select(config);
    	if(_index.queue.browserName!="IE"){
    		$('#vdnIdDiv', $el).append("<img src='src/assets/img/comMenu/connection-list-down-unactive.png' style='position:absolute;width:10px;top:17px;right:25px'/>");
    	}
    	
    	vdnName.on("change",function(e,valueObj){
			
			if(valueObj.name == "请选择") {
				
				initSkillName(true, "", "");
			} else {
				initSkillName(false, ctiName.getSelected().value, valueObj.value);
			}
			
		});
        
    };
    
    //根据条件初始化skillName
    var initSkillName = function(isDisabled, ctiId, vdnId){
    	$('#skillIdDiv').off("change", "select");
    	$('#skillIdDiv').empty();
    	var config = {
				el : $('#skillIdDiv', $el), // 要绑定的容器
				label : '技能队列', // 下拉框单元左侧label文本
				name : 'skillname', // 下拉框单元右侧下拉框名称
				disabled:isDisabled,
				url : 'front/sh/common!execute?uid=skill005&ctiid=' + ctiId + '&vdnid=' + vdnId// 数据源
		}
		skillName = new Compts.Select(config);
    	if(_index.queue.browserName!="IE"){
    		$('#skillIdDiv', $el).append("<img src='src/assets/img/comMenu/connection-list-down-unactive.png' style='position:absolute;width:10px;top:17px;right:25px'/>");
    	}
    };
	
	
    //初始化事件
    var eventInit=function(){
    	
    	$el.on('click','.skillCitySearch', $.proxy(search,this));
    	$el.on('click','.skillCityClear', $.proxy(clear,this));
    	$el.on('click','#skillCityCfg', $.proxy(skillCityCfg,this));
    };
    //重置填写内容,并刷list
    var clear = function(e){
    	
    	initForm(this);
    }
    //根据条件搜索
    var search = function(e){
    	
        var result = {
        		"proviceid":proviceName.getSelected().value,
        		"cityid":cityName.getSelected().value,
        		"ctiid":ctiName.getSelected().value,
        		"vdnid":vdnName.getSelected().value,
        		"skillid":skillName.getSelected().value
        };
        skillCityList.search(result);
        
    };
    
    var skillCityCfg = function(e){
    	_index.main.createTab('关联地市配置','js/skillCity/skillCityCfg', skillCityList);
    }
    
	//初始化人员信息list
	var listInit = function(main){

            var config = {
                el:$('.listContainer',$el)[0],
                field:{
                    key:'typeId',
                    popupItems:[
                        { text:'省份',name:'provicename',className:'w70' },
                    ],                   
                    items:[
                          
                        { text:'省份',name:'provicename',className:'provicename',click:function(e,item){
                          
                        },render:function(item,val){
                            return val;
                        } },
                        { text:'地市',name:'cityname',className:'cityName'},
                        { text:'CTI',name:'ctiname',className:'ctiName'},
                        { text:'VDN',name:'vdnname',className:'vdnName'},
                        { text:'技能队列',name:'skillname',className:'skillName'}
                    ],
                },
                page:{
                	perPage:10,
                	align:'right'
                },
                data:{
                    url:'front/sh/common!execute?uid=skill006'
                } 
            }
            this.list = new Compts.List(config);
            this.list.search({});
            
            skillCityList = this.list;
    };
    return initialize;
});