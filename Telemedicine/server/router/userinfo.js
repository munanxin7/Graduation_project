// 导入 express 模块
const express = require('express');

// 创建路由实例
const router = express.Router();

// 导入路由处理函数模块
const userinfo_handler = require('../router_handler/userinfo');

// 导入验证数据合法性的中间件
const expressJoi = require('@escook/express-joi');
// 导入需要的验证规则对象
const {
  update_userinfo_schema,
  update_avatar_schema
} = require('../schema/userinfo');
const {
  update_password_schema
} = require('../schema/user')

// 在这里挂载路由
// 获取用户的信息
router.get('/userinfo', userinfo_handler.getUserInfo);
// 修改用户信息
router.post('/userinfo', expressJoi(update_userinfo_schema), userinfo_handler.updateUserInfo);
// 重置用户密码
router.post('/updatepwd', expressJoi(update_password_schema), userinfo_handler.updatePassword);
// 修改头像
router.post('/update_avatar', expressJoi(update_avatar_schema), userinfo_handler.updateAvatar)

module.exports = router;