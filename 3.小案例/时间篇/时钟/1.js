function $(id)
{
	return document.getElementById(id);
}


var timer;
function showDate()
{
	var week = ["日","一","二","三","四","五","六"]
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var mydate = date.getDate(); 
	var myDay = date.getDay();
	$("currentDate").value = year + "年" + month + "月" + mydate + "日" + " 星期" + week[myDay];
	
	var hour = date.getHours()
	var am = hour>=12?"pm":"am";
    hour = hour>12?hour-12:hour;
	hour = hour<10?"0"+hour:""+hour;
	var minutes = date.getMinutes();
	minutes = minutes<10?"0"+minutes:""+minutes;
	var seconds = date.getSeconds();
	seconds = seconds<10?"0"+seconds:""+seconds;
	$("currentTime").value = am + " " + hour + "时 " + minutes + "分 " + seconds + " 秒";
}

function showTime()
{	
	timer = window.setInterval(showDate,1000);
}
