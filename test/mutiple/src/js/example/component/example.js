require(['Util','list','selectTree','date','select','validator'], function(Util, List,SelectTree,date,Select,Validator){
    var config = {
        el:$('#listContainer'),
        height:300, 
        field:{
           items:[
            { text:'标题',title:'text',name:'text',className:'w120',click:function(e,item){
                console.log(item)
            },render:function(item,val){
                //return '<a href="###">'+val + '</a>'
                return val;
            } },
            { text:'发布人',title:'content',name:'publishUser',className:'w70',render:function(item,val,$src){
                $src.on('click', '.link1', function(e){
                    console.log(val)
                });
                $src.on('click', '.link2', function(e){
                    console.log(val)
                });
                return '<a href="###" class="link2">'+val + '</a><a href="###" class="link2">链接2</a>'
                //return val;
            } },
            { text:'发布时间',name:'publishTime' }
        ]},
        page:{
            perPage:2,
            align:'right'
        },
        data:{
            url:'../../../data/list.json'
        }
    };
    var list = new List(config);
    list.search();

    //弹出树
    var selectTree = new SelectTree({
        el:$('.requestTypeWrap'),
        title:'部门选择',
        label:'弹出树',
        // check:true,
        name:'requestType',
        text:'黄华林,业务部',
        value:'13612345611,2',
        textField:'name',
        childNodeOnly:true, //仅仅选择子节点到文本域
        url:'../../../data/selectTree.json'
    });
    selectTree.on('confirm',function(nodes){
        if(nodes[0].isParent){
            console.log("请选择一个子节点");
            return false;
        }
    });
    //弹出异步树
    new SelectTree({
        el:$('.selectAsyncTree'),
        title:'业务选择',
        label:'弹出异步树',
        check:true,
        async:true,
        name:'requestType1',
        url:'../../../data/selectTree.json'
    });
    //时间组件
    new date( {
        el:$('#startTime'),
        label:'时间',
        double:{    //支持一个字段里显示两个日期选择框
            start:{
                name:'startTime',
                format: 'YYYY/MM/DD',
                min: laydate.now(-1),
                max: '2099-06-16 23:59:59',
                istime: true,
                istoday: false,
                choose: function(datas){
                    this.end.min = datas;     //设置结束日期的最小限制
                    this.end.start = datas;     //设置结束日期的开始值
                }
            },
            end:{
                name:'endTime',
                format: 'YYYY/MM/DD',
                min: laydate.now(-1),
                max: '2099-06-16 23:59:59',
                istime: true,
                istoday: false,
                choose: function(datas){
                    this.start.max = datas;     //设置开始日期的最大日期
                }
            }
        }
    });

    var select=new Select({
        el:$('.userLevelWrap'),
        label:'用户级别',
        name:'subsLevel',
        // disabled:true,
        topOption:"所有",
        value:'',
        url:'../../../data/select.json'
    });
    select.on("change",function(e,valueObj){
        console.log(valueObj);
    });
    //表单验证
    var validator = new Validator({
        el: $("form"),
        submitBtn: $(".btnSearch"),
        dialog:true,
        rules:{
            startTime:"required|date",
            endTime:"required|date",
            email:'required|email',
            requestType1:'required',
            mobile:'required|mobile',
            brand:"required",
            textarea:"required|min-10"
        },
        messages:{
            startTime:{
                date:"日期格式不正确"
            },
            textarea:{
                min:"内容输入字数不能少于10"
            }
        }
    });

    //添加验证规则
    validator.addMethod("qq", function (str) {
        return new RegExp("^[1-9]*[1-9][0-9]*$").test(str);
    });

    //验证成功回调
    validator.on("success", function () {
        console.log("验证成功");
    });
})
