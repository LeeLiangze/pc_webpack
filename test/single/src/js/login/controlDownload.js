
define("login",["jquery","ajax","jquery.selectpick","jquery.placeholder"],function($,ajax){

    var objClass = function(options){
    	obj = this;
    	var options = {
    			el:"#loginForm"
    	};
        this.options = $.extend(options,{});
        this.$el = $(this.options.el);
        this.eventInit();

    };

    objClass.prototype={
        constructor:objClass,
        eventInit:function(){
        	this.downloadEXE();
        },

        downloadEXE:function()
        {
        	if(!confirm("请确认使用IE浏览器同时调整浏览器安全级别，将该站点加入可信任站点并允许使用控件？点击【取消】查看控件下载说明"))
        	{	
        		openInstruction();
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
        	try
          	{
	        	for(var i=0;i<fileNames.length;i++)
	        	{
	        		browseFolder(fileNames[i],haderC);
	        	}
          	}
          	catch(e)
          	{
          		window.confirm("下载URL出错！"+e);
          		openInstruction();
          		return;
          	}
          	alert("下载控件完成，请点击【确定】开始安装控件...");
        	setUp(haderC);
        },

        isHavingOCX:function(){
        	var t;
        	var locator = new ActiveXObject("WbemScripting.SWbemLocator");
        	var service = locator.ConnectServer(".");
        	var properties = service.ExecQuery("SELECT * FROM Win32_Process");
        	var np = new Enumerator (properties);
        	for (;!np.atEnd();np.moveNext())
        	{
        	    t=t + np.item().Name + "\n";
        	}
        	// 比如要判断的进程为calc.exe
        	if(t.indexOf("CINGuard.exe") > -1){
        	    return true;
        	}else{
        		 return false;
        	}
        }
    };

    
    var isNotNull = function(str){
    	var result = true;
    	if(str == "" || str == undefined || str == null || "undefined" == str){
    		result = false;
    	}
    	return result;
    };
    
    var lineNums = ["one","two","three","four","five"];

    function checkTel(audioPhoneNum){
        var isPhone = /^[0-9]+$/;
        if(isPhone.test(audioPhoneNum)){
            return true;
        }
        else{
            return false;
        }
     };
    /***************************** 座席是否有电话座席权限、sip坐席 end add by wWX160457 at 201606161945 for audit business ****************************/
    
    return objClass;
});
  function browseFolder(saveUrl,haderC) {
	  if(!saveUrl)
	  {
		  return;
	  }
	  var serverUrl = getRootPath();
	  var url = serverUrl+"/DownLoad.jsp?saveUrl="+saveUrl;
	  downURL(url,haderC+saveUrl);
	  
  }
  //js获取项目根路径，如： http://localhost:8083/uimcardprj
  function getRootPath(){
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
  }
  //需要設置安全級別及加入信任站點
  function downURL(strRemoteURL , strLocalURL)
  {
  	
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
  	
  }

//控件安装 by wwx303152 start
  function setUp(haderC)
  {
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
 		window.opener=null;
 		window.open('','_self');
 		window.close();
  }
 //控件安装 by wwx303152 end
  //打开下载控件说明页面
  function openInstruction(){
  	window.open("downInstruction.jsp");
  }
require(['login'],function(login){
    var logins=new login({
        el:"#loginForm"
    });
});