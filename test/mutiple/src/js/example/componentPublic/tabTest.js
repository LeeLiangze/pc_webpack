/**
 * Created by wangwei on 2017/2/9.
 * tabTest 组件示例
 */
require(['tab', '../../../tpl/example/component/tabTest/tabTest.tpl', 'jquery'], function(Tab, tpl) {
    var config = {
        el: $('#tabTestContainer'),
        // tpl:tpl,
        tabs: [{
            title: '基本信息',
            click: function(e, tabData) {
                tab0.content('<div id="tabContainer-1"></div>');
                tab_test();
            }
        }, {
            title: '图文信息',
            click: function(e, tabData) {
                require(['../component/list/list'], function(List) {
                    tab0.content(new List().content);
                });
            }
        }, {
            title: '绑定合约信息',
            click: function(e, tabData) {
                tab0.content("<div>绑定合约信息</div>");
            }
        }]
    };
    var tab0 = new Tab(config);
    //内层选项卡
    var tab_test = function() {
        var config1 = {
            el: $('#tabContainer-1'),
            tabs: [{
                title: '基本信息1',
                click: function(e, tabData) {
                    require(['../component/list/list'], function(List) {
                        tab1.content(new List().content);
                    });
                }
            }, {
                title: '图文信息1',
                click: function(e, tabData) {
                    tab1.content("<div>图文11信息</div>");
                }
            }, {
                title: '绑定合约信息1',
                click: function(e, tabData) {
                    tab1.content("<div>绑定合11约信息</div>");
                }
            }]
        };
        var tab1 = new Tab(config1);
    };

});
