var dirVars = require('../base/dir-vars.config.js');
module.exports = {
  preLoaders: [{
    test: /\.js$/,
    loader: 'eslint-loader',
    include: dirVars.srcRootDir,
    exclude: [/bootstrap/],
  }],

  loaders: [
    // {
    //   test: /\.js$/,
    //   loader: 'es3ify-loader',
    // },
    // {
    //   test: /\.html$/,
    //   include: dirVars.srcRootDir,
    //   loader: 'html-loader',
    // },
    {
      test: /\.tpl$/,
      include:dirVars.srcRootDir,
      loader: 'html-loader',
      query: {
        minimize: false,
        removeComments: true,//清除HTML注释
        processScripts: 'text/x-handlebars-template',
        // collapseWhitespace: true,//压缩HTML
        // removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
      },
    },
    {
      test: /\.json$/,
      loader: 'json-loader'
    },
    {
      // 图片加载器，雷同file-loader，更适合图片，可以将较小的图片转成base64，减少http请求
      // 将小于8192byte的图片转成base64码
      test: /\.(png|jpg|gif)$/,
      include: dirVars.srcRootDir,
      // loader: 'file-loader?name=./img/[name]_[hash].[ext]',
      loader: 'url-loader?limit=8192&name=./img/[name]_[hash].[ext]'
      // query: {
      //   publicPath: '/',
      //   emitFile: true
      // },
    },
    {
      // 专供iconfont方案使用的，后面会带一串时间戳，需要特别匹配到
      test: /\.(woff|woff2|svg|eot|ttf)\??.*$/,
      include: dirVars.srcRootDir,
      loader: 'file-loader?name=./fonts/[name]_[hash].[ext]'
    }
  ]
};
