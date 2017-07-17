/**
 * Create by xfz on 16/8/2
 * 帧动画库:跟着我，左手右手一个慢动作，左手打不出，换右手来...
 * verson 1.0 
 */
'use strict';

//加载功能模块
var loadImage = require('./imageLoader.js');
var Timeline = require('./timeline.js');

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