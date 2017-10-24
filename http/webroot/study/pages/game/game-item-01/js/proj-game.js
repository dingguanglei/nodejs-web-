/**
 * Created by 丁光磊local on 2016/9/24.
 */
$(document).ready(function () {
    initialPic();

    $('body').autoBackgroundScroll({
        direction1:"bottom",
        direction2:"right",
        imageWidth:"100%"
    });
});

function initialPic() {
    $("#restart").on("click",resetGame);
    var allBox= $(".box");
    allBox.css("background-color", "gray");
    allBox.find("img").hide().attr("opacity",1);
    allBox.css("border", "1px gold solid");
    var randomArryIndex= randomArrayIndex(allBox.length);//生成随机序列
    var src=[
        "1.jpg","1.jpg",
        "2.jpg","2.jpg",
        "3.jpg","3.jpg",
        "4.jpg","4.jpg",
        "5.jpg","5.jpg",
        "6.jpg","6.jpg"
    ];
    for(var i=0;i<allBox.length;i++) {
        var j=randomArryIndex[i];
        allBox.find("img")[j].setAttribute("src","image/gamebox/"+src[i]);
    }  //随机存入图片SRC
    allBox.off();
    allBox.one("click",showPic);
    firstBox = 0;
    secondBox = 1;
    count = 0;
    timer=false;
}
function randomArrayIndex(boxLength){
    var arr=[];
    for(var i=0;i<boxLength;i++){
        arr[i]=i;
    }
    arr.sort(function(){ return 0.5 - Math.random() });
    return arr;
}

function showPic() {
    if(!timer){
        timer=true;
        timeID=setInterval(setTimer,100);
    }   //计时开始
    $(this).find("img").fadeTo(200,1);// 图片专用
    if (firstBox == 0) {
        firstBox = $(this);             ///////////////////
    }     //保存两次点击的盒子
    else {
        secondBox = $(this);           /////////////////////
        judge();
    }
}
function recoverPic(box) {
    box.find("img").fadeTo(200,0);
    box.one("click", showPic);
}
function judge() {
    var box1=firstBox;
    var box2=secondBox;
    var box1_Img=box1.find("img");
    var box2_Img=box2.find("img");
    if(box1_Img.attr("src")===box2_Img.attr("src")&&box1 != 0){
        // alert("成功消除");
        box1_Img.fadeTo(100,0.5);
        box2_Img.fadeTo(100,0.5);
        count++;
        isEnd();//判断是否游戏胜利
    }
    else {
        //alert("消除失败");
        setTimeout(function () {
            recoverPic(box1);
            recoverPic(box2);
        },300);
    }
    firstBox = 0;
    secondBox = 1;
}
function isEnd() {
    var box = $(".box");
    if (count == box.length / 2) {
        box.fadeOut("1000",function () {
            $(".gameEnd").attr("src","image/victory.jpg").show();
        });
        return true; //如果游戏胜利 返回 ture
    }
    return false;      //游戏没有胜利 返回false
}
function gameOver(){
    var box = $(".box");
    box.fadeOut("1000",function () {
        $(".gameEnd").attr("src","image/fail.jpg").show();
    });
}//游戏失败，显示失败画面
function resetGame(){
    clearInterval(timeID);
    $(".gameEnd").hide();
    initialPic();
    $("#time").html(20);
    $(".box").show();
}

function setTimer(){

var time=$("#time").html();
    // console.log(time);
    if(time==0) {
        gameOver();   //如果时间为0则失败
        return;
    }
    else {
        var flag = isEnd();
        if (flag)return; //如果游戏结束了，直接停止计时器 返回
        time -= 0.1;
        time = time.toFixed(1);
        $("#time").html(time);
    }
}



