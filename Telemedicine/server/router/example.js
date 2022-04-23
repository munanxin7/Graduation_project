// 导入 express 模块
const express = require('express');

// 创建路由实例
const router = express.Router();

// 导入路由处理模块
const example_handler = require("../router_handler/example");

// 在这里挂载路由
// 获取所有被公开的会诊
router.get('/example', example_handler.getExampleList);

module.exports=router;