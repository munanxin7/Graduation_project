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
  // 从 layui 中获取 layer 对象
  var layer = layui.layer;
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
      var pwd = $("#form_reg [name=pwd]").val();
      if (pwd !== value) {
        console.log(pwd);
        return '两次密码不一致！';
      }
    }
  });

  // 监听注册表单的提交事件
  $("#form_reg").on("submit", function (e) {
    e.preventDefault();
    var data = {
      uname: $("#form_reg [name=uname]").val(),
      pwd: $("#form_reg [name=pwd]").val()
    }
    $.ajax({
      type: "POST",
      url: "/api/reguser",
      data: data,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        layer.msg('注册成功！');
        // 重定向到登录页面：采用模拟点击的方式
        $("#link_login").click();
      }
    });
  });

  // 监听登录表单的提交事件
  $("#form_login").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "/api/login",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        layer.msg("登录成功！");
        console.log(res.token);
        // 将登录成功得到的 token 字符串，保存到localStorage中
        localStorage.setItem('token', res.token);
        // 重定向至平台首页
        location.href = '/Telemedicine/client/index.html'
      }
    });
  });
})