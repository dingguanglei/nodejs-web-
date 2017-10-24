/**
 * Created by 丁光磊local on 2016/11/21.
 */
window.onload=function () {
    var footerDiv=document.getElementsByClassName("box-footer");
    for(var i=0;i<footerDiv.length;i++){
        var child=footerDiv[i].children[0];
        child.onclick=getFullArticle;
    }
};

function getFullArticle(){
    var self=this;
    var parentBox=self.parentNode.parentNode;
    var parentBoxClassName=parentBox.getAttribute("class");
    parentBoxClassName=parentBoxClassName.concat(" active");

    parentBox.setAttribute("class",parentBoxClassName);
    var allBox=document.getElementsByClassName("content-left-box");
    for(var i=0;i<allBox.length;i++){
        allBox[i].style.display="none";
    }
    var active=document.getElementsByClassName("active")[0];
    active.style.display="block";
    self.innerHTML="返回";
    self.onclick=getReturnCatalog;
}

function getReturnCatalog() {
    var self=this;
    var parentBox=self.parentNode.parentNode;
    var parentBoxClassName=parentBox.getAttribute("class");
    parentBoxClassName=parentBoxClassName.replace(" active","");
    parentBox.setAttribute("class",parentBoxClassName);
    var allBox=document.getElementsByClassName("content-left-box");
    for(var i=0;i<allBox.length;i++){
        allBox[i].style.display="block";
    }
    // var active=document.getElementsByClassName("active")[0];
    // active.style.display="block";
    self.innerHTML="阅读全文";
    self.onclick=getFullArticle;
    return false;
}