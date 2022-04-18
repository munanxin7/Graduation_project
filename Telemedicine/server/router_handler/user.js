// 用户相关的路由处理函数

// 导入数据库操作模块
const db = require("../db/index");
// 导入加密包
const bcrypt = require('bcryptjs');
// 导入生成 token 的包
const jwt = require('jsonwebtoken');
// 导入全局配置文件
const config = require('../config');


// 注册的处理函数
exports.reguser = (req, res) => {
  // 获取客户端提交到服务器的用户信息
  const userinfo = req.body;
  // 定义 SQL 语句，查询用户名是否被使用
  const sql = `select * from telm_user where uname=?`;
  db.query(sql, userinfo.uname, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    if (results.length > 0) {
      return res.cc('用户名被占用，请更换其他用户名！');
    }

    // 用户密码加密
    userinfo.pwd = bcrypt.hashSync(userinfo.pwd, 10);

    // 向数据库中插入新用户
    const sql = `insert into telm_user set ?`;
    db.query(sql, {
      uname: userinfo.uname,
      pwd: userinfo.pwd
    }, (err, results) => {
      if (err) {
        return res.cc(err);
      }
      if (results.affectedRows !== 1) {
        return res.cc('注册新用户失败，请稍后在试！');
      }
      res.cc('注册成功！', 0);
    });
  });
}


// 登录的处理函数
exports.login = (req, res) => {
  // 接收表单的数据
  const userinfo = req.body;
  // 定义 SQL 语句
  const sql = `select * from telm_user where uname=?`;
  // 执行 SQL 语句
  db.query(sql, userinfo.uname, (err, results) => {
    // 执行 SQL 语句失败
    if (err) {
      return res.cc(err);
    }
    // 执行 SQL 语句成功，但是获取到的数据条数不等于1
    if (results.length !== 1) {
      return res.cc('该用户不存在，请先注册!');
    }
    // 判读面是否正确
    const compareResult = bcrypt.compareSync(userinfo.pwd, results[0].pwd);
    if (!compareResult) {
      return res.cc('密码错误，请重新输入');
    }

    // 生成 token 字符串
    const user = {
      ...results[0],
      pwd: '',
      avatar: ''
    };
    // 对用户的信息进行加密，生成 token 字符串
    const tokenStr = jwt.sign(user, config.jwtSecretKey, {
      expiresIn: config.expiresIn
    });

    // 将 token 响应给客户端
    res.send({
      status: 0,
      message: '登录成功',
      token: 'Bearer ' + tokenStr
    });
  });
  // res.send('ok');
}