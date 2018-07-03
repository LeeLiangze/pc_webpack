/**
 *技能队列
 */
define(['Util',
        'Compts',
        '../../index/constants/mediaConstants',
        '../../../tpl/content/editArea/skillQueue.tpl',
        '../../../assets/css/content/editArea/skillQueue.css'],
        function(Util,Compts,MediaConstants,skillQueue){

    //系统变量-定义该模块的根节点
    var _index = null;
    var $el;
    var _option = null;
    var skillCityList;
    var ccid;
    var vdnid;
    var ctiid;
    var ip;
    var port;
    var ctiMediaTypeId;
    var proviceName;
    var cityName;
    var lastNo;
    
    var initialize = function(indexModule,options){

    	$el = $(skillQueue);
        _index = indexModule;
        _option = options;
        ctiid = _index.CTIInfo.CTIId;
        ccid = _index.CTIInfo.CCID;
        vdnid = _index.CTIInfo.VDN_ID;
        ip = _index.CTIInfo.IP;
        port = _index.CTIInfo.port;
        //列表
        this.listInit.call(this);
        //初始化点击事件
        this.eventInit.call(this);
        //初始化下拉列表
        this.initForm();
		this.content = $el;
    };
   
    $.extend(initialize.prototype, {
        eventInit:function(){
            $el.on('click','#cancelBtn_skillQue', $.proxy(this.cancelBtn,this));
            
            //内部求助
            $el.on('click','#transferBtn_skillHelp', $.proxy(this.interHelp,this));

            $("#transferBtn_skillQuewys",$el).unbind();
            //转接功能处理事件
            $("#transferBtn_skillQuewys",$el).bind("click", $.proxy(this.transferBtn,this));
            
        },
        listInit:function(){
            var serialNo=_index.CallingInfoMap.getActiveSerialNo();
            var callingInfo = _index.CallingInfoMap.get(serialNo);
            var mediaType = callingInfo ? callingInfo.getMediaType() : "";
            var mediaTypeIds={
                    "mediaTypeId":mediaType
                }
            var mediaUrl="front/sh/media!execute?uid=mes003";
            if (mediaType) {
	            $.ajax({
	                   type: "POST",
	                   url: mediaUrl,
	                   data: mediaTypeIds,
	                   async: false,
	                   success: function(resultJson){
	                      ctiMediaTypeId=resultJson.bean.ctiMediaTypeId;
	                   },
		           		error : function( XMLHttpRequest, textStatus, errorThrown) {
		                    var errorParams = {
		                            "XMLHttpRequest":XMLHttpRequest,
		                            "textStatus":textStatus,
		                            "errorThrown":errorThrown
		                    };
		                }
	            });
            }
            ctiMediaTypeId = ctiMediaTypeId ? ctiMediaTypeId : "";
            var config = {
                el:$('#skillList_skillQue',$el),
                field:{
                    key:'id',
                    boxType:'radio',
                    items:[
                        { text:'编号',name:'NO'},
                        { text:'技能队列名称',name:'name'},
                        { text:'技能队列描述',name:'skillDesc'}, 
                        { text: '等待数',name: 'waitingNum'}
                    ]
                },
                data:{
                    url:'front/sh/media!execute?uid=transfer002'
                } 
            }
            skillCityList = new Compts.List(config);
            type="all";
            var param= this.conditionFilter(type);
            skillCityList.search(param);
            skillCityList.on('rowClick',function(e,item){
            	if(lastNo != "" && lastNo != undefined && lastNo != null) {
                	$el.find("#skillList_skillQue").find("tr").eq(lastNo).find("td").eq(3).html("");
                }
                var skillIds = {
                    "ccId": ccid,
                    "vdnId": vdnid,
                    "skillId": skillCityList.getSelected().value
                };
                var skillArr = new Array();
                skillArr.push(skillIds);
                
                var isDefault = _index.CTIInfo.isDefault; // 缺省业务标志值
                var proxyIp = _index.CTIInfo.ProxyIP; // 代理ip
                var proxyPort = _index.CTIInfo.ProxyPort; // 代理端口
                var directIp = _index.CTIInfo.IP; // 直连ip
                var directPort = _index.CTIInfo.port; // 直连端口
                if (isDefault == "1") { // 此种情况走nginx代理
                    var ipData = proxyIp;
                    var portData = proxyPort;
                } else {
                    var ipData = directIp;
                    var portData = directPort;
                }
                var rowData = {
                    "ip": ipData,
                    "port": portData,
                    "ctiId": ctiid,
                    "skillIds": JSON.stringify(skillArr),
                    "isDefault": isDefault
                };
                Util.ajax.postJson("front/sh/transfer!execute?uid=transfer005",rowData, function (resultData, state) {
                    if (state) {
                        var queueSize = 0;
                        if (resultData.beans[0] && !isNaN(resultData.beans[0].queueSize)) {
                            queueSize = resultData.beans[0].queueSize;
                        }
                        
                        var data = skillCityList.getSelected();
                        $el.find("#skillList_skillQue").find("tr").eq(data.NO).find("td").eq(3).html(queueSize);
                        lastNo = data.NO;
                    }
                });
            });
        },
        cancelBtn:function(){
            $(".ui-dialog-close").trigger("click");
        },
        initForm:function(){
            var configPro = {
                el : $('#provinceId_skillQues', $el), // 要绑定的容器
                label : '省份地市', // 下拉框单元左侧label文本
                name : 'provicename', // 下拉框单元右侧下拉框名称
                url : 'front/sh/media!execute?uid=transfer001', // 数据源
                value:''
            }
            proviceName = new Compts.Select(configPro);
            cityName = null;
            proviceName.on("change",$.proxy(function(e,valueObj){
            	lastNo = "";
                var param=this.conditionFilter("province");
                skillCityList.search(param);
                if(valueObj.name == "请选择") {
                    this.cityLink(true, "");
                }else {
                    this.cityLink(false, valueObj.value);
                }
            },this));
            this.cityLink(true, "");
        },
        conditionFilter:function(type){
            var params;
            if(type=="all"){//查询全部
                params = {
                        "ccid":ccid,
                        "vdnid":vdnid,
                        "mediaType":ctiMediaTypeId,
                        "ctiid":ctiid
                }
            }else if(type=="province"){//按照省份查询
                params = {
                        "proviceid":proviceName.getSelected().value,
                        "ccid":ccid,
                        "vdnid":vdnid,
                        "mediaType":ctiMediaTypeId,
                        "ctiid":ctiid
                }
            }else if(type=="city"){//按照省市查询
                params = {
                        "proviceid":proviceName.getSelected().value,
                        "cityid":cityName.getSelected().value,
                        "mediaType":ctiMediaTypeId,
                        "ccid":ccid,
                        "vdnid":vdnid,
                        "ctiid":ctiid
                }
            }
            return params;
        },
        cityLink:function(isDisabled, proviceId){
            $("#cityId_skillQues").html("");

            var configCity = {
                el : $('#cityId_skillQues', $el), // 要绑定的容器
                label : '', // 下拉框单元左侧label文本
                name : 'name', // 下拉框单元右侧下拉框名称
                disabled:isDisabled,
                url : 'front/sh/common!execute?uid=skill002&proviceid=' + proviceId, // 数据源
                //url : url,// 数据源
                value:''

            }
            cityName = new Compts.Select(configCity);
            cityName.on("change",$.proxy(function(e,valueObj){
            	lastNo = "";
                var param=this.conditionFilter("city");
                skillCityList.search(param);
            },this));
        },
        //转接功能
        transferBtn:function(event){
            //防止冒泡事件
             event.stopPropagation();
             
             //技能id（skillId）
             var rowsValue = "";
             var params=skillCityList.getSelected();
             if(params==''||params==undefined){
                 _index.popAlert("请先选择一个技能队列" );
                 return;
             }else{
                 rowsValue = skillCityList.getSelected().value;
             }
             
             $("#transferBtn_skillQuewys").attr({"disabled":"disabled"});
             $("#transferBtn_skillQuewys").removeClass("btn-blue");
             $("#transferBtn_skillQuewys").addClass("btn_skillQue");
            //设置呼叫数据接口返回结果
            this.setcalldata();
            if(setcalldatas=="0"){
                this.transout();
                //设置转接日志数据
                    var currentTime = _index.utilJS.getCurrentTime();
                    var params=skillCityList.getSelected();
                    var inner='';
                    if(params!=undefined){
                        inner=skillCityList.getSelected().value;
                    }
                    var staffID =  _index.getUserInfo()['staffId'];
                    var mode=$('#transferId_skillQue input[name="transfer"]:checked ').val();
                    var msg=$.trim($el.find("#notesId_skillQues").val());
                   //将转接数据放入callInfo
                    var serialNo=_index.CallingInfoMap.getActiveSerialNo();
                    _callingInfo=_index.CallingInfoMap.get(serialNo);
                    if(_callingInfo!=null){
                        _callingInfo.setTransferTime(currentTime);
                        _callingInfo.setTransferType("1");
                        _callingInfo.setTransferInner(inner);
                        _callingInfo.setTransferMode(mode);
                        _callingInfo.setTransferOuter(staffID);
                        _callingInfo.setTransferMsg(msg);
                        _index.CallingInfoMap.put(serialNo,_callingInfo);
                    }
                    switch(transouts){
                        case "0":
                             _index.popAlert("转出操作成功" );
                            _index.destroyDialog();
                            break;
                        case "20139":
                            this.buttonStyleChange();
                           _index.popAlert("该技能下没有坐席签入，请重新选择");
                            break;
                        case "20512":
                            this.buttonStyleChange();
                             _index.popAlert("该技能下坐席忙");
                            this.tranoutLog(_callingInfo);
                            break;
                        case "150003":
                            this.buttonStyleChange();
                            _index.popAlert("请确认是否勾选技能");
                            this.tranoutLog(_callingInfo);
                            break;
                        case "20509":
                            this.buttonStyleChange();
                            _index.popAlert("没有坐席签入该技能");
                            this.tranoutLog(_callingInfo);
                            break;
                        default:
                            this.buttonStyleChange();
                            _index.popAlert("转出操作失败，错误码："+transouts);
                            this.tranoutLog(_callingInfo);
                    }
            }else{
                _index.popAlert("客户已挂机，不允许转接！");
                _index.destroyDialog();
            }
        },
        //CTI接口setcalldata(设置呼叫数据)
        setcalldata:function (){
            var staffId = _index.getUserInfo().staffId;
            var staffName =  _index.getUserInfo()['staffName'];
            var serialNo=_index.CallingInfoMap.getActiveSerialNo();
            var callingInfo = _index.CallingInfoMap.get(serialNo);
            if(serialNo == undefined || callingInfo == undefined || callingInfo==null){
                return;
            }
            var contactId = callingInfo.getContactId();
            var time = callingInfo.getCallIdTime();
            var dsn = callingInfo.getCallIdDsn();
            var handle = callingInfo.getCallIdHandle();
            var server = callingInfo.getCallIdServer();
            var callId = {"time":time,"dsn":dsn,"handle":handle,"server":server};
            var mediaId = callingInfo.getMediaType();
            var channelId = callingInfo.getChannelID();
            var isDefault=_index.CTIInfo.isDefault;//缺省业务标志值
    		var proxyIP=_index.CTIInfo.ProxyIP;//代理IP
            var proxyPort =_index.CTIInfo.ProxyPort;//代理端口
            
            var url = '';
            if(isDefault=="1"){//此种情况走nginx代理
            	url=MediaConstants.CCACSURL+proxyIP+":"+proxyPort+"/ccacs/"+ctiid+"/ws/call/setcalldata";
             }else{                                 
            	url= MediaConstants.CCACSURL+ip+":"+port+"/ccacs/ws/call/setcalldata"; //跨域直连
             }
            var options = _index.serialNumber.getSerialNumber();
            
            var transferMsg=$.trim($el.find("#notesId_skillQues").val());
            var callData={
            		"contactId" : contactId,
                    "serialNo": serialNo,
                    "transferMsg": transferMsg,
                    "staffId":staffId,
                    "mediaId":mediaId,
                    "channelId":channelId,
                    "staffName":staffName,
                    "transflag":true
                    };
                    
             //拼装接口setcalldata（设置呼叫数据）数据
            var data={
                    "callId":callId,
                    "callData":callData,
                    "opserialNo":options
             }
            if(_index.queue.browserName==="IE"){  //注意index的
				//IE逻辑
                $.ajax({
                    type: "POST",
                    contentType:"application/json; charset=utf-8",
                    url: url,
                    data: JSON.stringify(data),
     		  		crossDomain: true,
//     		        xhrFields: {
//     	              withCredentials: true
//     	            },
                    async: false,
                    success: function(resultJson){
                        setcalldatas=resultJson.result;
                    }
                 });
			}else{
				//其他浏览器逻辑
	             $.ajax({
	                 type: "POST",
	                 contentType:"application/json; charset=utf-8",
	                 url: url,
	                 data: JSON.stringify(data),
	  		  		crossDomain: true,
	  		        xhrFields: {
	  	              withCredentials: true
	  	            },
	                 async: false,
	                 success: function(resultJson){
	                     setcalldatas=resultJson.result;
	                 },
	                 error : function( XMLHttpRequest, textStatus, errorThrown) {
                         var errorParams = {
                                 "XMLHttpRequest":XMLHttpRequest,
                                 "textStatus":textStatus,
                                 "errorThrown":errorThrown
                         };
                     }
	              });
			}

            return setcalldatas;
        },
        //调用CTI接口transout(转出)
        transout:function(){

            var serialNo=_index.CallingInfoMap.getActiveSerialNo();
             var callingInfo = _index.CallingInfoMap.get(serialNo);
             if(serialNo == undefined || callingInfo == undefined){
                 return;
             }
             var time = callingInfo.getCallIdTime();
             var dsn = callingInfo.getCallIdDsn();
             var handle = callingInfo.getCallIdHandle();
             var server = callingInfo.getCallIdServer();
             var callId = {"time":time,"dsn":dsn,"handle":handle,"server":server};
             var isDefault=_index.CTIInfo.isDefault;//缺省业务标志值
     		 var proxyIP=_index.CTIInfo.ProxyIP;//代理IP
             var proxyPort =_index.CTIInfo.ProxyPort;//代理端口
             
             var url = '';
             if(isDefault=="1"){//此种情况走nginx代理
             	url=MediaConstants.CCACSURL+proxyIP+":"+proxyPort+"/ccacs/"+ctiid+"/ws/call/transout";
              }else{                                 
             	url= MediaConstants.CCACSURL+ip+":"+port+"/ccacs/ws/call/transout"; //跨域直连
              }
             var options = _index.serialNumber.getSerialNumber();
             //转出的设备类型--技能队列
             var calledDeviceType=MediaConstants.CALLEDDEVICETYPE_SKILL_QUEUE;
             //转出时的模式  0：释放转、2：成功转；
             var transferMode=$('#transferId_skillQue input[name="transfer"]:checked ').val();
             //设置挂机方为坐席 start
             if(transferMode == "0"){
            	_callingInfo.setReleaseType(MediaConstants.RELEASETYPE_OPERATOR); 
             }
             //设置挂机方为坐席 end
             //技能队列ID
             var calledDigits='';
             var params=skillCityList.getSelected();
             if(params==''||params==undefined){
                 calledDigits='';
             }else{
                 calledDigits=skillCityList.getSelected().value;
             }
             var data={
                 "callId":callId,
                 "calledDeviceType":calledDeviceType,
                 "transferMode":transferMode,
                 "calledDigits":calledDigits,
                 "callerDigits":"",
                 "origedDigits":"",
                 "attachedData":"",
                 "opserialNo":options
             }
             
             if(_index.queue.browserName==="IE"){  //注意index的
 				//IE逻辑
                 $.ajax({
                     type: "POST",
                     contentType:"application/json; charset=utf-8",
                     url: url,
                     data: JSON.stringify(data),
                     crossDomain: true,
//         	        	xhrFields: {
//         	              withCredentials: true
//         	               }, 
                     async: false,
                     success: function(resultJson){
                          transouts=resultJson.result;
                     },
                     error : function( XMLHttpRequest, textStatus, errorThrown) {
                         var errorParams = {
                                 "XMLHttpRequest":XMLHttpRequest,
                                 "textStatus":textStatus,
                                 "errorThrown":errorThrown
                         };
                     }
              });
 			}else{
 				//其他浏览器逻辑
 	             $.ajax({
 	                   type: "POST",
 	                   contentType:"application/json; charset=utf-8",
 	                   url: url,
 	                   data: JSON.stringify(data),
 	                   crossDomain: true,
 	       	        	xhrFields: {
 	       	              withCredentials: true
 	       	               }, 
 	                   async: false,
 	                   success: function(resultJson){
 	                        transouts=resultJson.result;
 	                   },
 	                  error : function( XMLHttpRequest, textStatus, errorThrown) {
                          var errorParams = {
                                  "XMLHttpRequest":XMLHttpRequest,
                                  "textStatus":textStatus,
                                  "errorThrown":errorThrown
                          };
                      }
 	            });
 			}

             return transouts;
        },
        tranoutLog:function(callingInfo){
            var pSerialNo = callingInfo.getSerialNo()?callingInfo.getSerialNo():"";
            var pCallerNo = callingInfo.getCallerNo()?callingInfo.getCallerNo():"";
            var transferTime = callingInfo.getTransferTime();
            var transferType = callingInfo.getTransferType(); 
            var transferInner = callingInfo.getTransferInner();
            var transferOuter = callingInfo.getTransferOuter();
            var transferMsg = callingInfo.getTransferMsg();
            var transferMode = callingInfo.getTransferMode();
            //var status = callingInfo.getTransferStatus();
            // var ctiId = index.CallingInfoMap.getCTIId();
            
            var pContactId = callingInfo.getContactId()?callingInfo.getContactId():"";
            var ctiId = callingInfo.getCtiId();
            var params = {
                    serialNo : pSerialNo,       // 2呼叫流水号
                    callerNo : pCallerNo,       // 3主叫号码
                    transferTime : transferTime,    // 4转接时间
                    transferType : transferType,    // 5转接目的设备类型
                    transferInner : transferInner,  // 6转接目的设备号码
                    transferMode : transferMode,    // 7转移模式
                    transferOuter : transferOuter,  // 8转接人工号
                    transferMsg : transferMsg,  // 9转接同步信息
                    status : "0",       // 10转移状态
                    contactId : pContactId,         // 11接触编号
                    ctiId : ctiId           // 12ctiId
            };
            Util.ajax.postJson("front/sh/media!execute?uid=transfer009", params, function(json, status) {
            })
        },
        buttonStyleChange:function(){
            $("#transferBtn_skillQuewys",$el).unbind();
            $("#transferBtn_skillQuewys",$el).bind("click", $.proxy(this.transferBtn,this));
            $("#transferBtn_skillQuewys").removeAttr("disabled");
            $("#transferBtn_skillQuewys").removeClass("btn_skillQue");
            $("#transferBtn_skillQuewys").addClass("btn-blue");
        }
    });
    return initialize;
});