$(function () {

  // 从 layui 中获取 layer 对象
  var layer = layui.layer;

  // 调用 getUserInfo 获取用户基本信息
  getUserInfo();

  // 退出
  $("#btnLogout").on("click", function () {
    // 提示用户是否确认退出
    layer.confirm('是否退出登录?', {
      icon: 3,
      title: '提示'
    }, function (index) {
      // 清空本地存储的 token
      localStorage.removeItem('token');
      // 重定向至登录页面
      location.href = '/Telemedicine/client/login.html';

      // 关闭 confirm 询问框
      layer.close(index);
    });
  });
})


// 获取用户的基本信息
function getUserInfo() {
  $.ajax({
    type: "GET",
    url: "/my/userinfo",
    // 请求头
    // headers: {
    //   Authorization: localStorage.getItem('token') || ''
    // },
    success: function (res) {
      if (res.status !== 0) {
        return layer.msg('获取用户信息失败！');
      }
      // 渲染用户的头像
      renderAvatar(res.data);
    },
    /* complete: function (res) {
      if (res.responseJSON.status !== 0) {
        // 清空 token
        localStorage.removeItem('token');
        // 重定向到登录页面
        location.href = '/Telemedicine/client/login.html'
      }
    } */
  });
}

// 渲染用户头像的函数
function renderAvatar(user) {
  var name = user.uname;
  $("#welcome").html('欢迎&nbsp;' + name);
  // 按需渲染用户的头像
  if (user.avatar !== null) {
    // 渲染图片头像
    $(".layui-nav-img").attr("src", user.avatar).show();
    $(".text-avatar").hide();
  } else {
    // 渲染文本头像
    $(".layui-nav-img").hide();
    var first = name[0].toUpperCase();
    $(".text-avatar").html(first).show();
  }
}