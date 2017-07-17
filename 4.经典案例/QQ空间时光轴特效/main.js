window.onload = function(){
    formatData();
    createHtmlScrub();
    createHtmlCont();

    //页面滚动处理: 固定时序菜单的位置，自动展开时序菜单
    var scrubber = $('scrubber');
    window.onscroll = function(){
        var top = document.body.scrollTop || document.documentElement.scrollTop;
        if(top>200){
            scrubber.style.position = 'fixed';
            scrubber.style.top = '60px';
            scrubber.style.left = (getPageWidth() - 960)/2 + 'px';
        }else{
            scrubber.style.position = '';
            scrubber.style.top = '';
            scrubber.style.left = '';
        }

        //处理日志列表的年份
        update_scrubber_year(top);

        //处理日志列表的月份
        update_scrubber_month(top);
    };

    //窗口改变事件处理; 保持时序列表的位置
    window.onresize = function(){
        window.onscroll();
    };

};

function $(id){
    return document.getElementById(id);
}

function g(className){
    return document.getElementsByClassName(className);
}

//获得模板字符串
function $_tpl(id){
    return $('tpl_'+id).innerHTML;
}

function getPageWidth(){
    return document.body.offsetWidth || document.documentElement.offsetWidth;
}

function getPageHeight(){
    return document.body.offsetHeight || document.documentElement.offsetHeight;
}

var list = {};
//格式化数据
function formatData(){
    data.sort(function(a,b){
        return new Date(a.date).getTime() > new Date(b.date).getTime();
    });
    for(var i=0,len=data.length;i<len;i++){
        var date = new Date(data[i].date);
        var year = date.getFullYear(),
            month = date.getMonth()+1,
            lunar = GetLunarDateString(date);

        list[year] || (list[year]={});
        list[year][month] || (list[year][month]=[]);

        var item = data[i];
        item.lunar = lunar[0] + '<br>&nbsp;' + lunar[1];
        item.year = year;
        item.month = month;
        item.like_formate = item.like < 10000 ? item.like : (item.like/10000).toFixed(1) + '万';

        list[year][month].unshift(item);
    }
}

//时序菜单 HTML 生成
function createHtmlScrub(){
    var html_scrubber_list = [],
        tpl_year = $_tpl('scrubber_year'),
        tpl_month = $_tpl('scrubber_month'),
        html_year;

    for(y in list){
        html_year = tpl_year.replace(/\{year\}/g,y);
        var html_month = [];
        for(m in list[y]){
            html_month.unshift(tpl_month.replace(/\{month\}/g,m).replace(/\{year\}/g,y))
        }

        html_year = html_year.replace(/\{list\}/g,html_month.join(''));

        html_scrubber_list.unshift(html_year);
    }

    $('scrubber').innerHTML = html_scrubber_list.join('');
}

//日志列表的 HTML 生成
function createHtmlCont(){
    var html_content_list = [];
    var html_scrubber_list = [],
        tpl_year = $_tpl('content_year'),
        tpl_month = $_tpl('content_month'),
        tpl_item = $_tpl('content_item'),
        html_year;
        for(y in list){
            html_year = tpl_year.replace(/\{year\}/g,y);
            var html_month = [];
            for(m in list[y]){
                var html_item = [];
                var isFirst = true;
                for(i in list[y][m]){
                    var item_data = list[y][m][i];
                    var item_html = tpl_item
                            .replace(/\{date\}/g,item_data.date)
                            .replace(/\{lunar\}/g,item_data.lunar)
                            .replace(/\{intro\}/g,item_data.intro)
                            .replace(/\{media\}/g,item_data.media)
                            .replace(/\{like\}/g,item_data.like)
                            .replace(/\{like_format\}/g,item_data.like_formate)
                            .replace(/\{isFirst\}/g,isFirst?'first':'')
                            .replace(/\{position\}/g,i%2?'right':'left')
                            .replace(/\{comment\}/g,item_data.comment);
                    html_item.push(item_html);
                    isFirst = false;
                }
                html_month.unshift(tpl_month.replace(/\{year\}/g,y).replace(/\{month\}/g,m).replace(/\{list\}/g,html_item.join('')));
            }

            html_year = html_year.replace(/\{list\}/g,html_month.join(''));

            html_content_list.unshift(html_year);
        }

        $('content').innerHTML = html_content_list.join('');
}

//获得元素的高度
function getTop(el){
    return el.offsetTop+170;
}
function scrollTo(dest){
    var start = document.body.scrollTop || document.documentElement.scrollTop;
    window.scroll(0,dest);
}
//年份、月份点击处理
function showYear(year){
    var c_year = $('content_year_'+year);
    var top = getTop(c_year);
    scrollTo(top);
    expandYear(year,$('scrubber_year_'+year));
}
function showMonth(year,month){
    var c_month = $('content_month_'+year+'_'+month);
    var top = getTop(c_month);
    scrollTo(top);
    highlight($('scrubber_month_'+year+'_'+month));
}

//高亮处理 - 月份
function highlight(el){
    var months = g('scrubber_month');
    for(var i=0,len=months.length;i<len;i++){
        months[i].className = months[i].className.replace(/cur/g,'');
    }
    el.className += ' cur';
}

//年份点击展开
function expandYear(year,el){
    var months = g('scrubber_month');
    var show_month = g('scrubber_month_in_'+year);
    var years = g('scrubber_year');
    //隐藏所有的月份
    for(var i=0,len=months.length;i<len;i++){
        months[i].style.display = 'none';
    }
    //展现当前年份下所有的月份
    for(var j=0,len2=show_month.length;j<len2;j++){
        show_month[j].style.display = 'block';
    }
    //清理所有年份的 cur 样式
    for(var k=0,len3=years.length;k<len3;k++){
        years[k].className = years[k].className.replace(/cur/g,'');
    }
    //设置当前年份的 cur 样式
    el.className += ' cur';
}

function update_scrubber_year(top){
    var years = $('content').getElementsByClassName('content_year');
    var tops = [];
    for(var i=0,len=years.length;i<len;i++){
        tops.push(years[i].offsetTop);
    }
    for(var i=1,len=tops.length;i<len;i++){
        if(top>tops[i-1] && top<tops[i]){
            var year = years[i-1].innerHTML;
            var s_year = $('scrubber_year_'+year);
            expandYear(year,s_year);
        }else if(top>tops[i]){
           var year = years[i].innerHTML;
           var s_year = $('scrubber_year_'+year);
           expandYear(year,s_year);
        }
    }
}

function update_scrubber_month(top){
    var months = $('content').getElementsByClassName('content_month');
    var tops = [];
    for(var i=0,len=months.length;i<len;i++){
        tops.push(months[i].offsetTop);
    }
    //定位 top 在窗口的哪个月份区间
    for(var i=1,len=tops.length;i<len;i++){
        if(top>tops[i-1] && top<tops[i]){
            var id = months[i-1].id;
            highlight($(id.replace('content','scrubber')));

        }else if(top>tops[i]){
            var id = months[i].id;
            highlight($(id.replace('content','scrubber')));
        }
    }
}