try{
    if (self != top) {
        top.location=self.location;
    }
}catch (e) {}
window.dialog = {
    fucCheckLength: function(strTemp) {
        return strTemp.replace(/[\s\S]/g, function(a) {
            return /[\u4E00-\u9FA5]/.test(a) ? '11' : '1';
        }).length;
    },
    alert: function(msg, type, fn) {
        if(typeof type === 'function') {
            fn = type
            type = '确定'
        }
        var btn = type || '确定';
        var dialog = document.getElementById('dialog');
        if(!dialog) {
            var html = document.createElement('div');
            html.setAttribute("id", "dialog");
            html.setAttribute("class", "xq_poupe")
            document.body.appendChild(html)
            html.innerHTML = '<div class="mask_alert" ></div>\
                    <article class="xq_poupe">\
                            <div>\
                            <p>' + msg + '</p>\
                            <span>' + btn + '</span>\
                        </div>\
                    </article>'

            document.querySelector('#dialog span').onclick = function() {
                document.body.removeChild(document.querySelector('#dialog'))
                typeof fn === 'function' && fn();
            }
        }
    }
}
window.alert = function(msg) {
    if(document.querySelectorAll('.alertBox').length) {
        clearTimeout(window.alert.time);
        document.querySelector('.alertBox').remove();
    }
    if(dialog.fucCheckLength(msg) > 40) return dialog.alert(msg);
    var obj = document.createElement('div')
    obj.setAttribute('class', 'alertBox');
    obj.innerHTML = msg;
    document.body.appendChild(obj);
    window.alert.time = setTimeout(function() {
        document.body.removeChild(document.querySelector('.alertBox'))
    }, 1500);
}
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");  
    var r = window.location.search.substr(1).match(reg);  
    if (r != null) return unescape(r[2]);  
    return null;  
}


var JZ =  {
    gainData:function(){
        $.ajax({
            url :'/security/pages/'+getQueryString('id'),
            type : "POST",
            dataType : "json",
            data:{ mobileType:3 },
            success : function(data) {
                if(data.code != 1)return alert(data.desc);
                var result = data.results;
                var d = new Date(result.createTime);    //根据时间戳生成的时间对象
                var ctime = (d.getFullYear()) + "-" + 
                           (d.getMonth() + 1) + "-" +
                           (d.getDate()) + " " + 
                           (d.getHours()) + ":" + 
                           (d.getMinutes())
                            // + ":" +(d.getSeconds());
                $('.acticle-title').html(result.title);//标题
                $('.acticle-time').html(ctime);//时间
                $('.article-source').html(result.sourceName);//来源
                $('.content').html((result.clearContent).replace(/<([\/]?)(div)((:?\s*)(:?[^>]*)(:?\s*))>/g, '$3'));//内容
                $('.head, .prompt').show();
                
                var imglist = $('.content img');
                for (var i=0; i<imglist.length; i++) {
                    imglist[i].removeAttribute('style');
                    if (!imglist[i].src) {
                        imglist[i].style.display="none";
                    }
                }

                $('.content img').bind('click', function(){
                    $("meta[name='viewport']").attr('content',"width=device-width, initial-scale=1.0");
                    $('.bigPic img').attr('src', $(this).attr('src'));
                    $('.mask, .bigPic').show();
                })
                $('.mask, .bigPic').bind('click',function(){
                    $('.mask, .bigPic').hide();
                    $("meta[name='viewport']").attr('content',"width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no");
                });


                //相关资讯
                var relatePages = result.relatePages,
                listHtml = [];
                if(relatePages.length > 0){
                    if(!relatePages[0])return false;//如果没有数据
                    for (var i in relatePages) {
                        var Q = relatePages[i];
                        // var myDate = new Date().getTime(),xgtime = '';
                        // if(Q.createTime){
                        //   var cha = myDate-Q.createTime;
                        //   console.log(cha)
                        //   if (cha < 3600) {
                        //     xgtime = cha/60 +'分钟前';
                        //   } else if (cha < (3600*24)){
                        //     xgtime = cha/3600 +'小时前';
                        //   } else {
                        //     xgtime = Q.createTime;
                        //   }
                        // }
                        
                        listHtml.push('<li pageid="'+Q.pageId+'"><div>'+Q.title+'</div>\
                        <p class="tag"><em>'+Q.label+'</em> <strong>'+Q.articleTime+'</strong></p></li>')
                    }
                    $('.list').html(listHtml.join(''));//内容
                    $('.xiangguan').show();
                    
                    $('.list li').bind('click',function(){
                        location.href= (location.href).split('=')[0] +'='+ $(this).attr('pageid');
                    });
                }
                
            }
        });
    },
    bindEvent:function(){
        
    },
    init:function(){
        JZ.gainData();
    }
}
JZ.init();