// 导入 express 模块
const express = require('express');

// 创建路由实例
const router = express.Router();

// 导入路由处理模块
const history_handler = require('../router_handler/history');

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
} = require('../schema/case');

// 在这里挂载路由
// 查看我提交的待处理会诊的路由
router.get('/subhistory/unhandle', history_handler.getUnhandleHistory);
// 根据 id 查看会诊的路由
// 查看我提交的已处理的路由
router.get('/subhistory/handle', history_handler.getHandleHistory);
// 修改会诊的路由
router.post('/updateCase/:id', upload.single('section'), expressJoi(addCase_schema), history_handler.updateCase);
// 删除会诊的路由
router.get('/deleteCase/:id', history_handler.deleteCase);
// 确认被处理的会诊的路由
router.get("/confirmCase/:id", history_handler.confirmCase);
// 查看我处理的会诊的路由
router.get('/hanlerHistory', history_handler.getMyHandle);
module.exports = router;