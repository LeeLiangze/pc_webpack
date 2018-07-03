var glob = require('glob');
var path = require('path');
var dirVars = require('./base/dir-vars.config.js');
var jsArr = require('./base/js-entries.config.js');
var pageArr = require('./base/page-entries.config.js');
var configEntry = {};

var pageEntry = (function () {
    var map = {};
    for (var j = 0; j < pageArr.length; j++) {
        var pagePath = pageArr[j];
        var pageRelate = path.normalize(path.relative(dirVars.pagesDir, pagePath)).replace(/\\/g,"/");
        var pagename = path.parse(pageRelate).dir + '/' + path.parse(pageRelate).name;
        map[pagename] = pagePath;
    }
    return map;
});

// console.log(jsArr);
// for (var i = 0; i<jsArr.length; i++) {
//     var filePath = jsArr[i];
//     var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
//     configEntry[filename] = filePath
// }
for (var i = 0; i<jsArr.length; i++) {
    var filePath = jsArr[i];
    // var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
    var relate = path.normalize(path.relative(dirVars.jsDir, filePath)).replace(/\\/g,"/");
    // console.log('relate=',relate);
    var filename = path.parse(relate).dir + '/' + path.parse(relate).name;
    // console.log('filename:',filename);
    if(filename in pageEntry){
    configEntry[filename] = filePath
    }
}
// console.log(configEntry)
// var configEntry = {
      // "./src/modules/mutilPage/example.html",
      // "./src/js/mutilPageDemo/example",
    // "./src/js/singlePageDemo/index.js",
    // "./src/js/example/crossAPItest",
    // "./src/js/example/exampleSingle",
    // "./src/js/example/component/buttonGroup/buttonGroup",
    // "./src/js/example/component/checkboxes/checkboxes",
    // "./src/js/example/component/counter/counter",
    // "./src/js/example/component/date/date",
    // "./src/js/example/component/dialog/dialog",
    // "./src/js/example/component/editor/editor",
    // "./src/js/example/component/groupSearchForm/groupSearchForm",
    // "./src/js/example/component/list/list",
    // "./src/js/example/component/loading/loading",
    // "./src/js/example/component/process/process",
    // "./src/js/example/component/satisfyStar/satisfyStar",
    // "./src/js/example/component/select/select",
    // "./src/js/example/component/selectTree/selectTree",
    // "./src/js/example/component/simpleTree/simpleTree",
    // "./src/js/example/component/tab/tab",
    // "./src/js/example/component/tabTest/tabTest",
    // "./src/js/example/component/timer/timer",
    // "./src/js/example/component/validator/validator",
    // "./src/js/example/component/voice/voice",
    // "./src/js/example/common/ajax",
    // "./src/js/example/common/formAmd"
// };
module.exports = configEntry;
