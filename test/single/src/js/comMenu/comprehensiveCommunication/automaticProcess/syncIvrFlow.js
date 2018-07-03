define([
    'Util',
    'Compts',
    '../../../../tpl/comMenu/comprehensiveCommunication/automaticProcess/syncIvrFlow.tpl',
    '../../../../assets/css/comMenu/comprehensiveCommunication/automaticProcess/syncIvrFlow.css'
    ],
    function(Util,Compts,tpl){
    //系统变量-定义该模块的根节点
    var $el = $(tpl);
    var initialize = function(indexModule){
        //业务相关代码
        listInit();
        //将根节点赋值给接口
        this.content = $el;
    };

	//初始化缓存刷新list
	var listInit = function(main){
            var config = {
                el:$('.listContainer',$el)[0],
                field:{
                    key:'serviceTypeId',
                    items:[
                        { text:'业务类型',name:'serviceTypeName',className:'serviceTypeName'},
                        { text:'操作结果信息',name:'optionResult',className:'optionResult' }
                    ],
                    button:{
                        className:'w90',
                        items:[
                            { text:'同步',name:'syncFlow',click:function(e,item){
                            	var sibling = $el.find("tbody tr");
								for (var i=0;i<sibling.length;i++){
									var test = sibling[i].cells;
									if(test.length!=0){
										var temp = test[0].innerHTML;
										if(temp==item.data.serviceTypeName) {
											test[2].innerHTML ="<strong style='color:red'>同步中...</strong>";
										}
									}
								}
                            	Util.ajax.postJson("front/sh/callHandle!execute?uid=flowTree002",item.data,function(json,status){
                            		
                        			if (status && json.returnCode == "0") {
                        				setResult(item, "同步成功", json.bean.rmessage);
                        			
                        			} else {
                        				setResult(item, "同步失败", json.bean.rmessage);
                        		
                        			}
                        		})
                            } },
                        ]
                    }
                },
               /* page:{
                	perPage:10,
                	align:'right'
                },*/
                data:{
                	url:'src/assets/cache.json'
                } 
            }
            this.list = new Compts.List(config);
            this.list.search({});
    };
    
    //设置刷新结果
    var setResult = function(item, result,resultMessage){
    	var sibling = $el.find("tbody tr");
		
		for (var i=0;i<sibling.length;i++)
		{
			var test = sibling[i].cells;
			if(test.length!=0){
				var temp = test[0].innerHTML;
				if(temp==item.data.serviceTypeName) {
					test[1].innerHTML = resultMessage
					test[2].innerHTML = result;
				}
			}
		}
    };
    
    return initialize;
});