/**
 * Created by 丁光磊local on 2016/12/11.
 */

$(document).ready(
    function () {
        $("span.menu").click(function(){
            $(".top-nav-in ul").slideToggle(500, function(){
            });
        });
        $(".top-nav-in ul li a").click(function(){
            $(".top-nav-in ul").slideToggle(500,function () {
            });
        })

    }

);



$("#content").load(function(){
    var mainheight =$(this).contents().find("body").height()+30;
    $(this).height(mainheight);
});

$(window).resize(function(){
    var _this=$("#content");
    var thisheight = _this.contents().find("body").height()+30;
    console.log(thisheight);
    _this.height(thisheight < 700 ? 700 : thisheight);
});
