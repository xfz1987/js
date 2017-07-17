function start()
{
	//∫Ï«Ú
	var red = new Array();
	var i = 0;
	o:
	while(i<6){
		var p = RandomNumber(1,34)
		for(var n =0;n<red.length;n++){
			if(red[n] == p) 
			continue o;
		}
		red[i++] = p;
	}
	red.sort(Compare);
	var obj = document.getElementById("redBall");
	obj.innerHTML = red;
 	
	//¿∂«Ú
	var blue = RandomNumber(1,17);
	obj = document.getElementById("blueBall");
	obj.innerHTML = blue;
}
function RandomNumber(min,max)
{
	var r = Math.random();
	var n = Math.floor(r*(max-min))+min;
	return n;	
}
function Compare(a,b)
{
	return a-b;
}
