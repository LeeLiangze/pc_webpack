/**
 * add by wwx160457 at 201607111417
 * for post ccacs/ccbms/ccbcs request.
 * update by zzy 2017/1/16
 */
define(['../../../index/constants/mediaConstants','Util'],function(MediaConstants,Util){
	var _index;
	var IP;
	var PORT;
	var CTIID;
	var isDefault;
	var proxyIP;
    var proxyPort;
	
	var TIME_OUT = 20000;// 外界可传递的。
	var CCACS_BASE_PATH;
	var CCBMS_BASE_PATH;
	var CCBCS_BASE_PATH;
	
    var RequestCTI = function(index){
    	_index = index;
    	IP = _index.CTIInfo.IP;
    	PORT =  _index.CTIInfo.port;
    	CTIID =  _index.CTIInfo.CTIId;
    	isDefault=_index.CTIInfo.isDefault;//缺省业务标志值
		proxyIP=_index.CTIInfo.ProxyIP;//代理IP
        proxyPort =_index.CTIInfo.ProxyPort;//代理端口
        
        if (isDefault=='1') {
        	CCACS_BASE_PATH = MediaConstants.CCACSURL+proxyIP+':'+proxyPort+'/ccacs/'+CTIID+"/";
        	CCBMS_BASE_PATH = MediaConstants.CCACSURL+proxyIP+':'+proxyPort+'/ccbms/'+CTIID+"/";
        	CCBCS_BASE_PATH = MediaConstants.CCACSURL+proxyIP+':'+proxyPort+'/ccbcs/'+CTIID+"/";
		}else {
			CCACS_BASE_PATH = MediaConstants.CCACSURL+IP+':'+PORT+'/ccacs/';
	    	CCBMS_BASE_PATH = MediaConstants.CCACSURL+IP+':'+PORT+'/ccbms/';
	    	CCBCS_BASE_PATH = MediaConstants.CCACSURL+IP+':'+PORT+'/ccbcs/';
		}
    	return {
    		postCTIRequest: function(params){
    			var projectName = params.projectName;
    			//data增加流水号
    			if(undefined == params.needSerialNumber){
    				$.extend(params.requestData,{
        				opserialNo:_index.serialNumber.getSerialNumber()
        			})
    			};
    			if(undefined == projectName || "ccacs" == projectName){
    				BASE_PATH = CCACS_BASE_PATH;
    			}else if("ccbcs" == projectName){
    				BASE_PATH = CCBCS_BASE_PATH;
    			}else if("ccbms" == projectName){
    				BASE_PATH = CCBMS_BASE_PATH;
    			};
    			var config;
    			if(_index.queue.browserName==="IE"){
    				config = $.extend({
        				url:BASE_PATH + params.uri,
        				timeout:TIME_OUT,
        				data:JSON.stringify(params.requestData),
        				dataType:"json",
        				type : 'post',
        				async:true,// 异步
        				crossDomain: true,
//        	            xhrFields: {
//        	                  withCredentials: true
//        	                   },
        				contentType:"application/json; charset=utf-8",
        				success:function(data){
        					params.successCallBack(data);
        				},
        				error:function(jqXHR,textStatus,errorThrown){
        					params.errorCallBack(jqXHR,textStatus,errorThrown);
        				}
        				},params);
    			}else{
    				config = $.extend({
        				url:BASE_PATH + params.uri,
        				timeout:TIME_OUT,
        				data:JSON.stringify(params.requestData),
        				dataType:"json",
        				type : 'post',
        				async:true,// 异步
        				crossDomain: true,
        	            xhrFields: {
        	                  withCredentials: true
        	                   },
        				contentType:"application/json; charset=utf-8",
        				success:function(data){
        					params.successCallBack(data);
        				},
        				error:function(jqXHR,textStatus,errorThrown){
        					params.errorCallBack(jqXHR,textStatus,errorThrown);
        				}
        				},params);
    			}
    			   		
    			var result = $.ajax(config);
    			return result;
    		}
    	}
    };
    
    return RequestCTI;
});