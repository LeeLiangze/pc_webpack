## 需配置项
由于单入口项目依赖比较多，打包过后的入口js文件过大，为了提高加载速度，所以要对入口js文件进行分割。本项目暂时只把组件分割出去：
- 配置webpack-config目录下的entry.config.js文件，把各个组件配置进入口文件：
```bash
'vender': [
            'tab',
            'list',
            'date',
            'select',
            'editor',
            'validator',
            'selectTree',
            'selectList',
            'voice',
            'counter',
            'timer',
            'loading',
            'satisfyStar',
            'upload',
            'buttonGroup',
            'checkboxes',
            'groupSearchForm',
            'process',
            'detailPanel'
      ]
```
- 配置webpack-config/inherit/plugins.config.js文件，增加新的chunks:
```bash
new webpack.optimize.CommonsChunkPlugin({
    name: 'common',      // 需要注意的是，chunk的name不能相同！！！
    filename: '[name]/bundle.js',
    chunks: ['index'],
    minChunks: 2
  }),
new webpack.optimize.CommonsChunkPlugin({
    name: 'vender',
    chunks: ['common'],
    minChunks: 2
  })
```
- 同时增加html里的公共js:
```bash
new HtmlWebpackPlugin({
    template: 'html!' + path.resolve(process.cwd(), 'test.html'),
    filename: 'index.html',
    inject: 'body',
    chunks: ['common', 'index', 'vender']  //新增vender
  }),
```

## 使用说明
- 全局安装webpack和webpack-dev-server和webpack-bundle-analyzer
```bash
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
