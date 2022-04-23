// 导入数据库操作模块
const db = require('../db/index');

// 查询我发布的未被处理的会诊的处理函数
exports.getUnhandleHistory = (req, res) => {
  const pagenum = req.query.pagenum;
  const pagesize = req.query.pagesize;
  const begin = (pagenum - 1) * pagesize;
  var total = 0;
  // 定义查询分类列表数据的 SQL 语句
  const sql = `select * from telm_case where is_delete=0 and is_handle=0 and p_id=? order by id limit ` + begin + `,` + pagesize;

  // 定义获取总条数的 SQL 语句
  const totalSql = `select * from telm_case where is_delete=0 and is_handle=0 and p_id=?`;
  db.query(totalSql, req.user.id, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    total = results.length;
  })
  db.query(sql, req.user.id, (err, results) => {
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

// 查询我发布的已被处理未被确认的会诊的处理函数
exports.getHandleHistory = (req, res) => {
  const pagenum = req.query.pagenum;
  const pagesize = req.query.pagesize;
  const begin = (pagenum - 1) * pagesize;
  var total = 0;
  // 定义查询分类列表数据的 SQL 语句
  const sql = `select * from telm_case where is_delete=0 and is_handle=1 and is_comfirm=0 and p_id=? order by id limit ` + begin + `,` + pagesize;

  // 定义获取总条数的 SQL 语句
  const totalSql = `select * from telm_case where is_delete=0 and is_handle=1 and is_comfirm=0 and p_id=?`;
  db.query(totalSql, req.user.id, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    total = results.length;
  })
  db.query(sql, req.user.id, (err, results) => {
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

// 修改未被处理的会诊的处理函数
exports.updateCase = (req, res) => {
  // 判断是否上传病理切片
  if (!req.file || req.file.fieldname !== 'section') {
    return res.cc('病理切片为必选参数！');
  }
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
  // 定义修改诊断的 SQL 语句
  const sql = `update telm_case set ? where id=?`;
  db.query(sql, [caseInfo, req.params.id], (err, results) => {
    if (err) {
      return res.cc(err);
    }
    if (results.affectedRows !== 1) {
      return res.cc('修改病例失败！');
    }
    res.cc('修改成功！', 0);
  })
}

// 删除为被处理的会诊的处理函数
exports.deleteCase = (req, res) => {
  // 定义根据 id 删除会诊的 SQL 语句
  const sql = `update telm_case set is_delete=1 where id=?`;
  db.query(sql, req.params.id, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    if (results.affectedRows !== 1) {
      return res.cc('删除会诊失败！');
    }
    res.cc('删除成功！', 0);
  })
}

// 确认已被处理的会诊的处理函数
exports.confirmCase = (req, res) => {
  // 定义确认的 SQL 语句
  const sql = `update telm_case set is_comfirm=1 where id=?`;
  db.query(sql, req.params.id, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    if (results.affectedRows !== 1) {
      return res.cc('确认失败！');
    }
    res.cc('确认成功！', 0);
  })
}

// 查询我处理的会诊的处理函数
exports.getMyHandle = (req, res) => {
  const pagenum = req.query.pagenum;
  const pagesize = req.query.pagesize;
  const begin = (pagenum - 1) * pagesize;
  var total = 0;
  // 定义查询分类列表数据的 SQL 语句
  const sql = `select * from telm_case where is_delete=0 and is_handle=1 and h_id=? order by id limit ` + begin + `,` + pagesize;

  // 定义获取总条数的 SQL 语句
  const totalSql = `select * from telm_case where is_delete=0 and is_handle=1 and h_id=?`;
  db.query(totalSql, req.user.id, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    total = results.length;
  })
  db.query(sql, req.user.id, (err, results) => {
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