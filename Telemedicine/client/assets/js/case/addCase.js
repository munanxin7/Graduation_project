$(function () {
  var layer = layui.layer;

  // 点击选择病理切片
  $("#btnChooseImage").on("click", function () {
    $("#section").click();
  });

  var files = null;
  // 将选择的图片渲染至页面中
  $("#section").on("change", function (e) {
    // 获取到的文件的列表数据
    files = e.target.files;
    if (files.length === 0) {
      return layer.msg('请选择至少一张病理切片！');
    }
    // 根据文件创建对象的 URL 地址
    var imgURL = URL.createObjectURL(files[0]);
    // 为预览图片设置 src
    $("#prevImg").attr("src", imgURL);
  });

  // 重置
  $("#reset").on('click', function () {
    $("#prevImg").attr("src", '');
  });

  // 提交表单
  $("#form-pub").on("submit", function (e) {
    e.preventDefault();
    // 基于 form 表单，快速创建一个 FormData 对象
    var fd = new FormData($(this)[0]);
    // 将上传的病理切片输出为一个文件对象
    fd.append('section', files[0]);


    $.ajax({
      type: "POST",
      url: "/my/addCase",
      data: fd,
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        layer.msg(res.message);
      }
    });
  })
})