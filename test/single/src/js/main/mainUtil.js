/*
 * 获取渠道头像 by zzy 2017/2/7
 */
define(['Util'],function(){
	var obj = function(){
		this.entry={};
		this.loginEntry={};
	    this.channelEntry={};
	    this.mediaEntry = {};
	    
	    this.eventInit();
	}
	$.extend(obj.prototype,{
		eventInit:function(){
        	this.getChannelURL();
            this.getMediaURL();
            this.getLoginInfo();
        },
      //=====获取渠道图标by channelId  by zhangxuewei 2016年6月12日  start=====
        getChannelURL:function(channelId){
        	var channelInfo;
            Util.ajax.postJson('front/sh/common!execute?uid=channels001', {"channelId":channelId}, $.proxy(function(json,status){
                if (status) {
                	if(channelId == null || channelId ==""){
                		channelInfo =  json.beans;
                		var num = 0;
                		for(var prop in channelInfo){
                			var channelId = channelInfo[prop].channelId?channelInfo[prop].channelId:"null"+num+1;
                			channelEntry[channelId] = channelInfo[prop];
                		}
                	}else{
                		channelInfo =  json.bean;
                	}
                }else{
                }
            },this));
            return channelInfo;
        },
        getMediaURL:function(mediaTypeId){
        	var mediaInfo;
            Util.ajax.postJson('front/sh/common!execute?uid=medias001', {"mediaTypeId":mediaTypeId}, $.proxy(function(json,status){
                if (status) {
                	if(mediaTypeId == null || mediaTypeId ==""){
                		mediaInfo =  json.beans;
                		var num = 0;
                		for(var prop in mediaInfo){
                			var mediaTypeId = mediaInfo[prop].mediaTypeId?mediaInfo[prop].mediaTypeId:"null"+num+1;
                			mediaEntry[mediaTypeId] = mediaInfo[prop];
                		}
                	}else{
                		mediaInfo =  json.bean;
                	}
                }else{
                }
            },this));
            return mediaInfo;
        },
        getChannelInfo:function(channelId){
        	var channelInfo;
           if(channelId&&""!=channelId){
        	   if(channelId in channelEntry){
        		   channelInfo = channelEntry[channelId];
        	   }
           }
        return channelInfo;
        },
        getMediaInfo:function(mediaTypeId){
        	var mediaInfo;
           if(mediaTypeId&&""!=mediaTypeId){
        	   if(mediaTypeId in mediaEntry){
        		   mediaInfo = mediaEntry[mediaTypeId];
        	   }
           }
        return mediaInfo;
        },
        getLogoURL:function(channelId,mediaTypeId){
        	var unknownLogoURL = "src/assets/img/appNew/unknown.png";
        	var logoURL;
        	if(channelId&&""!=channelId){
    			if("channel"+channelId in entry){
    				logoURL = entry["channel"+channelId];
    				if(logoURL != null){
    					return logoURL;
    				}
    			}else{
    	        	channelInfo = this.getChannelInfo(channelId);
    	        	if(channelInfo&&channelInfo.logoURL){
    	        	  entry["channel"+channelId] = channelInfo.logoURL;
    	        		return channelInfo.logoURL;
    	          }
    			}
    			
        	}
        	if (mediaTypeId&&""!=mediaTypeId){
        		if("media"+mediaTypeId in entry){
        			logoURL = entry["media"+mediaTypeId];
        			if(logoURL != null){
        				return logoURL;
        			}
        		}else{
        			mediaInfo = this.getMediaInfo(mediaTypeId);
        			if(mediaInfo&&mediaInfo.logoURL){
        				entry["media"+mediaTypeId] = mediaInfo.logoURL
        				return mediaInfo.logoURL;
        			}
        		}
        	}
        	return unknownLogoURL;
        },
        getLoginInfo:function(){
        	if(!$.isEmptyObject(loginEntry)){
			  return loginEntry;
			};
        	Util.ajax.postJson('front/sh/media!queryLoginInfo?uid=loginInfo01', {}, $.proxy(function(json,status){
                if (status) {
                	if(json.bean.loginURL){
                		loginEntry["loginURL"] = json.bean.loginURL;
                	};
                	if(json.bean.logoutURL){
                		loginEntry["logoutURL"] = json.bean.logoutURL;
                	}
                }else{
                }
            },this));
        	return loginEntry;
        }
        
	})
	return obj;
})