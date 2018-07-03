/*
*	@author: fany
*	@date:2016-02-15
*	@desc:组件收敛模块，将组件统一收敛至该文件
*/
define([ 'list', 'selectList', 'tab', 'select', 'selectTree','validator','date'
], function( list, selectList, tab, select,selectTree,validator,date) {

        return {
                // zTree: simpleTree,
                List: list,
                SelectList: selectList,
                Tab: tab,
                Select: select,
                SelectTree: selectTree,
                Validator: validator,
                date:date
        }
});