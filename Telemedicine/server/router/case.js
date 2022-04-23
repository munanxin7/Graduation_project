// 导入 express 模块
const express = require('express');

// 创建路由实例
const router = express.Router();

// 导入路由处理模块
const case_handler = require('../router_handler/case');

// 导入解析表单数据的中间件
const multer = require('multer');
const path = require('path');

// 创建 multer 的实例对象，并且通过 dest 属性指定文件的存放路径
const upload = multer({
  dest: path.join(__dirname, '../uploads')
});

// 导入验证规则对象的中间件
const expressJoi = require('@escook/express-joi');
const {
  addCase_schema,
  handleCase_schema
} = require('../schema/case');

// 在这里挂载路由
// 发起新会诊的路由
router.post('/addCase', upload.single('section'), expressJoi(addCase_schema), case_handler.addCase);
// 获取待会诊病例的路由
router.get('/getCase', case_handler.getCase);
// 根据 id 获取病例详情的路由
router.get('/case/:id', case_handler.getCaseInfo);
// 根据 id 处理远程会诊的路由
router.post('/handleCase', expressJoi(handleCase_schema), case_handler.handleCase);

module.exports = router;