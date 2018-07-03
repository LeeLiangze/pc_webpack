var ExtractTextPlugin = require('extract-text-webpack-plugin');
var dirVars = require('./base/dir-vars.config.js');

const moduleConfig = require('./inherit/module.config.js');

moduleConfig.loaders.push({
  test: /\.css$/,
  exclude: /node_modules/,
  loader: ExtractTextPlugin.extract('css?minimize'),
});

module.exports = moduleConfig;
