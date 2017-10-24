/**
 * Created by 30818 on 2017/7/2.
 */
module.exports=(function () {

    //http协议模块
    var http = require('http');
    //url解析模块
    var url = require('url');
    var handle=require("./handle");


    return function (request,response) {
        var rdata  =  url.parse(request.url,true).query;   //获取参数
        if(JSON.stringify(rdata)!=="{}"&&!rdata.v){
            console.log("AJAX-GET");
            handle.AJAX_GET(request,response);
        }
        else if(request.method.toUpperCase()==="POST"){
            console.log("AJAX-POST");
            handle.AJAX_POST(request, response);
        }
        else{
            console.log("FILE");
            handle.RequestFile(request,response);
        }
    }
})();
