/**
 * Create by xfz on 16/8/2
 * verson 1.0 
 * 预加载图片库 
 */
'use strict';

/**
 * 预加载图片资源
 * @param  imgs  加载图片的数组或对象
 * @param  callback 全部图片加载完毕后调用的回调函数
 * @param  timeout  加载超时的时长
 */
function loadImage(imgs, callback, timeout){
	//加载完成图片的计数器
	var count = 0;
	//全部图片加载成功的标识
	var success = true;
	//每张图片加载的结果
	var temp_res;
	//超时timer的id
	var timeoutId = 0;
	//是否加载超时的标识
	var isTimeout = false;
	//对数组或对象进行遍历
	for(var key in imgs){
		//过滤prototype上的key属性
		if(!imgs.hasOwnProperty(key)) continue;

		//object:{src:xxx}
		var item = imgs[key];
		
		if(typeof item === 'string'){
			item = {src : imgs[key]};
		}
		
		if(!item || !item.src) continue;
			
		count++;
		//设置图片元素的id
		item.id = '__img__' + key + getId();
		//设置图片img对象
		item.img = window[item.id] = new Image();

		doLoad(item);
	}

	if(!count){
		//如果没有图片则立即执行回调函数
		callback(success);
	}else if(timeout){
		//如果有超时函数，则进行超时处理
		timeoutId = setTimeout(onTimeout,timeout);
	}

	function doLoad(item){
		var img = item.img;
		
		img.onload = function(){
			//要保证每张图都加载完毕的才算成功
			success = success && true;
			done();
		};

		img.onerror = function(){
			success = false;
			done();
		};

		img.src = item.src;

		/**
		 * 每张图片加载完成的回调函数
		 */
		function done(){
			img.onload = img.onerror = null;

			try{
				delete window[item.id];
			}catch(e){
				console.log(e);
			}

			//每张图片加载完成，计数器-1，当所有图片加载完成切没有超时情况
			//清除计时器，执行回调函数
			if(!--count && !isTimeout){
				clearTimeout(timeoutId);
				callback(success);
			}
		}
	}

	//超时函数
	function onTimeout(){
		isTimeout = true;
		callback(false);
	}
}

var _id = 0;
function getId(){
	return ++_id;
}

//把loadImage这个模块暴露给外面
module.exports = loadImage;

