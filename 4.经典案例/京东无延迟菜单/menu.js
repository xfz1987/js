/**
 * 效果: 可以自由切换一级菜单二级菜单，无延迟，无断层
 * 知识点: 
 *    使用mouseover/mouseout时，如果鼠标移动到子元素上，即便没有离开父元素，也会触发父元素的mouseout事件
 *    使用mouseenter/mouseleave时，入宫鼠标没有离开父元素，在其子元素上任意移动，也不会触发mouseleave事件
 *    去抖技术：即对于频繁的操作执行最后一次操作
 *    实现: setTimeout, 当timer还没有执行完毕，clearTimeout
 *    弊端: 效果会被延迟
 *    解决办法: 基于用户行为预测的切换技术
 *    原理: 鼠标在一级菜单的单的点，二级菜单上边缘，下边缘构成三角脚形
 *          如果鼠标的运动轨迹在这个三角形内部移动时，我们就预测用户是想移动到二级菜单，而不是进行一级菜单的切换
 *     
 */

$(function(){
	var sub = $('#sub'),activeRow,activeMenu,timer,mouseInSub = false,mouseTrack = [];
	var mouveHandler = function(e){
		mouseTrack.push({
			x: e.pageX,
			y: e.pageY
		});

		if(mouseTrack.length > 3) mouseTrack.shift();
	};

	sub.on('mouseenter',function(e){
		mouseInSub = true;
	}).on('mouseleave',function(e){
		mouseInSub = false;
	});

	$('.menu').on('mouseenter',function(e){
		sub.removeClass('none');
		$(document).bind('mousemove',mouveHandler);
	}).on('mouseleave',function(e){
		sub.addClass('none');
		if(activeRow){
			activeRow.removeClass('active');
			activeRow = undefined;
		}
		if(activeMenu){
			activeMenu.removeClass('none');
			activeMenu = undefined;
		}
		$(document).unbind('mousemove',mouveHandler);
	}).on('mouseenter','li',function(e){
		if(!activeRow){
			activeRow = $(this).addClass('active');
			activeMenu = $('#' + activeRow.data('id')).removeClass('none');
			return false;
		}

		//当鼠标从一个菜单直接滑动到第三个菜单时，不想让菜单二显示
		//去抖操作: 即对于频繁的操作执行最后一次操作
		if(timer) clearTimeout(timer);

		//判断是否需要延迟: 也就是判断运动轨迹是否在三角形区域内
		if(needDelay(sub, mouseTrack[mouseTrack.length-2], mouseTrack[mouseTrack.length-1])){
			var _this = this;
			timer = setTimeout(function(){
				if(mouseInSub) return;
				activeRow.removeClass('active');
				activeMenu.addClass('none');

				activeRow = $(_this).addClass('active');
				activeMenu = $('#' + activeRow.data('id')).removeClass('none');
				timer = null;
			}, 300);
		}else{
			activeRow.removeClass('active');
			activeMenu.addClass('none');

			activeRow = $(this).addClass('active');
			activeMenu = $('#' + activeRow.data('id')).removeClass('none');
		}
	})
})