// 导入验证规则的包
const joi = require('joi');

// 定义性别的验证规则 
const gender = joi.string().valid('男', '女').required();
// 定义年龄的验证规则
const age = joi.number().min(1).max(200).required();
// 定义地址的验证规则
const address = joi.string().required();
// 定义病情描述的验证规则
const describe = joi.string().required();
// 定义诊断意见的验证规则
const diagnosis = joi.string().required();
// 定义 id 的验证规则
const id = joi.number().required();

// 验证规则对象 —— 发起会诊
exports.addCase_schema = {
  body: {
    gender,
    age,
    address,
    describe
  }
}

// 验证规则对象 —— 诊断
exports.handleCase_schema = {
  body: {
    diagnosis,
    id
  }
}