/**
 * @file 第3方回调相关的云函数,仅处理回调逻辑
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/14 10:15
 */
const { mainFunc } = require("api");
const AliHuoCang = require("./cb-ali-huocang");
const PaysApi = require("./cb-pays-api");

const fileMap = {
  "pays-api": PaysApi,
  "ali-huocang": AliHuoCang,
};
exports.main = async (event, context) => {
  // path 云函数url化,请求的路径
  // body 传递过来的参数
  event.action = event.path;
  event.data = event.body;
  return await mainFunc(event, context, fileMap);
};
