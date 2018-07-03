define(['Util'], function(Util){

    var objClass = function(options){
        this.options = options;

        var dialogConfig = $.extend({
            //title:options.title,
            content:'',
            // ok:function(){ },
            // okValue: '关闭',
            width:600,height:400,
            modal:1,
            onremove:$.proxy(function(){
                this.dialog = null;
            },this),
            onclose:$.proxy(function (e) {
                this.dialog.remove();
            },this)
        }, _.pick(options, ['title','width','height','ok','okValue','modal']));
        this.dialog = Util.dialog.openDiv(dialogConfig);
        this.$el = $('.ui-dialog-content',this.dialog.node);

        if( new RegExp("^(http(s|)://)").test(options.url)){
            options.isFrame = true;
        }
        if(options.isFrame){
            this.$el.empty();
            /*启用iframe模式*/
            this.iframe=$("<iframe frameBorder='0' scrolling='auto' style='display:block; width:100%; height:100%;'></iframe>").appendTo(this.$el);
            try{
                this.iframe.attr("src",options.url);
            } catch(e){}
        }else{
            // requirejs模式
            var dialog = require.context('../dialog/', true);
            require(['../dialog/' + options.url], $.proxy(function(objClass){
                //这段逻辑支撑了所返回的各种模块定义 
                var self = this.$el;
                if (typeof(objClass) === 'function'){
                    var result = new objClass(this.options.index || {}, this.options.businessOptions);
                    if (typeof(result) === 'object'){
                        if (result.hasOwnProperty('content')){
                            self.empty().append(result.content);
                        }else{
                            self.empty().append(result);
                        }
                    }else{
                        self.html(result);
                    }
                }else{
                    self.html(objClass.content);
                }
                //this.$el.append(module.$el);
            },this));
        }
    }

    return objClass;
});

