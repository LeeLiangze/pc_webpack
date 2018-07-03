/**
 * Created by wangwei on 2017/2/9.
 * tab 组件示例
 */
define(['Util',
        'tab',
        '../../../tpl/example/component/tab/0.tpl',
        '../../../tpl/example/component/tab/1.tpl',
        '../../../tpl/example/component/tab/2.tpl'
    ],
    function(Util, Tab, tp0, tp1, tp2) {
        var tab = null;
        var module1 = null,
            module2 = null;
        var config = {
            el: $('.tabContainer'),
            tabs: [{
                title: '基本信息',
                click: function(e, tabData) {
                    tab.content($(tp0).html());
                }
            }, {
                title: '图文信息',
                click: function(e, tabData) {
                    if (!module1) {
                        module1 = $(tp1);
                        module1.on('click', function() {
                            console.log('1111');
                        });
                    }

                    tab.content(module1);
                }

            }, {
                title: '绑定合约信息',
                click: function(e, tabData) {
                    if (!module2) {
                        module2 = $(tp2);
                        module2.on('click', function() {
                            console.log('2222');
                        });
                    }
                    tab.content(module2);
                }
            }]
        };
        tab = new Tab(config);
    });
