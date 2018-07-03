/**
 * Created by wangwei on 2017/2/9.
 * date 组件示例
 */
define(['Util',
        'date',
        '../../../tpl/example/component/date/date.tpl'],
    function (Util, MyDate, tpl) {
        //系统变量-定义该模块的根节点
        var $el = $(tpl);
        //系统变量-构造函数
        var initialize = function () {
            // new MyDate( {
            //     el:$('#date2'),
            //     label:'开始结束日期',     //label内容
            //     double:{    //支持一个字段里显示两个日期选择框
            //         start:{
            //             name:'startTime',   //开始日期文本框name
            //             format: 'YYYY-MM-DD',   //日期格式
            //             min: laydate.now(-1),   //最小日期
            //             max: '2099-06-16 23:59:59', //最大日期
            //             istime: true,
            //             istoday: false,
            //             choose: function(datas){
            //                 this.end.min = datas;     //设置结束日期的最小限制
            //                 this.end.start = datas;     //设置结束日期的开始值
            //             }
            //         },
            //         end:{
            //             name:'endTime',     //结束日期文本框name
            //             format: 'YYYY-MM-DD',   //日期格式
            //             min: laydate.now(-1),   //最小日期
            //             max: '2099-06-16 23:59:59', //最大日期
            //             istime: true,
            //             istoday: false,
            //             choose: function(datas){
            //                 this.start.max = datas;     //设置开始日期的最大日期
            //             }
            //         }
            //     }
            // });
            require(['../componentPublic/date.js'],function(dateExample){})
            //将根节点赋值给接口
            this.content = $el;
        };


        return initialize;
    });