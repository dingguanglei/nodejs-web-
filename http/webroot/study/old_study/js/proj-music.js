/**
 * Created by 丁光磊local on 2016/10/10.
 */
$(document).ready(function(){
    window.setInterval("reinitIframe()", 200);
});

function reinitIframe(){
    var iframe = document.getElementById("container-window");
    // var iframe=$("#container-window");
    try{
        // var bHeight =iframe.contents().find("body").height();
        var bHeight = iframe.contentWindow.document.body.scrollHeight;
        var dHeight = iframe.contentWindow.document.documentElement.scrollHeight;
        var height = Math.max(bHeight, dHeight);
        // var height= bHeight;
        iframe.height = height;
        console.log(height);
    }catch (ex){}
}//iframe高度自适应
