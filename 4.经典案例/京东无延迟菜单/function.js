/**
 * 二进制位运算判断
 */
function sameSign(a,b){
	return (a ^ b) >= 0;
}

/** 
 * 向量: 终点坐标 - 起点坐标
 * @param a 起点坐标
 * @param b 终点坐标
 */
function vector(a,b){
	return {
		x: b.x - a.x,
		y: b.y - a.y
	}
}

/** 
 * 向量差乘公式: 向量1的x坐标*向量2的y坐标 - 向量2的x坐标*向量1的y坐标
 * @param v1 向量1
 * @param v1 向量2
 */
function vectorProduct(v1,v2){
	return v1.x * v2.y - v2.x * v1.y;
}

/** 
 * 判断点是否在三角形内
 * @param p 要判断的点
 * @param a 三角形点
 * @param b 三角形点
 * @param c 三角形点
 */
function isPointInTrangle(p,a,b,c){
	var pa = vector(p, a),
	    pb = vector(p, b),
	    pc = vector(p, c);

	var t1 = vectorProduct(pa, pb),
	    t2 = vectorProduct(pb, pc),
	    t3 = vectorProduct(pc, pa);

	return sameSign(t1, t2) && sameSign(t2, t3);
}

/**
 * 是否需要延迟处理
 * @param  {[type]} ele         二级菜单
 * @param  {[type]} leftCornerm 鼠标上一位置
 * @param  {[type]} curMousePos 鼠标当前位置
 */
function needDelay(ele, leftCornerm, curMousePos){
	var offset = ele.offset();
	var topLeft = {
		x: offset.left,
		y: offset.top
	}
	var bottomLeft = {
		x: offset.left,
		y: offset.top + ele.height()
	}

	return isPointInTrangle(curMousePos,leftCornerm,topLeft,bottomLeft);
}