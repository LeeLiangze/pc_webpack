var path = require('path');
var moduleExports = {};

// 源文件目录
moduleExports.staticRootDir = path.resolve(__dirname, '../../'); // 项目根目录
moduleExports.srcRootDir = path.resolve(moduleExports.staticRootDir, './src'); // 项目业务代码根目录
moduleExports.publicDir = path.resolve(moduleExports.srcRootDir, './assets'); // 存放各个页面使用到的公共资源
moduleExports.pagesDir = path.resolve(moduleExports.srcRootDir, './modules'); // 存放各个页面独有的部分，如入口文件、只有该页面使用到的css、模板文件等
moduleExports.jsDir = path.resolve(moduleExports.srcRootDir, './js'); //存放js
moduleExports.componentsDir = path.resolve(moduleExports.publicDir, './components'); // 存放所有不能用npm管理的第三方库
moduleExports.libDir = path.resolve(moduleExports.publicDir, './lib');  // 与业务逻辑无关的库都可以放到这里
moduleExports.imgDir = path.resolve(moduleExports.publicDir, './img');
moduleExports.commonDir = path.resolve(moduleExports.publicDir, './common'); // 存放各种配置文件
moduleExports.cssDir = path.resolve(moduleExports.publicDir, './css'); // 存放UI布局，组织各个组件拼起来，因应需要可以有不同的布局套路

moduleExports.dllDir = path.resolve(moduleExports.srcRootDir, './dll'); // 存放由各种不常改变的js/css打包而来的dll

// 生成文件目录
moduleExports.buildDir = path.resolve(moduleExports.staticRootDir, './build'); // 存放编译后生成的所有代码、资源（图片、字体等，虽然只是简单的从源目录迁移过来）

module.exports = moduleExports;
