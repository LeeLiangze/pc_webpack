/**
 * 转接弹出页
 */
define(['Compts','../../../tpl/content/editArea/transfer.tpl'],function(Compts,transfer){

    //系统变量-定义该模块的根节点
    var _index = null;
    var $el = null;
    var _option = null;

    var initialize = function(index,options){
        $el = $(transfer);
        _index = index;
        _option = options;
        //业务代码
        tabInit.call(this);
        this.content = $el;
    };

    //加载选项卡
    var tabInit = function(){
        var config = {
            el:$('.transfer',$el),
            tabs:[
                {
                    title:'技能队列',
//                    render:function(){},
                    click:function(e, tabData){
                        require(['../../content/editArea/skillQueue'],function(SkillQueue){
                            var skillQueue=new SkillQueue(_index,_option);
                            tab.content(skillQueue.content);
                        });
                    }
                },
                {
                    title:'工号列表',
//                    render:function(){}, 
                    click:function(e,tabData){
                        require(['../../content/editArea/jobNumList'],function(JobNumList){
                            var jobNumList=new JobNumList(_index,_option);
                            tab.content(jobNumList.content);
                        });
                    }
                }
            ]
        }
        var tab = new Compts.Tab(config);
    }

    return initialize;
});