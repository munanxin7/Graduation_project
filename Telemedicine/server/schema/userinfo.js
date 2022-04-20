// 导入验证规则的包
const joi = require('joi');

// 定义邮箱的验证规则
const email = joi.string().email().required();
// 定义手机号的验证规则
const phone = joi.string().pattern(/^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/).required();
// 定义头像的验证规则
const avatar = joi.string().dataUri().required();

// 验证规则对象 —— 用户基本信息
exports.update_userinfo_schema = {
  body: {
    email,
    phone
  }
}

// 验证规则对象 —— 更新头像
exports.update_avatar_schema = {
  body: {
    avatar
  }
}