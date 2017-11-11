initParams();
initPage();
getBlogCategory();

$("#blogDetile").css("display","none");
var blogList = [],categoryList=[];

//初始化分页
function initPage(){
    page = parseInt(GetQueryString("page"));
    size = parseInt((GetQueryString("size")==null||GetQueryString("size")=="" ? 5:GetQueryString("size")));
    typeId = GetQueryString("typeId");
    date = GetQueryString("date");
    data = {"page":page,"size":size};
    if (typeId!=null) {
    	data = {"page":page,"size":size,"typeId":typeId};
    }
    if (date!=null) {
    	data = {"page":page,"size":size,"date":date};
    }
    
    console.info(page+","+size+","+typeId+","+date)
    $.ajax({
        url:serverUrl+"blog/getBlogListByPage",
        data:data,
        type:"get",
        success:function(res){
            if (res.status==200) {
                data = res.data;
                count = res.count;
                blogList = res.data;	
                html=''
                for (var i = 0; i <=data.length - 1; i++) {
                       html+='<div class="posts animation"><h4 class="posts-title"><a href="javascript:;" onclick="blogDetil('+data[i]["id"]+');" class="animation">'
                       +data[i]["title"]+'</a></h4><p class="time">'
                       +(data[i]["auther"]?data[i]["auther"]:"博主")+' &nbsp; '
                       +data[i]["time"]+'</p><p class="descript">'
                       +data[i]["summary"]
                       +'</p><div class="posts-footer">分类:<a class="class animation" href="http://yjxxclub.cn/blog/index.html?typeId='+data[i]["typeId"]+'">'+data[i]["type"]+'</a>&nbsp;</div></div>';
                }
                $("#getBlogList").html(html);
                if (typeId!=null) {
			    	paginationStr = genPagination(baseUrl,count,page,size,"typeId="+typeId+"&size=")
			    }else if (date!=null) {
			    	paginationStr = genPagination(baseUrl,count,page,size,"date="+date+"&size=")
			    }else{
			    	 paginationStr = genPagination(baseUrl,count,page,size,"size=")
			    }
               
                $(".pagination").html(paginationStr);
            }
        }
    });
}
//博客详情
function blogDetil(id) {
	var blogDetile;
	//forEach为js原生，jquery为$.each([], function(index, value, array) 
	blogList.forEach(function(value, index, array) {
  		if (id==value.id) {
  			blogDetile = value;
  		}
	});
	new Vue({
	  el: '#blogDetile',
	  data: {
	    blog_title: blogDetile.title,
	    blog_time:blogDetile.time,
	    blog_type:blogDetile.type,
	    blog_content:blogDetile.content,
	    blog_replyHit:blogDetile.replyHit,
	    blog_tips:'前方评论区'
	  }
	})
	$("#blogDetile").css("display","block");
	$(".pagination").css("display","none");
	$("#getBlogList").css("display","none");
}


//博客分类
function getBlogCategory() {
    // body...
     $.get(serverUrl+"blog/getBlogCategory", function(result){
        categoryList = result;
        html=''
        for (var i = result.length - 1; i >= 0; i--) {
            html+='<a href="'+baseUrl+'?page=1&typeId='+result[i]["id"]+'">'+result[i]["typeName"]+'</a>';
        }
        html+='<a href="'+baseUrl+'?page=1&typeId=">...</a>'
        $("#blogCategory").html(html);
    });

     $.get(serverUrl+"blog/getBlogCount", function(result){
        html=''
        for (var i = result.length - 1; i >= 0; i--) {
            html+='<li class=""><a href="'+baseUrl+'?page=1&date='+formatDate(result[i]["date"])+'">'+result[i]["date"]+'<sup>'+result[i]["count"]+'</sup></a></li>';
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

 //format:2017年03月 ----> 2017-03
 function formatDate(date) {
 	return date.substring(0,4)+"-"+date.substring(5,7);
 }

