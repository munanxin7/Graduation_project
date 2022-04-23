$(function () {
  var layer = layui.layer;
  var form = layui.form;
  var laypage = layui.laypage;
  // 定义美化时间的过滤器
  template.defaults.imports.dateFormat = function (date) {
    const dt = new Date(date);

    var y = dt.getFullYear();
    var m = padZero(dt.getMonth() + 1);
    var d = padZero(dt.getDate());

    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds());

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
  }
  // 定义补零的函数
  function padZero(n) {
    return n < 10 ? '0' + n : n;
  }
  // 定义查询的参数对象
  var q = {
    pagenum: 1,
    pagesize: 2
  }
  initExampleTable();

  function initExampleTable() {
    $.ajax({
      type: "GET",
      url: "/my/example",
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        var htmlStr = template('tpl-example', res);
        $("#exampleList").html(htmlStr);
        renderPage(res.total);
      }
    });
  }

  function renderPage(total) {
    laypage.render({
      elem: 'pageBox',
      count: total,
      limit: q.pagesize,
      curr: q.pagenum,
      limits: [5, 10],
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      // 分页发生切换的时候
      jump: function (obj, first) {
        q.pagenum = obj.curr;
        q.pagesize = obj.limit;
        if (!first) {
          initHandlerTable();
        }
      }
    });
  }

  var indexInfo = null;
  $("#exampleList").on("click", ".btn-info", function () {
    indexInfo = layer.open({
      type: 1,
      area: [window.parent.innerWidth - 300 + 'px', window.parent.innerHeight - 300 + 'px'],
      title: '详情',
      content: $("#dialog-example").html()
    });
    var id = $(this).attr("data-id");
    $.ajax({
      type: "GET",
      url: "/my/case/" + id,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        var htmlStr = template('tpl-info', res.data);
        $("#example").html(htmlStr);
      }
    });
  })

})