// 导入 express 模块
const express = require('express');

// 创建 express 实例
const app = express();

// 导入并配置 cors 中间件
const cors = require('cors');
app.use(cors());

// 导入验证规则的包
const joi = require('joi');
// 配置解析表单数据的中间件
app.use(express.urlencoded({
  extended: false
}));
// 托管静态资源文件
app.use('/uploads', express.static('./uploads'));

// 回调函数：处理成功或错误信息
app.use((req, res, next) => {
  // status 默认值为1，表示失败的情况
  // err 的值可能是一个错误对象，也可能是一个错误的描述字符串
  res.cc = function (err, status = 1) {
    res.send({
      status,
      message: err instanceof Error ? err.message : err
    });
  }
  next();
});

// 配置解析 token 的中间件
const expressJWT = require('express-jwt');
const config = require('./config');

app.use(expressJWT({
  secret: config.jwtSecretKey,
  algorithms: ['HS256']
}).unless({
  path: [/^\/api/]
}));

// 导入并使用用户路由模块
const userRouter = require('./router/user');
app.use('/api', userRouter);

// 导入并使用用户信息管理路由模块
const userinfoRouter = require('./router/userinfo');
app.use('/my', userinfoRouter);

// 导入并使用会诊路由模块
const caseRouter = require('./router/case');
app.use('/my', caseRouter);

// 导入并使用历史路由模块
const historyRouter = require('./router/history');
app.use('/my', historyRouter);

// 定义错误级别的中间件
app.use((err, req, res, next) => {
  // 验证失败导致的错误
  if (err instanceof joi.ValidationError) {
    return res.cc(err);
  }
  // 身份认证失败错误
  if (err.name === 'UnauthorizedError') {
    return res.cc('身份认证失败！')
  }
  // 未知的错误
  return res.cc(err);
})

// 调用 app.listen 方法，指定端口号并启动 web 服务器
app.listen(3008, () => {
  console.log('express server running at http://127.0.0.1:3008');
});