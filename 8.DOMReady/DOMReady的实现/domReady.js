function myReady(fn){

	if(document.addEventListener){
		document.addEventListener('DOMContentLoaded',fn,false);
	}else{//低版本浏览器
		IEContentLoaded(fn);
	}

	//IE模拟DOMContentLoaded
	function IEContentLoaded(fn){
		var d = window.document;
		var done = false;
		//值执行一次用户的回调函数init();
		var init = function(){
			if(!done){
				done = true;
				fn();
			}
		};

		(function(){
			try{
				//DOM树未创建完之前调用doScroll会抛出错误
				d.documentElement.doScroll('left');
			}catch(e){
				//延迟在试一次，
				//var func = function() { alert(func === arguments.callee);}func();
　　            //执行上述代码，可以看到alter出来的结果是true，注意，此处用的是“===”，就是说func与arguments.callee对象类型和值都相等。
				setTimeout(arguments.callee,50);
				return;
			}
			init();
		})();

		//监听document的加载状态
		d.onreadystatechange = function(){
			//如果用户是在domReady之后绑定的函数，就立马执行
			if(d.readyState == 'complete'){
				d.onreadystatechange = null;
				init();
			}
		}
	}
}