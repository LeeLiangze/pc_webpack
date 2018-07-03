/**
 * Created by lizhao on 2016/3/30.
 *
 *
 */
define(
    function () {
        var objClass=function(index,$el){
            this.index=index;
            this.variable={
                "name":"",
                "cross_data":{
                    "userInfo":this.index.getUserInfo()
                    /*"header":this.index.header,
                     "clientIntro":this.index.clientIntro*/
                }
            }; //数据存储地址
            var that = this;
            setTimeout(function() {
            	that.index.provinceUrl = index.CTIInfo.iframeurl;
            	that.index.provinceUrl&&(that.$provinceIframe=$('<iframe src="'+that.index.provinceUrl+'" style="display: none"></iframe>').appendTo($("body")));
            },800);
            this.index.externalUrl&&(this.$mttIfram=$('<iframe src="'+this.index.externalUrl+'" style="display: none"></iframe>').appendTo($("body")),this.mttData={});
            EventListener.call(this);
        };
        //事件监听
        function EventListener(){
            var self=this;
            if( window.addEventListener){
                window.addEventListener('message', function(e){
                    handleEvent.call(self,e);
                }, false);
            }else {
                window.attachEvent('onmessage', function(e){
                    handleEvent.call(self,e);
                });
            }
        }
        //事件处理
        function handleEvent(event){
            var json= JSON.parse(event.data);
            var paramArr = [];
            for(i in json.param){
                paramArr.push(json.param[i]);
            }
            switch (json.type){
                case "function":
                    if(this.index[json.name]){
                        if(json.name=="showDialog"){
                            this.variable.cross_data['iframe']={
                                title:paramArr[0].title,
                                url:paramArr[0].url,
                                businessOptions:paramArr[0].param
                            };
                        }
                        this.index[json.name].apply(this.index,paramArr);
                    } else if(this.index.main[json.name]){
                        this.index.main[json.name].apply(this.index.main,paramArr);
                    } else if(this.index.ctiInit[json.name]){
                        this.index.ctiInit[json.name].apply(this.index.ctiInit,paramArr);
                    } else{
                        switch (json.name){
                            case "screenLoading.show":
                                this.index.screenLoading.show.apply(this.index.screenLoading,paramArr);
                                break;
                            case "screenLoading.hide":
                                this.index.screenLoading.hide.apply(this.index.screenLoading,paramArr);
                                break;
                        }
                    }
                    break;
                case "setData":
                    this.variable[json.name]=json.param;
                    break;
                case "getData":
                    if(this.variable[json.name]){
                        sendSetDataMsg.call(this,decodeURI(json.name),this.variable[json.name],json.origin);
                    }else if (this.index.ctiInit && this.index.ctiInit[json.name]){
                        var getCommunicationData=this.index.ctiInit[json.name](json.param);
                        sendSetDataMsg.call(this,decodeURI(json.name),getCommunicationData,json.origin);
                    } else {
                        sendSetDataMsg.call(this,decodeURI(json.name),{},json.origin);
                    }
                    break;
                case "event":
                    eventHandle.call(this,json);
                    break;
                case "mttData":
                    this.mttData[json.name]&&(this.mttData[json.name](json.param),delete this.mttData[json.name])
                    break;
                default:
                    break;
            }
        }
        //消息发送--总方法
        function messageSend(data,origin){
            var dialogIfram=$("iframe").closest(".ui-dialog").last().find('iframe');
            data.name=encodeURI(data.name);
        	if(this.index.$iframe){
                this.index.$iframe[0].contentWindow.postMessage(stringify(data),this.index.$iframe.attr("src"))
            }else{
                if(!dialogIfram.length){
//                    var iframe=origin?this.index.main.getIframeByUrl(origin.replace(/\?code=[\s\S][^\#]*\#/g,'#')):this.index.main.getCurrentIframe();
                	var iframe=origin?this.index.main.getIframeByUrl(origin.replace(/\?code=[\s\S][^\#]*/g,'')):this.index.main.getCurrentIframe();
                    // 通过 postMessage 向子窗口发送数据
                    if(iframe){
                    	if(!iframe.el){
    						iframe=this.index.main.getCurrentIframe();
    					}
                        if(data.type=="setData"&&data.name=="cross_data"){
                            this.variable["cross_data"].iframe=iframe;
                            data.param=this.variable["cross_data"];
                        }
                        if( Object.prototype.toString.apply(iframe) === "[object Array]"){
                            $.each(iframe,function(index,$iframe){
                                $iframe.el[0].contentWindow.postMessage(stringify(data),$iframe.url)
                            })
                        }else {
                            iframe.el[0].contentWindow.postMessage(stringify(data),iframe.url)
                        }
                    }
                }else {
                    if(data.type=="setData"&&data.name=="cross_data"){
                    	/*this.variable["cross_data"].iframe = {
                    		el:dialogIfram,
                    		businessOptions:{},
                    		title:'',
                    		url:dialogIfram.attr('src')
                    	};*/
                        data.param=this.variable["cross_data"];
                    }
                    if (origin!=dialogIfram.attr('src')) {
                    	var iframe=origin?this.index.main.getIframeByUrl(origin.replace(/\?code=[\s\S][^\#]*/g,'')):this.index.main.getCurrentIframe();
                        // 通过 postMessage 向子窗口发送数据
                        if(iframe){
                        	if(!iframe.el){
        						iframe=this.index.main.getCurrentIframe();
        					}
                            if(data.type=="setData"&&data.name=="cross_data"){
                                this.variable["cross_data"].iframe=iframe;
                                data.param=this.variable["cross_data"];
                            }
                            if( Object.prototype.toString.apply(iframe) === "[object Array]"){
                                $.each(iframe,function(index,$iframe){
                                    $iframe.el[0].contentWindow.postMessage(stringify(data),$iframe.url)
                                })
                            }else {
                                iframe.el[0].contentWindow.postMessage(stringify(data),iframe.url)
                            }
                        }
					}
                    // 通过 postMessage 向iframe发送数据
                    dialogIfram[0].contentWindow.postMessage(stringify(data),dialogIfram.attr('src'));
                }
            }
        }
        //JSON.stringify 方法
        function stringify(data){
            data.param&&data.param.iframe&&(delete data.param.iframe.el);
            return JSON.stringify(data);
        }
        //发送事件消息
        function sendEventMsg(name,param){
            messageSend.call(this,{
                type:"event",
                name:name,
                param:param
            });
        }
        //向所有页签发送事件消息
        function sendEventMsgToAll(name,param){
            if(this.index.main.currentPanel&&this.index.main.currentPanel.glbTab&&this.index.main.currentPanel.glbTab.items){
                $.each(this.index.main.currentPanel.glbTab.items,function(key,val){
                    if(val.iframe&&val.iframe[0]&&val.iframe[0].contentWindow){
                        val.iframe[0].contentWindow.postMessage(stringify({
                            type:"event",
                            name:name,
                            param:param
                        }),val.content);
                    }
                })
            }else{
                messageSend.call(this,{
                    type:"event",
                    name:name,
                    param:param
                });
            }
        }
        //发送数据消息
        function sendSetDataMsg(name,param,origin){
            messageSend.call(this, {
                type: "setData",
                name: name,
                param: param
            },origin);
            if (param&&(name!="cross_data")&&this.variable[name]) {
                delete this.variable[name]
            }

        }
        //事件消息处理
        function eventHandle(json){
            var sendEvent=function(iframe,param,name){
                iframe&&iframe.el&&iframe.el[0]&&iframe.el[0].contentWindow.postMessage(JSON.stringify({
                    type: "event",
                    name: name,
                    param: param
                }),iframe.url)
            };
            if(!json.origin){
                sendEventMsg.call(this,json.name,json.param);
            }else if(typeof json.origin=='string'){
                sendEvent(this.index.main.getIframe(json.origin),json.param,json.name);
            }else{
                $.each(json.origin, $.proxy(function(key,val){
                    sendEvent(this.index.main.getIframe(val),json.param,json.name);
                },this));
            }
        }

        //向 mtt 项目发送数据
        function sendMttMessage(el,name,param){
            isOnLoad(el,function(){
                el.attr("data-complete",true);
                el[0].contentWindow.postMessage(stringify({
                    type:"getDate",
                    name:name,
                    param:param
                }),el.attr("src"));
            })
        }
        //判断ifram是否加载完成
        function isOnLoad(iframe,callback){
            if(iframe.attr("data-complete")=='true'){
                callback()
            }else{
                iframe.load(function(){
                    callback()
                })
            }
        }

        objClass.prototype={
            trigger:function(name,data,isAll){
                if(isAll){
                	if (typeof(isAll)=='boolean') {
                		sendEventMsgToAll.call(this,name,data)
					}else {
						//自定义ifram处理，根据id获取ifram by zzy 2017/03/09
						var $iframe = $('#ngcsSendMsgIframeDiv #'+isAll);
						var sendData = {
			                type:"event",
			                name:name,
			                param:data
				        };
						$iframe[0].contentWindow.postMessage(stringify(sendData),$iframe.attr('src'));
					}
                }else{
                    sendEventMsg.call(this,name,data)
                }
            },
            extend:function(option){
                $.extend(this.index,option)
            },
            setIfram:function(data){
				if(this.variable["cross_data"]){
					this.variable["cross_data"].iframe=$.extend(this.variable["cross_data"].iframe,{
					title:data.title,
					url:data.url,
					businessOptions:data.param
					});
				}
            },
            //获取其他项目系统数据
            getExternalJson:function(name,param,callback){
                if(!this.$mttIfram){
                    return false
                }
                if(this.mttData){
                    this.mttData[name]=((typeof param=="function")?param:callback);
                    sendMttMessage.call(this,this.$mttIfram,name,(typeof param !="function")&&param)
                }

            },
            //发送消息到省端
            sendToProvince:function(name,param){
            	/*
            	if(!this.$provinceIframe){
            		return false
            	}
        		this.$provinceIframe[0].contentWindow.postMessage(stringify({
        			type:"event",
        			name:name,
        			param:param
        		}),this.$provinceIframe.attr("src"));
        		*/
            	return "";
            }
        };

        return objClass;
    });
