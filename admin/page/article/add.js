layui.use(['form', 'layedit', 'laydate'], function(){
        var form = layui.form;
      });
    $("#save").click(function click() {
            //console.info(quill.getContents());
            /*quill.setContents([{ insert: 'Hello ' },
                  { insert: 'World!', attributes: { bold: true } },
                  { insert: '\n' }]
                  );*/
            var title = $("#title").val();
            var typeId = $("#articleType").val();
            var articleType = $("#articleType").text();
            if (title=='') {alert("请输入标题");return;}
            if (articleType=='') {alert("请选择文章类别");return;}
            var content = document.getElementById('editor').innerHTML;
            var contentDelta = JSON.stringify(quill.getContents());
            var summary = quill.getText().substring(0,50)+"...";
            var data={
                'title':title,
                'typeName':articleType,
                'typeId':typeId,
                'content':content,
                'contentDelta':contentDelta,
                'summary':summary
            }
            $.post('http://localhost:8080/blog/article/save',data,function result(res){
                res = JSON.parse(res);
                if (res.status==200) {
                    alert("添加成功");
                }
            });
        })