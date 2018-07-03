/*
*	@author:fanyu
*	@desc:page loading
*	@date：2015-09-20
*/
define(['../../../tpl/index/loading.tpl', '../../css/index/index.css'], function(source) {
        var $el = $(source);
        var fun = function(){
        	$('body').append($el);
        }
        var elDestroy = function(){
        	$el.remove();
        }
        return { init:fun, destroy:elDestroy };
    }
);
