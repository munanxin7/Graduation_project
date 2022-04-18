// 导入验证规则的包
const joi = require('joi');

// 定义用户名和密码的验证规则
const uname = joi.string().alphanum().min(3).max(10).required();
const pwd = joi.string().pattern(/^[\S]{6,12}$/).required();

// 验证规则对象 —— 注册、登录
exports.reg_login_schema = {
  body: {
    uname,
    pwd
  }
}