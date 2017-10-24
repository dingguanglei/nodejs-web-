/**
 * Created by 丁光磊local on 2016/9/30.
 */
$(document).ready(function () {
    btnInitial();
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
}//iframe 高度自适应

function btnInitial() {
    $("#container-window").attr("src", "pages/brief.html");
    $(".option").on("click", active);
    $(".dropdown-menu").find("li").on("click", active);
    $(document).off('click.bs.dropdown.data-api');//停用下拉菜单点击事件
    dropdownOpen();//调用 鼠标悬停展示下拉菜单
    //
    $(".authority").find(".btn-success").on("click", authorise);
}
 
function dropdownOpen() {
    var $dropdownLi = $('li.dropdown');
    $dropdownLi.mouseover(function () {
        $(this).addClass('open');
    }).mouseout(function () {
        $(this).removeClass('open');
    });
}//鼠标划过就展开子菜单，免得需要点击才能展开
function active() {
    $(".active").removeClass("active"); //静默激活元素
    $(this).addClass("active");         //激活当前点击元素
    // return false;
}
function authorise() {
    var REL_KEY = "003be2507cfad94f1efb32fe3fd0d0ec";
    var keyword = $(".authority").find(".keycode").val();
    var key = $.md5(keyword);
    if (key == REL_KEY) {
        // console.log(key);
        $(".authority").find(".before").hide();
        $(".authority").find(".after").show();
        $(".authority").find(".resume").show();
    }
    else {
        alert("授权码不正确!");
    }
}
