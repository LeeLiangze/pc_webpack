var require = {
	baseUrl : "./src/",
    map: {
      	'*': { 'style': 'assets/lib/requirejs/css.min' }
    },
	paths : {
		/*
		*	避免js文件名和映射名相同，防止打包时被当做js文件重命名
		*/
		'jquery' : 'assets/lib/jquery/jquery',
        'backbone':'assets/lib/backbone/1.2.1/a',
        'underscore':'assets/lib/underscore/underscore',
		'laydate':'assets/lib/laydate/laydate',
		'laydateSkins':'assets/lib/laydate/skins/default/laydate',
		'text' : 'assets/lib/requirejs/text',
		'hdb' : 'assets/lib/handlebars/handlebars_v4.0.4',
		'hdbHelper' : 'assets/lib/handlebars/helpers',
		'json2' : 'assets/lib/json2/json2',
        
        'artDialog' : 'assets/lib/dialog/6.0.4/dialog-plus',
        'zTree':'assets/lib/zTree_v3/js/jquery.ztree.all',
        'ueditor':'assets/lib/ueditor/ueditor.all',
        'ueditorConfig':'assets/lib/ueditor/ueditor.config',
        
        "jquery.multipleSelect":"assets/lib/jqueryPlugin/multiple-select-master/multiple-select",
        'jquery.jplayer':'assets/lib/jqueryPlugin/jPlayer/dist/jplayer/jquery.jplayer',
        'jquery.tiny':'assets/lib/jqueryPlugin/tiny-pubsub',
        "jquery.placeholder": "assets/lib/jqueryPlugin/placeholder/jquery.placeholder.min",
        "jquery.fileuploader": "assets/lib/jqueryPlugin/jQuery-File-Upload/js/jquery.fileupload",
        "jquery.ui.widget": "assets/lib/jqueryPlugin/jQuery-File-Upload/js/vendor/jquery.ui.widget",
        'jquery.pagination':'assets/lib/jqueryPlugin/pagination/1.2.1/jquery.pagination',
        'jquery.blockUI' : 'assets/lib/jqueryPlugin/blockUI/2.64/jquery.blockUI.min',
        'jquery.timePicker':'assets/lib/jqueryPlugin/jonthornton-jquery-timepicker/jquery.timepicker',
        "jquery.selectpick":"assets/lib/selectpick/js/selectpick",
        "jqueryUI": "assets/lib/jqueryui/jquery-ui.min",
        //common lib begin
        'ajax' : 'assets/common/ajax_amd',
        'eventTarget':'assets/common/eventTarget',
        'form':'assets/common/form_amd',
        'cookie' : 'assets/common/cookie',
        'dialog' : 'assets/common/dialog_amd',
        'pop': 'assets/common/pop_amd',
        'tabs': 'assets/common/tab_amd',
        'svMap' : 'assets/common/svConfig',
        //common lib end

        //components begin
        'simpleTree':'assets/components/simpleTree/simpleTree',
        'tab':'assets/components/tab/tab',
        'list':'assets/components/list/list',
        'select':'assets/components/select/select',
        'date':'assets/components/date/date',
		'editor':'assets/components/editor/editor',
		'validator':'assets/components/validator/validator',
        'selectList':'assets/components/selectList/selectList',
		'selectTree':'assets/components/selectTree/selectTree',
        'voice':'assets/components/voice/voice',
        //components end

        'Util' : 'assets/common/util',
        'Compts' : 'assets/common/components',
        'jquery.xdomainrequest':'assets/lib/jquery/jquery.xdomainrequest.min',//测试
        //配置项
        'event':'assets/common/event' 

	},
	waitSeconds:0,
	shim:{
        'js/index/index': { deps: ['jquery'] },
        
        'jquery.xdomainrequest': { deps: ['jquery'] },//测试
        
        'jquery.ui.widget': { deps: ['jquery'] },
        'jquery.fileuploader': { deps: ['jquery','jquery.ui.widget'] },
        'jquery.placeholder': { deps: ['jquery'] },
        'jquery.jplayer': { deps: ['jquery'] },
        'jquery.tiny': { deps: ['jquery'] },
        'jquery.pagination': { deps: ['jquery'] },
        'jquery.blockUI': { deps: ['jquery'] },
        'jquery.timePicker': { deps: ['jquery','style!assets/lib/jqueryPlugin/jonthornton-jquery-timepicker/jquery.timepicker.css'] },
        'jquery.selectpick': { deps: ['jquery','style!assets/lib/selectpick/css/selectpick.css'] },
        'ueditor': { deps: ['ueditorConfig'] },
        'hdb':{ exports: ['Handlebars'] },
        'artDialog': { deps: ['jquery'] },
        'zTree' : { deps:['jquery'], exports:'$.fn.zTree' },
        'jqueryUI': { deps: ['jquery'] },
        'dialog': { deps: ['artDialog'], exports: 'dialog' }
	}
    ,urlArgs: function(id, url) {
    	if (url.match("\.tpl$")||url.match("\.js$")||url.match("\.css$")) {
            return '?v='+(window.Args?Args:Math.random());
        }
        return '';
    }
}