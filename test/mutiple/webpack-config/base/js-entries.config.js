var glob = require('glob');
var path = require('path');

var jsDir = path.resolve(process.cwd(), 'src/js'); // 在js目录里找
var globInstance = glob.sync(jsDir + '/**/*.js');
console.log(globInstance)
module.exports = globInstance;