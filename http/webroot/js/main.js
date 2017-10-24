/**
 * Created by 丁光磊local on 2016/11/15.
 */
var colorIndex = 0;

window.onload = function () {
    setInterval(changeColor, 1000);
    var container = document.getElementById("wrapper");
    resetOpacity();
    setbgimg();

};
function setbgimg() {
    var myDate = new Date();
    var body = document.getElementsByTagName("body")[0];
    var hour = myDate.getHours();
    if (hour > 18 || hour < 6) {
        body.setAttribute("class", "night");
        document.getElementById("wrapper").style.background = "url(image/night.png) repeat-x top"
    } else {
        body.setAttribute("class", "day");
        document.getElementById("wrapper").style.background = "url(image/day.png) no-repeat top left"
    }
}
function resetOpacity() {
    var itemsBox = document.getElementsByClassName("option");
    var items = document.getElementById("wrapper").children;
    for (var i = 0; i < items.length; i++) {
        items[i].style.opacity = 1;
    }
    for (var i = 0; i < itemsBox.length; i++) {
        itemsBox[i].style.opacity = 1;
        itemsBox[i].style.top = 0;
    }
    document.getElementsByTagName("h1")[0].style.fontSize = "100px";
    document.getElementsByTagName("h3")[0].style.fontSize = "24px";
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
