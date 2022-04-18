// 导入 express 模块
const express = require('express');

// 创建路由实例
const router = express.Router();

// 导入路由处理函数
const router_handler = require('../router_handler/user');

// 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi');
// 导入验证规则对象
const {
  reg_login_schema
} = require('../schema/user')
// 在这里挂载路由
// 注册
router.post('/reguser', expressJoi(reg_login_schema), router_handler.reguser);
// 登录
router.post('/login', expressJoi(reg_login_schema), router_handler.login);

module.exports = router;