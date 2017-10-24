/**
 * Created by 30818 on 2017/7/2.
 */
module.exports = (function () {

    "use strict";

    //http协议模块
    var http = require('http');
    //url解析模块
    var url = require('url');
    //文件系统模块
    var fs = require("fs");
    //路径解析模块
    var path = require("path");
    var config = require("./config");
    var multiparty = require('multiparty');
    const querystring = require('querystring');

    var hasExt = true;


    /**
     * 获取文档的内容类型
     * @param filePath
     * @returns {*}
     */
    function getContentType(filePath) {
        var contentType = config.mime;
        var ext = path.extname(filePath).substr(1);
        if (contentType.hasOwnProperty(ext)) {
            return contentType[ext];
        } else {
            return contentType.default;
        }
    }

    function saveInfile(filepath, fdata,endTag) {
        //var flag = Math.floor(Math.random() * 10000);
        filepath = filepath + "#" + endTag + ".json";
        fs.open(filepath, 'wx', function (err, data) {
            if (err) {
                if (err.code === 'EEXIST') {
                    console.error('myfile already exists');
                    return;
                }
                throw err;
            }
            fs.writeFile(filepath, fdata, function (err) {
                if (err) {
                    console.log("写入文件失败");
                    throw err;
                }
                console.log("写入文件成功：" + filepath);
            });
        });


    }

    return {
        RequestFile: function (request, response) {
            var requestUrl = request.url;
            var pathName = url.parse(requestUrl).pathname;
            //对请求的路径进行解码，防止中文乱码
            pathName = decodeURI(pathName);
            //如果路径中没有扩展名
            if (path.extname(pathName) === '') {
                //如果不是以/结尾的，加/并作301重定向
                if (pathName.charAt(pathName.length - 1) != "/") {
                    pathName += "/";
                    var redirect = "http://" + request.headers.host + pathName;
                    response.writeHead(301, {
                        location: redirect
                    });
                    response.end();
                }
                //添加默认的访问页面,但这个页面不一定存在,后面会处理
                pathName += "index.html";
                hasExt = false; //标记默认页面是程序自动添加的
            }
            //获取资源文件的相对路径
            var filePath = path.join("http/webroot", pathName);
            //获取对应文件的文档类型
            var contentType = getContentType(filePath);
            //如果文件名存在
            fs.exists(filePath, function (exists) {
                if (exists) {
                    response.writeHead(200, {"content-type": contentType});
                    var stream = fs.createReadStream(filePath, {flags: "r", encoding: null});
                    stream.on("error", function () {
                        response.writeHead(500, {"content-type": "text/html"});
                        response.end("<h1>500 Server Error</h1>");
                    });
                    //返回文件内容
                    stream.pipe(response);
                } else { //文件名不存在的情况
                    if (hasExt) {
                        //如果这个文件不是程序自动添加的，直接返回404
                        response.writeHead(404, {"content-type": "text/html"});
                        response.end("<h1>404 Not Found</h1>");
                    } else {
                        //如果文件是程序自动添加的且不存在，则表示用户希望访问的是该目录下的文件列表
                        var html = "<head><meta charset='utf-8'></head>";

                        try {
                            //用户访问目录
                            var filedir = filePath.substring(0, filePath.lastIndexOf('\\'));
                            //获取用户访问路径下的文件列表
                            var files = fs.readdirSync(filedir);
                            //将访问路径下的所以文件一一列举出来，并添加超链接，以便用户进一步访问
                            for (var i in files) {
                                var filename = files[i];
                                html += "<div><a  href='" + filename + "'>" + filename + "</a></div>";
                            }
                        } catch (e) {
                            html += "<h1>您访问的目录不存在</h1>"
                        }
                        response.writeHead(200, {
                            "content-type": "text/html",
                            "Access-Control-Allow-Origin": "http://localhost"
                        });
                        response.end(html);
                    }
                }
            });
        },
        AJAX_GET: function (request, response) {
            var rdata = url.parse(request.url, true).query;   //获取参数
            console.log(JSON.stringify(rdata));
            response.writeHead(200, {"content-type": "application/json"});
            response.end(JSON.stringify(rdata));

        },
        AJAX_POST: function (request, response) {
            var form = new multiparty.Form();
            form.parse(request, function (err, fields, files) {
                if (err) {
                    console.log("err:" + err);
                }
                console.log(request.url);
                console.log("收到POST数据:");
                var JSON_data={};
                for (var i in fields) {
                    JSON_data[i+""]=fields[i]+"";
                }
               console.log(JSON_data);
                //----------到此拿到POST的数据，以JSON的形式存入JSON_data中
                switch (request.url) {
                    case "/submitArticle":
                        if (JSON_data["author"] !== "dgl") {
                            response.writeHead(201, {"content-type": "text/html"});
                            response.end("该作者没有权限！");
                            console.log("无权限，拒绝请求！");
                            return;
                        }//核实权限！
                        response.writeHead(200, {"content-type": "application/json"});
                        response.end(JSON.stringify(JSON_data));
                        var myDate = new Date();
                        var filepath = "http/webroot/blog/articles/" + myDate.toLocaleDateString();
                        console.log("上传写入文章输入:"+JSON.stringify(JSON_data));
                        var timeTag=10000+myDate.getHours()*3600+myDate.getMinutes()*60+myDate.getSeconds();
                        saveInfile(filepath,JSON.stringify(JSON_data),timeTag);
                        console.log("文章数据上传成功！");
                        break;
                    case "/getArticles":
                        var fileDatas = {};
                        console.log(JSON_data);
                        //console.log(stringData);
                        var boxLength = Number(JSON_data["boxLength"]);
                        var articlesFiles = fs.readdirSync("http/webroot/blog/articles/");//获取文章路径
                        articlesFiles = articlesFiles.reverse();
                        var flag = 0;
                        while (boxLength < articlesFiles.length) {
                            console.log(boxLength);
                            //console.log(articlesFiles[boxLength-1]);
                            boxLength += 1;
                            if (flag === 6) {
                                break;
                            } else {
                                flag += 1;
                                //console.log(articlesFiles[fileLength-1]);
                                var fd = fs.readFileSync("http/webroot/blog/articles/" + articlesFiles[boxLength - 1], 'utf-8');
                                fd = fd.slice(fd.indexOf("{"), fd.indexOf("}") + 1);
                                //console.log(fd);
                                fileDatas[boxLength - 1 + ""] = JSON.parse(fd);
                            }
                        }

                        response.writeHead(200, {"content-type": "text/html"});
                        response.end(JSON.stringify(fileDatas));

                        //console.log(fileDatas);
                        console.log("文章发送成功！");
                        break;
                    default:
                        console.log("none url");
                        break;
                }


            });
        }

    }
})();