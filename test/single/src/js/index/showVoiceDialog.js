define(['dialog','voice'],function(Dialog,Voice){
    var objClass = function(options){
        this.options = options;
        var d = new dialog({
            title:this.options.title?this.options.title:'音频',
            content:''
        });
        var voice = new Voice({
            el:$('.ui-dialog-content',d.node),
            url:this.options.url
        });
        d.show();
    }
    return objClass;
})