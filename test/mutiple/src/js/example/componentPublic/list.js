/**
 * Created by wangwei on 2017/2/9.
 * list 组件示例
 */
define([
        'Util',
        'list'
    ],
    function (Util, List) {
        var num = 0;
        var config = {
            el: $('#listContainer'),
            className: 'listContainer',
            field: {
                boxType: 'checkbox',
                key: 'id',
                popupLayer: {
                    text: "详情",
                    width: 800,
                    height: 250,
                    groups: [{
                        title: '<span style="color:#f00; ">title0</span>',
                        items: [
                            [
                                {text: '公告名称', name: 'anoceTitleNm'},
                                {text: '公告ID', name: 'anoceId'}
                            ]
                        ]
                    }, {
                        title: 'title1',
                        items: [
                            [
                                {text: '公告类型', name: 'typeNm'},
                                {text: '公告类别ID', name: 'anoceTypeId'}
                            ],

                            [
                                {text: '发布状态', name: 'anoceIssueStsCdShow'},
                                {text: '有效状态', name: 'anoceRecStsCdShow'}
                            ],
                            [
                                {text: '生效时间', name: 'bgnEffTime'},
                                {text: '失效时间', name: 'endEffTime'}
                            ]
                        ]
                    }, {
                        title: 'title2',
                        items: [
                            [
                                {text: '接收组织', name: 'rcvOrgBrnchNm'}
                            ]
                        ]
                    }]
                },
                items: [{
                    text: '序号',
                    name: '',
                    render: function () {
                        return num += 1;
                    }
                }, {
                    text: '公告标题',
                    name: 'anoceTitleNm',
                    className: 'w120'
                },
                    {text: '公告类别', name: 'typeNm'},
                    {text: '紧急程度', name: 'urgntExtentTypeCdShow', sorting: 1},
                    {text: '发布状态', name: 'anoceIssueStsCdShow', sorting: -1},
                    {text: '有效状态', name: 'anoceRecStsCdShow'},
                    {text: '创建时间', name: 'crtTime'},
                    {text: '操作日期', name: 'odrOpTime'}
                ],
                button: {
                    className: 'btnHandle',
                    render: function (e, item) {
                        var $el = $('<a href="">链接</a>');
                        $el.on('mouseenter ', function () {
                            console.log('fff');
                            return false;
                        })
                        return $el;
                    },
                    items: [{
                        text: '编辑',
                        name: 'editor',
                        click: function (e, item) {
                            console.log('editor is checked.')
                        }
                    },
                        {text: '查看', name: 'viewer'},
                    ]
                }
            },
            page: {
                customPages: [2, 3, 5, 10, 15, 20, 30, 50],
                perPage: 2,
                total: true,
                align: 'right',
                button: {
                    className: 'btnStyle',
                    // url:'../js/list/autoRefresh',
                    items: [{
                        text: '删除',
                        name: 'deleter',
                        click: function (e) {
                            // 打印当前按钮的文本
                            console.log('点击了删除按钮' + '+' + this.text)
                        }
                    }, {
                        text: '暂停',
                        name: 'stopToggle',
                        click: function (e) {
                            // 打印当前按钮的文本
                            console.log('点击了暂停按钮' + '+' + this.text)
                        }
                    }, {
                        text: '导出',
                        name: 'export'
                        // exportURL:"/ngvlcs/front/sh/appVersion!execute?uid=x0002"
                    }]
                }
            },
            data: {
                url: '../../../../data/list_notice.json',
            }
        };
        var list = new List(config);
        list.search({});
        list.on('success', function (result) {
            var _this = this;
            list.$el.on("click", '.btnCustom2', function (e) {
                //提供这个属性 _this.exportszHead
                window.open("/ngvlcs/front/sh/appVersion!execute?uid=x0002" + JSON.stringify(_this.exportsHead))
            })
        });
    });
