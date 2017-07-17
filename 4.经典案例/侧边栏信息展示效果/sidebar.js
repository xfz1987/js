(function(){
    var Menubar = function(){
        var me = this;
        this.curOpenedContent = null;
        this.el = document.querySelector('#sidebar ul');
        this.state = 'allClosed';//hasOpened
        this.el.addEventListener('click',function(e){
            e.stopPropagation();
        });
        this.menuList = document.querySelectorAll('.item');
        this.menuCloses = document.querySelectorAll('.nav-content .nav-con-close');
        for(var i=0,len=this.menuList.length;i<len;i++){
            this.menuList[i].addEventListener('click',function(e){
                var content = document.getElementById(e.currentTarget.id+'-content');
                if(me.state === 'allClosed'){
                    //打开
                    content.className = 'nav-content';
                    content.style.top = '0';
                    content.style.left = '-85px';
                    content.className += ' content-move-right';
                    me.state = 'hasOpened';
                    me.curOpenedContent = content;
                }else{
                    //关闭
                    me.curOpenedContent.className = 'nav-content';
                    me.curOpenedContent.style.top = '0';
                    me.curOpenedContent.style.left = '35px';
                    me.curOpenedContent.className += ' content-move-left';
                    //打开
                    content.className = 'nav-content';
                    content.style.top = '250px';
                    content.style.left = '35px';
                    content.className += ' content-move-up';
                    me.state = me.state = 'hasOpened';
                    me.curOpenedContent = content;
                }
            });
        }
        //关闭内容
        for(i=0,len=this.menuCloses.length;i<len;i++){
            this.menuCloses[i].addEventListener('click',function(e){
                var menucontent = e.currentTarget.parentNode;
                menucontent.className = 'nav-content';
                menucontent.style.top = '0';
                menucontent.style.left = '35px';
                menucontent.className += ' content-move-left';
                me.state = 'allClosed';
            });
        }
    };

    var Sidebar = function(id,closeId){
        var me = this;
        this.menubar = new Menubar();
        this.state = 'opened';
        this.el = document.getElementById(id||'sidebar');
        this.closeBar = document.getElementById(closeId||'closeBar');
        this.el.addEventListener('click',function(e){
            if(e.target !== me.el){
                me.triggerSwitch();
            }
        });
    };

    Sidebar.prototype = {
        close:function(){
            this.el.className = 'sidebar-move-left';
            this.closeBar.className = 'closeBar-move-right';
            this.state = 'closed';
        },
        open:function(){
            this.el.className = 'sidebar-move-right';
            this.closeBar.className = 'closeBar-move-left';
            this.state = 'opened';
        },
        triggerSwitch:function(){
            this.state === 'opened' ? this.close() : this.open();
        }
    };
    var sidebar = new Sidebar();
})();