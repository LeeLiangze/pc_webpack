define([
        '../../tpl/clientInfo/clientBusiInfo.tpl'
    ],
    function(tpl) {
        var _indexModule = null;
        var $el;
        var initialize = function(index, options) {
            $el = $(tpl);
            var url = index.CTIInfo.defaultURL;
            var acceptNumber = options.acceptNumber;
            $el.find('iframe').attr("src", url);
            var $iframe = $el.find('iframe');
            $iframe.load(function() {
            if(RegExp("^0?(13|15|17|18|14)[0-9]{9}$").test(acceptNumber)){
                index.clientInfo.trigger("acceptNumberChange", acceptNumber);
            }
            });
            this.content = $el;
        };



        return initialize;
    });
