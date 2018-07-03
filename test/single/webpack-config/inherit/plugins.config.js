var webpack = require('webpack');
var glob = require('glob');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var es3ifyPlugin = require('es3ify-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');
var dirVars = require('../base/dir-vars.config.js');
var entriesFiles = require('../entry.config.js');
var pageArr = require('../base/page-entries.config.js');

var configPlugins = [
  /* 全局shimming */
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    'window.jQuery': 'jquery',
    'window.$': 'jquery',
    '_': 'underscore'
  }),
  /* 抽取出所有通用的部分 */
  new webpack.optimize.CommonsChunkPlugin({
    name: 'common',      // 需要注意的是，chunk的name不能相同！！！
    filename: 'js/bundle/[name].js',
    chunks: ['index'],
    minChunks: 2
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'components',
    filename: 'js/bundle/[name].js',
    chunks: ['common'],
    minChunks: 2
  }),
  /* 抽取出chunk的css */
  new ExtractTextPlugin('css/[name].css'),
  // new es3ifyPlugin(),
  /* 配置好Dll */
  // new webpack.DllReferencePlugin({
  //   context: dirVars.staticRootDir, // 指定一个路径作为上下文环境，需要与DllPlugin的context参数保持一致，建议统一设置为项目根目录
  //   manifest: require('../../manifest.json'), // 指定manifest.json
  //   name: 'dll',  // 当前Dll的所有内容都会存放在这个参数指定变量名的一个全局变量下，注意与DllPlugin的name参数保持一致
  // }),
  new HtmlWebpackPlugin({
    template: 'html!' + path.resolve(process.cwd(), 'index.html'),
    filename: 'index.html',
    inject: 'body',
    chunks: ['common', 'index', 'components']
  }),
  new HtmlWebpackPlugin({
    template: 'html!' + path.resolve(process.cwd(), 'login.html'),
    filename: 'login.html',
    inject: 'body',
    chunks: ['login']
  }),
  new CopyWebpackPlugin([
    { from: 'data', to: 'data' },
    { from: 'src/assets/img', to: 'img'}
  ])
];
console.log('plugin=',configPlugins);
module.exports = configPlugins;