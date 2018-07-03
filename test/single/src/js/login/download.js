define(function(){
	var _options;
	var obj = function(options){
		_options = options;
	};
	$.extend(obj.prototype,{
		//js下载  start 
		browseFolder:function(saveUrl,haderC){
			if(!saveUrl){
				  return;
			  }
			  var serverUrl = this.getRootPath();
			  var url = serverUrl+"/DownLoad.jsp?saveUrl="+saveUrl;
			  this.downURL(url,haderC+saveUrl); 
		},
		//判断
		downPanDuan:function(){
			if(!confirm("请确认使用IE浏览器同时调整浏览器安全级别，将该站点加入可信任站点并允许使用控件？点击【取消】查看控件下载说明")){	
	 			this.openInstruction();
	    		return;
	    	}
	    	alert("请点击【确定】开始下载控件...");
	    	var haderC ="c://";
	    	var fileNames = [
	    	                 "decompressionFile.bat",
	    	                 "FlexitCtrl.rar",
	    	                 "initUnsafeActivex.bat",
	    	                 "OpenEye.exe",
	    	                 "registerIEControl.bat",
	    	                 "Setup.exe",
	    	                 "startOpenEye.bat",
	    	                 "transfer64to32.bat"
	    	                 ];
	    	try{
	        	for(var i=0;i<fileNames.length;i++){
	        		this.browseFolder(fileNames[i],haderC);
	        	}
	      	}
	      	catch(e){
	      		window.confirm("下载URL出错！"+e);
	      		this.openInstruction();
	      		return;
	      	}
	      	alert("下载控件完成，请点击【确定】开始安装控件...");
	    	this.setUp(haderC);
		},
		//js获取项目根路径，如： http://localhost:8083/uimcardprj
		getRootPath:function(){
			 //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
		    var curWwwPath=window.document.location.href;
		    //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
		    var pathName=window.document.location.pathname;
		    var pos=curWwwPath.indexOf(pathName);
		    //获取主机地址，如： http://localhost:8083
		    var localhostPaht=curWwwPath.substring(0,pos);
		    //获取带"/"的项目名，如：/uimcardprj
		    var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
		    return(localhostPaht+projectName);
		},
		//需要設置安全級別及加入信任站點
		downURL:function(strRemoteURL , strLocalURL){
			var xmlHTTP = new ActiveXObject("Microsoft.XMLHTTP");
			xmlHTTP.open("Get",strRemoteURL ,false);
			xmlHTTP.send();
			var adodbStream = new ActiveXObject("ADODB.stream");
			adodbStream.Type = 1;
			adodbStream.Open();
			var bodyData = xmlHTTP.responseBody;
			adodbStream.write(bodyData);
			adodbStream.SaveToFile(strLocalURL,2);
			adodbStream.Close();
			adodbStream = null;
			xmlHTTP = null;	
		},
		//控件安装  start
		setUp:function(haderC){
			var activeObj = new ActiveXObject("WScript.Shell");
			//解压FlexitCtrl.rar文件
			activeObj.Run(haderC+"decompressionFile.bat",0, true);
			var sfso = new ActiveXObject("Scripting.FileSystemObject");
		    var fPath = haderC+"Windows\\SysWOW64";
		    //判读本地目录是否存在，存在将修改64位IE按照32位IE运行
		    if(sfso.FolderExists(fPath)){
		    	 activeObj.Run(haderC+"transfer64to32.bat",0, true);
		    }
		    //注册插件
			activeObj.Run(haderC+"registerIEControl.bat",0, true);
			//安装Setup.exe控件
			if(confirm("确定需要安装Setup.exe控件吗？")){
				activeObj.Run(haderC+"Setup.exe",0, true);
			}	
			//安装openEye客户端
			if(confirm("确定需要安装OpenEye客户端吗？")){
				activeObj.Run(haderC+"startOpenEye.bat",0, true);
			}
			setTimeout(function(){alert("控件安装完成");},3000);
		},
		//控件安装 end
		//打开下载控件说明页面
		openInstruction:function(){
			window.open("downInstruction.jsp");
		}
	})
	
	return obj;
})
