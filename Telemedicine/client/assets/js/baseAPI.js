// 使用 jQuery 发起 Ajax 请求时调用
$.ajaxPrefilter(function (options) {
  // console.log(options.url);
  // 在真正请求前拼接请求根路径
  options.url = 'http://127.0.0.1:3008' + options.url;

  // 统一为有权限的接口设置 headers 请求头
  if (options.url.indexOf('/my/') !== -1) {
    options.headers = {
      Authorization: localStorage.getItem('token') || ''
    }
  }

  // 全局统一挂载 complete 回调函数
  options.complete = function (res) {
    if (res.responseJSON.status !== 0) {
      // 清空 token
      localStorage.removeItem('token');
      // 重定向到登录页面
      location.href = '/Telemedicine/client/login.html'
    }
  }
})