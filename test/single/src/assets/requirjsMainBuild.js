require.config({
    // baseUrl: "./",
    map: {
        '*': { 'style': 'lib/requirejs/css.min' }
    },
    paths: {
        /*
        *   避免js文件名和映射名相同，防止打包时被当做js文件重命名
        */

        // 'style' : 'lib/requirejs/css.min',
        'jquery' : 'lib/jquery/jquery',

        'jquery.pagination':'lib/jqueryPlugin/pagination/1.2.1/jquery.pagination',
        // 'blockUI' : 'lib/blockUI/2.64/jquery.blockUI.min',
        'jquery.timePicker':'lib/jqueryPlugin/jonthornton-jquery-timepicker/jquery.timepicker',
        'jquery.jplayer':'lib/jqueryPlugin/jPlayer/dist/jplayer/jquery.jplayer',
        'jquery.tiny':'lib/jqueryPlugin/tiny-pubsub',
        "jquery.placeholder": "lib/jqueryPlugin/placeholder/jquery.placeholder.min",
        "jquery.fileuploader": "lib/jqueryPlugin/jQuery-File-Upload/js/jquery.fileupload",
        "jquery.ui.widget":"lib/jqueryPlugin/jQuery-File-Upload/js/vendor/jquery.ui.widget",
        

        'backbone':'lib/backbone/1.2.1/a',
        'underscore':'lib/underscore/underscore',
        'laydate':'lib/laydate/laydate',
        'text' : 'lib/requirejs/text',
        'hdb' : 'lib/handlebars/handlebars_v4.0.4',
        'hdbHelper' : 'lib/handlebars/helpers',
        'json2' : 'lib/json2/json2',
        'artDialog' : 'lib/dialog/6.0.4/dialog-plus',
        'zTree':'lib/zTree_v3/js/jquery.ztree.all',
        'zTreeSimple':'components/zTree/zTree',
        'selectivizr':'lib/selectivizr-1.0.2/selectivizr',
        'ueditorConfig':'lib/ueditor/ueditor.config',
        'ueditor':'lib/ueditor/ueditor.all',
        'tab':'components/tab/tab',
        'list':'components/list/list',
        'select':'components/select/select',
        'date':'components/date/date',
        'editor':'components/editor/editor',
        'validator':'components/validator/validator',
        'selectList':'components/selectList/selectList',
        'selectTree':'components/selectTree/selectTree',
        'voice':'components/voice/voice',
        'Util' : 'js/global',

        'cookie' : 'common/cookie',
        'eventTarget':"common/eventTarget",
        'dialog' : 'common/dialog_amd',
        'ajax' : 'common/ajax_amd'
    },
    shim:{
        
        'jquery.fileuploader': { deps: ['jquery','jquery.ui.widget'] },
        'jquery.ui.widget': { deps: ['jquery'] },
        'jquery.placeholder': { deps: ['jquery'] },
        'jquery.jplayer': { deps: ['jquery'] },
        'jquery.pagination': { deps: ['jquery'] },
        'jquery.timePicker': { deps: ['jquery'] },
        'jquery.tiny': { deps: ['jquery'] },

        'ueditor': { deps: ['ueditorConfig'] },
        'hdb':{ exports: ['Handlebars'] },
        'hdbHelper': { deps: ['hdb'] },
        'ajax': { deps: ['jquery'] },
        // 'blockUI': { deps: ['jquery'] },
        'busiComm': { deps: ['jquery'] },
        'artDialog': { deps: ['jquery'], exports: 'dialog' },
        'dialog': { deps: ['artDialog'], exports: 'dialog' },
        'zTree' : { deps:['jquery'], exports:'$.fn.zTree' }
    },

    // name: "list",
    // out: "components/list/list.min.js"

    // appDir: "",
    // dir: "../appdirectory-build",
    // optimize:'none',
    // skipDirOptimize:true,
    // modules: [
    //     {
    //         name: "components/list/list"
    //     }
    // ]
});
