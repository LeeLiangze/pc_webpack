var glob = require('glob');
var path = require('path');

var configEntry = {
      'index': './src/js/index/index',
      'login': './src/js/login/login',
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
};
module.exports = configEntry;
