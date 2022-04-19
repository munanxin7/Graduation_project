// 使用 jQuery 发起 Ajax 请求时调用
$.ajaxPrefilter(function (options) {
  // console.log(options.url);
  // 在真正请求前拼接请求根路径
  options.url = 'http://127.0.0.1:3008' + options.url;
})