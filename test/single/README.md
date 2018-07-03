## 需配置项
1.由于单入口项目依赖比较多，打包过后的入口js文件过大，为了提高加载速度，所以要对入口js文件进行分割。本项目暂时只把组件分割出去：
- 配置webpack-config目录下的entry.config.js文件，把各个组件配置进入口文件：
```
'components': [
            'tab',
            'list',
            'date',
            .....
      ]
```
- 配置webpack-config/inherit/plugins.config.js文件，增加新的chunks:
```
new webpack.optimize.CommonsChunkPlugin({
    name: 'common',      // 需要注意的是，chunk的name不能相同！！！
    filename: '[name]/bundle.js',
    chunks: ['index'],
    minChunks: 2
  }),
new webpack.optimize.CommonsChunkPlugin({
    name: 'components',
    chunks: ['common'],
    minChunks: 2
  })
```
- 同时增加html里的公共js:
```
new HtmlWebpackPlugin({
    template: 'html!' + path.resolve(process.cwd(), 'test.html'),
    filename: 'index.html',
    inject: 'body',
    chunks: ['common', 'index', 'components']  //新增components
  }),
```

2.路径配置，css、js路径统一采用绝对路径，配置目录在webpack-config/output.config.js里publiPath：
```
module.exports = {
  path: dirVars.buildDir,
  publicPath: '/',    //本项目使用'/'，如果在ngcs中，使用'/ngcs/'
  filename: 'js/[name]/entry.js',
  chunkFilename: 'js/[id].bundle.js'
};
```

3.在webpack-confi/resolve.config.js里面配置模块别名，相当于，requirejs中的requireMain.js配置：
```
alias: {
    //common
    'cookie': path.resolve(dirVars.commonDir, 'cookie.js'),
    'ajax': path.resolve(dirVars.commonDir, 'ajax_amd.js'),
    ....
    }
```

4.gulp主要针对 **html中css** 的引用处理，一般不需要配置，如果新增css的，需要增加配置：
````
gulp.task('concat', function() {
  gulp.src(['src/assets/css/index/*.css',  //增加css目录
            'src/assets/css/*.css',
            'src/assets/css/main/tab.css',
            'src/assets/css/login/login.css'
          ])
          .pipe(urlAdjuster({replace: ['../../img','/img']})) //本项目使用'/img',ngcs中使用'/ngcs/img'
          .pipe(urlAdjuster({replace:['../img', '/img']}))
});

5.chunks
````
//在entry中添加入口
entry: {
    index: './index',
    vendor: ['jquery', 'bootstrap']
},

//在plugins中配置
plugins: [
    new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js"),
]
````

说明 
CommonsChunkPlugin提供两个参数，第一个参数为对应的chunk名（chunk指文件块，对应entry中的属性名），第二个参数为生成的文件名。
这个插件做了两件事：

将vendor配置的模块（jquery,bootstrap）打包到vendor.bundle.js中。
将index中存在的jquery, bootstrap模块从文件中移除。这样index中则只留下纯净的业务代码。
````

## webpack打包和requirejs代码修改项

1.define中引用js,css方式，需要改成相对路径。
````
//修改前
define([
	'Util',  
	'assets/common/routes',
	'text!tpl/index/topMenuLevelTwo.tpl',
	],
//修改后
define([
    'Util',
    '../../assets/common/routes',
    '../../../tpl/index/topMenuLevelTwo.tpl'
])	
````
2.js中图片的引用方式：
````
//修改前
$(".toolSlideBtn", self.$el).eq(selsctBtn).find(".toolImg").attr("src", "src/assets/img/nav/zlt-xljt2-.png");
//修改后
$(".toolSlideBtn", self.$el).eq(selsctBtn).find(".toolImg").attr("src", require("../../assets/img/nav/zlt-xljt2-.png"));
````
3.css书写规范，不符合css规范的书写会报错，css中有乱码等问题的也会报错。

4.tpl中图片路径，全部使用相对路径。

5.动态加载问题。
````
把所有dialog打开的模块单独放在./js/dialog目录下
//修改前
dialog.js:
    require([options.url], $.proxy(function(objClass){
                    ...
     },this));
     
CTIInit.js:
     _index.showDialog({
        title : '技能队列（多选）',   //弹出窗标题
        url : 'js/callHandle/CTIInit/main/chooseSkills',    //要加载的模块
        ...
     });
//修改后
dialog.js:
    var dialog = require.context('../dialog/', true);
    require(['../dialog/' + options.url], $.proxy(function(objClass){
       ...
    },this));
    
CTIInit.js:
    _index.showDialog({
        title : '技能队列（多选）',   //弹出窗标题
        url : 'chooseSkills',    //要加载的模块
        ...
    });    
````
6.this->var
````
//修改前
define(function(Ext2_GX_Data){
	this.ext2Gx = function() {
		this.init();
	};
//修改后
define(function(Ext2_GX_Data){
	var ext2Gx = function() {
		this.init();
	};
````
7.router.js
````
 _require:function(url){
                var _this=this;
                if(url&&(/^(https|http):/.test(url.url))){
                    this._showIframe(url.url,url.param)
                }else{
                    var homeurl = require.context('../../js/workflow', true);
                    require(['../../js/workflow/'+url.url?url.url:_this.option.homeUrl], function (indexModel) {
                        if (indexModel) {
                            _this._requireModel(indexModel, url)
                        } else {
                            _this._requireError(url)
                        }
                    })
                }
            },
````
8. base64.js
````
// that's it!
    if (global['Meteor']) {
        Base64 = global.Base64; // for normal export in Meteor.js
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports.Base64 = global.Base64;
    }
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], function(){ return global.Base64 });
    }
````
## 使用说明
- 全局安装webpack和webpack-dev-server和webpack-bundle-analyzer
```
$ npm install --global webpack@^1.12.15 webpack-dev-server@^1.16.2 webpack-bundle-analyzer@^2.1.1
```

- 本项目使用包管理工具NPM，因此需要先把本项目所依赖的包下载下来：
```
$ npm install
```

- 编译程序，生成的所有代码在`build`目录内。
```
$ npm run build # 生成生产环境的代码。用npm run watch或npm run dev可生成开发环境的代码
```

- 启动服务器，推荐直接使用webpack-dev-server
```
$ npm run start
```

- 理论上来说，webpack-dev-server会自动帮你打开浏览器并展示示例页面；如果没有的话，请手动打开浏览器，在地址栏里输入`http://localhost:8080`，Duang！页面就出来了！

## CLI命令(npm scripts)
| 命令            | 作用&效果          |
| --------------- | ------------- |
| npm run build   | 根据`webpack.config.js`，build出一份生产环境的代码 |
| npm run dev     | 根据`webpack.dev.config.js`，build出一份开发环境的代码 |
| npm run start   | 开启webpack-dev-server并自动打开浏览器，自动监测源码变动并实现LiveReload，**推荐实际开发时使用此项** |
| npm run profile | 显示编译过程中每一项资源的耗时，用来调优的 |
| npm run dll     | 生成Dll文件，每次升级第三方库时都需要重新执行一遍 |
| npm run analyse  | 生成打包文件结构的可视化分析报告；注意请在`npm run build`或`npm run dev`后再执行 |
| npm run analyze | 作用同上 |

## 目录结构说明
```
├─build # 编译后生成的所有代码、资源（图片、字体等）
├─node_modules # 利用npm管理的所有包及其依赖
├─data # 所有模拟的json数据
├─.eslintrc # ESLint的配置文件
├─index.html # 单页面入口
├─login.html # 登陆入口
├─package.json # npm的配置文件
├─webpack-config # 存放分拆后的webpack配置文件
│   ├─base # 主要是存放一些变量
│   ├─inherit # 存放生产环境和开发环境相同的部分，以供继承
│   └─vendor # 存放webpack兼容第三方库所需的配置文件
├─webpack.config.js # 生产环境的webpack配置文件（无实质内容，仅为组织整理）
├─webpack.dev.config.js # 开发环境的webpack配置文件（无实质内容，仅为组织整理）
├─src # 当前项目的源码
    ├─assets # 各个页面使用到的公共资源
    │  ├─common # 公共资源
    │  │  ├─crossAPI # 跨域
    │  │  └─ # 等等   
    │  ├─components # 组件模块
    │  │  ├─buttonGtoup # 按钮组件
    │  │  ├─list # 列表组件
    │  │  └─ # 等等
    │  ├─css # css资源
    │  │  ├─index # index.js依赖的css
    │  │  └─login # login.js依赖的css
    │  ├─img # 图片资源
    │  │  ├─index # index依赖的图片
    │  │  └─login # login依赖的图片
    │  └─lib # 第三方依赖模块
    │     ├─backbone # backbone
    │     ├─jquery # jquery
    │     └─ # 等等
    ├─ js # 单页面的入口文件及其依赖
    │   ├─index # 入口文件
    │   │  ├─index.js # 入口文件
    │   │  ├─dialog.js # index的依赖
    │   │  └─ # 等等
    │   ├─comMenu # index依赖模块
    │   ├─content # index依赖模块
    │   ├─menu # index依赖模块
    │   ├─nav # index依赖模块
    │   └─ # 等等
    └─ tpl # js依赖的tpl
        ├─index # index依赖的tpl
        ├─comMenu # comMenu依赖tpl
        ├─content # content依赖tpl
        ├─menu # menu依赖tpl
        ├─nav # nav依赖tpl
        └─ # 等等
```
