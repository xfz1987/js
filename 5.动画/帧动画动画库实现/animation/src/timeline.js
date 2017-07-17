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