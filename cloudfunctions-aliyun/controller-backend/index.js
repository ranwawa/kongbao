/**
 * @file 后端相关接口
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/14 11:55
 */
const CustomerOrder = require('./customer-order');
const fileMap = {
  'customer-order': CustomerOrder,
};
const NOT_FOUND = { code: 404, msg: '未找到访问的接口' };
exports.main = async (event, context) => {
  const { action = '', data = {}, uniIdToken = '' } = event;
  const { APPID } = context;
  const [ fileName, funcName ] = action.split('/');
  const fileClass = fileMap[fileName];
  if (!fileName || !fileClass || !funcName) {
    return NOT_FOUND;
  }
  const instance = new fileClass(APPID, uniIdToken);
  if (!instance[funcName]) {
    return NOT_FOUND;
  }
  if (instance.checkToken) {
    const res = await instance.checkToken();
    return res.code !== 0
      ? res
      : await instance[funcName](data, event, context);
  }
  return await instance[funcName](data, event, context);
};
