/**
 * Created by Administrator on 2015/8/11.
 */
var className = "tooltop-box";
function $(id){
  return document.getElementById(id);
}

var parentDiv = $("div");

function showToolTip(obj,id,html,width,height){
  if($(id) == null){
    var tooltipBox = document.createElement("div");
    tooltipBox.className = className;
    tooltipBox.id = id;
    tooltipBox.innerHTML = html;

    obj.appendChild(tooltipBox);

    //根据内容自适应宽度和高度
    tooltipBox.style.width = width? width+"px":"auto";
    tooltipBox.style.height = height?height+"px":"auto";

    tooltipBox.style.position = "absolute";
    tooltipBox.style.display = "block";
    tooltipBox.style.left =  obj.offsetLeft + "px";
    tooltipBox.style.top =  obj.offsetTop + 20 + "px";
    obj.addEventListener("mouseout",function(){
      setTimeout(function(){
        $(id).style.display = "none";
      },200);
    });
  }else{
    $(id).style.display = "block";
  }
}

parentDiv.addEventListener("mousemove",function(e){
  var target = e.target|| e.srcElement;
  if(target.className == "tooltip"){
    var _html,
        _id,
        _width;
    switch(target.id){
      case "weibo":
        _id = "wb";
        _html = "gaozifeng_88888";
        _width = 150;
        break;
      case "weixin":
        _id = "wx";
        _html = "gaozifeng";
        _width = 150;
        break;
      case "logo":
        _id = "lg";
        _html = "<img src='1.jpg'>";
        _width = 200;
        break;
      case "fengge":
        _id = "fg";
        _html = "<iframe src='http://www.sina.com' width='500' height='300'></iframe>";
        _width = 500;
        break;
    }
    showToolTip(target,_id,_html,_width);
  }
},false);
