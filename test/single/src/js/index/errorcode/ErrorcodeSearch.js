/**
 * Created by liubigeng 错误码检索
 */
define([ 'Util' ], function(Util) {

	var ErrorcodeSearch = function(index) {
		return returnObj.call(this);
	};
	function returnObj() {
		var obj = {
			errorcodeSearch : function(errorcode) {
				var errorMsg=null;
				$.ajax({
					   url: "./errorcode.json",//json文件位置
					   type: "POST",
					   dataType: "text", //返回数据格式为json
					   async: false,
					   success: function(data) {//请求成功完成后要执行的方法 
						   data =JSON.parse(data);
						   for (var code in data) {
								if (code == errorcode) {
									errorMsg= data[errorcode];
								}
							}
							
					   },
					   error: function(e){
					   	alert(e);
					   }
					});
				return{"errorMsg" : errorMsg ? "错误信息："+errorMsg : "错误信息：无","errorcode" : "错误码：" + errorcode}; 
			}
		}

		return obj;
	}
	return ErrorcodeSearch;
});
