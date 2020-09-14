/**
 * @file 第3方回调相关的云函数,仅处理回调逻辑
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/14 10:15
 */
const callBackMap = require('./callback-map');
exports.main = async (event, context) => {
  // path 云函数url化,请求的路径
  // body 传递过来的参数
  const { path = '', body = '' } = event;
  if (!path) {
    return { success: false };
  }
  return callBackMap[path] ? callBackMap[path](body) : { success: false };
};
