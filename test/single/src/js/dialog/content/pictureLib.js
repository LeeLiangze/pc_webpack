/*图片库发送图片*/
define(['Util',
    'Compts',
    '../../index/constants/mediaConstants',
    '../../../tpl/content/editArea/pictureLib.tpl',
    '../../../assets/css/content/editArea/pictureLib.css'
], function(Util, Compts, Constants, tpl) {
    var $el = $(tpl);
    var indexModule;
    var orgaId;
    var picTree;
    var list;

    var pictureList = [];
    var _options = null;

    var initialize = function(index, options) {
        _options = options;
        indexModule = index;
        //初始化分类树
        initPicTree.call(this);
        listInit.call(this);
        initEvent.call(this);
        // 将根节点赋值给接口
        this.content = $el;
    };

    //按钮触发事件
    var initEvent = function() {
        $el.on('click', '.btnPicSearchLab', $.proxy(search, this));
        $el.on('click', '.btnPicSendLab', $.proxy(btnPicSend, this));

    }

    //发送图片
    var btnPicSend = function() {
        if ($el.find("#mediaPictureLab ul li img").hasClass("img-selected-border")) {
            var url = $el.find("#mediaPictureLab ul li .img-selected-border").attr("src");
            indexModule.destroyDialog();
            _options.val(url);
            _options.change();
        } else {
            indexModule.popAlert("请选择要发送的图片！");
        }
    }

    //添加图片
    var addPicture = function() {

        var picInput = $el.find("#picInput");
        picInput.click();
    }

    var ajaxPicUpload = function(files) {

        if (files.length) {
            var file = files[0];
            var reader = new FileReader();
            reader.onload = function() {
                document.getElementById("filecontent").innerHTML = this.result;
            };
            reader.readAsText(file);
        }

    }


    //查询图片
    var search = function() {
        // 清空数组
        pictureList = [];

        var nodes = picTree.getSelectedNodes();
        if (nodes == null || nodes.length == 0 /*|| nodes[0].name == "图片库" */ ) {
            indexModule.popAlert("请先选择图片分类！");
            return;
        }

        //获取查询条件
        var picname = $el.find('#picNameLab').val();

        var params = {
            superCode: nodes[0].value,
            picName: picname,
            typeId: "01"
        };
        list.search(params);
    }




    //树节点事件
    function zTreeOnDblClick(event, treeId, treeNode) {

        search();
    }

    //初始化图片分类树
    var initPicTree = function() {
        Util.ajax.postJson("front/sh/common!execute?uid=pic001&_=" + Math.random(13), {}, function(json, status) {
            if (status) {
                var LeftTree = new Compts.zTree.tierTree($("#picTreeLab", $el), json.beans, zTreeOnDblClick);
                // picTree = $.fn.zTree.getZTreeObj("picTreeLab");
                picTree = LeftTree;
                //picTree.expandNode(picTree.getNodeByParam("id", "000000", null), true, false, false, false);
                picTree.expandAll(true);
                picTree.selectNode(picTree.getNodeByParam("id", "000000", null));
            } else {}
        })
    };

    var pictureClick = function() {
        $el.find("#mediaPictureLab ul li").click(function(e) {
            $(this).siblings().find("img").removeClass("img-selected-border");
            $(this).find("img").addClass("img-selected-border");
        });
    };

    var showPitcture = function(flag) {
    	$("#pictureDetailLab .sn-list .sn-list-table").css("display","none");
    	$("#pictureDetailLab .sn-list .sn-list-footer").css("display","none");
        var str = "";

        if (null != pictureList && 0 != pictureList.length) {
            for (i in pictureList) {
                var temp = pictureList[i].picUrl.split(".");
                var part1 = temp[0];
                var part2 = temp[1];
                var path = part1 + '_min.' + part2;
                str += "<li ><img class='' style='height: 100%;' src='" +path + "' title='" + pictureList[i].picName + "' ></li>";
            }
        }
        $("#mediaPictureLab ul", $el).html(str);
        pictureClick();
        // 清空数组
        pictureList = [];
    };

    //初始化图片信息list
    var listInit = function() {
        // 清空数组
        pictureList = [];

        var config = {
            el: $('#pictureDetailLab', $el),
            field: {
                boxType: 'checkbox',
                key: 'typeId',
                popupItems: [
                    { text: '缩略图', name: 'picUrl', className: 'w70' },
                ],
                items: [

                    {
                        text: '缩略图',
                        name: 'picUrl',
                        className: 'picUrl',
                        click: function(e, item) {
                            var params = {
                                title: item.data.picName,
                                //url : 'js/common/pictureMg/DisplayPicture',
                                url: 'content/displayPicture',
                                param: {
                                    picurl:item.data.picUrl
                                },
                                width: 800,
                                height: 600
                            }

                            var result = indexModule.showDialog(params);

                        },
                        render: function(item, val) {
                            pictureList.push(item);

                            return '<img src=' + val + ' id="imgUrl"></img>';
                            //return '<a class="aPicurl" name="aPicurl" href=' + val + '"><img src=' + val + '/></a>';

                        }
                    },
                    { text: '图片ID', name: 'picId', className: 'picId' },
                    { text: '图片名', name: 'picName', className: 'picName' },
                    { text: '图片Code', name: 'code', className: 'code' }
                ],
            },
            page: {
                perPage: 9,
                align: 'right'
            },
            data: {
                url: 'front/sh/common!execute?uid=pic004'
            }
        }
        this.list = new Compts.List(config);
        //图片库下所有的目录和文件
        this.list.search({ typeId: "01", superCode: "000000" });
        list = this.list;

        list.on("success", function(result) {
            //隐藏列表
            $("#pictureDetailLab thead", $el).hide();
            $("#pictureDetailLab tbody", $el).hide();
            showPitcture(true);
        })
    };
    return initialize;
});
