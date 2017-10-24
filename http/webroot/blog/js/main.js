/**
 * Created by 丁光磊local on 2016/11/15.
 */
var colorIndex = 0;
var getArticlesFlag = true;
var xhrArticleFlag=true;
(function () {
    Date.prototype.format = function (format) {
        var date = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S+": this.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in date) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
            }
        }
        return format;
    }
})();
document.addEventListener("scroll", function () {
    //  console.log(window.scrollY);
    var scrollBottom = document.body.clientHeight - window.scrollY - window.innerHeight;
    // console.log(document.body.clientHeight-window.scrollY-window.innerHeight);
    if (xhrArticleFlag&&getArticlesFlag && scrollBottom < 100) {
        getArticles();
    }
});
window.onload = function () {


    setInterval(changeColor, 1000);
    var menu_section = document.getElementById("icon-menu");
    menu_section.onclick = menuToggle;
    classifyBtnInitial();

    var btnWriteArticle = document.getElementsByClassName("btn-writeArticle")[0];
    btnWriteArticle.onclick = showWriteNewArticle;

    var btnSubmit = document.getElementById("submiter");
    btnSubmit.onclick = submit;

    var legend = document.getElementById("newArticleForm");
    var mc = new Hammer(legend);
    mc.on("swiperight", function (ev) {
        showWriteNewArticle();
    });

    var a = document.getElementsByTagName("a");
    for (var i = 0; i < a.length; i++) {
        a[i].onselectstart = function () {
            return false;
        }
    }
    getArticles();
};

function getArticles() {
    xhrArticleFlag=false;
    var xhr = new XMLHttpRequest();
    var num_content_box = document.getElementsByClassName("content-box");
    var boxLength = num_content_box.length;
    var footer_final = document.getElementById("footer-final-label");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
               // boxLength+=5;
                var JSON_article = JSON.parse(xhr.responseText);
                if (xhr.responseText !== "{}") {
                    while (JSON_article[boxLength]) {
                        var item_obj = JSON_article[boxLength];
                        console.log( item_obj.time);
                        creatContentBox(item_obj.title, item_obj.content, item_obj.type, 19-boxLength, item_obj.time);
                        boxLength += 1;
                        footer_final.innerHTML = "正在加载更多内容。。。";
                        xhrArticleFlag=true;
                    }
                }
                else {
                    getArticlesFlag = false;
                    footer_final.innerHTML = "没有新内容了！！！";
                }
            }
        }
    };
    xhr.open('post', '/getArticles', true);
    var form = new FormData();
    form.append("boxLength", boxLength);
    xhr.send(form);

}

function showWriteNewArticle() {
    var WriteArticle = document.getElementById("newArticleForm");
    if (WriteArticle.style.right === "0px") {
        WriteArticle.style.right = "-30em";
    }
    else {
        WriteArticle.style.right = "0px";
    }
}

function submit() {
    // 1.创建一个FormData对象，直接把我们的表单传进去
    var form = document.getElementById("newArticleForm");
    var formData = new FormData(form);
    var date = new Date();
    date.format('yyyy/MM/dd hh:mm:ss');
    formData.append("time", date.format('yyyy/MM/dd hh:mm:ss'));

    // 2.创建一个http请求对象
    var xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.onload = function (oEvent) {
        if (xmlHttpRequest.status == 200) {
            var obj_json = xmlHttpRequest.responseText;
            console.log(JSON.parse(obj_json));
            alert('提交成功!!!！');
            showWriteNewArticle();


        } else if (xmlHttpRequest.status == 201) {
            var refused = xmlHttpRequest.responseText;
            alert(refused);
        }
        else {
            console.log("Error" + xmlHttpRequest.status);
        }
    };
    xmlHttpRequest.open('post', '/submitArticle');
    xmlHttpRequest.send(formData);
    event.preventDefault();
}

function creatContentBox(title, content, type, imgUrl, time) {
    var boxWrapper = document.getElementById("content-box-wrapper");
    imgUrl = "contentLeftImages/" + imgUrl + ".jpg";
    var IMG_pic_wrapper = document.createElement("img");

    if (imgUrl != -1) {
        IMG_pic_wrapper.setAttribute("data-original", imgUrl);
        IMG_pic_wrapper.setAttribute("src", "contentLeftImages/loading.gif");
        IMG_pic_wrapper.setAttribute("alt", imgUrl);
        $(function () {
            $("img").lazyload();
        });
        var IMG_pic_wrapper_JQ = $(IMG_pic_wrapper);
        IMG_pic_wrapper_JQ.lazyload();
    }

    var DIV_pic_wrapper = document.createElement("div");
    DIV_pic_wrapper.setAttribute("class", "pic-wrapper");
    DIV_pic_wrapper.appendChild(IMG_pic_wrapper);

    var H_content_header = document.createElement("h");
    H_content_header.innerHTML = title;
    H_content_header.setAttribute("class", "h1");
    var DIV_content_header = document.createElement("div");
    DIV_content_header.appendChild(H_content_header);
    DIV_content_header.setAttribute("class", "content-header");
    var P = document.createElement("p");
    P.innerHTML = content;
    var DIV_content_footer = document.createElement("div");
    DIV_content_footer.setAttribute("class", "content-footer");
    DIV_content_footer.innerHTML = time;

    var A_box = document.createElement("a");
    A_box.setAttribute("class", "shake-slow box box-color-" + type);
    A_box.setAttribute("href", "");
    A_box.appendChild(DIV_pic_wrapper);
    A_box.appendChild(DIV_content_header);
    A_box.appendChild(P);
    A_box.appendChild(DIV_content_footer);

    var DIV_content_box = document.createElement("div");
    DIV_content_box.setAttribute("class", "content-box");
    DIV_content_box.style.position="relative";
    DIV_content_box.style.top='20px';
    DIV_content_box.appendChild(A_box);

    boxWrapper.appendChild(DIV_content_box);
    setTimeout(function () {
        console.log(12312321321);

        DIV_content_box.style.top='0px';
    },200);
    //DIV_content_box.style.top='0px';



}

function changeColor() {
    var colors = [
        "C10066 ", "CC0000", "E63F00", "EE7700", "DDAA00", "EEEE00",
        "99DD00", "66DD00", "00DD00", "00DD77", "00DDAA", "00DDDD",
        "009FCC", "0044BB", "0000CC", "4400CC", "5500DD", "7700BB",
        "A500CC", "CC00CC"]; // the colors
    var logo = document.getElementById('logo');
    logo.style.color = "#" + colors[colorIndex];
    colorIndex = (colorIndex + 1) % colors.length;
}

function menuToggle() {
    var list = document.getElementById("icon-menu-list");
    var list_type = list.style.height;
    console.log(list_type);
    if (list_type !== "0px") {
        list.style.height = "0px";
    }
    else {
        list.style.height = "236px";
    }
    return false;
}

function classifyBtnInitial() {
    var allContentBoxes = document.getElementsByClassName("content-box");
    var allBtn = document.getElementById("classify-total");
    var musicBtn = document.getElementById("classify-music");
    var journalBtn = document.getElementById("classify-journal");
    var studyBtn = document.getElementById("classify-study");
    var processBtn = document.getElementById("classify-process");

    allBtn.onclick = function () {
        for (var contentBoxIndex = 0; contentBoxIndex < allContentBoxes.length; contentBoxIndex++) {
            allContentBoxes[contentBoxIndex].style.opacity = 1;
            active("classify-total");
            //allContentBoxes[contentBoxIndex].style.display="block";
        }
        active("classify-total");
        return false;
    };
    studyBtn.onclick = function () {
        showBoxes("box box-color-study");
        active("classify-study");
        return false;
    };
    musicBtn.onclick = function () {
        showBoxes("box box-color-music");
        active("classify-music");
        return false;
    };
    journalBtn.onclick = function () {
        showBoxes("box box-color-journal");
        active("classify-journal");
        return false;
    };
    processBtn.onclick = function () {
        showBoxes("box box-color-process");
        active("classify-process");
        return false;
    };

}

function showBoxes(styleClassName) {
    var allContentBoxes = document.getElementsByClassName("content-box"); //所有的内容box
    var styleContentBoxesChild = document.getElementsByClassName(styleClassName);   //选中类型的子元素
    for (var i = 0; i < allContentBoxes.length; i++) {
        var item = allContentBoxes[i];
        item.style.opacity = 0.2;
    }//隐藏所有box  opacity=0
    setTimeout(function () {
        // for (var i = 0; i < allContentBoxes.length; i++) {
        //     var item = allContentBoxes[i];
        //     item.style.display = "none";
        //
        // }
        for (i = 0; i < styleContentBoxesChild.length; i++) {
            item = styleContentBoxesChild[i].parentNode;
            item.style.opacity = 1;
        }//显示该类box
    }, 300);//隐藏所有box  display=none


}
function active(classify) {
    console.log(classify);
    var _this = document.getElementById(classify);
    var actived = document.getElementsByClassName("classify-active")[0];
    console.log(actived.className);
    var activedOrignalClassName = actived.className;

    actived.className = activedOrignalClassName.replace(" classify-active", "");
    console.log(actived.className);

    var originalClassName = _this.className;

    _this.className = originalClassName + " classiclassify-active";
}
