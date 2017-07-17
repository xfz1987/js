* window与document的区别？
  * window表示浏览器中打开的窗口(包括工具栏)
    window对象可以省略

  * document是window对象的一部分(不包括工具栏)

* window.location与document.location的区别？
  window.location引用的是Location对象，表示该窗口中当前文档的URL
  document.location也是引用的Location对象
  window.location === document.location //true
  在通常情况下是一样的

  * location.href

* 与window相关的宽高
  outerWidth = innerWidth              浏览器宽度
  outerHeight = innerHeidht + 工具栏   浏览器高度
  window.screen: 用户屏幕
  window.screen.height  ： 屏幕(显示器)高度
  window.screen.width : 屏幕(显示器)的宽度
  window.screen.availHeight
  window.screen.availWidth
  window.screenTop : 浏览器距离屏幕顶部的距离
  window.screenLeft ： 浏览器距离屏幕左侧的距离
  
* 与client相关的宽高
  * clientWidth和clientHeight : 元素的可视部分宽度和高度，即padding+content，
    如果没有滚动条，即为元素设定的高度和宽度 + padding*2
    如果出现滚动条，即为元素设定的高度和宽度 + padding*2 - 滚动条的宽高
  
  * clientLeft和clientTop : 这两个返回的是元素周围边框的厚度，如果不指定一个边框或者不定位钙元素，其值就是0
    clientTop = border-top的border-width
    clientLeft = border-left的border-width

    document.body.clientWidth/document.body.clientHeight/document.body.clientTop/document.body.clientLet

    *注意:浏览器之间存在差异，无法确定浏览器本身的窗口大小，但是可以取得页面视口的大小
      document.documentElement.clientWidth || document.body.clientWdith 

* 与offset相关的宽高
  * offsetWidth和offsetHeight : 元素的border + padding + content 的宽度和高度

    offsetWidth = clientWidth + border*2 = width + padding*2 + border*2

  * offfsetLeft和offsetTop（有坑啊）
    1.如果当前元素的父元素没有进行定位(absoulte或relative)，offsetParent为body
    2.假如有定位，offsetParent取最近定位的的那个父级元素

    * IE6/7中
      offsetLeft = (offsetParent的padding-left) + (当前元素的margin-left) 
    * IE8/9/10及chrome中
      offsetLeft = (offsetParent的margin-left) + (offsetParent的padding-left) + (当前元素的margin-left) + (offsetParent的border-left宽度) + 
    * FireFox中
      offsetLeft = (offsetParent的margin-left) + (offsetParent的padding-left) + (当前元素的margin-left) 

* 与scroll相关的宽高
  * scrollWidth和scrollHeight
    doucment.body的scrollWidth和scrollHeight与div的scrollWidth和scrollHeight有区别
    * 当给定的宽高小于浏览器窗口 : scrollWidth/scrollHeight通畅是浏览器窗口的宽高
    * 当给定的宽高大于浏览器窗口，且内容小于给定宽高 : scrollWidth/scrollHeight = 给定的宽高 + padding + margin + border
    * 当给定的宽高大于浏览器窗口，且内容大于给定宽高 : scrollWidth/scrollHeight = 其内容的宽高 + padding + margin + border
    
    div
    * 无滚动: srollWidth = clientWidth = width + padding*2
    * 有滚动: srollWidth = 实际内容的宽度 + padding*2

  * scrollLeft和scrollTop : 当前元素其中内容超出其宽高的时候，元素被卷起的宽高

    var w=document.documentElement.scrollWidth || document.body.scrollWidth;
    var h=document.documentElement.scrollHeight || document.body.scrollHeight;

* documentElement
  document : #document
  documentElement : html
  document.body : body
  documentElement 是 document.body 的父对象

* Event对象的五种坐标（鼠标点击点）
  * clientX/clientY : 相对于浏览器(可视区左上角0,0)的坐标
  * screenX/screenY : 相对于设备屏幕左上角0,0的坐标
  * offsetX/offsetY : 相对于事件源左上角0,0的坐标
  * pageX/pageY     : 相对于整个网页左上角0,0的坐标
  * x/y             : 本来是IE属相，相对于用CSS动态定位的最内层包容元素

  clinetX/Y与pageX/Y的区别 : 滚动条出现时，pageX/Y是不变的