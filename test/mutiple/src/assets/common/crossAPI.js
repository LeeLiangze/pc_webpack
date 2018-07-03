define(function (){
    if(window.name.indexOf("crossAPI")!=-1){
        return window.name
    }else{
        var returnUrl;
        if(document.referrer){
            var urlArr=document.referrer.split("//");
            returnUrl= urlArr[0]+"//"+urlArr[1].split("/")[0]+'/'+urlArr[1].split("/")[1].split("/")[0]+'/src/assets/common/crossAPI';
        }else{
            returnUrl= "https://192.168.100.36:8843/ngcs/src/assets/common/crossAPI"
        }
        window.name=returnUrl;
        return returnUrl;
    }
});