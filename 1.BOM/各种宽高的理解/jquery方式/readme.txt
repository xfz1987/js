* .width()与.height()
  content的高度和宽度

  * width()与css('width')的区别：
    width()不带单位，css带单位

* .innerWidth()与innerHeight()
  content + padding

* .outerWidth()与.outerHeight()
  outWidth(true) : content + padding + border + margin
  outWidth()/outWidth(false) : content + padding + border

* .scrollLeft()与.scrollTop()
  .scrollLeft() : 卷起的部分，相对于水平滚动轴条左边的距离,没有滚动条或滚动条在左边，则为0
  .scrollTop() : 卷起的部分，相对于纵向滚动条上边的距离,没有滚动条或滚动条在上边边，则为0

* .offset()
  相对于document的当前坐标，相对于body左上角的left，top

* .position()
  相对于offset parent的当前坐标，相对于offset parent元素左上角的left，top

* $(window).height(),可视区域，随着窗口变化而变化
  $(height).height()，整个文档的高度，不变化