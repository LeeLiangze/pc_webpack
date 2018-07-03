var glob = require('glob');
var path = require('path');

var pageDir = path.resolve(process.cwd(), 'src/modules'); // 在js目录里找
var globInstance = glob.sync(pageDir + '/**/*.html');
// console.log('globInstance=',globInstance);
module.exports = globInstance;