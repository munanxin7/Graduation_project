// 导入 mysql 模块
const mysql = require('mysql');

// 创建数据库连接池
const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '123321@yyD',
  database: 'tele_medicine_db'
});

// 测试是否连接成功
/* db.query('select 1', (err, results) => {
  if (err) {
    return console.log(err.message);
  }
  console.log('连接成功');
}) */

// 向外共享 db 数据库连接对象
module.exports = db;