$(function () {
  var form = layui.form;
  var layer = layui.layer;


  initUserInfo();
  // 初始化用户的基本信息
  function initUserInfo() {
    $.ajax({
      type: "GET",
      url: "/my/userinfo",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取用户信息失败！');
        }
        // d调用 form.val()快速为表单赋值
        form.val("fromUserInfo", res.data);
      }
    });
  }

  // 重置表单的数据
  $("#btnReset").on("click", function (e) {
    e.preventDefault();
    initUserInfo();
  });

  // 监听表单的提交事件
  $(".layui-form").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "/my/userinfo",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        layer.msg(res.message);
        // 调用父页面中的方法，重新渲染用户的头像和用户的信息
        window.parent.getUserInfo();
      }
    });
  });
})