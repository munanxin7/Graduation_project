$(function () {
  var form = layui.form;
  var layer = layui.layer;
  form.verify({
    pwd: [
      /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
    ],
    samePwd: function (value) {
      if (value === $("[name=oldPwd]").val()) {
        return '新密码不能与旧密码相同！';
      }
    },
    rePwd: function (value) {
      if (value !== $("[name=newPwd]").val()) {
        return '两次输入的密码不一致！'
      }
    }
  });


  $(".layui-form").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "/my/updatepwd",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        layer.msg(res.message);
        $(".layui-form")[0].reset();
      }
    });
  });
})