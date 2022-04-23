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
  initSubTable();
  initConfirmTable();

  // 获取我发布的列表数据的方法
  function initSubTable() {
    $.ajax({
      type: "GET",
      url: "/my/subhistory/unhandle",
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        // 使用模板引擎渲染页面数据
        var htmlStr = template('tpl-subhistory', res);
        $("#subCaseList").html(htmlStr);
        renderPage(res.total);
      }
    });
  }

  // 定义渲染分页的方法
  function renderPage(total) {
    laypage.render({
      elem: 'pageBox1',
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
          initSubTable();
        }
      }
    });
  }

  // 通过代理的形式为修改按钮绑定事件
  var indexUpdate = null;
  $("#subCaseList").on("click", ".btn-update", function () {
    // 弹出修改层
    indexUpdate = layer.open({
      type: 1,
      area: [window.parent.innerWidth - 300 + 'px', window.parent.innerHeight - 300 + 'px'],
      title: '修改会诊',
      content: $("#dialog-update").html()
    });
    var id = $(this).attr('data-id');
    // 发起请求获取对应的数据
    $.ajax({
      type: "GET",
      url: "/my/case/" + id,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        layer.msg(res.message);
        form.val('form-update', res.data);
        $("#prevImg").attr("src", "http://127.0.0.1:3008" + res.data.section)
      }
    });
  });

  // 通过代理的形式为选择图片按钮绑定事件
  $("body").on("click", "#btnChooseImage", function () {
    $("#section").click();
  });
  var files = null;
  // 将选择的图片渲染至页面中
  $("body").on("change", "#section", function (e) {
    // 获取到的文件的列表数据
    files = e.target.files;
    if (files.length === 0) {
      return layer.msg('请选择至少一张病理切片！');
    }
    // 根据文件创建对象的 URL 地址
    var imgURL = URL.createObjectURL(files[0]);
    // 为预览图片设置 src
    $("#prevImg").attr("src", imgURL);
  })

  // 通过代理监听修改的提交事件
  $("body").on("submit", "#form-update", function (e) {
    e.preventDefault();
    var fd = new FormData($(this)[0]);
    // 将上传的病理切片输出为一个文件对象
    fd.append('section', files[0]);
    $.ajax({
      type: "POST",
      url: "/my/updateCase/" + $("#updateId").val(),
      data: fd,
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        layer.msg(res.message);
        layer.close(indexUpdate);
        initSubTable();
      }
    });
  });

  // 绑定删除事件
  $("body").on("click", ".btn-delete", function () {
    var id = $(this).attr('data-id')
    // 提示用户是否要删除
    layer.confirm('确认删除?', {
      icon: 3,
      title: '提示'
    }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/deleteCase/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg(res.message)
          }
          layer.msg(res.message)
          layer.close(index)
          initSubTable();
        }
      })
    })
  });

  // 获取待确认的列表数据
  function initConfirmTable() {
    $.ajax({
      type: "GET",
      url: "/my/subhistory/handle",
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        // 使用模板引擎渲染页面数据
        var htmlStr = template('tpl-handledhistory', res);
        $("#handleCaseList").html(htmlStr);
        renderPage2(res.total);
      }
    });
  }

  function renderPage2(total) {
    laypage.render({
      elem: 'pageBox2',
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
          initConfirmTable();
        }
      }
    });
  }

  var indexConfirm = null;
  // 为确认按钮绑定事件
  $("#handleCaseList").on("click", ".btn-confirm", function () {
    // 弹出确认层
    indexConfirm = layer.open({
      type: 1,
      area: [window.parent.innerWidth - 300 + 'px', window.parent.innerHeight - 300 + 'px'],
      title: '确认诊断',
      content: $("#dialog-confirm").html()
    });
    var id = $(this).attr("data-id");
    $.ajax({
      type: "GET",
      url: "/my/case/" + id,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        var htmlStr = template('tpl-confirm', res.data);
        $("#confirm").html(htmlStr);
        $("#confirmId").val(res.data.id);
      }
    });
  });

  // 为确认绑定提交事件
  $("body").on("submit", "#form-confirm", function (e) {
    e.preventDefault();
    $.ajax({
      type: "GET",
      url: "/my/confirmCase/" + $("#confirmId").val(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        layer.msg(res.message);
        layer.close(indexConfirm);
        initConfirmTable();
      }
    });
  })
})