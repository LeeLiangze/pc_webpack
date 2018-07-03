define([
		'Util',
		'../../tpl/nav/placeTotal.tpl',
		'../../assets/css/nav/placeTotal.css'
	],
	function(Util,placeTotalTpl) {
	var objClasss = function(options,jsonData){
	    var temp = Util.hdb.compile(placeTotalTpl);
	    var $el=temp(jsonData);
		this.content = $el;
	};
	
	
	
	
	return objClasss;
});