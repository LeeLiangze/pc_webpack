!function(){function e(){for(var e=$G("tabHeads").children,t=0;t<e.length;t++)domUtils.on(e[t],"click",function(t){var a,i,o=t.target||t.srcElement;for(a=0;a<e.length;a++)i=e[a].getAttribute("data-content-id"),e[a]==o?(domUtils.addClass(e[a],"focus"),domUtils.addClass($G(i),"focus")):(domUtils.removeClasses(e[a],"focus"),domUtils.removeClasses($G(i),"focus"))})}function t(){u(["videoFloat","upload_alignment"]),p($G("videoUrl")),a(),function(){var e,t=editor.selection.getRange().getClosedNode();if(t&&t.className){var a="edui-faked-video"==t.className,o=t.className.indexOf("edui-upload-video")!=-1;if(a||o){$G("videoUrl").value=e=t.getAttribute("_url"),$G("videoWidth").value=t.width,$G("videoHeight").value=t.height;var r=domUtils.getComputedStyle(t,"float"),n=domUtils.getComputedStyle(t.parentNode,"text-align");i("center"===n?"center":r)}o&&(b=!0)}f(e)}()}function a(){dialog.onok=function(){$G("preview").innerHTML="";var e=n("tabHeads","tabSrc");switch(e){case"video":return o();case"videoSearch":return r("searchList");case"upload":return v()}},dialog.oncancel=function(){$G("preview").innerHTML=""}}function i(e){for(var t,a=$G("videoFloat").children,i=0;t=a[i++];)t.getAttribute("name")==e?"focus"!=t.className&&(t.className="focus"):"focus"==t.className&&(t.className="")}function o(){var e=$G("videoWidth"),t=$G("videoHeight"),a=$G("videoUrl").value,i=n("videoFloat","name");return!!a&&(!!l([e,t])&&void editor.execCommand("insertvideo",{url:s(a),width:e.value,height:t.value,align:i},b?"upload":null))}function r(e){for(var t,a=domUtils.getElementsByTagName($G(e),"img"),i=[],o=0;t=a[o++];)t.getAttribute("selected")&&i.push({url:t.getAttribute("ue_video_url"),width:420,height:280,align:"none"});editor.execCommand("insertvideo",i)}function n(e,t){for(var a,i,o=$G(e).children,r=0;i=o[r++];)if("focus"==i.className){a=i.getAttribute(t);break}return a}function s(e){return e?e=utils.trim(e).replace(/v\.youku\.com\/v_show\/id_([\w\-=]+)\.html/i,"player.youku.com/player.php/sid/$1/v.swf").replace(/(www\.)?youtube\.com\/watch\?v=([\w\-]+)/i,"www.youtube.com/v/$2").replace(/youtu.be\/(\w+)$/i,"www.youtube.com/v/$1").replace(/v\.ku6\.com\/.+\/([\w\.]+)\.html.*$/i,"player.ku6.com/refer/$1/v.swf").replace(/www\.56\.com\/u\d+\/v_([\w\-]+)\.html/i,"player.56.com/v_$1.swf").replace(/www.56.com\/w\d+\/play_album\-aid\-\d+_vid\-([^.]+)\.html/i,"player.56.com/v_$1.swf").replace(/v\.pps\.tv\/play_([\w]+)\.html.*$/i,"player.pps.tv/player/sid/$1/v.swf").replace(/www\.letv\.com\/ptv\/vplay\/([\d]+)\.html.*$/i,"i7.imgs.letv.com/player/swfPlayer.swf?id=$1&autoplay=0").replace(/www\.tudou\.com\/programs\/view\/([\w\-]+)\/?/i,"www.tudou.com/v/$1").replace(/v\.qq\.com\/cover\/[\w]+\/[\w]+\/([\w]+)\.html/i,"static.video.qq.com/TPout.swf?vid=$1").replace(/v\.qq\.com\/.+[\?\&]vid=([^&]+).*$/i,"static.video.qq.com/TPout.swf?vid=$1").replace(/my\.tv\.sohu\.com\/[\w]+\/[\d]+\/([\d]+)\.shtml.*$/i,"share.vrs.sohu.com/my/v.swf&id=$1"):""}function l(e){for(var t,a=0;t=e[a++];){var i=t.value;if(!d(i)&&i)return alert(lang.numError),t.value="",t.focus(),!1}return!0}function d(e){return/(0|^[1-9]\d*$)/.test(e)}function u(e){for(var t,a=0;t=e[a++];){var i=$G(t),o={none:lang.default,left:lang.floatLeft,right:lang.floatRight,center:lang.block};for(var r in o){var n=document.createElement("div");n.setAttribute("name",r),"none"==r&&(n.className="focus"),n.style.cssText="background:url(images/"+r+"_focus.jpg);",n.setAttribute("title",o[r]),i.appendChild(n)}c(t)}}function c(e){for(var t,a=$G(e).children,i=0;t=a[i++];)domUtils.on(t,"click",function(){for(var e,t=0;e=a[t++];)e.className="",e.removeAttribute&&e.removeAttribute("class");this.className="focus"})}function p(e){browser.ie?e.onpropertychange=function(){f(this.value)}:e.addEventListener("input",function(){f(this.value)},!1)}function f(e){if(e){var t=s(e);$G("preview").innerHTML='<div class="previewMsg"><span>'+lang.urlError+'</span></div><embed class="previewVideo" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" src="'+t+'" width="420" height="280" wmode="transparent" play="true" loop="false" menu="false" allowscriptaccess="never" allowfullscreen="true" ></embed>'}}function v(){var e=[],t=editor.getOpt("videoUrlPrefix"),a=$G("upload_width").value||420,i=$G("upload_height").value||280,o=n("upload_alignment","name")||"none";for(var r in w){var s=w[r];e.push({url:t+s.url,width:a,height:i,align:o})}var l=h.getQueueCount();return l?($(".info","#queueList").html('<span style="color:red;">'+"还有2个未上传文件".replace(/[\d]/,l)+"</span>"),!1):void editor.execCommand("insertvideo",e,"upload")}function m(){h=new g("queueList")}function g(e){this.$wrap=e.constructor==String?$("#"+e):$(e),this.init()}var h,w=[],b=!1;window.onload=function(){$focus($G("videoUrl")),e(),t(),m()},g.prototype={init:function(){this.fileList=[],this.initContainer(),this.initUploader()},initContainer:function(){this.$queue=this.$wrap.find(".filelist")},initUploader:function(){function e(e){var t=s('<li id="'+e.id+'"><p class="title">'+e.name+'</p><p class="imgWrap"></p><p class="progress"><span></span></p></li>'),a=s('<div class="file-panel"><span class="cancel">'+lang.uploadDelete+'</span><span class="rotateRight">'+lang.uploadTurnRight+'</span><span class="rotateLeft">'+lang.uploadTurnLeft+"</span></div>").appendTo(t),i=t.find("p.progress span"),o=t.find("p.imgWrap"),n=s('<p class="error"></p>').hide().appendTo(t),l=function(e){switch(e){case"exceed_size":text=lang.errorExceedSize;break;case"interrupt":text=lang.errorInterrupt;break;case"http":text=lang.errorHttp;break;case"not_allow_type":text=lang.errorFileType;break;default:text=lang.errorUploadRetry}n.text(text).show()};"invalid"===e.getStatus()?l(e.statusText):(o.text(lang.uploadPreview),"|png|jpg|jpeg|bmp|gif|".indexOf("|"+e.ext.toLowerCase()+"|")==-1?o.empty().addClass("notimage").append('<i class="file-preview file-type-'+e.ext.toLowerCase()+'"></i><span class="file-title">'+e.name+"</span>"):browser.ie&&browser.version<=7?o.text(lang.uploadNoPreview):r.makeThumb(e,function(e,t){if(e||!t||/^data:/.test(t)&&browser.ie&&browser.version<=7)o.text(lang.uploadNoPreview);else{var a=s('<img src="'+t+'">');o.empty().append(a),a.on("error",function(){o.text(lang.uploadNoPreview)})}},y,$),x[e.id]=[e.size,0],e.rotation=0,e.ext&&N.indexOf(e.ext.toLowerCase())!=-1||(l("not_allow_type"),r.removeFile(e))),e.on("statuschange",function(o,r){"progress"===r?i.hide().width(0):"queued"===r&&(t.off("mouseenter mouseleave"),a.remove()),"error"===o||"invalid"===o?(l(e.statusText),x[e.id][1]=1):"interrupt"===o?l("interrupt"):"queued"===o?x[e.id][1]=0:"progress"===o&&(n.hide(),i.css("display","block")),t.removeClass("state-"+r).addClass("state-"+o)}),t.on("mouseenter",function(){a.stop().animate({height:30})}),t.on("mouseleave",function(){a.stop().animate({height:0})}),a.on("click","span",function(){var t,a=s(this).index();switch(a){case 0:return void r.removeFile(e);case 1:e.rotation+=90;break;case 2:e.rotation-=90}k?(t="rotate("+e.rotation+"deg)",o.css({"-webkit-transform":t,"-mos-transform":t,"-o-transform":t,transform:t})):o.css("filter","progid:DXImageTransform.Microsoft.BasicImage(rotation="+~~(e.rotation/90%4+4)%4+")")}),t.insertBefore(f)}function t(e){var t=s("#"+e.id);delete x[e.id],a(),t.off().find(".file-panel").off().end().remove()}function a(){var e,t=0,a=0,i=m.children();s.each(x,function(e,i){a+=i[0],t+=i[0]*i[1]}),e=a?t/a:0,i.eq(0).text(Math.round(100*e)+"%"),i.eq(1).css("width",Math.round(100*e)+"%"),o()}function i(e,t){if(e!=C){var a=r.getStats();switch(p.removeClass("state-"+C),p.addClass("state-"+e),e){case"pedding":d.addClass("element-invisible"),u.addClass("element-invisible"),v.removeClass("element-invisible"),m.hide(),c.hide(),r.refresh();break;case"ready":v.addClass("element-invisible"),d.removeClass("element-invisible"),u.removeClass("element-invisible"),m.hide(),c.show(),p.text(lang.uploadStart),r.refresh();break;case"uploading":m.show(),c.hide(),p.text(lang.uploadPause);break;case"paused":m.show(),c.hide(),p.text(lang.uploadContinue);break;case"confirm":if(m.show(),c.hide(),p.text(lang.uploadStart),a=r.getStats(),a.successNum&&!a.uploadFailNum)return void i("finish");break;case"finish":m.hide(),c.show(),a.uploadFailNum?p.text(lang.uploadRetry):p.text(lang.uploadStart)}C=e,o()}n.getQueueCount()?p.removeClass("disabled"):p.addClass("disabled")}function o(){var e,t="";"ready"===C?t=lang.updateStatusReady.replace("_",g).replace("_KB",WebUploader.formatSize(h)):"confirm"===C?(e=r.getStats(),e.uploadFailNum&&(t=lang.updateStatusConfirm.replace("_",e.successNum).replace("_",e.successNum))):(e=r.getStats(),t=lang.updateStatusFinish.replace("_",g).replace("_KB",WebUploader.formatSize(h)).replace("_",e.successNum),e.uploadFailNum&&(t+=lang.updateStatusError.replace("_",e.uploadFailNum))),c.html(t)}var r,n=this,s=jQuery,l=n.$wrap,d=l.find(".filelist"),u=l.find(".statusBar"),c=u.find(".info"),p=l.find(".uploadBtn"),f=(l.find(".filePickerBtn"),l.find(".filePickerBlock")),v=l.find(".placeholder"),m=u.find(".progress").hide(),g=0,h=0,b=window.devicePixelRatio||1,y=113*b,$=113*b,C="",x={},k=function(){var e=document.createElement("p").style,t="transition"in e||"WebkitTransition"in e||"MozTransition"in e||"msTransition"in e||"OTransition"in e;return e=null,t}(),_=editor.getActionUrl(editor.getOpt("videoActionName")),S=editor.getOpt("videoMaxSize"),N=(editor.getOpt("videoAllowFiles")||[]).join("").replace(/\./g,",").replace(/^[,]/,"");return WebUploader.Uploader.support()?editor.getOpt("videoActionName")?(r=n.uploader=WebUploader.create({pick:{id:"#filePickerReady",label:lang.uploadSelectFile},swf:"../../third-party/webuploader/Uploader.swf",server:_,fileVal:editor.getOpt("videoFieldName"),duplicate:!0,fileSingleSizeLimit:S,compress:!1}),r.addButton({id:"#filePickerBlock"}),r.addButton({id:"#filePickerBtn",label:lang.uploadAddFile}),i("pedding"),r.on("fileQueued",function(t){g++,h+=t.size,1===g&&(v.addClass("element-invisible"),u.show()),e(t)}),r.on("fileDequeued",function(e){g--,h-=e.size,t(e),a()}),r.on("filesQueued",function(e){r.isInProgress()||"pedding"!=C&&"finish"!=C&&"confirm"!=C&&"ready"!=C||i("ready"),a()}),r.on("all",function(e,t){switch(e){case"uploadFinished":i("confirm",t);break;case"startUpload":var a=utils.serializeParam(editor.queryCommandValue("serverparam"))||"",o=utils.formatUrl(_+(_.indexOf("?")==-1?"?":"&")+"encode=utf-8&"+a);r.option("server",o),i("uploading",t);break;case"stopUpload":i("paused",t)}}),r.on("uploadBeforeSend",function(e,t,a){a.X_Requested_With="XMLHttpRequest"}),r.on("uploadProgress",function(e,t){var i=s("#"+e.id),o=i.find(".progress span");o.css("width",100*t+"%"),x[e.id][1]=t,a()}),r.on("uploadSuccess",function(e,t){var a=s("#"+e.id);try{var i=t._raw||t,o=utils.str2json(i);"SUCCESS"==o.state?(w.push({url:o.url,type:o.type,original:o.original}),a.append('<span class="success"></span>')):a.find(".error").text(o.state).show()}catch(e){a.find(".error").text(lang.errorServerUpload).show()}}),r.on("uploadError",function(e,t){}),r.on("error",function(t,a){"Q_TYPE_DENIED"!=t&&"F_EXCEED_SIZE"!=t||e(a)}),r.on("uploadComplete",function(e,t){}),p.on("click",function(){return!s(this).hasClass("disabled")&&void("ready"===C?r.upload():"paused"===C?r.upload():"uploading"===C&&r.stop())}),p.addClass("state-"+C),void a()):void s("#filePickerReady").after(s("<div>").html(lang.errorLoadConfig)).hide():void s("#filePickerReady").after(s("<div>").html(lang.errorNotSupport)).hide()},getQueueCount:function(){var e,t,a,i=0,o=this.uploader.getFiles();for(t=0;e=o[t++];)a=e.getStatus(),"queued"!=a&&"uploading"!=a&&"progress"!=a||i++;return i},refresh:function(){this.uploader.refresh()}}}();