$(function () {
  var layer = layui.layer;
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
  initTable();


  // 获取会诊列表数据的方法
  function initTable() {
    $.ajax({
      type: "GET",
      url: "/my/getCase",
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        // 使用模板引擎渲染页面的数据
        var htmlStr = template('tpl-table', res);
        $("#caseList").html(htmlStr);
        renderPage(res.total);
      }
    });
  }

  // 定义渲染分页的方法
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
          initTable();
        }
      }
    });
  }
  // 通过代理的形式，为诊断按钮绑定事件
  var indexHandle = null;
  $("#caseList").on("click", ".btn-handle", function () {
    // 弹出详细信息层
    indexHandle = layer.open({
      type: 1,
      area: [window.parent.innerWidth - 300 + 'px', window.parent.innerHeight - 300 + 'px'],
      title: '详细信息',
      content: $("#dialog-handle").html()
    });
    // 渲染弹出层
    var id = $(this).attr("data-id");
    $.ajax({
      type: "GET",
      url: "/my/case/" + id,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        var htmlStr = template('tpl-caseInfo', res.data);
        $("#caseInfo").html(htmlStr);
        $("[name=id]").val(res.data.id);
      }
    });
  });

  // 通过代理的形式为图片绑定点击事件
  $("body").on("click", "#section", function () {
    layer.photos({
      photos: '#layer-photos',
      anim: 1
    });
  })

  // 通过代理的形式，为修改分类的表单绑定提交事件
  $("body").on("submit", "#form-handle", function (e) {
    e.preventDefault();
    var data = {
      id: $("[name=id]").val() - 0,
      diagnosis: $("[name=diagnosis]").val()
    }

    $.ajax({
      type: "POST",
      url: "/my/handleCase",
      data: data,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        layer.msg(res.message);
        layer.close(indexHandle);
        initTable();
      }
    });
  })


})