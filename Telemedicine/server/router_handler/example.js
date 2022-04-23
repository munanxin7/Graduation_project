// 导入数据库操作模块
const db = require('../db/index');

// 查询所有被公开的会诊的处理函数
exports.getExampleList = (req, res) => {
  const pagenum = req.query.pagenum;
  const pagesize = req.query.pagesize;
  const begin = (pagenum - 1) * pagesize;
  // 定义 SQL 语句
  const sql = `select * from telm_case where is_pub=1`;
  db.query(sql, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    res.send({
      status: 0,
      message: '获取案例数据成功！',
      data: results,
      total: results.length
    })
  })
}