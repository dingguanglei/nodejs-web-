module.exports = (function(){

    "use strict";

    console.time('[HttpServer][Start]');

    //http协议模块
    var http = require('http');
    //url解析模块
    var url = require('url');
    //文件系统模块
   // var fs = require("fs");
    //路径解析模块
    var path = require("path");
    var config=require("./config");
    var router=require("./router");


    return {
        //启动服务
        start:function(){
            //var port = this.config.port;
            //var ip = this.config.ip;
            var port=config.port;

            //创建一个服务
            var httpServer = http.createServer(this.processRequest.bind(this));
            //在指定的端口监听服务
            httpServer.listen(port,function(){
              //  console.log("[HttpServer][Start]","runing at http://"+ip+":"+port+"/");
                console.timeEnd("[HttpServer][Start]");
            });
            httpServer.on("error", function(error) {
                console.error(error);
            });
        },

        /**
         * 请求处理
         * @param request
         * @param response
         */
        processRequest:function(request,response){
            router(request,response);
        }

    }
})();