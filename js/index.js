initParams();
initPage();
getBlogCategory();

$("#blogDetile").css("display","none");


//初始化分页
function initPage(){
    page = parseInt(GetQueryString("page"));
    size = parseInt((GetQueryString("size")==null||GetQueryString("size")=="" ? 5:GetQueryString("size")));
    console.info(page+","+size)
    $.ajax({
        url:"http://localhost:3000/blog/getBlogListByPage",
        data:{"page":page,"size":size},
        type:"get",
        success:function(res){
            if (res.status==200) {
                data = res.data;
                count = res.count;

                html=''
                for (var i = data.length - 1; i >= 0; i--) {
                       html+='<div class="posts animation"><h4 class="posts-title"><a href="javascript:;" onclick="blogDetil('+data[i]["id"]+');" class="animation">'
                       +data[i]["title"]+'</a></h4><p class="time">'
                       +(data[i]["auther"]?data[i]["auther"]:"博主")+' &nbsp; '
                       +data[i]["time"]+'</p><p class="descript">'
                       +data[i]["summary"]
                       +'</p><div class="posts-footer">分类:<a class="class animation" href="/blog/blog/articles/19.html">推荐阅读</a>&nbsp;<a class="class animation" href="/blog/blog/articles/19.html">tensorflow</a></div></div>';
                }
                $("#getBlogList").html(html);

                paginationStr = genPagination(baseUrl,count,page,size,"size=")
                $(".pagination").html(paginationStr);
            }
        }
    });
}
//博客详情
function blogDetil(id) {
	$("#blogDetile").css("display","block");
	$(".pagination").css("display","none");
	$("#getBlogList").css("display","none");
}


//博客分类
function getBlogCategory() {
    // body...
     $.get("http://localhost:3000/blog/getBlogCategory", function(result){
        
        html=''
        for (var i = result.length - 1; i >= 0; i--) {
            html+='<a href="http://yjxxclub.cn/blog/index.html?typeId='+result[i]["id"]+'">'+result[i]["typeName"]+'</a>';
        }
        html+='<a href="http://yjxxclub.cn/blog/index.html?typeId=more">...</a>'
        $("#blogCategory").html(html);
    });

     $.get("http://localhost:3000/blog/getBlogCount", function(result){
        html=''
        for (var i = result.length - 1; i >= 0; i--) {
            html+='<li class=""><a href="http://yjxxclub.cn/blog/index.html?releaseDateStr='+result[i]["date"]+'">'+result[i]["date"]+'<sup>'+result[i]["count"]+'</sup></a></li>';
        }
        $("#getBlogCount").html(html);
     });
}

//初始化分页参数
function initParams(){
    url = window.location;
    if (GetQueryString("page")==null) {
        window.location=baseUrl+"?page=1&";
    }
}
//获取url的param
function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
        if(r!=null)
            return  unescape(r[2]);
     return null;
}

//自定义分页
function genPagination(targetUrl,totalNum,currentPage,pageSize,param){
        totalPage=totalNum%pageSize==0?Math.floor(totalNum/pageSize):Math.floor(totalNum/pageSize)+1;
        if(totalPage==0){
            return "1";
        }else if(totalPage<currentPage){
            //防止当前页数大于所有页数
            targetUrl = targetUrl;
            totalNum = totalNum;
            pageSize = pageSize;
            param = param;
           return genPagination(targetUrl,totalNum,1,pageSize,param)
        }else{
            pageCode = '';
            pageCode+="<li><a href='"+targetUrl+"?page=1&"+param+"'>首页</a></li>";
            if(currentPage>1){
                pageCode+="<li><a href='"+targetUrl+"?page="+(currentPage-1)+"&"+param+"'>上一页</a></li>";         
            }else{
                pageCode+="<li class='disabled'><a href='#'>上一页</a></li>";
            }
            for(i=currentPage-2;i<=currentPage+2;i++){
                if(i<1||i>totalPage){
                    continue;
                }
                if(i==currentPage){
                    pageCode+="<li class='active'><a href='"+targetUrl+"?page="+i+"&"+param+"'>"+i+"</a></li>";  
                }else{
                    pageCode+="<li><a href='"+targetUrl+"?page="+i+"&"+param+"'>"+i+"</a></li>"; 
                }
            }
            if(currentPage<totalPage){
                pageCode+="<li><a href='"+targetUrl+"?page="+(currentPage+1)+"&"+param+"'>下一页</a></li>";     
            }else{
                pageCode+="<li class='disabled'><a href='#'>下一页</a></li>";   
            }
            pageCode+="<li><a href='"+targetUrl+"?page="+totalPage+"&"+param+"'>末页</a></li>";
            return pageCode.toString();
        }

    }

