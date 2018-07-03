define([ 'Util',
         'Compts',
        '../../index/constants/mediaConstants',
         '../../../tpl/content/editArea/releaseReason.tpl',
         '../../../assets/css/content/editArea/releaseReason.css'],
function(Util,Compts,MediaConstants,tpl) { 
	var $el;
	var _index;
  var releasReason;
  var _result;
  var CTIID;
  var opt_;
  var opserialno;
	var initialize = function(indexModule,opt) {  
		$el = $(tpl);
		_index = indexModule;
    opt_=opt;
    releasReason = opt_.isNew;
    opserialno=opt_.opserialno;
    $.extend(_index, {
        releaseReason: this
    });
		this.listInit();
		this.initEvent();
		this.content = $el;
	}
	$.extend(initialize.prototype, {
		listInit:function(){
			var config = {
                el:$('#release_reason_all',$el)[0],
                field:{ 
                	boxType:'radio',
                    key:'id',
                    items:[  
                        { text:'请选择：',name:'name',click:function(e,val,item){
                        	//releasReason=item.data.name;
                        	releasReason = val;
                        }}  
                    ]
                },  
                data:{ 
                    url:'front/sh/common!execute?uid=datadict007&typeId=RELEASE.REASON'
                }
            };
          var list = new Compts.List(config); 
          list.search({});
          list.on('success',function(result){
              $("#release_reason_all .sn-list .sn-list-table.sn-table").css("height","200px");
        	  $('#release_reason_all',$el).find('.sn-list-content tbody').find('tr').eq(0).addClass('selected');
        	  releasReason="正常咨询结束";
          });
		},
		initEvent:function() {
			$el.on("click", "#release_reason_commit", $.proxy(this.reasonComm, this));
			$el.on("click", "#release_reason_canel", $.proxy(this.dialogClose, this));
		},
		dialogClose:function(){ 
			_index.destroyDialog();
		}, 
    reasonComm: function(){
      if(releasReason == true ){
    	  _index.popAlert("请选择释放原因");
        return;
      }
      var serialNo=_index.CallingInfoMap.getActiveSerialNo();
      var callingInfo = _index.CallingInfoMap.get(serialNo);
      //设置挂机方为坐席 start
      callingInfo.setReleaseType(MediaConstants.RELEASETYPE_OPERATOR); 
      //设置挂机方为坐席 end
      if(serialNo == undefined || callingInfo == undefined){
        return;
      }
      var sessionStatus=_index.CallingInfoMap.get(serialNo).getSessionStatus();
       if(callingInfo.getReqEvaluate() != '05'&&callingInfo.getMediaType()!=MediaConstants.MICROBLOGGING_TYPE&&sessionStatus != "04"){
         this.sendSatisfaction(serialNo,callingInfo);
      }else{      
        this.release(serialNo,callingInfo);
      }
         
    },
    sendSatisfaction:function(serialNo,callingInfo){
      var toUserName = callingInfo.getCallerNo();
      var channelId = callingInfo.getChannelID();
      var fromUserName = callingInfo.getToUserId();
      var fromOrgId = callingInfo.getFromOrgId();
      var clientId = callingInfo.getClientId();
      var callId = callingInfo.getCallId();
      var url_satisfaction = "front/sh/media!execute?uid=satisfaction000";
      var data_satisfaction = {
          "fromUserName":fromUserName,
          "toUserName":toUserName,
          "channelId":channelId,
          "callID":callId,
          "fromOrgId":fromOrgId,
          "clientId":clientId
      };
      var _this = this;
    
      $.ajax({
        type: "POST",
        url: url_satisfaction,
        data: data_satisfaction,
        async: true,
        timeout:2000,
        success: function(resultJson){
          if(resultJson.returnCode==MediaConstants.RETURNCODE_NGMMGW){
            _index.popAlert("邀请评价下发成功");
            //更改满意度状态
            callingInfo.setReqEvaluate(MediaConstants.SATIFATION_STATUS_PUSH);
            _index.CallingInfoMap.put(serialNo,callingInfo);
            //根据流水号更新满意度
            var serialNo = callingInfo.getSerialNo();
            //邀请已发出，待评价
            var userSatisfy = MediaConstants.USERSATISFY_PUSH;
            var data_updateContact={
                "serialNo":serialNo,
                "userSatisfy":userSatisfy,
                "surveyTypeId":"03"
            }
            Util.ajax.postJson('front/sh/media!execute?uid=satisfaction001',data_updateContact,function(result,status){
            	if(status){
            	}
            });
            
            //_index.CallingInfoMap.recordCallCTILog(url_satisfaction,data_satisfaction,resultJson,resultJson.returnCode);
          }else{
				_index.popAlert("邀请评价失败");
          }
        },
        error:function(jqXHR,textStatus,errorThrown){
          _index.popAlert("网络异常，邀请评价失败");
          /*var errorStr = {
              jqXHR : jqXHR,
              textStatus : textStatus,
              errorThrown : errorThrown
          }
          _index.CallingInfoMap.recordCallCTILog(url_satisfaction,data_satisfaction,errorStr,"网络异常，坐席主动下发满意度接口调用失败");*/
        },
        complete : function(XMLHttpRequest,status){
        	_this.release(serialNo,callingInfo);
        }
      });         
      opserialno=opserialno+1;
      if(opserialno>65535)
      {
        opserialno=1;
      }
    },
    release:function(serialNo,callingInfo){
        var time = callingInfo.getCallIdTime();
        var dsn = callingInfo.getCallIdDsn();
        var handle = callingInfo.getCallIdHandle();
        var server = callingInfo.getCallIdServer();
        var callId = {"time":time,"dsn":dsn,"handle":handle,"server":server};
        var ip = _index.CTIInfo.IP;
        var port = _index.CTIInfo.port;
        var isDefault=_index.CTIInfo.isDefault;//缺省业务标志值
		    var proxyIP=_index.CTIInfo.ProxyIP;//代理IP
        var proxyPort =_index.CTIInfo.ProxyPort;//代理端口
        var ctiId = _index.CTIInfo.CTIId;
        if(ip == undefined || port == undefined ){
          return;
        }
        var options = _index.serialNumber.getSerialNumber();
        var data ={
            "callId":callId,
            "opserialNo":options
        }
        
        var url = '';
        if(isDefault=="1"){//此种情况走nginx代理
        	url=MediaConstants.CCACSURL+proxyIP+":"+proxyPort+"/ccacs/"+ctiId+"/ws/call/releasecall";
         }else{                                 
        	url= MediaConstants.CCACSURL+ip+":"+port+"/ccacs/ws/call/releasecall"; //跨域直连
         }
        //调用CTI释放接口
        if(_index.queue.browserName==="IE"){  //注意index的
			     //IE逻辑
            callingInfo.setReleaseType(MediaConstants.RELEASETYPE_OPERATOR);
            callingInfo.setReleaseReason(releasReason);

            $.ajax({  
                url : url ,
                type : 'post',  
                data :  JSON.stringify(data),
	            async: false,
      	  		crossDomain: true,
//      	        xhrFields: {
//      	              withCredentials: true
//      	               }, 
                contentType:"application/json; charset=utf-8",
                success : function(datas) {
                  var result = datas.result;
                  //result的值为"0"表示接口调用成功，否则表示调用接口失败
                  if(result =="0"){
                      //将更新后的callingInfo对象覆盖原来的
                      _index.CallingInfoMap.put(serialNo,callingInfo);
                      _index.popAlert("释放成功","释放信息");
                      _index.destroyDialog();
                    }else{
                    	var sessionStatus=_index.CallingInfoMap.get(serialNo).getSessionStatus();
        		        if ('04'==sessionStatus) {
        		        	_index.popAlert("会话已挂断，释放会话失败！","释放信息");
        				}else{
                            _index.popAlert("释放失败！","释放信息");
        				}
        		        _index.destroyDialog();
                    }
                },
                  error : function( XMLHttpRequest, textStatus, errorThrown) {
                    _index.popAlert("网络异常，释放失败！","释放信息");
                    /*var errorStr = {
                        XMLHttpRequest : XMLHttpRequest, 
                        textStatus : textStatus, 
                        errorThrown : errorThrown
                    }
                    _index.CallingInfoMap.recordCallCTILog(url,data,errorStr,"网络异常，释放失败！");*/
                }
              });
		}else{
			//其他浏览器逻辑
	        $.ajax({  
	            url : url ,
	            type : 'post',  
	            data :  JSON.stringify(data),
	            async: false,
	  	  		crossDomain: true,
	  	        xhrFields: {
	  	              withCredentials: true
	  	               }, 
	            contentType:"application/json; charset=utf-8",
	            success : function(datas) {
	              var result = datas.result;
	              //result的值为"0"表示接口调用成功，否则表示调用接口失败
	              if(result =="0"){
	                  	 //_index.CallingInfoMap.recordCallCTILog(url,data,datas,"释放成功");
	                      callingInfo.setReleaseType(MediaConstants.RELEASETYPE_OPERATOR);
	                      callingInfo.setReleaseReason(releasReason);
	                      //将更新后的callingInfo对象覆盖原来的
	                      _index.CallingInfoMap.put(serialNo,callingInfo);
	                      _index.popAlert("释放成功","释放信息");
	                  _index.destroyDialog();
	                }else{
	                	var sessionStatus=_index.CallingInfoMap.get(serialNo).getSessionStatus();
        		        if ('04'==sessionStatus) {
        		        	_index.popAlert("会话已挂断，释放会话失败！","释放信息");
        				}else{
                            _index.popAlert("释放失败！","释放信息");
        				}
        		        _index.destroyDialog();
	                }
	            },
	              error : function( XMLHttpRequest, textStatus, errorThrown) {
	                _index.popAlert("网络异常，释放失败！","释放信息");
	                /*var errorStr = {
	                    XMLHttpRequest : XMLHttpRequest, 
	                    textStatus : textStatus, 
	                    errorThrown : errorThrown
	                }
	                _index.CallingInfoMap.recordCallCTILog(url,data,errorStr,"网络异常，释放失败！");*/
	            }
	          });
		}

    }
	})
	return initialize;
});