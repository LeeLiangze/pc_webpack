/*
*   @author:fanyu
*   @date：2015-12-04
*   @desc: 客服弹窗
*/
define(function () {
    var pop = function(options){
        var self = this;
        var o = self.o = $.extend({
            container:document.body,
            content:'',
            attr:null,
            dataType:'html',
            action:'hover',
            initCall:null
        },options);
        // self.isMsie = $.browser.msie && parseInt($.browser.version,10)<8;
                
        var warpStr = '<div class="popLayoutWaep"><div class="popContRight"><div class="popLayout"></div></div><div class="popBotL"><div class="popBotR"><div class="popBotC"></div></div></div></div>';
        var $warp = $(warpStr).appendTo(document.body);
        $warp.attr(o.attr||'');
        var $popc = $warp.find(".popLayout");
        var $T = $(o.container);
        var warpWidth = 0;
        var over = self.over = function(e){
            e.stopPropagation();
            e.preventDefault();
            var offset = $T.offset();
            var top = offset.top + $T.innerHeight() - 2;
            var w = $warp.width();
            // var left = offset.left-w+$T.outerWidth();
            var left = offset.left;
            var Tw = $T.innerWidth(true);
            var Mw = $(document.body).innerWidth();
            if (!warpWidth){
                warpWidth = $warp.width();
            }
            if (w+left > Mw){
                left = Mw - warpWidth;
            }
            //if(w < Mw && (w + left) > Mw){
                //left = (left + Tw) - w;
                
                //$warp.addClass("rightPos");
            //}else{
            //    $warp.removeClass("rightPos");
            //}
            $warp.css({
                left:left + "px",
                top:top + "px"
            }).show();
            $T.addClass("hover");
            /*if($.browser.msie && parseInt($.browser.version,10) < 8){
                $("#content").css({
                    "position":"relative",
                    "z-index":"1"   
                });
            }*/
        }
        var out = self.out = function(e){
            e.stopPropagation();
            /*IE鼠标飘过跳动两次处理**woo 2013-05-07*******************************************************/
            /*if(self.isMsie){
                var toEle = $(e.toElement);
                var isThis = false;
                if(toEle.hasClass("popLayoutWaep")){
                    isThis = true;
                }else if(toEle.parents(".popLayoutWaep").length>0){
                    isThis = true;
                }else if(toEle.hasClass(self.o.action)){
                    isThis = true;
                }else if(toEle.parents(self.o.action).length>0){
                    isThis = true;
                }
                if(isThis){
                    return;
                }
            }*/
            /****************************************************************************/
            // $warp.hide();
            $T.removeClass("hover");
            /*if($.browser.msie && parseInt($.browser.version,10) < 8){
                $("#content").css({
                    "position":"static",
                    "z-index":"1"   
                });
            }   */  
        }
        if(o.action == "click"){
            $T.click(function(e){
                if($(this).hasClass("hover")){                  
                    out(e);
                }else{
                    over(e);
                }   
            });
        }else{
            $T.bind("mouseenter.popLayout",over).bind("mouseleave.popLayout",out);
        }
        $warp.bind("mouseenter.popLayout",over).bind("mouseleave.popLayout",out);
        o.initCall && typeof o.initCall == "function" && self.callbacks["init"].add();
        $popc.html(o.content);
        // if(o.dataType == "html"){
        //     $popc.html(o.content);      
        //     o.initCall && typeof o.initCall == "function" && o.initCall.call(self);
        // }else if(o.dataType == "url"){
        //     $popc.load(o.content,function(){
        //         o.initCall && typeof o.initCall == "function" && o.initCall.call(self); 
        //     })          
        // }
        this.$el = $warp;
    };
    return pop;
});