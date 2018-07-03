define(['backbone', 'hdbHelper',
        './list.tpl',
        './listTips.tpl',
        './overlay.tpl',
        './loading.tpl',
        'jqueryui',
        'artDialog',
        './list.css',
        '../../lib/dialog/6.0.4/css/ui-dialog.css',
        'jquery.pagination',
        '../../lib/jqueryPlugin/pagination/1.2.1/pagination.css',
        '../../lib/jQueryUI/jquery-ui.min.css'
    ],
    function (Backbone, hdb, tpl, listTipsTpl, overlayTpl, loadingTpl) {

        var version = '${{version}}';
        var Model = Backbone.Model.extend({});
        var ListItemCellModel = Backbone.Model.extend({});
        var Collection = Backbone.Collection.extend({
            model: Model
        });

        var pageInit = function (result) {
            var $pagination = this.$pagination = $('.sn-list-footer .sn-list-pagination', this.el);
            var total = result.bean.total || 0;
            var optTotal = null;
            if (this.options.page.total) {
                optTotal = '共' + total + '条';
            }
            if (!this.loaded) {
                this.loaded = 1;
                this.objPagination = $pagination.pagination(total, {
                    'items_per_page': this.options.page.perPage || 10,
                    'current_page': typeof this.pageIndex == 'undefined' ? 0 : this.pageIndex,
                    'num_display_entries': 3,
                    'num_edge_entries': 1,
                    'skip_page': "跳转",
                    //'link_to': '#tradeRecordsIndex' ,
                    'link_to': 'javascript:;',
                    'total': optTotal,
                    'prev_text': "上一页",
                    'next_text': "下一页",
                    'call_callback_at_once': false, //控制分页控件第一次不触发callback.
                    'custom_pages': this.options.page.customPages || [10],
                    'callback': $.proxy(function (pageIndex, $page) {
                        loading.call(this, pageIndex);
                    }, this)
                });

            }
        }

        //加载顺序 loading->ajaxStart->ajaxHandle->loadHandle
        var loading = function (pageIndex) {
            if (pageIndex == null) {
                console.log('组件-列表 数据加载失败（请检查数据格式）');
                return false;
            }
            this.pageIndex = pageIndex;
            //!检查
            // if(!this.url && this.options.data){
            //     this.url=this.options.data.url;
            // }
            loadingShow.call(this);
            //直接加载数据时，初始化默认值
            if (typeof (pageIndex) == "object") {
                var result = null;
                if (pageIndex.length >= 0) {
                    result = {
                        bean: {total: 1},
                        beans: pageIndex
                    }
                } else {
                    result = pageIndex;
                }
                ajaxHandle.call(this, result);
            } else {
                pageIndex = pageIndex || 0;
                ajaxStart.call(this, pageIndex);
            }
            // $('.sn-list',this.$el).addClass('sn-list-loading');
        }
        var loadingShow = function () {
            var $blockOverlay = $('.sn-list-blockOverlay', this.$el).addClass('sn-list-display-block');
            var template = hdb.compile(loadingTpl);
            $blockOverlay.html(template({}));
        }
        // var loadingHide = function(){
        //     $('.sn-list-blockOverlay', this.$el).addClass('sn-list-display-block');
        // }

        var ajaxStart = function (pageIndex) {
            var perPage = ((this.objPagination && this.objPagination.perPage) || (this.options.page && this.options.page.perPage)) || 3;
            var start = pageIndex * perPage,
                searchParam = this.searchParam,
                options = this.options;
            if (searchParam) {
                $.extend(searchParam, {
                    start: start,
                    limit: perPage,
                    page: pageIndex + 1,
                    _: Math.random()
                });
            }

            var ajaxOptions = $.extend({
                url: options.data.url,
                type: 'post',
                dataType: 'json',
                data: searchParam,
                success: $.proxy(function (result) {
                    var content = result;
                    ajaxHandle.call(this, result);
                }, this),
                error: function (err) {
                    loadHandle.call(this, {
                        returnCode: '-1',
                        returnMessage: '数据加载失败',
                        bean: null,
                        beans: []
                    });
                    console.log('组件-列表 数据加载失败，请检查数据接口 ' + options.data.url);
                }
            }, options.ajax);
            $.ajax(ajaxOptions);
        }

        var ajaxHandle = function (result) {
            $('tbody', this.el).empty();
            $('.sn-list', this.$el).removeClass('sn-list-loading');
            this.total = result.bean.total;
            loadHandle.call(this, result);
            this.options.page && pageInit.call(this, result);
            this.trigger('success afterBuild', result);
            // tr隔行换色js兼容处理
            for (var i = 0; i < $('.sn-list tbody', this.el).length; i++) {
                for (var j = 0; j < $('.sn-list tbody', this.el).eq(i).find('tr').length; j++) {
                    if (j % 2 === 0) {
                        $('.sn-list tbody', this.el).eq(i).find('tr').eq(j).addClass('evenTr');
                    } else {
                        $('.sn-list tbody', this.el).eq(i).find('tr').eq(j).addClass('oddTr');
                    }
                }
            }

            // resizableInit.call(this);
        };

        var loadHandle = function (result) {
            var addOne = function (i, model) {
                var config = {model: model, listOptions: this.options};
                var lockedListItem = new LockedContentListItem(config);
                $('.sn-list-content-locker table>tbody ', this.el).append(lockedListItem.render().el);
                var contentListItem = new ContentListItem(config);
                $('.sn-list-content table>tbody ', this.el).append(contentListItem.render().el);
                var listItemEnter = function (e) {
                    var index = lockedListItem.$el.closest('table').find('tr').index(lockedListItem.$el);
                    var $lockedListTrs = lockedListItem.$el.closest('table').find('tr');
                    var $contentListTrs = contentListItem.$el.closest('table').find('tr');
                    var $lockedListItemTr = $lockedListTrs.eq(index);
                    var $contentListItemTr = $contentListTrs.eq(index);
                    $contentListItemTr.addClass('hover');
                    $lockedListItemTr.addClass('hover');
                }
                var listItemLeave = function (e) {
                    var $lockedListTrs = lockedListItem.$el.closest('table').find('tr');
                    var $contentListTrs = contentListItem.$el.closest('table').find('tr');
                    $contentListTrs.removeClass('hover');
                    $lockedListTrs.removeClass('hover');
                }
                lockedListItem.on('checkboxChange', $.proxy(function (e, checked) {
                    var index = lockedListItem.$el.closest('table').find('tr').index(lockedListItem.$el);
                    var $contentListItemTr = contentListItem.$el.closest('table').find('tr').eq(index);
                    if (checked) {
                        $contentListItemTr.addClass('selected');
                    } else {
                        var $checkAllBox = $('.sn-list-header-locker').find('input');
                        var isChecked = $checkAllBox.is(":checked");
                        if (isChecked) {
                            $checkAllBox.prop('checked', false);
                        }
                        $contentListItemTr.removeClass('selected');
                    }
                    this.trigger('checkboxChange', e, model.toJSON(), checked);
                }, this));
                lockedListItem.on('rowClick', $.proxy(function (e, data) {
                    var index = lockedListItem.$el.closest('table').find('tr').index(lockedListItem.$el);
                    var $contentListTrs = contentListItem.$el.closest('table').find('tr');
                    var $contentListItemTr = $contentListTrs.eq(index);
                    if (this.options.field.boxType == "radio") {
                        $contentListTrs.removeClass('selected');
                        $contentListItemTr.addClass('selected');
                        this.selectedData = data;
                    }
                    this.trigger('rowClick', e, data);
                }, this));
                contentListItem.on('rowClick', $.proxy(function (e, data) {
                    var index = contentListItem.$el.closest('table').find('tr').index(contentListItem.$el);
                    var $lockedListTrs = lockedListItem.$el.closest('table').find('tr');
                    var $lockedListItemTr = $lockedListTrs.eq(index);
                    if (this.options.field.boxType == "radio") {
                        $lockedListTrs.removeClass('selected');
                        $lockedListItemTr.addClass('selected');
                        this.selectedData = data;
                    }
                    this.trigger('rowClick', e, data);
                }, this));
                lockedListItem.on('rowEnter', $.proxy(function (e) {
                    listItemEnter.call(this, e);
                    this.trigger('listItemEnter', e);
                }, this));
                contentListItem.on('rowEnter', $.proxy(function (e) {
                    listItemEnter.call(this, e);
                    this.trigger('listItemEnter', e);
                }, this));
                lockedListItem.on('rowLeave', $.proxy(function (e) {
                    listItemLeave.call(this, e);
                    this.trigger('listItemLeave', e);
                }, this));
                contentListItem.on('rowLeave', $.proxy(function (e) {
                    listItemLeave.call(this, e);
                    this.trigger('listItemLeave', e);
                }, this));
                var translateCellClick = function (e, data) {
                    this.trigger('cellClick', e, data, text);
                }
                var translateRowDoubleClick = function (e) {
                    this.trigger('rowDoubleClick', e, model.toJSON());
                }
                lockedListItem.on('cellClick', $.proxy(translateCellClick, this));
                contentListItem.on('cellClick', $.proxy(translateCellClick, this));
                lockedListItem.on('rowDoubleClick', $.proxy(translateRowDoubleClick, this));
                contentListItem.on('rowDoubleClick', $.proxy(translateRowDoubleClick, this));
            };
            this.collection = new Collection(result.beans);
            var $content = $('.sn-list-content-locker, .sn-list-content', this.$el);
            var $blockOverlay = $('.sn-list-blockOverlay', this.$el);
            if (this.collection.models.length) {
                $.each(this.collection.models, $.proxy(addOne, this));
                $content.removeClass('sn-list-hide').addClass('sn-list-show');
                $blockOverlay.removeClass('sn-list-display-block').addClass('sn-list-hide');
            } else {
                $content.removeClass('sn-list-show').addClass('sn-list-hide');
                $blockOverlay.removeClass('sn-list-hide').addClass('sn-list-display-block');
                var templateOverlay = hdb.compile(overlayTpl);
                $blockOverlay.html(templateOverlay(result));
                var $overlayText = $('>div', $blockOverlay);
                if (result && (result.returnCode != 0 || !result.returnMessage)) {
                    console.log('组件-列表 接口没有返回任何数据，错误码' + result.returnCode);
                }
            }
            var that = this;
            setTimeout(function () {
                // 代替colgroup结构来处理列宽一致问题
                $('.sn-list-content tr:eq(0) td', that.el).each(function (k, v) {
                    // var iWidth = $('.sn-list-header-wrap th', that.el).eq(k).width();
                    var iWidth = $(v).width();
                    $(v).width(iWidth);
                    $('.sn-list-header-wrap th', that.el).eq(k).width(iWidth);
                });
                // 初始化列宽完成后，设置以下属性满足拖动完全，否则拖动不能压缩内容
                $('.sn-list-resizable', that.el).width($('.sn-list-also', that.el).width()).css({'table-layout': 'fixed'});
                $('.sn-list-also', that.el).css({'table-layout': 'fixed'});
                resizableInit.call(that);
            }, 100);
        };

        var LockedContentListItem = Backbone.View.extend({
            tagName: 'tr',
            events: {
                'click    td>input': 'changeSelectStatus',
                'click    ': 'rowClick',
                'dblclick ': 'rowDoubleClick',
                'click    .boxWraper': 'boxWrapperClick',
                'mouseenter   ': 'rowEnter',
                'mouseleave   ': 'rowLeave'
            },
            initialize: function (options) {
                this.options = options;
                this.model.on('change:checked', $.proxy(function (model, checked) {
                    // this.render();  //???
                    var boxType = this.options.listOptions.field.boxType;
                    var $el = this.$el;
                    var $box = $('.boxWraper>input', $el);
                    if (boxType == 'checkbox' && checked) {
                        $box.prop('checked', true);
                        $el.addClass('selected');
                    } else if (boxType == 'checkbox' && !checked) {
                        $box.prop('checked', false);
                        $el.removeClass('selected');
                    }
                    this.trigger('checkboxChange', {}, checked);
                }, this));
            },
            render: function () {
                var json = this.model.toJSON();
                var listOptions = this.options.listOptions;
                var boxType = listOptions.field.boxType;
                var field = listOptions.field;
                var button = field.button;
                var $el = this.$el.html('');
                if (boxType) {
                    switch (boxType) {
                        case 'checkbox':
                            var $boxWraper = $('<td class="boxWraper"></td>');
                            var $box = $('<input type="checkbox" />');
                            $box.val(json[this.options.listOptions.field.key]);
                            // value="'+  +'" '+ (json.checked?'checked=checked':'') +' 
                            if (json.checked) {
                                $box.attr('checked', 'true')
                            }
                            $boxWraper.append($box);
                            break;
                    }
                    $el.append($boxWraper);
                }
                if (button && button.locked) {
                    var listItemButton = new ListItemButton(button, json);
                    $el.append(listItemButton.$el);
                }
                $.each(field.items, $.proxy(function (i, item) {
                    if (item && item.locked) {
                        var cellView = new ListItemCellView({config: item, data: json});
                        $el.append(cellView.render().el);
                    }
                }, this));

                return this;
            },
            rowClick: function (e) {
                var $src = $(e.currentTarget);
                this.trigger('rowClick', e, this.model.toJSON());
                if (this.options.listOptions.field.boxType == "radio") {
                    this.$el.siblings().removeClass('selected');
                    this.$el.addClass('selected');
                }
            },
            changeSelectStatus: function (e) {
                var $box = $(e.currentTarget);
                var checked = $box.is(':checked') ? 1 : 0;
                this.model.set('checked', checked);
                e.stopPropagation();
            },
            boxWrapperClick: function (e) {
                var $box = $('input', e.currentTarget);
                var checked = $box.is(':checked') ? 0 : 1;
                this.model.set('checked', checked);
                return false;
            },
            rowDoubleClick: function (e) {
                this.trigger('rowDoubleClick', e, this.model.toJSON());
            },
            rowEnter: function (e) {
                this.trigger('rowEnter', e);
            },
            rowLeave: function (e) {
                this.trigger('rowLeave', e);
            }
        });
        var ListItemButton = Backbone.View.extend({
            tagName: 'td',
            // className:'btnStyles',
            initialize: function (button, json) {
                var $el = this.$el.addClass('btnStyles');
                if (button.className) {
                    $el.addClass(button.className);
                }
                if (button.items && button.items.length) {
                    $.each(button.items, $.proxy(function (i, item) {
                        if (item) {
                            var buttonView = new ListItemButtonItem({config: item, data: json});
                            $el.append(buttonView.render().el);
                        }

                    }, this));
                }
                if (button.render) {
                    var $result = $(button.render($el, json));
                    $el.append($result);
                }
            }
        });
        var ContentListItem = Backbone.View.extend({
            tagName: 'tr',
            events: {
                'click    ': 'rowClick',
                'dblclick ': 'rowDoubleClick',
                'mouseenter  td.tooltip': "hover",
                'mouseenter  ': 'rowEnter',
                'mouseleave  ': 'rowLeave'
            },
            initialize: function (options) {
                this.options = options;
            },
            render: function () {
                var json = this.model.toJSON();
                var boxType = this.options.listOptions.field.boxType;
                var $el = this.$el.html('');
                var listOptions = this.options.listOptions;
                var field = listOptions.field;
                var button = field.button;
                var popupLayer = field.popupLayer;
                $.each(field.items, $.proxy(function (i, item) {
                    if (item && !item.locked) {
                        var cellView = new ListItemCellView({config: item, data: json});
                        $el.append(cellView.render().el);
                    }
                }, this));
                if (button && !button.locked) {
                    var listItemButton = new ListItemButton(button, json);
                    $el.append(listItemButton.$el);
                    // var $buttonCell = $('<td class="btnStyles"></td>');
                    // if (button.className){
                    //     $buttonCell.addClass(button.className);
                    // }
                    // if (button.items.length){
                    //     $el.append($buttonCell);
                    //     $.each(button.items,$.proxy(function(i,item){
                    //         var buttonView = new ListItemButtonItem({ config:item,data:json});
                    //         $buttonCell.append(buttonView.render().el);
                    //     },this));
                    // }
                    // if(button.render){
                    //     var $result = $(button.render($buttonCell,json));
                    //     if(!$('.btnStyles',this.el).length){ 
                    //         $el.append($buttonCell);
                    //     }
                    //     $('.btnStyles',this.el).append($result);
                    // }
                }
                if (popupLayer && popupLayer.groups) {
                    var lastText = popupLayer.text || '更多';
                    this.$el.append('<td class="tooltip" scope="col"><a href="javascript:;"><i class="ic ic-detail"></i>' + lastText + '</a></td>');
                }
                // 代替colgroup结构来处理列宽一致问题
                // $('.sn-list-content tr:eq(0) td', this.el).each(function (k, v) {
                //     var iWidth = $('.sn-list-header-wrap th', this.el).eq(k).width();
                //     $(v).width(iWidth);
                //     $('.sn-list-header-wrap th', this.el).eq(k).width(iWidth);
                // });
                return this;
            },
            //hover 为即将废弃的代码，不再维护，请用户使用锁定列功能替换
            hover: function (e) {
                var $Tr = $(e.currentTarget)[0];
                var popupLayer = this.options.listOptions.field.popupLayer;
                var json = this.model.toJSON();
                hdb.registerHelper('deal_item', function (items, options) {
                    var arr = [];
                    for (var i = 0; i < items.length; i++) {
                        var fieldConfig = items[i];
                        if (fieldConfig) {
                            var fieldName = items[i].name;
                            var fieldValue = json[fieldName];
                            if (fieldValue) {
                                var text = fieldConfig.render ? fieldConfig.render(fieldConfig, fieldValue) : fieldValue;
                                arr.push({name: fieldConfig.text, text: text, width: 100 / items.length + '%'})
                            }
                        }

                    }
                    return options.fn(arr);
                });
                var id = "sn-tr-hover";
                if (e.type == "mouseenter") {
                    if (popupLayer && popupLayer.groups.length) {
                        var tempDialog = dialog.get(id);
                        if (tempDialog) {
                            tempDialog.close().remove();
                        }
                        var dialogConfig = {
                            id: id,
                            skin: 'sn-list-popupLayer',
                            align: 'left',
                            content: hdb.compile(listTipsTpl)(popupLayer.groups)
                        }
                        if (popupLayer.width) {
                            _.extend(dialogConfig, {width: popupLayer.width});
                        }
                        if (popupLayer.height) {
                            _.extend(dialogConfig, {height: popupLayer.height});
                        }
                        var d = new dialog(dialogConfig);
                        this.dialog = d;
                        d.show($Tr);
                        $(d.node).on('mouseleave', function () {
                            d.close().remove();
                        });
                    }
                }
            },
            rowClick: function (e) {
                var $src = $(e.currentTarget);
                this.trigger('rowClick', e, this.model.toJSON());
                if (this.options.listOptions.field.boxType == "radio") {
                    this.$el.siblings().removeClass('selected');
                    this.$el.addClass('selected');
                }
            },
            rowDoubleClick: function (e) {
                this.trigger('rowDoubleClick', e, this.model.toJSON());
            },
            rowEnter: function (e) {
                this.trigger('rowEnter', e);
            },
            rowLeave: function (e) {
                this.trigger('rowLeave', e);
            }
        });

        var ListItemButtonItem = Backbone.View.extend({
            tagName: 'a',
            events: {
                'click': 'buttonClick'
            },
            initialize: function (options) {
                this.$el.attr('href', 'javascript:;');
                this.options = options;
                if (this.options.config && this.options.config.name) {
                    this.$el.attr('name', this.options.config.name);
                }
            },
            render: function () {
                this.$el.html(this.options.config && this.options.config.text);
                return this;
            },
            buttonClick: function (e) {
                if (this.options && this.options.config && this.options.config.click) {
                    this.options.config.click.call(this, e, this.options);
                }
            }
        });

        var ListItemCellView = Backbone.View.extend({
            tagName: 'td',
            events: {
                'click': 'cellClick'
            },
            initialize: function (options) {
                this.options = options;
            },
            render: function () {
                var cellVal = this.options.data[this.options.config.name];
                var config = this.options.config;
                if (config) {
                    if (config.render) {
                        cellVal = config.render.call(this, this.options.data, cellVal, this.$el);
                    }
                    if (config.className) {
                        this.$el.addClass(config.className)
                    }
                    if (config.title) {
                        this.$el.attr("title", this.options.data[config.title]);
                    }
                }
                this.$el.html(cellVal);
                return this;
            },
            cellClick: function (e) {
                if (this.options && this.options.config && this.options.config.click) {
                    var cellVal = this.options.data[this.options.config.name];
                    this.options.config.click.call(this, e, cellVal, this.options);
                }
                //this.trigger('click', e,this.options);
            }
        });

        //------------------------------------
        //objClass相关私有方法
        //------------------------------------
        var checkAll = function (e) {
            var $checkAllBox = $(e.currentTarget);
            var checked = $checkAllBox.is(":checked");
            $.each(this.collection.models, function (i, item) {
                item.set('checked', checked);
            });
        }
        var unlockerWidth = function (field) {
            var tableWidth = _.reduce(field.items, function (basic, add) {
                return add && (basic + (!add.locked && (add.width || 100) || 0)) || basic;
            }, 0);
            var button = field.button;
            if (button) {
                tableWidth += button.width || 100;
            }
            return tableWidth;
        }
        var lockerWidth = function (field) {
            var tableWidth = _.reduce(field.items, function (basic, add) {
                return add && (basic + (add.locked && (add.width || 100) || 0)) || basic;
            }, 0);
            if (field.boxType == 'checkbox') {
                tableWidth += 29;
            }
            var button = field.button;
            if (button && button.locked) {
                tableWidth += button.width || 100;
            }
            return tableWidth;
        }
        var buttonValidate = function (button, options) {
            if (button && ((button.items && button.items.length) || button.render)) {
                return options.fn(this);
            } else {
                return options.inverse(this)
            }
        }
        var popupLayerValidate = function (popupLayer, options) {
            if (popupLayer && ((popupLayer.groups && popupLayer.groups.length))) {
                return options.fn(this);
            } else {
                return options.inverse(this)
            }
        }
        var messageValidate = function (message, options) {
            if (message) {
                return options.fn(this);
            } else {
                return options.inverse(this)
            }
        }
        var errorCodeValidate = function (errCode, options) {
            if (errCode != null && errCode != 0) {
                return options.fn(this);
            } else {
                return options.inverse(this)
            }
        }

        var formatUnit = function (value, options) {
            var valueStr = '';
            if (value) {
                valueStr = value.toString();
                var endsWith = function (suffix) {
                    return valueStr.indexOf(suffix, valueStr.length - suffix.length) !== -1;
                }
                if (!endsWith('px') && !endsWith('%')) {
                    valueStr += 'px';
                }
                return new hdb.SafeString(valueStr);
            } else {
                return '99px';
            }

        }

        var helperInit = function () {
            hdb.registerHelper('lockerWidth', lockerWidth);
            hdb.registerHelper('unlockerWidth', unlockerWidth);
            hdb.registerHelper('if_button', buttonValidate);
            hdb.registerHelper('if_message', messageValidate);
            hdb.registerHelper('if_errorCode', errorCodeValidate);
            hdb.registerHelper('formatUnit', formatUnit);
            hdb.registerHelper('if_popupLayer', popupLayerValidate);

            hdb.registerHelper('if_false', function (context, options) {
                if (!context) {
                    return options.fn(this);
                }
                return options.inverse(this);
            });
            hdb.registerHelper('if_object', function (context, options) {
                if (typeof (context) == options.hash.compare)
                    return options.fn(this);
                return options.inverse(this);
            });
            hdb.registerHelper('if_checkbox', function (context, options) {
                if (context == options.hash.compare)
                    return options.fn(this);
                return options.inverse(this);
            });
        }

        var sizeInit = function () {
            var options = this.options,
                $el = this.$el;
            var $list = $('.sn-list', $el);
            var $header = $('.sn-list-header', $el);
            var $headerWrap = $('.sn-list-header-wrap', $el);
            var $content = $('.sn-list-content', $el);
            var $contentLocker = $('.sn-list-content-locker', $el);
            var $footer = $('.sn-list-footer', $el);
            var SCROLL_BAR_HEIGHT = 17;
            var listWidth = $list.width();
            var contentLockerWidth = headerLockerWidth = lockerWidth(this.options.field);
            var contentWidth = unlockerWidth(this.options.field);
            var contentLockerBottom = headerWrapRight = 0;
            var headerWrapWidth = $header.width() - contentLockerWidth;
            $headerWrap.css({'width': headerWrapWidth + 'px'});
            $content.css({'width': headerWrapWidth + 'px'});
            if (headerLockerWidth + contentWidth > listWidth) {
                contentLockerBottom = SCROLL_BAR_HEIGHT;
            }
            if (options.height) {
                setTimeout($.proxy(function () {
                    var content = $content[0];
                    if (content.scrollHeight > content.clientHeight) {
                        headerWrapRight = SCROLL_BAR_HEIGHT;
                    }
                    $headerWrap.css({'width': headerWrapWidth - headerWrapRight + 'px'});
                }, this), 200);
                var rowsAreaHeight = options.height - $header.height() - $footer.height();
                $contentLocker.css({'height': rowsAreaHeight - contentLockerBottom + 'px'});
                $content.css({'height': rowsAreaHeight + 'px'});
            } else {
                $contentLocker.css({'height': 'auto'});
                $content.css({'height': 'auto'});
            }


            // var $headerLocker = $('.sn-list-header-locker', $el);
            // var headerLockerHeight = $headerLocker.height() || 33;
            // $headerWrap.css({ 'left':headerLockerWidth, 'right':SCROLL_BAR_HEIGHT });
            // $contentLocker.css({ 'top':headerLockerHeight, 'bottom':contentLockerBottom });
            // $content.css({ 'top':headerLockerHeight, 'left':contentLockerWidth });
        }

        var positionContentLocker = function (e) {
            var e = e || window.event;
            var $el = this.$el;
            $('.sn-list-header-wrap', $el)[0].scrollLeft = e.currentTarget.scrollLeft;
            $('.sn-list-content-locker', $el)[0].scrollTop = e.currentTarget.scrollTop;
        }

        var eventInit = function () {
            clearTimeout(timer);
            var timer = setTimeout(function () {
                $('.sn-list-content', this.$el).on('scroll', $.proxy(positionContentLocker, this));
            }, 0)
        }
        // 初始化拖拽改变列宽方法
        var resizableInit = function () {
            var that = this;
            $.each($('.sn-list-resizable th', that.$el), function (k, v) {
                $(v).resizable({
                    alsoResize: $('.sn-list-also td', that.$el)[k],
                    handles: 'e'
                });
            });
        }
        var resizeEventInit = function () {
            var that = this;
            var tWidth = $('.sn-list-resizable', that.$el).width();
            $(that.$el).on('resizestart', '.sn-list-resizable th', function (event, ui) {
                tWidth = $('.sn-list-resizable', that.$el).width();
            });
            $(that.$el).on('resize', '.sn-list-resizable th', function (event, ui) {
                var x = ui.size.width - ui.originalSize.width;
                $('.sn-list-resizable', that.$el).width(tWidth + x);
                $('.sn-list-also', that.$el).width(tWidth + x);
            });
        }
        var objClass = Backbone.View.extend({
            version: version,
            events: {
                'click  thead .checkAllWraper>input': checkAll,
                'click .sn-list-footer .btns>.btn': 'btnClick'
            },
            template: hdb.compile(tpl),
            initialize: function (options) {
                if (!options || !options.field || !options.field.items) {
                    var noticeStr = 'please config params for list. as el、field、field.items';
                    console.log(noticeStr);
                    this.$el.text(noticeStr);
                    return this;
                }
                this._flag = 'sn-list-' + Math.random().toString().replace('.', '');

                this.validated = 1;
                this.options = options;
                helperInit.call(this);
                this.$el.html(this.template(options))
                    .find('.sn-list').addClass(this._flag);
                // sizeInit.call(this);
                eventInit.call(this);
                resizeEventInit.call(this);
                var timer = setInterval($.proxy(function () {
                    if ($('.' + this._flag).length > 0) {
                        sizeInit.call(this);
                        clearInterval(timer);
                    }
                }, this), 70);
                $(window).on('resize', $.proxy(function () {
                    if (!this.resized && !!$('.sn-list-header', this.$el).width()) {
                        setTimeout($.proxy(function () {
                            sizeInit.call(this);
                            this.resized = 0;
                        }, this), 70);
                    }
                    this.resized = 1;
                }, this));
            },
            getSelected: function () {
                return this.selectedData;
            },
            getCheckedRows: function () {
                var models = _.filter(this.collection.models, function (item) {
                    return item.toJSON().checked == '1';
                });
                return _.map(models, function (item) {
                    return item.toJSON();
                });
            },
            refresh: function () {
                loading.call(this, this.objPagination.currentPage || 0);
            },
            search: function (searchParam, pageIndex) {
                if (!this.validated) {
                    return;
                }
                this.loaded = 0;
                this.searchParam = searchParam;
                if (searchParam && !searchParam.sorting && this.options.field.items) {
                    for (var i = 0; i < this.options.field.items.length; i++) {
                        if (this.options.field.items[i].sorting && this.options.field.items[i].name) {
                            searchParam.sorting = this.options.field.items[i].sorting;
                            searchParam.sortField = this.options.field.items[i].name;
                            break;
                        }
                    }
                }
                loading.call(this, pageIndex || 0);
                $('.sn-list-header-locker .checkAllWraper>input').removeAttr('checked');
            },
            load: function (beans) {
                loading.call(this, beans);
            },
            btnClick: function (e) {
                var target = e.target || e.currentTarget,
                    items = this.options.page.button.items,
                    i = target.className.slice(13, 14);
                if (items[i].click) {
                    items[i].click(e, items[i]);
                }
            }
        });
        return objClass;
    });