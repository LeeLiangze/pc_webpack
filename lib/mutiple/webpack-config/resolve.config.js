var path = require('path');
var dirVars = require('./base/dir-vars.config.js');
module.exports = {
  // 模块别名的配置，为了使用方便，一般来说所有模块都是要配置一下别名的
  alias: {
    //common
    'cookie': path.resolve(dirVars.commonDir, 'cookie.js'),
    'ajax': path.resolve(dirVars.commonDir, 'ajax_amd.js'),
    'Util': path.resolve(dirVars.commonDir, 'util'),
    'eventTarget': path.resolve(dirVars.commonDir,'eventTarget'),
    'form': path.resolve(dirVars.commonDir, 'form_amd'),
    'keyboardEvent': path.resolve(dirVars.commonDir, 'keyboardEvent_amd'),
    'type': path.resolve(dirVars.commonDir, 'type'),
    'event': path.resolve(dirVars.commonDir, 'event'),

    //jquery plugins
    'jquery.jplayer': path.resolve(dirVars.libDir, 'jqueryPlugin/jPlayer/dist/jplayer/jquery.jplayer'),
    'jquery.placeholder': path.resolve(dirVars.libDir, 'jqueryPlugin/placeholder/jquery.placeholder.min'),
    'jquery.fileuploader': path.resolve(dirVars.libDir, 'jqueryPlugin/jQuery-File-Upload/js/jquery.fileupload'),
    'jquery.ui.widget': path.resolve(dirVars.libDir, 'jqueryPlugin/jQuery-File-Upload/js/vendor/jquery.ui.widget'),
    'jquery.pagination': path.resolve(dirVars.libDir, 'jqueryPlugin/pagination/jquery.pagination'),
    'jqueryUI': path.resolve(dirVars.libDir, 'jqueryui/jquery-ui.min'),

    //libs
    'jquery': path.resolve(dirVars.libDir, 'jqr/jqr'),
    'backbone' : path.resolve(dirVars.libDir, 'backbone/a'),
    'laydate' : path.resolve(dirVars.libDir, 'laydate/laydate'),
    'artDialog' : path.resolve(dirVars.libDir, 'dialog/dialog-plus'),
    'zTree' : path.resolve(dirVars.libDir, 'zTree_v3/js/jquery.ztree.all'),
    'hdb' : path.resolve(dirVars.libDir, 'handlebars/handlebars'),
    'hdbHelper' : path.resolve(dirVars.libDir, 'handlebars/helpers'),
    'underscore' : path.resolve(dirVars.libDir, 'underscore/underscore'),
    'json2' : path.resolve(dirVars.libDir, 'json2/json2'),
    'ueditorConfig' : path.resolve(dirVars.libDir, 'ueditor/ueditor.config'),
    'ueditor' : path.resolve(dirVars.libDir, 'ueditor/ueditor.all'),
    'echarts': path.resolve(dirVars.libDir, 'echarts/echarts-all'),

    //组件
    'simpleTree' : path.resolve(dirVars.componentsDir, 'simpleTree/simpleTree'),
    'tab' : path.resolve(dirVars.componentsDir, 'tab/tab'),
    'list' : path.resolve(dirVars.componentsDir, 'list/list'),
    'date' : path.resolve(dirVars.componentsDir, 'date/date'),
    'select' : path.resolve(dirVars.componentsDir, 'select/select'),
    'editor' : path.resolve(dirVars.componentsDir, 'editor/editor'),
    'validator' : path.resolve(dirVars.componentsDir, 'validator/validator'),
    'selectTree' : path.resolve(dirVars.componentsDir, 'selectTree/selectTree'),
    'selectList' : path.resolve(dirVars.componentsDir, 'selectList/selectList'),
    'voice' : path.resolve(dirVars.componentsDir, 'voice/voice'),
    'video' : path.resolve(dirVars.componentsDir, 'video/video'),
    'counter' : path.resolve(dirVars.componentsDir, 'counter/counter'),
    'selectMultiple' : path.resolve(dirVars.componentsDir, 'selectMultiple/selectMultiple'),
    'timer' : path.resolve(dirVars.componentsDir, 'timer/timer'),
    'loading' : path.resolve(dirVars.componentsDir, 'loading/loading'),
    'satisfyStar' : path.resolve(dirVars.componentsDir, 'groupSearchForm/groupSearchForm'),
    'upload' : path.resolve(dirVars.componentsDir, 'upload/upload'),
    'buttonGroup' : path.resolve(dirVars.componentsDir, 'buttonGroup/buttonGroup'),
    'checkboxes' : path.resolve(dirVars.componentsDir, 'checkboxes/checkboxes'),
    'groupSearchForm' : path.resolve(dirVars.componentsDir, 'groupSearchForm/groupSearchForm'),
    'process' : path.resolve(dirVars.componentsDir, 'process/process'),
    'detailPanel' : path.resolve(dirVars.componentsDir, 'detailPanel/detailPanel'),
    'dialog' : path.resolve(dirVars.componentsDir, 'dialog/dialog'),

    //css
    'ng-common': path.resolve(dirVars.cssDir, 'ng-common/ng-common.css'),
    'ng-components': path.resolve(dirVars.cssDir, 'ng-common/ng-components.css'),
    'ng-layout': path.resolve(dirVars.cssDir, 'ng-common/ng-layout.css'),
    'ng-reset': path.resolve(dirVars.cssDir, 'ng-common/ng-reset.css'),
    'demo': path.resolve(dirVars.cssDir, 'demo.css')
  },

  // 当require的模块找不到时，尝试添加这些后缀后进行寻找
  extentions: ['', 'js'],
};
