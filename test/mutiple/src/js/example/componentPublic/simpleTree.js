/**
 * Created by wangwei on 2017/2/9.
 * simpleTree 组件示例
 */
define(['simpleTree'], function(SimpleTree) {
    return function(){
    //服务请求类型
    var config1 = {
        callback: {
            onClick: addNode,
            onCollapse: onCollapse
        }
    };
    var config2 = {
        check: {
            enable: true,
            chkDisabledInherit: true
        }
    }
    var config3 = {
        check: {
            enable: true,
            chkStyle: "radio",
            radioType: "level"
        }

    }
    var nodes1 = [{
        id: 1,
        pId: 0,
        name: "父节点1"
    }, {
        id: 2,
        pId: 1,
        name: "父节点2"
    }]
    var nodes2 = [{
        id: 1,
        pId: 0,
        name: "父节点1",
        chkDisabled: true,
        open: true,
        checked: true,
        children: [
            { id: 11, pId: 1, name: "子节点11", halfCheck: true },
            { id: 12, pId: 1, name: "子节点12" }
        ]
    }, {
        id: 2,
        pId: 1,
        name: "父节点2",
        nocheck: true,
        open: true,
        children: [{
                id: 21,
                pId: 2,
                name: "子节点21",
                children: [
                    { id: 211, pId: 21, name: "子节点211" },
                    { id: 212, pId: 21, name: "子节点212" }
                ]
            },
            { id: 22, pId: 2, name: "子节点22" }
        ]
    }];
    var zTree1 = new SimpleTree.tierTree($('#container1'), nodes1, config1);

    function addNode(event, treeId, treeNode) {
        if (treeNode.id == 1) {
            zTree1.removeChildNodes(treeNode)
            zTree1.addNodes(treeNode, nodes1);
        } else if (treeNode.id == 2) {
            zTree1.removeChildNodes(treeNode)
            zTree1.addNodes(treeNode, nodes2);
        }

    }

    function onCollapse(event, treeId, treeNode) {
        zTree1.removeChildNodes(treeNode)
    }
    var zTree2 = new SimpleTree.tierTree($('#container2'), nodes2, config1);
    var zTree3 = new SimpleTree.tierTree($('#container3'), nodes2, config2);
    var zTree3 = new SimpleTree.tierTree($('#container4'), nodes2, config3);
    }
})
