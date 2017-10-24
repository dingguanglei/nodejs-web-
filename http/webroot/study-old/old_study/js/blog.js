
/**
 * Created by 丁光磊local on 2016/9/30.
 */

$(document).ready(function () {
    initialBtn();
    initialStorage();
});

function initialBtn() {
    $("#btnPublish").on("click",publish);
    $("#btnClose").on("click",unPublish);
    $("#btnPublishClearNow").on("click",clear);
    $("#btnPublishNow").on("click",publishNow);
}
function initialStorage(){
    console.log(localStorage.length);
}
function clear() {
    $("#publishContent").find("textarea").val("");
    $("#publishContent").find("input").val("");
}
function publish() {
    $(".publish").fadeIn(300);
}
function unPublish() {
    $(".publish").fadeOut(300);
}
function publishNow(){
    var publishContent=$("#publishContent");
    var publishContentTitle= publishContent.find("input").val();
    var publishContentArticle= publishContent.find("textarea").val();
    if(publishContentTitle!=null)
    {
        localStorage[publishContentTitle]=publishContentArticle;
        showStorage();
    }
}
function showStorage(){
    for(var i=0;i<localStorage.length;i++){
        //key(i)获得相应的键，再用getItem()方法获得对应的值
        console.log(localStorage.key(i)+ " : " + localStorage.getItem(localStorage.key(i)) + "<br>");
    }
}