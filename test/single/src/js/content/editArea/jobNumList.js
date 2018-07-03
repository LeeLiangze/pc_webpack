/**
 *工号列表
 */
define(['Util',
        'Compts',
        '../../index/constants/mediaConstants',
        'jquery.multipleSelect',
        '../../../tpl/content/editArea/jobNumList.tpl',
        '../../../assets/lib/jqueryPlugin/multiple-select-master/multiple-select.css',
        '../../../assets/css/content/editArea/jobNumList.css'
        ],
        function(Util,Compts,MediaConstants,multipleSelect,jobNumList){

    //系统变量-定义该模块的根节点
    var _index = null,$el,_option = null,setcalldatas,transouts,status_value,staffList,proviceName,cityName,SkillName,type,ccid,vdnid,ctiid,ip,port;   
    var initialize = function(indexModule,options){
    	$el = $(jobNumList);
        _index = indexModule;
        _option = options;
        ctiid = _index.CTIInfo.CTIId;
        ccid = _index.CTIInfo.CCID;
        vdnid = _index.CTIInfo.VDN_ID;
        ip = _index.CTIInfo.IP;
        port = _index.CTIInfo.port;
        
        //列表
        listInit.call(this);
        //初始化下拉列表
        this.initForm.call(this);
        this.initEvent();
        
		this.content = $el;
    };
    //人员列表初始化
    var listInit = function(){
        var config = {
            el:$('#list_jobNum',$el),
            field:{
                key:'id',
                boxType:'radio',
                items:[
                    { text:'业务账号',title:'',name:'STAFFID',className:'staffid_jobNumList_transfer'},
                    { text:'状态',name:'STATUS' },
                    { text:'对应平台工号',name:'WORKNO' }
                ],
            },
            data:{
              url:'front/sh/media!execute?uid=transfer010'
            } 
        }
        staffList = new Compts.List(config);
        
        //初始化时查询
        var status={
        		"status_all":[{"status":"3"},{"status":"4"},{"status":"5"},{"status":"6"},{"status":"7"},{"status":"8"}]
        }
        var jsonStatus=JSON.stringify(status);
        var transParam = {
                "ccid": ccid,
                "vdnid": vdnid,
                "ctiid": ctiid,
        		"proviceid" : "",
            	"cityid" : "",
            	"skillid" : "",
            	"status" : jsonStatus,
            	"account" : "",
            	"orgid" : _index.getUserInfo().orgaCode,
            	"isCheckSubOrga" : "0"
        };
        this.conditionFromCTI(transParam,function(worknoAndStatusAndSkillIdsParam,staffIds){
        	var paramB = {
        			"proviceid":"",
        			"cityid":"",
        			"skillid":"",
        			"status":jsonStatus,
        			"account":"",
        			"orgid":_index.getUserInfo().orgaCode,
        			"worknoAndStatusAndSkillIds":"",
        			"staffIds" : staffIds,
        			"ccid":ccid,
        			"vdnid":vdnid,
        			"ctiid":ctiid,
        			"isCheckSubOrga":"0"
        	};
        	paramB.worknoAndStatusAndSkillIds=worknoAndStatusAndSkillIdsParam;
        	staffList.search(paramB);
        });
    }

    $.extend(initialize.prototype, Util.eventTarget.prototype, {
        initEvent:function(){
        	//查询
            $el.on('click','#jobNumListBtn_search',$.proxy(this.searchStaff,this));
            //取消
            $el.on('click','#cancelBtn_jobNumList', $.proxy(this.cancelBtn,this));
            //转接
            $el.on('click','#jobNumListBtn_skillQuewys', $.proxy(this.transferBtn,this));
        },
        initForm:function(){
            var config = {
                el : $('#provinceId_skillQues', $el), // 要绑定的容器
                label : '省份地市', // 下拉框单元左侧label文本
                name : 'provicename', // 下拉框单元右侧下拉框名称
                url : 'front/sh/media!execute?uid=transfer001' // 数据源
            }
            proviceName = new Compts.Select(config);
            cityName = null;
            proviceName.on("change",$.proxy(function(e,valueObj){
                type="provice";
                if(valueObj.name == "请选择") {
                    this.cityLink(true, "");
                    this.skillNameByType(true,type);
                } 
                else {
                    this.cityLink(false, valueObj.value);
                    this.skillNameByType(false,type);
                }
            },this));
            //多选下拉框
            this.addMultipleSelect();
            //组织机构
            this.orgIdTransfer();
        },
        //根据条件初始化地市
        cityLink:function(isDisabled, proviceId){
        	$("#cityId_skillQues",$el).off();
            $("#cityId_skillQues",$el).html('');
            var config = {
                el : $('#cityId_skillQues', $el), // 要绑定的容器
                label : '', // 下拉框单元左侧label文本
                name : 'name', // 下拉框单元右侧下拉框名称
                disabled:isDisabled,
                url : 'front/sh/common!execute?uid=skill002&proviceid=' + proviceId // 数据源
            }
            cityName = new Compts.Select(config);
            SkillName = null;
            cityName.on("change",$.proxy(function(e,valueObj){
                 
                type="city";
                this.skillNameByType(false,type);
            },this));
        },
         //根据类型确定选择什么参数
        skillNameByType:function(isDisabled,type){
            //type all全部，provice 省，city市
            var proviceidParam=null;
            var cityIdParm=null;
            if(type=="all"){
                return this.skillNameFunction(isDisabled,"","",ccid,vdnid,ctiid);
            }else if(type=="provice"){
                proviceidParam=proviceName.getSelected().value;
                return this.skillNameFunction(isDisabled,proviceidParam,"",ccid,vdnid,ctiid);
            }else if(type=="city"){
                proviceidParam=proviceName.getSelected().value;
                cityIdParm=cityName.getSelected().value;
                return this.skillNameFunction(isDisabled,proviceidParam,cityIdParm,ccid,vdnid,ctiid);
            }
        },
        skillNameFunction:function(isDisabled, proviceId,cityId,ccId,vdnId,ctiId){
            
            $("#skillId_transfers",$el).html('');
            var config = {
                el : $('#skillId_transfers', $el), // 要绑定的容器
                label : '技能', // 下拉框单元左侧label文本
                name : 'name', // 下拉框单元右侧下拉框名称
                disabled:isDisabled,
                url : 'front/sh/media!execute?uid=transfer002&proviceid='+proviceId+'&cityid='+cityId+'&ccid='+ccId+'&vdnid='+vdnId+'&ctiid='+ctiId// 数据源
            }
            SkillName = new Compts.Select(config);
        },
        getWorkNo:function(transParam){
            var staffIdAndWorkNoArrs=new Array();
            var data={
                    "staffIdsAndWorkNo":""
            };
            $.ajax({
               type: "POST",
               url: "front/sh/media!execute?uid=transfer006",
               data: transParam,
               async: false,
               success: function(resultJson){
                    var result=resultJson.beans;
                    var jsonArray = eval(result); 
                    var staffId;
                    var workNo;
                    for(var i=0;i<jsonArray.length;i++){
                        var staffIdAndWorkNoJson={
                                "staffId":"",
                                "workNo":""
                        }
                        //定义工号和状态的json格式
                        if(jsonArray[i].STAFFID!=undefined){
                            staffIdAndWorkNoJson.staffId=jsonArray[i].STAFFID;
                        }
                        staffIdAndWorkNoJson.workNo=jsonArray[i].WORKNO;
                        staffIdAndWorkNoArrs.push(staffIdAndWorkNoJson);
                    }
               }
            });
            data.staffIdsAndWorkNo=staffIdAndWorkNoArrs;
            return data;
        },
        //根据条件搜索,点击查询列表更新
        searchStaff:function(){
            var proviceid = null;
            var cityid = null;
            var skillid = null;
            var status = null;
            var account = null;
            var workno = null;
            var worknoAndStatusA = null;
            if(proviceName !== null && proviceName !== undefined && proviceName !== '' ){
                proviceid=proviceName.getSelected().value;
            }
            if(cityName !== null && cityName !== undefined && cityName !== '' ){
                cityid=cityName.getSelected().value;
            }
            if(SkillName !== null && SkillName !== undefined && SkillName !== '' ){
                skillid=SkillName.getSelected().value;
            }
            if(selectTree !== null && selectTree !== undefined && selectTree !== ''){
                //orgid_init=$.trim($("#orgId_transfers input[type='hidden']",$el).val());
            	if($.trim($("#orgId_transfers input[type='text']", $el).val()) != '') {
            		orgid_init = $.trim($("#orgId_transfers input[type='hidden']", $el).val());
            	} else {
            		orgid_init = '';
            	}
            }
            status=$.trim($("#selectStatusId_transfer",$el).val());
            account=$.trim($("#accountId_transfer",$el).val());
            if(proviceid==""&&orgid_init==""&&account==""){
                alert("省份、账号、组织机构请最少选择一个。")
                return;
            }
            
            //获取多选下拉框的值
            var status_param;
            var statusArr=new Array();
            for(var m=0;m<status_value.length;m++){
                var ststusJson={
                        "status":status_value[m]
                };
                statusArr.push(ststusJson);
            }
            var status_all={
                    "status_all":statusArr
            }
            var len = status_all.status_all.length;
            if(len==0){
                alert("请最少选择一个状态。");
                return
            }
            status_param=JSON.stringify(status_all);
            var isCheckSubOrga = $("#isCheckSubOrga_jobNumList option:selected", $el).val();
          //主动点击查询按钮时查询
            var transParam = {
                "ccid": ccid,
                "vdnid": vdnid,
                "ctiid": ctiid,
            	"proviceid" : proviceid,
            	"cityid" : cityid,
            	"skillid" : skillid,
            	"status" : status_param,
            	"account" : account,
            	"orgid" : orgid_init,
            	"isCheckSubOrga" : isCheckSubOrga
            };
            this.conditionFromCTI(transParam,function(worknoAndStatusAndSkillIdsParam,staffIds) {
            	//查询参数
            	var paramData = {
            			"proviceid":proviceid,
            			"cityid":cityid,
            			"skillid":skillid,
            			"status":status_param,
            			"account":account,
            			"orgid":orgid_init,
            			"worknoAndStatusAndSkillIds":worknoAndStatusAndSkillIdsParam,
            			"staffIds" : staffIds,
            			"ccid":ccid,
            			"vdnid":vdnid,
            			"ctiid":ctiid,
            			"isCheckSubOrga":isCheckSubOrga
            	};
            	staffList.search(paramData);
            });
        },
        conditionFromCTI:function(transParam,callback){
            //入参数据封装
            var workNo;
            var workArr=new Array();
            var tempStaffId;
            var tempStaffArr = new Array();
            var swData=this.getWorkNo(transParam);
            var array = swData.staffIdsAndWorkNo;
            
            var agentstatusinfoParams={
                    "agentIds":"",
                    "ip":ip,
                    "port":port,
                    "ctiId":ctiid
                }
            for(var i=0;i<array.length;i++){
            	workNo = array[i].workNo;
                tempStaffId = array[i].staffId;
                var agentIdsArray={
                        "ccId":ccid,
                        "vdnId":vdnid,
                        "agentId":""
               }
                var staffAndWorkNos = {
                    	"staffId" : "",
                    	"workNo" : ""
                };
                if(workNo!==null&&workNo!==''){
                    agentIdsArray.agentId=workNo;
                    workArr.push(agentIdsArray);
                    if (tempStaffId !== null && tempStaffId !== '') {
                    	staffAndWorkNos.staffId = tempStaffId;
                    	staffAndWorkNos.workNo = workNo;
                    	tempStaffArr.push(staffAndWorkNos);
                    }
                }
            }
            var staffIds = {
                	"staffIds" : tempStaffArr 
            };
            agentstatusinfoParams.agentIds=JSON.stringify(workArr);
            var data=agentstatusinfoParams;
            var agentId=null;
            var workno=null;
            var status;
            var statusAndStaffIdArray = new Array();
            var worknoAndStatusAndSkillIds={
                    "statusAndSKillIdsArray":""
                }
            $.ajax({
                   type: "POST",
                   url: "front/sh/media!execute?uid=transfer007",
                   data: data,
//                   async: false,
                   success: function(resultJson){
                        var resultMap=resultJson.bean;
                        if(resultMap==""||resultMap==undefined){
                           alert("初始化信息失败");
                           return;
                        }
                        var response=JSON.parse(resultMap.response);
                        if (response.result == "134001") {
                        	staffList.load();
                        	return;
                        }
                        if(response.result!=="0"){
                           alert("初始化信息失败");
                           return;
                        }
                        var resultSucc=response.resultDatas;
                        var jsonArray = eval(resultSucc); 
                        for(var i=0;i<jsonArray.length;i++){
                            //定义工号和状态的json格式
                            var statusAndSkillIds={
                                    "status":"",
                                    "skillIds":"",
                                    "agentId":""
                                }
                            var skills=jsonArray[i].serveSkills;
                            if(skills==undefined){
                                skills=new Array();
                            }
                            //放入技能
                            var skillIdsAr=new Array();
                            for(var j=0;j<skills.length;j++){
                                var skillIdsJson={
                                        "skillId":""
                                    }
                                skillIdsJson.skillId=skills[j];
                                skillIdsAr.push(skillIdsJson);
                            }
                            statusAndSkillIds.skillIds = skillIdsAr;
                            //准备状态数据
                            status=jsonArray[i].currentState;
                            switch(status)
                            {
                              //0：表示话务员未签入==签出。
                            case 0:
                                status=MediaConstants.SEATING_CHECK_OUT;
                              break;
                              //1：表示话务员空闲==空闲。
                            case 1:
                                status=MediaConstants.SEATING_EMPTY;
                              break;
                              //2：表示预占用状态==通话。
                            case 2:
                                status=MediaConstants.SEATING_CALLING;
                                break;
                            //3：表示占用状态==通话。
                            case 3:
                                status=MediaConstants.SEATING_CALLING;
                                break;
                            //4：表示应答状态==通话。
                            case 4:
                                status=MediaConstants.SEATING_CALLING;
                                break;
                            //5：表示通话状态==通话。 
                            case 5:
                                status=MediaConstants.SEATING_CALLING;
                                break;
                            //6：表示工作状态==整理。
                            case 6:
                                status=MediaConstants.SEATING_CLEARED;
                                break;
                            //7：表示忙状态==示忙。
                            case 7:
                                status=MediaConstants.SEATING_BUSY;
                                break;
                            //8：表示请假休息==休息。
                            case 8:
                                status=MediaConstants.SEATING_OFF;
                                break;
                            //9：表示学习态。
                            case 9:
                                status=MediaConstants.SEATING_STUDY;
                                break;
                            }
                            //放入状态
                            statusAndSkillIds.status = status;
                            //放入工号
                            statusAndSkillIds.agentId = jsonArray[i].agentId;
                            statusAndStaffIdArray.push(statusAndSkillIds);
                        }
                        //将员工ID和状态的数组添加到json中形成json数组
                        worknoAndStatusAndSkillIds.statusAndSKillIdsArray=statusAndStaffIdArray;
                        var str = JSON.stringify(worknoAndStatusAndSkillIds);
                        if(typeof callback === "function") {
							callback(str,JSON.stringify(staffIds));
						}
                        //_index.CallingInfoMap.recordCallCTILog("ccbms/ws/monitor/agentcurrentservestatusinfo",data,resultJson,"查询多个坐席人员当前正在服务的技能和呼叫信息接口");
                   },
                   error:function(jqXHR,textStatus,errorThrown){
                       alert("初始化信息失败");
                       /*var errorParams = {
                               "XMLHttpRequest":jqXHR,
                               "textStatus":textStatus,
                               "errorThrown":errorThrown
                       };*/
                       //_index.CallingInfoMap.recordCallCTILog("ccbms/ws/monitor/agentcurrentservestatusinfo",data,errorParams,"网络异常，查询多个坐席人员当前正在服务的技能和呼叫信息接口");
                   }
                });
//            var str=JSON.stringify(worknoAndStatusAndSkillIds);
//            return str;
        },
        addMultipleSelect:function(){
             $('#selectStatusId_transfer',$el).change(function() {
                    status_value = "";
                    status_value=$(this).multipleSelect('getSelects');
                }).multipleSelect({
                    width: '100%',
                    selectAllText:'全选',
                    allSelected:'全选',
                    minimumCountSelected:10
            });
        },
        //组织机构树
        orgIdTransfer:function(){
            //组织机构
            var config = {
                    el : $('#orgId_transfers', $el),
                    title : '组织机构树',
                    label : '组织机构',
                    text:_index.getUserInfo().orgaName,
                    value: _index.getUserInfo().orgaCode,
                    textField:_index.getUserInfo().orgaName,
                    valueField:_index.getUserInfo().orgaCode,
                    name : 'name',
                    url : 'front/sh/media!execute?uid=transfer012'
                };
            selectTree = new Compts.SelectTree(config);
        },
        //取消功能
        cancelBtn:function(){
            _index.destroyDialog();     
        },
        transferBtn:function(){
            $("#jobNumListBtn_skillQuewys").attr({"disabled":"disabled"});
            $("#jobNumListBtn_skillQuewys").removeClass("btn-blue");
            $("#jobNumListBtn_skillQuewys").addClass("btn_jobNumList");
            //设置呼叫数据接口返回结果
            this.setcalldata();
            if(setcalldatas=="0"){
                this.transout();
                //设置转接日志数据
                var currentTime = _index.utilJS.getCurrentTime();             
                var params=staffList.getSelected();
                var inner='';
                if(params!=undefined){
                    inner=staffList.getSelected().WORKNO;
                }
                var staffID =  _index.getUserInfo()['staffId'];
                var mode=$('#transferId_jobNum input[name="transfer"]:checked ').val();
                var msg=$.trim($el.find("#notesId_jobNumList").val());
               //将转接数据放入callInfo
                var activeSerialNo=_index.CallingInfoMap.getActiveSerialNo();
                _callingInfo=_index.CallingInfoMap.get(activeSerialNo);
                if(_callingInfo!=null){
                    _callingInfo.setTransferTime(currentTime);
                    _callingInfo.setTransferType("0");
                    _callingInfo.setTransferInner(inner);
                    _callingInfo.setTransferMode(mode);
                    _callingInfo.setTransferOuter(staffID);
                    _callingInfo.setTransferMsg(msg);
                    _index.CallingInfoMap.put(activeSerialNo,_callingInfo);
                }
                switch(transouts){
                    case "0":
                        _index.popAlert("转出操作成功");
                        _index.destroyDialog();
                        break;
                    case "20512":
                    	this.buttonStyleChange();
                        _index.popAlert("被转接座席已达到最大会话数，转接失败");
                        break;
                    case "20515":
                    	 this.buttonStyleChange();
                        _index.popAlert("被转接坐席已示忙");
                        break;
                    case "150003":
                    	 this.buttonStyleChange();
                        _index.popAlert("转接失败，请检查是否选择工号");
                        break;
                    case "155085":
                    	 this.buttonStyleChange();
                        _index.popAlert("转接失败，请不要转给自己！");
                        break;
                    default:
                    	 this.buttonStyleChange();
                        var errorcodeResultMsg=_index.ErrorcodeSearch.errorcodeSearch(transouts);
                        _index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);
                }
            }else{
                _index.popAlert("客户已挂机，不允许转接！");
                _index.destroyDialog();
            }
        },
        setcalldata:function(){
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
            var transferMsg=$.trim($el.find("#notesId_jobNumList").val());
            var callData={
            		"contactID" : contactId,
                    "serialNo":serialNo,
                    "transferMsg":transferMsg,
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
                };
             if(_index.queue.browserName==="IE"){  //注意index的
 				//IE逻辑
                 $.ajax({
                     type: "POST",
                     url: url,
                     contentType:"application/json; charset=utf-8",
                     data: JSON.stringify(data),
                     crossDomain: true,
                     async: false,
                     success: function(resultJson){
                         setcalldatas=resultJson.result;
                         if(setcalldatas != '0') {
                        	 var errorcodeResultMsg=_index.ErrorcodeSearch.errorcodeSearch(setcalldatas);
                             _index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);
                         }
                      },
                     error : function( XMLHttpRequest, textStatus, errorThrown) {
                     }
                  });
 			}else{
 				//其他浏览器逻辑
 	             $.ajax({
 	                type: "POST",
 	                url: url,
 	                contentType:"application/json; charset=utf-8",
 	                data: JSON.stringify(data),
 	                crossDomain: true,
 	 	   	        xhrFields: {
 	 	   	              withCredentials: true
 	 	   	               }, 
 	                async: false,
 	                success: function(resultJson){
 	                    setcalldatas=resultJson.result;
 	                   if(setcalldatas != '0') {
                      	 var errorcodeResultMsg=_index.ErrorcodeSearch.errorcodeSearch(setcalldatas);
                           _index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);
                       }
 	                 },
 	                error : function( XMLHttpRequest, textStatus, errorThrown) {
 	                }
 	             });
 			}

            return setcalldatas;
        },
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
             //转出的设备类型--坐席
             var calledDeviceType=MediaConstants.CALLEDDEVICETYPE_SEAT;
             //转出时的模式  0：释放转  2：成功转 3：指定转
             var transferMode=$('#transferId_jobNum input[name="transfer"]:checked ').val();
             //设置挂机方为坐席 start
             if(transferMode == "0"){
            	 callingInfo.setReleaseType(MediaConstants.RELEASETYPE_OPERATOR); 
             }
             //设置挂机方为坐席 end
             //工号
             var params=staffList.getSelected();
             if(params==''||params==undefined){
                 calledDigits='';
             }else{
                 calledDigits=staffList.getSelected().WORKNO;
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
                     url: url,
                     contentType:"application/json; charset=utf-8",
                     data: JSON.stringify(data),
  			  		crossDomain: true,
                     async: false,
                     success: function(resultJson){
                         transouts=resultJson.result;
                     },
                     error : function( XMLHttpRequest, textStatus, errorThrown) {
                     }
              });
 			}else{
 				//其他浏览器逻辑
 				$.ajax({
                    type: "POST",
                    url: url,
                    contentType:"application/json; charset=utf-8",
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
                    }
             });
 			}  
             
            return transouts;
        },
        buttonStyleChange:function(){
        	$("#jobNumListBtn_skillQuewys").removeAttr("disabled");
            $("#jobNumListBtn_skillQuewys").removeClass("btn_jobNumList");
            $("#jobNumListBtn_skillQuewys").addClass("btn-blue");
        }
    })

    return initialize;
});