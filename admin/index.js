

/**
  项目JS主入口
  以依赖Layui的layer和form模块为例
**/
layui.define(['layer', 'form', 'element'], function(exports) {
    var layer = layui.layer,
        form = layui.form,
        element = layui.element;
    layer.msg('Hello World');
    var device = layui.device('myapp');
    if (device.myapp) {
        alert('在我的App环境');
    }

    //监听左侧导航点击
    element.on('nav(leftnav)', function(elem) {
        var url = $(elem).children('a').attr('data-url');
        var id = $(elem).children('a').attr('data-id');
        var title = $(elem).children('a').text();
        if (title == "Home") {
            element.tabChange('tab', 0);
            return;
        }
        if (url == undefined) return;
        var tabTitleDiv = $('.layui-tab[lay-filter=\'tab\']').children('.layui-tab-title');
        var exist = tabTitleDiv.find('li[lay-id=' + id + ']');
        if (exist.length > 0) {
            //切换到指定索引的卡片
            element.tabChange('tab', id);
        } else {
            var index = layer.load(1);
            data = '<iframe src="' + url + '" style="width:100%;height:855px;border:none;outline:none;"></iframe>';
            //data = url; 好垃圾啊，我看源码想直接显示字符串
            layer.close(index);
            element.tabAdd('tab', {
                title: title,
                content: data,
                id: id
            });
            //切换到指定索引的卡片
            element.tabChange('tab', id);
        }
    });

    exports('index', {}); //注意，这里是模块输出的核心，模块名必须和use时的模块名一致
});