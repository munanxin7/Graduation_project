$(function () {
  var layer = layui.layer;
  // 获取裁剪区域的 DOM 元素
  var $image = $('#image');
  // 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }

  // 创建裁剪区域
  $image.cropper(options);

  // 为上传按钮绑定点击事件
  $("#btnChooseImage").on("click", function () {
    $("#file").click();
  });

  // 为文件选择框绑定 change 事件
  $("#file").on("change", function (e) {
    // 获取用户选择的文件
    var filelist = e.target.files;
    if (filelist.length === 0) {
      return layer.msg('请选择照片！');
    }
    // 拿到用户选择的文件
    var file = e.target.files[0];
    // 将文件，转化为路径
    var imgURL = URL.createObjectURL(file);
    // 重新初始化裁剪区域
    $image.cropper('destroy').attr('src', imgURL).cropper(options);
  });

  // 上传图片
  $("#btnUpload").on("click", function () {
    // 拿到用户裁剪之后的头像
    var dataURL = $image.cropper('getCroppedCanvas', {
      width: 100,
      height: 100
    }).toDataURL('image/png');
    // 调用接口，把头像上传到服务器
    $.ajax({
      type: "POST",
      url: "/my/update_avatar",
      data: {
        avatar: dataURL
      },
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        layer.msg(res.message);
        window.parent.getUserInfo();
      }
    });
  });
})