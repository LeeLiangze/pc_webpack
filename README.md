# PC_webpack

## 项目介绍
本项目是一个基于webpack架构的**web app**，其特点如下：
- 适合多页应用和单页面应用。
- 既可实现全后端分离，也可以生成后端渲染所需要的模板。
- 引入lib和component的概念，方便多页面间对布局、组件的重用。
- 编译后的程序不依赖于外部的资源（包括css、font、图片等资源都做了迁移），可以整体放到CDN上。
- 已整合兼容IE8+的方案。
- 不含Js框架（jQuery不算框架）。在原本的项目中，是用RequireJS作为Js框架的。
- 本项目基于 ***webpack v1.12.15*** 和 ***webpack-dev-server v1***，全局和项目局部依赖都一样。

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
