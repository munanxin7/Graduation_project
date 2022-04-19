$(function () {
  // 点击"去注册账号"链接
  $("#link_reg").on("click", function () {
    $(".login-box").hide();
    $(".reg-box").show();
  });

  // 点击“已有账号，去登录”链接
  $("#link_login").on("click", function () {
    $(".reg-box").hide();
    $(".login-box").show();
  });
  // 从 layui 中获取 form 对象
  var form = layui.form;
  // 自定义校验规则
  form.verify({
    // 密码的校验规则
    'pwd': [
      /^[\S]{6,12}$/,
      '密码必须6到12位，且不能出现空格'
    ],
    // 校验密码是否一致
    'repwd': function (value, item) {
      // 通过形参拿到确认密码框中的内容
      // 拿到密码框中的内容
      // 进行等于判断
      // 判断失败，则return一个提示消息
      var pwd = $(".reg-box [name=pwd]").val();
      if (pwd !== value) {
        return '两次密码不一致！';
      }
    }
  })
})