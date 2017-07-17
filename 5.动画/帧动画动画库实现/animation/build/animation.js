(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["animation"] = factory();
	else
		root["animation"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Create by xfz on 16/8/2
	 * 帧动画库:跟着我，左手右手一个慢动作，左手打不出，换右手来...
	 * verson 1.0 
	 */
	'use strict';

	//加载功能模块
	var loadImage = __webpack_require__(1);
	var Timeline = __webpack_require__(2);

	//初始化状态
	var STATE_INITIAL = 0;
	//开始状态
	var STATE_START = 1;
	//停止状态
	var STATE_STOP = 2;
	//同步任务
	var TASK_SYNC = 0;
	//异步任务
	var TASK_ASYNC = 1;

	function next(callback){
		callback && callback();
	}

	function Animation(){
		this.taskQueue = [];//任务队列
		this.index = 0;//当前任务索引
		this.state = STATE_INITIAL;//当前动画状态:初始状态
		this.interval = 0;//时间间隔
		this.timeline = new Timeline();//时间轴管理类
	}

	/**
	 * 添加一个同步任务，预加载图片
	 * @param imglist 图片数组
	 */
	Animation.prototype.loadImage = function(imglist){
		var taskFn = function(next){
			//为了不去修改imglist原数组或对象，做个深拷贝
			loadImage(imglist.slice(), next);
		};
		var type = TASK_SYNC;

		return this._add(taskFn,type);
	};

	/**
	 * 添加一个异步定时任务，通过定时改变图片背景位置实现帧动画
	 * @param ele       dom对象
	 * @param positions 背景位置数组
	 * @param imgUrl    图片地址
	 */
	Animation.prototype.changePosition = function(ele,positions,imgUrl){
		var len = positions.length;
		var taskFn;
		var type;
		if(len){
			var me = this;
			taskFn = function(next,time){
				if(imgUrl){
					ele.style.backgroundImage = 'url(' + imgUrl + ')';
				}
				
				// A|0 相当于取整，比Math.floor更快的方法
				var index = Math.min(time/me.interval | 0,len-1);
			
				var position = positions[index].split(' ');

				ele.style.backgroundPosition = position[0]+'px ' + position[1]+'px';

				if(index === len-1){
					next();
				}
			};
			type = TASK_ASYNC;
		}else{
			taskFn = next;
			type = TASK_SYNC;
		}

		return this._add(taskFn,type);
	};

	/**
	 * 添加一个异步定时任务，通过定时改变image标签的src属性，实现帧动画
	 * @param ele     dom对象
	 * @param imglist 图片数组
	 */
	Animation.prototype.changeSrc = function(ele,imglist){
		var len = imglist.length;
		var taskFn;
		var type;

		if(len){
			var me = this;
			taskFn = function(next,time){
				var index = Math.min(time/me.interval|0,len-1);
				ele.src = imglist[index];
				if(index === len-1){
					next();
				}
			};
			type =TASK_ASYNC;
		}else{
			taskFn = next;
			type = TASK_SYNC;
		}

		return this._add(taskFn,type);
	};

	/**
	 * 添加一个异步定时执行的任务
	 * 该任务自定义动画每帧执行的函数
	 * @param fn 函数
	 */
	Animation.prototype.enterFrame = function(taskFn){
		return this._add(taskFn,TASK_ASYNC);
	};

	/**
	 * 添加一个同步任务，上一个任务完成后执行的回调函数
	 * @param  callback 回调函数
	 */
	Animation.prototype.then = function(callback){
		var taskFn = function(next){
			callback && callback();
			next();
		};

		return this._add(taskFn,TASK_SYNC);
	};

	/**
	 * 会退到上一个任务中，实现重复上一个任务
	 * @param  times  times为空时表示无限次
	 */
	Animation.prototype.repeat = function(times){
		var me = this;
		var taskFn = function(){
			if(typeof times === 'undefined'){
				//无限回到上一个任务，因为_next:index++
				me.index--;
				me._runTask();
				return;
			}
			if(times){
				times--;
				me.index--;
				me._runTask();
			}else{
				//为零时跳转下一个任务
				var task = me.taskQueue[me.index];
				me._next(task);
			}
		};

		return this._add(taskFn,TASK_SYNC);
	};

	/**
	 * 无限重复上一次动画，相当于repeat(),更友好的一个接口
	 */
	Animation.prototype.repeatForever = function(){
		return this.repeat();
	};

	/**
	 * 设置当前任务执行结束后到下一个任务开始前的等待时间
	 * @param time 等待时长
	 */
	Animation.prototype.wait = function(time){
		if(this.taskQueue && this.taskQueue.length>0){
			this.taskQueue[this.taskQueue.length-1].wait = time;
		}
		return this;
	};

	/**
	 * 开始执行任务
	 * @param  interval 时间间隔
	 */
	Animation.prototype.start = function(interval){
		if(this.state === STATE_START) return this;

		if(!this.taskQueue.length) return this;

		this.state = STATE_START;
		this.interval = interval;
		this._runTask();
		return this;
	};

	/**
	 * 暂停当前异步定时任务
	 */
	Animation.prototype.pause = function(){
		if(this.state === STATE_START){
			this.state = STATE_STOP;
			this.timeline.stop();
			return this;
		}
		return this;
	};

	/**
	 * 恢复执行上一次暂停的任务
	 */
	Animation.prototype.restart = function(){
		if(this.state === STATE_STOP){
			this.state = STATE_START;
			this.timeline.restart();
			return this;
		}
		return this;
	};

	/**
	 * 释放资源：
	 * 定时器、
	 */
	Animation.prototype.dispose = function(){
		if(this.state !== STATE_INITIAL){
			this.state = STATE_INITIAL;
			this.taskQueue = null;
			this.timeline.stop();
			this.timeline = null;
			return this;
		}
		return this;
	};

	/**
	 * 添加一个任务到任务队列：内部使用
	 * @param taskFn 任务方法
	 * @param type   任务类型
	 */
	Animation.prototype._add = function(taskFn,type){
		this.taskQueue.push({
			taskFn : taskFn,
			type : type
		});
		return this;
	};

	/**
	 * 执行任务
	 */
	Animation.prototype._runTask = function(){
		if(this.state !== STATE_START && !this.taskQueue) return;
		//任务全部执行完成时，要释放资源
		if(this.index === this.taskQueue.length){
			this.dispose();
			return;
		}
		//获取任务链上的当前任务
		var task = this.taskQueue[this.index];
		
		task.type === TASK_SYNC ? this._syncTask(task) : this._asyncTask(task);
	};

	/**
	 * 同步任务
	 * @param task 执行的任务对象
	 */
	Animation.prototype._syncTask = function(task){
		//切换到一任务
		//因为next是必包，this会变化为window，所以先保存在一个变量中
		var me = this;
		var next = function(){
			me._next(task);
		};

		var taskFn = task.taskFn;
		//执行完taskFn，然后执行next，然后执行_next
		taskFn(next);
	};

	/**
	 * 异步任务
	 * @param task 执行的任务对象
	 */
	Animation.prototype._asyncTask = function(task){
		var me = this;
		//定义每一帧的回调函数
		var enterFrame = function(time){
			var taskFn = task.taskFn;
			var next = function(){
				//停止当前任务
				me.timeline.stop();
				//执行下一个任务
				me._next(task);
			};
			taskFn(next,time);
		};

		this.timeline.onenterframe = enterFrame;
		this.timeline.start(this.interval);
	};

	/**
	 * 切换到下一个任务,支持等待
	 * @param task 当前任务
	 */
	Animation.prototype._next = function(task){
		this.index++;
		var me = this;
		task.wait ? setTimeout(function(){me._runTask();},task.wait) : this._runTask();
	};

	module.exports = function(){
		return new Animation();
	};

/***/ },
/* 1 */
/***/ function(module, exports) {

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



/***/ },
/* 2 */
/***/ function(module, exports) {

	/**
	 * Create by xfz on 16/8/2
	 * 时间轴类库：其实就是给requestAnimationFrame增加了时间控制
	 * requestAnimationFrame(fn)，以前的做法都是通过物理知识
	 * [距离、速度、加/减速度]来计算时间，现在拥有这个库，身为物理小白的我
	 * 没有老司机带着我，我也可以飞起来了......
	 * verson 1.0 
	 */
	'use strict';

	var DEFAULT_INTERVAL = 1000 / 60;
	var STATE_INITIAL = 0;
	var STATE_START = 1;
	var STATE_STOP = 2;

	var requestAnimationFrame = (function(){
	        return window.requestAnimationFrame ||
	        	window.webkitRequestAnimationFrame ||
	            window.mozRequestAnimationFrame ||
	            window.oRequestAnimationFrame ||
	            window.msRequestAnimationFrame ||
	            function(callback){
	                return window.setTimeout(callback,callback.interval || DEFAULT_INTERVAL);
	            };
	 })();

	var cancelAnimationFrame = (function(){
		return window.cancelAnimationFrame ||
			window.webkitCancelAnimationFrame ||
			window.mozCancelAnimationFrame ||
			window.oCancelAnimationFrame ||
			function (id) {
				window.clearTimeout(id);
			};
	})();

	function Timeline(){
		this.state = STATE_INITIAL;
		this.interval = 0;
		this.animationHandler = 0;
		this.dur = 0;//动画从开始到暂停所经历的时间
	}

	/**
	 * 时间轴上每一次回调执行的函数
	 * @param  time 从动画开始到当前执行的时间
	 * 类似于JAVA中的Interface，主要是获得回调函数time的值
	 */
	Timeline.prototype.onenterframe = function(time){};

	/**
	 * 动画开始
	 * @param  interval 每一次回调的间隔时间
	 */
	Timeline.prototype.start = function(interval){
		if(this.state === STATE_START) return;
		this.state = STATE_START;
		this.interval = interval || DEFAULT_INTERVAL;
		startTimeline(this,new Date());
	};

	/**
	 * 动画停止
	 */
	Timeline.prototype.stop = function(){
		if(this.state !== STATE_START) return;

		this.state = STATE_STOP;

		//如果动画开始过，则记录动画从开始到现在所经历的时间
		if(this.startTime){
			this.dur = new Date() - this.startTime;
		}
		cancelAnimationFrame(this.animationHandler);
	};

	/**
	 * 重新开始动画
	 */
	Timeline.prototype.restart = function(){
		if(this.state === STATE_START) return;
		if(!this.dur || !this.interval) return;

		this.state = STATE_START;

		//无缝连接动画
		startTimeline(this, new Date() - this.dur);
	};

	/**
	 * 时间轴动画启动函数
	 * @param  obj       时间轴实例
	 * @param  startTime 动画开始时间
	 */
	function startTimeline(timeline,startTime){
		timeline.startTime = startTime;
		nextTick.interval = timeline.interval;

		//记录上一次回调的时间戳
		var lastTick = new Date();
		nextTick();
		
		/**
		 * 定义每一帧执行的函数
		 */
		function nextTick(){
			var now = new Date();
			timeline.animationHandler = requestAnimationFrame(nextTick);
			
			//如果当前时间与上一次回调的时间戳大于设置的时间间隔
			//表示这一次可以执行回调函数
			if(now - lastTick >= timeline.interval){
				timeline.onenterframe(now - startTime);
				lastTick = now;
			}
		}
	}

	module.exports = Timeline;

/***/ }
/******/ ])
});
;