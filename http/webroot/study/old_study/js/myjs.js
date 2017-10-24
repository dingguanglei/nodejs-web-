/**
 * Created by 丁光磊local on 2016/9/24.
 */
$(document).ready(function () {
    // var box = $(".box");
    initialColor();

})

function initialColor() {
    $("#restart").on("click",resetGame);
    var allBox= $(".box");
    allBox.css("background-color", "gray");
    var randomArryIndex= randomArrayIndex(allBox.length);
    console.log(randomArryIndex);
    var color=[
        "red","red",
        "blue", "blue",
        "black","black",
        "white","white",
        "green","green",
        "yellow","yellow"
    ];
    for(var i=0;i<allBox.length;i++) {
        var j=randomArryIndex[i];
        console.log(j);
      allBox[j].setAttribute("data-color",color[i]);
        console.log(allBox[j].getAttribute("data-color"));
    }
    allBox.off();
    allBox.one("click",showColor);
    firstBox = 0;
    secondBox = 1;
    count = 0;
}
function randomArrayIndex(boxLength){
    var arr=[];
    for(var i=0;i<boxLength;i++){
        arr[i]=i;
    }
    arr.sort(function(){ return 0.5 - Math.random() });
    return arr;
}

function showColor() {
    var color = $(this).attr("data-color");
    $(this).css("background-color", color);

    if (firstBox == 0) {
        firstBox = this;
    }
    else {
        secondBox = this;
        judge();
    }

}

function recoverColor(box) {
    $(box).css("background-color", "gray");
    $(box).one("click", showColor);
}
function judge() {
    if (firstBox.getAttribute("data-color") === secondBox.getAttribute("data-color") && firstBox != 0) {
        // alert("成功消除");
        count++;
        isEnd();
    }
    else {
        alert("消除失败");
        // setTimeout("alert('123');",1000);
        recoverColor(firstBox);
        recoverColor(secondBox);
    }
    firstBox = 0;
    secondBox = 1;

}
function isEnd() {
    var box = $(".box");
    if (count == box.length / 2) {
    // if (count == 1) {
        box.fadeOut("1000",function () {
            $(".gameEnd").show();
        });
    }
}

function resetGame(){
    $(".gameEnd").hide();
    initialColor();
    // initialColor();
    $(".box").show();
    console.log($(".box"));
}

