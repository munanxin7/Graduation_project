// 导入验证规则的包
const joi = require('joi');

// 定义用户名和密码的验证规则
const uname = joi.string().min(2).max(6).required();
const pwd = joi.string().pattern(/^[\S]{6,12}$/).required();


// 验证规则对象 —— 注册、登录
exports.reg_login_schema = {
  body: {
    uname,
    pwd
  }
}

// 验证规则对象 —— 重置密码
exports.update_password_schema = {
  body: {
    oldPwd: pwd,
    newPwd: joi.not(joi.ref('oldPwd')).concat(pwd)
  }
}