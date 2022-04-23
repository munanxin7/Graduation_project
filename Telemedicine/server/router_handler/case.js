// 导入数据库操作模块
const db = require('../db/index');

// 发布新会诊的处理函数
exports.addCase = (req, res) => {
  // 判断是否上传病理切片
  if (!req.file || req.file.fieldname !== 'section') {
    return res.cc('病理切片为必选参数！');
  }

  // 发布会诊
  const path = require('path');
  const caseInfo = {
    // 患者的性别、年龄、地址、病情描述
    ...req.body,
    // 病理切片在服务端的存放路径
    section: path.join('/uploads', req.file.filename),
    // 发布时间
    sub_date: new Date(),
    // 发布者的id
    p_id: req.user.id
  }

  // 定义发布会诊的 SQL 语句
  const sql = `insert into telm_case set ?`;
  db.query(sql, caseInfo, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    if (results.affectedRows !== 1) {
      return res.cc('发布会诊失败！');
    }
    res.cc('发布会诊成功！', 0);
  });
}

// 获取待处理的病理数据的处理函数
exports.getCase = (req, res) => {
  const pagenum = req.query.pagenum;
  const pagesize = req.query.pagesize;
  const begin = (pagenum - 1) * pagesize;
  var total = 0;
  // 定义查询分类列表数据的 SQL 语句
  const sql = `select * from telm_case where is_delete=0 and is_handle=0 order by id limit ` + begin + `,` + pagesize;

  // 定义获取总条数的 SQL 语句
  const totalSql = `select * from telm_case where is_delete=0 and is_handle=0`;
  db.query(totalSql, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    total = results.length;
  })
  db.query(sql, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    res.send({
      status: 0,
      message: '获取病例数据成功！',
      data: results,
      total: total
    })
  })


}

// 根据 id 获取病例详细信息的处理函数
exports.getCaseInfo = (req, res) => {
  // 定义根据 id 获取病例详细信息的 SQL 语句
  const sql = `select * from telm_case where id=?`;
  db.query(sql, req.params.id, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    if (results.length !== 1) {
      return res.cc('获取病例详细信息失败！');
    }
    res.send({
      status: 0,
      message: '获取文章病例详细信息成功！',
      data: results[0]
    });
  });
}

// 根据 id 处理远程会诊的处理函数
exports.handleCase = (req, res) => {
  // 定义诊断的 SQL 语句
  const sql = `update telm_case set h_id=?,diagnosis=?,is_handle=1 where id=?`;
  db.query(sql, [req.user.id, req.body.diagnosis, req.body.id], (err, results) => {
    if (err) {
      return res.cc(err);
    }
    if (results.affectedRows !== 1) {
      return res.cc('诊断失败！');
    }
    res.cc('成功诊断', 0);
  })
}