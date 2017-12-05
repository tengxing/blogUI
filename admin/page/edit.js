var id = GetQueryString("id");
layui.use(['form', 'layedit', 'laydate'], function() {
    var form = layui.form;

window.onload=function(){
    //id = 13;
    if (id!="") {
        $.ajax({
            url:"http://localhost:8081/blog/article/findById",
            type:"post",
            data:{"id":id},
            success:function (res){
                res = JSON.parse(res);
                if (res.status==200) {
                    data = res.result;
                    $("#title").val(data.title);
                    $("#articleType").val(data.typeId);
                    //$("#editor").html(data.content);
                    editor.txt.html(data.content);
                    form.render(); //更新全部
                }
            }
        });
    }
}
});

//获取url的param
function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
        if(r!=null)
            return  unescape(r[2]);
     return null;
}

$("#save").click(function click() {
    var title = $("#title").val();
    var typeId = $("#articleType").val();
    var articleType = $("#articleType").text();
    if (title == '') {
        alert("请输入标题");
        return;
    }
    if (articleType == '') {
        alert("请选择文章类别");
        return;
    }
    var content = document.getElementById('editor').innerHTML;
        content = editor.txt.html();
    var summary = editor.txt.text().substring(0,30);
    var data = {
        'title': title,
        'typeName': articleType,
        'typeId': typeId,
        'content': content,
        'summary': summary,
        'id': id
    }
    $.post('http://localhost:8081/blog/article/save', data, function result(res) {
        res = JSON.parse(res);
        if (res.status == 200) {
            alert("修改成功");
        }
    });
})