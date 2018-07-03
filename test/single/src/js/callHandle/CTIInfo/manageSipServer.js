define([
	'../../../tpl/callHandle/CTIInfo/manageSipServer.tpl',
	'../../../assets/css/callHandle/CTIInfo/manageSipServer.css'
	],   
	
	function(tpl){
		//系统变量-定义该模块的根节点
		var $el;
		var _index;
		var _options;
		var initialize = function(index,options){
		    $el = $(tpl);	
		    _index = index;
	    	_options = options;
	        //业务相关代码	       
	        eventInit();		    			    			    	
	        //将根节点赋值给接口
	        this.content = $el;
	        listInit.call(this);
		};
		
		var eventInit = function(){
			$el.on('click','#saveSipServer', $.proxy(saveSipServer,this));
			$el.on('click','#add_ip_port', $.proxy(add_Sip_Serve,this));
			
		}
		var add_Sip_Serve=function(){
			var dataid = _index.serialNumber.getSerialNumber();
			add_SipServer(dataid);
		}
		
		//新增 IP、port
		var add_SipServer=function(data_id){
			 var sipServerInfo = '<tr class="add_vdn_tr"><td><input type="text" class="sipServerIP" id="sipServerIP'+data_id+'"/></td><td><input type="text" id="sipServerPort'+data_id+'" class="sipServerPort"/></td><td><input type="button" style="border: 2px" class="delSipServer'+data_id+'" value="删除"/></td></tr>';
			 $("#add_sipServer_title",$el).append(sipServerInfo);
			 $el.find('#sipServerIP'+data_id).val("");
			 $el.find('#sipServerPort'+data_id).val("");
			 $('.delSipServer'+data_id,$el).on("click",function(){
				 if(confirm("确定删除吗？")){
				 var objectSiblings=$(this).parent().parent().siblings().length;
				 if(objectSiblings==1){
					 alert("至少保留一条sipServer信息!");
					 return;
				 }else{
					 $(this).parent().parent().remove();
				 }
				 }
			});		 
        }
		
		 //保存sipServer ip、port信息	
		  var saveSipServer=function(){
          var sipserver_ = "";
          var realSipServer="";
          var obj_vdn_ip = $el.find(".sipServerIP");
          var obj_vdn_port = $el.find(".sipServerPort");
          for(var i=0;i<obj_vdn_ip.length;i++){
        	  if(obj_vdn_ip[i].value!=null&&obj_vdn_ip[i].value!=""&&obj_vdn_port[i].value!=null&&obj_vdn_port[i].value!=""){
			   	    if(obj_vdn_ip[i].value.match(/^((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){4}$/)){
			   	    	 if(isNaN(obj_vdn_port[i].value)){
			   	    	 	  alert("请输入一个数字");
			   	    	 	  return; 
			   	    	 	}else if(obj_vdn_port[i].value< 1024 || obj_vdn_port[i].value >65535){
			   	    	 	   		alert("请输入1024到65535之间的端口号");
			   	    	 	   		return;
			   	    	 	   	}			   	    	 					   	    	 		
			   	}else{
			   		   alert("sipServerIp格式不正取，请重新输入");
							return; 
			   		}			   	 
			   	 	    
			   		}else{
			   		alert("IP和端口不能为空，请重新输入");
			   	    	  return;
			   		}             	        
			   		sipserver_ += obj_vdn_ip[i].value+":"+obj_vdn_port[i].value+";";
			   		var ipPort=obj_vdn_ip[i].value+":"+obj_vdn_port[i].value+";";
			   		var otherIpPort=sipserver_.replace(ipPort,"");
			   		if(otherIpPort.indexOf(ipPort)>-1){
			   			alert("不能添加相同的IP和端口！");
			   			return;
			   		}
          }
              realSipServer=sipserver_.substring(0,sipserver_.length-1);
              _options.setSipServer(realSipServer);
			  _index.destroyDialog();			   			
				}			
						
		//销毁弹出框
		var destroyDialog = function(){
			_index.main.destroyDialog();
		}
		
		//重置输入框
		var cancleInfo=function(){
			$el.find("#sipServerIp").val("");
			$el.find("#sipServerPort").val("");
		}
        //初始化弹出框页面
		var listInit=function(){	 
			  var operaSipServer=_options.sipServer;
			  if(operaSipServer!=null&&operaSipServer!=""){
			  	  if(operaSipServer.indexOf(";")>-1){
							var OperaSipServerArr =operaSipServer.split(";");									
							for(i=0;i<=OperaSipServerArr.length-1;i++){
							   var data_id = _index.serialNumber.getSerialNumber();
							   add_SipServer(data_id);
							   $el.find('#sipServerIP'+data_id).val(OperaSipServerArr[i].split(":")[0]);
					           $el.find('#sipServerPort'+data_id).val(OperaSipServerArr[i].split(":")[1]); 
							}
			  	  	}else if(operaSipServer.indexOf(";")==-1){
			  	  		      add_SipServer();
			  	  		      var ip=operaSipServer.split(":")[0];
			  	  		      var port=operaSipServer.split(":")[1];
			  	  		      $el.find('#sipServerIP'+data_id).val(ip);
					          $el.find('#sipServerPort'+data_id).val(port);
			  	  		}else{
			  	  			return;
			  	  			}	  	
			  	}else{
			  		var did = _index.serialNumber.getSerialNumber();
			  		    add_SipServer(did);	
			  		}
			
			}	 
		 		 				
		return initialize;
});